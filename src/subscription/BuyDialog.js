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
exports.showBuyDialogToBookItem = exports.showBusinessBuyDialog = exports.showSharingBuyDialog = exports.showWhitelabelBuyDialog = exports.showBuyDialog = void 0;
var mithril_1 = require("mithril");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var TextField_js_1 = require("../gui/base/TextField.js");
var Dialog_js_1 = require("../gui/base/Dialog.js");
var LanguageViewModel_js_1 = require("../misc/LanguageViewModel.js");
var TutanotaConstants_js_1 = require("../api/common/TutanotaConstants.js");
var Formatter_js_1 = require("../misc/Formatter.js");
var TypeRefs_js_1 = require("../api/entities/sys/TypeRefs.js");
var TypeRefs_js_2 = require("../api/entities/sys/TypeRefs.js");
var TypeRefs_js_3 = require("../api/entities/sys/TypeRefs.js");
var LoginController_js_1 = require("../api/main/LoginController.js");
var RestError_js_1 = require("../api/common/error/RestError.js");
var PriceUtils_js_1 = require("./PriceUtils.js");
var SubscriptionUtils_js_1 = require("./SubscriptionUtils.js");
var ProgressDialog_js_1 = require("../gui/dialogs/ProgressDialog.js");
var MainLocator_js_1 = require("../api/main/MainLocator.js");
var Env_js_1 = require("../api/common/Env.js");
(0, Env_js_1.assertMainOrNode)();
/**
 * Returns true if the order is accepted by the user, false otherwise.
 */
function showBuyDialog(params) {
    return __awaiter(this, void 0, void 0, function () {
        var priceChangeModel;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (LoginController_js_1.logins.isEnabled(TutanotaConstants_js_1.FeatureType.HideBuyDialogs)) {
                        return [2 /*return*/, true];
                    }
                    return [4 /*yield*/, (0, ProgressDialog_js_1.showProgressDialog)("pleaseWait_msg", prepareDialog(params))];
                case 1:
                    priceChangeModel = _a.sent();
                    if (priceChangeModel) {
                        return [2 /*return*/, showDialog(priceChangeModel.getActionLabel(), function () { return (0, mithril_1["default"])(ConfirmSubscriptionView, { priceChangeModel: priceChangeModel, count: params.count, freeAmount: params.freeAmount }); })];
                    }
                    else {
                        return [2 /*return*/, false];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.showBuyDialog = showBuyDialog;
function prepareDialog(_a) {
    var featureType = _a.featureType, count = _a.count, reactivate = _a.reactivate;
    return __awaiter(this, void 0, void 0, function () {
        var customer, price, priceChangeModel, customerInfo, accountingInfo, confirm_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, MainLocator_js_1.locator.entityClient.load(TypeRefs_js_1.CustomerTypeRef, (0, tutanota_utils_1.neverNull)(LoginController_js_1.logins.getUserController().user.customer))];
                case 1:
                    customer = _b.sent();
                    if (!(customer.type === TutanotaConstants_js_1.AccountType.PREMIUM && customer.canceledPremiumAccount)) return [3 /*break*/, 3];
                    return [4 /*yield*/, Dialog_js_1.Dialog.message("subscriptionCancelledMessage_msg")];
                case 2:
                    _b.sent();
                    return [2 /*return*/, null];
                case 3: return [4 /*yield*/, MainLocator_js_1.locator.bookingFacade.getPrice(featureType, count, reactivate)];
                case 4:
                    price = _b.sent();
                    priceChangeModel = new PriceChangeModel(price, featureType);
                    return [4 /*yield*/, MainLocator_js_1.locator.entityClient.load(TypeRefs_js_2.CustomerInfoTypeRef, customer.customerInfo)];
                case 5:
                    customerInfo = _b.sent();
                    return [4 /*yield*/, MainLocator_js_1.locator.entityClient
                            .load(TypeRefs_js_3.AccountingInfoTypeRef, customerInfo.accountingInfo)["catch"]((0, tutanota_utils_1.ofClass)(RestError_js_1.NotAuthorizedError, function () { return null; }))];
                case 6:
                    accountingInfo = _b.sent();
                    if (!(accountingInfo && accountingInfo.paymentMethod == null)) return [3 /*break*/, 8];
                    return [4 /*yield*/, Dialog_js_1.Dialog.confirm("enterPaymentDataFirst_msg")];
                case 7:
                    confirm_1 = _b.sent();
                    if (confirm_1) {
                        mithril_1["default"].route.set("/settings/invoice");
                    }
                    return [2 /*return*/, null];
                case 8: return [2 /*return*/, priceChangeModel];
            }
        });
    });
}
/**
 * Shows the buy dialog to enable or disable the whitelabel package.
 * @param enable true if the whitelabel package should be enabled otherwise false.
 * @returns false if the execution was successful. True if the action has been cancelled by user or the precondition has failed.
 */
function showWhitelabelBuyDialog(enable) {
    return showBuyDialogToBookItem(TutanotaConstants_js_1.BookingItemFeatureType.Whitelabel, enable ? 1 : 0);
}
exports.showWhitelabelBuyDialog = showWhitelabelBuyDialog;
/**
 * Shows the buy dialog to enable or disable the sharing package.
 * @param enable true if the whitelabel package should be enabled otherwise false.
 * @returns false if the execution was successful. True if the action has been cancelled by user or the precondition has failed.
 */
function showSharingBuyDialog(enable) {
    return __awaiter(this, void 0, void 0, function () {
        var ok, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!enable) return [3 /*break*/, 1];
                    _a = true;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, Dialog_js_1.Dialog.confirm("sharingDeletionWarning_msg")];
                case 2:
                    _a = _b.sent();
                    _b.label = 3;
                case 3:
                    ok = _a;
                    if (ok) {
                        return [2 /*return*/, showBuyDialogToBookItem(TutanotaConstants_js_1.BookingItemFeatureType.Sharing, enable ? 1 : 0)];
                    }
                    else {
                        return [2 /*return*/, true];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.showSharingBuyDialog = showSharingBuyDialog;
/**
 * Shows the buy dialog to enable or disable the business package.
 * @param enable true if the business package should be enabled otherwise false.
 * @returns false if the execution was successful. True if the action has been cancelled by user or the precondition has failed.
 */
function showBusinessBuyDialog(enable) {
    return __awaiter(this, void 0, void 0, function () {
        var ok, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!enable) return [3 /*break*/, 1];
                    _a = true;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, Dialog_js_1.Dialog.confirm("businessDeletionWarning_msg")];
                case 2:
                    _a = _b.sent();
                    _b.label = 3;
                case 3:
                    ok = _a;
                    if (ok) {
                        return [2 /*return*/, showBuyDialogToBookItem(TutanotaConstants_js_1.BookingItemFeatureType.Business, enable ? 1 : 0)];
                    }
                    else {
                        return [2 /*return*/, true];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.showBusinessBuyDialog = showBusinessBuyDialog;
/**
 * @returns True if it failed, false otherwise
 */
function showBuyDialogToBookItem(bookingItemFeatureType, count, freeAmount, reactivate) {
    if (freeAmount === void 0) { freeAmount = 0; }
    if (reactivate === void 0) { reactivate = false; }
    return __awaiter(this, void 0, void 0, function () {
        var accepted;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, showBuyDialog({ featureType: bookingItemFeatureType, count: count, freeAmount: freeAmount, reactivate: reactivate })];
                case 1:
                    accepted = _a.sent();
                    if (accepted) {
                        return [2 /*return*/, (0, SubscriptionUtils_js_1.bookItem)(bookingItemFeatureType, count)];
                    }
                    else {
                        return [2 /*return*/, true];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.showBuyDialogToBookItem = showBuyDialogToBookItem;
function showDialog(okLabel, view) {
    return new Promise(function (resolve) {
        var dialog;
        var doAction = function (res) {
            dialog.close();
            resolve(res);
        };
        dialog = Dialog_js_1.Dialog.showActionDialog({
            okActionTextId: okLabel,
            title: function () { return LanguageViewModel_js_1.lang.get("bookingSummary_label"); },
            child: function () { return view(); },
            okAction: function () { return doAction(true); },
            cancelAction: function () { return doAction(false); },
            type: "EditSmall" /* DialogType.EditSmall */
        });
    });
}
var ConfirmSubscriptionView = /** @class */ (function () {
    function ConfirmSubscriptionView() {
    }
    ConfirmSubscriptionView.prototype.view = function (_a) {
        var _this = this;
        var attrs = _a.attrs;
        var priceChangeModel = attrs.priceChangeModel, count = attrs.count, freeAmount = attrs.freeAmount;
        var chargeDate = (0, tutanota_utils_1.incrementDate)(priceChangeModel.periodEndDate(), 1);
        return (0, mithril_1["default"])("", [
            (0, mithril_1["default"])(TextField_js_1.TextField, {
                label: "bookingOrder_label",
                value: this.getBookingText(priceChangeModel, count, freeAmount),
                type: "area" /* TextFieldType.Area */,
                disabled: true
            }),
            priceChangeModel.isBuy()
                ? (0, mithril_1["default"])(TextField_js_1.TextField, {
                    label: "subscription_label",
                    helpLabel: function () { return LanguageViewModel_js_1.lang.get("nextChargeOn_label", { "{chargeDate}": (0, Formatter_js_1.formatDate)(chargeDate) }); },
                    value: this.getSubscriptionText(priceChangeModel),
                    disabled: true
                })
                : null,
            (0, mithril_1["default"])(TextField_js_1.TextField, {
                label: "price_label",
                helpLabel: function () { return _this.getPriceInfoText(priceChangeModel); },
                value: this.getPriceText(priceChangeModel),
                disabled: true
            }),
        ]);
    };
    ConfirmSubscriptionView.prototype.getBookingText = function (model, count, freeAmount) {
        if (model.isSinglePriceType()) {
            switch (model.featureType) {
                case TutanotaConstants_js_1.BookingItemFeatureType.Users:
                    if (count > 0) {
                        var additionalFeatureLabels = [];
                        if (model.additionalFeatures.has(TutanotaConstants_js_1.BookingItemFeatureType.Whitelabel)) {
                            additionalFeatureLabels.push(LanguageViewModel_js_1.lang.get("whitelabelFeature_label"));
                        }
                        if (model.additionalFeatures.has(TutanotaConstants_js_1.BookingItemFeatureType.Sharing)) {
                            additionalFeatureLabels.push(LanguageViewModel_js_1.lang.get("sharingFeature_label"));
                        }
                        if (model.additionalFeatures.has(TutanotaConstants_js_1.BookingItemFeatureType.Business)) {
                            additionalFeatureLabels.push(LanguageViewModel_js_1.lang.get("businessFeature_label"));
                        }
                        if (additionalFeatureLabels.length > 0) {
                            return count + " " + LanguageViewModel_js_1.lang.get("bookingItemUsersIncluding_label") + " " + additionalFeatureLabels.join(", ");
                        }
                        else {
                            return count + " " + LanguageViewModel_js_1.lang.get("bookingItemUsers_label");
                        }
                    }
                    else {
                        return LanguageViewModel_js_1.lang.get("cancelUserAccounts_label", {
                            "{1}": Math.abs(count)
                        });
                    }
                case TutanotaConstants_js_1.BookingItemFeatureType.Whitelabel:
                    if (count > 0) {
                        return LanguageViewModel_js_1.lang.get("whitelabelBooking_label", { "{1}": model.getFutureCount() });
                    }
                    else {
                        return LanguageViewModel_js_1.lang.get("cancelWhitelabelBooking_label", { "{1}": model.getCurrentCount() });
                    }
                case TutanotaConstants_js_1.BookingItemFeatureType.Sharing:
                    if (count > 0) {
                        return LanguageViewModel_js_1.lang.get("sharingBooking_label", {
                            "{1}": model.getFutureCount()
                        });
                    }
                    else {
                        return LanguageViewModel_js_1.lang.get("cancelSharingBooking_label", {
                            "{1}": model.getCurrentCount()
                        });
                    }
                case TutanotaConstants_js_1.BookingItemFeatureType.Business:
                    if (count > 0) {
                        return LanguageViewModel_js_1.lang.get("businessBooking_label", {
                            "{1}": model.getFutureCount()
                        });
                    }
                    else {
                        return LanguageViewModel_js_1.lang.get("cancelBusinessBooking_label", {
                            "{1}": model.getCurrentCount()
                        });
                    }
                case TutanotaConstants_js_1.BookingItemFeatureType.ContactForm:
                    if (count > 0) {
                        return count + " " + LanguageViewModel_js_1.lang.get("contactForm_label");
                    }
                    else {
                        return LanguageViewModel_js_1.lang.get("cancelContactForm_label");
                    }
                case TutanotaConstants_js_1.BookingItemFeatureType.SharedMailGroup:
                    if (count > 0) {
                        return count + " " + LanguageViewModel_js_1.lang.get(count === 1 ? "sharedMailbox_label" : "sharedMailboxes_label");
                    }
                    else {
                        return LanguageViewModel_js_1.lang.get("cancelSharedMailbox_label");
                    }
                case TutanotaConstants_js_1.BookingItemFeatureType.LocalAdminGroup:
                    if (count > 0) {
                        return count + " " + LanguageViewModel_js_1.lang.get(count === 1 ? "localAdminGroup_label" : "localAdminGroups_label");
                    }
                    else {
                        return LanguageViewModel_js_1.lang.get("cancelLocalAdminGroup_label");
                    }
                default:
                    return "";
            }
        }
        else {
            var newPackageCount = 0;
            if (model.futureItem != null) {
                newPackageCount = model.getFutureCount();
            }
            var visibleAmount = Math.max(count, freeAmount);
            switch (model.featureType) {
                case TutanotaConstants_js_1.BookingItemFeatureType.Storage:
                    if (count < 1000) {
                        return LanguageViewModel_js_1.lang.get("storageCapacity_label") + " " + visibleAmount + " GB";
                    }
                    else {
                        return LanguageViewModel_js_1.lang.get("storageCapacity_label") + " " + visibleAmount / 1000 + " TB";
                    }
                case TutanotaConstants_js_1.BookingItemFeatureType.Users:
                    if (count > 0) {
                        return LanguageViewModel_js_1.lang.get("packageUpgradeUserAccounts_label", {
                            "{1}": newPackageCount
                        });
                    }
                    else {
                        return LanguageViewModel_js_1.lang.get("packageDowngradeUserAccounts_label", {
                            "{1}": newPackageCount
                        });
                    }
                case TutanotaConstants_js_1.BookingItemFeatureType.Alias:
                    return visibleAmount + " " + LanguageViewModel_js_1.lang.get("mailAddressAliases_label");
                default:
                    return "";
            }
        }
    };
    ConfirmSubscriptionView.prototype.getSubscriptionText = function (model) {
        if (model.isYearly()) {
            return LanguageViewModel_js_1.lang.get("pricing.yearly_label");
        }
        else {
            return LanguageViewModel_js_1.lang.get("pricing.monthly_label");
        }
    };
    ConfirmSubscriptionView.prototype.getPriceText = function (model) {
        var netGrossText = model.taxIncluded() ? LanguageViewModel_js_1.lang.get("gross_label") : LanguageViewModel_js_1.lang.get("net_label");
        var periodText = model.isYearly() ? LanguageViewModel_js_1.lang.get("pricing.perYear_label") : LanguageViewModel_js_1.lang.get("pricing.perMonth_label");
        var futurePriceNextPeriod = model.futurePrice;
        var currentPriceNextPeriod = model.currentPrice;
        if (model.isSinglePriceType()) {
            var priceDiff = futurePriceNextPeriod - currentPriceNextPeriod;
            return "".concat((0, PriceUtils_js_1.formatPrice)(priceDiff, true), " ").concat(periodText, " (").concat(netGrossText, ")");
        }
        else {
            return "".concat((0, PriceUtils_js_1.formatPrice)(futurePriceNextPeriod, true), " ").concat(periodText, " (").concat(netGrossText, ")");
        }
    };
    ConfirmSubscriptionView.prototype.getPriceInfoText = function (model) {
        if (model.isUnbuy()) {
            return LanguageViewModel_js_1.lang.get("priceChangeValidFrom_label", {
                "{1}": (0, Formatter_js_1.formatDate)(model.periodEndDate())
            });
        }
        else if (model.addedPriceForCurrentPeriod() > 0) {
            return LanguageViewModel_js_1.lang.get("priceForCurrentAccountingPeriod_label", {
                "{1}": (0, PriceUtils_js_1.formatPrice)(model.addedPriceForCurrentPeriod(), true)
            });
        }
        else {
            return "";
        }
    };
    return ConfirmSubscriptionView;
}());
var PriceChangeModel = /** @class */ (function () {
    function PriceChangeModel(price, featureType) {
        var _this = this;
        this.price = price;
        this.featureType = featureType;
        this.currentItem = (0, PriceUtils_js_1.getPriceItem)(price.currentPriceNextPeriod, featureType);
        this.futureItem = (0, PriceUtils_js_1.getPriceItem)(price.futurePriceNextPeriod, featureType);
        this.currentPrice = this.getPriceFromPriceData(price.currentPriceNextPeriod, featureType);
        this.futurePrice = this.getPriceFromPriceData(price.futurePriceNextPeriod, featureType);
        if (this.featureType === TutanotaConstants_js_1.BookingItemFeatureType.Users) {
            this.additionalFeatures = new Set([TutanotaConstants_js_1.BookingItemFeatureType.Whitelabel, TutanotaConstants_js_1.BookingItemFeatureType.Sharing, TutanotaConstants_js_1.BookingItemFeatureType.Business]
                .filter(function (f) { return _this.getFuturePrice(f) > 0; }));
        }
        else {
            this.additionalFeatures = new Set();
        }
    }
    PriceChangeModel.prototype.getActionLabel = function () {
        if (!this.isPriceChange()) {
            return "accept_action";
        }
        if (this.isBuy()) {
            return "buy_action";
        }
        return "order_action";
    };
    PriceChangeModel.prototype.isBuy = function () {
        return this.currentPrice < this.futurePrice;
    };
    PriceChangeModel.prototype.isUnbuy = function () {
        return this.currentPrice > this.futurePrice;
    };
    PriceChangeModel.prototype.isPriceChange = function () {
        return this.currentPrice !== this.futurePrice;
    };
    PriceChangeModel.prototype.isSinglePriceType = function () {
        return this.anyItem().singleType;
    };
    PriceChangeModel.prototype.getCurrentCount = function () {
        return (0, tutanota_utils_1.filterInt)((0, tutanota_utils_1.assertNotNull)(this.currentItem).count);
    };
    PriceChangeModel.prototype.getFutureCount = function () {
        return (0, tutanota_utils_1.filterInt)((0, tutanota_utils_1.assertNotNull)(this.futureItem).count);
    };
    PriceChangeModel.prototype.isYearly = function () {
        var _a;
        return (0, tutanota_utils_1.assertNotNull)((_a = this.price.futurePriceNextPeriod) !== null && _a !== void 0 ? _a : this.price.currentPriceNextPeriod).paymentInterval === "12";
    };
    PriceChangeModel.prototype.taxIncluded = function () {
        return (0, tutanota_utils_1.assertNotNull)(this.price.futurePriceNextPeriod).taxIncluded;
    };
    PriceChangeModel.prototype.periodEndDate = function () {
        // return a copy to prevent the date from being changed by the caller
        return new Date(this.price.periodEndDate);
    };
    PriceChangeModel.prototype.addedPriceForCurrentPeriod = function () {
        return this.price.currentPeriodAddedPrice ? (0, tutanota_utils_1.filterInt)(this.price.currentPeriodAddedPrice) : 0;
    };
    PriceChangeModel.prototype.anyItem = function () {
        var _a;
        return (0, tutanota_utils_1.assertNotNull)((_a = this.futureItem) !== null && _a !== void 0 ? _a : this.currentItem);
    };
    PriceChangeModel.prototype.getFuturePrice = function (featureType) {
        return this.getPriceFromPriceData(this.price.futurePriceNextPeriod, featureType);
    };
    /**
     * Returns the price for the feature type from the price data if available, otherwise 0.
     */
    PriceChangeModel.prototype.getPriceFromPriceData = function (priceData, featureType) {
        var item = (0, PriceUtils_js_1.getPriceItem)(priceData, featureType);
        var itemPrice = item ? Number(item.price) : 0;
        if (featureType === TutanotaConstants_js_1.BookingItemFeatureType.Users) {
            itemPrice += this.getPriceFromPriceData(priceData, TutanotaConstants_js_1.BookingItemFeatureType.Whitelabel);
            itemPrice += this.getPriceFromPriceData(priceData, TutanotaConstants_js_1.BookingItemFeatureType.Sharing);
            itemPrice += this.getPriceFromPriceData(priceData, TutanotaConstants_js_1.BookingItemFeatureType.Business);
        }
        return itemPrice;
    };
    return PriceChangeModel;
}());
