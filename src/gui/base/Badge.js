"use strict";
exports.__esModule = true;
var mithril_1 = require("mithril");
var Badge = /** @class */ (function () {
    function Badge() {
    }
    Badge.prototype.view = function (vnode) {
        return (0, mithril_1["default"])(".b.teamLabel.pl-s.pr-s.border-radius.no-wrap" + (vnode.attrs.classes || ""), vnode.children);
    };
    return Badge;
}());
exports["default"] = Badge;
