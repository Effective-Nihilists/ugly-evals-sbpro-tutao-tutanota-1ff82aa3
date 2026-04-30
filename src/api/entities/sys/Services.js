"use strict";
exports.__esModule = true;
exports.VersionService = exports.UserService = exports.UserIdService = exports.UpgradePriceService = exports.UpdatePermissionKeyService = exports.UpdateAdminshipService = exports.TakeOverDeletedAddressService = exports.SystemKeysService = exports.SwitchAccountTypeService = exports.SignOrderProcessingAgreementService = exports.SessionService = exports.SecondFactorAuthService = exports.SecondFactorAuthAllowedService = exports.SaltService = exports.ResetPasswordService = exports.ResetFactorsService = exports.RegistrationService = exports.RegistrationCaptchaService = exports.PublicKeyService = exports.PriceService = exports.PremiumFeatureService = exports.PdfInvoiceService = exports.PaymentDataService = exports.MembershipService = exports.MailAddressAvailabilityService = exports.MailAddressAliasService = exports.LocationService = exports.GiftCardService = exports.GiftCardRedeemService = exports.ExternalPropertiesService = exports.DomainMailAddressAvailabilityService = exports.DebitService = exports.CustomerService = exports.CustomerPublicKeyService = exports.CustomerInfoService = exports.CustomerAccountTerminationService = exports.CustomDomainService = exports.CustomDomainCheckService = exports.CreateCustomerServerProperties = exports.CloseSessionService = exports.ChangePasswordService = exports.BrandingDomainService = exports.BookingService = exports.AutoLoginService = exports.AlarmService = void 0;
var TypeRefs_js_1 = require("./TypeRefs.js");
var TypeRefs_js_2 = require("./TypeRefs.js");
var TypeRefs_js_3 = require("./TypeRefs.js");
var TypeRefs_js_4 = require("./TypeRefs.js");
var TypeRefs_js_5 = require("./TypeRefs.js");
var TypeRefs_js_6 = require("./TypeRefs.js");
var TypeRefs_js_7 = require("./TypeRefs.js");
var TypeRefs_js_8 = require("./TypeRefs.js");
var TypeRefs_js_9 = require("./TypeRefs.js");
var TypeRefs_js_10 = require("./TypeRefs.js");
var TypeRefs_js_11 = require("./TypeRefs.js");
var TypeRefs_js_12 = require("./TypeRefs.js");
var TypeRefs_js_13 = require("./TypeRefs.js");
var TypeRefs_js_14 = require("./TypeRefs.js");
var TypeRefs_js_15 = require("./TypeRefs.js");
var TypeRefs_js_16 = require("./TypeRefs.js");
var TypeRefs_js_17 = require("./TypeRefs.js");
var TypeRefs_js_18 = require("./TypeRefs.js");
var TypeRefs_js_19 = require("./TypeRefs.js");
var TypeRefs_js_20 = require("./TypeRefs.js");
var TypeRefs_js_21 = require("./TypeRefs.js");
var TypeRefs_js_22 = require("./TypeRefs.js");
var TypeRefs_js_23 = require("./TypeRefs.js");
var TypeRefs_js_24 = require("./TypeRefs.js");
var TypeRefs_js_25 = require("./TypeRefs.js");
var TypeRefs_js_26 = require("./TypeRefs.js");
var TypeRefs_js_27 = require("./TypeRefs.js");
var TypeRefs_js_28 = require("./TypeRefs.js");
var TypeRefs_js_29 = require("./TypeRefs.js");
var TypeRefs_js_30 = require("./TypeRefs.js");
var TypeRefs_js_31 = require("./TypeRefs.js");
var TypeRefs_js_32 = require("./TypeRefs.js");
var TypeRefs_js_33 = require("./TypeRefs.js");
var TypeRefs_js_34 = require("./TypeRefs.js");
var TypeRefs_js_35 = require("./TypeRefs.js");
var TypeRefs_js_36 = require("./TypeRefs.js");
var TypeRefs_js_37 = require("./TypeRefs.js");
var TypeRefs_js_38 = require("./TypeRefs.js");
var TypeRefs_js_39 = require("./TypeRefs.js");
var TypeRefs_js_40 = require("./TypeRefs.js");
var TypeRefs_js_41 = require("./TypeRefs.js");
var TypeRefs_js_42 = require("./TypeRefs.js");
var TypeRefs_js_43 = require("./TypeRefs.js");
var TypeRefs_js_44 = require("./TypeRefs.js");
var TypeRefs_js_45 = require("./TypeRefs.js");
var TypeRefs_js_46 = require("./TypeRefs.js");
var TypeRefs_js_47 = require("./TypeRefs.js");
var TypeRefs_js_48 = require("./TypeRefs.js");
var TypeRefs_js_49 = require("./TypeRefs.js");
var TypeRefs_js_50 = require("./TypeRefs.js");
var TypeRefs_js_51 = require("./TypeRefs.js");
var TypeRefs_js_52 = require("./TypeRefs.js");
var TypeRefs_js_53 = require("./TypeRefs.js");
var TypeRefs_js_54 = require("./TypeRefs.js");
var TypeRefs_js_55 = require("./TypeRefs.js");
var TypeRefs_js_56 = require("./TypeRefs.js");
var TypeRefs_js_57 = require("./TypeRefs.js");
var TypeRefs_js_58 = require("./TypeRefs.js");
var TypeRefs_js_59 = require("./TypeRefs.js");
var TypeRefs_js_60 = require("./TypeRefs.js");
var TypeRefs_js_61 = require("./TypeRefs.js");
var TypeRefs_js_62 = require("./TypeRefs.js");
var TypeRefs_js_63 = require("./TypeRefs.js");
var TypeRefs_js_64 = require("./TypeRefs.js");
var TypeRefs_js_65 = require("./TypeRefs.js");
var TypeRefs_js_66 = require("./TypeRefs.js");
var TypeRefs_js_67 = require("./TypeRefs.js");
var TypeRefs_js_68 = require("./TypeRefs.js");
var TypeRefs_js_69 = require("./TypeRefs.js");
var TypeRefs_js_70 = require("./TypeRefs.js");
var TypeRefs_js_71 = require("./TypeRefs.js");
var TypeRefs_js_72 = require("./TypeRefs.js");
var TypeRefs_js_73 = require("./TypeRefs.js");
var TypeRefs_js_74 = require("./TypeRefs.js");
var TypeRefs_js_75 = require("./TypeRefs.js");
var TypeRefs_js_76 = require("./TypeRefs.js");
var TypeRefs_js_77 = require("./TypeRefs.js");
var TypeRefs_js_78 = require("./TypeRefs.js");
var TypeRefs_js_79 = require("./TypeRefs.js");
var TypeRefs_js_80 = require("./TypeRefs.js");
var TypeRefs_js_81 = require("./TypeRefs.js");
var TypeRefs_js_82 = require("./TypeRefs.js");
var TypeRefs_js_83 = require("./TypeRefs.js");
var TypeRefs_js_84 = require("./TypeRefs.js");
var TypeRefs_js_85 = require("./TypeRefs.js");
exports.AlarmService = Object.freeze({
    app: "sys",
    name: "AlarmService",
    get: null,
    post: { data: TypeRefs_js_1.AlarmServicePostTypeRef, "return": null },
    put: null,
    "delete": null
});
exports.AutoLoginService = Object.freeze({
    app: "sys",
    name: "AutoLoginService",
    get: { data: TypeRefs_js_2.AutoLoginDataGetTypeRef, "return": TypeRefs_js_3.AutoLoginDataReturnTypeRef },
    post: { data: TypeRefs_js_3.AutoLoginDataReturnTypeRef, "return": TypeRefs_js_4.AutoLoginPostReturnTypeRef },
    put: null,
    "delete": { data: TypeRefs_js_5.AutoLoginDataDeleteTypeRef, "return": null }
});
exports.BookingService = Object.freeze({
    app: "sys",
    name: "BookingService",
    get: null,
    post: { data: TypeRefs_js_6.BookingServiceDataTypeRef, "return": null },
    put: null,
    "delete": null
});
exports.BrandingDomainService = Object.freeze({
    app: "sys",
    name: "BrandingDomainService",
    get: { data: null, "return": TypeRefs_js_7.BrandingDomainGetReturnTypeRef },
    post: { data: TypeRefs_js_8.BrandingDomainDataTypeRef, "return": null },
    put: { data: TypeRefs_js_8.BrandingDomainDataTypeRef, "return": null },
    "delete": { data: TypeRefs_js_9.BrandingDomainDeleteDataTypeRef, "return": null }
});
exports.ChangePasswordService = Object.freeze({
    app: "sys",
    name: "ChangePasswordService",
    get: null,
    post: { data: TypeRefs_js_10.ChangePasswordDataTypeRef, "return": null },
    put: null,
    "delete": null
});
exports.CloseSessionService = Object.freeze({
    app: "sys",
    name: "CloseSessionService",
    get: null,
    post: { data: TypeRefs_js_11.CloseSessionServicePostTypeRef, "return": null },
    put: null,
    "delete": null
});
exports.CreateCustomerServerProperties = Object.freeze({
    app: "sys",
    name: "CreateCustomerServerProperties",
    get: null,
    post: { data: TypeRefs_js_12.CreateCustomerServerPropertiesDataTypeRef, "return": TypeRefs_js_13.CreateCustomerServerPropertiesReturnTypeRef },
    put: null,
    "delete": null
});
exports.CustomDomainCheckService = Object.freeze({
    app: "sys",
    name: "CustomDomainCheckService",
    get: { data: TypeRefs_js_14.CustomDomainCheckDataTypeRef, "return": TypeRefs_js_15.CustomDomainCheckReturnTypeRef },
    post: null,
    put: null,
    "delete": null
});
exports.CustomDomainService = Object.freeze({
    app: "sys",
    name: "CustomDomainService",
    get: null,
    post: { data: TypeRefs_js_16.CustomDomainDataTypeRef, "return": TypeRefs_js_17.CustomDomainReturnTypeRef },
    put: { data: TypeRefs_js_16.CustomDomainDataTypeRef, "return": null },
    "delete": { data: TypeRefs_js_16.CustomDomainDataTypeRef, "return": null }
});
exports.CustomerAccountTerminationService = Object.freeze({
    app: "sys",
    name: "CustomerAccountTerminationService",
    get: null,
    post: { data: TypeRefs_js_18.CustomerAccountTerminationPostInTypeRef, "return": TypeRefs_js_19.CustomerAccountTerminationPostOutTypeRef },
    put: null,
    "delete": null
});
exports.CustomerInfoService = Object.freeze({
    app: "sys",
    name: "CustomerInfoService",
    get: { data: null, "return": TypeRefs_js_20.CustomerInfoReturnTypeRef },
    post: null,
    put: null,
    "delete": null
});
exports.CustomerPublicKeyService = Object.freeze({
    app: "sys",
    name: "CustomerPublicKeyService",
    get: { data: null, "return": TypeRefs_js_21.PublicKeyReturnTypeRef },
    post: null,
    put: null,
    "delete": null
});
exports.CustomerService = Object.freeze({
    app: "sys",
    name: "CustomerService",
    get: null,
    post: { data: TypeRefs_js_22.CustomerDataTypeRef, "return": TypeRefs_js_23.CustomerReturnTypeRef },
    put: null,
    "delete": { data: TypeRefs_js_24.DeleteCustomerDataTypeRef, "return": null }
});
exports.DebitService = Object.freeze({
    app: "sys",
    name: "DebitService",
    get: null,
    post: null,
    put: { data: TypeRefs_js_25.DebitServicePutDataTypeRef, "return": null },
    "delete": null
});
exports.DomainMailAddressAvailabilityService = Object.freeze({
    app: "sys",
    name: "DomainMailAddressAvailabilityService",
    get: { data: TypeRefs_js_26.DomainMailAddressAvailabilityDataTypeRef, "return": TypeRefs_js_27.DomainMailAddressAvailabilityReturnTypeRef },
    post: null,
    put: null,
    "delete": null
});
exports.ExternalPropertiesService = Object.freeze({
    app: "sys",
    name: "ExternalPropertiesService",
    get: { data: null, "return": TypeRefs_js_28.ExternalPropertiesReturnTypeRef },
    post: null,
    put: null,
    "delete": null
});
exports.GiftCardRedeemService = Object.freeze({
    app: "sys",
    name: "GiftCardRedeemService",
    get: { data: TypeRefs_js_29.GiftCardRedeemDataTypeRef, "return": TypeRefs_js_30.GiftCardRedeemGetReturnTypeRef },
    post: { data: TypeRefs_js_29.GiftCardRedeemDataTypeRef, "return": null },
    put: null,
    "delete": null
});
exports.GiftCardService = Object.freeze({
    app: "sys",
    name: "GiftCardService",
    get: { data: null, "return": TypeRefs_js_31.GiftCardGetReturnTypeRef },
    post: { data: TypeRefs_js_32.GiftCardCreateDataTypeRef, "return": TypeRefs_js_33.GiftCardCreateReturnTypeRef },
    put: null,
    "delete": { data: TypeRefs_js_34.GiftCardDeleteDataTypeRef, "return": null }
});
exports.LocationService = Object.freeze({
    app: "sys",
    name: "LocationService",
    get: { data: null, "return": TypeRefs_js_35.LocationServiceGetReturnTypeRef },
    post: null,
    put: null,
    "delete": null
});
exports.MailAddressAliasService = Object.freeze({
    app: "sys",
    name: "MailAddressAliasService",
    get: { data: null, "return": TypeRefs_js_36.MailAddressAliasServiceReturnTypeRef },
    post: { data: TypeRefs_js_37.MailAddressAliasServiceDataTypeRef, "return": null },
    put: null,
    "delete": { data: TypeRefs_js_38.MailAddressAliasServiceDataDeleteTypeRef, "return": null }
});
exports.MailAddressAvailabilityService = Object.freeze({
    app: "sys",
    name: "MailAddressAvailabilityService",
    get: { data: TypeRefs_js_39.MailAddressAvailabilityDataTypeRef, "return": TypeRefs_js_40.MailAddressAvailabilityReturnTypeRef },
    post: null,
    put: null,
    "delete": null
});
exports.MembershipService = Object.freeze({
    app: "sys",
    name: "MembershipService",
    get: null,
    post: { data: TypeRefs_js_41.MembershipAddDataTypeRef, "return": null },
    put: null,
    "delete": { data: TypeRefs_js_42.MembershipRemoveDataTypeRef, "return": null }
});
exports.PaymentDataService = Object.freeze({
    app: "sys",
    name: "PaymentDataService",
    get: { data: TypeRefs_js_43.PaymentDataServiceGetDataTypeRef, "return": TypeRefs_js_44.PaymentDataServiceGetReturnTypeRef },
    post: { data: TypeRefs_js_45.PaymentDataServicePostDataTypeRef, "return": null },
    put: { data: TypeRefs_js_46.PaymentDataServicePutDataTypeRef, "return": TypeRefs_js_47.PaymentDataServicePutReturnTypeRef },
    "delete": null
});
exports.PdfInvoiceService = Object.freeze({
    app: "sys",
    name: "PdfInvoiceService",
    get: { data: TypeRefs_js_48.PdfInvoiceServiceDataTypeRef, "return": TypeRefs_js_49.PdfInvoiceServiceReturnTypeRef },
    post: null,
    put: null,
    "delete": null
});
exports.PremiumFeatureService = Object.freeze({
    app: "sys",
    name: "PremiumFeatureService",
    get: null,
    post: { data: TypeRefs_js_50.PremiumFeatureDataTypeRef, "return": TypeRefs_js_51.PremiumFeatureReturnTypeRef },
    put: null,
    "delete": null
});
exports.PriceService = Object.freeze({
    app: "sys",
    name: "PriceService",
    get: { data: TypeRefs_js_52.PriceServiceDataTypeRef, "return": TypeRefs_js_53.PriceServiceReturnTypeRef },
    post: null,
    put: null,
    "delete": null
});
exports.PublicKeyService = Object.freeze({
    app: "sys",
    name: "PublicKeyService",
    get: { data: TypeRefs_js_54.PublicKeyDataTypeRef, "return": TypeRefs_js_21.PublicKeyReturnTypeRef },
    post: null,
    put: null,
    "delete": null
});
exports.RegistrationCaptchaService = Object.freeze({
    app: "sys",
    name: "RegistrationCaptchaService",
    get: { data: TypeRefs_js_55.RegistrationCaptchaServiceGetDataTypeRef, "return": TypeRefs_js_56.RegistrationCaptchaServiceReturnTypeRef },
    post: { data: TypeRefs_js_57.RegistrationCaptchaServiceDataTypeRef, "return": null },
    put: null,
    "delete": null
});
exports.RegistrationService = Object.freeze({
    app: "sys",
    name: "RegistrationService",
    get: { data: null, "return": TypeRefs_js_58.RegistrationServiceDataTypeRef },
    post: { data: TypeRefs_js_58.RegistrationServiceDataTypeRef, "return": TypeRefs_js_59.RegistrationReturnTypeRef },
    put: null,
    "delete": null
});
exports.ResetFactorsService = Object.freeze({
    app: "sys",
    name: "ResetFactorsService",
    get: null,
    post: null,
    put: null,
    "delete": { data: TypeRefs_js_60.ResetFactorsDeleteDataTypeRef, "return": null }
});
exports.ResetPasswordService = Object.freeze({
    app: "sys",
    name: "ResetPasswordService",
    get: null,
    post: { data: TypeRefs_js_61.ResetPasswordDataTypeRef, "return": null },
    put: null,
    "delete": null
});
exports.SaltService = Object.freeze({
    app: "sys",
    name: "SaltService",
    get: { data: TypeRefs_js_62.SaltDataTypeRef, "return": TypeRefs_js_63.SaltReturnTypeRef },
    post: null,
    put: null,
    "delete": null
});
exports.SecondFactorAuthAllowedService = Object.freeze({
    app: "sys",
    name: "SecondFactorAuthAllowedService",
    get: { data: null, "return": TypeRefs_js_64.SecondFactorAuthAllowedReturnTypeRef },
    post: null,
    put: null,
    "delete": null
});
exports.SecondFactorAuthService = Object.freeze({
    app: "sys",
    name: "SecondFactorAuthService",
    get: { data: TypeRefs_js_65.SecondFactorAuthGetDataTypeRef, "return": TypeRefs_js_66.SecondFactorAuthGetReturnTypeRef },
    post: { data: TypeRefs_js_67.SecondFactorAuthDataTypeRef, "return": null },
    put: null,
    "delete": { data: TypeRefs_js_68.SecondFactorAuthDeleteDataTypeRef, "return": null }
});
exports.SessionService = Object.freeze({
    app: "sys",
    name: "SessionService",
    get: null,
    post: { data: TypeRefs_js_69.CreateSessionDataTypeRef, "return": TypeRefs_js_70.CreateSessionReturnTypeRef },
    put: null,
    "delete": null
});
exports.SignOrderProcessingAgreementService = Object.freeze({
    app: "sys",
    name: "SignOrderProcessingAgreementService",
    get: null,
    post: { data: TypeRefs_js_71.SignOrderProcessingAgreementDataTypeRef, "return": null },
    put: null,
    "delete": null
});
exports.SwitchAccountTypeService = Object.freeze({
    app: "sys",
    name: "SwitchAccountTypeService",
    get: null,
    post: { data: TypeRefs_js_72.SwitchAccountTypeDataTypeRef, "return": null },
    put: null,
    "delete": null
});
exports.SystemKeysService = Object.freeze({
    app: "sys",
    name: "SystemKeysService",
    get: { data: null, "return": TypeRefs_js_73.SystemKeysReturnTypeRef },
    post: null,
    put: null,
    "delete": null
});
exports.TakeOverDeletedAddressService = Object.freeze({
    app: "sys",
    name: "TakeOverDeletedAddressService",
    get: null,
    post: { data: TypeRefs_js_74.TakeOverDeletedAddressDataTypeRef, "return": null },
    put: null,
    "delete": null
});
exports.UpdateAdminshipService = Object.freeze({
    app: "sys",
    name: "UpdateAdminshipService",
    get: null,
    post: { data: TypeRefs_js_75.UpdateAdminshipDataTypeRef, "return": null },
    put: null,
    "delete": null
});
exports.UpdatePermissionKeyService = Object.freeze({
    app: "sys",
    name: "UpdatePermissionKeyService",
    get: null,
    post: { data: TypeRefs_js_76.UpdatePermissionKeyDataTypeRef, "return": null },
    put: null,
    "delete": null
});
exports.UpgradePriceService = Object.freeze({
    app: "sys",
    name: "UpgradePriceService",
    get: { data: TypeRefs_js_77.UpgradePriceServiceDataTypeRef, "return": TypeRefs_js_78.UpgradePriceServiceReturnTypeRef },
    post: null,
    put: null,
    "delete": null
});
exports.UserIdService = Object.freeze({
    app: "sys",
    name: "UserIdService",
    get: { data: TypeRefs_js_79.UserIdDataTypeRef, "return": TypeRefs_js_80.UserIdReturnTypeRef },
    post: null,
    put: null,
    "delete": null
});
exports.UserService = Object.freeze({
    app: "sys",
    name: "UserService",
    get: null,
    post: { data: TypeRefs_js_81.UserDataTypeRef, "return": TypeRefs_js_82.UserReturnTypeRef },
    put: null,
    "delete": { data: TypeRefs_js_83.UserDataDeleteTypeRef, "return": null }
});
exports.VersionService = Object.freeze({
    app: "sys",
    name: "VersionService",
    get: { data: TypeRefs_js_84.VersionDataTypeRef, "return": TypeRefs_js_85.VersionReturnTypeRef },
    post: null,
    put: null,
    "delete": null
});
