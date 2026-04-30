"use strict";
exports.__esModule = true;
exports.openCalendar = exports.openMailbox = void 0;
var mithril_1 = require("mithril");
var LoginController_1 = require("../../api/main/LoginController");
var MainLocator_1 = require("../../api/main/MainLocator");
var MailUtils_1 = require("../../mail/model/MailUtils");
function openMailbox(userId, mailAddress, requestedPath) {
    if (LoginController_1.logins.isUserLoggedIn() && LoginController_1.logins.getUserController().user._id === userId) {
        if (!requestedPath) {
            MainLocator_1.locator.mailModel.getMailboxDetails().then(function (mailboxDetails) { return mithril_1["default"].route.set("/mail/" + (0, MailUtils_1.getInboxFolder)(mailboxDetails[0].folders).mails); });
        }
        else {
            mithril_1["default"].route.set("/mail" + requestedPath);
        }
    }
    else {
        if (!requestedPath) {
            mithril_1["default"].route.set("/login?noAutoLogin=false&userId=".concat(userId, "&loginWith=").concat(mailAddress));
        }
        else {
            mithril_1["default"].route.set("/login?noAutoLogin=false&userId=".concat(userId, "&loginWith=").concat(mailAddress, "&requestedPath=").concat(encodeURIComponent(requestedPath)));
        }
    }
}
exports.openMailbox = openMailbox;
function openCalendar(userId) {
    if (LoginController_1.logins.isUserLoggedIn() && LoginController_1.logins.getUserController().user._id === userId) {
        mithril_1["default"].route.set("/calendar/agenda");
    }
    else {
        mithril_1["default"].route.set("/login?noAutoLogin=false&userId=".concat(userId, "&requestedPath=").concat(encodeURIComponent("/calendar/agenda")));
    }
}
exports.openCalendar = openCalendar;
