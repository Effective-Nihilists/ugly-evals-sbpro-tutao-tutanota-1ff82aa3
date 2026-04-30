"use strict";
exports.__esModule = true;
exports.landmarkAttrs = exports.liveDataAttrs = exports.dialogAttrs = void 0;
var Env_1 = require("../api/common/Env");
(0, Env_1.assertMainOrNodeBoot)();
function dialogAttrs(labeledBy, describedBy) {
    return "[role=\"".concat("dialog" /* AriaWindow.Dialog */, "\"][aria-modal=true][aria-labelledby=\"").concat(labeledBy, "\"][aria-describedby=\"").concat(describedBy, "\"]");
}
exports.dialogAttrs = dialogAttrs;
function liveDataAttrs() {
    return "[aria-live=\"".concat("polite" /* AriaLiveData.Polite */, "\"][aria-atomic=true]");
}
exports.liveDataAttrs = liveDataAttrs;
function landmarkAttrs(role, label) {
    // We disable outline for landmarks. Outlines are useful as a visual clue for users who use keyboard navigation (or similar). Landmarks
    // are screen reader function and can only be focused using special landmark menu, they are not in the tab index. This makes them
    // redundant.
    // As they are big elements which receive focus automatically we would like to avoid showing them when we don't have to.
    return ".hide-outline[role=\"".concat(role, "\"][tabindex=\"").concat("-1" /* TabIndex.Programmatic */, "\"]") + (label ? "[aria-label=\"".concat(label, "\"]") : "");
}
exports.landmarkAttrs = landmarkAttrs;
