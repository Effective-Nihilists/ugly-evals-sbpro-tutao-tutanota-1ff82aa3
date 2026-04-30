"use strict";
exports.__esModule = true;
exports.CredentialsSelector = void 0;
var mithril_1 = require("mithril");
var Button_js_1 = require("../gui/base/Button.js");
var CredentialsSelector = /** @class */ (function () {
    function CredentialsSelector() {
    }
    CredentialsSelector.prototype.view = function (vnode) {
        var a = vnode.attrs;
        return a.credentials.map(function (c) {
            var buttons = [];
            var onCredentialsDeleted = a.onCredentialsDeleted;
            buttons.push((0, mithril_1["default"])(Button_js_1.Button, {
                label: function () { return c.login; },
                click: function () { return a.onCredentialsSelected(c); },
                type: "login" /* ButtonType.Login */
            }));
            if (onCredentialsDeleted) {
                buttons.push((0, mithril_1["default"])(Button_js_1.Button, {
                    label: "delete_action",
                    click: function () { return onCredentialsDeleted(c); },
                    type: "secondary" /* ButtonType.Secondary */
                }));
            }
            return (0, mithril_1["default"])(".flex-space-between.pt-l.child-grow.last-child-fixed", buttons);
        });
    };
    return CredentialsSelector;
}());
exports.CredentialsSelector = CredentialsSelector;
