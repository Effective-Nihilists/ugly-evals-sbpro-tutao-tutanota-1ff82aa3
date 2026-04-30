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
exports.ContactIndexer = void 0;
var RestError_1 = require("../../common/error/RestError");
var TypeRefs_js_1 = require("../../entities/tutanota/TypeRefs.js");
var TypeModels_1 = require("../../entities/tutanota/TypeModels");
var IndexUtils_1 = require("./IndexUtils");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var TutanotaConstants_1 = require("../../common/TutanotaConstants");
var Tokenizer_1 = require("./Tokenizer");
var Indexer_1 = require("./Indexer");
var ContactIndexer = /** @class */ (function () {
    function ContactIndexer(core, db, entity, suggestionFacade) {
        this._core = core;
        this._db = db;
        this._entity = entity;
        this.suggestionFacade = suggestionFacade;
    }
    ContactIndexer.prototype.createContactIndexEntries = function (contact) {
        var ContactModel = TypeModels_1.typeModels.Contact;
        var keyToIndexEntries = this._core.createIndexEntriesForAttributes(contact, [
            {
                attribute: ContactModel.values["firstName"],
                value: function () { return contact.firstName; }
            },
            {
                attribute: ContactModel.values["lastName"],
                value: function () { return contact.lastName; }
            },
            {
                attribute: ContactModel.values["nickname"],
                value: function () { return contact.nickname || ""; }
            },
            {
                attribute: ContactModel.values["role"],
                value: function () { return contact.role; }
            },
            {
                attribute: ContactModel.values["title"],
                value: function () { return contact.title || ""; }
            },
            {
                attribute: ContactModel.values["comment"],
                value: function () { return contact.comment; }
            },
            {
                attribute: ContactModel.values["company"],
                value: function () { return contact.company; }
            },
            {
                attribute: ContactModel.associations["addresses"],
                value: function () { return contact.addresses.map(function (a) { return a.address; }).join(","); }
            },
            {
                attribute: ContactModel.associations["mailAddresses"],
                value: function () { return contact.mailAddresses.map(function (cma) { return cma.address; }).join(","); }
            },
            {
                attribute: ContactModel.associations["phoneNumbers"],
                value: function () { return contact.phoneNumbers.map(function (pn) { return pn.number; }).join(","); }
            },
            {
                attribute: ContactModel.associations["socialIds"],
                value: function () { return contact.socialIds.map(function (s) { return s.socialId; }).join(","); }
            },
        ]);
        this.suggestionFacade.addSuggestions(this._getSuggestionWords(contact));
        return keyToIndexEntries;
    };
    ContactIndexer.prototype._getSuggestionWords = function (contact) {
        return (0, Tokenizer_1.tokenize)(contact.firstName + " " + contact.lastName + " " + contact.mailAddresses.map(function (ma) { return ma.address; }).join(" "));
    };
    ContactIndexer.prototype.processNewContact = function (event) {
        var _this = this;
        return this._entity
            .load(TypeRefs_js_1.ContactTypeRef, [event.instanceListId, event.instanceId])
            .then(function (contact) {
            var keyToIndexEntries = _this.createContactIndexEntries(contact);
            return _this.suggestionFacade.store().then(function () {
                return {
                    contact: contact,
                    keyToIndexEntries: keyToIndexEntries
                };
            });
        })["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotFoundError, function () {
            console.log("tried to index non existing contact");
            return null;
        }))["catch"]((0, tutanota_utils_1.ofClass)(RestError_1.NotAuthorizedError, function () {
            console.log("tried to index contact without permission");
            return null;
        }));
    };
    ContactIndexer.prototype.getIndexTimestamp = function (contactList) {
        return __awaiter(this, void 0, void 0, function () {
            var t, groupId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._db.dbFacade.createTransaction(true, [Indexer_1.MetaDataOS, Indexer_1.GroupDataOS])];
                    case 1:
                        t = _a.sent();
                        groupId = (0, tutanota_utils_1.neverNull)(contactList._ownerGroup);
                        return [2 /*return*/, t.get(Indexer_1.GroupDataOS, groupId).then(function (groupData) {
                                return groupData ? groupData.indexTimestamp : null;
                            })];
                }
            });
        });
    };
    /**
     * Indexes the contact list if it is not yet indexed.
     */
    ContactIndexer.prototype.indexFullContactList = function (contactList) {
        return __awaiter(this, void 0, void 0, function () {
            var groupId, indexUpdate, contacts, e_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        groupId = (0, tutanota_utils_1.neverNull)(contactList._ownerGroup);
                        indexUpdate = (0, IndexUtils_1._createNewIndexUpdate)((0, IndexUtils_1.typeRefToTypeInfo)(TypeRefs_js_1.ContactTypeRef));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this._entity.loadAll(TypeRefs_js_1.ContactTypeRef, contactList.contacts)];
                    case 2:
                        contacts = _a.sent();
                        contacts.forEach(function (contact) {
                            var keyToIndexEntries = _this.createContactIndexEntries(contact);
                            _this._core.encryptSearchIndexEntries(contact._id, (0, tutanota_utils_1.neverNull)(contact._ownerGroup), keyToIndexEntries, indexUpdate);
                        });
                        return [2 /*return*/, Promise.all([
                                this._core.writeIndexUpdate([
                                    {
                                        groupId: groupId,
                                        indexTimestamp: TutanotaConstants_1.FULL_INDEXED_TIMESTAMP
                                    },
                                ], indexUpdate),
                                this.suggestionFacade.store(),
                            ])];
                    case 3:
                        e_1 = _a.sent();
                        if (e_1 instanceof RestError_1.NotFoundError) {
                            return [2 /*return*/, Promise.resolve()];
                        }
                        throw e_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ContactIndexer.prototype.processEntityEvents = function (events, groupId, batchId, indexUpdate) {
        var _this = this;
        return (0, tutanota_utils_1.promiseMap)(events, function (event) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(event.operation === "0" /* OperationType.CREATE */)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.processNewContact(event).then(function (result) {
                                if (result) {
                                    _this._core.encryptSearchIndexEntries(result.contact._id, (0, tutanota_utils_1.neverNull)(result.contact._ownerGroup), result.keyToIndexEntries, indexUpdate);
                                }
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 2:
                        if (!(event.operation === "1" /* OperationType.UPDATE */)) return [3 /*break*/, 4];
                        return [4 /*yield*/, Promise.all([
                                this._core._processDeleted(event, indexUpdate),
                                this.processNewContact(event).then(function (result) {
                                    if (result) {
                                        _this._core.encryptSearchIndexEntries(result.contact._id, (0, tutanota_utils_1.neverNull)(result.contact._ownerGroup), result.keyToIndexEntries, indexUpdate);
                                    }
                                }),
                            ])];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        if (!(event.operation === "2" /* OperationType.DELETE */)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this._core._processDeleted(event, indexUpdate)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        }); }).then(tutanota_utils_1.noOp);
    };
    return ContactIndexer;
}());
exports.ContactIndexer = ContactIndexer;
