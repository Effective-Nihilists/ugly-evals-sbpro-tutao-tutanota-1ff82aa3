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
exports.CryptoFacade = exports.encryptString = exports.encryptBytes = void 0;
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var TutanotaConstants_1 = require("../../common/TutanotaConstants");
var EntityFunctions_1 = require("../../common/EntityFunctions");
var TypeRefs_js_1 = require("../../entities/sys/TypeRefs.js");
var TypeRefs_js_2 = require("../../entities/tutanota/TypeRefs.js");
var EntityRestClient_1 = require("../rest/EntityRestClient");
var RestError_1 = require("../../common/error/RestError");
var SessionKeyNotFoundError_1 = require("../../common/error/SessionKeyNotFoundError"); // importing with {} from CJS modules is not supported for dist-builds currently (must be a systemjs builder bug)
var CryptoError_1 = require("../../common/error/CryptoError");
var BirthdayUtils_1 = require("../../common/utils/BirthdayUtils");
var Env_1 = require("../../common/Env");
var tutanota_crypto_1 = require("@tutao/tutanota-crypto");
var RecipientNotResolvedError_1 = require("../../common/error/RecipientNotResolvedError");
var Services_1 = require("../../entities/tutanota/Services");
var Services_2 = require("../../entities/sys/Services");
(0, Env_1.assertWorkerOrNode)();
function encryptBytes(sk, value) {
    return (0, tutanota_crypto_1.aes128Encrypt)(sk, value, tutanota_crypto_1.random.generateRandomData(tutanota_crypto_1.IV_BYTE_LENGTH), true, tutanota_crypto_1.ENABLE_MAC);
}
exports.encryptBytes = encryptBytes;
function encryptString(sk, value) {
    return (0, tutanota_crypto_1.aes128Encrypt)(sk, (0, tutanota_utils_1.stringToUtf8Uint8Array)(value), tutanota_crypto_1.random.generateRandomData(tutanota_crypto_1.IV_BYTE_LENGTH), true, tutanota_crypto_1.ENABLE_MAC);
}
exports.encryptString = encryptString;
var CryptoFacade = /** @class */ (function () {
    function CryptoFacade(userFacade, entityClient, restClient, rsa, serviceExecutor) {
        this.userFacade = userFacade;
        this.entityClient = entityClient;
        this.restClient = restClient;
        this.rsa = rsa;
        this.serviceExecutor = serviceExecutor;
        // stores a mapping from mail body id to mail body session key. the mail body of a mail is encrypted with the same session key as the mail.
        // so when resolving the session key of a mail we cache it for the mail's body to avoid that the body's permission (+ bucket permission) have to be loaded.
        // this especially improves the performance when indexing mail bodies
        this.mailBodySessionKeyCache = {};
    }
    CryptoFacade.prototype.applyMigrations = function (typeRef, data) {
        return __awaiter(this, void 0, void 0, function () {
            var customerGroupMembership_1, customerGroupKey_1, migrationData, groupEncSessionKey, result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!((0, tutanota_utils_1.isSameTypeRef)(typeRef, TypeRefs_js_1.GroupInfoTypeRef) && data._ownerGroup == null)) return [3 /*break*/, 1];
                        customerGroupMembership_1 = this.userFacade.getLoggedInUser().memberships.find(function (g) { return g.groupType === TutanotaConstants_1.GroupType.Customer; });
                        customerGroupKey_1 = this.userFacade.getGroupKey(customerGroupMembership_1.group);
                        return [2 /*return*/, this.entityClient.loadAll(TypeRefs_js_1.PermissionTypeRef, data._id[0]).then(function (listPermissions) {
                                var customerGroupPermission = listPermissions.find(function (p) { return p.group === customerGroupMembership_1.group; });
                                if (!customerGroupPermission)
                                    throw new SessionKeyNotFoundError_1.SessionKeyNotFoundError("Permission not found, could not apply OwnerGroup migration");
                                var listKey = (0, tutanota_crypto_1.decryptKey)(customerGroupKey_1, customerGroupPermission.symEncSessionKey);
                                var groupInfoSk = (0, tutanota_crypto_1.decryptKey)(listKey, (0, tutanota_utils_1.base64ToUint8Array)(data._listEncSessionKey));
                                data._ownerGroup = customerGroupMembership_1.getGroup();
                                data._ownerEncSessionKey = (0, tutanota_utils_1.uint8ArrayToBase64)((0, tutanota_crypto_1.encryptKey)(customerGroupKey_1, groupInfoSk));
                                return data;
                            })];
                    case 1:
                        if (!((0, tutanota_utils_1.isSameTypeRef)(typeRef, TypeRefs_js_2.TutanotaPropertiesTypeRef) && data._ownerEncSessionKey == null)) return [3 /*break*/, 3];
                        migrationData = (0, TypeRefs_js_2.createEncryptTutanotaPropertiesData)();
                        data._ownerGroup = this.userFacade.getUserGroupId();
                        groupEncSessionKey = (0, tutanota_crypto_1.encryptKey)(this.userFacade.getUserGroupKey(), (0, tutanota_crypto_1.aes128RandomKey)());
                        data._ownerEncSessionKey = (0, tutanota_utils_1.uint8ArrayToBase64)(groupEncSessionKey);
                        migrationData.properties = data._id;
                        migrationData.symEncSessionKey = groupEncSessionKey;
                        return [4 /*yield*/, this.serviceExecutor.post(Services_1.EncryptTutanotaPropertiesService, migrationData)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, data];
                    case 3:
                        if ((0, tutanota_utils_1.isSameTypeRef)(typeRef, TypeRefs_js_1.PushIdentifierTypeRef) && data._ownerEncSessionKey == null) {
                            // set sessionKey for allowing encryption when old instance (< v43) is updated
                            return [2 /*return*/, (0, EntityFunctions_1.resolveTypeReference)(typeRef)
                                    .then(function (typeModel) { return _this.updateOwnerEncSessionKey(typeModel, data, _this.userFacade.getUserGroupKey(), (0, tutanota_crypto_1.aes128RandomKey)()); })
                                    .then(function () { return data; })];
                        }
                        _a.label = 4;
                    case 4: return [2 /*return*/, data];
                }
            });
        });
    };
    CryptoFacade.prototype.applyMigrationsForInstance = function (decryptedInstance) {
        var instanceType = (0, tutanota_utils_1.downcast)(decryptedInstance)._type;
        if ((0, tutanota_utils_1.isSameTypeRef)(instanceType, TypeRefs_js_2.ContactTypeRef)) {
            var contact = (0, tutanota_utils_1.downcast)(decryptedInstance);
            if (!contact.birthdayIso && contact.oldBirthdayAggregate) {
                contact.birthdayIso = (0, BirthdayUtils_1.birthdayToIsoDate)(contact.oldBirthdayAggregate);
                contact.oldBirthdayAggregate = null;
                contact.oldBirthdayDate = null;
                return this.entityClient
                    .update(contact)["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.LockedError, tutanota_utils_1.noOp))
                    .then(function () { return decryptedInstance; });
            }
            else if (!contact.birthdayIso && contact.oldBirthdayDate) {
                contact.birthdayIso = (0, BirthdayUtils_1.birthdayToIsoDate)((0, BirthdayUtils_1.oldBirthdayToBirthday)(contact.oldBirthdayDate));
                contact.oldBirthdayDate = null;
                return this.entityClient
                    .update(contact)["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.LockedError, tutanota_utils_1.noOp))
                    .then(function () { return decryptedInstance; });
            }
            else if (contact.birthdayIso && (contact.oldBirthdayAggregate || contact.oldBirthdayDate)) {
                contact.oldBirthdayAggregate = null;
                contact.oldBirthdayDate = null;
                return this.entityClient
                    .update(contact)["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.LockedError, tutanota_utils_1.noOp))
                    .then(function () { return decryptedInstance; });
            }
        }
        return Promise.resolve(decryptedInstance);
    };
    CryptoFacade.prototype.resolveSessionKeyForInstance = function (instance) {
        return __awaiter(this, void 0, void 0, function () {
            var typeModel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, EntityFunctions_1.resolveTypeReference)(instance._type)];
                    case 1:
                        typeModel = _a.sent();
                        return [2 /*return*/, this.resolveSessionKey(typeModel, instance)];
                }
            });
        });
    };
    /** Helper for the rare cases when we needed it on the client side. */
    CryptoFacade.prototype.resolveSessionKeyForInstanceBinary = function (instance) {
        return __awaiter(this, void 0, void 0, function () {
            var key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.resolveSessionKeyForInstance(instance)];
                    case 1:
                        key = _a.sent();
                        return [2 /*return*/, key == null ? null : (0, tutanota_crypto_1.bitArrayToUint8Array)(key)];
                }
            });
        });
    };
    /**
     * Returns the session key for the provided type/instance:
     * * null, if the instance is unencrypted
     * * the decrypted _ownerEncSessionKey, if it is available
     * * the public decrypted session key, otherwise
     *
     * @param typeModel: the type model of the instance
     * @param instance The unencrypted (client-side) or encrypted (server-side) instance
     */
    CryptoFacade.prototype.resolveSessionKey = function (typeModel, instance) {
        var _this = this;
        return Promise
            .resolve()
            .then(function () { return __awaiter(_this, void 0, void 0, function () {
            var sessionKey, gk, key, gk, key, permissions, _a;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!!typeModel.encrypted) return [3 /*break*/, 1];
                        return [2 /*return*/, null];
                    case 1:
                        if (!((0, tutanota_utils_1.isSameTypeRefByAttr)(TypeRefs_js_2.MailBodyTypeRef, typeModel.app, typeModel.name) && this.mailBodySessionKeyCache[instance._id])) return [3 /*break*/, 2];
                        sessionKey = this.mailBodySessionKeyCache[instance._id];
                        // the mail body instance is cached, so the session key is not needed any more
                        delete this.mailBodySessionKeyCache[instance._id];
                        return [2 /*return*/, sessionKey];
                    case 2:
                        if (!(instance._ownerEncSessionKey && this.userFacade.isFullyLoggedIn() && this.userFacade.hasGroup(instance._ownerGroup))) return [3 /*break*/, 3];
                        gk = this.userFacade.getGroupKey(instance._ownerGroup);
                        key = instance._ownerEncSessionKey;
                        if (typeof key === "string") {
                            key = (0, tutanota_utils_1.base64ToUint8Array)(instance._ownerEncSessionKey);
                        }
                        return [2 /*return*/, (0, tutanota_crypto_1.decryptKey)(gk, key)];
                    case 3:
                        if (!instance.ownerEncSessionKey) return [3 /*break*/, 4];
                        gk = this.userFacade.getGroupKey(this.userFacade.getGroupId(TutanotaConstants_1.GroupType.Mail));
                        key = (typeof instance.ownerEncSessionKey === "string")
                            ? (0, tutanota_utils_1.base64ToUint8Array)(instance.ownerEncSessionKey)
                            : instance.ownerEncSessionKey;
                        return [2 /*return*/, (0, tutanota_crypto_1.decryptKey)(gk, key)];
                    case 4: return [4 /*yield*/, this.entityClient.loadAll(TypeRefs_js_1.PermissionTypeRef, instance._permissions)];
                    case 5:
                        permissions = _c.sent();
                        if (!((_b = this.trySymmetricPermission(permissions)) !== null && _b !== void 0)) return [3 /*break*/, 6];
                        _a = _b;
                        return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, this.resolveWithPublicOrExternalPermission(permissions, instance, typeModel)];
                    case 7:
                        _a = (_c.sent());
                        _c.label = 8;
                    case 8: return [2 /*return*/, _a];
                }
            });
        }); })
            .then(function (sessionKey) {
            // store the mail session key for the mail body because it is the same
            if (sessionKey && (0, tutanota_utils_1.isSameTypeRefByAttr)(TypeRefs_js_2.MailTypeRef, typeModel.app, typeModel.name)) {
                _this.mailBodySessionKeyCache[instance.body] = sessionKey;
            }
            return sessionKey;
        })["catch"]((0, tutanota_utils_1.ofClass)(CryptoError_1.CryptoError, function (e) {
            console.log("failed to resolve session key", e);
            throw new SessionKeyNotFoundError_1.SessionKeyNotFoundError("Crypto error while resolving session key for instance " + instance._id);
        }));
    };
    CryptoFacade.prototype.trySymmetricPermission = function (listPermissions) {
        var _this = this;
        var _a;
        var symmetricPermission = (_a = listPermissions.find(function (p) {
            return (p.type === "2" /* PermissionType.Public_Symmetric */ || p.type === "1" /* PermissionType.Symmetric */) &&
                p._ownerGroup &&
                _this.userFacade.hasGroup(p._ownerGroup);
        })) !== null && _a !== void 0 ? _a : null;
        if (symmetricPermission) {
            var gk = this.userFacade.getGroupKey((0, tutanota_utils_1.assertNotNull)(symmetricPermission._ownerGroup));
            return (0, tutanota_crypto_1.decryptKey)(gk, (0, tutanota_utils_1.assertNotNull)(symmetricPermission._ownerEncSessionKey));
        }
    };
    CryptoFacade.prototype.resolveWithPublicOrExternalPermission = function (listPermissions, instance, typeModel) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var pubOrExtPermission, typeName, bucketPermissions, bucketPermission;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        pubOrExtPermission = (_a = listPermissions.find(function (p) { return p.type === "0" /* PermissionType.Public */ || p.type === "5" /* PermissionType.External */; })) !== null && _a !== void 0 ? _a : null;
                        if (pubOrExtPermission == null) {
                            typeName = "".concat(typeModel.app, "/").concat(typeModel.name);
                            throw new SessionKeyNotFoundError_1.SessionKeyNotFoundError("could not find permission for instance of type ".concat(typeName));
                        }
                        return [4 /*yield*/, this.entityClient
                                .loadAll(TypeRefs_js_1.BucketPermissionTypeRef, (0, tutanota_utils_1.assertNotNull)(pubOrExtPermission.bucket).bucketPermissions)];
                    case 1:
                        bucketPermissions = _b.sent();
                        bucketPermission = bucketPermissions.find(function (bp) {
                            return (bp.type === "2" /* BucketPermissionType.Public */ || bp.type === "3" /* BucketPermissionType.External */) &&
                                pubOrExtPermission._ownerGroup === bp._ownerGroup;
                        });
                        // find the bucket permission with the same group as the permission and public type
                        if (bucketPermission == null) {
                            throw new SessionKeyNotFoundError_1.SessionKeyNotFoundError("no corresponding bucket permission found");
                        }
                        if (!(bucketPermission.type === "3" /* BucketPermissionType.External */)) return [3 /*break*/, 2];
                        return [2 /*return*/, this.decryptWithExternalBucket(bucketPermission, pubOrExtPermission, instance)];
                    case 2: return [4 /*yield*/, this.decryptWithPublicBucket(bucketPermission, instance, pubOrExtPermission, typeModel)];
                    case 3: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    CryptoFacade.prototype.decryptWithExternalBucket = function (bucketPermission, pubOrExtPermission, instance) {
        var bucketKey;
        if (bucketPermission.ownerEncBucketKey != null) {
            bucketKey = (0, tutanota_crypto_1.decryptKey)(this.userFacade.getGroupKey((0, tutanota_utils_1.neverNull)(bucketPermission._ownerGroup)), bucketPermission.ownerEncBucketKey);
        }
        else if (bucketPermission.symEncBucketKey) {
            bucketKey = (0, tutanota_crypto_1.decryptKey)(this.userFacade.getUserGroupKey(), bucketPermission.symEncBucketKey);
        }
        else {
            throw new SessionKeyNotFoundError_1.SessionKeyNotFoundError("BucketEncSessionKey is not defined for Permission ".concat(pubOrExtPermission._id.toString(), " (Instance: ").concat(JSON.stringify(instance), ")"));
        }
        return (0, tutanota_crypto_1.decryptKey)(bucketKey, (0, tutanota_utils_1.neverNull)(pubOrExtPermission.bucketEncSessionKey));
    };
    CryptoFacade.prototype.decryptWithPublicBucket = function (bucketPermission, instance, pubOrExtPermission, typeModel) {
        return __awaiter(this, void 0, void 0, function () {
            var group, keypair, privKey, pubEncBucketKey, decryptedBytes, bucketKey, bucketEncSessionKey, sk, bucketPermissionOwnerGroupKey, bucketPermissionGroupKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.entityClient.load(TypeRefs_js_1.GroupTypeRef, bucketPermission.group)];
                    case 1:
                        group = _a.sent();
                        keypair = group.keys[0];
                        try {
                            privKey = (0, tutanota_crypto_1.decryptRsaKey)(this.userFacade.getGroupKey(group._id), keypair.symEncPrivKey);
                        }
                        catch (e) {
                            console.log("failed to decrypt rsa key for group with id " + group._id);
                            throw e;
                        }
                        pubEncBucketKey = bucketPermission.pubEncBucketKey;
                        if (pubEncBucketKey == null) {
                            throw new SessionKeyNotFoundError_1.SessionKeyNotFoundError("PubEncBucketKey is not defined for BucketPermission ".concat(bucketPermission._id.toString(), " (Instance: ").concat(JSON.stringify(instance), ")"));
                        }
                        return [4 /*yield*/, this.rsa.decrypt(privKey, pubEncBucketKey)];
                    case 2:
                        decryptedBytes = _a.sent();
                        bucketKey = (0, tutanota_crypto_1.uint8ArrayToBitArray)(decryptedBytes);
                        bucketEncSessionKey = pubOrExtPermission.bucketEncSessionKey;
                        if (bucketEncSessionKey == null) {
                            throw new SessionKeyNotFoundError_1.SessionKeyNotFoundError("BucketEncSessionKey is not defined for Permission ".concat(pubOrExtPermission._id.toString(), " (Instance: ").concat(JSON.stringify(instance), ")"));
                        }
                        sk = (0, tutanota_crypto_1.decryptKey)(bucketKey, bucketEncSessionKey);
                        if (!bucketPermission._ownerGroup) return [3 /*break*/, 4];
                        bucketPermissionOwnerGroupKey = this.userFacade.getGroupKey((0, tutanota_utils_1.neverNull)(bucketPermission._ownerGroup));
                        bucketPermissionGroupKey = this.userFacade.getGroupKey(bucketPermission.group);
                        return [4 /*yield*/, this.updateWithSymPermissionKey(typeModel, instance, pubOrExtPermission, bucketPermission, bucketPermissionOwnerGroupKey, bucketPermissionGroupKey, sk)["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotFoundError, function () {
                                console.log("w> could not find instance to update permission");
                            }))];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, sk];
                }
            });
        });
    };
    /**
     * Returns the session key for the provided service response:
     * * null, if the instance is unencrypted
     * * the decrypted _ownerPublicEncSessionKey, if it is available
     * @param typeModel
     * @param instance The unencrypted (client-side) or encrypted (server-side) instance
     *
     */
    CryptoFacade.prototype.resolveServiceSessionKey = function (typeModel, instance) {
        var _this = this;
        if (instance._ownerPublicEncSessionKey) {
            return this.entityClient.load(TypeRefs_js_1.GroupTypeRef, instance._ownerGroup).then(function (group) {
                var keypair = group.keys[0];
                var gk = _this.userFacade.getGroupKey(instance._ownerGroup);
                var privKey;
                try {
                    privKey = (0, tutanota_crypto_1.decryptRsaKey)(gk, keypair.symEncPrivKey);
                }
                catch (e) {
                    console.log("failed to decrypt rsa key for group with id " + group._id);
                    throw e;
                }
                return _this.rsa
                    .decrypt(privKey, (0, tutanota_utils_1.base64ToUint8Array)(instance._ownerPublicEncSessionKey))
                    .then(function (decryptedBytes) { return (0, tutanota_crypto_1.uint8ArrayToBitArray)(decryptedBytes); });
            });
        }
        return Promise.resolve(null);
    };
    /**
     * Creates a new _ownerEncSessionKey and assigns it to the provided entity
     * the entity must already have an _ownerGroup
     * @returns the generated key
     */
    CryptoFacade.prototype.setNewOwnerEncSessionKey = function (model, entity) {
        if (!entity._ownerGroup) {
            throw new Error("no owner group set  ".concat(JSON.stringify(entity)));
        }
        if (model.encrypted) {
            if (entity._ownerEncSessionKey) {
                throw new Error("ownerEncSessionKey already set ".concat(JSON.stringify(entity)));
            }
            var sessionKey = (0, tutanota_crypto_1.aes128RandomKey)();
            entity._ownerEncSessionKey = (0, tutanota_crypto_1.encryptKey)(this.userFacade.getGroupKey(entity._ownerGroup), sessionKey);
            return sessionKey;
        }
        else {
            return null;
        }
    };
    CryptoFacade.prototype.encryptBucketKeyForInternalRecipient = function (bucketKey, recipientMailAddress, notFoundRecipients) {
        var _this = this;
        var keyData = (0, TypeRefs_js_1.createPublicKeyData)();
        keyData.mailAddress = recipientMailAddress;
        return this.serviceExecutor.get(Services_2.PublicKeyService, keyData)
            .then(function (publicKeyData) {
            var publicKey = (0, tutanota_crypto_1.hexToPublicKey)((0, tutanota_utils_1.uint8ArrayToHex)(publicKeyData.pubKey));
            var uint8ArrayBucketKey = (0, tutanota_crypto_1.bitArrayToUint8Array)(bucketKey);
            if (notFoundRecipients.length === 0) {
                return _this.rsa.encrypt(publicKey, uint8ArrayBucketKey).then(function (encrypted) {
                    var data = (0, TypeRefs_js_2.createInternalRecipientKeyData)();
                    data.mailAddress = recipientMailAddress;
                    data.pubEncBucketKey = encrypted;
                    data.pubKeyVersion = publicKeyData.pubKeyVersion;
                    return data;
                });
            }
        })["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotFoundError, function (e) {
            notFoundRecipients.push(recipientMailAddress);
        }))["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.TooManyRequestsError, function (e) {
            throw new RecipientNotResolvedError_1.RecipientNotResolvedError("");
        }));
    };
    /**
     * Updates the given public permission with the given symmetric key for faster access if the client is the leader and otherwise does nothing.
     * @param typeModel: the type model of the instance
     * @param instance The unencrypted (client-side) or encrypted (server-side) instance
     * @param permission The permission.
     * @param bucketPermission The bucket permission.
     * @param permissionOwnerGroupKey The symmetric group key for the owner group on the permission.
     * @param permissionGroupKey The symmetric group key of the group in the permission.
     * @param sessionKey The symmetric session key.
     */
    CryptoFacade.prototype.updateWithSymPermissionKey = function (typeModel, instance, permission, bucketPermission, permissionOwnerGroupKey, permissionGroupKey, sessionKey) {
        if (typeof instance._type !== "undefined" || !this.userFacade.isLeader()) {
            // do not update the session key in case of an unencrypted (client-side) instance
            // or in case we are not the leader client
            return Promise.resolve();
        }
        if (!instance._ownerEncSessionKey && permission._ownerGroup === instance._ownerGroup) {
            return this.updateOwnerEncSessionKey(typeModel, instance, permissionOwnerGroupKey, sessionKey);
        }
        else {
            // instances shared via permissions (e.g. body)
            var updateService = (0, TypeRefs_js_1.createUpdatePermissionKeyData)();
            updateService.permission = permission._id;
            updateService.bucketPermission = bucketPermission._id;
            updateService.ownerEncSessionKey = (0, tutanota_crypto_1.encryptKey)(permissionOwnerGroupKey, sessionKey);
            updateService.symEncSessionKey = (0, tutanota_crypto_1.encryptKey)(permissionGroupKey, sessionKey); // legacy can be removed
            return this.serviceExecutor.post(Services_2.UpdatePermissionKeyService, updateService).then(tutanota_utils_1.noOp);
        }
    };
    CryptoFacade.prototype.updateOwnerEncSessionKey = function (typeModel, instance, ownerGroupKey, sessionKey) {
        instance._ownerEncSessionKey = (0, tutanota_utils_1.uint8ArrayToBase64)((0, tutanota_crypto_1.encryptKey)(ownerGroupKey, sessionKey));
        // we have to call the rest client directly because instance is still the encrypted server-side version
        var path = (0, EntityRestClient_1.typeRefToPath)(new tutanota_utils_1.TypeRef(typeModel.app, typeModel.name)) + "/" + (instance._id instanceof Array ? instance._id.join("/") : instance._id);
        var headers = this.userFacade.createAuthHeaders();
        headers.v = typeModel.version;
        return this.restClient
            .request(path, "PUT" /* HttpMethod.PUT */, {
            headers: headers,
            body: JSON.stringify(instance),
            queryParams: { updateOwnerEncSessionKey: "true" }
        })["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.PayloadTooLargeError, function (e) {
            console.log("Could not update owner enc session key - PayloadTooLargeError", e);
        }));
    };
    return CryptoFacade;
}());
exports.CryptoFacade = CryptoFacade;
if (!("toJSON" in Error.prototype)) {
    Object.defineProperty(Error.prototype, "toJSON", {
        value: function () {
            var alt = {};
            for (var _i = 0, _a = Object.getOwnPropertyNames(this); _i < _a.length; _i++) {
                var key = _a[_i];
                alt[key] = this[key];
            }
            return alt;
        },
        configurable: true,
        writable: true
    });
}
