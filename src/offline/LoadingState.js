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
exports.LoadingStateTracker = exports.LoadingState = void 0;
var stream_1 = require("mithril/stream");
var ErrorCheckUtils_js_1 = require("../api/common/utils/ErrorCheckUtils.js");
var LoadingState;
(function (LoadingState) {
    /** We have not tried to load anything, or the loading is complete */
    LoadingState[LoadingState["Idle"] = 0] = "Idle";
    /** We are waiting for a resource to load */
    LoadingState[LoadingState["Loading"] = 1] = "Loading";
    /** We tried to load and got a `ConnectionError` */
    LoadingState[LoadingState["ConnectionLost"] = 2] = "ConnectionLost";
})(LoadingState = exports.LoadingState || (exports.LoadingState = {}));
/**
 * A utility to track the loaded state of some resource
 * Provides listeners for handling state changes
 */
var LoadingStateTracker = /** @class */ (function () {
    function LoadingStateTracker(initialState) {
        if (initialState === void 0) { initialState = LoadingState.Idle; }
        this.loadingStateListener = null;
        this.state = (0, stream_1["default"])(initialState);
    }
    LoadingStateTracker.prototype.get = function () {
        return this.state();
    };
    LoadingStateTracker.prototype.isIdle = function () {
        return this.get() === LoadingState.Idle;
    };
    LoadingStateTracker.prototype.isLoading = function () {
        return this.get() === LoadingState.Loading;
    };
    LoadingStateTracker.prototype.isConnectionLost = function () {
        return this.get() === LoadingState.ConnectionLost;
    };
    LoadingStateTracker.prototype.set = function (state) {
        this.state(state);
    };
    LoadingStateTracker.prototype.setIdle = function () {
        this.set(LoadingState.Idle);
    };
    LoadingStateTracker.prototype.setLoading = function () {
        this.set(LoadingState.Loading);
    };
    LoadingStateTracker.prototype.setConnectionLost = function () {
        this.set(LoadingState.ConnectionLost);
    };
    /**
     * Follow the state of a promise.
     * While the promise is not resolved, this will be in `Loading` state
     * If the promise rejects with a `ConnectionError`, then it will finish in `ConnectionLost` state
     * Otherwise it will finish in `Idle` state
     */
    LoadingStateTracker.prototype.trackPromise = function (promise) {
        return __awaiter(this, void 0, void 0, function () {
            var connectionLost, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.set(LoadingState.Loading);
                        connectionLost = false;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, promise];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        e_1 = _a.sent();
                        if ((0, ErrorCheckUtils_js_1.isOfflineError)(e_1)) {
                            connectionLost = true;
                        }
                        throw e_1;
                    case 4:
                        this.set(connectionLost ? LoadingState.ConnectionLost : LoadingState.Idle);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    LoadingStateTracker.prototype.setStateChangedListener = function (listener) {
        this.clearStateChangedListener();
        this.loadingStateListener = this.state.map(listener);
    };
    LoadingStateTracker.prototype.clearStateChangedListener = function () {
        if (this.loadingStateListener != null) {
            this.loadingStateListener.end(true);
            this.loadingStateListener = null;
        }
    };
    return LoadingStateTracker;
}());
exports.LoadingStateTracker = LoadingStateTracker;
