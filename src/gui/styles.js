"use strict";
exports.__esModule = true;
exports.styles = void 0;
var Log_1 = require("../misc/Log");
var size_1 = require("./size");
var Env_1 = require("../api/common/Env");
var WindowFacade_1 = require("../misc/WindowFacade");
var theme_1 = require("./theme");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var ClientDetector_1 = require("../misc/ClientDetector");
(0, Env_1.assertMainOrNodeBoot)();
/**
 * Writes all styles to a single dom <style>-tag
 */
var Styles = /** @class */ (function () {
    function Styles() {
        var _this = this;
        this.styleSheets = new Map();
        this.initialized = false;
        this.styles = new Map();
        this.bodyWidth = (0, tutanota_utils_1.neverNull)(document.body).offsetWidth;
        this.bodyHeight = (0, tutanota_utils_1.neverNull)(document.body).offsetHeight;
        WindowFacade_1.windowFacade.addResizeListener(function (width, height) {
            _this.bodyWidth = width;
            _this.bodyHeight = height;
        });
        theme_1.themeController.themeIdChangedStream.map(function () {
            _this.updateDomStyles();
        });
    }
    Styles.prototype.init = function () {
        if (this.initialized)
            return;
        this.initialized = true;
        this.updateDomStyles();
    };
    Styles.prototype.getStyleSheetElement = function (id) {
        return (0, tutanota_utils_1.assertNotNull)(this.styleSheets.get(id)).cloneNode(true);
    };
    Styles.prototype.isDesktopLayout = function () {
        return this.bodyWidth >= size_1.size.desktop_layout_width;
    };
    Styles.prototype.isSingleColumnLayout = function () {
        return this.bodyWidth < size_1.size.two_column_layout_width;
    };
    Styles.prototype.isUsingBottomNavigation = function () {
        return !(0, Env_1.isAdminClient)() && (ClientDetector_1.client.isMobileDevice() || !this.isDesktopLayout());
    };
    Styles.prototype.registerStyle = function (id, styleCreator) {
        if (!this.initialized && this.styles.has(id)) {
            throw new Error("duplicate style definition: " + id);
        }
        this.styles.set(id, styleCreator);
        if (this.initialized) {
            (0, Log_1.log)(Log_1.Cat.css, "update style", id, styleCreator(theme_1.theme));
            this.updateDomStyle(id, styleCreator);
        }
    };
    Styles.prototype.updateStyle = function (id) {
        if (!this.initialized || !this.styles.has(id)) {
            throw new Error("cannot update nonexistent style " + id);
        }
        var creator = (0, tutanota_utils_1.neverNull)(this.styles.get(id));
        (0, Log_1.log)(Log_1.Cat.css, "update style", id, creator(theme_1.theme));
        this.updateDomStyle(id, creator);
    };
    Styles.prototype.updateDomStyles = function () {
        var _this = this;
        // This is hacking but we currently import gui stuff from a lot of tested things
        if ((0, Env_1.isTest)()) {
            return;
        }
        var time = (0, Log_1.timer)(Log_1.Cat.css);
        Array.from(this.styles.entries()).map(function (entry) {
            _this.updateDomStyle(entry[0], entry[1]);
        });
        (0, Log_1.log)(Log_1.Cat.css, "creation time", time());
    };
    Styles.prototype.updateDomStyle = function (id, styleCreator) {
        var styleSheet = this.getDomStyleSheet("css-".concat(id));
        styleSheet.textContent = toCss(styleCreator());
        this.styleSheets.set(id, styleSheet);
    };
    Styles.prototype.getDomStyleSheet = function (id) {
        var styleDomElement = document.getElementById(id);
        if (!styleDomElement) {
            styleDomElement = document.createElement("style");
            styleDomElement.setAttribute("type", "text/css");
            styleDomElement.id = id;
            styleDomElement = document.getElementsByTagName("head")[0].appendChild(styleDomElement);
        }
        return styleDomElement;
    };
    return Styles;
}());
function objectToCss(indent, key, o) {
    var cssString = "".concat(indent).concat(key, " { \n");
    cssString += indent + toCss(o, indent + "  ");
    cssString += " \n".concat(indent, "} \n");
    return cssString;
}
function toCss(obj, indent) {
    if (indent === void 0) { indent = ""; }
    var ret = Object.keys(obj)
        .map(function (key) {
        if (obj[key] instanceof Array) {
            return obj[key]
                .map(function (o) {
                return objectToCss(indent, key, o);
            })
                .join("\n");
        }
        else if (obj[key] instanceof Object) {
            return objectToCss(indent, key, obj[key]);
        }
        else {
            return "".concat(indent).concat(key, ": ").concat(obj[key], ";");
        }
    })
        .join("\n");
    return ret;
}
exports.styles = new Styles();
