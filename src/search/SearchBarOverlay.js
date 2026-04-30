"use strict";
exports.__esModule = true;
exports.SearchBarOverlay = void 0;
var size_1 = require("../gui/size");
var LanguageViewModel_1 = require("../misc/LanguageViewModel");
var Button_js_1 = require("../gui/base/Button.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var LoginController_1 = require("../api/main/LoginController");
var TutanotaConstants_1 = require("../api/common/TutanotaConstants");
var Formatter_1 = require("../misc/Formatter");
var TypeRefs_js_1 = require("../api/entities/tutanota/TypeRefs.js");
var MailUtils_1 = require("../mail/model/MailUtils");
var Badge_1 = require("../gui/base/Badge");
var Icon_1 = require("../gui/base/Icon");
var TypeRefs_js_2 = require("../api/entities/tutanota/TypeRefs.js");
var TypeRefs_js_3 = require("../api/entities/sys/TypeRefs.js");
var TypeRefs_js_4 = require("../api/entities/sys/TypeRefs.js");
var ClientDetector_1 = require("../misc/ClientDetector");
var mithril_1 = require("mithril");
var theme_1 = require("../gui/theme");
var ContactUtils_1 = require("../contacts/model/ContactUtils");
var MailGuiUtils_1 = require("../mail/view/MailGuiUtils");
var MainLocator_1 = require("../api/main/MainLocator");
var SearchBarOverlay = /** @class */ (function () {
    function SearchBarOverlay() {
    }
    SearchBarOverlay.prototype.view = function (_a) {
        var attrs = _a.attrs;
        var state = attrs.state;
        return [
            this._renderIndexingStatus(state, attrs),
            state.entities && !(0, tutanota_utils_1.isEmpty)(state.entities) && attrs.isQuickSearch && attrs.isExpanded && attrs.isFocused ? this.renderResults(state, attrs) : null,
        ];
    };
    SearchBarOverlay.prototype.renderResults = function (state, attrs) {
        var _this = this;
        return (0, mithril_1["default"])("ul.list.click.mail-list", [
            state.entities.map(function (result) {
                return (0, mithril_1["default"])("li.plr-l.flex-v-center.", {
                    style: {
                        height: (0, size_1.px)(52),
                        "border-left": (0, size_1.px)(size_1.size.border_selection) + " solid transparent"
                    },
                    onmousedown: function () { return attrs.skipNextBlur(true); },
                    // avoid closing overlay before the click event can be received
                    onclick: function () { return attrs.selectResult(result); },
                    "class": state.selected === result ? "row-selected" : ""
                }, _this.renderResult(state, result));
            }),
        ]);
    };
    SearchBarOverlay.prototype._renderIndexingStatus = function (state, attrs) {
        if (attrs.isFocused || (!attrs.isQuickSearch && ClientDetector_1.client.isDesktopDevice())) {
            if (state.indexState.failedIndexingUpTo != null) {
                return this.renderError(state.indexState.failedIndexingUpTo, attrs);
            }
            else if (state.indexState.progress !== 0) {
                return this._renderProgress(state, attrs);
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    };
    SearchBarOverlay.prototype._renderProgress = function (state, attrs) {
        return (0, mithril_1["default"])(".flex.col.rel", [
            (0, mithril_1["default"])(".plr-l.pt-s.pb-s.flex.items-center.flex-space-between.mr-negative-s", {
                style: {
                    height: (0, size_1.px)(52),
                    borderLeft: "".concat((0, size_1.px)(size_1.size.border_selection), " solid transparent")
                }
            }, [
                (0, mithril_1["default"])(".top.flex-space-between.col", (0, mithril_1["default"])(".bottom.flex-space-between", (0, mithril_1["default"])("", LanguageViewModel_1.lang.get("indexedMails_label", {
                    "{count}": state.indexState.indexedMailCount
                })))),
                state.indexState.progress !== 100
                    ? (0, mithril_1["default"])("div", {
                        onmousedown: function () { return attrs.skipNextBlur(true); }
                    }, (0, mithril_1["default"])(Button_js_1.Button, {
                        label: "cancel_action",
                        click: function () { return MainLocator_1.locator.indexerFacade.cancelMailIndexing(); },
                        //icon: () => Icons.Cancel
                        type: "secondary" /* ButtonType.Secondary */
                    }))
                    : null, // avoid closing overlay before the click event can be received
            ]),
            (0, mithril_1["default"])(".abs", {
                style: {
                    backgroundColor: theme_1.theme.content_accent,
                    height: "2px",
                    width: state.indexState.progress + "%",
                    bottom: 0
                }
            }),
        ]);
    };
    SearchBarOverlay.prototype.renderError = function (failedIndexingUpTo, attrs) {
        var errorMessageKey = attrs.state.indexState.error === 1 /* IndexingErrorReason.ConnectionLost */
            ? "indexingFailedConnection_error"
            : "indexing_error";
        return (0, mithril_1["default"])(".flex.rel", [
            (0, mithril_1["default"])(".plr-l.pt-s.pb-s.flex.items-center.flex-space-between.mr-negative-s", {
                style: {
                    height: (0, size_1.px)(52),
                    borderLeft: "".concat((0, size_1.px)(size_1.size.border_selection), " solid transparent")
                }
            }, [
                (0, mithril_1["default"])(".small", LanguageViewModel_1.lang.get(errorMessageKey)),
                (0, mithril_1["default"])("div", {
                    onmousedown: function () { return attrs.skipNextBlur(true); }
                }, (0, mithril_1["default"])(Button_js_1.Button, {
                    label: "retry_action",
                    click: function () { return MainLocator_1.locator.indexerFacade.extendMailIndex(failedIndexingUpTo); },
                    type: "secondary" /* ButtonType.Secondary */
                })),
            ]),
        ]);
    };
    SearchBarOverlay.prototype.renderResult = function (state, result) {
        var type = "_type" in result ? result._type : null;
        if (!type) {
            // show more action
            var showMoreAction = result;
            var infoText = void 0;
            var indexInfo = void 0;
            if (showMoreAction.resultCount === 0) {
                infoText = LanguageViewModel_1.lang.get("searchNoResults_msg");
                if (LoginController_1.logins.getUserController().isFreeAccount()) {
                    indexInfo = LanguageViewModel_1.lang.get("changeTimeFrame_msg");
                }
            }
            else if (showMoreAction.allowShowMore) {
                infoText = LanguageViewModel_1.lang.get("showMore_action");
            }
            else {
                infoText = LanguageViewModel_1.lang.get("moreResultsFound_msg", {
                    "{1}": showMoreAction.resultCount - showMoreAction.shownCount
                });
            }
            if (showMoreAction.indexTimestamp > TutanotaConstants_1.FULL_INDEXED_TIMESTAMP && !indexInfo) {
                indexInfo = LanguageViewModel_1.lang.get("searchedUntil_msg") + " " + (0, Formatter_1.formatDate)(new Date(showMoreAction.indexTimestamp));
            }
            return indexInfo
                ? [(0, mithril_1["default"])(".top.flex-center", infoText), (0, mithril_1["default"])(".bottom.flex-center.small", indexInfo)]
                : (0, mithril_1["default"])("li.plr-l.pt-s.pb-s.items-center.flex-center", (0, mithril_1["default"])(".flex-center", infoText));
        }
        else if ((0, tutanota_utils_1.isSameTypeRef)(TypeRefs_js_1.MailTypeRef, type)) {
            var mail = result;
            return [
                (0, mithril_1["default"])(".top.flex-space-between.badge-line-height", [
                    (0, MailUtils_1.isTutanotaTeamMail)(mail)
                        ? (0, mithril_1["default"])(Badge_1["default"], {
                            classes: ".small.mr-s"
                        }, "Tutanota Team")
                        : null,
                    (0, mithril_1["default"])("small.text-ellipsis", (0, MailUtils_1.getSenderOrRecipientHeading)(mail, true)),
                    (0, mithril_1["default"])("small.text-ellipsis.flex-fixed", (0, Formatter_1.formatDateTimeFromYesterdayOn)(mail.receivedDate)),
                ]),
                (0, mithril_1["default"])(".bottom.flex-space-between", [
                    (0, mithril_1["default"])(".text-ellipsis", mail.subject),
                    (0, mithril_1["default"])(".icons.flex-fixed", {
                        style: {
                            "margin-right": "-3px"
                        }
                    }, [
                        // 3px to neutralize the svg icons internal border
                        (0, mithril_1["default"])(Icon_1.Icon, {
                            icon: (0, MailGuiUtils_1.getMailFolderIcon)(mail),
                            "class": state.selected === result ? "svg-content-accent-fg" : "svg-content-fg"
                        }),
                        (0, mithril_1["default"])(Icon_1.Icon, {
                            icon: "Attachment" /* Icons.Attachment */,
                            "class": state.selected === result ? "svg-content-accent-fg" : "svg-content-fg",
                            style: {
                                display: mail.attachments.length > 0 ? "" : "none"
                            }
                        }),
                    ]),
                ]),
            ];
        }
        else if ((0, tutanota_utils_1.isSameTypeRef)(TypeRefs_js_2.ContactTypeRef, type)) {
            var contact = result;
            return [
                (0, mithril_1["default"])(".top.flex-space-between", (0, mithril_1["default"])(".name", (0, ContactUtils_1.getContactListName)(contact))),
                (0, mithril_1["default"])(".bottom.flex-space-between", (0, mithril_1["default"])("small.mail-address", contact.mailAddresses && contact.mailAddresses.length > 0 ? contact.mailAddresses[0].address : "")),
            ];
        }
        else if ((0, tutanota_utils_1.isSameTypeRef)(TypeRefs_js_3.GroupInfoTypeRef, type)) {
            var groupInfo = result;
            return [
                (0, mithril_1["default"])(".top.flex-space-between", (0, mithril_1["default"])(".name", groupInfo.name)),
                (0, mithril_1["default"])(".bottom.flex-space-between", [
                    (0, mithril_1["default"])("small.mail-address", groupInfo.mailAddress),
                    (0, mithril_1["default"])(".icons.flex", [
                        groupInfo.deleted
                            ? (0, mithril_1["default"])(Icon_1.Icon, {
                                icon: "Trash" /* Icons.Trash */,
                                "class": "svg-list-accent-fg"
                            })
                            : null,
                        !groupInfo.mailAddress && mithril_1["default"].route.get().startsWith("/settings/groups")
                            ? (0, mithril_1["default"])(Icon_1.Icon, {
                                icon: "Settings" /* BootIcons.Settings */,
                                "class": "svg-list-accent-fg"
                            })
                            : null,
                        groupInfo.mailAddress && mithril_1["default"].route.get().startsWith("/settings/groups")
                            ? (0, mithril_1["default"])(Icon_1.Icon, {
                                icon: "Mail" /* BootIcons.Mail */,
                                "class": "svg-list-accent-fg"
                            })
                            : null,
                    ]),
                ]),
            ];
        }
        else if ((0, tutanota_utils_1.isSameTypeRef)(TypeRefs_js_4.WhitelabelChildTypeRef, type)) {
            var whitelabelChild = result;
            return [
                (0, mithril_1["default"])(".top.flex-space-between", (0, mithril_1["default"])(".name", whitelabelChild.mailAddress)),
                (0, mithril_1["default"])(".bottom.flex-space-between", [
                    (0, mithril_1["default"])("small.mail-address", (0, Formatter_1.formatDateWithMonth)(whitelabelChild.createdDate)),
                    (0, mithril_1["default"])(".icons.flex", [
                        whitelabelChild.deletedDate
                            ? (0, mithril_1["default"])(Icon_1.Icon, {
                                icon: "Trash" /* Icons.Trash */,
                                "class": "svg-list-accent-fg"
                            })
                            : null,
                    ]),
                ]),
            ];
        }
        else {
            return [];
        }
    };
    return SearchBarOverlay;
}());
exports.SearchBarOverlay = SearchBarOverlay;
