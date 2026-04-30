"use strict";
exports.__esModule = true;
exports.SleepDetector = exports.SLEEP_INTERVAL = exports.CHECK_INTERVAL = void 0;
// exported for testing
/** How often do we check for sleep. */
exports.CHECK_INTERVAL = 5000;
/** How much time should have passed for us to assume that the app was suspended. */
exports.SLEEP_INTERVAL = 15000;
/**
 * Class for detecting suspension state of the app/device.
 * When the device is entering the sleep mode the browser would pause the page. For most of the app it looks like no time has passed at all but when there
 * are external factors e.g. websocket connection we might need to know whether it happens.
 *
 * We detect such situation by scheduling periodic timer and measuring the time in between.
 *
 * Currently is only capable of having one sleep action at a time.
 */
var SleepDetector = /** @class */ (function () {
    function SleepDetector(scheduler, dateProvider) {
        this.scheduler = scheduler;
        this.dateProvider = dateProvider;
        this.scheduledState = null;
    }
    SleepDetector.prototype.start = function (onSleep) {
        var _this = this;
        this.stop();
        this.scheduledState = {
            scheduledId: this.scheduler.schedulePeriodic(function () { return _this.check(); }, exports.CHECK_INTERVAL),
            lastTime: this.dateProvider.now(),
            onSleep: onSleep
        };
    };
    SleepDetector.prototype.check = function () {
        if (this.scheduledState == null)
            return;
        var now = this.dateProvider.now();
        if (now - this.scheduledState.lastTime > exports.SLEEP_INTERVAL) {
            this.scheduledState.onSleep();
        }
        this.scheduledState.lastTime = now;
    };
    SleepDetector.prototype.stop = function () {
        if (this.scheduledState) {
            this.scheduler.unschedulePeriodic(this.scheduledState.scheduledId);
            this.scheduledState = null;
        }
    };
    return SleepDetector;
}());
exports.SleepDetector = SleepDetector;
