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
exports.replyToEventInvitation = exports.getLatestEvent = exports.getEventFromFile = exports.showEventDetails = void 0;
var CalendarImporter_1 = require("../export/CalendarImporter");
var MainLocator_1 = require("../../api/main/MainLocator");
var TutanotaConstants_1 = require("../../api/common/TutanotaConstants");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var CalendarUtils_1 = require("./CalendarUtils");
var LoginController_1 = require("../../api/main/LoginController");
var CalendarUpdateDistributor_1 = require("./CalendarUpdateDistributor");
var Dialog_1 = require("../../gui/base/Dialog");
var UserError_1 = require("../../api/main/UserError");
var ProgressMonitor_1 = require("../../api/common/utils/ProgressMonitor");
var CalendarEventViewModel_1 = require("./CalendarEventViewModel");
var NoZoneDateProvider_js_1 = require("../../api/common/utils/NoZoneDateProvider.js");
function getParsedEvent(fileData) {
    try {
        var _a = (0, CalendarImporter_1.parseCalendarFile)(fileData), contents = _a.contents, method = _a.method;
        var verifiedMethod = (0, TutanotaConstants_1.getAsEnumValue)(TutanotaConstants_1.CalendarMethod, method) || TutanotaConstants_1.CalendarMethod.PUBLISH;
        var parsedEventWithAlarms = contents[0];
        if (parsedEventWithAlarms && parsedEventWithAlarms.event.uid) {
            return {
                event: parsedEventWithAlarms.event,
                uid: parsedEventWithAlarms.event.uid,
                method: verifiedMethod
            };
        }
        else {
            return null;
        }
    }
    catch (e) {
        console.log(e);
        return null;
    }
}
function showEventDetails(event, eventBubbleRect, mail) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, latestEvent, CalendarEventPopup, htmlSanitizer, viewModel, onEditEvent, calendarInfos_1, mailboxDetails_1;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        getLatestEvent(event),
                        Promise.resolve().then(function () { return require("../view/CalendarEventPopup"); }),
                        Promise.resolve().then(function () { return require("../../misc/HtmlSanitizer"); }),
                    ])];
                case 1:
                    _a = _b.sent(), latestEvent = _a[0], CalendarEventPopup = _a[1].CalendarEventPopup, htmlSanitizer = _a[2].htmlSanitizer;
                    viewModel = null;
                    onEditEvent = null;
                    if (!LoginController_1.logins.getUserController().isInternalUser()) return [3 /*break*/, 5];
                    return [4 /*yield*/, MainLocator_1.locator.calendarModel.loadOrCreateCalendarInfo(new ProgressMonitor_1.NoopProgressMonitor())];
                case 2:
                    calendarInfos_1 = _b.sent();
                    return [4 /*yield*/, MainLocator_1.locator.mailModel.getUserMailboxDetails()];
                case 3:
                    mailboxDetails_1 = _b.sent();
                    return [4 /*yield*/, (0, CalendarEventViewModel_1.createCalendarEventViewModel)((0, CalendarUtils_1.getEventStart)(latestEvent, (0, CalendarUtils_1.getTimeZone)()), calendarInfos_1, mailboxDetails_1, latestEvent, mail, true)];
                case 4:
                    viewModel = _b.sent();
                    onEditEvent = function () { return __awaiter(_this, void 0, void 0, function () {
                        var showCalendarEventDialog;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../view/CalendarEventEditDialog"); })];
                                case 1:
                                    showCalendarEventDialog = (_a.sent()).showCalendarEventDialog;
                                    showCalendarEventDialog(latestEvent.startTime, calendarInfos_1, mailboxDetails_1, latestEvent, mail !== null && mail !== void 0 ? mail : undefined);
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    _b.label = 5;
                case 5:
                    new CalendarEventPopup(latestEvent, eventBubbleRect, htmlSanitizer, onEditEvent, viewModel).show();
                    return [2 /*return*/];
            }
        });
    });
}
exports.showEventDetails = showEventDetails;
function getEventFromFile(file) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var dataFile, parsedEvent;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, MainLocator_1.locator.fileController.downloadAndDecrypt(file)];
                case 1:
                    dataFile = _b.sent();
                    parsedEvent = getParsedEvent(dataFile);
                    return [2 /*return*/, (_a = parsedEvent === null || parsedEvent === void 0 ? void 0 : parsedEvent.event) !== null && _a !== void 0 ? _a : null];
            }
        });
    });
}
exports.getEventFromFile = getEventFromFile;
/**
 * Returns the latest version for the given event by uid. If the event is not in any calendar (because it has not been stored yet, e.g. in case of invite)
 * the given event is returned.
 */
function getLatestEvent(event) {
    var uid = event.uid;
    if (uid) {
        return MainLocator_1.locator.calendarFacade.getEventByUid(uid).then(function (existingEvent) {
            if (existingEvent) {
                // If the file we are opening is newer than the one which we have on the server, update server version.
                // Should not happen normally but can happen when e.g. reply and update were sent one after another before we accepted
                // the invite. Then accepting first invite and then opening update should give us updated version.
                if ((0, tutanota_utils_1.filterInt)(existingEvent.sequence) < (0, tutanota_utils_1.filterInt)(event.sequence)) {
                    return MainLocator_1.locator.calendarModel.updateEventWithExternal(existingEvent, event);
                }
                else {
                    return existingEvent;
                }
            }
            else {
                return event;
            }
        });
    }
    else {
        return Promise.resolve(event);
    }
}
exports.getLatestEvent = getLatestEvent;
/**
 * Sends a quick reply for the given event and saves the event to the first private calendar.
 */
function replyToEventInvitation(event, attendee, decision, previousMail) {
    var eventClone = (0, tutanota_utils_1.clone)(event);
    var foundAttendee = (0, tutanota_utils_1.assertNotNull)(eventClone.attendees.find(function (a) { return a.address.address === attendee.address.address; }));
    foundAttendee.status = decision;
    return Promise.all([
        MainLocator_1.locator.calendarModel.loadOrCreateCalendarInfo(new ProgressMonitor_1.NoopProgressMonitor()).then(CalendarUtils_1.findPrivateCalendar),
        MainLocator_1.locator.mailModel.getMailboxDetailsForMail(previousMail),
    ]).then(function (_a) {
        var calendar = _a[0], mailboxDetails = _a[1];
        return Promise.resolve().then(function () { return require("../../mail/editor/SendMailModel"); }).then(function (_a) {
            var SendMailModel = _a.SendMailModel;
            var sendMailModel = new SendMailModel(MainLocator_1.locator.mailFacade, MainLocator_1.locator.entityClient, LoginController_1.logins, MainLocator_1.locator.mailModel, MainLocator_1.locator.contactModel, MainLocator_1.locator.eventController, mailboxDetails, MainLocator_1.locator.recipientsModel, new NoZoneDateProvider_js_1.NoZoneDateProvider());
            return CalendarUpdateDistributor_1.calendarUpdateDistributor
                .sendResponse(eventClone, sendMailModel, foundAttendee.address.address, previousMail, decision)["catch"]((0, tutanota_utils_1.ofClass)(UserError_1.UserError, function (e) { return Dialog_1.Dialog.message(function () { return e.message; }); }))
                .then(function () {
                if (calendar) {
                    // if the owner group is set there is an existing event already so just update
                    if (event._ownerGroup) {
                        return MainLocator_1.locator.calendarModel.loadAlarms(event.alarmInfos, LoginController_1.logins.getUserController().user).then(function (alarms) {
                            var alarmInfos = alarms.map(function (a) { return a.alarmInfo; });
                            return MainLocator_1.locator.calendarModel.updateEvent(eventClone, alarmInfos, (0, CalendarUtils_1.getTimeZone)(), calendar.groupRoot, event).then(tutanota_utils_1.noOp);
                        });
                    }
                    else {
                        if (decision !== TutanotaConstants_1.CalendarAttendeeStatus.DECLINED) {
                            return MainLocator_1.locator.calendarModel.createEvent(eventClone, [], (0, CalendarUtils_1.getTimeZone)(), calendar.groupRoot);
                        }
                    }
                }
                return Promise.resolve();
            });
        });
    });
}
exports.replyToEventInvitation = replyToEventInvitation;
