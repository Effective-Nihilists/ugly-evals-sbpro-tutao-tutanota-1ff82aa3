"use strict";
exports.__esModule = true;
exports.getCurrentCount = exports.getPriceFromPriceData = exports.getCountFromPriceData = exports.getPriceItem = exports.formatPriceWithInfo = exports.isYearlyPayment = exports.formatMonthlyPrice = exports.getSubscriptionPrice = exports.formatPrice = exports.formatPriceDataWithInfo = exports.getPaymentMethodInfoText = exports.getPaymentMethodName = void 0;
var TutanotaConstants_1 = require("../api/common/TutanotaConstants");
var LanguageViewModel_1 = require("../misc/LanguageViewModel");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var SubscriptionUtils_1 = require("./SubscriptionUtils");
function getPaymentMethodName(paymentMethod) {
    if (paymentMethod === TutanotaConstants_1.PaymentMethodType.Invoice) {
        return LanguageViewModel_1.lang.get("paymentMethodOnAccount_label");
    }
    else if (paymentMethod === TutanotaConstants_1.PaymentMethodType.CreditCard) {
        return LanguageViewModel_1.lang.get("paymentMethodCreditCard_label");
    }
    else if (paymentMethod === TutanotaConstants_1.PaymentMethodType.Sepa) {
        return "SEPA";
    }
    else if (paymentMethod === TutanotaConstants_1.PaymentMethodType.Paypal) {
        return "PayPal";
    }
    else if (paymentMethod === TutanotaConstants_1.PaymentMethodType.AccountBalance) {
        return LanguageViewModel_1.lang.get("paymentMethodAccountBalance_label");
    }
    else {
        return "<" + LanguageViewModel_1.lang.get("comboBoxSelectionNone_msg") + ">";
    }
}
exports.getPaymentMethodName = getPaymentMethodName;
function getPaymentMethodInfoText(accountingInfo) {
    if (accountingInfo.paymentMethodInfo) {
        return accountingInfo.paymentMethod === TutanotaConstants_1.PaymentMethodType.CreditCard
            ? LanguageViewModel_1.lang.get("endsWith_label") + " " + (0, tutanota_utils_1.neverNull)(accountingInfo.paymentMethodInfo)
            : (0, tutanota_utils_1.neverNull)(accountingInfo.paymentMethodInfo);
    }
    else {
        return "";
    }
}
exports.getPaymentMethodInfoText = getPaymentMethodInfoText;
function formatPriceDataWithInfo(priceData) {
    return formatPriceWithInfo(Number(priceData.price), Number(priceData.paymentInterval), priceData.taxIncluded);
}
exports.formatPriceDataWithInfo = formatPriceDataWithInfo;
// Used on website, keep it in sync
function formatPrice(value, includeCurrency) {
    // round to two digits first because small deviations may exist at far away decimal places
    value = Math.round(value * 100) / 100;
    if (includeCurrency) {
        return value % 1 !== 0 ? LanguageViewModel_1.lang.formats.priceWithCurrency.format(value) : LanguageViewModel_1.lang.formats.priceWithCurrencyWithoutFractionDigits.format(value);
    }
    else {
        return value % 1 !== 0 ? LanguageViewModel_1.lang.formats.priceWithoutCurrency.format(value) : LanguageViewModel_1.lang.formats.priceWithoutCurrencyWithoutFractionDigits.format(value);
    }
}
exports.formatPrice = formatPrice;
/**
 * Return actual price for given subscription data. In case of yearly subscription, the yearly value is returned, and monthly otherwise.
 */
function getSubscriptionPrice(data, subscription, type) {
    var prices = (0, SubscriptionUtils_1.getPlanPrices)(data.planPrices, subscription);
    if (prices) {
        var monthlyPriceString = void 0;
        var monthsFactor = data.options.paymentInterval() === 12 ? 10 : 1;
        var discount = 0;
        if (type === "0" /* UpgradePriceType.PlanReferencePrice */) {
            monthlyPriceString = prices.monthlyReferencePrice;
            if (data.options.paymentInterval() === 12) {
                monthsFactor = 12;
            }
        }
        else if (type === "1" /* UpgradePriceType.PlanActualPrice */) {
            monthlyPriceString = prices.monthlyPrice;
            if (data.options.paymentInterval() === 12) {
                discount = Number(prices.firstYearDiscount);
            }
        }
        else if (type === "2" /* UpgradePriceType.PlanNextYearsPrice */) {
            monthlyPriceString = prices.monthlyPrice;
        }
        else if (type === "3" /* UpgradePriceType.AdditionalUserPrice */) {
            monthlyPriceString = prices.additionalUserPriceMonthly;
        }
        else if (type === "4" /* UpgradePriceType.ContactFormPrice */) {
            monthlyPriceString = prices.contactFormPriceMonthly;
        }
        return Number(monthlyPriceString) * monthsFactor - discount;
    }
    else {
        // Free plan
        return 0;
    }
}
exports.getSubscriptionPrice = getSubscriptionPrice;
/**
 * Formats the monthly price of the subscription (even for yearly subscriptions).
 */
function formatMonthlyPrice(subscriptionPrice, paymentInterval) {
    var monthlyPrice = isYearlyPayment(paymentInterval) ? subscriptionPrice / 12 : subscriptionPrice;
    return formatPrice(monthlyPrice, true);
}
exports.formatMonthlyPrice = formatMonthlyPrice;
function isYearlyPayment(periods) {
    return periods === 12;
}
exports.isYearlyPayment = isYearlyPayment;
function formatPriceWithInfo(price, paymentInterval, taxIncluded) {
    var netOrGross = taxIncluded ? LanguageViewModel_1.lang.get("gross_label") : LanguageViewModel_1.lang.get("net_label");
    var yearlyOrMonthly = isYearlyPayment(paymentInterval) ? LanguageViewModel_1.lang.get("pricing.perYear_label") : LanguageViewModel_1.lang.get("pricing.perMonth_label");
    var formattedPrice = formatPrice(price, true);
    return "".concat(formattedPrice, " ").concat(yearlyOrMonthly, " (").concat(netOrGross, ")");
}
exports.formatPriceWithInfo = formatPriceWithInfo;
/**
 * Provides the price item from the given priceData for the given featureType. Returns null if no such item is available.
 */
function getPriceItem(priceData, featureType) {
    var _a;
    return (_a = priceData === null || priceData === void 0 ? void 0 : priceData.items.find(function (item) { return item.featureType === featureType; })) !== null && _a !== void 0 ? _a : null;
}
exports.getPriceItem = getPriceItem;
function getCountFromPriceData(priceData, featureType) {
    var priceItem = getPriceItem(priceData, featureType);
    return priceItem ? Number(priceItem.count) : 0;
}
exports.getCountFromPriceData = getCountFromPriceData;
/**
 * Returns the price for the feature type from the price data if available. otherwise 0.
 * @return The price
 */
function getPriceFromPriceData(priceData, featureType) {
    var item = getPriceItem(priceData, featureType);
    if (item) {
        return Number(item.price);
    }
    else {
        return 0;
    }
}
exports.getPriceFromPriceData = getPriceFromPriceData;
function getCurrentCount(featureType, booking) {
    if (booking) {
        var bookingItem = booking.items.find(function (item) { return item.featureType === featureType; });
        return bookingItem ? Number(bookingItem.currentCount) : 0;
    }
    else {
        return 0;
    }
}
exports.getCurrentCount = getCurrentCount;
