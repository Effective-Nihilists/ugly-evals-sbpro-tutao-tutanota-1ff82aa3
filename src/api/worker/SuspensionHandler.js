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
exports.SuspensionHandler = void 0;
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var SuspensionHandler = /** @class */ (function () {
    function SuspensionHandler(worker, systemTimeout) {
        this._isSuspended = false;
        this._suspendedUntil = 0;
        this._deferredRequests = [];
        this._worker = worker;
        this._hasSentInfoMessage = false;
        this._timeout = systemTimeout;
    }
    /**
     * Activates suspension states for the given amount of seconds. After the end of the suspension time all deferred requests are executed.
     */
    // if already suspended do we want to ignore incoming suspensions?
    SuspensionHandler.prototype.activateSuspensionIfInactive = function (suspensionDurationSeconds) {
        var _this = this;
        if (!this.isSuspended()) {
            console.log("Activating suspension:  ".concat(suspensionDurationSeconds, "s"));
            this._isSuspended = true;
            var suspensionStartTime_1 = Date.now();
            this._timeout.setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this._isSuspended = false;
                            console.log("Suspension released after ".concat((Date.now() - suspensionStartTime_1) / 1000, "s"));
                            return [4 /*yield*/, this._onSuspensionComplete()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); }, suspensionDurationSeconds * 1000);
            if (!this._hasSentInfoMessage) {
                this._worker.infoMessage({
                    translationKey: "clientSuspensionWait_label",
                    args: {}
                });
                this._hasSentInfoMessage = true;
            }
        }
    };
    SuspensionHandler.prototype.isSuspended = function () {
        return this._isSuspended;
    };
    /**
     * Adds a request to the deferred queue.
     * @param request
     * @returns {Promise<T>}
     */
    SuspensionHandler.prototype.deferRequest = function (request) {
        if (this._isSuspended) {
            var deferredObject = (0, tutanota_utils_1.defer)();
            this._deferredRequests.push(deferredObject);
            // assign request promise to deferred object
            deferredObject.promise = deferredObject.promise.then(function () { return request(); });
            return deferredObject.promise;
        }
        else {
            // if suspension is not activated then immediately execute the request
            return request();
        }
    };
    SuspensionHandler.prototype._onSuspensionComplete = function () {
        return __awaiter(this, void 0, void 0, function () {
            var deferredRequests, _i, deferredRequests_1, deferredRequest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        deferredRequests = this._deferredRequests;
                        this._deferredRequests = [];
                        _i = 0, deferredRequests_1 = deferredRequests;
                        _a.label = 1;
                    case 1:
                        if (!(_i < deferredRequests_1.length)) return [3 /*break*/, 4];
                        deferredRequest = deferredRequests_1[_i];
                        deferredRequest.resolve(null);
                        // Ignore all errors here, any errors should be caught by whoever is handling the deferred request
                        return [4 /*yield*/, deferredRequest.promise["catch"](tutanota_utils_1.noOp)];
                    case 2:
                        // Ignore all errors here, any errors should be caught by whoever is handling the deferred request
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return SuspensionHandler;
}());
exports.SuspensionHandler = SuspensionHandler;
