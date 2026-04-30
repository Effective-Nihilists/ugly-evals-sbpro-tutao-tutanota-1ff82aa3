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
exports.createCredentialsProvider = exports.hasKeychainAuthenticationOptions = exports.usingKeychainAuthentication = void 0;
var CredentialsProvider_js_1 = require("./CredentialsProvider.js");
var DeviceConfig_1 = require("../DeviceConfig");
var Env_1 = require("../../api/common/Env");
var CredentialsKeyProvider_1 = require("./CredentialsKeyProvider");
var NativeCredentialsEncryption_1 = require("./NativeCredentialsEncryption");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var DatabaseKeyFactory_1 = require("./DatabaseKeyFactory");
var CredentialsKeyMigrator_js_1 = require("./CredentialsKeyMigrator.js");
function usingKeychainAuthentication() {
    return (0, Env_1.isApp)() || (0, Env_1.isDesktop)();
}
exports.usingKeychainAuthentication = usingKeychainAuthentication;
function hasKeychainAuthenticationOptions() {
    return (0, Env_1.isApp)();
}
exports.hasKeychainAuthenticationOptions = hasKeychainAuthenticationOptions;
/**
 * Factory method for credentials provider that will return an instance injected with the implementations appropriate for the platform.
 * @param deviceEncryptionFacade
 * @param nativeApp: If {@code usingKeychainAuthentication} would return true, this _must not_ be null
 * @param interWindowEventSender
 */
function createCredentialsProvider(deviceEncryptionFacade, nativeApp, interWindowEventSender) {
    return __awaiter(this, void 0, void 0, function () {
        var NativeCredentialsFacadeSendDispatcher, SqlCipherFacadeSendDispatcher, nativeCredentials, credentialsKeyProvider, credentialsEncryption, credentialsKeyMigrator, sqlcipherFacade;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!usingKeychainAuthentication()) return [3 /*break*/, 3];
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../../native/common/generatedipc/NativeCredentialsFacadeSendDispatcher.js"); })];
                case 1:
                    NativeCredentialsFacadeSendDispatcher = (_a.sent()).NativeCredentialsFacadeSendDispatcher;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../../native/common/generatedipc/SqlCipherFacadeSendDispatcher.js"); })];
                case 2:
                    SqlCipherFacadeSendDispatcher = (_a.sent()).SqlCipherFacadeSendDispatcher;
                    nativeCredentials = new NativeCredentialsFacadeSendDispatcher((0, tutanota_utils_1.assertNotNull)(nativeApp));
                    credentialsKeyProvider = new CredentialsKeyProvider_1.CredentialsKeyProvider(nativeCredentials, DeviceConfig_1.deviceConfig, deviceEncryptionFacade);
                    credentialsEncryption = new NativeCredentialsEncryption_1.NativeCredentialsEncryption(credentialsKeyProvider, deviceEncryptionFacade, nativeCredentials);
                    credentialsKeyMigrator = new CredentialsKeyMigrator_js_1.DefaultCredentialsKeyMigrator(nativeCredentials);
                    sqlcipherFacade = nativeApp && (0, Env_1.isOfflineStorageAvailable)()
                        ? new SqlCipherFacadeSendDispatcher(nativeApp)
                        : null;
                    return [2 /*return*/, new CredentialsProvider_js_1.CredentialsProvider(credentialsEncryption, DeviceConfig_1.deviceConfig, credentialsKeyMigrator, new DatabaseKeyFactory_1.DatabaseKeyFactory(deviceEncryptionFacade), sqlcipherFacade, (0, Env_1.isDesktop)() ? interWindowEventSender : null)];
                case 3: return [2 /*return*/, new CredentialsProvider_js_1.CredentialsProvider(new CredentialsEncryptionStub(), DeviceConfig_1.deviceConfig, new CredentialsKeyMigrator_js_1.StubCredentialsKeyMigrator(), new DatabaseKeyFactory_1.DatabaseKeyFactory(deviceEncryptionFacade), null, null)];
            }
        });
    });
}
exports.createCredentialsProvider = createCredentialsProvider;
/**
 * This is a temporary stub that we will replace soon by some mechanism that will be able to utilize fingerprint/pin on mobile devices
 * for encryption of login data. Using this implementation does not mean we do not encrypt credentials currently since there is an
 * additional mechanism for credentials encryption using an access key stored server side. This is done in LoginFacade.
 */
var CredentialsEncryptionStub = /** @class */ (function () {
    function CredentialsEncryptionStub() {
    }
    CredentialsEncryptionStub.prototype.encrypt = function (_a) {
        var credentials = _a.credentials, databaseKey = _a.databaseKey;
        return __awaiter(this, void 0, void 0, function () {
            var encryptedPassword;
            return __generator(this, function (_b) {
                encryptedPassword = credentials.encryptedPassword;
                if (encryptedPassword == null) {
                    throw new Error("Trying to encrypt non-persistent credentials");
                }
                return [2 /*return*/, {
                        credentialInfo: {
                            login: credentials.login,
                            userId: credentials.userId,
                            type: credentials.type
                        },
                        encryptedPassword: encryptedPassword,
                        accessToken: credentials.accessToken,
                        databaseKey: null
                    }];
            });
        });
    };
    CredentialsEncryptionStub.prototype.decrypt = function (encryptedCredentials) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, {
                        credentials: {
                            login: encryptedCredentials.credentialInfo.login,
                            encryptedPassword: encryptedCredentials.encryptedPassword,
                            accessToken: encryptedCredentials.accessToken,
                            userId: encryptedCredentials.credentialInfo.userId,
                            type: encryptedCredentials.credentialInfo.type
                        },
                        databaseKey: null
                    }];
            });
        });
    };
    CredentialsEncryptionStub.prototype.getSupportedEncryptionModes = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, []];
            });
        });
    };
    return CredentialsEncryptionStub;
}());
