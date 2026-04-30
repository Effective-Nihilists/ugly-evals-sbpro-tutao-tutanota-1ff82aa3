"use strict";
exports.__esModule = true;
exports.EventQueue = exports.batchMod = void 0;
var Utils_1 = require("../../common/utils/Utils");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var RestError_1 = require("../../common/error/RestError");
var ProgrammingError_1 = require("../../common/error/ProgrammingError");
var TypeRefs_js_1 = require("../../entities/tutanota/TypeRefs.js");
var EntityUtils_1 = require("../../common/utils/EntityUtils");
var TypeRefs_js_2 = require("../../entities/sys/TypeRefs.js");
var MOVABLE_EVENT_TYPE_REFS = [
    // moved in MoveMailService
    TypeRefs_js_1.MailTypeRef,
    TypeRefs_js_2.CustomerInfoTypeRef,
];
/**
 * Whether the entity of the event supports MOVE operation. MOVE is supposed to be immutable so we cannot apply it to all instances.
 */
function isMovableEventType(event) {
    return MOVABLE_EVENT_TYPE_REFS.some(function (typeRef) { return (0, tutanota_utils_1.isSameTypeRefByAttr)(typeRef, event.application, event.type); });
}
/**
 * Checks which modification is applied in the given batch for the entity id.
 * @param batch entity updates of the batch.
 * @param entityId
 */
function batchMod(batch, entityId) {
    var batchAsUpdateData = batch;
    for (var _i = 0, batch_1 = batch; _i < batch_1.length; _i++) {
        var event_1 = batch_1[_i];
        if ((0, EntityUtils_1.isSameId)(event_1.instanceId, entityId)) {
            switch (event_1.operation) {
                case "0" /* OperationType.CREATE */:
                    return isMovableEventType(event_1) && (0, Utils_1.containsEventOfType)(batchAsUpdateData, "2" /* OperationType.DELETE */, entityId)
                        ? "MOVE" /* EntityModificationType.MOVE */
                        : "CREATE" /* EntityModificationType.CREATE */;
                case "1" /* OperationType.UPDATE */:
                    return "UPDATE" /* EntityModificationType.UPDATE */;
                case "2" /* OperationType.DELETE */:
                    return isMovableEventType(event_1) && (0, Utils_1.containsEventOfType)(batchAsUpdateData, "0" /* OperationType.CREATE */, entityId)
                        ? "MOVE" /* EntityModificationType.MOVE */
                        : "DELETE" /* EntityModificationType.DELETE */;
                default:
                    throw new ProgrammingError_1.ProgrammingError("Unknown operation: ".concat(event_1.operation));
            }
        }
    }
    throw new ProgrammingError_1.ProgrammingError("Batch does not have events for ".concat(entityId));
}
exports.batchMod = batchMod;
var EventQueue = /** @class */ (function () {
    /**
     * @param queueAction which is executed for each batch. Must *never* throw.
     */
    function EventQueue(optimizationEnabled, queueAction) {
        this._eventQueue = [];
        this._lastOperationForEntity = new Map();
        this._queueAction = queueAction;
        this._optimizationEnabled = optimizationEnabled;
        this._processingBatch = null;
        this._paused = false;
    }
    EventQueue.prototype.addBatches = function (batches) {
        for (var _i = 0, batches_1 = batches; _i < batches_1.length; _i++) {
            var batch = batches_1[_i];
            this.add(batch.batchId, batch.groupId, batch.events);
        }
    };
    /**
     * @return whether the batch was added (not optimized away)
     */
    EventQueue.prototype.add = function (batchId, groupId, newEvents) {
        var _a;
        var newBatch = {
            events: [],
            groupId: groupId,
            batchId: batchId
        };
        if (!this._optimizationEnabled) {
            (_a = newBatch.events).push.apply(_a, newEvents);
        }
        else {
            this._optimizingAddEvents(newBatch, batchId, groupId, newEvents);
        }
        if (newBatch.events.length !== 0) {
            this._eventQueue.push(newBatch);
            for (var _i = 0, _b = newBatch.events; _i < _b.length; _i++) {
                var update = _b[_i];
                this._lastOperationForEntity.set(update.instanceId, newBatch);
            }
        }
        // ensures that events are processed when not paused
        this.start();
        return newBatch.events.length > 0;
    };
    EventQueue.prototype._optimizingAddEvents = function (newBatch, batchId, groupId, newEvents) {
        var _this = this;
        var _loop_1 = function (newEvent) {
            var elementId = newEvent.instanceId;
            var lastBatchForEntity = this_1._lastOperationForEntity.get(elementId);
            if (lastBatchForEntity == null ||
                (this_1._processingBatch != null && this_1._processingBatch === lastBatchForEntity) ||
                groupId !== lastBatchForEntity.groupId) {
                // If there's no current operation, there's nothing to merge, just add
                // If current operation is already being processed, don't modify it, we cannot merge anymore and should just append.
                newBatch.events.push(newEvent);
            }
            else {
                var newEntityModification = batchMod(newEvents, elementId);
                var lastEntityModification = batchMod(lastBatchForEntity.events, elementId);
                if (newEntityModification === "UPDATE" /* EntityModificationType.UPDATE */) {
                    switch (lastEntityModification) {
                        case "CREATE" /* EntityModificationType.CREATE */:
                        // Skip create because the create was not processed yet and we will download the updated version already
                        case "UPDATE" /* EntityModificationType.UPDATE */:
                            // Skip update because the previous update was not processed yet and we will download the updated version already
                            break;
                        case "MOVE" /* EntityModificationType.MOVE */:
                            // Leave both, as we expect MOVE to not mutate the entity
                            // We will execute this twice for DELETE and CREATE but it's fine, we need both
                            newBatch.events.push(newEvent);
                            break;
                        case "DELETE" /* EntityModificationType.DELETE */:
                            throw new ProgrammingError_1.ProgrammingError("UPDATE not allowed after DELETE");
                    }
                }
                else if (newEntityModification === "MOVE" /* EntityModificationType.MOVE */) {
                    if (newEvent.operation === "2" /* OperationType.DELETE */) {
                        return "continue";
                    }
                    switch (lastEntityModification) {
                        case "CREATE" /* EntityModificationType.CREATE */:
                            // Replace old create with new create of the move event
                            this_1._replace(lastBatchForEntity, newEvent);
                            // ignore DELETE of move operation
                            break;
                        case "UPDATE" /* EntityModificationType.UPDATE */:
                            // The instance is not at the original location anymore so we cannot leave update in because we won't be able to download
                            // it but we also cannot say that it just moved so we need to actually delete and create it again
                            var deleteEvent = (0, tutanota_utils_1.assertNotNull)((0, Utils_1.getEventOfType)(newEvents, "2" /* OperationType.DELETE */, newEvent.instanceId));
                            // Replace update with delete the old location
                            this_1._replace(lastBatchForEntity, deleteEvent);
                            newBatch.events.push(newEvent);
                            break;
                        case "MOVE" /* EntityModificationType.MOVE */:
                            // Replace move with a move from original location to the final destination
                            var oldDelete = (0, tutanota_utils_1.assertNotNull)((0, Utils_1.getEventOfType)(lastBatchForEntity.events, "2" /* OperationType.DELETE */, newEvent.instanceId));
                            this_1._replace(lastBatchForEntity, newEvent);
                            // replace removes all events so we need to add the old delete again
                            lastBatchForEntity.events.unshift(oldDelete);
                            break;
                        case "DELETE" /* EntityModificationType.DELETE */:
                            throw new ProgrammingError_1.ProgrammingError("MOVE not allowed after DELETE");
                    } // skip delete in favor of create so that we don't run the same conditions twice
                }
                else if (newEntityModification === "DELETE" /* EntityModificationType.DELETE */) {
                    // find first move or delete (at different list) operation
                    var firstMoveIndex = this_1._eventQueue.findIndex(function (queuedBatch) { return _this._processingBatch !== queuedBatch && (0, Utils_1.containsEventOfType)(queuedBatch.events, "2" /* OperationType.DELETE */, elementId); });
                    if (firstMoveIndex !== -1) {
                        // delete CREATE of first move and keep the DELETE event
                        var firstMoveBatch = this_1._eventQueue[firstMoveIndex];
                        var createEvent = (0, Utils_1.getEventOfType)(firstMoveBatch.events, "0" /* OperationType.CREATE */, elementId);
                        createEvent && (0, tutanota_utils_1.remove)(firstMoveBatch.events, createEvent);
                        // We removed empty batches from the list but the one in the map will still stay
                        // so we need to manually clean it up.
                        this_1._lastOperationForEntity.set(elementId, this_1._eventQueue[firstMoveIndex]);
                    }
                    else {
                        // add delete event
                        newBatch.events.push(newEvent); // _lastOperationForEntity will be set after the batch is prepared as it's non-empty
                    }
                    // delete all other events
                    this_1.removeEventsForInstance(elementId, firstMoveIndex + 1);
                }
                else if (newEntityModification === "CREATE" /* EntityModificationType.CREATE */) {
                    if (lastEntityModification === "DELETE" /* EntityModificationType.DELETE */ || lastEntityModification === "CREATE" /* EntityModificationType.CREATE */) {
                        // It is likely custom id instance which got re-created
                        newBatch.events.push(newEvent);
                    }
                    else {
                        throw new ProgrammingError_1.ProgrammingError("Impossible modification combination ".concat(lastEntityModification, " ").concat(newEntityModification, " ").concat(JSON.stringify(newEvent)));
                    }
                }
                else {
                    throw new ProgrammingError_1.ProgrammingError("Impossible modification combination ".concat(lastEntityModification, " ").concat(newEntityModification, " ").concat(JSON.stringify(newEvent)));
                }
            }
        };
        var this_1 = this;
        for (var _i = 0, newEvents_1 = newEvents; _i < newEvents_1.length; _i++) {
            var newEvent = newEvents_1[_i];
            _loop_1(newEvent);
        }
    };
    EventQueue.prototype.removeEventsForInstance = function (elementId, startIndex) {
        var _this = this;
        if (startIndex === void 0) { startIndex = 0; }
        // this will remove batches with an empty event list
        (0, tutanota_utils_1.findAllAndRemove)(this._eventQueue, function (batchInThePast) {
            if (_this._processingBatch === batchInThePast) {
                return false;
            }
            // this will remove all events for the element id from the batch
            (0, tutanota_utils_1.findAllAndRemove)(batchInThePast.events, function (event) { return (0, EntityUtils_1.isSameId)(event.instanceId, elementId); });
            return batchInThePast.events.length === 0;
        }, startIndex);
    };
    EventQueue.prototype.start = function () {
        if (this._processingBatch) {
            return;
        }
        this._processNext();
    };
    EventQueue.prototype.queueSize = function () {
        return this._eventQueue.length;
    };
    EventQueue.prototype._processNext = function () {
        var _this = this;
        if (this._paused) {
            return;
        }
        var next = this._eventQueue[0];
        if (next) {
            this._processingBatch = next;
            this._queueAction(next)
                .then(function () {
                _this._eventQueue.shift();
                _this._processingBatch = null;
                // When we are done with the batch, we don't want to merge with it anymore
                for (var _i = 0, _a = next.events; _i < _a.length; _i++) {
                    var event_2 = _a[_i];
                    if (_this._lastOperationForEntity.get(event_2.instanceId) === next) {
                        _this._lastOperationForEntity["delete"](event_2.instanceId);
                    }
                }
                _this._processNext();
            })["catch"](function (e) {
                // processing continues if the event bus receives a new event
                _this._processingBatch = null;
                if (!(e instanceof RestError_1.ServiceUnavailableError || e instanceof RestError_1.ConnectionError)) {
                    console.error("Uncaught EventQueue error!", e);
                }
            });
        }
    };
    EventQueue.prototype.clear = function () {
        this._eventQueue.splice(0);
        this._processingBatch = null;
        for (var _i = 0, _a = this._lastOperationForEntity.keys(); _i < _a.length; _i++) {
            var k = _a[_i];
            this._lastOperationForEntity["delete"](k);
        }
    };
    EventQueue.prototype.pause = function () {
        this._paused = true;
    };
    EventQueue.prototype.resume = function () {
        this._paused = false;
        this.start();
    };
    EventQueue.prototype._replace = function (batch, newMod) {
        batch.events = batch.events.filter(function (e) { return e.instanceId !== newMod.instanceId; });
        batch.events.push(newMod);
    };
    return EventQueue;
}());
exports.EventQueue = EventQueue;
