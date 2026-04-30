"use strict";
exports.__esModule = true;
exports.ViewColumn = void 0;
var mithril_1 = require("mithril");
var AriaUtils_1 = require("../AriaUtils");
var Env_1 = require("../../api/common/Env");
(0, Env_1.assertMainOrNode)();
var ViewColumn = /** @class */ (function () {
    /**
     * Create a view column.
     * @param component The component that is rendered as this column
     * @param columnType The type of the view column.
     * @param minWidth The minimum allowed width for the view column.
     * @param maxWidth The maximum allowed width for the view column.
     */
    function ViewColumn(component, columnType, minWidth, maxWidth, headerCenter, ariaLabel) {
        var _this = this;
        // not private because used by ViewSlider
        this._domColumn = null;
        this._ariaRole = null;
        this.component = component;
        this.columnType = columnType;
        this.minWidth = minWidth;
        this.maxWidth = maxWidth;
        this.headerCenter = headerCenter || (function () { return ""; });
        this.ariaLabel = ariaLabel !== null && ariaLabel !== void 0 ? ariaLabel : null;
        this.width = minWidth;
        this.offset = 0;
        this.isInForeground = false;
        this.visible = false;
        this.view = function (vnode) {
            var zIndex = !_this.visible && _this.columnType === 0 /* ColumnType.Foreground */ ? 200 /* LayerType.ForegroundMenu */ + 1 : "";
            var border = vnode.attrs.rightBorder ? ".list-border-right" : "";
            var landmark = _this._ariaRole ? (0, AriaUtils_1.landmarkAttrs)(_this._ariaRole, _this.ariaLabel ? _this.ariaLabel() : _this.getTitle()) : "";
            return (0, mithril_1["default"])(".view-column.overflow-x-hidden.fill-absolute" + border + landmark, {
                "aria-hidden": _this.visible || _this.isInForeground ? "false" : "true",
                oncreate: function (vnode) {
                    _this._domColumn = vnode.dom;
                    _this._domColumn.style.transform =
                        _this.columnType === 0 /* ColumnType.Foreground */ ? "translateX(" + _this.getOffsetForeground(_this.isInForeground) + "px)" : "";
                    if (_this._ariaRole === "main" /* AriaLandmarks.Main */) {
                        _this.focus();
                    }
                },
                style: {
                    zIndex: zIndex,
                    width: _this.width + "px",
                    left: _this.offset + "px"
                }
            }, (0, mithril_1["default"])(_this.component));
        };
    }
    ViewColumn.prototype.setWidth = function (width) {
        this.width = width;
    };
    ViewColumn.prototype.setRole = function (landmark) {
        this._ariaRole = landmark;
    };
    ViewColumn.prototype.getWidth = function () {
        return this.width;
    };
    ViewColumn.prototype.getTitle = function () {
        var center = this.headerCenter();
        return typeof center === "string" ? center : center.middle;
    };
    ViewColumn.prototype.getTitleButtonLeft = function () {
        var center = this.headerCenter();
        return typeof center === "string" ? null : center.left;
    };
    ViewColumn.prototype.getTitleButtonRight = function () {
        var center = this.headerCenter();
        return typeof center === "string" ? null : center.right;
    };
    ViewColumn.prototype.getOffsetForeground = function (foregroundState) {
        if (this.visible || foregroundState) {
            return 0;
        }
        else {
            return -this.width;
        }
    };
    ViewColumn.prototype.focus = function () {
        this._domColumn && this._domColumn.focus();
    };
    return ViewColumn;
}());
exports.ViewColumn = ViewColumn;
