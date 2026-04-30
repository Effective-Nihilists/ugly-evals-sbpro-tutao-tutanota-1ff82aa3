"use strict";
exports.__esModule = true;
exports.SwipeHandler = void 0;
var ClientDetector_1 = require("../../misc/ClientDetector");
var size_1 = require("../size");
/* Tool to detect swipe gestures on certain elements. */
var SwipeHandler = /** @class */ (function () {
    function SwipeHandler(touchArea) {
        var _this = this;
        this.isAnimating = false;
        this.startPos = {
            x: 0,
            y: 0
        };
        this.touchArea = touchArea;
        this.animating = Promise.resolve();
        this.directionLock = null;
        var eventListenerArgs = ClientDetector_1.client.passive()
            ? {
                passive: true
            }
            : false;
        this.touchArea.addEventListener("touchstart", function (e) { return _this.start(e); }, eventListenerArgs);
        this.touchArea.addEventListener("touchmove", function (e) { return _this.move(e); }, ClientDetector_1.client.passive()
            ? {
                passive: false
            }
            : false); // does invoke prevent default
        this.touchArea.addEventListener("touchend", function (e) { return _this.end(e); }, eventListenerArgs);
    }
    SwipeHandler.prototype.start = function (e) {
        this.startPos.x = e.touches[0].clientX;
        this.startPos.y = e.touches[0].clientY;
    };
    SwipeHandler.prototype.move = function (e) {
        var _this = this;
        var _a = this.getDelta(e), x = _a.x, y = _a.y;
        // If we're either locked horizontally OR if we're not locked vertically but would like to lock horizontally, then lock horizontally
        if (this.directionLock === 0 /* DirectionLock.Horizontal */ ||
            (this.directionLock !== 1 /* DirectionLock.Vertical */ && Math.abs(x) > Math.abs(y) && Math.abs(x) > 14)) {
            this.directionLock = 0 /* DirectionLock.Horizontal */;
            // Do not scroll the list
            e.preventDefault();
            if (!this.isAnimating) {
                this.onHorizontalDrag(x, y);
            } // If we don't have a vertical lock yet but we would like to have it, lock vertically
        }
        else if (this.directionLock !== 1 /* DirectionLock.Vertical */ && Math.abs(y) > Math.abs(x) && Math.abs(y) > size_1.size.list_row_height) {
            this.directionLock = 1 /* DirectionLock.Vertical */;
            if (!this.isAnimating) {
                // Reset the row
                window.requestAnimationFrame(function () {
                    if (!_this.isAnimating) {
                        _this.reset({
                            x: x,
                            y: y
                        });
                    }
                });
            }
        }
    };
    SwipeHandler.prototype.end = function (e) {
        this.gestureEnd(e);
    };
    SwipeHandler.prototype.gestureEnd = function (e) {
        var _this = this;
        var delta = this.getDelta(e);
        if (!this.isAnimating && this.directionLock === 0 /* DirectionLock.Horizontal */) {
            // Gesture is completed
            this.animating = this.onHorizontalGestureCompleted(delta);
            this.isAnimating = true;
        }
        else if (!this.isAnimating) {
            // Gesture is not completed, reset row
            this.animating = this.reset(delta);
            this.isAnimating = true;
        }
        this.animating.then(function () { return (_this.isAnimating = false); });
        this.directionLock = null;
    };
    SwipeHandler.prototype.onHorizontalDrag = function (xDelta, yDelta) {
        // noOp
    };
    SwipeHandler.prototype.onHorizontalGestureCompleted = function (delta) {
        // noOp
        return Promise.resolve();
    };
    SwipeHandler.prototype.reset = function (delta) {
        return Promise.resolve();
    };
    SwipeHandler.prototype.getDelta = function (e) {
        return {
            x: e.changedTouches[0].clientX - this.startPos.x,
            y: e.changedTouches[0].clientY - this.startPos.y
        };
    };
    return SwipeHandler;
}());
exports.SwipeHandler = SwipeHandler;
