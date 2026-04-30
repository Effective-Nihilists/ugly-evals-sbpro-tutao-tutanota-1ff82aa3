"use strict";
exports.__esModule = true;
exports.ColorPicker = void 0;
var mithril_1 = require("mithril");
var ColorPicker = /** @class */ (function () {
    function ColorPicker() {
    }
    ColorPicker.prototype.view = function (vnode) {
        var a = vnode.attrs;
        return (0, mithril_1["default"])("input.color-picker", {
            type: "color",
            value: a.value,
            oninput: function (event) { return a.onValueChange(event.target.value); }
        });
    };
    return ColorPicker;
}());
exports.ColorPicker = ColorPicker;
