"use strict";
exports.__esModule = true;
exports.loadTemplateGroupInstance = exports.loadTemplateGroupInstances = exports.TemplatePopupModel = exports.SELECT_PREV_TEMPLATE = exports.SELECT_NEXT_TEMPLATE = exports.TEMPLATE_SHORTCUT_PREFIX = void 0;
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var TemplateSearchFilter_1 = require("./TemplateSearchFilter");
var TypeRefs_js_1 = require("../../api/entities/tutanota/TypeRefs.js");
var EventController_1 = require("../../api/main/EventController");
var stream_1 = require("mithril/stream");
var LoginController_1 = require("../../api/main/LoginController");
var EntityUtils_1 = require("../../api/common/utils/EntityUtils");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var TypeRefs_js_2 = require("../../api/entities/sys/TypeRefs.js");
var TypeRefs_js_3 = require("../../api/entities/tutanota/TypeRefs.js");
var TypeRefs_js_4 = require("../../api/entities/sys/TypeRefs.js");
var TypeRefs_js_5 = require("../../api/entities/sys/TypeRefs.js");
/**
 *   Model that holds main logic for the Template Feature.
 *   Handles things like returning the selected Template, selecting Templates, indexes, scrolling.
 */
exports.TEMPLATE_SHORTCUT_PREFIX = "#";
exports.SELECT_NEXT_TEMPLATE = "next";
exports.SELECT_PREV_TEMPLATE = "previous";
// sort first by name then by tag
function compareTemplatesForSort(template1, template2) {
    var titleComparison = template1.title.localeCompare(template2.title);
    return titleComparison === 0 ? template1.tag.localeCompare(template2.tag) : titleComparison;
}
var TemplatePopupModel = /** @class */ (function () {
    function TemplatePopupModel(eventController, logins, entityClient) {
        var _this = this;
        this._eventController = eventController;
        this._logins = logins;
        this._entityClient = entityClient;
        this._allTemplates = new tutanota_utils_1.SortedArray(compareTemplatesForSort);
        this.searchResults = (0, stream_1["default"])([]);
        this.selectedTemplate = (0, stream_1["default"])(null);
        this._selectedContentLanguage = LanguageViewModel_1.lang.code;
        this._searchFilter = new TemplateSearchFilter();
        this._groupInstances = [];
        this._entityEventReceived = function (updates) {
            return _this._entityUpdate(updates);
        };
        this.initialized = new tutanota_utils_1.LazyLoaded(function () {
            var templateMemberships = _this._logins.getUserController().getTemplateMemberships();
            return loadTemplateGroupInstances(templateMemberships, _this._entityClient)
                .then(function (templateGroupInstances) {
                return loadTemplates(templateGroupInstances, _this._entityClient).then(function (templates) {
                    _this._allTemplates.insertAll(templates);
                    _this._groupInstances = templateGroupInstances;
                });
            })
                .then(function () {
                _this.searchResults(_this._searchFilter.filter("", _this._allTemplates.array));
                _this.setSelectedTemplate(_this.searchResults()[0]);
                return _this;
            });
        });
        this._eventController.addEntityListener(this._entityEventReceived);
    }
    TemplatePopupModel.prototype.init = function () {
        return this.initialized.getAsync();
    };
    TemplatePopupModel.prototype.isLoaded = function () {
        return this.initialized.isLoaded();
    };
    TemplatePopupModel.prototype.dispose = function () {
        this._eventController.removeEntityListener(this._entityEventReceived);
    };
    TemplatePopupModel.prototype.isSelectedTemplate = function (template) {
        return this.selectedTemplate() === template;
    };
    TemplatePopupModel.prototype.getAllTemplates = function () {
        return this._allTemplates.array;
    };
    TemplatePopupModel.prototype.getSelectedTemplate = function () {
        return this.selectedTemplate();
    };
    TemplatePopupModel.prototype.getSelectedContent = function () {
        var _this = this;
        var selectedTemplate = this.selectedTemplate();
        return (selectedTemplate &&
            (selectedTemplate.contents.find(function (contents) { return contents.languageCode === _this._selectedContentLanguage; }) ||
                selectedTemplate.contents.find(function (contents) { return contents.languageCode === LanguageViewModel_1.lang.code; }) ||
                selectedTemplate.contents[0]));
    };
    TemplatePopupModel.prototype.getSelectedTemplateIndex = function () {
        var selectedTemplate = this.selectedTemplate();
        if (selectedTemplate == null) {
            return -1;
        }
        return this.searchResults().indexOf(selectedTemplate);
    };
    TemplatePopupModel.prototype.setSelectedTemplate = function (template) {
        this.selectedTemplate(template);
    };
    TemplatePopupModel.prototype.setSelectedContentLanguage = function (langCode) {
        this._selectedContentLanguage = langCode;
    };
    TemplatePopupModel.prototype.search = function (query) {
        this.searchResults(this._searchFilter.filter(query, this._allTemplates.array));
        this.setSelectedTemplate(this.searchResults()[0]);
    };
    TemplatePopupModel.prototype._rerunSearch = function () {
        this.searchResults(this._searchFilter.rerunQuery(this._allTemplates.array));
        this.setSelectedTemplate(this.searchResults()[0]);
    };
    /**
     * Increments or decrements the selection, unless it would go past the beginning or end of the search results
     * @param action
     * @returns true if the selection changed
     */
    TemplatePopupModel.prototype.selectNextTemplate = function (action) {
        var selectedIndex = this.getSelectedTemplateIndex();
        var nextIndex = selectedIndex + (action === exports.SELECT_NEXT_TEMPLATE ? 1 : -1);
        if (nextIndex >= 0 && nextIndex < this.searchResults().length) {
            var nextSelectedTemplate = this.searchResults()[nextIndex];
            this.setSelectedTemplate(nextSelectedTemplate);
            return true;
        }
        return false;
    };
    TemplatePopupModel.prototype.findTemplateWithTag = function (selectedText) {
        var _a;
        var tag = selectedText.substring(exports.TEMPLATE_SHORTCUT_PREFIX.length); // remove TEMPLATE_SHORTCUT_PREFIX from selected text
        return (_a = this._allTemplates.array.find(function (template) { return template.tag === tag; })) !== null && _a !== void 0 ? _a : null;
    };
    TemplatePopupModel.prototype._entityUpdate = function (updates) {
        var _this = this;
        return (0, tutanota_utils_1.promiseMap)(updates, function (update) {
            if ((0, EventController_1.isUpdateForTypeRef)(TypeRefs_js_1.EmailTemplateTypeRef, update)) {
                if (update.operation === "0" /* OperationType.CREATE */) {
                    return _this._entityClient.load(TypeRefs_js_1.EmailTemplateTypeRef, [update.instanceListId, update.instanceId]).then(function (template) {
                        _this._allTemplates.insert(template);
                        _this._rerunSearch();
                        _this.setSelectedTemplate(template);
                    });
                }
                else if (update.operation === "1" /* OperationType.UPDATE */) {
                    return _this._entityClient.load(TypeRefs_js_1.EmailTemplateTypeRef, [update.instanceListId, update.instanceId]).then(function (template) {
                        _this._allTemplates.removeFirst(function (t) { return (0, EntityUtils_1.isSameId)((0, EntityUtils_1.getElementId)(t), update.instanceId); });
                        _this._allTemplates.insert(template);
                        _this._rerunSearch();
                        _this.setSelectedTemplate(template);
                    });
                }
                else if (update.operation === "2" /* OperationType.DELETE */) {
                    // Try select the next or the previous template
                    // if neither option is possible, it means we are deleting the last template, so clear the selection
                    if (!_this.selectNextTemplate("next") && !_this.selectNextTemplate("previous")) {
                        _this.setSelectedTemplate(null);
                    }
                    _this._allTemplates.removeFirst(function (t) { return (0, EntityUtils_1.isSameId)((0, EntityUtils_1.getElementId)(t), update.instanceId); });
                    _this._rerunSearch();
                }
            }
            else if ((0, EventController_1.isUpdateForTypeRef)(TypeRefs_js_5.UserTypeRef, update) && (0, EntityUtils_1.isSameId)(update.instanceId, LoginController_1.logins.getUserController().user._id)) {
                // template group memberships may have changed
                if (_this._groupInstances.length !== LoginController_1.logins.getUserController().getTemplateMemberships().length) {
                    _this.initialized.reset();
                    return _this.initialized.getAsync().then(function () { return _this._rerunSearch(); });
                }
            }
        });
    };
    TemplatePopupModel.prototype.getTemplateGroupInstances = function () {
        return this._groupInstances;
    };
    TemplatePopupModel.prototype.getSelectedTemplateGroupInstance = function () {
        var _a;
        var selected = this.getSelectedTemplate();
        if (selected == null) {
            return null;
        }
        else {
            return (_a = this._groupInstances.find(function (instance) { return (0, EntityUtils_1.isSameId)((0, EntityUtils_1.getEtId)(instance.group), selected._ownerGroup); })) !== null && _a !== void 0 ? _a : null;
        }
    };
    return TemplatePopupModel;
}());
exports.TemplatePopupModel = TemplatePopupModel;
function loadTemplateGroupInstances(memberships, entityClient) {
    return (0, tutanota_utils_1.promiseMap)(memberships, function (membership) { return loadTemplateGroupInstance(membership, entityClient); });
}
exports.loadTemplateGroupInstances = loadTemplateGroupInstances;
function loadTemplateGroupInstance(groupMembership, entityClient) {
    return entityClient.load(TypeRefs_js_2.GroupInfoTypeRef, groupMembership.groupInfo).then(function (groupInfo) {
        return entityClient.load(TypeRefs_js_3.TemplateGroupRootTypeRef, groupInfo.group).then(function (groupRoot) {
            return entityClient.load(TypeRefs_js_4.GroupTypeRef, groupInfo.group).then(function (group) {
                return {
                    groupInfo: groupInfo,
                    group: group,
                    groupRoot: groupRoot,
                    groupMembership: groupMembership
                };
            });
        });
    });
}
exports.loadTemplateGroupInstance = loadTemplateGroupInstance;
function loadTemplates(templateGroups, entityClient) {
    return (0, tutanota_utils_1.promiseMap)(templateGroups, function (group) { return entityClient.loadAll(TypeRefs_js_1.EmailTemplateTypeRef, group.groupRoot.templates); }).then(function (groupedTemplates) {
        return (0, tutanota_utils_1.flat)(groupedTemplates);
    });
}
var TemplateSearchFilter = /** @class */ (function () {
    function TemplateSearchFilter() {
        this.lastInput = [];
        this.lastQuery = "";
        this.lastResults = [];
    }
    TemplateSearchFilter.prototype.filter = function (query, input) {
        return this._doFilter(query, input);
    };
    TemplateSearchFilter.prototype.rerunQuery = function (input) {
        return this._doFilter(this.lastQuery, input);
    };
    TemplateSearchFilter.prototype._doFilter = function (query, input) {
        this.lastInput = input.slice();
        this.lastQuery = query;
        this.lastResults = query === "" ? this.lastInput : (0, TemplateSearchFilter_1.searchInTemplates)(query, input);
        return this.lastResults;
    };
    return TemplateSearchFilter;
}());
