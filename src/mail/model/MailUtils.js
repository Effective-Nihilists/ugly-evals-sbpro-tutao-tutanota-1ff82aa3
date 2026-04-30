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
exports.getMoveTargetFolders = exports.RecipientField = exports.isRepliedTo = exports.checkAttachmentSize = exports.canDoDragAndDropExport = exports.getExistingRuleForType = exports.conversationTypeString = exports.getTemplateLanguages = exports.copyMailAddress = exports.mailStateAllowedInsideFolderType = exports.allMailsAllowedInsideFolder = exports.emptyOrContainsDraftsAndNonDrafts = exports.markMails = exports.getMailboxName = exports.getSenderNameForUser = exports.getSenderName = exports.getDefaultSender = exports.isUserMailbox = exports.getEnabledMailAddressesWithUser = exports.getEnabledMailAddresses = exports.getSortedCustomFolders = exports.getSortedSystemFolders = exports.getDraftFolder = exports.getArchiveFolder = exports.getInboxFolder = exports.getFolder = exports.getFolderIcon = exports.getFolderIconByType = exports.getFolderName = exports.getDefaultSenderFromUser = exports.isExcludedMailAddress = exports.isTutanotaTeamMail = exports.getSenderOrRecipientHeadingTooltip = exports.getSenderOrRecipientHeading = exports.getRecipientHeading = exports.getSenderHeading = exports.getDisplayText = exports.createNewContact = exports.isTutanotaMailAddress = exports.LINE_BREAK = void 0;
var TypeRefs_js_1 = require("../../api/entities/tutanota/TypeRefs.js");
var TutanotaConstants_1 = require("../../api/common/TutanotaConstants");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Env_1 = require("../../api/common/Env");
var RestError_1 = require("../../api/common/error/RestError");
var LoginController_1 = require("../../api/main/LoginController");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var TypeRefs_js_2 = require("../../api/entities/sys/TypeRefs.js");
var GroupUtils_1 = require("../../api/common/utils/GroupUtils");
var MailAddressParser_1 = require("../../misc/parsing/MailAddressParser");
var EntityUtils_js_1 = require("../../api/common/utils/EntityUtils.js");
(0, Env_1.assertMainOrNode)();
exports.LINE_BREAK = "<br>";
function isTutanotaMailAddress(mailAddress) {
    var tutanotaDomains = TutanotaConstants_1.TUTANOTA_MAIL_ADDRESS_DOMAINS;
    for (var i = 0; i < tutanotaDomains.length; i++) {
        if (mailAddress.endsWith("@" + tutanotaDomains[i])) {
            return true;
        }
    }
    return false;
}
exports.isTutanotaMailAddress = isTutanotaMailAddress;
/**
 * Creates a contact with an email address and a name.
 * @param mailAddress The mail address of the contact. Type is OTHER.
 * @param name The name of the contact. If an empty string is provided, the name is parsed from the mail address.
 * @return The contact.
 */
function createNewContact(user, mailAddress, name) {
    // prepare some contact information. it is only saved if the mail is sent securely
    // use the name or mail address to extract first and last name. first part is used as first name, all other parts as last name
    var firstAndLastName = name.trim() !== "" ? (0, MailAddressParser_1.fullNameToFirstAndLastName)(name) : (0, MailAddressParser_1.mailAddressToFirstAndLastName)(mailAddress);
    var contact = (0, TypeRefs_js_1.createContact)();
    contact._owner = user._id;
    contact._ownerGroup = (0, tutanota_utils_1.assertNotNull)(user.memberships.find(function (m) { return m.groupType === TutanotaConstants_1.GroupType.Contact; })).group;
    contact.firstName = firstAndLastName.firstName;
    contact.lastName = firstAndLastName.lastName;
    var ma = (0, TypeRefs_js_1.createContactMailAddress)();
    ma.address = mailAddress;
    ma.type = "2" /* ContactAddressType.OTHER */;
    ma.customTypeName = "";
    contact.mailAddresses.push(ma);
    return contact;
}
exports.createNewContact = createNewContact;
function getDisplayText(name, mailAddress, preferNameOnly) {
    if (!name) {
        return mailAddress;
    }
    else if (preferNameOnly) {
        return name;
    }
    else {
        return name + " <" + mailAddress + ">";
    }
}
exports.getDisplayText = getDisplayText;
function getSenderHeading(mail, preferNameOnly) {
    if (isExcludedMailAddress(mail.sender.address)) {
        return "";
    }
    else {
        return getDisplayText(mail.sender.name, mail.sender.address, preferNameOnly);
    }
}
exports.getSenderHeading = getSenderHeading;
function getRecipientHeading(mail, preferNameOnly) {
    var allRecipients = mail.toRecipients.concat(mail.ccRecipients).concat(mail.bccRecipients);
    if (allRecipients.length > 0) {
        return getDisplayText(allRecipients[0].name, allRecipients[0].address, preferNameOnly) + (allRecipients.length > 1 ? ", ..." : "");
    }
    else {
        return "";
    }
}
exports.getRecipientHeading = getRecipientHeading;
function getSenderOrRecipientHeading(mail, preferNameOnly) {
    if (mail.state === "2" /* MailState.RECEIVED */) {
        return getSenderHeading(mail, preferNameOnly);
    }
    else {
        return getRecipientHeading(mail, preferNameOnly);
    }
}
exports.getSenderOrRecipientHeading = getSenderOrRecipientHeading;
function getSenderOrRecipientHeadingTooltip(mail) {
    if (isTutanotaTeamMail(mail) && !isExcludedMailAddress(mail.sender.address)) {
        return LanguageViewModel_1.lang.get("tutaoInfo_msg");
    }
    else {
        return "";
    }
}
exports.getSenderOrRecipientHeadingTooltip = getSenderOrRecipientHeadingTooltip;
function isTutanotaTeamMail(mail) {
    return mail.confidential && mail.state === "2" /* MailState.RECEIVED */ && (0, tutanota_utils_1.endsWith)(mail.sender.address, "@tutao.de");
}
exports.isTutanotaTeamMail = isTutanotaTeamMail;
function isExcludedMailAddress(mailAddress) {
    return mailAddress === "no-reply@tutao.de";
}
exports.isExcludedMailAddress = isExcludedMailAddress;
/**
 * @return {string} default mail address
 */
function getDefaultSenderFromUser(_a) {
    var props = _a.props, userGroupInfo = _a.userGroupInfo;
    return props.defaultSender && (0, tutanota_utils_1.contains)((0, GroupUtils_1.getEnabledMailAddressesForGroupInfo)(userGroupInfo), props.defaultSender)
        ? props.defaultSender
        : (0, tutanota_utils_1.neverNull)(userGroupInfo.mailAddress);
}
exports.getDefaultSenderFromUser = getDefaultSenderFromUser;
function getFolderName(folder) {
    switch (folder.folderType) {
        case "0":
            return folder.name;
        case "1":
            return LanguageViewModel_1.lang.get("received_action");
        case "2":
            return LanguageViewModel_1.lang.get("sent_action");
        case "3":
            return LanguageViewModel_1.lang.get("trash_action");
        case "4":
            return LanguageViewModel_1.lang.get("archive_action");
        case "5":
            return LanguageViewModel_1.lang.get("spam_action");
        case "6":
            return LanguageViewModel_1.lang.get("draft_action");
        default:
            // do not throw an error - new system folders may cause problems
            //throw new Error("illegal folder type: " + this.folder.getFolderType())
            return "";
    }
}
exports.getFolderName = getFolderName;
function getFolderIconByType(folderType) {
    switch (folderType) {
        case "0":
            return function () { return "Folder" /* Icons.Folder */; };
        case "1":
            return function () { return "Inbox" /* Icons.Inbox */; };
        case "2":
            return function () { return "Send" /* Icons.Send */; };
        case "3":
            return function () { return "Trash" /* Icons.Trash */; };
        case "4":
            return function () { return "Archive" /* Icons.Archive */; };
        case "5":
            return function () { return "Spam" /* Icons.Spam */; };
        case "6":
            return function () { return "Edit" /* Icons.Edit */; };
        default:
            return function () { return "Folder" /* Icons.Folder */; };
    }
}
exports.getFolderIconByType = getFolderIconByType;
function getFolderIcon(folder) {
    return getFolderIconByType((0, TutanotaConstants_1.getMailFolderType)(folder));
}
exports.getFolderIcon = getFolderIcon;
function getFolder(folders, type) {
    var folder = folders.find(function (f) { return f.folderType === type; });
    return (0, tutanota_utils_1.neverNull)(folder);
}
exports.getFolder = getFolder;
function getInboxFolder(folders) {
    return getFolder(folders, TutanotaConstants_1.MailFolderType.INBOX);
}
exports.getInboxFolder = getInboxFolder;
function getArchiveFolder(folders) {
    return getFolder(folders, TutanotaConstants_1.MailFolderType.ARCHIVE);
}
exports.getArchiveFolder = getArchiveFolder;
function getDraftFolder(folders) {
    return getFolder(folders, TutanotaConstants_1.MailFolderType.DRAFT);
}
exports.getDraftFolder = getDraftFolder;
function getSortedSystemFolders(folders) {
    return folders
        .filter(function (f) { return f.folderType !== TutanotaConstants_1.MailFolderType.CUSTOM; })
        .sort(function (folder1, folder2) {
        // insert the draft folder after inbox (use type number 1.5 which is after inbox)
        if (folder1.folderType === TutanotaConstants_1.MailFolderType.DRAFT) {
            return 1.5 - Number(folder2.folderType);
        }
        else if (folder2.folderType === TutanotaConstants_1.MailFolderType.DRAFT) {
            return Number(folder1.folderType) - 1.5;
        }
        return Number(folder1.folderType) - Number(folder2.folderType);
    });
}
exports.getSortedSystemFolders = getSortedSystemFolders;
function getSortedCustomFolders(folders) {
    return folders
        .filter(function (f) { return f.folderType === TutanotaConstants_1.MailFolderType.CUSTOM; })
        .sort(function (folder1, folder2) {
        return folder1.name.localeCompare(folder2.name);
    });
}
exports.getSortedCustomFolders = getSortedCustomFolders;
/**
 * @deprecated Avoid grabbing singleton dependencies, use {@link getEnabledMailAddressesWithUser} instead to explicitly show dependencies.
 */
function getEnabledMailAddresses(mailboxDetails) {
    return getEnabledMailAddressesWithUser(mailboxDetails, LoginController_1.logins.getUserController().userGroupInfo);
}
exports.getEnabledMailAddresses = getEnabledMailAddresses;
function getEnabledMailAddressesWithUser(mailboxDetail, userGroupInfo) {
    if (isUserMailbox(mailboxDetail)) {
        return (0, GroupUtils_1.getEnabledMailAddressesForGroupInfo)(userGroupInfo);
    }
    else {
        return (0, GroupUtils_1.getEnabledMailAddressesForGroupInfo)(mailboxDetail.mailGroupInfo);
    }
}
exports.getEnabledMailAddressesWithUser = getEnabledMailAddressesWithUser;
function isUserMailbox(mailboxDetails) {
    return mailboxDetails.mailGroup != null && mailboxDetails.mailGroup.user != null;
}
exports.isUserMailbox = isUserMailbox;
function getDefaultSender(logins, mailboxDetails) {
    if (isUserMailbox(mailboxDetails)) {
        var props = logins.getUserController().props;
        return props.defaultSender && (0, tutanota_utils_1.contains)(getEnabledMailAddressesWithUser(mailboxDetails, logins.getUserController().userGroupInfo), props.defaultSender)
            ? props.defaultSender
            : (0, tutanota_utils_1.neverNull)(logins.getUserController().userGroupInfo.mailAddress);
    }
    else {
        return (0, tutanota_utils_1.neverNull)(mailboxDetails.mailGroupInfo.mailAddress);
    }
}
exports.getDefaultSender = getDefaultSender;
/** @deprecated use {@link getSenderNameForUser} instead */
function getSenderName(mailboxDetails) {
    return getSenderNameForUser(mailboxDetails, LoginController_1.logins.getUserController());
}
exports.getSenderName = getSenderName;
function getSenderNameForUser(mailboxDetails, userController) {
    if (isUserMailbox(mailboxDetails)) {
        // external users do not have access to the user group info
        return userController.userGroupInfo.name;
    }
    else {
        return mailboxDetails.mailGroupInfo ? mailboxDetails.mailGroupInfo.name : "";
    }
}
exports.getSenderNameForUser = getSenderNameForUser;
function getMailboxName(logins, mailboxDetails) {
    if (!logins.isInternalUserLoggedIn()) {
        return LanguageViewModel_1.lang.get("mailbox_label");
    }
    else if (isUserMailbox(mailboxDetails)) {
        return (0, GroupUtils_1.getGroupInfoDisplayName)(logins.getUserController().userGroupInfo);
    }
    else {
        return (0, GroupUtils_1.getGroupInfoDisplayName)((0, tutanota_utils_1.neverNull)(mailboxDetails.mailGroupInfo));
    }
}
exports.getMailboxName = getMailboxName;
function markMails(entityClient, mails, unread) {
    return Promise.all(mails.map(function (mail) {
        if (mail.unread !== unread) {
            mail.unread = unread;
            return entityClient.update(mail)["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotFoundError, tutanota_utils_1.noOp))["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.LockedError, tutanota_utils_1.noOp));
        }
        else {
            return Promise.resolve();
        }
    })).then(tutanota_utils_1.noOp);
}
exports.markMails = markMails;
/**
 * Check if all mails in the selection are drafts. If there are mixed drafts and non-drafts or the array is empty, return true.
 * @param mails
 */
function emptyOrContainsDraftsAndNonDrafts(mails) {
    return mails.length === 0
        || (mails.some(function (mail) { return mail.state === "0" /* MailState.DRAFT */; })
            && mails.some(function (mail) { return mail.state !== "0" /* MailState.DRAFT */; }));
}
exports.emptyOrContainsDraftsAndNonDrafts = emptyOrContainsDraftsAndNonDrafts;
/**
 * Return true if all mails in the array are allowed to go inside the folder (e.g. drafts can go in drafts but not inbox)
 * @param mails
 * @param folder
 */
function allMailsAllowedInsideFolder(mails, folder) {
    for (var _i = 0, mails_1 = mails; _i < mails_1.length; _i++) {
        var mail = mails_1[_i];
        if (!mailStateAllowedInsideFolderType(mail.state, folder.folderType)) {
            return false;
        }
    }
    return true;
}
exports.allMailsAllowedInsideFolder = allMailsAllowedInsideFolder;
/**
 * Return true if mail of a given type are allowed to be in a folder of a given type (e.g. drafts can go in drafts but not inbox)
 * @param mailState
 * @param folderType
 */
function mailStateAllowedInsideFolderType(mailState, folderType) {
    if (mailState === "0" /* MailState.DRAFT */) {
        return folderType === TutanotaConstants_1.MailFolderType.DRAFT || folderType === TutanotaConstants_1.MailFolderType.TRASH;
    }
    else {
        return folderType !== TutanotaConstants_1.MailFolderType.DRAFT;
    }
}
exports.mailStateAllowedInsideFolderType = mailStateAllowedInsideFolderType;
function copyMailAddress(_a) {
    var address = _a.address, name = _a.name;
    return (0, TypeRefs_js_1.createEncryptedMailAddress)({
        address: address,
        name: name
    });
}
exports.copyMailAddress = copyMailAddress;
function getTemplateLanguages(sortedLanguages, entityClient, loginController) {
    return loginController
        .getUserController()
        .loadCustomer()
        .then(function (customer) { return entityClient.load(TypeRefs_js_2.CustomerPropertiesTypeRef, (0, tutanota_utils_1.neverNull)(customer.properties)); })
        .then(function (customerProperties) {
        return sortedLanguages.filter(function (sL) { return customerProperties.notificationMailTemplates.find(function (nmt) { return nmt.language === sL.code; }); });
    })["catch"](function () { return []; });
}
exports.getTemplateLanguages = getTemplateLanguages;
function conversationTypeString(conversationType) {
    var key;
    switch (conversationType) {
        case "0" /* ConversationType.NEW */:
            key = "newMail_action";
            break;
        case "1" /* ConversationType.REPLY */:
            key = "reply_action";
            break;
        case "2" /* ConversationType.FORWARD */:
            key = "forward_action";
            break;
        default:
            key = "emptyString_msg";
    }
    return LanguageViewModel_1.lang.get(key);
}
exports.conversationTypeString = conversationTypeString;
function getExistingRuleForType(props, cleanValue, type) {
    var _a;
    return (_a = props.inboxRules.find(function (rule) { return type === rule.type && cleanValue === rule.value; })) !== null && _a !== void 0 ? _a : null;
}
exports.getExistingRuleForType = getExistingRuleForType;
function canDoDragAndDropExport() {
    return (0, Env_1.isDesktop)();
}
exports.canDoDragAndDropExport = canDoDragAndDropExport;
/**
 * @param files the files that shall be attached.
 * @param maxAttachmentSize the maximum size the new files may have in total to be attached successfully.
 */
function checkAttachmentSize(files, maxAttachmentSize) {
    if (maxAttachmentSize === void 0) { maxAttachmentSize = TutanotaConstants_1.MAX_ATTACHMENT_SIZE; }
    var totalSize = 0;
    var attachableFiles = [];
    var tooBigFiles = [];
    files.forEach(function (file) {
        if (totalSize + Number(file.size) > maxAttachmentSize) {
            tooBigFiles.push(file.name);
        }
        else {
            totalSize += Number(file.size);
            attachableFiles.push(file);
        }
    });
    return {
        attachableFiles: attachableFiles,
        tooBigFiles: tooBigFiles
    };
}
exports.checkAttachmentSize = checkAttachmentSize;
/**
 * @returns {boolean} true if the given mail was already replied to. Otherwise false.
 * Note that it also returns true if the mail was replied to AND forwarded.
 */
function isRepliedTo(mail) {
    return mail.replyType === "1" /* ReplyType.REPLY */ || mail.replyType === "3" /* ReplyType.REPLY_FORWARD */;
}
exports.isRepliedTo = isRepliedTo;
var RecipientField;
(function (RecipientField) {
    RecipientField["TO"] = "to";
    RecipientField["CC"] = "cc";
    RecipientField["BCC"] = "bcc";
})(RecipientField = exports.RecipientField || (exports.RecipientField = {}));
function getMoveTargetFolders(model, mails) {
    return __awaiter(this, void 0, void 0, function () {
        var firstMail, folders, filteredFolders, targetFolders;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    firstMail = (0, tutanota_utils_1.first)(mails);
                    if (firstMail == null)
                        return [2 /*return*/, []];
                    return [4 /*yield*/, model.getMailboxFolders(firstMail)];
                case 1:
                    folders = _a.sent();
                    filteredFolders = folders.filter(function (f) { return f.mails !== (0, EntityUtils_js_1.getListId)(firstMail); });
                    targetFolders = getSortedSystemFolders(filteredFolders).concat(getSortedCustomFolders(filteredFolders));
                    return [2 /*return*/, targetFolders.filter(function (f) { return allMailsAllowedInsideFolder([firstMail], f); })];
            }
        });
    });
}
exports.getMoveTargetFolders = getMoveTargetFolders;
