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
exports.EntityClient = void 0;
var TypeRefs_js_1 = require("../entities/sys/TypeRefs.js");
var EntityUtils_1 = require("./utils/EntityUtils");
var EntityConstants_1 = require("./EntityConstants");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var EntityFunctions_1 = require("./EntityFunctions");
var tutanota_utils_2 = require("@tutao/tutanota-utils");
var EntityClient = /** @class */ (function () {
    function EntityClient(target) {
        this._target = target;
    }
    EntityClient.prototype.load = function (typeRef, id, query, extraHeaders) {
        return this._target.load(typeRef, id, query, extraHeaders);
    };
    EntityClient.prototype.loadAll = function (typeRef, listId, start) {
        return __awaiter(this, void 0, void 0, function () {
            var typeModel, elements, lastElementId, nextElements;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, EntityFunctions_1.resolveTypeReference)(typeRef)];
                    case 1:
                        typeModel = _a.sent();
                        if (!start) {
                            start = typeModel.values["_id"].type === EntityConstants_1.ValueType.GeneratedId ? EntityUtils_1.GENERATED_MIN_ID : EntityUtils_1.CUSTOM_MIN_ID;
                        }
                        return [4 /*yield*/, this.loadRange(typeRef, listId, start, EntityUtils_1.RANGE_ITEM_LIMIT, false)];
                    case 2:
                        elements = _a.sent();
                        if (!(elements.length === EntityUtils_1.RANGE_ITEM_LIMIT)) return [3 /*break*/, 4];
                        lastElementId = (0, EntityUtils_1.getLetId)(elements[elements.length - 1])[1];
                        return [4 /*yield*/, this.loadAll(typeRef, listId, lastElementId)];
                    case 3:
                        nextElements = _a.sent();
                        return [2 /*return*/, elements.concat(nextElements)];
                    case 4: return [2 /*return*/, elements];
                }
            });
        });
    };
    EntityClient.prototype.loadReverseRangeBetween = function (typeRef, listId, start, end, rangeItemLimit) {
        if (rangeItemLimit === void 0) { rangeItemLimit = EntityUtils_1.RANGE_ITEM_LIMIT; }
        return __awaiter(this, void 0, void 0, function () {
            var typeModel, loadedEntities, filteredEntities, lastElementId, _a, remainingEntities, loadedCompletely;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, EntityFunctions_1.resolveTypeReference)(typeRef)];
                    case 1:
                        typeModel = _b.sent();
                        if (typeModel.type !== EntityConstants_1.Type.ListElement)
                            throw new Error("only ListElement types are permitted");
                        return [4 /*yield*/, this._target.loadRange(typeRef, listId, start, rangeItemLimit, true)];
                    case 2:
                        loadedEntities = _b.sent();
                        filteredEntities = loadedEntities.filter(function (entity) { return (0, EntityUtils_1.firstBiggerThanSecond)((0, EntityUtils_1.getElementId)(entity), end, typeModel); });
                        if (!(filteredEntities.length === rangeItemLimit)) return [3 /*break*/, 4];
                        lastElementId = (0, EntityUtils_1.getElementId)(filteredEntities[loadedEntities.length - 1]);
                        return [4 /*yield*/, this.loadReverseRangeBetween(typeRef, listId, lastElementId, end, rangeItemLimit)];
                    case 3:
                        _a = _b.sent(), remainingEntities = _a.elements, loadedCompletely = _a.loadedCompletely;
                        return [2 /*return*/, {
                                elements: filteredEntities.concat(remainingEntities),
                                loadedCompletely: loadedCompletely
                            }];
                    case 4: return [2 /*return*/, {
                            elements: filteredEntities,
                            loadedCompletely: wasReverseRangeCompletelyLoaded(rangeItemLimit, loadedEntities, filteredEntities)
                        }];
                }
            });
        });
    };
    EntityClient.prototype.loadRange = function (typeRef, listId, start, count, reverse) {
        return this._target.loadRange(typeRef, listId, start, count, reverse);
    };
    /**
     * load multiple does not guarantee order or completeness of returned elements.
     */
    EntityClient.prototype.loadMultiple = function (typeRef, listId, elementIds) {
        return this._target.loadMultiple(typeRef, listId, elementIds);
    };
    EntityClient.prototype.setup = function (listId, instance, extraHeaders) {
        return this._target.setup(listId, instance, extraHeaders);
    };
    EntityClient.prototype.setupMultipleEntities = function (listId, instances) {
        return this._target.setupMultiple(listId, instances);
    };
    EntityClient.prototype.update = function (instance) {
        return this._target.update(instance);
    };
    EntityClient.prototype.erase = function (instance) {
        return this._target.erase(instance);
    };
    EntityClient.prototype.loadRoot = function (typeRef, groupId) {
        return __awaiter(this, void 0, void 0, function () {
            var typeModel, rootId, root;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, EntityFunctions_1.resolveTypeReference)(typeRef)];
                    case 1:
                        typeModel = _a.sent();
                        rootId = [groupId, typeModel.rootId];
                        return [4 /*yield*/, this.load(TypeRefs_js_1.RootInstanceTypeRef, rootId)];
                    case 2:
                        root = _a.sent();
                        return [2 /*return*/, this.load(typeRef, (0, tutanota_utils_2.downcast)(root.reference))]; // FIXME Passing in Id here should be allowed?
                }
            });
        });
    };
    return EntityClient;
}());
exports.EntityClient = EntityClient;
function wasReverseRangeCompletelyLoaded(rangeItemLimit, loadedEntities, filteredEntities) {
    if (loadedEntities.length < rangeItemLimit) {
        var lastLoaded = (0, tutanota_utils_1.last)(loadedEntities);
        var lastFiltered = (0, tutanota_utils_1.last)(filteredEntities);
        if (!lastLoaded) {
            return true;
        }
        return lastLoaded === lastFiltered;
    }
    return false;
}
