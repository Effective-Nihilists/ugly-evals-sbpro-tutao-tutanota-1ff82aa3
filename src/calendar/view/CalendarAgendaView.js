"use strict";
exports.__esModule = true;
exports.CalendarAgendaView = void 0;
var mithril_1 = require("mithril");
var CalendarEventBubble_1 = require("./CalendarEventBubble");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var styles_1 = require("../../gui/styles");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var Formatter_1 = require("../../misc/Formatter");
var CalendarUtils_1 = require("../date/CalendarUtils");
var CommonCalendarUtils_1 = require("../../api/common/utils/CommonCalendarUtils");
var tutanota_utils_2 = require("@tutao/tutanota-utils");
var size_1 = require("../../gui/size");
var tutanota_utils_3 = require("@tutao/tutanota-utils");
var LoginController_1 = require("../../api/main/LoginController");
var CalendarAgendaView = /** @class */ (function () {
    function CalendarAgendaView() {
    }
    CalendarAgendaView.prototype.view = function (_a) {
        var attrs = _a.attrs;
        var now = new Date();
        var zone = (0, CalendarUtils_1.getTimeZone)();
        var today = (0, CalendarUtils_1.getStartOfDayWithZone)(now, zone);
        var tomorrow = (0, tutanota_utils_1.incrementDate)(new Date(today), 1);
        var days = getNextFourteenDays(today);
        var lastDay = (0, tutanota_utils_3.lastThrow)(days);
        var title = days[0].getFullYear() === lastDay.getFullYear()
            ? "".concat(LanguageViewModel_1.lang.formats.dateWithWeekday.format(days[0]), " - ").concat(LanguageViewModel_1.lang.formats.dateWithWeekdayAndYear.format(lastDay))
            : "".concat(LanguageViewModel_1.lang.formats.dateWithWeekdayAndYear.format(days[0]), " - ").concat(LanguageViewModel_1.lang.formats.dateWithWeekdayAndYear.format(lastDay));
        var lastDayFormatted = (0, Formatter_1.formatDate)(lastDay);
        return (0, mithril_1["default"])(".fill-absolute.flex.col.mlr-safe-inset", [
            (0, mithril_1["default"])(".mt-s.pr-l", [
                styles_1.styles.isDesktopLayout()
                    ? [
                        (0, mithril_1["default"])("h1.flex.row", {
                            style: {
                                "margin-left": (0, size_1.px)(size_1.size.calendar_hour_width)
                            }
                        }, [LanguageViewModel_1.lang.get("agenda_label"), (0, mithril_1["default"])(".ml-m.no-wrap.overflow-hidden", title)]),
                        (0, mithril_1["default"])("hr.hr.mt-s"),
                    ]
                    : null,
            ]),
            (0, mithril_1["default"])(".scroll.pt-s", days
                .map(function (day) {
                var events = (attrs.eventsForDays.get(day.getTime()) || []).filter(function (e) { return !attrs.hiddenCalendars.has((0, tutanota_utils_2.neverNull)(e._ownerGroup)); });
                if (day === today) {
                    // only show future and currently running events
                    events = events.filter(function (ev) { return (0, CommonCalendarUtils_1.isAllDayEvent)(ev) || now < ev.endTime; });
                }
                else if (day.getTime() > tomorrow.getTime() && events.length === 0) {
                    return null;
                }
                var dateDescription = day.getTime() === today.getTime()
                    ? LanguageViewModel_1.lang.get("today_label")
                    : day.getTime() === tomorrow.getTime()
                        ? LanguageViewModel_1.lang.get("tomorrow_label")
                        : (0, Formatter_1.formatDateWithWeekday)(day);
                return (0, mithril_1["default"])(".flex.mlr-l.calendar-agenda-row.mb-s.col", {
                    key: day.getTime()
                }, [
                    (0, mithril_1["default"])("button.pb-s.b", {
                        onclick: function () { return attrs.onDateSelected(new Date(day)); }
                    }, dateDescription),
                    (0, mithril_1["default"])(".flex-grow", {
                        style: {
                            "max-width": "600px"
                        }
                    }, events.length === 0
                        ? (0, mithril_1["default"])(".mb-s", LanguageViewModel_1.lang.get("noEntries_msg"))
                        : events.map(function (ev) {
                            var startsBefore = (0, CalendarUtils_1.eventStartsBefore)(day, zone, ev);
                            var timeFormat = (0, CalendarUtils_1.getTimeTextFormatForLongEvent)(ev, day, day, zone);
                            var formattedEventTime = timeFormat ? (0, CalendarUtils_1.formatEventTime)(ev, timeFormat) : "";
                            var eventLocation = ev.location ? (formattedEventTime ? ", " : "") + ev.location : "";
                            return (0, mithril_1["default"])(".darker-hover.mb-s", {
                                key: ev._id.toString()
                            }, (0, mithril_1["default"])(CalendarEventBubble_1.CalendarEventBubble, {
                                text: ev.summary,
                                secondLineText: formattedEventTime + eventLocation,
                                color: (0, CalendarUtils_1.getEventColor)(ev, attrs.groupColors),
                                hasAlarm: !startsBefore && (0, CalendarUtils_1.hasAlarmsForTheUser)(LoginController_1.logins.getUserController().user, ev),
                                click: function (domEvent) { return attrs.onEventClicked(ev, domEvent); },
                                height: 38,
                                verticalPadding: 2,
                                fadeIn: true,
                                opacity: 1,
                                enablePointerEvents: true
                            }));
                        })),
                ]);
            })
                .filter(Boolean) // mithril doesn't allow mixing keyed elements with null (for perf reasons it seems)
                .concat((0, mithril_1["default"])(".mlr-l", {
                key: "events_until"
            }, LanguageViewModel_1.lang.get("showingEventsUntil_msg", {
                "{untilDay}": lastDayFormatted
            })))),
        ]);
    };
    return CalendarAgendaView;
}());
exports.CalendarAgendaView = CalendarAgendaView;
function getNextFourteenDays(startOfToday) {
    var calculationDate = new Date(startOfToday);
    var days = [];
    for (var i = 0; i < 14; i++) {
        days.push(new Date(calculationDate.getTime()));
        calculationDate = (0, tutanota_utils_1.incrementDate)(calculationDate, 1);
    }
    return days;
}
