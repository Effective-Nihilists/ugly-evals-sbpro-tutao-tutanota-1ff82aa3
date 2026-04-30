"use strict";
var _a;
exports.__esModule = true;
exports.parseDuration = exports.parseTime = exports.parseUntilRruleTime = exports.parseTimeIntoComponents = exports.repeatPeriodToIcalFrequency = exports.parseCalendarEvents = exports.calendarAttendeeStatusToParstat = exports.parseICalendar = exports.parsePropertyKeyValue = exports.parseProperty = exports.propertySequenceParser = exports.iCalReplacements = void 0;
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var luxon_1 = require("luxon");
var TypeRefs_js_1 = require("../../api/entities/tutanota/TypeRefs.js");
var TypeRefs_js_2 = require("../../api/entities/sys/TypeRefs.js");
var TypeRefs_js_3 = require("../../api/entities/sys/TypeRefs.js");
var ParserCombinator_1 = require("../../misc/parsing/ParserCombinator");
var WindowsZones_1 = require("./WindowsZones");
var TypeRefs_js_4 = require("../../api/entities/tutanota/TypeRefs.js");
var TypeRefs_js_5 = require("../../api/entities/tutanota/TypeRefs.js");
var FormatValidator_1 = require("../../misc/FormatValidator");
var TutanotaConstants_1 = require("../../api/common/TutanotaConstants");
function parseDateString(dateString) {
    var year = parseInt(dateString.slice(0, 4));
    var month = parseInt(dateString.slice(4, 6));
    var day = parseInt(dateString.slice(6, 8));
    return {
        year: year,
        month: month,
        day: day
    };
}
function getProp(obj, tag) {
    var prop = obj.properties.find(function (p) { return p.name === tag; });
    if (prop == null)
        throw new ParserCombinator_1.ParserError("Missing prop ".concat(tag));
    return prop;
}
function getPropStringValue(obj, tag) {
    var prop = getProp(obj, tag);
    if (typeof prop.value !== "string")
        throw new ParserCombinator_1.ParserError("value of ".concat(tag, " is not of type string"));
    return prop.value;
}
// Left side of the semicolon
var parameterStringValueParser = function (iterator) {
    var value = "";
    while (iterator.peek() && /[:;,]/.test(iterator.peek()) === false) {
        value += (0, tutanota_utils_1.neverNull)(iterator.next().value);
    }
    return value;
};
var escapedStringValueParser = function (iterator) {
    if (iterator.next().value !== "\"") {
        throw new ParserCombinator_1.ParserError("Not a quoted value");
    }
    var value = "";
    while (iterator.peek() && iterator.peek() !== "\"") {
        value += (0, tutanota_utils_1.neverNull)(iterator.next().value);
    }
    if (!(iterator.peek() === "\"")) {
        throw new Error("Not a quoted value, does not end with quote: " + value);
    }
    iterator.next();
    return value;
};
var propertyParametersKeyValueParser = (0, ParserCombinator_1.combineParsers)(parsePropertyName, (0, ParserCombinator_1.makeCharacterParser)("="), (0, ParserCombinator_1.makeEitherParser)(escapedStringValueParser, parameterStringValueParser));
var parsePropertyParameters = (0, ParserCombinator_1.combineParsers)((0, ParserCombinator_1.makeCharacterParser)(";"), (0, ParserCombinator_1.makeSeparatedByParser)(
/*separator*/ (0, ParserCombinator_1.makeCharacterParser)(";"), 
/*value*/ propertyParametersKeyValueParser));
exports.iCalReplacements = {
    ";": "\\;",
    "\\": "\\\\",
    "\n": "\\n"
};
// Right side of the semicolon
/**
 * Parses everything until the end of the string and unescapes what it should
 */
var anyStringUnescapeParser = function (iterator) {
    var value = "";
    var lastCharacter = null;
    while (iterator.peek()) {
        lastCharacter = iterator.next().value;
        if (lastCharacter === "\\") {
            if (iterator.peek() in exports.iCalReplacements) {
                continue;
            }
            else if (iterator.peek() === "n") {
                iterator.next();
                value += "\n";
                continue;
            }
        }
        value += (0, tutanota_utils_1.neverNull)(lastCharacter);
    }
    return value;
};
/**
 * Parses everything until the semicolon character
 */
var propertyStringValueParser = function (iterator) {
    var value = "";
    while (iterator.peek() && /[;]/.test(iterator.peek()) === false) {
        value += (0, tutanota_utils_1.neverNull)(iterator.next().value);
    }
    return value;
};
/**
 * Parses the whole property (both sides)
 */
exports.propertySequenceParser = (0, ParserCombinator_1.combineParsers)(parsePropertyName, (0, ParserCombinator_1.maybeParse)(parsePropertyParameters), (0, ParserCombinator_1.makeCharacterParser)(":"), anyStringUnescapeParser);
function parseProperty(data) {
    var sequence = (0, exports.propertySequenceParser)(new ParserCombinator_1.StringIterator(data));
    var name = sequence[0];
    var params = {};
    if (sequence[1]) {
        sequence[1][1].forEach(function (_a) {
            var name = _a[0], eq = _a[1], value = _a[2];
            params[name] = value;
        });
    }
    var value = sequence[3];
    return {
        name: name,
        params: params,
        value: value
    };
}
exports.parseProperty = parseProperty;
/**
 * Parses single key=value pair on the right side of the semicolon (value side)
 */
var propertyKeyValueParser = (0, ParserCombinator_1.combineParsers)(parsePropertyName, (0, ParserCombinator_1.makeCharacterParser)("="), propertyStringValueParser);
/**
 * Parses multiple key=value pair on the right side of the semicolon (value side)
 */
var valuesSeparatedBySemicolonParser = (0, ParserCombinator_1.makeSeparatedByParser)((0, ParserCombinator_1.makeCharacterParser)(";"), propertyKeyValueParser);
/**
 * Parses multiple key=value pair on the right side of the semicolon (value side)
 */
function parsePropertyKeyValue(data) {
    var value = valuesSeparatedBySemicolonParser(new ParserCombinator_1.StringIterator(data));
    var result = {};
    value.forEach(function (_a) {
        var key = _a[0], eq = _a[1], value = _a[2];
        result[key] = value;
    });
    return result;
}
exports.parsePropertyKeyValue = parsePropertyKeyValue;
function parseIcalObject(tag, iterator) {
    var iteration = iterator.next();
    var properties = [];
    var children = [];
    while (!iteration.done && iteration.value) {
        var property = parseProperty(iteration.value);
        if (property.name === "END" && property.value === tag) {
            return {
                type: tag,
                properties: properties,
                children: children
            };
        }
        if (property.name === "BEGIN") {
            if (typeof property.value !== "string")
                throw new ParserCombinator_1.ParserError("BEGIN with array value");
            children.push(parseIcalObject(property.value, iterator));
        }
        else {
            properties.push(property);
        }
        iteration = iterator.next();
    }
    throw new ParserCombinator_1.ParserError("no end for tag " + tag);
}
function parseICalendar(stringData) {
    var withFoldedLines = stringData
        .replace(/\r?\n\s/g, "")
        .split(/\r?\n/)
        .filter(function (e) { return e !== ""; });
    var iterator = withFoldedLines.values();
    var firstLine = iterator.next();
    if (firstLine.value !== "BEGIN:VCALENDAR") {
        throw new ParserCombinator_1.ParserError("Not a VCALENDAR: " + String(firstLine.value));
    }
    return parseIcalObject("VCALENDAR", iterator);
}
exports.parseICalendar = parseICalendar;
function parseAlarm(alarmObject, event) {
    var triggerProp = getProp(alarmObject, "TRIGGER");
    // Tutacalendar currently only supports the DISPLAY value for action
    var actionProp = {
        name: "ACTION",
        params: {},
        value: "DISPLAY"
    };
    var triggerValue = triggerProp.value;
    if (typeof triggerValue !== "string")
        throw new ParserCombinator_1.ParserError("expected TRIGGER property to be a string: " + JSON.stringify(triggerProp));
    var trigger;
    // Absolute time
    if (triggerValue.endsWith("Z")) {
        var triggerTime = parseTime(triggerValue).date;
        var tillEvent = event.startTime.getTime() - triggerTime.getTime();
        if (tillEvent >= tutanota_utils_1.DAY_IN_MILLIS * 7) {
            trigger = "1W" /* AlarmInterval.ONE_WEEK */;
        }
        else if (tillEvent >= tutanota_utils_1.DAY_IN_MILLIS * 3) {
            trigger = "3D" /* AlarmInterval.THREE_DAYS */;
        }
        else if (tillEvent >= tutanota_utils_1.DAY_IN_MILLIS * 2) {
            trigger = "2D" /* AlarmInterval.TWO_DAYS */;
        }
        else if (tillEvent >= tutanota_utils_1.DAY_IN_MILLIS) {
            trigger = "1D" /* AlarmInterval.ONE_DAY */;
        }
        else if (tillEvent >= 60 * 60 * 1000) {
            trigger = "1H" /* AlarmInterval.ONE_HOUR */;
        }
        else if (tillEvent >= 30 * 60 * 1000) {
            trigger = "30M" /* AlarmInterval.THIRTY_MINUTES */;
        }
        else if (tillEvent >= 10 * 60 * 1000) {
            trigger = "10M" /* AlarmInterval.TEN_MINUTES */;
        }
        else if (tillEvent >= 0) {
            trigger = "5M" /* AlarmInterval.FIVE_MINUTES */;
        }
        else {
            return null;
        }
    }
    else {
        var duration = parseDuration(triggerValue);
        if (duration.positive) {
            return null;
        }
        else {
            if (duration.week) {
                trigger = "1W" /* AlarmInterval.ONE_WEEK */;
            }
            else if (duration.day) {
                if (duration.day >= 3) {
                    trigger = "3D" /* AlarmInterval.THREE_DAYS */;
                }
                else if (duration.day === 2) {
                    trigger = "2D" /* AlarmInterval.TWO_DAYS */;
                }
                else {
                    trigger = "1D" /* AlarmInterval.ONE_DAY */;
                }
            }
            else if (duration.hour) {
                if (duration.hour > 1) {
                    trigger = "1D" /* AlarmInterval.ONE_DAY */;
                }
                else {
                    trigger = "1H" /* AlarmInterval.ONE_HOUR */;
                }
            }
            else if (duration.minute) {
                if (duration.minute > 30) {
                    trigger = "1H" /* AlarmInterval.ONE_HOUR */;
                }
                else if (duration.minute > 10) {
                    trigger = "30M" /* AlarmInterval.THIRTY_MINUTES */;
                }
                else if (duration.minute > 5) {
                    trigger = "10M" /* AlarmInterval.TEN_MINUTES */;
                }
                else {
                    trigger = "5M" /* AlarmInterval.FIVE_MINUTES */;
                }
            }
            else {
                trigger = "3D" /* AlarmInterval.THREE_DAYS */;
            }
        }
    }
    return Object.assign((0, TypeRefs_js_3.createAlarmInfo)(), {
        trigger: trigger
    });
}
function parseRrule(rruleProp, tzId) {
    var rruleValue;
    try {
        rruleValue = parsePropertyKeyValue(rruleProp.value);
    }
    catch (e) {
        if (e instanceof ParserCombinator_1.ParserError) {
            throw new ParserCombinator_1.ParserError("RRULE is not an object " + e.message);
        }
        else {
            throw e;
        }
    }
    var frequency = icalFrequencyToRepeatPeriod(rruleValue["FREQ"]);
    var until = rruleValue["UNTIL"] ? parseUntilRruleTime(rruleValue["UNTIL"], tzId) : null;
    var count = rruleValue["COUNT"] ? parseInt(rruleValue["COUNT"]) : null;
    var endType = until != null ? "2" /* EndType.UntilDate */ : count != null ? "1" /* EndType.Count */ : "0" /* EndType.Never */;
    var interval = rruleValue["INTERVAL"] ? parseInt(rruleValue["INTERVAL"]) : 1;
    var repeatRule = (0, TypeRefs_js_2.createRepeatRule)();
    repeatRule.endValue = until ? String(until.getTime()) : count ? String(count) : null;
    repeatRule.endType = endType;
    repeatRule.interval = String(interval);
    repeatRule.frequency = frequency;
    if (typeof tzId === "string") {
        repeatRule.timeZone = tzId;
    }
    return repeatRule;
}
function parseEventDuration(durationProp, event) {
    if (typeof durationProp.value !== "string")
        throw new ParserCombinator_1.ParserError("DURATION value is not a string");
    var duration = parseDuration(durationProp.value);
    var durationInMillis = 0;
    if (duration.week) {
        durationInMillis += tutanota_utils_1.DAY_IN_MILLIS * 7 * duration.week;
    }
    if (duration.day) {
        durationInMillis += tutanota_utils_1.DAY_IN_MILLIS * duration.day;
    }
    if (duration.hour) {
        durationInMillis += 1000 * 60 * 60 * duration.hour;
    }
    if (duration.minute) {
        durationInMillis += 1000 * 60 * duration.minute;
    }
    event.endTime = new Date(event.startTime.getTime() + durationInMillis);
}
function getTzId(prop) {
    var tzId = null;
    var tzIdValue = prop.params["TZID"];
    if (tzIdValue) {
        if (luxon_1.IANAZone.isValidZone(tzIdValue)) {
            tzId = tzIdValue;
        }
        else if (tzIdValue in WindowsZones_1["default"]) {
            tzId = WindowsZones_1["default"][tzIdValue];
        }
    }
    return tzId;
}
function oneDayDurationEnd(startTime, allDay, tzId, zone) {
    return luxon_1.DateTime.fromJSDate(startTime, {
        zone: allDay ? "UTC" : tzId || zone
    })
        .plus({
        day: 1
    })
        .toJSDate();
}
var MAILTO_PREFIX_REGEX = /^mailto:(.*)/i;
function parseMailtoValue(value) {
    var match = value.match(MAILTO_PREFIX_REGEX);
    return match && match[1];
}
exports.calendarAttendeeStatusToParstat = (_a = {},
    // WE map ADDED to NEEDS-ACTION for sending out invites
    _a[TutanotaConstants_1.CalendarAttendeeStatus.ADDED] = "NEEDS-ACTION",
    _a[TutanotaConstants_1.CalendarAttendeeStatus.NEEDS_ACTION] = "NEEDS-ACTION",
    _a[TutanotaConstants_1.CalendarAttendeeStatus.ACCEPTED] = "ACCEPTED",
    _a[TutanotaConstants_1.CalendarAttendeeStatus.DECLINED] = "DECLINED",
    _a[TutanotaConstants_1.CalendarAttendeeStatus.TENTATIVE] = "TENTATIVE",
    _a);
var parstatToCalendarAttendeeStatus = (0, TutanotaConstants_1.reverse)(exports.calendarAttendeeStatusToParstat);
function parseCalendarEvents(icalObject, zone) {
    var methodProp = icalObject.properties.find(function (prop) { return prop.name === "METHOD"; });
    var method = methodProp ? methodProp.value : TutanotaConstants_1.CalendarMethod.PUBLISH;
    var eventObjects = icalObject.children.filter(function (obj) { return obj.type === "VEVENT"; });
    var contents = eventObjects.map(function (eventObj, index) {
        var event = (0, TypeRefs_js_1.createCalendarEvent)();
        var startProp = getProp(eventObj, "DTSTART");
        if (typeof startProp.value !== "string")
            throw new ParserCombinator_1.ParserError("DTSTART value is not a string");
        var tzId = getTzId(startProp);
        var _a = parseTime(startProp.value, tzId !== null && tzId !== void 0 ? tzId : undefined), startTime = _a.date, allDay = _a.allDay;
        event.startTime = startTime;
        var endProp = eventObj.properties.find(function (p) { return p.name === "DTEND"; });
        if (endProp) {
            if (typeof endProp.value !== "string")
                throw new ParserCombinator_1.ParserError("DTEND value is not a string");
            var endTzId = getTzId(endProp);
            var parsedEndTime = parseTime(endProp.value, typeof endTzId === "string" ? endTzId : undefined);
            event.endTime = parsedEndTime.date;
            if (event.endTime <= event.startTime) {
                // as per RFC, these are _technically_ illegal: https://tools.ietf.org/html/rfc5545#section-3.8.2.2
                if (allDay) {
                    // if the startTime indicates an all-day event, we want to preserve that.
                    // we'll assume a 1-day duration.
                    event.endTime = luxon_1.DateTime.fromJSDate(event.startTime)
                        .plus({ day: 1 })
                        .toJSDate();
                }
                else {
                    // we make a best effort to deliver alarms at the set interval before startTime and set the
                    // event duration to be 1 second
                    // as of now:
                    // * this displays as ending the same minute it starts in the tutanota calendar
                    // * gets exported with a duration of 1 second
                    event.endTime = luxon_1.DateTime.fromJSDate(event.startTime)
                        .plus({ second: 1 })
                        .toJSDate();
                }
            }
        }
        else {
            var durationProp = eventObj.properties.find(function (p) { return p.name === "DURATION"; });
            if (durationProp) {
                parseEventDuration(durationProp, event);
            }
            else {
                // >For cases where a "VEVENT" calendar component specifies a "DTSTART" property with a DATE value type but no "DTEND" nor
                // "DURATION" property, the event's duration is taken to be one day.
                //
                // https://tools.ietf.org/html/rfc5545#section-3.6.1
                event.endTime = oneDayDurationEnd(startTime, allDay, tzId, zone);
            }
        }
        var summaryProp = eventObj.properties.find(function (p) { return p.name === "SUMMARY"; });
        if (summaryProp && typeof summaryProp.value === "string") {
            event.summary = summaryProp.value;
        }
        var locationProp = eventObj.properties.find(function (p) { return p.name === "LOCATION"; });
        if (locationProp) {
            if (typeof locationProp.value !== "string")
                throw new ParserCombinator_1.ParserError("LOCATION value is not a string");
            event.location = locationProp.value;
        }
        var rruleProp = eventObj.properties.find(function (p) { return p.name === "RRULE"; });
        if (rruleProp != null) {
            event.repeatRule = parseRrule(rruleProp, tzId);
        }
        var descriptionProp = eventObj.properties.find(function (p) { return p.name === "DESCRIPTION"; });
        if (descriptionProp) {
            if (typeof descriptionProp.value !== "string")
                throw new ParserCombinator_1.ParserError("DESCRIPTION value is not a string");
            event.description = descriptionProp.value;
        }
        var sequenceProp = eventObj.properties.find(function (p) { return p.name === "SEQUENCE"; });
        if (sequenceProp) {
            var sequenceNumber = (0, tutanota_utils_1.filterInt)(sequenceProp.value);
            if (Number.isNaN(sequenceNumber)) {
                throw new ParserCombinator_1.ParserError("SEQUENCE value is not a number");
            }
            // Convert it back to NumberString. Could use original one but this feels more robust.
            event.sequence = String(sequenceNumber);
        }
        var alarms = [];
        eventObj.children.forEach(function (alarmChild) {
            if (alarmChild.type === "VALARM") {
                var newAlarm = parseAlarm(alarmChild, event);
                if (newAlarm)
                    alarms.push(newAlarm);
            }
        });
        var attendees = [];
        eventObj.properties.forEach(function (property) {
            if (property.name === "ATTENDEE") {
                var attendeeAddress = parseMailtoValue(property.value);
                if (!attendeeAddress || !(0, FormatValidator_1.isMailAddress)(attendeeAddress, false)) {
                    console.log("attendee has no address or address is invalid, ignoring: ", attendeeAddress);
                    return;
                }
                var partStatString = property.params["PARTSTAT"];
                var status_1 = partStatString ? parstatToCalendarAttendeeStatus[partStatString] : TutanotaConstants_1.CalendarAttendeeStatus.NEEDS_ACTION;
                if (!status_1) {
                    console.log("attendee has invalid partsat: ".concat(partStatString, ", ignoring"));
                    return;
                }
                attendees.push((0, TypeRefs_js_4.createCalendarEventAttendee)({
                    address: (0, TypeRefs_js_5.createEncryptedMailAddress)({
                        address: attendeeAddress,
                        name: property.params["CN"] || ""
                    }),
                    status: status_1
                }));
            }
        });
        event.attendees = attendees;
        var organizerProp = eventObj.properties.find(function (p) { return p.name === "ORGANIZER"; });
        if (organizerProp) {
            var organizerAddress = parseMailtoValue(organizerProp.value);
            if (organizerAddress && (0, FormatValidator_1.isMailAddress)(organizerAddress, false)) {
                event.organizer = (0, TypeRefs_js_5.createEncryptedMailAddress)({
                    address: organizerAddress,
                    name: organizerProp.params["name"] || ""
                });
            }
            else {
                console.log("organizer has no address or address is invalid, ignoring: ", organizerAddress);
            }
        }
        try {
            event.uid = getPropStringValue(eventObj, "UID");
        }
        catch (e) {
            if (e instanceof ParserCombinator_1.ParserError) {
                // Also parse event and create new UID if none is set
                event.uid = "import-".concat(Date.now(), "-").concat(index, "@tutanota.com");
            }
            else {
                throw e;
            }
        }
        return {
            event: event,
            alarms: alarms
        };
    });
    return {
        method: method,
        contents: contents
    };
}
exports.parseCalendarEvents = parseCalendarEvents;
function icalFrequencyToRepeatPeriod(value) {
    var convertedValue = {
        DAILY: TutanotaConstants_1.RepeatPeriod.DAILY,
        WEEKLY: TutanotaConstants_1.RepeatPeriod.WEEKLY,
        MONTHLY: TutanotaConstants_1.RepeatPeriod.MONTHLY,
        YEARLY: TutanotaConstants_1.RepeatPeriod.ANNUALLY
    }[value];
    if (convertedValue == null) {
        throw new ParserCombinator_1.ParserError("Invalid frequency: " + value);
    }
    return convertedValue;
}
function repeatPeriodToIcalFrequency(repeatPeriod) {
    var _a;
    // Separate variable to declare mapping type
    var mapping = (_a = {},
        _a[TutanotaConstants_1.RepeatPeriod.DAILY] = "DAILY",
        _a[TutanotaConstants_1.RepeatPeriod.WEEKLY] = "WEEKLY",
        _a[TutanotaConstants_1.RepeatPeriod.MONTHLY] = "MONTHLY",
        _a[TutanotaConstants_1.RepeatPeriod.ANNUALLY] = "YEARLY",
        _a);
    return mapping[repeatPeriod];
}
exports.repeatPeriodToIcalFrequency = repeatPeriodToIcalFrequency;
function parseTimeIntoComponents(value) {
    var trimmedValue = value.trim();
    if (/[0-9]{8}T[0-9]{6}Z/.test(trimmedValue)) {
        // date with time in UTC
        var _a = parseDateString(trimmedValue), year = _a.year, month = _a.month, day = _a.day;
        var hour = parseInt(trimmedValue.slice(9, 11));
        var minute = parseInt(trimmedValue.slice(11, 13));
        return {
            year: year,
            month: month,
            day: day,
            hour: hour,
            minute: minute,
            zone: "UTC"
        };
    }
    else if (/[0-9]{8}T[0-9]{6}/.test(trimmedValue)) {
        // date with time in local timezone
        var _b = parseDateString(trimmedValue), year = _b.year, month = _b.month, day = _b.day;
        var hour = parseInt(trimmedValue.slice(9, 11));
        var minute = parseInt(trimmedValue.slice(11, 13));
        return {
            year: year,
            month: month,
            day: day,
            hour: hour,
            minute: minute
        };
    }
    else if (/[0-9]{8}/.test(trimmedValue)) {
        // all day events
        return Object.assign({}, parseDateString(trimmedValue));
    }
    else {
        throw new ParserCombinator_1.ParserError("Failed to parse time: " + trimmedValue);
    }
}
exports.parseTimeIntoComponents = parseTimeIntoComponents;
function parseUntilRruleTime(value, zone) {
    var _a;
    var components = parseTimeIntoComponents(value);
    // rrule until is inclusive in ical but exclusive in Tutanota
    var filledComponents = Object.assign({}, components, {
        zone: "minute" in components ? zone : "UTC"
    });
    var luxonDate = luxon_1.DateTime.fromObject(filledComponents);
    var startOfNextDay = luxonDate
        .plus({
        day: 1
    })
        .startOf("day");
    return toValidJSDate(startOfNextDay, value, (_a = components.zone) !== null && _a !== void 0 ? _a : null);
}
exports.parseUntilRruleTime = parseUntilRruleTime;
/**
 * parse a ical time string and return a JS Date object along with a flag that determines
 * whether the time should be considered part of an all-day event
 * @param value {string} the time string to be parsed
 * @param zone {string} the time zone to use
 */
function parseTime(value, zone) {
    var components = parseTimeIntoComponents(value);
    var allDay = !("minute" in components);
    var filledComponents = Object.assign({}, allDay
        ? {
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
            zone: "UTC"
        }
        : {
            zone: zone
        }, components);
    return {
        date: toValidJSDate(luxon_1.DateTime.fromObject(filledComponents), value, zone !== null && zone !== void 0 ? zone : null),
        allDay: allDay
    };
}
exports.parseTime = parseTime;
function toValidJSDate(dateTime, value, zone) {
    if (!dateTime.isValid) {
        throw new ParserCombinator_1.ParserError("Date value ".concat(value, " is invalid in zone ").concat(String(zone)));
    }
    return dateTime.toJSDate();
}
function parsePropertyName(iterator) {
    var text = "";
    while (iterator.peek() && /[a-zA-Z0-9-_]/.test(iterator.peek())) {
        text += (0, tutanota_utils_1.neverNull)(iterator.next().value);
    }
    if (text === "") {
        throw new ParserCombinator_1.ParserError("could not parse property name: " + iterator.peek());
    }
    return text;
}
var secondDurationParser = (0, ParserCombinator_1.combineParsers)(ParserCombinator_1.numberParser, (0, ParserCombinator_1.makeCharacterParser)("S"));
var minuteDurationParser = (0, ParserCombinator_1.combineParsers)(ParserCombinator_1.numberParser, (0, ParserCombinator_1.makeCharacterParser)("M"), (0, ParserCombinator_1.maybeParse)(secondDurationParser));
var hourDurationParser = (0, ParserCombinator_1.combineParsers)(ParserCombinator_1.numberParser, (0, ParserCombinator_1.makeCharacterParser)("H"), (0, ParserCombinator_1.maybeParse)(minuteDurationParser));
var durationTimeParser = (0, ParserCombinator_1.mapParser)((0, ParserCombinator_1.combineParsers)((0, ParserCombinator_1.makeCharacterParser)("T"), (0, ParserCombinator_1.makeEitherParser)(hourDurationParser, (0, ParserCombinator_1.makeEitherParser)(minuteDurationParser, secondDurationParser))), function (_a) {
    var t = _a[0], value = _a[1];
    var minuteTuple, secondTuple;
    var hour, minute, second;
    if (value[1] === "H") {
        hour = value[0];
        minuteTuple = (0, tutanota_utils_1.downcast)(value)[2];
    }
    else if (value[1] === "M") {
        minuteTuple = value;
    }
    else if (value[1] === "S") {
        secondTuple = value;
    }
    if (minuteTuple) {
        minute = minuteTuple[0];
        secondTuple = (0, tutanota_utils_1.downcast)(minuteTuple)[2];
    }
    if (secondTuple) {
        second = secondTuple[0];
    }
    return {
        type: "time",
        hour: hour,
        minute: minute,
        second: second
    };
});
var durationDayParser = (0, ParserCombinator_1.combineParsers)(ParserCombinator_1.numberParser, (0, ParserCombinator_1.makeCharacterParser)("D"));
var durationWeekParser = (0, ParserCombinator_1.mapParser)((0, ParserCombinator_1.combineParsers)(ParserCombinator_1.numberParser, (0, ParserCombinator_1.makeCharacterParser)("W")), function (parsed) {
    return {
        type: "week",
        week: parsed[0]
    };
});
var durationDateParser = (0, ParserCombinator_1.mapParser)((0, ParserCombinator_1.combineParsers)(durationDayParser, (0, ParserCombinator_1.maybeParse)(durationTimeParser)), function (parsed) {
    return {
        type: "date",
        day: parsed[0][0],
        time: parsed[1]
    };
});
var durationParser = (0, ParserCombinator_1.mapParser)((0, ParserCombinator_1.combineParsers)((0, ParserCombinator_1.maybeParse)((0, ParserCombinator_1.makeEitherParser)((0, ParserCombinator_1.makeCharacterParser)("+"), (0, ParserCombinator_1.makeCharacterParser)("-"))), (0, ParserCombinator_1.makeCharacterParser)("P"), (0, ParserCombinator_1.maybeParse)((0, ParserCombinator_1.makeEitherParser)(durationDateParser, (0, ParserCombinator_1.makeEitherParser)(durationTimeParser, durationWeekParser)))), function (_a) {
    var sign = _a[0], p = _a[1], durationValue = _a[2];
    var positive = sign !== "-";
    var day, timeDuration, week, hour, minute;
    if (durationValue) {
        switch (durationValue.type) {
            case "date":
                day = durationValue.day;
                timeDuration = durationValue.time;
                break;
            case "time":
                timeDuration = durationValue;
                break;
            case "week":
                week = durationValue.week;
        }
        if (timeDuration) {
            hour = timeDuration.hour;
            minute = timeDuration.minute;
        }
    }
    return {
        positive: positive,
        day: day,
        hour: hour,
        minute: minute,
        week: week
    };
});
function parseDuration(value) {
    var iterator = new ParserCombinator_1.StringIterator(value);
    var duration = durationParser(iterator);
    if (iterator.peek()) {
        throw new ParserCombinator_1.ParserError("Could not parse duration completely");
    }
    return duration;
}
exports.parseDuration = parseDuration;
