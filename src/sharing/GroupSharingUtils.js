"use strict";
exports.__esModule = true;
exports.sendRejectNotificationEmail = exports.sendAcceptNotificationEmail = exports.sendShareNotificationEmail = void 0;
var MailUtils_1 = require("../mail/model/MailUtils");
var MainLocator_1 = require("../api/main/MainLocator");
var LoginController_1 = require("../api/main/LoginController");
var ProgressDialog_1 = require("../gui/dialogs/ProgressDialog");
var GroupUtils_1 = require("./GroupUtils");
function sendShareNotificationEmail(sharedGroupInfo, recipients, texts) {
    MainLocator_1.locator.mailModel.getUserMailboxDetails().then(function (mailboxDetails) {
        var senderMailAddress = (0, MailUtils_1.getDefaultSender)(LoginController_1.logins, mailboxDetails);
        var userName = (0, MailUtils_1.getSenderNameForUser)(mailboxDetails, LoginController_1.logins.getUserController());
        // Sending notifications as bcc so that invited people don't see each other
        var bcc = recipients.map(function (_a) {
            var name = _a.name, address = _a.address;
            return ({
                name: name,
                address: address
            });
        });
        _sendNotificationEmail({
            bcc: bcc
        }, texts.shareEmailSubject, texts.shareEmailBody((0, GroupUtils_1.getSharedGroupName)(sharedGroupInfo, true), userName), senderMailAddress);
    });
}
exports.sendShareNotificationEmail = sendShareNotificationEmail;
function sendAcceptNotificationEmail(invitation, texts) {
    var to = [
        {
            name: invitation.inviterName,
            address: invitation.inviterMailAddress
        },
    ];
    var userName = invitation.inviterMailAddress;
    var invitee = invitation.inviteeMailAddress;
    var groupName = invitation.sharedGroupName || (0, GroupUtils_1.getDefaultGroupName)((0, GroupUtils_1.getInvitationGroupType)(invitation));
    var senderMailAddress = invitation.inviteeMailAddress;
    _sendNotificationEmail({
        to: to
    }, texts.acceptEmailSubject, texts.acceptEmailBody(userName, invitee, groupName), senderMailAddress);
}
exports.sendAcceptNotificationEmail = sendAcceptNotificationEmail;
function sendRejectNotificationEmail(invitation, texts) {
    var to = [
        {
            name: invitation.inviterName,
            address: invitation.inviterMailAddress
        },
    ];
    var userName = invitation.inviterMailAddress;
    var invitee = invitation.inviteeMailAddress;
    var groupName = invitation.sharedGroupName || (0, GroupUtils_1.getDefaultGroupName)((0, GroupUtils_1.getInvitationGroupType)(invitation));
    var senderMailAddress = invitation.inviteeMailAddress;
    _sendNotificationEmail({
        to: to
    }, texts.declineEmailSubject, texts.declineEmailBody(userName, invitee, groupName), senderMailAddress);
}
exports.sendRejectNotificationEmail = sendRejectNotificationEmail;
function _sendNotificationEmail(recipients, subject, body, senderMailAddress) {
    Promise.resolve().then(function () { return require("../misc/HtmlSanitizer"); }).then(function (_a) {
        var htmlSanitizer = _a.htmlSanitizer;
        var sanitizedBody = htmlSanitizer.sanitizeHTML(body, {
            blockExternalContent: false,
            allowRelativeLinks: false,
            usePlaceholderForInlineImages: false
        }).html;
        MainLocator_1.locator.mailModel.getUserMailboxDetails().then(function (mailboxDetails) {
            var sender = (0, MailUtils_1.getEnabledMailAddresses)(mailboxDetails).includes(senderMailAddress) ? senderMailAddress : (0, MailUtils_1.getDefaultSender)(LoginController_1.logins, mailboxDetails);
            var confirm = function () { return Promise.resolve(true); };
            var wait = ProgressDialog_1.showProgressDialog;
            Promise.resolve().then(function () { return require("../mail/editor/SendMailModel"); }).then(function (_a) {
                var defaultSendMailModel = _a.defaultSendMailModel;
                return defaultSendMailModel(mailboxDetails)
                    .initWithTemplate(recipients, subject, sanitizedBody, [], true, sender)
                    .then(function (model) { return model.send("0" /* MailMethod.NONE */, confirm, wait, "tooManyMailsAuto_msg"); });
            });
        });
    });
}
