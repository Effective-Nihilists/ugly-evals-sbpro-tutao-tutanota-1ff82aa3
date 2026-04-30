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
exports.ShareFacade = void 0;
var CryptoFacade_1 = require("../crypto/CryptoFacade");
var TypeRefs_js_1 = require("../../entities/sys/TypeRefs.js");
var TypeRefs_js_2 = require("../../entities/tutanota/TypeRefs.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var RecipientsNotFoundError_1 = require("../../common/error/RecipientsNotFoundError");
var Env_1 = require("../../common/Env");
var tutanota_crypto_1 = require("@tutao/tutanota-crypto");
var Services_js_1 = require("../../entities/tutanota/Services.js");
(0, Env_1.assertWorkerOrNode)();
var ShareFacade = /** @class */ (function () {
    function ShareFacade(userFacade, cryptoFacade, serviceExecutor, entityClient) {
        this.userFacade = userFacade;
        this.cryptoFacade = cryptoFacade;
        this.serviceExecutor = serviceExecutor;
        this.entityClient = entityClient;
    }
    ShareFacade.prototype.sendGroupInvitation = function (sharedGroupInfo, sharedGroupName, recipientMailAddresses, shareCapability) {
        return __awaiter(this, void 0, void 0, function () {
            var sharedGroupKey, userGroupInfo, userGroupInfoSessionKey, sharedGroupInfoSessionKey, bucketKey, invitationSessionKey, sharedGroupData, invitationData, notFoundRecipients, _i, recipientMailAddresses_1, mailAddress, keyData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sharedGroupKey = this.userFacade.getGroupKey(sharedGroupInfo.group);
                        return [4 /*yield*/, this.entityClient.load(TypeRefs_js_1.GroupInfoTypeRef, this.userFacade.getLoggedInUser().userGroup.groupInfo)];
                    case 1:
                        userGroupInfo = _a.sent();
                        return [4 /*yield*/, this.cryptoFacade.resolveSessionKeyForInstance(userGroupInfo)];
                    case 2:
                        userGroupInfoSessionKey = _a.sent();
                        return [4 /*yield*/, this.cryptoFacade.resolveSessionKeyForInstance(sharedGroupInfo)];
                    case 3:
                        sharedGroupInfoSessionKey = _a.sent();
                        bucketKey = (0, tutanota_crypto_1.aes128RandomKey)();
                        invitationSessionKey = (0, tutanota_crypto_1.aes128RandomKey)();
                        sharedGroupData = (0, TypeRefs_js_2.createSharedGroupData)({
                            sessionEncInviterName: (0, CryptoFacade_1.encryptString)(invitationSessionKey, userGroupInfo.name),
                            sessionEncSharedGroupKey: (0, CryptoFacade_1.encryptBytes)(invitationSessionKey, (0, tutanota_crypto_1.bitArrayToUint8Array)(sharedGroupKey)),
                            sessionEncSharedGroupName: (0, CryptoFacade_1.encryptString)(invitationSessionKey, sharedGroupName),
                            bucketEncInvitationSessionKey: (0, tutanota_crypto_1.encryptKey)(bucketKey, invitationSessionKey),
                            sharedGroupEncInviterGroupInfoKey: (0, tutanota_crypto_1.encryptKey)(sharedGroupKey, (0, tutanota_utils_1.neverNull)(userGroupInfoSessionKey)),
                            sharedGroupEncSharedGroupInfoKey: (0, tutanota_crypto_1.encryptKey)(sharedGroupKey, (0, tutanota_utils_1.neverNull)(sharedGroupInfoSessionKey)),
                            capability: shareCapability,
                            sharedGroup: sharedGroupInfo.group
                        });
                        invitationData = (0, TypeRefs_js_2.createGroupInvitationPostData)({
                            sharedGroupData: sharedGroupData,
                            internalKeyData: []
                        });
                        notFoundRecipients = [];
                        _i = 0, recipientMailAddresses_1 = recipientMailAddresses;
                        _a.label = 4;
                    case 4:
                        if (!(_i < recipientMailAddresses_1.length)) return [3 /*break*/, 7];
                        mailAddress = recipientMailAddresses_1[_i];
                        return [4 /*yield*/, this.cryptoFacade.encryptBucketKeyForInternalRecipient(bucketKey, mailAddress, notFoundRecipients)];
                    case 5:
                        keyData = _a.sent();
                        if (keyData) {
                            invitationData.internalKeyData.push(keyData);
                        }
                        _a.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7:
                        if (notFoundRecipients.length > 0) {
                            throw new RecipientsNotFoundError_1.RecipientsNotFoundError(notFoundRecipients.join("\n"));
                        }
                        return [2 /*return*/, this.serviceExecutor.post(Services_js_1.GroupInvitationService, invitationData)];
                }
            });
        });
    };
    ShareFacade.prototype.acceptGroupInvitation = function (invitation) {
        return __awaiter(this, void 0, void 0, function () {
            var userGroupInfo, userGroupInfoSessionKey, sharedGroupKey, serviceData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.entityClient.load(TypeRefs_js_1.GroupInfoTypeRef, this.userFacade.getLoggedInUser().userGroup.groupInfo)];
                    case 1:
                        userGroupInfo = _a.sent();
                        return [4 /*yield*/, this.cryptoFacade.resolveSessionKeyForInstance(userGroupInfo)];
                    case 2:
                        userGroupInfoSessionKey = _a.sent();
                        sharedGroupKey = (0, tutanota_crypto_1.uint8ArrayToBitArray)(invitation.sharedGroupKey);
                        serviceData = (0, TypeRefs_js_2.createGroupInvitationPutData)({
                            receivedInvitation: invitation._id,
                            userGroupEncGroupKey: (0, tutanota_crypto_1.encryptKey)(this.userFacade.getUserGroupKey(), sharedGroupKey),
                            sharedGroupEncInviteeGroupInfoKey: (0, tutanota_crypto_1.encryptKey)(sharedGroupKey, (0, tutanota_utils_1.neverNull)(userGroupInfoSessionKey))
                        });
                        return [4 /*yield*/, this.serviceExecutor.put(Services_js_1.GroupInvitationService, serviceData)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ShareFacade.prototype.rejectGroupInvitation = function (receivedGroupInvitaitonId) {
        return __awaiter(this, void 0, void 0, function () {
            var serviceData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        serviceData = (0, TypeRefs_js_2.createGroupInvitationDeleteData)({
                            receivedInvitation: receivedGroupInvitaitonId
                        });
                        return [4 /*yield*/, this.serviceExecutor["delete"](Services_js_1.GroupInvitationService, serviceData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return ShareFacade;
}());
exports.ShareFacade = ShareFacade;
