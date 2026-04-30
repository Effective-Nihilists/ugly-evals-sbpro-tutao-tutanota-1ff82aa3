"use strict";
exports.__esModule = true;
exports.getReportMovedMailsType = exports.saveMailboxProperties = exports.saveReportMovedMails = exports.loadMailboxProperties = void 0;
var TypeRefs_js_1 = require("../api/entities/tutanota/TypeRefs.js");
var MainLocator_1 = require("../api/main/MainLocator");
var LoginController_1 = require("../api/main/LoginController");
var TypeRefs_js_2 = require("../api/entities/tutanota/TypeRefs.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
/**
 * Loads the mailbox properties from the server.
 */
function loadMailboxProperties() {
    var mailMembership = LoginController_1.logins.getUserController().getUserMailGroupMembership();
    return MainLocator_1.locator.entityClient.load(TypeRefs_js_2.MailboxGroupRootTypeRef, mailMembership.group).then(function (grouproot) {
        if (grouproot.mailboxProperties) {
            return MainLocator_1.locator.entityClient.load(TypeRefs_js_1.MailboxPropertiesTypeRef, grouproot.mailboxProperties);
        }
        else {
            return null;
        }
    });
}
exports.loadMailboxProperties = loadMailboxProperties;
/**
 * Creates or updates mailboxProperties with the new reportMovedMails value.
 * @param props may be null if no MailboxProperties are set yet.
 * @param reportMovedMails new value.
 */
function saveReportMovedMails(props, reportMovedMails) {
    if (!props) {
        props = (0, TypeRefs_js_1.createMailboxProperties)({
            _ownerGroup: LoginController_1.logins.getUserController().getUserMailGroupMembership().group
        });
    }
    props.reportMovedMails = reportMovedMails;
    saveMailboxProperties(props);
}
exports.saveReportMovedMails = saveReportMovedMails;
/**
 * Creates or updates mailboxProperties.
 * The server takes care of creating the reference from MailboxGroupRoot.
 */
function saveMailboxProperties(props) {
    props._id ? MainLocator_1.locator.entityClient.update(props) : MainLocator_1.locator.entityClient.setup(null, props);
}
exports.saveMailboxProperties = saveMailboxProperties;
/**
 * @returns ALWAYS_ASK if not set yet.
 */
function getReportMovedMailsType(props) {
    if (!props) {
        return "0" /* ReportMovedMailsType.ALWAYS_ASK */;
    }
    return (0, tutanota_utils_1.downcast)(props.reportMovedMails);
}
exports.getReportMovedMailsType = getReportMovedMailsType;
