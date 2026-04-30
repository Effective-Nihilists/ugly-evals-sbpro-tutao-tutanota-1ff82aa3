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
exports.WebMobileFacade = void 0;
var mithril_1 = require("mithril");
var Env_1 = require("../../api/common/Env");
var Header_js_1 = require("../../gui/Header.js");
var Modal_1 = require("../../gui/base/Modal");
var RouteChange_1 = require("../../misc/RouteChange");
var MainLocator_1 = require("../../api/main/MainLocator");
var MailUtils_1 = require("../../mail/model/MailUtils");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var TutanotaConstants_js_1 = require("../../api/common/TutanotaConstants.js");
(0, Env_1.assertMainOrNode)();
/**
 * Handles press of the android back button. Returns true if the action has been processed by the application.
 * False if the caller must handle the button press (quit the application)
 */
var WebMobileFacade = /** @class */ (function () {
    function WebMobileFacade() {
    }
    WebMobileFacade.prototype.handleBackPress = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Promise.resolve().then(function () {
                        var lastModalComponent = (0, tutanota_utils_1.last)(Modal_1.modal.components);
                        if (lastModalComponent) {
                            // first check if any modal dialog is visible
                            lastModalComponent.component.onClose();
                            return true;
                        }
                        else {
                            // otherwise try to navigate back in the current view
                            var viewSlider = Header_js_1.header.getViewSlider();
                            var currentRoute = mithril_1["default"].route.get();
                            // If the sidebar is opened, close it
                            if (viewSlider && viewSlider.isForegroundColumnFocused()) {
                                viewSlider.focusNextColumn();
                                return true;
                            }
                            else if (window.tutao.currentView && window.tutao.currentView.handleBackButton && window.tutao.currentView.handleBackButton()) {
                                return true;
                            }
                            else if (currentRoute.startsWith(RouteChange_1.CONTACTS_PREFIX) ||
                                currentRoute.startsWith(RouteChange_1.SETTINGS_PREFIX) ||
                                currentRoute.startsWith(RouteChange_1.SEARCH_PREFIX) ||
                                currentRoute.startsWith(RouteChange_1.CALENDAR_PREFIX)) {
                                // go back to mail from other paths
                                mithril_1["default"].route.set(RouteChange_1.navButtonRoutes.mailUrl);
                                return true;
                            }
                            else if (viewSlider && viewSlider.isFirstBackgroundColumnFocused()) {
                                // If the first background column is focused in mail view (showing a folder), move to inbox.
                                // If in inbox already, quit
                                if (mithril_1["default"].route.get().startsWith(RouteChange_1.MAIL_PREFIX)) {
                                    var parts = mithril_1["default"].route
                                        .get()
                                        .split("/")
                                        .filter(function (part) { return part !== ""; });
                                    if (parts.length > 1) {
                                        var selectedMailListId_1 = parts[1];
                                        return MainLocator_1.locator.mailModel.getMailboxDetails().then(function (mailboxDetails) {
                                            var inboxMailListId = (0, MailUtils_1.getInboxFolder)(mailboxDetails[0].folders).mails;
                                            if (inboxMailListId !== selectedMailListId_1) {
                                                mithril_1["default"].route.set(RouteChange_1.MAIL_PREFIX + "/" + inboxMailListId);
                                                return true;
                                            }
                                            else {
                                                return false;
                                            }
                                        });
                                    }
                                }
                                return false;
                            }
                            else if (viewSlider && viewSlider.isFocusPreviousPossible()) {
                                // current view can navigate back
                                viewSlider.focusPreviousColumn();
                                return true;
                            }
                            else {
                                return false;
                            }
                        }
                    })];
            });
        });
    };
    WebMobileFacade.prototype.visibilityChange = function (visibility) {
        return __awaiter(this, void 0, void 0, function () {
            var locator;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("native visibility change", visibility);
                        return [4 /*yield*/, WebMobileFacade.getInitializedLocator()];
                    case 1:
                        locator = _a.sent();
                        if (visibility) {
                            if (this.disconnectTimeoutId != null) {
                                clearTimeout(this.disconnectTimeoutId);
                                this.disconnectTimeoutId = null;
                            }
                            return [2 /*return*/, locator.worker.tryReconnectEventBus(false, true)];
                        }
                        else {
                            this.disconnectTimeoutId = setTimeout(function () {
                                locator.worker.closeEventBus("pause" /* CloseEventBusOption.Pause */);
                            }, 30 * TutanotaConstants_js_1.SECOND_MS);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    WebMobileFacade.prototype.keyboardSizeChanged = function (newSize) {
        return __awaiter(this, void 0, void 0, function () {
            var windowFacade;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../../misc/WindowFacade.js"); })];
                    case 1:
                        windowFacade = (_a.sent()).windowFacade;
                        return [2 /*return*/, windowFacade.onKeyboardSizeChanged(newSize)];
                }
            });
        });
    };
    WebMobileFacade.getInitializedLocator = function () {
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
    return WebMobileFacade;
}());
exports.WebMobileFacade = WebMobileFacade;
