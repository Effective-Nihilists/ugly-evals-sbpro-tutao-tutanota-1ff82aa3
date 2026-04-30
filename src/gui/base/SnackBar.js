"use strict";
exports.__esModule = true;
exports.showSnackBar = exports.SNACKBAR_SHOW_TIME = void 0;
var mithril_1 = require("mithril");
var size_1 = require("../size");
var Animations_1 = require("../animation/Animations");
var Overlay_1 = require("./Overlay");
var Button_js_1 = require("./Button.js");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var styles_1 = require("../styles");
var Env_1 = require("../../api/common/Env");
var HtmlUtils_1 = require("../HtmlUtils");
(0, Env_1.assertMainOrNode)();
exports.SNACKBAR_SHOW_TIME = 6000;
var MAX_SNACKBAR_WIDTH = 400;
var notificationQueue = [];
var currentAnimationTimeout = null;
var SnackBar = /** @class */ (function () {
    function SnackBar() {
    }
    SnackBar.prototype.view = function (vnode) {
        // use same padding as MinimizedEditor
        return (0, mithril_1["default"])(".snackbar-content.flex.flex-space-between.border-radius.plr.pb-xs.pt-xs", [
            (0, mithril_1["default"])(".flex.center-vertically.smaller", LanguageViewModel_1.lang.getMaybeLazy(vnode.attrs.message)),
            vnode.attrs.button ? (0, mithril_1["default"])(".flex-end.center-vertically.pl", (0, mithril_1["default"])(Button_js_1.Button, vnode.attrs.button)) : null,
        ]);
    };
    return SnackBar;
}());
function makeButtonAttrsForSnackBar(button) {
    return {
        label: button.label,
        click: button.click,
        type: "secondary" /* ButtonType.Secondary */
    };
}
/**
 * Shows a SnackBar overlay at the bottom for low priority notifications that do not require (but might allow) user interaction and disappear after 6 seconds.
 * @param message The message to be shown. It must be short enough to ensure it is always shown in 2 lines of text at max in any language.
 * @param snackBarButton will close the snackbar if it is clicked (onClose() will be called)
 * @param onClose called when the snackbar is closed (either by timeout or button click)
 */
function showSnackBar(args) {
    var _a;
    var button = makeButtonAttrsForSnackBar(args.button);
    notificationQueue.push({
        message: args.message,
        button: button,
        onClose: (_a = args.onClose) !== null && _a !== void 0 ? _a : null
    });
    if (notificationQueue.length > 1) {
        //Next notification will be shown when closing current notification
        return;
    }
    showNextNotification();
}
exports.showSnackBar = showSnackBar;
function getSnackBarPosition() {
    // The snackbar will be moved up from off the bottom of the viewport by the transformation animation.
    var snackBarMarginLR = styles_1.styles.isUsingBottomNavigation() ? size_1.size.hpad : size_1.size.hpad_medium;
    var leftOffset = styles_1.styles.isDesktopLayout() ? size_1.size.drawer_menu_width : 0;
    var snackBarWidth = Math.min(window.innerWidth - leftOffset - 2 * snackBarMarginLR, MAX_SNACKBAR_WIDTH);
    return {
        top: "100%",
        // The SnackBar is only shown at the right in single column layout
        left: styles_1.styles.isSingleColumnLayout() ? (0, size_1.px)(window.innerWidth - snackBarMarginLR - snackBarWidth) : (0, size_1.px)(leftOffset + snackBarMarginLR),
        width: (0, size_1.px)(snackBarWidth),
        zIndex: 400 /* LayerType.Overlay */
    };
}
function showNextNotification() {
    var _a = notificationQueue[0], message = _a.message, button = _a.button, onClose = _a.onClose; //we shift later because it is still shown
    currentAnimationTimeout = null;
    var bottomInset = (0, HtmlUtils_1.getSafeAreaInsetBottom)();
    var bottomOffset = styles_1.styles.isUsingBottomNavigation()
        ? size_1.size.bottom_nav_bar + size_1.size.hpad + bottomInset
        : size_1.size.hpad_medium;
    var closeFunction = (0, Overlay_1.displayOverlay)(function () { return getSnackBarPosition(); }, {
        view: function () {
            return (0, mithril_1["default"])(SnackBar, {
                message: message,
                button: button
            });
        }
    }, 
    // it is initially below the container and we move it into it with transform
    function (dom) { return (0, Animations_1.transform)("translateY" /* TransformEnum.TranslateY */, 0, -(bottomOffset + dom.offsetHeight)); }, 
    // it is initially inside the container, we transform it out of it
    function (dom) { return (0, Animations_1.transform)("translateY" /* TransformEnum.TranslateY */, -(bottomOffset + dom.offsetHeight), 0); }, "minimized-shadow");
    var closeAndOpenNext = function () {
        if (currentAnimationTimeout !== null) {
            return;
        }
        closeFunction();
        if (onClose) {
            onClose();
        }
        notificationQueue.shift();
        if (notificationQueue.length > 0) {
            currentAnimationTimeout = setTimeout(showNextNotification, 2 * Animations_1.DefaultAnimationTime);
        }
    };
    // close the notification by default when pressing the button
    if (button) {
        var originClickHandler_1 = button.click;
        button.click = function (e, dom) {
            clearTimeout(autoRemoveTimer);
            originClickHandler_1 === null || originClickHandler_1 === void 0 ? void 0 : originClickHandler_1(e, dom);
            closeAndOpenNext();
        };
    }
    var autoRemoveTimer = setTimeout(closeAndOpenNext, exports.SNACKBAR_SHOW_TIME);
    mithril_1["default"].redraw();
}
