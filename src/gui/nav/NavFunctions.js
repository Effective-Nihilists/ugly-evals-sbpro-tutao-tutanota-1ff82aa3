"use strict";
exports.__esModule = true;
exports.isNewMailActionAvailable = exports.writeInviteMail = exports.showSupportDialog = exports.showUpgradeDialog = void 0;
var LoginController_1 = require("../../api/main/LoginController");
var TutanotaConstants_1 = require("../../api/common/TutanotaConstants");
function showUpgradeDialog() {
    Promise.resolve().then(function () { return require("../../subscription/UpgradeSubscriptionWizard.js"); }).then(function (upgradeWizard) { return upgradeWizard.showUpgradeWizard(); });
}
exports.showUpgradeDialog = showUpgradeDialog;
function showSupportDialog() {
    Promise.resolve().then(function () { return require("../../support/SupportDialog.js"); }).then(function (supportModule) { return supportModule.showSupportDialog(); });
}
exports.showSupportDialog = showSupportDialog;
function writeInviteMail() {
    Promise.resolve().then(function () { return require("../../mail/editor/MailEditor.js"); }).then(function (mailEditorModule) { return mailEditorModule.writeInviteMail(); });
}
exports.writeInviteMail = writeInviteMail;
function isNewMailActionAvailable() {
    return LoginController_1.logins.isInternalUserLoggedIn() && !LoginController_1.logins.isEnabled(TutanotaConstants_1.FeatureType.ReplyOnly);
}
exports.isNewMailActionAvailable = isNewMailActionAvailable;
