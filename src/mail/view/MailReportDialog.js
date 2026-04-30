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
exports.reportMailsAutomatically = void 0;
var Checkbox_js_1 = require("../../gui/base/Checkbox.js");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var mithril_1 = require("mithril");
var MailboxPropertiesUtils_1 = require("../../misc/MailboxPropertiesUtils");
var Dialog_1 = require("../../gui/base/Dialog");
var SnackBar_1 = require("../../gui/base/SnackBar");
function confirmMailReportDialog(mailboxProperties) {
    return new Promise(function (resolve) {
        var shallRememberDecision = false;
        var child = function () { return (0, mithril_1["default"])(Checkbox_js_1.Checkbox, {
            label: function () { return LanguageViewModel_1.lang.get("rememberDecision_msg"); },
            checked: shallRememberDecision,
            onChecked: function (v) { return shallRememberDecision = v; },
            helpLabel: function () { return LanguageViewModel_1.lang.get("changeMailSettings_msg"); }
        }); };
        function updateSpamReportSetting(areMailsReported) {
            if (shallRememberDecision) {
                var reportMovedMails = areMailsReported ? "1" /* ReportMovedMailsType.AUTOMATICALLY_ONLY_SPAM */ : "3" /* ReportMovedMailsType.NEVER */;
                (0, MailboxPropertiesUtils_1.saveReportMovedMails)(mailboxProperties, reportMovedMails);
            }
            resolve(areMailsReported);
            dialog.close();
        }
        var yesButton = {
            label: "yes_label",
            click: function () { return updateSpamReportSetting(true); },
            type: "primary" /* ButtonType.Primary */
        };
        var noButton = {
            label: "no_label",
            click: function () { return updateSpamReportSetting(false); },
            type: "secondary" /* ButtonType.Secondary */
        };
        // onclose is called when dialog is closed by ESC or back button. In this case we don't want to report spam.
        var onclose = function () {
            resolve(false);
        };
        var dialog = Dialog_1.Dialog.confirmMultiple(function () { return LanguageViewModel_1.lang.get("unencryptedTransmission_msg") + " " + LanguageViewModel_1.lang.get("allowOperation_msg"); }, [noButton, yesButton], onclose, child);
    });
}
/**
 * Check if the user wants to report mails as spam when they are moved to the spam folder and report them.
 * May open a dialog for confirmation and otherwise shows a Snackbar before reporting to the server.
 */
function reportMailsAutomatically(mailReportType, mailModel, mails) {
    return __awaiter(this, void 0, void 0, function () {
        var mailboxProperties, allowUndoing, isReportable, undoClicked_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (mailReportType !== "1" /* MailReportType.SPAM */) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, MailboxPropertiesUtils_1.loadMailboxProperties)()];
                case 1:
                    mailboxProperties = _a.sent();
                    allowUndoing = true // decides if a snackbar is shown to prevent the server request
                    ;
                    isReportable = false;
                    if (!(!mailboxProperties || mailboxProperties.reportMovedMails === "0" /* ReportMovedMailsType.ALWAYS_ASK */)) return [3 /*break*/, 3];
                    return [4 /*yield*/, confirmMailReportDialog(mailboxProperties)];
                case 2:
                    isReportable = _a.sent();
                    allowUndoing = false;
                    return [3 /*break*/, 4];
                case 3:
                    if (mailboxProperties.reportMovedMails === "1" /* ReportMovedMailsType.AUTOMATICALLY_ONLY_SPAM */) {
                        isReportable = true;
                    }
                    else if (mailboxProperties.reportMovedMails === "3" /* ReportMovedMailsType.NEVER */) {
                        // no report
                    }
                    _a.label = 4;
                case 4:
                    if (isReportable) {
                        // only show the snackbar to undo the report if the user was not asked already
                        if (allowUndoing) {
                            undoClicked_1 = false;
                            (0, SnackBar_1.showSnackBar)({
                                message: "undoMailReport_msg",
                                button: {
                                    label: "cancel_action",
                                    click: function () { return (undoClicked_1 = true); }
                                },
                                onClose: function () {
                                    if (!undoClicked_1) {
                                        mailModel.reportMails(mailReportType, mails);
                                    }
                                }
                            });
                        }
                        else {
                            mailModel.reportMails(mailReportType, mails);
                        }
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.reportMailsAutomatically = reportMailsAutomatically;
