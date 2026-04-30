"use strict";
exports.__esModule = true;
exports.CounterService = void 0;
var TypeRefs_js_1 = require("./TypeRefs.js");
var TypeRefs_js_2 = require("./TypeRefs.js");
var TypeRefs_js_3 = require("./TypeRefs.js");
exports.CounterService = Object.freeze({
    app: "monitor",
    name: "CounterService",
    get: { data: TypeRefs_js_1.ReadCounterDataTypeRef, "return": TypeRefs_js_2.ReadCounterReturnTypeRef },
    post: { data: TypeRefs_js_3.WriteCounterDataTypeRef, "return": null },
    put: null,
    "delete": null
});
