"use strict";
exports.__esModule = true;
exports.ProgressTracker = void 0;
var stream_1 = require("mithril/stream");
var ProgressMonitor_1 = require("../common/utils/ProgressMonitor");
/**
 * The progress tracker controls the progress bar located in Header.js
 * You can register progress monitors with it and then make workDone calls on them
 * and then the total progress will be shown at the top of the window
 */
var ProgressTracker = /** @class */ (function () {
    function ProgressTracker() {
        // initially, there is no work so we are done by default.
        this.onProgressUpdate = (0, stream_1["default"])(1);
        this._monitors = new Map();
        this._idCounter = 0;
    }
    /**
     * Register a monitor with the tracker, so that it's progress can be displayed
     * Returns an ID as a handle, useful for making calls from the worker
     *
     * Make sure that monitor completes so it can be unregistered.
     * @param work - total work to do
     */
    ProgressTracker.prototype.registerMonitor = function (work) {
        var _this = this;
        var id = this._idCounter++;
        var monitor = new ProgressMonitor_1.ProgressMonitor(work, function (completed) { return _this._onProgress(id, completed); });
        this._monitors.set(id, monitor);
        return id;
    };
    ProgressTracker.prototype.getMonitor = function (id) {
        var _a;
        return (_a = this._monitors.get(id)) !== null && _a !== void 0 ? _a : null;
    };
    ProgressTracker.prototype._onProgress = function (id, completed) {
        // notify
        this.onProgressUpdate(this.completedAmount());
        // we might be done with this one
        if (completed >= 100)
            this._monitors["delete"](id);
    };
    /**
     * Total work that will be done from all monitors
     * @returns {void|number}
     */
    ProgressTracker.prototype.totalWork = function () {
        var total = 0;
        for (var _i = 0, _a = this._monitors.values(); _i < _a.length; _i++) {
            var value = _a[_i];
            total += value.totalWork;
        }
        return total;
    };
    /**
     * Current amount of completed work from all monitors
     * @returns {void|number}
     */
    ProgressTracker.prototype.completedWork = function () {
        var total = 0;
        for (var _i = 0, _a = this._monitors.values(); _i < _a.length; _i++) {
            var value = _a[_i];
            total += value.workCompleted;
        }
        return total;
    };
    /**
     * Completed amount as a number between 0 and 1
     * @returns {number}
     */
    ProgressTracker.prototype.completedAmount = function () {
        var totalWork = this.totalWork();
        var completedWork = this.completedWork();
        // no work to do means you have done all the work
        return totalWork !== 0 ? Math.min(1, completedWork / totalWork) : 1;
    };
    return ProgressTracker;
}());
exports.ProgressTracker = ProgressTracker;
