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
exports.lazyContactListId = exports.ContactModelImpl = void 0;
var TypeRefs_js_1 = require("../../api/entities/tutanota/TypeRefs.js");
var SearchUtils_1 = require("../../search/model/SearchUtils");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var RestError_1 = require("../../api/common/error/RestError");
var DbError_1 = require("../../api/common/error/DbError");
var EntityUtils_1 = require("../../api/common/utils/EntityUtils");
var Env_1 = require("../../api/common/Env");
var LoginIncompleteError_1 = require("../../api/common/error/LoginIncompleteError");
(0, Env_1.assertMainOrNode)();
var ContactModelImpl = /** @class */ (function () {
    function ContactModelImpl(searchFacade, entityClient, loginController) {
        this._searchFacade = searchFacade;
        this._entityClient = entityClient;
        this._contactListId = lazyContactListId(loginController, this._entityClient);
        this.loginController = loginController;
    }
    ContactModelImpl.prototype.contactListId = function () {
        return this._contactListId.getAsync();
    };
    ContactModelImpl.prototype.searchForContact = function (mailAddress) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var cleanMailAddress, result, e_1, listId, contacts, _i, _b, contactId, contact, e_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        //searching for contacts depends on searchFacade._db to be initialized. If the user has not logged in online the respective promise will never resolve.
                        if (!this.loginController.isFullyLoggedIn()) {
                            throw new LoginIncompleteError_1.LoginIncompleteError("cannot search for contacts as online login is not completed");
                        }
                        cleanMailAddress = mailAddress.trim().toLowerCase();
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 10]);
                        return [4 /*yield*/, this._searchFacade
                                .search('"' + cleanMailAddress + '"', (0, SearchUtils_1.createRestriction)("contact", null, null, "mailAddress", null), 0)];
                    case 2:
                        result = _c.sent();
                        return [3 /*break*/, 10];
                    case 3:
                        e_1 = _c.sent();
                        if (!(e_1 instanceof DbError_1.DbError)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.contactListId()];
                    case 4:
                        listId = _c.sent();
                        if (!listId) return [3 /*break*/, 6];
                        return [4 /*yield*/, this._entityClient.loadAll(TypeRefs_js_1.ContactTypeRef, listId)];
                    case 5:
                        contacts = _c.sent();
                        return [2 /*return*/, (_a = contacts.find(function (contact) { return contact.mailAddresses.some(function (a) { return a.address.trim().toLowerCase() === cleanMailAddress; }); })) !== null && _a !== void 0 ? _a : null];
                    case 6: return [2 /*return*/, null];
                    case 7: return [3 /*break*/, 9];
                    case 8: throw e_1;
                    case 9: return [3 /*break*/, 10];
                    case 10:
                        // the result is sorted from newest to oldest, but we want to return the oldest first like before
                        result.results.sort(EntityUtils_1.compareOldestFirst);
                        _i = 0, _b = result.results;
                        _c.label = 11;
                    case 11:
                        if (!(_i < _b.length)) return [3 /*break*/, 16];
                        contactId = _b[_i];
                        _c.label = 12;
                    case 12:
                        _c.trys.push([12, 14, , 15]);
                        return [4 /*yield*/, this._entityClient
                                .load(TypeRefs_js_1.ContactTypeRef, contactId)];
                    case 13:
                        contact = _c.sent();
                        if (contact.mailAddresses.some(function (a) { return a.address.trim().toLowerCase() === cleanMailAddress; })) {
                            return [2 /*return*/, contact];
                        }
                        return [3 /*break*/, 15];
                    case 14:
                        e_2 = _c.sent();
                        if (e_2 instanceof RestError_1.NotFoundError || e_2 instanceof RestError_1.NotAuthorizedError) {
                            return [3 /*break*/, 15];
                        }
                        else {
                            throw e_2;
                        }
                        return [3 /*break*/, 15];
                    case 15:
                        _i++;
                        return [3 /*break*/, 11];
                    case 16: return [2 /*return*/, null];
                }
            });
        });
    };
    /**
     * @pre locator.search.indexState().indexingSupported
     */
    ContactModelImpl.prototype.searchForContacts = function (query, field, minSuggestionCount) {
        return __awaiter(this, void 0, void 0, function () {
            var result, resultsByListId, loadedContacts;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.loginController.isFullyLoggedIn()) {
                            throw new LoginIncompleteError_1.LoginIncompleteError("cannot search for contacts as online login is not completed");
                        }
                        return [4 /*yield*/, this._searchFacade.search(query, (0, SearchUtils_1.createRestriction)("contact", null, null, field, null), minSuggestionCount)];
                    case 1:
                        result = _a.sent();
                        resultsByListId = (0, tutanota_utils_1.groupBy)(result.results, EntityUtils_1.listIdPart);
                        return [4 /*yield*/, (0, tutanota_utils_1.promiseMap)(resultsByListId, function (_a) {
                                var listId = _a[0], idTuples = _a[1];
                                // we try to load all contacts from the same list in one request
                                return _this._entityClient.loadMultiple(TypeRefs_js_1.ContactTypeRef, listId, idTuples.map(EntityUtils_1.elementIdPart))["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotAuthorizedError, function (e) {
                                    console.log("tried to access contact without authorization", e);
                                    return [];
                                }));
                            }, {
                                concurrency: 3
                            })];
                    case 2:
                        loadedContacts = _a.sent();
                        return [2 /*return*/, (0, tutanota_utils_1.flat)(loadedContacts)];
                }
            });
        });
    };
    return ContactModelImpl;
}());
exports.ContactModelImpl = ContactModelImpl;
function lazyContactListId(logins, entityClient) {
    return new tutanota_utils_1.LazyLoaded(function () {
        return entityClient
            .loadRoot(TypeRefs_js_1.ContactListTypeRef, logins.getUserController().user.userGroup.group)
            .then(function (contactList) {
            return contactList.contacts;
        })["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotFoundError, function (e) {
            if (!logins.getUserController().isInternalUser()) {
                return null; // external users have no contact list.
            }
            else {
                throw e;
            }
        }));
    });
}
exports.lazyContactListId = lazyContactListId;
