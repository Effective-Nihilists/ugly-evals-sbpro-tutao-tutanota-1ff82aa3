"use strict";
exports.__esModule = true;
exports.KnowledgeBaseModel = exports.SELECT_NEXT_ENTRY = void 0;
var TypeRefs_js_1 = require("../../api/entities/tutanota/TypeRefs.js");
var TypeRefs_js_2 = require("../../api/entities/tutanota/TypeRefs.js");
var EventController_1 = require("../../api/main/EventController");
var KnowledgeBaseSearchFilter_1 = require("./KnowledgeBaseSearchFilter");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var stream_1 = require("mithril/stream");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var EntityUtils_1 = require("../../api/common/utils/EntityUtils");
var TemplatePopupModel_1 = require("../../templates/model/TemplatePopupModel");
var GroupUtils_1 = require("../../sharing/GroupUtils");
exports.SELECT_NEXT_ENTRY = "next";
function compareKnowledgeBaseEntriesForSort(entry1, entry2) {
    return entry1.title.localeCompare(entry2.title);
}
/**
 *   Model that holds main logic for the Knowledgebase.
 */
var KnowledgeBaseModel = /** @class */ (function () {
    function KnowledgeBaseModel(eventController, entityClient, userController) {
        var _this = this;
        this._eventController = eventController;
        this._entityClient = entityClient;
        this._userController = userController;
        this._allEntries = new tutanota_utils_1.SortedArray(compareKnowledgeBaseEntriesForSort);
        this._allKeywords = [];
        this._matchedKeywordsInContent = [];
        this.filteredEntries = (0, stream_1["default"])(this._allEntries.array);
        this.selectedEntry = (0, stream_1["default"])(null);
        this._filterValue = "";
        this._entityEventReceived = function (updates) {
            return _this._entityUpdate(updates);
        };
        this._eventController.addEntityListener(this._entityEventReceived);
        this._groupInstances = [];
        this._allKeywords = [];
        this.filteredEntries(this._allEntries.array);
        this.selectedEntry(this.containsResult() ? this.filteredEntries()[0] : null);
        this._initialized = new tutanota_utils_1.LazyLoaded(function () {
            var templateMemberships = _this._userController.getTemplateMemberships();
            var newGroupInstances = [];
            return (0, tutanota_utils_1.promiseMap)(templateMemberships, function (membership) { return (0, TemplatePopupModel_1.loadTemplateGroupInstance)(membership, entityClient); })
                .then(function (groupInstances) {
                newGroupInstances = groupInstances;
                return loadKnowledgebaseEntries(groupInstances, entityClient);
            })
                .then(function (knowledgebaseEntries) {
                _this._allEntries.insertAll(knowledgebaseEntries);
                _this._groupInstances = newGroupInstances;
                _this.initAllKeywords();
                return _this;
            });
        });
    }
    KnowledgeBaseModel.prototype.init = function () {
        return this._initialized.getAsync();
    };
    KnowledgeBaseModel.prototype.isInitialized = function () {
        return this._initialized.isLoaded();
    };
    KnowledgeBaseModel.prototype.getTemplateGroupInstances = function () {
        return this._groupInstances;
    };
    KnowledgeBaseModel.prototype.initAllKeywords = function () {
        var _this = this;
        this._allKeywords = [];
        this._matchedKeywordsInContent = [];
        this._allEntries.array.forEach(function (entry) {
            entry.keywords.forEach(function (keyword) {
                _this._allKeywords.push(keyword.keyword);
            });
        });
    };
    KnowledgeBaseModel.prototype.isSelectedEntry = function (entry) {
        return this.selectedEntry() === entry;
    };
    KnowledgeBaseModel.prototype.containsResult = function () {
        return this.filteredEntries().length > 0;
    };
    KnowledgeBaseModel.prototype.getAllKeywords = function () {
        return this._allKeywords.sort();
    };
    KnowledgeBaseModel.prototype.getMatchedKeywordsInContent = function () {
        return this._matchedKeywordsInContent;
    };
    KnowledgeBaseModel.prototype.getLanguageFromTemplate = function (template) {
        var clientLanguage = LanguageViewModel_1.lang.code;
        var hasClientLanguage = template.contents.some(function (content) { return content.languageCode === clientLanguage; });
        if (hasClientLanguage) {
            return clientLanguage;
        }
        return (0, tutanota_utils_1.downcast)(template.contents[0].languageCode);
    };
    KnowledgeBaseModel.prototype.sortEntriesByMatchingKeywords = function (emailContent) {
        var _this = this;
        this._matchedKeywordsInContent = [];
        var emailContentNoTags = emailContent.replace(/(<([^>]+)>)/gi, ""); // remove all html tags
        this._allKeywords.forEach(function (keyword) {
            if (emailContentNoTags.includes(keyword)) {
                _this._matchedKeywordsInContent.push(keyword);
            }
        });
        this._allEntries = tutanota_utils_1.SortedArray.from(this._allEntries.array, function (a, b) { return _this._compareEntriesByMatchedKeywords(a, b); });
        this._filterValue = "";
        this.filteredEntries(this._allEntries.array);
    };
    KnowledgeBaseModel.prototype._compareEntriesByMatchedKeywords = function (entry1, entry2) {
        var difference = this._getMatchedKeywordsNumber(entry2) - this._getMatchedKeywordsNumber(entry1);
        return difference === 0 ? compareKnowledgeBaseEntriesForSort(entry1, entry2) : difference;
    };
    KnowledgeBaseModel.prototype._getMatchedKeywordsNumber = function (entry) {
        var _this = this;
        var matches = 0;
        entry.keywords.forEach(function (k) {
            if (_this._matchedKeywordsInContent.includes(k.keyword)) {
                matches++;
            }
        });
        return matches;
    };
    KnowledgeBaseModel.prototype.filter = function (input) {
        this._filterValue = input;
        var inputTrimmed = input.trim();
        if (inputTrimmed) {
            this.filteredEntries((0, KnowledgeBaseSearchFilter_1.knowledgeBaseSearch)(inputTrimmed, this._allEntries.array));
        }
        else {
            this.filteredEntries(this._allEntries.array);
        }
    };
    KnowledgeBaseModel.prototype.selectNextEntry = function (action) {
        // returns true if selection is changed
        var selectedIndex = this.getSelectedEntryIndex();
        var nextIndex = selectedIndex + (action === exports.SELECT_NEXT_ENTRY ? 1 : -1);
        if (nextIndex >= 0 && nextIndex < this.filteredEntries().length) {
            var nextSelectedEntry = this.filteredEntries()[nextIndex];
            this.selectedEntry(nextSelectedEntry);
            return true;
        }
        return false;
    };
    KnowledgeBaseModel.prototype.getSelectedEntryIndex = function () {
        var selectedEntry = this.selectedEntry();
        if (selectedEntry == null) {
            return -1;
        }
        return this.filteredEntries().indexOf(selectedEntry);
    };
    KnowledgeBaseModel.prototype._removeFromAllKeywords = function (keyword) {
        var index = this._allKeywords.indexOf(keyword);
        if (index > -1) {
            this._allKeywords.splice(index, 1);
        }
    };
    KnowledgeBaseModel.prototype.dispose = function () {
        this._eventController.removeEntityListener(this._entityEventReceived);
    };
    KnowledgeBaseModel.prototype.loadTemplate = function (templateId) {
        return this._entityClient.load(TypeRefs_js_2.EmailTemplateTypeRef, templateId);
    };
    KnowledgeBaseModel.prototype.isReadOnly = function (entry) {
        var instance = this._groupInstances.find(function (instance) { return (0, EntityUtils_1.isSameId)(entry._ownerGroup, (0, EntityUtils_1.getEtId)(instance.group)); });
        return !instance || !(0, GroupUtils_1.hasCapabilityOnGroup)(this._userController.user, instance.group, "1" /* ShareCapability.Write */);
    };
    KnowledgeBaseModel.prototype._entityUpdate = function (updates) {
        var _this = this;
        return (0, tutanota_utils_1.promiseMap)(updates, function (update) {
            if ((0, EventController_1.isUpdateForTypeRef)(TypeRefs_js_1.KnowledgeBaseEntryTypeRef, update)) {
                if (update.operation === "0" /* OperationType.CREATE */) {
                    return _this._entityClient.load(TypeRefs_js_1.KnowledgeBaseEntryTypeRef, [update.instanceListId, update.instanceId]).then(function (entry) {
                        _this._allEntries.insert(entry);
                        _this.filter(_this._filterValue);
                    });
                }
                else if (update.operation === "1" /* OperationType.UPDATE */) {
                    return _this._entityClient.load(TypeRefs_js_1.KnowledgeBaseEntryTypeRef, [update.instanceListId, update.instanceId]).then(function (updatedEntry) {
                        _this._allEntries.removeFirst(function (e) { return (0, EntityUtils_1.isSameId)((0, EntityUtils_1.getElementId)(e), update.instanceId); });
                        _this._allEntries.insert(updatedEntry);
                        _this.filter(_this._filterValue);
                        var oldSelectedEntry = _this.selectedEntry();
                        if (oldSelectedEntry && (0, EntityUtils_1.isSameId)(oldSelectedEntry._id, updatedEntry._id)) {
                            _this.selectedEntry(updatedEntry);
                        }
                    });
                }
                else if (update.operation === "2" /* OperationType.DELETE */) {
                    var selected = _this.selectedEntry();
                    if (selected && (0, EntityUtils_1.isSameId)((0, EntityUtils_1.getLetId)(selected), [update.instanceListId, update.instanceId])) {
                        _this.selectedEntry(null);
                    }
                    _this._allEntries.removeFirst(function (e) { return (0, EntityUtils_1.isSameId)((0, EntityUtils_1.getElementId)(e), update.instanceId); });
                    _this.filter(_this._filterValue);
                }
            }
        }).then(tutanota_utils_1.noOp);
    };
    return KnowledgeBaseModel;
}());
exports.KnowledgeBaseModel = KnowledgeBaseModel;
function loadKnowledgebaseEntries(templateGroups, entityClient) {
    return (0, tutanota_utils_1.promiseMap)(templateGroups, function (group) { return entityClient.loadAll(TypeRefs_js_1.KnowledgeBaseEntryTypeRef, group.groupRoot.knowledgeBase); }).then(function (groupedTemplates) {
        return (0, tutanota_utils_1.flat)(groupedTemplates);
    });
}
