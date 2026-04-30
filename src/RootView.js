"use strict";
exports.__esModule = true;
exports.root = exports.RootView = void 0;
var mithril_1 = require("mithril");
var Modal_1 = require("./gui/base/Modal");
var Overlay_1 = require("./gui/base/Overlay");
var styles_1 = require("./gui/styles");
var Env_1 = require("./api/common/Env");
(0, Env_1.assertMainOrNodeBoot)();
var RootView = /** @class */ (function () {
    function RootView() {
        // On first mouse event disable outline. This is a compromise between keyboard navigation users and mouse users.
        var onmousedown = function (e) {
            if (onmousedown) {
                console.log("disabling outline");
                styles_1.styles.registerStyle("outline", function () { return ({
                    "*": {
                        outline: "none"
                    }
                }); });
                // remove event listener after the first click to not re-register style
                onmousedown = null;
                // It is important to not redraw at this point because click event may be lost otherwise and saved login button would not be
                // actually pressed. It's unclear why but preventing redraw (this way or setting listener manually) helps.
                // It's also useless to redraw for this click handler because we just want to add a global style definition.
                e.redraw = false;
            }
        };
        this.view = function (vnode) {
            return (0, mithril_1["default"])("#root" + (styles_1.styles.isUsingBottomNavigation() ? ".mobile" : ""), {
                onmousedown: onmousedown,
                style: {
                    height: "100%"
                }
            }, [(0, mithril_1["default"])(Overlay_1.overlay), (0, mithril_1["default"])(Modal_1.modal), vnode.children]);
        };
    }
    return RootView;
}());
exports.RootView = RootView;
exports.root = new RootView();
