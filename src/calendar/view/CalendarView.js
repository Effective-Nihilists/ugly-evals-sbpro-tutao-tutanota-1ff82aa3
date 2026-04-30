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
exports.CalendarView = exports.SELECTED_DATE_INDICATOR_THICKNESS = void 0;
var mithril_1 = require("mithril");
var Header_js_1 = require("../../gui/Header.js");
var ViewColumn_1 = require("../../gui/base/ViewColumn");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var ViewSlider_js_1 = require("../../gui/nav/ViewSlider.js");
var KeyManager_1 = require("../../misc/KeyManager");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var TypeRefs_js_1 = require("../../api/entities/tutanota/TypeRefs.js");
var LoginController_1 = require("../../api/main/LoginController");
var TutanotaConstants_1 = require("../../api/common/TutanotaConstants");
var MainLocator_1 = require("../../api/main/MainLocator");
var CalendarUtils_1 = require("../date/CalendarUtils");
var Button_js_1 = require("../../gui/base/Button.js");
var Formatter_1 = require("../../misc/Formatter");
var NavButton_js_1 = require("../../gui/base/NavButton.js");
var CalendarMonthView_1 = require("./CalendarMonthView");
var luxon_1 = require("luxon");
var RestError_1 = require("../../api/common/error/RestError");
var CalendarAgendaView_1 = require("./CalendarAgendaView");
var EditCalendarDialog_1 = require("./EditCalendarDialog");
var styles_1 = require("../../gui/styles");
var MultiDayCalendarView_1 = require("./MultiDayCalendarView");
var Dialog_1 = require("../../gui/base/Dialog");
var Env_1 = require("../../api/common/Env");
var size_1 = require("../../gui/size");
var FolderColumnView_js_1 = require("../../gui/FolderColumnView.js");
var DeviceConfig_1 = require("../../misc/DeviceConfig");
var CalendarImporterDialog_1 = require("../export/CalendarImporterDialog");
var CalendarEventViewModel_1 = require("../date/CalendarEventViewModel");
var SubscriptionDialogs_1 = require("../../misc/SubscriptionDialogs");
var GroupUtils_1 = require("../../sharing/GroupUtils");
var GroupSharingDialog_1 = require("../../sharing/view/GroupSharingDialog");
var GroupInvitationFolderRow_1 = require("../../sharing/view/GroupInvitationFolderRow");
var SidebarSection_1 = require("../../gui/SidebarSection");
var ProgrammingError_1 = require("../../api/common/error/ProgrammingError");
var CalendarGuiUtils_1 = require("./CalendarGuiUtils");
var CalendarViewModel_1 = require("./CalendarViewModel");
var CalendarEventEditDialog_1 = require("./CalendarEventEditDialog");
var CalendarEventPopup_1 = require("./CalendarEventPopup");
var ProgressDialog_1 = require("../../gui/dialogs/ProgressDialog");
var ReceivedGroupInvitationsModel_1 = require("../../sharing/model/ReceivedGroupInvitationsModel");
var ClientDetector_1 = require("../../misc/ClientDetector");
var IconButton_js_1 = require("../../gui/base/IconButton.js");
var Dropdown_js_1 = require("../../gui/base/Dropdown.js");
var BottomNav_js_1 = require("../../gui/nav/BottomNav.js");
exports.SELECTED_DATE_INDICATOR_THICKNESS = 4;
// noinspection JSUnusedGlobalSymbols
var CalendarView = /** @class */ (function () {
    function CalendarView() {
        var _this = this;
        var userId = LoginController_1.logins.getUserController().user._id;
        var calendarInvitations = new ReceivedGroupInvitationsModel_1.ReceivedGroupInvitationsModel(TutanotaConstants_1.GroupType.Calendar, MainLocator_1.locator.eventController, MainLocator_1.locator.entityClient, LoginController_1.logins);
        calendarInvitations.init();
        this._calendarViewModel = new CalendarViewModel_1.CalendarViewModel(LoginController_1.logins, this._createCalendarEventViewModel, MainLocator_1.locator.calendarModel, MainLocator_1.locator.entityClient, MainLocator_1.locator.eventController, MainLocator_1.locator.progressTracker, DeviceConfig_1.deviceConfig, calendarInvitations);
        this._currentViewType = DeviceConfig_1.deviceConfig.getDefaultCalendarView(userId) || CalendarViewModel_1.CalendarViewType.MONTH;
        this._htmlSanitizer = Promise.resolve().then(function () { return require("../../misc/HtmlSanitizer"); }).then(function (m) { return m.htmlSanitizer; });
        this.sidebarColumn = new ViewColumn_1.ViewColumn({
            view: function () {
                return (0, mithril_1["default"])(FolderColumnView_js_1.FolderColumnView, {
                    button: styles_1.styles.isUsingBottomNavigation()
                        ? null
                        : {
                            label: "newEvent_action",
                            click: function () { return _this._createNewEventDialog(); }
                        },
                    content: [
                        (0, mithril_1["default"])(SidebarSection_1.SidebarSection, {
                            name: "view_label",
                            button: _this._currentViewType !== CalendarViewModel_1.CalendarViewType.AGENDA
                                ? (0, mithril_1["default"])(Button_js_1.Button, {
                                    label: "today_label",
                                    click: function () {
                                        _this._setUrl(mithril_1["default"].route.param("view"), new Date());
                                    },
                                    colors: "nav" /* ButtonColor.Nav */,
                                    type: "primary" /* ButtonType.Primary */
                                }) : null
                        }, _this._renderCalendarViewButtons()),
                        (0, mithril_1["default"])(SidebarSection_1.SidebarSection, {
                            name: "yourCalendars_label",
                            button: (0, mithril_1["default"])(IconButton_js_1.IconButton, {
                                title: "addCalendar_action",
                                colors: "nav" /* ButtonColor.Nav */,
                                click: function () { return _this._onPressedAddCalendar(); },
                                icon: "Add" /* Icons.Add */,
                                size: 1 /* ButtonSize.Compact */
                            })
                        }, _this._renderCalendars(false)),
                        (0, mithril_1["default"])(SidebarSection_1.SidebarSection, {
                            name: "otherCalendars_label"
                        }, _this._renderCalendars(true)),
                        _this._calendarViewModel.calendarInvitations().length > 0
                            ? (0, mithril_1["default"])(SidebarSection_1.SidebarSection, {
                                name: "calendarInvitations_label"
                            }, _this._calendarViewModel.calendarInvitations().map(function (invitation) {
                                return (0, mithril_1["default"])(GroupInvitationFolderRow_1.GroupInvitationFolderRow, {
                                    invitation: invitation
                                });
                            }))
                            : null,
                    ],
                    ariaLabel: "calendar_label"
                });
            }
        }, 0 /* ColumnType.Foreground */, size_1.size.first_col_min_width, size_1.size.first_col_max_width, function () { return (_this._currentViewType === CalendarViewModel_1.CalendarViewType.WEEK ? LanguageViewModel_1.lang.get("month_label") : LanguageViewModel_1.lang.get("calendar_label")); });
        var getGroupColors = (0, tutanota_utils_1.memoized)(function (userSettingsGroupRoot) {
            return userSettingsGroupRoot.groupSettings.reduce(function (acc, gc) {
                acc.set(gc.group, gc.color);
                return acc;
            }, new Map());
        });
        this.contentColumn = new ViewColumn_1.ViewColumn({
            view: function () {
                var groupColors = getGroupColors(LoginController_1.logins.getUserController().userSettingsGroupRoot);
                switch (_this._currentViewType) {
                    case CalendarViewModel_1.CalendarViewType.MONTH:
                        return (0, mithril_1["default"])(CalendarMonthView_1.CalendarMonthView, {
                            temporaryEvents: _this._calendarViewModel.temporaryEvents,
                            eventsForDays: _this._calendarViewModel.eventsForDays,
                            getEventsOnDays: _this._calendarViewModel.getEventsOnDays.bind(_this._calendarViewModel),
                            onEventClicked: function (calendarEvent, domEvent) { return _this._onEventSelected(calendarEvent, domEvent, _this._htmlSanitizer); },
                            onNewEvent: function (date) {
                                _this._createNewEventDialog(date);
                            },
                            selectedDate: _this._calendarViewModel.selectedDate(),
                            onDateSelected: function (date, calendarViewType) {
                                _this._setUrl(calendarViewType, date);
                            },
                            onChangeMonth: function (next) { return _this._viewPeriod(next, CalendarViewModel_1.CalendarViewType.MONTH); },
                            amPmFormat: LoginController_1.logins.getUserController().userSettingsGroupRoot.timeFormat === "1" /* TimeFormat.TWELVE_HOURS */,
                            startOfTheWeek: (0, tutanota_utils_1.downcast)(LoginController_1.logins.getUserController().userSettingsGroupRoot.startOfTheWeek),
                            groupColors: groupColors,
                            hiddenCalendars: _this._calendarViewModel.hiddenCalendars,
                            dragHandlerCallbacks: _this._calendarViewModel
                        });
                    case CalendarViewModel_1.CalendarViewType.DAY:
                        return (0, mithril_1["default"])(MultiDayCalendarView_1.MultiDayCalendarView, {
                            temporaryEvents: _this._calendarViewModel.temporaryEvents,
                            getEventsOnDays: _this._calendarViewModel.getEventsOnDays.bind(_this._calendarViewModel),
                            renderHeaderText: Formatter_1.formatDateWithWeekdayAndYearLong,
                            daysInPeriod: 1,
                            onEventClicked: function (event, domEvent) { return _this._onEventSelected(event, domEvent, _this._htmlSanitizer); },
                            onNewEvent: function (date) {
                                _this._createNewEventDialog(date);
                            },
                            selectedDate: _this._calendarViewModel.selectedDate(),
                            onDateSelected: function (date) {
                                _this._calendarViewModel.selectedDate(date);
                                mithril_1["default"].redraw();
                                _this._setUrl(CalendarViewModel_1.CalendarViewType.DAY, date);
                            },
                            groupColors: groupColors,
                            hiddenCalendars: _this._calendarViewModel.hiddenCalendars,
                            onChangeViewPeriod: function (next) { return _this._viewPeriod(next, CalendarViewModel_1.CalendarViewType.DAY); },
                            startOfTheWeek: (0, tutanota_utils_1.downcast)(LoginController_1.logins.getUserController().userSettingsGroupRoot.startOfTheWeek),
                            dragHandlerCallbacks: _this._calendarViewModel
                        });
                    case CalendarViewModel_1.CalendarViewType.WEEK:
                        return (0, mithril_1["default"])(MultiDayCalendarView_1.MultiDayCalendarView, {
                            temporaryEvents: _this._calendarViewModel.temporaryEvents,
                            getEventsOnDays: _this._calendarViewModel.getEventsOnDays.bind(_this._calendarViewModel),
                            daysInPeriod: 7,
                            renderHeaderText: function (date) {
                                var startOfTheWeekOffset = (0, CalendarUtils_1.getStartOfTheWeekOffset)((0, tutanota_utils_1.downcast)(LoginController_1.logins.getUserController().userSettingsGroupRoot.startOfTheWeek));
                                var firstDate = (0, CalendarUtils_1.getStartOfWeek)(date, startOfTheWeekOffset);
                                var lastDate = (0, tutanota_utils_1.incrementDate)(new Date(firstDate), 6);
                                if (firstDate.getMonth() !== lastDate.getMonth()) {
                                    return "".concat(LanguageViewModel_1.lang.formats.monthLong.format(firstDate), " - ").concat(LanguageViewModel_1.lang.formats.monthLong.format(lastDate), " ").concat(LanguageViewModel_1.lang.formats.yearNumeric.format(firstDate));
                                }
                                else {
                                    return "".concat(LanguageViewModel_1.lang.formats.monthLong.format(firstDate), " ").concat(LanguageViewModel_1.lang.formats.yearNumeric.format(firstDate));
                                }
                            },
                            onEventClicked: function (event, domEvent) { return _this._onEventSelected(event, domEvent, _this._htmlSanitizer); },
                            onNewEvent: function (date) {
                                _this._createNewEventDialog(date);
                            },
                            selectedDate: _this._calendarViewModel.selectedDate(),
                            onDateSelected: function (date, viewType) {
                                _this._setUrl(viewType !== null && viewType !== void 0 ? viewType : CalendarViewModel_1.CalendarViewType.WEEK, date);
                            },
                            startOfTheWeek: (0, tutanota_utils_1.downcast)(LoginController_1.logins.getUserController().userSettingsGroupRoot.startOfTheWeek),
                            groupColors: groupColors,
                            hiddenCalendars: _this._calendarViewModel.hiddenCalendars,
                            onChangeViewPeriod: function (next) { return _this._viewPeriod(next, CalendarViewModel_1.CalendarViewType.WEEK); },
                            dragHandlerCallbacks: _this._calendarViewModel
                        });
                    case CalendarViewModel_1.CalendarViewType.AGENDA:
                        return (0, mithril_1["default"])(CalendarAgendaView_1.CalendarAgendaView, {
                            eventsForDays: _this._calendarViewModel.eventsForDays,
                            amPmFormat: (0, CalendarUtils_1.shouldDefaultToAmPmTimeFormat)(),
                            onEventClicked: function (event, domEvent) { return _this._onEventSelected(event, domEvent, _this._htmlSanitizer); },
                            groupColors: groupColors,
                            hiddenCalendars: _this._calendarViewModel.hiddenCalendars,
                            onDateSelected: function (date) {
                                _this._setUrl(CalendarViewModel_1.CalendarViewType.DAY, date);
                            }
                        });
                    default:
                        throw new ProgrammingError_1.ProgrammingError("invalid CalendarViewType: \"".concat(_this._currentViewType, "\""));
                }
            }
        }, 1 /* ColumnType.Background */, size_1.size.second_col_min_width + size_1.size.third_col_min_width, size_1.size.third_col_max_width, function () {
            var _a;
            var left = function (title) { return (0, CalendarGuiUtils_1.renderCalendarSwitchLeftButton)(title, function () { return _this._viewPeriod(false, _this._currentViewType); }); };
            var right = function (title) { return (0, CalendarGuiUtils_1.renderCalendarSwitchRightButton)(title, function () { return _this._viewPeriod(true, _this._currentViewType); }); };
            return (_a = {},
                _a[CalendarViewModel_1.CalendarViewType.DAY] = {
                    left: left("prevDay_label"),
                    middle: (0, Formatter_1.formatDateWithWeekday)(_this._calendarViewModel.selectedDate()),
                    right: right("nextDay_label")
                },
                // week view doesn't exist on mobile so we don't bother making buttons/title
                _a[CalendarViewModel_1.CalendarViewType.WEEK] = "",
                _a[CalendarViewModel_1.CalendarViewType.MONTH] = {
                    left: left("prevMonth_label"),
                    middle: (0, Formatter_1.formatMonthWithFullYear)(_this._calendarViewModel.selectedDate()),
                    right: right("nextMonth_label")
                },
                _a[CalendarViewModel_1.CalendarViewType.AGENDA] = LanguageViewModel_1.lang.get("agenda_label"),
                _a)[_this._currentViewType];
        });
        this.viewSlider = new ViewSlider_js_1.ViewSlider([this.sidebarColumn, this.contentColumn], "CalendarView");
        var shortcuts = this._setupShortcuts();
        var streamListeners = [];
        this.oncreate = function () {
            KeyManager_1.keyManager.registerShortcuts(shortcuts);
            streamListeners.push(_this._calendarViewModel.calendarInvitations.map(function () {
                mithril_1["default"].redraw();
            }));
            streamListeners.push(_this._calendarViewModel.redraw.map(mithril_1["default"].redraw));
        };
        this.onremove = function () {
            KeyManager_1.keyManager.unregisterShortcuts(shortcuts);
            for (var _i = 0, streamListeners_1 = streamListeners; _i < streamListeners_1.length; _i++) {
                var listener = streamListeners_1[_i];
                listener.end(true);
            }
        };
    }
    CalendarView.prototype._setupShortcuts = function () {
        var _this = this;
        return [
            {
                key: TutanotaConstants_1.Keys.ONE,
                exec: function () { return _this._setUrl(CalendarViewModel_1.CalendarViewType.WEEK, _this._calendarViewModel.selectedDate()); },
                help: "switchWeekView_action"
            },
            {
                key: TutanotaConstants_1.Keys.TWO,
                exec: function () { return _this._setUrl(CalendarViewModel_1.CalendarViewType.MONTH, _this._calendarViewModel.selectedDate()); },
                help: "switchMonthView_action"
            },
            {
                key: TutanotaConstants_1.Keys.THREE,
                exec: function () { return _this._setUrl(CalendarViewModel_1.CalendarViewType.AGENDA, _this._calendarViewModel.selectedDate()); },
                help: "switchAgendaView_action"
            },
            {
                key: TutanotaConstants_1.Keys.T,
                exec: function () { return _this._setUrl(mithril_1["default"].route.param("view"), new Date()); },
                help: "viewToday_action"
            },
            {
                key: TutanotaConstants_1.Keys.J,
                enabled: function () { return _this._currentViewType !== CalendarViewModel_1.CalendarViewType.AGENDA; },
                exec: function () { return _this._viewPeriod(true, _this._currentViewType); },
                help: "viewNextPeriod_action"
            },
            {
                key: TutanotaConstants_1.Keys.K,
                enabled: function () { return _this._currentViewType !== CalendarViewModel_1.CalendarViewType.AGENDA; },
                exec: function () { return _this._viewPeriod(false, _this._currentViewType); },
                help: "viewPrevPeriod_action"
            },
            {
                key: TutanotaConstants_1.Keys.N,
                exec: function () {
                    _this._createNewEventDialog();
                },
                help: "newEvent_action"
            },
        ];
    };
    CalendarView.prototype._createNewEventDialog = function (date) {
        var dateToUse = date !== null && date !== void 0 ? date : this._calendarViewModel.selectedDate();
        // Disallow creation of events when there is no existing calendar
        var calendarInfos = this._calendarViewModel.getCalendarInfosCreateIfNeeded();
        if (calendarInfos instanceof Promise) {
            calendarInfos = (0, ProgressDialog_1.showProgressDialog)("pleaseWait_msg", calendarInfos);
        }
        Promise.all([calendarInfos, MainLocator_1.locator.mailModel.getUserMailboxDetails()]).then(function (_a) {
            var calendars = _a[0], mailboxDetails = _a[1];
            return (0, CalendarEventEditDialog_1.showCalendarEventDialog)(dateToUse, calendars, mailboxDetails);
        });
    };
    CalendarView.prototype._editEventDialog = function (event) {
        Promise.all([this._calendarViewModel.calendarInfos.getAsync(), MainLocator_1.locator.mailModel.getUserMailboxDetails()]).then(function (_a) {
            var calendarInfos = _a[0], mailboxDetails = _a[1];
            var p = Promise.resolve(event);
            if (event.repeatRule) {
                // in case of a repeat rule we want to show the start event for now to indicate that we edit all events.
                p = MainLocator_1.locator.entityClient.load(TypeRefs_js_1.CalendarEventTypeRef, event._id);
            }
            p.then(function (e) { return (0, CalendarEventEditDialog_1.showCalendarEventDialog)((0, CalendarUtils_1.getEventStart)(e, (0, CalendarUtils_1.getTimeZone)()), calendarInfos, mailboxDetails, e); })["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotFoundError, function () {
                console.log("calendar event not found when clicking on the event");
            }));
        });
    };
    CalendarView.prototype._viewPeriod = function (next, viewType) {
        var duration;
        var unit;
        switch (viewType) {
            case CalendarViewModel_1.CalendarViewType.MONTH:
                duration = {
                    month: 1
                };
                unit = "month";
                break;
            case CalendarViewModel_1.CalendarViewType.WEEK:
                duration = {
                    week: 1
                };
                unit = "week";
                break;
            case CalendarViewModel_1.CalendarViewType.DAY:
                duration = {
                    day: 1
                };
                unit = "day";
                break;
            default:
                throw new ProgrammingError_1.ProgrammingError("Invalid CalendarViewType: " + viewType);
        }
        var dateTime = luxon_1.DateTime.fromJSDate(this._calendarViewModel.selectedDate());
        var newDate = next ? dateTime.plus(duration).startOf(unit).toJSDate() : dateTime.minus(duration).startOf(unit).toJSDate();
        this._calendarViewModel.selectedDate(newDate);
        mithril_1["default"].redraw();
        this._setUrl(viewType, newDate);
    };
    CalendarView.prototype._renderCalendarViewButtons = function () {
        var _this = this;
        var calendarViewValues = [
            {
                name: LanguageViewModel_1.lang.get("month_label"),
                value: CalendarViewModel_1.CalendarViewType.MONTH,
                icon: "Table" /* Icons.Table */,
                href: "/calendar/month"
            },
            {
                name: LanguageViewModel_1.lang.get("agenda_label"),
                value: CalendarViewModel_1.CalendarViewType.AGENDA,
                icon: "ListUnordered" /* Icons.ListUnordered */,
                href: "/calendar/agenda"
            },
        ];
        if (styles_1.styles.isDesktopLayout()) {
            calendarViewValues.unshift({
                name: LanguageViewModel_1.lang.get("week_label"),
                value: CalendarViewModel_1.CalendarViewType.WEEK,
                icon: "TableColumns" /* Icons.TableColumns */,
                href: "/calendar/week"
            });
        }
        if (ClientDetector_1.client.isDesktopDevice()) {
            calendarViewValues.unshift({
                name: LanguageViewModel_1.lang.get("day_label"),
                value: CalendarViewModel_1.CalendarViewType.DAY,
                icon: "TableSingle" /* Icons.TableSingle */,
                href: "/calendar/day"
            });
        }
        return calendarViewValues.map(function (viewType) {
            return (0, mithril_1["default"])(".folder-row.flex-start.plr-l", // undo the padding of NavButton and prevent .folder-row > a from selecting NavButton
            (0, mithril_1["default"])(".flex-grow.ml-negative-s", (0, mithril_1["default"])(NavButton_js_1.NavButton, {
                label: function () { return viewType.name; },
                icon: function () { return viewType.icon; },
                href: mithril_1["default"].route.get(),
                isSelectedPrefix: viewType.href,
                colors: "nav" /* NavButtonColor.Nav */,
                // Close side menu
                click: function () {
                    _this._setUrl(viewType.value, _this._calendarViewModel.selectedDate());
                    _this.viewSlider.focus(_this.contentColumn);
                }
            })));
        });
    };
    CalendarView.prototype.headerRightView = function () {
        var _this = this;
        return (0, mithril_1["default"])(Button_js_1.Button, {
            label: "newEvent_action",
            click: function () { return _this._createNewEventDialog(); },
            icon: function () { return "Add" /* Icons.Add */; },
            type: "action" /* ButtonType.Action */,
            colors: "header" /* ButtonColor.Header */
        });
    };
    CalendarView.prototype.handleBackButton = function () {
        var route = mithril_1["default"].route.get();
        if (route.startsWith("/calendar/day")) {
            mithril_1["default"].route.set(route.replace("day", "month"));
            return true;
        }
        else if (route.startsWith("/calendar/week")) {
            mithril_1["default"].route.set(route.replace("week", "month"));
            return true;
        }
        else {
            return false;
        }
    };
    CalendarView.prototype.overrideBackIcon = function () {
        return this._currentViewType === CalendarViewModel_1.CalendarViewType.WEEK || this._currentViewType === CalendarViewModel_1.CalendarViewType.DAY;
    };
    CalendarView.prototype._onPressedAddCalendar = function () {
        var _this = this;
        if (LoginController_1.logins.getUserController().getCalendarMemberships().length === 0) {
            this._showCreateCalendarDialog();
        }
        else {
            Promise.resolve().then(function () { return require("../../misc/SubscriptionDialogs"); }).then(function (SubscriptionDialogUtils) { return SubscriptionDialogUtils.checkPremiumSubscription(true); })
                .then(function (ok) {
                if (ok) {
                    _this._showCreateCalendarDialog();
                }
            });
        }
    };
    CalendarView.prototype._showCreateCalendarDialog = function () {
        (0, EditCalendarDialog_1.showEditCalendarDialog)({
            name: "",
            color: Math.random().toString(16).slice(-6)
        }, "add_action", false, function (dialog, properties) {
            MainLocator_1.locator.calendarModel.createCalendar(properties.name, properties.color).then(function () { return dialog.close(); });
        }, "save_action");
    };
    CalendarView.prototype._renderCalendars = function (shared) {
        var _this = this;
        return this._calendarViewModel.calendarInfos.isLoaded()
            ? Array.from(this._calendarViewModel.calendarInfos.getLoaded().values())
                .filter(function (calendarInfo) { return calendarInfo.shared === shared; })
                .map(function (calendarInfo) {
                var _a;
                var userSettingsGroupRoot = LoginController_1.logins.getUserController().userSettingsGroupRoot;
                var existingGroupSettings = (_a = userSettingsGroupRoot.groupSettings.find(function (gc) { return gc.group === calendarInfo.groupInfo.group; })) !== null && _a !== void 0 ? _a : null;
                var colorValue = "#" + (existingGroupSettings ? existingGroupSettings.color : TutanotaConstants_1.defaultCalendarColor);
                var groupRootId = calendarInfo.groupRoot._id;
                return (0, mithril_1["default"])(".folder-row.flex-start.plr-l", [
                    (0, mithril_1["default"])(".flex.flex-grow.center-vertically.button-height", [
                        (0, mithril_1["default"])(".calendar-checkbox", {
                            onclick: function () {
                                var newHiddenCalendars = new Set(_this._calendarViewModel.hiddenCalendars);
                                _this._calendarViewModel.hiddenCalendars.has(groupRootId)
                                    ? newHiddenCalendars["delete"](groupRootId)
                                    : newHiddenCalendars.add(groupRootId);
                                _this._calendarViewModel.setHiddenCalendars(newHiddenCalendars);
                            },
                            style: {
                                "border-color": colorValue,
                                background: _this._calendarViewModel.hiddenCalendars.has(groupRootId) ? "" : colorValue,
                                transition: "all 0.3s",
                                cursor: "pointer"
                            }
                        }),
                        (0, mithril_1["default"])(".pl-m.b.flex-grow.text-ellipsis", {
                            style: {
                                width: 0
                            }
                        }, (0, GroupUtils_1.getSharedGroupName)(calendarInfo.groupInfo, shared)),
                    ]),
                    _this._createCalendarActionDropdown(calendarInfo, colorValue, existingGroupSettings, userSettingsGroupRoot, shared),
                ]);
            })
            : null;
    };
    CalendarView.prototype._createCalendarActionDropdown = function (calendarInfo, colorValue, existingGroupSettings, userSettingsGroupRoot, sharedCalendar) {
        var _this = this;
        var group = calendarInfo.group, groupInfo = calendarInfo.groupInfo, groupRoot = calendarInfo.groupRoot;
        var user = LoginController_1.logins.getUserController().user;
        return (0, mithril_1["default"])(IconButton_js_1.IconButton, {
            title: "more_label",
            colors: "nav" /* ButtonColor.Nav */,
            icon: "More" /* Icons.More */,
            size: 1 /* ButtonSize.Compact */,
            click: (0, Dropdown_js_1.createDropdown)({
                lazyButtons: function () { return [
                    {
                        label: "edit_action",
                        icon: "Edit" /* Icons.Edit */,
                        size: 1 /* ButtonSize.Compact */,
                        click: function () { return _this._onPressedEditCalendar(groupInfo, colorValue, existingGroupSettings, userSettingsGroupRoot, sharedCalendar); }
                    },
                    {
                        label: "sharing_label",
                        icon: "ContactImport" /* Icons.ContactImport */,
                        click: function () {
                            if (LoginController_1.logins.getUserController().isFreeAccount()) {
                                (0, SubscriptionDialogs_1.showNotAvailableForFreeDialog)(false);
                            }
                            else {
                                (0, GroupSharingDialog_1.showGroupSharingDialog)(groupInfo, sharedCalendar);
                            }
                        }
                    },
                    !(0, Env_1.isApp)() && group.type === TutanotaConstants_1.GroupType.Calendar && (0, GroupUtils_1.hasCapabilityOnGroup)(user, group, "1" /* ShareCapability.Write */)
                        ? {
                            label: "import_action",
                            icon: "Import" /* Icons.Import */,
                            click: function () { return (0, CalendarImporterDialog_1.showCalendarImportDialog)(groupRoot); }
                        }
                        : null,
                    !(0, Env_1.isApp)() && group.type === TutanotaConstants_1.GroupType.Calendar && (0, GroupUtils_1.hasCapabilityOnGroup)(user, group, "0" /* ShareCapability.Read */)
                        ? {
                            label: "export_action",
                            icon: "Export" /* Icons.Export */,
                            click: function () {
                                var alarmInfoList = user.alarmInfoList;
                                alarmInfoList &&
                                    (0, CalendarImporterDialog_1.exportCalendar)((0, GroupUtils_1.getSharedGroupName)(groupInfo, sharedCalendar), groupRoot, alarmInfoList.alarms, new Date(), (0, CalendarUtils_1.getTimeZone)());
                            }
                        }
                        : null,
                    !sharedCalendar
                        ? {
                            label: "delete_action",
                            icon: "Trash" /* Icons.Trash */,
                            click: function () { return _this._confirmDeleteCalendar(calendarInfo); }
                        }
                        : null,
                ]; }
            })
        });
    };
    CalendarView.prototype._confirmDeleteCalendar = function (calendarInfo) {
        var _this = this;
        var calendarName = (0, GroupUtils_1.getSharedGroupName)(calendarInfo.groupInfo, false);
        (0, GroupUtils_1.loadGroupMembers)(calendarInfo.group, MainLocator_1.locator.entityClient).then(function (members) {
            var ownerMail = LoginController_1.logins.getUserController().userGroupInfo.mailAddress;
            var otherMembers = members.filter(function (member) { return member.info.mailAddress !== ownerMail; });
            Dialog_1.Dialog.confirm(function () {
                return (otherMembers.length > 0
                    ? LanguageViewModel_1.lang.get("deleteSharedCalendarConfirm_msg", {
                        "{calendar}": calendarName
                    }) + " "
                    : "") +
                    LanguageViewModel_1.lang.get("deleteCalendarConfirm_msg", {
                        "{calendar}": calendarName
                    });
            }).then(function (confirmed) {
                if (confirmed) {
                    _this._calendarViewModel.deleteCalendar(calendarInfo)["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotFoundError, function () { return console.log("Calendar to be deleted was not found."); }));
                }
            });
        });
    };
    CalendarView.prototype._onPressedEditCalendar = function (groupInfo, colorValue, existingGroupSettings, userSettingsGroupRoot, shared) {
        (0, EditCalendarDialog_1.showEditCalendarDialog)({
            name: (0, GroupUtils_1.getSharedGroupName)(groupInfo, shared),
            color: colorValue.substring(1)
        }, "edit_action", shared, function (dialog, properties) {
            if (!shared) {
                groupInfo.name = properties.name;
                MainLocator_1.locator.entityClient.update(groupInfo);
            }
            // color always set for existing calendar
            if (existingGroupSettings) {
                existingGroupSettings.color = properties.color;
                existingGroupSettings.name = shared && properties.name !== groupInfo.name ? properties.name : null;
            }
            else {
                var newGroupSettings = Object.assign((0, TypeRefs_js_1.createGroupSettings)(), {
                    group: groupInfo.group,
                    color: properties.color,
                    name: shared && properties.name !== groupInfo.name ? properties.name : null
                });
                userSettingsGroupRoot.groupSettings.push(newGroupSettings);
            }
            MainLocator_1.locator.entityClient.update(userSettingsGroupRoot);
            dialog.close();
        }, "save_action");
    };
    CalendarView.prototype.view = function () {
        return (0, mithril_1["default"])(".main-view", (0, mithril_1["default"])(this.viewSlider, {
            header: (0, mithril_1["default"])(Header_js_1.header),
            bottomNav: (0, mithril_1["default"])(BottomNav_js_1.BottomNav)
        }));
    };
    CalendarView.prototype.updateUrl = function (args) {
        if (!args.view) {
            this._setUrl(this._currentViewType, this._calendarViewModel.selectedDate(), true);
        }
        else {
            // @ts-ignore
            this._currentViewType = CalendarViewModel_1.CalendarViewTypeByValue[args.view] ? args.view : CalendarViewModel_1.CalendarViewType.MONTH;
            var urlDateParam = args.date;
            if (urlDateParam && this._currentViewType !== CalendarViewModel_1.CalendarViewType.AGENDA) {
                // Unlike JS Luxon assumes local time zone when parsing and not UTC. That's what we want
                var luxonDate = luxon_1.DateTime.fromISO(urlDateParam);
                var date = new Date();
                if (luxonDate.isValid) {
                    date = luxonDate.toJSDate();
                }
                if (this._calendarViewModel.selectedDate().getTime() !== date.getTime()) {
                    this._calendarViewModel.selectedDate(date);
                    mithril_1["default"].redraw();
                }
            }
            DeviceConfig_1.deviceConfig.setDefaultCalendarView(LoginController_1.logins.getUserController().user._id, this._currentViewType);
        }
    };
    CalendarView.prototype.getViewSlider = function () {
        return this.viewSlider;
    };
    CalendarView.prototype._setUrl = function (view, date, replace) {
        if (replace === void 0) { replace = false; }
        var dateString = luxon_1.DateTime.fromJSDate(date).toISODate();
        mithril_1["default"].route.set("/calendar/:view/:date", {
            view: view,
            date: dateString
        }, {
            replace: replace
        });
    };
    CalendarView.prototype._createCalendarEventViewModel = function (event, calendarInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, mailboxDetails, calendarInfos;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all([MainLocator_1.locator.mailModel.getUserMailboxDetails(), calendarInfo.getAsync()])];
                    case 1:
                        _a = _b.sent(), mailboxDetails = _a[0], calendarInfos = _a[1];
                        return [2 /*return*/, (0, CalendarEventViewModel_1.createCalendarEventViewModel)((0, CalendarUtils_1.getEventStart)(event, (0, CalendarUtils_1.getTimeZone)()), calendarInfos, mailboxDetails, event, null, false)];
                }
            });
        });
    };
    CalendarView.prototype._onEventSelected = function (calendarEvent, domEvent, htmlSanitizerPromise) {
        return __awaiter(this, void 0, void 0, function () {
            var domTarget, x, y, _a, viewModel, htmlSanitizer, rect;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        domTarget = domEvent.currentTarget;
                        if (domTarget == null || !(domTarget instanceof HTMLElement)) {
                            return [2 /*return*/];
                        }
                        x = domEvent.clientX;
                        y = domEvent.clientY;
                        return [4 /*yield*/, Promise.all([
                                this._createCalendarEventViewModel(calendarEvent, this._calendarViewModel.calendarInfos),
                                htmlSanitizerPromise,
                            ])
                            // We want the popup to show at the users mouse
                        ];
                    case 1:
                        _a = _b.sent(), viewModel = _a[0], htmlSanitizer = _a[1];
                        rect = {
                            bottom: y,
                            height: 0,
                            width: 0,
                            top: y,
                            left: x,
                            right: x
                        };
                        new CalendarEventPopup_1.CalendarEventPopup(calendarEvent, rect, htmlSanitizer, function () { return _this._editEventDialog(calendarEvent); }, viewModel).show();
                        return [2 /*return*/];
                }
            });
        });
    };
    return CalendarView;
}());
exports.CalendarView = CalendarView;
