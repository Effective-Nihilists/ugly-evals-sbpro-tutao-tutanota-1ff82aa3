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
exports.MailModel = void 0;
var mithril_1 = require("mithril");
var stream_1 = require("mithril/stream");
var Utils_1 = require("../../api/common/utils/Utils");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var LoginController_1 = require("../../api/main/LoginController");
var TypeRefs_js_1 = require("../../api/entities/tutanota/TypeRefs.js");
var TypeRefs_js_2 = require("../../api/entities/tutanota/TypeRefs.js");
var TypeRefs_js_3 = require("../../api/entities/sys/TypeRefs.js");
var TypeRefs_js_4 = require("../../api/entities/sys/TypeRefs.js");
var TypeRefs_js_5 = require("../../api/entities/tutanota/TypeRefs.js");
var TutanotaConstants_1 = require("../../api/common/TutanotaConstants");
var TypeRefs_js_6 = require("../../api/entities/sys/TypeRefs.js");
var TypeRefs_js_7 = require("../../api/entities/tutanota/TypeRefs.js");
var EventController_1 = require("../../api/main/EventController");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var InboxRuleHandler_1 = require("./InboxRuleHandler");
var EntityUtils_1 = require("../../api/common/utils/EntityUtils");
var RestError_1 = require("../../api/common/error/RestError");
var MailModel = /** @class */ (function () {
    function MailModel(notifications, eventController, worker, mailFacade, entityClient) {
        this.mailboxDetails = (0, stream_1["default"])();
        this.mailboxCounters = (0, stream_1["default"])({});
        this._initialization = null;
        this._notifications = notifications;
        this._eventController = eventController;
        this._worker = worker;
        this._mailFacade = mailFacade;
        this._entityClient = entityClient;
    }
    MailModel.prototype.init = function () {
        var _this = this;
        if (this._initialization) {
            return this._initialization;
        }
        this._eventController.addEntityListener(function (updates) { return _this.entityEventsReceived(updates); });
        this._eventController.getCountersStream().map(function (update) {
            _this._mailboxCountersUpdates(update);
        });
        return this._init();
    };
    MailModel.prototype._init = function () {
        var _this = this;
        var mailGroupMemberships = LoginController_1.logins.getUserController().getMailGroupMemberships();
        this._initialization = Promise.all(mailGroupMemberships.map(function (mailGroupMembership) {
            return Promise.all([
                _this._entityClient.load(TypeRefs_js_2.MailboxGroupRootTypeRef, mailGroupMembership.group),
                _this._entityClient.load(TypeRefs_js_3.GroupInfoTypeRef, mailGroupMembership.groupInfo),
                _this._entityClient.load(TypeRefs_js_4.GroupTypeRef, mailGroupMembership.group),
            ]).then(function (_a) {
                var mailboxGroupRoot = _a[0], mailGroupInfo = _a[1], mailGroup = _a[2];
                return _this._entityClient.load(TypeRefs_js_1.MailBoxTypeRef, mailboxGroupRoot.mailbox).then(function (mailbox) {
                    return _this._loadFolders((0, tutanota_utils_1.neverNull)(mailbox.systemFolders).folders, true).then(function (folders) {
                        return {
                            mailbox: mailbox,
                            folders: folders,
                            mailGroupInfo: mailGroupInfo,
                            mailGroup: mailGroup,
                            mailboxGroupRoot: mailboxGroupRoot
                        };
                    });
                });
            });
        })).then(function (details) {
            _this.mailboxDetails(details);
        });
        return this._initialization;
    };
    MailModel.prototype._loadFolders = function (folderListId, loadSubFolders) {
        var _this = this;
        return this._entityClient
            .loadAll(TypeRefs_js_5.MailFolderTypeRef, folderListId)
            .then(function (folders) {
            if (loadSubFolders) {
                return (0, tutanota_utils_1.promiseMap)(folders, function (folder) { return _this._loadFolders(folder.subFolders, false); }, {
                    concurrency: 5
                }).then(function (subfolders) {
                    return folders.concat.apply(folders, subfolders);
                });
            }
            else {
                return folders;
            }
        })
            .then(function (folders) {
            return folders.filter(function (f) {
                // We do not show spam or archive for external users
                if (!LoginController_1.logins.isInternalUserLoggedIn() && (f.folderType === TutanotaConstants_1.MailFolderType.SPAM || f.folderType === TutanotaConstants_1.MailFolderType.ARCHIVE)) {
                    return false;
                }
                else if (LoginController_1.logins.isEnabled(TutanotaConstants_1.FeatureType.InternalCommunication) && f.folderType === TutanotaConstants_1.MailFolderType.SPAM) {
                    return false;
                }
                else {
                    return true;
                }
            });
        });
    };
    MailModel.prototype.getMailboxDetails = function () {
        var _this = this;
        return this.init().then(function () {
            return _this.mailboxDetails();
        });
    };
    MailModel.prototype.getMailboxDetailsForMail = function (mail) {
        return this.getMailboxDetailsForMailListId(mail._id[0]);
    };
    MailModel.prototype.getMailboxDetailsForMailListId = function (mailListId) {
        return this.getMailboxDetails().then(function (mailboxDetails) { return (0, tutanota_utils_1.neverNull)(mailboxDetails.find(function (md) { return md.folders.find(function (f) { return f.mails === mailListId; }) != null; })); });
    };
    MailModel.prototype.getMailboxDetailsForMailGroup = function (mailGroupId) {
        return this.getMailboxDetails().then(function (mailboxDetails) { return (0, tutanota_utils_1.neverNull)(mailboxDetails.find(function (md) { return mailGroupId === md.mailGroup._id; })); });
    };
    MailModel.prototype.getUserMailboxDetails = function () {
        var userMailGroupMembership = LoginController_1.logins.getUserController().getUserMailGroupMembership();
        return this.getMailboxDetails().then(function (mailboxDetails) { return (0, tutanota_utils_1.neverNull)(mailboxDetails.find(function (md) { return md.mailGroup._id === userMailGroupMembership.group; })); });
    };
    MailModel.prototype.getMailboxFolders = function (mail) {
        return this.getMailboxDetailsForMail(mail).then(function (md) { return md.folders; });
    };
    MailModel.prototype.getMailFolder = function (mailListId) {
        var mailboxDetails = this.mailboxDetails() || [];
        for (var _i = 0, mailboxDetails_1 = mailboxDetails; _i < mailboxDetails_1.length; _i++) {
            var e = mailboxDetails_1[_i];
            for (var _a = 0, _b = e.folders; _a < _b.length; _a++) {
                var f = _b[_a];
                if (f.mails === mailListId) {
                    return f;
                }
            }
        }
        return null;
    };
    MailModel.prototype.reportMails = function (reportType, mails) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, mails_1, mail;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _i = 0, mails_1 = mails;
                        _a.label = 1;
                    case 1:
                        if (!(_i < mails_1.length)) return [3 /*break*/, 4];
                        mail = mails_1[_i];
                        return [4 /*yield*/, this._mailFacade.reportMail(mail, reportType)["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotFoundError, function (e) { return console.log("mail to be reported not found", e); }))];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Finally deletes all given mails. Caller must ensure that mails are only from one folder
     */
    MailModel.prototype._moveMails = function (mails, targetMailFolder) {
        return __awaiter(this, void 0, void 0, function () {
            var moveMails, sourceMailFolder, mailChunks, _i, mailChunks_1, mailChunk;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        moveMails = mails.filter(function (m) { return m._id[0] !== targetMailFolder.mails && targetMailFolder._ownerGroup === m._ownerGroup; }) // prevent moving mails between mail boxes.
                        ;
                        sourceMailFolder = this.getMailFolder((0, EntityUtils_1.getListId)(mails[0]));
                        if (!(moveMails.length > 0 && sourceMailFolder && !(0, EntityUtils_1.isSameId)(targetMailFolder._id, sourceMailFolder._id))) return [3 /*break*/, 4];
                        mailChunks = (0, tutanota_utils_1.splitInChunks)(TutanotaConstants_1.MAX_NBR_MOVE_DELETE_MAIL_SERVICE, mails.map(function (m) { return m._id; }));
                        _i = 0, mailChunks_1 = mailChunks;
                        _a.label = 1;
                    case 1:
                        if (!(_i < mailChunks_1.length)) return [3 /*break*/, 4];
                        mailChunk = mailChunks_1[_i];
                        return [4 /*yield*/, this._mailFacade.moveMails(mailChunk, targetMailFolder._id)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Preferably use moveMails() in MailGuiUtils.js which has built-in error handling
     * @throws PreconditionFailedError or LockedError if operation is locked on the server
     */
    MailModel.prototype.moveMails = function (mails, targetMailFolder) {
        return __awaiter(this, void 0, void 0, function () {
            var mailsPerFolder, _i, mailsPerFolder_1, _a, listId, mails_2, sourceMailFolder;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        mailsPerFolder = (0, tutanota_utils_1.groupBy)(mails, function (mail) {
                            return (0, EntityUtils_1.getListId)(mail);
                        });
                        _i = 0, mailsPerFolder_1 = mailsPerFolder;
                        _b.label = 1;
                    case 1:
                        if (!(_i < mailsPerFolder_1.length)) return [3 /*break*/, 5];
                        _a = mailsPerFolder_1[_i], listId = _a[0], mails_2 = _a[1];
                        sourceMailFolder = this.getMailFolder(listId);
                        if (!sourceMailFolder) return [3 /*break*/, 3];
                        return [4 /*yield*/, this._moveMails(mails_2, targetMailFolder)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        console.log("Move mail: no mail folder for list id", listId);
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Finally deletes the given mails if they are already in the trash or spam folders,
     * otherwise moves them to the trash folder.
     * A deletion confirmation must have been show before.
     */
    MailModel.prototype.deleteMails = function (mails) {
        return __awaiter(this, void 0, void 0, function () {
            var mailsPerFolder, _loop_1, this_1, _i, mailsPerFolder_2, _a, listId, mails_3;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        mailsPerFolder = (0, tutanota_utils_1.groupBy)(mails, function (mail) {
                            return (0, EntityUtils_1.getListId)(mail);
                        });
                        _loop_1 = function (listId, mails_3) {
                            var sourceMailFolder;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        sourceMailFolder = this_1.getMailFolder(listId);
                                        if (!sourceMailFolder) return [3 /*break*/, 5];
                                        if (!this_1.isFinalDelete(sourceMailFolder)) return [3 /*break*/, 2];
                                        return [4 /*yield*/, this_1._finallyDeleteMails(mails_3)];
                                    case 1:
                                        _c.sent();
                                        return [3 /*break*/, 4];
                                    case 2: return [4 /*yield*/, this_1.getMailboxFolders(mails_3[0]).then(function (folders) { return _this._moveMails(mails_3, _this.getTrashFolder(folders)); })];
                                    case 3:
                                        _c.sent();
                                        _c.label = 4;
                                    case 4: return [3 /*break*/, 6];
                                    case 5:
                                        console.log("Delete mail: no mail folder for list id", listId);
                                        _c.label = 6;
                                    case 6: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, mailsPerFolder_2 = mailsPerFolder;
                        _b.label = 1;
                    case 1:
                        if (!(_i < mailsPerFolder_2.length)) return [3 /*break*/, 4];
                        _a = mailsPerFolder_2[_i], listId = _a[0], mails_3 = _a[1];
                        return [5 /*yield**/, _loop_1(listId, mails_3)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Finally deletes all given mails. Caller must ensure that mails are only from one folder and the folder must allow final delete operation.
     */
    MailModel.prototype._finallyDeleteMails = function (mails) {
        return __awaiter(this, void 0, void 0, function () {
            var mailFolder, mailIds, mailChunks, _i, mailChunks_2, mailChunk;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!mails.length)
                            return [2 /*return*/, Promise.resolve()];
                        mailFolder = (0, tutanota_utils_1.neverNull)(this.getMailFolder((0, EntityUtils_1.getListId)(mails[0])));
                        mailIds = mails.map(function (m) { return m._id; });
                        mailChunks = (0, tutanota_utils_1.splitInChunks)(TutanotaConstants_1.MAX_NBR_MOVE_DELETE_MAIL_SERVICE, mailIds);
                        _i = 0, mailChunks_2 = mailChunks;
                        _a.label = 1;
                    case 1:
                        if (!(_i < mailChunks_2.length)) return [3 /*break*/, 4];
                        mailChunk = mailChunks_2[_i];
                        return [4 /*yield*/, this._mailFacade.deleteMails(mailChunk, mailFolder._id)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    MailModel.prototype.entityEventsReceived = function (updates) {
        return __awaiter(this, void 0, void 0, function () {
            var _loop_2, this_2, _i, updates_1, update;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _loop_2 = function (update) {
                            var updatedUser, newMemberships, mailboxDetails, folder, mailId_1, mail_1;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        if (!(0, EventController_1.isUpdateForTypeRef)(TypeRefs_js_5.MailFolderTypeRef, update)) return [3 /*break*/, 2];
                                        return [4 /*yield*/, this_2._init()];
                                    case 1:
                                        _b.sent();
                                        mithril_1["default"].redraw();
                                        return [3 /*break*/, 13];
                                    case 2:
                                        if (!(0, EventController_1.isUpdateForTypeRef)(TypeRefs_js_3.GroupInfoTypeRef, update)) return [3 /*break*/, 5];
                                        if (!(update.operation === "1" /* OperationType.UPDATE */)) return [3 /*break*/, 4];
                                        return [4 /*yield*/, this_2._init()];
                                    case 3:
                                        _b.sent();
                                        mithril_1["default"].redraw;
                                        _b.label = 4;
                                    case 4: return [3 /*break*/, 13];
                                    case 5:
                                        if (!(0, EventController_1.isUpdateForTypeRef)(TypeRefs_js_6.UserTypeRef, update)) return [3 /*break*/, 10];
                                        if (!(update.operation === "1" /* OperationType.UPDATE */ && (0, EntityUtils_1.isSameId)(LoginController_1.logins.getUserController().user._id, update.instanceId))) return [3 /*break*/, 9];
                                        return [4 /*yield*/, this_2._entityClient.load(TypeRefs_js_6.UserTypeRef, update.instanceId)];
                                    case 6:
                                        updatedUser = _b.sent();
                                        newMemberships = updatedUser.memberships.filter(function (membership) { return membership.groupType === TutanotaConstants_1.GroupType.Mail; });
                                        return [4 /*yield*/, this_2.getMailboxDetails()];
                                    case 7:
                                        mailboxDetails = _b.sent();
                                        if (!(newMemberships.length !== mailboxDetails.length)) return [3 /*break*/, 9];
                                        return [4 /*yield*/, this_2._init()];
                                    case 8:
                                        _b.sent();
                                        mithril_1["default"].redraw();
                                        _b.label = 9;
                                    case 9: return [3 /*break*/, 13];
                                    case 10:
                                        if (!((0, EventController_1.isUpdateForTypeRef)(TypeRefs_js_7.MailTypeRef, update) && update.operation === "0" /* OperationType.CREATE */)) return [3 /*break*/, 13];
                                        folder = this_2.getMailFolder(update.instanceListId);
                                        if (!(folder && folder.folderType === TutanotaConstants_1.MailFolderType.INBOX && !(0, Utils_1.containsEventOfType)(updates, "2" /* OperationType.DELETE */, update.instanceId))) return [3 /*break*/, 13];
                                        mailId_1 = [update.instanceListId, update.instanceId];
                                        return [4 /*yield*/, this_2._entityClient.load(TypeRefs_js_7.MailTypeRef, mailId_1)];
                                    case 11:
                                        mail_1 = _b.sent();
                                        return [4 /*yield*/, this_2.getMailboxDetailsForMailListId(update.instanceListId)
                                                .then(function (mailboxDetail) {
                                                // We only apply rules on server if we are the leader in case of incoming messages
                                                return (0, InboxRuleHandler_1.findAndApplyMatchingRule)(_this._mailFacade, _this._entityClient, mailboxDetail, mail_1, _this._worker.isLeader());
                                            })
                                                .then(function (newId) { return _this._showNotification(newId || mailId_1); })["catch"](tutanota_utils_1.noOp)];
                                    case 12:
                                        _b.sent();
                                        _b.label = 13;
                                    case 13: return [2 /*return*/];
                                }
                            });
                        };
                        this_2 = this;
                        _i = 0, updates_1 = updates;
                        _a.label = 1;
                    case 1:
                        if (!(_i < updates_1.length)) return [3 /*break*/, 4];
                        update = updates_1[_i];
                        return [5 /*yield**/, _loop_2(update)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    MailModel.prototype._mailboxCountersUpdates = function (counters) {
        var normalized = this.mailboxCounters() || {};
        var group = normalized[counters.mailGroup] || {};
        counters.counterValues.forEach(function (value) {
            group[value.mailListId] = Number(value.count) || 0;
        });
        normalized[counters.mailGroup] = group;
        this.mailboxCounters(normalized);
    };
    MailModel.prototype._showNotification = function (mailId) {
        this._notifications.showNotification(LanguageViewModel_1.lang.get("newMails_msg"), {
            actions: []
        }, function (e) {
            mithril_1["default"].route.set("/mail/".concat((0, EntityUtils_1.listIdPart)(mailId), "/").concat((0, EntityUtils_1.elementIdPart)(mailId)));
            window.focus();
        });
    };
    MailModel.prototype.getCounterValue = function (listId) {
        var _this = this;
        return this.getMailboxDetailsForMailListId(listId)
            .then(function (mailboxDetails) {
            var counters = _this.mailboxCounters();
            var mailGroupCounter = counters[mailboxDetails.mailGroup._id];
            return mailGroupCounter && mailGroupCounter[listId];
        })["catch"](function () { return null; });
    };
    MailModel.prototype.checkMailForPhishing = function (mail, links) {
        return this._mailFacade.checkMailForPhishing(mail, links);
    };
    MailModel.prototype.getTrashFolder = function (folders) {
        return folders.find(function (f) { return f.folderType === TutanotaConstants_1.MailFolderType.TRASH; });
    };
    MailModel.prototype.isFinalDelete = function (folder) {
        return folder != null && (folder.folderType === TutanotaConstants_1.MailFolderType.TRASH || folder.folderType === TutanotaConstants_1.MailFolderType.SPAM);
    };
    MailModel.prototype.deleteFolder = function (folder) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._mailFacade.deleteFolder(folder._id)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MailModel.prototype.fixupCounterForMailList = function (listId, unreadMails) {
        return __awaiter(this, void 0, void 0, function () {
            var mailboxDetails;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getMailboxDetailsForMailListId(listId)];
                    case 1:
                        mailboxDetails = _a.sent();
                        return [4 /*yield*/, this._mailFacade.fixupCounterForMailList(mailboxDetails.mailGroup._id, listId, unreadMails)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MailModel.prototype.clearFolder = function (folder) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._mailFacade.clearFolder(folder._id)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MailModel.prototype.unsubscribe = function (mail, recipient, headers) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._mailFacade.unsubscribe(mail._id, recipient, headers)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return MailModel;
}());
exports.MailModel = MailModel;
