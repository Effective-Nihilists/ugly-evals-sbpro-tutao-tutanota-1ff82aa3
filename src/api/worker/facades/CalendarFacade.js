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
exports.CalendarFacade = void 0;
var Env_1 = require("../../common/Env");
var TypeRefs_js_1 = require("../../entities/sys/TypeRefs.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var TutanotaConstants_1 = require("../../common/TutanotaConstants");
var TypeRefs_js_2 = require("../../entities/tutanota/TypeRefs.js");
var RestError_1 = require("../../common/error/RestError");
var EntityClient_1 = require("../../common/EntityClient");
var EntityUtils_1 = require("../../common/utils/EntityUtils");
var SetupMultipleError_1 = require("../../common/error/SetupMultipleError");
var ImportError_1 = require("../../common/error/ImportError");
var tutanota_crypto_1 = require("@tutao/tutanota-crypto");
var Services_1 = require("../../entities/sys/Services");
var Services_2 = require("../../entities/tutanota/Services");
var EntityFunctions_1 = require("../../common/EntityFunctions");
var ErrorCheckUtils_js_1 = require("../../common/utils/ErrorCheckUtils.js");
(0, Env_1.assertWorkerOrNode)();
function hashUid(uid) {
    return (0, tutanota_crypto_1.sha256Hash)((0, tutanota_utils_1.stringToUtf8Uint8Array)(uid));
}
var CalendarFacade = /** @class */ (function () {
    function CalendarFacade(userFacade, groupManagementFacade, 
    // We inject cache directly because we need to delete user from it for a hack
    entityRestCache, nativePushFacade, worker, instanceMapper, serviceExecutor, cryptoFacade) {
        this.userFacade = userFacade;
        this.groupManagementFacade = groupManagementFacade;
        this.entityRestCache = entityRestCache;
        this.nativePushFacade = nativePushFacade;
        this.worker = worker;
        this.instanceMapper = instanceMapper;
        this.serviceExecutor = serviceExecutor;
        this.cryptoFacade = cryptoFacade;
        this.entityClient = new EntityClient_1.EntityClient(this.entityRestCache);
    }
    CalendarFacade.prototype.hashEventUid = function (event) {
        event.hashedUid = event.uid ? hashUid(event.uid) : null;
    };
    CalendarFacade.prototype.saveImportedCalendarEvents = function (eventsWrapper) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                // it is safe to assume that all event uids are set here
                eventsWrapper.forEach(function (_a) {
                    var event = _a.event;
                    return _this.hashEventUid(event);
                });
                return [2 /*return*/, this._saveCalendarEvents(eventsWrapper)];
            });
        });
    };
    /**
     * We try to create as many events as possible and only throw the error at the end.
     * If alarmNotifications are created for an event that will later fail to be created we ignore them.
     * This function does not perform any checks on the event so it should only be called internally when
     * we can be sure that those checks have already been performed.
     * @param eventsWrapper the events and alarmNotifications to be created.
     */
    CalendarFacade.prototype._saveCalendarEvents = function (eventsWrapper) {
        return __awaiter(this, void 0, void 0, function () {
            var currentProgress, user, numEvents, eventsWithAlarms, eventsWithAlarmsByEventListId, collectedAlarmNotifications, size, failed, errors, _loop_1, this_1, _i, eventsWithAlarmsByEventListId_1, _a, listId, eventsWithAlarmsOfOneList, pushIdentifierList;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        currentProgress = 10;
                        return [4 /*yield*/, this.worker.sendProgress(currentProgress)];
                    case 1:
                        _b.sent();
                        user = this.userFacade.getLoggedInUser();
                        numEvents = eventsWrapper.length;
                        return [4 /*yield*/, this._saveMultipleAlarms(user, eventsWrapper)["catch"]((0, tutanota_utils_1.ofClass)(SetupMultipleError_1.SetupMultipleError, function (e) {
                                if (e.errors.some(ErrorCheckUtils_js_1.isOfflineError)) {
                                    //In this case the user will not be informed about the number of failed alarms. We considered this is okay because it is not actionable anyways.
                                    throw new RestError_1.ConnectionError("Connection lost while saving alarms");
                                }
                                else {
                                    throw new ImportError_1.ImportError("Could not save alarms.", numEvents);
                                }
                            }))];
                    case 2:
                        eventsWithAlarms = _b.sent();
                        eventsWithAlarms.forEach(function (_a) {
                            var event = _a.event, alarmInfoIds = _a.alarmInfoIds;
                            return (event.alarmInfos = alarmInfoIds);
                        });
                        currentProgress = 33;
                        return [4 /*yield*/, this.worker.sendProgress(currentProgress)];
                    case 3:
                        _b.sent();
                        eventsWithAlarmsByEventListId = (0, tutanota_utils_1.groupBy)(eventsWithAlarms, function (eventWrapper) { return (0, EntityUtils_1.getListId)(eventWrapper.event); });
                        collectedAlarmNotifications = [];
                        size = eventsWithAlarmsByEventListId.size;
                        failed = 0;
                        errors = [];
                        _loop_1 = function (listId, eventsWithAlarmsOfOneList) {
                            var successfulEvents, allAlarmNotificationsOfListId;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        successfulEvents = eventsWithAlarmsOfOneList;
                                        return [4 /*yield*/, this_1.entityClient
                                                .setupMultipleEntities(listId, eventsWithAlarmsOfOneList.map(function (e) { return e.event; }))["catch"]((0, tutanota_utils_1.ofClass)(SetupMultipleError_1.SetupMultipleError, function (e) {
                                                failed += e.failedInstances.length;
                                                errors = errors.concat(e.errors);
                                                successfulEvents = eventsWithAlarmsOfOneList.filter(function (_a) {
                                                    var event = _a.event;
                                                    return !e.failedInstances.includes(event);
                                                });
                                            }))];
                                    case 1:
                                        _c.sent();
                                        allAlarmNotificationsOfListId = (0, tutanota_utils_1.flat)(successfulEvents.map(function (event) { return event.alarmNotifications; }));
                                        collectedAlarmNotifications = collectedAlarmNotifications.concat(allAlarmNotificationsOfListId);
                                        currentProgress += Math.floor(56 / size);
                                        return [4 /*yield*/, this_1.worker.sendProgress(currentProgress)];
                                    case 2:
                                        _c.sent();
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, eventsWithAlarmsByEventListId_1 = eventsWithAlarmsByEventListId;
                        _b.label = 4;
                    case 4:
                        if (!(_i < eventsWithAlarmsByEventListId_1.length)) return [3 /*break*/, 7];
                        _a = eventsWithAlarmsByEventListId_1[_i], listId = _a[0], eventsWithAlarmsOfOneList = _a[1];
                        return [5 /*yield**/, _loop_1(listId, eventsWithAlarmsOfOneList)];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7: return [4 /*yield*/, this.entityClient.loadAll(TypeRefs_js_1.PushIdentifierTypeRef, (0, tutanota_utils_1.neverNull)(this.userFacade.getLoggedInUser().pushIdentifierList).list)];
                    case 8:
                        pushIdentifierList = _b.sent();
                        if (!(collectedAlarmNotifications.length > 0 && pushIdentifierList.length > 0)) return [3 /*break*/, 10];
                        return [4 /*yield*/, this._sendAlarmNotifications(collectedAlarmNotifications, pushIdentifierList)];
                    case 9:
                        _b.sent();
                        _b.label = 10;
                    case 10: return [4 /*yield*/, this.worker.sendProgress(100)];
                    case 11:
                        _b.sent();
                        if (failed !== 0) {
                            if (errors.some(ErrorCheckUtils_js_1.isOfflineError)) {
                                //In this case the user will not be informed about the number of failed events. We considered this is okay because it is not actionable anyways.
                                throw new RestError_1.ConnectionError("Connection lost while saving events");
                            }
                            else {
                                throw new ImportError_1.ImportError("Could not save events.", failed);
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CalendarFacade.prototype.saveCalendarEvent = function (event, alarmInfos, oldEvent) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (event._id == null)
                            throw new Error("No id set on the event");
                        if (event._ownerGroup == null)
                            throw new Error("No _ownerGroup is set on the event");
                        if (event.uid == null)
                            throw new Error("no uid set on the event");
                        this.hashEventUid(event);
                        if (!oldEvent) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.entityClient.erase(oldEvent)["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotFoundError, tutanota_utils_1.noOp))];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this._saveCalendarEvents([
                            {
                                event: event,
                                alarms: alarmInfos
                            },
                        ])];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CalendarFacade.prototype.updateCalendarEvent = function (event, newAlarms, existingEvent) {
        return __awaiter(this, void 0, void 0, function () {
            var user, userAlarmIdsWithAlarmNotificationsPerEvent, _a, alarmInfoIds, alarmNotifications, userAlarmInfoListId, pushIdentifierList;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        event._id = existingEvent._id;
                        event._ownerEncSessionKey = existingEvent._ownerEncSessionKey;
                        event._permissions = existingEvent._permissions;
                        user = this.userFacade.getLoggedInUser();
                        return [4 /*yield*/, this._saveMultipleAlarms(user, [
                                {
                                    event: event,
                                    alarms: newAlarms
                                },
                            ])];
                    case 1:
                        userAlarmIdsWithAlarmNotificationsPerEvent = _b.sent();
                        _a = userAlarmIdsWithAlarmNotificationsPerEvent[0], alarmInfoIds = _a.alarmInfoIds, alarmNotifications = _a.alarmNotifications;
                        userAlarmInfoListId = (0, tutanota_utils_1.neverNull)(user.alarmInfoList).alarms;
                        // Remove all alarms which belongs to the current user. We need to be careful about other users' alarms.
                        // Server takes care of the removed alarms,
                        event.alarmInfos = existingEvent.alarmInfos.filter(function (a) { return !(0, EntityUtils_1.isSameId)((0, EntityUtils_1.listIdPart)(a), userAlarmInfoListId); }).concat(alarmInfoIds);
                        return [4 /*yield*/, this.entityClient.update(event)];
                    case 2:
                        _b.sent();
                        if (!(alarmNotifications.length > 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.entityClient.loadAll(TypeRefs_js_1.PushIdentifierTypeRef, (0, tutanota_utils_1.neverNull)(this.userFacade.getLoggedInUser().pushIdentifierList).list)];
                    case 3:
                        pushIdentifierList = _b.sent();
                        return [4 /*yield*/, this._sendAlarmNotifications(alarmNotifications, pushIdentifierList)];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    CalendarFacade.prototype._sendAlarmNotifications = function (alarmNotifications, pushIdentifierList) {
        var _this = this;
        var notificationSessionKey = (0, tutanota_crypto_1.aes128RandomKey)();
        return this._encryptNotificationKeyForDevices(notificationSessionKey, alarmNotifications, pushIdentifierList).then(function () {
            var requestEntity = (0, TypeRefs_js_1.createAlarmServicePost)({
                alarmNotifications: alarmNotifications
            });
            return _this.serviceExecutor.post(Services_1.AlarmService, requestEntity, { sessionKey: notificationSessionKey });
        });
    };
    CalendarFacade.prototype._encryptNotificationKeyForDevices = function (notificationSessionKey, alarmNotifications, pushIdentifierList) {
        var _this = this;
        // PushID SK ->* Notification SK -> alarm fields
        return (0, tutanota_utils_1.promiseMap)(pushIdentifierList, function (identifier) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.cryptoFacade.resolveSessionKeyForInstance(identifier).then(function (pushIdentifierSk) {
                        if (pushIdentifierSk) {
                            var pushIdentifierSessionEncSessionKey = (0, tutanota_crypto_1.encryptKey)(pushIdentifierSk, notificationSessionKey);
                            return {
                                identifierId: identifier._id,
                                pushIdentifierSessionEncSessionKey: pushIdentifierSessionEncSessionKey
                            };
                        }
                        else {
                            return null;
                        }
                    })];
            });
        }); }) // rate limiting against blocking while resolving session keys (neccessary)
            .then(function (maybeEncSessionKeys) {
            var encSessionKeys = maybeEncSessionKeys.filter(tutanota_utils_1.isNotNull);
            for (var _i = 0, alarmNotifications_1 = alarmNotifications; _i < alarmNotifications_1.length; _i++) {
                var notification = alarmNotifications_1[_i];
                notification.notificationSessionKeys = encSessionKeys.map(function (esk) {
                    return (0, TypeRefs_js_1.createNotificationSessionKey)({
                        pushIdentifier: esk.identifierId,
                        pushIdentifierSessionEncSessionKey: esk.pushIdentifierSessionEncSessionKey
                    });
                });
            }
        });
    };
    CalendarFacade.prototype.addCalendar = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var groupData, postData, returnData, group, userId, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.groupManagementFacade.generateUserAreaGroupData(name)];
                    case 1:
                        groupData = _a.sent();
                        postData = (0, TypeRefs_js_2.createUserAreaGroupPostData)({
                            groupData: groupData
                        });
                        return [4 /*yield*/, this.serviceExecutor.post(Services_2.CalendarService, postData)];
                    case 2:
                        returnData = _a.sent();
                        return [4 /*yield*/, this.entityClient.load(TypeRefs_js_1.GroupTypeRef, returnData.group)
                            // remove the user from the cache before loading it again to make sure we get the latest version.
                            // otherwise we might not see the new calendar in case it is created at login and the websocket is not connected yet
                        ];
                    case 3:
                        group = _a.sent();
                        userId = this.userFacade.getLoggedInUser()._id;
                        return [4 /*yield*/, this.entityRestCache.deleteFromCacheIfExists(TypeRefs_js_1.UserTypeRef, null, userId)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.entityClient.load(TypeRefs_js_1.UserTypeRef, userId)];
                    case 5:
                        user = _a.sent();
                        this.userFacade.updateUser(user);
                        return [2 /*return*/, {
                                user: user,
                                group: group
                            }];
                }
            });
        });
    };
    CalendarFacade.prototype.deleteCalendar = function (groupRootId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.serviceExecutor["delete"](Services_2.CalendarService, (0, TypeRefs_js_2.createCalendarDeleteData)({ groupRootId: groupRootId }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CalendarFacade.prototype.scheduleAlarmsForNewDevice = function (pushIdentifier) {
        return __awaiter(this, void 0, void 0, function () {
            var user, eventsWithAlarmInfos, alarmNotifications, notificationKey, requestEntity, AlarmServicePostTypeModel, encEntity, encryptedAlarms;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = this.userFacade.getLoggedInUser();
                        return [4 /*yield*/, this.loadAlarmEvents()];
                    case 1:
                        eventsWithAlarmInfos = _a.sent();
                        alarmNotifications = (0, tutanota_utils_1.flatMap)(eventsWithAlarmInfos, function (_a) {
                            var event = _a.event, userAlarmInfos = _a.userAlarmInfos;
                            return userAlarmInfos.map(function (userAlarmInfo) { return createAlarmNotificationForEvent(event, userAlarmInfo.alarmInfo, user._id); });
                        });
                        notificationKey = (0, tutanota_crypto_1.aes128RandomKey)();
                        return [4 /*yield*/, this._encryptNotificationKeyForDevices(notificationKey, alarmNotifications, [pushIdentifier])];
                    case 2:
                        _a.sent();
                        requestEntity = (0, TypeRefs_js_1.createAlarmServicePost)({
                            alarmNotifications: alarmNotifications
                        });
                        return [4 /*yield*/, (0, EntityFunctions_1.resolveTypeReference)(TypeRefs_js_1.AlarmServicePostTypeRef)];
                    case 3:
                        AlarmServicePostTypeModel = _a.sent();
                        return [4 /*yield*/, this.instanceMapper.encryptAndMapToLiteral(AlarmServicePostTypeModel, requestEntity, notificationKey)];
                    case 4:
                        encEntity = _a.sent();
                        encryptedAlarms = (0, tutanota_utils_1.downcast)(encEntity).alarmNotifications;
                        return [4 /*yield*/, this.nativePushFacade.scheduleAlarms(encryptedAlarms)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Load all events that have an alarm assigned.
     * @return: Map from concatenated ListId of an event to list of UserAlarmInfos for that event
     */
    CalendarFacade.prototype.loadAlarmEvents = function () {
        return __awaiter(this, void 0, void 0, function () {
            var alarmInfoList, userAlarmInfos, listIdToElementIds, eventIdToAlarmInfos, calendarEvents;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        alarmInfoList = this.userFacade.getLoggedInUser().alarmInfoList;
                        if (!alarmInfoList) {
                            console.warn("No alarmInfo list on user");
                            return [2 /*return*/, []];
                        }
                        return [4 /*yield*/, this.entityClient.loadAll(TypeRefs_js_1.UserAlarmInfoTypeRef, alarmInfoList.alarms)
                            // Group referenced event ids by list id so we can load events of one list in one request.
                        ];
                    case 1:
                        userAlarmInfos = _a.sent();
                        listIdToElementIds = (0, tutanota_utils_1.groupByAndMapUniquely)(userAlarmInfos, function (userAlarmInfo) { return userAlarmInfo.alarmInfo.calendarRef.listId; }, function (userAlarmInfo) { return userAlarmInfo.alarmInfo.calendarRef.elementId; });
                        eventIdToAlarmInfos = (0, tutanota_utils_1.groupBy)(userAlarmInfos, function (userAlarmInfo) { return getEventIdFromUserAlarmInfo(userAlarmInfo).join(""); });
                        return [4 /*yield*/, (0, tutanota_utils_1.promiseMap)(listIdToElementIds.entries(), function (_a) {
                                var listId = _a[0], elementIds = _a[1];
                                return _this.entityClient.loadMultiple(TypeRefs_js_2.CalendarEventTypeRef, listId, Array.from(elementIds))["catch"](function (error) {
                                    // handle NotAuthorized here because user could have been removed from group.
                                    if (error instanceof RestError_1.NotAuthorizedError) {
                                        console.warn("NotAuthorized when downloading alarm events", error);
                                        return [];
                                    }
                                    throw error;
                                });
                            })];
                    case 2:
                        calendarEvents = _a.sent();
                        return [2 /*return*/, (0, tutanota_utils_1.flat)(calendarEvents).map(function (event) {
                                return {
                                    event: event,
                                    userAlarmInfos: (0, tutanota_utils_1.getFromMap)(eventIdToAlarmInfos, (0, EntityUtils_1.getLetId)(event).join(""), function () { return []; })
                                };
                            })];
                }
            });
        });
    };
    /**
     * Queries the event using the uid index. The index is stored per calendar so we have to go through all calendars to find matching event.
     * We currently only need this for calendar event updates and for that we don't want to look into shared calendars.
     */
    CalendarFacade.prototype.getEventByUid = function (uid) {
        var _this = this;
        var calendarMemberships = this.userFacade.getLoggedInUser().memberships.filter(function (m) { return m.groupType === TutanotaConstants_1.GroupType.Calendar && m.capability == null; });
        return (0, tutanota_utils_1.asyncFindAndMap)(calendarMemberships, function (membership) {
            return _this.entityClient
                .load(TypeRefs_js_2.CalendarGroupRootTypeRef, membership.group)
                .then(function (groupRoot) {
                return groupRoot.index &&
                    _this.entityClient.load(TypeRefs_js_2.CalendarEventUidIndexTypeRef, [
                        groupRoot.index.list,
                        (0, EntityUtils_1.uint8arrayToCustomId)(hashUid(uid)),
                    ]);
            })["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotFoundError, function () { return null; }))["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotAuthorizedError, function () { return null; }));
        }).then(function (indexEntry) {
            if (indexEntry) {
                return _this.entityClient.load(TypeRefs_js_2.CalendarEventTypeRef, indexEntry.calendarEvent)["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotFoundError, function () { return null; }));
            }
            else {
                return null;
            }
        });
    };
    CalendarFacade.prototype._saveMultipleAlarms = function (user, eventsWrapper) {
        return __awaiter(this, void 0, void 0, function () {
            var userAlarmInfosAndNotificationsPerEvent, userAlarmInfoListId, ownerGroup, _i, eventsWrapper_1, _a, event_1, alarms, userAlarmInfoAndNotification, calendarRef, _b, alarms_1, alarmInfo, userAlarmInfo, alarmNotification, allAlarms, alarmIds, currentIndex;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        userAlarmInfosAndNotificationsPerEvent = [];
                        userAlarmInfoListId = (0, tutanota_utils_1.neverNull)(user.alarmInfoList).alarms;
                        ownerGroup = user.userGroup.group;
                        for (_i = 0, eventsWrapper_1 = eventsWrapper; _i < eventsWrapper_1.length; _i++) {
                            _a = eventsWrapper_1[_i], event_1 = _a.event, alarms = _a.alarms;
                            userAlarmInfoAndNotification = [];
                            calendarRef = (0, TypeRefs_js_1.createCalendarEventRef)({
                                listId: (0, EntityUtils_1.listIdPart)(event_1._id),
                                elementId: (0, EntityUtils_1.elementIdPart)(event_1._id)
                            });
                            for (_b = 0, alarms_1 = alarms; _b < alarms_1.length; _b++) {
                                alarmInfo = alarms_1[_b];
                                userAlarmInfo = (0, TypeRefs_js_1.createUserAlarmInfo)();
                                userAlarmInfo._ownerGroup = ownerGroup;
                                userAlarmInfo.alarmInfo = (0, TypeRefs_js_1.createAlarmInfo)();
                                userAlarmInfo.alarmInfo.alarmIdentifier = alarmInfo.alarmIdentifier;
                                userAlarmInfo.alarmInfo.trigger = alarmInfo.trigger;
                                userAlarmInfo.alarmInfo.calendarRef = calendarRef;
                                alarmNotification = createAlarmNotificationForEvent(event_1, userAlarmInfo.alarmInfo, user._id);
                                userAlarmInfoAndNotification.push({
                                    alarm: userAlarmInfo,
                                    alarmNotification: alarmNotification
                                });
                            }
                            userAlarmInfosAndNotificationsPerEvent.push({
                                event: event_1,
                                userAlarmInfoAndNotification: userAlarmInfoAndNotification
                            });
                        }
                        allAlarms = (0, tutanota_utils_1.flat)(userAlarmInfosAndNotificationsPerEvent.map(function (_a) {
                            var userAlarmInfoAndNotification = _a.userAlarmInfoAndNotification;
                            return userAlarmInfoAndNotification.map(function (_a) {
                                var alarm = _a.alarm;
                                return alarm;
                            });
                        }));
                        return [4 /*yield*/, this.entityClient.setupMultipleEntities(userAlarmInfoListId, allAlarms)];
                    case 1:
                        alarmIds = _c.sent();
                        currentIndex = 0;
                        return [2 /*return*/, userAlarmInfosAndNotificationsPerEvent.map(function (_a) {
                                var event = _a.event, userAlarmInfoAndNotification = _a.userAlarmInfoAndNotification;
                                return {
                                    event: event,
                                    alarmInfoIds: userAlarmInfoAndNotification.map(function () { return [userAlarmInfoListId, alarmIds[currentIndex++]]; }),
                                    alarmNotifications: userAlarmInfoAndNotification.map(function (_a) {
                                        var alarmNotification = _a.alarmNotification;
                                        return alarmNotification;
                                    })
                                };
                            })];
                }
            });
        });
    };
    return CalendarFacade;
}());
exports.CalendarFacade = CalendarFacade;
function createAlarmNotificationForEvent(event, alarmInfo, userId) {
    return (0, TypeRefs_js_1.createAlarmNotification)({
        alarmInfo: createAlarmInfoForAlarmInfo(alarmInfo),
        repeatRule: event.repeatRule && createRepeatRuleForCalendarRepeatRule(event.repeatRule),
        notificationSessionKeys: [],
        operation: "0" /* OperationType.CREATE */,
        summary: event.summary,
        eventStart: event.startTime,
        eventEnd: event.endTime,
        user: userId
    });
}
function createAlarmInfoForAlarmInfo(alarmInfo) {
    var calendarRef = Object.assign((0, TypeRefs_js_1.createCalendarEventRef)(), {
        elementId: alarmInfo.calendarRef.elementId,
        listId: alarmInfo.calendarRef.listId
    });
    return Object.assign((0, TypeRefs_js_1.createAlarmInfo)(), {
        alarmIdentifier: alarmInfo.alarmIdentifier,
        trigger: alarmInfo.trigger,
        calendarRef: calendarRef
    });
}
function createRepeatRuleForCalendarRepeatRule(calendarRepeatRule) {
    return Object.assign((0, TypeRefs_js_1.createRepeatRule)(), {
        endType: calendarRepeatRule.endType,
        endValue: calendarRepeatRule.endValue,
        frequency: calendarRepeatRule.frequency,
        interval: calendarRepeatRule.interval,
        timeZone: calendarRepeatRule.timeZone
    });
}
function getEventIdFromUserAlarmInfo(userAlarmInfo) {
    return [userAlarmInfo.alarmInfo.calendarRef.listId, userAlarmInfo.alarmInfo.calendarRef.elementId];
}
