"use strict";
exports.__esModule = true;
exports.InvoiceDataInput = exports.InvoiceDataInputLocation = void 0;
var mithril_1 = require("mithril");
var LanguageViewModel_1 = require("../misc/LanguageViewModel");
var CountryList_1 = require("../api/common/CountryList");
var HtmlEditor_1 = require("../gui/editor/HtmlEditor");
var GuiUtils_1 = require("../gui/base/GuiUtils");
var TextField_js_1 = require("../gui/base/TextField.js");
var Services_1 = require("../api/entities/sys/Services");
var MainLocator_1 = require("../api/main/MainLocator");
var stream_1 = require("mithril/stream");
var InvoiceDataInputLocation;
(function (InvoiceDataInputLocation) {
    InvoiceDataInputLocation[InvoiceDataInputLocation["InWizard"] = 0] = "InWizard";
    InvoiceDataInputLocation[InvoiceDataInputLocation["Other"] = 1] = "Other";
})(InvoiceDataInputLocation = exports.InvoiceDataInputLocation || (exports.InvoiceDataInputLocation = {}));
var InvoiceDataInput = /** @class */ (function () {
    function InvoiceDataInput(businessUse, invoiceData, location) {
        if (location === void 0) { location = InvoiceDataInputLocation.Other; }
        this.businessUse = businessUse;
        this.location = location;
        this.vatNumber = "";
        this.invoiceAddressComponent = new HtmlEditor_1.HtmlEditor()
            .setMinHeight(120)
            .showBorders()
            .setPlaceholderId("invoiceAddress_label")
            .setMode(HtmlEditor_1.HtmlEditorMode.HTML)
            .setHtmlMonospace(false)
            .setValue(invoiceData.invoiceAddress);
        this.selectedCountry = (0, stream_1["default"])(invoiceData.country);
        this.view = this.view.bind(this);
        this.oncreate = this.oncreate.bind(this);
    }
    InvoiceDataInput.prototype.view = function () {
        var _this = this;
        return [
            this.businessUse || this.location !== InvoiceDataInputLocation.InWizard
                ? (0, mithril_1["default"])("", [
                    (0, mithril_1["default"])(".pt", (0, mithril_1["default"])(this.invoiceAddressComponent)),
                    (0, mithril_1["default"])(".small", LanguageViewModel_1.lang.get(this.businessUse ? "invoiceAddressInfoBusiness_msg" : "invoiceAddressInfoPrivate_msg")),
                ])
                : null,
            (0, GuiUtils_1.renderCountryDropdown)({
                selectedCountry: this.selectedCountry(),
                onSelectionChanged: this.selectedCountry,
                helpLabel: function () { return LanguageViewModel_1.lang.get("invoiceCountryInfoConsumer_msg"); }
            }),
            this.isVatIdFieldVisible()
                ? (0, mithril_1["default"])(TextField_js_1.TextField, {
                    label: "invoiceVatIdNo_label",
                    value: this.vatNumber,
                    oninput: function (value) { return _this.vatNumber = value; },
                    helpLabel: function () { return LanguageViewModel_1.lang.get("invoiceVatIdNoInfoBusiness_msg"); }
                })
                : null,
        ];
    };
    InvoiceDataInput.prototype.oncreate = function () {
        var _this = this;
        MainLocator_1.locator.serviceExecutor.get(Services_1.LocationService, null).then(function (location) {
            if (!_this.selectedCountry()) {
                var country = CountryList_1.Countries.find(function (c) { return c.a === location.country; });
                if (country) {
                    _this.selectedCountry(country);
                    mithril_1["default"].redraw();
                }
            }
        });
    };
    InvoiceDataInput.prototype.validateInvoiceData = function () {
        var address = this.getAddress();
        var countrySelected = this.selectedCountry() != null;
        if (this.businessUse) {
            if (address.trim() === "" || address.split("\n").length > 5) {
                return "invoiceAddressInfoBusiness_msg";
            }
            else if (!countrySelected) {
                return "invoiceCountryInfoBusiness_msg";
            }
        }
        else {
            if (!countrySelected) {
                return "invoiceCountryInfoBusiness_msg"; // use business text here because it fits better
            }
            else if (address.split("\n").length > 4) {
                return "invoiceAddressInfoBusiness_msg";
            }
        }
        // no error
        return null;
    };
    InvoiceDataInput.prototype.getInvoiceData = function () {
        var address = this.getAddress();
        var selectedCountry = this.selectedCountry();
        return {
            invoiceAddress: address,
            country: selectedCountry,
            vatNumber: (selectedCountry === null || selectedCountry === void 0 ? void 0 : selectedCountry.t) === CountryList_1.CountryType.EU && this.businessUse ? this.vatNumber : ""
        };
    };
    InvoiceDataInput.prototype.isVatIdFieldVisible = function () {
        var selectedCountry = this.selectedCountry();
        return this.businessUse && selectedCountry != null && selectedCountry.t === CountryList_1.CountryType.EU;
    };
    InvoiceDataInput.prototype.getAddress = function () {
        return this.invoiceAddressComponent.getValue()
            .split("\n")
            .filter(function (line) { return line.trim().length > 0; })
            .join("\n");
    };
    return InvoiceDataInput;
}());
exports.InvoiceDataInput = InvoiceDataInput;
