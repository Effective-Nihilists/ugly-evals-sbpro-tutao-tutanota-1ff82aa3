"use strict";
exports.__esModule = true;
exports.showShortcutDialog = void 0;
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var mithril_1 = require("mithril");
var Dialog_1 = require("../base/Dialog");
var TutanotaConstants_1 = require("../../api/common/TutanotaConstants");
var TextField_js_1 = require("../base/TextField.js");
function makeShortcutName(shortcut) {
    return ((shortcut.meta ? TutanotaConstants_1.Keys.META.name + " + " : "") +
        (shortcut.ctrl ? TutanotaConstants_1.Keys.CTRL.name + " + " : "") +
        (shortcut.shift ? TutanotaConstants_1.Keys.SHIFT.name + " + " : "") +
        (shortcut.alt ? TutanotaConstants_1.Keys.ALT.name + " + " : "") +
        shortcut.key.name);
}
/**
 * return a promise that resolves when the dialog is closed
 */
function showShortcutDialog(shortcuts) {
    return new Promise(function (resolve) {
        var dialog;
        var close = function () {
            dialog.close();
            resolve();
        };
        var headerAttrs = {
            left: [
                {
                    label: "close_alt",
                    click: close,
                    type: "secondary" /* ButtonType.Secondary */
                },
            ],
            middle: function () { return LanguageViewModel_1.lang.get("keyboardShortcuts_title"); }
        };
        dialog = Dialog_1.Dialog.largeDialogN(headerAttrs, ShortcutDialog, {
            shortcuts: shortcuts
        })
            .addShortcut({
            key: TutanotaConstants_1.Keys.ESC,
            exec: close,
            help: "close_alt"
        })
            .show();
    });
}
exports.showShortcutDialog = showShortcutDialog;
/**
 * The Dialog that shows the currently active Keyboard shortcuts when you press F1
 *
 *
 */
var ShortcutDialog = /** @class */ (function () {
    function ShortcutDialog() {
    }
    ShortcutDialog.prototype.view = function (vnode) {
        var shortcuts = vnode.attrs.shortcuts;
        var textFieldAttrs = shortcuts
            .filter(function (shortcut) { return shortcut.enabled == null || shortcut.enabled(); })
            .map(function (shortcut) { return ({
            label: function () { return makeShortcutName(shortcut); },
            value: LanguageViewModel_1.lang.get(shortcut.help),
            disabled: true
        }); });
        return (0, mithril_1["default"])("div.pb", textFieldAttrs.map(function (t) { return (0, mithril_1["default"])(TextField_js_1.TextField, t); }));
    };
    return ShortcutDialog;
}());
