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
exports.DesktopSqlCipher = void 0;
var better_sqlite3_1 = require("better-sqlite3");
var tutanota_crypto_1 = require("@tutao/tutanota-crypto");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var SqlValue_js_1 = require("../api/worker/offline/SqlValue.js");
var ProgrammingError_js_1 = require("../api/common/error/ProgrammingError.js");
var OfflineDbClosedError_js_1 = require("../api/common/error/OfflineDbClosedError.js");
var DesktopSqlCipher = /** @class */ (function () {
    /**
     * @param nativeBindingPath the path to the sqlite native module
     */
    function DesktopSqlCipher(nativeBindingPath, dbPath, integrityCheck) {
        this.nativeBindingPath = nativeBindingPath;
        this.dbPath = dbPath;
        this.integrityCheck = integrityCheck;
        this._db = null;
    }
    Object.defineProperty(DesktopSqlCipher.prototype, "db", {
        get: function () {
            if (this._db == null) {
                throw new OfflineDbClosedError_js_1.OfflineDbClosedError();
            }
            return this._db;
        },
        enumerable: false,
        configurable: true
    });
    DesktopSqlCipher.prototype.openDb = function (userId, dbKey) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this._db = new better_sqlite3_1["default"](this.dbPath, {
                    // Remove ts-ignore once proper definition of Options exists, see https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/59049#
                    // @ts-ignore missing type
                    nativeBinding: this.nativeBindingPath
                });
                this.initSqlcipher({ databaseKey: dbKey, enableMemorySecurity: true, integrityCheck: this.integrityCheck });
                return [2 /*return*/];
            });
        });
    };
    DesktopSqlCipher.prototype.closeDb = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.db.close();
                return [2 /*return*/];
            });
        });
    };
    /**
     * not implemented because we delete the DB directly from the per-window facade
     */
    DesktopSqlCipher.prototype.deleteDb = function (userId) {
        throw new ProgrammingError_js_1.ProgrammingError("Not implemented");
    };
    /**
     * Initialise sqlcipher with a database key, configuration:
     * - Sqlcipher always uses aes-256 for encryption.
     * - Sqlcipher always creates per page hmac for integrity with sha512.
     * - Sqlcipher generates a database salt value randomly and stores in the first 16 bytes of the database.
     * - We pass the database key directly to sqlcipher rather than using a password and therefore do not configure key derivation.
     * - we assume that adding entropy to entropy pool of the crypto provide (cipher_add_random) "is not necessary [...], since [openssl] does (re-)seed itself automatically using trusted system entropy sources", https://www.openssl.org/docs/man1.1.1/man3/RAND_add.html
     * @param databaseKey
     * @param enableMemorySecurity if true the the memory security option (that was default until 4.5, https://www.zetetic.net/blog/2021/10/28/sqlcipher-4.5.0-release/) to wipe memory allocated by SQLite internally, including the page cache is enabled.
     * @param integrityCheck: if true the hmac stored with each page of the database is verified to detect modification.
     * @throws if an error is detected during the integrity check
     */
    DesktopSqlCipher.prototype.initSqlcipher = function (_a) {
        var databaseKey = _a.databaseKey, enableMemorySecurity = _a.enableMemorySecurity, integrityCheck = _a.integrityCheck;
        if (enableMemorySecurity) {
            this.db.pragma("cipher_memory_security = ON");
        }
        var key = "x'".concat((0, tutanota_utils_1.uint8ArrayToBase64)(databaseKey), ";");
        this.db.pragma("KEY = \"".concat(key, "\""));
        if (integrityCheck) {
            this.checkIntegrity();
        }
    };
    /**
     * Execute a query
     */
    DesktopSqlCipher.prototype.run = function (query, params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.db.prepare(query).run(params.map(SqlValue_js_1.untagSqlValue));
                return [2 /*return*/];
            });
        });
    };
    /**
     * Execute a query
     * @returns a single object or undefined if the query returns nothing
     */
    DesktopSqlCipher.prototype.get = function (query, params) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_b) {
                result = (_a = this.db.prepare(query).get(params.map(SqlValue_js_1.untagSqlValue))) !== null && _a !== void 0 ? _a : null;
                return [2 /*return*/, (0, tutanota_utils_1.mapNullable)(result, SqlValue_js_1.tagSqlObject)];
            });
        });
    };
    /**
     * Execute a query
     * @returns a list of objects or an empty list if the query returns nothing
     */
    DesktopSqlCipher.prototype.all = function (query, params) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                result = this.db.prepare(query).all(params.map(SqlValue_js_1.untagSqlValue));
                return [2 /*return*/, result.map(SqlValue_js_1.tagSqlObject)];
            });
        });
    };
    DesktopSqlCipher.prototype.checkIntegrity = function () {
        /**
         * Throws a CryptoError if MAC verification fails
         */
        var errors = this.db.pragma("cipher_integrity_check");
        if (errors.length > 0) {
            throw new tutanota_crypto_1.CryptoError("Integrity check failed with result : ".concat(JSON.stringify(errors)));
        }
    };
    return DesktopSqlCipher;
}());
exports.DesktopSqlCipher = DesktopSqlCipher;
function boolToSqlite(bool) {
    return bool ? SqliteBool.TRUE : SqliteBool.FALSE;
}
var SqliteBool;
(function (SqliteBool) {
    SqliteBool[SqliteBool["TRUE"] = 1] = "TRUE";
    SqliteBool[SqliteBool["FALSE"] = 0] = "FALSE";
})(SqliteBool || (SqliteBool = {}));
