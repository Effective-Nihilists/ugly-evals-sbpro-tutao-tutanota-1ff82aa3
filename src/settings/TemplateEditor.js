"use strict";
exports.__esModule = true;
exports.showTemplateEditor = void 0;
var mithril_1 = require("mithril");
var TextField_js_1 = require("../gui/base/TextField.js");
var Dialog_1 = require("../gui/base/Dialog");
var Dropdown_js_1 = require("../gui/base/Dropdown.js");
var LanguageViewModel_1 = require("../misc/LanguageViewModel");
var TemplateEditorModel_1 = require("./TemplateEditorModel");
var MainLocator_1 = require("../api/main/MainLocator");
var ErrorHandlerImpl_1 = require("../misc/ErrorHandlerImpl");
var UserError_1 = require("../api/main/UserError");
var HtmlEditor_1 = require("../gui/editor/HtmlEditor");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var IconButton_js_1 = require("../gui/base/IconButton.js");
/**
 * Creates an Editor Popup in which you can create a new template or edit an existing one
 */
function showTemplateEditor(template, templateGroupRoot) {
    var entityClient = MainLocator_1.locator.entityClient;
    var editorModel = new TemplateEditorModel_1.TemplateEditorModel(template, templateGroupRoot, entityClient);
    var dialogCloseAction = function () {
        dialog.close();
    };
    var saveAction = function () {
        editorModel
            .save()
            .then(function () {
            dialogCloseAction();
        })["catch"]((0, tutanota_utils_1.ofClass)(UserError_1.UserError, ErrorHandlerImpl_1.showUserError));
    };
    var headerBarAttrs = {
        left: [
            {
                label: "cancel_action",
                click: dialogCloseAction,
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
        middle: function () { return LanguageViewModel_1.lang.get(editorModel.template._id ? "editTemplate_action" : "createTemplate_action"); }
    };
    var dialog = Dialog_1.Dialog.largeDialogN(headerBarAttrs, TemplateEditor, {
        model: editorModel
    });
    dialog.show();
}
exports.showTemplateEditor = showTemplateEditor;
var TemplateEditor = /** @class */ (function () {
    function TemplateEditor(vnode) {
        var _this = this;
        this.model = vnode.attrs.model;
        this.templateContentEditor = new HtmlEditor_1.HtmlEditor("content_label")
            .showBorders()
            .setMinHeight(500)
            .enableToolbar();
        this.model.setContentProvider(function () {
            return _this.templateContentEditor.getValue();
        });
        // init all input fields
        this.model.title(this.model.template.title);
        this.model.tag(this.model.template.tag);
        var content = this.model.selectedContent();
        if (content) {
            this.templateContentEditor.setValue(content.text);
        }
    }
    TemplateEditor.prototype.view = function () {
        var _this = this;
        return (0, mithril_1["default"])("", [
            (0, mithril_1["default"])(TextField_js_1.TextField, {
                label: "title_placeholder",
                value: this.model.title(),
                oninput: this.model.title
            }),
            (0, mithril_1["default"])(TextField_js_1.TextField, {
                label: "shortcut_label",
                value: this.model.tag(),
                oninput: this.model.tag
            }),
            (0, mithril_1["default"])(TextField_js_1.TextField, {
                label: "language_label",
                value: this.model.selectedContent() ? (0, TemplateEditorModel_1.getLanguageName)(this.model.selectedContent()) : "",
                injectionsRight: function () { return (0, mithril_1["default"])(".flex.ml-between-s", [
                    _this.model.getAddedLanguages().length > 1
                        ? [_this.renderRemoveLangButton(), _this.renderSelectLangButton()]
                        : null,
                    _this.renderAddLangButton(),
                ]); },
                disabled: true
            }),
            (0, mithril_1["default"])(this.templateContentEditor),
        ]);
    };
    TemplateEditor.prototype.renderAddLangButton = function () {
        var _this = this;
        return (0, mithril_1["default"])(IconButton_js_1.IconButton, {
            title: "addLanguage_action",
            icon: "Add" /* Icons.Add */,
            size: 1 /* ButtonSize.Compact */,
            click: (0, Dropdown_js_1.createDropdown)({
                lazyButtons: function () {
                    return _this.model
                        .getAdditionalLanguages()
                        .sort(function (a, b) { return LanguageViewModel_1.lang.get(a.textId).localeCompare(LanguageViewModel_1.lang.get(b.textId)); })
                        .map(function (lang) { return _this.createAddNewLanguageButtonAttrs(lang); });
                }, width: 250
            })
        });
    };
    TemplateEditor.prototype.renderSelectLangButton = function () {
        var _this = this;
        return (0, mithril_1["default"])(IconButton_js_1.IconButton, {
            title: "languages_label",
            icon: "Language" /* Icons.Language */,
            size: 1 /* ButtonSize.Compact */,
            click: (0, Dropdown_js_1.createDropdown)({
                lazyButtons: function () {
                    // save current content with language & create a dropdwon with all added languages & an option to add a new language
                    _this.model.updateContent();
                    return _this.model.template.contents.map(function (content) {
                        return {
                            label: function () { return (0, TemplateEditorModel_1.getLanguageName)(content); },
                            click: function () {
                                _this.model.selectedContent(content);
                                _this.templateContentEditor.setValue(content.text);
                            }
                        };
                    });
                }
            })
        });
    };
    TemplateEditor.prototype.renderRemoveLangButton = function () {
        var _this = this;
        return (0, mithril_1["default"])(IconButton_js_1.IconButton, {
            title: "removeLanguage_action",
            icon: "Trash" /* Icons.Trash */,
            click: function () { return _this.removeLanguage(); },
            size: 1 /* ButtonSize.Compact */
        });
    };
    TemplateEditor.prototype.removeLanguage = function () {
        var _this = this;
        return Dialog_1.Dialog.confirm(function () {
            return LanguageViewModel_1.lang.get("deleteLanguageConfirmation_msg", {
                "{language}": (0, TemplateEditorModel_1.getLanguageName)(_this.model.selectedContent())
            });
        }).then(function (confirmed) {
            if (confirmed) {
                _this.model.removeContent();
                _this.model.selectedContent(_this.model.template.contents[0]);
                _this.templateContentEditor.setValue(_this.model.selectedContent().text);
            }
            return confirmed;
        });
    };
    TemplateEditor.prototype.createAddNewLanguageButtonAttrs = function (lang) {
        var _this = this;
        return {
            label: lang.textId,
            click: function () {
                // save the current state of the content editor in the model,
                // because we will overwrite it when a new language is added
                _this.model.updateContent();
                var newContent = _this.model.createContent(lang.code);
                _this.model.selectedContent(newContent);
                _this.templateContentEditor.setValue("");
            }
        };
    };
    return TemplateEditor;
}());
