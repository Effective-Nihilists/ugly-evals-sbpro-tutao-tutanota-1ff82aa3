"use strict";
exports.__esModule = true;
exports.SecondFactorAuthView = void 0;
var mithril_1 = require("mithril");
var LanguageViewModel_1 = require("../LanguageViewModel");
var Button_js_1 = require("../../gui/base/Button.js");
var Icon_1 = require("../../gui/base/Icon");
var Icons_1 = require("../../gui/base/icons/Icons");
var theme_1 = require("../../gui/theme");
var TextField_js_1 = require("../../gui/base/TextField.js");
/** Displays options for second factor authentication. */
var SecondFactorAuthView = /** @class */ (function () {
    function SecondFactorAuthView() {
    }
    SecondFactorAuthView.prototype.view = function (vnode) {
        var _a;
        var attrs = vnode.attrs;
        return (0, mithril_1["default"])(".flex.col", [
            (0, mithril_1["default"])("p.center", [LanguageViewModel_1.lang.get(((_a = attrs.webauthn) === null || _a === void 0 ? void 0 : _a.canLogin) || attrs.otp ? "secondFactorPending_msg" : "secondFactorPendingOtherClientOnly_msg")]),
            this.renderWebauthn(vnode.attrs),
            this._renderOtp(vnode.attrs),
            this._renderRecover(vnode.attrs),
        ]);
    };
    SecondFactorAuthView.prototype._renderOtp = function (attrs) {
        var otp = attrs.otp;
        if (!otp) {
            return null;
        }
        return (0, mithril_1["default"])(".left.mb", (0, mithril_1["default"])(TextField_js_1.TextField, {
            label: "totpCode_label",
            value: otp.codeFieldValue,
            oninput: function (value) { return otp.onValueChanged(value.trim()); },
            injectionsRight: function () { return (otp.inProgress ? (0, mithril_1["default"])(".mr-s", (0, Icon_1.progressIcon)()) : null); }
        }));
    };
    SecondFactorAuthView.prototype.renderWebauthn = function (attrs) {
        var webauthn = attrs.webauthn;
        if (!webauthn) {
            return null;
        }
        if (webauthn.canLogin) {
            return this.renderWebauthnLogin(webauthn);
        }
        else {
            return this._renderOtherDomainLogin(webauthn);
        }
    };
    SecondFactorAuthView.prototype.renderWebauthnLogin = function (webauthn) {
        var items;
        var state = webauthn.state;
        var doWebauthnButtonAttrs = {
            label: "useSecurityKey_action",
            click: function () { return webauthn.doWebauthn(); },
            type: "login" /* ButtonType.Login */
        };
        switch (state.state) {
            case "init":
                items = [
                    (0, mithril_1["default"])(".align-self-center", (0, mithril_1["default"])(Button_js_1.Button, doWebauthnButtonAttrs)),
                ];
                break;
            case "progress":
                items = [(0, mithril_1["default"])(".flex.justify-center", [(0, mithril_1["default"])(".mr-s", (0, Icon_1.progressIcon)()), (0, mithril_1["default"])("", LanguageViewModel_1.lang.get("waitingForU2f_msg"))])];
                break;
            case "error":
                items = [
                    (0, mithril_1["default"])(".flex.col.items-center", [
                        (0, mithril_1["default"])(".flex.items-center", [
                            (0, mithril_1["default"])(".mr-s", (0, mithril_1["default"])(Icon_1.Icon, {
                                icon: "Cancel" /* Icons.Cancel */,
                                large: true,
                                style: {
                                    fill: theme_1.theme.content_accent
                                }
                            })),
                            (0, mithril_1["default"])("", LanguageViewModel_1.lang.get(state.error)),
                        ]),
                        (0, mithril_1["default"])(Button_js_1.Button, doWebauthnButtonAttrs),
                    ]),
                ];
                break;
            default:
                throw new Error();
        }
        return [(0, mithril_1["default"])(".flex-center", (0, mithril_1["default"])("img", { src: Icons_1.SecondFactorImage })), (0, mithril_1["default"])(".mt.flex.col", items)];
    };
    SecondFactorAuthView.prototype._renderOtherDomainLogin = function (attrs) {
        var href = "https://".concat(attrs.otherLoginDomain);
        return (0, mithril_1["default"])("a", {
            href: href
        }, LanguageViewModel_1.lang.get("differentSecurityKeyDomain_msg", {
            "{domain}": href
        }));
    };
    SecondFactorAuthView.prototype._renderRecover = function (attrs) {
        var onRecover = attrs.onRecover;
        if (onRecover == null) {
            return null;
        }
        return (0, mithril_1["default"])(".small.text-center.pt-m", [
            (0, mithril_1["default"])("a[href=#]", {
                onclick: function (e) {
                    onRecover();
                    e.preventDefault();
                }
            }, LanguageViewModel_1.lang.get("recoverAccountAccess_action")),
        ]);
    };
    return SecondFactorAuthView;
}());
exports.SecondFactorAuthView = SecondFactorAuthView;
