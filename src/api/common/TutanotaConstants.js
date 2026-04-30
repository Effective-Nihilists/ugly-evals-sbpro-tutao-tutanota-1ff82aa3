"use strict";
//@bundleInto:common-min
var _a;
exports.__esModule = true;
exports.CalendarMethod = exports.getAttendeeStatus = exports.CalendarAttendeeStatus = exports.MailAuthenticationStatus = exports.ReportedMailFieldType = exports.Keys = exports.CounterType_UnreadMails = exports.SECOND_MS = exports.getWeekStart = exports.defaultCalendarColor = exports.RepeatPeriod = exports.getCertificateType = exports.ENTITY_EVENT_BATCH_TTL_DAYS = exports.NOTHING_INDEXED_TIMESTAMP = exports.FULL_INDEXED_TIMESTAMP = exports.FeatureType = exports.ALLOWED_IMAGE_FORMATS = exports.MAX_BASE64_IMAGE_SIZE = exports.MAX_LOGO_SIZE = exports.MAX_ATTACHMENT_SIZE = exports.SecondFactorTypeNames = exports.SecondFactorType = exports.CustomDomainCheckResult = exports.CustomDomainValidationResult = exports.getSpamRuleField = exports.getSpamRuleType = exports.SpamRuleType = exports.getCustomerApprovalStatus = exports.ApprovalStatus = exports.TUTANOTA_MAIL_ADDRESS_DOMAINS = exports.Const = exports.PaymentMethodTypeToName = exports.PaymentMethodType = exports.getPaymentMethodType = exports.BookingItemFeatureByCode = exports.BookingItemFeatureType = exports.AccountTypeNames = exports.AccountType = exports.getContactSocialType = exports.MailFolderType = exports.getMembershipGroupType = exports.GroupTypeNameByCode = exports.GroupType = exports.OUT_OF_OFFICE_SUBJECT_PREFIX = exports.reverse = exports.getMailFolderType = exports.REQUEST_SIZE_LIMIT_MAP = exports.REQUEST_SIZE_LIMIT_DEFAULT = exports.MAX_BLOB_SIZE_BYTES = exports.MAX_NBR_MOVE_DELETE_MAIL_SERVICE = void 0;
exports.TerminationPeriodOptions = exports.UsageTestParticipationModeToName = exports.UsageTestParticipationMode = exports.OFFLINE_STORAGE_DEFAULT_TIME_RANGE_DAYS = exports.UsageTestMetricTypeToName = exports.UsageTestMetricType = exports.UsageTestStateToName = exports.UsageTestState = exports.getClientType = exports.assertEnumKey = exports.assertEnumValue = exports.getAsEnumValue = exports.mailMethodToCalendarMethod = void 0;
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Env_1 = require("./Env");
var ProgrammingError_1 = require("./error/ProgrammingError");
exports.MAX_NBR_MOVE_DELETE_MAIL_SERVICE = 50;
// visible for testing
exports.MAX_BLOB_SIZE_BYTES = 1024 * 1024 * 10;
exports.REQUEST_SIZE_LIMIT_DEFAULT = 1024 * 1024;
exports.REQUEST_SIZE_LIMIT_MAP = new Map([
    ["/rest/storage/blobservice", exports.MAX_BLOB_SIZE_BYTES + 100],
    ["/rest/tutanota/filedataservice", 1024 * 1024 * 25],
    ["/rest/tutanota/draftservice", 1024 * 1024], // should be large enough
]);
var getMailFolderType = function (folder) { return (0, tutanota_utils_1.downcast)(folder.folderType); };
exports.getMailFolderType = getMailFolderType;
var reverse = function (objectMap) { return Object.keys(objectMap)
    .reduce(function (r, k) {
    var _a;
    // @ts-ignore
    var v = objectMap[(0, tutanota_utils_1.downcast)(k)];
    return Object.assign(r, (_a = {}, _a[v] = k, _a));
}, {}); };
exports.reverse = reverse;
exports.OUT_OF_OFFICE_SUBJECT_PREFIX = "Auto-reply: ";
var GroupType;
(function (GroupType) {
    GroupType["User"] = "0";
    GroupType["Admin"] = "1";
    GroupType["MailingList"] = "2";
    GroupType["Customer"] = "3";
    GroupType["External"] = "4";
    GroupType["Mail"] = "5";
    GroupType["Contact"] = "6";
    GroupType["File"] = "7";
    GroupType["LocalAdmin"] = "8";
    GroupType["Calendar"] = "9";
    GroupType["Template"] = "10";
})(GroupType = exports.GroupType || (exports.GroupType = {}));
exports.GroupTypeNameByCode = (0, exports.reverse)(GroupType);
var getMembershipGroupType = function (membership) { return (0, tutanota_utils_1.downcast)(membership.groupType); };
exports.getMembershipGroupType = getMembershipGroupType;
var MailFolderType;
(function (MailFolderType) {
    MailFolderType["CUSTOM"] = "0";
    MailFolderType["INBOX"] = "1";
    MailFolderType["SENT"] = "2";
    MailFolderType["TRASH"] = "3";
    MailFolderType["ARCHIVE"] = "4";
    MailFolderType["SPAM"] = "5";
    MailFolderType["DRAFT"] = "6";
})(MailFolderType = exports.MailFolderType || (exports.MailFolderType = {}));
var getContactSocialType = function (contactSocialId) { return (0, tutanota_utils_1.downcast)(contactSocialId.type); };
exports.getContactSocialType = getContactSocialType;
var AccountType;
(function (AccountType) {
    AccountType["SYSTEM"] = "0";
    AccountType["FREE"] = "1";
    AccountType["STARTER"] = "2";
    AccountType["PREMIUM"] = "3";
    AccountType["EXTERNAL"] = "5";
})(AccountType = exports.AccountType || (exports.AccountType = {}));
exports.AccountTypeNames = (_a = {},
    _a[AccountType.SYSTEM] = "System",
    _a[AccountType.FREE] = "Free",
    _a[AccountType.STARTER] = "Outlook",
    _a[AccountType.PREMIUM] = "Premium",
    _a[AccountType.EXTERNAL] = "External",
    _a);
var BookingItemFeatureType;
(function (BookingItemFeatureType) {
    BookingItemFeatureType["Users"] = "0";
    BookingItemFeatureType["Storage"] = "1";
    BookingItemFeatureType["Alias"] = "2";
    BookingItemFeatureType["SharedMailGroup"] = "3";
    BookingItemFeatureType["Whitelabel"] = "4";
    BookingItemFeatureType["ContactForm"] = "5";
    BookingItemFeatureType["WhitelabelChild"] = "6";
    BookingItemFeatureType["LocalAdminGroup"] = "7";
    BookingItemFeatureType["Discount"] = "8";
    BookingItemFeatureType["Sharing"] = "9";
    BookingItemFeatureType["Business"] = "10";
})(BookingItemFeatureType = exports.BookingItemFeatureType || (exports.BookingItemFeatureType = {}));
exports.BookingItemFeatureByCode = (0, exports.reverse)(BookingItemFeatureType);
var getPaymentMethodType = function (accountingInfo) { return (0, tutanota_utils_1.downcast)(accountingInfo.paymentMethod); };
exports.getPaymentMethodType = getPaymentMethodType;
var PaymentMethodType;
(function (PaymentMethodType) {
    PaymentMethodType["Invoice"] = "0";
    PaymentMethodType["CreditCard"] = "1";
    PaymentMethodType["Sepa"] = "2";
    PaymentMethodType["Paypal"] = "3";
    PaymentMethodType["AccountBalance"] = "4";
})(PaymentMethodType = exports.PaymentMethodType || (exports.PaymentMethodType = {}));
exports.PaymentMethodTypeToName = (0, exports.reverse)(PaymentMethodType);
exports.Const = {
    UPGRADE_REMINDER_INTERVAL: 14 * 24 * 60 * 60 * 1000,
    MEMORY_GB_FACTOR: 1000000000,
    MEMORY_WARNING_FACTOR: 0.9,
    COUNTER_USED_MEMORY_INTERNAL: "UsedMemoryInternalNew",
    COUNTER_USED_MEMORY_EXTERNAL: "UsedMemoryExternalNew",
    COUNTER_USED_MEMORY: "UsedMemoryNew",
    // Sets the current date for testing date dependent services. Only available in test environments.
    CURRENT_DATE: null,
    CURRENCY_SYMBOL_EUR: "€"
};
exports.TUTANOTA_MAIL_ADDRESS_DOMAINS = ["tutanota.com", "tutanota.de", "tutamail.com", "tuta.io", "keemail.me"];
// Keep non-const for admin
var ApprovalStatus;
(function (ApprovalStatus) {
    ApprovalStatus["REGISTRATION_APPROVED"] = "0";
    ApprovalStatus["REGISTRATION_APPROVAL_NEEDED"] = "1";
    ApprovalStatus["SEND_MAILS_APPROVED"] = "2";
    ApprovalStatus["INVOICE_NOT_PAID"] = "3";
    ApprovalStatus["SPAM_SENDER"] = "4";
    ApprovalStatus["DELAYED"] = "5";
    ApprovalStatus["DELAYED_AND_INITIALLY_ACCESSED"] = "6";
    ApprovalStatus["REGISTRATION_APPROVAL_NEEDED_AND_INITIALLY_ACCESSED"] = "7";
    ApprovalStatus["PAID_SUBSCRIPTION_NEEDED"] = "8";
    ApprovalStatus["INITIAL_PAYMENT_PENDING"] = "9";
    ApprovalStatus["NO_ACTIVITY"] = "10";
})(ApprovalStatus = exports.ApprovalStatus || (exports.ApprovalStatus = {}));
function getCustomerApprovalStatus(customer) {
    return (0, tutanota_utils_1.downcast)(customer.approvalStatus);
}
exports.getCustomerApprovalStatus = getCustomerApprovalStatus;
var SpamRuleType;
(function (SpamRuleType) {
    SpamRuleType["WHITELIST"] = "1";
    SpamRuleType["BLACKLIST"] = "2";
    SpamRuleType["DISCARD"] = "3";
})(SpamRuleType = exports.SpamRuleType || (exports.SpamRuleType = {}));
function getSpamRuleType(spamRule) {
    return getAsEnumValue(SpamRuleType, spamRule.type);
}
exports.getSpamRuleType = getSpamRuleType;
function getSpamRuleField(spamRule) {
    return (0, tutanota_utils_1.downcast)(spamRule.field);
}
exports.getSpamRuleField = getSpamRuleField;
var CustomDomainValidationResult;
(function (CustomDomainValidationResult) {
    CustomDomainValidationResult["CUSTOM_DOMAIN_VALIDATION_RESULT_OK"] = "0";
    CustomDomainValidationResult["CUSTOM_DOMAIN_VALIDATION_RESULT_DNS_LOOKUP_FAILED"] = "1";
    CustomDomainValidationResult["CUSTOM_DOMAIN_VALIDATION_RESULT_DOMAIN_NOT_FOUND"] = "2";
    CustomDomainValidationResult["CUSTOM_DOMAIN_VALIDATION_RESULT_NAMESERVER_NOT_FOUND"] = "3";
    CustomDomainValidationResult["CUSTOM_DOMAIN_VALIDATION_RESULT_DOMAIN_NOT_AVAILABLE"] = "4";
    CustomDomainValidationResult["CUSTOM_DOMAIN_VALIDATION_RESULT_VALIDATION_FAILED"] = "5";
})(CustomDomainValidationResult = exports.CustomDomainValidationResult || (exports.CustomDomainValidationResult = {}));
var CustomDomainCheckResult;
(function (CustomDomainCheckResult) {
    CustomDomainCheckResult["CUSTOM_DOMAIN_CHECK_RESULT_OK"] = "0";
    CustomDomainCheckResult["CUSTOM_DOMAIN_CHECK_RESULT_DNS_LOOKUP_FAILED"] = "1";
    CustomDomainCheckResult["CUSTOM_DOMAIN_CHECK_RESULT_DOMAIN_NOT_FOUND"] = "2";
    CustomDomainCheckResult["CUSTOM_DOMAIN_CHECK_RESULT_NAMESERVER_NOT_FOUND"] = "3";
})(CustomDomainCheckResult = exports.CustomDomainCheckResult || (exports.CustomDomainCheckResult = {}));
var SecondFactorType;
(function (SecondFactorType) {
    SecondFactorType["u2f"] = "0";
    SecondFactorType["totp"] = "1";
    SecondFactorType["webauthn"] = "2";
})(SecondFactorType = exports.SecondFactorType || (exports.SecondFactorType = {}));
exports.SecondFactorTypeNames = ["U2F", "TOTP"];
exports.MAX_ATTACHMENT_SIZE = 1024 * 1024 * 25;
exports.MAX_LOGO_SIZE = 1024 * 100;
exports.MAX_BASE64_IMAGE_SIZE = exports.MAX_LOGO_SIZE;
exports.ALLOWED_IMAGE_FORMATS = ["png", "jpg", "jpeg", "svg"];
// Keep non-const for admin
var FeatureType;
(function (FeatureType) {
    FeatureType["DisableContacts"] = "0";
    FeatureType["DisableMailExport"] = "1";
    FeatureType["InternalCommunication"] = "2";
    FeatureType["DeleteMailsOnPasswordReset"] = "3";
    FeatureType["WhitelabelParent"] = "4";
    FeatureType["WhitelabelChild"] = "5";
    FeatureType["ReplyOnly"] = "6";
    FeatureType["DisableDefaultSignature"] = "7";
    FeatureType["HideBuyDialogs"] = "8";
    FeatureType["DisableCalendar"] = "9";
    FeatureType["ExternalEmailProvider"] = "10";
    /** This is required for non admin users because they are not allowed to access the bookings. */
    FeatureType["BusinessFeatureEnabled"] = "11";
    FeatureType["PremiumLegacy"] = "12";
    FeatureType["KnowledgeBase"] = "13";
    FeatureType["Newsletter"] = "14";
    FeatureType["Blobs"] = "15";
})(FeatureType = exports.FeatureType || (exports.FeatureType = {}));
exports.FULL_INDEXED_TIMESTAMP = 0;
exports.NOTHING_INDEXED_TIMESTAMP = Math.pow(2, 42) - 1; // maximum Timestamp is 42 bit long (see GeneratedIdData.java)
exports.ENTITY_EVENT_BATCH_TTL_DAYS = 45; // 45 days (see InstanceDbMapperEventNotifier.java)
function getCertificateType(certificateInfo) {
    return (0, tutanota_utils_1.downcast)(certificateInfo.type);
}
exports.getCertificateType = getCertificateType;
var RepeatPeriod;
(function (RepeatPeriod) {
    RepeatPeriod["DAILY"] = "0";
    RepeatPeriod["WEEKLY"] = "1";
    RepeatPeriod["MONTHLY"] = "2";
    RepeatPeriod["ANNUALLY"] = "3";
})(RepeatPeriod = exports.RepeatPeriod || (exports.RepeatPeriod = {}));
exports.defaultCalendarColor = "2196f3";
function getWeekStart(userSettings) {
    return (0, tutanota_utils_1.downcast)(userSettings.startOfTheWeek);
}
exports.getWeekStart = getWeekStart;
exports.SECOND_MS = 1000;
exports.CounterType_UnreadMails = "2";
exports.Keys = Object.freeze({
    NONE: {
        code: -1,
        name: ""
    },
    RETURN: {
        code: 13,
        name: "⏎"
    },
    BACKSPACE: {
        code: 8,
        name: "BACKSPACE"
    },
    TAB: {
        code: 9,
        name: "↹"
    },
    SHIFT: {
        code: 16,
        name: "⇧"
    },
    CTRL: {
        code: 17,
        name: "CTRL"
    },
    ALT: {
        code: 17,
        name: "ALT"
    },
    META: {
        code: 91,
        name: "\u2318"
    },
    // command key (left) (OSX)
    ESC: {
        code: 27,
        name: "ESC"
    },
    SPACE: {
        code: 32,
        name: "Space"
    },
    PAGE_UP: {
        code: 33,
        name: "Page ↑"
    },
    PAGE_DOWN: {
        code: 34,
        name: "Page ↓"
    },
    END: {
        code: 35,
        name: "End"
    },
    HOME: {
        code: 36,
        name: "Home"
    },
    LEFT: {
        code: 37,
        name: "←"
    },
    UP: {
        code: 38,
        name: "↑"
    },
    RIGHT: {
        code: 39,
        name: "→"
    },
    DOWN: {
        code: 40,
        name: "↓"
    },
    DELETE: {
        code: 46,
        name: "DEL"
    },
    "0": {
        code: 48,
        name: "0"
    },
    ONE: {
        code: 49,
        name: "1"
    },
    TWO: {
        code: 50,
        name: "2"
    },
    THREE: {
        code: 51,
        name: "3"
    },
    FOUR: {
        code: 52,
        name: "4"
    },
    FIVE: {
        code: 53,
        name: "5"
    },
    SIX: {
        code: 54,
        name: "6"
    },
    A: {
        code: 65,
        name: "A"
    },
    B: {
        code: 66,
        name: "B"
    },
    C: {
        code: 67,
        name: "C"
    },
    E: {
        code: 69,
        name: "E"
    },
    F: {
        code: 70,
        name: "F"
    },
    H: {
        code: 72,
        name: "H"
    },
    I: {
        code: 73,
        name: "I"
    },
    J: {
        code: 74,
        name: "J"
    },
    K: {
        code: 75,
        name: "K"
    },
    L: {
        code: 76,
        name: "L"
    },
    M: {
        code: 77,
        name: "M"
    },
    N: {
        code: 78,
        name: "N"
    },
    O: {
        code: 79,
        name: "O"
    },
    P: {
        code: 80,
        name: "P"
    },
    R: {
        code: 82,
        name: "R"
    },
    S: {
        code: 83,
        name: "S"
    },
    T: {
        code: 84,
        name: "T"
    },
    U: {
        code: 85,
        name: "U"
    },
    V: {
        code: 86,
        name: "V"
    },
    F1: {
        code: 112,
        name: "F1"
    },
    F5: {
        code: 116,
        name: "F5"
    },
    F11: {
        code: 122,
        name: "F11"
    },
    F12: {
        code: 123,
        name: "F12"
    }
});
// Keep non-const for admin
var ReportedMailFieldType;
(function (ReportedMailFieldType) {
    /**
     * From header address, authenticated.
     */
    ReportedMailFieldType["FROM_ADDRESS"] = "0";
    /**
     * From header address, not authenticated with DMARC.
     */
    ReportedMailFieldType["FROM_ADDRESS_NON_AUTH"] = "1";
    /**
     * From header address domain
     */
    ReportedMailFieldType["FROM_DOMAIN"] = "2";
    /**
     * From header address domain, not authenticated not authenticated with DMARC.
     */
    ReportedMailFieldType["FROM_DOMAIN_NON_AUTH"] = "3";
    /**
     * Email subject
     */
    ReportedMailFieldType["SUBJECT"] = "4";
    /**
     * Link in the body of email
     */
    ReportedMailFieldType["LINK"] = "5";
    /**
     * Domain of the link in the body
     */
    ReportedMailFieldType["LINK_DOMAIN"] = "6";
})(ReportedMailFieldType = exports.ReportedMailFieldType || (exports.ReportedMailFieldType = {}));
// Keep non-const for admin
var MailAuthenticationStatus;
(function (MailAuthenticationStatus) {
    /**
     * Disposition: None. All checks have passed.
     */
    MailAuthenticationStatus["AUTHENTICATED"] = "0";
    /**
     * Authentication has failed because of the domain policy or because of the SPF.
     */
    MailAuthenticationStatus["HARD_FAIL"] = "1";
    /**
     * Authentication has failed because of our own policy, most commonly authentication is "missing".
     */
    MailAuthenticationStatus["SOFT_FAIL"] = "2";
    /**
     * Authentication has failed because From header is not valid so we couldn't do authentication checks.
     */
    MailAuthenticationStatus["INVALID_MAIL_FROM"] = "3";
    /**
     * Authentication has failed because From header is missing. Most likely it is some technical message like bounce mail.
     */
    MailAuthenticationStatus["MISSING_MAIL_FROM"] = "4";
})(MailAuthenticationStatus = exports.MailAuthenticationStatus || (exports.MailAuthenticationStatus = {}));
var CalendarAttendeeStatus;
(function (CalendarAttendeeStatus) {
    /** invite is not sent yet */
    CalendarAttendeeStatus["ADDED"] = "0";
    /** already invited but did not respond */
    CalendarAttendeeStatus["NEEDS_ACTION"] = "1";
    CalendarAttendeeStatus["ACCEPTED"] = "2";
    CalendarAttendeeStatus["DECLINED"] = "3";
    CalendarAttendeeStatus["TENTATIVE"] = "4";
})(CalendarAttendeeStatus = exports.CalendarAttendeeStatus || (exports.CalendarAttendeeStatus = {}));
function getAttendeeStatus(attendee) {
    return (0, tutanota_utils_1.downcast)(attendee.status);
}
exports.getAttendeeStatus = getAttendeeStatus;
var CalendarMethod;
(function (CalendarMethod) {
    CalendarMethod["PUBLISH"] = "PUBLISH";
    CalendarMethod["REQUEST"] = "REQUEST";
    CalendarMethod["REPLY"] = "REPLY";
    CalendarMethod["ADD"] = "ADD";
    CalendarMethod["CANCEL"] = "CANCEL";
    CalendarMethod["REFRESH"] = "REFRESH";
    CalendarMethod["COUNTER"] = "COUNTER";
    CalendarMethod["DECLINECOUNTER"] = "DECLINECOUNTER";
})(CalendarMethod = exports.CalendarMethod || (exports.CalendarMethod = {}));
function mailMethodToCalendarMethod(mailMethod) {
    switch (mailMethod) {
        case "1" /* MailMethod.ICAL_PUBLISH */:
            return CalendarMethod.PUBLISH;
        case "2" /* MailMethod.ICAL_REQUEST */:
            return CalendarMethod.REQUEST;
        case "3" /* MailMethod.ICAL_REPLY */:
            return CalendarMethod.REPLY;
        case "4" /* MailMethod.ICAL_ADD */:
            return CalendarMethod.ADD;
        case "5" /* MailMethod.ICAL_CANCEL */:
            return CalendarMethod.CANCEL;
        case "6" /* MailMethod.ICAL_REFRESH */:
            return CalendarMethod.REFRESH;
        case "7" /* MailMethod.ICAL_COUNTER */:
            return CalendarMethod.COUNTER;
        case "8" /* MailMethod.ICAL_DECLINECOUNTER */:
            return CalendarMethod.DECLINECOUNTER;
        default:
            throw new ProgrammingError_1.ProgrammingError("Unhandled MailMethod: " + mailMethod);
    }
}
exports.mailMethodToCalendarMethod = mailMethodToCalendarMethod;
function getAsEnumValue(enumValues, value) {
    for (var _i = 0, _a = Object.getOwnPropertyNames(enumValues); _i < _a.length; _i++) {
        var key = _a[_i];
        // @ts-ignore
        var enumValue = enumValues[key];
        if (enumValue === value) {
            return enumValue;
        }
    }
    return null;
}
exports.getAsEnumValue = getAsEnumValue;
function assertEnumValue(enumValues, value) {
    for (var _i = 0, _a = Object.getOwnPropertyNames(enumValues); _i < _a.length; _i++) {
        var key = _a[_i];
        // @ts-ignore
        var enumValue = enumValues[key];
        if (enumValue === value) {
            return enumValue;
        }
    }
    throw new Error("Invalid enum value ".concat(value, " for ").concat(JSON.stringify(enumValues)));
}
exports.assertEnumValue = assertEnumValue;
function assertEnumKey(obj, key) {
    if (key in obj) {
        return (0, tutanota_utils_1.downcast)(key);
    }
    else {
        throw Error("Not valid enum value: " + key);
    }
}
exports.assertEnumKey = assertEnumKey;
function getClientType() {
    return (0, Env_1.isApp)() ? "2" /* ClientType.App */ : (0, Env_1.isElectronClient)() ? "1" /* ClientType.Desktop */ : "0" /* ClientType.Browser */;
}
exports.getClientType = getClientType;
var UsageTestState;
(function (UsageTestState) {
    UsageTestState["Created"] = "0";
    UsageTestState["Live"] = "1";
    UsageTestState["Paused"] = "2";
    UsageTestState["Finished"] = "3";
})(UsageTestState = exports.UsageTestState || (exports.UsageTestState = {}));
exports.UsageTestStateToName = (0, exports.reverse)(UsageTestState);
var UsageTestMetricType;
(function (UsageTestMetricType) {
    UsageTestMetricType["Number"] = "0";
    UsageTestMetricType["Enum"] = "1";
    UsageTestMetricType["Likert"] = "2";
})(UsageTestMetricType = exports.UsageTestMetricType || (exports.UsageTestMetricType = {}));
exports.UsageTestMetricTypeToName = (0, exports.reverse)(UsageTestMetricType);
exports.OFFLINE_STORAGE_DEFAULT_TIME_RANGE_DAYS = 31;
var UsageTestParticipationMode;
(function (UsageTestParticipationMode) {
    UsageTestParticipationMode["Once"] = "0";
    UsageTestParticipationMode["Unlimited"] = "1";
})(UsageTestParticipationMode = exports.UsageTestParticipationMode || (exports.UsageTestParticipationMode = {}));
exports.UsageTestParticipationModeToName = (0, exports.reverse)(UsageTestParticipationMode);
var TerminationPeriodOptions;
(function (TerminationPeriodOptions) {
    TerminationPeriodOptions["EndOfCurrentPeriod"] = "0";
    TerminationPeriodOptions["FutureDate"] = "1";
})(TerminationPeriodOptions = exports.TerminationPeriodOptions || (exports.TerminationPeriodOptions = {}));
