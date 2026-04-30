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
exports.windowFacade = exports.WindowFacade = void 0;
var mithril_1 = require("mithril");
var Env_1 = require("../api/common/Env");
var LanguageViewModel_1 = require("./LanguageViewModel");
var ClientDetector_1 = require("./ClientDetector");
var LoginController_1 = require("../api/main/LoginController");
(0, Env_1.assertMainOrNodeBoot)();
var WindowFacade = /** @class */ (function () {
    function WindowFacade() {
        var _this = this;
        this._historyStateEventListeners = [];
        this._worker = null;
        this._indexerFacade = null;
        // following two properties are for the iOS
        this._keyboardSize = 0;
        this._keyboardSizeListeners = [];
        this._ignoreNextPopstate = false;
        this._windowSizeListeners = [];
        this.resizeTimeout = null;
        this.windowCloseConfirmation = false;
        this._windowCloseListeners = new Set();
        // load async to reduce size of boot bundle
        Promise.resolve().then(function () { return require("../api/main/MainLocator"); }).then(function (_a) {
            var locator = _a.locator;
            return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: 
                        // We need to wait til the locator has finished initializing before we read from it
                        // because it is happening concurrently
                        return [4 /*yield*/, locator.initialized];
                        case 1:
                            // We need to wait til the locator has finished initializing before we read from it
                            // because it is happening concurrently
                            _b.sent();
                            this._worker = locator.worker;
                            this._indexerFacade = locator.indexerFacade;
                            if (env.mode === Env_1.Mode.App || env.mode === Env_1.Mode.Desktop || env.mode === Env_1.Mode.Admin) {
                                this.addPageInBackgroundListener();
                            }
                            return [2 /*return*/];
                    }
                });
            });
        });
    }
    /**
     * Add a window resize listener with a listenerId
     * @param listener Provides the new width and height of the window if the values change.
     */
    WindowFacade.prototype.addResizeListener = function (listener) {
        this._windowSizeListeners.push(listener);
    };
    WindowFacade.prototype.removeResizeListener = function (listener) {
        var index = this._windowSizeListeners.indexOf(listener);
        if (index > -1) {
            this._windowSizeListeners.splice(index, 1);
        }
    };
    WindowFacade.prototype.addWindowCloseListener = function (listener) {
        var _this = this;
        this._windowCloseListeners.add(listener);
        this._checkWindowClosing(this._windowCloseListeners.size > 0);
        return function () {
            _this._windowCloseListeners["delete"](listener);
            _this._checkWindowClosing(_this._windowCloseListeners.size > 0);
        };
    };
    WindowFacade.prototype._notifyCloseListeners = function (e) {
        this._windowCloseListeners.forEach(function (f) { return f(e); });
    };
    WindowFacade.prototype.addKeyboardSizeListener = function (listener) {
        this._keyboardSizeListeners.push(listener);
        listener(this._keyboardSize);
    };
    WindowFacade.prototype.removeKeyboardSizeListener = function (listener) {
        var index = this._keyboardSizeListeners.indexOf(listener);
        if (index > -1) {
            this._keyboardSizeListeners.splice(index, 1);
        }
    };
    WindowFacade.prototype.openLink = function (href) {
        if (env.mode === Env_1.Mode.App) {
            window.open(href, "_system");
        }
        else {
            window.open(href, "_blank");
        }
    };
    WindowFacade.prototype.init = function () {
        var _this = this;
        var onresize = function () {
            // see https://developer.mozilla.org/en-US/docs/Web/Events/resize
            if (!_this.resizeTimeout) {
                var cb = function () {
                    _this.resizeTimeout = null;
                    _this._resize(); // The actualResizeHandler will execute at a rate of 15fps
                };
                // On mobile devices there's usaually no resize but when changing orientation it's to early to
                // measure the size in requestAnimationFrame (it's usually incorrect size at this point)
                _this.resizeTimeout = ClientDetector_1.client.isMobileDevice() ? setTimeout(cb, 66) : requestAnimationFrame(cb);
            }
        };
        window.onresize = onresize;
        // specifially for iOS: rotation through the unsupported orientation (e.g, 90 degrees 3 times) will not trigger the resize and we wouldn't resize
        // some things so we react to both, it is throttled anyway
        window.onorientationchange = onresize;
        if (window.addEventListener && !(0, Env_1.isApp)()) {
            window.addEventListener("beforeunload", function (e) { return _this._beforeUnload(e); });
            window.addEventListener("popstate", function (e) { return _this._popState(e); });
            window.addEventListener("unload", function (e) { return _this._onUnload(); });
        }
        // needed to help the MacOs desktop client to distinguish between Cmd+Arrow to navigate the history
        // and Cmd+Arrow to navigate a text editor
        if (env.mode === Env_1.Mode.Desktop && ClientDetector_1.client.isMacOS && window.addEventListener) {
            window.addEventListener("keydown", function (e) {
                if (!e.metaKey || e.key === "Meta")
                    return;
                var target = e.target;
                // prevent history nav if the active element is an input / squire editor
                if ((target === null || target === void 0 ? void 0 : target.tagName) === "INPUT" || (target === null || target === void 0 ? void 0 : target.contentEditable) === "true") {
                    e.stopPropagation();
                }
                else if (e.key === "ArrowLeft") {
                    window.history.back();
                }
                else if (e.key === "ArrowRight") {
                    window.history.forward();
                }
            });
        }
    };
    WindowFacade.prototype._resize = function () {
        try {
            for (var _i = 0, _a = this._windowSizeListeners; _i < _a.length; _i++) {
                var listener = _a[_i];
                listener(window.innerWidth, window.innerHeight);
            }
        }
        finally {
            mithril_1["default"].redraw();
        }
    };
    WindowFacade.prototype._checkWindowClosing = function (enable) {
        this.windowCloseConfirmation = enable;
    };
    WindowFacade.prototype._beforeUnload = function (e) {
        // BeforeUnloadEvent
        console.log("windowfacade._beforeUnload");
        this._notifyCloseListeners(e);
        if (this.windowCloseConfirmation) {
            var m_1 = LanguageViewModel_1.lang.get("closeWindowConfirmation_msg");
            e.returnValue = m_1;
            return m_1;
        }
        else {
            LoginController_1.logins.logout(true);
            return null;
        }
    };
    /**
     * add a function to call when onpopstate event occurs
     * @param listener: return true if this popstate may go ahead
     * @returns {Function}
     */
    WindowFacade.prototype.addHistoryEventListener = function (listener) {
        var _this = this;
        this._historyStateEventListeners.push(listener);
        return function () {
            var index = _this._historyStateEventListeners.indexOf(listener);
            if (index !== -1) {
                _this._historyStateEventListeners.splice(index, 1);
            }
        };
    };
    /**
     * calls the last history event listener that was added
     * and reverts the state change if it returns false
     * TODO: this also fires for forward-events and when the user jumps around in the history
     * TODO: by long-clicking the back/forward buttons.
     * TODO: solving this requires extensive bookkeeping because the events are indistinguishable by default
     * @param e: popstate DOM event
     * @private
     */
    WindowFacade.prototype._popState = function (e) {
        var len = this._historyStateEventListeners.length;
        if (len === 0)
            return;
        if (this._ignoreNextPopstate) {
            this._ignoreNextPopstate = false;
            return;
        }
        if (!this._historyStateEventListeners[len - 1](e)) {
            this._ignoreNextPopstate = true;
            history.go(1);
        }
    };
    WindowFacade.prototype._onUnload = function () {
        if (this.windowCloseConfirmation) {
            LoginController_1.logins.logout(true);
        }
    };
    WindowFacade.prototype.addOnlineListener = function (listener) {
        window.addEventListener("online", listener);
    };
    WindowFacade.prototype.addOfflineListener = function (listener) {
        window.addEventListener("offline", listener);
    };
    WindowFacade.prototype.reload = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var locator, stringifiedArgs, _i, _a, _b, k, v;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!((0, Env_1.isApp)() || (0, Env_1.isElectronClient)())) return [3 /*break*/, 3];
                        if (!args.hasOwnProperty("noAutoLogin")) {
                            args.noAutoLogin = true;
                        }
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("../api/main/MainLocator"); })];
                    case 1:
                        locator = (_c.sent()).locator;
                        stringifiedArgs = {};
                        for (_i = 0, _a = Object.entries(args); _i < _a.length; _i++) {
                            _b = _a[_i], k = _b[0], v = _b[1];
                            if (v != null) {
                                stringifiedArgs[k] = String(v);
                            }
                        }
                        return [4 /*yield*/, locator.commonSystemFacade.reload(stringifiedArgs)];
                    case 2:
                        _c.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        window.location.reload();
                        _c.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    WindowFacade.prototype.addPageInBackgroundListener = function () {
        var _this = this;
        // For Android it's handled manually from native because visibilitychange listener is not called after the
        // app was inactive for some time.
        // See NativeWrapperCommands.js
        if ((0, Env_1.isIOSApp)()) {
            document.addEventListener("visibilitychange", function () {
                var _a;
                console.log("Visibility change, hidden: ", document.hidden);
                (_a = _this._indexerFacade) === null || _a === void 0 ? void 0 : _a.onVisibilityChanged(!document.hidden);
                if (!document.hidden) {
                    // On iOS devices the WebSocket close event fires when the app comes back to foreground
                    // so we try to reconnect with a delay to receive _close event first. Otherwise
                    // we may try to reconnect while we think that we're still connected
                    // (e.g. first reconnect and then receive close).
                    // We used to handle it in the EventBus and reconnect immediately but isIosApp()
                    // check does not work in the worker currently.
                    // Doing this for all apps just to be sure.
                    setTimeout(function () { var _a; return (_a = _this._worker) === null || _a === void 0 ? void 0 : _a.tryReconnectEventBus(false, true); }, 100);
                }
            });
        }
    };
    WindowFacade.prototype.onKeyboardSizeChanged = function (size) {
        this._keyboardSize = size;
        for (var _i = 0, _a = this._keyboardSizeListeners; _i < _a.length; _i++) {
            var listener = _a[_i];
            listener(size);
        }
        if (size > 0) {
            // reset position fixed for the body to allow scrolling in dialogs on iOS
            // https://github.com/scottjehl/Device-Bugs/issues/14
            var body_1 = document.body;
            body_1.style.position = "unset";
            setTimeout(function () {
                body_1.style.position = "fixed";
            }, 200);
        }
    };
    return WindowFacade;
}());
exports.WindowFacade = WindowFacade;
exports.windowFacade = new WindowFacade();
