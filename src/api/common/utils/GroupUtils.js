"use strict";
exports.__esModule = true;
exports.compareGroupInfos = exports.getGroupInfoDisplayName = exports.getUserGroupMemberships = exports.getEnabledMailAddressesForGroupInfo = void 0;
var TutanotaConstants_1 = require("../TutanotaConstants");
function getEnabledMailAddressesForGroupInfo(groupInfo) {
    var aliases = groupInfo.mailAddressAliases.filter(function (alias) { return alias.enabled; }).map(function (alias) { return alias.mailAddress; });
    if (groupInfo.mailAddress)
        aliases.unshift(groupInfo.mailAddress);
    return aliases;
}
exports.getEnabledMailAddressesForGroupInfo = getEnabledMailAddressesForGroupInfo;
/**
 * Provides the memberships of the user with the given type. In case of area groups all groups are returned.
 */
function getUserGroupMemberships(user, groupType) {
    if (groupType === TutanotaConstants_1.GroupType.User) {
        return [user.userGroup];
    }
    else {
        return user.memberships.filter(function (m) { return m.groupType === groupType; });
    }
}
exports.getUserGroupMemberships = getUserGroupMemberships;
/**
 * Provides the name if available, otherwise the email address if available, otherwise an empty string.
 */
function getGroupInfoDisplayName(groupInfo) {
    if (groupInfo.name) {
        return groupInfo.name;
    }
    else if (groupInfo.mailAddress) {
        return groupInfo.mailAddress;
    }
    else {
        return "";
    }
}
exports.getGroupInfoDisplayName = getGroupInfoDisplayName;
function compareGroupInfos(a, b) {
    return getGroupInfoDisplayName(a).localeCompare(getGroupInfoDisplayName(b));
}
exports.compareGroupInfos = compareGroupInfos;
