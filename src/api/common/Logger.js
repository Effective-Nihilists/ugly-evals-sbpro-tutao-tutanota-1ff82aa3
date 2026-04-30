"use strict";
//@bundleInto:common-min
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.replaceNativeLogger = exports.createLogFile = exports.Logger = exports.LOG_SIZE = void 0;
var tutanota_utils_1 = require("@tutao/tutanota-utils");
exports.LOG_SIZE = 1000;
var Logger = /** @class */ (function () {
    function Logger(dateProvider) {
        if (dateProvider === void 0) { dateProvider = function () { return new Date(); }; }
        this._entries = new Array(exports.LOG_SIZE);
        this._index = 0;
        this._dateProvider = dateProvider;
    }
    Logger.prototype.logInfo = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.log("I", args);
    };
    Logger.prototype.logError = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.log("E", args);
    };
    Logger.prototype.logWarn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.log("W", args);
    };
    Logger.prototype.log = function (level, args) {
        var entry = [this._dateProvider(), level];
        entry.push.apply(entry, args);
        this._entries[this._index] = entry;
        this._index++;
        if (this._index === exports.LOG_SIZE) {
            this._index = 0;
        }
    };
    Logger.prototype.formatLogEntry = function (date, level) {
        var rest = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            rest[_i - 2] = arguments[_i];
        }
        var formattedArgs = rest.map(function (obj) {
            try {
                return obj instanceof Error
                    ? (0, tutanota_utils_1.errorToString)(Object.assign({ stack: null }, obj))
                    : JSON.stringify(obj);
            }
            catch (e) {
                return "[cyclic object]";
            }
        });
        var message = formattedArgs.join(",");
        return "".concat(date.toISOString(), " ").concat(level, " ").concat(message);
    };
    Logger.prototype.getEntries = function () {
        var _this = this;
        var newerPart = this._entries.slice(0, this._index);
        var olderPart = this._entries.slice(this._index);
        return olderPart
            .concat(newerPart)
            .filter(Boolean)
            .map(function (_a) {
            var date = _a[0], level = _a[1], rest = _a.slice(2);
            return _this.formatLogEntry.apply(_this, __spreadArray([date, level], rest, false));
        });
    };
    return Logger;
}());
exports.Logger = Logger;
function createLogFile(timestamp, content, scope) {
    var data = (0, tutanota_utils_1.stringToUtf8Uint8Array)(content);
    return {
        _type: "DataFile",
        name: timestamp + "_" + scope + "_tutanota.log",
        mimeType: "text/plain",
        data: data,
        size: data.byteLength,
        id: undefined
    };
}
exports.createLogFile = createLogFile;
function replaceNativeLogger(global, loggerInstance, force) {
    if (force === void 0) { force = false; }
    // Replace native logger only when enabled because we lose line numbers
    if (force || global.env.dist || global.debug) {
        global.logger = loggerInstance;
        var globalConsole_1 = global.console;
        global.console = {
            log: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                globalConsole_1.log.apply(globalConsole_1, args);
                loggerInstance.logInfo.apply(loggerInstance, args);
            },
            warn: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                globalConsole_1.warn.apply(globalConsole_1, args);
                loggerInstance.logWarn.apply(loggerInstance, args);
            },
            error: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                globalConsole_1.error.apply(globalConsole_1, args);
                loggerInstance.logError.apply(loggerInstance, args);
            },
            trace: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                globalConsole_1.trace.apply(globalConsole_1, args);
            },
            info: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                globalConsole_1.info.apply(globalConsole_1, args);
            }
        };
    }
}
exports.replaceNativeLogger = replaceNativeLogger;
