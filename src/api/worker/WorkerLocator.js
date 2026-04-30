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
exports.resetLocator = exports.initLocator = exports.locator = void 0;
var LoginFacade_1 = require("./facades/LoginFacade");
var Indexer_1 = require("./search/Indexer");
var EntityRestClient_1 = require("./rest/EntityRestClient");
var UserManagementFacade_1 = require("./facades/UserManagementFacade");
var DefaultEntityRestCache_js_1 = require("./rest/DefaultEntityRestCache.js");
var GroupManagementFacade_1 = require("./facades/GroupManagementFacade");
var MailFacade_1 = require("./facades/MailFacade");
var MailAddressFacade_1 = require("./facades/MailAddressFacade");
var FileFacade_1 = require("./facades/FileFacade");
var SearchFacade_1 = require("./search/SearchFacade");
var CustomerFacade_1 = require("./facades/CustomerFacade");
var CounterFacade_1 = require("./facades/CounterFacade");
var EventBusClient_1 = require("./EventBusClient");
var Env_1 = require("../common/Env");
var TutanotaConstants_1 = require("../common/TutanotaConstants");
var CalendarFacade_1 = require("./facades/CalendarFacade");
var ShareFacade_1 = require("./facades/ShareFacade");
var RestClient_1 = require("./rest/RestClient");
var SuspensionHandler_1 = require("./SuspensionHandler");
var EntityClient_1 = require("../common/EntityClient");
var GiftCardFacade_1 = require("./facades/GiftCardFacade");
var ConfigurationDatabase_1 = require("./facades/ConfigurationDatabase");
var ContactFormFacade_1 = require("./facades/ContactFormFacade");
var DeviceEncryptionFacade_1 = require("./facades/DeviceEncryptionFacade");
var FileApp_1 = require("../../native/common/FileApp");
var AesApp_1 = require("../../native/worker/AesApp");
var RsaImplementation_1 = require("./crypto/RsaImplementation");
var CryptoFacade_1 = require("./crypto/CryptoFacade");
var InstanceMapper_1 = require("./crypto/InstanceMapper");
var AdminClientDummyEntityRestCache_js_1 = require("./rest/AdminClientDummyEntityRestCache.js");
var SleepDetector_js_1 = require("./utils/SleepDetector.js");
var Scheduler_js_1 = require("../common/utils/Scheduler.js");
var NoZoneDateProvider_js_1 = require("../common/utils/NoZoneDateProvider.js");
var CacheStorageProxy_1 = require("./rest/CacheStorageProxy");
var ServiceExecutor_1 = require("./rest/ServiceExecutor");
var BookingFacade_1 = require("./facades/BookingFacade");
var BlobFacade_1 = require("./facades/BlobFacade");
var UserFacade_1 = require("./facades/UserFacade");
var OfflineStorage_js_1 = require("./offline/OfflineStorage.js");
var OfflineStorageMigrator_js_1 = require("./offline/OfflineStorageMigrator.js");
var EntityFunctions_js_1 = require("../common/EntityFunctions.js");
var FileFacadeSendDispatcher_js_1 = require("../../native/common/generatedipc/FileFacadeSendDispatcher.js");
var NativePushFacadeSendDispatcher_js_1 = require("../../native/common/generatedipc/NativePushFacadeSendDispatcher.js");
var NativeCryptoFacadeSendDispatcher_1 = require("../../native/common/generatedipc/NativeCryptoFacadeSendDispatcher");
var tutanota_crypto_1 = require("@tutao/tutanota-crypto");
var ExportFacadeSendDispatcher_js_1 = require("../../native/common/generatedipc/ExportFacadeSendDispatcher.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var InterWindowEventFacadeSendDispatcher_js_1 = require("../../native/common/generatedipc/InterWindowEventFacadeSendDispatcher.js");
var SqlCipherFacadeSendDispatcher_js_1 = require("../../native/common/generatedipc/SqlCipherFacadeSendDispatcher.js");
(0, Env_1.assertWorkerOrNode)();
exports.locator = {};
function initLocator(worker, browserData) {
    return __awaiter(this, void 0, void 0, function () {
        var suspensionHandler, _a, entityRestClient, offlineStorageProvider, maybeUninitializedStorage, fileApp, cache, mainInterface, suggestionFacades, aesApp, nativePushFacade, dateProvider, scheduler;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    exports.locator.user = new UserFacade_1.UserFacade();
                    suspensionHandler = new SuspensionHandler_1.SuspensionHandler(worker, self);
                    exports.locator.instanceMapper = new InstanceMapper_1.InstanceMapper();
                    _a = exports.locator;
                    return [4 /*yield*/, (0, RsaImplementation_1.createRsaImplementation)(worker)];
                case 1:
                    _a.rsa = _b.sent();
                    exports.locator.restClient = new RestClient_1.RestClient(suspensionHandler);
                    exports.locator.serviceExecutor = new ServiceExecutor_1.ServiceExecutor(exports.locator.restClient, exports.locator.user, exports.locator.instanceMapper, function () { return exports.locator.crypto; });
                    entityRestClient = new EntityRestClient_1.EntityRestClient(exports.locator.user, exports.locator.restClient, function () { return exports.locator.crypto; }, exports.locator.instanceMapper);
                    exports.locator._browserData = browserData;
                    exports.locator.native = worker;
                    exports.locator.booking = new BookingFacade_1.BookingFacade(exports.locator.serviceExecutor);
                    offlineStorageProvider = function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if ((0, Env_1.isOfflineStorageAvailable)()) {
                                return [2 /*return*/, new OfflineStorage_js_1.OfflineStorage(new SqlCipherFacadeSendDispatcher_js_1.SqlCipherFacadeSendDispatcher(exports.locator.native), new InterWindowEventFacadeSendDispatcher_js_1.InterWindowEventFacadeSendDispatcher(worker), new NoZoneDateProvider_js_1.NoZoneDateProvider(), new OfflineStorageMigrator_js_1.OfflineStorageMigrator(OfflineStorageMigrator_js_1.OFFLINE_STORAGE_MIGRATIONS, EntityFunctions_js_1.modelInfos))];
                            }
                            else {
                                return [2 /*return*/, null];
                            }
                            return [2 /*return*/];
                        });
                    }); };
                    maybeUninitializedStorage = new CacheStorageProxy_1.LateInitializedCacheStorageImpl(worker, offlineStorageProvider);
                    exports.locator.cacheStorage = maybeUninitializedStorage;
                    fileApp = new FileApp_1.NativeFileApp(new FileFacadeSendDispatcher_js_1.FileFacadeSendDispatcher(worker), new ExportFacadeSendDispatcher_js_1.ExportFacadeSendDispatcher(worker));
                    cache = null;
                    if (!(0, Env_1.isAdminClient)()) {
                        cache = new DefaultEntityRestCache_js_1.DefaultEntityRestCache(entityRestClient, maybeUninitializedStorage);
                    }
                    exports.locator.cache = cache !== null && cache !== void 0 ? cache : entityRestClient;
                    exports.locator.cachingEntityClient = new EntityClient_1.EntityClient(exports.locator.cache);
                    exports.locator.indexer = new Indexer_1.Indexer(entityRestClient, worker, browserData, exports.locator.cache);
                    mainInterface = worker.getMainInterface();
                    exports.locator.crypto = new CryptoFacade_1.CryptoFacade(exports.locator.user, exports.locator.cachingEntityClient, exports.locator.restClient, exports.locator.rsa, exports.locator.serviceExecutor);
                    exports.locator.login = new LoginFacade_1.LoginFacade(worker, exports.locator.restClient, 
                    /**
                     * we don't want to try to use the cache in the login facade, because it may not be available (when no user is logged in)
                     */
                    new EntityClient_1.EntityClient(exports.locator.cache), mainInterface.loginListener, exports.locator.instanceMapper, exports.locator.crypto, maybeUninitializedStorage, exports.locator.serviceExecutor, exports.locator.user);
                    suggestionFacades = [
                        exports.locator.indexer._contact.suggestionFacade,
                        exports.locator.indexer._groupInfo.suggestionFacade,
                        exports.locator.indexer._whitelabelChildIndexer.suggestionFacade,
                    ];
                    exports.locator.search = new SearchFacade_1.SearchFacade(exports.locator.user, exports.locator.indexer.db, exports.locator.indexer._mail, suggestionFacades, browserData, exports.locator.cachingEntityClient);
                    exports.locator.counters = new CounterFacade_1.CounterFacade(exports.locator.serviceExecutor);
                    exports.locator.groupManagement = new GroupManagementFacade_1.GroupManagementFacade(exports.locator.user, exports.locator.counters, exports.locator.cachingEntityClient, exports.locator.rsa, exports.locator.serviceExecutor);
                    exports.locator.userManagement = new UserManagementFacade_1.UserManagementFacade(worker, exports.locator.user, exports.locator.groupManagement, exports.locator.counters, exports.locator.rsa, exports.locator.cachingEntityClient, exports.locator.serviceExecutor);
                    exports.locator.customer = new CustomerFacade_1.CustomerFacade(worker, exports.locator.user, exports.locator.groupManagement, exports.locator.userManagement, exports.locator.counters, exports.locator.rsa, exports.locator.cachingEntityClient, exports.locator.serviceExecutor, exports.locator.booking, exports.locator.crypto);
                    aesApp = new AesApp_1.AesApp(new NativeCryptoFacadeSendDispatcher_1.NativeCryptoFacadeSendDispatcher(worker), tutanota_crypto_1.random);
                    exports.locator.blob = new BlobFacade_1.BlobFacade(exports.locator.user, exports.locator.serviceExecutor, exports.locator.restClient, suspensionHandler, fileApp, aesApp, exports.locator.instanceMapper, exports.locator.crypto);
                    exports.locator.file = new FileFacade_1.FileFacade(exports.locator.user, exports.locator.restClient, suspensionHandler, fileApp, aesApp, exports.locator.instanceMapper, exports.locator.serviceExecutor, exports.locator.crypto);
                    exports.locator.mail = new MailFacade_1.MailFacade(exports.locator.user, exports.locator.file, exports.locator.cachingEntityClient, exports.locator.crypto, exports.locator.serviceExecutor, exports.locator.blob, fileApp);
                    nativePushFacade = new NativePushFacadeSendDispatcher_js_1.NativePushFacadeSendDispatcher(worker);
                    // not needed for admin client
                    if (!(0, Env_1.isAdminClient)()) {
                        exports.locator.calendar = new CalendarFacade_1.CalendarFacade(exports.locator.user, exports.locator.groupManagement, (0, tutanota_utils_1.assertNotNull)(cache), nativePushFacade, worker, exports.locator.instanceMapper, exports.locator.serviceExecutor, exports.locator.crypto);
                    }
                    exports.locator.mailAddress = new MailAddressFacade_1.MailAddressFacade(exports.locator.user, exports.locator.serviceExecutor);
                    dateProvider = new NoZoneDateProvider_js_1.NoZoneDateProvider();
                    scheduler = new Scheduler_js_1.SchedulerImpl(dateProvider, self, self);
                    exports.locator.eventBusClient = new EventBusClient_1.EventBusClient(worker, exports.locator.indexer, cache !== null && cache !== void 0 ? cache : new AdminClientDummyEntityRestCache_js_1.AdminClientDummyEntityRestCache(), exports.locator.mail, exports.locator.user, exports.locator.cachingEntityClient, exports.locator.instanceMapper, function (path) { return new WebSocket((0, Env_1.getWebsocketOrigin)() + path); }, new SleepDetector_js_1.SleepDetector(scheduler, dateProvider), exports.locator.login);
                    exports.locator.login.init(exports.locator.indexer, exports.locator.eventBusClient);
                    exports.locator.Const = TutanotaConstants_1.Const;
                    exports.locator.share = new ShareFacade_1.ShareFacade(exports.locator.user, exports.locator.crypto, exports.locator.serviceExecutor, exports.locator.cachingEntityClient);
                    exports.locator.giftCards = new GiftCardFacade_1.GiftCardFacade(exports.locator.user, exports.locator.customer, exports.locator.serviceExecutor, exports.locator.crypto);
                    exports.locator.configFacade = new ConfigurationDatabase_1.ConfigurationDatabase(exports.locator.user);
                    exports.locator.contactFormFacade = new ContactFormFacade_1.ContactFormFacade(exports.locator.restClient, exports.locator.instanceMapper);
                    exports.locator.deviceEncryptionFacade = new DeviceEncryptionFacade_1.DeviceEncryptionFacade();
                    return [2 /*return*/];
            }
        });
    });
}
exports.initLocator = initLocator;
function resetLocator() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.locator.login.resetSession()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, initLocator(exports.locator.login.worker, exports.locator._browserData)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.resetLocator = resetLocator;
if (typeof self !== "undefined") {
    self.locator = exports.locator; // export in worker scope
}
