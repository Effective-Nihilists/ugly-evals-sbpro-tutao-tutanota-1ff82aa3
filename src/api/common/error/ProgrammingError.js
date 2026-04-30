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
exports.ProgrammingError = void 0;
var TutanotaError_1 = require("./TutanotaError");
var ProgrammingError = /** @class */ (function (_super) {
    __extends(ProgrammingError, _super);
    function ProgrammingError(m) {
        return _super.call(this, "ProgrammingError", m !== null && m !== void 0 ? m : "Unkown programming error") || this;
    }
    return ProgrammingError;
}(TutanotaError_1.TutanotaError));
exports.ProgrammingError = ProgrammingError;
