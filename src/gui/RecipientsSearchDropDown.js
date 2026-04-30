"use strict";
exports.__esModule = true;
exports.RecipientsSearchDropDown = void 0;
var mithril_1 = require("mithril");
var GuiUtils_js_1 = require("./base/GuiUtils.js");
var size_js_1 = require("./size.js");
var WindowFacade_js_1 = require("../misc/WindowFacade.js");
var EntryHeight = 60;
var RecipientsSearchDropDown = /** @class */ (function () {
    function RecipientsSearchDropDown() {
        this.keyboardHeight = 0;
    }
    RecipientsSearchDropDown.prototype.oncreate = function () {
        var _this = this;
        WindowFacade_js_1.windowFacade.addKeyboardSizeListener(function (newSize) {
            // *-------------------*  -
            // |                   |  |
            // |   -------------   |  - <- top
            // |   |           |   |
            // |   |-----------|   |
            // |-------------------|  - <- keyboardHeight
            // | q w e r t z u i o |  |
            // | a s d f g h j k l |  -
            //
            // On iOS screen is not resized when keyboard is opened. Instead we send a signal to WebView with keyboard height.
            _this.keyboardHeight = newSize;
        });
    };
    RecipientsSearchDropDown.prototype.view = function (_a) {
        var _this = this;
        var _b;
        var attrs = _a.attrs;
        if (attrs.selectedSuggestionIndex !== attrs.selectedSuggestionIndex && this.domSuggestions) {
            requestAnimationFrame(function () {
                (0, GuiUtils_js_1.scrollListDom)(_this.domSuggestions, EntryHeight, attrs.selectedSuggestionIndex);
            });
        }
        // We need to calculate how much space can be actually used for the dropdown. We cannot just add margin like we do with dialog
        // because the suggestions dropdown is absolutely positioned.
        var dropdownHeight = EntryHeight * Math.min((_b = attrs.maxHeight) !== null && _b !== void 0 ? _b : Number.MAX_VALUE, attrs.suggestions.length);
        if (this.domSuggestions) {
            var top_1 = this.domSuggestions.getBoundingClientRect().top;
            var availableHeight = window.innerHeight - top_1 - this.keyboardHeight - size_js_1.size.vpad;
            dropdownHeight = Math.min(availableHeight, dropdownHeight);
        }
        return (0, mithril_1["default"])(".suggestions.abs.z4.full-width.elevated-bg.scroll.text-ellipsis".concat(attrs.suggestions.length ? ".dropdown-shadow" : ""), {
            oncreate: function (vnode) { return _this.domSuggestions = vnode.dom; },
            style: {
                transition: "height 0.2s",
                height: (0, size_js_1.px)(dropdownHeight)
            }
        }, attrs.suggestions.map(function (_a, idx) {
            var name = _a.name, address = _a.address;
            return _this.renderSuggestion(attrs, name, address, idx);
        }));
    };
    RecipientsSearchDropDown.prototype.renderSuggestion = function (attrs, name, mailAddress, idx) {
        var selected = idx === attrs.selectedSuggestionIndex;
        return (0, mithril_1["default"])(".pt-s.pb-s.click.content-hover", {
            "class": selected ? "content-accent-fg row-selected" : "",
            onmousedown: function () { return attrs.onSuggestionSelected(idx); },
            style: {
                "padding-left": selected ? (0, size_js_1.px)(size_js_1.size.hpad_large - 3) : (0, size_js_1.px)(size_js_1.size.hpad_large),
                "border-left": selected ? "3px solid" : null,
                height: (0, size_js_1.px)(EntryHeight)
            }
        }, [
            (0, mithril_1["default"])(".small.full-width.text-ellipsis", name),
            (0, mithril_1["default"])(".name.full-width.text-ellipsis", mailAddress)
        ]);
    };
    return RecipientsSearchDropDown;
}());
exports.RecipientsSearchDropDown = RecipientsSearchDropDown;
