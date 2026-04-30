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
exports.getLazyLoadedPayPalUrl = exports.show = void 0;
var mithril_1 = require("mithril");
var stream_1 = require("mithril/stream");
var Dialog_1 = require("../gui/base/Dialog");
var LanguageViewModel_1 = require("../misc/LanguageViewModel");
var CountryList_1 = require("../api/common/CountryList");
var PaymentMethodInput_1 = require("./PaymentMethodInput");
var InvoiceAndPaymentDataPage_1 = require("./InvoiceAndPaymentDataPage");
var size_1 = require("../gui/size");
var Formatter_1 = require("../misc/Formatter");
var ProgressDialog_1 = require("../gui/dialogs/ProgressDialog");
var TutanotaConstants_1 = require("../api/common/TutanotaConstants");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var TypeRefs_js_1 = require("../api/entities/sys/TypeRefs.js");
var MainLocator_1 = require("../api/main/MainLocator");
var Services_1 = require("../api/entities/sys/Services");
var DropDownSelector_js_1 = require("../gui/base/DropDownSelector.js");
/**
 * @returns {boolean} true if the payment data update was successful
 */
function show(customer, accountingInfo, price) {
    var _this = this;
    var payPalRequestUrl = getLazyLoadedPayPalUrl();
    var invoiceData = {
        invoiceAddress: (0, Formatter_1.formatNameAndAddress)(accountingInfo.invoiceName, accountingInfo.invoiceAddress),
        country: accountingInfo.invoiceCountry ? (0, CountryList_1.getByAbbreviation)(accountingInfo.invoiceCountry) : null,
        vatNumber: accountingInfo.invoiceVatIdNo
    };
    var subscriptionOptions = {
        businessUse: (0, stream_1["default"])((0, tutanota_utils_1.neverNull)(customer.businessUse)),
        paymentInterval: (0, stream_1["default"])(Number(accountingInfo.paymentInterval))
    };
    var paymentMethodInput = new PaymentMethodInput_1.PaymentMethodInput(subscriptionOptions, (0, stream_1["default"])(invoiceData.country), (0, tutanota_utils_1.neverNull)(accountingInfo), payPalRequestUrl);
    var availablePaymentMethods = paymentMethodInput.getVisiblePaymentMethods();
    var selectedPaymentMethod = accountingInfo.paymentMethod;
    paymentMethodInput.updatePaymentMethod(selectedPaymentMethod);
    var selectedPaymentMethodChangedHandler = function (value) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(value === TutanotaConstants_1.PaymentMethodType.Paypal && !payPalRequestUrl.isLoaded())) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, ProgressDialog_1.showProgressDialog)("pleaseWait_msg", payPalRequestUrl.getAsync())];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    selectedPaymentMethod = value;
                    paymentMethodInput.updatePaymentMethod(value);
                    return [2 /*return*/];
            }
        });
    }); };
    var didLinkPaypal = function () { return selectedPaymentMethod === TutanotaConstants_1.PaymentMethodType.Paypal && paymentMethodInput.isPaypalAssigned(); };
    return new Promise(function (resolve) {
        var confirmAction = function () {
            var error = paymentMethodInput.validatePaymentData();
            if (error) {
                Dialog_1.Dialog.message(error);
            }
            else {
                var finish = function (success) {
                    if (success) {
                        dialog.close();
                        resolve(true);
                    }
                };
                // updatePaymentData gets done when the big paypal button is clicked
                if (didLinkPaypal()) {
                    finish(true);
                }
                else {
                    (0, ProgressDialog_1.showProgressDialog)("updatePaymentDataBusy_msg", (0, InvoiceAndPaymentDataPage_1.updatePaymentData)(subscriptionOptions.paymentInterval(), invoiceData, paymentMethodInput.getPaymentData(), invoiceData.country, false, price + "", accountingInfo)).then(finish);
                }
            }
        };
        var dialog = Dialog_1.Dialog.showActionDialog({
            title: LanguageViewModel_1.lang.get("adminPayment_action"),
            child: {
                view: function () {
                    return (0, mithril_1["default"])("#changePaymentDataDialog", {
                        style: {
                            minHeight: (0, size_1.px)(310)
                        }
                    }, [
                        (0, mithril_1["default"])(DropDownSelector_js_1.DropDownSelector, {
                            label: "paymentMethod_label",
                            items: availablePaymentMethods,
                            selectedValue: selectedPaymentMethod,
                            selectionChangedHandler: selectedPaymentMethodChangedHandler,
                            dropdownWidth: 250
                        }),
                        (0, mithril_1["default"])(paymentMethodInput)
                    ]);
                }
            },
            okAction: confirmAction,
            // if they've just gone through the process of linking a paypal account, don't offer a cancel button
            allowCancel: function () { return !didLinkPaypal(); },
            okActionTextId: function () { return (didLinkPaypal() ? "close_alt" : "save_action"); },
            cancelAction: function () { return resolve(false); }
        });
    });
}
exports.show = show;
function getLazyLoadedPayPalUrl() {
    return new tutanota_utils_1.LazyLoaded(function () {
        var clientType = (0, TutanotaConstants_1.getClientType)();
        return MainLocator_1.locator.serviceExecutor.get(Services_1.PaymentDataService, (0, TypeRefs_js_1.createPaymentDataServiceGetData)({
            clientType: clientType
        })).then(function (result) {
            return result.loginUrl;
        });
    });
}
exports.getLazyLoadedPayPalUrl = getLazyLoadedPayPalUrl;
