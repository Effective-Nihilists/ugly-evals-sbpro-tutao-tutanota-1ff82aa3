"use strict";
exports.__esModule = true;
exports.registerTemplateShortcutListener = void 0;
var KeyManager_1 = require("../../misc/KeyManager");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var TutanotaConstants_1 = require("../../api/common/TutanotaConstants");
var TemplatePopupModel_1 = require("../model/TemplatePopupModel");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var Dropdown_js_1 = require("../../gui/base/Dropdown.js");
var Modal_1 = require("../../gui/base/Modal");
var TemplatePopup_1 = require("./TemplatePopup");
var tutanota_utils_2 = require("@tutao/tutanota-utils");
function registerTemplateShortcutListener(editor, templateModel) {
    var listener = new TemplateShortcutListener(editor, templateModel, LanguageViewModel_1.lang);
    editor.addEventListener("keydown", function (event) { return listener.handleKeyDown(event); });
    editor.addEventListener("cursor", function (event) { return listener.handleCursorChange(event); });
    return listener;
}
exports.registerTemplateShortcutListener = registerTemplateShortcutListener;
var TemplateShortcutListener = /** @class */ (function () {
    function TemplateShortcutListener(editor, templateModel, lang) {
        this._editor = editor;
        this._currentCursorPosition = null;
        this._templateModel = templateModel;
        this._lang = lang;
    }
    // add this event listener to handle quick selection of templates inside the editor
    TemplateShortcutListener.prototype.handleKeyDown = function (event) {
        var _this = this;
        var _a;
        if ((0, KeyManager_1.isKeyPressed)((0, tutanota_utils_1.downcast)(event).keyCode, TutanotaConstants_1.Keys.TAB) && this._currentCursorPosition) {
            var cursorEndPos = this._currentCursorPosition;
            var text = cursorEndPos.startContainer.nodeType === Node.TEXT_NODE ?
                ((_a = cursorEndPos.startContainer.textContent) !== null && _a !== void 0 ? _a : "")
                : "";
            var templateShortcutStartIndex = text.lastIndexOf(TemplatePopupModel_1.TEMPLATE_SHORTCUT_PREFIX);
            var lastWhiteSpaceIndex = text.search(/\s\S*$/);
            if (templateShortcutStartIndex !== -1 &&
                templateShortcutStartIndex < cursorEndPos.startOffset &&
                templateShortcutStartIndex > lastWhiteSpaceIndex) {
                // stopPropagation & preventDefault to prevent tabbing to "close" button or tabbing into background
                event.stopPropagation();
                event.preventDefault();
                var range = document.createRange();
                range.setStart(cursorEndPos.startContainer, templateShortcutStartIndex);
                range.setEnd(cursorEndPos.startContainer, cursorEndPos.startOffset);
                this._editor.setSelection(range);
                // find and insert template
                var selectedText = this._editor.getSelectedText();
                var template = this._templateModel.findTemplateWithTag(selectedText);
                if (template) {
                    if (template.contents.length > 1) {
                        // multiple languages
                        // show dropdown to select language
                        var buttons_1 = template.contents.map(function (content) {
                            return {
                                label: function () { return _this._lang.get(LanguageViewModel_1.languageByCode[(0, tutanota_utils_1.downcast)(content.languageCode)].textId); },
                                click: function () {
                                    _this._editor.insertHTML(content.text);
                                    _this._editor.focus();
                                }
                            };
                        });
                        var dropdown = new Dropdown_js_1.Dropdown(function () { return buttons_1; }, 200);
                        dropdown.setOrigin(this._editor.getCursorPosition());
                        Modal_1.modal.displayUnique(dropdown, false);
                    }
                    else {
                        this._editor.insertHTML((0, tutanota_utils_2.firstThrow)(template.contents).text);
                    }
                }
                else {
                    (0, TemplatePopup_1.showTemplatePopupInEditor)(this._templateModel, this._editor, null, selectedText);
                }
            }
        }
    };
    TemplateShortcutListener.prototype.handleCursorChange = function (event) {
        this._currentCursorPosition = (0, tutanota_utils_1.downcast)(event).range;
    };
    return TemplateShortcutListener;
}());
