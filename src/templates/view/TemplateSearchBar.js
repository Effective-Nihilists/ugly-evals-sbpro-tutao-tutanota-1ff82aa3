"use strict";
exports.__esModule = true;
exports.TemplateSearchBar = void 0;
var mithril_1 = require("mithril");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var size_1 = require("../../gui/size");
var theme_1 = require("../../gui/theme");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var TemplateSearchBar = /** @class */ (function () {
    function TemplateSearchBar() {
        this.domInput = null;
    }
    TemplateSearchBar.prototype.view = function (vnode) {
        var a = vnode.attrs;
        return (0, mithril_1["default"])(".inputWrapper.pt-xs.pb-xs", {
            style: {
                "border-bottom": "1px solid ".concat(theme_1.theme.content_border)
            }
        }, this._getInputField(a));
    };
    TemplateSearchBar.prototype._getInputField = function (a) {
        var _this = this;
        return (0, mithril_1["default"])("input.input", {
            placeholder: a.placeholder && LanguageViewModel_1.lang.getMaybeLazy(a.placeholder),
            oncreate: function (vnode) {
                _this.domInput = vnode.dom;
                _this.domInput.value = a.value();
                _this.domInput.focus();
            },
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
                var domInput = (0, tutanota_utils_1.assertNotNull)(_this.domInput);
                a.value(domInput.value);
                a.oninput && a.oninput(domInput.value, domInput);
            },
            style: {
                lineHeight: (0, size_1.px)(size_1.inputLineHeight)
            }
        });
    };
    return TemplateSearchBar;
}());
exports.TemplateSearchBar = TemplateSearchBar;
