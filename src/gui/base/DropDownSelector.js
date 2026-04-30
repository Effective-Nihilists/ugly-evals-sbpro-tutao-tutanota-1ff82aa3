"use strict";
exports.__esModule = true;
exports.DropDownSelector = void 0;
var mithril_1 = require("mithril");
var TextField_js_1 = require("./TextField.js");
var Dropdown_js_1 = require("./Dropdown.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Env_1 = require("../../api/common/Env");
var IconButton_js_1 = require("./IconButton.js");
(0, Env_1.assertMainOrNode)();
var DropDownSelector = /** @class */ (function () {
    function DropDownSelector() {
    }
    DropDownSelector.prototype.view = function (vnode) {
        var a = vnode.attrs;
        return (0, mithril_1["default"])(TextField_js_1.TextField, {
            label: a.label,
            value: this.valueToText(a, a.selectedValue) || "",
            helpLabel: a.helpLabel,
            disabled: true,
            onclick: a.disabled ? tutanota_utils_1.noOp : this.createDropdown(a),
            "class": "click " + (a["class"] == null ? "mt" : a["class"]),
            injectionsRight: function () {
                return a.disabled
                    ? null
                    // This whole thing with the button is not ideal. We shouldn't have a proper button with its own state layer, we should have the whole
                    // selector be interactive. Just putting an icon here doesn't work either because the selector disappears from tabindex even if you set it
                    // explicitly (at least in FF).
                    // Ideally we should also set correct role ("option") and highlight only parts of what is not text field (without help text in the bottom.
                    // We could hack some of this in here, but we should probably redo it from scratch with the right HTML structure.
                    : (0, mithril_1["default"])(".flex.items-center.justify-center", {
                        style: {
                            width: "30px",
                            height: "30px"
                        }
                    }, (0, mithril_1["default"])(IconButton_js_1.IconButton, {
                        icon: (a.icon ? a.icon : "Expand" /* BootIcons.Expand */),
                        title: "show_action",
                        click: tutanota_utils_1.noOp,
                        size: 1 /* ButtonSize.Compact */
                    }));
            },
            doShowBorder: a.doShowBorder
        });
    };
    DropDownSelector.prototype.createDropdown = function (a) {
        return (0, Dropdown_js_1.createDropdown)({
            lazyButtons: function () {
                return a.items
                    .filter(function (item) { return item.selectable !== false; })
                    .map(function (item) {
                    return {
                        label: function () { return item.name; },
                        click: function () {
                            var _a;
                            (_a = a.selectionChangedHandler) === null || _a === void 0 ? void 0 : _a.call(a, item.value);
                            mithril_1["default"].redraw();
                        },
                        selected: a.selectedValue === item.value
                    };
                });
            }, width: a.dropdownWidth
        });
    };
    DropDownSelector.prototype.valueToText = function (a, value) {
        var selectedItem = a.items.find(function (item) { return item.value === a.selectedValue; });
        if (selectedItem) {
            return selectedItem.name;
        }
        else {
            console.log("Dropdown ".concat((0, tutanota_utils_1.lazyStringValue)(a.label), " couldn't find element for value: ").concat(String(JSON.stringify(value))));
            return null;
        }
    };
    return DropDownSelector;
}());
exports.DropDownSelector = DropDownSelector;
