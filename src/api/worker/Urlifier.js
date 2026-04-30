"use strict";
exports.__esModule = true;
exports.urlify = void 0;
var html_1 = require("linkifyjs/html");
/**
 * Replaces plain text links in the given text by html links. Already existing html links are not changed.
 * @param html The text to be checked for links.
 * @returns {string} The text with html links.
 */
function urlify(html) {
    return (0, html_1["default"])(html, {
        attributes: {
            rel: "noopener noreferrer"
        },
        target: "_blank"
    });
}
exports.urlify = urlify;
