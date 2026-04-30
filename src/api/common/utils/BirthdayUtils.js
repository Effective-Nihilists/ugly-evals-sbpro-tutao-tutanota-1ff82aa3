"use strict";
exports.__esModule = true;
exports.oldBirthdayToBirthday = exports.isValidBirthday = exports.isoDateToBirthday = exports.birthdayToIsoDate = void 0;
var TypeRefs_js_1 = require("../../entities/tutanota/TypeRefs.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var ParsingError_1 = require("../error/ParsingError");
/**
 * Converts the birthday object to iso Date format (yyyy-mm-dd) or iso Date without year (--mm-dd)
 */
function birthdayToIsoDate(birthday) {
    var month = ("0" + birthday.month).slice(-2);
    var day = ("0" + birthday.day).slice(-2);
    var year = birthday.year ? ("0000" + birthday.year).slice(-4) : "-";
    return "".concat(year, "-").concat(month, "-").concat(day);
}
exports.birthdayToIsoDate = birthdayToIsoDate;
/**
 * Converts iso Date (yyyy-mm-dd) or Date without year (--mm-dd) into Birthday object.
 */
function isoDateToBirthday(birthdayIso) {
    //return new Date(Number(newBirthday.year), Number(newBirthday.month) - 1, Number(newBirthday.day))
    var birthday = (0, TypeRefs_js_1.createBirthday)();
    if (birthdayIso.startsWith("--")) {
        var monthAndDay = birthdayIso.substr(2).split("-");
        if (monthAndDay.length !== 2) {
            throw new ParsingError_1.ParsingError("invalid birthday without year: " + birthdayIso);
        }
        birthday.month = monthAndDay[0];
        birthday.day = monthAndDay[1];
        birthday.year = null;
    }
    else {
        var yearMonthAndDay = birthdayIso.split("-");
        if (yearMonthAndDay.length !== 3) {
            throw new ParsingError_1.ParsingError("invalid birthday: " + birthdayIso);
        }
        birthday.year = yearMonthAndDay[0];
        birthday.month = yearMonthAndDay[1];
        birthday.day = yearMonthAndDay[2];
    }
    if (!isValidBirthday(birthday)) {
        throw new ParsingError_1.ParsingError("Invalid birthday format: " + birthdayIso);
    }
    return birthday;
}
exports.isoDateToBirthday = isoDateToBirthday;
function isValidBirthday(birthday) {
    var day = Number(birthday.day);
    var month = Number(birthday.month);
    var year = birthday.year ? Number(birthday.year) : null;
    return day > 0 && day < 32 && month > 0 && month < 13 && (year === null || (year > 0 && year < 10000));
}
exports.isValidBirthday = isValidBirthday;
/**
 * returns new birthday format from old birthday format
 * Export for testing
 */
function oldBirthdayToBirthday(oldBirthday) {
    var bDayDetails = (0, TypeRefs_js_1.createBirthday)();
    var birthdayString = (0, tutanota_utils_1.formatSortableDate)(oldBirthday).split("-");
    bDayDetails.day = String(Number(birthdayString[2]));
    bDayDetails.month = String(Number(birthdayString[1]));
    bDayDetails.year = String(Number(birthdayString[0]));
    return bDayDetails;
}
exports.oldBirthdayToBirthday = oldBirthdayToBirthday;
