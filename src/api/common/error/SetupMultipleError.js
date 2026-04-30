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
exports.SetupMultipleError = void 0;
var TutanotaError_1 = require("./TutanotaError");
//Error cannot be serialized to be passed between worker and main thread
var SetupMultipleError = /** @class */ (function (_super) {
    __extends(SetupMultipleError, _super);
    function SetupMultipleError(message, errors, instances) {
        var _this = _super.call(this, "SetupMultipleError", "".concat(message, "\nNumber of errors: ").concat(errors.length, "\nFirst error: ").concat(errors[0])) || this;
        _this.errors = errors;
        _this.failedInstances = instances;
        return _this;
    }
    return SetupMultipleError;
}(TutanotaError_1.TutanotaError));
exports.SetupMultipleError = SetupMultipleError;
