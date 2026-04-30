"use strict";
exports.__esModule = true;
exports.GiftCardMessageEditorField = void 0;
var mithril_1 = require("mithril");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var GIFT_CARD_MESSAGE_COLS = 26;
var GIFT_CARD_MESSAGE_HEIGHT = 5;
/**
 * A text area that allows you to edit some text that is limited to fit within a certain rows/columns boundary
 */
var GiftCardMessageEditorField = /** @class */ (function () {
    function GiftCardMessageEditorField() {
        this.textAreaDom = null;
        this.isActive = false;
    }
    GiftCardMessageEditorField.prototype.view = function (vnode) {
        var _this = this;
        var a = vnode.attrs;
        return (0, mithril_1["default"])("", [
            (0, mithril_1["default"])(".small.mt-form.i", LanguageViewModel_1.lang.get("yourMessage_label")),
            (0, mithril_1["default"])("textarea.monospace.center.overflow-hidden.resize-none" + (this.isActive ? ".editor-border-active" : ".editor-border"), {
                wrap: "hard",
                cols: a.cols || GIFT_CARD_MESSAGE_COLS,
                rows: a.rows || GIFT_CARD_MESSAGE_HEIGHT,
                oncreate: function (vnode) {
                    _this.textAreaDom = vnode.dom;
                    _this.textAreaDom.value = a.message;
                },
                onfocus: function () {
                    _this.isActive = true;
                },
                onblur: function () {
                    _this.isActive = false;
                },
                oninput: function () {
                    var textAreaDom = (0, tutanota_utils_1.assertNotNull)(_this.textAreaDom);
                    var origStart = textAreaDom.selectionStart;
                    var origEnd = textAreaDom.selectionEnd;
                    // remove characters from the end
                    while (textAreaDom.clientHeight < textAreaDom.scrollHeight) {
                        textAreaDom.value = textAreaDom.value.substr(0, textAreaDom.value.length - 1);
                    }
                    a.onMessageChanged(textAreaDom.value);
                    // the cursor gets pushed to the end when we chew up tailing characters so we put it back where it started in that case
                    if (textAreaDom.selectionStart - origStart > 1) {
                        textAreaDom.selectionStart = origStart;
                        textAreaDom.selectionEnd = origEnd;
                    }
                }
            }),
        ]);
    };
    return GiftCardMessageEditorField;
}());
exports.GiftCardMessageEditorField = GiftCardMessageEditorField;
