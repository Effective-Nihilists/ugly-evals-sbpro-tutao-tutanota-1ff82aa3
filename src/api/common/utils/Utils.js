"use strict";
//@bundleInto:common-min
exports.__esModule = true;
exports.objToError = exports.isNotSupportedError = exports.isSecurityError = exports.isCustomizationEnabledForCustomer = exports.getMailHeaders = exports.getMailBodyText = exports.getEventOfType = exports.containsEventOfType = exports.getCustomMailDomains = exports.getWhitelabelDomain = void 0;
var RestError_1 = require("../error/RestError");
var CryptoError_1 = require("../error/CryptoError");
var SessionKeyNotFoundError_1 = require("../error/SessionKeyNotFoundError");
var SseError_1 = require("../error/SseError");
var ProgrammingError_1 = require("../error/ProgrammingError");
var RecipientsNotFoundError_1 = require("../error/RecipientsNotFoundError");
var RecipientNotResolvedError_1 = require("../error/RecipientNotResolvedError");
var OutOfSyncError_1 = require("../error/OutOfSyncError");
var DbError_1 = require("../error/DbError");
var IndexingNotSupportedError_1 = require("../error/IndexingNotSupportedError");
var QuotaExceededError_1 = require("../error/QuotaExceededError");
var CancelledError_1 = require("../error/CancelledError");
var FileOpenError_1 = require("../error/FileOpenError");
var PermissionError_1 = require("../error/PermissionError");
var FileNotFoundError_1 = require("../error/FileNotFoundError");
var DeviceStorageUnavailableError_1 = require("../error/DeviceStorageUnavailableError");
var MailBodyTooLargeError_1 = require("../error/MailBodyTooLargeError");
var CredentialAuthenticationError_1 = require("../error/CredentialAuthenticationError");
var KeyPermanentlyInvalidatedError_1 = require("../error/KeyPermanentlyInvalidatedError");
var ImportError_1 = require("../error/ImportError");
var WebauthnError_1 = require("../error/WebauthnError");
var SuspensionError_js_1 = require("../error/SuspensionError.js");
var LoginIncompleteError_js_1 = require("../error/LoginIncompleteError.js");
var OfflineDbClosedError_js_1 = require("../error/OfflineDbClosedError.js");
function getWhitelabelDomain(customerInfo, domainName) {
    var _a;
    return (_a = customerInfo.domainInfos.find(function (info) { return info.whitelabelConfig != null && (domainName == null || info.domain === domainName); })) !== null && _a !== void 0 ? _a : null;
}
exports.getWhitelabelDomain = getWhitelabelDomain;
function getCustomMailDomains(customerInfo) {
    return customerInfo.domainInfos.filter(function (di) { return di.whitelabelConfig == null; });
}
exports.getCustomMailDomains = getCustomMailDomains;
function containsEventOfType(events, type, elementId) {
    return events.find(function (event) { return event.operation === type && event.instanceId === elementId; }) != null;
}
exports.containsEventOfType = containsEventOfType;
function getEventOfType(events, type, elementId) {
    var _a;
    return (_a = events.find(function (event) { return event.operation === type && event.instanceId === elementId; })) !== null && _a !== void 0 ? _a : null;
}
exports.getEventOfType = getEventOfType;
function getMailBodyText(body) {
    return body.compressedText || body.text || "";
}
exports.getMailBodyText = getMailBodyText;
function getMailHeaders(headers) {
    return headers.compressedHeaders || headers.headers || "";
}
exports.getMailHeaders = getMailHeaders;
//If importing fails it is a good idea to bundle the error into common-min which can be achieved by annotating the module with "@bundleInto:common-min"
var ErrorNameToType = {
    ConnectionError: RestError_1.ConnectionError,
    BadRequestError: RestError_1.BadRequestError,
    NotAuthenticatedError: RestError_1.NotAuthenticatedError,
    SessionExpiredError: RestError_1.SessionExpiredError,
    NotAuthorizedError: RestError_1.NotAuthorizedError,
    NotFoundError: RestError_1.NotFoundError,
    MethodNotAllowedError: RestError_1.MethodNotAllowedError,
    PreconditionFailedError: RestError_1.PreconditionFailedError,
    LockedError: RestError_1.LockedError,
    TooManyRequestsError: RestError_1.TooManyRequestsError,
    AccessDeactivatedError: RestError_1.AccessDeactivatedError,
    AccessExpiredError: RestError_1.AccessExpiredError,
    AccessBlockedError: RestError_1.AccessBlockedError,
    InvalidDataError: RestError_1.InvalidDataError,
    InvalidSoftwareVersionError: RestError_1.InvalidSoftwareVersionError,
    LimitReachedError: RestError_1.LimitReachedError,
    InternalServerError: RestError_1.InternalServerError,
    BadGatewayError: RestError_1.BadGatewayError,
    ResourceError: RestError_1.ResourceError,
    InsufficientStorageError: RestError_1.InsufficientStorageError,
    CryptoError: CryptoError_1.CryptoError,
    SessionKeyNotFoundError: SessionKeyNotFoundError_1.SessionKeyNotFoundError,
    SseError: SseError_1.SseError,
    ProgrammingError: ProgrammingError_1.ProgrammingError,
    RecipientsNotFoundError: RecipientsNotFoundError_1.RecipientsNotFoundError,
    RecipientNotResolvedError: RecipientNotResolvedError_1.RecipientNotResolvedError,
    OfflineDbClosedError: OfflineDbClosedError_js_1.OfflineDbClosedError,
    OutOfSyncError: OutOfSyncError_1.OutOfSyncError,
    ServiceUnavailableError: RestError_1.ServiceUnavailableError,
    DbError: DbError_1.DbError,
    IndexingNotSupportedError: IndexingNotSupportedError_1.IndexingNotSupportedError,
    QuotaExceededError: QuotaExceededError_1.QuotaExceededError,
    CancelledError: CancelledError_1.CancelledError,
    FileOpenError: FileOpenError_1.FileOpenError,
    PayloadTooLargeError: RestError_1.PayloadTooLargeError,
    DeviceStorageUnavailableError: DeviceStorageUnavailableError_1.DeviceStorageUnavailableError,
    MailBodyTooLargeError: MailBodyTooLargeError_1.MailBodyTooLargeError,
    ImportError: ImportError_1.ImportError,
    WebauthnError: WebauthnError_1.WebauthnError,
    SuspensionError: SuspensionError_js_1.SuspensionError,
    LoginIncompleteError: LoginIncompleteError_js_1.LoginIncompleteError,
    Error: Error,
    "java.net.SocketTimeoutException": RestError_1.ConnectionError,
    "java.net.SocketException": RestError_1.ConnectionError,
    "java.net.ConnectException": RestError_1.ConnectionError,
    "javax.net.ssl.SSLException": RestError_1.ConnectionError,
    "javax.net.ssl.SSLHandshakeException": RestError_1.ConnectionError,
    "java.io.EOFException": RestError_1.ConnectionError,
    "java.net.UnknownHostException": RestError_1.ConnectionError,
    "java.lang.SecurityException": PermissionError_1.PermissionError,
    "java.io.FileNotFoundException": FileNotFoundError_1.FileNotFoundError,
    "de.tutao.tutanota.CryptoError": CryptoError_1.CryptoError,
    // Android app exception class name
    "de.tutao.tutanota.TutCrypto": CryptoError_1.CryptoError,
    // iOS app crypto error domain
    "android.content.ActivityNotFoundException": FileOpenError_1.FileOpenError,
    "de.tutao.tutanota.TutFileViewer": FileOpenError_1.FileOpenError,
    NSURLErrorDomain: RestError_1.ConnectionError,
    "de.tutao.tutanota.CredentialAuthenticationException": CredentialAuthenticationError_1.CredentialAuthenticationError,
    "android.security.keystore.KeyPermanentlyInvalidatedException": KeyPermanentlyInvalidatedError_1.KeyPermanentlyInvalidatedError,
    "de.tutao.tutanota.KeyPermanentlyInvalidatedError": KeyPermanentlyInvalidatedError_1.KeyPermanentlyInvalidatedError,
    "de.tutao.tutanota.CredentialAuthenticationError": CredentialAuthenticationError_1.CredentialAuthenticationError,
    "de.tutao.tutanota.offline.OfflineDbClosedError": OfflineDbClosedError_js_1.OfflineDbClosedError
};
function isCustomizationEnabledForCustomer(customer, feature) {
    return !!customer.customizations.find(function (customization) { return customization.feature === feature; });
}
exports.isCustomizationEnabledForCustomer = isCustomizationEnabledForCustomer;
function isSecurityError(e) {
    return e instanceof DOMException && (e.name === "SecurityError" || e.code === e.SECURITY_ERR);
}
exports.isSecurityError = isSecurityError;
function isNotSupportedError(e) {
    return e instanceof DOMException && (e.name === "NotSupportedError" || e.code === e.NOT_SUPPORTED_ERR);
}
exports.isNotSupportedError = isNotSupportedError;
function objToError(o) {
    // @ts-ignore
    var errorType = ErrorNameToType[o.name];
    var e = (errorType != null ? new errorType(o.message) : new Error(o.message));
    e.name = o.name;
    e.stack = o.stack || e.stack;
    e.data = o.data;
    return e;
}
exports.objToError = objToError;
