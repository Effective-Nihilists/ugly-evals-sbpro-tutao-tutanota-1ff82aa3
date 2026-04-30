"use strict";
exports.__esModule = true;
exports.isFileReference = exports.isDataFile = exports.isTutanotaFile = exports.isReservedFilename = exports.deduplicateFilenames = exports.sanitizeFilename = exports.unreserveFileName = exports.getFileBaseName = exports.getFileExtension = void 0;
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var TypeRefs_js_1 = require("../../entities/tutanota/TypeRefs.js");
var _false = function () { return false; };
/**
 * Get the file extension of a filename
 * so
 *  file.txt -> .txt
 *  archive.tar.gz -> .tar.gz
 * @param fileName
 */
function getFileExtension(fileName) {
    return (fileName.match(/\..+$/) || [""])[0];
}
exports.getFileExtension = getFileExtension;
/**
 * The inverse of getTrailingFileExtension
 * @param fileName
 */
function getFileBaseName(fileName) {
    var extension = getFileExtension(fileName);
    return fileName.substr(0, extension ? fileName.lastIndexOf(extension) : fileName.length);
}
exports.getFileBaseName = getFileBaseName;
function unreserveFileName(fileName) {
    if (fileName === "." || fileName === "..") {
        return "".concat(fileName, "_");
    }
    // CON, CON.txt, COM0 etc. (windows device files)
    var winReservedRe = /^(CON|PRN|LPT[0-9]|COM[0-9]|AUX|NUL)($|\..*$)/i;
    var extension = getFileExtension(fileName);
    var baseName = getFileBaseName(fileName);
    return env.platformId === "win32" && winReservedRe.test(baseName) ? "".concat(baseName, "_").concat(extension) : fileName;
}
exports.unreserveFileName = unreserveFileName;
/**
 * removes invalid characters from the given filename
 * by replacing them with underscores (non-platform-specific)
 */
function sanitizeFilename(filename) {
    // / ? < > \ : * | "
    var illegalRe = /[\/\?<>\\:\*\|"]/g;
    // unicode control codes
    var controlRe = /[\x00-\x1f\x80-\x9f]/g;
    // trailing period in windows file names
    // this is valid in linux but can't be checked from the browser
    var windowsTrailingRe = /[\. ]+$/;
    return unreserveFileName(filename).replace(illegalRe, "_").replace(controlRe, "_").replace(windowsTrailingRe, "_");
}
exports.sanitizeFilename = sanitizeFilename;
/**
 * Uniqueify all the names in fileNames, case-insensitively
 * @param filenames
 * @param _taken: file names that are taken but won't be included in the output
 */
function deduplicateFilenames(filenames, _taken) {
    if (_taken === void 0) { _taken = new Set(); }
    // make taken lowercase aswell for case insensitivity
    var taken = new Set(Array.from(_taken).map(tutanota_utils_1.toLowerCase));
    // Check first if we need to do a deduplication
    var deduplicatedNames = new Set(filenames.map(tutanota_utils_1.toLowerCase));
    // None of the filenames were duplicated or taken
    if (deduplicatedNames.size === filenames.length && (0, tutanota_utils_1.intersection)(deduplicatedNames, taken).size === 0) {
        // if all file names are good then just return an identity map
        return Object.fromEntries(filenames.map(function (f) { return [f, [f]]; })); // convert into map oldname -> [newname]
    }
    var suffix = function (name, number) {
        var basename = name.substring(0, name.indexOf(".")) || name;
        // get the file extension or an empty string
        var ext = (name.match(/\..+$/) || [""])[0];
        return "".concat(basename, " (").concat(number, ")").concat(ext);
    };
    // do the deduplication
    var out = {};
    var duplicateCounts = {};
    for (var _i = 0, filenames_1 = filenames; _i < filenames_1.length; _i++) {
        var name_1 = filenames_1[_i];
        var lower = name_1.toLowerCase();
        var dedupName = void 0;
        if (duplicateCounts[lower] === undefined) {
            duplicateCounts[lower] = 0;
            dedupName = taken.has(lower) ? suffix(name_1, ++duplicateCounts[lower]) : name_1;
        }
        else {
            dedupName = suffix(name_1, ++duplicateCounts[lower]);
        }
        if (!out[name_1]) {
            out[name_1] = [];
        }
        out[name_1].push(dedupName);
    }
    return out;
}
exports.deduplicateFilenames = deduplicateFilenames;
/**
 * checks if the given filename is a reserved filename on the current platform
 * @param filename
 * @returns {boolean}
 * @private
 */
function isReservedFilename(filename) {
    // CON, CON.txt, COM0 etc. (windows device files)
    var winReservedRe = /^(CON|PRN|LPT[0-9]|COM[0-9]|AUX|NUL)($|\..*$)/i;
    // .. and .
    var reservedRe = /^\.{1,2}$/;
    return (env.platformId === "win32" && winReservedRe.test(filename)) || reservedRe.test(filename);
}
exports.isReservedFilename = isReservedFilename;
function isTutanotaFile(file) {
    return file._type
        && file._type.hasOwnProperty("app")
        && file._type.hasOwnProperty("type")
        && (0, tutanota_utils_1.isSameTypeRef)((0, tutanota_utils_1.downcast)(file._type), TypeRefs_js_1.FileTypeRef);
}
exports.isTutanotaFile = isTutanotaFile;
function isDataFile(file) {
    return file._type === "DataFile";
}
exports.isDataFile = isDataFile;
function isFileReference(file) {
    return file._type === "FileReference";
}
exports.isFileReference = isFileReference;
