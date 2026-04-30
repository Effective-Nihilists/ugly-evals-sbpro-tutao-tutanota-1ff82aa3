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
exports.MailBodyTooLargeError = void 0;
var TutanotaError_1 = require("./TutanotaError");
var MailBodyTooLargeError = /** @class */ (function (_super) {
    __extends(MailBodyTooLargeError, _super);
    function MailBodyTooLargeError(message) {
        return _super.call(this, "MailBodyTooLargeError", message) || this;
    }
    return MailBodyTooLargeError;
}(TutanotaError_1.TutanotaError));
exports.MailBodyTooLargeError = MailBodyTooLargeError;
