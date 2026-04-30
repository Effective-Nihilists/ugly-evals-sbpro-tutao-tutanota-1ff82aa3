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
exports.MinimizedEditorOverlay = void 0;
var mithril_1 = require("mithril");
var CounterBadge_1 = require("../../gui/base/CounterBadge");
var theme_1 = require("../../gui/theme");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var Button_js_1 = require("../../gui/base/Button.js");
var size_1 = require("../../gui/size");
var styles_1 = require("../../gui/styles");
var EventController_1 = require("../../api/main/EventController");
var MailGuiUtils_1 = require("./MailGuiUtils");
var TypeRefs_js_1 = require("../../api/entities/tutanota/TypeRefs.js");
var EntityUtils_1 = require("../../api/common/utils/EntityUtils");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var COUNTER_POS_OFFSET = (0, size_1.px)(-8);
var MinimizedEditorOverlay = /** @class */ (function () {
    function MinimizedEditorOverlay(vnode) {
        var _a = vnode.attrs, minimizedEditor = _a.minimizedEditor, viewModel = _a.viewModel, eventController = _a.eventController;
        this._eventController = eventController;
        this._listener = function (updates, eventOwnerGroupId) {
            return (0, tutanota_utils_1.promiseMap)(updates, function (update) {
                if ((0, EventController_1.isUpdateForTypeRef)(TypeRefs_js_1.MailTypeRef, update) && update.operation === "2" /* OperationType.DELETE */) {
                    var draft = minimizedEditor.sendMailModel.getDraft();
                    if (draft && (0, EntityUtils_1.isSameId)(draft._id, [update.instanceListId, update.instanceId])) {
                        viewModel.removeMinimizedEditor(minimizedEditor);
                    }
                }
            });
        };
        eventController.addEntityListener(this._listener);
    }
    MinimizedEditorOverlay.prototype.onremove = function () {
        this._eventController.removeEntityListener(this._listener);
    };
    MinimizedEditorOverlay.prototype.view = function (vnode) {
        var _this = this;
        var _a = vnode.attrs, minimizedEditor = _a.minimizedEditor, viewModel = _a.viewModel, eventController = _a.eventController;
        var subject = minimizedEditor.sendMailModel.getSubject();
        return (0, mithril_1["default"])(".elevated-bg.pl.border-radius", [
            (0, mithril_1["default"])(CounterBadge_1.CounterBadge, {
                count: viewModel.getMinimizedEditors().indexOf(minimizedEditor) + 1,
                position: {
                    top: COUNTER_POS_OFFSET,
                    right: COUNTER_POS_OFFSET
                },
                color: theme_1.theme.navigation_button_icon,
                background: (0, theme_1.getNavButtonIconBackground)()
            }),
            (0, mithril_1["default"])(".flex.justify-between.pb-xs.pt-xs", [
                (0, mithril_1["default"])(".flex.col.justify-center.min-width-0.flex-grow", {
                    onclick: function () { return viewModel.reopenMinimizedEditor(minimizedEditor); }
                }, [
                    (0, mithril_1["default"])(".b.text-ellipsis", subject ? subject : LanguageViewModel_1.lang.get("newMail_action")),
                    (0, mithril_1["default"])(".small.text-ellipsis", getStatusMessage(minimizedEditor.saveStatus())),
                ]),
                (0, mithril_1["default"])(".flex.items-center.justify-right", [
                    !styles_1.styles.isSingleColumnLayout()
                        ? (0, mithril_1["default"])(Button_js_1.Button, {
                            label: "edit_action",
                            click: function () { return viewModel.reopenMinimizedEditor(minimizedEditor); },
                            type: "action-large" /* ButtonType.ActionLarge */,
                            icon: function () { return "Edit" /* Icons.Edit */; },
                            colors: "drawernav" /* ButtonColor.DrawerNav */
                        })
                        : null,
                    (0, mithril_1["default"])(Button_js_1.Button, {
                        label: "delete_action",
                        click: function () { return _this._onDeleteClicked(minimizedEditor, viewModel); },
                        type: "action-large" /* ButtonType.ActionLarge */,
                        icon: function () { return "Trash" /* Icons.Trash */; },
                        colors: "drawernav" /* ButtonColor.DrawerNav */
                    }),
                    (0, mithril_1["default"])(Button_js_1.Button, {
                        label: "close_alt",
                        click: function () { return viewModel.removeMinimizedEditor(minimizedEditor); },
                        type: "action-large" /* ButtonType.ActionLarge */,
                        icon: function () { return "Cancel" /* Icons.Cancel */; },
                        colors: "drawernav" /* ButtonColor.DrawerNav */
                    }),
                ]),
            ]),
        ]);
    };
    MinimizedEditorOverlay.prototype._onDeleteClicked = function (minimizedEditor, viewModel) {
        var _this = this;
        var model = minimizedEditor.sendMailModel;
        viewModel.removeMinimizedEditor(minimizedEditor);
        // only delete once save has finished
        minimizedEditor.saveStatus.map(function (_a) {
            var status = _a.status;
            return __awaiter(_this, void 0, void 0, function () {
                var draft;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!(status !== 0 /* SaveStatusEnum.Saving */)) return [3 /*break*/, 2];
                            draft = model.draft;
                            if (!draft) return [3 /*break*/, 2];
                            return [4 /*yield*/, (0, MailGuiUtils_1.promptAndDeleteMails)(model.mailModel, [draft], tutanota_utils_1.noOp)];
                        case 1:
                            _b.sent();
                            _b.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        });
    };
    return MinimizedEditorOverlay;
}());
exports.MinimizedEditorOverlay = MinimizedEditorOverlay;
function getStatusMessage(saveStatus) {
    switch (saveStatus.status) {
        case 0 /* SaveStatusEnum.Saving */:
            return LanguageViewModel_1.lang.get("save_msg");
        case 2 /* SaveStatusEnum.NotSaved */:
            switch (saveStatus.reason) {
                case 1 /* SaveErrorReason.ConnectionLost */:
                    return LanguageViewModel_1.lang.get("draftNotSavedConnectionLost_msg");
                default:
                    return LanguageViewModel_1.lang.get("draftNotSaved_msg");
            }
        case 1 /* SaveStatusEnum.Saved */:
            return LanguageViewModel_1.lang.get("draftSaved_msg");
        default:
            return "";
    }
}
