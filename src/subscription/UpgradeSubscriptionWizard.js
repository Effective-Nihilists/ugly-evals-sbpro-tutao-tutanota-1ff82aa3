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
exports.loadSignupWizard = exports.showUpgradeWizard = exports.loadUpgradePrices = exports.SubscriptionTypeParameter = void 0;
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var TypeRefs_js_1 = require("../api/entities/sys/TypeRefs.js");
var LoginController_1 = require("../api/main/LoginController");
var TutanotaConstants_1 = require("../api/common/TutanotaConstants");
var CountryList_1 = require("../api/common/CountryList");
var UpgradeSubscriptionPage_1 = require("./UpgradeSubscriptionPage");
var Formatter_1 = require("../misc/Formatter");
var mithril_1 = require("mithril");
var stream_1 = require("mithril/stream");
var LanguageViewModel_1 = require("../misc/LanguageViewModel");
var WizardDialog_js_1 = require("../gui/base/WizardDialog.js");
var InvoiceAndPaymentDataPage_1 = require("./InvoiceAndPaymentDataPage");
var UpgradeConfirmPage_1 = require("./UpgradeConfirmPage");
var SignupPage_1 = require("./SignupPage");
var Env_1 = require("../api/common/Env");
var MainLocator_1 = require("../api/main/MainLocator");
var Services_js_1 = require("../api/entities/sys/Services.js");
(0, Env_1.assertMainOrNode)();
/** Subscription type passed from the website */
exports.SubscriptionTypeParameter = Object.freeze({
    FREE: "free",
    PREMIUM: "premium",
    TEAMS: "teams",
    PRO: "pro"
});
function loadUpgradePrices(registrationDataId) {
    var data = (0, TypeRefs_js_1.createUpgradePriceServiceData)({
        date: TutanotaConstants_1.Const.CURRENT_DATE,
        campaign: registrationDataId
    });
    return MainLocator_1.locator.serviceExecutor.get(Services_js_1.UpgradePriceService, data);
}
exports.loadUpgradePrices = loadUpgradePrices;
function loadCustomerAndInfo() {
    return MainLocator_1.locator.entityClient.load(TypeRefs_js_1.CustomerTypeRef, (0, tutanota_utils_1.neverNull)(LoginController_1.logins.getUserController().user.customer)).then(function (customer) {
        return MainLocator_1.locator.entityClient.load(TypeRefs_js_1.CustomerInfoTypeRef, customer.customerInfo).then(function (customerInfo) {
            return MainLocator_1.locator.entityClient.load(TypeRefs_js_1.AccountingInfoTypeRef, customerInfo.accountingInfo).then(function (accountingInfo) {
                return {
                    customer: customer,
                    customerInfo: customerInfo,
                    accountingInfo: accountingInfo
                };
            });
        });
    });
}
function showUpgradeWizard() {
    loadCustomerAndInfo().then(function (_a) {
        var customer = _a.customer, accountingInfo = _a.accountingInfo;
        return loadUpgradePrices(null).then(function (prices) {
            var planPrices = {
                Premium: prices.premiumPrices,
                PremiumBusiness: prices.premiumBusinessPrices,
                Teams: prices.teamsPrices,
                TeamsBusiness: prices.teamsBusinessPrices,
                Pro: prices.proPrices
            };
            var upgradeData = {
                options: {
                    businessUse: (0, stream_1["default"])(prices.business),
                    paymentInterval: (0, stream_1["default"])(Number(accountingInfo.paymentInterval))
                },
                invoiceData: {
                    invoiceAddress: (0, Formatter_1.formatNameAndAddress)(accountingInfo.invoiceName, accountingInfo.invoiceAddress),
                    country: accountingInfo.invoiceCountry ? (0, CountryList_1.getByAbbreviation)(accountingInfo.invoiceCountry) : null,
                    vatNumber: accountingInfo.invoiceVatIdNo
                },
                paymentData: {
                    paymentMethod: (0, TutanotaConstants_1.getPaymentMethodType)(accountingInfo) || TutanotaConstants_1.PaymentMethodType.CreditCard,
                    creditCardData: null
                },
                price: "",
                type: "Premium" /* SubscriptionType.Premium */,
                priceNextYear: null,
                accountingInfo: accountingInfo,
                customer: customer,
                newAccountData: null,
                registrationDataId: null,
                campaignInfoTextId: prices.messageTextId ? (0, LanguageViewModel_1.assertTranslation)(prices.messageTextId) : null,
                upgradeType: "Initial" /* UpgradeType.Initial */,
                planPrices: planPrices,
                currentSubscription: "Free" /* SubscriptionType.Free */,
                subscriptionParameters: null
            };
            var wizardPages = [
                (0, WizardDialog_js_1.wizardPageWrapper)(UpgradeSubscriptionPage_1.UpgradeSubscriptionPage, new UpgradeSubscriptionPage_1.UpgradeSubscriptionPageAttrs(upgradeData)),
                (0, WizardDialog_js_1.wizardPageWrapper)(InvoiceAndPaymentDataPage_1.InvoiceAndPaymentDataPage, new InvoiceAndPaymentDataPage_1.InvoiceAndPaymentDataPageAttrs(upgradeData)),
                (0, WizardDialog_js_1.wizardPageWrapper)(UpgradeConfirmPage_1.UpgradeConfirmPage, new UpgradeConfirmPage_1.UpgradeConfirmPageAttrs(upgradeData)),
            ];
            var wizardBuilder = (0, WizardDialog_js_1.createWizardDialog)(upgradeData, wizardPages);
            wizardBuilder.dialog.show();
        });
    });
}
exports.showUpgradeWizard = showUpgradeWizard;
function loadSignupWizard(subscriptionParameters, registrationDataId) {
    return __awaiter(this, void 0, void 0, function () {
        var usageTestModel, _a, _b, prices, planPrices, signupData, invoiceAttrs, wizardPages, wizardBuilder;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    usageTestModel = MainLocator_1.locator.usageTestModel;
                    usageTestModel.setStorageBehavior(1 /* StorageBehavior.Ephemeral */);
                    _b = (_a = MainLocator_1.locator.usageTestController).setTests;
                    return [4 /*yield*/, usageTestModel.loadActiveUsageTests()];
                case 1:
                    _b.apply(_a, [_c.sent()]);
                    return [4 /*yield*/, loadUpgradePrices(registrationDataId)];
                case 2:
                    prices = _c.sent();
                    planPrices = {
                        Premium: prices.premiumPrices,
                        PremiumBusiness: prices.premiumBusinessPrices,
                        Teams: prices.teamsPrices,
                        TeamsBusiness: prices.teamsBusinessPrices,
                        Pro: prices.proPrices
                    };
                    signupData = {
                        options: {
                            businessUse: (0, stream_1["default"])(prices.business),
                            paymentInterval: (0, stream_1["default"])(12)
                        },
                        invoiceData: {
                            invoiceAddress: "",
                            country: null,
                            vatNumber: ""
                        },
                        paymentData: {
                            paymentMethod: TutanotaConstants_1.PaymentMethodType.CreditCard,
                            creditCardData: null
                        },
                        price: "",
                        priceNextYear: null,
                        type: "Free" /* SubscriptionType.Free */,
                        accountingInfo: null,
                        customer: null,
                        newAccountData: null,
                        registrationDataId: registrationDataId,
                        campaignInfoTextId: prices.messageTextId ? (0, LanguageViewModel_1.assertTranslation)(prices.messageTextId) : null,
                        upgradeType: "Signup" /* UpgradeType.Signup */,
                        planPrices: planPrices,
                        currentSubscription: null,
                        subscriptionParameters: subscriptionParameters
                    };
                    invoiceAttrs = new InvoiceAndPaymentDataPage_1.InvoiceAndPaymentDataPageAttrs(signupData);
                    wizardPages = [
                        (0, WizardDialog_js_1.wizardPageWrapper)(UpgradeSubscriptionPage_1.UpgradeSubscriptionPage, new UpgradeSubscriptionPage_1.UpgradeSubscriptionPageAttrs(signupData)),
                        (0, WizardDialog_js_1.wizardPageWrapper)(SignupPage_1.SignupPage, new SignupPage_1.SignupPageAttrs(signupData)),
                        (0, WizardDialog_js_1.wizardPageWrapper)(InvoiceAndPaymentDataPage_1.InvoiceAndPaymentDataPage, invoiceAttrs),
                        (0, WizardDialog_js_1.wizardPageWrapper)(UpgradeConfirmPage_1.UpgradeConfirmPage, new UpgradeConfirmPage_1.UpgradeConfirmPageAttrs(signupData)),
                    ];
                    wizardBuilder = (0, WizardDialog_js_1.createWizardDialog)(signupData, wizardPages, function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!LoginController_1.logins.isUserLoggedIn()) return [3 /*break*/, 2];
                                    return [4 /*yield*/, LoginController_1.logins.logout(false)];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2:
                                    if (signupData.newAccountData) {
                                        mithril_1["default"].route.set("/login", {
                                            noAutoLogin: true,
                                            loginWith: signupData.newAccountData.mailAddress
                                        });
                                    }
                                    else {
                                        mithril_1["default"].route.set("/login", {
                                            noAutoLogin: true
                                        });
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    // for signup specifically, we only want the invoice and payment page to show up if signing up for a paid account (and the user did not go back to the first page!)
                    invoiceAttrs.setEnabledFunction(function () { return signupData.type !== "Free" /* SubscriptionType.Free */ && wizardBuilder.attrs.currentPage !== wizardPages[0]; });
                    return [2 /*return*/, wizardBuilder.dialog];
            }
        });
    });
}
exports.loadSignupWizard = loadSignupWizard;
