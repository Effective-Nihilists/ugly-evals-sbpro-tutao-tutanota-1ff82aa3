"use strict";
exports.__esModule = true;
exports.HtmlEditor = exports.HtmlEditorMode = void 0;
var mithril_1 = require("mithril");
var stream_1 = require("mithril/stream");
var Editor_js_1 = require("./Editor.js");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var size_1 = require("../size");
var HtmlSanitizer_1 = require("../../misc/HtmlSanitizer");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var DropDownSelector_js_1 = require("../base/DropDownSelector.js");
var RichTextToolbar_js_1 = require("../base/RichTextToolbar.js");
var HtmlEditorMode;
(function (HtmlEditorMode) {
    HtmlEditorMode["HTML"] = "html";
    HtmlEditorMode["WYSIWYG"] = "what you see is what you get";
})(HtmlEditorMode = exports.HtmlEditorMode || (exports.HtmlEditorMode = {}));
var HtmlEditor = /** @class */ (function () {
    function HtmlEditor(label, injections) {
        this.label = label;
        this.injections = injections;
        this.mode = HtmlEditorMode.WYSIWYG;
        this.active = false;
        this.domTextArea = null;
        this._showBorders = false;
        this.minHeight = null;
        this.placeholderId = null;
        this.placeholderDomElement = null;
        this.value = (0, stream_1["default"])("");
        this.htmlMonospace = true;
        this.modeSwitcherLabel = null;
        this.toolbarEnabled = false;
        this.toolbarAttrs = {};
        this.editor = new Editor_js_1.Editor(null, function (html) { return HtmlSanitizer_1.htmlSanitizer.sanitizeFragment(html, { blockExternalContent: false }).fragment; });
        this.view = this.view.bind(this);
        this.initializeEditorListeners();
    }
    HtmlEditor.prototype.view = function () {
        var _this = this;
        var _a, _b;
        var modeSwitcherLabel = this.modeSwitcherLabel;
        var borderClasses = this._showBorders
            ? (this.active && this.editor.isEnabled())
                ? ".editor-border-active"
                : ".editor-border" + (modeSwitcherLabel != null ? ".editor-no-top-border" : "")
            : "";
        var renderedInjections = (_b = (_a = this.injections) === null || _a === void 0 ? void 0 : _a.call(this)) !== null && _b !== void 0 ? _b : null;
        var getPlaceholder = function () { return !_this.active && _this.isEmpty()
            ? (0, mithril_1["default"])(".abs.text-ellipsis.noselect.z1.i.pr-s", {
                oncreate: function (vnode) { return _this.placeholderDomElement = vnode.dom; },
                onclick: function () { return _this.mode === HtmlEditorMode.WYSIWYG
                    ? (0, tutanota_utils_1.assertNotNull)(_this.editor.domElement).focus()
                    : (0, tutanota_utils_1.assertNotNull)(_this.domTextArea).focus(); }
            }, _this.placeholderId ? LanguageViewModel_1.lang.get(_this.placeholderId) : "")
            : null; };
        return (0, mithril_1["default"])(".html-editor" + (this.mode === HtmlEditorMode.WYSIWYG ? ".text-break" : ""), [
            modeSwitcherLabel != null ? (0, mithril_1["default"])(DropDownSelector_js_1.DropDownSelector, {
                label: function () { return LanguageViewModel_1.lang.getMaybeLazy(modeSwitcherLabel); },
                items: [
                    { name: LanguageViewModel_1.lang.get("richText_label"), value: HtmlEditorMode.WYSIWYG },
                    { name: LanguageViewModel_1.lang.get("htmlSourceCode_label"), value: HtmlEditorMode.HTML }
                ],
                selectedValue: this.mode,
                selectionChangedHandler: function (mode) {
                    _this.mode = mode;
                    _this.setValue(_this.value());
                    _this.initializeEditorListeners();
                }
            }) : null,
            (this.label)
                ? (0, mithril_1["default"])(".small.mt-form", LanguageViewModel_1.lang.getMaybeLazy(this.label))
                : null,
            (0, mithril_1["default"])(borderClasses, [
                getPlaceholder(),
                this.mode === HtmlEditorMode.WYSIWYG
                    ? (0, mithril_1["default"])(".wysiwyg.rel.overflow-hidden.selectable", [
                        this.editor.isEnabled() && (this.toolbarEnabled || renderedInjections)
                            ? [
                                (0, mithril_1["default"])(".flex-end.sticky.pb-2", [
                                    this.toolbarEnabled
                                        ? (0, mithril_1["default"])(RichTextToolbar_js_1.RichTextToolbar, Object.assign({ editor: this.editor }, this.toolbarAttrs))
                                        : null,
                                    renderedInjections,
                                ]),
                                (0, mithril_1["default"])("hr.hr.mb-s")
                            ]
                            : null,
                        (0, mithril_1["default"])(this.editor, {
                            oncreate: function () {
                                _this.editor.initialized.promise.then(function () { return _this.editor.setHTML(_this.value()); });
                            },
                            onremove: function () {
                                _this.value(_this.getValue());
                            }
                        })
                    ])
                    : (0, mithril_1["default"])(".html", (0, mithril_1["default"])("textarea.input-area.selectable", {
                        oncreate: function (vnode) {
                            _this.domTextArea = vnode.dom;
                            if (!_this.isEmpty()) {
                                _this.domTextArea.value = _this.value();
                            }
                        },
                        onfocus: function () { return _this.focus(); },
                        onblur: function () { return _this.blur(); },
                        oninput: function () {
                            if (_this.domTextArea) {
                                _this.domTextArea.style.height = '0px';
                                _this.domTextArea.style.height = (_this.domTextArea.scrollHeight) + 'px';
                            }
                        },
                        style: {
                            'font-family': this.htmlMonospace ? 'monospace' : 'inherit',
                            "min-height": this.minHeight ? (0, size_1.px)(this.minHeight) : 'initial'
                        },
                        disabled: !this.editor.enabled
                    })),
            ])
        ]);
    };
    HtmlEditor.prototype.initializeEditorListeners = function () {
        var _this = this;
        this.editor.initialized.promise.then(function () {
            var _a;
            var dom = (0, tutanota_utils_1.assertNotNull)((_a = _this.editor) === null || _a === void 0 ? void 0 : _a.domElement);
            dom.onfocus = function () { return _this.focus(); };
            dom.onblur = function () { return _this.blur(); };
        });
    };
    HtmlEditor.prototype.focus = function () {
        this.active = true;
        mithril_1["default"].redraw();
    };
    HtmlEditor.prototype.blur = function () {
        this.active = false;
        if (this.mode === HtmlEditorMode.WYSIWYG) {
            this.value(this.editor.getValue());
        }
        else {
            this.value((0, tutanota_utils_1.assertNotNull)(this.domTextArea).value);
        }
    };
    HtmlEditor.prototype.setModeSwitcher = function (label) {
        this.modeSwitcherLabel = label;
        return this;
    };
    HtmlEditor.prototype.showBorders = function () {
        this._showBorders = true;
        return this;
    };
    HtmlEditor.prototype.setMinHeight = function (height) {
        this.minHeight = height;
        this.editor.setMinHeight(height);
        return this;
    };
    HtmlEditor.prototype.setPlaceholderId = function (placeholderId) {
        this.placeholderId = placeholderId;
        return this;
    };
    HtmlEditor.prototype.getValue = function () {
        if (this.mode === HtmlEditorMode.WYSIWYG) {
            if (this.editor.isAttached()) {
                return this.editor.getHTML();
            }
            else {
                return this.value();
            }
        }
        else {
            if (this.domTextArea) {
                return HtmlSanitizer_1.htmlSanitizer.sanitizeHTML(this.domTextArea.value, { blockExternalContent: false }).html;
            }
            else {
                return this.value();
            }
        }
    };
    HtmlEditor.prototype.setValue = function (html) {
        var _this = this;
        if (this.mode === HtmlEditorMode.WYSIWYG) {
            this.editor.initialized.promise.then(function () { return _this.editor.setHTML(html); });
        }
        else if (this.domTextArea) {
            this.domTextArea.value = html;
        }
        this.value(html);
        return this;
    };
    HtmlEditor.prototype.isActive = function () {
        return this.active;
    };
    HtmlEditor.prototype.isEmpty = function () {
        // either nothing or default squire content
        return this.value() === "" || this.value() === "<div dir=\"auto\"><br></div>";
    };
    HtmlEditor.prototype.setEnabled = function (enabled) {
        this.editor.setEnabled(enabled);
        if (this.domTextArea) {
            this.domTextArea.disabled = !enabled;
        }
        return this;
    };
    HtmlEditor.prototype.setMode = function (mode) {
        this.mode = mode;
        return this;
    };
    HtmlEditor.prototype.setHtmlMonospace = function (monospace) {
        this.htmlMonospace = monospace;
        return this;
    };
    /** show the rich text toolbar */
    HtmlEditor.prototype.enableToolbar = function () {
        this.toolbarEnabled = true;
        return this;
    };
    HtmlEditor.prototype.isToolbarEnabled = function () {
        return this.toolbarEnabled;
    };
    /** toggle the visibility of the rich text toolbar */
    HtmlEditor.prototype.toggleToolbar = function () {
        this.toolbarEnabled = !this.toolbarEnabled;
        return this;
    };
    HtmlEditor.prototype.setToolbarOptions = function (attrs) {
        this.toolbarAttrs = attrs;
        return this;
    };
    return HtmlEditor;
}());
exports.HtmlEditor = HtmlEditor;
