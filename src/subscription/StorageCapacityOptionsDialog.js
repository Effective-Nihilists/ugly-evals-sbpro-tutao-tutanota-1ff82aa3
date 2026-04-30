"use strict";
exports.__esModule = true;
exports.showStorageCapacityOptionsDialog = void 0;
var mithril_1 = require("mithril");
var LanguageViewModel_1 = require("../misc/LanguageViewModel");
var TutanotaConstants_1 = require("../api/common/TutanotaConstants");
var BuyOptionBox_1 = require("./BuyOptionBox");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var SubscriptionUtils_1 = require("./SubscriptionUtils");
var TypeRefs_js_1 = require("../api/entities/sys/TypeRefs.js");
var TypeRefs_js_2 = require("../api/entities/sys/TypeRefs.js");
var LoginController_1 = require("../api/main/LoginController");
var Dialog_1 = require("../gui/base/Dialog");
var Button_js_1 = require("../gui/base/Button.js");
var BuyDialog_1 = require("./BuyDialog");
var ProgrammingError_1 = require("../api/common/error/ProgrammingError");
var MainLocator_1 = require("../api/main/MainLocator");
function showStorageCapacityOptionsDialog(storageWarningTextId) {
    var userController = LoginController_1.logins.getUserController();
    if (userController.isFreeAccount() || !userController.isGlobalAdmin()) {
        throw new ProgrammingError_1.ProgrammingError("changing storage options is only allowed for global admins of premium accounts");
    }
    return MainLocator_1.locator.entityClient
        .load(TypeRefs_js_1.CustomerTypeRef, (0, tutanota_utils_1.neverNull)(userController.user.customer))
        .then(function (customer) { return MainLocator_1.locator.entityClient.load(TypeRefs_js_2.CustomerInfoTypeRef, customer.customerInfo); })
        .then(function (customerInfo) {
        var freeStorageCapacity = Math.max(Number(customerInfo.includedStorageCapacity), Number(customerInfo.promotionStorageCapacity));
        return new Promise(function (resolve) {
            var changeStorageCapacityAction = function (amount) {
                dialog.close();
                (0, BuyDialog_1.showBuyDialog)({ featureType: TutanotaConstants_1.BookingItemFeatureType.Storage, count: amount, freeAmount: freeStorageCapacity, reactivate: false })
                    .then(function (confirm) {
                    if (confirm) {
                        return (0, SubscriptionUtils_1.buyStorage)(amount);
                    }
                })
                    .then(function () {
                    resolve();
                });
            };
            var cancelAction = function () {
                dialog.close();
                resolve();
            };
            var storageBuyOptionsAttrs = [
                createStorageCapacityBoxAttr(0, freeStorageCapacity, changeStorageCapacityAction),
                createStorageCapacityBoxAttr(10, freeStorageCapacity, changeStorageCapacityAction),
                createStorageCapacityBoxAttr(100, freeStorageCapacity, changeStorageCapacityAction),
                createStorageCapacityBoxAttr(1000, freeStorageCapacity, changeStorageCapacityAction),
            ]
                .filter(function (scb) { return scb.amount === 0 || scb.amount > freeStorageCapacity; })
                .map(function (scb) { return scb.buyOptionBoxAttr; });
            // filter needless buy options
            var headerBarAttrs = {
                middle: function () { return LanguageViewModel_1.lang.get("storageCapacity_label"); },
                right: [
                    {
                        label: "close_alt",
                        click: cancelAction,
                        type: "primary" /* ButtonType.Primary */
                    },
                ]
            };
            var dialog = Dialog_1.Dialog.largeDialog(headerBarAttrs, {
                view: function () { return [
                    (0, mithril_1["default"])(".pt-l.center.pb", storageWarningTextId ? (0, mithril_1["default"])(".b", LanguageViewModel_1.lang.get(storageWarningTextId)) : LanguageViewModel_1.lang.get("buyStorageCapacityInfo_msg")),
                    (0, mithril_1["default"])(".flex-center.flex-wrap", storageBuyOptionsAttrs.map(function (attr) { return (0, mithril_1["default"])(BuyOptionBox_1.BuyOptionBox, attr); })),
                ]; }
            })
                .addShortcut({
                key: TutanotaConstants_1.Keys.ESC,
                exec: cancelAction,
                help: "close_alt"
            })
                .setCloseHandler(cancelAction)
                .show();
        });
    });
}
exports.showStorageCapacityOptionsDialog = showStorageCapacityOptionsDialog;
function createStorageCapacityBoxAttr(amount, freeAmount, buyAction) {
    var attrs = {
        heading: formatStorageCapacity(Math.max(amount, freeAmount)),
        actionButton: {
            view: function () {
                return (0, mithril_1["default"])(Button_js_1.Button, {
                    label: "pricing.select_action",
                    type: "login" /* ButtonType.Login */,
                    click: function () { return buyAction(amount); }
                });
            }
        },
        price: LanguageViewModel_1.lang.get("emptyString_msg"),
        helpLabel: "emptyString_msg",
        features: function () { return []; },
        width: 230,
        height: 210,
        paymentInterval: null,
        showReferenceDiscount: false
    };
    (0, BuyOptionBox_1.updateBuyOptionBoxPriceInformation)(MainLocator_1.locator.bookingFacade, TutanotaConstants_1.BookingItemFeatureType.Storage, amount, attrs);
    return {
        amount: amount,
        buyOptionBoxAttr: attrs
    };
}
function formatStorageCapacity(amount) {
    if (amount < 1000) {
        return amount + " GB";
    }
    else {
        return amount / 1000 + " TB";
    }
}
