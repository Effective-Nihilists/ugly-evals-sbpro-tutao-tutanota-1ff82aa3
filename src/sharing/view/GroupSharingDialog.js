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
exports.showGroupSharingDialog = void 0;
var mithril_1 = require("mithril");
var stream_1 = require("mithril/stream");
var Dialog_1 = require("../../gui/base/Dialog");
var Table_js_1 = require("../../gui/base/Table.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var MailUtils_1 = require("../../mail/model/MailUtils");
var ProgressDialog_1 = require("../../gui/dialogs/ProgressDialog");
var DropDownSelector_js_1 = require("../../gui/base/DropDownSelector.js");
var RestError_1 = require("../../api/common/error/RestError");
var TextField_js_1 = require("../../gui/base/TextField.js");
var GroupUtils_1 = require("../GroupUtils");
var GroupSharingUtils_1 = require("../GroupSharingUtils");
var GroupSharingModel_1 = require("../model/GroupSharingModel");
var LoginController_1 = require("../../api/main/LoginController");
var MainLocator_1 = require("../../api/main/MainLocator");
var UserError_1 = require("../../api/main/UserError");
var ErrorHandlerImpl_1 = require("../../misc/ErrorHandlerImpl");
var GuiUtils_1 = require("../../gui/base/GuiUtils");
var GroupGuiUtils_1 = require("../GroupGuiUtils");
var RecipientsModel_1 = require("../../api/main/RecipientsModel");
var MailRecipientsTextField_js_1 = require("../../gui/MailRecipientsTextField.js");
var RecipientsSearchModel_js_1 = require("../../misc/RecipientsSearchModel.js");
function showGroupSharingDialog(groupInfo, allowGroupNameOverride) {
    var groupType = (0, tutanota_utils_1.downcast)((0, tutanota_utils_1.assertNotNull)(groupInfo.groupType));
    (0, tutanota_utils_1.assert)((0, GroupUtils_1.isShareableGroupType)((0, tutanota_utils_1.downcast)(groupInfo.groupType)), "Group type \"".concat(groupType, "\" must be shareable"));
    var texts = (0, GroupGuiUtils_1.getTextsForGroupType)(groupType);
    (0, ProgressDialog_1.showProgressDialog)("loading_msg", GroupSharingModel_1.GroupSharingModel.newAsync(groupInfo, MainLocator_1.locator.eventController, MainLocator_1.locator.entityClient, LoginController_1.logins, MainLocator_1.locator.mailFacade, MainLocator_1.locator.shareFacade, MainLocator_1.locator.groupManagementFacade, MainLocator_1.locator.recipientsModel)).then(function (model) {
        model.onEntityUpdate.map(mithril_1["default"].redraw.bind(mithril_1["default"]));
        Dialog_1.Dialog.showActionDialog({
            title: LanguageViewModel_1.lang.get("sharing_label"),
            type: "EditMedium" /* DialogType.EditMedium */,
            child: function () { return (0, mithril_1["default"])(GroupSharingDialogContent, {
                model: model,
                allowGroupNameOverride: allowGroupNameOverride,
                texts: texts
            }); },
            okAction: null,
            cancelAction: function () { return model.dispose(); },
            cancelActionTextId: "close_alt"
        });
    });
}
exports.showGroupSharingDialog = showGroupSharingDialog;
var GroupSharingDialogContent = /** @class */ (function () {
    function GroupSharingDialogContent() {
    }
    GroupSharingDialogContent.prototype.view = function (vnode) {
        var _a = vnode.attrs, model = _a.model, allowGroupNameOverride = _a.allowGroupNameOverride, texts = _a.texts;
        var groupName = (0, GroupUtils_1.getSharedGroupName)(model.info, allowGroupNameOverride);
        return (0, mithril_1["default"])(".flex.col.pt-s", [
            (0, mithril_1["default"])(Table_js_1.Table, {
                columnHeading: [function () { return texts.participantsLabel(groupName); }],
                columnWidths: [".column-width-largest" /* ColumnWidth.Largest */, ".column-width-largest" /* ColumnWidth.Largest */],
                lines: this._renderMemberInfos(model, texts, groupName).concat(this._renderGroupInvitations(model, texts, groupName)),
                showActionButtonColumn: true,
                addButtonAttrs: (0, GroupUtils_1.hasCapabilityOnGroup)(LoginController_1.logins.getUserController().user, model.group, "2" /* ShareCapability.Invite */)
                    ? {
                        title: "addParticipant_action",
                        click: function () { return showAddParticipantDialog(model, texts); },
                        icon: "Add" /* Icons.Add */
                    }
                    : null
            }),
        ]);
    };
    GroupSharingDialogContent.prototype._renderGroupInvitations = function (model, texts, groupName) {
        var _this = this;
        return model.sentGroupInvitations.map(function (sentGroupInvitation) {
            return {
                cells: function () { return [
                    {
                        main: sentGroupInvitation.inviteeMailAddress,
                        info: ["".concat(LanguageViewModel_1.lang.get("invited_label"), ", ").concat((0, GroupUtils_1.getCapabilityText)((0, tutanota_utils_1.downcast)(sentGroupInvitation.capability)))],
                        mainStyle: ".i"
                    },
                ]; },
                actionButtonAttrs: model.canCancelInvitation(sentGroupInvitation)
                    ? {
                        title: "remove_action",
                        click: function () {
                            (0, GuiUtils_1.getConfirmation)(function () { return texts.removeMemberMessage(groupName, sentGroupInvitation.inviteeMailAddress); }).confirmed(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, model.cancelInvitation(sentGroupInvitation)];
                                        case 1:
                                            _a.sent();
                                            mithril_1["default"].redraw();
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                        },
                        icon: "Cancel" /* Icons.Cancel */
                    }
                    : null
            };
        });
    };
    GroupSharingDialogContent.prototype._renderMemberInfos = function (model, texts, groupName) {
        var _this = this;
        return model.memberInfos.map(function (memberInfo) {
            return {
                cells: function () { return [
                    {
                        main: (0, MailUtils_1.getDisplayText)(memberInfo.info.name, (0, tutanota_utils_1.neverNull)(memberInfo.info.mailAddress), false),
                        info: [
                            ((0, GroupUtils_1.isSharedGroupOwner)(model.group, memberInfo.member.user) ? LanguageViewModel_1.lang.get("owner_label") : LanguageViewModel_1.lang.get("participant_label")) +
                                ", " +
                                (0, GroupUtils_1.getCapabilityText)((0, GroupUtils_1.getMemberCabability)(memberInfo, model.group)),
                        ]
                    },
                ]; },
                actionButtonAttrs: model.canRemoveGroupMember(memberInfo.member)
                    ? {
                        title: "delete_action",
                        icon: "Cancel" /* Icons.Cancel */,
                        click: function () {
                            (0, GuiUtils_1.getConfirmation)(function () { return texts.removeMemberMessage(groupName, (0, tutanota_utils_1.downcast)(memberInfo.info.mailAddress)); }).confirmed(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, model.removeGroupMember(memberInfo.member)];
                                        case 1:
                                            _a.sent();
                                            mithril_1["default"].redraw();
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                        }
                    }
                    : null
            };
        });
    };
    return GroupSharingDialogContent;
}());
function showAddParticipantDialog(model, texts) {
    return __awaiter(this, void 0, void 0, function () {
        var recipientsText, recipients, capability, realGroupName, customGroupName, search, dialog;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    recipientsText = (0, stream_1["default"])("");
                    recipients = [];
                    capability = (0, stream_1["default"])("0" /* ShareCapability.Read */);
                    realGroupName = (0, GroupUtils_1.getSharedGroupName)(model.info, false);
                    customGroupName = (0, GroupUtils_1.getSharedGroupName)(model.info, true);
                    return [4 /*yield*/, (0, RecipientsSearchModel_js_1.getRecipientsSearchModel)()];
                case 1:
                    search = _a.sent();
                    dialog = Dialog_1.Dialog.showActionDialog({
                        type: "EditMedium" /* DialogType.EditMedium */,
                        title: function () { return LanguageViewModel_1.lang.get("addParticipant_action"); },
                        child: function () { return [
                            (0, mithril_1["default"])(".rel", (0, mithril_1["default"])(MailRecipientsTextField_js_1.MailRecipientsTextField, {
                                label: "shareWithEmailRecipient_label",
                                text: recipientsText(),
                                recipients: recipients,
                                disabled: false,
                                getRecipientClickedDropdownAttrs: function (address) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, [
                                                {
                                                    info: address,
                                                    center: false,
                                                    bold: false
                                                },
                                                {
                                                    label: "remove_action",
                                                    type: "secondary" /* ButtonType.Secondary */,
                                                    click: function () {
                                                        var bubbleToRemove = recipients.find(function (recipient) { return recipient.address === address; });
                                                        if (bubbleToRemove) {
                                                            (0, tutanota_utils_1.remove)(recipients, bubbleToRemove);
                                                        }
                                                    }
                                                }
                                            ]];
                                    });
                                }); },
                                onRecipientAdded: function (address, name, contact) { return recipients.push(MainLocator_1.locator.recipientsModel.resolve({ address: address, name: name, contact: contact }, RecipientsModel_1.ResolveMode.Eager)
                                    .whenResolved(function () { return mithril_1["default"].redraw(); })); },
                                onRecipientRemoved: function (address) { return (0, tutanota_utils_1.findAndRemove)(recipients, function (recipient) { return recipient.address === address; }); },
                                onTextChanged: recipientsText,
                                search: search,
                                maxSuggestionsToShow: 3
                            })),
                            (0, mithril_1["default"])(DropDownSelector_js_1.DropDownSelector, {
                                label: "permissions_label",
                                items: [
                                    {
                                        name: (0, GroupUtils_1.getCapabilityText)("2" /* ShareCapability.Invite */),
                                        value: "2" /* ShareCapability.Invite */
                                    },
                                    {
                                        name: (0, GroupUtils_1.getCapabilityText)("1" /* ShareCapability.Write */),
                                        value: "1" /* ShareCapability.Write */
                                    },
                                    {
                                        name: (0, GroupUtils_1.getCapabilityText)("0" /* ShareCapability.Read */),
                                        value: "0" /* ShareCapability.Read */
                                    },
                                ],
                                selectedValue: capability(),
                                selectionChangedHandler: capability,
                                dropdownWidth: 300
                            }),
                            (0, mithril_1["default"])(TextField_js_1.TextField, {
                                value: realGroupName,
                                label: texts.groupNameLabel,
                                disabled: true,
                                helpLabel: function () {
                                    return (0, mithril_1["default"])("", customGroupName === realGroupName ? null : texts.yourCustomNameLabel(customGroupName));
                                }
                            }),
                            (0, mithril_1["default"])(".pt", texts.addMemberMessage(customGroupName || realGroupName)),
                        ]; },
                        okAction: function () { return __awaiter(_this, void 0, void 0, function () {
                            var checkPremiumSubscription, invitedMailAddresses, e_1, showSharingBuyDialog;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (recipients.length === 0) {
                                            return [2 /*return*/, Dialog_1.Dialog.message("noRecipients_msg")];
                                        }
                                        return [4 /*yield*/, Promise.resolve().then(function () { return require("../../misc/SubscriptionDialogs"); })];
                                    case 1:
                                        checkPremiumSubscription = (_a.sent()).checkPremiumSubscription;
                                        return [4 /*yield*/, checkPremiumSubscription(false)];
                                    case 2:
                                        if (!_a.sent()) return [3 /*break*/, 14];
                                        _a.label = 3;
                                    case 3:
                                        _a.trys.push([3, 6, , 14]);
                                        return [4 /*yield*/, (0, ProgressDialog_1.showProgressDialog)("calendarInvitationProgress_msg", model.sendGroupInvitation(model.info, recipients, capability()))];
                                    case 4:
                                        invitedMailAddresses = _a.sent();
                                        dialog.close();
                                        return [4 /*yield*/, (0, GroupSharingUtils_1.sendShareNotificationEmail)(model.info, invitedMailAddresses, texts)];
                                    case 5:
                                        _a.sent();
                                        return [3 /*break*/, 14];
                                    case 6:
                                        e_1 = _a.sent();
                                        if (!(e_1 instanceof RestError_1.PreconditionFailedError)) return [3 /*break*/, 12];
                                        if (!LoginController_1.logins.getUserController().isGlobalAdmin()) return [3 /*break*/, 10];
                                        return [4 /*yield*/, Dialog_1.Dialog.confirm(function () { return texts.sharingNotOrderedAdmin; })];
                                    case 7:
                                        if (!_a.sent()) return [3 /*break*/, 9];
                                        return [4 /*yield*/, Promise.resolve().then(function () { return require("../../subscription/BuyDialog"); })];
                                    case 8:
                                        showSharingBuyDialog = (_a.sent()).showSharingBuyDialog;
                                        showSharingBuyDialog(true);
                                        _a.label = 9;
                                    case 9: return [3 /*break*/, 11];
                                    case 10:
                                        Dialog_1.Dialog.message(function () { return "".concat(texts.sharingNotOrderedUser, " ").concat(LanguageViewModel_1.lang.get("contactAdmin_msg")); });
                                        _a.label = 11;
                                    case 11: return [3 /*break*/, 13];
                                    case 12:
                                        if (e_1 instanceof UserError_1.UserError) {
                                            (0, ErrorHandlerImpl_1.showUserError)(e_1);
                                        }
                                        else if (e_1 instanceof RestError_1.TooManyRequestsError) {
                                            Dialog_1.Dialog.message("tooManyAttempts_msg");
                                        }
                                        else {
                                            throw e_1;
                                        }
                                        _a.label = 13;
                                    case 13: return [3 /*break*/, 14];
                                    case 14: return [2 /*return*/];
                                }
                            });
                        }); },
                        okActionTextId: "invite_alt"
                    }).setCloseHandler(function () {
                        dialog.close();
                    });
                    return [2 /*return*/];
            }
        });
    });
}
