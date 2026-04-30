"use strict";
exports.__esModule = true;
exports.isValidCreditCardNumber = exports.isRegularExpression = exports.isDomainOrTopLevelDomain = exports.isDomainName = exports.isMailAddress = void 0;
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var DOMAIN_PART_REGEX = "[\\w\\-\\+_]+";
var DOMAIN_REGEXP = new RegExp("^".concat(DOMAIN_PART_REGEX, "\\.").concat(DOMAIN_PART_REGEX, "(\\.").concat(DOMAIN_PART_REGEX, ")*\\s*$"));
var DOMAIN_OR_TLD_REGEXP = new RegExp("^(".concat(DOMAIN_PART_REGEX, ".)*").concat(DOMAIN_PART_REGEX, "$"));
var STRICT_USERNAME_MAIL_ADDR_REGEXP = new RegExp("^\\s*".concat(DOMAIN_PART_REGEX, "(\\.").concat(DOMAIN_PART_REGEX, ")*\\@").concat(DOMAIN_PART_REGEX, "\\.").concat(DOMAIN_PART_REGEX, "(\\.").concat(DOMAIN_PART_REGEX, ")*\\s*$"));
var EMAIL_ADDR_REGEXP = new RegExp("^[^\\s\\@]+\\@".concat(DOMAIN_PART_REGEX, "\\.").concat(DOMAIN_PART_REGEX, "(\\.").concat(DOMAIN_PART_REGEX, ")*\\s*$"));
/**
 * Checks if the given string is a valid email address format.
 * @param string The string to check.
 * @param strictUserName If true checks that the part before the @ is not longer than 64 characters and does not contain special characters.
 * @return If the string is an email address.
 */
function isMailAddress(string, strictUserName) {
    /* KEEP IN SYNC WITH JAVA VERSION IN PhoneNumberUtils.js (except uppercase) */
    // check trailing whitespaces because they are not covered by the following regexp
    // allow uppercase addresses in input check, convert them before sending to server.
    if (string == null || string !== string.trim()) {
        return false;
    }
    if (string.indexOf("-") === 0) {
        return false;
    }
    if (string.indexOf(",") !== -1 ||
        string.indexOf("(") !== -1 ||
        string.indexOf(")") !== -1 ||
        string.indexOf(":") !== -1 ||
        string.indexOf(";") !== -1 ||
        string.indexOf("<") !== -1 ||
        string.indexOf(">") !== -1 ||
        string.indexOf("[") !== -1 ||
        string.indexOf("]") !== -1 ||
        string.indexOf("\\") !== -1) {
        return false;
    }
    // check lengths (see https://tools.ietf.org/html/rfc5321#section-4.5.3)
    if (string.length > 254) {
        // 256 minus "<" and ">" of the path
        return false;
    }
    if (strictUserName) {
        if (string.indexOf("@") > 64) {
            return false;
        }
        // see https://web.archive.org/web/20180813043723/http://ntt.cc/2008/05/10/over-10-useful-javascript-regular-expression-functions-to-improve-your-web-applications-efficiency.html
        return STRICT_USERNAME_MAIL_ADDR_REGEXP.test(string);
    }
    else {
        // see https://web.archive.org/web/20180813043723/http://ntt.cc/2008/05/10/over-10-useful-javascript-regular-expression-functions-to-improve-your-web-applications-efficiency.html
        return EMAIL_ADDR_REGEXP.test(string);
    }
}
exports.isMailAddress = isMailAddress;
/**
 * Checks if the given string is a valid domain name.
 * @param {string} domainName The string to check.
 * @return {boolean} If the string is a domain name.
 */
function isDomainName(domainName) {
    if (domainName == null || domainName !== domainName.trim()) {
        return false;
    }
    if ((0, tutanota_utils_1.startsWith)(domainName, "-")) {
        return false;
    }
    return DOMAIN_REGEXP.test(domainName);
}
exports.isDomainName = isDomainName;
function isDomainOrTopLevelDomain(value) {
    if ((0, tutanota_utils_1.startsWith)(value, "-")) {
        return false;
    }
    // Repeated words ending with dot and word at the end.
    // matches test.com and com but not .com
    return DOMAIN_OR_TLD_REGEXP.test(value);
}
exports.isDomainOrTopLevelDomain = isDomainOrTopLevelDomain;
/**
 * Checks if the value is a regular expression, with or without optional flags.
 * @param value The string to check
 */
function isRegularExpression(value) {
    return /^\/.*\/$/.test(value) || /^\/.*\/(?!.*(.)\1)[gimsuy]+$/.test(value);
}
exports.isRegularExpression = isRegularExpression;
/**
 * Determine whether an input string is a valid credit card number
 * https://en.wikipedia.org/wiki/Luhn_algorithm
 * @param input: a string between 6 and 20 chars long that should contain only digits or spaces
 * @returns {boolean}
 */
function isValidCreditCardNumber(input) {
    var cleaned = input.match(/^[0123456789 ]+$/);
    if (!cleaned || cleaned.length !== 1) {
        return false;
    }
    var digits = cleaned[0].split("").filter(function (c) { return !/\s/.test(c); });
    if (digits.length < 6 || digits.length > 20) {
        return false;
    }
    return (digits
        .reverse()
        .map(function (num) { return Number(num); })
        .reduce(function (acc, cur, idx) {
        var num = idx % 2 === 0 ? cur : cur * 2 - (cur > 4 ? 9 : 0);
        return acc + num;
    }, 0) %
        10 ===
        0);
}
exports.isValidCreditCardNumber = isValidCreditCardNumber;
