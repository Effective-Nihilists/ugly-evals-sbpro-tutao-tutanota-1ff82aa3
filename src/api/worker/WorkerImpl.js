"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.WorkerImpl = void 0;
var MessageDispatcher_1 = require("../common/MessageDispatcher");
var CryptoError_1 = require("../common/error/CryptoError");
var RestError_1 = require("../common/error/RestError");
var ProgrammingError_1 = require("../common/error/ProgrammingError");
var WorkerLocator_1 = require("./WorkerLocator");
var Env_1 = require("../common/Env");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Urlifier_1 = require("./Urlifier");
var WorkerProxy_1 = require("../common/WorkerProxy");
var tutanota_crypto_1 = require("@tutao/tutanota-crypto");
(0, Env_1.assertWorkerOrNode)();
var WorkerImpl = /** @class */ (function () {
    function WorkerImpl(self) {
        this._scope = self;
        this._newEntropy = -1;
        this._lastEntropyUpdate = new Date().getTime();
        this._dispatcher = new MessageDispatcher_1.MessageDispatcher(new MessageDispatcher_1.WorkerTransport(this._scope), this.queueCommands(this.exposedInterface));
    }
    WorkerImpl.prototype.init = function (browserData) {
        return __awaiter(this, void 0, void 0, function () {
            var workerScope;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, WorkerLocator_1.initLocator)(this, browserData)];
                    case 1:
                        _a.sent();
                        workerScope = this._scope;
                        // only register oncaught error handler if we are in the *real* worker scope
                        // Otherwise uncaught error handler might end up in an infinite loop for test cases.
                        if (workerScope && !(0, Env_1.isMainOrNode)()) {
                            workerScope.addEventListener("unhandledrejection", function (event) {
                                _this.sendError(event.reason);
                            });
                            // @ts-ignore
                            workerScope.onerror = function (e, source, lineno, colno, error) {
                                console.error("workerImpl.onerror", e, source, lineno, colno, error);
                                if (error instanceof Error) {
                                    _this.sendError(error);
                                }
                                else {
                                    // @ts-ignore
                                    var err = new Error(e);
                                    // @ts-ignore
                                    err.lineNumber = lineno;
                                    // @ts-ignore
                                    err.columnNumber = colno;
                                    // @ts-ignore
                                    err.fileName = source;
                                    _this.sendError(err);
                                }
                                return true;
                            };
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(WorkerImpl.prototype, "exposedInterface", {
        get: function () {
            return {
                get loginFacade() {
                    return WorkerLocator_1.locator.login;
                },
                get customerFacade() {
                    return WorkerLocator_1.locator.customer;
                },
                get giftCardFacade() {
                    return WorkerLocator_1.locator.giftCards;
                },
                get groupManagementFacade() {
                    return WorkerLocator_1.locator.groupManagement;
                },
                get configFacade() {
                    return WorkerLocator_1.locator.configFacade;
                },
                get calendarFacade() {
                    return WorkerLocator_1.locator.calendar;
                },
                get mailFacade() {
                    return WorkerLocator_1.locator.mail;
                },
                get shareFacade() {
                    return WorkerLocator_1.locator.share;
                },
                get counterFacade() {
                    return WorkerLocator_1.locator.counters;
                },
                get indexerFacade() {
                    return WorkerLocator_1.locator.indexer;
                },
                get searchFacade() {
                    return WorkerLocator_1.locator.search;
                },
                get bookingFacade() {
                    return WorkerLocator_1.locator.booking;
                },
                get mailAddressFacade() {
                    return WorkerLocator_1.locator.mailAddress;
                },
                get fileFacade() {
                    return WorkerLocator_1.locator.file;
                },
                get blobFacade() {
                    return WorkerLocator_1.locator.blob;
                },
                get userManagementFacade() {
                    return WorkerLocator_1.locator.userManagement;
                },
                get contactFormFacade() {
                    return WorkerLocator_1.locator.contactFormFacade;
                },
                get deviceEncryptionFacade() {
                    return WorkerLocator_1.locator.deviceEncryptionFacade;
                },
                get restInterface() {
                    return WorkerLocator_1.locator.cache;
                },
                get serviceExecutor() {
                    return WorkerLocator_1.locator.serviceExecutor;
                },
                get cryptoFacade() {
                    return WorkerLocator_1.locator.crypto;
                },
                get cacheStorage() {
                    return WorkerLocator_1.locator.cacheStorage;
                },
                get random() {
                    return {
                        generateRandomNumber: function (nbrOfBytes) {
                            return __awaiter(this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tutanota_crypto_1.random.generateRandomNumber(nbrOfBytes)];
                                });
                            });
                        }
                    };
                }
            };
        },
        enumerable: false,
        configurable: true
    });
    WorkerImpl.prototype.queueCommands = function (exposedWorker) {
        var _this = this;
        return {
            setup: function (message) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    console.error("WorkerImpl: setup was called after bootstrap! message: ", message);
                    return [2 /*return*/];
                });
            }); },
            testEcho: function (message) {
                return Promise.resolve({
                    msg: ">>> " + message.args[0].msg
                });
            },
            testError: function (message) {
                var errorTypes = {
                    ProgrammingError: ProgrammingError_1.ProgrammingError,
                    CryptoError: CryptoError_1.CryptoError,
                    NotAuthenticatedError: RestError_1.NotAuthenticatedError
                };
                // @ts-ignore
                var ErrorType = errorTypes[message.args[0].errorType];
                return Promise.reject(new ErrorType("wtf: ".concat(message.args[0].errorType)));
            },
            reset: function (message) {
                return (0, WorkerLocator_1.resetLocator)();
            },
            restRequest: function (message) {
                // This horror is to add auth headers to the admin client
                var args = message.args;
                var path = args[0], method = args[1], options = args[2];
                options = options !== null && options !== void 0 ? options : {};
                options.headers = __assign(__assign({}, WorkerLocator_1.locator.user.createAuthHeaders()), options.headers);
                return WorkerLocator_1.locator.restClient.request(path, method, options);
            },
            entropy: function (message) {
                return _this.addEntropy(message.args[0]);
            },
            tryReconnectEventBus: function (message) {
                WorkerLocator_1.locator.eventBusClient.tryReconnect(message.args[0], message.args[1], message.args[2]);
                return Promise.resolve();
            },
            generateSsePushIdentifer: function () {
                return Promise.resolve((0, tutanota_crypto_1.keyToBase64)((0, tutanota_crypto_1.aes256RandomKey)()));
            },
            closeEventBus: function (message) {
                WorkerLocator_1.locator.eventBusClient.close(message.args[0]);
                return Promise.resolve();
            },
            getLog: function () {
                var global = self;
                if (global.logger) {
                    return Promise.resolve(global.logger.getEntries());
                }
                else {
                    return Promise.resolve([]);
                }
            },
            urlify: function (message) { return __awaiter(_this, void 0, void 0, function () {
                var html;
                return __generator(this, function (_a) {
                    html = message.args[0];
                    return [2 /*return*/, Promise.resolve((0, Urlifier_1.urlify)(html))];
                });
            }); },
            facade: (0, WorkerProxy_1.exposeLocal)(exposedWorker)
        };
    };
    WorkerImpl.prototype.invokeNative = function (requestType, args) {
        return this._dispatcher.postRequest(new MessageDispatcher_1.Request("execNative", [requestType, args]));
    };
    WorkerImpl.prototype.getMainInterface = function () {
        var _this = this;
        return (0, WorkerProxy_1.exposeRemote)(function (request) { return _this._dispatcher.postRequest(request); });
    };
    /**
     * Adds entropy to the randomizer. Updated the stored entropy for a user when enough entropy has been collected.
     * @param entropy
     * @returns {Promise.<void>}
     */
    WorkerImpl.prototype.addEntropy = function (entropy) {
        try {
            return tutanota_crypto_1.random.addEntropy(entropy);
        }
        finally {
            this._newEntropy = this._newEntropy + entropy.reduce(function (sum, value) { return value.entropy + sum; }, 0);
            var now = new Date().getTime();
            if (this._newEntropy > 5000 && now - this._lastEntropyUpdate > 1000 * 60 * 5) {
                this._lastEntropyUpdate = now;
                this._newEntropy = 0;
                WorkerLocator_1.locator.login.storeEntropy();
            }
        }
    };
    WorkerImpl.prototype.entityEventsReceived = function (data, eventOwnerGroupId) {
        return this._dispatcher.postRequest(new MessageDispatcher_1.Request("entityEvent", [data, eventOwnerGroupId]));
    };
    WorkerImpl.prototype.sendError = function (e) {
        return this._dispatcher.postRequest(new MessageDispatcher_1.Request("error", [(0, MessageDispatcher_1.errorToObj)(e)]));
    };
    WorkerImpl.prototype.sendProgress = function (progressPercentage) {
        return this._dispatcher.postRequest(new MessageDispatcher_1.Request("progress", [progressPercentage])).then(function () {
            // the worker sometimes does not send the request if it does not get time
            return (0, tutanota_utils_1.delay)(0);
        });
    };
    WorkerImpl.prototype.sendIndexState = function (state) {
        return this._dispatcher.postRequest(new MessageDispatcher_1.Request("updateIndexState", [state]));
    };
    WorkerImpl.prototype.updateWebSocketState = function (state) {
        console.log("ws displayed state: ", state);
        return this._dispatcher.postRequest(new MessageDispatcher_1.Request("updateWebSocketState", [state]));
    };
    WorkerImpl.prototype.updateCounter = function (update) {
        return this._dispatcher.postRequest(new MessageDispatcher_1.Request("counterUpdate", [update]));
    };
    WorkerImpl.prototype.infoMessage = function (message) {
        return this._dispatcher.postRequest(new MessageDispatcher_1.Request("infoMessage", [message]));
    };
    WorkerImpl.prototype.createProgressMonitor = function (totalWork) {
        return this._dispatcher.postRequest(new MessageDispatcher_1.Request("createProgressMonitor", [totalWork]));
    };
    WorkerImpl.prototype.progressWorkDone = function (reference, totalWork) {
        return this._dispatcher.postRequest(new MessageDispatcher_1.Request("progressWorkDone", [reference, totalWork]));
    };
    WorkerImpl.prototype.updateLeaderStatus = function (status) {
        return this._dispatcher.postRequest(new MessageDispatcher_1.Request("updateLeaderStatus", [status]));
    };
    return WorkerImpl;
}());
exports.WorkerImpl = WorkerImpl;
