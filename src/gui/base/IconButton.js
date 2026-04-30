"use strict";
exports.__esModule = true;
exports.IconButton = void 0;
var mithril_1 = require("mithril");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var Icon_1 = require("./Icon");
var Env_1 = require("../../api/common/Env");
var Button_js_1 = require("./Button.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
(0, Env_1.assertMainOrNode)();
var IconButton = /** @class */ (function () {
    function IconButton() {
        this.dom = null;
    }
    IconButton.prototype.view = function (_a) {
        var _this = this;
        var _b;
        var attrs = _a.attrs;
        return (0, mithril_1["default"])("button.icon-button.state-bg", {
            oncreate: function (_a) {
                var dom = _a.dom;
                _this.dom = dom;
            },
            onclick: function (e) { return attrs.click(e, (0, tutanota_utils_1.assertNotNull)(_this.dom)); },
            title: LanguageViewModel_1.lang.getMaybeLazy(attrs.title),
            "class": attrs.size === 1 /* ButtonSize.Compact */ ? "compact" : ""
        }, (0, mithril_1["default"])(Icon_1.Icon, {
            icon: attrs.icon,
            container: "div",
            "class": "center-h",
            large: true,
            style: {
                fill: (0, Button_js_1.getColors)((_b = attrs.colors) !== null && _b !== void 0 ? _b : "content" /* ButtonColor.Content */).button
            }
        }));
    };
    return IconButton;
}());
exports.IconButton = IconButton;
