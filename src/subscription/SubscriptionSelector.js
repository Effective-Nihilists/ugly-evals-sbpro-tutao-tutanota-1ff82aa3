"use strict";
exports.__esModule = true;
exports.SubscriptionSelector = void 0;
var mithril_1 = require("mithril");
var LanguageViewModel_1 = require("../misc/LanguageViewModel");
var BuyOptionBox_1 = require("./BuyOptionBox");
var SubscriptionUtils_1 = require("./SubscriptionUtils");
var SegmentControl_1 = require("../gui/base/SegmentControl");
var PriceUtils_1 = require("./PriceUtils");
var BusinessUseItems = [
    {
        name: LanguageViewModel_1.lang.get("pricing.privateUse_label"),
        value: false
    },
    {
        name: LanguageViewModel_1.lang.get("pricing.businessUse_label"),
        value: true
    },
];
var SubscriptionSelector = /** @class */ (function () {
    function SubscriptionSelector() {
        this.containerDOM = null;
    }
    SubscriptionSelector.prototype.view = function (vnode) {
        var _this = this;
        var buyBoxesViewPlacement;
        if (vnode.attrs.options.businessUse()) {
            buyBoxesViewPlacement = [
                (0, mithril_1["default"])(BuyOptionBox_1.BuyOptionBox, this.createBuyOptionBoxAttr(vnode.attrs, "PremiumBusiness" /* SubscriptionType.PremiumBusiness */)),
                (0, mithril_1["default"])(BuyOptionBox_1.BuyOptionBox, this.createBuyOptionBoxAttr(vnode.attrs, "TeamsBusiness" /* SubscriptionType.TeamsBusiness */)),
                (0, mithril_1["default"])(BuyOptionBox_1.BuyOptionBox, this.createBuyOptionBoxAttr(vnode.attrs, "Pro" /* SubscriptionType.Pro */)),
                (0, mithril_1["default"])(".smaller.mb", LanguageViewModel_1.lang.get("downgradeToPrivateNotAllowed_msg")), //only displayed when business options are shown
            ];
        }
        else {
            var currentSubscription = vnode.attrs.currentSubscriptionType;
            // Add BuyOptionBox margin twice to the boxWidth received
            var columnWidth = vnode.attrs.boxWidth + BuyOptionBox_1.BOX_MARGIN * 2;
            var premiumBuyOptionBox = (0, mithril_1["default"])(BuyOptionBox_1.BuyOptionBox, currentSubscription === "PremiumBusiness" /* SubscriptionType.PremiumBusiness */
                ? this.createBuyOptionBoxAttr(vnode.attrs, "PremiumBusiness" /* SubscriptionType.PremiumBusiness */)
                : this.createBuyOptionBoxAttr(vnode.attrs, "Premium" /* SubscriptionType.Premium */));
            var teamsBuyOptionBox = (0, mithril_1["default"])(BuyOptionBox_1.BuyOptionBox, currentSubscription === "TeamsBusiness" /* SubscriptionType.TeamsBusiness */
                ? this.createBuyOptionBoxAttr(vnode.attrs, "TeamsBusiness" /* SubscriptionType.TeamsBusiness */)
                : this.createBuyOptionBoxAttr(vnode.attrs, "Teams" /* SubscriptionType.Teams */));
            var freeBuyOptionBox = (0, mithril_1["default"])(BuyOptionBox_1.BuyOptionBox, this.createBuyOptionBoxAttr(vnode.attrs, "Free" /* SubscriptionType.Free */));
            // Changes order of BuyBoxes to Premium Pro Free, needed for mobile view (one column layout)
            if (this.containerDOM && this.containerDOM.clientWidth < columnWidth * 2) {
                buyBoxesViewPlacement = [premiumBuyOptionBox, teamsBuyOptionBox, freeBuyOptionBox];
            }
            else {
                buyBoxesViewPlacement = [freeBuyOptionBox, premiumBuyOptionBox, teamsBuyOptionBox];
            }
        }
        var currentPlanInfo = this.getCurrentPlanInfo(vnode.attrs);
        return [
            vnode.attrs.isInitialUpgrade
                ? (0, mithril_1["default"])(SegmentControl_1.SegmentControl, {
                    selectedValue: vnode.attrs.options.businessUse(),
                    onValueSelected: vnode.attrs.options.businessUse,
                    items: BusinessUseItems
                })
                : null,
            vnode.attrs.campaignInfoTextId && LanguageViewModel_1.lang.exists(vnode.attrs.campaignInfoTextId) ? (0, mithril_1["default"])(".b.center.mt", LanguageViewModel_1.lang.get(vnode.attrs.campaignInfoTextId)) : null,
            currentPlanInfo ? (0, mithril_1["default"])(".smaller.center.mt", currentPlanInfo) : null,
            (0, mithril_1["default"])(".flex.center-horizontally.wrap", {
                oncreate: function (vnode) {
                    _this.containerDOM = vnode.dom;
                    mithril_1["default"].redraw();
                }
            }, buyBoxesViewPlacement, (0, mithril_1["default"])(".smaller.mb.center", vnode.attrs.options.businessUse() ? LanguageViewModel_1.lang.get("subscriptionPeriodInfoBusiness_msg") : LanguageViewModel_1.lang.get("subscriptionPeriodInfoPrivate_msg"))),
        ];
    };
    SubscriptionSelector.prototype.getCurrentPlanInfo = function (selectorAttrs) {
        if (selectorAttrs.options.businessUse() && selectorAttrs.currentSubscriptionType && !selectorAttrs.currentlyBusinessOrdered) {
            var price = (0, PriceUtils_1.getSubscriptionPrice)(selectorAttrs, selectorAttrs.currentSubscriptionType, "1" /* UpgradePriceType.PlanActualPrice */);
            return (LanguageViewModel_1.lang.get("businessCustomerNeedsBusinessFeaturePlan_msg", {
                "{price}": (0, PriceUtils_1.formatMonthlyPrice)(price, selectorAttrs.options.paymentInterval()),
                "{plan}": selectorAttrs.currentSubscriptionType
            }) +
                " " +
                LanguageViewModel_1.lang.get("businessCustomerAutoBusinessFeature_msg"));
        }
        return null;
    };
    SubscriptionSelector.prototype.createFreeBuyOptionBoxAttr = function (selectorAttrs) {
        return {
            heading: "Free",
            actionButton: selectorAttrs.currentSubscriptionType === "Free" /* SubscriptionType.Free */
                ? (0, BuyOptionBox_1.getActiveSubscriptionActionButtonReplacement)()
                : selectorAttrs.actionButtons.Free,
            price: (0, PriceUtils_1.formatPrice)(0, true),
            helpLabel: "pricing.upgradeLater_msg",
            features: function () { return [
                LanguageViewModel_1.lang.get("pricing.comparisonUsersFree_msg"),
                LanguageViewModel_1.lang.get("pricing.comparisonStorage_msg", {
                    "{amount}": 1
                }),
                LanguageViewModel_1.lang.get("pricing.comparisonDomainFree_msg"),
                LanguageViewModel_1.lang.get("pricing.comparisonSearchFree_msg"),
                LanguageViewModel_1.lang.get("pricing.comparisonOneCalendar_msg"),
            ]; },
            width: selectorAttrs.boxWidth,
            height: selectorAttrs.boxHeight,
            paymentInterval: null,
            showReferenceDiscount: selectorAttrs.isInitialUpgrade
        };
    };
    SubscriptionSelector.prototype.createBuyOptionBoxAttr = function (selectorAttrs, targetSubscription) {
        var planPrices = (0, SubscriptionUtils_1.getPlanPrices)(selectorAttrs.planPrices, targetSubscription);
        if (!planPrices) {
            // no prices for the plan means subscription === SubscriptionType.Free (special case)
            return this.createFreeBuyOptionBoxAttr(selectorAttrs);
        }
        var showAdditionallyBookedFeatures = false;
        if (selectorAttrs.currentSubscriptionType) {
            showAdditionallyBookedFeatures = !(0, SubscriptionUtils_1.isDowngrade)(targetSubscription, selectorAttrs.currentSubscriptionType);
        }
        var targetSubscriptionConfig = SubscriptionUtils_1.subscriptions[targetSubscription];
        var additionalUserPrice = (0, PriceUtils_1.getSubscriptionPrice)(selectorAttrs, targetSubscription, "3" /* UpgradePriceType.AdditionalUserPrice */);
        var premiumFeatures = [
            LanguageViewModel_1.lang.get("pricing.comparisonAddUser_msg", {
                "{1}": (0, PriceUtils_1.formatMonthlyPrice)(additionalUserPrice, selectorAttrs.options.paymentInterval())
            }),
            LanguageViewModel_1.lang.get("pricing.comparisonStorage_msg", {
                "{amount}": planPrices.includedStorage
            }),
            LanguageViewModel_1.lang.get(targetSubscriptionConfig.business || (selectorAttrs.currentlyBusinessOrdered && showAdditionallyBookedFeatures)
                ? "pricing.comparisonDomainBusiness_msg"
                : "pricing.comparisonDomainPremium_msg"),
            LanguageViewModel_1.lang.get("pricing.comparisonSearchPremium_msg"),
            LanguageViewModel_1.lang.get("pricing.comparisonMultipleCalendars_msg"),
            LanguageViewModel_1.lang.get("pricing.mailAddressAliasesShort_label", {
                "{amount}": planPrices.includedAliases
            }),
            LanguageViewModel_1.lang.get("pricing.comparisonInboxRulesPremium_msg"),
            LanguageViewModel_1.lang.get(targetSubscription === "Pro" /* SubscriptionType.Pro */ ? "pricing.comparisonSupportPro_msg" : "pricing.comparisonSupportPremium_msg"),
        ];
        var sharingFeature = [LanguageViewModel_1.lang.get("pricing.comparisonSharingCalendar_msg")];
        var businessFeatures = [
            LanguageViewModel_1.lang.get("pricing.comparisonOutOfOffice_msg"),
            LanguageViewModel_1.lang.get("pricing.comparisonEventInvites_msg"),
            LanguageViewModel_1.lang.get("pricing.businessTemplates_msg"),
        ];
        var contactFormPrice = (0, PriceUtils_1.getSubscriptionPrice)(selectorAttrs, targetSubscription, "4" /* UpgradePriceType.ContactFormPrice */);
        var whitelabelFeatures = [
            LanguageViewModel_1.lang.get("pricing.comparisonLoginPro_msg"),
            LanguageViewModel_1.lang.get("pricing.comparisonThemePro_msg"),
            LanguageViewModel_1.lang.get("pricing.comparisonContactFormPro_msg", {
                "{price}": (0, PriceUtils_1.formatMonthlyPrice)(contactFormPrice, selectorAttrs.options.paymentInterval())
            }),
        ];
        var featuresToBeOrdered = premiumFeatures
            .concat(targetSubscriptionConfig.business || (showAdditionallyBookedFeatures && selectorAttrs.currentlyBusinessOrdered) ? businessFeatures : [])
            .concat(targetSubscriptionConfig.sharing || (showAdditionallyBookedFeatures && selectorAttrs.currentlySharingOrdered) ? sharingFeature : [])
            .concat(targetSubscriptionConfig.whitelabel || (showAdditionallyBookedFeatures && selectorAttrs.currentlyWhitelabelOrdered) ? whitelabelFeatures : []);
        // we only highlight the private Premium box if this is a signup or the current subscription type is Free
        var highlightPremium = targetSubscription === "Premium" /* SubscriptionType.Premium */ &&
            !selectorAttrs.options.businessUse() &&
            (!selectorAttrs.currentSubscriptionType || selectorAttrs.currentSubscriptionType === "Free" /* SubscriptionType.Free */);
        var subscriptionPrice = (0, PriceUtils_1.getSubscriptionPrice)(selectorAttrs, targetSubscription, "1" /* UpgradePriceType.PlanActualPrice */);
        var formattedMonthlyPrice = (0, PriceUtils_1.formatMonthlyPrice)(subscriptionPrice, selectorAttrs.options.paymentInterval());
        return {
            heading: (0, SubscriptionUtils_1.getDisplayNameOfSubscriptionType)(targetSubscription),
            actionButton: selectorAttrs.currentSubscriptionType === targetSubscription
                ? (0, BuyOptionBox_1.getActiveSubscriptionActionButtonReplacement)()
                : (0, SubscriptionUtils_1.getActionButtonBySubscription)(selectorAttrs.actionButtons, targetSubscription),
            price: formattedMonthlyPrice,
            priceHint: getPriceHint(subscriptionPrice, selectorAttrs.options.paymentInterval()),
            helpLabel: selectorAttrs.options.businessUse() ? "pricing.basePriceExcludesTaxes_msg" : "pricing.basePriceIncludesTaxes_msg",
            features: function () { return featuresToBeOrdered; },
            width: selectorAttrs.boxWidth,
            height: selectorAttrs.boxHeight,
            paymentInterval: selectorAttrs.isInitialUpgrade ? selectorAttrs.options.paymentInterval : null,
            highlighted: highlightPremium,
            showReferenceDiscount: selectorAttrs.isInitialUpgrade
        };
    };
    return SubscriptionSelector;
}());
exports.SubscriptionSelector = SubscriptionSelector;
function getPriceHint(subscriptionPrice, paymentInterval) {
    if (subscriptionPrice > 0) {
        return (0, PriceUtils_1.isYearlyPayment)(paymentInterval) ? "pricing.perMonthPaidYearly_label" : "pricing.perMonth_label";
    }
    else {
        return "emptyString_msg";
    }
}
