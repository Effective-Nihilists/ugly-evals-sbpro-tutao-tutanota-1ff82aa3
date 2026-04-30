"use strict";
exports.__esModule = true;
exports.prependEmailSignature = exports.appendEmailSignature = exports.getEmailSignature = exports.getDefaultSignature = void 0;
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var MailUtils_1 = require("../model/MailUtils");
var HtmlSanitizer_1 = require("../../misc/HtmlSanitizer");
var Env_1 = require("../../api/common/Env");
(0, Env_1.assertMainOrNode)();
function getDefaultSignature() {
    // add one line break to the default signature to add one empty line between signature and body
    return (MailUtils_1.LINE_BREAK +
        HtmlSanitizer_1.htmlSanitizer.sanitizeHTML(LanguageViewModel_1.lang.get("defaultEmailSignature_msg", {
            "{1}": "https://tutanota.com" /* InfoLink.HomePage */
        })).html);
}
exports.getDefaultSignature = getDefaultSignature;
function getEmailSignature(tutanotaProperties) {
    // provide the user signature, even for shared mail groups
    var type = tutanotaProperties.emailSignatureType;
    if (type === "0" /* TutanotaConstants.EMAIL_SIGNATURE_TYPE_DEFAULT */) {
        return getDefaultSignature();
    }
    else if ("1" /* TutanotaConstants.EMAIL_SIGNATURE_TYPE_CUSTOM */ === type) {
        return tutanotaProperties.customEmailSignature;
    }
    else {
        return "";
    }
}
exports.getEmailSignature = getEmailSignature;
function appendEmailSignature(body, properties) {
    var signature = getEmailSignature(properties);
    if (signature) {
        // ensure that signature is on the next line
        return body + MailUtils_1.LINE_BREAK + signature;
    }
    else {
        return body;
    }
}
exports.appendEmailSignature = appendEmailSignature;
function prependEmailSignature(body, logins) {
    // add space between signature and existing body
    var bodyWithSignature = "";
    var signature = getEmailSignature(logins.getUserController().props);
    if (body) {
        bodyWithSignature = MailUtils_1.LINE_BREAK + MailUtils_1.LINE_BREAK + MailUtils_1.LINE_BREAK + body;
    }
    if (logins.getUserController().isInternalUser() && signature) {
        // ensure that signature is on the next line
        bodyWithSignature = MailUtils_1.LINE_BREAK + signature + bodyWithSignature;
    }
    return bodyWithSignature;
}
exports.prependEmailSignature = prependEmailSignature;
