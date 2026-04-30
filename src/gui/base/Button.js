"use strict";
exports.__esModule = true;
exports.Button = exports.getColors = void 0;
var mithril_1 = require("mithril");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var Flash_1 = require("./Flash");
var Icon_1 = require("./Icon");
var theme_1 = require("../theme");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Env_1 = require("../../api/common/Env");
var size_js_1 = require("../size.js");
(0, Env_1.assertMainOrNode)();
function getColors(buttonColors) {
    switch (buttonColors) {
        case "nav" /* ButtonColor.Nav */:
            return {
                button: theme_1.theme.navigation_button,
                button_selected: theme_1.theme.navigation_button_selected,
                button_icon_bg: (0, theme_1.getNavButtonIconBackground)(),
                icon: theme_1.theme.navigation_button_icon,
                icon_selected: theme_1.theme.navigation_button_icon_selected,
                border: theme_1.theme.navigation_bg
            };
        case "drawernav" /* ButtonColor.DrawerNav */:
            return {
                button: theme_1.theme.content_button,
                button_selected: theme_1.theme.content_button_selected,
                button_icon_bg: "transparent",
                icon: (0, theme_1.getNavigationMenuIcon)(),
                icon_selected: theme_1.theme.content_button_icon_selected,
                border: (0, theme_1.getElevatedBackground)()
            };
        case "elevated" /* ButtonColor.Elevated */:
            return {
                button: theme_1.theme.content_button,
                button_selected: theme_1.theme.content_button_selected,
                button_icon_bg: (0, theme_1.getContentButtonIconBackground)(),
                icon: theme_1.theme.content_button_icon,
                icon_selected: theme_1.theme.content_button_icon_selected,
                border: (0, theme_1.getElevatedBackground)()
            };
        case "header" /* ButtonColor.Header */:
            return {
                button: theme_1.theme.content_button,
                button_selected: theme_1.theme.content_button_selected,
                button_icon_bg: "transparent",
                icon: theme_1.theme.header_button_selected,
                icon_selected: theme_1.theme.content_button_icon_selected,
                border: theme_1.theme.content_bg
            };
        case "content" /* ButtonColor.Content */:
        default:
            return {
                button: theme_1.theme.content_button,
                button_selected: theme_1.theme.content_button_selected,
                button_icon_bg: (0, theme_1.getContentButtonIconBackground)(),
                icon: theme_1.theme.content_button_icon,
                icon_selected: theme_1.theme.content_button_icon_selected,
                border: theme_1.theme.content_bg
            };
    }
}
exports.getColors = getColors;
/**
 * A button.
 */
var Button = /** @class */ (function () {
    function Button() {
        this._domButton = null;
    }
    Button.prototype.view = function (vnode) {
        var _this = this;
        var a = vnode.attrs;
        var type = this.getType(a.type);
        var title = a.title !== undefined ? this.getTitle(a.title) : LanguageViewModel_1.lang.getMaybeLazy(a.label);
        return (0, mithril_1["default"])("button.limit-width.noselect", {
            "class": this.getButtonClasses(a).join(" "),
            style: this._getStyle(a),
            onclick: function (event) { return _this.click(event, a, (0, tutanota_utils_1.assertNotNull)(_this._domButton)); },
            title: type === "action" /* ButtonType.Action */ || type === "login" /* ButtonType.Login */
                ? LanguageViewModel_1.lang.getMaybeLazy(a.label)
                : title,
            oncreate: function (vnode) {
                _this._domButton = vnode.dom;
            },
            onremove: function (vnode) { return (0, Flash_1.removeFlash)(vnode.dom); }
        }, (0, mithril_1["default"])("", {
            // additional wrapper for flex box styling as safari does not support flex box on buttons.
            "class": this.getWrapperClasses(a).join(" "),
            style: {
                borderColor: getColors(a.colors).border
            },
            oncreate: function (vnode) { return (0, Flash_1.addFlash)(vnode.dom); },
            onremove: function (vnode) { return (0, Flash_1.removeFlash)(vnode.dom); }
        }, [
            this.getIcon(a),
            this._getLabelElement(a),
            a.staticRightText
                ? (0, mithril_1["default"])(".pl-s", {
                    style: this._getLabelStyle(a)
                }, a.staticRightText)
                : null,
        ]));
    };
    Button.prototype._getStyle = function (a) {
        return a.type === "login" /* ButtonType.Login */
            ? {
                "border-radius": (0, size_js_1.px)(size_js_1.size.border_radius_small),
                "background-color": theme_1.theme.content_accent
            }
            : {};
    };
    Button.prototype.getTitle = function (title) {
        return LanguageViewModel_1.lang.getMaybeLazy(title);
    };
    Button.prototype.getType = function (type) {
        return type ? type : "action" /* ButtonType.Action */;
    };
    Button.prototype.getIcon = function (a) {
        var _a;
        var icon = (_a = a.icon) === null || _a === void 0 ? void 0 : _a.call(a);
        return icon
            ? (0, mithril_1["default"])(Icon_1.Icon, {
                icon: icon,
                "class": this.getIconClass(a),
                style: {
                    fill: this.getIconColor(a),
                    "background-color": this.getIconBackgroundColor(a)
                }
            })
            : null;
    };
    Button.prototype.getIconColor = function (a) {
        var _a;
        var type = this.getType(a.type);
        if (type === "bubble" /* ButtonType.Bubble */) {
            return theme_1.theme.button_bubble_fg;
        }
        else if (type === "login" /* ButtonType.Login */) {
            return theme_1.theme.content_button_icon_selected;
        }
        else if ((_a = a.isSelected) === null || _a === void 0 ? void 0 : _a.call(a)) {
            return getColors(a.colors).icon_selected;
        }
        else {
            return getColors(a.colors).icon;
        }
    };
    Button.prototype.getIconBackgroundColor = function (a) {
        var _a;
        var type = this.getType(a.type);
        if (["bubble" /* ButtonType.Bubble */, "login" /* ButtonType.Login */].includes(type)) {
            return "initial";
        }
        else if ((_a = a.isSelected) === null || _a === void 0 ? void 0 : _a.call(a)) {
            return getColors(a.colors).button_selected;
        }
        else if (type === "action" /* ButtonType.Action */ || type === "action-large" /* ButtonType.ActionLarge */) {
            return getColors(a.colors).button_icon_bg;
        }
        else {
            return getColors(a.colors).button;
        }
    };
    Button.prototype.getIconClass = function (a) {
        var type = this.getType(a.type);
        if (type === "login" /* ButtonType.Login */) {
            return "flex-center items-center button-icon icon-xl pr-s";
        }
        if (type === "action-large" /* ButtonType.ActionLarge */) {
            return "flex-center items-center button-icon icon-large";
        }
        else if (a.colors === "header" /* ButtonColor.Header */) {
            return "flex-end items-center button-icon icon-xl";
        }
        else if (a.colors === "drawernav" /* ButtonColor.DrawerNav */) {
            return "flex-end items-end button-icon";
        }
        else if (type === "bubble" /* ButtonType.Bubble */) {
            return "pr-s";
        }
        else {
            return "flex-center items-center button-icon";
        }
    };
    Button.prototype.getButtonClasses = function (a) {
        var type = this.getType(a.type);
        var buttonClasses = ["bg-transparent"];
        if (["action" /* ButtonType.Action */, "action-large" /* ButtonType.ActionLarge */].includes(type)) {
            buttonClasses.push("button-width-fixed"); // set the button width for firefox browser
            buttonClasses.push("button-height"); // set the button height for firefox browser
        }
        else {
            buttonClasses.push("button-height"); // set the button height for firefox browser
        }
        if (type === "login" /* ButtonType.Login */) {
            buttonClasses.push("full-width");
        }
        return buttonClasses;
    };
    Button.prototype.getWrapperClasses = function (a) {
        var type = this.getType(a.type);
        var wrapperClasses = ["button-content", "flex", "items-center", type];
        if (!["textBubble" /* ButtonType.TextBubble */].includes(type)) {
            wrapperClasses.push("plr-button");
        }
        wrapperClasses.push("justify-center");
        return wrapperClasses;
    };
    Button.prototype._getLabelElement = function (a) {
        var type = this.getType(a.type);
        var label = LanguageViewModel_1.lang.getMaybeLazy(a.label);
        if (label.trim() === "" || ["action" /* ButtonType.Action */].includes(type)) {
            return null;
        }
        var classes = ["text-ellipsis"];
        return (0, mithril_1["default"])("", {
            "class": classes.join(" "),
            style: this._getLabelStyle(a)
        }, label);
    };
    Button.prototype._getLabelStyle = function (a) {
        var _a;
        var type = this.getType(a.type);
        var color;
        switch (type) {
            case "primary" /* ButtonType.Primary */:
            case "secondary" /* ButtonType.Secondary */:
                color = theme_1.theme.content_accent;
                break;
            case "login" /* ButtonType.Login */:
                color = theme_1.theme.content_button_icon_selected;
                break;
            case "bubble" /* ButtonType.Bubble */:
            case "textBubble" /* ButtonType.TextBubble */:
                color = theme_1.theme.content_fg;
                break;
            default:
                color = ((_a = a.isSelected) === null || _a === void 0 ? void 0 : _a.call(a)) ? getColors(a.colors).button_selected : getColors(a.colors).button;
        }
        return {
            color: color,
            "font-weight": type === "primary" /* ButtonType.Primary */ ? "bold" : "normal"
        };
    };
    Button.prototype.click = function (event, a, dom) {
        var _a;
        (_a = a.click) === null || _a === void 0 ? void 0 : _a.call(a, event, dom);
        if (a.noBubble) {
            event.stopPropagation();
        }
    };
    return Button;
}());
exports.Button = Button;
