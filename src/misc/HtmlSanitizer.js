"use strict";
exports.__esModule = true;
exports.htmlSanitizer = exports.HtmlSanitizer = exports.PREVENT_EXTERNAL_IMAGE_LOADING_ICON = void 0;
var dompurify_1 = require("dompurify");
var Icons_1 = require("../gui/base/icons/Icons");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
// the svg data string must contain ' instead of " to avoid display errors in Edge
// '#' character is reserved in URL and FF won't display SVG otherwise
exports.PREVENT_EXTERNAL_IMAGE_LOADING_ICON = "data:image/svg+xml;utf8," + Icons_1.ReplacementImage.replace(/"/g, "'").replace(/#/g, "%23");
var EXTERNAL_CONTENT_ATTRS = ["src", "poster", "srcset", "background"]; // background attribute is deprecated but still used in common browsers
var DEFAULT_CONFIG_EXTRA = {
    blockExternalContent: true,
    allowRelativeLinks: false,
    usePlaceholderForInlineImages: true
};
// for target = _blank, controls for audio element, cid for embedded images to allow our own cid attribute
var ADD_ATTR = ["target", "controls", "cid"];
// poster for video element.
var ADD_URI_SAFE_ATTR = ["poster"];
// prevent loading of external fonts,
var FORBID_TAGS = ["style"];
var HTML_CONFIG = {
    ADD_ATTR: ADD_ATTR.slice(),
    ADD_URI_SAFE_ATTR: ADD_URI_SAFE_ATTR.slice(),
    FORBID_TAGS: FORBID_TAGS.slice()
};
var SVG_CONFIG = {
    ADD_ATTR: ADD_ATTR.slice(),
    ADD_URI_SAFE_ATTR: ADD_URI_SAFE_ATTR.slice(),
    FORBID_TAGS: FORBID_TAGS.slice(),
    NAMESPACE: "http://www.w3.org/2000/svg"
};
var FRAGMENT_CONFIG = {
    ADD_ATTR: ADD_ATTR.slice(),
    ADD_URI_SAFE_ATTR: ADD_URI_SAFE_ATTR.slice(),
    FORBID_TAGS: FORBID_TAGS.slice(),
    RETURN_DOM_FRAGMENT: true,
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|tutatemplate):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
};
var HtmlSanitizer = /** @class */ (function () {
    function HtmlSanitizer() {
        if (dompurify_1["default"].isSupported) {
            this.purifier = dompurify_1["default"];
            // Do changes in afterSanitizeAttributes and not afterSanitizeElements so that images are not removed again because of the SVGs.
            this.purifier.addHook("afterSanitizeAttributes", this.afterSanitizeAttributes.bind(this));
        }
    }
    /**
     * Sanitizes the given html. Returns as HTML
     */
    HtmlSanitizer.prototype.sanitizeHTML = function (html, configExtra) {
        var config = this.init(HTML_CONFIG, configExtra !== null && configExtra !== void 0 ? configExtra : {});
        var cleanHtml = this.purifier.sanitize(html, config);
        return {
            html: cleanHtml,
            externalContent: this.externalContent,
            inlineImageCids: this.inlineImageCids,
            links: this.links
        };
    };
    /**
     * Sanitizes the given SVG. Returns as SVG
     */
    HtmlSanitizer.prototype.sanitizeSVG = function (svg, configExtra) {
        var config = this.init(SVG_CONFIG, configExtra !== null && configExtra !== void 0 ? configExtra : {});
        var cleanSvg = this.purifier.sanitize(svg, config);
        return {
            html: cleanSvg,
            externalContent: this.externalContent,
            inlineImageCids: this.inlineImageCids,
            links: this.links
        };
    };
    /**
     * inline images are attachments that are rendered as part of an <img> tag with a blob URL in the
     * mail body when it's displayed
     *
     * svg images can contain malicious code, so we need to sanitize them before we display them.
     * DOMPurify can do that, but can't handle the xml declaration at the start of well-formed svg documents.
     *
     * 1. parse the document as xml
     * 2. strip the declaration
     * 3. sanitize
     * 4. add the declaration back on
     *
     * NOTE: currently, we only allow UTF-8 inline SVG.
     * NOTE: SVG with incompatible encodings will be replaced with an empty file.
     *
     * @param dirtyFile the svg DataFile as received in the mail
     * @returns clean a sanitized svg document as a DataFile
     */
    HtmlSanitizer.prototype.sanitizeInlineAttachment = function (dirtyFile) {
        if (dirtyFile.mimeType === "image/svg+xml") {
            var cleanedData = Uint8Array.from([]);
            try {
                var dirtySVG = (0, tutanota_utils_1.utf8Uint8ArrayToString)(dirtyFile.data);
                var parser = new DOMParser();
                var dirtyTree = parser.parseFromString(dirtySVG, "image/svg+xml");
                var errs = dirtyTree.getElementsByTagName("parsererror");
                if (errs.length === 0) {
                    var svgElement = dirtyTree.getElementsByTagName("svg")[0];
                    if (svgElement != null) {
                        var config = this.init(SVG_CONFIG, {});
                        var cleanText = this.purifier.sanitize(svgElement.outerHTML, config);
                        cleanedData = (0, tutanota_utils_1.stringToUtf8Uint8Array)('<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' + cleanText);
                    }
                }
                else {
                    console.log("svg sanitization failed, possibly due to wrong input encoding.");
                }
            }
            catch (e) {
                console.log("svg sanitization failed");
            }
            dirtyFile.data = cleanedData;
        }
        return dirtyFile;
    };
    /**
     * Sanitizes given HTML. Returns a DocumentFragment instead of an HTML string
     */
    HtmlSanitizer.prototype.sanitizeFragment = function (html, configExtra) {
        var config = this.init(FRAGMENT_CONFIG, configExtra !== null && configExtra !== void 0 ? configExtra : {});
        var cleanFragment = this.purifier.sanitize(html, config);
        return {
            fragment: cleanFragment,
            externalContent: this.externalContent,
            inlineImageCids: this.inlineImageCids,
            links: this.links
        };
    };
    HtmlSanitizer.prototype.init = function (config, configExtra) {
        this.externalContent = [];
        this.inlineImageCids = [];
        this.links = [];
        return Object.assign({}, config, DEFAULT_CONFIG_EXTRA, configExtra);
    };
    HtmlSanitizer.prototype.afterSanitizeAttributes = function (currentNode, data, config) {
        var typedConfig = config;
        // remove custom css classes as we do not allow style definitions. custom css classes can be in conflict to our self defined classes.
        // just allow our own "tutanota_quote" class and MsoListParagraph classes for compatibility with Outlook 2010/2013 emails. see main-styles.js
        var allowedClasses = ["tutanota_quote", "MsoListParagraph", "MsoListParagraphCxSpFirst", "MsoListParagraphCxSpMiddle", "MsoListParagraphCxSpLast"];
        if (currentNode.classList) {
            var cl = currentNode.classList;
            for (var i = cl.length - 1; i >= 0; i--) {
                var item = cl.item(i);
                if (item && allowedClasses.indexOf(item) === -1) {
                    cl.remove(item);
                }
            }
        }
        this.replaceAttributes(currentNode, typedConfig);
        this.processLink(currentNode, typedConfig);
        return currentNode;
    };
    HtmlSanitizer.prototype.replaceAttributes = function (htmlNode, config) {
        if (htmlNode.attributes) {
            this.replaceAttributeValue(htmlNode, config);
        }
        if (htmlNode.style) {
            if (config.blockExternalContent) {
                if (htmlNode.style.backgroundImage) {
                    this.replaceStyleImage(htmlNode, "backgroundImage", false);
                    htmlNode.style.backgroundRepeat = "no-repeat";
                }
                if (htmlNode.style.listStyleImage) {
                    this.replaceStyleImage(htmlNode, "listStyleImage", true);
                }
                if (htmlNode.style.content) {
                    this.replaceStyleImage(htmlNode, "content", true);
                }
                if (htmlNode.style.cursor) {
                    this.removeStyleImage(htmlNode, "cursor");
                }
                if (htmlNode.style.filter) {
                    this.removeStyleImage(htmlNode, "filter");
                }
            }
            // Disallow position because you can do bad things with it and it also messes up layout
            // Do this unconditionally, independent from the external content blocking.
            if (htmlNode.style.position) {
                htmlNode.style.removeProperty("position");
            }
        }
    };
    HtmlSanitizer.prototype.replaceAttributeValue = function (htmlNode, config) {
        var _this = this;
        EXTERNAL_CONTENT_ATTRS.forEach(function (attrName) {
            var attribute = htmlNode.attributes.getNamedItem(attrName);
            if (attribute) {
                if (config.usePlaceholderForInlineImages && attribute.value.startsWith("cid:")) {
                    // replace embedded image with local image until the embedded image is loaded and ready to be shown.
                    var cid = attribute.value.substring(4);
                    _this.inlineImageCids.push(cid);
                    attribute.value = exports.PREVENT_EXTERNAL_IMAGE_LOADING_ICON;
                    htmlNode.setAttribute("cid", cid);
                    htmlNode.classList.add("tutanota-placeholder");
                }
                else if (config.blockExternalContent && attribute.name === "srcset") {
                    _this.externalContent.push(attribute.value);
                    htmlNode.removeAttribute("srcset");
                    htmlNode.setAttribute("src", exports.PREVENT_EXTERNAL_IMAGE_LOADING_ICON);
                    htmlNode.style.maxWidth = "100px";
                }
                else if (config.blockExternalContent && !attribute.value.startsWith("data:") && !attribute.value.startsWith("cid:")) {
                    _this.externalContent.push(attribute.value);
                    attribute.value = exports.PREVENT_EXTERNAL_IMAGE_LOADING_ICON;
                    htmlNode.attributes.setNamedItem(attribute);
                    htmlNode.style.maxWidth = "100px";
                }
            }
        });
    };
    HtmlSanitizer.prototype.removeStyleImage = function (htmlNode, styleAttributeName) {
        var value = htmlNode.style[styleAttributeName];
        if (value.match(/url\(/)) {
            this.externalContent.push(value);
            htmlNode.style.removeProperty(styleAttributeName);
        }
    };
    HtmlSanitizer.prototype.replaceStyleImage = function (htmlNode, styleAttributeName, limitWidth) {
        var value = htmlNode.style[styleAttributeName];
        if (value.match(/^url\(/) && !value.match(/^url\(["']?data:/)) {
            // remove surrounding url definition. url(<link>)
            value = value.replace(/^url\("*/, "");
            value = value.replace(/"*\)$/, "");
            this.externalContent.push(value);
            htmlNode.style[styleAttributeName] = 'url("' + exports.PREVENT_EXTERNAL_IMAGE_LOADING_ICON + '")';
            if (limitWidth) {
                htmlNode.style.maxWidth = "100px";
            }
        }
    };
    HtmlSanitizer.prototype.processLink = function (currentNode, config) {
        // set target="_blank" for all links
        // collect them
        if (currentNode.tagName &&
            (currentNode.tagName.toLowerCase() === "a" || currentNode.tagName.toLowerCase() === "area" || currentNode.tagName.toLowerCase() === "form")) {
            var href = currentNode.getAttribute("href");
            href && this.links.push(currentNode);
            if (config.allowRelativeLinks || !href || isAllowedLink(href)) {
                currentNode.setAttribute("rel", "noopener noreferrer");
                currentNode.setAttribute("target", "_blank");
            }
            else if (href.trim() === "{link}") {
                // notification mail template
                (0, tutanota_utils_1.downcast)(currentNode).href = "{link}";
                currentNode.setAttribute("rel", "noopener noreferrer");
                currentNode.setAttribute("target", "_blank");
            }
            else {
                console.log("Relative/invalid URL", currentNode, href);
                (0, tutanota_utils_1.downcast)(currentNode).href = "javascript:void(0)";
            }
        }
    };
    return HtmlSanitizer;
}());
exports.HtmlSanitizer = HtmlSanitizer;
function isAllowedLink(link) {
    try {
        // We create URL without explicit base (second argument). It is an error for relative links
        return new URL(link).protocol !== "file";
    }
    catch (e) {
        return false;
    }
}
exports.htmlSanitizer = new HtmlSanitizer();
