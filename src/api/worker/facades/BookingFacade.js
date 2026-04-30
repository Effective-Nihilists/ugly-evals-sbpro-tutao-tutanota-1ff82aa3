"use strict";
exports.__esModule = true;
exports.BookingFacade = void 0;
var TutanotaConstants_1 = require("../../common/TutanotaConstants");
var TypeRefs_js_1 = require("../../entities/sys/TypeRefs.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Env_1 = require("../../common/Env");
var Services_1 = require("../../entities/sys/Services");
(0, Env_1.assertWorkerOrNode)();
var BookingFacade = /** @class */ (function () {
    function BookingFacade(serviceExecutor) {
        this.serviceExecutor = serviceExecutor;
    }
    /**
     * Provides the price for a given feature type and count.
     * @param  type The booking feature type, one of tutao.entity.tutanota.TutanotaConstants.BOOKING_ITEM_FEATURE_TYPE_*.
     * @param  count Number of items, may be negative.
     * @param  reactivate  If true a user or group is reactivated instead of created - not used for aliases, storage or branding
     * @param  paymentInterval. If not provided the customers payment interval is used.
     * @param  accountType The account type, one of tutao.entity.tutanota.TutanotaConstants.ACCOUNT_TYPE_*. If not provided, the customers account type is used.
     * @param  business Business or private.
     * @return Resolves to PriceServiceReturn or an exception if the loading failed.
     */
    BookingFacade.prototype.getPrice = function (type, count, reactivate) {
        var priceRequestData = (0, TypeRefs_js_1.createPriceRequestData)({
            featureType: type,
            count: String(count),
            reactivate: reactivate,
            paymentInterval: null,
            accountType: null,
            business: null
        });
        var serviceData = (0, TypeRefs_js_1.createPriceServiceData)({
            date: TutanotaConstants_1.Const.CURRENT_DATE,
            priceRequest: priceRequestData
        });
        return this.serviceExecutor.get(Services_1.PriceService, serviceData);
    };
    /**
     * Provides the price for a given feature type and count.
     * @return Resolves to PriceServiceReturn or an exception if the loading failed.
     */
    BookingFacade.prototype.getCurrentPrice = function () {
        var serviceData = (0, TypeRefs_js_1.createPriceServiceData)();
        return this.serviceExecutor.get(Services_1.PriceService, serviceData);
    };
    /**
     * Provides the price item from the given priceData for the given featureType. Returns null if no such item is available.
     * @param  priceData The given price data.
     * @param  featureType The booking item feature type
     * @return The price item or null
     */
    BookingFacade.prototype.getPriceItem = function (priceData, featureType) {
        var _a;
        if (priceData != null) {
            return (_a = (0, tutanota_utils_1.neverNull)(priceData).items.find(function (p) { return p.featureType === featureType; })) !== null && _a !== void 0 ? _a : null;
        }
        return null;
    };
    return BookingFacade;
}());
exports.BookingFacade = BookingFacade;
