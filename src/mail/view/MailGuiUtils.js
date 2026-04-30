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
exports.showMoveMailsDropdown = exports.getReferencedAttachments = exports.loadInlineImages = exports.revokeInlineImages = exports.cloneInlineImages = exports.createInlineImage = exports.replaceInlineImagesWithCids = exports.replaceCidsWithInlineImages = exports.getMailFolderIcon = exports.moveToInbox = exports.archiveMails = exports.moveMails = exports.promptAndDeleteMails = exports.showDeleteConfirmationDialog = void 0;
var TypeRefs_js_1 = require("../../api/entities/tutanota/TypeRefs.js");
var RestError_1 = require("../../api/common/error/RestError");
var Dialog_1 = require("../../gui/base/Dialog");
var MainLocator_1 = require("../../api/main/MainLocator");
var MailUtils_1 = require("../model/MailUtils");
var Env_1 = require("../../api/common/Env");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var TutanotaConstants_1 = require("../../api/common/TutanotaConstants");
var EntityUtils_1 = require("../../api/common/utils/EntityUtils");
var MailReportDialog_1 = require("./MailReportDialog");
var Dropdown_js_1 = require("../../gui/base/Dropdown.js");
var Modal_js_1 = require("../../gui/base/Modal.js");
function showDeleteConfirmationDialog(mails) {
    var groupedMails = mails.reduce(function (all, mail) {
        MainLocator_1.locator.mailModel.isFinalDelete(MainLocator_1.locator.mailModel.getMailFolder(mail._id[0])) ? all.trash.push(mail) : all.move.push(mail);
        return all;
    }, {
        trash: [],
        move: []
    });
    var confirmationTextId = null;
    if (groupedMails.trash.length > 0) {
        if (groupedMails.move.length > 0) {
            confirmationTextId = "finallyDeleteSelectedEmails_msg";
        }
        else {
            confirmationTextId = "finallyDeleteEmails_msg";
        }
    }
    if (confirmationTextId != null) {
        return Dialog_1.Dialog.confirm(confirmationTextId, "ok_action");
    }
    else {
        return Promise.resolve(true);
    }
}
exports.showDeleteConfirmationDialog = showDeleteConfirmationDialog;
/**
 * @return whether emails were deleted
 */
function promptAndDeleteMails(mailModel, mails, onConfirm) {
    return showDeleteConfirmationDialog(mails).then(function (confirmed) {
        if (confirmed) {
            onConfirm();
            return mailModel
                .deleteMails(mails)
                .then(function () { return true; })["catch"](function (e) {
                //LockedError should no longer be thrown!?!
                if (e instanceof RestError_1.PreconditionFailedError || e instanceof RestError_1.LockedError) {
                    return Dialog_1.Dialog.message("operationStillActive_msg").then(function () { return false; });
                }
                else {
                    throw e;
                }
            });
        }
        else {
            return Promise.resolve(false);
        }
    });
}
exports.promptAndDeleteMails = promptAndDeleteMails;
/**
 * Moves the mails and reports them as spam if the user or settings allow it.
 * @return whether mails were actually moved
 */
function moveMails(_a) {
    var mailModel = _a.mailModel, mails = _a.mails, targetMailFolder = _a.targetMailFolder, _b = _a.isReportable, isReportable = _b === void 0 ? true : _b;
    return mailModel
        .moveMails(mails, targetMailFolder)
        .then(function () {
        if (targetMailFolder.folderType === TutanotaConstants_1.MailFolderType.SPAM && isReportable) {
            var reportableMails = mails.map(function (mail) {
                // mails have just been moved
                var reportableMail = (0, TypeRefs_js_1.createMail)(mail);
                reportableMail._id = [targetMailFolder.mails, (0, EntityUtils_1.getElementId)(mail)];
                return reportableMail;
            });
            (0, MailReportDialog_1.reportMailsAutomatically)("1" /* MailReportType.SPAM */, mailModel, reportableMails);
        }
        return true;
    })["catch"](function (e) {
        //LockedError should no longer be thrown!?!
        if (e instanceof RestError_1.LockedError || e instanceof RestError_1.PreconditionFailedError) {
            return Dialog_1.Dialog.message("operationStillActive_msg").then(function () { return false; });
        }
        else {
            throw e;
        }
    });
}
exports.moveMails = moveMails;
function archiveMails(mails) {
    if (mails.length > 0) {
        // assume all mails in the array belong to the same Mailbox
        return MainLocator_1.locator.mailModel.getMailboxFolders(mails[0]).then(function (folders) { return moveMails({
            mailModel: MainLocator_1.locator.mailModel,
            mails: mails,
            targetMailFolder: (0, MailUtils_1.getArchiveFolder)(folders)
        }); });
    }
    else {
        return Promise.resolve();
    }
}
exports.archiveMails = archiveMails;
function moveToInbox(mails) {
    if (mails.length > 0) {
        // assume all mails in the array belong to the same Mailbox
        return MainLocator_1.locator.mailModel.getMailboxFolders(mails[0]).then(function (folders) { return moveMails({
            mailModel: MainLocator_1.locator.mailModel,
            mails: mails,
            targetMailFolder: (0, MailUtils_1.getInboxFolder)(folders)
        }); });
    }
    else {
        return Promise.resolve();
    }
}
exports.moveToInbox = moveToInbox;
function getMailFolderIcon(mail) {
    var folder = MainLocator_1.locator.mailModel.getMailFolder(mail._id[0]);
    if (folder) {
        return (0, MailUtils_1.getFolderIcon)(folder)();
    }
    else {
        return "Folder" /* Icons.Folder */;
    }
}
exports.getMailFolderIcon = getMailFolderIcon;
function replaceCidsWithInlineImages(dom, inlineImages, onContext) {
    // all image tags which have cid attribute. The cid attribute has been set by the sanitizer for adding a default image.
    var imageElements = Array.from(dom.querySelectorAll("img[cid]"));
    if (dom.shadowRoot) {
        var shadowImageElements = Array.from(dom.shadowRoot.querySelectorAll("img[cid]"));
        imageElements.push.apply(imageElements, shadowImageElements);
    }
    var elementsWithCid = [];
    imageElements.forEach(function (imageElement) {
        var cid = imageElement.getAttribute("cid");
        if (cid) {
            var inlineImage_1 = inlineImages.get(cid);
            if (inlineImage_1) {
                elementsWithCid.push(imageElement);
                imageElement.setAttribute("src", inlineImage_1.objectUrl);
                imageElement.classList.remove("tutanota-placeholder");
                if ((0, Env_1.isApp)()) {
                    // Add long press action for apps
                    var timeoutId_1;
                    var startCoords_1;
                    imageElement.addEventListener("touchstart", function (e) {
                        var touch = e.touches[0];
                        if (!touch)
                            return;
                        startCoords_1 = {
                            x: touch.clientX,
                            y: touch.clientY
                        };
                        timeoutId_1 = setTimeout(function () {
                            onContext(inlineImage_1.cid, e, imageElement);
                        }, 800);
                    });
                    imageElement.addEventListener("touchmove", function (e) {
                        var touch = e.touches[0];
                        if (!touch || !startCoords_1 || !timeoutId_1)
                            return;
                        if (Math.abs(touch.clientX - startCoords_1.x) > 40 || Math.abs(touch.clientY - startCoords_1.y) > 40) {
                            clearTimeout(timeoutId_1);
                        }
                    });
                    imageElement.addEventListener("touchend", function () {
                        timeoutId_1 && clearTimeout(timeoutId_1);
                    });
                }
                if ((0, Env_1.isDesktop)()) {
                    // add right click action for desktop apps
                    imageElement.addEventListener("contextmenu", function (e) {
                        onContext(inlineImage_1.cid, e, imageElement);
                        e.preventDefault();
                    });
                }
            }
        }
    });
    return elementsWithCid;
}
exports.replaceCidsWithInlineImages = replaceCidsWithInlineImages;
function replaceInlineImagesWithCids(dom) {
    var domClone = dom.cloneNode(true);
    var inlineImages = Array.from(domClone.querySelectorAll("img[cid]"));
    inlineImages.forEach(function (inlineImage) {
        var cid = inlineImage.getAttribute("cid");
        inlineImage.setAttribute("src", "cid:" + (cid || ""));
        inlineImage.removeAttribute("cid");
    });
    return domClone;
}
exports.replaceInlineImagesWithCids = replaceInlineImagesWithCids;
function createInlineImage(file) {
    var cid = Math.random().toString(30).substring(2);
    file.cid = cid;
    return createInlineImageReference(file, cid);
}
exports.createInlineImage = createInlineImage;
function createInlineImageReference(file, cid) {
    var blob = new Blob([file.data], {
        type: file.mimeType
    });
    var objectUrl = URL.createObjectURL(blob);
    return {
        cid: cid,
        objectUrl: objectUrl,
        blob: blob
    };
}
function cloneInlineImages(inlineImages) {
    var newMap = new Map();
    inlineImages.forEach(function (v, k) {
        var blob = new Blob([v.blob]);
        var objectUrl = URL.createObjectURL(blob);
        newMap.set(k, {
            cid: v.cid,
            objectUrl: objectUrl,
            blob: blob
        });
    });
    return newMap;
}
exports.cloneInlineImages = cloneInlineImages;
function revokeInlineImages(inlineImages) {
    inlineImages.forEach(function (v, k) {
        URL.revokeObjectURL(v.objectUrl);
    });
}
exports.revokeInlineImages = revokeInlineImages;
function loadInlineImages(fileController, attachments, referencedCids) {
    return __awaiter(this, void 0, void 0, function () {
        var filesToLoad, inlineImages;
        var _this = this;
        return __generator(this, function (_a) {
            filesToLoad = getReferencedAttachments(attachments, referencedCids);
            inlineImages = new Map();
            return [2 /*return*/, (0, tutanota_utils_1.promiseMap)(filesToLoad, function (file) { return __awaiter(_this, void 0, void 0, function () {
                    var dataFile, htmlSanitizer, inlineImageReference;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, fileController.downloadAndDecrypt(file)];
                            case 1:
                                dataFile = _a.sent();
                                return [4 /*yield*/, Promise.resolve().then(function () { return require("../../misc/HtmlSanitizer"); })];
                            case 2:
                                htmlSanitizer = (_a.sent()).htmlSanitizer;
                                dataFile = htmlSanitizer.sanitizeInlineAttachment(dataFile);
                                inlineImageReference = createInlineImageReference(dataFile, (0, tutanota_utils_1.neverNull)(file.cid));
                                inlineImages.set(inlineImageReference.cid, inlineImageReference);
                                return [2 /*return*/];
                        }
                    });
                }); }).then(function () { return inlineImages; })];
        });
    });
}
exports.loadInlineImages = loadInlineImages;
function getReferencedAttachments(attachments, referencedCids) {
    return attachments.filter(function (file) { return referencedCids.find(function (rcid) { return file.cid === rcid; }); });
}
exports.getReferencedAttachments = getReferencedAttachments;
function showMoveMailsDropdown(model, origin, mails, width, withBackground) {
    if (width === void 0) { width = 300; }
    if (withBackground === void 0) { withBackground = false; }
    if ((0, MailUtils_1.emptyOrContainsDraftsAndNonDrafts)(mails)) { // do not move mails if no mails or mails cannot be moved together
        return;
    }
    (0, MailUtils_1.getMoveTargetFolders)(MainLocator_1.locator.mailModel, mails).then(function (folders) {
        var dropdown = new Dropdown_js_1.Dropdown(function () {
            return folders.map(function (f) { return ({
                label: function () { return (0, MailUtils_1.getFolderName)(f); },
                click: function () { return moveMails({ mailModel: MainLocator_1.locator.mailModel, mails: mails, targetMailFolder: f }); },
                icon: (0, MailUtils_1.getFolderIcon)(f)(),
                size: 1 /* ButtonSize.Compact */
            }); });
        }, width);
        dropdown.setOrigin(new Dropdown_js_1.DomRectReadOnlyPolyfilled(origin.left, origin.top, origin.width, 0));
        Modal_js_1.modal.displayUnique(dropdown, withBackground);
    });
}
exports.showMoveMailsDropdown = showMoveMailsDropdown;
