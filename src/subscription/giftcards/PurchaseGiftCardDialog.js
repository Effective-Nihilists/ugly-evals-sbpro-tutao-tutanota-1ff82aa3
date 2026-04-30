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
exports.showPurchaseGiftCardDialog = void 0;
var mithril_1 = require("mithril");
var Dialog_1 = require("../../gui/base/Dialog");
var LoginController_1 = require("../../api/main/LoginController");
var TypeRefs_js_1 = require("../../api/entities/sys/TypeRefs.js");
var ProgressDialog_1 = require("../../gui/dialogs/ProgressDialog");
var MainLocator_1 = require("../../api/main/MainLocator");
var BuyOptionBox_1 = require("../BuyOptionBox");
var Button_js_1 = require("../../gui/base/Button.js");
var SubscriptionUtils_1 = require("../SubscriptionUtils");
var GiftCardUtils_1 = require("./GiftCardUtils");
var ErrorHandlerImpl_1 = require("../../misc/ErrorHandlerImpl");
var UserError_1 = require("../../api/main/UserError");
var TutanotaConstants_1 = require("../../api/common/TutanotaConstants");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var RestError_1 = require("../../api/common/error/RestError");
var UpgradeSubscriptionWizard_1 = require("../UpgradeSubscriptionWizard");
var Icon_1 = require("../../gui/base/Icon");
var GiftCardMessageEditorField_1 = require("./GiftCardMessageEditorField");
var ClientDetector_1 = require("../../misc/ClientDetector");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Env_1 = require("../../api/common/Env");
var PriceUtils_1 = require("../PriceUtils");
var Services_1 = require("../../api/entities/sys/Services");
var PurchaseGiftCardModel = /** @class */ (function () {
    function PurchaseGiftCardModel(config) {
        this.config = config;
        this.message = LanguageViewModel_1.lang.get("defaultGiftCardMessage_msg");
        this.confirmed = false;
    }
    Object.defineProperty(PurchaseGiftCardModel.prototype, "availablePackages", {
        get: function () {
            return this.config.availablePackages;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PurchaseGiftCardModel.prototype, "purchaseLimit", {
        get: function () {
            return this.config.purchaseLimit;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PurchaseGiftCardModel.prototype, "purchasePeriodMonths", {
        get: function () {
            return this.config.purchasePeriodMonths;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PurchaseGiftCardModel.prototype, "selectedPackage", {
        get: function () {
            return this.config.selectedPackage;
        },
        set: function (selection) {
            this.config.selectedPackage = selection;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PurchaseGiftCardModel.prototype, "premiumPrice", {
        get: function () {
            return this.config.premiumPrice;
        },
        enumerable: false,
        configurable: true
    });
    PurchaseGiftCardModel.prototype.purchaseGiftCard = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!this.confirmed) {
                    throw new UserError_1.UserError("termsAcceptedNeutral_msg");
                }
                return [2 /*return*/, MainLocator_1.locator.giftCardFacade
                        .generateGiftCard(this.message, this.availablePackages[this.selectedPackage].value)
                        .then(function (createdGiftCardId) { return MainLocator_1.locator.entityClient.load(TypeRefs_js_1.GiftCardTypeRef, createdGiftCardId); })["catch"](function (e) { return _this.handlePurchaseError(e); })];
            });
        });
    };
    PurchaseGiftCardModel.prototype.handlePurchaseError = function (e) {
        var _this = this;
        if (e instanceof RestError_1.PreconditionFailedError) {
            var message = e.data;
            switch (message) {
                case "giftcard.limitreached":
                    throw new UserError_1.UserError(function () {
                        return LanguageViewModel_1.lang.get("tooManyGiftCards_msg", {
                            "{amount}": "".concat(_this.purchaseLimit),
                            "{period}": "".concat(_this.purchasePeriodMonths, " months")
                        });
                    });
                case "giftcard.noaccountinginfo":
                    throw new UserError_1.UserError("providePaymentDetails_msg");
                case "giftcard.invalidpaymentmethod":
                    throw new UserError_1.UserError("invalidGiftCardPaymentMethod_msg");
                default:
                    throw new UserError_1.UserError((0, SubscriptionUtils_1.getPreconditionFailedPaymentMsg)(e.data));
            }
        }
        else if (e instanceof RestError_1.BadGatewayError) {
            throw new UserError_1.UserError("paymentProviderNotAvailableError_msg");
        }
        else {
            throw e;
        }
    };
    return PurchaseGiftCardModel;
}());
var GiftCardPurchaseView = /** @class */ (function () {
    function GiftCardPurchaseView() {
    }
    GiftCardPurchaseView.prototype.view = function (vnode) {
        var _this = this;
        var _a = vnode.attrs, model = _a.model, onGiftCardPurchased = _a.onGiftCardPurchased;
        return [
            (0, mithril_1["default"])(".flex.center-horizontally.wrap", model.availablePackages.map(function (option, index) {
                var value = parseFloat(option.value);
                var withSubscriptionAmount = value - model.premiumPrice;
                return (0, mithril_1["default"])(BuyOptionBox_1.BuyOptionBox, {
                    heading: (0, mithril_1["default"])(".flex-center", Array(Math.pow(2, index)).fill((0, mithril_1["default"])(Icon_1.Icon, {
                        icon: "Gift" /* Icons.Gift */,
                        large: true
                    }))),
                    actionButton: function () {
                        return {
                            label: "pricing.select_action",
                            click: function () {
                                model.selectedPackage = index;
                            },
                            type: "login" /* ButtonType.Login */
                        };
                    },
                    price: (0, PriceUtils_1.formatPrice)(value, true),
                    helpLabel: function () {
                        return LanguageViewModel_1.lang.get(withSubscriptionAmount === 0 ? "giftCardOptionTextA_msg" : "giftCardOptionTextB_msg", {
                            "{remainingCredit}": (0, PriceUtils_1.formatPrice)(withSubscriptionAmount, true),
                            "{fullCredit}": (0, PriceUtils_1.formatPrice)(value, true)
                        });
                    },
                    features: function () { return []; },
                    width: 230,
                    height: 250,
                    paymentInterval: null,
                    highlighted: model.selectedPackage === index,
                    showReferenceDiscount: false
                });
            })),
            (0, mithril_1["default"])(".flex-center", (0, mithril_1["default"])(GiftCardMessageEditorField_1.GiftCardMessageEditorField, {
                message: model.message,
                onMessageChanged: function (message) { return model.message = message; }
            })),
            (0, mithril_1["default"])(".flex-center", (0, mithril_1["default"])(".flex-grow-shrink-auto.max-width-m.pt.pb.plr-l", [
                (0, mithril_1["default"])(".pt", (0, GiftCardUtils_1.renderAcceptGiftCardTermsCheckbox)(model.confirmed, function (checked) { return model.confirmed = checked; })),
                (0, mithril_1["default"])(".mt-l.mb-l", (0, mithril_1["default"])(Button_js_1.Button, {
                    label: "buy_action",
                    click: function () { return _this.onBuyButtonPressed(model, onGiftCardPurchased)["catch"]((0, tutanota_utils_1.ofClass)(UserError_1.UserError, ErrorHandlerImpl_1.showUserError)); },
                    type: "login" /* ButtonType.Login */
                })),
            ])),
        ];
    };
    GiftCardPurchaseView.prototype.onBuyButtonPressed = function (model, onPurchaseSuccess) {
        return __awaiter(this, void 0, void 0, function () {
            var giftCard;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, ProgressDialog_1.showProgressDialog)("loading_msg", model.purchaseGiftCard())];
                    case 1:
                        giftCard = _a.sent();
                        onPurchaseSuccess(giftCard);
                        return [2 /*return*/];
                }
            });
        });
    };
    return GiftCardPurchaseView;
}());
/**
 * Create a dialog to buy a giftcard or show error if the user cannot do so
 * @returns {Promise<unknown>|Promise<void>|Promise<Promise<void>>}
 */
function showPurchaseGiftCardDialog() {
    return __awaiter(this, void 0, void 0, function () {
        var model, dialog, header, content;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if ((0, Env_1.isIOSApp)()) {
                        return [2 /*return*/, Dialog_1.Dialog.message("notAvailableInApp_msg")];
                    }
                    return [4 /*yield*/, (0, ProgressDialog_1.showProgressDialog)("loading_msg", loadGiftCardModel())["catch"]((0, tutanota_utils_1.ofClass)(UserError_1.UserError, function (e) {
                            (0, ErrorHandlerImpl_1.showUserError)(e);
                            return null;
                        }))];
                case 1:
                    model = _a.sent();
                    if (model == null) {
                        return [2 /*return*/];
                    }
                    header = {
                        left: [
                            {
                                label: "close_alt",
                                type: "secondary" /* ButtonType.Secondary */,
                                click: function () { return dialog.close(); }
                            },
                        ],
                        middle: function () { return LanguageViewModel_1.lang.get("buyGiftCard_label"); }
                    };
                    content = {
                        view: function () { return (0, mithril_1["default"])(GiftCardPurchaseView, {
                            model: model,
                            onGiftCardPurchased: function (giftCard) {
                                dialog.close();
                                (0, GiftCardUtils_1.showGiftCardToShare)(giftCard);
                            }
                        }); }
                    };
                    dialog = Dialog_1.Dialog.largeDialog(header, content)
                        .addShortcut({
                        key: TutanotaConstants_1.Keys.ESC,
                        exec: function () { return dialog.close(); },
                        help: "close_alt"
                    });
                    if (ClientDetector_1.client.isMobileDevice()) {
                        // Prevent focusing text field automatically on mobile. It opens keyboard and you don't see all details.
                        dialog.setFocusOnLoadFunction(tutanota_utils_1.noOp);
                    }
                    dialog.show();
                    return [2 /*return*/];
            }
        });
    });
}
exports.showPurchaseGiftCardDialog = showPurchaseGiftCardDialog;
function loadGiftCardModel() {
    return __awaiter(this, void 0, void 0, function () {
        var accountingInfo, _a, giftCardInfo, customerInfo, prices, existingGiftCards, _b, sixMonthsAgo, numPurchasedGiftCards, priceData, subscriptionData;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, LoginController_1.logins
                        .getUserController()
                        .loadAccountingInfo()
                    // Only allow purchase with supported payment methods
                ];
                case 1:
                    accountingInfo = _c.sent();
                    // Only allow purchase with supported payment methods
                    if (!accountingInfo ||
                        accountingInfo.paymentMethod === TutanotaConstants_1.PaymentMethodType.Invoice ||
                        accountingInfo.paymentMethod === TutanotaConstants_1.PaymentMethodType.AccountBalance) {
                        throw new UserError_1.UserError("invalidGiftCardPaymentMethod_msg");
                    }
                    return [4 /*yield*/, Promise.all([
                            MainLocator_1.locator.serviceExecutor.get(Services_1.GiftCardService, null),
                            LoginController_1.logins.getUserController().loadCustomerInfo(),
                            (0, UpgradeSubscriptionWizard_1.loadUpgradePrices)(null), // do not pass in any campaign here because the gift card prices should be based on default prices.
                        ])
                        // User can't buy too many gift cards so we have to load their giftcards in order to check how many they ordered
                    ];
                case 2:
                    _a = _c.sent(), giftCardInfo = _a[0], customerInfo = _a[1], prices = _a[2];
                    if (!customerInfo.giftCards) return [3 /*break*/, 4];
                    return [4 /*yield*/, MainLocator_1.locator.entityClient.loadAll(TypeRefs_js_1.GiftCardTypeRef, customerInfo.giftCards.items)];
                case 3:
                    _b = _c.sent();
                    return [3 /*break*/, 5];
                case 4:
                    _b = [];
                    _c.label = 5;
                case 5:
                    existingGiftCards = _b;
                    sixMonthsAgo = new Date();
                    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - parseInt(giftCardInfo.period));
                    numPurchasedGiftCards = (0, tutanota_utils_1.count)(existingGiftCards, function (giftCard) { return giftCard.orderDate > sixMonthsAgo; });
                    if (numPurchasedGiftCards >= parseInt(giftCardInfo.maxPerPeriod)) {
                        throw new UserError_1.UserError(function () {
                            return LanguageViewModel_1.lang.get("tooManyGiftCards_msg", {
                                "{amount}": giftCardInfo.maxPerPeriod,
                                "{period}": "".concat(giftCardInfo.period, " months")
                            });
                        });
                    }
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
                    return [2 /*return*/, new PurchaseGiftCardModel({
                            purchaseLimit: (0, tutanota_utils_1.filterInt)(giftCardInfo.maxPerPeriod),
                            purchasePeriodMonths: (0, tutanota_utils_1.filterInt)(giftCardInfo.period),
                            availablePackages: giftCardInfo.options,
                            selectedPackage: Math.floor(giftCardInfo.options.length / 2),
                            premiumPrice: (0, PriceUtils_1.getSubscriptionPrice)(subscriptionData, "Premium" /* SubscriptionType.Premium */, "1" /* UpgradePriceType.PlanActualPrice */)
                        })];
            }
        });
    });
}
