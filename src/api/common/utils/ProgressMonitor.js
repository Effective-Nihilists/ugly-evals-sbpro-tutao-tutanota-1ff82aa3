"use strict";
exports.__esModule = true;
exports.makeTrackedProgressMonitor = exports.AggregateProgressMonitor = exports.NoopProgressMonitor = exports.ProgressMonitor = void 0;
var tutanota_utils_1 = require("@tutao/tutanota-utils");
/**
 * Class to calculate percentage of total work and report it back.
 * Call {@code workDone()} for each work step and {@code completed()}
 * when you are done.
 */
var ProgressMonitor = /** @class */ (function () {
    function ProgressMonitor(totalWork, updater) {
        this.updater = updater;
        this.totalWork = totalWork;
        this.workCompleted = 0;
    }
    ProgressMonitor.prototype.workDone = function (amount) {
        this.workCompleted += amount;
        this.updater(this.percentage());
    };
    ProgressMonitor.prototype.percentage = function () {
        var result = Math.round((100 * this.workCompleted) / this.totalWork);
        return Math.min(100, result);
    };
    ProgressMonitor.prototype.completed = function () {
        this.workCompleted = this.totalWork;
        this.updater(100);
    };
    return ProgressMonitor;
}());
exports.ProgressMonitor = ProgressMonitor;
var NoopProgressMonitor = /** @class */ (function () {
    function NoopProgressMonitor() {
    }
    NoopProgressMonitor.prototype.workDone = function (amount) {
    };
    NoopProgressMonitor.prototype.completed = function () {
    };
    return NoopProgressMonitor;
}());
exports.NoopProgressMonitor = NoopProgressMonitor;
var AggregateProgressMonitor = /** @class */ (function () {
    function AggregateProgressMonitor(updater) {
        this.stages = [];
        this.updater = updater;
    }
    AggregateProgressMonitor.prototype.addStage = function (part, totalWork) {
        var _this = this;
        this.stages.push({
            part: part,
            monitor: new ProgressMonitor(totalWork, function () { return _this._onUpdate(); })
        });
    };
    AggregateProgressMonitor.prototype.workDone = function (stageNumber, amount) {
        var stage = this.stages[stageNumber];
        if (stage == null) {
            throw new Error("No stage at index" + stageNumber);
        }
        stage.monitor.workDone(amount);
    };
    AggregateProgressMonitor.prototype.completedStage = function (stage) {
        this.stages[stage].monitor.completed();
    };
    AggregateProgressMonitor.prototype.completedAll = function () {
        this.stages.forEach(function (s) { return (s.monitor.workCompleted = s.monitor.totalWork); });
        this._onUpdate();
    };
    AggregateProgressMonitor.prototype.setStageTotalWork = function (stageNumber, totalWork) {
        var stage = this.stages[stageNumber];
        if (stage == null) {
            throw new Error("No stage at index" + stageNumber);
        }
        stage.monitor.totalWork = totalWork;
    };
    AggregateProgressMonitor.prototype._onUpdate = function () {
        var total = this.stages.reduce(function (acc, stage) { return acc + stage.monitor.percentage() * stage.part; }, 0);
        console.log("monitor percentage: ", this.stages.map(function (s) { return s.monitor.percentage(); }), " total: ", total);
        this.updater(total);
    };
    return AggregateProgressMonitor;
}());
exports.AggregateProgressMonitor = AggregateProgressMonitor;
function makeTrackedProgressMonitor(tracker, totalWork) {
    if (totalWork < 1)
        return new NoopProgressMonitor();
    var handle = tracker.registerMonitor(totalWork);
    return (0, tutanota_utils_1.assertNotNull)(tracker.getMonitor(handle));
}
exports.makeTrackedProgressMonitor = makeTrackedProgressMonitor;
