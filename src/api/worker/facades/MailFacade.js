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
exports.phishingMarkerValue = exports.MailFacade = void 0;
var CryptoFacade_1 = require("../crypto/CryptoFacade");
var Services_js_1 = require("../../entities/tutanota/Services.js");
var TutanotaConstants_1 = require("../../common/TutanotaConstants");
var TypeRefs_js_1 = require("../../entities/tutanota/TypeRefs.js");
var RecipientsNotFoundError_1 = require("../../common/error/RecipientsNotFoundError");
var RestError_1 = require("../../common/error/RestError");
var TypeRefs_js_2 = require("../../entities/sys/TypeRefs.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Env_1 = require("../../common/Env");
var GroupUtils_1 = require("../../common/utils/GroupUtils");
var EntityUtils_1 = require("../../common/utils/EntityUtils");
var IndexUtils_1 = require("../search/IndexUtils");
var MailBodyTooLargeError_1 = require("../../common/error/MailBodyTooLargeError");
var Compression_1 = require("../Compression");
var tutanota_crypto_1 = require("@tutao/tutanota-crypto");
var FileUtils_1 = require("../../common/utils/FileUtils");
var Services_1 = require("../../entities/monitor/Services");
var Services_js_2 = require("../../entities/sys/Services.js");
var TypeRefs_1 = require("../../entities/monitor/TypeRefs");
(0, Env_1.assertWorkerOrNode)();
var MailFacade = /** @class */ (function () {
    function MailFacade(userFacade, fileFacade, entityClient, crypto, serviceExecutor, blobFacade, fileApp) {
        this.userFacade = userFacade;
        this.fileFacade = fileFacade;
        this.entityClient = entityClient;
        this.crypto = crypto;
        this.serviceExecutor = serviceExecutor;
        this.blobFacade = blobFacade;
        this.fileApp = fileApp;
        this.phishingMarkers = new Set();
        this.deferredDraftId = null; // the mail id of the draft that we are waiting for to be updated via websocket
        this.deferredDraftUpdate = null; // this deferred promise is resolved as soon as the update of the draft is received
    }
    MailFacade.prototype.createMailFolder = function (name, parent, ownerGroupId) {
        return __awaiter(this, void 0, void 0, function () {
            var mailGroupKey, sk, newFolder;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mailGroupKey = this.userFacade.getGroupKey(ownerGroupId);
                        sk = (0, tutanota_crypto_1.aes128RandomKey)();
                        newFolder = (0, TypeRefs_js_1.createCreateMailFolderData)({
                            folderName: name,
                            parentFolder: parent,
                            ownerEncSessionKey: (0, tutanota_crypto_1.encryptKey)(mailGroupKey, sk)
                        });
                        return [4 /*yield*/, this.serviceExecutor.post(Services_js_1.MailFolderService, newFolder, { sessionKey: sk })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Creates a draft mail.
     * @param bodyText The bodyText of the mail formatted as HTML.
     * @param previousMessageId The id of the message that this mail is a reply or forward to. Null if this is a new mail.
     * @param attachments The files that shall be attached to this mail or null if no files shall be attached. TutanotaFiles are already exising on the server, DataFiles are files from the local file system. Attention: the DataFile class information is lost
     * @param confidential True if the mail shall be sent end-to-end encrypted, false otherwise.
     */
    MailFacade.prototype.createDraft = function (_a) {
        var subject = _a.subject, bodyText = _a.bodyText, senderMailAddress = _a.senderMailAddress, senderName = _a.senderName, toRecipients = _a.toRecipients, ccRecipients = _a.ccRecipients, bccRecipients = _a.bccRecipients, conversationType = _a.conversationType, previousMessageId = _a.previousMessageId, attachments = _a.attachments, confidential = _a.confidential, replyTos = _a.replyTos, method = _a.method;
        return __awaiter(this, void 0, void 0, function () {
            var senderMailGroupId, userGroupKey, mailGroupKey, sk, service, _b, _c, _d, _e, createDraftReturn;
            var _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        if ((0, tutanota_utils_1.byteLength)(bodyText) > Compression_1.UNCOMPRESSED_MAX_SIZE) {
                            throw new MailBodyTooLargeError_1.MailBodyTooLargeError("Can't update draft, mail body too large (".concat((0, tutanota_utils_1.byteLength)(bodyText), ")"));
                        }
                        return [4 /*yield*/, this._getMailGroupIdForMailAddress(this.userFacade.getLoggedInUser(), senderMailAddress)];
                    case 1:
                        senderMailGroupId = _g.sent();
                        userGroupKey = this.userFacade.getUserGroupKey();
                        mailGroupKey = this.userFacade.getGroupKey(senderMailGroupId);
                        sk = (0, tutanota_crypto_1.aes128RandomKey)();
                        service = (0, TypeRefs_js_1.createDraftCreateData)();
                        service.previousMessageId = previousMessageId;
                        service.conversationType = conversationType;
                        service.ownerEncSessionKey = (0, tutanota_crypto_1.encryptKey)(mailGroupKey, sk);
                        service.symEncSessionKey = (0, tutanota_crypto_1.encryptKey)(userGroupKey, sk); // legacy
                        _b = service;
                        _c = TypeRefs_js_1.createDraftData;
                        _f = {
                            subject: subject,
                            compressedBodyText: bodyText,
                            senderMailAddress: senderMailAddress,
                            senderName: senderName,
                            confidential: confidential,
                            method: method,
                            toRecipients: toRecipients.map(recipientToDraftRecipient),
                            ccRecipients: ccRecipients.map(recipientToDraftRecipient),
                            bccRecipients: bccRecipients.map(recipientToDraftRecipient),
                            replyTos: replyTos.map(recipientToEncryptedMailAddress)
                        };
                        _d = this._createAddedAttachments;
                        _e = [attachments, [], senderMailGroupId, mailGroupKey];
                        return [4 /*yield*/, this.usingBlobs()];
                    case 2: return [4 /*yield*/, _d.apply(this, _e.concat([_g.sent()]))];
                    case 3:
                        _b.draftData = _c.apply(void 0, [(_f.addedAttachments = _g.sent(),
                                _f)]);
                        return [4 /*yield*/, this.serviceExecutor.post(Services_js_1.DraftService, service, { sessionKey: sk })];
                    case 4:
                        createDraftReturn = _g.sent();
                        return [2 /*return*/, this.entityClient.load(TypeRefs_js_1.MailTypeRef, createDraftReturn.draft)];
                }
            });
        });
    };
    /**
     * Updates a draft mail.
     * @param subject The subject of the mail.
     * @param body The body text of the mail.
     * @param senderMailAddress The senders mail address.
     * @param senderName The name of the sender that is sent together with the mail address of the sender.
     * @param toRecipients The recipients the mail shall be sent to.
     * @param ccRecipients The recipients the mail shall be sent to in cc.
     * @param bccRecipients The recipients the mail shall be sent to in bcc.
     * @param attachments The files that shall be attached to this mail or null if the current attachments shall not be changed.
     * @param confidential True if the mail shall be sent end-to-end encrypted, false otherwise.
     * @param draft The draft to update.
     * @return The updated draft. Rejected with TooManyRequestsError if the number allowed mails was exceeded, AccessBlockedError if the customer is not allowed to send emails currently because he is marked for approval.
     */
    MailFacade.prototype.updateDraft = function (_a) {
        var subject = _a.subject, body = _a.body, senderMailAddress = _a.senderMailAddress, senderName = _a.senderName, toRecipients = _a.toRecipients, ccRecipients = _a.ccRecipients, bccRecipients = _a.bccRecipients, attachments = _a.attachments, confidential = _a.confidential, draft = _a.draft;
        return __awaiter(this, void 0, void 0, function () {
            var senderMailGroupId, mailGroupKey, sk, service, _b, _c, _d, _e, deferredUpdatePromiseWrapper;
            var _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        if ((0, tutanota_utils_1.byteLength)(body) > Compression_1.UNCOMPRESSED_MAX_SIZE) {
                            throw new MailBodyTooLargeError_1.MailBodyTooLargeError("Can't update draft, mail body too large (".concat((0, tutanota_utils_1.byteLength)(body), ")"));
                        }
                        return [4 /*yield*/, this._getMailGroupIdForMailAddress(this.userFacade.getLoggedInUser(), senderMailAddress)];
                    case 1:
                        senderMailGroupId = _g.sent();
                        mailGroupKey = this.userFacade.getGroupKey(senderMailGroupId);
                        sk = (0, tutanota_crypto_1.decryptKey)(mailGroupKey, draft._ownerEncSessionKey);
                        service = (0, TypeRefs_js_1.createDraftUpdateData)();
                        service.draft = draft._id;
                        _b = service;
                        _c = TypeRefs_js_1.createDraftData;
                        _f = {
                            subject: subject,
                            compressedBodyText: body,
                            senderMailAddress: senderMailAddress,
                            senderName: senderName,
                            confidential: confidential,
                            method: draft.method,
                            toRecipients: toRecipients.map(recipientToDraftRecipient),
                            ccRecipients: ccRecipients.map(recipientToDraftRecipient),
                            bccRecipients: bccRecipients.map(recipientToDraftRecipient),
                            replyTos: draft.replyTos,
                            removedAttachments: this._getRemovedAttachments(attachments, draft.attachments)
                        };
                        _d = this._createAddedAttachments;
                        _e = [attachments, draft.attachments, senderMailGroupId, mailGroupKey];
                        return [4 /*yield*/, this.usingBlobs()];
                    case 2: return [4 /*yield*/, _d.apply(this, _e.concat([_g.sent()]))];
                    case 3:
                        _b.draftData = _c.apply(void 0, [(_f.addedAttachments = _g.sent(),
                                _f)]);
                        this.deferredDraftId = draft._id;
                        // we have to wait for the updated mail because sendMail() might be called right after this update
                        this.deferredDraftUpdate = (0, tutanota_utils_1.defer)();
                        deferredUpdatePromiseWrapper = this.deferredDraftUpdate;
                        return [4 /*yield*/, this.serviceExecutor.put(Services_js_1.DraftService, service, { sessionKey: sk })];
                    case 4:
                        _g.sent();
                        return [2 /*return*/, deferredUpdatePromiseWrapper.promise];
                }
            });
        });
    };
    MailFacade.prototype.moveMails = function (mails, targetFolder) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.serviceExecutor.post(Services_js_1.MoveMailService, (0, TypeRefs_js_1.createMoveMailData)({ mails: mails, targetFolder: targetFolder }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MailFacade.prototype.reportMail = function (mail, reportType) {
        return __awaiter(this, void 0, void 0, function () {
            var mailSessionKey, _a, postData;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = tutanota_utils_1.assertNotNull;
                        return [4 /*yield*/, this.crypto.resolveSessionKeyForInstance(mail)];
                    case 1:
                        mailSessionKey = _a.apply(void 0, [_b.sent()]);
                        postData = (0, TypeRefs_js_1.createReportMailPostData)({
                            mailId: mail._id,
                            mailSessionKey: (0, tutanota_crypto_1.bitArrayToUint8Array)(mailSessionKey),
                            reportType: reportType
                        });
                        return [4 /*yield*/, this.serviceExecutor.post(Services_js_1.ReportMailService, postData)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MailFacade.prototype.deleteMails = function (mails, folder) {
        return __awaiter(this, void 0, void 0, function () {
            var deleteMailData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        deleteMailData = (0, TypeRefs_js_1.createDeleteMailData)({
                            mails: mails,
                            folder: folder
                        });
                        return [4 /*yield*/, this.serviceExecutor["delete"](Services_js_1.MailService, deleteMailData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns all ids of the files that have been removed, i.e. that are contained in the existingFileIds but not in the provided files
     */
    MailFacade.prototype._getRemovedAttachments = function (providedFiles, existingFileIds) {
        var removedAttachmentIds = [];
        if (providedFiles) {
            var attachments_1 = (0, tutanota_utils_1.neverNull)(providedFiles);
            // check which attachments have been removed
            existingFileIds.forEach(function (fileId) {
                if (!attachments_1.find(function (attachment) { return attachment._type !== "DataFile" && attachment._type !== "FileReference" && (0, EntityUtils_1.isSameId)((0, EntityUtils_1.getLetId)(attachment), fileId); })) {
                    removedAttachmentIds.push(fileId);
                }
            });
        }
        return removedAttachmentIds;
    };
    /**
     * Uploads the given data files or sets the file if it is already existing files (e.g. forwarded files) and returns all DraftAttachments
     */
    MailFacade.prototype._createAddedAttachments = function (providedFiles, existingFileIds, senderMailGroupId, mailGroupKey, useBlobs) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (providedFiles == null || providedFiles.length === 0)
                    return [2 /*return*/, []];
                return [2 /*return*/, (0, tutanota_utils_1.promiseMap)(providedFiles, function (providedFile) { return __awaiter(_this, void 0, void 0, function () {
                        var fileSessionKey, referenceTokens, location_1, fileDataId, fileSessionKey, referenceTokens, fileDataId;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(0, FileUtils_1.isDataFile)(providedFile)) return [3 /*break*/, 10];
                                    fileSessionKey = (0, tutanota_crypto_1.aes128RandomKey)();
                                    if (!useBlobs) return [3 /*break*/, 7];
                                    referenceTokens = void 0;
                                    if (!((0, Env_1.isApp)() || (0, Env_1.isDesktop)())) return [3 /*break*/, 4];
                                    return [4 /*yield*/, this.fileApp.writeDataFile(providedFile)];
                                case 1:
                                    location_1 = (_a.sent()).location;
                                    return [4 /*yield*/, this.blobFacade.encryptAndUploadNative("1" /* ArchiveDataType.Attachments */, location_1, senderMailGroupId, fileSessionKey)];
                                case 2:
                                    referenceTokens = _a.sent();
                                    return [4 /*yield*/, this.fileApp.deleteFile(location_1)];
                                case 3:
                                    _a.sent();
                                    return [3 /*break*/, 6];
                                case 4: return [4 /*yield*/, this.blobFacade.encryptAndUpload("1" /* ArchiveDataType.Attachments */, providedFile.data, senderMailGroupId, fileSessionKey)];
                                case 5:
                                    referenceTokens = _a.sent();
                                    _a.label = 6;
                                case 6: return [2 /*return*/, this.createAndEncryptDraftAttachment(referenceTokens, fileSessionKey, providedFile, mailGroupKey)];
                                case 7: return [4 /*yield*/, this.fileFacade.uploadFileData(providedFile, fileSessionKey)];
                                case 8:
                                    fileDataId = _a.sent();
                                    return [2 /*return*/, this.createAndEncryptLegacyDraftAttachment(fileDataId, fileSessionKey, providedFile, mailGroupKey)];
                                case 9: return [3 /*break*/, 16];
                                case 10:
                                    if (!(0, FileUtils_1.isFileReference)(providedFile)) return [3 /*break*/, 15];
                                    fileSessionKey = (0, tutanota_crypto_1.aes128RandomKey)();
                                    if (!useBlobs) return [3 /*break*/, 12];
                                    return [4 /*yield*/, this.blobFacade.encryptAndUploadNative("1" /* ArchiveDataType.Attachments */, providedFile.location, senderMailGroupId, fileSessionKey)];
                                case 11:
                                    referenceTokens = _a.sent();
                                    return [2 /*return*/, this.createAndEncryptDraftAttachment(referenceTokens, fileSessionKey, providedFile, mailGroupKey)];
                                case 12: return [4 /*yield*/, this.fileFacade.uploadFileDataNative(providedFile, fileSessionKey)];
                                case 13:
                                    fileDataId = _a.sent();
                                    return [2 /*return*/, this.createAndEncryptLegacyDraftAttachment(fileDataId, fileSessionKey, providedFile, mailGroupKey)];
                                case 14: return [3 /*break*/, 16];
                                case 15:
                                    if (!(0, EntityUtils_1.containsId)(existingFileIds, (0, EntityUtils_1.getLetId)(providedFile))) {
                                        // forwarded attachment which was not in the draft before
                                        return [2 /*return*/, this.crypto.resolveSessionKeyForInstance(providedFile).then(function (fileSessionKey) {
                                                var attachment = (0, TypeRefs_js_1.createDraftAttachment)();
                                                attachment.existingFile = (0, EntityUtils_1.getLetId)(providedFile);
                                                attachment.ownerEncFileSessionKey = (0, tutanota_crypto_1.encryptKey)(mailGroupKey, (0, tutanota_utils_1.neverNull)(fileSessionKey));
                                                return attachment;
                                            })];
                                    }
                                    else {
                                        return [2 /*return*/, null];
                                    }
                                    _a.label = 16;
                                case 16: return [2 /*return*/];
                            }
                        });
                    }); }) // disable concurrent file upload to avoid timeout because of missing progress events on Firefox.
                        .then(function (attachments) { return attachments.filter(tutanota_utils_1.isNotNull); })
                        .then(function (it) {
                        // only delete the temporary files after all attachments have been uploaded
                        if ((0, Env_1.isApp)()) {
                            _this.fileFacade.clearFileData()["catch"](function (e) { return console.warn("Failed to clear files", e); });
                        }
                        return it;
                    })];
            });
        });
    };
    MailFacade.prototype.createAndEncryptLegacyDraftAttachment = function (fileDataId, fileSessionKey, providedFile, mailGroupKey) {
        var attachment = (0, TypeRefs_js_1.createDraftAttachment)();
        var newAttachmentData = (0, TypeRefs_js_1.createNewDraftAttachment)();
        newAttachmentData.encFileName = (0, CryptoFacade_1.encryptString)(fileSessionKey, providedFile.name);
        newAttachmentData.encMimeType = (0, CryptoFacade_1.encryptString)(fileSessionKey, providedFile.mimeType);
        newAttachmentData.fileData = fileDataId;
        newAttachmentData.referenceTokens = [];
        newAttachmentData.encCid = providedFile.cid == null ? null : (0, CryptoFacade_1.encryptString)(fileSessionKey, providedFile.cid);
        attachment.newFile = newAttachmentData;
        attachment.ownerEncFileSessionKey = (0, tutanota_crypto_1.encryptKey)(mailGroupKey, fileSessionKey);
        return attachment;
    };
    MailFacade.prototype.createAndEncryptDraftAttachment = function (referenceTokens, fileSessionKey, providedFile, mailGroupKey) {
        var attachment = (0, TypeRefs_js_1.createDraftAttachment)();
        var newAttachmentData = (0, TypeRefs_js_1.createNewDraftAttachment)();
        newAttachmentData.encFileName = (0, CryptoFacade_1.encryptString)(fileSessionKey, providedFile.name);
        newAttachmentData.encMimeType = (0, CryptoFacade_1.encryptString)(fileSessionKey, providedFile.mimeType);
        newAttachmentData.fileData = null;
        newAttachmentData.referenceTokens = referenceTokens;
        newAttachmentData.encCid = providedFile.cid == null ? null : (0, CryptoFacade_1.encryptString)(fileSessionKey, providedFile.cid);
        attachment.newFile = newAttachmentData;
        attachment.ownerEncFileSessionKey = (0, tutanota_crypto_1.encryptKey)(mailGroupKey, fileSessionKey);
        return attachment;
    };
    MailFacade.prototype.sendDraft = function (draft, recipients, language) {
        return __awaiter(this, void 0, void 0, function () {
            var senderMailGroupId, bucketKey, sendDraftData, _i, _a, fileId, file, fileSessionKey, data;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this._getMailGroupIdForMailAddress(this.userFacade.getLoggedInUser(), draft.sender.address)];
                    case 1:
                        senderMailGroupId = _b.sent();
                        bucketKey = (0, tutanota_crypto_1.aes128RandomKey)();
                        sendDraftData = (0, TypeRefs_js_1.createSendDraftData)();
                        sendDraftData.language = language;
                        sendDraftData.mail = draft._id;
                        _i = 0, _a = draft.attachments;
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        fileId = _a[_i];
                        return [4 /*yield*/, this.entityClient.load(TypeRefs_js_1.FileTypeRef, fileId)];
                    case 3:
                        file = _b.sent();
                        return [4 /*yield*/, this.crypto.resolveSessionKeyForInstance(file)];
                    case 4:
                        fileSessionKey = _b.sent();
                        data = (0, TypeRefs_js_1.createAttachmentKeyData)({
                            file: fileId
                        });
                        if (draft.confidential) {
                            data.bucketEncFileSessionKey = (0, tutanota_crypto_1.encryptKey)(bucketKey, (0, tutanota_utils_1.neverNull)(fileSessionKey));
                        }
                        else {
                            data.fileSessionKey = (0, tutanota_crypto_1.keyToUint8Array)((0, tutanota_utils_1.neverNull)(fileSessionKey));
                        }
                        sendDraftData.attachmentKeyData.push(data);
                        _b.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 2];
                    case 6: return [4 /*yield*/, Promise.all([
                            this.entityClient.loadRoot(TypeRefs_js_1.TutanotaPropertiesTypeRef, this.userFacade.getUserGroupId()).then(function (tutanotaProperties) {
                                sendDraftData.plaintext = tutanotaProperties.sendPlaintextOnly;
                            }),
                            this.crypto.resolveSessionKeyForInstance(draft).then(function (mailSessionkey) {
                                var sk = (0, tutanota_utils_1.neverNull)(mailSessionkey);
                                sendDraftData.calendarMethod = draft.method !== "0" /* MailMethod.NONE */;
                                if (draft.confidential) {
                                    sendDraftData.bucketEncMailSessionKey = (0, tutanota_crypto_1.encryptKey)(bucketKey, sk);
                                    var hasExternalSecureRecipient = recipients.some(function (r) { var _a; return r.type === "external" /* RecipientType.EXTERNAL */ && !!((_a = _this.getContactPassword(r.contact)) === null || _a === void 0 ? void 0 : _a.trim()); });
                                    if (hasExternalSecureRecipient) {
                                        sendDraftData.senderNameUnencrypted = draft.sender.name; // needed for notification mail
                                    }
                                    return _this._addRecipientKeyData(bucketKey, sendDraftData, recipients, senderMailGroupId);
                                }
                                else {
                                    sendDraftData.mailSessionKey = (0, tutanota_crypto_1.bitArrayToUint8Array)(sk);
                                }
                            }),
                        ])];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, this.serviceExecutor.post(Services_js_1.SendDraftService, sendDraftData)];
                    case 8:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MailFacade.prototype.checkMailForPhishing = function (mail, links) {
        var score = 0;
        var senderAddress = mail.sender.address;
        var senderAuthenticated = mail.authStatus === TutanotaConstants_1.MailAuthenticationStatus.AUTHENTICATED;
        if (senderAuthenticated) {
            if (this._checkFieldForPhishing(TutanotaConstants_1.ReportedMailFieldType.FROM_ADDRESS, senderAddress)) {
                score += 6;
            }
            else {
                var senderDomain = (0, tutanota_utils_1.addressDomain)(senderAddress);
                if (this._checkFieldForPhishing(TutanotaConstants_1.ReportedMailFieldType.FROM_DOMAIN, senderDomain)) {
                    score += 6;
                }
            }
        }
        else {
            if (this._checkFieldForPhishing(TutanotaConstants_1.ReportedMailFieldType.FROM_ADDRESS_NON_AUTH, senderAddress)) {
                score += 6;
            }
            else {
                var senderDomain = (0, tutanota_utils_1.addressDomain)(senderAddress);
                if (this._checkFieldForPhishing(TutanotaConstants_1.ReportedMailFieldType.FROM_DOMAIN_NON_AUTH, senderDomain)) {
                    score += 6;
                }
            }
        }
        // We check that subject exists because when there's an encryption error it will be missing
        if (mail.subject && this._checkFieldForPhishing(TutanotaConstants_1.ReportedMailFieldType.SUBJECT, mail.subject)) {
            score += 3;
        }
        for (var _i = 0, links_1 = links; _i < links_1.length; _i++) {
            var link = links_1[_i];
            if (this._checkFieldForPhishing(TutanotaConstants_1.ReportedMailFieldType.LINK, link.href)) {
                score += 6;
                break;
            }
            else {
                var domain = getUrlDomain(link.href);
                if (domain && this._checkFieldForPhishing(TutanotaConstants_1.ReportedMailFieldType.LINK_DOMAIN, domain)) {
                    score += 6;
                    break;
                }
            }
        }
        var hasSuspiciousLink = links.some(function (_a) {
            var href = _a.href, innerHTML = _a.innerHTML;
            var innerText = (0, IndexUtils_1.htmlToText)(innerHTML);
            var textUrl = parseUrl(innerText);
            var hrefUrl = parseUrl(href);
            return textUrl && hrefUrl && textUrl.hostname !== hrefUrl.hostname;
        });
        if (hasSuspiciousLink) {
            score += 6;
        }
        return Promise.resolve(7 < score);
    };
    MailFacade.prototype.deleteFolder = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var deleteMailFolderData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        deleteMailFolderData = (0, TypeRefs_js_1.createDeleteMailFolderData)({
                            folders: [id]
                        });
                        // TODO make DeleteMailFolderData unencrypted in next model version
                        return [4 /*yield*/, this.serviceExecutor["delete"](Services_js_1.MailFolderService, deleteMailFolderData, { sessionKey: "dummy" })];
                    case 1:
                        // TODO make DeleteMailFolderData unencrypted in next model version
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MailFacade.prototype.fixupCounterForMailList = function (groupId, listId, unreadMails) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = (0, TypeRefs_1.createWriteCounterData)({
                            counterType: TutanotaConstants_1.CounterType_UnreadMails,
                            row: groupId,
                            column: listId,
                            value: String(unreadMails)
                        });
                        return [4 /*yield*/, this.serviceExecutor.post(Services_1.CounterService, data)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MailFacade.prototype._checkFieldForPhishing = function (type, value) {
        var hash = phishingMarkerValue(type, value);
        return this.phishingMarkers.has(hash);
    };
    MailFacade.prototype._addRecipientKeyData = function (bucketKey, service, recipients, senderMailGroupId) {
        return __awaiter(this, void 0, void 0, function () {
            var notFoundRecipients, _i, recipients_1, recipient, password, salt, passwordKey, passwordVerifier, externalGroupKeys, data, keyData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        notFoundRecipients = [];
                        _i = 0, recipients_1 = recipients;
                        _a.label = 1;
                    case 1:
                        if (!(_i < recipients_1.length)) return [3 /*break*/, 6];
                        recipient = recipients_1[_i];
                        if (recipient.address === "system@tutanota.de" || !recipient) {
                            notFoundRecipients.push(recipient.address);
                            return [3 /*break*/, 5];
                        }
                        if (!(recipient.type === "external" /* RecipientType.EXTERNAL */)) return [3 /*break*/, 3];
                        password = this.getContactPassword(recipient.contact);
                        if (password == null || !(0, EntityUtils_1.isSameId)(this.userFacade.getGroupId(TutanotaConstants_1.GroupType.Mail), senderMailGroupId)) {
                            // no password given and prevent sending to secure externals from shared group
                            notFoundRecipients.push(recipient.address);
                            return [3 /*break*/, 5];
                        }
                        salt = (0, tutanota_crypto_1.generateRandomSalt)();
                        passwordKey = (0, tutanota_crypto_1.generateKeyFromPassphrase)(password, salt, tutanota_crypto_1.KeyLength.b128);
                        passwordVerifier = (0, tutanota_crypto_1.createAuthVerifier)(passwordKey);
                        return [4 /*yield*/, this._getExternalGroupKey(recipient.address, passwordKey, passwordVerifier)];
                    case 2:
                        externalGroupKeys = _a.sent();
                        data = (0, TypeRefs_js_1.createSecureExternalRecipientKeyData)();
                        data.mailAddress = recipient.address;
                        data.symEncBucketKey = null; // legacy for old permission system, not used any more
                        data.ownerEncBucketKey = (0, tutanota_crypto_1.encryptKey)(externalGroupKeys.externalMailGroupKey, bucketKey);
                        data.passwordVerifier = passwordVerifier;
                        data.salt = salt;
                        data.saltHash = (0, tutanota_crypto_1.sha256Hash)(salt);
                        data.pwEncCommunicationKey = (0, tutanota_crypto_1.encryptKey)(passwordKey, externalGroupKeys.externalUserGroupKey);
                        service.secureExternalRecipientKeyData.push(data);
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.crypto.encryptBucketKeyForInternalRecipient(bucketKey, recipient.address, notFoundRecipients)];
                    case 4:
                        keyData = _a.sent();
                        if (keyData) {
                            service.internalRecipientKeyData.push(keyData);
                        }
                        _a.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6:
                        if (notFoundRecipients.length > 0) {
                            throw new RecipientsNotFoundError_1.RecipientsNotFoundError(notFoundRecipients.join("\n"));
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    MailFacade.prototype.getContactPassword = function (contact) {
        var _a, _b;
        return (_b = (_a = contact === null || contact === void 0 ? void 0 : contact.presharedPassword) !== null && _a !== void 0 ? _a : contact === null || contact === void 0 ? void 0 : contact.autoTransmitPassword) !== null && _b !== void 0 ? _b : null;
    };
    /**
     * Checks that an external user instance with a mail box exists for the given recipient. If it does not exist, it is created.
     * Returns the user group key and the user mail group key of the external recipient.
     * @param recipientMailAddress
     * @param externalUserPwKey The external user's password key.
     * @param verifier The external user's verifier, base64 encoded.
     * @return Resolves to the the external user's group key and the external user's mail group key, rejected if an error occured
     */
    MailFacade.prototype._getExternalGroupKey = function (recipientMailAddress, externalUserPwKey, verifier) {
        var _this = this;
        return this.entityClient.loadRoot(TypeRefs_js_2.GroupRootTypeRef, this.userFacade.getUserGroupId()).then(function (groupRoot) {
            var cleanedMailAddress = recipientMailAddress.trim().toLocaleLowerCase();
            var mailAddressId = (0, EntityUtils_1.stringToCustomId)(cleanedMailAddress);
            return _this.entityClient
                .load(TypeRefs_js_2.ExternalUserReferenceTypeRef, [groupRoot.externalUserReferences, mailAddressId])
                .then(function (externalUserReference) {
                return _this.entityClient.load(TypeRefs_js_2.UserTypeRef, externalUserReference.user).then(function (externalUser) {
                    var mailGroupId = (0, tutanota_utils_1.neverNull)(externalUser.memberships.find(function (m) { return m.groupType === TutanotaConstants_1.GroupType.Mail; })).group;
                    return Promise.all([
                        _this.entityClient.load(TypeRefs_js_2.GroupTypeRef, mailGroupId),
                        _this.entityClient.load(TypeRefs_js_2.GroupTypeRef, externalUserReference.userGroup),
                    ]).then(function (_a) {
                        var externalMailGroup = _a[0], externalUserGroup = _a[1];
                        var externalUserGroupKey = (0, tutanota_crypto_1.decryptKey)(_this.userFacade.getUserGroupKey(), (0, tutanota_utils_1.neverNull)(externalUserGroup.adminGroupEncGKey));
                        var externalMailGroupKey = (0, tutanota_crypto_1.decryptKey)(externalUserGroupKey, (0, tutanota_utils_1.neverNull)(externalMailGroup.adminGroupEncGKey));
                        return {
                            externalUserGroupKey: externalUserGroupKey,
                            externalMailGroupKey: externalMailGroupKey
                        };
                    });
                });
            })["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotFoundError, function (e) {
                // it does not exist, so create it
                var internalMailGroupKey = _this.userFacade.getGroupKey(_this.userFacade.getGroupId(TutanotaConstants_1.GroupType.Mail));
                var externalUserGroupKey = (0, tutanota_crypto_1.aes128RandomKey)();
                var externalMailGroupKey = (0, tutanota_crypto_1.aes128RandomKey)();
                var externalUserGroupInfoSessionKey = (0, tutanota_crypto_1.aes128RandomKey)();
                var externalMailGroupInfoSessionKey = (0, tutanota_crypto_1.aes128RandomKey)();
                var clientKey = (0, tutanota_crypto_1.aes128RandomKey)();
                var tutanotaPropertiesSessionKey = (0, tutanota_crypto_1.aes128RandomKey)();
                var mailboxSessionKey = (0, tutanota_crypto_1.aes128RandomKey)();
                var userEncEntropy = (0, CryptoFacade_1.encryptBytes)(externalUserGroupKey, tutanota_crypto_1.random.generateRandomData(32));
                var d = (0, TypeRefs_js_1.createExternalUserData)();
                d.verifier = verifier;
                d.userEncClientKey = (0, tutanota_crypto_1.encryptKey)(externalUserGroupKey, clientKey);
                d.externalUserEncUserGroupInfoSessionKey = (0, tutanota_crypto_1.encryptKey)(externalUserGroupKey, externalUserGroupInfoSessionKey);
                d.internalMailEncUserGroupInfoSessionKey = (0, tutanota_crypto_1.encryptKey)(internalMailGroupKey, externalUserGroupInfoSessionKey);
                d.externalUserEncMailGroupKey = (0, tutanota_crypto_1.encryptKey)(externalUserGroupKey, externalMailGroupKey);
                d.externalMailEncMailGroupInfoSessionKey = (0, tutanota_crypto_1.encryptKey)(externalMailGroupKey, externalMailGroupInfoSessionKey);
                d.internalMailEncMailGroupInfoSessionKey = (0, tutanota_crypto_1.encryptKey)(internalMailGroupKey, externalMailGroupInfoSessionKey);
                d.externalUserEncEntropy = userEncEntropy;
                d.externalUserEncTutanotaPropertiesSessionKey = (0, tutanota_crypto_1.encryptKey)(externalUserGroupKey, tutanotaPropertiesSessionKey);
                d.externalMailEncMailBoxSessionKey = (0, tutanota_crypto_1.encryptKey)(externalMailGroupKey, mailboxSessionKey);
                var userGroupData = (0, TypeRefs_js_1.createCreateExternalUserGroupData)();
                userGroupData.mailAddress = cleanedMailAddress;
                userGroupData.externalPwEncUserGroupKey = (0, tutanota_crypto_1.encryptKey)(externalUserPwKey, externalUserGroupKey);
                userGroupData.internalUserEncUserGroupKey = (0, tutanota_crypto_1.encryptKey)(_this.userFacade.getUserGroupKey(), externalUserGroupKey);
                d.userGroupData = userGroupData;
                return _this.serviceExecutor.post(Services_js_1.ExternalUserService, d).then(function () {
                    return {
                        externalUserGroupKey: externalUserGroupKey,
                        externalMailGroupKey: externalMailGroupKey
                    };
                });
            }));
        });
    };
    MailFacade.prototype.entityEventsReceived = function (data) {
        var _this = this;
        return (0, tutanota_utils_1.promiseMap)(data, function (update) {
            if (_this.deferredDraftUpdate &&
                _this.deferredDraftId &&
                update.operation === "1" /* OperationType.UPDATE */ &&
                (0, tutanota_utils_1.isSameTypeRefByAttr)(TypeRefs_js_1.MailTypeRef, update.application, update.type) &&
                (0, EntityUtils_1.isSameId)(_this.deferredDraftId, [update.instanceListId, update.instanceId])) {
                return _this.entityClient.load(TypeRefs_js_1.MailTypeRef, (0, tutanota_utils_1.neverNull)(_this.deferredDraftId)).then(function (mail) {
                    var deferredPromiseWrapper = (0, tutanota_utils_1.neverNull)(_this.deferredDraftUpdate);
                    _this.deferredDraftUpdate = null;
                    deferredPromiseWrapper.resolve(mail);
                });
            }
        }).then(tutanota_utils_1.noOp);
    };
    MailFacade.prototype.phishingMarkersUpdateReceived = function (markers) {
        var _this = this;
        markers.forEach(function (marker) {
            if (marker.status === "1" /* PhishingMarkerStatus.INACTIVE */) {
                _this.phishingMarkers["delete"](marker.marker);
            }
            else {
                _this.phishingMarkers.add(marker.marker);
            }
        });
    };
    MailFacade.prototype.getRecipientKeyData = function (mailAddress) {
        return this.serviceExecutor
            .get(Services_js_2.PublicKeyService, (0, TypeRefs_js_2.createPublicKeyData)({
            mailAddress: mailAddress
        }))["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotFoundError, function () { return null; }));
    };
    MailFacade.prototype._getMailGroupIdForMailAddress = function (user, mailAddress) {
        var _this = this;
        return (0, tutanota_utils_1.promiseFilter)((0, GroupUtils_1.getUserGroupMemberships)(user, TutanotaConstants_1.GroupType.Mail), function (groupMembership) {
            return _this.entityClient.load(TypeRefs_js_2.GroupTypeRef, groupMembership.group).then(function (mailGroup) {
                if (mailGroup.user == null) {
                    return _this.entityClient.load(TypeRefs_js_2.GroupInfoTypeRef, groupMembership.groupInfo).then(function (mailGroupInfo) {
                        return (0, tutanota_utils_1.contains)((0, GroupUtils_1.getEnabledMailAddressesForGroupInfo)(mailGroupInfo), mailAddress);
                    });
                }
                else if ((0, EntityUtils_1.isSameId)(mailGroup.user, user._id)) {
                    return _this.entityClient.load(TypeRefs_js_2.GroupInfoTypeRef, user.userGroup.groupInfo).then(function (userGroupInfo) {
                        return (0, tutanota_utils_1.contains)((0, GroupUtils_1.getEnabledMailAddressesForGroupInfo)(userGroupInfo), mailAddress);
                    });
                }
                else {
                    // not supported
                    return false;
                }
            });
        }).then(function (filteredMemberships) {
            if (filteredMemberships.length === 1) {
                return filteredMemberships[0].group;
            }
            else {
                throw new RestError_1.NotFoundError("group for mail address not found " + mailAddress);
            }
        });
    };
    MailFacade.prototype.clearFolder = function (folderId) {
        return __awaiter(this, void 0, void 0, function () {
            var deleteMailData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        deleteMailData = (0, TypeRefs_js_1.createDeleteMailData)({
                            folder: folderId
                        });
                        return [4 /*yield*/, this.serviceExecutor["delete"](Services_js_1.MailService, deleteMailData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MailFacade.prototype.unsubscribe = function (mailId, recipient, headers) {
        return __awaiter(this, void 0, void 0, function () {
            var postData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        postData = (0, TypeRefs_js_1.createListUnsubscribeData)({
                            mail: mailId,
                            recipient: recipient,
                            headers: headers.join("\n")
                        });
                        return [4 /*yield*/, this.serviceExecutor.post(Services_js_1.ListUnsubscribeService, postData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MailFacade.prototype.usingBlobs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var user, customer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = this.userFacade.getUser();
                        if (!user || user.accountType === TutanotaConstants_1.AccountType.EXTERNAL) {
                            return [2 /*return*/, false]; // externals and contact form users can't load the customer (missing permission) so we do not enable blob storage for them yet
                        }
                        return [4 /*yield*/, this.entityClient.load(TypeRefs_js_2.CustomerTypeRef, (0, tutanota_utils_1.assertNotNull)(user.customer))];
                    case 1:
                        customer = _a.sent();
                        return [2 /*return*/, customer.customizations.some(function (f) { return f.feature === TutanotaConstants_1.FeatureType.Blobs; })];
                }
            });
        });
    };
    return MailFacade;
}());
exports.MailFacade = MailFacade;
function phishingMarkerValue(type, value) {
    return type + (0, tutanota_crypto_1.murmurHash)(value.replace(/\s/g, ""));
}
exports.phishingMarkerValue = phishingMarkerValue;
function parseUrl(link) {
    try {
        return new URL(link);
    }
    catch (e) {
        return null;
    }
}
function getUrlDomain(link) {
    var url = parseUrl(link);
    return url && url.hostname;
}
function recipientToDraftRecipient(recipient) {
    var _a;
    return (0, TypeRefs_js_1.createDraftRecipient)({
        name: (_a = recipient.name) !== null && _a !== void 0 ? _a : "",
        mailAddress: recipient.address
    });
}
function recipientToEncryptedMailAddress(recipient) {
    var _a;
    return (0, TypeRefs_js_1.createEncryptedMailAddress)({
        name: (_a = recipient.name) !== null && _a !== void 0 ? _a : "",
        address: recipient.address
    });
}
