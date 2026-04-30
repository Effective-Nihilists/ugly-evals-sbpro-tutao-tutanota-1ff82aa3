"use strict";
exports.__esModule = true;
exports.UsageTestParticipationService = exports.UsageTestAssignmentService = void 0;
var TypeRefs_js_1 = require("./TypeRefs.js");
var TypeRefs_js_2 = require("./TypeRefs.js");
var TypeRefs_js_3 = require("./TypeRefs.js");
exports.UsageTestAssignmentService = Object.freeze({
    app: "usage",
    name: "UsageTestAssignmentService",
    get: null,
    post: { data: TypeRefs_js_1.UsageTestAssignmentInTypeRef, "return": TypeRefs_js_2.UsageTestAssignmentOutTypeRef },
    put: { data: TypeRefs_js_1.UsageTestAssignmentInTypeRef, "return": TypeRefs_js_2.UsageTestAssignmentOutTypeRef },
    "delete": null
});
exports.UsageTestParticipationService = Object.freeze({
    app: "usage",
    name: "UsageTestParticipationService",
    get: null,
    post: { data: TypeRefs_js_3.UsageTestParticipationInTypeRef, "return": null },
    put: null,
    "delete": null
});
