"use strict";
exports.__esModule = true;
exports.getThemeCustomizations = exports.getWhitelabelCustomizations = void 0;
var Env_1 = require("../api/common/Env");
(0, Env_1.assertMainOrNodeBoot)();
/**
 * window.whitelabelCustomizations is defined when the user has logged in via a whitelabel domain. index.js is rewritten to have the definition
 * this happens at WhitelabelResourceRewriter.java
 */
function getWhitelabelCustomizations(window) {
    // @ts-ignore
    return window.whitelabelCustomizations;
}
exports.getWhitelabelCustomizations = getWhitelabelCustomizations;
function getThemeCustomizations(whitelabelConfig) {
    return JSON.parse(whitelabelConfig.jsonTheme, function (k, v) { return (k === "__proto__" ? undefined : v); });
}
exports.getThemeCustomizations = getThemeCustomizations;
