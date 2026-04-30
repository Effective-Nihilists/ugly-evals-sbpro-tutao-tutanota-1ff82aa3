"use strict";
exports.__esModule = true;
exports._cleanupAndSplit = exports.parseBirthday = exports._getNumDaysInMonth = exports.parseDate = void 0;
var LanguageViewModel_1 = require("./LanguageViewModel");
var luxon_1 = require("luxon");
var TypeRefs_js_1 = require("../api/entities/tutanota/TypeRefs.js");
var Formatter_1 = require("./Formatter");
/**
 * parses the following formats:
 *
 * zh-hant    2017/6/23
 * hu         2017. 06. 23.
 * lt-lt      2017-06-23
 *
 * en        6/23/2017
 * fil-ph    6/23/2017
 * no        6/23/2017

 * sq        23.6.2017
 * hr        23. 06. 2017.
 * nl        23-6-2017
 * de        23.6.2017
 * el        23/6/2017
 * fr        23/06/2017
 * it        23/6/2017
 * pl        23.06.2017
 * pt-pt     23/06/2017
 * pt-br     23/06/2017
 * ro        23.06.2017
 * ru        23.06.2017
 * es        23/6/2017
 * tr        23.06.2017
 * fi        23.6.2017
 * mk        23.6.2017
 * sr        23.6.2017.
 * cs-cz     23. 6. 2017
 * da-dk     23/6/2017
 * et-ee     23.6.2017
 * id        23/6/2017
 * bg-bg     23.06.2017 г.

 * @param dateString
 * @returns The timestamp from the given date string
 */
var referenceDate = new Date(2017, 5, 23);
function parseDate(dateString) {
    var languageTag = LanguageViewModel_1.lang.languageTag.toLowerCase();
    var referenceParts = _cleanupAndSplit((0, Formatter_1.formatDate)(referenceDate));
    // for finding day month and year position of locale date format  in cleanAndSplit array
    var dayPos = referenceParts.findIndex(function (e) { return e === 23; });
    var monthPos = referenceParts.findIndex(function (e) { return e === 6; });
    var yearPos = referenceParts.findIndex(function (e) { return e === 2017; });
    var parts = _cleanupAndSplit(dateString);
    var day, month, year;
    if (parts.length === 3) {
        // default dd-mm-yyyy or dd/mm/yyyy or dd.mm.yyyy
        day = parts[dayPos];
        month = parts[monthPos];
        year = parts[yearPos];
    }
    else if (parts.length === 2) {
        // if only two numbers are provided then we interpret that as a day and a month
        // year pos *should* only ever be 0 or 2 (at the front or the back)
        if (yearPos === 0) {
            day = parts[dayPos - 1];
            month = parts[monthPos - 1];
        }
        else {
            // yearPos === 2
            day = parts[dayPos];
            month = parts[monthPos];
        }
        year = new Date().getFullYear();
    }
    else {
        // invalid parts length
        throw new Error("could not parse dateString '".concat(dateString, "' for locale ").concat(languageTag));
    }
    // if 1 or 2 digit year, then make it be in the 2000
    if (year < 1000) {
        year += 2000;
    }
    if (month < 1 || month > 12) {
        throw new Error("Invalid value ".concat(month, " for month in ").concat(dateString));
    }
    // maybe do better day clamping based on the month
    if (day < 1 || day > _getNumDaysInMonth(month, year)) {
        throw new Error("Invalid value ".concat(day, " for day in ").concat(dateString));
    }
    var date = new Date(year, month - 1, day);
    if (isNaN(date.getTime())) {
        throw new Error("Couldn't parse date string ".concat(dateString));
    }
    return date;
}
exports.parseDate = parseDate;
/**
 * Get the number of days in a month in a given year
 * @param month as a number between 1 and 12
 * @param year
 * @return the number of days in the month
 * @private
 */
function _getNumDaysInMonth(month, year) {
    return luxon_1.DateTime.fromObject({
        month: month,
        year: year
    }).daysInMonth;
}
exports._getNumDaysInMonth = _getNumDaysInMonth;
/**
 * Parses a birthday string containing either day and month or day and month and year. The year may be 4 or 2 digits. If it is 2 digits and after the current year, 1900 + x is used, 2000 + x otherwise.
 * @return A birthday object containing the data form the given text or null if the text could not be parsed.
 */
function parseBirthday(text) {
    try {
        var referenceDate_1 = new Date(2017, 5, 23);
        var referenceParts = _cleanupAndSplit((0, Formatter_1.formatDate)(referenceDate_1));
        //for finding day month and year position of locale date format  in cleanAndSplit array
        var dayPos = referenceParts.findIndex(function (e) { return e === 23; });
        var monthPos = referenceParts.findIndex(function (e) { return e === 6; });
        var yearPos = referenceParts.findIndex(function (e) { return e === 2017; });
        var birthdayValues = _cleanupAndSplit(text);
        var birthday = (0, TypeRefs_js_1.createBirthday)();
        if (String(birthdayValues[dayPos]).length < 3 && String(birthdayValues[monthPos]).length < 3) {
            if (birthdayValues[dayPos] < 32) {
                birthday.day = String(birthdayValues[dayPos]);
            }
            else {
                return null;
            }
            if (birthdayValues[monthPos] < 13) {
                birthday.month = String(birthdayValues[monthPos]);
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
        if (birthdayValues[yearPos]) {
            if (String(birthdayValues[yearPos]).length === 4) {
                birthday.year = String(birthdayValues[yearPos]);
            }
            else if (String(birthdayValues[yearPos]).length === 2) {
                if (birthdayValues[yearPos] > Number(String(new Date().getFullYear()).substring(2))) {
                    birthday.year = "19" + String(birthdayValues[yearPos]);
                }
                else {
                    birthday.year = "20" + String(birthdayValues[yearPos]);
                }
            }
            else {
                return null;
            }
        }
        else {
            birthday.year = null;
        }
        return birthday;
    }
    catch (e) {
        return null;
    }
}
exports.parseBirthday = parseBirthday;
function _cleanupAndSplit(dateString) {
    // Clean up any characters that can't be dealt with
    dateString = dateString.replace(/[^ 0-9.\/-]/g, "");
    return dateString
        .split(/[.\/-]/g)
        .slice(0, 3) // keep at most three date parts even if the string contains more than two separators (e.g., extra '.' at the end)
        .map(function (part) { return parseInt(part); });
}
exports._cleanupAndSplit = _cleanupAndSplit;
