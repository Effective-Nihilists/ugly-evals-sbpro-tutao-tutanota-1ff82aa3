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
exports._getCurrentIndexTimestamp = exports.MailIndexer = exports.MAIL_INDEXER_CHUNK = exports.INITIAL_MAIL_INDEX_INTERVAL_DAYS = void 0;
var TutanotaConstants_1 = require("../../common/TutanotaConstants");
var TypeRefs_js_1 = require("../../entities/tutanota/TypeRefs.js");
var RestError_1 = require("../../common/error/RestError");
var TypeModels_1 = require("../../entities/tutanota/TypeModels");
var Utils_1 = require("../../common/utils/Utils");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var EntityUtils_1 = require("../../common/utils/EntityUtils");
var IndexUtils_1 = require("./IndexUtils");
var CancelledError_1 = require("../../common/error/CancelledError");
var Indexer_1 = require("./Indexer");
var DbError_1 = require("../../common/error/DbError");
var DefaultEntityRestCache_js_1 = require("../rest/DefaultEntityRestCache.js");
var EntityClient_1 = require("../../common/EntityClient");
var ProgressMonitor_1 = require("../../common/utils/ProgressMonitor");
var EphemeralCacheStorage_1 = require("../rest/EphemeralCacheStorage");
exports.INITIAL_MAIL_INDEX_INTERVAL_DAYS = 28;
var ENTITY_INDEXER_CHUNK = 20;
exports.MAIL_INDEXER_CHUNK = 100;
var MAIL_INDEX_BATCH_INTERVAL = 1000 * 60 * 60 * 24; // one day
var MailIndexer = /** @class */ (function () {
    function MailIndexer(core, db, worker, entityRestClient, defaultCachingRestClient, dateProvider) {
        this.isIndexing = false;
        this.isUsingOfflineCache = false;
        this._core = core;
        this._db = db;
        this._defaultCachingEntityRestClient = defaultCachingRestClient;
        this._defaultCachingEntity = new EntityClient_1.EntityClient(defaultCachingRestClient);
        this._worker = worker;
        this.currentIndexTimestamp = TutanotaConstants_1.NOTHING_INDEXED_TIMESTAMP;
        this.mailIndexingEnabled = false;
        this.mailboxIndexingPromise = Promise.resolve();
        this._indexingCancelled = false;
        this._excludedListIds = [];
        this._entityRestClient = entityRestClient;
        this._dateProvider = dateProvider;
    }
    MailIndexer.prototype.setIsUsingOfflineCache = function (isUsing) {
        this.isUsingOfflineCache = isUsing;
    };
    MailIndexer.prototype.createMailIndexEntries = function (mail, mailBody, files) {
        var startTimeIndex = (0, IndexUtils_1.getPerformanceTimestamp)();
        var MailModel = TypeModels_1.typeModels.Mail;
        var keyToIndexEntries = this._core.createIndexEntriesForAttributes(mail, [
            {
                attribute: MailModel.values["subject"],
                value: function () { return mail.subject; }
            },
            {
                attribute: MailModel.associations["toRecipients"],
                value: function () { return mail.toRecipients.map(function (r) { return r.name + " <" + r.address + ">"; }).join(","); }
            },
            {
                attribute: MailModel.associations["ccRecipients"],
                value: function () { return mail.ccRecipients.map(function (r) { return r.name + " <" + r.address + ">"; }).join(","); }
            },
            {
                attribute: MailModel.associations["bccRecipients"],
                value: function () { return mail.bccRecipients.map(function (r) { return r.name + " <" + r.address + ">"; }).join(","); }
            },
            {
                attribute: MailModel.associations["sender"],
                value: function () { return (mail.sender ? mail.sender.name + " <" + mail.sender.address + ">" : ""); }
            },
            {
                attribute: MailModel.associations["body"],
                // Sometimes we encounter inconsistencies such as when deleted emails appear again
                value: function () { return (mailBody != null ? (0, IndexUtils_1.htmlToText)((0, Utils_1.getMailBodyText)(mailBody)) : ""); }
            },
            {
                attribute: MailModel.associations["attachments"],
                value: function () { return files.map(function (file) { return file.name; }).join(" "); }
            },
        ]);
        this._core._stats.indexingTime += (0, IndexUtils_1.getPerformanceTimestamp)() - startTimeIndex;
        return keyToIndexEntries;
    };
    MailIndexer.prototype.processNewMail = function (event) {
        var _this = this;
        if (this._isExcluded(event)) {
            return Promise.resolve(null);
        }
        return this._defaultCachingEntity
            .load(TypeRefs_js_1.MailTypeRef, [event.instanceListId, event.instanceId])
            .then(function (mail) {
            return Promise.all([
                (0, tutanota_utils_1.promiseMap)(mail.attachments, function (attachmentId) { return _this._defaultCachingEntity.load(TypeRefs_js_1.FileTypeRef, attachmentId); }),
                _this._defaultCachingEntity.load(TypeRefs_js_1.MailBodyTypeRef, mail.body),
            ]).then(function (_a) {
                var files = _a[0], body = _a[1];
                var keyToIndexEntries = _this.createMailIndexEntries(mail, body, files);
                return {
                    mail: mail,
                    keyToIndexEntries: keyToIndexEntries
                };
            });
        })["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotFoundError, function () {
            console.log("tried to index non existing mail");
            return null;
        }))["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotAuthorizedError, function () {
            console.log("tried to index contact without permission");
            return null;
        }));
    };
    MailIndexer.prototype.processMovedMail = function (event, indexUpdate) {
        var _this = this;
        var encInstanceId = (0, IndexUtils_1.encryptIndexKeyBase64)(this._db.key, event.instanceId, this._db.iv);
        return this._db.dbFacade.createTransaction(true, [Indexer_1.ElementDataOS]).then(function (transaction) {
            return transaction.get(Indexer_1.ElementDataOS, encInstanceId).then(function (elementData) {
                if (elementData) {
                    if (_this._isExcluded(event)) {
                        return _this._core._processDeleted(event, indexUpdate); // move to spam folder
                    }
                    else {
                        indexUpdate.move.push({
                            encInstanceId: encInstanceId,
                            newListId: event.instanceListId
                        });
                    }
                }
                else {
                    // instance is moved but not yet indexed: handle as new for example moving a mail from non indexed folder like spam to indexed folder
                    return _this.processNewMail(event).then(function (result) {
                        if (result) {
                            _this._core.encryptSearchIndexEntries(result.mail._id, (0, tutanota_utils_1.neverNull)(result.mail._ownerGroup), result.keyToIndexEntries, indexUpdate);
                        }
                    });
                }
            });
        });
    };
    MailIndexer.prototype.enableMailIndexing = function (user) {
        var _this = this;
        return this._db.dbFacade.createTransaction(true, [Indexer_1.MetaDataOS]).then(function (t) {
            return t.get(Indexer_1.MetaDataOS, Indexer_1.Metadata.mailIndexingEnabled).then(function (enabled) {
                if (!enabled) {
                    return (0, tutanota_utils_1.promiseMap)((0, IndexUtils_1.filterMailMemberships)(user), function (mailGroupMembership) { return _this._getSpamFolder(mailGroupMembership); }).then(function (spamFolders) {
                        _this._excludedListIds = spamFolders.map(function (folder) { return folder.mails; });
                        _this.mailIndexingEnabled = true;
                        return _this._db.dbFacade.createTransaction(false, [Indexer_1.MetaDataOS]).then(function (t2) {
                            t2.put(Indexer_1.MetaDataOS, Indexer_1.Metadata.mailIndexingEnabled, true);
                            t2.put(Indexer_1.MetaDataOS, Indexer_1.Metadata.excludedListIds, _this._excludedListIds);
                            // create index in background, termination is handled in Indexer.enableMailIndexing
                            var oldestTimestamp = _this._dateProvider.getStartOfDayShiftedBy(-exports.INITIAL_MAIL_INDEX_INTERVAL_DAYS).getTime();
                            _this.indexMailboxes(user, oldestTimestamp)["catch"]((0, tutanota_utils_1.ofClass)(CancelledError_1.CancelledError, function (e) {
                                console.log("cancelled initial indexing", e);
                            }));
                            return t2.wait();
                        });
                    });
                }
                else {
                    return t.get(Indexer_1.MetaDataOS, Indexer_1.Metadata.excludedListIds).then(function (excludedListIds) {
                        _this.mailIndexingEnabled = true;
                        _this._excludedListIds = excludedListIds || [];
                    });
                }
            });
        });
    };
    MailIndexer.prototype.disableMailIndexing = function () {
        this.mailIndexingEnabled = false;
        this._indexingCancelled = true;
        this._excludedListIds = [];
        return this._db.dbFacade.deleteDatabase();
    };
    MailIndexer.prototype.cancelMailIndexing = function () {
        this._indexingCancelled = true;
        return Promise.resolve();
    };
    /**
     * Extend mail index if not indexed this range yet.
     * newOldestTimestamp should be aligned to the start of the day up until which you want to index, we don't do rounding inside here.
     */
    MailIndexer.prototype.extendIndexIfNeeded = function (user, newOldestTimestamp) {
        var _this = this;
        return this.mailboxIndexingPromise
            .then(function () {
            if (_this.currentIndexTimestamp > TutanotaConstants_1.FULL_INDEXED_TIMESTAMP && _this.currentIndexTimestamp > newOldestTimestamp) {
                _this.indexMailboxes(user, newOldestTimestamp)["catch"]((0, tutanota_utils_1.ofClass)(CancelledError_1.CancelledError, function (e) {
                    console.log("extend mail index has been cancelled", e);
                }));
                return _this.mailboxIndexingPromise;
            }
        })["catch"]((0, tutanota_utils_1.ofClass)(CancelledError_1.CancelledError, function (e) {
            console.log("extend mail index has been cancelled", e);
        }));
    };
    /**
     * Indexes all mailboxes of the given user up to the endIndexTimestamp if mail indexing is enabled. If the mailboxes are already fully indexed, they are not indexed again.
     */
    MailIndexer.prototype.indexMailboxes = function (user, oldestTimestamp) {
        return __awaiter(this, void 0, void 0, function () {
            var memberships, mailBoxes, _i, memberships_1, mailGroupMembership, mailGroupId, mailboxGroupRoot, mailbox, transaction, groupData, newestTimestamp, e_1, success, failedIndexingUpTo, error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.mailIndexingEnabled) {
                            return [2 /*return*/, Promise.resolve()];
                        }
                        this.isIndexing = true;
                        this._indexingCancelled = false;
                        this._core.resetStats();
                        return [4 /*yield*/, this._worker.sendIndexState({
                                initializing: false,
                                mailIndexEnabled: this.mailIndexingEnabled,
                                progress: 1,
                                currentMailIndexTimestamp: this.currentIndexTimestamp,
                                indexedMailCount: 0,
                                failedIndexingUpTo: null
                            })];
                    case 1:
                        _a.sent();
                        memberships = (0, IndexUtils_1.filterMailMemberships)(user);
                        this._core.queue.pause();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 14, 17, 18]);
                        mailBoxes = [];
                        _i = 0, memberships_1 = memberships;
                        _a.label = 3;
                    case 3:
                        if (!(_i < memberships_1.length)) return [3 /*break*/, 9];
                        mailGroupMembership = memberships_1[_i];
                        mailGroupId = mailGroupMembership.group;
                        return [4 /*yield*/, this._defaultCachingEntity.load(TypeRefs_js_1.MailboxGroupRootTypeRef, mailGroupId)];
                    case 4:
                        mailboxGroupRoot = _a.sent();
                        return [4 /*yield*/, this._defaultCachingEntity.load(TypeRefs_js_1.MailBoxTypeRef, mailboxGroupRoot.mailbox)];
                    case 5:
                        mailbox = _a.sent();
                        return [4 /*yield*/, this._db.dbFacade.createTransaction(true, [Indexer_1.GroupDataOS])];
                    case 6:
                        transaction = _a.sent();
                        return [4 /*yield*/, transaction.get(Indexer_1.GroupDataOS, mailGroupId)
                            // group data is not available if group has been added. group will be indexed after login.
                        ];
                    case 7:
                        groupData = _a.sent();
                        // group data is not available if group has been added. group will be indexed after login.
                        if (groupData) {
                            newestTimestamp = groupData.indexTimestamp === TutanotaConstants_1.NOTHING_INDEXED_TIMESTAMP
                                ? this._dateProvider.getStartOfDayShiftedBy(1).getTime()
                                : groupData.indexTimestamp;
                            if (newestTimestamp > oldestTimestamp) {
                                mailBoxes.push({
                                    mbox: mailbox,
                                    newestTimestamp: newestTimestamp
                                });
                            }
                        }
                        _a.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 3];
                    case 9:
                        if (!(mailBoxes.length > 0)) return [3 /*break*/, 11];
                        return [4 /*yield*/, this._indexMailLists(mailBoxes, oldestTimestamp)];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11:
                        this._core.printStatus();
                        return [4 /*yield*/, this.updateCurrentIndexTimestamp(user)];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, this._worker.sendIndexState({
                                initializing: false,
                                mailIndexEnabled: this.mailIndexingEnabled,
                                progress: 0,
                                currentMailIndexTimestamp: this.currentIndexTimestamp,
                                indexedMailCount: this._core._stats.mailcount,
                                failedIndexingUpTo: null
                            })];
                    case 13:
                        _a.sent();
                        return [3 /*break*/, 18];
                    case 14:
                        e_1 = _a.sent();
                        console.warn("Mail indexing failed: ", e_1);
                        // avoid that a rejected promise is stored
                        this.mailboxIndexingPromise = Promise.resolve();
                        return [4 /*yield*/, this.updateCurrentIndexTimestamp(user)];
                    case 15:
                        _a.sent();
                        success = this._core.isStoppedProcessing() || e_1 instanceof CancelledError_1.CancelledError;
                        failedIndexingUpTo = success
                            ? null
                            : oldestTimestamp;
                        error = success
                            ? null
                            : e_1 instanceof RestError_1.ConnectionError
                                ? 1 /* IndexingErrorReason.ConnectionLost */
                                : 0 /* IndexingErrorReason.Unknown */;
                        return [4 /*yield*/, this._worker.sendIndexState({
                                initializing: false,
                                mailIndexEnabled: this.mailIndexingEnabled,
                                progress: 0,
                                currentMailIndexTimestamp: this.currentIndexTimestamp,
                                indexedMailCount: this._core._stats.mailcount,
                                failedIndexingUpTo: failedIndexingUpTo,
                                error: error
                            })];
                    case 16:
                        _a.sent();
                        return [3 /*break*/, 18];
                    case 17:
                        this._core.queue.resume();
                        this.isIndexing = false;
                        return [7 /*endfinally*/];
                    case 18: return [2 /*return*/];
                }
            });
        });
    };
    MailIndexer.prototype._indexMailLists = function (mailBoxes, oldestTimestamp) {
        var _this = this;
        var newestTimestamp = mailBoxes.reduce(function (acc, data) { return Math.max(acc, data.newestTimestamp); }, 0);
        var progress = new ProgressMonitor_1.ProgressMonitor(newestTimestamp - oldestTimestamp, function (progress) {
            _this._worker.sendIndexState({
                initializing: false,
                mailIndexEnabled: _this.mailIndexingEnabled,
                progress: progress,
                currentMailIndexTimestamp: _this.currentIndexTimestamp,
                indexedMailCount: _this._core._stats.mailcount,
                failedIndexingUpTo: null
            });
        });
        var indexUpdate = (0, IndexUtils_1._createNewIndexUpdate)((0, IndexUtils_1.typeRefToTypeInfo)(TypeRefs_js_1.MailTypeRef));
        var indexLoader = new IndexLoader(this._entityRestClient, this._defaultCachingEntityRestClient, this.isUsingOfflineCache);
        return (0, tutanota_utils_1.promiseMap)(mailBoxes, function (mBoxData) {
            return _this._loadMailListIds(mBoxData.mbox).then(function (mailListIds) {
                return {
                    mailListIds: mailListIds,
                    newestTimestamp: mBoxData.newestTimestamp,
                    ownerGroup: (0, tutanota_utils_1.neverNull)(mBoxData.mbox._ownerGroup)
                };
            });
        }).then(function (mailboxData) { return _this._indexMailListsInTimeBatches(mailboxData, [newestTimestamp, oldestTimestamp], indexUpdate, progress, indexLoader); });
    };
    MailIndexer.prototype._processedEnough = function (indexUpdate) {
        return indexUpdate.create.encInstanceIdToElementData.size > 500;
    };
    MailIndexer.prototype._indexMailListsInTimeBatches = function (dataPerMailbox, timeRange, indexUpdate, progress, indexLoader) {
        var _this = this;
        var rangeStart = timeRange[0], rangeEnd = timeRange[1];
        var batchEnd = rangeStart - MAIL_INDEX_BATCH_INTERVAL;
        // Make sure that we index up until aligned date and not more, otherwise it stays misaligned for user after changing the time zone once
        if (batchEnd < rangeEnd) {
            batchEnd = rangeEnd;
        }
        var mailboxesToWrite = dataPerMailbox.filter(function (mboxData) { return batchEnd < mboxData.newestTimestamp; });
        var batchRange = [rangeStart, batchEnd];
        // rangeStart is what we have indexed at the previous step. If it's equals to rangeEnd then we're done.
        // If it's less then we overdid a little bit but we've covered the range and we will write down rangeStart so
        // we will continue from it next time.
        if (rangeStart <= rangeEnd) {
            // all ranges have been processed
            var indexTimestampPerGroup = mailboxesToWrite.map(function (data) { return ({
                groupId: data.ownerGroup,
                indexTimestamp: data.mailListIds.length === 0 ? TutanotaConstants_1.FULL_INDEXED_TIMESTAMP : rangeStart
            }); });
            return this._writeIndexUpdate(indexTimestampPerGroup, indexUpdate).then(function () {
                progress.workDone(rangeStart - batchEnd);
            });
        }
        return this._prepareMailDataForTimeBatch(mailboxesToWrite, batchRange, indexUpdate, indexLoader).then(function () {
            var nextRange = [batchEnd, rangeEnd];
            if (_this._processedEnough(indexUpdate)) {
                // only write to database if we have collected enough entities
                var indexTimestampPerGroup = mailboxesToWrite.map(function (data) { return ({
                    groupId: data.ownerGroup,
                    indexTimestamp: data.mailListIds.length === 0 ? TutanotaConstants_1.FULL_INDEXED_TIMESTAMP : batchEnd
                }); });
                return _this._writeIndexUpdate(indexTimestampPerGroup, indexUpdate).then(function () {
                    progress.workDone(rangeStart - batchEnd);
                    var newIndexUpdate = (0, IndexUtils_1._createNewIndexUpdate)(indexUpdate.typeInfo);
                    return _this._indexMailListsInTimeBatches(dataPerMailbox, nextRange, newIndexUpdate, progress, indexLoader);
                });
            }
            else {
                progress.workDone(rangeStart - batchEnd);
                return _this._indexMailListsInTimeBatches(dataPerMailbox, nextRange, indexUpdate, progress, indexLoader);
            }
        });
    };
    /**
     * @return Number of processed emails?
     * @private
     */
    MailIndexer.prototype._prepareMailDataForTimeBatch = function (mboxDataList, timeRange, indexUpdate, indexLoader) {
        return __awaiter(this, void 0, void 0, function () {
            var startTimeLoad;
            var _this = this;
            return __generator(this, function (_a) {
                startTimeLoad = (0, IndexUtils_1.getPerformanceTimestamp)();
                return [2 /*return*/, (0, tutanota_utils_1.promiseMap)(mboxDataList, function (mboxData) {
                        return (0, tutanota_utils_1.promiseMap)(mboxData.mailListIds.slice(), function (listId) { return __awaiter(_this, void 0, void 0, function () {
                            var _a, mails, loadedCompletely;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, indexLoader.loadMailsWithCache(listId, timeRange)
                                        // If we loaded mail list completely, don't try to load from it anymore
                                    ];
                                    case 1:
                                        _a = _b.sent(), mails = _a.elements, loadedCompletely = _a.loadedCompletely;
                                        // If we loaded mail list completely, don't try to load from it anymore
                                        if (loadedCompletely) {
                                            mboxData.mailListIds.splice(mboxData.mailListIds.indexOf(listId), 1);
                                        }
                                        this._core._stats.mailcount += mails.length;
                                        // Remove all processed entities from cache
                                        return [4 /*yield*/, Promise.all(mails.map(function (m) { return indexLoader.removeFromCache(m._id); }))];
                                    case 2:
                                        // Remove all processed entities from cache
                                        _b.sent();
                                        return [2 /*return*/, this._processIndexMails(mails, indexUpdate, indexLoader)];
                                }
                            });
                        }); }, {
                            concurrency: 2
                        });
                    }, {
                        concurrency: 5
                    }).then(function () {
                        _this._core._stats.preparingTime += (0, IndexUtils_1.getPerformanceTimestamp)() - startTimeLoad;
                    })];
            });
        });
    };
    MailIndexer.prototype._processIndexMails = function (mails, indexUpdate, indexLoader) {
        var _this = this;
        if (this._indexingCancelled)
            throw new CancelledError_1.CancelledError("cancelled indexing in processing index mails");
        var bodies = indexLoader.loadMailBodies(mails);
        var files = indexLoader.loadAttachments(mails);
        return Promise.all([bodies, files])
            .then(function (_a) {
            var bodies = _a[0], files = _a[1];
            return mails
                .map(function (mail) {
                var body = bodies.find(function (b) { return (0, EntityUtils_1.isSameId)(b._id, mail.body); });
                if (body == null)
                    return null;
                return {
                    mail: mail,
                    body: body,
                    files: files.filter(function (file) { return mail.attachments.find(function (a) { return (0, EntityUtils_1.isSameId)(a, file._id); }); })
                };
            })
                .filter(tutanota_utils_1.isNotNull);
        })
            .then(function (mailWithBodyAndFiles) {
            mailWithBodyAndFiles.forEach(function (element) {
                var keyToIndexEntries = _this.createMailIndexEntries(element.mail, element.body, element.files);
                _this._core.encryptSearchIndexEntries(element.mail._id, (0, tutanota_utils_1.neverNull)(element.mail._ownerGroup), keyToIndexEntries, indexUpdate);
            });
        })
            .then(function () { return mails.length; });
    };
    MailIndexer.prototype._writeIndexUpdate = function (dataPerGroup, indexUpdate) {
        return this._core.writeIndexUpdate(dataPerGroup, indexUpdate);
    };
    MailIndexer.prototype.updateCurrentIndexTimestamp = function (user) {
        var _this = this;
        return this._db.dbFacade
            .createTransaction(true, [Indexer_1.GroupDataOS])
            .then(function (t) {
            return Promise.all((0, IndexUtils_1.filterMailMemberships)(user).map(function (mailGroupMembership) {
                return t.get(Indexer_1.GroupDataOS, mailGroupMembership.group).then(function (groupData) {
                    if (!groupData) {
                        return TutanotaConstants_1.NOTHING_INDEXED_TIMESTAMP;
                    }
                    else {
                        return groupData.indexTimestamp;
                    }
                });
            })).then(function (groupIndexTimestamps) {
                _this.currentIndexTimestamp = _getCurrentIndexTimestamp(groupIndexTimestamps);
            });
        })["catch"](function (err) {
            if (err instanceof DbError_1.DbError && _this._core.isStoppedProcessing()) {
                console.log("The database was closed, do not write currentIndexTimestamp");
            }
        });
    };
    MailIndexer.prototype._isExcluded = function (event) {
        return this._excludedListIds.indexOf(event.instanceListId) !== -1;
    };
    /**
     * Provides all non-excluded mail list ids of the given mailbox
     */
    MailIndexer.prototype._loadMailListIds = function (mailbox) {
        return __awaiter(this, void 0, void 0, function () {
            var folders, mailListIds, _i, folders_1, folder, subfolders;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._defaultCachingEntity.loadAll(TypeRefs_js_1.MailFolderTypeRef, (0, tutanota_utils_1.neverNull)(mailbox.systemFolders).folders)];
                    case 1:
                        folders = _a.sent();
                        mailListIds = [];
                        _i = 0, folders_1 = folders;
                        _a.label = 2;
                    case 2:
                        if (!(_i < folders_1.length)) return [3 /*break*/, 5];
                        folder = folders_1[_i];
                        if (!!this._excludedListIds.includes(folder.mails)) return [3 /*break*/, 4];
                        mailListIds.push(folder.mails);
                        return [4 /*yield*/, this._defaultCachingEntity.loadAll(TypeRefs_js_1.MailFolderTypeRef, folder.subFolders)];
                    case 3:
                        subfolders = _a.sent();
                        mailListIds.push.apply(mailListIds, subfolders.map(function (f) { return f.mails; }));
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, mailListIds];
                }
            });
        });
    };
    MailIndexer.prototype._getSpamFolder = function (mailGroup) {
        var _this = this;
        return this._defaultCachingEntity
            .load(TypeRefs_js_1.MailboxGroupRootTypeRef, mailGroup.group)
            .then(function (mailGroupRoot) { return _this._defaultCachingEntity.load(TypeRefs_js_1.MailBoxTypeRef, mailGroupRoot.mailbox); })
            .then(function (mbox) {
            return _this._defaultCachingEntity
                .loadAll(TypeRefs_js_1.MailFolderTypeRef, (0, tutanota_utils_1.neverNull)(mbox.systemFolders).folders)
                .then(function (folders) { return (0, tutanota_utils_1.neverNull)(folders.find(function (folder) { return folder.folderType === TutanotaConstants_1.MailFolderType.SPAM; })); });
        });
    };
    /**
     * Prepare IndexUpdate in response to the new entity events.
     * {@see MailIndexerTest.js}
     * @param events Events from one batch
     * @param groupId
     * @param batchId
     * @param indexUpdate which will be populated with operations
     * @returns {Promise<*>} Indication that we're done.
     */
    MailIndexer.prototype.processEntityEvents = function (events, groupId, batchId, indexUpdate) {
        var _this = this;
        if (!this.mailIndexingEnabled)
            return Promise.resolve();
        return (0, tutanota_utils_1.promiseMap)(events, function (event) {
            if (event.operation === "0" /* OperationType.CREATE */) {
                if ((0, Utils_1.containsEventOfType)(events, "2" /* OperationType.DELETE */, event.instanceId)) {
                    // do not execute move operation if there is a delete event or another move event.
                    return _this.processMovedMail(event, indexUpdate);
                }
                else {
                    return _this.processNewMail(event).then(function (result) {
                        if (result) {
                            _this._core.encryptSearchIndexEntries(result.mail._id, (0, tutanota_utils_1.neverNull)(result.mail._ownerGroup), result.keyToIndexEntries, indexUpdate);
                        }
                    });
                }
            }
            else if (event.operation === "1" /* OperationType.UPDATE */) {
                return _this._defaultCachingEntity
                    .load(TypeRefs_js_1.MailTypeRef, [event.instanceListId, event.instanceId])
                    .then(function (mail) {
                    if (mail.state === "0" /* MailState.DRAFT */) {
                        return Promise.all([
                            _this._core._processDeleted(event, indexUpdate),
                            _this.processNewMail(event).then(function (result) {
                                if (result) {
                                    _this._core.encryptSearchIndexEntries(result.mail._id, (0, tutanota_utils_1.neverNull)(result.mail._ownerGroup), result.keyToIndexEntries, indexUpdate);
                                }
                            }),
                        ]);
                    }
                })["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotFoundError, function () { return console.log("tried to index update event for non existing mail"); }));
            }
            else if (event.operation === "2" /* OperationType.DELETE */) {
                if (!(0, Utils_1.containsEventOfType)(events, "0" /* OperationType.CREATE */, event.instanceId)) {
                    // Check that this is *not* a move event. Move events are handled separately.
                    return _this._core._processDeleted(event, indexUpdate);
                }
            }
        }).then(tutanota_utils_1.noOp);
    };
    return MailIndexer;
}());
exports.MailIndexer = MailIndexer;
// export just for testing
function _getCurrentIndexTimestamp(groupIndexTimestamps) {
    var currentIndexTimestamp = TutanotaConstants_1.NOTHING_INDEXED_TIMESTAMP;
    groupIndexTimestamps.forEach(function (t, index) {
        if (index === 0) {
            currentIndexTimestamp = t;
        }
        else if (t === TutanotaConstants_1.NOTHING_INDEXED_TIMESTAMP) {
            // skip new group memberships
        }
        else if (t === TutanotaConstants_1.FULL_INDEXED_TIMESTAMP && currentIndexTimestamp !== TutanotaConstants_1.FULL_INDEXED_TIMESTAMP && currentIndexTimestamp !== TutanotaConstants_1.NOTHING_INDEXED_TIMESTAMP) {
            // skip full index timestamp if this is not the first mail group
        }
        else if (currentIndexTimestamp === TutanotaConstants_1.FULL_INDEXED_TIMESTAMP && t !== currentIndexTimestamp) {
            // find the oldest timestamp
            // mail index ist not fully indexed if one of the mailboxes is not fully indexed
            currentIndexTimestamp = t;
        }
        else if (t < currentIndexTimestamp) {
            // set the oldest index timestamp as current timestamp so all mailboxes can index to this timestamp during log in.
            currentIndexTimestamp = t;
        }
    });
    return currentIndexTimestamp;
}
exports._getCurrentIndexTimestamp = _getCurrentIndexTimestamp;
var IndexLoader = /** @class */ (function () {
    function IndexLoader(restClient, cachingEntityClient, isUsingOfflineCache) {
        this.isUsingOfflineCache = isUsingOfflineCache;
        if (isUsingOfflineCache) {
            this.entityCache = cachingEntityClient;
            this._entity = new EntityClient_1.EntityClient(cachingEntityClient);
        }
        else {
            cachingEntityClient = new DefaultEntityRestCache_js_1.DefaultEntityRestCache(restClient, new EphemeralCacheStorage_1.EphemeralCacheStorage());
            this._entity = new EntityClient_1.EntityClient(restClient);
        }
        this.entityCache = cachingEntityClient;
        this.cachingEntity = new EntityClient_1.EntityClient(this.entityCache);
    }
    IndexLoader.prototype.loadMailsWithCache = function (mailListId, _a) {
        var rangeStart = _a[0], rangeEnd = _a[1];
        return this.cachingEntity.loadReverseRangeBetween(TypeRefs_js_1.MailTypeRef, mailListId, (0, EntityUtils_1.timestampToGeneratedId)(rangeStart), (0, EntityUtils_1.timestampToGeneratedId)(rangeEnd), exports.MAIL_INDEXER_CHUNK);
    };
    IndexLoader.prototype.removeFromCache = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.isUsingOfflineCache) {
                    return [2 /*return*/, this.entityCache.deleteFromCacheIfExists(TypeRefs_js_1.MailTypeRef, (0, EntityUtils_1.listIdPart)(id), (0, EntityUtils_1.elementIdPart)(id))];
                }
                return [2 /*return*/];
            });
        });
    };
    IndexLoader.prototype.loadMailBodies = function (mails) {
        var ids = mails.map(function (m) { return m.body; });
        return this.loadInChunks(TypeRefs_js_1.MailBodyTypeRef, null, ids);
    };
    IndexLoader.prototype.loadAttachments = function (mails) {
        var _this = this;
        var attachmentIds = [];
        mails.forEach(function (mail) {
            attachmentIds.push.apply(attachmentIds, mail.attachments);
        });
        var filesByList = (0, tutanota_utils_1.groupBy)(attachmentIds, function (a) { return a[0]; });
        var fileLoadingPromises = [];
        filesByList.forEach(function (fileIds, listId) {
            fileLoadingPromises.push(_this.loadInChunks(TypeRefs_js_1.FileTypeRef, listId, fileIds.map(function (f) { return f[1]; })));
        });
        // if (this._indexingCancelled) throw new CancelledError("cancelled indexing in loading attachments")
        return Promise.all(fileLoadingPromises).then(function (filesResults) { return (0, tutanota_utils_1.flat)(filesResults); });
    };
    IndexLoader.prototype.loadInChunks = function (typeRef, listId, ids) {
        var _this = this;
        var byChunk = (0, tutanota_utils_1.splitInChunks)(ENTITY_INDEXER_CHUNK, ids);
        return (0, tutanota_utils_1.promiseMap)(byChunk, function (chunk) {
            return chunk.length > 0 ? _this._entity.loadMultiple(typeRef, listId, chunk) : Promise.resolve([]);
        }, {
            concurrency: 2
        }).then(function (entityResults) { return (0, tutanota_utils_1.flat)(entityResults); });
    };
    return IndexLoader;
}());
