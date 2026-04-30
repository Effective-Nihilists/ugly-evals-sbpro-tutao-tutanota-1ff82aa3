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
exports.runCaptchaFlow = exports.parseCaptchaInput = void 0;
var MainLocator_js_1 = require("../api/main/MainLocator.js");
var Services_js_1 = require("../api/entities/sys/Services.js");
var TypeRefs_js_1 = require("../api/entities/sys/TypeRefs.js");
var DeviceConfig_js_1 = require("../misc/DeviceConfig.js");
var RestError_js_1 = require("../api/common/error/RestError.js");
var Dialog_js_1 = require("../gui/base/Dialog.js");
var DialogHeaderBar_js_1 = require("../gui/base/DialogHeaderBar.js");
var LanguageViewModel_js_1 = require("../misc/LanguageViewModel.js");
var mithril_1 = require("mithril");
var TextField_js_1 = require("../gui/base/TextField.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
/**
 * Accepts multiple formats for a time of day and always returns 12h-format with leading zeros.
 * @param captchaInput
 * @returns {string} HH:MM if parsed, null otherwise
 */
function parseCaptchaInput(captchaInput) {
    if (captchaInput.match(/^[0-2]?[0-9]:[0-5]?[05]$/)) {
        var _a = captchaInput
            .trim()
            .split(":")
            .map(function (t) { return Number(t); }), h = _a[0], m_1 = _a[1];
        return [h % 12, m_1 % 60].map(function (a) { return String(a).padStart(2, "0"); }).join(":");
    }
    else {
        return null;
    }
}
exports.parseCaptchaInput = parseCaptchaInput;
/**
 * @returns the auth token for the signup if the captcha was solved or no captcha was necessary, null otherwise
 *
 * TODO:
 *  * Refactor token usage
 */
function runCaptchaFlow(mailAddress, isBusinessUse, isPaidSubscription, campaignToken) {
    return __awaiter(this, void 0, void 0, function () {
        var captchaReturn, e_1, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 13, , 17]);
                    return [4 /*yield*/, MainLocator_js_1.locator
                            .serviceExecutor
                            .get(Services_js_1.RegistrationCaptchaService, (0, TypeRefs_js_1.createRegistrationCaptchaServiceGetData)({
                            token: campaignToken,
                            mailAddress: mailAddress,
                            signupToken: DeviceConfig_js_1.deviceConfig.getSignupToken(),
                            businessUseSelected: isBusinessUse,
                            paidSubscriptionSelected: isPaidSubscription
                        }))];
                case 1:
                    captchaReturn = _a.sent();
                    if (!captchaReturn.challenge) return [3 /*break*/, 11];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 10]);
                    return [4 /*yield*/, showCaptchaDialog(captchaReturn.challenge, captchaReturn.token)];
                case 3: return [2 /*return*/, _a.sent()];
                case 4:
                    e_1 = _a.sent();
                    if (!(e_1 instanceof RestError_js_1.InvalidDataError)) return [3 /*break*/, 6];
                    return [4 /*yield*/, Dialog_js_1.Dialog.message("createAccountInvalidCaptcha_msg")];
                case 5:
                    _a.sent();
                    return [2 /*return*/, runCaptchaFlow(mailAddress, isBusinessUse, isPaidSubscription, campaignToken)];
                case 6:
                    if (!(e_1 instanceof RestError_js_1.AccessExpiredError)) return [3 /*break*/, 8];
                    return [4 /*yield*/, Dialog_js_1.Dialog.message("createAccountAccessDeactivated_msg")];
                case 7:
                    _a.sent();
                    return [2 /*return*/, null];
                case 8: throw e_1;
                case 9: return [3 /*break*/, 10];
                case 10: return [3 /*break*/, 12];
                case 11: return [2 /*return*/, captchaReturn.token];
                case 12: return [3 /*break*/, 17];
                case 13:
                    e_2 = _a.sent();
                    if (!(e_2 instanceof RestError_js_1.AccessDeactivatedError)) return [3 /*break*/, 15];
                    return [4 /*yield*/, Dialog_js_1.Dialog.message("createAccountAccessDeactivated_msg")];
                case 14:
                    _a.sent();
                    return [2 /*return*/, null];
                case 15: throw e_2;
                case 16: return [3 /*break*/, 17];
                case 17: return [2 /*return*/];
            }
        });
    });
}
exports.runCaptchaFlow = runCaptchaFlow;
function showCaptchaDialog(challenge, token) {
    return new Promise(function (resolve, reject) {
        var dialog;
        var captchaInput = "";
        var cancelAction = function () {
            dialog.close();
            resolve(null);
        };
        var okAction = function () {
            var parsedInput = parseCaptchaInput(captchaInput);
            if (parsedInput) {
                dialog.close();
                MainLocator_js_1.locator
                    .serviceExecutor
                    .post(Services_js_1.RegistrationCaptchaService, (0, TypeRefs_js_1.createRegistrationCaptchaServiceData)({ token: token, response: parsedInput }))
                    .then(function () {
                    resolve(token);
                })["catch"](function (e) {
                    reject(e);
                });
            }
            else {
                Dialog_js_1.Dialog.message("captchaEnter_msg");
            }
        };
        var actionBarAttrs = {
            left: [
                {
                    label: "cancel_action",
                    click: cancelAction,
                    type: "secondary" /* ButtonType.Secondary */
                },
            ],
            right: [
                {
                    label: "ok_action",
                    click: okAction,
                    type: "primary" /* ButtonType.Primary */
                },
            ],
            middle: function () { return LanguageViewModel_js_1.lang.get("captchaDisplay_label"); }
        };
        var imageData = "data:image/png;base64,".concat((0, tutanota_utils_1.uint8ArrayToBase64)(challenge));
        dialog = new Dialog_js_1.Dialog("EditSmall" /* DialogType.EditSmall */, {
            view: function () {
                return [
                    (0, mithril_1["default"])(".dialog-header.plr-l", (0, mithril_1["default"])(DialogHeaderBar_js_1.DialogHeaderBar, actionBarAttrs)),
                    (0, mithril_1["default"])(".plr-l.pb", [
                        (0, mithril_1["default"])("img.mt-l", {
                            src: imageData,
                            alt: LanguageViewModel_js_1.lang.get("captchaDisplay_label")
                        }),
                        (0, mithril_1["default"])(TextField_js_1.TextField, {
                            label: function () { return LanguageViewModel_js_1.lang.get("captchaInput_label") + " (hh:mm)"; },
                            helpLabel: function () { return LanguageViewModel_js_1.lang.get("captchaInfo_msg"); },
                            value: captchaInput,
                            oninput: function (value) { return (captchaInput = value); }
                        }),
                    ]),
                ];
            }
        })
            .setCloseHandler(cancelAction)
            .show();
    });
}
