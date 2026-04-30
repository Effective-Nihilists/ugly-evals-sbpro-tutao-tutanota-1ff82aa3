"use strict";
exports.__esModule = true;
exports.ProgressMonitorDelegate = void 0;
var ProgressMonitorDelegate = /** @class */ (function () {
    function ProgressMonitorDelegate(totalAmount, worker) {
        this._worker = worker;
        this._totalAmount = totalAmount;
        this._ref = this._worker.createProgressMonitor(totalAmount);
    }
    ProgressMonitorDelegate.prototype.workDone = function (amount) {
        var _this = this;
        this._ref.then(function (refIdentifier) {
            _this._worker.progressWorkDone(refIdentifier, amount);
        });
    };
    ProgressMonitorDelegate.prototype.completed = function () {
        var _this = this;
        this._ref.then(function (refIdentifier) {
            _this._worker.progressWorkDone(refIdentifier, _this._totalAmount);
        });
    };
    return ProgressMonitorDelegate;
}());
exports.ProgressMonitorDelegate = ProgressMonitorDelegate;
