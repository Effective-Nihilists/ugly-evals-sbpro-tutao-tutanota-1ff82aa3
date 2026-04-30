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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.getCurrentSpellcheckLanguageLabel = exports.showSpellcheckLanguageDialog = void 0;
var MainLocator_1 = require("../../api/main/MainLocator");
function showSpellcheckLanguageDialog() {
    return __awaiter(this, void 0, void 0, function () {
        var DesktopConfigKey, current, Dialog, items, newLang, selectedItem;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../../desktop/config/ConfigKeys"); })];
                case 1:
                    DesktopConfigKey = (_a.sent()).DesktopConfigKey;
                    return [4 /*yield*/, getCurrentSpellcheckLanguage()];
                case 2:
                    current = _a.sent();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../base/Dialog.js"); })];
                case 3:
                    Dialog = (_a.sent()).Dialog;
                    return [4 /*yield*/, getItems()
                        // this is a language code
                    ];
                case 4:
                    items = _a.sent();
                    return [4 /*yield*/, Dialog.showDropDownSelectionDialog("spelling_label", "language_label", null, items, current)];
                case 5:
                    newLang = _a.sent();
                    return [4 /*yield*/, MainLocator_1.locator.desktopSettingsFacade.setStringConfigValue(DesktopConfigKey.spellcheck, newLang)
                        // return displayable language name
                    ];
                case 6:
                    _a.sent();
                    selectedItem = items.find(function (i) { return i.value === newLang; });
                    return [2 /*return*/, selectedItem ? selectedItem.name : items[0].name];
            }
        });
    });
}
exports.showSpellcheckLanguageDialog = showSpellcheckLanguageDialog;
function getCurrentSpellcheckLanguageLabel() {
    return __awaiter(this, void 0, void 0, function () {
        var current, items, selectedItem;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getCurrentSpellcheckLanguage()];
                case 1:
                    current = _a.sent();
                    return [4 /*yield*/, getItems()];
                case 2:
                    items = _a.sent();
                    selectedItem = items.find(function (i) { return i.value === current; });
                    return [2 /*return*/, selectedItem ? selectedItem.name : items[0].name];
            }
        });
    });
}
exports.getCurrentSpellcheckLanguageLabel = getCurrentSpellcheckLanguageLabel;
function getCurrentSpellcheckLanguage() {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var DesktopConfigKey;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../../desktop/config/ConfigKeys"); })];
                case 1:
                    DesktopConfigKey = (_b.sent()).DesktopConfigKey;
                    return [4 /*yield*/, MainLocator_1.locator.desktopSettingsFacade.getStringConfigValue(DesktopConfigKey.spellcheck)];
                case 2: return [2 /*return*/, (_a = (_b.sent())) !== null && _a !== void 0 ? _a : ""];
            }
        });
    });
}
function getItems() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, languages, lang, options;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../../misc/LanguageViewModel.js"); })];
                case 1:
                    _a = _b.sent(), languages = _a.languages, lang = _a.lang;
                    return [4 /*yield*/, MainLocator_1.locator.desktopSettingsFacade.getSpellcheckLanguages()];
                case 2:
                    options = _b.sent();
                    return [2 /*return*/, __spreadArray([
                            {
                                name: lang.get("comboBoxSelectionNone_msg"),
                                value: ""
                            }
                        ], options
                            .map(function (code) {
                            var _a = code.split("-"), langCode = _a[0], locale = _a[1];
                            // first, find the name for a language given a locale with a perfect match
                            var language = languages.find(function (language) { return locale && language.code === "".concat(langCode, "_").concat(locale.toLowerCase()); }) || // find the name for a language without a locale, with a perfect match
                                languages.find(function (language) { return language.code === langCode; }) || // try to get a missing one before splitting
                                getMissingLanguage(langCode) || // the code given by electron doesn't always have a locale when we do,
                                // e.g. for Persian we have "fa_ir" in LanguageViewModel, but electron only gives us "fa"
                                languages.find(function (language) { return language.code.slice(0, 2) === langCode; });
                            var textId = language === null || language === void 0 ? void 0 : language.textId;
                            var name = textId ? lang.get(textId) + " (".concat(code, ")") : code;
                            return {
                                name: name,
                                value: code
                            };
                        })
                            .sort(function (a, b) { return a.name.localeCompare(b.name); }), true)];
            }
        });
    });
}
/**
 * Electron has a different selection of spellchecker languages from what our client supports,
 * so we can't get all of the names from the LanguageViewModel
 */
function getMissingLanguage(code) {
    var mapping = {
        af: "languageAfrikaans_label",
        cy: "languageWelsh_label",
        fo: "languageFaroese_label",
        hy: "languageArmenian_label",
        nb: "languageNorwegianBokmal_label",
        sh: "languageSerboCroatian_label",
        sq: "languageAlbanian_label",
        ta: "languageTamil_label",
        tg: "languageTajik_label",
        pt: "languagePortugese_label"
    };
    var id = mapping[code];
    return id ? { textId: id, code: code } : null;
}
