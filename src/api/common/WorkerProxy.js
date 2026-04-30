"use strict";
exports.__esModule = true;
exports.exposeLocal = exports.exposeRemote = void 0;
/**
 * @file Functions to automatically expose certain interfaces across the WorkerProtocol Queue.
 */
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var MessageDispatcher_1 = require("./MessageDispatcher");
var ProgrammingError_1 = require("./error/ProgrammingError");
/**
 * Generates proxy where each field will be treated as an interface with async methods. Each method will delegate to the
 * {@param requestSender}.
 * Attention! Make sure that the *only* fields on T are facades. Every facade method must return promise or Bad Things will happen.
 * You should specify T explicitly to avoid mistakes.
 */
function exposeRemote(requestSender) {
    // Outer proxy is just used to generate individual facades
    var workerProxy = new Proxy({}, {
        get: function (target, property) {
            return facadeProxy(requestSender, property);
        }
    });
    return (0, tutanota_utils_1.downcast)(workerProxy);
}
exports.exposeRemote = exposeRemote;
/**
 * Generate a handler which will delegate to {@param impls}.
 * Attention! Make sure that the *only* fields on T are facades. Every facade method must return promise or Bad Things will happen.
 * You should specify T explicitly to avoid mistakes.
 */
function exposeLocal(impls) {
    return function (message) {
        var _a;
        var _b = message.args, facade = _b[0], fn = _b[1], args = _b[2];
        var impl = (0, tutanota_utils_1.downcast)(impls)[facade];
        if (impl == null) {
            throw new ProgrammingError_1.ProgrammingError("Facade is not exposed: ".concat(facade, ".").concat(fn, " (exposeLocal)"));
        }
        return (_a = (0, tutanota_utils_1.downcast)(impl))[fn].apply(_a, args);
    };
}
exports.exposeLocal = exposeLocal;
/**
 * Generates proxy which will generate methods which will simulate methods of the facade.
 */
function facadeProxy(requestSender, facadeName) {
    return new Proxy({}, {
        get: function (target, property) {
            // We generate whatever property is asked from us and we assume it is a function. It is normally enforced by the type system
            // but runtime also tests for certain properties e.g. when returning a value from a promise it will try to test whether it
            // is "promisable". It is doing so by checking whether there's a "then" function. So we explicitly say we don't have such
            // a function.
            if (property === "then") {
                return undefined;
            }
            else {
                return function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    var request = new MessageDispatcher_1.Request("facade", [facadeName, property, args]);
                    return requestSender(request);
                };
            }
        }
    });
}
