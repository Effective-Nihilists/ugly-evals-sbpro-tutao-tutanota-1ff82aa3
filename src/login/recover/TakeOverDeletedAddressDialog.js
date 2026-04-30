"use strict";
exports.__esModule = true;
exports.showTakeOverDialog = void 0;
var mithril_1 = require("mithril");
var stream_1 = require("mithril/stream");
var RestError_1 = require("../../api/common/error/RestError");
var ProgressDialog_1 = require("../../gui/dialogs/ProgressDialog");
var FormatValidator_1 = require("../../misc/FormatValidator");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var TextField_js_1 = require("../../gui/base/TextField.js");
var Dialog_1 = require("../../gui/base/Dialog");
var HtmlEditor_1 = require("../../gui/editor/HtmlEditor");
var MainLocator_1 = require("../../api/main/MainLocator");
var Env_1 = require("../../api/common/Env");
(0, Env_1.assertMainOrNode)();
function showTakeOverDialog(mailAddress, password) {
    var targetAccountAddress = (0, stream_1["default"])("");
    var editor = new HtmlEditor_1.HtmlEditor("recoveryCode_label");
    editor.setMode(HtmlEditor_1.HtmlEditorMode.HTML);
    editor.setHtmlMonospace(true);
    editor.setMinHeight(80);
    editor.showBorders();
    var takeoverDialog = Dialog_1.Dialog.showActionDialog({
        title: LanguageViewModel_1.lang.get("help_label"),
        type: "EditSmall" /* DialogType.EditSmall */,
        child: {
            view: function () {
                return [
                    (0, mithril_1["default"])(".mt", LanguageViewModel_1.lang.get("takeOverUnusedAddress_msg")),
                    (0, mithril_1["default"])("span", [
                        LanguageViewModel_1.lang.get("moreInfo_msg") + " ",
                        (0, mithril_1["default"])("a", {
                            href: "https://tutanota.com/faq/#inactive-accounts",
                            target: "_blank"
                        }, "https://tutanota.com/faq/#inactive-accounts"),
                    ]),
                    (0, mithril_1["default"])(TextField_js_1.TextField, {
                        label: "targetAddress_label",
                        value: targetAccountAddress(),
                        oninput: targetAccountAddress
                    }),
                    (0, mithril_1["default"])(editor),
                ];
            }
        },
        okAction: function () {
            var cleanTargetAccountAddress = targetAccountAddress().trim().toLowerCase();
            var cleanMailAddress = mailAddress.trim().toLowerCase();
            var cleanRecoveryCode = editor.getValue().replace(/\s/g, "").toLowerCase();
            if (!(0, FormatValidator_1.isMailAddress)(cleanMailAddress, true)) {
                Dialog_1.Dialog.message("mailAddressInvalid_msg");
            }
            else if (!(0, FormatValidator_1.isMailAddress)(cleanTargetAccountAddress, true)) {
                Dialog_1.Dialog.message("mailAddressInvalid_msg");
            }
            else {
                (0, ProgressDialog_1.showProgressDialog)("pleaseWait_msg", MainLocator_1.locator.loginFacade.takeOverDeletedAddress(cleanMailAddress, password, cleanRecoveryCode, cleanTargetAccountAddress))
                    .then(function () { return Dialog_1.Dialog.message("takeoverSuccess_msg"); })
                    .then(function () {
                    takeoverDialog.close();
                    mithril_1["default"].route.set("/login", {
                        loginWith: cleanTargetAccountAddress,
                        noAutoLogin: true
                    });
                })["catch"](function (e) { return handleError(e); });
            }
        },
        cancelAction: function () { return mithril_1["default"].route.set("/login", {
            noAutoLogin: true
        }); }
    });
    return takeoverDialog;
}
exports.showTakeOverDialog = showTakeOverDialog;
function handleError(e) {
    if (e instanceof RestError_1.NotAuthenticatedError) {
        Dialog_1.Dialog.message("loginFailed_msg");
    }
    else if (e instanceof RestError_1.AccessBlockedError || e instanceof RestError_1.AccessDeactivatedError) {
        Dialog_1.Dialog.message("loginFailedOften_msg");
    }
    else if (e instanceof RestError_1.InvalidDataError) {
        Dialog_1.Dialog.message("takeoverAccountInvalid_msg");
    }
    else if (e instanceof RestError_1.TooManyRequestsError) {
        Dialog_1.Dialog.message("tooManyAttempts_msg");
    }
    else {
        throw e;
    }
}
