"use strict";
exports.__esModule = true;
exports.CreditCardInput = exports.CreditCardAttrs = void 0;
var mithril_1 = require("mithril");
var stream_1 = require("mithril/stream");
var LanguageViewModel_1 = require("../misc/LanguageViewModel");
var TypeRefs_js_1 = require("../api/entities/sys/TypeRefs.js");
var TextField_js_1 = require("../gui/base/TextField.js");
var CreditCardAttrs = /** @class */ (function () {
    function CreditCardAttrs() {
        this.creditCardNumber = (0, stream_1["default"])("");
        this.cardHolderName = (0, stream_1["default"])("");
        this.cvv = (0, stream_1["default"])("");
        this.expirationDate = (0, stream_1["default"])("");
    }
    CreditCardAttrs.prototype.getCreditCardData = function () {
        var monthAndYear = this.expirationDate().split("/");
        var cc = (0, TypeRefs_js_1.createCreditCard)();
        cc.number = this.creditCardNumber();
        cc.cardHolderName = this.cardHolderName();
        cc.cvv = this.cvv();
        cc.expirationMonth = monthAndYear.length > 0 ? monthAndYear[0] : "";
        cc.expirationYear = monthAndYear.length > 1 ? monthAndYear[1] : "";
        return cc;
    };
    CreditCardAttrs.prototype.setCreditCardData = function (data) {
        if (data) {
            this.creditCardNumber(data.number);
            this.cardHolderName(data.cardHolderName);
            this.cvv(data.cvv);
            if (data.expirationMonth && data.expirationYear) {
                this.expirationDate(data.expirationMonth + "/" + data.expirationYear);
            }
        }
        else {
            this.creditCardNumber("");
            this.cardHolderName("");
            this.cvv("");
            this.expirationDate("");
        }
    };
    return CreditCardAttrs;
}());
exports.CreditCardAttrs = CreditCardAttrs;
var CreditCardInput = /** @class */ (function () {
    function CreditCardInput() {
    }
    CreditCardInput.prototype.view = function (vnode) {
        var attrs = vnode.attrs;
        return [
            (0, mithril_1["default"])(TextField_js_1.TextField, {
                label: "creditCardNumber_label",
                value: attrs.creditCardNumber(),
                oninput: attrs.creditCardNumber
            }),
            (0, mithril_1["default"])(TextField_js_1.TextField, {
                label: "creditCardCardHolderName_label",
                value: attrs.cardHolderName(),
                oninput: attrs.cardHolderName
            }),
            (0, mithril_1["default"])(TextField_js_1.TextField, {
                label: "creditCardCVV_label",
                value: attrs.cvv(),
                oninput: attrs.cvv
            }),
            (0, mithril_1["default"])(TextField_js_1.TextField, {
                label: "creditCardExpirationDate_label",
                helpLabel: function () { return LanguageViewModel_1.lang.get("creditCardExpirationDateFormat_msg"); },
                value: attrs.expirationDate(),
                oninput: attrs.expirationDate
            }),
        ];
    };
    return CreditCardInput;
}());
exports.CreditCardInput = CreditCardInput;
