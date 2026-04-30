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
exports.showRecoverDialog = exports.showGiftCardDialog = exports.getRegistrationDataIdFromParams = exports.showSignupDialog = exports.getLoginErrorStateAndMessage = exports.handleExpectedLoginError = exports.getLoginErrorMessage = exports.checkApprovalStatus = void 0;
var Dialog_1 = require("../gui/base/Dialog");
var EntityUtils_1 = require("../api/common/utils/EntityUtils");
var LanguageViewModel_1 = require("./LanguageViewModel");
var Env_1 = require("../api/common/Env");
var RestError_1 = require("../api/common/error/RestError");
var CancelledError_1 = require("../api/common/error/CancelledError");
var TutanotaConstants_1 = require("../api/common/TutanotaConstants");
var ProgressDialog_1 = require("../gui/dialogs/ProgressDialog");
var UserError_1 = require("../api/main/UserError");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var ErrorHandlerImpl_1 = require("./ErrorHandlerImpl");
var MainLocator_1 = require("../api/main/MainLocator");
var CredentialAuthenticationError_1 = require("../api/common/error/CredentialAuthenticationError");
/**
 * Shows warnings if the invoices are not paid or the registration is not approved yet.
 * @param includeInvoiceNotPaidForAdmin If true, also shows a warning for an admin if the invoice is not paid (use at login), if false does not show this warning (use when sending an email).
 * @param defaultStatus This status is used if the actual status on the customer is "0"
 * @returns True if the user may still send emails, false otherwise.
 */
function checkApprovalStatus(logins, includeInvoiceNotPaidForAdmin, defaultStatus) {
    if (!logins.getUserController().isInternalUser()) {
        // external users are not authorized to load the customer
        return Promise.resolve(true);
    }
    return logins
        .getUserController()
        .loadCustomer()
        .then(function (customer) {
        var approvalStatus = (0, TutanotaConstants_1.getCustomerApprovalStatus)(customer);
        var status = approvalStatus === TutanotaConstants_1.ApprovalStatus.REGISTRATION_APPROVED && defaultStatus != null
            ? defaultStatus
            : approvalStatus;
        if (status === TutanotaConstants_1.ApprovalStatus.REGISTRATION_APPROVAL_NEEDED ||
            status === TutanotaConstants_1.ApprovalStatus.DELAYED ||
            status === TutanotaConstants_1.ApprovalStatus.REGISTRATION_APPROVAL_NEEDED_AND_INITIALLY_ACCESSED) {
            return Dialog_1.Dialog.message("waitingForApproval_msg").then(function () { return false; });
        }
        else if (status === TutanotaConstants_1.ApprovalStatus.DELAYED_AND_INITIALLY_ACCESSED) {
            if (new Date().getTime() - (0, EntityUtils_1.generatedIdToTimestamp)(customer._id) > 2 * 24 * 60 * 60 * 1000) {
                return Dialog_1.Dialog.message("requestApproval_msg").then(function () { return true; });
            }
            else {
                return Dialog_1.Dialog.message("waitingForApproval_msg").then(function () { return false; });
            }
        }
        else if (status === TutanotaConstants_1.ApprovalStatus.INVOICE_NOT_PAID) {
            if (logins.getUserController().isGlobalAdmin()) {
                if (includeInvoiceNotPaidForAdmin) {
                    return Dialog_1.Dialog.message(function () {
                        return LanguageViewModel_1.lang.get("invoiceNotPaid_msg", {
                            "{1}": (0, Env_1.getHttpOrigin)()
                        });
                    })
                        .then(function () {
                        // TODO: navigate to payment site in settings
                        //m.route.set("/settings")
                        //tutao.locator.settingsViewModel.show(tutao.tutanota.ctrl.SettingsViewModel.DISPLAY_ADMIN_PAYMENT);
                    })
                        .then(function () { return true; });
                }
                else {
                    return true;
                }
            }
            else {
                var errorMessage = function () { return LanguageViewModel_1.lang.get("invoiceNotPaidUser_msg") + " " + LanguageViewModel_1.lang.get("contactAdmin_msg"); };
                return Dialog_1.Dialog.message(errorMessage).then(function () { return false; });
            }
        }
        else if (status === TutanotaConstants_1.ApprovalStatus.SPAM_SENDER) {
            Dialog_1.Dialog.message("loginAbuseDetected_msg"); // do not logout to avoid that we try to reload with mail editor open
            return false;
        }
        else if (status === TutanotaConstants_1.ApprovalStatus.PAID_SUBSCRIPTION_NEEDED) {
            var message = LanguageViewModel_1.lang.get(customer.businessUse ? "businessUseUpgradeNeeded_msg" : "upgradeNeeded_msg");
            return Dialog_1.Dialog.reminder(LanguageViewModel_1.lang.get("upgradeReminderTitle_msg"), message, "https://tutanota.com/blog/posts/premium-pro-business" /* InfoLink.PremiumProBusiness */).then(function (confirmed) {
                if (confirmed) {
                    Promise.resolve().then(function () { return require("../subscription/UpgradeSubscriptionWizard"); }).then(function (m) { return m.showUpgradeWizard(); });
                }
                return false;
            });
        }
        else {
            return true;
        }
    });
}
exports.checkApprovalStatus = checkApprovalStatus;
function getLoginErrorMessage(error, isExternalLogin) {
    switch (error.constructor) {
        case RestError_1.BadRequestError:
        case RestError_1.NotAuthenticatedError:
        case RestError_1.AccessDeactivatedError:
            return "loginFailed_msg";
        case RestError_1.AccessBlockedError:
            return "loginFailedOften_msg";
        case RestError_1.AccessExpiredError:
            return isExternalLogin ? "expiredLink_msg" : "inactiveAccount_msg";
        case RestError_1.TooManyRequestsError:
            return "tooManyAttempts_msg";
        case CancelledError_1.CancelledError:
            return "emptyString_msg";
        case CredentialAuthenticationError_1.CredentialAuthenticationError:
            return function () {
                return LanguageViewModel_1.lang.get("couldNotUnlockCredentials_msg", {
                    "{reason}": error.message
                });
            };
        case RestError_1.ConnectionError:
            return "connectionLostLong_msg";
        default:
            return "emptyString_msg";
    }
}
exports.getLoginErrorMessage = getLoginErrorMessage;
/**
 * Handle expected login errors
 * Any unexpected errors will be rethrown
 */
function handleExpectedLoginError(error, handler) {
    if (error instanceof RestError_1.BadRequestError ||
        error instanceof RestError_1.NotAuthenticatedError ||
        error instanceof RestError_1.AccessExpiredError ||
        error instanceof RestError_1.AccessBlockedError ||
        error instanceof RestError_1.AccessDeactivatedError ||
        error instanceof RestError_1.TooManyRequestsError ||
        error instanceof CancelledError_1.CancelledError ||
        error instanceof CredentialAuthenticationError_1.CredentialAuthenticationError ||
        error instanceof RestError_1.ConnectionError) {
        handler(error);
    }
    else {
        throw error;
    }
}
exports.handleExpectedLoginError = handleExpectedLoginError;
function getLoginErrorStateAndMessage(error) {
    var errorMessage = getLoginErrorMessage(error, false);
    var state;
    if (error instanceof RestError_1.BadRequestError || error instanceof RestError_1.NotAuthenticatedError) {
        state = "InvalidCredentials" /* LoginState.InvalidCredentials */;
    }
    else if (error instanceof RestError_1.AccessExpiredError) {
        state = "AccessExpired" /* LoginState.AccessExpired */;
    }
    else {
        state = "UnknownError" /* LoginState.UnknownError */;
    }
    handleExpectedLoginError(error, tutanota_utils_1.noOp);
    return {
        errorMessage: errorMessage,
        state: state
    };
}
exports.getLoginErrorStateAndMessage = getLoginErrorStateAndMessage;
function showSignupDialog(hashParams) {
    return __awaiter(this, void 0, void 0, function () {
        var subscriptionParams, registrationDataId, dialog;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    subscriptionParams = getSubscriptionParameters(hashParams);
                    registrationDataId = getRegistrationDataIdFromParams(hashParams);
                    return [4 /*yield*/, (0, ProgressDialog_1.showProgressDialog)("loading_msg", MainLocator_1.locator.worker.initialized.then(function () { return __awaiter(_this, void 0, void 0, function () {
                            var loadSignupWizard;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../subscription/UpgradeSubscriptionWizard"); })];
                                    case 1:
                                        loadSignupWizard = (_a.sent()).loadSignupWizard;
                                        return [2 /*return*/, loadSignupWizard(subscriptionParams, registrationDataId)];
                                }
                            });
                        }); }))];
                case 1:
                    dialog = _a.sent();
                    dialog.show();
                    return [2 /*return*/];
            }
        });
    });
}
exports.showSignupDialog = showSignupDialog;
function getSubscriptionParameters(hashParams) {
    if (typeof hashParams.subscription === "string" && typeof hashParams.type === "string" && typeof hashParams.interval === "string") {
        var subscription = hashParams.subscription, type = hashParams.type, interval = hashParams.interval;
        return {
            subscription: subscription,
            type: type,
            interval: interval
        };
    }
    else {
        return null;
    }
}
function getRegistrationDataIdFromParams(hashParams) {
    if (typeof hashParams.token === "string") {
        return hashParams.token;
    }
    return null;
}
exports.getRegistrationDataIdFromParams = getRegistrationDataIdFromParams;
function loadRedeemGiftCardWizard(urlHash) {
    return __awaiter(this, void 0, void 0, function () {
        var wizard;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../subscription/giftcards/RedeemGiftCardWizard"); })];
                case 1:
                    wizard = _a.sent();
                    return [2 /*return*/, wizard.loadRedeemGiftCardWizard(urlHash)];
            }
        });
    });
}
function showGiftCardDialog(urlHash) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            (0, ProgressDialog_1.showProgressDialog)("loading_msg", loadRedeemGiftCardWizard(urlHash))
                .then(function (dialog) { return dialog.show(); })["catch"](function (e) {
                if (e instanceof RestError_1.NotAuthorizedError || e instanceof RestError_1.NotFoundError) {
                    throw new UserError_1.UserError("invalidGiftCard_msg");
                }
                else {
                    throw e;
                }
            })["catch"]((0, tutanota_utils_1.ofClass)(UserError_1.UserError, ErrorHandlerImpl_1.showUserError));
            return [2 /*return*/];
        });
    });
}
exports.showGiftCardDialog = showGiftCardDialog;
function showRecoverDialog(mailAddress, resetAction) {
    return __awaiter(this, void 0, void 0, function () {
        var dialog;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../login/recover/RecoverLoginDialog"); })];
                case 1:
                    dialog = _a.sent();
                    dialog.show(mailAddress, resetAction);
                    return [2 /*return*/];
            }
        });
    });
}
exports.showRecoverDialog = showRecoverDialog;
