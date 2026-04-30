"use strict";
exports.__esModule = true;
exports.Editor = void 0;
var mithril_1 = require("mithril");
var squire_rte_1 = require("squire-rte");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var size_1 = require("../size");
var Dialog_1 = require("../base/Dialog");
var FormatValidator_1 = require("../../misc/FormatValidator");
var TutanotaConstants_1 = require("../../api/common/TutanotaConstants");
var KeyManager_1 = require("../../misc/KeyManager");
var Editor = /** @class */ (function () {
    function Editor(minHeight, sanitizer) {
        var _this = this;
        this.minHeight = minHeight;
        this.sanitizer = sanitizer;
        this.initialized = (0, tutanota_utils_1.defer)();
        this.domElement = null;
        this.enabled = true;
        this.createsLists = true;
        this.styleActions = Object.freeze({
            b: [function () { return _this.squire.bold(); }, function () { return _this.squire.removeBold(); }, function () { return _this.styles.b; }],
            i: [function () { return _this.squire.italic(); }, function () { return _this.squire.removeItalic(); }, function () { return _this.styles.i; }],
            u: [function () { return _this.squire.underline(); }, function () { return _this.squire.removeUnderline(); }, function () { return _this.styles.u; }],
            c: [function () { return _this.squire.setFontFace("monospace"); }, function () { return _this.squire.setFontFace(null); }, function () { return _this.styles.c; }],
            a: [function () { return _this.makeLink(); }, function () { return _this.squire.removeLink(); }, function () { return _this.styles.a; }]
        });
        this.styles = {
            b: false,
            i: false,
            u: false,
            c: false,
            a: false,
            alignment: "left",
            listing: null
        };
        this.hasStyle = function (style) { return (_this.squire ? _this.styleActions[style][2]() : false); };
        this.getStylesAtPath = function () {
            if (!_this.squire) {
                return;
            }
            var pathSegments = _this.squire.getPath().split(">");
            // lists
            var ulIndex = pathSegments.lastIndexOf("UL");
            var olIndex = pathSegments.lastIndexOf("OL");
            if (ulIndex === -1) {
                if (olIndex > -1) {
                    _this.styles.listing = "ol";
                }
                else {
                    _this.styles.listing = null;
                }
            }
            else if (olIndex === -1) {
                if (ulIndex > -1) {
                    _this.styles.listing = "ul";
                }
                else {
                    _this.styles.listing = null;
                }
            }
            else if (olIndex > ulIndex) {
                _this.styles.listing = "ol";
            }
            else {
                _this.styles.listing = "ul";
            }
            //links
            _this.styles.a = pathSegments.includes("A");
            // alignment
            var alignment = pathSegments.find(function (f) { return f.includes("align"); });
            if (alignment !== undefined) {
                switch (alignment.split(".")[1].substring(6)) {
                    case "left":
                        _this.styles.alignment = "left";
                        break;
                    case "right":
                        _this.styles.alignment = "right";
                        break;
                    case "center":
                        _this.styles.alignment = "center";
                        break;
                    default:
                        _this.styles.alignment = "justify";
                }
            }
            else {
                _this.styles.alignment = "left";
            }
            // font
            _this.styles.c = pathSegments.find(function (f) { return f.includes("monospace"); }) !== undefined;
            // decorations
            _this.styles.b = _this.squire.hasFormat("b");
            _this.styles.u = _this.squire.hasFormat("u");
            _this.styles.i = _this.squire.hasFormat("i");
        };
        this.onremove = this.onremove.bind(this);
        this.onbeforeupdate = this.onbeforeupdate.bind(this);
        this.view = this.view.bind(this);
    }
    Editor.prototype.onbeforeupdate = function () {
        // do not update the dom part managed by squire
        return this.squire == null;
    };
    Editor.prototype.onremove = function () {
        if (this.squire) {
            this.squire.destroy();
            this.squire = null;
            this.initialized = (0, tutanota_utils_1.defer)();
        }
    };
    Editor.prototype.view = function () {
        var _this = this;
        return (0, mithril_1["default"])(".hide-outline.selectable", {
            role: "textbox",
            "aria-multiline": "true",
            tabindex: "0" /* TabIndex.Default */,
            oncreate: function (vnode) { return _this.initSquire(vnode.dom); },
            "class": 'flex-grow',
            style: this.minHeight
                ? {
                    "min-height": (0, size_1.px)(this.minHeight)
                }
                : {}
        });
    };
    Editor.prototype.isEmpty = function () {
        return !this.squire || this.squire.getHTML() === "<div><br></div>";
    };
    Editor.prototype.getValue = function () {
        return this.isEmpty() ? "" : this.squire.getHTML();
    };
    Editor.prototype.addChangeListener = function (callback) {
        this.squire.addEventListener("input", callback);
    };
    Editor.prototype.setMinHeight = function (minHeight) {
        this.minHeight = minHeight;
        return this;
    };
    Editor.prototype.setCreatesLists = function (createsLists) {
        this.createsLists = createsLists;
        return this;
    };
    Editor.prototype.initSquire = function (domElement) {
        var _this = this;
        var squire = new squire_rte_1["default"](domElement, {
            sanitizeToDOMFragment: this.sanitizer,
            blockAttributes: {
                dir: "auto"
            }
        }).addEventListener("keyup", function (e) {
            if (_this.createsLists && (0, KeyManager_1.isKeyPressed)(e.keyCode, TutanotaConstants_1.Keys.SPACE)) {
                var blocks_1 = [];
                squire.forEachBlock(function (block) {
                    blocks_1.push(block);
                });
                createList(blocks_1, /^1\.\s$/, true); // create an ordered list if a line is started with '1. '
                createList(blocks_1, /^\*\s$/, false); // create an unordered list if a line is started with '* '
            }
        });
        this.squire = squire;
        // Suppress paste events if pasting while disabled
        this.squire.addEventListener("willPaste", function (e) {
            if (!_this.isEnabled()) {
                e.preventDefault();
            }
        });
        this.squire.addEventListener("pathChange", function () {
            _this.getStylesAtPath();
            mithril_1["default"].redraw(); // allow richtexttoolbar to redraw elements
        });
        this.domElement = domElement;
        // the _editor might have been disabled before the dom element was there
        this.setEnabled(this.enabled);
        this.initialized.resolve();
        function createList(blocks, regex, ordered) {
            var _a;
            if (blocks.length === 1 && ((_a = blocks[0].textContent) === null || _a === void 0 ? void 0 : _a.match(regex))) {
                squire.modifyBlocks(function (fragment) {
                    var _a, _b;
                    if (fragment.firstChild && fragment.firstChild.firstChild) {
                        var textNode = fragment.firstChild.firstChild;
                        while (textNode.nodeType !== Node.TEXT_NODE && textNode.firstChild !== null && textNode.nodeName.toLowerCase() !== "li") {
                            textNode = textNode.firstChild;
                        }
                        if (textNode.nodeType === Node.TEXT_NODE) {
                            textNode.textContent = (_b = (_a = textNode.textContent) === null || _a === void 0 ? void 0 : _a.replace(regex, "")) !== null && _b !== void 0 ? _b : null;
                        }
                    }
                    return fragment;
                });
                if (ordered) {
                    squire.makeOrderedList();
                }
                else {
                    squire.makeUnorderedList();
                }
            }
        }
    };
    Editor.prototype.setEnabled = function (enabled) {
        this.enabled = enabled;
        if (this.domElement) {
            this.domElement.setAttribute("contenteditable", String(enabled));
        }
    };
    Editor.prototype.isEnabled = function () {
        return this.enabled;
    };
    Editor.prototype.setHTML = function (html) {
        this.squire.setHTML(html);
    };
    Editor.prototype.getHTML = function () {
        return this.squire.getHTML();
    };
    Editor.prototype.setStyle = function (state, style) {
        ;
        (state ? this.styleActions[style][0] : this.styleActions[style][1])();
    };
    Editor.prototype.makeLink = function () {
        var _this = this;
        Dialog_1.Dialog.showTextInputDialog("makeLink_action", "url_label", null, "").then(function (url) {
            if ((0, FormatValidator_1.isMailAddress)(url, false)) {
                url = "mailto:" + url;
            }
            else if (!url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("mailto:") && !url.startsWith("{")) {
                url = "https://" + url;
            }
            _this.squire.makeLink(url);
        });
    };
    Editor.prototype.insertImage = function (srcAttr, attrs) {
        return this.squire.insertImage(srcAttr, attrs);
    };
    /**
     * Inserts the given html content at the current cursor position.
     */
    Editor.prototype.insertHTML = function (html) {
        this.squire.insertHTML(html);
    };
    Editor.prototype.getDOM = function () {
        return this.squire.getRoot();
    };
    Editor.prototype.getCursorPosition = function () {
        return this.squire.getCursorPosition();
    };
    Editor.prototype.focus = function () {
        this.squire.focus();
        this.getStylesAtPath();
    };
    Editor.prototype.isAttached = function () {
        return this.squire != null;
    };
    Editor.prototype.removeAllFormatting = function () {
        // Create a range which contains the whole editor
        var range = document.createRange();
        range.selectNode(this.squire.getRoot());
        this.squire.removeAllFormatting(range);
    };
    Editor.prototype.getSelectedText = function () {
        return this.squire.getSelectedText();
    };
    Editor.prototype.addEventListener = function (type, handler) {
        this.squire.addEventListener(type, handler);
    };
    Editor.prototype.setSelection = function (range) {
        this.squire.setSelection(range);
    };
    return Editor;
}());
exports.Editor = Editor;
