"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.getLanguageName = exports.getLanguageCode = exports.TemplateEditorModel = void 0;
var LanguageViewModel_1 = require("../misc/LanguageViewModel");
var TypeRefs_js_1 = require("../api/entities/tutanota/TypeRefs.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var TypeRefs_js_2 = require("../api/entities/tutanota/TypeRefs.js");
var stream_1 = require("mithril/stream");
var tutanota_utils_2 = require("@tutao/tutanota-utils");
var EntityUtils_1 = require("../api/common/utils/EntityUtils");
var UserError_1 = require("../api/main/UserError");
var TemplateEditorModel = /** @class */ (function () {
    function TemplateEditorModel(template, templateGroupRoot, entityClient) {
        this.template = template ? (0, tutanota_utils_1.clone)(template) : (0, TypeRefs_js_2.createEmailTemplate)();
        this.title = (0, stream_1["default"])("");
        this.tag = (0, stream_1["default"])("");
        var contents = this.template.contents;
        this.selectedContent = (0, stream_1["default"])(contents.length > 0 ? (0, tutanota_utils_2.firstThrow)(contents) : this.createContent(LanguageViewModel_1.lang.code));
        this._templateGroupRoot = templateGroupRoot;
        this._entityClient = entityClient;
        this._contentProvider = null;
    }
    TemplateEditorModel.prototype.isUpdate = function () {
        return this.template._id != null;
    };
    TemplateEditorModel.prototype.setContentProvider = function (provider) {
        this._contentProvider = provider;
    };
    TemplateEditorModel.prototype.createContent = function (languageCode) {
        var emailTemplateContent = (0, TypeRefs_js_1.createEmailTemplateContent)({
            languageCode: languageCode,
            text: ""
        });
        this.template.contents.push(emailTemplateContent);
        return emailTemplateContent;
    };
    TemplateEditorModel.prototype.updateContent = function () {
        var selectedContent = this.selectedContent();
        if (selectedContent && this._contentProvider) {
            selectedContent.text = this._contentProvider();
        }
    };
    TemplateEditorModel.prototype.removeContent = function () {
        var content = this.selectedContent();
        if (content) {
            (0, tutanota_utils_2.remove)(this.template.contents, content);
        }
    };
    /**
     * Returns all languages that are available for creating new template content. Returns them in alphabetic order sorted by name.
     * @returns {Array<{name: string, value: LanguageCode}>}
     */
    TemplateEditorModel.prototype.getAdditionalLanguages = function () {
        return (0, tutanota_utils_2.difference)(LanguageViewModel_1.languages, this.getAddedLanguages(), function (lang1, lang2) { return lang1.code === lang2.code; });
    };
    TemplateEditorModel.prototype.getAddedLanguages = function () {
        return this.template.contents.map(function (content) { return LanguageViewModel_1.languageByCode[getLanguageCode(content)]; });
    };
    TemplateEditorModel.prototype.tagAlreadyExists = function () {
        var _this = this;
        if (this.template._id) {
            // the current edited template should not be included in find()
            return this._entityClient.loadAll(TypeRefs_js_2.EmailTemplateTypeRef, this._templateGroupRoot.templates).then(function (allTemplates) {
                var filteredTemplates = allTemplates.filter(function (template) { return !(0, EntityUtils_1.isSameId)((0, EntityUtils_1.getElementId)(_this.template), (0, EntityUtils_1.getElementId)(template)); });
                return !!filteredTemplates.find(function (template) { return template.tag.toLowerCase() === _this.template.tag.toLowerCase(); });
            });
        }
        else {
            return this._entityClient.loadAll(TypeRefs_js_2.EmailTemplateTypeRef, this._templateGroupRoot.templates).then(function (allTemplates) {
                return !!allTemplates.find(function (template) { return template.tag.toLowerCase() === _this.template.tag.toLowerCase(); });
            });
        }
    };
    TemplateEditorModel.prototype.save = function () {
        var _this = this;
        if (!this.title()) {
            return Promise.reject(new UserError_1.UserError("emptyTitle_msg"));
        }
        if (!this.tag()) {
            return Promise.reject(new UserError_1.UserError("emptyShortcut_msg"));
        }
        this.updateContent();
        this.template.title = this.title().trim();
        this.template.tag = this.tag().trim();
        return this.tagAlreadyExists().then(function (exists) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (exists) {
                    return [2 /*return*/, Promise.reject(new UserError_1.UserError("templateShortcutExists_msg"))];
                }
                else if (this.template._id) {
                    return [2 /*return*/, this._entityClient.update(this.template)];
                }
                else {
                    this.template._ownerGroup = this._templateGroupRoot._id;
                    return [2 /*return*/, this._entityClient.setup(this._templateGroupRoot.templates, this.template)];
                }
                return [2 /*return*/];
            });
        }); });
    };
    return TemplateEditorModel;
}());
exports.TemplateEditorModel = TemplateEditorModel;
function getLanguageCode(content) {
    return (0, tutanota_utils_1.downcast)(content.languageCode);
}
exports.getLanguageCode = getLanguageCode;
function getLanguageName(content) {
    return LanguageViewModel_1.lang.get(LanguageViewModel_1.languageByCode[getLanguageCode(content)].textId);
}
exports.getLanguageName = getLanguageName;
