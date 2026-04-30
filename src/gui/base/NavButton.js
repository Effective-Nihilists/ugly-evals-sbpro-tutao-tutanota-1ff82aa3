"use strict";
exports.__esModule = true;
exports.isSelectedPrefix = exports.isNavButtonSelected = exports.NavButton = void 0;
var mithril_1 = require("mithril");
var ErrorHandler_1 = require("../../misc/ErrorHandler");
var size_1 = require("../size");
var Flash_1 = require("./Flash");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Icon_1 = require("./Icon");
var theme_1 = require("../theme");
var styles_1 = require("../styles");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var TutanotaConstants_1 = require("../../api/common/TutanotaConstants");
var KeyManager_1 = require("../../misc/KeyManager");
var Env_1 = require("../../api/common/Env");
(0, Env_1.assertMainOrNode)();
var navButtonSelector = function (vertical, centred) {
    return "a.nav-button.noselect.flex-no-shrink.items-center.click.plr-button.no-text-decoration.button-height" +
        (vertical ? ".col" : "") +
        (!centred ? ".flex-start" : ".flex-center");
};
var NavButton = /** @class */ (function () {
    function NavButton() {
        this._draggedOver = false;
        this._dropCounter = 0;
    }
    NavButton.prototype.view = function (vnode) {
        var a = vnode.attrs;
        var linkAttrs = this.createButtonAttributes(a);
        var children = [
            a.icon && a.icon()
                ? (0, mithril_1["default"])(Icon_1.Icon, {
                    icon: a.icon(),
                    "class": this._getIconClass(a),
                    style: {
                        fill: isNavButtonSelected(vnode.attrs) || this._draggedOver ? getColors(a.colors).button_selected : getColors(a.colors).button
                    }
                })
                : null,
            !a.hideLabel ? (0, mithril_1["default"])("span.label.click.text-ellipsis.b" + (a.vertical ? "" : ".pl-m"), this.getLabel(a.label)) : null,
        ];
        // allow nav button without label for registration button on mobile devices
        if (this._isExternalUrl(a.href)) {
            return (0, mithril_1["default"])(navButtonSelector(vnode.attrs.vertical, vnode.attrs.centred === true), linkAttrs, children);
        }
        else {
            return (0, mithril_1["default"])(mithril_1["default"].route.Link, linkAttrs, children);
        }
    };
    NavButton.prototype.getLabel = function (label) {
        return LanguageViewModel_1.lang.getMaybeLazy(label);
    };
    NavButton.prototype._getUrl = function (href) {
        return (0, tutanota_utils_1.lazyStringValue)(href);
    };
    NavButton.prototype._getIconClass = function (a) {
        var isSelected = isNavButtonSelected(a);
        if (a.colors === "header" /* NavButtonColor.Header */ && !styles_1.styles.isDesktopLayout()) {
            return "flex-end items-center icon-xl" + (isSelected ? " selected" : "");
        }
        else if (a.small === true) {
            return "flex-center items-center icon" + (isSelected ? " selected" : "");
        }
        else {
            return "flex-center items-center icon-large" + (isSelected ? " selected" : "");
        }
    };
    NavButton.prototype._isExternalUrl = function (href) {
        var url = this._getUrl(href);
        return url != null ? url.indexOf("http") === 0 : false;
    };
    NavButton.prototype.createButtonAttributes = function (a) {
        var _this = this;
        var attr = {
            role: "button",
            // role button for screen readers
            href: this._getUrl(a.href),
            style: {
                color: isNavButtonSelected(a) || this._draggedOver ? getColors(a.colors).button_selected : getColors(a.colors).button,
                "font-size": a.fontSize ? (0, size_1.px)(a.fontSize) : ""
            },
            title: this.getLabel(a.label),
            target: this._isExternalUrl(a.href) ? "_blank" : undefined,
            oncreate: function (vnode) {
                _this._domButton = vnode.dom;
                (0, Flash_1.addFlash)(vnode.dom);
            },
            onremove: function (vnode) {
                (0, Flash_1.removeFlash)(vnode.dom);
            },
            selector: navButtonSelector(a.vertical),
            onclick: function (e) { return _this.click(e, a); },
            onkeyup: function (e) {
                if ((0, KeyManager_1.isKeyPressed)(e.keyCode, TutanotaConstants_1.Keys.SPACE)) {
                    _this.click(e, a);
                }
            }
        };
        if (a.dropHandler) {
            attr.ondragenter = function (ev) {
                _this._dropCounter++;
                _this._draggedOver = true;
                ev.preventDefault();
            };
            attr.ondragleave = function (ev) {
                _this._dropCounter--;
                if (_this._dropCounter === 0) {
                    _this._draggedOver = false;
                }
                ev.preventDefault();
            };
            attr.ondragover = function (ev) {
                // needed to allow dropping
                ev.preventDefault();
            };
            attr.ondrop = function (ev) {
                var _a;
                _this._dropCounter = 0;
                _this._draggedOver = false;
                ev.preventDefault();
                if ((_a = ev.dataTransfer) === null || _a === void 0 ? void 0 : _a.getData("text")) {
                    (0, tutanota_utils_1.neverNull)(a.dropHandler)(ev.dataTransfer.getData("text"));
                }
            };
        }
        return attr;
    };
    NavButton.prototype.click = function (event, a) {
        if (!this._isExternalUrl(a.href)) {
            mithril_1["default"].route.set(this._getUrl(a.href));
            try {
                if (a.click != null) {
                    a.click(event, this._domButton);
                }
                event.preventDefault();
            }
            catch (e) {
                (0, ErrorHandler_1.handleUncaughtError)(e);
            }
        }
    };
    NavButton.prototype.getHeight = function () {
        return size_1.size.button_height;
    };
    return NavButton;
}());
exports.NavButton = NavButton;
function getColors(buttonColors) {
    switch (buttonColors) {
        case "header" /* NavButtonColor.Header */:
            return {
                button: styles_1.styles.isDesktopLayout() ? theme_1.theme.header_button : theme_1.theme.content_accent,
                button_selected: styles_1.styles.isDesktopLayout() ? theme_1.theme.header_button_selected : theme_1.theme.content_accent
            };
        case "nav" /* NavButtonColor.Nav */:
            return {
                button: theme_1.theme.navigation_button,
                button_selected: theme_1.theme.navigation_button_selected
            };
        default:
            // for nav buttons in the more dropdown menu
            return {
                button: theme_1.theme.content_button,
                button_selected: theme_1.theme.content_button_selected
            };
    }
}
function isNavButtonSelected(a) {
    if (typeof a.isSelectedPrefix === "boolean") {
        return a.isSelectedPrefix;
    }
    var selectedPrefix = a.isSelectedPrefix || (0, tutanota_utils_1.lazyStringValue)(a.href);
    return isSelectedPrefix(selectedPrefix);
}
exports.isNavButtonSelected = isNavButtonSelected;
function isSelectedPrefix(href) {
    var current = mithril_1["default"].route.get();
    // don't just check current.indexOf(buttonHref) because other buttons may also start with this href
    return href !== "" && (current === href || current.indexOf(href + "/") === 0 || current.indexOf(href + "?") === 0);
}
exports.isSelectedPrefix = isSelectedPrefix;
