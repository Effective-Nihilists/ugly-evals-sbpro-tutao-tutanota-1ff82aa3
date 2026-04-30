"use strict";
exports.__esModule = true;
exports.getTimeFromMousePos = exports.getDateFromMousePos = exports.askIfShouldSendCalendarUpdatesToAttendees = exports.renderCalendarSwitchRightButton = exports.renderCalendarSwitchLeftButton = void 0;
var mithril_1 = require("mithril");
var Button_js_1 = require("../../gui/base/Button.js");
var Dialog_1 = require("../../gui/base/Dialog");
var Time_1 = require("../../api/common/utils/Time");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var tutanota_utils_2 = require("@tutao/tutanota-utils");
function renderCalendarSwitchLeftButton(label, switcher) {
    return (0, mithril_1["default"])(Button_js_1.Button, {
        label: label,
        icon: function () { return "ArrowDropLeft" /* Icons.ArrowDropLeft */; },
        type: "action-large" /* ButtonType.ActionLarge */,
        colors: "drawernav" /* ButtonColor.DrawerNav */,
        click: switcher
    });
}
exports.renderCalendarSwitchLeftButton = renderCalendarSwitchLeftButton;
function renderCalendarSwitchRightButton(label, switcher) {
    return (0, mithril_1["default"])(Button_js_1.Button, {
        label: label,
        icon: function () { return "ArrowDropRight" /* Icons.ArrowDropRight */; },
        type: "action-large" /* ButtonType.ActionLarge */,
        colors: "drawernav" /* ButtonColor.DrawerNav */,
        click: switcher
    });
}
exports.renderCalendarSwitchRightButton = renderCalendarSwitchRightButton;
function askIfShouldSendCalendarUpdatesToAttendees() {
    return new Promise(function (resolve) {
        var alertDialog;
        var cancelButton = {
            label: "cancel_action",
            click: function () {
                resolve("cancel");
                alertDialog.close();
            },
            type: "secondary" /* ButtonType.Secondary */
        };
        var noButton = {
            label: "no_label",
            click: function () {
                resolve("no");
                alertDialog.close();
            },
            type: "secondary" /* ButtonType.Secondary */
        };
        var yesButton = {
            label: "yes_label",
            click: function () {
                resolve("yes");
                alertDialog.close();
            },
            type: "primary" /* ButtonType.Primary */
        };
        var onclose = function (positive) { return (positive ? resolve("yes") : resolve("cancel")); };
        alertDialog = Dialog_1.Dialog.confirmMultiple("sendUpdates_msg", [cancelButton, noButton, yesButton], onclose);
    });
}
exports.askIfShouldSendCalendarUpdatesToAttendees = askIfShouldSendCalendarUpdatesToAttendees;
/**
 * Map the location of a mouse click on an element to a give date, given a list of weeks
 * there should be neither zero weeks, nor zero length weeks
 */
function getDateFromMousePos(_a, weeks) {
    var x = _a.x, y = _a.y, targetWidth = _a.targetWidth, targetHeight = _a.targetHeight;
    (0, tutanota_utils_1.assert)(weeks.length > 0, "Weeks must not be zero length");
    var unitHeight = targetHeight / weeks.length;
    var currentSquareY = Math.floor(y / unitHeight);
    var week = weeks[(0, tutanota_utils_2.clamp)(currentSquareY, 0, weeks.length - 1)];
    (0, tutanota_utils_1.assert)(week.length > 0, "Week must not be zero length");
    var unitWidth = targetWidth / week.length;
    var currentSquareX = Math.floor(x / unitWidth);
    return week[(0, tutanota_utils_2.clamp)(currentSquareX, 0, week.length - 1)];
}
exports.getDateFromMousePos = getDateFromMousePos;
/**
 * Map the vertical position of a mouse click on an element to a time of day
 * @param y
 * @param targetHeight
 * @param hourDivision: how many times to divide the hour
 */
function getTimeFromMousePos(_a, hourDivision) {
    var y = _a.y, targetHeight = _a.targetHeight;
    var sectionHeight = targetHeight / 24;
    var hour = y / sectionHeight;
    var hourRounded = Math.floor(hour);
    var minutesInc = 60 / hourDivision;
    var minute = Math.floor((hour - hourRounded) * hourDivision) * minutesInc;
    return new Time_1.Time(hourRounded, minute);
}
exports.getTimeFromMousePos = getTimeFromMousePos;
