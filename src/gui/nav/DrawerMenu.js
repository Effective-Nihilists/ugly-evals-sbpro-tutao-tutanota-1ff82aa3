"use strict";
exports.__esModule = true;
exports.DrawerMenu = void 0;
var mithril_1 = require("mithril");
var Button_js_1 = require("../base/Button.js");
var Header_js_1 = require("../Header.js");
var NavFunctions_1 = require("./NavFunctions");
var Env_1 = require("../../api/common/Env");
var LoginController_1 = require("../../api/main/LoginController");
var RouteChange_1 = require("../../misc/RouteChange");
var HtmlUtils_1 = require("../HtmlUtils");
var AriaUtils_1 = require("../AriaUtils");
var Dropdown_js_1 = require("../base/Dropdown.js");
var KeyManager_1 = require("../../misc/KeyManager");
var CounterBadge_js_1 = require("../base/CounterBadge.js");
var size_js_1 = require("../size.js");
var theme_js_1 = require("../theme.js");
var UsageTestModel_js_1 = require("../../misc/UsageTestModel.js");
var MainLocator_js_1 = require("../../api/main/MainLocator.js");
var DrawerMenu = /** @class */ (function () {
    function DrawerMenu() {
    }
    DrawerMenu.prototype.view = function (vnode) {
        var showUsageDataOptInIndicator = MainLocator_js_1.locator.usageTestModel ? MainLocator_js_1.locator.usageTestModel.showOptInIndicator() : false;
        return (0, mithril_1["default"])("drawer-menu" + (0, AriaUtils_1.landmarkAttrs)("contentinfo" /* AriaLandmarks.Contentinfo */, "drawer menu"), {
            style: {
                "padding-left": (0, HtmlUtils_1.getSafeAreaInsetLeft)()
            }
        }, (0, mithril_1["default"])(".flex.col.height-100p.items-center.pt.pb", [
            (0, mithril_1["default"])(".flex-grow"),
            LoginController_1.logins.isUserLoggedIn() && showUsageDataOptInIndicator
                ?
                    (0, mithril_1["default"])(".news-button", [
                        (0, mithril_1["default"])(Button_js_1.Button, {
                            icon: function () { return "Bulb" /* Icons.Bulb */; },
                            label: "news_label",
                            click: UsageTestModel_js_1.showUsageTestOptInDialog,
                            type: "action-large" /* ButtonType.ActionLarge */,
                            colors: "drawernav" /* ButtonColor.DrawerNav */
                        }),
                        (0, mithril_1["default"])(CounterBadge_js_1.CounterBadge, {
                            count: 1,
                            position: {
                                top: (0, size_js_1.px)(0),
                                right: (0, size_js_1.px)(3)
                            },
                            color: "white",
                            background: theme_js_1.theme.list_accent_fg
                        }),
                    ])
                : null,
            LoginController_1.logins.isGlobalAdminUserLoggedIn() && LoginController_1.logins.getUserController().isPremiumAccount()
                ? (0, mithril_1["default"])(Button_js_1.Button, {
                    icon: function () { return "Gift" /* Icons.Gift */; },
                    label: "buyGiftCard_label",
                    click: function () {
                        mithril_1["default"].route.set("/settings/subscription");
                        Promise.resolve().then(function () { return require("../../subscription/giftcards/PurchaseGiftCardDialog"); }).then(function (_a) {
                            var showPurchaseGiftCardDialog = _a.showPurchaseGiftCardDialog;
                            return showPurchaseGiftCardDialog();
                        });
                    },
                    type: "action-large" /* ButtonType.ActionLarge */,
                    colors: "drawernav" /* ButtonColor.DrawerNav */
                })
                : null,
            (0, Env_1.isDesktop)()
                ? (0, mithril_1["default"])(Button_js_1.Button, {
                    icon: function () { return "NewWindow" /* Icons.NewWindow */; },
                    label: "openNewWindow_action",
                    click: function () {
                        vnode.attrs.openNewWindow();
                    },
                    type: "action-large" /* ButtonType.ActionLarge */,
                    colors: "drawernav" /* ButtonColor.DrawerNav */
                })
                : null,
            !(0, Env_1.isIOSApp)() && LoginController_1.logins.isUserLoggedIn() && LoginController_1.logins.getUserController().isFreeAccount()
                ? (0, mithril_1["default"])(Button_js_1.Button, {
                    icon: function () { return "Premium" /* BootIcons.Premium */; },
                    label: "upgradePremium_label",
                    click: function () { return (0, NavFunctions_1.showUpgradeDialog)(); },
                    type: "action-large" /* ButtonType.ActionLarge */,
                    colors: "drawernav" /* ButtonColor.DrawerNav */
                })
                : null,
            (0, mithril_1["default"])(Button_js_1.Button, {
                label: "showHelp_action",
                icon: function () { return "Help" /* BootIcons.Help */; },
                type: "action-large" /* ButtonType.ActionLarge */,
                click: function (e, dom) {
                    if (LoginController_1.logins.isUserLoggedIn() && LoginController_1.logins.getUserController().isPremiumAccount()) {
                        (0, Dropdown_js_1.createDropdown)({
                            width: 300,
                            lazyButtons: function () { return [
                                {
                                    label: "supportMenu_label",
                                    click: function () { return (0, NavFunctions_1.showSupportDialog)(); }
                                },
                                {
                                    label: "keyboardShortcuts_title",
                                    click: function () { return KeyManager_1.keyManager.openF1Help(true); }
                                },
                            ]; }
                        })(e, dom);
                    }
                    else {
                        KeyManager_1.keyManager.openF1Help();
                    }
                },
                noBubble: true,
                colors: "drawernav" /* ButtonColor.DrawerNav */
            }),
            (0, NavFunctions_1.isNewMailActionAvailable)() && LoginController_1.logins.getUserController().isGlobalAdmin()
                ? (0, mithril_1["default"])(Button_js_1.Button, {
                    icon: function () { return "Share" /* BootIcons.Share */; },
                    label: "invite_alt",
                    click: function () { return (0, NavFunctions_1.writeInviteMail)(); },
                    type: "action-large" /* ButtonType.ActionLarge */,
                    colors: "drawernav" /* ButtonColor.DrawerNav */
                })
                : null,
            LoginController_1.logins.isInternalUserLoggedIn()
                ? (0, mithril_1["default"])(Button_js_1.Button, {
                    icon: function () { return "Settings" /* BootIcons.Settings */; },
                    label: "settings_label",
                    click: function () { return mithril_1["default"].route.set(RouteChange_1.navButtonRoutes.settingsUrl); },
                    type: "action-large" /* ButtonType.ActionLarge */,
                    colors: "drawernav" /* ButtonColor.DrawerNav */
                })
                : null,
            (0, mithril_1["default"])(Button_js_1.Button, {
                icon: function () { return "Logout" /* BootIcons.Logout */; },
                label: "logout_label",
                click: function () { return mithril_1["default"].route.set(Header_js_1.LogoutUrl); },
                type: "action-large" /* ButtonType.ActionLarge */,
                colors: "drawernav" /* ButtonColor.DrawerNav */
            }),
        ]));
    };
    return DrawerMenu;
}());
exports.DrawerMenu = DrawerMenu;
