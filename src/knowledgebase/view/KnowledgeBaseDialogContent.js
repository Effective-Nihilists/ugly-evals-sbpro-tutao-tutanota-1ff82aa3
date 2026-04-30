"use strict";
exports.__esModule = true;
exports.KnowledgeBaseDialogContent = void 0;
var mithril_1 = require("mithril");
var KnowledgeBaseListEntry_1 = require("./KnowledgeBaseListEntry");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var stream_1 = require("mithril/stream");
var KnowledgeBaseEntryView_1 = require("./KnowledgeBaseEntryView");
var RestError_1 = require("../../api/common/error/RestError");
var Dialog_1 = require("../../gui/base/Dialog");
var TextField_js_1 = require("../../gui/base/TextField.js");
var GuiUtils_1 = require("../../gui/base/GuiUtils");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
/**
 *  Renders the SearchBar and the pages (list, entry, template) of the knowledgeBase besides the MailEditor
 */
var KnowledgeBaseDialogContent = /** @class */ (function () {
    function KnowledgeBaseDialogContent() {
        this.filterValue = "";
        this._streams = [];
    }
    KnowledgeBaseDialogContent.prototype.oncreate = function (_a) {
        var attrs = _a.attrs;
        var model = attrs.model;
        this._streams.push(stream_1["default"].combine(function () {
            mithril_1["default"].redraw();
        }, [model.selectedEntry, model.filteredEntries]));
    };
    KnowledgeBaseDialogContent.prototype.onremove = function () {
        for (var _i = 0, _a = this._streams; _i < _a.length; _i++) {
            var stream_2 = _a[_i];
            stream_2.end(true);
        }
    };
    KnowledgeBaseDialogContent.prototype.view = function (_a) {
        var _this = this;
        var attrs = _a.attrs;
        var model = attrs.model;
        var selectedEntry = model.selectedEntry();
        return selectedEntry
            ? (0, mithril_1["default"])(KnowledgeBaseEntryView_1.KnowledgeBaseEntryView, {
                entry: selectedEntry,
                onTemplateSelected: function (templateId) {
                    model
                        .loadTemplate(templateId)
                        .then(function (fetchedTemplate) {
                        attrs.onTemplateSelect(fetchedTemplate);
                    })["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotFoundError, function () { return Dialog_1.Dialog.message("templateNotExists_msg"); }));
                },
                readonly: model.isReadOnly(selectedEntry)
            })
            : [
                (0, mithril_1["default"])(TextField_js_1.TextField, {
                    label: function () { return LanguageViewModel_1.lang.get("filter_label"); },
                    value: this.filterValue,
                    oninput: function (value) {
                        _this.filterValue = value;
                        model.filter(value);
                        mithril_1["default"].redraw();
                    }
                }),
                this._renderKeywords(model),
                this._renderList(model, attrs),
            ];
    };
    KnowledgeBaseDialogContent.prototype._renderKeywords = function (model) {
        var matchedKeywords = model.getMatchedKeywordsInContent();
        return (0, mithril_1["default"])(".flex.mt-s.wrap", [
            matchedKeywords.length > 0 ? (0, mithril_1["default"])(".small.full-width", LanguageViewModel_1.lang.get("matchingKeywords_label")) : null,
            matchedKeywords.map(function (keyword) {
                return (0, mithril_1["default"])(".keyword-bubble-no-padding.plr-button.pl-s.pr-s.border-radius.no-wrap.mr-s.min-content", keyword);
            }),
        ]);
    };
    KnowledgeBaseDialogContent.prototype._renderList = function (model, attrs) {
        var _this = this;
        return (0, mithril_1["default"])(".mt-s.scroll", {
            oncreate: function (vnode) {
                _this._selectionChangedListener = model.selectedEntry.map((0, GuiUtils_1.makeListSelectionChangedScrollHandler)(vnode.dom, KnowledgeBaseListEntry_1.KNOWLEDGEBASE_LIST_ENTRY_HEIGHT, model.getSelectedEntryIndex.bind(model)));
            },
            onbeforeremove: function () {
                _this._selectionChangedListener.end();
            }
        }, [model.containsResult() ? model.filteredEntries().map(function (entry) { return _this._renderListEntry(model, entry); }) : (0, mithril_1["default"])(".center", LanguageViewModel_1.lang.get("noEntryFound_label"))]);
    };
    KnowledgeBaseDialogContent.prototype._renderListEntry = function (model, entry) {
        return (0, mithril_1["default"])(".flex.flex-column.click.hoverable-list-item", [
            (0, mithril_1["default"])(".flex", {
                onclick: function () {
                    model.selectedEntry(entry);
                }
            }, [
                (0, mithril_1["default"])(KnowledgeBaseListEntry_1.KnowledgeBaseListEntry, {
                    entry: entry
                }),
                (0, mithril_1["default"])("", {
                    style: {
                        width: "17.1px",
                        height: "16px"
                    }
                }),
            ]),
        ]);
    };
    return KnowledgeBaseDialogContent;
}());
exports.KnowledgeBaseDialogContent = KnowledgeBaseDialogContent;
