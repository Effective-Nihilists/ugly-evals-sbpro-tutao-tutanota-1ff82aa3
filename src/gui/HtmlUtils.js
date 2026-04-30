"use strict";
exports.__esModule = true;
exports.stringifyFragment = exports.newMouseEvent = exports.getSafeAreaInsetBottom = exports.getSafeAreaInsetTop = exports.getSafeAreaInsetRight = exports.getSafeAreaInsetLeft = exports.applySafeAreaInsetMarginLR = void 0;
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Env_1 = require("../api/common/Env");
(0, Env_1.assertMainOrNodeBoot)();
function applySafeAreaInsetMarginLR(element) {
    element.style.marginRight = "env(safe-area-inset-right)";
    element.style.marginLeft = "env(safe-area-inset-left)";
}
exports.applySafeAreaInsetMarginLR = applySafeAreaInsetMarginLR;
function getSafeAreaInsetLeft() {
    return window.orientation === 90 ? "env(safe-area-inset-left)" : "";
}
exports.getSafeAreaInsetLeft = getSafeAreaInsetLeft;
function getSafeAreaInsetRight() {
    return window.orientation === -90 ? "env(safe-area-inset-right)" : "";
}
exports.getSafeAreaInsetRight = getSafeAreaInsetRight;
/**
 * Only used for iOS. We need to go through CSS variable because getting env() directly does not work.
 * see https://benfrain.com/how-to-get-the-value-of-phone-notches-environment-variables-env-in-javascript-from-css/
 * We need to adjust bottom position because of the home button on iOS which shifts everything up.
 */
function getSafeAreaInsetTop() {
    var bottomInsetString = getComputedStyle((0, tutanota_utils_1.assertNotNull)(document === null || document === void 0 ? void 0 : document.body)).getPropertyValue("--safe-area-inset-top");
    return bottomInsetString ? parseInt(bottomInsetString.slice(0, -2)) : 0;
}
exports.getSafeAreaInsetTop = getSafeAreaInsetTop;
/**
 * Only used for iOS. We need to go through CSS variable because getting env() directly does not work.
 * see https://benfrain.com/how-to-get-the-value-of-phone-notches-environment-variables-env-in-javascript-from-css/
 * We need to adjust bottom position because of the home button on iOS which shifts everything up.
 */
function getSafeAreaInsetBottom() {
    var bottomInsetString = getComputedStyle((0, tutanota_utils_1.assertNotNull)(document === null || document === void 0 ? void 0 : document.body)).getPropertyValue("--safe-area-inset-bottom");
    return bottomInsetString ? parseInt(bottomInsetString.slice(0, -2)) : 0;
}
exports.getSafeAreaInsetBottom = getSafeAreaInsetBottom;
function newMouseEvent() {
    // We cannot use constructor because of IE11
    return (0, tutanota_utils_1.downcast)(document.createEvent("MouseEvent"));
}
exports.newMouseEvent = newMouseEvent;
function stringifyFragment(fragment) {
    var div = document.createElement("div");
    div.appendChild(fragment);
    return div.innerHTML;
}
exports.stringifyFragment = stringifyFragment;
