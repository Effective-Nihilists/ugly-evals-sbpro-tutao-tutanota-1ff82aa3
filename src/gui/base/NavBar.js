"use strict";
exports.__esModule = true;
exports.NavBar = void 0;
var mithril_1 = require("mithril");
var AriaUtils_1 = require("../AriaUtils");
var Env_1 = require("../../api/common/Env");
(0, Env_1.assertMainOrNode)();
var NavBar = /** @class */ (function () {
    function NavBar() {
    }
    NavBar.prototype.view = function (_a) {
        var children = _a.children;
        return (0, mithril_1["default"])("nav.nav-bar.flex-end" + (0, AriaUtils_1.landmarkAttrs)("navigation" /* AriaLandmarks.Navigation */, "top"), children.map(function (child) { return (0, mithril_1["default"])(".plr-nav-button", child); }));
    };
    return NavBar;
}());
exports.NavBar = NavBar;
