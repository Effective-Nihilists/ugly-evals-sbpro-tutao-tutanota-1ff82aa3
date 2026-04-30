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
exports.ConfigurationDatabase = exports.encryptItem = void 0;
var DbFacade_1 = require("../search/DbFacade");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Indexer_1 = require("../search/Indexer");
var tutanota_utils_2 = require("@tutao/tutanota-utils");
var tutanota_utils_3 = require("@tutao/tutanota-utils");
var tutanota_crypto_1 = require("@tutao/tutanota-crypto");
var VERSION = 1;
var DB_KEY_PREFIX = "ConfigStorage";
var ExternalImageListOS = "ExternalAllowListOS";
var MetaDataOS = "MetaDataOS";
/** @PublicForTesting */
function encryptItem(item, key, iv) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, tutanota_crypto_1.aes256Encrypt)(key, (0, tutanota_utils_1.stringToUtf8Uint8Array)(item), iv, true, false).slice(iv.length)];
        });
    });
}
exports.encryptItem = encryptItem;
/**
 * A local configuration database that can be used as an alternative to DeviceConfig:
 * Ideal for cases where the configuration values should be stored encrypted,
 * Or when the configuration is a growing list or object, which would be unsuitable for localStorage
 * Or when the configuration is only required in the Worker
 */
var ConfigurationDatabase = /** @class */ (function () {
    function ConfigurationDatabase(userFacade, dbLoadFn) {
        if (dbLoadFn === void 0) { dbLoadFn = loadConfigDb; }
        this.db = new tutanota_utils_2.LazyLoaded(function () {
            var user = (0, tutanota_utils_3.assertNotNull)(userFacade.getLoggedInUser());
            var userGroupKey = userFacade.getUserGroupKey();
            return dbLoadFn(user, userGroupKey);
        });
    }
    ConfigurationDatabase.prototype.addExternalImageRule = function (address, rule) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, db, metaData, encryptedAddress;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.db.getAsync()];
                    case 1:
                        _a = _b.sent(), db = _a.db, metaData = _a.metaData;
                        if (!db.indexingSupported)
                            return [2 /*return*/];
                        return [4 /*yield*/, encryptItem(address, metaData.key, metaData.iv)];
                    case 2:
                        encryptedAddress = _b.sent();
                        return [2 /*return*/, this._addAddressToImageList(encryptedAddress, rule)];
                }
            });
        });
    };
    ConfigurationDatabase.prototype.getExternalImageRule = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, db, metaData, encryptedAddress, transaction, entry, rule;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.db.getAsync()];
                    case 1:
                        _a = _b.sent(), db = _a.db, metaData = _a.metaData;
                        if (!db.indexingSupported)
                            return [2 /*return*/, "0" /* ExternalImageRule.None */];
                        return [4 /*yield*/, encryptItem(address, metaData.key, metaData.iv)];
                    case 2:
                        encryptedAddress = _b.sent();
                        return [4 /*yield*/, db.createTransaction(true, [ExternalImageListOS])];
                    case 3:
                        transaction = _b.sent();
                        return [4 /*yield*/, transaction.get(ExternalImageListOS, encryptedAddress)];
                    case 4:
                        entry = _b.sent();
                        rule = "0" /* ExternalImageRule.None */;
                        if (!(entry != null)) return [3 /*break*/, 7];
                        if (!(entry.rule != null)) return [3 /*break*/, 5];
                        rule = entry.rule;
                        return [3 /*break*/, 7];
                    case 5: 
                    // No rule set from earlier version means Allow
                    return [4 /*yield*/, this._addAddressToImageList(encryptedAddress, "1" /* ExternalImageRule.Allow */)];
                    case 6:
                        // No rule set from earlier version means Allow
                        _b.sent();
                        rule = "1" /* ExternalImageRule.Allow */;
                        _b.label = 7;
                    case 7: return [2 /*return*/, rule];
                }
            });
        });
    };
    ConfigurationDatabase.prototype._addAddressToImageList = function (encryptedAddress, rule) {
        return __awaiter(this, void 0, void 0, function () {
            var db, transaction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.getAsync()];
                    case 1:
                        db = (_a.sent()).db;
                        return [4 /*yield*/, db.createTransaction(false, [ExternalImageListOS])];
                    case 2:
                        transaction = _a.sent();
                        return [2 /*return*/, transaction.put(ExternalImageListOS, null, {
                                address: encryptedAddress,
                                rule: rule
                            })];
                }
            });
        });
    };
    return ConfigurationDatabase;
}());
exports.ConfigurationDatabase = ConfigurationDatabase;
function loadConfigDb(user, userGroupKey) {
    return __awaiter(this, void 0, void 0, function () {
        var id, db, metaData, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    id = "".concat(DB_KEY_PREFIX, "_").concat((0, DbFacade_1.b64UserIdHash)(user));
                    db = new DbFacade_1.DbFacade(VERSION, function (event, db) {
                        db.createObjectStore(MetaDataOS);
                        db.createObjectStore(ExternalImageListOS, {
                            keyPath: "address"
                        });
                    });
                    return [4 /*yield*/, loadEncryptionMetadata(db, id, userGroupKey)];
                case 1:
                    _a = (_b.sent());
                    if (_a) return [3 /*break*/, 3];
                    return [4 /*yield*/, initializeDb(db, id, userGroupKey)];
                case 2:
                    _a = (_b.sent());
                    _b.label = 3;
                case 3:
                    metaData = _a;
                    return [2 /*return*/, {
                            db: db,
                            metaData: metaData
                        }];
            }
        });
    });
}
/**
 * Load the encryption key and iv from the db
 * @return { key, iv } or null if one or both don't exist
 */
function loadEncryptionMetadata(db, id, userGroupKey) {
    return __awaiter(this, void 0, void 0, function () {
        var transaction, encDbKey, encDbIv, key, iv;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.open(id)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, db.createTransaction(true, [MetaDataOS])];
                case 2:
                    transaction = _a.sent();
                    return [4 /*yield*/, transaction.get(MetaDataOS, Indexer_1.Metadata.userEncDbKey)];
                case 3:
                    encDbKey = _a.sent();
                    return [4 /*yield*/, transaction.get(MetaDataOS, Indexer_1.Metadata.encDbIv)];
                case 4:
                    encDbIv = _a.sent();
                    if (encDbKey == null || encDbIv == null) {
                        return [2 /*return*/, null];
                    }
                    key = (0, tutanota_crypto_1.decrypt256Key)(userGroupKey, encDbKey);
                    iv = (0, tutanota_crypto_1.aes256Decrypt)(key, encDbIv, true, false);
                    return [2 /*return*/, {
                            key: key,
                            iv: iv
                        }];
            }
        });
    });
}
/**
 * @caution This will clear any existing data in the database, because they key and IV will be regenerated
 * @return the newly generated key and iv for the database contents
 */
function initializeDb(db, id, userGroupKey) {
    return __awaiter(this, void 0, void 0, function () {
        var key, iv, transaction;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db.deleteDatabase().then(function () { return db.open(id); })];
                case 1:
                    _a.sent();
                    key = (0, tutanota_crypto_1.aes256RandomKey)();
                    iv = tutanota_crypto_1.random.generateRandomData(tutanota_crypto_1.IV_BYTE_LENGTH);
                    return [4 /*yield*/, db.createTransaction(false, [MetaDataOS, ExternalImageListOS])];
                case 2:
                    transaction = _a.sent();
                    return [4 /*yield*/, transaction.put(MetaDataOS, Indexer_1.Metadata.userEncDbKey, (0, tutanota_crypto_1.encrypt256Key)(userGroupKey, key))];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, transaction.put(MetaDataOS, Indexer_1.Metadata.encDbIv, (0, tutanota_crypto_1.aes256Encrypt)(key, iv, tutanota_crypto_1.random.generateRandomData(tutanota_crypto_1.IV_BYTE_LENGTH), true, false))];
                case 4:
                    _a.sent();
                    return [2 /*return*/, {
                            key: key,
                            iv: iv
                        }];
            }
        });
    });
}
