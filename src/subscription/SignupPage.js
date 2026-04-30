"use strict";
exports.__esModule = true;
exports.SignupPageAttrs = exports.SignupPage = void 0;
var mithril_1 = require("mithril");
var SubscriptionUtils_1 = require("./SubscriptionUtils");
var WizardDialog_js_1 = require("../gui/base/WizardDialog.js");
var SignupForm_1 = require("./SignupForm");
var SignupPage = /** @class */ (function () {
    function SignupPage() {
    }
    SignupPage.prototype.oncreate = function (vnode) {
        this.dom = vnode.dom;
    };
    SignupPage.prototype.view = function (vnode) {
        var _this = this;
        var data = vnode.attrs.data;
        var newAccountData = data.newAccountData;
        var mailAddress = undefined;
        if (newAccountData)
            mailAddress = newAccountData.mailAddress;
        return (0, mithril_1["default"])(SignupForm_1.SignupForm, {
            newSignupHandler: function (newAccountData) {
                if (newAccountData)
                    data.newAccountData = newAccountData;
                (0, WizardDialog_js_1.emitWizardEvent)(_this.dom, "showNextWizardDialogPage" /* WizardEventType.SHOWNEXTPAGE */);
            },
            isBusinessUse: data.options.businessUse,
            isPaidSubscription: function () { return data.type !== "Free" /* SubscriptionType.Free */; },
            campaign: function () { return data.registrationDataId; },
            prefilledMailAddress: mailAddress,
            readonly: !!newAccountData
        });
    };
    return SignupPage;
}());
exports.SignupPage = SignupPage;
var SignupPageAttrs = /** @class */ (function () {
    function SignupPageAttrs(signupData) {
        this.data = signupData;
    }
    SignupPageAttrs.prototype.headerTitle = function () {
        var title = (0, SubscriptionUtils_1.getDisplayNameOfSubscriptionType)(this.data.type);
        if (this.data.type === "PremiumBusiness" /* SubscriptionType.PremiumBusiness */ || this.data.type === "TeamsBusiness" /* SubscriptionType.TeamsBusiness */) {
            return title + " Business";
        }
        else {
            return title;
        }
    };
    SignupPageAttrs.prototype.nextAction = function (showErrorDialog) {
        // next action not available for this page
        return Promise.resolve(true);
    };
    SignupPageAttrs.prototype.isSkipAvailable = function () {
        return false;
    };
    SignupPageAttrs.prototype.isEnabled = function () {
        return true;
    };
    return SignupPageAttrs;
}());
exports.SignupPageAttrs = SignupPageAttrs;
