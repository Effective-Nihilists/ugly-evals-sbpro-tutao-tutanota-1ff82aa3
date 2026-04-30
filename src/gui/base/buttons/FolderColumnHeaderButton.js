"use strict";
exports.__esModule = true;
exports.FolderColumnHeaderButton = void 0;
var mithril_1 = require("mithril");
var LanguageViewModel_1 = require("../../../misc/LanguageViewModel");
var Flash_1 = require("../Flash");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var theme_js_1 = require("../../theme.js");
var FolderColumnHeaderButton = /** @class */ (function () {
    function FolderColumnHeaderButton() {
        this.domButton = null;
    }
    FolderColumnHeaderButton.prototype.view = function (_a) {
        var _this = this;
        var attrs = _a.attrs;
        return (0, mithril_1["default"])("button", {
            "class": "bg-transparent button-height full-width noselect limit-width border-radius-small",
            style: {
                border: "2px solid ".concat(theme_js_1.theme.content_accent)
            },
            onclick: function (event) { return attrs.click(event, (0, tutanota_utils_1.assertNotNull)(_this.domButton)); },
            title: LanguageViewModel_1.lang.getMaybeLazy(attrs.label),
            oncreate: function (vnode) { return _this.domButton = vnode.dom; }
        }, (0, mithril_1["default"])("", {
            // additional wrapper for flex box styling as safari does not support flex box on buttons.
            "class": "button-content flex items-center justify-center",
            style: {
                borderColor: theme_js_1.theme.content_accent
            },
            oncreate: function (vnode) { return (0, Flash_1.addFlash)(vnode.dom); },
            onremove: function (vnode) { return (0, Flash_1.removeFlash)(vnode.dom); }
        }, this.renderLabel(attrs)));
    };
    FolderColumnHeaderButton.prototype.renderLabel = function (attrs) {
        return (0, mithril_1["default"])("", {
            "class": "text-ellipsis",
            style: {
                color: theme_js_1.theme.content_accent,
                "font-weight": "bold"
            }
        }, LanguageViewModel_1.lang.getMaybeLazy(attrs.label));
    };
    return FolderColumnHeaderButton;
}());
exports.FolderColumnHeaderButton = FolderColumnHeaderButton;
