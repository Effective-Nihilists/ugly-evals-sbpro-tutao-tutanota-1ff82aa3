"use strict";
exports.__esModule = true;
exports.createInstanceId = exports.InstanceIdTypeRef = exports.createBlobWriteData = exports.BlobWriteDataTypeRef = exports.createBlobServerUrl = exports.BlobServerUrlTypeRef = exports.createBlobServerAccessInfo = exports.BlobServerAccessInfoTypeRef = exports.createBlobReferencePutIn = exports.BlobReferencePutInTypeRef = exports.createBlobReferenceDeleteIn = exports.BlobReferenceDeleteInTypeRef = exports.createBlobReadData = exports.BlobReadDataTypeRef = exports.createBlobPostOut = exports.BlobPostOutTypeRef = exports.createBlobId = exports.BlobIdTypeRef = exports.createBlobGetIn = exports.BlobGetInTypeRef = exports.createBlobArchiveRef = exports.BlobArchiveRefTypeRef = exports.createBlobAccessTokenPostOut = exports.BlobAccessTokenPostOutTypeRef = exports.createBlobAccessTokenPostIn = exports.BlobAccessTokenPostInTypeRef = void 0;
var EntityUtils_js_1 = require("../../common/utils/EntityUtils.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var TypeModels_js_1 = require("./TypeModels.js");
exports.BlobAccessTokenPostInTypeRef = new tutanota_utils_1.TypeRef("storage", "BlobAccessTokenPostIn");
function createBlobAccessTokenPostIn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.BlobAccessTokenPostIn, exports.BlobAccessTokenPostInTypeRef), values);
}
exports.createBlobAccessTokenPostIn = createBlobAccessTokenPostIn;
exports.BlobAccessTokenPostOutTypeRef = new tutanota_utils_1.TypeRef("storage", "BlobAccessTokenPostOut");
function createBlobAccessTokenPostOut(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.BlobAccessTokenPostOut, exports.BlobAccessTokenPostOutTypeRef), values);
}
exports.createBlobAccessTokenPostOut = createBlobAccessTokenPostOut;
exports.BlobArchiveRefTypeRef = new tutanota_utils_1.TypeRef("storage", "BlobArchiveRef");
function createBlobArchiveRef(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.BlobArchiveRef, exports.BlobArchiveRefTypeRef), values);
}
exports.createBlobArchiveRef = createBlobArchiveRef;
exports.BlobGetInTypeRef = new tutanota_utils_1.TypeRef("storage", "BlobGetIn");
function createBlobGetIn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.BlobGetIn, exports.BlobGetInTypeRef), values);
}
exports.createBlobGetIn = createBlobGetIn;
exports.BlobIdTypeRef = new tutanota_utils_1.TypeRef("storage", "BlobId");
function createBlobId(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.BlobId, exports.BlobIdTypeRef), values);
}
exports.createBlobId = createBlobId;
exports.BlobPostOutTypeRef = new tutanota_utils_1.TypeRef("storage", "BlobPostOut");
function createBlobPostOut(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.BlobPostOut, exports.BlobPostOutTypeRef), values);
}
exports.createBlobPostOut = createBlobPostOut;
exports.BlobReadDataTypeRef = new tutanota_utils_1.TypeRef("storage", "BlobReadData");
function createBlobReadData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.BlobReadData, exports.BlobReadDataTypeRef), values);
}
exports.createBlobReadData = createBlobReadData;
exports.BlobReferenceDeleteInTypeRef = new tutanota_utils_1.TypeRef("storage", "BlobReferenceDeleteIn");
function createBlobReferenceDeleteIn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.BlobReferenceDeleteIn, exports.BlobReferenceDeleteInTypeRef), values);
}
exports.createBlobReferenceDeleteIn = createBlobReferenceDeleteIn;
exports.BlobReferencePutInTypeRef = new tutanota_utils_1.TypeRef("storage", "BlobReferencePutIn");
function createBlobReferencePutIn(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.BlobReferencePutIn, exports.BlobReferencePutInTypeRef), values);
}
exports.createBlobReferencePutIn = createBlobReferencePutIn;
exports.BlobServerAccessInfoTypeRef = new tutanota_utils_1.TypeRef("storage", "BlobServerAccessInfo");
function createBlobServerAccessInfo(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.BlobServerAccessInfo, exports.BlobServerAccessInfoTypeRef), values);
}
exports.createBlobServerAccessInfo = createBlobServerAccessInfo;
exports.BlobServerUrlTypeRef = new tutanota_utils_1.TypeRef("storage", "BlobServerUrl");
function createBlobServerUrl(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.BlobServerUrl, exports.BlobServerUrlTypeRef), values);
}
exports.createBlobServerUrl = createBlobServerUrl;
exports.BlobWriteDataTypeRef = new tutanota_utils_1.TypeRef("storage", "BlobWriteData");
function createBlobWriteData(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.BlobWriteData, exports.BlobWriteDataTypeRef), values);
}
exports.createBlobWriteData = createBlobWriteData;
exports.InstanceIdTypeRef = new tutanota_utils_1.TypeRef("storage", "InstanceId");
function createInstanceId(values) {
    return Object.assign((0, EntityUtils_js_1.create)(TypeModels_js_1.typeModels.InstanceId, exports.InstanceIdTypeRef), values);
}
exports.createInstanceId = createInstanceId;
