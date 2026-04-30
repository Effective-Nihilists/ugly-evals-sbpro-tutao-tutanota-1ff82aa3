"use strict";
exports.__esModule = true;
exports.decodeNativeMessage = exports.replaceWrapperByBytes = exports.replaceBytesWithWrapper = exports.encodeNativeMessage = void 0;
/**
 * this file contains the typescript implementation of the line protocol
 * for IPC used by the mobile apps that can't use the structured clone
 * algorithm.
 *
 * to prevent us from parsing the messages twice -- once as a dict to find
 * out the type and method, a second time to parse the arguments into
 * their actual types -- we use a line-based protocol. It supports
 * requests with arbitrary arguments, responses with a return value
 * and request errors with an attached error object and works as
 * follows:
 *
 * 	line		type		content				note
 *  [1] 		all			<type> 				"request", "response" or "responseError"
 *  [2]			all			<requestId>			a string like "main123", responses and errors cite the original requestId
 *  [3]			request		<method>			a string method name to invoke
 *  [3]			response	<return>			json-encoded return value
 *  [3]			error		<error>				json-encoded error object
 *  [4]			request		<arg0>				json-encoded first argument
 *  ...
 *  [n] 		request		<argx>				json-encoded last argument
 */
var MessageDispatcher_js_1 = require("../../api/common/MessageDispatcher.js");
var ProgrammingError_js_1 = require("../../api/common/error/ProgrammingError.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
/**
 * serialize a native message to the line protocol used in the apps
 * @param message
 */
function encodeNativeMessage(message) {
    var encodedMessage = [];
    encodedMessage.push(message.type);
    encodedMessage.push(message.id);
    switch (message.type) {
        case "request":
            encodedMessage.push(message.requestType);
            if (message.args.length === 0) {
                encodedMessage.push("");
            }
            for (var _i = 0, _a = message.args; _i < _a.length; _i++) {
                var arg = _a[_i];
                encodedMessage.push(encodeValueForNative(arg));
            }
            break;
        case "response":
            encodedMessage.push(encodeValueForNative(message.value));
            break;
        case "requestError":
            encodedMessage.push(encodeValueForNative(message.error));
            break;
    }
    return encodedMessage.join("\n");
}
exports.encodeNativeMessage = encodeNativeMessage;
function encodeValueForNative(value) {
    return JSON.stringify(replaceBytesWithWrapper(value));
}
var BYTES_MARKER = "__bytes";
function replaceBytesWithWrapper(value) {
    if (value == null) {
        return null;
    }
    else if (value instanceof Uint8Array) {
        return { data: (0, tutanota_utils_1.uint8ArrayToBase64)(value), marker: BYTES_MARKER };
    }
    else if (Array.isArray(value)) {
        return value.map(replaceBytesWithWrapper);
    }
    else if (typeof value === "object") {
        var newObject = {};
        for (var _i = 0, _a = Object.entries(value); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], field = _b[1];
            newObject[key] = replaceBytesWithWrapper(field);
        }
        return newObject;
    }
    else {
        return value;
    }
}
exports.replaceBytesWithWrapper = replaceBytesWithWrapper;
function replaceWrapperByBytes(value) {
    if (value == null) {
        return null;
    }
    else if (isByteWrapper(value)) {
        return (0, tutanota_utils_1.base64ToUint8Array)(value.data);
    }
    else if (Array.isArray(value)) {
        return value.map(replaceWrapperByBytes);
    }
    else if (typeof value === "object") {
        var newObject = {};
        for (var _i = 0, _a = Object.entries(value); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], field = _b[1];
            newObject[key] = replaceWrapperByBytes(field);
        }
        return newObject;
    }
    else {
        return value;
    }
}
exports.replaceWrapperByBytes = replaceWrapperByBytes;
function isByteWrapper(value) {
    return value != null
        && typeof value === "object"
        && value.marker === BYTES_MARKER
        && typeof value.data === "string";
}
/**
 * decode a string received over the native bridge in the apps into a native message object
 * @param encoded
 */
function decodeNativeMessage(encoded) {
    var _a = encoded.split("\n"), type = _a[0], messageId = _a[1], rest = _a.slice(2);
    var parsedMessage;
    switch (type) {
        case "request":
            var requestType = rest[0], args = rest.slice(1);
            parsedMessage = new MessageDispatcher_js_1.Request(requestType, args.map(function (s) { return decodeValueFromNative(s); }), messageId);
            break;
        case "response":
            var value = rest[0];
            parsedMessage = new MessageDispatcher_js_1.Response(messageId, decodeValueFromNative(value));
            break;
        case "requestError":
            var error = rest[0];
            parsedMessage = new MessageDispatcher_js_1.RequestError(messageId, decodeValueFromNative(error));
            break;
        default:
            throw new ProgrammingError_js_1.ProgrammingError("unknown message type: ".concat(type));
    }
    return parsedMessage;
}
exports.decodeNativeMessage = decodeNativeMessage;
function decodeValueFromNative(encoded) {
    return replaceWrapperByBytes(JSON.parse(encoded));
}
