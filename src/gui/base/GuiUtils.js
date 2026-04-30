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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.getPosAndBoundsFromMouseEvent = exports.ifAllowedTutanotaLinks = exports.scrollListDom = exports.makeListSelectionChangedScrollHandler = exports.getCoordsOfMouseOrTouchEvent = exports.getConfirmation = exports.createMoreActionButtonAttrs = exports.createMoreSecondaryButtonAttrs = exports.renderCountryDropdown = void 0;
var CountryList_1 = require("../../api/common/CountryList");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var Dropdown_js_1 = require("./Dropdown.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Dialog_1 = require("./Dialog");
var LoginController_1 = require("../../api/main/LoginController");
var ProgrammingError_1 = require("../../api/common/error/ProgrammingError");
var mithril_1 = require("mithril");
var DropDownSelector_js_1 = require("./DropDownSelector.js");
// lazy because of global dependencies
var dropdownCountries = (0, tutanota_utils_1.lazyMemoized)(function () { return CountryList_1.Countries.map(function (c) { return ({ value: c, name: c.n }); }); });
function renderCountryDropdown(params) {
    var _a;
    return (0, mithril_1["default"])(DropDownSelector_js_1.DropDownSelector, {
        label: (_a = params.label) !== null && _a !== void 0 ? _a : "invoiceCountry_label",
        helpLabel: params.helpLabel,
        items: __spreadArray(__spreadArray([], dropdownCountries(), true), [
            {
                value: null,
                name: LanguageViewModel_1.lang.get("choose_label")
            }
        ], false),
        selectedValue: params.selectedCountry,
        selectionChangedHandler: params.onSelectionChanged
    });
}
exports.renderCountryDropdown = renderCountryDropdown;
function createMoreSecondaryButtonAttrs(lazyChildren, dropdownWidth) {
    return moreButtonAttrsImpl(null, "secondary" /* ButtonType.Secondary */, lazyChildren, dropdownWidth);
}
exports.createMoreSecondaryButtonAttrs = createMoreSecondaryButtonAttrs;
function createMoreActionButtonAttrs(lazyChildren, dropdownWidth) {
    var _this = this;
    return {
        title: "more_label",
        colors: "nav" /* ButtonColor.Nav */,
        icon: "More" /* Icons.More */,
        click: (0, Dropdown_js_1.createAsyncDropdown)({
            width: dropdownWidth,
            lazyButtons: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, (0, tutanota_utils_1.resolveMaybeLazy)(lazyChildren)];
            }); }); }
        })
    };
}
exports.createMoreActionButtonAttrs = createMoreActionButtonAttrs;
function moreButtonAttrsImpl(icon, type, lazyChildren, dropdownWidth) {
    var _this = this;
    return {
        label: "more_label",
        colors: "nav" /* ButtonColor.Nav */,
        icon: icon,
        type: type,
        click: (0, Dropdown_js_1.createAsyncDropdown)({
            width: dropdownWidth,
            lazyButtons: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, (0, tutanota_utils_1.resolveMaybeLazy)(lazyChildren)];
            }); }); }
        })
    };
}
/**
 * Wrapper around Dialog.confirm
 *
 * call getConfirmation(...).confirmed(() => doStuff()) or getConfirmation(...).cancelled(() => doStuff())
 * to handle confirmation or termination
 * @param message
 * @param confirmMessage
 * @returns {Confirmation}
 */
function getConfirmation(message, confirmMessage) {
    if (confirmMessage === void 0) { confirmMessage = "ok_action"; }
    var confirmationPromise = Dialog_1.Dialog.confirm(message, confirmMessage);
    var confirmation = {
        confirmed: function (action) {
            confirmationPromise.then(function (ok) {
                if (ok) {
                    action();
                }
            });
            return confirmation;
        },
        cancelled: function (action) {
            confirmationPromise.then(function (ok) {
                if (!ok) {
                    action();
                }
            });
            return confirmation;
        },
        result: confirmationPromise
    };
    return confirmation;
}
exports.getConfirmation = getConfirmation;
/**
 * Get either the coord of a mouseevent or the coord of the first touch of a touch event
 * @param event
 * @returns {{x: number, y: number}}
 */
function getCoordsOfMouseOrTouchEvent(event) {
    return event instanceof MouseEvent
        ? {
            x: event.clientX,
            y: event.clientY
        }
        : {
            // Why would touches be empty?
            x: (0, tutanota_utils_1.assertNotNull)(event.touches.item(0)).clientX,
            y: (0, tutanota_utils_1.assertNotNull)(event.touches.item(0)).clientY
        };
}
exports.getCoordsOfMouseOrTouchEvent = getCoordsOfMouseOrTouchEvent;
function makeListSelectionChangedScrollHandler(scrollDom, entryHeight, getSelectedEntryIndex) {
    return function () {
        scrollListDom(scrollDom, entryHeight, getSelectedEntryIndex());
    };
}
exports.makeListSelectionChangedScrollHandler = makeListSelectionChangedScrollHandler;
function scrollListDom(scrollDom, entryHeight, selectedIndex) {
    var scrollWindowHeight = scrollDom.getBoundingClientRect().height;
    var scrollOffset = scrollDom.scrollTop;
    // Actual position in the list
    var selectedTop = entryHeight * selectedIndex;
    var selectedBottom = selectedTop + entryHeight;
    // Relative to the top of the scroll window
    var selectedRelativeTop = selectedTop - scrollOffset;
    var selectedRelativeBottom = selectedBottom - scrollOffset;
    // clamp the selected item to stay between the top and bottom of the scroll window
    if (selectedRelativeTop < 0) {
        scrollDom.scrollTop = selectedTop;
    }
    else if (selectedRelativeBottom > scrollWindowHeight) {
        scrollDom.scrollTop = selectedBottom - scrollWindowHeight;
    }
}
exports.scrollListDom = scrollListDom;
/**
 * Executes the passed function if the user is allowed to see `tutanota.com` links.
 * @param render receives the resolved link
 * @returns {Children|null}
 */
function ifAllowedTutanotaLinks(linkId, render) {
    if (LoginController_1.logins.getUserController().isGlobalAdmin() || !LoginController_1.logins.isWhitelabel()) {
        return render(linkId);
    }
    return null;
}
exports.ifAllowedTutanotaLinks = ifAllowedTutanotaLinks;
/**
 * Get the mouse's x and y coordinates relative to the target, and the width and height of the target.
 * The currentTarget must be a HTMLElement or this throws an error
 * @param mouseEvent
 */
function getPosAndBoundsFromMouseEvent(_a) {
    var currentTarget = _a.currentTarget, x = _a.x, y = _a.y;
    if (currentTarget instanceof HTMLElement) {
        var _b = currentTarget.getBoundingClientRect(), height = _b.height, width = _b.width, left = _b.left, top_1 = _b.top;
        return {
            targetHeight: height,
            targetWidth: width,
            x: x - left,
            y: y - top_1
        };
    }
    else {
        throw new ProgrammingError_1.ProgrammingError("Target is not a HTMLElement");
    }
}
exports.getPosAndBoundsFromMouseEvent = getPosAndBoundsFromMouseEvent;
