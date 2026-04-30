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
exports.mailViewerMoreActions = exports.makeAssignMailsButtons = exports.editDraft = exports.showHeaderDialog = exports.insertInlineImageB64ClickHandler = void 0;
var MailUtils_1 = require("../model/MailUtils");
var TutanotaConstants_1 = require("../../api/common/TutanotaConstants");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var Dialog_1 = require("../../gui/base/Dialog");
var FileController_js_1 = require("../../file/FileController.js");
var mithril_1 = require("mithril");
var Button_js_1 = require("../../gui/base/Button.js");
var Icon_js_1 = require("../../gui/base/Icon.js");
var LoginUtils_js_1 = require("../../misc/LoginUtils.js");
var LoginController_js_1 = require("../../api/main/LoginController.js");
var MainLocator_js_1 = require("../../api/main/MainLocator.js");
var UserError_js_1 = require("../../api/main/UserError.js");
var ErrorHandlerImpl_js_1 = require("../../misc/ErrorHandlerImpl.js");
var ClientDetector_js_1 = require("../../misc/ClientDetector.js");
var ProgressDialog_js_1 = require("../../gui/dialogs/ProgressDialog.js");
var RestError_js_1 = require("../../api/common/error/RestError.js");
var GuiUtils_js_1 = require("../../gui/base/GuiUtils.js");
function insertInlineImageB64ClickHandler(ev, handler) {
    (0, FileController_js_1.showFileChooser)(true, TutanotaConstants_1.ALLOWED_IMAGE_FORMATS).then(function (files) {
        var tooBig = [];
        for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
            var file = files_1[_i];
            if (file.size > TutanotaConstants_1.MAX_BASE64_IMAGE_SIZE) {
                tooBig.push(file);
            }
            else {
                var b64 = (0, tutanota_utils_1.uint8ArrayToBase64)(file.data);
                var dataUrlString = "data:".concat(file.mimeType, ";base64,").concat(b64);
                handler.insertImage(dataUrlString, {
                    style: "max-width: 100%"
                });
            }
        }
        if (tooBig.length > 0) {
            Dialog_1.Dialog.message(function () {
                return LanguageViewModel_1.lang.get("tooBigInlineImages_msg", {
                    "{size}": TutanotaConstants_1.MAX_BASE64_IMAGE_SIZE / 1024
                });
            });
        }
    });
}
exports.insertInlineImageB64ClickHandler = insertInlineImageB64ClickHandler;
function showHeaderDialog(headersPromise) {
    return __awaiter(this, void 0, void 0, function () {
        var state, mailHeadersDialog, closeHeadersAction;
        return __generator(this, function (_a) {
            state = { state: "loading" };
            headersPromise
                .then(function (headers) {
                state = { state: "loaded", headers: headers };
                mithril_1["default"].redraw();
            });
            closeHeadersAction = function () {
                mailHeadersDialog === null || mailHeadersDialog === void 0 ? void 0 : mailHeadersDialog.close();
            };
            mailHeadersDialog = Dialog_1.Dialog
                .largeDialog({
                right: [
                    {
                        label: "ok_action",
                        click: closeHeadersAction,
                        type: "secondary" /* ButtonType.Secondary */
                    },
                ],
                middle: function () { return LanguageViewModel_1.lang.get("mailHeaders_title"); }
            }, {
                view: function () {
                    var _a;
                    return (0, mithril_1["default"])(".white-space-pre.pt.pb.selectable", state.state === "loading"
                        ? (0, mithril_1["default"])(".center", (0, Icon_js_1.progressIcon)())
                        : (_a = state.headers) !== null && _a !== void 0 ? _a : (0, mithril_1["default"])(".center", LanguageViewModel_1.lang.get("noEntries_msg")));
                }
            })
                .addShortcut({
                key: TutanotaConstants_1.Keys.ESC,
                exec: closeHeadersAction,
                help: "close_alt"
            })
                .setCloseHandler(closeHeadersAction)
                .show();
            return [2 /*return*/];
        });
    });
}
exports.showHeaderDialog = showHeaderDialog;
function editDraft(viewModel) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, LoginUtils_js_1.checkApprovalStatus)(LoginController_js_1.logins, false).then(function (sendAllowed) {
                    if (sendAllowed) {
                        // check if to be opened draft has already been minimized, iff that is the case, re-open it
                        var minimizedEditor = MainLocator_js_1.locator.minimizedMailModel.getEditorForDraft(viewModel.mail);
                        if (minimizedEditor) {
                            MainLocator_js_1.locator.minimizedMailModel.reopenMinimizedEditor(minimizedEditor);
                        }
                        else {
                            return Promise.all([viewModel.mailModel.getMailboxDetailsForMail(viewModel.mail), Promise.resolve().then(function () { return require("../editor/MailEditor"); })])
                                .then(function (_a) {
                                var mailboxDetails = _a[0], newMailEditorFromDraft = _a[1].newMailEditorFromDraft;
                                return newMailEditorFromDraft(viewModel.mail, viewModel.getAttachments(), viewModel.getMailBody(), viewModel.isBlockingExternalImages(), viewModel.getLoadedInlineImages(), mailboxDetails);
                            })
                                .then(function (editorDialog) {
                                editorDialog.show();
                            })["catch"]((0, tutanota_utils_1.ofClass)(UserError_js_1.UserError, ErrorHandlerImpl_js_1.showUserError));
                        }
                    }
                })];
        });
    });
}
exports.editDraft = editDraft;
/** Make options for "assign" buttons (for cases for mails with restricted participants). */
function makeAssignMailsButtons(viewModel) {
    return __awaiter(this, void 0, void 0, function () {
        var assignmentGroupInfos;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, viewModel.getAssignmentGroupInfos()];
                case 1:
                    assignmentGroupInfos = _a.sent();
                    return [2 /*return*/, assignmentGroupInfos.map(function (userOrMailGroupInfo) {
                            return {
                                label: function () { return (0, MailUtils_1.getDisplayText)(userOrMailGroupInfo.name, (0, tutanota_utils_1.neverNull)(userOrMailGroupInfo.mailAddress), true); },
                                icon: "Contacts" /* BootIcons.Contacts */,
                                click: function () { return viewModel.assignMail(userOrMailGroupInfo); }
                            };
                        })];
            }
        });
    });
}
exports.makeAssignMailsButtons = makeAssignMailsButtons;
function mailViewerMoreActions(viewModel) {
    var moreButtons = [];
    if (viewModel.isUnread()) {
        moreButtons.push({
            label: "markRead_action",
            click: function () { return viewModel.setUnread(false); },
            icon: "Eye" /* Icons.Eye */
        });
    }
    else {
        moreButtons.push({
            label: "markUnread_action",
            click: function () { return viewModel.setUnread(true); },
            icon: "NoEye" /* Icons.NoEye */
        });
    }
    if (!ClientDetector_js_1.client.isMobileDevice() && viewModel.canExport()) {
        moreButtons.push({
            label: "export_action",
            click: function () { return (0, ProgressDialog_js_1.showProgressDialog)("pleaseWait_msg", viewModel.exportMail()); },
            icon: "Export" /* Icons.Export */
        });
    }
    if (!ClientDetector_js_1.client.isMobileDevice() && typeof window.print === "function" && viewModel.canPrint()) {
        moreButtons.push({
            label: "print_action",
            click: function () { return window.print(); },
            icon: "Print" /* Icons.Print */
        });
    }
    if (viewModel.isListUnsubscribe()) {
        moreButtons.push({
            label: "unsubscribe_action",
            click: function () { return unsubscribe(viewModel); },
            icon: "Cancel" /* Icons.Cancel */
        });
    }
    if (viewModel.canShowHeaders()) {
        moreButtons.push({
            label: "showHeaders_action",
            click: function () { return showHeaderDialog(viewModel.getHeaders()); },
            icon: "ListUnordered" /* Icons.ListUnordered */
        });
    }
    if (viewModel.canReport()) {
        moreButtons.push({
            label: "reportEmail_action",
            click: function () { return reportMail(viewModel); },
            icon: "Warning" /* Icons.Warning */
        });
    }
    if (viewModel.canPersistBlockingStatus() && viewModel.isShowingExternalContent()) {
        moreButtons.push({
            label: "disallowExternalContent_action",
            click: function () { return viewModel.setContentBlockingStatus("0" /* ContentBlockingStatus.Block */); },
            icon: "Picture" /* Icons.Picture */
        });
    }
    if (viewModel.canPersistBlockingStatus() && viewModel.isBlockingExternalImages()) {
        moreButtons.push({
            label: "showImages_action",
            click: function () { return viewModel.setContentBlockingStatus("1" /* ContentBlockingStatus.Show */); },
            icon: "Picture" /* Icons.Picture */
        });
    }
    return moreButtons;
}
exports.mailViewerMoreActions = mailViewerMoreActions;
function unsubscribe(viewModel) {
    return (0, ProgressDialog_js_1.showProgressDialog)("pleaseWait_msg", viewModel.unsubscribe())
        .then(function (success) {
        if (success) {
            return Dialog_1.Dialog.message("unsubscribeSuccessful_msg");
        }
    })["catch"](function (e) {
        if (e instanceof RestError_js_1.LockedError) {
            return Dialog_1.Dialog.message("operationStillActive_msg");
        }
        else {
            return Dialog_1.Dialog.message("unsubscribeFailed_msg");
        }
    });
}
function reportMail(viewModel) {
    var sendReport = function (reportType) {
        viewModel.reportMail(reportType)["catch"]((0, tutanota_utils_1.ofClass)(RestError_js_1.LockedError, function () { return Dialog_1.Dialog.message("operationStillActive_msg"); }))["finally"](mithril_1["default"].redraw);
    };
    var dialog = Dialog_1.Dialog.showActionDialog({
        title: LanguageViewModel_1.lang.get("reportEmail_action"),
        child: function () {
            return (0, mithril_1["default"])(".flex.col.mt-m", {
                // So that space below buttons doesn't look huge
                style: {
                    marginBottom: "-10px"
                }
            }, [
                (0, mithril_1["default"])("div", LanguageViewModel_1.lang.get("phishingReport_msg")),
                (0, GuiUtils_js_1.ifAllowedTutanotaLinks)("https://tutanota.com/faq#phishing" /* InfoLink.Phishing */, function (link) {
                    return (0, mithril_1["default"])("a.mt-s", {
                        href: link,
                        target: "_blank"
                    }, LanguageViewModel_1.lang.get("whatIsPhishing_msg"));
                }),
                (0, mithril_1["default"])(".flex-wrap.flex-end", [
                    (0, mithril_1["default"])(Button_js_1.Button, {
                        label: "reportPhishing_action",
                        click: function () {
                            sendReport("0" /* MailReportType.PHISHING */);
                            dialog.close();
                        },
                        type: "secondary" /* ButtonType.Secondary */
                    }),
                    (0, mithril_1["default"])(Button_js_1.Button, {
                        label: "reportSpam_action",
                        click: function () {
                            sendReport("1" /* MailReportType.SPAM */);
                            dialog.close();
                        },
                        type: "secondary" /* ButtonType.Secondary */
                    }),
                ]),
            ]);
        },
        okAction: null
    });
}
