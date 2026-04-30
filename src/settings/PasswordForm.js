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
exports.PasswordForm = exports.PasswordModel = void 0;
var mithril_1 = require("mithril");
var TextField_js_1 = require("../gui/base/TextField.js");
var CompletenessIndicator_js_1 = require("../gui/CompletenessIndicator.js");
var PasswordUtils_1 = require("../misc/passwords/PasswordUtils");
var LanguageViewModel_1 = require("../misc/LanguageViewModel");
var StatusField_1 = require("../gui/base/StatusField");
var Env_1 = require("../api/common/Env");
var GroupUtils_js_1 = require("../api/common/utils/GroupUtils.js");
var PasswordGeneratorDialog_1 = require("../misc/passwords/PasswordGeneratorDialog");
var theme_1 = require("../gui/theme");
var size_js_1 = require("../gui/size.js");
var MainLocator_js_1 = require("../api/main/MainLocator.js");
var ToggleButton_js_1 = require("../gui/base/ToggleButton.js");
(0, Env_1.assertMainOrNode)();
var PasswordModel = /** @class */ (function () {
    function PasswordModel(logins, config, mailValid) {
        this.logins = logins;
        this.config = config;
        this.newPassword = "";
        this.oldPassword = "";
        this.repeatedPassword = "";
        this.revealPassword = false;
        this.passwordStrength = this.calculatePasswordStrength();
        this.__mailValid = mailValid;
        this.__signupFreeTest = MainLocator_js_1.locator.usageTestController.getTest("signup.free");
        this.__signupPaidTest = MainLocator_js_1.locator.usageTestController.getTest("signup.paid");
    }
    PasswordModel.prototype._checkBothValidAndSendPing = function () {
        var _a, _b;
        if (this.getNewPasswordStatus().type === "valid" && this.getRepeatedPasswordStatus().type === "valid") {
            // Password entry (both passwords entered and valid)
            // Only the started test's (either free or paid clicked) stage is completed here
            (_a = this.__signupFreeTest) === null || _a === void 0 ? void 0 : _a.getStage(3).complete();
            (_b = this.__signupPaidTest) === null || _b === void 0 ? void 0 : _b.getStage(2).complete();
        }
    };
    PasswordModel.prototype.getNewPassword = function () {
        return this.newPassword;
    };
    PasswordModel.prototype.setNewPassword = function (newPassword) {
        var _a, _b;
        if (this.__mailValid && this.__mailValid()) {
            // Email address selection finished (email address is available and clicked in password field)
            // Only the started test's (either free or paid clicked) stage is completed here
            (_a = this.__signupFreeTest) === null || _a === void 0 ? void 0 : _a.getStage(2).complete();
            (_b = this.__signupPaidTest) === null || _b === void 0 ? void 0 : _b.getStage(1).complete();
        }
        this.newPassword = newPassword;
        this.passwordStrength = this.calculatePasswordStrength();
        this._checkBothValidAndSendPing();
    };
    PasswordModel.prototype.getOldPassword = function () {
        return this.oldPassword;
    };
    PasswordModel.prototype.setOldPassword = function (oldPassword) {
        this.oldPassword = oldPassword;
        this.passwordStrength = this.calculatePasswordStrength();
    };
    PasswordModel.prototype.getRepeatedPassword = function () {
        return this.repeatedPassword;
    };
    PasswordModel.prototype.setRepeatedPassword = function (repeatedPassword) {
        this.repeatedPassword = repeatedPassword;
        this.passwordStrength = this.calculatePasswordStrength();
        this._checkBothValidAndSendPing();
    };
    PasswordModel.prototype.clear = function () {
        this.newPassword = "";
        this.oldPassword = "";
        this.repeatedPassword = "";
        this.passwordStrength = this.calculatePasswordStrength();
    };
    PasswordModel.prototype.getErrorMessageId = function () {
        var _a, _b;
        return ((_b = (_a = this.getErrorFromStatus(this.getOldPasswordStatus())) !== null && _a !== void 0 ? _a : this.getErrorFromStatus(this.getNewPasswordStatus())) !== null && _b !== void 0 ? _b : this.getErrorFromStatus(this.getRepeatedPasswordStatus()));
    };
    PasswordModel.prototype.getOldPasswordStatus = function () {
        if (this.config.checkOldPassword && this.oldPassword === "") {
            return {
                type: "neutral",
                text: "oldPasswordNeutral_msg"
            };
        }
        else {
            return {
                type: "valid",
                text: "emptyString_msg"
            };
        }
    };
    PasswordModel.prototype.getNewPasswordStatus = function () {
        if (this.newPassword === "") {
            return {
                type: "neutral",
                text: "password1Neutral_msg"
            };
        }
        else if (this.config.checkOldPassword && this.oldPassword === this.newPassword) {
            return {
                type: "invalid",
                text: "password1InvalidSame_msg"
            };
        }
        else if (this.isPasswordInsecure()) {
            if (this.config.enforceStrength) {
                return {
                    type: "invalid",
                    text: "password1InvalidUnsecure_msg"
                };
            }
            else {
                return {
                    type: "valid",
                    text: "password1InvalidUnsecure_msg"
                };
            }
        }
        else {
            return {
                type: "valid",
                text: "passwordValid_msg"
            };
        }
    };
    PasswordModel.prototype.getRepeatedPasswordStatus = function () {
        var repeatedPassword = this.repeatedPassword;
        var newPassword = this.newPassword;
        if (this.config.repeatInput && repeatedPassword === "") {
            return {
                type: "neutral",
                text: "password2Neutral_msg"
            };
        }
        else if (this.config.repeatInput && repeatedPassword !== newPassword) {
            return {
                type: "invalid",
                text: "password2Invalid_msg"
            };
        }
        else {
            return {
                type: "valid",
                text: "passwordValid_msg"
            };
        }
    };
    PasswordModel.prototype.isPasswordInsecure = function () {
        return !(0, PasswordUtils_1.isSecurePassword)(this.getPasswordStrength());
    };
    PasswordModel.prototype.getPasswordStrength = function () {
        return this.passwordStrength;
    };
    PasswordModel.prototype.getErrorFromStatus = function (status) {
        if (!status)
            return null;
        return status.type !== "valid" ? status.text : null;
    };
    PasswordModel.prototype.calculatePasswordStrength = function () {
        var reserved = [];
        if (this.logins.isUserLoggedIn()) {
            reserved = (0, GroupUtils_js_1.getEnabledMailAddressesForGroupInfo)(this.logins.getUserController().userGroupInfo)
                .concat(this.logins.getUserController().userGroupInfo.name);
        }
        // 80% strength is minimum. we expand it to 100%, so the password indicator if completely filled when the password is strong enough
        return (0, PasswordUtils_1.getPasswordStrength)(this.newPassword, reserved);
    };
    PasswordModel.prototype.toggleRevealPassword = function () {
        this.revealPassword = !this.revealPassword;
    };
    PasswordModel.prototype.isPasswordRevealed = function () {
        return this.revealPassword;
    };
    return PasswordModel;
}());
exports.PasswordModel = PasswordModel;
/**
 * A form for entering a new password. Optionally it allows to enter the old password for validation and/or to repeat the new password.
 * showChangeOwnPasswordDialog() and showChangeUserPasswordAsAdminDialog() show this form as dialog.
 */
var PasswordForm = /** @class */ (function () {
    function PasswordForm() {
    }
    PasswordForm.prototype.view = function (_a) {
        var _this = this;
        var attrs = _a.attrs;
        return (0, mithril_1["default"])("", {
            onremove: function () { return attrs.model.clear(); }
        }, [
            attrs.model.config.checkOldPassword ?
                (0, mithril_1["default"])(TextField_js_1.TextField, {
                    label: "oldPassword_label",
                    value: attrs.model.getOldPassword(),
                    helpLabel: function () { return (0, mithril_1["default"])(StatusField_1.StatusField, { status: attrs.model.getOldPasswordStatus() }); },
                    oninput: function (input) { return attrs.model.setOldPassword(input); },
                    preventAutofill: true,
                    type: "password" /* TextFieldType.Password */,
                    fontSize: (0, size_js_1.px)(size_js_1.size.font_size_smaller)
                })
                : null,
            (0, mithril_1["default"])(TextField_js_1.TextField, {
                label: "newPassword_label",
                value: attrs.model.getNewPassword(),
                helpLabel: function () { return (0, mithril_1["default"])(".flex.col.mt-xs", [
                    (0, mithril_1["default"])(".flex.items-center", [
                        (0, mithril_1["default"])(".mr-s", (0, mithril_1["default"])(CompletenessIndicator_js_1.CompletenessIndicator, {
                            percentageCompleted: attrs.model.getPasswordStrength()
                        })),
                        (0, mithril_1["default"])(StatusField_1.StatusField, { status: attrs.model.getNewPasswordStatus() }),
                    ]),
                    _this.renderPasswordGeneratorHelp(attrs)
                ]); },
                oninput: function (input) { return attrs.model.setNewPassword(input); },
                type: attrs.model.isPasswordRevealed() ? "text" /* TextFieldType.Text */ : "password" /* TextFieldType.Password */,
                preventAutofill: true,
                fontSize: (0, size_js_1.px)(size_js_1.size.font_size_smaller),
                injectionsRight: function () { return _this.renderRevealIcon(attrs); }
            }),
            attrs.passwordInfoKey ? (0, mithril_1["default"])(".small.mt-xs", LanguageViewModel_1.lang.get(attrs.passwordInfoKey)) : null,
            attrs.model.config.repeatInput
                ? (0, mithril_1["default"])(TextField_js_1.TextField, {
                    label: "repeatedPassword_label",
                    value: attrs.model.getRepeatedPassword(),
                    helpLabel: function () {
                        return (0, mithril_1["default"])(StatusField_1.StatusField, {
                            status: attrs.model.getRepeatedPasswordStatus()
                        });
                    },
                    oninput: function (input) { return attrs.model.setRepeatedPassword(input); },
                    type: "password" /* TextFieldType.Password */
                })
                : null,
        ]);
    };
    PasswordForm.prototype.renderPasswordGeneratorHelp = function (attrs) {
        var _this = this;
        return (0, mithril_1["default"])("", [
            (0, mithril_1["default"])(".b.mr-xs.hover.click.darkest-hover.mt-xs", {
                style: { display: "inline-block", color: theme_1.theme.navigation_button_selected },
                onclick: function () { return __awaiter(_this, void 0, void 0, function () {
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _b = (_a = attrs.model).setNewPassword;
                                return [4 /*yield*/, (0, PasswordGeneratorDialog_1.showPasswordGeneratorDialog)()];
                            case 1:
                                _b.apply(_a, [_c.sent()]);
                                mithril_1["default"].redraw();
                                return [2 /*return*/];
                        }
                    });
                }); }
            }, LanguageViewModel_1.lang.get("generatePassphrase_action")),
        ]);
    };
    PasswordForm.prototype.renderRevealIcon = function (attrs) {
        return (0, mithril_1["default"])(ToggleButton_js_1.ToggleButton, {
            title: attrs.model.isPasswordRevealed() ? "concealPassword_action" : "revealPassword_action",
            toggled: attrs.model.isPasswordRevealed(),
            onToggled: function (_, e) {
                attrs.model.toggleRevealPassword();
                e.stopPropagation();
            },
            icon: attrs.model.isPasswordRevealed() ? "NoEye" /* Icons.NoEye */ : "Eye" /* Icons.Eye */,
            size: 1 /* ButtonSize.Compact */
        });
    };
    return PasswordForm;
}());
exports.PasswordForm = PasswordForm;
