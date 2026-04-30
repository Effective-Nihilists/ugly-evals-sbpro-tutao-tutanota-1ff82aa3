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
exports.OfflineStorageMigrator = exports.OFFLINE_STORAGE_MIGRATIONS = void 0;
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var ProgrammingError_js_1 = require("../../common/error/ProgrammingError.js");
var sys_v75_js_1 = require("./migrations/sys-v75.js");
var sys_v76_js_1 = require("./migrations/sys-v76.js");
var tutanota_v54_js_1 = require("./migrations/tutanota-v54.js");
var sys_v79_js_1 = require("./migrations/sys-v79.js");
var sys_v80_js_1 = require("./migrations/sys-v80.js");
var offline_v1_js_1 = require("./migrations/offline-v1.js");
/**
 * List of migrations that will be run when needed. Please add your migrations to the list.
 *
 * Normally you should only add them to the end of the list but with offline ones it can be a bit tricky since they change the db structure itself so sometimes
 * they should rather be in the beginning.
 */
exports.OFFLINE_STORAGE_MIGRATIONS = [
    offline_v1_js_1.offline1,
    sys_v75_js_1.sys75,
    sys_v76_js_1.sys76,
    sys_v79_js_1.sys79,
    sys_v80_js_1.sys80,
    tutanota_v54_js_1.tutanota54, // DB dropped in offline1
];
/**
 * Migrator for the offline storage between different versions of model. It is tightly couples to the versions of API entities: every time we make an
 * "incompatible" change to the API model we need to update offline database somehow.
 *
 * Migrations are done manually but there are a few checks done:
 *  - compile time check that migration exists and is used in this file
 *  - runtime check that runtime model is compatible to the stored one after all the migrations are done.
 *
 *  To add a new migration create a migration with the filename matching ./migrations/{app}-v{version}.ts and use it in the `migrations` field on this
 *  migrator.
 *
 *  Migrations might read and write to the database and they should use StandardMigrations when needed.
 */
var OfflineStorageMigrator = /** @class */ (function () {
    function OfflineStorageMigrator(migrations, modelInfos) {
        this.migrations = migrations;
        this.modelInfos = modelInfos;
    }
    OfflineStorageMigrator.prototype.migrate = function (storage, sqlCipherFacade) {
        return __awaiter(this, void 0, void 0, function () {
            var meta, isNewDb, _i, _a, app, _b, _c, _d, app, version, migrate, storedVersion, _e, _f, app, compatibleSince, metaVersion;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, storage.dumpMetadata()];
                    case 1:
                        meta = _g.sent();
                        isNewDb = Object.keys(meta).length === 0;
                        _i = 0, _a = (0, tutanota_utils_1.typedKeys)(this.modelInfos);
                        _g.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        app = _a[_i];
                        return [4 /*yield*/, this.prepopulateVersionIfNecessary(app, this.modelInfos[app].version, meta, storage)];
                    case 3:
                        _g.sent();
                        _g.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        if (!isNewDb) return [3 /*break*/, 7];
                        console.log("new db, setting \"offline\" version to 1");
                        // this migration is not necessary for new databases and we want our canonical table definitions to represent the current state
                        return [4 /*yield*/, this.prepopulateVersionIfNecessary("offline", 1, meta, storage)];
                    case 6:
                        // this migration is not necessary for new databases and we want our canonical table definitions to represent the current state
                        _g.sent();
                        return [3 /*break*/, 9];
                    case 7: 
                    // we need to put 0 in because we expect all versions to be popylated
                    return [4 /*yield*/, this.prepopulateVersionIfNecessary("offline", 0, meta, storage)];
                    case 8:
                        // we need to put 0 in because we expect all versions to be popylated
                        _g.sent();
                        _g.label = 9;
                    case 9:
                        _b = 0, _c = this.migrations;
                        _g.label = 10;
                    case 10:
                        if (!(_b < _c.length)) return [3 /*break*/, 14];
                        _d = _c[_b], app = _d.app, version = _d.version, migrate = _d.migrate;
                        storedVersion = meta["".concat(app, "-version")];
                        if (!(storedVersion < version)) return [3 /*break*/, 13];
                        console.log("running offline db migration for ".concat(app, " from ").concat(storedVersion, " to ").concat(version));
                        return [4 /*yield*/, migrate(storage, sqlCipherFacade)];
                    case 11:
                        _g.sent();
                        console.log("migration finished");
                        return [4 /*yield*/, storage.setStoredModelVersion(app, version)];
                    case 12:
                        _g.sent();
                        _g.label = 13;
                    case 13:
                        _b++;
                        return [3 /*break*/, 10];
                    case 14: return [4 /*yield*/, storage.dumpMetadata()];
                    case 15:
                        // Check that all the necessary migrations have been run, at least to the point where we are compatible.
                        meta = _g.sent();
                        for (_e = 0, _f = (0, tutanota_utils_1.typedKeys)(this.modelInfos); _e < _f.length; _e++) {
                            app = _f[_e];
                            compatibleSince = this.modelInfos[app].compatibleSince;
                            metaVersion = meta["".concat(app, "-version")];
                            if (metaVersion < compatibleSince) {
                                throw new ProgrammingError_js_1.ProgrammingError("You forgot to migrate your databases! ".concat(app, ".version should be >= ").concat(this.modelInfos[app].compatibleSince, " but in db it is ").concat(metaVersion));
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * update the metadata table to initialize the row of the app with the given model version
     */
    OfflineStorageMigrator.prototype.prepopulateVersionIfNecessary = function (app, version, meta, storage) {
        return __awaiter(this, void 0, void 0, function () {
            var key, storedVersion;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        key = "".concat(app, "-version");
                        storedVersion = meta[key];
                        if (!(storedVersion == null)) return [3 /*break*/, 2];
                        meta[key] = version;
                        return [4 /*yield*/, storage.setStoredModelVersion(app, version)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    return OfflineStorageMigrator;
}());
exports.OfflineStorageMigrator = OfflineStorageMigrator;
