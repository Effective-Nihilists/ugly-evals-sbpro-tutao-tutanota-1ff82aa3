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
exports.ImportError = void 0;
var TutanotaError_1 = require("./TutanotaError");
var ImportError = /** @class */ (function (_super) {
    __extends(ImportError, _super);
    function ImportError(message, numFailed) {
        var _this = _super.call(this, "ImportError", message + "\nNumber of failed imports: " + numFailed) || this;
        _this.data = {
            numFailed: numFailed
        };
        return _this;
    }
    Object.defineProperty(ImportError.prototype, "numFailed", {
        get: function () {
            return this.data.numFailed;
        },
        enumerable: false,
        configurable: true
    });
    return ImportError;
}(TutanotaError_1.TutanotaError));
exports.ImportError = ImportError;
