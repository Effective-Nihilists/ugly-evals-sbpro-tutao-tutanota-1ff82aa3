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
exports.clientInfoString = exports.sendFeedbackMail = exports.showErrorDialogNotLoggedIn = exports.promptForFeedbackAndSend = void 0;
var LoginController_1 = require("../api/main/LoginController");
var stream_1 = require("mithril/stream");
var TextField_js_1 = require("../gui/base/TextField.js");
var LanguageViewModel_1 = require("./LanguageViewModel");
var Dialog_1 = require("../gui/base/Dialog");
var notificationOverlay = require("../gui/base/NotificationOverlay");
var mithril_1 = require("mithril");
var Checkbox_js_1 = require("../gui/base/Checkbox.js");
var Button_js_1 = require("../gui/base/Button.js");
var Expander_1 = require("../gui/base/Expander");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var MainLocator_1 = require("../api/main/MainLocator");
var TutanotaConstants_1 = require("../api/common/TutanotaConstants");
var ClipboardUtils_1 = require("./ClipboardUtils");
var size_1 = require("../gui/size");
var Env_1 = require("../api/common/Env");
function promptForFeedbackAndSend(e) {
    var loggedIn = LoginController_1.logins.isUserLoggedIn();
    var ignoreChecked = false;
    return new Promise(function (resolve) {
        var preparedContent = prepareFeedbackContent(e, loggedIn);
        var detailsExpanded = (0, stream_1["default"])(false);
        var userMessage = "";
        var errorOkAction = function (dialog) {
            preparedContent.message = userMessage + "\n" + preparedContent.message;
            resolve(preparedContent);
            dialog.close();
        };
        notificationOverlay.show({
            view: function () {
                return (0, mithril_1["default"])("", [
                    "An error occurred",
                    (0, mithril_1["default"])(Checkbox_js_1.Checkbox, {
                        label: function () { return "Ignore the error for this session"; },
                        checked: ignoreChecked,
                        onChecked: function (checked) {
                            ignoreChecked = checked;
                        }
                    }),
                ]);
            }
        }, {
            label: "close_alt",
            click: function () {
                resolve(null);
            }
        }, [
            {
                label: function () { return "Send report"; },
                click: function () {
                    showReportDialog();
                },
                type: "secondary" /* ButtonType.Secondary */
            },
        ]);
        function showReportDialog() {
            Dialog_1.Dialog.showActionDialog({
                title: LanguageViewModel_1.lang.get("sendErrorReport_action"),
                type: "EditMedium" /* DialogType.EditMedium */,
                child: {
                    view: function () {
                        return [
                            (0, mithril_1["default"])(TextField_js_1.TextField, {
                                label: "yourMessage_label",
                                helpLabel: function () { return LanguageViewModel_1.lang.get("feedbackOnErrorInfo_msg"); },
                                value: userMessage,
                                type: "area" /* TextFieldType.Area */,
                                oninput: function (value) {
                                    userMessage = value;
                                }
                            }),
                            (0, mithril_1["default"])(".flex-end", (0, mithril_1["default"])(".right", (0, mithril_1["default"])(Expander_1.ExpanderButton, {
                                label: "details_label",
                                expanded: detailsExpanded(),
                                onExpandedChange: detailsExpanded
                            }))),
                            (0, mithril_1["default"])(Expander_1.ExpanderPanel, {
                                expanded: detailsExpanded()
                            }, (0, mithril_1["default"])(".selectable", [
                                (0, mithril_1["default"])(".selectable", preparedContent.subject),
                                preparedContent.message.split("\n").map(function (l) { return (l.trim() === "" ? (0, mithril_1["default"])(".pb-m", "") : (0, mithril_1["default"])("", l)); }),
                            ])),
                        ];
                    }
                },
                okAction: errorOkAction,
                cancelAction: function () {
                    resolve(null);
                }
            });
        }
    }).then(function (content) {
        if (content) {
            sendFeedbackMail(content);
        }
        return { ignored: ignoreChecked };
    });
}
exports.promptForFeedbackAndSend = promptForFeedbackAndSend;
function showErrorDialogNotLoggedIn(e) {
    var content = prepareFeedbackContent(e, false);
    var expanded = (0, stream_1["default"])(false);
    var message = content.subject + "\n\n" + content.message;
    var info = function () { return [
        (0, mithril_1["default"])(".flex.col.items-end.plr", {
            style: {
                marginTop: "-16px"
            }
        }, [
            (0, mithril_1["default"])("div.mr-negative-xs", (0, mithril_1["default"])(Expander_1.ExpanderButton, {
                expanded: expanded(),
                onExpandedChange: expanded,
                label: "showMore_action"
            })),
        ]),
        (0, mithril_1["default"])(Expander_1.ExpanderPanel, {
            expanded: expanded()
        }, [
            (0, mithril_1["default"])(".flex-end.plr", (0, mithril_1["default"])(Button_js_1.Button, {
                label: "copy_action",
                click: function () { return (0, ClipboardUtils_1.copyToClipboard)(message); },
                type: "secondary" /* ButtonType.Secondary */
            })),
            (0, mithril_1["default"])(".plr.selectable.pb.scroll.text-pre", {
                style: {
                    height: (0, size_1.px)(200)
                }
            }, message),
        ]),
    ]; };
    return Dialog_1.Dialog.message("unknownError_msg", info);
}
exports.showErrorDialogNotLoggedIn = showErrorDialogNotLoggedIn;
function sendFeedbackMail(content) {
    return __awaiter(this, void 0, void 0, function () {
        var name, mailAddress, escapedBody, draft;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    name = "";
                    mailAddress = "reports@tutao.de";
                    escapedBody = new Option(content.message).innerHTML;
                    return [4 /*yield*/, MainLocator_1.locator.mailFacade.createDraft({
                            subject: content.subject,
                            bodyText: escapedBody.split("\n").join("<br>"),
                            senderMailAddress: (0, tutanota_utils_1.neverNull)(LoginController_1.logins.getUserController().userGroupInfo.mailAddress),
                            senderName: "",
                            toRecipients: [
                                {
                                    name: name,
                                    address: mailAddress
                                }
                            ],
                            ccRecipients: [],
                            bccRecipients: [],
                            conversationType: "0" /* ConversationType.NEW */,
                            previousMessageId: null,
                            attachments: [],
                            confidential: true,
                            replyTos: [],
                            method: "0" /* MailMethod.NONE */
                        })];
                case 1:
                    draft = _a.sent();
                    return [4 /*yield*/, MainLocator_1.locator.mailFacade.sendDraft(draft, [
                            {
                                name: name,
                                address: mailAddress,
                                type: "internal" /* RecipientType.INTERNAL */,
                                contact: null
                            },
                        ], "de")];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.sendFeedbackMail = sendFeedbackMail;
function prepareFeedbackContent(error, loggedIn) {
    var timestamp = new Date();
    var _a = clientInfoString(timestamp, loggedIn), message = _a.message, client = _a.client, type = _a.type;
    if (error) {
        message += (0, tutanota_utils_1.errorToString)(error);
    }
    var subject = "Feedback v".concat(env.versionNumber, " - ").concat(error && error.name ? error.name : "?", " - ").concat(type, " - ").concat(client);
    return {
        message: message,
        subject: subject
    };
}
function clientInfoString(timestamp, loggedIn) {
    var type = loggedIn
        ? (0, tutanota_utils_1.neverNull)((0, tutanota_utils_1.typedKeys)(TutanotaConstants_1.AccountType).find(function (typeName) { return TutanotaConstants_1.AccountType[typeName] === LoginController_1.logins.getUserController().user.accountType; }))
        : "UNKNOWN";
    var client = (function () {
        var _a;
        switch (env.mode) {
            case Env_1.Mode.Browser:
            case Env_1.Mode.Test:
                return env.mode;
            default:
                return (_a = env.platformId) !== null && _a !== void 0 ? _a : "";
        }
    })();
    var message = "\n\n Client: ".concat(client);
    message += "\n Type: ".concat(type);
    message += "\n Tutanota version: ".concat(env.versionNumber);
    message += "\n Timestamp (UTC): ".concat(timestamp.toUTCString());
    message += "\n User agent:\n".concat(navigator.userAgent) + "\n";
    return {
        message: message,
        client: client,
        type: type
    };
}
exports.clientInfoString = clientInfoString;
