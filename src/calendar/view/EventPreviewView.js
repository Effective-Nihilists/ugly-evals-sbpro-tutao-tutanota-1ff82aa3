"use strict";
exports.__esModule = true;
exports.EventPreviewView = void 0;
var mithril_1 = require("mithril");
var Icon_1 = require("../../gui/base/Icon");
var theme_1 = require("../../gui/theme");
var CalendarEventEditDialog_1 = require("./CalendarEventEditDialog");
var CalendarUtils_1 = require("../date/CalendarUtils");
var TutanotaConstants_1 = require("../../api/common/TutanotaConstants");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var CommonCalendarUtils_1 = require("../../api/common/utils/CommonCalendarUtils");
var Formatter_1 = require("../../misc/Formatter");
var ErrorCheckUtils_1 = require("../../api/common/utils/ErrorCheckUtils");
var TypeRefs_js_1 = require("../../api/entities/tutanota/TypeRefs.js");
var TypeRefs_js_2 = require("../../api/entities/tutanota/TypeRefs.js");
var EventPreviewView = /** @class */ (function () {
    function EventPreviewView() {
        this._getLocationUrl = (0, tutanota_utils_1.memoized)(getLocationUrl);
    }
    EventPreviewView.prototype.view = function (_a) {
        var _this = this;
        var _b = _a.attrs, event = _b.event, sanitizedDescription = _b.sanitizedDescription;
        var url = this._getLocationUrl(event.location.trim());
        // We copy the attendees array so that we can add the organizer, in the case that they are not already in attendees
        // This is just for display purposes. We need to copy because event.attendees is the source of truth for the event
        // so we can't modify it
        var attendees = event.attendees.slice();
        var organizer = event.organizer;
        if (organizer != null && attendees.length > 0 && !attendees.some(function (attendee) { return attendee.address.address === organizer.address; })) {
            attendees.unshift((0, TypeRefs_js_2.createCalendarEventAttendee)({
                address: (0, TypeRefs_js_1.createEncryptedMailAddress)({
                    address: organizer.address
                }),
                status: TutanotaConstants_1.CalendarAttendeeStatus.ADDED
            }));
        }
        return (0, mithril_1["default"])(".flex.col", [
            (0, mithril_1["default"])(".flex.col.smaller", [
                (0, mithril_1["default"])(".flex.pb-s.items-center", [this._renderSectionIndicator("Calendar" /* BootIcons.Calendar */), (0, mithril_1["default"])(".h3.selectable.text-break", event.summary)]),
                (0, mithril_1["default"])(".flex.pb-s", [
                    this._renderSectionIndicator("Time" /* Icons.Time */),
                    (0, mithril_1["default"])(".align-self-center.selectable.flex-column", [(0, mithril_1["default"])("", (0, CalendarUtils_1.formatEventDuration)(event, (0, CalendarUtils_1.getTimeZone)(), false)), this._renderRepeatRule(event)]),
                ]),
                event.location
                    ? (0, mithril_1["default"])(".flex.pb-s.items-center", [
                        this._renderSectionIndicator("Pin" /* Icons.Pin */),
                        (0, mithril_1["default"])(".text-ellipsis.selectable", (0, mithril_1["default"])("a", {
                            href: url.toString(),
                            target: "_blank",
                            rel: "noopener noreferrer"
                        }, event.location)),
                    ])
                    : null,
                attendees.length !== 0
                    ? (0, mithril_1["default"])(".flex.pb-s", [
                        this._renderSectionIndicator("Contacts" /* BootIcons.Contacts */),
                        (0, mithril_1["default"])(".flex-wrap", attendees.map(function (a) { return _this._renderAttendee(a); })),
                    ])
                    : null,
                !!event.description
                    ? (0, mithril_1["default"])(".flex.pb-s.items-start", [
                        this._renderSectionIndicator("AlignLeft" /* Icons.AlignLeft */, {
                            marginTop: "2px"
                        }),
                        (0, mithril_1["default"])(".full-width.selectable.text-break", mithril_1["default"].trust(sanitizedDescription)),
                    ])
                    : null,
            ]),
        ]);
    };
    EventPreviewView.prototype._renderRepeatRule = function (event) {
        var repeatRule = event.repeatRule;
        if (repeatRule) {
            var frequency = formatRepetitionFrequency(repeatRule);
            if (frequency) {
                return (0, mithril_1["default"])("", frequency + formatRepetitionEnd(repeatRule, (0, CommonCalendarUtils_1.isAllDayEvent)(event)));
            }
            else {
                // If we cannot properly process the frequency we just indicate that the event is part of a series.
                return (0, mithril_1["default"])("", LanguageViewModel_1.lang.get("unknownRepetition_msg"));
            }
        }
        return null;
    };
    EventPreviewView.prototype._renderAttendee = function (attendee) {
        var attendeeField = attendee.address.address;
        if ((0, ErrorCheckUtils_1.hasError)(attendee.address)) {
            attendeeField = LanguageViewModel_1.lang.get("corruptedValue_msg");
        }
        return (0, mithril_1["default"])(".flex.items-center", [
            (0, mithril_1["default"])(Icon_1.Icon, {
                icon: CalendarEventEditDialog_1.iconForAttendeeStatus[(0, TutanotaConstants_1.getAttendeeStatus)(attendee)],
                style: {
                    fill: theme_1.theme.content_fg
                },
                "class": "mr-s"
            }),
            (0, mithril_1["default"])(".span.line-break-anywhere.selectable", attendeeField),
        ]);
    };
    EventPreviewView.prototype._renderSectionIndicator = function (icon, style) {
        if (style === void 0) { style = {}; }
        return (0, mithril_1["default"])(".pr", (0, mithril_1["default"])(Icon_1.Icon, {
            icon: icon,
            large: true,
            style: Object.assign({
                fill: theme_1.theme.content_button,
                display: "block"
            }, style)
        }));
    };
    return EventPreviewView;
}());
exports.EventPreviewView = EventPreviewView;
/**
 * if text is a valid absoule url, then returns a URL with text as the href
 * otherwise passes text as the search parameter for open street map
 * @param text
 * @returns {*}
 */
function getLocationUrl(text) {
    var osmHref = "https://www.openstreetmap.org/search?query=".concat(text);
    var url;
    try {
        // if not a valid _absolute_ url then we get an exception
        url = new URL(text);
    }
    catch (_a) {
        url = new URL(osmHref);
    }
    return url;
}
function formatRepetitionFrequency(repeatRule) {
    if (repeatRule.interval === "1") {
        var frequency = (0, CalendarUtils_1.createRepeatRuleFrequencyValues)().find(function (frequency) { return frequency.value === repeatRule.frequency; });
        if (frequency) {
            return frequency.name;
        }
    }
    else {
        return LanguageViewModel_1.lang.get("repetition_msg", {
            "{interval}": repeatRule.interval,
            "{timeUnit}": getFrequencyTimeUnit((0, tutanota_utils_1.downcast)(repeatRule.frequency))
        });
    }
    return null;
}
/**
 * @returns {string} The returned string includes a leading separator (", " or " ").
 */
function formatRepetitionEnd(repeatRule, isAllDay) {
    switch (repeatRule.endType) {
        case "1" /* EndType.Count */:
            if (!repeatRule.endValue) {
                return "";
            }
            return (", " +
                LanguageViewModel_1.lang.get("times_msg", {
                    "{amount}": repeatRule.endValue
                }));
        case "2" /* EndType.UntilDate */:
            var repeatEndTime = (0, CalendarUtils_1.getRepeatEndTime)(repeatRule, isAllDay, (0, CalendarUtils_1.getTimeZone)());
            return " " + LanguageViewModel_1.lang.get("until_label") + " " + (0, Formatter_1.formatDateWithMonth)(repeatEndTime);
        default:
            return "";
    }
}
function getFrequencyTimeUnit(frequency) {
    switch (frequency) {
        case TutanotaConstants_1.RepeatPeriod.DAILY:
            return LanguageViewModel_1.lang.get("days_label");
        case TutanotaConstants_1.RepeatPeriod.WEEKLY:
            return LanguageViewModel_1.lang.get("weeks_label");
        case TutanotaConstants_1.RepeatPeriod.MONTHLY:
            return LanguageViewModel_1.lang.get("months_label");
        case TutanotaConstants_1.RepeatPeriod.ANNUALLY:
            return LanguageViewModel_1.lang.get("years_label");
        default:
            throw new Error("Unknown calendar event repeat rule frequency: " + frequency);
    }
}
