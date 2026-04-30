"use strict";
exports.__esModule = true;
exports.SchedulerImpl = exports.SET_TIMEOUT_LIMIT = void 0;
/**
 * setTimeout() only works on 32bit integers, it doesn't do what you expect on longer intervals. If you use Scheduler you should not
 * worry about it, mainly exported for tests.
 * */
exports.SET_TIMEOUT_LIMIT = 0x7fffffff;
var SchedulerImpl = /** @class */ (function () {
    function SchedulerImpl(dateProvider, systemTimeout, systemInterval) {
        this.dateProvider = dateProvider;
        this.systemTimeout = systemTimeout;
        this.systemInterval = systemInterval;
        this.bridgedTimeouts = new Map();
    }
    SchedulerImpl.prototype.scheduleAt = function (callback, date) {
        var _this = this;
        var timeoutId;
        // Call the thunk and clean up timeout in the map
        var wrappedCallback = function () {
            _this.bridgedTimeouts["delete"](timeoutId);
            callback();
        };
        timeoutId = this.scheduleAtInternal(wrappedCallback, date);
        return timeoutId;
    };
    /** We have separate internal version which does not re-wrap the thunk. */
    SchedulerImpl.prototype.scheduleAtInternal = function (thunk, date) {
        var _this = this;
        var now = this.dateProvider.now();
        var then = date.getTime();
        var diff = Math.max(then - now, 0);
        var timeoutId;
        if (diff > exports.SET_TIMEOUT_LIMIT) {
            timeoutId = this.systemTimeout.setTimeout(function () {
                var newTimeoutId = _this.scheduleAtInternal(thunk, date);
                _this.bridgedTimeouts.set(timeoutId, newTimeoutId);
            }, exports.SET_TIMEOUT_LIMIT);
        }
        else {
            timeoutId = this.systemTimeout.setTimeout(thunk, diff);
        }
        return timeoutId;
    };
    SchedulerImpl.prototype.unscheduleTimeout = function (id) {
        var rescheduledId = this.bridgedTimeouts.get(id) || id;
        this.bridgedTimeouts["delete"](rescheduledId);
        return this.systemTimeout.clearTimeout(rescheduledId);
    };
    SchedulerImpl.prototype.schedulePeriodic = function (thunk, ms) {
        // Intervals bigger than 32 bit int will not work out-of-the-box and we do not want to implement bridging for them as this is a very rare case and is
        // usually a bug.
        if (ms > exports.SET_TIMEOUT_LIMIT) {
            throw new Error("Attempting to schedule periodic task but the period is too big: " + ms);
        }
        return this.systemInterval.setInterval(thunk, ms);
    };
    SchedulerImpl.prototype.unschedulePeriodic = function (id) {
        this.systemInterval.clearInterval(id);
    };
    return SchedulerImpl;
}());
exports.SchedulerImpl = SchedulerImpl;
