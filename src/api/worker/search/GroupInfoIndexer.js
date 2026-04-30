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
exports.GroupInfoIndexer = void 0;
var TutanotaConstants_1 = require("../../common/TutanotaConstants");
var RestError_1 = require("../../common/error/RestError");
var TypeRefs_js_1 = require("../../entities/sys/TypeRefs.js");
var TypeModels_js_1 = require("../../entities/sys/TypeModels.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var IndexUtils_1 = require("./IndexUtils");
var TypeRefs_js_2 = require("../../entities/sys/TypeRefs.js");
var Indexer_1 = require("./Indexer");
var Tokenizer_1 = require("./Tokenizer");
var tutanota_utils_2 = require("@tutao/tutanota-utils");
var GroupInfoIndexer = /** @class */ (function () {
    function GroupInfoIndexer(core, db, entity, suggestionFacade) {
        this._core = core;
        this._db = db;
        this._entity = entity;
        this.suggestionFacade = suggestionFacade;
    }
    GroupInfoIndexer.prototype.createGroupInfoIndexEntries = function (groupInfo) {
        this.suggestionFacade.addSuggestions(this._getSuggestionWords(groupInfo));
        var GroupInfoModel = TypeModels_js_1.typeModels.GroupInfo;
        return this._core.createIndexEntriesForAttributes(groupInfo, [
            {
                attribute: GroupInfoModel.values["name"],
                value: function () { return groupInfo.name; }
            },
            {
                attribute: GroupInfoModel.values["mailAddress"],
                value: function () { return (groupInfo.mailAddress ? groupInfo.mailAddress : ""); }
            },
            {
                attribute: GroupInfoModel.associations["mailAddressAliases"],
                value: function () { return groupInfo.mailAddressAliases.map(function (maa) { return maa.mailAddress; }).join(","); }
            },
        ]);
    };
    GroupInfoIndexer.prototype._getSuggestionWords = function (groupInfo) {
        return (0, Tokenizer_1.tokenize)(groupInfo.name +
            " " +
            (groupInfo.mailAddress ? groupInfo.mailAddress : "") +
            " " +
            groupInfo.mailAddressAliases.map(function (alias) { return alias.mailAddress; }).join(" "));
    };
    GroupInfoIndexer.prototype.processNewGroupInfo = function (event) {
        var _this = this;
        return this._entity
            .load(TypeRefs_js_1.GroupInfoTypeRef, [event.instanceListId, event.instanceId])
            .then(function (groupInfo) {
            var keyToIndexEntries = _this.createGroupInfoIndexEntries(groupInfo);
            return _this.suggestionFacade.store().then(function () {
                return {
                    groupInfo: groupInfo,
                    keyToIndexEntries: keyToIndexEntries
                };
            });
        })["catch"]((0, tutanota_utils_2.ofClass)(RestError_1.NotFoundError, function () {
            console.log("tried to index non existing group info");
            return null;
        }));
    };
    /**
     * Indexes the group infos if they are not yet indexed.
     */
    GroupInfoIndexer.prototype.indexAllUserAndTeamGroupInfosForAdmin = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var customer, t, groupData, _a, allUserGroupInfos, allTeamGroupInfos, indexUpdate_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(0, IndexUtils_1.userIsLocalOrGlobalAdmin)(user)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this._entity.load(TypeRefs_js_2.CustomerTypeRef, (0, tutanota_utils_1.neverNull)(user.customer))];
                    case 1:
                        customer = _b.sent();
                        return [4 /*yield*/, this._db.dbFacade.createTransaction(true, [Indexer_1.GroupDataOS])];
                    case 2:
                        t = _b.sent();
                        return [4 /*yield*/, t.get(Indexer_1.GroupDataOS, customer.customerGroup)];
                    case 3:
                        groupData = _b.sent();
                        if (!(groupData && groupData.indexTimestamp === TutanotaConstants_1.NOTHING_INDEXED_TIMESTAMP)) return [3 /*break*/, 5];
                        return [4 /*yield*/, Promise.all([
                                this._entity.loadAll(TypeRefs_js_1.GroupInfoTypeRef, customer.userGroups),
                                this._entity.loadAll(TypeRefs_js_1.GroupInfoTypeRef, customer.teamGroups),
                            ])];
                    case 4:
                        _a = _b.sent(), allUserGroupInfos = _a[0], allTeamGroupInfos = _a[1];
                        indexUpdate_1 = (0, IndexUtils_1._createNewIndexUpdate)((0, IndexUtils_1.typeRefToTypeInfo)(TypeRefs_js_1.GroupInfoTypeRef));
                        allUserGroupInfos.concat(allTeamGroupInfos).forEach(function (groupInfo) {
                            var keyToIndexEntries = _this.createGroupInfoIndexEntries(groupInfo);
                            _this._core.encryptSearchIndexEntries(groupInfo._id, (0, tutanota_utils_1.neverNull)(groupInfo._ownerGroup), keyToIndexEntries, indexUpdate_1);
                        });
                        return [2 /*return*/, Promise.all([
                                this._core.writeIndexUpdate([
                                    {
                                        groupId: customer.customerGroup,
                                        indexTimestamp: TutanotaConstants_1.FULL_INDEXED_TIMESTAMP
                                    },
                                ], indexUpdate_1),
                                this.suggestionFacade.store(),
                            ])];
                    case 5: return [3 /*break*/, 7];
                    case 6: return [2 /*return*/, Promise.resolve()];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    GroupInfoIndexer.prototype.processEntityEvents = function (events, groupId, batchId, indexUpdate, user) {
        var _this = this;
        return (0, tutanota_utils_2.promiseMap)(events, function (event) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(0, IndexUtils_1.userIsLocalOrGlobalAdmin)(user)) return [3 /*break*/, 6];
                        if (!(event.operation === "0" /* OperationType.CREATE */)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.processNewGroupInfo(event).then(function (result) {
                                if (result) {
                                    _this._core.encryptSearchIndexEntries(result.groupInfo._id, (0, tutanota_utils_1.neverNull)(result.groupInfo._ownerGroup), result.keyToIndexEntries, indexUpdate);
                                }
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 2:
                        if (!(event.operation === "1" /* OperationType.UPDATE */)) return [3 /*break*/, 4];
                        return [4 /*yield*/, Promise.all([
                                this._core._processDeleted(event, indexUpdate),
                                this.processNewGroupInfo(event).then(function (result) {
                                    if (result) {
                                        _this._core.encryptSearchIndexEntries(result.groupInfo._id, (0, tutanota_utils_1.neverNull)(result.groupInfo._ownerGroup), result.keyToIndexEntries, indexUpdate);
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
    return GroupInfoIndexer;
}());
exports.GroupInfoIndexer = GroupInfoIndexer;
