"use strict";
exports.__esModule = true;
exports.isOfflineError = exports.hasError = void 0;
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var RestError_js_1 = require("../error/RestError.js");
var LoginIncompleteError_js_1 = require("../error/LoginIncompleteError.js");
/**
 * Checks if the given instance has an error in the _errors property which is usually written
 * if decryption fails for some reason in InstanceMapper.
 * @param instance the instance to check for errors.
 * @param key only returns true if there is an error for this key. Other errors will be ignored if the key is defined.
 * @returns {boolean} true if error was found (for the given key).
 */
function hasError(instance, key) {
    var downCastedInstance = (0, tutanota_utils_1.downcast)(instance);
    return !instance || (!!downCastedInstance._errors && (!key || !!downCastedInstance._errors.key));
}
exports.hasError = hasError;
/**
 * Checks whether {@param e} is an error that can error before we are fully logged in and connected.
 */
function isOfflineError(e) {
    return e instanceof RestError_js_1.ConnectionError || e instanceof LoginIncompleteError_js_1.LoginIncompleteError;
}
exports.isOfflineError = isOfflineError;
