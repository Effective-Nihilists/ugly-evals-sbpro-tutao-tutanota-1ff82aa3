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
exports.showLogsDialog = void 0;
var MainLocator_js_1 = require("../api/main/MainLocator.js");
var Env_js_1 = require("../api/common/Env.js");
var ErrorReporter_js_1 = require("../misc/ErrorReporter.js");
var Dialog_js_1 = require("../gui/base/Dialog.js");
var ClipboardUtils_js_1 = require("../misc/ClipboardUtils.js");
var mithril_1 = require("mithril");
/**
 * Show a simple dialog with client info and all the logs inside of it.
 */
function showLogsDialog() {
    return __awaiter(this, void 0, void 0, function () {
        var logContent, dialog;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prepareLogContent()];
                case 1:
                    logContent = _a.sent();
                    dialog = Dialog_js_1.Dialog.largeDialogN({
                        middle: function () { return "Logs"; },
                        right: function () { return [
                            {
                                type: "secondary" /* ButtonType.Secondary */,
                                label: "copy_action",
                                click: function () { return (0, ClipboardUtils_js_1.copyToClipboard)(logContent); }
                            },
                            {
                                type: "primary" /* ButtonType.Primary */,
                                label: "ok_action",
                                click: function () { return dialog.close(); }
                            }
                        ]; }
                    }, /** @class */ (function () {
                        function class_1() {
                        }
                        class_1.prototype.view = function () {
                            return (0, mithril_1["default"])(".fill-absolute.selectable.scroll.white-space-pre.plr.pt.pb", logContent);
                        };
                        return class_1;
                    }()), {});
                    dialog.show();
                    return [2 /*return*/];
            }
        });
    });
}
exports.showLogsDialog = showLogsDialog;
function prepareLogContent() {
    return __awaiter(this, void 0, void 0, function () {
        var entries, workerLog, _a, _b, _c, _d, message, type, client;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    entries = [];
                    if (window.logger) {
                        entries.push("== MAIN LOG ==\n".concat(window.logger.getEntries().join("\n"), "\n"));
                    }
                    return [4 /*yield*/, MainLocator_js_1.locator.worker.getLog()];
                case 1:
                    workerLog = _e.sent();
                    if (workerLog.length > 0) {
                        entries.push("== WORKER LOG ==\n".concat(workerLog.join("\n"), "\n"));
                    }
                    if (!((0, Env_js_1.isDesktop)() || (0, Env_js_1.isApp)())) return [3 /*break*/, 3];
                    _b = (_a = entries).push;
                    _c = "== NATIVE LOG ==\n".concat;
                    return [4 /*yield*/, MainLocator_js_1.locator.commonSystemFacade.getLog()];
                case 2:
                    _b.apply(_a, [_c.apply("== NATIVE LOG ==\n", [_e.sent(), "\n"])]);
                    _e.label = 3;
                case 3:
                    _d = (0, ErrorReporter_js_1.clientInfoString)(new Date(), false), message = _d.message, type = _d.type, client = _d.client;
                    return [2 /*return*/, "v".concat(env.versionNumber, " - ").concat(client, "\n").concat(message, "\n\n").concat(entries.join("\n"))];
            }
        });
    });
}
