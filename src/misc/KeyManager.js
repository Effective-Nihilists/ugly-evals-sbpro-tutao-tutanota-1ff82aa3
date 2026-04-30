"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.keyManager = exports.isKeyPressed = exports.focusNext = exports.focusPrevious = exports.TABBABLE = void 0;
var ClientDetector_1 = require("./ClientDetector");
var TutanotaConstants_1 = require("../api/common/TutanotaConstants");
var Env_1 = require("../api/common/Env");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
(0, Env_1.assertMainOrNodeBoot)();
exports.TABBABLE = "button, input, textarea, div[contenteditable='true']";
function focusPrevious(dom) {
    var tabbable = Array.from(dom.querySelectorAll(exports.TABBABLE)).filter(function (e) { return e.style.display !== "none" && e.tabIndex !== -1; }); // also filter for tabIndex here to restrict tabbing to invisible inputs
    var selected = tabbable.find(function (e) { return document.activeElement === e; });
    if (selected) {
        //work around for squire so tabulator actions are executed properly
        //squire makes a list which can be indented and manages this with tab and shift tab
        var selection = window.getSelection();
        if (selection &&
            selection.focusNode &&
            (selection.focusNode.nodeName === "LI" || (selection.focusNode.parentNode && selection.focusNode.parentNode.nodeName === "LI"))) {
            return true; //dont change selection if selection is in list
        }
        else {
            tabbable[(0, tutanota_utils_1.mod)(tabbable.indexOf(selected) - 1, tabbable.length)].focus();
            return false;
        }
    }
    else if (tabbable.length > 0) {
        tabbable[tabbable.length - 1].focus();
        return false;
    }
    return true;
}
exports.focusPrevious = focusPrevious;
function focusNext(dom) {
    var tabbable = Array.from(dom.querySelectorAll(exports.TABBABLE)).filter(function (e) { return e.style.display !== "none" && e.tabIndex !== -1; }); // also filter for tabIndex here to restrict tabbing to invisible inputs
    var selected = tabbable.find(function (e) { return document.activeElement === e; });
    if (selected) {
        //work around for squire so tabulator actions are executed properly
        //squire makes a list which can be indented and manages this with tab and shift tab
        var selection = window.getSelection();
        if (selection &&
            selection.focusNode &&
            (selection.focusNode.nodeName === "LI" || (selection.focusNode.parentNode && selection.focusNode.parentNode.nodeName === "LI"))) {
            return true; //dont change selection
        }
        else {
            tabbable[(0, tutanota_utils_1.mod)(tabbable.indexOf(selected) + 1, tabbable.length)].focus();
            return false;
        }
    }
    else if (tabbable.length > 0) {
        tabbable[0].focus();
        return false;
    }
    return true;
}
exports.focusNext = focusNext;
function createKeyIdentifier(keycode, ctrl, alt, shift, meta) {
    return keycode + (ctrl ? "C" : "") + (alt ? "A" : "") + (shift ? "S" : "") + (meta ? "M" : "");
}
/**
 * KeyManager offers the API for (un)registration of all keyboard shortcuts and routes
 * key presses to the correct handler.
 *
 * Shortcuts that are registered by a modal always take precedence.
 */
var KeyManager = /** @class */ (function () {
    function KeyManager() {
        var _this = this;
        this._isHelpOpen = false;
        var helpShortcut = {
            key: TutanotaConstants_1.Keys.F1,
            exec: function () { return _this.openF1Help(); },
            help: "showHelp_action"
        };
        var helpId = createKeyIdentifier(helpShortcut.key.code);
        this._keyToShortcut = new Map([[helpId, helpShortcut]]);
        // override for _shortcuts: If a modal is visible, only modal-shortcuts should be active
        this._keyToModalShortcut = new Map([[helpId, helpShortcut]]);
        this._desktopShortcuts = [];
        if (!window.document.addEventListener)
            return;
        window.document.addEventListener("keydown", function (e) { return _this._handleKeydown(e); }, false);
    }
    KeyManager.prototype._handleKeydown = function (e) {
        var keyCode = e.which;
        var keysToShortcuts = this._keyToModalShortcut.size > 1 ? this._keyToModalShortcut : this._keyToShortcut;
        var shortcut = keysToShortcuts.get(createKeyIdentifier(keyCode, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey));
        if (shortcut != null && (shortcut.enabled == null || shortcut.enabled())) {
            if (shortcut.exec({
                keyCode: keyCode,
                key: e.key,
                ctrl: e.ctrlKey,
                // @ts-ignore
                alt: e.altKey,
                shift: e.shiftKey,
                meta: e.metaKey
            }) !== true) {
                e.preventDefault();
            }
        }
    };
    /**
     * open a dialog listing all currently active shortcuts
     * @param forceBaseShortcuts set to true for the special case where the dialog is opened
     * from the support dropdown (which registers its own shortcuts as modal shortcuts)
     */
    KeyManager.prototype.openF1Help = function (forceBaseShortcuts) {
        var _this = this;
        if (forceBaseShortcuts === void 0) { forceBaseShortcuts = false; }
        if (this._isHelpOpen)
            return;
        this._isHelpOpen = true;
        // we decide which shortcuts to show right now.
        //
        // the help dialog will register its own shortcuts which would override the
        // standard shortcuts if we did this later
        //
        // we can't do this in the register/unregister method because the modal
        // unregisters the old dialog shortcuts and then registers the new ones
        // when the top dialog changes, leading to a situation where
        // modalshortcuts is empty.
        var shortcutsToShow = this._keyToModalShortcut.size > 1 && !forceBaseShortcuts
            ? Array.from(this._keyToModalShortcut.values()) // copy values, they will change
            : __spreadArray(__spreadArray([], this._keyToShortcut.values(), true), this._desktopShortcuts, true);
        Promise.resolve().then(function () { return require("../gui/dialogs/ShortcutDialog.js"); }).then(function (_a) {
            var showShortcutDialog = _a.showShortcutDialog;
            return showShortcutDialog(shortcutsToShow);
        }).then(function () { return (_this._isHelpOpen = false); });
    };
    KeyManager.prototype.registerShortcuts = function (shortcuts) {
        var _this = this;
        TutanotaConstants_1.Keys.META.code = ClientDetector_1.client.browser === "Firefox" /* BrowserType.FIREFOX */ ? 224 : 91;
        this._applyOperation(shortcuts, function (id, s) { return _this._keyToShortcut.set(id, s); });
    };
    KeyManager.prototype.unregisterShortcuts = function (shortcuts) {
        var _this = this;
        this._applyOperation(shortcuts, function (id, s) { return _this._keyToShortcut["delete"](id); });
    };
    KeyManager.prototype.registerDesktopShortcuts = function (shortcuts) {
        var _this = this;
        this._applyOperation(shortcuts, function (id, s) { return _this._desktopShortcuts.push(s); });
    };
    KeyManager.prototype.registerModalShortcuts = function (shortcuts) {
        var _this = this;
        this._applyOperation(shortcuts, function (id, s) {
            _this._keyToModalShortcut.set(id, s);
        });
    };
    KeyManager.prototype.unregisterModalShortcuts = function (shortcuts) {
        var _this = this;
        this._applyOperation(shortcuts, function (id, s) {
            _this._keyToModalShortcut["delete"](id);
        });
    };
    /**
     *
     * @param shortcuts list of shortcuts to operate on
     * @param operation operation to execute for every shortcut and its ID
     * @private
     */
    KeyManager.prototype._applyOperation = function (shortcuts, operation) {
        shortcuts.forEach(function (s) { return operation(createKeyIdentifier(s.key.code, s.ctrl, s.alt, s.shift, s.meta), s); });
    };
    return KeyManager;
}());
function isKeyPressed(keyCode) {
    var keys = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        keys[_i - 1] = arguments[_i];
    }
    return keys.some(function (key) { return key.code === keyCode; });
}
exports.isKeyPressed = isKeyPressed;
exports.keyManager = new KeyManager();
