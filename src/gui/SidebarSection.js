"use strict";
exports.__esModule = true;
exports.SidebarSection = void 0;
var mithril_1 = require("mithril");
var LanguageViewModel_1 = require("../misc/LanguageViewModel");
var theme_1 = require("./theme");
var SidebarSection = /** @class */ (function () {
    function SidebarSection() {
    }
    SidebarSection.prototype.view = function (vnode) {
        var _a = vnode.attrs, name = _a.name, button = _a.button;
        var content = vnode.children;
        return (0, mithril_1["default"])(".sidebar-section.mb", {
            style: {
                color: theme_1.theme.navigation_button
            }
        }, [
            (0, mithril_1["default"])(".folder-row.flex-space-between.plr-l.pt-s.button-height", [
                (0, mithril_1["default"])("small.b.align-self-center.text-ellipsis", LanguageViewModel_1.lang.getMaybeLazy(name).toLocaleUpperCase()),
                button !== null && button !== void 0 ? button : null,
            ]),
            content,
        ]);
    };
    return SidebarSection;
}());
exports.SidebarSection = SidebarSection;
