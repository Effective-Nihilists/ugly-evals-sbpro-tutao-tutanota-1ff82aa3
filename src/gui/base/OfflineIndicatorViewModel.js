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
exports.OfflineIndicatorViewModel = void 0;
var ProgressBar_js_1 = require("./ProgressBar.js");
/**
 * the offline indicator must take into account information
 * from multiple different sources:
 * * ws connection state (connected, not connected) from the worker
 * * login state (logged out, partial login, full login)
 * * sync progress
 * * last sync time
 *
 * the state necessary to determine the right indicator state from
 * previous updates from these information sources
 * is maintained in this class
 */
var OfflineIndicatorViewModel = /** @class */ (function () {
    function OfflineIndicatorViewModel(cb) {
        this.cb = cb;
        this.cacheStorage = null;
        this.loginListener = null;
        this.worker = null;
        this.logins = null;
        this.isInit = false;
        this.lastProgress = ProgressBar_js_1.PROGRESS_DONE;
        this.lastWsState = 0 /* WsConnectionState.connecting */;
        this.lastUpdate = null;
        /**
         * keeping this prevents flashing misleading states during login when
         * the full login succeeded but the ws connection attempt didn't
         * succeed or fail yet.
         * wsState is "connecting" both during first connect attempt and after we
         * disconnected.
         **/
        this.wsWasConnectedBefore = false;
    }
    OfflineIndicatorViewModel.prototype.init = function (locator, logins) {
        var _this = this;
        logins.waitForFullLogin().then(function () { return _this.cb(); });
        this.cacheStorage = locator.cacheStorage;
        this.loginListener = locator.loginListener;
        this.worker = locator.worker;
        this.logins = logins;
        logins.waitForFullLogin().then(function () { return _this.cb(); });
        this.isInit = true;
        this.setProgressUpdateStream(locator.progressTracker.onProgressUpdate);
        this.setWsStateStream(this.worker.wsConnection());
    };
    OfflineIndicatorViewModel.prototype.setProgressUpdateStream = function (progressStream) {
        var _this = this;
        progressStream.map(function (progress) { return _this.onProgressUpdate(progress); });
        this.onProgressUpdate(progressStream());
    };
    OfflineIndicatorViewModel.prototype.setWsStateStream = function (wsStream) {
        var _this = this;
        wsStream.map(function (state) {
            _this.onWsStateChange(state);
        });
        this.onWsStateChange(wsStream()).then();
    };
    OfflineIndicatorViewModel.prototype.onProgressUpdate = function (progress) {
        this.lastProgress = progress;
        this.cb();
    };
    OfflineIndicatorViewModel.prototype.onWsStateChange = function (newState) {
        return __awaiter(this, void 0, void 0, function () {
            var lastUpdate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.lastWsState = newState;
                        if (!(newState !== 1 /* WsConnectionState.connected */)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.cacheStorage.getLastUpdateTime()];
                    case 1:
                        lastUpdate = _a.sent();
                        switch (lastUpdate.type) {
                            case "recorded":
                                this.lastUpdate = new Date(lastUpdate.time);
                                break;
                            case "never":
                            // We can get into uninitialized state after temporary login e.g. during signup
                            case "uninitialized":
                                this.lastUpdate = null;
                                this.wsWasConnectedBefore = false;
                                break;
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        this.wsWasConnectedBefore = true;
                        _a.label = 3;
                    case 3:
                        this.cb();
                        return [2 /*return*/];
                }
            });
        });
    };
    OfflineIndicatorViewModel.prototype.getCurrentAttrs = function () {
        var _this = this;
        if (!this.isInit) {
            return { state: 1 /* OfflineIndicatorState.Connecting */ };
        }
        if (this.logins.isFullyLoggedIn() && this.wsWasConnectedBefore) {
            if (this.lastWsState === 1 /* WsConnectionState.connected */) {
                // normal, full login with a connected websocket
                if (this.lastProgress < ProgressBar_js_1.PROGRESS_DONE) {
                    return { state: 2 /* OfflineIndicatorState.Synchronizing */, progress: this.lastProgress };
                }
                else {
                    return { state: 3 /* OfflineIndicatorState.Online */ };
                }
            }
            else {
                // normal, full login with a disconnected websocket
                return {
                    state: 0 /* OfflineIndicatorState.Offline */,
                    lastUpdate: this.lastUpdate,
                    reconnectAction: function () {
                        console.log("try reconnect ws");
                        _this.worker.tryReconnectEventBus(true, true, 2000);
                    }
                };
            }
        }
        else {
            // either not fully logged in or the websocket was not connected before
            // in cases where the indicator is visible, this is just offline login.
            if (this.loginListener.getFullLoginFailed()) {
                return {
                    state: 0 /* OfflineIndicatorState.Offline */,
                    lastUpdate: this.lastUpdate,
                    reconnectAction: function () {
                        console.log("try full login");
                        _this.logins.retryAsyncLogin()["finally"](function () { return _this.cb(); });
                    }
                };
            }
            else {
                // partially logged in, but the last login attempt didn't fail yet
                return { state: 1 /* OfflineIndicatorState.Connecting */ };
            }
        }
    };
    /*
    * get the current progress for sync operations
     */
    OfflineIndicatorViewModel.prototype.getProgress = function () {
        var _a;
        //getting the progress like this ensures that
        // the progress bar and sync percentage are consistent
        var a = this.getCurrentAttrs();
        return this.isInit && a.state === 2 /* OfflineIndicatorState.Synchronizing */ && ((_a = this.logins) === null || _a === void 0 ? void 0 : _a.isUserLoggedIn())
            ? a.progress
            : 1;
    };
    return OfflineIndicatorViewModel;
}());
exports.OfflineIndicatorViewModel = OfflineIndicatorViewModel;
