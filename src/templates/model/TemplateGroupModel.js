"use strict";
exports.__esModule = true;
exports.TemplateGroupModel = void 0;
var mithril_1 = require("mithril");
var EventController_1 = require("../../api/main/EventController");
var LoginController_1 = require("../../api/main/LoginController");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var tutanota_utils_2 = require("@tutao/tutanota-utils");
var TypeRefs_js_1 = require("../../api/entities/sys/TypeRefs.js");
var EntityUtils_1 = require("../../api/common/utils/EntityUtils");
var TemplatePopupModel_1 = require("./TemplatePopupModel");
var MainLocator_1 = require("../../api/main/MainLocator");
var tutanota_utils_3 = require("@tutao/tutanota-utils");
var TemplateGroupModel = /** @class */ (function () {
    function TemplateGroupModel(eventController, logins, entityClient) {
        var _this = this;
        this._eventController = eventController;
        this._logins = logins;
        this._entityClient = entityClient;
        this._groupInstances = new tutanota_utils_1.LazyLoaded(function () {
            var templateMemberships = logins.getUserController().getTemplateMemberships();
            return (0, TemplatePopupModel_1.loadTemplateGroupInstances)(templateMemberships, MainLocator_1.locator.entityClient);
        }, []);
        this._eventController.addEntityListener(function (updates) {
            return _this._entityEventsReceived(updates);
        });
    }
    TemplateGroupModel.prototype.getGroupInstances = function () {
        return (0, tutanota_utils_2.neverNull)(this._groupInstances.getSync());
    };
    TemplateGroupModel.prototype._entityEventsReceived = function (updates) {
        var _this = this;
        // const userController = logins.getUserController()
        return (0, tutanota_utils_3.promiseMap)(updates, function (update) {
            if ((0, EventController_1.isUpdateForTypeRef)(TypeRefs_js_1.UserTypeRef, update) && (0, EntityUtils_1.isSameId)(update.instanceId, LoginController_1.logins.getUserController().user._id)) {
                if (_this._groupInstances.isLoaded()) {
                    var existingInstances = _this.getGroupInstances().map(function (groupInstances) { return groupInstances.groupRoot._id; });
                    var newMemberships = LoginController_1.logins
                        .getUserController()
                        .getTemplateMemberships()
                        .map(function (membership) { return membership.group; });
                    if (existingInstances.length !== newMemberships.length) {
                        _this._groupInstances.reset();
                        _this._groupInstances.getAsync();
                        mithril_1["default"].redraw();
                    }
                }
            }
        });
    };
    return TemplateGroupModel;
}());
exports.TemplateGroupModel = TemplateGroupModel;
