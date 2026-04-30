"use strict";
exports.__esModule = true;
exports.showSupportDialog = void 0;
var Dialog_1 = require("../gui/base/Dialog");
var Button_js_1 = require("../gui/base/Button.js");
var LanguageViewModel_1 = require("../misc/LanguageViewModel");
var TextField_js_1 = require("../gui/base/TextField.js");
var mithril_1 = require("mithril");
var stream_1 = require("mithril/stream");
var FaqModel_1 = require("./FaqModel");
var TutanotaConstants_1 = require("../api/common/TutanotaConstants");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var MailEditor_1 = require("../mail/editor/MailEditor");
var Env_1 = require("../api/common/Env");
(0, Env_1.assertMainOrNode)();
function showSupportDialog() {
    var searchValue = (0, stream_1["default"])("");
    var searchResult = (0, stream_1["default"])([]);
    var searchExecuted = false;
    var closeButton = {
        label: "close_alt",
        type: "secondary" /* ButtonType.Secondary */,
        click: function () {
            closeAction();
        }
    };
    var closeAction = function () {
        searchValue("");
        searchResult([]);
        dialog.close();
    };
    var debounceSearch = (0, tutanota_utils_1.debounce)(200, function (value) {
        searchResult(FaqModel_1.faq.search(value));
        searchExecuted = value.trim() !== "";
        mithril_1["default"].redraw();
    });
    searchValue.map(function (newValue) {
        debounceSearch(newValue);
    });
    var contactSupport = {
        label: "contactSupport_action",
        type: "login" /* ButtonType.Login */,
        click: function () {
            (0, MailEditor_1.writeSupportMail)(searchValue().trim());
            closeAction();
        }
    };
    var header = {
        left: [closeButton],
        middle: function () { return LanguageViewModel_1.lang.get("supportMenu_label"); }
    };
    var child = {
        view: function () {
            return [
                (0, mithril_1["default"])(".pt"),
                (0, mithril_1["default"])(".h1 .text-center", LanguageViewModel_1.lang.get("howCanWeHelp_title")),
                (0, mithril_1["default"])(TextField_js_1.TextField, {
                    label: function () { return LanguageViewModel_1.lang.get("describeProblem_msg"); },
                    value: searchValue(),
                    oninput: searchValue
                }),
                (0, mithril_1["default"])(".pt", searchResult().map(function (value) {
                    return (0, mithril_1["default"])(".pb.faq-items", [
                        // we can trust the faq entry here because it is sanitized in update-translations.js from the website project
                        // trust is required because the search results are marked with <mark> tag and the faq entries contain html elements.
                        (0, mithril_1["default"])(".b", mithril_1["default"].trust(value.title)),
                        (0, mithril_1["default"])(".flex-start.flex-wrap", value.tags
                            .split(",")
                            .filter(function (tag) { return tag !== ""; })
                            .map(function (tag) { return (0, mithril_1["default"])(".keyword-bubble.plr-button", mithril_1["default"].trust(tag.trim())); })),
                        (0, mithril_1["default"])(".list-border-bottom.pb", mithril_1["default"].trust(value.text)),
                    ]);
                })),
                searchExecuted
                    ? (0, mithril_1["default"])(".pb", [
                        (0, mithril_1["default"])(".h1 .text-center", LanguageViewModel_1.lang.get("noSolution_msg")),
                        (0, mithril_1["default"])(".flex.center-horizontally.pt", (0, mithril_1["default"])(".flex-grow-shrink-auto.max-width-200", (0, mithril_1["default"])(Button_js_1.Button, contactSupport))),
                    ])
                    : null,
            ];
        }
    };
    FaqModel_1.faq.init().then(function () {
        FaqModel_1.faq.getList();
    });
    var dialog = Dialog_1.Dialog.largeDialog(header, child).addShortcut({
        key: TutanotaConstants_1.Keys.ESC,
        exec: function () {
            closeAction();
        },
        help: "close_alt"
    });
    dialog.show();
}
exports.showSupportDialog = showSupportDialog;
