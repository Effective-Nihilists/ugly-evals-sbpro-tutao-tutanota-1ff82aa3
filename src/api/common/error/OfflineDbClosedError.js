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
exports.OfflineDbClosedError = void 0;
var TutanotaError_js_1 = require("./TutanotaError.js");
var OfflineDbClosedError = /** @class */ (function (_super) {
    __extends(OfflineDbClosedError, _super);
    function OfflineDbClosedError(msg) {
        return _super.call(this, "OfflineDbClosedError", msg !== null && msg !== void 0 ? msg : "Offline db is closed") || this;
    }
    return OfflineDbClosedError;
}(TutanotaError_js_1.TutanotaError));
exports.OfflineDbClosedError = OfflineDbClosedError;
