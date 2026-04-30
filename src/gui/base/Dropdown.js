"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.showDropdown = exports.DROPDOWN_MARGIN = exports.attachDropdown = exports.showDropdownAtPosition = exports.createAsyncDropdown = exports.createDropdown = exports.Dropdown = exports.DomRectReadOnlyPolyfilled = void 0;
var mithril_1 = require("mithril");
var Modal_1 = require("./Modal");
var Animations_1 = require("../animation/Animations");
var Easing_1 = require("../animation/Easing");
var size_1 = require("../size");
var KeyManager_1 = require("../../misc/KeyManager");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var TutanotaConstants_1 = require("../../api/common/TutanotaConstants");
var HtmlUtils_1 = require("../HtmlUtils");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var ClientDetector_1 = require("../../misc/ClientDetector");
var PureComponent_1 = require("./PureComponent");
var Env_1 = require("../../api/common/Env");
var Icon_js_1 = require("./Icon.js");
var theme_js_1 = require("../theme.js");
(0, Env_1.assertMainOrNode)();
/**
 * Renders small info message inside the dropdown.
 */
var DropdownInfo = (0, PureComponent_1.pureComponent)(function (_a) {
    var center = _a.center, bold = _a.bold, info = _a.info;
    return (0, mithril_1["default"])(".dropdown-info.text-break.selectable" + (center ? ".center" : "") + (bold ? ".b" : ""), info);
});
function isDropDownInfo(dropdownChild) {
    return dropdownChild.hasOwnProperty("info") && dropdownChild.hasOwnProperty("center") && dropdownChild.hasOwnProperty("bold");
}
// Some Android WebViews still don't support DOMRect so we polyfill that
// Implemented according to https://developer.mozilla.org/en-US/docs/Web/API/DOMRectReadOnly and common sense
var DomRectReadOnlyPolyfilled = /** @class */ (function () {
    function DomRectReadOnlyPolyfilled(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    Object.defineProperty(DomRectReadOnlyPolyfilled.prototype, "top", {
        get: function () {
            return this.height > 0 ? this.y : this.y + this.height;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DomRectReadOnlyPolyfilled.prototype, "bottom", {
        get: function () {
            return this.height > 0 ? this.y + this.height : this.y;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DomRectReadOnlyPolyfilled.prototype, "left", {
        get: function () {
            return this.width > 0 ? this.x : this.x + this.width;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DomRectReadOnlyPolyfilled.prototype, "right", {
        get: function () {
            return this.width > 0 ? this.x + this.width : this.x;
        },
        enumerable: false,
        configurable: true
    });
    return DomRectReadOnlyPolyfilled;
}());
exports.DomRectReadOnlyPolyfilled = DomRectReadOnlyPolyfilled;
// TODO: add resize listener like in the old Dropdown
var Dropdown = /** @class */ (function () {
    function Dropdown(lazyChildren, width) {
        var _this = this;
        this._domDropdown = null;
        this.origin = null;
        this._domInput = null;
        this._domContents = null;
        this._isFilterable = false;
        this._maxHeight = null;
        this.chooseMatch = function () {
            var filterString = _this._filterString.toLowerCase();
            var visibleElements = (0, tutanota_utils_1.downcast)(_this._visibleChildren().filter(function (b) { return !isDropDownInfo(b); }));
            var matchingButton = visibleElements.length === 1 ? visibleElements[0] : visibleElements.find(function (b) { return LanguageViewModel_1.lang.getMaybeLazy(b.label).toLowerCase() === filterString; });
            if (_this._domInput && document.activeElement === _this._domInput && matchingButton && matchingButton.click) {
                var click = matchingButton.click;
                click((0, HtmlUtils_1.newMouseEvent)(), _this._domInput);
                return false;
            }
            return true;
        };
        this.children = [];
        this._width = width;
        this._filterString = "";
        this.oninit = function () {
            _this.children = (0, tutanota_utils_1.filterNull)(lazyChildren());
            _this._isFilterable = _this.children.length > 10;
            _this.children.map(function (child) {
                if (isDropDownInfo(child)) {
                    return child;
                }
                var buttonChild = child;
                buttonChild.click = _this.wrapClick(child.click ? child.click : function () { return null; });
                return child;
            });
        };
        var _shortcuts = this._createShortcuts();
        this.shortcuts = function () {
            return _shortcuts;
        };
        var _inputField = function () {
            return _this._isFilterable
                ? (0, mithril_1["default"])("input.dropdown-bar.elevated-bg.doNotClose.pl-l.button-height.abs", {
                    placeholder: LanguageViewModel_1.lang.get("typeToFilter_label"),
                    oncreate: function (vnode) {
                        _this._domInput = (0, tutanota_utils_1.downcast)(vnode.dom);
                        _this._domInput.value = _this._filterString;
                    },
                    oninput: function () {
                        _this._filterString = (0, tutanota_utils_1.neverNull)(_this._domInput).value;
                    },
                    style: {
                        paddingLeft: (0, size_1.px)(size_1.size.hpad_large * 2),
                        paddingRight: (0, size_1.px)(size_1.size.hpad_small),
                        width: (0, size_1.px)(_this._width - size_1.size.hpad_large),
                        top: 0,
                        height: (0, size_1.px)(size_1.size.button_height),
                        left: 0
                    }
                }, _this._filterString)
                : null;
        };
        var _contents = function () {
            var showingIcons = _this.children.some(function (c) { return "icon" in c && typeof c.icon !== "undefined"; });
            return (0, mithril_1["default"])(".dropdown-content.scroll.abs", {
                role: "menu",
                tabindex: "0" /* TabIndex.Default */,
                oncreate: function (vnode) {
                    _this._domContents = vnode.dom;
                },
                onupdate: function (vnode) {
                    if (_this._maxHeight == null) {
                        var children = Array.from(vnode.dom.children);
                        _this._maxHeight = children.reduce(function (accumulator, children) { return accumulator + children.offsetHeight; }, 0) + size_1.size.vpad;
                        if (_this.origin) {
                            // The dropdown-content element is added to the dom has a hidden element first.
                            // The maxHeight is available after the first onupdate call. Then this promise will resolve and we can safely
                            // show the dropdown.
                            // Modal always schedules redraw in oncreate() of a component so we are guaranteed to have onupdate() call.
                            showDropdown(_this.origin, (0, tutanota_utils_1.assertNotNull)(_this._domDropdown), _this._maxHeight, _this._width).then(function () {
                                var _a;
                                if (_this._domInput && !ClientDetector_1.client.isMobileDevice()) {
                                    _this._domInput.focus();
                                }
                                else {
                                    (_a = _this._domContents) === null || _a === void 0 ? void 0 : _a.focus();
                                }
                            });
                        }
                    }
                },
                onscroll: function (ev) {
                    var target = ev.target;
                    // needed here to prevent flickering on ios
                    ev.redraw = _this._domContents != null && target.scrollTop < 0 && target.scrollTop + _this._domContents.offsetHeight > target.scrollHeight;
                },
                style: {
                    // Fixed width for the content of this dropdown is needed to avoid that the elements in the dropdown move during
                    // animation.
                    width: (0, size_1.px)(_this._width),
                    top: (0, size_1.px)(_this._getFilterHeight()),
                    bottom: 0
                }
            }, _this._visibleChildren().map(function (child) {
                if (isDropDownInfo(child)) {
                    return (0, mithril_1["default"])(DropdownInfo, child);
                }
                else {
                    return (0, mithril_1["default"])(DropdownButton, __assign(__assign({}, child), { showingIcons: showingIcons }));
                }
            }));
        };
        this.view = function () {
            return (0, mithril_1["default"])(".dropdown-panel.elevated-bg.border-radius.dropdown-shadow", {
                oncreate: function (vnode) {
                    _this._domDropdown = vnode.dom;
                    // It is important to set initial opacity so that user doesn't see it with full opacity before animating.
                    _this._domDropdown.style.opacity = "0";
                },
                onkeypress: function () {
                    if (_this._domInput) {
                        _this._domInput.focus();
                    }
                }
            }, [_inputField(), _contents()]);
        };
    }
    Dropdown.prototype.wrapClick = function (fn) {
        var _this = this;
        return function (e, dom) {
            var r = fn(e, dom);
            _this.close();
            return r;
        };
    };
    Dropdown.prototype.backgroundClick = function (e) {
        if (this._domDropdown &&
            !e.target.classList.contains("doNotClose") &&
            (this._domDropdown.contains(e.target) || this._domDropdown.parentNode === e.target)) {
            Modal_1.modal.remove(this);
        }
    };
    Dropdown.prototype._createShortcuts = function () {
        var _this = this;
        return [
            {
                key: TutanotaConstants_1.Keys.ESC,
                exec: function () { return _this.close(); },
                help: "close_alt"
            },
            {
                key: TutanotaConstants_1.Keys.TAB,
                shift: true,
                exec: function () { return _this._domDropdown ? (0, KeyManager_1.focusPrevious)(_this._domDropdown) : false; },
                help: "selectPrevious_action"
            },
            {
                key: TutanotaConstants_1.Keys.TAB,
                shift: false,
                exec: function () { return _this._domDropdown ? (0, KeyManager_1.focusNext)(_this._domDropdown) : false; },
                help: "selectNext_action"
            },
            {
                key: TutanotaConstants_1.Keys.UP,
                exec: function () { return _this._domDropdown ? (0, KeyManager_1.focusPrevious)(_this._domDropdown) : false; },
                help: "selectPrevious_action"
            },
            {
                key: TutanotaConstants_1.Keys.DOWN,
                exec: function () { return _this._domDropdown ? (0, KeyManager_1.focusNext)(_this._domDropdown) : false; },
                help: "selectNext_action"
            },
            {
                key: TutanotaConstants_1.Keys.RETURN,
                exec: function () { return _this.chooseMatch(); },
                help: "ok_action"
            },
        ];
    };
    Dropdown.prototype.setOrigin = function (origin) {
        this.origin = origin;
    };
    Dropdown.prototype.close = function () {
        Modal_1.modal.remove(this);
    };
    Dropdown.prototype.onClose = function () {
        this.close();
    };
    Dropdown.prototype.popState = function (e) {
        this.close();
        return true;
    };
    /**
     * Is invoked from modal as the two animations (background layer opacity and dropdown) should run in parallel
     */
    Dropdown.prototype.hideAnimation = function () {
        return Promise.resolve();
    };
    Dropdown.prototype._visibleChildren = function () {
        var _this = this;
        return this.children.filter(function (b) {
            if (isDropDownInfo(b)) {
                return b.info.includes(_this._filterString.toLowerCase());
            }
            else if (_this._isFilterable) {
                return LanguageViewModel_1.lang.getMaybeLazy(b.label).toLowerCase().includes(_this._filterString.toLowerCase());
            }
            else {
                return true;
            }
        });
    };
    Dropdown.prototype._getFilterHeight = function () {
        return this._isFilterable ? size_1.size.button_height + size_1.size.vpad_xs : 0;
    };
    return Dropdown;
}());
exports.Dropdown = Dropdown;
function createDropdown(_a) {
    var _this = this;
    var lazyButtons = _a.lazyButtons, overrideOrigin = _a.overrideOrigin, width = _a.width, withBackground = _a.withBackground;
    return createAsyncDropdown({ lazyButtons: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, lazyButtons()];
        }); }); }, overrideOrigin: overrideOrigin, width: width, withBackground: withBackground });
}
exports.createDropdown = createDropdown;
function createAsyncDropdown(_a) {
    var lazyButtons = _a.lazyButtons, overrideOrigin = _a.overrideOrigin, _b = _a.width, width = _b === void 0 ? 200 : _b, _c = _a.withBackground, withBackground = _c === void 0 ? false : _c;
    // not all browsers have the actual button as e.currentTarget, but all of them send it as a second argument (see https://github.com/tutao/tutanota/issues/1110)
    return function (e, dom) {
        var originalButtons = lazyButtons();
        var buttonsResolved = false;
        originalButtons.then(function () {
            buttonsResolved = true;
        });
        var buttons = originalButtons;
        // If the promise is pending and does not resolve in 100ms, show progress dialog
        buttons = Promise.race([
            originalButtons,
            Promise.all([(0, tutanota_utils_1.delay)(100), Promise.resolve().then(function () { return require("../dialogs/ProgressDialog.js"); })]).then(function (_a) {
                var _ = _a[0], module = _a[1];
                if (!buttonsResolved) {
                    return module.showProgressDialog("loading_msg", originalButtons);
                }
                else {
                    return originalButtons;
                }
            }),
        ]);
        buttons.then(function (buttons) {
            var dropdown = new Dropdown(function () { return buttons; }, width);
            var buttonRect;
            if (overrideOrigin) {
                buttonRect = overrideOrigin(dom.getBoundingClientRect());
            }
            else {
                // When new instance is created and the old DOM is detached we may have incorrect positioning
                buttonRect = dom.getBoundingClientRect();
            }
            dropdown.setOrigin(buttonRect);
            Modal_1.modal.displayUnique(dropdown, withBackground);
        });
    };
}
exports.createAsyncDropdown = createAsyncDropdown;
function showDropdownAtPosition(buttons, xPos, yPos, width) {
    if (width === void 0) { width = 200; }
    var dropdown = new Dropdown(function () { return buttons; }, width);
    dropdown.setOrigin(new DomRectReadOnlyPolyfilled(xPos, yPos, 0, 0));
    Modal_1.modal.displayUnique(dropdown, false);
}
exports.showDropdownAtPosition = showDropdownAtPosition;
/**
 *
 * @param mainButtonAttrs the attributes of the main button. if showDropdown returns false, this buttons onclick will
 * be executed instead of opening the dropdown.
 * @param childAttrs the attributes of the children shown in the dropdown
 * @param showDropdown this will be checked before showing the dropdown
 * @param width width of the dropdown
 * @returns {ButtonAttrs} modified mainButtonAttrs that shows a dropdown on click or
 * button doesn't do anything if showDropdown returns false
 */
function attachDropdown(_a) {
    var mainButtonAttrs = _a.mainButtonAttrs, childAttrs = _a.childAttrs, _b = _a.showDropdown, showDropdown = _b === void 0 ? function () { return true; } : _b, width = _a.width, overrideOrigin = _a.overrideOrigin;
    return Object.assign({}, mainButtonAttrs, {
        click: function (e, dom) {
            if (showDropdown()) {
                var dropDownFn = createAsyncDropdown({ lazyButtons: function () { return Promise.resolve(childAttrs()); }, overrideOrigin: overrideOrigin, width: width });
                dropDownFn(e, dom);
                e.stopPropagation();
            }
        }
    });
}
exports.attachDropdown = attachDropdown;
exports.DROPDOWN_MARGIN = 4;
function showDropdown(origin, domDropdown, contentHeight, contentWidth) {
    // |------------------|    |------------------|    |------------------|    |------------------|
    // |                  |    |                  |    |                  |    |                  |
    // |      |-------|   |    |  |-------|       |    |  |-----------|   |    |  |-----------|   |
    // |      | elem  |   |    |  | elem  |       |    |  | dropdown  |   |    |  | dropdown  |   |
    // |      |-------|   |    |  |-------|       |    |  |-----------|   |    |  |-----------|   |
    // |  |-----------|   |    |  |-----------|   |    |      |-------|   |    |  |-------|       |
    // |  | dropdown  |   |    |  | dropdown  |   |    |      | elem  |   |    |  | elem  |       |
    // /  |-----------|   |    |  |-----------|   |    |      |-------|   |    |  |-------|       |
    //
    // Decide were to open dropdown. We open the dropdown depending on the position of the touched element.
    // For that we devide the screen into four parts which are upper/lower and right/left part of the screen.
    // If the element is in the upper right part for example we try to open the dropdown below the touched element
    // starting from the right edge of the touched element.
    // If the element is in the lower left part of the screen we open the dropdown above the element
    // starting from the left edge of the touched element.
    // If the dropdown width does not fit from its calculated starting position we open it from the edge of the screen.
    var leftEdgeOfElement = origin.left;
    var rightEdgeOfElement = origin.right;
    var bottomEdgeOfElement = origin.bottom;
    var topEdgeOfElement = origin.top;
    var upperSpace = origin.top - (0, HtmlUtils_1.getSafeAreaInsetTop)();
    var lowerSpace = window.innerHeight - origin.bottom - (0, HtmlUtils_1.getSafeAreaInsetBottom)();
    var leftSpace = origin.left;
    var rightSpace = window.innerWidth - origin.right;
    var transformOrigin = "";
    var maxHeight;
    if (lowerSpace > upperSpace) {
        // element is in the upper part of the screen, dropdown should be below the element
        transformOrigin += "top";
        domDropdown.style.top = bottomEdgeOfElement + "px";
        domDropdown.style.bottom = "";
        maxHeight = Math.min(contentHeight, lowerSpace);
    }
    else {
        // element is in the lower part of the screen, dropdown should be above the element
        transformOrigin += "bottom";
        domDropdown.style.top = "";
        // position bottom is defined from the bottom edge of the screen
        // and not like the viewport origin which starts at top/left
        domDropdown.style.bottom = (0, size_1.px)(window.innerHeight - topEdgeOfElement);
        maxHeight = Math.min(contentHeight, upperSpace);
    }
    var width = contentWidth;
    if (leftSpace < rightSpace) {
        // element is in the left part of the screen, dropdown should extend to the right from the element
        transformOrigin += " left";
        var availableSpaceForDropdown = window.innerWidth - leftEdgeOfElement;
        var leftEdgeOfDropdown = leftEdgeOfElement;
        if (availableSpaceForDropdown < contentWidth) {
            // If the dropdown does not fit, we shift it by the required amount. If it still does not fit, we reduce the width.
            var shiftForDropdown = contentWidth - availableSpaceForDropdown + exports.DROPDOWN_MARGIN;
            leftEdgeOfDropdown = leftEdgeOfElement - shiftForDropdown;
            width = Math.min(width, window.innerWidth - exports.DROPDOWN_MARGIN * 2);
        }
        domDropdown.style.left = (0, size_1.px)(Math.max(exports.DROPDOWN_MARGIN, leftEdgeOfDropdown));
        domDropdown.style.right = "";
    }
    else {
        // element is in the right part of the screen, dropdown should extend to the left from the element
        transformOrigin += " right";
        var availableSpaceForDropdown = origin.right;
        var rightEdgeOfDropdown = rightEdgeOfElement;
        if (availableSpaceForDropdown < contentWidth) {
            // If the dropdown does not fit, we shift it by the required amount. If it still does not fit, we reduce the width.
            var shiftForDropdown = contentWidth - availableSpaceForDropdown + exports.DROPDOWN_MARGIN;
            rightEdgeOfDropdown = rightEdgeOfElement + shiftForDropdown;
            width = Math.min(width, window.innerWidth - exports.DROPDOWN_MARGIN * 2);
        }
        domDropdown.style.left = "";
        // position right is defined from the right edge of the screen
        // and not like the viewport origin which starts at top/left
        domDropdown.style.right = (0, size_1.px)(Math.max(exports.DROPDOWN_MARGIN, window.innerWidth - rightEdgeOfDropdown));
    }
    domDropdown.style.width = (0, size_1.px)(width);
    domDropdown.style.height = (0, size_1.px)(maxHeight);
    domDropdown.style.transformOrigin = transformOrigin;
    return Animations_1.animations.add(domDropdown, [(0, Animations_1.opacity)(0, 1, true), (0, Animations_1.transform)("scale" /* TransformEnum.Scale */, 0.5, 1)], {
        easing: Easing_1.ease.out
    });
}
exports.showDropdown = showDropdown;
var DropdownButton = /** @class */ (function () {
    function DropdownButton() {
        this.dom = null;
    }
    DropdownButton.prototype.view = function (_a) {
        var _this = this;
        var attrs = _a.attrs;
        var color = attrs.selected ? theme_js_1.theme.content_button_selected : theme_js_1.theme.content_button;
        return (0, mithril_1["default"])("button.flex.dropdown-button.items-center.state-bg", {
            role: "menuitem",
            oncreate: function (vnode) { return _this.dom = vnode.dom; },
            onclick: function (e) { var _a; return (_a = attrs.click) === null || _a === void 0 ? void 0 : _a.call(attrs, e, (0, tutanota_utils_1.neverNull)(_this.dom)); }
        }, [
            attrs.icon && attrs.showingIcons
                ? (0, mithril_1["default"])(Icon_js_1.Icon, {
                    icon: attrs.icon,
                    large: true,
                    style: {
                        fill: color,
                        // margin on the sides of the button is 16px, but it actually looks more coherent to have the smaller spacing between the icon and text
                        marginRight: (0, size_1.px)(12)
                    }
                })
                : attrs.showingIcons
                    ? (0, mithril_1["default"])(".icon-large", {
                        style: {
                            marginRight: (0, size_1.px)(12)
                        }
                    })
                    : null,
            (0, mithril_1["default"])(".text-ellipsis", {
                style: {
                    color: color
                }
            }, LanguageViewModel_1.lang.getMaybeLazy(attrs.label))
        ]);
    };
    return DropdownButton;
}());
