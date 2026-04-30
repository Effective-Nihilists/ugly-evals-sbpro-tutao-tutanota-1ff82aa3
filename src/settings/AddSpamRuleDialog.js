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
exports.getSpamRuleTypeNameMapping = exports.getSpamRuleFieldMapping = exports.getSpamRuleFieldToName = exports.showAddSpamRuleDialog = void 0;
var mithril_1 = require("mithril");
var LanguageViewModel_1 = require("../misc/LanguageViewModel");
var FormatValidator_1 = require("../misc/FormatValidator");
var TutanotaConstants_1 = require("../api/common/TutanotaConstants");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Dialog_1 = require("../gui/base/Dialog");
var TypeRefs_js_1 = require("../api/entities/sys/TypeRefs.js");
var LoginController_1 = require("../api/main/LoginController");
var stream_1 = require("mithril/stream");
var DropDownSelector_js_1 = require("../gui/base/DropDownSelector.js");
var TextField_js_1 = require("../gui/base/TextField.js");
var MainLocator_1 = require("../api/main/MainLocator");
var Env_1 = require("../api/common/Env");
var ErrorCheckUtils_js_1 = require("../api/common/utils/ErrorCheckUtils.js");
(0, Env_1.assertMainOrNode)();
function showAddSpamRuleDialog(existingSpamRuleOrTemplate) {
    var _this = this;
    var loadedData = null;
    var typeItems = getSpamRuleTypeNameMapping();
    var selectedType = (0, stream_1["default"])((existingSpamRuleOrTemplate && (0, TutanotaConstants_1.getSpamRuleType)(existingSpamRuleOrTemplate)) || typeItems[0].value);
    var valueFieldValue = (0, stream_1["default"])(existingSpamRuleOrTemplate ? existingSpamRuleOrTemplate.value : "");
    var fieldValues = getSpamRuleFieldMapping();
    var selectedField = (0, stream_1["default"])(existingSpamRuleOrTemplate ? (0, TutanotaConstants_1.getSpamRuleField)(existingSpamRuleOrTemplate) : fieldValues[0].value);
    var form = function () { return [
        (0, mithril_1["default"])(DropDownSelector_js_1.DropDownSelector, {
            items: fieldValues,
            label: "field_label",
            selectedValue: selectedField(),
            selectionChangedHandler: selectedField
        }),
        (0, mithril_1["default"])(TextField_js_1.TextField, {
            label: "emailSenderPlaceholder_label",
            value: valueFieldValue(),
            oninput: valueFieldValue,
            helpLabel: function () {
                var _a;
                return LanguageViewModel_1.lang.get((_a = validate(selectedType(), valueFieldValue(), selectedField(), loadedData, existingSpamRuleOrTemplate)) !== null && _a !== void 0 ? _a : "emptyString_msg");
            }
        }),
        (0, mithril_1["default"])(DropDownSelector_js_1.DropDownSelector, {
            items: typeItems,
            label: "emailSenderRule_label",
            selectedValue: selectedType(),
            selectionChangedHandler: selectedType
        }),
    ]; };
    var addSpamRuleOkAction = function (dialog) { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    if (!(existingSpamRuleOrTemplate && existingSpamRuleOrTemplate._id)) return [3 /*break*/, 2];
                    return [4 /*yield*/, MainLocator_1.locator.customerFacade.editSpamRule(Object.assign({}, existingSpamRuleOrTemplate, {
                            value: valueFieldValue(),
                            field: selectedField(),
                            type: selectedType()
                        }))];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, MainLocator_1.locator.customerFacade.addSpamRule(selectedField(), selectedType(), valueFieldValue())];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    dialog.close();
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    if (!(0, ErrorCheckUtils_js_1.isOfflineError)(error_1)) {
                        dialog.close();
                    }
                    throw error_1;
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var dialog = Dialog_1.Dialog.showActionDialog({
        title: LanguageViewModel_1.lang.get("addSpamRule_action"),
        child: form,
        validator: function () { return validate(selectedType(), valueFieldValue(), selectedField(), loadedData, existingSpamRuleOrTemplate); },
        allowOkWithReturn: true,
        okAction: addSpamRuleOkAction
    });
    // start loading in background
    loadData().then(function (loaded) {
        loadedData = loaded;
        mithril_1["default"].redraw();
    }, function (e) {
        // Might be an offline error, if we can't load data we should close the dialog regardless, they can try opening it again
        dialog.close();
        throw e;
    });
}
exports.showAddSpamRuleDialog = showAddSpamRuleDialog;
function loadData() {
    return __awaiter(this, void 0, void 0, function () {
        var customerServerProperties, customer, customerInfo, customDomains, existingSpamRules;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, MainLocator_1.locator.customerFacade.loadCustomerServerProperties()];
                case 1:
                    customerServerProperties = _a.sent();
                    return [4 /*yield*/, MainLocator_1.locator.entityClient.load(TypeRefs_js_1.CustomerTypeRef, (0, tutanota_utils_1.neverNull)(LoginController_1.logins.getUserController().user.customer))];
                case 2:
                    customer = _a.sent();
                    return [4 /*yield*/, MainLocator_1.locator.entityClient.load(TypeRefs_js_1.CustomerInfoTypeRef, customer.customerInfo)];
                case 3:
                    customerInfo = _a.sent();
                    customDomains = customerInfo.domainInfos.map(function (d) { return d.domain; });
                    existingSpamRules = customerServerProperties.emailSenderList;
                    return [2 /*return*/, { customDomains: customDomains, existingSpamRules: existingSpamRules }];
            }
        });
    });
}
/** @return translation key if validation fails or null if it succeeds */
function validate(type, value, field, loadedData, existingSpamRuleOrTemplate) {
    var currentValue = value.toLowerCase().trim();
    if (loadedData == null) {
        return "loading_msg";
    }
    else if (currentValue === "") {
        return "spamRuleEnterValue_msg";
    }
    else if (!(0, FormatValidator_1.isDomainOrTopLevelDomain)(currentValue) && !(0, FormatValidator_1.isMailAddress)(currentValue, false) && currentValue !== "*") {
        return "invalidInputFormat_msg";
    }
    else if (isInvalidRule(type, currentValue, loadedData.customDomains)) {
        return "emailSenderInvalidRule_msg";
    }
    else if (loadedData.existingSpamRules.some(function (r) {
        return r.value === currentValue && // Only collision if we don't edit existing one or existing one has different id
            (existingSpamRuleOrTemplate == null || r._id !== existingSpamRuleOrTemplate._id) &&
            r.field === field;
    })) {
        return "emailSenderExistingRule_msg";
    }
    return null;
}
function isInvalidRule(type, value, customDomains) {
    if (type !== TutanotaConstants_1.SpamRuleType.WHITELIST) {
        if ((0, FormatValidator_1.isDomainOrTopLevelDomain)(value)) {
            return value === "tutao.de" || (0, tutanota_utils_1.contains)(TutanotaConstants_1.TUTANOTA_MAIL_ADDRESS_DOMAINS, value) || (0, tutanota_utils_1.contains)(customDomains, value);
        }
        else if ((0, FormatValidator_1.isMailAddress)(value, false)) {
            var domain = value.split("@")[1];
            return domain === "tutao.de" || (0, tutanota_utils_1.contains)(customDomains, domain);
        }
    }
    return false;
}
function getSpamRuleFieldToName() {
    var _a;
    return _a = {},
        _a["0" /* SpamRuleFieldType.FROM */] = LanguageViewModel_1.lang.get("inboxRuleSenderEquals_action"),
        _a["1" /* SpamRuleFieldType.TO */] = LanguageViewModel_1.lang.get("inboxRuleToRecipientEquals_action"),
        _a["2" /* SpamRuleFieldType.CC */] = LanguageViewModel_1.lang.get("inboxRuleCCRecipientEquals_action"),
        _a["3" /* SpamRuleFieldType.BCC */] = LanguageViewModel_1.lang.get("inboxRuleBCCRecipientEquals_action"),
        _a;
}
exports.getSpamRuleFieldToName = getSpamRuleFieldToName;
function getSpamRuleFieldMapping() {
    return (0, tutanota_utils_1.objectEntries)(getSpamRuleFieldToName()).map(function (_a) {
        var value = _a[0], name = _a[1];
        return ({
            value: value,
            name: name
        });
    });
}
exports.getSpamRuleFieldMapping = getSpamRuleFieldMapping;
function getSpamRuleTypeNameMapping() {
    return [
        {
            value: TutanotaConstants_1.SpamRuleType.WHITELIST,
            name: LanguageViewModel_1.lang.get("emailSenderWhitelist_action")
        },
        {
            value: TutanotaConstants_1.SpamRuleType.BLACKLIST,
            name: LanguageViewModel_1.lang.get("emailSenderBlacklist_action")
        },
        {
            value: TutanotaConstants_1.SpamRuleType.DISCARD,
            name: LanguageViewModel_1.lang.get("emailSenderDiscardlist_action")
        },
    ];
}
exports.getSpamRuleTypeNameMapping = getSpamRuleTypeNameMapping;
