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
exports.WebCommonNativeFacade = void 0;
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var CancelledError_js_1 = require("../../api/common/error/CancelledError.js");
var WebCommonNativeFacade = /** @class */ (function () {
    function WebCommonNativeFacade() {
    }
    /**
     * create a mail editor as requested from the native side, ie because a
     * mailto-link was clicked or the "Send as mail" option
     * in LibreOffice/Windows Explorer was used.
     *
     * if a mailtoUrl is given:
     *  * the other arguments will be ignored.
     *  * confidential will be set to false
     *
     */
    WebCommonNativeFacade.prototype.createMailEditor = function (filesUris, text, addresses, subject, mailToUrlString) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, fileApp, mailModel, _b, newMailEditorFromTemplate, newMailtoUrlMailEditor, logins, signatureModule, mailboxDetails, editor, files, address, recipients;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, WebCommonNativeFacade.getInitializedLocator()];
                    case 1:
                        _a = _c.sent(), fileApp = _a.fileApp, mailModel = _a.mailModel;
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("../../mail/editor/MailEditor.js"); })];
                    case 2:
                        _b = _c.sent(), newMailEditorFromTemplate = _b.newMailEditorFromTemplate, newMailtoUrlMailEditor = _b.newMailtoUrlMailEditor;
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("../../api/main/LoginController.js"); })];
                    case 3:
                        logins = (_c.sent()).logins;
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("../../mail/signature/Signature"); })];
                    case 4:
                        signatureModule = _c.sent();
                        return [4 /*yield*/, logins.waitForPartialLogin()];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, mailModel.getUserMailboxDetails()];
                    case 6:
                        mailboxDetails = _c.sent();
                        if (!mailToUrlString) return [3 /*break*/, 8];
                        return [4 /*yield*/, newMailtoUrlMailEditor(mailToUrlString, false, mailboxDetails)["catch"]((0, tutanota_utils_1.ofClass)(CancelledError_js_1.CancelledError, tutanota_utils_1.noOp))];
                    case 7:
                        editor = _c.sent();
                        if (!editor)
                            return [2 /*return*/];
                        return [3 /*break*/, 11];
                    case 8: return [4 /*yield*/, fileApp.getFilesMetaData(filesUris)];
                    case 9:
                        files = _c.sent();
                        address = (addresses && addresses[0]) || "";
                        recipients = address
                            ? {
                                to: [
                                    {
                                        name: "",
                                        address: address
                                    },
                                ]
                            }
                            : {};
                        return [4 /*yield*/, newMailEditorFromTemplate(mailboxDetails, recipients, subject || (files.length > 0 ? files[0].name : ""), signatureModule.appendEmailSignature(text || "", logins.getUserController().props), files, undefined, undefined, true // we want emails created in this method to always default to saving changes
                            )];
                    case 10:
                        editor = _c.sent();
                        _c.label = 11;
                    case 11:
                        editor.show();
                        return [2 /*return*/];
                }
            });
        });
    };
    WebCommonNativeFacade.prototype.invalidateAlarms = function () {
        return __awaiter(this, void 0, void 0, function () {
            var locator;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, WebCommonNativeFacade.getInitializedLocator()];
                    case 1:
                        locator = _a.sent();
                        return [4 /*yield*/, locator.pushService.invalidateAlarms()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    WebCommonNativeFacade.prototype.openCalendar = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var openCalendar;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./OpenMailboxHandler.js"); })];
                    case 1:
                        openCalendar = (_a.sent()).openCalendar;
                        return [2 /*return*/, openCalendar(userId)];
                }
            });
        });
    };
    WebCommonNativeFacade.prototype.openMailBox = function (userId, address, requestedPath) {
        return __awaiter(this, void 0, void 0, function () {
            var openMailbox;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./OpenMailboxHandler.js"); })];
                    case 1:
                        openMailbox = (_a.sent()).openMailbox;
                        return [2 /*return*/, openMailbox(userId, address, requestedPath)];
                }
            });
        });
    };
    WebCommonNativeFacade.prototype.showAlertDialog = function (translationKey) {
        return __awaiter(this, void 0, void 0, function () {
            var Dialog;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../../gui/base/Dialog.js"); })];
                    case 1:
                        Dialog = (_a.sent()).Dialog;
                        return [2 /*return*/, Dialog.message(translationKey)];
                }
            });
        });
    };
    WebCommonNativeFacade.getInitializedLocator = function () {
        return __awaiter(this, void 0, void 0, function () {
            var locator;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../../api/main/MainLocator"); })];
                    case 1:
                        locator = (_a.sent()).locator;
                        return [4 /*yield*/, locator.initialized];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, locator];
                }
            });
        });
    };
    return WebCommonNativeFacade;
}());
exports.WebCommonNativeFacade = WebCommonNativeFacade;
