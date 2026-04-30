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
exports.NativeFileApp = void 0;
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Env_js_1 = require("../../api/common/Env.js");
var ProgrammingError_js_1 = require("../../api/common/error/ProgrammingError.js");
var NativeFileApp = /** @class */ (function () {
    function NativeFileApp(fileFacade, exportFacade) {
        this.fileFacade = fileFacade;
        this.exportFacade = exportFacade;
    }
    /**
     * Open the file
     * @param file The uri of the file
     */
    NativeFileApp.prototype.open = function (file) {
        return this.fileFacade.open(file.location, file.mimeType);
    };
    /**
     * Opens a file chooser to select a file.
     * @param boundingRect The file chooser is opened next to the rectangle.
     */
    NativeFileApp.prototype.openFileChooser = function (boundingRect) {
        return __awaiter(this, void 0, void 0, function () {
            var srcRect, files;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        srcRect = {
                            x: Math.round(boundingRect.left),
                            y: Math.round(boundingRect.top),
                            width: Math.round(boundingRect.width),
                            height: Math.round(boundingRect.height)
                        };
                        return [4 /*yield*/, this.fileFacade.openFileChooser(srcRect)];
                    case 1:
                        files = _a.sent();
                        return [2 /*return*/, (0, tutanota_utils_1.promiseMap)(files, this.uriToFileRef.bind(this))];
                }
            });
        });
    };
    NativeFileApp.prototype.openFolderChooser = function () {
        return this.fileFacade.openFolderChooser();
    };
    /**
     * Deletes the file.
     * @param  file The uri of the file to delete.
     */
    NativeFileApp.prototype.deleteFile = function (file) {
        return this.fileFacade.deleteFile(file);
    };
    /**
     * Returns the name of the file
     * @param file The uri of the file
     */
    NativeFileApp.prototype.getName = function (file) {
        return this.fileFacade.getName(file);
    };
    /**
     * Returns the mime type of the file
     * @param file The uri of the file
     */
    NativeFileApp.prototype.getMimeType = function (file) {
        return this.fileFacade.getMimeType(file);
    };
    /**
     * Returns the byte size of a file
     * @param file The uri of the file
     */
    NativeFileApp.prototype.getSize = function (file) {
        return this.fileFacade.getSize(file);
    };
    /**
     * Copies the file into downloads folder and notifies system and user about that
     * @param localFileUri URI for the source file
     * @returns {*} absolute path of the destination file
     */
    NativeFileApp.prototype.putFileIntoDownloadsFolder = function (localFileUri) {
        return this.fileFacade.putFileIntoDownloadsFolder(localFileUri);
    };
    NativeFileApp.prototype.writeDataFile = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var fileUri;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fileFacade.writeDataFile(data)];
                    case 1:
                        fileUri = _a.sent();
                        return [2 /*return*/, {
                                _type: "FileReference",
                                name: data.name,
                                mimeType: data.mimeType,
                                size: data.size,
                                location: fileUri
                            }];
                }
            });
        });
    };
    /**
     * Uploads the binary data of a file to tutadb
     */
    NativeFileApp.prototype.upload = function (fileUrl, targetUrl, method, headers) {
        return this.fileFacade.upload(fileUrl, targetUrl, method, headers);
    };
    /**
     * Downloads the binary data of a file from tutadb and stores it in the internal memory.
     * @returns Resolves to the URI of the downloaded file
     */
    NativeFileApp.prototype.download = function (sourceUrl, filename, headers) {
        return this.fileFacade.download(sourceUrl, filename, headers);
    };
    /**
     * Get the shortened (first six bytes) of the SHA256 of the file.
     * @param fileUri
     * @return Base64 encoded, shortened SHA256 hash of the file
     */
    NativeFileApp.prototype.hashFile = function (fileUri) {
        return this.fileFacade.hashFile(fileUri);
    };
    NativeFileApp.prototype.clearFileData = function () {
        return this.fileFacade.clearFileData();
    };
    /**
     * take a file location in the form of
     *   - a uri like file:///home/user/cat.jpg
     *   - an absolute file path like C:\Users\cat.jpg
     * and return a DataFile populated
     * with data and metadata of that file on disk.
     *
     * returns null
     *   - if invoked in apps, because they use FileRef, not DataFile
     *   - if file can't be opened for any reason
     *   - if path is not absolute
     */
    NativeFileApp.prototype.readDataFile = function (uriOrPath) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!(0, Env_js_1.isDesktop)())
                    throw new ProgrammingError_js_1.ProgrammingError("Don't call readDataFile when not in Desktop");
                return [2 /*return*/, this.fileFacade.readDataFile(uriOrPath)];
            });
        });
    };
    /**
     * Generate an MSG file from the mail bundle and save it in the temp export directory
     * @param bundle
     * @param fileName
     * @returns {Promise<*>}
     */
    NativeFileApp.prototype.mailToMsg = function (bundle, fileName) {
        return this.exportFacade.mailToMsg(bundle, fileName);
    };
    /**
     * drag given file names from the temp directory
     * @returns {Promise<*>}
     * @param fileNames: relative paths to files from the export directory
     */
    NativeFileApp.prototype.startNativeDrag = function (fileNames) {
        return this.exportFacade.startNativeDrag(fileNames);
    };
    NativeFileApp.prototype.saveToExportDir = function (file) {
        return this.exportFacade.saveToExportDir(file);
    };
    NativeFileApp.prototype.checkFileExistsInExportDir = function (path) {
        return this.exportFacade.checkFileExistsInExportDir(path);
    };
    NativeFileApp.prototype.getFilesMetaData = function (filesUris) {
        var _this = this;
        return (0, tutanota_utils_1.promiseMap)(filesUris, function (uri) { return __awaiter(_this, void 0, void 0, function () {
            var _a, name, mimeType, size;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all([this.getName(uri), this.getMimeType(uri), this.getSize(uri)])];
                    case 1:
                        _a = _b.sent(), name = _a[0], mimeType = _a[1], size = _a[2];
                        return [2 /*return*/, {
                                _type: "FileReference",
                                name: name,
                                mimeType: mimeType,
                                size: size,
                                location: uri
                            }];
                }
            });
        }); });
    };
    NativeFileApp.prototype.uriToFileRef = function (uri) {
        return Promise.all([this.getName(uri), this.getMimeType(uri), this.getSize(uri)]).then(function (_a) {
            var name = _a[0], mimeType = _a[1], size = _a[2];
            return ({
                _type: "FileReference",
                name: name,
                mimeType: mimeType,
                size: size,
                location: uri
            });
        });
    };
    /**
     * Joins the given files into one single file with a given name. The file is place in the app's temporary decrypted directory.
     * @param filename the resulting filename
     * @param files The files to join.
     *
     */
    NativeFileApp.prototype.joinFiles = function (filename, files) {
        return this.fileFacade.joinFiles(filename, files);
    };
    /**
     * Splits the given file into chunks of the given maximum size. The chunks will be placed in the temporary decrypted directory.
     * @param fileUri
     * @param maxChunkSizeBytes
     */
    NativeFileApp.prototype.splitFile = function (fileUri, maxChunkSizeBytes) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.fileFacade.splitFile(fileUri, maxChunkSizeBytes)];
            });
        });
    };
    return NativeFileApp;
}());
exports.NativeFileApp = NativeFileApp;
