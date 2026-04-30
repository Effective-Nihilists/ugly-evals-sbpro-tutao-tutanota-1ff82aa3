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
exports.WebDesktopFacade = void 0;
var SpellcheckLanguageDialog_1 = require("../../gui/dialogs/SpellcheckLanguageDialog");
var TutanotaConstants_js_1 = require("../../api/common/TutanotaConstants.js");
var WebDesktopFacade = /** @class */ (function () {
    function WebDesktopFacade() {
    }
    WebDesktopFacade.prototype.print = function () {
        window.print();
        return Promise.resolve();
    };
    WebDesktopFacade.prototype.showSpellcheckDropdown = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, SpellcheckLanguageDialog_1.showSpellcheckLanguageDialog)()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    WebDesktopFacade.prototype.applySearchResultToOverlay = function (result) {
        return __awaiter(this, void 0, void 0, function () {
            var searchInPageOverlay;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../../gui/SearchInPageOverlay.js"); })];
                    case 1:
                        searchInPageOverlay = (_a.sent()).searchInPageOverlay;
                        searchInPageOverlay.applyNextResult(result);
                        return [2 /*return*/, Promise.resolve()];
                }
            });
        });
    };
    WebDesktopFacade.prototype.openFindInPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var searchInPageOverlay;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../../gui/SearchInPageOverlay.js"); })];
                    case 1:
                        searchInPageOverlay = (_a.sent()).searchInPageOverlay;
                        searchInPageOverlay.open();
                        return [2 /*return*/, Promise.resolve()];
                }
            });
        });
    };
    WebDesktopFacade.prototype.reportError = function (errorInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var promptForFeedbackAndSend, logins;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../../misc/ErrorReporter.js"); })];
                    case 1:
                        promptForFeedbackAndSend = (_a.sent()).promptForFeedbackAndSend;
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("../../api/main/LoginController.js"); })];
                    case 2:
                        logins = (_a.sent()).logins;
                        return [4 /*yield*/, logins.waitForPartialLogin()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, promptForFeedbackAndSend(errorInfo)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Updates the link-reveal on hover when the main thread detects that
     * the hovered url changed. Will _not_ update if hovering a in link app (starts with 2nd argument)
     */
    WebDesktopFacade.prototype.updateTargetUrl = function (url, appPath) {
        return __awaiter(this, void 0, void 0, function () {
            var linkToolTip;
            return __generator(this, function (_a) {
                linkToolTip = document.getElementById("link-tt");
                if (!linkToolTip) {
                    linkToolTip = document.createElement("DIV");
                    linkToolTip.id = "link-tt";
                    document.body.appendChild(linkToolTip);
                }
                if (url === "" || url.startsWith(appPath)) {
                    linkToolTip.className = "";
                }
                else {
                    linkToolTip.innerText = url;
                    linkToolTip.className = "reveal";
                }
                return [2 /*return*/, Promise.resolve()];
            });
        });
    };
    /**
     * this is only used in the admin client to sync the DB view with the inbox
     */
    WebDesktopFacade.prototype.openCustomer = function (mailAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var m;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("mithril"); })];
                    case 1:
                        m = _a.sent();
                        if (typeof mailAddress === "string" && m.route.get().startsWith("/customer")) {
                            m.route.set("/customer?query=".concat(encodeURIComponent(mailAddress)));
                            console.log("switching to customer", mailAddress);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    WebDesktopFacade.prototype.addShortcuts = function (shortcuts) {
        return __awaiter(this, void 0, void 0, function () {
            var baseShortcut, fixedShortcuts, keyManager;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        baseShortcut = {
                            exec: function () { return true; },
                            ctrl: false,
                            alt: false,
                            meta: false,
                            help: "emptyString_msg",
                            key: TutanotaConstants_js_1.Keys.F
                        };
                        fixedShortcuts = shortcuts.map(function (nsc) { return Object.assign({}, baseShortcut, nsc); });
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("../../misc/KeyManager.js"); })];
                    case 1:
                        keyManager = (_a.sent()).keyManager;
                        keyManager.registerDesktopShortcuts(fixedShortcuts);
                        return [2 /*return*/];
                }
            });
        });
    };
    WebDesktopFacade.prototype.appUpdateDownloaded = function () {
        return __awaiter(this, void 0, void 0, function () {
            var locator;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, WebDesktopFacade.getInitializedLocator()];
                    case 1:
                        locator = _a.sent();
                        locator.native.handleUpdateDownload();
                        return [2 /*return*/];
                }
            });
        });
    };
    WebDesktopFacade.getInitializedLocator = function () {
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
    return WebDesktopFacade;
}());
exports.WebDesktopFacade = WebDesktopFacade;
