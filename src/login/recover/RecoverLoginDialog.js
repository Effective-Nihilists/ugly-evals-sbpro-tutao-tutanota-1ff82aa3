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
exports.show = void 0;
var mithril_1 = require("mithril");
var stream_1 = require("mithril/stream");
var RestError_1 = require("../../api/common/error/RestError");
var ProgressDialog_1 = require("../../gui/dialogs/ProgressDialog");
var FormatValidator_1 = require("../../misc/FormatValidator");
var TextField_js_1 = require("../../gui/base/TextField.js");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var PasswordForm_1 = require("../../settings/PasswordForm");
var Dialog_1 = require("../../gui/base/Dialog");
var HtmlEditor_1 = require("../../gui/editor/HtmlEditor");
var ClientDetector_1 = require("../../misc/ClientDetector");
var CancelledError_1 = require("../../api/common/error/CancelledError");
var MainLocator_1 = require("../../api/main/MainLocator");
var WindowFacade_1 = require("../../misc/WindowFacade");
var Env_1 = require("../../api/common/Env");
var LoginController_js_1 = require("../../api/main/LoginController.js");
var Dropdown_js_1 = require("../../gui/base/Dropdown.js");
var IconButton_js_1 = require("../../gui/base/IconButton.js");
(0, Env_1.assertMainOrNode)();
function show(mailAddress, resetAction) {
    var _this = this;
    var selectedAction = (0, stream_1["default"])(resetAction !== null && resetAction !== void 0 ? resetAction : null);
    var passwordModel = new PasswordForm_1.PasswordModel(LoginController_js_1.logins, { checkOldPassword: false, enforceStrength: true, repeatInput: true });
    var passwordValueStream = (0, stream_1["default"])("");
    var emailAddressStream = (0, stream_1["default"])(mailAddress || "");
    var resetPasswordAction = {
        label: "recoverSetNewPassword_action",
        click: function () { return selectedAction("password"); }
    };
    var resetSecondFactorAction = {
        label: "recoverResetFactors_action",
        click: function () { return selectedAction("secondFactor"); }
    };
    var resetActionClickHandler = (0, Dropdown_js_1.createDropdown)({
        lazyButtons: function () { return [resetPasswordAction, resetSecondFactorAction]; },
        width: 300
    });
    var resetActionButtonAttrs = {
        title: "action_label",
        click: resetActionClickHandler,
        icon: "Edit" /* Icons.Edit */,
        size: 1 /* ButtonSize.Compact */
    };
    var selectedValueLabelStream = selectedAction.map(function (v) {
        if (v === "password") {
            return LanguageViewModel_1.lang.get("recoverSetNewPassword_action");
        }
        else if (v === "secondFactor") {
            return LanguageViewModel_1.lang.get("recoverResetFactors_action");
        }
        else {
            return LanguageViewModel_1.lang.get("choose_label");
        }
    });
    var editor = new HtmlEditor_1.HtmlEditor("recoveryCode_label");
    editor.setMode(HtmlEditor_1.HtmlEditorMode.HTML);
    editor.setHtmlMonospace(true);
    editor.setMinHeight(80);
    editor.showBorders();
    var recoverDialog = Dialog_1.Dialog.showActionDialog({
        title: LanguageViewModel_1.lang.get("recover_label"),
        type: "EditSmall" /* DialogType.EditSmall */,
        child: {
            view: function () {
                return [
                    (0, mithril_1["default"])(TextField_js_1.TextField, {
                        label: "mailAddress_label",
                        value: emailAddressStream(),
                        oninput: emailAddressStream
                    }),
                    (0, mithril_1["default"])(editor),
                    (0, mithril_1["default"])(TextField_js_1.TextField, {
                        label: "action_label",
                        value: selectedValueLabelStream(),
                        oninput: selectedValueLabelStream,
                        injectionsRight: function () { return (0, mithril_1["default"])(IconButton_js_1.IconButton, resetActionButtonAttrs); },
                        disabled: true
                    }),
                    selectedAction() == null
                        ? null
                        : selectedAction() === "password"
                            ? (0, mithril_1["default"])(PasswordForm_1.PasswordForm, { model: passwordModel })
                            : (0, mithril_1["default"])(TextField_js_1.TextField, {
                                label: "password_label",
                                type: "password" /* TextFieldType.Password */,
                                value: passwordValueStream(),
                                oninput: passwordValueStream
                            }),
                ];
            }
        },
        okAction: function () {
            var cleanMailAddress = emailAddressStream().trim().toLowerCase();
            var cleanRecoverCodeValue = editor.getValue().replace(/\s/g, "").toLowerCase();
            if (!(0, FormatValidator_1.isMailAddress)(cleanMailAddress, true)) {
                Dialog_1.Dialog.message("mailAddressInvalid_msg");
            }
            else if (cleanRecoverCodeValue === "") {
                Dialog_1.Dialog.message("recoveryCodeEmpty_msg");
            }
            else if (selectedAction() === "password") {
                var errorMessageId = passwordModel.getErrorMessageId();
                if (errorMessageId) {
                    Dialog_1.Dialog.message(errorMessageId);
                }
                else {
                    (0, ProgressDialog_1.showProgressDialog)("pleaseWait_msg", MainLocator_1.locator.loginFacade.recoverLogin(cleanMailAddress, cleanRecoverCodeValue, passwordModel.getNewPassword(), ClientDetector_1.client.getIdentifier()))
                        .then(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    recoverDialog.close();
                                    return [4 /*yield*/, deleteCredentialsByMailAddress(cleanMailAddress)];
                                case 1:
                                    _a.sent();
                                    WindowFacade_1.windowFacade.reload({});
                                    return [2 /*return*/];
                            }
                        });
                    }); })["catch"](function (e) { return handleError(e); })["finally"](function () { return MainLocator_1.locator.secondFactorHandler.closeWaitingForSecondFactorDialog(); });
                }
            }
            else if (selectedAction() === "secondFactor") {
                var passwordValue = passwordValueStream();
                (0, ProgressDialog_1.showProgressDialog)("pleaseWait_msg", MainLocator_1.locator.loginFacade.resetSecondFactors(cleanMailAddress, passwordValue, cleanRecoverCodeValue))
                    .then(function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                recoverDialog.close();
                                return [4 /*yield*/, deleteCredentialsByMailAddress(cleanMailAddress)];
                            case 1:
                                _a.sent();
                                WindowFacade_1.windowFacade.reload({});
                                return [2 /*return*/];
                        }
                    });
                }); })["catch"](function (e) { return handleError(e); });
            }
        },
        cancelAction: function () {
            return mithril_1["default"].route.set("/login", {
                noAutoLogin: true
            });
        }
    });
    return recoverDialog;
}
exports.show = show;
function deleteCredentialsByMailAddress(cleanMailAddress) {
    return __awaiter(this, void 0, void 0, function () {
        var allCredentials, credentials;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, MainLocator_1.locator.credentialsProvider.getInternalCredentialsInfos()];
                case 1:
                    allCredentials = _a.sent();
                    credentials = allCredentials.find(function (c) { return c.login === cleanMailAddress; });
                    if (!credentials) return [3 /*break*/, 3];
                    return [4 /*yield*/, MainLocator_1.locator.credentialsProvider.deleteByUserId(credentials.userId)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function handleError(e) {
    if (e instanceof RestError_1.NotAuthenticatedError) {
        Dialog_1.Dialog.message("loginFailed_msg");
    }
    else if (e instanceof RestError_1.AccessBlockedError || e instanceof RestError_1.AccessDeactivatedError) {
        Dialog_1.Dialog.message("loginFailedOften_msg");
    }
    else if (e instanceof CancelledError_1.CancelledError) {
        // Thrown when second factor dialog is cancelled
        mithril_1["default"].redraw();
    }
    else if (e instanceof RestError_1.TooManyRequestsError) {
        Dialog_1.Dialog.message("tooManyAttempts_msg");
    }
    else {
        throw e;
    }
}
