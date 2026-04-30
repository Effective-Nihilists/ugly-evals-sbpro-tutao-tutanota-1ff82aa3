"use strict";
exports.__esModule = true;
exports.createUsageTestStage = exports.UsageTestStageTypeRef = exports.createUsageTestParticipationIn = exports.UsageTestParticipationInTypeRef = exports.createUsageTestMetricData = exports.UsageTestMetricDataTypeRef = exports.createUsageTestMetricConfigValue = exports.UsageTestMetricConfigValueTypeRef = exports.createUsageTestMetricConfig = exports.UsageTestMetricConfigTypeRef = exports.createUsageTestAssignmentOut = exports.UsageTestAssignmentOutTypeRef = exports.createUsageTestAssignmentIn = exports.UsageTestAssignmentInTypeRef = exports.createUsageTestAssignment = exports.UsageTestAssignmentTypeRef = void 0;
var EntityUtils_js_1 = require("../../common/utils/EntityUtils.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var TypeModels_js_1 = require("./TypeModels.js");
exports.UsageTestAssignmentTypeRef = new tutanota_utils_1.TypeRef("usage", "UsageTestAssignment");
function createUsageTestAssignment(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.UsageTestAssignment, exports.UsageTestAssignmentTypeRef), values);
}
exports.createUsageTestAssignment = createUsageTestAssignment;
exports.UsageTestAssignmentInTypeRef = new tutanota_utils_1.TypeRef("usage", "UsageTestAssignmentIn");
function createUsageTestAssignmentIn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.UsageTestAssignmentIn, exports.UsageTestAssignmentInTypeRef), values);
}
exports.createUsageTestAssignmentIn = createUsageTestAssignmentIn;
exports.UsageTestAssignmentOutTypeRef = new tutanota_utils_1.TypeRef("usage", "UsageTestAssignmentOut");
function createUsageTestAssignmentOut(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.UsageTestAssignmentOut, exports.UsageTestAssignmentOutTypeRef), values);
}
exports.createUsageTestAssignmentOut = createUsageTestAssignmentOut;
exports.UsageTestMetricConfigTypeRef = new tutanota_utils_1.TypeRef("usage", "UsageTestMetricConfig");
function createUsageTestMetricConfig(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.UsageTestMetricConfig, exports.UsageTestMetricConfigTypeRef), values);
}
exports.createUsageTestMetricConfig = createUsageTestMetricConfig;
exports.UsageTestMetricConfigValueTypeRef = new tutanota_utils_1.TypeRef("usage", "UsageTestMetricConfigValue");
function createUsageTestMetricConfigValue(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.UsageTestMetricConfigValue, exports.UsageTestMetricConfigValueTypeRef), values);
}
exports.createUsageTestMetricConfigValue = createUsageTestMetricConfigValue;
exports.UsageTestMetricDataTypeRef = new tutanota_utils_1.TypeRef("usage", "UsageTestMetricData");
function createUsageTestMetricData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.UsageTestMetricData, exports.UsageTestMetricDataTypeRef), values);
}
exports.createUsageTestMetricData = createUsageTestMetricData;
exports.UsageTestParticipationInTypeRef = new tutanota_utils_1.TypeRef("usage", "UsageTestParticipationIn");
function createUsageTestParticipationIn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.UsageTestParticipationIn, exports.UsageTestParticipationInTypeRef), values);
}
exports.createUsageTestParticipationIn = createUsageTestParticipationIn;
exports.UsageTestStageTypeRef = new tutanota_utils_1.TypeRef("usage", "UsageTestStage");
function createUsageTestStage(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.UsageTestStage, exports.UsageTestStageTypeRef), values);
}
exports.createUsageTestStage = createUsageTestStage;
