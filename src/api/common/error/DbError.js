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
exports.DbError = void 0;
var TutanotaError_1 = require("./TutanotaError");
var DbError = /** @class */ (function (_super) {
    __extends(DbError, _super);
    /**
     * A db error is thrown from indexeddb
     * @param message An information about the exception.
     * @param error The original error that was thrown.
     */
    function DbError(message, error) {
        var _this = _super.call(this, "DbError", error ? message + ": ".concat(error.name, ", ").concat(error.message, "> ") + (error.stack ? error.stack : error.message) : message) || this;
        _this.error = error !== null && error !== void 0 ? error : null;
        return _this;
    }
    return DbError;
}(TutanotaError_1.TutanotaError));
exports.DbError = DbError;
