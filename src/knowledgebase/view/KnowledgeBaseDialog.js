"use strict";
exports.__esModule = true;
exports.createKnowledgeBaseDialogInjection = void 0;
var KnowledgeBaseDialogContent_1 = require("./KnowledgeBaseDialogContent");
var TemplatePopup_1 = require("../../templates/view/TemplatePopup");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var Dropdown_js_1 = require("../../gui/base/Dropdown.js");
var stream_1 = require("mithril/stream");
var GroupUtils_1 = require("../../sharing/GroupUtils");
function createKnowledgeBaseDialogInjection(knowledgeBase, templateModel, editor) {
    var knowledgebaseAttrs = {
        onTemplateSelect: function (template) {
            (0, TemplatePopup_1.showTemplatePopupInEditor)(templateModel, editor, template, "");
        },
        model: knowledgeBase
    };
    var isDialogVisible = (0, stream_1["default"])(false);
    return {
        visible: isDialogVisible,
        headerAttrs: _createHeaderAttrs(knowledgebaseAttrs, isDialogVisible),
        componentAttrs: knowledgebaseAttrs,
        component: KnowledgeBaseDialogContent_1.KnowledgeBaseDialogContent
    };
}
exports.createKnowledgeBaseDialogInjection = createKnowledgeBaseDialogInjection;
function _createHeaderAttrs(attrs, isDialogVisible) {
    return function () {
        var selectedEntry = attrs.model.selectedEntry();
        return selectedEntry ? createEntryViewHeader(selectedEntry, attrs.model) : createListViewHeader(attrs.model, isDialogVisible);
    };
}
function createEntryViewHeader(entry, model) {
    return {
        left: [
            {
                label: "back_action",
                click: function () { return model.selectedEntry(null); },
                type: "secondary" /* ButtonType.Secondary */
            },
        ],
        middle: function () { return LanguageViewModel_1.lang.get("knowledgebase_label"); }
    };
}
function createListViewHeader(model, isDialogVisible) {
    return {
        left: function () { return [
            {
                label: "close_alt",
                click: function () { return isDialogVisible(false); },
                type: "primary" /* ButtonType.Primary */
            },
        ]; },
        middle: function () { return LanguageViewModel_1.lang.get("knowledgebase_label"); },
        right: [createAddButtonAttrs(model)]
    };
}
function createAddButtonAttrs(model) {
    var templateGroupInstances = model.getTemplateGroupInstances();
    if (templateGroupInstances.length === 1) {
        return {
            label: "add_action",
            click: function () {
                showKnowledgeBaseEditor(null, templateGroupInstances[0].groupRoot);
            },
            type: "primary" /* ButtonType.Primary */
        };
    }
    else {
        return {
            label: "add_action",
            type: "primary" /* ButtonType.Primary */,
            click: (0, Dropdown_js_1.createDropdown)({
                lazyButtons: function () { return templateGroupInstances.map(function (groupInstances) {
                    return {
                        label: function () { return (0, GroupUtils_1.getSharedGroupName)(groupInstances.groupInfo, true); },
                        click: function () {
                            showKnowledgeBaseEditor(null, groupInstances.groupRoot);
                        }
                    };
                }); }
            })
        };
    }
}
function showKnowledgeBaseEditor(entryToEdit, groupRoot) {
    Promise.resolve().then(function () { return require("../../settings/KnowledgeBaseEditor"); }).then(function (editor) {
        editor.showKnowledgeBaseEditor(entryToEdit, groupRoot);
    });
}
