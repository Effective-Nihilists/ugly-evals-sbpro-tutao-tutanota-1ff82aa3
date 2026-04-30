"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.timer = exports.log = exports.enable = exports.Cat = void 0;
var Env_1 = require("../api/common/Env");
(0, Env_1.assertMainOrNodeBoot)();
exports.Cat = {
    css: {
        name: "css",
        color: "orange"
    },
    mithril: {
        name: "mithril",
        color: "darkgreen"
    },
    error: {
        name: "error",
        color: "red"
    },
    info: {
        name: "info",
        color: "lightblue"
    },
    debug: {
        name: "debug",
        color: "#009688"
    }
};
var activeCategories = [];
function enable(cat) {
    activeCategories.push(cat);
}
exports.enable = enable;
function log(category, message) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    if (activeCategories.indexOf(category) === -1)
        return;
    console.log.apply(console, __spreadArray(["%c" + category.name, "color:" + category.color, message], args, false));
}
exports.log = log;
function timer(category) {
    if (activeCategories.indexOf(category) === -1) {
        return function () {
        };
    }
    var start = window.performance.now();
    return function () {
        return Math.round(window.performance.now() - start);
    };
}
exports.timer = timer;
