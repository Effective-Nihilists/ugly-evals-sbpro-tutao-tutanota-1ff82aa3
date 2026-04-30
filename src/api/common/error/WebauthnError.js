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
exports.WebauthnError = void 0;
var TutanotaError_js_1 = require("./TutanotaError.js");
var WebauthnError = /** @class */ (function (_super) {
    __extends(WebauthnError, _super);
    function WebauthnError(error) {
        return _super.call(this, "WebauthnError", "".concat(error.name, " ").concat(String(error))) || this;
    }
    return WebauthnError;
}(TutanotaError_js_1.TutanotaError));
exports.WebauthnError = WebauthnError;
