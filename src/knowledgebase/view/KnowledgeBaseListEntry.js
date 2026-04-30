"use strict";
exports.__esModule = true;
exports.KnowledgeBaseListEntry = exports.KNOWLEDGEBASE_LIST_ENTRY_HEIGHT = void 0;
var mithril_1 = require("mithril");
var size_1 = require("../../gui/size");
exports.KNOWLEDGEBASE_LIST_ENTRY_HEIGHT = 50;
/**
 *  Renders one list entry of the knowledgeBase
 */
var KnowledgeBaseListEntry = /** @class */ (function () {
    function KnowledgeBaseListEntry() {
    }
    KnowledgeBaseListEntry.prototype.view = function (vnode) {
        var _a = vnode.attrs.entry, title = _a.title, keywords = _a.keywords;
        return (0, mithril_1["default"])(".flex.flex-column.overflow-hidden.full-width", {
            style: {
                height: (0, size_1.px)(exports.KNOWLEDGEBASE_LIST_ENTRY_HEIGHT)
            }
        }, [
            (0, mithril_1["default"])(".text-ellipsis.mb-xs.b", title),
            (0, mithril_1["default"])(".flex.badge-line-height.text-ellipsis", [
                keywords.map(function (keyword) {
                    return (0, mithril_1["default"])(".b.small.teamLabel.pl-s.pr-s.border-radius.no-wrap.small.mr-s.min-content", keyword.keyword);
                }),
            ]),
        ]);
    };
    return KnowledgeBaseListEntry;
}());
exports.KnowledgeBaseListEntry = KnowledgeBaseListEntry;
