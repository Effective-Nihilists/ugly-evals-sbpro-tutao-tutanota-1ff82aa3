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
exports.CredentialsProvider = void 0;
var tutanota_utils_1 = require("@tutao/tutanota-utils");
/**
 * Main entry point to interact with credentials, i.e. storing and retrieving credentials from/to persistence.
 */
var CredentialsProvider = /** @class */ (function () {
    function CredentialsProvider(credentialsEncryption, storage, keyMigrator, databaseKeyFactory, sqliteCipherFacade, interWindowEventSender) {
        this.credentialsEncryption = credentialsEncryption;
        this.storage = storage;
        this.keyMigrator = keyMigrator;
        this.databaseKeyFactory = databaseKeyFactory;
        this.sqliteCipherFacade = sqliteCipherFacade;
        this.interWindowEventSender = interWindowEventSender;
    }
    /**
     * Stores credentials. If credentials already exist for login, they will be overwritten.
     * Also creates a database key
     */
    CredentialsProvider.prototype.store = function (credentialsAndKey) {
        return __awaiter(this, void 0, void 0, function () {
            var encryptedCredentials;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.credentialsEncryption.encrypt(credentialsAndKey)];
                    case 1:
                        encryptedCredentials = _a.sent();
                        this.storage.store(encryptedCredentials);
                        return [2 /*return*/];
                }
            });
        });
    };
    CredentialsProvider.prototype.getCredentialsInfoByUserId = function (userId) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var persistentCredentials;
            return __generator(this, function (_b) {
                persistentCredentials = this.storage.loadByUserId(userId);
                return [2 /*return*/, (_a = persistentCredentials === null || persistentCredentials === void 0 ? void 0 : persistentCredentials.credentialInfo) !== null && _a !== void 0 ? _a : null];
            });
        });
    };
    /**
     * Returns the full credentials for the userId passed in.
     * @param userId
     */
    CredentialsProvider.prototype.getCredentialsByUserId = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var persistentCredentials, decrypted, _a, reEncrypted;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        persistentCredentials = this.storage.loadByUserId(userId);
                        if (persistentCredentials == null) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, this.credentialsEncryption.decrypt(persistentCredentials)];
                    case 1:
                        decrypted = _b.sent();
                        if (!(decrypted.databaseKey == null)) return [3 /*break*/, 4];
                        // When offline mode is first released, there will be users who have saved credentials but no database key.
                        // In the future, we will never save credentials without it, but we need to create one here
                        _a = decrypted;
                        return [4 /*yield*/, this.databaseKeyFactory.generateKey()];
                    case 2:
                        // When offline mode is first released, there will be users who have saved credentials but no database key.
                        // In the future, we will never save credentials without it, but we need to create one here
                        _a.databaseKey = _b.sent();
                        if (!(decrypted.databaseKey != null)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.credentialsEncryption.encrypt(decrypted)];
                    case 3:
                        reEncrypted = _b.sent();
                        this.storage.store(reEncrypted);
                        _b.label = 4;
                    case 4: return [2 /*return*/, decrypted];
                }
            });
        });
    };
    /**
     * Returns the stored credentials infos of all internal users, i.e. users that have a "real" tutanota account and not the ones that
     * have a secure external mailbox.
     */
    CredentialsProvider.prototype.getInternalCredentialsInfos = function () {
        return __awaiter(this, void 0, void 0, function () {
            var allCredentials;
            return __generator(this, function (_a) {
                allCredentials = this.storage.loadAll().map(function (persistentCredentials) { return persistentCredentials.credentialInfo; });
                return [2 /*return*/, allCredentials.filter(function (credential) {
                        return credential.type === "internal";
                    })];
            });
        });
    };
    /**
     * Deletes stored credentials with specified userId.
     * No-op if credentials are not there.
     * @param opts.deleteOfflineDb whether to delete offline database. Will delete by default.
     */
    CredentialsProvider.prototype.deleteByUserId = function (userId, opts) {
        var _a, _b;
        if (opts === void 0) { opts = { deleteOfflineDb: true }; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, ((_a = this.interWindowEventSender) === null || _a === void 0 ? void 0 : _a.localUserDataInvalidated(userId))];
                    case 1:
                        _c.sent();
                        if (!opts.deleteOfflineDb) return [3 /*break*/, 3];
                        return [4 /*yield*/, ((_b = this.sqliteCipherFacade) === null || _b === void 0 ? void 0 : _b.deleteDb(userId))];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        this.storage.deleteByUserId(userId);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Sets the credentials encryption mode, i.e. how the intermediate key used for encrypting credentials is protected.
     * @param encryptionMode
     * @throws KeyPermanentlyInvalidatedError
     * @throws CredentialAuthenticationError
     */
    CredentialsProvider.prototype.setCredentialsEncryptionMode = function (encryptionMode) {
        return __awaiter(this, void 0, void 0, function () {
            var oldKeyEncrypted, oldEncryptionMode, newlyEncryptedKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (encryptionMode === this.getCredentialsEncryptionMode()) {
                            return [2 /*return*/];
                        }
                        oldKeyEncrypted = this.storage.getCredentialsEncryptionKey();
                        if (!oldKeyEncrypted) return [3 /*break*/, 2];
                        oldEncryptionMode = (0, tutanota_utils_1.assertNotNull)(this.storage.getCredentialEncryptionMode());
                        return [4 /*yield*/, this.keyMigrator.migrateCredentialsKey(oldKeyEncrypted, oldEncryptionMode, encryptionMode)];
                    case 1:
                        newlyEncryptedKey = _a.sent();
                        this.storage.setCredentialsEncryptionKey(newlyEncryptedKey);
                        _a.label = 2;
                    case 2:
                        this.storage.setCredentialEncryptionMode(encryptionMode);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns the credentials encryption mode, i.e. how the intermediate key used for encrypting credentials is protected.
     */
    CredentialsProvider.prototype.getCredentialsEncryptionMode = function () {
        return this.storage.getCredentialEncryptionMode();
    };
    /**
     * Returns all credentials encryption modes that are supported by the device.
     */
    CredentialsProvider.prototype.getSupportedEncryptionModes = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.credentialsEncryption.getSupportedEncryptionModes()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Removes all stored credentials as well as any settings associated with credentials encryption.
     */
    CredentialsProvider.prototype.clearCredentials = function (reason) {
        return __awaiter(this, void 0, void 0, function () {
            var storedCredentials, _i, storedCredentials_1, storedCredential;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.warn("clearing all stored credentials:", reason);
                        storedCredentials = this.storage.loadAll();
                        _i = 0, storedCredentials_1 = storedCredentials;
                        _a.label = 1;
                    case 1:
                        if (!(_i < storedCredentials_1.length)) return [3 /*break*/, 4];
                        storedCredential = storedCredentials_1[_i];
                        return [4 /*yield*/, this.deleteByUserId(storedCredential.credentialInfo.userId)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        this.storage.setCredentialsEncryptionKey(null);
                        this.storage.setCredentialEncryptionMode(null);
                        return [2 /*return*/];
                }
            });
        });
    };
    return CredentialsProvider;
}());
exports.CredentialsProvider = CredentialsProvider;
