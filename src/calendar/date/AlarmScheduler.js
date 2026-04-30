"use strict";
exports.__esModule = true;
exports.AlarmSchedulerImpl = void 0;
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Formatter_1 = require("../../misc/Formatter");
var CalendarUtils_1 = require("./CalendarUtils");
var AlarmSchedulerImpl = /** @class */ (function () {
    function AlarmSchedulerImpl(dateProvider, scheduler) {
        this._dateProvider = dateProvider;
        this._scheduledNotifications = new Map();
        this._scheduler = scheduler;
    }
    AlarmSchedulerImpl.prototype.scheduleAlarm = function (event, alarmInfo, repeatRule, notificationSender) {
        var _this = this;
        var localZone = this._dateProvider.timeZone();
        if (repeatRule) {
            var repeatTimeZone = (0, CalendarUtils_1.getValidTimeZone)(repeatRule.timeZone, localZone);
            var calculationLocalZone = (0, CalendarUtils_1.getValidTimeZone)(localZone);
            var nextOccurrence_1 = (0, CalendarUtils_1.findNextAlarmOccurrence)(new Date(this._dateProvider.now()), repeatTimeZone, event.startTime, event.endTime, (0, tutanota_utils_1.downcast)(repeatRule.frequency), Number(repeatRule.interval), (0, tutanota_utils_1.downcast)(repeatRule.endType) || "0" /* EndType.Never */, Number(repeatRule.endValue), (0, tutanota_utils_1.downcast)(alarmInfo.trigger), calculationLocalZone);
            if (nextOccurrence_1) {
                this._scheduleAction(alarmInfo.alarmIdentifier, nextOccurrence_1.alarmTime, function () {
                    _this._sendNotification(nextOccurrence_1.eventTime, event.summary, notificationSender);
                    // Schedule next occurrence
                    _this.scheduleAlarm(event, alarmInfo, repeatRule, notificationSender);
                });
            }
        }
        else {
            var eventStart_1 = (0, CalendarUtils_1.getEventStartByTimes)(event.startTime, event.endTime, localZone);
            if (eventStart_1.getTime() > this._dateProvider.now()) {
                this._scheduleAction(alarmInfo.alarmIdentifier, (0, CalendarUtils_1.calculateAlarmTime)(eventStart_1, (0, tutanota_utils_1.downcast)(alarmInfo.trigger)), function () {
                    return _this._sendNotification(eventStart_1, event.summary, notificationSender);
                });
            }
        }
    };
    AlarmSchedulerImpl.prototype.cancelAlarm = function (alarmIdentifier) {
        // try to cancel single first
        this._cancelOccurrence(alarmIdentifier);
    };
    AlarmSchedulerImpl.prototype._cancelOccurrence = function (alarmIdentifier) {
        var timeoutId = this._scheduledNotifications.get(alarmIdentifier);
        if (timeoutId != null) {
            this._scheduler.unscheduleTimeout(timeoutId);
        }
    };
    AlarmSchedulerImpl.prototype._scheduleAction = function (identifier, atTime, action) {
        var scheduledId = this._scheduler.scheduleAt(action, atTime);
        this._scheduledNotifications.set(identifier, scheduledId);
    };
    AlarmSchedulerImpl.prototype._sendNotification = function (eventTime, summary, notificationSender) {
        var dateString;
        if ((0, tutanota_utils_1.isSameDay)(eventTime, new Date(this._dateProvider.now()))) {
            dateString = (0, Formatter_1.formatTime)(eventTime);
        }
        else {
            dateString = (0, Formatter_1.formatDateWithWeekdayAndTime)(eventTime);
        }
        var body = "".concat(dateString, " ").concat(summary);
        notificationSender(body, body);
    };
    return AlarmSchedulerImpl;
}());
exports.AlarmSchedulerImpl = AlarmSchedulerImpl;
