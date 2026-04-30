"use strict";
exports.__esModule = true;
exports.TextField = exports.inputLineHeight = void 0;
var mithril_1 = require("mithril");
var size_1 = require("../size");
var Animations_1 = require("../animation/Animations");
var theme_1 = require("../theme");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
exports.inputLineHeight = size_1.size.font_size_base + 8;
var inputMarginTop = size_1.size.font_size_small + size_1.size.hpad_small + 3;
// this is not always correct because font size can be biggger/smaller and we ideally should take that into account
var baseLabelPosition = 21;
// it should fit
// compact button + 1 px border + 1 px padding to keep things centered = 32
// 24px line-height + 12px label + some space between them = 36 + ?
var minInputHeight = 46;
var TextField = /** @class */ (function () {
    function TextField() {
        this.onblur = null;
        this.active = false;
    }
    TextField.prototype.view = function (vnode) {
        var _this = this;
        var a = vnode.attrs;
        var maxWidth = a.maxWidth;
        var labelBase = !this.active && a.value === "" && !a.disabled && !this._didAutofill && !a.injectionsLeft;
        var labelTransitionSpeed = Animations_1.DefaultAnimationTime / 2;
        var doShowBorder = a.doShowBorder !== false;
        var borderWidth = this.active ? "2px" : "1px";
        var borderColor = this.active ? theme_1.theme.content_accent : theme_1.theme.content_border;
        return (0, mithril_1["default"])(".text-field.rel.overflow-hidden", {
            id: vnode.attrs.id,
            oncreate: function (vnode) { return (_this._domWrapper = vnode.dom); },
            onclick: function (e) { return (a.onclick ? a.onclick(e, _this._domInputWrapper) : _this.focus(e, a)); },
            "class": a["class"] != null ? a["class"] : "text pt",
            style: maxWidth
                ? {
                    maxWidth: (0, size_1.px)(maxWidth)
                }
                : {}
        }, [
            (0, mithril_1["default"])("label.abs.text-ellipsis.noselect.z1.i.pr-s.text", {
                "class": this.active ? "content-accent-fg" : "",
                oncreate: function (vnode) {
                    _this._domLabel = vnode.dom;
                },
                style: {
                    fontSize: "".concat(labelBase ? size_1.size.font_size_base : size_1.size.font_size_small, "px"),
                    transform: "translateY(".concat(labelBase ? baseLabelPosition : 0, "px)"),
                    transition: "transform ".concat(labelTransitionSpeed, "ms ease-out, font-size ").concat(labelTransitionSpeed, "ms  ease-out")
                }
            }, LanguageViewModel_1.lang.getMaybeLazy(a.label)),
            (0, mithril_1["default"])(".flex.flex-column", [
                // another wrapper to fix IE 11 min-height bug https://github.com/philipwalton/flexbugs#3-min-height-on-a-flex-container-wont-apply-to-its-flex-items
                (0, mithril_1["default"])(".flex.items-end.flex-wrap", {
                    // .flex-wrap
                    style: {
                        "min-height": (0, size_1.px)(minInputHeight),
                        // 2 px border
                        "padding-bottom": this.active ? (0, size_1.px)(0) : (0, size_1.px)(1),
                        "border-bottom": doShowBorder ? "".concat(borderWidth, " solid ").concat(borderColor) : ""
                    }
                }, [
                    a.injectionsLeft ? a.injectionsLeft() : null,
                    (0, mithril_1["default"])(".inputWrapper.flex-space-between.items-end", {
                        style: {
                            minHeight: (0, size_1.px)(minInputHeight - 2)
                        },
                        oncreate: function (vnode) { return (_this._domInputWrapper = vnode.dom); }
                    }, [
                        a.type !== "area" /* TextFieldType.Area */ ? this._getInputField(a) : this._getTextArea(a),
                        a.injectionsRight ? (0, mithril_1["default"])(".flex-end.items-center", {
                            style: { minHeight: (0, size_1.px)(minInputHeight - 2) }
                        }, a.injectionsRight()) : null,
                    ]),
                ]),
            ]),
            a.helpLabel
                ? (0, mithril_1["default"])("small.noselect", {
                    onclick: function (e) {
                        e.stopPropagation();
                    }
                }, a.helpLabel())
                : [],
        ]);
    };
    TextField.prototype._getInputField = function (a) {
        var _this = this;
        if (a.disabled) {
            return (0, mithril_1["default"])(".text-break.selectable", {
                style: {
                    marginTop: (0, size_1.px)(inputMarginTop),
                    lineHeight: (0, size_1.px)(exports.inputLineHeight)
                }
            }, a.value);
        }
        else {
            // Due to modern browser's 'smart' password managers that try to autofill everything
            // that remotely resembles a password field, we prepend invisible inputs to password fields
            // that shouldn't be autofilled.
            // since the autofill algorithm looks at inputs that come before and after the password field we need
            // three dummies.
            var autofillGuard = a.preventAutofill
                ? [
                    (0, mithril_1["default"])("input.abs", {
                        style: {
                            opacity: "0",
                            height: "0"
                        },
                        tabIndex: "-1" /* TabIndex.Programmatic */,
                        type: "text" /* TextFieldType.Text */
                    }),
                    (0, mithril_1["default"])("input.abs", {
                        style: {
                            opacity: "0",
                            height: "0"
                        },
                        tabIndex: "-1" /* TabIndex.Programmatic */,
                        type: "password" /* TextFieldType.Password */
                    }),
                    (0, mithril_1["default"])("input.abs", {
                        style: {
                            opacity: "0",
                            height: "0"
                        },
                        tabIndex: "-1" /* TabIndex.Programmatic */,
                        type: "text" /* TextFieldType.Text */
                    }),
                ]
                : [];
            return (0, mithril_1["default"])(".flex-grow.rel", autofillGuard.concat([
                (0, mithril_1["default"])("input.input" + (a.alignRight ? ".right" : ""), {
                    autocomplete: a.preventAutofill ? "off" : "",
                    type: a.type,
                    "aria-label": LanguageViewModel_1.lang.getMaybeLazy(a.label),
                    oncreate: function (vnode) {
                        var _a;
                        _this.domInput = vnode.dom;
                        (_a = a.onDomInputCreated) === null || _a === void 0 ? void 0 : _a.call(a, _this.domInput);
                        _this.domInput.value = a.value;
                        if (a.type !== "area" /* TextFieldType.Area */) {
                            vnode.dom.addEventListener("animationstart", function (e) {
                                if (e.animationName === "onAutoFillStart") {
                                    _this._didAutofill = true;
                                    mithril_1["default"].redraw();
                                }
                                else if (e.animationName === "onAutoFillCancel") {
                                    _this._didAutofill = false;
                                    mithril_1["default"].redraw();
                                }
                            });
                        }
                    },
                    onfocus: function (e) {
                        _this.focus(e, a);
                        a.onfocus && a.onfocus(_this._domWrapper, _this.domInput);
                    },
                    onblur: function (e) { return _this.blur(e, a); },
                    onkeydown: function (e) {
                        // keydown is used to cancel certain keypresses of the user (mainly needed for the BubbleTextField)
                        var key = {
                            keyCode: e.which,
                            key: e.key,
                            ctrl: e.ctrlKey,
                            shift: e.shiftKey
                        };
                        return a.keyHandler != null ? a.keyHandler(key) : true;
                    },
                    onupdate: function () {
                        // only change the value if the value has changed otherwise the cursor in Safari and in the iOS App cannot be positioned.
                        if (_this.domInput.value !== a.value) {
                            _this.domInput.value = a.value;
                        }
                    },
                    oninput: function () {
                        a.oninput && a.oninput(_this.domInput.value, _this.domInput);
                    },
                    onremove: function () {
                        // We clean up any value that might still be in DOM e.g. password
                        if (_this.domInput)
                            _this.domInput.value = "";
                    },
                    style: {
                        maxWidth: a.maxWidth,
                        minWidth: (0, size_1.px)(20),
                        // fix for edge browser. buttons are cut off in small windows otherwise
                        lineHeight: (0, size_1.px)(exports.inputLineHeight),
                        fontSize: a.fontSize
                    }
                })
            ]));
        }
    };
    TextField.prototype._getTextArea = function (a) {
        var _this = this;
        if (a.disabled) {
            return (0, mithril_1["default"])(".text-prewrap.text-break.selectable", {
                style: {
                    marginTop: (0, size_1.px)(inputMarginTop),
                    lineHeight: (0, size_1.px)(exports.inputLineHeight)
                }
            }, a.value);
        }
        else {
            return (0, mithril_1["default"])("textarea.input-area.text-pre", {
                "aria-label": LanguageViewModel_1.lang.getMaybeLazy(a.label),
                oncreate: function (vnode) {
                    _this.domInput = vnode.dom;
                    _this.domInput.value = a.value;
                    _this.domInput.style.height = (0, size_1.px)(Math.max(a.value.split("\n").length, 1) * exports.inputLineHeight); // display all lines on creation of text area
                },
                onfocus: function (e) { return _this.focus(e, a); },
                onblur: function (e) { return _this.blur(e, a); },
                onkeydown: function (e) {
                    var key = {
                        keyCode: e.which,
                        key: e.key,
                        ctrl: e.ctrlKey,
                        shift: e.shiftKey
                    };
                    return a.keyHandler != null ? a.keyHandler(key) : true;
                },
                oninput: function () {
                    _this.domInput.style.height = "0px";
                    _this.domInput.style.height = (0, size_1.px)(_this.domInput.scrollHeight);
                    a.oninput && a.oninput(_this.domInput.value, _this.domInput);
                },
                onupdate: function () {
                    // only change the value if the value has changed otherwise the cursor in Safari and in the iOS App cannot be positioned.
                    if (_this.domInput.value !== a.value) {
                        _this.domInput.value = a.value;
                    }
                },
                style: {
                    marginTop: (0, size_1.px)(inputMarginTop),
                    lineHeight: (0, size_1.px)(exports.inputLineHeight),
                    minWidth: (0, size_1.px)(20),
                    fontSize: a.fontSize
                }
            });
        }
    };
    TextField.prototype.focus = function (e, a) {
        if (!this.active && !a.disabled) {
            this.active = true;
            this.domInput.focus();
            this._domWrapper.classList.add("active");
        }
    };
    TextField.prototype.blur = function (e, a) {
        /*if (this.skipNextBlur) {
     this.domInput.focus()
     } else {
     */
        this._domWrapper.classList.remove("active");
        this.active = false;
        if (a.onblur instanceof Function)
            a.onblur(e);
        /*}
     this.skipNextBlur = false
     */
    };
    TextField.prototype.isEmpty = function (value) {
        return value === "";
    };
    return TextField;
}());
exports.TextField = TextField;
