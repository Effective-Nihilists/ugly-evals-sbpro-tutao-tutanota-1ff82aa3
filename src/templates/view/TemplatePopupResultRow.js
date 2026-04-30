"use strict";
exports.__esModule = true;
exports.TemplatePopupResultRow = void 0;
var mithril_1 = require("mithril");
var TemplatePopup_1 = require("./TemplatePopup");
var size_1 = require("../../gui/size");
var TemplatePopupModel_1 = require("../model/TemplatePopupModel");
/**
 *   renders one entry of the list in the template popup
 */
var TemplatePopupResultRow = /** @class */ (function () {
    function TemplatePopupResultRow() {
    }
    TemplatePopupResultRow.prototype.view = function (vnode) {
        var _a = vnode.attrs.template, title = _a.title, tag = _a.tag;
        return (0, mithril_1["default"])(".flex.flex-column.overflow-hidden.full-width.ml-s", {
            style: {
                height: (0, size_1.px)(TemplatePopup_1.TEMPLATE_LIST_ENTRY_HEIGHT)
            }
        }, [
            // marginLeft 4px because border-radius of tag has margin of 4px
            (0, mithril_1["default"])(".text-ellipsis", {
                style: {
                    marginLeft: "4px"
                }
            }, title),
            (0, mithril_1["default"])(".flex.badge-line-height.text-ellipsis", [
                tag
                    ? (0, mithril_1["default"])(".small.keyword-bubble-no-padding.pl-s.pr-s.border-radius.no-wrap.small.min-content", TemplatePopupModel_1.TEMPLATE_SHORTCUT_PREFIX + tag.toLowerCase())
                    : null,
            ]),
        ]);
    };
    return TemplatePopupResultRow;
}());
exports.TemplatePopupResultRow = TemplatePopupResultRow;
