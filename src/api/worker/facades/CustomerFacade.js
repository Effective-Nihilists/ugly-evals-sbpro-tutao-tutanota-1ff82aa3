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
exports.CustomerFacade = void 0;
var TutanotaConstants_1 = require("../../common/TutanotaConstants");
var TypeRefs_js_1 = require("../../entities/sys/TypeRefs.js");
var Env_1 = require("../../common/Env");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Utils_1 = require("../../common/utils/Utils");
var Services_js_1 = require("../../entities/sys/Services.js");
var TypeRefs_js_2 = require("../../entities/tutanota/TypeRefs.js");
var RestError_1 = require("../../common/error/RestError");
var tutanota_crypto_1 = require("@tutao/tutanota-crypto");
var Services_1 = require("../../entities/tutanota/Services");
(0, Env_1.assertWorkerOrNode)();
var CustomerFacade = /** @class */ (function () {
    function CustomerFacade(worker, userFacade, groupManagement, userManagement, counters, rsa, entityClient, serviceExecutor, bookingFacade, cryptoFacade) {
        this.worker = worker;
        this.userFacade = userFacade;
        this.groupManagement = groupManagement;
        this.userManagement = userManagement;
        this.counters = counters;
        this.rsa = rsa;
        this.entityClient = entityClient;
        this.serviceExecutor = serviceExecutor;
        this.bookingFacade = bookingFacade;
        this.cryptoFacade = cryptoFacade;
        this.contactFormUserGroupData = null;
    }
    CustomerFacade.prototype.getDomainValidationRecord = function (domainName) {
        return __awaiter(this, void 0, void 0, function () {
            var customer, baseString, hash;
            return __generator(this, function (_a) {
                customer = this.getCustomerId();
                baseString = domainName.trim().toLowerCase() + customer;
                hash = (0, tutanota_crypto_1.sha256Hash)((0, tutanota_utils_1.stringToUtf8Uint8Array)(baseString)).slice(0, 16);
                return [2 /*return*/, "t-verify=" + (0, tutanota_utils_1.uint8ArrayToHex)(hash)];
            });
        });
    };
    CustomerFacade.prototype.addDomain = function (domainName) {
        var data = (0, TypeRefs_js_1.createCustomDomainData)({
            domain: domainName.trim().toLowerCase()
        });
        return this.serviceExecutor.post(Services_js_1.CustomDomainService, data);
    };
    CustomerFacade.prototype.removeDomain = function (domainName) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = (0, TypeRefs_js_1.createCustomDomainData)({
                            domain: domainName.trim().toLowerCase()
                        });
                        return [4 /*yield*/, this.serviceExecutor["delete"](Services_js_1.CustomDomainService, data)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CustomerFacade.prototype.setCatchAllGroup = function (domainName, mailGroupId) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = (0, TypeRefs_js_1.createCustomDomainData)({
                            domain: domainName.trim().toLowerCase(),
                            catchAllMailGroup: mailGroupId
                        });
                        return [4 /*yield*/, this.serviceExecutor.put(Services_js_1.CustomDomainService, data)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CustomerFacade.prototype.orderWhitelabelCertificate = function (domainName) {
        return __awaiter(this, void 0, void 0, function () {
            var customerId, customer, customerInfo, existingBrandingDomain, keyData, systemAdminPubKey, sessionKey, systemAdminPubEncAccountingInfoSessionKey, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customerId = this.getCustomerId();
                        return [4 /*yield*/, this.entityClient.load(TypeRefs_js_1.CustomerTypeRef, customerId)];
                    case 1:
                        customer = _a.sent();
                        return [4 /*yield*/, this.entityClient.load(TypeRefs_js_1.CustomerInfoTypeRef, customer.customerInfo)];
                    case 2:
                        customerInfo = _a.sent();
                        existingBrandingDomain = (0, Utils_1.getWhitelabelDomain)(customerInfo, domainName);
                        return [4 /*yield*/, this.serviceExecutor.get(Services_js_1.SystemKeysService, null)];
                    case 3:
                        keyData = _a.sent();
                        systemAdminPubKey = (0, tutanota_crypto_1.hexToPublicKey)((0, tutanota_utils_1.uint8ArrayToHex)(keyData.systemAdminPubKey));
                        sessionKey = (0, tutanota_crypto_1.aes128RandomKey)();
                        return [4 /*yield*/, this.rsa.encrypt(systemAdminPubKey, (0, tutanota_crypto_1.bitArrayToUint8Array)(sessionKey))];
                    case 4:
                        systemAdminPubEncAccountingInfoSessionKey = _a.sent();
                        data = (0, TypeRefs_js_1.createBrandingDomainData)({
                            domain: domainName,
                            systemAdminPubEncSessionKey: systemAdminPubEncAccountingInfoSessionKey
                        });
                        if (!existingBrandingDomain) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.serviceExecutor.put(Services_js_1.BrandingDomainService, data)];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, this.serviceExecutor.post(Services_js_1.BrandingDomainService, data)];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    CustomerFacade.prototype.getCustomerId = function () {
        return (0, tutanota_utils_1.assertNotNull)(this.userFacade.getLoggedInUser().customer);
    };
    CustomerFacade.prototype.deleteCertificate = function (domainName) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = (0, TypeRefs_js_1.createBrandingDomainDeleteData)({
                            domain: domainName
                        });
                        return [4 /*yield*/, this.serviceExecutor["delete"](Services_js_1.BrandingDomainService, data)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Reads the used storage of a customer in bytes.
     * @return The amount of used storage in byte.
     */
    CustomerFacade.prototype.readUsedCustomerStorage = function (customerId) {
        var _this = this;
        return this.counters.readCounterValue(TutanotaConstants_1.Const.COUNTER_USED_MEMORY_INTERNAL, customerId).then(function (usedMemoryInternal) {
            return _this.counters.readCounterValue(TutanotaConstants_1.Const.COUNTER_USED_MEMORY_EXTERNAL, customerId).then(function (usedMemoryExternal) {
                return Number(usedMemoryInternal) + Number(usedMemoryExternal);
            });
        });
    };
    /**
     * Reads the available storage capacity of a customer in bytes.
     * @return The amount of available storage capacity in byte.
     */
    CustomerFacade.prototype.readAvailableCustomerStorage = function (customerId) {
        var _this = this;
        return this.entityClient.load(TypeRefs_js_1.CustomerTypeRef, customerId).then(function (customer) {
            return _this.entityClient.load(TypeRefs_js_1.CustomerInfoTypeRef, customer.customerInfo).then(function (customerInfo) {
                var includedStorage = Number(customerInfo.includedStorageCapacity);
                var promotionStorage = Number(customerInfo.promotionStorageCapacity);
                var availableStorage = Math.max(includedStorage, promotionStorage);
                var bookedStorage = 0;
                if (customer.type === TutanotaConstants_1.AccountType.PREMIUM) {
                    return _this.bookingFacade.getCurrentPrice().then(function (price) {
                        var currentStorageItem = _this.bookingFacade.getPriceItem(price.currentPriceNextPeriod, TutanotaConstants_1.BookingItemFeatureType.Storage);
                        if (currentStorageItem != null) {
                            bookedStorage = Number(currentStorageItem.count);
                        }
                        availableStorage = Math.max(bookedStorage, availableStorage);
                        return availableStorage * TutanotaConstants_1.Const.MEMORY_GB_FACTOR;
                    });
                }
                else {
                    return availableStorage * TutanotaConstants_1.Const.MEMORY_GB_FACTOR;
                }
            });
        });
    };
    CustomerFacade.prototype.loadCustomerServerProperties = function () {
        return __awaiter(this, void 0, void 0, function () {
            var customer, cspId, sessionKey, adminGroupKey, groupEncSessionKey, data, returnData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.entityClient.load(TypeRefs_js_1.CustomerTypeRef, this.getCustomerId())];
                    case 1:
                        customer = _a.sent();
                        if (!customer.serverProperties) return [3 /*break*/, 2];
                        cspId = customer.serverProperties;
                        return [3 /*break*/, 4];
                    case 2:
                        sessionKey = (0, tutanota_crypto_1.aes128RandomKey)();
                        adminGroupKey = this.userFacade.getGroupKey(this.userFacade.getGroupId(TutanotaConstants_1.GroupType.Admin));
                        groupEncSessionKey = (0, tutanota_crypto_1.encryptKey)(adminGroupKey, sessionKey);
                        data = (0, TypeRefs_js_1.createCreateCustomerServerPropertiesData)({
                            adminGroupEncSessionKey: groupEncSessionKey
                        });
                        return [4 /*yield*/, this.serviceExecutor.post(Services_js_1.CreateCustomerServerProperties, data)];
                    case 3:
                        returnData = _a.sent();
                        cspId = returnData.id;
                        _a.label = 4;
                    case 4: return [2 /*return*/, this.entityClient.load(TypeRefs_js_1.CustomerServerPropertiesTypeRef, cspId)];
                }
            });
        });
    };
    CustomerFacade.prototype.addSpamRule = function (field, type, value) {
        var _this = this;
        return this.loadCustomerServerProperties().then(function (props) {
            value = value.toLowerCase().trim();
            var newListEntry = (0, TypeRefs_js_1.createEmailSenderListElement)({
                value: value,
                hashedValue: (0, tutanota_utils_1.uint8ArrayToBase64)((0, tutanota_crypto_1.sha256Hash)((0, tutanota_utils_1.stringToUtf8Uint8Array)(value))),
                type: type,
                field: field
            });
            props.emailSenderList.push(newListEntry);
            return _this.entityClient.update(props)["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.LockedError, tutanota_utils_1.noOp));
        });
    };
    CustomerFacade.prototype.editSpamRule = function (spamRule) {
        var _this = this;
        return this.loadCustomerServerProperties().then(function (props) {
            spamRule.value = spamRule.value.toLowerCase().trim();
            var index = props.emailSenderList.findIndex(function (item) { return spamRule._id === item._id; });
            if (index === -1) {
                throw new Error("spam rule does not exist " + JSON.stringify(spamRule));
            }
            props.emailSenderList[index] = spamRule;
            return _this.entityClient.update(props)["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.LockedError, tutanota_utils_1.noOp));
        });
    };
    CustomerFacade.prototype.generateSignupKeys = function () {
        return __awaiter(this, void 0, void 0, function () {
            var key1, key2, key3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rsa.generateKey()];
                    case 1:
                        key1 = _a.sent();
                        return [4 /*yield*/, this.worker.sendProgress(33)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.rsa.generateKey()];
                    case 3:
                        key2 = _a.sent();
                        return [4 /*yield*/, this.worker.sendProgress(66)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.rsa.generateKey()];
                    case 5:
                        key3 = _a.sent();
                        return [4 /*yield*/, this.worker.sendProgress(100)];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, [key1, key2, key3]];
                }
            });
        });
    };
    CustomerFacade.prototype.signup = function (keyPairs, accountType, authToken, mailAddress, password, registrationCode, currentLanguage) {
        return __awaiter(this, void 0, void 0, function () {
            var keyData, systemAdminPubKey, userGroupKey, adminGroupKey, customerGroupKey, userGroupInfoSessionKey, adminGroupInfoSessionKey, customerGroupInfoSessionKey, accountingInfoSessionKey, customerServerPropertiesSessionKey, systemAdminPubEncAccountingInfoSessionKey, userGroupData, adminGroupData, customerGroupData, recoverData, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.serviceExecutor.get(Services_js_1.SystemKeysService, null)];
                    case 1:
                        keyData = _a.sent();
                        systemAdminPubKey = (0, tutanota_crypto_1.hexToPublicKey)((0, tutanota_utils_1.uint8ArrayToHex)(keyData.systemAdminPubKey));
                        userGroupKey = (0, tutanota_crypto_1.aes128RandomKey)();
                        adminGroupKey = (0, tutanota_crypto_1.aes128RandomKey)();
                        customerGroupKey = (0, tutanota_crypto_1.aes128RandomKey)();
                        userGroupInfoSessionKey = (0, tutanota_crypto_1.aes128RandomKey)();
                        adminGroupInfoSessionKey = (0, tutanota_crypto_1.aes128RandomKey)();
                        customerGroupInfoSessionKey = (0, tutanota_crypto_1.aes128RandomKey)();
                        accountingInfoSessionKey = (0, tutanota_crypto_1.aes128RandomKey)();
                        customerServerPropertiesSessionKey = (0, tutanota_crypto_1.aes128RandomKey)();
                        return [4 /*yield*/, this.rsa.encrypt(systemAdminPubKey, (0, tutanota_crypto_1.bitArrayToUint8Array)(accountingInfoSessionKey))];
                    case 2:
                        systemAdminPubEncAccountingInfoSessionKey = _a.sent();
                        userGroupData = this.groupManagement.generateInternalGroupData(keyPairs[0], userGroupKey, userGroupInfoSessionKey, null, adminGroupKey, customerGroupKey);
                        adminGroupData = this.groupManagement.generateInternalGroupData(keyPairs[1], adminGroupKey, adminGroupInfoSessionKey, null, adminGroupKey, customerGroupKey);
                        customerGroupData = this.groupManagement.generateInternalGroupData(keyPairs[2], customerGroupKey, customerGroupInfoSessionKey, null, adminGroupKey, customerGroupKey);
                        recoverData = this.userManagement.generateRecoveryCode(userGroupKey);
                        data = (0, TypeRefs_js_2.createCustomerAccountCreateData)({
                            authToken: authToken,
                            date: TutanotaConstants_1.Const.CURRENT_DATE,
                            lang: currentLanguage,
                            code: registrationCode,
                            userData: this.userManagement.generateUserAccountData(userGroupKey, userGroupInfoSessionKey, customerGroupKey, mailAddress, password, "", recoverData),
                            userEncAdminGroupKey: (0, tutanota_crypto_1.encryptKey)(userGroupKey, adminGroupKey),
                            userGroupData: userGroupData,
                            adminGroupData: adminGroupData,
                            customerGroupData: customerGroupData,
                            adminEncAccountingInfoSessionKey: (0, tutanota_crypto_1.encryptKey)(adminGroupKey, accountingInfoSessionKey),
                            systemAdminPubEncAccountingInfoSessionKey: systemAdminPubEncAccountingInfoSessionKey,
                            adminEncCustomerServerPropertiesSessionKey: (0, tutanota_crypto_1.encryptKey)(adminGroupKey, customerServerPropertiesSessionKey)
                        });
                        return [4 /*yield*/, this.serviceExecutor.post(Services_1.CustomerAccountService, data)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, recoverData.hexCode];
                }
            });
        });
    };
    CustomerFacade.prototype.createContactFormUserGroupData = function () {
        var _this = this;
        var userGroupKey = (0, tutanota_crypto_1.aes128RandomKey)();
        var userGroupInfoSessionKey = (0, tutanota_crypto_1.aes128RandomKey)();
        this.contactFormUserGroupData = this.rsa
            .generateKey()
            .then(function (keyPair) { return _this.groupManagement.generateInternalGroupData(keyPair, userGroupKey, userGroupInfoSessionKey, null, userGroupKey, userGroupKey); })
            .then(function (userGroupData) {
            return {
                userGroupKey: userGroupKey,
                userGroupData: userGroupData
            };
        });
        return Promise.resolve();
    };
    CustomerFacade.prototype.getContactFormUserGroupData = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.contactFormUserGroupData) return [3 /*break*/, 1];
                        return [2 /*return*/, this.contactFormUserGroupData];
                    case 1: return [4 /*yield*/, this.createContactFormUserGroupData()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, (0, tutanota_utils_1.downcast)(this.contactFormUserGroupData)];
                }
            });
        });
    };
    /**
     * @pre CustomerFacade#createContactFormUserGroupData has been invoked before
     */
    CustomerFacade.prototype.createContactFormUser = function (password, contactFormId) {
        return __awaiter(this, void 0, void 0, function () {
            var contactFormUserGroupData, userGroupKey, userGroupData, data, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getContactFormUserGroupData()];
                    case 1:
                        contactFormUserGroupData = _a.sent();
                        userGroupKey = contactFormUserGroupData.userGroupKey, userGroupData = contactFormUserGroupData.userGroupData;
                        return [4 /*yield*/, this.worker.sendProgress(35)];
                    case 2:
                        _a.sent();
                        data = (0, TypeRefs_js_2.createContactFormAccountData)();
                        data.userData = this.userManagement.generateContactFormUserAccountData(userGroupKey, password);
                        return [4 /*yield*/, this.worker.sendProgress(95)];
                    case 3:
                        _a.sent();
                        data.userGroupData = userGroupData;
                        data.contactForm = contactFormId;
                        result = this.serviceExecutor.post(Services_1.ContactFormAccountService, data);
                        this.contactFormUserGroupData = null;
                        return [2 /*return*/, result];
                }
            });
        });
    };
    CustomerFacade.prototype.switchFreeToPremiumGroup = function () {
        return __awaiter(this, void 0, void 0, function () {
            var keyData, membershipAddData, membershipRemoveData, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.serviceExecutor.get(Services_js_1.SystemKeysService, null)];
                    case 1:
                        keyData = _a.sent();
                        membershipAddData = (0, TypeRefs_js_1.createMembershipAddData)({
                            user: this.userFacade.getLoggedInUser()._id,
                            group: (0, tutanota_utils_1.neverNull)(keyData.premiumGroup),
                            symEncGKey: (0, tutanota_crypto_1.encryptKey)(this.userFacade.getUserGroupKey(), (0, tutanota_crypto_1.uint8ArrayToBitArray)(keyData.premiumGroupKey))
                        });
                        return [4 /*yield*/, this.serviceExecutor.post(Services_js_1.MembershipService, membershipAddData)];
                    case 2:
                        _a.sent();
                        membershipRemoveData = (0, TypeRefs_js_1.createMembershipRemoveData)({
                            user: this.userFacade.getLoggedInUser()._id,
                            group: (0, tutanota_utils_1.neverNull)(keyData.freeGroup)
                        });
                        return [4 /*yield*/, this.serviceExecutor["delete"](Services_js_1.MembershipService, membershipRemoveData)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        e_1.message = e_1.message + " error switching free to premium group";
                        console.log(e_1);
                        throw e_1;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    CustomerFacade.prototype.switchPremiumToFreeGroup = function () {
        return __awaiter(this, void 0, void 0, function () {
            var keyData, membershipAddData, membershipRemoveData, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.serviceExecutor.get(Services_js_1.SystemKeysService, null)];
                    case 1:
                        keyData = _a.sent();
                        membershipAddData = (0, TypeRefs_js_1.createMembershipAddData)({
                            user: this.userFacade.getLoggedInUser()._id,
                            group: (0, tutanota_utils_1.neverNull)(keyData.freeGroup),
                            symEncGKey: (0, tutanota_crypto_1.encryptKey)(this.userFacade.getUserGroupKey(), (0, tutanota_crypto_1.uint8ArrayToBitArray)(keyData.freeGroupKey))
                        });
                        return [4 /*yield*/, this.serviceExecutor.post(Services_js_1.MembershipService, membershipAddData)];
                    case 2:
                        _a.sent();
                        membershipRemoveData = (0, TypeRefs_js_1.createMembershipRemoveData)({
                            user: this.userFacade.getLoggedInUser()._id,
                            group: (0, tutanota_utils_1.neverNull)(keyData.premiumGroup)
                        });
                        return [4 /*yield*/, this.serviceExecutor["delete"](Services_js_1.MembershipService, membershipRemoveData)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_2 = _a.sent();
                        e_2.message = e_2.message + " error switching premium to free group";
                        console.log(e_2);
                        throw e_2;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    CustomerFacade.prototype.updatePaymentData = function (paymentInterval, invoiceData, paymentData, confirmedInvoiceCountry) {
        var _this = this;
        return this.entityClient.load(TypeRefs_js_1.CustomerTypeRef, (0, tutanota_utils_1.neverNull)(this.userFacade.getLoggedInUser().customer)).then(function (customer) {
            return _this.entityClient.load(TypeRefs_js_1.CustomerInfoTypeRef, customer.customerInfo).then(function (customerInfo) {
                return _this.entityClient.load(TypeRefs_js_1.AccountingInfoTypeRef, customerInfo.accountingInfo).then(function (accountingInfo) { return __awaiter(_this, void 0, void 0, function () {
                    var _this = this;
                    return __generator(this, function (_a) {
                        return [2 /*return*/, this.cryptoFacade.resolveSessionKeyForInstance(accountingInfo).then(function (accountingInfoSessionKey) {
                                var service = (0, TypeRefs_js_1.createPaymentDataServicePutData)();
                                service.business = false; // not used, must be set to false currently, will be removed later
                                service.paymentInterval = paymentInterval.toString();
                                service.invoiceName = "";
                                service.invoiceAddress = invoiceData.invoiceAddress;
                                service.invoiceCountry = invoiceData.country ? invoiceData.country.a : "";
                                service.invoiceVatIdNo = invoiceData.vatNumber ? invoiceData.vatNumber : "";
                                service.paymentMethod = paymentData ? paymentData.paymentMethod : accountingInfo.paymentMethod ? accountingInfo.paymentMethod : "";
                                service.paymentMethodInfo = null;
                                service.paymentToken = null;
                                if (paymentData && paymentData.creditCardData) {
                                    service.creditCard = paymentData.creditCardData;
                                }
                                service.confirmedCountry = confirmedInvoiceCountry ? confirmedInvoiceCountry.a : null;
                                return _this.serviceExecutor.put(Services_js_1.PaymentDataService, service, { sessionKey: accountingInfoSessionKey !== null && accountingInfoSessionKey !== void 0 ? accountingInfoSessionKey : undefined });
                            })];
                    });
                }); });
            });
        });
    };
    CustomerFacade.prototype.downloadInvoice = function (invoiceNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                data = (0, TypeRefs_js_1.createPdfInvoiceServiceData)({
                    invoiceNumber: invoiceNumber
                });
                return [2 /*return*/, this.serviceExecutor.get(Services_js_1.PdfInvoiceService, data).then(function (returnData) {
                        return {
                            _type: "DataFile",
                            name: String(invoiceNumber) + ".pdf",
                            mimeType: "application/pdf",
                            data: returnData.data,
                            size: returnData.data.byteLength,
                            id: undefined
                        };
                    })];
            });
        });
    };
    CustomerFacade.prototype.loadAccountingInfo = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var customer, customerInfo;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.entityClient.load(TypeRefs_js_1.CustomerTypeRef, (0, tutanota_utils_1.assertNotNull)((_a = this.userFacade.getUser()) === null || _a === void 0 ? void 0 : _a.customer))];
                    case 1:
                        customer = _b.sent();
                        return [4 /*yield*/, this.entityClient.load(TypeRefs_js_1.CustomerInfoTypeRef, customer.customerInfo)];
                    case 2:
                        customerInfo = _b.sent();
                        return [2 /*return*/, this.entityClient.load(TypeRefs_js_1.AccountingInfoTypeRef, customerInfo.accountingInfo)];
                }
            });
        });
    };
    return CustomerFacade;
}());
exports.CustomerFacade = CustomerFacade;
