"use strict";
var _a;
exports.__esModule = true;
exports.buyBusiness = exports.buySharing = exports.buyWhitelabel = exports.buyStorage = exports.buyAliases = exports.bookItem = exports.getPreconditionFailedPaymentMsg = exports.hasAllFeaturesInPlan = exports.getSubscriptionType = exports.isBusinessSubscription = exports.getIncludedAliases = exports.isBusinessFeatureActive = exports.isSharingActive = exports.isWhitelabelActive = exports.getNbrOfContactForms = exports.getNbrOfUsers = exports.getTotalAliases = exports.getIncludedStorageCapacity = exports.getTotalStorageCapacity = exports.getDisplayNameOfSubscriptionType = exports.getBusinessUsageSubscriptionType = exports.getPlanPrices = exports.getActionButtonBySubscription = exports.isDowngrade = exports.subscriptions = void 0;
var TutanotaConstants_1 = require("../api/common/TutanotaConstants");
var PriceUtils_1 = require("./PriceUtils");
var RestError_1 = require("../api/common/error/RestError");
var TypeRefs_js_1 = require("../api/entities/sys/TypeRefs.js");
var Dialog_1 = require("../gui/base/Dialog");
var ProgrammingError_1 = require("../api/common/error/ProgrammingError");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var MainLocator_1 = require("../api/main/MainLocator");
var Services_1 = require("../api/entities/sys/Services");
exports.subscriptions = (_a = {},
    _a["Free" /* SubscriptionType.Free */] = {
        nbrOfAliases: 0,
        orderNbrOfAliases: 0,
        storageGb: 1,
        orderStorageGb: 0,
        sharing: false,
        business: false,
        whitelabel: false
    },
    _a["Premium" /* SubscriptionType.Premium */] = {
        nbrOfAliases: 5,
        orderNbrOfAliases: 0,
        storageGb: 1,
        orderStorageGb: 0,
        sharing: false,
        business: false,
        whitelabel: false
    },
    _a["PremiumBusiness" /* SubscriptionType.PremiumBusiness */] = {
        nbrOfAliases: 5,
        orderNbrOfAliases: 0,
        storageGb: 1,
        orderStorageGb: 0,
        sharing: false,
        business: true,
        whitelabel: false
    },
    _a["Teams" /* SubscriptionType.Teams */] = {
        nbrOfAliases: 5,
        orderNbrOfAliases: 0,
        storageGb: 10,
        orderStorageGb: 10,
        sharing: true,
        business: false,
        whitelabel: false
    },
    _a["TeamsBusiness" /* SubscriptionType.TeamsBusiness */] = {
        nbrOfAliases: 5,
        orderNbrOfAliases: 0,
        storageGb: 10,
        orderStorageGb: 10,
        sharing: true,
        business: true,
        whitelabel: false
    },
    _a["Pro" /* SubscriptionType.Pro */] = {
        nbrOfAliases: 20,
        orderNbrOfAliases: 20,
        storageGb: 10,
        orderStorageGb: 10,
        sharing: true,
        business: true,
        whitelabel: true
    },
    _a);
var descendingSubscriptionOrder = [
    "Pro" /* SubscriptionType.Pro */,
    "TeamsBusiness" /* SubscriptionType.TeamsBusiness */,
    "Teams" /* SubscriptionType.Teams */,
    "PremiumBusiness" /* SubscriptionType.PremiumBusiness */,
    "Premium" /* SubscriptionType.Premium */,
];
/**
 * Returns true if the targetSubscription plan is considered to be a lower (~ cheaper) subscription plan
 * Is based on the order of business and non-business subscriptions as defined in descendingSubscriptionOrder
 */
function isDowngrade(targetSubscription, currentSubscription) {
    return descendingSubscriptionOrder.indexOf(targetSubscription) > descendingSubscriptionOrder.indexOf(currentSubscription);
}
exports.isDowngrade = isDowngrade;
function getActionButtonBySubscription(actionButtons, subscription) {
    switch (subscription) {
        case "Free" /* SubscriptionType.Free */:
            return actionButtons.Free;
        case "Premium" /* SubscriptionType.Premium */:
            return actionButtons.Premium;
        case "PremiumBusiness" /* SubscriptionType.PremiumBusiness */:
            return actionButtons.PremiumBusiness;
        case "Teams" /* SubscriptionType.Teams */:
            return actionButtons.Teams;
        case "TeamsBusiness" /* SubscriptionType.TeamsBusiness */:
            return actionButtons.TeamsBusiness;
        case "Pro" /* SubscriptionType.Pro */:
            return actionButtons.Pro;
        default:
            throw new ProgrammingError_1.ProgrammingError("Plan is not valid");
    }
}
exports.getActionButtonBySubscription = getActionButtonBySubscription;
function getPlanPrices(prices, subscription) {
    switch (subscription) {
        case "Free" /* SubscriptionType.Free */:
            return null;
        case "Premium" /* SubscriptionType.Premium */:
            return prices.Premium;
        case "PremiumBusiness" /* SubscriptionType.PremiumBusiness */:
            return prices.PremiumBusiness;
        case "Teams" /* SubscriptionType.Teams */:
            return prices.Teams;
        case "TeamsBusiness" /* SubscriptionType.TeamsBusiness */:
            return prices.TeamsBusiness;
        case "Pro" /* SubscriptionType.Pro */:
            return prices.Pro;
        default:
            throw new ProgrammingError_1.ProgrammingError("Plan is not valid");
    }
}
exports.getPlanPrices = getPlanPrices;
/**
 * @returns the corresponding subscription for business customer (Premium -> PremiumBusiness etc.)
 */
function getBusinessUsageSubscriptionType(subscription) {
    switch (subscription) {
        case "Free" /* SubscriptionType.Free */:
            throw new ProgrammingError_1.ProgrammingError("there is no business counterpart for free");
        case "Premium" /* SubscriptionType.Premium */:
            return "PremiumBusiness" /* SubscriptionType.PremiumBusiness */;
        case "Teams" /* SubscriptionType.Teams */:
            return "TeamsBusiness" /* SubscriptionType.TeamsBusiness */;
        default:
            return subscription;
    }
}
exports.getBusinessUsageSubscriptionType = getBusinessUsageSubscriptionType;
/**
 * @returns the name to show to the user for the current subscription
 * We return 'Premium'/'Teams' for both types private and business and individually append 'business' to it
 */
function getDisplayNameOfSubscriptionType(subscription) {
    switch (subscription) {
        case "PremiumBusiness" /* SubscriptionType.PremiumBusiness */:
            return "Premium";
        case "Premium" /* SubscriptionType.Premium */:
            return "Premium";
        case "TeamsBusiness" /* SubscriptionType.TeamsBusiness */:
            return "Teams";
        case "Teams" /* SubscriptionType.Teams */:
            return "Teams";
        case "Free" /* SubscriptionType.Free */:
            return "Free";
        case "Pro" /* SubscriptionType.Pro */:
            return "Pro";
        default:
            return "Premium";
    }
}
exports.getDisplayNameOfSubscriptionType = getDisplayNameOfSubscriptionType;
/**
 * Returns the available storage capacity for the customer in GB
 */
function getTotalStorageCapacity(customer, customerInfo, lastBooking) {
    var freeStorageCapacity = getIncludedStorageCapacity(customerInfo);
    if (customer.type === TutanotaConstants_1.AccountType.PREMIUM) {
        return Math.max(freeStorageCapacity, (0, PriceUtils_1.getCurrentCount)(TutanotaConstants_1.BookingItemFeatureType.Storage, lastBooking));
    }
    else {
        return freeStorageCapacity;
    }
}
exports.getTotalStorageCapacity = getTotalStorageCapacity;
function getIncludedStorageCapacity(customerInfo) {
    return Math.max(Number(customerInfo.includedStorageCapacity), Number(customerInfo.promotionStorageCapacity));
}
exports.getIncludedStorageCapacity = getIncludedStorageCapacity;
function getTotalAliases(customer, customerInfo, lastBooking) {
    var freeAliases = getIncludedAliases(customerInfo);
    if (customer.type === TutanotaConstants_1.AccountType.PREMIUM) {
        return Math.max(freeAliases, (0, PriceUtils_1.getCurrentCount)(TutanotaConstants_1.BookingItemFeatureType.Alias, lastBooking));
    }
    else {
        return freeAliases;
    }
}
exports.getTotalAliases = getTotalAliases;
function getNbrOfUsers(lastBooking) {
    return (0, PriceUtils_1.getCurrentCount)(TutanotaConstants_1.BookingItemFeatureType.Users, lastBooking);
}
exports.getNbrOfUsers = getNbrOfUsers;
function getNbrOfContactForms(lastBooking) {
    return (0, PriceUtils_1.getCurrentCount)(TutanotaConstants_1.BookingItemFeatureType.ContactForm, lastBooking);
}
exports.getNbrOfContactForms = getNbrOfContactForms;
function isWhitelabelActive(lastBooking) {
    return (0, PriceUtils_1.getCurrentCount)(TutanotaConstants_1.BookingItemFeatureType.Whitelabel, lastBooking) !== 0;
}
exports.isWhitelabelActive = isWhitelabelActive;
function isSharingActive(lastBooking) {
    return (0, PriceUtils_1.getCurrentCount)(TutanotaConstants_1.BookingItemFeatureType.Sharing, lastBooking) !== 0;
}
exports.isSharingActive = isSharingActive;
function isBusinessFeatureActive(lastBooking) {
    return (0, PriceUtils_1.getCurrentCount)(TutanotaConstants_1.BookingItemFeatureType.Business, lastBooking) !== 0;
}
exports.isBusinessFeatureActive = isBusinessFeatureActive;
function getIncludedAliases(customerInfo) {
    return Math.max(Number(customerInfo.includedEmailAliases), Number(customerInfo.promotionEmailAliases));
}
exports.getIncludedAliases = getIncludedAliases;
function isBusinessSubscription(subscription) {
    switch (subscription) {
        case "PremiumBusiness" /* SubscriptionType.PremiumBusiness */:
        case "TeamsBusiness" /* SubscriptionType.TeamsBusiness */:
        case "Pro" /* SubscriptionType.Pro */:
            return true;
        default:
            return false;
    }
}
exports.isBusinessSubscription = isBusinessSubscription;
function getSubscriptionType(lastBooking, customer, customerInfo) {
    if (customer.type !== TutanotaConstants_1.AccountType.PREMIUM) {
        return "Free" /* SubscriptionType.Free */;
    }
    var currentSubscription = {
        nbrOfAliases: getTotalAliases(customer, customerInfo, lastBooking),
        orderNbrOfAliases: getTotalAliases(customer, customerInfo, lastBooking),
        // dummy value
        storageGb: getTotalStorageCapacity(customer, customerInfo, lastBooking),
        orderStorageGb: getTotalStorageCapacity(customer, customerInfo, lastBooking),
        // dummy value
        sharing: isSharingActive(lastBooking),
        business: isBusinessFeatureActive(lastBooking),
        whitelabel: isWhitelabelActive(lastBooking)
    };
    var foundPlan = descendingSubscriptionOrder.find(function (plan) { return hasAllFeaturesInPlan(currentSubscription, exports.subscriptions[plan]); });
    return foundPlan || "Premium" /* SubscriptionType.Premium */;
}
exports.getSubscriptionType = getSubscriptionType;
function hasAllFeaturesInPlan(currentSubscription, planSubscription) {
    return !(currentSubscription.nbrOfAliases < planSubscription.nbrOfAliases ||
        currentSubscription.storageGb < planSubscription.storageGb ||
        (!currentSubscription.sharing && planSubscription.sharing) ||
        (!currentSubscription.whitelabel && planSubscription.whitelabel) ||
        (!currentSubscription.business && planSubscription.business));
}
exports.hasAllFeaturesInPlan = hasAllFeaturesInPlan;
function getPreconditionFailedPaymentMsg(data) {
    switch (data) {
        case "paypal.change":
            return "payChangeError_msg";
        case "paypal.confirm_again":
            return "payPaypalConfirmAgainError_msg";
        case "paypal.other_source":
            return "payPaypalChangeSourceError_msg";
        case "card.contact_bank":
            return "payCardContactBankError_msg";
        case "card.insufficient_funds":
            return "payCardInsufficientFundsError_msg";
        case "card.expired_card":
            return "payCardExpiredError_msg";
        case "card.change":
            return "payChangeError_msg";
        case "card.3ds2_needed":
            return "creditCardPaymentErrorVerificationNeeded_msg";
        case "card.3ds2_pending":
            return "creditCardPendingVerification_msg";
        case "card.3ds2_failed":
            return "creditCardVerificationFailed_msg";
        case "card.cvv_invalid":
            return "creditCardCVVInvalid_msg";
        case "card.number_invalid":
            return "creditCardNumberInvalid_msg";
        case "card.date_invalid":
            return "creditCardExprationDateInvalid_msg";
        default:
            return "payContactUsError_msg";
    }
}
exports.getPreconditionFailedPaymentMsg = getPreconditionFailedPaymentMsg;
/**
 * @returns True if it failed, false otherwise
 */
function bookItem(featureType, amount) {
    var bookingData = (0, TypeRefs_js_1.createBookingServiceData)({
        amount: amount.toString(),
        featureType: featureType,
        date: TutanotaConstants_1.Const.CURRENT_DATE
    });
    return MainLocator_1.locator.serviceExecutor.post(Services_1.BookingService, bookingData)
        .then(function () { return false; })["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.PreconditionFailedError, function (error) {
        // error handling for cancelling a feature.
        switch (error.data) {
            case "balance.insufficient" /* BookingFailureReason.BALANCE_INSUFFICIENT */:
                return Dialog_1.Dialog.message("insufficientBalanceError_msg").then(function () { return true; });
            case "bookingservice.too_many_domains" /* BookingFailureReason.TOO_MANY_DOMAINS */:
                return Dialog_1.Dialog.message("tooManyCustomDomains_msg").then(function () { return true; });
            case "bookingservice.business_use" /* BookingFailureReason.BUSINESS_USE */:
                return Dialog_1.Dialog.message("featureRequiredForBusinessUse_msg").then(function () { return true; });
            case "bookingservice.has_template_group" /* BookingFailureReason.HAS_TEMPLATE_GROUP */:
                return Dialog_1.Dialog.message("deleteTemplateGroups_msg").then(function () { return true; });
            default:
                return Dialog_1.Dialog.message(getBookingItemErrorMsg(featureType)).then(function () { return true; });
        }
    }));
}
exports.bookItem = bookItem;
function buyAliases(amount) {
    return bookItem(TutanotaConstants_1.BookingItemFeatureType.Alias, amount);
}
exports.buyAliases = buyAliases;
function buyStorage(amount) {
    return bookItem(TutanotaConstants_1.BookingItemFeatureType.Storage, amount);
}
exports.buyStorage = buyStorage;
/**
 * @returns True if it failed, false otherwise
 */
function buyWhitelabel(enable) {
    return bookItem(TutanotaConstants_1.BookingItemFeatureType.Whitelabel, enable ? 1 : 0);
}
exports.buyWhitelabel = buyWhitelabel;
/**
 * @returns True if it failed, false otherwise
 */
function buySharing(enable) {
    return bookItem(TutanotaConstants_1.BookingItemFeatureType.Sharing, enable ? 1 : 0);
}
exports.buySharing = buySharing;
/**
 * @returns True if it failed, false otherwise
 */
function buyBusiness(enable) {
    return bookItem(TutanotaConstants_1.BookingItemFeatureType.Business, enable ? 1 : 0);
}
exports.buyBusiness = buyBusiness;
function getBookingItemErrorMsg(feature) {
    switch (feature) {
        case TutanotaConstants_1.BookingItemFeatureType.Alias:
            return "emailAliasesTooManyActivatedForBooking_msg";
        case TutanotaConstants_1.BookingItemFeatureType.Storage:
            return "storageCapacityTooManyUsedForBooking_msg";
        case TutanotaConstants_1.BookingItemFeatureType.Whitelabel:
            return "whitelabelDomainExisting_msg";
        case TutanotaConstants_1.BookingItemFeatureType.Sharing:
            return "unknownError_msg";
        default:
            return "unknownError_msg";
    }
}
