"use strict";
exports.__esModule = true;
exports.ToggleButton = void 0;
var mithril_1 = require("mithril");
var Icon_js_1 = require("./Icon.js");
var LanguageViewModel_js_1 = require("../../misc/LanguageViewModel.js");
var Button_js_1 = require("./Button.js");
var ToggleButton = /** @class */ (function () {
    function ToggleButton() {
    }
    ToggleButton.prototype.view = function (_a) {
        var _b;
        var attrs = _a.attrs;
        return (0, mithril_1["default"])("button.toggle-button.state-bg", {
            title: LanguageViewModel_js_1.lang.getMaybeLazy(attrs.title),
            onclick: function (e) { return attrs.onToggled(!attrs.toggled, e); },
            toggled: String(attrs.toggled),
            "class": attrs.size === 1 /* ButtonSize.Compact */ ? "compact" : "",
            "aria-pressed": String(attrs.toggled)
        }, (0, mithril_1["default"])(Icon_js_1.Icon, {
            icon: attrs.icon,
            container: "div",
            "class": "center-h",
            large: true,
            style: {
                fill: (0, Button_js_1.getColors)((_b = attrs.colors) !== null && _b !== void 0 ? _b : "content" /* ButtonColor.Content */).button
            }
        }));
    };
    return ToggleButton;
}());
exports.ToggleButton = ToggleButton;
