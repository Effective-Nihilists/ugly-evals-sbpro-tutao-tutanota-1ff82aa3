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
exports.makeMailBundle = void 0;
var TypeRefs_js_1 = require("../../api/entities/tutanota/TypeRefs.js");
var Utils_1 = require("../../api/common/utils/Utils");
var EntityUtils_1 = require("../../api/common/utils/EntityUtils");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
/**
 * Downloads the mail body and the attachments for an email, to prepare for exporting
 */
function makeMailBundle(mail, entityClient, fileController, sanitizer) {
    return __awaiter(this, void 0, void 0, function () {
        var body, _a, _b, _c, attachments, headers, _d, _e, recipientMapper;
        var _this = this;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _b = (_a = sanitizer).sanitizeHTML;
                    _c = Utils_1.getMailBodyText;
                    return [4 /*yield*/, entityClient.load(TypeRefs_js_1.MailBodyTypeRef, mail.body)];
                case 1:
                    body = _b.apply(_a, [_c.apply(void 0, [_f.sent()]),
                        {
                            blockExternalContent: false,
                            allowRelativeLinks: false,
                            usePlaceholderForInlineImages: false
                        }]).html;
                    return [4 /*yield*/, (0, tutanota_utils_1.promiseMap)(mail.attachments, function (fileId) { return __awaiter(_this, void 0, void 0, function () {
                            var file;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, entityClient.load(TypeRefs_js_1.FileTypeRef, fileId)];
                                    case 1:
                                        file = _a.sent();
                                        return [4 /*yield*/, fileController.downloadAndDecrypt(file)];
                                    case 2: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); })];
                case 2:
                    attachments = _f.sent();
                    if (!(mail.headers != null)) return [3 /*break*/, 4];
                    _e = Utils_1.getMailHeaders;
                    return [4 /*yield*/, entityClient.load(TypeRefs_js_1.MailHeadersTypeRef, mail.headers)];
                case 3:
                    _d = _e.apply(void 0, [_f.sent()]);
                    return [3 /*break*/, 5];
                case 4:
                    _d = null;
                    _f.label = 5;
                case 5:
                    headers = _d;
                    recipientMapper = function (_a) {
                        var address = _a.address, name = _a.name;
                        return ({ address: address, name: name });
                    };
                    return [2 /*return*/, {
                            mailId: (0, EntityUtils_1.getLetId)(mail),
                            subject: mail.subject,
                            body: body,
                            sender: recipientMapper(mail.sender),
                            to: mail.toRecipients.map(recipientMapper),
                            cc: mail.ccRecipients.map(recipientMapper),
                            bcc: mail.bccRecipients.map(recipientMapper),
                            replyTo: mail.replyTos.map(recipientMapper),
                            isDraft: mail.state === "0" /* MailState.DRAFT */,
                            isRead: !mail.unread,
                            sentOn: mail.sentDate.getTime(),
                            receivedOn: mail.receivedDate.getTime(),
                            headers: headers,
                            attachments: attachments
                        }];
            }
        });
    });
}
exports.makeMailBundle = makeMailBundle;
