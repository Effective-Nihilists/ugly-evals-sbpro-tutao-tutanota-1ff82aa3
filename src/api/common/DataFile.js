"use strict";
exports.__esModule = true;
exports.getCleanedMimeType = exports.convertToDataFile = exports.createDataFile = void 0;
function createDataFile(name, mimeType, data, cid) {
    return {
        _type: "DataFile",
        name: name,
        mimeType: getCleanedMimeType(mimeType),
        data: data,
        size: data.byteLength,
        id: undefined,
        cid: cid
    };
}
exports.createDataFile = createDataFile;
function convertToDataFile(file, data) {
    var _a;
    if ("_type" in file) {
        return {
            _type: "DataFile",
            name: file.name,
            mimeType: getCleanedMimeType(file.mimeType),
            data: data,
            size: data.byteLength,
            id: file._id,
            cid: (_a = file.cid) !== null && _a !== void 0 ? _a : undefined
        };
    }
    else {
        return {
            _type: "DataFile",
            name: file.name,
            mimeType: getCleanedMimeType(file.type),
            data: data,
            size: data.byteLength,
            id: undefined
        };
    }
}
exports.convertToDataFile = convertToDataFile;
function getCleanedMimeType(mimeType) {
    if (!mimeType || mimeType.trim() === "") {
        return "application/octet-stream";
    }
    else {
        return mimeType.replace(/"/g, "").replace(/'/g, "");
    }
}
exports.getCleanedMimeType = getCleanedMimeType;
