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
exports.loadGroupInfos = exports.loadEnabledUserMailGroups = exports.loadEnabledTeamMailGroups = exports.loadGroupDisplayName = exports.GroupData = void 0;
var TypeRefs_js_1 = require("../api/entities/sys/TypeRefs.js");
var TypeRefs_js_2 = require("../api/entities/sys/TypeRefs.js");
var TypeRefs_js_3 = require("../api/entities/sys/TypeRefs.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var TutanotaConstants_1 = require("../api/common/TutanotaConstants");
var tutanota_utils_2 = require("@tutao/tutanota-utils");
var GroupUtils_1 = require("../api/common/utils/GroupUtils");
var tutanota_utils_3 = require("@tutao/tutanota-utils");
var MainLocator_1 = require("../api/main/MainLocator");
var EntityUtils_1 = require("../api/common/utils/EntityUtils");
/**
 * As users personal mail group infos do not contain name and mail address we use this wrapper to store group ids together with name and mail address.
 */
var GroupData = /** @class */ (function () {
    function GroupData(groupId, displayName) {
        this.groupId = groupId;
        this.displayName = displayName;
    }
    return GroupData;
}());
exports.GroupData = GroupData;
function loadGroupDisplayName(groupId) {
    return MainLocator_1.locator.entityClient
        .load(TypeRefs_js_1.GroupTypeRef, groupId)
        .then(function (group) {
        if (group.user && group.type !== TutanotaConstants_1.GroupType.User) {
            // the users personal mail group does not have a name, so show the user name
            return MainLocator_1.locator.entityClient.load(TypeRefs_js_2.UserTypeRef, group.user).then(function (user) {
                return MainLocator_1.locator.entityClient.load(TypeRefs_js_3.GroupInfoTypeRef, user.userGroup.groupInfo);
            });
        }
        else {
            return MainLocator_1.locator.entityClient.load(TypeRefs_js_3.GroupInfoTypeRef, group.groupInfo);
        }
    })
        .then(function (groupInfo) {
        return (0, GroupUtils_1.getGroupInfoDisplayName)(groupInfo);
    });
}
exports.loadGroupDisplayName = loadGroupDisplayName;
function loadEnabledTeamMailGroups(customer) {
    return __awaiter(this, void 0, void 0, function () {
        var infos;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, MainLocator_1.locator.entityClient.loadAll(TypeRefs_js_3.GroupInfoTypeRef, customer.teamGroups)];
                case 1:
                    infos = _a.sent();
                    return [2 /*return*/, infos
                            .filter(function (teamGroupInfo) {
                            if (teamGroupInfo.deleted) {
                                return false;
                            }
                            else {
                                return MainLocator_1.locator.entityClient.load(TypeRefs_js_1.GroupTypeRef, teamGroupInfo.group).then(function (teamGroup) { return teamGroup.type === TutanotaConstants_1.GroupType.Mail; });
                            }
                        })
                            .map(function (mailTeamGroupInfo) { return new GroupData(mailTeamGroupInfo.group, (0, GroupUtils_1.getGroupInfoDisplayName)(mailTeamGroupInfo)); })];
            }
        });
    });
}
exports.loadEnabledTeamMailGroups = loadEnabledTeamMailGroups;
function loadEnabledUserMailGroups(customer) {
    return __awaiter(this, void 0, void 0, function () {
        var groupInfos;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, MainLocator_1.locator.entityClient.loadAll(TypeRefs_js_3.GroupInfoTypeRef, customer.userGroups)];
                case 1:
                    groupInfos = _a.sent();
                    return [2 /*return*/, (0, tutanota_utils_3.promiseMap)(groupInfos.filter(function (g) { return !g.deleted; }), function (userGroupInfo) { return __awaiter(_this, void 0, void 0, function () {
                            var userGroup, user;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, MainLocator_1.locator.entityClient.load(TypeRefs_js_1.GroupTypeRef, userGroupInfo.group)];
                                    case 1:
                                        userGroup = _a.sent();
                                        return [4 /*yield*/, MainLocator_1.locator.entityClient.load(TypeRefs_js_2.UserTypeRef, (0, tutanota_utils_1.neverNull)(userGroup.user))];
                                    case 2:
                                        user = _a.sent();
                                        return [2 /*return*/, new GroupData((0, GroupUtils_1.getUserGroupMemberships)(user, TutanotaConstants_1.GroupType.Mail)[0].group, (0, GroupUtils_1.getGroupInfoDisplayName)(userGroupInfo))];
                                }
                            });
                        }); })];
            }
        });
    });
}
exports.loadEnabledUserMailGroups = loadEnabledUserMailGroups;
function loadGroupInfos(groupInfoIds) {
    var groupedParticipantGroupInfos = (0, tutanota_utils_1.groupByAndMap)(groupInfoIds, EntityUtils_1.listIdPart, EntityUtils_1.elementIdPart);
    return (0, tutanota_utils_3.promiseMap)(groupedParticipantGroupInfos.entries(), function (_a) {
        var listId = _a[0], elementIds = _a[1];
        return MainLocator_1.locator.entityClient.loadMultiple(TypeRefs_js_3.GroupInfoTypeRef, listId, elementIds);
    }, {
        concurrency: 5
    }).then(tutanota_utils_2.flat);
}
exports.loadGroupInfos = loadGroupInfos;
