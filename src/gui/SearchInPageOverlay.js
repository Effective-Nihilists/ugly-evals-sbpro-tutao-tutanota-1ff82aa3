"use strict";
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
exports.searchInPageOverlay = exports.SearchInPageOverlay = void 0;
var mithril_1 = require("mithril");
var LoginController_1 = require("../api/main/LoginController");
var Overlay_1 = require("./base/Overlay");
var size_1 = require("./size");
var Env_1 = require("../api/common/Env");
var LanguageViewModel_1 = require("../misc/LanguageViewModel");
var Animations_1 = require("./animation/Animations");
var Button_js_1 = require("./base/Button.js");
var TutanotaConstants_1 = require("../api/common/TutanotaConstants");
var MainLocator_1 = require("../api/main/MainLocator");
(0, Env_1.assertMainOrNode)();
/**
 * search bar for the Ctrl+F in-page search of the Desktop client
 * gets loaded asynchronously, shouldn't be in the web bundle
 */
var SearchInPageOverlay = /** @class */ (function () {
    function SearchInPageOverlay() {
        var _this = this;
        this._matchCase = false;
        this._numberOfMatches = 0;
        this._currentMatch = 0;
        this._skipNextBlur = false;
        this._inputField = function () {
            return (0, mithril_1["default"])("input#search-overlay-input.dropdown-bar.elevated-bg.pl-l.button-height.inputWrapper", {
                placeholder: LanguageViewModel_1.lang.get("searchPage_action"),
                oncreate: function (vnode) {
                    _this._domInput = vnode.dom;
                    _this._domInput.focus();
                },
                onblur: function () {
                    if (_this._skipNextBlur) {
                        _this._skipNextBlur = false;
                        _this._domInput.focus();
                    }
                    else {
                        MainLocator_1.locator.searchTextFacade.setSearchOverlayState(false, false);
                    }
                },
                onfocus: function () { return MainLocator_1.locator.searchTextFacade.setSearchOverlayState(true, false); },
                oninput: function () { return _this._find(true, true); },
                style: {
                    width: (0, size_1.px)(250),
                    top: 0,
                    height: (0, size_1.px)(size_1.size.button_height),
                    left: 0
                }
            }, "");
        };
        this._find = function (forward, findNext) { return __awaiter(_this, void 0, void 0, function () {
            var r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._skipNextBlur = true;
                        return [4 /*yield*/, MainLocator_1.locator.searchTextFacade.findInPage(this._domInput.value, forward, this._matchCase, findNext)];
                    case 1:
                        r = _a.sent();
                        this.applyNextResult(r);
                        return [2 /*return*/];
                }
            });
        }); };
        this._closeFunction = null;
    }
    SearchInPageOverlay.prototype.open = function () {
        var _this = this;
        if (LoginController_1.logins.isUserLoggedIn()) {
            if (!this._closeFunction) {
                this._closeFunction = (0, Overlay_1.displayOverlay)(function () { return _this._getRect(); }, this._getComponent(), function (dom) { return (0, Animations_1.transform)("translateY" /* TransformEnum.TranslateY */, dom.offsetHeight, 0); }, function (dom) { return (0, Animations_1.transform)("translateY" /* TransformEnum.TranslateY */, 0, dom.offsetHeight); });
            }
            else {
                //already open, refocus
                console.log("refocusing");
                this._domInput.focus();
                this._domInput.select();
            }
            mithril_1["default"].redraw();
        }
    };
    SearchInPageOverlay.prototype.close = function () {
        if (this._closeFunction) {
            this._closeFunction();
            MainLocator_1.locator.searchTextFacade.stopFindInPage();
            this._closeFunction = null;
        }
        mithril_1["default"].redraw();
    };
    SearchInPageOverlay.prototype._getRect = function () {
        return {
            height: (0, size_1.px)(size_1.size.navbar_height_mobile),
            bottom: (0, size_1.px)(0),
            right: (0, size_1.px)(0),
            left: (0, size_1.px)(0)
        };
    };
    SearchInPageOverlay.prototype.applyNextResult = function (result) {
        if (result == null) {
            this._numberOfMatches = 0;
            this._currentMatch = 0;
        }
        else {
            var activeMatchOrdinal = result.activeMatchOrdinal, matches = result.matches;
            if (matches === 1) {
                /* the search bar loses focus without any events when there
                 *  are no results except for the search bar itself. this enables
                 *  us to retain focus. */
                this._domInput.blur();
                this._domInput.focus();
            }
            this._numberOfMatches = matches - 1;
            this._currentMatch = activeMatchOrdinal - 1;
        }
        mithril_1["default"].redraw();
    };
    SearchInPageOverlay.prototype._getComponent = function () {
        var _this = this;
        var caseButtonAttrs = {
            label: "matchCase_alt",
            icon: function () { return "MatchCase" /* Icons.MatchCase */; },
            type: "action" /* ButtonType.Action */,
            noBubble: true,
            isSelected: function () { return _this._matchCase; },
            click: function () {
                _this._matchCase = !_this._matchCase;
                _this._find(true, false);
            }
        };
        var forwardButtonAttrs = {
            label: "next_action",
            icon: function () { return "ArrowForward" /* Icons.ArrowForward */; },
            type: "action" /* ButtonType.Action */,
            noBubble: true,
            click: function () { return _this._find(true, true); }
        };
        var backwardButtonAttrs = {
            label: "previous_action",
            icon: function () { return "ArrowBackward" /* Icons.ArrowBackward */; },
            type: "action" /* ButtonType.Action */,
            noBubble: true,
            click: function () { return _this._find(false, true); }
        };
        var closeButtonAttrs = {
            label: "close_alt",
            icon: function () { return "Cancel" /* Icons.Cancel */; },
            type: "action" /* ButtonType.Action */,
            click: function () { return _this.close(); }
        };
        var handleMouseUp = function (event) { return _this.handleMouseUp(event); };
        return {
            view: function (_) {
                return (0, mithril_1["default"])(".flex.flex-space-between", {
                    oncreate: function () { return window.addEventListener("mouseup", handleMouseUp); },
                    onremove: function () { return window.removeEventListener("mouseup", handleMouseUp); }
                }, [
                    (0, mithril_1["default"])(".flex-start.center-vertically", {
                        onkeydown: function (e) {
                            var keyCode = e.which;
                            if (keyCode === TutanotaConstants_1.Keys.ESC.code) {
                                _this.close();
                            }
                            // prevent key from getting picked up by shortcuts etc.
                            e.stopPropagation();
                            return true;
                        }
                    }, [
                        _this._inputField(),
                        (0, mithril_1["default"])(Button_js_1.Button, backwardButtonAttrs),
                        (0, mithril_1["default"])(Button_js_1.Button, forwardButtonAttrs),
                        (0, mithril_1["default"])(Button_js_1.Button, caseButtonAttrs),
                        (0, mithril_1["default"])("div.pl-m", _this._numberOfMatches > 0 ? "".concat(_this._currentMatch, "/").concat(_this._numberOfMatches) : LanguageViewModel_1.lang.get("searchNoResults_msg")),
                    ]),
                    (0, mithril_1["default"])(Button_js_1.Button, closeButtonAttrs),
                ]);
            }
        };
    };
    /*
     * we're catching enter key events on the main thread while the search overlay is open to enable
     * next-result-via-enter behaviour.
     *
     * since losing focus on the overlay via issuing a search request seems to be indistinguishable
     * from losing it via click/tab we need to check if anything else was clicked and tell the main thread to
     * not search the next result for enter key events (otherwise we couldn't type newlines while the overlay is open)
     */
    SearchInPageOverlay.prototype.handleMouseUp = function (e) {
        if (!(e.target instanceof Element && e.target.id !== "search-overlay-input"))
            return;
        MainLocator_1.locator.searchTextFacade.setSearchOverlayState(false, true);
    };
    return SearchInPageOverlay;
}());
exports.SearchInPageOverlay = SearchInPageOverlay;
exports.searchInPageOverlay = new SearchInPageOverlay();
