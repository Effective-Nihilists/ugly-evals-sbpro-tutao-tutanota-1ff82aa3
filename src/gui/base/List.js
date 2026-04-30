"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.listSelectionKeyboardShortcuts = exports.ACTION_DISTANCE = exports.List = exports.PageSize = exports.ScrollBuffer = void 0;
var mithril_1 = require("mithril");
var Log_1 = require("../../misc/Log");
var size_1 = require("../size");
var ClientDetector_1 = require("../../misc/ClientDetector");
var TutanotaConstants_1 = require("../../api/common/TutanotaConstants");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var ColumnEmptyMessageBox_1 = require("./ColumnEmptyMessageBox");
var Icon_1 = require("./Icon");
var Animations_1 = require("../animation/Animations");
var Easing_1 = require("../animation/Easing");
var WindowFacade_1 = require("../../misc/WindowFacade");
var RestError_1 = require("../../api/common/error/RestError");
var SwipeHandler_1 = require("./SwipeHandler");
var HtmlUtils_1 = require("../HtmlUtils");
var theme_1 = require("../theme");
var KeyManager_1 = require("../../misc/KeyManager");
var EntityUtils_1 = require("../../api/common/utils/EntityUtils");
var Env_1 = require("../../api/common/Env");
var Button_js_1 = require("./Button.js");
var LoadingState_1 = require("../../offline/LoadingState");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var ErrorCheckUtils_js_1 = require("../../api/common/utils/ErrorCheckUtils.js");
(0, Env_1.assertMainOrNode)();
exports.ScrollBuffer = 15; // virtual elements that are used as scroll buffer in both directions
exports.PageSize = 100;
/**
 * A list that renders only a few dom elements (virtual list) to represent the items of even very large lists.
 */
var List = /** @class */ (function () {
    function List(config) {
        var _this = this;
        this.config = config;
        /** Whether we have rendered DOM elements for the list and updated them at least once. */
        this.ready = false;
        this.loading = Promise.resolve();
        this.currentPosition = 0;
        this.lastPosition = 0;
        this.width = 0;
        /**
         * Set when scrolling list so fast that it doesn't make sense to try to updateDomElements elements.
         * If set, paint operations are executed later, when the scroll speed becomes slower.
         */
        this.scrollUpdateLater = false;
        /** sorted with _config.sortCompare */
        this.loadedEntities = [];
        /**
         * this will be set to a new object every time the list changes.
         * if you want to know if the list changed between two points in time,
         * get a reference to this and later compare to the current value.
         * */
        this.lastElementChangeMarker = {};
        /** Displays a part of the page, VirtualRows map 1:1 to DOM-Elements */
        this.virtualList = [];
        this.domDeferred = (0, tutanota_utils_1.defer)();
        this.messageBoxDom = null;
        this.loadedCompletely = false;
        this.visibleElementsHeight = 0;
        this.swipeHandler = null;
        /** The selected entities must be sorted the same way the loaded entities are sorted */
        this.selectedEntities = [];
        /** We remember the last selected entities and only invoke callback from config if there was an actual difference. */
        this.lastSelectedEntitiesForCallback = [];
        /** true if the last key multi selection action was selecting the previous entity, false if it was selecting the next entity */
        this.lastMultiSelectWasKeyUp = false;
        /**
         * When we call scrollToIdAndSelectWhenReceived we wait for the item to be added to the list and then scroll to it.
         * This field remembers what we are waiting for.
         */
        this.idOfEntityToSelectWhenReceived = null;
        /** Can be activated by holding on element in a list. When active, elements can be selected just by tapping them */
        this.mobileMultiSelectionActive = false;
        this.loadingState = new LoadingState_1.LoadingStateTracker();
        this.loadingIndicatorDom = (0, tutanota_utils_1.defer)();
        this.loadingIndicatorChildDom = (0, tutanota_utils_1.defer)();
        this.windowResizeListener = function () {
            _this.updateWidth();
        };
        this.scrollListener = function () {
            _this.currentPosition = _this.domListContainer.scrollTop;
            if (_this.lastPosition !== _this.currentPosition) {
                window.requestAnimationFrame(function () { return _this.scroll(); });
            }
        };
        this.elementSelected = (0, tutanota_utils_1.debounceStart)(200, function (entities, elementClicked, multiSelectOperation) {
            var selectionChanged = _this.lastSelectedEntitiesForCallback.length !== entities.length || _this.lastSelectedEntitiesForCallback.some(function (el, i) { return entities[i] !== el; });
            _this.config.elementSelected(entities, elementClicked, selectionChanged, multiSelectOperation);
            _this.lastSelectedEntitiesForCallback = entities;
        });
        this.bufferHeight = this.config.rowHeight * exports.ScrollBuffer;
        this.oncreate = this.oncreate.bind(this);
        this.onremove = this.onremove.bind(this);
        this.onbeforeupdate = this.onbeforeupdate.bind(this);
        this.view = this.view.bind(this);
        this.reset();
    }
    List.prototype.oncreate = function () {
        var _this = this;
        this.loadingState.setStateChangedListener(function (state) { return _this.handleLoadingStateChanged(state); });
        KeyManager_1.keyManager.registerShortcuts(listSelectionKeyboardShortcuts(this));
        WindowFacade_1.windowFacade.addResizeListener(this.windowResizeListener);
    };
    List.prototype.onremove = function () {
        this.loadingState.clearStateChangedListener();
        KeyManager_1.keyManager.unregisterShortcuts(listSelectionKeyboardShortcuts(this));
        // List is created by us manually because we want to keep it around for entities and the loading state but if the views are rearranged
        // (e.g. if we switch the app layout between 2 and 3 columns) then we need to reset anything DOM-related as we will create it again
        this.reset();
    };
    /**
     *  We render the list once on the initial draw
     *  So we only want view to be called when there is a state change
     */
    List.prototype.onbeforeupdate = function () {
        return !this.ready;
    };
    List.prototype.view = function () {
        var _this = this;
        return (0, mithril_1["default"])(".list-container.fill-absolute.scroll.list-bg.nofocus.overflow-x-hidden", {
            tabindex: "-1" /* TabIndex.Programmatic */,
            oncreate: function (vnode) {
                _this.domListContainer = vnode.dom;
                _this.width = _this.domListContainer.clientWidth;
                _this._createVirtualRows();
                // On mobile, we want to wait for the side menu animation to end before doing any heavy things to keep the animation smooth
                var execute = function (callback) { return ClientDetector_1.client.isMobileDevice()
                    ? window.setTimeout(callback, Animations_1.DefaultAnimationTime)
                    : window.requestAnimationFrame(callback); };
                execute(function () {
                    // We synchronously render into the dom element so that we have full control over when it is done.
                    mithril_1["default"].render(vnode.dom, _this.renderList());
                    _this.domDeferred.resolve();
                    _this._init();
                });
            }
        });
    };
    List.prototype.renderList = function () {
        var _this = this;
        return [
            (0, mithril_1["default"])(".swipe-spacer.flex.items-center.justify-end.pr-l.blue", {
                oncreate: function (vnode) { return (_this.domSwipeSpacerLeft = vnode.dom); },
                tabindex: "-1" /* TabIndex.Programmatic */,
                "aria-hidden": "true",
                style: {
                    height: (0, size_1.px)(this.config.rowHeight),
                    transform: "translateY(-".concat(this.config.rowHeight, "px)"),
                    position: "absolute",
                    "z-index": 1,
                    width: (0, size_1.px)(this.width)
                }
            }, this.config.swipe.renderLeftSpacer()),
            (0, mithril_1["default"])(".swipe-spacer.flex.items-center.pl-l.red", {
                oncreate: function (vnode) { return (_this.domSwipeSpacerRight = vnode.dom); },
                tabindex: "-1" /* TabIndex.Programmatic */,
                "aria-hidden": "true",
                style: {
                    height: (0, size_1.px)(this.config.rowHeight),
                    transform: "translateY(-".concat(this.config.rowHeight, "px)"),
                    position: "absolute",
                    "z-index": 1,
                    width: (0, size_1.px)(this.width)
                }
            }, this.config.swipe.renderRightSpacer()),
            (0, mithril_1["default"])("ul.list.list-alternate-background.fill-absolute.click", {
                oncreate: function (vnode) { return _this._setDomList(vnode.dom); },
                style: {
                    height: this.calculateListHeight()
                },
                className: this.config.className
            }, [
                this.virtualList.map(function (virtualRow) { return _this.renderVirtualRow(virtualRow); }),
                this.renderStatusRow()
            ]),
            (0, mithril_1["default"])(ColumnEmptyMessageBox_1["default"], {
                message: function () { return _this.config.emptyMessage; },
                color: theme_1.theme.list_message_bg,
                oncreate: function (vnode) {
                    _this.messageBoxDom = vnode.dom;
                    _this.updateMessageBoxVisibility();
                }
            }),
        ];
    };
    List.prototype.renderVirtualRow = function (virtualRow) {
        var _this = this;
        return (0, mithril_1["default"])("li.list-row.pl.pr-l", {
            draggable: this.config.dragStart ? "true" : undefined,
            tabindex: "0" /* TabIndex.Default */,
            oncreate: function (vnode) { return _this.initRow(virtualRow, vnode.dom); },
            style: {
                transform: "translateY(-".concat(this.config.rowHeight, "px)"),
                paddingTop: (0, size_1.px)(15),
                paddingBottom: (0, size_1.px)(15)
            },
            ondragstart: function (event) {
                if (_this.config.dragStart) {
                    _this.config.dragStart(event, virtualRow, _this.selectedEntities);
                }
            }
        }, virtualRow.render());
    };
    List.prototype.renderStatusRow = function () {
        var _this = this;
        // odd-row is toggled manually on the dom element when the number of elements changes
        return (0, mithril_1["default"])("li.list-row.odd-row", {
            oncreate: function (vnode) {
                _this.loadingIndicatorDom.resolve(vnode.dom);
            },
            style: {
                bottom: 0,
                height: (0, size_1.px)(size_1.size.list_row_height),
                display: this.loadingState.isIdle() ? "none" : ""
            }
        }, (0, mithril_1["default"])("", {
            oncreate: function (vnode) {
                _this.loadingIndicatorChildDom.resolve(vnode.dom);
            }
        }, this.loadingState.isLoading()
            ? this.renderLoadingIndicator()
            : this.loadingState.isConnectionLost()
                ? this.renderConnectionLostIndicator()
                : null));
    };
    List.prototype.reset = function () {
        if (this.domListContainer) {
            this.domListContainer.removeEventListener("scroll", this.scrollListener);
        }
        // it's important to reset all the DOM things because we might be re-rendering soon with the new containers
        this.domDeferred = (0, tutanota_utils_1.defer)();
        this.loadingIndicatorDom = (0, tutanota_utils_1.defer)();
        this.loadingIndicatorChildDom = (0, tutanota_utils_1.defer)();
        this.ready = false;
        this.virtualList = [];
        WindowFacade_1.windowFacade.removeResizeListener(this.windowResizeListener);
    };
    List.prototype.updateWidth = function () {
        var _this = this;
        if (this.domListContainer && this.domSwipeSpacerLeft && this.domSwipeSpacerRight) {
            this.domSwipeSpacerLeft.style.opacity = "0";
            this.domSwipeSpacerRight.style.opacity = "0";
            setTimeout(function () {
                _this.width = _this.domListContainer.clientWidth;
                if (_this.swipeHandler) {
                    _this.swipeHandler.updateWidth();
                    _this.domSwipeSpacerLeft.style.opacity = "1";
                    _this.domSwipeSpacerRight.style.opacity = "1";
                }
            }, 60);
        }
    };
    List.prototype.clear = function () {
        this.loadedEntities.length = 0;
        this.lastElementChangeMarker = {};
        this.loadedCompletely = false;
        if (this.domList) {
            this.updateListHeight();
            for (var _i = 0, _a = this.virtualList; _i < _a.length; _i++) {
                var row = _a[_i];
                if (row.domElement) {
                    row.domElement.style.display = "none";
                }
            }
        }
    };
    List.prototype.handleLoadingStateChanged = function (newState) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, loadingStateDom, loadingStateDomChild;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all([this.loadingIndicatorDom.promise, this.loadingIndicatorChildDom.promise])];
                    case 1:
                        _a = _b.sent(), loadingStateDom = _a[0], loadingStateDomChild = _a[1];
                        switch (newState) {
                            case LoadingState_1.LoadingState.Idle:
                                loadingStateDom.style.display = "none";
                                break;
                            case LoadingState_1.LoadingState.Loading:
                                mithril_1["default"].render(loadingStateDomChild, this.renderLoadingIndicator());
                                loadingStateDom.style.display = "";
                                break;
                            case LoadingState_1.LoadingState.ConnectionLost:
                                mithril_1["default"].render(loadingStateDomChild, this.renderConnectionLostIndicator());
                                loadingStateDom.style.display = "";
                                break;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    List.prototype.renderLoadingIndicator = function () {
        return (0, mithril_1["default"])(".flex-center.items-center", {
            style: {
                height: (0, size_1.px)(size_1.size.list_row_height),
                width: "100%",
                position: "absolute"
            }
        }, (0, Icon_1.progressIcon)());
    };
    List.prototype.renderConnectionLostIndicator = function () {
        var _this = this;
        return (0, mithril_1["default"])(".plr-l.flex-space-around.items-center", {
            style: {
                height: (0, size_1.px)(size_1.size.list_row_height),
                width: "100%",
                position: "absolute"
            }
        }, [
            (0, mithril_1["default"])("", LanguageViewModel_1.lang.get("connectionLost_msg")),
            (0, mithril_1["default"])(Button_js_1.Button, {
                label: "retry_action",
                type: "primary" /* ButtonType.Primary */,
                click: function () { return _this.retryLoading(); }
            })
        ]);
    };
    List.prototype.initRow = function (virtualRow, domElement) {
        var _this = this;
        var touchStartTime = null;
        virtualRow.domElement = domElement;
        domElement.onclick = function (e) {
            if (!touchStartTime || Date.now() - touchStartTime < 400) {
                virtualRow.entity && _this.elementClicked(virtualRow.entity, e);
            }
        };
        domElement.onkeyup = function (e) {
            if ((0, KeyManager_1.isKeyPressed)(e.keyCode, TutanotaConstants_1.Keys.SPACE, TutanotaConstants_1.Keys.RETURN)) {
                virtualRow.entity && _this.elementClicked(virtualRow.entity, e);
            }
        };
        var timeoutId;
        var touchStartCoords = null;
        domElement.addEventListener("touchstart", function (e) {
            touchStartTime = Date.now();
            if (_this.config.multiSelectionAllowed) {
                // Activate multi selection after pause
                timeoutId = setTimeout(function () {
                    _this.mobileMultiSelectionActive = true;
                    // check that virtualRow.entity exists because we had error feedbacks about it
                    if (virtualRow.entity && !_this.isEntitySelected(virtualRow.entity._id[1])) {
                        _this.selectedEntities.length = 0;
                        _this.elementClicked(virtualRow.entity, e);
                    }
                    else {
                        mithril_1["default"].redraw(); // only header changes we don't need updateDomElements here
                    }
                }, 400);
                touchStartCoords = {
                    x: e.touches[0].pageX,
                    y: e.touches[0].pageY
                };
            }
        });
        var touchEnd = function () {
            timeoutId && clearTimeout(timeoutId);
        };
        domElement.addEventListener("touchend", touchEnd);
        domElement.addEventListener("touchcancel", touchEnd);
        domElement.addEventListener("touchmove", function (e) {
            // If the user moved the finger too much by any axis, don't count it as a long press
            var maxDistance = 30;
            var touch = e.touches[0];
            if (touchStartCoords &&
                timeoutId &&
                (Math.abs(touch.pageX - touchStartCoords.x) > maxDistance || Math.abs(touch.pageY - touchStartCoords.y) > maxDistance)) {
                clearTimeout(timeoutId);
            }
        });
        (0, HtmlUtils_1.applySafeAreaInsetMarginLR)(domElement);
    };
    List.prototype.getEntity = function (id) {
        var _a;
        return (_a = this.loadedEntities.find(function (entity) { return (0, EntityUtils_1.getLetId)(entity)[1] === id; })) !== null && _a !== void 0 ? _a : null;
    };
    /**
     * Updates the given list of selected items with a click on the given clicked item. Takes ctrl and shift key events into consideration for multi selection.
     * If ctrl is pressed the selection status of the clickedItem is toggled.
     * If shift is pressed, all items beginning from the nearest selected item to the clicked item are additionally selected.
     * If neither ctrl nor shift are pressed only the clicked item is selected.
     */
    List.prototype.elementClicked = function (clickedEntity, event) {
        var selectionChanged = false;
        var multiSelect = false;
        if (this.config.multiSelectionAllowed && (this.mobileMultiSelectionActive || (ClientDetector_1.client.isMacOS ? event.metaKey : event.ctrlKey))) {
            selectionChanged = true;
            multiSelect = true;
            if (this.selectedEntities.indexOf(clickedEntity) !== -1) {
                (0, tutanota_utils_1.remove)(this.selectedEntities, clickedEntity);
            }
            else {
                this.selectedEntities.push(clickedEntity);
            }
        }
        else if (this.config.multiSelectionAllowed && event.shiftKey) {
            multiSelect = true;
            if (this.selectedEntities.length === 0) {
                // no item is selected, so treat it as if shift was not pressed
                this.selectedEntities.push(clickedEntity);
                selectionChanged = true;
            }
            else if (this.selectedEntities.length === 1 && this.selectedEntities[0] === clickedEntity) {
                // nothing to do, the item is already selected
            }
            else {
                // select all items from the given item to the nearest already selected item
                var clickedItemIndex = this.loadedEntities.indexOf(clickedEntity);
                var nearestSelectedIndex = null;
                for (var i = 0; i < this.selectedEntities.length; i++) {
                    var currentSelectedItemIndex = this.loadedEntities.indexOf(this.selectedEntities[i]);
                    if (nearestSelectedIndex == null ||
                        Math.abs(clickedItemIndex - currentSelectedItemIndex) < Math.abs(clickedItemIndex - nearestSelectedIndex)) {
                        nearestSelectedIndex = currentSelectedItemIndex;
                    }
                }
                var itemsToAddToSelection = [];
                if ((0, tutanota_utils_1.neverNull)(nearestSelectedIndex) < clickedItemIndex) {
                    for (var i = (0, tutanota_utils_1.neverNull)(nearestSelectedIndex) + 1; i <= clickedItemIndex; i++) {
                        itemsToAddToSelection.push(this.loadedEntities[i]);
                    }
                }
                else {
                    for (var i = clickedItemIndex; i < (0, tutanota_utils_1.neverNull)(nearestSelectedIndex); i++) {
                        itemsToAddToSelection.push(this.loadedEntities[i]);
                    }
                }
                (0, tutanota_utils_1.addAll)(this.selectedEntities, itemsToAddToSelection);
                selectionChanged = itemsToAddToSelection.length > 0;
            }
        }
        else {
            if (!(0, tutanota_utils_1.arrayEquals)(this.selectedEntities, [clickedEntity])) {
                this.selectedEntities.splice(0, this.selectedEntities.length, clickedEntity);
                selectionChanged = true;
            }
        }
        if (selectionChanged) {
            // the selected entities must be sorted the same way the loaded entities are sorted
            this.selectedEntities.sort(this.config.sortCompare);
            this.updateDomElements();
        }
        if (this.selectedEntities.length === 0) {
            this.mobileMultiSelectionActive = false;
        }
        this.elementSelected(this.getSelectedEntities(), true, multiSelect);
    };
    List.prototype.sort = function () {
        this.loadedEntities.sort(this.config.sortCompare);
        try {
            this.redraw();
        }
        catch (e) {
            // this may be called before "this" hasn't been fully initialized, in which case this.redraw() will throw
            // so just catch and do nothing
        }
    };
    List.prototype.entitySelected = function (entity, addToSelection) {
        if (addToSelection) {
            if (this.selectedEntities.indexOf(entity) === -1) {
                this.selectedEntities.push(entity);
                // the selected entities must be sorted the same way the loaded entities are sorted
                this.selectedEntities.sort(this.config.sortCompare);
                this.updateDomElements();
                this.elementSelected(this.getSelectedEntities(), false, true);
            }
        }
        else {
            var selectionChanged = this.selectedEntities.length !== 1 || this.selectedEntities[0] !== entity;
            if (selectionChanged) {
                this.selectedEntities = [entity];
                this.updateDomElements();
            }
            if (this.selectedEntities.length === 0) {
                this.mobileMultiSelectionActive = false;
            }
            this.elementSelected(this.getSelectedEntities(), false, false);
        }
    };
    List.prototype.selectNext = function (shiftPressed) {
        if (!this.config.multiSelectionAllowed) {
            shiftPressed = false;
        }
        if (shiftPressed && this.lastMultiSelectWasKeyUp === true && this.selectedEntities.length > 1) {
            // we have to remove the selection from the top
            this.selectedEntities.splice(0, 1);
            this.updateDomElements();
            this.elementSelected(this.getSelectedEntities(), false, true);
            this.scrollToLoadedEntityAndSelect(this.selectedEntities[0], true);
        }
        else {
            this.lastMultiSelectWasKeyUp = false;
            if (this.selectedEntities.length === 0 && this.loadedEntities.length > 0) {
                this.entitySelected(this.loadedEntities[0], shiftPressed);
            }
            else if (this.selectedEntities.length !== 0 && this.loadedEntities.length > 0) {
                var selectedIndex = this.loadedEntities.indexOf((0, tutanota_utils_1.lastThrow)(this.selectedEntities));
                if (!shiftPressed && selectedIndex === this.loadedEntities.length - 1) {
                    // select the last entity currently selected as multi selection. This is needed to avoid that elements can not be selected any more if all elements are multi selected
                    selectedIndex--;
                }
                if (selectedIndex !== this.loadedEntities.length - 1) {
                    this.scrollToLoadedEntityAndSelect(this.loadedEntities[selectedIndex + 1], shiftPressed);
                }
            }
        }
    };
    List.prototype.selectPrevious = function (shiftPressed) {
        if (!this.config.multiSelectionAllowed) {
            shiftPressed = false;
        }
        if (shiftPressed && this.lastMultiSelectWasKeyUp === false && this.selectedEntities.length > 1) {
            // we have to remove the selection from the bottom
            this.selectedEntities.splice(-1, 1);
            this.updateDomElements();
            this.elementSelected(this.getSelectedEntities(), false, true);
            var lastEl = (0, tutanota_utils_1.last)(this.selectedEntities);
            lastEl && this.scrollToLoadedEntityAndSelect(lastEl, true);
        }
        else {
            this.lastMultiSelectWasKeyUp = true;
            if (this.selectedEntities.length === 0 && this.loadedEntities.length > 0) {
                this.entitySelected(this.loadedEntities[0], shiftPressed);
            }
            else if (this.selectedEntities.length !== 0 && this.loadedEntities.length > 0) {
                var selectedIndex = this.loadedEntities.indexOf(this.selectedEntities[0]);
                if (!shiftPressed && selectedIndex === 0) {
                    // select the first entity currently selected as multi selection. This is needed to avoid that elements can not be selected any more if all elements are multi selected
                    selectedIndex++;
                }
                if (selectedIndex !== 0) {
                    this.scrollToLoadedEntityAndSelect(this.loadedEntities[selectedIndex - 1], shiftPressed);
                }
            }
        }
    };
    List.prototype.selectNone = function () {
        this.mobileMultiSelectionActive = false;
        if (this.selectedEntities.length > 0) {
            this.selectedEntities = [];
            this.updateDomElements();
            this.elementSelected([], false, false);
        }
    };
    List.prototype.isEntitySelected = function (id) {
        return this.selectedEntities.find(function (entity) { return (0, EntityUtils_1.getLetId)(entity)[1] === id; }) != null;
    };
    List.prototype.getSelectedEntities = function () {
        // return a copy to avoid outside modifications
        return this.selectedEntities.slice();
    };
    List.prototype.getSelectionBounds = function () {
        var selected = this.getSelectedEntities();
        var rowBounds = this.virtualList
            .filter(function (row) { return row.domElement != null && row.entity != null && selected.includes(row.entity); })
            .map(function (row) { return row.domElement.getBoundingClientRect(); });
        var left = Math.min.apply(Math, rowBounds.map(function (row) { return row.left; }));
        var right = Math.max.apply(Math, rowBounds.map(function (row) { return row.right; }));
        var top = Math.min.apply(Math, rowBounds.map(function (row) { return row.top; }));
        var bottom = Math.max.apply(Math, rowBounds.map(function (row) { return row.bottom; }));
        return {
            left: left,
            right: right,
            top: top,
            bottom: bottom,
            height: bottom - top,
            width: right - left
        };
    };
    /**
     * Must be called after creating the list. Loads an initial amount of elements into the list.
     * @param listElementId If not null and existing, loads the list at least up to this element, scrolls to it and selects it.
     */
    List.prototype.loadInitial = function (listElementId) {
        return __awaiter(this, void 0, void 0, function () {
            var entity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!listElementId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.scrollToIdAndSelect(listElementId)];
                    case 1:
                        entity = _a.sent();
                        if (entity != null) {
                            return [2 /*return*/];
                        }
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.loadMore()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.domDeferred.promise];
                    case 4:
                        _a.sent();
                        this.updateListHeight();
                        return [2 /*return*/];
                }
            });
        });
    };
    List.prototype.loadMore = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        return [4 /*yield*/, this.loadingState.trackPromise(this.loadAndAppendAnotherChunk())
                            // If we fetched just a few items we might want to try again.
                            // Start this async.
                        ];
                    case 1:
                        _a.sent();
                        // If we fetched just a few items we might want to try again.
                        // Start this async.
                        this.loadMoreIfNecessary();
                        return [3 /*break*/, 4];
                    case 2:
                        e_1 = _a.sent();
                        if ((0, ErrorCheckUtils_js_1.isOfflineError)(e_1)) {
                            console.log("connection error in loadMore", e_1);
                        }
                        else {
                            throw e_1;
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        mithril_1["default"].redraw();
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    List.prototype.loadAndAppendAnotherChunk = function () {
        return __awaiter(this, void 0, void 0, function () {
            var lastElement, startId;
            var _this = this;
            return __generator(this, function (_a) {
                lastElement = (0, tutanota_utils_1.last)(this.loadedEntities);
                startId = lastElement != null
                    ? (0, EntityUtils_1.getElementId)(lastElement)
                    : EntityUtils_1.GENERATED_MAX_ID;
                this.loading = this.config
                    .fetch(startId, exports.PageSize)
                    .then(function (_a) {
                    var _b;
                    var items = _a.items, complete = _a.complete;
                    (_b = _this.loadedEntities).push.apply(_b, items);
                    _this.lastElementChangeMarker = {};
                    _this.loadedEntities.sort(_this.config.sortCompare);
                    if (complete) {
                        // ensure that all elements are added to the loaded entities before calling setLoadedCompletely
                        _this.setLoadedCompletely();
                    }
                })["finally"](function () {
                    _this.updateDomElements();
                });
                return [2 /*return*/, this.loading];
            });
        });
    };
    List.prototype.calculateListHeight = function () {
        return this.config.rowHeight * (this.loadedEntities.length + (this.loadedCompletely ? 0 : 1)) + "px";
    };
    List.prototype.setLoadedCompletely = function () {
        this.loadedCompletely = true;
        this.loadingState.setIdle();
    };
    List.prototype.displaySpinner = function () {
        this.loadingState.set(LoadingState_1.LoadingState.Loading);
    };
    // Visible for testing
    List.prototype._init = function () {
        var _this = this;
        this.domListContainer.addEventListener("scroll", this.scrollListener, { passive: true });
        window.requestAnimationFrame(function () {
            _this.ready = true;
            _this.updateListHeight();
            _this.updateDomElements();
            if (ClientDetector_1.client.isTouchSupported() && _this.config.swipe.enabled) {
                _this.swipeHandler = new ListSwipeHandler(_this.domListContainer, _this);
            }
        });
    };
    // Visible for testing
    List.prototype._setDomList = function (domElement) {
        this.domList = domElement;
    };
    // Visible for testing
    List.prototype._createVirtualRows = function () {
        var visibleElements = 2 * Math.ceil(this.domListContainer.clientHeight / this.config.rowHeight / 2); // divide and multiply by two to get an even number (because of alternating row backgrounds)
        this.virtualList.length = visibleElements + exports.ScrollBuffer * 2;
        this.visibleElementsHeight = visibleElements * this.config.rowHeight;
        for (var i = 0; i < this.virtualList.length; i++) {
            this.virtualList[i] = this.config.createVirtualRow();
            this.virtualList[i].top = i * this.config.rowHeight;
        }
    };
    List.prototype.scroll = function () {
        var _this = this;
        // make sure no scrolling is done if the virtualList was already cleared when unloading this list. on Safari this would lead to an error.
        if (this.virtualList.length === 0)
            return;
        var up = this.currentPosition < this.lastPosition;
        var scrollDiff = up ? this.lastPosition - this.currentPosition : this.currentPosition - this.lastPosition;
        var now = window.performance.now();
        var timeDiff = Math.round(now - this.lastScrollUpdateTime);
        this.lastScrollUpdateTime = now;
        var rowHeight = this.config.rowHeight;
        var topElement = this.virtualList[0];
        var bottomElement = this.virtualList[this.virtualList.length - 1];
        this.loadMoreIfNecessary();
        var status = {
            bufferUp: Math.floor((this.currentPosition - topElement.top) / rowHeight),
            bufferDown: Math.floor((bottomElement.top + rowHeight - (this.currentPosition + this.visibleElementsHeight)) / rowHeight),
            speed: Math.ceil(scrollDiff / timeDiff),
            // pixel per ms
            scrollDiff: scrollDiff,
            timeDiff: timeDiff
        };
        this.lastPosition = this.currentPosition;
        if (this.scrollUpdateLater) {
            // Only happens for non-desktop devices (see condition below)
            if (scrollDiff < 50 ||
                this.currentPosition === 0 ||
                this.currentPosition + this.visibleElementsHeight === this.loadedEntities.length * rowHeight) {
                // completely reposition the elements as scrolling becomes slower or the top / bottom of the list has been reached
                this.repositionTimeout && clearTimeout(this.repositionTimeout);
                this.updateDomElements();
            }
        }
        else if ((status.bufferDown <= 5 && this.currentPosition + this.visibleElementsHeight < this.loadedEntities.length * rowHeight - 6 * rowHeight) ||
            (status.bufferUp <= 5 && this.currentPosition > 6 * rowHeight)) {
            if (ClientDetector_1.client.isDesktopDevice()) {
                this.updateDomElements();
            }
            else {
                (0, Log_1.log)(Log_1.Cat.debug, "list > update later (scrolling too fast)");
                // scrolling is too fast, the buffer will be eaten up: stop painting until scrolling becomes slower
                this.scrollUpdateLater = true;
                this.repositionTimeout = setTimeout(function () { return _this.repositionAfterScrollStop(); }, 110);
            }
        }
        else if (!up) {
            while (topElement.top + rowHeight < this.currentPosition - this.bufferHeight &&
                this.virtualList[this.virtualList.length - 1].top < rowHeight * this.loadedEntities.length - rowHeight) {
                var nextPosition = this.virtualList[this.virtualList.length - 1].top + rowHeight;
                if (nextPosition < this.currentPosition) {
                    this.updateDomElements();
                }
                else {
                    topElement.top = nextPosition;
                    if (topElement.domElement) {
                        topElement.domElement.style.transform = "translateY(".concat(topElement.top, "px)");
                    }
                    var pos = topElement.top / rowHeight;
                    var entity = this.loadedEntities[pos];
                    this.updateVirtualRow(topElement, entity, (pos % 2));
                    this.virtualList.push((0, tutanota_utils_1.assertNotNull)(this.virtualList.shift()));
                    topElement = this.virtualList[0];
                    bottomElement = topElement;
                }
            }
        }
        else {
            while (bottomElement.top > this.currentPosition + this.visibleElementsHeight + this.bufferHeight && topElement.top > 0) {
                var nextPosition = this.virtualList[0].top - rowHeight;
                if (nextPosition > this.currentPosition) {
                    this.updateDomElements();
                }
                else {
                    bottomElement.top = nextPosition;
                    if (bottomElement.domElement) {
                        bottomElement.domElement.style.transform = "translateY(".concat(bottomElement.top, "px)");
                    }
                    var pos = bottomElement.top / rowHeight;
                    var entity = this.loadedEntities[pos];
                    this.updateVirtualRow(bottomElement, entity, (pos % 2));
                    this.virtualList.unshift((0, tutanota_utils_1.assertNotNull)(this.virtualList.pop()));
                    topElement = bottomElement;
                    bottomElement = this.virtualList[this.virtualList.length - 1];
                }
            }
        }
    };
    List.prototype.loadMoreIfNecessary = function () {
        return __awaiter(this, void 0, void 0, function () {
            var lastBunchVisible;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // WARNING this is hacky:
                    // lastBunchVisible depends on visibleElementsHeight which is set inside _createVirtualRows which might not have completed by the time we
                    // reach here, so waiting for domDeferred guarantees that oncreate has finished running, and in turn that _createVirtualRows has completed
                    return [4 /*yield*/, this.domDeferred.promise];
                    case 1:
                        // WARNING this is hacky:
                        // lastBunchVisible depends on visibleElementsHeight which is set inside _createVirtualRows which might not have completed by the time we
                        // reach here, so waiting for domDeferred guarantees that oncreate has finished running, and in turn that _createVirtualRows has completed
                        _a.sent();
                        lastBunchVisible = this.currentPosition > this.loadedEntities.length * this.config.rowHeight - this.visibleElementsHeight * 2;
                        if (!(lastBunchVisible &&
                            !this.loadingState.isLoading() &&
                            !this.loadedCompletely &&
                            !this.loadingState.isConnectionLost())) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.loadMore()];
                    case 2:
                        _a.sent();
                        this.updateListHeight();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    List.prototype.retryLoading = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.loadingState.isConnectionLost()) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.loadMore()
                            // We might need to remove extra space for the "retry" list item.
                        ];
                    case 1:
                        _a.sent();
                        // We might need to remove extra space for the "retry" list item.
                        this.updateListHeight();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    List.prototype.repositionAfterScrollStop = function () {
        var _this = this;
        if (window.performance.now() - this.lastScrollUpdateTime > 100) {
            window.requestAnimationFrame(function () { return _this.updateDomElements(); });
        }
        else {
            this.repositionTimeout = setTimeout(function () { return _this.repositionAfterScrollStop(); }, 110);
        }
    };
    List.prototype.updateMessageBoxVisibility = function () {
        if (this.messageBoxDom) {
            this.messageBoxDom.style.display = this.loadedEntities.length === 0 && this.loadedCompletely && this.config.emptyMessage !== "" ? "" : "none";
        }
    };
    /**
     * Go over each list element and give it correct:
     *  - offset
     *  - background
     *  - visibility
     *  - selection indicator
     *
     *  Also updates message box visibility
     */
    List.prototype.updateDomElements = function () {
        var _this = this;
        if (!this.ready) {
            // If the list is not ready it will do this automatically on the first render.
            return;
        }
        this.updateMessageBoxVisibility();
        this.currentPosition = this.domListContainer.scrollTop;
        var rowHeight = this.config.rowHeight;
        var maxStartPosition = rowHeight * this.loadedEntities.length - this.bufferHeight * 2 - this.visibleElementsHeight;
        var nextPosition = this.currentPosition - (this.currentPosition % rowHeight) - this.bufferHeight;
        if (nextPosition < 0) {
            nextPosition = 0;
        }
        else if (nextPosition > maxStartPosition) {
            nextPosition = maxStartPosition;
        }
        for (var _i = 0, _a = this.virtualList; _i < _a.length; _i++) {
            var row = _a[_i];
            row.top = nextPosition;
            nextPosition = nextPosition + rowHeight;
            if (!row.domElement) {
                // This might happen during the window resize when things change too fast, just try again next time
                console.log("undefined dom element for virtual dom element ".concat(this.virtualList.length, ", ").concat(row.top));
                return;
            }
            row.domElement.style.transform = "translateY(" + row.top + "px)";
            var pos = row.top / rowHeight;
            var entity = this.loadedEntities[pos];
            this.updateVirtualRow(row, entity, (pos % 2));
        }
        this.loadingIndicatorDom.promise.then(function (dom) {
            if (_this.loadedEntities.length % 2 === 0) {
                dom.classList.add("odd-row");
            }
            else {
                dom.classList.add("odd-row");
            }
        });
        (0, Log_1.log)(Log_1.Cat.debug, "repositioned list");
        this.scrollUpdateLater = false;
    };
    List.prototype.updateListHeight = function () {
        if (!this.ready) {
            // If the list is not ready it will do this automatically on the first render.
            return;
        }
        this.domList.style.height = this.calculateListHeight();
    };
    List.prototype.redraw = function () {
        this.updateDomElements();
    };
    List.prototype.updateVirtualRow = function (row, entity, odd) {
        row.entity = entity;
        if (row.domElement) {
            if (odd) {
                row.domElement.classList.remove("odd-row");
            }
            else {
                row.domElement.classList.add("odd-row");
            }
            if (entity) {
                row.domElement.style.display = "list-item";
                row.update(entity, this.isEntitySelected((0, EntityUtils_1.getLetId)(entity)[1]));
            }
            else {
                row.domElement.style.display = "none";
            }
        }
    };
    /**
     * Selects the element with the given id and scrolls to it so it becomes visible.
     * Immediately selects the element if it is already existing in the list, otherwise waits until it is received via websocket, then selects it.
     */
    List.prototype.scrollToIdAndSelectWhenReceived = function (listElementId) {
        var entity = this.getEntity(listElementId);
        if (entity) {
            this.scrollToLoadedEntityAndSelect(entity, false);
        }
        else {
            this.idOfEntityToSelectWhenReceived = listElementId;
        }
    };
    /**
     * Selects the element with the given id and scrolls to it so it becomes visible. Loads the list until the given element is reached.
     * @return The entity or null if the entity is not in this list.
     */
    List.prototype.scrollToIdAndSelect = function (listElementId) {
        return __awaiter(this, void 0, void 0, function () {
            var entity, entity_1, scrollTarget, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        entity = this.getEntity(listElementId);
                        if (!entity) return [3 /*break*/, 1];
                        this.scrollToLoadedEntityAndSelect(entity, false);
                        return [2 /*return*/, entity];
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, this.config.loadSingle(listElementId)];
                    case 2:
                        entity_1 = _a.sent();
                        if (!entity_1) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, this.loadUntil(listElementId)];
                    case 3:
                        scrollTarget = _a.sent();
                        return [4 /*yield*/, this.domDeferred.promise];
                    case 4:
                        _a.sent();
                        this.updateListHeight();
                        if (scrollTarget != null) {
                            this.scrollToLoadedEntityAndSelect(scrollTarget, false);
                        }
                        return [2 /*return*/, scrollTarget];
                    case 5:
                        e_2 = _a.sent();
                        if (e_2 instanceof RestError_1.BadRequestError) {
                            console.log("invalid element id", listElementId, e_2);
                            return [2 /*return*/, null];
                        }
                        else {
                            throw e_2;
                        }
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    List.prototype.scrollToLoadedEntityAndSelect = function (scrollTarget, addToSelection) {
        var _this = this;
        // check if the element is visible already. only scroll if it is not visible
        for (var i = 0; i < this.virtualList.length; i++) {
            if (this.virtualList[i].entity === scrollTarget) {
                if (this.virtualList[i].top - this.currentPosition > 0 &&
                    this.virtualList[i].top - this.currentPosition < this.visibleElementsHeight - this.config.rowHeight) {
                    this.entitySelected(scrollTarget, addToSelection);
                    // we do not need to scroll
                    return;
                }
                break;
            }
        }
        this.domDeferred.promise.then(function () {
            _this.domListContainer.scrollTop = _this.loadedEntities.indexOf(scrollTarget) * _this.config.rowHeight;
            _this.entitySelected(scrollTarget, addToSelection);
        });
    };
    List.prototype.loadUntil = function (targetElementId) {
        return __awaiter(this, void 0, void 0, function () {
            var scrollTarget, e_3;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        scrollTarget = this.loadedEntities.find(function (e) { return (0, EntityUtils_1.getElementId)(e) === targetElementId; });
                        if (!(scrollTarget != null ||
                            this.loadedCompletely ||
                            (this.loadedEntities.length > 0 && (0, EntityUtils_1.firstBiggerThanSecond)(targetElementId, (0, EntityUtils_1.getElementId)((0, tutanota_utils_1.lastThrow)(this.loadedEntities)))))) return [3 /*break*/, 1];
                        return [2 /*return*/, scrollTarget !== null && scrollTarget !== void 0 ? scrollTarget : null];
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, this.loadingState.trackPromise(this.loadAndAppendAnotherChunk().then(function () { return _this.loadUntil(targetElementId); }))];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        e_3 = _a.sent();
                        if ((0, ErrorCheckUtils_js_1.isOfflineError)(e_3)) {
                            return [2 /*return*/, null];
                        }
                        else {
                            throw e_3;
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        mithril_1["default"].redraw();
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    List.prototype.entityEventReceived = function (elementId, operation) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var entity_2;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(operation === "0" /* OperationType.CREATE */ || operation === "1" /* OperationType.UPDATE */)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.config.loadSingle(elementId)];
                    case 1:
                        entity_2 = _b.sent();
                        if (!entity_2) {
                            return [2 /*return*/];
                        }
                        // Wait for any pending loading
                        return [2 /*return*/, settledThen(this.loading, function () {
                                if (operation === "0" /* OperationType.CREATE */) {
                                    if (_this.loadedCompletely) {
                                        _this.addToLoadedEntities(entity_2);
                                    }
                                    else if (_this.loadedEntities.length > 0 && _this.config.sortCompare(entity_2, (0, tutanota_utils_1.lastThrow)(_this.loadedEntities)) < 0) {
                                        // new element is in the loaded range or newer than the first element
                                        _this.addToLoadedEntities(entity_2);
                                    }
                                }
                                else if (operation === "1" /* OperationType.UPDATE */) {
                                    _this.updateLoadedEntity(entity_2);
                                }
                            })];
                    case 2:
                        if (!(operation === "2" /* OperationType.DELETE */)) return [3 /*break*/, 5];
                        return [4 /*yield*/, ((_a = this.swipeHandler) === null || _a === void 0 ? void 0 : _a.animating)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, this.deleteLoadedEntity(elementId)];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    List.prototype.addToLoadedEntities = function (entity) {
        for (var i = 0; i < this.loadedEntities.length; i++) {
            if ((0, EntityUtils_1.getElementId)(entity) === (0, EntityUtils_1.getElementId)(this.loadedEntities[i])) {
                return;
            }
        }
        this.loadedEntities.push(entity);
        this.lastElementChangeMarker = {};
        this.loadedEntities.sort(this.config.sortCompare);
        this.updateListHeight();
        this.updateDomElements();
        if (this.idOfEntityToSelectWhenReceived && this.idOfEntityToSelectWhenReceived === (0, EntityUtils_1.getElementId)(entity)) {
            this.idOfEntityToSelectWhenReceived = null;
            this.scrollToLoadedEntityAndSelect(entity, false);
        }
    };
    List.prototype.updateLoadedEntity = function (entity) {
        for (var positionToUpdate = 0; positionToUpdate < this.loadedEntities.length; positionToUpdate++) {
            if ((0, EntityUtils_1.getElementId)(entity) === (0, EntityUtils_1.getElementId)(this.loadedEntities[positionToUpdate])) {
                this.loadedEntities.splice(positionToUpdate, 1, entity);
                this.lastElementChangeMarker = {};
                this.loadedEntities.sort(this.config.sortCompare);
                this.updateDomElements();
                break;
            }
        }
        for (var i = 0; i < this.selectedEntities.length; i++) {
            if ((0, EntityUtils_1.getElementId)(entity) === (0, EntityUtils_1.getElementId)(this.selectedEntities[i])) {
                this.selectedEntities[i] = entity;
                break;
            }
        }
    };
    List.prototype.deleteLoadedEntity = function (elementId) {
        var _this = this;
        // wait for any pending loading
        return settledThen(this.loading, function () {
            var entity = _this.loadedEntities.find(function (e) { return (0, EntityUtils_1.getElementId)(e) === elementId; });
            if (entity) {
                var nextElementSelected = false;
                if (_this.selectedEntities.length === 1 && _this.selectedEntities[0] === entity && _this.loadedEntities.length > 1) {
                    var nextSelection = entity === (0, tutanota_utils_1.last)(_this.loadedEntities)
                        ? _this.loadedEntities[_this.loadedEntities.length - 2]
                        : _this.loadedEntities[_this.loadedEntities.indexOf(entity) + 1];
                    _this.selectedEntities.push(nextSelection);
                    nextElementSelected = true;
                }
                (0, tutanota_utils_1.remove)(_this.loadedEntities, entity);
                _this.lastElementChangeMarker = {};
                var selectionChanged = (0, tutanota_utils_1.remove)(_this.selectedEntities, entity);
                _this.updateListHeight();
                _this.updateDomElements();
                if (selectionChanged) {
                    _this.elementSelected(_this.getSelectedEntities(), false, !nextElementSelected);
                }
                // trigger loading new elements before the scrollbar disappears and no reload can be triggered any more by scrolling
                _this.loadMoreIfNecessary();
            }
        });
    };
    List.prototype.isMobileMultiSelectionActionActive = function () {
        return this.mobileMultiSelectionActive;
    };
    List.prototype.getLoadedEntities = function () {
        return this.loadedEntities;
    };
    /**
     * when called at time A, returns a function that, when called at a later time B, will return whether
     * the set of elements in the list changed between time A and time B
     */
    List.prototype.markCurrentState = function () {
        var _this = this;
        var lastMarker = this.lastElementChangeMarker;
        return function () { return lastMarker !== _this.lastElementChangeMarker; };
    };
    return List;
}());
exports.List = List;
exports.ACTION_DISTANCE = 150;
/** Call the handler for both resolution and rejection. Unlike finally() will not propagate the error. */
function settledThen(promise, handler) {
    return promise.then(handler, handler);
}
/** Detects swipe gestures for list elements. On mobile some lists have actions on swiping, e.g. deleting an email. */
var ListSwipeHandler = /** @class */ (function (_super) {
    __extends(ListSwipeHandler, _super);
    function ListSwipeHandler(touchArea, list) {
        var _this = _super.call(this, touchArea) || this;
        _this.virtualElement = null;
        _this.list = list;
        return _this;
    }
    ListSwipeHandler.prototype.onHorizontalDrag = function (xDelta, yDelta) {
        var _this = this;
        _super.prototype.onHorizontalDrag.call(this, xDelta, yDelta);
        // get it *before* raf so that we don't pick an element after reset() again
        var ve = this.getVirtualElement();
        // Animate the row with following touch
        window.requestAnimationFrame(function () {
            // Do not animate the swipe gesture more than necessary
            _this.xoffset = xDelta < 0 ? Math.max(xDelta, -exports.ACTION_DISTANCE) : Math.min(xDelta, exports.ACTION_DISTANCE);
            if (!_this.isAnimating && ve && ve.domElement && ve.entity) {
                ve.domElement.style.transform = "translateX(".concat(_this.xoffset, "px) translateY(").concat(ve.top, "px)");
                _this.list.domSwipeSpacerLeft.style.transform = "translateX(".concat(_this.xoffset - _this.list.width, "px) translateY(").concat(ve.top, "px)");
                _this.list.domSwipeSpacerRight.style.transform = "\n\t\t\t\ttranslateX(".concat(_this.xoffset + _this.list.width, "px) translateY(").concat(ve.top, "px)");
            }
        });
    };
    ListSwipeHandler.prototype.onHorizontalGestureCompleted = function (delta) {
        if (this.virtualElement && this.virtualElement.entity && Math.abs(delta.x) > exports.ACTION_DISTANCE) {
            // Gesture is completed
            var entity = this.virtualElement.entity;
            var swipePromise = void 0;
            if (delta.x < 0) {
                swipePromise = this.list.config.swipe.swipeLeft(entity);
            }
            else {
                swipePromise = this.list.config.swipe.swipeRight(entity);
            }
            return this.finish((0, EntityUtils_1.getElementId)(entity), swipePromise, delta);
        }
        else {
            return this.reset(delta);
        }
    };
    ListSwipeHandler.prototype.finish = function (id, swipeActionPromise, delta) {
        var _this = this;
        if (this.xoffset !== 0) {
            var ve_1 = (0, tutanota_utils_1.neverNull)(this.virtualElement);
            var listTargetPosition_1 = this.xoffset < 0 ? -this.list.width : this.list.width;
            swipeActionPromise = swipeActionPromise
                .then(function (commit) { return commit !== false; })["catch"](function (e) {
                console.error("rejection in swipe action", e);
                return false;
            });
            return Promise.all([
                // animate swipe action to full width
                ve_1.domElement &&
                    Animations_1.animations.add(ve_1.domElement, (0, Animations_1.transform)("translateX" /* TransformEnum.TranslateX */, this.xoffset, listTargetPosition_1).chain("translateY" /* TransformEnum.TranslateY */, ve_1.top, ve_1.top), {
                        easing: Easing_1.ease.inOut,
                        duration: Animations_1.DefaultAnimationTime * 2
                    }),
                Animations_1.animations.add(this.list.domSwipeSpacerLeft, (0, Animations_1.transform)("translateX" /* TransformEnum.TranslateX */, this.xoffset - this.list.width, listTargetPosition_1 - this.list.width).chain("translateY" /* TransformEnum.TranslateY */, ve_1.top, ve_1.top), {
                    easing: Easing_1.ease.inOut,
                    duration: Animations_1.DefaultAnimationTime * 2
                }),
                Animations_1.animations.add(this.list.domSwipeSpacerRight, (0, Animations_1.transform)("translateX" /* TransformEnum.TranslateX */, this.xoffset + this.list.width, listTargetPosition_1 + this.list.width).chain("translateY" /* TransformEnum.TranslateY */, ve_1.top, ve_1.top), {
                    easing: Easing_1.ease.inOut,
                    duration: Animations_1.DefaultAnimationTime * 2
                }),
            ])
                .then(function () { return (_this.xoffset = listTargetPosition_1); })
                .then(function () { return swipeActionPromise; })
                .then(function (success) {
                if (success) {
                    return _this.list
                        .deleteLoadedEntity(id)
                        .then(function () {
                        // fade out element
                        _this.xoffset = 0;
                        if (ve_1.domElement) {
                            ve_1.domElement.style.transform = "translateX(".concat(_this.xoffset, "px) translateY(").concat(ve_1.top, "px)");
                        }
                        return Promise.all([
                            Animations_1.animations.add(_this.list.domSwipeSpacerLeft, (0, Animations_1.opacity)(1, 0, true)),
                            Animations_1.animations.add(_this.list.domSwipeSpacerRight, (0, Animations_1.opacity)(1, 0, true)),
                        ]);
                    })
                        .then(function () {
                        // set swipe element to initial configuration
                        _this.list.domSwipeSpacerLeft.style.transform = "translateX(".concat(_this.xoffset - _this.list.width, "px) translateY(").concat(ve_1.top, "px)");
                        _this.list.domSwipeSpacerRight.style.transform = "translateX(".concat(_this.xoffset + _this.list.width, "px) translateY(").concat(ve_1.top, "px)");
                        _this.list.domSwipeSpacerRight.style.opacity = "";
                        _this.list.domSwipeSpacerLeft.style.opacity = "";
                    });
                }
                else {
                    return _this.reset(delta);
                }
            })["finally"](function () {
                _this.virtualElement = null;
            });
        }
        else {
            return Promise.resolve();
        }
    };
    ListSwipeHandler.prototype.getVirtualElement = function () {
        var _a;
        if (!this.virtualElement) {
            var touchAreaOffset = this.touchArea.getBoundingClientRect().top;
            var relativeYposition = this.list.currentPosition + this.startPos.y - touchAreaOffset;
            var targetElementPosition_1 = Math.floor(relativeYposition / this.list.config.rowHeight) * this.list.config.rowHeight;
            this.virtualElement = (_a = this.list.virtualList.find(function (ve) { return ve.top === targetElementPosition_1; })) !== null && _a !== void 0 ? _a : null;
        }
        return (0, tutanota_utils_1.assertNotNull)(this.virtualElement);
    };
    ListSwipeHandler.prototype.updateWidth = function () {
        this.list.domSwipeSpacerLeft.style.width = (0, size_1.px)(this.list.width);
        this.list.domSwipeSpacerRight.style.width = (0, size_1.px)(this.list.width);
        this.list.domSwipeSpacerLeft.style.transform = "translateX(".concat(-this.list.width, "px) translateY(0px)");
        this.list.domSwipeSpacerRight.style.transform = "translateX(".concat(this.list.width, "px) translateY(0px)");
        this.list.virtualList.forEach(function (element) {
            element.domElement && (0, HtmlUtils_1.applySafeAreaInsetMarginLR)(element.domElement);
        });
    };
    ListSwipeHandler.prototype.reset = function (delta) {
        try {
            if (this.xoffset !== 0) {
                var ve = this.virtualElement;
                if (ve && ve.domElement && ve.entity) {
                    return Promise.all([
                        Animations_1.animations.add(ve.domElement, (0, Animations_1.transform)("translateX" /* TransformEnum.TranslateX */, this.xoffset, 0).chain("translateY" /* TransformEnum.TranslateY */, ve.top, ve.top), {
                            easing: Easing_1.ease.inOut
                        }),
                        Animations_1.animations.add(this.list.domSwipeSpacerLeft, (0, Animations_1.transform)("translateX" /* TransformEnum.TranslateX */, this.xoffset - this.list.width, -this.list.width).chain("translateY" /* TransformEnum.TranslateY */, ve.top, ve.top), {
                            easing: Easing_1.ease.inOut
                        }),
                        Animations_1.animations.add(this.list.domSwipeSpacerRight, (0, Animations_1.transform)("translateX" /* TransformEnum.TranslateX */, this.xoffset + this.list.width, this.list.width).chain("translateY" /* TransformEnum.TranslateY */, ve.top, ve.top), {
                            easing: Easing_1.ease.inOut
                        }),
                    ]);
                }
                this.xoffset = 0;
            }
        }
        finally {
            this.virtualElement = null;
        }
        return Promise.resolve();
    };
    return ListSwipeHandler;
}(SwipeHandler_1.SwipeHandler));
function listSelectionKeyboardShortcuts(list) {
    return [
        {
            key: TutanotaConstants_1.Keys.UP,
            exec: (0, tutanota_utils_1.mapLazily)(list, function (list) { return list.selectPrevious(false); }),
            help: "selectPrevious_action"
        },
        {
            key: TutanotaConstants_1.Keys.K,
            exec: (0, tutanota_utils_1.mapLazily)(list, function (list) { return list.selectPrevious(false); }),
            help: "selectPrevious_action"
        },
        {
            key: TutanotaConstants_1.Keys.UP,
            shift: true,
            exec: (0, tutanota_utils_1.mapLazily)(list, function (list) { return list.selectPrevious(true); }),
            help: "addPrevious_action"
        },
        {
            key: TutanotaConstants_1.Keys.K,
            shift: true,
            exec: (0, tutanota_utils_1.mapLazily)(list, function (list) { return list.selectPrevious(true); }),
            help: "addPrevious_action"
        },
        {
            key: TutanotaConstants_1.Keys.DOWN,
            exec: (0, tutanota_utils_1.mapLazily)(list, function (list) { return list.selectNext(false); }),
            help: "selectNext_action"
        },
        {
            key: TutanotaConstants_1.Keys.J,
            exec: (0, tutanota_utils_1.mapLazily)(list, function (list) { return list.selectNext(false); }),
            help: "selectNext_action"
        },
        {
            key: TutanotaConstants_1.Keys.DOWN,
            shift: true,
            exec: (0, tutanota_utils_1.mapLazily)(list, function (list) { return list.selectNext(true); }),
            help: "addNext_action"
        },
        {
            key: TutanotaConstants_1.Keys.J,
            shift: true,
            exec: (0, tutanota_utils_1.mapLazily)(list, function (list) { return list.selectNext(true); }),
            help: "addNext_action"
        },
    ];
}
exports.listSelectionKeyboardShortcuts = listSelectionKeyboardShortcuts;
