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
exports.CryptoError = void 0;
var TutanotaError_1 = require("./TutanotaError");
var CryptoError = /** @class */ (function (_super) {
    __extends(CryptoError, _super);
    /**
     * A crypto exception is thrown whenever an encryption/decryption or conversion of keys fails.
     * @param message An information about the exception.
     * @param error The original error that was thrown.
     */
    function CryptoError(message, error) {
        return _super.call(this, "CryptoError", error ? message + "> " + (error.stack ? error.stack : error.message) : message) || this;
    }
    return CryptoError;
}(TutanotaError_1.TutanotaError));
exports.CryptoError = CryptoError;
