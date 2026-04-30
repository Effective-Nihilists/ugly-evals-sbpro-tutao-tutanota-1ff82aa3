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
exports.QuotaExceededError = void 0;
var DbError_1 = require("./DbError");
/**
 * Error used to indicate that there's insufficient space on the device.
 */
var QuotaExceededError = /** @class */ (function (_super) {
    __extends(QuotaExceededError, _super);
    function QuotaExceededError(message, error) {
        var _this = _super.call(this, message, error !== null && error !== void 0 ? error : undefined) || this;
        _this.name = "QuotaExceededError";
        return _this;
    }
    return QuotaExceededError;
}(DbError_1.DbError));
exports.QuotaExceededError = QuotaExceededError;
