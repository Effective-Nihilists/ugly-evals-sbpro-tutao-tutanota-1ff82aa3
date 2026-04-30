"use strict";
exports.__esModule = true;
exports.calendarAttendeeStatusSymbol = exports.formatEventDuration = exports.getCalendarMonth = exports.findNextAlarmOccurrence = exports.addDaysForLongEvent = exports.addDaysForRecurringEvent = exports.getRepeatEndTime = exports.addDaysForEvent = exports.checkEventValidity = exports.hasAlarmsForTheUser = exports.isSameEvent = exports.assignEventId = exports.isLongEvent = exports.getAllDayDateUTCFromZone = exports.getEventStart = exports.getEventEnd = exports.getWeekNumber = exports.getStartOfTheWeekOffsetForUser = exports.getStartOfTheWeekOffset = exports.getRangeOfDays = exports.getStartOfWeek = exports.getEventColor = exports.getDiffInHours = exports.getDiffInDays = exports.expandEvent = exports.formatEventTime = exports.layOutEvents = exports.colorForBg = exports.createRepeatRuleWithValues = exports.DateProviderImpl = exports.getTimeZone = exports.getValidTimeZone = exports.getEventStartByTimes = exports.incrementByRepeatPeriod = exports.getAllDayDateForTimezone = exports.calculateAlarmTime = exports.getStartOfNextDayWithZone = exports.getStartOfDayWithZone = exports.getMonth = exports.shouldDefaultToAmPmTimeFormat = exports.timeStringInZone = exports.timeString = exports.generateUid = exports.eventEndsAfterOrOn = exports.eventEndsAfterDay = exports.eventStartsAfter = exports.eventEndsBefore = exports.eventStartsBefore = exports.TEMPORARY_EVENT_OPACITY = exports.CALENDAR_EVENT_HEIGHT = void 0;
exports.getFirstDayOfMonth = exports.createRepeatRuleEndTypeValues = exports.createRepeatRuleFrequencyValues = exports.isEventBetweenDays = exports.combineDateWithTime = exports.getTimeTextFormatForLongEvent = exports.getDateIndicator = exports.DEFAULT_HOUR_OF_DAY = exports.prepareCalendarDescription = exports.findPrivateCalendar = exports.getNextHalfHour = exports.incrementSequence = void 0;
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var TutanotaConstants_1 = require("../../api/common/TutanotaConstants");
var luxon_1 = require("luxon");
var TypeRefs_js_1 = require("../../api/entities/tutanota/TypeRefs.js");
var CommonCalendarUtils_1 = require("../../api/common/utils/CommonCalendarUtils");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var Formatter_1 = require("../../misc/Formatter");
var size_1 = require("../../gui/size");
var Color_1 = require("../../gui/base/Color");
var EntityUtils_1 = require("../../api/common/utils/EntityUtils");
var Env_1 = require("../../api/common/Env");
var DateUtils_1 = require("@tutao/tutanota-utils/dist/DateUtils");
(0, Env_1.assertMainOrNode)();
exports.CALENDAR_EVENT_HEIGHT = size_1.size.calendar_line_height + 2;
exports.TEMPORARY_EVENT_OPACITY = 0.7;
function eventStartsBefore(currentDate, zone, event) {
    return getEventStart(event, zone).getTime() < currentDate.getTime();
}
exports.eventStartsBefore = eventStartsBefore;
function eventEndsBefore(date, zone, event) {
    return getEventEnd(event, zone).getTime() < date.getTime();
}
exports.eventEndsBefore = eventEndsBefore;
function eventStartsAfter(date, zone, event) {
    return getEventStart(event, zone).getTime() > date.getTime();
}
exports.eventStartsAfter = eventStartsAfter;
function eventEndsAfterDay(currentDate, zone, event) {
    return getEventEnd(event, zone).getTime() > getStartOfNextDayWithZone(currentDate, zone).getTime();
}
exports.eventEndsAfterDay = eventEndsAfterDay;
function eventEndsAfterOrOn(currentDate, zone, event) {
    return getEventEnd(event, zone).getTime() >= getStartOfNextDayWithZone(currentDate, zone).getTime();
}
exports.eventEndsAfterOrOn = eventEndsAfterOrOn;
function generateUid(groupId, timestamp) {
    return "".concat(groupId).concat(timestamp, "@tutanota.com");
}
exports.generateUid = generateUid;
function timeString(date, amPm) {
    return (0, Formatter_1.timeStringFromParts)(date.getHours(), date.getMinutes(), amPm);
}
exports.timeString = timeString;
function timeStringInZone(date, amPm, zone) {
    var _a = luxon_1.DateTime.fromJSDate(date, {
        zone: zone
    }), hour = _a.hour, minute = _a.minute;
    return (0, Formatter_1.timeStringFromParts)(hour, minute, amPm);
}
exports.timeStringInZone = timeStringInZone;
function shouldDefaultToAmPmTimeFormat() {
    return LanguageViewModel_1.lang.code === "en";
}
exports.shouldDefaultToAmPmTimeFormat = shouldDefaultToAmPmTimeFormat;
function getMonth(date, zone) {
    var startDateTime = luxon_1.DateTime.fromJSDate(date, {
        zone: zone
    }).set({
        day: 1,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0
    });
    var start = startDateTime.toJSDate();
    var end = startDateTime
        .plus({
        month: 1
    })
        .toJSDate();
    return {
        start: start,
        end: end
    };
}
exports.getMonth = getMonth;
/**
 * Provides a date representing the beginning of the given date in local time.
 */
function getStartOfDayWithZone(date, zone) {
    return luxon_1.DateTime.fromJSDate(date, {
        zone: zone
    })
        .set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0
    })
        .toJSDate();
}
exports.getStartOfDayWithZone = getStartOfDayWithZone;
function getStartOfNextDayWithZone(date, zone) {
    return luxon_1.DateTime.fromJSDate(date, {
        zone: zone
    })
        .set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0
    })
        .plus({
        day: 1
    })
        .toJSDate();
}
exports.getStartOfNextDayWithZone = getStartOfNextDayWithZone;
function calculateAlarmTime(date, interval, ianaTimeZone) {
    var diff;
    switch (interval) {
        case "5M" /* AlarmInterval.FIVE_MINUTES */:
            diff = {
                minutes: 5
            };
            break;
        case "10M" /* AlarmInterval.TEN_MINUTES */:
            diff = {
                minutes: 10
            };
            break;
        case "30M" /* AlarmInterval.THIRTY_MINUTES */:
            diff = {
                minutes: 30
            };
            break;
        case "1H" /* AlarmInterval.ONE_HOUR */:
            diff = {
                hours: 1
            };
            break;
        case "1D" /* AlarmInterval.ONE_DAY */:
            diff = {
                days: 1
            };
            break;
        case "2D" /* AlarmInterval.TWO_DAYS */:
            diff = {
                days: 2
            };
            break;
        case "3D" /* AlarmInterval.THREE_DAYS */:
            diff = {
                days: 3
            };
            break;
        case "1W" /* AlarmInterval.ONE_WEEK */:
            diff = {
                weeks: 1
            };
            break;
        default:
            diff = {
                minutes: 5
            };
    }
    return luxon_1.DateTime.fromJSDate(date, {
        zone: ianaTimeZone
    })
        .minus(diff)
        .toJSDate();
}
exports.calculateAlarmTime = calculateAlarmTime;
function getAllDayDateForTimezone(utcDate, timeZone) {
    return luxon_1.DateTime.fromObject({
        year: utcDate.getUTCFullYear(),
        month: utcDate.getUTCMonth() + 1,
        day: utcDate.getUTCDate(),
        zone: timeZone
    }).toJSDate();
}
exports.getAllDayDateForTimezone = getAllDayDateForTimezone;
function incrementByRepeatPeriod(date, repeatPeriod, interval, ianaTimeZone) {
    switch (repeatPeriod) {
        case TutanotaConstants_1.RepeatPeriod.DAILY:
            return luxon_1.DateTime.fromJSDate(date, {
                zone: ianaTimeZone
            })
                .plus({
                days: interval
            })
                .toJSDate();
        case TutanotaConstants_1.RepeatPeriod.WEEKLY:
            return luxon_1.DateTime.fromJSDate(date, {
                zone: ianaTimeZone
            })
                .plus({
                weeks: interval
            })
                .toJSDate();
        case TutanotaConstants_1.RepeatPeriod.MONTHLY:
            return luxon_1.DateTime.fromJSDate(date, {
                zone: ianaTimeZone
            })
                .plus({
                months: interval
            })
                .toJSDate();
        case TutanotaConstants_1.RepeatPeriod.ANNUALLY:
            return luxon_1.DateTime.fromJSDate(date, {
                zone: ianaTimeZone
            })
                .plus({
                years: interval
            })
                .toJSDate();
        default:
            throw new Error("Unknown repeat period");
    }
}
exports.incrementByRepeatPeriod = incrementByRepeatPeriod;
function getEventStartByTimes(startTime, endTime, timeZone) {
    if ((0, CommonCalendarUtils_1.isAllDayEventByTimes)(startTime, endTime)) {
        return getAllDayDateForTimezone(startTime, timeZone);
    }
    else {
        return startTime;
    }
}
exports.getEventStartByTimes = getEventStartByTimes;
function getValidTimeZone(zone, fallback) {
    if (luxon_1.IANAZone.isValidZone(zone)) {
        return zone;
    }
    else {
        if (fallback && luxon_1.IANAZone.isValidZone(fallback)) {
            console.warn("Time zone ".concat(zone, " is not valid, falling back to ").concat(fallback));
            return fallback;
        }
        else {
            var actualFallback = luxon_1.FixedOffsetZone.instance(new Date().getTimezoneOffset()).name;
            console.warn("Fallback time zone ".concat(zone, " is not valid, falling back to ").concat(actualFallback));
            return actualFallback;
        }
    }
}
exports.getValidTimeZone = getValidTimeZone;
function getTimeZone() {
    return luxon_1.DateTime.local().zoneName;
}
exports.getTimeZone = getTimeZone;
var DateProviderImpl = /** @class */ (function () {
    function DateProviderImpl() {
    }
    DateProviderImpl.prototype.now = function () {
        return Date.now();
    };
    DateProviderImpl.prototype.timeZone = function () {
        return getTimeZone();
    };
    return DateProviderImpl;
}());
exports.DateProviderImpl = DateProviderImpl;
function createRepeatRuleWithValues(frequency, interval) {
    var rule = (0, TypeRefs_js_1.createCalendarRepeatRule)();
    rule.timeZone = getTimeZone();
    rule.frequency = frequency;
    rule.interval = String(interval);
    return rule;
}
exports.createRepeatRuleWithValues = createRepeatRuleWithValues;
function colorForBg(color) {
    return (0, Color_1.isColorLight)(color) ? "black" : "white";
}
exports.colorForBg = colorForBg;
function layOutEvents(events, zone, renderer, handleAsAllDay) {
    events.sort(function (e1, e2) {
        var e1Start = getEventStart(e1, zone);
        var e2Start = getEventStart(e2, zone);
        if (e1Start < e2Start)
            return -1;
        if (e1Start > e2Start)
            return 1;
        var e1End = getEventEnd(e1, zone);
        var e2End = getEventEnd(e2, zone);
        if (e1End < e2End)
            return -1;
        if (e1End > e2End)
            return 1;
        return 0;
    });
    var lastEventEnding = null;
    var columns = [];
    var children = [];
    // Cache for calculation events
    var calcEvents = new Map();
    events.forEach(function (e) {
        var calcEvent = (0, tutanota_utils_1.getFromMap)(calcEvents, e, function () { return getCalculationEvent(e, zone, handleAsAllDay); });
        // Check if a new event group needs to be started
        if (lastEventEnding != null && lastEventEnding <= calcEvent.startTime.getTime()) {
            // The latest event is later than any of the event in the
            // current group. There is no overlap. Output the current
            // event group and start a new event group.
            children.push.apply(children, renderer(columns));
            columns = []; // This starts new event group.
            lastEventEnding = null;
        }
        // Try to place the event inside the existing columns
        var placed = false;
        var _loop_1 = function (i) {
            var col = columns[i];
            var lastEvent = col[col.length - 1];
            var lastCalcEvent = (0, tutanota_utils_1.getFromMap)(calcEvents, lastEvent, function () { return getCalculationEvent(lastEvent, zone, handleAsAllDay); });
            if (!collidesWith(lastCalcEvent, calcEvent)) {
                col.push(e); // push real event here not calc event
                placed = true;
                return "break";
            }
        };
        for (var i = 0; i < columns.length; i++) {
            var state_1 = _loop_1(i);
            if (state_1 === "break")
                break;
        }
        // It was not possible to place the event. Add a new column
        // for the current event group.
        if (!placed) {
            columns.push([e]);
        }
        // Remember the latest event end time of the current group.
        // This is later used to determine if a new groups starts.
        if (lastEventEnding == null || lastEventEnding < calcEvent.endTime.getTime()) {
            lastEventEnding = calcEvent.endTime.getTime();
        }
    });
    children.push.apply(children, renderer(columns));
    return children;
}
exports.layOutEvents = layOutEvents;
function getCalculationEvent(event, zone, handleAsAllDay) {
    if (handleAsAllDay) {
        var calcEvent = (0, tutanota_utils_1.clone)(event);
        if ((0, CommonCalendarUtils_1.isAllDayEvent)(event)) {
            calcEvent.startTime = getAllDayDateForTimezone(event.startTime, zone);
            calcEvent.endTime = getAllDayDateForTimezone(event.endTime, zone);
        }
        else {
            calcEvent.startTime = getStartOfDayWithZone(event.startTime, zone);
            calcEvent.endTime = getStartOfNextDayWithZone(event.endTime, zone);
        }
        return calcEvent;
    }
    else {
        return event;
    }
}
function collidesWith(a, b) {
    return a.endTime.getTime() > b.startTime.getTime() && a.startTime.getTime() < b.endTime.getTime();
}
function formatEventTime(event, showTime) {
    switch (showTime) {
        case "startTime" /* EventTextTimeOption.START_TIME */:
            return (0, Formatter_1.formatTime)(event.startTime);
        case "endTime" /* EventTextTimeOption.END_TIME */:
            return " - ".concat((0, Formatter_1.formatTime)(event.endTime));
        case "startAndEndTime" /* EventTextTimeOption.START_END_TIME */:
            return "".concat((0, Formatter_1.formatTime)(event.startTime), " - ").concat((0, Formatter_1.formatTime)(event.endTime));
        default:
            throw new Error("Unknown time option " + showTime);
    }
}
exports.formatEventTime = formatEventTime;
function expandEvent(ev, columnIndex, columns) {
    var colSpan = 1;
    for (var i = columnIndex + 1; i < columns.length; i++) {
        var col = columns[i];
        for (var j = 0; j < col.length; j++) {
            var ev1 = col[j];
            if (collidesWith(ev, ev1)) {
                return colSpan;
            }
        }
        colSpan++;
    }
    return colSpan;
}
exports.expandEvent = expandEvent;
/**
 * Result is positive or 0 if b > a, result is negative or 0 otherwise
 */
function getDiffInDays(a, b) {
    // discard the time and time-zone information
    return Math.floor(luxon_1.DateTime.fromJSDate(b).diff(luxon_1.DateTime.fromJSDate(a), "day").days);
}
exports.getDiffInDays = getDiffInDays;
/**
 * Result is positive or 0 if b > a, result is negative or 0 otherwise
 */
function getDiffInHours(a, b) {
    // discard the time and time-zone information
    return Math.floor(luxon_1.DateTime.fromJSDate(b).diff(luxon_1.DateTime.fromJSDate(a), "hours").hours);
}
exports.getDiffInHours = getDiffInHours;
function getEventColor(event, groupColors) {
    var _a;
    return (_a = (event._ownerGroup && groupColors.get(event._ownerGroup))) !== null && _a !== void 0 ? _a : TutanotaConstants_1.defaultCalendarColor;
}
exports.getEventColor = getEventColor;
function getStartOfWeek(date, firstDayOfWeekFromOffset) {
    var firstDay;
    if (firstDayOfWeekFromOffset > date.getDay()) {
        firstDay = date.getDay() + 7 - firstDayOfWeekFromOffset;
    }
    else {
        firstDay = date.getDay() - firstDayOfWeekFromOffset;
    }
    return (0, tutanota_utils_1.incrementDate)((0, tutanota_utils_1.getStartOfDay)(date), -firstDay);
}
exports.getStartOfWeek = getStartOfWeek;
function getRangeOfDays(startDay, numDays) {
    var calculationDate = startDay;
    var days = [];
    for (var i = 0; i < numDays; i++) {
        days.push(calculationDate);
        calculationDate = (0, tutanota_utils_1.incrementDate)(new Date(calculationDate), 1);
    }
    return days;
}
exports.getRangeOfDays = getRangeOfDays;
/** Start of the week offset relative to Sunday (forward). */
function getStartOfTheWeekOffset(weekStart) {
    switch (weekStart) {
        case "1" /* WeekStart.SUNDAY */:
            return 0;
        case "2" /* WeekStart.SATURDAY */:
            return 6;
        case "0" /* WeekStart.MONDAY */:
        default:
            return 1;
    }
}
exports.getStartOfTheWeekOffset = getStartOfTheWeekOffset;
/** {@see getStartOfTheWeekOffset} */
function getStartOfTheWeekOffsetForUser(userSettingsGroupRoot) {
    return getStartOfTheWeekOffset((0, TutanotaConstants_1.getWeekStart)(userSettingsGroupRoot));
}
exports.getStartOfTheWeekOffsetForUser = getStartOfTheWeekOffsetForUser;
function getWeekNumber(startOfTheWeek) {
    // Currently it doesn't support US-based week numbering system with partial weeks.
    return luxon_1.DateTime.fromJSDate(startOfTheWeek).weekNumber;
}
exports.getWeekNumber = getWeekNumber;
function getEventEnd(event, timeZone) {
    if ((0, CommonCalendarUtils_1.isAllDayEvent)(event)) {
        return getAllDayDateForTimezone(event.endTime, timeZone);
    }
    else {
        return event.endTime;
    }
}
exports.getEventEnd = getEventEnd;
function getEventStart(event, timeZone) {
    return getEventStartByTimes(event.startTime, event.endTime, timeZone);
}
exports.getEventStart = getEventStart;
function getAllDayDateUTCFromZone(date, timeZone) {
    return luxon_1.DateTime.fromJSDate(date, {
        zone: timeZone
    })
        .setZone("utc", {
        keepLocalTime: true
    })
        .toJSDate();
}
exports.getAllDayDateUTCFromZone = getAllDayDateUTCFromZone;
function isLongEvent(event, zone) {
    // long events are longer than the event ID randomization range. we need to distinguish them
    // to be able to still load and display the ones overlapping the query range even though their
    // id might not be contained in the query timerange +- randomization range
    return getEventEnd(event, zone).getTime() - getEventStart(event, zone).getTime() > CommonCalendarUtils_1.DAYS_SHIFTED_MS;
}
exports.isLongEvent = isLongEvent;
function assignEventId(event, zone, groupRoot) {
    var listId = event.repeatRule || isLongEvent(event, zone) ? groupRoot.longEvents : groupRoot.shortEvents;
    event._id = [listId, (0, CommonCalendarUtils_1.generateEventElementId)(event.startTime.getTime())];
}
exports.assignEventId = assignEventId;
function isSameEvent(left, right) {
    // in addition to the id we compare the start time equality to be able to distinguish repeating events. They have the same id but different start time.
    return (0, EntityUtils_1.isSameId)(left._id, right._id) && left.startTime.getTime() === right.startTime.getTime();
}
exports.isSameEvent = isSameEvent;
function hasAlarmsForTheUser(user, event) {
    var useAlarmList = (0, tutanota_utils_1.neverNull)(user.alarmInfoList).alarms;
    return event.alarmInfos.some(function (_a) {
        var listId = _a[0];
        return (0, EntityUtils_1.isSameId)(listId, useAlarmList);
    });
}
exports.hasAlarmsForTheUser = hasAlarmsForTheUser;
function eventComparator(l, r) {
    return l.startTime.getTime() - r.startTime.getTime();
}
function assertDateIsValid(date) {
    if (!(0, tutanota_utils_1.isValidDate)(date)) {
        throw new Error("Date is invalid!");
    }
}
/**
 * check if a given event should be allowed to be created in a tutanota calendar.
 * @param event
 * @returns Enum describing the reason to reject the event, if any.
 */
function checkEventValidity(event) {
    if (!(0, tutanota_utils_1.isValidDate)(event.startTime) || !(0, tutanota_utils_1.isValidDate)(event.endTime)) {
        return 0 /* CalendarEventValidity.InvalidContainsInvalidDate */;
    }
    else if (event.endTime.getTime() <= event.startTime.getTime()) {
        return 1 /* CalendarEventValidity.InvalidEndBeforeStart */;
    }
    else if (event.startTime.getFullYear() < DateUtils_1.TIMESTAMP_ZERO_YEAR) {
        return 2 /* CalendarEventValidity.InvalidPre1970 */;
    }
    return 3 /* CalendarEventValidity.Valid */;
}
exports.checkEventValidity = checkEventValidity;
var MAX_EVENT_ITERATIONS = 10000;
function addDaysForEvent(events, event, month, zone) {
    var _a, _b;
    if (zone === void 0) { zone = getTimeZone(); }
    var eventStart = getEventStart(event, zone);
    var calculationDate = getStartOfDayWithZone(eventStart, zone);
    var eventEndDate = getEventEnd(event, zone);
    // only add events when the start time is inside this month
    if (eventStart.getTime() < month.start.getTime() || eventStart.getTime() >= month.end.getTime()) {
        return;
    }
    var iterations = 0;
    // if start time is in current month then also add events for subsequent months until event ends
    while (calculationDate.getTime() < eventEndDate.getTime()) {
        assertDateIsValid(calculationDate);
        if (iterations > MAX_EVENT_ITERATIONS) {
            throw new Error("Run into the infinite loop, addDaysForEvent");
        }
        if (eventEndDate.getTime() >= month.start.getTime()) {
            (0, tutanota_utils_1.insertIntoSortedArray)(event, (0, tutanota_utils_1.getFromMap)(events, calculationDate.getTime(), function () { return []; }), eventComparator, isSameEvent);
        }
        calculationDate = incrementByRepeatPeriod(calculationDate, TutanotaConstants_1.RepeatPeriod.DAILY, 1, zone);
        iterations++;
    }
    // If the duration of the original event was reduced, we also have delete the remaining days of the original event
    var remainingDaysForExistingEvent = (_b = (_a = events.get(calculationDate.getTime())) === null || _a === void 0 ? void 0 : _a.find(function (e) { return isSameEvent(e, event); })) !== null && _b !== void 0 ? _b : null;
    if (remainingDaysForExistingEvent) {
        var existingEventEndDate = getEventEnd(remainingDaysForExistingEvent, zone);
        if (existingEventEndDate.getTime() > eventEndDate.getTime()) {
            while (calculationDate.getTime() < existingEventEndDate.getTime()) {
                assertDateIsValid(calculationDate);
                if (iterations > MAX_EVENT_ITERATIONS) {
                    throw new Error("Run into the infinite loop, addDaysForEvent");
                }
                (0, tutanota_utils_1.findAllAndRemove)((0, tutanota_utils_1.getFromMap)(events, calculationDate.getTime(), function () { return []; }), function (e) { return isSameEvent(e, event); });
                calculationDate = incrementByRepeatPeriod(calculationDate, TutanotaConstants_1.RepeatPeriod.DAILY, 1, zone);
                iterations++;
            }
        }
    }
}
exports.addDaysForEvent = addDaysForEvent;
/**
 * Returns the end date of a repeating rule that can be used to display in the ui.
 * The actual end date that is stored on the repeat rule is always one day behind the displayed end date. The end date is always excluded
 * but to  display the end date we want show the last date of the period which is included.
 * @returns {Date}
 */
function getRepeatEndTime(repeatRule, isAllDay, timeZone) {
    if (repeatRule.endType !== "2" /* EndType.UntilDate */) {
        throw new Error("Event has no repeat rule end type is not UntilDate: " + JSON.stringify(repeatRule));
    }
    var rawEndDate = new Date(Number(repeatRule.endValue));
    var localDate = isAllDay ? getAllDayDateForTimezone(rawEndDate, timeZone) : rawEndDate;
    // Shown date is one day behind the actual end (for us it's excluded)
    return incrementByRepeatPeriod(localDate, TutanotaConstants_1.RepeatPeriod.DAILY, -1, timeZone);
}
exports.getRepeatEndTime = getRepeatEndTime;
function addDaysForRecurringEvent(events, event, month, timeZone) {
    var repeatRule = event.repeatRule;
    if (repeatRule == null) {
        throw new Error("Invalid argument: event doesn't have a repeatRule" + JSON.stringify(event));
    }
    var frequency = (0, tutanota_utils_1.downcast)(repeatRule.frequency);
    var interval = Number(repeatRule.interval);
    var isLong = isLongEvent(event, timeZone);
    var eventStartTime = new Date(getEventStart(event, timeZone));
    var eventEndTime = new Date(getEventEnd(event, timeZone));
    // Loop by the frequency step
    var repeatEndTime = null;
    var endOccurrences = null;
    var allDay = (0, CommonCalendarUtils_1.isAllDayEvent)(event);
    // For all-day events we should rely on the local time zone or at least we must use the same zone as in getAllDayDateUTCFromZone
    // below. If they are not in sync, then daylight saving shifts may cause us to extract wrong UTC date (day in repeat rule zone and in
    // local zone may be different).
    var repeatTimeZone = allDay ? timeZone : getValidTimeZone(repeatRule.timeZone);
    if (repeatRule.endType === "1" /* EndType.Count */) {
        endOccurrences = Number(repeatRule.endValue);
    }
    else if (repeatRule.endType === "2" /* EndType.UntilDate */) {
        // See CalendarEventDialog for an explanation why it's needed
        if (allDay) {
            repeatEndTime = getAllDayDateForTimezone(new Date(Number(repeatRule.endValue)), timeZone);
        }
        else {
            repeatEndTime = new Date(Number(repeatRule.endValue));
        }
    }
    var calcStartTime = eventStartTime;
    var calcDuration = allDay ? getDiffInDays(eventStartTime, eventEndTime) : eventEndTime.getTime() - eventStartTime.getTime();
    var calcEndTime = eventEndTime;
    var iteration = 1;
    while ((endOccurrences == null || iteration <= endOccurrences) &&
        (repeatEndTime == null || calcStartTime.getTime() < repeatEndTime.getTime()) &&
        calcStartTime.getTime() < month.end.getTime()) {
        assertDateIsValid(calcStartTime);
        assertDateIsValid(calcEndTime);
        if (iteration > MAX_EVENT_ITERATIONS) {
            throw new Error("Run into the infinite loop, addDaysForRecurringEvent");
        }
        if (calcEndTime.getTime() >= month.start.getTime()) {
            var eventClone = (0, tutanota_utils_1.clone)(event);
            if (allDay) {
                eventClone.startTime = getAllDayDateUTCFromZone(calcStartTime, timeZone);
                eventClone.endTime = getAllDayDateUTCFromZone(calcEndTime, timeZone);
            }
            else {
                eventClone.startTime = new Date(calcStartTime);
                eventClone.endTime = new Date(calcEndTime);
            }
            if (isLong) {
                addDaysForLongEvent(events, eventClone, month, timeZone);
            }
            else {
                addDaysForEvent(events, eventClone, month, timeZone);
            }
        }
        calcStartTime = incrementByRepeatPeriod(eventStartTime, frequency, interval * iteration, repeatTimeZone);
        calcEndTime = allDay
            ? incrementByRepeatPeriod(calcStartTime, TutanotaConstants_1.RepeatPeriod.DAILY, calcDuration, repeatTimeZone)
            : luxon_1.DateTime.fromJSDate(calcStartTime).plus(calcDuration).toJSDate();
        iteration++;
    }
}
exports.addDaysForRecurringEvent = addDaysForRecurringEvent;
function addDaysForLongEvent(events, event, month, zone) {
    if (zone === void 0) { zone = getTimeZone(); }
    // for long running events we create events for the month only
    // first start of event is inside month
    var eventStart = getEventStart(event, zone).getTime();
    var eventEnd = getEventEnd(event, zone).getTime();
    var calculationDate;
    var eventEndInMonth;
    if (eventStart >= month.start.getTime() && eventStart < month.end.getTime()) {
        // first: start of event is inside month
        calculationDate = getStartOfDayWithZone(new Date(eventStart), zone);
    }
    else if (eventStart < month.start.getTime()) {
        // start is before month
        calculationDate = new Date(month.start);
    }
    else {
        return; // start date is after month end
    }
    if (eventEnd > month.start.getTime() && eventEnd <= month.end.getTime()) {
        //end is inside month
        eventEndInMonth = new Date(eventEnd);
    }
    else if (eventEnd > month.end.getTime()) {
        // end is after month end
        eventEndInMonth = new Date(month.end);
    }
    else {
        return; // end is before start of month
    }
    var iterations = 0;
    while (calculationDate.getTime() < eventEndInMonth.getTime()) {
        assertDateIsValid(calculationDate);
        (0, tutanota_utils_1.insertIntoSortedArray)(event, (0, tutanota_utils_1.getFromMap)(events, calculationDate.getTime(), function () { return []; }), eventComparator, isSameEvent);
        calculationDate = incrementByRepeatPeriod(calculationDate, TutanotaConstants_1.RepeatPeriod.DAILY, 1, zone);
        if (iterations++ > MAX_EVENT_ITERATIONS) {
            throw new Error("Run into the infinite loop, addDaysForLongEvent");
        }
    }
}
exports.addDaysForLongEvent = addDaysForLongEvent;
function findNextAlarmOccurrence(now, timeZone, eventStart, eventEnd, frequency, interval, endType, endValue, alarmTrigger, localTimeZone) {
    var occurrenceNumber = 0;
    var isAllDayEvent = (0, CommonCalendarUtils_1.isAllDayEventByTimes)(eventStart, eventEnd);
    var calcEventStart = isAllDayEvent ? getAllDayDateForTimezone(eventStart, localTimeZone) : eventStart;
    assertDateIsValid(calcEventStart);
    var endDate = endType === "2" /* EndType.UntilDate */ ? (isAllDayEvent ? getAllDayDateForTimezone(new Date(endValue), localTimeZone) : new Date(endValue)) : null;
    while (endType !== "1" /* EndType.Count */ || occurrenceNumber < endValue) {
        var occurrenceDate = incrementByRepeatPeriod(calcEventStart, frequency, interval * occurrenceNumber, isAllDayEvent ? localTimeZone : timeZone);
        if (endDate && occurrenceDate.getTime() >= endDate.getTime()) {
            return null;
        }
        var alarmTime = calculateAlarmTime(occurrenceDate, alarmTrigger, localTimeZone);
        if (alarmTime >= now) {
            return {
                alarmTime: alarmTime,
                occurrenceNumber: occurrenceNumber,
                eventTime: occurrenceDate
            };
        }
        occurrenceNumber++;
    }
    return null;
}
exports.findNextAlarmOccurrence = findNextAlarmOccurrence;
/**
 * @param date
 * @param firstDayOfWeekFromOffset
 * @return {{weeks: Array[], weekdays: Array}}
 */
function getCalendarMonth(date, firstDayOfWeekFromOffset, weekdayNarrowFormat) {
    var weeks = [[]];
    var calculationDate = (0, tutanota_utils_1.getStartOfDay)(date);
    calculationDate.setDate(1);
    var currentYear = calculationDate.getFullYear();
    var month = calculationDate.getMonth();
    // add "padding" days
    // getDay returns the day of the week (from 0 to 6) for the specified date (with first one being Sunday)
    var firstDay;
    if (firstDayOfWeekFromOffset > calculationDate.getDay()) {
        firstDay = calculationDate.getDay() + 7 - firstDayOfWeekFromOffset;
    }
    else {
        firstDay = calculationDate.getDay() - firstDayOfWeekFromOffset;
    }
    var dayCount;
    (0, tutanota_utils_1.incrementDate)(calculationDate, -firstDay);
    for (dayCount = 0; dayCount < firstDay; dayCount++) {
        weeks[0].push({
            date: new Date(calculationDate),
            day: calculationDate.getDate(),
            month: calculationDate.getMonth(),
            year: calculationDate.getFullYear(),
            paddingDay: true
        });
        (0, tutanota_utils_1.incrementDate)(calculationDate, 1);
    }
    // add actual days
    while (calculationDate.getMonth() === month) {
        if (weeks[0].length && dayCount % 7 === 0) {
            // start new week
            weeks.push([]);
        }
        var dayInfo = {
            date: new Date(currentYear, month, calculationDate.getDate()),
            year: currentYear,
            month: month,
            day: calculationDate.getDate(),
            paddingDay: false
        };
        weeks[weeks.length - 1].push(dayInfo);
        (0, tutanota_utils_1.incrementDate)(calculationDate, 1);
        dayCount++;
    }
    // add remaining "padding" days
    while (dayCount < 42) {
        if (dayCount % 7 === 0) {
            weeks.push([]);
        }
        weeks[weeks.length - 1].push({
            day: calculationDate.getDate(),
            year: calculationDate.getFullYear(),
            month: calculationDate.getMonth(),
            date: new Date(calculationDate),
            paddingDay: true
        });
        (0, tutanota_utils_1.incrementDate)(calculationDate, 1);
        dayCount++;
    }
    var weekdays = [];
    var weekdaysDate = new Date();
    (0, tutanota_utils_1.incrementDate)(weekdaysDate, -weekdaysDate.getDay() + firstDayOfWeekFromOffset); // get first day of week
    for (var i = 0; i < 7; i++) {
        weekdays.push(weekdayNarrowFormat ? LanguageViewModel_1.lang.formats.weekdayNarrow.format(weekdaysDate) : LanguageViewModel_1.lang.formats.weekdayShort.format(weekdaysDate));
        (0, tutanota_utils_1.incrementDate)(weekdaysDate, 1);
    }
    return {
        weekdays: weekdays,
        weeks: weeks
    };
}
exports.getCalendarMonth = getCalendarMonth;
function formatEventDuration(event, zone, includeTimezone) {
    if ((0, CommonCalendarUtils_1.isAllDayEvent)(event)) {
        var startTime = getEventStart(event, zone);
        var startString = (0, Formatter_1.formatDateWithMonth)(startTime);
        var endTime = incrementByRepeatPeriod(getEventEnd(event, zone), TutanotaConstants_1.RepeatPeriod.DAILY, -1, zone);
        if ((0, tutanota_utils_1.isSameDayOfDate)(startTime, endTime)) {
            return "".concat(LanguageViewModel_1.lang.get("allDay_label"), ", ").concat(startString);
        }
        else {
            return "".concat(LanguageViewModel_1.lang.get("allDay_label"), ", ").concat(startString, " - ").concat((0, Formatter_1.formatDateWithMonth)(endTime));
        }
    }
    else {
        var startString = (0, Formatter_1.formatDateTime)(event.startTime);
        var endString = void 0;
        if ((0, tutanota_utils_1.isSameDay)(event.startTime, event.endTime)) {
            endString = (0, Formatter_1.formatTime)(event.endTime);
        }
        else {
            endString = (0, Formatter_1.formatDateTime)(event.endTime);
        }
        return "".concat(startString, " - ").concat(endString, " ").concat(includeTimezone ? getTimeZone() : "");
    }
}
exports.formatEventDuration = formatEventDuration;
function calendarAttendeeStatusSymbol(status) {
    switch (status) {
        case TutanotaConstants_1.CalendarAttendeeStatus.ADDED:
        case TutanotaConstants_1.CalendarAttendeeStatus.NEEDS_ACTION:
            return "";
        case TutanotaConstants_1.CalendarAttendeeStatus.TENTATIVE:
            return "?";
        case TutanotaConstants_1.CalendarAttendeeStatus.ACCEPTED:
            return "✓";
        case TutanotaConstants_1.CalendarAttendeeStatus.DECLINED:
            return "❌";
        default:
            throw new Error("Unknown calendar attendee status: " + status);
    }
}
exports.calendarAttendeeStatusSymbol = calendarAttendeeStatusSymbol;
function incrementSequence(sequence, isOwnEvent) {
    var current = (0, tutanota_utils_1.filterInt)(sequence) || 0;
    // Only the organizer should increase sequence numbers
    return String(isOwnEvent ? current + 1 : current);
}
exports.incrementSequence = incrementSequence;
function getNextHalfHour() {
    var date = new Date();
    if (date.getMinutes() > 30) {
        date.setHours(date.getHours() + 1, 0);
    }
    else {
        date.setMinutes(30);
    }
    date.setMilliseconds(0);
    return date;
}
exports.getNextHalfHour = getNextHalfHour;
function findPrivateCalendar(calendarInfo) {
    for (var _i = 0, _a = calendarInfo.values(); _i < _a.length; _i++) {
        var calendar = _a[_i];
        if (!calendar.shared) {
            return calendar;
        }
    }
    return null;
}
exports.findPrivateCalendar = findPrivateCalendar;
/**
 * Prepare calendar event description to be shown to the user. Must be called *before* sanitizing.
 *
 * It is needed to fix special format of links from Outlook which otherwise disappear during sanitizing.
 * They look like this:
 * ```
 * text<https://example.com>
 * ```
 */
function prepareCalendarDescription(description) {
    return description.replace(/<(http|https):\/\/[A-z0-9$-_.+!*‘(),\/?]+>/gi, function (possiblyLink) {
        try {
            var withoutBrackets = possiblyLink.slice(1, -1);
            var url = new URL(withoutBrackets);
            return "<a href=\"".concat(url.toString(), "\">").concat(withoutBrackets, "</a>");
        }
        catch (e) {
            return possiblyLink;
        }
    });
}
exports.prepareCalendarDescription = prepareCalendarDescription;
exports.DEFAULT_HOUR_OF_DAY = 6;
/** Get CSS class for the date element. */
function getDateIndicator(day, selectedDate) {
    if ((0, tutanota_utils_1.isSameDayOfDate)(day, selectedDate)) {
        return ".accent-bg.circle";
    }
    else {
        return "";
    }
}
exports.getDateIndicator = getDateIndicator;
/**
 * Determine what format the time of an event should be rendered in given a surrounding time period
 */
function getTimeTextFormatForLongEvent(ev, startDay, endDay, zone) {
    var startsBefore = eventStartsBefore(startDay, zone, ev);
    var endsAfter = eventEndsAfterOrOn(endDay, zone, ev);
    if ((startsBefore && endsAfter) || (0, CommonCalendarUtils_1.isAllDayEvent)(ev)) {
        return null;
    }
    else if (startsBefore && !endsAfter) {
        return "endTime" /* EventTextTimeOption.END_TIME */;
    }
    else if (!startsBefore && endsAfter) {
        return "startTime" /* EventTextTimeOption.START_TIME */;
    }
    else {
        return "startAndEndTime" /* EventTextTimeOption.START_END_TIME */;
    }
}
exports.getTimeTextFormatForLongEvent = getTimeTextFormatForLongEvent;
/**
 * Creates a new date with the year, month and day from the Date and the hours and minutes from the Time
 * @param date
 * @param time
 */
function combineDateWithTime(date, time) {
    var newDate = new Date(date);
    newDate.setHours(time.hours);
    newDate.setMinutes(time.minutes);
    return newDate;
}
exports.combineDateWithTime = combineDateWithTime;
/**
 * Check if an event occurs during some time period of days, either partially or entirely
 * Expects that firstDayOfWeek is before lastDayOfWeek, and that event starts before it ends, otherwise result is invalid
 */
function isEventBetweenDays(event, firstDay, lastDay, zone) {
    return !(eventEndsBefore(firstDay, zone, event) || eventStartsAfter((0, tutanota_utils_1.getEndOfDay)(lastDay), zone, event));
}
exports.isEventBetweenDays = isEventBetweenDays;
function createRepeatRuleFrequencyValues() {
    return [
        {
            name: LanguageViewModel_1.lang.get("calendarRepeatIntervalNoRepeat_label"),
            value: null
        },
        {
            name: LanguageViewModel_1.lang.get("calendarRepeatIntervalDaily_label"),
            value: TutanotaConstants_1.RepeatPeriod.DAILY
        },
        {
            name: LanguageViewModel_1.lang.get("calendarRepeatIntervalWeekly_label"),
            value: TutanotaConstants_1.RepeatPeriod.WEEKLY
        },
        {
            name: LanguageViewModel_1.lang.get("calendarRepeatIntervalMonthly_label"),
            value: TutanotaConstants_1.RepeatPeriod.MONTHLY
        },
        {
            name: LanguageViewModel_1.lang.get("calendarRepeatIntervalAnnually_label"),
            value: TutanotaConstants_1.RepeatPeriod.ANNUALLY
        },
    ];
}
exports.createRepeatRuleFrequencyValues = createRepeatRuleFrequencyValues;
function createRepeatRuleEndTypeValues() {
    return [
        {
            name: LanguageViewModel_1.lang.get("calendarRepeatStopConditionNever_label"),
            value: "0" /* EndType.Never */
        },
        {
            name: LanguageViewModel_1.lang.get("calendarRepeatStopConditionOccurrences_label"),
            value: "1" /* EndType.Count */
        },
        {
            name: LanguageViewModel_1.lang.get("calendarRepeatStopConditionDate_label"),
            value: "2" /* EndType.UntilDate */
        },
    ];
}
exports.createRepeatRuleEndTypeValues = createRepeatRuleEndTypeValues;
function getFirstDayOfMonth(d) {
    var date = new Date(d);
    date.setDate(1);
    return date;
}
exports.getFirstDayOfMonth = getFirstDayOfMonth;
