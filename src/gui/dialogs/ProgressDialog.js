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
exports.showWorkerProgressDialog = exports.showProgressDialog = void 0;
var mithril_1 = require("mithril");
var Env_1 = require("../../api/common/Env");
var Dialog_1 = require("../base/Dialog");
var Animations_1 = require("../animation/Animations");
var LanguageViewModel_1 = require("../../misc/LanguageViewModel");
var Icon_1 = require("../base/Icon");
var CompletenessIndicator_js_1 = require("../CompletenessIndicator.js");
var stream_1 = require("mithril/stream");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
(0, Env_1.assertMainOrNode)();
function showProgressDialog(messageIdOrMessageFunction, action, progressStream) {
    return __awaiter(this, void 0, void 0, function () {
        var progressDialog, start, minDialogVisibilityMillis, diff;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (progressStream != null) {
                        progressStream.map(function () {
                            mithril_1["default"].redraw();
                        });
                    }
                    progressDialog = new Dialog_1.Dialog("Progress" /* DialogType.Progress */, {
                        view: function () { return (0, mithril_1["default"])(".hide-outline", {
                            // We make this element focusable so that the screen reader announces the dialog
                            tabindex: "0" /* TabIndex.Default */,
                            oncreate: function (vnode) {
                                // We need to delay so that the eelement is attached to the parent
                                setTimeout(function () {
                                    vnode.dom.focus();
                                }, 10);
                            }
                        }, [
                            (0, mithril_1["default"])(".flex-center", progressStream ? (0, mithril_1["default"])(CompletenessIndicator_js_1.CompletenessIndicator, { percentageCompleted: progressStream() }) : (0, Icon_1.progressIcon)()),
                            (0, mithril_1["default"])("p#dialog-title", LanguageViewModel_1.lang.getMaybeLazy(messageIdOrMessageFunction)),
                        ]); }
                    }).setCloseHandler(function () {
                        // do not close progress on onClose event
                    });
                    progressDialog.show();
                    start = new Date().getTime();
                    minDialogVisibilityMillis = (0, Env_1.isAdminClient)() ? 0 : 1000;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 6]);
                    return [4 /*yield*/, action];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    diff = Date.now() - start;
                    return [4 /*yield*/, (0, tutanota_utils_1.delay)(Math.max(minDialogVisibilityMillis - diff, 0))];
                case 4:
                    _a.sent();
                    progressDialog.close();
                    return [4 /*yield*/, (0, tutanota_utils_1.delay)(Animations_1.DefaultAnimationTime)];
                case 5:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.showProgressDialog = showProgressDialog;
function showWorkerProgressDialog(worker, messageIdOrMessageFunction, action) {
    var progress = (0, stream_1["default"])(0);
    worker.registerProgressUpdater(progress);
    return showProgressDialog(messageIdOrMessageFunction, action, progress)["finally"](function () {
        worker.unregisterProgressUpdater(progress);
    });
}
exports.showWorkerProgressDialog = showWorkerProgressDialog;
