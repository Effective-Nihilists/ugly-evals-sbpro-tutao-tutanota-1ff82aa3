"use strict";
exports.__esModule = true;
exports.IosNativeTransport = void 0;
var NativeLineProtocol_js_1 = require("../common/NativeLineProtocol.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Env_js_1 = require("../../api/common/Env.js");
(0, Env_js_1.assertMainOrNode)();
/**
 * Transport for communication between ios native and webview
 * Messages are passed from native via as eval()-type call which invokes sendMessageFromApp, see WebViewBridge.swift
 * window.tutao.nativeApp is injected during webview initialization
 */
var IosNativeTransport = /** @class */ (function () {
    function IosNativeTransport(window) {
        this.window = window;
        this.messageHandler = null;
        this.window.tutao.nativeApp = this;
    }
    IosNativeTransport.prototype.postMessage = function (message) {
        var encoded = (0, NativeLineProtocol_js_1.encodeNativeMessage)(message);
        // @ts-ignore this is set in the WebViewBrigde on Ios
        this.window.webkit.messageHandlers.nativeApp.postMessage(encoded);
    };
    IosNativeTransport.prototype.setMessageHandler = function (handler) {
        this.messageHandler = handler;
    };
    IosNativeTransport.prototype.receiveMessageFromApp = function (msg64) {
        var handler = this.messageHandler;
        if (handler) {
            var msg = (0, tutanota_utils_1.utf8Uint8ArrayToString)((0, tutanota_utils_1.base64ToUint8Array)(msg64));
            var parsed = (0, NativeLineProtocol_js_1.decodeNativeMessage)(msg);
            handler(parsed);
        }
        else {
            console.warn("Request from native but no handler is set!");
        }
    };
    return IosNativeTransport;
}());
exports.IosNativeTransport = IosNativeTransport;
