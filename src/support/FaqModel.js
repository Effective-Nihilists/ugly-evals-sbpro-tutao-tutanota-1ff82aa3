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
exports.faq = exports.FaqModel = void 0;
var LanguageViewModel_1 = require("../misc/LanguageViewModel");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var PlainTextSearch_1 = require("../api/common/utils/PlainTextSearch");
var tutanota_utils_2 = require("@tutao/tutanota-utils");
var HtmlSanitizer_1 = require("../misc/HtmlSanitizer");
var tutanota_utils_3 = require("@tutao/tutanota-utils");
var FAQ_PREFIX = "faq.";
var MARKDOWN_SUFFIX = "_markdown";
/**
 * Loads FAQ entries from tutanota.com for different languages and allows searching
 *
 *
 */
// visibility only for testing
var FaqModel = /** @class */ (function () {
    function FaqModel() {
        var _this = this;
        this._list = null;
        this._currentLanguageCode = null;
        this._faqLanguages = null;
        this._lazyLoaded = new tutanota_utils_2.LazyLoaded(function () {
            return Promise.all([_this.fetchFAQ("en"), _this.fetchFAQ(LanguageViewModel_1.lang.code)]).then(function (_a) {
                var defaultTranslations = _a[0], currentLanguageTranslations = _a[1];
                if (defaultTranslations != null || currentLanguageTranslations != null) {
                    var faqLanguageViewModel = new LanguageViewModel_1.LanguageViewModel();
                    faqLanguageViewModel.initWithTranslations(LanguageViewModel_1.lang.code, LanguageViewModel_1.lang.languageTag, defaultTranslations, currentLanguageTranslations);
                    _this._faqLanguages = faqLanguageViewModel;
                }
            });
        });
    }
    Object.defineProperty(FaqModel.prototype, "faqLang", {
        get: function () {
            if (this._faqLanguages == null) {
                throw new Error("Not initialized!");
            }
            return this._faqLanguages;
        },
        enumerable: false,
        configurable: true
    });
    FaqModel.prototype.init = function () {
        return this._lazyLoaded.getAsync();
    };
    FaqModel.prototype.fetchFAQ = function (langCode) {
        return __awaiter(this, void 0, void 0, function () {
            var faqPath, keys, entries, translations;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        faqPath = "https://tutanota.com/faq-entries/".concat(langCode, ".json");
                        return [4 /*yield*/, fetch(faqPath)
                                .then(function (response) { return response.json(); })
                                .then(function (language) { return language.keys; })["catch"](function (error) {
                                console.log("Failed to fetch FAQ entries", error);
                                return {};
                            })];
                    case 1:
                        keys = _a.sent();
                        return [4 /*yield*/, (0, tutanota_utils_3.promiseMap)(Object.entries(keys), function (_a) {
                                var key = _a[0], entry = _a[1];
                                return __awaiter(_this, void 0, void 0, function () {
                                    var unsanitizedText, sanitized;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                // If entry isn't a string it means we're getting malformed responses
                                                (0, tutanota_utils_1.assert)(typeof entry === "string", "invalid translation entry");
                                                unsanitizedText = (0, tutanota_utils_1.downcast)(entry);
                                                sanitized = HtmlSanitizer_1.htmlSanitizer.sanitizeHTML(unsanitizedText, {
                                                    blockExternalContent: false
                                                });
                                                // Delay to spread sanitize() calls between event loops.
                                                // Otherwise we stop main thread for way too long and UI gets laggy.
                                                return [4 /*yield*/, (0, tutanota_utils_3.delay)(1)];
                                            case 1:
                                                // Delay to spread sanitize() calls between event loops.
                                                // Otherwise we stop main thread for way too long and UI gets laggy.
                                                _b.sent();
                                                return [2 /*return*/, [key, sanitized.html]];
                                        }
                                    });
                                });
                            })];
                    case 2:
                        entries = _a.sent();
                        translations = Object.fromEntries(entries);
                        return [2 /*return*/, {
                                code: langCode,
                                keys: translations
                            }];
                }
            });
        });
    };
    FaqModel.prototype.getList = function () {
        var _this = this;
        if (this._list == null && this._faqLanguages == null) {
            return [];
        }
        if (this._list == null || this._currentLanguageCode !== LanguageViewModel_1.lang.code) {
            this._currentLanguageCode = LanguageViewModel_1.lang.code;
            var faqNames = Object.keys(this.faqLang.fallback.keys);
            this._list = faqNames
                .filter(function (key) { return key.startsWith(FAQ_PREFIX) && key.endsWith(MARKDOWN_SUFFIX); })
                .map(function (titleKey) { return titleKey.substring(FAQ_PREFIX.length, titleKey.indexOf(MARKDOWN_SUFFIX)); })
                .map(function (name) { return _this.createFAQ(name); });
        }
        return this._list;
    };
    FaqModel.prototype.search = function (query) {
        var cleanQuery = query.trim();
        if (cleanQuery === "") {
            return [];
        }
        else {
            return (0, PlainTextSearch_1.search)(cleanQuery, this.getList(), ["tags", "title", "text"], true);
        }
    };
    FaqModel.prototype.createFAQ = function (id) {
        return {
            id: id,
            title: this.faqLang.get((0, tutanota_utils_1.downcast)("faq.".concat(id, "_title"))),
            text: this.faqLang.get((0, tutanota_utils_1.downcast)("faq.".concat(id, "_markdown"))),
            tags: this.getTags("faq.".concat(id, "_tags"))
        };
    };
    FaqModel.prototype.getTags = function (id) {
        try {
            return this.faqLang.get((0, tutanota_utils_1.downcast)(id));
        }
        catch (e) {
            return "";
        }
    };
    return FaqModel;
}());
exports.FaqModel = FaqModel;
exports.faq = new FaqModel();
