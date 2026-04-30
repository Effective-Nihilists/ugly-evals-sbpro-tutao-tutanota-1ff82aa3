"use strict";
exports.__esModule = true;
exports.VisualDatePicker = exports.DatePicker = void 0;
var mithril_1 = require("mithril");
var ClientDetector_1 = require("../../misc/ClientDetector");
var Formatter_1 = require("../../misc/Formatter");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var size_1 = require("../size");
var theme_1 = require("../theme");
var Icon_1 = require("../base/Icon");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var luxon_1 = require("luxon");
var CommonCalendarUtils_1 = require("../../api/common/utils/CommonCalendarUtils");
var TextField_js_1 = require("../base/TextField.js");
var TutanotaConstants_1 = require("../../api/common/TutanotaConstants");
var CalendarUtils_1 = require("../../calendar/date/CalendarUtils");
var DateParser_1 = require("../../misc/DateParser");
/**
 * Date picker component. Looks like a text field until interacted. On mobile it will be native browser picker, on desktop a {@class VisualDatePicker}.
 *
 * The HTML input[type=date] is not usable on desktops because:
 * * it always displays a placeholder (mm/dd/yyyy) and several buttons and
 * * the picker can't be opened programmatically and
 * * the date format is based on the operating systems locale and not on the one set in the browser (and used by us)
 *
 * That is why we only use the picker on mobile devices. They provide native picker components
 * and allow opening the picker by forwarding the click event to the input.
 */
var DatePicker = /** @class */ (function () {
    function DatePicker(_a) {
        var attrs = _a.attrs;
        this.inputText = "";
        this.showingDropdown = false;
        this.domInput = null;
        this.documentClickListener = null;
        this.textFieldHasFocus = false;
        var initDate = attrs.date;
        if (initDate) {
            this.inputText = (0, Formatter_1.formatDate)(initDate);
        }
        else {
            this.inputText = (0, Formatter_1.formatDate)(new Date());
        }
    }
    DatePicker.prototype.view = function (_a) {
        var attrs = _a.attrs;
        var date = attrs.date;
        // If the user is interacting with the textfield, then we want the textfield to accept their input, so never override the text
        // Otherwise, we want to it to reflect whatever date has been passed in, because it may have been changed programmatically
        if (!this.textFieldHasFocus) {
            this.inputText = (0, Formatter_1.formatDate)(date);
        }
        return (0, mithril_1["default"])(".rel", [
            this.renderTextField(attrs),
            this.showingDropdown ? this.renderDropdown(attrs) : null,
            // For mobile devices we render a native date picker, it's easier to use and more accessible.
            // We render invisible input which opens native picker on interaction.
            ClientDetector_1.client.isMobileDevice() ? this.renderMobileDateInput(attrs) : null,
        ]);
    };
    DatePicker.prototype.renderTextField = function (_a) {
        var _this = this;
        var date = _a.date, onDateSelected = _a.onDateSelected, label = _a.label, nullSelectionText = _a.nullSelectionText, disabled = _a.disabled;
        return (0, mithril_1["default"])("", {
            onclick: function () {
                if (!disabled) {
                    _this.showingDropdown = true;
                }
            }
        }, (0, mithril_1["default"])(TextField_js_1.TextField, {
            value: this.inputText,
            label: label,
            helpLabel: function () { return _this.renderHelpLabel(date, nullSelectionText !== null && nullSelectionText !== void 0 ? nullSelectionText : null); },
            disabled: disabled,
            oninput: function (text) { return _this.handleInput(text, onDateSelected); },
            onfocus: function () {
                _this.showingDropdown = true;
                _this.textFieldHasFocus = true;
            },
            onblur: function () {
                _this.textFieldHasFocus = false;
            },
            oncreate: function (vnode) {
                _this.domInput = vnode.dom;
            },
            keyHandler: function (key) {
                if (key.keyCode === TutanotaConstants_1.Keys.TAB.code) {
                    _this.showingDropdown = false;
                }
                return true;
            }
        }));
    };
    DatePicker.prototype.renderHelpLabel = function (date, nullSelectionText) {
        if (this.showingDropdown) {
            return null;
        }
        else if (date != null) {
            return (0, Formatter_1.formatDateWithWeekdayAndYear)(date);
        }
        else {
            return LanguageViewModel_1.lang.getMaybeLazy(nullSelectionText !== null && nullSelectionText !== void 0 ? nullSelectionText : "emptyString_msg");
        }
    };
    DatePicker.prototype.renderDropdown = function (_a) {
        var _this = this;
        var date = _a.date, onDateSelected = _a.onDateSelected, startOfTheWeekOffset = _a.startOfTheWeekOffset, rightAlignDropdown = _a.rightAlignDropdown;
        return (0, mithril_1["default"])(".fixed.content-bg.z3.menu-shadow.plr.pb-s", {
            style: {
                width: "280px",
                right: rightAlignDropdown ? "0" : null
            },
            onblur: function () { return (_this.showingDropdown = false); },
            oncreate: function (vnode) {
                var listener = function (e) {
                    if (!vnode.dom.contains(e.target)) {
                        _this.showingDropdown = false;
                        mithril_1["default"].redraw();
                    }
                };
                _this.documentClickListener = listener;
                document.addEventListener("click", listener, true);
            },
            onremove: function (vnode) {
                if (_this.documentClickListener) {
                    document.removeEventListener("click", _this.documentClickListener, true);
                }
            }
        }, (0, mithril_1["default"])(VisualDatePicker, {
            selectedDate: date,
            onDateSelected: function (newDate, dayClick) {
                _this.handleSelectedDate(newDate, onDateSelected);
                if (dayClick) {
                    // Do not close dropdown on changing a month
                    _this.showingDropdown = false;
                }
            },
            wide: false,
            startOfTheWeekOffset: startOfTheWeekOffset
        }));
    };
    DatePicker.prototype.renderMobileDateInput = function (_a) {
        var _this = this;
        var date = _a.date, onDateSelected = _a.onDateSelected;
        return (0, mithril_1["default"])("input.fill-absolute", {
            type: "date",
            style: {
                opacity: 0,
                // This overrides platform-specific width setting, we want to cover the whole field
                minWidth: "100%",
                minHeight: "100%"
            },
            // Format as ISO date format (YYYY-MM-dd). We use luxon for that because JS Date only supports full format with time.
            value: date != null ? luxon_1.DateTime.fromJSDate(date).toISODate() : "",
            oninput: function (event) {
                // valueAsDate is always 00:00 UTC
                // https://www.w3.org/TR/html52/sec-forms.html#date-state-typedate
                var htmlDate = event.target.valueAsDate;
                // It can be null if user clicks "clear". Ignore it.
                if (htmlDate != null) {
                    _this.handleSelectedDate((0, CommonCalendarUtils_1.getAllDayDateLocal)(htmlDate), onDateSelected);
                }
            }
        });
    };
    DatePicker.prototype.handleInput = function (text, onDateSelected) {
        this.inputText = text;
        var trimmedValue = text.trim();
        if (trimmedValue !== "") {
            try {
                var parsedDate = (0, DateParser_1.parseDate)(trimmedValue);
                onDateSelected(parsedDate);
            }
            catch (e) {
                // Parsing failed so the user is probably typing
            }
        }
    };
    DatePicker.prototype.handleSelectedDate = function (date, onDateSelected) {
        this.inputText = (0, Formatter_1.formatDate)(date);
        onDateSelected(date);
    };
    return DatePicker;
}());
exports.DatePicker = DatePicker;
/** Date picker used on desktop. Displays a month and ability to select a month. */
var VisualDatePicker = /** @class */ (function () {
    function VisualDatePicker(vnode) {
        this.lastSelectedDate = null;
        this.displayingDate = vnode.attrs.selectedDate || (0, tutanota_utils_1.getStartOfDay)(new Date());
    }
    VisualDatePicker.prototype.view = function (vnode) {
        var _this = this;
        var selectedDate = vnode.attrs.selectedDate;
        if (selectedDate && !(0, tutanota_utils_1.isSameDayOfDate)(this.lastSelectedDate, selectedDate)) {
            this.lastSelectedDate = selectedDate;
            this.displayingDate = new Date(selectedDate);
            this.displayingDate.setDate(1);
        }
        var date = new Date(this.displayingDate);
        var _a = (0, CalendarUtils_1.getCalendarMonth)(this.displayingDate, vnode.attrs.startOfTheWeekOffset, true), weeks = _a.weeks, weekdays = _a.weekdays;
        return (0, mithril_1["default"])(".flex.flex-column", [
            (0, mithril_1["default"])(".flex.flex-space-between.pt-s.pb-s.items-center", [
                this.renderSwitchMonthArrowIcon(false, vnode.attrs),
                (0, mithril_1["default"])(".b", {
                    style: {
                        fontSize: (0, size_1.px)(14)
                    }
                }, (0, Formatter_1.formatMonthWithFullYear)(date)),
                this.renderSwitchMonthArrowIcon(true, vnode.attrs),
            ]),
            (0, mithril_1["default"])(".flex.flex-space-between", this.renderWeekDays(vnode.attrs.wide, weekdays)),
            (0, mithril_1["default"])(".flex.flex-column.flex-space-around", {
                style: {
                    fontSize: (0, size_1.px)(14),
                    lineHeight: (0, size_1.px)(this.getElementWidth(vnode.attrs))
                }
            }, weeks.map(function (w) { return _this.renderWeek(w, vnode.attrs); })),
        ]);
    };
    VisualDatePicker.prototype.renderSwitchMonthArrowIcon = function (forward, attrs) {
        var _this = this;
        var size = (0, size_1.px)(this.getElementWidth(attrs));
        return (0, mithril_1["default"])(".icon.flex.justify-center.items-center.click", {
            onclick: forward ? function () { return _this.onNextMonthSelected(); } : function () { return _this.onPrevMonthSelected(); },
            style: {
                fill: theme_1.theme.content_fg,
                width: size,
                height: size
            }
        }, (0, mithril_1["default"])(Icon_1.Icon, {
            icon: forward ? "ArrowForward" /* Icons.ArrowForward */ : "Back" /* BootIcons.Back */,
            style: {
                fill: theme_1.theme.content_fg
            }
        }));
    };
    VisualDatePicker.prototype.onPrevMonthSelected = function () {
        this.displayingDate.setMonth(this.displayingDate.getMonth() - 1);
    };
    VisualDatePicker.prototype.onNextMonthSelected = function () {
        this.displayingDate.setMonth(this.displayingDate.getMonth() + 1);
    };
    VisualDatePicker.prototype.renderDay = function (_a, attrs) {
        var date = _a.date, day = _a.day, paddingDay = _a.paddingDay;
        var size = (0, size_1.px)(this.getElementWidth(attrs));
        return (0, mithril_1["default"])(".center.click" + (paddingDay ? "" : (0, CalendarUtils_1.getDateIndicator)(date, attrs.selectedDate)), {
            style: {
                height: size,
                width: size
            },
            onclick: !paddingDay &&
                (function () {
                    attrs.onDateSelected && attrs.onDateSelected(date, true);
                })
        }, paddingDay ? null : day);
    };
    VisualDatePicker.prototype.getElementWidth = function (attrs) {
        return attrs.wide ? 40 : 24;
    };
    VisualDatePicker.prototype.renderWeek = function (week, attrs) {
        var _this = this;
        return (0, mithril_1["default"])(".flex.flex-space-between", week.map(function (d) { return _this.renderDay(d, attrs); }));
    };
    VisualDatePicker.prototype.renderWeekDays = function (wide, weekdays) {
        var size = (0, size_1.px)(wide ? 40 : 24);
        var fontSize = (0, size_1.px)(14);
        return weekdays.map(function (wd) {
            return (0, mithril_1["default"])(".center", {
                style: {
                    fontSize: fontSize,
                    height: size,
                    width: size,
                    lineHeight: size,
                    color: theme_1.theme.content_border
                }
            }, wd);
        });
    };
    return VisualDatePicker;
}());
exports.VisualDatePicker = VisualDatePicker;
