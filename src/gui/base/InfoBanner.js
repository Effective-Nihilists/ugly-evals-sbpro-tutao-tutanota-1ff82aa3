"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.InfoBanner = void 0;
var Icon_1 = require("./Icon");
var mithril_1 = require("mithril");
var theme_1 = require("../theme");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var Button_js_1 = require("./Button.js");
var NavButton_js_1 = require("./NavButton.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var GuiUtils_1 = require("./GuiUtils");
var size_js_1 = require("../size.js");
var WARNING_RED = "#ca0606";
/**
 * A low profile banner with a message and 0 or more buttons
 */
var InfoBanner = /** @class */ (function () {
    function InfoBanner() {
    }
    InfoBanner.prototype.view = function (vnode) {
        var _this = this;
        var _a = vnode.attrs, message = _a.message, icon = _a.icon, helpLink = _a.helpLink, buttons = _a.buttons, type = _a.type;
        return (0, mithril_1["default"])(".info-banner.center-vertically.border-bottom.pr-s.pl.border-radius.mlr-l.mt-xs" + // keep the distance to the bottom of the banner the same in the case that buttons aren't present
            (buttons && buttons.length > 0 ? "" : ".pb-s"), {
            style: {
                border: "solid 2px ".concat(type === "warning" /* BannerType.Warning */ ? WARNING_RED : theme_1.theme.content_border)
            }
        }, [
            (0, mithril_1["default"])(".mt-s.mr-s.abs", this.renderIcon(icon, type !== null && type !== void 0 ? type : null)),
            (0, mithril_1["default"])("", { style: { "margin-left": (0, size_js_1.px)(size_js_1.size.icon_size_large + 1) } }, // allow room for the icon
            [
                (0, mithril_1["default"])(".mr.pt-s", [(0, mithril_1["default"])(".small.text-break", LanguageViewModel_1.lang.getMaybeLazy(message))]),
                (0, mithril_1["default"])(".flex.ml-negative-s", {
                    // Adjust the top and bottom spacing because the buttons have a minimum height of 44px.
                    // This way the clickable area of the button overlaps with the text and the border a bit without having
                    // too much empty space
                    style: {
                        marginTop: "-10px",
                        marginBottom: "-6px"
                    }
                }, [
                    (0, mithril_1["default"])(".small", this.renderButtons(buttons || [])),
                    (0, mithril_1["default"])(".flex-grow"),
                    (0, tutanota_utils_1.mapNullable)(helpLink, function (helpLink) { return _this.renderHelpLink(helpLink); }),
                ]),
            ]),
        ]);
    };
    InfoBanner.prototype.renderIcon = function (icon, type) {
        return (0, mithril_1["default"])(Icon_1.Icon, {
            icon: icon,
            style: {
                fill: type === "warning" /* BannerType.Warning */ ? WARNING_RED : theme_1.theme.content_button,
                display: "block"
            }
        });
    };
    InfoBanner.prototype.renderButtons = function (buttons) {
        return buttons.filter(tutanota_utils_1.isNotNull).map(function (attrs) { return (0, mithril_1["default"])(Button_js_1.Button, __assign(__assign({}, attrs), { type: "secondary" /* ButtonType.Secondary */ })); });
    };
    InfoBanner.prototype.renderHelpLink = function (helpLink) {
        return (0, GuiUtils_1.ifAllowedTutanotaLinks)(helpLink, function (link) {
            return (0, mithril_1["default"])(".button-content", {
                style: {
                    marginRight: "-10px"
                }
            }, (0, mithril_1["default"])(NavButton_js_1.NavButton, {
                icon: function () { return "QuestionMark" /* Icons.QuestionMark */; },
                href: link,
                small: true,
                hideLabel: true,
                centred: true,
                label: "help_label"
            }));
        });
    };
    return InfoBanner;
}());
exports.InfoBanner = InfoBanner;
