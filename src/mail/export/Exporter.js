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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports._formatSmtpDateTime = exports.mailToEml = exports.mailToEmlFile = exports.exportMails = exports.generateExportFileName = exports.getMailExportMode = exports.generateMailFile = void 0;
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var DataFile_1 = require("../../api/common/DataFile");
var Bundler_1 = require("./Bundler");
var Env_1 = require("../../api/common/Env");
var FileUtils_1 = require("../../api/common/utils/FileUtils");
var MainLocator_1 = require("../../api/main/MainLocator");
var FileController_1 = require("../../file/FileController");
function generateMailFile(bundle, fileName, mode) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, mode === "eml" ? mailToEmlFile(bundle, fileName) : MainLocator_1.locator.fileApp.mailToMsg(bundle, fileName)];
        });
    });
}
exports.generateMailFile = generateMailFile;
function getMailExportMode() {
    return __awaiter(this, void 0, void 0, function () {
        var ConfigKeys, mailExportMode;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(0, Env_1.isDesktop)()) return [3 /*break*/, 3];
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../../desktop/config/ConfigKeys"); })];
                case 1:
                    ConfigKeys = _a.sent();
                    return [4 /*yield*/, MainLocator_1.locator.desktopSettingsFacade.getStringConfigValue(ConfigKeys.DesktopConfigKey.mailExportMode)["catch"](tutanota_utils_1.noOp)];
                case 2:
                    mailExportMode = (_a.sent());
                    return [2 /*return*/, mailExportMode !== null && mailExportMode !== void 0 ? mailExportMode : "eml"];
                case 3: return [2 /*return*/, "eml"];
            }
        });
    });
}
exports.getMailExportMode = getMailExportMode;
function generateExportFileName(subject, sentOn, mode) {
    var filename = __spreadArray(__spreadArray([], (0, tutanota_utils_1.formatSortableDateTime)(sentOn).split(" "), true), [subject], false).join("-");
    filename = filename.trim();
    if (filename.length === 0) {
        filename = "unnamed";
    }
    else if (filename.length > 96) {
        // windows MAX_PATH is 260, this should be fairly safe.
        filename = filename.substring(0, 95) + "_";
    }
    return (0, FileUtils_1.sanitizeFilename)("".concat(filename, ".").concat(mode));
}
exports.generateExportFileName = generateExportFileName;
/**
 * export mails. a single one will be exported as is, multiple will be put into a zip file
 * a save dialog will then be shown
 * @returns {Promise<void>} resolved after the fileController
 * was instructed to open the new zip File containing the exported files
 */
function exportMails(mails, entityClient, fileController) {
    var downloadPromise = (0, tutanota_utils_1.promiseMap)(mails, function (mail) {
        return Promise.resolve().then(function () { return require("../../misc/HtmlSanitizer"); }).then(function (_a) {
            var htmlSanitizer = _a.htmlSanitizer;
            return (0, Bundler_1.makeMailBundle)(mail, entityClient, fileController, htmlSanitizer);
        });
    });
    return Promise.all([getMailExportMode(), downloadPromise]).then(function (_a) {
        var mode = _a[0], bundles = _a[1];
        (0, tutanota_utils_1.promiseMap)(bundles, function (bundle) { return generateMailFile(bundle, generateExportFileName(bundle.subject, new Date(bundle.sentOn), mode), mode); }).then(function (files) {
            var zipName = "".concat((0, tutanota_utils_1.sortableTimestamp)(), "-").concat(mode, "-mail-export.zip");
            var maybeZipPromise = files.length === 1 ? Promise.resolve(files[0]) : (0, FileController_1.zipDataFiles)(files, zipName);
            maybeZipPromise.then(function (outputFile) { return fileController.saveDataFile(outputFile); });
        });
    });
}
exports.exportMails = exportMails;
function mailToEmlFile(mail, fileName) {
    var data = (0, tutanota_utils_1.stringToUtf8Uint8Array)(mailToEml(mail));
    return (0, DataFile_1.createDataFile)(fileName, "message/rfc822", data);
}
exports.mailToEmlFile = mailToEmlFile;
/**
 * Converts a mail into the plain text EML format.
 */
function mailToEml(mail) {
    var lines = [];
    if (mail.headers) {
        var filteredHeaders = mail.headers.split("\n").filter(function (line) { return !line.match(/^\s*(Content-Type:|boundary=)/); });
        // We join the headers back together with \n, but the eml itself has \r\n line endings, so the headers are essentially one "line" of the eml
        lines.push(filteredHeaders.join("\n"));
    }
    else {
        lines.push("From: " + mail.sender.address, "MIME-Version: 1.0");
        var formatRecipients = function (key, recipients) {
            return "".concat(key, ": ").concat(recipients.map(function (recipient) { return (recipient.name ? "".concat(escapeSpecialCharacters(recipient.name), " ") : "") + "<".concat(recipient.address, ">"); }).join(","));
        };
        if (mail.to.length > 0) {
            lines.push(formatRecipients("To", mail.to));
        }
        if (mail.cc.length > 0) {
            lines.push(formatRecipients("CC", mail.cc));
        }
        if (mail.bcc.length > 0) {
            lines.push(formatRecipients("BCC", mail.bcc));
        }
        var subject = mail.subject.trim() === "" ? "" : "=?UTF-8?B?".concat((0, tutanota_utils_1.uint8ArrayToBase64)((0, tutanota_utils_1.stringToUtf8Uint8Array)(mail.subject)), "?=");
        lines.push("Subject: " + subject, "Date: " + _formatSmtpDateTime(new Date(mail.sentOn)));
    }
    lines.push('Content-Type: multipart/related; boundary="------------79Bu5A16qPEYcVIZL@tutanota"', "", "--------------79Bu5A16qPEYcVIZL@tutanota", "Content-Type: text/html; charset=UTF-8", "Content-transfer-encoding: base64", "");
    for (var _i = 0, _a = breakIntoLines((0, tutanota_utils_1.stringToBase64)(mail.body)); _i < _a.length; _i++) {
        var bodyLine = _a[_i];
        lines.push(bodyLine);
    }
    lines.push("");
    for (var _b = 0, _c = mail.attachments; _b < _c.length; _b++) {
        var attachment = _c[_b];
        var base64Filename = "=?UTF-8?B?".concat((0, tutanota_utils_1.uint8ArrayToBase64)((0, tutanota_utils_1.stringToUtf8Uint8Array)(attachment.name)), "?=");
        var fileContentLines = breakIntoLines((0, tutanota_utils_1.uint8ArrayToBase64)(attachment.data));
        lines.push("--------------79Bu5A16qPEYcVIZL@tutanota", "Content-Type: " + (0, DataFile_1.getCleanedMimeType)(attachment.mimeType) + ";", " name=" + base64Filename + "", "Content-Transfer-Encoding: base64", "Content-Disposition: attachment;", " filename=" + base64Filename + "");
        if (attachment.cid) {
            lines.push("Content-Id: <" + attachment.cid + ">");
        }
        lines.push("");
        // don't use destructuring, big files can hit callstack limit
        for (var _d = 0, fileContentLines_1 = fileContentLines; _d < fileContentLines_1.length; _d++) {
            var fileLine = fileContentLines_1[_d];
            lines.push(fileLine);
        }
        lines.push("");
    }
    lines.push("--------------79Bu5A16qPEYcVIZL@tutanota--");
    return lines.join("\r\n");
}
exports.mailToEml = mailToEml;
function escapeSpecialCharacters(name) {
    // There may be other special characters that need escaping
    return name.replace(/[,<>]/gi, "\\$&");
}
function _formatSmtpDateTime(date) {
    var dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return (dayNames[date.getUTCDay()] +
        ", " +
        date.getUTCDate() +
        " " +
        monthNames[date.getUTCMonth()] +
        " " +
        date.getUTCFullYear() +
        " " +
        (0, tutanota_utils_1.pad)(date.getUTCHours(), 2) +
        ":" +
        (0, tutanota_utils_1.pad)(date.getUTCMinutes(), 2) +
        ":" +
        (0, tutanota_utils_1.pad)(date.getUTCSeconds(), 2) +
        " +0000");
}
exports._formatSmtpDateTime = _formatSmtpDateTime;
/**
 * Break up a long string into lines of up to 78 characters
 * @param string
 * @returns the lines, each as an individual array
 */
function breakIntoLines(string) {
    return string.length > 0 ? (0, tutanota_utils_1.assertNotNull)(string.match(/.{1,78}/g)) : [];
}
