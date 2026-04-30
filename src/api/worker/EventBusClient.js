"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.EventBusClient = exports.ENTITY_EVENT_BATCH_EXPIRE_MS = void 0;
var Env_1 = require("../common/Env");
var RestError_1 = require("../common/error/RestError");
var TypeRefs_js_1 = require("../entities/sys/TypeRefs.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var OutOfSyncError_1 = require("../common/error/OutOfSyncError");
var TutanotaConstants_1 = require("../common/TutanotaConstants");
var CancelledError_1 = require("../common/error/CancelledError");
var EventQueue_1 = require("./search/EventQueue");
var ProgressMonitorDelegate_1 = require("./ProgressMonitorDelegate");
var ProgressMonitor_1 = require("../common/utils/ProgressMonitor");
var EntityUtils_1 = require("../common/utils/EntityUtils");
var ModelInfo_js_1 = require("../entities/sys/ModelInfo.js");
var ModelInfo_js_2 = require("../entities/tutanota/ModelInfo.js");
var EntityFunctions_js_1 = require("../common/EntityFunctions.js");
var TypeRefs_1 = require("../entities/tutanota/TypeRefs");
(0, Env_1.assertWorkerOrNode)();
// EntityEventBatches expire after 45 days. keep a time diff security of one day.
exports.ENTITY_EVENT_BATCH_EXPIRE_MS = 44 * 24 * 60 * 60 * 1000;
var RETRY_AFTER_SERVICE_UNAVAILABLE_ERROR_MS = 30000;
var NORMAL_SHUTDOWN_CLOSE_CODE = 1;
/**
 * Reconnection interval bounds. When we reconnect we pick a random number of seconds in a range to prevent that all the clients connect at the same time which
 * would put unnecessary load on the server.
 * The range depends on the number of attempts and the server response.
 * */
var RECONNECT_INTERVAL = Object.freeze({
    SMALL: [5, 10],
    MEDIUM: [20, 40],
    LARGE: [60, 120]
});
// we store the last 1000 event ids per group, so we know if an event was already processed.
// it is not sufficient to check the last event id because a smaller event id may arrive later
// than a bigger one if the requests are processed in parallel on the server
var MAX_EVENT_IDS_QUEUE_LENGTH = 1000;
var EventBusClient = /** @class */ (function () {
    function EventBusClient(worker, indexer, cache, mail, userFacade, entity, instanceMapper, socketFactory, sleepDetector, loginFacade) {
        var _this = this;
        this.worker = worker;
        this.indexer = indexer;
        this.cache = cache;
        this.mail = mail;
        this.userFacade = userFacade;
        this.entity = entity;
        this.instanceMapper = instanceMapper;
        this.socketFactory = socketFactory;
        this.sleepDetector = sleepDetector;
        this.loginFacade = loginFacade;
        this.immediateReconnect = false; // if true tries to reconnect immediately after the websocket is closed
        this.lastAntiphishingMarkersId = null;
        /**
         * Represents a currently retried executing due to a ServiceUnavailableError
         */
        this.serviceUnavailableRetry = null;
        this.failedConnectionAttempts = 0;
        // We are not connected by default and will not try to unless connect() is called
        this.state = "terminated" /* EventBusState.Terminated */;
        this.lastEntityEventIds = new Map();
        this.lastAddedBatchForGroup = new Map();
        this.socket = null;
        this.reconnectTimer = null;
        this.connectTimer = null;
        this.progressMonitor = new ProgressMonitor_1.NoopProgressMonitor();
        this.eventQueue = new EventQueue_1.EventQueue(true, function (modification) { return _this.eventQueueCallback(modification); });
        this.entityUpdateMessageQueue = new EventQueue_1.EventQueue(false, function (batch) { return _this.entityUpdateMessageQueueCallback(batch); });
        this.reset();
    }
    EventBusClient.prototype.reset = function () {
        this.immediateReconnect = false;
        this.lastEntityEventIds.clear();
        this.lastAddedBatchForGroup.clear();
        this.eventQueue.pause();
        this.eventQueue.clear();
        this.serviceUnavailableRetry = null;
    };
    /**
     * Opens a WebSocket connection to receive server events.
     * @param connectMode
     */
    EventBusClient.prototype.connect = function (connectMode) {
        var _this = this;
        console.log("ws connect reconnect:", connectMode === 1 /* ConnectMode.Reconnect */, "state:", this.state);
        // make sure a retry will be cancelled by setting _serviceUnavailableRetry to null
        this.serviceUnavailableRetry = null;
        this.worker.updateWebSocketState(0 /* WsConnectionState.connecting */);
        // Task for updating events are number of groups + 2. Use 2 as base for reconnect state.
        if (this.progressMonitor) {
            // Say that the old monitor is completed so that we don't calculate its amount as still to do.
            this.progressMonitor.completed();
        }
        this.progressMonitor = new ProgressMonitorDelegate_1.ProgressMonitorDelegate(this.eventGroups().length + 2, this.worker);
        this.progressMonitor.workDone(1);
        this.state = "automatic" /* EventBusState.Automatic */;
        this.connectTimer = null;
        var authHeaders = this.userFacade.createAuthHeaders();
        // Native query building is not supported in old browser, mithril is not available in the worker
        var authQuery = "modelVersions=" +
            ModelInfo_js_1["default"].version +
            "." +
            ModelInfo_js_2["default"].version +
            "&clientVersion=" +
            env.versionNumber +
            "&userId=" +
            this.userFacade.getLoggedInUser()._id +
            "&accessToken=" +
            authHeaders.accessToken +
            (this.lastAntiphishingMarkersId ? "&lastPhishingMarkersId=" + this.lastAntiphishingMarkersId : "");
        var path = "/event?" + authQuery;
        this.unsubscribeFromOldWebsocket();
        this.socket = this.socketFactory(path);
        this.socket.onopen = function () { return _this.onOpen(connectMode); };
        this.socket.onclose = function (event) { return _this.onClose(event); };
        this.socket.onerror = function (error) { return _this.onError(error); };
        this.socket.onmessage = function (message) { return _this.onMessage(message); };
        this.sleepDetector.start(function () {
            console.log("ws sleep detected, reconnecting...");
            _this.tryReconnect(true, true);
        });
    };
    /**
     * Sends a close event to the server and finally closes the connection.
     * The state of this event bus client is reset and the client is terminated (does not automatically reconnect) except reconnect == true
     */
    EventBusClient.prototype.close = function (closeOption) {
        var _a;
        console.log("ws close closeOption: ", closeOption, "state:", this.state);
        switch (closeOption) {
            case "terminate" /* CloseEventBusOption.Terminate */:
                this.terminate();
                break;
            case "pause" /* CloseEventBusOption.Pause */:
                this.state = "suspended" /* EventBusState.Suspended */;
                this.worker.updateWebSocketState(0 /* WsConnectionState.connecting */);
                break;
            case "reconnect" /* CloseEventBusOption.Reconnect */:
                this.worker.updateWebSocketState(0 /* WsConnectionState.connecting */);
                break;
        }
        (_a = this.socket) === null || _a === void 0 ? void 0 : _a.close();
    };
    EventBusClient.prototype.tryReconnect = function (closeIfOpen, enableAutomaticState, delay) {
        var _this = this;
        if (delay === void 0) { delay = null; }
        console.log("ws tryReconnect closeIfOpen:", closeIfOpen, "enableAutomaticState:", enableAutomaticState, "delay:", delay);
        if (this.reconnectTimer) {
            // prevent reconnect race-condition
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        if (!delay) {
            this.reconnect(closeIfOpen, enableAutomaticState);
        }
        else {
            this.reconnectTimer = setTimeout(function () { return _this.reconnect(closeIfOpen, enableAutomaticState); }, delay);
        }
    };
    // Returning promise for tests
    EventBusClient.prototype.onOpen = function (connectMode) {
        this.failedConnectionAttempts = 0;
        console.log("ws open state:", this.state);
        // Indicate some progress right away
        this.progressMonitor.workDone(1);
        var p = this.initEntityEvents(connectMode);
        this.worker.updateWebSocketState(1 /* WsConnectionState.connected */);
        return p;
    };
    EventBusClient.prototype.onError = function (error) {
        console.log("ws error:", error, JSON.stringify(error), "state:", this.state);
    };
    EventBusClient.prototype.onMessage = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, type, value, _b, data_1, _c, _d, counterData, _e, _f, data_2, _g, _h, data, _j, _k;
            return __generator(this, function (_l) {
                switch (_l.label) {
                    case 0:
                        _a = message.data.split(";"), type = _a[0], value = _a[1];
                        _b = type;
                        switch (_b) {
                            case "entityUpdate" /* MessageType.EntityUpdate */: return [3 /*break*/, 1];
                            case "unreadCounterUpdate" /* MessageType.UnreadCounterUpdate */: return [3 /*break*/, 4];
                            case "phishingMarkers" /* MessageType.PhishingMarkers */: return [3 /*break*/, 7];
                            case "leaderStatus" /* MessageType.LeaderStatus */: return [3 /*break*/, 10];
                        }
                        return [3 /*break*/, 15];
                    case 1:
                        _d = (_c = this.instanceMapper).decryptAndMapToInstance;
                        return [4 /*yield*/, (0, EntityFunctions_js_1.resolveTypeReference)(TypeRefs_js_1.WebsocketEntityDataTypeRef)];
                    case 2: return [4 /*yield*/, _d.apply(_c, [_l.sent(), JSON.parse(value),
                            null])];
                    case 3:
                        data_1 = _l.sent();
                        this.entityUpdateMessageQueue.add(data_1.eventBatchId, data_1.eventBatchOwner, data_1.eventBatch);
                        return [3 /*break*/, 16];
                    case 4:
                        _f = (_e = this.instanceMapper).decryptAndMapToInstance;
                        return [4 /*yield*/, (0, EntityFunctions_js_1.resolveTypeReference)(TypeRefs_js_1.WebsocketCounterDataTypeRef)];
                    case 5: return [4 /*yield*/, _f.apply(_e, [_l.sent(), JSON.parse(value),
                            null])];
                    case 6:
                        counterData = _l.sent();
                        this.worker.updateCounter(counterData);
                        return [3 /*break*/, 16];
                    case 7:
                        _h = (_g = this.instanceMapper).decryptAndMapToInstance;
                        return [4 /*yield*/, (0, EntityFunctions_js_1.resolveTypeReference)(TypeRefs_1.PhishingMarkerWebsocketDataTypeRef)];
                    case 8: return [4 /*yield*/, _h.apply(_g, [_l.sent(), JSON.parse(value),
                            null])];
                    case 9:
                        data_2 = _l.sent();
                        this.lastAntiphishingMarkersId = data_2.lastId;
                        this.mail.phishingMarkersUpdateReceived(data_2.markers);
                        return [3 /*break*/, 16];
                    case 10:
                        _k = (_j = this.instanceMapper).decryptAndMapToInstance;
                        return [4 /*yield*/, (0, EntityFunctions_js_1.resolveTypeReference)(TypeRefs_js_1.WebsocketLeaderStatusTypeRef)];
                    case 11: return [4 /*yield*/, _k.apply(_j, [_l.sent(), JSON.parse(value),
                            null])];
                    case 12:
                        data = _l.sent();
                        return [4 /*yield*/, this.userFacade.setLeaderStatus(data)];
                    case 13:
                        _l.sent();
                        return [4 /*yield*/, this.worker.updateLeaderStatus(data)];
                    case 14:
                        _l.sent();
                        return [3 /*break*/, 16];
                    case 15:
                        console.log("ws message with unknown type", type);
                        return [3 /*break*/, 16];
                    case 16: return [2 /*return*/];
                }
            });
        });
    };
    EventBusClient.prototype.onClose = function (event) {
        this.failedConnectionAttempts++;
        console.log("ws close event:", event, "state:", this.state);
        this.userFacade.setLeaderStatus((0, TypeRefs_js_1.createWebsocketLeaderStatus)({
            leaderStatus: false
        }));
        this.sleepDetector.stop();
        // Avoid running into penalties when trying to authenticate with an invalid session
        // NotAuthenticatedException 401, AccessDeactivatedException 470, AccessBlocked 472
        // do not catch session expired here because websocket will be reused when we authenticate again
        var serverCode = event.code - 4000;
        if ([RestError_1.NotAuthorizedError.CODE, RestError_1.AccessDeactivatedError.CODE, RestError_1.AccessBlockedError.CODE].includes(serverCode)) {
            this.terminate();
            this.worker.sendError((0, RestError_1.handleRestError)(serverCode, "web socket error", null, null));
        }
        else if (serverCode === RestError_1.SessionExpiredError.CODE) {
            // session is expired. do not try to reconnect until the user creates a new session
            this.state = "suspended" /* EventBusState.Suspended */;
            this.worker.updateWebSocketState(0 /* WsConnectionState.connecting */);
        }
        else if (this.state === "automatic" /* EventBusState.Automatic */ && this.userFacade.isFullyLoggedIn()) {
            this.worker.updateWebSocketState(0 /* WsConnectionState.connecting */);
            if (this.immediateReconnect) {
                this.immediateReconnect = false;
                this.tryReconnect(false, false);
            }
            else {
                var reconnectionInterval = void 0;
                if (serverCode === NORMAL_SHUTDOWN_CLOSE_CODE) {
                    reconnectionInterval = RECONNECT_INTERVAL.LARGE;
                }
                else if (this.failedConnectionAttempts === 1) {
                    reconnectionInterval = RECONNECT_INTERVAL.SMALL;
                }
                else if (this.failedConnectionAttempts === 2) {
                    reconnectionInterval = RECONNECT_INTERVAL.MEDIUM;
                }
                else {
                    reconnectionInterval = RECONNECT_INTERVAL.LARGE;
                }
                this.tryReconnect(false, false, TutanotaConstants_1.SECOND_MS * (0, tutanota_utils_1.randomIntFromInterval)(reconnectionInterval[0], reconnectionInterval[1]));
            }
        }
    };
    EventBusClient.prototype.initEntityEvents = function (connectMode) {
        return __awaiter(this, void 0, void 0, function () {
            var existingConnection, p;
            var _this = this;
            return __generator(this, function (_a) {
                // pause processing entity update message while initializing event queue
                this.entityUpdateMessageQueue.pause();
                // pause event queue and add all missed entity events first
                this.eventQueue.pause();
                existingConnection = connectMode == 1 /* ConnectMode.Reconnect */ && this.lastEntityEventIds.size > 0;
                p = existingConnection
                    ? this.loadMissedEntityEvents()
                    : this.initOnNewConnection();
                return [2 /*return*/, p
                        .then(function () {
                        _this.entityUpdateMessageQueue.resume();
                        _this.eventQueue.resume();
                    })["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.ConnectionError, function (e) {
                        console.log("ws not connected in connect(), close websocket", e);
                        _this.close("reconnect" /* CloseEventBusOption.Reconnect */);
                    }))["catch"]((0, tutanota_utils_1.ofClass)(CancelledError_1.CancelledError, function () {
                        // the processing was aborted due to a reconnect. do not reset any attributes because they might already be in use since reconnection
                        console.log("ws cancelled retry process entity events after reconnect");
                    }))["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.ServiceUnavailableError, function (e) { return __awaiter(_this, void 0, void 0, function () {
                        var promise;
                        var _this = this;
                        return __generator(this, function (_a) {
                            // a ServiceUnavailableError is a temporary error and we have to retry to avoid data inconsistencies
                            // some EventBatches/missed events are processed already now
                            // for an existing connection we just keep the current state and continue loading missed events for the other groups
                            // for a new connection we reset the last entity event ids because otherwise this would not be completed in the next try
                            if (!existingConnection) {
                                this.lastEntityEventIds.clear();
                            }
                            console.log("ws retry init entity events in ", RETRY_AFTER_SERVICE_UNAVAILABLE_ERROR_MS, e);
                            promise = (0, tutanota_utils_1.delay)(RETRY_AFTER_SERVICE_UNAVAILABLE_ERROR_MS).then(function () {
                                // if we have a websocket reconnect we have to stop retrying
                                if (_this.serviceUnavailableRetry === promise) {
                                    console.log("ws retry initializing entity events");
                                    return _this.initEntityEvents(connectMode);
                                }
                                else {
                                    console.log("ws cancel initializing entity events");
                                }
                            });
                            this.serviceUnavailableRetry = promise;
                            return [2 /*return*/, promise];
                        });
                    }); }))["catch"]((0, tutanota_utils_1.ofClass)(OutOfSyncError_1.OutOfSyncError, function (e) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: 
                                // we did not check for updates for too long, so some missed EntityEventBatches can not be loaded any more
                                // purge cache if out of sync
                                return [4 /*yield*/, this.cache.purgeStorage()
                                    // We want users to re-login. By the time we get here they probably already have loaded some entities which we cannot update
                                ];
                                case 1:
                                    // we did not check for updates for too long, so some missed EntityEventBatches can not be loaded any more
                                    // purge cache if out of sync
                                    _a.sent();
                                    // We want users to re-login. By the time we get here they probably already have loaded some entities which we cannot update
                                    throw e;
                            }
                        });
                    }); }))["catch"](function (e) {
                        _this.entityUpdateMessageQueue.resume();
                        _this.eventQueue.resume();
                        _this.worker.sendError(e);
                    })];
            });
        });
    };
    EventBusClient.prototype.initOnNewConnection = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, lastIds, someIdsWereCached;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.retrieveLastEntityEventIds()
                        // First, we record lastEntityEventIds. We need this to know what we need to re-fetch.
                        // This is not the same as the cache because we might have already downloaded them but cache might not have processed them yet.
                        // Important: do it in one step so that we don't have partial IDs in the map in case an error occurs.
                    ];
                    case 1:
                        _a = _b.sent(), lastIds = _a.lastIds, someIdsWereCached = _a.someIdsWereCached;
                        // First, we record lastEntityEventIds. We need this to know what we need to re-fetch.
                        // This is not the same as the cache because we might have already downloaded them but cache might not have processed them yet.
                        // Important: do it in one step so that we don't have partial IDs in the map in case an error occurs.
                        this.lastEntityEventIds = lastIds;
                        if (!someIdsWereCached) return [3 /*break*/, 3];
                        // If some of the last IDs were retrieved from the cache then we want to load from that point to bring cache up-to-date. This is mostly important for
                        // persistent cache.
                        return [4 /*yield*/, this.loadMissedEntityEvents()];
                    case 2:
                        // If some of the last IDs were retrieved from the cache then we want to load from that point to bring cache up-to-date. This is mostly important for
                        // persistent cache.
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 3: 
                    // If the cache is clean then this is a clean cache (either ephemeral after first connect or persistent with empty DB).
                    // We need to record the time even if we don't process anything to later know if we are out of sync or not.
                    return [4 /*yield*/, this.cache.recordSyncTime()];
                    case 4:
                        // If the cache is clean then this is a clean cache (either ephemeral after first connect or persistent with empty DB).
                        // We need to record the time even if we don't process anything to later know if we are out of sync or not.
                        _b.sent();
                        _b.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Gets the latest event batch ids for each of the users groups or min id if there is no event batch yet.
     * This is needed to know from where to start loading missed events when we connect.
     */
    EventBusClient.prototype.retrieveLastEntityEventIds = function () {
        return __awaiter(this, void 0, void 0, function () {
            var lastIds, someIdsWereCached, _i, _a, groupId, cachedBatchId, batches, batchId;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        lastIds = new Map();
                        someIdsWereCached = false;
                        _i = 0, _a = this.eventGroups();
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 7];
                        groupId = _a[_i];
                        return [4 /*yield*/, this.cache.getLastEntityEventBatchForGroup(groupId)];
                    case 2:
                        cachedBatchId = _b.sent();
                        if (!(cachedBatchId != null)) return [3 /*break*/, 3];
                        lastIds.set(groupId, [cachedBatchId]);
                        someIdsWereCached = true;
                        return [3 /*break*/, 6];
                    case 3: return [4 /*yield*/, this.entity.loadRange(TypeRefs_js_1.EntityEventBatchTypeRef, groupId, EntityUtils_1.GENERATED_MAX_ID, 1, true)];
                    case 4:
                        batches = _b.sent();
                        batchId = batches.length === 1 ? (0, EntityUtils_1.getElementId)(batches[0]) : EntityUtils_1.GENERATED_MIN_ID;
                        lastIds.set(groupId, [batchId]);
                        // In case we don't receive any events for the group this time we want to still download from this point next time.
                        return [4 /*yield*/, this.cache.setLastEntityEventBatchForGroup(groupId, batchId)
                            // We will not process any entities for this group so we consider this group "done"
                        ];
                    case 5:
                        // In case we don't receive any events for the group this time we want to still download from this point next time.
                        _b.sent();
                        // We will not process any entities for this group so we consider this group "done"
                        this.progressMonitor.workDone(1);
                        _b.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 1];
                    case 7: return [2 /*return*/, { lastIds: lastIds, someIdsWereCached: someIdsWereCached }];
                }
            });
        });
    };
    /** Load event batches since the last time we were connected to bring cache and other things up-to-date. */
    EventBusClient.prototype.loadMissedEntityEvents = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, groupId, eventBatches, _b, eventBatches_1, batch;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!this.userFacade.isFullyLoggedIn()) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.checkOutOfSync()];
                    case 1:
                        _c.sent();
                        _i = 0, _a = this.eventGroups();
                        _c.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        groupId = _a[_i];
                        return [4 /*yield*/, this.loadEntityEventsForGroup(groupId)];
                    case 3:
                        eventBatches = _c.sent();
                        if (eventBatches.length === 0) {
                            // There won't be a callback from the queue to process the event so we mark this group as
                            // completed right away
                            this.progressMonitor.workDone(1);
                        }
                        else {
                            for (_b = 0, eventBatches_1 = eventBatches; _b < eventBatches_1.length; _b++) {
                                batch = eventBatches_1[_b];
                                this.addBatch((0, EntityUtils_1.getElementId)(batch), groupId, batch.events);
                            }
                        }
                        _c.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: 
                    // We've loaded all the batches, we've added them to the queue, we can let the cache remember sync point for us to detect out of sync now.
                    // It is possible that we will record the time before the batch will be processed but the risk is low.
                    return [4 /*yield*/, this.cache.recordSyncTime()];
                    case 6:
                        // We've loaded all the batches, we've added them to the queue, we can let the cache remember sync point for us to detect out of sync now.
                        // It is possible that we will record the time before the batch will be processed but the risk is low.
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EventBusClient.prototype.loadEntityEventsForGroup = function (groupId) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.entity.loadAll(TypeRefs_js_1.EntityEventBatchTypeRef, groupId, this.getLastEventBatchIdOrMinIdForGroup(groupId))];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_1 = _a.sent();
                        if (e_1 instanceof RestError_1.NotAuthorizedError) {
                            console.log("ws could not download entity updates, lost permission");
                            return [2 /*return*/, []];
                        }
                        else {
                            throw e_1;
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EventBusClient.prototype.checkOutOfSync = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.cache.isOutOfSync()];
                    case 1:
                        // We try to detect whether event batches have already expired.
                        // If this happened we don't need to download anything, we need to purge the cache and start all over.
                        if (_a.sent()) {
                            // Allow the progress bar to complete
                            this.progressMonitor.completed();
                            // We handle it where we initialize the connection and purge the cache there.
                            throw new OutOfSyncError_1.OutOfSyncError("some missed EntityEventBatches cannot be loaded any more");
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    EventBusClient.prototype.eventQueueCallback = function (modification) {
        return __awaiter(this, void 0, void 0, function () {
            var e_2, lastForGroup;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.processEventBatch(modification)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_2 = _a.sent();
                        console.log("ws error while processing event batches", e_2);
                        this.worker.sendError(e_2);
                        throw e_2;
                    case 3:
                        lastForGroup = (0, tutanota_utils_1.assertNotNull)(this.lastAddedBatchForGroup.get(modification.groupId));
                        if ((0, EntityUtils_1.isSameId)(modification.batchId, lastForGroup) || (0, EntityUtils_1.firstBiggerThanSecond)(modification.batchId, lastForGroup)) {
                            this.progressMonitor && this.progressMonitor.workDone(1);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    EventBusClient.prototype.entityUpdateMessageQueueCallback = function (batch) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.addBatch(batch.batchId, batch.groupId, batch.events);
                this.eventQueue.resume();
                return [2 /*return*/];
            });
        });
    };
    EventBusClient.prototype.unsubscribeFromOldWebsocket = function () {
        if (this.socket) {
            // Remove listeners. We don't want old socket to mess our state
            this.socket.onopen = this.socket.onclose = this.socket.onerror = this.socket.onmessage = tutanota_utils_1.identity;
        }
    };
    EventBusClient.prototype.terminate = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.state = "terminated" /* EventBusState.Terminated */;
                this.reset();
                this.worker.updateWebSocketState(2 /* WsConnectionState.terminated */);
                return [2 /*return*/];
            });
        });
    };
    /**
     * Tries to reconnect the websocket if it is not connected.
     */
    EventBusClient.prototype.reconnect = function (closeIfOpen, enableAutomaticState) {
        var _this = this;
        console.log("ws reconnect socket.readyState: (CONNECTING=0, OPEN=1, CLOSING=2, CLOSED=3): " + (this.socket ? this.socket.readyState : "null"), "state:", this.state, "closeIfOpen:", closeIfOpen, "enableAutomaticState:", enableAutomaticState);
        if (this.state !== "terminated" /* EventBusState.Terminated */ && enableAutomaticState) {
            this.state = "automatic" /* EventBusState.Automatic */;
        }
        if (closeIfOpen && this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.immediateReconnect = true;
            this.socket.close();
        }
        else if ((this.socket == null || this.socket.readyState === WebSocket.CLOSED || this.socket.readyState === WebSocket.CLOSING) &&
            this.state !== "terminated" /* EventBusState.Terminated */ &&
            this.userFacade.isFullyLoggedIn()) {
            // Don't try to connect right away because connection may not be actually there
            // see #1165
            if (this.connectTimer) {
                clearTimeout(this.connectTimer);
            }
            this.connectTimer = setTimeout(function () { return _this.connect(1 /* ConnectMode.Reconnect */); }, 100);
        }
    };
    EventBusClient.prototype.addBatch = function (batchId, groupId, events) {
        var lastForGroup = this.lastEntityEventIds.get(groupId) || [];
        // find the position for inserting into last entity events (negative value is considered as not present in the array)
        var index = (0, tutanota_utils_1.binarySearch)(lastForGroup, batchId, EntityUtils_1.compareOldestFirst);
        var wasAdded;
        if (index < 0) {
            lastForGroup.splice(-index, 0, batchId);
            // only add the batch if it was not process before
            wasAdded = this.eventQueue.add(batchId, groupId, events);
        }
        else {
            wasAdded = false;
        }
        if (lastForGroup.length > MAX_EVENT_IDS_QUEUE_LENGTH) {
            lastForGroup.shift();
        }
        this.lastEntityEventIds.set(batchId, lastForGroup);
        if (wasAdded) {
            this.lastAddedBatchForGroup.set(groupId, batchId);
        }
    };
    EventBusClient.prototype.processEventBatch = function (batch) {
        return __awaiter(this, void 0, void 0, function () {
            var filteredEvents, queuedBatch, e_3, retryPromise_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        if (this.isTerminated())
                            return [2 /*return*/];
                        return [4 /*yield*/, this.cache.entityEventsReceived(batch)];
                    case 1:
                        filteredEvents = _a.sent();
                        if (!!this.isTerminated()) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.loginFacade.entityEventsReceived(filteredEvents)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        if (!!this.isTerminated()) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.mail.entityEventsReceived(filteredEvents)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        if (!!this.isTerminated()) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.worker.entityEventsReceived(filteredEvents, batch.groupId)
                            // Call the indexer in this last step because now the processed event is stored and the indexer has a separate event queue that
                            // shall not receive the event twice.
                        ];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        // Call the indexer in this last step because now the processed event is stored and the indexer has a separate event queue that
                        // shall not receive the event twice.
                        if (!(0, Env_1.isTest)() && !(0, Env_1.isAdminClient)() && !this.isTerminated()) {
                            queuedBatch = {
                                groupId: batch.groupId,
                                batchId: batch.batchId,
                                events: filteredEvents
                            };
                            this.indexer.addBatchesToQueue([queuedBatch]);
                            this.indexer.startProcessing();
                        }
                        return [3 /*break*/, 9];
                    case 8:
                        e_3 = _a.sent();
                        if (e_3 instanceof RestError_1.ServiceUnavailableError) {
                            // a ServiceUnavailableError is a temporary error and we have to retry to avoid data inconsistencies
                            console.log("ws retry processing event in 30s", e_3);
                            retryPromise_1 = (0, tutanota_utils_1.delay)(RETRY_AFTER_SERVICE_UNAVAILABLE_ERROR_MS).then(function () {
                                // if we have a websocket reconnect we have to stop retrying
                                if (_this.serviceUnavailableRetry === retryPromise_1) {
                                    return _this.processEventBatch(batch);
                                }
                                else {
                                    throw new CancelledError_1.CancelledError("stop retry processing after service unavailable due to reconnect");
                                }
                            });
                            this.serviceUnavailableRetry = retryPromise_1;
                            return [2 /*return*/, retryPromise_1];
                        }
                        else {
                            throw e_3;
                        }
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    EventBusClient.prototype.getLastEventBatchIdOrMinIdForGroup = function (groupId) {
        var lastIds = this.lastEntityEventIds.get(groupId);
        return lastIds && lastIds.length > 0 ? (0, tutanota_utils_1.lastThrow)(lastIds) : EntityUtils_1.GENERATED_MIN_ID;
    };
    EventBusClient.prototype.isTerminated = function () {
        return this.state === "terminated" /* EventBusState.Terminated */;
    };
    EventBusClient.prototype.eventGroups = function () {
        return this.userFacade
            .getLoggedInUser()
            .memberships.filter(function (membership) { return membership.groupType !== TutanotaConstants_1.GroupType.MailingList; })
            .map(function (membership) { return membership.group; })
            .concat(this.userFacade.getLoggedInUser().userGroup.group);
    };
    return EventBusClient;
}());
exports.EventBusClient = EventBusClient;
