"use strict";
exports.__esModule = true;
exports.CompletenessIndicator = void 0;
var mithril_1 = require("mithril");
var PasswordUtils_1 = require("../misc/passwords/PasswordUtils");
var theme_js_1 = require("./theme.js");
var CompletenessIndicator = /** @class */ (function () {
    function CompletenessIndicator() {
    }
    CompletenessIndicator.prototype.view = function (_a) {
        var _b;
        var attrs = _a.attrs;
        return (0, mithril_1["default"])("", {
            style: {
                border: "1px solid ".concat(theme_js_1.theme.content_button),
                width: (_b = attrs.width) !== null && _b !== void 0 ? _b : "100px",
                height: "10px"
            }
        }, (0, mithril_1["default"])("", {
            style: {
                "background-color": theme_js_1.theme.content_button,
                width: (0, PasswordUtils_1.scaleToVisualPasswordStrength)(attrs.percentageCompleted) + "%",
                height: "100%"
            }
        }));
    };
    return CompletenessIndicator;
}());
exports.CompletenessIndicator = CompletenessIndicator;
