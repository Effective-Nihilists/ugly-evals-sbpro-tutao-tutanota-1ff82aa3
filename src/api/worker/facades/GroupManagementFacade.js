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
exports.GroupManagementFacade = void 0;
var TutanotaConstants_1 = require("../../common/TutanotaConstants");
var TypeRefs_js_1 = require("../../entities/tutanota/TypeRefs.js");
var TypeRefs_js_2 = require("../../entities/tutanota/TypeRefs.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var TypeRefs_js_3 = require("../../entities/tutanota/TypeRefs.js");
var TypeRefs_js_4 = require("../../entities/sys/TypeRefs.js");
var TypeRefs_js_5 = require("../../entities/sys/TypeRefs.js");
var TypeRefs_js_6 = require("../../entities/sys/TypeRefs.js");
var TypeRefs_js_7 = require("../../entities/tutanota/TypeRefs.js");
var TypeRefs_js_8 = require("../../entities/tutanota/TypeRefs.js");
var TypeRefs_js_9 = require("../../entities/tutanota/TypeRefs.js");
var Env_1 = require("../../common/Env");
var CryptoFacade_1 = require("../crypto/CryptoFacade");
var tutanota_crypto_1 = require("@tutao/tutanota-crypto");
var Services_1 = require("../../entities/tutanota/Services");
var Services_2 = require("../../entities/sys/Services");
(0, Env_1.assertWorkerOrNode)();
var GroupManagementFacade = /** @class */ (function () {
    function GroupManagementFacade(user, counters, entityClient, rsa, serviceExecutor) {
        this.user = user;
        this.counters = counters;
        this.entityClient = entityClient;
        this.rsa = rsa;
        this.serviceExecutor = serviceExecutor;
    }
    GroupManagementFacade.prototype.readUsedGroupStorage = function (groupId) {
        return this.counters.readCounterValue(TutanotaConstants_1.Const.COUNTER_USED_MEMORY, groupId).then(function (usedStorage) {
            return Number(usedStorage);
        });
    };
    GroupManagementFacade.prototype.createMailGroup = function (name, mailAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var adminGroupIds, adminGroupKey, customerGroupKey, mailGroupKey, mailGroupInfoSessionKey, mailboxSessionKey, keyPair, mailGroupData, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        adminGroupIds = this.user.getGroupIds(TutanotaConstants_1.GroupType.Admin);
                        if (adminGroupIds.length === 0) {
                            adminGroupIds = this.user.getGroupIds(TutanotaConstants_1.GroupType.LocalAdmin);
                        }
                        adminGroupKey = this.user.getGroupKey(adminGroupIds[0]);
                        customerGroupKey = this.user.getGroupKey(this.user.getGroupId(TutanotaConstants_1.GroupType.Customer));
                        mailGroupKey = (0, tutanota_crypto_1.aes128RandomKey)();
                        mailGroupInfoSessionKey = (0, tutanota_crypto_1.aes128RandomKey)();
                        mailboxSessionKey = (0, tutanota_crypto_1.aes128RandomKey)();
                        return [4 /*yield*/, this.rsa.generateKey()];
                    case 1:
                        keyPair = _a.sent();
                        return [4 /*yield*/, this.generateInternalGroupData(keyPair, mailGroupKey, mailGroupInfoSessionKey, adminGroupIds[0], adminGroupKey, customerGroupKey)];
                    case 2:
                        mailGroupData = _a.sent();
                        data = (0, TypeRefs_js_1.createCreateMailGroupData)({
                            mailAddress: mailAddress,
                            encryptedName: (0, CryptoFacade_1.encryptString)(mailGroupInfoSessionKey, name),
                            mailEncMailboxSessionKey: (0, tutanota_crypto_1.encryptKey)(mailGroupKey, mailboxSessionKey),
                            groupData: mailGroupData
                        });
                        return [4 /*yield*/, this.serviceExecutor.post(Services_1.MailGroupService, data)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GroupManagementFacade.prototype.createLocalAdminGroup = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var adminGroupId, adminGroupKey, customerGroupKey, groupKey, groupInfoSessionKey, keyPair, mailGroupData, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        adminGroupId = this.user.getGroupId(TutanotaConstants_1.GroupType.Admin);
                        adminGroupKey = this.user.getGroupKey(adminGroupId);
                        customerGroupKey = this.user.getGroupKey(this.user.getGroupId(TutanotaConstants_1.GroupType.Customer));
                        groupKey = (0, tutanota_crypto_1.aes128RandomKey)();
                        groupInfoSessionKey = (0, tutanota_crypto_1.aes128RandomKey)();
                        return [4 /*yield*/, this.rsa.generateKey()];
                    case 1:
                        keyPair = _a.sent();
                        return [4 /*yield*/, this.generateInternalGroupData(keyPair, groupKey, groupInfoSessionKey, adminGroupId, adminGroupKey, customerGroupKey)];
                    case 2:
                        mailGroupData = _a.sent();
                        data = (0, TypeRefs_js_3.createCreateLocalAdminGroupData)({
                            encryptedName: (0, CryptoFacade_1.encryptString)(groupInfoSessionKey, name),
                            groupData: mailGroupData
                        });
                        return [4 /*yield*/, this.serviceExecutor.post(Services_1.LocalAdminGroupService, data)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Generates keys for the new group and prepares the group data object to create the group.
     *
     * @param adminGroup Is not set when generating new customer, then the admin group will be the admin of the customer
     * @param adminGroupKey Is not set when generating calendar as normal user
     * @param customerGroupKey Group key of the customer
     * @param userGroupKey user group key
     * @param name Name of the group
     */
    GroupManagementFacade.prototype.generateUserAreaGroupData = function (name) {
        var _this = this;
        return this.entityClient.load(TypeRefs_js_4.GroupTypeRef, this.user.getUserGroupId()).then(function (userGroup) {
            var adminGroupId = (0, tutanota_utils_1.neverNull)(userGroup.admin); // user group has always admin group
            var adminGroupKey = null;
            if (_this.user.getAllGroupIds().indexOf(adminGroupId) !== -1) {
                // getGroupKey throws an error if user is not member of that group - so check first
                adminGroupKey = _this.user.getGroupKey(adminGroupId);
            }
            var customerGroupKey = _this.user.getGroupKey(_this.user.getGroupId(TutanotaConstants_1.GroupType.Customer));
            var userGroupKey = _this.user.getUserGroupKey();
            var groupRootSessionKey = (0, tutanota_crypto_1.aes128RandomKey)();
            var groupInfoSessionKey = (0, tutanota_crypto_1.aes128RandomKey)();
            var groupKey = (0, tutanota_crypto_1.aes128RandomKey)();
            return (0, TypeRefs_js_9.createUserAreaGroupData)({
                groupEncGroupRootSessionKey: (0, tutanota_crypto_1.encryptKey)(groupKey, groupRootSessionKey),
                customerEncGroupInfoSessionKey: (0, tutanota_crypto_1.encryptKey)(customerGroupKey, groupInfoSessionKey),
                userEncGroupKey: (0, tutanota_crypto_1.encryptKey)(userGroupKey, groupKey),
                groupInfoEncName: (0, CryptoFacade_1.encryptString)(groupInfoSessionKey, name),
                adminEncGroupKey: adminGroupKey ? (0, tutanota_crypto_1.encryptKey)(adminGroupKey, groupKey) : null,
                adminGroup: adminGroupId
            });
        });
    };
    GroupManagementFacade.prototype.createTemplateGroup = function (name) {
        var _this = this;
        return this.generateUserAreaGroupData(name).then(function (groupData) {
            var serviceData = (0, TypeRefs_js_8.createUserAreaGroupPostData)({
                groupData: groupData
            });
            return _this.serviceExecutor.post(Services_1.TemplateGroupService, serviceData)
                .then(function (returnValue) { return returnValue.group; });
        });
    };
    GroupManagementFacade.prototype.generateInternalGroupData = function (keyPair, groupKey, groupInfoSessionKey, adminGroupId, adminGroupKey, ownerGroupKey) {
        var groupData = (0, TypeRefs_js_2.createInternalGroupData)();
        groupData.publicKey = (0, tutanota_utils_1.hexToUint8Array)((0, tutanota_crypto_1.publicKeyToHex)(keyPair.publicKey));
        groupData.groupEncPrivateKey = (0, tutanota_crypto_1.encryptRsaKey)(groupKey, keyPair.privateKey);
        groupData.adminGroup = adminGroupId;
        groupData.adminEncGroupKey = (0, tutanota_crypto_1.encryptKey)(adminGroupKey, groupKey);
        groupData.ownerEncGroupInfoSessionKey = (0, tutanota_crypto_1.encryptKey)(ownerGroupKey, groupInfoSessionKey);
        return groupData;
    };
    GroupManagementFacade.prototype.addUserToGroup = function (user, groupId) {
        return __awaiter(this, void 0, void 0, function () {
            var userGroupKey, groupKey, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getGroupKeyAsAdmin(user.userGroup.group)];
                    case 1:
                        userGroupKey = _a.sent();
                        return [4 /*yield*/, this.getGroupKeyAsAdmin(groupId)];
                    case 2:
                        groupKey = _a.sent();
                        data = (0, TypeRefs_js_5.createMembershipAddData)({
                            user: user._id,
                            group: groupId,
                            symEncGKey: (0, tutanota_crypto_1.encryptKey)(userGroupKey, groupKey)
                        });
                        return [4 /*yield*/, this.serviceExecutor.post(Services_2.MembershipService, data)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GroupManagementFacade.prototype.removeUserFromGroup = function (userId, groupId) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = (0, TypeRefs_js_6.createMembershipRemoveData)({
                            user: userId,
                            group: groupId
                        });
                        return [4 /*yield*/, this.serviceExecutor["delete"](Services_2.MembershipService, data)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GroupManagementFacade.prototype.deactivateGroup = function (group, restore) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = (0, TypeRefs_js_7.createDeleteGroupData)({
                            group: group._id,
                            restore: restore
                        });
                        if (!(group.type === TutanotaConstants_1.GroupType.Mail)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.serviceExecutor["delete"](Services_1.MailGroupService, data)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 2:
                        if (!(group.type === TutanotaConstants_1.GroupType.LocalAdmin)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.serviceExecutor["delete"](Services_1.LocalAdminGroupService, data)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4: throw new Error("invalid group type for deactivation");
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    GroupManagementFacade.prototype.getGroupKeyAsAdmin = function (groupId) {
        var _this = this;
        if (this.user.hasGroup(groupId)) {
            // e.g. I am a global admin and want to add another user to the global admin group
            return Promise.resolve(this.user.getGroupKey((0, tutanota_utils_1.neverNull)(groupId)));
        }
        else {
            return this.entityClient.load(TypeRefs_js_4.GroupTypeRef, groupId).then(function (group) {
                return Promise.resolve()
                    .then(function () {
                    if (group.admin && _this.user.hasGroup(group.admin)) {
                        // e.g. I am a member of the group that administrates group G and want to add a new member to G
                        return _this.user.getGroupKey((0, tutanota_utils_1.neverNull)(group.admin));
                    }
                    else {
                        // e.g. I am a global admin but group G is administrated by a local admin group and want to add a new member to G
                        var globalAdminGroupId_1 = _this.user.getGroupId(TutanotaConstants_1.GroupType.Admin);
                        var globalAdminGroupKey_1 = _this.user.getGroupKey(globalAdminGroupId_1);
                        return _this.entityClient.load(TypeRefs_js_4.GroupTypeRef, (0, tutanota_utils_1.neverNull)(group.admin)).then(function (localAdminGroup) {
                            if (localAdminGroup.admin === globalAdminGroupId_1) {
                                return (0, tutanota_crypto_1.decryptKey)(globalAdminGroupKey_1, (0, tutanota_utils_1.neverNull)(localAdminGroup.adminGroupEncGKey));
                            }
                            else {
                                throw new Error("local admin group ".concat(localAdminGroup._id, " is not administrated by global admin group ").concat(globalAdminGroupId_1));
                            }
                        });
                    }
                })
                    .then(function (adminGroupKey) {
                    return (0, tutanota_crypto_1.decryptKey)(adminGroupKey, (0, tutanota_utils_1.neverNull)(group.adminGroupEncGKey));
                });
            });
        }
    };
    return GroupManagementFacade;
}());
exports.GroupManagementFacade = GroupManagementFacade;
