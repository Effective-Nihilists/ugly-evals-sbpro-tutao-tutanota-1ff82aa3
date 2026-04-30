"use strict";
exports.__esModule = true;
exports.showGroupInvitationDialog = void 0;
var MailUtils_1 = require("../../mail/model/MailUtils");
var LoginController_1 = require("../../api/main/LoginController");
var TypeRefs_js_1 = require("../../api/entities/tutanota/TypeRefs.js");
var mithril_1 = require("mithril");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var TextField_js_1 = require("../../gui/base/TextField.js");
var stream_1 = require("mithril/stream");
var Utils_1 = require("../../api/common/utils/Utils");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Dialog_1 = require("../../gui/base/Dialog");
var Button_js_1 = require("../../gui/base/Button.js");
var EntityUtils_1 = require("../../api/common/utils/EntityUtils");
var GroupSharingUtils_1 = require("../GroupSharingUtils");
var GroupUtils_1 = require("../GroupUtils");
var SubscriptionDialogs_1 = require("../../misc/SubscriptionDialogs");
var GroupGuiUtils_1 = require("../GroupGuiUtils");
var TutanotaConstants_1 = require("../../api/common/TutanotaConstants");
var ColorPicker_1 = require("../../gui/base/ColorPicker");
var MainLocator_1 = require("../../api/main/MainLocator");
function showGroupInvitationDialog(invitation) {
    var groupType = (0, GroupUtils_1.getInvitationGroupType)(invitation);
    var texts = (0, GroupGuiUtils_1.getTextsForGroupType)(groupType);
    var userSettingsGroupRoot = LoginController_1.logins.getUserController().userSettingsGroupRoot;
    var existingGroupSettings = userSettingsGroupRoot.groupSettings.find(function (gc) { return gc.group === invitation.sharedGroup; });
    var color = existingGroupSettings ? existingGroupSettings.color : Math.random().toString(16).slice(-6);
    var colorStream = (0, stream_1["default"])("#" + color);
    var isDefaultGroupName = invitation.sharedGroupName === (0, GroupUtils_1.getDefaultGroupName)((0, tutanota_utils_1.downcast)(invitation.groupType));
    var nameStream = (0, stream_1["default"])(isDefaultGroupName ? texts.sharedGroupDefaultCustomName(invitation) : invitation.sharedGroupName);
    var isMember = !!LoginController_1.logins
        .getUserController()
        .getCalendarMemberships()
        .find(function (ms) { return (0, EntityUtils_1.isSameId)(ms.group, invitation.sharedGroup); });
    var dialog;
    var onAcceptClicked = function () {
        checkCanAcceptInvitation(invitation).then(function (canAccept) {
            if (canAccept) {
                acceptInvite(invitation, texts).then(function () {
                    dialog.close();
                    var newColor = colorStream().substring(1); // color is stored without #
                    var newName = nameStream();
                    if (existingGroupSettings) {
                        existingGroupSettings.color = newColor;
                        existingGroupSettings.name = newName;
                    }
                    else {
                        var groupSettings = Object.assign((0, TypeRefs_js_1.createGroupSettings)(), {
                            group: invitation.sharedGroup,
                            color: newColor,
                            name: newName
                        });
                        userSettingsGroupRoot.groupSettings.push(groupSettings);
                    }
                    MainLocator_1.locator.entityClient.update(userSettingsGroupRoot);
                });
            }
        });
    };
    dialog = Dialog_1.Dialog.showActionDialog({
        title: function () { return LanguageViewModel_1.lang.get("invitation_label"); },
        child: {
            view: function () {
                return (0, mithril_1["default"])(".flex.col", [
                    (0, mithril_1["default"])(".mb", [
                        (0, mithril_1["default"])(".pt.selectable", isMember ? LanguageViewModel_1.lang.getMaybeLazy(texts.alreadyGroupMemberMessage) : texts.receivedGroupInvitationMessage),
                        (0, mithril_1["default"])(TextField_js_1.TextField, {
                            value: nameStream(),
                            oninput: nameStream,
                            label: texts.groupNameLabel
                        }),
                        (0, mithril_1["default"])(TextField_js_1.TextField, {
                            value: (0, MailUtils_1.getDisplayText)(invitation.inviterName, invitation.inviterMailAddress, false),
                            label: "sender_label",
                            disabled: true
                        }),
                        (0, mithril_1["default"])(TextField_js_1.TextField, {
                            value: invitation.inviteeMailAddress,
                            label: "to_label",
                            disabled: true
                        }),
                        (0, mithril_1["default"])(TextField_js_1.TextField, {
                            value: (0, GroupUtils_1.getCapabilityText)((0, tutanota_utils_1.downcast)(invitation.capability)),
                            label: "permissions_label",
                            disabled: true
                        }),
                        groupType === TutanotaConstants_1.GroupType.Calendar ? renderCalendarGroupInvitationFields(invitation, colorStream) : null,
                    ]),
                    isMember
                        ? null
                        : (0, mithril_1["default"])(Button_js_1.Button, {
                            label: "acceptInvitation_action",
                            type: "login" /* ButtonType.Login */,
                            click: onAcceptClicked
                        }),
                ]);
            }
        },
        okActionTextId: "decline_action",
        okAction: function (dialog) {
            dialog.close();
            declineInvite(invitation, texts);
        },
        cancelActionTextId: "close_alt"
    });
}
exports.showGroupInvitationDialog = showGroupInvitationDialog;
function checkCanAcceptInvitation(invitation) {
    return Promise.resolve().then(function () { return require("../../misc/SubscriptionDialogs"); }).then(function (SubscriptionDialogUtils) { return SubscriptionDialogUtils.checkPremiumSubscription(false); })
        .then(function (allowed) {
        if (!allowed) {
            return false;
        }
        return LoginController_1.logins
            .getUserController()
            .loadCustomer()
            .then(function (customer) {
            if ((0, GroupUtils_1.groupRequiresBusinessFeature)((0, GroupUtils_1.getInvitationGroupType)(invitation)) &&
                !(0, Utils_1.isCustomizationEnabledForCustomer)(customer, TutanotaConstants_1.FeatureType.BusinessFeatureEnabled)) {
                return (0, SubscriptionDialogs_1.showBusinessFeatureRequiredDialog)("businessFeatureRequiredGeneral_msg");
            }
            else {
                return true;
            }
        });
    });
}
function renderCalendarGroupInvitationFields(invitation, selectedColourValue) {
    return [
        (0, mithril_1["default"])(".small.mt.mb-xs", LanguageViewModel_1.lang.get("color_label")),
        (0, mithril_1["default"])(ColorPicker_1.ColorPicker, {
            value: selectedColourValue(),
            onValueChange: selectedColourValue
        }),
    ];
}
function acceptInvite(invitation, texts) {
    return MainLocator_1.locator.shareFacade.acceptGroupInvitation(invitation).then(function () {
        (0, GroupSharingUtils_1.sendAcceptNotificationEmail)(invitation, texts);
    });
}
function declineInvite(invitation, texts) {
    return MainLocator_1.locator.shareFacade.rejectGroupInvitation(invitation._id).then(function () {
        (0, GroupSharingUtils_1.sendRejectNotificationEmail)(invitation, texts);
    });
}
