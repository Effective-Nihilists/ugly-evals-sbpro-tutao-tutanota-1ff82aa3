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
exports.CalendarModelImpl = void 0;
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var TutanotaConstants_1 = require("../../api/common/TutanotaConstants");
var EventController_1 = require("../../api/main/EventController");
var TypeRefs_js_1 = require("../../api/entities/sys/TypeRefs.js");
var TypeRefs_js_2 = require("../../api/entities/tutanota/TypeRefs.js");
var Env_1 = require("../../api/common/Env");
var LoginController_1 = require("../../api/main/LoginController");
var RestError_1 = require("../../api/common/error/RestError");
var TypeRefs_js_3 = require("../../api/entities/tutanota/TypeRefs.js");
var TypeRefs_js_4 = require("../../api/entities/sys/TypeRefs.js");
var TypeRefs_js_5 = require("../../api/entities/tutanota/TypeRefs.js");
var TypeRefs_js_6 = require("../../api/entities/sys/TypeRefs.js");
var TypeRefs_js_7 = require("../../api/entities/sys/TypeRefs.js");
var ParserCombinator_1 = require("../../misc/parsing/ParserCombinator");
var EntityUtils_1 = require("../../api/common/utils/EntityUtils");
var TypeRefs_js_8 = require("../../api/entities/tutanota/TypeRefs.js");
var mithril_1 = require("mithril");
var TypeRefs_js_9 = require("../../api/entities/tutanota/TypeRefs.js");
var Services_1 = require("../../api/entities/sys/Services");
var CalendarModelImpl = /** @class */ (function () {
    function CalendarModelImpl(notifications, alarmScheduler, eventController, serviceExecutor, logins, progressTracker, entityClient, mailModel, calendarFacade, fileController) {
        var _this = this;
        this.serviceExecutor = serviceExecutor;
        this.fileController = fileController;
        this._notifications = notifications;
        this._alarmScheduler = alarmScheduler;
        this._logins = logins;
        this._scheduledNotifications = new Map();
        this._pendingAlarmRequests = new Map();
        this._progressTracker = progressTracker;
        this._entityClient = entityClient;
        this._mailModel = mailModel;
        this._calendarFacade = calendarFacade;
        this._userAlarmToAlarmInfo = new Map();
        if (!(0, Env_1.isApp)()) {
            eventController.addEntityListener(function (updates) {
                return _this._entityEventsReceived(updates);
            });
        }
    }
    CalendarModelImpl.prototype.createEvent = function (event, alarmInfos, zone, groupRoot) {
        return this._doCreate(event, zone, groupRoot, alarmInfos);
    };
    /**
     * Update existing event.
     * */
    CalendarModelImpl.prototype.updateEvent = function (newEvent, newAlarms, zone, groupRoot, existingEvent) {
        var _this = this;
        if (existingEvent._id == null) {
            throw new Error("Invalid existing event: no id");
        }
        if (existingEvent._ownerGroup !== groupRoot._id ||
            newEvent.startTime.getTime() !== existingEvent.startTime.getTime() ||
            !repeatRulesEqual(newEvent.repeatRule, existingEvent.repeatRule)) {
            // We should reload the instance here because session key and permissions are updated when we recreate event.
            return this._doCreate(newEvent, zone, groupRoot, newAlarms, existingEvent).then(function () {
                return _this._entityClient.load(TypeRefs_js_2.CalendarEventTypeRef, newEvent._id);
            });
        }
        else {
            newEvent._ownerGroup = groupRoot._id;
            // We can't load updated event here because cache is not updated yet. We also shouldn't need to load it, we have the latest
            // version
            return this._calendarFacade.updateCalendarEvent(newEvent, newAlarms, existingEvent).then(function () { return newEvent; });
        }
    };
    CalendarModelImpl.prototype.loadCalendarInfos = function (progressMonitor) {
        var _this = this;
        var user = this._logins.getUserController().user;
        var calendarMemberships = user.memberships.filter(function (m) { return m.groupType === TutanotaConstants_1.GroupType.Calendar; });
        var notFoundMemberships = [];
        return (0, tutanota_utils_1.promiseMap)(calendarMemberships, function (membership) {
            return Promise.all([
                _this._entityClient.load(TypeRefs_js_3.CalendarGroupRootTypeRef, membership.group).then(function (it) {
                    progressMonitor.workDone(1);
                    return it;
                }),
                _this._entityClient.load(TypeRefs_js_4.GroupInfoTypeRef, membership.groupInfo).then(function (it) {
                    progressMonitor.workDone(1);
                    return it;
                }),
                _this._entityClient.load(TypeRefs_js_7.GroupTypeRef, membership.group).then(function (it) {
                    progressMonitor.workDone(1);
                    return it;
                }),
            ])["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotFoundError, function () {
                notFoundMemberships.push(membership);
                progressMonitor.workDone(3);
                return null;
            }));
        }).then(function (groupInstances) {
            var calendarInfos = new Map();
            var filtered = groupInstances.filter(tutanota_utils_1.isNotNull);
            progressMonitor.workDone(groupInstances.length - filtered.length); // say we completed all the ones that we wont have to load
            filtered.forEach(function (_a) {
                var groupRoot = _a[0], groupInfo = _a[1], group = _a[2];
                calendarInfos.set(groupRoot._id, {
                    groupRoot: groupRoot,
                    groupInfo: groupInfo,
                    longEvents: new tutanota_utils_1.LazyLoaded(function () { return _this._entityClient.loadAll(TypeRefs_js_2.CalendarEventTypeRef, groupRoot.longEvents); }, []),
                    group: group,
                    shared: !(0, EntityUtils_1.isSameId)(group.user, user._id)
                });
            });
            // cleanup inconsistent memberships
            (0, tutanota_utils_1.promiseMap)(notFoundMemberships, function (notFoundMembership) {
                var data = (0, TypeRefs_js_6.createMembershipRemoveData)({
                    user: user._id,
                    group: notFoundMembership.group
                });
                return _this.serviceExecutor["delete"](Services_1.MembershipService, data);
            });
            return calendarInfos;
        });
    };
    CalendarModelImpl.prototype.loadOrCreateCalendarInfo = function (progressMonitor) {
        return __awaiter(this, void 0, void 0, function () {
            var findPrivateCalendar, calendarInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../date/CalendarUtils"); })];
                    case 1:
                        findPrivateCalendar = (_a.sent()).findPrivateCalendar;
                        return [4 /*yield*/, this.loadCalendarInfos(progressMonitor)];
                    case 2:
                        calendarInfo = _a.sent();
                        if (!(!this._logins.isInternalUserLoggedIn() || findPrivateCalendar(calendarInfo))) return [3 /*break*/, 3];
                        return [2 /*return*/, calendarInfo];
                    case 3: return [4 /*yield*/, this.createCalendar("", null)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, this.loadCalendarInfos(progressMonitor)];
                }
            });
        });
    };
    CalendarModelImpl.prototype.createCalendar = function (name, color) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, user, group, userSettingsGroupRoot, newGroupSettings;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this._calendarFacade.addCalendar(name)];
                    case 1:
                        _a = _b.sent(), user = _a.user, group = _a.group;
                        this._logins.getUserController().user = user;
                        if (!(color != null)) return [3 /*break*/, 3];
                        userSettingsGroupRoot = this._logins.getUserController().userSettingsGroupRoot;
                        newGroupSettings = Object.assign((0, TypeRefs_js_9.createGroupSettings)(), {
                            group: group._id,
                            color: color
                        });
                        userSettingsGroupRoot.groupSettings.push(newGroupSettings);
                        return [4 /*yield*/, this._entityClient.update(userSettingsGroupRoot)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CalendarModelImpl.prototype._doCreate = function (event, zone, groupRoot, alarmInfos, existingEvent) {
        var _this = this;
        return Promise.resolve().then(function () { return require("../date/CalendarUtils"); }).then(function (_a) {
            var assignEventId = _a.assignEventId;
            // if values of the existing events have changed that influence the alarm time then delete the old event and create a new
            // one.
            assignEventId(event, zone, groupRoot);
            // Reset ownerEncSessionKey because it cannot be set for new entity, it will be assigned by the CryptoFacade
            event._ownerEncSessionKey = null;
            // Reset permissions because server will assign them
            (0, tutanota_utils_1.downcast)(event)._permissions = null;
            event._ownerGroup = groupRoot._id;
            return _this._calendarFacade.saveCalendarEvent(event, alarmInfos, existingEvent !== null && existingEvent !== void 0 ? existingEvent : null);
        });
    };
    CalendarModelImpl.prototype.deleteEvent = function (event) {
        return this._entityClient.erase(event);
    };
    CalendarModelImpl.prototype._loadAndProcessCalendarUpdates = function () {
        var _this = this;
        return this._mailModel.getUserMailboxDetails().then(function (mailboxDetails) {
            var calendarEventUpdates = mailboxDetails.mailboxGroupRoot.calendarEventUpdates;
            if (calendarEventUpdates == null)
                return;
            _this._entityClient.loadAll(TypeRefs_js_5.CalendarEventUpdateTypeRef, calendarEventUpdates.list).then(function (invites) {
                return (0, tutanota_utils_1.promiseMap)(invites, function (invite) {
                    return _this._handleCalendarEventUpdate(invite);
                });
            });
        });
    };
    CalendarModelImpl.prototype._handleCalendarEventUpdate = function (update) {
        var _this = this;
        return this._entityClient
            .load(TypeRefs_js_8.FileTypeRef, update.file)
            .then(function (file) { return _this.fileController.downloadAndDecrypt(file); })
            .then(function (dataFile) { return Promise.resolve().then(function () { return require("../export/CalendarImporter"); }).then(function (_a) {
            var parseCalendarFile = _a.parseCalendarFile;
            return parseCalendarFile(dataFile);
        }); })
            .then(function (parsedCalendarData) { return _this.processCalendarUpdate(update.sender, parsedCalendarData); })["catch"](function (e) {
            if (e instanceof ParserCombinator_1.ParserError || e instanceof RestError_1.NotFoundError) {
                console.warn("Error while parsing calendar update", e);
            }
            else {
                throw e;
            }
        })
            .then(function () { return _this._entityClient.erase(update); })["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotAuthorizedError, function (e) { return console.warn("Error during processing of calendar update", e); }))["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.PreconditionFailedError, function (e) { return console.warn("Precondition error when processing calendar update", e); }))["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.LockedError, tutanota_utils_1.noOp));
    };
    /**
     * Processing calendar update - bring events in calendar up-to-date with updates sent via email.
     * Calendar updates are currently processed for REPLY, REQUEST and CANCEL calendar types. For REQUEST type the update is only processed
     * if there is an existing event.
     * For REPLY we update attendee status, for REQUEST we update event and for CANCEL we delete existing event.
     */
    CalendarModelImpl.prototype.processCalendarUpdate = function (sender, calendarData) {
        var _this = this;
        if (calendarData.contents.length !== 1) {
            console.log("Calendar update with ".concat(calendarData.contents.length, " events, ignoring"));
            return Promise.resolve();
        }
        var event = calendarData.contents[0].event;
        if (event == null || event.uid == null) {
            console.log("Invalid event: ", event);
            return Promise.resolve();
        }
        var uid = event.uid;
        if (calendarData.method === TutanotaConstants_1.CalendarMethod.REPLY) {
            // Process it
            return this._calendarFacade.getEventByUid(uid).then(function (dbEvent) {
                if (dbEvent == null) {
                    // event was not found
                    return;
                }
                // first check if the sender of the email is in the attendee list
                var replyAttendee = event.attendees.find(function (a) { return a.address.address === sender; });
                if (replyAttendee == null) {
                    console.log("Sender is not among attendees, ignoring", replyAttendee);
                    return;
                }
                var newEvent = (0, tutanota_utils_1.clone)(dbEvent);
                // check if the attendee is still in the attendee list of the latest event
                var dbAttendee = newEvent.attendees.find(function (a) { return replyAttendee.address.address === a.address.address; });
                if (dbAttendee == null) {
                    console.log("Attendee was not found", dbEvent._id, replyAttendee);
                    return;
                }
                dbAttendee.status = replyAttendee.status;
                return _this._updateEvent(dbEvent, newEvent).then(tutanota_utils_1.noOp);
            });
        }
        else if (calendarData.method === TutanotaConstants_1.CalendarMethod.REQUEST) {
            // Either initial invite or update
            return this._calendarFacade.getEventByUid(uid).then(function (dbEvent) {
                if (dbEvent) {
                    // then it's an update
                    if (dbEvent.organizer == null || dbEvent.organizer.address !== sender) {
                        console.log("REQUEST sent not by organizer, ignoring");
                        return;
                    }
                    if ((0, tutanota_utils_1.filterInt)(dbEvent.sequence) < (0, tutanota_utils_1.filterInt)(event.sequence)) {
                        return _this.updateEventWithExternal(dbEvent, event).then(tutanota_utils_1.noOp);
                    }
                }
            });
        }
        else if (calendarData.method === TutanotaConstants_1.CalendarMethod.CANCEL) {
            return this._calendarFacade.getEventByUid(uid).then(function (dbEvent) {
                if (dbEvent != null) {
                    if (dbEvent.organizer == null || dbEvent.organizer.address !== sender) {
                        console.log("CANCEL sent not by organizer, ignoring");
                        return;
                    }
                    //console.log("Deleting cancelled event", uid, dbEvent._id)
                    return _this._entityClient.erase(dbEvent);
                }
            });
        }
        else {
            return Promise.resolve();
        }
    };
    CalendarModelImpl.prototype.updateEventWithExternal = function (dbEvent, event) {
        var newEvent = (0, tutanota_utils_1.clone)(dbEvent);
        newEvent.startTime = event.startTime;
        newEvent.endTime = event.endTime;
        newEvent.attendees = event.attendees;
        newEvent.summary = event.summary;
        newEvent.sequence = event.sequence;
        newEvent.location = event.location;
        newEvent.description = event.description;
        newEvent.organizer = event.organizer;
        newEvent.repeatRule = event.repeatRule;
        return this._updateEvent(dbEvent, newEvent);
    };
    CalendarModelImpl.prototype._updateEvent = function (dbEvent, newEvent) {
        var _this = this;
        return Promise.all([
            this.loadAlarms(dbEvent.alarmInfos, this._logins.getUserController().user),
            this._entityClient.load(TypeRefs_js_3.CalendarGroupRootTypeRef, (0, tutanota_utils_1.assertNotNull)(dbEvent._ownerGroup)),
        ]).then(function (_a) {
            var alarms = _a[0], groupRoot = _a[1];
            var alarmInfos = alarms.map(function (a) { return a.alarmInfo; });
            return _this.updateEvent(newEvent, alarmInfos, "", groupRoot, dbEvent);
        });
    };
    CalendarModelImpl.prototype.init = function () {
        var _this = this;
        return this.scheduleAlarmsLocally().then(function () { return _this._loadAndProcessCalendarUpdates(); });
    };
    CalendarModelImpl.prototype.scheduleAlarmsLocally = function () {
        var _this = this;
        if (this._localAlarmsEnabled()) {
            return this._calendarFacade.loadAlarmEvents().then(function (eventsWithInfos) {
                for (var _i = 0, eventsWithInfos_1 = eventsWithInfos; _i < eventsWithInfos_1.length; _i++) {
                    var _a = eventsWithInfos_1[_i], event_1 = _a.event, userAlarmInfos = _a.userAlarmInfos;
                    for (var _b = 0, userAlarmInfos_1 = userAlarmInfos; _b < userAlarmInfos_1.length; _b++) {
                        var userAlarmInfo = userAlarmInfos_1[_b];
                        _this._scheduleUserAlarmInfo(event_1, userAlarmInfo);
                    }
                }
            });
        }
        else {
            return Promise.resolve();
        }
    };
    CalendarModelImpl.prototype.loadAlarms = function (alarmInfos, user) {
        var alarmInfoList = user.alarmInfoList;
        if (alarmInfoList == null) {
            return Promise.resolve([]);
        }
        var ids = alarmInfos.filter(function (alarmInfoId) { return (0, EntityUtils_1.isSameId)((0, EntityUtils_1.listIdPart)(alarmInfoId), alarmInfoList.alarms); });
        if (ids.length === 0) {
            return Promise.resolve([]);
        }
        return this._entityClient.loadMultiple(TypeRefs_js_1.UserAlarmInfoTypeRef, (0, EntityUtils_1.listIdPart)(ids[0]), ids.map(EntityUtils_1.elementIdPart));
    };
    CalendarModelImpl.prototype.deleteCalendar = function (calendar) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._calendarFacade.deleteCalendar(calendar.groupRoot._id)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CalendarModelImpl.prototype._entityEventsReceived = function (updates) {
        var _this = this;
        return (0, tutanota_utils_1.promiseMap)(updates, function (entityEventData) {
            if ((0, EventController_1.isUpdateForTypeRef)(TypeRefs_js_1.UserAlarmInfoTypeRef, entityEventData)) {
                if (entityEventData.operation === "0" /* OperationType.CREATE */) {
                    // Updates for UserAlarmInfo and CalendarEvent come in a
                    // separate batches and there's a race between loading of the
                    // UserAlarmInfo and creation of the event.
                    // We try to load UserAlarmInfo. Then we wait until the
                    // CalendarEvent is there (which might already be true)
                    // and load it.
                    return _this._entityClient
                        .load(TypeRefs_js_1.UserAlarmInfoTypeRef, [entityEventData.instanceListId, entityEventData.instanceId])
                        .then(function (userAlarmInfo) {
                        var _a = userAlarmInfo.alarmInfo.calendarRef, listId = _a.listId, elementId = _a.elementId;
                        var deferredEvent = (0, tutanota_utils_1.getFromMap)(_this._pendingAlarmRequests, elementId, tutanota_utils_1.defer);
                        // Don't wait for the deferred event promise because it can lead to a deadlock.
                        // Since issue #2264 we process event batches sequentially and the
                        // deferred event can never be resolved until the calendar event update is received.
                        deferredEvent.promise = deferredEvent.promise.then(function () {
                            return _this._entityClient
                                .load(TypeRefs_js_2.CalendarEventTypeRef, [listId, elementId])
                                .then(function (calendarEvent) {
                                return _this._scheduleUserAlarmInfo(calendarEvent, userAlarmInfo);
                            })["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotFoundError, function () {
                                console.log("event not found", [listId, elementId]);
                            }));
                        });
                        return Promise.resolve();
                    })["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotFoundError, function (e) { return console.log(e, "Event or alarm were not found: ", entityEventData, e); }));
                }
                else if (entityEventData.operation === "2" /* OperationType.DELETE */) {
                    return _this._cancelUserAlarmInfo(entityEventData.instanceId);
                }
            }
            else if ((0, EventController_1.isUpdateForTypeRef)(TypeRefs_js_2.CalendarEventTypeRef, entityEventData) &&
                (entityEventData.operation === "0" /* OperationType.CREATE */ || entityEventData.operation === "1" /* OperationType.UPDATE */)) {
                var deferredEvent = (0, tutanota_utils_1.getFromMap)(_this._pendingAlarmRequests, entityEventData.instanceId, tutanota_utils_1.defer);
                deferredEvent.resolve(undefined);
                return deferredEvent.promise;
            }
            else if ((0, EventController_1.isUpdateForTypeRef)(TypeRefs_js_5.CalendarEventUpdateTypeRef, entityEventData) && entityEventData.operation === "0" /* OperationType.CREATE */) {
                return _this._entityClient
                    .load(TypeRefs_js_5.CalendarEventUpdateTypeRef, [entityEventData.instanceListId, entityEventData.instanceId])
                    .then(function (invite) { return _this._handleCalendarEventUpdate(invite); })["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotFoundError, function (e) {
                    console.log("invite not found", [entityEventData.instanceListId, entityEventData.instanceId], e);
                }));
            }
        }).then(tutanota_utils_1.noOp);
    };
    CalendarModelImpl.prototype._localAlarmsEnabled = function () {
        return !(0, Env_1.isApp)() && !(0, Env_1.isDesktop)() && LoginController_1.logins.isInternalUserLoggedIn() && !LoginController_1.logins.isEnabled(TutanotaConstants_1.FeatureType.DisableCalendar);
    };
    CalendarModelImpl.prototype._scheduleUserAlarmInfo = function (event, userAlarmInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var scheduler;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._alarmScheduler()];
                    case 1:
                        scheduler = _a.sent();
                        this._userAlarmToAlarmInfo.set((0, EntityUtils_1.getElementId)(userAlarmInfo), userAlarmInfo.alarmInfo.alarmIdentifier);
                        return [4 /*yield*/, scheduler.scheduleAlarm(event, userAlarmInfo.alarmInfo, event.repeatRule, function (title, body) {
                                _this._notifications.showNotification(title, {
                                    body: body
                                }, function () { return mithril_1["default"].route.set("/calendar"); });
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CalendarModelImpl.prototype._cancelUserAlarmInfo = function (userAlarmInfoId) {
        return __awaiter(this, void 0, void 0, function () {
            var identifier, alarmScheduler;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        identifier = this._userAlarmToAlarmInfo.get(userAlarmInfoId);
                        if (!identifier) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._alarmScheduler()];
                    case 1:
                        alarmScheduler = _a.sent();
                        alarmScheduler.cancelAlarm(identifier);
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    return CalendarModelImpl;
}());
exports.CalendarModelImpl = CalendarModelImpl;
// allDay event consists of full UTC days. It always starts at 00:00:00.00 of its start day in UTC and ends at
// 0 of the next day in UTC. Full day event time is relative to the local timezone. So startTime and endTime of
// allDay event just points us to the correct date.
// e.g. there's an allDay event in Europe/Berlin at 2nd of may. We encode it as:
// {startTime: new Date(Date.UTC(2019, 04, 2, 0, 0, 0, 0)), {endTime: new Date(Date.UTC(2019, 04, 3, 0, 0, 0, 0))}}
// We check the condition with time == 0 and take a UTC date (which is [2-3) so full day on the 2nd of May). We
function repeatRulesEqual(repeatRule, repeatRule2) {
    return ((repeatRule == null && repeatRule2 == null) ||
        (repeatRule != null &&
            repeatRule2 != null &&
            repeatRule.endType === repeatRule2.endType &&
            repeatRule.endValue === repeatRule2.endValue &&
            repeatRule.frequency === repeatRule2.frequency &&
            repeatRule.interval === repeatRule2.interval &&
            repeatRule.timeZone === repeatRule2.timeZone));
}
