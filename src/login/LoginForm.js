"use strict";
exports.__esModule = true;
exports.LoginForm = void 0;
var mithril_1 = require("mithril");
var stream_1 = require("mithril/stream");
var Button_js_1 = require("../gui/base/Button.js");
var AriaUtils_1 = require("../gui/AriaUtils");
var LanguageViewModel_1 = require("../misc/LanguageViewModel");
var TextField_js_1 = require("../gui/base/TextField.js");
var Checkbox_js_1 = require("../gui/base/Checkbox.js");
var ClientDetector_1 = require("../misc/ClientDetector");
var WhitelabelCustomizations_1 = require("../misc/WhitelabelCustomizations");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Env_1 = require("../api/common/Env");
var LoginForm = /** @class */ (function () {
    function LoginForm() {
    }
    LoginForm.prototype.oncreate = function (vnode) {
        var _this = this;
        var a = vnode.attrs;
        this.autofillUpdateHandler = stream_1["default"].combine(function () {
            requestAnimationFrame(function () {
                var oldAddress = a.mailAddress();
                var newAddress = _this.mailAddressTextField.domInput.value;
                var oldPassword = a.password();
                var newPassword = _this.passwordTextField.domInput.value;
                // only update values when they are different or we get stuck in an infinite loop
                if (oldAddress !== newAddress)
                    a.mailAddress(newAddress);
                if (oldPassword !== newPassword)
                    a.password(newPassword);
            });
        }, [a.mailAddress, a.password]);
    };
    LoginForm.prototype.onremove = function (vnode) {
        vnode.attrs.password("");
        this.autofillUpdateHandler.end(true);
        this.passwordTextField.domInput.value = "";
    };
    LoginForm.prototype._passwordDisabled = function () {
        var customizations = (0, WhitelabelCustomizations_1.getWhitelabelCustomizations)(window);
        return Boolean(customizations && customizations.bootstrapCustomizations.includes("0" /* BootstrapFeatureType.DisableSavePassword */));
    };
    LoginForm.prototype.view = function (vnode) {
        var _this = this;
        var a = vnode.attrs;
        var canSaveCredentials = !!ClientDetector_1.client.localStorage();
        return (0, mithril_1["default"])("form", {
            onsubmit: function (e) {
                // do not post the form, the form is just here to enable browser auto-fill
                e.preventDefault(); // a.onSubmit(a.mailAddress(), a.password())
            }
        }, [
            (0, mithril_1["default"])("", {
                oncreate: function (vnode) {
                    var childArray = (0, tutanota_utils_1.assertNotNull)(vnode.children);
                    var child = childArray[0];
                    _this.mailAddressTextField = child.state;
                }
            }, (0, mithril_1["default"])(TextField_js_1.TextField, {
                label: "mailAddress_label",
                value: a.mailAddress(),
                oninput: a.mailAddress,
                type: "email" /* TextFieldType.Email */,
                onDomInputCreated: function (dom) {
                    if (!ClientDetector_1.client.isMobileDevice()) {
                        dom.focus(); // have email address auto-focus so the user can immediately type their username (unless on mobile)
                    }
                }
            })),
            (0, mithril_1["default"])("", {
                oncreate: function (vnode) {
                    var childArray = (0, tutanota_utils_1.assertNotNull)(vnode.children);
                    var child = childArray[0];
                    _this.passwordTextField = child.state;
                }
            }, (0, mithril_1["default"])(TextField_js_1.TextField, {
                label: "password_label",
                value: a.password(),
                oninput: a.password,
                type: "password" /* TextFieldType.Password */
            })),
            a.savePassword && !this._passwordDisabled()
                ? (0, mithril_1["default"])(Checkbox_js_1.Checkbox, {
                    label: function () { return LanguageViewModel_1.lang.get("storePassword_action"); },
                    checked: a.savePassword(),
                    onChecked: a.savePassword,
                    helpLabel: (canSaveCredentials)
                        ? function () { return LanguageViewModel_1.lang.get("onlyPrivateComputer_msg") + ((0, Env_1.isOfflineStorageAvailable)() ? "\n" + LanguageViewModel_1.lang.get("dataWillBeStored_msg") : ""); }
                        : "functionNotSupported_msg",
                    disabled: !canSaveCredentials
                })
                : null,
            (0, mithril_1["default"])(".pt", (0, mithril_1["default"])(Button_js_1.Button, {
                label: "login_action",
                click: function () { return a.onSubmit(a.mailAddress(), a.password()); },
                type: "login" /* ButtonType.Login */
            })),
            (0, mithril_1["default"])("p.center.statusTextColor", (0, mithril_1["default"])("small" + (0, AriaUtils_1.liveDataAttrs)(), [
                a.helpText ? a.helpText : null,
                " ",
                a.invalidCredentials && a.showRecoveryOption
                    ? (0, mithril_1["default"])("a", {
                        href: "/recover",
                        onclick: function (e) {
                            mithril_1["default"].route.set("/recover", {
                                mailAddress: a.mailAddress(),
                                resetAction: "password"
                            });
                            e.preventDefault();
                        }
                    }, LanguageViewModel_1.lang.get("recoverAccountAccess_action"))
                    : a.accessExpired && a.accessExpired
                        ? (0, mithril_1["default"])("a", {
                            // We import the dialog directly rather than redirecting to /recover here in order to not pass the password in plaintext via the URL
                            href: "#",
                            onclick: function (e) {
                                Promise.resolve().then(function () { return require("./recover/TakeOverDeletedAddressDialog"); }).then(function (_a) {
                                    var showTakeOverDialog = _a.showTakeOverDialog;
                                    return showTakeOverDialog(a.mailAddress(), a.password());
                                });
                                e.preventDefault();
                            }
                        }, LanguageViewModel_1.lang.get("help_label"))
                        : null,
            ])),
        ]);
    };
    return LoginForm;
}());
exports.LoginForm = LoginForm;
