"use strict";
exports.__esModule = true;
exports.UserFacade = void 0;
var TutanotaConstants_1 = require("../../common/TutanotaConstants");
var tutanota_crypto_1 = require("@tutao/tutanota-crypto");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var ProgrammingError_1 = require("../../common/error/ProgrammingError");
var TypeRefs_1 = require("../../entities/sys/TypeRefs");
var LoginIncompleteError_1 = require("../../common/error/LoginIncompleteError");
/** Holder for the user and session-related data on the worker side. */
var UserFacade = /** @class */ (function () {
    function UserFacade() {
        this.user = null;
        this.accessToken = null;
        /** A cache for decrypted keys of each group. Encrypted keys are stored on membership.symEncGKey. */
        this.groupKeys = new Map();
        this.reset();
    }
    // Login process is somehow multi-step and we don't use a separate network stack for it. So we have to break up setters.
    // 1. We need to download user. For that we need to set access token already (to authenticate the request for the server as its passed in headers).
    // 2. We need to get group keys. For that we need to unlock userGroupKey with userPasspharseKey
    // so this leads to this steps in UserFacade:
    // 1. Access token is set
    // 2. User is set
    // 3. UserGroupKey is unlocked
    UserFacade.prototype.setAccessToken = function (accessToken) {
        this.accessToken = accessToken;
    };
    UserFacade.prototype.setUser = function (user) {
        if (this.accessToken == null) {
            throw new ProgrammingError_1.ProgrammingError("invalid state: no access token");
        }
        this.user = user;
    };
    UserFacade.prototype.unlockUserGroupKey = function (userPassphraseKey) {
        if (this.user == null) {
            throw new ProgrammingError_1.ProgrammingError("Invalid state: no user");
        }
        this.groupKeys.set(this.getUserGroupId(), (0, tutanota_crypto_1.decryptKey)(userPassphraseKey, this.user.userGroup.symEncGKey));
    };
    UserFacade.prototype.updateUser = function (user) {
        if (this.user == null) {
            throw new ProgrammingError_1.ProgrammingError("Update user is called without logging in. This function is not for you.");
        }
        this.user = user;
    };
    UserFacade.prototype.getUser = function () {
        return this.user;
    };
    /**
     * @return The map which contains authentication data for the logged in user.
     */
    UserFacade.prototype.createAuthHeaders = function () {
        return this.accessToken
            ? {
                accessToken: this.accessToken
            }
            : {};
    };
    UserFacade.prototype.getUserGroupId = function () {
        return this.getLoggedInUser().userGroup.group;
    };
    UserFacade.prototype.getAllGroupIds = function () {
        var groups = this.getLoggedInUser().memberships.map(function (membership) { return membership.group; });
        groups.push(this.getLoggedInUser().userGroup.group);
        return groups;
    };
    UserFacade.prototype.getUserGroupKey = function () {
        // the userGroupKey is always written after the login to this.groupKeys
        //if the user has only logged in offline this has not happened
        var userGroupKey = this.groupKeys.get(this.getUserGroupId());
        if (userGroupKey == null) {
            if (this.isPartiallyLoggedIn()) {
                throw new LoginIncompleteError_1.LoginIncompleteError("userGroupKey not available");
            }
            else {
                throw new ProgrammingError_1.ProgrammingError("Invalid state: userGroupKey is not available");
            }
        }
        return userGroupKey;
    };
    UserFacade.prototype.getGroupKey = function (groupId) {
        var _this = this;
        return (0, tutanota_utils_1.getFromMap)(this.groupKeys, groupId, function () {
            return (0, tutanota_crypto_1.decryptKey)(_this.getUserGroupKey(), _this.getMembership(groupId).symEncGKey);
        });
    };
    UserFacade.prototype.getMembership = function (groupId) {
        var membership = this.getLoggedInUser().memberships.find(function (g) { return g.group === groupId; });
        if (!membership) {
            throw new Error("No group with groupId ".concat(groupId, " found!"));
        }
        return membership;
    };
    UserFacade.prototype.hasGroup = function (groupId) {
        if (!this.user) {
            return false;
        }
        else {
            return groupId === this.user.userGroup.group || this.user.memberships.some(function (m) { return m.group === groupId; });
        }
    };
    UserFacade.prototype.getGroupId = function (groupType) {
        if (groupType === TutanotaConstants_1.GroupType.User) {
            return this.getUserGroupId();
        }
        else {
            var membership = this.getLoggedInUser().memberships.find(function (m) { return m.groupType === groupType; });
            if (!membership) {
                throw new Error("could not find groupType " + groupType + " for user " + this.getLoggedInUser()._id);
            }
            return membership.group;
        }
    };
    UserFacade.prototype.getGroupIds = function (groupType) {
        return this.getLoggedInUser()
            .memberships.filter(function (m) { return m.groupType === groupType; })
            .map(function (gm) { return gm.group; });
    };
    UserFacade.prototype.isPartiallyLoggedIn = function () {
        return this.user != null;
    };
    UserFacade.prototype.isFullyLoggedIn = function () {
        // We have userGroupKey and we can decrypt any other key - we are good to go
        return this.groupKeys.size > 0;
    };
    UserFacade.prototype.getLoggedInUser = function () {
        return (0, tutanota_utils_1.assertNotNull)(this.user);
    };
    UserFacade.prototype.setLeaderStatus = function (status) {
        this.leaderStatus = status;
        console.log("New leader status set:", status.leaderStatus);
    };
    UserFacade.prototype.isLeader = function () {
        return this.leaderStatus.leaderStatus;
    };
    UserFacade.prototype.reset = function () {
        this.user = null;
        this.accessToken = null;
        this.groupKeys = new Map();
        this.leaderStatus = (0, TypeRefs_1.createWebsocketLeaderStatus)({
            leaderStatus: false
        });
    };
    return UserFacade;
}());
exports.UserFacade = UserFacade;
