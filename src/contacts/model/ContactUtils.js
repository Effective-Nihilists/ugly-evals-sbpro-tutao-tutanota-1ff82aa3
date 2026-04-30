"use strict";
exports.__esModule = true;
exports.getSocialUrl = exports.formatBirthdayOfContact = exports.formatBirthdayNumeric = exports.getContactListName = exports.getContactDisplayName = void 0;
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var Formatter_1 = require("../../misc/Formatter");
var BirthdayUtils_1 = require("../../api/common/utils/BirthdayUtils");
var Env_1 = require("../../api/common/Env");
(0, Env_1.assertMainOrNode)();
function getContactDisplayName(contact) {
    if (contact.nickname) {
        return contact.nickname;
    }
    else {
        return "".concat(contact.firstName, " ").concat(contact.lastName).trim();
    }
}
exports.getContactDisplayName = getContactDisplayName;
function getContactListName(contact) {
    var name = "".concat(contact.firstName, " ").concat(contact.lastName).trim();
    if (name.length === 0) {
        name = contact.company.trim();
    }
    return name;
}
exports.getContactListName = getContactListName;
function formatBirthdayNumeric(birthday) {
    if (birthday.year) {
        return (0, Formatter_1.formatDate)(new Date(Number(birthday.year), Number(birthday.month) - 1, Number(birthday.day)));
    }
    else {
        //if no year is specified a leap year is used to allow 2/29 as birthday
        return LanguageViewModel_1.lang.formats.simpleDateWithoutYear.format(new Date(Number(2016), Number(birthday.month) - 1, Number(birthday.day)));
    }
}
exports.formatBirthdayNumeric = formatBirthdayNumeric;
/**
 * Returns the birthday of the contact as formatted string using default date formatter including date, month and year.
 * If birthday contains no year only month and day will be included.
 * If there is no birthday or an invalid birthday format an empty string returns.
 */
function formatBirthdayOfContact(contact) {
    if (contact.birthdayIso) {
        var isoDate = contact.birthdayIso;
        try {
            return formatBirthdayNumeric((0, BirthdayUtils_1.isoDateToBirthday)(isoDate));
        }
        catch (e) {
            // cant format, cant do anything
        }
    }
    return "";
}
exports.formatBirthdayOfContact = formatBirthdayOfContact;
function getSocialUrl(contactId) {
    var socialUrlType = "";
    var http = "https://";
    var worldwidew = "www.";
    var isSchemePrefixed = contactId.socialId.indexOf("http") !== -1;
    var isWwwDotPrefixed = contactId.socialId.indexOf(worldwidew) !== -1;
    if (!isSchemePrefixed && !isWwwDotPrefixed) {
        switch (contactId.type) {
            case "0" /* ContactSocialType.TWITTER */:
                socialUrlType = "twitter.com/";
                break;
            case "1" /* ContactSocialType.FACEBOOK */:
                socialUrlType = "facebook.com/";
                break;
            case "2" /* ContactSocialType.XING */:
                socialUrlType = "xing.com/profile/";
                break;
            case "3" /* ContactSocialType.LINKED_IN */:
                socialUrlType = "linkedin.com/in/";
        }
    }
    if (isSchemePrefixed) {
        http = "";
    }
    if (isSchemePrefixed || isWwwDotPrefixed) {
        worldwidew = "";
    }
    return "".concat(http).concat(worldwidew).concat(socialUrlType).concat(contactId.socialId.trim());
}
exports.getSocialUrl = getSocialUrl;
