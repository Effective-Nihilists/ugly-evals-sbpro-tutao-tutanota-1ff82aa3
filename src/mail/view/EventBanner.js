"use strict";
exports.__esModule = true;
exports.BannerButton = exports.EventBanner = void 0;
var mithril_1 = require("mithril");
var MessageBox_js_1 = require("../../gui/base/MessageBox.js");
var size_1 = require("../../gui/size");
var Button_js_1 = require("../../gui/base/Button.js");
var TutanotaConstants_1 = require("../../api/common/TutanotaConstants");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var theme_1 = require("../../gui/theme");
var Dialog_1 = require("../../gui/base/Dialog");
var ProgressDialog_1 = require("../../gui/dialogs/ProgressDialog");
var MailUtils_1 = require("../model/MailUtils");
var EventBanner = /** @class */ (function () {
    function EventBanner() {
    }
    EventBanner.prototype.view = function (_a) {
        var _b = _a.attrs, event = _b.event, mail = _b.mail, recipient = _b.recipient, method = _b.method;
        var ownAttendee = event.attendees.find(function (a) { return a.address.address === recipient; });
        return (0, mithril_1["default"])(MessageBox_js_1.MessageBox, {
            style: {
                alignItems: "start",
                paddingBottom: "0",
                maxWidth: "100%",
                display: "flex",
                flexDirection: "column",
                paddingLeft: (0, size_1.px)(size_1.size.hpad_large),
                paddingRight: (0, size_1.px)(size_1.size.hpad_large),
                overflow: "hidden",
                paddingTop: "0"
            }
        }, [
            (0, mithril_1["default"])("", method === TutanotaConstants_1.CalendarMethod.REQUEST && ownAttendee
                ? (0, MailUtils_1.isRepliedTo)(mail) || (ownAttendee && ownAttendee.status !== TutanotaConstants_1.CalendarAttendeeStatus.NEEDS_ACTION)
                    ? (0, mithril_1["default"])(".pt.align-self-start.start.smaller", LanguageViewModel_1.lang.get("alreadyReplied_msg"))
                    : renderReplyButtons(event, mail, recipient)
                : method === TutanotaConstants_1.CalendarMethod.REPLY
                    ? (0, mithril_1["default"])(".pt.align-self-start.start.smaller", LanguageViewModel_1.lang.get("eventNotificationUpdated_msg"))
                    : null),
            (0, mithril_1["default"])(".ml-negative-s.limit-width.align-self-start", (0, mithril_1["default"])(Button_js_1.Button, {
                label: "viewEvent_action",
                type: "secondary" /* ButtonType.Secondary */,
                click: function (e, dom) {
                    return Promise.resolve().then(function () { return require("../../calendar/date/CalendarInvites"); }).then(function (_a) {
                        var showEventDetails = _a.showEventDetails;
                        return showEventDetails(event, dom.getBoundingClientRect(), mail);
                    });
                }
            })),
        ]);
    };
    return EventBanner;
}());
exports.EventBanner = EventBanner;
var BannerButton = /** @class */ (function () {
    function BannerButton() {
    }
    BannerButton.prototype.view = function (_a) {
        var attrs = _a.attrs;
        return (0, mithril_1["default"])("button.border-radius.mr-s.center", {
            style: {
                border: "2px solid ".concat(attrs.borderColor),
                background: "transparent",
                color: attrs.color,
                width: "min-content",
                padding: (0, size_1.px)(size_1.size.hpad_button),
                minWidth: "60px"
            },
            onclick: attrs.click
        }, LanguageViewModel_1.lang.getMaybeLazy(attrs.text));
    };
    return BannerButton;
}());
exports.BannerButton = BannerButton;
function renderReplyButtons(event, previousMail, recipient) {
    return [
        (0, mithril_1["default"])(".pt", LanguageViewModel_1.lang.get("invitedToEvent_msg")),
        (0, mithril_1["default"])(".flex.items-center.mt", [
            (0, mithril_1["default"])(BannerButton, {
                text: "yes_label",
                click: function () { return sendResponse(event, recipient, TutanotaConstants_1.CalendarAttendeeStatus.ACCEPTED, previousMail); },
                borderColor: theme_1.theme.content_button,
                color: theme_1.theme.content_fg
            }),
            (0, mithril_1["default"])(BannerButton, {
                text: "maybe_label",
                click: function () { return sendResponse(event, recipient, TutanotaConstants_1.CalendarAttendeeStatus.TENTATIVE, previousMail); },
                borderColor: theme_1.theme.content_button,
                color: theme_1.theme.content_fg
            }),
            (0, mithril_1["default"])(BannerButton, {
                text: "no_label",
                click: function () { return sendResponse(event, recipient, TutanotaConstants_1.CalendarAttendeeStatus.DECLINED, previousMail); },
                borderColor: theme_1.theme.content_button,
                color: theme_1.theme.content_fg
            }),
        ]),
    ];
}
function sendResponse(event, recipient, status, previousMail) {
    (0, ProgressDialog_1.showProgressDialog)("pleaseWait_msg", Promise.resolve().then(function () { return require("../../calendar/date/CalendarInvites"); }).then(function (_a) {
        var getLatestEvent = _a.getLatestEvent, replyToEventInvitation = _a.replyToEventInvitation;
        return getLatestEvent(event).then(function (latestEvent) {
            var ownAttendee = latestEvent.attendees.find(function (a) { return a.address.address === recipient; });
            if (ownAttendee == null) {
                Dialog_1.Dialog.message("attendeeNotFound_msg");
                return;
            }
            replyToEventInvitation(latestEvent, ownAttendee, status, previousMail)
                .then(function () { return (ownAttendee.status = status); })
                .then(mithril_1["default"].redraw);
        });
    }));
}
