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
exports.updateBuyOptionBoxPriceInformation = exports.BuyOptionBox = exports.BOX_MARGIN = exports.getActiveSubscriptionActionButtonReplacement = void 0;
var mithril_1 = require("mithril");
var size_1 = require("../gui/size");
var LanguageViewModel_1 = require("../misc/LanguageViewModel");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Icon_1 = require("../gui/base/Icon");
var SegmentControl_1 = require("../gui/base/SegmentControl");
var Button_js_1 = require("../gui/base/Button.js");
var PriceUtils_1 = require("./PriceUtils");
var PaymentIntervalItems = [
    {
        name: LanguageViewModel_1.lang.get("pricing.yearly_label"),
        value: 12
    },
    {
        name: LanguageViewModel_1.lang.get("pricing.monthly_label"),
        value: 1
    },
];
function getActiveSubscriptionActionButtonReplacement() {
    return {
        view: function () {
            return (0, mithril_1["default"])(".buyOptionBox.content-accent-fg.center-vertically.text-center", {
                style: {
                    "border-radius": (0, size_1.px)(size_1.size.border_radius_small)
                }
            }, LanguageViewModel_1.lang.get("pricing.currentPlan_label"));
        }
    };
}
exports.getActiveSubscriptionActionButtonReplacement = getActiveSubscriptionActionButtonReplacement;
exports.BOX_MARGIN = 10;
var BuyOptionBox = /** @class */ (function () {
    function BuyOptionBox() {
    }
    BuyOptionBox.prototype.view = function (vnode) {
        return (0, mithril_1["default"])("", {
            style: {
                margin: (0, size_1.px)(exports.BOX_MARGIN),
                width: (0, size_1.px)(vnode.attrs.width),
                padding: "10px"
            }
        }, [
            (0, mithril_1["default"])(".buyOptionBox.border-radius-small" + (vnode.attrs.highlighted ? ".highlighted" : ""), {
                style: {
                    height: (0, size_1.px)(vnode.attrs.height)
                }
            }, [
                (vnode.attrs.paymentInterval ? (0, PriceUtils_1.isYearlyPayment)(vnode.attrs.paymentInterval()) : null)
                    ? (0, mithril_1["default"])(".ribbon-vertical", (0, mithril_1["default"])(".text-center.b.h4", {
                        style: {
                            "padding-top": (0, size_1.px)(22)
                        }
                    }, "%"))
                    : null,
                (0, mithril_1["default"])(".h4.text-center.dialog-header.dialog-header-line-height.flex.col.center-horizontally", {
                    style: {
                        // we need some margin for the discount banner for longer translations shown on the website
                        "margin-right": (0, size_1.px)(30),
                        "margin-left": (0, size_1.px)(30),
                        "line-height": 1
                    }
                }, vnode.attrs.heading),
                (0, mithril_1["default"])(".text-center.pt.flex.center-vertically.center-horizontally", [vnode.attrs.price ? (0, mithril_1["default"])("span.h1", vnode.attrs.price) : null]),
                (0, mithril_1["default"])(".small.text-center", vnode.attrs.priceHint ? LanguageViewModel_1.lang.getMaybeLazy(vnode.attrs.priceHint) : LanguageViewModel_1.lang.get("emptyString_msg")),
                (0, mithril_1["default"])(".small.text-center.pb-s", LanguageViewModel_1.lang.getMaybeLazy(vnode.attrs.helpLabel)),
                vnode.attrs.paymentInterval
                    ? (0, mithril_1["default"])(SegmentControl_1.SegmentControl, {
                        selectedValue: vnode.attrs.paymentInterval(),
                        onValueSelected: vnode.attrs.paymentInterval,
                        items: PaymentIntervalItems
                    })
                    : null,
                vnode.attrs.actionButton
                    ? (0, mithril_1["default"])(".button-min-height", {
                        style: {
                            position: "absolute",
                            bottom: (0, size_1.px)(10),
                            left: (0, size_1.px)(10),
                            right: (0, size_1.px)(10)
                        }
                    }, typeof vnode.attrs.actionButton === "function"
                        ? (0, mithril_1["default"])(Button_js_1.Button, vnode.attrs.actionButton())
                        : (0, mithril_1["default"])((0, tutanota_utils_1.neverNull)(vnode.attrs.actionButton)))
                    : null,
            ]),
            (0, mithril_1["default"])("div.mt.pl", vnode.attrs.features().map(function (f) {
                return (0, mithril_1["default"])(".flex", [
                    (0, mithril_1["default"])(Icon_1.Icon, {
                        icon: "Checkmark" /* Icons.Checkmark */,
                        style: {
                            "padding-top": "1px"
                        }
                    }),
                    (0, mithril_1["default"])(".smaller.left.align-self-center.pl-xs", {
                        style: {
                            height: (0, size_1.px)(40),
                            lineHeight: (0, size_1.px)(18)
                        }
                    }, f),
                ]);
            })),
        ]);
    };
    return BuyOptionBox;
}());
exports.BuyOptionBox = BuyOptionBox;
/**
 * Loads the price information for the given feature type/amount and updates the price information on the BuyOptionBox.
 */
function updateBuyOptionBoxPriceInformation(bookingFacade, featureType, amount, attrs) {
    return __awaiter(this, void 0, void 0, function () {
        var newPrice, futurePrice, paymentInterval, price;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, bookingFacade.getPrice(featureType, amount, false)];
                case 1:
                    newPrice = _a.sent();
                    if (amount === (0, PriceUtils_1.getCountFromPriceData)(newPrice.currentPriceNextPeriod, featureType)) {
                        attrs.actionButton = getActiveSubscriptionActionButtonReplacement();
                    }
                    futurePrice = newPrice.futurePriceNextPeriod;
                    if (futurePrice) {
                        paymentInterval = Number(futurePrice.paymentInterval);
                        price = (0, PriceUtils_1.getPriceFromPriceData)(futurePrice, featureType);
                        attrs.price = (0, PriceUtils_1.formatMonthlyPrice)(price, paymentInterval);
                        attrs.helpLabel = (0, PriceUtils_1.isYearlyPayment)(paymentInterval) ? "pricing.perMonthPaidYearly_label" : "pricing.perMonth_label";
                        mithril_1["default"].redraw();
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.updateBuyOptionBoxPriceInformation = updateBuyOptionBoxPriceInformation;
