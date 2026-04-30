"use strict";
exports.__esModule = true;
exports.MultiDayCalendarView = void 0;
var mithril_1 = require("mithril");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Formatter_1 = require("../../misc/Formatter");
var CalendarUtils_1 = require("../date/CalendarUtils");
var CalendarDayEventsView_1 = require("./CalendarDayEventsView");
var theme_1 = require("../../gui/theme");
var size_1 = require("../../gui/size");
var tutanota_utils_2 = require("@tutao/tutanota-utils");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var PageView_1 = require("../../gui/base/PageView");
var LoginController_1 = require("../../api/main/LoginController");
var CalendarView_1 = require("./CalendarView");
var EventDragHandler_1 = require("./EventDragHandler");
var GuiUtils_1 = require("../../gui/base/GuiUtils");
var UserError_1 = require("../../api/main/UserError");
var ErrorHandlerImpl_1 = require("../../misc/ErrorHandlerImpl");
var styles_1 = require("../../gui/styles");
var tutanota_utils_3 = require("@tutao/tutanota-utils");
var CalendarGuiUtils_1 = require("./CalendarGuiUtils");
var CalendarViewModel_1 = require("./CalendarViewModel");
var ContinuingCalendarEventBubble_1 = require("./ContinuingCalendarEventBubble");
var tutanota_utils_4 = require("@tutao/tutanota-utils");
var CommonCalendarUtils_1 = require("../../api/common/utils/CommonCalendarUtils");
var MultiDayCalendarView = /** @class */ (function () {
    function MultiDayCalendarView(_a) {
        var attrs = _a.attrs;
        this._redrawIntervalId = null;
        this._longEventsDom = null;
        this._domElements = [];
        this._dateUnderMouse = null;
        this._viewDom = null;
        this._lastMousePos = null;
        this._isHeaderEventBeingDragged = false;
        this._scrollPosition = size_1.size.calendar_hour_height * CalendarUtils_1.DEFAULT_HOUR_OF_DAY;
        this._eventDragHandler = new EventDragHandler_1.EventDragHandler((0, tutanota_utils_4.neverNull)(document.body), attrs.dragHandlerCallbacks);
    }
    MultiDayCalendarView.prototype.oncreate = function (vnode) {
        this._viewDom = vnode.dom;
    };
    MultiDayCalendarView.prototype.onupdate = function (vnode) {
        this._viewDom = vnode.dom;
    };
    MultiDayCalendarView.prototype.view = function (_a) {
        var attrs = _a.attrs;
        // Special case for week view
        var startOfThisPeriod = attrs.daysInPeriod === 7 ? (0, CalendarUtils_1.getStartOfWeek)(attrs.selectedDate, (0, CalendarUtils_1.getStartOfTheWeekOffset)(attrs.startOfTheWeek)) : attrs.selectedDate;
        var startOfPreviousPeriod = (0, tutanota_utils_1.incrementDate)(new Date(startOfThisPeriod), -attrs.daysInPeriod);
        var startOfNextPeriod = (0, tutanota_utils_1.incrementDate)(new Date(startOfThisPeriod), attrs.daysInPeriod);
        var previousRange = (0, CalendarUtils_1.getRangeOfDays)(startOfPreviousPeriod, attrs.daysInPeriod);
        var currentRange = (0, CalendarUtils_1.getRangeOfDays)(startOfThisPeriod, attrs.daysInPeriod);
        var nextRange = (0, CalendarUtils_1.getRangeOfDays)(startOfNextPeriod, attrs.daysInPeriod);
        var previousPageEvents = attrs.getEventsOnDays(previousRange);
        var currentPageEvents = attrs.getEventsOnDays(currentRange);
        var nextPageEvents = attrs.getEventsOnDays(nextRange);
        return (0, mithril_1["default"])(PageView_1.PageView, {
            previousPage: {
                key: previousRange[0].getTime(),
                nodes: this._renderWeek(attrs, previousPageEvents, currentPageEvents)
            },
            currentPage: {
                key: currentRange[0].getTime(),
                nodes: this._renderWeek(attrs, currentPageEvents, currentPageEvents)
            },
            nextPage: {
                key: nextRange[0].getTime(),
                nodes: this._renderWeek(attrs, nextPageEvents, currentPageEvents)
            },
            onChangePage: function (next) { return attrs.onChangeViewPeriod(next); }
        });
    };
    MultiDayCalendarView.prototype._getTodayTimestamp = function () {
        return (0, tutanota_utils_1.getStartOfDay)(new Date()).getTime();
    };
    MultiDayCalendarView.prototype._renderWeek = function (attrs, thisWeek, mainWeek) {
        var _this = this;
        return (0, mithril_1["default"])(".fill-absolute.flex.col.calendar-column-border.mlr-safe-inset", {
            oncreate: function (vnode) {
                _this._redrawIntervalId = setInterval(mithril_1["default"].redraw, 1000 * 60);
            },
            onremove: function () {
                if (_this._redrawIntervalId != null) {
                    clearInterval(_this._redrawIntervalId);
                    _this._redrawIntervalId = null;
                }
            },
            onmousemove: function (mouseEvent) {
                mouseEvent.redraw = false;
                _this._lastMousePos = (0, GuiUtils_1.getPosAndBoundsFromMouseEvent)(mouseEvent);
                if (_this._dateUnderMouse) {
                    return _this._eventDragHandler.handleDrag(_this._dateUnderMouse, _this._lastMousePos);
                }
            },
            onmouseup: function (mouseEvent) {
                mouseEvent.redraw = false;
                _this._endDrag();
            },
            onmouseleave: function (mouseEvent) {
                mouseEvent.redraw = false;
                _this._endDrag();
            }
        }, [
            styles_1.styles.isDesktopLayout()
                ? this.renderHeaderDesktop(attrs, thisWeek.days, thisWeek, mainWeek)
                : this.renderHeaderMobile(thisWeek, mainWeek, attrs.groupColors, attrs.onEventClicked, attrs.temporaryEvents),
            (0, mithril_1["default"])("", {
                style: {
                    "border-bottom": "1px solid ".concat(theme_1.theme.content_border)
                }
            }),
            (0, mithril_1["default"])(".flex.scroll", {
                oncreate: function (vnode) {
                    vnode.dom.scrollTop = _this._scrollPosition;
                    _this._domElements.push(vnode.dom);
                },
                onscroll: function (event) {
                    if (thisWeek === mainWeek) {
                        _this._domElements.forEach(function (dom) {
                            if (dom !== event.target) {
                                dom.scrollTop = event.target.scrollTop;
                            }
                        });
                        _this._scrollPosition = event.target.scrollTop;
                    }
                }
            }, [
                (0, mithril_1["default"])(".flex.col", CalendarDayEventsView_1.calendarDayTimes.map(function (time) {
                    var width = styles_1.styles.isDesktopLayout() ? size_1.size.calendar_hour_width : size_1.size.calendar_hour_width_mobile;
                    return (0, mithril_1["default"])(".calendar-hour.flex.cursor-pointer", {
                        onclick: function (e) {
                            e.stopPropagation();
                            attrs.onNewEvent(time.toDate(attrs.selectedDate));
                        }
                    }, (0, mithril_1["default"])(".pl-s.pr-s.center.small", {
                        style: {
                            "line-height": styles_1.styles.isDesktopLayout() ? (0, size_1.px)(size_1.size.calendar_hour_height) : "unset",
                            width: (0, size_1.px)(width),
                            height: (0, size_1.px)(size_1.size.calendar_hour_height),
                            "border-right": "2px solid ".concat(theme_1.theme.content_border)
                        }
                    }, (0, Formatter_1.formatTime)(time.toDate())));
                })),
                (0, mithril_1["default"])(".flex.flex-grow", thisWeek.days.map(function (weekday, i) {
                    var _a;
                    var events = thisWeek.shortEvents[i];
                    var newEventHandler = function (hours, minutes) {
                        var newDate = new Date(weekday);
                        newDate.setHours(hours, minutes);
                        attrs.onNewEvent(newDate);
                        attrs.onDateSelected(new Date(weekday));
                    };
                    return (0, mithril_1["default"])(".flex-grow.calendar-column-border", {
                        style: {
                            height: (0, size_1.px)(CalendarDayEventsView_1.calendarDayTimes.length * size_1.size.calendar_hour_height)
                        }
                    }, (0, mithril_1["default"])(CalendarDayEventsView_1.CalendarDayEventsView, {
                        onEventClicked: attrs.onEventClicked,
                        groupColors: attrs.groupColors,
                        events: events,
                        displayTimeIndicator: weekday.getTime() === _this._getTodayTimestamp(),
                        onTimePressed: newEventHandler,
                        onTimeContextPressed: newEventHandler,
                        day: weekday,
                        setCurrentDraggedEvent: function (event) { return _this.startEventDrag(event); },
                        setTimeUnderMouse: function (time) { return (_this._dateUnderMouse = (0, CalendarUtils_1.combineDateWithTime)(weekday, time)); },
                        isTemporaryEvent: function (event) { return attrs.temporaryEvents.includes(event); },
                        isDragging: _this._eventDragHandler.isDragging,
                        fullViewWidth: (_a = _this._viewDom) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect().width
                    }));
                })),
            ]),
        ]);
    };
    MultiDayCalendarView.prototype.startEventDrag = function (event) {
        var lastMousePos = this._lastMousePos;
        if (this._dateUnderMouse && lastMousePos) {
            this._eventDragHandler.prepareDrag(event, this._dateUnderMouse, lastMousePos, this._isHeaderEventBeingDragged);
        }
    };
    MultiDayCalendarView.prototype.renderHeaderMobile = function (thisPageEvents, mainPageEvents, groupColors, onEventClicked, temporaryEvents) {
        var _this = this;
        // We calculate the height manually because we want the header to transition between heights when swiping left and right
        // Hardcoding some styles instead of classes so that we can avoid nasty magic numbers
        var mainPageEventsCount = mainPageEvents.longEvents.length;
        var padding = mainPageEventsCount !== 0 ? size_1.size.vpad_small : 0;
        // Set bottom padding in height, because it will be ignored in the style
        var heightAdjustForPadding = 2 * padding;
        var height = mainPageEventsCount * CalendarUtils_1.CALENDAR_EVENT_HEIGHT + heightAdjustForPadding;
        return (0, mithril_1["default"])(".calendar-long-events-header.flex-fixed.calendar-hour-margin.pr-l", {
            style: {
                height: (0, size_1.px)(height),
                paddingTop: (0, size_1.px)(padding),
                transition: "height 200ms ease-in-out"
            },
            oncreate: function (vnode) {
                if (mainPageEvents === thisPageEvents) {
                    _this._longEventsDom = vnode.dom;
                }
                mithril_1["default"].redraw();
            },
            onupdate: function (vnode) {
                if (mainPageEvents === thisPageEvents) {
                    _this._longEventsDom = vnode.dom;
                }
            }
        }, this.renderLongEvents(thisPageEvents.days, thisPageEvents.longEvents, groupColors, onEventClicked, temporaryEvents).children);
    };
    MultiDayCalendarView.prototype.renderHeaderDesktop = function (attrs, dates, thisPageEvents, mainPageEvents) {
        var _this = this;
        var selectedDate = attrs.selectedDate, renderHeaderText = attrs.renderHeaderText, groupColors = attrs.groupColors, onEventClicked = attrs.onEventClicked, onChangeViewPeriod = attrs.onChangeViewPeriod, startOfTheWeek = attrs.startOfTheWeek;
        var firstDate = thisPageEvents.days[0];
        return (0, mithril_1["default"])(".calendar-long-events-header.mt-s.flex-fixed", [
            (0, mithril_1["default"])(".pr-l.flex.row.items-center", [
                (0, CalendarGuiUtils_1.renderCalendarSwitchLeftButton)("prevWeek_label", function () { return onChangeViewPeriod(false); }),
                (0, CalendarGuiUtils_1.renderCalendarSwitchRightButton)("nextWeek_label", function () { return onChangeViewPeriod(true); }),
                (0, mithril_1["default"])("h1", renderHeaderText(selectedDate)),
                this.renderWeekNumberLabel(firstDate, startOfTheWeek),
            ]),
            (0, mithril_1["default"])(".calendar-hour-margin", {
                onmousemove: function (mouseEvent) {
                    var _a = (0, GuiUtils_1.getPosAndBoundsFromMouseEvent)(mouseEvent), x = _a.x, targetWidth = _a.targetWidth;
                    var dayWidth = targetWidth / attrs.daysInPeriod;
                    var dayNumber = Math.floor(x / dayWidth);
                    var date = new Date(thisPageEvents.days[dayNumber]);
                    var dateUnderMouse = _this._dateUnderMouse;
                    // When dragging short events, dont cause the mouse position date to drop to 00:00 when dragging over the header
                    if (dateUnderMouse && _this._eventDragHandler.isDragging && !_this._isHeaderEventBeingDragged) {
                        date.setHours(dateUnderMouse.getHours());
                        date.setMinutes(dateUnderMouse.getMinutes());
                    }
                    _this._dateUnderMouse = date;
                }
            }, [
                this.renderDayNamesRow(thisPageEvents.days, attrs.onDateSelected),
                this.renderLongEventsSection(thisPageEvents, mainPageEvents, groupColors, onEventClicked, attrs.temporaryEvents),
                this.renderSelectedDateIndicatorRow(selectedDate, thisPageEvents.days),
            ]),
        ]);
    };
    MultiDayCalendarView.prototype.renderLongEventsSection = function (thisPageEvents, mainPageEvents, groupColors, onEventClicked, temporayEvents) {
        var _this = this;
        var thisPageLongEvents = this.renderLongEvents(thisPageEvents.days, thisPageEvents.longEvents, groupColors, onEventClicked, temporayEvents);
        var mainPageLongEvents = this.renderLongEvents(mainPageEvents.days, mainPageEvents.longEvents, groupColors, onEventClicked, temporayEvents);
        return (0, mithril_1["default"])(".rel", {
            oncreate: function (vnode) {
                if (mainPageEvents === thisPageEvents) {
                    _this._longEventsDom = vnode.dom;
                }
                mithril_1["default"].redraw();
            },
            onupdate: function (vnode) {
                if (mainPageEvents === thisPageEvents) {
                    _this._longEventsDom = vnode.dom;
                }
            },
            style: {
                height: (0, size_1.px)(mainPageLongEvents.maxEventsInColumn * CalendarUtils_1.CALENDAR_EVENT_HEIGHT),
                width: "100%",
                transition: "height 200ms ease-in-out"
            }
        }, thisPageLongEvents.children);
    };
    MultiDayCalendarView.prototype.renderSelectedDateIndicatorRow = function (selectedDate, dates) {
        return (0, mithril_1["default"])(".flex.pt-s", dates.map(function (day) {
            return (0, mithril_1["default"])(".flex-grow.flex.col", {
                style: {
                    justifyContent: "flex-end"
                }
            }, (0, mithril_1["default"])("", {
                style: {
                    // Don't render the selected date if there is only one day shown, since it's obvious
                    background: (0, tutanota_utils_1.isSameDay)(selectedDate, day) && dates.length > 1 ? theme_1.theme.content_accent : "none",
                    // Browsers which don't support overflow:overlay (looking at you, FF) will shrink the contents of the event grid and it
                    // will shift relative to the header (with indicator). It's noticeable when it's close to borders but it's not as bad
                    // when it's smaller than the grid.
                    width: "50%",
                    // The calendar-long-events-header has a 1px border on the bottom that overlaps this selection indicator
                    // therefore we need to make it +1px thicker so that it looks correct (consistent with the indicator in month view)
                    height: (0, size_1.px)(CalendarView_1.SELECTED_DATE_INDICATOR_THICKNESS + 1),
                    alignSelf: "center"
                }
            }));
        }));
    };
    MultiDayCalendarView.prototype.renderWeekNumberLabel = function (date, startOfTheWeek) {
        // According to ISO 8601, weeks always start on Monday. Week numbering systems for
        // weeks that do not start on Monday are not strictly defined, so we only display
        // a week number if the user's client is configured to start weeks on Monday
        if (startOfTheWeek !== "0" /* WeekStart.MONDAY */) {
            return null;
        }
        return (0, mithril_1["default"])(".ml-m.content-message-bg.small", {
            style: {
                padding: "2px 4px"
            }
        }, LanguageViewModel_1.lang.get("weekNumber_label", {
            "{week}": String((0, CalendarUtils_1.getWeekNumber)(date))
        }));
    };
    /**
     *
     * @returns the rendered calendar bubble children, and the maximum number of events that occur on a day (out of all days)
     */
    MultiDayCalendarView.prototype.renderLongEvents = function (dayRange, events, groupColors, onEventClicked, temporaryEvents) {
        return dayRange.length === 1
            ? {
                children: this.renderLongEventsForSingleDay(dayRange[0], events, groupColors, onEventClicked, temporaryEvents),
                maxEventsInColumn: events.length
            }
            : this.renderLongEventsForMultipleDays(dayRange, events, groupColors, onEventClicked, temporaryEvents);
    };
    /**
     *Only called from day view where header events are not draggable
     */
    MultiDayCalendarView.prototype.renderLongEventsForSingleDay = function (day, events, groupColors, onEventClicked, temporaryEvents) {
        var _this = this;
        var zone = (0, CalendarUtils_1.getTimeZone)();
        return [
            (0, mithril_1["default"])("", events.map(function (event) {
                return _this.renderLongEventBubble(event, (0, CalendarUtils_1.getTimeTextFormatForLongEvent)(event, day, day, zone), (0, CalendarUtils_1.eventStartsBefore)(day, zone, event), (0, CalendarUtils_1.eventEndsAfterDay)(day, zone, event), groupColors, function (_, domEvent) { return onEventClicked(event, domEvent); }, temporaryEvents.includes(event));
            })),
        ];
    };
    MultiDayCalendarView.prototype.renderLongEventsForMultipleDays = function (dayRange, events, groupColors, onEventClicked, temporaryEvents) {
        var _this = this;
        if (this._longEventsDom == null) {
            return {
                children: null,
                maxEventsInColumn: 0
            };
        }
        var dayWidth = this._longEventsDom.offsetWidth / dayRange.length;
        var maxEventsInColumn = 0;
        var firstDay = dayRange[0];
        var lastDay = (0, tutanota_utils_2.lastThrow)(dayRange);
        var zone = (0, CalendarUtils_1.getTimeZone)();
        var children = (0, CalendarUtils_1.layOutEvents)(events, zone, function (columns) {
            maxEventsInColumn = Math.max(maxEventsInColumn, columns.length);
            return columns.map(function (rows, c) {
                return rows.map(function (event) {
                    var isAllDay = (0, CommonCalendarUtils_1.isAllDayEvent)(event);
                    var eventEnd = isAllDay ? (0, tutanota_utils_1.incrementDate)((0, CalendarUtils_1.getEventEnd)(event, zone), -1) : event.endTime;
                    var dayOfStartDate = (0, CalendarUtils_1.getDiffInDays)(firstDay, (0, CalendarUtils_1.getEventStart)(event, zone));
                    var dayOfEndDate = (0, CalendarUtils_1.getDiffInDays)(firstDay, eventEnd);
                    var startsBefore = (0, CalendarUtils_1.eventStartsBefore)(firstDay, zone, event);
                    var endsAfter = (0, CalendarUtils_1.eventEndsAfterDay)(lastDay, zone, event);
                    var left = startsBefore ? 0 : dayOfStartDate * dayWidth;
                    var right = endsAfter ? 0 : (dayRange.length - 1 - dayOfEndDate) * dayWidth;
                    return (0, mithril_1["default"])(".abs", {
                        style: {
                            top: (0, size_1.px)(c * CalendarUtils_1.CALENDAR_EVENT_HEIGHT),
                            left: (0, size_1.px)(left),
                            right: (0, size_1.px)(right)
                        },
                        key: event._id[0] + event._id[1] + event.startTime.getTime(),
                        onmousedown: function () {
                            _this._isHeaderEventBeingDragged = true;
                            _this.startEventDrag(event);
                        }
                    }, _this.renderLongEventBubble(event, isAllDay ? null : "startAndEndTime" /* EventTextTimeOption.START_END_TIME */, startsBefore, endsAfter, groupColors, onEventClicked, temporaryEvents.includes(event)));
                });
            });
        }, true);
        return {
            children: children,
            maxEventsInColumn: maxEventsInColumn
        };
    };
    MultiDayCalendarView.prototype.renderLongEventBubble = function (event, showTime, startsBefore, endsAfter, groupColors, onEventClicked, isTemporary) {
        var fadeIn = !isTemporary;
        var opacity = isTemporary ? CalendarUtils_1.TEMPORARY_EVENT_OPACITY : 1;
        var enablePointerEvents = !this._eventDragHandler.isDragging && !isTemporary;
        return (0, mithril_1["default"])(ContinuingCalendarEventBubble_1.ContinuingCalendarEventBubble, {
            event: event,
            startsBefore: startsBefore,
            endsAfter: endsAfter,
            color: (0, CalendarUtils_1.getEventColor)(event, groupColors),
            onEventClicked: onEventClicked,
            showTime: showTime,
            user: LoginController_1.logins.getUserController().user,
            fadeIn: fadeIn,
            opacity: opacity,
            enablePointerEvents: enablePointerEvents
        });
    };
    MultiDayCalendarView.prototype.renderDayNamesRow = function (days, onDateSelected) {
        var _this = this;
        if (days.length <= 1) {
            return null;
        }
        return (0, mithril_1["default"])(".flex", days.map(function (day) {
            var dayNumberClass = ".calendar-day-indicator.calendar-day-number.clickable.circle" + (_this._getTodayTimestamp() === day.getTime() ? ".accent-bg" : "");
            // the click handler is set on each child individually so as to not make the entire flex container clickable, only the text
            var onclick = function () { return onDateSelected(day, CalendarViewModel_1.CalendarViewType.DAY); };
            return (0, mithril_1["default"])(".flex.center-horizontally.flex-grow.center.b", [
                (0, mithril_1["default"])(".calendar-day-indicator.clickable", {
                    onclick: onclick,
                    style: {
                        "padding-right": "4px"
                    }
                }, LanguageViewModel_1.lang.formats.weekdayShort.format(day) + " "),
                (0, mithril_1["default"])(dayNumberClass, {
                    onclick: onclick,
                    style: {
                        margin: "0"
                    }
                }, day.getDate()),
            ]);
        }));
    };
    MultiDayCalendarView.prototype._endDrag = function () {
        this._isHeaderEventBeingDragged = false;
        if (this._dateUnderMouse) {
            this._eventDragHandler.endDrag(this._dateUnderMouse)["catch"]((0, tutanota_utils_3.ofClass)(UserError_1.UserError, ErrorHandlerImpl_1.showUserError));
        }
    };
    return MultiDayCalendarView;
}());
exports.MultiDayCalendarView = MultiDayCalendarView;
