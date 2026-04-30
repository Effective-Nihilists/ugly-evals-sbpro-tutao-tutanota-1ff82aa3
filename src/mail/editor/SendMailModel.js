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
exports.defaultSendMailModel = exports.SendMailModel = exports.TOO_MANY_VISIBLE_RECIPIENTS = void 0;
var TutanotaConstants_1 = require("../../api/common/TutanotaConstants");
var RestError_1 = require("../../api/common/error/RestError");
var UserError_1 = require("../../api/main/UserError");
var PasswordUtils_1 = require("../../misc/passwords/PasswordUtils");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var MailUtils_1 = require("../model/MailUtils");
var TypeRefs_js_1 = require("../../api/entities/tutanota/TypeRefs.js");
var FileNotFoundError_1 = require("../../api/common/error/FileNotFoundError");
var LoginController_1 = require("../../api/main/LoginController");
var RecipientNotResolvedError_1 = require("../../api/common/error/RecipientNotResolvedError");
var stream_1 = require("mithril/stream");
var EventController_1 = require("../../api/main/EventController");
var FormatValidator_1 = require("../../misc/FormatValidator");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var RecipientsNotFoundError_1 = require("../../api/common/error/RecipientsNotFoundError");
var LoginUtils_1 = require("../../misc/LoginUtils");
var MainLocator_1 = require("../../api/main/MainLocator");
var ContactUtils_1 = require("../../contacts/model/ContactUtils");
var EntityUtils_1 = require("../../api/common/utils/EntityUtils");
var TypeRefs_js_2 = require("../../api/entities/sys/TypeRefs.js");
var MailGuiUtils_1 = require("../view/MailGuiUtils");
var MailBodyTooLargeError_1 = require("../../api/common/error/MailBodyTooLargeError");
var Env_1 = require("../../api/common/Env");
var RecipientsModel_1 = require("../../api/main/RecipientsModel");
var TypeRefs_1 = require("../../api/entities/monitor/TypeRefs");
var NoZoneDateProvider_js_1 = require("../../api/common/utils/NoZoneDateProvider.js");
var MailUtils_js_1 = require("../model/MailUtils.js");
(0, Env_1.assertMainOrNode)();
exports.TOO_MANY_VISIBLE_RECIPIENTS = 10;
/**
 * Model which allows sending mails interactively - including resolving of recipients and handling of drafts.
 */
var SendMailModel = /** @class */ (function () {
    /**
     * creates a new empty draft message. calling an init method will fill in all the blank data
     */
    function SendMailModel(mailFacade, entity, logins, mailModel, contactModel, eventController, mailboxDetails, recipientsModel, dateProvider) {
        var _this = this;
        this.mailFacade = mailFacade;
        this.entity = entity;
        this.logins = logins;
        this.mailModel = mailModel;
        this.contactModel = contactModel;
        this.eventController = eventController;
        this.mailboxDetails = mailboxDetails;
        this.recipientsModel = recipientsModel;
        this.dateProvider = dateProvider;
        this.onMailChanged = (0, stream_1["default"])(false);
        this.onRecipientDeleted = (0, stream_1["default"])(null);
        this.onBeforeSend = tutanota_utils_1.noOp;
        this.loadedInlineImages = new Map();
        // Isn't private because used by MinimizedEditorOverlay, refactor?
        this.draft = null;
        this.conversationType = "0" /* ConversationType.NEW */;
        this.subject = "";
        this.body = "";
        this.recipients = new Map();
        // contains either Files from Tutanota or DataFiles of locally loaded files. these map 1:1 to the _attachmentButtons
        this.attachments = [];
        this.replyTos = [];
        // only needs to be the correct value if this is a new email. if we are editing a draft, conversationType is not used
        this.previousMessageId = null;
        this.previousMail = null;
        this.availableNotificationTemplateLanguages = [];
        this.mailChangedAt = 0;
        this.mailSavedAt = 1;
        this.passwords = new Map();
        // The promise for the draft currently being saved
        this.currentSavePromise = null;
        // If saveDraft is called while the previous call is still running, then flag to call again afterwards
        this.doSaveAgain = false;
        this.recipientsResolved = Promise.resolve();
        var userProps = logins.getUserController().props;
        this.senderAddress = this.getDefaultSender();
        this.confidential = !userProps.defaultUnconfidential;
        this.selectedNotificationLanguage = (0, LanguageViewModel_1.getAvailableLanguageCode)(userProps.notificationMailLanguage || LanguageViewModel_1.lang.code);
        this.updateAvailableNotificationTemplateLanguages();
        this.eventController.addEntityListener(function (updates) { return _this.entityEventReceived(updates); });
    }
    SendMailModel.prototype.entityEventReceived = function (updates) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, updates_1, update;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _i = 0, updates_1 = updates;
                        _a.label = 1;
                    case 1:
                        if (!(_i < updates_1.length)) return [3 /*break*/, 4];
                        update = updates_1[_i];
                        return [4 /*yield*/, this.handleEntityEvent(update)];
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
     * Sort list of all languages alphabetically
     * then we see if the user has custom notification templates
     * in which case we replace the list with just the templates that the user has specified
     */
    SendMailModel.prototype.updateAvailableNotificationTemplateLanguages = function () {
        return __awaiter(this, void 0, void 0, function () {
            var filteredLanguages, languageCodes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.availableNotificationTemplateLanguages = LanguageViewModel_1.languages.slice().sort(function (a, b) { return LanguageViewModel_1.lang.get(a.textId).localeCompare(LanguageViewModel_1.lang.get(b.textId)); });
                        return [4 /*yield*/, (0, MailUtils_1.getTemplateLanguages)(this.availableNotificationTemplateLanguages, this.entity, this.logins)];
                    case 1:
                        filteredLanguages = _a.sent();
                        if (filteredLanguages.length > 0) {
                            languageCodes = filteredLanguages.map(function (l) { return l.code; });
                            this.selectedNotificationLanguage =
                                (0, LanguageViewModel_1.getSubstitutedLanguageCode)(this.logins.getUserController().props.notificationMailLanguage || LanguageViewModel_1.lang.code, languageCodes) || languageCodes[0];
                            this.availableNotificationTemplateLanguages = filteredLanguages;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    SendMailModel.prototype.user = function () {
        return this.logins.getUserController();
    };
    SendMailModel.prototype.getPreviousMail = function () {
        return this.previousMail;
    };
    SendMailModel.prototype.getConversationType = function () {
        return this.conversationType;
    };
    SendMailModel.prototype.setPassword = function (mailAddress, password) {
        this.markAsChangedIfNecessary(!this.passwords.has(mailAddress) || this.passwords.get(mailAddress) !== password);
        this.passwords.set(mailAddress, password);
    };
    SendMailModel.prototype.getPassword = function (mailAddress) {
        return this.passwords.get(mailAddress) || "";
    };
    SendMailModel.prototype.getSubject = function () {
        return this.subject;
    };
    SendMailModel.prototype.setSubject = function (subject) {
        this.markAsChangedIfNecessary(subject !== this.subject);
        this.subject = subject;
    };
    SendMailModel.prototype.getBody = function () {
        return this.body;
    };
    SendMailModel.prototype.setBody = function (body) {
        this.markAsChangedIfNecessary(this.body !== body);
        this.body = body;
    };
    SendMailModel.prototype.setSender = function (senderAddress) {
        this.markAsChangedIfNecessary(this.senderAddress !== senderAddress);
        this.senderAddress = senderAddress;
    };
    SendMailModel.prototype.getSender = function () {
        return this.senderAddress;
    };
    /**
     * Returns the strength indicator for the recipients password
     * @returns value between 0 and 100
     */
    SendMailModel.prototype.getPasswordStrength = function (recipient) {
        return (0, PasswordUtils_1.getPasswordStrengthForUser)(this.getPassword(recipient.address), recipient, this.mailboxDetails, this.logins);
    };
    SendMailModel.prototype.hasMailChanged = function () {
        return this.mailChangedAt > this.mailSavedAt;
    };
    /**
     * update the changed state of the mail.
     * will only be reset when saving.
     */
    SendMailModel.prototype.markAsChangedIfNecessary = function (hasChanged) {
        if (!hasChanged)
            return;
        this.mailChangedAt = this.dateProvider.now();
        // if this method is called wherever state gets changed, onMailChanged should function properly
        this.onMailChanged(true);
    };
    /**
     *
     * @param recipients
     * @param subject
     * @param bodyText
     * @param attachments
     * @param confidential
     * @param senderMailAddress
     * @param initialChangedState
     * @returns {Promise<SendMailModel>}
     */
    SendMailModel.prototype.initWithTemplate = function (recipients, subject, bodyText, attachments, confidential, senderMailAddress, initialChangedState) {
        return this.init({
            conversationType: "0" /* ConversationType.NEW */,
            subject: subject,
            bodyText: bodyText,
            recipients: recipients,
            attachments: attachments,
            confidential: confidential !== null && confidential !== void 0 ? confidential : null,
            senderMailAddress: senderMailAddress,
            initialChangedState: initialChangedState !== null && initialChangedState !== void 0 ? initialChangedState : null
        });
    };
    SendMailModel.prototype.initAsResponse = function (args, inlineImages) {
        return __awaiter(this, void 0, void 0, function () {
            var previousMail, conversationType, senderMailAddress, recipients, attachments, subject, bodyText, replyTos, previousMessageId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        previousMail = args.previousMail, conversationType = args.conversationType, senderMailAddress = args.senderMailAddress, recipients = args.recipients, attachments = args.attachments, subject = args.subject, bodyText = args.bodyText, replyTos = args.replyTos;
                        previousMessageId = null;
                        return [4 /*yield*/, this.entity
                                .load(TypeRefs_js_1.ConversationEntryTypeRef, previousMail.conversationEntry)
                                .then(function (ce) {
                                previousMessageId = ce.messageId;
                            })["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotFoundError, function (e) {
                                console.log("could not load conversation entry", e);
                            }))
                            // if we reuse the same image references, changing the displayed mail in mail view will cause the minimized draft to lose
                            // that reference, because it will be revoked
                        ];
                    case 1:
                        _a.sent();
                        // if we reuse the same image references, changing the displayed mail in mail view will cause the minimized draft to lose
                        // that reference, because it will be revoked
                        this.loadedInlineImages = (0, MailGuiUtils_1.cloneInlineImages)(inlineImages);
                        return [2 /*return*/, this.init({
                                conversationType: conversationType,
                                subject: subject,
                                bodyText: bodyText,
                                recipients: recipients,
                                senderMailAddress: senderMailAddress,
                                confidential: previousMail.confidential,
                                attachments: attachments,
                                replyTos: replyTos,
                                previousMail: previousMail,
                                previousMessageId: previousMessageId,
                                initialChangedState: false
                            })];
                }
            });
        });
    };
    SendMailModel.prototype.initWithDraft = function (draft, attachments, bodyText, inlineImages) {
        return __awaiter(this, void 0, void 0, function () {
            var previousMessageId, previousMail, conversationEntry, conversationType, previousEntry, e_1, confidential, sender, toRecipients, ccRecipients, bccRecipients, subject, replyTos, recipients;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        previousMessageId = null;
                        previousMail = null;
                        return [4 /*yield*/, this.entity.load(TypeRefs_js_1.ConversationEntryTypeRef, draft.conversationEntry)];
                    case 1:
                        conversationEntry = _a.sent();
                        conversationType = (0, tutanota_utils_1.downcast)(conversationEntry.conversationType);
                        if (!conversationEntry.previous) return [3 /*break*/, 7];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 6, , 7]);
                        return [4 /*yield*/, this.entity.load(TypeRefs_js_1.ConversationEntryTypeRef, conversationEntry.previous)];
                    case 3:
                        previousEntry = _a.sent();
                        previousMessageId = previousEntry.messageId;
                        if (!previousEntry.mail) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.entity.load(TypeRefs_js_1.MailTypeRef, previousEntry.mail)];
                    case 4:
                        previousMail = _a.sent();
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        e_1 = _a.sent();
                        if (e_1 instanceof RestError_1.NotFoundError) {
                            // ignore
                        }
                        else {
                            throw e_1;
                        }
                        return [3 /*break*/, 7];
                    case 7:
                        // if we reuse the same image references, changing the displayed mail in mail view will cause the minimized draft to lose
                        // that reference, because it will be revoked
                        this.loadedInlineImages = (0, MailGuiUtils_1.cloneInlineImages)(inlineImages);
                        confidential = draft.confidential, sender = draft.sender, toRecipients = draft.toRecipients, ccRecipients = draft.ccRecipients, bccRecipients = draft.bccRecipients, subject = draft.subject, replyTos = draft.replyTos;
                        recipients = {
                            to: toRecipients,
                            cc: ccRecipients,
                            bcc: bccRecipients
                        };
                        return [2 /*return*/, this.init({
                                conversationType: conversationType,
                                subject: subject,
                                bodyText: bodyText,
                                recipients: recipients,
                                draft: draft,
                                senderMailAddress: sender.address,
                                confidential: confidential,
                                attachments: attachments,
                                replyTos: replyTos,
                                previousMail: previousMail,
                                previousMessageId: previousMessageId,
                                initialChangedState: false
                            })];
                }
            });
        });
    };
    SendMailModel.prototype.init = function (_a) {
        var _b, _c, _d;
        var conversationType = _a.conversationType, subject = _a.subject, bodyText = _a.bodyText, draft = _a.draft, recipients = _a.recipients, senderMailAddress = _a.senderMailAddress, confidential = _a.confidential, attachments = _a.attachments, replyTos = _a.replyTos, previousMail = _a.previousMail, previousMessageId = _a.previousMessageId, initialChangedState = _a.initialChangedState;
        return __awaiter(this, void 0, void 0, function () {
            var to, cc, bcc, recipientsFilter;
            var _this = this;
            return __generator(this, function (_e) {
                this.conversationType = conversationType;
                this.subject = subject;
                this.body = bodyText;
                this.draft = draft || null;
                if (recipients instanceof Array) {
                    to = recipients;
                    cc = [];
                    bcc = [];
                }
                else {
                    to = (_b = recipients.to) !== null && _b !== void 0 ? _b : [];
                    cc = (_c = recipients.cc) !== null && _c !== void 0 ? _c : [];
                    bcc = (_d = recipients.bcc) !== null && _d !== void 0 ? _d : [];
                }
                recipientsFilter = function (recipientList) { return (0, tutanota_utils_1.deduplicate)(recipientList.filter(function (r) { return (0, FormatValidator_1.isMailAddress)(r.address, false); }), function (a, b) { return a.address === b.address; }); };
                this.recipientsResolved = Promise.all([
                    (0, tutanota_utils_1.promiseMap)(recipientsFilter(to), function (r) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, this.addRecipient(MailUtils_js_1.RecipientField.TO, r)];
                    }); }); }),
                    (0, tutanota_utils_1.promiseMap)(recipientsFilter(cc), function (r) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, this.addRecipient(MailUtils_js_1.RecipientField.CC, r)];
                    }); }); }),
                    (0, tutanota_utils_1.promiseMap)(recipientsFilter(bcc), function (r) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, this.addRecipient(MailUtils_js_1.RecipientField.BCC, r)];
                    }); }); }),
                ]);
                this.senderAddress = senderMailAddress || this.getDefaultSender();
                this.confidential = confidential !== null && confidential !== void 0 ? confidential : !this.user().props.defaultUnconfidential;
                this.attachments = [];
                if (attachments) {
                    this.attachFiles(attachments);
                }
                this.replyTos = recipientsFilter(replyTos !== null && replyTos !== void 0 ? replyTos : []).map(function (recipient) { return _this.recipientsModel.resolve(recipient, RecipientsModel_1.ResolveMode.Eager); });
                this.previousMail = previousMail || null;
                this.previousMessageId = previousMessageId || null;
                this.mailChangedAt = this.dateProvider.now();
                // Determine if we should have this mail already be detected as modified so it saves.
                if (initialChangedState) {
                    this.onMailChanged(true);
                    this.mailSavedAt = this.mailChangedAt - 1;
                }
                else {
                    this.mailSavedAt = this.mailChangedAt + 1;
                }
                return [2 /*return*/, this];
            });
        });
    };
    SendMailModel.prototype.getDefaultSender = function () {
        return (0, MailUtils_1.getDefaultSender)(this.logins, this.mailboxDetails);
    };
    SendMailModel.prototype.getRecipientList = function (type) {
        return (0, tutanota_utils_1.getFromMap)(this.recipients, type, function () { return []; });
    };
    SendMailModel.prototype.toRecipients = function () {
        return this.getRecipientList(MailUtils_js_1.RecipientField.TO);
    };
    SendMailModel.prototype.toRecipientsResolved = function () {
        return Promise.all(this.toRecipients().map(function (recipient) { return recipient.resolved(); }));
    };
    SendMailModel.prototype.ccRecipients = function () {
        return this.getRecipientList(MailUtils_js_1.RecipientField.CC);
    };
    SendMailModel.prototype.ccRecipientsResolved = function () {
        return Promise.all(this.ccRecipients().map(function (recipient) { return recipient.resolved(); }));
    };
    SendMailModel.prototype.bccRecipients = function () {
        return this.getRecipientList(MailUtils_js_1.RecipientField.BCC);
    };
    SendMailModel.prototype.bccRecipientsResolved = function () {
        return Promise.all(this.bccRecipients().map(function (recipient) { return recipient.resolved(); }));
    };
    SendMailModel.prototype.replyTosResolved = function () {
        return Promise.all(this.replyTos.map(function (r) { return r.resolved(); }));
    };
    /**
     * Add a new recipient, this method resolves when the recipient resolves
     */
    SendMailModel.prototype.addRecipient = function (fieldType, _a, resolveMode) {
        var address = _a.address, name = _a.name, type = _a.type, contact = _a.contact;
        if (resolveMode === void 0) { resolveMode = RecipientsModel_1.ResolveMode.Eager; }
        return __awaiter(this, void 0, void 0, function () {
            var recipient;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        recipient = this.getRecipientList(fieldType).find(function (recipient) { return recipient.address === address; });
                        // Only add a recipient if it doesn't exist
                        if (!recipient) {
                            recipient = this.recipientsModel.resolve({
                                address: address,
                                name: name,
                                type: type,
                                contact: contact
                            }, resolveMode);
                            this.getRecipientList(fieldType).push(recipient);
                            recipient.resolved().then(function (_a) {
                                var _b;
                                var address = _a.address, contact = _a.contact;
                                if (!_this.passwords.has(address) && contact != null) {
                                    _this.markAsChangedIfNecessary(true);
                                    _this.setPassword(address, (_b = contact.presharedPassword) !== null && _b !== void 0 ? _b : "");
                                }
                                else {
                                    // always notify listeners after we finished resolving the recipient, even if email itself didn't change
                                    _this.onMailChanged(true);
                                }
                            });
                            this.markAsChangedIfNecessary(true);
                        }
                        return [4 /*yield*/, recipient.resolved()];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SendMailModel.prototype.getRecipient = function (type, address) {
        var _a;
        return (_a = this.getRecipientList(type).find(function (recipient) { return recipient.address === address; })) !== null && _a !== void 0 ? _a : null;
    };
    SendMailModel.prototype.removeRecipientByAddress = function (address, type, notify) {
        if (notify === void 0) { notify = true; }
        var recipient = this.getRecipientList(type).find(function (recipient) { return recipient.address === address; });
        if (recipient) {
            this.removeRecipient(recipient, type, notify);
        }
    };
    /**
     * remove recipient from the recipient list
     * @return true if the recipient was removed
     */
    SendMailModel.prototype.removeRecipient = function (recipient, type, notify) {
        var _a;
        if (notify === void 0) { notify = true; }
        var recipients = (_a = this.recipients.get(type)) !== null && _a !== void 0 ? _a : [];
        var didRemove = (0, tutanota_utils_1.findAndRemove)(recipients, function (r) { return r.address === recipient.address; });
        this.markAsChangedIfNecessary(didRemove);
        if (didRemove && notify) {
            this.onRecipientDeleted({
                field: type,
                recipient: recipient
            });
        }
        return didRemove;
    };
    SendMailModel.prototype.dispose = function () {
        this.eventController.removeEntityListener(this.entityEventReceived);
        (0, MailGuiUtils_1.revokeInlineImages)(this.loadedInlineImages);
    };
    /**
     * @throws UserError in the case that any files were too big to attach. Small enough files will still have been attached
     */
    SendMailModel.prototype.getAttachments = function () {
        return this.attachments;
    };
    /** @throws UserError in case files are too big to add */
    SendMailModel.prototype.attachFiles = function (files) {
        var _a;
        var sizeLeft = TutanotaConstants_1.MAX_ATTACHMENT_SIZE - this.attachments.reduce(function (total, file) { return total + Number(file.size); }, 0);
        var sizeCheckResult = (0, MailUtils_1.checkAttachmentSize)(files, sizeLeft);
        (_a = this.attachments).push.apply(_a, sizeCheckResult.attachableFiles);
        this.markAsChangedIfNecessary(sizeCheckResult.attachableFiles.length > 0);
        if (sizeCheckResult.tooBigFiles.length > 0) {
            throw new UserError_1.UserError(function () { return LanguageViewModel_1.lang.get("tooBigAttachment_msg") + "\n" + sizeCheckResult.tooBigFiles.join("\n"); });
        }
    };
    SendMailModel.prototype.removeAttachment = function (file) {
        this.markAsChangedIfNecessary((0, tutanota_utils_1.remove)(this.attachments, file));
    };
    SendMailModel.prototype.getSenderName = function () {
        return (0, MailUtils_1.getSenderNameForUser)(this.mailboxDetails, this.user());
    };
    SendMailModel.prototype.getDraft = function () {
        return this.draft;
    };
    SendMailModel.prototype.updateDraft = function (body, attachments, draft) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            var _c;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _b = (_a = this.mailFacade)
                            .updateDraft;
                        _c = {
                            subject: this.getSubject(),
                            body: body,
                            senderMailAddress: this.senderAddress,
                            senderName: this.getSenderName()
                        };
                        return [4 /*yield*/, this.toRecipientsResolved()];
                    case 1:
                        _c.toRecipients = _d.sent();
                        return [4 /*yield*/, this.ccRecipientsResolved()];
                    case 2:
                        _c.ccRecipients = _d.sent();
                        return [4 /*yield*/, this.bccRecipientsResolved()];
                    case 3: return [2 /*return*/, _b.apply(_a, [(_c.bccRecipients = _d.sent(),
                                _c.attachments = attachments,
                                _c.confidential = this.isConfidential(),
                                _c.draft = draft,
                                _c)])["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.LockedError, function (e) {
                            console.log("updateDraft: operation is still active", e);
                            throw new UserError_1.UserError("operationStillActive_msg");
                        }))["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotFoundError, function (e) {
                            console.log("draft has been deleted, creating new one");
                            return _this.createDraft(body, attachments, (0, tutanota_utils_1.downcast)(draft.method));
                        }))];
                }
            });
        });
    };
    SendMailModel.prototype.createDraft = function (body, attachments, mailMethod) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _b = (_a = this.mailFacade).createDraft;
                        _c = {
                            subject: this.getSubject(),
                            bodyText: body,
                            senderMailAddress: this.senderAddress,
                            senderName: this.getSenderName()
                        };
                        return [4 /*yield*/, this.toRecipientsResolved()];
                    case 1:
                        _c.toRecipients = _d.sent();
                        return [4 /*yield*/, this.ccRecipientsResolved()];
                    case 2:
                        _c.ccRecipients = _d.sent();
                        return [4 /*yield*/, this.bccRecipientsResolved()];
                    case 3:
                        _c.bccRecipients = _d.sent(),
                            _c.conversationType = this.conversationType,
                            _c.previousMessageId = this.previousMessageId,
                            _c.attachments = attachments,
                            _c.confidential = this.isConfidential();
                        return [4 /*yield*/, this.replyTosResolved()];
                    case 4: return [2 /*return*/, _b.apply(_a, [(_c.replyTos = _d.sent(),
                                _c.method = mailMethod,
                                _c)])];
                }
            });
        });
    };
    SendMailModel.prototype.isConfidential = function () {
        return this.confidential || !this.containsExternalRecipients();
    };
    SendMailModel.prototype.isConfidentialExternal = function () {
        return this.confidential && this.containsExternalRecipients();
    };
    SendMailModel.prototype.setConfidential = function (confidential) {
        this.markAsChangedIfNecessary(this.confidential !== confidential);
        this.confidential = confidential;
    };
    SendMailModel.prototype.containsExternalRecipients = function () {
        return this.allRecipients().some(function (r) { return r.type === "external" /* RecipientType.EXTERNAL */; });
    };
    SendMailModel.prototype.getExternalRecipients = function () {
        return this.allRecipients().filter(function (r) { return r.type === "external" /* RecipientType.EXTERNAL */; });
    };
    /**
     * @reject {RecipientsNotFoundError}
     * @reject {TooManyRequestsError}
     * @reject {AccessBlockedError}
     * @reject {FileNotFoundError}
     * @reject {PreconditionFailedError}
     * @reject {LockedError}
     * @reject {UserError}
     * @param mailMethod
     * @param getConfirmation: A callback to get user confirmation
     * @param waitHandler: A callback to allow UI blocking while the mail is being sent. it seems like wrapping the send call in showProgressDialog causes the confirmation dialogs not to be shown. We should fix this, but this works for now
     * @param tooManyRequestsError
     * @return true if the send was completed, false if it was aborted (by getConfirmation returning false
     */
    SendMailModel.prototype.send = function (mailMethod, getConfirmation, waitHandler, tooManyRequestsError) {
        if (getConfirmation === void 0) { getConfirmation = function (_) { return Promise.resolve(true); }; }
        if (waitHandler === void 0) { waitHandler = function (_, p) { return p; }; }
        if (tooManyRequestsError === void 0) { tooManyRequestsError = "tooManyMails_msg"; }
        return __awaiter(this, void 0, void 0, function () {
            var numVisibleRecipients, _a, _b, recipients, _c, doSend;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.recipientsResolved];
                    case 1:
                        _d.sent();
                        this.onBeforeSend();
                        if (!(this.allRecipients().length === 1 && this.allRecipients()[0].address.toLowerCase().trim() === "approval@tutao.de")) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.sendApprovalMail(this.getBody())];
                    case 2:
                        _d.sent();
                        return [2 /*return*/, true];
                    case 3:
                        if (this.toRecipients().length === 0 && this.ccRecipients().length === 0 && this.bccRecipients().length === 0) {
                            throw new UserError_1.UserError("noRecipients_msg");
                        }
                        numVisibleRecipients = this.toRecipients().length + this.ccRecipients().length;
                        _a = numVisibleRecipients >= exports.TOO_MANY_VISIBLE_RECIPIENTS;
                        if (!_a) return [3 /*break*/, 5];
                        return [4 /*yield*/, getConfirmation("manyRecipients_msg")];
                    case 4:
                        _a = !(_d.sent());
                        _d.label = 5;
                    case 5:
                        // Many recipients is a warning
                        if (_a) {
                            return [2 /*return*/, false];
                        }
                        _b = this.getSubject().length === 0;
                        if (!_b) return [3 /*break*/, 7];
                        return [4 /*yield*/, getConfirmation("noSubject_msg")];
                    case 6:
                        _b = !(_d.sent());
                        _d.label = 7;
                    case 7:
                        // Empty subject is a warning
                        if (_b) {
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, this.waitForResolvedRecipients()
                            // No password in external confidential mail is an error
                        ];
                    case 8:
                        recipients = _d.sent();
                        // No password in external confidential mail is an error
                        if (this.isConfidentialExternal() && this.getExternalRecipients().some(function (r) { return !_this.getPassword(r.address); })) {
                            throw new UserError_1.UserError("noPreSharedPassword_msg");
                        }
                        _c = this.isConfidentialExternal() && this.hasInsecurePasswords();
                        if (!_c) return [3 /*break*/, 10];
                        return [4 /*yield*/, getConfirmation("presharedPasswordNotStrongEnough_msg")];
                    case 9:
                        _c = !(_d.sent());
                        _d.label = 10;
                    case 10:
                        // Weak password is a warning
                        if (_c) {
                            return [2 /*return*/, false];
                        }
                        doSend = function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.saveDraft(true, mailMethod)];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, this.updateContacts(recipients)];
                                    case 2:
                                        _a.sent();
                                        return [4 /*yield*/, this.mailFacade.sendDraft((0, tutanota_utils_1.neverNull)(this.draft), recipients, this.selectedNotificationLanguage)];
                                    case 3:
                                        _a.sent();
                                        return [4 /*yield*/, this.updatePreviousMail()];
                                    case 4:
                                        _a.sent();
                                        return [4 /*yield*/, this.updateExternalLanguage()];
                                    case 5:
                                        _a.sent();
                                        return [2 /*return*/, true];
                                }
                            });
                        }); };
                        return [2 /*return*/, waitHandler(this.isConfidential() ? "sending_msg" : "sendingUnencrypted_msg", doSend())["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.LockedError, function () {
                                throw new UserError_1.UserError("operationStillActive_msg");
                            })) // catch all of the badness
                            ["catch"]((0, tutanota_utils_1.ofClass)(RecipientNotResolvedError_1.RecipientNotResolvedError, function () {
                                throw new UserError_1.UserError("tooManyAttempts_msg");
                            }))["catch"]((0, tutanota_utils_1.ofClass)(RecipientsNotFoundError_1.RecipientsNotFoundError, function (e) {
                                if (mailMethod === "5" /* MailMethod.ICAL_CANCEL */) {
                                    // in case of calendar event termination we will remove invalid recipients and then delete the event without sending updates
                                    throw e;
                                }
                                else {
                                    var invalidRecipients_1 = e.message;
                                    throw new UserError_1.UserError(function () { return LanguageViewModel_1.lang.get("tutanotaAddressDoesNotExist_msg") + " " + LanguageViewModel_1.lang.get("invalidRecipients_msg") + "\n" + invalidRecipients_1; });
                                }
                            }))["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.TooManyRequestsError, function () {
                                throw new UserError_1.UserError(tooManyRequestsError);
                            }))["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.AccessBlockedError, function (e) {
                                // special case: the approval status is set to SpamSender, but the update has not been received yet, so use SpamSender as default
                                return (0, LoginUtils_1.checkApprovalStatus)(_this.logins, true, TutanotaConstants_1.ApprovalStatus.SPAM_SENDER).then(function () {
                                    console.log("could not send mail (blocked access)", e);
                                    return false;
                                });
                            }))["catch"]((0, tutanota_utils_1.ofClass)(FileNotFoundError_1.FileNotFoundError, function () {
                                throw new UserError_1.UserError("couldNotAttachFile_msg");
                            }))["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.PreconditionFailedError, function () {
                                throw new UserError_1.UserError("operationStillActive_msg");
                            }))];
                }
            });
        });
    };
    /**
     * Whether any of the external recipients have an insecure password.
     * We don't consider empty passwords, because an empty password will disallow and encrypted email from sending, whereas an insecure password
     * can still be used
     * @returns {boolean}
     */
    SendMailModel.prototype.hasInsecurePasswords = function () {
        var _this = this;
        var minimalPasswordStrength = this.allRecipients()
            .filter(function (r) { return _this.getPassword(r.address) !== ""; })
            .reduce(function (min, recipient) { return Math.min(min, _this.getPasswordStrength(recipient)); }, PasswordUtils_1.PASSWORD_MIN_SECURE_VALUE);
        return !(0, PasswordUtils_1.isSecurePassword)(minimalPasswordStrength);
    };
    SendMailModel.prototype.saveDraft = function (saveAttachments, mailMethod) {
        var _this = this;
        if (this.currentSavePromise == null) {
            this.currentSavePromise = Promise.resolve().then(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, , 2, 3]);
                            return [4 /*yield*/, this.doSaveDraft(saveAttachments, mailMethod)];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            // If there is an error, we still need to reset currentSavePromise
                            this.currentSavePromise = null;
                            return [7 /*endfinally*/];
                        case 3:
                            if (!(this.hasMailChanged() && this.doSaveAgain)) return [3 /*break*/, 5];
                            this.doSaveAgain = false;
                            return [4 /*yield*/, this.saveDraft(saveAttachments, mailMethod)];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5: return [2 /*return*/];
                    }
                });
            }); });
        }
        else {
            this.doSaveAgain = true;
        }
        return this.currentSavePromise;
    };
    /**
     * Saves the draft.
     * @param saveAttachments True if also the attachments shall be saved, false otherwise.
     * @param mailMethod
     * @returns {Promise} When finished.
     * @throws FileNotFoundError when one of the attachments could not be opened
     * @throws PreconditionFailedError when the draft is locked
     */
    SendMailModel.prototype.doSaveDraft = function (saveAttachments, mailMethod) {
        return __awaiter(this, void 0, void 0, function () {
            var attachments, _a, _b, _c, newAttachments, e_2;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 8, , 9]);
                        attachments = saveAttachments ? this.attachments : null;
                        // We also want to create new drafts for drafts edited from trash or spam folder
                        _a = this;
                        _c = this.draft == null;
                        if (_c) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.isMailInTrashOrSpam(this.draft)];
                    case 1:
                        _c = (_d.sent());
                        _d.label = 2;
                    case 2:
                        if (!_c) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.createDraft(this.getBody(), attachments, mailMethod)];
                    case 3:
                        _b = _d.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.updateDraft(this.getBody(), attachments, this.draft)];
                    case 5:
                        _b = _d.sent();
                        _d.label = 6;
                    case 6:
                        // We also want to create new drafts for drafts edited from trash or spam folder
                        _a.draft = _b;
                        return [4 /*yield*/, (0, tutanota_utils_1.promiseMap)(this.draft.attachments, function (fileId) { return _this.entity.load(TypeRefs_js_1.FileTypeRef, fileId); }, {
                                concurrency: 5
                            })];
                    case 7:
                        newAttachments = _d.sent();
                        this.attachments = []; // attachFiles will push to existing files but we want to overwrite them
                        this.attachFiles(newAttachments);
                        // Allow any changes that might occur while the mail is being saved to be accounted for
                        // if saved is called before this has completed
                        this.mailSavedAt = this.dateProvider.now();
                        return [3 /*break*/, 9];
                    case 8:
                        e_2 = _d.sent();
                        if (e_2 instanceof RestError_1.PayloadTooLargeError) {
                            throw new UserError_1.UserError("requestTooLarge_msg");
                        }
                        else if (e_2 instanceof MailBodyTooLargeError_1.MailBodyTooLargeError) {
                            throw new UserError_1.UserError("mailBodyTooLarge_msg");
                        }
                        else if (e_2 instanceof FileNotFoundError_1.FileNotFoundError) {
                            throw new UserError_1.UserError("couldNotAttachFile_msg");
                        }
                        else if (e_2 instanceof RestError_1.PreconditionFailedError) {
                            throw new UserError_1.UserError("operationStillActive_msg");
                        }
                        else {
                            throw e_2;
                        }
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    SendMailModel.prototype.isMailInTrashOrSpam = function (draft) {
        return __awaiter(this, void 0, void 0, function () {
            var folders, trashAndMailFolders;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.mailModel.getMailboxFolders(draft)];
                    case 1:
                        folders = _a.sent();
                        trashAndMailFolders = folders.filter(function (f) { return f.folderType === TutanotaConstants_1.MailFolderType.TRASH || f.folderType === TutanotaConstants_1.MailFolderType.SPAM; });
                        return [2 /*return*/, trashAndMailFolders.some(function (folder) { return (0, EntityUtils_1.isSameId)(folder.mails, (0, EntityUtils_1.getListId)(draft)); })];
                }
            });
        });
    };
    SendMailModel.prototype.sendApprovalMail = function (body) {
        var listId = "---------c--";
        var m = (0, TypeRefs_1.createApprovalMail)({
            _id: [listId, (0, EntityUtils_1.stringToCustomId)(this.senderAddress)],
            _ownerGroup: this.user().user.userGroup.group,
            text: "Subject: ".concat(this.getSubject(), "<br>").concat(body)
        });
        return this.entity.setup(listId, m)["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotAuthorizedError, function (e) { return console.log("not authorized for approval message"); }));
    };
    SendMailModel.prototype.getAvailableNotificationTemplateLanguages = function () {
        return this.availableNotificationTemplateLanguages;
    };
    SendMailModel.prototype.getSelectedNotificationLanguageCode = function () {
        return this.selectedNotificationLanguage;
    };
    SendMailModel.prototype.setSelectedNotificationLanguageCode = function (code) {
        this.markAsChangedIfNecessary(this.selectedNotificationLanguage !== code);
        this.selectedNotificationLanguage = code;
        this.markAsChangedIfNecessary(true);
    };
    SendMailModel.prototype.updateExternalLanguage = function () {
        var props = this.user().props;
        if (props.notificationMailLanguage !== this.selectedNotificationLanguage) {
            props.notificationMailLanguage = this.selectedNotificationLanguage;
            this.entity.update(props);
        }
    };
    SendMailModel.prototype.updatePreviousMail = function () {
        if (this.previousMail) {
            if (this.previousMail.replyType === "0" /* ReplyType.NONE */ && this.conversationType === "1" /* ConversationType.REPLY */) {
                this.previousMail.replyType = "1" /* ReplyType.REPLY */;
            }
            else if (this.previousMail.replyType === "0" /* ReplyType.NONE */ && this.conversationType === "2" /* ConversationType.FORWARD */) {
                this.previousMail.replyType = "2" /* ReplyType.FORWARD */;
            }
            else if (this.previousMail.replyType === "2" /* ReplyType.FORWARD */ && this.conversationType === "1" /* ConversationType.REPLY */) {
                this.previousMail.replyType = "3" /* ReplyType.REPLY_FORWARD */;
            }
            else if (this.previousMail.replyType === "1" /* ReplyType.REPLY */ && this.conversationType === "2" /* ConversationType.FORWARD */) {
                this.previousMail.replyType = "3" /* ReplyType.REPLY_FORWARD */;
            }
            else {
                return Promise.resolve();
            }
            return this.entity.update(this.previousMail)["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotFoundError, tutanota_utils_1.noOp));
        }
        else {
            return Promise.resolve();
        }
    };
    /**
     * If contacts have had their passwords changed, we update them before sending
     */
    SendMailModel.prototype.updateContacts = function (resolvedRecipients) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, resolvedRecipients_1, _a, address, contact, type, isExternalAndConfidential, listId;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, resolvedRecipients_1 = resolvedRecipients;
                        _b.label = 1;
                    case 1:
                        if (!(_i < resolvedRecipients_1.length)) return [3 /*break*/, 7];
                        _a = resolvedRecipients_1[_i], address = _a.address, contact = _a.contact, type = _a.type;
                        if (contact == null) {
                            return [3 /*break*/, 6];
                        }
                        isExternalAndConfidential = type === "external" /* RecipientType.EXTERNAL */ && this.isConfidential();
                        if (!(!contact._id && (!this.user().props.noAutomaticContacts || isExternalAndConfidential))) return [3 /*break*/, 4];
                        if (isExternalAndConfidential) {
                            contact.presharedPassword = this.getPassword(address).trim();
                        }
                        return [4 /*yield*/, this.contactModel.contactListId()];
                    case 2:
                        listId = _b.sent();
                        return [4 /*yield*/, this.entity.setup(listId, contact)];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        if (!(contact._id && isExternalAndConfidential && contact.presharedPassword !== this.getPassword(address).trim())) return [3 /*break*/, 6];
                        contact.presharedPassword = this.getPassword(address).trim();
                        return [4 /*yield*/, this.entity.update(contact)];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 1];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    SendMailModel.prototype.allRecipients = function () {
        return this.toRecipients().concat(this.ccRecipients()).concat(this.bccRecipients());
    };
    /**
     * Makes sure the recipient type and contact are resolved.
     */
    SendMailModel.prototype.waitForResolvedRecipients = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.recipientsResolved];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, Promise.all(this.allRecipients().map(function (recipient) { return recipient.resolved(); }))["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.TooManyRequestsError, function () {
                                throw new RecipientNotResolvedError_1.RecipientNotResolvedError("");
                            }))];
                }
            });
        });
    };
    SendMailModel.prototype.handleEntityEvent = function (update) {
        return __awaiter(this, void 0, void 0, function () {
            var operation, instanceId, instanceListId, contactId, changed, _i, _a, fieldType, recipients, toDelete, _b, toDelete_1, r;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        operation = update.operation, instanceId = update.instanceId, instanceListId = update.instanceListId;
                        contactId = [(0, tutanota_utils_1.neverNull)(instanceListId), instanceId];
                        changed = false;
                        return [4 /*yield*/, this.recipientsResolved];
                    case 1:
                        _c.sent();
                        if ((0, EventController_1.isUpdateForTypeRef)(TypeRefs_js_1.ContactTypeRef, update)) {
                            if (operation === "1" /* OperationType.UPDATE */) {
                                this.entity.load(TypeRefs_js_1.ContactTypeRef, contactId).then(function (contact) {
                                    var _loop_1 = function (fieldType) {
                                        var matching = _this.getRecipientList(fieldType).filter(function (recipient) { return recipient.contact && (0, EntityUtils_1.isSameId)(recipient.contact._id, contact._id); });
                                        matching.forEach(function (recipient) {
                                            // if the mail address no longer exists on the contact then delete the recipient
                                            if (!contact.mailAddresses.find(function (ma) { return (0, tutanota_utils_1.cleanMatch)(ma.address, recipient.address); })) {
                                                changed = changed || _this.removeRecipient(recipient, fieldType, true);
                                            }
                                            else {
                                                // else just modify the recipient
                                                recipient.setName((0, ContactUtils_1.getContactDisplayName)(contact));
                                                recipient.setContact(contact);
                                                changed = true;
                                            }
                                        });
                                    };
                                    for (var _i = 0, _a = (0, tutanota_utils_1.typedValues)(MailUtils_js_1.RecipientField); _i < _a.length; _i++) {
                                        var fieldType = _a[_i];
                                        _loop_1(fieldType);
                                    }
                                });
                            }
                            else if (operation === "2" /* OperationType.DELETE */) {
                                for (_i = 0, _a = (0, tutanota_utils_1.typedValues)(MailUtils_js_1.RecipientField); _i < _a.length; _i++) {
                                    fieldType = _a[_i];
                                    recipients = this.getRecipientList(fieldType);
                                    toDelete = recipients.filter(function (recipient) { return (recipient.contact && (0, EntityUtils_1.isSameId)(recipient.contact._id, contactId)) || false; });
                                    for (_b = 0, toDelete_1 = toDelete; _b < toDelete_1.length; _b++) {
                                        r = toDelete_1[_b];
                                        changed = changed || this.removeRecipient(r, fieldType, true);
                                    }
                                }
                            }
                            this.markAsChangedIfNecessary(true);
                        }
                        else if ((0, EventController_1.isUpdateForTypeRef)(TypeRefs_js_2.CustomerPropertiesTypeRef, update)) {
                            this.updateAvailableNotificationTemplateLanguages();
                        }
                        this.markAsChangedIfNecessary(changed);
                        return [2 /*return*/, Promise.resolve()];
                }
            });
        });
    };
    SendMailModel.prototype.setOnBeforeSendFunction = function (fun) {
        this.onBeforeSend = fun;
    };
    return SendMailModel;
}());
exports.SendMailModel = SendMailModel;
function defaultSendMailModel(mailboxDetails) {
    return new SendMailModel(MainLocator_1.locator.mailFacade, MainLocator_1.locator.entityClient, LoginController_1.logins, MainLocator_1.locator.mailModel, MainLocator_1.locator.contactModel, MainLocator_1.locator.eventController, mailboxDetails, MainLocator_1.locator.recipientsModel, new NoZoneDateProvider_js_1.NoZoneDateProvider());
}
exports.defaultSendMailModel = defaultSendMailModel;
