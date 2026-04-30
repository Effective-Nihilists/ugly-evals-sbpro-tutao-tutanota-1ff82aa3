"use strict";
exports.__esModule = true;
exports.ExpanderPanel = exports.ExpanderButton = void 0;
var mithril_1 = require("mithril");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var Flash_1 = require("./Flash");
var Icon_1 = require("./Icon");
var theme_1 = require("../theme");
var size_1 = require("../size");
var Animations_1 = require("../animation/Animations");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var ExpanderButton = /** @class */ (function () {
    function ExpanderButton() {
    }
    ExpanderButton.prototype.view = function (vnode) {
        var a = vnode.attrs;
        return (0, mithril_1["default"])(".flex.limit-width", [
            // .limit-width does not work without .flex in IE11
            (0, mithril_1["default"])("button.expander.bg-transparent.pt-s.hover-ul.limit-width.flex.items-center", {
                style: a.style,
                onclick: function (event) {
                    a.onExpandedChange(!a.expanded);
                    event.stopPropagation();
                },
                oncreate: function (vnode) { return (0, Flash_1.addFlash)(vnode.dom); },
                onremove: function (vnode) { return (0, Flash_1.removeFlash)(vnode.dom); },
                "aria-expanded": String(a.expanded)
            }, [
                a.showWarning
                    ? (0, mithril_1["default"])(Icon_1.Icon, {
                        icon: "Warning" /* Icons.Warning */,
                        style: {
                            fill: a.color ? a.color : theme_1.theme.content_button
                        }
                    })
                    : null,
                (0, mithril_1["default"])("small.b.text-ellipsis", {
                    style: {
                        color: a.color || theme_1.theme.content_button
                    }
                }, LanguageViewModel_1.lang.getMaybeLazy(a.label).toUpperCase()),
                (0, mithril_1["default"])(Icon_1.Icon, {
                    icon: "Expand" /* BootIcons.Expand */,
                    "class": "flex-center items-center",
                    style: {
                        fill: a.color ? a.color : theme_1.theme.content_button,
                        "margin-right": (0, size_1.px)(-4),
                        // icon is has 4px whitespace to the right,
                        transform: "rotateZ(".concat(a.expanded ? 180 : 0, "deg)"),
                        transition: "transform ".concat(Animations_1.DefaultAnimationTime, "ms")
                    }
                }),
            ]),
        ]);
    };
    return ExpanderButton;
}());
exports.ExpanderButton = ExpanderButton;
/**
 * Panel which shows or hides content depending on the attrs.expanded and animates transitions.
 */
var ExpanderPanel = /** @class */ (function () {
    function ExpanderPanel() {
        this.childDiv = null;
        // There are some cases where the child div will be added to and a redraw won't be triggered, in which case
        // the expander panel won't update until some kind of interaction happens.
        // Unfortunately no one knows what these cases are anymore besides some direct mutation.
        this.observer = null;
        // We calculate the height manually because we need concrete values for the transition (can't just transition from 0px to 100%)
        this.lastCalculatedHeight = null;
        // We remove the children from the DOM to take them out of the taborder. Setting "tabindex = -1" on the element will not work because
        // it does not apply to any children
        this.childrenInDom = null;
    }
    ExpanderPanel.prototype.oninit = function (vnode) {
        var _this = this;
        this.childrenInDom = vnode.attrs.expanded;
        this.observer = new MutationObserver(function (mutations) {
            // redraw if a child has been added that won't be getting displayed
            if (_this.childDiv && _this.childDiv.getBoundingClientRect().height !== _this.lastCalculatedHeight) {
                mithril_1["default"].redraw();
            }
        });
    };
    ExpanderPanel.prototype.onbeforeupdate = function (vnode, old) {
        var oldExpanded = old.attrs.expanded;
        var currentExpanded = vnode.attrs.expanded;
        if (oldExpanded !== currentExpanded) {
            this._handleExpansionStateChanged(currentExpanded);
        }
        return true;
    };
    ExpanderPanel.prototype.view = function (vnode) {
        var _this = this;
        var _a, _b;
        var expanded = vnode.attrs.expanded;
        // getBoundingClientRect() gives us the correct size, with a fraction
        this.lastCalculatedHeight = (_b = (_a = this.childDiv) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect().height) !== null && _b !== void 0 ? _b : 0;
        // theoretically we don't need overflow: hidden here but better be safe
        return (0, mithril_1["default"])(".expander-panel.overflow-hidden", 
        // this is what will be actually clipping content. nothing must overflow it.
        (0, mithril_1["default"])(".overflow-hidden", {
            style: {
                opacity: expanded ? "1" : "0",
                height: expanded ? "".concat(this.lastCalculatedHeight, "px") : "0px",
                transition: "opacity ".concat(Animations_1.DefaultAnimationTime, "ms ease-out, height ").concat(Animations_1.DefaultAnimationTime, "ms ease-out")
            }
        }, 
        // we use this wrapper to measure the child reliably
        // just a marker class
        (0, mithril_1["default"])(".expander-child-wrapper", {
            style: {
                // one way to deal with collapsible margins.
                // CSS is fun in the way that it likes to collapse some vertical margins in some cases.
                // https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Mastering_margin_collapsing
                // One of such cases is when there's no content between the parent and the child and no margins or borders.
                // So assuming that the child we want to display inside has a margin-top set it would actually overflow our child-wrapper on the
                // top. Which means all our sizing is wrong.
                // There are few ways to prevent this, one of them is `display: flow-root`. It should have no side effects except for some
                // `display: float` items but if you are using `float` still you have no one to blame but yourself.
                // we could set `overflow: hidden` here instead but we do measure this element so we probably shouldn't
                "display": "flow-root"
            },
            oncreate: function (vnode) {
                _this.childDiv = vnode.dom;
                (0, tutanota_utils_1.assertNotNull)(_this.observer).observe(_this.childDiv, {
                    childList: true,
                    subtree: true
                });
            },
            onremove: function () {
                var _a;
                (_a = _this.observer) === null || _a === void 0 ? void 0 : _a.disconnect();
            }
        }, this.childrenInDom ? vnode.children : null)));
    };
    // This was done for some obscure case on iOS 12 and it wasn't even done correctly (setTimeout() will not magically produce a redraw()) so it is probably
    // a good candidate for removal.
    ExpanderPanel.prototype._handleExpansionStateChanged = function (expanded) {
        var _this = this;
        clearTimeout(this.setChildrenInDomTimeout);
        if (expanded) {
            this.childrenInDom = true;
        }
        else {
            this.setChildrenInDomTimeout = setTimeout(function () { return (_this.childrenInDom = false); }, Animations_1.DefaultAnimationTime);
        }
    };
    return ExpanderPanel;
}());
exports.ExpanderPanel = ExpanderPanel;
