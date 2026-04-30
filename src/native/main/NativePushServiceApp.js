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
exports.NativePushServiceApp = void 0;
var TypeRefs_js_1 = require("../../api/entities/sys/TypeRefs.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var Env_1 = require("../../api/common/Env");
var LoginController_1 = require("../../api/main/LoginController");
var ClientDetector_1 = require("../../misc/ClientDetector");
var DeviceConfig_1 = require("../../misc/DeviceConfig");
var EntityUtils_1 = require("../../api/common/utils/EntityUtils");
var MainLocator_1 = require("../../api/main/MainLocator");
var DeviceStorageUnavailableError_1 = require("../../api/common/error/DeviceStorageUnavailableError");
var NativePushServiceApp = /** @class */ (function () {
    function NativePushServiceApp(nativePushFacade, logins, cryptoFacade, entityClient, deviceConfig, calendarFacade) {
        this.nativePushFacade = nativePushFacade;
        this.logins = logins;
        this.cryptoFacade = cryptoFacade;
        this.entityClient = entityClient;
        this.deviceConfig = deviceConfig;
        this.calendarFacade = calendarFacade;
        this._currentIdentifier = null;
    }
    NativePushServiceApp.prototype.register = function () {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var identifier, _d, pushIdentifier, _e, e_1, identifier, pushIdentifier, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        console.log("Registering for push notifications");
                        if (!((0, Env_1.isAndroidApp)() || (0, Env_1.isDesktop)())) return [3 /*break*/, 15];
                        _g.label = 1;
                    case 1:
                        _g.trys.push([1, 13, , 14]);
                        return [4 /*yield*/, this.loadPushIdentifierFromNative()];
                    case 2:
                        if (!((_a = (_g.sent())) !== null && _a !== void 0)) return [3 /*break*/, 3];
                        _d = _a;
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, MainLocator_1.locator.worker.generateSsePushIdentifer()];
                    case 4:
                        _d = (_g.sent());
                        _g.label = 5;
                    case 5:
                        identifier = _d;
                        this._currentIdentifier = identifier;
                        return [4 /*yield*/, this.loadPushIdentifier(identifier)];
                    case 6:
                        if (!((_b = (_g.sent())) !== null && _b !== void 0)) return [3 /*break*/, 7];
                        _e = _b;
                        return [3 /*break*/, 9];
                    case 7: return [4 /*yield*/, this.createPushIdentiferInstance(identifier, "3" /* PushServiceType.SSE */)];
                    case 8:
                        _e = (_g.sent());
                        _g.label = 9;
                    case 9:
                        pushIdentifier = _e;
                        return [4 /*yield*/, this.storePushIdentifierLocally(pushIdentifier)];
                    case 10:
                        _g.sent();
                        return [4 /*yield*/, this.scheduleAlarmsIfNeeded(pushIdentifier)];
                    case 11:
                        _g.sent();
                        return [4 /*yield*/, this.initPushNotifications()];
                    case 12:
                        _g.sent();
                        return [3 /*break*/, 14];
                    case 13:
                        e_1 = _g.sent();
                        if (e_1 instanceof DeviceStorageUnavailableError_1.DeviceStorageUnavailableError) {
                            console.warn("Device storage is unavailable, cannot register for push notifications", e_1);
                        }
                        else {
                            throw e_1;
                        }
                        return [3 /*break*/, 14];
                    case 14: return [3 /*break*/, 24];
                    case 15:
                        if (!(0, Env_1.isIOSApp)()) return [3 /*break*/, 24];
                        return [4 /*yield*/, this.loadPushIdentifierFromNative()];
                    case 16:
                        identifier = _g.sent();
                        if (!identifier) return [3 /*break*/, 23];
                        this._currentIdentifier = identifier;
                        return [4 /*yield*/, this.loadPushIdentifier(identifier)];
                    case 17:
                        if (!((_c = (_g.sent())) !== null && _c !== void 0)) return [3 /*break*/, 18];
                        _f = _c;
                        return [3 /*break*/, 20];
                    case 18: return [4 /*yield*/, this.createPushIdentiferInstance(identifier, "1" /* PushServiceType.IOS */)];
                    case 19:
                        _f = (_g.sent());
                        _g.label = 20;
                    case 20:
                        pushIdentifier = _f;
                        if (pushIdentifier.language !== LanguageViewModel_1.lang.code) {
                            pushIdentifier.language = LanguageViewModel_1.lang.code;
                            MainLocator_1.locator.entityClient.update(pushIdentifier);
                        }
                        return [4 /*yield*/, this.storePushIdentifierLocally(pushIdentifier)];
                    case 21:
                        _g.sent();
                        return [4 /*yield*/, this.scheduleAlarmsIfNeeded(pushIdentifier)];
                    case 22:
                        _g.sent();
                        return [3 /*break*/, 24];
                    case 23:
                        console.log("Push notifications were rejected by user");
                        _g.label = 24;
                    case 24: return [2 /*return*/];
                }
            });
        });
    };
    NativePushServiceApp.prototype.invalidateAlarms = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("invalidating alarms");
                        DeviceConfig_1.deviceConfig.setNoAlarmsScheduled();
                        if (!LoginController_1.logins.isUserLoggedIn()) return [3 /*break*/, 2];
                        return [4 /*yield*/, LoginController_1.logins.waitForFullLogin()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.register()];
                    case 2: return [2 /*return*/, Promise.resolve()];
                }
            });
        });
    };
    NativePushServiceApp.prototype.loadPushIdentifierFromNative = function () {
        return this.nativePushFacade.getPushIdentifier();
    };
    NativePushServiceApp.prototype.storePushIdentifierLocally = function (pushIdentifier) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, sk, _a, origin;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = this.logins.getUserController().user._id;
                        _a = tutanota_utils_1.assertNotNull;
                        return [4 /*yield*/, this.cryptoFacade.resolveSessionKeyForInstanceBinary(pushIdentifier)];
                    case 1:
                        sk = _a.apply(void 0, [_b.sent()]);
                        origin = (0, tutanota_utils_1.assertNotNull)(env.staticUrl);
                        return [4 /*yield*/, this.nativePushFacade.storePushIdentifierLocally(pushIdentifier.identifier, userId, origin, (0, EntityUtils_1.getElementId)(pushIdentifier), sk)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NativePushServiceApp.prototype.loadPushIdentifier = function (identifier) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var list, identifiers;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        list = (0, tutanota_utils_1.assertNotNull)(this.logins.getUserController().user.pushIdentifierList);
                        return [4 /*yield*/, this.entityClient.loadAll(TypeRefs_js_1.PushIdentifierTypeRef, list.list)];
                    case 1:
                        identifiers = _b.sent();
                        return [2 /*return*/, (_a = identifiers.find(function (i) { return i.identifier === identifier; })) !== null && _a !== void 0 ? _a : null];
                }
            });
        });
    };
    NativePushServiceApp.prototype.createPushIdentiferInstance = function (identifier, pushServiceType) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var list, pushIdentifier, id;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        list = (0, tutanota_utils_1.assertNotNull)((_a = this.logins.getUserController().user.pushIdentifierList) === null || _a === void 0 ? void 0 : _a.list);
                        pushIdentifier = (0, TypeRefs_js_1.createPushIdentifier)({
                            _area: "0",
                            _owner: this.logins.getUserController().userGroupInfo.group,
                            _ownerGroup: this.logins.getUserController().userGroupInfo.group,
                            displayName: ClientDetector_1.client.getIdentifier(),
                            pushServiceType: pushServiceType,
                            identifier: identifier,
                            language: LanguageViewModel_1.lang.code
                        });
                        return [4 /*yield*/, this.entityClient.setup(list, pushIdentifier)];
                    case 1:
                        id = _b.sent();
                        return [2 /*return*/, this.entityClient.load(TypeRefs_js_1.PushIdentifierTypeRef, [list, id])];
                }
            });
        });
    };
    NativePushServiceApp.prototype.closePushNotification = function (addresses) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.nativePushFacade.closePushNotifications(addresses)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NativePushServiceApp.prototype.getPushIdentifier = function () {
        return this._currentIdentifier;
    };
    NativePushServiceApp.prototype.initPushNotifications = function () {
        return this.nativePushFacade.initPushNotifications();
    };
    NativePushServiceApp.prototype.scheduleAlarmsIfNeeded = function (pushIdentifier) {
        return __awaiter(this, void 0, void 0, function () {
            var userId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = this.logins.getUserController().user._id;
                        if (!!this.deviceConfig.hasScheduledAlarmsForUser(userId)) return [3 /*break*/, 2];
                        console.log("Alarms not scheduled for user, scheduling!");
                        return [4 /*yield*/, this.calendarFacade.scheduleAlarmsForNewDevice(pushIdentifier)];
                    case 1:
                        _a.sent();
                        DeviceConfig_1.deviceConfig.setAlarmsScheduledForUser(userId, true);
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    return NativePushServiceApp;
}());
exports.NativePushServiceApp = NativePushServiceApp;
