"use strict";
exports.__esModule = true;
exports.UserAccountService = exports.TemplateGroupService = exports.SendDraftService = exports.ReportMailService = exports.ReceiveInfoService = exports.MoveMailService = exports.MailService = exports.MailGroupService = exports.MailFolderService = exports.LocalAdminGroupService = exports.ListUnsubscribeService = exports.GroupInvitationService = exports.FileDataService = exports.ExternalUserService = exports.EntropyService = exports.EncryptTutanotaPropertiesService = exports.DraftService = exports.CustomerAccountService = exports.ContactFormAccountService = exports.CalendarService = void 0;
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
exports.CalendarService = Object.freeze({
    app: "tutanota",
    name: "CalendarService",
    get: null,
    post: { data: TypeRefs_js_1.UserAreaGroupPostDataTypeRef, "return": TypeRefs_js_2.CreateGroupPostReturnTypeRef },
    put: null,
    "delete": { data: TypeRefs_js_3.CalendarDeleteDataTypeRef, "return": null }
});
exports.ContactFormAccountService = Object.freeze({
    app: "tutanota",
    name: "ContactFormAccountService",
    get: null,
    post: { data: TypeRefs_js_4.ContactFormAccountDataTypeRef, "return": TypeRefs_js_5.ContactFormAccountReturnTypeRef },
    put: null,
    "delete": null
});
exports.CustomerAccountService = Object.freeze({
    app: "tutanota",
    name: "CustomerAccountService",
    get: null,
    post: { data: TypeRefs_js_6.CustomerAccountCreateDataTypeRef, "return": null },
    put: null,
    "delete": null
});
exports.DraftService = Object.freeze({
    app: "tutanota",
    name: "DraftService",
    get: null,
    post: { data: TypeRefs_js_7.DraftCreateDataTypeRef, "return": TypeRefs_js_8.DraftCreateReturnTypeRef },
    put: { data: TypeRefs_js_9.DraftUpdateDataTypeRef, "return": TypeRefs_js_10.DraftUpdateReturnTypeRef },
    "delete": null
});
exports.EncryptTutanotaPropertiesService = Object.freeze({
    app: "tutanota",
    name: "EncryptTutanotaPropertiesService",
    get: null,
    post: { data: TypeRefs_js_11.EncryptTutanotaPropertiesDataTypeRef, "return": null },
    put: null,
    "delete": null
});
exports.EntropyService = Object.freeze({
    app: "tutanota",
    name: "EntropyService",
    get: null,
    post: null,
    put: { data: TypeRefs_js_12.EntropyDataTypeRef, "return": null },
    "delete": null
});
exports.ExternalUserService = Object.freeze({
    app: "tutanota",
    name: "ExternalUserService",
    get: null,
    post: { data: TypeRefs_js_13.ExternalUserDataTypeRef, "return": null },
    put: null,
    "delete": null
});
exports.FileDataService = Object.freeze({
    app: "tutanota",
    name: "FileDataService",
    get: { data: TypeRefs_js_14.FileDataDataGetTypeRef, "return": null },
    post: { data: TypeRefs_js_15.FileDataDataPostTypeRef, "return": TypeRefs_js_16.FileDataReturnPostTypeRef },
    put: { data: TypeRefs_js_17.FileDataDataReturnTypeRef, "return": null },
    "delete": null
});
exports.GroupInvitationService = Object.freeze({
    app: "tutanota",
    name: "GroupInvitationService",
    get: null,
    post: { data: TypeRefs_js_18.GroupInvitationPostDataTypeRef, "return": TypeRefs_js_19.GroupInvitationPostReturnTypeRef },
    put: { data: TypeRefs_js_20.GroupInvitationPutDataTypeRef, "return": null },
    "delete": { data: TypeRefs_js_21.GroupInvitationDeleteDataTypeRef, "return": null }
});
exports.ListUnsubscribeService = Object.freeze({
    app: "tutanota",
    name: "ListUnsubscribeService",
    get: null,
    post: { data: TypeRefs_js_22.ListUnsubscribeDataTypeRef, "return": null },
    put: null,
    "delete": null
});
exports.LocalAdminGroupService = Object.freeze({
    app: "tutanota",
    name: "LocalAdminGroupService",
    get: null,
    post: { data: TypeRefs_js_23.CreateLocalAdminGroupDataTypeRef, "return": null },
    put: null,
    "delete": { data: TypeRefs_js_24.DeleteGroupDataTypeRef, "return": null }
});
exports.MailFolderService = Object.freeze({
    app: "tutanota",
    name: "MailFolderService",
    get: null,
    post: { data: TypeRefs_js_25.CreateMailFolderDataTypeRef, "return": TypeRefs_js_26.CreateMailFolderReturnTypeRef },
    put: null,
    "delete": { data: TypeRefs_js_27.DeleteMailFolderDataTypeRef, "return": null }
});
exports.MailGroupService = Object.freeze({
    app: "tutanota",
    name: "MailGroupService",
    get: null,
    post: { data: TypeRefs_js_28.CreateMailGroupDataTypeRef, "return": null },
    put: null,
    "delete": { data: TypeRefs_js_24.DeleteGroupDataTypeRef, "return": null }
});
exports.MailService = Object.freeze({
    app: "tutanota",
    name: "MailService",
    get: null,
    post: null,
    put: null,
    "delete": { data: TypeRefs_js_29.DeleteMailDataTypeRef, "return": null }
});
exports.MoveMailService = Object.freeze({
    app: "tutanota",
    name: "MoveMailService",
    get: null,
    post: { data: TypeRefs_js_30.MoveMailDataTypeRef, "return": null },
    put: null,
    "delete": null
});
exports.ReceiveInfoService = Object.freeze({
    app: "tutanota",
    name: "ReceiveInfoService",
    get: null,
    post: { data: TypeRefs_js_31.ReceiveInfoServiceDataTypeRef, "return": null },
    put: null,
    "delete": null
});
exports.ReportMailService = Object.freeze({
    app: "tutanota",
    name: "ReportMailService",
    get: null,
    post: { data: TypeRefs_js_32.ReportMailPostDataTypeRef, "return": null },
    put: null,
    "delete": null
});
exports.SendDraftService = Object.freeze({
    app: "tutanota",
    name: "SendDraftService",
    get: null,
    post: { data: TypeRefs_js_33.SendDraftDataTypeRef, "return": TypeRefs_js_34.SendDraftReturnTypeRef },
    put: null,
    "delete": null
});
exports.TemplateGroupService = Object.freeze({
    app: "tutanota",
    name: "TemplateGroupService",
    get: null,
    post: { data: TypeRefs_js_1.UserAreaGroupPostDataTypeRef, "return": TypeRefs_js_2.CreateGroupPostReturnTypeRef },
    put: null,
    "delete": { data: TypeRefs_js_35.UserAreaGroupDeleteDataTypeRef, "return": null }
});
exports.UserAccountService = Object.freeze({
    app: "tutanota",
    name: "UserAccountService",
    get: null,
    post: { data: TypeRefs_js_36.UserAccountCreateDataTypeRef, "return": null },
    put: null,
    "delete": null
});
