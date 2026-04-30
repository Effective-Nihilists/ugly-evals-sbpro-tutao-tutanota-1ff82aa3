"use strict";
exports.__esModule = true;
exports.UpgradeSubscriptionPageAttrs = exports.UpgradeSubscriptionPage = void 0;
var mithril_1 = require("mithril");
var stream_1 = require("mithril/stream");
var LanguageViewModel_1 = require("../misc/LanguageViewModel");
var UpgradeSubscriptionWizard_1 = require("./UpgradeSubscriptionWizard");
var SubscriptionSelector_1 = require("./SubscriptionSelector");
var Env_1 = require("../api/common/Env");
var ClientDetector_1 = require("../misc/ClientDetector");
var Button_js_1 = require("../gui/base/Button.js");
var Dialog_1 = require("../gui/base/Dialog");
var WizardDialog_js_1 = require("../gui/base/WizardDialog.js");
var Animations_1 = require("../gui/animation/Animations");
var TutanotaConstants_1 = require("../api/common/TutanotaConstants");
var Checkbox_js_1 = require("../gui/base/Checkbox.js");
var PriceUtils_1 = require("./PriceUtils");
var MainLocator_1 = require("../api/main/MainLocator");
var UpgradeSubscriptionPage = /** @class */ (function () {
    function UpgradeSubscriptionPage() {
        this._dom = null;
        this.upgradeType = null;
    }
    UpgradeSubscriptionPage.prototype.oncreate = function (vnode) {
        this._dom = vnode.dom;
        var subscriptionParameters = vnode.attrs.data.subscriptionParameters;
        this.upgradeType = vnode.attrs.data.upgradeType;
        this.__signupFreeTest = MainLocator_1.locator.usageTestController.getTest("signup.free");
        this.__signupFreeTest.strictStageOrder = true;
        this.__signupFreeTest.active = false;
        this.__signupPaidTest = MainLocator_1.locator.usageTestController.getTest("signup.paid");
        this.__signupPaidTest.strictStageOrder = true;
        this.__signupPaidTest.active = false;
        if (subscriptionParameters && (subscriptionParameters.interval === "12" || subscriptionParameters.interval === "1")) {
            // We automatically route to the next page; when we want to go back from the second page, we do not want to keep calling nextPage
            vnode.attrs.data.subscriptionParameters = null;
            vnode.attrs.data.options.paymentInterval = (0, stream_1["default"])(Number(subscriptionParameters.interval));
            this.goToNextPageWithPreselectedSubscription(subscriptionParameters, vnode.attrs.data);
        }
    };
    UpgradeSubscriptionPage.prototype.view = function (vnode) {
        var _this = this;
        var data = vnode.attrs.data;
        var subscriptionActionButtons = {
            Free: {
                view: function () {
                    return (0, mithril_1["default"])(Button_js_1.Button, {
                        label: "pricing.select_action",
                        click: function () { return _this.selectFree(data); },
                        type: "login" /* ButtonType.Login */
                    });
                }
            },
            Premium: this.createUpgradeButton(data, "Premium" /* SubscriptionType.Premium */),
            PremiumBusiness: this.createUpgradeButton(data, "PremiumBusiness" /* SubscriptionType.PremiumBusiness */),
            Teams: this.createUpgradeButton(data, "Teams" /* SubscriptionType.Teams */),
            TeamsBusiness: this.createUpgradeButton(data, "TeamsBusiness" /* SubscriptionType.TeamsBusiness */),
            Pro: this.createUpgradeButton(data, "Pro" /* SubscriptionType.Pro */)
        };
        return (0, mithril_1["default"])("#upgrade-account-dialog.pt", [
            (0, mithril_1["default"])(SubscriptionSelector_1.SubscriptionSelector, {
                options: data.options,
                campaignInfoTextId: data.campaignInfoTextId,
                boxWidth: 230,
                boxHeight: 270,
                planPrices: data.planPrices,
                isInitialUpgrade: data.upgradeType !== "Switch" /* UpgradeType.Switch */,
                currentSubscriptionType: data.currentSubscription,
                currentlySharingOrdered: false,
                currentlyBusinessOrdered: false,
                currentlyWhitelabelOrdered: false,
                orderedContactForms: 0,
                actionButtons: subscriptionActionButtons
            }),
        ]);
    };
    UpgradeSubscriptionPage.prototype.selectFree = function (data) {
        var _this = this;
        // Confirmation of free subscription selection (click on subscription selector)
        if (this.__signupPaidTest) {
            this.__signupPaidTest.active = false;
        }
        if (this.__signupFreeTest && this.upgradeType == "Signup" /* UpgradeType.Signup */) {
            this.__signupFreeTest.active = true;
            this.__signupFreeTest.getStage(0).complete();
        }
        confirmFreeSubscription().then(function (confirmed) {
            var _a;
            if (confirmed) {
                // Confirmation of free/business dialog (click on ok)
                (_a = _this.__signupFreeTest) === null || _a === void 0 ? void 0 : _a.getStage(1).complete();
                data.type = "Free" /* SubscriptionType.Free */;
                data.price = "0";
                data.priceNextYear = "0";
                _this.showNextPage();
            }
        });
    };
    UpgradeSubscriptionPage.prototype.showNextPage = function () {
        if (this._dom) {
            (0, WizardDialog_js_1.emitWizardEvent)(this._dom, "showNextWizardDialogPage" /* WizardEventType.SHOWNEXTPAGE */);
        }
    };
    UpgradeSubscriptionPage.prototype.goToNextPageWithPreselectedSubscription = function (subscriptionParameters, data) {
        if (subscriptionParameters.type === "private") {
            // we have to individually change the data so that when returning we show the chose subscription type (private/business) | false = private, true = business
            data.options.businessUse(false);
            switch (subscriptionParameters.subscription) {
                case UpgradeSubscriptionWizard_1.SubscriptionTypeParameter.FREE:
                    this.selectFree(data);
                    break;
                case UpgradeSubscriptionWizard_1.SubscriptionTypeParameter.PREMIUM:
                    this.setNonFreeDataAndGoToNextPage(data, "Premium" /* SubscriptionType.Premium */);
                    break;
                case UpgradeSubscriptionWizard_1.SubscriptionTypeParameter.TEAMS:
                    this.setNonFreeDataAndGoToNextPage(data, "Teams" /* SubscriptionType.Teams */);
                    break;
                default:
                    console.log("Unknown subscription passed: ", subscriptionParameters);
                    break;
            }
        }
        else if (subscriptionParameters.type === "business") {
            data.options.businessUse(true);
            switch (subscriptionParameters.subscription) {
                case UpgradeSubscriptionWizard_1.SubscriptionTypeParameter.PREMIUM:
                    this.setNonFreeDataAndGoToNextPage(data, "PremiumBusiness" /* SubscriptionType.PremiumBusiness */);
                    break;
                case UpgradeSubscriptionWizard_1.SubscriptionTypeParameter.TEAMS:
                    this.setNonFreeDataAndGoToNextPage(data, "TeamsBusiness" /* SubscriptionType.TeamsBusiness */);
                    break;
                case UpgradeSubscriptionWizard_1.SubscriptionTypeParameter.PRO:
                    this.setNonFreeDataAndGoToNextPage(data, "Pro" /* SubscriptionType.Pro */);
                    break;
                default:
                    console.log("Unknown subscription passed: ", subscriptionParameters);
                    break;
            }
        }
        else {
            console.log("Unknown subscription type passed: ", subscriptionParameters);
        }
    };
    UpgradeSubscriptionPage.prototype.setNonFreeDataAndGoToNextPage = function (data, subscriptionType) {
        // Confirmation of paid subscription selection (click on subscription selector)
        if (this.__signupFreeTest) {
            this.__signupFreeTest.active = false;
        }
        if (this.__signupPaidTest && this.upgradeType == "Signup" /* UpgradeType.Signup */) {
            this.__signupPaidTest.active = true;
            this.__signupPaidTest.getStage(0).complete();
        }
        data.type = subscriptionType;
        data.price = String((0, PriceUtils_1.getSubscriptionPrice)(data, data.type, "1" /* UpgradePriceType.PlanActualPrice */));
        var nextYear = String((0, PriceUtils_1.getSubscriptionPrice)(data, data.type, "2" /* UpgradePriceType.PlanNextYearsPrice */));
        data.priceNextYear = data.price !== nextYear ? nextYear : null;
        this.showNextPage();
    };
    UpgradeSubscriptionPage.prototype.createUpgradeButton = function (data, subscriptionType) {
        var _this = this;
        return {
            view: function () {
                return (0, mithril_1["default"])(Button_js_1.Button, {
                    label: "pricing.select_action",
                    click: function () { return _this.setNonFreeDataAndGoToNextPage(data, subscriptionType); },
                    type: "login" /* ButtonType.Login */
                });
            }
        };
    };
    return UpgradeSubscriptionPage;
}());
exports.UpgradeSubscriptionPage = UpgradeSubscriptionPage;
function confirmFreeSubscription() {
    return new Promise(function (resolve) {
        var oneAccountValue = (0, stream_1["default"])(false);
        var privateUseValue = (0, stream_1["default"])(false);
        var dialog;
        var closeAction = function (confirmed) {
            dialog.close();
            setTimeout(function () { return resolve(confirmed); }, Animations_1.DefaultAnimationTime);
        };
        dialog = new Dialog_1.Dialog("Alert" /* DialogType.Alert */, {
            view: function () { return [
                // m(".h2.pb", lang.get("confirmFreeAccount_label")),
                (0, mithril_1["default"])("#dialog-message.dialog-contentButtonsBottom.text-break.text-prewrap.selectable", LanguageViewModel_1.lang.getMaybeLazy("freeAccountInfo_msg")),
                (0, mithril_1["default"])(".dialog-contentButtonsBottom", [
                    (0, mithril_1["default"])(Checkbox_js_1.Checkbox, {
                        label: function () { return LanguageViewModel_1.lang.get("confirmNoOtherFreeAccount_msg"); },
                        checked: oneAccountValue(),
                        onChecked: oneAccountValue
                    }),
                    (0, mithril_1["default"])(Checkbox_js_1.Checkbox, {
                        label: function () { return LanguageViewModel_1.lang.get("confirmPrivateUse_msg"); },
                        checked: privateUseValue(),
                        onChecked: privateUseValue
                    }),
                ]),
                (0, mithril_1["default"])(".flex-center.dialog-buttons", [
                    (0, mithril_1["default"])(Button_js_1.Button, {
                        label: "cancel_action",
                        click: function () { return closeAction(false); },
                        type: "secondary" /* ButtonType.Secondary */
                    }),
                    (0, mithril_1["default"])(Button_js_1.Button, {
                        label: "ok_action",
                        click: function () {
                            if (oneAccountValue() && privateUseValue()) {
                                closeAction(true);
                            }
                        },
                        type: "primary" /* ButtonType.Primary */
                    }),
                ]),
            ]; }
        })
            .setCloseHandler(function () { return closeAction(false); })
            .addShortcut({
            key: TutanotaConstants_1.Keys.ESC,
            shift: false,
            exec: function () { return closeAction(false); },
            help: "cancel_action"
        })
            .addShortcut({
            key: TutanotaConstants_1.Keys.RETURN,
            shift: false,
            exec: function () { return closeAction(true); },
            help: "ok_action"
        })
            .show();
    });
}
var UpgradeSubscriptionPageAttrs = /** @class */ (function () {
    function UpgradeSubscriptionPageAttrs(upgradeData) {
        this.subscriptionType = null;
        this.data = upgradeData;
    }
    UpgradeSubscriptionPageAttrs.prototype.headerTitle = function () {
        return LanguageViewModel_1.lang.get("subscription_label");
    };
    UpgradeSubscriptionPageAttrs.prototype.nextAction = function (showErrorDialog) {
        // next action not available for this page
        return Promise.resolve(true);
    };
    UpgradeSubscriptionPageAttrs.prototype.isSkipAvailable = function () {
        return false;
    };
    UpgradeSubscriptionPageAttrs.prototype.isEnabled = function () {
        return (0, Env_1.isTutanotaDomain)() && !((0, Env_1.isApp)() && ClientDetector_1.client.isIos());
    };
    return UpgradeSubscriptionPageAttrs;
}());
exports.UpgradeSubscriptionPageAttrs = UpgradeSubscriptionPageAttrs;
