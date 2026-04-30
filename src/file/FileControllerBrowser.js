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
exports.FileControllerBrowser = void 0;
var Dialog_1 = require("../gui/base/Dialog");
var Env_1 = require("../api/common/Env");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var ProgressDialog_1 = require("../gui/dialogs/ProgressDialog");
var LanguageViewModel_1 = require("../misc/LanguageViewModel");
var FileController_js_1 = require("./FileController.js");
(0, Env_1.assertMainOrNode)();
var FileControllerBrowser = /** @class */ (function () {
    function FileControllerBrowser(blobFacade, fileFacade) {
        this.blobFacade = blobFacade;
        this.fileFacade = fileFacade;
    }
    FileControllerBrowser.prototype.download = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 4]);
                        return [4 /*yield*/, (0, ProgressDialog_1.showProgressDialog)("pleaseWait_msg", this.downloadAndDecrypt(file)
                                .then(function (file) { return _this.saveDataFile(file); }))];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        e_1 = _a.sent();
                        console.log("downloadAndOpen error", e_1.message);
                        return [4 /*yield*/, (0, FileController_js_1.handleDownloadErrors)(e_1, Dialog_1.Dialog.message)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    FileControllerBrowser.prototype.downloadAll = function (tutanotaFiles) {
        return __awaiter(this, void 0, void 0, function () {
            var downloadedFiles, _loop_1, this_1, _i, tutanotaFiles_1, file, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        downloadedFiles = [];
                        _loop_1 = function (file) {
                            var downloadedFile, e_2;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        _c.trys.push([0, 2, , 4]);
                                        return [4 /*yield*/, this_1.downloadAndDecrypt(file)];
                                    case 1:
                                        downloadedFile = _c.sent();
                                        downloadedFiles.push(downloadedFile);
                                        return [3 /*break*/, 4];
                                    case 2:
                                        e_2 = _c.sent();
                                        return [4 /*yield*/, (0, FileController_js_1.handleDownloadErrors)(e_2, function (msg) { return Dialog_1.Dialog.message(function () { return LanguageViewModel_1.lang.get(msg) + " " + file.name; }); })];
                                    case 3:
                                        _c.sent();
                                        return [3 /*break*/, 4];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, tutanotaFiles_1 = tutanotaFiles;
                        _b.label = 1;
                    case 1:
                        if (!(_i < tutanotaFiles_1.length)) return [3 /*break*/, 4];
                        file = tutanotaFiles_1[_i];
                        return [5 /*yield**/, _loop_1(file)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        _a = FileController_js_1.openDataFileInBrowser;
                        return [4 /*yield*/, (0, FileController_js_1.zipDataFiles)(downloadedFiles, "".concat((0, tutanota_utils_1.sortableTimestamp)(), "-attachments.zip"))];
                    case 5: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
                    case 6:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FileControllerBrowser.prototype.open = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.download(file)];
            });
        });
    };
    FileControllerBrowser.prototype.saveDataFile = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, FileController_js_1.openDataFileInBrowser)(file)];
            });
        });
    };
    FileControllerBrowser.prototype.downloadAndDecrypt = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, FileController_js_1.downloadAndDecryptDataFile)(file, this.fileFacade, this.blobFacade)];
            });
        });
    };
    return FileControllerBrowser;
}());
exports.FileControllerBrowser = FileControllerBrowser;
