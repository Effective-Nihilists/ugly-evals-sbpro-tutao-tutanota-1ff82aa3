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
exports.logins = exports.LoginControllerImpl = void 0;
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Env_1 = require("../common/Env");
var WhitelabelCustomizations_1 = require("../../misc/WhitelabelCustomizations");
var RestError_1 = require("../common/error/RestError");
var ClientDetector_1 = require("../../misc/ClientDetector");
(0, Env_1.assertMainOrNodeBoot)();
var LoginControllerImpl = /** @class */ (function () {
    function LoginControllerImpl() {
        this.userController = null;
        this.customizations = null;
        this.partialLogin = (0, tutanota_utils_1.defer)();
        this._isWhitelabel = !!(0, WhitelabelCustomizations_1.getWhitelabelCustomizations)(window);
        this.postLoginActions = [];
        this.fullyLoggedIn = false;
        this.atLeastPartiallyLoggedIn = false;
    }
    LoginControllerImpl.prototype.init = function () {
        var _this = this;
        this.waitForFullLogin().then(function () { return __awaiter(_this, void 0, void 0, function () {
            var _i, _a, action;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.fullyLoggedIn = true;
                        return [4 /*yield*/, this.waitForPartialLogin()];
                    case 1:
                        _b.sent();
                        _i = 0, _a = this.postLoginActions;
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        action = _a[_i];
                        return [4 /*yield*/, action.onFullLoginSuccess({
                                sessionType: this.getUserController().sessionType,
                                userId: this.getUserController().userId
                            })];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    };
    LoginControllerImpl.prototype.getMainLocator = function () {
        return __awaiter(this, void 0, void 0, function () {
            var locator;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./MainLocator"); })];
                    case 1:
                        locator = (_a.sent()).locator;
                        return [4 /*yield*/, locator.initialized];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, locator];
                }
            });
        });
    };
    LoginControllerImpl.prototype.getLoginFacade = function () {
        return __awaiter(this, void 0, void 0, function () {
            var locator, worker;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getMainLocator()];
                    case 1:
                        locator = _a.sent();
                        worker = locator.worker;
                        return [4 /*yield*/, worker.initialized];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, locator.loginFacade];
                }
            });
        });
    };
    LoginControllerImpl.prototype.createSession = function (username, password, sessionType, databaseKey) {
        return __awaiter(this, void 0, void 0, function () {
            var loginFacade, _a, user, credentials, sessionId, userGroupInfo;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getLoginFacade()];
                    case 1:
                        loginFacade = _b.sent();
                        return [4 /*yield*/, loginFacade.createSession(username, password, ClientDetector_1.client.getIdentifier(), sessionType, databaseKey)];
                    case 2:
                        _a = _b.sent(), user = _a.user, credentials = _a.credentials, sessionId = _a.sessionId, userGroupInfo = _a.userGroupInfo;
                        return [4 /*yield*/, this.onPartialLoginSuccess({
                                user: user,
                                userGroupInfo: userGroupInfo,
                                sessionId: sessionId,
                                accessToken: credentials.accessToken,
                                sessionType: sessionType
                            }, sessionType)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, credentials];
                }
            });
        });
    };
    LoginControllerImpl.prototype.addPostLoginAction = function (handler) {
        this.postLoginActions.push(handler);
    };
    LoginControllerImpl.prototype.onPartialLoginSuccess = function (initData, sessionType) {
        return __awaiter(this, void 0, void 0, function () {
            var initUserController, _a, _i, _b, handler;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./UserController"); })];
                    case 1:
                        initUserController = (_c.sent()).initUserController;
                        _a = this;
                        return [4 /*yield*/, initUserController(initData)];
                    case 2:
                        _a.userController = _c.sent();
                        return [4 /*yield*/, this.loadCustomizations()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, this._determineIfWhitelabel()];
                    case 4:
                        _c.sent();
                        _i = 0, _b = this.postLoginActions;
                        _c.label = 5;
                    case 5:
                        if (!(_i < _b.length)) return [3 /*break*/, 8];
                        handler = _b[_i];
                        return [4 /*yield*/, handler.onPartialLoginSuccess({
                                sessionType: sessionType,
                                userId: initData.user._id
                            })];
                    case 6:
                        _c.sent();
                        _c.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 5];
                    case 8:
                        this.atLeastPartiallyLoggedIn = true;
                        this.partialLogin.resolve();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginControllerImpl.prototype.createExternalSession = function (userId, password, salt, clientIdentifier, sessionType) {
        return __awaiter(this, void 0, void 0, function () {
            var loginFacade, persistentSession, _a, user, credentials, sessionId, userGroupInfo;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getLoginFacade()];
                    case 1:
                        loginFacade = _b.sent();
                        persistentSession = sessionType === 2 /* SessionType.Persistent */;
                        return [4 /*yield*/, loginFacade.createExternalSession(userId, password, salt, clientIdentifier, persistentSession)];
                    case 2:
                        _a = _b.sent(), user = _a.user, credentials = _a.credentials, sessionId = _a.sessionId, userGroupInfo = _a.userGroupInfo;
                        return [4 /*yield*/, this.onPartialLoginSuccess({
                                user: user,
                                accessToken: credentials.accessToken,
                                sessionType: sessionType,
                                sessionId: sessionId,
                                userGroupInfo: userGroupInfo
                            }, 0 /* SessionType.Login */)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, credentials];
                }
            });
        });
    };
    LoginControllerImpl.prototype.resumeSession = function (_a, externalUserSalt, offlineTimeRangeDays) {
        var credentials = _a.credentials, databaseKey = _a.databaseKey;
        return __awaiter(this, void 0, void 0, function () {
            var loginFacade, resumeResult, _b, user, userGroupInfo, sessionId;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.getLoginFacade()];
                    case 1:
                        loginFacade = _c.sent();
                        return [4 /*yield*/, loginFacade.resumeSession(credentials, externalUserSalt !== null && externalUserSalt !== void 0 ? externalUserSalt : null, databaseKey !== null && databaseKey !== void 0 ? databaseKey : null, offlineTimeRangeDays !== null && offlineTimeRangeDays !== void 0 ? offlineTimeRangeDays : null)];
                    case 2:
                        resumeResult = _c.sent();
                        if (!(resumeResult.type === "error")) return [3 /*break*/, 3];
                        return [2 /*return*/, resumeResult];
                    case 3:
                        _b = resumeResult.data, user = _b.user, userGroupInfo = _b.userGroupInfo, sessionId = _b.sessionId;
                        return [4 /*yield*/, this.onPartialLoginSuccess({
                                user: user,
                                accessToken: credentials.accessToken,
                                userGroupInfo: userGroupInfo,
                                sessionId: sessionId,
                                sessionType: 2 /* SessionType.Persistent */
                            }, 2 /* SessionType.Persistent */)];
                    case 4:
                        _c.sent();
                        return [2 /*return*/, { type: "success" }];
                }
            });
        });
    };
    LoginControllerImpl.prototype.isUserLoggedIn = function () {
        return this.userController != null;
    };
    LoginControllerImpl.prototype.isFullyLoggedIn = function () {
        return this.fullyLoggedIn;
    };
    LoginControllerImpl.prototype.isAtLeastPartiallyLoggedIn = function () {
        return this.atLeastPartiallyLoggedIn;
    };
    LoginControllerImpl.prototype.waitForPartialLogin = function () {
        return this.partialLogin.promise;
    };
    LoginControllerImpl.prototype.waitForFullLogin = function () {
        return __awaiter(this, void 0, void 0, function () {
            var locator;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getMainLocator()
                        // Full login event might be received before we finish userLogin on the client side because they are done in parallel.
                        // So we make sure to wait for userLogin first.
                    ];
                    case 1:
                        locator = _a.sent();
                        // Full login event might be received before we finish userLogin on the client side because they are done in parallel.
                        // So we make sure to wait for userLogin first.
                        return [4 /*yield*/, this.waitForPartialLogin()];
                    case 2:
                        // Full login event might be received before we finish userLogin on the client side because they are done in parallel.
                        // So we make sure to wait for userLogin first.
                        _a.sent();
                        return [2 /*return*/, locator.loginListener.waitForFullLogin()];
                }
            });
        });
    };
    LoginControllerImpl.prototype.isInternalUserLoggedIn = function () {
        return this.isUserLoggedIn() && this.getUserController().isInternalUser();
    };
    LoginControllerImpl.prototype.isGlobalAdminUserLoggedIn = function () {
        return this.isUserLoggedIn() && this.getUserController().isGlobalAdmin();
    };
    LoginControllerImpl.prototype.getUserController = function () {
        return (0, tutanota_utils_1.assertNotNull)(this.userController); // only to be used after login (when user is defined)
    };
    LoginControllerImpl.prototype.isEnabled = function (feature) {
        return this.customizations != null ? this.customizations.indexOf(feature) !== -1 : false;
    };
    LoginControllerImpl.prototype.loadCustomizations = function () {
        var _this = this;
        if (this.isInternalUserLoggedIn()) {
            return this.getUserController()
                .loadCustomer()
                .then(function (customer) {
                _this.customizations = customer.customizations.map(function (f) { return f.feature; });
            });
        }
        else {
            return Promise.resolve();
        }
    };
    LoginControllerImpl.prototype.logout = function (sync) {
        return __awaiter(this, void 0, void 0, function () {
            var locator;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.userController) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.userController.deleteSession(sync)];
                    case 1:
                        _a.sent();
                        this.userController = null;
                        this.partialLogin = (0, tutanota_utils_1.defer)();
                        this.fullyLoggedIn = false;
                        return [4 /*yield*/, this.getMainLocator()];
                    case 2:
                        locator = _a.sent();
                        locator.loginListener.reset();
                        this.init();
                        return [3 /*break*/, 4];
                    case 3:
                        console.log("No session to delete");
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    LoginControllerImpl.prototype._determineIfWhitelabel = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.getUserController().isWhitelabelAccount()];
                    case 1:
                        _a._isWhitelabel = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginControllerImpl.prototype.isWhitelabel = function () {
        return this._isWhitelabel;
    };
    LoginControllerImpl.prototype.deleteOldSession = function (credentials) {
        return __awaiter(this, void 0, void 0, function () {
            var loginFacade, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getLoginFacade()];
                    case 1:
                        loginFacade = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, loginFacade.deleteSession(credentials.accessToken)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        if (e_1 instanceof RestError_1.NotFoundError) {
                            console.log("session already deleted");
                        }
                        else {
                            throw e_1;
                        }
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    LoginControllerImpl.prototype.retryAsyncLogin = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loginFacade, locator;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getLoginFacade()];
                    case 1:
                        loginFacade = _a.sent();
                        return [4 /*yield*/, this.getMainLocator()];
                    case 2:
                        locator = _a.sent();
                        locator.loginListener.onRetryLogin();
                        return [4 /*yield*/, loginFacade.retryAsyncLogin()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return LoginControllerImpl;
}());
exports.LoginControllerImpl = LoginControllerImpl;
var loginController = new LoginControllerImpl();
exports.logins = loginController;
// Should be called elsewhere later e.g. in mainLocator
loginController.init();
