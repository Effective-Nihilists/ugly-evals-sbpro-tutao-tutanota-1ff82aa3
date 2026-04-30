"use strict";
exports.__esModule = true;
exports.showKnowledgeBaseEditor = void 0;
var mithril_1 = require("mithril");
var KnowledgeBaseEditorModel_1 = require("./KnowledgeBaseEditorModel");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var TextField_js_1 = require("../gui/base/TextField.js");
var Dialog_1 = require("../gui/base/Dialog");
var LanguageViewModel_1 = require("../misc/LanguageViewModel");
var MainLocator_1 = require("../api/main/MainLocator");
var Dropdown_js_1 = require("../gui/base/Dropdown.js");
var ErrorHandlerImpl_1 = require("../misc/ErrorHandlerImpl");
var EntityUtils_1 = require("../api/common/utils/EntityUtils");
var HtmlEditor_1 = require("../gui/editor/HtmlEditor");
var UserError_1 = require("../api/main/UserError");
var TemplatePopupModel_1 = require("../templates/model/TemplatePopupModel");
/**
 *  Editor to edit / add a knowledgeBase entry
 *  Returned promise resolves when the dialog closes
 */
function showKnowledgeBaseEditor(entry, templateGroupRoot) {
    var entityClient = MainLocator_1.locator.entityClient;
    var editorModel = new KnowledgeBaseEditorModel_1.KnowledgeBaseEditorModel(entry, templateGroupRoot, entityClient);
    var closeDialog = function () {
        dialog.close();
    };
    var saveAction = function () {
        editorModel.save().then(closeDialog)["catch"]((0, tutanota_utils_1.ofClass)(UserError_1.UserError, ErrorHandlerImpl_1.showUserError));
    };
    var headerBarAttrs = {
        left: [
            {
                label: "cancel_action",
                click: closeDialog,
                type: "secondary" /* ButtonType.Secondary */
            },
        ],
        right: [
            {
                label: "save_action",
                click: saveAction,
                type: "primary" /* ButtonType.Primary */
            },
        ],
        middle: function () { return LanguageViewModel_1.lang.get(editorModel.entry._id ? "editEntry_label" : "createEntry_action"); }
    };
    var dialog = Dialog_1.Dialog.largeDialogN(headerBarAttrs, KnowledgeBaseEditor, editorModel);
    dialog.show();
}
exports.showKnowledgeBaseEditor = showKnowledgeBaseEditor;
var KnowledgeBaseEditor = /** @class */ (function () {
    function KnowledgeBaseEditor(vnode) {
        var _this = this;
        var model = vnode.attrs;
        this.linkedTemplateButtonAttrs = {
            title: "linkTemplate_label",
            icon: "Add" /* Icons.Add */,
            colors: "elevated" /* ButtonColor.Elevated */,
            click: function (e, dom) {
                e.stopPropagation();
                (0, Dropdown_js_1.createAsyncDropdown)({
                    lazyButtons: function () { return _this._createDropdownChildAttrs(model); }
                })(e, dom);
            },
            size: 1 /* ButtonSize.Compact */
        };
        this.entryContentEditor = new HtmlEditor_1.HtmlEditor("content_label")
            .showBorders()
            .setMinHeight(500)
            .enableToolbar()
            .setToolbarOptions({
            customButtonAttrs: [this.linkedTemplateButtonAttrs]
        });
        model.setDescriptionProvider(function () {
            return _this.entryContentEditor.getValue();
        });
        if (model.isUpdate()) {
            this.entryContentEditor.setValue(model.entry.description);
        }
    }
    KnowledgeBaseEditor.prototype._createDropdownChildAttrs = function (model) {
        var _this = this;
        return model.availableTemplates.getAsync().then(function (templates) {
            if (templates.length > 0) {
                return templates.map(function (template) {
                    return {
                        label: function () { return template.tag; },
                        click: function () { return _this.entryContentEditor.editor.insertHTML(createTemplateLink(template)); }
                    };
                });
            }
            else {
                return [
                    {
                        label: "noEntries_msg",
                        click: tutanota_utils_1.noOp
                    },
                ];
            }
        });
    };
    KnowledgeBaseEditor.prototype.view = function (vnode) {
        var model = vnode.attrs;
        return (0, mithril_1["default"])("", [
            (0, mithril_1["default"])(TextField_js_1.TextField, {
                label: "title_placeholder",
                value: model.title(),
                oninput: model.title
            }),
            (0, mithril_1["default"])(TextField_js_1.TextField, {
                label: "keywords_label",
                value: model.keywords(),
                oninput: model.keywords
            }),
            (0, mithril_1["default"])(this.entryContentEditor),
        ]);
    };
    return KnowledgeBaseEditor;
}());
function createTemplateLink(template) {
    var listId = (0, EntityUtils_1.listIdPart)((0, EntityUtils_1.getLetId)(template));
    var elementId = (0, EntityUtils_1.elementIdPart)((0, EntityUtils_1.getLetId)(template));
    return "<a href=\"tutatemplate:".concat(listId, "/").concat(elementId, "\">").concat(TemplatePopupModel_1.TEMPLATE_SHORTCUT_PREFIX + template.tag, "</a>");
}
