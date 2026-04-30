"use strict";
exports.__esModule = true;
exports.CalendarEventBubble = void 0;
var mithril_1 = require("mithril");
var CalendarUtils_1 = require("../date/CalendarUtils");
var size_1 = require("../../gui/size");
var Icon_1 = require("../../gui/base/Icon");
var lineHeight = size_1.size.calendar_line_height;
var lineHeightPx = (0, size_1.px)(lineHeight);
var CalendarEventBubble = /** @class */ (function () {
    function CalendarEventBubble() {
        this._hasFinishedInitialRender = false;
    }
    CalendarEventBubble.prototype.oncreate = function (vnode) {
        this._hasFinishedInitialRender = true;
    };
    CalendarEventBubble.prototype.view = function (_a) {
        var attrs = _a.attrs;
        // This helps us stop flickering in certain cases where we want to disable and re-enable fade in (ie. when dragging events)
        // Reapplying the animation to the element will cause it to trigger instantly, so we don't want to do that
        var doFadeIn = !this._hasFinishedInitialRender && attrs.fadeIn;
        var enablePointerEvents = attrs.enablePointerEvents;
        return (0, mithril_1["default"])(".calendar-event.small.overflow-hidden.flex.cursor-pointer" +
            (doFadeIn ? ".fade-in" : "") +
            (attrs.noBorderLeft ? ".event-continues-left" : "") +
            (attrs.noBorderRight ? ".event-continues-right" : ""), {
            style: {
                background: "#" + attrs.color,
                color: (0, CalendarUtils_1.colorForBg)("#" + attrs.color),
                minHeight: lineHeightPx,
                height: (0, size_1.px)(attrs.height ? Math.max(attrs.height, 0) : lineHeight),
                "padding-top": (0, size_1.px)(attrs.verticalPadding || 0),
                opacity: attrs.opacity,
                pointerEvents: enablePointerEvents ? "auto" : "none"
            },
            onclick: function (e) {
                e.stopPropagation();
                attrs.click(e, e.target);
            }
        }, [
            attrs.hasAlarm
                ? (0, mithril_1["default"])(Icon_1.Icon, {
                    icon: "Notifications" /* Icons.Notifications */,
                    style: {
                        fill: (0, CalendarUtils_1.colorForBg)("#" + attrs.color),
                        "padding-top": "2px",
                        "padding-right": "2px"
                    },
                    "class": "icon-small"
                })
                : null,
            (0, mithril_1["default"])(".flex.col", {
                style: {
                    // Limit the width to trigger ellipsis
                    width: "95%"
                }
            }, this.renderContent(attrs)),
        ]);
    };
    CalendarEventBubble.prototype.renderContent = function (_a) {
        var maybeHeight = _a.height, text = _a.text, secondLineText = _a.secondLineText, color = _a.color;
        // If the bubble has 2 or more lines worth of vertical space, then we will render the text + the secondLineText on separate lines
        // Otherwise we will combine them onto a single line
        var height = maybeHeight !== null && maybeHeight !== void 0 ? maybeHeight : lineHeight;
        var isMultiline = height >= lineHeight * 2;
        if (isMultiline) {
            // How many lines of text that will fit in the bubble
            // we dont want any cut in half lines in case the bubble cannot fit a whole number of lines
            var linesInBubble = Math.floor(height / lineHeight);
            // leave space for the second text line. it will be restricted to a maximum of one line in height
            var topSectionMaxLines = secondLineText != null ? linesInBubble - 1 : linesInBubble;
            var topSectionClass = topSectionMaxLines === 1 ? ".text-ellipsis" : ".text-overflow";
            return [
                this.renderTextSection(topSectionClass, text, topSectionMaxLines * lineHeight),
                secondLineText ? this.renderTextSection(".text-ellipsis", secondLineText, lineHeight) : null,
            ];
        }
        else {
            return this.renderTextSection(".text-ellipsis", secondLineText
                ? [
                    "".concat(text, " "),
                    (0, mithril_1["default"])(Icon_1.Icon, {
                        icon: "Time" /* Icons.Time */,
                        style: {
                            fill: (0, CalendarUtils_1.colorForBg)("#" + color),
                            "padding-top": "2px",
                            "padding-right": "2px",
                            "vertical-align": "text-top"
                        },
                        "class": "icon-small"
                    }),
                    "".concat(secondLineText),
                ]
                : text, lineHeight);
        }
    };
    CalendarEventBubble.prototype.renderTextSection = function (classes, text, maxHeight) {
        return (0, mithril_1["default"])(classes, {
            style: {
                lineHeight: lineHeightPx,
                maxHeight: (0, size_1.px)(maxHeight)
            }
        }, text);
    };
    return CalendarEventBubble;
}());
exports.CalendarEventBubble = CalendarEventBubble;
