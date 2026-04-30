"use strict";
exports.__esModule = true;
exports.knowledgeBaseSearch = void 0;
var PlainTextSearch_1 = require("../../api/common/utils/PlainTextSearch");
function knowledgeBaseSearch(input, allEntries) {
    return (0, PlainTextSearch_1.search)(input, allEntries, ["title", "description", "keywords.keyword"], false);
}
exports.knowledgeBaseSearch = knowledgeBaseSearch;
