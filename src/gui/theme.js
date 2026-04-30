"use strict";
exports.__esModule = true;
exports.getColouredTutanotaLogo = exports.getNavigationMenuIcon = exports.getNavigationMenuBg = exports.getElevatedBackground = exports.getNavButtonIconBackground = exports.getContentButtonIconBackground = exports.theme = exports.themeController = void 0;
var DeviceConfig_1 = require("../misc/DeviceConfig");
var Env_1 = require("../api/common/Env");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var ThemeController_1 = require("./ThemeController");
var Color_1 = require("./base/Color");
var builtinThemes_1 = require("./builtinThemes");
var Logo_1 = require("./base/Logo");
(0, Env_1.assertMainOrNodeBoot)();
var selectedThemeFacade = (0, Env_1.isApp)() || (0, Env_1.isDesktop)() ? new ThemeController_1.NativeThemeFacade() : new ThemeController_1.WebThemeFacade(DeviceConfig_1.deviceConfig);
// We need it because we want to run tests in node and real HTMLSanitizer does not work there.
var sanitizerStub = {
    sanitizeHTML: function () {
        return {
            html: "", externalContent: [],
            inlineImageCids: [],
            links: []
        };
    },
    sanitizeSVG: function (svg, configExtra) {
        throw new Error("stub!");
    },
    sanitizeFragment: function (html, configExtra) {
        throw new Error("stub!");
    }
};
exports.themeController = new ThemeController_1.ThemeController(selectedThemeFacade, (0, Env_1.isTest)() ? function () { return Promise.resolve((0, tutanota_utils_1.downcast)(sanitizerStub)); } : function () { return Promise.resolve().then(function () { return require("../misc/HtmlSanitizer"); }).then(function (_a) {
    var htmlSanitizer = _a.htmlSanitizer;
    return htmlSanitizer;
}); });
// ThemeManager.updateTheme updates the object in place, so this will always be current
// We keep this singleton available because it is convenient to refer to, and already everywhere in the code before the addition of ThemeManager
exports.theme = exports.themeController._theme;
function getContentButtonIconBackground() {
    return exports.theme.content_button_icon_bg || exports.theme.content_button; // fallback for the new color content_button_icon_bg
}
exports.getContentButtonIconBackground = getContentButtonIconBackground;
function getNavButtonIconBackground() {
    return exports.theme.navigation_button_icon_bg || exports.theme.navigation_button; // fallback for the new color content_button_icon_bg
}
exports.getNavButtonIconBackground = getNavButtonIconBackground;
function getElevatedBackground() {
    return exports.theme.elevated_bg || exports.theme.content_bg;
}
exports.getElevatedBackground = getElevatedBackground;
function getNavigationMenuBg() {
    return exports.theme.navigation_menu_bg || exports.theme.navigation_bg;
}
exports.getNavigationMenuBg = getNavigationMenuBg;
function getNavigationMenuIcon() {
    return exports.theme.navigation_menu_icon || exports.theme.navigation_button_icon;
}
exports.getNavigationMenuIcon = getNavigationMenuIcon;
function getColouredTutanotaLogo() {
    return (0, Logo_1.getLogoSvg)(exports.theme.content_accent, (0, Color_1.isColorLight)(exports.theme.content_bg) ? builtinThemes_1.logo_text_dark_grey : builtinThemes_1.logo_text_bright_grey);
}
exports.getColouredTutanotaLogo = getColouredTutanotaLogo;
