"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.showUserError = exports.disableErrorHandlingDuringLogout = exports.reloginForExpiredSession = exports.handleUncaughtErrorImpl = void 0;
var RestError_1 = require("../api/common/error/RestError");
var Dialog_1 = require("../gui/base/Dialog");
var LanguageViewModel_1 = require("./LanguageViewModel");
var Env_1 = require("../api/common/Env");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var LoginController_1 = require("../api/main/LoginController");
var OutOfSyncError_1 = require("../api/common/error/OutOfSyncError");
var ProgressDialog_1 = require("../gui/dialogs/ProgressDialog");
var IndexingNotSupportedError_1 = require("../api/common/error/IndexingNotSupportedError");
var WindowFacade_1 = require("./WindowFacade");
var MainLocator_1 = require("../api/main/MainLocator");
var QuotaExceededError_1 = require("../api/common/error/QuotaExceededError");
var SubscriptionDialogs_1 = require("./SubscriptionDialogs");
var SnackBar_1 = require("../gui/base/SnackBar");
var ErrorReporter_1 = require("./ErrorReporter");
var CancelledError_1 = require("../api/common/error/CancelledError");
var LoginUtils_1 = require("./LoginUtils");
var ErrorCheckUtils_js_1 = require("../api/common/utils/ErrorCheckUtils.js");
var OfflineDbClosedError_js_1 = require("../api/common/error/OfflineDbClosedError.js");
(0, Env_1.assertMainOrNode)();
var unknownErrorDialogActive = false;
var notConnectedDialogActive = false;
var invalidSoftwareVersionActive = false;
var loginDialogActive = false;
var isLoggingOut = false;
var serviceUnavailableDialogActive = false;
var shownQuotaError = false;
var showingImportError = false;
var ignoredMessages = ["webkitExitFullScreen", "googletag", "avast_submit"];
function handleUncaughtErrorImpl(e) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var isOffline, userId, errorMessage;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (isLoggingOut) {
                        // ignore all errors while logging out
                        return [2 /*return*/];
                    }
                    // This is from the s.js and it shouldn't change. Unfortunately it is a plain Error.
                    if (e.message.includes("(SystemJS https://github.com/systemjs/systemjs/blob/master/docs/errors.md#")) {
                        handleImportError();
                        return [2 /*return*/];
                    }
                    if (!(0, ErrorCheckUtils_js_1.isOfflineError)(e)) return [3 /*break*/, 1];
                    showOfflineMessage();
                    return [3 /*break*/, 12];
                case 1:
                    if (!(e instanceof RestError_1.InvalidSoftwareVersionError)) return [3 /*break*/, 2];
                    if (!invalidSoftwareVersionActive) {
                        invalidSoftwareVersionActive = true;
                        Dialog_1.Dialog.message("outdatedClient_msg").then(function () { return (invalidSoftwareVersionActive = false); });
                    }
                    return [3 /*break*/, 12];
                case 2:
                    if (!(e instanceof RestError_1.NotAuthenticatedError ||
                        e instanceof RestError_1.AccessBlockedError ||
                        e instanceof RestError_1.AccessDeactivatedError ||
                        e instanceof RestError_1.AccessExpiredError)) return [3 /*break*/, 3];
                    // If the session is closed (e.g. password is changed) we log user out forcefully so we reload the page
                    if (LoginController_1.logins.isUserLoggedIn()) {
                        logoutIfNoPasswordPrompt();
                    }
                    return [3 /*break*/, 12];
                case 3:
                    if (!(e instanceof RestError_1.SessionExpiredError)) return [3 /*break*/, 4];
                    reloginForExpiredSession();
                    return [3 /*break*/, 12];
                case 4:
                    if (!(e instanceof OutOfSyncError_1.OutOfSyncError)) return [3 /*break*/, 11];
                    isOffline = (0, Env_1.isOfflineStorageAvailable)() && LoginController_1.logins.isUserLoggedIn() && LoginController_1.logins.getUserController().sessionType === 2 /* SessionType.Persistent */;
                    return [4 /*yield*/, Dialog_1.Dialog.message("outOfSync_label", LanguageViewModel_1.lang.get(isOffline
                            ? "dataExpiredOfflineDb_msg"
                            : "dataExpired_msg"))];
                case 5:
                    _c.sent();
                    userId = LoginController_1.logins.getUserController().userId;
                    if (!(0, Env_1.isDesktop)()) return [3 /*break*/, 8];
                    return [4 /*yield*/, ((_a = MainLocator_1.locator.interWindowEventSender) === null || _a === void 0 ? void 0 : _a.localUserDataInvalidated(userId))];
                case 6:
                    _c.sent();
                    return [4 /*yield*/, ((_b = MainLocator_1.locator.sqlCipherFacade) === null || _b === void 0 ? void 0 : _b.deleteDb(userId))];
                case 7:
                    _c.sent();
                    _c.label = 8;
                case 8: return [4 /*yield*/, LoginController_1.logins.logout(false)];
                case 9:
                    _c.sent();
                    return [4 /*yield*/, WindowFacade_1.windowFacade.reload({ noAutoLogin: true })];
                case 10:
                    _c.sent();
                    return [3 /*break*/, 12];
                case 11:
                    if (e instanceof RestError_1.InsufficientStorageError) {
                        if (LoginController_1.logins.getUserController().isGlobalAdmin()) {
                            (0, SubscriptionDialogs_1.showMoreStorageNeededOrderDialog)(LoginController_1.logins, "insufficientStorageAdmin_msg");
                        }
                        else {
                            errorMessage = function () { return LanguageViewModel_1.lang.get("insufficientStorageUser_msg") + " " + LanguageViewModel_1.lang.get("contactAdmin_msg"); };
                            Dialog_1.Dialog.message(errorMessage);
                        }
                    }
                    else if (e instanceof RestError_1.ServiceUnavailableError) {
                        if (!serviceUnavailableDialogActive) {
                            serviceUnavailableDialogActive = true;
                            Dialog_1.Dialog.message("serviceUnavailable_msg").then(function () {
                                serviceUnavailableDialogActive = false;
                            });
                        }
                    }
                    else if (e instanceof IndexingNotSupportedError_1.IndexingNotSupportedError) {
                        console.log("Indexing not supported", e);
                        MainLocator_1.locator.search.indexingSupported = false;
                    }
                    else if (e instanceof QuotaExceededError_1.QuotaExceededError) {
                        if (!shownQuotaError) {
                            shownQuotaError = true;
                            Dialog_1.Dialog.message("storageQuotaExceeded_msg");
                        }
                    }
                    else if (e instanceof OfflineDbClosedError_js_1.OfflineDbClosedError) {
                        if (!loginDialogActive) {
                            throw e;
                        }
                    }
                    else if (ignoredError(e)) {
                        // ignore, this is not our code
                    }
                    else {
                        if (!unknownErrorDialogActive) {
                            unknownErrorDialogActive = true;
                            // only logged in users can report errors
                            if (LoginController_1.logins.isUserLoggedIn()) {
                                (0, ErrorReporter_1.promptForFeedbackAndSend)(e)
                                    .then(function (_a) {
                                    var ignored = _a.ignored;
                                    unknownErrorDialogActive = false;
                                    if (ignored) {
                                        ignoredMessages.push(e.message);
                                    }
                                });
                            }
                            else {
                                console.log("Unknown error", e);
                                (0, ErrorReporter_1.showErrorDialogNotLoggedIn)(e)
                                    .then(function () { return unknownErrorDialogActive = false; });
                            }
                        }
                    }
                    _c.label = 12;
                case 12: return [2 /*return*/];
            }
        });
    });
}
exports.handleUncaughtErrorImpl = handleUncaughtErrorImpl;
function showOfflineMessage() {
    if (!notConnectedDialogActive) {
        notConnectedDialogActive = true;
        (0, SnackBar_1.showSnackBar)({
            message: "serverNotReachable_msg",
            button: {
                label: "ok_action",
                click: function () {
                }
            },
            onClose: function () {
                notConnectedDialogActive = false;
            }
        });
    }
}
function logoutIfNoPasswordPrompt() {
    if (!loginDialogActive) {
        WindowFacade_1.windowFacade.reload({});
    }
}
function reloginForExpiredSession() {
    return __awaiter(this, void 0, void 0, function () {
        var sessionType_1, userId_1, dialog_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!loginDialogActive) return [3 /*break*/, 2];
                    // Make sure that partial login part is complete before we will try to make a new session.
                    // Otherwise we run into a race condition where login failure arrives before we initialize userController.
                    return [4 /*yield*/, LoginController_1.logins.waitForPartialLogin()];
                case 1:
                    // Make sure that partial login part is complete before we will try to make a new session.
                    // Otherwise we run into a race condition where login failure arrives before we initialize userController.
                    _a.sent();
                    console.log("RELOGIN", LoginController_1.logins.isUserLoggedIn());
                    sessionType_1 = LoginController_1.logins.getUserController().sessionType;
                    userId_1 = LoginController_1.logins.getUserController().user._id;
                    MainLocator_1.locator.loginFacade.resetSession();
                    loginDialogActive = true;
                    dialog_1 = Dialog_1.Dialog.showRequestPasswordDialog({
                        action: function (pw) { return __awaiter(_this, void 0, void 0, function () {
                            var credentials, e_1, oldCredentials;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _b.trys.push([0, 2, 3, 4]);
                                        return [4 /*yield*/, LoginController_1.logins.createSession((0, tutanota_utils_1.neverNull)(LoginController_1.logins.getUserController().userGroupInfo.mailAddress), pw, sessionType_1)];
                                    case 1:
                                        credentials = _b.sent();
                                        return [3 /*break*/, 4];
                                    case 2:
                                        e_1 = _b.sent();
                                        if (e_1 instanceof CancelledError_1.CancelledError ||
                                            e_1 instanceof RestError_1.AccessBlockedError ||
                                            e_1 instanceof RestError_1.NotAuthenticatedError ||
                                            e_1 instanceof RestError_1.AccessDeactivatedError ||
                                            e_1 instanceof RestError_1.ConnectionError) {
                                            return [2 /*return*/, LanguageViewModel_1.lang.getMaybeLazy((0, LoginUtils_1.getLoginErrorMessage)(e_1, false))];
                                        }
                                        else {
                                            throw e_1;
                                        }
                                        return [3 /*break*/, 4];
                                    case 3:
                                        // Once login succeeds we need to manually close the dialog
                                        MainLocator_1.locator.secondFactorHandler.closeWaitingForSecondFactorDialog();
                                        return [7 /*endfinally*/];
                                    case 4: return [4 /*yield*/, MainLocator_1.locator.credentialsProvider.getCredentialsByUserId(userId_1)];
                                    case 5:
                                        oldCredentials = _b.sent();
                                        return [4 /*yield*/, ((_a = MainLocator_1.locator.sqlCipherFacade) === null || _a === void 0 ? void 0 : _a.closeDb())];
                                    case 6:
                                        _b.sent();
                                        return [4 /*yield*/, MainLocator_1.locator.credentialsProvider.deleteByUserId(userId_1, { deleteOfflineDb: false })];
                                    case 7:
                                        _b.sent();
                                        if (!(sessionType_1 === 2 /* SessionType.Persistent */)) return [3 /*break*/, 9];
                                        return [4 /*yield*/, MainLocator_1.locator.credentialsProvider.store({ credentials: credentials, databaseKey: oldCredentials === null || oldCredentials === void 0 ? void 0 : oldCredentials.databaseKey })];
                                    case 8:
                                        _b.sent();
                                        _b.label = 9;
                                    case 9:
                                        loginDialogActive = false;
                                        dialog_1.close();
                                        return [2 /*return*/, ""];
                                }
                            });
                        }); },
                        cancel: {
                            textId: "logout_label",
                            action: function () {
                                WindowFacade_1.windowFacade.reload({});
                            }
                        }
                    });
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
exports.reloginForExpiredSession = reloginForExpiredSession;
function ignoredError(e) {
    return e.message != null && ignoredMessages.some(function (s) { return e.message.includes(s); });
}
/**
 * Trying to handle errors during logout can cause unhandled error loops, so we just want to ignore them
 */
function disableErrorHandlingDuringLogout() {
    isLoggingOut = true;
    (0, ProgressDialog_1.showProgressDialog)("loggingOut_msg", new Promise(tutanota_utils_1.noOp));
}
exports.disableErrorHandlingDuringLogout = disableErrorHandlingDuringLogout;
function handleImportError() {
    if (showingImportError) {
        return;
    }
    showingImportError = true;
    var message = "There was an error while loading part of the app. It might be that you are offline, running an outdated version, or your browser is blocking the request.";
    Dialog_1.Dialog.choice(function () { return message; }, [
        {
            text: "close_alt",
            value: false
        },
        {
            text: "reloadPage_action",
            value: true
        },
    ]).then(function (reload) {
        showingImportError = false;
        if (reload) {
            WindowFacade_1.windowFacade.reload({});
        }
    });
}
if (typeof window !== "undefined") {
    // @ts-ignore
    window.tutao.testError = function () { return handleUncaughtErrorImpl(new Error("test error!")); };
}
function showUserError(error) {
    return Dialog_1.Dialog.message(function () { return error.message; });
}
exports.showUserError = showUserError;
