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
exports.Dialog = exports.INPUT = void 0;
var mithril_1 = require("mithril");
var Modal_1 = require("./Modal");
var Animations_1 = require("../animation/Animations");
var Easing_1 = require("../animation/Easing");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var KeyManager_1 = require("../../misc/KeyManager");
var theme_1 = require("../theme");
var size_1 = require("../size");
var Icons_1 = require("./icons/Icons");
var WindowFacade_1 = require("../../misc/WindowFacade");
var Button_js_1 = require("./Button.js");
var DialogHeaderBar_1 = require("./DialogHeaderBar");
var TextField_js_1 = require("./TextField.js");
var DropDownSelector_js_1 = require("./DropDownSelector.js");
var TutanotaConstants_1 = require("../../api/common/TutanotaConstants");
var AriaUtils_1 = require("../AriaUtils");
var styles_1 = require("../styles");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var DialogInjectionRight_1 = require("./DialogInjectionRight");
var Env_1 = require("../../api/common/Env");
var Icon_1 = require("./Icon");
var ErrorCheckUtils_js_1 = require("../../api/common/utils/ErrorCheckUtils.js");
(0, Env_1.assertMainOrNode)();
exports.INPUT = "input, textarea, div[contenteditable='true']";
var Dialog = /** @class */ (function () {
    function Dialog(dialogType, childComponent) {
        var _this = this;
        this._domDialog = null;
        this._closeHandler = null;
        this._focusedBeforeShown = null;
        this._injectionRightAttrs = null;
        this.visible = false;
        this._focusOnLoadFunction = function () { return _this._defaultFocusOnLoad(); };
        this._wasFocusOnLoadCalled = false;
        this._shortcuts = [
            {
                key: TutanotaConstants_1.Keys.TAB,
                shift: true,
                exec: function () { return _this._domDialog ? (0, KeyManager_1.focusPrevious)(_this._domDialog) : false; },
                help: "selectPrevious_action"
            },
            {
                key: TutanotaConstants_1.Keys.TAB,
                shift: false,
                exec: function () { return _this._domDialog ? (0, KeyManager_1.focusNext)(_this._domDialog) : false; },
                help: "selectNext_action"
            },
        ];
        this.view = function () {
            var marginPx = (0, size_1.px)(size_1.size.hpad);
            var sidesMargin = styles_1.styles.isSingleColumnLayout() && dialogType === "EditLarge" /* DialogType.EditLarge */ ? "4px" : marginPx;
            return (0, mithril_1["default"])(_this._getDialogWrapperStyle(dialogType), {
                style: {
                    paddingTop: "env(safe-area-inset-top)",
                    paddingLeft: "env(safe-area-inset-left)",
                    paddingRight: "env(safe-area-inset-right)"
                }
            }, // controls vertical alignment
            // we need overflow-hidden (actually resulting in min-height: 0 instead of auto) here because otherwise the content of the dialog may make this wrapper grow bigger outside the window on some browsers, e.g. upgrade reminder on Firefox mobile
            (0, mithril_1["default"])(".flex.justify-center.align-self-stretch.rel.overflow-hidden" + (dialogType === "EditLarge" /* DialogType.EditLarge */ ? ".flex-grow" : ".transition-margin"), {
                // controls horizontal alignment
                style: {
                    marginTop: marginPx,
                    marginLeft: sidesMargin,
                    marginRight: sidesMargin,
                    "margin-bottom": Dialog._keyboardHeight > 0 ? (0, size_1.px)(Dialog._keyboardHeight) : dialogType === "EditLarge" /* DialogType.EditLarge */ ? 0 : marginPx
                }
            }, [
                (0, mithril_1["default"])(_this._getDialogStyle(dialogType) + (0, AriaUtils_1.dialogAttrs)("dialog-title", "dialog-message"), {
                    onclick: function (e) { return e.stopPropagation(); },
                    // do not propagate clicks on the dialog as the Modal expects all propagated clicks to be clicks on the background
                    oncreate: function (vnode) {
                        _this._domDialog = vnode.dom;
                        var animation = null;
                        if (dialogType === "EditLarge" /* DialogType.EditLarge */) {
                            _this._domDialog.style.transform = "translateY(".concat(window.innerHeight, "px)");
                            animation = Animations_1.animations.add(_this._domDialog, (0, Animations_1.transform)("translateY" /* TransformEnum.TranslateY */, window.innerHeight, 0));
                        }
                        else {
                            var bgcolor = (0, theme_1.getElevatedBackground)();
                            var children = Array.from(_this._domDialog.children);
                            for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
                                var child = children_1[_i];
                                child.style.opacity = "0";
                            }
                            _this._domDialog.style.backgroundColor = "rgba(0, 0, 0, 0)";
                            animation = Promise.all([
                                Animations_1.animations.add(_this._domDialog, (0, Animations_1.alpha)("backgroundColor" /* AlphaEnum.BackgroundColor */, bgcolor, 0, 1)),
                                Animations_1.animations.add(children, (0, Animations_1.opacity)(0, 1, true), {
                                    delay: Animations_1.DefaultAnimationTime / 2
                                }),
                            ]);
                        }
                        // select first input field. blur first to avoid that users can enter text in the previously focused element while the animation is running
                        window.requestAnimationFrame(function () {
                            var activeElement = document.activeElement;
                            if (activeElement && typeof activeElement.blur === "function") {
                                activeElement.blur();
                            }
                        });
                        animation.then(function () {
                            _this._focusOnLoadFunction();
                            _this._wasFocusOnLoadCalled = true;
                        });
                    }
                }, (0, mithril_1["default"])(childComponent)),
                _this._injectionRightAttrs ? (0, mithril_1["default"])(DialogInjectionRight_1.DialogInjectionRight, _this._injectionRightAttrs) : null,
            ]));
        };
    }
    Dialog.prototype.setInjectionRight = function (injectionRightAttrs) {
        this._injectionRightAttrs = injectionRightAttrs;
    };
    Dialog.prototype._defaultFocusOnLoad = function () {
        var dom = (0, tutanota_utils_1.assertNotNull)(this._domDialog);
        var inputs = Array.from(dom.querySelectorAll(exports.INPUT));
        if (inputs.length > 0) {
            inputs[0].focus();
        }
        else {
            var button = dom.querySelector("button");
            if (button) {
                button.focus();
            }
        }
    };
    /**
     * By default the focus is set on the first text field after this dialog is fully visible. This behavior can be overwritten by calling this function.
     * If it has already been called, then calls it instantly
     */
    Dialog.prototype.setFocusOnLoadFunction = function (callback) {
        this._focusOnLoadFunction = callback;
        if (this._wasFocusOnLoadCalled) {
            this._focusOnLoadFunction();
        }
    };
    Dialog.prototype._getDialogWrapperStyle = function (dialogType) {
        // change direction of axis to handle resize of dialogs (iOS keyboard open changes size)
        var dialogWrapperStyle = ".fill-absolute.flex.items-stretch.flex-column";
        if (dialogType === "EditLarge" /* DialogType.EditLarge */) {
            dialogWrapperStyle += ".flex-start";
        }
        else {
            dialogWrapperStyle += ".flex-center"; // vertical alignment
        }
        return dialogWrapperStyle;
    };
    Dialog.prototype._getDialogStyle = function (dialogType) {
        var dialogStyle = ".dialog.elevated-bg.flex-grow.border-radius-top";
        if (dialogType === "Progress" /* DialogType.Progress */) {
            dialogStyle += ".dialog-width-s.dialog-progress.border-radius-bottom";
        }
        else if (dialogType === "Alert" /* DialogType.Alert */) {
            dialogStyle += ".dialog-width-alert.pt.border-radius-bottom";
        }
        else if (dialogType === "Reminder" /* DialogType.Reminder */) {
            dialogStyle += ".dialog-width-m.pt.flex.flex-column.border-radius-bottom";
        }
        else if (dialogType === "EditSmall" /* DialogType.EditSmall */) {
            dialogStyle += ".dialog-width-s.flex.flex-column.border-radius-bottom";
        }
        else if (dialogType === "EditMedium" /* DialogType.EditMedium */) {
            dialogStyle += ".dialog-width-m.border-radius-bottom";
        }
        else if (dialogType === "EditLarge" /* DialogType.EditLarge */ || dialogType === "EditLarger" /* DialogType.EditLarger */) {
            dialogStyle += ".dialog-width-l";
        }
        return dialogStyle;
    };
    Dialog.prototype.addShortcut = function (shortcut) {
        this._shortcuts.push(shortcut);
        if (this.visible) {
            KeyManager_1.keyManager.registerModalShortcuts([shortcut]);
        }
        return this;
    };
    /**
     * Sets a close handler to the dialog. If set the handler will be notified when onClose is called on the dialog.
     * The handler must is then responsible for closing the dialog.
     */
    Dialog.prototype.setCloseHandler = function (closeHandler) {
        this._closeHandler = closeHandler;
        return this;
    };
    Dialog.prototype.shortcuts = function () {
        return this._shortcuts;
    };
    Dialog.prototype.show = function () {
        this._focusedBeforeShown = document.activeElement;
        Modal_1.modal.display(this);
        this.visible = true;
        return this;
    };
    /**
     * Removes the dialog from the current view.
     */
    Dialog.prototype.close = function () {
        this.visible = false;
        Modal_1.modal.remove(this);
        this._focusedBeforeShown && this._focusedBeforeShown.focus();
    };
    /**
     * Should be called to close a dialog. Notifies the closeHandler about the close attempt.
     */
    Dialog.prototype.onClose = function () {
        if (this._closeHandler) {
            this._closeHandler();
        }
        else {
            this.close();
        }
    };
    Dialog.prototype.popState = function (e) {
        this.onClose();
        return false;
    };
    /**
     * Is invoked from modal as the two animations (background layer opacity and dropdown) should run in parallel
     * @returns {Promise.<void>}
     */
    Dialog.prototype.hideAnimation = function () {
        var bgcolor = (0, theme_1.getElevatedBackground)();
        if (this._domDialog) {
            return Promise.all([
                Animations_1.animations.add(this._domDialog.children, (0, Animations_1.opacity)(1, 0, true)),
                Animations_1.animations.add(this._domDialog, (0, Animations_1.alpha)("backgroundColor" /* AlphaEnum.BackgroundColor */, bgcolor, 1, 0), {
                    delay: Animations_1.DefaultAnimationTime / 2,
                    easing: Easing_1.ease.linear
                }),
            ]).then(tutanota_utils_1.noOp);
        }
        else {
            return Promise.resolve();
        }
    };
    Dialog.prototype.backgroundClick = function (e) {
    };
    /**
     * show a dialog with only a "ok" button
     *
     * @param messageIdOrMessageFunction {TranslationKey | lazy<string>} the text to display
     * @param infoToAppend {?string | lazy<Children>} some text or UI elements to show below the message
     * @returns {Promise<void>} a promise that resolves after the dialog is fully closed
     */
    Dialog.message = function (messageIdOrMessageFunction, infoToAppend) {
        return new Promise(function (resolve) {
            var dialog;
            var closeAction = function () {
                dialog.close();
                setTimeout(function () { return resolve(); }, Animations_1.DefaultAnimationTime);
            };
            var lines = LanguageViewModel_1.lang.getMaybeLazy(messageIdOrMessageFunction).split("\n");
            if (typeof infoToAppend === "string") {
                lines.push(infoToAppend);
            }
            var buttonAttrs = {
                label: "ok_action",
                click: closeAction,
                type: "primary" /* ButtonType.Primary */
            };
            dialog = new Dialog("Alert" /* DialogType.Alert */, {
                view: function () { return [
                    (0, mithril_1["default"])("#dialog-message.dialog-max-height.dialog-contentButtonsBottom.text-break.text-prewrap.selectable.scroll", [
                        lines.map(function (line) { return (0, mithril_1["default"])(".text-break.selectable", line); }),
                        typeof infoToAppend == "function" ? infoToAppend() : null
                    ]),
                    (0, mithril_1["default"])(".flex-center.dialog-buttons", (0, mithril_1["default"])(Button_js_1.Button, buttonAttrs)),
                ]; }
            })
                .setCloseHandler(closeAction)
                .addShortcut({
                key: TutanotaConstants_1.Keys.RETURN,
                shift: false,
                exec: closeAction,
                help: "close_alt"
            })
                .addShortcut({
                key: TutanotaConstants_1.Keys.ESC,
                shift: false,
                exec: closeAction,
                help: "close_alt"
            })
                .show();
        });
    };
    /**
     * fallback for cases where we can't directly download and open a file
     */
    Dialog.legacyDownload = function (filename, url) {
        return new Promise(function (resolve) {
            var dialog;
            var closeAction = function () {
                dialog.close();
                setTimeout(function () { return resolve(); }, Animations_1.DefaultAnimationTime);
            };
            var closeButtonAttrs = {
                label: "close_alt",
                click: closeAction,
                type: "primary" /* ButtonType.Primary */
            };
            var downloadButtonAttrs = {
                label: "download_action",
                click: function () {
                    var popup = open("", "_blank");
                    if (popup) {
                        popup.location = url;
                    }
                    dialog.close();
                    resolve();
                },
                type: "primary" /* ButtonType.Primary */
            };
            dialog = new Dialog("Alert" /* DialogType.Alert */, {
                view: function () {
                    return (0, mithril_1["default"])("", [
                        (0, mithril_1["default"])(".dialog-contentButtonsBottom.text-break", [(0, mithril_1["default"])(Button_js_1.Button, downloadButtonAttrs), (0, mithril_1["default"])(".pt", LanguageViewModel_1.lang.get("saveDownloadNotPossibleIos_msg"))]),
                        (0, mithril_1["default"])(".flex-center.dialog-buttons", (0, mithril_1["default"])(Button_js_1.Button, closeButtonAttrs)),
                    ]);
                }
            })
                .setCloseHandler(closeAction)
                .show();
        });
    };
    /**
     * Simpler version of {@link Dialog#confirmMultiple} with just two options: no and yes (or another confirmation).
     * @return Promise, which is resolved with user selection - true for confirm, false for cancel.
     */
    Dialog.confirm = function (messageIdOrMessageFunction, confirmId, infoToAppend) {
        if (confirmId === void 0) { confirmId = "ok_action"; }
        return new Promise(function (resolve) {
            var closeAction = function (conf) {
                dialog.close();
                setTimeout(function () { return resolve(conf); }, Animations_1.DefaultAnimationTime);
            };
            var buttonAttrs = [
                {
                    label: "cancel_action",
                    click: function () { return closeAction(false); },
                    type: "secondary" /* ButtonType.Secondary */
                },
                {
                    label: confirmId,
                    click: function () { return closeAction(true); },
                    type: "primary" /* ButtonType.Primary */
                },
            ];
            var dialog = Dialog.confirmMultiple(messageIdOrMessageFunction, buttonAttrs, resolve, infoToAppend);
        });
    };
    /**
     * Show a dialog with multiple selection options below the message.
     * @param messageIdOrMessageFunction which displayed in the body
     * @param buttons which are displayed below
     * @param onclose which is called on shortcut or when dialog is closed any other way (e.g. back navigation). Not called when pressing
     * one of the buttons.
     * @param infoToAppend additional UI elements to show below the message
     */
    Dialog.confirmMultiple = function (messageIdOrMessageFunction, buttons, onclose, infoToAppend) {
        var dialog;
        var closeAction = function (positive) {
            dialog.close();
            setTimeout(function () { return onclose && onclose(positive); }, Animations_1.DefaultAnimationTime);
        };
        // Wrap in a function to ensure that m() is called in every view() update for the infoToAppend
        function getContent() {
            var additionalChild = typeof infoToAppend === "string"
                ? (0, mithril_1["default"])(".dialog-contentButtonsBottom.text-break.selectable", infoToAppend)
                : typeof infoToAppend === "function"
                    ? infoToAppend()
                    : null;
            return [
                LanguageViewModel_1.lang.getMaybeLazy(messageIdOrMessageFunction),
                additionalChild
            ];
        }
        dialog = new Dialog("Alert" /* DialogType.Alert */, {
            view: function () { return [
                (0, mithril_1["default"])("#dialog-message.dialog-max-height.dialog-contentButtonsBottom.text-break.text-prewrap.selectable.scroll", getContent()),
                (0, mithril_1["default"])(".flex-center.dialog-buttons", buttons.map(function (a) { return (0, mithril_1["default"])(Button_js_1.Button, a); })),
            ]; }
        })
            .setCloseHandler(function () { return closeAction(false); })
            .addShortcut({
            key: TutanotaConstants_1.Keys.ESC,
            shift: false,
            exec: function () { return closeAction(false); },
            help: "cancel_action"
        });
        dialog.show();
        return dialog;
    };
    Dialog.choice = function (message, choices) {
        return new Promise(function (resolve) {
            var choose = function (choice) {
                dialog.close();
                setTimeout(function () { return resolve(choice); }, Animations_1.DefaultAnimationTime);
            };
            var buttonAttrs = choices.map(function (choice) {
                return {
                    label: choice.text,
                    click: function () { return choose(choice.value); },
                    type: "secondary" /* ButtonType.Secondary */
                };
            });
            var dialog = Dialog.confirmMultiple(message, buttonAttrs);
        });
    };
    // used in admin client
    Dialog.save = function (title, saveAction, child) {
        return new Promise(function (resolve) {
            var saveDialog;
            var closeAction = function () {
                saveDialog.close();
                setTimeout(function () { return resolve(); }, Animations_1.DefaultAnimationTime);
            };
            var onOk = function () {
                saveAction().then(function () {
                    saveDialog.close();
                    setTimeout(function () { return resolve(); }, Animations_1.DefaultAnimationTime);
                });
            };
            var actionBarAttrs = {
                left: [
                    {
                        label: "close_alt",
                        click: closeAction,
                        type: "secondary" /* ButtonType.Secondary */
                    },
                ],
                right: [
                    {
                        label: "save_action",
                        click: onOk,
                        type: "primary" /* ButtonType.Primary */
                    },
                ],
                middle: title
            };
            saveDialog = new Dialog("EditMedium" /* DialogType.EditMedium */, {
                view: function () { return (0, mithril_1["default"])("", [(0, mithril_1["default"])(".dialog-header.plr-l", (0, mithril_1["default"])(DialogHeaderBar_1.DialogHeaderBar, actionBarAttrs)), (0, mithril_1["default"])(".plr-l.pb.text-break", (0, mithril_1["default"])(child))]); }
            })
                .setCloseHandler(closeAction)
                .show();
        });
    };
    Dialog.reminder = function (title, message, link) {
        return new Promise(function (resolve) {
            var dialog;
            var closeAction = function (res) {
                dialog.close();
                setTimeout(function () { return resolve(res); }, Animations_1.DefaultAnimationTime);
            };
            var buttonAttrs = [
                {
                    label: "upgradeReminderCancel_action",
                    click: function () { return closeAction(false); },
                    type: "secondary" /* ButtonType.Secondary */
                },
                {
                    label: "showMoreUpgrade_action",
                    click: function () { return closeAction(true); },
                    type: "primary" /* ButtonType.Primary */
                },
            ];
            dialog = new Dialog("Reminder" /* DialogType.Reminder */, {
                view: function () { return [
                    (0, mithril_1["default"])(".dialog-contentButtonsBottom.text-break.scroll", [
                        (0, mithril_1["default"])(".h2.pb", title),
                        (0, mithril_1["default"])(".flex-direction-change.items-center", [
                            (0, mithril_1["default"])("#dialog-message.pb", message),
                            (0, mithril_1["default"])("img[src=" + Icons_1.HabReminderImage + "].dialog-img.mb.bg-white.border-radius", {
                                style: {
                                    "min-width": "150px"
                                }
                            }),
                        ]),
                        (0, mithril_1["default"])("a[href=" + link + "][target=_blank]", link),
                    ]),
                    (0, mithril_1["default"])(".flex-center.dialog-buttons.flex-no-grow-no-shrink-auto", buttonAttrs.map(function (a) { return (0, mithril_1["default"])(Button_js_1.Button, a); })),
                ]; }
            })
                .setCloseHandler(function () { return closeAction(false); })
                .addShortcut({
                key: TutanotaConstants_1.Keys.ESC,
                shift: false,
                exec: function () { return closeAction(false); },
                help: "cancel_action"
            })
                .show();
        });
    };
    /**
     * Shows a dialog with a text field input and ok/cancel buttons.
     * @param   props.child either a component (object with view function that returns a Children) or a naked view Function
     * @param   props.validator Called when "Ok" is clicked. Must return null if the input is valid or an error messageID if it is invalid, so an error message is shown.
     * @param   props.okAction called after successful validation.
     * @param   props.cancelAction called when allowCancel is true and the cancel button/shortcut was pressed.
     * @returns the Dialog
     */
    Dialog.showActionDialog = function (props) {
        var dialog = this.createActionDialog(props);
        return dialog.show();
    };
    Dialog.createActionDialog = function (props) {
        var dialog;
        var _a = Object.assign({}, {
            allowCancel: true,
            allowOkWithReturn: false,
            okActionTextId: "ok_action",
            cancelActionTextId: "cancel_action",
            type: "EditSmall" /* DialogType.EditSmall */
        }, props), title = _a.title, child = _a.child, okAction = _a.okAction, validator = _a.validator, allowCancel = _a.allowCancel, allowOkWithReturn = _a.allowOkWithReturn, okActionTextId = _a.okActionTextId, cancelActionTextId = _a.cancelActionTextId, cancelAction = _a.cancelAction, type = _a.type;
        var doCancel = function () {
            if (cancelAction) {
                cancelAction(dialog);
            }
            dialog.close();
        };
        var doAction = function () {
            if (!okAction) {
                return;
            }
            var validationResult = null;
            if (validator) {
                validationResult = validator();
            }
            var finalizer = Promise.resolve(validationResult).then(function (error_id) {
                if (error_id) {
                    Dialog.message(error_id);
                }
                else {
                    okAction(dialog);
                }
            });
            if (validationResult instanceof Promise) {
                // breaking hard circular dependency
                Promise.resolve().then(function () { return require("../dialogs/ProgressDialog"); }).then(function (module) { return module.showProgressDialog("pleaseWait_msg", finalizer); });
            }
        };
        var actionBarAttrs = {
            left: (0, tutanota_utils_1.mapLazily)(allowCancel, function (allow) {
                return allow
                    ? [
                        {
                            label: cancelActionTextId,
                            click: doCancel,
                            type: "secondary" /* ButtonType.Secondary */
                        },
                    ]
                    : [];
            }),
            right: okAction
                ? [
                    {
                        label: (0, tutanota_utils_1.mapLazily)(okActionTextId, function (id) { return LanguageViewModel_1.lang.get(id); }),
                        click: doAction,
                        type: "primary" /* ButtonType.Primary */
                    },
                ]
                : [],
            middle: typeof title === "function" ? title : function () { return title; }
        };
        dialog = new Dialog(type, {
            view: function () { return [
                (0, mithril_1["default"])(".dialog-header.plr-l", (0, mithril_1["default"])(DialogHeaderBar_1.DialogHeaderBar, actionBarAttrs)),
                (0, mithril_1["default"])(".dialog-max-height.plr-l.pb.text-break.scroll", "function" === typeof child ? child() : (0, mithril_1["default"])(child)),
            ]; }
        }).setCloseHandler(doCancel);
        dialog.addShortcut({
            key: TutanotaConstants_1.Keys.ESC,
            shift: false,
            exec: (0, tutanota_utils_1.mapLazily)(allowCancel, function (allow) { return allow && doCancel(); }),
            help: "cancel_action",
            enabled: (0, tutanota_utils_1.getAsLazy)(allowCancel)
        });
        if (allowOkWithReturn) {
            dialog.addShortcut({
                key: TutanotaConstants_1.Keys.RETURN,
                shift: false,
                exec: doAction,
                help: "ok_action"
            });
        }
        return dialog;
    };
    /**
     * Shows a dialog with a text field input and ok/cancel buttons.
     * @param titleId title of the dialog
     * @param labelIdOrLabelFunction label of the text field
     * @param infoMsgId help label of the text field
     * @param value initial value
     * @param inputValidator Called when "Ok" is clicked receiving the entered text. Must return null if the text is valid or an error messageId if the text is invalid, so an error message is shown.
     * @returns A promise resolving to the entered text. The returned promise is only resolved if "ok" is clicked.
     */
    Dialog.showTextInputDialog = function (titleId, labelIdOrLabelFunction, infoMsgId, value, inputValidator) {
        return new Promise(function (resolve) {
            var result = value;
            Dialog.showActionDialog({
                title: LanguageViewModel_1.lang.getMaybeLazy(titleId),
                child: function () { return (0, mithril_1["default"])(TextField_js_1.TextField, {
                    label: labelIdOrLabelFunction,
                    value: result,
                    oninput: function (newValue) { return result = newValue; },
                    helpLabel: function () { return (infoMsgId ? LanguageViewModel_1.lang.getMaybeLazy(infoMsgId) : ""); }
                }); },
                validator: function () { return (inputValidator ? inputValidator(result) : null); },
                allowOkWithReturn: true,
                okAction: function (dialog) {
                    resolve(result);
                    dialog.close();
                }
            });
        });
    };
    /**
     * Shows a dialog with a text field input and ok/cancel buttons. In contrast to {@link showTextInputDialog} the entered text is not returned but processed in the okayAction.
     * @param titleId title of the dialog
     * @param labelIdOrLabelFunction label of the text field
     * @param infoMsgId help label of the text field
     * @param value initial value
     * @param inputValidator Called when "Ok" is clicked receiving the entered text. Must return null if the text is valid or an error messageId if the text is invalid, so an error message is shown.
     * @param okAction Called when "OK" is clicked, receives the entered text. If the okayAction results in a ConnectionsError the dialog is not closed.
     */
    Dialog.showProcessTextInputDialog = function (titleId, labelIdOrLabelFunction, infoMsgId, value, okAction, inputValidator) {
        var result = value;
        Dialog.showActionDialog({
            title: LanguageViewModel_1.lang.getMaybeLazy(titleId),
            child: function () { return (0, mithril_1["default"])(TextField_js_1.TextField, {
                label: labelIdOrLabelFunction,
                value: result,
                oninput: function (newValue) { return result = newValue; },
                helpLabel: function () { return (infoMsgId ? LanguageViewModel_1.lang.getMaybeLazy(infoMsgId) : ""); }
            }); },
            validator: function () { return (inputValidator ? inputValidator(result) : null); },
            allowOkWithReturn: true,
            okAction: function (dialog) {
                okAction(result).then(function () {
                    dialog.close();
                })["catch"](function (error) {
                    if (!((0, ErrorCheckUtils_js_1.isOfflineError)(error))) {
                        dialog.close();
                    }
                    throw error;
                });
            }
        });
    };
    /**
     * Shows a dialog with a text area input and ok/cancel buttons.
     * @param titleId title of the dialog
     * @param labelIdOrLabelFunction label of the text area
     * @param infoMsgId help label of the text area
     * @param value initial value
     * @returns A promise resolving to the entered text. The returned promise is only resolved if "ok" is clicked.
     */
    Dialog.showTextAreaInputDialog = function (titleId, labelIdOrLabelFunction, infoMsgId, value) {
        return new Promise(function (resolve) {
            var result = value;
            Dialog.showActionDialog({
                title: LanguageViewModel_1.lang.get(titleId),
                child: {
                    view: function () { return (0, mithril_1["default"])(TextField_js_1.TextField, {
                        label: labelIdOrLabelFunction,
                        helpLabel: function () { return (infoMsgId ? LanguageViewModel_1.lang.get(infoMsgId) : ""); },
                        value: result,
                        oninput: function (newValue) { return result = newValue; },
                        type: "area" /* TextFieldType.Area */
                    }); }
                },
                okAction: function (dialog) {
                    resolve(result);
                    dialog.close();
                }
            });
        });
    };
    /**
     * Show a dialog with a dropdown selector
     * @param titleId title of the dialog
     * @param label label of the dropdown selector
     * @param infoMsgId help label of the dropdown selector
     * @param items selection set
     * @param initialValue initial value
     * @param dropdownWidth width of the dropdown
     * @returns A promise resolving to the selected item. The returned promise is only resolved if "ok" is clicked.
     */
    Dialog.showDropDownSelectionDialog = function (titleId, label, infoMsgId, items, initialValue, dropdownWidth) {
        var selectedValue = initialValue;
        return new Promise(function (resolve) {
            Dialog.showActionDialog({
                title: LanguageViewModel_1.lang.get(titleId),
                child: {
                    view: function () {
                        // identity as type assertion
                        return (0, mithril_1["default"])(DropDownSelector_js_1.DropDownSelector, (0, tutanota_utils_1.identity)({
                            label: label,
                            items: items,
                            selectedValue: selectedValue,
                            selectionChangedHandler: function (newValue) { return selectedValue = newValue; }
                        }));
                    }
                },
                okAction: function (dialog) {
                    resolve(selectedValue);
                    dialog.close();
                }
            });
        });
    };
    Dialog.largeDialog = function (headerBarAttrs, child) {
        return new Dialog("EditLarge" /* DialogType.EditLarge */, {
            view: function () {
                return (0, mithril_1["default"])("", [
                    (0, mithril_1["default"])(".dialog-header.plr-l", (0, mithril_1["default"])(DialogHeaderBar_1.DialogHeaderBar, headerBarAttrs)),
                    (0, mithril_1["default"])(".dialog-container.scroll", (0, mithril_1["default"])(".fill-absolute.plr-l", (0, mithril_1["default"])(child))),
                ]);
            }
        });
    };
    Dialog.largeDialogN = function (headerBarAttrs, child, childAttrs) {
        return new Dialog("EditLarge" /* DialogType.EditLarge */, {
            view: function () {
                return (0, mithril_1["default"])("", [
                    headerBarAttrs.noHeader ? null : (0, mithril_1["default"])(".dialog-header.plr-l", (0, mithril_1["default"])(DialogHeaderBar_1.DialogHeaderBar, headerBarAttrs)),
                    (0, mithril_1["default"])(".dialog-container.scroll", (0, mithril_1["default"])(".fill-absolute.plr-l", (0, mithril_1["default"])(child, childAttrs))),
                ]);
            }
        });
    };
    /**
     * Requests a password from the user. Stays open until the caller sets the error message to "".
     * @param props.action will be executed as an attempt to apply new password. Error message is the return value.
     */
    Dialog.showRequestPasswordDialog = function (props) {
        var _this = this;
        var _a;
        var value = "";
        var state = { type: "idle", message: "" };
        var doAction = function () { return __awaiter(_this, void 0, void 0, function () {
            var errorMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        state = { type: "progress" };
                        mithril_1["default"].redraw();
                        return [4 /*yield*/, props.action(value)];
                    case 1:
                        errorMessage = _a.sent();
                        state = { type: "idle", message: errorMessage };
                        mithril_1["default"].redraw();
                        return [2 /*return*/];
                }
            });
        }); };
        var child = {
            view: function () {
                var savedState = state;
                return (savedState.type == "idle")
                    ? (0, mithril_1["default"])(TextField_js_1.TextField, {
                        label: "password_label",
                        helpLabel: function () { return savedState.message; },
                        value: value,
                        oninput: function (newValue) { return value = newValue; },
                        preventAutofill: true,
                        type: "password" /* TextFieldType.Password */,
                        keyHandler: function (key) {
                            if ((0, KeyManager_1.isKeyPressed)(key.keyCode, TutanotaConstants_1.Keys.RETURN)) {
                                doAction();
                                return false;
                            }
                            return true;
                        }
                    })
                    : (0, mithril_1["default"])(Icon_1.Icon, {
                        icon: "Progress" /* BootIcons.Progress */,
                        "class": "icon-xl icon-progress block mt mb",
                        style: {
                            marginLeft: 'auto',
                            marginRight: 'auto'
                        }
                    });
            }
        };
        var dialog = Dialog.showActionDialog({
            title: LanguageViewModel_1.lang.get("password_label"),
            child: child,
            allowOkWithReturn: true,
            okAction: function () { return doAction(); },
            cancelActionTextId: (_a = props.cancel) === null || _a === void 0 ? void 0 : _a.textId,
            allowCancel: props.cancel != null,
            cancelAction: function () {
                var _a, _b;
                (_b = (_a = props === null || props === void 0 ? void 0 : props.cancel) === null || _a === void 0 ? void 0 : _a.action) === null || _b === void 0 ? void 0 : _b.call(_a);
                dialog.close();
            }
        });
        return dialog;
    };
    Dialog._onKeyboardSizeChanged = function (newSize) {
        Dialog._keyboardHeight = newSize;
        mithril_1["default"].redraw();
    };
    Dialog._keyboardHeight = 0;
    return Dialog;
}());
exports.Dialog = Dialog;
WindowFacade_1.windowFacade.addKeyboardSizeListener(Dialog._onKeyboardSizeChanged);
