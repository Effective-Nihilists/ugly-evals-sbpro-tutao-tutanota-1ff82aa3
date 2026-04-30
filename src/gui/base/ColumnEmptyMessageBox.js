"use strict";
exports.__esModule = true;
var mithril_1 = require("mithril");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var Icon_1 = require("./Icon");
var size_1 = require("../size");
var Env_1 = require("../../api/common/Env");
(0, Env_1.assertMainOrNode)();
/**
 * A message box displaying a text. A message box can be displayed on the background of a column if the column is empty.
 */
var ColumnEmptyMessageBox = /** @class */ (function () {
    function ColumnEmptyMessageBox() {
    }
    ColumnEmptyMessageBox.prototype.view = function (_a) {
        var attrs = _a.attrs;
        return (0, mithril_1["default"])(".fill-absolute.flex.col.items-center.justify-center", (0, mithril_1["default"])(".flex.col.items-center.justify-center.mlr", {
            style: {
                "margin-top": (0, size_1.px)(attrs.icon ? -size_1.size.icon_message_box - size_1.size.vpad_xl : -size_1.size.vpad_xl)
            }
        }, [
            attrs.icon
                ? (0, mithril_1["default"])(Icon_1.Icon, {
                    icon: attrs.icon,
                    style: {
                        fill: attrs.color
                    },
                    "class": "icon-message-box"
                })
                : null,
            (0, mithril_1["default"])(".h2.text-center.text-preline", {
                style: {
                    color: attrs.color
                }
            }, getMessage(attrs)),
        ]));
    };
    return ColumnEmptyMessageBox;
}());
exports["default"] = ColumnEmptyMessageBox;
function getMessage(_a) {
    var message = _a.message;
    return typeof message === "function" ? message() : LanguageViewModel_1.lang.get(message);
}
