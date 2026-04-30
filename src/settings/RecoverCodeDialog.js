"use strict";
exports.__esModule = true;
exports.RecoverCodeField = exports.showRecoverCodeDialog = exports.showRecoverCodeDialogAfterPasswordVerification = void 0;
var LanguageViewModel_1 = require("../misc/LanguageViewModel");
var Dialog_1 = require("../gui/base/Dialog");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var mithril_1 = require("mithril");
var Env_1 = require("../api/common/Env");
var ClipboardUtils_1 = require("../misc/ClipboardUtils");
var Button_js_1 = require("../gui/base/Button.js");
var RestError_1 = require("../api/common/error/RestError");
var MainLocator_1 = require("../api/main/MainLocator");
(0, Env_1.assertMainOrNode)();
function showRecoverCodeDialogAfterPasswordVerification(action, showMessage) {
    if (showMessage === void 0) { showMessage = true; }
    var userManagementFacade = MainLocator_1.locator.userManagementFacade;
    var dialog = Dialog_1.Dialog.showRequestPasswordDialog({
        action: function (pw) {
            return (action === "get" ? userManagementFacade.getRecoverCode(pw) : userManagementFacade.createRecoveryCode(pw))
                .then(function (recoverCode) {
                dialog.close();
                showRecoverCodeDialog(recoverCode, showMessage);
                return "";
            })["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotAuthenticatedError, function () { return LanguageViewModel_1.lang.get("invalidPassword_msg"); }))["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.AccessBlockedError, function () { return LanguageViewModel_1.lang.get("tooManyAttempts_msg"); }));
        },
        cancel: {
            textId: "cancel_action",
            action: tutanota_utils_1.noOp
        }
    });
}
exports.showRecoverCodeDialogAfterPasswordVerification = showRecoverCodeDialogAfterPasswordVerification;
function showRecoverCodeDialog(recoverCode, showMessage) {
    return new Promise(function (resolve) {
        Dialog_1.Dialog.showActionDialog({
            title: LanguageViewModel_1.lang.get("recoveryCode_label"),
            child: {
                view: function () {
                    return (0, mithril_1["default"])(RecoverCodeField, {
                        showMessage: showMessage,
                        recoverCode: recoverCode
                    });
                }
            },
            allowCancel: false,
            allowOkWithReturn: true,
            okAction: function (dialog) {
                dialog.close();
                resolve();
            },
            type: "EditMedium" /* DialogType.EditMedium */
        });
    });
}
exports.showRecoverCodeDialog = showRecoverCodeDialog;
var RecoverCodeField = /** @class */ (function () {
    function RecoverCodeField() {
    }
    RecoverCodeField.prototype.view = function (vnode) {
        var lnk = "https://tutanota.com/faq#reset" /* InfoLink.RecoverCode */;
        return [
            vnode.attrs.showMessage
                ? (0, mithril_1["default"])(".pt.pb", [
                    LanguageViewModel_1.lang.get("recoveryCode_msg"),
                    (0, mithril_1["default"])("", [(0, mithril_1["default"])("small", LanguageViewModel_1.lang.get("moreInfo_msg") + " "), (0, mithril_1["default"])("small.text-break", [(0, mithril_1["default"])("a[href=".concat(lnk, "][target=_blank]"), lnk)])]),
                ])
                : (0, mithril_1["default"])("", LanguageViewModel_1.lang.get("emptyString_msg")),
            (0, mithril_1["default"])(".text-break.monospace.selectable.flex.flex-wrap.border.pt.pb.plr", (0, tutanota_utils_1.neverNull)(vnode.attrs.recoverCode.match(/.{4}/g)).map(function (el, i) { return (0, mithril_1["default"])("span.pr-s.no-wrap" + (i % 2 === 0 ? "" : ""), el); })),
            (0, mithril_1["default"])(".flex.flex-end.mt-m", [
                (0, mithril_1["default"])(Button_js_1.Button, {
                    label: "copy_action",
                    icon: function () { return "Clipboard" /* Icons.Clipboard */; },
                    click: function () { return (0, ClipboardUtils_1.copyToClipboard)(vnode.attrs.recoverCode); }
                }),
                (0, Env_1.isApp)() || typeof window.print !== "function"
                    ? null
                    : (0, mithril_1["default"])(Button_js_1.Button, {
                        label: "print_action",
                        icon: function () { return "Print" /* Icons.Print */; },
                        click: function () { return window.print(); }
                    }),
            ]),
        ];
    };
    return RecoverCodeField;
}());
exports.RecoverCodeField = RecoverCodeField;
