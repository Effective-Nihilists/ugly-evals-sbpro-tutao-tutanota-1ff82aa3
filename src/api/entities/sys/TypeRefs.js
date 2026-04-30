"use strict";
exports.__esModule = true;
exports.createBraintree3ds2Response = exports.Braintree3ds2ResponseTypeRef = exports.createBraintree3ds2Request = exports.Braintree3ds2RequestTypeRef = exports.createBootstrapFeature = exports.BootstrapFeatureTypeRef = exports.createBookingsRef = exports.BookingsRefTypeRef = exports.createBookingServiceData = exports.BookingServiceDataTypeRef = exports.createBookingItem = exports.BookingItemTypeRef = exports.createBooking = exports.BookingTypeRef = exports.createBlobReferenceTokenWrapper = exports.BlobReferenceTokenWrapperTypeRef = exports.createBlob = exports.BlobTypeRef = exports.createAutoLoginPostReturn = exports.AutoLoginPostReturnTypeRef = exports.createAutoLoginDataReturn = exports.AutoLoginDataReturnTypeRef = exports.createAutoLoginDataGet = exports.AutoLoginDataGetTypeRef = exports.createAutoLoginDataDelete = exports.AutoLoginDataDeleteTypeRef = exports.createAuthentication = exports.AuthenticationTypeRef = exports.createAuthenticatedDevice = exports.AuthenticatedDeviceTypeRef = exports.createAuditLogRef = exports.AuditLogRefTypeRef = exports.createAuditLogEntry = exports.AuditLogEntryTypeRef = exports.createArchiveType = exports.ArchiveTypeTypeRef = exports.createArchiveRef = exports.ArchiveRefTypeRef = exports.createAlarmServicePost = exports.AlarmServicePostTypeRef = exports.createAlarmNotification = exports.AlarmNotificationTypeRef = exports.createAlarmInfo = exports.AlarmInfoTypeRef = exports.createAdministratedGroupsRef = exports.AdministratedGroupsRefTypeRef = exports.createAdministratedGroup = exports.AdministratedGroupTypeRef = exports.createAccountingInfo = exports.AccountingInfoTypeRef = void 0;
exports.createCustomerAccountTerminationPostOut = exports.CustomerAccountTerminationPostOutTypeRef = exports.createCustomerAccountTerminationPostIn = exports.CustomerAccountTerminationPostInTypeRef = exports.createCustomer = exports.CustomerTypeRef = exports.createCustomDomainReturn = exports.CustomDomainReturnTypeRef = exports.createCustomDomainData = exports.CustomDomainDataTypeRef = exports.createCustomDomainCheckReturn = exports.CustomDomainCheckReturnTypeRef = exports.createCustomDomainCheckData = exports.CustomDomainCheckDataTypeRef = exports.createCreditCard = exports.CreditCardTypeRef = exports.createCreateSessionReturn = exports.CreateSessionReturnTypeRef = exports.createCreateSessionData = exports.CreateSessionDataTypeRef = exports.createCreateGroupListData = exports.CreateGroupListDataTypeRef = exports.createCreateGroupData = exports.CreateGroupDataTypeRef = exports.createCreateCustomerServerPropertiesReturn = exports.CreateCustomerServerPropertiesReturnTypeRef = exports.createCreateCustomerServerPropertiesData = exports.CreateCustomerServerPropertiesDataTypeRef = exports.createCloseSessionServicePost = exports.CloseSessionServicePostTypeRef = exports.createChat = exports.ChatTypeRef = exports.createChangePasswordData = exports.ChangePasswordDataTypeRef = exports.createChallenge = exports.ChallengeTypeRef = exports.createCertificateInfo = exports.CertificateInfoTypeRef = exports.createCalendarEventRef = exports.CalendarEventRefTypeRef = exports.createBucketPermission = exports.BucketPermissionTypeRef = exports.createBucket = exports.BucketTypeRef = exports.createBrandingDomainGetReturn = exports.BrandingDomainGetReturnTypeRef = exports.createBrandingDomainDeleteData = exports.BrandingDomainDeleteDataTypeRef = exports.createBrandingDomainData = exports.BrandingDomainDataTypeRef = void 0;
exports.createGiftCardCreateData = exports.GiftCardCreateDataTypeRef = exports.createGiftCard = exports.GiftCardTypeRef = exports.createGeneratedIdWrapper = exports.GeneratedIdWrapperTypeRef = exports.createFile = exports.FileTypeRef = exports.createFeature = exports.FeatureTypeRef = exports.createExternalUserReference = exports.ExternalUserReferenceTypeRef = exports.createExternalPropertiesReturn = exports.ExternalPropertiesReturnTypeRef = exports.createException = exports.ExceptionTypeRef = exports.createEntityUpdate = exports.EntityUpdateTypeRef = exports.createEntityEventBatch = exports.EntityEventBatchTypeRef = exports.createEmailSenderListElement = exports.EmailSenderListElementTypeRef = exports.createDomainsRef = exports.DomainsRefTypeRef = exports.createDomainMailAddressAvailabilityReturn = exports.DomainMailAddressAvailabilityReturnTypeRef = exports.createDomainMailAddressAvailabilityData = exports.DomainMailAddressAvailabilityDataTypeRef = exports.createDomainInfo = exports.DomainInfoTypeRef = exports.createDnsRecord = exports.DnsRecordTypeRef = exports.createDeleteCustomerData = exports.DeleteCustomerDataTypeRef = exports.createDebitServicePutData = exports.DebitServicePutDataTypeRef = exports.createCustomerServerProperties = exports.CustomerServerPropertiesTypeRef = exports.createCustomerReturn = exports.CustomerReturnTypeRef = exports.createCustomerProperties = exports.CustomerPropertiesTypeRef = exports.createCustomerInfoReturn = exports.CustomerInfoReturnTypeRef = exports.createCustomerInfo = exports.CustomerInfoTypeRef = exports.createCustomerData = exports.CustomerDataTypeRef = exports.createCustomerAccountTerminationRequest = exports.CustomerAccountTerminationRequestTypeRef = void 0;
exports.createMailAddressToGroup = exports.MailAddressToGroupTypeRef = exports.createMailAddressAvailabilityReturn = exports.MailAddressAvailabilityReturnTypeRef = exports.createMailAddressAvailabilityData = exports.MailAddressAvailabilityDataTypeRef = exports.createMailAddressAliasServiceReturn = exports.MailAddressAliasServiceReturnTypeRef = exports.createMailAddressAliasServiceDataDelete = exports.MailAddressAliasServiceDataDeleteTypeRef = exports.createMailAddressAliasServiceData = exports.MailAddressAliasServiceDataTypeRef = exports.createMailAddressAlias = exports.MailAddressAliasTypeRef = exports.createLogin = exports.LoginTypeRef = exports.createLocationServiceGetReturn = exports.LocationServiceGetReturnTypeRef = exports.createKeyPair = exports.KeyPairTypeRef = exports.createInvoiceItem = exports.InvoiceItemTypeRef = exports.createInvoiceInfo = exports.InvoiceInfoTypeRef = exports.createInvoice = exports.InvoiceTypeRef = exports.createGroupRoot = exports.GroupRootTypeRef = exports.createGroupMembership = exports.GroupMembershipTypeRef = exports.createGroupMember = exports.GroupMemberTypeRef = exports.createGroupInfo = exports.GroupInfoTypeRef = exports.createGroup = exports.GroupTypeRef = exports.createGiftCardsRef = exports.GiftCardsRefTypeRef = exports.createGiftCardRedeemGetReturn = exports.GiftCardRedeemGetReturnTypeRef = exports.createGiftCardRedeemData = exports.GiftCardRedeemDataTypeRef = exports.createGiftCardOption = exports.GiftCardOptionTypeRef = exports.createGiftCardGetReturn = exports.GiftCardGetReturnTypeRef = exports.createGiftCardDeleteData = exports.GiftCardDeleteDataTypeRef = exports.createGiftCardCreateReturn = exports.GiftCardCreateReturnTypeRef = void 0;
exports.createPriceServiceData = exports.PriceServiceDataTypeRef = exports.createPriceRequestData = exports.PriceRequestDataTypeRef = exports.createPriceItemData = exports.PriceItemDataTypeRef = exports.createPriceData = exports.PriceDataTypeRef = exports.createPremiumFeatureReturn = exports.PremiumFeatureReturnTypeRef = exports.createPremiumFeatureData = exports.PremiumFeatureDataTypeRef = exports.createPlanPrices = exports.PlanPricesTypeRef = exports.createPhoneNumber = exports.PhoneNumberTypeRef = exports.createPermission = exports.PermissionTypeRef = exports.createPdfInvoiceServiceReturn = exports.PdfInvoiceServiceReturnTypeRef = exports.createPdfInvoiceServiceData = exports.PdfInvoiceServiceDataTypeRef = exports.createPaymentErrorInfo = exports.PaymentErrorInfoTypeRef = exports.createPaymentDataServicePutReturn = exports.PaymentDataServicePutReturnTypeRef = exports.createPaymentDataServicePutData = exports.PaymentDataServicePutDataTypeRef = exports.createPaymentDataServicePostData = exports.PaymentDataServicePostDataTypeRef = exports.createPaymentDataServiceGetReturn = exports.PaymentDataServiceGetReturnTypeRef = exports.createPaymentDataServiceGetData = exports.PaymentDataServiceGetDataTypeRef = exports.createOtpChallenge = exports.OtpChallengeTypeRef = exports.createOrderProcessingAgreement = exports.OrderProcessingAgreementTypeRef = exports.createNotificationSessionKey = exports.NotificationSessionKeyTypeRef = exports.createNotificationMailTemplate = exports.NotificationMailTemplateTypeRef = exports.createNotificationInfo = exports.NotificationInfoTypeRef = exports.createMissedNotification = exports.MissedNotificationTypeRef = exports.createMembershipRemoveData = exports.MembershipRemoveDataTypeRef = exports.createMembershipAddData = exports.MembershipAddDataTypeRef = void 0;
exports.createSecondFactorAuthDeleteData = exports.SecondFactorAuthDeleteDataTypeRef = exports.createSecondFactorAuthData = exports.SecondFactorAuthDataTypeRef = exports.createSecondFactorAuthAllowedReturn = exports.SecondFactorAuthAllowedReturnTypeRef = exports.createSecondFactor = exports.SecondFactorTypeRef = exports.createSaltReturn = exports.SaltReturnTypeRef = exports.createSaltData = exports.SaltDataTypeRef = exports.createRootInstance = exports.RootInstanceTypeRef = exports.createResetPasswordData = exports.ResetPasswordDataTypeRef = exports.createResetFactorsDeleteData = exports.ResetFactorsDeleteDataTypeRef = exports.createRepeatRule = exports.RepeatRuleTypeRef = exports.createRejectedSendersRef = exports.RejectedSendersRefTypeRef = exports.createRejectedSender = exports.RejectedSenderTypeRef = exports.createRegistrationServiceData = exports.RegistrationServiceDataTypeRef = exports.createRegistrationReturn = exports.RegistrationReturnTypeRef = exports.createRegistrationConfigReturn = exports.RegistrationConfigReturnTypeRef = exports.createRegistrationCaptchaServiceReturn = exports.RegistrationCaptchaServiceReturnTypeRef = exports.createRegistrationCaptchaServiceGetData = exports.RegistrationCaptchaServiceGetDataTypeRef = exports.createRegistrationCaptchaServiceData = exports.RegistrationCaptchaServiceDataTypeRef = exports.createRecoverCode = exports.RecoverCodeTypeRef = exports.createReceivedGroupInvitation = exports.ReceivedGroupInvitationTypeRef = exports.createPushIdentifierList = exports.PushIdentifierListTypeRef = exports.createPushIdentifier = exports.PushIdentifierTypeRef = exports.createPublicKeyReturn = exports.PublicKeyReturnTypeRef = exports.createPublicKeyData = exports.PublicKeyDataTypeRef = exports.createPriceServiceReturn = exports.PriceServiceReturnTypeRef = void 0;
exports.createUserAlarmInfo = exports.UserAlarmInfoTypeRef = exports.createUser = exports.UserTypeRef = exports.createUpgradePriceServiceReturn = exports.UpgradePriceServiceReturnTypeRef = exports.createUpgradePriceServiceData = exports.UpgradePriceServiceDataTypeRef = exports.createUpdatePermissionKeyData = exports.UpdatePermissionKeyDataTypeRef = exports.createUpdateAdminshipData = exports.UpdateAdminshipDataTypeRef = exports.createU2fResponseData = exports.U2fResponseDataTypeRef = exports.createU2fRegisteredDevice = exports.U2fRegisteredDeviceTypeRef = exports.createU2fKey = exports.U2fKeyTypeRef = exports.createU2fChallenge = exports.U2fChallengeTypeRef = exports.createTypeInfo = exports.TypeInfoTypeRef = exports.createTakeOverDeletedAddressData = exports.TakeOverDeletedAddressDataTypeRef = exports.createSystemKeysReturn = exports.SystemKeysReturnTypeRef = exports.createSwitchAccountTypeData = exports.SwitchAccountTypeDataTypeRef = exports.createStringWrapper = exports.StringWrapperTypeRef = exports.createStringConfigValue = exports.StringConfigValueTypeRef = exports.createSseConnectData = exports.SseConnectDataTypeRef = exports.createSignOrderProcessingAgreementData = exports.SignOrderProcessingAgreementDataTypeRef = exports.createSession = exports.SessionTypeRef = exports.createSentGroupInvitation = exports.SentGroupInvitationTypeRef = exports.createSendRegistrationCodeReturn = exports.SendRegistrationCodeReturnTypeRef = exports.createSendRegistrationCodeData = exports.SendRegistrationCodeDataTypeRef = exports.createSecondFactorAuthentication = exports.SecondFactorAuthenticationTypeRef = exports.createSecondFactorAuthGetReturn = exports.SecondFactorAuthGetReturnTypeRef = exports.createSecondFactorAuthGetData = exports.SecondFactorAuthGetDataTypeRef = void 0;
exports.createWhitelabelParent = exports.WhitelabelParentTypeRef = exports.createWhitelabelConfig = exports.WhitelabelConfigTypeRef = exports.createWhitelabelChildrenRef = exports.WhitelabelChildrenRefTypeRef = exports.createWhitelabelChild = exports.WhitelabelChildTypeRef = exports.createWebsocketLeaderStatus = exports.WebsocketLeaderStatusTypeRef = exports.createWebsocketEntityData = exports.WebsocketEntityDataTypeRef = exports.createWebsocketCounterValue = exports.WebsocketCounterValueTypeRef = exports.createWebsocketCounterData = exports.WebsocketCounterDataTypeRef = exports.createWebauthnResponseData = exports.WebauthnResponseDataTypeRef = exports.createVersionReturn = exports.VersionReturnTypeRef = exports.createVersionInfo = exports.VersionInfoTypeRef = exports.createVersionData = exports.VersionDataTypeRef = exports.createVersion = exports.VersionTypeRef = exports.createVerifyRegistrationCodeData = exports.VerifyRegistrationCodeDataTypeRef = exports.createVariableExternalAuthInfo = exports.VariableExternalAuthInfoTypeRef = exports.createUserReturn = exports.UserReturnTypeRef = exports.createUserIdReturn = exports.UserIdReturnTypeRef = exports.createUserIdData = exports.UserIdDataTypeRef = exports.createUserGroupRoot = exports.UserGroupRootTypeRef = exports.createUserExternalAuthInfo = exports.UserExternalAuthInfoTypeRef = exports.createUserDataDelete = exports.UserDataDeleteTypeRef = exports.createUserData = exports.UserDataTypeRef = exports.createUserAuthentication = exports.UserAuthenticationTypeRef = exports.createUserAreaGroups = exports.UserAreaGroupsTypeRef = exports.createUserAlarmInfoListType = exports.UserAlarmInfoListTypeTypeRef = void 0;
var EntityUtils_js_1 = require("../../common/utils/EntityUtils.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var TypeModels_js_1 = require("./TypeModels.js");
exports.AccountingInfoTypeRef = new tutanota_utils_1.TypeRef("sys", "AccountingInfo");
function createAccountingInfo(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.AccountingInfo, exports.AccountingInfoTypeRef), values);
}
exports.createAccountingInfo = createAccountingInfo;
exports.AdministratedGroupTypeRef = new tutanota_utils_1.TypeRef("sys", "AdministratedGroup");
function createAdministratedGroup(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.AdministratedGroup, exports.AdministratedGroupTypeRef), values);
}
exports.createAdministratedGroup = createAdministratedGroup;
exports.AdministratedGroupsRefTypeRef = new tutanota_utils_1.TypeRef("sys", "AdministratedGroupsRef");
function createAdministratedGroupsRef(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.AdministratedGroupsRef, exports.AdministratedGroupsRefTypeRef), values);
}
exports.createAdministratedGroupsRef = createAdministratedGroupsRef;
exports.AlarmInfoTypeRef = new tutanota_utils_1.TypeRef("sys", "AlarmInfo");
function createAlarmInfo(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.AlarmInfo, exports.AlarmInfoTypeRef), values);
}
exports.createAlarmInfo = createAlarmInfo;
exports.AlarmNotificationTypeRef = new tutanota_utils_1.TypeRef("sys", "AlarmNotification");
function createAlarmNotification(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.AlarmNotification, exports.AlarmNotificationTypeRef), values);
}
exports.createAlarmNotification = createAlarmNotification;
exports.AlarmServicePostTypeRef = new tutanota_utils_1.TypeRef("sys", "AlarmServicePost");
function createAlarmServicePost(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.AlarmServicePost, exports.AlarmServicePostTypeRef), values);
}
exports.createAlarmServicePost = createAlarmServicePost;
exports.ArchiveRefTypeRef = new tutanota_utils_1.TypeRef("sys", "ArchiveRef");
function createArchiveRef(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.ArchiveRef, exports.ArchiveRefTypeRef), values);
}
exports.createArchiveRef = createArchiveRef;
exports.ArchiveTypeTypeRef = new tutanota_utils_1.TypeRef("sys", "ArchiveType");
function createArchiveType(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.ArchiveType, exports.ArchiveTypeTypeRef), values);
}
exports.createArchiveType = createArchiveType;
exports.AuditLogEntryTypeRef = new tutanota_utils_1.TypeRef("sys", "AuditLogEntry");
function createAuditLogEntry(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.AuditLogEntry, exports.AuditLogEntryTypeRef), values);
}
exports.createAuditLogEntry = createAuditLogEntry;
exports.AuditLogRefTypeRef = new tutanota_utils_1.TypeRef("sys", "AuditLogRef");
function createAuditLogRef(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.AuditLogRef, exports.AuditLogRefTypeRef), values);
}
exports.createAuditLogRef = createAuditLogRef;
exports.AuthenticatedDeviceTypeRef = new tutanota_utils_1.TypeRef("sys", "AuthenticatedDevice");
function createAuthenticatedDevice(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.AuthenticatedDevice, exports.AuthenticatedDeviceTypeRef), values);
}
exports.createAuthenticatedDevice = createAuthenticatedDevice;
exports.AuthenticationTypeRef = new tutanota_utils_1.TypeRef("sys", "Authentication");
function createAuthentication(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.Authentication, exports.AuthenticationTypeRef), values);
}
exports.createAuthentication = createAuthentication;
exports.AutoLoginDataDeleteTypeRef = new tutanota_utils_1.TypeRef("sys", "AutoLoginDataDelete");
function createAutoLoginDataDelete(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.AutoLoginDataDelete, exports.AutoLoginDataDeleteTypeRef), values);
}
exports.createAutoLoginDataDelete = createAutoLoginDataDelete;
exports.AutoLoginDataGetTypeRef = new tutanota_utils_1.TypeRef("sys", "AutoLoginDataGet");
function createAutoLoginDataGet(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.AutoLoginDataGet, exports.AutoLoginDataGetTypeRef), values);
}
exports.createAutoLoginDataGet = createAutoLoginDataGet;
exports.AutoLoginDataReturnTypeRef = new tutanota_utils_1.TypeRef("sys", "AutoLoginDataReturn");
function createAutoLoginDataReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.AutoLoginDataReturn, exports.AutoLoginDataReturnTypeRef), values);
}
exports.createAutoLoginDataReturn = createAutoLoginDataReturn;
exports.AutoLoginPostReturnTypeRef = new tutanota_utils_1.TypeRef("sys", "AutoLoginPostReturn");
function createAutoLoginPostReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.AutoLoginPostReturn, exports.AutoLoginPostReturnTypeRef), values);
}
exports.createAutoLoginPostReturn = createAutoLoginPostReturn;
exports.BlobTypeRef = new tutanota_utils_1.TypeRef("sys", "Blob");
function createBlob(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.Blob, exports.BlobTypeRef), values);
}
exports.createBlob = createBlob;
exports.BlobReferenceTokenWrapperTypeRef = new tutanota_utils_1.TypeRef("sys", "BlobReferenceTokenWrapper");
function createBlobReferenceTokenWrapper(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.BlobReferenceTokenWrapper, exports.BlobReferenceTokenWrapperTypeRef), values);
}
exports.createBlobReferenceTokenWrapper = createBlobReferenceTokenWrapper;
exports.BookingTypeRef = new tutanota_utils_1.TypeRef("sys", "Booking");
function createBooking(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.Booking, exports.BookingTypeRef), values);
}
exports.createBooking = createBooking;
exports.BookingItemTypeRef = new tutanota_utils_1.TypeRef("sys", "BookingItem");
function createBookingItem(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.BookingItem, exports.BookingItemTypeRef), values);
}
exports.createBookingItem = createBookingItem;
exports.BookingServiceDataTypeRef = new tutanota_utils_1.TypeRef("sys", "BookingServiceData");
function createBookingServiceData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.BookingServiceData, exports.BookingServiceDataTypeRef), values);
}
exports.createBookingServiceData = createBookingServiceData;
exports.BookingsRefTypeRef = new tutanota_utils_1.TypeRef("sys", "BookingsRef");
function createBookingsRef(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.BookingsRef, exports.BookingsRefTypeRef), values);
}
exports.createBookingsRef = createBookingsRef;
exports.BootstrapFeatureTypeRef = new tutanota_utils_1.TypeRef("sys", "BootstrapFeature");
function createBootstrapFeature(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.BootstrapFeature, exports.BootstrapFeatureTypeRef), values);
}
exports.createBootstrapFeature = createBootstrapFeature;
exports.Braintree3ds2RequestTypeRef = new tutanota_utils_1.TypeRef("sys", "Braintree3ds2Request");
function createBraintree3ds2Request(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.Braintree3ds2Request, exports.Braintree3ds2RequestTypeRef), values);
}
exports.createBraintree3ds2Request = createBraintree3ds2Request;
exports.Braintree3ds2ResponseTypeRef = new tutanota_utils_1.TypeRef("sys", "Braintree3ds2Response");
function createBraintree3ds2Response(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.Braintree3ds2Response, exports.Braintree3ds2ResponseTypeRef), values);
}
exports.createBraintree3ds2Response = createBraintree3ds2Response;
exports.BrandingDomainDataTypeRef = new tutanota_utils_1.TypeRef("sys", "BrandingDomainData");
function createBrandingDomainData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.BrandingDomainData, exports.BrandingDomainDataTypeRef), values);
}
exports.createBrandingDomainData = createBrandingDomainData;
exports.BrandingDomainDeleteDataTypeRef = new tutanota_utils_1.TypeRef("sys", "BrandingDomainDeleteData");
function createBrandingDomainDeleteData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.BrandingDomainDeleteData, exports.BrandingDomainDeleteDataTypeRef), values);
}
exports.createBrandingDomainDeleteData = createBrandingDomainDeleteData;
exports.BrandingDomainGetReturnTypeRef = new tutanota_utils_1.TypeRef("sys", "BrandingDomainGetReturn");
function createBrandingDomainGetReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.BrandingDomainGetReturn, exports.BrandingDomainGetReturnTypeRef), values);
}
exports.createBrandingDomainGetReturn = createBrandingDomainGetReturn;
exports.BucketTypeRef = new tutanota_utils_1.TypeRef("sys", "Bucket");
function createBucket(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.Bucket, exports.BucketTypeRef), values);
}
exports.createBucket = createBucket;
exports.BucketPermissionTypeRef = new tutanota_utils_1.TypeRef("sys", "BucketPermission");
function createBucketPermission(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.BucketPermission, exports.BucketPermissionTypeRef), values);
}
exports.createBucketPermission = createBucketPermission;
exports.CalendarEventRefTypeRef = new tutanota_utils_1.TypeRef("sys", "CalendarEventRef");
function createCalendarEventRef(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.CalendarEventRef, exports.CalendarEventRefTypeRef), values);
}
exports.createCalendarEventRef = createCalendarEventRef;
exports.CertificateInfoTypeRef = new tutanota_utils_1.TypeRef("sys", "CertificateInfo");
function createCertificateInfo(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.CertificateInfo, exports.CertificateInfoTypeRef), values);
}
exports.createCertificateInfo = createCertificateInfo;
exports.ChallengeTypeRef = new tutanota_utils_1.TypeRef("sys", "Challenge");
function createChallenge(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.Challenge, exports.ChallengeTypeRef), values);
}
exports.createChallenge = createChallenge;
exports.ChangePasswordDataTypeRef = new tutanota_utils_1.TypeRef("sys", "ChangePasswordData");
function createChangePasswordData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.ChangePasswordData, exports.ChangePasswordDataTypeRef), values);
}
exports.createChangePasswordData = createChangePasswordData;
exports.ChatTypeRef = new tutanota_utils_1.TypeRef("sys", "Chat");
function createChat(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.Chat, exports.ChatTypeRef), values);
}
exports.createChat = createChat;
exports.CloseSessionServicePostTypeRef = new tutanota_utils_1.TypeRef("sys", "CloseSessionServicePost");
function createCloseSessionServicePost(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.CloseSessionServicePost, exports.CloseSessionServicePostTypeRef), values);
}
exports.createCloseSessionServicePost = createCloseSessionServicePost;
exports.CreateCustomerServerPropertiesDataTypeRef = new tutanota_utils_1.TypeRef("sys", "CreateCustomerServerPropertiesData");
function createCreateCustomerServerPropertiesData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.CreateCustomerServerPropertiesData, exports.CreateCustomerServerPropertiesDataTypeRef), values);
}
exports.createCreateCustomerServerPropertiesData = createCreateCustomerServerPropertiesData;
exports.CreateCustomerServerPropertiesReturnTypeRef = new tutanota_utils_1.TypeRef("sys", "CreateCustomerServerPropertiesReturn");
function createCreateCustomerServerPropertiesReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.CreateCustomerServerPropertiesReturn, exports.CreateCustomerServerPropertiesReturnTypeRef), values);
}
exports.createCreateCustomerServerPropertiesReturn = createCreateCustomerServerPropertiesReturn;
exports.CreateGroupDataTypeRef = new tutanota_utils_1.TypeRef("sys", "CreateGroupData");
function createCreateGroupData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.CreateGroupData, exports.CreateGroupDataTypeRef), values);
}
exports.createCreateGroupData = createCreateGroupData;
exports.CreateGroupListDataTypeRef = new tutanota_utils_1.TypeRef("sys", "CreateGroupListData");
function createCreateGroupListData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.CreateGroupListData, exports.CreateGroupListDataTypeRef), values);
}
exports.createCreateGroupListData = createCreateGroupListData;
exports.CreateSessionDataTypeRef = new tutanota_utils_1.TypeRef("sys", "CreateSessionData");
function createCreateSessionData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.CreateSessionData, exports.CreateSessionDataTypeRef), values);
}
exports.createCreateSessionData = createCreateSessionData;
exports.CreateSessionReturnTypeRef = new tutanota_utils_1.TypeRef("sys", "CreateSessionReturn");
function createCreateSessionReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.CreateSessionReturn, exports.CreateSessionReturnTypeRef), values);
}
exports.createCreateSessionReturn = createCreateSessionReturn;
exports.CreditCardTypeRef = new tutanota_utils_1.TypeRef("sys", "CreditCard");
function createCreditCard(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.CreditCard, exports.CreditCardTypeRef), values);
}
exports.createCreditCard = createCreditCard;
exports.CustomDomainCheckDataTypeRef = new tutanota_utils_1.TypeRef("sys", "CustomDomainCheckData");
function createCustomDomainCheckData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.CustomDomainCheckData, exports.CustomDomainCheckDataTypeRef), values);
}
exports.createCustomDomainCheckData = createCustomDomainCheckData;
exports.CustomDomainCheckReturnTypeRef = new tutanota_utils_1.TypeRef("sys", "CustomDomainCheckReturn");
function createCustomDomainCheckReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.CustomDomainCheckReturn, exports.CustomDomainCheckReturnTypeRef), values);
}
exports.createCustomDomainCheckReturn = createCustomDomainCheckReturn;
exports.CustomDomainDataTypeRef = new tutanota_utils_1.TypeRef("sys", "CustomDomainData");
function createCustomDomainData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.CustomDomainData, exports.CustomDomainDataTypeRef), values);
}
exports.createCustomDomainData = createCustomDomainData;
exports.CustomDomainReturnTypeRef = new tutanota_utils_1.TypeRef("sys", "CustomDomainReturn");
function createCustomDomainReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.CustomDomainReturn, exports.CustomDomainReturnTypeRef), values);
}
exports.createCustomDomainReturn = createCustomDomainReturn;
exports.CustomerTypeRef = new tutanota_utils_1.TypeRef("sys", "Customer");
function createCustomer(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.Customer, exports.CustomerTypeRef), values);
}
exports.createCustomer = createCustomer;
exports.CustomerAccountTerminationPostInTypeRef = new tutanota_utils_1.TypeRef("sys", "CustomerAccountTerminationPostIn");
function createCustomerAccountTerminationPostIn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.CustomerAccountTerminationPostIn, exports.CustomerAccountTerminationPostInTypeRef), values);
}
exports.createCustomerAccountTerminationPostIn = createCustomerAccountTerminationPostIn;
exports.CustomerAccountTerminationPostOutTypeRef = new tutanota_utils_1.TypeRef("sys", "CustomerAccountTerminationPostOut");
function createCustomerAccountTerminationPostOut(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.CustomerAccountTerminationPostOut, exports.CustomerAccountTerminationPostOutTypeRef), values);
}
exports.createCustomerAccountTerminationPostOut = createCustomerAccountTerminationPostOut;
exports.CustomerAccountTerminationRequestTypeRef = new tutanota_utils_1.TypeRef("sys", "CustomerAccountTerminationRequest");
function createCustomerAccountTerminationRequest(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.CustomerAccountTerminationRequest, exports.CustomerAccountTerminationRequestTypeRef), values);
}
exports.createCustomerAccountTerminationRequest = createCustomerAccountTerminationRequest;
exports.CustomerDataTypeRef = new tutanota_utils_1.TypeRef("sys", "CustomerData");
function createCustomerData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.CustomerData, exports.CustomerDataTypeRef), values);
}
exports.createCustomerData = createCustomerData;
exports.CustomerInfoTypeRef = new tutanota_utils_1.TypeRef("sys", "CustomerInfo");
function createCustomerInfo(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.CustomerInfo, exports.CustomerInfoTypeRef), values);
}
exports.createCustomerInfo = createCustomerInfo;
exports.CustomerInfoReturnTypeRef = new tutanota_utils_1.TypeRef("sys", "CustomerInfoReturn");
function createCustomerInfoReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.CustomerInfoReturn, exports.CustomerInfoReturnTypeRef), values);
}
exports.createCustomerInfoReturn = createCustomerInfoReturn;
exports.CustomerPropertiesTypeRef = new tutanota_utils_1.TypeRef("sys", "CustomerProperties");
function createCustomerProperties(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.CustomerProperties, exports.CustomerPropertiesTypeRef), values);
}
exports.createCustomerProperties = createCustomerProperties;
exports.CustomerReturnTypeRef = new tutanota_utils_1.TypeRef("sys", "CustomerReturn");
function createCustomerReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.CustomerReturn, exports.CustomerReturnTypeRef), values);
}
exports.createCustomerReturn = createCustomerReturn;
exports.CustomerServerPropertiesTypeRef = new tutanota_utils_1.TypeRef("sys", "CustomerServerProperties");
function createCustomerServerProperties(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.CustomerServerProperties, exports.CustomerServerPropertiesTypeRef), values);
}
exports.createCustomerServerProperties = createCustomerServerProperties;
exports.DebitServicePutDataTypeRef = new tutanota_utils_1.TypeRef("sys", "DebitServicePutData");
function createDebitServicePutData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.DebitServicePutData, exports.DebitServicePutDataTypeRef), values);
}
exports.createDebitServicePutData = createDebitServicePutData;
exports.DeleteCustomerDataTypeRef = new tutanota_utils_1.TypeRef("sys", "DeleteCustomerData");
function createDeleteCustomerData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.DeleteCustomerData, exports.DeleteCustomerDataTypeRef), values);
}
exports.createDeleteCustomerData = createDeleteCustomerData;
exports.DnsRecordTypeRef = new tutanota_utils_1.TypeRef("sys", "DnsRecord");
function createDnsRecord(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.DnsRecord, exports.DnsRecordTypeRef), values);
}
exports.createDnsRecord = createDnsRecord;
exports.DomainInfoTypeRef = new tutanota_utils_1.TypeRef("sys", "DomainInfo");
function createDomainInfo(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.DomainInfo, exports.DomainInfoTypeRef), values);
}
exports.createDomainInfo = createDomainInfo;
exports.DomainMailAddressAvailabilityDataTypeRef = new tutanota_utils_1.TypeRef("sys", "DomainMailAddressAvailabilityData");
function createDomainMailAddressAvailabilityData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.DomainMailAddressAvailabilityData, exports.DomainMailAddressAvailabilityDataTypeRef), values);
}
exports.createDomainMailAddressAvailabilityData = createDomainMailAddressAvailabilityData;
exports.DomainMailAddressAvailabilityReturnTypeRef = new tutanota_utils_1.TypeRef("sys", "DomainMailAddressAvailabilityReturn");
function createDomainMailAddressAvailabilityReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.DomainMailAddressAvailabilityReturn, exports.DomainMailAddressAvailabilityReturnTypeRef), values);
}
exports.createDomainMailAddressAvailabilityReturn = createDomainMailAddressAvailabilityReturn;
exports.DomainsRefTypeRef = new tutanota_utils_1.TypeRef("sys", "DomainsRef");
function createDomainsRef(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.DomainsRef, exports.DomainsRefTypeRef), values);
}
exports.createDomainsRef = createDomainsRef;
exports.EmailSenderListElementTypeRef = new tutanota_utils_1.TypeRef("sys", "EmailSenderListElement");
function createEmailSenderListElement(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.EmailSenderListElement, exports.EmailSenderListElementTypeRef), values);
}
exports.createEmailSenderListElement = createEmailSenderListElement;
exports.EntityEventBatchTypeRef = new tutanota_utils_1.TypeRef("sys", "EntityEventBatch");
function createEntityEventBatch(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.EntityEventBatch, exports.EntityEventBatchTypeRef), values);
}
exports.createEntityEventBatch = createEntityEventBatch;
exports.EntityUpdateTypeRef = new tutanota_utils_1.TypeRef("sys", "EntityUpdate");
function createEntityUpdate(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.EntityUpdate, exports.EntityUpdateTypeRef), values);
}
exports.createEntityUpdate = createEntityUpdate;
exports.ExceptionTypeRef = new tutanota_utils_1.TypeRef("sys", "Exception");
function createException(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.Exception, exports.ExceptionTypeRef), values);
}
exports.createException = createException;
exports.ExternalPropertiesReturnTypeRef = new tutanota_utils_1.TypeRef("sys", "ExternalPropertiesReturn");
function createExternalPropertiesReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.ExternalPropertiesReturn, exports.ExternalPropertiesReturnTypeRef), values);
}
exports.createExternalPropertiesReturn = createExternalPropertiesReturn;
exports.ExternalUserReferenceTypeRef = new tutanota_utils_1.TypeRef("sys", "ExternalUserReference");
function createExternalUserReference(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.ExternalUserReference, exports.ExternalUserReferenceTypeRef), values);
}
exports.createExternalUserReference = createExternalUserReference;
exports.FeatureTypeRef = new tutanota_utils_1.TypeRef("sys", "Feature");
function createFeature(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.Feature, exports.FeatureTypeRef), values);
}
exports.createFeature = createFeature;
exports.FileTypeRef = new tutanota_utils_1.TypeRef("sys", "File");
function createFile(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.File, exports.FileTypeRef), values);
}
exports.createFile = createFile;
exports.GeneratedIdWrapperTypeRef = new tutanota_utils_1.TypeRef("sys", "GeneratedIdWrapper");
function createGeneratedIdWrapper(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.GeneratedIdWrapper, exports.GeneratedIdWrapperTypeRef), values);
}
exports.createGeneratedIdWrapper = createGeneratedIdWrapper;
exports.GiftCardTypeRef = new tutanota_utils_1.TypeRef("sys", "GiftCard");
function createGiftCard(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.GiftCard, exports.GiftCardTypeRef), values);
}
exports.createGiftCard = createGiftCard;
exports.GiftCardCreateDataTypeRef = new tutanota_utils_1.TypeRef("sys", "GiftCardCreateData");
function createGiftCardCreateData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.GiftCardCreateData, exports.GiftCardCreateDataTypeRef), values);
}
exports.createGiftCardCreateData = createGiftCardCreateData;
exports.GiftCardCreateReturnTypeRef = new tutanota_utils_1.TypeRef("sys", "GiftCardCreateReturn");
function createGiftCardCreateReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.GiftCardCreateReturn, exports.GiftCardCreateReturnTypeRef), values);
}
exports.createGiftCardCreateReturn = createGiftCardCreateReturn;
exports.GiftCardDeleteDataTypeRef = new tutanota_utils_1.TypeRef("sys", "GiftCardDeleteData");
function createGiftCardDeleteData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.GiftCardDeleteData, exports.GiftCardDeleteDataTypeRef), values);
}
exports.createGiftCardDeleteData = createGiftCardDeleteData;
exports.GiftCardGetReturnTypeRef = new tutanota_utils_1.TypeRef("sys", "GiftCardGetReturn");
function createGiftCardGetReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.GiftCardGetReturn, exports.GiftCardGetReturnTypeRef), values);
}
exports.createGiftCardGetReturn = createGiftCardGetReturn;
exports.GiftCardOptionTypeRef = new tutanota_utils_1.TypeRef("sys", "GiftCardOption");
function createGiftCardOption(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.GiftCardOption, exports.GiftCardOptionTypeRef), values);
}
exports.createGiftCardOption = createGiftCardOption;
exports.GiftCardRedeemDataTypeRef = new tutanota_utils_1.TypeRef("sys", "GiftCardRedeemData");
function createGiftCardRedeemData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.GiftCardRedeemData, exports.GiftCardRedeemDataTypeRef), values);
}
exports.createGiftCardRedeemData = createGiftCardRedeemData;
exports.GiftCardRedeemGetReturnTypeRef = new tutanota_utils_1.TypeRef("sys", "GiftCardRedeemGetReturn");
function createGiftCardRedeemGetReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.GiftCardRedeemGetReturn, exports.GiftCardRedeemGetReturnTypeRef), values);
}
exports.createGiftCardRedeemGetReturn = createGiftCardRedeemGetReturn;
exports.GiftCardsRefTypeRef = new tutanota_utils_1.TypeRef("sys", "GiftCardsRef");
function createGiftCardsRef(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.GiftCardsRef, exports.GiftCardsRefTypeRef), values);
}
exports.createGiftCardsRef = createGiftCardsRef;
exports.GroupTypeRef = new tutanota_utils_1.TypeRef("sys", "Group");
function createGroup(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.Group, exports.GroupTypeRef), values);
}
exports.createGroup = createGroup;
exports.GroupInfoTypeRef = new tutanota_utils_1.TypeRef("sys", "GroupInfo");
function createGroupInfo(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.GroupInfo, exports.GroupInfoTypeRef), values);
}
exports.createGroupInfo = createGroupInfo;
exports.GroupMemberTypeRef = new tutanota_utils_1.TypeRef("sys", "GroupMember");
function createGroupMember(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.GroupMember, exports.GroupMemberTypeRef), values);
}
exports.createGroupMember = createGroupMember;
exports.GroupMembershipTypeRef = new tutanota_utils_1.TypeRef("sys", "GroupMembership");
function createGroupMembership(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.GroupMembership, exports.GroupMembershipTypeRef), values);
}
exports.createGroupMembership = createGroupMembership;
exports.GroupRootTypeRef = new tutanota_utils_1.TypeRef("sys", "GroupRoot");
function createGroupRoot(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.GroupRoot, exports.GroupRootTypeRef), values);
}
exports.createGroupRoot = createGroupRoot;
exports.InvoiceTypeRef = new tutanota_utils_1.TypeRef("sys", "Invoice");
function createInvoice(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.Invoice, exports.InvoiceTypeRef), values);
}
exports.createInvoice = createInvoice;
exports.InvoiceInfoTypeRef = new tutanota_utils_1.TypeRef("sys", "InvoiceInfo");
function createInvoiceInfo(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.InvoiceInfo, exports.InvoiceInfoTypeRef), values);
}
exports.createInvoiceInfo = createInvoiceInfo;
exports.InvoiceItemTypeRef = new tutanota_utils_1.TypeRef("sys", "InvoiceItem");
function createInvoiceItem(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.InvoiceItem, exports.InvoiceItemTypeRef), values);
}
exports.createInvoiceItem = createInvoiceItem;
exports.KeyPairTypeRef = new tutanota_utils_1.TypeRef("sys", "KeyPair");
function createKeyPair(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.KeyPair, exports.KeyPairTypeRef), values);
}
exports.createKeyPair = createKeyPair;
exports.LocationServiceGetReturnTypeRef = new tutanota_utils_1.TypeRef("sys", "LocationServiceGetReturn");
function createLocationServiceGetReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.LocationServiceGetReturn, exports.LocationServiceGetReturnTypeRef), values);
}
exports.createLocationServiceGetReturn = createLocationServiceGetReturn;
exports.LoginTypeRef = new tutanota_utils_1.TypeRef("sys", "Login");
function createLogin(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.Login, exports.LoginTypeRef), values);
}
exports.createLogin = createLogin;
exports.MailAddressAliasTypeRef = new tutanota_utils_1.TypeRef("sys", "MailAddressAlias");
function createMailAddressAlias(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.MailAddressAlias, exports.MailAddressAliasTypeRef), values);
}
exports.createMailAddressAlias = createMailAddressAlias;
exports.MailAddressAliasServiceDataTypeRef = new tutanota_utils_1.TypeRef("sys", "MailAddressAliasServiceData");
function createMailAddressAliasServiceData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.MailAddressAliasServiceData, exports.MailAddressAliasServiceDataTypeRef), values);
}
exports.createMailAddressAliasServiceData = createMailAddressAliasServiceData;
exports.MailAddressAliasServiceDataDeleteTypeRef = new tutanota_utils_1.TypeRef("sys", "MailAddressAliasServiceDataDelete");
function createMailAddressAliasServiceDataDelete(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.MailAddressAliasServiceDataDelete, exports.MailAddressAliasServiceDataDeleteTypeRef), values);
}
exports.createMailAddressAliasServiceDataDelete = createMailAddressAliasServiceDataDelete;
exports.MailAddressAliasServiceReturnTypeRef = new tutanota_utils_1.TypeRef("sys", "MailAddressAliasServiceReturn");
function createMailAddressAliasServiceReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.MailAddressAliasServiceReturn, exports.MailAddressAliasServiceReturnTypeRef), values);
}
exports.createMailAddressAliasServiceReturn = createMailAddressAliasServiceReturn;
exports.MailAddressAvailabilityDataTypeRef = new tutanota_utils_1.TypeRef("sys", "MailAddressAvailabilityData");
function createMailAddressAvailabilityData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.MailAddressAvailabilityData, exports.MailAddressAvailabilityDataTypeRef), values);
}
exports.createMailAddressAvailabilityData = createMailAddressAvailabilityData;
exports.MailAddressAvailabilityReturnTypeRef = new tutanota_utils_1.TypeRef("sys", "MailAddressAvailabilityReturn");
function createMailAddressAvailabilityReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.MailAddressAvailabilityReturn, exports.MailAddressAvailabilityReturnTypeRef), values);
}
exports.createMailAddressAvailabilityReturn = createMailAddressAvailabilityReturn;
exports.MailAddressToGroupTypeRef = new tutanota_utils_1.TypeRef("sys", "MailAddressToGroup");
function createMailAddressToGroup(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.MailAddressToGroup, exports.MailAddressToGroupTypeRef), values);
}
exports.createMailAddressToGroup = createMailAddressToGroup;
exports.MembershipAddDataTypeRef = new tutanota_utils_1.TypeRef("sys", "MembershipAddData");
function createMembershipAddData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.MembershipAddData, exports.MembershipAddDataTypeRef), values);
}
exports.createMembershipAddData = createMembershipAddData;
exports.MembershipRemoveDataTypeRef = new tutanota_utils_1.TypeRef("sys", "MembershipRemoveData");
function createMembershipRemoveData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.MembershipRemoveData, exports.MembershipRemoveDataTypeRef), values);
}
exports.createMembershipRemoveData = createMembershipRemoveData;
exports.MissedNotificationTypeRef = new tutanota_utils_1.TypeRef("sys", "MissedNotification");
function createMissedNotification(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.MissedNotification, exports.MissedNotificationTypeRef), values);
}
exports.createMissedNotification = createMissedNotification;
exports.NotificationInfoTypeRef = new tutanota_utils_1.TypeRef("sys", "NotificationInfo");
function createNotificationInfo(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.NotificationInfo, exports.NotificationInfoTypeRef), values);
}
exports.createNotificationInfo = createNotificationInfo;
exports.NotificationMailTemplateTypeRef = new tutanota_utils_1.TypeRef("sys", "NotificationMailTemplate");
function createNotificationMailTemplate(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.NotificationMailTemplate, exports.NotificationMailTemplateTypeRef), values);
}
exports.createNotificationMailTemplate = createNotificationMailTemplate;
exports.NotificationSessionKeyTypeRef = new tutanota_utils_1.TypeRef("sys", "NotificationSessionKey");
function createNotificationSessionKey(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.NotificationSessionKey, exports.NotificationSessionKeyTypeRef), values);
}
exports.createNotificationSessionKey = createNotificationSessionKey;
exports.OrderProcessingAgreementTypeRef = new tutanota_utils_1.TypeRef("sys", "OrderProcessingAgreement");
function createOrderProcessingAgreement(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.OrderProcessingAgreement, exports.OrderProcessingAgreementTypeRef), values);
}
exports.createOrderProcessingAgreement = createOrderProcessingAgreement;
exports.OtpChallengeTypeRef = new tutanota_utils_1.TypeRef("sys", "OtpChallenge");
function createOtpChallenge(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.OtpChallenge, exports.OtpChallengeTypeRef), values);
}
exports.createOtpChallenge = createOtpChallenge;
exports.PaymentDataServiceGetDataTypeRef = new tutanota_utils_1.TypeRef("sys", "PaymentDataServiceGetData");
function createPaymentDataServiceGetData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.PaymentDataServiceGetData, exports.PaymentDataServiceGetDataTypeRef), values);
}
exports.createPaymentDataServiceGetData = createPaymentDataServiceGetData;
exports.PaymentDataServiceGetReturnTypeRef = new tutanota_utils_1.TypeRef("sys", "PaymentDataServiceGetReturn");
function createPaymentDataServiceGetReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.PaymentDataServiceGetReturn, exports.PaymentDataServiceGetReturnTypeRef), values);
}
exports.createPaymentDataServiceGetReturn = createPaymentDataServiceGetReturn;
exports.PaymentDataServicePostDataTypeRef = new tutanota_utils_1.TypeRef("sys", "PaymentDataServicePostData");
function createPaymentDataServicePostData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.PaymentDataServicePostData, exports.PaymentDataServicePostDataTypeRef), values);
}
exports.createPaymentDataServicePostData = createPaymentDataServicePostData;
exports.PaymentDataServicePutDataTypeRef = new tutanota_utils_1.TypeRef("sys", "PaymentDataServicePutData");
function createPaymentDataServicePutData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.PaymentDataServicePutData, exports.PaymentDataServicePutDataTypeRef), values);
}
exports.createPaymentDataServicePutData = createPaymentDataServicePutData;
exports.PaymentDataServicePutReturnTypeRef = new tutanota_utils_1.TypeRef("sys", "PaymentDataServicePutReturn");
function createPaymentDataServicePutReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.PaymentDataServicePutReturn, exports.PaymentDataServicePutReturnTypeRef), values);
}
exports.createPaymentDataServicePutReturn = createPaymentDataServicePutReturn;
exports.PaymentErrorInfoTypeRef = new tutanota_utils_1.TypeRef("sys", "PaymentErrorInfo");
function createPaymentErrorInfo(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.PaymentErrorInfo, exports.PaymentErrorInfoTypeRef), values);
}
exports.createPaymentErrorInfo = createPaymentErrorInfo;
exports.PdfInvoiceServiceDataTypeRef = new tutanota_utils_1.TypeRef("sys", "PdfInvoiceServiceData");
function createPdfInvoiceServiceData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.PdfInvoiceServiceData, exports.PdfInvoiceServiceDataTypeRef), values);
}
exports.createPdfInvoiceServiceData = createPdfInvoiceServiceData;
exports.PdfInvoiceServiceReturnTypeRef = new tutanota_utils_1.TypeRef("sys", "PdfInvoiceServiceReturn");
function createPdfInvoiceServiceReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.PdfInvoiceServiceReturn, exports.PdfInvoiceServiceReturnTypeRef), values);
}
exports.createPdfInvoiceServiceReturn = createPdfInvoiceServiceReturn;
exports.PermissionTypeRef = new tutanota_utils_1.TypeRef("sys", "Permission");
function createPermission(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.Permission, exports.PermissionTypeRef), values);
}
exports.createPermission = createPermission;
exports.PhoneNumberTypeRef = new tutanota_utils_1.TypeRef("sys", "PhoneNumber");
function createPhoneNumber(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.PhoneNumber, exports.PhoneNumberTypeRef), values);
}
exports.createPhoneNumber = createPhoneNumber;
exports.PlanPricesTypeRef = new tutanota_utils_1.TypeRef("sys", "PlanPrices");
function createPlanPrices(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.PlanPrices, exports.PlanPricesTypeRef), values);
}
exports.createPlanPrices = createPlanPrices;
exports.PremiumFeatureDataTypeRef = new tutanota_utils_1.TypeRef("sys", "PremiumFeatureData");
function createPremiumFeatureData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.PremiumFeatureData, exports.PremiumFeatureDataTypeRef), values);
}
exports.createPremiumFeatureData = createPremiumFeatureData;
exports.PremiumFeatureReturnTypeRef = new tutanota_utils_1.TypeRef("sys", "PremiumFeatureReturn");
function createPremiumFeatureReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.PremiumFeatureReturn, exports.PremiumFeatureReturnTypeRef), values);
}
exports.createPremiumFeatureReturn = createPremiumFeatureReturn;
exports.PriceDataTypeRef = new tutanota_utils_1.TypeRef("sys", "PriceData");
function createPriceData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.PriceData, exports.PriceDataTypeRef), values);
}
exports.createPriceData = createPriceData;
exports.PriceItemDataTypeRef = new tutanota_utils_1.TypeRef("sys", "PriceItemData");
function createPriceItemData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.PriceItemData, exports.PriceItemDataTypeRef), values);
}
exports.createPriceItemData = createPriceItemData;
exports.PriceRequestDataTypeRef = new tutanota_utils_1.TypeRef("sys", "PriceRequestData");
function createPriceRequestData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.PriceRequestData, exports.PriceRequestDataTypeRef), values);
}
exports.createPriceRequestData = createPriceRequestData;
exports.PriceServiceDataTypeRef = new tutanota_utils_1.TypeRef("sys", "PriceServiceData");
function createPriceServiceData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.PriceServiceData, exports.PriceServiceDataTypeRef), values);
}
exports.createPriceServiceData = createPriceServiceData;
exports.PriceServiceReturnTypeRef = new tutanota_utils_1.TypeRef("sys", "PriceServiceReturn");
function createPriceServiceReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.PriceServiceReturn, exports.PriceServiceReturnTypeRef), values);
}
exports.createPriceServiceReturn = createPriceServiceReturn;
exports.PublicKeyDataTypeRef = new tutanota_utils_1.TypeRef("sys", "PublicKeyData");
function createPublicKeyData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.PublicKeyData, exports.PublicKeyDataTypeRef), values);
}
exports.createPublicKeyData = createPublicKeyData;
exports.PublicKeyReturnTypeRef = new tutanota_utils_1.TypeRef("sys", "PublicKeyReturn");
function createPublicKeyReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.PublicKeyReturn, exports.PublicKeyReturnTypeRef), values);
}
exports.createPublicKeyReturn = createPublicKeyReturn;
exports.PushIdentifierTypeRef = new tutanota_utils_1.TypeRef("sys", "PushIdentifier");
function createPushIdentifier(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.PushIdentifier, exports.PushIdentifierTypeRef), values);
}
exports.createPushIdentifier = createPushIdentifier;
exports.PushIdentifierListTypeRef = new tutanota_utils_1.TypeRef("sys", "PushIdentifierList");
function createPushIdentifierList(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.PushIdentifierList, exports.PushIdentifierListTypeRef), values);
}
exports.createPushIdentifierList = createPushIdentifierList;
exports.ReceivedGroupInvitationTypeRef = new tutanota_utils_1.TypeRef("sys", "ReceivedGroupInvitation");
function createReceivedGroupInvitation(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.ReceivedGroupInvitation, exports.ReceivedGroupInvitationTypeRef), values);
}
exports.createReceivedGroupInvitation = createReceivedGroupInvitation;
exports.RecoverCodeTypeRef = new tutanota_utils_1.TypeRef("sys", "RecoverCode");
function createRecoverCode(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.RecoverCode, exports.RecoverCodeTypeRef), values);
}
exports.createRecoverCode = createRecoverCode;
exports.RegistrationCaptchaServiceDataTypeRef = new tutanota_utils_1.TypeRef("sys", "RegistrationCaptchaServiceData");
function createRegistrationCaptchaServiceData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.RegistrationCaptchaServiceData, exports.RegistrationCaptchaServiceDataTypeRef), values);
}
exports.createRegistrationCaptchaServiceData = createRegistrationCaptchaServiceData;
exports.RegistrationCaptchaServiceGetDataTypeRef = new tutanota_utils_1.TypeRef("sys", "RegistrationCaptchaServiceGetData");
function createRegistrationCaptchaServiceGetData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.RegistrationCaptchaServiceGetData, exports.RegistrationCaptchaServiceGetDataTypeRef), values);
}
exports.createRegistrationCaptchaServiceGetData = createRegistrationCaptchaServiceGetData;
exports.RegistrationCaptchaServiceReturnTypeRef = new tutanota_utils_1.TypeRef("sys", "RegistrationCaptchaServiceReturn");
function createRegistrationCaptchaServiceReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.RegistrationCaptchaServiceReturn, exports.RegistrationCaptchaServiceReturnTypeRef), values);
}
exports.createRegistrationCaptchaServiceReturn = createRegistrationCaptchaServiceReturn;
exports.RegistrationConfigReturnTypeRef = new tutanota_utils_1.TypeRef("sys", "RegistrationConfigReturn");
function createRegistrationConfigReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.RegistrationConfigReturn, exports.RegistrationConfigReturnTypeRef), values);
}
exports.createRegistrationConfigReturn = createRegistrationConfigReturn;
exports.RegistrationReturnTypeRef = new tutanota_utils_1.TypeRef("sys", "RegistrationReturn");
function createRegistrationReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.RegistrationReturn, exports.RegistrationReturnTypeRef), values);
}
exports.createRegistrationReturn = createRegistrationReturn;
exports.RegistrationServiceDataTypeRef = new tutanota_utils_1.TypeRef("sys", "RegistrationServiceData");
function createRegistrationServiceData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.RegistrationServiceData, exports.RegistrationServiceDataTypeRef), values);
}
exports.createRegistrationServiceData = createRegistrationServiceData;
exports.RejectedSenderTypeRef = new tutanota_utils_1.TypeRef("sys", "RejectedSender");
function createRejectedSender(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.RejectedSender, exports.RejectedSenderTypeRef), values);
}
exports.createRejectedSender = createRejectedSender;
exports.RejectedSendersRefTypeRef = new tutanota_utils_1.TypeRef("sys", "RejectedSendersRef");
function createRejectedSendersRef(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.RejectedSendersRef, exports.RejectedSendersRefTypeRef), values);
}
exports.createRejectedSendersRef = createRejectedSendersRef;
exports.RepeatRuleTypeRef = new tutanota_utils_1.TypeRef("sys", "RepeatRule");
function createRepeatRule(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.RepeatRule, exports.RepeatRuleTypeRef), values);
}
exports.createRepeatRule = createRepeatRule;
exports.ResetFactorsDeleteDataTypeRef = new tutanota_utils_1.TypeRef("sys", "ResetFactorsDeleteData");
function createResetFactorsDeleteData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.ResetFactorsDeleteData, exports.ResetFactorsDeleteDataTypeRef), values);
}
exports.createResetFactorsDeleteData = createResetFactorsDeleteData;
exports.ResetPasswordDataTypeRef = new tutanota_utils_1.TypeRef("sys", "ResetPasswordData");
function createResetPasswordData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.ResetPasswordData, exports.ResetPasswordDataTypeRef), values);
}
exports.createResetPasswordData = createResetPasswordData;
exports.RootInstanceTypeRef = new tutanota_utils_1.TypeRef("sys", "RootInstance");
function createRootInstance(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.RootInstance, exports.RootInstanceTypeRef), values);
}
exports.createRootInstance = createRootInstance;
exports.SaltDataTypeRef = new tutanota_utils_1.TypeRef("sys", "SaltData");
function createSaltData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.SaltData, exports.SaltDataTypeRef), values);
}
exports.createSaltData = createSaltData;
exports.SaltReturnTypeRef = new tutanota_utils_1.TypeRef("sys", "SaltReturn");
function createSaltReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.SaltReturn, exports.SaltReturnTypeRef), values);
}
exports.createSaltReturn = createSaltReturn;
exports.SecondFactorTypeRef = new tutanota_utils_1.TypeRef("sys", "SecondFactor");
function createSecondFactor(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.SecondFactor, exports.SecondFactorTypeRef), values);
}
exports.createSecondFactor = createSecondFactor;
exports.SecondFactorAuthAllowedReturnTypeRef = new tutanota_utils_1.TypeRef("sys", "SecondFactorAuthAllowedReturn");
function createSecondFactorAuthAllowedReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.SecondFactorAuthAllowedReturn, exports.SecondFactorAuthAllowedReturnTypeRef), values);
}
exports.createSecondFactorAuthAllowedReturn = createSecondFactorAuthAllowedReturn;
exports.SecondFactorAuthDataTypeRef = new tutanota_utils_1.TypeRef("sys", "SecondFactorAuthData");
function createSecondFactorAuthData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.SecondFactorAuthData, exports.SecondFactorAuthDataTypeRef), values);
}
exports.createSecondFactorAuthData = createSecondFactorAuthData;
exports.SecondFactorAuthDeleteDataTypeRef = new tutanota_utils_1.TypeRef("sys", "SecondFactorAuthDeleteData");
function createSecondFactorAuthDeleteData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.SecondFactorAuthDeleteData, exports.SecondFactorAuthDeleteDataTypeRef), values);
}
exports.createSecondFactorAuthDeleteData = createSecondFactorAuthDeleteData;
exports.SecondFactorAuthGetDataTypeRef = new tutanota_utils_1.TypeRef("sys", "SecondFactorAuthGetData");
function createSecondFactorAuthGetData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.SecondFactorAuthGetData, exports.SecondFactorAuthGetDataTypeRef), values);
}
exports.createSecondFactorAuthGetData = createSecondFactorAuthGetData;
exports.SecondFactorAuthGetReturnTypeRef = new tutanota_utils_1.TypeRef("sys", "SecondFactorAuthGetReturn");
function createSecondFactorAuthGetReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.SecondFactorAuthGetReturn, exports.SecondFactorAuthGetReturnTypeRef), values);
}
exports.createSecondFactorAuthGetReturn = createSecondFactorAuthGetReturn;
exports.SecondFactorAuthenticationTypeRef = new tutanota_utils_1.TypeRef("sys", "SecondFactorAuthentication");
function createSecondFactorAuthentication(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.SecondFactorAuthentication, exports.SecondFactorAuthenticationTypeRef), values);
}
exports.createSecondFactorAuthentication = createSecondFactorAuthentication;
exports.SendRegistrationCodeDataTypeRef = new tutanota_utils_1.TypeRef("sys", "SendRegistrationCodeData");
function createSendRegistrationCodeData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.SendRegistrationCodeData, exports.SendRegistrationCodeDataTypeRef), values);
}
exports.createSendRegistrationCodeData = createSendRegistrationCodeData;
exports.SendRegistrationCodeReturnTypeRef = new tutanota_utils_1.TypeRef("sys", "SendRegistrationCodeReturn");
function createSendRegistrationCodeReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.SendRegistrationCodeReturn, exports.SendRegistrationCodeReturnTypeRef), values);
}
exports.createSendRegistrationCodeReturn = createSendRegistrationCodeReturn;
exports.SentGroupInvitationTypeRef = new tutanota_utils_1.TypeRef("sys", "SentGroupInvitation");
function createSentGroupInvitation(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.SentGroupInvitation, exports.SentGroupInvitationTypeRef), values);
}
exports.createSentGroupInvitation = createSentGroupInvitation;
exports.SessionTypeRef = new tutanota_utils_1.TypeRef("sys", "Session");
function createSession(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.Session, exports.SessionTypeRef), values);
}
exports.createSession = createSession;
exports.SignOrderProcessingAgreementDataTypeRef = new tutanota_utils_1.TypeRef("sys", "SignOrderProcessingAgreementData");
function createSignOrderProcessingAgreementData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.SignOrderProcessingAgreementData, exports.SignOrderProcessingAgreementDataTypeRef), values);
}
exports.createSignOrderProcessingAgreementData = createSignOrderProcessingAgreementData;
exports.SseConnectDataTypeRef = new tutanota_utils_1.TypeRef("sys", "SseConnectData");
function createSseConnectData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.SseConnectData, exports.SseConnectDataTypeRef), values);
}
exports.createSseConnectData = createSseConnectData;
exports.StringConfigValueTypeRef = new tutanota_utils_1.TypeRef("sys", "StringConfigValue");
function createStringConfigValue(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.StringConfigValue, exports.StringConfigValueTypeRef), values);
}
exports.createStringConfigValue = createStringConfigValue;
exports.StringWrapperTypeRef = new tutanota_utils_1.TypeRef("sys", "StringWrapper");
function createStringWrapper(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.StringWrapper, exports.StringWrapperTypeRef), values);
}
exports.createStringWrapper = createStringWrapper;
exports.SwitchAccountTypeDataTypeRef = new tutanota_utils_1.TypeRef("sys", "SwitchAccountTypeData");
function createSwitchAccountTypeData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.SwitchAccountTypeData, exports.SwitchAccountTypeDataTypeRef), values);
}
exports.createSwitchAccountTypeData = createSwitchAccountTypeData;
exports.SystemKeysReturnTypeRef = new tutanota_utils_1.TypeRef("sys", "SystemKeysReturn");
function createSystemKeysReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.SystemKeysReturn, exports.SystemKeysReturnTypeRef), values);
}
exports.createSystemKeysReturn = createSystemKeysReturn;
exports.TakeOverDeletedAddressDataTypeRef = new tutanota_utils_1.TypeRef("sys", "TakeOverDeletedAddressData");
function createTakeOverDeletedAddressData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.TakeOverDeletedAddressData, exports.TakeOverDeletedAddressDataTypeRef), values);
}
exports.createTakeOverDeletedAddressData = createTakeOverDeletedAddressData;
exports.TypeInfoTypeRef = new tutanota_utils_1.TypeRef("sys", "TypeInfo");
function createTypeInfo(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.TypeInfo, exports.TypeInfoTypeRef), values);
}
exports.createTypeInfo = createTypeInfo;
exports.U2fChallengeTypeRef = new tutanota_utils_1.TypeRef("sys", "U2fChallenge");
function createU2fChallenge(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.U2fChallenge, exports.U2fChallengeTypeRef), values);
}
exports.createU2fChallenge = createU2fChallenge;
exports.U2fKeyTypeRef = new tutanota_utils_1.TypeRef("sys", "U2fKey");
function createU2fKey(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.U2fKey, exports.U2fKeyTypeRef), values);
}
exports.createU2fKey = createU2fKey;
exports.U2fRegisteredDeviceTypeRef = new tutanota_utils_1.TypeRef("sys", "U2fRegisteredDevice");
function createU2fRegisteredDevice(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.U2fRegisteredDevice, exports.U2fRegisteredDeviceTypeRef), values);
}
exports.createU2fRegisteredDevice = createU2fRegisteredDevice;
exports.U2fResponseDataTypeRef = new tutanota_utils_1.TypeRef("sys", "U2fResponseData");
function createU2fResponseData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.U2fResponseData, exports.U2fResponseDataTypeRef), values);
}
exports.createU2fResponseData = createU2fResponseData;
exports.UpdateAdminshipDataTypeRef = new tutanota_utils_1.TypeRef("sys", "UpdateAdminshipData");
function createUpdateAdminshipData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.UpdateAdminshipData, exports.UpdateAdminshipDataTypeRef), values);
}
exports.createUpdateAdminshipData = createUpdateAdminshipData;
exports.UpdatePermissionKeyDataTypeRef = new tutanota_utils_1.TypeRef("sys", "UpdatePermissionKeyData");
function createUpdatePermissionKeyData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.UpdatePermissionKeyData, exports.UpdatePermissionKeyDataTypeRef), values);
}
exports.createUpdatePermissionKeyData = createUpdatePermissionKeyData;
exports.UpgradePriceServiceDataTypeRef = new tutanota_utils_1.TypeRef("sys", "UpgradePriceServiceData");
function createUpgradePriceServiceData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.UpgradePriceServiceData, exports.UpgradePriceServiceDataTypeRef), values);
}
exports.createUpgradePriceServiceData = createUpgradePriceServiceData;
exports.UpgradePriceServiceReturnTypeRef = new tutanota_utils_1.TypeRef("sys", "UpgradePriceServiceReturn");
function createUpgradePriceServiceReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.UpgradePriceServiceReturn, exports.UpgradePriceServiceReturnTypeRef), values);
}
exports.createUpgradePriceServiceReturn = createUpgradePriceServiceReturn;
exports.UserTypeRef = new tutanota_utils_1.TypeRef("sys", "User");
function createUser(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.User, exports.UserTypeRef), values);
}
exports.createUser = createUser;
exports.UserAlarmInfoTypeRef = new tutanota_utils_1.TypeRef("sys", "UserAlarmInfo");
function createUserAlarmInfo(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.UserAlarmInfo, exports.UserAlarmInfoTypeRef), values);
}
exports.createUserAlarmInfo = createUserAlarmInfo;
exports.UserAlarmInfoListTypeTypeRef = new tutanota_utils_1.TypeRef("sys", "UserAlarmInfoListType");
function createUserAlarmInfoListType(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.UserAlarmInfoListType, exports.UserAlarmInfoListTypeTypeRef), values);
}
exports.createUserAlarmInfoListType = createUserAlarmInfoListType;
exports.UserAreaGroupsTypeRef = new tutanota_utils_1.TypeRef("sys", "UserAreaGroups");
function createUserAreaGroups(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.UserAreaGroups, exports.UserAreaGroupsTypeRef), values);
}
exports.createUserAreaGroups = createUserAreaGroups;
exports.UserAuthenticationTypeRef = new tutanota_utils_1.TypeRef("sys", "UserAuthentication");
function createUserAuthentication(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.UserAuthentication, exports.UserAuthenticationTypeRef), values);
}
exports.createUserAuthentication = createUserAuthentication;
exports.UserDataTypeRef = new tutanota_utils_1.TypeRef("sys", "UserData");
function createUserData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.UserData, exports.UserDataTypeRef), values);
}
exports.createUserData = createUserData;
exports.UserDataDeleteTypeRef = new tutanota_utils_1.TypeRef("sys", "UserDataDelete");
function createUserDataDelete(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.UserDataDelete, exports.UserDataDeleteTypeRef), values);
}
exports.createUserDataDelete = createUserDataDelete;
exports.UserExternalAuthInfoTypeRef = new tutanota_utils_1.TypeRef("sys", "UserExternalAuthInfo");
function createUserExternalAuthInfo(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.UserExternalAuthInfo, exports.UserExternalAuthInfoTypeRef), values);
}
exports.createUserExternalAuthInfo = createUserExternalAuthInfo;
exports.UserGroupRootTypeRef = new tutanota_utils_1.TypeRef("sys", "UserGroupRoot");
function createUserGroupRoot(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.UserGroupRoot, exports.UserGroupRootTypeRef), values);
}
exports.createUserGroupRoot = createUserGroupRoot;
exports.UserIdDataTypeRef = new tutanota_utils_1.TypeRef("sys", "UserIdData");
function createUserIdData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.UserIdData, exports.UserIdDataTypeRef), values);
}
exports.createUserIdData = createUserIdData;
exports.UserIdReturnTypeRef = new tutanota_utils_1.TypeRef("sys", "UserIdReturn");
function createUserIdReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.UserIdReturn, exports.UserIdReturnTypeRef), values);
}
exports.createUserIdReturn = createUserIdReturn;
exports.UserReturnTypeRef = new tutanota_utils_1.TypeRef("sys", "UserReturn");
function createUserReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.UserReturn, exports.UserReturnTypeRef), values);
}
exports.createUserReturn = createUserReturn;
exports.VariableExternalAuthInfoTypeRef = new tutanota_utils_1.TypeRef("sys", "VariableExternalAuthInfo");
function createVariableExternalAuthInfo(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.VariableExternalAuthInfo, exports.VariableExternalAuthInfoTypeRef), values);
}
exports.createVariableExternalAuthInfo = createVariableExternalAuthInfo;
exports.VerifyRegistrationCodeDataTypeRef = new tutanota_utils_1.TypeRef("sys", "VerifyRegistrationCodeData");
function createVerifyRegistrationCodeData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.VerifyRegistrationCodeData, exports.VerifyRegistrationCodeDataTypeRef), values);
}
exports.createVerifyRegistrationCodeData = createVerifyRegistrationCodeData;
exports.VersionTypeRef = new tutanota_utils_1.TypeRef("sys", "Version");
function createVersion(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.Version, exports.VersionTypeRef), values);
}
exports.createVersion = createVersion;
exports.VersionDataTypeRef = new tutanota_utils_1.TypeRef("sys", "VersionData");
function createVersionData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.VersionData, exports.VersionDataTypeRef), values);
}
exports.createVersionData = createVersionData;
exports.VersionInfoTypeRef = new tutanota_utils_1.TypeRef("sys", "VersionInfo");
function createVersionInfo(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.VersionInfo, exports.VersionInfoTypeRef), values);
}
exports.createVersionInfo = createVersionInfo;
exports.VersionReturnTypeRef = new tutanota_utils_1.TypeRef("sys", "VersionReturn");
function createVersionReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.VersionReturn, exports.VersionReturnTypeRef), values);
}
exports.createVersionReturn = createVersionReturn;
exports.WebauthnResponseDataTypeRef = new tutanota_utils_1.TypeRef("sys", "WebauthnResponseData");
function createWebauthnResponseData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.WebauthnResponseData, exports.WebauthnResponseDataTypeRef), values);
}
exports.createWebauthnResponseData = createWebauthnResponseData;
exports.WebsocketCounterDataTypeRef = new tutanota_utils_1.TypeRef("sys", "WebsocketCounterData");
function createWebsocketCounterData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.WebsocketCounterData, exports.WebsocketCounterDataTypeRef), values);
}
exports.createWebsocketCounterData = createWebsocketCounterData;
exports.WebsocketCounterValueTypeRef = new tutanota_utils_1.TypeRef("sys", "WebsocketCounterValue");
function createWebsocketCounterValue(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.WebsocketCounterValue, exports.WebsocketCounterValueTypeRef), values);
}
exports.createWebsocketCounterValue = createWebsocketCounterValue;
exports.WebsocketEntityDataTypeRef = new tutanota_utils_1.TypeRef("sys", "WebsocketEntityData");
function createWebsocketEntityData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.WebsocketEntityData, exports.WebsocketEntityDataTypeRef), values);
}
exports.createWebsocketEntityData = createWebsocketEntityData;
exports.WebsocketLeaderStatusTypeRef = new tutanota_utils_1.TypeRef("sys", "WebsocketLeaderStatus");
function createWebsocketLeaderStatus(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.WebsocketLeaderStatus, exports.WebsocketLeaderStatusTypeRef), values);
}
exports.createWebsocketLeaderStatus = createWebsocketLeaderStatus;
exports.WhitelabelChildTypeRef = new tutanota_utils_1.TypeRef("sys", "WhitelabelChild");
function createWhitelabelChild(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.WhitelabelChild, exports.WhitelabelChildTypeRef), values);
}
exports.createWhitelabelChild = createWhitelabelChild;
exports.WhitelabelChildrenRefTypeRef = new tutanota_utils_1.TypeRef("sys", "WhitelabelChildrenRef");
function createWhitelabelChildrenRef(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.WhitelabelChildrenRef, exports.WhitelabelChildrenRefTypeRef), values);
}
exports.createWhitelabelChildrenRef = createWhitelabelChildrenRef;
exports.WhitelabelConfigTypeRef = new tutanota_utils_1.TypeRef("sys", "WhitelabelConfig");
function createWhitelabelConfig(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.WhitelabelConfig, exports.WhitelabelConfigTypeRef), values);
}
exports.createWhitelabelConfig = createWhitelabelConfig;
exports.WhitelabelParentTypeRef = new tutanota_utils_1.TypeRef("sys", "WhitelabelParent");
function createWhitelabelParent(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.WhitelabelParent, exports.WhitelabelParentTypeRef), values);
}
exports.createWhitelabelParent = createWhitelabelParent;
