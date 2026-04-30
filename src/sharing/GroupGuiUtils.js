"use strict";
exports.__esModule = true;
exports.getTextsForGroupType = void 0;
var LanguageViewModel_1 = require("../misc/LanguageViewModel");
var TutanotaConstants_1 = require("../api/common/TutanotaConstants");
var ProgrammingError_1 = require("../api/common/error/ProgrammingError");
var GroupUtils_1 = require("./GroupUtils");
var CALENDAR_SHARING_TEXTS = function () { return ({
    groupNameLabel: "calendarName_label",
    participantsLabel: function (groupName) {
        return LanguageViewModel_1.lang.get("participants_label", {
            "{name}": groupName
        });
    },
    acceptEmailSubject: LanguageViewModel_1.lang.get("shareCalendarAcceptEmailSubject_msg"),
    acceptEmailBody: function (userName, invitee, groupName) {
        return LanguageViewModel_1.lang.get("shareCalendarAcceptEmailBody_msg", {
            "{invitee}": invitee,
            "{calendarName}": groupName,
            "{recipientName}": userName
        });
    },
    declineEmailSubject: LanguageViewModel_1.lang.get("shareCalendarDeclineEmailSubject_msg"),
    declineEmailBody: function (userName, invitee, groupName) {
        return LanguageViewModel_1.lang.get("shareCalendarDeclineEmailBody_msg", {
            "{invitee}": invitee,
            "{calendarName}": groupName,
            "{recipientName}": userName
        });
    },
    shareEmailSubject: LanguageViewModel_1.lang.get("shareCalendarInvitationEmailSubject_msg"),
    shareEmailBody: function (calendarName, sender) {
        return LanguageViewModel_1.lang.get("shareCalendarInvitationEmailBody_msg", {
            // Sender is displayed like Name <mail.address@tutanota.com>. Less-than and greater-than must be encoded for HTML
            "{inviter}": sender,
            "{calendarName}": calendarName
        });
    },
    addMemberMessage: function (_) { return "".concat(LanguageViewModel_1.lang.get("shareCalendarWarning_msg"), " ").concat(LanguageViewModel_1.lang.get("shareCalendarWarningAliases_msg")); },
    removeMemberMessage: function (calendarName, invitee) {
        return LanguageViewModel_1.lang.get("removeCalendarParticipantConfirm_msg", {
            "{participant}": invitee,
            "{calendarName}": calendarName
        });
    },
    sharingNotOrderedAdmin: LanguageViewModel_1.lang.get("sharingFeatureNotOrderedAdmin_msg"),
    sharingNotOrderedUser: LanguageViewModel_1.lang.get("sharingFeatureNotOrderedUser_msg"),
    alreadyGroupMemberMessage: "alreadyMember_msg",
    receivedGroupInvitationMessage: "".concat(LanguageViewModel_1.lang.get("shareCalendarWarning_msg"), " ").concat(LanguageViewModel_1.lang.get("shareCalendarWarningAliases_msg")),
    sharedGroupDefaultCustomName: function (groupOwnerName) { return (0, GroupUtils_1.getDefaultGroupName)(TutanotaConstants_1.GroupType.Calendar); },
    yourCustomNameLabel: function (groupName) {
        return LanguageViewModel_1.lang.get("customName_label", {
            "{customName}": groupName
        });
    }
}); };
var TEMPLATE_SHARING_TEXTS = function () { return ({
    groupNameLabel: "templateGroupName_label",
    participantsLabel: function (groupName) {
        return LanguageViewModel_1.lang.get("templateGroupParticipants_label", {
            "{groupName}": groupName
        });
    },
    acceptEmailSubject: LanguageViewModel_1.lang.get("acceptTemplateGroupEmailSubject_msg"),
    acceptEmailBody: function (userName, invitee, groupName) {
        return LanguageViewModel_1.lang.get("acceptTemplateGroupEmailBody_msg", {
            "{recipientName}": userName,
            "{invitee}": invitee,
            "{groupName}": groupName
        });
    },
    declineEmailSubject: LanguageViewModel_1.lang.get("declineTemplateGroupEmailSubject_msg"),
    declineEmailBody: function (userName, invitee, groupName) {
        return LanguageViewModel_1.lang.get("declineTemplateGroupEmailBody_msg", {
            "{recipientName}": userName,
            "{invitee}": invitee,
            "{groupName}": groupName
        });
    },
    shareEmailSubject: LanguageViewModel_1.lang.get("shareTemplateGroupEmailSubject_msg"),
    shareEmailBody: function (sharer, groupName) {
        return LanguageViewModel_1.lang.get("shareTemplateGroupEmailBody_msg", {
            "{inviter}": sharer,
            "{groupName}": groupName
        });
    },
    addMemberMessage: function (groupName) { return "".concat(LanguageViewModel_1.lang.get("shareTemplateGroupWarning_msg"), " ").concat(LanguageViewModel_1.lang.get("shareCalendarWarningAliases_msg")); },
    removeMemberMessage: function (groupName, member) {
        return LanguageViewModel_1.lang.get("removeTemplateGroupMemberConfirm_msg", {
            "{member}": member,
            "{groupName}": groupName
        });
    },
    sharingNotOrderedUser: LanguageViewModel_1.lang.get("templateSharingNotOrdered_msg"),
    sharingNotOrderedAdmin: LanguageViewModel_1.lang.get("templateSharingNotOrdered_msg"),
    alreadyGroupMemberMessage: "alreadyTemplateGroupMember_msg",
    receivedGroupInvitationMessage: "".concat(LanguageViewModel_1.lang.get("shareTemplateGroupWarning_msg"), " ").concat(LanguageViewModel_1.lang.get("shareCalendarWarningAliases_msg")),
    sharedGroupDefaultCustomName: function (invitation) {
        return LanguageViewModel_1.lang.get("sharedTemplateGroupDefaultName_label", {
            "{ownerName}": invitation.inviterName || invitation.inviterMailAddress
        });
    },
    yourCustomNameLabel: function (groupName) {
        return LanguageViewModel_1.lang.get("customTemplateListName_label", {
            "{customName}": groupName
        });
    }
}); };
function getTextsForGroupType(groupType) {
    switch (groupType) {
        case TutanotaConstants_1.GroupType.Calendar:
            return CALENDAR_SHARING_TEXTS();
        case TutanotaConstants_1.GroupType.Template:
            return TEMPLATE_SHARING_TEXTS();
        default:
            throw new ProgrammingError_1.ProgrammingError("Group type ".concat(groupType, " is not shareable"));
    }
}
exports.getTextsForGroupType = getTextsForGroupType;
