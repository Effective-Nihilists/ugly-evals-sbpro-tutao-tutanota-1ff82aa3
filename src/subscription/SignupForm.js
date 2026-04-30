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
exports.SignupForm = void 0;
var mithril_1 = require("mithril");
var stream_1 = require("mithril/stream");
var Dialog_1 = require("../gui/base/Dialog");
var TextField_js_1 = require("../gui/base/TextField.js");
var Button_js_1 = require("../gui/base/Button.js");
var LoginView_1 = require("../login/LoginView");
var SelectMailAddressForm_1 = require("../settings/SelectMailAddressForm");
var Env_1 = require("../api/common/Env");
var TutanotaConstants_1 = require("../api/common/TutanotaConstants");
var PasswordForm_1 = require("../settings/PasswordForm");
var Checkbox_js_1 = require("../gui/base/Checkbox.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var LanguageViewModel_1 = require("../misc/LanguageViewModel");
var ProgressDialog_1 = require("../gui/dialogs/ProgressDialog");
var RestError_1 = require("../api/common/error/RestError");
var MainLocator_1 = require("../api/main/MainLocator");
var TermsAndConditions_1 = require("./TermsAndConditions");
var LoginController_js_1 = require("../api/main/LoginController.js");
var Captcha_js_1 = require("./Captcha.js");
var SignupForm = /** @class */ (function () {
    function SignupForm() {
        this._mailAddressFormErrorId = null;
        this.__mailValid = (0, stream_1["default"])(false);
        this.passwordModel = new PasswordForm_1.PasswordModel(LoginController_js_1.logins, { checkOldPassword: false, enforceStrength: true, repeatInput: false }, this.__mailValid);
        this.__signupFreeTest = MainLocator_1.locator.usageTestController.getTest("signup.free");
        this.__signupPaidTest = MainLocator_1.locator.usageTestController.getTest("signup.paid");
        this._confirmTerms = (0, stream_1["default"])(false);
        this._confirmAge = (0, stream_1["default"])(false);
        this._code = (0, stream_1["default"])("");
        this._isMailVerificationBusy = false;
        this._mailAddressFormErrorId = "mailAddressNeutral_msg";
    }
    SignupForm.prototype.view = function (vnode) {
        var _this = this;
        var _a;
        var a = vnode.attrs;
        var mailAddressFormAttrs = {
            availableDomains: (0, Env_1.isTutanotaDomain)() ? TutanotaConstants_1.TUTANOTA_MAIL_ADDRESS_DOMAINS : (0, LoginView_1.getWhitelabelRegistrationDomains)(),
            onValidationResult: function (email, validationResult) {
                _this.__mailValid(validationResult.isValid);
                if (validationResult.isValid) {
                    _this._mailAddress = email;
                    _this._mailAddressFormErrorId = null;
                }
                else {
                    _this._mailAddressFormErrorId = validationResult.errorId;
                }
            },
            onBusyStateChanged: function (isBusy) {
                _this._isMailVerificationBusy = isBusy;
            }
        };
        var confirmTermsCheckBoxAttrs = {
            label: renderTermsLabel,
            checked: this._confirmTerms(),
            onChecked: this._confirmTerms
        };
        var confirmAgeCheckBoxAttrs = {
            label: function () { return LanguageViewModel_1.lang.get("ageConfirmation_msg"); },
            checked: this._confirmAge(),
            onChecked: this._confirmAge
        };
        var submit = function () {
            if (_this._isMailVerificationBusy)
                return;
            if (a.readonly) {
                // Email field is read-only, account has already been created but user switched from different subscription.
                _this.__completePreviousStages();
                return a.newSignupHandler(null);
            }
            var errorMessage = _this._mailAddressFormErrorId || _this.passwordModel.getErrorMessageId() || (!_this._confirmTerms() ? "termsAcceptedNeutral_msg" : null);
            if (errorMessage) {
                Dialog_1.Dialog.message(errorMessage);
                return;
            }
            var ageConfirmPromise = _this._confirmAge() ? Promise.resolve(true) : Dialog_1.Dialog.confirm("parentConfirmation_msg", "paymentDataValidation_action");
            ageConfirmPromise.then(function (confirmed) {
                if (confirmed) {
                    _this.__completePreviousStages();
                    return signup(_this._mailAddress, _this.passwordModel.getNewPassword(), _this._code(), a.isBusinessUse(), a.isPaidSubscription(), a.campaign()).then(function (newAccountData) {
                        a.newSignupHandler(newAccountData ? newAccountData : null);
                    });
                }
            });
        };
        return (0, mithril_1["default"])("#signup-account-dialog.flex-center", (0, mithril_1["default"])(".flex-grow-shrink-auto.max-width-m.pt.pb.plr-l", [
            a.readonly
                ? (0, mithril_1["default"])(TextField_js_1.TextField, {
                    label: "mailAddress_label",
                    value: (_a = a.prefilledMailAddress) !== null && _a !== void 0 ? _a : "",
                    disabled: true
                })
                : [
                    (0, mithril_1["default"])(SelectMailAddressForm_1.SelectMailAddressForm, mailAddressFormAttrs),
                    (0, mithril_1["default"])(PasswordForm_1.PasswordForm, {
                        model: this.passwordModel,
                        passwordInfoKey: "passwordImportance_msg"
                    }),
                    (0, LoginView_1.getWhitelabelRegistrationDomains)().length > 0
                        ? (0, mithril_1["default"])(TextField_js_1.TextField, {
                            value: this._code(),
                            oninput: this._code,
                            label: "whitelabelRegistrationCode_label"
                        })
                        : null,
                    (0, mithril_1["default"])(Checkbox_js_1.Checkbox, confirmTermsCheckBoxAttrs),
                    (0, mithril_1["default"])(Checkbox_js_1.Checkbox, confirmAgeCheckBoxAttrs),
                ],
            (0, mithril_1["default"])(".mt-l.mb-l", (0, mithril_1["default"])(Button_js_1.Button, {
                label: "next_action",
                click: submit,
                type: "login" /* ButtonType.Login */
            })),
        ]));
    };
    SignupForm.prototype.__completePreviousStages = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.__signupFreeTest) return [3 /*break*/, 4];
                        // Make sure that the previous two pings (valid email + valid passwords) have been sent in the correct order
                        return [4 /*yield*/, this.__signupFreeTest.getStage(2).complete()];
                    case 1:
                        // Make sure that the previous two pings (valid email + valid passwords) have been sent in the correct order
                        _a.sent();
                        return [4 /*yield*/, this.__signupFreeTest.getStage(3).complete()
                            // Credentials confirmation (click on next)
                        ];
                    case 2:
                        _a.sent();
                        // Credentials confirmation (click on next)
                        return [4 /*yield*/, this.__signupFreeTest.getStage(4).complete()];
                    case 3:
                        // Credentials confirmation (click on next)
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!this.__signupPaidTest) return [3 /*break*/, 8];
                        // Make sure that the previous two pings (valid email + valid passwords) have been sent in the correct order
                        return [4 /*yield*/, this.__signupPaidTest.getStage(1).complete()];
                    case 5:
                        // Make sure that the previous two pings (valid email + valid passwords) have been sent in the correct order
                        _a.sent();
                        return [4 /*yield*/, this.__signupPaidTest.getStage(2).complete()
                            // Credentials confirmation (click on next)
                        ];
                    case 6:
                        _a.sent();
                        // Credentials confirmation (click on next)
                        return [4 /*yield*/, this.__signupPaidTest.getStage(3).complete()];
                    case 7:
                        // Credentials confirmation (click on next)
                        _a.sent();
                        _a.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    return SignupForm;
}());
exports.SignupForm = SignupForm;
function renderTermsLabel() {
    return [
        (0, mithril_1["default"])("div", LanguageViewModel_1.lang.get("termsAndConditions_label")),
        (0, mithril_1["default"])("div", (0, TermsAndConditions_1.renderTermsAndConditionsButton)("terms-entries" /* TermsSection.Terms */, TermsAndConditions_1.CURRENT_TERMS_VERSION)),
        (0, mithril_1["default"])("div", (0, TermsAndConditions_1.renderTermsAndConditionsButton)("privacy-policy-entries" /* TermsSection.Privacy */, TermsAndConditions_1.CURRENT_PRIVACY_VERSION))
    ];
}
/**
 * @return Signs the user up, if no captcha is needed or it has been solved correctly
 */
function signup(mailAddress, pw, registrationCode, isBusinessUse, isPaidSubscription, campaign) {
    var customerFacade = MainLocator_1.locator.customerFacade;
    return (0, ProgressDialog_1.showWorkerProgressDialog)(MainLocator_1.locator.worker, "createAccountRunning_msg", customerFacade.generateSignupKeys().then(function (keyPairs) {
        return (0, Captcha_js_1.runCaptchaFlow)(mailAddress, isBusinessUse, isPaidSubscription, campaign).then(function (regDataId) {
            if (regDataId) {
                return customerFacade.signup(keyPairs, TutanotaConstants_1.AccountType.FREE, regDataId, mailAddress, pw, registrationCode, LanguageViewModel_1.lang.code).then(function (recoverCode) {
                    return {
                        mailAddress: mailAddress,
                        password: pw,
                        recoverCode: recoverCode
                    };
                });
            }
        });
    }))["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.InvalidDataError, function () {
        Dialog_1.Dialog.message("invalidRegistrationCode_msg");
    }));
}
