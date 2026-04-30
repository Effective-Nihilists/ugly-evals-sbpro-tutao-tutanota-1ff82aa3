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
var _a;
exports.__esModule = true;
exports.showCalendarEventDialog = exports.iconForAttendeeStatus = void 0;
var size_1 = require("../../gui/size");
var stream_1 = require("mithril/stream");
var DatePicker_1 = require("../../gui/date/DatePicker");
var Dialog_1 = require("../../gui/base/Dialog");
var mithril_1 = require("mithril");
var TextField_js_1 = require("../../gui/base/TextField.js");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var DropDownSelector_js_1 = require("../../gui/base/DropDownSelector.js");
var TutanotaConstants_1 = require("../../api/common/TutanotaConstants");
var CalendarUtils_1 = require("../date/CalendarUtils");
var Icon_1 = require("../../gui/base/Icon");
var Checkbox_js_1 = require("../../gui/base/Checkbox.js");
var Expander_1 = require("../../gui/base/Expander");
var ClientDetector_1 = require("../../misc/ClientDetector");
var CalendarEventViewModel_1 = require("../date/CalendarEventViewModel");
var UserError_1 = require("../../api/main/UserError");
var theme_1 = require("../../gui/theme");
var SubscriptionDialogs_1 = require("../../misc/SubscriptionDialogs");
var BusinessFeatureRequiredError_1 = require("../../api/main/BusinessFeatureRequiredError");
var ProgressDialog_1 = require("../../gui/dialogs/ProgressDialog");
var CompletenessIndicator_js_1 = require("../../gui/CompletenessIndicator.js");
var TimePicker_1 = require("../../gui/TimePicker");
var GroupUtils_1 = require("../../sharing/GroupUtils");
var LoginController_1 = require("../../api/main/LoginController");
var CalendarGuiUtils_1 = require("./CalendarGuiUtils");
var ErrorHandlerImpl_1 = require("../../misc/ErrorHandlerImpl");
var MailRecipientsTextField_js_1 = require("../../gui/MailRecipientsTextField.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Dropdown_js_1 = require("../../gui/base/Dropdown.js");
var TypeRefs_js_1 = require("../../api/entities/tutanota/TypeRefs.js");
var RecipientsSearchModel_js_1 = require("../../misc/RecipientsSearchModel.js");
var IconButton_js_1 = require("../../gui/base/IconButton.js");
var ToggleButton_js_1 = require("../../gui/base/ToggleButton.js");
exports.iconForAttendeeStatus = Object.freeze((_a = {},
    _a[TutanotaConstants_1.CalendarAttendeeStatus.ACCEPTED] = "CircleCheckmark" /* Icons.CircleCheckmark */,
    _a[TutanotaConstants_1.CalendarAttendeeStatus.TENTATIVE] = "CircleHelp" /* Icons.CircleHelp */,
    _a[TutanotaConstants_1.CalendarAttendeeStatus.DECLINED] = "CircleReject" /* Icons.CircleReject */,
    _a[TutanotaConstants_1.CalendarAttendeeStatus.NEEDS_ACTION] = "CircleEmpty" /* Icons.CircleEmpty */,
    _a[TutanotaConstants_1.CalendarAttendeeStatus.ADDED] = "CircleEmpty" /* Icons.CircleEmpty */,
    _a));
var alarmIntervalItems = [
    {
        name: LanguageViewModel_1.lang.get("comboBoxSelectionNone_msg"),
        value: null
    },
    {
        name: LanguageViewModel_1.lang.get("calendarReminderIntervalFiveMinutes_label"),
        value: "5M" /* AlarmInterval.FIVE_MINUTES */
    },
    {
        name: LanguageViewModel_1.lang.get("calendarReminderIntervalTenMinutes_label"),
        value: "10M" /* AlarmInterval.TEN_MINUTES */
    },
    {
        name: LanguageViewModel_1.lang.get("calendarReminderIntervalThirtyMinutes_label"),
        value: "30M" /* AlarmInterval.THIRTY_MINUTES */
    },
    {
        name: LanguageViewModel_1.lang.get("calendarReminderIntervalOneHour_label"),
        value: "1H" /* AlarmInterval.ONE_HOUR */
    },
    {
        name: LanguageViewModel_1.lang.get("calendarReminderIntervalOneDay_label"),
        value: "1D" /* AlarmInterval.ONE_DAY */
    },
    {
        name: LanguageViewModel_1.lang.get("calendarReminderIntervalTwoDays_label"),
        value: "2D" /* AlarmInterval.TWO_DAYS */
    },
    {
        name: LanguageViewModel_1.lang.get("calendarReminderIntervalThreeDays_label"),
        value: "3D" /* AlarmInterval.THREE_DAYS */
    },
    {
        name: LanguageViewModel_1.lang.get("calendarReminderIntervalOneWeek_label"),
        value: "1W" /* AlarmInterval.ONE_WEEK */
    },
];
function showCalendarEventDialog(date, calendars, mailboxDetail, existingEvent, responseMail) {
    return __awaiter(this, void 0, void 0, function () {
        function renderEndValue() {
            var _a, _b;
            if (viewModel.repeat == null || viewModel.repeat.endType === "0" /* EndType.Never */) {
                return null;
            }
            else if (viewModel.repeat.endType === "1" /* EndType.Count */) {
                return (0, mithril_1["default"])(DropDownSelector_js_1.DropDownSelector, {
                    label: "emptyString_msg",
                    items: intervalValues,
                    selectedValue: viewModel.repeat.endValue,
                    selectionChangedHandler: function (endValue) { return viewModel.onEndOccurencesSelected(endValue); },
                    icon: "Expand" /* BootIcons.Expand */
                });
            }
            else if (viewModel.repeat.endType === "2" /* EndType.UntilDate */) {
                return (0, mithril_1["default"])(DatePicker_1.DatePicker, {
                    date: ((_a = viewModel.repeat) === null || _a === void 0 ? void 0 : _a.endValue) != null ? new Date((_b = viewModel.repeat) === null || _b === void 0 ? void 0 : _b.endValue) : new Date(),
                    onDateSelected: function (date) { return viewModel.onRepeatEndDateSelected(date); },
                    startOfTheWeekOffset: startOfTheWeekOffset,
                    label: "emptyString_msg",
                    nullSelectionText: "emptyString_msg",
                    // When the guests expander is expanded and the dialog has overflow, then the scrollbar will overlap the date picker popup
                    // to fix this we could either:
                    // * reorganize the layout so it doesn't go over the right edge
                    // * change the alignment so that it goes to the left (this is what we do)
                    rightAlignDropdown: true
                });
            }
            else {
                return null;
            }
        }
        function renderAttendees() {
            var ownAttendee = viewModel.findOwnAttendee();
            var guests = viewModel.attendees().slice();
            if (ownAttendee) {
                var indexOfOwn = guests.indexOf(ownAttendee);
                guests.splice(indexOfOwn, 1);
                guests.unshift(ownAttendee);
            }
            var organizer = viewModel.organizer;
            if (organizer != null && guests.length > 0 && !guests.some(function (guest) { return guest.address.address === organizer.address; })) {
                guests.unshift({
                    address: (0, TypeRefs_js_1.createEncryptedMailAddress)({
                        address: organizer.address
                    }),
                    type: "external" /* RecipientType.EXTERNAL */,
                    // Events created by Tutanota will always have the organizer in the attendee list
                    status: TutanotaConstants_1.CalendarAttendeeStatus.ADDED
                });
            }
            var externalGuests = viewModel.shouldShowPasswordFields()
                ? guests
                    .filter(function (a) { return a.type === "external" /* RecipientType.EXTERNAL */; })
                    .map(function (guest) {
                    if (!(guestShowConfidential.has(guest.address.address)))
                        guestShowConfidential.set(guest.address.address, false);
                    return (0, mithril_1["default"])(TextField_js_1.TextField, {
                        value: viewModel.getGuestPassword(guest),
                        preventAutofill: true,
                        type: guestShowConfidential.get(guest.address.address) ? "text" /* TextFieldType.Text */ : "password" /* TextFieldType.Password */,
                        label: function () {
                            return LanguageViewModel_1.lang.get("passwordFor_label", {
                                "{1}": guest.address.address
                            });
                        },
                        helpLabel: function () { return (0, mithril_1["default"])(".mt-s", (0, mithril_1["default"])(CompletenessIndicator_js_1.CompletenessIndicator, { percentageCompleted: viewModel.getPasswordStrength(guest) })); },
                        key: guest.address.address,
                        oninput: function (newValue) { return viewModel.updatePassword(guest, newValue); },
                        injectionsRight: function () { return renderRevealIcon(guest.address.address); }
                    });
                })
                : [];
            return (0, mithril_1["default"])("", [guests.map(function (guest, index) { return renderGuest(guest, index, viewModel, ownAttendee); }), externalGuests]);
        }
        function renderCalendarColor() {
            var _a;
            var color = viewModel.selectedCalendar()
                ? ((_a = groupColors.get(viewModel.selectedCalendar().groupInfo.group)) !== null && _a !== void 0 ? _a : TutanotaConstants_1.defaultCalendarColor)
                : null;
            return (0, mithril_1["default"])(".mt-xs", {
                style: {
                    width: "100px",
                    height: "10px",
                    background: color ? "#" + color : "transparent"
                }
            });
        }
        function renderCalendarPicker() {
            var availableCalendars = viewModel.getAvailableCalendars();
            return (0, mithril_1["default"])(".flex-half.pr-s", availableCalendars.length
                ? (0, mithril_1["default"])(DropDownSelector_js_1.DropDownSelector, {
                    label: "calendar_label",
                    items: availableCalendars.map(function (calendarInfo) {
                        return {
                            name: (0, GroupUtils_1.getSharedGroupName)(calendarInfo.groupInfo, calendarInfo.shared),
                            value: calendarInfo
                        };
                    }),
                    selectedValue: viewModel.selectedCalendar(),
                    selectionChangedHandler: viewModel.selectedCalendar,
                    icon: "Expand" /* BootIcons.Expand */,
                    disabled: viewModel.isReadOnlyEvent(),
                    helpLabel: function () { return renderCalendarColor(); }
                })
                : null);
        }
        function renderRepeatPeriod() {
            return (0, mithril_1["default"])(DropDownSelector_js_1.DropDownSelector, {
                label: "calendarRepeating_label",
                items: repeatValues,
                selectedValue: (viewModel.repeat && viewModel.repeat.frequency) || null,
                selectionChangedHandler: function (period) { return viewModel.onRepeatPeriodSelected(period); },
                icon: "Expand" /* BootIcons.Expand */,
                disabled: viewModel.isReadOnlyEvent()
            });
        }
        function renderRepeatInterval() {
            return (0, mithril_1["default"])(DropDownSelector_js_1.DropDownSelector, {
                label: "interval_title",
                items: intervalValues,
                selectedValue: (viewModel.repeat && viewModel.repeat.interval) || 1,
                selectionChangedHandler: function (period) { return viewModel.onRepeatIntervalChanged(period); },
                icon: "Expand" /* BootIcons.Expand */,
                disabled: viewModel.isReadOnlyEvent()
            });
        }
        function renderEndType(repeat) {
            return (0, mithril_1["default"])(DropDownSelector_js_1.DropDownSelector, {
                label: function () { return LanguageViewModel_1.lang.get("calendarRepeatStopCondition_label"); },
                items: endTypeValues,
                selectedValue: repeat.endType,
                selectionChangedHandler: function (period) { return viewModel.onRepeatEndTypeChanged(period); },
                icon: "Expand" /* BootIcons.Expand */,
                disabled: viewModel.isReadOnlyEvent()
            });
        }
        function renderChangesMessage() {
            return viewModel.isInvite() ? (0, mithril_1["default"])(".mt.mb-s", LanguageViewModel_1.lang.get("eventCopy_msg")) : null;
        }
        function renderDialogContent() {
            return (0, mithril_1["default"])(".calendar-edit-container.pb", {
                style: {
                    // The date picker dialogs have position: fixed, and they are fixed relative to the most recent ancestor with
                    // a transform. So doing a no-op transform will make the dropdowns scroll with the dialog
                    // without this, then the date picker dialogs will show at the same place on the screen regardless of whether the
                    // editor has scrolled or not.
                    // Ideally we could do this inside DatePicker itself, but the rendering breaks and the dialog appears below it's siblings
                    // We also don't want to do this for all dialogs because it could potentially cause other issues
                    transform: "translate(0)"
                }
            }, [
                renderHeading(),
                renderChangesMessage(),
                (0, mithril_1["default"])(".mb.rel", (0, mithril_1["default"])(Expander_1.ExpanderPanel, {
                    expanded: attendeesExpanded()
                }, [(0, mithril_1["default"])(".flex-grow", renderInvitationField()), (0, mithril_1["default"])(".flex-grow", renderAttendees())])),
                renderDateTimePickers(),
                (0, mithril_1["default"])(".flex.items-center.mt-s", [
                    (0, mithril_1["default"])(Checkbox_js_1.Checkbox, {
                        checked: viewModel.allDay(),
                        onChecked: viewModel.allDay,
                        disabled: viewModel.isReadOnlyEvent(),
                        label: function () { return LanguageViewModel_1.lang.get("allDay_label"); }
                    }),
                    (0, mithril_1["default"])(".flex-grow"),
                ]),
                renderRepeatRulePicker(),
                (0, mithril_1["default"])(".flex", [
                    renderCalendarPicker(),
                    viewModel.canModifyAlarms()
                        ? (0, mithril_1["default"])(".flex.col.flex-half.pl-s", [
                            viewModel.alarms.map(function (a) {
                                return (0, mithril_1["default"])(DropDownSelector_js_1.DropDownSelector, {
                                    label: "reminderBeforeEvent_label",
                                    items: alarmIntervalItems,
                                    selectedValue: a.trigger,
                                    icon: "Expand" /* BootIcons.Expand */,
                                    selectionChangedHandler: function (value) { return viewModel.changeAlarm(a.alarmIdentifier, value); },
                                    key: a.alarmIdentifier
                                });
                            }),
                            (0, mithril_1["default"])(DropDownSelector_js_1.DropDownSelector, {
                                label: "reminderBeforeEvent_label",
                                items: alarmIntervalItems,
                                selectedValue: null,
                                icon: "Expand" /* BootIcons.Expand */,
                                selectionChangedHandler: function (value) { return value && viewModel.addAlarm(value); }
                            }),
                        ])
                        : (0, mithril_1["default"])(".flex.flex-half.pl-s"),
                ]),
                renderLocationField(),
                (0, mithril_1["default"])(descriptionEditor),
            ]);
        }
        function finish() {
            finished = true;
            viewModel.dispose();
            dialog.close();
        }
        function renderHeading() {
            return (0, mithril_1["default"])(TextField_js_1.TextField, {
                label: "title_placeholder",
                value: viewModel.summary(),
                oninput: viewModel.summary,
                disabled: viewModel.isReadOnlyEvent(),
                "class": "big-input pt flex-grow",
                injectionsRight: function () {
                    return (0, mithril_1["default"])(".mr-s", (0, mithril_1["default"])(Expander_1.ExpanderButton, {
                        label: "guests_label",
                        expanded: attendeesExpanded(),
                        onExpandedChange: attendeesExpanded,
                        style: {
                            paddingTop: 0
                        }
                    }));
                }
            });
        }
        var HtmlEditor, recipientsSearch, viewModel, startOfTheWeekOffset, groupColors, repeatValues, intervalValues, endTypeValues, guestShowConfidential, finished, descriptionEditor, okAction, attendeesExpanded, invitationFieldText, renderInvitationField, renderRevealIcon, renderDateTimePickers, renderLocationField, renderRepeatRulePicker, dialogHeaderBarAttrs, dialog;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../../gui/editor/HtmlEditor"); })];
                case 1:
                    HtmlEditor = (_a.sent()).HtmlEditor;
                    return [4 /*yield*/, (0, RecipientsSearchModel_js_1.getRecipientsSearchModel)()];
                case 2:
                    recipientsSearch = _a.sent();
                    return [4 /*yield*/, (0, CalendarEventViewModel_1.createCalendarEventViewModel)(date, calendars, mailboxDetail, existingEvent !== null && existingEvent !== void 0 ? existingEvent : null, responseMail !== null && responseMail !== void 0 ? responseMail : null, false)];
                case 3:
                    viewModel = _a.sent();
                    startOfTheWeekOffset = (0, CalendarUtils_1.getStartOfTheWeekOffsetForUser)(LoginController_1.logins.getUserController().userSettingsGroupRoot);
                    groupColors = LoginController_1.logins.getUserController().userSettingsGroupRoot.groupSettings.reduce(function (acc, gc) {
                        acc.set(gc.group, gc.color);
                        return acc;
                    }, new Map());
                    repeatValues = (0, CalendarUtils_1.createRepeatRuleFrequencyValues)();
                    intervalValues = createIntervalValues();
                    endTypeValues = (0, CalendarUtils_1.createRepeatRuleEndTypeValues)();
                    guestShowConfidential = new Map();
                    finished = false;
                    descriptionEditor = new HtmlEditor("description_label")
                        .setMinHeight(400)
                        .showBorders()
                        .setEnabled(!viewModel.isReadOnlyEvent())
                        // We only set it once, we don't viewModel on every change, that would be slow
                        .setValue(viewModel.note)
                        .setToolbarOptions({
                        alignmentEnabled: false,
                        fontSizeEnabled: false
                    })
                        .enableToolbar();
                    okAction = function () {
                        if (finished) {
                            return;
                        }
                        var description = descriptionEditor.getValue();
                        if (description === "<div><br></div>") {
                            viewModel.changeDescription("");
                        }
                        else {
                            viewModel.changeDescription(description);
                        }
                        function showProgress(p) {
                            // We get all errors in main promise, we don't need to handle them here
                            return (0, ProgressDialog_1.showProgressDialog)("pleaseWait_msg", p)["catch"](tutanota_utils_1.noOp);
                        }
                        Promise.resolve().then(function () { return __awaiter(_this, void 0, void 0, function () {
                            var shouldClose;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, viewModel
                                            .saveAndSend({
                                            askForUpdates: CalendarGuiUtils_1.askIfShouldSendCalendarUpdatesToAttendees,
                                            showProgress: showProgress,
                                            askInsecurePassword: function () { return Dialog_1.Dialog.confirm("presharedPasswordNotStrongEnough_msg"); }
                                        })["catch"]((0, tutanota_utils_1.ofClass)(UserError_1.UserError, function (e) {
                                            (0, ErrorHandlerImpl_1.showUserError)(e);
                                            return false;
                                        }))["catch"]((0, tutanota_utils_1.ofClass)(BusinessFeatureRequiredError_1.BusinessFeatureRequiredError, function (e) { return __awaiter(_this, void 0, void 0, function () {
                                            var businessFeatureOrdered;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, (0, SubscriptionDialogs_1.showBusinessFeatureRequiredDialog)(function () { return e.message; })
                                                        // entity event updates are too slow to call updateBusinessFeature()
                                                    ];
                                                    case 1:
                                                        businessFeatureOrdered = _a.sent();
                                                        // entity event updates are too slow to call updateBusinessFeature()
                                                        viewModel.hasBusinessFeature(businessFeatureOrdered);
                                                        return [2 /*return*/, false];
                                                }
                                            });
                                        }); }))];
                                    case 1:
                                        shouldClose = _a.sent();
                                        if (shouldClose) {
                                            finish();
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    };
                    attendeesExpanded = (0, stream_1["default"])(viewModel.attendees().length > 0);
                    invitationFieldText = (0, stream_1["default"])("");
                    renderInvitationField = function () { return viewModel.canModifyGuests()
                        ? renderAddAttendeesField(invitationFieldText, viewModel, recipientsSearch)
                        : null; };
                    renderRevealIcon = function (address) {
                        return (0, mithril_1["default"])(IconButton_js_1.IconButton, {
                            title: guestShowConfidential.get(address) ? "concealPassword_action" : "revealPassword_action",
                            click: function () {
                                guestShowConfidential.set(address, !guestShowConfidential.get(address));
                            },
                            icon: guestShowConfidential.get(address) ? "NoEye" /* Icons.NoEye */ : "Eye" /* Icons.Eye */,
                            size: 1 /* ButtonSize.Compact */
                        });
                    };
                    renderDateTimePickers = function () {
                        return renderTwoColumnsIfFits([
                            (0, mithril_1["default"])(".flex-grow", (0, mithril_1["default"])(DatePicker_1.DatePicker, {
                                date: viewModel.startDate,
                                onDateSelected: function (date) {
                                    if (date) {
                                        viewModel.setStartDate(date);
                                    }
                                },
                                startOfTheWeekOffset: startOfTheWeekOffset,
                                label: "dateFrom_label",
                                nullSelectionText: "emptyString_msg",
                                disabled: viewModel.isReadOnlyEvent()
                            })),
                            !viewModel.allDay()
                                ? (0, mithril_1["default"])(".ml-s.time-field", (0, mithril_1["default"])(TimePicker_1.TimePicker, {
                                    time: viewModel.startTime,
                                    onTimeSelected: function (time) { return viewModel.setStartTime(time); },
                                    amPmFormat: viewModel.amPmFormat,
                                    disabled: viewModel.isReadOnlyEvent()
                                }))
                                : null,
                        ], [
                            (0, mithril_1["default"])(".flex-grow", (0, mithril_1["default"])(DatePicker_1.DatePicker, {
                                date: viewModel.endDate,
                                onDateSelected: function (date) {
                                    if (date) {
                                        viewModel.setEndDate(date);
                                    }
                                },
                                startOfTheWeekOffset: startOfTheWeekOffset,
                                label: "dateTo_label",
                                nullSelectionText: "emptyString_msg",
                                disabled: viewModel.isReadOnlyEvent()
                            })),
                            !viewModel.allDay()
                                ? (0, mithril_1["default"])(".ml-s.time-field", (0, mithril_1["default"])(TimePicker_1.TimePicker, {
                                    time: viewModel.endTime,
                                    onTimeSelected: function (time) { return viewModel.setEndTime(time); },
                                    amPmFormat: viewModel.amPmFormat,
                                    disabled: viewModel.isReadOnlyEvent()
                                }))
                                : null,
                        ]);
                    };
                    renderLocationField = function () {
                        return (0, mithril_1["default"])(TextField_js_1.TextField, {
                            label: "location_label",
                            value: viewModel.location(),
                            oninput: viewModel.location,
                            disabled: viewModel.isReadOnlyEvent(),
                            "class": "text pt-s",
                            injectionsRight: function () {
                                var address = encodeURIComponent(viewModel.location());
                                if (address === "") {
                                    return null;
                                }
                                return (0, mithril_1["default"])(IconButton_js_1.IconButton, {
                                    title: "showAddress_alt",
                                    icon: "Pin" /* Icons.Pin */,
                                    size: 1 /* ButtonSize.Compact */,
                                    click: function () {
                                        window.open("https://www.openstreetmap.org/search?query=".concat(address), "_blank");
                                    }
                                });
                            }
                        });
                    };
                    renderRepeatRulePicker = function () {
                        return renderTwoColumnsIfFits([
                            // Repeat type == Frequency: Never, daily, annually etc
                            (0, mithril_1["default"])(".flex-grow.pr-s", renderRepeatPeriod()),
                            (0, mithril_1["default"])(".flex-grow.pl-s" + (viewModel.repeat ? "" : ".hidden"), renderRepeatInterval()),
                        ], viewModel.repeat ? [(0, mithril_1["default"])(".flex-grow.pr-s", renderEndType(viewModel.repeat)), (0, mithril_1["default"])(".flex-grow.pl-s", renderEndValue())] : null);
                    };
                    viewModel.sendingOutUpdate.map(mithril_1["default"].redraw);
                    viewModel.attendees.map(mithril_1["default"].redraw);
                    dialogHeaderBarAttrs = {
                        left: [
                            {
                                label: "cancel_action",
                                click: finish,
                                type: "secondary" /* ButtonType.Secondary */
                            },
                        ],
                        middle: function () { return LanguageViewModel_1.lang.get("createEvent_label"); }
                    };
                    dialog = Dialog_1.Dialog.largeDialog(dialogHeaderBarAttrs, {
                        view: renderDialogContent
                    }).addShortcut({
                        key: TutanotaConstants_1.Keys.ESC,
                        exec: finish,
                        help: "close_alt"
                    });
                    if (!viewModel.isReadOnlyEvent()) {
                        dialogHeaderBarAttrs.right = [
                            {
                                label: "save_action",
                                click: function () { return okAction(); },
                                type: "primary" /* ButtonType.Primary */
                            },
                        ];
                        dialog.addShortcut({
                            key: TutanotaConstants_1.Keys.S,
                            ctrl: true,
                            exec: function () { return okAction(); },
                            help: "save_action"
                        });
                    }
                    if (ClientDetector_1.client.isMobileDevice()) {
                        // Prevent focusing text field automatically on mobile. It opens keyboard and you don't see all details.
                        dialog.setFocusOnLoadFunction(tutanota_utils_1.noOp);
                    }
                    dialog.show();
                    return [2 /*return*/];
            }
        });
    });
}
exports.showCalendarEventDialog = showCalendarEventDialog;
function renderStatusIcon(viewModel, attendee) {
    var icon = exports.iconForAttendeeStatus[attendee.status];
    return (0, mithril_1["default"])(Icon_1.Icon, {
        icon: icon,
        "class": "mr-s",
        style: {
            fill: theme_1.theme.content_fg
        }
    });
}
function createIntervalValues() {
    return (0, tutanota_utils_1.numberRange)(1, 256).map(function (n) {
        return {
            name: String(n),
            value: n
        };
    });
}
function renderAddAttendeesField(text, viewModel, recipientsSearch) {
    var _this = this;
    return (0, mithril_1["default"])(".flex.flex-column.flex-grow", [
        (0, mithril_1["default"])(MailRecipientsTextField_js_1.MailRecipientsTextField, {
            label: "addGuest_label",
            text: text(),
            onTextChanged: text,
            // we dont show bubbles, we just want the search dropdown
            recipients: [],
            disabled: false,
            onRecipientAdded: function (address, name, contact) { return __awaiter(_this, void 0, void 0, function () {
                var notAvailable, businessFeatureOrdered;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            notAvailable = viewModel.shouldShowSendInviteNotAvailable();
                            if (!notAvailable) return [3 /*break*/, 2];
                            return [4 /*yield*/, (0, SubscriptionDialogs_1.showBusinessFeatureRequiredDialog)("businessFeatureRequiredInvite_msg")];
                        case 1:
                            businessFeatureOrdered = _a.sent();
                            if (businessFeatureOrdered) {
                                viewModel.addGuest(address, contact);
                            }
                            viewModel.hasBusinessFeature(businessFeatureOrdered); //entity event updates are too slow to call updateBusinessFeature()
                            return [3 /*break*/, 3];
                        case 2:
                            viewModel.addGuest(address, contact);
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            }); },
            onRecipientRemoved: function () {
                // do nothing because we don't have any bubbles here
            },
            injectionsRight: [
                viewModel.attendees().find(function (a) { return a.type === "external" /* RecipientType.EXTERNAL */; })
                    ? (0, mithril_1["default"])(ToggleButton_js_1.ToggleButton, {
                        title: viewModel.isConfidential() ? "confidential_action" : "nonConfidential_action",
                        onToggled: function (_, e) {
                            viewModel.setConfidential(!viewModel.isConfidential());
                            e.stopPropagation();
                        },
                        icon: (viewModel.isConfidential() ? "Lock" /* Icons.Lock */ : "Unlock" /* Icons.Unlock */),
                        toggled: viewModel.isConfidential(),
                        size: 1 /* ButtonSize.Compact */
                    })
                    : null
            ],
            search: recipientsSearch
        }),
        viewModel.isForceUpdateAvailable()
            ? (0, mithril_1["default"])(".mt-negative-s", (0, mithril_1["default"])(Checkbox_js_1.Checkbox, {
                label: function () { return LanguageViewModel_1.lang.get("sendUpdates_label"); },
                onChecked: function (v) { return viewModel.isForceUpdates(v); },
                checked: viewModel.isForceUpdates()
            })) : null,
    ]);
}
function renderTwoColumnsIfFits(left, right) {
    if (ClientDetector_1.client.isMobileDevice()) {
        return (0, mithril_1["default"])(".flex.col", [(0, mithril_1["default"])(".flex", left), (0, mithril_1["default"])(".flex", right)]);
    }
    else {
        return (0, mithril_1["default"])(".flex", [(0, mithril_1["default"])(".flex.flex-half.pr-s", left), (0, mithril_1["default"])(".flex.flex-half.pl-s", right)]);
    }
}
function showOrganizerDropdown(viewModel, e) {
    var makeButtons = function () {
        return viewModel.possibleOrganizers.map(function (organizer) {
            return {
                label: function () { return organizer.address; },
                click: function () { return viewModel.setOrganizer(organizer); }
            };
        });
    };
    (0, Dropdown_js_1.createDropdown)({ lazyButtons: makeButtons, width: 300 })(e, e.target);
}
function renderGuest(guest, index, viewModel, ownAttendee) {
    var organizer = viewModel.organizer;
    var isOrganizer = organizer && guest.address.address === organizer.address;
    var editableOrganizer = isOrganizer && viewModel.canModifyOrganizer();
    var attendingItems = [
        {
            name: LanguageViewModel_1.lang.get("yes_label"),
            value: TutanotaConstants_1.CalendarAttendeeStatus.ACCEPTED
        },
        {
            name: LanguageViewModel_1.lang.get("maybe_label"),
            value: TutanotaConstants_1.CalendarAttendeeStatus.TENTATIVE
        },
        {
            name: LanguageViewModel_1.lang.get("no_label"),
            value: TutanotaConstants_1.CalendarAttendeeStatus.DECLINED
        },
        {
            name: LanguageViewModel_1.lang.get("pending_label"),
            value: TutanotaConstants_1.CalendarAttendeeStatus.NEEDS_ACTION,
            selectable: false
        },
    ];
    return (0, mithril_1["default"])(".flex", {
        style: {
            height: (0, size_1.px)(size_1.size.button_height),
            borderBottom: "1px transparent",
            marginTop: index === 0 && !viewModel.canModifyGuests() ? 0 : (0, size_1.px)(size_1.size.vpad)
        }
    }, [
        (0, mithril_1["default"])(".flex.col.flex-grow.overflow-hidden.flex-no-grow-shrink-auto", [
            (0, mithril_1["default"])(".flex.flex-grow.items-center" + (editableOrganizer ? ".click" : ""), editableOrganizer
                ? {
                    onclick: function (e) { return showOrganizerDropdown(viewModel, e); }
                }
                : {}, [
                (0, mithril_1["default"])("div.text-ellipsis", {
                    style: {
                        lineHeight: (0, size_1.px)(24)
                    }
                }, guest.address.name ? "".concat(guest.address.name, " ").concat(guest.address.address) : guest.address.address),
                editableOrganizer
                    ? (0, mithril_1["default"])(Icon_1.Icon, {
                        icon: "Expand" /* BootIcons.Expand */,
                        style: {
                            fill: theme_1.theme.content_fg
                        }
                    })
                    : null,
            ]),
            (0, mithril_1["default"])(".small.flex.center-vertically", [
                renderStatusIcon(viewModel, guest),
                LanguageViewModel_1.lang.get(isOrganizer ? "organizer_label" : "guest_label") + (guest === ownAttendee ? " | ".concat(LanguageViewModel_1.lang.get("you_label")) : ""),
            ]),
        ]),
        (0, mithril_1["default"])(".flex-grow"),
        [
            ownAttendee === guest && viewModel.canModifyOwnAttendance()
                ? (0, mithril_1["default"])("", {
                    style: {
                        minWidth: "120px"
                    }
                }, (0, mithril_1["default"])(DropDownSelector_js_1.DropDownSelector, {
                    label: "attending_label",
                    items: attendingItems,
                    selectedValue: guest.status,
                    "class": "",
                    selectionChangedHandler: function (value) {
                        if (value == null)
                            return;
                        viewModel.selectGoing(value);
                    }
                }))
                : viewModel.canModifyGuests()
                    ? (0, mithril_1["default"])(IconButton_js_1.IconButton, {
                        title: "remove_action",
                        icon: "Cancel" /* Icons.Cancel */,
                        click: function () { return viewModel.removeAttendee(guest); }
                    })
                    : null,
        ],
    ]);
}
