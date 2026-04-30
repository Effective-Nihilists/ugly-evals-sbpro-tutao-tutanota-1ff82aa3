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
exports.createCalendarEventViewModel = exports.CalendarEventViewModel = void 0;
var TutanotaConstants_1 = require("../../api/common/TutanotaConstants");
var TypeRefs_js_1 = require("../../api/entities/tutanota/TypeRefs.js");
var TypeRefs_js_2 = require("../../api/entities/sys/TypeRefs.js");
var stream_1 = require("mithril/stream");
var MailUtils_1 = require("../../mail/model/MailUtils");
var CalendarUtils_1 = require("./CalendarUtils");
var Utils_1 = require("../../api/common/utils/Utils");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var CommonCalendarUtils_1 = require("../../api/common/utils/CommonCalendarUtils");
var luxon_1 = require("luxon");
var RestError_1 = require("../../api/common/error/RestError");
var CalendarUpdateDistributor_1 = require("./CalendarUpdateDistributor");
var UserError_1 = require("../../api/main/UserError");
var LoginController_1 = require("../../api/main/LoginController");
var MainLocator_1 = require("../../api/main/MainLocator");
var BusinessFeatureRequiredError_1 = require("../../api/main/BusinessFeatureRequiredError");
var GroupUtils_1 = require("../../sharing/GroupUtils");
var Time_1 = require("../../api/common/utils/Time");
var ErrorCheckUtils_1 = require("../../api/common/utils/ErrorCheckUtils");
var RecipientsModel_js_1 = require("../../api/main/RecipientsModel.js");
var DateUtils_1 = require("@tutao/tutanota-utils/dist/DateUtils");
/**
 * ViewModel for viewing/editing the event. Takes care of sending out updates.
 */
var CalendarEventViewModel = /** @class */ (function () {
    function CalendarEventViewModel(userController, distributor, calendarModel, entityClient, mailboxDetail, sendMailModelFactory, date, zone, calendars, existingEvent, responseTo, resolveRecipientsLazily) {
        var _this = this;
        var _a;
        // Null start or end time means the user input was invalid
        this.startTime = null;
        this.endTime = null;
        this.repeat = null;
        this._oldStartTime = null;
        this._distributor = distributor;
        this._calendarModel = calendarModel;
        this._entityClient = entityClient;
        this._userController = userController;
        this._responseTo = responseTo !== null && responseTo !== void 0 ? responseTo : null;
        this._inviteModel = sendMailModelFactory(mailboxDetail, "invite");
        this._updateModel = sendMailModelFactory(mailboxDetail, "update");
        this._cancelModel = sendMailModelFactory(mailboxDetail, "cancel");
        this.summary = (0, stream_1["default"])("");
        this._sendModelFactory = function () { return sendMailModelFactory(mailboxDetail, "response"); };
        this._ownMailAddresses = (0, MailUtils_1.getEnabledMailAddressesWithUser)(mailboxDetail, userController.userGroupInfo);
        this._ownAttendee = (0, stream_1["default"])(null);
        this.sendingOutUpdate = (0, stream_1["default"])(false);
        this._processing = false;
        this.hasBusinessFeature = (0, stream_1["default"])(false);
        this.hasPremiumLegacy = (0, stream_1["default"])(false);
        this.isForceUpdates = (0, stream_1["default"])(false);
        this.location = (0, stream_1["default"])("");
        this.note = "";
        this.allDay = (0, stream_1["default"])(false);
        this.amPmFormat = userController.userSettingsGroupRoot.timeFormat === "1" /* TimeFormat.TWELVE_HOURS */;
        this.existingEvent = existingEvent !== null && existingEvent !== void 0 ? existingEvent : null;
        this._zone = zone;
        this._guestStatuses = this._initGuestStatus(existingEvent, resolveRecipientsLazily);
        this.attendees = this._initAttendees();
        var _b = this.initEventTypeAndOrganizers(existingEvent, calendars, mailboxDetail, userController), eventType = _b.eventType, organizer = _b.organizer, possibleOrganizers = _b.possibleOrganizers;
        this._eventType = eventType;
        this.organizer = organizer;
        this.possibleOrganizers = possibleOrganizers;
        this.alarms = [];
        this.calendars = calendars;
        this.selectedCalendar = (0, stream_1["default"])((_a = this.getAvailableCalendars()[0]) !== null && _a !== void 0 ? _a : null);
        this.initialized = Promise.resolve().then(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (existingEvent) {
                            if (existingEvent.invitedConfidentially != null) {
                                this.setConfidential(existingEvent.invitedConfidentially);
                            }
                        }
                        if (!existingEvent) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._applyValuesFromExistingEvent(existingEvent, calendars)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        // We care about passed time here, use it for default time values.
                        this._setDefaultTimes(date);
                        this.startDate = (0, CalendarUtils_1.getStartOfDayWithZone)(date, this._zone);
                        this.endDate = (0, CalendarUtils_1.getStartOfDayWithZone)(date, this._zone);
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.updateCustomerFeatures()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, this];
                }
            });
        }); });
    }
    CalendarEventViewModel.prototype.rescheduleEvent = function (newStartDate) {
        var oldStartDate = new Date(this.startDate);
        var startTime = this.startTime;
        if (startTime) {
            oldStartDate.setHours(startTime.hours);
            oldStartDate.setMinutes(startTime.minutes);
        }
        var oldEndDate = new Date(this.endDate);
        var endTime = this.endTime;
        if (endTime) {
            oldEndDate.setHours(endTime.hours);
            oldEndDate.setMinutes(endTime.minutes);
        }
        var diff = newStartDate.getTime() - oldStartDate.getTime();
        var newEndDate = new Date(oldEndDate.getTime() + diff);
        this.startDate = (0, CalendarUtils_1.getStartOfDayWithZone)(newStartDate, this._zone);
        this.endDate = (0, CalendarUtils_1.getStartOfDayWithZone)(newEndDate, this._zone);
        this.startTime = Time_1.Time.fromDate(newStartDate);
        this.endTime = Time_1.Time.fromDate(newEndDate);
    };
    CalendarEventViewModel.prototype._applyValuesFromExistingEvent = function (existingEvent, calendars) {
        return __awaiter(this, void 0, void 0, function () {
            var calendarForGroup, startDate, endDate, existingRule, repeat, alarms, _i, alarms_1, alarm;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.summary(existingEvent.summary);
                        calendarForGroup = calendars.get((0, tutanota_utils_1.neverNull)(existingEvent._ownerGroup));
                        if (calendarForGroup) {
                            this.selectedCalendar(calendarForGroup);
                        }
                        this.allDay((0, CommonCalendarUtils_1.isAllDayEvent)(existingEvent));
                        this.startDate = (0, CalendarUtils_1.getStartOfDayWithZone)((0, CalendarUtils_1.getEventStart)(existingEvent, this._zone), this._zone);
                        if (this.allDay()) {
                            this.endDate = (0, tutanota_utils_1.incrementDate)((0, CalendarUtils_1.getEventEnd)(existingEvent, this._zone), -1);
                            // We don't care about passed time here, just use current one as default
                            this._setDefaultTimes();
                        }
                        else {
                            startDate = luxon_1.DateTime.fromJSDate((0, CalendarUtils_1.getEventStart)(existingEvent, this._zone), {
                                zone: this._zone
                            });
                            endDate = luxon_1.DateTime.fromJSDate((0, CalendarUtils_1.getEventEnd)(existingEvent, this._zone), {
                                zone: this._zone
                            });
                            this.startTime = Time_1.Time.fromDateTime(startDate);
                            this.endTime = Time_1.Time.fromDateTime(endDate);
                            this.endDate = (0, CalendarUtils_1.getStartOfDayWithZone)(endDate.toJSDate(), this._zone);
                        }
                        if (existingEvent.repeatRule) {
                            existingRule = existingEvent.repeatRule;
                            repeat = {
                                frequency: (0, tutanota_utils_1.downcast)(existingRule.frequency),
                                interval: Number(existingRule.interval),
                                endType: (0, tutanota_utils_1.downcast)(existingRule.endType),
                                endValue: existingRule.endType === "1" /* EndType.Count */ ? Number(existingRule.endValue) : 1
                            };
                            if (existingRule.endType === "2" /* EndType.UntilDate */) {
                                repeat.endValue = (0, CalendarUtils_1.getRepeatEndTime)(existingRule, this.allDay(), this._zone).getTime();
                            }
                            this.repeat = repeat;
                        }
                        else {
                            this.repeat = null;
                        }
                        this.location(existingEvent.location);
                        this.note = (0, CalendarUtils_1.prepareCalendarDescription)(existingEvent.description);
                        return [4 /*yield*/, this._calendarModel.loadAlarms(existingEvent.alarmInfos, this._userController.user)];
                    case 1:
                        alarms = _a.sent();
                        for (_i = 0, alarms_1 = alarms; _i < alarms_1.length; _i++) {
                            alarm = alarms_1[_i];
                            this.addAlarm((0, tutanota_utils_1.downcast)(alarm.alarmInfo.trigger));
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Determines the event type, the organizer of the event and possible organizers in accordance with the capabilities for events (see table).
     * Note that the only "real" organizer that an event can have is the owner of the calendar.
     * If events are created by someone we share our personal calendar with, the organizer is overwritten and set to our own primary address.
     * Possible organizers are all email addresses of the user, allowed to modify the organizer. This is only the owner of the calendar ("real" organizer)
     * and only if there are no guests.
     *
     * Capability for events is fairly complicated:
     * Note: share "shared" means "not owner of the calendar". Calendar always looks like personal for the owner.
     *
     * | Calendar           | is organizer     | can edit details    | can modify own attendance | can modify guests | can modify organizer
     * |--------------------|------------------|---------------------|---------------------------|-------------------|----------
     * | Personal (own)     | yes              | yes                 | yes                       | yes               | yes
     * | Personal  (invite) | no               | yes (local)         | yes                       | no                | no
     * | Personal  (own)    | no****           | yes                 | yes                       | yes               | yes
     * | Shared             | yes****          | yes***              | no                        | no*               | no*
     * | Shared             | no               | no                  | no**                      | no*               | no*
     *
     *   * we don't allow inviting guests in other people's calendar because later only organizer can modify event and
     *   we don't want to prevent calendar owner from editing events in their own calendar.
     *
     *   ** this is not "our" copy of the event, from the point of organizer we saw it just accidentally.
     *   Later we might support proposing ourselves as attendee but currently organizer should be asked to
     *   send out the event.
     *
     *   *** depends on share capability and whether there are attendees.
     *
     *   **** The creator of the event. Will be overwritten with owner of the calendar by this function.
     */
    CalendarEventViewModel.prototype.initEventTypeAndOrganizers = function (existingEvent, calendars, mailboxDetail, userController) {
        var ownDefaultSender = addressToMailAddress((0, MailUtils_1.getDefaultSenderFromUser)(userController), mailboxDetail, userController);
        if (!existingEvent) {
            return {
                eventType: "own" /* EventType.OWN */,
                organizer: ownDefaultSender,
                possibleOrganizers: this._ownPossibleOrganizers(mailboxDetail, userController)
            };
        }
        else {
            // OwnerGroup is not set for events from file
            var calendarInfoForEvent = existingEvent._ownerGroup && calendars.get(existingEvent._ownerGroup);
            var existingOrganizer = existingEvent.organizer;
            if (calendarInfoForEvent) {
                if (calendarInfoForEvent.shared) {
                    return {
                        eventType: (0, GroupUtils_1.hasCapabilityOnGroup)(this._userController.user, calendarInfoForEvent.group, "1" /* ShareCapability.Write */)
                            ? "shared_rw" /* EventType.SHARED_RW */
                            : "shared_ro" /* EventType.SHARED_RO */,
                        organizer: existingOrganizer ? (0, MailUtils_1.copyMailAddress)(existingOrganizer) : null,
                        possibleOrganizers: existingOrganizer ? [existingOrganizer] : []
                    };
                }
                else {
                    //For an event in a personal calendar there are 3 options (see table)
                    //1. We are the organizer of the event (or the event does not have an organizer yet and we become the organizer of the event)
                    //2. If we are not the organizer and the event does not have guests, it was created by someone we shared our calendar with (also considered our own event)
                    if (!existingOrganizer || this._ownMailAddresses.includes(existingOrganizer.address) || existingEvent.attendees.length === 0) {
                        //we want to keep the existing organizer if it is one of our email addresses in all other cases we use our primary address
                        var actualOrganizer = existingOrganizer && this._ownMailAddresses.includes(existingOrganizer.address) ? existingOrganizer : ownDefaultSender;
                        return {
                            eventType: "own" /* EventType.OWN */,
                            organizer: (0, MailUtils_1.copyMailAddress)(actualOrganizer),
                            possibleOrganizers: this.hasGuests() ? [actualOrganizer] : this._ownPossibleOrganizers(mailboxDetail, userController)
                        };
                    }
                    //3. the event is an invitation
                    else {
                        return {
                            eventType: "invite" /* EventType.INVITE */,
                            organizer: existingOrganizer,
                            possibleOrganizers: [existingOrganizer]
                        };
                    }
                }
            }
            else {
                // We can edit new invites (from files)
                return {
                    eventType: "invite" /* EventType.INVITE */,
                    organizer: existingOrganizer ? (0, MailUtils_1.copyMailAddress)(existingOrganizer) : null,
                    possibleOrganizers: existingOrganizer ? [existingOrganizer] : []
                };
            }
        }
    };
    CalendarEventViewModel.prototype._initGuestStatus = function (existingEvent, resolveRecipientsLazily) {
        var _this = this;
        var newStatuses = new Map();
        if (existingEvent) {
            existingEvent.attendees
                .filter(function (attendee) { return !(0, ErrorCheckUtils_1.hasError)(attendee.address); })
                .forEach(function (attendee) {
                if (_this._ownMailAddresses.includes(attendee.address.address)) {
                    _this._ownAttendee((0, MailUtils_1.copyMailAddress)(attendee.address));
                }
                else {
                    _this._updateModel.addRecipient(MailUtils_1.RecipientField.BCC, {
                        name: attendee.address.name,
                        address: attendee.address.address
                    }, resolveRecipientsLazily ? RecipientsModel_js_1.ResolveMode.Lazy : RecipientsModel_js_1.ResolveMode.Eager);
                }
                newStatuses.set(attendee.address.address, (0, TutanotaConstants_1.getAttendeeStatus)(attendee));
            });
        }
        return (0, stream_1["default"])(newStatuses);
    };
    CalendarEventViewModel.prototype.updateCustomerFeatures = function () {
        return __awaiter(this, void 0, void 0, function () {
            var customer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._userController.isInternalUser()) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._userController.loadCustomer()];
                    case 1:
                        customer = _a.sent();
                        this.hasBusinessFeature((0, Utils_1.isCustomizationEnabledForCustomer)(customer, TutanotaConstants_1.FeatureType.BusinessFeatureEnabled));
                        this.hasPremiumLegacy((0, Utils_1.isCustomizationEnabledForCustomer)(customer, TutanotaConstants_1.FeatureType.PremiumLegacy));
                        return [3 /*break*/, 3];
                    case 2:
                        this.hasBusinessFeature(false);
                        this.hasPremiumLegacy(false);
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CalendarEventViewModel.prototype._initAttendees = function () {
        var _this = this;
        return stream_1["default"].merge([this._inviteModel.onMailChanged, this._updateModel.onMailChanged, this._guestStatuses, this._ownAttendee]).map(function () {
            var makeGuestList = function (model) {
                return model.bccRecipients().map(function (recipient) {
                    var guest = {
                        address: (0, TypeRefs_js_1.createEncryptedMailAddress)({
                            name: recipient.name,
                            address: recipient.address
                        }),
                        status: _this._guestStatuses().get(recipient.address) || TutanotaConstants_1.CalendarAttendeeStatus.NEEDS_ACTION,
                        type: recipient.type
                    };
                    return guest;
                });
            };
            var guests = makeGuestList(_this._inviteModel).concat(makeGuestList(_this._updateModel));
            var ownAttendee = _this._ownAttendee();
            if (ownAttendee) {
                guests.unshift({
                    address: ownAttendee,
                    status: _this._guestStatuses().get(ownAttendee.address) || TutanotaConstants_1.CalendarAttendeeStatus.ACCEPTED,
                    type: "internal" /* RecipientType.INTERNAL */
                });
            }
            return guests;
        });
    };
    CalendarEventViewModel.prototype._setDefaultTimes = function (date) {
        if (date === void 0) { date = (0, CalendarUtils_1.getNextHalfHour)(); }
        var endTimeDate = new Date(date);
        endTimeDate.setMinutes(endTimeDate.getMinutes() + 30);
        this.startTime = Time_1.Time.fromDate(date);
        this.endTime = Time_1.Time.fromDate(endTimeDate);
    };
    CalendarEventViewModel.prototype._ownPossibleOrganizers = function (mailboxDetail, userController) {
        return this._ownMailAddresses.map(function (address) { return addressToMailAddress(address, mailboxDetail, userController); });
    };
    CalendarEventViewModel.prototype.findOwnAttendee = function () {
        var _this = this;
        var _a;
        return (_a = this.attendees().find(function (a) { return _this._ownMailAddresses.includes(a.address.address); })) !== null && _a !== void 0 ? _a : null;
    };
    CalendarEventViewModel.prototype.setStartTime = function (value) {
        this._oldStartTime = this.startTime;
        this.startTime = value;
        if (this.startDate.getTime() === this.endDate.getTime()) {
            this._adjustEndTime();
        }
    };
    CalendarEventViewModel.prototype.setEndTime = function (value) {
        this.endTime = value;
    };
    CalendarEventViewModel.prototype.addGuest = function (mailAddress, contact) {
        // 1: if the attendee already exists, do nothing
        // 2: if the attendee is not yourself, add to the invite model
        // 3: if the attendee is yourself and you already exist as an attendee, remove yourself
        // 4: add the attendee
        // 5: add organizer if you are not already in the list
        // We don't add a guest if they are already an attendee
        // even though the SendMailModel handles deduplication, we need to check here because recipients shouldn't be duplicated across the 3 models either
        if (this.attendees().some(function (a) { return a.address.address === mailAddress; })) {
            return;
        }
        var isOwnAttendee = this._ownMailAddresses.includes(mailAddress);
        // SendMailModel handles deduplication
        // this.attendees will be updated when the model's recipients are updated
        if (!isOwnAttendee) {
            this._inviteModel.addRecipient(MailUtils_1.RecipientField.BCC, {
                address: mailAddress,
                contact: contact
            });
        }
        var status = isOwnAttendee ? TutanotaConstants_1.CalendarAttendeeStatus.ACCEPTED : TutanotaConstants_1.CalendarAttendeeStatus.ADDED;
        // If we exist as an attendee and the added guest is also an attendee, then remove the existing ownAttendee
        // and the new one will be added in the next step
        if (isOwnAttendee) {
            var ownAttendee = this.findOwnAttendee();
            if (ownAttendee) {
                this._guestStatuses((0, tutanota_utils_1.deleteMapEntry)(this._guestStatuses(), ownAttendee.address.address));
            }
        }
        // if this guy wasn't already an attendee with a status
        if (!this._guestStatuses().has(mailAddress)) {
            this._guestStatuses((0, tutanota_utils_1.addMapEntry)(this._guestStatuses(), mailAddress, status));
        }
        // this duplicated condition check may or may not be redundant to do here
        if (isOwnAttendee) {
            var newOrganizer = this.possibleOrganizers.find(function (o) { return o.address === mailAddress; });
            if (newOrganizer)
                this.setOrganizer(newOrganizer);
        }
        // Add organizer as attendee if not currenly in the list
        if (this.attendees().length === 1 && this.findOwnAttendee() == null) {
            this.selectGoing(TutanotaConstants_1.CalendarAttendeeStatus.ACCEPTED);
        }
    };
    CalendarEventViewModel.prototype.getGuestPassword = function (guest) {
        return (this._inviteModel.getPassword(guest.address.address) ||
            this._updateModel.getPassword(guest.address.address) ||
            this._cancelModel.getPassword(guest.address.address));
    };
    CalendarEventViewModel.prototype.isReadOnlyEvent = function () {
        // For the RW calendar we have two similar cases:
        //
        // Case 1:
        // Owner of the calendar created the event and invited some people. We, user with whom calendar was shared as RW, are seeing this event.
        // We cannot modify that event even though we have RW permission because we are the not organizer.
        // If the event is changed, the update must be sent out and we cannot do that because we are not the organizer.
        //
        // Case 2:
        // Owner of the calendar received an invite and saved the event to the calendar. We, user with whom the calendar was shared as RW, are seeing this event.
        // We can (theoretically) modify the event locally because we don't need to send any updates but we cannot change attendance because this would require sending an email.
        // But we don't want to allow editing the event to make it more understandable for everyone.
        return this._eventType === "shared_ro" /* EventType.SHARED_RO */ || (this._eventType === "shared_rw" /* EventType.SHARED_RW */ && this.attendees().length > 0);
    };
    CalendarEventViewModel.prototype._adjustEndTime = function () {
        if (!this.startTime || !this.endTime || !this._oldStartTime) {
            return;
        }
        var endTotalMinutes = this.endTime.hours * 60 + this.endTime.minutes;
        var startTotalMinutes = this.startTime.hours * 60 + this.startTime.minutes;
        var diff = Math.abs(endTotalMinutes - this._oldStartTime.hours * 60 - this._oldStartTime.minutes);
        var newEndTotalMinutes = startTotalMinutes + diff;
        var newEndHours = Math.floor(newEndTotalMinutes / 60);
        if (newEndHours > 23) {
            newEndHours = 23;
        }
        var newEndMinutes = newEndTotalMinutes % 60;
        this.endTime = new Time_1.Time(newEndHours, newEndMinutes);
    };
    CalendarEventViewModel.prototype.setStartDate = function (date) {
        // The custom ID for events is derived from the unix timestamp, and sorting
        // the negative ids is a challenge we decided not to
        // tackle because it is a rare case.
        if (date && date.getFullYear() < DateUtils_1.TIMESTAMP_ZERO_YEAR) {
            var thisYear = new Date().getFullYear();
            var newDate = new Date(date);
            newDate.setFullYear(thisYear);
            this.startDate = newDate;
        }
        else {
            var diff = (0, CalendarUtils_1.getDiffInDays)(this.startDate, date);
            this.endDate = luxon_1.DateTime.fromJSDate(this.endDate, {
                zone: this._zone
            })
                .plus({
                days: diff
            })
                .toJSDate();
            this.startDate = date;
        }
    };
    CalendarEventViewModel.prototype.setEndDate = function (date) {
        this.endDate = date;
    };
    CalendarEventViewModel.prototype.onRepeatPeriodSelected = function (repeatPeriod) {
        if (repeatPeriod == null) {
            this.repeat = null;
        }
        else {
            // Provide default values if repeat is not there, override them with existing repeat if it's there, provide new frequency
            this.repeat = Object.assign({
                interval: 1,
                endType: "0" /* EndType.Never */,
                endValue: 1,
                frequency: repeatPeriod
            }, this.repeat, {
                frequency: repeatPeriod
            });
        }
    };
    CalendarEventViewModel.prototype.onEndOccurencesSelected = function (endValue) {
        if (this.repeat && this.repeat.endType === "1" /* EndType.Count */) {
            this.repeat.endValue = endValue;
        }
    };
    CalendarEventViewModel.prototype.onRepeatEndDateSelected = function (endDate) {
        var repeat = this.repeat;
        if (endDate && repeat && repeat.endType === "2" /* EndType.UntilDate */) {
            repeat.endValue = endDate.getTime();
        }
    };
    CalendarEventViewModel.prototype.onRepeatIntervalChanged = function (interval) {
        if (this.repeat) {
            this.repeat.interval = interval;
        }
    };
    CalendarEventViewModel.prototype.onRepeatEndTypeChanged = function (endType) {
        var repeat = this.repeat;
        if (repeat) {
            repeat.endType = endType;
            if (endType === "2" /* EndType.UntilDate */) {
                repeat.endValue = (0, CalendarUtils_1.incrementByRepeatPeriod)(new Date(), TutanotaConstants_1.RepeatPeriod.MONTHLY, 1, this._zone).getTime();
            }
            else {
                repeat.endValue = 1;
            }
        }
    };
    CalendarEventViewModel.prototype.addAlarm = function (trigger) {
        var alarm = createCalendarAlarm((0, CommonCalendarUtils_1.generateEventElementId)(Date.now()), trigger);
        this.alarms = this.alarms.concat(alarm);
    };
    CalendarEventViewModel.prototype.changeAlarm = function (identifier, trigger) {
        var newAlarms = this.alarms.slice();
        for (var i = 0; i < newAlarms.length; i++) {
            if (newAlarms[i].alarmIdentifier === identifier) {
                if (trigger) {
                    newAlarms[i].trigger = trigger;
                }
                else {
                    newAlarms.splice(i, 1);
                }
                this.alarms = newAlarms;
                break;
            }
        }
    };
    CalendarEventViewModel.prototype.changeDescription = function (description) {
        this.note = description;
    };
    CalendarEventViewModel.prototype.canModifyGuests = function () {
        // It is not allowed to modify guests in shared calendar or invite.
        var selectedCalendar = this.selectedCalendar();
        return selectedCalendar != null && !selectedCalendar.shared && this._eventType !== "invite" /* EventType.INVITE */;
    };
    CalendarEventViewModel.prototype.shouldShowSendInviteNotAvailable = function () {
        if (this._userController.user.accountType === TutanotaConstants_1.AccountType.FREE) {
            return true;
        }
        if (this._userController.user.accountType === TutanotaConstants_1.AccountType.EXTERNAL) {
            return false;
        }
        return !this.hasBusinessFeature() && !this.hasPremiumLegacy();
    };
    CalendarEventViewModel.prototype.removeAttendee = function (guest) {
        var existingRecipient = this.existingEvent && this.existingEvent.attendees.find(function (a) { return a.address.address === guest.address.address; });
        for (var _i = 0, _a = [this._inviteModel, this._updateModel, this._cancelModel]; _i < _a.length; _i++) {
            var model = _a[_i];
            var recipientInfo = model.bccRecipients().find(function (r) { return r.address === guest.address.address; });
            if (recipientInfo) {
                model.removeRecipient(recipientInfo, MailUtils_1.RecipientField.BCC);
                var newStatuses = new Map(this._guestStatuses());
                newStatuses["delete"](recipientInfo.address);
                this._guestStatuses(newStatuses);
            }
        }
        if (existingRecipient) {
            this._cancelModel.addRecipient(MailUtils_1.RecipientField.BCC, {
                address: existingRecipient.address.address,
                name: existingRecipient.address.name
            });
        }
    };
    CalendarEventViewModel.prototype.canModifyOwnAttendance = function () {
        // We can always modify own attendance in own event. Also can modify if it's invite in our calendar and we are invited.
        return this._eventType === "own" /* EventType.OWN */ || (this._eventType === "invite" /* EventType.INVITE */ && !!this.findOwnAttendee());
    };
    CalendarEventViewModel.prototype.canModifyOrganizer = function () {
        // We can only modify the organizer if it is our own event and there are no guests
        return (this._eventType === "own" /* EventType.OWN */ && !this.hasGuests());
    };
    CalendarEventViewModel.prototype.hasGuests = function () {
        return this.existingEvent && this.existingEvent.attendees.length > 0 &&
            !(this.existingEvent.attendees.length === 1 && this._ownMailAddresses.includes(this.existingEvent.attendees[0].address.address));
    };
    CalendarEventViewModel.prototype.setOrganizer = function (newOrganizer) {
        if (this.canModifyOrganizer()) {
            this.organizer = newOrganizer;
            // we always add the organizer to the attendee list
            this._ownAttendee(newOrganizer);
        }
    };
    CalendarEventViewModel.prototype.canModifyAlarms = function () {
        return this._eventType === "own" /* EventType.OWN */ || this._eventType === "invite" /* EventType.INVITE */ || this._eventType === "shared_rw" /* EventType.SHARED_RW */;
    };
    CalendarEventViewModel.prototype.deleteEvent = function () {
        return __awaiter(this, void 0, void 0, function () {
            var event, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        event = this.existingEvent;
                        if (!event) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        if (!(this._eventType === "own" /* EventType.OWN */ && event.attendees.length > 1)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.sendCancellation(event)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, this._calendarModel.deleteEvent(event)["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotFoundError, tutanota_utils_1.noOp))];
                    case 4:
                        e_1 = _a.sent();
                        if (!(e_1 instanceof RestError_1.NotFoundError)) {
                            throw e_1;
                        }
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    CalendarEventViewModel.prototype.waitForResolvedRecipients = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            this._inviteModel.waitForResolvedRecipients(),
                            this._updateModel.waitForResolvedRecipients(),
                            this._cancelModel.waitForResolvedRecipients(),
                        ])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CalendarEventViewModel.prototype.isForceUpdateAvailable = function () {
        return this._eventType === "own" /* EventType.OWN */ && !this.shouldShowSendInviteNotAvailable() && this._hasUpdatableAttendees();
    };
    /**
     * @reject UserError
     */
    CalendarEventViewModel.prototype.saveAndSend = function (_a) {
        var askForUpdates = _a.askForUpdates, askInsecurePassword = _a.askInsecurePassword, showProgress = _a.showProgress;
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.initialized];
                    case 1:
                        _b.sent();
                        if (this._processing) {
                            return [2 /*return*/, Promise.resolve(false)];
                        }
                        this._processing = true;
                        return [2 /*return*/, Promise.resolve()
                                .then(function () { return __awaiter(_this, void 0, void 0, function () {
                                var newEvent, newAlarms, p;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.waitForResolvedRecipients()];
                                        case 1:
                                            _a.sent();
                                            newEvent = this._initializeNewEvent();
                                            newAlarms = this.alarms.slice();
                                            // We want to avoid asking whether to send out updates in case nothing has changed
                                            if (this._eventType === "own" /* EventType.OWN */ && (this.isForceUpdates() || this._hasChanges(newEvent))) {
                                                // It is our own event. We might need to send out invites/cancellations/updates
                                                return [2 /*return*/, this._sendNotificationAndSave(askInsecurePassword, askForUpdates, showProgress, newEvent, newAlarms)];
                                            }
                                            else if (this._eventType === "invite" /* EventType.INVITE */) {
                                                // We have been invited by another person (internal/ unsecure external)
                                                return [2 /*return*/, this._respondToOrganizerAndSave(showProgress, (0, tutanota_utils_1.assertNotNull)(this.existingEvent), newEvent, newAlarms)];
                                            }
                                            else {
                                                p = this._saveEvent(newEvent, newAlarms);
                                                showProgress(p);
                                                return [2 /*return*/, p.then(function () { return true; })];
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            }); })["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.PayloadTooLargeError, function () {
                                throw new UserError_1.UserError("requestTooLarge_msg");
                            }))["finally"](function () {
                                _this._processing = false;
                            })];
                }
            });
        });
    };
    CalendarEventViewModel.prototype.sendCancellation = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedEvent, cancelAddresses, _i, cancelAddresses_1, address, recipient, e_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        updatedEvent = (0, tutanota_utils_1.clone)(event);
                        // This is guaranteed to be our own event.
                        updatedEvent.sequence = (0, CalendarUtils_1.incrementSequence)(updatedEvent.sequence, true);
                        cancelAddresses = event.attendees.filter(function (a) { return !_this._ownMailAddresses.includes(a.address.address); }).map(function (a) { return a.address; });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 8, , 9]);
                        _i = 0, cancelAddresses_1 = cancelAddresses;
                        _a.label = 2;
                    case 2:
                        if (!(_i < cancelAddresses_1.length)) return [3 /*break*/, 5];
                        address = cancelAddresses_1[_i];
                        this._cancelModel.addRecipient(MailUtils_1.RecipientField.BCC, {
                            name: address.name,
                            address: address.address,
                            contact: null
                        });
                        return [4 /*yield*/, this._cancelModel.getRecipient(MailUtils_1.RecipientField.BCC, address.address).resolved()
                            // We cannot send a notification to external recipients without a password, so we exclude them
                        ];
                    case 3:
                        recipient = _a.sent();
                        // We cannot send a notification to external recipients without a password, so we exclude them
                        if (this._cancelModel.isConfidential()) {
                            if (recipient.type === "external" /* RecipientType.EXTERNAL */ && !this._cancelModel.getPassword(recipient.address)) {
                                this._cancelModel.removeRecipient(recipient, MailUtils_1.RecipientField.BCC, false);
                            }
                        }
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        if (!this._cancelModel.allRecipients().length) return [3 /*break*/, 7];
                        return [4 /*yield*/, this._distributor.sendCancellation(updatedEvent, this._cancelModel)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        e_2 = _a.sent();
                        if (e_2 instanceof RestError_1.TooManyRequestsError) {
                            throw new UserError_1.UserError("mailAddressDelay_msg"); // This will be caught and open error dialog
                        }
                        else {
                            throw e_2;
                        }
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    CalendarEventViewModel.prototype._saveEvent = function (newEvent, newAlarms) {
        if (this._userController.user.accountType === TutanotaConstants_1.AccountType.EXTERNAL) {
            return Promise.resolve();
        }
        var groupRoot = (0, tutanota_utils_1.assertNotNull)(this.selectedCalendar()).groupRoot;
        if (this.existingEvent == null || this.existingEvent._id == null) {
            return this._calendarModel.createEvent(newEvent, newAlarms, this._zone, groupRoot);
        }
        else {
            return this._calendarModel.updateEvent(newEvent, newAlarms, this._zone, groupRoot, this.existingEvent).then(tutanota_utils_1.noOp);
        }
    };
    CalendarEventViewModel.prototype._hasUpdatableAttendees = function () {
        return this._updateModel.bccRecipients().length > 0;
    };
    CalendarEventViewModel.prototype._sendNotificationAndSave = function (askInsecurePassword, askForUpdates, showProgress, newEvent, newAlarms) {
        var _this = this;
        // ask for update
        var askForUpdatesAwait = this._hasUpdatableAttendees()
            ? this.isForceUpdates()
                ? Promise.resolve("yes") // we do not ask again because the user has already indicated that they want to send updates
                : askForUpdates()
            : Promise.resolve("no");
        // no updates possible
        var passwordCheck = function () { return (_this.hasInsecurePasswords() && _this.containsExternalRecipients() ? askInsecurePassword() : Promise.resolve(true)); };
        return askForUpdatesAwait.then(function (updateResponse) {
            if (updateResponse === "cancel") {
                return false;
            }
            else if (_this.shouldShowSendInviteNotAvailable() && // we check again to prevent updates after cancelling business or updates for an imported event
                (updateResponse === "yes" || _this._inviteModel.bccRecipients().length || _this._cancelModel.bccRecipients().length)) {
                throw new BusinessFeatureRequiredError_1.BusinessFeatureRequiredError("businessFeatureRequiredInvite_msg");
            }
            // Do check passwords if there are new recipients. We already made decision for those who we invited before
            return Promise.resolve(_this._inviteModel.bccRecipients().length ? passwordCheck() : true).then(function (passwordCheckPassed) {
                if (!passwordCheckPassed) {
                    // User said to not send despite insecure password, stop
                    return false;
                }
                // Invites are cancellations are sent out independent of the updates decision
                var p = _this._sendInvite(newEvent)
                    .then(function () {
                    return _this._cancelModel.bccRecipients().length ? _this._distributor.sendCancellation(newEvent, _this._cancelModel) : Promise.resolve();
                })
                    .then(function () { return _this._saveEvent(newEvent, newAlarms); })
                    .then(function () { return (updateResponse === "yes" ? _this._distributor.sendUpdate(newEvent, _this._updateModel) : Promise.resolve()); })
                    .then(function () { return true; });
                showProgress(p);
                return p;
            });
        });
    };
    CalendarEventViewModel.prototype._sendInvite = function (event) {
        var _this = this;
        var newAttendees = event.attendees.filter(function (a) { return a.status === TutanotaConstants_1.CalendarAttendeeStatus.ADDED; });
        if (newAttendees.length > 0) {
            return this._distributor.sendInvite(event, this._inviteModel).then(function () {
                newAttendees.forEach(function (a) {
                    if (a.status === TutanotaConstants_1.CalendarAttendeeStatus.ADDED) {
                        a.status = TutanotaConstants_1.CalendarAttendeeStatus.NEEDS_ACTION;
                    }
                    _this._guestStatuses((0, tutanota_utils_1.addMapEntry)(_this._guestStatuses(), a.address.address, TutanotaConstants_1.CalendarAttendeeStatus.NEEDS_ACTION));
                });
            });
        }
        else {
            return Promise.resolve();
        }
    };
    CalendarEventViewModel.prototype._respondToOrganizerAndSave = function (showProgress, existingEvent, newEvent, newAlarms) {
        var _this = this;
        // We are not using this._findAttendee() because we want to search it on the event, before our modifications
        var ownAttendee = existingEvent.attendees.find(function (a) { return _this._ownMailAddresses.includes(a.address.address); });
        var selectedOwnAttendeeStatus = ownAttendee && this._guestStatuses().get(ownAttendee.address.address);
        var sendPromise = Promise.resolve();
        if (ownAttendee && selectedOwnAttendeeStatus !== TutanotaConstants_1.CalendarAttendeeStatus.NEEDS_ACTION && ownAttendee.status !== selectedOwnAttendeeStatus) {
            ownAttendee.status = (0, tutanota_utils_1.assertNotNull)(selectedOwnAttendeeStatus);
            var sendResponseModel_1 = this._sendModelFactory();
            var organizer = (0, tutanota_utils_1.assertNotNull)(existingEvent.organizer);
            sendResponseModel_1.addRecipient(MailUtils_1.RecipientField.TO, {
                name: organizer.name,
                address: organizer.address
            });
            sendPromise = this._distributor
                .sendResponse(newEvent, sendResponseModel_1, ownAttendee.address.address, this._responseTo, (0, tutanota_utils_1.assertNotNull)(selectedOwnAttendeeStatus))
                .then(function () { return sendResponseModel_1.dispose(); });
        }
        var p = sendPromise.then(function () { return _this._saveEvent(newEvent, newAlarms); });
        showProgress(p);
        return p.then(function () { return true; });
    };
    CalendarEventViewModel.prototype.selectGoing = function (going) {
        if (this.canModifyOwnAttendance()) {
            var ownAttendee = this._ownAttendee();
            if (ownAttendee) {
                this._guestStatuses((0, tutanota_utils_1.addMapEntry)(this._guestStatuses(), ownAttendee.address, going));
            }
            else if (this._eventType === "own" /* EventType.OWN */) {
                // use the default sender as the organizer
                var newOwnAttendee = (0, TypeRefs_js_1.createEncryptedMailAddress)({
                    address: this._inviteModel.getSender()
                });
                this._ownAttendee(newOwnAttendee);
                this._guestStatuses((0, tutanota_utils_1.addMapEntry)(this._guestStatuses(), newOwnAttendee.address, going));
            }
        }
    };
    CalendarEventViewModel.prototype.createRepeatRule = function (newEvent, repeat) {
        var interval = repeat.interval || 1;
        var repeatRule = (0, CalendarUtils_1.createRepeatRuleWithValues)(repeat.frequency, interval);
        var stopType = repeat.endType;
        repeatRule.endType = stopType;
        if (stopType === "1" /* EndType.Count */) {
            var count = repeat.endValue;
            if (isNaN(count) || Number(count) < 1) {
                repeatRule.endType = "0" /* EndType.Never */;
            }
            else {
                repeatRule.endValue = String(count);
            }
        }
        else if (stopType === "2" /* EndType.UntilDate */) {
            var repeatEndDate = (0, CalendarUtils_1.getStartOfNextDayWithZone)(new Date(repeat.endValue), this._zone);
            if (repeatEndDate < (0, CalendarUtils_1.getEventStart)(newEvent, this._zone)) {
                throw new UserError_1.UserError("startAfterEnd_label");
            }
            else {
                // We have to save repeatEndDate in the same way we save start/end times because if one is timzone
                // dependent and one is not then we have interesting bugs in edge cases (event created in -11 could
                // end on another date in +12). So for all day events end date is UTC-encoded all day event and for
                // regular events it is just a timestamp.
                repeatRule.endValue = String((this.allDay() ? (0, CalendarUtils_1.getAllDayDateUTCFromZone)(repeatEndDate, this._zone) : repeatEndDate).getTime());
            }
        }
        return repeatRule;
    };
    CalendarEventViewModel.prototype.setConfidential = function (confidential) {
        this._inviteModel.setConfidential(confidential);
        this._updateModel.setConfidential(confidential);
        this._cancelModel.setConfidential(confidential);
    };
    CalendarEventViewModel.prototype.isConfidential = function () {
        return this._inviteModel.isConfidential() && this._updateModel.isConfidential() && this._cancelModel.isConfidential();
    };
    CalendarEventViewModel.prototype.updatePassword = function (guest, password) {
        var inInvite = this._inviteModel.bccRecipients().find(function (r) { return r.address === guest.address.address; });
        if (inInvite) {
            this._inviteModel.setPassword(inInvite.address, password);
        }
        var inUpdate = this._updateModel.bccRecipients().find(function (r) { return r.address === guest.address.address; });
        if (inUpdate) {
            this._updateModel.setPassword(inUpdate.address, password);
        }
        var inCancel = this._cancelModel.bccRecipients().find(function (r) { return r.address === guest.address.address; });
        if (inCancel) {
            this._updateModel.setPassword(inCancel.address, password);
        }
    };
    CalendarEventViewModel.prototype.shouldShowPasswordFields = function () {
        return this.isConfidential() && this._eventType === "own" /* EventType.OWN */;
    };
    CalendarEventViewModel.prototype.getPasswordStrength = function (guest) {
        var address = guest.address.address;
        var getStrength = function (model) {
            var recipient = model.allRecipients().find(function (r) { return address === r.address; });
            return recipient ? model.getPasswordStrength(recipient) : null;
        };
        var inviteStrength = getStrength(this._inviteModel);
        if (inviteStrength != null)
            return inviteStrength;
        var updateStrength = getStrength(this._updateModel);
        return updateStrength != null ? updateStrength : 0;
    };
    CalendarEventViewModel.prototype.hasInsecurePasswords = function () {
        if (!this.isConfidential()) {
            return false;
        }
        if (this._eventType === "invite" /* EventType.INVITE */) {
            // We can't receive invites from secure external users, so we don't have to reply with password
            return false;
        }
        else {
            return this._inviteModel.hasInsecurePasswords() || this._updateModel.hasInsecurePasswords() || this._cancelModel.hasInsecurePasswords();
        }
    };
    CalendarEventViewModel.prototype.containsExternalRecipients = function () {
        return (this._inviteModel.containsExternalRecipients() || this._updateModel.containsExternalRecipients() || this._cancelModel.containsExternalRecipients());
    };
    CalendarEventViewModel.prototype.getAvailableCalendars = function () {
        var _this = this;
        // Prevent moving the calendar to another calendar if you only have read permission or if the event has attendees.
        var calendarArray = Array.from(this.calendars.values());
        if (this.isReadOnlyEvent()) {
            return calendarArray.filter(function (calendarInfo) { return calendarInfo.group._id === (0, tutanota_utils_1.assertNotNull)(_this.existingEvent)._ownerGroup; });
        }
        else if (this.attendees().length || this._eventType === "invite" /* EventType.INVITE */) {
            // We don't allow inviting in a shared calendar. If we have attendees, we cannot select a shared calendar
            // We also don't allow accepting invites into shared calendars.
            return calendarArray.filter(function (calendarInfo) { return !calendarInfo.shared; });
        }
        else {
            return calendarArray.filter(function (calendarInfo) { return (0, GroupUtils_1.hasCapabilityOnGroup)(_this._userController.user, calendarInfo.group, "1" /* ShareCapability.Write */); });
        }
    };
    CalendarEventViewModel.prototype._allRecipients = function () {
        return this._inviteModel.allRecipients().concat(this._updateModel.allRecipients()).concat(this._cancelModel.allRecipients());
    };
    CalendarEventViewModel.prototype.dispose = function () {
        this._inviteModel.dispose();
        this._updateModel.dispose();
        this._cancelModel.dispose();
    };
    CalendarEventViewModel.prototype.isInvite = function () {
        return this._eventType === "invite" /* EventType.INVITE */;
    };
    /**
     * Keep in sync with _hasChanges().
     */
    CalendarEventViewModel.prototype._initializeNewEvent = function () {
        // We have to use existing instance to get all the final fields correctly
        // Using clone feels hacky but otherwise we need to save all attributes of the existing event somewhere and if dialog is
        // cancelled we also don't want to modify passed event
        var newEvent = this.existingEvent ? (0, tutanota_utils_1.clone)(this.existingEvent) : (0, TypeRefs_js_1.createCalendarEvent)();
        newEvent.sequence = (0, CalendarUtils_1.incrementSequence)(newEvent.sequence, this._eventType === "own" /* EventType.OWN */);
        var startDate = new Date(this.startDate);
        var endDate = new Date(this.endDate);
        if (this.allDay()) {
            startDate = (0, CalendarUtils_1.getAllDayDateUTCFromZone)(startDate, this._zone);
            endDate = (0, CalendarUtils_1.getAllDayDateUTCFromZone)((0, CalendarUtils_1.getStartOfNextDayWithZone)(endDate, this._zone), this._zone);
        }
        else {
            var startTime = this.startTime;
            var endTime = this.endTime;
            if (!startTime || !endTime) {
                throw new UserError_1.UserError("timeFormatInvalid_msg");
            }
            startDate = luxon_1.DateTime.fromJSDate(startDate, {
                zone: this._zone
            }).set({
                hour: startTime.hours,
                minute: startTime.minutes
            }).toJSDate();
            // End date is never actually included in the event. For the whole day event the next day
            // is the boundary. For the timed one the end time is the boundary.
            endDate = luxon_1.DateTime.fromJSDate(endDate, {
                zone: this._zone
            })
                .set({
                hour: endTime.hours,
                minute: endTime.minutes
            })
                .toJSDate();
        }
        newEvent.startTime = startDate;
        newEvent.description = this.note;
        newEvent.summary = this.summary();
        newEvent.location = this.location();
        newEvent.endTime = endDate;
        newEvent.invitedConfidentially = this.isConfidential();
        newEvent.uid = this.existingEvent && this.existingEvent.uid
            ? this.existingEvent.uid
            : (0, CalendarUtils_1.generateUid)((0, tutanota_utils_1.assertNotNull)(this.selectedCalendar()).group._id, Date.now());
        var repeat = this.repeat;
        if (repeat == null) {
            newEvent.repeatRule = null;
        }
        else {
            newEvent.repeatRule = this.createRepeatRule(newEvent, repeat);
        }
        newEvent.attendees = this.attendees().map(function (a) {
            return (0, TypeRefs_js_1.createCalendarEventAttendee)({
                address: a.address,
                status: a.status
            });
        });
        newEvent.organizer = this.organizer;
        switch ((0, CalendarUtils_1.checkEventValidity)(newEvent)) {
            case 0 /* CalendarEventValidity.InvalidContainsInvalidDate */:
                throw new UserError_1.UserError("invalidDate_msg");
            case 1 /* CalendarEventValidity.InvalidEndBeforeStart */:
                throw new UserError_1.UserError("startAfterEnd_label");
            case 2 /* CalendarEventValidity.InvalidPre1970 */:
                // shouldn't happen while the check in setStartDate is still there, resetting the date each time
                throw new UserError_1.UserError("pre1970Start_msg");
            case 3 /* CalendarEventValidity.Valid */:
                return newEvent;
        }
    };
    /**
     * Keep in sync with _initializeNewEvent().
     * @param newEvent the new event created from the CalendarEvent properties tracked in this class.
     * @returns {boolean} true if changes were made to the event to justify sending updates to attendees.
     */
    CalendarEventViewModel.prototype._hasChanges = function (newEvent) {
        var _a, _b;
        var existingEvent = this.existingEvent;
        // we do not check for the sequence number (as it should be changed with every update) or the default instace properties such as _id
        return (!existingEvent ||
            newEvent.startTime.getTime() !== existingEvent.startTime.getTime() ||
            newEvent.description !== existingEvent.description ||
            newEvent.summary !== existingEvent.summary ||
            newEvent.location !== existingEvent.location ||
            newEvent.endTime.getTime() !== existingEvent.endTime.getTime() ||
            newEvent.invitedConfidentially !== existingEvent.invitedConfidentially ||
            newEvent.uid !== existingEvent.uid ||
            !areRepeatRulesEqual(newEvent.repeatRule, existingEvent.repeatRule) ||
            !(0, tutanota_utils_1.arrayEqualsWithPredicate)(newEvent.attendees, existingEvent.attendees, function (a1, a2) { return a1.status === a2.status && a1.address.address === a2.address.address; }) || // we ignore the names
            (newEvent.organizer !== existingEvent.organizer && ((_a = newEvent.organizer) === null || _a === void 0 ? void 0 : _a.address) !== ((_b = existingEvent.organizer) === null || _b === void 0 ? void 0 : _b.address))); // we ignore the names
    };
    return CalendarEventViewModel;
}());
exports.CalendarEventViewModel = CalendarEventViewModel;
function areRepeatRulesEqual(r1, r2) {
    return (r1 === r2 ||
        ((r1 === null || r1 === void 0 ? void 0 : r1.endType) === (r2 === null || r2 === void 0 ? void 0 : r2.endType) &&
            (r1 === null || r1 === void 0 ? void 0 : r1.endValue) === (r2 === null || r2 === void 0 ? void 0 : r2.endValue) &&
            (r1 === null || r1 === void 0 ? void 0 : r1.frequency) === (r2 === null || r2 === void 0 ? void 0 : r2.frequency) &&
            (r1 === null || r1 === void 0 ? void 0 : r1.interval) === (r2 === null || r2 === void 0 ? void 0 : r2.interval) &&
            (r1 === null || r1 === void 0 ? void 0 : r1.timeZone) === (r2 === null || r2 === void 0 ? void 0 : r2.timeZone)));
}
function addressToMailAddress(address, mailboxDetail, userController) {
    return (0, TypeRefs_js_1.createEncryptedMailAddress)({
        address: address,
        name: (0, MailUtils_1.getSenderNameForUser)(mailboxDetail, userController)
    });
}
function createCalendarAlarm(identifier, trigger) {
    var calendarAlarmInfo = (0, TypeRefs_js_2.createAlarmInfo)();
    calendarAlarmInfo.alarmIdentifier = identifier;
    calendarAlarmInfo.trigger = trigger;
    return calendarAlarmInfo;
}
function createCalendarEventViewModel(date, calendars, mailboxDetail, existingEvent, previousMail, resolveRecipientsLazily) {
    return Promise.resolve().then(function () { return require("../../mail/editor/SendMailModel"); }).then(function (model) {
        return new CalendarEventViewModel(LoginController_1.logins.getUserController(), CalendarUpdateDistributor_1.calendarUpdateDistributor, MainLocator_1.locator.calendarModel, MainLocator_1.locator.entityClient, mailboxDetail, function (mailboxDetail) { return model.defaultSendMailModel(mailboxDetail); }, date, (0, CalendarUtils_1.getTimeZone)(), calendars, existingEvent, previousMail, resolveRecipientsLazily);
    });
}
exports.createCalendarEventViewModel = createCalendarEventViewModel;
