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
exports.NativeInterfaceMain = void 0;
var Env_1 = require("../../api/common/Env");
var MessageDispatcher_1 = require("../../api/common/MessageDispatcher");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var ProgrammingError_1 = require("../../api/common/error/ProgrammingError");
var IosNativeTransport_js_1 = require("./IosNativeTransport.js");
var AndroidNativeTransport_js_1 = require("./AndroidNativeTransport.js");
var DesktopNativeTransport_js_1 = require("./DesktopNativeTransport.js");
(0, Env_1.assertMainOrNode)();
var NativeInterfaceMain = /** @class */ (function () {
    function NativeInterfaceMain(globalDispatcher) {
        this.globalDispatcher = globalDispatcher;
        this._dispatchDeferred = (0, tutanota_utils_1.defer)();
        this._appUpdateListener = null;
    }
    NativeInterfaceMain.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var transport, androidTransport, queue;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if ((0, Env_1.isAndroidApp)()) {
                            androidTransport = new AndroidNativeTransport_js_1.AndroidNativeTransport(window);
                            androidTransport.start();
                            transport = androidTransport;
                        }
                        else if ((0, Env_1.isIOSApp)()) {
                            transport = new IosNativeTransport_js_1.IosNativeTransport(window);
                        }
                        else if ((0, Env_1.isElectronClient)()) {
                            transport = new DesktopNativeTransport_js_1.DesktopNativeTransport(window.nativeApp);
                        }
                        else {
                            throw new ProgrammingError_1.ProgrammingError("Tried to create a native interface in the browser");
                        }
                        queue = new MessageDispatcher_1.MessageDispatcher(transport, {
                            "ipc": function (request) { return _this.globalDispatcher.dispatch(request.args[0], request.args[1], request.args.slice(2)); }
                        });
                        return [4 /*yield*/, queue.postRequest(new MessageDispatcher_1.Request("ipc", ["CommonSystemFacade", "initializeRemoteBridge"]))];
                    case 1:
                        _a.sent();
                        this._dispatchDeferred.resolve(queue);
                        return [2 /*return*/];
                }
            });
        });
    };
    // for testing
    NativeInterfaceMain.prototype.initWithQueue = function (queue) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this._dispatchDeferred.resolve(queue);
                return [2 /*return*/];
            });
        });
    };
    /**
     * Send a request to the native side.
     */
    NativeInterfaceMain.prototype.invokeNative = function (requestType, args) {
        return __awaiter(this, void 0, void 0, function () {
            var dispatch;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._dispatchDeferred.promise];
                    case 1:
                        dispatch = _a.sent();
                        return [2 /*return*/, dispatch.postRequest(new MessageDispatcher_1.Request(requestType, args))];
                }
            });
        });
    };
    /**
     * Saves a listener method to be called when an app update has been downloaded on the native side.
     */
    NativeInterfaceMain.prototype.setAppUpdateListener = function (listener) {
        this._appUpdateListener = listener;
    };
    /**
     * Call the update listener if set.
     */
    NativeInterfaceMain.prototype.handleUpdateDownload = function () {
        var _a;
        (_a = this._appUpdateListener) === null || _a === void 0 ? void 0 : _a.call(this);
    };
    return NativeInterfaceMain;
}());
exports.NativeInterfaceMain = NativeInterfaceMain;
