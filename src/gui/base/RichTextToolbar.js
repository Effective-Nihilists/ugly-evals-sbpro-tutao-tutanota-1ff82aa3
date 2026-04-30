"use strict";
exports.__esModule = true;
exports.animateToolbar = exports.RichTextToolbar = void 0;
var mithril_1 = require("mithril");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var size_1 = require("../size");
var Dropdown_js_1 = require("./Dropdown.js");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var Animations_1 = require("../animation/Animations");
var ClientDetector_1 = require("../../misc/ClientDetector");
var ToggleButton_js_1 = require("./ToggleButton.js");
var IconButton_js_1 = require("./IconButton.js");
var RichTextToolbar = /** @class */ (function () {
    function RichTextToolbar(_a) {
        var attrs = _a.attrs;
        this.selectedSize = size_1.size.font_size_base;
        try {
            this.selectedSize = parseInt(attrs.editor.squire.getFontInfo().size.slice(0, -2));
        }
        catch (e) {
            this.selectedSize = size_1.size.font_size_base;
        }
    }
    RichTextToolbar.prototype.oncreate = function (vnode) {
        var dom = vnode.dom;
        dom.style.height = "0";
        animateToolbar(dom, true);
    };
    RichTextToolbar.prototype.onbeforeremove = function (vnode) {
        return animateToolbar(vnode.dom, false);
    };
    RichTextToolbar.prototype.view = function (_a) {
        var attrs = _a.attrs;
        return (0, mithril_1["default"])(".elevated-bg.overflow-hidden", {
            style: {
                top: "0px",
                position: ClientDetector_1.client.browser === "Safari" /* BrowserType.SAFARI */
                    ? ClientDetector_1.client.isMacOS
                        ? "-webkit-sticky" // safari on macos
                        : "inherit" // sticky changes the rendering order on iOS
                    : "sticky"
            }
        }, [
            (0, mithril_1["default"])(".flex-end.wrap.items-center.mb-xs.mt-xs.ml-between-s", this.renderStyleButtons(attrs), this.renderCustomButtons(attrs), this.renderAlignDropDown(attrs), this.renderSizeButtons(attrs), this.renderRemoveFormattingButton(attrs)),
        ]);
    };
    RichTextToolbar.prototype.renderStyleButtons = function (attrs) {
        var editor = attrs.editor, imageButtonClickHandler = attrs.imageButtonClickHandler;
        return [
            this.renderStyleToggleButton("b", LanguageViewModel_1.lang.get("formatTextBold_msg") + " (Ctrl + B)", "Bold" /* Icons.Bold */, editor),
            this.renderStyleToggleButton("i", LanguageViewModel_1.lang.get("formatTextItalic_msg") + " (Ctrl + I)", "Italic" /* Icons.Italic */, editor),
            this.renderStyleToggleButton("u", LanguageViewModel_1.lang.get("formatTextUnderline_msg") + " (Ctrl + U)", "Underline" /* Icons.Underline */, editor),
            this.renderStyleToggleButton("c", "formatTextMonospace_msg", "Code" /* Icons.Code */, editor),
            this.renderStyleToggleButton("a", (editor.hasStyle("a") ? LanguageViewModel_1.lang.get("breakLink_action") : LanguageViewModel_1.lang.get("makeLink_action")), "Link" /* Icons.Link */, editor),
            this.renderListToggleButton("ol", LanguageViewModel_1.lang.get("formatTextOl_msg") + " (Ctrl + Shift + 9)", "ListOrdered" /* Icons.ListOrdered */, editor),
            this.renderListToggleButton("ul", LanguageViewModel_1.lang.get("formatTextUl_msg") + " (Ctrl + Shift + 8)", "ListUnordered" /* Icons.ListUnordered */, editor),
            imageButtonClickHandler
                ? (0, mithril_1["default"])(IconButton_js_1.IconButton, {
                    title: "insertImage_action",
                    click: function (ev) { return imageButtonClickHandler(ev, editor); },
                    icon: "Picture" /* Icons.Picture */,
                    size: 1 /* ButtonSize.Compact */
                })
                : null
        ];
    };
    RichTextToolbar.prototype.renderStyleToggleButton = function (style, title, icon, editor) {
        return this.renderToggleButton(title, icon, function () { return editor.setStyle(!editor.hasStyle(style), style); }, function () { return editor.hasStyle(style); });
    };
    RichTextToolbar.prototype.renderListToggleButton = function (listing, title, icon, editor) {
        return this.renderToggleButton(title, icon, function () { return editor.styles.listing === listing
            ? editor.squire.removeList()
            : listing === "ul" ? editor.squire.makeUnorderedList() : editor.squire.makeOrderedList(); }, function () { return editor.styles.listing === listing; });
    };
    RichTextToolbar.prototype.renderToggleButton = function (title, icon, click, isSelected) {
        return (0, mithril_1["default"])(ToggleButton_js_1.ToggleButton, {
            title: function () { return title; },
            onToggled: click,
            icon: icon,
            toggled: isSelected(),
            size: 1 /* ButtonSize.Compact */
        });
    };
    RichTextToolbar.prototype.renderCustomButtons = function (attrs) {
        var _a;
        return ((_a = attrs.customButtonAttrs) !== null && _a !== void 0 ? _a : []).map(function (attrs) { return (0, mithril_1["default"])(IconButton_js_1.IconButton, attrs); });
    };
    RichTextToolbar.prototype.renderAlignDropDown = function (attrs) {
        if (attrs.alignmentEnabled === false) {
            return null;
        }
        var alignButtonAttrs = function (alignment, title, icon) {
            return {
                label: title,
                click: function () {
                    attrs.editor.squire.setTextAlignment(alignment);
                    setTimeout(function () { return attrs.editor.squire.focus(); }, 100); // blur for the editor is fired after the handler for some reason
                    mithril_1["default"].redraw();
                },
                icon: icon
            };
        };
        return (0, mithril_1["default"])(IconButton_js_1.IconButton, {
            // label: () => "▼",
            title: "formatTextAlignment_msg",
            icon: this.alignIcon(attrs),
            size: 1 /* ButtonSize.Compact */,
            click: function (e, dom) {
                e.stopPropagation();
                (0, Dropdown_js_1.createDropdown)({
                    width: 200,
                    lazyButtons: function () { return [
                        alignButtonAttrs("left", "formatTextLeft_msg", "AlignLeft" /* Icons.AlignLeft */),
                        alignButtonAttrs("center", "formatTextCenter_msg", "AlignCenter" /* Icons.AlignCenter */),
                        alignButtonAttrs("right", "formatTextRight_msg", "AlignRight" /* Icons.AlignRight */),
                        alignButtonAttrs("justify", "formatTextJustify_msg", "AlignJustified" /* Icons.AlignJustified */),
                    ]; }
                })(e, dom);
            }
        });
    };
    RichTextToolbar.prototype.alignIcon = function (attrs) {
        switch (attrs.editor.styles.alignment) {
            case "left":
                return "AlignLeft" /* Icons.AlignLeft */;
            case "center":
                return "AlignCenter" /* Icons.AlignCenter */;
            case "right":
                return "AlignRight" /* Icons.AlignRight */;
            case "justify":
                return "AlignJustified" /* Icons.AlignJustified */;
        }
    };
    RichTextToolbar.prototype.renderSizeButtons = function (_a) {
        var _this = this;
        var editor = _a.editor;
        return (0, mithril_1["default"])(IconButton_js_1.IconButton, {
            title: "formatTextFontSize_msg",
            icon: "FontSize" /* Icons.FontSize */,
            size: 1 /* ButtonSize.Compact */,
            click: function (e, dom) {
                e.stopPropagation();
                (0, Dropdown_js_1.createDropdown)({
                    lazyButtons: function () {
                        return (0, tutanota_utils_1.numberRange)(8, 144).map(function (n) {
                            return {
                                label: function () { return n.toString(); },
                                click: function () {
                                    editor.squire.setFontSize(n);
                                    _this.selectedSize = n;
                                    setTimeout(function () { return editor.squire.focus(); }, 100); // blur for the editor is fired after the handler for some reason
                                    mithril_1["default"].redraw();
                                }
                            };
                        });
                    }
                })(e, dom);
            }
        });
    };
    RichTextToolbar.prototype.renderRemoveFormattingButton = function (attrs) {
        if (attrs.fontSizeEnabled === false) {
            return null;
        }
        return (0, mithril_1["default"])(IconButton_js_1.IconButton, {
            title: "removeFormatting_action",
            icon: "FormatClear" /* Icons.FormatClear */,
            click: function (e) {
                e.stopPropagation();
                attrs.editor.squire.removeAllFormatting();
            },
            size: 1 /* ButtonSize.Compact */
        });
    };
    return RichTextToolbar;
}());
exports.RichTextToolbar = RichTextToolbar;
function animateToolbar(dom, appear) {
    var childHeight = Array.from(dom.children)
        .map(function (domElement) { return domElement.offsetHeight; })
        .reduce(function (current, previous) { return Math.max(current, previous); }, 0);
    return Animations_1.animations
        .add(dom, [(0, Animations_1.height)(appear ? 0 : childHeight, appear ? childHeight : 0), appear ? (0, Animations_1.opacity)(0, 1, false) : (0, Animations_1.opacity)(1, 0, false)])
        .then(function () {
        if (appear) {
            dom.style.height = "";
        }
    });
}
exports.animateToolbar = animateToolbar;
