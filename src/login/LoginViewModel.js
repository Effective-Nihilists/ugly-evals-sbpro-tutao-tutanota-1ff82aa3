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
exports.LoginViewModel = void 0;
var RestError_1 = require("../api/common/error/RestError");
var LoginUtils_1 = require("../misc/LoginUtils");
var stream_1 = require("mithril/stream");
var ProgrammingError_1 = require("../api/common/error/ProgrammingError");
var CredentialAuthenticationError_1 = require("../api/common/error/CredentialAuthenticationError");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var KeyPermanentlyInvalidatedError_1 = require("../api/common/error/KeyPermanentlyInvalidatedError");
var Env_1 = require("../api/common/Env");
var DeviceStorageUnavailableError_1 = require("../api/common/error/DeviceStorageUnavailableError");
(0, Env_1.assertMainOrNode)();
var LoginViewModel = /** @class */ (function () {
    function LoginViewModel(loginController, credentialsProvider, secondFactorHandler, databaseKeyFactory, deviceConfig) {
        this.loginController = loginController;
        this.credentialsProvider = credentialsProvider;
        this.secondFactorHandler = secondFactorHandler;
        this.databaseKeyFactory = databaseKeyFactory;
        this.deviceConfig = deviceConfig;
        this.state = "NotAuthenticated" /* LoginState.NotAuthenticated */;
        this.displayMode = "form" /* DisplayMode.Form */;
        this.helpText = "emptyString_msg";
        this.mailAddress = (0, stream_1["default"])("");
        this.password = (0, stream_1["default"])("");
        this._autoLoginCredentials = null;
        this.savePassword = (0, stream_1["default"])(false);
        this.savedInternalCredentials = [];
    }
    /**
     * This method should be called right after creation of the view model by whoever created the viewmodel. The view model will not be
     * fully functional before this method has been called!
     * @returns {Promise<void>}
     */
    LoginViewModel.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._updateCachedCredentials()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginViewModel.prototype.useUserId = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.credentialsProvider.getCredentialsInfoByUserId(userId)];
                    case 1:
                        _a._autoLoginCredentials = _b.sent();
                        if (this._autoLoginCredentials) {
                            this.displayMode = "credentials" /* DisplayMode.Credentials */;
                        }
                        else {
                            this.displayMode = "form" /* DisplayMode.Form */;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginViewModel.prototype.canLogin = function () {
        if (this.displayMode === "credentials" /* DisplayMode.Credentials */) {
            return this._autoLoginCredentials != null || this.savedInternalCredentials.length === 1;
        }
        else if (this.displayMode === "form" /* DisplayMode.Form */) {
            return Boolean(this.mailAddress() && this.password());
        }
        else {
            return false;
        }
    };
    LoginViewModel.prototype.useCredentials = function (encryptedCredentials) {
        return __awaiter(this, void 0, void 0, function () {
            var credentialsInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.credentialsProvider.getCredentialsInfoByUserId(encryptedCredentials.userId)];
                    case 1:
                        credentialsInfo = _a.sent();
                        if (credentialsInfo) {
                            this._autoLoginCredentials = credentialsInfo;
                            this.displayMode = "credentials" /* DisplayMode.Credentials */;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginViewModel.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.state === "LoggingIn" /* LoginState.LoggingIn */)
                            return [2 /*return*/];
                        this.state = "LoggingIn" /* LoginState.LoggingIn */;
                        if (!(this.displayMode === "credentials" /* DisplayMode.Credentials */ || this.displayMode === "deleteCredentials" /* DisplayMode.DeleteCredentials */)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._autologin()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 2:
                        if (!(this.displayMode === "form" /* DisplayMode.Form */)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this._formLogin()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4: throw new ProgrammingError_1.ProgrammingError("Cannot login with current display mode: ".concat(this.displayMode));
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    LoginViewModel.prototype.deleteCredentials = function (encryptedCredentials) {
        return __awaiter(this, void 0, void 0, function () {
            var credentials, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 7]);
                        return [4 /*yield*/, this.credentialsProvider.getCredentialsByUserId(encryptedCredentials.userId)];
                    case 1:
                        /**
                         * We have to decrypt the credentials here (and hence deal with any potential errors), because :LoginController.deleteOldSession
                         * expects the full credentials. The reason for this is that the accessToken contained within credentials has a double function:
                         * 1. It is used as an actual access token to re-authenticate
                         * 2. It is used as a session ID
                         * Since we want to also delete the session from the server, we need the (decrypted) accessToken in its function as a session id.
                         */
                        credentials = _a.sent();
                        return [3 /*break*/, 7];
                    case 2:
                        e_1 = _a.sent();
                        if (!(e_1 instanceof KeyPermanentlyInvalidatedError_1.KeyPermanentlyInvalidatedError)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.credentialsProvider.clearCredentials(e_1)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this._updateCachedCredentials()];
                    case 4:
                        _a.sent();
                        this.state = "NotAuthenticated" /* LoginState.NotAuthenticated */;
                        return [2 /*return*/];
                    case 5:
                        if (e_1 instanceof CredentialAuthenticationError_1.CredentialAuthenticationError) {
                            this.helpText = (0, LoginUtils_1.getLoginErrorMessage)(e_1, false);
                            return [2 /*return*/];
                        }
                        else {
                            throw e_1;
                        }
                        _a.label = 6;
                    case 6: return [3 /*break*/, 7];
                    case 7:
                        if (!credentials) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.loginController.deleteOldSession(credentials.credentials)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, this.credentialsProvider.deleteByUserId(credentials.credentials.userId)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, this._updateCachedCredentials()];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    LoginViewModel.prototype.getSavedCredentials = function () {
        return this.savedInternalCredentials;
    };
    LoginViewModel.prototype.switchDeleteState = function () {
        if (this.displayMode === "deleteCredentials" /* DisplayMode.DeleteCredentials */) {
            this.displayMode = "credentials" /* DisplayMode.Credentials */;
        }
        else if (this.displayMode === "credentials" /* DisplayMode.Credentials */) {
            this.displayMode = "deleteCredentials" /* DisplayMode.DeleteCredentials */;
        }
        else {
            throw new ProgrammingError_1.ProgrammingError("invalid state");
        }
    };
    LoginViewModel.prototype.showLoginForm = function () {
        this.displayMode = "form" /* DisplayMode.Form */;
        this.helpText = "emptyString_msg";
    };
    LoginViewModel.prototype.showCredentials = function () {
        this.displayMode = "credentials" /* DisplayMode.Credentials */;
        this.helpText = "emptyString_msg";
    };
    LoginViewModel.prototype._updateCachedCredentials = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.credentialsProvider.getInternalCredentialsInfos()];
                    case 1:
                        _a.savedInternalCredentials = _b.sent();
                        this._autoLoginCredentials = null;
                        if (this.savedInternalCredentials.length > 0) {
                            if (this.displayMode !== "deleteCredentials" /* DisplayMode.DeleteCredentials */) {
                                this.displayMode = "credentials" /* DisplayMode.Credentials */;
                            }
                        }
                        else {
                            this.displayMode = "form" /* DisplayMode.Form */;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginViewModel.prototype._autologin = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var allCredentials, credentials, offlineTimeRange, result, e_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 8, , 18]);
                        if (!(this._autoLoginCredentials == null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.credentialsProvider.getInternalCredentialsInfos()];
                    case 1:
                        allCredentials = _c.sent();
                        this._autoLoginCredentials = (0, tutanota_utils_1.first)(allCredentials);
                        _c.label = 2;
                    case 2:
                        if (!this._autoLoginCredentials) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.credentialsProvider.getCredentialsByUserId(this._autoLoginCredentials.userId)];
                    case 3:
                        credentials = _c.sent();
                        if (!credentials) return [3 /*break*/, 7];
                        offlineTimeRange = this.deviceConfig.getOfflineTimeRangeDays(this._autoLoginCredentials.userId);
                        return [4 /*yield*/, this.loginController.resumeSession(credentials, null, offlineTimeRange)];
                    case 4:
                        result = _c.sent();
                        if (!(result.type == "success")) return [3 /*break*/, 6];
                        return [4 /*yield*/, this._onLogin()];
                    case 5:
                        _c.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        this.state = "NotAuthenticated" /* LoginState.NotAuthenticated */;
                        this.helpText = "offlineLoginPremiumOnly_msg";
                        _c.label = 7;
                    case 7: return [3 /*break*/, 18];
                    case 8:
                        e_2 = _c.sent();
                        if (!(e_2 instanceof RestError_1.NotAuthenticatedError && this._autoLoginCredentials)) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.credentialsProvider.deleteByUserId(this._autoLoginCredentials.userId)];
                    case 9:
                        _c.sent();
                        return [4 /*yield*/, this._updateCachedCredentials()];
                    case 10:
                        _c.sent();
                        return [4 /*yield*/, this._onLoginFailed(e_2)];
                    case 11:
                        _c.sent();
                        return [3 /*break*/, 17];
                    case 12:
                        if (!(e_2 instanceof KeyPermanentlyInvalidatedError_1.KeyPermanentlyInvalidatedError)) return [3 /*break*/, 15];
                        return [4 /*yield*/, this.credentialsProvider.clearCredentials(e_2)];
                    case 13:
                        _c.sent();
                        return [4 /*yield*/, this._updateCachedCredentials()];
                    case 14:
                        _c.sent();
                        this.state = "NotAuthenticated" /* LoginState.NotAuthenticated */;
                        this.helpText = "credentialsKeyInvalidated_msg";
                        return [3 /*break*/, 17];
                    case 15: return [4 /*yield*/, this._onLoginFailed(e_2)];
                    case 16:
                        _c.sent();
                        _c.label = 17;
                    case 17: return [3 /*break*/, 18];
                    case 18:
                        if (this.state === "AccessExpired" /* LoginState.AccessExpired */ || this.state === "InvalidCredentials" /* LoginState.InvalidCredentials */) {
                            this.displayMode = "form" /* DisplayMode.Form */;
                            this.mailAddress((_b = (_a = this._autoLoginCredentials) === null || _a === void 0 ? void 0 : _a.login) !== null && _b !== void 0 ? _b : "");
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginViewModel.prototype._formLogin = function () {
        return __awaiter(this, void 0, void 0, function () {
            var mailAddress, password, savePassword, sessionType, newDatabaseKey, newCredentials_1, storedCredentialsToDelete, _i, storedCredentialsToDelete_1, credentialToDelete, credentials, e_3, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mailAddress = this.mailAddress();
                        password = this.password();
                        savePassword = this.savePassword();
                        if (mailAddress === "" || password === "") {
                            this.state = "InvalidCredentials" /* LoginState.InvalidCredentials */;
                            this.helpText = "loginFailed_msg";
                            return [2 /*return*/];
                        }
                        this.helpText = "login_msg";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 20, 22, 24]);
                        sessionType = savePassword ? 2 /* SessionType.Persistent */ : 0 /* SessionType.Login */;
                        newDatabaseKey = null;
                        if (!(sessionType === 2 /* SessionType.Persistent */)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.databaseKeyFactory.generateKey()];
                    case 2:
                        newDatabaseKey = _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.loginController.createSession(mailAddress, password, sessionType, newDatabaseKey)];
                    case 4:
                        newCredentials_1 = _a.sent();
                        return [4 /*yield*/, this._onLogin()
                            // we don't want to have multiple credentials that
                            // * share the same userId with different mail addresses (may happen if a user chooses a different alias to log in than the one they saved)
                            // * share the same mail address (may happen if mail aliases are moved between users)
                        ];
                    case 5:
                        _a.sent();
                        storedCredentialsToDelete = this.savedInternalCredentials.filter(function (c) { return c.login === mailAddress || c.userId === newCredentials_1.userId; });
                        _i = 0, storedCredentialsToDelete_1 = storedCredentialsToDelete;
                        _a.label = 6;
                    case 6:
                        if (!(_i < storedCredentialsToDelete_1.length)) return [3 /*break*/, 11];
                        credentialToDelete = storedCredentialsToDelete_1[_i];
                        return [4 /*yield*/, this.credentialsProvider.getCredentialsByUserId(credentialToDelete.userId)];
                    case 7:
                        credentials = _a.sent();
                        if (!credentials) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.loginController.deleteOldSession(credentials.credentials)
                            // we handled the deletion of the offlineDb in createSession already
                        ];
                    case 8:
                        _a.sent();
                        // we handled the deletion of the offlineDb in createSession already
                        return [4 /*yield*/, this.credentialsProvider.deleteByUserId(credentials.credentials.userId, { deleteOfflineDb: false })];
                    case 9:
                        // we handled the deletion of the offlineDb in createSession already
                        _a.sent();
                        _a.label = 10;
                    case 10:
                        _i++;
                        return [3 /*break*/, 6];
                    case 11:
                        if (!savePassword) return [3 /*break*/, 19];
                        _a.label = 12;
                    case 12:
                        _a.trys.push([12, 14, , 19]);
                        return [4 /*yield*/, this.credentialsProvider.store({
                                credentials: newCredentials_1,
                                databaseKey: newDatabaseKey
                            })];
                    case 13:
                        _a.sent();
                        return [3 /*break*/, 19];
                    case 14:
                        e_3 = _a.sent();
                        if (!(e_3 instanceof KeyPermanentlyInvalidatedError_1.KeyPermanentlyInvalidatedError)) return [3 /*break*/, 17];
                        return [4 /*yield*/, this.credentialsProvider.clearCredentials(e_3)];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, this._updateCachedCredentials()];
                    case 16:
                        _a.sent();
                        return [3 /*break*/, 18];
                    case 17:
                        if (e_3 instanceof DeviceStorageUnavailableError_1.DeviceStorageUnavailableError) {
                            console.warn("device storage unavailable, cannot save credentials:", e_3);
                        }
                        else {
                            throw e_3;
                        }
                        _a.label = 18;
                    case 18: return [3 /*break*/, 19];
                    case 19: return [3 /*break*/, 24];
                    case 20:
                        e_4 = _a.sent();
                        if (e_4 instanceof DeviceStorageUnavailableError_1.DeviceStorageUnavailableError) {
                            console.warn("cannot log in: failed to get credentials from device storage", e_4);
                        }
                        return [4 /*yield*/, this._onLoginFailed(e_4)];
                    case 21:
                        _a.sent();
                        return [3 /*break*/, 24];
                    case 22: return [4 /*yield*/, this.secondFactorHandler.closeWaitingForSecondFactorDialog()];
                    case 23:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 24: return [2 /*return*/];
                }
            });
        });
    };
    LoginViewModel.prototype._onLogin = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.helpText = "emptyString_msg";
                this.state = "LoggedIn" /* LoginState.LoggedIn */;
                return [2 /*return*/];
            });
        });
    };
    LoginViewModel.prototype._onLoginFailed = function (error) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.helpText = (0, LoginUtils_1.getLoginErrorMessage)(error, false);
                if (error instanceof RestError_1.BadRequestError || error instanceof RestError_1.NotAuthenticatedError) {
                    this.state = "InvalidCredentials" /* LoginState.InvalidCredentials */;
                }
                else if (error instanceof RestError_1.AccessExpiredError) {
                    this.state = "AccessExpired" /* LoginState.AccessExpired */;
                }
                else {
                    this.state = "UnknownError" /* LoginState.UnknownError */;
                }
                (0, LoginUtils_1.handleExpectedLoginError)(error, tutanota_utils_1.noOp);
                return [2 /*return*/];
            });
        });
    };
    return LoginViewModel;
}());
exports.LoginViewModel = LoginViewModel;
