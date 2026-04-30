"use strict";
exports.__esModule = true;
exports.TemplatePopup = exports.showTemplatePopupInEditor = exports.TEMPLATE_LIST_ENTRY_WIDTH = exports.TEMPLATE_LIST_ENTRY_HEIGHT = exports.TEMPLATE_POPUP_TWO_COLUMN_MIN_WIDTH = exports.TEMPLATE_POPUP_HEIGHT = void 0;
var mithril_1 = require("mithril");
var Modal_1 = require("../../gui/base/Modal");
var size_1 = require("../../gui/size");
var KeyManager_1 = require("../../misc/KeyManager");
var stream_1 = require("mithril/stream");
var TutanotaConstants_1 = require("../../api/common/TutanotaConstants");
var TemplatePopupResultRow_1 = require("./TemplatePopupResultRow");
var TemplateExpander_1 = require("./TemplateExpander");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var WindowFacade_1 = require("../../misc/WindowFacade");
var TypeRefs_js_1 = require("../../api/entities/tutanota/TypeRefs.js");
var Button_js_1 = require("../../gui/base/Button.js");
var TemplatePopupModel_1 = require("../model/TemplatePopupModel");
var Dropdown_js_1 = require("../../gui/base/Dropdown.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var MainLocator_1 = require("../../api/main/MainLocator");
var TemplateSearchBar_1 = require("./TemplateSearchBar");
var LoginController_1 = require("../../api/main/LoginController");
var GroupUtils_1 = require("../../sharing/GroupUtils");
var TemplateGroupUtils_1 = require("../TemplateGroupUtils");
var GuiUtils_1 = require("../../gui/base/GuiUtils");
var ScrollSelectList_1 = require("../../gui/ScrollSelectList");
var IconButton_js_1 = require("../../gui/base/IconButton.js");
exports.TEMPLATE_POPUP_HEIGHT = 340;
exports.TEMPLATE_POPUP_TWO_COLUMN_MIN_WIDTH = 600;
exports.TEMPLATE_LIST_ENTRY_HEIGHT = 47;
exports.TEMPLATE_LIST_ENTRY_WIDTH = 354;
/**
 *	Creates a Modal/Popup that allows user to paste templates directly into the MailEditor.
 *	Also allows user to change desired language when pasting.
 */
function showTemplatePopupInEditor(templateModel, editor, template, highlightedText) {
    var initialSearchString = template ? TemplatePopupModel_1.TEMPLATE_SHORTCUT_PREFIX + template.tag : highlightedText;
    var cursorRect = editor.getCursorPosition();
    var editorRect = editor.getDOM().getBoundingClientRect();
    var onSelect = function (text) {
        editor.insertHTML(text);
        editor.focus();
    };
    var rect;
    var availableHeightBelowCursor = window.innerHeight - cursorRect.bottom;
    var popUpHeight = exports.TEMPLATE_POPUP_HEIGHT + 10; // height + 10px offset for space from the bottom of the screen
    // By default the popup is shown below the cursor. If there is not enough space move the popup above the cursor
    var popUpWidth = editorRect.right - editorRect.left;
    if (availableHeightBelowCursor < popUpHeight) {
        var diff = popUpHeight - availableHeightBelowCursor;
        rect = new Dropdown_js_1.DomRectReadOnlyPolyfilled(editorRect.left, cursorRect.bottom - diff, popUpWidth, cursorRect.height);
    }
    else {
        rect = new Dropdown_js_1.DomRectReadOnlyPolyfilled(editorRect.left, cursorRect.bottom, popUpWidth, cursorRect.height);
    }
    var popup = new TemplatePopup(templateModel, rect, onSelect, initialSearchString);
    templateModel.search(initialSearchString);
    popup.show();
}
exports.showTemplatePopupInEditor = showTemplatePopupInEditor;
var TemplatePopup = /** @class */ (function () {
    function TemplatePopup(templateModel, rect, onSelect, initialSearchString) {
        var _this = this;
        this._inputDom = null;
        this.view = function () {
            var showTwoColumns = _this._isScreenWideEnough();
            return (0, mithril_1["default"])(".flex.flex-column.abs.elevated-bg.border-radius.dropdown-shadow", {
                // Main Wrapper
                style: {
                    width: (0, size_1.px)(_this._rect.width),
                    height: (0, size_1.px)(exports.TEMPLATE_POPUP_HEIGHT),
                    top: (0, size_1.px)(_this._rect.top),
                    left: (0, size_1.px)(_this._rect.left)
                },
                onclick: function (e) {
                    var _a;
                    (_a = _this._inputDom) === null || _a === void 0 ? void 0 : _a.focus();
                    e.stopPropagation();
                },
                oncreate: function () {
                    WindowFacade_1.windowFacade.addResizeListener(_this._resizeListener);
                },
                onremove: function () {
                    WindowFacade_1.windowFacade.removeResizeListener(_this._resizeListener);
                }
            }, [
                _this._renderHeader(),
                (0, mithril_1["default"])(".flex.flex-grow.scroll.mb-s", [
                    (0, mithril_1["default"])(".flex.flex-column.scroll" + (showTwoColumns ? ".pr" : ""), {
                        style: {
                            flex: "1 1 40%"
                        }
                    }, _this._renderList()),
                    showTwoColumns
                        ? (0, mithril_1["default"])(".flex.flex-column.flex-grow-shrink-half", {
                            style: {
                                flex: "1 1 60%"
                            }
                        }, _this._renderRightColumn())
                        : null,
                ]),
            ]);
        };
        this._renderSearchBar = function () {
            return (0, mithril_1["default"])(TemplateSearchBar_1.TemplateSearchBar, {
                value: _this._searchBarValue,
                placeholder: "filter_label",
                keyHandler: function (keyPress) {
                    if ((0, KeyManager_1.isKeyPressed)(keyPress.keyCode, TutanotaConstants_1.Keys.DOWN, TutanotaConstants_1.Keys.UP)) {
                        // This duplicates the listener set in this._shortcuts
                        // because the input consumes the event
                        _this._templateModel.selectNextTemplate((0, KeyManager_1.isKeyPressed)(keyPress.keyCode, TutanotaConstants_1.Keys.UP) ? TemplatePopupModel_1.SELECT_PREV_TEMPLATE : TemplatePopupModel_1.SELECT_NEXT_TEMPLATE);
                        return false;
                    }
                    else {
                        return true;
                    }
                },
                oninput: function (value) {
                    _this._debounceFilter(value);
                },
                oncreate: function (vnode) {
                    _this._inputDom = vnode.dom.firstElementChild; // firstElementChild is the input field of the input wrapper
                }
            });
        };
        this._rect = rect;
        this._onSelect = onSelect;
        this._initialWindowWidth = window.innerWidth;
        this._resizeListener = function () {
            _this._close();
        };
        this._searchBarValue = (0, stream_1["default"])(initialSearchString);
        this._templateModel = templateModel;
        this._shortcuts = [
            {
                key: TutanotaConstants_1.Keys.ESC,
                enabled: function () { return true; },
                exec: function () {
                    _this._onSelect("");
                    _this._close();
                    mithril_1["default"].redraw();
                },
                help: "closeTemplate_action"
            },
            {
                key: TutanotaConstants_1.Keys.RETURN,
                enabled: function () { return true; },
                exec: function () {
                    var selectedContent = _this._templateModel.getSelectedContent();
                    if (selectedContent) {
                        _this._onSelect(selectedContent.text);
                        _this._close();
                    }
                },
                help: "insertTemplate_action"
            },
            {
                key: TutanotaConstants_1.Keys.UP,
                enabled: function () { return true; },
                exec: function () {
                    _this._templateModel.selectNextTemplate(TemplatePopupModel_1.SELECT_PREV_TEMPLATE);
                },
                help: "selectPreviousTemplate_action"
            },
            {
                key: TutanotaConstants_1.Keys.DOWN,
                enabled: function () { return true; },
                exec: function () {
                    _this._templateModel.selectNextTemplate(TemplatePopupModel_1.SELECT_NEXT_TEMPLATE);
                },
                help: "selectNextTemplate_action"
            },
        ];
        this._redrawStream = templateModel.searchResults.map(function (results) {
            mithril_1["default"].redraw();
        });
        this._selectTemplateButtonAttrs = {
            label: "selectTemplate_action",
            click: function () {
                var selected = _this._templateModel.getSelectedContent();
                if (selected) {
                    _this._onSelect(selected.text);
                    _this._close();
                }
            },
            type: "primary" /* ButtonType.Primary */
        };
        this._debounceFilter = (0, tutanota_utils_1.debounce)(200, function (value) {
            templateModel.search(value);
        });
        this._debounceFilter(initialSearchString);
    }
    TemplatePopup.prototype._renderHeader = function () {
        var selectedTemplate = this._templateModel.getSelectedTemplate();
        return (0, mithril_1["default"])(".flex-space-between.center-vertically.pl.pr-s", [
            (0, mithril_1["default"])(".flex-start", [(0, mithril_1["default"])(".flex.center-vertically", this._renderSearchBar()), this._renderAddButton()]),
            (0, mithril_1["default"])(".flex-end", [
                selectedTemplate
                    ? this._renderEditButtons(selectedTemplate) // Right header wrapper
                    : null,
            ]),
        ]);
    };
    TemplatePopup.prototype._renderAddButton = function () {
        var _this = this;
        var attrs = this._createAddButtonAttributes();
        return (0, mithril_1["default"])("", {
            onkeydown: function (e) {
                var _a;
                // prevents tabbing into the background of the modal
                if ((0, KeyManager_1.isKeyPressed)(e.keyCode, TutanotaConstants_1.Keys.TAB) && !_this._templateModel.getSelectedTemplate()) {
                    (_a = _this._inputDom) === null || _a === void 0 ? void 0 : _a.focus();
                    e.preventDefault();
                }
            }
        }, attrs ? (0, mithril_1["default"])(IconButton_js_1.IconButton, attrs) : null);
    };
    TemplatePopup.prototype._createAddButtonAttributes = function () {
        var _this = this;
        var templateGroupInstances = this._templateModel.getTemplateGroupInstances();
        var writeableGroups = templateGroupInstances.filter(function (instance) {
            return (0, GroupUtils_1.hasCapabilityOnGroup)(LoginController_1.logins.getUserController().user, instance.group, "1" /* ShareCapability.Write */);
        });
        if (templateGroupInstances.length === 0) {
            return {
                title: "createTemplate_action",
                click: function () {
                    (0, TemplateGroupUtils_1.createInitialTemplateListIfAllowed)().then(function (groupRoot) {
                        if (groupRoot) {
                            _this.showTemplateEditor(null, groupRoot);
                        }
                    });
                },
                icon: "Add" /* Icons.Add */,
                colors: "drawernav" /* ButtonColor.DrawerNav */
            };
        }
        else if (writeableGroups.length === 1) {
            return {
                title: "createTemplate_action",
                click: function () { return _this.showTemplateEditor(null, writeableGroups[0].groupRoot); },
                icon: "Add" /* Icons.Add */,
                colors: "drawernav" /* ButtonColor.DrawerNav */
            };
        }
        else if (writeableGroups.length > 1) {
            return (0, Dropdown_js_1.attachDropdown)({
                mainButtonAttrs: {
                    title: "createTemplate_action",
                    icon: "Add" /* Icons.Add */,
                    colors: "drawernav" /* ButtonColor.DrawerNav */
                }, childAttrs: function () {
                    return writeableGroups.map(function (groupInstances) {
                        return {
                            label: function () { return (0, GroupUtils_1.getSharedGroupName)(groupInstances.groupInfo, true); },
                            click: function () { return _this.showTemplateEditor(null, groupInstances.groupRoot); }
                        };
                    });
                }
            });
        }
        else {
            return null;
        }
    };
    TemplatePopup.prototype._renderEditButtons = function (selectedTemplate) {
        var _this = this;
        var selectedContent = this._templateModel.getSelectedContent();
        var selectedGroup = this._templateModel.getSelectedTemplateGroupInstance();
        var canEdit = !!selectedGroup && (0, GroupUtils_1.hasCapabilityOnGroup)(LoginController_1.logins.getUserController().user, selectedGroup.group, "1" /* ShareCapability.Write */);
        return [
            (0, mithril_1["default"])(".flex.flex-column.justify-center.mr-m", selectedContent ? (0, mithril_1["default"])("", LanguageViewModel_1.lang.get(LanguageViewModel_1.languageByCode[selectedContent.languageCode].textId)) : ""),
            (0, mithril_1["default"])(IconButton_js_1.IconButton, (0, Dropdown_js_1.attachDropdown)({
                mainButtonAttrs: {
                    title: "chooseLanguage_action",
                    icon: "Language" /* Icons.Language */
                }, childAttrs: function () {
                    return selectedTemplate.contents.map(function (content) {
                        var langCode = (0, tutanota_utils_1.downcast)(content.languageCode);
                        return {
                            label: function () { return LanguageViewModel_1.lang.get(LanguageViewModel_1.languageByCode[langCode].textId); },
                            click: function (e) {
                                var _a;
                                e.stopPropagation();
                                _this._templateModel.setSelectedContentLanguage(langCode);
                                (_a = _this._inputDom) === null || _a === void 0 ? void 0 : _a.focus();
                            }
                        };
                    });
                }
            })),
            canEdit
                ? [
                    (0, mithril_1["default"])(IconButton_js_1.IconButton, {
                        title: "editTemplate_action",
                        click: function () {
                            return MainLocator_1.locator.entityClient
                                .load(TypeRefs_js_1.TemplateGroupRootTypeRef, (0, tutanota_utils_1.neverNull)(selectedTemplate._ownerGroup))
                                .then(function (groupRoot) { return _this.showTemplateEditor(selectedTemplate, groupRoot); });
                        },
                        icon: "Edit" /* Icons.Edit */,
                        colors: "drawernav" /* ButtonColor.DrawerNav */
                    }),
                    (0, mithril_1["default"])(IconButton_js_1.IconButton, {
                        title: "remove_action",
                        click: function () {
                            (0, GuiUtils_1.getConfirmation)("deleteTemplate_msg").confirmed(function () { return MainLocator_1.locator.entityClient.erase(selectedTemplate); });
                        },
                        icon: "Trash" /* Icons.Trash */,
                        colors: "drawernav" /* ButtonColor.DrawerNav */
                    }),
                ]
                : null,
            (0, mithril_1["default"])(".pr-s", (0, mithril_1["default"])(".nav-bar-spacer")),
            (0, mithril_1["default"])("", {
                onkeydown: function (e) {
                    var _a;
                    // prevents tabbing into the background of the modal
                    if ((0, KeyManager_1.isKeyPressed)(e.keyCode, TutanotaConstants_1.Keys.TAB)) {
                        (_a = _this._inputDom) === null || _a === void 0 ? void 0 : _a.focus();
                        e.preventDefault();
                    }
                }
            }, (0, mithril_1["default"])(Button_js_1.Button, this._selectTemplateButtonAttrs)),
        ];
    };
    TemplatePopup.prototype._renderList = function () {
        var _this = this;
        return (0, mithril_1["default"])(ScrollSelectList_1.ScrollSelectList, {
            items: this._templateModel.searchResults(),
            selectedItem: this._templateModel.selectedTemplate(),
            onItemSelected: this._templateModel.selectedTemplate,
            emptyListMessage: function () { return (_this._templateModel.isLoaded() ? "nothingFound_label" : "loadingTemplates_label"); },
            width: exports.TEMPLATE_LIST_ENTRY_WIDTH,
            renderItem: function (template) {
                return (0, mithril_1["default"])(TemplatePopupResultRow_1.TemplatePopupResultRow, {
                    template: template
                });
            },
            onItemDoubleClicked: function (_) {
                var selected = _this._templateModel.getSelectedContent();
                if (selected) {
                    _this._onSelect(selected.text);
                    _this._close();
                }
            }
        });
    };
    TemplatePopup.prototype._renderRightColumn = function () {
        var template = this._templateModel.getSelectedTemplate();
        if (template) {
            return [
                (0, mithril_1["default"])(TemplateExpander_1.TemplateExpander, {
                    template: template,
                    model: this._templateModel
                }),
            ];
        }
        else {
            return null;
        }
    };
    TemplatePopup.prototype._isScreenWideEnough = function () {
        return window.innerWidth > exports.TEMPLATE_POPUP_TWO_COLUMN_MIN_WIDTH;
    };
    TemplatePopup.prototype._getWindowWidthChange = function () {
        return window.innerWidth - this._initialWindowWidth;
    };
    TemplatePopup.prototype.show = function () {
        Modal_1.modal.display(this, false);
    };
    TemplatePopup.prototype._close = function () {
        Modal_1.modal.remove(this);
    };
    TemplatePopup.prototype.backgroundClick = function (e) {
        this._onSelect("");
        this._close();
    };
    TemplatePopup.prototype.hideAnimation = function () {
        return Promise.resolve();
    };
    TemplatePopup.prototype.onClose = function () {
        this._redrawStream.end(true);
    };
    TemplatePopup.prototype.shortcuts = function () {
        return this._shortcuts;
    };
    TemplatePopup.prototype.popState = function (e) {
        return true;
    };
    TemplatePopup.prototype.showTemplateEditor = function (templateToEdit, groupRoot) {
        Promise.resolve().then(function () { return require("../../settings/TemplateEditor"); }).then(function (editor) {
            editor.showTemplateEditor(templateToEdit, groupRoot);
        });
    };
    return TemplatePopup;
}());
exports.TemplatePopup = TemplatePopup;
