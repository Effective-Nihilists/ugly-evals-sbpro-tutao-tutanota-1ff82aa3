"use strict";
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
exports.BusinessFeatureRequiredError = void 0;
var TutanotaError_1 = require("../common/error/TutanotaError");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var Env_1 = require("../common/Env");
(0, Env_1.assertMainOrNode)();
/**
 * Thrown when the business feature is not booked for a customer but required to execute a certain function.
 */
var BusinessFeatureRequiredError = /** @class */ (function (_super) {
    __extends(BusinessFeatureRequiredError, _super);
    function BusinessFeatureRequiredError(message) {
        return _super.call(this, "BusinessFeatureRequiredError", LanguageViewModel_1.lang.getMaybeLazy(message)) || this;
    }
    return BusinessFeatureRequiredError;
}(TutanotaError_1.TutanotaError));
exports.BusinessFeatureRequiredError = BusinessFeatureRequiredError;
