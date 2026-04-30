"use strict";
exports.__esModule = true;
exports.TemplateExpander = void 0;
var mithril_1 = require("mithril");
var TemplatePopup_1 = require("./TemplatePopup");
var size_1 = require("../../gui/size");
var TutanotaConstants_1 = require("../../api/common/TutanotaConstants");
var KeyManager_1 = require("../../misc/KeyManager");
var TemplateExpander = /** @class */ (function () {
    function TemplateExpander() {
    }
    TemplateExpander.prototype.view = function (_a) {
        var attrs = _a.attrs;
        var model = attrs.model;
        var selectedContent = model.getSelectedContent();
        return (0, mithril_1["default"])(".flex.flex-column.flex-grow.scroll.ml-s", {
            style: {
                // maxHeight has to be set, because otherwise the content would overflow outside the flexbox (-44 because of header height)
                maxHeight: (0, size_1.px)(TemplatePopup_1.TEMPLATE_POPUP_HEIGHT - size_1.size.button_height)
            },
            onkeydown: function (e) {
                if ((0, KeyManager_1.isKeyPressed)(e.keyCode, TutanotaConstants_1.Keys.TAB)) {
                    e.preventDefault();
                }
            }
        }, [(0, mithril_1["default"])(".text-break.flex-grow.pr.overflow-y-visible", selectedContent ? mithril_1["default"].trust(selectedContent.text) : null)]);
    };
    return TemplateExpander;
}());
exports.TemplateExpander = TemplateExpander;
