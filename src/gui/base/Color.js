"use strict";
exports.__esModule = true;
exports.expandHexTriplet = exports.rgbToHex = exports.hexToRgb = exports.isColorLight = exports.VALID_HEX_CODE_FORMAT = void 0;
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Env_1 = require("../../api/common/Env");
(0, Env_1.assertMainOrNodeBoot)();
// 3 or 6 digit hex color codes
exports.VALID_HEX_CODE_FORMAT = new RegExp("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$");
function isColorLight(c) {
    var _a = hexToRgb(c), r = _a.r, g = _a.g, b = _a.b;
    // Counting the perceptive luminance
    // human eye favors green color...
    var a = 1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return a < 0.5;
}
exports.isColorLight = isColorLight;
function hexToRgb(colorCode) {
    (0, tutanota_utils_1.assert)(exports.VALID_HEX_CODE_FORMAT.test(colorCode), "Invalid color code: " + colorCode);
    var hexWithoutHash = colorCode.slice(1);
    if (hexWithoutHash.length === 3) {
        hexWithoutHash = expandHexTriplet(hexWithoutHash); // convert from 3 to 6 digits by duplicating each digit
    }
    var rgb = parseInt(hexWithoutHash, 16); // convert rrggbb to decimal
    var r = (rgb >> 16) & 0xff; // extract red
    var g = (rgb >> 8) & 0xff; // extract green
    var b = (rgb >> 0) & 0xff; // extract blue
    return {
        r: r,
        g: g,
        b: b
    };
}
exports.hexToRgb = hexToRgb;
function rgbToHex(color) {
    return "#" + ((1 << 24) + (color.r << 16) + (color.g << 8) + color.b).toString(16).slice(1);
}
exports.rgbToHex = rgbToHex;
/**
 * Convert RGB to RRGGBB
 */
function expandHexTriplet(triplet) {
    (0, tutanota_utils_1.assert)(triplet.length === 3, "Provided invalid value for triplet: " + triplet);
    return Array.from(triplet).reduce(function (acc, cur) { return "".concat(acc).concat(cur).concat(cur); }, "");
}
exports.expandHexTriplet = expandHexTriplet;
