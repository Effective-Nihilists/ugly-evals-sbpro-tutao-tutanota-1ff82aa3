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
exports.CalendarEventPopup = void 0;
var mithril_1 = require("mithril");
var size_1 = require("../../gui/size");
var Button_js_1 = require("../../gui/base/Button.js");
var Modal_1 = require("../../gui/base/Modal");
var EventPreviewView_1 = require("./EventPreviewView");
var Dialog_1 = require("../../gui/base/Dialog");
var UserError_1 = require("../../api/main/UserError");
var Dropdown_js_1 = require("../../gui/base/Dropdown.js");
var TutanotaConstants_1 = require("../../api/common/TutanotaConstants");
var CalendarUtils_1 = require("../date/CalendarUtils");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var tutanota_utils_2 = require("@tutao/tutanota-utils");
var CalendarEventPopup = /** @class */ (function () {
    function CalendarEventPopup(calendarEvent, eventBubbleRect, htmlSanitizer, onEditEvent, viewModel) {
        var _this = this;
        this._calendarEvent = calendarEvent;
        this._eventBubbleRect = eventBubbleRect;
        this._onEditEvent = onEditEvent || tutanota_utils_2.noOp;
        this._viewModel = viewModel;
        var preparedDescription = (0, CalendarUtils_1.prepareCalendarDescription)(calendarEvent.description);
        // We receive the HtmlSanitizer from outside and do the sanitization inside, so that we don't have to just assume it was already done
        this._sanitizedDescription = preparedDescription
            ? htmlSanitizer.sanitizeHTML(preparedDescription, {
                blockExternalContent: true
            }).html
            : "";
        this._isPersistentEvent = !!calendarEvent._ownerGroup;
        this._isExternal = !this._viewModel;
        this._shortcuts = [
            {
                key: TutanotaConstants_1.Keys.ESC,
                exec: function () { return _this._close(); },
                help: "close_alt"
            },
        ];
        if (!this._isExternal) {
            this._shortcuts.push({
                key: TutanotaConstants_1.Keys.E,
                exec: function () {
                    _this._onEditEvent();
                    _this._close();
                },
                help: "edit_action"
            });
        }
        if (this._isDeleteAvailable()) {
            this._shortcuts.push({
                key: TutanotaConstants_1.Keys.DELETE,
                exec: function () {
                    _this._deleteEvent();
                },
                help: "delete_action"
            });
        }
        if (!!this._viewModel && this._viewModel.isForceUpdateAvailable()) {
            this._shortcuts.push({
                key: TutanotaConstants_1.Keys.R,
                exec: function () {
                    _this._forceSendingUpdatesToAttendees();
                },
                help: "sendUpdates_label"
            });
        }
        this.view = function (vnode) {
            return (0, mithril_1["default"])(".abs.elevated-bg.plr.border-radius.dropdown-shadow.flex.flex-column", {
                style: {
                    width: (0, size_1.px)(Math.min(window.innerWidth - Dropdown_js_1.DROPDOWN_MARGIN * 2, 400)),
                    // minus margin, need to apply it now to not overflow later
                    opacity: "0",
                    // see hack description below
                    margin: "1px"
                },
                oncreate: function (vnode) {
                    var dom = vnode.dom;
                    // This is a hack to get "natural" view size but render it without opacity first and then show dropdown with inferred
                    // size.
                    setTimeout(function () { return (0, Dropdown_js_1.showDropdown)(_this._eventBubbleRect, dom, dom.offsetHeight, 400); }, 24);
                }
            }, [
                (0, mithril_1["default"])(".flex.flex-end", [
                    !!_this._viewModel && _this._viewModel.isForceUpdateAvailable()
                        ? (0, mithril_1["default"])(Button_js_1.Button, {
                            label: "sendUpdates_label",
                            click: function () { return _this._forceSendingUpdatesToAttendees(); },
                            type: "action-large" /* ButtonType.ActionLarge */,
                            icon: function () { return "Mail" /* BootIcons.Mail */; },
                            colors: "drawernav" /* ButtonColor.DrawerNav */
                        })
                        : null,
                    !_this._isExternal
                        ? (0, mithril_1["default"])(Button_js_1.Button, {
                            label: "edit_action",
                            click: function () {
                                _this._onEditEvent();
                                _this._close();
                            },
                            type: "action-large" /* ButtonType.ActionLarge */,
                            icon: function () { return "Edit" /* Icons.Edit */; },
                            colors: "drawernav" /* ButtonColor.DrawerNav */
                        })
                        : null,
                    _this._isDeleteAvailable()
                        ? (0, mithril_1["default"])(Button_js_1.Button, {
                            label: "delete_action",
                            click: function () { return _this._deleteEvent(); },
                            type: "action-large" /* ButtonType.ActionLarge */,
                            icon: function () { return "Trash" /* Icons.Trash */; },
                            colors: "drawernav" /* ButtonColor.DrawerNav */
                        })
                        : null,
                    (0, mithril_1["default"])(Button_js_1.Button, {
                        label: "close_alt",
                        click: function () { return _this._close(); },
                        type: "action-large" /* ButtonType.ActionLarge */,
                        icon: function () { return "Cancel" /* Icons.Cancel */; },
                        colors: "drawernav" /* ButtonColor.DrawerNav */
                    }),
                ]),
                (0, mithril_1["default"])(".flex-grow.scroll.visible-scrollbar", (0, mithril_1["default"])(EventPreviewView_1.EventPreviewView, {
                    event: _this._calendarEvent,
                    sanitizedDescription: _this._sanitizedDescription
                })),
            ]);
        };
    }
    CalendarEventPopup.prototype.show = function () {
        Modal_1.modal.displayUnique(this, false);
    };
    CalendarEventPopup.prototype._close = function () {
        Modal_1.modal.remove(this);
    };
    CalendarEventPopup.prototype.backgroundClick = function (e) {
        Modal_1.modal.remove(this);
    };
    CalendarEventPopup.prototype.hideAnimation = function () {
        return Promise.resolve();
    };
    CalendarEventPopup.prototype.onClose = function () {
    };
    CalendarEventPopup.prototype.shortcuts = function () {
        return this._shortcuts;
    };
    CalendarEventPopup.prototype.popState = function (e) {
        return true;
    };
    CalendarEventPopup.prototype._isDeleteAvailable = function () {
        return this._isPersistentEvent && !!this._viewModel && !this._viewModel.isReadOnlyEvent();
    };
    CalendarEventPopup.prototype._forceSendingUpdatesToAttendees = function () {
        return __awaiter(this, void 0, void 0, function () {
            var viewModel, confirmUpdate, success;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        viewModel = this._viewModel;
                        if (!viewModel) return [3 /*break*/, 3];
                        return [4 /*yield*/, Dialog_1.Dialog.confirm("sendUpdates_msg")];
                    case 1:
                        confirmUpdate = _a.sent();
                        if (!confirmUpdate) return [3 /*break*/, 3];
                        viewModel.isForceUpdates(true);
                        return [4 /*yield*/, viewModel
                                .saveAndSend({
                                askForUpdates: function () { return Promise.resolve("yes"); },
                                // will be overwritten anyway because updates are forced
                                askInsecurePassword: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, true];
                                }); }); },
                                showProgress: tutanota_utils_2.noOp
                            })["finally"](function () { return viewModel.isForceUpdates(false); })];
                    case 2:
                        success = _a.sent();
                        if (success) {
                            this._close();
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CalendarEventPopup.prototype._deleteEvent = function () {
        return __awaiter(this, void 0, void 0, function () {
            var viewModel, confirmed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        viewModel = this._viewModel;
                        if (!viewModel) return [3 /*break*/, 3];
                        return [4 /*yield*/, Dialog_1.Dialog.confirm("deleteEventConfirmation_msg")];
                    case 1:
                        confirmed = _a.sent();
                        if (!confirmed) return [3 /*break*/, 3];
                        return [4 /*yield*/, viewModel.deleteEvent()["catch"]((0, tutanota_utils_1.ofClass)(UserError_1.UserError, function (e) { return Dialog_1.Dialog.message(function () { return e.message; }); }))];
                    case 2:
                        _a.sent();
                        this._close();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return CalendarEventPopup;
}());
exports.CalendarEventPopup = CalendarEventPopup;
