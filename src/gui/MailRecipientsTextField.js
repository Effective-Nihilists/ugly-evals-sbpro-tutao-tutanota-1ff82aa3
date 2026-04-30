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
exports.MailRecipientsTextField = void 0;
var mithril_1 = require("mithril");
var BubbleTextField_js_1 = require("./base/BubbleTextField.js");
var MailUtils_js_1 = require("../mail/model/MailUtils.js");
var size_js_1 = require("./size.js");
var Icon_js_1 = require("./base/Icon.js");
var LanguageViewModel_js_1 = require("../misc/LanguageViewModel.js");
var MailAddressParser_js_1 = require("../misc/parsing/MailAddressParser.js");
var RecipientsSearchDropDown_js_1 = require("./RecipientsSearchDropDown.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Dialog_js_1 = require("./base/Dialog.js");
/**
 * A component for inputting a list of recipients
 * recipients are represented as bubbles, and a contact search dropdown is shown as the user types
 */
var MailRecipientsTextField = /** @class */ (function () {
    function MailRecipientsTextField() {
        // don't access me directly, use getter and setter
        this.selectedSuggestionIdx = 0;
        this.focused = false;
    }
    MailRecipientsTextField.prototype.view = function (_a) {
        var attrs = _a.attrs;
        return [
            this.renderTextField(attrs),
            this.focused ? this.renderSuggestions(attrs) : null
        ];
    };
    MailRecipientsTextField.prototype.renderTextField = function (attrs) {
        var _this = this;
        return (0, mithril_1["default"])(BubbleTextField_js_1.BubbleTextField, {
            label: attrs.label,
            text: attrs.text,
            onInput: function (text) {
                attrs.search.search(text).then(function () { return mithril_1["default"].redraw(); });
                // if the new text length is more than one character longer,
                // it means the user pasted the text in, so we want to try and resolve a list of contacts
                var _a = text.length - attrs.text.length > 1
                    ? parsePastedInput(text)
                    : parseTypedInput(text), remainingText = _a.remainingText, newRecipients = _a.newRecipients, errors = _a.errors;
                for (var _i = 0, newRecipients_1 = newRecipients; _i < newRecipients_1.length; _i++) {
                    var _b = newRecipients_1[_i], address = _b.address, name_1 = _b.name;
                    attrs.onRecipientAdded(address, name_1, null);
                }
                if (errors.length === 1 && newRecipients.length === 0) {
                    // if there was a single recipient and it was invalid then just pretend nothing happened
                    attrs.onTextChanged((0, tutanota_utils_1.firstThrow)(errors));
                }
                else {
                    if (errors.length > 0) {
                        Dialog_js_1.Dialog.message(function () { return "".concat(LanguageViewModel_js_1.lang.get("invalidPastedRecipients_msg"), "\n\n").concat(errors.join("\n")); });
                    }
                    attrs.onTextChanged(remainingText);
                }
            },
            items: attrs.recipients.map(function (recipient) { return recipient.address; }),
            renderBubbleText: function (address) {
                var _a, _b;
                var name = (_b = (_a = attrs.recipients.find(function (recipient) { return recipient.address === address; })) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : null;
                return (0, MailUtils_js_1.getDisplayText)(name, address, false);
            },
            getBubbleDropdownAttrs: function (address) { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, ((_a = attrs.getRecipientClickedDropdownAttrs) === null || _a === void 0 ? void 0 : _a.call(attrs, address))];
                    case 1: return [2 /*return*/, (_b = (_c.sent())) !== null && _b !== void 0 ? _b : []];
                }
            }); }); },
            onBackspace: function () {
                if (attrs.text === "" && attrs.recipients.length > 0) {
                    var address = attrs.recipients.slice().pop().address;
                    attrs.onTextChanged(address);
                    attrs.onRecipientRemoved(address);
                    return false;
                }
                return true;
            },
            onEnterKey: function () {
                _this.resolveInput(attrs);
                return true;
            },
            onUpKey: function () {
                _this.setSelectedSuggestionIdx(_this.getSelectedSuggestionIdx(attrs) + 1);
                return false;
            },
            onDownKey: function () {
                _this.setSelectedSuggestionIdx(_this.getSelectedSuggestionIdx(attrs) - 1);
                return false;
            },
            onFocus: function () {
                _this.focused = true;
            },
            onBlur: function () {
                _this.focused = false;
                _this.resolveInput(attrs);
                return true;
            },
            disabled: attrs.disabled,
            injectionsRight: (0, mithril_1["default"])(".flex.items-center", [
                // Placeholder element for the suggestion progress icon with a fixed width and height to avoid flickering.
                // when reaching the end of the input line and when entering a text into the second line.
                (0, mithril_1["default"])(".flex.align-right.mr-s.flex.items-end.pb-s", {
                    style: {
                        width: (0, size_js_1.px)(20),
                        height: (0, size_js_1.px)(size_js_1.size.button_height_compact)
                    }
                }, attrs.search.isLoading() ? (0, Icon_js_1.progressIcon)() : null),
                attrs.injectionsRight
            ])
        });
    };
    MailRecipientsTextField.prototype.renderSuggestions = function (attrs) {
        var _this = this;
        var _a;
        return (0, mithril_1["default"])(RecipientsSearchDropDown_js_1.RecipientsSearchDropDown, {
            suggestions: attrs.search.results(),
            selectedSuggestionIndex: this.getSelectedSuggestionIdx(attrs),
            onSuggestionSelected: function (idx) { return _this.selectSuggestion(attrs, idx); },
            maxHeight: (_a = attrs.maxSuggestionsToShow) !== null && _a !== void 0 ? _a : null
        });
    };
    MailRecipientsTextField.prototype.resolveInput = function (attrs) {
        var suggestions = attrs.search.results();
        if (suggestions.length > 0) {
            this.selectSuggestion(attrs, this.getSelectedSuggestionIdx(attrs));
        }
        else {
            var parsed = parseMailAddress(attrs.text);
            if (parsed != null) {
                attrs.onRecipientAdded(parsed.address, parsed.name, null);
                attrs.onTextChanged("");
            }
        }
    };
    MailRecipientsTextField.prototype.selectSuggestion = function (attrs, index) {
        var selection = attrs.search.results()[index];
        if (selection == null) {
            return;
        }
        var address = selection.address, name = selection.name, contact = selection.contact;
        attrs.onRecipientAdded(address, name, contact);
        attrs.search.clear();
        attrs.onTextChanged("");
    };
    MailRecipientsTextField.prototype.getSelectedSuggestionIdx = function (attrs) {
        return Math.min(Math.max(this.selectedSuggestionIdx, 0), attrs.search.results().length - 1);
    };
    MailRecipientsTextField.prototype.setSelectedSuggestionIdx = function (idx) {
        this.selectedSuggestionIdx = idx;
    };
    return MailRecipientsTextField;
}());
exports.MailRecipientsTextField = MailRecipientsTextField;
/**
 * Parse a list of valid mail addresses separated by either a semicolon or a comma.
 * Invalid addresses will be returned as a separate list
 */
function parsePastedInput(text) {
    var separator = text.indexOf(";") !== -1 ? ";" : ",";
    var textParts = text.split(separator).map(function (part) { return part.trim(); });
    var result = {
        remainingText: "",
        newRecipients: [],
        errors: []
    };
    for (var _i = 0, textParts_1 = textParts; _i < textParts_1.length; _i++) {
        var part = textParts_1[_i];
        part = part.trim();
        if (part.length !== 0) {
            var parsed = parseMailAddress(part);
            if (!parsed) {
                result.errors.push(part);
            }
            else {
                result.newRecipients.push(parsed);
            }
        }
    }
    return result;
}
/**
 * Parse text when it is typed by the user
 * When the final character is an expected delimiter (';', ',', ' '),
 * then we attempt to parse the preceding text. If it is a valid mail address,
 * it is successfully parsed
 * invalid input gets returned in `remainingText`, `errors` is always empty
 * @param text
 */
function parseTypedInput(text) {
    var lastCharacter = text.slice(-1);
    // on semicolon, comman or space we want to try to resolve the input text
    if (lastCharacter === ";" || lastCharacter === "," || lastCharacter === " ") {
        var textMinusLast = text.slice(0, -1);
        var result = parseMailAddress(textMinusLast);
        var remainingText = result != null
            ? ""
            : textMinusLast;
        return {
            remainingText: remainingText,
            newRecipients: result ? [result] : [],
            errors: []
        };
    }
    else {
        return {
            remainingText: text,
            newRecipients: [],
            errors: []
        };
    }
}
function parseMailAddress(text) {
    text = text.trim();
    if (text === "")
        return null;
    var nameAndMailAddress = (0, MailAddressParser_js_1.stringToNameAndMailAddress)(text);
    if (nameAndMailAddress) {
        var name_2 = nameAndMailAddress.name
            ? nameAndMailAddress.name
            : null;
        return { name: name_2, address: nameAndMailAddress.mailAddress };
    }
    else {
        return null;
    }
}
