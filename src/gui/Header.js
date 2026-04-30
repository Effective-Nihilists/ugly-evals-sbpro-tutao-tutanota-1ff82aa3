"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.header = exports.Header = exports.LogoutUrl = void 0;
var mithril_1 = require("mithril");
var NavBar_js_1 = require("./base/NavBar.js");
var NavButton_js_1 = require("./base/NavButton.js");
var styles_js_1 = require("./styles.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var KeyManager_js_1 = require("../misc/KeyManager.js");
var LanguageViewModel_js_1 = require("../misc/LanguageViewModel.js");
var LoginController_js_1 = require("../api/main/LoginController.js");
var theme_js_1 = require("./theme.js");
var TutanotaConstants_js_1 = require("../api/common/TutanotaConstants.js");
var size_js_1 = require("./size.js");
var RouteChange_js_1 = require("../misc/RouteChange.js");
var AriaUtils_js_1 = require("./AriaUtils.js");
var Env_js_1 = require("../api/common/Env.js");
var OfflineIndicator_js_1 = require("./base/OfflineIndicator.js");
var OfflineIndicatorViewModel_js_1 = require("./base/OfflineIndicatorViewModel.js");
var ProgressBar_js_1 = require("./base/ProgressBar.js");
var CounterBadge_js_1 = require("./base/CounterBadge.js");
var LogoutPath = "/login?noAutoLogin=true";
exports.LogoutUrl = window.location.hash.startsWith("#mail") ? "/ext?noAutoLogin=true" + location.hash : LogoutPath;
(0, Env_js_1.assertMainOrNode)();
var Header = /** @class */ (function () {
    function Header() {
        var _this = this;
        this.searchBar = null;
        this.currentView = null; // decoupled from ViewSlider implementation to reduce size of bootstrap bundle
        this.offlineIndicatorModel = new OfflineIndicatorViewModel_js_1.OfflineIndicatorViewModel(function () { return mithril_1["default"].redraw(); });
        this.shortcuts = this.setupShortcuts();
        Promise.resolve().then(function () { return require("../api/main/MainLocator.js"); }).then(function (mod) { return __awaiter(_this, void 0, void 0, function () {
            var worker, SearchBar;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, mod.locator.initialized];
                    case 1:
                        _a.sent();
                        worker = mod.locator.worker;
                        this.offlineIndicatorModel.init(mod.locator, LoginController_js_1.logins);
                        return [4 /*yield*/, worker.initialized];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, Promise.resolve().then(function () { return require("../search/SearchBar.js"); })];
                    case 3:
                        SearchBar = (_a.sent()).SearchBar;
                        this.searchBar = new SearchBar();
                        this.usageTestModel = mod.locator.usageTestModel;
                        return [2 /*return*/];
                }
            });
        }); });
        // we may be able to remove this when we stop creating the Header with new
        this.view = this.view.bind(this);
        this.onremove = this.onremove.bind(this);
        this.oncreate = this.oncreate.bind(this);
    }
    Header.prototype.view = function () {
        var _a, _b;
        // Do not return undefined if headerView is not present
        var injectedView = (_b = (_a = this.currentView) === null || _a === void 0 ? void 0 : _a.headerView) === null || _b === void 0 ? void 0 : _b.call(_a);
        return (0, mithril_1["default"])(".header-nav.overflow-hidden.flex.items-end.flex-center", [
            isNotTemporary() ? (0, mithril_1["default"])(ProgressBar_js_1.ProgressBar, { progress: this.offlineIndicatorModel.getProgress() }) : null,
            injectedView
                // Make sure this wrapper takes up the full height like the things inside it expect
                ? (0, mithril_1["default"])(".flex-grow.height-100p", injectedView)
                : [
                    this.renderLeftContent(),
                    this.renderCenterContent(),
                    this.renderRightContent()
                ],
            styles_js_1.styles.isUsingBottomNavigation() && LoginController_js_1.logins.isAtLeastPartiallyLoggedIn() && !this.mobileSearchBarVisible() && !injectedView && isNotTemporary()
                ? (0, mithril_1["default"])(OfflineIndicator_js_1.OfflineIndicatorMobile, this.offlineIndicatorModel.getCurrentAttrs())
                : null
        ]);
    };
    Header.prototype.oncreate = function () {
        KeyManager_js_1.keyManager.registerShortcuts(this.shortcuts);
    };
    Header.prototype.onremove = function () {
        KeyManager_js_1.keyManager.unregisterShortcuts(this.shortcuts);
    };
    /**
     * render the new mail/contact/event button in the top right of the one- and two-column layouts.
     * @private
     */
    Header.prototype.renderHeaderAction = function () {
        var _a, _b;
        return (0, mithril_1["default"])(".header-right.pr-s.flex-end.items-center", (_b = (_a = this.currentView) === null || _a === void 0 ? void 0 : _a.headerRightView) === null || _b === void 0 ? void 0 : _b.call(_a));
    };
    /**
     * render the search and navigation bar in three-column layouts. if there is a navigation, also render an offline indicator.
     * @private
     */
    Header.prototype.renderFullNavigation = function () {
        return (0, mithril_1["default"])(".header-right.pr-l.mr-negative-m.flex-end.items-center", LoginController_js_1.logins.isAtLeastPartiallyLoggedIn()
            ? [this.renderDesktopSearchBar(), (0, mithril_1["default"])(OfflineIndicator_js_1.OfflineIndicatorDesktop, this.offlineIndicatorModel.getCurrentAttrs()), (0, mithril_1["default"])(".nav-bar-spacer"), (0, mithril_1["default"])(NavBar_js_1.NavBar, this.renderButtons())]
            : [this.renderDesktopSearchBar(), (0, mithril_1["default"])(NavBar_js_1.NavBar, this.renderButtons())]);
    };
    Header.prototype.renderDesktopSearchBar = function () {
        return this.searchBar && this.desktopSearchBarVisible()
            ? (0, mithril_1["default"])(this.searchBar, {
                spacer: true,
                placeholder: this.searchPlaceholder()
            })
            : null;
    };
    Header.prototype.focusMain = function () {
        var viewSlider = this.currentView && this.currentView.getViewSlider && this.currentView.getViewSlider();
        viewSlider && viewSlider.getMainColumn().focus();
    };
    Header.prototype.renderButtons = function () {
        var _this = this;
        // We assign click listeners to buttons to move focus correctly if the view is already open
        return LoginController_js_1.logins.isInternalUserLoggedIn()
            ? [
                (0, mithril_1["default"])(NavButton_js_1.NavButton, {
                    label: "emails_label",
                    icon: function () { return "Mail" /* BootIcons.Mail */; },
                    href: RouteChange_js_1.navButtonRoutes.mailUrl,
                    isSelectedPrefix: RouteChange_js_1.MAIL_PREFIX,
                    colors: "header" /* NavButtonColor.Header */,
                    click: function () { return mithril_1["default"].route.get() === RouteChange_js_1.navButtonRoutes.mailUrl && _this.focusMain(); }
                }),
                !LoginController_js_1.logins.isEnabled(TutanotaConstants_js_1.FeatureType.DisableContacts)
                    ? (0, mithril_1["default"])(NavButton_js_1.NavButton, {
                        label: "contacts_label",
                        icon: function () { return "Contacts" /* BootIcons.Contacts */; },
                        href: RouteChange_js_1.navButtonRoutes.contactsUrl,
                        isSelectedPrefix: RouteChange_js_1.CONTACTS_PREFIX,
                        colors: "header" /* NavButtonColor.Header */,
                        click: function () { return mithril_1["default"].route.get() === RouteChange_js_1.navButtonRoutes.contactsUrl && _this.focusMain(); }
                    })
                    : null,
                !LoginController_js_1.logins.isEnabled(TutanotaConstants_js_1.FeatureType.DisableCalendar)
                    ? (0, mithril_1["default"])(NavButton_js_1.NavButton, {
                        label: "calendar_label",
                        icon: function () { return "Calendar" /* BootIcons.Calendar */; },
                        href: RouteChange_js_1.CALENDAR_PREFIX,
                        colors: "header" /* NavButtonColor.Header */,
                        click: function () { return mithril_1["default"].route.get().startsWith(RouteChange_js_1.CALENDAR_PREFIX) && _this.focusMain(); }
                    })
                    : null,
            ]
            : null;
    };
    Header.prototype.mobileSearchBarVisible = function () {
        var route = mithril_1["default"].route.get();
        var locator = window.tutao.locator;
        return (this.searchBar != null &&
            locator != null &&
            !locator.search.indexState().initializing &&
            styles_js_1.styles.isUsingBottomNavigation() &&
            LoginController_js_1.logins.isInternalUserLoggedIn() &&
            route.startsWith(RouteChange_js_1.SEARCH_PREFIX));
    };
    Header.prototype.setupShortcuts = function () {
        return [
            {
                key: TutanotaConstants_js_1.Keys.M,
                enabled: function () { return LoginController_js_1.logins.isUserLoggedIn(); },
                exec: function (key) { return mithril_1["default"].route.set(RouteChange_js_1.navButtonRoutes.mailUrl); },
                help: "mailView_action"
            },
            {
                key: TutanotaConstants_js_1.Keys.C,
                enabled: function () { return LoginController_js_1.logins.isInternalUserLoggedIn() && !LoginController_js_1.logins.isEnabled(TutanotaConstants_js_1.FeatureType.DisableContacts); },
                exec: function (key) { return mithril_1["default"].route.set(RouteChange_js_1.navButtonRoutes.contactsUrl); },
                help: "contactView_action"
            },
            {
                key: TutanotaConstants_js_1.Keys.O,
                enabled: function () { return LoginController_js_1.logins.isInternalUserLoggedIn(); },
                exec: function (key) { return mithril_1["default"].route.set(RouteChange_js_1.navButtonRoutes.calendarUrl); },
                help: "calendarView_action"
            },
            {
                key: TutanotaConstants_js_1.Keys.S,
                enabled: function () { return LoginController_js_1.logins.isInternalUserLoggedIn(); },
                exec: function (key) { return mithril_1["default"].route.set(RouteChange_js_1.navButtonRoutes.settingsUrl); },
                help: "settingsView_action"
            },
            {
                key: TutanotaConstants_js_1.Keys.L,
                shift: true,
                ctrl: true,
                enabled: function () { return LoginController_js_1.logins.isUserLoggedIn(); },
                exec: function (key) { return mithril_1["default"].route.set(exports.LogoutUrl); },
                help: "logout_label"
            },
        ];
    };
    Header.prototype.renderCenterContent = function () {
        if (!styles_js_1.styles.isUsingBottomNavigation())
            return null;
        var viewSlider = this.getViewSlider();
        var header = function (title, left, right) {
            return (0, mithril_1["default"])(".flex-center.header-middle.text-ellipsis.b", [left || null, (0, mithril_1["default"])(".mt-s", title), right || null]);
        };
        if (this.mobileSearchBarVisible()) {
            return this.renderMobileSearchBar();
        }
        else if (viewSlider) {
            var firstVisibleBgColumn = viewSlider.getBackgroundColumns().find(function (c) { return c.visible; });
            if (firstVisibleBgColumn) {
                var title = firstVisibleBgColumn.getTitle();
                var buttonLeft = firstVisibleBgColumn.getTitleButtonLeft();
                var buttonRight = firstVisibleBgColumn.getTitleButtonRight();
                return header(title, buttonLeft, buttonRight);
            }
            else {
                return header("");
            }
        }
        else if (mithril_1["default"].route.get().startsWith("/login")) {
            return header(LanguageViewModel_js_1.lang.get("login_label"));
        }
        else if (mithril_1["default"].route.get().startsWith("/signup")) {
            return header(LanguageViewModel_js_1.lang.get("registrationHeadline_msg"));
        }
        else if (mithril_1["default"].route.get().startsWith("/termination")) {
            return header(LanguageViewModel_js_1.lang.get("termination_title"));
        }
        else {
            return null;
        }
    };
    Header.prototype.renderRightContent = function () {
        return isNotTemporary()
            ? styles_js_1.styles.isUsingBottomNavigation()
                ? this.renderHeaderAction()
                : this.renderFullNavigation()
            : null;
    };
    Header.prototype.renderMobileSearchBar = function () {
        var placeholder;
        var route = mithril_1["default"].route.get();
        if (route.startsWith("/search/mail")) {
            placeholder = LanguageViewModel_js_1.lang.get("searchEmails_placeholder");
        }
        else if (route.startsWith("/search/contact")) {
            placeholder = LanguageViewModel_js_1.lang.get("searchContacts_placeholder");
        }
        else {
            placeholder = null;
        }
        return (0, mithril_1["default"])((0, tutanota_utils_1.neverNull)(this.searchBar), {
            alwaysExpanded: true,
            classes: ".flex-center",
            placeholder: placeholder,
            style: {
                height: "100%",
                "margin-left": (0, size_js_1.px)(size_js_1.size.navbar_edge_width_mobile),
                "margin-right": (0, size_js_1.px)(size_js_1.size.navbar_edge_width_mobile)
            }
        });
    };
    Header.prototype.renderLeftContent = function () {
        var _this = this;
        var viewSlider = this.getViewSlider();
        var showBackButton = this.isBackButtonVisible();
        var showNewsIndicator = this.usageTestModel && this.usageTestModel.showOptInIndicator() && !showBackButton && styles_js_1.styles.isUsingBottomNavigation();
        var style = {
            "margin-left": styles_js_1.styles.isUsingBottomNavigation() ? (0, size_js_1.px)(-15) : null,
            "overflow": showNewsIndicator ? "visible" : "hidden"
        };
        var content = null;
        if (viewSlider && viewSlider.isFocusPreviousPossible()) {
            content = (0, mithril_1["default"])("", [
                (0, mithril_1["default"])(NavButton_js_1.NavButton, {
                    label: function () {
                        var prevColumn = viewSlider.getPreviousColumn();
                        return prevColumn ? prevColumn.getTitle() : "";
                    },
                    icon: function () {
                        return _this.isBackButtonVisible()
                            ? "Back" /* BootIcons.Back */
                            : "MoreVertical" /* BootIcons.MoreVertical */;
                    },
                    colors: "header" /* NavButtonColor.Header */,
                    href: function () { return mithril_1["default"].route.get(); },
                    click: function () {
                        if (!_this.currentView || !_this.currentView.handleBackButton || !_this.currentView.handleBackButton()) {
                            viewSlider.focusPreviousColumn();
                        }
                    },
                    hideLabel: true
                }),
                showNewsIndicator
                    ? (0, mithril_1["default"])(CounterBadge_js_1.CounterBadge, {
                        count: 1,
                        position: {
                            top: (0, size_js_1.px)(4),
                            right: (0, size_js_1.px)(-3)
                        },
                        color: "white",
                        background: theme_js_1.theme.list_accent_fg
                    })
                    : null,
            ]);
        }
        else if (!styles_js_1.styles.isUsingBottomNavigation() && (!viewSlider || viewSlider.isUsingOverlayColumns())) {
            content = (0, mithril_1["default"])(".logo.logo-height.pl" + (0, AriaUtils_js_1.landmarkAttrs)("banner" /* AriaLandmarks.Banner */, "Tutanota logo"), {
                style: {
                    "margin-left": (0, size_js_1.px)(size_js_1.size.drawer_menu_width)
                }
            }, mithril_1["default"].trust(theme_js_1.theme.logo)); // the custom logo is already sanitized in theme.js
        }
        return (0, mithril_1["default"])(".header-left.pl-l.ml-negative-s.flex-start.items-center", { style: style }, content);
    };
    /**
     * Returns true iff the menu icon should be replaced by the back button.
     * Calls overrideBackIcon().
     */
    Header.prototype.isBackButtonVisible = function () {
        var viewSlider = this.getViewSlider();
        if (!viewSlider) {
            return false;
        }
        return this.currentView && this.currentView.overrideBackIcon
            ? this.currentView.overrideBackIcon()
            : !viewSlider.getBackgroundColumns()[0].visible;
    };
    Header.prototype.updateCurrentView = function (currentView) {
        this.currentView = currentView;
    };
    Header.prototype.getViewSlider = function () {
        if (this.currentView && this.currentView.getViewSlider) {
            return this.currentView.getViewSlider();
        }
        else {
            return null;
        }
    };
    Header.prototype.searchPlaceholder = function () {
        var route = mithril_1["default"].route.get();
        if (route.startsWith(RouteChange_js_1.MAIL_PREFIX) || route.startsWith("/search/mail")) {
            return LanguageViewModel_js_1.lang.get("searchEmails_placeholder");
        }
        else if (route.startsWith(RouteChange_js_1.CONTACTS_PREFIX) || route.startsWith("/search/contact")) {
            return LanguageViewModel_js_1.lang.get("searchContacts_placeholder");
        }
        else if (route.startsWith("/settings/users")) {
            return LanguageViewModel_js_1.lang.get("searchUsers_placeholder");
        }
        else if (route.startsWith("/settings/groups")) {
            return LanguageViewModel_js_1.lang.get("searchGroups_placeholder");
        }
        else {
            return null;
        }
    };
    Header.prototype.desktopSearchBarVisible = function () {
        var route = mithril_1["default"].route.get();
        var locator = window.tutao.locator;
        return (this.searchBar != null &&
            locator != null &&
            !locator.search.indexState().initializing &&
            styles_js_1.styles.isDesktopLayout() &&
            LoginController_js_1.logins.isInternalUserLoggedIn() &&
            (route.startsWith(RouteChange_js_1.SEARCH_PREFIX) ||
                route.startsWith(RouteChange_js_1.MAIL_PREFIX) ||
                route.startsWith(RouteChange_js_1.CONTACTS_PREFIX) ||
                route.startsWith("/settings/users") ||
                route.startsWith("/settings/groups") ||
                route.startsWith("/settings/whitelabelaccounts")));
    };
    return Header;
}());
exports.Header = Header;
/**
 * Useful to decide whether to display several elements.
 * @return true if the user is logged in with a non-temporary session, false otherwise
 */
function isNotTemporary() {
    return LoginController_js_1.logins.isUserLoggedIn() && LoginController_js_1.logins.getUserController().sessionType !== 1 /* SessionType.Temporary */;
}
exports.header = new Header();
