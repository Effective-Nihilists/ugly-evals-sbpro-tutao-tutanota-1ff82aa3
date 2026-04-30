"use strict";
exports.__esModule = true;
exports.createCreateFileData = exports.CreateFileDataTypeRef = exports.createCreateExternalUserGroupData = exports.CreateExternalUserGroupDataTypeRef = exports.createConversationEntry = exports.ConversationEntryTypeRef = exports.createContactSocialId = exports.ContactSocialIdTypeRef = exports.createContactPhoneNumber = exports.ContactPhoneNumberTypeRef = exports.createContactMailAddress = exports.ContactMailAddressTypeRef = exports.createContactList = exports.ContactListTypeRef = exports.createContactFormUserData = exports.ContactFormUserDataTypeRef = exports.createContactFormLanguage = exports.ContactFormLanguageTypeRef = exports.createContactFormAccountReturn = exports.ContactFormAccountReturnTypeRef = exports.createContactFormAccountData = exports.ContactFormAccountDataTypeRef = exports.createContactForm = exports.ContactFormTypeRef = exports.createContactAddress = exports.ContactAddressTypeRef = exports.createContact = exports.ContactTypeRef = exports.createCalendarRepeatRule = exports.CalendarRepeatRuleTypeRef = exports.createCalendarGroupRoot = exports.CalendarGroupRootTypeRef = exports.createCalendarEventUpdateList = exports.CalendarEventUpdateListTypeRef = exports.createCalendarEventUpdate = exports.CalendarEventUpdateTypeRef = exports.createCalendarEventUidIndex = exports.CalendarEventUidIndexTypeRef = exports.createCalendarEventIndexRef = exports.CalendarEventIndexRefTypeRef = exports.createCalendarEventAttendee = exports.CalendarEventAttendeeTypeRef = exports.createCalendarEvent = exports.CalendarEventTypeRef = exports.createCalendarDeleteData = exports.CalendarDeleteDataTypeRef = exports.createBirthday = exports.BirthdayTypeRef = exports.createAttachmentKeyData = exports.AttachmentKeyDataTypeRef = void 0;
exports.createEntropyData = exports.EntropyDataTypeRef = exports.createEncryptedMailAddress = exports.EncryptedMailAddressTypeRef = exports.createEncryptTutanotaPropertiesData = exports.EncryptTutanotaPropertiesDataTypeRef = exports.createEmailTemplateContent = exports.EmailTemplateContentTypeRef = exports.createEmailTemplate = exports.EmailTemplateTypeRef = exports.createDraftUpdateReturn = exports.DraftUpdateReturnTypeRef = exports.createDraftUpdateData = exports.DraftUpdateDataTypeRef = exports.createDraftRecipient = exports.DraftRecipientTypeRef = exports.createDraftData = exports.DraftDataTypeRef = exports.createDraftCreateReturn = exports.DraftCreateReturnTypeRef = exports.createDraftCreateData = exports.DraftCreateDataTypeRef = exports.createDraftAttachment = exports.DraftAttachmentTypeRef = exports.createDeleteMailFolderData = exports.DeleteMailFolderDataTypeRef = exports.createDeleteMailData = exports.DeleteMailDataTypeRef = exports.createDeleteGroupData = exports.DeleteGroupDataTypeRef = exports.createDeleteContactFormConversationIndexEntry = exports.DeleteContactFormConversationIndexEntryTypeRef = exports.createDeleteContactFormConversationIndex = exports.DeleteContactFormConversationIndexTypeRef = exports.createDataBlock = exports.DataBlockTypeRef = exports.createCustomerContactFormGroupRoot = exports.CustomerContactFormGroupRootTypeRef = exports.createCustomerAccountCreateData = exports.CustomerAccountCreateDataTypeRef = exports.createCreateMailGroupData = exports.CreateMailGroupDataTypeRef = exports.createCreateMailFolderReturn = exports.CreateMailFolderReturnTypeRef = exports.createCreateMailFolderData = exports.CreateMailFolderDataTypeRef = exports.createCreateLocalAdminGroupData = exports.CreateLocalAdminGroupDataTypeRef = exports.createCreateGroupPostReturn = exports.CreateGroupPostReturnTypeRef = void 0;
exports.createMailBody = exports.MailBodyTypeRef = exports.createMailAddress = exports.MailAddressTypeRef = exports.createMail = exports.MailTypeRef = exports.createListUnsubscribeData = exports.ListUnsubscribeDataTypeRef = exports.createKnowledgeBaseEntryKeyword = exports.KnowledgeBaseEntryKeywordTypeRef = exports.createKnowledgeBaseEntry = exports.KnowledgeBaseEntryTypeRef = exports.createInternalRecipientKeyData = exports.InternalRecipientKeyDataTypeRef = exports.createInternalGroupData = exports.InternalGroupDataTypeRef = exports.createInboxRule = exports.InboxRuleTypeRef = exports.createImapSyncState = exports.ImapSyncStateTypeRef = exports.createImapSyncConfiguration = exports.ImapSyncConfigurationTypeRef = exports.createImapFolder = exports.ImapFolderTypeRef = exports.createGroupSettings = exports.GroupSettingsTypeRef = exports.createGroupInvitationPutData = exports.GroupInvitationPutDataTypeRef = exports.createGroupInvitationPostReturn = exports.GroupInvitationPostReturnTypeRef = exports.createGroupInvitationPostData = exports.GroupInvitationPostDataTypeRef = exports.createGroupInvitationDeleteData = exports.GroupInvitationDeleteDataTypeRef = exports.createFileSystem = exports.FileSystemTypeRef = exports.createFileDataReturnPost = exports.FileDataReturnPostTypeRef = exports.createFileDataDataReturn = exports.FileDataDataReturnTypeRef = exports.createFileDataDataPost = exports.FileDataDataPostTypeRef = exports.createFileDataDataGet = exports.FileDataDataGetTypeRef = exports.createFileData = exports.FileDataTypeRef = exports.createFile = exports.FileTypeRef = exports.createExternalUserData = exports.ExternalUserDataTypeRef = void 0;
exports.createReceiveInfoServiceData = exports.ReceiveInfoServiceDataTypeRef = exports.createPhotosRef = exports.PhotosRefTypeRef = exports.createPhishingMarkerWebsocketData = exports.PhishingMarkerWebsocketDataTypeRef = exports.createPhishingMarker = exports.PhishingMarkerTypeRef = exports.createPasswordRetrievalReturn = exports.PasswordRetrievalReturnTypeRef = exports.createPasswordRetrievalData = exports.PasswordRetrievalDataTypeRef = exports.createPasswordMessagingReturn = exports.PasswordMessagingReturnTypeRef = exports.createPasswordMessagingData = exports.PasswordMessagingDataTypeRef = exports.createPasswordChannelReturn = exports.PasswordChannelReturnTypeRef = exports.createPasswordChannelPhoneNumber = exports.PasswordChannelPhoneNumberTypeRef = exports.createPasswordAutoAuthenticationReturn = exports.PasswordAutoAuthenticationReturnTypeRef = exports.createOutOfOfficeNotificationRecipientList = exports.OutOfOfficeNotificationRecipientListTypeRef = exports.createOutOfOfficeNotificationMessage = exports.OutOfOfficeNotificationMessageTypeRef = exports.createOutOfOfficeNotification = exports.OutOfOfficeNotificationTypeRef = exports.createNotificationMail = exports.NotificationMailTypeRef = exports.createNewDraftAttachment = exports.NewDraftAttachmentTypeRef = exports.createMoveMailData = exports.MoveMailDataTypeRef = exports.createMailboxServerProperties = exports.MailboxServerPropertiesTypeRef = exports.createMailboxProperties = exports.MailboxPropertiesTypeRef = exports.createMailboxGroupRoot = exports.MailboxGroupRootTypeRef = exports.createMailRestriction = exports.MailRestrictionTypeRef = exports.createMailHeaders = exports.MailHeadersTypeRef = exports.createMailFolderRef = exports.MailFolderRefTypeRef = exports.createMailFolder = exports.MailFolderTypeRef = exports.createMailBox = exports.MailBoxTypeRef = void 0;
exports.createUserSettingsGroupRoot = exports.UserSettingsGroupRootTypeRef = exports.createUserAreaGroupPostData = exports.UserAreaGroupPostDataTypeRef = exports.createUserAreaGroupDeleteData = exports.UserAreaGroupDeleteDataTypeRef = exports.createUserAreaGroupData = exports.UserAreaGroupDataTypeRef = exports.createUserAccountUserData = exports.UserAccountUserDataTypeRef = exports.createUserAccountCreateData = exports.UserAccountCreateDataTypeRef = exports.createTutanotaProperties = exports.TutanotaPropertiesTypeRef = exports.createTemplateGroupRoot = exports.TemplateGroupRootTypeRef = exports.createSubfiles = exports.SubfilesTypeRef = exports.createSpamResults = exports.SpamResultsTypeRef = exports.createSharedGroupData = exports.SharedGroupDataTypeRef = exports.createSendDraftReturn = exports.SendDraftReturnTypeRef = exports.createSendDraftData = exports.SendDraftDataTypeRef = exports.createSecureExternalRecipientKeyData = exports.SecureExternalRecipientKeyDataTypeRef = exports.createReportMailPostData = exports.ReportMailPostDataTypeRef = exports.createRemoteImapSyncInfo = exports.RemoteImapSyncInfoTypeRef = void 0;
var EntityUtils_js_1 = require("../../common/utils/EntityUtils.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var TypeModels_js_1 = require("./TypeModels.js");
exports.AttachmentKeyDataTypeRef = new tutanota_utils_1.TypeRef("tutanota", "AttachmentKeyData");
function createAttachmentKeyData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.AttachmentKeyData, exports.AttachmentKeyDataTypeRef), values);
}
exports.createAttachmentKeyData = createAttachmentKeyData;
exports.BirthdayTypeRef = new tutanota_utils_1.TypeRef("tutanota", "Birthday");
function createBirthday(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.Birthday, exports.BirthdayTypeRef), values);
}
exports.createBirthday = createBirthday;
exports.CalendarDeleteDataTypeRef = new tutanota_utils_1.TypeRef("tutanota", "CalendarDeleteData");
function createCalendarDeleteData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.CalendarDeleteData, exports.CalendarDeleteDataTypeRef), values);
}
exports.createCalendarDeleteData = createCalendarDeleteData;
exports.CalendarEventTypeRef = new tutanota_utils_1.TypeRef("tutanota", "CalendarEvent");
function createCalendarEvent(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.CalendarEvent, exports.CalendarEventTypeRef), values);
}
exports.createCalendarEvent = createCalendarEvent;
exports.CalendarEventAttendeeTypeRef = new tutanota_utils_1.TypeRef("tutanota", "CalendarEventAttendee");
function createCalendarEventAttendee(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.CalendarEventAttendee, exports.CalendarEventAttendeeTypeRef), values);
}
exports.createCalendarEventAttendee = createCalendarEventAttendee;
exports.CalendarEventIndexRefTypeRef = new tutanota_utils_1.TypeRef("tutanota", "CalendarEventIndexRef");
function createCalendarEventIndexRef(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.CalendarEventIndexRef, exports.CalendarEventIndexRefTypeRef), values);
}
exports.createCalendarEventIndexRef = createCalendarEventIndexRef;
exports.CalendarEventUidIndexTypeRef = new tutanota_utils_1.TypeRef("tutanota", "CalendarEventUidIndex");
function createCalendarEventUidIndex(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.CalendarEventUidIndex, exports.CalendarEventUidIndexTypeRef), values);
}
exports.createCalendarEventUidIndex = createCalendarEventUidIndex;
exports.CalendarEventUpdateTypeRef = new tutanota_utils_1.TypeRef("tutanota", "CalendarEventUpdate");
function createCalendarEventUpdate(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.CalendarEventUpdate, exports.CalendarEventUpdateTypeRef), values);
}
exports.createCalendarEventUpdate = createCalendarEventUpdate;
exports.CalendarEventUpdateListTypeRef = new tutanota_utils_1.TypeRef("tutanota", "CalendarEventUpdateList");
function createCalendarEventUpdateList(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.CalendarEventUpdateList, exports.CalendarEventUpdateListTypeRef), values);
}
exports.createCalendarEventUpdateList = createCalendarEventUpdateList;
exports.CalendarGroupRootTypeRef = new tutanota_utils_1.TypeRef("tutanota", "CalendarGroupRoot");
function createCalendarGroupRoot(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.CalendarGroupRoot, exports.CalendarGroupRootTypeRef), values);
}
exports.createCalendarGroupRoot = createCalendarGroupRoot;
exports.CalendarRepeatRuleTypeRef = new tutanota_utils_1.TypeRef("tutanota", "CalendarRepeatRule");
function createCalendarRepeatRule(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.CalendarRepeatRule, exports.CalendarRepeatRuleTypeRef), values);
}
exports.createCalendarRepeatRule = createCalendarRepeatRule;
exports.ContactTypeRef = new tutanota_utils_1.TypeRef("tutanota", "Contact");
function createContact(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.Contact, exports.ContactTypeRef), values);
}
exports.createContact = createContact;
exports.ContactAddressTypeRef = new tutanota_utils_1.TypeRef("tutanota", "ContactAddress");
function createContactAddress(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.ContactAddress, exports.ContactAddressTypeRef), values);
}
exports.createContactAddress = createContactAddress;
exports.ContactFormTypeRef = new tutanota_utils_1.TypeRef("tutanota", "ContactForm");
function createContactForm(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.ContactForm, exports.ContactFormTypeRef), values);
}
exports.createContactForm = createContactForm;
exports.ContactFormAccountDataTypeRef = new tutanota_utils_1.TypeRef("tutanota", "ContactFormAccountData");
function createContactFormAccountData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.ContactFormAccountData, exports.ContactFormAccountDataTypeRef), values);
}
exports.createContactFormAccountData = createContactFormAccountData;
exports.ContactFormAccountReturnTypeRef = new tutanota_utils_1.TypeRef("tutanota", "ContactFormAccountReturn");
function createContactFormAccountReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.ContactFormAccountReturn, exports.ContactFormAccountReturnTypeRef), values);
}
exports.createContactFormAccountReturn = createContactFormAccountReturn;
exports.ContactFormLanguageTypeRef = new tutanota_utils_1.TypeRef("tutanota", "ContactFormLanguage");
function createContactFormLanguage(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.ContactFormLanguage, exports.ContactFormLanguageTypeRef), values);
}
exports.createContactFormLanguage = createContactFormLanguage;
exports.ContactFormUserDataTypeRef = new tutanota_utils_1.TypeRef("tutanota", "ContactFormUserData");
function createContactFormUserData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.ContactFormUserData, exports.ContactFormUserDataTypeRef), values);
}
exports.createContactFormUserData = createContactFormUserData;
exports.ContactListTypeRef = new tutanota_utils_1.TypeRef("tutanota", "ContactList");
function createContactList(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.ContactList, exports.ContactListTypeRef), values);
}
exports.createContactList = createContactList;
exports.ContactMailAddressTypeRef = new tutanota_utils_1.TypeRef("tutanota", "ContactMailAddress");
function createContactMailAddress(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.ContactMailAddress, exports.ContactMailAddressTypeRef), values);
}
exports.createContactMailAddress = createContactMailAddress;
exports.ContactPhoneNumberTypeRef = new tutanota_utils_1.TypeRef("tutanota", "ContactPhoneNumber");
function createContactPhoneNumber(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.ContactPhoneNumber, exports.ContactPhoneNumberTypeRef), values);
}
exports.createContactPhoneNumber = createContactPhoneNumber;
exports.ContactSocialIdTypeRef = new tutanota_utils_1.TypeRef("tutanota", "ContactSocialId");
function createContactSocialId(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.ContactSocialId, exports.ContactSocialIdTypeRef), values);
}
exports.createContactSocialId = createContactSocialId;
exports.ConversationEntryTypeRef = new tutanota_utils_1.TypeRef("tutanota", "ConversationEntry");
function createConversationEntry(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.ConversationEntry, exports.ConversationEntryTypeRef), values);
}
exports.createConversationEntry = createConversationEntry;
exports.CreateExternalUserGroupDataTypeRef = new tutanota_utils_1.TypeRef("tutanota", "CreateExternalUserGroupData");
function createCreateExternalUserGroupData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.CreateExternalUserGroupData, exports.CreateExternalUserGroupDataTypeRef), values);
}
exports.createCreateExternalUserGroupData = createCreateExternalUserGroupData;
exports.CreateFileDataTypeRef = new tutanota_utils_1.TypeRef("tutanota", "CreateFileData");
function createCreateFileData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.CreateFileData, exports.CreateFileDataTypeRef), values);
}
exports.createCreateFileData = createCreateFileData;
exports.CreateGroupPostReturnTypeRef = new tutanota_utils_1.TypeRef("tutanota", "CreateGroupPostReturn");
function createCreateGroupPostReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.CreateGroupPostReturn, exports.CreateGroupPostReturnTypeRef), values);
}
exports.createCreateGroupPostReturn = createCreateGroupPostReturn;
exports.CreateLocalAdminGroupDataTypeRef = new tutanota_utils_1.TypeRef("tutanota", "CreateLocalAdminGroupData");
function createCreateLocalAdminGroupData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.CreateLocalAdminGroupData, exports.CreateLocalAdminGroupDataTypeRef), values);
}
exports.createCreateLocalAdminGroupData = createCreateLocalAdminGroupData;
exports.CreateMailFolderDataTypeRef = new tutanota_utils_1.TypeRef("tutanota", "CreateMailFolderData");
function createCreateMailFolderData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.CreateMailFolderData, exports.CreateMailFolderDataTypeRef), values);
}
exports.createCreateMailFolderData = createCreateMailFolderData;
exports.CreateMailFolderReturnTypeRef = new tutanota_utils_1.TypeRef("tutanota", "CreateMailFolderReturn");
function createCreateMailFolderReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.CreateMailFolderReturn, exports.CreateMailFolderReturnTypeRef), values);
}
exports.createCreateMailFolderReturn = createCreateMailFolderReturn;
exports.CreateMailGroupDataTypeRef = new tutanota_utils_1.TypeRef("tutanota", "CreateMailGroupData");
function createCreateMailGroupData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.CreateMailGroupData, exports.CreateMailGroupDataTypeRef), values);
}
exports.createCreateMailGroupData = createCreateMailGroupData;
exports.CustomerAccountCreateDataTypeRef = new tutanota_utils_1.TypeRef("tutanota", "CustomerAccountCreateData");
function createCustomerAccountCreateData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.CustomerAccountCreateData, exports.CustomerAccountCreateDataTypeRef), values);
}
exports.createCustomerAccountCreateData = createCustomerAccountCreateData;
exports.CustomerContactFormGroupRootTypeRef = new tutanota_utils_1.TypeRef("tutanota", "CustomerContactFormGroupRoot");
function createCustomerContactFormGroupRoot(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.CustomerContactFormGroupRoot, exports.CustomerContactFormGroupRootTypeRef), values);
}
exports.createCustomerContactFormGroupRoot = createCustomerContactFormGroupRoot;
exports.DataBlockTypeRef = new tutanota_utils_1.TypeRef("tutanota", "DataBlock");
function createDataBlock(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.DataBlock, exports.DataBlockTypeRef), values);
}
exports.createDataBlock = createDataBlock;
exports.DeleteContactFormConversationIndexTypeRef = new tutanota_utils_1.TypeRef("tutanota", "DeleteContactFormConversationIndex");
function createDeleteContactFormConversationIndex(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.DeleteContactFormConversationIndex, exports.DeleteContactFormConversationIndexTypeRef), values);
}
exports.createDeleteContactFormConversationIndex = createDeleteContactFormConversationIndex;
exports.DeleteContactFormConversationIndexEntryTypeRef = new tutanota_utils_1.TypeRef("tutanota", "DeleteContactFormConversationIndexEntry");
function createDeleteContactFormConversationIndexEntry(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.DeleteContactFormConversationIndexEntry, exports.DeleteContactFormConversationIndexEntryTypeRef), values);
}
exports.createDeleteContactFormConversationIndexEntry = createDeleteContactFormConversationIndexEntry;
exports.DeleteGroupDataTypeRef = new tutanota_utils_1.TypeRef("tutanota", "DeleteGroupData");
function createDeleteGroupData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.DeleteGroupData, exports.DeleteGroupDataTypeRef), values);
}
exports.createDeleteGroupData = createDeleteGroupData;
exports.DeleteMailDataTypeRef = new tutanota_utils_1.TypeRef("tutanota", "DeleteMailData");
function createDeleteMailData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.DeleteMailData, exports.DeleteMailDataTypeRef), values);
}
exports.createDeleteMailData = createDeleteMailData;
exports.DeleteMailFolderDataTypeRef = new tutanota_utils_1.TypeRef("tutanota", "DeleteMailFolderData");
function createDeleteMailFolderData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.DeleteMailFolderData, exports.DeleteMailFolderDataTypeRef), values);
}
exports.createDeleteMailFolderData = createDeleteMailFolderData;
exports.DraftAttachmentTypeRef = new tutanota_utils_1.TypeRef("tutanota", "DraftAttachment");
function createDraftAttachment(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.DraftAttachment, exports.DraftAttachmentTypeRef), values);
}
exports.createDraftAttachment = createDraftAttachment;
exports.DraftCreateDataTypeRef = new tutanota_utils_1.TypeRef("tutanota", "DraftCreateData");
function createDraftCreateData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.DraftCreateData, exports.DraftCreateDataTypeRef), values);
}
exports.createDraftCreateData = createDraftCreateData;
exports.DraftCreateReturnTypeRef = new tutanota_utils_1.TypeRef("tutanota", "DraftCreateReturn");
function createDraftCreateReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.DraftCreateReturn, exports.DraftCreateReturnTypeRef), values);
}
exports.createDraftCreateReturn = createDraftCreateReturn;
exports.DraftDataTypeRef = new tutanota_utils_1.TypeRef("tutanota", "DraftData");
function createDraftData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.DraftData, exports.DraftDataTypeRef), values);
}
exports.createDraftData = createDraftData;
exports.DraftRecipientTypeRef = new tutanota_utils_1.TypeRef("tutanota", "DraftRecipient");
function createDraftRecipient(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.DraftRecipient, exports.DraftRecipientTypeRef), values);
}
exports.createDraftRecipient = createDraftRecipient;
exports.DraftUpdateDataTypeRef = new tutanota_utils_1.TypeRef("tutanota", "DraftUpdateData");
function createDraftUpdateData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.DraftUpdateData, exports.DraftUpdateDataTypeRef), values);
}
exports.createDraftUpdateData = createDraftUpdateData;
exports.DraftUpdateReturnTypeRef = new tutanota_utils_1.TypeRef("tutanota", "DraftUpdateReturn");
function createDraftUpdateReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.DraftUpdateReturn, exports.DraftUpdateReturnTypeRef), values);
}
exports.createDraftUpdateReturn = createDraftUpdateReturn;
exports.EmailTemplateTypeRef = new tutanota_utils_1.TypeRef("tutanota", "EmailTemplate");
function createEmailTemplate(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.EmailTemplate, exports.EmailTemplateTypeRef), values);
}
exports.createEmailTemplate = createEmailTemplate;
exports.EmailTemplateContentTypeRef = new tutanota_utils_1.TypeRef("tutanota", "EmailTemplateContent");
function createEmailTemplateContent(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.EmailTemplateContent, exports.EmailTemplateContentTypeRef), values);
}
exports.createEmailTemplateContent = createEmailTemplateContent;
exports.EncryptTutanotaPropertiesDataTypeRef = new tutanota_utils_1.TypeRef("tutanota", "EncryptTutanotaPropertiesData");
function createEncryptTutanotaPropertiesData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.EncryptTutanotaPropertiesData, exports.EncryptTutanotaPropertiesDataTypeRef), values);
}
exports.createEncryptTutanotaPropertiesData = createEncryptTutanotaPropertiesData;
exports.EncryptedMailAddressTypeRef = new tutanota_utils_1.TypeRef("tutanota", "EncryptedMailAddress");
function createEncryptedMailAddress(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.EncryptedMailAddress, exports.EncryptedMailAddressTypeRef), values);
}
exports.createEncryptedMailAddress = createEncryptedMailAddress;
exports.EntropyDataTypeRef = new tutanota_utils_1.TypeRef("tutanota", "EntropyData");
function createEntropyData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.EntropyData, exports.EntropyDataTypeRef), values);
}
exports.createEntropyData = createEntropyData;
exports.ExternalUserDataTypeRef = new tutanota_utils_1.TypeRef("tutanota", "ExternalUserData");
function createExternalUserData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.ExternalUserData, exports.ExternalUserDataTypeRef), values);
}
exports.createExternalUserData = createExternalUserData;
exports.FileTypeRef = new tutanota_utils_1.TypeRef("tutanota", "File");
function createFile(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.File, exports.FileTypeRef), values);
}
exports.createFile = createFile;
exports.FileDataTypeRef = new tutanota_utils_1.TypeRef("tutanota", "FileData");
function createFileData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.FileData, exports.FileDataTypeRef), values);
}
exports.createFileData = createFileData;
exports.FileDataDataGetTypeRef = new tutanota_utils_1.TypeRef("tutanota", "FileDataDataGet");
function createFileDataDataGet(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.FileDataDataGet, exports.FileDataDataGetTypeRef), values);
}
exports.createFileDataDataGet = createFileDataDataGet;
exports.FileDataDataPostTypeRef = new tutanota_utils_1.TypeRef("tutanota", "FileDataDataPost");
function createFileDataDataPost(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.FileDataDataPost, exports.FileDataDataPostTypeRef), values);
}
exports.createFileDataDataPost = createFileDataDataPost;
exports.FileDataDataReturnTypeRef = new tutanota_utils_1.TypeRef("tutanota", "FileDataDataReturn");
function createFileDataDataReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.FileDataDataReturn, exports.FileDataDataReturnTypeRef), values);
}
exports.createFileDataDataReturn = createFileDataDataReturn;
exports.FileDataReturnPostTypeRef = new tutanota_utils_1.TypeRef("tutanota", "FileDataReturnPost");
function createFileDataReturnPost(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.FileDataReturnPost, exports.FileDataReturnPostTypeRef), values);
}
exports.createFileDataReturnPost = createFileDataReturnPost;
exports.FileSystemTypeRef = new tutanota_utils_1.TypeRef("tutanota", "FileSystem");
function createFileSystem(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.FileSystem, exports.FileSystemTypeRef), values);
}
exports.createFileSystem = createFileSystem;
exports.GroupInvitationDeleteDataTypeRef = new tutanota_utils_1.TypeRef("tutanota", "GroupInvitationDeleteData");
function createGroupInvitationDeleteData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.GroupInvitationDeleteData, exports.GroupInvitationDeleteDataTypeRef), values);
}
exports.createGroupInvitationDeleteData = createGroupInvitationDeleteData;
exports.GroupInvitationPostDataTypeRef = new tutanota_utils_1.TypeRef("tutanota", "GroupInvitationPostData");
function createGroupInvitationPostData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.GroupInvitationPostData, exports.GroupInvitationPostDataTypeRef), values);
}
exports.createGroupInvitationPostData = createGroupInvitationPostData;
exports.GroupInvitationPostReturnTypeRef = new tutanota_utils_1.TypeRef("tutanota", "GroupInvitationPostReturn");
function createGroupInvitationPostReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.GroupInvitationPostReturn, exports.GroupInvitationPostReturnTypeRef), values);
}
exports.createGroupInvitationPostReturn = createGroupInvitationPostReturn;
exports.GroupInvitationPutDataTypeRef = new tutanota_utils_1.TypeRef("tutanota", "GroupInvitationPutData");
function createGroupInvitationPutData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.GroupInvitationPutData, exports.GroupInvitationPutDataTypeRef), values);
}
exports.createGroupInvitationPutData = createGroupInvitationPutData;
exports.GroupSettingsTypeRef = new tutanota_utils_1.TypeRef("tutanota", "GroupSettings");
function createGroupSettings(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.GroupSettings, exports.GroupSettingsTypeRef), values);
}
exports.createGroupSettings = createGroupSettings;
exports.ImapFolderTypeRef = new tutanota_utils_1.TypeRef("tutanota", "ImapFolder");
function createImapFolder(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.ImapFolder, exports.ImapFolderTypeRef), values);
}
exports.createImapFolder = createImapFolder;
exports.ImapSyncConfigurationTypeRef = new tutanota_utils_1.TypeRef("tutanota", "ImapSyncConfiguration");
function createImapSyncConfiguration(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.ImapSyncConfiguration, exports.ImapSyncConfigurationTypeRef), values);
}
exports.createImapSyncConfiguration = createImapSyncConfiguration;
exports.ImapSyncStateTypeRef = new tutanota_utils_1.TypeRef("tutanota", "ImapSyncState");
function createImapSyncState(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.ImapSyncState, exports.ImapSyncStateTypeRef), values);
}
exports.createImapSyncState = createImapSyncState;
exports.InboxRuleTypeRef = new tutanota_utils_1.TypeRef("tutanota", "InboxRule");
function createInboxRule(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.InboxRule, exports.InboxRuleTypeRef), values);
}
exports.createInboxRule = createInboxRule;
exports.InternalGroupDataTypeRef = new tutanota_utils_1.TypeRef("tutanota", "InternalGroupData");
function createInternalGroupData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.InternalGroupData, exports.InternalGroupDataTypeRef), values);
}
exports.createInternalGroupData = createInternalGroupData;
exports.InternalRecipientKeyDataTypeRef = new tutanota_utils_1.TypeRef("tutanota", "InternalRecipientKeyData");
function createInternalRecipientKeyData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.InternalRecipientKeyData, exports.InternalRecipientKeyDataTypeRef), values);
}
exports.createInternalRecipientKeyData = createInternalRecipientKeyData;
exports.KnowledgeBaseEntryTypeRef = new tutanota_utils_1.TypeRef("tutanota", "KnowledgeBaseEntry");
function createKnowledgeBaseEntry(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.KnowledgeBaseEntry, exports.KnowledgeBaseEntryTypeRef), values);
}
exports.createKnowledgeBaseEntry = createKnowledgeBaseEntry;
exports.KnowledgeBaseEntryKeywordTypeRef = new tutanota_utils_1.TypeRef("tutanota", "KnowledgeBaseEntryKeyword");
function createKnowledgeBaseEntryKeyword(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.KnowledgeBaseEntryKeyword, exports.KnowledgeBaseEntryKeywordTypeRef), values);
}
exports.createKnowledgeBaseEntryKeyword = createKnowledgeBaseEntryKeyword;
exports.ListUnsubscribeDataTypeRef = new tutanota_utils_1.TypeRef("tutanota", "ListUnsubscribeData");
function createListUnsubscribeData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.ListUnsubscribeData, exports.ListUnsubscribeDataTypeRef), values);
}
exports.createListUnsubscribeData = createListUnsubscribeData;
exports.MailTypeRef = new tutanota_utils_1.TypeRef("tutanota", "Mail");
function createMail(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.Mail, exports.MailTypeRef), values);
}
exports.createMail = createMail;
exports.MailAddressTypeRef = new tutanota_utils_1.TypeRef("tutanota", "MailAddress");
function createMailAddress(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.MailAddress, exports.MailAddressTypeRef), values);
}
exports.createMailAddress = createMailAddress;
exports.MailBodyTypeRef = new tutanota_utils_1.TypeRef("tutanota", "MailBody");
function createMailBody(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.MailBody, exports.MailBodyTypeRef), values);
}
exports.createMailBody = createMailBody;
exports.MailBoxTypeRef = new tutanota_utils_1.TypeRef("tutanota", "MailBox");
function createMailBox(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.MailBox, exports.MailBoxTypeRef), values);
}
exports.createMailBox = createMailBox;
exports.MailFolderTypeRef = new tutanota_utils_1.TypeRef("tutanota", "MailFolder");
function createMailFolder(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.MailFolder, exports.MailFolderTypeRef), values);
}
exports.createMailFolder = createMailFolder;
exports.MailFolderRefTypeRef = new tutanota_utils_1.TypeRef("tutanota", "MailFolderRef");
function createMailFolderRef(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.MailFolderRef, exports.MailFolderRefTypeRef), values);
}
exports.createMailFolderRef = createMailFolderRef;
exports.MailHeadersTypeRef = new tutanota_utils_1.TypeRef("tutanota", "MailHeaders");
function createMailHeaders(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.MailHeaders, exports.MailHeadersTypeRef), values);
}
exports.createMailHeaders = createMailHeaders;
exports.MailRestrictionTypeRef = new tutanota_utils_1.TypeRef("tutanota", "MailRestriction");
function createMailRestriction(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.MailRestriction, exports.MailRestrictionTypeRef), values);
}
exports.createMailRestriction = createMailRestriction;
exports.MailboxGroupRootTypeRef = new tutanota_utils_1.TypeRef("tutanota", "MailboxGroupRoot");
function createMailboxGroupRoot(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.MailboxGroupRoot, exports.MailboxGroupRootTypeRef), values);
}
exports.createMailboxGroupRoot = createMailboxGroupRoot;
exports.MailboxPropertiesTypeRef = new tutanota_utils_1.TypeRef("tutanota", "MailboxProperties");
function createMailboxProperties(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.MailboxProperties, exports.MailboxPropertiesTypeRef), values);
}
exports.createMailboxProperties = createMailboxProperties;
exports.MailboxServerPropertiesTypeRef = new tutanota_utils_1.TypeRef("tutanota", "MailboxServerProperties");
function createMailboxServerProperties(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.MailboxServerProperties, exports.MailboxServerPropertiesTypeRef), values);
}
exports.createMailboxServerProperties = createMailboxServerProperties;
exports.MoveMailDataTypeRef = new tutanota_utils_1.TypeRef("tutanota", "MoveMailData");
function createMoveMailData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.MoveMailData, exports.MoveMailDataTypeRef), values);
}
exports.createMoveMailData = createMoveMailData;
exports.NewDraftAttachmentTypeRef = new tutanota_utils_1.TypeRef("tutanota", "NewDraftAttachment");
function createNewDraftAttachment(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.NewDraftAttachment, exports.NewDraftAttachmentTypeRef), values);
}
exports.createNewDraftAttachment = createNewDraftAttachment;
exports.NotificationMailTypeRef = new tutanota_utils_1.TypeRef("tutanota", "NotificationMail");
function createNotificationMail(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.NotificationMail, exports.NotificationMailTypeRef), values);
}
exports.createNotificationMail = createNotificationMail;
exports.OutOfOfficeNotificationTypeRef = new tutanota_utils_1.TypeRef("tutanota", "OutOfOfficeNotification");
function createOutOfOfficeNotification(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.OutOfOfficeNotification, exports.OutOfOfficeNotificationTypeRef), values);
}
exports.createOutOfOfficeNotification = createOutOfOfficeNotification;
exports.OutOfOfficeNotificationMessageTypeRef = new tutanota_utils_1.TypeRef("tutanota", "OutOfOfficeNotificationMessage");
function createOutOfOfficeNotificationMessage(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.OutOfOfficeNotificationMessage, exports.OutOfOfficeNotificationMessageTypeRef), values);
}
exports.createOutOfOfficeNotificationMessage = createOutOfOfficeNotificationMessage;
exports.OutOfOfficeNotificationRecipientListTypeRef = new tutanota_utils_1.TypeRef("tutanota", "OutOfOfficeNotificationRecipientList");
function createOutOfOfficeNotificationRecipientList(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.OutOfOfficeNotificationRecipientList, exports.OutOfOfficeNotificationRecipientListTypeRef), values);
}
exports.createOutOfOfficeNotificationRecipientList = createOutOfOfficeNotificationRecipientList;
exports.PasswordAutoAuthenticationReturnTypeRef = new tutanota_utils_1.TypeRef("tutanota", "PasswordAutoAuthenticationReturn");
function createPasswordAutoAuthenticationReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.PasswordAutoAuthenticationReturn, exports.PasswordAutoAuthenticationReturnTypeRef), values);
}
exports.createPasswordAutoAuthenticationReturn = createPasswordAutoAuthenticationReturn;
exports.PasswordChannelPhoneNumberTypeRef = new tutanota_utils_1.TypeRef("tutanota", "PasswordChannelPhoneNumber");
function createPasswordChannelPhoneNumber(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.PasswordChannelPhoneNumber, exports.PasswordChannelPhoneNumberTypeRef), values);
}
exports.createPasswordChannelPhoneNumber = createPasswordChannelPhoneNumber;
exports.PasswordChannelReturnTypeRef = new tutanota_utils_1.TypeRef("tutanota", "PasswordChannelReturn");
function createPasswordChannelReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.PasswordChannelReturn, exports.PasswordChannelReturnTypeRef), values);
}
exports.createPasswordChannelReturn = createPasswordChannelReturn;
exports.PasswordMessagingDataTypeRef = new tutanota_utils_1.TypeRef("tutanota", "PasswordMessagingData");
function createPasswordMessagingData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.PasswordMessagingData, exports.PasswordMessagingDataTypeRef), values);
}
exports.createPasswordMessagingData = createPasswordMessagingData;
exports.PasswordMessagingReturnTypeRef = new tutanota_utils_1.TypeRef("tutanota", "PasswordMessagingReturn");
function createPasswordMessagingReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.PasswordMessagingReturn, exports.PasswordMessagingReturnTypeRef), values);
}
exports.createPasswordMessagingReturn = createPasswordMessagingReturn;
exports.PasswordRetrievalDataTypeRef = new tutanota_utils_1.TypeRef("tutanota", "PasswordRetrievalData");
function createPasswordRetrievalData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.PasswordRetrievalData, exports.PasswordRetrievalDataTypeRef), values);
}
exports.createPasswordRetrievalData = createPasswordRetrievalData;
exports.PasswordRetrievalReturnTypeRef = new tutanota_utils_1.TypeRef("tutanota", "PasswordRetrievalReturn");
function createPasswordRetrievalReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.PasswordRetrievalReturn, exports.PasswordRetrievalReturnTypeRef), values);
}
exports.createPasswordRetrievalReturn = createPasswordRetrievalReturn;
exports.PhishingMarkerTypeRef = new tutanota_utils_1.TypeRef("tutanota", "PhishingMarker");
function createPhishingMarker(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.PhishingMarker, exports.PhishingMarkerTypeRef), values);
}
exports.createPhishingMarker = createPhishingMarker;
exports.PhishingMarkerWebsocketDataTypeRef = new tutanota_utils_1.TypeRef("tutanota", "PhishingMarkerWebsocketData");
function createPhishingMarkerWebsocketData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.PhishingMarkerWebsocketData, exports.PhishingMarkerWebsocketDataTypeRef), values);
}
exports.createPhishingMarkerWebsocketData = createPhishingMarkerWebsocketData;
exports.PhotosRefTypeRef = new tutanota_utils_1.TypeRef("tutanota", "PhotosRef");
function createPhotosRef(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.PhotosRef, exports.PhotosRefTypeRef), values);
}
exports.createPhotosRef = createPhotosRef;
exports.ReceiveInfoServiceDataTypeRef = new tutanota_utils_1.TypeRef("tutanota", "ReceiveInfoServiceData");
function createReceiveInfoServiceData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.ReceiveInfoServiceData, exports.ReceiveInfoServiceDataTypeRef), values);
}
exports.createReceiveInfoServiceData = createReceiveInfoServiceData;
exports.RemoteImapSyncInfoTypeRef = new tutanota_utils_1.TypeRef("tutanota", "RemoteImapSyncInfo");
function createRemoteImapSyncInfo(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.RemoteImapSyncInfo, exports.RemoteImapSyncInfoTypeRef), values);
}
exports.createRemoteImapSyncInfo = createRemoteImapSyncInfo;
exports.ReportMailPostDataTypeRef = new tutanota_utils_1.TypeRef("tutanota", "ReportMailPostData");
function createReportMailPostData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.ReportMailPostData, exports.ReportMailPostDataTypeRef), values);
}
exports.createReportMailPostData = createReportMailPostData;
exports.SecureExternalRecipientKeyDataTypeRef = new tutanota_utils_1.TypeRef("tutanota", "SecureExternalRecipientKeyData");
function createSecureExternalRecipientKeyData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.SecureExternalRecipientKeyData, exports.SecureExternalRecipientKeyDataTypeRef), values);
}
exports.createSecureExternalRecipientKeyData = createSecureExternalRecipientKeyData;
exports.SendDraftDataTypeRef = new tutanota_utils_1.TypeRef("tutanota", "SendDraftData");
function createSendDraftData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.SendDraftData, exports.SendDraftDataTypeRef), values);
}
exports.createSendDraftData = createSendDraftData;
exports.SendDraftReturnTypeRef = new tutanota_utils_1.TypeRef("tutanota", "SendDraftReturn");
function createSendDraftReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.SendDraftReturn, exports.SendDraftReturnTypeRef), values);
}
exports.createSendDraftReturn = createSendDraftReturn;
exports.SharedGroupDataTypeRef = new tutanota_utils_1.TypeRef("tutanota", "SharedGroupData");
function createSharedGroupData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.SharedGroupData, exports.SharedGroupDataTypeRef), values);
}
exports.createSharedGroupData = createSharedGroupData;
exports.SpamResultsTypeRef = new tutanota_utils_1.TypeRef("tutanota", "SpamResults");
function createSpamResults(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.SpamResults, exports.SpamResultsTypeRef), values);
}
exports.createSpamResults = createSpamResults;
exports.SubfilesTypeRef = new tutanota_utils_1.TypeRef("tutanota", "Subfiles");
function createSubfiles(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.Subfiles, exports.SubfilesTypeRef), values);
}
exports.createSubfiles = createSubfiles;
exports.TemplateGroupRootTypeRef = new tutanota_utils_1.TypeRef("tutanota", "TemplateGroupRoot");
function createTemplateGroupRoot(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.TemplateGroupRoot, exports.TemplateGroupRootTypeRef), values);
}
exports.createTemplateGroupRoot = createTemplateGroupRoot;
exports.TutanotaPropertiesTypeRef = new tutanota_utils_1.TypeRef("tutanota", "TutanotaProperties");
function createTutanotaProperties(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.TutanotaProperties, exports.TutanotaPropertiesTypeRef), values);
}
exports.createTutanotaProperties = createTutanotaProperties;
exports.UserAccountCreateDataTypeRef = new tutanota_utils_1.TypeRef("tutanota", "UserAccountCreateData");
function createUserAccountCreateData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.UserAccountCreateData, exports.UserAccountCreateDataTypeRef), values);
}
exports.createUserAccountCreateData = createUserAccountCreateData;
exports.UserAccountUserDataTypeRef = new tutanota_utils_1.TypeRef("tutanota", "UserAccountUserData");
function createUserAccountUserData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.UserAccountUserData, exports.UserAccountUserDataTypeRef), values);
}
exports.createUserAccountUserData = createUserAccountUserData;
exports.UserAreaGroupDataTypeRef = new tutanota_utils_1.TypeRef("tutanota", "UserAreaGroupData");
function createUserAreaGroupData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.UserAreaGroupData, exports.UserAreaGroupDataTypeRef), values);
}
exports.createUserAreaGroupData = createUserAreaGroupData;
exports.UserAreaGroupDeleteDataTypeRef = new tutanota_utils_1.TypeRef("tutanota", "UserAreaGroupDeleteData");
function createUserAreaGroupDeleteData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.UserAreaGroupDeleteData, exports.UserAreaGroupDeleteDataTypeRef), values);
}
exports.createUserAreaGroupDeleteData = createUserAreaGroupDeleteData;
exports.UserAreaGroupPostDataTypeRef = new tutanota_utils_1.TypeRef("tutanota", "UserAreaGroupPostData");
function createUserAreaGroupPostData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.UserAreaGroupPostData, exports.UserAreaGroupPostDataTypeRef), values);
}
exports.createUserAreaGroupPostData = createUserAreaGroupPostData;
exports.UserSettingsGroupRootTypeRef = new tutanota_utils_1.TypeRef("tutanota", "UserSettingsGroupRoot");
function createUserSettingsGroupRoot(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.UserSettingsGroupRoot, exports.UserSettingsGroupRootTypeRef), values);
}
exports.createUserSettingsGroupRoot = createUserSettingsGroupRoot;
