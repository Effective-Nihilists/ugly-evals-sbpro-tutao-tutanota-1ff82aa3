"use strict";
exports.__esModule = true;
exports.searchInTemplates = void 0;
var TemplatePopupModel_1 = require("./TemplatePopupModel");
var PlainTextSearch_1 = require("../../api/common/utils/PlainTextSearch");
function searchInTemplates(input, allTemplates) {
    if (input.startsWith(TemplatePopupModel_1.TEMPLATE_SHORTCUT_PREFIX)) {
        // search in tag only
        var newQueryString = input.substring(TemplatePopupModel_1.TEMPLATE_SHORTCUT_PREFIX.length);
        return (0, PlainTextSearch_1.search)(newQueryString, allTemplates, ["tag"], false);
    }
    else {
        return (0, PlainTextSearch_1.search)(input, allTemplates, ["tag", "title", "contents.text"], false);
    }
}
exports.searchInTemplates = searchInTemplates;
