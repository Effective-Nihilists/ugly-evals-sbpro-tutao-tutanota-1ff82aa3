"use strict";
exports.__esModule = true;
exports.show = void 0;
var mithril_1 = require("mithril");
var size_1 = require("../size");
var Animations_1 = require("../animation/Animations");
var Overlay_1 = require("./Overlay");
var Button_js_1 = require("./Button.js");
var Env_1 = require("../../api/common/Env");
(0, Env_1.assertMainOrNode)();
var notificationQueue = [];
var currentAnimationTimeout = null;
var NotificationOverlay = /** @class */ (function () {
    function NotificationOverlay() {
    }
    NotificationOverlay.prototype.view = function (vnode) {
        return (0, mithril_1["default"])(".notification-overlay-content.flex.flex-column.flex-space-between", [
            (0, mithril_1["default"])(vnode.attrs.message),
            (0, mithril_1["default"])(".flex.justify-end.flex-wrap", vnode.attrs.buttons.map(function (b) { return (0, mithril_1["default"])(Button_js_1.Button, b); })),
        ]);
    };
    return NotificationOverlay;
}());
/**
 * @param message What will be shown inside notification
 * @param closeButtonAttrs To define the close button in the notification
 * @param buttons The postpone button is automatically added and does not have to be passed from outside
 */
function show(message, closeButtonAttrs, buttons) {
    notificationQueue.push({
        message: message,
        buttons: buttons,
        closeButtonAttrs: closeButtonAttrs
    });
    if (notificationQueue.length > 1) {
        // another notification is already visible. Next notification will be shown when closing current notification
        return;
    }
    showNextNotification();
}
exports.show = show;
function showNextNotification() {
    var _a = notificationQueue[0], message = _a.message, buttons = _a.buttons, closeButtonAttrs = _a.closeButtonAttrs;
    currentAnimationTimeout = null;
    var width = window.innerWidth;
    var margin = (width - Math.min(400, width)) / 2;
    var allButtons = buttons.slice();
    var overlayRect = {
        top: (0, size_1.px)(0),
        left: (0, size_1.px)(margin),
        right: (0, size_1.px)(margin)
    };
    var closeFunction = (0, Overlay_1.displayOverlay)(function () { return overlayRect; }, {
        view: function () {
            return (0, mithril_1["default"])(NotificationOverlay, {
                message: message,
                buttons: allButtons
            });
        }
    }, function (dom) { return (0, Animations_1.transform)("translateY" /* TransformEnum.TranslateY */, -dom.offsetHeight, 0); }, function (dom) { return (0, Animations_1.transform)("translateY" /* TransformEnum.TranslateY */, 0, -dom.offsetHeight); });
    var closeAndOpenNext = function () {
        if (currentAnimationTimeout !== null) {
            return;
        }
        closeFunction();
        notificationQueue.shift();
        if (notificationQueue.length > 0) {
            currentAnimationTimeout = setTimeout(showNextNotification, 2 * Animations_1.DefaultAnimationTime);
        }
    };
    // close the notification by default when pressing any button
    allButtons.forEach(function (b) {
        var originClickHandler = b.click;
        b.click = function (e, dom) {
            originClickHandler === null || originClickHandler === void 0 ? void 0 : originClickHandler(e, dom);
            closeAndOpenNext();
        };
    });
    // add the postpone button
    var closeFinalAttrs = Object.assign({}, {
        label: "close_alt",
        click: closeAndOpenNext,
        type: "secondary" /* ButtonType.Secondary */
    }, closeButtonAttrs);
    closeFinalAttrs.click = function (e, dom) {
        closeButtonAttrs.click && closeButtonAttrs.click(e, dom);
        closeAndOpenNext();
    };
    allButtons.unshift(closeFinalAttrs);
    mithril_1["default"].redraw();
}
