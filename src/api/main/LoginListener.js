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
exports.LoginListener = void 0;
var tutanota_utils_1 = require("@tutao/tutanota-utils");
/** Listener for the login events from the worker side. */
var LoginListener = /** @class */ (function () {
    function LoginListener(secondFactorHandler) {
        this.secondFactorHandler = secondFactorHandler;
        this.loginPromise = (0, tutanota_utils_1.defer)();
        this.fullLoginFailed = false;
    }
    /** e.g. after temp logout */
    LoginListener.prototype.reset = function () {
        this.loginPromise = (0, tutanota_utils_1.defer)();
        this.fullLoginFailed = false;
    };
    LoginListener.prototype.waitForFullLogin = function () {
        return this.loginPromise.promise;
    };
    /**
     * Partial login reached: cached entities and user are available.
     */
    LoginListener.prototype.onPartialLoginSuccess = function () {
        return Promise.resolve();
    };
    /**
     * Full login reached: any network requests can be made
     */
    LoginListener.prototype.onFullLoginSuccess = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.fullLoginFailed = false;
                this.loginPromise.resolve();
                return [2 /*return*/];
            });
        });
    };
    /**
     * call when the login fails for invalid session or other reasons
     */
    LoginListener.prototype.onLoginFailure = function (reason) {
        return __awaiter(this, void 0, void 0, function () {
            var reloginForExpiredSession;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.fullLoginFailed = true;
                        if (!(reason === 0 /* LoginFailReason.SessionExpired */)) return [3 /*break*/, 3];
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("../../misc/ErrorHandlerImpl.js"); })];
                    case 1:
                        reloginForExpiredSession = (_a.sent()).reloginForExpiredSession;
                        return [4 /*yield*/, reloginForExpiredSession()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * call when retrying full login
     */
    LoginListener.prototype.onRetryLogin = function () {
        this.fullLoginFailed = false;
    };
    /**
     * Shows a dialog with possibility to use second factor and with a message that the login can be approved from another client.
     */
    LoginListener.prototype.onSecondFactorChallenge = function (sessionId, challenges, mailAddress) {
        return this.secondFactorHandler.showSecondFactorAuthenticationDialog(sessionId, challenges, mailAddress);
    };
    /**
     * true if the last full login attempt failed
     * may revert to false when retrying.
     */
    LoginListener.prototype.getFullLoginFailed = function () {
        return this.fullLoginFailed;
    };
    return LoginListener;
}());
exports.LoginListener = LoginListener;
