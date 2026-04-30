"use strict";
exports.__esModule = true;
exports.PaymentMethodInput = void 0;
var mithril_1 = require("mithril");
var LanguageViewModel_1 = require("../misc/LanguageViewModel");
var CountryList_1 = require("../api/common/CountryList");
var TutanotaConstants_1 = require("../api/common/TutanotaConstants");
var CreditCardInput_1 = require("./CreditCardInput");
var Icons_1 = require("../gui/base/icons/Icons");
var ProgressDialog_1 = require("../gui/dialogs/ProgressDialog");
var TypeRefs_js_1 = require("../api/entities/sys/TypeRefs.js");
var MainLocator_1 = require("../api/main/MainLocator");
var EventController_1 = require("../api/main/EventController");
var MessageBox_js_1 = require("../gui/base/MessageBox.js");
var size_1 = require("../gui/size");
var FormatValidator_1 = require("../misc/FormatValidator");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var tutanota_utils_2 = require("@tutao/tutanota-utils");
/**
 * Component to display the input fields for a payment method. The selector to switch between payment methods is not included.
 */
var PaymentMethodInput = /** @class */ (function () {
    function PaymentMethodInput(subscriptionOptions, selectedCountry, accountingInfo, payPalRequestUrl) {
        var _this = this;
        this._selectedCountry = selectedCountry;
        this._subscriptionOptions = subscriptionOptions;
        this._creditCardAttrs = new CreditCardInput_1.CreditCardAttrs();
        this._accountingInfo = accountingInfo;
        this._payPalAttrs = {
            payPalRequestUrl: payPalRequestUrl,
            accountingInfo: this._accountingInfo
        };
        this._entityEventListener = function (updates) {
            return (0, tutanota_utils_2.promiseMap)(updates, function (update) {
                if ((0, EventController_1.isUpdateForTypeRef)(TypeRefs_js_1.AccountingInfoTypeRef, update)) {
                    return MainLocator_1.locator.entityClient.load(TypeRefs_js_1.AccountingInfoTypeRef, update.instanceId).then(function (accountingInfo) {
                        _this._accountingInfo = accountingInfo;
                        _this._payPalAttrs.accountingInfo = accountingInfo;
                        mithril_1["default"].redraw();
                    });
                }
            }).then(tutanota_utils_1.noOp);
        };
        this._selectedPaymentMethod = TutanotaConstants_1.PaymentMethodType.CreditCard;
    }
    PaymentMethodInput.prototype.oncreate = function () {
        MainLocator_1.locator.eventController.addEntityListener(this._entityEventListener);
    };
    PaymentMethodInput.prototype.onremove = function () {
        MainLocator_1.locator.eventController.removeEntityListener(this._entityEventListener);
    };
    PaymentMethodInput.prototype.view = function () {
        if (this._selectedPaymentMethod === TutanotaConstants_1.PaymentMethodType.Invoice) {
            return (0, mithril_1["default"])(".flex-center", (0, mithril_1["default"])(MessageBox_js_1.MessageBox, {
                style: {
                    marginTop: (0, size_1.px)(16)
                }
            }, this.isOnAccountAllowed()
                ? LanguageViewModel_1.lang.get("paymentMethodOnAccount_msg") + " " + LanguageViewModel_1.lang.get("paymentProcessingTime_msg")
                : LanguageViewModel_1.lang.get("paymentMethodNotAvailable_msg")));
        }
        else if (this._selectedPaymentMethod === TutanotaConstants_1.PaymentMethodType.AccountBalance) {
            return (0, mithril_1["default"])(".flex-center", (0, mithril_1["default"])(MessageBox_js_1.MessageBox, {
                style: {
                    marginTop: (0, size_1.px)(16)
                }
            }, LanguageViewModel_1.lang.get("paymentMethodAccountBalance_msg")));
        }
        else if (this._selectedPaymentMethod === TutanotaConstants_1.PaymentMethodType.Paypal) {
            return (0, mithril_1["default"])(PaypalInput, this._payPalAttrs);
        }
        else {
            return (0, mithril_1["default"])(CreditCardInput_1.CreditCardInput, this._creditCardAttrs);
        }
    };
    PaymentMethodInput.prototype.isOnAccountAllowed = function () {
        var country = this._selectedCountry();
        if (!country) {
            return false;
        }
        else if (this._accountingInfo.paymentMethod === TutanotaConstants_1.PaymentMethodType.Invoice) {
            return true;
        }
        else if (this._subscriptionOptions.businessUse() && country.t !== CountryList_1.CountryType.OTHER) {
            return true;
        }
        else {
            return false;
        }
    };
    PaymentMethodInput.prototype.isPaypalAssigned = function () {
        return isPaypalAssigned(this._accountingInfo);
    };
    PaymentMethodInput.prototype.validatePaymentData = function () {
        if (!this._selectedPaymentMethod) {
            return "invoicePaymentMethodInfo_msg";
        }
        else if (this._selectedPaymentMethod === TutanotaConstants_1.PaymentMethodType.Invoice) {
            if (!this.isOnAccountAllowed()) {
                return "paymentMethodNotAvailable_msg";
            }
            else {
                return null;
            }
        }
        else if (this._selectedPaymentMethod === TutanotaConstants_1.PaymentMethodType.Paypal) {
            return isPaypalAssigned(this._accountingInfo) ? null : "paymentDataPayPalLogin_msg";
        }
        else if (this._selectedPaymentMethod === TutanotaConstants_1.PaymentMethodType.CreditCard) {
            var cc = this._creditCardAttrs.getCreditCardData();
            if (cc.number === "") {
                return "creditCardNumberFormat_msg";
            }
            else if (!(0, FormatValidator_1.isValidCreditCardNumber)(cc.number)) {
                return "creditCardNumberInvalid_msg";
            }
            else if (cc.cardHolderName === "") {
                return "creditCardCardHolderName_msg";
            }
            else if (cc.cvv === "" || cc.cvv.length < 3 || cc.cvv.length > 4) {
                // CVV2 is 3- or 4-digit
                return "creditCardCVVFormat_label";
            }
            else if (cc.expirationMonth.length !== 2 ||
                (cc.expirationYear.length !== 4 && cc.expirationYear.length !== 2) ||
                parseInt(cc.expirationMonth) < 1 ||
                parseInt(cc.expirationMonth) > 12) {
                return "creditCardExprationDateInvalid_msg";
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    };
    PaymentMethodInput.prototype.updatePaymentMethod = function (value, paymentData) {
        this._selectedPaymentMethod = value;
        if (value === TutanotaConstants_1.PaymentMethodType.CreditCard) {
            if (paymentData) {
                this._creditCardAttrs.setCreditCardData(paymentData.creditCardData);
            }
        }
        else if (value === TutanotaConstants_1.PaymentMethodType.Paypal) {
            this._payPalAttrs.payPalRequestUrl.getAsync().then(function () { return mithril_1["default"].redraw(); });
        }
        mithril_1["default"].redraw();
    };
    PaymentMethodInput.prototype.getPaymentData = function () {
        return {
            paymentMethod: this._selectedPaymentMethod,
            creditCardData: this._selectedPaymentMethod === TutanotaConstants_1.PaymentMethodType.CreditCard ? this._creditCardAttrs.getCreditCardData() : null
        };
    };
    PaymentMethodInput.prototype.getVisiblePaymentMethods = function () {
        var availablePaymentMethods = [
            {
                name: LanguageViewModel_1.lang.get("paymentMethodCreditCard_label"),
                value: TutanotaConstants_1.PaymentMethodType.CreditCard
            },
            {
                name: "PayPal",
                value: TutanotaConstants_1.PaymentMethodType.Paypal
            },
        ];
        // show bank transfer in case of business use, even if it is not available for the selected country
        if (this._subscriptionOptions.businessUse() || this._accountingInfo.paymentMethod === TutanotaConstants_1.PaymentMethodType.Invoice) {
            availablePaymentMethods.push({
                name: LanguageViewModel_1.lang.get("paymentMethodOnAccount_label"),
                value: TutanotaConstants_1.PaymentMethodType.Invoice
            });
        }
        // show account balance only if this is the current payment method
        if (this._accountingInfo.paymentMethod === TutanotaConstants_1.PaymentMethodType.AccountBalance) {
            availablePaymentMethods.push({
                name: LanguageViewModel_1.lang.get("paymentMethodAccountBalance_label"),
                value: TutanotaConstants_1.PaymentMethodType.AccountBalance
            });
        }
        return availablePaymentMethods;
    };
    return PaymentMethodInput;
}());
exports.PaymentMethodInput = PaymentMethodInput;
var PaypalInput = /** @class */ (function () {
    function PaypalInput() {
    }
    PaypalInput.prototype.view = function (vnode) {
        var attrs = vnode.attrs;
        return [
            (0, mithril_1["default"])(".flex-center", {
                style: {
                    "margin-top": "50px"
                }
            }, (0, mithril_1["default"])("button.button-height.flex.items-center.plr.border.border-radius.bg-white", {
                title: "PayPal",
                style: {
                    cursor: "pointer"
                },
                onclick: function () {
                    if (attrs.payPalRequestUrl.isLoaded()) {
                        window.open(attrs.payPalRequestUrl.getLoaded());
                    }
                    else {
                        (0, ProgressDialog_1.showProgressDialog)("payPalRedirect_msg", attrs.payPalRequestUrl.getAsync()).then(function (url) { return window.open(url); });
                    }
                }
            }, (0, mithril_1["default"])("img[src=" + Icons_1.PayPalLogo + "]"))),
            (0, mithril_1["default"])(".small.pt.center", isPaypalAssigned(attrs.accountingInfo)
                ? LanguageViewModel_1.lang.get("paymentDataPayPalFinished_msg", {
                    "{accountAddress}": attrs.accountingInfo.paymentMethodInfo
                })
                : LanguageViewModel_1.lang.get("paymentDataPayPalLogin_msg")),
        ];
    };
    return PaypalInput;
}());
function isPaypalAssigned(accountingInfo) {
    return accountingInfo.paypalBillingAgreement != null;
}
