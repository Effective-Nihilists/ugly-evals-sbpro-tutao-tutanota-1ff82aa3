"use strict";
exports.__esModule = true;
exports.StatusField = void 0;
var mithril_1 = require("mithril");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var Env_1 = require("../../api/common/Env");
(0, Env_1.assertMainOrNode)();
var StatusField = /** @class */ (function () {
    function StatusField() {
    }
    StatusField.prototype.view = function (vnode) {
        var status = vnode.attrs.status;
        if (!status)
            return null;
        return (0, mithril_1["default"])("", LanguageViewModel_1.lang.get(status.text));
    };
    return StatusField;
}());
exports.StatusField = StatusField;
