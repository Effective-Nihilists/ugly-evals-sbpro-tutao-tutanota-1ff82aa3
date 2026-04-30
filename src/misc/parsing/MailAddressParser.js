"use strict";
exports.__esModule = true;
exports.mailAddressToFirstAndLastName = exports.fullNameToFirstAndLastName = exports.getDomainPart = exports.getCleanedMailAddress = exports.stringToNameAndMailAddress = exports.parseMailtoUrl = void 0;
var FormatValidator_1 = require("../FormatValidator");
/**
 * takes a URL of the form mailto:a@b.c?body=hello%20world&attach=file:///home/user/cute%20cat.jpg&attach=file:///home/user/ugly%20dog.jpg
 * and returns an object representing the structured information that should be passed to the mail editor for this URL
 *
 * if a param is not given, it is set to null. if it is given, but empty, it will be set to an empty string/array.
 *
 * @param mailtoUrl {string}
 * @returns {ParsedMailto}
 */
function parseMailtoUrl(mailtoUrl) {
    var _a;
    var url = new URL(mailtoUrl);
    var createMailAddressFromString = function (address) {
        var nameAndMailAddress = stringToNameAndMailAddress(address);
        if (!nameAndMailAddress)
            return null;
        return {
            name: nameAndMailAddress.name,
            address: nameAndMailAddress.mailAddress
        };
    };
    var addresses = url.pathname
        .split(",")
        .map(function (address) {
        if (!address)
            return null;
        var decodedAddress = decodeURIComponent(address);
        if (!decodedAddress)
            return null;
        return createMailAddressFromString(decodedAddress);
    })
        .filter(Boolean);
    var result = {
        recipients: {
            to: addresses.length > 0 ? addresses : undefined,
            cc: undefined,
            bcc: undefined
        },
        attach: null,
        subject: null,
        body: null
    };
    // @ts-ignore Missing definition
    if (!url.searchParams || typeof url.searchParams.entries !== "function")
        return result;
    // @ts-ignore
    for (var _i = 0, _b = url.searchParams.entries(); _i < _b.length; _i++) {
        var pair = _b[_i];
        var paramName = pair[0].toLowerCase();
        var paramValue = pair[1];
        switch (paramName) {
            case "subject":
                result.subject = paramValue;
                break;
            case "body":
                result.body = paramValue.replace(/\r\n/g, "<br>").replace(/\n/g, "<br>");
                break;
            case "to":
            case "cc":
            case "bcc":
                if (result.recipients[paramName] == null)
                    result.recipients[paramName] = [];
                var nextAddresses = paramValue
                    .split(",")
                    .map(function (address) { return createMailAddressFromString(address); })
                    .filter(Boolean);
                (_a = result.recipients[paramName]).push.apply(_a, nextAddresses);
                break;
            case "attach":
                if (result.attach == null)
                    result.attach = [];
                result.attach.push(paramValue);
                break;
            default:
                console.warn("unexpected mailto param, ignoring");
        }
    }
    return result;
}
exports.parseMailtoUrl = parseMailtoUrl;
/**
 * Parses the given string for a name and mail address. The following formats are recognized: [name][<]mailAddress[>]
 * Additionally, whitespaces at any positions outside name and mailAddress are ignored.
 * @param string The string to check.
 * @return an object with the attributes "name" and "mailAddress" or null if nothing was found.
 */
function stringToNameAndMailAddress(string) {
    string = string.trim();
    if (string === "") {
        return null;
    }
    var startIndex = string.indexOf("<");
    if (startIndex !== -1) {
        var endIndex = string.indexOf(">", startIndex);
        if (endIndex === -1) {
            return null;
        }
        var cleanedMailAddress = getCleanedMailAddress(string.substring(startIndex + 1, endIndex));
        if (cleanedMailAddress == null || !(0, FormatValidator_1.isMailAddress)(cleanedMailAddress, false)) {
            return null;
        }
        var name_1 = string.substring(0, startIndex).trim();
        return {
            name: name_1,
            mailAddress: cleanedMailAddress
        };
    }
    else {
        startIndex = string.lastIndexOf(" ");
        startIndex++;
        var cleanedMailAddress = getCleanedMailAddress(string.substring(startIndex));
        if (cleanedMailAddress == null || !(0, FormatValidator_1.isMailAddress)(cleanedMailAddress, false)) {
            return null;
        }
        var name_2 = string.substring(0, startIndex).trim();
        return {
            name: name_2,
            mailAddress: cleanedMailAddress
        };
    }
}
exports.stringToNameAndMailAddress = stringToNameAndMailAddress;
/**
 * Returns a cleaned mail address from the input mail address. Removes leading or trailing whitespaces and converters
 * the address to lower case.
 * @param mailAddress The input mail address.
 * @return The cleaned mail address.
 */
function getCleanedMailAddress(mailAddress) {
    var cleanedMailAddress = mailAddress.toLowerCase().trim();
    if ((0, FormatValidator_1.isMailAddress)(cleanedMailAddress, false)) {
        return cleanedMailAddress;
    }
    return null;
}
exports.getCleanedMailAddress = getCleanedMailAddress;
function getDomainPart(mailAddress) {
    var cleanedMailAddress = getCleanedMailAddress(mailAddress);
    if (cleanedMailAddress) {
        var parts = mailAddress.split("@");
        if (parts.length === 2) {
            return parts[1];
        }
        else {
            return null;
        }
    }
    else {
        return null;
    }
}
exports.getDomainPart = getDomainPart;
/**
 * Parses the given string for a fist name and a last name separated by whitespace. If there is only one part it is regarded as first name. If there are more than two parts, only the first one is regarded as first name.
 * @param fullName The full name to check.
 * @return Returns an object with the attributes "firstName" and "lastName".
 */
function fullNameToFirstAndLastName(fullName) {
    fullName = fullName.trim();
    if (fullName === "") {
        return {
            firstName: "",
            lastName: ""
        };
    }
    var separator = fullName.indexOf(" ");
    if (separator !== -1) {
        return {
            firstName: fullName.substring(0, separator),
            lastName: fullName.substring(separator + 1)
        };
    }
    else {
        return {
            firstName: fullName,
            lastName: ""
        };
    }
}
exports.fullNameToFirstAndLastName = fullNameToFirstAndLastName;
/**
 * Parses the given email address for a fist name and a last name separated by whitespace, comma, dot or underscore.
 * @param mailAddress The email address to check.
 * @return Returns an object with the attributes "firstName" and "lastName".
 */
function mailAddressToFirstAndLastName(mailAddress) {
    var addr = mailAddress.substring(0, mailAddress.indexOf("@"));
    var nameData;
    if (addr.indexOf(".") !== -1) {
        nameData = addr.split(".");
    }
    else if (addr.indexOf("_") !== -1) {
        nameData = addr.split("_");
    }
    else if (addr.indexOf("-") !== -1) {
        nameData = addr.split("-");
    }
    else {
        nameData = [addr];
    }
    // first character upper case
    for (var i = 0; i < nameData.length; i++) {
        if (nameData[i].length > 0) {
            nameData[i] = nameData[i].substring(0, 1).toUpperCase() + nameData[i].substring(1);
        }
    }
    return {
        firstName: nameData[0],
        lastName: nameData.slice(1).join(" ")
    };
}
exports.mailAddressToFirstAndLastName = mailAddressToFirstAndLastName;
