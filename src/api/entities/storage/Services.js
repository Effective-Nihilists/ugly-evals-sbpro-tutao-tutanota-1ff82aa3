"use strict";
exports.__esModule = true;
exports.BlobService = exports.BlobReferenceService = exports.BlobAccessTokenService = void 0;
var TypeRefs_js_1 = require("./TypeRefs.js");
var TypeRefs_js_2 = require("./TypeRefs.js");
var TypeRefs_js_3 = require("./TypeRefs.js");
var TypeRefs_js_4 = require("./TypeRefs.js");
var TypeRefs_js_5 = require("./TypeRefs.js");
var TypeRefs_js_6 = require("./TypeRefs.js");
exports.BlobAccessTokenService = Object.freeze({
    app: "storage",
    name: "BlobAccessTokenService",
    get: null,
    post: { data: TypeRefs_js_1.BlobAccessTokenPostInTypeRef, "return": TypeRefs_js_2.BlobAccessTokenPostOutTypeRef },
    put: null,
    "delete": null
});
exports.BlobReferenceService = Object.freeze({
    app: "storage",
    name: "BlobReferenceService",
    get: null,
    post: null,
    put: { data: TypeRefs_js_3.BlobReferencePutInTypeRef, "return": null },
    "delete": { data: TypeRefs_js_4.BlobReferenceDeleteInTypeRef, "return": null }
});
exports.BlobService = Object.freeze({
    app: "storage",
    name: "BlobService",
    get: { data: TypeRefs_js_5.BlobGetInTypeRef, "return": null },
    post: { data: null, "return": TypeRefs_js_6.BlobPostOutTypeRef },
    put: null,
    "delete": null
});
