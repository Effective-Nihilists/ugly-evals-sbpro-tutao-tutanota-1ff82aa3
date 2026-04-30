"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.createWizardDialog = exports.WizardPagingButton = exports.wizardPageWrapper = exports.emitWizardEvent = void 0;
var mithril_1 = require("mithril");
var Dialog_1 = require("./Dialog");
var Icon_1 = require("./Icon");
var theme_1 = require("../theme");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var TutanotaConstants_1 = require("../../api/common/TutanotaConstants");
var Env_1 = require("../../api/common/Env");
(0, Env_1.assertMainOrNode)();
// A WizardPage dispatches this event to inform the parent WizardDialogN to close the dialog
function emitWizardEvent(dom, eventType) {
    if (dom) {
        var event_1 = new Event(eventType, {
            bubbles: true,
            cancelable: true
        });
        dom.dispatchEvent(event_1);
    }
}
exports.emitWizardEvent = emitWizardEvent;
var WizardDialog = /** @class */ (function () {
    function WizardDialog() {
    }
    WizardDialog.prototype.oncreate = function (vnode) {
        // We listen for events triggered by the child WizardPages to close the dialog or show the next page
        var dom = vnode.dom;
        this._closeWizardDialogListener = function (e) {
            e.stopPropagation();
            vnode.attrs.closeAction();
        };
        this._showNextWizardDialogPageListener = function (e) {
            e.stopPropagation();
            if (vnode.attrs.currentPage) {
                vnode.attrs.currentPage.attrs.nextAction(true).then(function (ready) {
                    if (ready)
                        vnode.attrs.goToNextPageOrCloseWizard();
                });
            }
        };
        dom.addEventListener("closeWizardDialog" /* WizardEventType.CLOSEDIALOG */, this._closeWizardDialogListener);
        dom.addEventListener("showNextWizardDialogPage" /* WizardEventType.SHOWNEXTPAGE */, this._showNextWizardDialogPageListener);
    };
    WizardDialog.prototype.onremove = function (vnode) {
        var dom = vnode.dom;
        if (this._closeWizardDialogListener)
            dom.removeEventListener("closeWizardDialog" /* WizardEventType.CLOSEDIALOG */, this._closeWizardDialogListener);
        if (this._showNextWizardDialogPageListener)
            dom.removeEventListener("showNextWizardDialogPage" /* WizardEventType.SHOWNEXTPAGE */, this._showNextWizardDialogPageListener);
    };
    WizardDialog.prototype.view = function (vnode) {
        var a = vnode.attrs;
        return (0, mithril_1["default"])("#wizardDialogContent.pt", [
            (0, mithril_1["default"])("#wizard-paging.flex-space-around.border-top", {
                style: {
                    height: "22px",
                    marginTop: "22px"
                }
            }, a._getEnabledPages().map(function (p, index) {
                return (0, mithril_1["default"])(WizardPagingButton, {
                    pageIndex: index,
                    getSelectedPageIndex: function () { return a.currentPage ? a._getEnabledPages().indexOf(a.currentPage) : -1; },
                    navigateBackHandler: function (index) { return a._goToPageAction(index); }
                });
            })),
            a.currentPage ? a.currentPage.view() : null,
        ]);
    };
    return WizardDialog;
}());
function wizardPageWrapper(component, attributes) {
    return {
        attrs: attributes,
        view: function () { return (0, mithril_1["default"])(component, attributes); }
    };
}
exports.wizardPageWrapper = wizardPageWrapper;
var WizardDialogAttrs = /** @class */ (function () {
    function WizardDialogAttrs(data, pages, closeAction) {
        var _a;
        this.data = data;
        this.pages = pages;
        this.currentPage = (_a = pages.find(function (p) { return p.attrs.isEnabled(); })) !== null && _a !== void 0 ? _a : null;
        this.closeAction = closeAction
            ? function () { return closeAction(); }
            : function () {
                return Promise.resolve();
            };
    }
    WizardDialogAttrs.prototype.goToPreviousPageOrClose = function () {
        var pageIndex = this.currentPage ? this._getEnabledPages().indexOf(this.currentPage) : -1;
        if (pageIndex > 0) {
            this._goToPageAction(pageIndex - 1);
            mithril_1["default"].redraw();
        }
        else {
            this.closeAction();
        }
    };
    WizardDialogAttrs.prototype.getHeaderBarAttrs = function () {
        var _this = this;
        var backButtonAttrs = {
            label: function () { return (_this.currentPage && _this._getEnabledPages().includes(_this.currentPage) ? LanguageViewModel_1.lang.get("cancel_action") : LanguageViewModel_1.lang.get("back_action")); },
            click: function () { return _this.goToPreviousPageOrClose(); },
            type: "secondary" /* ButtonType.Secondary */
        };
        var skipButtonAttrs = {
            label: "skip_action",
            click: function () { return _this.goToNextPageOrCloseWizard(); },
            type: "secondary" /* ButtonType.Secondary */
        };
        return {
            left: [backButtonAttrs],
            right: function () { return (_this.currentPage && _this.currentPage.attrs.isSkipAvailable()
                && _this._getEnabledPages().indexOf(_this.currentPage) !== _this._getEnabledPages().length - 1)
                ? [skipButtonAttrs]
                : []; },
            middle: function () { return (_this.currentPage ? _this.currentPage.attrs.headerTitle() : ""); }
        };
    };
    WizardDialogAttrs.prototype._getEnabledPages = function () {
        return this.pages.filter(function (p) { return p.attrs.isEnabled(); });
    };
    WizardDialogAttrs.prototype._goToPageAction = function (targetIndex) {
        var pages = this._getEnabledPages();
        this.currentPage = pages[targetIndex];
    };
    WizardDialogAttrs.prototype.goToNextPageOrCloseWizard = function () {
        var pages = this._getEnabledPages();
        var currentIndex = this.currentPage ? pages.indexOf(this.currentPage) : -1;
        var lastIndex = pages.length - 1;
        var finalAction = currentIndex === lastIndex;
        if (finalAction) {
            this.closeAction();
        }
        else {
            this.currentPage = currentIndex < lastIndex ? pages[currentIndex + 1] : pages[lastIndex];
        }
    };
    return WizardDialogAttrs;
}());
//exported for old-style WizardDialog.js
var WizardPagingButton = /** @class */ (function () {
    function WizardPagingButton() {
    }
    WizardPagingButton.prototype.view = function (vnode) {
        var selectedPageIndex = vnode.attrs.getSelectedPageIndex();
        var pageIndex = vnode.attrs.pageIndex;
        var filledBg = (0, theme_1.getContentButtonIconBackground)();
        return (0, mithril_1["default"])(".button-content.flex-center.items-center", {
            style: {
                marginTop: "-22px",
                cursor: pageIndex < selectedPageIndex ? "pointer" : "auto"
            },
            onclick: function () {
                if (pageIndex < selectedPageIndex) {
                    vnode.attrs.navigateBackHandler(pageIndex);
                }
            }
        }, (0, mithril_1["default"])(".button-icon.flex-center.items-center", {
            style: {
                border: selectedPageIndex === pageIndex ? "2px solid ".concat(theme_1.theme.content_accent) : "1px solid ".concat(filledBg),
                color: selectedPageIndex === pageIndex ? theme_1.theme.content_accent : "inherit",
                "background-color": pageIndex < selectedPageIndex ? filledBg : theme_1.theme.content_bg
            }
        }, pageIndex < selectedPageIndex
            ? (0, mithril_1["default"])(Icon_1.Icon, {
                icon: "Checkmark" /* Icons.Checkmark */,
                style: {
                    fill: theme_1.theme.content_button_icon,
                    "background-color": filledBg
                }
            })
            : "" + (pageIndex + 1)));
    };
    return WizardPagingButton;
}());
exports.WizardPagingButton = WizardPagingButton;
// Use to generate a new wizard
function createWizardDialog(data, pages, closeAction) {
    var _this = this;
    // We need the close action of the dialog before we can create the proper attributes
    var headerBarAttrs = {};
    var view = function () { return null; };
    var child = {
        view: function () { return view(); }
    };
    var wizardDialog = Dialog_1.Dialog.largeDialog(headerBarAttrs, child);
    var wizardDialogAttrs = new WizardDialogAttrs(data, pages, closeAction
        ? function () { return Promise.resolve(closeAction()).then(function () { return wizardDialog.close(); }); }
        : function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, wizardDialog.close()];
        }); }); });
    // We replace the dummy values from dialog creation
    var wizardDialogHeaderBarAttrs = wizardDialogAttrs.getHeaderBarAttrs();
    Object.entries(wizardDialogHeaderBarAttrs).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        // @ts-ignore
        headerBarAttrs[key] = value;
    });
    view = function () { return (0, mithril_1["default"])(WizardDialog, wizardDialogAttrs); };
    wizardDialog
        .addShortcut({
        key: TutanotaConstants_1.Keys.ESC,
        exec: function () {
            wizardDialogAttrs.closeAction();
        },
        help: "close_alt"
    })
        .setCloseHandler(function () { return wizardDialogAttrs.goToPreviousPageOrClose(); });
    return {
        dialog: wizardDialog,
        attrs: wizardDialogAttrs
    };
}
exports.createWizardDialog = createWizardDialog;
