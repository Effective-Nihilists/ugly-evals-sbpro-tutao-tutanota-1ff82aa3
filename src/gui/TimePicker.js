"use strict";
exports.__esModule = true;
exports.TimePicker = void 0;
var mithril_1 = require("mithril");
var TextField_js_1 = require("./base/TextField.js");
var theme_1 = require("./theme");
var ClientDetector_1 = require("../misc/ClientDetector");
var TutanotaConstants_1 = require("../api/common/TutanotaConstants");
var Formatter_1 = require("../misc/Formatter");
var TimeParser_1 = require("../misc/parsing/TimeParser");
var TimePicker = /** @class */ (function () {
    function TimePicker(_a) {
        var attrs = _a.attrs;
        this._focused = false;
        this._value = "";
        var times = [];
        for (var hour = 0; hour < 24; hour++) {
            for (var minute = 0; minute < 60; minute += 30) {
                times.push((0, Formatter_1.timeStringFromParts)(hour, minute, attrs.amPmFormat));
            }
        }
        this._values = times;
    }
    TimePicker.prototype.view = function (_a) {
        var _b, _c;
        var attrs = _a.attrs;
        if (attrs.time) {
            var timeAsString = (_c = (_b = attrs.time) === null || _b === void 0 ? void 0 : _b.toString(attrs.amPmFormat)) !== null && _c !== void 0 ? _c : "";
            this._selectedIndex = this._values.indexOf(timeAsString);
            if (!this._focused) {
                this._value = timeAsString;
            }
        }
        if (ClientDetector_1.client.isMobileDevice()) {
            return this._renderNativeTimePicker(attrs);
        }
        else {
            return this._renderCustomTimePicker(attrs);
        }
    };
    TimePicker.prototype._renderNativeTimePicker = function (attrs) {
        var _this = this;
        var _a, _b, _c;
        if (this._oldValue !== ((_a = attrs.time) === null || _a === void 0 ? void 0 : _a.toString(false))) {
            this._onSelected(attrs);
        }
        // input[type=time] wants time in 24h format, no matter what is actually displayed. Otherwise it will be empty.
        var timeAsString = (_c = (_b = attrs.time) === null || _b === void 0 ? void 0 : _b.toString(false)) !== null && _c !== void 0 ? _c : "";
        this._oldValue = timeAsString;
        this._value = timeAsString;
        return (0, mithril_1["default"])(TextField_js_1.TextField, {
            label: "emptyString_msg",
            value: this._value,
            type: "time" /* TextFieldType.Time */,
            oninput: function (value) {
                _this._value = value;
                attrs.onTimeSelected((0, TimeParser_1.parseTime)(value));
            },
            disabled: attrs.disabled
        });
    };
    TimePicker.prototype._renderCustomTimePicker = function (attrs) {
        return [this._renderInputField(attrs), this._focused ? this._renderTimeSelector(attrs) : null];
    };
    TimePicker.prototype._renderInputField = function (attrs) {
        var _this = this;
        return (0, mithril_1["default"])(TextField_js_1.TextField, {
            label: "emptyString_msg",
            value: this._value,
            oninput: function (v) { return _this._value = v; },
            disabled: attrs.disabled,
            onfocus: function (dom, input) {
                _this._focused = true;
                input.select();
            },
            onblur: function (e) {
                if (_this._focused) {
                    _this._onSelected(attrs);
                }
                e.redraw = false;
            },
            keyHandler: function (key) {
                if (key.keyCode === TutanotaConstants_1.Keys.RETURN.code) {
                    _this._onSelected(attrs);
                    var active = document.activeElement;
                    active === null || active === void 0 ? void 0 : active.blur();
                }
                return true;
            }
        });
    };
    TimePicker.prototype._renderTimeSelector = function (attrs) {
        var _this = this;
        return (0, mithril_1["default"])(".fixed.flex.col.mt-s.menu-shadow", {
            oncreate: function (vnode) { return _this._setScrollTop(attrs, vnode); },
            onupdate: function (vnode) { return _this._setScrollTop(attrs, vnode); },
            style: {
                width: "100px",
                height: "400px",
                "z-index": "3",
                background: theme_1.theme.content_bg,
                overflow: "auto"
            }
        }, this._values.map(function (time, i) {
            return (0, mithril_1["default"])("pr-s.pl-s.darker-hover", {
                key: time,
                style: {
                    "background-color": _this._selectedIndex === i ? theme_1.theme.list_bg : theme_1.theme.list_alternate_bg,
                    flex: "1 0 auto",
                    "line-height": "44px"
                },
                onmousedown: function () {
                    _this._focused = false;
                    attrs.onTimeSelected((0, TimeParser_1.parseTime)(time));
                }
            }, time);
        }));
    };
    TimePicker.prototype._onSelected = function (attrs) {
        this._focused = false;
        attrs.onTimeSelected((0, TimeParser_1.parseTime)(this._value));
    };
    TimePicker.prototype._setScrollTop = function (attrs, vnode) {
        var _this = this;
        if (this._selectedIndex !== -1) {
            requestAnimationFrame(function () {
                vnode.dom.scrollTop = 44 * _this._selectedIndex;
            });
        }
    };
    return TimePicker;
}());
exports.TimePicker = TimePicker;
