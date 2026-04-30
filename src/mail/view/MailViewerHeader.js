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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.MailViewerHeader = void 0;
var mithril_1 = require("mithril");
var LanguageViewModel_js_1 = require("../../misc/LanguageViewModel.js");
var MailUtils_js_1 = require("../model/MailUtils.js");
var theme_js_1 = require("../../gui/theme.js");
var styles_js_1 = require("../../gui/styles.js");
var Expander_js_1 = require("../../gui/base/Expander.js");
var InfoBanner_js_1 = require("../../gui/base/InfoBanner.js");
var EventBanner_js_1 = require("./EventBanner.js");
var RecipientButton_js_1 = require("../../gui/base/RecipientButton.js");
var Dropdown_js_1 = require("../../gui/base/Dropdown.js");
var TutanotaConstants_js_1 = require("../../api/common/TutanotaConstants.js");
var Icon_js_1 = require("../../gui/base/Icon.js");
var Formatter_js_1 = require("../../misc/Formatter.js");
var Env_js_1 = require("../../api/common/Env.js");
var Button_js_1 = require("../../gui/base/Button.js");
var size_js_1 = require("../../gui/size.js");
var Badge_js_1 = require("../../gui/base/Badge.js");
var GuiUtils_js_1 = require("../../gui/base/GuiUtils.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var IconButton_js_1 = require("../../gui/base/IconButton.js");
var MailGuiUtils_js_1 = require("./MailGuiUtils.js");
var UserError_js_1 = require("../../api/main/UserError.js");
var ErrorHandlerImpl_js_1 = require("../../misc/ErrorHandlerImpl.js");
var MailViewerUtils_js_1 = require("./MailViewerUtils.js");
var AriaUtils_js_1 = require("../../gui/AriaUtils.js");
var KeyManager_js_1 = require("../../misc/KeyManager.js");
/** The upper part of the mail viewer, everything but the mail body itself. */
var MailViewerHeader = /** @class */ (function () {
    function MailViewerHeader() {
        this.detailsExpanded = false;
        this.filesExpanded = false;
    }
    MailViewerHeader.prototype.view = function (_a) {
        var attrs = _a.attrs;
        var viewModel = attrs.viewModel;
        var dateTime = (0, Formatter_js_1.formatDateWithWeekday)(viewModel.mail.receivedDate) + " • " + (0, Formatter_js_1.formatTime)(viewModel.mail.receivedDate);
        var dateTimeFull = (0, Formatter_js_1.formatDateWithWeekdayAndYear)(viewModel.mail.receivedDate) + " • " + (0, Formatter_js_1.formatTime)(viewModel.mail.receivedDate);
        if (styles_js_1.styles.isSingleColumnLayout()) {
            return (0, mithril_1["default"])(".header.mlr-safe-inset.mt", [
                this.renderFolderText(viewModel),
                this.renderAddressesAndDate(viewModel, attrs, dateTime, dateTimeFull),
                (0, mithril_1["default"])(Expander_js_1.ExpanderPanel, {
                    expanded: this.detailsExpanded
                }, this.renderDetails(attrs, { bubbleMenuWidth: 300 })),
                (0, mithril_1["default"])(".plr-l", this.renderAttachments(viewModel)),
                this.renderConnectionLostBanner(viewModel),
                this.renderEventBanner(viewModel),
                this.renderBanners(attrs),
                (0, mithril_1["default"])("", this.renderSubject(viewModel)),
            ]);
        }
        else {
            return (0, mithril_1["default"])(".header.mlr-safe-inset", [
                this.renderSubjectActionsLine(viewModel, attrs),
                this.renderFolderText(viewModel),
                this.renderAddressesAndDate(viewModel, attrs, dateTime, dateTimeFull),
                (0, mithril_1["default"])(Expander_js_1.ExpanderPanel, {
                    expanded: this.detailsExpanded
                }, this.renderDetails(attrs, { bubbleMenuWidth: 300 })),
                (0, mithril_1["default"])(".plr-l", this.renderAttachments(viewModel)),
                this.renderConnectionLostBanner(viewModel),
                this.renderEventBanner(viewModel),
                this.renderBanners(attrs)
            ]);
        }
    };
    MailViewerHeader.prototype.renderFolderText = function (viewModel) {
        return viewModel.getFolderText()
            ? (0, mithril_1["default"])(".flex.small.plr-l.mt-xs.mb-xs.ml-between-s", [
                (0, mithril_1["default"])(".b.mr-s", (0, mithril_1["default"])("", LanguageViewModel_js_1.lang.get("location_label"))),
                viewModel.getFolderText()
            ])
            : null;
    };
    MailViewerHeader.prototype.renderAddressesAndDate = function (viewModel, attrs, dateTime, dateTimeFull) {
        var _this = this;
        return (0, mithril_1["default"])(".flex.plr-l.mt-xs.click.col", {
            role: "button",
            "aria-pressed": String(this.detailsExpanded),
            tabindex: "0" /* TabIndex.Default */,
            onclick: function () {
                _this.detailsExpanded = !_this.detailsExpanded;
            },
            onkeydown: function (e) {
                if ((0, KeyManager_js_1.isKeyPressed)(e.keyCode, TutanotaConstants_js_1.Keys.SPACE, TutanotaConstants_js_1.Keys.RETURN)) {
                    _this.detailsExpanded = !_this.detailsExpanded;
                    e.preventDefault();
                }
            }
        }, [
            (0, mithril_1["default"])(".small.flex.flex-wrap.items-start", [this.tutaoBadge(viewModel), (0, mithril_1["default"])("span.text-break", (0, MailUtils_js_1.getSenderHeading)(viewModel.mail, false))]),
            (0, mithril_1["default"])(".flex", [
                this.getRecipientEmailAddress(attrs),
                (0, mithril_1["default"])(".flex-grow"),
                (0, mithril_1["default"])(".flex.items-center.white-space-pre.ml-s", {
                    // Orca refuses to read ut unless it's not focusable
                    tabindex: "0" /* TabIndex.Default */,
                    "aria-label": LanguageViewModel_js_1.lang.get(viewModel.isConfidential() ? "confidential_action" : "nonConfidential_action") + ", " + dateTime
                }, [
                    viewModel.isConfidential()
                        ? (0, mithril_1["default"])(Icon_js_1.Icon, {
                            icon: "Lock" /* Icons.Lock */,
                            style: {
                                fill: theme_js_1.theme.content_fg
                            },
                            // flex makes svg inside centered and not randomly somewhere
                            "class": "flex"
                        })
                        : null,
                    (0, mithril_1["default"])("small.date.content-fg.selectable", [
                        (0, mithril_1["default"])("span.noprint", dateTime),
                        (0, mithril_1["default"])("span.noscreen", dateTimeFull), // show the date with year when printing
                    ]),
                ])
            ]),
        ]);
    };
    MailViewerHeader.prototype.renderSubjectActionsLine = function (viewModel, attrs) {
        return (0, mithril_1["default"])(".flex.items-start", [
            this.renderSubject(viewModel),
            this.actionButtons(attrs)
        ]);
    };
    MailViewerHeader.prototype.renderSubject = function (viewModel) {
        return (0, mithril_1["default"])(".h5.subject.text-break.selectable.b.flex-grow.pl-l.pr", {
            "aria-label": LanguageViewModel_js_1.lang.get("subject_label") + ", " + (viewModel.getSubject() || ""),
            style: { marginTop: "12px" }
        }, viewModel.getSubject() || "");
    };
    MailViewerHeader.prototype.renderBanners = function (attrs) {
        var viewModel = attrs.viewModel;
        return [
            this.renderPhishingWarning(viewModel) || this.renderHardAuthenticationFailWarning(viewModel) || this.renderSoftAuthenticationFailWarning(viewModel),
            this.renderExternalContentBanner(attrs),
            (0, mithril_1["default"])("hr.hr.mt-xs.mlr-l"),
        ].filter(Boolean);
    };
    MailViewerHeader.prototype.renderConnectionLostBanner = function (viewModel) {
        // If the mail body failed to load, then we show a message in the main column
        // If the mail body did load but not everything else, we show the message here
        if (viewModel.isConnectionLost()) {
            return (0, mithril_1["default"])(InfoBanner_js_1.InfoBanner, {
                message: "mailPartsNotLoaded_msg",
                icon: "Warning" /* Icons.Warning */,
                buttons: [
                    {
                        label: "retry_action",
                        click: function () { return viewModel.loadAll(); }
                    }
                ]
            });
        }
        else {
            return null;
        }
    };
    MailViewerHeader.prototype.renderEventBanner = function (viewModel) {
        var event = viewModel.getCalendarEventAttachment();
        return event
            ? (0, mithril_1["default"])(".plr-l", (0, mithril_1["default"])(EventBanner_js_1.EventBanner, {
                event: event.event,
                method: event.method,
                recipient: event.recipient,
                mail: viewModel.mail
            }))
            : null;
    };
    MailViewerHeader.prototype.renderDetails = function (attrs, _a) {
        var _this = this;
        var bubbleMenuWidth = _a.bubbleMenuWidth;
        var viewModel = attrs.viewModel, createMailAddressContextButtons = attrs.createMailAddressContextButtons;
        var envelopeSender = viewModel.getDifferentEnvelopeSender();
        return (0, mithril_1["default"])(".plr-l" + (0, AriaUtils_js_1.liveDataAttrs)(), [
            (0, mithril_1["default"])(".mt-s", (0, mithril_1["default"])(".small.b", LanguageViewModel_js_1.lang.get("from_label")), (0, mithril_1["default"])(RecipientButton_js_1.RecipientButton, {
                label: (0, MailUtils_js_1.getDisplayText)(viewModel.getSender().name, viewModel.getSender().address, false),
                click: (0, Dropdown_js_1.createAsyncDropdown)({
                    lazyButtons: function () { return createMailAddressContextButtons({
                        mailAddress: viewModel.getSender(),
                        defaultInboxRuleField: "0" /* InboxRuleType.FROM_EQUALS */
                    }); }, width: bubbleMenuWidth
                })
            }), envelopeSender
                ? [
                    (0, mithril_1["default"])(".small.b", LanguageViewModel_js_1.lang.get("sender_label")),
                    (0, mithril_1["default"])(RecipientButton_js_1.RecipientButton, {
                        label: (0, MailUtils_js_1.getDisplayText)("", envelopeSender, false),
                        click: (0, Dropdown_js_1.createAsyncDropdown)({
                            lazyButtons: function () { return __awaiter(_this, void 0, void 0, function () {
                                var childElements, contextButtons;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            childElements = [
                                                {
                                                    info: LanguageViewModel_js_1.lang.get("envelopeSenderInfo_msg"),
                                                    center: false,
                                                    bold: false
                                                },
                                                {
                                                    info: envelopeSender,
                                                    center: true,
                                                    bold: true
                                                },
                                            ];
                                            return [4 /*yield*/, createMailAddressContextButtons({
                                                    mailAddress: {
                                                        address: envelopeSender,
                                                        name: ""
                                                    },
                                                    defaultInboxRuleField: "0" /* InboxRuleType.FROM_EQUALS */,
                                                    createContact: false
                                                })];
                                        case 1:
                                            contextButtons = _a.sent();
                                            return [2 /*return*/, __spreadArray(__spreadArray([], childElements, true), contextButtons, true)];
                                    }
                                });
                            }); }, width: bubbleMenuWidth
                        })
                    }),
                ]
                : null),
            (0, mithril_1["default"])(".mt-s", viewModel.getToRecipients().length
                ? [
                    (0, mithril_1["default"])(".small.b", LanguageViewModel_js_1.lang.get("to_label")),
                    (0, mithril_1["default"])(".flex.col.mt-between-s", viewModel.getToRecipients().map(function (recipient) {
                        return (0, mithril_1["default"])(".flex", (0, mithril_1["default"])(RecipientButton_js_1.RecipientButton, {
                            label: (0, MailUtils_js_1.getDisplayText)(recipient.name, recipient.address, false),
                            click: (0, Dropdown_js_1.createAsyncDropdown)({
                                lazyButtons: function () { return createMailAddressContextButtons({
                                    mailAddress: recipient,
                                    defaultInboxRuleField: "1" /* InboxRuleType.RECIPIENT_TO_EQUALS */
                                }); }, width: bubbleMenuWidth
                            }),
                            // To wrap text inside flex container, we need to allow element to shrink and pick own width
                            style: {
                                flex: "0 1 auto"
                            }
                        }));
                    })),
                ]
                : null),
            (0, mithril_1["default"])(".mt-s", viewModel.getCcRecipients().length
                ? [
                    (0, mithril_1["default"])(".small.b", LanguageViewModel_js_1.lang.get("cc_label")),
                    (0, mithril_1["default"])(".flex-start.flex-wrap", viewModel.getCcRecipients().map(function (recipient) {
                        return (0, mithril_1["default"])(RecipientButton_js_1.RecipientButton, {
                            label: (0, MailUtils_js_1.getDisplayText)(recipient.name, recipient.address, false),
                            click: (0, Dropdown_js_1.createAsyncDropdown)({
                                lazyButtons: function () { return createMailAddressContextButtons({
                                    mailAddress: recipient,
                                    defaultInboxRuleField: "2" /* InboxRuleType.RECIPIENT_CC_EQUALS */
                                }); }, width: bubbleMenuWidth
                            }),
                            style: {
                                flex: "0 1 auto"
                            }
                        });
                    })),
                ]
                : null),
            (0, mithril_1["default"])(".mt-s", viewModel.getBccRecipients().length
                ? [
                    (0, mithril_1["default"])(".small.b", LanguageViewModel_js_1.lang.get("bcc_label")),
                    (0, mithril_1["default"])(".flex-start.flex-wrap", viewModel.getBccRecipients().map(function (recipient) {
                        return (0, mithril_1["default"])(RecipientButton_js_1.RecipientButton, {
                            label: (0, MailUtils_js_1.getDisplayText)(recipient.name, recipient.address, false),
                            click: (0, Dropdown_js_1.createAsyncDropdown)({
                                lazyButtons: function () { return createMailAddressContextButtons({
                                    mailAddress: recipient,
                                    defaultInboxRuleField: "3" /* InboxRuleType.RECIPIENT_BCC_EQUALS */
                                }); }, width: bubbleMenuWidth
                            }),
                            style: {
                                flex: "0 1 auto"
                            }
                        });
                    })),
                ]
                : null),
            (0, mithril_1["default"])(".mt-s", viewModel.getReplyTos().length
                ? [
                    (0, mithril_1["default"])(".small.b", LanguageViewModel_js_1.lang.get("replyTo_label")),
                    (0, mithril_1["default"])(".flex-start.flex-wrap", viewModel.getReplyTos().map(function (recipient) {
                        return (0, mithril_1["default"])(RecipientButton_js_1.RecipientButton, {
                            label: (0, MailUtils_js_1.getDisplayText)(recipient.name, recipient.address, false),
                            click: (0, Dropdown_js_1.createAsyncDropdown)({
                                lazyButtons: function () { return createMailAddressContextButtons({
                                    mailAddress: recipient,
                                    defaultInboxRuleField: null
                                }); }, width: bubbleMenuWidth
                            }),
                            style: {
                                flex: "0 1 auto"
                            }
                        });
                    })),
                ]
                : null),
        ]);
    };
    MailViewerHeader.prototype.renderAttachments = function (viewModel) {
        var _this = this;
        // Show a loading symbol if we are loading attachments
        if (viewModel.isLoadingAttachments() && !viewModel.isConnectionLost()) {
            return (0, mithril_1["default"])(".flex", [(0, mithril_1["default"])(".flex-v-center.pl-button", (0, Icon_js_1.progressIcon)()), (0, mithril_1["default"])(".small.flex-v-center.plr.button-height", LanguageViewModel_js_1.lang.get("loading_msg"))]);
        }
        else {
            var attachments = viewModel.getNonInlineAttachments();
            var attachmentCount = attachments.length;
            // Do nothing if we have no attachments
            if (attachmentCount === 0) {
                return null;
            }
            // Get the total size of the attachments
            var totalAttachmentSize_1 = 0;
            attachments.forEach(function (attachment) { return totalAttachmentSize_1 += Number(attachment.size); });
            return [
                (0, mithril_1["default"])(".flex" + (0, AriaUtils_js_1.liveDataAttrs)(), [
                    attachmentCount === 1
                        // If we have exactly one attachment, just show the attachment
                        ? this.renderAttachmentContainer(viewModel, attachments)
                        // Otherwise, we show the number of attachments and its total size along with a show all button
                        : [
                            (0, mithril_1["default"])(".flex.center-vertically.click.flex-grow.ml-between-s.mt-xs", {
                                role: "button",
                                "aria-pressed": String(this.detailsExpanded),
                                tabindex: "0" /* TabIndex.Default */,
                                onclick: function () { return _this.filesExpanded = !_this.filesExpanded; },
                                onkeydown: function (e) {
                                    if ((0, KeyManager_js_1.isKeyPressed)(e.keyCode, TutanotaConstants_js_1.Keys.SPACE, TutanotaConstants_js_1.Keys.RETURN)) {
                                        _this.filesExpanded = !_this.filesExpanded;
                                        e.preventDefault();
                                    }
                                }
                            }, [
                                (0, mithril_1["default"])("", LanguageViewModel_js_1.lang.get("attachmentAmount_label", { "{amount}": attachmentCount + "" }) + " (".concat((0, Formatter_js_1.formatStorageSize)(totalAttachmentSize_1), ")")),
                                (0, mithril_1["default"])(Icon_js_1.Icon, {
                                    icon: "Expand" /* BootIcons.Expand */,
                                    style: {
                                        fill: theme_js_1.theme.content_fg,
                                        transform: this.filesExpanded ? "rotate(180deg)" : ""
                                    }
                                })
                            ]),
                        ],
                ]),
                // if we have more than one attachment, list them here in this expander panel
                attachments.length > 1
                    ? (0, mithril_1["default"])(Expander_js_1.ExpanderPanel, {
                        expanded: this.filesExpanded
                    }, (0, mithril_1["default"])(".flex.col", [
                        (0, mithril_1["default"])(".flex.flex-wrap.column-gap", this.renderAttachmentContainer(viewModel, attachments)),
                        (0, Env_js_1.isIOSApp)()
                            ? null
                            : (0, mithril_1["default"])(".flex", (0, mithril_1["default"])(Button_js_1.Button, {
                                label: "saveAll_action",
                                type: "secondary" /* ButtonType.Secondary */,
                                click: function () { return viewModel.downloadAll(); }
                            }))
                    ]))
                    : null,
            ];
        }
    };
    MailViewerHeader.prototype.renderAttachmentContainer = function (viewModel, attachments) {
        var _this = this;
        return attachments.map(function (attachment) { return _this.renderAttachmentButton(viewModel, attachment); });
    };
    MailViewerHeader.prototype.renderAttachmentButton = function (viewModel, attachment) {
        if ((0, Env_js_1.isAndroidApp)() || (0, Env_js_1.isDesktop)()) {
            return (0, mithril_1["default"])(Button_js_1.Button, {
                label: function () { return attachment.name; },
                icon: function () { return "Attachment" /* Icons.Attachment */; },
                type: "bubble" /* ButtonType.Bubble */,
                staticRightText: "(".concat((0, Formatter_js_1.formatStorageSize)(Number(attachment.size)), ")"),
                click: (0, Dropdown_js_1.createDropdown)({
                    width: 200,
                    overrideOrigin: function (originalOrigin) {
                        // Bubble buttons use border so dropdown is misaligned by default
                        return new Dropdown_js_1.DomRectReadOnlyPolyfilled(originalOrigin.left + size_js_1.size.bubble_border_width, originalOrigin.top, originalOrigin.width, originalOrigin.height);
                    },
                    lazyButtons: function () { return [
                        {
                            label: "open_action",
                            click: function () { return viewModel.downloadAndOpenAttachment(attachment, true); }
                        },
                        {
                            label: "download_action",
                            click: function () { return viewModel.downloadAndOpenAttachment(attachment, false); }
                        },
                    ]; }
                })
            });
        }
        else {
            return (0, mithril_1["default"])(Button_js_1.Button, {
                label: function () { return attachment.name; },
                icon: function () { return "Attachment" /* Icons.Attachment */; },
                click: function () { return viewModel.downloadAndOpenAttachment(attachment, true); },
                type: "bubble" /* ButtonType.Bubble */,
                staticRightText: "(".concat((0, Formatter_js_1.formatStorageSize)(Number(attachment.size)), ")")
            });
        }
    };
    MailViewerHeader.prototype.tutaoBadge = function (viewModel) {
        return (0, MailUtils_js_1.isTutanotaTeamMail)(viewModel.mail)
            ? (0, mithril_1["default"])(Badge_js_1["default"], {
                classes: ".mr-s"
            }, "Tutanota Team") : null;
    };
    MailViewerHeader.prototype.renderPhishingWarning = function (viewModel) {
        if (viewModel.isMailSuspicious()) {
            return (0, mithril_1["default"])(InfoBanner_js_1.InfoBanner, {
                message: "phishingMessageBody_msg",
                icon: "Warning" /* Icons.Warning */,
                type: "warning" /* BannerType.Warning */,
                helpLink: "https://tutanota.com/faq#phishing" /* InfoLink.Phishing */,
                buttons: [
                    {
                        label: "markAsNotPhishing_action",
                        click: function () { return viewModel.markAsNotPhishing().then(function () { return mithril_1["default"].redraw(); }); }
                    },
                ]
            });
        }
    };
    MailViewerHeader.prototype.renderHardAuthenticationFailWarning = function (viewModel) {
        if (!viewModel.isWarningDismissed() && viewModel.mail.authStatus === TutanotaConstants_js_1.MailAuthenticationStatus.HARD_FAIL) {
            return (0, mithril_1["default"])(InfoBanner_js_1.InfoBanner, {
                message: "mailAuthFailed_msg",
                icon: "Warning" /* Icons.Warning */,
                helpLink: "https://tutanota.com/faq#mail-auth" /* InfoLink.MailAuth */,
                type: "warning" /* BannerType.Warning */,
                buttons: [
                    {
                        label: "close_alt",
                        click: function () { return (viewModel.setWarningDismissed(true)); }
                    },
                ]
            });
        }
    };
    MailViewerHeader.prototype.renderSoftAuthenticationFailWarning = function (viewModel) {
        if (!viewModel.isWarningDismissed() && viewModel.mail.authStatus === TutanotaConstants_js_1.MailAuthenticationStatus.SOFT_FAIL) {
            return (0, mithril_1["default"])(InfoBanner_js_1.InfoBanner, {
                message: function () {
                    return viewModel.mail.differentEnvelopeSender
                        ? LanguageViewModel_js_1.lang.get("mailAuthMissingWithTechnicalSender_msg", {
                            "{sender}": viewModel.mail.differentEnvelopeSender
                        })
                        : LanguageViewModel_js_1.lang.get("mailAuthMissing_label");
                },
                icon: "Warning" /* Icons.Warning */,
                helpLink: "https://tutanota.com/faq#mail-auth" /* InfoLink.MailAuth */,
                buttons: [
                    {
                        label: "close_alt",
                        click: function () { return (viewModel.setWarningDismissed(true)); }
                    },
                ]
            });
        }
        else {
            return null;
        }
    };
    MailViewerHeader.prototype.renderExternalContentBanner = function (attrs) {
        // only show banner when there are blocked images and the user hasn't made a decision about how to handle them
        if (attrs.viewModel.getContentBlockingStatus() !== "0" /* ContentBlockingStatus.Block */) {
            return null;
        }
        var showButton = {
            label: "showBlockedContent_action",
            click: function () { return attrs.viewModel.setContentBlockingStatus("1" /* ContentBlockingStatus.Show */); }
        };
        var alwaysOrNeverAllowButtons = attrs.viewModel.canPersistBlockingStatus()
            ? [
                attrs.viewModel.isMailAuthenticated()
                    ? {
                        label: "allowExternalContentSender_action",
                        click: function () { return attrs.viewModel.setContentBlockingStatus("2" /* ContentBlockingStatus.AlwaysShow */); }
                    }
                    : null,
                {
                    label: "blockExternalContentSender_action",
                    click: function () { return attrs.viewModel.setContentBlockingStatus("4" /* ContentBlockingStatus.AlwaysBlock */); }
                },
            ].filter(tutanota_utils_1.isNotNull)
            : [];
        // on narrow screens the buttons will end up on 2 lines if there are too many, this looks bad.
        var maybeDropdownButtons = styles_js_1.styles.isSingleColumnLayout() && alwaysOrNeverAllowButtons.length > 1
            ? [(0, GuiUtils_js_1.createMoreSecondaryButtonAttrs)(alwaysOrNeverAllowButtons, 216)]
            : alwaysOrNeverAllowButtons;
        return (0, mithril_1["default"])(InfoBanner_js_1.InfoBanner, {
            message: "contentBlocked_msg",
            icon: "Picture" /* Icons.Picture */,
            helpLink: "https://tutanota.com/faq#load-images" /* InfoLink.LoadImages */,
            buttons: __spreadArray([showButton], maybeDropdownButtons, true)
        });
    };
    MailViewerHeader.prototype.actionButtons = function (attrs) {
        var viewModel = attrs.viewModel;
        var actions;
        if (viewModel.isAnnouncement()) {
            actions = [
                this.deleteButton(attrs),
                this.moreButton(attrs),
            ];
        }
        else if (viewModel.isDraftMail()) {
            actions = [
                this.deleteButton(attrs),
                this.moveButton(attrs),
                this.editButton(attrs),
            ];
        }
        else if (viewModel.canForwardOrMove()) {
            actions = [
                this.replyButtons(attrs),
                this.forwardButton(attrs),
                this.separator(),
                this.deleteButton(attrs),
                this.moveButton(attrs),
                this.moreButton(attrs),
            ];
        }
        else if (viewModel.canAssignMails()) {
            actions = [
                this.replyButtons(attrs),
                this.assignButton(attrs),
                this.separator(),
                this.deleteButton(attrs),
                this.moreButton(attrs),
            ];
        }
        else {
            actions = [
                this.replyButtons(attrs),
                this.separator(),
                this.deleteButton(attrs),
                this.moreButton(attrs),
            ];
        }
        return (0, mithril_1["default"])(".action-bar.flex-end.items-center.ml-between-s.mt-xs", {
            style: {
                marginRight: "6px"
            }
        }, actions);
    };
    MailViewerHeader.prototype.deleteButton = function (_a) {
        var viewModel = _a.viewModel;
        return (0, mithril_1["default"])(IconButton_js_1.IconButton, {
            title: "delete_action",
            click: function () {
                (0, MailGuiUtils_js_1.promptAndDeleteMails)(viewModel.mailModel, [viewModel.mail], tutanota_utils_1.noOp);
            },
            icon: "Trash" /* Icons.Trash */
        });
    };
    MailViewerHeader.prototype.moreButton = function (attrs) {
        return (0, mithril_1["default"])(IconButton_js_1.IconButton, {
            title: "more_label",
            icon: "More" /* Icons.More */,
            click: this.prepareMoreActions(attrs)
        });
    };
    MailViewerHeader.prototype.moveButton = function (_a) {
        var viewModel = _a.viewModel;
        return (0, mithril_1["default"])(IconButton_js_1.IconButton, {
            title: "move_action",
            icon: "Folder" /* Icons.Folder */,
            click: function (e, dom) { return (0, MailGuiUtils_js_1.showMoveMailsDropdown)(viewModel.mailModel, dom.getBoundingClientRect(), [viewModel.mail]); }
        });
    };
    MailViewerHeader.prototype.editButton = function (_a) {
        var viewModel = _a.viewModel;
        return (0, mithril_1["default"])(IconButton_js_1.IconButton, {
            title: "edit_action",
            click: function () { return (0, MailViewerUtils_js_1.editDraft)(viewModel); },
            icon: "Edit" /* Icons.Edit */
        });
    };
    MailViewerHeader.prototype.replyButtons = function (_a) {
        var viewModel = _a.viewModel;
        var actions = [];
        actions.push((0, mithril_1["default"])(IconButton_js_1.IconButton, {
            title: "reply_action",
            click: function () { return viewModel.reply(false); },
            icon: "Reply" /* Icons.Reply */
        }));
        if (viewModel.canReplyAll()) {
            actions.push((0, mithril_1["default"])(IconButton_js_1.IconButton, {
                title: "replyAll_action",
                click: function () { return viewModel.reply(true); },
                icon: "ReplyAll" /* Icons.ReplyAll */
            }));
        }
        return actions;
    };
    MailViewerHeader.prototype.forwardButton = function (_a) {
        var viewModel = _a.viewModel;
        return (0, mithril_1["default"])(IconButton_js_1.IconButton, {
            title: "forward_action",
            click: function () { return viewModel.forward()["catch"]((0, tutanota_utils_1.ofClass)(UserError_js_1.UserError, ErrorHandlerImpl_js_1.showUserError)); },
            icon: "Forward" /* Icons.Forward */
        });
    };
    MailViewerHeader.prototype.assignButton = function (_a) {
        var viewModel = _a.viewModel;
        return (0, mithril_1["default"])(IconButton_js_1.IconButton, {
            title: "forward_action",
            icon: "Forward" /* Icons.Forward */,
            colors: "content" /* ButtonColor.Content */,
            click: (0, Dropdown_js_1.createAsyncDropdown)({
                width: 250,
                lazyButtons: function () { return (0, MailViewerUtils_js_1.makeAssignMailsButtons)(viewModel); }
            })
        });
    };
    MailViewerHeader.prototype.separator = function () {
        return (0, mithril_1["default"])("", {
            style: {
                width: "0",
                // 24px is usually the visible icon size
                height: "24px",
                border: "0.5px solid ".concat(theme_js_1.theme.content_border)
            }
        });
    };
    MailViewerHeader.prototype.prepareMoreActions = function (_a) {
        var viewModel = _a.viewModel;
        return (0, Dropdown_js_1.createDropdown)({
            lazyButtons: function () { return (0, MailViewerUtils_js_1.mailViewerMoreActions)(viewModel); },
            width: 300
        });
    };
    MailViewerHeader.prototype.getRecipientEmailAddress = function (_a) {
        var viewModel = _a.viewModel;
        var mail = viewModel.mail;
        var relevantRecipient = viewModel.getRelevantRecipient();
        if (relevantRecipient) {
            var numberOfAllRecipients = mail.toRecipients.length + mail.ccRecipients.length + mail.bccRecipients.length;
            return (0, mithril_1["default"])(".flex.click.small.ml-between-s.items-center", {
                style: {
                    // use this to allow the container to shrink, otherwise it doesn't want to cut the recipient address
                    minWidth: "20px"
                }
            }, [
                (0, mithril_1["default"])("", LanguageViewModel_js_1.lang.get("mailViewerRecipients_label")),
                (0, mithril_1["default"])(".text-ellipsis", relevantRecipient.address),
                (0, mithril_1["default"])(".flex.no-wrap", [
                    numberOfAllRecipients > 1 ? "+ ".concat(numberOfAllRecipients - 1) : null,
                    (0, mithril_1["default"])(Icon_js_1.Icon, {
                        icon: "Expand" /* BootIcons.Expand */,
                        container: "div",
                        style: {
                            fill: theme_js_1.theme.content_fg,
                            transform: this.detailsExpanded ? "rotate(180deg)" : ""
                        }
                    })
                ])
            ]);
        }
        else {
            return "";
        }
    };
    return MailViewerHeader;
}());
exports.MailViewerHeader = MailViewerHeader;
