"use strict";
exports.__esModule = true;
exports.ViewSlider = exports.gestureInfoFromTouch = void 0;
var mithril_1 = require("mithril");
var WindowFacade_js_1 = require("../../misc/WindowFacade.js");
var size_js_1 = require("../size.js");
var Animations_js_1 = require("../animation/Animations.js");
var Easing_js_1 = require("../animation/Easing.js");
var theme_js_1 = require("../theme.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var styles_js_1 = require("../styles.js");
var Env_js_1 = require("../../api/common/Env.js");
(0, Env_js_1.assertMainOrNode)();
var gestureInfoFromTouch = function (touch) { return ({
    x: touch.pageX,
    y: touch.pageY,
    time: performance.now(),
    identifier: touch.identifier
}); };
exports.gestureInfoFromTouch = gestureInfoFromTouch;
/**
 * Represents a view with multiple view columns. Depending on the screen width and the view columns configurations,
 * the actual widths and positions of the view columns is calculated. This allows a consistent layout for any browser
 * resolution on any type of device.
 */
var ViewSlider = /** @class */ (function () {
    function ViewSlider(viewColumns, parentName) {
        var _this = this;
        /** Creates the event listener as soon as this component is loaded (invoked by mithril)*/
        this.oncreate = function () {
            _this._updateVisibleBackgroundColumns();
            WindowFacade_js_1.windowFacade.addResizeListener(_this.resizeListener);
        };
        /** Removes the registered event listener as soon as this component is unloaded (invoked by mithril)*/
        this.onremove = function () { return WindowFacade_js_1.windowFacade.removeResizeListener(_this.resizeListener); };
        this.resizeListener = function () { return _this._updateVisibleBackgroundColumns(); };
        this._getSideColDom = function () { return _this.columns[0]._domColumn; };
        this.columns = viewColumns;
        this._mainColumn = (0, tutanota_utils_1.neverNull)(viewColumns.find(function (column) { return column.columnType === 1 /* ColumnType.Background */; })); // the first background column is the main column
        this.focusedColumn = this._mainColumn;
        this._visibleBackgroundColumns = [];
        this._updateVisibleBackgroundColumns();
        this._busy = Promise.resolve();
        this._parentName = parentName;
        this._isModalBackgroundVisible = false;
        this.columns.forEach(function (column) { return column.setRole(_this._getColumnRole(column)); });
        this.view = function (_a) {
            var attrs = _a.attrs;
            var mainSliderColumns = _this._getColumnsForMainSlider();
            var allBackgroundColumnsAreVisible = _this._visibleBackgroundColumns.length === mainSliderColumns.length;
            return (0, mithril_1["default"])(".fill-absolute.flex.col", {
                oncreate: function (vnode) {
                    _this._attachTouchHandler(vnode.dom);
                },
                onremove: function () {
                    if (_this.columns[0].columnType === 0 /* ColumnType.Foreground */ && _this.columns[0].isInForeground) {
                        _this.columns[0].isInForeground = false;
                        _this._isModalBackgroundVisible = false;
                    }
                }
            }, [
                attrs.header,
                (0, mithril_1["default"])(".view-columns.flex-grow.rel", {
                    oncreate: function (vnode) {
                        _this._domSlidingPart = vnode.dom;
                    },
                    style: {
                        width: _this.getWidth() + "px",
                        transform: "translateX(" + _this.getOffset(_this._visibleBackgroundColumns[0]) + "px)"
                    }
                }, mainSliderColumns.map(function (column, index) {
                    return (0, mithril_1["default"])(column, {
                        // Only apply right border if 1. all background columns are visible. 2. It's not the last column.
                        // Perhaps the condition should be "there's another visible column after this one" but it works like this too
                        rightBorder: allBackgroundColumnsAreVisible && index !== mainSliderColumns.length - 1
                    });
                })),
                styles_js_1.styles.isUsingBottomNavigation() ? attrs.bottomNav : null,
                _this._getColumnsForOverlay().map(function (c) { return (0, mithril_1["default"])(c, {}); }),
                _this._createModalBackground(),
            ]);
        };
    }
    ViewSlider.prototype._getColumnRole = function (column) {
        // role  for foreground column is handled inside FolderColumnView
        if (column.columnType === 0 /* ColumnType.Foreground */) {
            return null;
        }
        return this._mainColumn === column ? "main" /* AriaLandmarks.Main */ : "region" /* AriaLandmarks.Region */;
    };
    ViewSlider.prototype.getMainColumn = function () {
        return this._mainColumn;
    };
    ViewSlider.prototype._getColumnsForMainSlider = function () {
        return this.columns.filter(function (c) { return c.columnType === 1 /* ColumnType.Background */ || c.visible; });
    };
    ViewSlider.prototype._getColumnsForOverlay = function () {
        return this.columns.filter(function (c) { return c.columnType === 0 /* ColumnType.Foreground */ && !c.visible; });
    };
    ViewSlider.prototype._createModalBackground = function () {
        var _this = this;
        if (this._isModalBackgroundVisible) {
            return [
                (0, mithril_1["default"])(".fill-absolute.will-change-alpha", {
                    style: {
                        zIndex: 200 /* LayerType.ForegroundMenu */
                    },
                    oncreate: function (vnode) {
                        _this._busy.then(function () { return Animations_js_1.animations.add(vnode.dom, (0, Animations_js_1.alpha)("backgroundColor" /* AlphaEnum.BackgroundColor */, theme_js_1.theme.modal_bg, 0, 0.5)); });
                    },
                    onbeforeremove: function (vnode) {
                        return _this._busy.then(function () { return Animations_js_1.animations.add(vnode.dom, (0, Animations_js_1.alpha)("backgroundColor" /* AlphaEnum.BackgroundColor */, theme_js_1.theme.modal_bg, 0.5, 0)); });
                    },
                    onclick: function () {
                        _this.focus(_this._visibleBackgroundColumns[0]);
                    }
                }),
            ];
        }
        else {
            return [];
        }
    };
    ViewSlider.prototype._updateVisibleBackgroundColumns = function () {
        var _this = this;
        this.focusedColumn = this.focusedColumn || this._mainColumn;
        var visibleColumns = [this.focusedColumn.columnType === 1 /* ColumnType.Background */ ? this.focusedColumn : this._mainColumn];
        var remainingSpace = window.innerWidth - visibleColumns[0].minWidth;
        var nextVisibleColumn = this.getNextVisibleColumn(visibleColumns, this.columns);
        while (nextVisibleColumn && remainingSpace >= nextVisibleColumn.minWidth) {
            visibleColumns.push(nextVisibleColumn);
            remainingSpace -= nextVisibleColumn.minWidth;
            nextVisibleColumn = this.getNextVisibleColumn(visibleColumns, this.columns);
        }
        // visible columns must be sort by the initial column order
        visibleColumns.sort(function (a, b) { return _this.columns.indexOf(a) - _this.columns.indexOf(b); });
        this._distributeRemainingSpace(visibleColumns, remainingSpace);
        this._setWidthForHiddenColumns(visibleColumns);
        this.columns.forEach(function (column) { return (column.visible = visibleColumns.includes(column)); });
        this.updateOffsets();
        this._visibleBackgroundColumns = visibleColumns;
        if (this.allColumnsVisible()) {
            this.focusedColumn.isInForeground = false;
            this._isModalBackgroundVisible = false;
            if (this.columns[0]._domColumn) {
                this.columns[0]._domColumn.style.transform = "";
            }
        }
        window.requestAnimationFrame(function () { return mithril_1["default"].redraw(); });
    };
    ViewSlider.prototype.getVisibleBackgroundColumns = function () {
        return this._visibleBackgroundColumns.slice();
    };
    ViewSlider.prototype.isUsingOverlayColumns = function () {
        return this.columns.every(function (c) { return c.columnType !== 0 /* ColumnType.Foreground */ || c.visible; });
    };
    /**
     * Returns the next column which should become visible
     * @param visibleColumns All columns that will definitely be visible
     * @param allColumns All columns*
     */
    ViewSlider.prototype.getNextVisibleColumn = function (visibleColumns, allColumns) {
        // First: try to find a background column which is not visible
        var nextColumn = allColumns.find(function (column) {
            return column.columnType === 1 /* ColumnType.Background */ && visibleColumns.indexOf(column) < 0;
        });
        if (!nextColumn) {
            // Second: if no more background columns are available add the foreground column to the visible columns
            nextColumn = allColumns.find(function (column) {
                return column.columnType === 0 /* ColumnType.Foreground */ && visibleColumns.indexOf(column) < 0;
            });
        }
        return nextColumn !== null && nextColumn !== void 0 ? nextColumn : null;
    };
    ViewSlider.prototype.getBackgroundColumns = function () {
        return this.columns.filter(function (c) { return c.columnType === 1 /* ColumnType.Background */; });
    };
    /**
     * distributes the remaining space to all visible columns
     * @param visibleColumns
     * @param remainingSpace
     */
    ViewSlider.prototype._distributeRemainingSpace = function (visibleColumns, remainingSpace) {
        var spacePerColumn = remainingSpace / visibleColumns.length;
        visibleColumns.forEach(function (visibleColumn, index) {
            if (visibleColumns.length - 1 === index) {
                // ignore max width for the last visible column
                visibleColumn.setWidth(visibleColumn.minWidth + remainingSpace);
            }
            else {
                var spaceForThisColumn = Math.min(spacePerColumn, visibleColumn.maxWidth - visibleColumn.minWidth);
                remainingSpace -= spaceForThisColumn;
                visibleColumn.setWidth(visibleColumn.minWidth + spaceForThisColumn);
            }
        });
    };
    ViewSlider.prototype._setWidthForHiddenColumns = function (visibleColumns) {
        // if all columns are visible there is no need to set the width
        if (this.columns.length === visibleColumns.length) {
            return;
        }
        // if only one column is visible set the same width for all columns ignoring max width
        if (visibleColumns.length === 1) {
            this.columns.forEach(function (column) { return column.setWidth(visibleColumns[0].width); });
        }
        // Reduce the width of the foreground button to keep always a small part of the background button visible.
        var foreGroundColumn = this.columns.find(function (column) { return column.columnType === 0 /* ColumnType.Foreground */; });
        if (foreGroundColumn) {
            var remainingSpace = window.innerWidth - foreGroundColumn.minWidth - size_js_1.size.hpad_large;
            var additionalSpaceForColumn = Math.min(remainingSpace, foreGroundColumn.maxWidth - foreGroundColumn.minWidth);
            foreGroundColumn.setWidth(foreGroundColumn.minWidth + additionalSpaceForColumn);
        }
    };
    ViewSlider.prototype.focus = function (viewColumn) {
        var _this = this;
        return this._busy
            .then(function () {
            // hide the foreground column if the column is in foreground
            if (_this.focusedColumn.isInForeground) {
                _this._busy = _this._slideForegroundColumn(_this.focusedColumn, false);
                return _this._busy;
            }
        })
            .then(function () {
            _this.focusedColumn = viewColumn;
            if (viewColumn.columnType === 1 /* ColumnType.Background */ &&
                _this._visibleBackgroundColumns.length === 1 &&
                _this._visibleBackgroundColumns.indexOf(viewColumn) < 0) {
                var currentOffset = _this._domSlidingPart.getBoundingClientRect().left;
                _this._busy = _this._slideBackgroundColumns(viewColumn, currentOffset, _this.getOffset(viewColumn));
            }
            else if (viewColumn.columnType === 0 /* ColumnType.Foreground */ && _this._visibleBackgroundColumns.indexOf(viewColumn) < 0) {
                _this._busy = _this._slideForegroundColumn(viewColumn, true);
            }
            return _this._busy;
        })["finally"](function () {
            mithril_1["default"].redraw();
            viewColumn.focus();
        }); // for updating header bar after animation
    };
    /**
     * Executes a slide animation for the background buttons.
     */
    ViewSlider.prototype._slideBackgroundColumns = function (nextVisibleViewColumn, oldOffset, newOffset) {
        var _this = this;
        return Animations_js_1.animations
            .add(this._domSlidingPart, (0, Animations_js_1.transform)("translateX" /* TransformEnum.TranslateX */, oldOffset, newOffset), {
            easing: Easing_js_1.ease.inOut
        })["finally"](function () {
            // replace the visible column
            var removed = _this._visibleBackgroundColumns.splice(0, 1, nextVisibleViewColumn)[0];
            removed.visible = false;
            nextVisibleViewColumn.visible = true;
        });
    };
    /**
     * Executes a slide animation for the foreground button.
     */
    ViewSlider.prototype._slideForegroundColumn = function (foregroundColumn, toForeground) {
        if (!foregroundColumn._domColumn)
            return Promise.resolve();
        var colRect = foregroundColumn._domColumn.getBoundingClientRect();
        var oldOffset = colRect.left;
        var newOffset = foregroundColumn.getOffsetForeground(toForeground);
        this._isModalBackgroundVisible = toForeground;
        return Animations_js_1.animations
            .add((0, tutanota_utils_1.neverNull)(foregroundColumn._domColumn), (0, Animations_js_1.transform)("translateX" /* TransformEnum.TranslateX */, oldOffset, newOffset), {
            easing: Easing_js_1.ease["in"]
        })["finally"](function () {
            foregroundColumn.isInForeground = toForeground;
        });
    };
    ViewSlider.prototype.updateOffsets = function () {
        var offset = 0;
        for (var _i = 0, _a = this.columns; _i < _a.length; _i++) {
            var column = _a[_i];
            if (column.columnType === 1 /* ColumnType.Background */ || column.visible) {
                column.offset = offset;
                offset += column.width;
            }
        }
    };
    ViewSlider.prototype.getWidth = function () {
        var lastColumn = this.columns[this.columns.length - 1];
        return lastColumn.offset + lastColumn.width;
    };
    ViewSlider.prototype.getOffset = function (column) {
        return 0 - column.offset;
    };
    ViewSlider.prototype.isFocusPreviousPossible = function () {
        return this.getPreviousColumn() != null;
    };
    ViewSlider.prototype.focusPreviousColumn = function () {
        if (this.isFocusPreviousPossible()) {
            this.focus((0, tutanota_utils_1.neverNull)(this.getPreviousColumn()));
        }
    };
    ViewSlider.prototype.focusNextColumn = function () {
        var indexOfCurrent = this.columns.indexOf(this.focusedColumn);
        if (indexOfCurrent + 1 < this.columns.length) {
            this.focus(this.columns[indexOfCurrent + 1]);
        }
    };
    ViewSlider.prototype.getPreviousColumn = function () {
        if (this.columns.indexOf(this._visibleBackgroundColumns[0]) > 0 && !this.focusedColumn.isInForeground) {
            var visibleColumnIndex = this.columns.indexOf(this._visibleBackgroundColumns[0]);
            return this.columns[visibleColumnIndex - 1];
        }
        return null;
    };
    ViewSlider.prototype.isFirstBackgroundColumnFocused = function () {
        return this.columns.filter(function (column) { return column.columnType === 1 /* ColumnType.Background */; }).indexOf(this.focusedColumn) === 0;
    };
    ViewSlider.prototype.isForegroundColumnFocused = function () {
        return this.focusedColumn && this.focusedColumn.columnType === 0 /* ColumnType.Foreground */;
    };
    ViewSlider.prototype.allColumnsVisible = function () {
        return this._visibleBackgroundColumns.length === this.columns.length;
    };
    ViewSlider.prototype._attachTouchHandler = function (element) {
        var _this = this;
        var lastGestureInfo;
        var oldGestureInfo;
        var initialGestureInfo;
        var VERTICAL = 1;
        var HORIZONTAL = 2;
        var directionLock = 0;
        var gestureEnd = function (event) {
            var safeLastGestureInfo = lastGestureInfo;
            var safeOldGestureInfo = oldGestureInfo;
            if (safeLastGestureInfo && safeOldGestureInfo && !_this.allColumnsVisible()) {
                var touch = event.changedTouches[0];
                var mainCol = _this._mainColumn._domColumn;
                var sideCol = _this._getSideColDom();
                if (!mainCol || !sideCol) {
                    return;
                }
                var mainColRect = mainCol.getBoundingClientRect();
                var velocity = (safeLastGestureInfo.x - safeOldGestureInfo.x) / (safeLastGestureInfo.time - safeOldGestureInfo.time);
                var show = function () {
                    _this.focusedColumn = _this.columns[0];
                    _this._busy = _this._slideForegroundColumn(_this.columns[0], true);
                    _this._isModalBackgroundVisible = true;
                };
                var hide = function () {
                    _this.focusedColumn = _this.columns[1];
                    _this._busy = _this._slideForegroundColumn(_this.columns[0], false);
                    _this._isModalBackgroundVisible = false;
                };
                // Gesture for the side column
                if (_this.getBackgroundColumns()[0].visible || _this.focusedColumn.isInForeground) {
                    // Gesture was with enough velocity to show the menu
                    if (velocity > 0.8) {
                        show(); // Gesture was with enough velocity to hide the menu and we're not scrolling vertically
                    }
                    else if (velocity < -0.8 && directionLock !== VERTICAL) {
                        hide();
                    }
                    else {
                        // Finger was released without much velocity so if it's further than some distance from edge, open menu. Otherwise, close it.
                        if (touch.pageX > mainColRect.left + 100) {
                            show();
                        }
                        else if (directionLock !== VERTICAL) {
                            hide();
                        }
                    }
                }
                else {
                    // Gesture for sliding other columns
                    if ((safeLastGestureInfo.x > window.innerWidth / 3 || velocity > 0.8) && directionLock !== VERTICAL) {
                        _this.focusPreviousColumn();
                    }
                    else {
                        var colRect = _this._domSlidingPart.getBoundingClientRect();
                        // Re-focus the column to reset offset changed by the gesture
                        _this._busy = _this._slideBackgroundColumns(_this.focusedColumn, colRect.left, -_this.focusedColumn.offset);
                        _this.focus(_this.focusedColumn);
                    }
                }
                _this._busy.then(function () { return mithril_1["default"].redraw(); });
            }
            // If this is the first touch and not another one
            if (safeLastGestureInfo && safeLastGestureInfo.identifier === event.changedTouches[0].identifier) {
                lastGestureInfo = null;
                oldGestureInfo = null;
                initialGestureInfo = null;
                directionLock = 0;
            }
        };
        var listeners = {
            touchstart: function (event) {
                if (lastGestureInfo) {
                    // Already detecting a gesture, ignore second one
                    return;
                }
                var mainCol = _this._mainColumn._domColumn;
                var sideCol = _this._getSideColDom();
                if (!mainCol || !sideCol || _this.allColumnsVisible()) {
                    lastGestureInfo = null;
                    return;
                }
                if (event.touches.length === 1 && (_this.columns[0].isInForeground || event.touches[0].pageX < 40)) {
                    // Only stop propogation while the menu is not yet fully visible
                    if (!_this.columns[0].isInForeground) {
                        event.stopPropagation();
                    }
                    lastGestureInfo = initialGestureInfo = (0, exports.gestureInfoFromTouch)(event.touches[0]);
                }
            },
            touchmove: function (event) {
                var sideCol = _this._getSideColDom();
                if (!sideCol || !_this._mainColumn || _this.allColumnsVisible()) {
                    return;
                }
                var gestureInfo = lastGestureInfo;
                var safeInitialGestureInfo = initialGestureInfo;
                if (gestureInfo && safeInitialGestureInfo && event.touches.length === 1) {
                    var touch = event.touches[0];
                    var newTouchPos = touch.pageX;
                    var sideColRect = sideCol.getBoundingClientRect();
                    oldGestureInfo = lastGestureInfo;
                    var safeLastInfo = (lastGestureInfo = (0, exports.gestureInfoFromTouch)(touch));
                    // If we have horizonal lock or we don't have vertical lock but would like to acquire horizontal one, the lock horizontally
                    if (directionLock === HORIZONTAL || (directionLock !== VERTICAL && Math.abs(safeLastInfo.x - safeInitialGestureInfo.x) > 30)) {
                        directionLock = HORIZONTAL;
                        // Gesture for side column
                        if (_this.getBackgroundColumns()[0].visible || _this.focusedColumn.isInForeground) {
                            var newTranslate = Math.min(sideColRect.left - (gestureInfo.x - newTouchPos), 0);
                            sideCol.style.transform = "translateX(".concat(newTranslate, "px)");
                        }
                        else {
                            // Gesture for background column
                            var slidingDomRect = _this._domSlidingPart.getBoundingClientRect();
                            // Do not allow to move column to the left
                            var newTranslate = Math.max(slidingDomRect.left - (gestureInfo.x - newTouchPos), -_this.focusedColumn.offset);
                            _this._domSlidingPart.style.transform = "translateX(".concat(newTranslate, "px)");
                        }
                        // Scroll events are not cancellable and browsees complain a lot
                        if (event.cancelable !== false)
                            event.preventDefault(); // If we don't have a vertical lock but we would like to acquire one, get it
                    }
                    else if (directionLock !== VERTICAL && Math.abs(safeLastInfo.y - safeInitialGestureInfo.y) > 30) {
                        directionLock = VERTICAL;
                    }
                    event.stopPropagation();
                }
            },
            touchend: gestureEnd,
            touchcancel: gestureEnd
        };
        for (var _i = 0, _a = Object.entries(listeners); _i < _a.length; _i++) {
            var _b = _a[_i], name_1 = _b[0], listener = _b[1];
            element.addEventListener(name_1, listener, true);
        }
    };
    return ViewSlider;
}());
exports.ViewSlider = ViewSlider;
