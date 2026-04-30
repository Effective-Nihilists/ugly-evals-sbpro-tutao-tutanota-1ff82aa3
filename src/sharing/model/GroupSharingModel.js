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
exports.GroupSharingModel = void 0;
var stream_1 = require("mithril/stream");
var EventController_1 = require("../../api/main/EventController");
var EntityUtils_1 = require("../../api/common/utils/EntityUtils");
var TypeRefs_js_1 = require("../../api/entities/sys/TypeRefs.js");
var RestError_1 = require("../../api/common/error/RestError");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var TypeRefs_js_2 = require("../../api/entities/sys/TypeRefs.js");
var TypeRefs_js_3 = require("../../api/entities/sys/TypeRefs.js");
var GroupUtils_1 = require("../GroupUtils");
var UserError_1 = require("../../api/main/UserError");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var RecipientsNotFoundError_1 = require("../../api/common/error/RecipientsNotFoundError");
var ProgrammingError_1 = require("../../api/common/error/ProgrammingError");
var RecipientsModel_1 = require("../../api/main/RecipientsModel");
var GroupSharingModel = /** @class */ (function () {
    function GroupSharingModel(groupInfo, group, memberInfos, sentGroupInvitations, eventController, entityClient, logins, mailFacade, shareFacade, groupManagementFacade, recipientsModel) {
        var _this = this;
        this.recipientsModel = recipientsModel;
        this.info = groupInfo;
        this.group = group;
        this.memberInfos = memberInfos;
        this.sentGroupInvitations = sentGroupInvitations;
        this.eventController = eventController;
        this.entityClient = entityClient;
        this.logins = logins;
        this._mailFacade = mailFacade;
        this._shareFacade = shareFacade;
        this._groupManagementFacade = groupManagementFacade;
        this.onEntityUpdate = (0, stream_1["default"])();
        this.eventController.addEntityListener(function (events, id) { return _this.entityEventsReceived(events, id); });
    }
    GroupSharingModel.newAsync = function (info, eventController, entityClient, logins, mailFacade, shareFacade, groupManagementFacade, recipientsModel) {
        return entityClient
            .load(TypeRefs_js_3.GroupTypeRef, info.group)
            .then(function (group) {
            return Promise.all([entityClient.loadAll(TypeRefs_js_1.SentGroupInvitationTypeRef, group.invitations), (0, GroupUtils_1.loadGroupMembers)(group, entityClient)]).then(function (_a) {
                var sentGroupInvitations = _a[0], memberInfos = _a[1];
                return new GroupSharingModel(info, group, memberInfos, sentGroupInvitations, eventController, entityClient, logins, mailFacade, shareFacade, groupManagementFacade, recipientsModel);
            });
        });
    };
    GroupSharingModel.prototype.dispose = function () {
        var _this = this;
        this.eventController.removeEntityListener(function (events, id) { return _this.entityEventsReceived(events, id); });
    };
    /**
     * Whether or not a given member can be removed from the group by the current user
     */
    GroupSharingModel.prototype.canRemoveGroupMember = function (member) {
        return (((0, GroupUtils_1.hasCapabilityOnGroup)(this.logins.getUserController().user, this.group, "2" /* ShareCapability.Invite */) ||
            (0, EntityUtils_1.isSameId)(this.logins.getUserController().user._id, member.user)) &&
            !(0, GroupUtils_1.isSharedGroupOwner)(this.group, member.user));
    };
    GroupSharingModel.prototype.removeGroupMember = function (member) {
        return this.canRemoveGroupMember(member)
            ? this._groupManagementFacade.removeUserFromGroup(member.user, (0, EntityUtils_1.getEtId)(this.group))
            : Promise.reject(new ProgrammingError_1.ProgrammingError("User does not have permission to remove this member from the group"));
    };
    /**
     * Whether or not a given invitation can be cancelled by the current user
     * @param group
     * @param sentGroupInvitation
     * @returns {boolean}
     */
    GroupSharingModel.prototype.canCancelInvitation = function (sentGroupInvitation) {
        return ((0, GroupUtils_1.hasCapabilityOnGroup)(this.logins.getUserController().user, this.group, "2" /* ShareCapability.Invite */) ||
            (0, GroupUtils_1.isSharedGroupOwner)(this.group, this.logins.getUserController().user._id));
    };
    GroupSharingModel.prototype.cancelInvitation = function (invitation) {
        return this.canCancelInvitation(invitation) && invitation.receivedInvitation
            ? this._shareFacade.rejectGroupInvitation(invitation.receivedInvitation)
            : Promise.reject(new Error("User does not have permission to cancel this invitation")); // TODO error type
    };
    GroupSharingModel.prototype.sendGroupInvitation = function (sharedGroupInfo, recipients, capability) {
        return __awaiter(this, void 0, void 0, function () {
            var externalRecipients, _i, recipients_1, recipient, resolved, groupInvitationReturn, e_1, existingMailAddresses_1, invalidMailAddresses_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        externalRecipients = [];
                        _i = 0, recipients_1 = recipients;
                        _a.label = 1;
                    case 1:
                        if (!(_i < recipients_1.length)) return [3 /*break*/, 4];
                        recipient = recipients_1[_i];
                        return [4 /*yield*/, this.recipientsModel.resolve(recipient, RecipientsModel_1.ResolveMode.Eager).resolved()];
                    case 2:
                        resolved = _a.sent();
                        if (resolved.type !== "internal" /* RecipientType.INTERNAL */) {
                            externalRecipients.push(resolved.address);
                        }
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        if (externalRecipients.length) {
                            throw new UserError_1.UserError(function () { return LanguageViewModel_1.lang.get("featureTutanotaOnly_msg") + " " + LanguageViewModel_1.lang.get("invalidRecipients_msg") + "\n" + externalRecipients.join("\n"); });
                        }
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, this._shareFacade.sendGroupInvitation(sharedGroupInfo, (0, GroupUtils_1.getSharedGroupName)(sharedGroupInfo, false), recipients.map(function (r) { return r.address; }), capability)];
                    case 6:
                        groupInvitationReturn = _a.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        e_1 = _a.sent();
                        if (e_1 instanceof RecipientsNotFoundError_1.RecipientsNotFoundError) {
                            throw new UserError_1.UserError(function () { return "".concat(LanguageViewModel_1.lang.get("tutanotaAddressDoesNotExist_msg"), " ").concat(LanguageViewModel_1.lang.get("invalidRecipients_msg"), "\n").concat(e_1.message); });
                        }
                        else {
                            throw e_1;
                        }
                        return [3 /*break*/, 8];
                    case 8:
                        if (groupInvitationReturn.existingMailAddresses.length > 0 || groupInvitationReturn.invalidMailAddresses.length > 0) {
                            existingMailAddresses_1 = groupInvitationReturn.existingMailAddresses.map(function (ma) { return ma.address; }).join("\n");
                            invalidMailAddresses_1 = groupInvitationReturn.invalidMailAddresses.map(function (ma) { return ma.address; }).join("\n");
                            throw new UserError_1.UserError(function () {
                                var msg = "";
                                msg += existingMailAddresses_1.length === 0 ? "" : LanguageViewModel_1.lang.get("existingMailAddress_msg") + "\n" + existingMailAddresses_1;
                                msg += existingMailAddresses_1.length === 0 && invalidMailAddresses_1.length === 0 ? "" : "\n\n";
                                msg += invalidMailAddresses_1.length === 0 ? "" : LanguageViewModel_1.lang.get("invalidMailAddress_msg") + "\n" + invalidMailAddresses_1;
                                return msg;
                            });
                        }
                        return [2 /*return*/, groupInvitationReturn.invitedMailAddresses];
                }
            });
        });
    };
    GroupSharingModel.prototype.entityEventsReceived = function (updates, eventOwnerGroupId) {
        var _this = this;
        return (0, tutanota_utils_1.promiseMap)(updates, function (update) {
            if (!(0, EntityUtils_1.isSameId)(eventOwnerGroupId, (0, EntityUtils_1.getEtId)(_this.group))) {
                // ignore events of different group here
                return;
            }
            if ((0, EventController_1.isUpdateForTypeRef)(TypeRefs_js_1.SentGroupInvitationTypeRef, update)) {
                if (update.operation === "0" /* OperationType.CREATE */ && (0, EntityUtils_1.isSameId)(update.instanceListId, _this.group.invitations)) {
                    return _this.entityClient
                        .load(TypeRefs_js_1.SentGroupInvitationTypeRef, [update.instanceListId, update.instanceId])
                        .then(function (instance) {
                        if (instance) {
                            _this.sentGroupInvitations.push(instance);
                            _this.onEntityUpdate();
                        }
                    })["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotFoundError, function (e) { return console.log("sent invitation not found", update); }));
                }
                if (update.operation === "2" /* OperationType.DELETE */) {
                    (0, tutanota_utils_1.findAndRemove)(_this.sentGroupInvitations, function (sentGroupInvitation) { return (0, EntityUtils_1.isSameId)((0, EntityUtils_1.getElementId)(sentGroupInvitation), update.instanceId); });
                    _this.onEntityUpdate();
                }
            }
            else if ((0, EventController_1.isUpdateForTypeRef)(TypeRefs_js_2.GroupMemberTypeRef, update)) {
                console.log("update received in share dialog", update);
                if (update.operation === "0" /* OperationType.CREATE */ && (0, EntityUtils_1.isSameId)(update.instanceListId, _this.group.members)) {
                    return _this.entityClient
                        .load(TypeRefs_js_2.GroupMemberTypeRef, [update.instanceListId, update.instanceId])
                        .then(function (instance) {
                        if (instance) {
                            return (0, GroupUtils_1.loadGroupInfoForMember)(instance, _this.entityClient).then(function (groupMemberInfo) {
                                console.log("new member", groupMemberInfo);
                                _this.memberInfos.push(groupMemberInfo);
                                _this.onEntityUpdate();
                            });
                        }
                    })["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotFoundError, function (e) { return console.log("group member not found", update); }));
                }
                if (update.operation === "2" /* OperationType.DELETE */) {
                    (0, tutanota_utils_1.findAndRemove)(_this.memberInfos, function (memberInfo) { return (0, EntityUtils_1.isSameId)((0, EntityUtils_1.getElementId)(memberInfo.member), update.instanceId); });
                    _this.onEntityUpdate();
                }
            }
        }).then(tutanota_utils_1.noOp);
    };
    return GroupSharingModel;
}());
exports.GroupSharingModel = GroupSharingModel;
