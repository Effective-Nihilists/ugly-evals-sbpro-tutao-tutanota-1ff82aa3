"use strict";
var _a, _b, _c;
exports.__esModule = true;
exports.compareContacts = exports.getContactSocialTypeLabel = exports.ContactSocialTypeToLabel = exports.getContactPhoneNumberTypeLabel = exports.ContactPhoneNumberTypeToLabel = exports.getContactAddressTypeLabel = exports.ContactMailAddressTypeToLabel = void 0;
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var EntityUtils_1 = require("../../api/common/utils/EntityUtils");
exports.ContactMailAddressTypeToLabel = (_a = {},
    _a["0" /* ContactAddressType.PRIVATE */] = "private_label",
    _a["1" /* ContactAddressType.WORK */] = "work_label",
    _a["2" /* ContactAddressType.OTHER */] = "other_label",
    _a["3" /* ContactAddressType.CUSTOM */] = "custom_label",
    _a);
function getContactAddressTypeLabel(type, custom) {
    if (type === "3" /* ContactAddressType.CUSTOM */) {
        return custom;
    }
    else {
        return LanguageViewModel_1.lang.get(exports.ContactMailAddressTypeToLabel[type]);
    }
}
exports.getContactAddressTypeLabel = getContactAddressTypeLabel;
exports.ContactPhoneNumberTypeToLabel = (_b = {},
    _b["0" /* ContactPhoneNumberType.PRIVATE */] = "private_label",
    _b["1" /* ContactPhoneNumberType.WORK */] = "work_label",
    _b["2" /* ContactPhoneNumberType.MOBILE */] = "mobile_label",
    _b["3" /* ContactPhoneNumberType.FAX */] = "fax_label",
    _b["4" /* ContactPhoneNumberType.OTHER */] = "other_label",
    _b["5" /* ContactPhoneNumberType.CUSTOM */] = "custom_label",
    _b);
function getContactPhoneNumberTypeLabel(type, custom) {
    if (type === "5" /* ContactPhoneNumberType.CUSTOM */) {
        return custom;
    }
    else {
        return LanguageViewModel_1.lang.get(exports.ContactPhoneNumberTypeToLabel[type]);
    }
}
exports.getContactPhoneNumberTypeLabel = getContactPhoneNumberTypeLabel;
exports.ContactSocialTypeToLabel = (_c = {},
    _c["0" /* ContactSocialType.TWITTER */] = "twitter_label",
    _c["1" /* ContactSocialType.FACEBOOK */] = "facebook_label",
    _c["2" /* ContactSocialType.XING */] = "xing_label",
    _c["3" /* ContactSocialType.LINKED_IN */] = "linkedin_label",
    _c["4" /* ContactSocialType.OTHER */] = "other_label",
    _c["5" /* ContactSocialType.CUSTOM */] = "custom_label",
    _c);
function getContactSocialTypeLabel(type, custom) {
    if (type === "5" /* ContactSocialType.CUSTOM */) {
        return custom;
    }
    else {
        return LanguageViewModel_1.lang.get(exports.ContactSocialTypeToLabel[type]);
    }
}
exports.getContactSocialTypeLabel = getContactSocialTypeLabel;
/**
 * Sorts by the following preferences:
 * 1. first name
 * 2. second name
 * 3. first email address
 * 4. id
 * Missing fields are sorted below existing fields
 */
function compareContacts(contact1, contact2, sortByFirstName) {
    if (sortByFirstName === void 0) { sortByFirstName = true; }
    var c1First = contact1.firstName.trim();
    var c2First = contact2.firstName.trim();
    var c1Last = contact1.lastName.trim();
    var c2Last = contact2.lastName.trim();
    var c1MailLength = contact1.mailAddresses.length;
    var c2MailLength = contact2.mailAddresses.length;
    var _a = sortByFirstName ? [c1First, c1Last] : [c1Last, c1First], c1Primary = _a[0], c1Secondary = _a[1];
    var _b = sortByFirstName ? [c2First, c2Last] : [c2Last, c2First], c2Primary = _b[0], c2Secondary = _b[1];
    // If the contact doesn't have either the first or the last name, use company as the first name. We cannot just make a string out of it
    // and compare it because we would lose priority of first name over last name and set name over unset name.
    if (!c1Primary && !c1Secondary) {
        c1Primary = contact1.company;
    }
    if (!c2Primary && !c2Secondary) {
        c2Primary = contact2.company;
    }
    if (c1Primary && !c2Primary) {
        return -1;
    }
    else if (c2Primary && !c1Primary) {
        return 1;
    }
    else {
        var result = c1Primary.localeCompare(c2Primary);
        if (result === 0) {
            if (c1Secondary && !c2Secondary) {
                return -1;
            }
            else if (c2Secondary && !c1Secondary) {
                return 1;
            }
            else {
                result = c1Secondary.localeCompare(c2Secondary);
            }
        }
        if (result === 0) {
            // names are equal or no names in contact
            if (c1MailLength > 0 && c2MailLength === 0) {
                return -1;
            }
            else if (c2MailLength > 0 && c1MailLength === 0) {
                return 1;
            }
            else if (c1MailLength === 0 && c2MailLength === 0) {
                // see Multiselect with shift and up arrow not working properly #152 at github
                return (0, EntityUtils_1.sortCompareByReverseId)(contact1, contact2);
            }
            else {
                result = contact1.mailAddresses[0].address.trim().localeCompare(contact2.mailAddresses[0].address.trim());
                if (result === 0) {
                    // see Multiselect with shift and up arrow not working properly #152 at github
                    return (0, EntityUtils_1.sortCompareByReverseId)(contact1, contact2);
                }
                else {
                    return result;
                }
            }
        }
        else {
            return result;
        }
    }
}
exports.compareContacts = compareContacts;
