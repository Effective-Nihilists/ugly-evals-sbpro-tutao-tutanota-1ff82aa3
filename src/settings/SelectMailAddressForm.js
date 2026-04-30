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
exports.SelectMailAddressForm = void 0;
var mithril_1 = require("mithril");
var LanguageViewModel_1 = require("../misc/LanguageViewModel");
var FormatValidator_1 = require("../misc/FormatValidator");
var RestError_1 = require("../api/common/error/RestError");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Formatter_1 = require("../misc/Formatter");
var Icon_1 = require("../gui/base/Icon");
var MainLocator_1 = require("../api/main/MainLocator");
var Env_1 = require("../api/common/Env");
var MailUtils_js_1 = require("../mail/model/MailUtils.js");
var size_js_1 = require("../gui/size.js");
var TextField_js_1 = require("../gui/base/TextField.js");
var Dropdown_js_1 = require("../gui/base/Dropdown.js");
var IconButton_js_1 = require("../gui/base/IconButton.js");
(0, Env_1.assertMainOrNode)();
var VALID_MESSAGE_ID = "mailAddressAvailable_msg";
var SelectMailAddressForm = /** @class */ (function () {
    function SelectMailAddressForm(_a) {
        var attrs = _a.attrs;
        this.isVerificationBusy = false;
        this.checkAddressTimeout = null;
        this.domain = (0, tutanota_utils_1.firstThrow)(attrs.availableDomains);
        this.username = "";
        this.messageId = "mailAddressNeutral_msg";
    }
    SelectMailAddressForm.prototype.view = function (_a) {
        var _this = this;
        var _b;
        var attrs = _a.attrs;
        // this is a semi-good hack to reset the username after the user pressed "ok"
        if ((_b = attrs.injectionsRightButtonAttrs) === null || _b === void 0 ? void 0 : _b.click) {
            var originalCallback_1 = attrs.injectionsRightButtonAttrs.click;
            attrs.injectionsRightButtonAttrs.click = function (event, dom) {
                originalCallback_1(event, dom);
                _this.username = "";
                _this.messageId = "mailAddressNeutral_msg";
            };
        }
        return (0, mithril_1["default"])(TextField_js_1.TextField, {
            label: "mailAddress_label",
            value: this.username,
            alignRight: true,
            helpLabel: function () { return _this.addressHelpLabel(); },
            fontSize: (0, size_js_1.px)(size_js_1.size.font_size_smaller),
            oninput: function (value) {
                _this.username = value;
                _this.verifyMailAddress(attrs);
            },
            injectionsRight: function () { return [
                (0, mithril_1["default"])(".flex.items-end.align-self-end", {
                    style: {
                        "padding-bottom": "1px",
                        flex: "1 1 auto",
                        fontSize: (0, size_js_1.px)(size_js_1.size.font_size_smaller),
                        lineHeight: (0, size_js_1.px)(TextField_js_1.inputLineHeight)
                    }
                }, "@".concat(_this.domain)),
                attrs.availableDomains.length > 1
                    ? (0, mithril_1["default"])(IconButton_js_1.IconButton, (0, Dropdown_js_1.attachDropdown)({
                        mainButtonAttrs: {
                            title: "domain_label",
                            icon: "Expand" /* BootIcons.Expand */,
                            size: 1 /* ButtonSize.Compact */
                        },
                        childAttrs: function () { return attrs.availableDomains.map(function (domain) { return _this.createDropdownItemAttrs(domain, attrs); }); },
                        showDropdown: function () { return true; },
                        width: 250
                    }))
                    : attrs.injectionsRightButtonAttrs
                        ? (0, mithril_1["default"])(IconButton_js_1.IconButton, attrs.injectionsRightButtonAttrs)
                        : null,
            ]; }
        });
    };
    SelectMailAddressForm.prototype.getCleanMailAddress = function () {
        return (0, Formatter_1.formatMailAddressFromParts)(this.username, this.domain);
    };
    SelectMailAddressForm.prototype.addressHelpLabel = function () {
        var _a;
        return this.isVerificationBusy
            ? (0, mithril_1["default"])(".flex.items-center.mt-s", [this.progressIcon(), LanguageViewModel_1.lang.get("mailAddressBusy_msg")])
            : (0, mithril_1["default"])(".mt-s", LanguageViewModel_1.lang.get((_a = this.messageId) !== null && _a !== void 0 ? _a : VALID_MESSAGE_ID));
    };
    SelectMailAddressForm.prototype.progressIcon = function () {
        return (0, mithril_1["default"])(Icon_1.Icon, {
            icon: "Progress" /* BootIcons.Progress */,
            "class": "icon-progress mr-s"
        });
    };
    SelectMailAddressForm.prototype.createDropdownItemAttrs = function (domain, attrs) {
        var _this = this;
        return {
            label: function () { return domain; },
            click: function () {
                var _a;
                (_a = attrs.onDomainChanged) === null || _a === void 0 ? void 0 : _a.call(attrs, domain);
                _this.domain = domain;
                _this.verifyMailAddress(attrs);
            }
        };
    };
    SelectMailAddressForm.prototype.onBusyStateChanged = function (isBusy, onBusyStateChanged) {
        this.isVerificationBusy = isBusy;
        onBusyStateChanged(isBusy);
        mithril_1["default"].redraw();
    };
    SelectMailAddressForm.prototype.onValidationFinished = function (email, validationResult, onValidationResult) {
        this.messageId = validationResult.errorId;
        onValidationResult(email, validationResult);
    };
    SelectMailAddressForm.prototype.verifyMailAddress = function (_a) {
        var _this = this;
        var onValidationResult = _a.onValidationResult, onBusyStateChanged = _a.onBusyStateChanged;
        this.checkAddressTimeout && clearTimeout(this.checkAddressTimeout);
        var cleanMailAddress = this.getCleanMailAddress();
        var cleanUsername = this.username.trim().toLowerCase();
        if (cleanUsername === "") {
            this.onValidationFinished(cleanMailAddress, {
                isValid: false,
                errorId: "mailAddressNeutral_msg"
            }, onValidationResult);
            this.onBusyStateChanged(false, onBusyStateChanged);
            return;
        }
        else if (!(0, FormatValidator_1.isMailAddress)(cleanMailAddress, true) || ((0, MailUtils_js_1.isTutanotaMailAddress)(cleanMailAddress) && cleanUsername.length < 3)) {
            this.onValidationFinished(cleanMailAddress, {
                isValid: false,
                errorId: "mailAddressInvalid_msg"
            }, onValidationResult);
            this.onBusyStateChanged(false, onBusyStateChanged);
            return;
        }
        this.onBusyStateChanged(true, onBusyStateChanged);
        this.checkAddressTimeout = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
            var result, available, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.getCleanMailAddress() !== cleanMailAddress)
                            return [2 /*return*/];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, MainLocator_1.locator.mailAddressFacade.isMailAddressAvailable(cleanMailAddress)];
                    case 2:
                        available = _a.sent();
                        result = available ? { isValid: true, errorId: null } : { isValid: false, errorId: "mailAddressNA_msg" };
                        return [3 /*break*/, 5];
                    case 3:
                        e_1 = _a.sent();
                        if (e_1 instanceof RestError_1.AccessDeactivatedError) {
                            result = { isValid: false, errorId: "mailAddressDelay_msg" };
                        }
                        else {
                            throw e_1;
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        if (this.getCleanMailAddress() === cleanMailAddress) {
                            this.onBusyStateChanged(false, onBusyStateChanged);
                        }
                        return [7 /*endfinally*/];
                    case 5:
                        if (this.getCleanMailAddress() === cleanMailAddress) {
                            this.onValidationFinished(cleanMailAddress, result, onValidationResult);
                        }
                        return [2 /*return*/];
                }
            });
        }); }, 500);
    };
    return SelectMailAddressForm;
}());
exports.SelectMailAddressForm = SelectMailAddressForm;
