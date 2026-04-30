"use strict";
exports.__esModule = true;
exports.CalendarMonthView = void 0;
var mithril_1 = require("mithril");
var size_1 = require("../../gui/size");
var CalendarUtils_1 = require("../date/CalendarUtils");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var ContinuingCalendarEventBubble_1 = require("./ContinuingCalendarEventBubble");
var styles_1 = require("../../gui/styles");
var Formatter_1 = require("../../misc/Formatter");
var CommonCalendarUtils_1 = require("../../api/common/utils/CommonCalendarUtils");
var WindowFacade_1 = require("../../misc/WindowFacade");
var PageView_1 = require("../../gui/base/PageView");
var LoginController_1 = require("../../api/main/LoginController");
var CalendarView_1 = require("./CalendarView");
var EventDragHandler_1 = require("./EventDragHandler");
var GuiUtils_1 = require("../../gui/base/GuiUtils");
var UserError_1 = require("../../api/main/UserError");
var ErrorHandlerImpl_1 = require("../../misc/ErrorHandlerImpl");
var theme_1 = require("../../gui/theme");
var CalendarGuiUtils_1 = require("./CalendarGuiUtils");
var CalendarViewModel_1 = require("./CalendarViewModel");
var Time_1 = require("../../api/common/utils/Time");
var ClientDetector_1 = require("../../misc/ClientDetector");
var dayHeight = function () { return (styles_1.styles.isDesktopLayout() ? 32 : 24); };
var spaceBetweenEvents = function () { return (styles_1.styles.isDesktopLayout() ? 2 : 1); };
var EVENT_BUBBLE_VERTICAL_OFFSET = 5;
var CalendarMonthView = /** @class */ (function () {
    function CalendarMonthView(_a) {
        var attrs = _a.attrs;
        this._monthDom = null;
        this._dayUnderMouse = null;
        this._lastMousePos = null;
        this._resizeListener = mithril_1["default"].redraw;
        this._zone = (0, CalendarUtils_1.getTimeZone)();
        this._lastWidth = 0;
        this._lastHeight = 0;
        this._eventDragHandler = new EventDragHandler_1.EventDragHandler((0, tutanota_utils_1.neverNull)(document.body), attrs.dragHandlerCallbacks);
    }
    CalendarMonthView.prototype.oncreate = function () {
        WindowFacade_1.windowFacade.addResizeListener(this._resizeListener);
    };
    CalendarMonthView.prototype.onremove = function () {
        WindowFacade_1.windowFacade.removeResizeListener(this._resizeListener);
    };
    CalendarMonthView.prototype.view = function (_a) {
        var attrs = _a.attrs;
        var startOfTheWeekOffset = (0, CalendarUtils_1.getStartOfTheWeekOffset)(attrs.startOfTheWeek);
        var thisMonth = (0, CalendarUtils_1.getCalendarMonth)(attrs.selectedDate, startOfTheWeekOffset, false);
        var previousMonthDate = new Date(attrs.selectedDate);
        previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);
        var previousMonth = (0, CalendarUtils_1.getCalendarMonth)(previousMonthDate, startOfTheWeekOffset, false);
        var nextMonthDate = new Date(attrs.selectedDate);
        nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
        var nextMonth = (0, CalendarUtils_1.getCalendarMonth)(nextMonthDate, startOfTheWeekOffset, false);
        var lastMontDate = (0, tutanota_utils_1.incrementMonth)(attrs.selectedDate, -1);
        var nextMontDate = (0, tutanota_utils_1.incrementMonth)(attrs.selectedDate, 1);
        return (0, mithril_1["default"])(PageView_1.PageView, {
            previousPage: {
                key: (0, CalendarUtils_1.getFirstDayOfMonth)(lastMontDate).getTime(),
                nodes: this._monthDom ? this._renderCalendar(attrs, previousMonth, thisMonth, lastMontDate, this._zone) : null
            },
            currentPage: {
                key: (0, CalendarUtils_1.getFirstDayOfMonth)(attrs.selectedDate).getTime(),
                nodes: this._renderCalendar(attrs, thisMonth, thisMonth, attrs.selectedDate, this._zone)
            },
            nextPage: {
                key: (0, CalendarUtils_1.getFirstDayOfMonth)(nextMontDate).getTime(),
                nodes: this._monthDom ? this._renderCalendar(attrs, nextMonth, thisMonth, nextMontDate, this._zone) : null
            },
            onChangePage: function (next) { return attrs.onChangeMonth(next); }
        });
    };
    CalendarMonthView.prototype.onbeforeupdate = function (newVnode, oldVnode) {
        var dom = this._monthDom;
        var different = !dom ||
            oldVnode.attrs.eventsForDays !== newVnode.attrs.eventsForDays ||
            oldVnode.attrs.selectedDate !== newVnode.attrs.selectedDate ||
            oldVnode.attrs.amPmFormat !== newVnode.attrs.amPmFormat ||
            oldVnode.attrs.groupColors !== newVnode.attrs.groupColors ||
            oldVnode.attrs.hiddenCalendars !== newVnode.attrs.hiddenCalendars ||
            dom.offsetWidth !== this._lastWidth ||
            dom.offsetHeight !== this._lastHeight;
        if (dom) {
            this._lastWidth = dom.offsetWidth;
            this._lastHeight = dom.offsetHeight;
        }
        return different || this._eventDragHandler.queryHasChanged();
    };
    CalendarMonthView.prototype._renderCalendar = function (attrs, month, currentlyVisibleMonth, date, zone) {
        var _this = this;
        var weekdays = month.weekdays, weeks = month.weeks;
        var firstDay = (0, CalendarUtils_1.getFirstDayOfMonth)(date);
        var today = (0, CalendarUtils_1.getStartOfDayWithZone)(new Date(), (0, CalendarUtils_1.getTimeZone)());
        return (0, mithril_1["default"])(".fill-absolute.flex.col.mlr-safe-inset", [
            styles_1.styles.isDesktopLayout()
                ? (0, mithril_1["default"])(".mt-s.pr-l.flex.row.items-center", [
                    (0, CalendarGuiUtils_1.renderCalendarSwitchLeftButton)("prevMonth_label", function () { return attrs.onChangeMonth(false); }),
                    (0, CalendarGuiUtils_1.renderCalendarSwitchRightButton)("nextMonth_label", function () { return attrs.onChangeMonth(true); }),
                    (0, mithril_1["default"])("h1", (0, Formatter_1.formatMonthWithFullYear)(firstDay)),
                ])
                : (0, mithril_1["default"])(".pt-s"),
            (0, mithril_1["default"])(".flex.mb-s", weekdays.map(function (wd) { return (0, mithril_1["default"])(".flex-grow", (0, mithril_1["default"])(".calendar-day-indicator.b", wd)); })),
            (0, mithril_1["default"])(".flex.col.flex-grow", {
                oncreate: function (vnode) {
                    if (month === currentlyVisibleMonth) {
                        _this._monthDom = vnode.dom;
                        mithril_1["default"].redraw();
                    }
                },
                onupdate: function (vnode) {
                    if (month === currentlyVisibleMonth) {
                        _this._monthDom = vnode.dom;
                    }
                },
                onmousemove: function (mouseEvent) {
                    mouseEvent.redraw = false;
                    var posAndBoundsFromMouseEvent = (0, GuiUtils_1.getPosAndBoundsFromMouseEvent)(mouseEvent);
                    _this._lastMousePos = posAndBoundsFromMouseEvent;
                    _this._dayUnderMouse = (0, CalendarGuiUtils_1.getDateFromMousePos)(posAndBoundsFromMouseEvent, weeks.map(function (week) { return week.map(function (day) { return day.date; }); }));
                    _this._eventDragHandler.handleDrag(_this._dayUnderMouse, posAndBoundsFromMouseEvent);
                },
                onmouseup: function (mouseEvent) {
                    mouseEvent.redraw = false;
                    _this._endDrag();
                },
                onmouseleave: function (mouseEvent) {
                    mouseEvent.redraw = false;
                    _this._endDrag();
                }
            }, weeks.map(function (week) {
                return (0, mithril_1["default"])(".flex.flex-grow.rel", {
                    key: week[0].date.getTime()
                }, [week.map(function (day, i) { return _this._renderDay(attrs, day, today, i); }), _this._monthDom ? _this._renderWeekEvents(attrs, week, zone) : null]);
            })),
        ]);
    };
    CalendarMonthView.prototype._endDrag = function () {
        var _a;
        var dayUnderMouse = this._dayUnderMouse;
        var originalDate = (_a = this._eventDragHandler.originalEvent) === null || _a === void 0 ? void 0 : _a.startTime;
        if (dayUnderMouse && originalDate) {
            //make sure the date we move to also gets a time
            var dateUnderMouse = Time_1.Time.fromDate(originalDate).toDate(dayUnderMouse);
            this._eventDragHandler.endDrag(dateUnderMouse)["catch"]((0, tutanota_utils_1.ofClass)(UserError_1.UserError, ErrorHandlerImpl_1.showUserError));
        }
    };
    CalendarMonthView.prototype._renderDay = function (attrs, day, today, weekDayNumber) {
        var selectedDate = attrs.selectedDate;
        var isSelectedDate = (0, tutanota_utils_1.isSameDay)(selectedDate, day.date);
        return (0, mithril_1["default"])(".calendar-day.calendar-column-border.flex-grow.rel.overflow-hidden.fill-absolute.cursor-pointer" +
            (day.paddingDay ? ".calendar-alternate-background" : ""), {
            key: day.date.getTime(),
            onclick: function (e) {
                if (ClientDetector_1.client.isDesktopDevice()) {
                    var newDate = new Date(day.date);
                    var hour = new Date().getHours();
                    if (hour < 23) {
                        hour++;
                    }
                    newDate.setHours(hour, 0);
                    attrs.onDateSelected(new Date(day.date), CalendarViewModel_1.CalendarViewType.MONTH);
                    attrs.onNewEvent(newDate);
                }
                else {
                    attrs.onDateSelected(new Date(day.date), CalendarViewModel_1.CalendarViewType.DAY);
                }
                e.preventDefault();
            }
        }, [
            (0, mithril_1["default"])(".mb-xs", {
                style: {
                    height: (0, size_1.px)(CalendarView_1.SELECTED_DATE_INDICATOR_THICKNESS),
                    background: isSelectedDate ? theme_1.theme.content_accent : "none"
                }
            }),
            this._renderDayHeader(day, today, attrs.onDateSelected),
            // weeks that do not start on Monday are not strictly defined, so we only display
            // a week number if the user's client is configured to start weeks on Monday
            weekDayNumber === 0 && attrs.startOfTheWeek === "0" /* WeekStart.MONDAY */ ? (0, mithril_1["default"])(".calendar-month-week-number.abs", (0, CalendarUtils_1.getWeekNumber)(day.date)) : null,
        ]);
    };
    CalendarMonthView.prototype._renderDayHeader = function (_a, today, onDateSelected) {
        var date = _a.date, day = _a.day;
        return (0, mithril_1["default"])(".flex-center", [
            (0, mithril_1["default"])(".calendar-day-indicator.circle" + (0, CalendarUtils_1.getDateIndicator)(date, today), {
                onclick: function (e) {
                    onDateSelected(new Date(date), CalendarViewModel_1.CalendarViewType.DAY);
                    e.stopPropagation();
                },
                style: {
                    width: (0, size_1.px)(22)
                }
            }, String(day)),
        ]);
    };
    CalendarMonthView.prototype._renderWeekEvents = function (attrs, week, zone) {
        var _this = this;
        var eventsOnDays = attrs.getEventsOnDays(week.map(function (day) { return day.date; }));
        var events = new Set(eventsOnDays.longEvents.concat((0, tutanota_utils_1.flat)(eventsOnDays.shortEvents)));
        var firstDayOfWeek = week[0].date;
        var lastDayOfWeek = (0, tutanota_utils_1.lastThrow)(week);
        var dayWidth = this._getWidthForDay();
        var weekHeight = this._getHeightForWeek();
        var eventHeight = size_1.size.calendar_line_height + spaceBetweenEvents(); // height + border
        var maxEventsPerDay = (weekHeight - dayHeight()) / eventHeight;
        var eventsPerDay = Math.floor(maxEventsPerDay) - 1; // preserve some space for the more events indicator
        var moreEventsForDay = [0, 0, 0, 0, 0, 0, 0];
        var eventMargin = styles_1.styles.isDesktopLayout() ? size_1.size.calendar_event_margin : size_1.size.calendar_event_margin_mobile;
        var firstDayOfNextWeek = (0, CalendarUtils_1.getStartOfNextDayWithZone)(lastDayOfWeek.date, zone);
        return (0, CalendarUtils_1.layOutEvents)(Array.from(events), zone, function (columns) {
            return columns
                .map(function (events, columnIndex) {
                return events.map(function (event) {
                    if (columnIndex < eventsPerDay) {
                        var eventIsAllDay = (0, CommonCalendarUtils_1.isAllDayEventByTimes)(event.startTime, event.endTime);
                        var eventStart = eventIsAllDay ? (0, CalendarUtils_1.getAllDayDateForTimezone)(event.startTime, zone) : event.startTime;
                        var eventEnd = eventIsAllDay ? (0, tutanota_utils_1.incrementDate)((0, CalendarUtils_1.getEventEnd)(event, zone), -1) : event.endTime;
                        var position = _this._getEventPosition(eventStart, eventEnd, firstDayOfWeek, firstDayOfNextWeek, dayWidth, dayHeight(), columnIndex);
                        return _this.renderEvent(event, position, eventStart, firstDayOfWeek, firstDayOfNextWeek, eventEnd, attrs);
                    }
                    else {
                        week.forEach(function (dayInWeek, index) {
                            var eventsForDay = attrs.eventsForDays.get(dayInWeek.date.getTime());
                            if (eventsForDay && eventsForDay.indexOf(event) !== -1) {
                                moreEventsForDay[index]++;
                            }
                        });
                        return null;
                    }
                });
            })
                .concat(moreEventsForDay.map(function (moreEventsCount, weekday) {
                var day = week[weekday];
                var isPadding = day.paddingDay;
                if (moreEventsCount > 0) {
                    return (0, mithril_1["default"])(".abs.small" + (isPadding ? ".calendar-bubble-more-padding-day" : ""), {
                        style: {
                            bottom: (0, size_1.px)(-EVENT_BUBBLE_VERTICAL_OFFSET),
                            height: (0, size_1.px)(CalendarUtils_1.CALENDAR_EVENT_HEIGHT),
                            left: (0, size_1.px)(weekday * dayWidth + eventMargin),
                            width: (0, size_1.px)(dayWidth - 2 - eventMargin * 2),
                            pointerEvents: "none"
                        }
                    }, (0, mithril_1["default"])("", {
                        style: {
                            "font-weight": "600"
                        }
                    }, "+" + moreEventsCount));
                }
                else {
                    return null;
                }
            }));
        }, true);
    };
    CalendarMonthView.prototype.renderEvent = function (event, position, eventStart, firstDayOfWeek, firstDayOfNextWeek, eventEnd, attrs) {
        var _this = this;
        var isTemporary = attrs.temporaryEvents.includes(event);
        return (0, mithril_1["default"])(".abs.overflow-hidden", {
            key: event._id[0] + event._id[1] + event.startTime.getTime(),
            style: {
                top: (0, size_1.px)(position.top),
                height: (0, size_1.px)(CalendarUtils_1.CALENDAR_EVENT_HEIGHT),
                left: (0, size_1.px)(position.left),
                right: (0, size_1.px)(position.right),
                pointerEvents: !styles_1.styles.isUsingBottomNavigation() ? "auto" : "none"
            },
            onmousedown: function () {
                var dayUnderMouse = _this._dayUnderMouse;
                var lastMousePos = _this._lastMousePos;
                if (dayUnderMouse && lastMousePos && !isTemporary) {
                    _this._eventDragHandler.prepareDrag(event, dayUnderMouse, lastMousePos, true);
                }
            }
        }, (0, mithril_1["default"])(ContinuingCalendarEventBubble_1.ContinuingCalendarEventBubble, {
            event: event,
            startsBefore: eventStart < firstDayOfWeek,
            endsAfter: firstDayOfNextWeek < eventEnd,
            color: (0, CalendarUtils_1.getEventColor)(event, attrs.groupColors),
            showTime: styles_1.styles.isDesktopLayout() && !(0, CommonCalendarUtils_1.isAllDayEvent)(event) ? "startTime" /* EventTextTimeOption.START_TIME */ : null,
            user: LoginController_1.logins.getUserController().user,
            onEventClicked: function (e, domEvent) {
                attrs.onEventClicked(event, domEvent);
            },
            fadeIn: !this._eventDragHandler.isDragging,
            opacity: isTemporary ? CalendarUtils_1.TEMPORARY_EVENT_OPACITY : 1,
            enablePointerEvents: !this._eventDragHandler.isDragging && !isTemporary && ClientDetector_1.client.isDesktopDevice()
        }));
    };
    CalendarMonthView.prototype._getEventPosition = function (eventStart, eventEnd, firstDayOfWeek, firstDayOfNextWeek, calendarDayWidth, calendarDayHeight, columnIndex) {
        var top = (size_1.size.calendar_line_height + spaceBetweenEvents()) * columnIndex + calendarDayHeight + EVENT_BUBBLE_VERTICAL_OFFSET;
        var dayOfStartDateInWeek = getDiffInDaysFast(eventStart, firstDayOfWeek);
        var dayOfEndDateInWeek = getDiffInDaysFast(eventEnd, firstDayOfWeek);
        var calendarEventMargin = styles_1.styles.isDesktopLayout() ? size_1.size.calendar_event_margin : size_1.size.calendar_event_margin_mobile;
        var left = (eventStart < firstDayOfWeek ? 0 : dayOfStartDateInWeek * calendarDayWidth) + calendarEventMargin;
        var right = (eventEnd > firstDayOfNextWeek ? 0 : (6 - dayOfEndDateInWeek) * calendarDayWidth) + calendarEventMargin;
        return {
            top: top,
            left: left,
            right: right
        };
    };
    CalendarMonthView.prototype._getHeightForWeek = function () {
        if (!this._monthDom) {
            return 1;
        }
        var monthDomHeight = this._monthDom.offsetHeight;
        return monthDomHeight / 6;
    };
    CalendarMonthView.prototype._getWidthForDay = function () {
        if (!this._monthDom) {
            return 1;
        }
        var monthDomWidth = this._monthDom.offsetWidth;
        return monthDomWidth / 7;
    };
    return CalendarMonthView;
}());
exports.CalendarMonthView = CalendarMonthView;
/**
 * Optimization to not create luxon's DateTime in simple case.
 * May not work if we allow override time zones.
 */
function getDiffInDaysFast(left, right) {
    if (left.getMonth() === right.getMonth()) {
        return left.getDate() - right.getDate();
    }
    else {
        return (0, CalendarUtils_1.getDiffInDays)(right, left);
    }
}
