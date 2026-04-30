"use strict";
exports.__esModule = true;
exports.MessageBox = void 0;
var mithril_1 = require("mithril");
var theme_1 = require("../theme");
var Env_1 = require("../../api/common/Env");
(0, Env_1.assertMainOrNode)();
/**
 * A message box displaying a text. A message box can be displayed on the background of a column if the column is empty.
 */
var MessageBox = /** @class */ (function () {
    function MessageBox() {
    }
    MessageBox.prototype.view = function (_a) {
        var attrs = _a.attrs, children = _a.children;
        return (0, mithril_1["default"])(".justify-center.items-start.dialog-width-s.pt.pb.plr.border-radius", {
            style: Object.assign({
                "white-space": "pre-wrap",
                "text-align": "center",
                border: "2px solid ".concat(theme_1.theme.content_border)
            }, attrs.style)
        }, children);
    };
    return MessageBox;
}());
exports.MessageBox = MessageBox;
