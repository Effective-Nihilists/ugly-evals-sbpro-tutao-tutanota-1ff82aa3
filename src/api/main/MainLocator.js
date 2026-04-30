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
exports.locator = void 0;
var WorkerClient_1 = require("./WorkerClient");
var EventController_1 = require("./EventController");
var EntropyCollector_1 = require("./EntropyCollector");
var SearchModel_1 = require("../../search/model/SearchModel");
var MailModel_1 = require("../../mail/model/MailModel");
var Env_1 = require("../common/Env");
var Notifications_1 = require("../../gui/Notifications");
var LoginController_1 = require("./LoginController");
var ContactModel_1 = require("../../contacts/model/ContactModel");
var EntityClient_1 = require("../common/EntityClient");
var CalendarModel_1 = require("../../calendar/model/CalendarModel");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var ProgressTracker_1 = require("./ProgressTracker");
var MinimizedMailEditorViewModel_1 = require("../../mail/model/MinimizedMailEditorViewModel");
var Scheduler_js_1 = require("../common/utils/Scheduler.js");
var CredentialsProviderFactory_1 = require("../../misc/credentials/CredentialsProviderFactory");
var ProgrammingError_1 = require("../common/error/ProgrammingError");
var SecondFactorHandler_1 = require("../../misc/2fa/SecondFactorHandler");
var WebauthnClient_1 = require("../../misc/2fa/webauthn/WebauthnClient");
var WorkerProxy_1 = require("../common/WorkerProxy");
var BrowserWebauthn_js_1 = require("../../misc/2fa/webauthn/BrowserWebauthn.js");
var tutanota_usagetests_1 = require("@tutao/tutanota-usagetests");
var UsageTestModel_1 = require("../../misc/UsageTestModel");
var DeviceConfig_1 = require("../../misc/DeviceConfig");
var RecipientsModel_1 = require("./RecipientsModel");
var LoginListener_1 = require("./LoginListener");
var FileControllerBrowser_js_1 = require("../../file/FileControllerBrowser.js");
var FileControllerNative_js_1 = require("../../file/FileControllerNative.js");
var WindowFacade_js_1 = require("../../misc/WindowFacade.js");
(0, Env_1.assertMainOrNode)();
var MainLocator = /** @class */ (function () {
    function MainLocator() {
        this.nativeInterfaces = null;
        this.exposedNativeInterfaces = null;
        this._deferredInitialized = (0, tutanota_utils_1.defer)();
        this._workerDeferred = (0, tutanota_utils_1.defer)();
    }
    Object.defineProperty(MainLocator.prototype, "native", {
        get: function () {
            return this.getNativeInterface("native");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MainLocator.prototype, "fileApp", {
        get: function () {
            return this.getNativeInterface("fileApp");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MainLocator.prototype, "pushService", {
        get: function () {
            return this.getNativeInterface("pushService");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MainLocator.prototype, "commonSystemFacade", {
        get: function () {
            return this.getNativeInterface("commonSystemFacade");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MainLocator.prototype, "themeFacade", {
        get: function () {
            return this.getNativeInterface("themeFacade");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MainLocator.prototype, "systemFacade", {
        get: function () {
            return this.getNativeInterface("mobileSystemFacade");
        },
        enumerable: false,
        configurable: true
    });
    MainLocator.prototype.getExposedNativeInterface = function () {
        var _this = this;
        if ((0, Env_1.isBrowser)()) {
            throw new ProgrammingError_1.ProgrammingError("Tried to access native interfaces in browser");
        }
        if (this.exposedNativeInterfaces == null) {
            this.exposedNativeInterfaces = (0, WorkerProxy_1.exposeRemote)(function (msg) { return _this.native.invokeNative(msg.requestType, msg.args); });
        }
        return this.exposedNativeInterfaces;
    };
    MainLocator.prototype.getNativeInterface = function (name) {
        if (!this.nativeInterfaces) {
            throw new ProgrammingError_1.ProgrammingError("Tried to use ".concat(name, " in web"));
        }
        return this.nativeInterfaces[name];
    };
    Object.defineProperty(MainLocator.prototype, "initialized", {
        get: function () {
            return this._deferredInitialized.promise;
        },
        enumerable: false,
        configurable: true
    });
    MainLocator.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Split init in two separate parts: creating modules and causing side effects.
                        // We would like to do both on normal init but on HMR we just want to replace modules without a new worker. If we create a new
                        // worker we end up losing state on the worker side (including our session).
                        this.worker = (0, WorkerClient_1.bootstrapWorker)(this);
                        return [4 /*yield*/, this._createInstances()];
                    case 1:
                        _a.sent();
                        this._entropyCollector = new EntropyCollector_1.EntropyCollector(this.worker);
                        this._entropyCollector.start();
                        this._deferredInitialized.resolve();
                        return [2 /*return*/];
                }
            });
        });
    };
    MainLocator.prototype._createInstances = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var _c, loginFacade, customerFacade, giftCardFacade, groupManagementFacade, configFacade, calendarFacade, mailFacade, shareFacade, counterFacade, indexerFacade, searchFacade, bookingFacade, mailAddressFacade, fileFacade, blobFacade, userManagementFacade, contactFormFacade, deviceEncryptionFacade, restInterface, serviceExecutor, cryptoFacade, cacheStorage, random, WebDesktopFacade, WebMobileFacade, WebCommonNativeFacade, WebInterWindowEventFacade, WebAuthnFacadeSendDispatcher, _d, createNativeInterfaces, createDesktopInterfaces, desktopInterfaces, _e, lazyScheduler;
            var _f;
            var _this = this;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _c = this.worker.getWorkerInterface(), loginFacade = _c.loginFacade, customerFacade = _c.customerFacade, giftCardFacade = _c.giftCardFacade, groupManagementFacade = _c.groupManagementFacade, configFacade = _c.configFacade, calendarFacade = _c.calendarFacade, mailFacade = _c.mailFacade, shareFacade = _c.shareFacade, counterFacade = _c.counterFacade, indexerFacade = _c.indexerFacade, searchFacade = _c.searchFacade, bookingFacade = _c.bookingFacade, mailAddressFacade = _c.mailAddressFacade, fileFacade = _c.fileFacade, blobFacade = _c.blobFacade, userManagementFacade = _c.userManagementFacade, contactFormFacade = _c.contactFormFacade, deviceEncryptionFacade = _c.deviceEncryptionFacade, restInterface = _c.restInterface, serviceExecutor = _c.serviceExecutor, cryptoFacade = _c.cryptoFacade, cacheStorage = _c.cacheStorage, random = _c.random;
                        this.loginFacade = loginFacade;
                        this.customerFacade = customerFacade;
                        this.giftCardFacade = giftCardFacade;
                        this.groupManagementFacade = groupManagementFacade;
                        this.configFacade = configFacade;
                        this.calendarFacade = calendarFacade;
                        this.mailFacade = mailFacade;
                        this.shareFacade = shareFacade;
                        this.counterFacade = counterFacade;
                        this.indexerFacade = indexerFacade;
                        this.searchFacade = searchFacade;
                        this.bookingFacade = bookingFacade;
                        this.mailAddressFacade = mailAddressFacade;
                        this.fileFacade = fileFacade;
                        this.blobFacade = blobFacade;
                        this.userManagementFacade = userManagementFacade;
                        this.contactFormFacade = contactFormFacade;
                        this.deviceEncryptionFacade = deviceEncryptionFacade;
                        this.serviceExecutor = serviceExecutor;
                        this.eventController = new EventController_1.EventController(LoginController_1.logins);
                        this.progressTracker = new ProgressTracker_1.ProgressTracker();
                        this.search = new SearchModel_1.SearchModel(this.searchFacade);
                        this.entityClient = new EntityClient_1.EntityClient(restInterface);
                        this.cryptoFacade = cryptoFacade;
                        this.cacheStorage = cacheStorage;
                        if (!!(0, Env_1.isBrowser)()) return [3 /*break*/, 7];
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("../../native/main/WebDesktopFacade"); })];
                    case 1:
                        WebDesktopFacade = (_g.sent()).WebDesktopFacade;
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("../../native/main/WebMobileFacade.js"); })];
                    case 2:
                        WebMobileFacade = (_g.sent()).WebMobileFacade;
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("../../native/main/WebCommonNativeFacade.js"); })];
                    case 3:
                        WebCommonNativeFacade = (_g.sent()).WebCommonNativeFacade;
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("../../native/main/WebInterWindowEventFacade.js"); })];
                    case 4:
                        WebInterWindowEventFacade = (_g.sent()).WebInterWindowEventFacade;
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("../../native/common/generatedipc/WebAuthnFacadeSendDispatcher.js"); })];
                    case 5:
                        WebAuthnFacadeSendDispatcher = (_g.sent()).WebAuthnFacadeSendDispatcher;
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("../../native/main/NativeInterfaceFactory.js"); })];
                    case 6:
                        _d = _g.sent(), createNativeInterfaces = _d.createNativeInterfaces, createDesktopInterfaces = _d.createDesktopInterfaces;
                        this.nativeInterfaces = createNativeInterfaces(new WebMobileFacade(), new WebDesktopFacade(), new WebInterWindowEventFacade(LoginController_1.logins, WindowFacade_js_1.windowFacade), new WebCommonNativeFacade(), cryptoFacade, calendarFacade, this.entityClient);
                        if ((0, Env_1.isElectronClient)()) {
                            desktopInterfaces = createDesktopInterfaces(this.native);
                            this.searchTextFacade = desktopInterfaces.searchTextFacade;
                            this.interWindowEventSender = desktopInterfaces.interWindowEventSender;
                            this.webAuthn = new WebauthnClient_1.WebauthnClient(new WebAuthnFacadeSendDispatcher(this.native), (0, Env_1.getWebRoot)());
                            if ((0, Env_1.isDesktop)()) {
                                this.desktopSettingsFacade = desktopInterfaces.desktopSettingsFacade;
                                this.desktopSystemFacade = desktopInterfaces.desktopSystemFacade;
                            }
                        }
                        if ((0, Env_1.isOfflineStorageAvailable)()) {
                            this.sqlCipherFacade = this.nativeInterfaces.sqlCipherFacade;
                        }
                        _g.label = 7;
                    case 7:
                        if (this.webAuthn == null) {
                            this.webAuthn = new WebauthnClient_1.WebauthnClient(new BrowserWebauthn_js_1.BrowserWebauthn(navigator.credentials, window.location.hostname), (0, Env_1.getWebRoot)());
                        }
                        this.secondFactorHandler = new SecondFactorHandler_1.SecondFactorHandler(this.eventController, this.entityClient, this.webAuthn, this.loginFacade);
                        this.loginListener = new LoginListener_1.LoginListener(this.secondFactorHandler);
                        _e = this;
                        return [4 /*yield*/, (0, CredentialsProviderFactory_1.createCredentialsProvider)(deviceEncryptionFacade, (_b = (_a = this.nativeInterfaces) === null || _a === void 0 ? void 0 : _a.native) !== null && _b !== void 0 ? _b : null, (0, Env_1.isDesktop)() ? this.interWindowEventSender : null)];
                    case 8:
                        _e.credentialsProvider = _g.sent();
                        this.mailModel = new MailModel_1.MailModel(Notifications_1.notifications, this.eventController, this.worker, this.mailFacade, this.entityClient);
                        this.random = random;
                        this.usageTestModel = new UsageTestModel_1.UsageTestModel((_f = {},
                            _f[0 /* StorageBehavior.Persist */] = DeviceConfig_1.deviceConfig,
                            _f[1 /* StorageBehavior.Ephemeral */] = new UsageTestModel_1.EphemeralUsageTestStorage(),
                            _f), {
                            now: function () {
                                return Date.now();
                            },
                            timeZone: function () {
                                throw new Error("Not implemented by this provider");
                            }
                        }, this.serviceExecutor, this.entityClient, LoginController_1.logins, this.eventController);
                        lazyScheduler = (0, tutanota_utils_1.lazyMemoized)(function () { return __awaiter(_this, void 0, void 0, function () {
                            var AlarmSchedulerImpl, DateProviderImpl, dateProvider;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../../calendar/date/AlarmScheduler"); })];
                                    case 1:
                                        AlarmSchedulerImpl = (_a.sent()).AlarmSchedulerImpl;
                                        return [4 /*yield*/, Promise.resolve().then(function () { return require("../../calendar/date/CalendarUtils"); })];
                                    case 2:
                                        DateProviderImpl = (_a.sent()).DateProviderImpl;
                                        dateProvider = new DateProviderImpl();
                                        return [2 /*return*/, new AlarmSchedulerImpl(dateProvider, new Scheduler_js_1.SchedulerImpl(dateProvider, window, window))];
                                }
                            });
                        }); });
                        this.fileController = this.nativeInterfaces == null
                            ? new FileControllerBrowser_js_1.FileControllerBrowser(blobFacade, fileFacade)
                            : new FileControllerNative_js_1.FileControllerNative(this.nativeInterfaces.fileApp, blobFacade, fileFacade);
                        this.calendarModel = new CalendarModel_1.CalendarModelImpl(Notifications_1.notifications, lazyScheduler, this.eventController, this.serviceExecutor, LoginController_1.logins, this.progressTracker, this.entityClient, this.mailModel, this.calendarFacade, this.fileController);
                        this.contactModel = new ContactModel_1.ContactModelImpl(this.searchFacade, this.entityClient, LoginController_1.logins);
                        this.minimizedMailModel = new MinimizedMailEditorViewModel_1.MinimizedMailEditorViewModel();
                        this.usageTestController = new tutanota_usagetests_1.UsageTestController(this.usageTestModel);
                        this.recipientsModel = new RecipientsModel_1.RecipientsModel(this.contactModel, LoginController_1.logins, this.mailFacade, this.entityClient);
                        return [2 /*return*/];
                }
            });
        });
    };
    return MainLocator;
}());
exports.locator = new MainLocator();
if (typeof window !== "undefined") {
    window.tutao.locator = exports.locator;
}
