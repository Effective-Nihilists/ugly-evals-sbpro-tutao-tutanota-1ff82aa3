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
exports.GiftCardFacade = void 0;
var TutanotaConstants_1 = require("../../common/TutanotaConstants");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var TypeRefs_js_1 = require("../../entities/sys/TypeRefs.js");
var tutanota_crypto_1 = require("@tutao/tutanota-crypto");
var Services_1 = require("../../entities/sys/Services");
var EntityUtils_1 = require("../../common/utils/EntityUtils");
var ProgrammingError_js_1 = require("../../common/error/ProgrammingError.js");
var ID_LENGTH = EntityUtils_1.GENERATED_MAX_ID.length;
var KEY_LENGTH_B64 = 24;
var GiftCardFacade = /** @class */ (function () {
    function GiftCardFacade(user, customer, serviceExecutor, cryptoFacade) {
        this.user = user;
        this.customer = customer;
        this.serviceExecutor = serviceExecutor;
        this.cryptoFacade = cryptoFacade;
    }
    GiftCardFacade.prototype.generateGiftCard = function (message, value) {
        return __awaiter(this, void 0, void 0, function () {
            var adminGroupIds, ownerKey, sessionKey, giftCard;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        adminGroupIds = this.user.getGroupIds(TutanotaConstants_1.GroupType.Admin);
                        if (adminGroupIds.length === 0) {
                            throw new Error("missing admin membership");
                        }
                        ownerKey = this.user.getGroupKey((0, tutanota_utils_1.firstThrow)(adminGroupIds)) // adminGroupKey
                        ;
                        sessionKey = (0, tutanota_crypto_1.aes128RandomKey)();
                        return [4 /*yield*/, this.serviceExecutor.post(Services_1.GiftCardService, (0, TypeRefs_js_1.createGiftCardCreateData)({
                                message: message,
                                keyHash: (0, tutanota_crypto_1.sha256Hash)((0, tutanota_crypto_1.bitArrayToUint8Array)(sessionKey)),
                                value: value,
                                ownerEncSessionKey: (0, tutanota_crypto_1.encryptKey)(ownerKey, sessionKey)
                            }), { sessionKey: sessionKey })];
                    case 1:
                        giftCard = (_a.sent()).giftCard;
                        return [2 /*return*/, giftCard];
                }
            });
        });
    };
    GiftCardFacade.prototype.getGiftCardInfo = function (id, key) {
        return this.serviceExecutor.get(Services_1.GiftCardRedeemService, (0, TypeRefs_js_1.createGiftCardRedeemData)({
            giftCardInfo: id,
            keyHash: (0, tutanota_crypto_1.sha256Hash)((0, tutanota_crypto_1.bitArrayToUint8Array)((0, tutanota_crypto_1.base64ToKey)(key)))
        }), {
            sessionKey: (0, tutanota_crypto_1.base64ToKey)(key)
        });
    };
    GiftCardFacade.prototype.redeemGiftCard = function (giftCardInfoId, key, 
    /** Country code to use if a free user is being upgraded to premium (required if accountType is free) */
    countryCode) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.customer.loadAccountingInfo()];
                    case 1:
                        if ((_a.sent()).invoiceCountry == null
                            && countryCode == null) {
                            throw new ProgrammingError_js_1.ProgrammingError("User must provide a country");
                        }
                        return [4 /*yield*/, this.serviceExecutor.post(Services_1.GiftCardRedeemService, (0, TypeRefs_js_1.createGiftCardRedeemData)({
                                giftCardInfo: giftCardInfoId,
                                keyHash: (0, tutanota_crypto_1.sha256Hash)((0, tutanota_crypto_1.bitArrayToUint8Array)((0, tutanota_crypto_1.base64ToKey)(key))),
                                countryCode: countryCode
                            }))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GiftCardFacade.prototype.encodeGiftCardToken = function (giftCard) {
        return __awaiter(this, void 0, void 0, function () {
            var key, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = tutanota_utils_1.assertNotNull;
                        return [4 /*yield*/, this.cryptoFacade.resolveSessionKeyForInstance(giftCard)];
                    case 1:
                        key = _a.apply(void 0, [_b.sent()]);
                        return [2 /*return*/, this.encodeToken((0, EntityUtils_1.elementIdPart)(giftCard._id), (0, tutanota_crypto_1.bitArrayToUint8Array)(key))];
                }
            });
        });
    };
    GiftCardFacade.prototype.decodeGiftCardToken = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var id, key;
            return __generator(this, function (_a) {
                id = (0, tutanota_utils_1.base64ToBase64Ext)((0, tutanota_utils_1.base64UrlToBase64)(token.slice(0, ID_LENGTH)));
                key = (0, tutanota_utils_1.base64UrlToBase64)(token.slice(ID_LENGTH, token.length));
                if (id.length !== ID_LENGTH || key.length !== KEY_LENGTH_B64) {
                    throw new Error("invalid token");
                }
                return [2 /*return*/, { id: id, key: key }];
            });
        });
    };
    GiftCardFacade.prototype.encodeToken = function (id, key) {
        if (id.length !== ID_LENGTH) {
            throw new Error("Invalid gift card params");
        }
        var keyBase64 = (0, tutanota_utils_1.uint8ArrayToBase64)(key);
        if (keyBase64.length != KEY_LENGTH_B64) {
            throw new Error("Invalid gift card key");
        }
        var idPart = (0, tutanota_utils_1.base64ToBase64Url)((0, tutanota_utils_1.base64ExtToBase64)(id));
        var keyPart = (0, tutanota_utils_1.base64ToBase64Url)(keyBase64);
        return idPart + keyPart;
    };
    return GiftCardFacade;
}());
exports.GiftCardFacade = GiftCardFacade;
