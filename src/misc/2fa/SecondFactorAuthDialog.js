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
exports.SecondFactorAuthDialog = void 0;
var TutanotaConstants_js_1 = require("../../api/common/TutanotaConstants.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var TypeRefs_js_1 = require("../../api/entities/sys/TypeRefs.js");
var RestError_js_1 = require("../../api/common/error/RestError.js");
var Dialog_js_1 = require("../../gui/base/Dialog.js");
var mithril_1 = require("mithril");
var SecondFactorAuthView_js_1 = require("./SecondFactorAuthView.js");
var CancelledError_js_1 = require("../../api/common/error/CancelledError.js");
var WebauthnError_js_1 = require("../../api/common/error/WebauthnError.js");
var SecondFactorHandler_1 = require("./SecondFactorHandler");
/**
 * Dialog which allows user to use second factor authentication and allows to reset second factor.
 * It will show that the login can be approved form another session and depending on what is supported it
 * might display one or more of:
 *  - WebAuthentication
 *  - TOTP
 *  - login from another domain message
 *  - lost access button
 * */
var SecondFactorAuthDialog = /** @class */ (function () {
    /** @private */
    function SecondFactorAuthDialog(webauthnClient, loginFacade, authData, onClose) {
        this.webauthnClient = webauthnClient;
        this.loginFacade = loginFacade;
        this.authData = authData;
        this.onClose = onClose;
        this.waitingForSecondFactorDialog = null;
        this.webauthnState = { state: "init" };
        this.otpState = { code: "", inProgress: false };
    }
    /**
     * @param webauthnClient
     * @param loginFacade
     * @param authData
     * @param onClose will be called when the dialog is closed (one way or another).
     */
    SecondFactorAuthDialog.show = function (webauthnClient, loginFacade, authData, onClose) {
        var dialog = new SecondFactorAuthDialog(webauthnClient, loginFacade, authData, onClose);
        dialog.show();
        return dialog;
    };
    SecondFactorAuthDialog.prototype.close = function () {
        var _a, _b;
        if ((_a = this.waitingForSecondFactorDialog) === null || _a === void 0 ? void 0 : _a.visible) {
            (_b = this.waitingForSecondFactorDialog) === null || _b === void 0 ? void 0 : _b.close();
        }
        this.webauthnClient.abortCurrentOperation();
        this.waitingForSecondFactorDialog = null;
        this.onClose();
    };
    SecondFactorAuthDialog.prototype.show = function () {
        return __awaiter(this, void 0, void 0, function () {
            var u2fChallenge, otpChallenge, u2fSupported, canLoginWithU2f, otherLoginDomain, _a, canAttempt, cannotAttempt, mailAddress;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        u2fChallenge = this.authData.challenges.find(function (challenge) { return challenge.type === TutanotaConstants_js_1.SecondFactorType.u2f || challenge.type === TutanotaConstants_js_1.SecondFactorType.webauthn; });
                        otpChallenge = this.authData.challenges.find(function (challenge) { return challenge.type === TutanotaConstants_js_1.SecondFactorType.totp; });
                        return [4 /*yield*/, this.webauthnClient.isSupported()];
                    case 1:
                        u2fSupported = _b.sent();
                        console.log("webauthn supported: ", u2fSupported);
                        if (!((u2fChallenge === null || u2fChallenge === void 0 ? void 0 : u2fChallenge.u2f) != null && u2fSupported)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.webauthnClient.canAttemptChallenge(u2fChallenge.u2f)];
                    case 2:
                        _a = _b.sent(), canAttempt = _a.canAttempt, cannotAttempt = _a.cannotAttempt;
                        canLoginWithU2f = canAttempt.length !== 0;
                        otherLoginDomain = cannotAttempt.length > 0 ? (0, SecondFactorHandler_1.appIdToLoginDomain)((0, tutanota_utils_1.firstThrow)(cannotAttempt).appId) : null;
                        return [3 /*break*/, 4];
                    case 3:
                        canLoginWithU2f = false;
                        otherLoginDomain = null;
                        _b.label = 4;
                    case 4:
                        mailAddress = this.authData.mailAddress;
                        this.waitingForSecondFactorDialog = Dialog_js_1.Dialog.showActionDialog({
                            title: "",
                            allowOkWithReturn: true,
                            child: {
                                view: function () {
                                    return (0, mithril_1["default"])(SecondFactorAuthView_js_1.SecondFactorAuthView, {
                                        webauthn: canLoginWithU2f
                                            ? {
                                                canLogin: true,
                                                state: _this.webauthnState,
                                                doWebauthn: function () { return _this.doWebauthn((0, tutanota_utils_1.assertNotNull)(u2fChallenge)); }
                                            }
                                            : otherLoginDomain
                                                ? {
                                                    canLogin: false,
                                                    otherLoginDomain: otherLoginDomain
                                                }
                                                : null,
                                        otp: otpChallenge
                                            ? {
                                                codeFieldValue: _this.otpState.code,
                                                inProgress: _this.otpState.inProgress,
                                                onValueChanged: function (newValue) { return (_this.otpState.code = newValue); }
                                            }
                                            : null,
                                        onRecover: mailAddress ? function () { return _this.recoverLogin(mailAddress); } : null
                                    });
                                }
                            },
                            okAction: otpChallenge ? function () { return _this.onConfirmOtp(); } : null,
                            cancelAction: function () { return _this.cancel(); }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    SecondFactorAuthDialog.prototype.onConfirmOtp = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var authData, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.otpState.inProgress = true;
                        authData = (0, TypeRefs_js_1.createSecondFactorAuthData)({
                            type: TutanotaConstants_js_1.SecondFactorType.totp,
                            session: this.authData.sessionId,
                            otpCode: this.otpState.code.replace(/ /g, "")
                        });
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, this.loginFacade.authenticateWithSecondFactor(authData)];
                    case 2:
                        _b.sent();
                        (_a = this.waitingForSecondFactorDialog) === null || _a === void 0 ? void 0 : _a.close();
                        return [3 /*break*/, 5];
                    case 3:
                        e_1 = _b.sent();
                        if (e_1 instanceof RestError_js_1.NotAuthenticatedError) {
                            Dialog_js_1.Dialog.message("loginFailed_msg");
                        }
                        else if (e_1 instanceof RestError_js_1.BadRequestError) {
                            Dialog_js_1.Dialog.message("loginFailed_msg");
                        }
                        else if (e_1 in RestError_js_1.AccessBlockedError) {
                            Dialog_js_1.Dialog.message("loginFailedOften_msg");
                            this.close();
                        }
                        else {
                            throw e_1;
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        this.otpState.inProgress = false;
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SecondFactorAuthDialog.prototype.cancel = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.webauthnClient.abortCurrentOperation();
                        return [4 /*yield*/, this.loginFacade.cancelCreateSession(this.authData.sessionId)];
                    case 1:
                        _a.sent();
                        this.close();
                        return [2 /*return*/];
                }
            });
        });
    };
    SecondFactorAuthDialog.prototype.doWebauthn = function (u2fChallenge) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var sessionId, challenge, webauthnResponseData, authData, e_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.webauthnState = {
                            state: "progress"
                        };
                        sessionId = this.authData.sessionId;
                        challenge = (0, tutanota_utils_1.assertNotNull)(u2fChallenge.u2f);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, 5, 6]);
                        return [4 /*yield*/, this.webauthnClient.authenticate(challenge)];
                    case 2:
                        webauthnResponseData = _b.sent();
                        authData = (0, TypeRefs_js_1.createSecondFactorAuthData)({
                            type: TutanotaConstants_js_1.SecondFactorType.webauthn,
                            session: sessionId,
                            webauthn: webauthnResponseData
                        });
                        return [4 /*yield*/, this.loginFacade.authenticateWithSecondFactor(authData)];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        e_2 = _b.sent();
                        if (e_2 instanceof CancelledError_js_1.CancelledError) {
                            this.webauthnState = {
                                state: "init"
                            };
                        }
                        else if (e_2 instanceof RestError_js_1.AccessBlockedError && ((_a = this.waitingForSecondFactorDialog) === null || _a === void 0 ? void 0 : _a.visible)) {
                            Dialog_js_1.Dialog.message("loginFailedOften_msg");
                            this.close();
                        }
                        else if (e_2 instanceof WebauthnError_js_1.WebauthnError) {
                            console.log("Error during webAuthn: ", e_2);
                            this.webauthnState = {
                                state: "error",
                                error: "couldNotAuthU2f_msg"
                            };
                        }
                        else if (e_2 instanceof RestError_js_1.NotAuthenticatedError) {
                            this.webauthnState = {
                                state: "init"
                            };
                            Dialog_js_1.Dialog.message("loginFailed_msg");
                        }
                        else {
                            throw e_2;
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        mithril_1["default"].redraw();
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    SecondFactorAuthDialog.prototype.recoverLogin = function (mailAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var dialog;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.cancel();
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("../../login/recover/RecoverLoginDialog"); })];
                    case 1:
                        dialog = _a.sent();
                        dialog.show(mailAddress, "secondFactor");
                        return [2 /*return*/];
                }
            });
        });
    };
    return SecondFactorAuthDialog;
}());
exports.SecondFactorAuthDialog = SecondFactorAuthDialog;
