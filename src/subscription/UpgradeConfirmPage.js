"use strict";
exports.__esModule = true;
exports.UpgradeConfirmPageAttrs = exports.UpgradeConfirmPage = void 0;
var mithril_1 = require("mithril");
var Dialog_1 = require("../gui/base/Dialog");
var LanguageViewModel_1 = require("../misc/LanguageViewModel");
var PriceUtils_1 = require("./PriceUtils");
var Icons_1 = require("../gui/base/icons/Icons");
var TypeRefs_js_1 = require("../api/entities/sys/TypeRefs.js");
var TutanotaConstants_1 = require("../api/common/TutanotaConstants");
var ProgressDialog_1 = require("../gui/dialogs/ProgressDialog");
var RestError_1 = require("../api/common/error/RestError");
var RecoverCodeDialog_1 = require("../settings/RecoverCodeDialog");
var LoginController_1 = require("../api/main/LoginController");
var SubscriptionUtils_1 = require("./SubscriptionUtils");
var Button_js_1 = require("../gui/base/Button.js");
var WizardDialog_js_1 = require("../gui/base/WizardDialog.js");
var TextField_js_1 = require("../gui/base/TextField.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var MainLocator_1 = require("../api/main/MainLocator");
var Services_1 = require("../api/entities/sys/Services");
var UpgradeConfirmPage = /** @class */ (function () {
    function UpgradeConfirmPage() {
    }
    UpgradeConfirmPage.prototype.oncreate = function (vnode) {
        this.__signupPaidTest = MainLocator_1.locator.usageTestController.getTest("signup.paid");
        this.__signupFreeTest = MainLocator_1.locator.usageTestController.getTest("signup.free");
        this.dom = vnode.dom;
    };
    UpgradeConfirmPage.prototype.view = function (_a) {
        var attrs = _a.attrs;
        var newAccountData = attrs.data.newAccountData;
        return [
            newAccountData
                ? (0, mithril_1["default"])(".plr-l", [
                    (0, mithril_1["default"])(".center.h4.pt", LanguageViewModel_1.lang.get("recoveryCode_label")),
                    (0, mithril_1["default"])(RecoverCodeDialog_1.RecoverCodeField, {
                        showMessage: true,
                        recoverCode: newAccountData.recoverCode
                    }),
                ])
                : null,
            attrs.data.type === "Free" /* SubscriptionType.Free */
                ? this.renderFree(attrs)
                : this.renderPaid(attrs),
        ];
    };
    UpgradeConfirmPage.prototype.upgrade = function (data) {
        var _this = this;
        var serviceData = (0, TypeRefs_js_1.createSwitchAccountTypeData)({
            accountType: TutanotaConstants_1.AccountType.PREMIUM,
            subscriptionType: this.subscriptionTypeToPaidSubscriptionType(data.type),
            date: TutanotaConstants_1.Const.CURRENT_DATE
        });
        (0, ProgressDialog_1.showProgressDialog)("pleaseWait_msg", MainLocator_1.locator.serviceExecutor.post(Services_1.SwitchAccountTypeService, serviceData).then(function () {
            return MainLocator_1.locator.customerFacade.switchFreeToPremiumGroup();
        }))
            .then(function () {
            var _a, _b, _c;
            // Order confirmation (click on Buy), send selected payment method as an enum
            var orderConfirmationStage = (_a = _this.__signupPaidTest) === null || _a === void 0 ? void 0 : _a.getStage(5);
            orderConfirmationStage === null || orderConfirmationStage === void 0 ? void 0 : orderConfirmationStage.setMetric({
                name: "paymentMethod",
                value: TutanotaConstants_1.PaymentMethodTypeToName[data.paymentData.paymentMethod]
            });
            orderConfirmationStage === null || orderConfirmationStage === void 0 ? void 0 : orderConfirmationStage.setMetric({
                name: "switchedFromFree",
                value: ((_c = (_b = _this.__signupFreeTest) === null || _b === void 0 ? void 0 : _b.isStarted()) !== null && _c !== void 0 ? _c : false).toString()
            });
            orderConfirmationStage === null || orderConfirmationStage === void 0 ? void 0 : orderConfirmationStage.complete();
            return _this.close(data, _this.dom);
        })["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.PreconditionFailedError, function (e) {
            Dialog_1.Dialog.message(function () {
                return LanguageViewModel_1.lang.get((0, SubscriptionUtils_1.getPreconditionFailedPaymentMsg)(e.data)) +
                    (data.upgradeType === "Signup" /* UpgradeType.Signup */ ? " " + LanguageViewModel_1.lang.get("accountWasStillCreated_msg") : "");
            });
        }))["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.BadGatewayError, function (e) {
            Dialog_1.Dialog.message(function () {
                return LanguageViewModel_1.lang.get("paymentProviderNotAvailableError_msg") +
                    (data.upgradeType === "Signup" /* UpgradeType.Signup */ ? " " + LanguageViewModel_1.lang.get("accountWasStillCreated_msg") : "");
            });
        }));
    };
    UpgradeConfirmPage.prototype.renderPaid = function (attrs) {
        var _this = this;
        var isYearly = (0, PriceUtils_1.isYearlyPayment)(attrs.data.options.paymentInterval());
        var subscription = (isYearly ? LanguageViewModel_1.lang.get("pricing.yearly_label") : LanguageViewModel_1.lang.get("pricing.monthly_label"));
        return [
            (0, mithril_1["default"])(".center.h4.pt", LanguageViewModel_1.lang.get("upgradeConfirm_msg")),
            (0, mithril_1["default"])(".flex-space-around.flex-wrap", [
                (0, mithril_1["default"])(".flex-grow-shrink-half.plr-l", [
                    (0, mithril_1["default"])(TextField_js_1.TextField, {
                        label: "subscription_label",
                        value: (0, SubscriptionUtils_1.getDisplayNameOfSubscriptionType)(attrs.data.type),
                        disabled: true
                    }),
                    (0, mithril_1["default"])(TextField_js_1.TextField, {
                        label: "paymentInterval_label",
                        value: subscription,
                        disabled: true
                    }),
                    (0, mithril_1["default"])(TextField_js_1.TextField, {
                        label: isYearly ? "priceFirstYear_label" : "price_label",
                        value: buildPriceString(attrs.data.price, attrs.data.options),
                        disabled: true
                    }),
                    this.renderPriceNextYear(attrs),
                    (0, mithril_1["default"])(TextField_js_1.TextField, {
                        label: "paymentMethod_label",
                        value: (0, PriceUtils_1.getPaymentMethodName)(attrs.data.paymentData.paymentMethod),
                        disabled: true
                    }),
                ]),
                (0, mithril_1["default"])(".flex-grow-shrink-half.plr-l.flex-center.items-end", (0, mithril_1["default"])("img.pt.bg-white.border-radius", {
                    src: Icons_1.VisSignupImage,
                    style: {
                        width: "200px"
                    }
                })),
            ]),
            (0, mithril_1["default"])(".smaller.center.pt-l", attrs.data.options.businessUse()
                ? LanguageViewModel_1.lang.get("subscriptionPeriodInfoBusiness_msg")
                : LanguageViewModel_1.lang.get("subscriptionPeriodInfoPrivate_msg")),
            (0, mithril_1["default"])(".flex-center.full-width.pt-l", (0, mithril_1["default"])("", {
                style: {
                    width: "260px"
                }
            }, (0, mithril_1["default"])(Button_js_1.Button, {
                label: "buy_action",
                click: function () { return _this.upgrade(attrs.data); },
                type: "login" /* ButtonType.Login */
            }))),
        ];
    };
    UpgradeConfirmPage.prototype.renderPriceNextYear = function (attrs) {
        return attrs.data.priceNextYear
            ? (0, mithril_1["default"])(TextField_js_1.TextField, {
                label: "priceForNextYear_label",
                value: buildPriceString(attrs.data.priceNextYear, attrs.data.options),
                disabled: true
            })
            : null;
    };
    UpgradeConfirmPage.prototype.renderFree = function (attrs) {
        var _this = this;
        return [
            (0, mithril_1["default"])(".flex-space-around.flex-wrap", [
                (0, mithril_1["default"])(".flex-grow-shrink-half.plr-l.flex-center.items-end", (0, mithril_1["default"])("img.pt.bg-white.border-radius", {
                    src: Icons_1.VisSignupImage,
                    style: {
                        width: "200px"
                    }
                })),
            ]),
            (0, mithril_1["default"])(".flex-center.full-width.pt-l", (0, mithril_1["default"])("", {
                style: {
                    width: "260px"
                }
            }, (0, mithril_1["default"])(Button_js_1.Button, {
                label: "ok_action",
                click: function () {
                    var _a, _b, _c;
                    var recoveryConfirmationStageFree = (_a = _this.__signupFreeTest) === null || _a === void 0 ? void 0 : _a.getStage(5);
                    recoveryConfirmationStageFree === null || recoveryConfirmationStageFree === void 0 ? void 0 : recoveryConfirmationStageFree.setMetric({
                        name: "switchedFromPaid",
                        value: ((_c = (_b = _this.__signupPaidTest) === null || _b === void 0 ? void 0 : _b.isStarted()) !== null && _c !== void 0 ? _c : false).toString()
                    });
                    recoveryConfirmationStageFree === null || recoveryConfirmationStageFree === void 0 ? void 0 : recoveryConfirmationStageFree.complete();
                    _this.close(attrs.data, _this.dom);
                },
                type: "login" /* ButtonType.Login */
            }))),
        ];
    };
    UpgradeConfirmPage.prototype.subscriptionTypeToPaidSubscriptionType = function (subscriptionType) {
        switch (subscriptionType) {
            case "Premium" /* SubscriptionType.Premium */:
                return "0" /* PaidSubscriptionType.Premium */;
            case "PremiumBusiness" /* SubscriptionType.PremiumBusiness */:
                return "4" /* PaidSubscriptionType.Premium_Business */;
            case "Teams" /* SubscriptionType.Teams */:
                return "3" /* PaidSubscriptionType.Teams */;
            case "TeamsBusiness" /* SubscriptionType.TeamsBusiness */:
                return "5" /* PaidSubscriptionType.Teams_Business */;
            case "Pro" /* SubscriptionType.Pro */:
                return "2" /* PaidSubscriptionType.Pro */;
            default:
                throw new Error("not a valid Premium subscription type: " + subscriptionType);
        }
    };
    UpgradeConfirmPage.prototype.close = function (data, dom) {
        var promise = Promise.resolve();
        if (data.newAccountData && LoginController_1.logins.isUserLoggedIn()) {
            promise = LoginController_1.logins.logout(false);
        }
        promise.then(function () {
            (0, WizardDialog_js_1.emitWizardEvent)(dom, "showNextWizardDialogPage" /* WizardEventType.SHOWNEXTPAGE */);
        });
    };
    return UpgradeConfirmPage;
}());
exports.UpgradeConfirmPage = UpgradeConfirmPage;
function buildPriceString(price, options) {
    return (0, PriceUtils_1.formatPriceWithInfo)(Number(price), options.paymentInterval(), !options.businessUse());
}
var UpgradeConfirmPageAttrs = /** @class */ (function () {
    function UpgradeConfirmPageAttrs(upgradeData) {
        this.data = upgradeData;
    }
    UpgradeConfirmPageAttrs.prototype.headerTitle = function () {
        return LanguageViewModel_1.lang.get("summary_label");
    };
    UpgradeConfirmPageAttrs.prototype.nextAction = function (showDialogs) {
        // next action not available for this page
        return Promise.resolve(true);
    };
    UpgradeConfirmPageAttrs.prototype.isSkipAvailable = function () {
        return false;
    };
    UpgradeConfirmPageAttrs.prototype.isEnabled = function () {
        return true;
    };
    return UpgradeConfirmPageAttrs;
}());
exports.UpgradeConfirmPageAttrs = UpgradeConfirmPageAttrs;
