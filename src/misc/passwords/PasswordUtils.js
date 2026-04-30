"use strict";
exports.__esModule = true;
exports._getNbrOfSequenceChars = exports.isSecurePassword = exports.scaleToVisualPasswordStrength = exports.getPasswordStrengthForUser = exports.getPasswordStrength = exports._BAD_SEQUENCES = exports.PASSWORD_MIN_SECURE_VALUE = exports.PASSWORD_MIN_VALUE = exports.PASSWORD_MAX_VALUE = void 0;
var MailUtils_1 = require("../../mail/model/MailUtils");
var LoginController_1 = require("../../api/main/LoginController");
var Env_1 = require("../../api/common/Env");
(0, Env_1.assertMainOrNode)();
exports.PASSWORD_MAX_VALUE = 100;
exports.PASSWORD_MIN_VALUE = 0;
exports.PASSWORD_MIN_SECURE_VALUE = 80;
exports._BAD_SEQUENCES = [
    "^1234567890ß´",
    '°!"§$%&/()=?`',
    "qwertzuiopü+",
    "QWERTZUIOPÜ*",
    "asdfghjklöä#",
    "ASDFGHJKLÖÄ'",
    "<yxcvbnm,.-",
    ">YXCVBNM:_",
    "`1234567890-=",
    "~!@#$%^&*()_+",
    "qwertyuiop[]",
    "QWERTYUIOP{}",
    "asdfghjkl'\\",
    'ASDFGHJKL:"|',
    "\\zxcvbnm,./",
    "|ZXCVBNM<>?",
    "abcdefghijklmnopqrstuvwxyz",
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
];
var _BAD_STRINGS = ["passwort", "Passwort", "password", "Password", "tutanota", "Tutanota", "free", "Free", "starter", "Starter", "Test", "test"];
/**
 * Checks how secure the given password is. The following password characteristics decrease the password strength:
 * - irregular distribution of characters across the character classes lower case, upper case, digit, other
 * - consecutive characters of the same class
 * - same chars
 * - same consecutive chars
 * - keyboard (german/english) or alphabet sequences
 * - bad strings (statically defined and passed to function in badStrings)
 * @param password The password to check.
 * @param badStrings Strings that reduce the strength of the password.
 * @return A number from 0 to 100.
 */
function getPasswordStrength(password, badStrings) {
    if (password.length === 0)
        return 0;
    // calculate the characteristics of the password
    var nbrOfLowerChars = _getNbrOfOccurrences(password, /[a-z ]/g);
    var nbrOfConsecutiveLowerChars = Math.max(0, _getLongestResult(password, /[a-z ]*/g) - 2); // consecutive chars > 2
    var nbrOfUpperChars = _getNbrOfOccurrences(password, /[A-Z]/g);
    var nbrOfConsecutiveUpperChars = Math.max(0, _getLongestResult(password, /[A-Z]*/g) - 2);
    var nbrOfDigits = _getNbrOfOccurrences(password, /[0-9]/g);
    var nbrOfConsecutiveDigits = Math.max(0, _getLongestResult(password, /[0-9]*/g) - 2);
    var nbrOfOtherChars = password.length - nbrOfDigits - nbrOfLowerChars - nbrOfUpperChars;
    var nbrOfConsecutiveOtherChars = Math.max(0, _getLongestResult(password, /[^a-z A-Z0-9]*/g) - 2);
    var nbrOfConsecutiveSame = Math.max(0, _getLongestResult(password, /(.)\1+/g) - 2);
    var minNbrOfCharsPerType = password.length / 4; // best is 1/4 lower case, 1/4 upper case, 1/4 digits, 1/4 other chars
    // all these values decrease the strength
    var nbrOfMissingLowerChars = Math.max(0, minNbrOfCharsPerType - nbrOfLowerChars);
    var nbrOfMissingUpperChars = Math.max(0, minNbrOfCharsPerType - nbrOfUpperChars);
    var nbrOfMissingDigits = Math.max(0, minNbrOfCharsPerType - nbrOfDigits);
    var nbrOfMissingOtherChars = Math.max(0, minNbrOfCharsPerType - nbrOfOtherChars);
    var nbrOfSameChars = _getNbrOfSameChars(password);
    var nbrOfSequenceDigits = _getNbrOfSequenceChars(password, exports._BAD_SEQUENCES, true);
    var nbrOfBadStringDigits = _getNbrOfSequenceChars(password, badStrings.concat(_BAD_STRINGS), false);
    var strength = password.length * 11; // 11 = strength per character without reduction
    strength -= nbrOfMissingLowerChars * 3;
    strength -= nbrOfMissingUpperChars * 3;
    strength -= nbrOfMissingDigits * 3;
    strength -= nbrOfMissingOtherChars * 3;
    strength -= nbrOfConsecutiveLowerChars * 2;
    strength -= nbrOfConsecutiveUpperChars * 2;
    strength -= nbrOfConsecutiveDigits * 2;
    strength -= nbrOfConsecutiveOtherChars * 2;
    strength -= nbrOfConsecutiveSame * 2;
    strength -= nbrOfSameChars * 5;
    strength -= nbrOfSequenceDigits * 4;
    strength -= nbrOfBadStringDigits * 4;
    return Math.min(exports.PASSWORD_MAX_VALUE, Math.max(exports.PASSWORD_MIN_VALUE, Math.round(strength)));
}
exports.getPasswordStrength = getPasswordStrength;
function getPasswordStrengthForUser(password, recipientInfo, mailboxDetails, logins) {
    var _a;
    if (logins === void 0) { logins = LoginController_1.logins; }
    var reserved = (0, MailUtils_1.getEnabledMailAddressesWithUser)(mailboxDetails, logins.getUserController().userGroupInfo).concat((0, MailUtils_1.getMailboxName)(logins, mailboxDetails), recipientInfo.address, (_a = recipientInfo.name) !== null && _a !== void 0 ? _a : "");
    return Math.min(exports.PASSWORD_MAX_VALUE, getPasswordStrength(password, reserved));
}
exports.getPasswordStrengthForUser = getPasswordStrengthForUser;
function scaleToVisualPasswordStrength(passwordStrength) {
    var scale = exports.PASSWORD_MIN_SECURE_VALUE / 100;
    return Math.min(exports.PASSWORD_MAX_VALUE, passwordStrength / scale);
}
exports.scaleToVisualPasswordStrength = scaleToVisualPasswordStrength;
function isSecurePassword(passwordStrength) {
    return passwordStrength >= exports.PASSWORD_MIN_SECURE_VALUE;
}
exports.isSecurePassword = isSecurePassword;
/**
 * Provides the number of repetitions of any characters in the given password at any position.
 * @param password The password to check.
 * @returns The number of same characters.
 */
function _getNbrOfSameChars(password) {
    var characterObject = new Set();
    for (var _i = 0, password_1 = password; _i < password_1.length; _i++) {
        var c = password_1[_i];
        characterObject.add(c);
    }
    return password.length - characterObject.size;
}
/**
 * Provides the number of chars in the given password that contains parts (> 2 characters) of the given sequences.
 * @param password The password to check.
 * @param sequences The sequences to check.
 * @param reverseToo If true, also all reverse sequences are checked.
 * @returns The number of chars that match any sequences.
 */
function _getNbrOfSequenceChars(password, sequences, reverseToo) {
    // all sequences to the list of checked sequences s. also add all reverse sequences if requested
    var s = sequences;
    if (reverseToo) {
        s = sequences.concat(sequences.map(function (s1) { return s1.split("").reverse().join(""); }));
    }
    var MIN_SEQUENCE_LEN = 3;
    var nbrOfSequenceDigits = 0;
    // check the part of the password (substringToCheck) from i to i+sequenceLen in a loop
    for (var i = 0; i < password.length - MIN_SEQUENCE_LEN; i++) {
        var maxFoundLen = 0;
        for (var sequenceLen = MIN_SEQUENCE_LEN; i + sequenceLen <= password.length; sequenceLen++) {
            var substringToCheck = password.substring(i, i + sequenceLen);
            for (var a = 0; a < s.length; a++) {
                if (s[a].indexOf(substringToCheck) !== -1) {
                    maxFoundLen = sequenceLen;
                    break;
                }
            }
        }
        if (maxFoundLen > 0) {
            nbrOfSequenceDigits += maxFoundLen;
            i += maxFoundLen - 1; // skip the found sequence. -1 because the for loop also decreases by 1
        }
    }
    return nbrOfSequenceDigits;
}
exports._getNbrOfSequenceChars = _getNbrOfSequenceChars;
/**
 * Gets the number of occurrences of the given regular expression in the given string.
 * @param string The string to check.
 * @param regexp The reqular expression to check against.
 * @return The number of occurrences.
 */
function _getNbrOfOccurrences(string, regexp) {
    var result = string.match(regexp);
    return result ? result.length : 0;
}
/**
 * Gets the number of characters in the longest result when checking the given string against the given regular expression.
 * @param string The string to check.
 * @param regexp The reqular expression to check against.
 * @returns The number of characters of the longest result.
 */
function _getLongestResult(string, regexp) {
    var result = string.match(regexp);
    return result ? result.reduce(function (max, val) { return Math.max(max, val.length); }, 0) : 0;
}
