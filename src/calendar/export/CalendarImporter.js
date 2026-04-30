"use strict";
exports.__esModule = true;
exports.formatDate = exports.formatDateTimeUTC = exports.formatDateTime = exports.serializeEvent = exports.serializeCalendar = exports.makeInvitationCalendarFile = exports.makeInvitationCalendar = exports.parseCalendarStringData = exports.parseCalendarFile = void 0;
var TutanotaConstants_1 = require("../../api/common/TutanotaConstants");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var CalendarParser_1 = require("./CalendarParser");
var CommonCalendarUtils_1 = require("../../api/common/utils/CommonCalendarUtils");
var CalendarUtils_1 = require("../date/CalendarUtils");
var TypeRefs_js_1 = require("../../api/entities/tutanota/TypeRefs.js");
var DataFile_1 = require("../../api/common/DataFile");
var tutanota_utils_2 = require("@tutao/tutanota-utils");
var tutanota_utils_3 = require("@tutao/tutanota-utils");
var ParserCombinator_1 = require("../../misc/parsing/ParserCombinator");
var tutanota_utils_4 = require("@tutao/tutanota-utils");
var tutanota_utils_5 = require("@tutao/tutanota-utils");
var luxon_1 = require("luxon");
var FileController_1 = require("../../file/FileController");
var EntityUtils_1 = require("../../api/common/utils/EntityUtils");
function parseCalendarFile(file) {
    try {
        var stringData = (0, tutanota_utils_1.utf8Uint8ArrayToString)(file.data);
        return parseCalendarStringData(stringData, (0, CalendarUtils_1.getTimeZone)());
    }
    catch (e) {
        if (e instanceof ParserCombinator_1.ParserError) {
            throw new ParserCombinator_1.ParserError(e.message, file.name);
        }
        else {
            throw e;
        }
    }
}
exports.parseCalendarFile = parseCalendarFile;
function parseCalendarStringData(value, zone) {
    var tree = (0, CalendarParser_1.parseICalendar)(value);
    return (0, CalendarParser_1.parseCalendarEvents)(tree, zone);
}
exports.parseCalendarStringData = parseCalendarStringData;
function makeInvitationCalendar(versionNumber, event, method, now, zone) {
    var eventSerialized = serializeEvent(event, [], now, zone);
    return wrapIntoCalendar(versionNumber, method, eventSerialized);
}
exports.makeInvitationCalendar = makeInvitationCalendar;
function makeInvitationCalendarFile(event, method, now, zone) {
    var stringValue = makeInvitationCalendar(env.versionNumber, event, method, now, zone);
    var data = (0, tutanota_utils_1.stringToUtf8Uint8Array)(stringValue);
    var tmpFile = (0, TypeRefs_js_1.createFile)();
    var date = new Date();
    tmpFile.name = "".concat(method.toLowerCase(), "-").concat(date.getFullYear()).concat(date.getMonth() + 1).concat(date.getDate(), ".ics");
    tmpFile.mimeType = FileController_1.CALENDAR_MIME_TYPE;
    tmpFile.size = String(data.byteLength);
    return (0, DataFile_1.convertToDataFile)(tmpFile, data);
}
exports.makeInvitationCalendarFile = makeInvitationCalendarFile;
function wrapIntoCalendar(versionNumber, method, contents) {
    var value = ["BEGIN:VCALENDAR", "PRODID:-//Tutao GmbH//Tutanota ".concat(versionNumber, "//EN"), "VERSION:2.0", "CALSCALE:GREGORIAN", "METHOD:".concat(method)];
    value.push.apply(value, contents);
    value.push("END:VCALENDAR");
    return value.join("\r\n");
}
function serializeCalendar(versionNumber, events, now, zone) {
    return wrapIntoCalendar(versionNumber, "PUBLISH", (0, tutanota_utils_5.flat)(events.map(function (_a) {
        var event = _a.event, alarms = _a.alarms;
        return serializeEvent(event, alarms, now, zone);
    })));
}
exports.serializeCalendar = serializeCalendar;
function serializeRepeatRule(repeatRule, isAllDayEvent, localTimeZone) {
    if (repeatRule) {
        var endType = "";
        if (repeatRule.endType === "1" /* EndType.Count */) {
            endType = ";COUNT=".concat((0, tutanota_utils_3.neverNull)(repeatRule.endValue));
        }
        else if (repeatRule.endType === "2" /* EndType.UntilDate */) {
            // According to the RFC 5545 section 3.3.5
            //  The UNTIL rule part defines a DATE or DATE-TIME value that bounds
            //  the recurrence rule in an inclusive manner.  If the value
            //  specified by UNTIL is synchronized with the specified recurrence,
            //  this DATE or DATE-TIME becomes the last instance of the
            //  recurrence.  The value of the UNTIL rule part MUST have the same
            //  value type as the "DTSTART" property.  Furthermore, if the
            //  "DTSTART" property is specified as a date with local time, then
            //  the UNTIL rule part MUST also be specified as a date with local
            //  time.  If the "DTSTART" property is specified as a date with UTC
            //  time or a date with local time and time zone reference, then the
            //  UNTIL rule part MUST be specified as a date with UTC time.
            // We have three cases (check serializeEvent()).
            // So our matrix wil be:
            //
            // Case       | start/end format | UNTIL format
            // All-day:   | date             | date
            // w/RR       | TZID + DateTime  | timestamp
            // w/o/RR     | timestamp        | N/A
            //
            // In this branch there is a repeat rule and we just check if it's all day.
            // We also differ in a way that we define end as exclusive (because it's so
            // hard to find anything in this RFC).
            var date = new Date(Number(repeatRule.endValue));
            var value = isAllDayEvent ? formatDate((0, tutanota_utils_4.incrementDate)(date, -1), localTimeZone) : formatDateTimeUTC(new Date(date.getTime() - TutanotaConstants_1.SECOND_MS));
            endType = ";UNTIL=".concat(value);
        }
        return ["RRULE:FREQ=".concat((0, CalendarParser_1.repeatPeriodToIcalFrequency)((0, TutanotaConstants_1.assertEnumValue)(TutanotaConstants_1.RepeatPeriod, repeatRule.frequency))) + ";INTERVAL=".concat(repeatRule.interval) + endType];
    }
    else {
        return [];
    }
}
function serializeTrigger(alarmInterval) {
    switch (alarmInterval) {
        case "5M" /* AlarmInterval.FIVE_MINUTES */:
            return "-PT05M";
        case "10M" /* AlarmInterval.TEN_MINUTES */:
            return "-PT10M";
        case "30M" /* AlarmInterval.THIRTY_MINUTES */:
            return "-PT30M";
        case "1H" /* AlarmInterval.ONE_HOUR */:
            return "-PT01H";
        case "1D" /* AlarmInterval.ONE_DAY */:
            return "-P1D";
        case "2D" /* AlarmInterval.TWO_DAYS */:
            return "-P2D";
        case "3D" /* AlarmInterval.THREE_DAYS */:
            return "-P3D";
        case "1W" /* AlarmInterval.ONE_WEEK */:
            return "-P1W";
        default:
            throw new Error("unknown alarm interval: " + alarmInterval);
    }
}
function serializeAlarm(event, alarm) {
    return [
        "BEGIN:VALARM",
        "ACTION:DISPLAY",
        "DESCRIPTION:This is an event reminder",
        "TRIGGER:".concat(serializeTrigger((0, tutanota_utils_3.downcast)(alarm.alarmInfo.trigger))),
        "END:VALARM",
    ];
}
function serializeEvent(event, alarms, now, timeZone) {
    var _a;
    var repeatRule = event.repeatRule;
    var isAllDay = (0, CommonCalendarUtils_1.isAllDayEvent)(event);
    var localZone = (0, CalendarUtils_1.getTimeZone)();
    var dateStart, dateEnd;
    if (isAllDay) {
        // We use local zone because we convert UTC time to local first so to convert it back we need to use the right one.
        // It will not affect times in case of all-day event anyway
        dateStart = "DTSTART;VALUE=DATE:".concat(formatDate((0, CommonCalendarUtils_1.getAllDayDateLocal)(event.startTime), localZone));
        dateEnd = "DTEND;VALUE=DATE:".concat(formatDate((0, CommonCalendarUtils_1.getAllDayDateLocal)(event.endTime), localZone));
    }
    else if (repeatRule) {
        dateStart = "DTSTART;TZID=".concat(repeatRule.timeZone, ":").concat(formatDateTime(event.startTime, repeatRule.timeZone));
        dateEnd = "DTEND;TZID=".concat(repeatRule.timeZone, ":").concat(formatDateTime(event.endTime, repeatRule.timeZone));
    }
    else {
        dateStart = "DTSTART:".concat(formatDateTimeUTC(event.startTime));
        dateEnd = "DTEND:".concat(formatDateTimeUTC(event.endTime));
    }
    return (_a = [
        "BEGIN:VEVENT",
        dateStart,
        dateEnd,
        "DTSTAMP:".concat(formatDateTimeUTC(now)),
        "UID:".concat(event.uid ? event.uid : (0, CalendarUtils_1.generateUid)((0, tutanota_utils_3.assertNotNull)(event._ownerGroup), now.getTime())),
        "SEQUENCE:".concat(event.sequence),
        "SUMMARY:".concat(escapeSemicolons(event.summary)),
    ]
        .concat(event.description && event.description !== "" ? "DESCRIPTION:".concat(escapeSemicolons(event.description)) : [])
        .concat(serializeRepeatRule(repeatRule, isAllDay, timeZone))
        .concat(event.location && event.location.length > 0 ? "LOCATION:".concat(escapeSemicolons(event.location)) : []))
        .concat.apply(_a, (0, tutanota_utils_5.mapAndFilterNull)(alarms, function (alarm) {
        try {
            return serializeAlarm(event, alarm);
        }
        catch (e) {
            console.log("error serializing alarm ".concat((0, EntityUtils_1.getLetId)(alarm).toString(), " for event ").concat((0, EntityUtils_1.getLetId)(event).toString(), ":"), e);
            return null;
        }
    })).concat(serializeParticipants(event))
        .concat("END:VEVENT");
}
exports.serializeEvent = serializeEvent;
function serializeParticipants(event) {
    var organizer = event.organizer, attendees = event.attendees;
    if (attendees.length === 0 && organizer == null) {
        return [];
    }
    var lines = [];
    if (organizer) {
        var namePart = organizer.name ? ";CN=".concat(quotedString(organizer.name)) : "";
        lines.push("ORGANIZER".concat(namePart, ";EMAIL=").concat(organizer.address, ":mailto:").concat(organizer.address));
    }
    var attendeesProperties = attendees.map(function (_a) {
        var address = _a.address, status = _a.status;
        var namePart = address.name ? ";CN=".concat(quotedString(address.name)) : "";
        var partstat = CalendarParser_1.calendarAttendeeStatusToParstat[(0, tutanota_utils_3.downcast)(status)];
        return ("ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=".concat(partstat) + ";RSVP=TRUE".concat(namePart, ";EMAIL=").concat(address.address, ":mailto:").concat(address.address));
    });
    return lines.concat(attendeesProperties);
}
/**
 * Create an ical quoted-string param-value
 * double quotes are not allowed inside of param-value properties so they are removed
 */
function quotedString(input) {
    return "\"".concat(input.replace(/"/g, ""), "\"");
}
function escapeSemicolons(value) {
    return value.replace(/[;\\\n]/g, function (ch) { return CalendarParser_1.iCalReplacements[ch]; });
}
function pad2(number) {
    return (0, tutanota_utils_2.pad)(number, 2);
}
function formatDateTime(date, timeZone) {
    var dateTime = luxon_1.DateTime.fromJSDate(date, {
        zone: timeZone
    });
    return "".concat(dateTime.year).concat(pad2(dateTime.month)).concat(pad2(dateTime.day), "T").concat(pad2(dateTime.hour)).concat(pad2(dateTime.minute)).concat(pad2(dateTime.second));
}
exports.formatDateTime = formatDateTime;
function formatDateTimeUTC(date) {
    return "".concat(date.getUTCFullYear()).concat(pad2(date.getUTCMonth() + 1)).concat(pad2(date.getUTCDate()), "T").concat(pad2(date.getUTCHours())).concat(pad2(date.getUTCMinutes())).concat(pad2(date.getUTCSeconds()), "Z");
}
exports.formatDateTimeUTC = formatDateTimeUTC;
function formatDate(date, timeZone) {
    var dateTime = luxon_1.DateTime.fromJSDate(date, {
        zone: timeZone
    });
    return "".concat(dateTime.year).concat(pad2(dateTime.month)).concat(pad2(dateTime.day));
}
exports.formatDate = formatDate;
