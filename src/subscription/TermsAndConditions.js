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
exports.showServiceTerms = exports.renderTermsAndConditionsButton = exports.CURRENT_GIFT_CARD_TERMS_VERSION = exports.CURRENT_PRIVACY_VERSION = exports.CURRENT_TERMS_VERSION = void 0;
/**
 * The most recently published version of the terms and conditions
 */
var mithril_1 = require("mithril");
var LanguageViewModel_1 = require("../misc/LanguageViewModel");
var Env_1 = require("../api/common/Env");
var Website_1 = require("../misc/Website");
var Dialog_1 = require("../gui/base/Dialog");
var HtmlSanitizer_1 = require("../misc/HtmlSanitizer");
/**
 * The most up-to-date versions of the terms and conditions, privacy statement, and gift card terms
 * must be in sync with the website
 */
exports.CURRENT_TERMS_VERSION = "3.2";
exports.CURRENT_PRIVACY_VERSION = "3.1";
exports.CURRENT_GIFT_CARD_TERMS_VERSION = "1.0";
/**
 * Show a link to the terms and conditions page on the website.
 * In the mobile apps, it will instead open a dialog containing the text
 */
function renderTermsAndConditionsButton(terms, version) {
    var label;
    var link;
    switch (terms) {
        case "giftCardsTerms-entries" /* TermsSection.GiftCards */:
            label = LanguageViewModel_1.lang.get("giftCardTerms_label");
            link = "https://tutanota.com/giftCardsTerms" /* InfoLink.GiftCardsTerms */;
            break;
        case "terms-entries" /* TermsSection.Terms */:
            label = LanguageViewModel_1.lang.get("termsAndConditionsLink_label");
            link = "https://tutanota.com/terms" /* InfoLink.Terms */;
            break;
        case "privacy-policy-entries" /* TermsSection.Privacy */:
            label = LanguageViewModel_1.lang.get("privacyLink_label");
            link = "https://tutanota.com/privacy-policy" /* InfoLink.Privacy */;
            break;
    }
    return (0, mithril_1["default"])("a[href=".concat(link, "][target=_blank]"), {
        onclick: function (e) {
            if ((0, Env_1.isApp)()) {
                showServiceTerms(terms, version);
                e.preventDefault();
            }
        }
    }, label);
}
exports.renderTermsAndConditionsButton = renderTermsAndConditionsButton;
function showServiceTerms(section, version) {
    return __awaiter(this, void 0, void 0, function () {
        function getSection() {
            return HtmlSanitizer_1.htmlSanitizer.sanitizeHTML(termsFromWebsite[visibleLang], {
                blockExternalContent: false
            }).html;
        }
        var path, termsFromWebsite, visibleLang, dialog, sanitizedTerms, headerBarAttrs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    path = "/".concat(section, "/").concat(version, ".json");
                    return [4 /*yield*/, (0, Website_1.requestFromWebsite)(path).then(function (res) { return res.json(); })];
                case 1:
                    termsFromWebsite = _a.sent();
                    visibleLang = LanguageViewModel_1.lang.code.startsWith("de") ? "de" : "en";
                    headerBarAttrs = {
                        left: [
                            {
                                label: function () { return "EN/DE"; },
                                click: function () {
                                    visibleLang = visibleLang === "de" ? "en" : "de";
                                    sanitizedTerms = getSection();
                                    mithril_1["default"].redraw();
                                },
                                type: "secondary" /* ButtonType.Secondary */
                            },
                        ],
                        right: [
                            {
                                label: "ok_action",
                                click: function () { return dialog.close(); },
                                type: "primary" /* ButtonType.Primary */
                            },
                        ]
                    };
                    sanitizedTerms = getSection();
                    dialog = Dialog_1.Dialog.largeDialog(headerBarAttrs, {
                        view: function () { return (0, mithril_1["default"])(".text-break", mithril_1["default"].trust(sanitizedTerms)); }
                    }).show();
                    return [2 /*return*/];
            }
        });
    });
}
exports.showServiceTerms = showServiceTerms;
