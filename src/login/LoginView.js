"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.renderInfoLinks = exports.getPrivacyStatementLink = exports.getImprintLink = exports.getWhitelabelRegistrationDomains = exports.LoginView = void 0;
var mithril_1 = require("mithril");
var ClientDetector_1 = require("../misc/ClientDetector");
var Env_1 = require("../api/common/Env");
var LanguageViewModel_1 = require("../misc/LanguageViewModel");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Expander_1 = require("../gui/base/Expander");
var ProgressDialog_1 = require("../gui/dialogs/ProgressDialog");
var WindowFacade_1 = require("../misc/WindowFacade");
var Button_js_1 = require("../gui/base/Button.js");
var Header_js_1 = require("../gui/Header.js");
var AriaUtils_1 = require("../gui/AriaUtils");
var LoginForm_1 = require("./LoginForm");
var CredentialsSelector_1 = require("./CredentialsSelector");
var WhitelabelCustomizations_1 = require("../misc/WhitelabelCustomizations");
var theme_1 = require("../gui/theme");
var Dropdown_js_1 = require("../gui/base/Dropdown.js");
var IconButton_js_1 = require("../gui/base/IconButton.js");
var LoginLogDialog_js_1 = require("./LoginLogDialog.js");
var BaseTopLevelView_js_1 = require("../gui/BaseTopLevelView.js");
(0, Env_1.assertMainOrNode)();
var LoginView = /** @class */ (function (_super) {
    __extends(LoginView, _super);
    function LoginView(_a) {
        var attrs = _a.attrs;
        var _this = _super.call(this) || this;
        _this.bottomMargin = 0;
        _this.keyboardListener = function (keyboardSize) {
            _this.bottomMargin = keyboardSize;
            mithril_1["default"].redraw();
        };
        _this.defaultRedirect = attrs.targetPath;
        _this.selectedRedirect = _this.defaultRedirect;
        _this.loginForm = (0, tutanota_utils_1.defer)();
        _this.moreExpanded = false;
        _this.viewModel = attrs.makeViewModel();
        _this.initPromise = _this.viewModel.init().then(mithril_1["default"].redraw);
        return _this;
    }
    LoginView.prototype.view = function (_a) {
        var _this = this;
        var attrs = _a.attrs;
        return (0, mithril_1["default"])("#login-view.main-view.flex.col", {
            oncreate: function () { return WindowFacade_1.windowFacade.addKeyboardSizeListener(_this.keyboardListener); },
            onremove: function () { return WindowFacade_1.windowFacade.removeKeyboardSizeListener(_this.keyboardListener); },
            style: {
                marginBottom: this.bottomMargin + "px"
            }
        }, [
            (0, mithril_1["default"])(Header_js_1.header),
            (0, mithril_1["default"])(".flex-grow.flex-center.scroll", (0, mithril_1["default"])(".flex-grow-shrink-auto.max-width-s.pt.plr-l" + (0, AriaUtils_1.landmarkAttrs)("main" /* AriaLandmarks.Main */, LanguageViewModel_1.lang.get("login_label")), {
                oncreate: function (vnode) {
                    vnode.dom.focus();
                },
                style: {
                    // width: workaround for IE11 which does not center the area, otherwise
                    width: ClientDetector_1.client.isDesktopDevice() ? "360px" : null
                }
            }, [
                this.viewModel.displayMode === "credentials" /* DisplayMode.Credentials */ || this.viewModel.displayMode === "deleteCredentials" /* DisplayMode.DeleteCredentials */
                    ? this._renderCredentialsSelector()
                    : this._renderLoginForm(),
                !((0, Env_1.isApp)() || (0, Env_1.isDesktop)()) && (0, Env_1.isTutanotaDomain)() ? this._renderAppButtons() : null,
                this._anyMoreItemVisible() ? this._renderOptionsExpander() : null,
                renderInfoLinks(),
            ])),
        ]);
    };
    LoginView.prototype._renderOptionsExpander = function () {
        var _this = this;
        return [
            (0, mithril_1["default"])(".flex-center.pt-l", (0, mithril_1["default"])(Expander_1.ExpanderButton, {
                label: "more_label",
                expanded: this.moreExpanded,
                onExpandedChange: function (v) { return _this.moreExpanded = v; }
            })),
            (0, mithril_1["default"])(Expander_1.ExpanderPanel, {
                expanded: this.moreExpanded
            }, [
                (0, mithril_1["default"])(".flex-center.flex-column", [
                    this._loginAnotherLinkVisible()
                        ? (0, mithril_1["default"])(Button_js_1.Button, {
                            label: "loginOtherAccount_action",
                            type: "secondary" /* ButtonType.Secondary */,
                            click: function () {
                                _this.viewModel.showLoginForm();
                            }
                        })
                        : null,
                    this._deleteCredentialsLinkVisible()
                        ? (0, mithril_1["default"])(Button_js_1.Button, {
                            label: this.viewModel.displayMode === "deleteCredentials" /* DisplayMode.DeleteCredentials */ ? "cancel_action" : "deleteCredentials_action",
                            type: "secondary" /* ButtonType.Secondary */,
                            click: function () { return _this._switchDeleteCredentialsState(); }
                        })
                        : null,
                    this._knownCredentialsLinkVisible()
                        ? (0, mithril_1["default"])(Button_js_1.Button, {
                            label: "knownCredentials_label",
                            type: "secondary" /* ButtonType.Secondary */,
                            click: function () { return _this.viewModel.showCredentials(); }
                        })
                        : null,
                    this._signupLinkVisible()
                        ? (0, mithril_1["default"])(Button_js_1.Button, {
                            label: "register_label",
                            type: "secondary" /* ButtonType.Secondary */,
                            click: function () { return mithril_1["default"].route.set("/signup"); }
                        })
                        : null,
                    this._switchThemeLinkVisible()
                        ? (0, mithril_1["default"])(Button_js_1.Button, {
                            label: "switchColorTheme_action",
                            type: "secondary" /* ButtonType.Secondary */,
                            click: this.themeSwitchListener()
                        })
                        : null,
                    this._recoverLoginVisible()
                        ? (0, mithril_1["default"])(Button_js_1.Button, {
                            label: "recoverAccountAccess_action",
                            click: function () {
                                mithril_1["default"].route.set("/recover");
                            },
                            type: "secondary" /* ButtonType.Secondary */
                        })
                        : null,
                ]),
            ]),
        ];
    };
    LoginView.prototype.themeSwitchListener = function () {
        var _this = this;
        return (0, Dropdown_js_1.createAsyncDropdown)({
            lazyButtons: function () { return __awaiter(_this, void 0, void 0, function () {
                var defaultButtons, customButtons;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            defaultButtons = [
                                {
                                    label: "light_label",
                                    click: function () { return theme_1.themeController.setThemeId("light"); }
                                },
                                {
                                    label: "dark_label",
                                    click: function () { return theme_1.themeController.setThemeId("dark"); }
                                },
                                {
                                    label: "blue_label",
                                    click: function () { return theme_1.themeController.setThemeId("blue"); }
                                },
                            ];
                            return [4 /*yield*/, theme_1.themeController.getCustomThemes()];
                        case 1:
                            customButtons = (_a.sent()).map(function (themeId) {
                                return {
                                    label: function () { return themeId; },
                                    click: function () { return theme_1.themeController.setThemeId(themeId); }
                                };
                            });
                            return [2 /*return*/, defaultButtons.concat(customButtons)];
                    }
                });
            }); }, width: 300
        });
    };
    LoginView.prototype._signupLinkVisible = function () {
        return this.viewModel.displayMode === "form" /* DisplayMode.Form */ && ((0, Env_1.isTutanotaDomain)() || getWhitelabelRegistrationDomains().length > 0);
    };
    LoginView.prototype._loginAnotherLinkVisible = function () {
        return this.viewModel.displayMode === "credentials" /* DisplayMode.Credentials */ || this.viewModel.displayMode === "deleteCredentials" /* DisplayMode.DeleteCredentials */;
    };
    LoginView.prototype._deleteCredentialsLinkVisible = function () {
        return this.viewModel.displayMode === "credentials" /* DisplayMode.Credentials */ || this.viewModel.displayMode === "deleteCredentials" /* DisplayMode.DeleteCredentials */;
    };
    LoginView.prototype._knownCredentialsLinkVisible = function () {
        return this.viewModel.displayMode === "form" /* DisplayMode.Form */ && this.viewModel.getSavedCredentials().length > 0;
    };
    LoginView.prototype._switchThemeLinkVisible = function () {
        return theme_1.themeController.shouldAllowChangingTheme();
    };
    LoginView.prototype._recoverLoginVisible = function () {
        return (0, Env_1.isTutanotaDomain)();
    };
    LoginView.prototype._anyMoreItemVisible = function () {
        return (this._signupLinkVisible() ||
            this._loginAnotherLinkVisible() ||
            this._deleteCredentialsLinkVisible() ||
            this._knownCredentialsLinkVisible() ||
            this._switchThemeLinkVisible() ||
            this._recoverLoginVisible());
    };
    LoginView.prototype._renderLoginForm = function () {
        var _this = this;
        return (0, mithril_1["default"])("", {
            oncreate: function (vnode) {
                var children = vnode.children;
                var firstChild = children[0];
                _this.loginForm.resolve(firstChild.state);
            }
        }, (0, mithril_1["default"])(LoginForm_1.LoginForm, {
            onSubmit: function () { return _this._loginWithProgressDialog(); },
            mailAddress: this.viewModel.mailAddress,
            password: this.viewModel.password,
            savePassword: this.viewModel.savePassword,
            helpText: LanguageViewModel_1.lang.getMaybeLazy(this.viewModel.helpText),
            invalidCredentials: this.viewModel.state === "InvalidCredentials" /* LoginState.InvalidCredentials */,
            showRecoveryOption: this._recoverLoginVisible(),
            accessExpired: this.viewModel.state === "AccessExpired" /* LoginState.AccessExpired */
        }));
    };
    LoginView.prototype._loginWithProgressDialog = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, ProgressDialog_1.showProgressDialog)("login_msg", this.viewModel.login())];
                    case 1:
                        _a.sent();
                        mithril_1["default"].redraw();
                        if (this.viewModel.state === "LoggedIn" /* LoginState.LoggedIn */) {
                            mithril_1["default"].route.set(this.selectedRedirect);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginView.prototype._renderCredentialsSelector = function () {
        var _this = this;
        return [
            (0, mithril_1["default"])(".small.center.statusTextColor.pt" + (0, AriaUtils_1.liveDataAttrs)(), LanguageViewModel_1.lang.getMaybeLazy(this.viewModel.helpText)),
            (0, mithril_1["default"])(CredentialsSelector_1.CredentialsSelector, {
                credentials: this.viewModel.getSavedCredentials(),
                onCredentialsSelected: function (c) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.viewModel.useCredentials(c)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, this._loginWithProgressDialog()];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); },
                onCredentialsDeleted: this.viewModel.displayMode === "deleteCredentials" /* DisplayMode.DeleteCredentials */
                    ? function (credentials) {
                        _this.viewModel.deleteCredentials(credentials).then(function () { return mithril_1["default"].redraw(); });
                    }
                    : null
            }),
        ];
    };
    LoginView.prototype._renderAppButtons = function () {
        var _this = this;
        return (0, mithril_1["default"])(".flex-center.pt-l.ml-between-s", [
            ClientDetector_1.client.isDesktopDevice() || ClientDetector_1.client.device === "Android" /* DeviceType.ANDROID */
                ? (0, mithril_1["default"])(IconButton_js_1.IconButton, {
                    title: "appInfoAndroidImageAlt_alt",
                    click: function (e) {
                        _this._openUrl("https://play.google.com/store/apps/details?id=de.tutao.tutanota");
                        e.preventDefault();
                    },
                    icon: "Android" /* BootIcons.Android */
                })
                : null,
            ClientDetector_1.client.isDesktopDevice() || ClientDetector_1.client.device === "iPad" /* DeviceType.IPAD */ || ClientDetector_1.client.device === "iPhone" /* DeviceType.IPHONE */
                ? (0, mithril_1["default"])(IconButton_js_1.IconButton, {
                    title: "appInfoIosImageAlt_alt",
                    click: function (e) {
                        _this._openUrl("https://itunes.apple.com/app/tutanota/id922429609?mt=8&uo=4&at=10lSfb");
                        e.preventDefault();
                    },
                    icon: "Apple" /* BootIcons.Apple */
                })
                : null,
            ClientDetector_1.client.isDesktopDevice() || ClientDetector_1.client.device === "Android" /* DeviceType.ANDROID */
                ? (0, mithril_1["default"])(IconButton_js_1.IconButton, {
                    title: "appInfoFDroidImageAlt_alt",
                    click: function (e) {
                        _this._openUrl("https://f-droid.org/packages/de.tutao.tutanota/");
                        e.preventDefault();
                    },
                    icon: "FDroid" /* BootIcons.FDroid */
                })
                : null,
        ]);
    };
    LoginView.prototype.onNewUrl = function (args, requestedPath) {
        if (args.requestedPath) {
            this.selectedRedirect = args.requestedPath;
        }
        else if (args.action) {
            // Action needs be forwarded this way in order to be able to deal with cases where a user is not logged in and clicks
            // on the support link on our website (https://mail.tutanota.com?action=supportMail)
            this.selectedRedirect = "/mail?action=".concat(args.action);
        }
        else {
            this.selectedRedirect = this.defaultRedirect;
        }
        this.handleLoginArguments(args, requestedPath);
    };
    LoginView.prototype.handleLoginArguments = function (args, requestedPath) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var autoLogin;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.initPromise
                        // since we wait for something async here the URL might have already changed and
                        // we shouldn't handle any outdated URL changes.
                    ];
                    case 1:
                        _b.sent();
                        // since we wait for something async here the URL might have already changed and
                        // we shouldn't handle any outdated URL changes.
                        if (mithril_1["default"].route.get() !== requestedPath)
                            return [2 /*return*/];
                        autoLogin = args.noAutoLogin == null || args.noAutoLogin === false;
                        if (!autoLogin) return [3 /*break*/, 4];
                        if (!args.userId) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.viewModel.useUserId(args.userId)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        if (this.viewModel.canLogin()) {
                            this._loginWithProgressDialog();
                            mithril_1["default"].redraw();
                            return [2 /*return*/];
                        }
                        _b.label = 4;
                    case 4:
                        if (args.loginWith) {
                            this.viewModel.showLoginForm();
                        }
                        this.viewModel.mailAddress((_a = args.loginWith) !== null && _a !== void 0 ? _a : "");
                        this.viewModel.password("");
                        // We want to focus password field if login field is already filled in
                        if (args.loginWith) {
                            this.loginForm.promise.then(function (loginForm) {
                                loginForm.passwordTextField.domInput.focus();
                            });
                        }
                        mithril_1["default"].redraw();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginView.prototype._openUrl = function (url) {
        window.open(url, "_blank");
    };
    LoginView.prototype._switchDeleteCredentialsState = function () {
        this.viewModel.switchDeleteState();
    };
    return LoginView;
}(BaseTopLevelView_js_1.BaseTopLevelView));
exports.LoginView = LoginView;
function getWhitelabelRegistrationDomains() {
    return (0, tutanota_utils_1.mapNullable)((0, WhitelabelCustomizations_1.getWhitelabelCustomizations)(window), function (c) { return c.registrationDomains; }) || [];
}
exports.getWhitelabelRegistrationDomains = getWhitelabelRegistrationDomains;
function getImprintLink() {
    return (0, tutanota_utils_1.mapNullable)((0, WhitelabelCustomizations_1.getWhitelabelCustomizations)(window), function (c) { return c.imprintUrl; }) || "https://tutanota.com/imprint" /* InfoLink.About */;
}
exports.getImprintLink = getImprintLink;
function getPrivacyStatementLink() {
    return (0, tutanota_utils_1.mapNullable)((0, WhitelabelCustomizations_1.getWhitelabelCustomizations)(window), function (c) { return c.privacyStatementUrl; }) || "https://tutanota.com/privacy-policy" /* InfoLink.Privacy */;
}
exports.getPrivacyStatementLink = getPrivacyStatementLink;
function renderInfoLinks() {
    return (0, mithril_1["default"])("div.center.flex.flex-grow.items-end.justify-center.mb-l.mt-xl.wrap", [
        !(0, Env_1.isApp)() && getPrivacyStatementLink()
            ? (0, mithril_1["default"])("a.plr", {
                href: getPrivacyStatementLink(),
                target: "_blank"
            }, LanguageViewModel_1.lang.get("privacyLink_label"))
            : null,
        !(0, Env_1.isApp)() && getImprintLink()
            ? (0, mithril_1["default"])("a.plr", {
                href: getImprintLink(),
                target: "_blank"
            }, LanguageViewModel_1.lang.get("imprint_label"))
            : null,
        (0, mithril_1["default"])(".mt.mb.center.small.full-width", {
            onclick: function (e) { return showVersionDropdown(e); }
        }, "v".concat(env.versionNumber)),
    ]);
}
exports.renderInfoLinks = renderInfoLinks;
function showVersionDropdown(e) {
    // A semi-hidden option to get the logs before logging in, in a text form
    (0, Dropdown_js_1.createDropdown)({
        lazyButtons: function () { return [{
                label: function () { return "Get logs"; },
                click: function () { return (0, LoginLogDialog_js_1.showLogsDialog)(); }
            }]; }
    })(e, e.target);
}
