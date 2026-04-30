"use strict";
exports.__esModule = true;
exports.DialogHeaderBar = void 0;
var mithril_1 = require("mithril");
var Button_js_1 = require("./Button.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
/**
 * An action bar is a bar that contains buttons (either on the left or on the right).
 */
var DialogHeaderBar = /** @class */ (function () {
    function DialogHeaderBar() {
    }
    DialogHeaderBar.prototype.view = function (vnode) {
        var a = Object.assign({}, {
            left: [],
            right: []
        }, vnode.attrs);
        var columnClass = a.middle ? ".flex-third.overflow-hidden" : ".flex-half.overflow-hidden";
        return (0, mithril_1["default"])(".flex-space-between.dialog-header-line-height", {
            oncreate: function () {
                if (a.create)
                    a.create();
            },
            onremove: function () {
                if (a.remove)
                    a.remove();
            }
        }, [
            (0, mithril_1["default"])(columnClass + ".ml-negative-s", (0, tutanota_utils_1.resolveMaybeLazy)(a.left).map(function (a) { return (0, mithril_1["default"])(Button_js_1.Button, a); })),
            a.middle ? (0, mithril_1["default"])("#dialog-title.flex-third-middle.overflow-hidden.flex.justify-center.items-center.b", [(0, mithril_1["default"])(".text-ellipsis", a.middle())]) : null,
            (0, mithril_1["default"])(columnClass + ".mr-negative-s.flex.justify-end", (0, tutanota_utils_1.resolveMaybeLazy)(a.right).map(function (a) { return (0, mithril_1["default"])(Button_js_1.Button, a); })),
        ]);
    };
    return DialogHeaderBar;
}());
exports.DialogHeaderBar = DialogHeaderBar;
