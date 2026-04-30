"use strict";
exports.__esModule = true;
exports.BubbleTextField = void 0;
var mithril_1 = require("mithril");
var TextField_js_1 = require("./TextField.js");
var Button_js_1 = require("./Button.js");
var TutanotaConstants_1 = require("../../api/common/TutanotaConstants");
var Dropdown_js_1 = require("./Dropdown.js");
var BubbleTextField = /** @class */ (function () {
    function BubbleTextField() {
        this.active = false;
        this.domInput = null;
    }
    BubbleTextField.prototype.view = function (_a) {
        var _this = this;
        var attrs = _a.attrs;
        return (0, mithril_1["default"])(".bubble-text-field", [
            (0, mithril_1["default"])(TextField_js_1.TextField, {
                label: attrs.label,
                disabled: attrs.disabled,
                value: attrs.text,
                oninput: attrs.onInput,
                injectionsLeft: function () {
                    return attrs.items.map(function (item, idx, items) {
                        // We need overflow: hidden on both so that ellipsis on button works.
                        // flex is for reserving space for the comma. align-items: end so that comma is pushed to the bottom.
                        return (0, mithril_1["default"])(".flex.overflow-hidden.items-end", [
                            (0, mithril_1["default"])(".flex-no-grow-shrink-auto.overflow-hidden", (0, mithril_1["default"])(Button_js_1.Button, {
                                label: function () { return attrs.renderBubbleText(item); },
                                type: "textBubble" /* ButtonType.TextBubble */,
                                isSelected: function () { return false; },
                                click: function (e) {
                                    e.stopPropagation(); // do not focus the text field
                                    (0, Dropdown_js_1.createAsyncDropdown)({
                                        lazyButtons: function () { return attrs.getBubbleDropdownAttrs(item); },
                                        width: 250
                                    })(e, e.target);
                                }
                            })),
                            // Comma is shown when there's text/another bubble afterwards or if the field is active
                            _this.active || idx < items.length - 1 || attrs.text !== "" ? (0, mithril_1["default"])("span.pr", ",") : null,
                        ]);
                    });
                },
                injectionsRight: function () { var _a; return (_a = attrs.injectionsRight) !== null && _a !== void 0 ? _a : null; },
                oncreate: function (vnode) {
                    // If the field is initialized with bubbles but the user did not edit it yet then field will not have correct size
                    // and last bubble will not be on the same line with right injections (like "show" button). It is fixed after user
                    // edits the field and autocompletion changes the field but before that it's broken. To avoid it we set the size
                    // manually.
                    //
                    // This oncreate is run before the dom input's oncreate is run and sets the field so we have to access input on the
                    // next frame. There's no other callback to use without requesting redraw.
                    requestAnimationFrame(function () {
                        if (_this.domInput)
                            _this.domInput.size = 1;
                    });
                },
                onDomInputCreated: function (dom) { return _this.domInput = dom; },
                onfocus: function () {
                    _this.active = true;
                    attrs.onFocus();
                },
                onblur: function () {
                    _this.active = false;
                    attrs.onBlur();
                },
                keyHandler: function (key) {
                    switch (key.keyCode) {
                        case TutanotaConstants_1.Keys.BACKSPACE.code:
                            return attrs.onBackspace();
                        case TutanotaConstants_1.Keys.RETURN.code:
                            return attrs.onEnterKey();
                        case TutanotaConstants_1.Keys.DOWN.code:
                            return attrs.onUpKey();
                        case TutanotaConstants_1.Keys.UP.code:
                            return attrs.onDownKey();
                    }
                    return true;
                }
            }),
        ]);
    };
    return BubbleTextField;
}());
exports.BubbleTextField = BubbleTextField;
