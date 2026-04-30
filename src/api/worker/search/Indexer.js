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
exports.Indexer = exports.newSearchIndexDB = exports.SearchIndexWordsIndex = exports.SearchTermSuggestionsOS = exports.GroupDataOS = exports.MetaDataOS = exports.ElementDataOS = exports.SearchIndexMetaDataOS = exports.SearchIndexOS = exports.indexName = exports.Metadata = void 0;
var TutanotaConstants_1 = require("../../common/TutanotaConstants");
var RestError_1 = require("../../common/error/RestError");
var TypeRefs_js_1 = require("../../entities/sys/TypeRefs.js");
var DbFacade_1 = require("./DbFacade");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var EntityUtils_1 = require("../../common/utils/EntityUtils");
var IndexUtils_1 = require("./IndexUtils");
var ContactIndexer_1 = require("./ContactIndexer");
var TypeRefs_js_2 = require("../../entities/tutanota/TypeRefs.js");
var GroupInfoIndexer_1 = require("./GroupInfoIndexer");
var MailIndexer_1 = require("./MailIndexer");
var IndexerCore_1 = require("./IndexerCore");
var OutOfSyncError_1 = require("../../common/error/OutOfSyncError");
var SuggestionFacade_1 = require("./SuggestionFacade");
var DbError_1 = require("../../common/error/DbError");
var EventQueue_1 = require("./EventQueue");
var WhitelabelChildIndexer_1 = require("./WhitelabelChildIndexer");
var CancelledError_1 = require("../../common/error/CancelledError");
var MembershipRemovedError_1 = require("../../common/error/MembershipRemovedError");
var InvalidDatabaseStateError_1 = require("../../common/error/InvalidDatabaseStateError");
var DateProvider_1 = require("../DateProvider");
var EntityClient_1 = require("../../common/EntityClient");
var DbUtils_1 = require("../utils/DbUtils");
var tutanota_crypto_1 = require("@tutao/tutanota-crypto");
exports.Metadata = {
    userEncDbKey: "userEncDbKey",
    mailIndexingEnabled: "mailIndexingEnabled",
    excludedListIds: "excludedListIds",
    // stored in the database, so the mailbox does not need to be loaded when starting to index mails except spam folder after login
    encDbIv: "encDbIv",
    // server timestamp of the last time we indexed on this client, in millis
    lastEventIndexTimeMs: "lastEventIndexTimeMs"
};
var indexName = function (indexName) { return indexName; };
exports.indexName = indexName;
exports.SearchIndexOS = "SearchIndex";
exports.SearchIndexMetaDataOS = "SearchIndexMeta";
exports.ElementDataOS = "ElementData";
exports.MetaDataOS = "MetaData";
exports.GroupDataOS = "GroupMetaData";
exports.SearchTermSuggestionsOS = "SearchTermSuggestions";
exports.SearchIndexWordsIndex = "SearchIndexWords";
var DB_VERSION = 3;
function newSearchIndexDB() {
    return new DbFacade_1.DbFacade(DB_VERSION, function (event, db) {
        if (event.oldVersion !== DB_VERSION && event.oldVersion !== 0) {
            (0, DbUtils_1.deleteObjectStores)(db, exports.SearchIndexOS, exports.ElementDataOS, exports.MetaDataOS, exports.GroupDataOS, exports.SearchTermSuggestionsOS, exports.SearchIndexMetaDataOS);
        }
        db.createObjectStore(exports.SearchIndexOS, {
            autoIncrement: true
        });
        var metaOS = db.createObjectStore(exports.SearchIndexMetaDataOS, {
            autoIncrement: true,
            keyPath: "id"
        });
        db.createObjectStore(exports.ElementDataOS);
        db.createObjectStore(exports.MetaDataOS);
        db.createObjectStore(exports.GroupDataOS);
        db.createObjectStore(exports.SearchTermSuggestionsOS);
        metaOS.createIndex(exports.SearchIndexWordsIndex, "word", {
            unique: true
        });
    });
}
exports.newSearchIndexDB = newSearchIndexDB;
var Indexer = /** @class */ (function () {
    function Indexer(entityRestClient, worker, browserData, defaultEntityRestCache) {
        var _this = this;
        var deferred = (0, tutanota_utils_1.defer)();
        this._dbInitializedDeferredObject = deferred;
        this.db = {
            dbFacade: newSearchIndexDB(),
            key: (0, tutanota_utils_1.downcast)(null),
            iv: (0, tutanota_utils_1.downcast)(null),
            initialized: deferred.promise
        };
        // correctly initialized during init()
        this._worker = worker;
        this._core = new IndexerCore_1.IndexerCore(this.db, new EventQueue_1.EventQueue(true, function (batch) { return _this._processEntityEvents(batch); }), browserData);
        this._entityRestClient = entityRestClient;
        this._entity = new EntityClient_1.EntityClient(defaultEntityRestCache);
        this._contact = new ContactIndexer_1.ContactIndexer(this._core, this.db, this._entity, new SuggestionFacade_1.SuggestionFacade(TypeRefs_js_2.ContactTypeRef, this.db));
        this._whitelabelChildIndexer = new WhitelabelChildIndexer_1.WhitelabelChildIndexer(this._core, this.db, this._entity, new SuggestionFacade_1.SuggestionFacade(TypeRefs_js_1.WhitelabelChildTypeRef, this.db));
        var dateProvider = new DateProvider_1.LocalTimeDateProvider();
        this._mail = new MailIndexer_1.MailIndexer(this._core, this.db, worker, entityRestClient, defaultEntityRestCache, dateProvider);
        this._groupInfo = new GroupInfoIndexer_1.GroupInfoIndexer(this._core, this.db, this._entity, new SuggestionFacade_1.SuggestionFacade(TypeRefs_js_1.GroupInfoTypeRef, this.db));
        this._indexedGroupIds = [];
        this._initiallyLoadedBatchIdsPerGroup = new Map();
        this._realtimeEventQueue = new EventQueue_1.EventQueue(false, function (nextElement) {
            // During initial loading we remember the last batch we loaded
            // so if we get updates from EventBusClient here for things that are already loaded we discard them
            var loadedIdForGroup = _this._initiallyLoadedBatchIdsPerGroup.get(nextElement.groupId);
            if (loadedIdForGroup == null || (0, EntityUtils_1.firstBiggerThanSecond)(nextElement.batchId, loadedIdForGroup)) {
                _this._core.addBatchesToQueue([nextElement]);
            }
            return Promise.resolve();
        });
        this._realtimeEventQueue.pause();
    }
    /**
     * Opens a new DbFacade and initializes the metadata if it is not there yet
     */
    Indexer.prototype.init = function (_a) {
        var user = _a.user, userGroupKey = _a.userGroupKey, retryOnError = _a.retryOnError, cacheInfo = _a.cacheInfo;
        return __awaiter(this, void 0, void 0, function () {
            var transaction, userEncDbKey, groupIdToEventBatches, e_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this._initParams = {
                            user: user,
                            groupKey: userGroupKey
                        };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 18, , 22]);
                        if (cacheInfo === null || cacheInfo === void 0 ? void 0 : cacheInfo.isPersistent) {
                            this._mail.setIsUsingOfflineCache(cacheInfo.isPersistent);
                        }
                        return [4 /*yield*/, this.db.dbFacade.open((0, DbFacade_1.b64UserIdHash)(user))];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.db.dbFacade.createTransaction(true, [exports.MetaDataOS])];
                    case 3:
                        transaction = _b.sent();
                        return [4 /*yield*/, transaction.get(exports.MetaDataOS, exports.Metadata.userEncDbKey)];
                    case 4:
                        userEncDbKey = _b.sent();
                        if (!!userEncDbKey) return [3 /*break*/, 6];
                        // database was opened for the first time - create new tables
                        return [4 /*yield*/, this._createIndexTables(user, userGroupKey)];
                    case 5:
                        // database was opened for the first time - create new tables
                        _b.sent();
                        return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, this._loadIndexTables(transaction, user, userGroupKey, userEncDbKey)];
                    case 7:
                        _b.sent();
                        _b.label = 8;
                    case 8: return [4 /*yield*/, transaction.wait()];
                    case 9:
                        _b.sent();
                        return [4 /*yield*/, this._worker.sendIndexState({
                                initializing: false,
                                mailIndexEnabled: this._mail.mailIndexingEnabled,
                                progress: 0,
                                currentMailIndexTimestamp: this._mail.currentIndexTimestamp,
                                indexedMailCount: 0,
                                failedIndexingUpTo: null
                            })];
                    case 10:
                        _b.sent();
                        this._core.startProcessing();
                        return [4 /*yield*/, this.indexOrLoadContactListIfNeeded(user, cacheInfo)];
                    case 11:
                        _b.sent();
                        return [4 /*yield*/, this._groupInfo.indexAllUserAndTeamGroupInfosForAdmin(user)];
                    case 12:
                        _b.sent();
                        return [4 /*yield*/, this._whitelabelChildIndexer.indexAllWhitelabelChildrenForAdmin(user)];
                    case 13:
                        _b.sent();
                        return [4 /*yield*/, this._mail.mailboxIndexingPromise];
                    case 14:
                        _b.sent();
                        return [4 /*yield*/, this._mail.indexMailboxes(user, this._mail.currentIndexTimestamp)];
                    case 15:
                        _b.sent();
                        return [4 /*yield*/, this._loadPersistentGroupData(user)];
                    case 16:
                        groupIdToEventBatches = _b.sent();
                        return [4 /*yield*/, this._loadNewEntities(groupIdToEventBatches)["catch"]((0, tutanota_utils_1.ofClass)(OutOfSyncError_1.OutOfSyncError, function (e) { return _this.disableMailIndexing("OutOfSyncError when loading new entities. " + e.message); }))];
                    case 17:
                        _b.sent();
                        return [3 /*break*/, 22];
                    case 18:
                        e_1 = _b.sent();
                        if (!(retryOnError !== false && (e_1 instanceof MembershipRemovedError_1.MembershipRemovedError || e_1 instanceof InvalidDatabaseStateError_1.InvalidDatabaseStateError))) return [3 /*break*/, 19];
                        // in case of MembershipRemovedError mail or contact group has been removed from user.
                        // in case of InvalidDatabaseError no group id has been stored to the database.
                        // disable mail indexing and init index again in both cases.
                        // do not use this.disableMailIndexing() because db.initialized is not yet resolved.
                        // initialized promise will be resolved in this.init later.
                        console.log("disable mail indexing and init again", e_1);
                        return [2 /*return*/, this._reCreateIndex()];
                    case 19: return [4 /*yield*/, this._worker.sendIndexState({
                            initializing: false,
                            mailIndexEnabled: this._mail.mailIndexingEnabled,
                            progress: 0,
                            currentMailIndexTimestamp: this._mail.currentIndexTimestamp,
                            indexedMailCount: 0,
                            failedIndexingUpTo: this._mail.currentIndexTimestamp,
                            error: e_1 instanceof RestError_1.ConnectionError
                                ? 1 /* IndexingErrorReason.ConnectionLost */
                                : 0 /* IndexingErrorReason.Unknown */
                        })];
                    case 20:
                        _b.sent();
                        this._dbInitializedDeferredObject.reject(e_1);
                        throw e_1;
                    case 21: return [3 /*break*/, 22];
                    case 22: return [2 /*return*/];
                }
            });
        });
    };
    Indexer.prototype.indexOrLoadContactListIfNeeded = function (user, cacheInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var contactList, indexTimestamp, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, this._entity.loadRoot(TypeRefs_js_2.ContactListTypeRef, user.userGroup.group)];
                    case 1:
                        contactList = _a.sent();
                        return [4 /*yield*/, this._contact.getIndexTimestamp(contactList)];
                    case 2:
                        indexTimestamp = _a.sent();
                        if (!(indexTimestamp === TutanotaConstants_1.NOTHING_INDEXED_TIMESTAMP)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this._contact.indexFullContactList(contactList)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        if (!(cacheInfo === null || cacheInfo === void 0 ? void 0 : cacheInfo.isNewOfflineDb)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this._entity.loadAll(TypeRefs_js_2.ContactTypeRef, contactList.contacts)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        e_2 = _a.sent();
                        // external users have no contact list.
                        if (!(e_2 instanceof RestError_1.NotFoundError)) {
                            throw e_2;
                        }
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Indexer.prototype.enableMailIndexing = function () {
        var _this = this;
        return this.db.initialized.then(function () {
            return _this._mail.enableMailIndexing(_this._initParams.user).then(function () {
                // We don't have to disable mail indexing when it's stopped now
                _this._mail.mailboxIndexingPromise["catch"]((0, tutanota_utils_1.ofClass)(CancelledError_1.CancelledError, tutanota_utils_1.noOp));
            });
        });
    };
    /**
     * @param reason: To pass to the debug logger for find the reason that this is happening at updates
     * @returns {Promise<R>|Promise<void>}
     */
    Indexer.prototype.disableMailIndexing = function (reason) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.initialized];
                    case 1:
                        _a.sent();
                        if (!!this._core.isStoppedProcessing()) return [3 /*break*/, 4];
                        this._core.stopProcessing();
                        return [4 /*yield*/, this._mail.disableMailIndexing()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.init({ user: this._initParams.user, userGroupKey: this._initParams.groupKey })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Indexer.prototype.extendMailIndex = function (newOldestTimestamp) {
        return this._mail.extendIndexIfNeeded(this._initParams.user, newOldestTimestamp);
    };
    Indexer.prototype.cancelMailIndexing = function () {
        return this._mail.cancelMailIndexing();
    };
    Indexer.prototype.addBatchesToQueue = function (batches) {
        this._realtimeEventQueue.addBatches(batches);
    };
    Indexer.prototype.startProcessing = function () {
        this._core.queue.start();
    };
    Indexer.prototype.onVisibilityChanged = function (visible) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this._core.onVisibilityChanged(visible);
                return [2 /*return*/];
            });
        });
    };
    Indexer.prototype._reCreateIndex = function () {
        var _this = this;
        var mailIndexingWasEnabled = this._mail.mailIndexingEnabled;
        return this._mail.disableMailIndexing().then(function () {
            // do not try to init again on error
            return _this.init({
                user: _this._initParams.user,
                userGroupKey: _this._initParams.groupKey,
                retryOnError: false
            }).then(function () {
                if (mailIndexingWasEnabled) {
                    return _this.enableMailIndexing();
                }
            });
        });
    };
    Indexer.prototype._createIndexTables = function (user, userGroupKey) {
        return __awaiter(this, void 0, void 0, function () {
            var groupBatches, transaction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.db.key = (0, tutanota_crypto_1.aes256RandomKey)();
                        this.db.iv = tutanota_crypto_1.random.generateRandomData(tutanota_crypto_1.IV_BYTE_LENGTH);
                        return [4 /*yield*/, this._loadGroupData(user)];
                    case 1:
                        groupBatches = _a.sent();
                        return [4 /*yield*/, this.db.dbFacade.createTransaction(false, [exports.MetaDataOS, exports.GroupDataOS])];
                    case 2:
                        transaction = _a.sent();
                        return [4 /*yield*/, transaction.put(exports.MetaDataOS, exports.Metadata.userEncDbKey, (0, tutanota_crypto_1.encrypt256Key)(userGroupKey, this.db.key))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, transaction.put(exports.MetaDataOS, exports.Metadata.mailIndexingEnabled, this._mail.mailIndexingEnabled)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, transaction.put(exports.MetaDataOS, exports.Metadata.excludedListIds, this._mail._excludedListIds)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, transaction.put(exports.MetaDataOS, exports.Metadata.encDbIv, (0, tutanota_crypto_1.aes256Encrypt)(this.db.key, this.db.iv, tutanota_crypto_1.random.generateRandomData(tutanota_crypto_1.IV_BYTE_LENGTH), true, false))];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, transaction.put(exports.MetaDataOS, exports.Metadata.lastEventIndexTimeMs, this._entityRestClient.getRestClient().getServerTimestampMs())];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, this._initGroupData(groupBatches, transaction)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, this._updateIndexedGroups()];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, this._dbInitializedDeferredObject.resolve()];
                    case 10:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Indexer.prototype._loadIndexTables = function (transaction, user, userGroupKey, userEncDbKey) {
        return __awaiter(this, void 0, void 0, function () {
            var encDbIv;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.db.key = (0, tutanota_crypto_1.decrypt256Key)(userGroupKey, userEncDbKey);
                        return [4 /*yield*/, transaction.get(exports.MetaDataOS, exports.Metadata.encDbIv)];
                    case 1:
                        encDbIv = _a.sent();
                        this.db.iv = (0, tutanota_crypto_1.aes256Decrypt)(this.db.key, (0, tutanota_utils_1.neverNull)(encDbIv), true, false);
                        return [4 /*yield*/, Promise.all([
                                transaction.get(exports.MetaDataOS, exports.Metadata.mailIndexingEnabled).then(function (mailIndexingEnabled) {
                                    _this._mail.mailIndexingEnabled = (0, tutanota_utils_1.neverNull)(mailIndexingEnabled);
                                }),
                                transaction.get(exports.MetaDataOS, exports.Metadata.excludedListIds).then(function (excludedListIds) {
                                    _this._mail._excludedListIds = (0, tutanota_utils_1.neverNull)(excludedListIds);
                                }),
                                this._loadGroupDiff(user)
                                    .then(function (groupDiff) { return _this._updateGroups(user, groupDiff); })
                                    .then(function () { return _this._mail.updateCurrentIndexTimestamp(user); }),
                            ])];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this._updateIndexedGroups()];
                    case 3:
                        _a.sent();
                        this._dbInitializedDeferredObject.resolve();
                        return [4 /*yield*/, Promise.all([
                                this._contact.suggestionFacade.load(),
                                this._groupInfo.suggestionFacade.load(),
                                this._whitelabelChildIndexer.suggestionFacade.load(),
                            ])];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Indexer.prototype._updateIndexedGroups = function () {
        return __awaiter(this, void 0, void 0, function () {
            var t, indexedGroupIds, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.db.dbFacade.createTransaction(true, [exports.GroupDataOS])];
                    case 1:
                        t = _b.sent();
                        _a = tutanota_utils_1.promiseMap;
                        return [4 /*yield*/, t.getAll(exports.GroupDataOS)];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent(), function (groupDataEntry) { return (0, tutanota_utils_1.downcast)(groupDataEntry.key); }])];
                    case 3:
                        indexedGroupIds = _b.sent();
                        if (indexedGroupIds.length === 0) {
                            // tried to index twice, this is probably not our fault
                            console.log("no group ids in database, disabling indexer");
                            this.disableMailIndexing("no group ids were found in the database");
                        }
                        this._indexedGroupIds = indexedGroupIds;
                        return [2 /*return*/];
                }
            });
        });
    };
    Indexer.prototype._loadGroupDiff = function (user) {
        var currentGroups = (0, IndexUtils_1.filterIndexMemberships)(user).map(function (m) {
            return {
                id: m.group,
                type: (0, TutanotaConstants_1.getMembershipGroupType)(m)
            };
        });
        return this.db.dbFacade.createTransaction(true, [exports.GroupDataOS]).then(function (t) {
            return t.getAll(exports.GroupDataOS).then(function (loadedGroups) {
                var oldGroups = loadedGroups.map(function (group) {
                    var id = (0, tutanota_utils_1.downcast)(group.key);
                    return {
                        id: id,
                        type: group.value.groupType
                    };
                });
                var deletedGroups = oldGroups.filter(function (oldGroup) { return currentGroups.find(function (m) { return m.id === oldGroup.id; }) == null; });
                var newGroups = currentGroups.filter(function (m) { return oldGroups.find(function (oldGroup) { return m.id === oldGroup.id; }) == null; });
                return {
                    deletedGroups: deletedGroups,
                    newGroups: newGroups
                };
            });
        });
    };
    /**
     *
     * Initializes the index db for new groups of the user, but does not start the actual indexing for those groups.
     * If the user was removed from a contact or mail group the function throws a CancelledError to delete the complete mail index afterwards.
     */
    Indexer.prototype._updateGroups = function (user, groupDiff) {
        var _this = this;
        if (groupDiff.deletedGroups.some(function (g) { return g.type === TutanotaConstants_1.GroupType.Mail || g.type === TutanotaConstants_1.GroupType.Contact; })) {
            return Promise.reject(new MembershipRemovedError_1.MembershipRemovedError("user has been removed from contact or mail group")); // user has been removed from a shared group
        }
        else if (groupDiff.newGroups.length > 0) {
            return this._loadGroupData(user, groupDiff.newGroups.map(function (g) { return g.id; })).then(function (groupBatches) {
                return _this.db.dbFacade.createTransaction(false, [exports.GroupDataOS]).then(function (t) {
                    return _this._initGroupData(groupBatches, t);
                });
            });
        }
        return Promise.resolve();
    };
    /**
     * Provides a GroupData object including the last 100 event batch ids for all indexed membership groups of the given user.
     */
    Indexer.prototype._loadGroupData = function (user, restrictToTheseGroups) {
        var _this = this;
        var memberships = (0, IndexUtils_1.filterIndexMemberships)(user);
        var restrictTo = restrictToTheseGroups; // type check
        if (restrictTo) {
            memberships = memberships.filter(function (membership) { return (0, tutanota_utils_1.contains)(restrictTo, membership.group); });
        }
        return (0, tutanota_utils_1.promiseMap)(memberships, function (membership) {
            // we only need the latest EntityEventBatch to synchronize the index state after reconnect. The lastBatchIds are filled up to 100 with each event we receive.
            return _this._entity
                .loadRange(TypeRefs_js_1.EntityEventBatchTypeRef, membership.group, EntityUtils_1.GENERATED_MAX_ID, 1, true)
                .then(function (eventBatches) {
                return {
                    groupId: membership.group,
                    groupData: {
                        lastBatchIds: eventBatches.map(function (eventBatch) { return eventBatch._id[1]; }),
                        indexTimestamp: TutanotaConstants_1.NOTHING_INDEXED_TIMESTAMP,
                        groupType: (0, TutanotaConstants_1.getMembershipGroupType)(membership)
                    }
                };
            })["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotAuthorizedError, function () {
                console.log("could not download entity updates => lost permission on list");
                return null;
            }));
        }) // sequentially to avoid rate limiting
            .then(function (data) { return data.filter(tutanota_utils_1.isNotNull); });
    };
    /**
     * creates the initial group data for all provided group ids
     */
    Indexer.prototype._initGroupData = function (groupBatches, t2) {
        groupBatches.forEach(function (groupIdToLastBatchId) {
            t2.put(exports.GroupDataOS, groupIdToLastBatchId.groupId, groupIdToLastBatchId.groupData);
        });
        return t2.wait();
    };
    Indexer.prototype._loadNewEntities = function (groupIdToEventBatches) {
        return __awaiter(this, void 0, void 0, function () {
            var batchesOfAllGroups, lastLoadedBatchIdInGroup, transaction, lastIndexTimeMs, _i, groupIdToEventBatches_1, groupIdToEventBatch, startId, eventBatchesOnServer, batchesToQueue, _a, eventBatchesOnServer_1, batch, batchId, lastBatch, e_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        batchesOfAllGroups = [];
                        lastLoadedBatchIdInGroup = new Map();
                        return [4 /*yield*/, this.db.dbFacade.createTransaction(true, [exports.MetaDataOS])];
                    case 1:
                        transaction = _b.sent();
                        return [4 /*yield*/, transaction.get(exports.MetaDataOS, exports.Metadata.lastEventIndexTimeMs)];
                    case 2:
                        lastIndexTimeMs = _b.sent();
                        return [4 /*yield*/, this._throwIfOutOfDate()];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        _b.trys.push([4, 9, , 10]);
                        _i = 0, groupIdToEventBatches_1 = groupIdToEventBatches;
                        _b.label = 5;
                    case 5:
                        if (!(_i < groupIdToEventBatches_1.length)) return [3 /*break*/, 8];
                        groupIdToEventBatch = groupIdToEventBatches_1[_i];
                        if (!(groupIdToEventBatch.eventBatchIds.length > 0)) return [3 /*break*/, 7];
                        startId = this._getStartIdForLoadingMissedEventBatches(groupIdToEventBatch.eventBatchIds);
                        eventBatchesOnServer = [];
                        return [4 /*yield*/, this._entity.loadAll(TypeRefs_js_1.EntityEventBatchTypeRef, groupIdToEventBatch.groupId, startId)];
                    case 6:
                        eventBatchesOnServer = _b.sent();
                        batchesToQueue = [];
                        for (_a = 0, eventBatchesOnServer_1 = eventBatchesOnServer; _a < eventBatchesOnServer_1.length; _a++) {
                            batch = eventBatchesOnServer_1[_a];
                            batchId = (0, EntityUtils_1.getElementId)(batch);
                            if (groupIdToEventBatch.eventBatchIds.indexOf(batchId) === -1 && (0, EntityUtils_1.firstBiggerThanSecond)(batchId, startId)) {
                                batchesToQueue.push({
                                    groupId: groupIdToEventBatch.groupId,
                                    batchId: batchId,
                                    events: batch.events
                                });
                                lastBatch = lastLoadedBatchIdInGroup.get(groupIdToEventBatch.groupId);
                                if (lastBatch == null || (0, EntityUtils_1.firstBiggerThanSecond)(batchId, lastBatch)) {
                                    lastLoadedBatchIdInGroup.set(groupIdToEventBatch.groupId, batchId);
                                }
                            }
                        }
                        // Good scenario: we know when we stopped, we can process events we did not process yet and catch up the server
                        //
                        //
                        // [4, 3, 2, 1]                          - processed events, lastBatchId =1
                        // load from lowest id 1 -1
                        // [0.9, 1, 2, 3, 4, 5, 6, 7, 8]         - last X events from server
                        // => [5, 6, 7, 8]                       - batches to queue
                        //
                        // Bad scenario: we don' know where we stopped, server doesn't have events to fill the gap anymore, we cannot fix the index.
                        // [4, 3, 2, 1] - processed events, lastBatchId = 1
                        // [7, 5, 9, 10] - last events from server
                        // => [7, 5, 9, 10] - batches to queue - nothing has been processed before so we are out of sync
                        // We only want to do this check for clients that haven't yet saved the index time
                        // This can be removed in the future
                        if (lastIndexTimeMs == null && eventBatchesOnServer.length === batchesToQueue.length) {
                            // Bad scenario happened.
                            // None of the events we want to process were processed before, we're too far away, stop the process and delete
                            // the index.
                            throw new OutOfSyncError_1.OutOfSyncError("We lost entity events for group ".concat(groupIdToEventBatch.groupId, ". start id was ").concat(startId));
                        }
                        batchesOfAllGroups.push.apply(batchesOfAllGroups, batchesToQueue);
                        _b.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 5];
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        e_3 = _b.sent();
                        if (e_3 instanceof RestError_1.NotAuthorizedError) {
                            console.log("could not download entity updates => lost permission on list");
                            return [2 /*return*/];
                        }
                        throw e_3;
                    case 10:
                        // add all batches of all groups in one step to avoid that just some groups are added when a ServiceUnavailableError occurs
                        // Add them directly to the core so that they are added before the realtime batches
                        this._core.addBatchesToQueue(batchesOfAllGroups);
                        // Add latest batches per group so that we can filter out overlapping realtime updates later
                        this._initiallyLoadedBatchIdsPerGroup = lastLoadedBatchIdInGroup;
                        this._realtimeEventQueue.resume();
                        this.startProcessing();
                        return [4 /*yield*/, this._writeServerTimestamp()];
                    case 11:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Indexer.prototype._getStartIdForLoadingMissedEventBatches = function (lastEventBatchIds) {
        var newestBatchId = lastEventBatchIds[0];
        var oldestBatchId = lastEventBatchIds[lastEventBatchIds.length - 1];
        // load all EntityEventBatches which are not older than 1 minute before the newest batch
        // to be able to get batches that were overtaken by the newest batch and therefore missed before
        var startId = (0, EntityUtils_1.timestampToGeneratedId)((0, EntityUtils_1.generatedIdToTimestamp)(newestBatchId) - 1000 * 60);
        // do not load events that are older than the stored events
        if (!(0, EntityUtils_1.firstBiggerThanSecond)(startId, oldestBatchId)) {
            // reduce the generated id by a millisecond in order to fetch the instance with lastBatchId, too (would throw OutOfSync, otherwise if the instance with lasBatchId is the only one in the list)
            startId = (0, EntityUtils_1.timestampToGeneratedId)((0, EntityUtils_1.generatedIdToTimestamp)(oldestBatchId) - 1);
        }
        return startId;
    };
    /**
     * @private a map from group id to event batches
     */
    Indexer.prototype._loadPersistentGroupData = function (user) {
        var _this = this;
        return this.db.dbFacade.createTransaction(true, [exports.GroupDataOS]).then(function (t) {
            return Promise.all((0, IndexUtils_1.filterIndexMemberships)(user).map(function (membership) {
                return t.get(exports.GroupDataOS, membership.group).then(function (groupData) {
                    if (groupData) {
                        return {
                            groupId: membership.group,
                            eventBatchIds: groupData.lastBatchIds
                        };
                    }
                    else {
                        throw new InvalidDatabaseStateError_1.InvalidDatabaseStateError("no group data for group " + membership.group + " indexedGroupIds: " + _this._indexedGroupIds.join(","));
                    }
                });
            }));
        });
    };
    Indexer.prototype._processEntityEvents = function (batch) {
        var _this = this;
        var events = batch.events, groupId = batch.groupId, batchId = batch.batchId;
        return this.db.initialized
            .then(function () { return __awaiter(_this, void 0, void 0, function () {
            var groupedEvents;
            var _this = this;
            return __generator(this, function (_a) {
                if (!this.db.dbFacade.indexingSupported) {
                    return [2 /*return*/, Promise.resolve()];
                }
                if ((0, IndexUtils_1.filterIndexMemberships)(this._initParams.user)
                    .map(function (m) { return m.group; })
                    .indexOf(groupId) === -1) {
                    return [2 /*return*/, Promise.resolve()];
                }
                if (this._indexedGroupIds.indexOf(groupId) === -1) {
                    return [2 /*return*/, Promise.resolve()];
                }
                (0, IndexUtils_1.markStart)("processEntityEvents");
                groupedEvents = new Map() // define map first because Webstorm has problems with type annotations
                ;
                events.reduce(function (all, update) {
                    if ((0, tutanota_utils_1.isSameTypeRefByAttr)(TypeRefs_js_2.MailTypeRef, update.application, update.type)) {
                        (0, tutanota_utils_1.getFromMap)(all, TypeRefs_js_2.MailTypeRef, function () { return []; }).push(update);
                    }
                    else if ((0, tutanota_utils_1.isSameTypeRefByAttr)(TypeRefs_js_2.ContactTypeRef, update.application, update.type)) {
                        (0, tutanota_utils_1.getFromMap)(all, TypeRefs_js_2.ContactTypeRef, function () { return []; }).push(update);
                    }
                    else if ((0, tutanota_utils_1.isSameTypeRefByAttr)(TypeRefs_js_1.GroupInfoTypeRef, update.application, update.type)) {
                        (0, tutanota_utils_1.getFromMap)(all, TypeRefs_js_1.GroupInfoTypeRef, function () { return []; }).push(update);
                    }
                    else if ((0, tutanota_utils_1.isSameTypeRefByAttr)(TypeRefs_js_1.UserTypeRef, update.application, update.type)) {
                        (0, tutanota_utils_1.getFromMap)(all, TypeRefs_js_1.UserTypeRef, function () { return []; }).push(update);
                    }
                    else if ((0, tutanota_utils_1.isSameTypeRefByAttr)(TypeRefs_js_1.WhitelabelChildTypeRef, update.application, update.type)) {
                        (0, tutanota_utils_1.getFromMap)(all, TypeRefs_js_1.WhitelabelChildTypeRef, function () { return []; }).push(update);
                    }
                    return all;
                }, groupedEvents);
                (0, IndexUtils_1.markStart)("processEvent");
                return [2 /*return*/, (0, tutanota_utils_1.promiseMap)(groupedEvents.entries(), function (_a) {
                        var key = _a[0], value = _a[1];
                        var promise = Promise.resolve();
                        if ((0, tutanota_utils_1.isSameTypeRef)(TypeRefs_js_1.UserTypeRef, key)) {
                            return _this._processUserEntityEvents(value);
                        }
                        var indexUpdate = (0, IndexUtils_1._createNewIndexUpdate)((0, IndexUtils_1.typeRefToTypeInfo)(key));
                        if ((0, tutanota_utils_1.isSameTypeRef)(TypeRefs_js_2.MailTypeRef, key)) {
                            promise = _this._mail.processEntityEvents(value, groupId, batchId, indexUpdate);
                        }
                        else if ((0, tutanota_utils_1.isSameTypeRef)(TypeRefs_js_2.ContactTypeRef, key)) {
                            promise = _this._contact.processEntityEvents(value, groupId, batchId, indexUpdate);
                        }
                        else if ((0, tutanota_utils_1.isSameTypeRef)(TypeRefs_js_1.GroupInfoTypeRef, key)) {
                            promise = _this._groupInfo.processEntityEvents(value, groupId, batchId, indexUpdate, _this._initParams.user);
                        }
                        else if ((0, tutanota_utils_1.isSameTypeRef)(TypeRefs_js_1.UserTypeRef, key)) {
                            promise = _this._processUserEntityEvents(value);
                        }
                        else if ((0, tutanota_utils_1.isSameTypeRef)(TypeRefs_js_1.WhitelabelChildTypeRef, key)) {
                            promise = _this._whitelabelChildIndexer.processEntityEvents(value, groupId, batchId, indexUpdate, _this._initParams.user);
                        }
                        return promise
                            .then(function () {
                            (0, IndexUtils_1.markEnd)("processEvent");
                            (0, IndexUtils_1.markStart)("writeIndexUpdate");
                            return _this._core.writeIndexUpdateWithBatchId(groupId, batchId, indexUpdate);
                        })
                            .then(function () {
                            (0, IndexUtils_1.markEnd)("writeIndexUpdate");
                            (0, IndexUtils_1.markEnd)("processEntityEvents"); // if (!env.dist && env.mode !== "Test") {
                            // 	printMeasure("Update of " + key.type + " " + batch.events.map(e => operationTypeKeys[e.operation]).join(","), [
                            // 		"processEntityEvents", "processEvent", "writeIndexUpdate"
                            // 	])
                            // }
                        });
                    })];
            });
        }); })["catch"]((0, tutanota_utils_1.ofClass)(CancelledError_1.CancelledError, tutanota_utils_1.noOp))["catch"]((0, tutanota_utils_1.ofClass)(DbError_1.DbError, function (e) {
            if (_this._core.isStoppedProcessing()) {
                console.log("Ignoring DBerror when indexing is disabled", e);
            }
            else {
                throw e;
            }
        }))["catch"]((0, tutanota_utils_1.ofClass)(InvalidDatabaseStateError_1.InvalidDatabaseStateError, function (e) {
            console.log("InvalidDatabaseStateError during _processEntityEvents");
            _this._core.stopProcessing();
            return _this._reCreateIndex();
        }));
    };
    Indexer.prototype._processUserEntityEvents = function (events) {
        var _this = this;
        return Promise.all(events.map(function (event) {
            if (event.operation === "1" /* OperationType.UPDATE */ && (0, EntityUtils_1.isSameId)(_this._initParams.user._id, event.instanceId)) {
                return _this._entity.load(TypeRefs_js_1.UserTypeRef, event.instanceId).then(function (updatedUser) {
                    _this._initParams.user = updatedUser;
                });
            }
            return Promise.resolve();
        })).then(tutanota_utils_1.noOp);
    };
    Indexer.prototype._throwIfOutOfDate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var transaction, lastIndexTimeMs, now, timeSinceLastIndex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.dbFacade.createTransaction(true, [exports.MetaDataOS])];
                    case 1:
                        transaction = _a.sent();
                        return [4 /*yield*/, transaction.get(exports.MetaDataOS, exports.Metadata.lastEventIndexTimeMs)];
                    case 2:
                        lastIndexTimeMs = _a.sent();
                        if (lastIndexTimeMs != null) {
                            now = this._entityRestClient.getRestClient().getServerTimestampMs();
                            timeSinceLastIndex = now - lastIndexTimeMs;
                            if (timeSinceLastIndex >= (0, tutanota_utils_1.daysToMillis)(TutanotaConstants_1.ENTITY_EVENT_BATCH_TTL_DAYS)) {
                                throw new OutOfSyncError_1.OutOfSyncError("we haven't updated the index in ".concat((0, tutanota_utils_1.millisToDays)(timeSinceLastIndex), " days. last update was ").concat(new Date((0, tutanota_utils_1.neverNull)(lastIndexTimeMs)).toString()));
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Indexer.prototype._writeServerTimestamp = function () {
        return __awaiter(this, void 0, void 0, function () {
            var transaction, now;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.dbFacade.createTransaction(false, [exports.MetaDataOS])];
                    case 1:
                        transaction = _a.sent();
                        now = this._entityRestClient.getRestClient().getServerTimestampMs();
                        return [4 /*yield*/, transaction.put(exports.MetaDataOS, exports.Metadata.lastEventIndexTimeMs, now)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Indexer;
}());
exports.Indexer = Indexer;
