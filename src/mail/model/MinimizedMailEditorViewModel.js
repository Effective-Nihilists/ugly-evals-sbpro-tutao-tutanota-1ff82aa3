"use strict";
exports.__esModule = true;
exports.MinimizedMailEditorViewModel = void 0;
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var EntityUtils_1 = require("../../api/common/utils/EntityUtils");
/**
 * handles minimized Editors
 */
var MinimizedMailEditorViewModel = /** @class */ (function () {
    function MinimizedMailEditorViewModel() {
        this._minimizedEditors = [];
    }
    MinimizedMailEditorViewModel.prototype.minimizeMailEditor = function (dialog, sendMailModel, dispose, saveStatus, closeOverlayFunction) {
        dialog.close();
        // disallow creation of duplicate minimized mails
        if (!this._minimizedEditors.find(function (editor) { return editor.dialog === dialog; })) {
            this._minimizedEditors.push({
                sendMailModel: sendMailModel,
                dialog: dialog,
                dispose: dispose,
                saveStatus: saveStatus,
                closeOverlayFunction: closeOverlayFunction
            });
        }
        return (0, tutanota_utils_1.lastThrow)(this._minimizedEditors);
    };
    // fully removes and reopens clicked mail
    MinimizedMailEditorViewModel.prototype.reopenMinimizedEditor = function (editor) {
        editor.closeOverlayFunction();
        editor.dialog.show();
        (0, tutanota_utils_1.remove)(this._minimizedEditors, editor);
    };
    // fully removes clicked mail
    MinimizedMailEditorViewModel.prototype.removeMinimizedEditor = function (editor) {
        editor.closeOverlayFunction();
        editor.dispose();
        (0, tutanota_utils_1.remove)(this._minimizedEditors, editor);
    };
    MinimizedMailEditorViewModel.prototype.getMinimizedEditors = function () {
        return this._minimizedEditors;
    };
    MinimizedMailEditorViewModel.prototype.getEditorForDraft = function (mail) {
        var _a;
        return (_a = this.getMinimizedEditors().find(function (e) {
            var draft = e.sendMailModel.getDraft();
            return draft ? (0, EntityUtils_1.isSameId)(draft._id, mail._id) : null;
        })) !== null && _a !== void 0 ? _a : null;
    };
    return MinimizedMailEditorViewModel;
}());
exports.MinimizedMailEditorViewModel = MinimizedMailEditorViewModel;
