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
exports.downloadAndDecryptDataFile = exports.openDataFileInBrowser = exports.zipDataFiles = exports.showFileChooser = exports.readLocalFiles = exports.handleDownloadErrors = exports.isLegacyFile = exports.CALENDAR_MIME_TYPE = void 0;
var Dialog_1 = require("../gui/base/Dialog");
var DataFile_1 = require("../api/common/DataFile");
var Env_1 = require("../api/common/Env");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var CryptoError_1 = require("../api/common/error/CryptoError");
var ClientDetector_1 = require("../misc/ClientDetector");
var FileUtils_1 = require("../api/common/utils/FileUtils");
var ErrorCheckUtils_js_1 = require("../api/common/utils/ErrorCheckUtils.js");
(0, Env_1.assertMainOrNode)();
exports.CALENDAR_MIME_TYPE = "text/calendar";
/**
 * The migration to blob attachments does not remove the FileData reference from files. This might change, therefore,
 * everytime we need to decide whether to treat a file as legacy, we should use this method, so that it is easier to
 * change this behavior in the future.
 * @param file
 */
function isLegacyFile(file) {
    return file.blobs.length === 0;
}
exports.isLegacyFile = isLegacyFile;
function handleDownloadErrors(e, errorAction) {
    if ((0, ErrorCheckUtils_js_1.isOfflineError)(e)) {
        return errorAction("couldNotAttachFile_msg");
    }
    else if (e instanceof CryptoError_1.CryptoError) {
        return errorAction("corrupted_msg");
    }
    else {
        throw e;
    }
}
exports.handleDownloadErrors = handleDownloadErrors;
function readLocalFiles(fileList) {
    // create an array of files form the FileList because we can not iterate the FileList directly
    var nativeFiles = [];
    for (var i = 0; i < fileList.length; i++) {
        nativeFiles.push(fileList[i]);
    }
    return (0, tutanota_utils_1.promiseMap)(nativeFiles, function (nativeFile) {
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.onloadend = function (evt) {
                var target = evt.target;
                if (target.readyState === reader.DONE && target.result) {
                    // DONE == 2
                    resolve((0, DataFile_1.convertToDataFile)(nativeFile, new Uint8Array(target.result)));
                }
                else {
                    reject(new Error("could not load file"));
                }
            };
            reader.readAsArrayBuffer(nativeFile);
        });
    }, {
        concurrency: 5
    });
}
exports.readLocalFiles = readLocalFiles;
/**
 * @param allowedExtensions Array of extensions strings without "."
 */
function showFileChooser(multiple, allowedExtensions) {
    var _this = this;
    // each time when called create a new file chooser to make sure that the same file can be selected twice directly after another
    // remove the last file input
    var fileInput = document.getElementById("hiddenFileChooser");
    var body = (0, tutanota_utils_1.neverNull)(document.body);
    if (fileInput) {
        // remove the old one because it may contain a file already
        body.removeChild(fileInput);
    }
    var newFileInput = document.createElement("input");
    newFileInput.setAttribute("type", "file");
    if (multiple) {
        newFileInput.setAttribute("multiple", "multiple");
    }
    newFileInput.setAttribute("id", "hiddenFileChooser");
    if (allowedExtensions) {
        newFileInput.setAttribute("accept", allowedExtensions.map(function (e) { return "." + e; }).join(","));
    }
    newFileInput.style.display = "none";
    var promise = new Promise(function (resolve) {
        newFileInput.addEventListener("change", function (e) {
            readLocalFiles(e.target.files)
                .then(resolve)["catch"](function (e) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.log(e);
                            return [4 /*yield*/, Dialog_1.Dialog.message("couldNotAttachFile_msg")];
                        case 1:
                            _a.sent();
                            resolve([]);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    // the file input must be put into the dom, otherwise it does not work in IE
    body.appendChild(newFileInput);
    newFileInput.click();
    return promise;
}
exports.showFileChooser = showFileChooser;
/**
 * takes a list of DataFiles and creates one DataFile from them that represents a zip
 * containing the the other files
 *
 * currently waits on all DataFiles being available before starting to add them to the zip.
 * It may be even faster to create the zip asap and adding the datafiles as they resolve.
 *
 * duplicate file names lead to the second file added overwriting the first one.
 *
 * @param dataFiles Promise resolving to an array of DataFiles
 * @param name the name of the new zip file
 */
function zipDataFiles(dataFiles, name) {
    return __awaiter(this, void 0, void 0, function () {
        var jsZip, zip, deduplicatedMap, _i, dataFiles_1, file, filename, zipData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("jszip"); })];
                case 1:
                    jsZip = _a.sent();
                    zip = jsZip["default"]();
                    deduplicatedMap = (0, FileUtils_1.deduplicateFilenames)(dataFiles.map(function (df) { return (0, FileUtils_1.sanitizeFilename)(df.name); }));
                    for (_i = 0, dataFiles_1 = dataFiles; _i < dataFiles_1.length; _i++) {
                        file = dataFiles_1[_i];
                        filename = (0, tutanota_utils_1.assertNotNull)(deduplicatedMap[file.name].shift());
                        zip.file((0, FileUtils_1.sanitizeFilename)(filename), file.data, { binary: true });
                    }
                    return [4 /*yield*/, zip.generateAsync({ type: "uint8array" })];
                case 2:
                    zipData = _a.sent();
                    return [2 /*return*/, (0, DataFile_1.createDataFile)(name, "application/zip", zipData)];
            }
        });
    });
}
exports.zipDataFiles = zipDataFiles;
function openDataFileInBrowser(dataFile) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var URL_1, needsPdfWorkaround, mimeType, blob, url_1, a, reader_1, downloadPromise, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 6, , 7]);
                    URL_1 = (_a = window.URL) !== null && _a !== void 0 ? _a : window.webkitURL;
                    needsPdfWorkaround = dataFile.mimeType === "application/pdf"
                        && ClientDetector_1.client.browser === "Firefox" /* BrowserType.FIREFOX */
                        && ClientDetector_1.client.browserVersion >= 98;
                    mimeType = needsPdfWorkaround
                        ? "application/octet-stream"
                        : dataFile.mimeType;
                    blob = new Blob([dataFile.data], { type: mimeType });
                    url_1 = URL_1.createObjectURL(blob);
                    a = document.createElement("a");
                    if (!(typeof a.download !== "undefined")) return [3 /*break*/, 1];
                    a.href = url_1;
                    a.download = dataFile.name;
                    a.style.display = "none";
                    a.target = "_blank";
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    // Do not revoke object URL right away so that the browser has a chance to open it
                    setTimeout(function () {
                        window.URL.revokeObjectURL(url_1);
                    }, 2000);
                    return [3 /*break*/, 5];
                case 1:
                    if (!(ClientDetector_1.client.isIos() && ClientDetector_1.client.browser === "Chrome" /* BrowserType.CHROME */ && typeof FileReader === "function")) return [3 /*break*/, 3];
                    reader_1 = new FileReader();
                    downloadPromise = new Promise(function (resolve) {
                        reader_1.onloadend = function () {
                            return __awaiter(this, void 0, void 0, function () {
                                var url, _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            url = reader_1.result;
                                            _a = resolve;
                                            return [4 /*yield*/, Dialog_1.Dialog.legacyDownload(dataFile.name, url)];
                                        case 1:
                                            _a.apply(void 0, [_b.sent()]);
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        };
                    });
                    reader_1.readAsDataURL(blob);
                    return [4 /*yield*/, downloadPromise];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 5];
                case 3: 
                // if the download attribute is not supported try to open the link in a new tab.
                return [4 /*yield*/, Dialog_1.Dialog.legacyDownload(dataFile.name, url_1)];
                case 4:
                    // if the download attribute is not supported try to open the link in a new tab.
                    _b.sent();
                    _b.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    e_1 = _b.sent();
                    console.log(e_1);
                    return [2 /*return*/, Dialog_1.Dialog.message("canNotOpenFileOnDevice_msg")];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.openDataFileInBrowser = openDataFileInBrowser;
function downloadAndDecryptDataFile(file, fileFacade, blobFacade) {
    return __awaiter(this, void 0, void 0, function () {
        var bytes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isLegacyFile(file)) return [3 /*break*/, 2];
                    return [4 /*yield*/, fileFacade.downloadFileContent(file)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2: return [4 /*yield*/, blobFacade.downloadAndDecrypt("1" /* ArchiveDataType.Attachments */, file.blobs, file)];
                case 3:
                    bytes = _a.sent();
                    return [2 /*return*/, (0, DataFile_1.convertToDataFile)(file, bytes)];
            }
        });
    });
}
exports.downloadAndDecryptDataFile = downloadAndDecryptDataFile;
