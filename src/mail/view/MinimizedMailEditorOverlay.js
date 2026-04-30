"use strict";
exports.__esModule = true;
exports.showMinimizedMailEditor = void 0;
var mithril_1 = require("mithril");
var size_1 = require("../../gui/size");
var Overlay_1 = require("../../gui/base/Overlay");
var Animations_1 = require("../../gui/animation/Animations");
var styles_1 = require("../../gui/styles");
var MinimizedEditorOverlay_1 = require("./MinimizedEditorOverlay");
var WindowFacade_1 = require("../../misc/WindowFacade");
var Env_1 = require("../../api/common/Env");
var HtmlUtils_js_1 = require("../../gui/HtmlUtils.js");
(0, Env_1.assertMainOrNode)();
var MINIMIZED_OVERLAY_WIDTH_WIDE = 350;
var MINIMIZED_OVERLAY_WIDTH_SMALL = 220;
var MINIMIZED_EDITOR_HEIGHT = size_1.size.button_height + 2 * size_1.size.vpad_xs;
function showMinimizedMailEditor(dialog, sendMailModel, viewModel, eventController, dispose, saveStatus) {
    var closeOverlayFunction = function () { return Promise.resolve(); }; // will be assigned with the actual close function when overlay is visible.
    var minimizedEditor = viewModel.minimizeMailEditor(dialog, sendMailModel, dispose, saveStatus, function () { return closeOverlayFunction(); });
    // only show overlay once editor is gone
    setTimeout(function () {
        closeOverlayFunction = showMinimizedEditorOverlay(viewModel, minimizedEditor, eventController);
    }, Animations_1.DefaultAnimationTime);
}
exports.showMinimizedMailEditor = showMinimizedMailEditor;
function showMinimizedEditorOverlay(viewModel, minimizedEditor, eventController) {
    var overlayDom = null;
    var resizeListener = function () {
        if (overlayDom) {
            overlayDom.style.transform = "translateY(".concat((0, size_1.px)(-getVerticalOverlayPosition()), ")");
        }
    };
    WindowFacade_1.windowFacade.addResizeListener(resizeListener);
    return (0, Overlay_1.displayOverlay)(function () { return getOverlayPosition(); }, {
        view: function () {
            return (0, mithril_1["default"])(MinimizedEditorOverlay_1.MinimizedEditorOverlay, {
                viewModel: viewModel,
                minimizedEditor: minimizedEditor,
                eventController: eventController
            });
        }
    }, function (dom) {
        overlayDom = dom;
        return (0, Animations_1.transform)("translateY" /* TransformEnum.TranslateY */, 0, -getVerticalOverlayPosition());
    }, function (dom) {
        WindowFacade_1.windowFacade.removeResizeListener(resizeListener);
        return (0, Animations_1.transform)("translateY" /* TransformEnum.TranslateY */, -getVerticalOverlayPosition(), 0);
    }, "minimized-shadow");
}
/** Position of the top edge of the overlay from the bottom of the containing element. */
function getVerticalOverlayPosition() {
    var bottomInset = (0, HtmlUtils_js_1.getSafeAreaInsetBottom)();
    return (MINIMIZED_EDITOR_HEIGHT +
        (styles_1.styles.isUsingBottomNavigation() // use size.hpad values to keep bottom and right space even
            ? size_1.size.bottom_nav_bar + size_1.size.hpad + bottomInset
            : size_1.size.hpad_medium));
}
function getOverlayPosition() {
    return {
        bottom: (0, size_1.px)(-MINIMIZED_EDITOR_HEIGHT),
        // position will change with translateY
        right: styles_1.styles.isUsingBottomNavigation() ? (0, size_1.px)(size_1.size.hpad) : (0, size_1.px)(size_1.size.hpad_medium),
        width: (0, size_1.px)(styles_1.styles.isSingleColumnLayout() ? MINIMIZED_OVERLAY_WIDTH_SMALL : MINIMIZED_OVERLAY_WIDTH_WIDE),
        zIndex: 100 /* LayerType.LowPriorityOverlay */
    };
}
