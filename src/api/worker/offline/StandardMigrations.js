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
exports.clearDatabase = exports.booleanToNumberValue = exports.removeValue = exports.renameAttribute = exports.migrateAllElements = exports.migrateAllListElements = void 0;
var EntityFunctions_js_1 = require("../../common/EntityFunctions.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
function migrateAllListElements(typeRef, storage, migrations) {
    return __awaiter(this, void 0, void 0, function () {
        var entities, _i, migrations_1, migration, _a, entities_1, entity;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, storage.getListElementsOfType(typeRef)];
                case 1:
                    entities = _b.sent();
                    for (_i = 0, migrations_1 = migrations; _i < migrations_1.length; _i++) {
                        migration = migrations_1[_i];
                        entities = entities.map(migration);
                    }
                    _a = 0, entities_1 = entities;
                    _b.label = 2;
                case 2:
                    if (!(_a < entities_1.length)) return [3 /*break*/, 5];
                    entity = entities_1[_a];
                    return [4 /*yield*/, storage.put(entity)];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    _a++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.migrateAllListElements = migrateAllListElements;
function migrateAllElements(typeRef, storage, migrations) {
    return __awaiter(this, void 0, void 0, function () {
        var entities, _i, migrations_2, migration, _a, entities_2, entity;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, storage.getElementsOfType(typeRef)];
                case 1:
                    entities = _b.sent();
                    for (_i = 0, migrations_2 = migrations; _i < migrations_2.length; _i++) {
                        migration = migrations_2[_i];
                        entities = entities.map(migration);
                    }
                    _a = 0, entities_2 = entities;
                    _b.label = 2;
                case 2:
                    if (!(_a < entities_2.length)) return [3 /*break*/, 5];
                    entity = entities_2[_a];
                    return [4 /*yield*/, storage.put(entity)];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    _a++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.migrateAllElements = migrateAllElements;
function renameAttribute(oldName, newName) {
    return function (entity) {
        entity[newName] = entity[oldName];
        delete entity[oldName];
        return entity;
    };
}
exports.renameAttribute = renameAttribute;
function removeValue(valueName) {
    return function (entity) {
        delete entity[valueName];
        return entity;
    };
}
exports.removeValue = removeValue;
function booleanToNumberValue(attribute) {
    return function (entity) {
        // same default value mapping as in the tutadb migration
        entity[attribute] = (entity[attribute] ? "1" : "0");
        return entity;
    };
}
exports.booleanToNumberValue = booleanToNumberValue;
function clearDatabase(storage) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, storage.purgeStorage()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, writeModelVersions(storage)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.clearDatabase = clearDatabase;
function writeModelVersions(storage) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, _a, app, key, version;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _i = 0, _a = (0, tutanota_utils_1.typedKeys)(EntityFunctions_js_1.modelInfos);
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    app = _a[_i];
                    key = "".concat(app, "-version");
                    version = EntityFunctions_js_1.modelInfos[app].version;
                    return [4 /*yield*/, storage.setStoredModelVersion(app, version)];
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
}
