"use strict";
exports.__esModule = true;
exports.ScrollSelectList = void 0;
var mithril_1 = require("mithril");
var LanguageViewModel_1 = require("../misc/LanguageViewModel");
var Icon_1 = require("./base/Icon");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var ScrollSelectList = /** @class */ (function () {
    function ScrollSelectList() {
        this.selectedItem = null;
    }
    ScrollSelectList.prototype.view = function (vnode) {
        var _this = this;
        var a = vnode.attrs;
        return (0, mithril_1["default"])(".flex.flex-column.scroll-no-overlay", (a.items.length > 0)
            ? a.items.map(function (item) { return _this.renderRow(item, vnode); })
            : (0, mithril_1["default"])(".row-selected.text-center.pt", LanguageViewModel_1.lang.get((0, tutanota_utils_1.resolveMaybeLazy)(a.emptyListMessage))));
    };
    ScrollSelectList.prototype.onupdate = function (vnode) {
        var newSelectedItem = vnode.attrs.selectedItem;
        if (newSelectedItem !== this.selectedItem) {
            this._onSelectionChanged(newSelectedItem, vnode.attrs.items, vnode.dom);
            // Ensures that redraw happens after selected item changed this guarantess that the selected item is focused correctly.
            // Selecting the correct item in the list requires that the (possible filtered) list needs render first and then we
            // can scroll to the new selected item. Therefore we call onSelectionChange in onupdate callback.
            mithril_1["default"].redraw();
        }
    };
    ScrollSelectList.prototype.renderRow = function (item, vnode) {
        var a = vnode.attrs;
        var isSelected = a.selectedItem === item;
        return (0, mithril_1["default"])(".flex.flex-column.click", {
            style: {
                maxWidth: a.width
            }
        }, [
            (0, mithril_1["default"])(".flex.template-list-row" + (isSelected ? ".row-selected" : ""), {
                onclick: function (e) {
                    a.onItemSelected(item);
                    e.stopPropagation();
                },
                ondblclick: function (e) {
                    a.onItemSelected(item);
                    a.onItemDoubleClicked(item);
                    e.stopPropagation();
                }
            }, [
                a.renderItem(item),
                isSelected
                    ? (0, mithril_1["default"])(Icon_1.Icon, {
                        icon: "ArrowForward" /* Icons.ArrowForward */,
                        style: {
                            marginTop: "auto",
                            marginBottom: "auto"
                        }
                    })
                    : (0, mithril_1["default"])("", {
                        style: {
                            width: "17.1px",
                            height: "16px"
                        }
                    }),
            ]),
        ]);
    };
    ScrollSelectList.prototype._onSelectionChanged = function (selectedItem, items, scrollDom) {
        this.selectedItem = selectedItem;
        if (selectedItem != null) {
            var selectedIndex = items.indexOf(selectedItem);
            if (selectedIndex !== -1) {
                var selectedDomElement = scrollDom.children.item(selectedIndex);
                if (selectedDomElement) {
                    selectedDomElement.scrollIntoView({
                        block: "nearest",
                        inline: "nearest"
                    });
                }
            }
        }
    };
    return ScrollSelectList;
}());
exports.ScrollSelectList = ScrollSelectList;
