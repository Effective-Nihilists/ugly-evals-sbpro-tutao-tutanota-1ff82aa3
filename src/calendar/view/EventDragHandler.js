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
exports.EventDragHandler = void 0;
var mithril_1 = require("mithril");
var CommonCalendarUtils_1 = require("../../api/common/utils/CommonCalendarUtils");
var Time_1 = require("../../api/common/utils/Time");
var DRAG_THRESHOLD = 10;
/**
 * Handles logic for dragging events in the calendar child views.
 */
var EventDragHandler = /** @class */ (function () {
    function EventDragHandler(draggingArea, callbacks) {
        this._data = null;
        this._isDragging = false;
        this._lastDiffBetweenDates = null;
        this._hasChanged = false;
        this._draggingArea = draggingArea;
        this._eventDragCallbacks = callbacks;
    }
    Object.defineProperty(EventDragHandler.prototype, "isDragging", {
        get: function () {
            return this._isDragging;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EventDragHandler.prototype, "originalEvent", {
        get: function () {
            var _a, _b;
            return (_b = (_a = this._data) === null || _a === void 0 ? void 0 : _a.originalEvent) !== null && _b !== void 0 ? _b : null;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Check if the handler has changed since the last time you called this function
     */
    EventDragHandler.prototype.queryHasChanged = function () {
        var isChanged = this._hasChanged;
        this._hasChanged = false;
        return isChanged;
    };
    /**
     * Call on mouse down, to initialize an upcoming drag event.
     * Doesn't start the drag yet, because we want to wait until the mouse has moved beyond some threshhold
     * @param calendarEvent The calendar event for which a drag operation is prepared
     * @param dateUnderMouse The original date under mouse when preparing the drag.
     * @param keepTime Indicates whether the time on the original event should be kept or modified. In case this is set to true the drag
     * operation just shifts event start by whole days otherwise the time from dateUnderMouse should be used as new time for the event.
     */
    EventDragHandler.prototype.prepareDrag = function (calendarEvent, dateUnderMouse, mousePos, keepTime) {
        this._draggingArea.classList.add("cursor-grabbing");
        this._data = {
            originalEvent: calendarEvent,
            // We always differentiate between eventStart and originalDateUnderMouse to be able to shift it relative to the mouse position
            // and not the start date. This is important for larger events in day/week view
            originalDateUnderMouse: this.adjustDateUnderMouse(calendarEvent.startTime, dateUnderMouse, keepTime),
            originalMousePos: mousePos,
            keepTime: keepTime
        };
        this._hasChanged = false;
        this._isDragging = false;
    };
    /**
     * Call on mouse move.
     * Will be a no-op if the prepareDrag hasn't been called or if cancelDrag has been called since the last prepareDrag call
     * The dragging doesn't actually begin until the distance between the mouse and it's original location is greater than some threshold
     * @param dateUnderMouse The current date under the mouse courser, may include a time.
     */
    EventDragHandler.prototype.handleDrag = function (dateUnderMouse, mousePos) {
        if (this._data) {
            var dragData = this._data;
            var adjustedDateUnderMouse = this.adjustDateUnderMouse(dragData.originalEvent.startTime, dateUnderMouse, dragData.keepTime);
            // Calculate the distance from the original mouse location to the current mouse location
            // We don't want to actually start the drag until the mouse has moved by some distance
            // So as to avoid accidentally dragging when you meant to click but moved the mouse a little
            var distanceX = dragData.originalMousePos.x - mousePos.x;
            var distanceY = dragData.originalMousePos.y - mousePos.y;
            var distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
            if (this._isDragging) {
                var diffBetweenDates = this.getDayUnderMouseDiff(dragData, adjustedDateUnderMouse);
                // We don't want to trigger a redraw everytime the drag call is triggered, only when necessary
                if (diffBetweenDates !== this._lastDiffBetweenDates) {
                    this._lastDiffBetweenDates = diffBetweenDates;
                    this._eventDragCallbacks.onDragUpdate(diffBetweenDates);
                    this._hasChanged = true;
                    mithril_1["default"].redraw();
                }
            }
            else if (distance > DRAG_THRESHOLD) {
                this._isDragging = true;
                this._lastDiffBetweenDates = this.getDayUnderMouseDiff(dragData, adjustedDateUnderMouse);
                this._eventDragCallbacks.onDragStart(dragData.originalEvent, this._lastDiffBetweenDates);
                this._hasChanged = true;
                mithril_1["default"].redraw();
            }
        }
    };
    /**
     * Call on mouseup or mouseleave. Ends a drag event if one has been started, and hasn't been cancelled.
     *
     * This function will only trigger when prepareDrag has been called
     */
    EventDragHandler.prototype.endDrag = function (dateUnderMouse) {
        return __awaiter(this, void 0, void 0, function () {
            var dragData, adjustedDateUnderMouse, diffBetweenDates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._draggingArea.classList.remove("cursor-grabbing");
                        if (!(this._isDragging && this._data)) return [3 /*break*/, 5];
                        dragData = this._data;
                        adjustedDateUnderMouse = this.adjustDateUnderMouse(dragData.originalEvent.startTime, dateUnderMouse, dragData.keepTime);
                        // We update our state first because the updateCallback might take some time, and
                        // we want the UI to be able to react to the drop having happened before we get the result
                        this._isDragging = false;
                        this._data = null;
                        diffBetweenDates = this.getDayUnderMouseDiff(dragData, adjustedDateUnderMouse);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 3, 4]);
                        return [4 /*yield*/, this._eventDragCallbacks.onDragEnd(diffBetweenDates)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        this._hasChanged = true;
                        mithril_1["default"].redraw();
                        return [7 /*endfinally*/];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        this.cancelDrag();
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    EventDragHandler.prototype.adjustDateUnderMouse = function (eventStart, dateUnderMouse, keepTime) {
        if (keepTime) {
            return Time_1.Time.fromDate(eventStart).toDate(dateUnderMouse);
        }
        else {
            return dateUnderMouse;
        }
    };
    EventDragHandler.prototype.getDayUnderMouseDiff = function (dragData, adjustedDateUnderMouse) {
        var originalEvent = dragData.originalEvent, originalDateUnderMouse = dragData.originalDateUnderMouse;
        return (0, CommonCalendarUtils_1.isAllDayEvent)(originalEvent)
            ? (0, CommonCalendarUtils_1.getAllDayDateUTC)(adjustedDateUnderMouse).getTime() - (0, CommonCalendarUtils_1.getAllDayDateUTC)(originalDateUnderMouse).getTime()
            : adjustedDateUnderMouse.getTime() - originalDateUnderMouse.getTime();
    };
    EventDragHandler.prototype.cancelDrag = function () {
        this._data = null;
        this._isDragging = false;
        this._hasChanged = true;
        this._lastDiffBetweenDates = null;
    };
    return EventDragHandler;
}());
exports.EventDragHandler = EventDragHandler;
