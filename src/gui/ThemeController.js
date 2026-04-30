"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.WebThemeFacade = exports.NativeThemeFacade = exports.ThemeController = void 0;
var DeviceConfig_1 = require("../misc/DeviceConfig");
var stream_1 = require("mithril/stream");
var Env_1 = require("../api/common/Env");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var mithril_1 = require("mithril");
var builtinThemes_1 = require("./builtinThemes");
var WhitelabelCustomizations_1 = require("../misc/WhitelabelCustomizations");
var Logo_1 = require("./base/Logo");
(0, Env_1.assertMainOrNodeBoot)();
var ThemeController = /** @class */ (function () {
    function ThemeController(themeFacade, htmlSanitizer) {
        this.themeFacade = themeFacade;
        this.htmlSanitizer = htmlSanitizer;
        // this will change soon
        this._themeId = DeviceConfig_1.defaultThemeId;
        this._theme = this.getDefaultTheme();
        this.themeIdChangedStream = (0, stream_1["default"])(this.themeId);
        // We run them in parallel to initialize as soon as possible
        this.initialized = Promise.all([this._initializeTheme(), this._updateBuiltinThemes()]);
    }
    ThemeController.prototype._initializeTheme = function () {
        return __awaiter(this, void 0, void 0, function () {
            var whitelabelCustomizations, themeJson, parsedTheme;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        whitelabelCustomizations = (0, WhitelabelCustomizations_1.getWhitelabelCustomizations)(window);
                        if (!(whitelabelCustomizations && whitelabelCustomizations.theme)) return [3 /*break*/, 2];
                        // no need to persist anything if we are on whitelabel domain
                        return [4 /*yield*/, this.updateCustomTheme(whitelabelCustomizations.theme, false)];
                    case 1:
                        // no need to persist anything if we are on whitelabel domain
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 2:
                        themeJson = window.location.href ? new URL(window.location.href).searchParams.get("theme") : null;
                        if (!(((0, Env_1.isApp)() || (0, Env_1.isDesktop)()) && themeJson)) return [3 /*break*/, 4];
                        parsedTheme = this._parseCustomizations(themeJson);
                        // We also don't need to save anything in this case
                        return [4 /*yield*/, this.updateCustomTheme(parsedTheme, false)];
                    case 3:
                        // We also don't need to save anything in this case
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.reloadTheme()];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ThemeController.prototype._parseCustomizations = function (stringTheme) {
        // Filter out __proto__ to avoid prototype pollution. We use Object.assign() which is not susceptible to it but it doesn't hurt.
        return JSON.parse(stringTheme, function (k, v) { return (k === "__proto__" ? undefined : v); });
    };
    ThemeController.prototype._updateBuiltinThemes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, theme;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, _a = (0, tutanota_utils_1.typedValues)(builtinThemes_1.themes);
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        theme = _a[_i];
                        return [4 /*yield*/, this.updateSavedThemeDefinition(theme)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ThemeController.prototype.reloadTheme = function () {
        return __awaiter(this, void 0, void 0, function () {
            var themeId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.themeFacade.getSelectedTheme()];
                    case 1:
                        themeId = _a.sent();
                        if (!themeId)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.setThemeId(themeId, false)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(ThemeController.prototype, "themeId", {
        get: function () {
            return this._themeId;
        },
        enumerable: false,
        configurable: true
    });
    ThemeController.prototype._getTheme = function (themeId) {
        return __awaiter(this, void 0, void 0, function () {
            var loadedThemes, customTheme;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!builtinThemes_1.themes[themeId]) return [3 /*break*/, 1];
                        // Make a defensive copy so that original theme definition is not modified.
                        return [2 /*return*/, Object.assign({}, builtinThemes_1.themes[themeId])];
                    case 1: return [4 /*yield*/, this.themeFacade.getThemes()];
                    case 2:
                        loadedThemes = _a.sent();
                        customTheme = loadedThemes.find(function (t) { return t.themeId === themeId; });
                        if (!customTheme) return [3 /*break*/, 4];
                        return [4 /*yield*/, this._sanitizeTheme(customTheme)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, customTheme];
                    case 4: return [2 /*return*/, this.getDefaultTheme()];
                }
            });
        });
    };
    ThemeController.prototype.getCurrentTheme = function () {
        return Object.assign({}, this._theme);
    };
    /**
     * Set the theme, if permanent is true then the locally saved theme will be updated
     */
    ThemeController.prototype.setThemeId = function (newThemeId, permanent) {
        if (permanent === void 0) { permanent = true; }
        return __awaiter(this, void 0, void 0, function () {
            var newTheme;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getTheme(newThemeId)];
                    case 1:
                        newTheme = _a.sent();
                        this._applyTrustedTheme(newTheme, newThemeId);
                        if (!permanent) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.themeFacade.setSelectedTheme(newThemeId)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ThemeController.prototype._applyTrustedTheme = function (newTheme, newThemeId) {
        var _this = this;
        Object.keys(this._theme).forEach(function (key) { return delete (0, tutanota_utils_1.downcast)(_this._theme)[key]; });
        // Always overwrite light theme so that optional things are not kept when switching
        Object.assign(this._theme, this.getDefaultTheme(), newTheme);
        this._themeId = newThemeId;
        this.themeIdChangedStream(newThemeId);
        mithril_1["default"].redraw();
    };
    /**
     * Apply the custom theme, if permanent === true, then the new theme will be saved
     */
    ThemeController.prototype.updateCustomTheme = function (customizations, permanent) {
        if (permanent === void 0) { permanent = true; }
        return __awaiter(this, void 0, void 0, function () {
            var updatedTheme, filledWithoutLogo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        updatedTheme = this.assembleTheme(customizations);
                        filledWithoutLogo = Object.assign({}, updatedTheme, {
                            logo: ""
                        });
                        this._applyTrustedTheme(filledWithoutLogo, filledWithoutLogo.themeId);
                        return [4 /*yield*/, this._sanitizeTheme(updatedTheme)
                            // Now apply with the logo
                        ];
                    case 1:
                        _a.sent();
                        // Now apply with the logo
                        this._applyTrustedTheme(updatedTheme, filledWithoutLogo.themeId);
                        if (!permanent) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.updateSavedThemeDefinition(updatedTheme)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.themeFacade.setSelectedTheme(updatedTheme.themeId)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ThemeController.prototype._sanitizeTheme = function (theme) {
        return __awaiter(this, void 0, void 0, function () {
            var logo, htmlSanitizer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!theme.logo) return [3 /*break*/, 2];
                        logo = theme.logo;
                        return [4 /*yield*/, this.htmlSanitizer()];
                    case 1:
                        htmlSanitizer = _a.sent();
                        theme.logo = htmlSanitizer.sanitizeHTML(logo).html;
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Save theme to the storage.
     */
    ThemeController.prototype.updateSavedThemeDefinition = function (updatedTheme) {
        return __awaiter(this, void 0, void 0, function () {
            var nonNullTheme, oldThemes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        nonNullTheme = Object.assign({}, this.getDefaultTheme(), updatedTheme);
                        return [4 /*yield*/, this._sanitizeTheme(nonNullTheme)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.themeFacade.getThemes()];
                    case 2:
                        oldThemes = _a.sent();
                        (0, tutanota_utils_1.findAndRemove)(oldThemes, function (t) { return t.themeId === updatedTheme.themeId; });
                        oldThemes.push(nonNullTheme);
                        return [4 /*yield*/, this.themeFacade.setThemes(oldThemes)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, nonNullTheme];
                }
            });
        });
    };
    ThemeController.prototype.getDefaultTheme = function () {
        return Object.assign({}, builtinThemes_1.themes[DeviceConfig_1.defaultThemeId]);
    };
    ThemeController.prototype.getBaseTheme = function (baseId) {
        // Make a defensive copy so that original theme definition is not modified.
        return Object.assign({}, builtinThemes_1.themes[baseId]);
    };
    ThemeController.prototype.shouldAllowChangingTheme = function () {
        return window.whitelabelCustomizations == null;
    };
    /**
     * Assembles a new theme object from customizations.
     */
    ThemeController.prototype.assembleTheme = function (customizations) {
        if (!customizations.base) {
            return Object.assign({}, customizations);
        }
        else if (customizations.base && customizations.logo) {
            return Object.assign({}, this.getBaseTheme(customizations.base), customizations);
        }
        else {
            var themeWithoutLogo = Object.assign({}, this.getBaseTheme(customizations.base), customizations);
            var coloredTutanotaLogo = (0, Logo_1.getLogoSvg)(themeWithoutLogo.content_accent, customizations.base === "light" ? builtinThemes_1.logo_text_dark_grey : builtinThemes_1.logo_text_bright_grey);
            return __assign(__assign({}, themeWithoutLogo), { logo: coloredTutanotaLogo });
        }
    };
    ThemeController.prototype.getCustomThemes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = tutanota_utils_1.mapAndFilterNull;
                        return [4 /*yield*/, this.themeFacade.getThemes()];
                    case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent(), function (theme) {
                                return !(theme.themeId in builtinThemes_1.themes) ? theme.themeId : null;
                            }])];
                }
            });
        });
    };
    ThemeController.prototype.removeCustomThemes = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.themeFacade.setThemes([])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.setThemeId(DeviceConfig_1.defaultThemeId, true)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return ThemeController;
}());
exports.ThemeController = ThemeController;
var NativeThemeFacade = /** @class */ (function () {
    function NativeThemeFacade() {
        var _this = this;
        this.themeFacade = new tutanota_utils_1.LazyLoaded(function () { return __awaiter(_this, void 0, void 0, function () {
            var locator;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../api/main/MainLocator"); })];
                    case 1:
                        locator = (_a.sent()).locator;
                        // Theme initialization happens concurrently with locator initialization,
                        // so we have to wait or native may not yet be defined when we first get here.
                        // It would be nice to move all the global theme handling onto the locator as
                        // well so we can have more control over this
                        return [4 /*yield*/, locator.initialized];
                    case 2:
                        // Theme initialization happens concurrently with locator initialization,
                        // so we have to wait or native may not yet be defined when we first get here.
                        // It would be nice to move all the global theme handling onto the locator as
                        // well so we can have more control over this
                        _a.sent();
                        return [2 /*return*/, locator.themeFacade];
                }
            });
        }); });
    }
    NativeThemeFacade.prototype.getSelectedTheme = function () {
        return __awaiter(this, void 0, void 0, function () {
            var dispatcher;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.themeFacade.getAsync()];
                    case 1:
                        dispatcher = _a.sent();
                        return [2 /*return*/, dispatcher.getSelectedTheme()];
                }
            });
        });
    };
    NativeThemeFacade.prototype.setSelectedTheme = function (theme) {
        return __awaiter(this, void 0, void 0, function () {
            var dispatcher;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.themeFacade.getAsync()];
                    case 1:
                        dispatcher = _a.sent();
                        return [2 /*return*/, dispatcher.setSelectedTheme(theme)];
                }
            });
        });
    };
    NativeThemeFacade.prototype.getThemes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var dispatcher;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.themeFacade.getAsync()];
                    case 1:
                        dispatcher = _a.sent();
                        return [4 /*yield*/, dispatcher.getThemes()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    NativeThemeFacade.prototype.setThemes = function (themes) {
        return __awaiter(this, void 0, void 0, function () {
            var dispatcher;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.themeFacade.getAsync()];
                    case 1:
                        dispatcher = _a.sent();
                        return [2 /*return*/, dispatcher.setThemes(themes)];
                }
            });
        });
    };
    return NativeThemeFacade;
}());
exports.NativeThemeFacade = NativeThemeFacade;
var WebThemeFacade = /** @class */ (function () {
    function WebThemeFacade(deviceConfig) {
        this._deviceConfig = deviceConfig;
    }
    WebThemeFacade.prototype.getSelectedTheme = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this._deviceConfig.getTheme()];
            });
        });
    };
    WebThemeFacade.prototype.setSelectedTheme = function (theme) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this._deviceConfig.setTheme(theme)];
            });
        });
    };
    WebThemeFacade.prototype.getThemes = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // no-op
                return [2 /*return*/, []];
            });
        });
    };
    WebThemeFacade.prototype.setThemes = function (themes) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    return WebThemeFacade;
}());
exports.WebThemeFacade = WebThemeFacade;
