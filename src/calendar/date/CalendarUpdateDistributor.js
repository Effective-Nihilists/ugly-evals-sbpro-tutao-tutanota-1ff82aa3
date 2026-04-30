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
exports.calendarUpdateDistributor = exports.CalendarMailDistributor = void 0;
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var CalendarImporter_1 = require("../export/CalendarImporter");
var TutanotaConstants_1 = require("../../api/common/TutanotaConstants");
var CalendarUtils_1 = require("./CalendarUtils");
var TypeRefs_js_1 = require("../../api/entities/tutanota/TypeRefs.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var WindowFacade_1 = require("../../misc/WindowFacade");
var RecipientsNotFoundError_1 = require("../../api/common/error/RecipientsNotFoundError");
var MailUtils_1 = require("../../mail/model/MailUtils");
var CalendarMailDistributor = /** @class */ (function () {
    function CalendarMailDistributor() {
        this._windowUnsubscribe = null;
        this._countDownLatch = 0;
    }
    CalendarMailDistributor.prototype.sendInvite = function (event, sendMailModel) {
        var message = LanguageViewModel_1.lang.get("eventInviteMail_msg", {
            "{event}": event.summary
        });
        var sender = assertOrganizer(event).address;
        return this._sendCalendarFile({
            sendMailModel: sendMailModel,
            method: "2" /* MailMethod.ICAL_REQUEST */,
            subject: message,
            body: makeInviteEmailBody(sender, event, message),
            event: event,
            sender: sender
        });
    };
    CalendarMailDistributor.prototype.sendUpdate = function (event, sendMailModel) {
        var message = LanguageViewModel_1.lang.get("eventUpdated_msg", {
            "{event}": event.summary
        });
        var sender = assertOrganizer(event).address;
        return this._sendCalendarFile({
            sendMailModel: sendMailModel,
            method: "2" /* MailMethod.ICAL_REQUEST */,
            subject: message,
            body: makeInviteEmailBody(sender, event, message),
            event: event,
            sender: sender
        });
    };
    CalendarMailDistributor.prototype.sendCancellation = function (event, sendMailModel) {
        var _this = this;
        var message = LanguageViewModel_1.lang.get("eventCancelled_msg", {
            "{event}": event.summary
        });
        var sender = assertOrganizer(event).address;
        return this._sendCalendarFile({
            sendMailModel: sendMailModel,
            method: "5" /* MailMethod.ICAL_CANCEL */,
            subject: message,
            body: makeInviteEmailBody(sender, event, message),
            event: event,
            sender: sender
        })["catch"]((0, tutanota_utils_1.ofClass)(RecipientsNotFoundError_1.RecipientsNotFoundError, function (e) {
            // we want to delete the event even if the recipient is not an existing tutanota address
            // and just exclude them from sending out updates but leave the event untouched for other recipients
            var invalidRecipients = e.message.split("\n");
            var hasRemovedRecipient = false;
            invalidRecipients.forEach(function (invalidRecipient) {
                var recipientInfo = sendMailModel.bccRecipients().find(function (r) { return r.address === invalidRecipient; });
                if (recipientInfo) {
                    hasRemovedRecipient = sendMailModel.removeRecipient(recipientInfo, MailUtils_1.RecipientField.BCC, false) || hasRemovedRecipient;
                }
            });
            // only try sending again if we successfully removed a recipient and there are still other recipients
            if (hasRemovedRecipient && sendMailModel.allRecipients().length) {
                return _this.sendCancellation(event, sendMailModel);
            }
        }));
    };
    CalendarMailDistributor.prototype.sendResponse = function (event, sendMailModel, sendAs, responseTo, status) {
        var _this = this;
        var message = LanguageViewModel_1.lang.get("repliedToEventInvite_msg", {
            "{sender}": sendAs,
            "{event}": event.summary
        });
        var organizer = assertOrganizer(event);
        var body = makeInviteEmailBody(organizer.address, event, message);
        if (responseTo) {
            return Promise.resolve()
                .then(function () {
                _this._sendStart();
                return sendMailModel.initAsResponse({
                    previousMail: responseTo,
                    conversationType: "1" /* ConversationType.REPLY */,
                    senderMailAddress: sendAs,
                    recipients: [
                        {
                            address: organizer.address,
                            name: organizer.name
                        },
                    ],
                    attachments: [],
                    bodyText: body,
                    subject: message,
                    replyTos: []
                }, new Map());
            })
                .then(function (model) {
                model.attachFiles([(0, CalendarImporter_1.makeInvitationCalendarFile)(event, TutanotaConstants_1.CalendarMethod.REPLY, new Date(), (0, CalendarUtils_1.getTimeZone)())]);
                return model.send("3" /* MailMethod.ICAL_REPLY */).then(tutanota_utils_1.noOp);
            })["finally"](function () { return _this._sendEnd(); });
        }
        else {
            return this._sendCalendarFile({
                sendMailModel: sendMailModel,
                method: "3" /* MailMethod.ICAL_REPLY */,
                subject: message,
                body: body,
                event: event,
                sender: sendAs
            });
        }
    };
    CalendarMailDistributor.prototype._sendCalendarFile = function (_a) {
        var sendMailModel = _a.sendMailModel, method = _a.method, subject = _a.subject, event = _a.event, body = _a.body, sender = _a.sender;
        return __awaiter(this, void 0, void 0, function () {
            var inviteFile;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        inviteFile = (0, CalendarImporter_1.makeInvitationCalendarFile)(event, (0, TutanotaConstants_1.mailMethodToCalendarMethod)(method), new Date(), (0, CalendarUtils_1.getTimeZone)());
                        sendMailModel.setSender(sender);
                        sendMailModel.attachFiles([inviteFile]);
                        sendMailModel.setSubject(subject);
                        sendMailModel.setBody(body);
                        this._sendStart();
                        return [4 /*yield*/, sendMailModel
                                .send(method)["catch"](function (e) {
                                // we remove the attachment from the model to prevent adding more than one calendar file
                                // in case the user changes the event and tries to send again a new attachment is created
                                var attachedInviteFile = sendMailModel.getAttachments().find(function (file) { return file.name === inviteFile.name; });
                                if (attachedInviteFile) {
                                    sendMailModel.removeAttachment(attachedInviteFile);
                                }
                                throw e;
                            })["finally"](function () { return _this._sendEnd(); })];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CalendarMailDistributor.prototype._sendStart = function () {
        this._countDownLatch++;
        if (this._countDownLatch === 1) {
            this._windowUnsubscribe = WindowFacade_1.windowFacade.addWindowCloseListener(tutanota_utils_1.noOp);
        }
    };
    CalendarMailDistributor.prototype._sendEnd = function () {
        this._countDownLatch--;
        if (this._countDownLatch === 0 && this._windowUnsubscribe) {
            this._windowUnsubscribe();
            this._windowUnsubscribe = null;
        }
    };
    return CalendarMailDistributor;
}());
exports.CalendarMailDistributor = CalendarMailDistributor;
function summaryLine(event) {
    return newLine(LanguageViewModel_1.lang.get("name_label"), event.summary);
}
function whenLine(event) {
    var duration = (0, CalendarUtils_1.formatEventDuration)(event, (0, CalendarUtils_1.getTimeZone)(), true);
    return newLine(LanguageViewModel_1.lang.get("when_label"), duration);
}
function organizerLabel(organizer, a) {
    return organizer.address === a.address.address ? "(".concat(LanguageViewModel_1.lang.get("organizer_label"), ")") : "";
}
function newLine(label, content) {
    return "<div style=\"display: flex; margin-top: 8px\"><div style=\"min-width: 120px\"><b style=\"float:right; margin-right:16px\">".concat(label, ":</b></div>").concat(content, "</div>");
}
function attendeesLine(event) {
    var organizer = event.organizer;
    var attendees = "";
    // If organizer is already in the attendees, we don't have to add them separately.
    if (organizer && !event.attendees.find(function (a) { return a.address.address === organizer.address; })) {
        attendees = makeAttendee(organizer, (0, TypeRefs_js_1.createCalendarEventAttendee)({
            address: organizer
        }));
    }
    attendees += event.attendees.map(function (a) { return makeAttendee((0, tutanota_utils_1.assertNotNull)(organizer), a); }).join("\n");
    return newLine(LanguageViewModel_1.lang.get("who_label"), "<div>".concat(attendees, "</div>"));
}
function makeAttendee(organizer, attendee) {
    return "<div>\n".concat(attendee.address.name || "", " ").concat(attendee.address.address, "\n").concat(organizerLabel(organizer, attendee), "\n").concat((0, CalendarUtils_1.calendarAttendeeStatusSymbol)((0, TutanotaConstants_1.getAttendeeStatus)(attendee)), "</div>");
}
function locationLine(event) {
    return event.location ? newLine(LanguageViewModel_1.lang.get("location_label"), event.location) : "";
}
function descriptionLine(event) {
    return event.description ? newLine(LanguageViewModel_1.lang.get("description_label"), "<div>".concat(event.description, "</div>")) : "";
}
function makeInviteEmailBody(sender, event, message) {
    return "\n\t<div style=\"max-width: 685px; margin: 0 auto\">\n\t  \t<h2 style=\"text-align: center\">".concat(message, "</h2>\n  \t\t<div style=\"margin: 0 auto\">\n  \t\t\t").concat(summaryLine(event), "\n    \t\t").concat(whenLine(event), "\n    \t\t").concat(locationLine(event), "\n    \t\t").concat(attendeesLine(event), "\n    \t\t").concat(descriptionLine(event), "\n  \t\t</div>\n\t</div>");
}
function assertOrganizer(event) {
    if (event.organizer == null) {
        throw new Error("Cannot send event update without organizer");
    }
    return event.organizer;
}
exports.calendarUpdateDistributor = new CalendarMailDistributor();
