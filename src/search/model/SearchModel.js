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
exports.hasMoreResults = exports.SearchModel = void 0;
var stream_1 = require("mithril/stream");
var TypeRefs_js_1 = require("../../api/entities/tutanota/TypeRefs.js");
var TutanotaConstants_1 = require("../../api/common/TutanotaConstants");
var DbError_1 = require("../../api/common/error/DbError");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var tutanota_utils_2 = require("@tutao/tutanota-utils");
var tutanota_utils_3 = require("@tutao/tutanota-utils");
var Env_1 = require("../../api/common/Env");
(0, Env_1.assertMainOrNode)();
var SearchModel = /** @class */ (function () {
    function SearchModel(searchFacade) {
        this._searchFacade = searchFacade;
        this.result = (0, stream_1["default"])();
        this.lastQuery = (0, stream_1["default"])("");
        this.indexingSupported = true;
        this.indexState = (0, stream_1["default"])({
            initializing: true,
            mailIndexEnabled: false,
            progress: 0,
            currentMailIndexTimestamp: TutanotaConstants_1.NOTHING_INDEXED_TIMESTAMP,
            indexedMailCount: 0,
            failedIndexingUpTo: null
        });
        this._lastQuery = null;
        this._lastSearchPromise = Promise.resolve(undefined);
    }
    SearchModel.prototype.search = function (searchQuery) {
        return __awaiter(this, void 0, void 0, function () {
            var query, restriction, minSuggestionCount, maxResults, result, result_1;
            var _this = this;
            return __generator(this, function (_a) {
                if (this._lastQuery && searchQueryEquals(searchQuery, this._lastQuery)) {
                    return [2 /*return*/, this._lastSearchPromise];
                }
                this._lastQuery = searchQuery;
                query = searchQuery.query, restriction = searchQuery.restriction, minSuggestionCount = searchQuery.minSuggestionCount, maxResults = searchQuery.maxResults;
                this.lastQuery(query);
                result = this.result();
                if (result && !(0, tutanota_utils_1.isSameTypeRef)(restriction.type, result.restriction.type)) {
                    // reset the result in case only the search type has changed
                    this.result(null);
                }
                else if (this.indexState().progress > 0 && result && (0, tutanota_utils_1.isSameTypeRef)(TypeRefs_js_1.MailTypeRef, result.restriction.type)) {
                    // reset the result if indexing is in progress and the current search result is of type mail
                    this.result(null);
                }
                if (query.trim() === "") {
                    result_1 = {
                        query: query,
                        restriction: restriction,
                        results: [],
                        currentIndexTimestamp: this.indexState().currentMailIndexTimestamp,
                        lastReadSearchIndexRow: [],
                        maxResults: 0,
                        matchWordOrder: false,
                        moreResults: [],
                        moreResultsEntries: []
                    };
                    this.result(result_1);
                    this._lastSearchPromise = Promise.resolve(result_1);
                }
                else {
                    this._lastSearchPromise = this._searchFacade
                        .search(query, restriction, minSuggestionCount, maxResults !== null && maxResults !== void 0 ? maxResults : undefined)
                        .then(function (result) {
                        _this.result(result);
                        return result;
                    })["catch"]((0, tutanota_utils_2.ofClass)(DbError_1.DbError, function (e) {
                        console.log("DBError while search", e);
                        if ((0, tutanota_utils_1.isSameTypeRef)(TypeRefs_js_1.MailTypeRef, restriction.type) && !_this.indexState().mailIndexEnabled) {
                            console.log("Mail indexing was disabled, ignoring DBError");
                            _this.result(null);
                        }
                        else {
                            throw e;
                        }
                    }));
                }
                return [2 /*return*/, this._lastSearchPromise];
            });
        });
    };
    SearchModel.prototype.isNewSearch = function (query, restriction) {
        var result = this.result();
        if (result == null) {
            return true;
        }
        if (query !== result.query) {
            return true;
        }
        if (result.restriction === restriction) {
            // both are the same instance
            return false;
        }
        return !searchRestrictionEquals(restriction, result.restriction);
    };
    return SearchModel;
}());
exports.SearchModel = SearchModel;
function searchQueryEquals(a, b) {
    return (a.query === b.query &&
        searchRestrictionEquals(a.restriction, b.restriction) &&
        a.minSuggestionCount === b.minSuggestionCount &&
        a.maxResults === b.maxResults);
}
function searchRestrictionEquals(a, b) {
    var isSameAttributeIds = a.attributeIds === b.attributeIds || (!!a.attributeIds && !!b.attributeIds && (0, tutanota_utils_3.arrayEquals)(a.attributeIds, b.attributeIds));
    return (0, tutanota_utils_1.isSameTypeRef)(a.type, b.type) && a.start === b.start && a.end === b.end && a.field === b.field && isSameAttributeIds && a.listId === b.listId;
}
function hasMoreResults(searchResult) {
    return (searchResult.moreResults.length > 0 ||
        (searchResult.lastReadSearchIndexRow.length > 0 && searchResult.lastReadSearchIndexRow.every(function (_a) {
            var word = _a[0], id = _a[1];
            return id !== 0;
        })));
}
exports.hasMoreResults = hasMoreResults;
