"use strict";
exports.__esModule = true;
exports.SegmentControl = void 0;
var mithril_1 = require("mithril");
var size_1 = require("../size");
var SegmentControl = /** @class */ (function () {
    function SegmentControl() {
    }
    SegmentControl.prototype.view = function (vnode) {
        var _this = this;
        return [
            (0, mithril_1["default"])(".segmentControl.flex.center-horizontally.button-height", {
                role: "tablist"
            }, vnode.attrs.items.map(function (item) {
                return (0, mithril_1["default"])("button.segmentControlItem.flex.center-horizontally.center-vertically.text-ellipsis.small" +
                    (item.value === vnode.attrs.selectedValue ? ".segmentControl-border-active.content-accent-fg" : ".segmentControl-border"), {
                    style: {
                        flex: "0 1 " + (typeof vnode.attrs.itemMaxWidth !== "undefined" ? (0, size_1.px)(vnode.attrs.itemMaxWidth) : (0, size_1.px)(120))
                    },
                    title: item.name,
                    role: "tab",
                    "aria-selected": String(item.value === vnode.attrs.selectedValue),
                    onclick: function () { return _this._onSelected(item, vnode.attrs); }
                }, item.name);
            })),
        ];
    };
    SegmentControl.prototype._onSelected = function (item, attrs) {
        if (item.value !== attrs.selectedValue) {
            attrs.onValueSelected(item.value);
        }
    };
    return SegmentControl;
}());
exports.SegmentControl = SegmentControl;
