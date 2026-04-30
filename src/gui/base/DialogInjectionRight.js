"use strict";
exports.__esModule = true;
exports.DialogInjectionRight = void 0;
var mithril_1 = require("mithril");
var DialogHeaderBar_1 = require("./DialogHeaderBar");
var size_1 = require("../size");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
/**
 * injects additional content on the right of a dialog
 */
var DialogInjectionRight = /** @class */ (function () {
    function DialogInjectionRight() {
    }
    DialogInjectionRight.prototype.view = function (_a) {
        var attrs = _a.attrs;
        var component = attrs.component, componentAttrs = attrs.componentAttrs;
        if (attrs.visible()) {
            return (0, mithril_1["default"])(".flex-grow-shrink-auto.flex-transition.ml-s.rel.dialog.dialog-width-m.elevated-bg.dropdown-shadow.border-radius", [
                (0, mithril_1["default"])(".dialog-header.plr-l", (0, mithril_1["default"])(DialogHeaderBar_1.DialogHeaderBar, (0, tutanota_utils_1.resolveMaybeLazy)(attrs.headerAttrs))),
                (0, mithril_1["default"])(".dialog-container.scroll.plr-l", (0, mithril_1["default"])(component, componentAttrs)),
            ]);
        }
        else {
            return (0, mithril_1["default"])(".flex-hide.flex-transition.rel", {
                style: {
                    maxWidth: (0, size_1.px)(0)
                }
            });
        }
    };
    return DialogInjectionRight;
}());
exports.DialogInjectionRight = DialogInjectionRight;
