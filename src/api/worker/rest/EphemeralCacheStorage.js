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
exports.EphemeralCacheStorage = void 0;
var EntityRestClient_js_1 = require("./EntityRestClient.js");
var EntityUtils_js_1 = require("../../common/utils/EntityUtils.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var CustomCacheHandler_js_1 = require("./CustomCacheHandler.js");
var EphemeralCacheStorage = /** @class */ (function () {
    function EphemeralCacheStorage() {
        /** Path to id to entity map. */
        this.entities = new Map();
        this.lists = new Map();
        this.customCacheHandlerMap = new CustomCacheHandler_js_1.CustomCacheHandlerMap();
        this.lastUpdateTime = null;
        this.userId = null;
    }
    EphemeralCacheStorage.prototype.init = function (_a) {
        var userId = _a.userId;
        this.userId = userId;
    };
    EphemeralCacheStorage.prototype.deinit = function () {
        this.userId = null;
        this.entities.clear();
        this.lists.clear();
        this.lastUpdateTime = null;
    };
    /**
     * Get a given entity from the cache, expects that you have already checked for existence
     */
    EphemeralCacheStorage.prototype.get = function (typeRef, listId, id) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function () {
            var path;
            return __generator(this, function (_f) {
                path = (0, EntityRestClient_js_1.typeRefToPath)(typeRef);
                if (listId) {
                    return [2 /*return*/, (0, tutanota_utils_1.clone)((_c = (_b = (_a = this.lists.get(path)) === null || _a === void 0 ? void 0 : _a.get(listId)) === null || _b === void 0 ? void 0 : _b.elements.get(id)) !== null && _c !== void 0 ? _c : null)];
                }
                else {
                    return [2 /*return*/, (0, tutanota_utils_1.clone)((_e = (_d = this.entities.get(path)) === null || _d === void 0 ? void 0 : _d.get(id)) !== null && _e !== void 0 ? _e : null)];
                }
                return [2 /*return*/];
            });
        });
    };
    EphemeralCacheStorage.prototype.deleteIfExists = function (typeRef, listId, id) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var path, cache;
            return __generator(this, function (_c) {
                path = (0, EntityRestClient_js_1.typeRefToPath)(typeRef);
                if (listId) {
                    cache = (_a = this.lists.get(path)) === null || _a === void 0 ? void 0 : _a.get(listId);
                    if (cache != null) {
                        cache.elements["delete"](id);
                        (0, tutanota_utils_1.remove)(cache.allRange, id);
                    }
                }
                else {
                    (_b = this.entities.get(path)) === null || _b === void 0 ? void 0 : _b["delete"](id);
                }
                return [2 /*return*/];
            });
        });
    };
    EphemeralCacheStorage.prototype.addElementEntity = function (typeRef, id, entity) {
        (0, tutanota_utils_1.getFromMap)(this.entities, (0, EntityRestClient_js_1.typeRefToPath)(typeRef), function () { return new Map(); }).set(id, entity);
    };
    EphemeralCacheStorage.prototype.isElementIdInCacheRange = function (typeRef, listId, id) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var cache;
            return __generator(this, function (_b) {
                cache = (_a = this.lists.get((0, EntityRestClient_js_1.typeRefToPath)(typeRef))) === null || _a === void 0 ? void 0 : _a.get(listId);
                return [2 /*return*/, cache != null
                        && !(0, EntityUtils_js_1.firstBiggerThanSecond)(id, cache.upperRangeId)
                        && !(0, EntityUtils_js_1.firstBiggerThanSecond)(cache.lowerRangeId, id)];
            });
        });
    };
    EphemeralCacheStorage.prototype.put = function (originalEntity) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var entity, listId, elementId, typeRef, cache, newCache;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        entity = (0, tutanota_utils_1.clone)(originalEntity);
                        if (!(0, EntityUtils_js_1.isElementEntity)(entity)) return [3 /*break*/, 1];
                        this.addElementEntity(entity._type, entity._id, entity);
                        return [3 /*break*/, 4];
                    case 1:
                        listId = (0, EntityUtils_js_1.getListId)(entity);
                        elementId = (0, EntityUtils_js_1.getElementId)(entity);
                        typeRef = entity._type;
                        cache = (_a = this.lists.get((0, EntityRestClient_js_1.typeRefToPath)(typeRef))) === null || _a === void 0 ? void 0 : _a.get(listId);
                        if (!(cache == null)) return [3 /*break*/, 2];
                        newCache = {
                            allRange: [elementId],
                            lowerRangeId: elementId,
                            upperRangeId: elementId,
                            elements: new Map([[elementId, entity]])
                        };
                        (0, tutanota_utils_1.getFromMap)(this.lists, (0, EntityRestClient_js_1.typeRefToPath)(typeRef), function () { return new Map(); })
                            .set(listId, newCache);
                        return [3 /*break*/, 4];
                    case 2:
                        // if the element already exists in the cache, overwrite it
                        // add new element to existing list if necessary
                        cache.elements.set(elementId, entity);
                        return [4 /*yield*/, this.isElementIdInCacheRange(typeRef, listId, elementId)];
                    case 3:
                        if (_b.sent()) {
                            this._insertIntoRange(cache.allRange, elementId);
                        }
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    EphemeralCacheStorage.prototype._insertIntoRange = function (allRange, elementId) {
        for (var i = 0; i < allRange.length; i++) {
            var rangeElement = allRange[i];
            if ((0, EntityUtils_js_1.firstBiggerThanSecond)(rangeElement, elementId)) {
                allRange.splice(i, 0, elementId);
                return;
            }
            if (rangeElement === elementId) {
                return;
            }
        }
        allRange.push(elementId);
    };
    EphemeralCacheStorage.prototype.provideFromRange = function (typeRef, listId, start, count, reverse) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var listCache, range, ids, i, startIndex, i, result, a;
            return __generator(this, function (_b) {
                listCache = (_a = this.lists.get((0, EntityRestClient_js_1.typeRefToPath)(typeRef))) === null || _a === void 0 ? void 0 : _a.get(listId);
                if (listCache == null) {
                    return [2 /*return*/, []];
                }
                range = listCache.allRange;
                ids = [];
                if (reverse) {
                    i = void 0;
                    for (i = range.length - 1; i >= 0; i--) {
                        if ((0, EntityUtils_js_1.firstBiggerThanSecond)(start, range[i])) {
                            break;
                        }
                    }
                    if (i >= 0) {
                        startIndex = i + 1 - count;
                        if (startIndex < 0) { // start index may be negative if more elements have been requested than available when getting elements reverse.
                            startIndex = 0;
                        }
                        ids = range.slice(startIndex, i + 1);
                        ids.reverse();
                    }
                    else {
                        ids = [];
                    }
                }
                else {
                    i = range.findIndex(function (id) { return (0, EntityUtils_js_1.firstBiggerThanSecond)(id, start); });
                    ids = range.slice(i, i + count);
                }
                result = [];
                for (a = 0; a < ids.length; a++) {
                    result.push((0, tutanota_utils_1.clone)(listCache.elements.get(ids[a])));
                }
                return [2 /*return*/, result];
            });
        });
    };
    EphemeralCacheStorage.prototype.getRangeForList = function (typeRef, listId) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var listCache;
            return __generator(this, function (_b) {
                listCache = (_a = this.lists.get((0, EntityRestClient_js_1.typeRefToPath)(typeRef))) === null || _a === void 0 ? void 0 : _a.get(listId);
                if (listCache == null) {
                    return [2 /*return*/, null];
                }
                return [2 /*return*/, { lower: listCache.lowerRangeId, upper: listCache.upperRangeId }];
            });
        });
    };
    EphemeralCacheStorage.prototype.setUpperRangeForList = function (typeRef, listId, id) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var listCache;
            return __generator(this, function (_b) {
                listCache = (_a = this.lists.get((0, EntityRestClient_js_1.typeRefToPath)(typeRef))) === null || _a === void 0 ? void 0 : _a.get(listId);
                if (listCache == null) {
                    throw new Error("list does not exist");
                }
                listCache.upperRangeId = id;
                return [2 /*return*/];
            });
        });
    };
    EphemeralCacheStorage.prototype.setLowerRangeForList = function (typeRef, listId, id) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var listCache;
            return __generator(this, function (_b) {
                listCache = (_a = this.lists.get((0, EntityRestClient_js_1.typeRefToPath)(typeRef))) === null || _a === void 0 ? void 0 : _a.get(listId);
                if (listCache == null) {
                    throw new Error("list does not exist");
                }
                listCache.lowerRangeId = id;
                return [2 /*return*/];
            });
        });
    };
    /**
     * Creates a new list cache if there is none. Resets everything but elements.
     * @param typeRef
     * @param listId
     * @param lower
     * @param upper
     */
    EphemeralCacheStorage.prototype.setNewRangeForList = function (typeRef, listId, lower, upper) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var listCache;
            return __generator(this, function (_b) {
                listCache = (_a = this.lists.get((0, EntityRestClient_js_1.typeRefToPath)(typeRef))) === null || _a === void 0 ? void 0 : _a.get(listId);
                if (listCache == null) {
                    (0, tutanota_utils_1.getFromMap)(this.lists, (0, EntityRestClient_js_1.typeRefToPath)(typeRef), function () { return new Map(); }).set(listId, {
                        allRange: [],
                        lowerRangeId: lower,
                        upperRangeId: upper,
                        elements: new Map()
                    });
                }
                else {
                    listCache.lowerRangeId = lower;
                    listCache.upperRangeId = upper;
                    listCache.allRange = [];
                }
                return [2 /*return*/];
            });
        });
    };
    EphemeralCacheStorage.prototype.getIdsInRange = function (typeRef, listId) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_d) {
                return [2 /*return*/, (_c = (_b = (_a = this.lists.get((0, EntityRestClient_js_1.typeRefToPath)(typeRef))) === null || _a === void 0 ? void 0 : _a.get(listId)) === null || _b === void 0 ? void 0 : _b.allRange) !== null && _c !== void 0 ? _c : []];
            });
        });
    };
    EphemeralCacheStorage.prototype.deleteLastBatchIdForGroup = function (groupId) {
        return Promise.resolve();
    };
    EphemeralCacheStorage.prototype.getLastBatchIdForGroup = function (groupId) {
        return Promise.resolve(null);
    };
    EphemeralCacheStorage.prototype.putLastBatchIdForGroup = function (groupId, batchId) {
        return Promise.resolve();
    };
    EphemeralCacheStorage.prototype.purgeStorage = function () {
        return Promise.resolve();
    };
    EphemeralCacheStorage.prototype.getLastUpdateTime = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.lastUpdateTime ? { type: "recorded", time: this.lastUpdateTime } : { type: "never" }];
            });
        });
    };
    EphemeralCacheStorage.prototype.putLastUpdateTime = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.lastUpdateTime = value;
                return [2 /*return*/];
            });
        });
    };
    EphemeralCacheStorage.prototype.getWholeList = function (typeRef, listId) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var listCache;
            return __generator(this, function (_b) {
                listCache = (_a = this.lists.get((0, EntityRestClient_js_1.typeRefToPath)(typeRef))) === null || _a === void 0 ? void 0 : _a.get(listId);
                if (listCache == null) {
                    return [2 /*return*/, []];
                }
                return [2 /*return*/, listCache.allRange.map(function (id) { return (0, tutanota_utils_1.clone)(listCache.elements.get(id)); })];
            });
        });
    };
    EphemeralCacheStorage.prototype.getCustomCacheHandlerMap = function (entityRestClient) {
        return this.customCacheHandlerMap;
    };
    EphemeralCacheStorage.prototype.getUserId = function () {
        return (0, tutanota_utils_1.assertNotNull)(this.userId, "No user id, not initialized?");
    };
    EphemeralCacheStorage.prototype.deleteAllOwnedBy = function (owner) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, typeMap, _b, _c, _d, id, entity, _e, _f, cacheForType, listIdsToDelete, _g, _h, _j, listId, listCache, _k, _l, _m, id, element, _o, listIdsToDelete_1, listId;
            return __generator(this, function (_p) {
                for (_i = 0, _a = this.entities.values(); _i < _a.length; _i++) {
                    typeMap = _a[_i];
                    for (_b = 0, _c = typeMap.entries(); _b < _c.length; _b++) {
                        _d = _c[_b], id = _d[0], entity = _d[1];
                        if (entity._ownerGroup === owner) {
                            typeMap["delete"](id);
                        }
                    }
                }
                for (_e = 0, _f = this.lists.values(); _e < _f.length; _e++) {
                    cacheForType = _f[_e];
                    listIdsToDelete = [];
                    for (_g = 0, _h = cacheForType.entries(); _g < _h.length; _g++) {
                        _j = _h[_g], listId = _j[0], listCache = _j[1];
                        for (_k = 0, _l = listCache.elements.entries(); _k < _l.length; _k++) {
                            _m = _l[_k], id = _m[0], element = _m[1];
                            if (element._ownerGroup === owner) {
                                listIdsToDelete.push(listId);
                                break;
                            }
                        }
                    }
                    for (_o = 0, listIdsToDelete_1 = listIdsToDelete; _o < listIdsToDelete_1.length; _o++) {
                        listId = listIdsToDelete_1[_o];
                        cacheForType["delete"](listId);
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    return EphemeralCacheStorage;
}());
exports.EphemeralCacheStorage = EphemeralCacheStorage;
