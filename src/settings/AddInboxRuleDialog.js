"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.createInboxRuleTemplate = exports.show = void 0;
var mithril_1 = require("mithril");
var Dialog_1 = require("../gui/base/Dialog");
var LanguageViewModel_1 = require("../misc/LanguageViewModel");
var FormatValidator_1 = require("../misc/FormatValidator");
var InboxRuleHandler_1 = require("../mail/model/InboxRuleHandler");
var TypeRefs_js_1 = require("../api/entities/tutanota/TypeRefs.js");
var LoginController_1 = require("../api/main/LoginController");
var MailUtils_1 = require("../mail/model/MailUtils");
var stream_1 = require("mithril/stream");
var DropDownSelector_js_1 = require("../gui/base/DropDownSelector.js");
var TextField_js_1 = require("../gui/base/TextField.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var RestError_1 = require("../api/common/error/RestError");
var SubscriptionDialogs_1 = require("../misc/SubscriptionDialogs");
var EntityUtils_1 = require("../api/common/utils/EntityUtils");
var Env_1 = require("../api/common/Env");
var MainLocator_1 = require("../api/main/MainLocator");
var ErrorCheckUtils_js_1 = require("../api/common/utils/ErrorCheckUtils.js");
(0, Env_1.assertMainOrNode)();
function show(mailBoxDetails, ruleOrTemplate) {
    if (LoginController_1.logins.getUserController().isFreeAccount()) {
        (0, SubscriptionDialogs_1.showNotAvailableForFreeDialog)(true);
    }
    else if (mailBoxDetails) {
        var targetFolders_1 = mailBoxDetails.folders
            .filter(function (folder) { return (0, MailUtils_1.mailStateAllowedInsideFolderType)("2" /* MailState.RECEIVED */, folder.folderType); })
            .map(function (folder) {
            return {
                name: (0, MailUtils_1.getFolderName)(folder),
                value: folder
            };
        })
            .sort(function (folder1, folder2) { return folder1.name.localeCompare(folder2.name); });
        var inboxRuleType_1 = (0, stream_1["default"])(ruleOrTemplate.type);
        var inboxRuleValue_1 = (0, stream_1["default"])(ruleOrTemplate.value);
        var selectedFolder = mailBoxDetails.folders.find(function (folder) { return (0, EntityUtils_1.isSameId)(folder._id, ruleOrTemplate.targetFolder); });
        var inboxRuleTarget_1 = (0, stream_1["default"])(selectedFolder || (0, MailUtils_1.getArchiveFolder)(mailBoxDetails.folders));
        var form = function () { return [
            (0, mithril_1["default"])(DropDownSelector_js_1.DropDownSelector, {
                items: (0, InboxRuleHandler_1.getInboxRuleTypeNameMapping)(),
                label: "inboxRuleField_label",
                selectedValue: inboxRuleType_1(),
                selectionChangedHandler: inboxRuleType_1
            }),
            (0, mithril_1["default"])(TextField_js_1.TextField, {
                label: "inboxRuleValue_label",
                value: inboxRuleValue_1(),
                oninput: inboxRuleValue_1,
                helpLabel: function () {
                    return inboxRuleType_1() !== "4" /* InboxRuleType.SUBJECT_CONTAINS */ && inboxRuleType_1() !== "5" /* InboxRuleType.MAIL_HEADER_CONTAINS */
                        ? LanguageViewModel_1.lang.get("emailSenderPlaceholder_label")
                        : LanguageViewModel_1.lang.get("emptyString_msg");
                }
            }),
            (0, mithril_1["default"])(DropDownSelector_js_1.DropDownSelector, {
                label: "inboxRuleTargetFolder_label",
                items: targetFolders_1,
                selectedValue: inboxRuleTarget_1(),
                selectionChangedHandler: inboxRuleTarget_1
            }),
        ]; };
        var isNewRule_1 = ruleOrTemplate._id === null;
        var addInboxRuleOkAction = function (dialog) {
            var rule = (0, TypeRefs_js_1.createInboxRule)();
            rule.type = inboxRuleType_1();
            rule.value = getCleanedValue(inboxRuleType_1(), inboxRuleValue_1());
            rule.targetFolder = inboxRuleTarget_1()._id;
            var props = LoginController_1.logins.getUserController().props;
            var inboxRules = props.inboxRules;
            props.inboxRules = isNewRule_1 ? __spreadArray(__spreadArray([], inboxRules, true), [rule], false) : inboxRules.map(function (inboxRule) { return ((0, EntityUtils_1.isSameId)(inboxRule._id, ruleOrTemplate._id) ? rule : inboxRule); });
            MainLocator_1.locator.entityClient.update(props).then(function () {
                dialog.close();
            })["catch"](function (error) {
                if ((0, ErrorCheckUtils_js_1.isOfflineError)(error)) {
                    props.inboxRules = inboxRules;
                    //do not close
                    throw error;
                }
                else if (error instanceof RestError_1.LockedError) {
                    dialog.close();
                }
                else {
                    props.inboxRules = inboxRules;
                    dialog.close();
                    throw error;
                }
            });
        };
        Dialog_1.Dialog.showActionDialog({
            title: LanguageViewModel_1.lang.get("addInboxRule_action"),
            child: form,
            validator: function () { return validateInboxRuleInput(inboxRuleType_1(), inboxRuleValue_1(), ruleOrTemplate._id); },
            allowOkWithReturn: true,
            okAction: addInboxRuleOkAction
        });
    }
}
exports.show = show;
function createInboxRuleTemplate(ruleType, value) {
    var template = (0, TypeRefs_js_1.createInboxRule)();
    template.type = ruleType || "0" /* InboxRuleType.FROM_EQUALS */;
    template.value = getCleanedValue((0, tutanota_utils_1.neverNull)(ruleType), value || "");
    return template;
}
exports.createInboxRuleTemplate = createInboxRuleTemplate;
function validateInboxRuleInput(type, value, ruleId) {
    var currentCleanedValue = getCleanedValue(type, value);
    if (currentCleanedValue === "") {
        return "inboxRuleEnterValue_msg";
    }
    else if (isInvalidRegex(currentCleanedValue)) {
        return "invalidRegexSyntax_msg";
    }
    else if (type !== "4" /* InboxRuleType.SUBJECT_CONTAINS */ &&
        type !== "5" /* InboxRuleType.MAIL_HEADER_CONTAINS */ &&
        !(0, FormatValidator_1.isRegularExpression)(currentCleanedValue) &&
        !(0, FormatValidator_1.isDomainName)(currentCleanedValue) &&
        !(0, FormatValidator_1.isMailAddress)(currentCleanedValue, false)) {
        return "inboxRuleInvalidEmailAddress_msg";
    }
    else {
        var existingRule = (0, MailUtils_1.getExistingRuleForType)(LoginController_1.logins.getUserController().props, currentCleanedValue, type);
        if (existingRule && (!ruleId || (ruleId && !(0, EntityUtils_1.isSameId)(existingRule._id, ruleId)))) {
            return "inboxRuleAlreadyExists_msg";
        }
    }
    return null;
}
function getCleanedValue(type, value) {
    if (type === "4" /* InboxRuleType.SUBJECT_CONTAINS */ || type === "5" /* InboxRuleType.MAIL_HEADER_CONTAINS */) {
        return value;
    }
    else {
        return value.trim().toLowerCase();
    }
}
/**
 * @param value
 * @returns true if provided string is a regex and it's unparseable by RegExp, else false
 * @private
 */
function isInvalidRegex(value) {
    if (!(0, FormatValidator_1.isRegularExpression)(value))
        return false; // not a regular expression is not an invalid regular expression
    try {
        // RegExp ctor throws a ParseError if invalid regex
        var regExp = new RegExp(value.substring(1, value.length - 1));
    }
    catch (e) {
        return true;
    }
    return false;
}
