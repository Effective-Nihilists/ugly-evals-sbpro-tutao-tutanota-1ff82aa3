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
exports.LoginFacade = void 0;
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Services_1 = require("../../entities/sys/Services");
var TutanotaConstants_1 = require("../../common/TutanotaConstants");
var CryptoError_1 = require("../../common/error/CryptoError");
var TypeRefs_js_1 = require("../../entities/sys/TypeRefs.js");
var TypeRefs_js_2 = require("../../entities/tutanota/TypeRefs.js");
var EntityFunctions_1 = require("../../common/EntityFunctions");
var Env_1 = require("../../common/Env");
var EntityRestClient_1 = require("../rest/EntityRestClient");
var RestError_1 = require("../../common/error/RestError");
var CancelledError_1 = require("../../common/error/CancelledError");
var EntityClient_1 = require("../../common/EntityClient");
var EntityUtils_1 = require("../../common/utils/EntityUtils");
var tutanota_crypto_1 = require("@tutao/tutanota-crypto");
var CryptoFacade_1 = require("../crypto/CryptoFacade");
var Services_2 = require("../../entities/tutanota/Services");
var LoginIncompleteError_js_1 = require("../../common/error/LoginIncompleteError.js");
(0, Env_1.assertWorkerOrNode)();
var RETRY_TIMOUT_AFTER_INIT_INDEXER_ERROR_MS = 30000;
var LoginFacade = /** @class */ (function () {
    function LoginFacade(worker, restClient, entityClient, loginListener, instanceMapper, cryptoFacade, 
    /**
     *  Only needed so that we can initialize the offline storage after login.
     *  This is necessary because we don't know if we'll be persistent or not until the user tries to login
     *  Once the credentials handling has been changed to *always* save in desktop, then this should become obsolete
     */
    cacheInitializer, serviceExecutor, userFacade) {
        this.worker = worker;
        this.restClient = restClient;
        this.entityClient = entityClient;
        this.loginListener = loginListener;
        this.instanceMapper = instanceMapper;
        this.cryptoFacade = cryptoFacade;
        this.cacheInitializer = cacheInitializer;
        this.serviceExecutor = serviceExecutor;
        this.userFacade = userFacade;
        /**
         * Used for cancelling second factor and to not mix different attempts
         */
        this.loginRequestSessionId = null;
        /**
         * Used for cancelling second factor immediately
         */
        this.loggingInPromiseWrapper = null;
        /** On platforms with offline cache we do the actual login asynchronously and we can retry it. This is the state of such async login. */
        this.asyncLoginState = { state: "idle" };
    }
    LoginFacade.prototype.init = function (indexer, eventBusClient) {
        this.indexer = indexer;
        this.eventBusClient = eventBusClient;
    };
    LoginFacade.prototype.resetSession = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.eventBusClient.close("terminate" /* CloseEventBusOption.Terminate */);
                        return [4 /*yield*/, this.deInitCache()];
                    case 1:
                        _a.sent();
                        this.userFacade.reset();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Create session and log in. Changes internal state to refer to the logged in user.
     */
    LoginFacade.prototype.createSession = function (mailAddress, passphrase, clientIdentifier, sessionType, databaseKey) {
        return __awaiter(this, void 0, void 0, function () {
            var userPassphraseKey, authVerifier, createSessionData, accessKey, createSessionReturn, sessionData, cacheInfo, _a, user, userGroupInfo, accessToken;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.userFacade.isPartiallyLoggedIn()) {
                            // do not reset here because the event bus client needs to be kept if the same user is logged in as before
                            console.log("session already exists, reuse data");
                            // check if it is the same user in _initSession()
                        }
                        return [4 /*yield*/, this.loadUserPassphraseKey(mailAddress, passphrase)
                            // the verifier is always sent as url parameter, so it must be url encoded
                        ];
                    case 1:
                        userPassphraseKey = _b.sent();
                        authVerifier = (0, tutanota_crypto_1.createAuthVerifierAsBase64Url)(userPassphraseKey);
                        createSessionData = (0, TypeRefs_js_1.createCreateSessionData)({
                            mailAddress: mailAddress.toLowerCase().trim(),
                            clientIdentifier: clientIdentifier,
                            authVerifier: authVerifier
                        });
                        accessKey = null;
                        if (sessionType === 2 /* SessionType.Persistent */) {
                            accessKey = (0, tutanota_crypto_1.aes128RandomKey)();
                            createSessionData.accessKey = (0, tutanota_crypto_1.keyToUint8Array)(accessKey);
                        }
                        return [4 /*yield*/, this.serviceExecutor.post(Services_1.SessionService, createSessionData)];
                    case 2:
                        createSessionReturn = _b.sent();
                        return [4 /*yield*/, this.waitUntilSecondFactorApprovedOrCancelled(createSessionReturn, mailAddress)];
                    case 3:
                        sessionData = _b.sent();
                        return [4 /*yield*/, this.initCache({
                                userId: sessionData.userId,
                                databaseKey: databaseKey,
                                timeRangeDays: null,
                                forceNewDatabase: true
                            })];
                    case 4:
                        cacheInfo = _b.sent();
                        return [4 /*yield*/, this.initSession(sessionData.userId, sessionData.accessToken, userPassphraseKey, sessionType, cacheInfo)];
                    case 5:
                        _a = _b.sent(), user = _a.user, userGroupInfo = _a.userGroupInfo, accessToken = _a.accessToken;
                        return [2 /*return*/, {
                                user: user,
                                userGroupInfo: userGroupInfo,
                                sessionId: sessionData.sessionId,
                                credentials: {
                                    login: mailAddress,
                                    accessToken: accessToken,
                                    encryptedPassword: sessionType === 2 /* SessionType.Persistent */ ? (0, tutanota_utils_1.uint8ArrayToBase64)((0, CryptoFacade_1.encryptString)((0, tutanota_utils_1.neverNull)(accessKey), passphrase)) : null,
                                    userId: sessionData.userId,
                                    type: "internal"
                                }
                            }];
                }
            });
        });
    };
    /**
     * If the second factor login has been cancelled a CancelledError is thrown.
     */
    LoginFacade.prototype.waitUntilSecondFactorApprovedOrCancelled = function (createSessionReturn, mailAddress) {
        var p = Promise.resolve();
        var sessionId = [this.getSessionListId(createSessionReturn.accessToken), this.getSessionElementId(createSessionReturn.accessToken)];
        this.loginRequestSessionId = sessionId;
        if (createSessionReturn.challenges.length > 0) {
            // Show a message to the user and give them a chance to complete the challenges.
            this.loginListener.onSecondFactorChallenge(sessionId, createSessionReturn.challenges, mailAddress);
            p = this.waitUntilSecondFactorApproved(createSessionReturn.accessToken, sessionId, 0);
        }
        this.loggingInPromiseWrapper = (0, tutanota_utils_1.defer)();
        // Wait for either login or cancel
        return Promise.race([this.loggingInPromiseWrapper.promise, p]).then(function () { return ({
            sessionId: sessionId,
            accessToken: createSessionReturn.accessToken,
            userId: createSessionReturn.user
        }); });
    };
    LoginFacade.prototype.waitUntilSecondFactorApproved = function (accessToken, sessionId, retryOnNetworkError) {
        return __awaiter(this, void 0, void 0, function () {
            var secondFactorAuthGetData, secondFactorAuthGetReturn, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        secondFactorAuthGetData = (0, TypeRefs_js_1.createSecondFactorAuthGetData)();
                        secondFactorAuthGetData.accessToken = accessToken;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.serviceExecutor.get(Services_1.SecondFactorAuthService, secondFactorAuthGetData)];
                    case 2:
                        secondFactorAuthGetReturn = _a.sent();
                        if (!this.loginRequestSessionId || !(0, EntityUtils_1.isSameId)(this.loginRequestSessionId, sessionId)) {
                            throw new CancelledError_1.CancelledError("login cancelled");
                        }
                        if (secondFactorAuthGetReturn.secondFactorPending) {
                            return [2 /*return*/, this.waitUntilSecondFactorApproved(accessToken, sessionId, 0)];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        if (e_1 instanceof RestError_1.ConnectionError && retryOnNetworkError < 10) {
                            // connection error can occur on ios when switching between apps, just retry in this case.
                            return [2 /*return*/, this.waitUntilSecondFactorApproved(accessToken, sessionId, retryOnNetworkError + 1)];
                        }
                        throw e_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Create external (temporary mailbox for password-protected emails) session and log in.
     * Changes internal state to refer to the logged in user.
     */
    LoginFacade.prototype.createExternalSession = function (userId, passphrase, salt, clientIdentifier, persistentSession) {
        return __awaiter(this, void 0, void 0, function () {
            var userPassphraseKey, authVerifier, authToken, sessionData, accessKey, createSessionReturn, sessionId, cacheInfo, _a, user, userGroupInfo, accessToken;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.userFacade.isPartiallyLoggedIn()) {
                            throw new Error("user already logged in");
                        }
                        console.log("login external worker");
                        userPassphraseKey = (0, tutanota_crypto_1.generateKeyFromPassphrase)(passphrase, salt, tutanota_crypto_1.KeyLength.b128);
                        authVerifier = (0, tutanota_crypto_1.createAuthVerifierAsBase64Url)(userPassphraseKey);
                        authToken = (0, tutanota_utils_1.base64ToBase64Url)((0, tutanota_utils_1.uint8ArrayToBase64)((0, tutanota_crypto_1.sha256Hash)(salt)));
                        sessionData = (0, TypeRefs_js_1.createCreateSessionData)();
                        sessionData.user = userId;
                        sessionData.authToken = authToken;
                        sessionData.clientIdentifier = clientIdentifier;
                        sessionData.authVerifier = authVerifier;
                        accessKey = null;
                        if (persistentSession) {
                            accessKey = (0, tutanota_crypto_1.aes128RandomKey)();
                            sessionData.accessKey = (0, tutanota_crypto_1.keyToUint8Array)(accessKey);
                        }
                        return [4 /*yield*/, this.serviceExecutor.post(Services_1.SessionService, sessionData)];
                    case 1:
                        createSessionReturn = _b.sent();
                        sessionId = [this.getSessionListId(createSessionReturn.accessToken), this.getSessionElementId(createSessionReturn.accessToken)];
                        return [4 /*yield*/, this.initCache({
                                userId: userId,
                                databaseKey: null,
                                timeRangeDays: null,
                                forceNewDatabase: true
                            })];
                    case 2:
                        cacheInfo = _b.sent();
                        return [4 /*yield*/, this.initSession(createSessionReturn.user, createSessionReturn.accessToken, userPassphraseKey, 0 /* SessionType.Login */, cacheInfo)];
                    case 3:
                        _a = _b.sent(), user = _a.user, userGroupInfo = _a.userGroupInfo, accessToken = _a.accessToken;
                        return [2 /*return*/, {
                                user: user,
                                userGroupInfo: userGroupInfo,
                                sessionId: sessionId,
                                credentials: {
                                    login: userId,
                                    accessToken: accessToken,
                                    encryptedPassword: accessKey ? (0, tutanota_utils_1.uint8ArrayToBase64)((0, CryptoFacade_1.encryptString)(accessKey, passphrase)) : null,
                                    userId: userId,
                                    type: "external"
                                }
                            }];
                }
            });
        });
    };
    /** Cancels 2FA process. */
    LoginFacade.prototype.cancelCreateSession = function (sessionId) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var secondFactorAuthDeleteData;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.loginRequestSessionId || !(0, EntityUtils_1.isSameId)(this.loginRequestSessionId, sessionId)) {
                            throw new Error("Trying to cancel session creation but the state is invalid");
                        }
                        secondFactorAuthDeleteData = (0, TypeRefs_js_1.createSecondFactorAuthDeleteData)({
                            session: sessionId
                        });
                        return [4 /*yield*/, this.serviceExecutor["delete"](Services_1.SecondFactorAuthService, secondFactorAuthDeleteData)["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotFoundError, function (e) {
                                // This can happen during some odd behavior in browser where main loop would be blocked by webauthn (hello, FF) and then we would try to
                                // cancel too late. No harm here anyway if the session is already gone.
                                console.warn("Tried to cancel second factor but it was not there anymore", e);
                            }))];
                    case 1:
                        _b.sent();
                        this.loginRequestSessionId = null;
                        (_a = this.loggingInPromiseWrapper) === null || _a === void 0 ? void 0 : _a.reject(new CancelledError_1.CancelledError("login cancelled"));
                        return [2 /*return*/];
                }
            });
        });
    };
    /** Finishes 2FA process either using second factor or approving session on another client. */
    LoginFacade.prototype.authenticateWithSecondFactor = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.serviceExecutor.post(Services_1.SecondFactorAuthService, data)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Resumes previously created session (using persisted credentials).
     * @param credentials the saved credentials to use
     * @param externalUserSalt
     * @param databaseKey key to unlock the local database (if enabled)
     * @param timeRangeDays the user configured time range for the offline database
     */
    LoginFacade.prototype.resumeSession = function (credentials, externalUserSalt, databaseKey, timeRangeDays) {
        return __awaiter(this, void 0, void 0, function () {
            var cacheInfo, sessionId, user, userGroupInfo, e_2, data, e_3;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.userFacade.setAccessToken(credentials.accessToken);
                        return [4 /*yield*/, this.initCache({
                                userId: credentials.userId,
                                databaseKey: databaseKey,
                                timeRangeDays: timeRangeDays,
                                forceNewDatabase: false
                            })];
                    case 1:
                        cacheInfo = _a.sent();
                        sessionId = this.getSessionId(credentials);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 16, , 18]);
                        if (!((cacheInfo === null || cacheInfo === void 0 ? void 0 : cacheInfo.isPersistent) && !cacheInfo.isNewOfflineDb)) return [3 /*break*/, 13];
                        return [4 /*yield*/, this.entityClient.load(TypeRefs_js_1.UserTypeRef, credentials.userId)];
                    case 3:
                        user = _a.sent();
                        if (!(user.accountType !== TutanotaConstants_1.AccountType.PREMIUM)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.finishResumeSession(credentials, externalUserSalt, cacheInfo)["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.ConnectionError, function (e) {
                                return { type: "error", reason: 0 /* ResumeSessionErrorReason.OfflineNotAvailableForFree */ };
                            }))];
                    case 4: 
                    // if account is free do not start offline login/async login workflow.
                    // await before return to catch errors here instead of up the stack
                    return [2 /*return*/, _a.sent()];
                    case 5:
                        this.userFacade.setUser(user);
                        this.loginListener.onPartialLoginSuccess();
                        userGroupInfo = void 0;
                        _a.label = 6;
                    case 6:
                        _a.trys.push([6, 8, , 12]);
                        return [4 /*yield*/, this.entityClient.load(TypeRefs_js_1.GroupInfoTypeRef, user.userGroup.groupInfo)];
                    case 7:
                        userGroupInfo = _a.sent();
                        return [3 /*break*/, 12];
                    case 8:
                        e_2 = _a.sent();
                        console.log("Could not do start login, groupInfo is not cached, falling back to sync login");
                        if (!(e_2 instanceof LoginIncompleteError_js_1.LoginIncompleteError)) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.finishResumeSession(credentials, externalUserSalt, cacheInfo)];
                    case 9: 
                    // await before return to catch errors here instead of up the stack
                    return [2 /*return*/, _a.sent()];
                    case 10: throw e_2;
                    case 11: return [3 /*break*/, 12];
                    case 12:
                        // Start full login async
                        Promise.resolve().then(function () { return _this.asyncResumeSession(credentials, cacheInfo); });
                        data = {
                            user: user,
                            userGroupInfo: userGroupInfo,
                            sessionId: sessionId
                        };
                        return [2 /*return*/, { type: "success", data: data }];
                    case 13: return [4 /*yield*/, this.finishResumeSession(credentials, externalUserSalt, cacheInfo)];
                    case 14: 
                    // await before return to catch errors here instead of up the stack
                    return [2 /*return*/, _a.sent()];
                    case 15: return [3 /*break*/, 18];
                    case 16:
                        e_3 = _a.sent();
                        // If we initialized the cache, but then we couldn't authenticate we should de-initialize
                        // the cache again because we will initialize it for the next attempt.
                        // It might be also called in initSession but the error can be thrown even before that (e.g. if the db is empty for some reason) so we reset
                        // the session here as well, otherwise we might try to open the DB twice.
                        return [4 /*yield*/, this.resetSession()];
                    case 17:
                        // If we initialized the cache, but then we couldn't authenticate we should de-initialize
                        // the cache again because we will initialize it for the next attempt.
                        // It might be also called in initSession but the error can be thrown even before that (e.g. if the db is empty for some reason) so we reset
                        // the session here as well, otherwise we might try to open the DB twice.
                        _a.sent();
                        throw e_3;
                    case 18: return [2 /*return*/];
                }
            });
        });
    };
    LoginFacade.prototype.getSessionId = function (credentials) {
        return [this.getSessionListId(credentials.accessToken), this.getSessionElementId(credentials.accessToken)];
    };
    LoginFacade.prototype.asyncResumeSession = function (credentials, cacheInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.asyncLoginState.state === "running") {
                            throw new Error("finishLoginResume run in parallel");
                        }
                        this.asyncLoginState = { state: "running" };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 10]);
                        return [4 /*yield*/, this.finishResumeSession(credentials, null, cacheInfo)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 10];
                    case 3:
                        e_4 = _a.sent();
                        if (!(e_4 instanceof RestError_1.NotAuthenticatedError || e_4 instanceof RestError_1.SessionExpiredError)) return [3 /*break*/, 5];
                        // For this type of errors we cannot use credentials anymore.
                        this.asyncLoginState = { state: "idle" };
                        return [4 /*yield*/, this.loginListener.onLoginFailure(0 /* LoginFailReason.SessionExpired */)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 5:
                        this.asyncLoginState = { state: "failed", credentials: credentials, cacheInfo: cacheInfo };
                        if (!!(e_4 instanceof RestError_1.ConnectionError)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.worker.sendError(e_4)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [4 /*yield*/, this.loginListener.onLoginFailure(1 /* LoginFailReason.Error */)];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9: return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    LoginFacade.prototype.finishResumeSession = function (credentials, externalUserSalt, cacheInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var sessionId, sessionData, passphrase, userPassphraseKey, _a, user, userGroupInfo, data;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        sessionId = this.getSessionId(credentials);
                        return [4 /*yield*/, this.loadSessionData(credentials.accessToken)];
                    case 1:
                        sessionData = _b.sent();
                        passphrase = (0, tutanota_utils_1.utf8Uint8ArrayToString)((0, tutanota_crypto_1.aes128Decrypt)(sessionData.accessKey, (0, tutanota_utils_1.base64ToUint8Array)((0, tutanota_utils_1.neverNull)(credentials.encryptedPassword))));
                        if (!externalUserSalt) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.checkOutdatedExternalSalt(credentials, sessionData, externalUserSalt)];
                    case 2:
                        _b.sent();
                        userPassphraseKey = (0, tutanota_crypto_1.generateKeyFromPassphrase)(passphrase, externalUserSalt, tutanota_crypto_1.KeyLength.b128);
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.loadUserPassphraseKey(credentials.login, passphrase)];
                    case 4:
                        userPassphraseKey = _b.sent();
                        _b.label = 5;
                    case 5: return [4 /*yield*/, this.initSession(sessionData.userId, credentials.accessToken, userPassphraseKey, 2 /* SessionType.Persistent */, cacheInfo)];
                    case 6:
                        _a = _b.sent(), user = _a.user, userGroupInfo = _a.userGroupInfo;
                        this.asyncLoginState = { state: "idle" };
                        data = {
                            user: user,
                            userGroupInfo: userGroupInfo,
                            sessionId: sessionId
                        };
                        return [2 /*return*/, { type: "success", data: data }];
                }
            });
        });
    };
    LoginFacade.prototype.initSession = function (userId, accessToken, userPassphraseKey, sessionType, cacheInfo) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var userIdFromFormerLogin, user, wasPartiallyLoggedIn, wasFullyLoggedIn, userGroupInfo, e_5;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        userIdFromFormerLogin = (_b = (_a = this.userFacade.getUser()) === null || _a === void 0 ? void 0 : _a._id) !== null && _b !== void 0 ? _b : null;
                        if (userIdFromFormerLogin && userId !== userIdFromFormerLogin) {
                            throw new Error("different user is tried to login in existing other user's session");
                        }
                        this.userFacade.setAccessToken(accessToken);
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 7, , 8]);
                        return [4 /*yield*/, this.entityClient.load(TypeRefs_js_1.UserTypeRef, userId)];
                    case 2:
                        user = _c.sent();
                        return [4 /*yield*/, this.checkOutdatedPassword(user, accessToken, userPassphraseKey)];
                    case 3:
                        _c.sent();
                        wasPartiallyLoggedIn = this.userFacade.isPartiallyLoggedIn();
                        if (!wasPartiallyLoggedIn) {
                            this.userFacade.setUser(user);
                            this.loginListener.onPartialLoginSuccess();
                        }
                        wasFullyLoggedIn = this.userFacade.isFullyLoggedIn();
                        this.userFacade.unlockUserGroupKey(userPassphraseKey);
                        return [4 /*yield*/, this.entityClient.load(TypeRefs_js_1.GroupInfoTypeRef, user.userGroup.groupInfo)];
                    case 4:
                        userGroupInfo = _c.sent();
                        if (!(0, Env_1.isTest)() && sessionType !== 1 /* SessionType.Temporary */ && !(0, Env_1.isAdminClient)()) {
                            // index new items in background
                            console.log("_initIndexer after log in");
                            this.initIndexer(cacheInfo);
                        }
                        return [4 /*yield*/, this.loadEntropy()
                            // If we have been fully logged in at least once already (probably expired ephemeral session)
                            // then we just reconnnect and re-download missing events.
                            // For new connections we have special handling.
                        ];
                    case 5:
                        _c.sent();
                        // If we have been fully logged in at least once already (probably expired ephemeral session)
                        // then we just reconnnect and re-download missing events.
                        // For new connections we have special handling.
                        if (wasFullyLoggedIn) {
                            this.eventBusClient.connect(1 /* ConnectMode.Reconnect */);
                        }
                        else {
                            this.eventBusClient.connect(0 /* ConnectMode.Initial */);
                        }
                        return [4 /*yield*/, this.storeEntropy()];
                    case 6:
                        _c.sent();
                        this.loginListener.onFullLoginSuccess();
                        return [2 /*return*/, { user: user, accessToken: accessToken, userGroupInfo: userGroupInfo }];
                    case 7:
                        e_5 = _c.sent();
                        this.resetSession();
                        throw e_5;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    LoginFacade.prototype.initCache = function (_a) {
        var userId = _a.userId, databaseKey = _a.databaseKey, timeRangeDays = _a.timeRangeDays, forceNewDatabase = _a.forceNewDatabase;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                if (databaseKey != null) {
                    return [2 /*return*/, this.cacheInitializer.initialize({ type: "offline", userId: userId, databaseKey: databaseKey, timeRangeDays: timeRangeDays, forceNewDatabase: forceNewDatabase })];
                }
                else {
                    return [2 /*return*/, this.cacheInitializer.initialize({ type: "ephemeral", userId: userId })];
                }
                return [2 /*return*/];
            });
        });
    };
    LoginFacade.prototype.deInitCache = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.cacheInitializer.deInitialize()];
            });
        });
    };
    /**
     * Check whether the passed salt for external user is up-to-date (whether an outdated link was used).
     */
    LoginFacade.prototype.checkOutdatedExternalSalt = function (credentials, sessionData, externalUserSalt) {
        return __awaiter(this, void 0, void 0, function () {
            var user, latestSaltHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.userFacade.setAccessToken(credentials.accessToken);
                        return [4 /*yield*/, this.entityClient.load(TypeRefs_js_1.UserTypeRef, sessionData.userId)];
                    case 1:
                        user = _a.sent();
                        latestSaltHash = (0, tutanota_utils_1.assertNotNull)(user.externalAuthInfo.latestSaltHash, "latestSaltHash is not set!");
                        if (!(0, tutanota_utils_1.arrayEquals)(latestSaltHash, (0, tutanota_crypto_1.sha256Hash)(externalUserSalt))) {
                            // Do not delete session or credentials, we can still use them if the password
                            // hasn't been changed.
                            this.resetSession();
                            throw new RestError_1.AccessExpiredError("Salt changed, outdated link?");
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Check that the password is not changed.
     * Normally this won't happen for internal users as all sessions are closed on password change. This may happen for external users when the sender has
     * changed the password.
     * We do not delete all sessions on the server when changing the external password to avoid that an external user is immediately logged out.
     */
    LoginFacade.prototype.checkOutdatedPassword = function (user, accessToken, userPassphraseKey) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!((0, tutanota_utils_1.uint8ArrayToBase64)(user.verifier) !== (0, tutanota_utils_1.uint8ArrayToBase64)((0, tutanota_crypto_1.sha256Hash)((0, tutanota_crypto_1.createAuthVerifier)(userPassphraseKey))))) return [3 /*break*/, 3];
                        console.log("External password has changed");
                        // delete the obsolete session to make sure it can not be used any more
                        return [4 /*yield*/, this.deleteSession(accessToken)["catch"](function (e) { return console.error("Could not delete session", e); })];
                    case 1:
                        // delete the obsolete session to make sure it can not be used any more
                        _a.sent();
                        return [4 /*yield*/, this.resetSession()];
                    case 2:
                        _a.sent();
                        throw new RestError_1.NotAuthenticatedError("External password has changed");
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    LoginFacade.prototype.initIndexer = function (cacheInfo) {
        var _this = this;
        return this.indexer
            .init({
            user: (0, tutanota_utils_1.assertNotNull)(this.userFacade.getUser()),
            userGroupKey: this.userFacade.getUserGroupKey(),
            cacheInfo: cacheInfo
        })["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.ServiceUnavailableError, function (e) {
            console.log("Retry init indexer in 30 seconds after ServiceUnavailableError");
            return (0, tutanota_utils_1.delay)(RETRY_TIMOUT_AFTER_INIT_INDEXER_ERROR_MS).then(function () {
                console.log("_initIndexer after ServiceUnavailableError");
                return _this.initIndexer(cacheInfo);
            });
        }))["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.ConnectionError, function (e) {
            console.log("Retry init indexer in 30 seconds after ConnectionError");
            return (0, tutanota_utils_1.delay)(RETRY_TIMOUT_AFTER_INIT_INDEXER_ERROR_MS).then(function () {
                console.log("_initIndexer after ConnectionError");
                return _this.initIndexer(cacheInfo);
            });
        }))["catch"](function (e) {
            _this.worker.sendError(e);
        });
    };
    LoginFacade.prototype.loadUserPassphraseKey = function (mailAddress, passphrase) {
        mailAddress = mailAddress.toLowerCase().trim();
        var saltRequest = (0, TypeRefs_js_1.createSaltData)({ mailAddress: mailAddress });
        return this.serviceExecutor.get(Services_1.SaltService, saltRequest).then(function (saltReturn) {
            return (0, tutanota_crypto_1.generateKeyFromPassphrase)(passphrase, saltReturn.salt, tutanota_crypto_1.KeyLength.b128);
        });
    };
    /**
     * We use the accessToken that should be deleted for authentication. Therefore it can be invoked while logged in or logged out.
     */
    LoginFacade.prototype.deleteSession = function (accessToken) {
        return __awaiter(this, void 0, void 0, function () {
            var path, sessionTypeModel, headers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        path = (0, EntityRestClient_1.typeRefToPath)(TypeRefs_js_1.SessionTypeRef) + "/" + this.getSessionListId(accessToken) + "/" + this.getSessionElementId(accessToken);
                        return [4 /*yield*/, (0, EntityFunctions_1.resolveTypeReference)(TypeRefs_js_1.SessionTypeRef)];
                    case 1:
                        sessionTypeModel = _a.sent();
                        headers = {
                            accessToken: (0, tutanota_utils_1.neverNull)(accessToken),
                            v: sessionTypeModel.version
                        };
                        return [2 /*return*/, this.restClient
                                .request(path, "DELETE" /* HttpMethod.DELETE */, {
                                headers: headers,
                                responseType: "application/json" /* MediaType.Json */
                            })["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotAuthenticatedError, function () {
                                console.log("authentication failed => session is already closed");
                            }))["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotFoundError, function () {
                                console.log("authentication failed => session instance is already deleted");
                            }))];
                }
            });
        });
    };
    LoginFacade.prototype.getSessionElementId = function (accessToken) {
        var byteAccessToken = (0, tutanota_utils_1.base64ToUint8Array)((0, tutanota_utils_1.base64UrlToBase64)((0, tutanota_utils_1.neverNull)(accessToken)));
        return (0, tutanota_utils_1.base64ToBase64Url)((0, tutanota_utils_1.uint8ArrayToBase64)((0, tutanota_crypto_1.sha256Hash)(byteAccessToken.slice(EntityUtils_1.GENERATED_ID_BYTES_LENGTH))));
    };
    LoginFacade.prototype.getSessionListId = function (accessToken) {
        var byteAccessToken = (0, tutanota_utils_1.base64ToUint8Array)((0, tutanota_utils_1.base64UrlToBase64)((0, tutanota_utils_1.neverNull)(accessToken)));
        return (0, tutanota_utils_1.base64ToBase64Ext)((0, tutanota_utils_1.uint8ArrayToBase64)(byteAccessToken.slice(0, EntityUtils_1.GENERATED_ID_BYTES_LENGTH)));
    };
    LoginFacade.prototype.loadSessionData = function (accessToken) {
        return __awaiter(this, void 0, void 0, function () {
            var path, SessionTypeModel, headers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        path = (0, EntityRestClient_1.typeRefToPath)(TypeRefs_js_1.SessionTypeRef) + "/" + this.getSessionListId(accessToken) + "/" + this.getSessionElementId(accessToken);
                        return [4 /*yield*/, (0, EntityFunctions_1.resolveTypeReference)(TypeRefs_js_1.SessionTypeRef)];
                    case 1:
                        SessionTypeModel = _a.sent();
                        headers = {
                            accessToken: accessToken,
                            v: SessionTypeModel.version
                        };
                        return [2 /*return*/, this.restClient.request(path, "GET" /* HttpMethod.GET */, {
                                headers: headers,
                                responseType: "application/json" /* MediaType.Json */
                            }).then(function (instance) {
                                var session = JSON.parse(instance);
                                return {
                                    userId: session.user,
                                    accessKey: (0, tutanota_crypto_1.base64ToKey)(session.accessKey)
                                };
                            })];
                }
            });
        });
    };
    /**
     * Loads entropy from the last logout.
     */
    LoginFacade.prototype.loadEntropy = function () {
        var _this = this;
        return this.entityClient.loadRoot(TypeRefs_js_2.TutanotaPropertiesTypeRef, this.userFacade.getUserGroupId()).then(function (tutanotaProperties) {
            if (tutanotaProperties.groupEncEntropy) {
                try {
                    var entropy = (0, tutanota_crypto_1.aes128Decrypt)(_this.userFacade.getUserGroupKey(), (0, tutanota_utils_1.neverNull)(tutanotaProperties.groupEncEntropy));
                    tutanota_crypto_1.random.addStaticEntropy(entropy);
                }
                catch (error) {
                    if (error instanceof CryptoError_1.CryptoError) {
                        console.log("could not decrypt entropy", error);
                    }
                }
            }
        });
    };
    LoginFacade.prototype.storeEntropy = function () {
        // We only store entropy to the server if we are the leader
        if (!this.userFacade.isFullyLoggedIn() || !this.userFacade.isLeader())
            return Promise.resolve();
        var userGroupKey = this.userFacade.getUserGroupKey();
        var entropyData = (0, TypeRefs_js_2.createEntropyData)({
            groupEncEntropy: (0, CryptoFacade_1.encryptBytes)(userGroupKey, tutanota_crypto_1.random.generateRandomData(32))
        });
        return this.serviceExecutor.put(Services_2.EntropyService, entropyData)["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.LockedError, tutanota_utils_1.noOp))["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.ConnectionError, function (e) {
            console.log("could not store entropy", e);
        }))["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.ServiceUnavailableError, function (e) {
            console.log("could not store entropy", e);
        }));
    };
    LoginFacade.prototype.changePassword = function (oldPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function () {
            var userSalt, oldAuthVerifier, salt, userPassphraseKey, pwEncUserGroupKey, authVerifier, service;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userSalt = (0, tutanota_utils_1.assertNotNull)(this.userFacade.getLoggedInUser().salt);
                        oldAuthVerifier = (0, tutanota_crypto_1.createAuthVerifier)((0, tutanota_crypto_1.generateKeyFromPassphrase)(oldPassword, userSalt, tutanota_crypto_1.KeyLength.b128));
                        salt = (0, tutanota_crypto_1.generateRandomSalt)();
                        userPassphraseKey = (0, tutanota_crypto_1.generateKeyFromPassphrase)(newPassword, salt, tutanota_crypto_1.KeyLength.b128);
                        pwEncUserGroupKey = (0, tutanota_crypto_1.encryptKey)(userPassphraseKey, this.userFacade.getUserGroupKey());
                        authVerifier = (0, tutanota_crypto_1.createAuthVerifier)(userPassphraseKey);
                        service = (0, TypeRefs_js_1.createChangePasswordData)();
                        service.oldVerifier = oldAuthVerifier;
                        service.salt = salt;
                        service.verifier = authVerifier;
                        service.pwEncUserGroupKey = pwEncUserGroupKey;
                        return [4 /*yield*/, this.serviceExecutor.post(Services_1.ChangePasswordService, service)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginFacade.prototype.deleteAccount = function (password, reason, takeover) {
        return __awaiter(this, void 0, void 0, function () {
            var d, userSalt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        d = (0, TypeRefs_js_1.createDeleteCustomerData)();
                        userSalt = (0, tutanota_utils_1.assertNotNull)(this.userFacade.getLoggedInUser().salt);
                        d.authVerifier = (0, tutanota_crypto_1.createAuthVerifier)((0, tutanota_crypto_1.generateKeyFromPassphrase)(password, userSalt, tutanota_crypto_1.KeyLength.b128));
                        d.undelete = false;
                        d.customer = (0, tutanota_utils_1.neverNull)((0, tutanota_utils_1.neverNull)(this.userFacade.getLoggedInUser()).customer);
                        d.reason = reason;
                        if (takeover !== "") {
                            d.takeoverMailAddress = takeover;
                        }
                        else {
                            d.takeoverMailAddress = null;
                        }
                        return [4 /*yield*/, this.serviceExecutor["delete"](Services_1.CustomerService, d)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginFacade.prototype.decryptUserPassword = function (userId, deviceToken, encryptedPassword) {
        var getData = (0, TypeRefs_js_1.createAutoLoginDataGet)();
        getData.userId = userId;
        getData.deviceToken = deviceToken;
        return this.serviceExecutor.get(Services_1.AutoLoginService, getData).then(function (returnData) {
            var key = (0, tutanota_crypto_1.uint8ArrayToKey)(returnData.deviceKey);
            return (0, tutanota_utils_1.utf8Uint8ArrayToString)((0, tutanota_crypto_1.aes128Decrypt)(key, (0, tutanota_utils_1.base64ToUint8Array)(encryptedPassword)));
        });
    };
    /** Changes user password to another one using recoverCode instead of the old password. */
    LoginFacade.prototype.recoverLogin = function (mailAddress, recoverCode, newPassword, clientIdentifier) {
        var _this = this;
        var sessionData = (0, TypeRefs_js_1.createCreateSessionData)();
        var recoverCodeKey = (0, tutanota_crypto_1.uint8ArrayToBitArray)((0, tutanota_utils_1.hexToUint8Array)(recoverCode));
        var recoverCodeVerifier = (0, tutanota_crypto_1.createAuthVerifier)(recoverCodeKey);
        var recoverCodeVerifierBase64 = (0, tutanota_utils_1.base64ToBase64Url)((0, tutanota_utils_1.uint8ArrayToBase64)(recoverCodeVerifier));
        sessionData.mailAddress = mailAddress.toLowerCase().trim();
        sessionData.clientIdentifier = clientIdentifier;
        sessionData.recoverCodeVerifier = recoverCodeVerifierBase64;
        // we need a separate entity rest client because to avoid caching of the user instance which is updated on password change. the web socket is not connected because we
        // don't do a normal login and therefore we would not get any user update events. we can not use permanentLogin=false with initSession because caching would be enabled
        // and therefore we would not be able to read the updated user
        // additionally we do not want to use initSession() to keep the LoginFacade stateless (except second factor handling) because we do not want to have any race conditions
        // when logging in normally after resetting the password
        var tempAuthDataProvider = {
            createAuthHeaders: function () {
                return {};
            },
            isFullyLoggedIn: function () {
                return false;
            }
        };
        var eventRestClient = new EntityRestClient_1.EntityRestClient(tempAuthDataProvider, this.restClient, function () { return _this.cryptoFacade; }, this.instanceMapper);
        var entityClient = new EntityClient_1.EntityClient(eventRestClient);
        return this.serviceExecutor.post(Services_1.SessionService, sessionData) // Don't pass email address to avoid proposing to reset second factor when we're resetting password
            .then(function (createSessionReturn) { return _this.waitUntilSecondFactorApprovedOrCancelled(createSessionReturn, null); })
            .then(function (sessionData) {
            return entityClient
                .load(TypeRefs_js_1.UserTypeRef, sessionData.userId, undefined, {
                accessToken: sessionData.accessToken
            })
                .then(function (user) {
                if (user.auth == null || user.auth.recoverCode == null) {
                    return Promise.reject(new Error("missing recover code"));
                }
                var extraHeaders = {
                    accessToken: sessionData.accessToken,
                    recoverCodeVerifier: recoverCodeVerifierBase64
                };
                return entityClient.load(TypeRefs_js_1.RecoverCodeTypeRef, user.auth.recoverCode, undefined, extraHeaders);
            })
                .then(function (recoverCode) {
                var groupKey = (0, tutanota_crypto_1.aes256DecryptKey)(recoverCodeKey, recoverCode.recoverCodeEncUserGroupKey);
                var salt = (0, tutanota_crypto_1.generateRandomSalt)();
                var userPassphraseKey = (0, tutanota_crypto_1.generateKeyFromPassphrase)(newPassword, salt, tutanota_crypto_1.KeyLength.b128);
                var pwEncUserGroupKey = (0, tutanota_crypto_1.encryptKey)(userPassphraseKey, groupKey);
                var newPasswordVerifier = (0, tutanota_crypto_1.createAuthVerifier)(userPassphraseKey);
                var postData = (0, TypeRefs_js_1.createChangePasswordData)();
                postData.salt = salt;
                postData.pwEncUserGroupKey = pwEncUserGroupKey;
                postData.verifier = newPasswordVerifier;
                postData.recoverCodeVerifier = recoverCodeVerifier;
                var extraHeaders = {
                    accessToken: sessionData.accessToken
                };
                return _this.serviceExecutor.post(Services_1.ChangePasswordService, postData, { extraHeaders: extraHeaders });
            })["finally"](function () { return _this.deleteSession(sessionData.accessToken); });
        });
    };
    /** Deletes second factors using recoverCode as second factor. */
    LoginFacade.prototype.resetSecondFactors = function (mailAddress, password, recoverCode) {
        var _this = this;
        return this.loadUserPassphraseKey(mailAddress, password).then(function (passphraseReturn) {
            var authVerifier = (0, tutanota_crypto_1.createAuthVerifierAsBase64Url)(passphraseReturn);
            var recoverCodeKey = (0, tutanota_crypto_1.uint8ArrayToBitArray)((0, tutanota_utils_1.hexToUint8Array)(recoverCode));
            var recoverCodeVerifier = (0, tutanota_crypto_1.createAuthVerifierAsBase64Url)(recoverCodeKey);
            var deleteData = (0, TypeRefs_js_1.createResetFactorsDeleteData)();
            deleteData.mailAddress = mailAddress;
            deleteData.authVerifier = authVerifier;
            deleteData.recoverCodeVerifier = recoverCodeVerifier;
            return _this.serviceExecutor["delete"](Services_1.ResetFactorsService, deleteData);
        });
    };
    LoginFacade.prototype.takeOverDeletedAddress = function (mailAddress, password, recoverCode, targetAccountMailAddress) {
        var _this = this;
        return this.loadUserPassphraseKey(mailAddress, password).then(function (passphraseReturn) {
            var authVerifier = (0, tutanota_crypto_1.createAuthVerifierAsBase64Url)(passphraseReturn);
            var recoverCodeVerifier = null;
            if (recoverCode) {
                var recoverCodeKey = (0, tutanota_crypto_1.uint8ArrayToBitArray)((0, tutanota_utils_1.hexToUint8Array)(recoverCode));
                recoverCodeVerifier = (0, tutanota_crypto_1.createAuthVerifierAsBase64Url)(recoverCodeKey);
            }
            var data = (0, TypeRefs_js_1.createTakeOverDeletedAddressData)();
            data.mailAddress = mailAddress;
            data.authVerifier = authVerifier;
            data.recoverCodeVerifier = recoverCodeVerifier;
            data.targetAccountMailAddress = targetAccountMailAddress;
            return _this.serviceExecutor.post(Services_1.TakeOverDeletedAddressService, data);
        });
    };
    LoginFacade.prototype.generateTotpSecret = function () {
        return this.getTotpVerifier().then(function (totp) { return totp.generateSecret(); });
    };
    LoginFacade.prototype.generateTotpCode = function (time, key) {
        return this.getTotpVerifier().then(function (totp) { return totp.generateTotp(time, key); });
    };
    LoginFacade.prototype.getTotpVerifier = function () {
        return Promise.resolve(new tutanota_crypto_1.TotpVerifier());
    };
    LoginFacade.prototype.entityEventsReceived = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, data_1, update, user, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _i = 0, data_1 = data;
                        _c.label = 1;
                    case 1:
                        if (!(_i < data_1.length)) return [3 /*break*/, 4];
                        update = data_1[_i];
                        user = this.userFacade.getUser();
                        if (!(user != null &&
                            update.operation === "1" /* OperationType.UPDATE */ &&
                            (0, tutanota_utils_1.isSameTypeRefByAttr)(TypeRefs_js_1.UserTypeRef, update.application, update.type) &&
                            (0, EntityUtils_1.isSameId)(user._id, update.instanceId))) return [3 /*break*/, 3];
                        _b = (_a = this.userFacade).updateUser;
                        return [4 /*yield*/, this.entityClient.load(TypeRefs_js_1.UserTypeRef, user._id)];
                    case 2:
                        _b.apply(_a, [_c.sent()]);
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    LoginFacade.prototype.retryAsyncLogin = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.asyncLoginState.state === "running")) return [3 /*break*/, 1];
                        return [2 /*return*/];
                    case 1:
                        if (!(this.asyncLoginState.state === "failed")) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.asyncResumeSession(this.asyncLoginState.credentials, this.asyncLoginState.cacheInfo)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3: throw new Error("credentials went missing");
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return LoginFacade;
}());
exports.LoginFacade = LoginFacade;
