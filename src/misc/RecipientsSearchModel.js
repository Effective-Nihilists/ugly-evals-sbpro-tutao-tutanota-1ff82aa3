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
exports.getRecipientsSearchModel = exports.RecipientsSearchModel = void 0;
var RecipientsModel_js_1 = require("../api/main/RecipientsModel.js");
var FormatValidator_js_1 = require("./FormatValidator.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var DbError_js_1 = require("../api/common/error/DbError.js");
var MainLocator_js_1 = require("../api/main/MainLocator.js");
var TypeRefs_js_1 = require("../api/entities/tutanota/TypeRefs.js");
var Env_js_1 = require("../api/common/Env.js");
var PermissionError_js_1 = require("../api/common/error/PermissionError.js");
var LoginIncompleteError_js_1 = require("../api/common/error/LoginIncompleteError.js");
var MaxNativeSuggestions = 10;
var RecipientsSearchModel = /** @class */ (function () {
    function RecipientsSearchModel(recipientsModel, contactModel, systemFacade) {
        this.recipientsModel = recipientsModel;
        this.contactModel = contactModel;
        this.systemFacade = systemFacade;
        this.searchResults = [];
        this._selectedIdx = 0;
        this.loading = null;
        this.currentQuery = "";
        this.previousQuery = "";
    }
    RecipientsSearchModel.prototype.results = function () {
        return this.searchResults;
    };
    RecipientsSearchModel.prototype.isLoading = function () {
        return this.loading != null;
    };
    RecipientsSearchModel.prototype.clear = function () {
        this.searchResults = [];
        this._selectedIdx = 0;
        this.loading = null;
        this.currentQuery = "";
        this.previousQuery = "";
    };
    RecipientsSearchModel.prototype.search = function (value) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = value.trim();
                        this.currentQuery = query;
                        if (this.loading != null) {
                        }
                        else if (query.length > 0 && !(this.previousQuery.length > 0 && query.indexOf(this.previousQuery) === 0 && this.searchResults.length === 0)) {
                            this.loading = this.findContacts(query.toLowerCase())
                                .then(function (newSuggestions) {
                                // Only update search result if search query has not been changed during search and update in all other cases
                                if (query === _this.currentQuery) {
                                    _this.searchResults = newSuggestions;
                                    _this.previousQuery = query;
                                }
                            })["finally"](function () { return _this.loading = null; });
                        }
                        else if (query.length === 0 && query !== this.previousQuery) {
                            this.searchResults = [];
                            this.previousQuery = query;
                        }
                        return [4 /*yield*/, this.loading];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    RecipientsSearchModel.prototype.findContacts = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var contacts, suggestions, _loop_1, _i, contacts_1, contact, nativeContacts, contactSuggestions;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if ((0, FormatValidator_js_1.isMailAddress)(query, false)) {
                            return [2 /*return*/, []];
                        }
                        return [4 /*yield*/, this.contactModel.searchForContacts("\"".concat(query, "\""), "recipient", 10)["catch"]((0, tutanota_utils_1.ofClass)(DbError_js_1.DbError, function () { return __awaiter(_this, void 0, void 0, function () {
                                var listId;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.contactModel.contactListId()];
                                        case 1:
                                            listId = _a.sent();
                                            if (listId) {
                                                return [2 /*return*/, MainLocator_js_1.locator.entityClient.loadAll(TypeRefs_js_1.ContactTypeRef, listId)];
                                            }
                                            else {
                                                return [2 /*return*/, []];
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))["catch"]((0, tutanota_utils_1.ofClass)(LoginIncompleteError_js_1.LoginIncompleteError, function () { return []; }))];
                    case 1:
                        contacts = _a.sent();
                        suggestions = [];
                        _loop_1 = function (contact) {
                            var name_1 = "".concat(contact.firstName, " ").concat(contact.lastName).trim();
                            var filter = name_1.toLowerCase().indexOf(query) !== -1
                                ? function (address) { return (0, FormatValidator_js_1.isMailAddress)(address.trim(), false); }
                                : function (address) { return (0, FormatValidator_js_1.isMailAddress)(address.trim(), false) && address.toLowerCase().indexOf(query) !== -1; };
                            var recipientsOfContact = contact.mailAddresses
                                .map(function (_a) {
                                var address = _a.address;
                                return address;
                            })
                                .filter(filter)
                                .map(function (address) { return _this.recipientsModel.resolve({ name: name_1, address: address, contact: contact }, RecipientsModel_js_1.ResolveMode.Lazy); });
                            suggestions = suggestions.concat(recipientsOfContact);
                        };
                        for (_i = 0, contacts_1 = contacts; _i < contacts_1.length; _i++) {
                            contact = contacts_1[_i];
                            _loop_1(contact);
                        }
                        if (!(env.mode === Env_js_1.Mode.App)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.findNativeContacts(query)];
                    case 2:
                        nativeContacts = _a.sent();
                        contactSuggestions = nativeContacts
                            .filter(function (contact) { return (0, FormatValidator_js_1.isMailAddress)(contact.address, false) && !suggestions.some(function (s) { return s.address === contact.address; }); })
                            .slice(0, MaxNativeSuggestions)
                            .map(function (recipient) { return _this.recipientsModel.resolve(recipient, RecipientsModel_js_1.ResolveMode.Lazy); });
                        suggestions.push.apply(suggestions, contactSuggestions);
                        _a.label = 3;
                    case 3: return [2 /*return*/, suggestions.sort(function (suggestion1, suggestion2) { return suggestion1.name.localeCompare(suggestion2.name); })];
                }
            });
        });
    };
    RecipientsSearchModel.prototype.findNativeContacts = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            var recipients;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.systemFacade) {
                            return [2 /*return*/, []];
                        }
                        return [4 /*yield*/, this.systemFacade.findSuggestions(text)["catch"]((0, tutanota_utils_1.ofClass)(PermissionError_js_1.PermissionError, function () { return []; }))];
                    case 1:
                        recipients = _a.sent();
                        return [2 /*return*/, recipients.map(function (_a) {
                                var name = _a.name, mailAddress = _a.mailAddress;
                                return ({ name: name, address: mailAddress });
                            })];
                }
            });
        });
    };
    return RecipientsSearchModel;
}());
exports.RecipientsSearchModel = RecipientsSearchModel;
function getRecipientsSearchModel() {
    return __awaiter(this, void 0, void 0, function () {
        var locator, recipientsModel, contactModel, systemFacade;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../api/main/MainLocator.js"); })];
                case 1:
                    locator = (_a.sent()).locator;
                    recipientsModel = locator.recipientsModel, contactModel = locator.contactModel;
                    systemFacade = (0, Env_js_1.isApp)() ? locator.systemFacade : null;
                    return [2 /*return*/, new RecipientsSearchModel(recipientsModel, contactModel, systemFacade)];
            }
        });
    });
}
exports.getRecipientsSearchModel = getRecipientsSearchModel;
