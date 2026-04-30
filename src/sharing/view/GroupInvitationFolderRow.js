"use strict";
exports.__esModule = true;
exports.GroupInvitationFolderRow = void 0;
var mithril_1 = require("mithril");
var size_1 = require("../../gui/size");
var GroupUtils_1 = require("../GroupUtils");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var MailUtils_1 = require("../../mail/model/MailUtils");
var ReceivedGroupInvitationDialog_1 = require("./ReceivedGroupInvitationDialog");
var IconButton_js_1 = require("../../gui/base/IconButton.js");
var GroupInvitationFolderRow = /** @class */ (function () {
    function GroupInvitationFolderRow() {
    }
    GroupInvitationFolderRow.prototype.view = function (vnode) {
        var _a = vnode.attrs, invitation = _a.invitation, icon = _a.icon;
        return [
            (0, mithril_1["default"])(".folder-row.flex-start.plr-l", [
                (0, mithril_1["default"])(".flex-v-center.flex-grow.button-height", {
                    style: {
                        // It's kinda hard to tell this element to not eat up all the row and truncate text instead because it
                        // is vertical flex. With this it will stop at 80% of what it could be and that's enough for the button.
                        "max-width": "calc(100% - ".concat(size_1.size.button_height, "px)")
                    }
                }, [
                    (0, mithril_1["default"])(".b.text-ellipsis", {
                        title: (0, GroupUtils_1.getCapabilityText)((0, tutanota_utils_1.downcast)(invitation.capability))
                    }, invitation.sharedGroupName),
                    (0, mithril_1["default"])(".small.text-ellipsis", {
                        title: invitation.inviterMailAddress
                    }, (0, MailUtils_1.getDisplayText)(invitation.inviterName, invitation.inviterMailAddress, true)),
                ]),
                (0, mithril_1["default"])(IconButton_js_1.IconButton, {
                    title: "show_action",
                    click: function () { return (0, ReceivedGroupInvitationDialog_1.showGroupInvitationDialog)(invitation); },
                    icon: icon !== null && icon !== void 0 ? icon : "Eye" /* Icons.Eye */
                }),
            ]),
        ];
    };
    return GroupInvitationFolderRow;
}());
exports.GroupInvitationFolderRow = GroupInvitationFolderRow;
