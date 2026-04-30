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
exports.isInboxList = exports._matchesRegularExpression = exports._findMatchingRule = exports.findAndApplyMatchingRule = exports.getInboxRuleTypeName = exports.getInboxRuleTypeNameMapping = void 0;
var TypeRefs_js_1 = require("../../api/entities/tutanota/TypeRefs.js");
var TutanotaConstants_1 = require("../../api/common/TutanotaConstants");
var FormatValidator_1 = require("../../misc/FormatValidator");
var Utils_1 = require("../../api/common/utils/Utils");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var TypeRefs_js_2 = require("../../api/entities/tutanota/TypeRefs.js");
var LoginController_1 = require("../../api/main/LoginController");
var RestError_1 = require("../../api/common/error/RestError");
var tutanota_utils_2 = require("@tutao/tutanota-utils");
var EntityUtils_1 = require("../../api/common/utils/EntityUtils");
var MailUtils_1 = require("./MailUtils");
var tutanota_utils_3 = require("@tutao/tutanota-utils");
var Env_1 = require("../../api/common/Env");
(0, Env_1.assertMainOrNode)();
var moveMailDataPerFolder = [];
var DEBOUNCE_FIRST_MOVE_MAIL_REQUEST_MS = 200;
var applyingRules = false; // used to avoid concurrent application of rules (-> requests to locked service)
function sendMoveMailRequest(mailFacade) {
    return __awaiter(this, void 0, void 0, function () {
        var moveToTargetFolder_1, mailChunks;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!moveMailDataPerFolder.length) return [3 /*break*/, 2];
                    moveToTargetFolder_1 = (0, tutanota_utils_1.assertNotNull)(moveMailDataPerFolder.shift());
                    mailChunks = (0, tutanota_utils_2.splitInChunks)(TutanotaConstants_1.MAX_NBR_MOVE_DELETE_MAIL_SERVICE, moveToTargetFolder_1.mails);
                    return [4 /*yield*/, (0, tutanota_utils_3.promiseMap)(mailChunks, function (mailChunk) {
                            moveToTargetFolder_1.mails = mailChunk;
                            return mailFacade.moveMails(mailChunk, moveToTargetFolder_1.targetFolder);
                        })["catch"]((0, tutanota_utils_3.ofClass)(RestError_1.LockedError, function (e) {
                            //LockedError should no longer be thrown!?!
                            console.log("moving mail failed", e, moveToTargetFolder_1);
                        }))["catch"]((0, tutanota_utils_3.ofClass)(RestError_1.PreconditionFailedError, function (e) {
                            // move mail operation may have been locked by other process
                            console.log("moving mail failed", e, moveToTargetFolder_1);
                        }))["finally"](function () {
                            return sendMoveMailRequest(mailFacade);
                        })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
// We throttle the moveMail requests to a rate of 50ms
// Each target folder requires one request
var applyMatchingRules = (0, tutanota_utils_1.debounce)(DEBOUNCE_FIRST_MOVE_MAIL_REQUEST_MS, function (mailFacade) {
    if (applyingRules)
        return;
    // We lock to avoid concurrent requests
    applyingRules = true;
    sendMoveMailRequest(mailFacade)["finally"](function () {
        applyingRules = false;
    });
});
function getInboxRuleTypeNameMapping() {
    return [
        {
            value: "0" /* InboxRuleType.FROM_EQUALS */,
            name: LanguageViewModel_1.lang.get("inboxRuleSenderEquals_action")
        },
        {
            value: "1" /* InboxRuleType.RECIPIENT_TO_EQUALS */,
            name: LanguageViewModel_1.lang.get("inboxRuleToRecipientEquals_action")
        },
        {
            value: "2" /* InboxRuleType.RECIPIENT_CC_EQUALS */,
            name: LanguageViewModel_1.lang.get("inboxRuleCCRecipientEquals_action")
        },
        {
            value: "3" /* InboxRuleType.RECIPIENT_BCC_EQUALS */,
            name: LanguageViewModel_1.lang.get("inboxRuleBCCRecipientEquals_action")
        },
        {
            value: "4" /* InboxRuleType.SUBJECT_CONTAINS */,
            name: LanguageViewModel_1.lang.get("inboxRuleSubjectContains_action")
        },
        {
            value: "5" /* InboxRuleType.MAIL_HEADER_CONTAINS */,
            name: LanguageViewModel_1.lang.get("inboxRuleMailHeaderContains_action")
        },
    ];
}
exports.getInboxRuleTypeNameMapping = getInboxRuleTypeNameMapping;
function getInboxRuleTypeName(type) {
    var typeNameMapping = getInboxRuleTypeNameMapping().find(function (t) { return t.value === type; });
    return typeNameMapping != null ? typeNameMapping.name : "";
}
exports.getInboxRuleTypeName = getInboxRuleTypeName;
/**
 * Checks the mail for an existing inbox rule and moves the mail to the target folder of the rule.
 * @returns true if a rule matches otherwise false
 */
function findAndApplyMatchingRule(mailFacade, entityClient, mailboxDetail, mail, applyRulesOnServer) {
    if (mail._errors || !mail.unread || !isInboxList(mailboxDetail, (0, EntityUtils_1.getListId)(mail)) || !LoginController_1.logins.getUserController().isPremiumAccount()) {
        return Promise.resolve(null);
    }
    return _findMatchingRule(entityClient, mail, LoginController_1.logins.getUserController().props.inboxRules).then(function (inboxRule) {
        if (inboxRule) {
            var targetFolder = mailboxDetail.folders
                .filter(function (folder) { return folder !== (0, MailUtils_1.getInboxFolder)(mailboxDetail.folders); })
                .find(function (folder) { return (0, EntityUtils_1.isSameId)(folder._id, inboxRule.targetFolder); });
            if (targetFolder) {
                if (applyRulesOnServer) {
                    var moveMailData = moveMailDataPerFolder.find(function (folderMoveMailData) { return (0, EntityUtils_1.isSameId)(folderMoveMailData.targetFolder, inboxRule.targetFolder); });
                    if (moveMailData) {
                        moveMailData.mails.push(mail._id);
                    }
                    else {
                        moveMailData = (0, TypeRefs_js_1.createMoveMailData)();
                        moveMailData.targetFolder = inboxRule.targetFolder;
                        moveMailData.mails.push(mail._id);
                        moveMailDataPerFolder.push(moveMailData);
                    }
                    applyMatchingRules(mailFacade);
                }
                return [targetFolder.mails, (0, EntityUtils_1.getElementId)(mail)];
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    });
}
exports.findAndApplyMatchingRule = findAndApplyMatchingRule;
/**
 * Finds the first matching inbox rule for the mail and returns it.
 * export only for testing
 */
function _findMatchingRule(entityClient, mail, rules) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, tutanota_utils_1.asyncFind)(rules, function (rule) { return checkInboxRule(entityClient, mail, rule); }).then(function (v) { return v !== null && v !== void 0 ? v : null; })];
        });
    });
}
exports._findMatchingRule = _findMatchingRule;
function checkInboxRule(entityClient, mail, inboxRule) {
    return __awaiter(this, void 0, void 0, function () {
        var ruleType, mailAddresses;
        return __generator(this, function (_a) {
            ruleType = inboxRule.type;
            try {
                if (ruleType === "0" /* InboxRuleType.FROM_EQUALS */) {
                    mailAddresses = [mail.sender.address];
                    if (mail.differentEnvelopeSender) {
                        mailAddresses.push(mail.differentEnvelopeSender);
                    }
                    return [2 /*return*/, _checkEmailAddresses(mailAddresses, inboxRule)];
                }
                else if (ruleType === "1" /* InboxRuleType.RECIPIENT_TO_EQUALS */) {
                    return [2 /*return*/, _checkEmailAddresses(mail.toRecipients.map(function (m) { return m.address; }), inboxRule)];
                }
                else if (ruleType === "2" /* InboxRuleType.RECIPIENT_CC_EQUALS */) {
                    return [2 /*return*/, _checkEmailAddresses(mail.ccRecipients.map(function (m) { return m.address; }), inboxRule)];
                }
                else if (ruleType === "3" /* InboxRuleType.RECIPIENT_BCC_EQUALS */) {
                    return [2 /*return*/, _checkEmailAddresses(mail.bccRecipients.map(function (m) { return m.address; }), inboxRule)];
                }
                else if (ruleType === "4" /* InboxRuleType.SUBJECT_CONTAINS */) {
                    return [2 /*return*/, _checkContainsRule(mail.subject, inboxRule)];
                }
                else if (ruleType === "5" /* InboxRuleType.MAIL_HEADER_CONTAINS */) {
                    if (mail.headers) {
                        return [2 /*return*/, entityClient
                                .load(TypeRefs_js_2.MailHeadersTypeRef, mail.headers)
                                .then(function (mailHeaders) {
                                return _checkContainsRule((0, Utils_1.getMailHeaders)(mailHeaders), inboxRule);
                            })["catch"](function (e) {
                                if (!(e instanceof RestError_1.NotFoundError)) {
                                    // Does the outer catch already handle this case?
                                    console.error("Error processing inbox rule:", e.message);
                                }
                                return false;
                            })];
                    }
                    else {
                        return [2 /*return*/, false];
                    }
                }
                else {
                    console.warn("Unknown rule type: ", inboxRule.type);
                    return [2 /*return*/, false];
                }
            }
            catch (e) {
                console.error("Error processing inbox rule:", e.message);
                return [2 /*return*/, false];
            }
            return [2 /*return*/];
        });
    });
}
function _checkContainsRule(value, inboxRule) {
    return ((0, FormatValidator_1.isRegularExpression)(inboxRule.value) && _matchesRegularExpression(value, inboxRule)) || value.includes(inboxRule.value);
}
/** export for test. */
function _matchesRegularExpression(value, inboxRule) {
    if ((0, FormatValidator_1.isRegularExpression)(inboxRule.value)) {
        var flags = inboxRule.value.replace(/.*\/([gimsuy]*)$/, "$1");
        var pattern = inboxRule.value.replace(new RegExp("^/(.*?)/" + flags + "$"), "$1");
        var regExp = new RegExp(pattern, flags);
        return regExp.test(value);
    }
    return false;
}
exports._matchesRegularExpression = _matchesRegularExpression;
function _checkEmailAddresses(mailAddresses, inboxRule) {
    var mailAddress = mailAddresses.find(function (mailAddress) {
        var cleanMailAddress = mailAddress.toLowerCase().trim();
        if ((0, FormatValidator_1.isRegularExpression)(inboxRule.value)) {
            return _matchesRegularExpression(cleanMailAddress, inboxRule);
        }
        else if ((0, FormatValidator_1.isDomainName)(inboxRule.value)) {
            var domain = cleanMailAddress.split("@")[1];
            return domain === inboxRule.value;
        }
        else {
            return cleanMailAddress === inboxRule.value;
        }
    });
    return mailAddress != null;
}
function isInboxList(mailboxDetail, listId) {
    return (0, EntityUtils_1.isSameId)(listId, (0, MailUtils_1.getInboxFolder)(mailboxDetail.folders).mails);
}
exports.isInboxList = isInboxList;
