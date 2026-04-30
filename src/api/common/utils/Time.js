"use strict";
exports.__esModule = true;
exports.Time = void 0;
var tutanota_utils_1 = require("@tutao/tutanota-utils");
/**
 * A wrapper around time handling for the calendar stuff, mostly for the CalendarEventViewModel
 */
var Time = /** @class */ (function () {
    function Time(hours, minutes) {
        this.hours = Math.floor(hours) % 24;
        this.minutes = Math.floor(minutes) % 60;
    }
    Time.fromDate = function (date) {
        return new Time(date.getHours(), date.getMinutes());
    };
    Time.fromDateTime = function (_a) {
        var hour = _a.hour, minute = _a.minute;
        return new Time(hour, minute);
    };
    /**
     * convert into a date
     * if base date is set it will use the date values from that,
     * otherwise it will use the current date
     */
    Time.prototype.toDate = function (baseDate) {
        var date = baseDate ? new Date(baseDate) : new Date();
        date.setHours(this.hours);
        date.setMinutes(this.minutes);
        return date;
    };
    Time.prototype.equals = function (otherTime) {
        return this.hours === otherTime.hours && this.minutes === otherTime.minutes;
    };
    Time.prototype.toString = function (amPmFormat) {
        return amPmFormat ? this.to12HourString() : this.to24HourString();
    };
    Time.prototype.to12HourString = function () {
        var minutesString = (0, tutanota_utils_1.pad)(this.minutes, 2);
        if (this.hours === 0) {
            return "12:".concat(minutesString, " am");
        }
        else if (this.hours === 12) {
            return "12:".concat(minutesString, " pm");
        }
        else if (this.hours > 12) {
            return "".concat(this.hours - 12, ":").concat(minutesString, " pm");
        }
        else {
            return "".concat(this.hours, ":").concat(minutesString, " am");
        }
    };
    Time.prototype.to24HourString = function () {
        var hours = (0, tutanota_utils_1.pad)(this.hours, 2);
        var minutes = (0, tutanota_utils_1.pad)(this.minutes, 2);
        return "".concat(hours, ":").concat(minutes);
    };
    Time.prototype.toObject = function () {
        return {
            hours: this.hours,
            minutes: this.minutes
        };
    };
    return Time;
}());
exports.Time = Time;
