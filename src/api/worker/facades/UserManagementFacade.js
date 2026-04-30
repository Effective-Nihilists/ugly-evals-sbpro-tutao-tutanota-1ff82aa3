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
exports.UserManagementFacade = void 0;
var TutanotaConstants_1 = require("../../common/TutanotaConstants");
var TypeRefs_js_1 = require("../../entities/sys/TypeRefs.js");
var CryptoFacade_1 = require("../crypto/CryptoFacade");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var TypeRefs_js_2 = require("../../entities/tutanota/TypeRefs.js");
var Env_1 = require("../../common/Env");
var tutanota_crypto_1 = require("@tutao/tutanota-crypto");
var Services_1 = require("../../entities/sys/Services");
var Services_2 = require("../../entities/tutanota/Services");
(0, Env_1.assertWorkerOrNode)();
var UserManagementFacade = /** @class */ (function () {
    function UserManagementFacade(worker, userFacade, groupManagement, counters, rsa, entityClient, serviceExecutor) {
        this.worker = worker;
        this.userFacade = userFacade;
        this.groupManagement = groupManagement;
        this.counters = counters;
        this.rsa = rsa;
        this.entityClient = entityClient;
        this.serviceExecutor = serviceExecutor;
    }
    UserManagementFacade.prototype.changeUserPassword = function (user, newPassword) {
        return __awaiter(this, void 0, void 0, function () {
            var userGroupKey, salt, passwordKey, pwEncUserGroupKey, passwordVerifier, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.groupManagement.getGroupKeyAsAdmin(user.userGroup.group)];
                    case 1:
                        userGroupKey = _a.sent();
                        salt = (0, tutanota_crypto_1.generateRandomSalt)();
                        passwordKey = (0, tutanota_crypto_1.generateKeyFromPassphrase)(newPassword, salt, tutanota_crypto_1.KeyLength.b128);
                        pwEncUserGroupKey = (0, tutanota_crypto_1.encryptKey)(passwordKey, userGroupKey);
                        passwordVerifier = (0, tutanota_crypto_1.createAuthVerifier)(passwordKey);
                        data = (0, TypeRefs_js_1.createResetPasswordData)({
                            user: user._id,
                            salt: salt,
                            verifier: passwordVerifier,
                            pwEncUserGroupKey: pwEncUserGroupKey
                        });
                        return [4 /*yield*/, this.serviceExecutor.post(Services_1.ResetPasswordService, data)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UserManagementFacade.prototype.changeAdminFlag = function (user, admin) {
        return __awaiter(this, void 0, void 0, function () {
            var adminGroupId, adminGroupKey, userGroup, userGroupKey, keyData, addAccountGroup, keyData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        adminGroupId = this.userFacade.getGroupId(TutanotaConstants_1.GroupType.Admin);
                        adminGroupKey = this.userFacade.getGroupKey(adminGroupId);
                        return [4 /*yield*/, this.entityClient.load(TypeRefs_js_1.GroupTypeRef, user.userGroup.group)];
                    case 1:
                        userGroup = _a.sent();
                        userGroupKey = (0, tutanota_crypto_1.decryptKey)(adminGroupKey, (0, tutanota_utils_1.neverNull)(userGroup.adminGroupEncGKey));
                        if (!admin) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.groupManagement.addUserToGroup(user, adminGroupId)];
                    case 2:
                        _a.sent();
                        if (!(user.accountType !== TutanotaConstants_1.AccountType.SYSTEM)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this._getAccountKeyData()
                            // we can not use addUserToGroup here because the admin is not admin of the account group
                        ];
                    case 3:
                        keyData = _a.sent();
                        addAccountGroup = (0, TypeRefs_js_1.createMembershipAddData)({
                            user: user._id,
                            group: keyData.group,
                            symEncGKey: (0, tutanota_crypto_1.encryptKey)(userGroupKey, (0, tutanota_crypto_1.decryptKey)(this.userFacade.getUserGroupKey(), keyData.symEncGKey))
                        });
                        return [4 /*yield*/, this.serviceExecutor.post(Services_1.MembershipService, addAccountGroup)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [3 /*break*/, 9];
                    case 6: return [4 /*yield*/, this.groupManagement.removeUserFromGroup(user._id, adminGroupId)];
                    case 7:
                        _a.sent();
                        if (!(user.accountType !== TutanotaConstants_1.AccountType.SYSTEM)) return [3 /*break*/, 9];
                        return [4 /*yield*/, this._getAccountKeyData()];
                    case 8:
                        keyData = _a.sent();
                        return [2 /*return*/, this.groupManagement.removeUserFromGroup(user._id, keyData.group)];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get key and id of premium or starter group.
     * @throws Error if account type is not premium or starter
     *
     * @private
     */
    UserManagementFacade.prototype._getAccountKeyData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var keysReturn, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.serviceExecutor.get(Services_1.SystemKeysService, null)];
                    case 1:
                        keysReturn = _a.sent();
                        user = this.userFacade.getLoggedInUser();
                        if (user.accountType === TutanotaConstants_1.AccountType.PREMIUM) {
                            return [2 /*return*/, {
                                    group: (0, tutanota_utils_1.neverNull)(keysReturn.premiumGroup),
                                    symEncGKey: keysReturn.premiumGroupKey
                                }];
                        }
                        else if (user.accountType === TutanotaConstants_1.AccountType.STARTER) {
                            // We don't have starterGroup on SystemKeyReturn so we hardcode it for now.
                            return [2 /*return*/, {
                                    group: "JDpWrwG----0",
                                    symEncGKey: keysReturn.starterGroupKey
                                }];
                        }
                        else {
                            throw new Error("Trying to get keyData for user with account type ".concat(user.accountType));
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    UserManagementFacade.prototype.updateAdminship = function (groupId, newAdminGroupId) {
        return __awaiter(this, void 0, void 0, function () {
            var adminGroupId, newAdminGroup, group, oldAdminGroup, adminGroupKey, groupKey, localAdminGroupKey, newAdminGroupEncGKey, localAdminGroupKey, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        adminGroupId = this.userFacade.getGroupId(TutanotaConstants_1.GroupType.Admin);
                        return [4 /*yield*/, this.entityClient.load(TypeRefs_js_1.GroupTypeRef, newAdminGroupId)];
                    case 1:
                        newAdminGroup = _a.sent();
                        return [4 /*yield*/, this.entityClient.load(TypeRefs_js_1.GroupTypeRef, groupId)];
                    case 2:
                        group = _a.sent();
                        return [4 /*yield*/, this.entityClient.load(TypeRefs_js_1.GroupTypeRef, (0, tutanota_utils_1.neverNull)(group.admin))];
                    case 3:
                        oldAdminGroup = _a.sent();
                        adminGroupKey = this.userFacade.getGroupKey(adminGroupId);
                        if (oldAdminGroup._id === adminGroupId) {
                            groupKey = (0, tutanota_crypto_1.decryptKey)(adminGroupKey, (0, tutanota_utils_1.neverNull)(group.adminGroupEncGKey));
                        }
                        else {
                            localAdminGroupKey = (0, tutanota_crypto_1.decryptKey)(adminGroupKey, (0, tutanota_utils_1.neverNull)(oldAdminGroup.adminGroupEncGKey));
                            groupKey = (0, tutanota_crypto_1.decryptKey)(localAdminGroupKey, (0, tutanota_utils_1.neverNull)(group.adminGroupEncGKey));
                        }
                        if (newAdminGroup._id === adminGroupId) {
                            newAdminGroupEncGKey = (0, tutanota_crypto_1.encryptKey)(adminGroupKey, groupKey);
                        }
                        else {
                            localAdminGroupKey = (0, tutanota_crypto_1.decryptKey)(adminGroupKey, (0, tutanota_utils_1.neverNull)(newAdminGroup.adminGroupEncGKey));
                            newAdminGroupEncGKey = (0, tutanota_crypto_1.encryptKey)(localAdminGroupKey, groupKey);
                        }
                        data = (0, TypeRefs_js_1.createUpdateAdminshipData)({
                            group: group._id,
                            newAdminGroup: newAdminGroup._id,
                            newAdminGroupEncGKey: newAdminGroupEncGKey
                        });
                        return [4 /*yield*/, this.serviceExecutor.post(Services_1.UpdateAdminshipService, data)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UserManagementFacade.prototype.readUsedUserStorage = function (user) {
        var _this = this;
        return this.counters.readCounterValue(TutanotaConstants_1.Const.COUNTER_USED_MEMORY, this._getGroupId(user, TutanotaConstants_1.GroupType.Mail)).then(function (mailStorage) {
            return _this.counters.readCounterValue(TutanotaConstants_1.Const.COUNTER_USED_MEMORY, _this._getGroupId(user, TutanotaConstants_1.GroupType.Contact)).then(function (contactStorage) {
                return _this.counters.readCounterValue(TutanotaConstants_1.Const.COUNTER_USED_MEMORY, _this._getGroupId(user, TutanotaConstants_1.GroupType.File)).then(function (fileStorage) {
                    return Number(mailStorage) + Number(contactStorage) + Number(fileStorage);
                });
            });
        });
    };
    UserManagementFacade.prototype.deleteUser = function (user, restore) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = (0, TypeRefs_js_1.createUserDataDelete)({
                            user: user._id,
                            restore: restore,
                            date: TutanotaConstants_1.Const.CURRENT_DATE
                        });
                        return [4 /*yield*/, this.serviceExecutor["delete"](Services_1.UserService, data)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UserManagementFacade.prototype._getGroupId = function (user, groupType) {
        if (groupType === TutanotaConstants_1.GroupType.User) {
            return user.userGroup.group;
        }
        else {
            var membership = user.memberships.find(function (m) { return m.groupType === groupType; });
            if (!membership) {
                throw new Error("could not find groupType " + groupType + " for user " + user._id);
            }
            return membership.group;
        }
    };
    UserManagementFacade.prototype.createUser = function (name, mailAddress, password, userIndex, overallNbrOfUsersToCreate) {
        var _this = this;
        var adminGroupIds = this.userFacade.getGroupIds(TutanotaConstants_1.GroupType.Admin);
        if (adminGroupIds.length === 0) {
            adminGroupIds = this.userFacade.getGroupIds(TutanotaConstants_1.GroupType.LocalAdmin);
        }
        var adminGroupId = adminGroupIds[0];
        var adminGroupKey = this.userFacade.getGroupKey(adminGroupId);
        var customerGroupKey = this.userFacade.getGroupKey(this.userFacade.getGroupId(TutanotaConstants_1.GroupType.Customer));
        var userGroupKey = (0, tutanota_crypto_1.aes128RandomKey)();
        var userGroupInfoSessionKey = (0, tutanota_crypto_1.aes128RandomKey)();
        return this.rsa
            .generateKey()
            .then(function (keyPair) {
            return _this.groupManagement.generateInternalGroupData(keyPair, userGroupKey, userGroupInfoSessionKey, adminGroupId, adminGroupKey, customerGroupKey);
        })
            .then(function (userGroupData) {
            return _this.worker.sendProgress(((userIndex + 0.8) / overallNbrOfUsersToCreate) * 100).then(function () {
                var data = (0, TypeRefs_js_2.createUserAccountCreateData)();
                data.date = TutanotaConstants_1.Const.CURRENT_DATE;
                data.userGroupData = userGroupData;
                data.userData = _this.generateUserAccountData(userGroupKey, userGroupInfoSessionKey, customerGroupKey, mailAddress, password, name, _this.generateRecoveryCode(userGroupKey));
                return _this.serviceExecutor.post(Services_2.UserAccountService, data).then(function () {
                    return _this.worker.sendProgress(((userIndex + 1) / overallNbrOfUsersToCreate) * 100);
                });
            });
        });
    };
    UserManagementFacade.prototype.generateUserAccountData = function (userGroupKey, userGroupInfoSessionKey, customerGroupKey, mailAddress, password, userName, recoverData) {
        var salt = (0, tutanota_crypto_1.generateRandomSalt)();
        var userPassphraseKey = (0, tutanota_crypto_1.generateKeyFromPassphrase)(password, salt, tutanota_crypto_1.KeyLength.b128);
        var mailGroupKey = (0, tutanota_crypto_1.aes128RandomKey)();
        var contactGroupKey = (0, tutanota_crypto_1.aes128RandomKey)();
        var fileGroupKey = (0, tutanota_crypto_1.aes128RandomKey)();
        var clientKey = (0, tutanota_crypto_1.aes128RandomKey)();
        var mailboxSessionKey = (0, tutanota_crypto_1.aes128RandomKey)();
        var contactListSessionKey = (0, tutanota_crypto_1.aes128RandomKey)();
        var fileSystemSessionKey = (0, tutanota_crypto_1.aes128RandomKey)();
        var mailGroupInfoSessionKey = (0, tutanota_crypto_1.aes128RandomKey)();
        var contactGroupInfoSessionKey = (0, tutanota_crypto_1.aes128RandomKey)();
        var fileGroupInfoSessionKey = (0, tutanota_crypto_1.aes128RandomKey)();
        var tutanotaPropertiesSessionKey = (0, tutanota_crypto_1.aes128RandomKey)();
        var userEncEntropy = (0, CryptoFacade_1.encryptBytes)(userGroupKey, tutanota_crypto_1.random.generateRandomData(32));
        var userData = (0, TypeRefs_js_2.createUserAccountUserData)();
        userData.mailAddress = mailAddress;
        userData.encryptedName = (0, CryptoFacade_1.encryptString)(userGroupInfoSessionKey, userName);
        userData.salt = salt;
        userData.verifier = (0, tutanota_crypto_1.createAuthVerifier)(userPassphraseKey);
        userData.userEncClientKey = (0, tutanota_crypto_1.encryptKey)(userGroupKey, clientKey);
        userData.pwEncUserGroupKey = (0, tutanota_crypto_1.encryptKey)(userPassphraseKey, userGroupKey);
        userData.userEncCustomerGroupKey = (0, tutanota_crypto_1.encryptKey)(userGroupKey, customerGroupKey);
        userData.userEncMailGroupKey = (0, tutanota_crypto_1.encryptKey)(userGroupKey, mailGroupKey);
        userData.userEncContactGroupKey = (0, tutanota_crypto_1.encryptKey)(userGroupKey, contactGroupKey);
        userData.userEncFileGroupKey = (0, tutanota_crypto_1.encryptKey)(userGroupKey, fileGroupKey);
        userData.userEncEntropy = userEncEntropy;
        userData.userEncTutanotaPropertiesSessionKey = (0, tutanota_crypto_1.encryptKey)(userGroupKey, tutanotaPropertiesSessionKey);
        userData.mailEncMailBoxSessionKey = (0, tutanota_crypto_1.encryptKey)(mailGroupKey, mailboxSessionKey);
        userData.contactEncContactListSessionKey = (0, tutanota_crypto_1.encryptKey)(contactGroupKey, contactListSessionKey);
        userData.fileEncFileSystemSessionKey = (0, tutanota_crypto_1.encryptKey)(fileGroupKey, fileSystemSessionKey);
        userData.customerEncMailGroupInfoSessionKey = (0, tutanota_crypto_1.encryptKey)(customerGroupKey, mailGroupInfoSessionKey);
        userData.customerEncContactGroupInfoSessionKey = (0, tutanota_crypto_1.encryptKey)(customerGroupKey, contactGroupInfoSessionKey);
        userData.customerEncFileGroupInfoSessionKey = (0, tutanota_crypto_1.encryptKey)(customerGroupKey, fileGroupInfoSessionKey);
        userData.userEncRecoverCode = recoverData.userEncRecoverCode;
        userData.recoverCodeEncUserGroupKey = recoverData.recoverCodeEncUserGroupKey;
        userData.recoverCodeVerifier = recoverData.recoveryCodeVerifier;
        return userData;
    };
    UserManagementFacade.prototype.generateContactFormUserAccountData = function (userGroupKey, password) {
        var salt = (0, tutanota_crypto_1.generateRandomSalt)();
        var userPassphraseKey = (0, tutanota_crypto_1.generateKeyFromPassphrase)(password, salt, tutanota_crypto_1.KeyLength.b128);
        var mailGroupKey = (0, tutanota_crypto_1.aes128RandomKey)();
        var clientKey = (0, tutanota_crypto_1.aes128RandomKey)();
        var mailboxSessionKey = (0, tutanota_crypto_1.aes128RandomKey)();
        var mailGroupInfoSessionKey = (0, tutanota_crypto_1.aes128RandomKey)();
        var tutanotaPropertiesSessionKey = (0, tutanota_crypto_1.aes128RandomKey)();
        var userEncEntropy = (0, CryptoFacade_1.encryptBytes)(userGroupKey, tutanota_crypto_1.random.generateRandomData(32));
        var userData = (0, TypeRefs_js_2.createContactFormUserData)();
        userData.salt = salt;
        userData.verifier = (0, tutanota_crypto_1.createAuthVerifier)(userPassphraseKey);
        userData.userEncClientKey = (0, tutanota_crypto_1.encryptKey)(userGroupKey, clientKey);
        userData.pwEncUserGroupKey = (0, tutanota_crypto_1.encryptKey)(userPassphraseKey, userGroupKey);
        userData.userEncMailGroupKey = (0, tutanota_crypto_1.encryptKey)(userGroupKey, mailGroupKey);
        userData.userEncEntropy = userEncEntropy;
        userData.userEncTutanotaPropertiesSessionKey = (0, tutanota_crypto_1.encryptKey)(userGroupKey, tutanotaPropertiesSessionKey);
        userData.mailEncMailBoxSessionKey = (0, tutanota_crypto_1.encryptKey)(mailGroupKey, mailboxSessionKey);
        userData.ownerEncMailGroupInfoSessionKey = (0, tutanota_crypto_1.encryptKey)(mailGroupKey, mailGroupInfoSessionKey);
        return userData;
    };
    UserManagementFacade.prototype.generateRecoveryCode = function (userGroupKey) {
        var recoveryCode = (0, tutanota_crypto_1.aes256RandomKey)();
        var userEncRecoverCode = (0, tutanota_crypto_1.encrypt256Key)(userGroupKey, recoveryCode);
        var recoverCodeEncUserGroupKey = (0, tutanota_crypto_1.aes256EncryptKey)(recoveryCode, userGroupKey);
        var recoveryCodeVerifier = (0, tutanota_crypto_1.createAuthVerifier)(recoveryCode);
        return {
            userEncRecoverCode: userEncRecoverCode,
            recoverCodeEncUserGroupKey: recoverCodeEncUserGroupKey,
            hexCode: (0, tutanota_utils_1.uint8ArrayToHex)((0, tutanota_crypto_1.bitArrayToUint8Array)(recoveryCode)),
            recoveryCodeVerifier: recoveryCodeVerifier
        };
    };
    UserManagementFacade.prototype.getRecoverCode = function (password) {
        var _this = this;
        var _a;
        var user = this.userFacade.getLoggedInUser();
        var recoverCodeId = (_a = user.auth) === null || _a === void 0 ? void 0 : _a.recoverCode;
        if (recoverCodeId == null) {
            return Promise.reject(new Error("Auth is missing"));
        }
        var key = (0, tutanota_crypto_1.generateKeyFromPassphrase)(password, (0, tutanota_utils_1.assertNotNull)(user.salt), tutanota_crypto_1.KeyLength.b128);
        var extraHeaders = {
            authVerifier: (0, tutanota_crypto_1.createAuthVerifierAsBase64Url)(key)
        };
        return this.entityClient.load(TypeRefs_js_1.RecoverCodeTypeRef, recoverCodeId, undefined, extraHeaders).then(function (result) {
            return (0, tutanota_utils_1.uint8ArrayToHex)((0, tutanota_crypto_1.bitArrayToUint8Array)((0, tutanota_crypto_1.decrypt256Key)(_this.userFacade.getUserGroupKey(), result.userEncRecoverCode)));
        });
    };
    UserManagementFacade.prototype.createRecoveryCode = function (password) {
        var user = this.userFacade.getUser();
        if (user == null || user.auth == null) {
            throw new Error("Invalid state: no user or no user.auth");
        }
        var _a = this.generateRecoveryCode(this.userFacade.getUserGroupKey()), userEncRecoverCode = _a.userEncRecoverCode, recoverCodeEncUserGroupKey = _a.recoverCodeEncUserGroupKey, hexCode = _a.hexCode, recoveryCodeVerifier = _a.recoveryCodeVerifier;
        var recoverPasswordEntity = (0, TypeRefs_js_1.createRecoverCode)();
        recoverPasswordEntity.userEncRecoverCode = userEncRecoverCode;
        recoverPasswordEntity.recoverCodeEncUserGroupKey = recoverCodeEncUserGroupKey;
        recoverPasswordEntity._ownerGroup = this.userFacade.getUserGroupId();
        recoverPasswordEntity.verifier = recoveryCodeVerifier;
        var pwKey = (0, tutanota_crypto_1.generateKeyFromPassphrase)(password, (0, tutanota_utils_1.neverNull)(user.salt), tutanota_crypto_1.KeyLength.b128);
        var authVerifier = (0, tutanota_crypto_1.createAuthVerifierAsBase64Url)(pwKey);
        return this.entityClient
            .setup(null, recoverPasswordEntity, {
            authVerifier: authVerifier
        })
            .then(function () { return hexCode; });
    };
    return UserManagementFacade;
}());
exports.UserManagementFacade = UserManagementFacade;
