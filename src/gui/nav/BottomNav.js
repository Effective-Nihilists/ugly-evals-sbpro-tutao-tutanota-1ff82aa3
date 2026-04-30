"use strict";
exports.__esModule = true;
exports.BottomNav = void 0;
var mithril_1 = require("mithril");
var NavButton_js_1 = require("../base/NavButton.js");
var size_1 = require("../size");
var RouteChange_1 = require("../../misc/RouteChange");
var LoginController_1 = require("../../api/main/LoginController");
var TutanotaConstants_1 = require("../../api/common/TutanotaConstants");
var fontSize = size_1.size.font_size_small;
var BottomNav = /** @class */ (function () {
    function BottomNav() {
    }
    BottomNav.prototype.view = function (vnode) {
        // Using bottom-nav class too to match it inside media queries like @print, otherwise it's not matched
        return (0, mithril_1["default"])("bottom-nav.bottom-nav.flex.items-center.z1", [
            (0, mithril_1["default"])(NavButton_js_1.NavButton, {
                label: "emails_label",
                icon: function () { return "Mail" /* BootIcons.Mail */; },
                href: RouteChange_1.navButtonRoutes.mailUrl,
                vertical: true,
                fontSize: fontSize
            }),
            LoginController_1.logins.isInternalUserLoggedIn()
                ? (0, mithril_1["default"])(NavButton_js_1.NavButton, {
                    label: "search_label",
                    icon: function () { return "Search" /* BootIcons.Search */; },
                    href: mithril_1["default"].route.get().startsWith(RouteChange_1.SEARCH_PREFIX)
                        ? mithril_1["default"].route.get()
                        : mithril_1["default"].route.get().startsWith(RouteChange_1.CONTACTS_PREFIX)
                            ? "/search/contact"
                            : "/search/mail",
                    isSelectedPrefix: RouteChange_1.SEARCH_PREFIX,
                    vertical: true,
                    fontSize: fontSize
                })
                : null,
            LoginController_1.logins.isInternalUserLoggedIn() && !LoginController_1.logins.isEnabled(TutanotaConstants_1.FeatureType.DisableContacts)
                ? (0, mithril_1["default"])(NavButton_js_1.NavButton, {
                    label: "contacts_label",
                    icon: function () { return "Contacts" /* BootIcons.Contacts */; },
                    href: function () { return RouteChange_1.navButtonRoutes.contactsUrl; },
                    isSelectedPrefix: RouteChange_1.CONTACTS_PREFIX,
                    vertical: true,
                    fontSize: fontSize
                })
                : null,
            LoginController_1.logins.isInternalUserLoggedIn() && !LoginController_1.logins.isEnabled(TutanotaConstants_1.FeatureType.DisableCalendar)
                ? (0, mithril_1["default"])(NavButton_js_1.NavButton, {
                    label: "calendar_label",
                    icon: function () { return "Calendar" /* BootIcons.Calendar */; },
                    href: RouteChange_1.CALENDAR_PREFIX,
                    vertical: true,
                    fontSize: fontSize
                })
                : null,
        ]);
    };
    return BottomNav;
}());
exports.BottomNav = BottomNav;
