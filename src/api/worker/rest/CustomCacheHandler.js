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
exports.CustomCalendarEventCacheHandler = exports.CustomCacheHandlerMap = void 0;
var TypeRefs_js_1 = require("../../entities/tutanota/TypeRefs.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var EntityUtils_js_1 = require("../../common/utils/EntityUtils.js");
var EntityFunctions_js_1 = require("../../common/EntityFunctions.js");
var ProgrammingError_js_1 = require("../../common/error/ProgrammingError.js");
/**
 * wrapper for a TypeRef -> CustomCacheHandler map that's needed because we can't
 * use TypeRefs directly as map keys due to object identity not matching.
 *
 * it is mostly read-only
 */
var CustomCacheHandlerMap = /** @class */ (function () {
    function CustomCacheHandlerMap() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.handlers = new Map();
        for (var _a = 0, args_1 = args; _a < args_1.length; _a++) {
            var _b = args_1[_a], ref = _b.ref, handler = _b.handler;
            var key = (0, tutanota_utils_1.getTypeId)(ref);
            this.handlers.set(key, handler);
        }
        this.handlers = (0, tutanota_utils_1.freezeMap)(this.handlers);
    }
    CustomCacheHandlerMap.prototype.get = function (typeRef) {
        var typeId = (0, tutanota_utils_1.getTypeId)(typeRef);
        // map is frozen after the constructor. constructor arg types are set up to uphold this invariant.
        return this.handlers.get(typeId);
    };
    CustomCacheHandlerMap.prototype.has = function (typeRef) {
        var typeId = (0, tutanota_utils_1.getTypeId)(typeRef);
        return this.handlers.has(typeId);
    };
    return CustomCacheHandlerMap;
}());
exports.CustomCacheHandlerMap = CustomCacheHandlerMap;
/**
 * implements range loading in JS because the custom Ids of calendar events prevent us from doing
 * this effectively in the database.
 */
var CustomCalendarEventCacheHandler = /** @class */ (function () {
    function CustomCalendarEventCacheHandler(entityRestClient) {
        this.entityRestClient = entityRestClient;
    }
    CustomCalendarEventCacheHandler.prototype.loadRange = function (storage, listId, start, count, reverse) {
        return __awaiter(this, void 0, void 0, function () {
            var range, rawList, chunk, currentMin, _i, rawList_1, event_1, typeModel, sortedList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, storage.getRangeForList(TypeRefs_js_1.CalendarEventTypeRef, listId)
                        //if offline db for this list is empty load from server
                    ];
                    case 1:
                        range = _a.sent();
                        rawList = [];
                        if (!(range == null)) return [3 /*break*/, 10];
                        chunk = [];
                        currentMin = EntityUtils_js_1.CUSTOM_MIN_ID;
                        _a.label = 2;
                    case 2:
                        if (!true) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.entityRestClient.loadRange(TypeRefs_js_1.CalendarEventTypeRef, listId, currentMin, EntityUtils_js_1.LOAD_MULTIPLE_LIMIT, false)];
                    case 3:
                        chunk = _a.sent();
                        rawList.push.apply(rawList, chunk);
                        if (chunk.length < EntityUtils_js_1.LOAD_MULTIPLE_LIMIT)
                            return [3 /*break*/, 4];
                        currentMin = (0, EntityUtils_js_1.getElementId)(chunk[chunk.length - 1]);
                        return [3 /*break*/, 2];
                    case 4:
                        _i = 0, rawList_1 = rawList;
                        _a.label = 5;
                    case 5:
                        if (!(_i < rawList_1.length)) return [3 /*break*/, 8];
                        event_1 = rawList_1[_i];
                        return [4 /*yield*/, storage.put(event_1)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 5];
                    case 8: 
                    // we have all events now
                    return [4 /*yield*/, storage.setNewRangeForList(TypeRefs_js_1.CalendarEventTypeRef, listId, EntityUtils_js_1.CUSTOM_MIN_ID, EntityUtils_js_1.CUSTOM_MAX_ID)];
                    case 9:
                        // we have all events now
                        _a.sent();
                        return [3 /*break*/, 12];
                    case 10:
                        this.assertCorrectRange(range);
                        return [4 /*yield*/, storage.getWholeList(TypeRefs_js_1.CalendarEventTypeRef, listId)];
                    case 11:
                        rawList = _a.sent();
                        console.log("CalendarEvent list ".concat(listId, " has ").concat(rawList.length, " events"));
                        _a.label = 12;
                    case 12: return [4 /*yield*/, (0, EntityFunctions_js_1.resolveTypeReference)(TypeRefs_js_1.CalendarEventTypeRef)];
                    case 13:
                        typeModel = _a.sent();
                        sortedList = reverse
                            ? rawList
                                .filter(function (calendarEvent) { return (0, EntityUtils_js_1.firstBiggerThanSecond)(start, (0, EntityUtils_js_1.getElementId)(calendarEvent), typeModel); })
                                .sort(function (a, b) { return (0, EntityUtils_js_1.firstBiggerThanSecond)((0, EntityUtils_js_1.getElementId)(b), (0, EntityUtils_js_1.getElementId)(a), typeModel) ? 1 : -1; })
                            : rawList
                                .filter(function (calendarEvent) { return (0, EntityUtils_js_1.firstBiggerThanSecond)((0, EntityUtils_js_1.getElementId)(calendarEvent), start, typeModel); })
                                .sort(function (a, b) { return (0, EntityUtils_js_1.firstBiggerThanSecond)((0, EntityUtils_js_1.getElementId)(a), (0, EntityUtils_js_1.getElementId)(b), typeModel) ? 1 : -1; });
                        return [2 /*return*/, sortedList.slice(0, count)];
                }
            });
        });
    };
    CustomCalendarEventCacheHandler.prototype.assertCorrectRange = function (range) {
        if (range.lower !== EntityUtils_js_1.CUSTOM_MIN_ID || range.upper !== EntityUtils_js_1.CUSTOM_MAX_ID) {
            throw new ProgrammingError_js_1.ProgrammingError("Invalid range for CalendarEvent: ".concat(JSON.stringify(range)));
        }
    };
    CustomCalendarEventCacheHandler.prototype.getElementIdsInCacheRange = function (storage, listId, ids) {
        return __awaiter(this, void 0, void 0, function () {
            var range;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, storage.getRangeForList(TypeRefs_js_1.CalendarEventTypeRef, listId)];
                    case 1:
                        range = _a.sent();
                        if (range) {
                            this.assertCorrectRange(range);
                            // assume none of the given Ids are already cached to make sure they are loaded now
                            return [2 /*return*/, ids];
                        }
                        else {
                            return [2 /*return*/, []];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return CustomCalendarEventCacheHandler;
}());
exports.CustomCalendarEventCacheHandler = CustomCalendarEventCacheHandler;
