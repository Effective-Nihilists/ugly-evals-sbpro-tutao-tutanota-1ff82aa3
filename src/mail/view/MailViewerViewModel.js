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
exports.MailViewerViewModel = void 0;
var TypeRefs_js_1 = require("../../api/entities/tutanota/TypeRefs.js");
var TutanotaConstants_1 = require("../../api/common/TutanotaConstants");
var Env_1 = require("../../api/common/Env");
var stream_1 = require("mithril/stream");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var MailUtils_1 = require("../model/MailUtils");
var mithril_1 = require("mithril");
var RestError_1 = require("../../api/common/error/RestError");
var EntityUtils_1 = require("../../api/common/utils/EntityUtils");
var MailGuiUtils_1 = require("./MailGuiUtils");
var MainLocator_1 = require("../../api/main/MainLocator");
var FileController_1 = require("../../file/FileController");
var Utils_1 = require("../../api/common/utils/Utils");
var Exporter_js_1 = require("../export/Exporter.js");
var IndexingNotSupportedError_1 = require("../../api/common/error/IndexingNotSupportedError");
var FileOpenError_1 = require("../../api/common/error/FileOpenError");
var Dialog_1 = require("../../gui/base/Dialog");
var LoginUtils_1 = require("../../misc/LoginUtils");
var Formatter_1 = require("../../misc/Formatter");
var UserError_1 = require("../../api/main/UserError");
var ErrorHandlerImpl_1 = require("../../misc/ErrorHandlerImpl");
var TypeRefs_js_2 = require("../../api/entities/sys/TypeRefs.js");
var LoadingState_1 = require("../../offline/LoadingState");
var Services_1 = require("../../api/entities/tutanota/Services");
var ProgrammingError_1 = require("../../api/common/error/ProgrammingError");
var ErrorCheckUtils_js_1 = require("../../api/common/utils/ErrorCheckUtils.js");
var MailViewerViewModel = /** @class */ (function () {
    function MailViewerViewModel(_mail, showFolder, 
    /**
     * This exists for a single purpose: making opening emails smooth in a single column layout. When the app is in a single-column layout and the email
     * is selected from the list then there is an animation of switching between columns. This parameter will delay sanitizing of mail body and rendering
     * of progress indicator until the animation is done.
     */
    delayBodyRenderingUntil, entityClient, mailModel, contactModel, configFacade, desktopSystemFacade, fileFacade, fileController, logins, service) {
        var _this = this;
        this._mail = _mail;
        this.delayBodyRenderingUntil = delayBodyRenderingUntil;
        this.entityClient = entityClient;
        this.mailModel = mailModel;
        this.contactModel = contactModel;
        this.configFacade = configFacade;
        this.fileFacade = fileFacade;
        this.fileController = fileController;
        this.logins = logins;
        this.service = service;
        this.mailBody = null;
        this.contrastFixNeeded = false;
        // always sanitized in this.sanitizeMailBody
        this.sanitizeResult = null;
        this.loadingAttachments = false;
        this.attachments = [];
        this.contentBlockingStatus = null;
        this.errorOccurred = false;
        this.loadedInlineImages = null;
        this.suspicious = false;
        /** @see getRelevantRecipient */
        this.relevantRecipient = null;
        this.warningDismissed = false;
        this.calendarEventAttachment = null;
        this.loadingState = new LoadingState_1.LoadingStateTracker();
        this.renderIsDelayed = true;
        this.loadCompleteNotification = (0, stream_1["default"])();
        this.renderedMail = null;
        this.delayBodyRenderingUntil.then(function () {
            _this.renderIsDelayed = false;
            mithril_1["default"].redraw();
        });
        if ((0, Env_1.isDesktop)()) {
            // Notify the admin client about the mail being selected
            desktopSystemFacade === null || desktopSystemFacade === void 0 ? void 0 : desktopSystemFacade.sendSocketMessage(this.mail.sender.address);
        }
        this.folderText = null;
        if (showFolder) {
            this.showFolder();
        }
        this.determineRelevantRecipient();
    }
    Object.defineProperty(MailViewerViewModel.prototype, "mail", {
        get: function () {
            return this._mail;
        },
        enumerable: false,
        configurable: true
    });
    MailViewerViewModel.prototype.determineRelevantRecipient = function () {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function () {
            var mailboxDetails, enabledMailAddresses;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, this.mailModel.getMailboxDetailsForMail(this.mail)];
                    case 1:
                        mailboxDetails = _f.sent();
                        enabledMailAddresses = new Set((0, MailUtils_1.getEnabledMailAddressesWithUser)(mailboxDetails, this.logins.getUserController().userGroupInfo));
                        this.relevantRecipient = (_e = (_d = (_c = (_b = (_a = this.mail.toRecipients.find(function (r) { return enabledMailAddresses.has(r.address); })) !== null && _a !== void 0 ? _a : this.mail.ccRecipients.find(function (r) { return enabledMailAddresses.has(r.address); })) !== null && _b !== void 0 ? _b : this.mail.bccRecipients.find(function (r) { return enabledMailAddresses.has(r.address); })) !== null && _c !== void 0 ? _c : (0, tutanota_utils_1.first)(this.mail.toRecipients)) !== null && _d !== void 0 ? _d : (0, tutanota_utils_1.first)(this.mail.ccRecipients)) !== null && _e !== void 0 ? _e : (0, tutanota_utils_1.first)(this.mail.bccRecipients);
                        mithril_1["default"].redraw();
                        return [2 /*return*/];
                }
            });
        });
    };
    MailViewerViewModel.prototype.showFolder = function () {
        var _this = this;
        this.folderText = null;
        var folder = this.mailModel.getMailFolder(this.mail._id[0]);
        if (folder) {
            this.mailModel.getMailboxDetailsForMail(this.mail).then(function (mailboxDetails) {
                _this.folderText = "".concat((0, MailUtils_1.getMailboxName)(_this.logins, mailboxDetails), " / ").concat((0, MailUtils_1.getFolderName)(folder));
                mithril_1["default"].redraw();
            });
        }
    };
    MailViewerViewModel.prototype.dispose = function () {
        return __awaiter(this, void 0, void 0, function () {
            var inlineImages;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getLoadedInlineImages()];
                    case 1:
                        inlineImages = _a.sent();
                        (0, MailGuiUtils_1.revokeInlineImages)(inlineImages);
                        return [2 /*return*/];
                }
            });
        });
    };
    MailViewerViewModel.prototype.loadAll = function (_a) {
        var _b = _a === void 0 ? { notify: true } : _a, notify = _b.notify;
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.loadingState.trackPromise(this.loadMailBody(this.mail)
                                .then(function (inlineImageCids) { return _this.loadAttachments(_this.mail, inlineImageCids); }))];
                    case 1:
                        _c.sent();
                        if (notify)
                            this.loadCompleteNotification(null);
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _c.sent();
                        if (!(0, ErrorCheckUtils_js_1.isOfflineError)(e_1)) {
                            throw e_1;
                        }
                        return [3 /*break*/, 3];
                    case 3:
                        mithril_1["default"].redraw();
                        // We need the conversation entry in order to reply to the message.
                        // We don't want the user to have to wait for it to load when they click reply,
                        // So we load it here pre-emptively to make sure it is in the cache.
                        this.entityClient
                            .load(TypeRefs_js_1.ConversationEntryTypeRef, this.mail.conversationEntry)["catch"](function (e) {
                            if (e instanceof RestError_1.NotFoundError) {
                                console.log("could load conversation entry as it has been moved/deleted already", e);
                            }
                            else if ((0, ErrorCheckUtils_js_1.isOfflineError)(e)) {
                                console.log("failed to load conversation entry, because of a lost connection", e);
                            }
                            else {
                                throw e;
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    MailViewerViewModel.prototype.isLoading = function () {
        return this.loadingState.isLoading();
    };
    MailViewerViewModel.prototype.isConnectionLost = function () {
        return this.loadingState.isConnectionLost();
    };
    MailViewerViewModel.prototype.getAttachments = function () {
        return this.attachments;
    };
    MailViewerViewModel.prototype.getInlineCids = function () {
        var _a, _b;
        return (_b = (_a = this.sanitizeResult) === null || _a === void 0 ? void 0 : _a.inlineImageCids) !== null && _b !== void 0 ? _b : [];
    };
    MailViewerViewModel.prototype.getLoadedInlineImages = function () {
        var _a;
        return (_a = this.loadedInlineImages) !== null && _a !== void 0 ? _a : new Map();
    };
    MailViewerViewModel.prototype.isContrastFixNeeded = function () {
        return this.contrastFixNeeded;
    };
    MailViewerViewModel.prototype.isDraftMail = function () {
        return this.mail.state === "0" /* MailState.DRAFT */;
    };
    MailViewerViewModel.prototype.isReceivedMail = function () {
        return this.mail.state === "2" /* MailState.RECEIVED */;
    };
    MailViewerViewModel.prototype.isLoadingAttachments = function () {
        return this.loadingAttachments;
    };
    MailViewerViewModel.prototype.getFolderText = function () {
        return this.folderText;
    };
    MailViewerViewModel.prototype.getSubject = function () {
        return this.mail.subject;
    };
    MailViewerViewModel.prototype.isConfidential = function () {
        return this.mail.confidential;
    };
    MailViewerViewModel.prototype.isMailSuspicious = function () {
        return this.suspicious;
    };
    MailViewerViewModel.prototype.getMailId = function () {
        return this.mail._id;
    };
    MailViewerViewModel.prototype.getSanitizedMailBody = function () {
        var _a, _b;
        return (_b = (_a = this.sanitizeResult) === null || _a === void 0 ? void 0 : _a.fragment) !== null && _b !== void 0 ? _b : null;
    };
    MailViewerViewModel.prototype.getMailBody = function () {
        if (this.mailBody) {
            return (0, Utils_1.getMailBodyText)(this.mailBody);
        }
        else {
            return "";
        }
    };
    MailViewerViewModel.prototype.getSentDate = function () {
        return this.mail.sentDate;
    };
    MailViewerViewModel.prototype.getToRecipients = function () {
        return this.mail.toRecipients;
    };
    MailViewerViewModel.prototype.getCcRecipients = function () {
        return this.mail.ccRecipients;
    };
    MailViewerViewModel.prototype.getBccRecipients = function () {
        return this.mail.bccRecipients;
    };
    /** Get the recipient which is relevant the most for the current mailboxes. */
    MailViewerViewModel.prototype.getRelevantRecipient = function () {
        return this.relevantRecipient;
    };
    MailViewerViewModel.prototype.getReplyTos = function () {
        return this.mail.replyTos;
    };
    MailViewerViewModel.prototype.getSender = function () {
        return this.mail.sender;
    };
    MailViewerViewModel.prototype.getPhishingStatus = function () {
        return this.mail.phishingStatus;
    };
    MailViewerViewModel.prototype.setPhishingStatus = function (status) {
        this.mail.phishingStatus = status;
    };
    MailViewerViewModel.prototype.isMailAuthenticated = function () {
        return this.mail.authStatus === TutanotaConstants_1.MailAuthenticationStatus.AUTHENTICATED;
    };
    MailViewerViewModel.prototype.setAuthenticationStatus = function (status) {
        this.mail.authStatus = status;
    };
    MailViewerViewModel.prototype.canCreateSpamRule = function () {
        return this.logins.isGlobalAdminUserLoggedIn() && !this.logins.isEnabled(TutanotaConstants_1.FeatureType.InternalCommunication);
    };
    MailViewerViewModel.prototype.didErrorsOccur = function () {
        return this.errorOccurred || typeof this.mail._errors !== 'undefined' || (this.mailBody != null && typeof this.mailBody._errors !== 'undefined');
    };
    MailViewerViewModel.prototype.isTutanotaTeamMail = function () {
        return (0, MailUtils_1.isTutanotaTeamMail)(this.mail);
    };
    MailViewerViewModel.prototype.isShowingExternalContent = function () {
        return this.contentBlockingStatus === "1" /* ContentBlockingStatus.Show */ || this.contentBlockingStatus === "2" /* ContentBlockingStatus.AlwaysShow */;
    };
    MailViewerViewModel.prototype.isBlockingExternalImages = function () {
        return this.contentBlockingStatus === "0" /* ContentBlockingStatus.Block */ || this.contentBlockingStatus === "4" /* ContentBlockingStatus.AlwaysBlock */;
    };
    MailViewerViewModel.prototype.getDifferentEnvelopeSender = function () {
        return this.mail.differentEnvelopeSender;
    };
    MailViewerViewModel.prototype.getCalendarEventAttachment = function () {
        return this.calendarEventAttachment;
    };
    MailViewerViewModel.prototype.getContentBlockingStatus = function () {
        return this.contentBlockingStatus;
    };
    MailViewerViewModel.prototype.isWarningDismissed = function () {
        return this.warningDismissed;
    };
    MailViewerViewModel.prototype.setWarningDismissed = function (dismissed) {
        this.warningDismissed = dismissed;
    };
    MailViewerViewModel.prototype.getRestrictions = function () {
        return this.mail.restrictions;
    };
    MailViewerViewModel.prototype.setContentBlockingStatus = function (status) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // We can only be set to NoExternalContent when initially loading the mailbody (_loadMailBody)
                        // so we ignore it here, and don't do anything if we were already set to NoExternalContent
                        if (status === "3" /* ContentBlockingStatus.NoExternalContent */
                            || this.contentBlockingStatus === "3" /* ContentBlockingStatus.NoExternalContent */
                            || this.contentBlockingStatus === status) {
                            return [2 /*return*/];
                        }
                        if (status === "2" /* ContentBlockingStatus.AlwaysShow */) {
                            this.configFacade.addExternalImageRule(this.getSender().address, "1" /* ExternalImageRule.Allow */)["catch"]((0, tutanota_utils_1.ofClass)(IndexingNotSupportedError_1.IndexingNotSupportedError, tutanota_utils_1.noOp));
                        }
                        else if (status === "4" /* ContentBlockingStatus.AlwaysBlock */) {
                            this.configFacade.addExternalImageRule(this.getSender().address, "2" /* ExternalImageRule.Block */)["catch"]((0, tutanota_utils_1.ofClass)(IndexingNotSupportedError_1.IndexingNotSupportedError, tutanota_utils_1.noOp));
                        }
                        else {
                            // we are going from allow or block to something else it means we're resetting to the default rule for the given sender
                            this.configFacade.addExternalImageRule(this.getSender().address, "0" /* ExternalImageRule.None */)["catch"]((0, tutanota_utils_1.ofClass)(IndexingNotSupportedError_1.IndexingNotSupportedError, tutanota_utils_1.noOp));
                        }
                        this.contentBlockingStatus = status;
                        // We don't check mail authentication status here because the user has manually called this
                        _a = this;
                        return [4 /*yield*/, this.sanitizeMailBody(this.mail, this.isBlockingExternalImages())];
                    case 1:
                        // We don't check mail authentication status here because the user has manually called this
                        _a.sanitizeResult = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MailViewerViewModel.prototype.markAsNotPhishing = function () {
        return __awaiter(this, void 0, void 0, function () {
            var oldStatus;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        oldStatus = this.getPhishingStatus();
                        if (oldStatus === "2" /* MailPhishingStatus.WHITELISTED */) {
                            return [2 /*return*/];
                        }
                        this.setPhishingStatus("2" /* MailPhishingStatus.WHITELISTED */);
                        return [4 /*yield*/, this.entityClient
                                .update(this.mail)["catch"](function () { return _this.setPhishingStatus(oldStatus); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MailViewerViewModel.prototype.reportMail = function (reportType) {
        return __awaiter(this, void 0, void 0, function () {
            var mailboxDetails, spamFolder, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this.mailModel.reportMails(reportType, [this.mail])];
                    case 1:
                        _a.sent();
                        if (!(reportType === "0" /* MailReportType.PHISHING */)) return [3 /*break*/, 3];
                        this.setPhishingStatus("1" /* MailPhishingStatus.SUSPICIOUS */);
                        return [4 /*yield*/, this.entityClient.update(this.mail)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.mailModel.getMailboxDetailsForMail(this.mail)];
                    case 4:
                        mailboxDetails = _a.sent();
                        spamFolder = (0, MailUtils_1.getFolder)(mailboxDetails.folders, TutanotaConstants_1.MailFolderType.SPAM);
                        // do not report moved mails again
                        return [4 /*yield*/, (0, MailGuiUtils_1.moveMails)({ mailModel: this.mailModel, mails: [this.mail], targetMailFolder: spamFolder, isReportable: false })];
                    case 5:
                        // do not report moved mails again
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        e_2 = _a.sent();
                        if (e_2 instanceof RestError_1.NotFoundError) {
                            console.log("mail already moved");
                        }
                        else {
                            throw e_2;
                        }
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    MailViewerViewModel.prototype.canExport = function () {
        return !this.isAnnouncement() && !this.logins.isEnabled(TutanotaConstants_1.FeatureType.DisableMailExport);
    };
    MailViewerViewModel.prototype.canPrint = function () {
        return !this.logins.isEnabled(TutanotaConstants_1.FeatureType.DisableMailExport);
    };
    MailViewerViewModel.prototype.canReport = function () {
        return this.getPhishingStatus() === "0" /* MailPhishingStatus.UNKNOWN */ && !this.isTutanotaTeamMail() && this.logins.isInternalUserLoggedIn();
    };
    MailViewerViewModel.prototype.canShowHeaders = function () {
        return this.logins.isInternalUserLoggedIn();
    };
    MailViewerViewModel.prototype.canPersistBlockingStatus = function () {
        return MainLocator_1.locator.search.indexingSupported;
    };
    MailViewerViewModel.prototype.exportMail = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, Exporter_js_1.exportMails)([this.mail], this.entityClient, this.fileController)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MailViewerViewModel.prototype.getHeaders = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.mail.headers) {
                    return [2 /*return*/, null];
                }
                return [2 /*return*/, this.entityClient
                        .load(TypeRefs_js_1.MailHeadersTypeRef, this.mail.headers)
                        .then(function (headers) { var _a; return (_a = (0, Utils_1.getMailHeaders)(headers)) !== null && _a !== void 0 ? _a : null; })["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotFoundError, function () { return null; }))];
            });
        });
    };
    MailViewerViewModel.prototype.isUnread = function () {
        return this.mail.unread;
    };
    MailViewerViewModel.prototype.setUnread = function (unread) {
        this.mail.unread = unread;
        this.entityClient
            .update(this.mail)["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.LockedError, function () { return console.log("could not update mail read state: ", LanguageViewModel_1.lang.get("operationStillActive_msg")); }))["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotFoundError, tutanota_utils_1.noOp));
    };
    MailViewerViewModel.prototype.isListUnsubscribe = function () {
        return this.mail.listUnsubscribe;
    };
    MailViewerViewModel.prototype.isAnnouncement = function () {
        return (0, MailUtils_1.isExcludedMailAddress)(this.getSender().address);
    };
    MailViewerViewModel.prototype.unsubscribe = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!this.isListUnsubscribe()) {
                    return [2 /*return*/, false];
                }
                return [2 /*return*/, this.getHeaders().then(function (mailHeaders) {
                        if (!mailHeaders) {
                            return false;
                        }
                        var headers = mailHeaders
                            .split("\n")
                            .filter(function (headerLine) { return headerLine.toLowerCase().startsWith("list-unsubscribe"); });
                        if (headers.length > 0) {
                            return _this.getSenderOfResponseMail().then(function (recipient) {
                                var postData = (0, TypeRefs_js_1.createListUnsubscribeData)({
                                    mail: _this.getMailId(),
                                    recipient: recipient,
                                    headers: headers.join("\n")
                                });
                                return _this.service.post(Services_1.ListUnsubscribeService, postData).then(function () { return true; });
                            });
                        }
                        else {
                            return false;
                        }
                    })];
            });
        });
    };
    MailViewerViewModel.prototype.getMailboxDetails = function () {
        return this.mailModel.getMailboxDetailsForMail(this.mail);
    };
    /** @return list of inline referenced cid */
    MailViewerViewModel.prototype.loadMailBody = function (mail) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, e_3, externalImageRule, isAllowedAndAuthenticatedExternalSender, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        // If the mail is a non-draft and we have loaded it before, we don't need to reload it because it cannot have been edited, so we return early
                        // drafts however can be edited, and we want to receive the changes, so for drafts we will always reload
                        if (this.renderedMail != null && (0, EntityUtils_1.haveSameId)(mail, this.renderedMail)
                            && mail.state !== "0" /* MailState.DRAFT */
                            && this.sanitizeResult != null) {
                            return [2 /*return*/, this.sanitizeResult.inlineImageCids];
                        }
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        _a = this;
                        return [4 /*yield*/, this.entityClient.load(TypeRefs_js_1.MailBodyTypeRef, mail.body)];
                    case 2:
                        _a.mailBody = _c.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_3 = _c.sent();
                        if (e_3 instanceof RestError_1.NotFoundError) {
                            console.log("could load mail body as it has been moved/deleted already", e_3);
                            this.errorOccurred = true;
                            return [2 /*return*/, []];
                        }
                        if (e_3 instanceof RestError_1.NotAuthorizedError) {
                            console.log("could load mail body as the permission is missing", e_3);
                            this.errorOccurred = true;
                            return [2 /*return*/, []];
                        }
                        throw e_3;
                    case 4: return [4 /*yield*/, this.configFacade.getExternalImageRule(mail.sender.address)["catch"](function (e) {
                            console.log("Error getting external image rule:", e);
                            return "0" /* ExternalImageRule.None */;
                        })];
                    case 5:
                        externalImageRule = _c.sent();
                        isAllowedAndAuthenticatedExternalSender = externalImageRule === "1" /* ExternalImageRule.Allow */ && mail.authStatus === TutanotaConstants_1.MailAuthenticationStatus.AUTHENTICATED;
                        // We should not try to sanitize body while we still animate because it's a heavy operation.
                        return [4 /*yield*/, this.delayBodyRenderingUntil];
                    case 6:
                        // We should not try to sanitize body while we still animate because it's a heavy operation.
                        _c.sent();
                        _b = this;
                        return [4 /*yield*/, this.sanitizeMailBody(mail, !isAllowedAndAuthenticatedExternalSender)];
                    case 7:
                        _b.sanitizeResult = _c.sent();
                        this.checkMailForPhishing(mail, this.sanitizeResult.links);
                        this.contentBlockingStatus =
                            externalImageRule === "2" /* ExternalImageRule.Block */
                                ? "4" /* ContentBlockingStatus.AlwaysBlock */
                                : isAllowedAndAuthenticatedExternalSender
                                    ? "2" /* ContentBlockingStatus.AlwaysShow */
                                    : this.sanitizeResult.externalContent.length > 0
                                        ? "0" /* ContentBlockingStatus.Block */
                                        : "3" /* ContentBlockingStatus.NoExternalContent */;
                        mithril_1["default"].redraw();
                        this.renderedMail = this.mail;
                        return [2 /*return*/, this.sanitizeResult.inlineImageCids];
                }
            });
        });
    };
    MailViewerViewModel.prototype.loadAttachments = function (mail, inlineCids) {
        return __awaiter(this, void 0, void 0, function () {
            var attachmentsListId, attachmentElementIds, files, _a, e_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(mail.attachments.length === 0)) return [3 /*break*/, 1];
                        this.loadingAttachments = false;
                        return [3 /*break*/, 7];
                    case 1:
                        this.loadingAttachments = true;
                        attachmentsListId = (0, EntityUtils_1.listIdPart)(mail.attachments[0]);
                        attachmentElementIds = mail.attachments.map(function (attachment) { return (0, EntityUtils_1.elementIdPart)(attachment); });
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 6, , 7]);
                        return [4 /*yield*/, this.entityClient.loadMultiple(TypeRefs_js_1.FileTypeRef, attachmentsListId, attachmentElementIds)];
                    case 3:
                        files = _b.sent();
                        this.handleCalendarFile(files, mail);
                        this.attachments = files;
                        this.loadingAttachments = false;
                        mithril_1["default"].redraw();
                        if (!(this.loadedInlineImages == null)) return [3 /*break*/, 5];
                        _a = this;
                        return [4 /*yield*/, (0, MailGuiUtils_1.loadInlineImages)(this.fileController, files, inlineCids)];
                    case 4:
                        _a.loadedInlineImages = _b.sent();
                        _b.label = 5;
                    case 5:
                        mithril_1["default"].redraw();
                        return [3 /*break*/, 7];
                    case 6:
                        e_4 = _b.sent();
                        if (e_4 instanceof RestError_1.NotFoundError) {
                            console.log("could load attachments as they have been moved/deleted already", e_4);
                        }
                        else {
                            throw e_4;
                        }
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    MailViewerViewModel.prototype.checkMailForPhishing = function (mail, links) {
        var _this = this;
        if (mail.phishingStatus === "1" /* MailPhishingStatus.SUSPICIOUS */) {
            this.suspicious = true;
        }
        else if (mail.phishingStatus === "0" /* MailPhishingStatus.UNKNOWN */) {
            var linkObjects = links.map(function (link) {
                return {
                    href: link.getAttribute("href") || "",
                    innerHTML: link.innerHTML
                };
            });
            this.mailModel.checkMailForPhishing(mail, linkObjects).then(function (isSuspicious) {
                if (isSuspicious) {
                    _this.suspicious = true;
                    mail.phishingStatus = "1" /* MailPhishingStatus.SUSPICIOUS */;
                    _this.entityClient
                        .update(mail)["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.LockedError, function (e) { return console.log("could not update mail phishing status as mail is locked"); }))["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotFoundError, function (e) { return console.log("mail already moved"); }));
                    mithril_1["default"].redraw();
                }
            });
        }
    };
    /**
     * Check if the list of files contain an iCal file which we can then load and display details for. An calendar notification
     * should contain only one iCal attachment so we only process the first matching one.
     */
    MailViewerViewModel.prototype.handleCalendarFile = function (files, mail) {
        var _this = this;
        var calendarFile = files.find(function (a) { return a.mimeType && a.mimeType.startsWith(FileController_1.CALENDAR_MIME_TYPE); });
        if (calendarFile && (mail.method === "2" /* MailMethod.ICAL_REQUEST */ || mail.method === "3" /* MailMethod.ICAL_REPLY */) && mail.state === "2" /* MailState.RECEIVED */) {
            Promise.all([
                Promise.resolve().then(function () { return require("../../calendar/date/CalendarInvites"); }).then(function (_a) {
                    var getEventFromFile = _a.getEventFromFile;
                    return getEventFromFile(calendarFile);
                }),
                this.getSenderOfResponseMail(),
            ]).then(function (_a) {
                var event = _a[0], recipient = _a[1];
                _this.calendarEventAttachment = event && {
                    event: event,
                    method: (0, TutanotaConstants_1.mailMethodToCalendarMethod)((0, tutanota_utils_1.downcast)(mail.method)),
                    recipient: recipient
                };
                mithril_1["default"].redraw();
            });
        }
    };
    MailViewerViewModel.prototype.getSenderOfResponseMail = function () {
        var _this = this;
        return this.mailModel.getMailboxDetailsForMail(this.mail).then(function (mailboxDetails) {
            var myMailAddresses = (0, MailUtils_1.getEnabledMailAddresses)(mailboxDetails);
            var addressesInMail = [];
            (0, tutanota_utils_1.addAll)(addressesInMail, _this.mail.toRecipients);
            (0, tutanota_utils_1.addAll)(addressesInMail, _this.mail.ccRecipients);
            (0, tutanota_utils_1.addAll)(addressesInMail, _this.mail.bccRecipients);
            addressesInMail.push(_this.mail.sender);
            var foundAddress = addressesInMail.find(function (address) { return (0, tutanota_utils_1.contains)(myMailAddresses, address.address.toLowerCase()); });
            if (foundAddress) {
                return foundAddress.address.toLowerCase();
            }
            else {
                return (0, MailUtils_1.getDefaultSender)(_this.logins, mailboxDetails);
            }
        });
    };
    /** @throws UserError */
    MailViewerViewModel.prototype.forward = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sendAllowed, args, _a, mailboxDetails, newMailEditorAsResponse, editor;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, LoginUtils_1.checkApprovalStatus)(this.logins, false)];
                    case 1:
                        sendAllowed = _b.sent();
                        if (!sendAllowed) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.createResponseMailArgsForForwarding([], [], true)];
                    case 2:
                        args = _b.sent();
                        return [4 /*yield*/, Promise.all([this.getMailboxDetails(), Promise.resolve().then(function () { return require("../editor/MailEditor"); })])
                            // Call this again to make sure everything is loaded, including inline images because this can be called earlier than all the parts are loaded.
                        ];
                    case 3:
                        _a = _b.sent(), mailboxDetails = _a[0], newMailEditorAsResponse = _a[1].newMailEditorAsResponse;
                        // Call this again to make sure everything is loaded, including inline images because this can be called earlier than all the parts are loaded.
                        return [4 /*yield*/, this.loadAll({ notify: false })];
                    case 4:
                        // Call this again to make sure everything is loaded, including inline images because this can be called earlier than all the parts are loaded.
                        _b.sent();
                        return [4 /*yield*/, newMailEditorAsResponse(args, this.isBlockingExternalImages(), this.getLoadedInlineImages(), mailboxDetails)];
                    case 5:
                        editor = _b.sent();
                        editor.show();
                        _b.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    MailViewerViewModel.prototype.createResponseMailArgsForForwarding = function (recipients, replyTos, addSignature) {
        return __awaiter(this, void 0, void 0, function () {
            var infoLine, mailSubject, body, prependEmailSignature, senderMailAddress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        infoLine = LanguageViewModel_1.lang.get("date_label") + ": " + (0, Formatter_1.formatDateTime)(this.mail.sentDate) + "<br>";
                        infoLine += LanguageViewModel_1.lang.get("from_label") + ": " + this.getSender().address + "<br>";
                        if (this.getToRecipients().length > 0) {
                            infoLine += LanguageViewModel_1.lang.get("to_label") + ": " + this.getToRecipients().map(function (recipient) { return recipient.address; }).join(", ");
                            infoLine += "<br>";
                        }
                        if (this.getCcRecipients().length > 0) {
                            infoLine += LanguageViewModel_1.lang.get("cc_label") + ": " + this.getCcRecipients().map(function (recipient) { return recipient.address; }).join(", ");
                            infoLine += "<br>";
                        }
                        mailSubject = this.getSubject() || "";
                        infoLine += LanguageViewModel_1.lang.get("subject_label") + ": " + (0, Formatter_1.urlEncodeHtmlTags)(mailSubject);
                        body = infoLine + '<br><br><blockquote class="tutanota_quote">' + this.getMailBody() + "</blockquote>";
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("../signature/Signature"); })];
                    case 1:
                        prependEmailSignature = (_a.sent()).prependEmailSignature;
                        return [4 /*yield*/, this.getSenderOfResponseMail()];
                    case 2:
                        senderMailAddress = _a.sent();
                        return [2 /*return*/, {
                                previousMail: this.mail,
                                conversationType: "2" /* ConversationType.FORWARD */,
                                senderMailAddress: senderMailAddress,
                                recipients: recipients,
                                attachments: this.attachments.slice(),
                                subject: "FWD: " + mailSubject,
                                bodyText: addSignature ? prependEmailSignature(body, this.logins) : body,
                                replyTos: replyTos
                            }];
                }
            });
        });
    };
    MailViewerViewModel.prototype.reply = function (replyAll) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var sendAllowed, mailboxDetails, prefix, mailSubject, subject, infoLine, body, toRecipients, ccRecipients, bccRecipients, myMailAddresses_1, prependEmailSignature, newMailEditorAsResponse, inlineImageCids, _c, senderMailAddress, referencedCids, attachmentsForReply, editor, e_5;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (this.isAnnouncement()) {
                            return [2 /*return*/, Promise.resolve()];
                        }
                        return [4 /*yield*/, (0, LoginUtils_1.checkApprovalStatus)(this.logins, false)];
                    case 1:
                        sendAllowed = _d.sent();
                        if (!sendAllowed) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.mailModel.getMailboxDetailsForMail(this.mail)];
                    case 2:
                        mailboxDetails = _d.sent();
                        prefix = "Re: ";
                        mailSubject = this.getSubject();
                        subject = mailSubject ? ((0, tutanota_utils_1.startsWith)(mailSubject.toUpperCase(), prefix.toUpperCase()) ? mailSubject : prefix + mailSubject) : "";
                        infoLine = (0, Formatter_1.formatDateTime)(this.getSentDate()) + " " + LanguageViewModel_1.lang.get("by_label") + " " + this.getSender().address + ":";
                        body = infoLine + '<br><blockquote class="tutanota_quote">' + this.getMailBody() + "</blockquote>";
                        toRecipients = [];
                        ccRecipients = [];
                        bccRecipients = [];
                        if (!this.logins.getUserController().isInternalUser() && this.isReceivedMail()) {
                            toRecipients.push(this.getSender());
                        }
                        else if (this.isReceivedMail()) {
                            if (this.getReplyTos().some(function (address) { return !(0, tutanota_utils_1.downcast)(address)._errors; })) {
                                (0, tutanota_utils_1.addAll)(toRecipients, this.getReplyTos());
                            }
                            else {
                                toRecipients.push(this.getSender());
                            }
                            if (replyAll) {
                                myMailAddresses_1 = (0, MailUtils_1.getEnabledMailAddresses)(mailboxDetails);
                                (0, tutanota_utils_1.addAll)(ccRecipients, this.getToRecipients().filter(function (recipient) { return !(0, tutanota_utils_1.contains)(myMailAddresses_1, recipient.address.toLowerCase()); }));
                                (0, tutanota_utils_1.addAll)(ccRecipients, this.getCcRecipients().filter(function (recipient) { return !(0, tutanota_utils_1.contains)(myMailAddresses_1, recipient.address.toLowerCase()); }));
                            }
                        }
                        else {
                            // this is a sent email, so use the to recipients as new recipients
                            (0, tutanota_utils_1.addAll)(toRecipients, this.getToRecipients());
                            if (replyAll) {
                                (0, tutanota_utils_1.addAll)(ccRecipients, this.getCcRecipients());
                                (0, tutanota_utils_1.addAll)(bccRecipients, this.getBccRecipients());
                            }
                        }
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("../signature/Signature.js"); })];
                    case 3:
                        prependEmailSignature = (_d.sent()).prependEmailSignature;
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("../editor/MailEditor"); })];
                    case 4:
                        newMailEditorAsResponse = (_d.sent()).newMailEditorAsResponse;
                        return [4 /*yield*/, this.loadAll({ notify: false })
                            // It should be there after loadAll() but if not we just give up
                        ];
                    case 5:
                        _d.sent();
                        inlineImageCids = (_b = (_a = this.sanitizeResult) === null || _a === void 0 ? void 0 : _a.inlineImageCids) !== null && _b !== void 0 ? _b : [];
                        return [4 /*yield*/, Promise.all([this.getSenderOfResponseMail(), inlineImageCids])];
                    case 6:
                        _c = _d.sent(), senderMailAddress = _c[0], referencedCids = _c[1];
                        attachmentsForReply = (0, MailGuiUtils_1.getReferencedAttachments)(this.attachments, referencedCids);
                        _d.label = 7;
                    case 7:
                        _d.trys.push([7, 9, , 10]);
                        return [4 /*yield*/, newMailEditorAsResponse({
                                previousMail: this.mail,
                                conversationType: "1" /* ConversationType.REPLY */,
                                senderMailAddress: senderMailAddress,
                                recipients: {
                                    to: toRecipients,
                                    cc: ccRecipients,
                                    bcc: bccRecipients
                                },
                                attachments: attachmentsForReply,
                                subject: subject,
                                bodyText: prependEmailSignature(body, this.logins),
                                replyTos: []
                            }, this.isBlockingExternalImages(), this.getLoadedInlineImages(), mailboxDetails)];
                    case 8:
                        editor = _d.sent();
                        editor.show();
                        return [3 /*break*/, 10];
                    case 9:
                        e_5 = _d.sent();
                        if (e_5 instanceof UserError_1.UserError) {
                            (0, ErrorHandlerImpl_1.showUserError)(e_5);
                        }
                        else {
                            throw e_5;
                        }
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    MailViewerViewModel.prototype.sanitizeMailBody = function (mail, blockExternalContent) {
        return __awaiter(this, void 0, void 0, function () {
            var htmlSanitizer, rawBody, urlified, sanitizeResult, fragment, inlineImageCids, links, externalContent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../../misc/HtmlSanitizer"); })];
                    case 1:
                        htmlSanitizer = (_a.sent()).htmlSanitizer;
                        rawBody = this.getMailBody();
                        return [4 /*yield*/, MainLocator_1.locator.worker.urlify(rawBody)["catch"](function (e) {
                                console.warn("Failed to urlify mail body!", e);
                                return rawBody;
                            })];
                    case 2:
                        urlified = _a.sent();
                        sanitizeResult = htmlSanitizer.sanitizeFragment(urlified, {
                            blockExternalContent: blockExternalContent,
                            allowRelativeLinks: (0, MailUtils_1.isTutanotaTeamMail)(mail)
                        });
                        fragment = sanitizeResult.fragment, inlineImageCids = sanitizeResult.inlineImageCids, links = sanitizeResult.links, externalContent = sanitizeResult.externalContent;
                        /**
                         * Check if we need to improve contrast for dark theme. We apply the contrast fix if any of the following is contained in
                         * the html body of the mail
                         *  * any tag with a style attribute that has the color property set (besides "inherit")
                         *  * any tag with a style attribute that has the background-color set (besides "inherit")
                         *  * any font tag with the color attribute set
                         */
                        this.contrastFixNeeded =
                            Array.from(fragment.querySelectorAll("*[style]"), function (e) { return e.style; }).some(function (s) { return (s.color && s.color !== "inherit") || (s.backgroundColor && s.backgroundColor !== "inherit"); }) || fragment.querySelectorAll("font[color]").length > 0;
                        mithril_1["default"].redraw();
                        return [2 /*return*/, {
                                // We want to stringify and return the fragment here, because once a fragment is appended to a DOM Node, it's children are moved
                                // and the fragment is left empty. If we cache the fragment and then append that directly to the DOM tree when rendering, there are cases where
                                // we would try to do so twice, and on the second pass the mail body will be left blank
                                fragment: fragment,
                                inlineImageCids: inlineImageCids,
                                links: links,
                                externalContent: externalContent
                            }];
                }
            });
        });
    };
    MailViewerViewModel.prototype.getAssignableMailRecipients = function () {
        return __awaiter(this, void 0, void 0, function () {
            var participantGroupInfos, customer_1, loadGroupInfos, groupInfos;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.mail.restrictions != null && this.mail.restrictions.participantGroupInfos.length > 0)) return [3 /*break*/, 4];
                        participantGroupInfos = this.mail.restrictions.participantGroupInfos;
                        return [4 /*yield*/, this.entityClient.load(TypeRefs_js_2.CustomerTypeRef, (0, tutanota_utils_1.neverNull)(this.logins.getUserController().user.customer))];
                    case 1:
                        customer_1 = _a.sent();
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("../../settings/LoadingUtils"); })];
                    case 2:
                        loadGroupInfos = (_a.sent()).loadGroupInfos;
                        return [4 /*yield*/, loadGroupInfos(participantGroupInfos.filter(function (groupInfoId) {
                                return (0, tutanota_utils_1.neverNull)(customer_1.contactFormUserGroups).list !== groupInfoId[0];
                            }))];
                    case 3:
                        groupInfos = _a.sent();
                        return [2 /*return*/, groupInfos.filter(function (groupInfo) { return groupInfo.deleted == null; })];
                    case 4: return [2 /*return*/, []];
                }
            });
        });
    };
    MailViewerViewModel.prototype.assignMail = function (userGroupInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var recipient, newReplyTos, args, _a, mailboxDetails, defaultSendMailModel, model, folders;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.canAssignMails()) {
                            throw new ProgrammingError_1.ProgrammingError("Cannot assign mails");
                        }
                        recipient = (0, TypeRefs_js_1.createMailAddress)();
                        recipient.address = (0, tutanota_utils_1.neverNull)(userGroupInfo.mailAddress);
                        recipient.name = userGroupInfo.name;
                        if (this.getReplyTos().length > 0) {
                            newReplyTos = this.getReplyTos();
                        }
                        else {
                            newReplyTos = [(0, TypeRefs_js_1.createEncryptedMailAddress)()];
                            newReplyTos[0].address = this.getSender().address;
                            newReplyTos[0].name = this.getSender().name;
                        }
                        return [4 /*yield*/, this.createResponseMailArgsForForwarding([recipient], newReplyTos, false)];
                    case 1:
                        args = _b.sent();
                        return [4 /*yield*/, Promise.all([this.getMailboxDetails(), Promise.resolve().then(function () { return require("../editor/SendMailModel"); })])
                            // Make sure inline images are loaded
                        ];
                    case 2:
                        _a = _b.sent(), mailboxDetails = _a[0], defaultSendMailModel = _a[1].defaultSendMailModel;
                        // Make sure inline images are loaded
                        return [4 /*yield*/, this.loadAll({ notify: false })];
                    case 3:
                        // Make sure inline images are loaded
                        _b.sent();
                        return [4 /*yield*/, defaultSendMailModel(mailboxDetails).initAsResponse(args, this.getLoadedInlineImages())];
                    case 4:
                        model = _b.sent();
                        return [4 /*yield*/, model.send("0" /* MailMethod.NONE */)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, this.mailModel.getMailboxFolders(this.mail)];
                    case 6:
                        folders = _b.sent();
                        return [2 /*return*/, (0, MailGuiUtils_1.moveMails)({ mailModel: this.mailModel, mails: [this.mail], targetMailFolder: (0, MailUtils_1.getArchiveFolder)(folders) })];
                }
            });
        });
    };
    MailViewerViewModel.prototype.getNonInlineAttachments = function () {
        var _a, _b;
        // If we have attachments it is safe to assume that we already have body and referenced cids from it
        var inlineFileIds = (_b = (_a = this.sanitizeResult) === null || _a === void 0 ? void 0 : _a.inlineImageCids) !== null && _b !== void 0 ? _b : [];
        return this.attachments.filter(function (a) { return a.cid == null || !inlineFileIds.includes(a.cid); });
    };
    MailViewerViewModel.prototype.downloadAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fileController.downloadAll(this.getNonInlineAttachments())];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MailViewerViewModel.prototype.downloadAndOpenAttachment = function (file, open) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var e_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 10]);
                        if (!open) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.fileController.open(file)];
                    case 1:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.fileController.download(file)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4: return [3 /*break*/, 10];
                    case 5:
                        e_6 = _b.sent();
                        if (!(e_6 instanceof FileOpenError_1.FileOpenError)) return [3 /*break*/, 7];
                        console.warn("FileOpenError", e_6);
                        return [4 /*yield*/, Dialog_1.Dialog.message("canNotOpenFileOnDevice_msg")];
                    case 6:
                        _b.sent();
                        return [3 /*break*/, 9];
                    case 7:
                        console.error("could not open file:", (_a = e_6.message) !== null && _a !== void 0 ? _a : "unknown error");
                        return [4 /*yield*/, Dialog_1.Dialog.message("errorDuringFileOpen_msg")];
                    case 8:
                        _b.sent();
                        _b.label = 9;
                    case 9: return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    /** Special feature for contact forms with shared mailboxes. */
    MailViewerViewModel.prototype.canAssignMails = function () {
        // do not allow re-assigning from personal mailbox
        return this.logins.getUserController().isInternalUser() &&
            this.areParticipantsRestricted() &&
            this.logins.getUserController().getUserMailGroupMembership().group !== this.getMailOwnerGroup();
    };
    MailViewerViewModel.prototype.areParticipantsRestricted = function () {
        var restrictions = this.getRestrictions();
        return restrictions != null && restrictions.participantGroupInfos.length > 0;
    };
    MailViewerViewModel.prototype.canReplyAll = function () {
        return this.logins.getUserController().isInternalUser() &&
            this.getToRecipients().length + this.getCcRecipients().length + this.getBccRecipients().length > 1 &&
            !this.areParticipantsRestricted();
    };
    MailViewerViewModel.prototype.canForwardOrMove = function () {
        return this.logins.getUserController().isInternalUser() && !this.areParticipantsRestricted();
    };
    MailViewerViewModel.prototype.shouldDelayRendering = function () {
        return this.renderIsDelayed;
    };
    MailViewerViewModel.prototype.getAssignmentGroupInfos = function () {
        return __awaiter(this, void 0, void 0, function () {
            var userOrMailGroupInfos;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAssignableMailRecipients()];
                    case 1:
                        userOrMailGroupInfos = _a.sent();
                        return [2 /*return*/, userOrMailGroupInfos
                                .filter(function (userOrMailGroupInfo) {
                                if (_this.logins.getUserController().getUserMailGroupMembership().group === _this.getMailOwnerGroup()) {
                                    return userOrMailGroupInfo.group !== _this.logins.getUserController().userGroupInfo.group && userOrMailGroupInfo.group !== _this.mail._ownerGroup;
                                }
                                else {
                                    return userOrMailGroupInfo.group !== _this.mail._ownerGroup;
                                }
                            })];
                }
            });
        });
    };
    MailViewerViewModel.prototype.getMailOwnerGroup = function () {
        return this.mail._ownerGroup;
    };
    MailViewerViewModel.prototype.updateMail = function (_a) {
        var _this = this;
        var mail = _a.mail, delayBodyRenderingUntil = _a.delayBodyRenderingUntil, showFolder = _a.showFolder;
        if (!(0, EntityUtils_1.isSameId)(mail._id, this.mail._id)) {
            throw new ProgrammingError_1.ProgrammingError("Trying to update MailViewerViewModel with unrelated email ".concat(JSON.stringify(this.mail._id), " ").concat(JSON.stringify(mail._id), " ").concat(mithril_1["default"].route.get()));
        }
        this._mail = mail;
        if (delayBodyRenderingUntil) {
            this.delayBodyRenderingUntil = delayBodyRenderingUntil;
            this.renderIsDelayed = true;
            this.delayBodyRenderingUntil.then(function () {
                _this.renderIsDelayed = false;
                mithril_1["default"].redraw();
            });
        }
        this.folderText = null;
        if (showFolder) {
            this.showFolder();
        }
        this.relevantRecipient = null;
        this.determineRelevantRecipient();
        this.loadAll({ notify: true });
    };
    return MailViewerViewModel;
}());
exports.MailViewerViewModel = MailViewerViewModel;
