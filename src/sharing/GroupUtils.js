"use strict";
exports.__esModule = true;
exports.TemplateGroupPreconditionFailedReason = exports.isShareableGroupType = exports.groupRequiresBusinessFeature = exports.getInvitationGroupType = exports.loadReceivedGroupInvitations = exports.getDefaultGroupName = exports.loadGroupInfoForMember = exports.loadGroupMembers = exports.getMemberCabability = exports.getSharedGroupName = exports.getCapabilityText = exports.isSharedGroupOwner = exports.hasCapabilityOnGroup = void 0;
var TutanotaConstants_1 = require("../api/common/TutanotaConstants");
var EntityUtils_1 = require("../api/common/utils/EntityUtils");
var LanguageViewModel_1 = require("../misc/LanguageViewModel");
var TypeRefs_js_1 = require("../api/entities/sys/TypeRefs.js");
var LoginController_1 = require("../api/main/LoginController");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var TypeRefs_js_2 = require("../api/entities/sys/TypeRefs.js");
var tutanota_utils_2 = require("@tutao/tutanota-utils");
var TypeRefs_js_3 = require("../api/entities/sys/TypeRefs.js");
var TypeRefs_js_4 = require("../api/entities/sys/TypeRefs.js");
var RestError_1 = require("../api/common/error/RestError");
/**
 * Whether or not a user has a given capability for a shared group. If the group type is not shareable, this will always return false
 * @param user
 * @param group
 * @param requiredCapability
 * @returns {boolean}
 */
function hasCapabilityOnGroup(user, group, requiredCapability) {
    if (!isShareableGroupType((0, tutanota_utils_1.downcast)(group.type))) {
        return false;
    }
    if (isSharedGroupOwner(group, user._id)) {
        return true;
    }
    var membership = user.memberships.find(function (gm) { return (0, EntityUtils_1.isSameId)(gm.group, group._id); });
    if (membership) {
        return membership.capability != null && Number(requiredCapability) <= Number(membership.capability);
    }
    return false;
}
exports.hasCapabilityOnGroup = hasCapabilityOnGroup;
function isSharedGroupOwner(sharedGroup, user) {
    return !!(sharedGroup.user && (0, EntityUtils_1.isSameId)(sharedGroup.user, typeof user === "string" ? user : (0, EntityUtils_1.getEtId)(user)));
}
exports.isSharedGroupOwner = isSharedGroupOwner;
function getCapabilityText(capability) {
    switch (capability) {
        case "2" /* ShareCapability.Invite */:
            return LanguageViewModel_1.lang.get("groupCapabilityInvite_label");
        case "1" /* ShareCapability.Write */:
            return LanguageViewModel_1.lang.get("groupCapabilityWrite_label");
        case "0" /* ShareCapability.Read */:
            return LanguageViewModel_1.lang.get("groupCapabilityRead_label");
        default:
            return LanguageViewModel_1.lang.get("comboBoxSelectionNone_msg");
    }
}
exports.getCapabilityText = getCapabilityText;
function getSharedGroupName(groupInfo, allowGroupNameOverride) {
    var userSettingsGroupRoot = LoginController_1.logins.getUserController().userSettingsGroupRoot;
    var groupSettings = userSettingsGroupRoot.groupSettings.find(function (gc) { return gc.group === groupInfo.group; });
    return (allowGroupNameOverride && groupSettings && groupSettings.name) || groupInfo.name || getDefaultGroupName((0, tutanota_utils_1.downcast)(groupInfo.groupType));
}
exports.getSharedGroupName = getSharedGroupName;
function getMemberCabability(memberInfo, group) {
    if (isSharedGroupOwner(group, memberInfo.member.user)) {
        return "2" /* ShareCapability.Invite */;
    }
    return (0, tutanota_utils_1.downcast)(memberInfo.member.capability);
}
exports.getMemberCabability = getMemberCabability;
function loadGroupMembers(group, entityClient) {
    return entityClient.loadAll(TypeRefs_js_2.GroupMemberTypeRef, group.members).then(function (members) { return (0, tutanota_utils_2.promiseMap)(members, function (member) { return loadGroupInfoForMember(member, entityClient); }); });
}
exports.loadGroupMembers = loadGroupMembers;
function loadGroupInfoForMember(groupMember, entityClient) {
    return entityClient.load(TypeRefs_js_1.GroupInfoTypeRef, groupMember.userGroupInfo).then(function (userGroupInfo) {
        return {
            member: groupMember,
            info: userGroupInfo
        };
    });
}
exports.loadGroupInfoForMember = loadGroupInfoForMember;
function getDefaultGroupName(groupType) {
    switch (groupType) {
        case TutanotaConstants_1.GroupType.Calendar:
            return LanguageViewModel_1.lang.get("privateCalendar_label");
        case TutanotaConstants_1.GroupType.Template:
            return LanguageViewModel_1.lang.get("templateGroupDefaultName_label");
        default:
            return TutanotaConstants_1.GroupTypeNameByCode[groupType];
    }
}
exports.getDefaultGroupName = getDefaultGroupName;
function loadReceivedGroupInvitations(userController, entityClient, type) {
    return entityClient
        .load(TypeRefs_js_4.UserGroupRootTypeRef, userController.userGroupInfo.group)
        .then(function (userGroupRoot) { return entityClient.loadAll(TypeRefs_js_3.ReceivedGroupInvitationTypeRef, userGroupRoot.invitations); })
        .then(function (invitations) { return invitations.filter(function (invitation) { return getInvitationGroupType(invitation) === type; }); })["catch"]((0, tutanota_utils_2.ofClass)(RestError_1.NotFoundError, function () { return []; }));
}
exports.loadReceivedGroupInvitations = loadReceivedGroupInvitations;
// Group invitations without a type set were sent when Calendars were the only shareable kind of user group
var DEFAULT_GROUP_TYPE = TutanotaConstants_1.GroupType.Calendar;
function getInvitationGroupType(invitation) {
    return invitation.groupType === null ? DEFAULT_GROUP_TYPE : (0, tutanota_utils_1.downcast)(invitation.groupType);
}
exports.getInvitationGroupType = getInvitationGroupType;
function groupRequiresBusinessFeature(groupType) {
    return groupType === TutanotaConstants_1.GroupType.Template;
}
exports.groupRequiresBusinessFeature = groupRequiresBusinessFeature;
function isShareableGroupType(groupType) {
    // Should be synchronised with GroupType::isShareableGroup in tutadb
    return groupType === TutanotaConstants_1.GroupType.Calendar || groupType === TutanotaConstants_1.GroupType.Template;
}
exports.isShareableGroupType = isShareableGroupType;
exports.TemplateGroupPreconditionFailedReason = Object.freeze({
    BUSINESS_FEATURE_REQUIRED: "templategroup.business_feature_required"
});
