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
exports.initUserController = exports.UserController = void 0;
var TutanotaConstants_1 = require("../common/TutanotaConstants");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Env_1 = require("../common/Env");
var EventController_1 = require("./EventController");
var RestError_1 = require("../common/error/RestError");
var MainLocator_1 = require("./MainLocator");
var EntityUtils_1 = require("../common/utils/EntityUtils");
var WhitelabelCustomizations_1 = require("../../misc/WhitelabelCustomizations");
var Services_1 = require("../entities/sys/Services");
var TypeRefs_1 = require("../entities/sys/TypeRefs");
var TypeRefs_2 = require("../entities/tutanota/TypeRefs");
var TypeModels_1 = require("../entities/sys/TypeModels");
(0, Env_1.assertMainOrNode)();
var UserController = /** @class */ (function () {
    function UserController(
    // should be readonly but is needed for a workaround in CalendarModel
    user, _userGroupInfo, sessionId, _props, accessToken, _userSettingsGroupRoot, sessionType, entityClient) {
        this.user = user;
        this._userGroupInfo = _userGroupInfo;
        this.sessionId = sessionId;
        this._props = _props;
        this.accessToken = accessToken;
        this._userSettingsGroupRoot = _userSettingsGroupRoot;
        this.sessionType = sessionType;
        this.entityClient = entityClient;
    }
    Object.defineProperty(UserController.prototype, "userId", {
        get: function () {
            return this.user._id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UserController.prototype, "props", {
        get: function () {
            return this._props;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UserController.prototype, "userGroupInfo", {
        get: function () {
            return this._userGroupInfo;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UserController.prototype, "userSettingsGroupRoot", {
        get: function () {
            return this._userSettingsGroupRoot;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Checks if the current user is an admin of the customer.
     * @return True if the user is an admin
     */
    UserController.prototype.isGlobalAdmin = function () {
        if (this.isInternalUser()) {
            return this.user.memberships.find(function (m) { return m.groupType === TutanotaConstants_1.GroupType.Admin; }) != null;
        }
        else {
            return false;
        }
    };
    UserController.prototype.isGlobalOrLocalAdmin = function () {
        if (this.isInternalUser()) {
            return this.user.memberships.find(function (m) { return m.groupType === TutanotaConstants_1.GroupType.Admin || m.groupType === TutanotaConstants_1.GroupType.LocalAdmin; }) != null;
        }
        else {
            return false;
        }
    };
    /**
     * Checks if the account type of the logged in user is FREE.
     * @returns True if the account type is FREE otherwise false
     */
    UserController.prototype.isFreeAccount = function () {
        return this.user.accountType === TutanotaConstants_1.AccountType.FREE;
    };
    UserController.prototype.isPremiumAccount = function () {
        return this.user.accountType === TutanotaConstants_1.AccountType.PREMIUM;
    };
    /**
     * Provides the information if an internal user is logged in.
     * @return True if an internal user is logged in, false if no user or an external user is logged in.
     */
    UserController.prototype.isInternalUser = function () {
        return this.user.accountType !== TutanotaConstants_1.AccountType.EXTERNAL;
    };
    UserController.prototype.loadCustomer = function () {
        return MainLocator_1.locator.entityClient.load(TypeRefs_1.CustomerTypeRef, (0, tutanota_utils_1.neverNull)(this.user.customer));
    };
    UserController.prototype.loadCustomerInfo = function () {
        return this.loadCustomer().then(function (customer) { return MainLocator_1.locator.entityClient.load(TypeRefs_1.CustomerInfoTypeRef, customer.customerInfo); });
    };
    UserController.prototype.loadAccountingInfo = function () {
        return this.loadCustomerInfo().then(function (customerInfo) { return MainLocator_1.locator.entityClient.load(TypeRefs_1.AccountingInfoTypeRef, customerInfo.accountingInfo); });
    };
    UserController.prototype.getMailGroupMemberships = function () {
        return this.user.memberships.filter(function (membership) { return membership.groupType === TutanotaConstants_1.GroupType.Mail; });
    };
    UserController.prototype.getCalendarMemberships = function () {
        return this.user.memberships.filter(function (membership) { return membership.groupType === TutanotaConstants_1.GroupType.Calendar; });
    };
    UserController.prototype.getUserMailGroupMembership = function () {
        return this.getMailGroupMemberships()[0];
    };
    UserController.prototype.getLocalAdminGroupMemberships = function () {
        return this.user.memberships.filter(function (membership) { return membership.groupType === TutanotaConstants_1.GroupType.LocalAdmin; });
    };
    UserController.prototype.getTemplateMemberships = function () {
        return this.user.memberships.filter(function (membership) { return membership.groupType === TutanotaConstants_1.GroupType.Template; });
    };
    UserController.prototype.entityEventsReceived = function (updates, eventOwnerGroupId) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, updates_1, update, instanceListId, instanceId, operation, _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _i = 0, updates_1 = updates;
                        _e.label = 1;
                    case 1:
                        if (!(_i < updates_1.length)) return [3 /*break*/, 12];
                        update = updates_1[_i];
                        instanceListId = update.instanceListId, instanceId = update.instanceId, operation = update.operation;
                        if (!(operation === "1" /* OperationType.UPDATE */ && (0, EventController_1.isUpdateForTypeRef)(TypeRefs_1.UserTypeRef, update) && (0, EntityUtils_1.isSameId)(this.user.userGroup.group, eventOwnerGroupId))) return [3 /*break*/, 3];
                        _a = this;
                        return [4 /*yield*/, this.entityClient.load(TypeRefs_1.UserTypeRef, this.user._id)];
                    case 2:
                        _a.user = _e.sent();
                        return [3 /*break*/, 11];
                    case 3:
                        if (!(operation === "1" /* OperationType.UPDATE */ &&
                            (0, EventController_1.isUpdateForTypeRef)(TypeRefs_1.GroupInfoTypeRef, update) &&
                            (0, EntityUtils_1.isSameId)(this.userGroupInfo._id, [(0, tutanota_utils_1.neverNull)(instanceListId), instanceId]))) return [3 /*break*/, 5];
                        _b = this;
                        return [4 /*yield*/, this.entityClient.load(TypeRefs_1.GroupInfoTypeRef, this._userGroupInfo._id)];
                    case 4:
                        _b._userGroupInfo = _e.sent();
                        return [3 /*break*/, 11];
                    case 5:
                        if (!((0, EventController_1.isUpdateForTypeRef)(TypeRefs_2.TutanotaPropertiesTypeRef, update) && operation === "1" /* OperationType.UPDATE */)) return [3 /*break*/, 7];
                        _c = this;
                        return [4 /*yield*/, this.entityClient.loadRoot(TypeRefs_2.TutanotaPropertiesTypeRef, this.user.userGroup.group)];
                    case 6:
                        _c._props = _e.sent();
                        return [3 /*break*/, 11];
                    case 7:
                        if (!(0, EventController_1.isUpdateForTypeRef)(TypeRefs_2.UserSettingsGroupRootTypeRef, update)) return [3 /*break*/, 9];
                        _d = this;
                        return [4 /*yield*/, this.entityClient.load(TypeRefs_2.UserSettingsGroupRootTypeRef, this.user.userGroup.group)];
                    case 8:
                        _d._userSettingsGroupRoot = _e.sent();
                        return [3 /*break*/, 11];
                    case 9:
                        if (!((0, EventController_1.isUpdateForTypeRef)(TypeRefs_1.CustomerInfoTypeRef, update) && operation === "0" /* OperationType.CREATE */)) return [3 /*break*/, 11];
                        // After premium upgrade customer info is deleted and created with new id. We want to make sure that it's cached for offline login.
                        return [4 /*yield*/, this.entityClient.load(TypeRefs_1.CustomerInfoTypeRef, [update.instanceListId, update.instanceId])];
                    case 10:
                        // After premium upgrade customer info is deleted and created with new id. We want to make sure that it's cached for offline login.
                        _e.sent();
                        _e.label = 11;
                    case 11:
                        _i++;
                        return [3 /*break*/, 1];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Delete the session (only if it's a non-persistent session
     * @param sync whether or not to delete in the main thread. For example, will be true when logging out due to closing the tab
     */
    UserController.prototype.deleteSession = function (sync) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!sync) return [3 /*break*/, 3];
                        if (!(this.sessionType !== 2 /* SessionType.Persistent */)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.deleteSessionSync()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [3 /*break*/, 7];
                    case 3:
                        if (!(this.sessionType !== 2 /* SessionType.Persistent */)) return [3 /*break*/, 5];
                        return [4 /*yield*/, MainLocator_1.locator.loginFacade.deleteSession(this.accessToken)["catch"](function (e) { return console.log("Error ignored on Logout:", e); })];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [4 /*yield*/, MainLocator_1.locator.worker.reset()];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.deleteSessionSync = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var sendBeacon = navigator.sendBeacon; // Save sendBeacon to variable to satisfy type checker
            if (sendBeacon) {
                try {
                    var path = "".concat((0, Env_1.getHttpOrigin)(), "/rest/sys/").concat(Services_1.CloseSessionService.name.toLowerCase());
                    var requestObject = (0, TypeRefs_1.createCloseSessionServicePost)({
                        accessToken: _this.accessToken,
                        sessionId: _this.sessionId
                    });
                    delete (0, tutanota_utils_1.downcast)(requestObject)["_type"]; // Remove extra field which is not part of the data model
                    // Send as Blob to be able to set content type otherwise sends 'text/plain'
                    var queued = sendBeacon.call(navigator, path, new Blob([JSON.stringify(requestObject)], {
                        type: "application/json" /* MediaType.Json */
                    }));
                    console.log("queued closing session: ", queued);
                    resolve();
                }
                catch (e) {
                    console.log("Failed to send beacon", e);
                    reject(e);
                }
            }
            else {
                // Fall back to sync XHR if
                var path = "/rest/sys/session/" + _this.sessionId[0] + "/" + _this.sessionId[1];
                var xhr_1 = new XMLHttpRequest();
                xhr_1.open("DELETE", (0, Env_1.getHttpOrigin)() + path, false); // sync requests increase reliability when invoked in onunload
                xhr_1.setRequestHeader("accessToken", _this.accessToken);
                xhr_1.setRequestHeader("v", TypeModels_1.typeModels.Session.version);
                xhr_1.onload = function () {
                    // XMLHttpRequestProgressEvent, but not needed
                    if (xhr_1.status === 200) {
                        console.log("deleted session");
                        resolve();
                    }
                    else if (xhr_1.status === 401) {
                        console.log("authentication failed => session is already deleted");
                        resolve();
                    }
                    else {
                        console.error("could not delete session " + xhr_1.status);
                        reject(new Error("could not delete session " + xhr_1.status));
                    }
                };
                xhr_1.onerror = function () {
                    console.error("failed to request delete session");
                    reject(new Error("failed to request delete session"));
                };
                xhr_1.send();
            }
        });
    };
    UserController.prototype.isWhitelabelAccount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var customerInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // isTutanotaDomain always returns true on desktop
                        if (!(0, Env_1.isDesktop)()) {
                            return [2 /*return*/, !!(0, WhitelabelCustomizations_1.getWhitelabelCustomizations)(window)];
                        }
                        return [4 /*yield*/, this.loadCustomerInfo()];
                    case 1:
                        customerInfo = _a.sent();
                        return [2 /*return*/, customerInfo.domainInfos.some(function (domainInfo) { return domainInfo.whitelabelConfig; })];
                }
            });
        });
    };
    UserController.prototype.loadWhitelabelConfig = function () {
        return __awaiter(this, void 0, void 0, function () {
            var customerInfo, domainInfoAndConfig, whitelabelConfig;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadCustomerInfo()];
                    case 1:
                        customerInfo = _a.sent();
                        domainInfoAndConfig = (0, tutanota_utils_1.first)((0, tutanota_utils_1.mapAndFilterNull)(customerInfo.domainInfos, function (domainInfo) {
                            return domainInfo.whitelabelConfig && {
                                domainInfo: domainInfo,
                                whitelabelConfig: domainInfo.whitelabelConfig
                            };
                        }));
                        if (!domainInfoAndConfig) return [3 /*break*/, 3];
                        return [4 /*yield*/, MainLocator_1.locator.entityClient.load(TypeRefs_1.WhitelabelConfigTypeRef, domainInfoAndConfig.whitelabelConfig)];
                    case 2:
                        whitelabelConfig = _a.sent();
                        return [2 /*return*/, {
                                domainInfo: domainInfoAndConfig.domainInfo,
                                whitelabelConfig: whitelabelConfig
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.isPersistentSession = function () {
        return this.sessionType === 2 /* SessionType.Persistent */;
    };
    return UserController;
}());
exports.UserController = UserController;
// noinspection JSUnusedGlobalSymbols
// dynamically imported
function initUserController(_a) {
    var user = _a.user, userGroupInfo = _a.userGroupInfo, sessionId = _a.sessionId, accessToken = _a.accessToken, sessionType = _a.sessionType;
    return __awaiter(this, void 0, void 0, function () {
        var entityClient, _b, props, userSettingsGroupRoot;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    entityClient = MainLocator_1.locator.entityClient;
                    return [4 /*yield*/, Promise.all([
                            entityClient.loadRoot(TypeRefs_2.TutanotaPropertiesTypeRef, user.userGroup.group),
                            entityClient.load(TypeRefs_2.UserSettingsGroupRootTypeRef, user.userGroup.group)["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotFoundError, function () {
                                return entityClient.setup(null, (0, TypeRefs_2.createUserSettingsGroupRoot)({ _ownerGroup: user.userGroup.group }))
                                    .then(function () { return entityClient.load(TypeRefs_2.UserSettingsGroupRootTypeRef, user.userGroup.group); });
                            })),
                        ])];
                case 1:
                    _b = _c.sent(), props = _b[0], userSettingsGroupRoot = _b[1];
                    return [2 /*return*/, new UserController(user, userGroupInfo, sessionId, props, accessToken, userSettingsGroupRoot, sessionType, entityClient)];
            }
        });
    });
}
exports.initUserController = initUserController;
