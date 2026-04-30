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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.bootstrapWorker = exports.WorkerClient = void 0;
var CryptoError_1 = require("../common/error/CryptoError");
var MessageDispatcher_1 = require("../common/MessageDispatcher");
var Env_1 = require("../common/Env");
var ClientDetector_1 = require("../../misc/ClientDetector");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Utils_1 = require("../common/utils/Utils");
var ErrorHandler_1 = require("../../misc/ErrorHandler");
var WorkerProxy_1 = require("../common/WorkerProxy");
var stream_1 = require("mithril/stream");
var TypeRefs_1 = require("../entities/sys/TypeRefs");
(0, Env_1.assertMainOrNode)();
var WorkerClient = /** @class */ (function () {
    function WorkerClient() {
        var _this = this;
        this._deferredInitialized = (0, tutanota_utils_1.defer)();
        this._isInitialized = false;
        this._progressUpdater = null;
        this._wsConnection = (0, stream_1["default"])(2 /* WsConnectionState.terminated */);
        // Should be empty stream unless there's really a message.
        this.infoMessages = (0, stream_1["default"])();
        this._leaderStatus = (0, TypeRefs_1.createWebsocketLeaderStatus)({
            leaderStatus: false
        });
        this.initialized.then(function () {
            _this._isInitialized = true;
        });
    }
    Object.defineProperty(WorkerClient.prototype, "initialized", {
        get: function () {
            return this._deferredInitialized.promise;
        },
        enumerable: false,
        configurable: true
    });
    WorkerClient.prototype.init = function (locator) {
        return __awaiter(this, void 0, void 0, function () {
            var prefixWithoutFile, workerUrl, worker, WorkerImpl, workerImpl_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(env.mode !== "Test")) return [3 /*break*/, 2];
                        prefixWithoutFile = window.tutao.appState.prefixWithoutFile;
                        workerUrl = prefixWithoutFile + "/worker-bootstrap.js";
                        worker = new Worker(workerUrl);
                        this._dispatcher = new MessageDispatcher_1.MessageDispatcher(new MessageDispatcher_1.WorkerTransport(worker), this.queueCommands(locator));
                        return [4 /*yield*/, this._dispatcher.postRequest(new MessageDispatcher_1.Request("setup", [window.env, this._getInitialEntropy(), ClientDetector_1.client.browserData()]))];
                    case 1:
                        _a.sent();
                        worker.onerror = function (e) {
                            throw new CryptoError_1.CryptoError("could not setup worker", e);
                        };
                        return [3 /*break*/, 4];
                    case 2:
                        WorkerImpl = globalThis.testWorker;
                        workerImpl_1 = new WorkerImpl(this, true);
                        return [4 /*yield*/, workerImpl_1.init(ClientDetector_1.client.browserData())];
                    case 3:
                        _a.sent();
                        workerImpl_1._queue._transport = {
                            postMessage: function (msg) { return _this._dispatcher.handleMessage(msg); }
                        };
                        this._dispatcher = new MessageDispatcher_1.MessageDispatcher({
                            postMessage: function (msg) {
                                workerImpl_1._queue.handleMessage(msg);
                            }
                        }, this.queueCommands(locator));
                        _a.label = 4;
                    case 4:
                        this._deferredInitialized.resolve();
                        return [2 /*return*/];
                }
            });
        });
    };
    WorkerClient.prototype.queueCommands = function (locator) {
        var _this = this;
        return {
            execNative: function (message) { return locator.native.invokeNative((0, tutanota_utils_1.downcast)(message.args[0]), (0, tutanota_utils_1.downcast)(message.args[1])); },
            entityEvent: function (message) {
                return locator.eventController.notificationReceived((0, tutanota_utils_1.downcast)(message.args[0]), (0, tutanota_utils_1.downcast)(message.args[1]));
            },
            error: function (message) {
                (0, ErrorHandler_1.handleUncaughtError)((0, Utils_1.objToError)(message.args[0]));
                return Promise.resolve();
            },
            progress: function (message) {
                var progressUpdater = _this._progressUpdater;
                if (progressUpdater) {
                    progressUpdater((0, tutanota_utils_1.downcast)(message.args[0]));
                }
                return Promise.resolve();
            },
            updateIndexState: function (message) {
                locator.search.indexState((0, tutanota_utils_1.downcast)(message.args[0]));
                return Promise.resolve();
            },
            updateWebSocketState: function (message) {
                _this._wsConnection((0, tutanota_utils_1.downcast)(message.args[0]));
                return Promise.resolve();
            },
            counterUpdate: function (message) {
                locator.eventController.counterUpdateReceived((0, tutanota_utils_1.downcast)(message.args[0]));
                return Promise.resolve();
            },
            updateLeaderStatus: function (message) {
                _this._leaderStatus = (0, tutanota_utils_1.downcast)(message.args[0]);
                return Promise.resolve();
            },
            infoMessage: function (message) {
                _this.infoMessages((0, tutanota_utils_1.downcast)(message.args[0]));
                return Promise.resolve();
            },
            createProgressMonitor: function (message) {
                var work = (0, tutanota_utils_1.downcast)(message.args[0]);
                var reference = locator.progressTracker.registerMonitor(work);
                return Promise.resolve(reference);
            },
            progressWorkDone: function (message) {
                var reference = (0, tutanota_utils_1.downcast)(message.args[0]);
                var workDone = (0, tutanota_utils_1.downcast)(message.args[1]);
                var monitor = locator.progressTracker.getMonitor(reference);
                monitor && monitor.workDone(workDone);
                return Promise.resolve();
            },
            facade: (0, WorkerProxy_1.exposeLocal)({
                get loginListener() {
                    return locator.loginListener;
                }
            })
        };
    };
    WorkerClient.prototype.getWorkerInterface = function () {
        var _this = this;
        return (0, WorkerProxy_1.exposeRemote)(function (request) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, this._postRequest(request)];
        }); }); });
    };
    WorkerClient.prototype.tryReconnectEventBus = function (closeIfOpen, enableAutomaticState, delay) {
        if (delay === void 0) { delay = null; }
        return this._postRequest(new MessageDispatcher_1.Request("tryReconnectEventBus", [closeIfOpen, enableAutomaticState, delay]));
    };
    WorkerClient.prototype.restRequest = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this._postRequest(new MessageDispatcher_1.Request("restRequest", Array.from(arguments)));
    };
    WorkerClient.prototype.entropy = function (entropyCache) {
        return this._postRequest(new MessageDispatcher_1.Request("entropy", [entropyCache]));
    };
    /** @private visible for tests */
    WorkerClient.prototype._postRequest = function (msg) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initialized];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this._dispatcher.postRequest(msg)];
                }
            });
        });
    };
    WorkerClient.prototype.registerProgressUpdater = function (updater) {
        this._progressUpdater = updater;
    };
    WorkerClient.prototype.unregisterProgressUpdater = function (updater) {
        // another one might have been registered in the mean time
        if (this._progressUpdater === updater) {
            this._progressUpdater = null;
        }
    };
    WorkerClient.prototype.generateSsePushIdentifer = function () {
        return this._postRequest(new MessageDispatcher_1.Request("generateSsePushIdentifer", __spreadArray([], arguments, true)));
    };
    WorkerClient.prototype.wsConnection = function () {
        return this._wsConnection.map(tutanota_utils_1.identity);
    };
    WorkerClient.prototype.closeEventBus = function (closeOption) {
        return this._dispatcher.postRequest(new MessageDispatcher_1.Request("closeEventBus", [closeOption]));
    };
    WorkerClient.prototype.reset = function () {
        return this._postRequest(new MessageDispatcher_1.Request("reset", []));
    };
    WorkerClient.prototype.getLog = function () {
        return this._dispatcher.postRequest(new MessageDispatcher_1.Request("getLog", []));
    };
    WorkerClient.prototype.isLeader = function () {
        return this._leaderStatus.leaderStatus;
    };
    WorkerClient.prototype.urlify = function (html) {
        return this._postRequest(new MessageDispatcher_1.Request("urlify", [html]));
    };
    /**
     * Add data from either secure random source or Math.random as entropy.
     */
    WorkerClient.prototype._getInitialEntropy = function () {
        var valueList = new Uint32Array(16);
        crypto.getRandomValues(valueList);
        var entropy = [];
        for (var i = 0; i < valueList.length; i++) {
            // 32 because we have 32-bit values Uint32Array
            entropy.push({
                source: "random",
                entropy: 32,
                data: valueList[i]
            });
        }
        return entropy;
    };
    return WorkerClient;
}());
exports.WorkerClient = WorkerClient;
function bootstrapWorker(locator) {
    var worker = new WorkerClient();
    var start = Date.now();
    worker.init(locator).then(function () { return console.log("worker init time (ms):", Date.now() - start); });
    return worker;
}
exports.bootstrapWorker = bootstrapWorker;
