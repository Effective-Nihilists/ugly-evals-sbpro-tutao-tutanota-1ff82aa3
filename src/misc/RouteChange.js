"use strict";
exports.__esModule = true;
exports.navButtonRoutes = exports.SETTINGS_PREFIX = exports.SEARCH_PREFIX = exports.CALENDAR_PREFIX = exports.CONTACTS_PREFIX = exports.MAIL_PREFIX = exports.throttleRoute = void 0;
var mithril_1 = require("mithril");
var Env_1 = require("../api/common/Env");
(0, Env_1.assertMainOrNodeBoot)();
function throttleRoute() {
    var limit = 200;
    var lastCall = 0;
    return function (url) {
        var now = new Date().getTime();
        mithril_1["default"].route.set(url, null, {
            replace: now - lastCall < limit
        });
        lastCall = now;
    };
}
exports.throttleRoute = throttleRoute;
exports.MAIL_PREFIX = "/mail";
exports.CONTACTS_PREFIX = "/contact";
exports.CALENDAR_PREFIX = "/calendar";
exports.SEARCH_PREFIX = "/search";
exports.SETTINGS_PREFIX = "/settings";
exports.navButtonRoutes = {
    mailUrl: exports.MAIL_PREFIX,
    contactsUrl: exports.CONTACTS_PREFIX,
    calendarUrl: exports.CALENDAR_PREFIX,
    settingsUrl: exports.SETTINGS_PREFIX
};
