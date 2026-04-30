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
exports.exportCalendar = exports.showCalendarImportDialog = void 0;
var FileController_1 = require("../../file/FileController");
var TypeRefs_js_1 = require("../../api/entities/tutanota/TypeRefs.js");
var CommonCalendarUtils_1 = require("../../api/common/utils/CommonCalendarUtils");
var ProgressDialog_1 = require("../../gui/dialogs/ProgressDialog");
var ParserCombinator_1 = require("../../misc/parsing/ParserCombinator");
var Dialog_1 = require("../../gui/base/Dialog");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var CalendarImporter_1 = require("./CalendarImporter");
var EntityUtils_1 = require("../../api/common/utils/EntityUtils");
var TypeRefs_js_2 = require("../../api/entities/sys/TypeRefs.js");
var TypeRefs_js_3 = require("../../api/entities/tutanota/TypeRefs.js");
var DataFile_1 = require("../../api/common/DataFile");
var MainLocator_1 = require("../../api/main/MainLocator");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var CalendarUtils_1 = require("../date/CalendarUtils");
var ImportError_1 = require("../../api/common/error/ImportError");
function showCalendarImportDialog(calendarGroupRoot) {
    return __awaiter(this, void 0, void 0, function () {
        function importEvents() {
            return __awaiter(this, void 0, void 0, function () {
                /**
                 * show an error dialog detailing the reason and amount for events that failed to import
                 */
                function showConfirmPartialImportDialog(skippedEvents, confirmationText) {
                    return __awaiter(this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = skippedEvents.length === 0;
                                    if (_a) return [3 /*break*/, 2];
                                    return [4 /*yield*/, Dialog_1.Dialog.confirm(function () {
                                            return LanguageViewModel_1.lang.get(confirmationText, {
                                                "{amount}": skippedEvents.length + "",
                                                "{total}": flatParsedEvents.length + ""
                                            });
                                        })];
                                case 1:
                                    _a = (_b.sent());
                                    _b.label = 2;
                                case 2: return [2 /*return*/, _a];
                            }
                        });
                    });
                }
                var existingEvents, existingUidToEventMap, flatParsedEvents, eventsWithInvalidDate, inversedEvents, pre1970Events, eventsWithExistingUid, eventsForCreation;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, loadAllEvents(calendarGroupRoot)];
                        case 1:
                            existingEvents = _a.sent();
                            existingUidToEventMap = new Map();
                            existingEvents.forEach(function (existingEvent) {
                                existingEvent.uid && existingUidToEventMap.set(existingEvent.uid, existingEvent);
                            });
                            flatParsedEvents = (0, tutanota_utils_1.flat)(parsedEvents);
                            eventsWithInvalidDate = [];
                            inversedEvents = [];
                            pre1970Events = [];
                            eventsWithExistingUid = [];
                            eventsForCreation = flatParsedEvents // only create events with non-existing uid
                                .filter(function (_a) {
                                var event = _a.event;
                                if (!event.uid) {
                                    // should not happen because calendar parser will generate uids if they do not exist
                                    throw new Error("Uid is not set for imported event");
                                }
                                switch ((0, CalendarUtils_1.checkEventValidity)(event)) {
                                    case 0 /* CalendarEventValidity.InvalidContainsInvalidDate */:
                                        eventsWithInvalidDate.push(event);
                                        return false;
                                    case 1 /* CalendarEventValidity.InvalidEndBeforeStart */:
                                        inversedEvents.push(event);
                                        return false;
                                    case 2 /* CalendarEventValidity.InvalidPre1970 */:
                                        pre1970Events.push(event);
                                        return false;
                                }
                                if (!existingUidToEventMap.has(event.uid)) {
                                    existingUidToEventMap.set(event.uid, event);
                                    return true;
                                }
                                else {
                                    eventsWithExistingUid.push(event);
                                    return false;
                                }
                            })
                                .map(function (_a) {
                                var event = _a.event, alarms = _a.alarms;
                                // hashedUid will be set later in calendarFacade to avoid importing the hash function here
                                var repeatRule = event.repeatRule;
                                (0, CalendarUtils_1.assignEventId)(event, zone, calendarGroupRoot);
                                event._ownerGroup = calendarGroupRoot._id;
                                if (repeatRule && repeatRule.timeZone === "") {
                                    repeatRule.timeZone = (0, CalendarUtils_1.getTimeZone)();
                                }
                                for (var _i = 0, alarms_1 = alarms; _i < alarms_1.length; _i++) {
                                    var alarmInfo = alarms_1[_i];
                                    alarmInfo.alarmIdentifier = (0, CommonCalendarUtils_1.generateEventElementId)(Date.now());
                                }
                                (0, CalendarUtils_1.assignEventId)(event, zone, calendarGroupRoot);
                                return {
                                    event: event,
                                    alarms: alarms
                                };
                            });
                            return [4 /*yield*/, showConfirmPartialImportDialog(eventsWithExistingUid, "importEventExistingUid_msg")];
                        case 2:
                            if (!(_a.sent()))
                                return [2 /*return*/];
                            return [4 /*yield*/, showConfirmPartialImportDialog(eventsWithInvalidDate, "importInvalidDatesInEvent_msg")];
                        case 3:
                            if (!(_a.sent()))
                                return [2 /*return*/];
                            return [4 /*yield*/, showConfirmPartialImportDialog(inversedEvents, "importEndNotAfterStartInEvent_msg")];
                        case 4:
                            if (!(_a.sent()))
                                return [2 /*return*/];
                            return [4 /*yield*/, showConfirmPartialImportDialog(pre1970Events, "importPre1970StartInEvent_msg")];
                        case 5:
                            if (!(_a.sent()))
                                return [2 /*return*/];
                            return [2 /*return*/, MainLocator_1.locator.calendarFacade.saveImportedCalendarEvents(eventsForCreation)["catch"]((0, tutanota_utils_1.ofClass)(ImportError_1.ImportError, function (e) {
                                    return Dialog_1.Dialog.message(function () {
                                        return LanguageViewModel_1.lang.get("importEventsError_msg", {
                                            "{amount}": e.numFailed + "",
                                            "{total}": eventsForCreation.length + ""
                                        });
                                    });
                                }))];
                    }
                });
            });
        }
        var parsedEvents, dataFiles, e_1, zone;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, FileController_1.showFileChooser)(true, ["ical", "ics", "ifb", "icalendar"])];
                case 1:
                    dataFiles = _a.sent();
                    parsedEvents = dataFiles.map(function (file) { return (0, CalendarImporter_1.parseCalendarFile)(file).contents; });
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    if (e_1 instanceof ParserCombinator_1.ParserError) {
                        console.log("Failed to parse file", e_1);
                        return [2 /*return*/, Dialog_1.Dialog.message(function () {
                                return LanguageViewModel_1.lang.get("importReadFileError_msg", {
                                    "{filename}": e_1.filename
                                });
                            })];
                    }
                    else {
                        throw e_1;
                    }
                    return [3 /*break*/, 3];
                case 3:
                    zone = (0, CalendarUtils_1.getTimeZone)();
                    return [2 /*return*/, (0, ProgressDialog_1.showWorkerProgressDialog)(MainLocator_1.locator.worker, "importCalendar_label", importEvents())];
            }
        });
    });
}
exports.showCalendarImportDialog = showCalendarImportDialog;
function exportCalendar(calendarName, groupRoot, userAlarmInfos, now, zone) {
    (0, ProgressDialog_1.showProgressDialog)("pleaseWait_msg", loadAllEvents(groupRoot)
        .then(function (allEvents) {
        return (0, tutanota_utils_1.promiseMap)(allEvents, function (event) {
            var thisUserAlarms = event.alarmInfos.filter(function (alarmInfoId) { return (0, EntityUtils_1.isSameId)(userAlarmInfos, (0, EntityUtils_1.listIdPart)(alarmInfoId)); });
            if (thisUserAlarms.length > 0) {
                return MainLocator_1.locator.entityClient.loadMultiple(TypeRefs_js_2.UserAlarmInfoTypeRef, userAlarmInfos, thisUserAlarms.map(EntityUtils_1.elementIdPart)).then(function (alarms) { return ({
                    event: event,
                    alarms: alarms
                }); });
            }
            else {
                return {
                    event: event,
                    alarms: []
                };
            }
        });
    })
        .then(function (eventsWithAlarms) { return exportCalendarEvents(calendarName, eventsWithAlarms, now, zone); }));
}
exports.exportCalendar = exportCalendar;
function exportCalendarEvents(calendarName, events, now, zone) {
    var stringValue = (0, CalendarImporter_1.serializeCalendar)(env.versionNumber, events, now, zone);
    var data = (0, tutanota_utils_1.stringToUtf8Uint8Array)(stringValue);
    var tmpFile = (0, TypeRefs_js_3.createFile)();
    tmpFile.name = calendarName === "" ? "export.ics" : calendarName + "-export.ics";
    tmpFile.mimeType = FileController_1.CALENDAR_MIME_TYPE;
    tmpFile.size = String(data.byteLength);
    return MainLocator_1.locator.fileController.saveDataFile((0, DataFile_1.convertToDataFile)(tmpFile, data));
}
function loadAllEvents(groupRoot) {
    return MainLocator_1.locator.entityClient.loadAll(TypeRefs_js_1.CalendarEventTypeRef, groupRoot.longEvents).then(function (longEvents) {
        return MainLocator_1.locator.entityClient.loadAll(TypeRefs_js_1.CalendarEventTypeRef, groupRoot.shortEvents).then(function (shortEvents) {
            return shortEvents.concat(longEvents);
        });
    });
}
