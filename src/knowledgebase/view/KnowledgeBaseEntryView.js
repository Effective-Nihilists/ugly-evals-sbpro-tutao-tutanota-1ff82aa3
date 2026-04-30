"use strict";
exports.__esModule = true;
exports.KnowledgeBaseEntryView = void 0;
var mithril_1 = require("mithril");
var TypeRefs_js_1 = require("../../api/entities/tutanota/TypeRefs.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var HtmlSanitizer_1 = require("../../misc/HtmlSanitizer");
var MainLocator_1 = require("../../api/main/MainLocator");
var GuiUtils_1 = require("../../gui/base/GuiUtils");
var RestError_1 = require("../../api/common/error/RestError");
var IconButton_js_1 = require("../../gui/base/IconButton.js");
/**
 *  Renders one knowledgeBase entry
 */
var KnowledgeBaseEntryView = /** @class */ (function () {
    function KnowledgeBaseEntryView() {
        this._sanitizedEntry = (0, tutanota_utils_1.memoized)(function (entry) {
            return {
                content: HtmlSanitizer_1.htmlSanitizer.sanitizeHTML(entry.description, {
                    blockExternalContent: true
                }).html
            };
        });
    }
    KnowledgeBaseEntryView.prototype.view = function (_a) {
        var attrs = _a.attrs;
        return (0, mithril_1["default"])(".flex.flex-column", [this._renderContent(attrs)]);
    };
    KnowledgeBaseEntryView.prototype._renderContent = function (attrs) {
        var _this = this;
        var entry = attrs.entry, readonly = attrs.readonly;
        return (0, mithril_1["default"])("", {
            onclick: function (event) {
                _this._handleAnchorClick(event, attrs);
            }
        }, [
            (0, mithril_1["default"])(".flex.mt-l.center-vertically.selectable", (0, mithril_1["default"])(".h4.text-ellipsis", entry.title), !readonly ? [(0, mithril_1["default"])(".flex.flex-grow.justify-end", [this.renderEditButton(entry), this.renderRemoveButton(entry)])] : null),
            (0, mithril_1["default"])("", [
                (0, mithril_1["default"])(".mt-s.flex.mt-s.wrap", [
                    entry.keywords.map(function (entryKeyword) {
                        return (0, mithril_1["default"])(".keyword-bubble.selectable", entryKeyword.keyword);
                    }),
                ]),
                (0, mithril_1["default"])(".flex.flex-column.mt-s", [(0, mithril_1["default"])(".editor-border.text-break.selectable", mithril_1["default"].trust(this._sanitizedEntry(entry).content))]),
            ]),
        ]);
    };
    KnowledgeBaseEntryView.prototype.renderRemoveButton = function (entry) {
        return (0, mithril_1["default"])(IconButton_js_1.IconButton, {
            title: "remove_action",
            icon: "Trash" /* Icons.Trash */,
            click: function () {
                (0, GuiUtils_1.getConfirmation)("deleteEntryConfirm_msg").confirmed(function () { return MainLocator_1.locator.entityClient.erase(entry)["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotFoundError, tutanota_utils_1.noOp)); });
            }
        });
    };
    KnowledgeBaseEntryView.prototype.renderEditButton = function (entry) {
        return (0, mithril_1["default"])(IconButton_js_1.IconButton, {
            title: "edit_action",
            icon: "Edit" /* Icons.Edit */,
            click: function () {
                Promise.resolve().then(function () { return require("../../settings/KnowledgeBaseEditor"); }).then(function (_a) {
                    var showKnowledgeBaseEditor = _a.showKnowledgeBaseEditor;
                    MainLocator_1.locator.entityClient.load(TypeRefs_js_1.TemplateGroupRootTypeRef, (0, tutanota_utils_1.neverNull)(entry._ownerGroup)).then(function (groupRoot) {
                        showKnowledgeBaseEditor(entry, groupRoot);
                    });
                });
            }
        });
    };
    KnowledgeBaseEntryView.prototype._handleAnchorClick = function (event, attrs) {
        var target = event.target;
        if (target && target.closest) {
            var anchorElement = target.closest("a");
            if (anchorElement && (0, tutanota_utils_1.startsWith)(anchorElement.href, "tutatemplate:")) {
                event.preventDefault();
                var _a = new URL(anchorElement.href).pathname.split("/"), listId = _a[0], elementId = _a[1];
                attrs.onTemplateSelected([listId, elementId]);
            }
        }
    };
    return KnowledgeBaseEntryView;
}());
exports.KnowledgeBaseEntryView = KnowledgeBaseEntryView;
