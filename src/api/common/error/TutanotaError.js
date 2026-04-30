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
exports.TutanotaError = void 0;
/**
 * Base class for all errors in Tutanota. Provides the handling of error stacks for chrome (captureStackTrace) and others.
 * Implemented using ES5 inheritance as babel does not support extending builtin types
 * @see http://stackoverflow.com/questions/33870684/why-doesnt-instanceof-work-on-instances-of-error-subclasses-under-babel-node
 *
 * Note that passing errors between worker and main thread requires all fields of the error to be serializable.
 * Currently those are name, message, stack and data. See (errorToObj() and objToError()).
 *
 * In order to correctly set the class type of the error after deserialization
 * (needed for e instanceof CustomError to work), the error class needs to be
 * added to the ErrorNameToType map in Utils.js.
 */
var ExtendableErrorF = function ExtendableError() {
    // @ts-ignore
    Error.apply(this, arguments);
};
// Warning: huge type hack
// You can't import downcast here
ExtendableErrorF.prototype = Object.create(Error.prototype);
// @ts-ignore
var ExtendableError = ExtendableErrorF;
var TutanotaError = /** @class */ (function (_super) {
    __extends(TutanotaError, _super);
    function TutanotaError(name, message) {
        var _this = _super.call(this, message) || this;
        _this.name = name;
        _this.message = message;
        if (typeof Error.captureStackTrace === "function") {
            Error.captureStackTrace(_this, _this.constructor);
        }
        else {
            var error = new Error();
            if (!error.stack) {
                // fill the stack trace on ios devices
                try {
                    throw error;
                }
                catch (e) {
                }
            }
            _this.stack = _this.name + ". " + _this.message;
            if (error.stack) {
                // not existing in IE9
                var stackLines = error.stack.split("\n");
                while (stackLines[0] && !stackLines[0].match(_this.name)) {
                    stackLines = stackLines.slice(1); // removes line from stack
                }
                if (stackLines.length === 0) {
                    _this.stack = error.stack;
                }
                else {
                    _this.stack += "\n" + stackLines.join("\n");
                }
            }
        }
        return _this;
    }
    return TutanotaError;
}(ExtendableError));
exports.TutanotaError = TutanotaError;
