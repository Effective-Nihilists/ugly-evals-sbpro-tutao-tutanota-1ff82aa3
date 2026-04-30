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
exports.BrowserWebauthn = void 0;
var WebauthnTypes_js_1 = require("./WebauthnTypes.js");
var ProgrammingError_js_1 = require("../../../api/common/error/ProgrammingError.js");
var Env_js_1 = require("../../../api/common/Env.js");
var WebAuthn_js_1 = require("./WebAuthn.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var CancelledError_js_1 = require("../../../api/common/error/CancelledError.js");
var WebauthnError_js_1 = require("../../../api/common/error/WebauthnError.js");
var WEBAUTHN_TIMEOUT_MS = 60000;
/** An actual webauthn implementation in browser. */
var BrowserWebauthn = /** @class */ (function () {
    function BrowserWebauthn(api, hostname) {
        this.api = api;
        this.currentOperationSignal = null;
        this.rpId = this.rpIdFromHostname(hostname);
        this.appId = this.appidFromHostname(hostname);
    }
    BrowserWebauthn.prototype.canAttemptChallengeForRpId = function (rpId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, rpId === this.rpId];
            });
        });
    };
    BrowserWebauthn.prototype.canAttemptChallengeForU2FAppId = function (appId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.appId === appId];
            });
        });
    };
    /**
     * test whether hardware key second factors are supported for this client
     */
    BrowserWebauthn.prototype.isSupported = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, !(0, Env_js_1.isApp)() && this.api != null &&
                        // @ts-ignore see polyfill.js
                        // We just stub BigInt in order to import cborg without issues but we can't actually use it
                        !BigInt.polyfilled];
            });
        });
    };
    BrowserWebauthn.prototype.register = function (_a) {
        var challenge = _a.challenge, userId = _a.userId, name = _a.name, displayName = _a.displayName;
        return __awaiter(this, void 0, void 0, function () {
            var publicKeyCredentialCreationOptions, credential;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        publicKeyCredentialCreationOptions = {
                            challenge: challenge,
                            rp: {
                                name: "Tutanota",
                                id: this.rpId
                            },
                            user: {
                                id: (0, tutanota_utils_1.stringToUtf8Uint8Array)(userId),
                                name: name,
                                displayName: displayName
                            },
                            pubKeyCredParams: [
                                {
                                    alg: WebauthnTypes_js_1.COSEAlgorithmIdentifier.ES256,
                                    type: "public-key"
                                },
                            ],
                            authenticatorSelection: {
                                authenticatorAttachment: "cross-platform",
                                userVerification: "discouraged"
                            },
                            timeout: WEBAUTHN_TIMEOUT_MS,
                            attestation: "none"
                        };
                        this.currentOperationSignal = new AbortController();
                        return [4 /*yield*/, this.api.create({
                                publicKey: publicKeyCredentialCreationOptions,
                                signal: this.currentOperationSignal.signal
                            })];
                    case 1:
                        credential = _b.sent();
                        return [2 /*return*/, {
                                rpId: this.rpId,
                                rawId: credential.rawId,
                                attestationObject: credential.response.attestationObject
                            }];
                }
            });
        });
    };
    BrowserWebauthn.prototype.sign = function (_a) {
        var challenge = _a.challenge, keys = _a.keys;
        return __awaiter(this, void 0, void 0, function () {
            var publicKeyCredentialRequestOptions, assertion, e_1, publicKeyCredential, assertionResponse;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        publicKeyCredentialRequestOptions = {
                            challenge: challenge,
                            rpId: this.rpId,
                            allowCredentials: keys,
                            extensions: {
                                appid: this.appId
                            },
                            userVerification: "discouraged",
                            timeout: WEBAUTHN_TIMEOUT_MS
                        };
                        this.currentOperationSignal = new AbortController();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.api.get({
                                publicKey: publicKeyCredentialRequestOptions,
                                signal: this.currentOperationSignal.signal
                            })];
                    case 2:
                        assertion = _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _b.sent();
                        if (e_1.name === "AbortError") {
                            throw new CancelledError_js_1.CancelledError(e_1);
                        }
                        else {
                            throw new WebauthnError_js_1.WebauthnError(e_1);
                        }
                        return [3 /*break*/, 4];
                    case 4:
                        publicKeyCredential = assertion;
                        if (publicKeyCredential == null) {
                            throw new ProgrammingError_js_1.ProgrammingError("Webauthn credential could not be unambiguously resolved");
                        }
                        assertionResponse = publicKeyCredential.response;
                        return [2 /*return*/, {
                                rawId: publicKeyCredential.rawId,
                                authenticatorData: assertionResponse.authenticatorData,
                                signature: assertionResponse.signature,
                                clientDataJSON: assertionResponse.clientDataJSON
                            }];
                }
            });
        });
    };
    BrowserWebauthn.prototype.abortCurrentOperation = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                (_a = this.currentOperationSignal) === null || _a === void 0 ? void 0 : _a.abort();
                this.currentOperationSignal = null;
                return [2 /*return*/];
            });
        });
    };
    BrowserWebauthn.prototype.rpIdFromHostname = function (hostname) {
        if (hostname.endsWith(WebAuthn_js_1.WEBAUTHN_RP_ID)) {
            return WebAuthn_js_1.WEBAUTHN_RP_ID;
        }
        else {
            return hostname;
        }
    };
    BrowserWebauthn.prototype.appidFromHostname = function (hostname) {
        if (hostname.endsWith(WebAuthn_js_1.WEBAUTHN_RP_ID)) {
            return WebAuthn_js_1.U2F_APPID;
        }
        else {
            return (0, Env_js_1.getHttpOrigin)() + WebAuthn_js_1.U2f_APPID_SUFFIX;
        }
    };
    return BrowserWebauthn;
}());
exports.BrowserWebauthn = BrowserWebauthn;
