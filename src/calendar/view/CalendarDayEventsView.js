"use strict";
exports.__esModule = true;
exports.CalendarDayEventsView = exports.calendarDayTimes = void 0;
var mithril_1 = require("mithril");
var theme_1 = require("../../gui/theme");
var size_1 = require("../../gui/size");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var tutanota_utils_2 = require("@tutao/tutanota-utils");
var CalendarUtils_1 = require("../date/CalendarUtils");
var CalendarEventBubble_1 = require("./CalendarEventBubble");
var tutanota_utils_3 = require("@tutao/tutanota-utils");
var LoginController_1 = require("../../api/main/LoginController");
var Time_1 = require("../../api/common/utils/Time");
var GuiUtils_1 = require("../../gui/base/GuiUtils");
var CalendarGuiUtils_1 = require("./CalendarGuiUtils");
var styles_1 = require("../../gui/styles");
exports.calendarDayTimes = (0, tutanota_utils_2.numberRange)(0, 23).map(function (number) { return new Time_1.Time(number, 0); });
var allHoursHeight = size_1.size.calendar_hour_height * exports.calendarDayTimes.length;
var CalendarDayEventsView = /** @class */ (function () {
    function CalendarDayEventsView() {
        this._dayDom = null;
    }
    CalendarDayEventsView.prototype.view = function (_a) {
        var _this = this;
        var attrs = _a.attrs;
        return (0, mithril_1["default"])(".col.rel", {
            oncreate: function (vnode) {
                _this._dayDom = vnode.dom;
                mithril_1["default"].redraw();
            },
            onmousemove: function (mouseEvent) {
                (0, tutanota_utils_3.downcast)(mouseEvent).redraw = false;
                var time = (0, CalendarGuiUtils_1.getTimeFromMousePos)((0, GuiUtils_1.getPosAndBoundsFromMouseEvent)(mouseEvent), 4);
                attrs.setTimeUnderMouse(time);
            }
        }, [
            exports.calendarDayTimes.map(function (time) {
                return (0, mithril_1["default"])(".calendar-hour.flex.cursor-pointer", {
                    onclick: function (e) {
                        e.stopPropagation();
                        attrs.onTimePressed(time.hours, time.minutes);
                    },
                    oncontextmenu: function (e) {
                        attrs.onTimeContextPressed(time.hours, time.minutes);
                        e.preventDefault();
                    }
                });
            }),
            this._dayDom ? this._renderEvents(attrs, attrs.events) : null,
            this._renderTimeIndicator(attrs),
        ]);
    };
    CalendarDayEventsView.prototype._renderTimeIndicator = function (attrs) {
        var now = new Date();
        if (!attrs.displayTimeIndicator) {
            return null;
        }
        var top = getTimeIndicatorPosition(now);
        return [
            (0, mithril_1["default"])(".abs", {
                "aria-hidden": "true",
                style: {
                    top: (0, size_1.px)(top),
                    left: 0,
                    right: 0,
                    height: "2px",
                    background: theme_1.theme.content_accent
                }
            }),
            (0, mithril_1["default"])(".abs", {
                "aria-hidden": "true",
                style: {
                    top: (0, size_1.px)(top),
                    left: 0,
                    height: "12px",
                    width: "12px",
                    "border-radius": "50%",
                    background: theme_1.theme.content_accent,
                    "margin-top": "-5px",
                    "margin-left": "-7px"
                }
            }),
        ];
    };
    CalendarDayEventsView.prototype._renderEvents = function (attrs, events) {
        var _this = this;
        return (0, CalendarUtils_1.layOutEvents)(events, (0, CalendarUtils_1.getTimeZone)(), function (columns) { return _this._renderColumns(attrs, columns); }, false);
    };
    CalendarDayEventsView.prototype._renderEvent = function (attrs, ev, columnIndex, columns, columnWidth) {
        // If an event starts in the previous day or ends in the next, we want to clamp top/height to fit within just this day
        var zone = (0, CalendarUtils_1.getTimeZone)();
        var startOfEvent = (0, CalendarUtils_1.eventStartsBefore)(attrs.day, zone, ev) ? (0, tutanota_utils_1.getStartOfDay)(attrs.day) : ev.startTime;
        var endOfEvent = (0, CalendarUtils_1.eventEndsAfterDay)(attrs.day, zone, ev) ? (0, tutanota_utils_1.getEndOfDay)(attrs.day) : ev.endTime;
        var startTime = (startOfEvent.getHours() * 60 + startOfEvent.getMinutes()) * 60 * 1000;
        var height = ((endOfEvent.getTime() - startOfEvent.getTime()) / (1000 * 60 * 60)) * size_1.size.calendar_hour_height;
        var fullViewWidth = attrs.fullViewWidth;
        var maxWidth = fullViewWidth != null ? (0, size_1.px)(styles_1.styles.isDesktopLayout() ? fullViewWidth / 2 : fullViewWidth) : "none";
        var colSpan = (0, CalendarUtils_1.expandEvent)(ev, columnIndex, columns);
        var padding = 2;
        return (0, mithril_1["default"])(".abs.darker-hover", {
            style: {
                maxWidth: maxWidth,
                left: (0, size_1.px)(columnWidth * columnIndex),
                width: (0, size_1.px)(columnWidth * colSpan),
                top: (0, size_1.px)((startTime / tutanota_utils_1.DAY_IN_MILLIS) * allHoursHeight),
                height: (0, size_1.px)(height)
            },
            onmousedown: function () {
                if (!attrs.isTemporaryEvent(ev)) {
                    attrs.setCurrentDraggedEvent(ev);
                }
            }
        }, (0, mithril_1["default"])(CalendarEventBubble_1.CalendarEventBubble, {
            text: ev.summary,
            secondLineText: (0, tutanota_utils_3.mapNullable)((0, CalendarUtils_1.getTimeTextFormatForLongEvent)(ev, attrs.day, attrs.day, zone), function (option) { return (0, CalendarUtils_1.formatEventTime)(ev, option); }),
            color: (0, CalendarUtils_1.getEventColor)(ev, attrs.groupColors),
            click: function (domEvent) { return attrs.onEventClicked(ev, domEvent); },
            height: height - padding,
            hasAlarm: (0, CalendarUtils_1.hasAlarmsForTheUser)(LoginController_1.logins.getUserController().user, ev),
            verticalPadding: padding,
            fadeIn: !attrs.isTemporaryEvent(ev),
            opacity: attrs.isTemporaryEvent(ev) ? CalendarUtils_1.TEMPORARY_EVENT_OPACITY : 1,
            enablePointerEvents: !attrs.isTemporaryEvent(ev) && !attrs.isDragging
        }));
    };
    CalendarDayEventsView.prototype._renderColumns = function (attrs, columns) {
        var _this = this;
        var columnWidth = (0, tutanota_utils_3.neverNull)(this._dayDom).clientWidth / columns.length;
        return columns.map(function (column, index) {
            return column.map(function (event) {
                return _this._renderEvent(attrs, event, index, columns, Math.floor(columnWidth));
            });
        });
    };
    return CalendarDayEventsView;
}());
exports.CalendarDayEventsView = CalendarDayEventsView;
function getTimeIndicatorPosition(now) {
    var passedMillisInDay = (now.getHours() * 60 + now.getMinutes()) * 60 * 1000;
    return (passedMillisInDay / tutanota_utils_1.DAY_IN_MILLIS) * allHoursHeight;
}
