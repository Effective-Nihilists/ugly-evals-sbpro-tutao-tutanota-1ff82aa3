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
exports.deviceConfig = exports.migrateConfigV2to3 = exports.migrateConfig = exports.DeviceConfig = exports.defaultThemeId = void 0;
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var ProgrammingError_1 = require("../api/common/error/ProgrammingError");
var Env_1 = require("../api/common/Env");
var ClientDetector_1 = require("./ClientDetector");
(0, Env_1.assertMainOrNodeBoot)();
exports.defaultThemeId = "light";
/**
 * Device config for internal user auto login. Only one config per device is stored.
 */
var DeviceConfig = /** @class */ (function () {
    function DeviceConfig(_version, localStorage) {
        this._version = _version;
        this.localStorage = localStorage;
        this.init();
    }
    DeviceConfig.prototype.init = function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        var loadedConfig = (_a = this.loadConfigFromLocalStorage()) !== null && _a !== void 0 ? _a : {};
        var doSave = false;
        if (loadedConfig._version != null && loadedConfig._version !== DeviceConfig.Version) {
            migrateConfig(loadedConfig);
            doSave = true;
        }
        var signupToken;
        if (!!loadedConfig._signupToken) {
            signupToken = loadedConfig._signupToken;
        }
        else {
            var bytes = new Uint8Array(6);
            var crypto_1 = window.crypto;
            crypto_1.getRandomValues(bytes);
            signupToken = (0, tutanota_utils_1.uint8ArrayToBase64)(bytes);
            doSave = true;
        }
        this.config = {
            _version: DeviceConfig.Version,
            _credentials: loadedConfig._credentials ? new Map((0, tutanota_utils_1.typedEntries)(loadedConfig._credentials)) : new Map(),
            _credentialEncryptionMode: (_b = loadedConfig._credentialEncryptionMode) !== null && _b !== void 0 ? _b : null,
            _encryptedCredentialsKey: (_c = loadedConfig._encryptedCredentialsKey) !== null && _c !== void 0 ? _c : null,
            _themeId: (_d = loadedConfig._themeId) !== null && _d !== void 0 ? _d : exports.defaultThemeId,
            _scheduledAlarmUsers: (_e = loadedConfig._scheduledAlarmUsers) !== null && _e !== void 0 ? _e : [],
            _language: (_f = loadedConfig._language) !== null && _f !== void 0 ? _f : null,
            _defaultCalendarView: (_g = loadedConfig._defaultCalendarView) !== null && _g !== void 0 ? _g : {},
            _hiddenCalendars: (_h = loadedConfig._hiddenCalendars) !== null && _h !== void 0 ? _h : {},
            _testDeviceId: (_j = loadedConfig._testDeviceId) !== null && _j !== void 0 ? _j : null,
            _testAssignments: (_k = loadedConfig._testAssignments) !== null && _k !== void 0 ? _k : null,
            _signupToken: signupToken,
            offlineTimeRangeDaysByUser: (_l = loadedConfig.offlineTimeRangeDaysByUser) !== null && _l !== void 0 ? _l : {}
        };
        // We need to write the config if there was a migration and if we generate the signup token and if.
        // We do not save the config if there was no config. The config is stored when some value changes.
        if (doSave) {
            this.writeToStorage();
        }
    };
    DeviceConfig.prototype.loadConfigFromLocalStorage = function () {
        if (this.localStorage == null) {
            return null;
        }
        var loadedConfigString = this.localStorage.getItem(DeviceConfig.LocalStorageKey);
        if (loadedConfigString == null) {
            return null;
        }
        try {
            return JSON.parse(loadedConfigString);
        }
        catch (e) {
            console.warn("Could not parse device config");
            return null;
        }
    };
    DeviceConfig.prototype.store = function (persistentCredentials) {
        var existing = this.config._credentials.get(persistentCredentials.credentialInfo.userId);
        if (existing === null || existing === void 0 ? void 0 : existing.databaseKey) {
            persistentCredentials.databaseKey = existing.databaseKey;
        }
        this.config._credentials.set(persistentCredentials.credentialInfo.userId, persistentCredentials);
        this.writeToStorage();
    };
    DeviceConfig.prototype.loadByUserId = function (userId) {
        var _a;
        return (_a = this.config._credentials.get(userId)) !== null && _a !== void 0 ? _a : null;
    };
    DeviceConfig.prototype.loadAll = function () {
        return Array.from(this.config._credentials.values());
    };
    DeviceConfig.prototype.deleteByUserId = function (userId) {
        this.config._credentials["delete"](userId);
        this.writeToStorage();
    };
    DeviceConfig.prototype.getSignupToken = function () {
        return this.config._signupToken;
    };
    DeviceConfig.prototype.hasScheduledAlarmsForUser = function (userId) {
        return this.config._scheduledAlarmUsers.includes(userId);
    };
    DeviceConfig.prototype.setAlarmsScheduledForUser = function (userId, setScheduled) {
        var scheduledIndex = this.config._scheduledAlarmUsers.indexOf(userId);
        var scheduledSaved = scheduledIndex !== -1;
        if (setScheduled && !scheduledSaved) {
            this.config._scheduledAlarmUsers.push(userId);
        }
        else if (!setScheduled && scheduledSaved) {
            this.config._scheduledAlarmUsers.splice(scheduledIndex, 1);
        }
        this.writeToStorage();
    };
    DeviceConfig.prototype.setNoAlarmsScheduled = function () {
        this.config._scheduledAlarmUsers = [];
        this.writeToStorage();
    };
    DeviceConfig.prototype.getLanguage = function () {
        return this.config._language;
    };
    DeviceConfig.prototype.setLanguage = function (language) {
        this.config._language = language;
        this.writeToStorage();
    };
    DeviceConfig.prototype.writeToStorage = function () {
        var _this = this;
        try {
            if (this.localStorage != null) {
                this.localStorage.setItem(DeviceConfig.LocalStorageKey, JSON.stringify(this.config, function (key, value) {
                    if (key === "_credentials") {
                        return Object.fromEntries(_this.config._credentials.entries());
                    }
                    else {
                        return value;
                    }
                }));
            }
        }
        catch (e) {
            // may occur in Safari < 11 in incognito mode because it throws a QuotaExceededError
            // DOMException will occurr if all cookies are disabled
            console.log("could not store config", e);
        }
    };
    DeviceConfig.prototype.getTheme = function () {
        return this.config._themeId;
    };
    DeviceConfig.prototype.setTheme = function (theme) {
        if (this.config._themeId !== theme) {
            this.config._themeId = theme;
            this.writeToStorage();
        }
    };
    DeviceConfig.prototype.getDefaultCalendarView = function (userId) {
        return this.config._defaultCalendarView[userId];
    };
    DeviceConfig.prototype.setDefaultCalendarView = function (userId, defaultView) {
        if (this.config._defaultCalendarView[userId] !== defaultView) {
            this.config._defaultCalendarView[userId] = defaultView;
            this.writeToStorage();
        }
    };
    DeviceConfig.prototype.getHiddenCalendars = function (user) {
        return this.config._hiddenCalendars.hasOwnProperty(user) ? this.config._hiddenCalendars[user] : [];
    };
    DeviceConfig.prototype.setHiddenCalendars = function (user, calendars) {
        if (this.config._hiddenCalendars[user] !== calendars) {
            this.config._hiddenCalendars[user] = calendars;
            this.writeToStorage();
        }
    };
    DeviceConfig.prototype.getCredentialEncryptionMode = function () {
        return this.config._credentialEncryptionMode;
    };
    DeviceConfig.prototype.setCredentialEncryptionMode = function (encryptionMode) {
        this.config._credentialEncryptionMode = encryptionMode;
        this.writeToStorage();
    };
    DeviceConfig.prototype.getCredentialsEncryptionKey = function () {
        return this.config._encryptedCredentialsKey ? (0, tutanota_utils_1.base64ToUint8Array)(this.config._encryptedCredentialsKey) : null;
    };
    DeviceConfig.prototype.setCredentialsEncryptionKey = function (value) {
        if (value) {
            this.config._encryptedCredentialsKey = (0, tutanota_utils_1.uint8ArrayToBase64)(value);
        }
        else {
            this.config._encryptedCredentialsKey = null;
        }
        this.writeToStorage();
    };
    DeviceConfig.prototype.getTestDeviceId = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.config._testDeviceId];
            });
        });
    };
    DeviceConfig.prototype.storeTestDeviceId = function (testDeviceId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.config._testDeviceId = testDeviceId;
                this.writeToStorage();
                return [2 /*return*/];
            });
        });
    };
    DeviceConfig.prototype.getAssignments = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.config._testAssignments];
            });
        });
    };
    DeviceConfig.prototype.storeAssignments = function (persistedAssignmentData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.config._testAssignments = persistedAssignmentData;
                this.writeToStorage();
                return [2 /*return*/];
            });
        });
    };
    DeviceConfig.prototype.getOfflineTimeRangeDays = function (userId) {
        return this.config.offlineTimeRangeDaysByUser[userId];
    };
    DeviceConfig.prototype.setOfflineTimeRangeDays = function (userId, days) {
        this.config.offlineTimeRangeDaysByUser[userId] = days;
        this.writeToStorage();
    };
    DeviceConfig.Version = 3;
    DeviceConfig.LocalStorageKey = "tutanotaConfig";
    return DeviceConfig;
}());
exports.DeviceConfig = DeviceConfig;
function migrateConfig(loadedConfig) {
    if (loadedConfig === DeviceConfig.Version) {
        throw new ProgrammingError_1.ProgrammingError("Should not migrate credentials, current version");
    }
    if (loadedConfig._version < 2) {
        loadedConfig._credentials = [];
    }
    if (loadedConfig._version < 3) {
        migrateConfigV2to3(loadedConfig);
    }
}
exports.migrateConfig = migrateConfig;
/**
 * Migrate from V2 of the config to V3
 *
 * Exported for testing
 */
function migrateConfigV2to3(loadedConfig) {
    var oldCredentialsArray = loadedConfig._credentials;
    loadedConfig._credentials = {};
    for (var _i = 0, oldCredentialsArray_1 = oldCredentialsArray; _i < oldCredentialsArray_1.length; _i++) {
        var credential = oldCredentialsArray_1[_i];
        var login = void 0, type = void 0;
        if (credential.mailAddress.includes("@")) {
            login = credential.mailAddress;
            type = "internal";
        }
        else {
            // in version 2 external users had userId as their email address
            // We use encryption stub in this version
            login = credential.userId;
            type = "external";
        }
        loadedConfig._credentials[credential.userId] = {
            credentialInfo: {
                login: login,
                userId: credential.userId,
                type: type
            },
            encryptedPassword: credential.encryptedPassword,
            accessToken: credential.accessToken
        };
    }
}
exports.migrateConfigV2to3 = migrateConfigV2to3;
exports.deviceConfig = new DeviceConfig(DeviceConfig.Version, ClientDetector_1.client.localStorage() ? localStorage : null);
