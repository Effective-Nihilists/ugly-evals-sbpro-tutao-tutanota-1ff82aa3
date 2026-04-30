"use strict";
exports.__esModule = true;
exports.EntropyCollector = void 0;
var Env_1 = require("../common/Env");
(0, Env_1.assertMainOrNode)();
/**
 * Automatically collects entropy from various events and sends it to the randomizer in the worker regularly.
 */
var EntropyCollector = /** @class */ (function () {
    function EntropyCollector(worker) {
        var _this = this;
        this._worker = worker;
        this.SEND_INTERVAL = 5000;
        this.stopped = true;
        this._entropyCache = [];
        this._mouse = function (e) {
            var value = e.clientX ^ e.clientY;
            _this._addEntropy(value, 2, "mouse");
        };
        this._keyDown = function (e) {
            var value = e.keyCode;
            _this._addEntropy(value, 2, "key");
        };
        this._touch = function (e) {
            var value = e.touches[0].clientX ^ e.touches[0].clientY;
            _this._addEntropy(value, 2, "touch");
        };
        this._accelerometer = function (e) {
            // DeviceMotionEvent
            if (window.orientation && typeof window.orientation === "number") {
                _this._addEntropy(window.orientation, 0, "accel");
            }
            if (!!e.accelerationIncludingGravity) {
                _this._addEntropy(e.accelerationIncludingGravity.x ^ e.accelerationIncludingGravity.y ^ e.accelerationIncludingGravity.z, 2, "accel");
            }
        };
    }
    /**
     * Adds entropy to the random number generator algorithm
     * @param number Any number value.
     * @param entropy The amount of entropy in the number in bit.
     * @param source The source of the number. One of RandomizerInterface.ENTROPY_SRC_*.
     */
    EntropyCollector.prototype._addEntropy = function (data, entropy, source) {
        if (data) {
            this._entropyCache.push({
                source: source,
                entropy: entropy,
                data: data
            });
        }
        if (typeof window !== "undefined" && window.performance && typeof window.performance.now === "function") {
            this._entropyCache.push({
                source: "time",
                entropy: 2,
                data: window.performance.now()
            });
        }
        else {
            this._entropyCache.push({
                source: "time",
                entropy: 2,
                data: new Date().valueOf()
            });
        }
    };
    EntropyCollector.prototype.start = function () {
        var _this = this;
        if (window.performance && window.performance.timing) {
            // get values from window.performance.timing
            var values = window.performance.timing;
            var added = [];
            for (var v in values) {
                if (typeof values[v] === "number" && values[v] !== 0) {
                    if (added.indexOf(values[v]) === -1) {
                        this._addEntropy(values[v], 1, "static");
                        added.push(values[v]);
                    }
                }
            }
        }
        window.addEventListener("mousemove", this._mouse);
        window.addEventListener("click", this._mouse);
        window.addEventListener("touchstart", this._touch);
        window.addEventListener("touchmove", this._touch);
        window.addEventListener("keydown", this._keyDown);
        window.addEventListener("devicemotion", this._accelerometer);
        setInterval(function () { return _this._sendEntropyToWorker(); }, this.SEND_INTERVAL);
        this.stopped = false;
    };
    /**
     * Add data from either secure random source or Math.random as entropy.
     */
    EntropyCollector.prototype._addNativeRandomValues = function (nbrOf32BitValues) {
        var valueList = new Uint32Array(nbrOf32BitValues);
        crypto.getRandomValues(valueList);
        for (var i = 0; i < valueList.length; i++) {
            // 32 because we have 32-bit values Uint32Array
            this._addEntropy(valueList[i], 32, "random");
        }
    };
    EntropyCollector.prototype._sendEntropyToWorker = function () {
        if (this._entropyCache.length > 0) {
            this._addNativeRandomValues(1);
            this._worker.entropy(this._entropyCache);
            this._entropyCache = [];
        }
    };
    EntropyCollector.prototype.stop = function () {
        this.stopped = true;
        window.removeEventListener("mousemove", this._mouse);
        window.removeEventListener("mouseclick", this._mouse);
        window.removeEventListener("touchstart", this._touch);
        window.removeEventListener("touchmove", this._touch);
        window.removeEventListener("keydown", this._keyDown);
        window.removeEventListener("devicemotion", this._accelerometer);
    };
    return EntropyCollector;
}());
exports.EntropyCollector = EntropyCollector;
