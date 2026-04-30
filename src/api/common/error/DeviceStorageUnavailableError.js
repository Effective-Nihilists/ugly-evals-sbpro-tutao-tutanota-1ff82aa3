"use strict";
//@bundleInto:common-min
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.DeviceStorageUnavailableError = void 0;
var TutanotaError_js_1 = require("./TutanotaError.js");
/**
 * this error is thrown when the client fails to get access to a safe storage for
 * credentials, pushIdentifiers and alarms.
 */
var DeviceStorageUnavailableError = /** @class */ (function (_super) {
    __extends(DeviceStorageUnavailableError, _super);
    function DeviceStorageUnavailableError(msg, error) {
        var message = error
            ? msg + "> " + (error.stack ? error.stack : error.message)
            : msg;
        return _super.call(this, "DeviceStorageUnavailableError", message) || this;
    }
    return DeviceStorageUnavailableError;
}(TutanotaError_js_1.TutanotaError));
exports.DeviceStorageUnavailableError = DeviceStorageUnavailableError;
