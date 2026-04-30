"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.SearchFacade = void 0;
var TypeRefs_js_1 = require("../../entities/tutanota/TypeRefs.js");
var EntityFunctions_1 = require("../../common/EntityFunctions");
var Tokenizer_1 = require("./Tokenizer");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var IndexUtils_1 = require("./IndexUtils");
var TutanotaConstants_1 = require("../../common/TutanotaConstants");
var EntityUtils_1 = require("../../common/utils/EntityUtils");
var MailIndexer_1 = require("./MailIndexer");
var EntityConstants_1 = require("../../common/EntityConstants");
var RestError_1 = require("../../common/error/RestError");
var SearchIndexEncoding_1 = require("./SearchIndexEncoding");
var Indexer_1 = require("./Indexer");
var SearchFacade = /** @class */ (function () {
    function SearchFacade(userFacade, db, mailIndexer, suggestionFacades, browserData, entityClient) {
        this.userFacade = userFacade;
        this._db = db;
        this._mailIndexer = mailIndexer;
        this._suggestionFacades = suggestionFacades;
        this._promiseMapCompat = (0, tutanota_utils_1.promiseMapCompat)(browserData.needsMicrotaskHack);
        this._entityClient = entityClient;
    }
    /****************************** SEARCH ******************************/
    /**
     * Invoke an AND-query.
     * @param query is tokenized. All tokens must be matched by the result (AND-query)
     * @param minSuggestionCount If minSuggestionCount > 0 regards the last query token as suggestion token and includes suggestion results for that token, but not less than minSuggestionCount
     * @returns The result ids are sorted by id from newest to oldest
     */
    SearchFacade.prototype.search = function (query, restriction, minSuggestionCount, maxResults) {
        var _this = this;
        return this._db.initialized.then(function () {
            var searchTokens = (0, Tokenizer_1.tokenize)(query);
            var result = {
                query: query,
                restriction: restriction,
                results: [],
                currentIndexTimestamp: _this._getSearchEndTimestamp(restriction),
                lastReadSearchIndexRow: searchTokens.map(function (token) { return [token, null]; }),
                matchWordOrder: searchTokens.length > 1 && query.startsWith('"') && query.endsWith('"'),
                moreResults: [],
                moreResultsEntries: []
            };
            if (searchTokens.length > 0) {
                var isFirstWordSearch = searchTokens.length === 1;
                var before = (0, IndexUtils_1.getPerformanceTimestamp)();
                var suggestionFacade = _this._suggestionFacades.find(function (f) { return (0, tutanota_utils_1.isSameTypeRef)(f.type, restriction.type); });
                var searchPromise = void 0;
                if (minSuggestionCount > 0 && isFirstWordSearch && suggestionFacade) {
                    var addSuggestionBefore = (0, IndexUtils_1.getPerformanceTimestamp)();
                    searchPromise = _this._addSuggestions(searchTokens[0], suggestionFacade, minSuggestionCount, result).then(function () {
                        if (result.results.length < minSuggestionCount) {
                            // there may be fields that are not indexed with suggestions but which we can find with the normal search
                            // TODO: let suggestion facade and search facade know which fields are
                            // indexed with suggestions, so that we
                            // 1) know if we also have to search normally and
                            // 2) in which fields we have to search for second word suggestions because now we would also find words of non-suggestion fields as second words
                            var searchForTokensAfterSuggestionsBefore = (0, IndexUtils_1.getPerformanceTimestamp)();
                            return _this._startOrContinueSearch(result).then(function (result) {
                                return result;
                            });
                        }
                    });
                }
                else if (minSuggestionCount > 0 && !isFirstWordSearch && suggestionFacade) {
                    var suggestionToken_1 = (0, tutanota_utils_1.neverNull)(result.lastReadSearchIndexRow.pop())[0];
                    searchPromise = _this._startOrContinueSearch(result).then(function () {
                        // we now filter for the suggestion token manually because searching for suggestions for the last word and reducing the initial search result with them can lead to
                        // dozens of searches without any effect when the seach token is found in too many contacts, e.g. in the email address with the ending "de"
                        result.results.sort(EntityUtils_1.compareNewestFirst);
                        return _this._loadAndReduce(restriction, result, suggestionToken_1, minSuggestionCount);
                    });
                }
                else {
                    searchPromise = _this._startOrContinueSearch(result, maxResults);
                }
                return searchPromise.then(function () {
                    result.results.sort(EntityUtils_1.compareNewestFirst);
                    return result;
                });
            }
            else {
                return Promise.resolve(result);
            }
        });
    };
    SearchFacade.prototype._loadAndReduce = function (restriction, result, suggestionToken, minSuggestionCount) {
        return __awaiter(this, void 0, void 0, function () {
            var model, suggestionQuery, finalResults, _i, _a, id, entity, e_1, found;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(result.results.length > 0)) return [3 /*break*/, 11];
                        return [4 /*yield*/, (0, EntityFunctions_1.resolveTypeReference)(restriction.type)
                            // if we want the exact search order we try to find the complete sequence of words in an attribute of the instance.
                            // for other cases we only check that an attribute contains a word that starts with suggestion word
                        ];
                    case 1:
                        model = _b.sent();
                        suggestionQuery = result.matchWordOrder ? normalizeQuery(result.query) : suggestionToken;
                        finalResults = [];
                        _i = 0, _a = result.results;
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 10];
                        id = _a[_i];
                        if (!(finalResults.length >= minSuggestionCount)) return [3 /*break*/, 3];
                        return [3 /*break*/, 10];
                    case 3:
                        entity = void 0;
                        _b.label = 4;
                    case 4:
                        _b.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, this._entityClient.load(restriction.type, id)];
                    case 5:
                        entity = _b.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        e_1 = _b.sent();
                        if (e_1 instanceof RestError_1.NotFoundError || e_1 instanceof RestError_1.NotAuthorizedError) {
                            return [3 /*break*/, 9];
                        }
                        else {
                            throw e_1;
                        }
                        return [3 /*break*/, 7];
                    case 7: return [4 /*yield*/, this._containsSuggestionToken(entity, model, restriction.attributeIds, suggestionQuery, result.matchWordOrder)];
                    case 8:
                        found = _b.sent();
                        if (found) {
                            finalResults.push(id);
                        }
                        _b.label = 9;
                    case 9:
                        _i++;
                        return [3 /*break*/, 2];
                    case 10:
                        result.results = finalResults;
                        return [3 /*break*/, 12];
                    case 11: return [2 /*return*/, Promise.resolve()];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Looks for a word in any of the entities string values or aggregations string values that starts with suggestionToken.
     * @param attributeIds Only looks in these attribute ids (or all its string values if it is an aggregation attribute id. If null, looks in all string values and aggregations.
     */
    SearchFacade.prototype._containsSuggestionToken = function (entity, model, attributeIds, suggestionToken, matchWordOrder) {
        var _this = this;
        var attributeNames;
        if (!attributeIds) {
            attributeNames = Object.keys(model.values).concat(Object.keys(model.associations));
        }
        else {
            attributeNames = attributeIds.map(function (id) {
                return (0, tutanota_utils_1.neverNull)(Object.keys(model.values).find(function (valueName) { return model.values[valueName].id === id; }) ||
                    Object.keys(model.associations).find(function (associationName) { return model.associations[associationName].id === id; }));
            });
        }
        return (0, tutanota_utils_1.asyncFind)(attributeNames, function (attributeName) {
            if (model.values[attributeName] && model.values[attributeName].type === EntityConstants_1.ValueType.String && entity[attributeName]) {
                if (matchWordOrder) {
                    return Promise.resolve(normalizeQuery(entity[attributeName]).indexOf(suggestionToken) !== -1);
                }
                else {
                    var words = (0, Tokenizer_1.tokenize)(entity[attributeName]);
                    return Promise.resolve(words.find(function (w) { return w.startsWith(suggestionToken); }) != null);
                }
            }
            else if (model.associations[attributeName] && model.associations[attributeName].type === EntityConstants_1.AssociationType.Aggregation && entity[attributeName]) {
                var aggregates_1 = model.associations[attributeName].cardinality === EntityConstants_1.Cardinality.Any ? entity[attributeName] : [entity[attributeName]];
                return (0, EntityFunctions_1.resolveTypeReference)(new tutanota_utils_1.TypeRef(model.app, model.associations[attributeName].refType)).then(function (refModel) {
                    return (0, tutanota_utils_1.asyncFind)(aggregates_1, function (aggregate) {
                        return _this._containsSuggestionToken((0, tutanota_utils_1.downcast)(aggregate), refModel, null, suggestionToken, matchWordOrder);
                    }).then(function (found) { return found != null; });
                });
            }
            else {
                return Promise.resolve(false);
            }
        }).then(function (found) { return found != null; });
    };
    SearchFacade.prototype._startOrContinueSearch = function (searchResult, maxResults) {
        var _this = this;
        (0, IndexUtils_1.markStart)("findIndexEntries");
        var nextScheduledIndexingRun = (0, tutanota_utils_1.getStartOfDay)((0, tutanota_utils_1.getDayShifted)(new Date(this._mailIndexer.currentIndexTimestamp), MailIndexer_1.INITIAL_MAIL_INDEX_INTERVAL_DAYS));
        var theDayAfterTomorrow = (0, tutanota_utils_1.getStartOfDay)((0, tutanota_utils_1.getDayShifted)(new Date(), 1));
        if (searchResult.moreResults.length === 0
            && nextScheduledIndexingRun.getTime() > theDayAfterTomorrow.getTime()
            && !this._mailIndexer.isIndexing) {
            this._mailIndexer.extendIndexIfNeeded(this.userFacade.getLoggedInUser(), (0, tutanota_utils_1.getStartOfDay)((0, tutanota_utils_1.getDayShifted)(new Date(), -MailIndexer_1.INITIAL_MAIL_INDEX_INTERVAL_DAYS)).getTime());
        }
        var moreResultsEntries;
        if (maxResults && searchResult.moreResults.length >= maxResults) {
            moreResultsEntries = Promise.resolve(searchResult.moreResults);
        }
        else {
            moreResultsEntries = this._findIndexEntries(searchResult, maxResults)
                .then(function (keyToEncryptedIndexEntries) {
                (0, IndexUtils_1.markEnd)("findIndexEntries");
                (0, IndexUtils_1.markStart)("_filterByEncryptedId");
                return _this._filterByEncryptedId(keyToEncryptedIndexEntries);
            })
                .then(function (keyToEncryptedIndexEntries) {
                (0, IndexUtils_1.markEnd)("_filterByEncryptedId");
                (0, IndexUtils_1.markStart)("_decryptSearchResult");
                return _this._decryptSearchResult(keyToEncryptedIndexEntries);
            })
                .then(function (keyToIndexEntries) {
                (0, IndexUtils_1.markEnd)("_decryptSearchResult");
                (0, IndexUtils_1.markStart)("_filterByTypeAndAttributeAndTime");
                return _this._filterByTypeAndAttributeAndTime(keyToIndexEntries, searchResult.restriction);
            })
                .then(function (keyToIndexEntries) {
                (0, IndexUtils_1.markEnd)("_filterByTypeAndAttributeAndTime");
                (0, IndexUtils_1.markStart)("_reduceWords");
                return _this._reduceWords(keyToIndexEntries, searchResult.matchWordOrder);
            })
                .then(function (searchIndexEntries) {
                (0, IndexUtils_1.markEnd)("_reduceWords");
                (0, IndexUtils_1.markStart)("_reduceToUniqueElementIds");
                return _this._reduceToUniqueElementIds(searchIndexEntries, searchResult);
            })
                .then(function (additionalEntries) {
                (0, IndexUtils_1.markEnd)("_reduceToUniqueElementIds");
                return additionalEntries.concat(searchResult.moreResults);
            });
        }
        return moreResultsEntries
            .then(function (searchIndexEntries) {
            (0, IndexUtils_1.markStart)("_filterByListIdAndGroupSearchResults");
            return _this._filterByListIdAndGroupSearchResults(searchIndexEntries, searchResult, maxResults);
        })
            .then(function (result) {
            (0, IndexUtils_1.markEnd)("_filterByListIdAndGroupSearchResults");
            typeof self !== "undefined" &&
                (0, IndexUtils_1.printMeasure)("query: " + searchResult.query + ", maxResults: " + String(maxResults), [
                    "findIndexEntries",
                    "_filterByEncryptedId",
                    "_decryptSearchResult",
                    "_filterByTypeAndAttributeAndTime",
                    "_reduceWords",
                    "_reduceToUniqueElementIds",
                    "_filterByListIdAndGroupSearchResults",
                ]);
            return result;
        });
    };
    /**
     * Adds suggestions for the given searchToken to the searchResult until at least minSuggestionCount results are existing
     */
    SearchFacade.prototype._addSuggestions = function (searchToken, suggestionFacade, minSuggestionCount, searchResult) {
        var _this = this;
        var suggestions = suggestionFacade.getSuggestions(searchToken);
        return (0, tutanota_utils_1.promiseMap)(suggestions, function (suggestion) {
            if (searchResult.results.length < minSuggestionCount) {
                var suggestionResult = {
                    query: suggestion,
                    restriction: searchResult.restriction,
                    results: searchResult.results,
                    currentIndexTimestamp: searchResult.currentIndexTimestamp,
                    lastReadSearchIndexRow: [[suggestion, null]],
                    matchWordOrder: false,
                    moreResults: [],
                    moreResultsEntries: []
                };
                return _this._startOrContinueSearch(suggestionResult);
            }
        });
    };
    SearchFacade.prototype._findIndexEntries = function (searchResult, maxResults) {
        var _this = this;
        var typeInfo = (0, IndexUtils_1.typeRefToTypeInfo)(searchResult.restriction.type);
        var firstSearchTokenInfo = searchResult.lastReadSearchIndexRow[0];
        // First read all metadata to narrow time range we search in.
        return this._db.dbFacade.createTransaction(true, [Indexer_1.SearchIndexOS, Indexer_1.SearchIndexMetaDataOS]).then(function (transaction) {
            return _this._promiseMapCompat(searchResult.lastReadSearchIndexRow, function (tokenInfo, index) {
                var searchToken = tokenInfo[0];
                var indexKey = (0, IndexUtils_1.encryptIndexKeyBase64)(_this._db.key, searchToken, _this._db.iv);
                return transaction.get(Indexer_1.SearchIndexMetaDataOS, indexKey, Indexer_1.SearchIndexWordsIndex).then(function (metaData) {
                    if (!metaData) {
                        tokenInfo[1] = 0; // "we've read all" (because we don't have anything
                        // If there's no metadata for key, return empty result
                        return {
                            id: -index,
                            word: indexKey,
                            rows: []
                        };
                    }
                    return (0, IndexUtils_1.decryptMetaData)(_this._db.key, metaData);
                });
            })
                .thenOrApply(function (metaRows) {
                // Find index entry rows in which we will search.
                var rowsToReadForIndexKeys = _this._findRowsToReadFromMetaData(firstSearchTokenInfo, metaRows, typeInfo, maxResults);
                // Iterate each query token
                return _this._promiseMapCompat(rowsToReadForIndexKeys, function (rowsToRead) {
                    // For each token find token entries in the rows we've found
                    return _this._promiseMapCompat(rowsToRead.rows, function (entry) { return _this._findEntriesForMetadata(transaction, entry); })
                        .thenOrApply(tutanota_utils_1.flat)
                        .thenOrApply(function (indexEntries) {
                        return indexEntries.map(function (entry) { return ({
                            encEntry: entry,
                            idHash: (0, tutanota_utils_1.arrayHash)((0, IndexUtils_1.getIdFromEncSearchIndexEntry)(entry))
                        }); });
                    })
                        .thenOrApply(function (indexEntries) {
                        return {
                            indexKey: rowsToRead.indexKey,
                            indexEntries: indexEntries
                        };
                    }).value;
                }).value;
            })
                .toPromise();
        });
    };
    SearchFacade.prototype._findRowsToReadFromMetaData = function (firstTokenInfo, safeMetaDataRows, typeInfo, maxResults) {
        var _this = this;
        // "Leading row" narrows down time range in which we search in this iteration
        // Doesn't matter for correctness which one it is (because query is always AND) but matters for performance
        // For now arbitrarily picked first (usually it's the most specific part anyway)
        var leadingRow = safeMetaDataRows[0];
        var otherRows = safeMetaDataRows.slice(1);
        var rangeForLeadingRow = this._findRowsToRead(leadingRow, typeInfo, firstTokenInfo[1] || Number.MAX_SAFE_INTEGER, maxResults);
        var rowsForLeadingRow = [
            {
                indexKey: leadingRow.word,
                rows: rangeForLeadingRow.metaEntries
            },
        ];
        firstTokenInfo[1] = rangeForLeadingRow.oldestTimestamp;
        var rowsForOtherRows = otherRows.map(function (r) {
            return {
                indexKey: r.word,
                rows: _this._findRowsToReadByTimeRange(r, typeInfo, rangeForLeadingRow.newestRowTimestamp, rangeForLeadingRow.oldestTimestamp)
            };
        });
        return rowsForLeadingRow.concat(rowsForOtherRows);
    };
    SearchFacade.prototype._findEntriesForMetadata = function (transaction, entry) {
        return transaction.get(Indexer_1.SearchIndexOS, entry.key).then(function (indexEntriesRow) {
            if (!indexEntriesRow)
                return [];
            var result = new Array(entry.size);
            (0, SearchIndexEncoding_1.iterateBinaryBlocks)(indexEntriesRow, function (block, s, e, iteration) {
                result[iteration] = block;
            });
            return result;
        });
    };
    SearchFacade.prototype._findRowsToReadByTimeRange = function (metaData, typeInfo, fromNewestTimestamp, toOldestTimestamp) {
        var filteredRows = metaData.rows.filter(function (r) { return r.app === typeInfo.appId && r.type === typeInfo.typeId; });
        filteredRows.reverse();
        var passedRows = [];
        for (var _i = 0, filteredRows_1 = filteredRows; _i < filteredRows_1.length; _i++) {
            var row = filteredRows_1[_i];
            if (row.oldestElementTimestamp < fromNewestTimestamp) {
                passedRows.push(row);
                if (row.oldestElementTimestamp <= toOldestTimestamp) {
                    break;
                }
            }
        }
        return passedRows;
    };
    SearchFacade.prototype._findRowsToRead = function (metaData, typeInfo, mustBeOlderThan, maxResults) {
        var filteredRows = metaData.rows.filter(function (r) { return r.app === typeInfo.appId && r.type === typeInfo.typeId; });
        filteredRows.reverse();
        var entitiesToRead = 0;
        var lastReadRowTimestamp = 0;
        var newestRowTimestamp = Number.MAX_SAFE_INTEGER;
        var rowsToRead;
        if (maxResults) {
            rowsToRead = [];
            for (var _i = 0, filteredRows_2 = filteredRows; _i < filteredRows_2.length; _i++) {
                var r = filteredRows_2[_i];
                if (r.oldestElementTimestamp < mustBeOlderThan) {
                    if (entitiesToRead < 1000) {
                        entitiesToRead += r.size;
                        lastReadRowTimestamp = r.oldestElementTimestamp;
                        rowsToRead.push(r);
                    }
                    else {
                        break;
                    }
                }
                else {
                    newestRowTimestamp = r.oldestElementTimestamp;
                }
            }
        }
        else {
            rowsToRead = filteredRows;
        }
        return {
            metaEntries: rowsToRead,
            oldestTimestamp: lastReadRowTimestamp,
            newestRowTimestamp: newestRowTimestamp
        };
    };
    /**
     * Reduces the search result by filtering out all mailIds that don't match all search tokens
     */
    SearchFacade.prototype._filterByEncryptedId = function (results) {
        // let matchingEncIds = null
        var matchingEncIds;
        results.forEach(function (keyToEncryptedIndexEntry) {
            if (matchingEncIds == null) {
                matchingEncIds = new Set(keyToEncryptedIndexEntry.indexEntries.map(function (entry) { return entry.idHash; }));
            }
            else {
                var filtered_1 = new Set();
                keyToEncryptedIndexEntry.indexEntries.forEach(function (indexEntry) {
                    if (matchingEncIds.has(indexEntry.idHash)) {
                        filtered_1.add(indexEntry.idHash);
                    }
                });
                matchingEncIds = filtered_1;
            }
        });
        return results.map(function (r) {
            return {
                indexKey: r.indexKey,
                indexEntries: r.indexEntries.filter(function (entry) { return matchingEncIds.has(entry.idHash); })
            };
        });
    };
    SearchFacade.prototype._decryptSearchResult = function (results) {
        var _this = this;
        return results.map(function (searchResult) {
            return {
                indexKey: searchResult.indexKey,
                indexEntries: searchResult.indexEntries.map(function (entry) { return (0, IndexUtils_1.decryptSearchIndexEntry)(_this._db.key, entry.encEntry, _this._db.iv); })
            };
        });
    };
    SearchFacade.prototype._filterByTypeAndAttributeAndTime = function (results, restriction) {
        var _this = this;
        // first filter each index entry by itself
        var endTimestamp = this._getSearchEndTimestamp(restriction);
        var minIncludedId = (0, EntityUtils_1.timestampToGeneratedId)(endTimestamp);
        var maxExcludedId = restriction.start ? (0, EntityUtils_1.timestampToGeneratedId)(restriction.start + 1) : null;
        results.forEach(function (result) {
            result.indexEntries = result.indexEntries.filter(function (entry) {
                return _this._isValidAttributeAndTime(restriction, entry, minIncludedId, maxExcludedId);
            });
        });
        // now filter all ids that are in all of the search words
        var matchingIds;
        results.forEach(function (keyToIndexEntry) {
            if (!matchingIds) {
                matchingIds = new Set(keyToIndexEntry.indexEntries.map(function (entry) { return entry.id; }));
            }
            else {
                var filtered_2 = new Set();
                keyToIndexEntry.indexEntries.forEach(function (entry) {
                    if (matchingIds.has(entry.id)) {
                        filtered_2.add(entry.id);
                    }
                });
                matchingIds = filtered_2;
            }
        });
        return results.map(function (r) {
            return {
                indexKey: r.indexKey,
                indexEntries: r.indexEntries.filter(function (entry) { return matchingIds.has(entry.id); })
            };
        });
    };
    SearchFacade.prototype._isValidAttributeAndTime = function (restriction, entry, minIncludedId, maxExcludedId) {
        if (restriction.attributeIds) {
            if (!(0, tutanota_utils_1.contains)(restriction.attributeIds, entry.attribute)) {
                return false;
            }
        }
        if (maxExcludedId) {
            // timestampToGeneratedId provides the lowest id with the given timestamp (server id and counter set to 0),
            // so we add one millisecond to make sure all ids of the timestamp are covered
            if (!(0, EntityUtils_1.firstBiggerThanSecond)(maxExcludedId, entry.id)) {
                return false;
            }
        }
        return !(0, EntityUtils_1.firstBiggerThanSecond)(minIncludedId, entry.id);
    };
    SearchFacade.prototype._reduceWords = function (results, matchWordOrder) {
        if (matchWordOrder) {
            return results[0].indexEntries.filter(function (firstWordEntry) {
                // reduce the filtered positions for this first word entry and its attribute with each next word to those that are in order
                var filteredPositions = firstWordEntry.positions.slice();
                var _loop_1 = function (i) {
                    var entry = results[i].indexEntries.find(function (e) { return e.id === firstWordEntry.id && e.attribute === firstWordEntry.attribute; });
                    if (entry) {
                        filteredPositions = filteredPositions.filter(function (firstWordPosition) {
                            return (0, tutanota_utils_1.neverNull)(entry).positions.find(function (position) { return position === firstWordPosition + i; });
                        });
                    }
                    else {
                        // the id was probably not found for the same attribute as the current filtered positions, so we could not find all words in order in the same attribute
                        filteredPositions = [];
                    }
                };
                for (var i = 1; i < results.length; i++) {
                    _loop_1(i);
                }
                return filteredPositions.length > 0;
            });
        }
        else {
            // all ids must appear in all words now, so we can use any of the entries lists
            return results[0].indexEntries;
        }
    };
    SearchFacade.prototype._reduceToUniqueElementIds = function (results, previousResult) {
        var uniqueIds = new Set();
        return results.filter(function (entry) {
            if (!uniqueIds.has(entry.id) && !previousResult.results.find(function (r) { return r[1] === entry.id; })) {
                uniqueIds.add(entry.id);
                return true;
            }
            else {
                return false;
            }
        });
    };
    SearchFacade.prototype._filterByListIdAndGroupSearchResults = function (indexEntries, searchResult, maxResults) {
        indexEntries.sort(function (l, r) { return (0, EntityUtils_1.compareNewestFirst)(l.id, r.id); });
        // We filter out everything we've processed from moreEntries, even if we didn't include it
        // downcast: Array of optional elements in not subtype of non-optional elements
        var entriesCopy = (0, tutanota_utils_1.downcast)(indexEntries.slice());
        // Results are added in the random order and we may filter some of them out. We need to sort them.
        // Use separate array to only sort new results and not all of them.
        return this._db.dbFacade
            .createTransaction(true, [Indexer_1.ElementDataOS])
            .then(function (transaction) {
            // BUT! we have to look at all of them! Otherwise we may return them in the wrong order. We cannot return elements 10, 15, 20 if we didn't
            // return element 5 first, no one will ask for it later.
            // The best thing performance-wise would be to split into chunks of certain length and process them in parallel and stop after certain chunk.
            return (0, tutanota_utils_1.promiseMap)(indexEntries.slice(0, maxResults || indexEntries.length + 1), function (entry, index) {
                return transaction.get(Indexer_1.ElementDataOS, (0, tutanota_utils_1.uint8ArrayToBase64)(entry.encId)).then(function (elementData) {
                    // mark result index id as processed to not query result in next load more operation
                    entriesCopy[index] = null;
                    if (elementData && (!searchResult.restriction.listId || searchResult.restriction.listId === elementData[0])) {
                        return [elementData[0], entry.id];
                    }
                    return null;
                });
            }, {
                concurrency: 5
            });
        })
            .then(function (newResults) {
            var _a;
            (_a = searchResult.results).push.apply(_a, newResults.filter(tutanota_utils_1.isNotNull));
            searchResult.moreResults = entriesCopy.filter(tutanota_utils_1.isNotNull);
        });
    };
    SearchFacade.prototype.getMoreSearchResults = function (searchResult, moreResultCount) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._startOrContinueSearch(searchResult, moreResultCount)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, searchResult];
                }
            });
        });
    };
    SearchFacade.prototype._getSearchEndTimestamp = function (restriction) {
        if (restriction.end) {
            return restriction.end;
        }
        else if ((0, tutanota_utils_1.isSameTypeRef)(TypeRefs_js_1.MailTypeRef, restriction.type)) {
            return this._mailIndexer.currentIndexTimestamp === TutanotaConstants_1.NOTHING_INDEXED_TIMESTAMP ? Date.now() : this._mailIndexer.currentIndexTimestamp;
        }
        else {
            return TutanotaConstants_1.FULL_INDEXED_TIMESTAMP;
        }
    };
    return SearchFacade;
}());
exports.SearchFacade = SearchFacade;
function normalizeQuery(query) {
    return (0, Tokenizer_1.tokenize)(query).join(" ");
}
