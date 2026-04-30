"use strict";
exports.__esModule = true;
exports.ContinuingCalendarEventBubble = void 0;
var mithril_1 = require("mithril");
var CalendarUtils_1 = require("../date/CalendarUtils");
var CalendarEventBubble_1 = require("./CalendarEventBubble");
var ContinuingCalendarEventBubble = /** @class */ (function () {
    function ContinuingCalendarEventBubble() {
    }
    ContinuingCalendarEventBubble.prototype.view = function (_a) {
        var attrs = _a.attrs;
        return (0, mithril_1["default"])(".flex.calendar-event-container.darker-hover", [
            attrs.startsBefore
                ? (0, mithril_1["default"])(".event-continues-right-arrow", {
                    style: {
                        "border-left-color": "transparent",
                        "border-top-color": "#" + attrs.color,
                        "border-bottom-color": "#" + attrs.color,
                        opacity: attrs.opacity
                    }
                })
                : null,
            (0, mithril_1["default"])(".flex-grow.overflow-hidden", (0, mithril_1["default"])(CalendarEventBubble_1.CalendarEventBubble, {
                text: (attrs.showTime != null ? (0, CalendarUtils_1.formatEventTime)(attrs.event, attrs.showTime) + " " : "") + attrs.event.summary,
                color: attrs.color,
                click: function (e) { return attrs.onEventClicked(attrs.event, e); },
                noBorderLeft: attrs.startsBefore,
                noBorderRight: attrs.endsAfter,
                hasAlarm: (0, CalendarUtils_1.hasAlarmsForTheUser)(attrs.user, attrs.event),
                fadeIn: attrs.fadeIn,
                opacity: attrs.opacity,
                enablePointerEvents: attrs.enablePointerEvents
            })),
            attrs.endsAfter
                ? (0, mithril_1["default"])(".event-continues-right-arrow", {
                    style: {
                        "border-left-color": "#" + attrs.color,
                        opacity: attrs.opacity
                    }
                })
                : null,
        ]);
    };
    return ContinuingCalendarEventBubble;
}());
exports.ContinuingCalendarEventBubble = ContinuingCalendarEventBubble;
