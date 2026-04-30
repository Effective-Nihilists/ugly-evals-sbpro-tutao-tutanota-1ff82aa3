"use strict";
exports.__esModule = true;
exports.DesktopNativeTransport = void 0;
var Env_js_1 = require("../../api/common/Env.js");
(0, Env_js_1.assertMainOrNode)();
/**
 * Transport for communication between electron native and webview
 * Uses window.nativeApp, which is injected by the preload script in desktop mode
 * electron can handle message passing without jsonification
 */
var DesktopNativeTransport = /** @class */ (function () {
    function DesktopNativeTransport(nativeApp) {
        this.nativeApp = nativeApp;
    }
    DesktopNativeTransport.prototype.postMessage = function (message) {
        this.nativeApp.invoke(message);
    };
    DesktopNativeTransport.prototype.setMessageHandler = function (handler) {
        this.nativeApp.attach(handler);
    };
    return DesktopNativeTransport;
}());
exports.DesktopNativeTransport = DesktopNativeTransport;
