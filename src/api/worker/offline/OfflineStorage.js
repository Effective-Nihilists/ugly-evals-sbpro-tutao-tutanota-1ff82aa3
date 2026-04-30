"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
exports.sql = exports.OfflineStorage = exports.customTypeDecoders = exports.customTypeEncoders = void 0;
var EntityUtils_js_1 = require("../../common/utils/EntityUtils.js");
var DefaultEntityRestCache_js_1 = require("../rest/DefaultEntityRestCache.js");
var cborg = require("cborg");
var cborg_1 = require("cborg");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Env_js_1 = require("../../common/Env.js");
var TutanotaConstants_js_1 = require("../../common/TutanotaConstants.js");
var TypeRefs_js_1 = require("../../entities/tutanota/TypeRefs.js");
var TypeRefs_js_2 = require("../../entities/sys/TypeRefs.js");
var CustomCacheHandler_js_1 = require("../rest/CustomCacheHandler.js");
var SqlValue_js_1 = require("./SqlValue.js");
function dateEncoder(data, typ, options) {
    var time = data.getTime();
    return [
        // https://datatracker.ietf.org/doc/rfc8943/
        new cborg_1.Token(cborg_1.Type.tag, 100),
        new cborg_1.Token(time < 0 ? cborg_1.Type.negint : cborg_1.Type.uint, time)
    ];
}
function dateDecoder(bytes) {
    return new Date(bytes);
}
exports.customTypeEncoders = Object.freeze({
    "Date": dateEncoder
});
exports.customTypeDecoders = (function () {
    var tags = [];
    tags[100] = dateDecoder;
    return tags;
})();
var TableDefinitions = Object.freeze({
    // plus ownerGroup added in a migration
    list_entities: "type TEXT NOT NULL, listId TEXT NOT NULL, elementId TEXT NOT NULL, ownerGroup TEXT, entity BLOB NOT NULL, PRIMARY KEY (type, listId, elementId)",
    // plus ownerGroup added in a migration
    element_entities: "type TEXT NOT NULL, elementId TEXT NOT NULL, ownerGroup TEXT, entity BLOB NOT NULL, PRIMARY KEY (type, elementId)",
    ranges: "type TEXT NOT NULL, listId TEXT NOT NULL, lower TEXT NOT NULL, upper TEXT NOT NULL, PRIMARY KEY (type, listId)",
    lastUpdateBatchIdPerGroupId: "groupId TEXT NOT NULL, batchId TEXT NOT NULL, PRIMARY KEY (groupId)",
    metadata: "key TEXT NOT NULL, value BLOB, PRIMARY KEY (key)"
});
var OfflineStorage = /** @class */ (function () {
    function OfflineStorage(sqlCipherFacade, interWindowEventSender, dateProvider, migrator) {
        this.sqlCipherFacade = sqlCipherFacade;
        this.interWindowEventSender = interWindowEventSender;
        this.dateProvider = dateProvider;
        this.migrator = migrator;
        this.customCacheHandler = null;
        this.userId = null;
        (0, tutanota_utils_1.assert)((0, Env_js_1.isOfflineStorageAvailable)() || (0, Env_js_1.isTest)(), "Offline storage is not available.");
    }
    /**
     * @return {boolean} whether the database was newly created or not
     */
    OfflineStorage.prototype.init = function (_a) {
        var userId = _a.userId, databaseKey = _a.databaseKey, timeRangeDays = _a.timeRangeDays, forceNewDatabase = _a.forceNewDatabase;
        return __awaiter(this, void 0, void 0, function () {
            var isNewOfflineDb;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.userId = userId;
                        if (!forceNewDatabase) return [3 /*break*/, 4];
                        if (!(0, Env_js_1.isDesktop)()) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.interWindowEventSender.localUserDataInvalidated(userId)];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2: return [4 /*yield*/, this.sqlCipherFacade.deleteDb(userId)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4: 
                    // We open database here and it is closed in the native side when the window is closed or the page is reloaded
                    return [4 /*yield*/, this.sqlCipherFacade.openDb(userId, databaseKey)];
                    case 5:
                        // We open database here and it is closed in the native side when the window is closed or the page is reloaded
                        _b.sent();
                        return [4 /*yield*/, this.createTables()];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, this.migrator.migrate(this, this.sqlCipherFacade)
                            // if nothing is written here, it means it's a new database
                        ];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, this.getLastUpdateTime()];
                    case 8:
                        isNewOfflineDb = (_b.sent()) == null;
                        return [4 /*yield*/, this.clearExcludedData(timeRangeDays, userId)];
                    case 9:
                        _b.sent();
                        return [2 /*return*/, isNewOfflineDb];
                }
            });
        });
    };
    /**
     * currently, we close DBs from the native side (mainly on things like reload and on android's onDestroy)
     */
    OfflineStorage.prototype.deinit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.userId = null;
                        return [4 /*yield*/, this.sqlCipherFacade.closeDb()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OfflineStorage.prototype.deleteIfExists = function (typeRef, listId, elementId) {
        return __awaiter(this, void 0, void 0, function () {
            var type, preparedQuery;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        type = (0, tutanota_utils_1.getTypeId)(typeRef);
                        if (listId == null) {
                            preparedQuery = sql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["DELETE FROM element_entities WHERE type = ", " AND elementId = ", ""], ["DELETE FROM element_entities WHERE type = ", " AND elementId = ", ""])), type, elementId);
                        }
                        else {
                            preparedQuery = sql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["DELETE FROM list_entities WHERE type = ", " AND listId = ", " AND elementId = ", ""], ["DELETE FROM list_entities WHERE type = ", " AND listId = ", " AND elementId = ", ""])), type, listId, elementId);
                        }
                        return [4 /*yield*/, this.sqlCipherFacade.run(preparedQuery.query, preparedQuery.params)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OfflineStorage.prototype.get = function (typeRef, listId, elementId) {
        return __awaiter(this, void 0, void 0, function () {
            var type, preparedQuery, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        type = (0, tutanota_utils_1.getTypeId)(typeRef);
                        if (listId == null) {
                            preparedQuery = sql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["SELECT entity from element_entities WHERE type = ", " AND elementId = ", ""], ["SELECT entity from element_entities WHERE type = ", " AND elementId = ", ""])), type, elementId);
                        }
                        else {
                            preparedQuery = sql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["SELECT entity from list_entities WHERE type = ", " AND listId = ", " AND elementId = ", ""], ["SELECT entity from list_entities WHERE type = ", " AND listId = ", " AND elementId = ", ""])), type, listId, elementId);
                        }
                        return [4 /*yield*/, this.sqlCipherFacade.get(preparedQuery.query, preparedQuery.params)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, (result === null || result === void 0 ? void 0 : result.entity)
                                ? this.deserialize(typeRef, result.entity.value)
                                : null];
                }
            });
        });
    };
    OfflineStorage.prototype.getIdsInRange = function (typeRef, listId) {
        return __awaiter(this, void 0, void 0, function () {
            var type, range, lower, upper, _a, query, params, rows;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        type = (0, tutanota_utils_1.getTypeId)(typeRef);
                        return [4 /*yield*/, this.getRange(type, listId)];
                    case 1:
                        range = _b.sent();
                        if (range == null) {
                            throw new Error("no range exists for ".concat(type, " and list ").concat(listId));
                        }
                        lower = range.lower, upper = range.upper;
                        _a = sql(templateObject_5 || (templateObject_5 = __makeTemplateObject(["SELECT elementId FROM list_entities\nWHERE type = ", "\nAND listId = ", "\nAND (elementId = ", "\nOR ", ")\nAND NOT(", ")"], ["SELECT elementId FROM list_entities\nWHERE type = ", "\nAND listId = ", "\nAND (elementId = ", "\nOR ", ")\nAND NOT(", ")"])), type, listId, lower, firstIdBigger("elementId", lower), firstIdBigger("elementId", upper)), query = _a.query, params = _a.params;
                        return [4 /*yield*/, this.sqlCipherFacade.all(query, params)];
                    case 2:
                        rows = _b.sent();
                        return [2 /*return*/, rows.map(function (row) { return row.elementId.value; })];
                }
            });
        });
    };
    OfflineStorage.prototype.getRangeForList = function (typeRef, listId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.getRange((0, tutanota_utils_1.getTypeId)(typeRef), listId)];
            });
        });
    };
    OfflineStorage.prototype.isElementIdInCacheRange = function (typeRef, listId, id) {
        return __awaiter(this, void 0, void 0, function () {
            var range;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getRangeForList(typeRef, listId)];
                    case 1:
                        range = _a.sent();
                        return [2 /*return*/, range != null
                                && !(0, EntityUtils_js_1.firstBiggerThanSecond)(id, range.upper)
                                && !(0, EntityUtils_js_1.firstBiggerThanSecond)(range.lower, id)];
                }
            });
        });
    };
    OfflineStorage.prototype.provideFromRange = function (typeRef, listId, start, count, reverse) {
        return __awaiter(this, void 0, void 0, function () {
            var type, preparedQuery, query, params, serializedList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        type = (0, tutanota_utils_1.getTypeId)(typeRef);
                        if (reverse) {
                            preparedQuery = sql(templateObject_6 || (templateObject_6 = __makeTemplateObject(["SELECT entity FROM list_entities WHERE type = ", " AND listId = ", " AND ", " ORDER BY LENGTH(elementId) DESC, elementId DESC LIMIT ", ""], ["SELECT entity FROM list_entities WHERE type = ", " AND listId = ", " AND ", " ORDER BY LENGTH(elementId) DESC, elementId DESC LIMIT ", ""])), type, listId, firstIdBigger(start, "elementId"), count);
                        }
                        else {
                            preparedQuery = sql(templateObject_7 || (templateObject_7 = __makeTemplateObject(["SELECT entity FROM list_entities WHERE type = ", " AND listId = ", " AND ", " ORDER BY LENGTH(elementId) ASC, elementId ASC LIMIT ", ""], ["SELECT entity FROM list_entities WHERE type = ", " AND listId = ", " AND ", " ORDER BY LENGTH(elementId) ASC, elementId ASC LIMIT ", ""])), type, listId, firstIdBigger("elementId", start), count);
                        }
                        query = preparedQuery.query, params = preparedQuery.params;
                        return [4 /*yield*/, this.sqlCipherFacade.all(query, params)];
                    case 1:
                        serializedList = _a.sent();
                        return [2 /*return*/, this.deserializeList(typeRef, serializedList.map(function (r) { return r.entity.value; }))];
                }
            });
        });
    };
    OfflineStorage.prototype.put = function (originalEntity) {
        return __awaiter(this, void 0, void 0, function () {
            var serializedEntity, _a, listId, elementId, type, ownerGroup, preparedQuery;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        serializedEntity = this.serialize(originalEntity);
                        _a = (0, DefaultEntityRestCache_js_1.expandId)(originalEntity._id), listId = _a.listId, elementId = _a.elementId;
                        type = (0, tutanota_utils_1.getTypeId)(originalEntity._type);
                        ownerGroup = originalEntity._ownerGroup;
                        preparedQuery = listId == null
                            ? sql(templateObject_8 || (templateObject_8 = __makeTemplateObject(["INSERT OR REPLACE INTO element_entities (type, elementId, ownerGroup, entity) VALUES (", ", ", ", ", ", ", ")"], ["INSERT OR REPLACE INTO element_entities (type, elementId, ownerGroup, entity) VALUES (", ", ", ", ", ", ", ")"])), type, elementId, ownerGroup, serializedEntity) : sql(templateObject_9 || (templateObject_9 = __makeTemplateObject(["INSERT OR REPLACE INTO list_entities (type, listId, elementId, ownerGroup, entity) VALUES (", ", ", ", ", ", ", ", ", ")"], ["INSERT OR REPLACE INTO list_entities (type, listId, elementId, ownerGroup, entity) VALUES (", ", ", ", ", ", ", ", ", ")"])), type, listId, elementId, ownerGroup, serializedEntity);
                        return [4 /*yield*/, this.sqlCipherFacade.run(preparedQuery.query, preparedQuery.params)];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OfflineStorage.prototype.setLowerRangeForList = function (typeRef, listId, id) {
        return __awaiter(this, void 0, void 0, function () {
            var type, _a, query, params;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        type = (0, tutanota_utils_1.getTypeId)(typeRef);
                        _a = sql(templateObject_10 || (templateObject_10 = __makeTemplateObject(["UPDATE ranges SET lower = ", " WHERE type = ", " AND listId = ", ""], ["UPDATE ranges SET lower = ", " WHERE type = ", " AND listId = ", ""])), id, type, listId), query = _a.query, params = _a.params;
                        return [4 /*yield*/, this.sqlCipherFacade.run(query, params)];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OfflineStorage.prototype.setUpperRangeForList = function (typeRef, listId, id) {
        return __awaiter(this, void 0, void 0, function () {
            var type, _a, query, params;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        type = (0, tutanota_utils_1.getTypeId)(typeRef);
                        _a = sql(templateObject_11 || (templateObject_11 = __makeTemplateObject(["UPDATE ranges SET upper = ", " WHERE type = ", " AND listId = ", ""], ["UPDATE ranges SET upper = ", " WHERE type = ", " AND listId = ", ""])), id, type, listId), query = _a.query, params = _a.params;
                        return [4 /*yield*/, this.sqlCipherFacade.run(query, params)];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OfflineStorage.prototype.setNewRangeForList = function (typeRef, listId, lower, upper) {
        return __awaiter(this, void 0, void 0, function () {
            var type, _a, query, params;
            return __generator(this, function (_b) {
                type = (0, tutanota_utils_1.getTypeId)(typeRef);
                _a = sql(templateObject_12 || (templateObject_12 = __makeTemplateObject(["INSERT OR REPLACE INTO ranges VALUES (", ", ", ", ", ", ", ")"], ["INSERT OR REPLACE INTO ranges VALUES (", ", ", ", ", ", ", ")"])), type, listId, lower, upper), query = _a.query, params = _a.params;
                return [2 /*return*/, this.sqlCipherFacade.run(query, params)];
            });
        });
    };
    OfflineStorage.prototype.getLastBatchIdForGroup = function (groupId) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var _c, query, params, row;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _c = sql(templateObject_13 || (templateObject_13 = __makeTemplateObject(["SELECT batchId from lastUpdateBatchIdPerGroupId WHERE groupId = ", ""], ["SELECT batchId from lastUpdateBatchIdPerGroupId WHERE groupId = ", ""])), groupId), query = _c.query, params = _c.params;
                        return [4 /*yield*/, this.sqlCipherFacade.get(query, params)];
                    case 1:
                        row = _d.sent();
                        return [2 /*return*/, ((_b = (_a = row === null || row === void 0 ? void 0 : row.batchId) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : null)];
                }
            });
        });
    };
    OfflineStorage.prototype.deleteLastBatchIdForGroup = function (groupId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, query, params;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = sql(templateObject_14 || (templateObject_14 = __makeTemplateObject(["DELETE FROM lastUpdateBatchIdPerGroupId WHERE groupId = ", ""], ["DELETE FROM lastUpdateBatchIdPerGroupId WHERE groupId = ", ""])), groupId), query = _a.query, params = _a.params;
                        return [4 /*yield*/, this.sqlCipherFacade.run(query, params)];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OfflineStorage.prototype.putLastBatchIdForGroup = function (groupId, batchId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, query, params;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = sql(templateObject_15 || (templateObject_15 = __makeTemplateObject(["INSERT OR REPLACE INTO lastUpdateBatchIdPerGroupId VALUES (", ", ", ")"], ["INSERT OR REPLACE INTO lastUpdateBatchIdPerGroupId VALUES (", ", ", ")"])), groupId, batchId), query = _a.query, params = _a.params;
                        return [4 /*yield*/, this.sqlCipherFacade.run(query, params)];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OfflineStorage.prototype.getLastUpdateTime = function () {
        return __awaiter(this, void 0, void 0, function () {
            var time;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getMetadata("lastUpdateTime")];
                    case 1:
                        time = _a.sent();
                        return [2 /*return*/, time ? { type: "recorded", time: time } : { type: "never" }];
                }
            });
        });
    };
    OfflineStorage.prototype.putLastUpdateTime = function (ms) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.putMetadata("lastUpdateTime", ms)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OfflineStorage.prototype.purgeStorage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, name_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, _a = Object.keys(TableDefinitions);
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        name_1 = _a[_i];
                        return [4 /*yield*/, this.sqlCipherFacade.run("DELETE FROM ".concat(name_1), [])];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    OfflineStorage.prototype.deleteRange = function (typeRef, listId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, query, params;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = sql(templateObject_16 || (templateObject_16 = __makeTemplateObject(["DELETE FROM ranges WHERE type = ", " AND listId = ", ""], ["DELETE FROM ranges WHERE type = ", " AND listId = ", ""])), (0, tutanota_utils_1.getTypeId)(typeRef), listId), query = _a.query, params = _a.params;
                        return [4 /*yield*/, this.sqlCipherFacade.run(query, params)];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OfflineStorage.prototype.getListElementsOfType = function (typeRef) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var _b, query, params, items;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = sql(templateObject_17 || (templateObject_17 = __makeTemplateObject(["SELECT entity from list_entities WHERE type = ", ""], ["SELECT entity from list_entities WHERE type = ", ""])), (0, tutanota_utils_1.getTypeId)(typeRef)), query = _b.query, params = _b.params;
                        return [4 /*yield*/, this.sqlCipherFacade.all(query, params)];
                    case 1:
                        items = (_a = _c.sent()) !== null && _a !== void 0 ? _a : [];
                        return [2 /*return*/, this.deserializeList(typeRef, items.map(function (row) { return row.entity.value; }))];
                }
            });
        });
    };
    OfflineStorage.prototype.getElementsOfType = function (typeRef) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var _b, query, params, items;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = sql(templateObject_18 || (templateObject_18 = __makeTemplateObject(["SELECT entity from element_entities WHERE type = ", ""], ["SELECT entity from element_entities WHERE type = ", ""])), (0, tutanota_utils_1.getTypeId)(typeRef)), query = _b.query, params = _b.params;
                        return [4 /*yield*/, this.sqlCipherFacade.all(query, params)];
                    case 1:
                        items = (_a = _c.sent()) !== null && _a !== void 0 ? _a : [];
                        return [2 /*return*/, this.deserializeList(typeRef, items.map(function (row) { return row.entity.value; }))];
                }
            });
        });
    };
    OfflineStorage.prototype.getWholeList = function (typeRef, listId) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var _b, query, params, items;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = sql(templateObject_19 || (templateObject_19 = __makeTemplateObject(["SELECT entity FROM list_entities WHERE type = ", " AND listId = ", ""], ["SELECT entity FROM list_entities WHERE type = ", " AND listId = ", ""])), (0, tutanota_utils_1.getTypeId)(typeRef), listId), query = _b.query, params = _b.params;
                        return [4 /*yield*/, this.sqlCipherFacade.all(query, params)];
                    case 1:
                        items = (_a = _c.sent()) !== null && _a !== void 0 ? _a : [];
                        return [2 /*return*/, this.deserializeList(typeRef, items.map(function (row) { return row.entity.value; }))];
                }
            });
        });
    };
    OfflineStorage.prototype.dumpMetadata = function () {
        return __awaiter(this, void 0, void 0, function () {
            var query, stored;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "SELECT * from metadata";
                        return [4 /*yield*/, this.sqlCipherFacade.all(query, [])];
                    case 1:
                        stored = (_a.sent()).map(function (row) { return [row.key.value, row.value.value]; });
                        return [2 /*return*/, Object.fromEntries(stored.map(function (_a) {
                                var key = _a[0], value = _a[1];
                                return [key, cborg.decode(value)];
                            }))];
                }
            });
        });
    };
    OfflineStorage.prototype.setStoredModelVersion = function (model, version) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.putMetadata("".concat(model, "-version"), version)];
            });
        });
    };
    OfflineStorage.prototype.getCustomCacheHandlerMap = function (entityRestClient) {
        if (this.customCacheHandler == null) {
            this.customCacheHandler = new CustomCacheHandler_js_1.CustomCacheHandlerMap({ ref: TypeRefs_js_1.CalendarEventTypeRef, handler: new CustomCacheHandler_js_1.CustomCalendarEventCacheHandler(entityRestClient) });
        }
        return this.customCacheHandler;
    };
    OfflineStorage.prototype.getUserId = function () {
        return (0, tutanota_utils_1.assertNotNull)(this.userId, "No user id, not initialized?");
    };
    OfflineStorage.prototype.deleteAllOwnedBy = function (owner) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, query, params, _b, query, params, rangeRows, rows, listIdsByType, _i, _c, _d, type, listIds, deleteRangeQuery, deleteEntitiesQuery;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = sql(templateObject_20 || (templateObject_20 = __makeTemplateObject(["DELETE FROM element_entities WHERE ownerGroup = ", ""], ["DELETE FROM element_entities WHERE ownerGroup = ", ""])), owner), query = _a.query, params = _a.params;
                        return [4 /*yield*/, this.sqlCipherFacade.run(query, params)];
                    case 1:
                        _e.sent();
                        _b = sql(templateObject_21 || (templateObject_21 = __makeTemplateObject(["SELECT listId, type FROM list_entities WHERE ownerGroup = ", ""], ["SELECT listId, type FROM list_entities WHERE ownerGroup = ", ""])), owner), query = _b.query, params = _b.params;
                        return [4 /*yield*/, this.sqlCipherFacade.all(query, params)];
                    case 2:
                        rangeRows = _e.sent();
                        rows = rangeRows.map(function (row) { return (0, SqlValue_js_1.untagSqlObject)(row); });
                        listIdsByType = (0, tutanota_utils_1.groupByAndMapUniquely)(rows, function (row) { return row.type; }, function (row) { return row.listId; });
                        _i = 0, _c = listIdsByType.entries();
                        _e.label = 3;
                    case 3:
                        if (!(_i < _c.length)) return [3 /*break*/, 7];
                        _d = _c[_i], type = _d[0], listIds = _d[1];
                        deleteRangeQuery = sql(templateObject_22 || (templateObject_22 = __makeTemplateObject(["DELETE FROM ranges WHERE type = ", " AND listId IN ", ""], ["DELETE FROM ranges WHERE type = ", " AND listId IN ", ""])), type, paramList(Array.from(listIds)));
                        return [4 /*yield*/, this.sqlCipherFacade.run(deleteRangeQuery.query, deleteRangeQuery.params)
                            // delete all entities that have one of those list Ids.
                        ];
                    case 4:
                        _e.sent();
                        deleteEntitiesQuery = sql(templateObject_23 || (templateObject_23 = __makeTemplateObject(["DELETE FROM list_entities WHERE type = ", " AND listId IN ", ""], ["DELETE FROM list_entities WHERE type = ", " AND listId IN ", ""])), type, paramList(Array.from(listIds)));
                        return [4 /*yield*/, this.sqlCipherFacade.run(deleteEntitiesQuery.query, deleteEntitiesQuery.params)];
                    case 5:
                        _e.sent();
                        _e.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 3];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    OfflineStorage.prototype.putMetadata = function (key, value) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, query, params;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = sql(templateObject_24 || (templateObject_24 = __makeTemplateObject(["INSERT OR REPLACE INTO metadata VALUES (", ", ", ")"], ["INSERT OR REPLACE INTO metadata VALUES (", ", ", ")"])), key, cborg.encode(value)), query = _a.query, params = _a.params;
                        return [4 /*yield*/, this.sqlCipherFacade.run(query, params)];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OfflineStorage.prototype.getMetadata = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, query, params, encoded;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = sql(templateObject_25 || (templateObject_25 = __makeTemplateObject(["SELECT value from metadata WHERE key = ", ""], ["SELECT value from metadata WHERE key = ", ""])), key), query = _a.query, params = _a.params;
                        return [4 /*yield*/, this.sqlCipherFacade.get(query, params)];
                    case 1:
                        encoded = _b.sent();
                        return [2 /*return*/, encoded && cborg.decode(encoded.value.value)];
                }
            });
        });
    };
    /**
     * Clear out unneeded data from the offline database (i.e. trash and spam lists, old data)
     * @param timeRangeDays: the maxiumum age of days that mails should be to be kept in the database. if null, will use a default value
     */
    OfflineStorage.prototype.clearExcludedData = function (timeRangeDays, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user, isFreeUser, timeRange, cutoffTimestamp, cutoffId, folders, _i, folders_1, folder;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get(TypeRefs_js_2.UserTypeRef, null, userId)
                        // Free users always have default time range regardless of what is stored
                    ];
                    case 1:
                        user = _a.sent();
                        isFreeUser = (user === null || user === void 0 ? void 0 : user.accountType) === TutanotaConstants_js_1.AccountType.FREE;
                        timeRange = isFreeUser || timeRangeDays == null ? TutanotaConstants_js_1.OFFLINE_STORAGE_DEFAULT_TIME_RANGE_DAYS : timeRangeDays;
                        cutoffTimestamp = this.dateProvider.now() - timeRange * tutanota_utils_1.DAY_IN_MILLIS;
                        cutoffId = (0, EntityUtils_js_1.timestampToGeneratedId)(cutoffTimestamp);
                        return [4 /*yield*/, this.getListElementsOfType(TypeRefs_js_1.MailFolderTypeRef)];
                    case 2:
                        folders = _a.sent();
                        _i = 0, folders_1 = folders;
                        _a.label = 3;
                    case 3:
                        if (!(_i < folders_1.length)) return [3 /*break*/, 8];
                        folder = folders_1[_i];
                        if (!(folder.folderType === TutanotaConstants_js_1.MailFolderType.TRASH || folder.folderType === TutanotaConstants_js_1.MailFolderType.SPAM)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.deleteMailList(folder.mails, EntityUtils_js_1.GENERATED_MAX_ID)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, this.deleteMailList(folder.mails, cutoffId)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 3];
                    case 8: return [4 /*yield*/, this.sqlCipherFacade.run("VACUUM", [])];
                    case 9:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OfflineStorage.prototype.createTables = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, _b, name_2, definition;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _i = 0, _a = Object.entries(TableDefinitions);
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        _b = _a[_i], name_2 = _b[0], definition = _b[1];
                        return [4 /*yield*/, this.sqlCipherFacade.run("CREATE TABLE IF NOT EXISTS ".concat(name_2, " (").concat(definition, ")"), [])];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    OfflineStorage.prototype.getRange = function (type, listId) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var _b, query, params, row;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = sql(templateObject_26 || (templateObject_26 = __makeTemplateObject(["SELECT upper, lower FROM ranges WHERE type = ", " AND listId = ", ""], ["SELECT upper, lower FROM ranges WHERE type = ", " AND listId = ", ""])), type, listId), query = _b.query, params = _b.params;
                        return [4 /*yield*/, this.sqlCipherFacade.get(query, params)];
                    case 1:
                        row = (_a = _c.sent()) !== null && _a !== void 0 ? _a : null;
                        return [2 /*return*/, (0, tutanota_utils_1.mapNullable)(row, SqlValue_js_1.untagSqlObject)];
                }
            });
        });
    };
    /**
     * This method deletes mails from {@param listId} what are older than {@param cutoffId}. as well as associated data
     *
     * For each mail we delete its body, headers, and all referenced attachments.
     *
     * When we delete the Files, we also delete the whole range for the user's File list. We need to delete the whole
     * range because we only have one file list per mailbox, so if we delete something from the middle of it, the range
     * will no longer be valid. (this is future proofing, because as of now there is not going to be a Range set for the
     * File list anyway, since we currently do not do range requests for Files.
     *
     * 	We do not delete ConversationEntries because:
     * 	1. They are in the same list for the whole conversation so we can't adjust the range
     * 	2. We might need them in the future for showing the whole thread
     */
    OfflineStorage.prototype.deleteMailList = function (listId, cutoffId) {
        return __awaiter(this, void 0, void 0, function () {
            var mailsToDelete, headersToDelete, attachmentsTodelete, mailbodiesToDelete, mails, _i, mails_1, mail, _a, _b, id, _c, _d, _e, listId_1, elementIds;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: 
                    // This must be done before deleting mails to know what the new range has to be
                    return [4 /*yield*/, this.updateRangeForList(TypeRefs_js_1.MailTypeRef, listId, cutoffId)];
                    case 1:
                        // This must be done before deleting mails to know what the new range has to be
                        _f.sent();
                        mailsToDelete = [];
                        headersToDelete = [];
                        attachmentsTodelete = [];
                        mailbodiesToDelete = [];
                        return [4 /*yield*/, this.getWholeList(TypeRefs_js_1.MailTypeRef, listId)];
                    case 2:
                        mails = _f.sent();
                        for (_i = 0, mails_1 = mails; _i < mails_1.length; _i++) {
                            mail = mails_1[_i];
                            if ((0, EntityUtils_js_1.firstBiggerThanSecond)(cutoffId, (0, EntityUtils_js_1.getElementId)(mail))) {
                                mailsToDelete.push(mail._id);
                                mailbodiesToDelete.push(mail.body);
                                if (mail.headers) {
                                    headersToDelete.push(mail.headers);
                                }
                                for (_a = 0, _b = mail.attachments; _a < _b.length; _a++) {
                                    id = _b[_a];
                                    attachmentsTodelete.push(id);
                                }
                            }
                        }
                        return [4 /*yield*/, this.deleteIn(TypeRefs_js_1.MailBodyTypeRef, null, mailbodiesToDelete)];
                    case 3:
                        _f.sent();
                        return [4 /*yield*/, this.deleteIn(TypeRefs_js_1.MailHeadersTypeRef, null, headersToDelete)];
                    case 4:
                        _f.sent();
                        _c = 0, _d = (0, tutanota_utils_1.groupByAndMap)(attachmentsTodelete, EntityUtils_js_1.listIdPart, EntityUtils_js_1.elementIdPart).entries();
                        _f.label = 5;
                    case 5:
                        if (!(_c < _d.length)) return [3 /*break*/, 9];
                        _e = _d[_c], listId_1 = _e[0], elementIds = _e[1];
                        return [4 /*yield*/, this.deleteIn(TypeRefs_js_1.FileTypeRef, listId_1, elementIds)];
                    case 6:
                        _f.sent();
                        return [4 /*yield*/, this.deleteRange(TypeRefs_js_1.FileTypeRef, listId_1)];
                    case 7:
                        _f.sent();
                        _f.label = 8;
                    case 8:
                        _c++;
                        return [3 /*break*/, 5];
                    case 9: return [4 /*yield*/, this.deleteIn(TypeRefs_js_1.MailTypeRef, listId, mailsToDelete.map(EntityUtils_js_1.elementIdPart))];
                    case 10:
                        _f.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OfflineStorage.prototype.deleteIn = function (typeRef, listId, elementIds) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, query, params;
            return __generator(this, function (_b) {
                _a = listId == null
                    ? sql(templateObject_27 || (templateObject_27 = __makeTemplateObject(["DELETE FROM element_entities WHERE type =", " AND elementId IN ", ""], ["DELETE FROM element_entities WHERE type =", " AND elementId IN ", ""])), (0, tutanota_utils_1.getTypeId)(typeRef), paramList(elementIds)) : sql(templateObject_28 || (templateObject_28 = __makeTemplateObject(["DELETE FROM list_entities WHERE type = ", " AND listId = ", " AND elementId IN ", ""], ["DELETE FROM list_entities WHERE type = ", " AND listId = ", " AND elementId IN ", ""])), (0, tutanota_utils_1.getTypeId)(typeRef), listId, paramList(elementIds)), query = _a.query, params = _a.params;
                return [2 /*return*/, this.sqlCipherFacade.run(query, params)];
            });
        });
    };
    OfflineStorage.prototype.updateRangeForList = function (typeRef, listId, cutoffId) {
        return __awaiter(this, void 0, void 0, function () {
            var type, range, entities, id, rangeWontBeModified;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        type = (0, tutanota_utils_1.getTypeId)(typeRef);
                        return [4 /*yield*/, this.getRange(type, listId)];
                    case 1:
                        range = _a.sent();
                        if (range == null) {
                            return [2 /*return*/];
                        }
                        if (!(range.lower === EntityUtils_js_1.GENERATED_MIN_ID)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.provideFromRange(typeRef, listId, EntityUtils_js_1.GENERATED_MIN_ID, 1, false)];
                    case 2:
                        entities = _a.sent();
                        id = (0, tutanota_utils_1.mapNullable)(entities[0], EntityUtils_js_1.getElementId);
                        rangeWontBeModified = id == null || (0, EntityUtils_js_1.firstBiggerThanSecond)(id, cutoffId) || id === cutoffId;
                        if (rangeWontBeModified) {
                            return [2 /*return*/];
                        }
                        _a.label = 3;
                    case 3:
                        if (!(0, EntityUtils_js_1.firstBiggerThanSecond)(cutoffId, range.lower)) return [3 /*break*/, 7];
                        if (!(0, EntityUtils_js_1.firstBiggerThanSecond)(cutoffId, range.upper)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.deleteRange(typeRef, listId)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, this.setLowerRangeForList(typeRef, listId, cutoffId)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    OfflineStorage.prototype.serialize = function (originalEntity) {
        return cborg.encode(originalEntity, { typeEncoders: exports.customTypeEncoders });
    };
    OfflineStorage.prototype.deserialize = function (typeRef, loaded) {
        var deserialized = cborg.decode(loaded, { tags: exports.customTypeDecoders });
        // TypeRef cannot be deserialized back automatically. We could write a codec for it but we don't actually
        // need to store it so we just "patch" it.
        // Some places rely on TypeRef being a class and not a plain object.
        deserialized._type = typeRef;
        return deserialized;
    };
    OfflineStorage.prototype.deserializeList = function (typeRef, loaded) {
        var _this = this;
        return loaded.map(function (entity) { return _this.deserialize(typeRef, entity); });
    };
    return OfflineStorage;
}());
exports.OfflineStorage = OfflineStorage;
/*
 * used to automatically create the right amount of query params for selecting ids from a dynamic list.
 * must be used within sql`<query>` template string to inline the logic into the query
 */
function paramList(params) {
    var qs = params.map(function () { return '?'; }).join(",");
    return new SqlFragment("(".concat(qs, ")"), params);
}
/**
 * comparison to select ids that are bigger or smaller than a parameter id
 * must be used within sql`<query>` template string to inline the logic into the query
 */
function firstIdBigger() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var l = args[0], r = args[1];
    var v;
    if (l === "elementId") {
        v = r;
        r = "?";
    }
    else {
        v = l;
        l = "?";
    }
    return new SqlFragment("(CASE WHEN length(".concat(l, ") > length(").concat(r, ") THEN 1 WHEN length(").concat(l, ") < length(").concat(r, ") THEN 0 ELSE ").concat(l, " > ").concat(r, " END)"), [v, v, v]);
}
/**
 * this tagged template function exists because android doesn't allow us to define SQL functions, so we have made a way to inline
 * SQL fragments into queries.
 * to make it less error-prone, we automate the generation of the params array for the actual sql call.
 * In this way, we offload the escaping of actual user content to the SQL engine, which makes this safe from an SQLI point of view.
 *
 * usage example:
 * const type = "sys/User"
 * const listId = "someList"
 * const startId = "ABC"
 * sql`SELECT entity FROM list_entities WHERE type = ${type} AND listId = ${listId} AND ${firstIdBigger(startId, "elementId")}`
 *
 * this will result in
 * const {query, params} = {
 *     query: `SELECT entity FROM list_entities WHERE type = ? AND listId = ? AND (CASE WHEN length(?) > length(elementId) THEN 1 WHEN length(?) < length(elementId) THEN 0 ELSE ? > elementId END)`,
 *     params: [
 *     		{type: SqlType.String, value: "sys/User"},
 *     		{type: SqlType.String, value: "someList"},
 *     		{type: SqlType.String, value: "ABC"},
 *     		{type: SqlType.String, value: "ABC"},
 *     		{type: SqlType.String, value: "ABC"}
 *     ]
 * }
 *
 * which can be consumed by sql.run(query, params)
 */
function sql(queryParts) {
    var paramInstances = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        paramInstances[_i - 1] = arguments[_i];
    }
    var query = "";
    var params = [];
    var i = 0;
    for (i = 0; i < paramInstances.length; i++) {
        query += queryParts[i];
        var param = paramInstances[i];
        if (param instanceof SqlFragment) {
            query += param.text;
            params.push.apply(params, param.params.map(SqlValue_js_1.tagSqlValue));
        }
        else {
            query += "?";
            params.push((0, SqlValue_js_1.tagSqlValue)(param));
        }
    }
    query += queryParts[i];
    return { query: query, params: params };
}
exports.sql = sql;
var SqlFragment = /** @class */ (function () {
    function SqlFragment(text, params) {
        this.text = text;
        this.params = params;
    }
    return SqlFragment;
}());
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23, templateObject_24, templateObject_25, templateObject_26, templateObject_27, templateObject_28;
