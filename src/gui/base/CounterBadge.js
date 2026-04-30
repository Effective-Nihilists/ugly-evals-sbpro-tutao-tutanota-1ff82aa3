"use strict";
exports.__esModule = true;
exports.CounterBadge = void 0;
var mithril_1 = require("mithril");
var CounterBadge = /** @class */ (function () {
    function CounterBadge(vnode) {
        this._hovered = false;
        this._hovered = false;
    }
    CounterBadge.prototype.view = function (vnode) {
        var _this = this;
        var _a = vnode.attrs, count = _a.count, position = _a.position, background = _a.background, color = _a.color;
        return count > 0
            ? (0, mithril_1["default"])(".counter-badge.z2", {
                onmouseenter: function () {
                    _this._hovered = true;
                },
                onmouseleave: function () {
                    _this._hovered = false;
                },
                style: {
                    width: position.width,
                    top: position.top,
                    bottom: position.bottom,
                    right: position.right,
                    left: position.left,
                    height: position.height,
                    "z-index": position.zIndex,
                    background: background,
                    color: color
                }
            }, count < 99 || this._hovered ? count : "99+")
            : null;
    };
    return CounterBadge;
}());
exports.CounterBadge = CounterBadge;
