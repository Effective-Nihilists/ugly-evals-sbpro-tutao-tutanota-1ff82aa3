"use strict";
exports.__esModule = true;
exports.KnowledgeBaseEditorModel = void 0;
var TypeRefs_js_1 = require("../api/entities/tutanota/TypeRefs.js");
var TypeRefs_js_2 = require("../api/entities/tutanota/TypeRefs.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var stream_1 = require("mithril/stream");
var RestError_1 = require("../api/common/error/RestError");
var UserError_1 = require("../api/main/UserError");
var TypeRefs_js_3 = require("../api/entities/tutanota/TypeRefs.js");
var KnowledgeBaseEditorModel = /** @class */ (function () {
    function KnowledgeBaseEditorModel(entry, templateGroupInstances, entityClient) {
        var _this = this;
        this.title = (0, stream_1["default"])(entry ? entry.title : "");
        this.keywords = (0, stream_1["default"])(entry ? keywordsToString(entry.keywords) : "");
        this._entityClient = entityClient;
        this._templateGroupRoot = templateGroupInstances;
        this.entry = entry ? (0, tutanota_utils_1.clone)(entry) : (0, TypeRefs_js_2.createKnowledgeBaseEntry)();
        this._descriptionProvider = null;
        this.availableTemplates = new tutanota_utils_1.LazyLoaded(function () {
            return _this._entityClient.loadAll(TypeRefs_js_1.EmailTemplateTypeRef, _this._templateGroupRoot.templates);
        }, []);
    }
    KnowledgeBaseEditorModel.prototype.isUpdate = function () {
        return this.entry._id != null;
    };
    KnowledgeBaseEditorModel.prototype.save = function () {
        if (!this.title()) {
            return Promise.reject(new UserError_1.UserError("emptyTitle_msg"));
        }
        this.entry.title = this.title();
        this.entry.keywords = stringToKeywords(this.keywords());
        if (this._descriptionProvider) {
            this.entry.description = this._descriptionProvider();
        }
        if (this.entry._id) {
            return this._entityClient.update(this.entry)["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotFoundError, tutanota_utils_1.noOp));
        }
        else {
            this.entry._ownerGroup = this._templateGroupRoot._id;
            return this._entityClient.setup(this._templateGroupRoot.knowledgeBase, this.entry);
        }
    };
    KnowledgeBaseEditorModel.prototype.setDescriptionProvider = function (provider) {
        this._descriptionProvider = provider;
    };
    return KnowledgeBaseEditorModel;
}());
exports.KnowledgeBaseEditorModel = KnowledgeBaseEditorModel;
/**
 * get keywords as a space separated string
 * @param keywords
 */
function keywordsToString(keywords) {
    return keywords.map(function (keyword) { return keyword.keyword; }).join(" ");
}
function stringToKeywords(keywords) {
    return (0, tutanota_utils_1.deduplicate)(keywords.split(" ").filter(Boolean))
        .sort(tutanota_utils_1.localeCompare)
        .map(function (keyword) {
        return (0, TypeRefs_js_3.createKnowledgeBaseEntryKeyword)({
            keyword: keyword
        });
    });
}
