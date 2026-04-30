"use strict";
exports.__esModule = true;
exports.RecipientButton = void 0;
var mithril_1 = require("mithril");
var RecipientButton = /** @class */ (function () {
    function RecipientButton() {
    }
    RecipientButton.prototype.view = function (_a) {
        var attrs = _a.attrs;
        return (0, mithril_1["default"])("button.mr-button.secondary.print.small", {
            style: Object.assign({
                "white-space": "normal",
                "word-break": "break-all"
            }, attrs.style),
            onclick: function (e) { return attrs.click(e, e.target); }
        }, [attrs.label]);
    };
    return RecipientButton;
}());
exports.RecipientButton = RecipientButton;
