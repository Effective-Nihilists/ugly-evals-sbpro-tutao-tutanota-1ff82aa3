"use strict";
exports.__esModule = true;
exports.showEditCalendarDialog = void 0;
var Dialog_1 = require("../../gui/base/Dialog");
var mithril_1 = require("mithril");
var stream_1 = require("mithril/stream");
var TextField_js_1 = require("../../gui/base/TextField.js");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
function showEditCalendarDialog(_a, titleTextId, shared, okAction, okTextId, warningMessage) {
    var name = _a.name, color = _a.color;
    var nameStream = (0, stream_1["default"])(name);
    var colorPickerDom;
    var colorStream = (0, stream_1["default"])("#" + color);
    Dialog_1.Dialog.showActionDialog({
        title: function () { return LanguageViewModel_1.lang.get(titleTextId); },
        allowOkWithReturn: true,
        child: {
            view: function () {
                return (0, mithril_1["default"])(".flex.col", [
                    warningMessage ? warningMessage() : null,
                    (0, mithril_1["default"])(TextField_js_1.TextField, {
                        value: nameStream(),
                        oninput: nameStream,
                        label: "calendarName_label"
                    }),
                    (0, mithril_1["default"])(".small.mt.mb-xs", LanguageViewModel_1.lang.get("color_label")),
                    (0, mithril_1["default"])("input.color-picker", {
                        oncreate: function (_a) {
                            var dom = _a.dom;
                            return (colorPickerDom = (0, tutanota_utils_1.downcast)(dom));
                        },
                        type: "color",
                        value: colorStream(),
                        oninput: function (inputEvent) {
                            var target = inputEvent.target;
                            colorStream(target.value);
                        }
                    }),
                ]);
            }
        },
        okActionTextId: okTextId,
        okAction: function (dialog) {
            okAction(dialog, {
                name: nameStream(),
                color: colorStream().substring(1)
            });
        }
    });
}
exports.showEditCalendarDialog = showEditCalendarDialog;
