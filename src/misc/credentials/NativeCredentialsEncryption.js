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
exports.NativeCredentialsEncryption = void 0;
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var CryptoError_js_1 = require("../../api/common/error/CryptoError.js");
var KeyPermanentlyInvalidatedError_js_1 = require("../../api/common/error/KeyPermanentlyInvalidatedError.js");
/**
 * Credentials encryption implementation that uses the native (platform-specific) keychain implementation. It uses an intermediate key to
 * encrypt the credentials stored on the device. The intermediate key in turn is encrypted using the native keychain.
 */
var NativeCredentialsEncryption = /** @class */ (function () {
    function NativeCredentialsEncryption(credentialsKeyProvider, deviceEncryptionFacade, nativeCredentials) {
        this.credentialsKeyProvider = credentialsKeyProvider;
        this.deviceEncryptionFacade = deviceEncryptionFacade;
        this.nativeCredentials = nativeCredentials;
    }
    NativeCredentialsEncryption.prototype.encrypt = function (_a) {
        var credentials = _a.credentials, databaseKey = _a.databaseKey;
        return __awaiter(this, void 0, void 0, function () {
            var encryptedPassword, credentialsKey, base64accessToken, encryptedAccessToken, encryptedAccessTokenBase64, encryptedDatabaseKeyBase64, encryptedDatabaseKey;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        encryptedPassword = credentials.encryptedPassword;
                        if (encryptedPassword == null) {
                            throw new Error("Trying to encrypt non-persistent credentials");
                        }
                        return [4 /*yield*/, this.credentialsKeyProvider.getCredentialsKey()];
                    case 1:
                        credentialsKey = _b.sent();
                        base64accessToken = (0, tutanota_utils_1.stringToUtf8Uint8Array)(credentials.accessToken);
                        return [4 /*yield*/, this.deviceEncryptionFacade.encrypt(credentialsKey, base64accessToken)];
                    case 2:
                        encryptedAccessToken = _b.sent();
                        encryptedAccessTokenBase64 = (0, tutanota_utils_1.uint8ArrayToBase64)(encryptedAccessToken);
                        encryptedDatabaseKeyBase64 = null;
                        if (!databaseKey) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.deviceEncryptionFacade.encrypt(credentialsKey, databaseKey)];
                    case 3:
                        encryptedDatabaseKey = _b.sent();
                        encryptedDatabaseKeyBase64 = (0, tutanota_utils_1.uint8ArrayToBase64)(encryptedDatabaseKey);
                        _b.label = 4;
                    case 4: return [2 /*return*/, {
                            credentialInfo: {
                                login: credentials.login,
                                userId: credentials.userId,
                                type: credentials.type
                            },
                            encryptedPassword: encryptedPassword,
                            accessToken: encryptedAccessTokenBase64,
                            databaseKey: encryptedDatabaseKeyBase64
                        }];
                }
            });
        });
    };
    NativeCredentialsEncryption.prototype.decrypt = function (encryptedCredentials) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var credentialsKey, accessToken, _b, databaseKey, _c, e_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.credentialsKeyProvider.getCredentialsKey()];
                    case 1:
                        credentialsKey = _d.sent();
                        _d.label = 2;
                    case 2:
                        _d.trys.push([2, 7, , 8]);
                        _b = tutanota_utils_1.utf8Uint8ArrayToString;
                        return [4 /*yield*/, this.deviceEncryptionFacade.decrypt(credentialsKey, (0, tutanota_utils_1.base64ToUint8Array)(encryptedCredentials.accessToken))];
                    case 3:
                        accessToken = _b.apply(void 0, [_d.sent()]);
                        if (!encryptedCredentials.databaseKey) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.deviceEncryptionFacade.decrypt(credentialsKey, (0, tutanota_utils_1.base64ToUint8Array)(encryptedCredentials.databaseKey))];
                    case 4:
                        _c = _d.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        _c = null;
                        _d.label = 6;
                    case 6:
                        databaseKey = _c;
                        return [2 /*return*/, {
                                credentials: {
                                    login: encryptedCredentials.credentialInfo.login,
                                    userId: encryptedCredentials.credentialInfo.userId,
                                    type: encryptedCredentials.credentialInfo.type,
                                    encryptedPassword: encryptedCredentials.encryptedPassword,
                                    accessToken: accessToken
                                },
                                databaseKey: databaseKey
                            }];
                    case 7:
                        e_1 = _d.sent();
                        if (e_1 instanceof CryptoError_js_1.CryptoError) {
                            // If the key could not be decrypted it means that something went very wrong. We will probably not be able to do anything about it so just
                            // delete everything.
                            throw new KeyPermanentlyInvalidatedError_js_1.KeyPermanentlyInvalidatedError("Could not decrypt credentials: ".concat((_a = e_1.stack) !== null && _a !== void 0 ? _a : e_1.message));
                        }
                        else {
                            throw e_1;
                        }
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    NativeCredentialsEncryption.prototype.getSupportedEncryptionModes = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.nativeCredentials.getSupportedEncryptionModes()];
            });
        });
    };
    return NativeCredentialsEncryption;
}());
exports.NativeCredentialsEncryption = NativeCredentialsEncryption;
