"use strict";
exports.__esModule = true;
exports.ProgressBar = exports.PROGRESS_DONE = void 0;
var mithril_1 = require("mithril");
exports.PROGRESS_DONE = 1;
/**
 * a progress bar that takes a progress value and displays it as
 * a portion of its containers width
 */
var ProgressBar = /** @class */ (function () {
    function ProgressBar() {
        this.lastProgress = null;
    }
    ProgressBar.prototype.view = function (vnode) {
        var _this = this;
        var a = vnode.attrs;
        if (this.lastProgress === null && a.progress >= exports.PROGRESS_DONE) {
            // no need to draw anything if we went from 0 to 100 real quick
            return null;
        }
        if (this.lastProgress !== null && this.lastProgress >= exports.PROGRESS_DONE) {
            // on the last redraw, we were done
            // so we can start to remove now
            return null;
        }
        if (a.progress >= exports.PROGRESS_DONE) {
            // schedule the removal redraw now because
            // we might not get another redraw for a while
            // otherwise (since progress is done)
            mithril_1["default"].redraw();
        }
        this.lastProgress = a.progress;
        return (0, mithril_1["default"])(".abs.accent-bg", {
            onbeforeremove: function (vn) { return new Promise(function (resolve) {
                vn.dom.addEventListener("transitionend", function () {
                    _this.lastProgress = null;
                    resolve();
                });
                setTimeout(function () {
                    _this.lastProgress = null;
                    resolve();
                }, 500);
            }); },
            style: {
                bottom: 0,
                left: 0,
                transition: "width 500ms",
                width: a.progress * 100 + "%",
                height: "3px"
            }
        });
    };
    return ProgressBar;
}());
exports.ProgressBar = ProgressBar;
