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
exports.FileControllerNative = void 0;
var Dialog_1 = require("../gui/base/Dialog");
var Env_1 = require("../api/common/Env");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var ProgressDialog_1 = require("../gui/dialogs/ProgressDialog");
var LanguageViewModel_1 = require("../misc/LanguageViewModel");
var CancelledError_1 = require("../api/common/error/CancelledError");
var FileController_js_1 = require("./FileController.js");
(0, Env_1.assertMainOrNode)();
var FileControllerNative = /** @class */ (function () {
    function FileControllerNative(fileApp, blobFacade, fileFacade) {
        this.fileApp = fileApp;
        this.blobFacade = blobFacade;
        this.fileFacade = fileFacade;
        (0, tutanota_utils_1.assert)((0, Env_1.isElectronClient)() || (0, Env_1.isApp)() || (0, Env_1.isTest)(), "Don't make native file controller when not in native");
    }
    /**
     * Temporary files are deleted afterwards in apps.
     */
    FileControllerNative.prototype.download = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, guiDownload(this.doDownload(file))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FileControllerNative.prototype.open = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, guiDownload(this.doOpen(file))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FileControllerNative.prototype.doDownload = function (tutanotaFile) {
        return __awaiter(this, void 0, void 0, function () {
            var temporaryFile, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        temporaryFile = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 7, 12]);
                        return [4 /*yield*/, this.downloadAndDecryptInNative(tutanotaFile)];
                    case 2:
                        temporaryFile = _a.sent();
                        if (!((0, Env_1.isAndroidApp)() || (0, Env_1.isDesktop)())) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.fileApp.putFileIntoDownloadsFolder(temporaryFile.location)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.fileApp.open(temporaryFile)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [3 /*break*/, 12];
                    case 7:
                        if (!temporaryFile) return [3 /*break*/, 11];
                        _a.label = 8;
                    case 8:
                        _a.trys.push([8, 10, , 11]);
                        return [4 /*yield*/, this.fileApp.deleteFile(temporaryFile.location)];
                    case 9:
                        _a.sent();
                        return [3 /*break*/, 11];
                    case 10:
                        e_1 = _a.sent();
                        console.log("failed to delete file", temporaryFile.location, e_1);
                        return [3 /*break*/, 11];
                    case 11: return [7 /*endfinally*/];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    FileControllerNative.prototype.doOpen = function (tutanotaFile) {
        return __awaiter(this, void 0, void 0, function () {
            var temporaryFile, location_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        temporaryFile = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 4, 5]);
                        return [4 /*yield*/, this.downloadAndDecryptInNative(tutanotaFile)];
                    case 2:
                        temporaryFile = _a.sent();
                        return [4 /*yield*/, this.fileApp.open(temporaryFile)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        if (temporaryFile && (0, Env_1.isApp)()) {
                            location_1 = temporaryFile.location;
                            this.fileApp.deleteFile(location_1)["catch"](function (e) { return console.log("failed to delete file", location_1, e); });
                        }
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Temporary files are deleted afterwards in apps.
     *
     * TODO this could probably just use this.doDownload. Temporary files are not being cleaned up on android
     */
    FileControllerNative.prototype.downloadAll = function (tutanotaFiles) {
        return __awaiter(this, void 0, void 0, function () {
            var downloadAll;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        downloadAll = function (downloadFile, processDownloadedFiles) { return __awaiter(_this, void 0, void 0, function () {
                            var downloadedFiles, _loop_1, _i, tutanotaFiles_1, file;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        downloadedFiles = [];
                                        _loop_1 = function (file) {
                                            var downloadedFile, e_2;
                                            return __generator(this, function (_b) {
                                                switch (_b.label) {
                                                    case 0:
                                                        _b.trys.push([0, 2, , 4]);
                                                        return [4 /*yield*/, downloadFile(file)];
                                                    case 1:
                                                        downloadedFile = _b.sent();
                                                        downloadedFiles.push(downloadedFile);
                                                        return [3 /*break*/, 4];
                                                    case 2:
                                                        e_2 = _b.sent();
                                                        return [4 /*yield*/, (0, FileController_js_1.handleDownloadErrors)(e_2, function (msg) { return Dialog_1.Dialog.message(function () { return LanguageViewModel_1.lang.get(msg) + " " + file.name; }); })];
                                                    case 3:
                                                        _b.sent();
                                                        return [3 /*break*/, 4];
                                                    case 4: return [2 /*return*/];
                                                }
                                            });
                                        };
                                        _i = 0, tutanotaFiles_1 = tutanotaFiles;
                                        _a.label = 1;
                                    case 1:
                                        if (!(_i < tutanotaFiles_1.length)) return [3 /*break*/, 4];
                                        file = tutanotaFiles_1[_i];
                                        return [5 /*yield**/, _loop_1(file)];
                                    case 2:
                                        _a.sent();
                                        _a.label = 3;
                                    case 3:
                                        _i++;
                                        return [3 /*break*/, 1];
                                    case 4: return [4 /*yield*/, processDownloadedFiles(downloadedFiles)];
                                    case 5:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); };
                        if (!(0, Env_1.isAndroidApp)()) return [3 /*break*/, 2];
                        return [4 /*yield*/, downloadAll(function (file) { return _this.downloadAndDecryptInNative(file); }, function (files) { return (0, tutanota_utils_1.promiseMap)(files, function (file) { return _this.fileApp.putFileIntoDownloadsFolder(file.location); }); })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 2:
                        if (!(0, Env_1.isIOSApp)()) return [3 /*break*/, 4];
                        return [4 /*yield*/, downloadAll(function (file) { return _this.downloadAndDecryptInNative(file); }, function (files) { return (0, tutanota_utils_1.promiseMap)(files, function (file) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, , 2, 4]);
                                            return [4 /*yield*/, this.fileApp.open(file)];
                                        case 1:
                                            _a.sent();
                                            return [3 /*break*/, 4];
                                        case 2: return [4 /*yield*/, this.fileApp.deleteFile(file.location)["catch"](function (e) { return console.log("failed to delete file", file.location, e); })];
                                        case 3:
                                            _a.sent();
                                            return [7 /*endfinally*/];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); }); })];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, downloadAll(function (file) { return _this.downloadAndDecrypt(file); }, function (files) { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = FileController_js_1.openDataFileInBrowser;
                                    return [4 /*yield*/, (0, FileController_js_1.zipDataFiles)(files, "".concat((0, tutanota_utils_1.sortableTimestamp)(), "-attachments.zip"))];
                                case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                            }
                        }); }); })];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Does not delete temporary file in app.
     */
    FileControllerNative.prototype.saveDataFile = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var fileReference, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 9]);
                        return [4 /*yield*/, this.fileApp.writeDataFile(file)];
                    case 1:
                        fileReference = _a.sent();
                        if (!((0, Env_1.isAndroidApp)() || (0, Env_1.isDesktop)())) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.fileApp.putFileIntoDownloadsFolder(fileReference.location)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                    case 3:
                        if ((0, Env_1.isIOSApp)()) {
                            return [2 /*return*/, this.fileApp.open(fileReference)];
                        }
                        _a.label = 4;
                    case 4: return [3 /*break*/, 9];
                    case 5:
                        e_3 = _a.sent();
                        if (!(e_3 instanceof CancelledError_1.CancelledError)) return [3 /*break*/, 6];
                        // no-op. User cancelled file dialog
                        console.log("saveDataFile cancelled");
                        return [3 /*break*/, 8];
                    case 6:
                        console.warn("openDataFile failed", e_3);
                        return [4 /*yield*/, Dialog_1.Dialog.message("canNotOpenFileOnDevice_msg")];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8: return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    FileControllerNative.prototype.downloadAndDecrypt = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, FileController_js_1.downloadAndDecryptDataFile)(file, this.fileFacade, this.blobFacade)];
            });
        });
    };
    /** Public for testing */
    FileControllerNative.prototype.downloadAndDecryptInNative = function (tutanotaFile) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(0, FileController_js_1.isLegacyFile)(tutanotaFile)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.fileFacade.downloadFileContentNative(tutanotaFile)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, this.blobFacade.downloadAndDecryptNative("1" /* ArchiveDataType.Attachments */, tutanotaFile.blobs, tutanotaFile, tutanotaFile.name, (0, tutanota_utils_1.neverNull)(tutanotaFile.mimeType))];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return FileControllerNative;
}());
exports.FileControllerNative = FileControllerNative;
function guiDownload(downloadPromise) {
    return __awaiter(this, void 0, void 0, function () {
        var e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 4]);
                    return [4 /*yield*/, (0, ProgressDialog_1.showProgressDialog)("pleaseWait_msg", downloadPromise)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 2:
                    e_4 = _a.sent();
                    // handle the user cancelling the dialog
                    if (e_4 instanceof CancelledError_1.CancelledError) {
                        return [2 /*return*/];
                    }
                    console.log("downloadAndOpen error", e_4.message);
                    return [4 /*yield*/, (0, FileController_js_1.handleDownloadErrors)(e_4, Dialog_1.Dialog.message)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
