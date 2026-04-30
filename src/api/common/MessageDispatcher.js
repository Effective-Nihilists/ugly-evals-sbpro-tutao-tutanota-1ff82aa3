"use strict";
exports.__esModule = true;
exports.errorToObj = exports.MessageDispatcher = exports.RequestError = exports.Response = exports.Request = exports.WorkerTransport = void 0;
/**
 * <ul>
 *   <li>The client sends {WorkerRequest}s to the worker and the worker answers with either an {WorkerResponse} or a {WorkerError}.
 *   <li>The worker sends {ClientCommands}s to the client. The commands are executed by the client (without any response to the worker).
 * </ul>
 */
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Utils_1 = require("./utils/Utils");
var Env_1 = require("./Env");
/**
 * Queue transport for both WorkerClient and WorkerImpl
 */
var WorkerTransport = /** @class */ (function () {
    function WorkerTransport(worker) {
        this._worker = worker;
    }
    WorkerTransport.prototype.postMessage = function (message) {
        return this._worker.postMessage(message);
    };
    WorkerTransport.prototype.setMessageHandler = function (handler) {
        this._worker.onmessage = function (ev) { return handler((0, tutanota_utils_1.downcast)(ev.data)); };
    };
    return WorkerTransport;
}());
exports.WorkerTransport = WorkerTransport;
var Request = /** @class */ (function () {
    function Request(type, args, requestId) {
        if (requestId === void 0) { requestId = null; }
        this.type = "request";
        this.requestType = type;
        this.id = requestId !== null && requestId !== void 0 ? requestId : _createRequestId();
        this.args = args.slice();
    }
    return Request;
}());
exports.Request = Request;
var Response = /** @class */ (function () {
    function Response(id, value) {
        this.type = "response";
        this.id = id;
        this.value = value;
    }
    return Response;
}());
exports.Response = Response;
var RequestError = /** @class */ (function () {
    function RequestError(id, error) {
        this.type = "requestError";
        this.id = id;
        this.error = errorToObj(error); // the structured clone algorithm is not able to clone errors
    }
    return RequestError;
}());
exports.RequestError = RequestError;
/**
 * Handles remote invocations (e.g. worker or native calls).
 */
var MessageDispatcher = /** @class */ (function () {
    function MessageDispatcher(transport, commands) {
        var _this = this;
        this._messages = {};
        this._commands = commands;
        this._transport = transport;
        this._transport.setMessageHandler(function (msg) { return _this.handleMessage(msg); });
    }
    MessageDispatcher.prototype.postRequest = function (msg) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._messages[msg.id] = {
                resolve: resolve,
                reject: reject
            };
            try {
                _this._transport.postMessage(msg);
            }
            catch (e) {
                console.log("error payload:", msg.id, msg.type);
                throw e;
            }
        });
    };
    MessageDispatcher.prototype.handleMessage = function (message) {
        var _this = this;
        if (message.type === "response") {
            var pendingRequest = this._messages[message.id];
            if (pendingRequest != null) {
                pendingRequest.resolve(message.value);
                delete this._messages[message.id];
            }
            else {
                console.warn("Unexpected response: ".concat(message.id, " (was the page reloaded?)"));
            }
        }
        else if (message.type === "requestError") {
            var pendingRequest = this._messages[message.id];
            if (pendingRequest != null) {
                pendingRequest.reject((0, Utils_1.objToError)(message.error));
                delete this._messages[message.id];
            }
            else {
                console.warn("Unexpected error response: ".concat(message.id, " (was the page reloaded?)"));
            }
        }
        else if (message.type === "request") {
            var command = this._commands[message.requestType];
            if (command != null) {
                var commandResult = command(message);
                // Every method exposed via worker protocol must return a promise. Failure to do so is a violation of contract so we
                // try to catch it early and throw an error.
                if (commandResult == null || typeof commandResult.then !== "function") {
                    throw new Error("Handler returned non-promise result: ".concat(message.requestType));
                }
                commandResult
                    .then(function (value) {
                    _this._transport.postMessage(new Response(message.id, value));
                }, function (error) {
                    _this._transport.postMessage(new RequestError(message.id, error));
                });
            }
            else {
                var error = new Error("unexpected request: ".concat(message.id, ", ").concat(message.requestType));
                if ((0, Env_1.isWorker)()) {
                    this._transport.postMessage(new RequestError(message.id, error));
                }
                else {
                    throw error;
                }
            }
        }
        else {
            throw new Error("Unexpected request type: ".concat(JSON.stringify(message)));
        }
    };
    return MessageDispatcher;
}());
exports.MessageDispatcher = MessageDispatcher;
var requestId = 0;
function _createRequestId() {
    if (requestId >= Number.MAX_SAFE_INTEGER) {
        requestId = 0;
    }
    var prefix;
    if ((0, Env_1.isWorker)()) {
        prefix = "worker";
    }
    else if (typeof window != "undefined") {
        prefix = "main";
    }
    else {
        prefix = "desktop";
    }
    return prefix + requestId++;
}
// Serialize error stack traces, when they are sent via the websocket.
function errorToObj(error) {
    var errorErased = error;
    return {
        name: errorErased.name,
        message: errorErased.message,
        stack: errorErased.stack,
        data: errorErased.data
    };
}
exports.errorToObj = errorToObj;
