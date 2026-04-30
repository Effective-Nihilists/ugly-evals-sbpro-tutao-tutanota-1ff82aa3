"use strict";
exports.__esModule = true;
exports.getEventElementMinId = exports.geEventElementMaxId = exports.createEventElementId = exports.generateEventElementId = exports.getAllDayDateLocal = exports.getAllDayDateUTC = exports.isAllDayEventByTimes = exports.isAllDayEvent = exports.DAYS_SHIFTED_MS = void 0;
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var EntityUtils_1 = require("./EntityUtils");
/**
 * the time in ms that element ids for calendar events and alarms  get randomized by
 */
exports.DAYS_SHIFTED_MS = 15 * tutanota_utils_1.DAY_IN_MILLIS;
/*
 * convenience wrapper for isAllDayEventByTimes
 */
function isAllDayEvent(_a) {
    var startTime = _a.startTime, endTime = _a.endTime;
    return isAllDayEventByTimes(startTime, endTime);
}
exports.isAllDayEvent = isAllDayEvent;
/**
 * determine if an event with the given start and end times would be an all-day event
 */
function isAllDayEventByTimes(startTime, endTime) {
    return (startTime.getUTCHours() === 0 &&
        startTime.getUTCMinutes() === 0 &&
        startTime.getUTCSeconds() === 0 &&
        endTime.getUTCHours() === 0 &&
        endTime.getUTCMinutes() === 0 &&
        endTime.getUTCSeconds() === 0);
}
exports.isAllDayEventByTimes = isAllDayEventByTimes;
/**
 * @param localDate
 * @returns {Date} a Date with a unix timestamp corresponding to 00:00 UTC for localDate's Day in the local time zone
 */
function getAllDayDateUTC(localDate) {
    return new Date(Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate(), 0, 0, 0, 0));
}
exports.getAllDayDateUTC = getAllDayDateUTC;
/**
 * @param utcDate a Date with a unix timestamp corresponding to 00:00 UTC for a given Day
 * @returns {Date} a Date with a unix timestamp corresponding to 00:00 for that day in the local time zone
 */
function getAllDayDateLocal(utcDate) {
    return new Date(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), utcDate.getUTCDate());
}
exports.getAllDayDateLocal = getAllDayDateLocal;
/**
 * generate a semi-randomized element id for a calendar event or an alarm
 * @param timestamp the start time of the event or the creation time of the alarm
 */
function generateEventElementId(timestamp) {
    // the id is based on either the event start time or the alarm creation time
    // we add a random shift between -DAYS_SHIFTED_MS and +DAYS_SHIFTED_MS to the event
    // id to prevent the server from knowing the exact time but still being able to
    // approximately sort them.
    var randomDay = Math.floor(Math.random() * exports.DAYS_SHIFTED_MS) * 2;
    return createEventElementId(timestamp, randomDay - exports.DAYS_SHIFTED_MS);
}
exports.generateEventElementId = generateEventElementId;
/**
 * https://262.ecma-international.org/5.1/#sec-15.9.1.1
 * * ECMAScript Number values can represent all integers from –9,007,199,254,740,992 to 9,007,199,254,740,992
 * * The actual range of times supported by ECMAScript Date objects is slightly smaller: a range of +-8,640,000,000,000,000 milliseconds
 * -> this makes the element Id a string of between 1 and 17 number characters (the shiftDays are negligible)
 *
 * exported for testing
 * @param timestamp
 * @param shiftDays
 */
function createEventElementId(timestamp, shiftDays) {
    return (0, EntityUtils_1.stringToCustomId)(String(timestamp + shiftDays));
}
exports.createEventElementId = createEventElementId;
/**
 * the maximum id an event with a given start time could have based on its
 * randomization.
 * @param timestamp
 */
function geEventElementMaxId(timestamp) {
    return createEventElementId(timestamp, exports.DAYS_SHIFTED_MS);
}
exports.geEventElementMaxId = geEventElementMaxId;
/**
 * the minimum an event with a given start time could have based on its
 * randomization.
 * @param timestamp
 */
function getEventElementMinId(timestamp) {
    return createEventElementId(timestamp, -exports.DAYS_SHIFTED_MS);
}
exports.getEventElementMinId = getEventElementMinId;
