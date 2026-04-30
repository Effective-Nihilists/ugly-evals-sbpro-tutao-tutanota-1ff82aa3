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
exports.getUpdateInstanceId = exports.collapseId = exports.expandId = exports.DefaultEntityRestCache = exports.EXTEND_RANGE_MIN_CHUNK_SIZE = void 0;
var EntityFunctions_1 = require("../../common/EntityFunctions");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Utils_1 = require("../../common/utils/Utils");
var TypeRefs_js_1 = require("../../entities/sys/TypeRefs.js");
var EntityConstants_1 = require("../../common/EntityConstants");
var RestError_1 = require("../../common/error/RestError");
var TypeRefs_js_2 = require("../../entities/tutanota/TypeRefs.js");
var EntityUtils_1 = require("../../common/utils/EntityUtils");
var ProgrammingError_1 = require("../../common/error/ProgrammingError");
var Env_1 = require("../../common/Env");
var EventBusClient_1 = require("../EventBusClient");
(0, Env_1.assertWorkerOrNode)();
/**
 *
 * The minimum size of a range request when extending an existing range
 * Because we extend by making (potentially) many range requests until we reach the startId
 * We want to avoid that the requests are too small
 */
exports.EXTEND_RANGE_MIN_CHUNK_SIZE = 40;
var IGNORED_TYPES = [
    TypeRefs_js_1.EntityEventBatchTypeRef,
    TypeRefs_js_1.PermissionTypeRef,
    TypeRefs_js_1.BucketPermissionTypeRef,
    TypeRefs_js_1.SessionTypeRef,
    TypeRefs_js_1.SecondFactorTypeRef,
    TypeRefs_js_1.RecoverCodeTypeRef,
    TypeRefs_js_1.RejectedSenderTypeRef,
];
/**
 * This implementation provides a caching mechanism to the rest chain.
 * It forwards requests to the entity rest client.
 * The cache works as follows:
 * If a read from the target fails, the request fails.
 * If a read from the target is successful, the cache is written and the element returned.
 * For LETs the cache stores one range per list id. if a range is requested starting in the stored range or at the range ends the missing elements are loaded from the server.
 * Only ranges with elements with generated ids are stored in the cache. Custom id elements are only stored as single element currently. If needed this has to be extended for ranges.
 * Range requests starting outside the stored range are only allowed if the direction is away from the stored range. In this case we load from the range end to avoid gaps in the stored range.
 * Requests for creating or updating elements are always forwarded and not directly stored in the cache.
 * On EventBusClient notifications updated elements are stored in the cache if the element already exists in the cache.
 * On EventBusClient notifications new elements are only stored in the cache if they are LETs and in the stored range.
 * On EventBusClient notifications deleted elements are removed from the cache.
 *
 * Range handling:
 * |          <|>        c d e f g h i j k      <|>             |
 * MIN_ID  lowerRangeId     ids in range    upperRangeId    MAX_ID
 * lowerRangeId may be anything from MIN_ID to c, upperRangeId may be anything from k to MAX_ID
 */
var DefaultEntityRestCache = /** @class */ (function () {
    function DefaultEntityRestCache(entityRestClient, storage) {
        this.entityRestClient = entityRestClient;
        this.storage = storage;
    }
    DefaultEntityRestCache.prototype.load = function (typeRef, id, queryParameters, extraHeaders) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, listId, elementId, cachedEntity, entity;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expandId(id), listId = _a.listId, elementId = _a.elementId;
                        return [4 /*yield*/, this.storage.get(typeRef, listId, elementId)];
                    case 1:
                        cachedEntity = _b.sent();
                        if (!((queryParameters === null || queryParameters === void 0 ? void 0 : queryParameters.version) != null //if a specific version is requested we have to load again
                            || cachedEntity == null)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.entityRestClient.load(typeRef, id, queryParameters, extraHeaders)];
                    case 2:
                        entity = _b.sent();
                        if (!((queryParameters === null || queryParameters === void 0 ? void 0 : queryParameters.version) == null && !isIgnoredType(typeRef))) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.storage.put(entity)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4: return [2 /*return*/, entity];
                    case 5: return [2 /*return*/, cachedEntity];
                }
            });
        });
    };
    DefaultEntityRestCache.prototype.loadMultiple = function (typeRef, listId, elementIds) {
        if (isIgnoredType(typeRef)) {
            return this.entityRestClient.loadMultiple(typeRef, listId, elementIds);
        }
        return this._loadMultiple(typeRef, listId, elementIds);
    };
    DefaultEntityRestCache.prototype.setup = function (listId, instance, extraHeaders) {
        return this.entityRestClient.setup(listId, instance, extraHeaders);
    };
    DefaultEntityRestCache.prototype.setupMultiple = function (listId, instances) {
        return this.entityRestClient.setupMultiple(listId, instances);
    };
    DefaultEntityRestCache.prototype.update = function (instance) {
        return this.entityRestClient.update(instance);
    };
    DefaultEntityRestCache.prototype.erase = function (instance) {
        return this.entityRestClient.erase(instance);
    };
    DefaultEntityRestCache.prototype.getLastEntityEventBatchForGroup = function (groupId) {
        return this.storage.getLastBatchIdForGroup(groupId);
    };
    DefaultEntityRestCache.prototype.setLastEntityEventBatchForGroup = function (groupId, batchId) {
        return this.storage.putLastBatchIdForGroup(groupId, batchId);
    };
    DefaultEntityRestCache.prototype.purgeStorage = function () {
        console.log("Purging the user's offline database");
        return this.storage.purgeStorage();
    };
    DefaultEntityRestCache.prototype.isOutOfSync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var timeSinceLastSync;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.timeSinceLastSyncMs()];
                    case 1:
                        timeSinceLastSync = _a.sent();
                        return [2 /*return*/, timeSinceLastSync != null && timeSinceLastSync > EventBusClient_1.ENTITY_EVENT_BATCH_EXPIRE_MS];
                }
            });
        });
    };
    DefaultEntityRestCache.prototype.recordSyncTime = function () {
        return __awaiter(this, void 0, void 0, function () {
            var timestamp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        timestamp = this.getServerTimestampMs();
                        return [4 /*yield*/, this.storage.putLastUpdateTime(timestamp)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DefaultEntityRestCache.prototype.timeSinceLastSyncMs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var lastUpdate, lastUpdateTime, now;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storage.getLastUpdateTime()];
                    case 1:
                        lastUpdate = _a.sent();
                        switch (lastUpdate.type) {
                            case "recorded":
                                lastUpdateTime = lastUpdate.time;
                                break;
                            case "never":
                                return [2 /*return*/, null];
                            case "uninitialized":
                                throw new ProgrammingError_1.ProgrammingError("Offline storage is not initialized");
                        }
                        now = this.getServerTimestampMs();
                        return [2 /*return*/, now - lastUpdateTime];
                }
            });
        });
    };
    DefaultEntityRestCache.prototype.getServerTimestampMs = function () {
        return this.entityRestClient.getRestClient().getServerTimestampMs();
    };
    /**
     * Delete a cached entity. Sometimes this is necessary to do to ensure you always load the new version
     */
    DefaultEntityRestCache.prototype.deleteFromCacheIfExists = function (typeRef, listId, elementId) {
        return this.storage.deleteIfExists(typeRef, listId, elementId);
    };
    DefaultEntityRestCache.prototype._loadMultiple = function (typeRef, listId, ids) {
        return __awaiter(this, void 0, void 0, function () {
            var entitiesInCache, idsToLoad, _i, ids_1, id, items, entitiesFromServer, entities, _a, entities_1, entity;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        entitiesInCache = [];
                        idsToLoad = [];
                        _i = 0, ids_1 = ids;
                        _b.label = 1;
                    case 1:
                        if (!(_i < ids_1.length)) return [3 /*break*/, 4];
                        id = ids_1[_i];
                        return [4 /*yield*/, this.storage.get(typeRef, listId, id)];
                    case 2:
                        items = _b.sent();
                        if (items != null) {
                            entitiesInCache.push(items);
                        }
                        else {
                            idsToLoad.push(id);
                        }
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        entitiesFromServer = [];
                        if (!(idsToLoad.length > 0)) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.entityRestClient.loadMultiple(typeRef, listId, idsToLoad)];
                    case 5:
                        entities = _b.sent();
                        _a = 0, entities_1 = entities;
                        _b.label = 6;
                    case 6:
                        if (!(_a < entities_1.length)) return [3 /*break*/, 9];
                        entity = entities_1[_a];
                        return [4 /*yield*/, this.storage.put(entity)];
                    case 7:
                        _b.sent();
                        entitiesFromServer.push(entity);
                        _b.label = 8;
                    case 8:
                        _a++;
                        return [3 /*break*/, 6];
                    case 9: return [2 /*return*/, entitiesFromServer.concat(entitiesInCache)];
                }
            });
        });
    };
    DefaultEntityRestCache.prototype.loadRange = function (typeRef, listId, start, count, reverse) {
        return __awaiter(this, void 0, void 0, function () {
            var typeModel, range;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.storage.getCustomCacheHandlerMap(this.entityRestClient).has(typeRef)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.storage.getCustomCacheHandlerMap(this.entityRestClient).get(typeRef).loadRange(this.storage, listId, start, count, reverse)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, (0, EntityFunctions_1.resolveTypeReference)(typeRef)];
                    case 3:
                        typeModel = _a.sent();
                        if (!isCachedType(typeModel, typeRef)) {
                            return [2 /*return*/, this.entityRestClient.loadRange(typeRef, listId, start, count, reverse)];
                        }
                        return [4 /*yield*/, this.storage.getRangeForList(typeRef, listId)];
                    case 4:
                        range = _a.sent();
                        if (!(range == null)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.populateNewListWithRange(typeRef, listId, start, count, reverse)];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 12];
                    case 6:
                        if (!isStartIdWithinRange(range, start)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.extendFromWithinRange(typeRef, listId, start, count, reverse)];
                    case 7:
                        _a.sent();
                        return [3 /*break*/, 12];
                    case 8:
                        if (!isRangeRequestAwayFromExistingRange(range, reverse, start)) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.extendAwayFromRange(typeRef, listId, start, count, reverse)];
                    case 9:
                        _a.sent();
                        return [3 /*break*/, 12];
                    case 10: return [4 /*yield*/, this.extendTowardsRange(typeRef, listId, start, count, reverse)];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12: return [2 /*return*/, this.storage.provideFromRange(typeRef, listId, start, count, reverse)];
                }
            });
        });
    };
    /**
     * Creates a new list range, reading everything from the server that it can
     * range:         (none)
     * request:       *--------->
     * range becomes: |---------|
     * @private
     */
    DefaultEntityRestCache.prototype.populateNewListWithRange = function (typeRef, listId, start, count, reverse) {
        return __awaiter(this, void 0, void 0, function () {
            var entities;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.entityRestClient.loadRange(typeRef, listId, start, count, reverse)
                        // Initialize a new range for this list
                    ];
                    case 1:
                        entities = _a.sent();
                        // Initialize a new range for this list
                        return [4 /*yield*/, this.storage.setNewRangeForList(typeRef, listId, start, start)
                            // The range bounds will be updated in here
                        ];
                    case 2:
                        // Initialize a new range for this list
                        _a.sent();
                        // The range bounds will be updated in here
                        return [4 /*yield*/, this.updateRangeInStorage(typeRef, listId, count, reverse, entities)];
                    case 3:
                        // The range bounds will be updated in here
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns part of a request from the cache, and the remainder is loaded from the server
     * range:          |---------|
     * request:             *-------------->
     * range becomes: |--------------------|
     */
    DefaultEntityRestCache.prototype.extendFromWithinRange = function (typeRef, listId, start, count, reverse) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, newStart, newCount, entities;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.recalculateRangeRequest(typeRef, listId, start, count, reverse)];
                    case 1:
                        _a = _b.sent(), newStart = _a.newStart, newCount = _a.newCount;
                        if (!(newCount > 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.entityRestClient.loadRange(typeRef, listId, newStart, newCount, reverse)];
                    case 2:
                        entities = _b.sent();
                        return [4 /*yield*/, this.updateRangeInStorage(typeRef, listId, newCount, reverse, entities)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Start was outside the range, and we are loading away from the range
     * Keeps loading elements from the end of the range in the direction of the startId.
     * Returns once all available elements have been loaded or the requested number is in cache
     * range:          |---------|
     * request:                     *------->
     * range becomes:  |--------------------|
     */
    DefaultEntityRestCache.prototype.extendAwayFromRange = function (typeRef, listId, start, count, reverse) {
        return __awaiter(this, void 0, void 0, function () {
            var range, _a, loadStartId, requestCount, entities, entitiesFromCache;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!true) return [3 /*break*/, 5];
                        _a = tutanota_utils_1.assertNotNull;
                        return [4 /*yield*/, this.storage.getRangeForList(typeRef, listId)];
                    case 1:
                        range = _a.apply(void 0, [_b.sent()]);
                        loadStartId = reverse
                            ? range.lower
                            : range.upper;
                        requestCount = Math.max(count, exports.EXTEND_RANGE_MIN_CHUNK_SIZE);
                        return [4 /*yield*/, this.entityRestClient.loadRange(typeRef, listId, loadStartId, requestCount, reverse)];
                    case 2:
                        entities = _b.sent();
                        return [4 /*yield*/, this.updateRangeInStorage(typeRef, listId, requestCount, reverse, entities)
                            // If we exhausted the entities from the server
                        ];
                    case 3:
                        _b.sent();
                        // If we exhausted the entities from the server
                        if (entities.length < requestCount) {
                            return [3 /*break*/, 5];
                        }
                        return [4 /*yield*/, this.storage.provideFromRange(typeRef, listId, start, count, reverse)
                            // If cache is now capable of providing the whole request
                        ];
                    case 4:
                        entitiesFromCache = _b.sent();
                        // If cache is now capable of providing the whole request
                        if (entitiesFromCache.length === count) {
                            return [3 /*break*/, 5];
                        }
                        return [3 /*break*/, 0];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Loads all elements from the startId in the direction of the range
     * Once complete, returns as many elements as it can from the original request
     * range:         |---------|
     * request:                     <------*
     * range becomes: |--------------------|
     * or
     * range:              |---------|
     * request:       <-------------------*
     * range becomes: |--------------------|
     */
    DefaultEntityRestCache.prototype.extendTowardsRange = function (typeRef, listId, start, count, reverse) {
        return __awaiter(this, void 0, void 0, function () {
            var range, _a, loadStartId, requestCount, entities;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!true) return [3 /*break*/, 5];
                        _a = tutanota_utils_1.assertNotNull;
                        return [4 /*yield*/, this.storage.getRangeForList(typeRef, listId)];
                    case 1:
                        range = _a.apply(void 0, [_b.sent()]);
                        loadStartId = reverse
                            ? range.upper
                            : range.lower;
                        requestCount = Math.max(count, exports.EXTEND_RANGE_MIN_CHUNK_SIZE);
                        return [4 /*yield*/, this.entityRestClient.loadRange(typeRef, listId, loadStartId, requestCount, !reverse)];
                    case 2:
                        entities = _b.sent();
                        return [4 /*yield*/, this.updateRangeInStorage(typeRef, listId, requestCount, !reverse, entities)
                            // The call to `updateRangeInStorage` will have set the range bounds to GENERATED_MIN_ID/GENERATED_MAX_ID
                            // in the case that we have exhausted all elements from the server, so if that happens, we will also end up breaking here
                        ];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, this.storage.isElementIdInCacheRange(typeRef, listId, start)];
                    case 4:
                        // The call to `updateRangeInStorage` will have set the range bounds to GENERATED_MIN_ID/GENERATED_MAX_ID
                        // in the case that we have exhausted all elements from the server, so if that happens, we will also end up breaking here
                        if (_b.sent()) {
                            return [3 /*break*/, 5];
                        }
                        return [3 /*break*/, 0];
                    case 5: return [4 /*yield*/, this.extendFromWithinRange(typeRef, listId, start, count, reverse)];
                    case 6:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Given the parameters and result of a range request,
     * Inserts the result into storage, and updates the range bounds
     * based on number of entities requested and the actual amount that were received
     */
    DefaultEntityRestCache.prototype.updateRangeInStorage = function (typeRef, listId, countRequested, wasReverseRequest, receivedEntities) {
        return __awaiter(this, void 0, void 0, function () {
            var elementsToAdd;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        elementsToAdd = receivedEntities;
                        if (!wasReverseRequest) return [3 /*break*/, 5];
                        // Ensure that elements are cached in ascending (not reverse) order
                        elementsToAdd = receivedEntities.reverse();
                        if (!(receivedEntities.length < countRequested)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.storage.setLowerRangeForList(typeRef, listId, EntityUtils_1.GENERATED_MIN_ID)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: 
                    // After reversing the list the first element in the list is the lower range limit
                    return [4 /*yield*/, this.storage.setLowerRangeForList(typeRef, listId, (0, EntityUtils_1.getElementId)((0, tutanota_utils_1.firstThrow)(receivedEntities)))];
                    case 3:
                        // After reversing the list the first element in the list is the lower range limit
                        _a.sent();
                        _a.label = 4;
                    case 4: return [3 /*break*/, 9];
                    case 5:
                        if (!(receivedEntities.length < countRequested)) return [3 /*break*/, 7];
                        // all elements have been loaded, so the upper range must be set to MAX_ID
                        return [4 /*yield*/, this.storage.setUpperRangeForList(typeRef, listId, EntityUtils_1.GENERATED_MAX_ID)];
                    case 6:
                        // all elements have been loaded, so the upper range must be set to MAX_ID
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 7: return [4 /*yield*/, this.storage.setUpperRangeForList(typeRef, listId, (0, EntityUtils_1.getElementId)((0, tutanota_utils_1.lastThrow)(receivedEntities)))];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9: return [4 /*yield*/, Promise.all(elementsToAdd.map(function (element) { return _this.storage.put(element); }))];
                    case 10:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Calculates the new start value for the getElementRange request and the number of elements to read in
     * order to read no duplicate values.
     * @return returns the new start and count value.
     */
    DefaultEntityRestCache.prototype.recalculateRangeRequest = function (typeRef, listId, start, count, reverse) {
        return __awaiter(this, void 0, void 0, function () {
            var allRangeList, elementsToRead, startElementId, range, lower, upper, indexOfStart;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storage.getIdsInRange(typeRef, listId)];
                    case 1:
                        allRangeList = _a.sent();
                        elementsToRead = count;
                        startElementId = start;
                        return [4 /*yield*/, this.storage.getRangeForList(typeRef, listId)];
                    case 2:
                        range = _a.sent();
                        if (range == null) {
                            return [2 /*return*/, { newStart: start, newCount: count }];
                        }
                        lower = range.lower, upper = range.upper;
                        indexOfStart = allRangeList.indexOf(start);
                        if ((!reverse && upper === EntityUtils_1.GENERATED_MAX_ID) || (reverse && lower === EntityUtils_1.GENERATED_MIN_ID)) {
                            // we have already loaded the complete range in the desired direction, so we do not have to load from server
                            elementsToRead = 0;
                        }
                        else if (allRangeList.length === 0) { // Element range is empty, so read all elements
                            elementsToRead = count;
                        }
                        else if (indexOfStart !== -1) { // Start element is located in allRange read only elements that are not in allRange.
                            if (reverse) {
                                elementsToRead = count - indexOfStart;
                                startElementId = allRangeList[0]; // use the lowest id in allRange as start element
                            }
                            else {
                                elementsToRead = count - (allRangeList.length - 1 - indexOfStart);
                                startElementId = allRangeList[allRangeList.length - 1]; // use the  highest id in allRange as start element
                            }
                        }
                        else if (lower === start
                            || ((0, EntityUtils_1.firstBiggerThanSecond)(start, lower) && ((0, EntityUtils_1.firstBiggerThanSecond)(allRangeList[0], start)))) { // Start element is not in allRange but has been used has start element for a range request, eg. EntityRestInterface.GENERATED_MIN_ID, or start is between lower range id and lowest element in range
                            if (!reverse) { // if not reverse read only elements that are not in allRange
                                startElementId = allRangeList[allRangeList.length - 1]; // use the  highest id in allRange as start element
                                elementsToRead = count - allRangeList.length;
                            }
                            // if reverse read all elements
                        }
                        else if (upper === start
                            || ((0, EntityUtils_1.firstBiggerThanSecond)(start, allRangeList[allRangeList.length - 1])
                                && ((0, EntityUtils_1.firstBiggerThanSecond)(upper, start)))) { // Start element is not in allRange but has been used has start element for a range request, eg. EntityRestInterface.GENERATED_MAX_ID, or start is between upper range id and highest element in range
                            if (reverse) { // if not reverse read only elements that are not in allRange
                                startElementId = allRangeList[0]; // use the  highest id in allRange as start element
                                elementsToRead = count - allRangeList.length;
                            }
                            // if not reverse read all elements
                        }
                        return [2 /*return*/, { newStart: startElementId, newCount: elementsToRead }];
                }
            });
        });
    };
    /**
     * Resolves when the entity is loaded from the server if necessary
     * @pre The last call of this function must be resolved. This is needed to avoid that e.g. while
     * loading a created instance from the server we receive an update of that instance and ignore it because the instance is not in the cache yet.
     *
     * @return Promise, which resolves to the array of valid events (if response is NotFound or NotAuthorized we filter it out)
     */
    DefaultEntityRestCache.prototype.entityEventsReceived = function (batch) {
        return __awaiter(this, void 0, void 0, function () {
            var createUpdatesForLETs, regularUpdates, updatesArray, _i, updatesArray_1, update, createUpdatesForLETsPerList, postMultipleEventUpdates, _loop_1, this_1, _a, createUpdatesForLETsPerList_1, _b, instanceListId, updates, otherEventUpdates, _c, regularUpdates_1, update, operation, type, application, _d, instanceListId, instanceId, typeRef, _e, handledUpdate, handledUpdate;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, this.recordSyncTime()
                        // we handle post multiple create operations separately to optimize the number of requests with getMultiple
                    ];
                    case 1:
                        _f.sent();
                        createUpdatesForLETs = [];
                        regularUpdates = [] // all updates not resulting from post multiple requests
                        ;
                        updatesArray = batch.events;
                        for (_i = 0, updatesArray_1 = updatesArray; _i < updatesArray_1.length; _i++) {
                            update = updatesArray_1[_i];
                            if (update.application !== "monitor") {
                                // monitor application is ignored
                                // mails are ignored because move operations are handled as a special event (and no post multiple is possible)
                                if (update.operation === "0" /* OperationType.CREATE */ &&
                                    getUpdateInstanceId(update).instanceListId != null &&
                                    !(0, tutanota_utils_1.isSameTypeRef)(new tutanota_utils_1.TypeRef(update.application, update.type), TypeRefs_js_2.MailTypeRef)) {
                                    createUpdatesForLETs.push(update);
                                }
                                else {
                                    regularUpdates.push(update);
                                }
                            }
                        }
                        createUpdatesForLETsPerList = (0, tutanota_utils_1.groupBy)(createUpdatesForLETs, function (update) { return update.instanceListId; });
                        postMultipleEventUpdates = [];
                        _loop_1 = function (instanceListId, updates) {
                            var firstUpdate, typeRef, ids, customHandlers, idsInCacheRange, _g, updatesNotInCacheRange, returnedInstances, returnedIds_1, e_1;
                            return __generator(this, function (_h) {
                                switch (_h.label) {
                                    case 0:
                                        firstUpdate = updates[0];
                                        typeRef = new tutanota_utils_1.TypeRef(firstUpdate.application, firstUpdate.type);
                                        ids = updates.map(function (update) { return update.instanceId; });
                                        customHandlers = this_1.storage.getCustomCacheHandlerMap(this_1.entityRestClient);
                                        if (!customHandlers.has(typeRef)) return [3 /*break*/, 2];
                                        return [4 /*yield*/, customHandlers.get(typeRef).getElementIdsInCacheRange(this_1.storage, instanceListId, ids)];
                                    case 1:
                                        _g = _h.sent();
                                        return [3 /*break*/, 4];
                                    case 2: return [4 /*yield*/, this_1.getElementIdsInCacheRange(typeRef, instanceListId, ids)];
                                    case 3:
                                        _g = _h.sent();
                                        _h.label = 4;
                                    case 4:
                                        idsInCacheRange = _g;
                                        if (!(idsInCacheRange.length === 0)) return [3 /*break*/, 5];
                                        postMultipleEventUpdates.push(updates);
                                        return [3 /*break*/, 9];
                                    case 5:
                                        updatesNotInCacheRange = idsInCacheRange.length === updates.length
                                            ? []
                                            : updates.filter(function (update) { return !idsInCacheRange.includes(update.instanceId); });
                                        _h.label = 6;
                                    case 6:
                                        _h.trys.push([6, 8, , 9]);
                                        return [4 /*yield*/, this_1._loadMultiple(typeRef, instanceListId, idsInCacheRange)
                                            //We do not want to pass updates that caused an error
                                        ];
                                    case 7:
                                        returnedInstances = _h.sent();
                                        //We do not want to pass updates that caused an error
                                        if (returnedInstances.length !== idsInCacheRange.length) {
                                            returnedIds_1 = returnedInstances.map(function (instance) { return (0, EntityUtils_1.getElementId)(instance); });
                                            postMultipleEventUpdates.push(updates.filter(function (update) { return returnedIds_1.includes(update.instanceId); }).concat(updatesNotInCacheRange));
                                        }
                                        else {
                                            postMultipleEventUpdates.push(updates);
                                        }
                                        return [3 /*break*/, 9];
                                    case 8:
                                        e_1 = _h.sent();
                                        if (e_1 instanceof RestError_1.NotAuthorizedError) {
                                            // return updates that are not in cache Range if NotAuthorizedError (for those updates that are in cache range)
                                            postMultipleEventUpdates.push(updatesNotInCacheRange);
                                        }
                                        else {
                                            throw e_1;
                                        }
                                        return [3 /*break*/, 9];
                                    case 9: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _a = 0, createUpdatesForLETsPerList_1 = createUpdatesForLETsPerList;
                        _f.label = 2;
                    case 2:
                        if (!(_a < createUpdatesForLETsPerList_1.length)) return [3 /*break*/, 5];
                        _b = createUpdatesForLETsPerList_1[_a], instanceListId = _b[0], updates = _b[1];
                        return [5 /*yield**/, _loop_1(instanceListId, updates)];
                    case 3:
                        _f.sent();
                        _f.label = 4;
                    case 4:
                        _a++;
                        return [3 /*break*/, 2];
                    case 5:
                        otherEventUpdates = [];
                        _c = 0, regularUpdates_1 = regularUpdates;
                        _f.label = 6;
                    case 6:
                        if (!(_c < regularUpdates_1.length)) return [3 /*break*/, 17];
                        update = regularUpdates_1[_c];
                        operation = update.operation, type = update.type, application = update.application;
                        _d = getUpdateInstanceId(update), instanceListId = _d.instanceListId, instanceId = _d.instanceId;
                        typeRef = new tutanota_utils_1.TypeRef(application, type);
                        _e = operation;
                        switch (_e) {
                            case "1" /* OperationType.UPDATE */: return [3 /*break*/, 7];
                            case "2" /* OperationType.DELETE */: return [3 /*break*/, 9];
                            case "0" /* OperationType.CREATE */: return [3 /*break*/, 13];
                        }
                        return [3 /*break*/, 15];
                    case 7: return [4 /*yield*/, this.processUpdateEvent(typeRef, update)];
                    case 8:
                        handledUpdate = _f.sent();
                        if (handledUpdate) {
                            otherEventUpdates.push(handledUpdate);
                        }
                        return [3 /*break*/, 16];
                    case 9:
                        if (!((0, tutanota_utils_1.isSameTypeRef)(TypeRefs_js_2.MailTypeRef, typeRef) && (0, Utils_1.containsEventOfType)(updatesArray, "0" /* OperationType.CREATE */, instanceId))) return [3 /*break*/, 10];
                        return [3 /*break*/, 12];
                    case 10: return [4 /*yield*/, this.storage.deleteIfExists(typeRef, instanceListId, instanceId)];
                    case 11:
                        _f.sent();
                        _f.label = 12;
                    case 12:
                        otherEventUpdates.push(update);
                        return [3 /*break*/, 16];
                    case 13: return [4 /*yield*/, this.processCreateEvent(typeRef, update, updatesArray)];
                    case 14:
                        handledUpdate = _f.sent();
                        if (handledUpdate) {
                            otherEventUpdates.push(handledUpdate);
                        }
                        return [3 /*break*/, 16];
                    case 15: throw new ProgrammingError_1.ProgrammingError("Unknown operation type: " + operation);
                    case 16:
                        _c++;
                        return [3 /*break*/, 6];
                    case 17: 
                    // the whole batch has been written successfully
                    return [4 /*yield*/, this.storage.putLastBatchIdForGroup(batch.groupId, batch.batchId)
                        // merge the results
                    ];
                    case 18:
                        // the whole batch has been written successfully
                        _f.sent();
                        // merge the results
                        return [2 /*return*/, otherEventUpdates.concat((0, tutanota_utils_1.flat)(postMultipleEventUpdates))];
                }
            });
        });
    };
    DefaultEntityRestCache.prototype.processCreateEvent = function (typeRef, update, batch) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, instanceId, instanceListId, deleteEvent, element, _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = getUpdateInstanceId(update), instanceId = _a.instanceId, instanceListId = _a.instanceListId;
                        if (!(instanceListId != null)) return [3 /*break*/, 9];
                        deleteEvent = (0, Utils_1.getEventOfType)(batch, "2" /* OperationType.DELETE */, instanceId);
                        if (!(deleteEvent && (0, tutanota_utils_1.isSameTypeRef)(TypeRefs_js_2.MailTypeRef, typeRef))) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.storage.get(typeRef, deleteEvent.instanceListId, instanceId)];
                    case 1:
                        _b = _c.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _b = null;
                        _c.label = 3;
                    case 3:
                        element = _b;
                        if (!(deleteEvent != null && element != null)) return [3 /*break*/, 6];
                        // It is a move event for cached mail
                        return [4 /*yield*/, this.storage.deleteIfExists(typeRef, deleteEvent.instanceListId, instanceId)];
                    case 4:
                        // It is a move event for cached mail
                        _c.sent();
                        element._id = [instanceListId, instanceId];
                        return [4 /*yield*/, this.storage.put(element)];
                    case 5:
                        _c.sent();
                        return [2 /*return*/, update];
                    case 6: return [4 /*yield*/, this.storage.isElementIdInCacheRange(typeRef, instanceListId, instanceId)];
                    case 7:
                        if (_c.sent()) {
                            // No need to try to download something that's not there anymore
                            // We do not consult custom handlers here because they are only needed for list elements.
                            return [2 /*return*/, this.entityRestClient.load(typeRef, [instanceListId, instanceId])
                                    .then(function (entity) { return _this.storage.put(entity); })
                                    .then(function () { return update; })["catch"](function (e) { return _this._handleProcessingError(e); })];
                        }
                        else {
                            return [2 /*return*/, update];
                        }
                        _c.label = 8;
                    case 8: return [3 /*break*/, 10];
                    case 9: return [2 /*return*/, update];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    DefaultEntityRestCache.prototype.processUpdateEvent = function (typeRef, update) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, instanceId, instanceListId, cached, newEntity, e_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = getUpdateInstanceId(update), instanceId = _a.instanceId, instanceListId = _a.instanceListId;
                        return [4 /*yield*/, this.storage.get(typeRef, instanceListId, instanceId)];
                    case 1:
                        cached = (_b.sent());
                        if (!(cached != null)) return [3 /*break*/, 8];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 7, , 8]);
                        return [4 /*yield*/, this.entityRestClient.load(typeRef, collapseId(instanceListId, instanceId))];
                    case 3:
                        newEntity = _b.sent();
                        if (!(0, tutanota_utils_1.isSameTypeRef)(typeRef, TypeRefs_js_1.UserTypeRef)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.handleUpdatedUser(cached, newEntity)];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5: return [4 /*yield*/, this.storage.put(newEntity)];
                    case 6:
                        _b.sent();
                        return [2 /*return*/, update];
                    case 7:
                        e_2 = _b.sent();
                        return [2 /*return*/, this._handleProcessingError(e_2)];
                    case 8: return [2 /*return*/, update];
                }
            });
        });
    };
    DefaultEntityRestCache.prototype.handleUpdatedUser = function (cached, newEntity) {
        return __awaiter(this, void 0, void 0, function () {
            var oldUser, newUser, removedShips, _i, removedShips_1, ship;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        oldUser = cached;
                        if (oldUser._id !== this.storage.getUserId()) {
                            return [2 /*return*/];
                        }
                        newUser = newEntity;
                        removedShips = (0, tutanota_utils_1.difference)(oldUser.memberships, newUser.memberships, function (l, r) { return l._id === r._id; });
                        _i = 0, removedShips_1 = removedShips;
                        _a.label = 1;
                    case 1:
                        if (!(_i < removedShips_1.length)) return [3 /*break*/, 5];
                        ship = removedShips_1[_i];
                        console.log("Lost membership on ", ship._id, ship.groupType);
                        return [4 /*yield*/, this.storage.deleteAllOwnedBy(ship.group)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.storage.deleteLastBatchIdForGroup(ship.group)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @returns {null} to avoid implicit returns where it is called
     */
    DefaultEntityRestCache.prototype._handleProcessingError = function (e) {
        if (e instanceof RestError_1.NotFoundError || e instanceof RestError_1.NotAuthorizedError) {
            return null;
        }
        else {
            throw e;
        }
    };
    /**
     *
     * @returns {Array<Id>} the ids that are in cache range and therefore should be cached
     */
    DefaultEntityRestCache.prototype.getElementIdsInCacheRange = function (typeRef, listId, ids) {
        return __awaiter(this, void 0, void 0, function () {
            var ret, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ret = [];
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < ids.length)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.storage.isElementIdInCacheRange(typeRef, listId, ids[i])];
                    case 2:
                        if (_a.sent()) {
                            ret.push(ids[i]);
                        }
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, ret];
                }
            });
        });
    };
    return DefaultEntityRestCache;
}());
exports.DefaultEntityRestCache = DefaultEntityRestCache;
function expandId(id) {
    if (typeof id === "string") {
        return {
            listId: null,
            elementId: id
        };
    }
    else {
        var listId = id[0], elementId = id[1];
        return {
            listId: listId,
            elementId: elementId
        };
    }
}
exports.expandId = expandId;
function collapseId(listId, elementId) {
    if (listId != null) {
        return [listId, elementId];
    }
    else {
        return elementId;
    }
}
exports.collapseId = collapseId;
function getUpdateInstanceId(update) {
    var instanceListId;
    if (update.instanceListId === "") {
        instanceListId = null;
    }
    else {
        instanceListId = update.instanceListId;
    }
    return { instanceListId: instanceListId, instanceId: update.instanceId };
}
exports.getUpdateInstanceId = getUpdateInstanceId;
/**
 * Check if a range request begins inside of an existing range
 */
function isStartIdWithinRange(range, startId) {
    return !(0, EntityUtils_1.firstBiggerThanSecond)(startId, range.upper) && !(0, EntityUtils_1.firstBiggerThanSecond)(range.lower, startId);
}
/**
 * Check if a range request is going away from an existing range
 * Assumes that the range request doesn't start inside the range
 */
function isRangeRequestAwayFromExistingRange(range, reverse, start) {
    return reverse
        ? (0, EntityUtils_1.firstBiggerThanSecond)(range.lower, start)
        : (0, EntityUtils_1.firstBiggerThanSecond)(start, range.upper);
}
/**
 * some types are completely ignored by the cache and always served from a request.
 * Note:
 * isCachedType(ref) ---> !isIgnoredType(ref) but
 * isIgnoredType(ref) -/-> !isCachedType(ref) because of opted-in CustomId types.
 */
function isIgnoredType(typeRef) {
    return typeRef.app === "monitor" || IGNORED_TYPES.some(function (ref) { return (0, tutanota_utils_1.isSameTypeRef)(typeRef, ref); });
}
/**
 * customId types are normally not cached, but some are opted in.
 * Note:
 * isCachedType(ref) ---> !isIgnoredType(ref) but
 * isIgnoredType(ref) -/-> !isCachedType(ref)
 */
function isCachedType(typeModel, typeRef) {
    return !isIgnoredType(typeRef) && typeModel.values._id.type === EntityConstants_1.ValueType.GeneratedId;
}
