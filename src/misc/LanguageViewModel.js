"use strict";
exports.__esModule = true;
exports.lang = exports.assertTranslation = exports.languageCodeToTag = exports.getAvailableLanguageCode = exports.getSubstitutedLanguageCode = exports.getLanguage = exports.getLanguageNoDefault = exports.LanguageViewModel = exports.languages = exports.languageByCode = exports.LanguageNames = void 0;
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var WhitelabelCustomizations_1 = require("./WhitelabelCustomizations");
var Env_1 = require("../api/common/Env");
(0, Env_1.assertMainOrNodeBoot)();
var translationImportMap = {
    ar: function () { return Promise.resolve().then(function () { return require("../translations/ar.js"); }); },
    be: function () { return Promise.resolve().then(function () { return require("../translations/be.js"); }); },
    bg: function () { return Promise.resolve().then(function () { return require("../translations/bg.js"); }); },
    ca: function () { return Promise.resolve().then(function () { return require("../translations/ca.js"); }); },
    cs: function () { return Promise.resolve().then(function () { return require("../translations/cs.js"); }); },
    da: function () { return Promise.resolve().then(function () { return require("../translations/da.js"); }); },
    de: function () { return Promise.resolve().then(function () { return require("../translations/de.js"); }); },
    de_sie: function () { return Promise.resolve().then(function () { return require("../translations/de_sie.js"); }); },
    el: function () { return Promise.resolve().then(function () { return require("../translations/el.js"); }); },
    en: function () { return Promise.resolve().then(function () { return require("../translations/en.js"); }); },
    en_gb: function () { return Promise.resolve().then(function () { return require("../translations/en.js"); }); },
    es: function () { return Promise.resolve().then(function () { return require("../translations/es.js"); }); },
    et: function () { return Promise.resolve().then(function () { return require("../translations/et.js"); }); },
    fa_ir: function () { return Promise.resolve().then(function () { return require("../translations/fa_ir.js"); }); },
    fi: function () { return Promise.resolve().then(function () { return require("../translations/fi.js"); }); },
    fr: function () { return Promise.resolve().then(function () { return require("../translations/fr.js"); }); },
    gl: function () { return Promise.resolve().then(function () { return require("../translations/gl.js"); }); },
    he: function () { return Promise.resolve().then(function () { return require("../translations/he.js"); }); },
    hi: function () { return Promise.resolve().then(function () { return require("../translations/hi.js"); }); },
    hr: function () { return Promise.resolve().then(function () { return require("../translations/hr.js"); }); },
    hu: function () { return Promise.resolve().then(function () { return require("../translations/hu.js"); }); },
    id: function () { return Promise.resolve().then(function () { return require("../translations/id.js"); }); },
    it: function () { return Promise.resolve().then(function () { return require("../translations/it.js"); }); },
    ja: function () { return Promise.resolve().then(function () { return require("../translations/ja.js"); }); },
    ko: function () { return Promise.resolve().then(function () { return require("../translations/ko.js"); }); },
    lt: function () { return Promise.resolve().then(function () { return require("../translations/lt.js"); }); },
    lv: function () { return Promise.resolve().then(function () { return require("../translations/lv.js"); }); },
    nl: function () { return Promise.resolve().then(function () { return require("../translations/nl.js"); }); },
    no: function () { return Promise.resolve().then(function () { return require("../translations/no.js"); }); },
    pl: function () { return Promise.resolve().then(function () { return require("../translations/pl.js"); }); },
    pt_br: function () { return Promise.resolve().then(function () { return require("../translations/pt_br.js"); }); },
    pt_pt: function () { return Promise.resolve().then(function () { return require("../translations/pt_pt.js"); }); },
    ro: function () { return Promise.resolve().then(function () { return require("../translations/ro.js"); }); },
    ru: function () { return Promise.resolve().then(function () { return require("../translations/ru.js"); }); },
    si: function () { return Promise.resolve().then(function () { return require("../translations/si.js"); }); },
    sk: function () { return Promise.resolve().then(function () { return require("../translations/sk.js"); }); },
    sl: function () { return Promise.resolve().then(function () { return require("../translations/sl.js"); }); },
    sr_cyrl: function () { return Promise.resolve().then(function () { return require("../translations/sr_cyrl.js"); }); },
    sv: function () { return Promise.resolve().then(function () { return require("../translations/sv.js"); }); },
    tr: function () { return Promise.resolve().then(function () { return require("../translations/tr.js"); }); },
    uk: function () { return Promise.resolve().then(function () { return require("../translations/uk.js"); }); },
    vi: function () { return Promise.resolve().then(function () { return require("../translations/vi.js"); }); },
    zh: function () { return Promise.resolve().then(function () { return require("../translations/zh.js"); }); },
    zh_hant: function () { return Promise.resolve().then(function () { return require("../translations/zh_hant.js"); }); }
};
/**
 * Language = {code, textId}
 * "code" is the 2 letter abbr. of the language ("en", "ar")
 * "textId" corresponds to a code ("languageEnglish_label", "languageArabic_label")
 *
 * lang.get(textId) will return the translated languages
 * languageByCode[code] will return the whole language Object
 * in all cases lang.get(languageByCode[code].textId) will always return the translated language from a code
 */
exports.LanguageNames = Object.freeze({
    ar: "languageArabic_label",
    be: "languageBelarusian_label",
    bg: "languageBulgarian_label",
    ca: "languageCatalan_label",
    cs: "languageCzech_label",
    da: "languageDanish_label",
    de: "languageGerman_label",
    de_sie: "languageGermanSie_label",
    el: "languageGreek_label",
    en: "languageEnglish_label",
    en_gb: "languageEnglishUk_label",
    es: "languageSpanish_label",
    et: "languageEstonian_label",
    fa_ir: "languagePersian_label",
    fi: "languageFinnish_label",
    fr: "languageFrench_label",
    gl: "languageGalician_label",
    he: "languageHebrew_label",
    hi: "languageHindi_label",
    hr: "languageCroatian_label",
    hu: "languageHungarian_label",
    id: "languageIndonesian_label",
    it: "languageItalian_label",
    ja: "languageJapanese_label",
    ko: "languageKorean_label",
    lt: "languageLithuanian_label",
    lv: "languageLatvian_label",
    nl: "languageDutch_label",
    no: "languageNorwegian_label",
    pl: "languagePolish_label",
    pt_br: "languagePortugeseBrazil_label",
    pt_pt: "languagePortugesePortugal_label",
    ro: "languageRomanian_label",
    ru: "languageRussian_label",
    si: "languageSinhalese_label",
    sk: "languageSlovak_label",
    sl: "languageSlovenian_label",
    sr_cyrl: "languageSerbian_label",
    sv: "languageSwedish_label",
    tr: "languageTurkish_label",
    uk: "languageUkrainian_label",
    vi: "languageVietnamese_label",
    zh: "languageChineseSimplified_label",
    zh_hant: "languageChineseTraditional_label"
});
exports.languageByCode = {};
// cannot import typedEntries here for some reason
for (var _i = 0, _a = (0, tutanota_utils_1.downcast)(Object.entries(exports.LanguageNames)); _i < _a.length; _i++) {
    var _b = _a[_i], code = _b[0], textId = _b[1];
    exports.languageByCode[code] = {
        code: code,
        textId: textId
    };
}
exports.languages = (0, tutanota_utils_1.typedEntries)(exports.LanguageNames).map(function (_a) {
    var code = _a[0], textId = _a[1];
    return {
        code: code,
        textId: textId
    };
});
/**
 * Provides all localizations of strings on our gui.
 *
 * The translations are defined on JSON files. See the folder 'translations' for examples.
 * The actual identifier is camel case and the type is appended by an underscore.
 * Types: label, action, msg, title, alt, placeholder
 *
 * @constructor
 */
var LanguageViewModel = /** @class */ (function () {
    function LanguageViewModel() {
        this.translations = {};
        this.fallback = {};
        this.staticTranslations = {};
    }
    LanguageViewModel.prototype.init = function (en) {
        var _this = this;
        this.translations = en;
        this.fallback = en; // always load english as fallback
        this.code = "en";
        var language = getLanguage();
        return this.setLanguage(language) // Service worker currently caches only English. We don't want the whole app to fail if we cannot fetch the language.
        ["catch"](function (e) {
            console.warn("Could not set language", language, e);
            _this._setLanguageTag("en-US");
        });
    };
    LanguageViewModel.prototype.addStaticTranslation = function (key, text) {
        this.staticTranslations[key] = text;
    };
    LanguageViewModel.prototype.initWithTranslations = function (code, languageTag, fallBackTranslations, translations) {
        this.translations = translations;
        this.fallback = fallBackTranslations;
        this.code = code;
    };
    LanguageViewModel.prototype.setLanguage = function (lang) {
        var _this = this;
        this._setLanguageTag(lang.languageTag);
        if (this.code === lang.code) {
            return Promise.resolve();
        }
        // we don't support multiple language files for en so just use the one and only.
        var code = lang.code.startsWith("en") ? "en" : lang.code;
        return translationImportMap[code]().then(function (translationsModule) {
            _this.translations = translationsModule["default"];
            _this.code = lang.code;
        });
    };
    /**
     * must be invoked at startup from LanguageViewModel to initialize all DateTimeFormats
     * @param codes
     */
    LanguageViewModel.prototype._setLanguageTag = function (tag) {
        this.languageTag = tag;
        this.updateFormats({});
    };
    LanguageViewModel.prototype.updateFormats = function (options) {
        var tag = this.languageTag;
        this.formats = {
            simpleDate: new Intl.DateTimeFormat(tag, {
                day: "numeric",
                month: "numeric",
                year: "numeric"
            }),
            dateWithMonth: new Intl.DateTimeFormat(tag, {
                day: "numeric",
                month: "short",
                year: "numeric"
            }),
            dateWithoutYear: Intl.DateTimeFormat(tag, {
                day: "numeric",
                month: "short"
            }),
            simpleDateWithoutYear: Intl.DateTimeFormat(tag, {
                day: "numeric",
                month: "numeric"
            }),
            dateWithWeekday: new Intl.DateTimeFormat(tag, {
                weekday: "short",
                day: "numeric",
                month: "short"
            }),
            dateWithWeekdayWoMonth: new Intl.DateTimeFormat(tag, {
                weekday: "short",
                day: "numeric"
            }),
            dateWithWeekdayAndYear: new Intl.DateTimeFormat(tag, {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric"
            }),
            dateWithWeekdayAndYearLong: new Intl.DateTimeFormat(tag, {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }),
            dateWithWeekdayAndTime: new Intl.DateTimeFormat(tag, Object.assign({}, {
                weekday: "short",
                day: "numeric",
                month: "short",
                hour: "numeric",
                minute: "numeric"
            }, options)),
            time: new Intl.DateTimeFormat(tag, Object.assign({}, {
                hour: "numeric",
                minute: "numeric"
            }, options)),
            dateTime: new Intl.DateTimeFormat(tag, Object.assign({}, {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "numeric"
            }, options)),
            dateTimeShort: new Intl.DateTimeFormat(tag, Object.assign({}, {
                day: "numeric",
                month: "numeric",
                year: "numeric",
                hour: "numeric"
            }, options)),
            weekdayShort: new Intl.DateTimeFormat(tag, {
                weekday: "short"
            }),
            weekdayNarrow: new Intl.DateTimeFormat(tag, {
                weekday: "narrow"
            }),
            priceWithCurrency: new Intl.NumberFormat(tag, {
                style: "currency",
                currency: "EUR",
                minimumFractionDigits: 2
            }),
            priceWithCurrencyWithoutFractionDigits: new Intl.NumberFormat(tag, {
                style: "currency",
                currency: "EUR",
                maximumFractionDigits: 0,
                minimumFractionDigits: 0
            }),
            priceWithoutCurrency: new Intl.NumberFormat(tag, {
                style: "decimal",
                minimumFractionDigits: 2
            }),
            priceWithoutCurrencyWithoutFractionDigits: new Intl.NumberFormat(tag, {
                style: "decimal",
                maximumFractionDigits: 0,
                minimumFractionDigits: 0
            }),
            monthLong: new Intl.DateTimeFormat(tag, {
                month: "long"
            }),
            monthWithYear: new Intl.DateTimeFormat(tag, {
                month: "long",
                year: "2-digit"
            }),
            monthWithFullYear: new Intl.DateTimeFormat(tag, {
                month: "long",
                year: "numeric"
            }),
            yearNumeric: new Intl.DateTimeFormat(tag, {
                year: "numeric"
            })
        };
    };
    LanguageViewModel.prototype.exists = function (id) {
        try {
            this.get(id);
            return true;
        }
        catch (e) {
            return false;
        }
    };
    /**
     * @throws An error if there is no translation for the given id.
     */
    LanguageViewModel.prototype.get = function (id, replacements) {
        if (id == null) {
            return "";
        }
        if (id === "emptyString_msg") {
            return "\u2008";
        }
        var text = this.translations.keys[id];
        if (!text) {
            // try fallback language
            text = this.fallback.keys[id];
            if (!text) {
                // try static definitions
                text = this.staticTranslations[id];
                if (!text) {
                    throw new Error("no translation found for id " + id);
                }
            }
        }
        for (var param in replacements) {
            text = (0, tutanota_utils_1.replaceAll)(text, param, replacements[param]);
        }
        return text;
    };
    LanguageViewModel.prototype.getMaybeLazy = function (value) {
        return typeof value === "function" ? value() : exports.lang.get(value);
    };
    return LanguageViewModel;
}());
exports.LanguageViewModel = LanguageViewModel;
/**
 * Gets the default language derived from the browser language.
 * @param restrictions An array of language codes the selection should be restricted to
 */
function getLanguageNoDefault(restrictions) {
    // navigator.languages can be an empty array on android 5.x devices
    var languageTags;
    if (typeof navigator !== "undefined") {
        languageTags = navigator.languages && navigator.languages.length > 0 ? navigator.languages : [navigator.language];
    }
    else if (typeof process !== "undefined" && typeof process.env !== "undefined") {
        var locale = process.env.LC_ALL || process.env.LC_MESSAGES || process.env.LANG || process.env.LANGUAGE || process.env.LC_NAME;
        if (locale) {
            languageTags = [locale.split(".")[0].replace("_", "-")];
        }
    }
    if (languageTags) {
        for (var _i = 0, languageTags_1 = languageTags; _i < languageTags_1.length; _i++) {
            var tag = languageTags_1[_i];
            var code = getSubstitutedLanguageCode(tag, restrictions);
            if (code) {
                return {
                    code: code,
                    languageTag: tag
                };
            }
        }
    }
    return null;
}
exports.getLanguageNoDefault = getLanguageNoDefault;
/**
 * Gets the default language derived from the browser language.
 * @param restrictions An array of language codes the selection should be restricted to
 */
function getLanguage(restrictions) {
    var language = getLanguageNoDefault(restrictions);
    if (language)
        return language;
    if (restrictions == null || restrictions.indexOf("en") !== -1) {
        return {
            code: "en",
            languageTag: "en-US"
        };
    }
    else {
        return {
            code: restrictions[0],
            languageTag: restrictions[0].replace("/_/g", "-")
        };
    }
}
exports.getLanguage = getLanguage;
function getSubstitutedLanguageCode(tag, restrictions) {
    var code = tag.toLowerCase().replace("-", "_");
    var language = exports.languages.find(function (l) { return l.code === code && (restrictions == null || restrictions.indexOf(l.code) !== -1); });
    if (language == null) {
        if (code === "zh_hk" || code === "zh_tw") {
            language = exports.languages.find(function (l) { return l.code === "zh_hant"; });
        }
        else {
            var basePart_1 = getBasePart(code);
            language = exports.languages.find(function (l) { return getBasePart(l.code) === basePart_1 && (restrictions == null || restrictions.indexOf(l.code) !== -1); });
        }
    }
    if (language) {
        var customizations = null;
        // accessing `window` throws an error on desktop, and this file is imported by DesktopMain
        if (typeof window !== "undefined") {
            customizations = (0, WhitelabelCustomizations_1.getWhitelabelCustomizations)(window);
        }
        var germanCode = customizations === null || customizations === void 0 ? void 0 : customizations.germanLanguageCode;
        if (language.code === "de" && germanCode != null) {
            return (0, tutanota_utils_1.downcast)(germanCode);
        }
        else {
            return language.code;
        }
    }
    else {
        return null;
    }
}
exports.getSubstitutedLanguageCode = getSubstitutedLanguageCode;
function getBasePart(code) {
    var indexOfUnderscore = code.indexOf("_");
    if (indexOfUnderscore > 0) {
        return code.substring(0, indexOfUnderscore);
    }
    else {
        return code;
    }
}
function getAvailableLanguageCode(code) {
    return getSubstitutedLanguageCode(code) || "en";
}
exports.getAvailableLanguageCode = getAvailableLanguageCode;
/**
 * pt_br -> pt-BR
 * @param code
 */
function languageCodeToTag(code) {
    if (code === "de_sie") {
        return "de";
    }
    var indexOfUnderscore = code.indexOf("_");
    if (indexOfUnderscore === -1) {
        return code;
    }
    else {
        var _a = code.split("_"), before = _a[0], after = _a[1];
        return "".concat(before, "-").concat(after.toUpperCase());
    }
}
exports.languageCodeToTag = languageCodeToTag;
exports.assertTranslation = tutanota_utils_1.downcast;
exports.lang = new LanguageViewModel();
