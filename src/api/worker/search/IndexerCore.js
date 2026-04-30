"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.IndexerCore = void 0;
var Tokenizer_1 = require("./Tokenizer");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var EntityUtils_1 = require("../../common/utils/EntityUtils");
var IndexUtils_1 = require("./IndexUtils");
var CancelledError_1 = require("../../common/error/CancelledError");
var ProgrammingError_1 = require("../../common/error/ProgrammingError");
var InvalidDatabaseStateError_1 = require("../../common/error/InvalidDatabaseStateError");
var SearchIndexEncoding_1 = require("./SearchIndexEncoding");
var Indexer_1 = require("./Indexer");
var tutanota_crypto_1 = require("@tutao/tutanota-crypto");
var tutanota_crypto_2 = require("@tutao/tutanota-crypto");
var SEARCH_INDEX_ROW_LENGTH = 1000;
/**
 * Class which executes operation on the indexing tables.
 *
 * Some functions return null instead of Promise because
 * IndexedDB transaction usually lives only till the end
 * of the event loop iteration and promise scheduling
 * somehow manages to break that and commit transaction
 * too early.
 */
var IndexerCore = /** @class */ (function () {
    function IndexerCore(db, queue, browserData) {
        this._currentWriteOperation = null;
        this.queue = queue;
        this.db = db;
        this._isStopped = false;
        this._promiseMapCompat = (0, tutanota_utils_1.promiseMapCompat)(browserData.needsMicrotaskHack);
        this._needsExplicitIds = browserData.needsExplicitIDBIds;
        this._explicitIdStart = Date.now();
        this.resetStats();
    }
    /****************************************** Preparing the update ***********************************************/
    /**
     * Converts an instances into a map from words to a list of SearchIndexEntries.
     */
    IndexerCore.prototype.createIndexEntriesForAttributes = function (instance, attributes) {
        var _this = this;
        var indexEntries = attributes.map(function (attributeHandler) {
            if (typeof attributeHandler.value !== "function") {
                throw new ProgrammingError_1.ProgrammingError("Value for attributeHandler is not a function: " + JSON.stringify(attributeHandler.attribute));
            }
            var value = attributeHandler.value();
            var tokens = (0, Tokenizer_1.tokenize)(value);
            _this._stats.indexedBytes += (0, tutanota_utils_1.byteLength)(value);
            var attributeKeyToIndexMap = new Map();
            for (var index = 0; index < tokens.length; index++) {
                var token = tokens[index];
                if (!attributeKeyToIndexMap.has(token)) {
                    attributeKeyToIndexMap.set(token, {
                        id: instance._id instanceof Array ? instance._id[1] : instance._id,
                        attribute: attributeHandler.attribute.id,
                        positions: [index]
                    });
                }
                else {
                    (0, tutanota_utils_1.neverNull)(attributeKeyToIndexMap.get(token)).positions.push(index);
                }
            }
            return attributeKeyToIndexMap;
        });
        return (0, tutanota_utils_1.mergeMaps)(indexEntries);
    };
    /**
     * Encrypt search index entries created by {@link createIndexEntriesForAttributes} and put them into the {@param indexUpdate}.
     * @param id of the instance
     * @param ownerGroup of the instance
     * @param keyToIndexEntries map from search index keys (words which you can search for) to index entries
     * @param indexUpdate IndexUpdate for which {@code create} fields will be populated
     */
    IndexerCore.prototype.encryptSearchIndexEntries = function (id, ownerGroup, keyToIndexEntries, indexUpdate) {
        var _this = this;
        var encryptionTimeStart = (0, IndexUtils_1.getPerformanceTimestamp)();
        var listId = (0, EntityUtils_1.listIdPart)(id);
        var encInstanceId = (0, IndexUtils_1.encryptIndexKeyUint8Array)(this.db.key, (0, EntityUtils_1.elementIdPart)(id), this.db.iv);
        var encInstanceIdB64 = (0, tutanota_utils_1.uint8ArrayToBase64)(encInstanceId);
        var elementIdTimestamp = (0, EntityUtils_1.generatedIdToTimestamp)((0, EntityUtils_1.elementIdPart)(id));
        var encWordsB64 = [];
        keyToIndexEntries.forEach(function (value, indexKey) {
            var encWordB64 = (0, IndexUtils_1.encryptIndexKeyBase64)(_this.db.key, indexKey, _this.db.iv);
            encWordsB64.push(encWordB64);
            var encIndexEntries = (0, tutanota_utils_1.getFromMap)(indexUpdate.create.indexMap, encWordB64, function () { return []; });
            value.forEach(function (indexEntry) {
                return encIndexEntries.push({
                    entry: (0, IndexUtils_1.encryptSearchIndexEntry)(_this.db.key, indexEntry, encInstanceId),
                    timestamp: elementIdTimestamp
                });
            });
        });
        indexUpdate.create.encInstanceIdToElementData.set(encInstanceIdB64, {
            listId: listId,
            encWordsB64: encWordsB64,
            ownerGroup: ownerGroup
        });
        this._stats.encryptionTime += (0, IndexUtils_1.getPerformanceTimestamp)() - encryptionTimeStart;
    };
    /**
     * Process delete event before applying to the index.
     */
    IndexerCore.prototype._processDeleted = function (event, indexUpdate) {
        var _this = this;
        var encInstanceIdPlain = (0, IndexUtils_1.encryptIndexKeyUint8Array)(this.db.key, event.instanceId, this.db.iv);
        var encInstanceIdB64 = (0, tutanota_utils_1.uint8ArrayToBase64)(encInstanceIdPlain);
        var _a = (0, IndexUtils_1.typeRefToTypeInfo)(new tutanota_utils_1.TypeRef(event.application, event.type)), appId = _a.appId, typeId = _a.typeId;
        return this.db.dbFacade.createTransaction(true, [Indexer_1.ElementDataOS]).then(function (transaction) {
            return transaction.get(Indexer_1.ElementDataOS, encInstanceIdB64).then(function (elementData) {
                if (!elementData) {
                    return;
                }
                // We need to find SearchIndex rows which we want to update. In the ElementData we have references to the metadata and we can find
                // corresponding SearchIndex row in it.
                var metaDataRowKeysBinary = (0, tutanota_crypto_2.aes256Decrypt)(_this.db.key, elementData[1], true, false);
                // For every word we have a metadata reference and we want to update them all.
                var metaDataRowKeys = (0, SearchIndexEncoding_1.decodeNumbers)(metaDataRowKeysBinary);
                metaDataRowKeys.forEach(function (metaDataRowKey) {
                    // We add current instance into list of instances to delete for each word
                    var ids = (0, tutanota_utils_1.getFromMap)(indexUpdate["delete"].searchMetaRowToEncInstanceIds, metaDataRowKey, function () { return []; });
                    ids.push({
                        encInstanceId: encInstanceIdPlain,
                        appId: appId,
                        typeId: typeId,
                        timestamp: (0, EntityUtils_1.generatedIdToTimestamp)(event.instanceId)
                    });
                });
                indexUpdate["delete"].encInstanceIds.push(encInstanceIdB64);
            });
        });
    };
    /********************************************* Manipulating the state ***********************************************/
    IndexerCore.prototype.stopProcessing = function () {
        this._isStopped = true;
        this.queue.clear();
    };
    IndexerCore.prototype.isStoppedProcessing = function () {
        return this._isStopped;
    };
    IndexerCore.prototype.startProcessing = function () {
        this._isStopped = false;
    };
    IndexerCore.prototype.addBatchesToQueue = function (batches) {
        if (!this._isStopped) {
            this.queue.addBatches(batches);
        }
    };
    /*********************************************** Writing index update ***********************************************/
    /**
     * Apply populated {@param indexUpdate} to the database.
     */
    IndexerCore.prototype.writeIndexUpdate = function (dataPerGroup, indexUpdate) {
        var _this = this;
        return this._writeIndexUpdate(indexUpdate, function (t) { return _this._updateGroupDataIndexTimestamp(dataPerGroup, t); });
    };
    IndexerCore.prototype.writeIndexUpdateWithBatchId = function (groupId, batchId, indexUpdate) {
        var _this = this;
        return this._writeIndexUpdate(indexUpdate, function (t) { return _this._updateGroupDataBatchId(groupId, batchId, t); });
    };
    IndexerCore.prototype._writeIndexUpdate = function (indexUpdate, updateGroupData) {
        var _this = this;
        return this._executeOperation({
            transaction: null,
            transactionFactory: function () { return _this.db.dbFacade.createTransaction(false, [Indexer_1.SearchIndexOS, Indexer_1.SearchIndexMetaDataOS, Indexer_1.ElementDataOS, Indexer_1.MetaDataOS, Indexer_1.GroupDataOS]); },
            operation: function (transaction) {
                var startTimeStorage = (0, IndexUtils_1.getPerformanceTimestamp)();
                if (_this._isStopped) {
                    return Promise.reject(new CancelledError_1.CancelledError("mail indexing cancelled"));
                }
                return (_this._moveIndexedInstance(indexUpdate, transaction)
                    .thenOrApply(function () { return _this._deleteIndexedInstance(indexUpdate, transaction); })
                    .thenOrApply(function () { return _this._insertNewIndexEntries(indexUpdate, transaction); })
                    .thenOrApply(function (rowKeys) { return rowKeys && _this._insertNewElementData(indexUpdate, transaction, rowKeys); })
                    .thenOrApply(function () { return updateGroupData(transaction); })
                    .thenOrApply(function () {
                    return transaction.wait().then(function () {
                        _this._stats.storageTime += (0, IndexUtils_1.getPerformanceTimestamp)() - startTimeStorage;
                    });
                }) // a la catch(). Must be done in the next step because didReject is not invoked for the current Promise, only for the previous one.
                    // It's probably a bad idea to convert to the Promise first and then catch because it may do Promise.resolve() and this will schedule to
                    // the next event loop iteration and the context will be closed and it will be too late to abort(). Even worse, it will be commited to
                    // IndexedDB already and it will be inconsistent (oops).
                    .thenOrApply(tutanota_utils_1.noOp, function (e) {
                    try {
                        !transaction.aborted && transaction.abort();
                    }
                    catch (e) {
                        console.warn("abort has failed: ", e); // Ignore if abort has failed
                    }
                    throw e;
                })
                    .toPromise());
            },
            deferred: (0, tutanota_utils_1.defer)(),
            isAbortedForBackgroundMode: false
        });
    };
    IndexerCore.prototype._executeOperation = function (operation) {
        var _this = this;
        this._currentWriteOperation = operation;
        return operation.transactionFactory().then(function (transaction) {
            operation.transaction = transaction;
            operation
                .operation(transaction)
                .then(function (it) {
                _this._currentWriteOperation = null;
                operation.deferred.resolve();
                return it;
            })["catch"](function (e) {
                if (operation.isAbortedForBackgroundMode) {
                    console.log("transaction has been aborted because of background mode");
                }
                else {
                    if (env.mode !== "Test") {
                        console.log("rejecting operation with error", e);
                    }
                    operation.deferred.reject(e);
                }
            });
            return operation.deferred.promise;
        });
    };
    IndexerCore.prototype.onVisibilityChanged = function (visible) {
        var operation = this._currentWriteOperation;
        if (!visible && operation && operation.transaction) {
            console.log("abort indexedDb transaction operation because background mode");
            try {
                (0, tutanota_utils_1.neverNull)(operation.transaction).abort();
            }
            catch (e) {
                console.log("Error when aborting on visibility change", e);
            }
            operation.isAbortedForBackgroundMode = true;
        }
        if (visible && operation) {
            console.log("restart indexedDb transaction operation after background mode");
            operation.isAbortedForBackgroundMode = false;
            this._executeOperation(operation);
        }
    };
    IndexerCore.prototype._moveIndexedInstance = function (indexUpdate, transaction) {
        this._cancelIfNeeded();
        if (indexUpdate.move.length === 0)
            return tutanota_utils_1.PromisableWrapper.from(undefined); // keep transaction context open (only for Safari)
        var promise = Promise.all(indexUpdate.move.map(function (moveInstance) {
            return transaction.get(Indexer_1.ElementDataOS, moveInstance.encInstanceId).then(function (elementData) {
                if (elementData) {
                    elementData[0] = moveInstance.newListId;
                    transaction.put(Indexer_1.ElementDataOS, moveInstance.encInstanceId, elementData);
                }
            });
        })).then(tutanota_utils_1.noOp);
        return tutanota_utils_1.PromisableWrapper.from(promise);
    };
    /**
     * Apply "delete" updates to the database
     * @private
     */
    IndexerCore.prototype._deleteIndexedInstance = function (indexUpdate, transaction) {
        var _this = this;
        this._cancelIfNeeded();
        if (indexUpdate["delete"].searchMetaRowToEncInstanceIds.size === 0)
            return null; // keep transaction context open
        var deleteElementDataPromise = Promise.all(indexUpdate["delete"].encInstanceIds.map(function (encInstanceId) { return transaction["delete"](Indexer_1.ElementDataOS, encInstanceId); }));
        // For each word we have list of instances we want to remove
        return Promise.all(Array.from(indexUpdate["delete"].searchMetaRowToEncInstanceIds).map(function (_a) {
            var metaRowKey = _a[0], encInstanceIds = _a[1];
            return _this._deleteSearchIndexEntries(transaction, metaRowKey, encInstanceIds);
        }))
            .then(function () { return deleteElementDataPromise; })
            .then(tutanota_utils_1.noOp);
    };
    /**
     * Remove all {@param instanceInfos} from the SearchIndex entries and metadata entreis specified by the {@param metaRowKey}.
     * @private
     */
    IndexerCore.prototype._deleteSearchIndexEntries = function (transaction, metaRowKey, instanceInfos) {
        var _this = this;
        this._cancelIfNeeded();
        // Collect hashes of all instances we want to delete to check it faster later
        var encInstanceIdSet = new Set(instanceInfos.map(function (e) { return (0, tutanota_utils_1.arrayHash)(e.encInstanceId); }));
        return transaction.get(Indexer_1.SearchIndexMetaDataOS, metaRowKey).then(function (encMetaDataRow) {
            if (!encMetaDataRow) {
                // already deleted
                return;
            }
            var metaDataRow = (0, IndexUtils_1.decryptMetaData)(_this.db.key, encMetaDataRow);
            // add meta data to set to only update meta data once when deleting multiple instances
            var metaDataEntriesSet = new Set();
            instanceInfos.forEach(function (info) {
                // For each instance we find SearchIndex row it belongs to by timestamp
                var entryIndex = _this._findMetaDataEntryByTimestamp(metaDataRow, info.timestamp, info.appId, info.typeId);
                if (entryIndex === -1) {
                    console.warn("could not find MetaDataEntry, info:", info, "rows: ", metaDataRow.rows.map(function (r) { return JSON.stringify(r); }));
                }
                else {
                    metaDataEntriesSet.add(metaDataRow.rows[entryIndex]);
                }
            });
            // For each SearchIndex row we need to update...
            var updateSearchIndex = _this._promiseMapCompat(Array.from(metaDataEntriesSet), function (metaEntry) {
                return transaction.get(Indexer_1.SearchIndexOS, metaEntry.key).then(function (indexEntriesRow) {
                    if (!indexEntriesRow)
                        return;
                    // Find all entries we need to remove by hash of the encrypted ID
                    var rangesToRemove = [];
                    (0, SearchIndexEncoding_1.iterateBinaryBlocks)(indexEntriesRow, function (block, start, end) {
                        if (encInstanceIdSet.has((0, tutanota_utils_1.arrayHash)((0, IndexUtils_1.getIdFromEncSearchIndexEntry)(block)))) {
                            rangesToRemove.push([start, end]);
                        }
                    });
                    if (rangesToRemove.length === 0) {
                        return;
                    }
                    else if (metaEntry.size === rangesToRemove.length) {
                        metaEntry.size = 0;
                        return transaction["delete"](Indexer_1.SearchIndexOS, metaEntry.key);
                    }
                    else {
                        var trimmed = (0, SearchIndexEncoding_1.removeBinaryBlockRanges)(indexEntriesRow, rangesToRemove);
                        metaEntry.size -= rangesToRemove.length;
                        return transaction.put(Indexer_1.SearchIndexOS, metaEntry.key, trimmed);
                    }
                });
            });
            return updateSearchIndex.thenOrApply(function () {
                metaDataRow.rows = metaDataRow.rows.filter(function (r) { return r.size > 0; });
                if (metaDataRow.rows.length === 0) {
                    return transaction["delete"](Indexer_1.SearchIndexMetaDataOS, metaDataRow.id);
                }
                else {
                    return transaction.put(Indexer_1.SearchIndexMetaDataOS, null, (0, IndexUtils_1.encryptMetaData)(_this.db.key, metaDataRow));
                }
            }).value;
        });
    };
    IndexerCore.prototype._insertNewElementData = function (indexUpdate, transaction, encWordToMetaRow) {
        var _this = this;
        this._cancelIfNeeded();
        if (indexUpdate.create.encInstanceIdToElementData.size === 0)
            return null; // keep transaction context open (only in Safari)
        var promises = [];
        indexUpdate.create.encInstanceIdToElementData.forEach(function (elementDataSurrogate, b64EncInstanceId) {
            var metaRows = elementDataSurrogate.encWordsB64.map(function (w) { return encWordToMetaRow[w]; });
            var rowKeysBinary = new Uint8Array((0, SearchIndexEncoding_1.calculateNeededSpaceForNumbers)(metaRows));
            (0, SearchIndexEncoding_1.encodeNumbers)(metaRows, rowKeysBinary);
            var encMetaRowKeys = (0, tutanota_crypto_1.aes256Encrypt)(_this.db.key, rowKeysBinary, tutanota_crypto_2.random.generateRandomData(tutanota_crypto_2.IV_BYTE_LENGTH), true, false);
            promises.push(transaction.put(Indexer_1.ElementDataOS, b64EncInstanceId, [elementDataSurrogate.listId, encMetaRowKeys, elementDataSurrogate.ownerGroup]));
        });
        return Promise.all(promises);
    };
    IndexerCore.prototype._insertNewIndexEntries = function (indexUpdate, transaction) {
        var _this = this;
        this._cancelIfNeeded();
        var keys = __spreadArray([], indexUpdate.create.indexMap.keys(), true);
        var encWordToMetaRow = {};
        var result = this._promiseMapCompat(keys, function (encWordB64) {
            var encryptedEntries = (0, tutanota_utils_1.neverNull)(indexUpdate.create.indexMap.get(encWordB64));
            return _this._putEncryptedEntity(indexUpdate.typeInfo.appId, indexUpdate.typeInfo.typeId, transaction, encWordB64, encWordToMetaRow, encryptedEntries);
        }, {
            concurrency: 2
        }).value;
        return result instanceof Promise ? result.then(function () { return encWordToMetaRow; }) : null;
    };
    IndexerCore.prototype._putEncryptedEntity = function (appId, typeId, transaction, encWordB64, encWordToMetaRow, encryptedEntries) {
        var _this = this;
        this._cancelIfNeeded();
        if (encryptedEntries.length <= 0) {
            return null;
        }
        return this._getOrCreateSearchIndexMeta(transaction, encWordB64)
            .then(function (metaData) {
            encryptedEntries.sort(function (a, b) { return a.timestamp - b.timestamp; });
            var writeResult = _this._writeEntries(transaction, encryptedEntries, metaData, appId, typeId);
            return writeResult.thenOrApply(function () { return metaData; }).value;
        })
            .then(function (metaData) {
            var columnSize = metaData.rows.reduce(function (result, metaDataEntry) { return result + metaDataEntry.size; }, 0);
            _this._stats.writeRequests += 1;
            _this._stats.largestColumn = columnSize > _this._stats.largestColumn ? columnSize : _this._stats.largestColumn;
            _this._stats.storedBytes += encryptedEntries.reduce(function (sum, e) { return sum + e.entry.length; }, 0);
            encWordToMetaRow[encWordB64] = metaData.id;
            return transaction.put(Indexer_1.SearchIndexMetaDataOS, null, (0, IndexUtils_1.encryptMetaData)(_this.db.key, metaData));
        });
    };
    /**
     * Insert {@param entries} into the database for the corresponding {@param metaData}.
     * Metadata entries for each type are sorted from oldest to newest. Each metadata entry has oldest element timestamp. Timestamps of newer entries make a
     * time border for the newest. Timestamp for entry is considered fixed (unless it's the first entry).
     * The strategy is following:
     * First, try to find matching row by the oldest id of the entries we want to insert.
     * If we've found one, put everything that matches time frame of this row into it (it's bounded by the next row, if present). Put the rest into newer
     * rows.
     * If we didn't find one, we may try to extend the oldest row, because it's not bounded by the other row.
     * When we append something to the row, we check if its size would exceed {@link SEARCH_INDEX_ROW_LENGTH}. If it is, we do splitting,
     * {@see _appendIndexEntriesToRow}.
     * @private
     */
    IndexerCore.prototype._writeEntries = function (transaction, entries, metaData, appId, typeId) {
        var _this = this;
        if (entries.length === 0) {
            // Prevent IDB timeouts in Safari casued by Promise.resolve()
            return tutanota_utils_1.PromisableWrapper.from(undefined);
        }
        var oldestTimestamp = entries[0].timestamp;
        var indexOfMetaEntry = this._findMetaDataEntryByTimestamp(metaData, oldestTimestamp, appId, typeId);
        if (indexOfMetaEntry !== -1) {
            var nextEntry = this._nextEntryOfType(metaData, indexOfMetaEntry + 1, appId, typeId);
            if (!nextEntry) {
                return this._appendIndexEntriesToRow(transaction, metaData, indexOfMetaEntry, entries);
            }
            else {
                var _a = this._splitByTimestamp(entries, nextEntry.oldestElementTimestamp), toCurrentOne = _a[0], toNextOnes_1 = _a[1];
                return this._appendIndexEntriesToRow(transaction, metaData, indexOfMetaEntry, toCurrentOne).thenOrApply(function () {
                    return _this._writeEntries(transaction, toNextOnes_1, metaData, appId, typeId);
                });
            }
        }
        else {
            // we have not found any entry which oldest id is lower than oldest id to add but there can be other entries
            var firstEntry = this._nextEntryOfType(metaData, 0, appId, typeId);
            // 1. We have a first entry.
            //   i: We have a second entry. Check how much fits into the first block
            //     a. It's not oversized. Write to it.
            //     b. It is oversized. Create a new block.
            //   ii: We don't have a second entry. Check if we can fit everything into the first block
            //     a. It's not eversized. Write to it.
            //     b. It's oversized. Create a new one.
            // 2. We don't have a first entry. Just create a new row with everything.
            if (firstEntry) {
                var indexOfFirstEntry = metaData.rows.indexOf(firstEntry);
                var secondEntry = this._nextEntryOfType(metaData, indexOfFirstEntry + 1, appId, typeId);
                var _b = secondEntry ? this._splitByTimestamp(entries, secondEntry.oldestElementTimestamp) : [entries, []], toFirstOne = _b[0], toNextOnes_2 = _b[1];
                if (firstEntry.size + toFirstOne.length < SEARCH_INDEX_ROW_LENGTH) {
                    return this._appendIndexEntriesToRow(transaction, metaData, indexOfFirstEntry, toFirstOne).thenOrApply(function () {
                        return _this._writeEntries(transaction, toNextOnes_2, metaData, appId, typeId);
                    });
                }
                else {
                    var _c = this._splitByTimestamp(toFirstOne, firstEntry.oldestElementTimestamp), toNewOne = _c[0], toCurrentOne_1 = _c[1];
                    return tutanota_utils_1.PromisableWrapper.from(this._createNewRow(transaction, metaData, toNewOne, oldestTimestamp, appId, typeId)).thenOrApply(function () {
                        return _this._writeEntries(transaction, toCurrentOne_1.concat(toNextOnes_2), metaData, appId, typeId);
                    });
                }
            }
            else {
                return this._createNewRow(transaction, metaData, entries, oldestTimestamp, appId, typeId);
            }
        }
    };
    IndexerCore.prototype._nextEntryOfType = function (metaData, startIndex, appId, typeId) {
        for (var i = startIndex; i < metaData.rows.length; i++) {
            if (metaData.rows[i].app === appId && metaData.rows[i].type === typeId) {
                return metaData.rows[i];
            }
        }
        return null;
    };
    /**
     * Split {@param entries} (must be sorted!) into two arrays: before and after the timestamp.
     * @private
     */
    IndexerCore.prototype._splitByTimestamp = function (entries, timestamp) {
        var indexOfSplit = entries.findIndex(function (entry) { return entry.timestamp >= timestamp; });
        if (indexOfSplit === -1) {
            return [entries, []];
        }
        var below = entries.slice(0, indexOfSplit);
        var above = entries.slice(indexOfSplit);
        return [below, above];
    };
    /**
     * Append {@param entries} to the row specified by the {@param metaEntryIndex}. If the row size exceeds {@link SEARCH_INDEX_ROW_LENGTH}, then
     * split it into two rows.
     * @private
     */
    IndexerCore.prototype._appendIndexEntriesToRow = function (transaction, metaData, metaEntryIndex, entries) {
        var _this = this;
        if (entries.length === 0) {
            return new tutanota_utils_1.PromisableWrapper(undefined);
        }
        var metaEntry = metaData.rows[metaEntryIndex];
        if (metaEntry.size + entries.length > SEARCH_INDEX_ROW_LENGTH) {
            // load existing row
            // decrypt ids
            // sort by id
            // split
            return tutanota_utils_1.PromisableWrapper.from(transaction.get(Indexer_1.SearchIndexOS, metaEntry.key).then(function (binaryBlock) {
                if (!binaryBlock) {
                    throw new InvalidDatabaseStateError_1.InvalidDatabaseStateError("non existing index row");
                }
                var timestampToEntries = new Map();
                var existingIds = new Set();
                // Iterate all entries in a block, decrypt id of each and put it into the map
                (0, SearchIndexEncoding_1.iterateBinaryBlocks)(binaryBlock, function (encSearchIndexEntry) {
                    var encId = (0, IndexUtils_1.getIdFromEncSearchIndexEntry)(encSearchIndexEntry);
                    existingIds.add((0, tutanota_utils_1.arrayHash)(encId));
                    var decId = (0, IndexUtils_1.decryptIndexKey)(_this.db.key, encId, _this.db.iv);
                    var timeStamp = (0, EntityUtils_1.generatedIdToTimestamp)(decId);
                    (0, tutanota_utils_1.getFromMap)(timestampToEntries, timeStamp, function () { return []; }).push(encSearchIndexEntry);
                });
                // Also add new entries
                entries.forEach(function (_a) {
                    var entry = _a.entry, timestamp = _a.timestamp;
                    (0, tutanota_utils_1.getFromMap)(timestampToEntries, timestamp, function () { return []; }).push(entry);
                });
                // Prefer to put entries into the first row if it's not initial indexing (we are likely to grow second row in the future)
                // Prefer to put entries into the second row if it's initial indexing (we are likely to grow the first row because we move back in time)
                var isLastEntry = _this._nextEntryOfType(metaData, metaEntryIndex + 1, metaEntry.app, metaEntry.type) == null;
                var rows = _this._distributeEntities(timestampToEntries, isLastEntry);
                // keep the oldest timestamp in the existing meta data entry to ensure that when continuing search we don't get the same meta data entry twice.
                var _a = [rows[0], rows.slice(1)], appendRow = _a[0], newRows = _a[1];
                var firstRowBinary = (0, SearchIndexEncoding_1.appendBinaryBlocks)(appendRow.row);
                var requestPromises = [
                    transaction.put(Indexer_1.SearchIndexOS, metaEntry.key, firstRowBinary).then(function () {
                        metaEntry.size = appendRow.row.length;
                        metaEntry.oldestElementTimestamp = appendRow.oldestElementTimestamp;
                        return metaEntry.key;
                    }),
                    _this._promiseMapCompat(newRows, function (row) {
                        var binaryRow = (0, SearchIndexEncoding_1.appendBinaryBlocks)(row.row);
                        return transaction.put(Indexer_1.SearchIndexOS, null, binaryRow).then(function (newSearchIndexRowId) {
                            metaData.rows.push({
                                key: newSearchIndexRowId,
                                size: row.row.length,
                                app: metaEntry.app,
                                type: metaEntry.type,
                                oldestElementTimestamp: row.oldestElementTimestamp
                            });
                        });
                    }, {
                        concurrency: 2
                    }).value
                ];
                return Promise.all(requestPromises).then(function () {
                    metaData.rows.sort(IndexUtils_1.compareMetaEntriesOldest);
                });
            }));
        }
        else {
            return tutanota_utils_1.PromisableWrapper.from(transaction.get(Indexer_1.SearchIndexOS, metaEntry.key).then(function (indexEntriesRow) {
                var safeRow = indexEntriesRow || new Uint8Array(0);
                var resultRow = (0, SearchIndexEncoding_1.appendBinaryBlocks)(entries.map(function (e) { return e.entry; }), safeRow);
                return transaction.put(Indexer_1.SearchIndexOS, metaEntry.key, resultRow).then(function () {
                    metaEntry.size += entries.length;
                    // when adding entries to an existing row it is guaranteed that all added elements are newer.
                    // We don't have to update oldestTimestamp of the meta data.
                    // ...except when we're growing the first row, then we should do that
                    metaEntry.oldestElementTimestamp = Math.min(entries[0].timestamp, metaEntry.oldestElementTimestamp);
                });
            }));
        }
    };
    IndexerCore.prototype._distributeEntities = function (timestampToEntries, preferFirst) {
        var sortedTimestamps = Array.from(timestampToEntries.keys()).sort(function (l, r) { return l - r; });
        // If we append to the newest IDs, then try to saturate older rows
        if (preferFirst) {
            var rows_1 = [
                {
                    row: [],
                    oldestElementTimestamp: sortedTimestamps[0]
                },
            ];
            sortedTimestamps.forEach(function (id) {
                var _a;
                var encryptedEntries = (0, tutanota_utils_1.neverNull)(timestampToEntries.get(id));
                if ((0, tutanota_utils_1.lastThrow)(rows_1).row.length + encryptedEntries.length > SEARCH_INDEX_ROW_LENGTH) {
                    rows_1.push({
                        row: [],
                        oldestElementTimestamp: id
                    });
                }
                (_a = (0, tutanota_utils_1.lastThrow)(rows_1).row).push.apply(_a, encryptedEntries);
            });
            return rows_1;
        }
        else {
            // If we append in the middle, then try to saturate new row
            var rows_2 = [
                {
                    row: [],
                    oldestElementTimestamp: Number.MAX_SAFE_INTEGER
                },
            ];
            var reveresId = sortedTimestamps.slice().reverse();
            reveresId.forEach(function (id) {
                var _a;
                var encryptedEntries = (0, tutanota_utils_1.neverNull)(timestampToEntries.get(id));
                if (rows_2[0].row.length + encryptedEntries.length > SEARCH_INDEX_ROW_LENGTH) {
                    rows_2.unshift({
                        row: [],
                        oldestElementTimestamp: id
                    });
                }
                (_a = rows_2[0].row).unshift.apply(_a, encryptedEntries);
                rows_2[0].oldestElementTimestamp = Math.min(rows_2[0].oldestElementTimestamp, id);
            });
            return rows_2;
        }
    };
    IndexerCore.prototype._createNewRow = function (transaction, metaData, encryptedSearchIndexEntries, oldestTimestamp, appId, typeId) {
        var byTimestamp = (0, tutanota_utils_1.groupByAndMap)(encryptedSearchIndexEntries, function (e) { return e.timestamp; }, function (e) { return e.entry; });
        var distributed = this._distributeEntities(byTimestamp, false);
        return this._promiseMapCompat(distributed, function (_a) {
            var row = _a.row, oldestElementTimestamp = _a.oldestElementTimestamp;
            var binaryRow = (0, SearchIndexEncoding_1.appendBinaryBlocks)(row);
            return transaction.put(Indexer_1.SearchIndexOS, null, binaryRow).then(function (newRowId) {
                // Oldest entries come in front
                metaData.rows.push({
                    key: newRowId,
                    size: row.length,
                    app: appId,
                    type: typeId,
                    oldestElementTimestamp: oldestElementTimestamp
                });
            });
        }, {
            concurrency: 2
        }).thenOrApply(function () {
            metaData.rows.sort(IndexUtils_1.compareMetaEntriesOldest);
        });
    };
    IndexerCore.prototype._findMetaDataEntryByTimestamp = function (metaData, oldestTimestamp, appId, typeId) {
        return (0, tutanota_utils_1.findLastIndex)(metaData.rows, function (r) { return r.app === appId && r.type === typeId && r.oldestElementTimestamp <= oldestTimestamp; });
    };
    IndexerCore.prototype._getOrCreateSearchIndexMeta = function (transaction, encWordBase64) {
        var _this = this;
        return transaction.get(Indexer_1.SearchIndexMetaDataOS, encWordBase64, Indexer_1.SearchIndexWordsIndex).then(function (metaData) {
            if (metaData) {
                return (0, IndexUtils_1.decryptMetaData)(_this.db.key, metaData);
            }
            else {
                var metaTemplate = {
                    word: encWordBase64,
                    rows: new Uint8Array(0)
                };
                if (_this._needsExplicitIds) {
                    metaTemplate.id = _this._explicitIdStart++;
                }
                return transaction.put(Indexer_1.SearchIndexMetaDataOS, null, metaTemplate).then(function (rowId) {
                    _this._stats.words += 1;
                    return {
                        id: rowId,
                        word: encWordBase64,
                        rows: []
                    };
                });
            }
        });
    };
    IndexerCore.prototype._updateGroupDataIndexTimestamp = function (dataPerGroup, transaction) {
        return this._promiseMapCompat(dataPerGroup, function (data) {
            var groupId = data.groupId, indexTimestamp = data.indexTimestamp;
            return transaction.get(Indexer_1.GroupDataOS, groupId).then(function (groupData) {
                if (!groupData) {
                    throw new InvalidDatabaseStateError_1.InvalidDatabaseStateError("GroupData not available for group " + groupId);
                }
                groupData.indexTimestamp = indexTimestamp;
                return transaction.put(Indexer_1.GroupDataOS, groupId, groupData);
            });
        }).thenOrApply(function () {
        }).value;
    };
    IndexerCore.prototype._updateGroupDataBatchId = function (groupId, batchId, transaction) {
        return transaction.get(Indexer_1.GroupDataOS, groupId).then(function (groupData) {
            if (!groupData) {
                throw new InvalidDatabaseStateError_1.InvalidDatabaseStateError("GroupData not available for group " + groupId);
            }
            if (groupData.lastBatchIds.length > 0 && groupData.lastBatchIds.indexOf(batchId) !== -1) {
                // concurrent indexing (multiple tabs)
                console.warn("Abort transaction on updating group data: concurrent access", groupId, batchId);
                transaction.abort();
            }
            else {
                var newIndex = groupData.lastBatchIds.findIndex(function (indexedBatchId) { return (0, EntityUtils_1.firstBiggerThanSecond)(batchId, indexedBatchId); });
                if (newIndex !== -1) {
                    groupData.lastBatchIds.splice(newIndex, 0, batchId);
                }
                else {
                    groupData.lastBatchIds.push(batchId); // new batch is oldest of all stored batches
                }
                if (groupData.lastBatchIds.length > 1000) {
                    groupData.lastBatchIds = groupData.lastBatchIds.slice(0, 1000);
                }
                return transaction.put(Indexer_1.GroupDataOS, groupId, groupData);
            }
        });
    };
    IndexerCore.prototype._cancelIfNeeded = function () {
        if (this._isStopped) {
            throw new CancelledError_1.CancelledError("indexing cancelled");
        }
    };
    IndexerCore.prototype.resetStats = function () {
        this._stats = {
            indexingTime: 0,
            storageTime: 0,
            preparingTime: 0,
            mailcount: 0,
            storedBytes: 0,
            encryptionTime: 0,
            writeRequests: 0,
            largestColumn: 0,
            words: 0,
            indexedBytes: 0
        };
    };
    IndexerCore.prototype.printStatus = function () {
        var totalTime = this._stats.storageTime + this._stats.preparingTime;
        var statsWithDownloading = Object.assign({}, this._stats, {
            downloadingTime: this._stats.preparingTime - this._stats.indexingTime - this._stats.encryptionTime
        });
        console.log(JSON.stringify(statsWithDownloading), "total time: ", totalTime);
    };
    return IndexerCore;
}());
exports.IndexerCore = IndexerCore;
