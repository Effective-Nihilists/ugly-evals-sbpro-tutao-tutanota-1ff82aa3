"use strict";
exports.__esModule = true;
exports.isSuspensionResponse = exports.addParamsToUrl = exports.RestClient = void 0;
var Env_1 = require("../../common/Env");
var RestError_1 = require("../../common/error/RestError");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var TutanotaConstants_1 = require("../../common/TutanotaConstants");
var SuspensionError_js_1 = require("../../common/error/SuspensionError.js");
(0, Env_1.assertWorkerOrNode)();
/**
 * Allows REST communication with the server.
 * The RestClient observes upload/download progress and times
 * out in case no data is sent or received for a certain time.
 *
 * Uses XmlHttpRequest as there is still no support for tracking
 * upload progress with fetch (see https://stackoverflow.com/a/69400632)
 */
var RestClient = /** @class */ (function () {
    function RestClient(suspensionHandler) {
        // accurate to within a few seconds, depending on network speed
        this.serverTimeOffsetMs = null;
        this.id = 0;
        this.suspensionHandler = suspensionHandler;
    }
    RestClient.prototype.request = function (path, method, options) {
        var _this = this;
        var _a;
        if (options === void 0) { options = {}; }
        // @ts-ignore
        var debug = typeof self !== "undefined" && self.debug;
        var verbose = (0, Env_1.isWorker)() && debug;
        this.checkRequestSizeLimit(path, method, (_a = options.body) !== null && _a !== void 0 ? _a : null);
        if (this.suspensionHandler.isSuspended()) {
            return this.suspensionHandler.deferRequest(function () { return _this.request(path, method, options); });
        }
        else {
            return new Promise(function (resolve, reject) {
                var _a;
                _this.id++;
                if (!options.queryParams) {
                    options.queryParams = {};
                }
                if (method === "GET" /* HttpMethod.GET */ && typeof options.body === "string") {
                    options.queryParams["_body"] = options.body; // get requests are not allowed to send a body. Therefore, we convert our body to a paramater
                }
                if (options.noCORS) {
                    options.queryParams["cv"] = env.versionNumber;
                }
                var origin = (_a = options.baseUrl) !== null && _a !== void 0 ? _a : (0, Env_1.getHttpOrigin)();
                var url = addParamsToUrl(new URL(origin + path), options.queryParams);
                var xhr = new XMLHttpRequest();
                xhr.open(method, url.toString());
                _this.setHeaders(xhr, options);
                xhr.responseType = options.responseType === "application/json" /* MediaType.Json */ || options.responseType === "text/plain" /* MediaType.Text */
                    ? "text"
                    : "arraybuffer";
                var abortAfterTimeout = function () {
                    var res = {
                        timeoutId: 0,
                        abortFunction: function () {
                            if (_this.usingTimeoutAbort()) {
                                console.log("".concat(_this.id, ": ").concat(String(new Date()), " aborting ") + String(res.timeoutId));
                                xhr.abort();
                            }
                        }
                    };
                    return res;
                };
                var t = abortAfterTimeout();
                var timeout = setTimeout(t.abortFunction, env.timeout);
                t.timeoutId = timeout;
                if (verbose) {
                    console.log("".concat(_this.id, ": set initial timeout ").concat(String(timeout), " of ").concat(env.timeout));
                }
                xhr.onload = function () {
                    // XMLHttpRequestProgressEvent, but not needed
                    if (verbose) {
                        console.log("".concat(_this.id, ": ").concat(String(new Date()), " finished request. Clearing Timeout ").concat(String(timeout), "."));
                    }
                    clearTimeout(timeout);
                    _this.saveServerTimeOffsetFromRequest(xhr);
                    if (xhr.status === 200 || (method === "POST" /* HttpMethod.POST */ && xhr.status === 201)) {
                        if (options.responseType === "application/json" /* MediaType.Json */ || options.responseType === "text/plain" /* MediaType.Text */) {
                            resolve(xhr.response);
                        }
                        else if (options.responseType === "application/octet-stream" /* MediaType.Binary */) {
                            resolve(new Uint8Array(xhr.response));
                        }
                        else {
                            resolve(null);
                        }
                    }
                    else {
                        var suspensionTime = xhr.getResponseHeader("Retry-After") || xhr.getResponseHeader("Suspension-Time");
                        if (isSuspensionResponse(xhr.status, suspensionTime) && options.suspensionBehavior === 1 /* SuspensionBehavior.Throw */) {
                            reject(new SuspensionError_js_1.SuspensionError("blocked for ".concat(suspensionTime, ", not suspending")));
                        }
                        else if (isSuspensionResponse(xhr.status, suspensionTime)) {
                            _this.suspensionHandler.activateSuspensionIfInactive(Number(suspensionTime));
                            resolve(_this.suspensionHandler.deferRequest(function () {
                                return _this.request(path, method, options);
                            }));
                        }
                        else {
                            console.log("failed request", method, url.toString(), xhr.status, xhr.statusText, options.headers, options.body);
                            reject((0, RestError_1.handleRestError)(xhr.status, "| ".concat(method, " ").concat(path), xhr.getResponseHeader("Error-Id"), xhr.getResponseHeader("Precondition")));
                        }
                    }
                };
                xhr.onerror = function () {
                    clearTimeout(timeout);
                    console.log("failed to request", method, url, options.headers, options.body);
                    reject((0, RestError_1.handleRestError)(xhr.status, " | ".concat(method, " ").concat(path), xhr.getResponseHeader("Error-Id"), xhr.getResponseHeader("Precondition")));
                };
                // don't add an EventListener for non-CORS requests, otherwise it would not meet the 'CORS-Preflight simple request' requirements
                if (!options.noCORS) {
                    xhr.upload.onprogress = function (pe) {
                        if (verbose) {
                            console.log("".concat(_this.id, ": ").concat(String(new Date()), " upload progress. Clearing Timeout ").concat(String(timeout)), pe);
                        }
                        clearTimeout(timeout);
                        var t = abortAfterTimeout();
                        timeout = setTimeout(t.abortFunction, env.timeout);
                        t.timeoutId = timeout;
                        if (verbose) {
                            console.log("".concat(_this.id, ": set new timeout ").concat(String(timeout), " of ").concat(env.timeout));
                        }
                        if (options.progressListener != null && pe.lengthComputable) {
                            // see https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent
                            options.progressListener.upload((1 / pe.total) * pe.loaded);
                        }
                    };
                    xhr.upload.ontimeout = function (e) {
                        var _a;
                        if (verbose) {
                            console.log("".concat(_this.id, ": ").concat(String(new Date()), " upload timeout. calling error handler."), e);
                        }
                        (_a = xhr.onerror) === null || _a === void 0 ? void 0 : _a.call(xhr, e);
                    };
                    xhr.upload.onerror = function (e) {
                        var _a;
                        if (verbose) {
                            console.log("".concat(_this.id, ": ").concat(String(new Date()), " upload error. calling error handler."), e);
                        }
                        (_a = xhr.onerror) === null || _a === void 0 ? void 0 : _a.call(xhr, e);
                    };
                    xhr.upload.onabort = function (e) {
                        var _a;
                        if (verbose) {
                            console.log("".concat(_this.id, ": ").concat(String(new Date()), " upload aborted. calling error handler."), e);
                        }
                        (_a = xhr.onerror) === null || _a === void 0 ? void 0 : _a.call(xhr, e);
                    };
                }
                xhr.onprogress = function (pe) {
                    if (verbose) {
                        console.log("".concat(_this.id, ": ").concat(String(new Date()), " download progress. Clearing Timeout ").concat(String(timeout)), pe);
                    }
                    clearTimeout(timeout);
                    var t = abortAfterTimeout();
                    timeout = setTimeout(t.abortFunction, env.timeout);
                    t.timeoutId = timeout;
                    if (verbose) {
                        console.log("".concat(_this.id, ": set new timeout ").concat(String(timeout), " of ").concat(env.timeout));
                    }
                    if (options.progressListener != null && pe.lengthComputable) {
                        // see https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent
                        options.progressListener.download((1 / pe.total) * pe.loaded);
                    }
                };
                xhr.onabort = function () {
                    clearTimeout(timeout);
                    reject(new RestError_1.ConnectionError("Reached timeout of ".concat(env.timeout, "ms ").concat(xhr.statusText, " | ").concat(method, " ").concat(path)));
                };
                if (options.body instanceof Uint8Array) {
                    xhr.send((0, tutanota_utils_1.uint8ArrayToArrayBuffer)(options.body));
                }
                else {
                    xhr.send(options.body);
                }
            });
        }
    };
    /** We only need to track timeout directly here on some platforms. Other platforms do it inside their network driver. */
    RestClient.prototype.usingTimeoutAbort = function () {
        return (0, Env_1.isWebClient)() || (0, Env_1.isAndroidApp)();
    };
    RestClient.prototype.saveServerTimeOffsetFromRequest = function (xhr) {
        // Dates sent in the `Date` field of HTTP headers follow the format specified by rfc7231
        // JavaScript's Date expects dates in the format specified by rfc2822
        // rfc7231 provides three options of formats, the preferred one being IMF-fixdate. This one is definitely
        // parseable by any rfc2822 compatible parser, since it is a strict subset (with no folding white space) of the
        // format of rfc5322, which is the same as rfc2822 accepting more folding white spaces.
        // Furthermore, there is no reason to expect the server to return any of the other two accepted formats, which
        // are obsolete and accepted only for backwards compatibility.
        var serverTimestamp = xhr.getResponseHeader("Date");
        if (serverTimestamp != null) {
            // check that serverTimestamp has been returned
            var serverTime = new Date(serverTimestamp).getTime();
            if (!isNaN(serverTime)) {
                var now = Date.now();
                this.serverTimeOffsetMs = serverTime - now;
            }
        }
    };
    /**
     * Get the time on the server based on the client time + the server time offset
     * The server time offset is calculated based on the date field in the header returned from REST requests.
     * will throw an error if offline or no rest requests have been made yet
     */
    RestClient.prototype.getServerTimestampMs = function () {
        var timeOffset = (0, tutanota_utils_1.assertNotNull)(this.serverTimeOffsetMs, "You can't get server time if no rest requests were made");
        return Date.now() + timeOffset;
    };
    /**
     * Checks if the request body is too large.
     * Ignores the method because GET requests etc. should not exceed the limits neither.
     * This is done to avoid making the request, because the server will return a PayloadTooLargeError anyway.
     * */
    RestClient.prototype.checkRequestSizeLimit = function (path, method, body) {
        var _a;
        if ((0, Env_1.isAdminClient)()) {
            return;
        }
        var limit = (_a = TutanotaConstants_1.REQUEST_SIZE_LIMIT_MAP.get(path)) !== null && _a !== void 0 ? _a : TutanotaConstants_1.REQUEST_SIZE_LIMIT_DEFAULT;
        if (body && body.length > limit) {
            throw new RestError_1.PayloadTooLargeError("request body is too large. Path: ".concat(path, ", Method: ").concat(method, ", Body length: ").concat(body.length));
        }
    };
    RestClient.prototype.setHeaders = function (xhr, options) {
        if (options.headers == null) {
            options.headers = {};
        }
        var headers = options.headers, body = options.body, responseType = options.responseType;
        // don't add custom and content-type headers for non-CORS requests, otherwise it would not meet the 'CORS-Preflight simple request' requirements
        if (!options.noCORS) {
            headers["cv"] = env.versionNumber;
            if (body instanceof Uint8Array) {
                headers["Content-Type"] = "application/octet-stream" /* MediaType.Binary */;
            }
            else if (typeof body === "string") {
                headers["Content-Type"] = "application/json" /* MediaType.Json */;
            }
        }
        if (responseType) {
            headers["Accept"] = responseType;
        }
        for (var i in headers) {
            xhr.setRequestHeader(i, headers[i]);
        }
    };
    return RestClient;
}());
exports.RestClient = RestClient;
function addParamsToUrl(url, urlParams) {
    if (urlParams) {
        for (var _i = 0, _a = (0, tutanota_utils_1.typedEntries)(urlParams); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            if (value !== undefined) {
                url.searchParams.set(key, value);
            }
        }
    }
    return url;
}
exports.addParamsToUrl = addParamsToUrl;
function isSuspensionResponse(statusCode, suspensionTimeNumberString) {
    return Number(suspensionTimeNumberString) > 0 && (statusCode === RestError_1.TooManyRequestsError.CODE || statusCode === RestError_1.ServiceUnavailableError.CODE);
}
exports.isSuspensionResponse = isSuspensionResponse;
