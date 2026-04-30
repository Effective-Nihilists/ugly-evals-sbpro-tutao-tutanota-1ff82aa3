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
exports.showPasswordGeneratorDialog = void 0;
var mithril_1 = require("mithril");
var Dialog_1 = require("../../gui/base/Dialog");
var PasswordGenerator_1 = require("./PasswordGenerator");
var Button_js_1 = require("../../gui/base/Button.js");
var MainLocator_1 = require("../../api/main/MainLocator");
var size_1 = require("../../gui/size");
var ClipboardUtils_1 = require("../ClipboardUtils");
var LanguageViewModel_js_1 = require("../LanguageViewModel.js");
var dictionary = null;
/**
 * Show a dialog to generate a random passphrase
 * @returns a promise containing the generated password
 */
function showPasswordGeneratorDialog() {
    return __awaiter(this, void 0, void 0, function () {
        var appState, baseUrl, password, pwGenerator;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(dictionary == null)) return [3 /*break*/, 2];
                    appState = window.tutao.appState;
                    baseUrl = location.protocol + "//" + location.hostname + (location.port ? (":" + location.port) : "") + appState.prefixWithoutFile;
                    return [4 /*yield*/, fetch(baseUrl + "/wordlibrary.json").then(function (response) { return response.json(); })];
                case 1:
                    dictionary = _a.sent();
                    _a.label = 2;
                case 2:
                    password = "";
                    pwGenerator = new PasswordGenerator_1.PasswordGenerator(MainLocator_1.locator.random, dictionary);
                    return [2 /*return*/, new Promise(function (resolve) {
                            var insertPasswordOkAction = function () {
                                resolve(password);
                                dialog.close();
                            };
                            var updateAction = function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, pwGenerator.generateRandomPassphrase()];
                                        case 1:
                                            password = _a.sent();
                                            mithril_1["default"].redraw();
                                            return [2 /*return*/];
                                    }
                                });
                            }); };
                            updateAction();
                            var dialog = Dialog_1.Dialog.showActionDialog({
                                title: function () { return "Passphrase"; },
                                child: {
                                    view: function () { return (0, mithril_1["default"])(PasswordGeneratorDialog, {
                                        okAction: insertPasswordOkAction,
                                        updateAction: updateAction,
                                        password: password
                                    }); }
                                },
                                okAction: null
                            });
                        })];
            }
        });
    });
}
exports.showPasswordGeneratorDialog = showPasswordGeneratorDialog;
var PasswordGeneratorDialog = /** @class */ (function () {
    function PasswordGeneratorDialog() {
    }
    PasswordGeneratorDialog.prototype.view = function (vnode) {
        var _a = vnode.attrs, updateAction = _a.updateAction, okAction = _a.okAction, password = _a.password;
        return (0, mithril_1["default"])("", [
            (0, mithril_1["default"])(".editor-border.mt.flex.center-horizontally.center-vertically", {
                style: {
                    minHeight: (0, size_1.px)(65) // needs 65px for displaying two rows
                }
            }, (0, mithril_1["default"])(".center.b.monospace", password)),
            (0, mithril_1["default"])(".small.mt-xs", [
                LanguageViewModel_js_1.lang.get("passphraseGeneratorHelp_msg"),
                " ",
                (0, mithril_1["default"])("a", {
                    href: "https://tutanota.com/faq#passphrase-generator",
                    target: "_blank",
                    rel: "nooopener noreferer"
                }, LanguageViewModel_js_1.lang.get("faqEntry_label"))
            ]),
            (0, mithril_1["default"])(".flex-end", [
                (0, mithril_1["default"])(Button_js_1.Button, {
                    label: "regeneratePassword_action",
                    click: function () { return updateAction(); },
                    type: "secondary" /* ButtonType.Secondary */
                }),
                (0, mithril_1["default"])(Button_js_1.Button, {
                    click: function () { return (0, ClipboardUtils_1.copyToClipboard)(password); },
                    label: "copy_action",
                    type: "secondary" /* ButtonType.Secondary */
                }),
            ]),
            (0, mithril_1["default"])(".flex", (0, mithril_1["default"])(Button_js_1.Button, {
                label: "apply_action",
                click: function () { return okAction(); },
                type: "login" /* ButtonType.Login */
            })),
        ]);
    };
    return PasswordGeneratorDialog;
}());
