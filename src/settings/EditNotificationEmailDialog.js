"use strict";
exports.__esModule = true;
exports.show = exports.showBuyOrSetNotificationEmailDialog = exports.showAddOrEditNotificationEmailDialog = void 0;
var TypeRefs_js_1 = require("../api/entities/sys/TypeRefs.js");
var HtmlEditor_1 = require("../gui/editor/HtmlEditor");
var LanguageViewModel_1 = require("../misc/LanguageViewModel");
var stream_1 = require("mithril/stream");
var Dialog_1 = require("../gui/base/Dialog");
var mithril_1 = require("mithril");
var DropDownSelector_js_1 = require("../gui/base/DropDownSelector.js");
var TextField_js_1 = require("../gui/base/TextField.js");
var ProgressDialog_1 = require("../gui/dialogs/ProgressDialog");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var HtmlSanitizer_1 = require("../misc/HtmlSanitizer");
var Utils_1 = require("../api/common/utils/Utils");
var LoginController_1 = require("../api/main/LoginController");
var RestError_1 = require("../api/common/error/RestError");
var SegmentControl_1 = require("../gui/base/SegmentControl");
var MailViewerUtils_1 = require("../mail/view/MailViewerUtils");
var UserError_1 = require("../api/main/UserError");
var SubscriptionDialogs_1 = require("../misc/SubscriptionDialogs");
var SubscriptionUtils_1 = require("../subscription/SubscriptionUtils");
var BuyDialog_1 = require("../subscription/BuyDialog");
var EntityUtils_1 = require("../api/common/utils/EntityUtils");
var MainLocator_1 = require("../api/main/MainLocator");
function showAddOrEditNotificationEmailDialog(userController, selectedNotificationLanguage) {
    var existingTemplate = undefined;
    userController.loadCustomer().then(function (customer) {
        if (customer.properties) {
            var customerProperties_1 = new tutanota_utils_1.LazyLoaded(function () { return MainLocator_1.locator.entityClient.load(TypeRefs_js_1.CustomerPropertiesTypeRef, (0, tutanota_utils_1.neverNull)(customer.properties)); });
            return customerProperties_1
                .getAsync()
                .then(function (loadedCustomerProperties) {
                if (selectedNotificationLanguage != null) {
                    existingTemplate = loadedCustomerProperties.notificationMailTemplates.find(function (template) { return template.language === selectedNotificationLanguage; });
                }
            })
                .then(function () {
                return userController
                    .loadCustomerInfo()
                    .then(function (customerInfo) {
                    return customerInfo.bookings
                        ? MainLocator_1.locator.entityClient
                            .loadRange(TypeRefs_js_1.BookingTypeRef, customerInfo.bookings.items, EntityUtils_1.GENERATED_MAX_ID, 1, true)
                            .then(function (bookings) { return (bookings.length === 1 ? bookings[0] : null); })
                        : null;
                })
                    .then(function (lastBooking) {
                    showBuyOrSetNotificationEmailDialog(lastBooking, customerProperties_1, existingTemplate);
                });
            });
        }
    });
}
exports.showAddOrEditNotificationEmailDialog = showAddOrEditNotificationEmailDialog;
function showBuyOrSetNotificationEmailDialog(lastBooking, customerProperties, existingTemplate) {
    if (LoginController_1.logins.getUserController().isFreeAccount()) {
        (0, SubscriptionDialogs_1.showNotAvailableForFreeDialog)(false);
    }
    else {
        var whitelabelFailedPromise = (0, SubscriptionUtils_1.isWhitelabelActive)(lastBooking) ? Promise.resolve(false) : (0, BuyDialog_1.showWhitelabelBuyDialog)(true);
        whitelabelFailedPromise.then(function (failed) {
            if (!failed) {
                show(existingTemplate !== null && existingTemplate !== void 0 ? existingTemplate : null, customerProperties);
            }
        });
    }
}
exports.showBuyOrSetNotificationEmailDialog = showBuyOrSetNotificationEmailDialog;
function show(existingTemplate, customerProperties) {
    var template;
    if (!existingTemplate) {
        template = (0, TypeRefs_js_1.createNotificationMailTemplate)();
        template.language = "en";
        template.body = getDefaultNotificationMail();
        template.subject = LanguageViewModel_1.lang.get("externalNotificationMailSubject_msg", {
            "{1}": "{sender}"
        });
    }
    else {
        template = existingTemplate;
    }
    var editor = new HtmlEditor_1.HtmlEditor()
        .setMinHeight(400)
        .showBorders()
        .setModeSwitcher("mailBody_label")
        .setValue(template.body)
        .enableToolbar()
        .setToolbarOptions({
        imageButtonClickHandler: MailViewerUtils_1.insertInlineImageB64ClickHandler
    });
    var editSegment = {
        name: LanguageViewModel_1.lang.get("edit_action"),
        value: "edit"
    };
    var previewSegment = {
        name: LanguageViewModel_1.lang.get("preview_label"),
        value: "preview"
    };
    var selectedTab = (0, stream_1["default"])(editSegment.value);
    var sortedLanguages = LanguageViewModel_1.languages
        .slice()
        .sort(function (a, b) { return LanguageViewModel_1.lang.get(a.textId).localeCompare(LanguageViewModel_1.lang.get(b.textId)); })
        .map(function (language) {
        return {
            name: LanguageViewModel_1.lang.get(language.textId),
            value: language.code
        };
    });
    var selectedLanguage = (0, tutanota_utils_1.assertNotNull)(sortedLanguages.find(function (_a) {
        var value = _a.value;
        return value === template.language;
    }));
    var selectedLanguageStream = (0, stream_1["default"])(selectedLanguage.value);
    var subject = (0, stream_1["default"])(template.subject);
    // Editor resets its value on re-attach so we keep it ourselves
    var savedHtml = editor.getValue();
    selectedTab.map(function (tab) {
        if (tab === editSegment.value) {
            editor.setValue(savedHtml);
        }
        else {
            savedHtml = editor.getValue();
        }
    });
    var editTabContent = function () { return [
        (0, mithril_1["default"])(".small.mt-s", LanguageViewModel_1.lang.get("templateHelp_msg")),
        existingTemplate
            ? (0, mithril_1["default"])(TextField_js_1.TextField, {
                label: "notificationMailLanguage_label",
                disabled: true,
                value: selectedLanguage.name
            })
            : (0, mithril_1["default"])(DropDownSelector_js_1.DropDownSelector, {
                label: "notificationMailLanguage_label",
                items: sortedLanguages,
                selectedValue: selectedLanguageStream(),
                selectionChangedHandler: selectedLanguageStream,
                dropdownWidth: 250
            }),
        (0, mithril_1["default"])(TextField_js_1.TextField, {
            label: "subject_label",
            value: subject(),
            oninput: subject
        }),
        (0, mithril_1["default"])(editor),
    ]; };
    var senderName = LoginController_1.logins.getUserController().userGroupInfo.name;
    var senderDomain = "https://mail.tutanota.com";
    loadCustomerInfo().then(function (customerInfo) {
        var whitelabelDomainInfo = customerInfo && (0, Utils_1.getWhitelabelDomain)(customerInfo);
        senderDomain = "https://" + ((whitelabelDomainInfo && whitelabelDomainInfo.domain) || "mail.tutanota.com");
        mithril_1["default"].redraw();
    });
    // Even though savedHtml is always sanitized changing it might lead to mXSS
    var sanitizePreview = (0, tutanota_utils_1.memoized)(function (html) {
        return HtmlSanitizer_1.htmlSanitizer.sanitizeHTML(html).html;
    });
    var previewTabContent = function () { return [
        (0, mithril_1["default"])(TextField_js_1.TextField, {
            label: "subject_label",
            value: subject().replace(/{sender}/g, senderName),
            disabled: true
        }),
        (0, mithril_1["default"])(".small.mt.mb", LanguageViewModel_1.lang.get("mailBody_label")),
        mithril_1["default"].trust(sanitizePreview(savedHtml.replace(/{sender}/g, senderName).replace(/{link}/g, senderDomain))),
    ]; };
    Dialog_1.Dialog.showActionDialog({
        type: "EditLarge" /* DialogType.EditLarge */,
        title: LanguageViewModel_1.lang.get("edit_action"),
        child: function () {
            return [
                (0, mithril_1["default"])(SegmentControl_1.SegmentControl, {
                    items: [editSegment, previewSegment],
                    selectedValue: selectedTab(),
                    onValueSelected: selectedTab
                }),
                selectedTab() === editSegment.value ? editTabContent() : previewTabContent(),
            ];
        },
        okAction: function (dialog) {
            if (!editor.getValue().includes("{link}")) {
                return Dialog_1.Dialog.message(function () {
                    return LanguageViewModel_1.lang.get("templateMustContain_msg", {
                        "{value}": "{link}"
                    });
                });
            }
            var templates;
            var isExistingTemplate;
            var oldLanguage = template.language;
            var oldSubject = template.subject;
            var oldBody = template.body;
            return (0, ProgressDialog_1.showProgressDialog)("pleaseWait_msg", customerProperties.getAsync().then(function (customerProperties) {
                templates = customerProperties.notificationMailTemplates;
                if (customerProperties.notificationMailTemplates.some(function (t) { return t !== existingTemplate && t.language === selectedLanguageStream(); })) {
                    throw new UserError_1.UserError("templateLanguageExists_msg");
                }
                isExistingTemplate = templates.includes(template);
                if (!isExistingTemplate) {
                    customerProperties.notificationMailTemplates.push(template);
                }
                template.subject = HtmlSanitizer_1.htmlSanitizer.sanitizeHTML(subject(), {
                    blockExternalContent: false
                }).html;
                template.body = HtmlSanitizer_1.htmlSanitizer.sanitizeHTML(editor.getValue(), {
                    blockExternalContent: false
                }).html;
                template.language = selectedLanguageStream();
                return MainLocator_1.locator.entityClient.update(customerProperties).then(function () { return dialog.close(); });
            }))["catch"]((0, tutanota_utils_1.ofClass)(UserError_1.UserError, function (err) {
                return Dialog_1.Dialog.message(function () { return err.message; });
            }))["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.PayloadTooLargeError, function () {
                template.subject = oldSubject;
                template.body = oldBody;
                template.language = oldLanguage;
                if (!isExistingTemplate) {
                    templates.pop();
                }
                return Dialog_1.Dialog.message("notificationMailTemplateTooLarge_msg");
            }));
        }
    });
}
exports.show = show;
var HTML_PTAG_START = "<p>";
var HTML_PTAG_END = "</p>";
function getDefaultNotificationMail() {
    return (HTML_PTAG_START +
        LanguageViewModel_1.lang.get("externalNotificationMailBody1_msg") +
        HTML_PTAG_END +
        HTML_PTAG_START +
        LanguageViewModel_1.lang.get("externalNotificationMailBody2_msg", {
            "{1}": "https://tutanota.com" /* InfoLink.HomePage */
        }) +
        HTML_PTAG_END +
        HTML_PTAG_START +
        "<a href='{link}'>" +
        LanguageViewModel_1.lang.get("externalNotificationMailBody3_msg") +
        "</a>" +
        HTML_PTAG_END +
        HTML_PTAG_START +
        LanguageViewModel_1.lang.get("externalNotificationMailBody4_msg") +
        "<br>" +
        "{link}" +
        "<br>" +
        HTML_PTAG_END +
        HTML_PTAG_START +
        LanguageViewModel_1.lang.get("externalNotificationMailBody5_msg") +
        HTML_PTAG_END +
        HTML_PTAG_START +
        LanguageViewModel_1.lang.get("externalNotificationMailBody6_msg") +
        "<br>" +
        "{sender}" +
        HTML_PTAG_END);
}
function loadCustomerInfo() {
    return LoginController_1.logins
        .getUserController()
        .loadCustomer()
        .then(function (customer) { return MainLocator_1.locator.entityClient.load(TypeRefs_js_1.CustomerInfoTypeRef, customer.customerInfo); });
}
