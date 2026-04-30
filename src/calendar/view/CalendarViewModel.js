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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.CalendarViewModel = exports.LIMIT_PAST_EVENTS_YEARS = exports.CalendarViewTypeByValue = exports.CalendarViewType = void 0;
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var TypeRefs_js_1 = require("../../api/entities/tutanota/TypeRefs.js");
var TutanotaConstants_1 = require("../../api/common/TutanotaConstants");
var RestError_1 = require("../../api/common/error/RestError");
var EntityUtils_1 = require("../../api/common/utils/EntityUtils");
var LoginController_1 = require("../../api/main/LoginController");
var ProgressMonitor_1 = require("../../api/common/utils/ProgressMonitor");
var TypeRefs_js_2 = require("../../api/entities/sys/TypeRefs.js");
var stream_1 = require("mithril/stream");
var CalendarUtils_1 = require("../date/CalendarUtils");
var luxon_1 = require("luxon");
var CommonCalendarUtils_1 = require("../../api/common/utils/CommonCalendarUtils");
var CalendarGuiUtils_1 = require("./CalendarGuiUtils");
var EventController_1 = require("../../api/main/EventController");
var TypeRefs_js_3 = require("../../api/entities/tutanota/TypeRefs.js");
var TypeRefs_js_4 = require("../../api/entities/sys/TypeRefs.js");
var CalendarViewType;
(function (CalendarViewType) {
    CalendarViewType["DAY"] = "day";
    CalendarViewType["WEEK"] = "week";
    CalendarViewType["MONTH"] = "month";
    CalendarViewType["AGENDA"] = "agenda";
})(CalendarViewType = exports.CalendarViewType || (exports.CalendarViewType = {}));
exports.CalendarViewTypeByValue = (0, TutanotaConstants_1.reverse)(CalendarViewType);
exports.LIMIT_PAST_EVENTS_YEARS = 100;
var CalendarViewModel = /** @class */ (function () {
    function CalendarViewModel(loginController, createCalendarEventViewModelCallback, calendarModel, entityClient, eventController, progressTracker, deviceConfig, calendarInvitations) {
        var _this = this;
        this._calendarModel = calendarModel;
        this._entityClient = entityClient;
        this._createCalendarEventViewModelCallback = createCalendarEventViewModelCallback;
        this._transientEvents = [];
        var userId = loginController.getUserController().user._id;
        this._loadedMonths = new Set();
        this._eventsForDays = (0, tutanota_utils_1.freezeMap)(new Map());
        this._deviceConfig = deviceConfig;
        this._hiddenCalendars = new Set(this._deviceConfig.getHiddenCalendars(userId));
        this.selectedDate = (0, stream_1["default"])((0, tutanota_utils_1.getStartOfDay)(new Date()));
        this._redrawStream = (0, stream_1["default"])();
        this._draggedEvent = null;
        this._timeZone = (0, CalendarUtils_1.getTimeZone)();
        this._calendarInvitations = calendarInvitations;
        // load all calendars. if there is no calendar yet, create one
        // we load three instances per calendar / CalendarGroupRoot / GroupInfo / Group + 3
        // for each calendar we load short events for three months +3
        var workPerCalendar = 3 + 3;
        var totalWork = loginController.getUserController().getCalendarMemberships().length * workPerCalendar;
        var monitorHandle = progressTracker.registerMonitor(totalWork);
        var progressMonitor = (0, tutanota_utils_1.neverNull)(progressTracker.getMonitor(monitorHandle));
        this._calendarInfos = new tutanota_utils_1.LazyLoaded(function () {
            return _this._calendarModel.loadOrCreateCalendarInfo(progressMonitor).then(function (it) {
                _this._redraw();
                return it;
            });
        }).load();
        this.selectedDate.map(function (d) {
            var thisMonthStart = (0, CalendarUtils_1.getMonth)(d, _this._timeZone).start;
            var previousMonthDate = new Date(thisMonthStart);
            previousMonthDate.setMonth(thisMonthStart.getMonth() - 1);
            var nextMonthDate = new Date(thisMonthStart);
            nextMonthDate.setMonth(thisMonthStart.getMonth() + 1);
            _this._loadMonthIfNeeded(thisMonthStart)
                .then(function () { return progressMonitor.workDone(1); })
                .then(function () { return _this._loadMonthIfNeeded(nextMonthDate); })
                .then(function () { return progressMonitor.workDone(1); })
                .then(function () { return _this._loadMonthIfNeeded(previousMonthDate); })["finally"](function () {
                progressMonitor.completed();
                // We don't want to report progress after initial month, it shows completed progress bar for a second every time the
                // month is switched. Doesn't make sense to report more than 100% completion anyway.
                progressMonitor = new ProgressMonitor_1.NoopProgressMonitor();
            });
        });
        eventController.addEntityListener(function (updates, eventOwnerGroupId) {
            return _this._entityEventReceived(updates, eventOwnerGroupId);
        });
    }
    Object.defineProperty(CalendarViewModel.prototype, "calendarInvitations", {
        get: function () {
            return this._calendarInvitations.invitations;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CalendarViewModel.prototype, "calendarInfos", {
        get: function () {
            return this._calendarInfos;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CalendarViewModel.prototype, "hiddenCalendars", {
        get: function () {
            return this._hiddenCalendars;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CalendarViewModel.prototype, "eventsForDays", {
        get: function () {
            return this._eventsForDays;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CalendarViewModel.prototype, "redraw", {
        get: function () {
            return this._redrawStream;
        },
        enumerable: false,
        configurable: true
    });
    CalendarViewModel.prototype.onDragStart = function (originalEvent, timeToMoveBy) {
        var eventClone = (0, tutanota_utils_1.clone)(originalEvent);
        updateTemporaryEventWithDiff(eventClone, originalEvent, timeToMoveBy);
        this._draggedEvent = {
            originalEvent: originalEvent,
            eventClone: eventClone
        };
    };
    CalendarViewModel.prototype.onDragUpdate = function (timeToMoveBy) {
        if (this._draggedEvent) {
            updateTemporaryEventWithDiff(this._draggedEvent.eventClone, this._draggedEvent.originalEvent, timeToMoveBy);
        }
    };
    /**
     * This is called when the event is dropped.
     */
    CalendarViewModel.prototype.onDragEnd = function (timeToMoveBy) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, originalEvent, eventClone, startTime, firstOccurrence, didUpdate, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(timeToMoveBy !== 0)) return [3 /*break*/, 7];
                        if (!this._draggedEvent) return [3 /*break*/, 6];
                        _a = this._draggedEvent, originalEvent = _a.originalEvent, eventClone = _a.eventClone;
                        this._draggedEvent = null;
                        updateTemporaryEventWithDiff(eventClone, originalEvent, timeToMoveBy);
                        this._addTransientEvent(eventClone);
                        startTime = void 0;
                        if (!originalEvent.repeatRule) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._entityClient.load(TypeRefs_js_1.CalendarEventTypeRef, originalEvent._id)];
                    case 1:
                        firstOccurrence = _b.sent();
                        startTime = new Date(firstOccurrence.startTime.getTime() + timeToMoveBy);
                        return [3 /*break*/, 3];
                    case 2:
                        startTime = eventClone.startTime;
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this._moveEvent(originalEvent, startTime)];
                    case 4:
                        didUpdate = _b.sent();
                        if (!didUpdate) {
                            this._removeTransientEvent(eventClone);
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        e_1 = _b.sent();
                        this._removeTransientEvent(eventClone);
                        throw e_1;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        this._draggedEvent = null;
                        _b.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(CalendarViewModel.prototype, "temporaryEvents", {
        get: function () {
            return this._transientEvents.concat(this._draggedEvent ? [this._draggedEvent.eventClone] : []);
        },
        enumerable: false,
        configurable: true
    });
    CalendarViewModel.prototype.setHiddenCalendars = function (newHiddenCalendars) {
        this._hiddenCalendars = newHiddenCalendars;
        this._deviceConfig.setHiddenCalendars(LoginController_1.logins.getUserController().user._id, __spreadArray([], newHiddenCalendars, true));
    };
    /**
     * Get calendar infos, creating a new calendar info if none exist
     * Not async because we want to return the result directly if it is available when called
     * otherwise we return a promise
     */
    CalendarViewModel.prototype.getCalendarInfosCreateIfNeeded = function () {
        var _this = this;
        if (this._calendarInfos.isLoaded() && this.calendarInfos.getLoaded().size > 0) {
            return this._calendarInfos.getLoaded();
        }
        return Promise.resolve().then(function () { return __awaiter(_this, void 0, void 0, function () {
            var calendars;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._calendarInfos.getAsync()];
                    case 1:
                        calendars = _a.sent();
                        if (!(calendars.size > 0)) return [3 /*break*/, 2];
                        return [2 /*return*/, calendars];
                    case 2: return [4 /*yield*/, this._calendarModel.createCalendar("", null)];
                    case 3:
                        _a.sent();
                        this._calendarInfos = new tutanota_utils_1.LazyLoaded(function () { return _this._calendarModel.loadCalendarInfos(new ProgressMonitor_1.NoopProgressMonitor()); });
                        return [2 /*return*/, this._calendarInfos.getAsync()];
                }
            });
        }); });
    };
    /**
     * Given a events and days, return the long and short events of that range of days
     *we detect events that should be removed based on their UID + start and end time
     *
     * @param days: The range of days from which events should be returned
     * @returns    shortEvents: Array<Array<CalendarEvent>>, short events per day.,
     *             longEvents: Array<CalendarEvent>: long events over the whole range,
     *             days: Array<Date>: the original days that were passed in
     */
    CalendarViewModel.prototype.getEventsOnDays = function (days) {
        var _this = this;
        var _a, _b, _c;
        var longEvents = new Set();
        var shortEvents = [];
        // It might be the case that a UID is shared by events across calendars, so we need to differentiate them by list ID aswell
        var transientEventUidsByCalendar = (0, tutanota_utils_1.groupByAndMapUniquely)(this._transientEvents, function (event) { return (0, EntityUtils_1.getListId)(event); }, function (event) { return event.uid; });
        var _loop_1 = function (day) {
            var shortEventsForDay = [];
            var events = this_1._eventsForDays.get(day.getTime()) || [];
            var sortEvent = function (event) {
                if ((0, CommonCalendarUtils_1.isAllDayEvent)(event) || (0, CalendarUtils_1.getDiffInHours)(event.startTime, event.endTime) >= 24) {
                    longEvents.add(event);
                }
                else {
                    shortEventsForDay.push(event);
                }
            };
            for (var _d = 0, events_1 = events; _d < events_1.length; _d++) {
                var event_1 = events_1[_d];
                if ((_a = transientEventUidsByCalendar.get((0, EntityUtils_1.getListId)(event_1))) === null || _a === void 0 ? void 0 : _a.has(event_1.uid)) {
                    continue;
                }
                if (((_b = this_1._draggedEvent) === null || _b === void 0 ? void 0 : _b.originalEvent) !== event_1 && !this_1._hiddenCalendars.has((0, tutanota_utils_1.neverNull)(event_1._ownerGroup))) {
                    sortEvent(event_1);
                }
            }
            this_1._transientEvents.filter(function (event) { return (0, CalendarUtils_1.isEventBetweenDays)(event, day, day, _this._timeZone); }).forEach(sortEvent);
            var temporaryEvent = (_c = this_1._draggedEvent) === null || _c === void 0 ? void 0 : _c.eventClone;
            if (temporaryEvent && (0, CalendarUtils_1.isEventBetweenDays)(temporaryEvent, day, day, this_1._timeZone)) {
                sortEvent(temporaryEvent);
            }
            shortEvents.push(shortEventsForDay);
        };
        var this_1 = this;
        for (var _i = 0, days_1 = days; _i < days_1.length; _i++) {
            var day = days_1[_i];
            _loop_1(day);
        }
        var longEventsArray = Array.from(longEvents);
        return {
            days: days,
            longEvents: longEventsArray,
            shortEvents: shortEvents.map(function (innerShortEvents) { return innerShortEvents.filter(function (event) { return !longEvents.has(event); }); })
        };
    };
    CalendarViewModel.prototype.deleteCalendar = function (calendar) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._calendarModel.deleteCalendar(calendar)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CalendarViewModel.prototype._addTransientEvent = function (event) {
        this._transientEvents.push(event);
    };
    CalendarViewModel.prototype._removeTransientEvent = function (event) {
        (0, tutanota_utils_1.findAndRemove)(this._transientEvents, function (transient) { return transient.uid === event.uid; });
    };
    CalendarViewModel.prototype._moveEvent = function (event, newStartDate) {
        return __awaiter(this, void 0, void 0, function () {
            var viewModel;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._createCalendarEventViewModelCallback(event, this.calendarInfos)];
                    case 1:
                        viewModel = _a.sent();
                        viewModel.rescheduleEvent(newStartDate);
                        // Errors are handled in the individual views
                        return [2 /*return*/, viewModel.saveAndSend({
                                askForUpdates: CalendarGuiUtils_1.askIfShouldSendCalendarUpdatesToAttendees,
                                askInsecurePassword: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, true];
                                }); }); },
                                showProgress: tutanota_utils_1.noOp
                            })];
                }
            });
        });
    };
    CalendarViewModel.prototype._addOrUpdateEvent = function (calendarInfo, event) {
        var _this = this;
        if (calendarInfo) {
            var eventListId = (0, EntityUtils_1.getListId)(event);
            var eventMonth = (0, CalendarUtils_1.getMonth)((0, CalendarUtils_1.getEventStart)(event, this._timeZone), this._timeZone);
            if ((0, EntityUtils_1.isSameId)(calendarInfo.groupRoot.shortEvents, eventListId)) {
                // If the month is not loaded, we don't want to put it into events.
                // We will put it there when we load the month
                if (!this._loadedMonths.has(eventMonth.start.getTime())) {
                    return;
                }
                this._addDaysForEvent(event, eventMonth);
            }
            else if ((0, EntityUtils_1.isSameId)(calendarInfo.groupRoot.longEvents, eventListId)) {
                this._removeExistingEvent(calendarInfo.longEvents.getLoaded(), event);
                calendarInfo.longEvents.getLoaded().push(event);
                this._loadedMonths.forEach(function (firstDayTimestamp) {
                    var loadedMonth = (0, CalendarUtils_1.getMonth)(new Date(firstDayTimestamp), _this._timeZone);
                    if (event.repeatRule) {
                        _this._addDaysForRecurringEvent(event, loadedMonth);
                    }
                    else {
                        _this._addDaysForLongEvent(event, loadedMonth);
                    }
                });
            }
        }
    };
    CalendarViewModel.prototype._entityEventReceived = function (updates, eventOwnerGroupId) {
        var _this = this;
        return this._calendarInfos.getAsync().then(function (calendarEvents) {
            var addedOrUpdatedEventsUpdates = []; // we try to make get multiple requests for calendar events potentially created by post multiple
            return (0, tutanota_utils_1.promiseMap)(updates, function (update) {
                if ((0, EventController_1.isUpdateForTypeRef)(TypeRefs_js_3.UserSettingsGroupRootTypeRef, update)) {
                    _this._redraw();
                }
                if ((0, EventController_1.isUpdateForTypeRef)(TypeRefs_js_1.CalendarEventTypeRef, update)) {
                    if (update.operation === "0" /* OperationType.CREATE */ || update.operation === "1" /* OperationType.UPDATE */) {
                        addedOrUpdatedEventsUpdates.push(update);
                    }
                    else if (update.operation === "2" /* OperationType.DELETE */) {
                        _this._removeDaysForEvent([update.instanceListId, update.instanceId], eventOwnerGroupId);
                        _this._redraw();
                    }
                }
                else if ((0, EventController_1.isUpdateForTypeRef)(TypeRefs_js_4.UserTypeRef, update) && // only process update event received for the user group - to not process user update from admin membership.
                    (0, EntityUtils_1.isSameId)(eventOwnerGroupId, LoginController_1.logins.getUserController().user.userGroup.group)) {
                    if (update.operation === "1" /* OperationType.UPDATE */) {
                        var calendarMemberships_1 = LoginController_1.logins.getUserController().getCalendarMemberships();
                        return _this._calendarInfos.getAsync().then(function (calendarInfos) {
                            // Remove calendars we no longer have membership in
                            calendarInfos.forEach(function (ci, group) {
                                if (calendarMemberships_1.every(function (mb) { return group !== mb.group; })) {
                                    _this._hiddenCalendars["delete"](group);
                                }
                            });
                            var oldGroupIds = new Set(calendarInfos.keys());
                            var newGroupIds = new Set(calendarMemberships_1.map(function (m) { return m.group; }));
                            var diff = (0, tutanota_utils_1.symmetricDifference)(oldGroupIds, newGroupIds);
                            if (diff.size !== 0) {
                                _this._loadedMonths.clear();
                                _this._replaceEvents(new Map());
                                _this._calendarInfos = new tutanota_utils_1.LazyLoaded(function () { return _this._calendarModel.loadCalendarInfos(new ProgressMonitor_1.NoopProgressMonitor()); }).load();
                                return _this._calendarInfos
                                    .getAsync()
                                    .then(function () {
                                    var selectedDate = _this.selectedDate();
                                    var previousMonthDate = new Date(selectedDate);
                                    previousMonthDate.setMonth(selectedDate.getMonth() - 1);
                                    var nextMonthDate = new Date(selectedDate);
                                    nextMonthDate.setMonth(selectedDate.getMonth() + 1);
                                    return _this._loadMonthIfNeeded(selectedDate)
                                        .then(function () { return _this._loadMonthIfNeeded(nextMonthDate); })
                                        .then(function () { return _this._loadMonthIfNeeded(previousMonthDate); });
                                })
                                    .then(function () { return _this._redraw(); });
                            }
                        });
                    }
                }
                else if ((0, EventController_1.isUpdateForTypeRef)(TypeRefs_js_2.GroupInfoTypeRef, update)) {
                    _this._calendarInfos.getAsync().then(function (calendarInfos) {
                        var calendarInfo = calendarInfos.get(eventOwnerGroupId); // ensure that it is a GroupInfo update for a calendar group.
                        if (calendarInfo) {
                            return _this._entityClient.load(TypeRefs_js_2.GroupInfoTypeRef, [update.instanceListId, update.instanceId]).then(function (groupInfo) {
                                calendarInfo.groupInfo = groupInfo;
                                _this._redraw();
                            });
                        }
                    });
                }
            }).then(function () {
                // handle potential post multiple updates in get multiple requests
                // this is only necessary until post multiple updates are dealt with in EntityRestCache
                var updatesPerList = (0, tutanota_utils_1.groupBy)(addedOrUpdatedEventsUpdates, function (update) { return update.instanceListId; });
                return (0, tutanota_utils_1.promiseMap)(updatesPerList, function (_a) {
                    var instanceListId = _a[0], updates = _a[1];
                    var ids = updates.map(function (update) { return update.instanceId; });
                    return _this._entityClient
                        .loadMultiple(TypeRefs_js_1.CalendarEventTypeRef, instanceListId, ids)
                        .then(function (events) {
                        events.forEach(function (event) {
                            var _a;
                            _this._addOrUpdateEvent((_a = calendarEvents.get((0, tutanota_utils_1.neverNull)(event._ownerGroup))) !== null && _a !== void 0 ? _a : null, event);
                            _this._removeTransientEvent(event);
                        });
                        _this._redraw();
                    })["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotAuthorizedError, function (e) {
                        // return updates that are not in cache Range if NotAuthorizedError (for those updates that are in cache range)
                        console.log("NotAuthorizedError for event in entityEventsReceived of view", e);
                    }))["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotFoundError, function (e) {
                        console.log("Not found event in entityEventsReceived of view", e);
                    }));
                }).then(tutanota_utils_1.noOp);
            });
        });
    };
    CalendarViewModel.prototype._loadMonthIfNeeded = function (dayInMonth) {
        return __awaiter(this, void 0, void 0, function () {
            var month, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        month = (0, CalendarUtils_1.getMonth)(dayInMonth, this._timeZone);
                        if (!!this._loadedMonths.has(month.start.getTime())) return [3 /*break*/, 5];
                        this._loadedMonths.add(month.start.getTime());
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, this._loadEvents(month)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        e_2 = _a.sent();
                        this._loadedMonths["delete"](month.start.getTime());
                        throw e_2;
                    case 4:
                        this._redraw();
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    CalendarViewModel.prototype._loadEvents = function (month) {
        var _this = this;
        return this._calendarInfos.getAsync().then(function (calendarInfos) {
            // Because of the timezones and all day events, we might not load an event which we need to display.
            // So we add a margin on 24 hours to be sure we load everything we need. We will filter matching
            // events anyway.
            var startId = (0, CommonCalendarUtils_1.getEventElementMinId)(month.start.getTime() - tutanota_utils_1.DAY_IN_MILLIS);
            var endId = (0, CommonCalendarUtils_1.geEventElementMaxId)(month.end.getTime() + tutanota_utils_1.DAY_IN_MILLIS);
            // We collect events from all calendars together and then replace map synchronously.
            // This is important to replace the map synchronously to not get race conditions because we load different months in parallel.
            // We could replace map more often instead of aggregating events but this would mean creating even more (cals * months) maps.
            //
            // Note: there may be issues if we get entity update before other calendars finish loading but the chance is low and we do not
            // take care of this now.
            var aggregateShortEvents = [];
            var aggregateLongEvents = [];
            return (0, tutanota_utils_1.promiseMap)(calendarInfos.values(), function (calendarInfo) {
                var groupRoot = calendarInfo.groupRoot, longEvents = calendarInfo.longEvents;
                return Promise.all([
                    _this._entityClient.loadReverseRangeBetween(TypeRefs_js_1.CalendarEventTypeRef, groupRoot.shortEvents, endId, startId, 200),
                    longEvents.getAsync(),
                ]).then(function (_a) {
                    var shortEventsResult = _a[0], longEvents = _a[1];
                    aggregateShortEvents.push.apply(aggregateShortEvents, shortEventsResult.elements);
                    aggregateLongEvents.push.apply(aggregateLongEvents, longEvents);
                });
            }).then(function () {
                var newEvents = _this._cloneEvents();
                aggregateShortEvents
                    .filter(function (e) {
                    var eventStart = (0, CalendarUtils_1.getEventStart)(e, _this._timeZone).getTime();
                    return eventStart >= month.start.getTime() && eventStart < month.end.getTime();
                }) // only events for the loaded month
                    .forEach(function (e) {
                    (0, CalendarUtils_1.addDaysForEvent)(newEvents, e, month);
                });
                var zone = _this._timeZone;
                aggregateLongEvents.forEach(function (e) {
                    if (e.repeatRule) {
                        (0, CalendarUtils_1.addDaysForRecurringEvent)(newEvents, e, month, zone);
                    }
                    else {
                        // Event through we get the same set of long events for each month we have to invoke this for each month
                        // because addDaysForLongEvent adds days only for the specified month.
                        (0, CalendarUtils_1.addDaysForLongEvent)(newEvents, e, month, zone);
                    }
                });
                _this._replaceEvents(newEvents);
            });
        });
    };
    /**
     * Removes existing event from {@param events} and also from {@code this._eventsForDays} if end time does not match
     */
    CalendarViewModel.prototype._removeExistingEvent = function (events, newEvent) {
        var indexOfOldEvent = events.findIndex(function (el) { return (0, CalendarUtils_1.isSameEvent)(el, newEvent); });
        if (indexOfOldEvent !== -1) {
            var oldEvent_1 = events[indexOfOldEvent];
            // If the old and new event end times do not match, we need to remove all occurrences of old event, otherwise iterating
            // occurrences of new event won't replace all occurrences of old event. Changes of start or repeat rule already change
            // ID of the event so it is not a problem.
            if (oldEvent_1.endTime.getTime() !== newEvent.endTime.getTime()) {
                var newMap = this._cloneEvents();
                newMap.forEach(function (dayEvents) { return (0, tutanota_utils_1.findAllAndRemove)(dayEvents, function (e) { return (0, EntityUtils_1.isSameId)(e._id, oldEvent_1._id); }); });
                this._replaceEvents(newMap);
            }
            events.splice(indexOfOldEvent, 1);
        }
    };
    CalendarViewModel.prototype._addDaysForEvent = function (event, month) {
        var newMap = this._cloneEvents();
        (0, CalendarUtils_1.addDaysForEvent)(newMap, event, month);
        this._replaceEvents(newMap);
    };
    CalendarViewModel.prototype._replaceEvents = function (newMap) {
        this._eventsForDays = (0, tutanota_utils_1.freezeMap)(newMap);
    };
    CalendarViewModel.prototype._cloneEvents = function () {
        return new Map(this._eventsForDays);
    };
    CalendarViewModel.prototype._addDaysForRecurringEvent = function (event, month) {
        if (-luxon_1.DateTime.fromJSDate(event.startTime).diffNow("year").years > exports.LIMIT_PAST_EVENTS_YEARS) {
            console.log("repeating event is too far into the past", event);
            return;
        }
        var newMap = this._cloneEvents();
        (0, CalendarUtils_1.addDaysForRecurringEvent)(newMap, event, month, this._timeZone);
        this._replaceEvents(newMap);
    };
    CalendarViewModel.prototype._removeDaysForEvent = function (id, ownerGroupId) {
        var newMap = this._cloneEvents();
        newMap.forEach(function (dayEvents) { return (0, tutanota_utils_1.findAllAndRemove)(dayEvents, function (e) { return (0, EntityUtils_1.isSameId)(e._id, id); }); });
        this._replaceEvents(newMap);
        if (this._calendarInfos.isLoaded()) {
            var infos = this._calendarInfos.getLoaded();
            var info = infos.get(ownerGroupId);
            if (info) {
                if ((0, EntityUtils_1.isSameId)((0, EntityUtils_1.listIdPart)(id), info.groupRoot.longEvents)) {
                    (0, tutanota_utils_1.findAndRemove)(info.longEvents.getLoaded(), function (e) { return (0, EntityUtils_1.isSameId)(e._id, id); });
                }
            }
        }
    };
    CalendarViewModel.prototype._addDaysForLongEvent = function (event, month) {
        var newMap = this._cloneEvents();
        (0, CalendarUtils_1.addDaysForLongEvent)(newMap, event, month);
        this._replaceEvents(newMap);
    };
    CalendarViewModel.prototype._redraw = function () {
        // Need to pass some argument to make it a "set" operation
        this._redrawStream(undefined);
    };
    return CalendarViewModel;
}());
exports.CalendarViewModel = CalendarViewModel;
function updateTemporaryEventWithDiff(eventClone, originalEvent, mouseDiff) {
    eventClone.startTime = new Date(originalEvent.startTime.getTime() + mouseDiff);
    eventClone.endTime = new Date(originalEvent.endTime.getTime() + mouseDiff);
}
