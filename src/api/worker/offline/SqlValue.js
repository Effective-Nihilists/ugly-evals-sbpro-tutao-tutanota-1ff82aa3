"use strict";
exports.__esModule = true;
exports.untagSqlObject = exports.untagSqlValue = exports.tagSqlValue = exports.tagSqlObject = void 0;
var tutanota_utils_1 = require("@tutao/tutanota-utils");
function tagSqlObject(params) {
    return (0, tutanota_utils_1.mapObject)(function (p) { return tagSqlValue(p); }, params);
}
exports.tagSqlObject = tagSqlObject;
function tagSqlValue(param) {
    if (typeof param === "string") {
        return { type: "SqlStr" /* SqlType.String */, value: param };
    }
    else if (typeof param === "number") {
        return { type: "SqlNum" /* SqlType.Number */, value: param };
    }
    else if (param == null) {
        return { type: "SqlNull" /* SqlType.Null */, value: null };
    }
    else {
        return { type: "SqlBytes" /* SqlType.Bytes */, value: param };
    }
}
exports.tagSqlValue = tagSqlValue;
function untagSqlValue(tagged) {
    return tagged.value;
}
exports.untagSqlValue = untagSqlValue;
function untagSqlObject(tagged) {
    return (0, tutanota_utils_1.mapObject)(function (p) { return p.value; }, tagged);
}
exports.untagSqlObject = untagSqlObject;
