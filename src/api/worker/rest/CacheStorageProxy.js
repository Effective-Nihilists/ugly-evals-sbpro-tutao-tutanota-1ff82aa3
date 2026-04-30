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
exports.LateInitializedCacheStorageImpl = void 0;
var ProgrammingError_1 = require("../../common/error/ProgrammingError");
var EphemeralCacheStorage_1 = require("./EphemeralCacheStorage");
/**
 * This is necessary so that we can release offline storage mode without having to rewrite the credentials handling system. Since it's possible that
 * a desktop user might not use a persistent session, and we won't know until they try to log in, we can only decide what kind of cache storage to use at login
 * This implementation allows us to avoid modifying too much of the worker public API. Once we make this obsolete, all we will have to do is
 * remove the initialize parameter from the LoginFacade, and tidy up the WorkerLocator init
 *
 * Create a proxy to a cache storage object.
 * It will be uninitialized, and unusable until {@method CacheStorageLateInitializer.initializeCacheStorage} has been called on the returned object
 * Once it is initialized, then it is safe to use
 * @param factory A factory function to get a CacheStorage implementation when initialize is called
 * @return {CacheStorageLateInitializer} The uninitialized proxy and a function to initialize it
 */
var LateInitializedCacheStorageImpl = /** @class */ (function () {
    function LateInitializedCacheStorageImpl(worker, offlineStorageProvider) {
        this.worker = worker;
        this.offlineStorageProvider = offlineStorageProvider;
        this._inner = null;
    }
    Object.defineProperty(LateInitializedCacheStorageImpl.prototype, "inner", {
        get: function () {
            if (this._inner == null) {
                throw new ProgrammingError_1.ProgrammingError("Cache storage is not initialized");
            }
            return this._inner;
        },
        enumerable: false,
        configurable: true
    });
    LateInitializedCacheStorageImpl.prototype.initialize = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, storage, isPersistent, isNewOfflineDb;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getStorage(args)];
                    case 1:
                        _a = _b.sent(), storage = _a.storage, isPersistent = _a.isPersistent, isNewOfflineDb = _a.isNewOfflineDb;
                        this._inner = storage;
                        return [2 /*return*/, {
                                isPersistent: isPersistent,
                                isNewOfflineDb: isNewOfflineDb
                            }];
                }
            });
        });
    };
    LateInitializedCacheStorageImpl.prototype.deInitialize = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                (_a = this._inner) === null || _a === void 0 ? void 0 : _a.deinit();
                return [2 /*return*/];
            });
        });
    };
    LateInitializedCacheStorageImpl.prototype.getStorage = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var storage_1, isNewOfflineDb, e_1, storage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(args.type === "offline")) return [3 /*break*/, 6];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, this.offlineStorageProvider()];
                    case 2:
                        storage_1 = _a.sent();
                        if (!(storage_1 != null)) return [3 /*break*/, 4];
                        return [4 /*yield*/, storage_1.init(args)];
                    case 3:
                        isNewOfflineDb = _a.sent();
                        return [2 /*return*/, {
                                storage: storage_1,
                                isPersistent: true,
                                isNewOfflineDb: isNewOfflineDb
                            }];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        e_1 = _a.sent();
                        // Precaution in case something bad happens to offline database. We want users to still be able to log in.
                        console.error("Error while initializing offline cache storage", e_1);
                        this.worker.sendError(e_1);
                        return [3 /*break*/, 6];
                    case 6:
                        storage = new EphemeralCacheStorage_1.EphemeralCacheStorage();
                        return [4 /*yield*/, storage.init(args)];
                    case 7:
                        _a.sent();
                        return [2 /*return*/, {
                                storage: storage,
                                isPersistent: false,
                                isNewOfflineDb: false
                            }];
                }
            });
        });
    };
    LateInitializedCacheStorageImpl.prototype.deleteIfExists = function (typeRef, listId, id) {
        return this.inner.deleteIfExists(typeRef, listId, id);
    };
    LateInitializedCacheStorageImpl.prototype.get = function (typeRef, listId, id) {
        return this.inner.get(typeRef, listId, id);
    };
    LateInitializedCacheStorageImpl.prototype.getIdsInRange = function (typeRef, listId) {
        return this.inner.getIdsInRange(typeRef, listId);
    };
    LateInitializedCacheStorageImpl.prototype.getLastBatchIdForGroup = function (groupId) {
        return this.inner.getLastBatchIdForGroup(groupId);
    };
    LateInitializedCacheStorageImpl.prototype.getLastUpdateTime = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this._inner
                        ? this.inner.getLastUpdateTime()
                        : { type: "uninitialized" }];
            });
        });
    };
    LateInitializedCacheStorageImpl.prototype.getRangeForList = function (typeRef, listId) {
        return this.inner.getRangeForList(typeRef, listId);
    };
    LateInitializedCacheStorageImpl.prototype.isElementIdInCacheRange = function (typeRef, listId, id) {
        return this.inner.isElementIdInCacheRange(typeRef, listId, id);
    };
    LateInitializedCacheStorageImpl.prototype.provideFromRange = function (typeRef, listId, start, count, reverse) {
        return this.inner.provideFromRange(typeRef, listId, start, count, reverse);
    };
    LateInitializedCacheStorageImpl.prototype.getWholeList = function (typeRef, listId) {
        return this.inner.getWholeList(typeRef, listId);
    };
    LateInitializedCacheStorageImpl.prototype.purgeStorage = function () {
        return this.inner.purgeStorage();
    };
    LateInitializedCacheStorageImpl.prototype.put = function (originalEntity) {
        return this.inner.put(originalEntity);
    };
    LateInitializedCacheStorageImpl.prototype.putLastBatchIdForGroup = function (groupId, batchId) {
        return this.inner.putLastBatchIdForGroup(groupId, batchId);
    };
    LateInitializedCacheStorageImpl.prototype.putLastUpdateTime = function (value) {
        return this.inner.putLastUpdateTime(value);
    };
    LateInitializedCacheStorageImpl.prototype.setLowerRangeForList = function (typeRef, listId, id) {
        return this.inner.setLowerRangeForList(typeRef, listId, id);
    };
    LateInitializedCacheStorageImpl.prototype.setNewRangeForList = function (typeRef, listId, lower, upper) {
        return this.inner.setNewRangeForList(typeRef, listId, lower, upper);
    };
    LateInitializedCacheStorageImpl.prototype.setUpperRangeForList = function (typeRef, listId, id) {
        return this.inner.setUpperRangeForList(typeRef, listId, id);
    };
    LateInitializedCacheStorageImpl.prototype.getCustomCacheHandlerMap = function (entityRestClient) {
        return this.inner.getCustomCacheHandlerMap(entityRestClient);
    };
    LateInitializedCacheStorageImpl.prototype.getUserId = function () {
        return this.inner.getUserId();
    };
    LateInitializedCacheStorageImpl.prototype.deleteAllOwnedBy = function (owner) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.inner.deleteAllOwnedBy(owner)];
            });
        });
    };
    LateInitializedCacheStorageImpl.prototype.deleteLastBatchIdForGroup = function (groupId) {
        return this.inner.deleteLastBatchIdForGroup(groupId);
    };
    return LateInitializedCacheStorageImpl;
}());
exports.LateInitializedCacheStorageImpl = LateInitializedCacheStorageImpl;
