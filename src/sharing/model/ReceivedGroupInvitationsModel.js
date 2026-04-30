"use strict";
exports.__esModule = true;
exports.ReceivedGroupInvitationsModel = void 0;
var stream_1 = require("mithril/stream");
var TypeRefs_js_1 = require("../../api/entities/sys/TypeRefs.js");
var EventController_1 = require("../../api/main/EventController");
var GroupUtils_1 = require("../GroupUtils");
var EntityUtils_1 = require("../../api/common/utils/EntityUtils");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var ReceivedGroupInvitationsModel = /** @class */ (function () {
    function ReceivedGroupInvitationsModel(groupType, eventController, entityClient, logins) {
        this.invitations = (0, stream_1["default"])([]);
        this.groupType = groupType;
        this.eventController = eventController;
        this.entityClient = entityClient;
        this.logins = logins;
    }
    ReceivedGroupInvitationsModel.prototype.init = function () {
        var _this = this;
        this.eventController.addEntityListener(this.entityEventsReceived.bind(this));
        (0, GroupUtils_1.loadReceivedGroupInvitations)(this.logins.getUserController(), this.entityClient, this.groupType).then(function (invitations) {
            return _this.invitations(invitations.filter(function (invitation) { return _this.hasCorrectGroupType(invitation); }));
        });
    };
    ReceivedGroupInvitationsModel.prototype.dispose = function () {
        this.eventController.removeEntityListener(this.entityEventsReceived.bind(this));
    };
    ReceivedGroupInvitationsModel.prototype.entityEventsReceived = function (updates, eventOwnerGroupId) {
        var _this = this;
        return (0, tutanota_utils_1.promiseMap)(updates, function (update) {
            if ((0, EventController_1.isUpdateForTypeRef)(TypeRefs_js_1.ReceivedGroupInvitationTypeRef, update)) {
                var updateId_1 = [update.instanceListId, update.instanceId];
                if (update.operation === "0" /* OperationType.CREATE */) {
                    return _this.entityClient.load(TypeRefs_js_1.ReceivedGroupInvitationTypeRef, updateId_1).then(function (invitation) {
                        if (_this.hasCorrectGroupType(invitation)) {
                            _this.invitations(_this.invitations().concat(invitation));
                        }
                    });
                }
                else if (update.operation === "2" /* OperationType.DELETE */) {
                    _this.invitations(_this.invitations().filter(function (invitation) { return !(0, EntityUtils_1.isSameId)((0, EntityUtils_1.getLetId)(invitation), updateId_1); }));
                }
            }
        });
    };
    ReceivedGroupInvitationsModel.prototype.hasCorrectGroupType = function (invitation) {
        return (0, GroupUtils_1.getInvitationGroupType)(invitation) === this.groupType;
    };
    return ReceivedGroupInvitationsModel;
}());
exports.ReceivedGroupInvitationsModel = ReceivedGroupInvitationsModel;
