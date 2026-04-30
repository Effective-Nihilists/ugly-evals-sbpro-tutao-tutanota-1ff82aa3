"use strict";
exports.__esModule = true;
exports.NoZoneDateProvider = void 0;
var ProgrammingError_js_1 = require("../error/ProgrammingError.js");
var NoZoneDateProvider = /** @class */ (function () {
    function NoZoneDateProvider() {
    }
    NoZoneDateProvider.prototype.now = function () {
        return Date.now();
    };
    NoZoneDateProvider.prototype.timeZone = function () {
        throw new ProgrammingError_js_1.ProgrammingError("timeZone is not available in worker");
    };
    return NoZoneDateProvider;
}());
exports.NoZoneDateProvider = NoZoneDateProvider;
