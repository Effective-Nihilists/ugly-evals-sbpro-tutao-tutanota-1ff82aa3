"use strict";
exports.__esModule = true;
exports.AndroidNativeTransport = void 0;
var NativeLineProtocol_js_1 = require("../common/NativeLineProtocol.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Env_js_1 = require("../../api/common/Env.js");
(0, Env_js_1.assertMainOrNode)();
/**
 * Transport for communication between android native and webview, using WebMessagePorts for two-way communication.
 * The interface `nativeApp.startWebMessageChannel` is defined in Native.java in order to initiate the setup of the port channel
 */
var AndroidNativeTransport = /** @class */ (function () {
    function AndroidNativeTransport(window) {
        this.window = window;
        this.messageHandler = null;
        this.deferredPort = (0, tutanota_utils_1.defer)();
    }
    /**
     * Creates a global `window.onmessage` handler, and then tells native to create the messageport channel
     */
    AndroidNativeTransport.prototype.start = function () {
        var _this = this;
        // We will receive a message from native after the call to
        // window.nativeApp.startWebMessageChannel
        this.window.onmessage = function (message) {
            // All further messages to and from native will be via this port
            var port = message.ports[0];
            port.onmessage = function (messageEvent) {
                var handler = _this.messageHandler;
                if (handler) {
                    // We can be sure we have a string here, because
                    // Android only allows sending strings across MessagePorts
                    var response = (0, NativeLineProtocol_js_1.decodeNativeMessage)(messageEvent.data);
                    handler(response);
                }
            };
            _this.deferredPort.resolve(port);
        };
        // window.nativeApp is defined in Native.java using WebView.addJavaScriptInterface
        // The native side needs to initialize the WebMessagePorts
        // We have to tell it when we are ready, otherwise it will happen too early and we won't receive the message event
        this.window.nativeApp.startWebMessageChannel();
    };
    AndroidNativeTransport.prototype.postMessage = function (message) {
        var encoded = (0, NativeLineProtocol_js_1.encodeNativeMessage)(message);
        this.deferredPort.promise.then(function (port) { return port.postMessage(encoded); });
    };
    AndroidNativeTransport.prototype.setMessageHandler = function (handler) {
        this.messageHandler = handler;
    };
    return AndroidNativeTransport;
}());
exports.AndroidNativeTransport = AndroidNativeTransport;
