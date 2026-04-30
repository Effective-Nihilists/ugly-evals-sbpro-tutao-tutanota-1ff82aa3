"use strict";
exports.__esModule = true;
exports.notifications = exports.Notifications = void 0;
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Env_1 = require("../api/common/Env");
var Icons_1 = require("./base/icons/Icons");
var Notifications = /** @class */ (function () {
    function Notifications() {
    }
    Notifications.prototype.showNotification = function (title, options, onclick) {
        if (onclick === void 0) { onclick = tutanota_utils_1.noOp; }
        if (!(0, Env_1.isApp)()
            && typeof window.Notification !== "undefined"
            && window.Notification.permission === "granted") {
            try {
                var actualOptions = Object.assign({}, {
                    icon: Icons_1.NotificationIcon
                }, options);
                var notification = new window.Notification(title, actualOptions);
                notification.onclick = onclick;
                return notification;
            }
            catch (e) {
                // new Notification() throws an error in new chrome browsers on android devices.
                // According to the error message ServiceWorkerRegistration.showNotification() should be used instead.
                // This is currently not available on our test devices, so ignore notification errors.
                // Setails: http://stackoverflow.com/questions/29774836/failed-to-construct-notification-illegal-constructor
                console.warn("notification error", e);
            }
        }
        return null;
    };
    /**
     * Requests user permission if notifications are supported
     * @returns {Promise<boolean>} resolves to "true" if we can send notifications.
     */
    Notifications.prototype.requestPermission = function () {
        if ((0, Env_1.isDesktop)() || (0, Env_1.isApp)() || typeof Notification === "undefined") {
            return;
        }
        try {
            if (window.Notification.permission !== "denied") {
                window.Notification.requestPermission();
            }
        }
        catch (e) {
            console.log("request notification permission error", e);
        }
    };
    return Notifications;
}());
exports.Notifications = Notifications;
exports.notifications = new Notifications();
