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
exports.loadRedeemGiftCardWizard = void 0;
var mithril_1 = require("mithril");
var stream_1 = require("mithril/stream");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var WizardDialog_js_1 = require("../../gui/base/WizardDialog.js");
var LoginController_1 = require("../../api/main/LoginController");
var UpgradeSubscriptionWizard_1 = require("../UpgradeSubscriptionWizard");
var Dialog_1 = require("../../gui/base/Dialog");
var LoginForm_1 = require("../../login/LoginForm");
var CredentialsSelector_1 = require("../../login/CredentialsSelector");
var ProgressDialog_1 = require("../../gui/dialogs/ProgressDialog");
var Button_js_1 = require("../../gui/base/Button.js");
var SignupForm_1 = require("../SignupForm");
var UserError_1 = require("../../api/main/UserError");
var ErrorHandlerImpl_1 = require("../../misc/ErrorHandlerImpl");
var TypeRefs_js_1 = require("../../api/entities/sys/TypeRefs.js");
var MainLocator_1 = require("../../api/main/MainLocator");
var GiftCardUtils_1 = require("./GiftCardUtils");
var CancelledError_1 = require("../../api/common/error/CancelledError");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var LoginUtils_1 = require("../../misc/LoginUtils");
var RecoverCodeDialog_1 = require("../../settings/RecoverCodeDialog");
var Icons_1 = require("../../gui/base/icons/Icons");
var TutanotaConstants_1 = require("../../api/common/TutanotaConstants");
var PriceUtils_1 = require("../PriceUtils");
var TextField_js_1 = require("../../gui/base/TextField.js");
var EntityUtils_1 = require("../../api/common/utils/EntityUtils");
var RestError_js_1 = require("../../api/common/error/RestError.js");
var CountryList_js_1 = require("../../api/common/CountryList.js");
var GuiUtils_js_1 = require("../../gui/base/GuiUtils.js");
var RedeemGiftCardModel = /** @class */ (function () {
    function RedeemGiftCardModel(config, giftCardFacade, credentialsProvider, logins, entityClient) {
        this.config = config;
        this.giftCardFacade = giftCardFacade;
        this.credentialsProvider = credentialsProvider;
        this.logins = logins;
        this.entityClient = entityClient;
        this.mailAddress = "";
        this.newAccountData = null;
        this.credentialsMethod = 1 /* GetCredentialsMethod.Signup */;
        // accountingInfo is loaded after the user logs in, before redeeming the gift card
        this.accountingInfo = null;
    }
    Object.defineProperty(RedeemGiftCardModel.prototype, "giftCardInfo", {
        get: function () {
            return this.config.giftCardInfo;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RedeemGiftCardModel.prototype, "giftCardId", {
        get: function () {
            return (0, EntityUtils_1.elementIdPart)(this.giftCardInfo.giftCard);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RedeemGiftCardModel.prototype, "key", {
        get: function () {
            return this.config.key;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RedeemGiftCardModel.prototype, "premiumPrice", {
        get: function () {
            return this.config.premiumPrice;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RedeemGiftCardModel.prototype, "message", {
        get: function () {
            return this.config.giftCardInfo.message;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RedeemGiftCardModel.prototype, "paymentMethod", {
        get: function () {
            var _a, _b;
            return (_b = (_a = this.accountingInfo) === null || _a === void 0 ? void 0 : _a.paymentMethod) !== null && _b !== void 0 ? _b : TutanotaConstants_1.PaymentMethodType.AccountBalance;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RedeemGiftCardModel.prototype, "storedCredentials", {
        get: function () {
            return this.config.storedCredentials;
        },
        enumerable: false,
        configurable: true
    });
    RedeemGiftCardModel.prototype.loginWithStoredCredentials = function (encryptedCredentials) {
        return __awaiter(this, void 0, void 0, function () {
            var credentials;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(LoginController_1.logins.isUserLoggedIn() && (0, EntityUtils_1.isSameId)(LoginController_1.logins.getUserController().user._id, encryptedCredentials.userId))) return [3 /*break*/, 2];
                        // If the user is logged in already (because they selected credentials and then went back) we dont have to do
                        // anything, so just move on
                        return [4 /*yield*/, this.postLogin()];
                    case 1:
                        // If the user is logged in already (because they selected credentials and then went back) we dont have to do
                        // anything, so just move on
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 2: return [4 /*yield*/, this.logins.logout(false)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.credentialsProvider.getCredentialsByUserId(encryptedCredentials.userId)];
                    case 4:
                        credentials = _a.sent();
                        if (!credentials) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.logins.resumeSession(credentials, null, null)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.postLogin()];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    RedeemGiftCardModel.prototype.loginWithFormCredentials = function (mailAddress, password) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.mailAddress = mailAddress;
                        // If they try to login with a mail address that is stored, we want to swap out the old session with a new one
                        return [4 /*yield*/, this.logins.logout(false)];
                    case 1:
                        // If they try to login with a mail address that is stored, we want to swap out the old session with a new one
                        _a.sent();
                        return [4 /*yield*/, this.logins.createSession(mailAddress, password, 1 /* SessionType.Temporary */)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.postLogin()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    RedeemGiftCardModel.prototype.handleNewSignup = function (newAccountData) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, mailAddress, password;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(newAccountData || this.newAccountData)) return [3 /*break*/, 3];
                        // if there's an existing account it means the signup form was readonly
                        // because we came back from the next page after having already signed up
                        if (!this.newAccountData) {
                            this.newAccountData = newAccountData;
                        }
                        _a = (0, tutanota_utils_1.neverNull)(newAccountData || this.newAccountData), mailAddress = _a.mailAddress, password = _a.password;
                        this.mailAddress = mailAddress;
                        return [4 /*yield*/, this.logins.createSession(mailAddress, password, 1 /* SessionType.Temporary */)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.postLogin()];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RedeemGiftCardModel.prototype.postLogin = function () {
        return __awaiter(this, void 0, void 0, function () {
            var customer, customerInfo, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.logins.getUserController().isGlobalAdmin()) {
                            throw new UserError_1.UserError("onlyAccountAdminFeature_msg");
                        }
                        return [4 /*yield*/, this.logins.getUserController().loadCustomer()];
                    case 1:
                        customer = _b.sent();
                        return [4 /*yield*/, this.entityClient.load(TypeRefs_js_1.CustomerInfoTypeRef, customer.customerInfo)];
                    case 2:
                        customerInfo = _b.sent();
                        _a = this;
                        return [4 /*yield*/, this.entityClient.load(TypeRefs_js_1.AccountingInfoTypeRef, customerInfo.accountingInfo)];
                    case 3:
                        _a.accountingInfo = _b.sent();
                        if (customer.businessUse || this.accountingInfo.business) {
                            throw new UserError_1.UserError("onlyPrivateAccountFeature_msg");
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    RedeemGiftCardModel.prototype.redeemGiftCard = function (country) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                if (country == null) {
                    throw new UserError_1.UserError("invoiceCountryInfoBusiness_msg");
                }
                return [2 /*return*/, this.giftCardFacade
                        .redeemGiftCard(this.giftCardId, this.key, (_a = country === null || country === void 0 ? void 0 : country.a) !== null && _a !== void 0 ? _a : null)["catch"]((0, tutanota_utils_1.ofClass)(RestError_js_1.NotFoundError, function () {
                        throw new UserError_1.UserError("invalidGiftCard_msg");
                    }))["catch"]((0, tutanota_utils_1.ofClass)(RestError_js_1.NotAuthorizedError, function (e) {
                        throw new UserError_1.UserError(function () { return e.message; });
                    }))];
            });
        });
    };
    return RedeemGiftCardModel;
}());
/**
 * This page gives the user the option to either signup or login to an account with which to redeem their gift card.
 */
var GiftCardWelcomePage = /** @class */ (function () {
    function GiftCardWelcomePage() {
    }
    GiftCardWelcomePage.prototype.oncreate = function (vnodeDOM) {
        this.dom = vnodeDOM.dom;
    };
    GiftCardWelcomePage.prototype.view = function (vnode) {
        var _this = this;
        var a = vnode.attrs;
        var nextPage = function (method) {
            LoginController_1.logins.logout(false).then(function () {
                a.data.credentialsMethod = method;
                (0, WizardDialog_js_1.emitWizardEvent)(_this.dom, "showNextWizardDialogPage" /* WizardEventType.SHOWNEXTPAGE */);
            });
        };
        return [
            (0, mithril_1["default"])(".flex-center.full-width.pt-l", (0, mithril_1["default"])("", {
                style: {
                    width: "480px"
                }
            }, (0, mithril_1["default"])(".pt-l", (0, GiftCardUtils_1.renderGiftCardSvg)(parseFloat(a.data.giftCardInfo.value), null, a.data.message)))),
            (0, mithril_1["default"])(".flex-center.full-width.pt-l", (0, mithril_1["default"])("", {
                style: {
                    width: "260px"
                }
            }, (0, mithril_1["default"])(Button_js_1.Button, {
                label: "existingAccount_label",
                click: function () { return nextPage(0 /* GetCredentialsMethod.Login */); },
                type: "login" /* ButtonType.Login */
            }))),
            (0, mithril_1["default"])(".flex-center.full-width.pt-l.pb-m", (0, mithril_1["default"])("", {
                style: {
                    width: "260px"
                }
            }, (0, mithril_1["default"])(Button_js_1.Button, {
                label: "register_label",
                click: function () { return nextPage(1 /* GetCredentialsMethod.Signup */); },
                type: "login" /* ButtonType.Login */
            }))),
        ];
    };
    return GiftCardWelcomePage;
}());
/**
 * This page will either show a signup or login form depending on how they choose to select their credentials
 * When they go to the next page the will be logged in.
 */
var GiftCardCredentialsPage = /** @class */ (function () {
    function GiftCardCredentialsPage() {
        this.domElement = null;
        this.loginFormHelpText = LanguageViewModel_1.lang.get("emptyString_msg");
        this.mailAddress = (0, stream_1["default"])("");
        this.password = (0, stream_1["default"])("");
    }
    GiftCardCredentialsPage.prototype.oncreate = function (vnode) {
        this.domElement = vnode.dom;
    };
    GiftCardCredentialsPage.prototype.view = function (vnode) {
        var data = vnode.attrs.data;
        switch (data.credentialsMethod) {
            case 0 /* GetCredentialsMethod.Login */:
                return this.renderLoginPage(data);
            case 1 /* GetCredentialsMethod.Signup */:
                return this.renderSignupPage(data);
        }
    };
    GiftCardCredentialsPage.prototype.onremove = function () {
        this.password("");
    };
    GiftCardCredentialsPage.prototype.renderLoginPage = function (model) {
        return [
            (0, mithril_1["default"])(".flex-grow.flex-center.scroll", (0, mithril_1["default"])(".flex-grow-shrink-auto.max-width-s.pt.plr-l", [
                this.renderLoginForm(model),
                this.renderCredentialsSelector(model),
            ])),
        ];
    };
    GiftCardCredentialsPage.prototype.renderLoginForm = function (model) {
        var _this = this;
        return (0, mithril_1["default"])(LoginForm_1.LoginForm, {
            onSubmit: function (mailAddress, password) { return __awaiter(_this, void 0, void 0, function () {
                var e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(mailAddress === "" || password === "")) return [3 /*break*/, 1];
                            this.loginFormHelpText = LanguageViewModel_1.lang.get("loginFailed_msg");
                            return [3 /*break*/, 4];
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            // If they try to login with a mail address that is stored, we want to swap out the old session with a new one
                            return [4 /*yield*/, (0, ProgressDialog_1.showProgressDialog)("pleaseWait_msg", model.loginWithFormCredentials(this.mailAddress(), this.password()))];
                        case 2:
                            // If they try to login with a mail address that is stored, we want to swap out the old session with a new one
                            _a.sent();
                            (0, WizardDialog_js_1.emitWizardEvent)(this.domElement, "showNextWizardDialogPage" /* WizardEventType.SHOWNEXTPAGE */);
                            return [3 /*break*/, 4];
                        case 3:
                            e_1 = _a.sent();
                            if (e_1 instanceof UserError_1.UserError) {
                                (0, ErrorHandlerImpl_1.showUserError)(e_1);
                            }
                            else {
                                this.loginFormHelpText = LanguageViewModel_1.lang.getMaybeLazy((0, LoginUtils_1.getLoginErrorMessage)(e_1, false));
                            }
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); },
            mailAddress: this.mailAddress,
            password: this.password,
            helpText: this.loginFormHelpText
        });
    };
    GiftCardCredentialsPage.prototype.renderCredentialsSelector = function (model) {
        var _this = this;
        if (model.storedCredentials.length === 0) {
            return null;
        }
        return (0, mithril_1["default"])(CredentialsSelector_1.CredentialsSelector, {
            credentials: model.storedCredentials,
            onCredentialsSelected: function (encryptedCredentials) { return __awaiter(_this, void 0, void 0, function () {
                var e_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, (0, ProgressDialog_1.showProgressDialog)("pleaseWait_msg", model.loginWithStoredCredentials(encryptedCredentials))];
                        case 1:
                            _a.sent();
                            (0, WizardDialog_js_1.emitWizardEvent)(this.domElement, "showNextWizardDialogPage" /* WizardEventType.SHOWNEXTPAGE */);
                            return [3 /*break*/, 3];
                        case 2:
                            e_2 = _a.sent();
                            if (e_2 instanceof UserError_1.UserError) {
                                (0, ErrorHandlerImpl_1.showUserError)(e_2);
                            }
                            else {
                                this.loginFormHelpText = LanguageViewModel_1.lang.getMaybeLazy((0, LoginUtils_1.getLoginErrorMessage)(e_2, false));
                                (0, LoginUtils_1.handleExpectedLoginError)(e_2, tutanota_utils_1.noOp);
                            }
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); }
        });
    };
    GiftCardCredentialsPage.prototype.renderSignupPage = function (model) {
        var _this = this;
        return (0, mithril_1["default"])(SignupForm_1.SignupForm, {
            // After having an account created we log them in to be in the same state as if they had selected an existing account
            newSignupHandler: function (newAccountData) {
                (0, ProgressDialog_1.showProgressDialog)("pleaseWait_msg", model.handleNewSignup(newAccountData)
                    .then(function () {
                    (0, WizardDialog_js_1.emitWizardEvent)(_this.domElement, "showNextWizardDialogPage" /* WizardEventType.SHOWNEXTPAGE */);
                    mithril_1["default"].redraw();
                })["catch"](function (e) {
                    // TODO when would login fail here and how does it get handled? can we attempt to login again?
                    Dialog_1.Dialog.message("giftCardLoginError_msg");
                    mithril_1["default"].route.set("/login", {
                        noAutoLogin: true
                    });
                }));
            },
            readonly: model.newAccountData != null,
            prefilledMailAddress: model.newAccountData ? model.newAccountData.mailAddress : "",
            isBusinessUse: function () { return false; },
            isPaidSubscription: function () { return false; },
            campaign: function () { return null; }
        });
    };
    return GiftCardCredentialsPage;
}());
var RedeemGiftCardPage = /** @class */ (function () {
    function RedeemGiftCardPage(_a) {
        var attrs = _a.attrs;
        var _b;
        this.confirmed = false;
        // we expect that the accounting info is actually available by now,
        // but we optional chain because invoiceCountry is nullable anyway
        this.country = (0, tutanota_utils_1.mapNullable)((_b = attrs.data.accountingInfo) === null || _b === void 0 ? void 0 : _b.invoiceCountry, CountryList_js_1.getByAbbreviation);
        // if a country is already set, then we don't need to ask for one
        this.showCountryDropdown = this.country == null;
    }
    RedeemGiftCardPage.prototype.oncreate = function (vnodeDOM) {
        this.dom = vnodeDOM.dom;
    };
    RedeemGiftCardPage.prototype.view = function (vnode) {
        var _this = this;
        var _a;
        var model = vnode.attrs.data;
        var isFree = LoginController_1.logins.getUserController().isFreeAccount();
        return (0, mithril_1["default"])("", [
            (0, tutanota_utils_1.mapNullable)((_a = model.newAccountData) === null || _a === void 0 ? void 0 : _a.recoverCode, function (code) { return (0, mithril_1["default"])(".pt-l.plr-l", (0, mithril_1["default"])(RecoverCodeDialog_1.RecoverCodeField, {
                showMessage: true,
                recoverCode: code
            })); }),
            isFree
                ? this.renderInfoForFreeAccounts(model)
                : this.renderInfoForPaidAccounts(model),
            (0, mithril_1["default"])(".flex-center.full-width.pt-l", (0, mithril_1["default"])("", {
                style: {
                    maxWidth: "620px"
                }
            }, [
                this.showCountryDropdown
                    ? (0, GuiUtils_js_1.renderCountryDropdown)({
                        selectedCountry: this.country,
                        onSelectionChanged: function (country) { return _this.country = country; },
                        helpLabel: function () { return LanguageViewModel_1.lang.get("invoiceCountryInfoConsumer_msg"); }
                    })
                    : null,
                (0, GiftCardUtils_1.renderAcceptGiftCardTermsCheckbox)(this.confirmed, function (confirmed) { return _this.confirmed = confirmed; }),
            ])),
            (0, mithril_1["default"])(".flex-center.full-width.pt-s.pb", (0, mithril_1["default"])("", {
                style: {
                    width: "260px"
                }
            }, (0, mithril_1["default"])(Button_js_1.Button, {
                label: "redeem_label",
                click: function () {
                    if (!_this.confirmed) {
                        Dialog_1.Dialog.message("termsAcceptedNeutral_msg");
                        return;
                    }
                    model.redeemGiftCard(_this.country)
                        .then(function () { return (0, WizardDialog_js_1.emitWizardEvent)(_this.dom, "closeWizardDialog" /* WizardEventType.CLOSEDIALOG */); })["catch"]((0, tutanota_utils_1.ofClass)(UserError_1.UserError, ErrorHandlerImpl_1.showUserError))["catch"]((0, tutanota_utils_1.ofClass)(CancelledError_1.CancelledError, tutanota_utils_1.noOp));
                },
                type: "login" /* ButtonType.Login */
            }))),
        ]);
    };
    RedeemGiftCardPage.prototype.renderInfoForFreeAccounts = function (model) {
        return [
            (0, mithril_1["default"])(".pt-l.plr-l", "".concat(LanguageViewModel_1.lang.get("giftCardUpgradeNotify_msg", {
                "{price}": (0, PriceUtils_1.formatPrice)(model.premiumPrice, true),
                "{credit}": (0, PriceUtils_1.formatPrice)(Number(model.giftCardInfo.value) - model.premiumPrice, true)
            }), " ").concat(LanguageViewModel_1.lang.get("creditUsageOptions_msg"))),
            (0, mithril_1["default"])(".center.h4.pt", LanguageViewModel_1.lang.get("upgradeConfirm_msg")),
            (0, mithril_1["default"])(".flex-space-around.flex-wrap", [
                (0, mithril_1["default"])(".flex-grow-shrink-half.plr-l", [
                    (0, mithril_1["default"])(TextField_js_1.TextField, {
                        label: "subscription_label",
                        value: "Premium",
                        disabled: true
                    }),
                    (0, mithril_1["default"])(TextField_js_1.TextField, {
                        label: "paymentInterval_label",
                        value: LanguageViewModel_1.lang.get("pricing.yearly_label"),
                        disabled: true
                    }),
                    (0, mithril_1["default"])(TextField_js_1.TextField, {
                        label: "price_label",
                        value: (0, PriceUtils_1.formatPrice)(Number(model.premiumPrice), true) + " " + LanguageViewModel_1.lang.get("pricing.perYear_label"),
                        disabled: true
                    }),
                    (0, mithril_1["default"])(TextField_js_1.TextField, {
                        label: "paymentMethod_label",
                        value: (0, PriceUtils_1.getPaymentMethodName)(model.paymentMethod),
                        disabled: true
                    }),
                ]),
                (0, mithril_1["default"])(".flex-grow-shrink-half.plr-l.flex-center.items-end", (0, mithril_1["default"])("img[src=" + Icons_1.HabReminderImage + "].pt.bg-white.border-radius", {
                    style: {
                        width: "200px"
                    }
                })),
            ]),
        ];
    };
    RedeemGiftCardPage.prototype.renderInfoForPaidAccounts = function (model) {
        return [
            (0, mithril_1["default"])(".pt-l.plr-l.flex-center", "".concat(LanguageViewModel_1.lang.get("giftCardCreditNotify_msg", {
                "{credit}": (0, PriceUtils_1.formatPrice)(Number(model.giftCardInfo.value), true)
            }), " ").concat(LanguageViewModel_1.lang.get("creditUsageOptions_msg"))),
            (0, mithril_1["default"])(".flex-grow-shrink-half.plr-l.flex-center.items-end", (0, mithril_1["default"])("img[src=" + Icons_1.HabReminderImage + "].pt.bg-white.border-radius", {
                style: {
                    width: "200px"
                }
            })),
        ];
    };
    return RedeemGiftCardPage;
}());
function loadRedeemGiftCardWizard(hashFromUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var model, wizardPages;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadModel(hashFromUrl)];
                case 1:
                    model = _a.sent();
                    wizardPages = [
                        (0, WizardDialog_js_1.wizardPageWrapper)(GiftCardWelcomePage, {
                            data: model,
                            headerTitle: function () { return LanguageViewModel_1.lang.get("giftCard_label"); },
                            nextAction: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, true];
                            }); }); },
                            isSkipAvailable: function () { return false; },
                            isEnabled: function () { return true; }
                        }),
                        (0, WizardDialog_js_1.wizardPageWrapper)(GiftCardCredentialsPage, {
                            data: model,
                            headerTitle: function () { return LanguageViewModel_1.lang.get(model.credentialsMethod === 1 /* GetCredentialsMethod.Signup */ ? "register_label" : "login_label"); },
                            nextAction: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, true];
                            }); }); },
                            isSkipAvailable: function () { return false; },
                            isEnabled: function () { return true; }
                        }),
                        (0, WizardDialog_js_1.wizardPageWrapper)(RedeemGiftCardPage, {
                            data: model,
                            headerTitle: function () { return LanguageViewModel_1.lang.get("redeem_label"); },
                            nextAction: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, true];
                            }); }); },
                            isSkipAvailable: function () { return false; },
                            isEnabled: function () { return true; }
                        }),
                    ];
                    return [2 /*return*/, (0, WizardDialog_js_1.createWizardDialog)(model, wizardPages, function () { return __awaiter(_this, void 0, void 0, function () {
                            var urlParams;
                            return __generator(this, function (_a) {
                                urlParams = !!model.mailAddress
                                    ? { loginWith: model.mailAddress, noAutoLogin: true }
                                    : {};
                                mithril_1["default"].route.set("/login", urlParams);
                                return [2 /*return*/];
                            });
                        }); }).dialog];
            }
        });
    });
}
exports.loadRedeemGiftCardWizard = loadRedeemGiftCardWizard;
function loadModel(hashFromUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, id, key, giftCardInfo, prices, priceData, subscriptionData, storedCredentials;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, GiftCardUtils_1.getTokenFromUrl)(hashFromUrl)];
                case 1:
                    _a = _b.sent(), id = _a.id, key = _a.key;
                    return [4 /*yield*/, MainLocator_1.locator.giftCardFacade.getGiftCardInfo(id, key)];
                case 2:
                    giftCardInfo = _b.sent();
                    return [4 /*yield*/, (0, UpgradeSubscriptionWizard_1.loadUpgradePrices)(null)];
                case 3:
                    prices = _b.sent();
                    priceData = {
                        Premium: prices.premiumPrices,
                        PremiumBusiness: prices.premiumBusinessPrices,
                        Teams: prices.teamsPrices,
                        TeamsBusiness: prices.teamsBusinessPrices,
                        Pro: prices.proPrices
                    };
                    subscriptionData = {
                        options: {
                            businessUse: function () { return false; },
                            paymentInterval: function () { return 12; }
                        },
                        planPrices: priceData
                    };
                    return [4 /*yield*/, MainLocator_1.locator.credentialsProvider.getInternalCredentialsInfos()];
                case 4:
                    storedCredentials = _b.sent();
                    return [2 /*return*/, new RedeemGiftCardModel({
                            giftCardInfo: giftCardInfo,
                            key: key,
                            premiumPrice: (0, PriceUtils_1.getSubscriptionPrice)(subscriptionData, "Premium" /* SubscriptionType.Premium */, "1" /* UpgradePriceType.PlanActualPrice */),
                            storedCredentials: storedCredentials
                        }, MainLocator_1.locator.giftCardFacade, MainLocator_1.locator.credentialsProvider, LoginController_1.logins, MainLocator_1.locator.entityClient)];
            }
        });
    });
}
