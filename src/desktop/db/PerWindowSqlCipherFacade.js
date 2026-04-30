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
exports.OfflineDbManager = exports.PerWindowSqlCipherFacade = void 0;
var ProgrammingError_js_1 = require("../../api/common/error/ProgrammingError.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var DesktopLog_js_1 = require("../DesktopLog.js");
var OfflineDbClosedError_js_1 = require("../../api/common/error/OfflineDbClosedError.js");
var MAX_WAIT_FOR_DB_CLOSE_MS = 1000;
var PerWindowSqlCipherFacade = /** @class */ (function () {
    function PerWindowSqlCipherFacade(manager) {
        this.manager = manager;
        this.state = null;
    }
    PerWindowSqlCipherFacade.prototype.openDb = function (userId, dbKey) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (this.state != null) {
                            throw new ProgrammingError_js_1.ProgrammingError("Already opened database!");
                        }
                        _a = this;
                        _b = {
                            userId: userId
                        };
                        return [4 /*yield*/, this.manager.getOrCreateDb(userId, dbKey)];
                    case 1:
                        _a.state = (_b.db = _c.sent(),
                            _b);
                        return [2 /*return*/];
                }
            });
        });
    };
    PerWindowSqlCipherFacade.prototype.closeDb = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.state) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.manager.disposeDb(this.state.userId)];
                    case 1:
                        _a.sent();
                        this.state = null;
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    PerWindowSqlCipherFacade.prototype.deleteDb = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.manager.deleteDb(userId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PerWindowSqlCipherFacade.prototype.get = function (query, params) {
        return this.db().get(query, params);
    };
    PerWindowSqlCipherFacade.prototype.all = function (query, params) {
        return this.db().all(query, params);
    };
    PerWindowSqlCipherFacade.prototype.run = function (query, params) {
        return this.db().run(query, params);
    };
    PerWindowSqlCipherFacade.prototype.db = function () {
        if (this.state == null) {
            throw new OfflineDbClosedError_js_1.OfflineDbClosedError();
        }
        return this.state.db;
    };
    return PerWindowSqlCipherFacade;
}());
exports.PerWindowSqlCipherFacade = PerWindowSqlCipherFacade;
var OfflineDbManager = /** @class */ (function () {
    function OfflineDbManager(offlineDbFactory) {
        this.offlineDbFactory = offlineDbFactory;
        this.cache = new Map();
    }
    OfflineDbManager.prototype.getOrCreateDb = function (userId, dbKey) {
        return __awaiter(this, void 0, void 0, function () {
            var entry, db;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        entry = this.cache.get(userId);
                        if (!entry) return [3 /*break*/, 1];
                        entry.counter += 1;
                        return [2 /*return*/, entry.db];
                    case 1: return [4 /*yield*/, this.offlineDbFactory.create(userId, dbKey)];
                    case 2:
                        db = _a.sent();
                        entry = { db: db, counter: 1 };
                        this.cache.set(userId, entry);
                        return [2 /*return*/, entry.db];
                }
            });
        });
    };
    OfflineDbManager.prototype.disposeDb = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var entry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        entry = this.cache.get(userId);
                        if (entry == null) {
                            return [2 /*return*/];
                        }
                        entry.counter -= 1;
                        if (!(entry.counter === 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, entry.db.closeDb()];
                    case 1:
                        _a.sent();
                        this.cache["delete"](userId);
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    OfflineDbManager.prototype.deleteDb = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var entry, waitUntilMax;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        entry = this.cache.get(userId);
                        waitUntilMax = Date.now() + MAX_WAIT_FOR_DB_CLOSE_MS;
                        if (!(entry != null)) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        if (!(this.cache.has(userId) && Date.now() < waitUntilMax)) return [3 /*break*/, 3];
                        DesktopLog_js_1.log.debug("waiting for other windows to close db before deleting it for user ".concat(userId));
                        return [4 /*yield*/, (0, tutanota_utils_1.delay)(100)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 3: return [4 /*yield*/, this.disposeDb(userId)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [4 /*yield*/, this.offlineDbFactory["delete"](userId)];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return OfflineDbManager;
}());
exports.OfflineDbManager = OfflineDbManager;
