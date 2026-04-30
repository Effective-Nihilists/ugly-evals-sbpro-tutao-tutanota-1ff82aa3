"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.PageSwipeHandler = exports.PageView = void 0;
var mithril_1 = require("mithril");
var SwipeHandler_1 = require("./SwipeHandler");
var Animations_1 = require("../animation/Animations");
var PageView = /** @class */ (function () {
    function PageView() {
        this._viewDom = null;
    }
    PageView.prototype.view = function (_a) {
        var _this = this;
        var attrs = _a.attrs;
        this._onChangePage = function (next) { return attrs.onChangePage(next); };
        return (0, mithril_1["default"])(".fill-absolute", {
            oncreate: function (vnode) {
                _this._viewDom = vnode.dom;
                _this._swipeHandler = new PageSwipeHandler(_this._viewDom, function (next) { return _this._onChangePage(next); });
            }
        }, [
            (0, mithril_1["default"])(".abs", {
                "aria-hidden": "true",
                key: attrs.previousPage.key,
                style: this._viewDom &&
                    this._viewDom.offsetWidth > 0 && {
                    width: this._viewDom.offsetWidth + "px",
                    height: this._viewDom.offsetHeight + "px",
                    transform: "translateX(".concat(-this._viewDom.offsetWidth, "px)")
                }
            }, attrs.previousPage.nodes),
            (0, mithril_1["default"])(".fill-absolute", {
                key: attrs.currentPage.key
            }, attrs.currentPage.nodes),
            (0, mithril_1["default"])(".abs", {
                "aria-hidden": "true",
                key: attrs.nextPage.key,
                style: this._viewDom &&
                    this._viewDom.offsetWidth > 0 && {
                    width: this._viewDom.offsetWidth + "px",
                    height: this._viewDom.offsetHeight + "px",
                    transform: "translateX(".concat(this._viewDom.offsetWidth, "px)")
                }
            }, attrs.nextPage.nodes),
        ]);
    };
    return PageView;
}());
exports.PageView = PageView;
var PageSwipeHandler = /** @class */ (function (_super) {
    __extends(PageSwipeHandler, _super);
    function PageSwipeHandler(touchArea, onGestureCompleted) {
        var _this = _super.call(this, touchArea) || this;
        _this._xoffset = 0;
        // avoid flickering especially in day and week view when overflow-y is set on nested elements
        touchArea.style.transformStyle = "preserve-3d";
        touchArea.style.backfaceVisibility = "hidden";
        _this._onGestureCompleted = onGestureCompleted;
        return _this;
    }
    PageSwipeHandler.prototype.onHorizontalDrag = function (xDelta, yDelta) {
        this._xoffset = Math.abs(xDelta) > 40 ? xDelta : 0;
        this.touchArea.style.transform = "translateX(".concat(this._xoffset, "px)");
    };
    PageSwipeHandler.prototype.onHorizontalGestureCompleted = function (delta) {
        var _this = this;
        if (Math.abs(delta.x) > 100) {
            this._xoffset = 0;
            return Animations_1.animations
                .add(this.touchArea, (0, Animations_1.transform)("translateX" /* TransformEnum.TranslateX */, delta.x, this.touchArea.offsetWidth * (delta.x > 0 ? 1 : -1)))
                .then(function () {
                _this._onGestureCompleted(delta.x < 0);
                requestAnimationFrame(function () {
                    _this.touchArea.style.transform = "";
                });
            });
        }
        else {
            return this.reset(delta);
        }
    };
    PageSwipeHandler.prototype.reset = function (delta) {
        if (Math.abs(this._xoffset) > 40) {
            Animations_1.animations.add(this.touchArea, (0, Animations_1.transform)("translateX" /* TransformEnum.TranslateX */, delta.x, 0));
        }
        else {
            this.touchArea.style.transform = "";
        }
        this._xoffset = 0;
        return _super.prototype.reset.call(this, delta);
    };
    return PageSwipeHandler;
}(SwipeHandler_1.SwipeHandler));
exports.PageSwipeHandler = PageSwipeHandler;
