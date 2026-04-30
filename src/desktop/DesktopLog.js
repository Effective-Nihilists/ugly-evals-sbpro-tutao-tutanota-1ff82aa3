"use strict";
exports.__esModule = true;
exports.rebindDesktopLog = exports.log = void 0;
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Env_1 = require("../api/common/Env");
exports.log = typeof env !== "undefined" && env.mode === Env_1.Mode.Test
    ? {
        debug: tutanota_utils_1.noOp,
        warn: tutanota_utils_1.noOp,
        error: tutanota_utils_1.noOp,
        info: tutanota_utils_1.noOp
    }
    : makeLog();
function rebindDesktopLog() {
    Object.assign(exports.log, makeLog());
}
exports.rebindDesktopLog = rebindDesktopLog;
function makeLog() {
    return {
        debug: console.log.bind(console),
        warn: console.warn.bind(console),
        error: console.error.bind(console),
        info: console.info.bind(console)
    };
}
