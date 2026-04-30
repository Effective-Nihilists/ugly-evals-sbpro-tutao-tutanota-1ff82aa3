"use strict";
var _a;
exports.__esModule = true;
exports.get = exports.animations = exports.fontSize = exports.width = exports.height = exports.opacity = exports.alpha = exports.scroll = exports.transform = exports.Animation = exports.DefaultAnimationTime = void 0;
var Easing_1 = require("./Easing");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Color_1 = require("../base/Color");
var Env_1 = require("../../api/common/Env");
(0, Env_1.assertMainOrNodeBoot)();
exports.DefaultAnimationTime = 200; // ms
var InitializedOptions = {
    stagger: 0,
    delay: 0,
    easing: Easing_1.ease.linear,
    duration: exports.DefaultAnimationTime
};
var Animations = /** @class */ (function () {
    function Animations() {
        var _this = this;
        this.activeAnimations = [];
        this._animate = function () {
            var finished = [];
            var now = window.performance.now();
            for (var _i = 0, _a = _this.activeAnimations; _i < _a.length; _i++) {
                var animation = _a[_i];
                animation.animateFrame(now);
                if (animation.isFinished()) {
                    finished.push(animation);
                }
            }
            for (var _b = 0, finished_1 = finished; _b < finished_1.length; _b++) {
                var animation = finished_1[_b];
                _this.activeAnimations.splice(_this.activeAnimations.indexOf(animation), 1);
                if (animation.resolve) {
                    animation.resolve();
                }
            }
            if (_this.activeAnimations.length > 0) {
                window.requestAnimationFrame(_this._animate);
            }
        };
    }
    /**
     * Adds an animation that should be executed immediately. Returns a promise that resolves after the animation is complete.
     */
    Animations.prototype.add = function (targets, mutations, options) {
        var _this = this;
        var targetsArray = targets instanceof HTMLElement ? [targets] : Array.from(targets);
        var targetMutations;
        if (!(mutations instanceof Array)) {
            targetMutations = [mutations];
        }
        else {
            targetMutations = mutations;
        }
        var verifiedOptions = Animations.verifiyOptions(options);
        var willChange = targetMutations
            .map(function (mutation) { return mutation.willChange(); })
            .filter(function (willChange) { return willChange.length; })
            .join(" ");
        targetsArray.forEach(function (t) { return (t.style.willChange = willChange); });
        var animations = [];
        var promise = new Promise(function (resolve) {
            var start = _this.activeAnimations.length ? false : true;
            for (var i = 0; i < targetsArray.length; i++) {
                var delay = verifiedOptions.delay;
                if (verifiedOptions.stagger) {
                    delay += verifiedOptions.stagger * i;
                }
                var animation = new Animation(targetsArray[i], targetMutations, i === targetsArray.length - 1 ? resolve : null, delay, verifiedOptions.easing, verifiedOptions.duration);
                animations.push(animation);
                _this.activeAnimations.push(animation);
            }
            if (start) {
                window.requestAnimationFrame(_this._animate);
            }
        });
        var animationPromise = (0, tutanota_utils_1.downcast)(promise);
        animationPromise.animations = animations;
        return animationPromise;
    };
    Animations.prototype.cancel = function (animation) {
        this.activeAnimations.splice(this.activeAnimations.indexOf(animation), 1);
        if (animation.resolve) {
            animation.resolve();
        }
    };
    Animations.verifiyOptions = function (options) {
        return Object.assign({}, InitializedOptions, options);
    };
    return Animations;
}());
var Animation = /** @class */ (function () {
    function Animation(target, mutations, resolve, delay, easing, duration) {
        if (duration === void 0) { duration = exports.DefaultAnimationTime; }
        this.target = target;
        this.mutations = mutations;
        this.resolve = resolve;
        this.delay = delay;
        this.duration = duration;
        this.animationStart = null;
        this.runTime = null;
        this.easing = easing;
    }
    Animation.prototype.animateFrame = function (now) {
        if (this.animationStart == null)
            this.animationStart = now;
        this.runTime = Math.min(now - this.animationStart - this.delay, this.duration);
        if (this.runTime >= 0) {
            for (var _i = 0, _a = this.mutations; _i < _a.length; _i++) {
                var m = _a[_i];
                m.updateDom(this.target, this.runTime / this.duration, this.easing);
            }
        }
    };
    Animation.prototype.isFinished = function () {
        return this.runTime != null && this.runTime >= this.duration;
    };
    return Animation;
}());
exports.Animation = Animation;
function transform(type, begin, end) {
    var values = {};
    values[type] = {
        begin: begin,
        end: end
    };
    var updateDom = function (target, percent, easing) {
        target.style.transform = buildTransformString(values, percent, easing);
    };
    var willChange = function () { return "transform"; };
    var chain = function (type, begin, end) {
        values[type] = {
            begin: begin,
            end: end
        };
        return {
            updateDom: updateDom,
            chain: chain,
            willChange: willChange
        };
    };
    return {
        updateDom: updateDom,
        chain: chain,
        willChange: willChange
    };
}
exports.transform = transform;
function scroll(begin, end) {
    return {
        updateDom: function (target, percent, easing) {
            target.scrollTop = calculateValue(percent, begin, end, easing);
        },
        willChange: function () { return ""; }
    };
}
exports.scroll = scroll;
var TransformUnits = (_a = {},
    _a["translateX" /* TransformEnum.TranslateX */] = "px",
    _a["translateY" /* TransformEnum.TranslateY */] = "px",
    _a["rotateY" /* TransformEnum.RotateY */] = "deg",
    _a["rotateZ" /* TransformEnum.RotateZ */] = "deg",
    _a["scale" /* TransformEnum.Scale */] = "",
    _a);
function buildTransformString(values, percent, easing) {
    var transform = [];
    var types = Object.keys(TransformUnits); // the order is important (e.g. 'rotateY(45deg) translateX(10px)' leads to other results than 'translateX(10px) rotateY(45deg)'
    for (var _i = 0, types_1 = types; _i < types_1.length; _i++) {
        var type = types_1[_i];
        if (values[type]) {
            var value = calculateValue(percent, values[type].begin, values[type].end, easing);
            transform.push(type + "(" + value + TransformUnits[type] + ")");
        }
    }
    return transform.join(" ");
}
/**
 * We use the alpha channel instead of using opacity for fading colors. Opacity changes are slow on mobile devices as they
 * effect the whole tree of the dom element with changing opacity.
 *
 * See http://stackoverflow.com/a/14677373 for a more detailed explanation.
 */
function alpha(type, colorHex, begin, end) {
    var color = (0, Color_1.hexToRgb)(colorHex);
    return {
        updateDom: function (target, percent, easing) {
            var alphaChannel = calculateValue(percent, begin, end, easing);
            if (type === "backgroundColor" /* AlphaEnum.BackgroundColor */) {
                target.style.backgroundColor = "rgba(".concat(color.r, ", ").concat(color.g, ", ").concat(color.b, ", ").concat(alphaChannel, ")");
            }
            else if (type === "color" /* AlphaEnum.Color */) {
                target.style.color = "rgba(".concat(color.r, ", ").concat(color.g, ", ").concat(color.b, ", ").concat(alphaChannel, ")");
            }
        },
        willChange: function () { return "alpha"; }
    };
}
exports.alpha = alpha;
/**
 * Only use on small elements. You should use Alpha for fading large backgrounds which is way faster on mobiles.
 */
function opacity(begin, end, keepValue) {
    var initialOpacity = null;
    return {
        updateDom: function (target, percent, easing) {
            if (percent === 0 && initialOpacity === null) {
                initialOpacity = target.style.opacity;
            }
            var opacity = calculateValue(percent, begin, end, easing);
            if (percent === 1 && !keepValue) {
                // on some elements the value hast to be set to the initial value because hover using opacity won't work otherwise.
                target.style.opacity = initialOpacity ? initialOpacity : "";
            }
            else {
                target.style.opacity = opacity + "";
            }
        },
        willChange: function () { return "opacity"; }
    };
}
exports.opacity = opacity;
function height(begin, end) {
    return {
        updateDom: function (target, percent, easing) {
            target.style.height = calculateValue(percent, begin, end, easing) + "px";
        },
        willChange: function () { return "height"; }
    };
}
exports.height = height;
function width(begin, end) {
    return {
        updateDom: function (target, percent, easing) {
            target.style.width = calculateValue(percent, begin, end, easing) + "px";
        },
        willChange: function () { return "width"; }
    };
}
exports.width = width;
function fontSize(begin, end) {
    return {
        updateDom: function (target, percent, easing) {
            target.style.fontSize = calculateValue(percent, begin, end, easing) + "px";
        },
        willChange: function () { return ""; }
    };
}
exports.fontSize = fontSize;
function calculateValue(percent, begin, end, easing) {
    return (end - begin) * easing(percent) + begin;
}
exports.animations = new Animations();
function get(element) {
    if (!element)
        throw new Error("tried to update a non existing element");
    return element;
}
exports.get = get;
