"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.writeGiftCardMail = exports.writeInviteMail = exports.writeSupportMail = exports.getSupportMailSignature = exports.newMailEditorFromTemplate = exports.newMailtoUrlMailEditor = exports.newMailEditorFromDraft = exports.newMailEditorAsResponse = exports.newMailEditor = exports.MailEditor = exports.createMailEditorAttrs = void 0;
var mithril_1 = require("mithril");
var stream_1 = require("mithril/stream");
var Editor_1 = require("../../gui/editor/Editor");
var SendMailModel_1 = require("./SendMailModel");
var Dialog_1 = require("../../gui/base/Dialog");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var LoginUtils_1 = require("../../misc/LoginUtils");
var MailUtils_1 = require("../model/MailUtils");
var MainLocator_1 = require("../../api/main/MainLocator");
var LoginController_1 = require("../../api/main/LoginController");
var TutanotaConstants_1 = require("../../api/common/TutanotaConstants");
var RestError_1 = require("../../api/common/error/RestError");
var Button_js_1 = require("../../gui/base/Button.js");
var Dropdown_js_1 = require("../../gui/base/Dropdown.js");
var Env_1 = require("../../api/common/Env");
var Animations_1 = require("../../gui/animation/Animations");
var TextField_js_1 = require("../../gui/base/TextField.js");
var MailEditorViewModel_1 = require("./MailEditorViewModel");
var Expander_1 = require("../../gui/base/Expander");
var WindowFacade_1 = require("../../misc/WindowFacade");
var UserError_1 = require("../../api/main/UserError");
var ProgressDialog_1 = require("../../gui/dialogs/ProgressDialog");
var HtmlSanitizer_1 = require("../../misc/HtmlSanitizer");
var DropDownSelector_js_1 = require("../../gui/base/DropDownSelector.js");
var TypeRefs_js_1 = require("../../api/entities/tutanota/TypeRefs.js");
var FileOpenError_1 = require("../../api/common/error/FileOpenError");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Utils_1 = require("../../api/common/utils/Utils");
var MailGuiUtils_1 = require("../view/MailGuiUtils");
var ClientDetector_1 = require("../../misc/ClientDetector");
var Signature_1 = require("../signature/Signature");
var TemplatePopup_1 = require("../../templates/view/TemplatePopup");
var TemplateShortcutListener_1 = require("../../templates/view/TemplateShortcutListener");
var TemplatePopupModel_1 = require("../../templates/model/TemplatePopupModel");
var KnowledgeBaseDialog_1 = require("../../knowledgebase/view/KnowledgeBaseDialog");
var KnowledgeBaseModel_1 = require("../../knowledgebase/model/KnowledgeBaseModel");
var styles_1 = require("../../gui/styles");
var MinimizedMailEditorOverlay_1 = require("../view/MinimizedMailEditorOverlay");
var FileUtils_1 = require("../../api/common/utils/FileUtils");
var MailAddressParser_1 = require("../../misc/parsing/MailAddressParser");
var CancelledError_1 = require("../../api/common/error/CancelledError");
var CompletenessIndicator_js_1 = require("../../gui/CompletenessIndicator.js");
var ErrorHandlerImpl_1 = require("../../misc/ErrorHandlerImpl");
var MailRecipientsTextField_js_1 = require("../../gui/MailRecipientsTextField.js");
var ContactUtils_1 = require("../../contacts/model/ContactUtils");
var ErrorCheckUtils_js_1 = require("../../api/common/utils/ErrorCheckUtils.js");
var RecipientsSearchModel_js_1 = require("../../misc/RecipientsSearchModel.js");
var RichTextToolbar_js_1 = require("../../gui/base/RichTextToolbar.js");
var FileController_1 = require("../../file/FileController");
var IconButton_js_1 = require("../../gui/base/IconButton.js");
var ToggleButton_js_1 = require("../../gui/base/ToggleButton.js");
function createMailEditorAttrs(model, doBlockExternalContent, doFocusEditorOnLoad, dialog, templateModel, knowledgeBaseInjection, search) {
    return {
        model: model,
        doBlockExternalContent: (0, stream_1["default"])(doBlockExternalContent),
        doShowToolbar: (0, stream_1["default"])(false),
        selectedNotificationLanguage: (0, stream_1["default"])(""),
        dialog: dialog,
        templateModel: templateModel,
        knowledgeBaseInjection: knowledgeBaseInjection,
        search: search
    };
}
exports.createMailEditorAttrs = createMailEditorAttrs;
var MailEditor = /** @class */ (function () {
    function MailEditor(vnode) {
        var _this = this;
        this.recipientFieldTexts = {
            to: (0, stream_1["default"])(""),
            cc: (0, stream_1["default"])(""),
            bcc: (0, stream_1["default"])("")
        };
        this.knowledgeBaseInjection = null;
        this.recipientShowConfidential = new Map();
        var a = vnode.attrs;
        this.attrs = a;
        this.inlineImageElements = [];
        this.mentionedInlineImages = [];
        var model = a.model;
        this.sendMailModel = model;
        this.templateModel = a.templateModel;
        // if we have any CC/BCC recipients, we should show these so, should the user send the mail, they know where it will be going to
        this.areDetailsExpanded = (model.bccRecipients().length + model.ccRecipients().length) > 0;
        this.editor = new Editor_1.Editor(200, function (html, isPaste) {
            var sanitized = HtmlSanitizer_1.htmlSanitizer.sanitizeFragment(html, {
                blockExternalContent: !isPaste && a.doBlockExternalContent()
            });
            _this.mentionedInlineImages = sanitized.inlineImageCids;
            return sanitized.fragment;
        });
        var onEditorChanged = function () {
            (0, MailEditorViewModel_1.cleanupInlineAttachments)(_this.editor.getDOM(), _this.inlineImageElements, model.getAttachments());
            model.markAsChangedIfNecessary(true);
            mithril_1["default"].redraw();
        };
        // call this async because the editor is not initialized before this mail editor dialog is shown
        this.editor.initialized.promise.then(function () {
            _this.editor.setHTML(model.getBody());
            // Add mutation observer to remove attachments when corresponding DOM element is removed
            new MutationObserver(onEditorChanged).observe(_this.editor.getDOM(), {
                attributes: false,
                childList: true,
                subtree: true
            });
            // since the editor is the source for the body text, the model won't know if the body has changed unless we tell it
            _this.editor.addChangeListener(function () { return model.setBody((0, MailGuiUtils_1.replaceInlineImagesWithCids)(_this.editor.getDOM()).innerHTML); });
            if (a.templateModel) {
                a.templateModel.init().then(function (templateModel) {
                    // add this event listener to handle quick selection of templates inside the editor
                    (0, TemplateShortcutListener_1.registerTemplateShortcutListener)(_this.editor, templateModel);
                });
            }
        });
        this.editor.initialized.promise.then(function () {
            var dom = _this.editor.getDOM();
            _this.inlineImageElements = (0, MailGuiUtils_1.replaceCidsWithInlineImages)(dom, model.loadedInlineImages, function (cid, event, dom) {
                var downloadClickHandler = (0, Dropdown_js_1.createDropdown)({
                    lazyButtons: function () { return [
                        {
                            label: "download_action",
                            click: function () { return _this.downloadInlineImage(model, cid); }
                        },
                    ]; }
                });
                downloadClickHandler((0, tutanota_utils_1.downcast)(event), dom);
            });
        });
        model.onMailChanged.map(function (didChange) {
            if (didChange)
                mithril_1["default"].redraw();
        });
        // Leftover text in recipient field is an error
        model.setOnBeforeSendFunction(function () {
            var invalidText = "";
            for (var _i = 0, _a = (0, tutanota_utils_1.typedValues)(_this.recipientFieldTexts); _i < _a.length; _i++) {
                var leftoverText = _a[_i];
                if (leftoverText().trim() !== "") {
                    invalidText += "\n" + leftoverText().trim();
                }
            }
            if (invalidText !== "") {
                throw new UserError_1.UserError(function () { return LanguageViewModel_1.lang.get("invalidRecipients_msg") + invalidText; });
            }
        });
        var dialog = a.dialog();
        if (model.getConversationType() === "1" /* ConversationType.REPLY */ || model.toRecipients().length) {
            dialog.setFocusOnLoadFunction(function () {
                _this.editor.initialized.promise.then(function () { return _this.editor.focus(); });
            });
        }
        var shortcuts = [
            {
                key: TutanotaConstants_1.Keys.SPACE,
                ctrl: true,
                exec: function () { return _this.openTemplates(); },
                help: "openTemplatePopup_msg"
            },
            {
                key: TutanotaConstants_1.Keys.B,
                ctrl: true,
                exec: tutanota_utils_1.noOp,
                help: "formatTextBold_msg"
            },
            {
                key: TutanotaConstants_1.Keys.I,
                ctrl: true,
                exec: tutanota_utils_1.noOp,
                help: "formatTextItalic_msg"
            },
            {
                key: TutanotaConstants_1.Keys.U,
                ctrl: true,
                exec: tutanota_utils_1.noOp,
                help: "formatTextUnderline_msg"
            },
        ];
        shortcuts.forEach(dialog.addShortcut.bind(dialog));
        this.editor.initialized.promise.then(function () {
            a.knowledgeBaseInjection(_this.editor).then(function (injection) {
                _this.knowledgeBaseInjection = injection;
                mithril_1["default"].redraw();
            });
        });
    }
    MailEditor.prototype.downloadInlineImage = function (model, cid) {
        var inlineAttachment = model.getAttachments().find(function (attachment) { return attachment.cid === cid; });
        if (inlineAttachment && (0, FileUtils_1.isTutanotaFile)(inlineAttachment)) {
            MainLocator_1.locator.fileController
                .open(inlineAttachment)["catch"]((0, tutanota_utils_1.ofClass)(FileOpenError_1.FileOpenError, function () { return Dialog_1.Dialog.message("canNotOpenFileOnDevice_msg"); }));
        }
    };
    MailEditor.prototype.view = function (vnode) {
        var _this = this;
        var a = vnode.attrs;
        this.attrs = a;
        var model = a.model;
        this.sendMailModel = model;
        var showConfidentialButton = model.containsExternalRecipients();
        var isConfidential = model.isConfidential() && showConfidentialButton;
        var confidentialButtonAttrs = {
            title: model.isConfidential() ? "confidential_action" : "nonConfidential_action",
            onToggled: function (_, e) {
                e.stopPropagation();
                model.setConfidential(!model.isConfidential());
            },
            icon: (model.isConfidential() ? "Lock" /* Icons.Lock */ : "Unlock" /* Icons.Unlock */),
            toggled: model.isConfidential(),
            size: 1 /* ButtonSize.Compact */
        };
        var attachFilesButtonAttrs = {
            title: "attachFiles_action",
            click: function (ev, dom) { return (0, MailEditorViewModel_1.chooseAndAttachFile)(model, dom.getBoundingClientRect()).then(function () { return mithril_1["default"].redraw(); }); },
            icon: "Attachment" /* Icons.Attachment */,
            size: 1 /* ButtonSize.Compact */
        };
        var plaintextFormatting = LoginController_1.logins.getUserController().props.sendPlaintextOnly;
        this.editor.setCreatesLists(!plaintextFormatting);
        var toolbarButton = function () {
            return !plaintextFormatting
                ? (0, mithril_1["default"])(ToggleButton_js_1.ToggleButton, {
                    title: "showRichTextToolbar_action",
                    icon: "FontSize" /* Icons.FontSize */,
                    size: 1 /* ButtonSize.Compact */,
                    toggled: a.doShowToolbar(),
                    onToggled: function (_, e) {
                        a.doShowToolbar(!a.doShowToolbar());
                        // Stop the subject bar from being focused
                        e.stopPropagation();
                        _this.editor.focus();
                    }
                })
                : null;
        };
        var subjectFieldAttrs = {
            label: "subject_label",
            helpLabel: function () { return (0, MailEditorViewModel_1.getConfidentialStateMessage)(model.isConfidential()); },
            value: model.getSubject(),
            oninput: function (val) { return model.setSubject(val); },
            injectionsRight: function () { return (0, mithril_1["default"])(".flex.end.ml-between-s.items-center", [
                showConfidentialButton ? (0, mithril_1["default"])(ToggleButton_js_1.ToggleButton, confidentialButtonAttrs) : null,
                _this.knowledgeBaseInjection ? _this.renderToggleKnowledgeBase(_this.knowledgeBaseInjection) : null,
                (0, mithril_1["default"])(IconButton_js_1.IconButton, attachFilesButtonAttrs),
                toolbarButton(),
            ]); }
        };
        var attachmentButtonAttrs = (0, MailEditorViewModel_1.createAttachmentButtonAttrs)(model, this.inlineImageElements);
        var editCustomNotificationMailAttrs = null;
        if (LoginController_1.logins.getUserController().isGlobalAdmin()) {
            editCustomNotificationMailAttrs = (0, Dropdown_js_1.attachDropdown)({
                mainButtonAttrs: {
                    title: "more_label",
                    icon: "More" /* Icons.More */,
                    size: 1 /* ButtonSize.Compact */
                }, childAttrs: function () { return [
                    {
                        label: "add_action",
                        click: function () {
                            Promise.resolve().then(function () { return require("../../settings/EditNotificationEmailDialog"); }).then(function (_a) {
                                var showAddOrEditNotificationEmailDialog = _a.showAddOrEditNotificationEmailDialog;
                                return showAddOrEditNotificationEmailDialog(LoginController_1.logins.getUserController());
                            });
                        }
                    },
                    {
                        label: "edit_action",
                        click: function () {
                            Promise.resolve().then(function () { return require("../../settings/EditNotificationEmailDialog"); }).then(function (_a) {
                                var showAddOrEditNotificationEmailDialog = _a.showAddOrEditNotificationEmailDialog;
                                return showAddOrEditNotificationEmailDialog(LoginController_1.logins.getUserController(), model.getSelectedNotificationLanguageCode());
                            });
                        }
                    },
                ]; }
            });
        }
        return (0, mithril_1["default"])("#mail-editor.full-height.text.touch-callout.flex.flex-column", {
            onclick: function (e) {
                if (e.target === _this.editor.getDOM()) {
                    _this.editor.focus();
                }
            },
            ondragover: function (ev) {
                // do not check the data transfer here because it is not always filled, e.g. in Safari
                ev.stopPropagation();
                ev.preventDefault();
            },
            ondrop: function (ev) {
                var _a;
                if (((_a = ev.dataTransfer) === null || _a === void 0 ? void 0 : _a.files) && ev.dataTransfer.files.length > 0) {
                    (0, FileController_1.readLocalFiles)(ev.dataTransfer.files)
                        .then(function (dataFiles) {
                        model.attachFiles(dataFiles);
                        mithril_1["default"].redraw();
                    })["catch"](function (e) {
                        console.log(e);
                        return Dialog_1.Dialog.message("couldNotAttachFile_msg");
                    });
                    ev.stopPropagation();
                    ev.preventDefault();
                }
            }
        }, [
            (0, mithril_1["default"])(".rel", this.renderRecipientField(MailUtils_1.RecipientField.TO, this.recipientFieldTexts.to, a.search)),
            (0, mithril_1["default"])(".rel", (0, mithril_1["default"])(Expander_1.ExpanderPanel, {
                expanded: this.areDetailsExpanded
            }, (0, mithril_1["default"])(".details", [
                this.renderRecipientField(MailUtils_1.RecipientField.CC, this.recipientFieldTexts.cc, a.search),
                this.renderRecipientField(MailUtils_1.RecipientField.BCC, this.recipientFieldTexts.bcc, a.search)
            ]))),
            (0, mithril_1["default"])(".wrapping-row", [
                (0, mithril_1["default"])("", {
                    style: {
                        "min-width": "250px"
                    }
                }, (0, mithril_1["default"])(DropDownSelector_js_1.DropDownSelector, {
                    label: "sender_label",
                    items: (0, MailUtils_1.getEnabledMailAddressesWithUser)(model.mailboxDetails, model.user().userGroupInfo)
                        .sort()
                        .map(function (mailAddress) { return ({
                        name: mailAddress,
                        value: mailAddress
                    }); }),
                    selectedValue: a.model.getSender(),
                    selectionChangedHandler: function (selection) { return model.setSender(selection); },
                    dropdownWidth: 250
                })),
                isConfidential
                    ? (0, mithril_1["default"])(".flex", {
                        style: {
                            "min-width": "250px"
                        },
                        oncreate: function (vnode) {
                            var htmlDom = vnode.dom;
                            htmlDom.style.opacity = "0";
                            return Animations_1.animations.add(htmlDom, (0, Animations_1.opacity)(0, 1, true));
                        },
                        onbeforeremove: function (vnode) {
                            var htmlDom = vnode.dom;
                            htmlDom.style.opacity = "1";
                            return Animations_1.animations.add(htmlDom, (0, Animations_1.opacity)(1, 0, true));
                        }
                    }, [
                        (0, mithril_1["default"])(".flex-grow", (0, mithril_1["default"])(DropDownSelector_js_1.DropDownSelector, {
                            label: "notificationMailLanguage_label",
                            items: model.getAvailableNotificationTemplateLanguages().map(function (language) {
                                return {
                                    name: LanguageViewModel_1.lang.get(language.textId),
                                    value: language.code
                                };
                            }),
                            selectedValue: model.getSelectedNotificationLanguageCode(),
                            selectionChangedHandler: function (v) { return model.setSelectedNotificationLanguageCode(v); },
                            dropdownWidth: 250
                        })),
                        editCustomNotificationMailAttrs
                            ? (0, mithril_1["default"])(".pt.flex-no-grow.flex-end.border-bottom.flex.items-center", (0, mithril_1["default"])(IconButton_js_1.IconButton, editCustomNotificationMailAttrs))
                            : null,
                    ])
                    : null,
            ]),
            isConfidential
                ? this.renderPasswordFields()
                : null,
            (0, mithril_1["default"])(".row", (0, mithril_1["default"])(TextField_js_1.TextField, subjectFieldAttrs)),
            (0, mithril_1["default"])(".flex-start.flex-wrap.column-gap", attachmentButtonAttrs.map(function (a) { return (0, mithril_1["default"])(Button_js_1.Button, a); })),
            model.getAttachments().length > 0 ? (0, mithril_1["default"])("hr.hr") : null,
            a.doShowToolbar() ? this.renderToolbar(model) : null,
            (0, mithril_1["default"])(".pt-s.text.scroll-x.break-word-links.flex.flex-column.flex-grow", {
                onclick: function () { return _this.editor.focus(); }
            }, (0, mithril_1["default"])(this.editor)),
            (0, mithril_1["default"])(".pb"),
        ]);
    };
    MailEditor.prototype.renderToggleKnowledgeBase = function (knowledgeBaseInjection) {
        var _this = this;
        return (0, mithril_1["default"])(ToggleButton_js_1.ToggleButton, {
            title: "openKnowledgebase_action",
            toggled: knowledgeBaseInjection.visible(),
            onToggled: function () {
                if (knowledgeBaseInjection.visible()) {
                    knowledgeBaseInjection.visible(false);
                }
                else {
                    knowledgeBaseInjection.componentAttrs.model.sortEntriesByMatchingKeywords(_this.editor.getValue());
                    knowledgeBaseInjection.visible(true);
                    knowledgeBaseInjection.componentAttrs.model.init();
                }
            },
            icon: "Book" /* Icons.Book */,
            size: 1 /* ButtonSize.Compact */
        });
    };
    MailEditor.prototype.renderToolbar = function (model) {
        var _this = this;
        // Toolbar is not removed from DOM directly, only it's parent (array) is so we have to animate it manually.
        // m.fragment() gives us a vnode without actual DOM element so that we can run callback on removal
        return mithril_1["default"].fragment({
            onbeforeremove: function (_a) {
                var dom = _a.dom;
                return (0, RichTextToolbar_js_1.animateToolbar)(dom.children[0], false);
            }
        }, [
            (0, mithril_1["default"])(RichTextToolbar_js_1.RichTextToolbar, {
                editor: this.editor,
                imageButtonClickHandler: (0, Env_1.isApp)()
                    ? null
                    : function (event) {
                        return (0, MailEditorViewModel_1.chooseAndAttachFile)(model, event.target.getBoundingClientRect(), TutanotaConstants_1.ALLOWED_IMAGE_FORMATS).then(function (files) {
                            files &&
                                files.forEach(function (file) {
                                    // Let's assume it's DataFile for now... Editor bar is available for apps but image button is not
                                    if ((0, FileUtils_1.isDataFile)(file)) {
                                        var img = (0, MailGuiUtils_1.createInlineImage)(file);
                                        model.loadedInlineImages.set(img.cid, img);
                                        _this.inlineImageElements.push(_this.editor.insertImage(img.objectUrl, {
                                            cid: img.cid,
                                            style: "max-width: 100%"
                                        }));
                                    }
                                });
                            mithril_1["default"].redraw();
                        });
                    },
                customButtonAttrs: this.templateModel
                    ? [
                        {
                            title: "openTemplatePopup_msg",
                            click: function () {
                                _this.openTemplates();
                            },
                            icon: "ListAlt" /* Icons.ListAlt */,
                            size: 1 /* ButtonSize.Compact */
                        },
                    ]
                    : []
            }),
            (0, mithril_1["default"])("hr.hr")
        ]);
    };
    MailEditor.prototype.renderPasswordFields = function () {
        var _this = this;
        return (0, mithril_1["default"])(".external-recipients.overflow-hidden", {
            oncreate: function (vnode) { return _this.animateHeight(vnode.dom, true); },
            onbeforeremove: function (vnode) { return _this.animateHeight(vnode.dom, false); }
        }, this.sendMailModel
            .allRecipients()
            .filter(function (r) { return r.type === "external" /* RecipientType.EXTERNAL */; })
            .map(function (recipient) {
            if (!(_this.recipientShowConfidential.has(recipient.address)))
                _this.recipientShowConfidential.set(recipient.address, false);
            return (0, mithril_1["default"])(TextField_js_1.TextField, {
                oncreate: function (vnode) { return _this.animateHeight(vnode.dom, true); },
                onbeforeremove: function (vnode) { return _this.animateHeight(vnode.dom, false); },
                label: function () { return LanguageViewModel_1.lang.get("passwordFor_label", { "{1}": recipient.address }); },
                helpLabel: function () { return (0, mithril_1["default"])(".mt-xs.flex.items-center", [
                    (0, mithril_1["default"])(CompletenessIndicator_js_1.CompletenessIndicator, { percentageCompleted: _this.sendMailModel.getPasswordStrength(recipient) }),
                    // hack! We want to reserve enough space from the text field to be like "real" password field but we don't have any text and
                    // CSS unit "lh" is not supported. We could query it programmatically but instead we insert one text node (this is nbsp character)
                    // which will take line-height and size the line properly.
                    (0, mithril_1["default"])("", String.fromCharCode(160))
                ]); },
                value: _this.sendMailModel.getPassword(recipient.address),
                preventAutofill: true,
                type: _this.isConfidentialPasswordRevealed(recipient.address) ? "text" /* TextFieldType.Text */ : "password" /* TextFieldType.Password */,
                oninput: function (val) { return _this.sendMailModel.setPassword(recipient.address, val); },
                injectionsRight: function () { return _this.renderRevealIcon(recipient.address); }
            });
        }));
    };
    MailEditor.prototype.renderRecipientField = function (field, fieldText, search) {
        var _this = this;
        var label = {
            to: "to_label",
            cc: "cc_label",
            bcc: "bcc_label"
        }[field];
        return (0, mithril_1["default"])(MailRecipientsTextField_js_1.MailRecipientsTextField, {
            label: label,
            text: fieldText(),
            onTextChanged: function (text) { return fieldText(text); },
            recipients: this.sendMailModel.getRecipientList(field),
            onRecipientAdded: function (address, name) { return __awaiter(_this, void 0, void 0, function () {
                var e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 7]);
                            return [4 /*yield*/, this.sendMailModel.addRecipient(field, { address: address, name: name })];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 7];
                        case 2:
                            e_1 = _a.sent();
                            if (!(0, ErrorCheckUtils_js_1.isOfflineError)(e_1)) return [3 /*break*/, 3];
                            return [3 /*break*/, 6];
                        case 3:
                            if (!(e_1 instanceof RestError_1.TooManyRequestsError)) return [3 /*break*/, 5];
                            return [4 /*yield*/, Dialog_1.Dialog.message("tooManyAttempts_msg")];
                        case 4:
                            _a.sent();
                            return [3 /*break*/, 6];
                        case 5: throw e_1;
                        case 6: return [3 /*break*/, 7];
                        case 7: return [2 /*return*/];
                    }
                });
            }); },
            onRecipientRemoved: function (address) { return _this.sendMailModel.removeRecipientByAddress(address, field); },
            getRecipientClickedDropdownAttrs: function (address) {
                var recipient = _this.sendMailModel.getRecipient(field, address);
                return _this.getRecipientClickedContextButtons(recipient, field);
            },
            disabled: !this.sendMailModel.logins.isInternalUserLoggedIn(),
            injectionsRight: field === MailUtils_1.RecipientField.TO && this.sendMailModel.logins.isInternalUserLoggedIn()
                ? (0, mithril_1["default"])("", (0, mithril_1["default"])(ToggleButton_js_1.ToggleButton, {
                    title: "show_action",
                    icon: "Expand" /* BootIcons.Expand */,
                    size: 1 /* ButtonSize.Compact */,
                    toggled: this.areDetailsExpanded,
                    onToggled: function (_, e) {
                        e.stopPropagation();
                        _this.areDetailsExpanded = !_this.areDetailsExpanded;
                    }
                })) : null,
            search: search
        });
    };
    MailEditor.prototype.renderRevealIcon = function (address) {
        var _this = this;
        return (0, mithril_1["default"])(ToggleButton_js_1.ToggleButton, {
            title: this.isConfidentialPasswordRevealed(address) ? "concealPassword_action" : "revealPassword_action",
            toggled: this.isConfidentialPasswordRevealed(address),
            onToggled: function (_, e) {
                _this.toggleRevealConfidentialPassword(address);
                e.stopPropagation();
            },
            icon: this.isConfidentialPasswordRevealed(address) ? "NoEye" /* Icons.NoEye */ : "Eye" /* Icons.Eye */,
            size: 1 /* ButtonSize.Compact */
        });
    };
    MailEditor.prototype.getRecipientClickedContextButtons = function (recipient, field) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, logins, entity, contactModel, canEditBubbleRecipient, previousMail, canRemoveBubble, createdContactReceiver, contextButtons;
            var _this = this;
            return __generator(this, function (_b) {
                _a = this.sendMailModel, logins = _a.logins, entity = _a.entity, contactModel = _a.contactModel;
                canEditBubbleRecipient = logins.getUserController().isInternalUser()
                    && !logins.isEnabled(TutanotaConstants_1.FeatureType.DisableContacts);
                previousMail = this.sendMailModel.getPreviousMail();
                canRemoveBubble = logins.getUserController().isInternalUser()
                    && (!previousMail
                        || !previousMail.restrictions
                        || previousMail.restrictions.participantGroupInfos.length === 0);
                createdContactReceiver = function (contactElementId) {
                    var mailAddress = recipient.address;
                    contactModel.contactListId().then(function (contactListId) {
                        if (!contactListId)
                            return;
                        var id = [contactListId, contactElementId];
                        entity
                            .load(TypeRefs_js_1.ContactTypeRef, id)
                            .then(function (contact) {
                            if (contact.mailAddresses.find(function (ma) { return (0, tutanota_utils_1.cleanMatch)(ma.address, mailAddress); })) {
                                recipient.setName((0, ContactUtils_1.getContactDisplayName)(contact));
                                recipient.setContact(contact);
                            }
                            else {
                                _this.sendMailModel.removeRecipient(recipient, field, false);
                            }
                        });
                    });
                };
                contextButtons = [];
                if (canEditBubbleRecipient) {
                    if (recipient.contact && recipient.contact._id) {
                        contextButtons.push({
                            label: function () { return LanguageViewModel_1.lang.get("editContact_label"); },
                            click: function () {
                                Promise.resolve().then(function () { return require("../../contacts/ContactEditor"); }).then(function (_a) {
                                    var ContactEditor = _a.ContactEditor;
                                    return new ContactEditor(entity, recipient.contact).show();
                                });
                            }
                        });
                    }
                    else {
                        contextButtons.push({
                            label: function () { return LanguageViewModel_1.lang.get("createContact_action"); },
                            click: function () {
                                // contact list
                                contactModel.contactListId().then(function (contactListId) {
                                    var newContact = (0, MailUtils_1.createNewContact)(logins.getUserController().user, recipient.address, recipient.name);
                                    Promise.resolve().then(function () { return require("../../contacts/ContactEditor"); }).then(function (_a) {
                                        var ContactEditor = _a.ContactEditor;
                                        new ContactEditor(entity, newContact, contactListId !== null && contactListId !== void 0 ? contactListId : undefined, createdContactReceiver).show();
                                    });
                                });
                            }
                        });
                    }
                }
                if (canRemoveBubble) {
                    contextButtons.push({
                        label: "remove_action",
                        click: function () { return _this.sendMailModel.removeRecipient(recipient, field, false); }
                    });
                }
                return [2 /*return*/, contextButtons];
            });
        });
    };
    MailEditor.prototype.openTemplates = function () {
        var _this = this;
        if (this.templateModel) {
            this.templateModel.init().then(function (templateModel) {
                (0, TemplatePopup_1.showTemplatePopupInEditor)(templateModel, _this.editor, null, _this.editor.getSelectedText());
            });
        }
    };
    MailEditor.prototype.animateHeight = function (domElement, fadein) {
        var childHeight = domElement.offsetHeight;
        return Animations_1.animations.add(domElement, fadein ? (0, Animations_1.height)(0, childHeight) : (0, Animations_1.height)(childHeight, 0)).then(function () {
            domElement.style.height = "";
        });
    };
    MailEditor.prototype.isConfidentialPasswordRevealed = function (address) {
        var _a;
        return (_a = this.recipientShowConfidential.get(address)) !== null && _a !== void 0 ? _a : false;
    };
    MailEditor.prototype.toggleRevealConfidentialPassword = function (address) {
        this.recipientShowConfidential.set(address, !this.recipientShowConfidential.get(address));
    };
    return MailEditor;
}());
exports.MailEditor = MailEditor;
/**
 * Creates a new Dialog with a MailEditor inside.
 * @param model
 * @param blockExternalContent
 * @returns {Dialog}
 * @private
 */
function createMailEditorDialog(model, blockExternalContent) {
    if (blockExternalContent === void 0) { blockExternalContent = false; }
    return __awaiter(this, void 0, void 0, function () {
        var dialog, mailEditorAttrs, save, send, dispose, minimize, windowCloseUnsubscribe, headerBarAttrs, templatePopupModel, createKnowledgebaseButtonAttrs, _a, _b, shortcuts, _i, shortcuts_1, shortcut;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    save = function (showProgress) {
                        if (showProgress === void 0) { showProgress = true; }
                        var savePromise = model.saveDraft(true, "0" /* MailMethod.NONE */);
                        if (showProgress) {
                            return (0, ProgressDialog_1.showProgressDialog)("save_msg", savePromise);
                        }
                        else {
                            return savePromise;
                        }
                    };
                    send = function () { return __awaiter(_this, void 0, void 0, function () {
                        var success, e_2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, model.send("0" /* MailMethod.NONE */, Dialog_1.Dialog.confirm, ProgressDialog_1.showProgressDialog)];
                                case 1:
                                    success = _a.sent();
                                    if (success) {
                                        dispose();
                                        dialog.close();
                                    }
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_2 = _a.sent();
                                    if (e_2 instanceof UserError_1.UserError) {
                                        (0, ErrorHandlerImpl_1.showUserError)(e_2);
                                    }
                                    else {
                                        throw e_2;
                                    }
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); };
                    dispose = function () {
                        model.dispose();
                        if (templatePopupModel)
                            templatePopupModel.dispose();
                    };
                    minimize = function () {
                        // If the mail is unchanged, close instead of saving
                        if (!model.hasMailChanged()) {
                            dispose();
                            dialog.close();
                            return;
                        }
                        var saveStatus = (0, stream_1["default"])({ status: 0 /* SaveStatusEnum.Saving */ });
                        save(false)
                            .then(function () { return saveStatus({ status: 1 /* SaveStatusEnum.Saved */ }); })["catch"](function (e) {
                            var reason = (0, ErrorCheckUtils_js_1.isOfflineError)(e)
                                ? 1 /* SaveErrorReason.ConnectionLost */
                                : 0 /* SaveErrorReason.Unknown */;
                            saveStatus({ status: 2 /* SaveStatusEnum.NotSaved */, reason: reason });
                            // If we don't show the error in the minimized error dialog,
                            // Then we need to communicate it in a dialog or as an unhandled error
                            if (reason === 0 /* SaveErrorReason.Unknown */) {
                                if (e instanceof UserError_1.UserError) {
                                    (0, ErrorHandlerImpl_1.showUserError)(e);
                                }
                                else {
                                    throw e;
                                }
                            }
                        })["finally"](function () { return mithril_1["default"].redraw(); });
                        (0, MinimizedMailEditorOverlay_1.showMinimizedMailEditor)(dialog, model, MainLocator_1.locator.minimizedMailModel, MainLocator_1.locator.eventController, dispose, saveStatus);
                    };
                    windowCloseUnsubscribe = function () {
                    };
                    headerBarAttrs = {
                        left: [{
                                label: "close_alt",
                                click: function () { return minimize(); },
                                type: "secondary" /* ButtonType.Secondary */
                            }],
                        right: [
                            {
                                label: "send_action",
                                click: function () {
                                    send();
                                },
                                type: "primary" /* ButtonType.Primary */
                            },
                        ],
                        middle: function () { return (0, MailUtils_1.conversationTypeString)(model.getConversationType()); },
                        create: function () {
                            if ((0, Env_1.isBrowser)()) {
                                // Have a simple listener on browser, so their browser will make the user ask if they are sure they want to close when closing the tab/window
                                windowCloseUnsubscribe = WindowFacade_1.windowFacade.addWindowCloseListener(function () {
                                });
                            }
                            else if ((0, Env_1.isDesktop)()) {
                                // Simulate clicking the Close button when on the desktop so they can see they can save a draft rather than completely closing it
                                windowCloseUnsubscribe = WindowFacade_1.windowFacade.addWindowCloseListener(function () {
                                    minimize();
                                });
                            }
                        },
                        remove: function () {
                            windowCloseUnsubscribe();
                        }
                    };
                    templatePopupModel = LoginController_1.logins.isInternalUserLoggedIn() && ClientDetector_1.client.isDesktopDevice() ? new TemplatePopupModel_1.TemplatePopupModel(MainLocator_1.locator.eventController, LoginController_1.logins, MainLocator_1.locator.entityClient) : null;
                    createKnowledgebaseButtonAttrs = function (editor) {
                        return LoginController_1.logins.isInternalUserLoggedIn()
                            ? LoginController_1.logins
                                .getUserController()
                                .loadCustomer()
                                .then(function (customer) {
                                // only create knowledgebase button for internal users with valid template group and enabled KnowledgebaseFeature
                                if (styles_1.styles.isDesktopLayout() &&
                                    templatePopupModel &&
                                    LoginController_1.logins.getUserController().getTemplateMemberships().length > 0 &&
                                    (0, Utils_1.isCustomizationEnabledForCustomer)(customer, TutanotaConstants_1.FeatureType.KnowledgeBase)) {
                                    return new KnowledgeBaseModel_1.KnowledgeBaseModel(MainLocator_1.locator.eventController, MainLocator_1.locator.entityClient, LoginController_1.logins.getUserController())
                                        .init()
                                        .then(function (knowledgebaseModel) {
                                        var knowledgebaseInjection = (0, KnowledgeBaseDialog_1.createKnowledgeBaseDialogInjection)(knowledgebaseModel, templatePopupModel, editor);
                                        dialog.setInjectionRight(knowledgebaseInjection);
                                        return knowledgebaseInjection;
                                    });
                                }
                                else {
                                    return null;
                                }
                            })
                            : Promise.resolve(null);
                    };
                    _a = createMailEditorAttrs;
                    _b = [model,
                        blockExternalContent,
                        model.toRecipients().length !== 0,
                        function () { return dialog; },
                        templatePopupModel,
                        createKnowledgebaseButtonAttrs];
                    return [4 /*yield*/, (0, RecipientsSearchModel_js_1.getRecipientsSearchModel)()];
                case 1:
                    mailEditorAttrs = _a.apply(void 0, _b.concat([_c.sent()]));
                    shortcuts = [
                        {
                            key: TutanotaConstants_1.Keys.ESC,
                            exec: function () {
                                minimize();
                            },
                            help: "close_alt"
                        },
                        {
                            key: TutanotaConstants_1.Keys.S,
                            ctrl: true,
                            exec: function () {
                                save()["catch"]((0, tutanota_utils_1.ofClass)(UserError_1.UserError, ErrorHandlerImpl_1.showUserError));
                            },
                            help: "save_action"
                        },
                        {
                            key: TutanotaConstants_1.Keys.S,
                            ctrl: true,
                            shift: true,
                            exec: function () {
                                send();
                            },
                            help: "send_action"
                        },
                        {
                            key: TutanotaConstants_1.Keys.RETURN,
                            ctrl: true,
                            exec: function () {
                                send();
                            },
                            help: "send_action"
                        },
                    ];
                    dialog = Dialog_1.Dialog.largeDialogN(headerBarAttrs, MailEditor, mailEditorAttrs);
                    dialog.setCloseHandler(function () { return minimize(); });
                    for (_i = 0, shortcuts_1 = shortcuts; _i < shortcuts_1.length; _i++) {
                        shortcut = shortcuts_1[_i];
                        dialog.addShortcut(shortcut);
                    }
                    return [2 /*return*/, dialog];
            }
        });
    });
}
/**
 * open a MailEditor
 * @param mailboxDetails details to use when sending an email
 * @returns {*}
 * @private
 * @throws PermissionError
 */
function newMailEditor(mailboxDetails) {
    // We check approval status so as to get a dialog informing the user that they cannot send mails
    // but we still want to open the mail editor because they should still be able to contact sales@tutao.de
    return (0, LoginUtils_1.checkApprovalStatus)(LoginController_1.logins, false).then(function (_) {
        return Promise.resolve().then(function () { return require("../signature/Signature"); }).then(function (_a) {
            var appendEmailSignature = _a.appendEmailSignature;
            return appendEmailSignature("", LoginController_1.logins.getUserController().props);
        })
            .then(function (signature) { return newMailEditorFromTemplate(mailboxDetails, {}, "", signature); });
    });
}
exports.newMailEditor = newMailEditor;
function newMailEditorAsResponse(args, blockExternalContent, inlineImages, mailboxDetails) {
    return _mailboxPromise(mailboxDetails)
        .then(SendMailModel_1.defaultSendMailModel)
        .then(function (model) { return model.initAsResponse(args, inlineImages); })
        .then(function (model) { return createMailEditorDialog(model, blockExternalContent); });
}
exports.newMailEditorAsResponse = newMailEditorAsResponse;
function newMailEditorFromDraft(draft, attachments, bodyText, blockExternalContent, inlineImages, mailboxDetails) {
    return _mailboxPromise(mailboxDetails)
        .then(SendMailModel_1.defaultSendMailModel)
        .then(function (model) { return model.initWithDraft(draft, attachments, bodyText, inlineImages); })
        .then(function (model) { return createMailEditorDialog(model, blockExternalContent); });
}
exports.newMailEditorFromDraft = newMailEditorFromDraft;
function newMailtoUrlMailEditor(mailtoUrl, confidential, mailboxDetails) {
    return __awaiter(this, void 0, void 0, function () {
        var mailbox, mailTo, dataFiles, attach_1, files, keepAttachments, _a, sizeCheckResult_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, _mailboxPromise(mailboxDetails)];
                case 1:
                    mailbox = _b.sent();
                    mailTo = (0, MailAddressParser_1.parseMailtoUrl)(mailtoUrl);
                    dataFiles = [];
                    if (!mailTo.attach) return [3 /*break*/, 9];
                    attach_1 = mailTo.attach;
                    if (!(0, Env_1.isDesktop)()) return [3 /*break*/, 3];
                    return [4 /*yield*/, Promise.all(attach_1.map(function (uri) { return MainLocator_1.locator.fileApp.readDataFile(uri); }))];
                case 2:
                    files = _b.sent();
                    dataFiles = files.filter(tutanota_utils_1.isNotNull);
                    _b.label = 3;
                case 3:
                    _a = dataFiles.length === 0;
                    if (_a) return [3 /*break*/, 5];
                    return [4 /*yield*/, Dialog_1.Dialog.confirm("attachmentWarning_msg", "attachFiles_action", function () {
                            return dataFiles.map(function (df, i) {
                                return (0, mithril_1["default"])(".text-break.selectable.mt-xs", {
                                    title: attach_1[i]
                                }, df.name);
                            });
                        })];
                case 4:
                    _a = (_b.sent());
                    _b.label = 5;
                case 5:
                    keepAttachments = _a;
                    if (!keepAttachments) return [3 /*break*/, 8];
                    sizeCheckResult_1 = (0, MailUtils_1.checkAttachmentSize)(dataFiles);
                    dataFiles = sizeCheckResult_1.attachableFiles;
                    if (!(sizeCheckResult_1.tooBigFiles.length > 0)) return [3 /*break*/, 7];
                    return [4 /*yield*/, Dialog_1.Dialog.message(function () { return LanguageViewModel_1.lang.get("tooBigAttachment_msg"); }, function () { return sizeCheckResult_1.tooBigFiles.map(function (file) { return (0, mithril_1["default"])(".text-break.selectable", file); }); })];
                case 6:
                    _b.sent();
                    _b.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8: throw new CancelledError_1.CancelledError("user cancelled opening mail editor with attachments");
                case 9: return [2 /*return*/, newMailEditorFromTemplate(mailbox, mailTo.recipients, mailTo.subject || "", (0, Signature_1.appendEmailSignature)(mailTo.body || "", LoginController_1.logins.getUserController().props), dataFiles, confidential, undefined, true // emails created with mailto should always save as draft
                    )];
            }
        });
    });
}
exports.newMailtoUrlMailEditor = newMailtoUrlMailEditor;
function newMailEditorFromTemplate(mailboxDetails, recipients, subject, bodyText, attachments, confidential, senderMailAddress, initialChangedState) {
    return (0, SendMailModel_1.defaultSendMailModel)(mailboxDetails)
        .initWithTemplate(recipients, subject, bodyText, attachments, confidential, senderMailAddress, initialChangedState)
        .then(function (model) { return createMailEditorDialog(model); });
}
exports.newMailEditorFromTemplate = newMailEditorFromTemplate;
function getSupportMailSignature() {
    return Promise.resolve().then(function () { return require("../../calendar/date/CalendarUtils"); }).then(function (_a) {
        var getTimeZone = _a.getTimeZone;
        return (MailUtils_1.LINE_BREAK +
            MailUtils_1.LINE_BREAK +
            "--" +
            "<br>Client: ".concat(ClientDetector_1.client.getIdentifier()) +
            "<br>Tutanota version: ".concat(env.versionNumber) +
            "<br>Time zone: ".concat(getTimeZone()) +
            "<br>User agent:<br> ".concat(navigator.userAgent));
    });
}
exports.getSupportMailSignature = getSupportMailSignature;
/**
 * Create and show a new mail editor with a support query, addressed to premium support,
 * or show an option to upgrade
 * @param subject
 * @param mailboxDetails
 * @returns {Promise<any>|Promise<R>|*}
 */
function writeSupportMail(subject, mailboxDetails) {
    if (subject === void 0) { subject = ""; }
    if (LoginController_1.logins.getUserController().isPremiumAccount()) {
        _mailboxPromise(mailboxDetails).then(function (mailbox) {
            var recipients = {
                to: [
                    {
                        name: null,
                        address: "premium@tutao.de"
                    },
                ]
            };
            return getSupportMailSignature().then(function (signature) {
                return newMailEditorFromTemplate(mailbox, recipients, subject, signature).then(function (dialog) { return dialog.show(); });
            });
        });
    }
    else {
        Promise.resolve().then(function () { return require("../../subscription/PriceUtils"); }).then(function (_a) {
            var formatPrice = _a.formatPrice;
            var message = LanguageViewModel_1.lang.get("premiumOffer_msg", {
                "{1}": formatPrice(1, true)
            });
            var title = LanguageViewModel_1.lang.get("upgradeReminderTitle_msg");
            return Dialog_1.Dialog.reminder(title, message, "https://tutanota.com/blog/posts/premium-pro-business" /* InfoLink.PremiumProBusiness */);
        })
            .then(function (confirm) {
            if (confirm) {
                Promise.resolve().then(function () { return require("../../subscription/UpgradeSubscriptionWizard"); }).then(function (utils) { return utils.showUpgradeWizard(); });
            }
        });
    }
}
exports.writeSupportMail = writeSupportMail;
/**
 * Create and show a new mail editor with an invite message
 * @param mailboxDetails
 * @returns {*}
 */
function writeInviteMail(mailboxDetails) {
    _mailboxPromise(mailboxDetails).then(function (mailbox) {
        var username = LoginController_1.logins.getUserController().userGroupInfo.name;
        var body = LanguageViewModel_1.lang.get("invitationMailBody_msg", {
            "{registrationLink}": "https://mail.tutanota.com/signup",
            "{username}": username,
            "{githubLink}": "https://github.com/tutao/tutanota"
        });
        newMailEditorFromTemplate(mailbox, {}, LanguageViewModel_1.lang.get("invitationMailSubject_msg"), body, [], false).then(function (dialog) { return dialog.show(); });
    });
}
exports.writeInviteMail = writeInviteMail;
/**
 * Create and show a new mail editor with an invite message
 * @param link: the link to the giftcard
 * @param svg: an SVGElement that is the DOM node of the rendered gift card
 * @param mailboxDetails
 * @returns {*}
 */
function writeGiftCardMail(link, svg, mailboxDetails) {
    _mailboxPromise(mailboxDetails).then(function (mailbox) {
        var bodyText = LanguageViewModel_1.lang
            .get("defaultShareGiftCardBody_msg", {
            "{link}": '<a href="' + link + '">' + link + "</a>",
            "{username}": LoginController_1.logins.getUserController().userGroupInfo.name
        })
            .split("\n")
            .join("<br />");
        var subject = LanguageViewModel_1.lang.get("defaultShareGiftCardSubject_msg");
        (0, SendMailModel_1.defaultSendMailModel)(mailbox)
            .initWithTemplate({}, subject, (0, Signature_1.appendEmailSignature)(bodyText, LoginController_1.logins.getUserController().props), [], false)
            .then(function (model) { return createMailEditorDialog(model, false); })
            .then(function (dialog) { return dialog.show(); });
    });
}
exports.writeGiftCardMail = writeGiftCardMail;
function _mailboxPromise(mailbox) {
    return mailbox ? Promise.resolve(mailbox) : MainLocator_1.locator.mailModel.getUserMailboxDetails();
}
