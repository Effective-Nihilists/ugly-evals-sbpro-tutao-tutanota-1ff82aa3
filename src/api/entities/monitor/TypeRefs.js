"use strict";
exports.__esModule = true;
exports.createWriteCounterData = exports.WriteCounterDataTypeRef = exports.createReadCounterReturn = exports.ReadCounterReturnTypeRef = exports.createReadCounterData = exports.ReadCounterDataTypeRef = exports.createApprovalMail = exports.ApprovalMailTypeRef = void 0;
var EntityUtils_js_1 = require("../../common/utils/EntityUtils.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var TypeModels_js_1 = require("./TypeModels.js");
exports.ApprovalMailTypeRef = new tutanota_utils_1.TypeRef("monitor", "ApprovalMail");
function createApprovalMail(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.ApprovalMail, exports.ApprovalMailTypeRef), values);
}
exports.createApprovalMail = createApprovalMail;
exports.ReadCounterDataTypeRef = new tutanota_utils_1.TypeRef("monitor", "ReadCounterData");
function createReadCounterData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.ReadCounterData, exports.ReadCounterDataTypeRef), values);
}
exports.createReadCounterData = createReadCounterData;
exports.ReadCounterReturnTypeRef = new tutanota_utils_1.TypeRef("monitor", "ReadCounterReturn");
function createReadCounterReturn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.ReadCounterReturn, exports.ReadCounterReturnTypeRef), values);
}
exports.createReadCounterReturn = createReadCounterReturn;
exports.WriteCounterDataTypeRef = new tutanota_utils_1.TypeRef("monitor", "WriteCounterData");
function createWriteCounterData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.WriteCounterData, exports.WriteCounterDataTypeRef), values);
}
exports.createWriteCounterData = createWriteCounterData;
