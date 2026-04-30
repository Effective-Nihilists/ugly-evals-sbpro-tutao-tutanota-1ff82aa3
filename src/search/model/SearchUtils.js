"use strict";
exports.__esModule = true;
exports.isAdministratedGroup = exports.getRestriction = exports.createRestriction = exports.getFreeSearchStartDate = exports.getSearchUrl = exports.setSearchUrl = exports.SEARCH_MAIL_FIELDS = exports.SEARCH_CATEGORIES = void 0;
var mithril_1 = require("mithril");
var TypeRefs_js_1 = require("../../api/entities/sys/TypeRefs.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var LoginController_1 = require("../../api/main/LoginController");
var RouteChange_1 = require("../../misc/RouteChange");
var Env_1 = require("../../api/common/Env");
var TypeRefs_1 = require("../../api/entities/tutanota/TypeRefs");
var TypeModels_js_1 = require("../../api/entities/tutanota/TypeModels.js");
(0, Env_1.assertMainOrNode)();
var FIXED_FREE_SEARCH_DAYS = 28;
exports.SEARCH_CATEGORIES = [
    {
        name: "mail",
        typeRef: TypeRefs_1.MailTypeRef
    },
    {
        name: "contact",
        typeRef: TypeRefs_1.ContactTypeRef
    },
    {
        name: "groupinfo",
        typeRef: TypeRefs_js_1.GroupInfoTypeRef
    },
    {
        name: "whitelabelchild",
        typeRef: TypeRefs_js_1.WhitelabelChildTypeRef
    },
];
exports.SEARCH_MAIL_FIELDS = [
    {
        textId: "all_label",
        field: null,
        attributeIds: null
    },
    {
        textId: "subject_label",
        field: "subject",
        attributeIds: [TypeModels_js_1.typeModels.Mail.values["subject"].id]
    },
    {
        textId: "mailBody_label",
        field: "body",
        attributeIds: [TypeModels_js_1.typeModels.Mail.associations["body"].id]
    },
    {
        textId: "from_label",
        field: "from",
        attributeIds: [TypeModels_js_1.typeModels.Mail.associations["sender"].id]
    },
    {
        textId: "to_label",
        field: "to",
        attributeIds: [
            TypeModels_js_1.typeModels.Mail.associations["toRecipients"].id,
            TypeModels_js_1.typeModels.Mail.associations["ccRecipients"].id,
            TypeModels_js_1.typeModels.Mail.associations["bccRecipients"].id,
        ]
    },
    {
        textId: "attachmentName_label",
        field: "attachment",
        attributeIds: [TypeModels_js_1.typeModels.Mail.associations["attachments"].id]
    },
];
var routeSetThrottled = (0, RouteChange_1.throttleRoute)();
function setSearchUrl(url) {
    if (url !== mithril_1["default"].route.get()) {
        routeSetThrottled(url);
    }
}
exports.setSearchUrl = setSearchUrl;
function getSearchUrl(query, restriction, selectedId) {
    var category = (0, tutanota_utils_1.neverNull)(exports.SEARCH_CATEGORIES.find(function (c) { return (0, tutanota_utils_1.isSameTypeRef)(c.typeRef, restriction.type); })).name;
    var url = "/search/" + category + (selectedId ? "/" + selectedId : "") + "?query=" + encodeURIComponent(query || "");
    if (restriction.start) {
        url += "&start=" + restriction.start;
    }
    if (restriction.end) {
        url += "&end=" + restriction.end;
    }
    if (restriction.listId) {
        url += "&list=" + restriction.listId;
    }
    if (restriction.field) {
        url += "&field=" + restriction.field;
    }
    return url;
}
exports.getSearchUrl = getSearchUrl;
function getFreeSearchStartDate() {
    return (0, tutanota_utils_1.getStartOfDay)((0, tutanota_utils_1.getDayShifted)(new Date(), -FIXED_FREE_SEARCH_DAYS));
}
exports.getFreeSearchStartDate = getFreeSearchStartDate;
/**
 * Adjusts the restriction according to the account type if necessary
 */
function createRestriction(searchCategory, start, end, field, listId) {
    if (LoginController_1.logins.getUserController().isFreeAccount() && searchCategory === "mail") {
        start = null;
        end = getFreeSearchStartDate().getTime();
        field = null;
        listId = null;
    }
    var r = {
        type: (0, tutanota_utils_1.neverNull)(exports.SEARCH_CATEGORIES.find(function (c) { return c.name === searchCategory; })).typeRef,
        start: start,
        end: end,
        field: null,
        attributeIds: null,
        listId: listId
    };
    if (field && searchCategory === "mail") {
        var fieldData = exports.SEARCH_MAIL_FIELDS.find(function (f) { return f.field === field; });
        if (fieldData) {
            r.field = field;
            r.attributeIds = fieldData.attributeIds;
        }
    }
    else if (field && searchCategory === "contact") {
        if (field === "recipient") {
            r.field = field;
            r.attributeIds = [TypeModels_js_1.typeModels.Contact.values["firstName"].id, TypeModels_js_1.typeModels.Contact.values["lastName"].id, TypeModels_js_1.typeModels.Contact.associations["mailAddresses"].id];
        }
        else if (field === "mailAddress") {
            r.field = field;
            r.attributeIds = [TypeModels_js_1.typeModels.Contact.associations["mailAddresses"].id];
        }
    }
    return r;
}
exports.createRestriction = createRestriction;
/**
 * Adjusts the restriction according to the account type if necessary
 */
function getRestriction(route) {
    var category = "mail";
    var start = null;
    var end = null;
    var field = null;
    var listId = null;
    if (route.startsWith("/mail") || route.startsWith("/search/mail")) {
        category = "mail";
        if (route.startsWith("/search/mail")) {
            try {
                var startString = getValueFromRoute(route, "start");
                if (startString) {
                    start = Number(startString);
                }
                var endString = getValueFromRoute(route, "end");
                if (endString) {
                    end = Number(endString);
                }
                var fieldString_1 = getValueFromRoute(route, "field");
                var fieldData = exports.SEARCH_MAIL_FIELDS.find(function (f) { return f.field === fieldString_1; });
                if (fieldData) {
                    field = fieldString_1;
                }
                var listIdString = getValueFromRoute(route, "list");
                if (listIdString) {
                    listId = listIdString;
                }
            }
            catch (e) {
                console.log("invalid query: " + route, e);
            }
        }
    }
    else if (route.startsWith("/contact") || route.startsWith("/search/contact")) {
        category = "contact";
    }
    else if (route.startsWith("/settings/users") || route.startsWith("/settings/groups")) {
        category = "groupinfo";
    }
    else if (route.startsWith("/settings/whitelabelaccounts")) {
        category = "whitelabelchild";
    }
    else {
        throw new Error("invalid type " + route);
    }
    return createRestriction(category, start, end, field, listId);
}
exports.getRestriction = getRestriction;
function getValueFromRoute(route, name) {
    var key = "&" + name + "=";
    var keyIndex = route.indexOf(key);
    if (keyIndex !== -1) {
        var valueStartIndex = keyIndex + key.length;
        var valueEndIndex = route.indexOf("&", valueStartIndex);
        var value = valueEndIndex === -1 ? route.substring(valueStartIndex) : route.substring(valueStartIndex, valueEndIndex);
        return decodeURIComponent(value);
    }
    else {
        return null;
    }
}
function isAdministratedGroup(localAdminGroupIds, gi) {
    if (gi.localAdmin && localAdminGroupIds.indexOf(gi.localAdmin) !== -1) {
        return true; // group is administrated by local admin group of this user
    }
    else if (localAdminGroupIds.indexOf(gi.group) !== -1) {
        return true; // group is one of the local admin groups of this user
    }
    else {
        return false;
    }
}
exports.isAdministratedGroup = isAdministratedGroup;
