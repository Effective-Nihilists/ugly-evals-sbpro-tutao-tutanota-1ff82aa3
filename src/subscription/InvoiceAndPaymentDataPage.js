"use strict";
exports.__esModule = true;
exports.updatePaymentData = exports.InvoiceAndPaymentDataPageAttrs = exports.InvoiceAndPaymentDataPage = void 0;
var mithril_1 = require("mithril");
var Dialog_1 = require("../gui/base/Dialog");
var LanguageViewModel_1 = require("../misc/LanguageViewModel");
var InvoiceDataInput_1 = require("./InvoiceDataInput");
var PaymentMethodInput_1 = require("./PaymentMethodInput");
var stream_1 = require("mithril/stream");
var TutanotaConstants_1 = require("../api/common/TutanotaConstants");
var ProgressDialog_1 = require("../gui/dialogs/ProgressDialog");
var PaymentDataDialog_1 = require("./PaymentDataDialog");
var LoginController_1 = require("../api/main/LoginController");
var TypeRefs_js_1 = require("../api/entities/sys/TypeRefs.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var SubscriptionUtils_1 = require("./SubscriptionUtils");
var Button_js_1 = require("../gui/base/Button.js");
var SegmentControl_1 = require("../gui/base/SegmentControl");
var WizardDialog_js_1 = require("../gui/base/WizardDialog.js");
var Animations_1 = require("../gui/animation/Animations");
var EventController_1 = require("../api/main/EventController");
var MainLocator_1 = require("../api/main/MainLocator");
var Env_1 = require("../api/common/Env");
/**
 * Wizard page for editing invoice and payment data.
 */
var InvoiceAndPaymentDataPage = /** @class */ (function () {
    function InvoiceAndPaymentDataPage(upgradeData) {
        var _this = this;
        this._paymentMethodInput = null;
        this._invoiceDataInput = null;
        this._availablePaymentMethods = null;
        this.__signupPaidTest = MainLocator_1.locator.usageTestController.getTest("signup.paid");
        this._upgradeData = upgradeData;
        this._selectedPaymentMethod = (0, stream_1["default"])();
        this._selectedPaymentMethod.map(function (method) { return (0, tutanota_utils_1.neverNull)(_this._paymentMethodInput).updatePaymentMethod(method); });
    }
    InvoiceAndPaymentDataPage.prototype.onremove = function (vnode) {
        var data = vnode.attrs.data;
        // TODO check if correct place to update these
        if (this._invoiceDataInput && this._paymentMethodInput) {
            data.invoiceData = this._invoiceDataInput.getInvoiceData();
            data.paymentData = this._paymentMethodInput.getPaymentData();
        }
    };
    InvoiceAndPaymentDataPage.prototype.oncreate = function (vnode) {
        var _this = this;
        this.dom = vnode.dom;
        var data = vnode.attrs.data;
        // TODO check if correct place to update these
        if (this._invoiceDataInput && this._paymentMethodInput) {
            data.invoiceData = this._invoiceDataInput.getInvoiceData();
            data.paymentData = this._paymentMethodInput.getPaymentData();
        }
        var login = Promise.resolve(null);
        if (!LoginController_1.logins.isUserLoggedIn()) {
            login = LoginController_1.logins.createSession((0, tutanota_utils_1.neverNull)(data.newAccountData).mailAddress, (0, tutanota_utils_1.neverNull)(data.newAccountData).password, 1 /* SessionType.Temporary */);
        }
        login
            .then(function () {
            if (!data.accountingInfo || !data.customer) {
                return MainLocator_1.locator.entityClient
                    .load(TypeRefs_js_1.CustomerTypeRef, (0, tutanota_utils_1.neverNull)(LoginController_1.logins.getUserController().user.customer))
                    .then(function (customer) {
                    data.customer = customer;
                    return MainLocator_1.locator.entityClient.load(TypeRefs_js_1.CustomerInfoTypeRef, customer.customerInfo);
                })
                    .then(function (customerInfo) {
                    return MainLocator_1.locator.entityClient.load(TypeRefs_js_1.AccountingInfoTypeRef, customerInfo.accountingInfo).then(function (accountingInfo) {
                        data.accountingInfo = accountingInfo;
                    });
                });
            }
        })
            .then(function () {
            _this._invoiceDataInput = new InvoiceDataInput_1.InvoiceDataInput(data.options.businessUse(), data.invoiceData, InvoiceDataInput_1.InvoiceDataInputLocation.InWizard);
            var payPalRequestUrl = (0, PaymentDataDialog_1.getLazyLoadedPayPalUrl)();
            if (LoginController_1.logins.isUserLoggedIn()) {
                LoginController_1.logins.waitForFullLogin().then(function () { return payPalRequestUrl.getAsync(); });
            }
            _this._paymentMethodInput = new PaymentMethodInput_1.PaymentMethodInput(data.options, _this._invoiceDataInput.selectedCountry, (0, tutanota_utils_1.neverNull)(data.accountingInfo), payPalRequestUrl);
            _this._availablePaymentMethods = _this._paymentMethodInput.getVisiblePaymentMethods();
            _this._selectedPaymentMethod(data.paymentData.paymentMethod);
            _this._paymentMethodInput.updatePaymentMethod(data.paymentData.paymentMethod, data.paymentData);
        });
    };
    InvoiceAndPaymentDataPage.prototype.view = function (vnode) {
        var _this = this;
        var a = vnode.attrs;
        var onNextClick = function () {
            var invoiceDataInput = (0, tutanota_utils_1.assertNotNull)(_this._invoiceDataInput);
            var paymentMethodInput = (0, tutanota_utils_1.assertNotNull)(_this._paymentMethodInput);
            var error = invoiceDataInput.validateInvoiceData() || paymentMethodInput.validatePaymentData();
            if (error) {
                return Dialog_1.Dialog.message(error).then(function () { return null; });
            }
            else {
                a.data.invoiceData = invoiceDataInput.getInvoiceData();
                a.data.paymentData = paymentMethodInput.getPaymentData();
                (0, ProgressDialog_1.showProgressDialog)("updatePaymentDataBusy_msg", Promise.resolve()
                    .then(function () {
                    var customer = (0, tutanota_utils_1.neverNull)(a.data.customer);
                    if (customer.businessUse !== a.data.options.businessUse()) {
                        customer.businessUse = a.data.options.businessUse();
                        return MainLocator_1.locator.entityClient.update(customer);
                    }
                })
                    .then(function () {
                    return updatePaymentData(a.data.options.paymentInterval(), a.data.invoiceData, a.data.paymentData, null, a.data.upgradeType === "Signup" /* UpgradeType.Signup */, a.data.price, (0, tutanota_utils_1.neverNull)(a.data.accountingInfo)).then(function (success) {
                        var _a;
                        if (success) {
                            // Payment method confirmation (click on next), send selected payment method as an enum
                            var paymentMethodConfirmationStage = (_a = _this.__signupPaidTest) === null || _a === void 0 ? void 0 : _a.getStage(4);
                            paymentMethodConfirmationStage === null || paymentMethodConfirmationStage === void 0 ? void 0 : paymentMethodConfirmationStage.setMetric({
                                name: "paymentMethod",
                                value: TutanotaConstants_1.PaymentMethodTypeToName[a.data.paymentData.paymentMethod]
                            });
                            paymentMethodConfirmationStage === null || paymentMethodConfirmationStage === void 0 ? void 0 : paymentMethodConfirmationStage.complete();
                            (0, WizardDialog_js_1.emitWizardEvent)(_this.dom, "showNextWizardDialogPage" /* WizardEventType.SHOWNEXTPAGE */);
                        }
                    });
                }));
            }
        };
        return (0, mithril_1["default"])("#upgrade-account-dialog.pt", this._availablePaymentMethods
            ? [
                (0, mithril_1["default"])(SegmentControl_1.SegmentControl, {
                    items: this._availablePaymentMethods,
                    selectedValue: this._selectedPaymentMethod(),
                    onValueSelected: this._selectedPaymentMethod
                }),
                (0, mithril_1["default"])(".flex-space-around.flex-wrap.pt", [
                    (0, mithril_1["default"])(".flex-grow-shrink-half.plr-l", {
                        style: {
                            minWidth: "260px"
                        }
                    }, (0, mithril_1["default"])((0, tutanota_utils_1.neverNull)(this._invoiceDataInput))),
                    (0, mithril_1["default"])(".flex-grow-shrink-half.plr-l", {
                        style: {
                            minWidth: "260px"
                        }
                    }, (0, mithril_1["default"])((0, tutanota_utils_1.neverNull)(this._paymentMethodInput))),
                ]),
                (0, mithril_1["default"])(".flex-center.full-width.pt-l", (0, mithril_1["default"])("", {
                    style: {
                        width: "260px"
                    }
                }, (0, mithril_1["default"])(Button_js_1.Button, {
                    label: "next_action",
                    click: onNextClick,
                    type: "login" /* ButtonType.Login */
                }))),
            ]
            : null);
    };
    return InvoiceAndPaymentDataPage;
}());
exports.InvoiceAndPaymentDataPage = InvoiceAndPaymentDataPage;
var InvoiceAndPaymentDataPageAttrs = /** @class */ (function () {
    function InvoiceAndPaymentDataPageAttrs(upgradeData) {
        this._enabled = function () { return true; };
        this.data = upgradeData;
    }
    InvoiceAndPaymentDataPageAttrs.prototype.nextAction = function (showErrorDialog) {
        return Promise.resolve(true);
    };
    InvoiceAndPaymentDataPageAttrs.prototype.headerTitle = function () {
        return LanguageViewModel_1.lang.get("adminPayment_action");
    };
    InvoiceAndPaymentDataPageAttrs.prototype.isSkipAvailable = function () {
        return false;
    };
    InvoiceAndPaymentDataPageAttrs.prototype.isEnabled = function () {
        return this._enabled();
    };
    /**
     * Set the enabled function for isEnabled
     * @param enabled
     */
    InvoiceAndPaymentDataPageAttrs.prototype.setEnabledFunction = function (enabled) {
        this._enabled = enabled;
    };
    return InvoiceAndPaymentDataPageAttrs;
}());
exports.InvoiceAndPaymentDataPageAttrs = InvoiceAndPaymentDataPageAttrs;
function updatePaymentData(paymentInterval, invoiceData, paymentData, confirmedCountry, isSignup, price, accountingInfo) {
    return MainLocator_1.locator.customerFacade.updatePaymentData(paymentInterval, invoiceData, paymentData, confirmedCountry).then(function (paymentResult) {
        var statusCode = paymentResult.result;
        if (statusCode === "0" /* PaymentDataResultType.OK */) {
            // show dialog
            var braintree3ds = paymentResult.braintree3dsRequest;
            if (braintree3ds) {
                return verifyCreditCard(accountingInfo, braintree3ds, price);
            }
            else {
                return true;
            }
        }
        else {
            if (statusCode === "1" /* PaymentDataResultType.COUNTRY_MISMATCH */) {
                var countryName = invoiceData.country ? invoiceData.country.n : "";
                var confirmMessage_1 = LanguageViewModel_1.lang.get("confirmCountry_msg", {
                    "{1}": countryName
                });
                return Dialog_1.Dialog.confirm(function () { return confirmMessage_1; }).then(function (confirmed) {
                    if (confirmed) {
                        return updatePaymentData(paymentInterval, invoiceData, paymentData, invoiceData.country, isSignup, price, accountingInfo); // add confirmed invoice country
                    }
                    else {
                        return false;
                    }
                });
            }
            else {
                if (statusCode === "2" /* PaymentDataResultType.INVALID_VATID_NUMBER */) {
                    Dialog_1.Dialog.message(function () { return LanguageViewModel_1.lang.get("invalidVatIdNumber_msg") + (isSignup ? " " + LanguageViewModel_1.lang.get("accountWasStillCreated_msg") : ""); });
                }
                else if (statusCode === "3" /* PaymentDataResultType.CREDIT_CARD_DECLINED */) {
                    Dialog_1.Dialog.message(function () { return LanguageViewModel_1.lang.get("creditCardDeclined_msg") + (isSignup ? " " + LanguageViewModel_1.lang.get("accountWasStillCreated_msg") : ""); });
                }
                else if (statusCode === "4" /* PaymentDataResultType.CREDIT_CARD_CVV_INVALID */) {
                    Dialog_1.Dialog.message("creditCardCVVInvalid_msg");
                }
                else if (statusCode === "5" /* PaymentDataResultType.PAYMENT_PROVIDER_NOT_AVAILABLE */) {
                    Dialog_1.Dialog.message(function () { return LanguageViewModel_1.lang.get("paymentProviderNotAvailableError_msg") + (isSignup ? " " + LanguageViewModel_1.lang.get("accountWasStillCreated_msg") : ""); });
                }
                else if (statusCode === "7" /* PaymentDataResultType.OTHER_PAYMENT_ACCOUNT_REJECTED */) {
                    Dialog_1.Dialog.message(function () { return LanguageViewModel_1.lang.get("paymentAccountRejected_msg") + (isSignup ? " " + LanguageViewModel_1.lang.get("accountWasStillCreated_msg") : ""); });
                }
                else if (statusCode === "9" /* PaymentDataResultType.CREDIT_CARD_DATE_INVALID */) {
                    Dialog_1.Dialog.message("creditCardExprationDateInvalid_msg");
                }
                else if (statusCode === "10" /* PaymentDataResultType.CREDIT_CARD_NUMBER_INVALID */) {
                    Dialog_1.Dialog.message(function () { return LanguageViewModel_1.lang.get("creditCardNumberInvalid_msg") + (isSignup ? " " + LanguageViewModel_1.lang.get("accountWasStillCreated_msg") : ""); });
                }
                else if (statusCode === "8" /* PaymentDataResultType.COULD_NOT_VERIFY_VATID */) {
                    Dialog_1.Dialog.message(function () { return LanguageViewModel_1.lang.get("invalidVatIdValidationFailed_msg") + (isSignup ? " " + LanguageViewModel_1.lang.get("accountWasStillCreated_msg") : ""); });
                }
                else if (statusCode === "11" /* PaymentDataResultType.CREDIT_CARD_VERIFICATION_LIMIT_REACHED */) {
                    Dialog_1.Dialog.message(function () { return LanguageViewModel_1.lang.get("creditCardVerificationLimitReached_msg") + (isSignup ? " " + LanguageViewModel_1.lang.get("accountWasStillCreated_msg") : ""); });
                }
                else {
                    Dialog_1.Dialog.message(function () { return LanguageViewModel_1.lang.get("otherPaymentProviderError_msg") + (isSignup ? " " + LanguageViewModel_1.lang.get("accountWasStillCreated_msg") : ""); });
                }
                return false;
            }
        }
    });
}
exports.updatePaymentData = updatePaymentData;
/**
 * Displays a progress dialog that allows to cancel the verification and opens a new window to do the actual verification with the bank.
 */
function verifyCreditCard(accountingInfo, braintree3ds, price) {
    return MainLocator_1.locator.entityClient.load(TypeRefs_js_1.InvoiceInfoTypeRef, (0, tutanota_utils_1.neverNull)(accountingInfo.invoiceInfo)).then(function (invoiceInfo) {
        var invoiceInfoWrapper = {
            invoiceInfo: invoiceInfo
        };
        var resolve;
        var progressDialogPromise = new Promise(function (res) { return (resolve = res); });
        var progressDialog;
        var closeAction = function () {
            // user did not complete the 3ds dialog and PaymentDataService.POST was not invoked
            progressDialog.close();
            setTimeout(function () { return resolve(false); }, Animations_1.DefaultAnimationTime);
        };
        progressDialog = new Dialog_1.Dialog("Alert" /* DialogType.Alert */, {
            view: function () { return [
                (0, mithril_1["default"])(".dialog-contentButtonsBottom.text-break.selectable", LanguageViewModel_1.lang.get("creditCardPendingVerification_msg")),
                (0, mithril_1["default"])(".flex-center.dialog-buttons", (0, mithril_1["default"])(Button_js_1.Button, {
                    label: "cancel_action",
                    click: closeAction,
                    type: "primary" /* ButtonType.Primary */
                })),
            ]; }
        })
            .setCloseHandler(closeAction)
            .addShortcut({
            key: TutanotaConstants_1.Keys.RETURN,
            shift: false,
            exec: closeAction,
            help: "close_alt"
        })
            .addShortcut({
            key: TutanotaConstants_1.Keys.ESC,
            shift: false,
            exec: closeAction,
            help: "close_alt"
        });
        var entityEventListener = function (updates, eventOwnerGroupId) {
            return (0, tutanota_utils_1.promiseMap)(updates, function (update) {
                if ((0, EventController_1.isUpdateForTypeRef)(TypeRefs_js_1.InvoiceInfoTypeRef, update)) {
                    return MainLocator_1.locator.entityClient.load(TypeRefs_js_1.InvoiceInfoTypeRef, update.instanceId).then(function (invoiceInfo) {
                        invoiceInfoWrapper.invoiceInfo = invoiceInfo;
                        if (!invoiceInfo.paymentErrorInfo) {
                            // user successfully verified the card
                            progressDialog.close();
                            resolve(true);
                        }
                        else if (invoiceInfo.paymentErrorInfo && invoiceInfo.paymentErrorInfo.errorCode === "card.3ds2_pending") {
                            // keep waiting. this error code is set before starting the 3DS2 verification and we just received the event very late
                        }
                        else if (invoiceInfo.paymentErrorInfo && invoiceInfo.paymentErrorInfo.errorCode !== null) {
                            // verification error during 3ds verification
                            Dialog_1.Dialog.message((0, SubscriptionUtils_1.getPreconditionFailedPaymentMsg)(invoiceInfo.paymentErrorInfo.errorCode));
                            resolve(false);
                            progressDialog.close();
                        }
                        mithril_1["default"].redraw();
                    });
                }
            }).then(tutanota_utils_1.noOp);
        };
        MainLocator_1.locator.eventController.addEntityListener(entityEventListener);
        var params = "clientToken=".concat(encodeURIComponent(braintree3ds.clientToken), "&nonce=").concat(encodeURIComponent(braintree3ds.nonce), "&bin=").concat(encodeURIComponent(braintree3ds.bin), "&price=").concat(encodeURIComponent(price), "&message=").concat(encodeURIComponent(LanguageViewModel_1.lang.get("creditCardVerification_msg")), "&clientType=").concat((0, TutanotaConstants_1.getClientType)());
        Dialog_1.Dialog.message("creditCardVerificationNeededPopup_msg").then(function () {
            window.open("".concat((0, Env_1.getPaymentWebRoot)(), "/braintree.html#").concat(params));
            progressDialog.show();
        });
        return progressDialogPromise["finally"](function () { return MainLocator_1.locator.eventController.removeEntityListener(entityEventListener); });
    });
}
