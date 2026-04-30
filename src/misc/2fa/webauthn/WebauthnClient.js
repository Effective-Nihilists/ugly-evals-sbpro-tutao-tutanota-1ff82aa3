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
exports.WebauthnClient = void 0;
var cborg_1 = require("cborg");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var TypeRefs_js_1 = require("../../../api/entities/sys/TypeRefs.js");
var WebAuthn_js_1 = require("./WebAuthn.js");
/** Web authentication entry point for the rest of the app. */
var WebauthnClient = /** @class */ (function () {
    function WebauthnClient(webauthn, clientWebRoot) {
        this.webauthn = webauthn;
        this.clientWebRoot = clientWebRoot;
    }
    WebauthnClient.prototype.isSupported = function () {
        return this.webauthn.isSupported();
    };
    /** Whether it's possible to attempt a challenge. It might not be possible if there are not keys for this domain. */
    WebauthnClient.prototype.canAttemptChallenge = function (challenge) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, canAttempt, cannotAttempt;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, tutanota_utils_1.partitionAsync)(challenge.keys, function (k) { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, this.webauthn.canAttemptChallengeForRpId(k.appId)];
                                case 1:
                                    _a = (_b.sent());
                                    if (_a) return [3 /*break*/, 3];
                                    return [4 /*yield*/, this.webauthn.canAttemptChallengeForU2FAppId(k.appId)];
                                case 2:
                                    _a = (_b.sent());
                                    _b.label = 3;
                                case 3: return [2 /*return*/, _a];
                            }
                        }); }); })];
                    case 1:
                        _a = _b.sent(), canAttempt = _a[0], cannotAttempt = _a[1];
                        return [2 /*return*/, { canAttempt: canAttempt, cannotAttempt: cannotAttempt }];
                }
            });
        });
    };
    WebauthnClient.prototype.register = function (userId, displayName, mailAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var challenge, name, registrationResult, attestationObject, publicKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        challenge = this.getChallenge();
                        name = "".concat(userId, " ").concat(mailAddress, " ").concat(displayName);
                        return [4 /*yield*/, this.webauthn.register({ challenge: challenge, userId: userId, name: name, displayName: displayName, domain: this.clientWebRoot })];
                    case 1:
                        registrationResult = _a.sent();
                        attestationObject = this.parseAttestationObject(registrationResult.attestationObject);
                        publicKey = this.parsePublicKey((0, tutanota_utils_1.downcast)(attestationObject).authData);
                        return [2 /*return*/, (0, TypeRefs_js_1.createU2fRegisteredDevice)({
                                keyHandle: new Uint8Array(registrationResult.rawId),
                                // For Webauthn keys we save rpId into appId. They do not conflict: one of them is json URL, another is domain.
                                appId: registrationResult.rpId,
                                publicKey: this.serializePublicKey(publicKey),
                                compromised: false,
                                counter: "-1"
                            })];
                }
            });
        });
    };
    WebauthnClient.prototype.authenticate = function (challenge, signal) {
        return __awaiter(this, void 0, void 0, function () {
            var allowedKeys, signResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        allowedKeys = challenge.keys.map(function (key) {
                            return {
                                id: key.keyHandle,
                                type: "public-key"
                            };
                        });
                        return [4 /*yield*/, this.webauthn.sign({
                                challenge: challenge.challenge,
                                keys: allowedKeys,
                                domain: this.selectAuthenticationUrl(challenge)
                            })];
                    case 1:
                        signResult = _a.sent();
                        return [2 /*return*/, (0, TypeRefs_js_1.createWebauthnResponseData)({
                                keyHandle: new Uint8Array(signResult.rawId),
                                clientData: new Uint8Array(signResult.clientDataJSON),
                                signature: new Uint8Array(signResult.signature),
                                authenticatorData: new Uint8Array(signResult.authenticatorData)
                            })];
                }
            });
        });
    };
    WebauthnClient.prototype.abortCurrentOperation = function () {
        return this.webauthn.abortCurrentOperation();
    };
    WebauthnClient.prototype.selectAuthenticationUrl = function (challenge) {
        // We need to figure our for which page we need to open authentication based on the keys that user has added because users can register keys for our
        // domains as well as for whitelabel domains.
        var _this = this;
        var selectedClientUrl;
        if (challenge.keys.some(function (k) { return k.appId === WebAuthn_js_1.WEBAUTHN_RP_ID; })) {
            // First, if we find our own key then open web client on our URL.
            // Even if it's a different subdomain of ours it can still match because it is scoped for all tutanota.com subdomains
            selectedClientUrl = this.clientWebRoot;
        }
        else {
            // If it isn't there, look for any Webauthn key. Legacy U2F key ids ends with json subpath.
            var webauthnKey = challenge.keys.find(function (k) { return !_this.isLegacyU2fKey(k); });
            if (webauthnKey) {
                selectedClientUrl = "https://".concat(webauthnKey.appId);
            }
            else if (challenge.keys.some(function (k) { return k.appId === WebAuthn_js_1.U2F_APPID; })) {
                // There are only legacy U2F keys but there is one for our domain, take it
                selectedClientUrl = this.clientWebRoot;
            }
            else {
                // Nothing else worked, select legacy U2F key for whitelabel domain
                selectedClientUrl = this.legacyU2fKeyToBaseUrl((0, tutanota_utils_1.firstThrow)(challenge.keys));
            }
        }
        return selectedClientUrl;
    };
    WebauthnClient.prototype.isLegacyU2fKey = function (key) {
        return key.appId.endsWith(WebAuthn_js_1.U2f_APPID_SUFFIX);
    };
    WebauthnClient.prototype.legacyU2fKeyToBaseUrl = function (key) {
        (0, tutanota_utils_1.assert)(this.isLegacyU2fKey(key), "Is not a legacy u2f key");
        return key.appId.slice(0, -(WebAuthn_js_1.U2f_APPID_SUFFIX.length));
    };
    WebauthnClient.prototype.getChallenge = function () {
        // Should be replaced with our own entropy generator in the future.
        var random = new Uint8Array(32);
        crypto.getRandomValues(random);
        return random;
    };
    WebauthnClient.prototype.parseAttestationObject = function (raw) {
        return (0, cborg_1.decode)(new Uint8Array(raw));
    };
    WebauthnClient.prototype.parsePublicKey = function (authData) {
        // get the length of the credential ID
        var dataView = new DataView(new ArrayBuffer(2));
        var idLenBytes = authData.slice(53, 55);
        idLenBytes.forEach(function (value, index) { return dataView.setUint8(index, value); });
        var credentialIdLength = dataView.getUint16(0);
        // get the public key object
        var publicKeyBytes = authData.slice(55 + credentialIdLength);
        // the publicKeyBytes are encoded again as CBOR
        // We have to use maps here because keys are numeric and cborg only allows them in maps
        return (0, cborg_1.decode)(new Uint8Array(publicKeyBytes.buffer), {
            useMaps: true
        });
    };
    WebauthnClient.prototype.serializePublicKey = function (publicKey) {
        var encoded = new Uint8Array(65);
        encoded[0] = 0x04;
        var x = publicKey.get(-2);
        var y = publicKey.get(-3);
        if (!(x instanceof Uint8Array) || !(y instanceof Uint8Array)) {
            throw new Error("Public key is in unknown format");
        }
        encoded.set(x, 1);
        encoded.set(y, 33);
        return encoded;
    };
    return WebauthnClient;
}());
exports.WebauthnClient = WebauthnClient;
