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
exports.getConfidentialStateMessage = exports.cleanupInlineAttachments = exports.createAttachmentButtonAttrs = exports.showFileChooserForAttachments = exports.chooseAndAttachFile = void 0;
var mithril_1 = require("mithril");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Env_1 = require("../../api/common/Env");
var PermissionError_1 = require("../../api/common/error/PermissionError");
var Dialog_1 = require("../../gui/base/Dialog");
var FileNotFoundError_1 = require("../../api/common/error/FileNotFoundError");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var FileOpenError_1 = require("../../api/common/error/FileOpenError");
var Dropdown_js_1 = require("../../gui/base/Dropdown.js");
var Formatter_1 = require("../../misc/Formatter");
var UserError_1 = require("../../api/main/UserError");
var ErrorHandlerImpl_1 = require("../../misc/ErrorHandlerImpl");
var MainLocator_1 = require("../../api/main/MainLocator");
var FileUtils_1 = require("../../api/common/utils/FileUtils");
var FileController_js_1 = require("../../file/FileController.js");
var ProgrammingError_js_1 = require("../../api/common/error/ProgrammingError.js");
function chooseAndAttachFile(model, boundingRect, fileTypes) {
    var _this = this;
    boundingRect.height = Math.round(boundingRect.height);
    boundingRect.width = Math.round(boundingRect.width);
    boundingRect.x = Math.round(boundingRect.x);
    boundingRect.y = Math.round(boundingRect.y);
    return showFileChooserForAttachments(boundingRect, fileTypes)
        .then(function (files) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (files) {
                model.attachFiles(files);
            }
            return [2 /*return*/, files];
        });
    }); })["catch"]((0, tutanota_utils_1.ofClass)(UserError_1.UserError, ErrorHandlerImpl_1.showUserError));
}
exports.chooseAndAttachFile = chooseAndAttachFile;
function showFileChooserForAttachments(boundingRect, fileTypes) {
    var fileSelector = env.mode === Env_1.Mode.App ? MainLocator_1.locator.fileApp.openFileChooser(boundingRect) : (0, FileController_js_1.showFileChooser)(true, fileTypes);
    return fileSelector["catch"]((0, tutanota_utils_1.ofClass)(PermissionError_1.PermissionError, function () {
        Dialog_1.Dialog.message("fileAccessDeniedMobile_msg");
    }))["catch"]((0, tutanota_utils_1.ofClass)(FileNotFoundError_1.FileNotFoundError, function () {
        Dialog_1.Dialog.message("couldNotAttachFile_msg");
    }));
}
exports.showFileChooserForAttachments = showFileChooserForAttachments;
function createAttachmentButtonAttrs(model, inlineImageElements) {
    return model.getAttachments().map(function (file) {
        var lazyButtonAttrs = [
            {
                label: "download_action",
                click: function () { return _downloadAttachment(file); }
            },
            {
                label: "remove_action",
                click: function () {
                    model.removeAttachment(file);
                    // If an attachment has a cid it means it could be in the editor's inline images too
                    if (file.cid) {
                        var imageElement = inlineImageElements.find(function (e) { return e.getAttribute("cid") === file.cid; });
                        if (imageElement) {
                            imageElement.remove();
                            (0, tutanota_utils_1.remove)(inlineImageElements, imageElement);
                        }
                    }
                    mithril_1["default"].redraw();
                }
            },
        ];
        return {
            label: function () { return file.name; },
            icon: function () { return "Attachment" /* Icons.Attachment */; },
            type: "bubble" /* ButtonType.Bubble */,
            staticRightText: "(" + (0, Formatter_1.formatStorageSize)(Number(file.size)) + ")",
            colors: "elevated" /* ButtonColor.Elevated */,
            click: (0, Dropdown_js_1.createDropdown)({
                lazyButtons: function () { return lazyButtonAttrs; }
            })
        };
    });
}
exports.createAttachmentButtonAttrs = createAttachmentButtonAttrs;
function _downloadAttachment(attachment) {
    return __awaiter(this, void 0, void 0, function () {
        var e_1, msg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, , 9]);
                    if (!(0, FileUtils_1.isFileReference)(attachment)) return [3 /*break*/, 2];
                    return [4 /*yield*/, MainLocator_1.locator.fileApp.open(attachment)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 2:
                    if (!(0, FileUtils_1.isDataFile)(attachment)) return [3 /*break*/, 4];
                    return [4 /*yield*/, MainLocator_1.locator.fileController.saveDataFile(attachment)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 4:
                    if (!(0, FileUtils_1.isTutanotaFile)(attachment)) return [3 /*break*/, 6];
                    return [4 /*yield*/, MainLocator_1.locator.fileController.download(attachment)];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6: throw new ProgrammingError_js_1.ProgrammingError("attachment is neither reference, datafile nor tutanotafile!");
                case 7: return [3 /*break*/, 9];
                case 8:
                    e_1 = _a.sent();
                    if (e_1 instanceof FileOpenError_1.FileOpenError) {
                        return [2 /*return*/, Dialog_1.Dialog.message("canNotOpenFileOnDevice_msg")];
                    }
                    else {
                        msg = e_1.message || "unknown error";
                        console.error("could not open file:", msg);
                        return [2 /*return*/, Dialog_1.Dialog.message("errorDuringFileOpen_msg")];
                    }
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
exports.cleanupInlineAttachments = (0, tutanota_utils_1.debounce)(50, function (domElement, inlineImageElements, attachments) {
    // Previously we replied on subtree option of MutationObserver to receive info when nested child is removed.
    // It works but it doesn't work if the parent of the nested child is removed, we would have to go over each mutation
    // and check each descendant and if it's an image with CID or not.
    // It's easier and faster to just go over each inline image that we know about. It's more bookkeeping but it's easier
    // code which touches less dome.
    //
    // Alternative would be observe the parent of each inline image but that's more complexity and we need to take care of
    // new (just inserted) inline images and also assign listener there.
    // Doing this check instead of relying on mutations also helps with the case when node is removed but inserted again
    // briefly, e.g. if some text is inserted before/after the element, Squire would put it into another diff and this
    // means removal + insertion.
    var elementsToRemove = [];
    inlineImageElements.forEach(function (inlineImage) {
        if (domElement && !domElement.contains(inlineImage)) {
            var cid_1 = inlineImage.getAttribute("cid");
            var attachmentIndex = attachments.findIndex(function (a) { return a.cid === cid_1; });
            if (attachmentIndex !== -1) {
                attachments.splice(attachmentIndex, 1);
                elementsToRemove.push(inlineImage);
                mithril_1["default"].redraw();
            }
        }
    });
    (0, tutanota_utils_1.findAllAndRemove)(inlineImageElements, function (imageElement) { return elementsToRemove.includes(imageElement); });
});
function getConfidentialStateMessage(isConfidential) {
    return isConfidential ? LanguageViewModel_1.lang.get("confidentialStatus_msg") : LanguageViewModel_1.lang.get("nonConfidentialStatus_msg");
}
exports.getConfidentialStateMessage = getConfidentialStateMessage;
