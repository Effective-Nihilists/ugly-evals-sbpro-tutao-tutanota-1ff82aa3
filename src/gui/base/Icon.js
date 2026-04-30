"use strict";
exports.__esModule = true;
exports.progressIcon = exports.Icon = void 0;
var mithril_1 = require("mithril");
var theme_1 = require("../theme");
var Env_1 = require("../../api/common/Env");
var BootIcons_1 = require("./icons/BootIcons");
(0, Env_1.assertMainOrNode)();
var IconsSvg = {};
Promise.resolve().then(function () { return require("./icons/Icons.js"); }).then(function (IconsModule) {
    IconsSvg = IconsModule.IconsSvg;
});
var Icon = /** @class */ (function () {
    function Icon() {
    }
    Icon.prototype.view = function (vnode) {
        var _a, _b;
        // @ts-ignore
        var icon = (_a = BootIcons_1.BootIconsSvg[vnode.attrs.icon]) !== null && _a !== void 0 ? _a : IconsSvg[vnode.attrs.icon];
        var container = vnode.attrs.container || "span";
        return (0, mithril_1["default"])(container + ".icon", {
            "aria-hidden": "true",
            "class": this.getClass(vnode.attrs),
            style: this.getStyle((_b = vnode.attrs.style) !== null && _b !== void 0 ? _b : null)
        }, mithril_1["default"].trust(icon)); // icon is typed, so we may not embed untrusted data
    };
    Icon.prototype.getStyle = function (style) {
        style = style ? style : {};
        if (!style.fill) {
            style.fill = theme_1.theme.content_accent;
        }
        return style;
    };
    Icon.prototype.getClass = function (attrs) {
        var cls = "";
        if (attrs.large) {
            cls += "icon-large ";
        }
        if (attrs["class"]) {
            cls += attrs["class"];
        }
        return cls;
    };
    return Icon;
}());
exports.Icon = Icon;
function progressIcon() {
    return (0, mithril_1["default"])(Icon, {
        icon: "Progress" /* BootIcons.Progress */,
        "class": "icon-large icon-progress"
    });
}
exports.progressIcon = progressIcon;
