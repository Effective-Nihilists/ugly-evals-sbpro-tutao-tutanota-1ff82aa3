"use strict";
exports.__esModule = true;
exports.deleteObjectStores = void 0;
var Env_1 = require("../../common/Env");
(0, Env_1.assertWorkerOrNode)();
function deleteObjectStores(db) {
    var oss = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        oss[_i - 1] = arguments[_i];
    }
    for (var _a = 0, oss_1 = oss; _a < oss_1.length; _a++) {
        var os = oss_1[_a];
        try {
            db.deleteObjectStore(os);
        }
        catch (e) {
            console.warn("Error while deleting old os", os, "ignoring", e);
        }
    }
}
exports.deleteObjectStores = deleteObjectStores;
