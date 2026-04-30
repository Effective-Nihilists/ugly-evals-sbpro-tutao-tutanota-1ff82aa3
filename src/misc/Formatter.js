"use strict";
exports.__esModule = true;
exports.formatMailAddressFromParts = exports.timeStringFromParts = exports.getHourCycle = exports.formatNameAndAddress = exports.urlEncodeHtmlTags = exports.formatStorageSize = exports.dateWithWeekdayWoMonth = exports.formatWeekdayNarrow = exports.formatWeekdayShort = exports.formatDateWithTimeIfNotEven = exports.formatDateWithWeekdayAndTime = exports.formatDateTimeShort = exports.formatDateTime = exports.formatTime = exports.formatDateTimeFromYesterdayOn = exports.formatDateWithWeekdayAndYearLong = exports.formatDateWithWeekdayAndYear = exports.formatDateWithWeekday = exports.formatDateWithMonth = exports.formatDate = exports.formatMonthWithFullYear = exports.formatMonthWithYear = void 0;
var LanguageViewModel_1 = require("./LanguageViewModel");
var CountryList_1 = require("../api/common/CountryList");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var tutanota_utils_2 = require("@tutao/tutanota-utils");
var Env_1 = require("../api/common/Env");
(0, Env_1.assertMainOrNode)();
function formatMonthWithYear(date) {
    return LanguageViewModel_1.lang.formats.monthWithYear.format(date);
}
exports.formatMonthWithYear = formatMonthWithYear;
function formatMonthWithFullYear(date) {
    return LanguageViewModel_1.lang.formats.monthWithFullYear.format(date);
}
exports.formatMonthWithFullYear = formatMonthWithFullYear;
function formatDate(date) {
    return LanguageViewModel_1.lang.formats.simpleDate.format(date);
}
exports.formatDate = formatDate;
function formatDateWithMonth(date) {
    return LanguageViewModel_1.lang.formats.dateWithMonth.format(date);
}
exports.formatDateWithMonth = formatDateWithMonth;
function formatDateWithWeekday(date) {
    if (date.getFullYear() === new Date().getFullYear()) {
        return LanguageViewModel_1.lang.formats.dateWithWeekday.format(date);
    }
    else {
        return LanguageViewModel_1.lang.formats.dateWithWeekdayAndYear.format(date);
    }
}
exports.formatDateWithWeekday = formatDateWithWeekday;
function formatDateWithWeekdayAndYear(date) {
    return LanguageViewModel_1.lang.formats.dateWithWeekdayAndYear.format(date);
}
exports.formatDateWithWeekdayAndYear = formatDateWithWeekdayAndYear;
function formatDateWithWeekdayAndYearLong(date) {
    return LanguageViewModel_1.lang.formats.dateWithWeekdayAndYearLong.format(date);
}
exports.formatDateWithWeekdayAndYearLong = formatDateWithWeekdayAndYearLong;
function formatDateTimeFromYesterdayOn(date) {
    var dateString;
    var startOfToday = new Date().setHours(0, 0, 0, 0);
    var startOfYesterday = startOfToday - 1000 * 60 * 60 * 24;
    if (date.getTime() >= startOfToday) {
        dateString = "";
    }
    else if (startOfToday > date.getTime() && date.getTime() >= startOfYesterday) {
        dateString = LanguageViewModel_1.lang.get("yesterday_label");
    }
    else {
        dateString = formatDateWithWeekday(date);
    }
    return (dateString + " " + formatTime(date)).trim();
}
exports.formatDateTimeFromYesterdayOn = formatDateTimeFromYesterdayOn;
function formatTime(date) {
    return LanguageViewModel_1.lang.formats.time.format(date);
}
exports.formatTime = formatTime;
function formatDateTime(date) {
    return LanguageViewModel_1.lang.formats.dateTime.format(date);
}
exports.formatDateTime = formatDateTime;
function formatDateTimeShort(date) {
    return LanguageViewModel_1.lang.formats.dateTimeShort.format(date);
}
exports.formatDateTimeShort = formatDateTimeShort;
function formatDateWithWeekdayAndTime(date) {
    return LanguageViewModel_1.lang.formats.dateWithWeekdayAndTime.format(date);
}
exports.formatDateWithWeekdayAndTime = formatDateWithWeekdayAndTime;
function formatDateWithTimeIfNotEven(date) {
    if ((date.getHours() === 0 && date.getMinutes() === 0) || // If it's beginning of the day
        (date.getHours() === 23 && date.getMinutes() === 59 && date.getSeconds() === 59)) {
        // or the end of the day
        return formatDate(date);
    }
    else {
        return formatDateTimeShort(date);
    }
}
exports.formatDateWithTimeIfNotEven = formatDateWithTimeIfNotEven;
function formatWeekdayShort(date) {
    return LanguageViewModel_1.lang.formats.weekdayShort.format(date);
}
exports.formatWeekdayShort = formatWeekdayShort;
function formatWeekdayNarrow(date) {
    return LanguageViewModel_1.lang.formats.weekdayNarrow.format(date);
}
exports.formatWeekdayNarrow = formatWeekdayNarrow;
function dateWithWeekdayWoMonth(date) {
    return LanguageViewModel_1.lang.formats.dateWithWeekdayWoMonth.format(date);
}
exports.dateWithWeekdayWoMonth = dateWithWeekdayWoMonth;
/**
 * Formats the given size in bytes to a better human readable string using B, KB, MB, GB, TB.
 */
function formatStorageSize(sizeInBytes) {
    var units = ["B", "KB", "MB", "GB", "TB"];
    var narrowNoBreakSpace = " "; // this space is the special unicode narrow no-break character
    var unitIndex = 0;
    while (sizeInBytes >= 1000) {
        sizeInBytes /= 1000; // we use 1000 instead of 1024
        unitIndex++;
    }
    // round to 1 digit after comma
    sizeInBytes = Math.floor(sizeInBytes * 10) / 10;
    return sizeInBytes + narrowNoBreakSpace + units[unitIndex];
}
exports.formatStorageSize = formatStorageSize;
function urlEncodeHtmlTags(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
exports.urlEncodeHtmlTags = urlEncodeHtmlTags;
function formatNameAndAddress(name, address, countryCode) {
    var result = "";
    if (name) {
        result += name;
    }
    if (address) {
        if (result) {
            result += "\n";
        }
        result += address;
    }
    if (countryCode) {
        if (result) {
            result += "\n";
        }
        result += (0, tutanota_utils_1.neverNull)((0, CountryList_1.getByAbbreviation)(countryCode)).n;
    }
    return result;
}
exports.formatNameAndAddress = formatNameAndAddress;
function getHourCycle(userSettings) {
    return userSettings.timeFormat === "1" /* TimeFormat.TWELVE_HOURS */ ? "h12" : "h23";
}
exports.getHourCycle = getHourCycle;
function timeStringFromParts(hours, minutes, amPm) {
    var minutesString = (0, tutanota_utils_2.pad)(minutes, 2);
    if (amPm) {
        if (hours === 0) {
            return "12:".concat(minutesString, " am");
        }
        else if (hours === 12) {
            return "12:".concat(minutesString, " pm");
        }
        else if (hours > 12) {
            return "".concat(hours - 12, ":").concat(minutesString, " pm");
        }
        else {
            return "".concat(hours, ":").concat(minutesString, " am");
        }
    }
    else {
        var hoursString = (0, tutanota_utils_2.pad)(hours, 2);
        return hoursString + ":" + minutesString;
    }
}
exports.timeStringFromParts = timeStringFromParts;
function formatMailAddressFromParts(name, domain) {
    return "".concat(name, "@").concat(domain).trim().toLowerCase();
}
exports.formatMailAddressFromParts = formatMailAddressFromParts;
