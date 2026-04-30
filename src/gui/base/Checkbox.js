"use strict";
exports.__esModule = true;
exports.Checkbox = void 0;
var mithril_1 = require("mithril");
var Icon_1 = require("./Icon");
var Flash_1 = require("./Flash");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var Checkbox = /** @class */ (function () {
    function Checkbox() {
        this._domInput = null;
        this._domIcon = null;
        this.focused = false;
    }
    Checkbox.prototype.view = function (vnode) {
        var _this = this;
        var a = vnode.attrs;
        var helpLabel = a.helpLabel ? (0, mithril_1["default"])("small.block.content-fg", LanguageViewModel_1.lang.getMaybeLazy(a.helpLabel)) : [];
        return (0, mithril_1["default"])(".checkbox.click.pt", {
            onclick: function (e) {
                if (e.target !== _this._domInput) {
                    _this.toggle(e, a); // event is bubbling in IE besides we invoke e.stopPropagation()
                }
            }
        }, [
            (0, mithril_1["default"])(".wrapper.flex.items-center", {
                oncreate: function (vnode) { return (0, Flash_1.addFlash)(vnode.dom); },
                onremove: function (vnode) { return (0, Flash_1.removeFlash)(vnode.dom); }
            }, [
                // the real checkbox is transparent and only used to allow keyboard focusing and selection
                (0, mithril_1["default"])("input[type=checkbox]", {
                    oncreate: function (vnode) { return (_this._domInput = vnode.dom); },
                    onchange: function (e) { return _this.toggle(e, a); },
                    checked: a.checked,
                    onfocus: function () { return _this.focused = true; },
                    onblur: function () { return _this.focused = false; },
                    onremove: function (e) {
                        // workaround for chrome error on login with return shortcut "Error: Failed to execute 'removeChild' on 'Node': The node to be removed is no longer a child of this node. Perhaps it was moved in a 'blur' event handler?"
                        // TODO test if still needed with mithril 1.1.1
                        if (_this._domInput)
                            _this._domInput.onblur = null;
                    },
                    style: {
                        opacity: 0,
                        position: "absolute",
                        cursor: "pointer",
                        z_index: -1
                    }
                }),
                (0, mithril_1["default"])(Icon_1.Icon, {
                    icon: a.checked ? "CheckboxSelected" /* BootIcons.CheckboxSelected */ : "Checkbox" /* BootIcons.Checkbox */,
                    "class": this.focused ? "svg-content-accent-fg" : "svg-content-fg",
                    oncreate: function (vnode) { return (_this._domIcon = vnode.dom); }
                }),
                (0, mithril_1["default"])(".pl", {
                    "class": this.focused ? "content-accent-fg" : "content-fg",
                    onclick: function (e) {
                        // if the label contains a link, then stop the event so that the checkbox doesnt get toggled upon clicking
                        // we still allow it to be checked if they click on the non-link part of the label
                        if (e.target instanceof HTMLElement && e.target.tagName.toUpperCase() === "A") {
                            e.stopPropagation();
                        }
                    }
                }, a.label()),
            ]),
            helpLabel,
        ]);
    };
    Checkbox.prototype.toggle = function (event, attrs) {
        if (!attrs.disabled) {
            attrs.onChecked(!attrs.checked);
        }
        event.stopPropagation();
        if (this._domInput) {
            this._domInput.focus();
        }
    };
    return Checkbox;
}());
exports.Checkbox = Checkbox;
