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
exports.showBusinessFeatureRequiredDialog = exports.showMoreStorageNeededOrderDialog = exports.checkPremiumSubscription = exports.createNotAvailableForFreeClickHandler = exports.showNotAvailableForFreeDialog = void 0;
var LoginController_1 = require("../api/main/LoginController");
var TypeRefs_js_1 = require("../api/entities/sys/TypeRefs.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Dialog_1 = require("../gui/base/Dialog");
var LanguageViewModel_1 = require("./LanguageViewModel");
var Env_1 = require("../api/common/Env");
var ProgrammingError_1 = require("../api/common/error/ProgrammingError");
var MainLocator_1 = require("../api/main/MainLocator");
/**
 * Opens a dialog which states that the function is not available in the Free subscription and provides an option to upgrade.
 * @param isInPremiumIncluded Whether the feature is included in the premium membership or not.
 */
function showNotAvailableForFreeDialog(isInPremiumIncluded, customMessage) {
    return __awaiter(this, void 0, void 0, function () {
        var wizard, baseMessage, message, confirmed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../subscription/UpgradeSubscriptionWizard"); })];
                case 1:
                    wizard = _a.sent();
                    if (!(0, Env_1.isIOSApp)()) return [3 /*break*/, 3];
                    return [4 /*yield*/, Dialog_1.Dialog.message("notAvailableInApp_msg")];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    baseMessage = customMessage != null
                        ? customMessage
                        : !isInPremiumIncluded
                            ? "onlyAvailableForPremiumNotIncluded_msg"
                            : "onlyAvailableForPremium_msg";
                    message = "".concat(LanguageViewModel_1.lang.get(baseMessage), "\n\n").concat(LanguageViewModel_1.lang.get("premiumOffer_msg"));
                    return [4 /*yield*/, Dialog_1.Dialog.reminder(LanguageViewModel_1.lang.get("upgradeReminderTitle_msg"), message, "https://tutanota.com/blog/posts/premium-pro-business" /* InfoLink.PremiumProBusiness */)];
                case 4:
                    confirmed = _a.sent();
                    if (confirmed) {
                        wizard.showUpgradeWizard();
                    }
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.showNotAvailableForFreeDialog = showNotAvailableForFreeDialog;
function createNotAvailableForFreeClickHandler(includedInPremium, click, available) {
    return function (e, dom) {
        if (!available()) {
            showNotAvailableForFreeDialog(includedInPremium);
        }
        else {
            click(e, dom);
        }
    };
}
exports.createNotAvailableForFreeClickHandler = createNotAvailableForFreeClickHandler;
/**
 * Returns whether premium is active and shows one of the showNotAvailableForFreeDialog or subscription cancelled dialogs if needed.
 */
function checkPremiumSubscription(included) {
    if (LoginController_1.logins.getUserController().isFreeAccount()) {
        showNotAvailableForFreeDialog(included);
        return Promise.resolve(false);
    }
    return MainLocator_1.locator.entityClient.load(TypeRefs_js_1.CustomerTypeRef, (0, tutanota_utils_1.neverNull)(LoginController_1.logins.getUserController().user.customer)).then(function (customer) {
        if (customer.canceledPremiumAccount) {
            return Dialog_1.Dialog.message("subscriptionCancelledMessage_msg").then(function () { return false; });
        }
        else {
            return Promise.resolve(true);
        }
    });
}
exports.checkPremiumSubscription = checkPremiumSubscription;
function showMoreStorageNeededOrderDialog(loginController, messageIdOrMessageFunction) {
    var userController = LoginController_1.logins.getUserController();
    if (!userController.isGlobalAdmin()) {
        throw new ProgrammingError_1.ProgrammingError("changing storage or other subscription options is only allowed for global admins");
    }
    if (userController.isFreeAccount()) {
        var confirmMsg = function () { return LanguageViewModel_1.lang.get(messageIdOrMessageFunction) + "\n\n" + LanguageViewModel_1.lang.get("onlyAvailableForPremiumNotIncluded_msg"); };
        return Dialog_1.Dialog.confirm(confirmMsg, "upgrade_action").then(function (confirm) {
            if (confirm) {
                Promise.resolve().then(function () { return require("../subscription/UpgradeSubscriptionWizard"); }).then(function (wizard) { return wizard.showUpgradeWizard(); });
            }
        });
    }
    else {
        return Promise.resolve().then(function () { return require("../subscription/StorageCapacityOptionsDialog"); }).then(function (_a) {
            var showStorageCapacityOptionsDialog = _a.showStorageCapacityOptionsDialog;
            return showStorageCapacityOptionsDialog(messageIdOrMessageFunction);
        });
    }
}
exports.showMoreStorageNeededOrderDialog = showMoreStorageNeededOrderDialog;
/**
 * @returns true if the business feature has been ordered
 */
function showBusinessFeatureRequiredDialog(reason) {
    if (LoginController_1.logins.getUserController().isFreeAccount()) {
        showNotAvailableForFreeDialog(false);
        return Promise.resolve(false);
    }
    else {
        if (LoginController_1.logins.getUserController().isGlobalAdmin()) {
            return Dialog_1.Dialog.confirm(function () { return LanguageViewModel_1.lang.getMaybeLazy(reason) + " " + LanguageViewModel_1.lang.get("ordertItNow_msg"); }).then(function (confirmed) {
                if (confirmed) {
                    return Promise.resolve().then(function () { return require("../subscription/BuyDialog"); }).then(function (BuyDialog) {
                        return BuyDialog.showBusinessBuyDialog(true).then(function (failed) {
                            return !failed;
                        });
                    });
                }
                else {
                    return false;
                }
            });
        }
        else {
            return Dialog_1.Dialog.message(function () { return LanguageViewModel_1.lang.getMaybeLazy(reason) + " " + LanguageViewModel_1.lang.get("contactAdmin_msg"); }).then(function () { return false; });
        }
    }
}
exports.showBusinessFeatureRequiredDialog = showBusinessFeatureRequiredDialog;
