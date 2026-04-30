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
exports.CancelledError = void 0;
var TutanotaError_1 = require("./TutanotaError");
var CancelledError = /** @class */ (function (_super) {
    __extends(CancelledError, _super);
    /**
     * A cancelled error is thrown when a async action is aborted
     * @param message An information about the exception.
     * @param error The original error that was thrown.
     */
    function CancelledError(message) {
        return _super.call(this, "CancelledError", message) || this;
    }
    return CancelledError;
}(TutanotaError_1.TutanotaError));
exports.CancelledError = CancelledError;
