"use strict";
exports.__esModule = true;
exports.isElementEntity = exports.isValidGeneratedId = exports.generatedIdToTimestamp = exports.timestampToGeneratedId = exports.timestampToHexGeneratedId = exports.create = exports.customIdToString = exports.uint8arrayToCustomId = exports.stringToCustomId = exports.elementIdPart = exports.listIdPart = exports.getListId = exports.getElementId = exports.getLetId = exports.getEtId = exports.containsId = exports.haveSameId = exports.isSameId = exports.sortCompareById = exports.sortCompareByReverseId = exports.compareOldestFirst = exports.compareNewestFirst = exports.firstBiggerThanSecond = exports.POST_MULTIPLE_LIMIT = exports.LOAD_MULTIPLE_LIMIT = exports.RANGE_ITEM_LIMIT = exports.CUSTOM_MAX_ID = exports.CUSTOM_MIN_ID = exports.GENERATED_ID_BYTES_LENGTH = exports.GENERATED_MIN_ID = exports.GENERATED_MAX_ID = void 0;
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var EntityConstants_1 = require("../EntityConstants");
/**
 * the maximum ID for elements stored on the server (number with the length of 10 bytes) => 2^80 - 1
 */
exports.GENERATED_MAX_ID = "zzzzzzzzzzzz";
/**
 *
 */
/**
 * The minimum ID for elements with generated id stored on the server
 */
exports.GENERATED_MIN_ID = "------------";
/**
 * The byte length of a generated id
 */
exports.GENERATED_ID_BYTES_LENGTH = 9;
/**
 * The minimum ID for elements with custom id stored on the server
 */
exports.CUSTOM_MIN_ID = "";
/**
 * the maximum custom element id is enforced to be less than 256 bytes on the server. decoding this as b64url gives 255 bytes.
 *
 * NOTE: this is currently only used as a marker value when caching calendar events.
 */
exports.CUSTOM_MAX_ID = "_______________________________________________________________________________________________________________________________________________________" +
    "_______________________________________________________________________________________________________________________________________________________" +
    "______________________________________";
exports.RANGE_ITEM_LIMIT = 1000;
exports.LOAD_MULTIPLE_LIMIT = 100;
exports.POST_MULTIPLE_LIMIT = 100;
/**
 * Tests if one id is bigger than another.
 * For generated IDs we use base64ext which is sortable.
 * For custom IDs we use base64url which is not sortable, so we convert them to string before comparing.
 * Important: using this for custom IDs works only with custom IDs which are derived from strings.
 *
 * @param firstId The element id that is tested if it is bigger.
 * @param secondId The element id that is tested against.
 * @param typeModel optional - the type the Ids belong to. this can be used to compare custom IDs.
 * @return True if firstId is bigger than secondId, false otherwise.
 */
function firstBiggerThanSecond(firstId, secondId, typeModel) {
    if ((typeModel === null || typeModel === void 0 ? void 0 : typeModel.values._id.type) === EntityConstants_1.ValueType.CustomId) {
        return firstBiggerThanSecond(customIdToString(firstId), customIdToString(secondId));
    }
    else {
        // if the number of digits is bigger, then the id is bigger, otherwise we can use the lexicographical comparison
        if (firstId.length > secondId.length) {
            return true;
        }
        else if (secondId.length > firstId.length) {
            return false;
        }
        else {
            return firstId > secondId;
        }
    }
}
exports.firstBiggerThanSecond = firstBiggerThanSecond;
function compareNewestFirst(id1, id2) {
    var firstId = id1 instanceof Array ? id1[1] : id1;
    var secondId = id2 instanceof Array ? id2[1] : id2;
    if (firstId === secondId) {
        return 0;
    }
    else {
        return firstBiggerThanSecond(firstId, secondId) ? -1 : 1;
    }
}
exports.compareNewestFirst = compareNewestFirst;
function compareOldestFirst(id1, id2) {
    var firstId = id1 instanceof Array ? id1[1] : id1;
    var secondId = id2 instanceof Array ? id2[1] : id2;
    if (firstId === secondId) {
        return 0;
    }
    else {
        return firstBiggerThanSecond(firstId, secondId) ? 1 : -1;
    }
}
exports.compareOldestFirst = compareOldestFirst;
function sortCompareByReverseId(entity1, entity2) {
    return compareNewestFirst(getElementId(entity1), getElementId(entity2));
}
exports.sortCompareByReverseId = sortCompareByReverseId;
function sortCompareById(entity1, entity2) {
    return compareOldestFirst(getElementId(entity1), getElementId(entity2));
}
exports.sortCompareById = sortCompareById;
/**
 * Compares the ids of two elements.
 * @pre Both entities are either ElementTypes or ListElementTypes
 * @param id1
 * @param id2
 * @returns True if the ids are the same, false otherwise
 */
function isSameId(id1, id2) {
    if (id1 === null || id2 === null) {
        return false;
    }
    else if (id1 instanceof Array && id2 instanceof Array) {
        return id1[0] === id2[0] && id1[1] === id2[1];
    }
    else {
        return id1 === id2;
    }
}
exports.isSameId = isSameId;
function haveSameId(entity1, entity2) {
    return isSameId(entity1._id, entity2._id);
}
exports.haveSameId = haveSameId;
function containsId(ids, id) {
    return ids.find(function (idInArray) { return isSameId(idInArray, id); }) != null;
}
exports.containsId = containsId;
function getEtId(entity) {
    return entity._id;
}
exports.getEtId = getEtId;
function getLetId(entity) {
    if (typeof entity._id === "undefined") {
        throw new Error("listId is not defined for " + (typeof entity._type === "undefined" ? JSON.stringify(entity) : entity));
    }
    return entity._id;
}
exports.getLetId = getLetId;
function getElementId(entity) {
    return elementIdPart(getLetId(entity));
}
exports.getElementId = getElementId;
function getListId(entity) {
    return listIdPart(getLetId(entity));
}
exports.getListId = getListId;
function listIdPart(id) {
    return id[0];
}
exports.listIdPart = listIdPart;
function elementIdPart(id) {
    return id[1];
}
exports.elementIdPart = elementIdPart;
/**
 * Converts a string to a custom id. Attention: the custom id must be intended to be derived from a string.
 */
function stringToCustomId(string) {
    return uint8arrayToCustomId((0, tutanota_utils_1.stringToUtf8Uint8Array)(string));
}
exports.stringToCustomId = stringToCustomId;
function uint8arrayToCustomId(array) {
    return (0, tutanota_utils_1.base64ToBase64Url)((0, tutanota_utils_1.uint8ArrayToBase64)(array));
}
exports.uint8arrayToCustomId = uint8arrayToCustomId;
/**
 * Converts a custom id to a string. Attention: the custom id must be intended to be derived from a string.
 */
function customIdToString(customId) {
    return (0, tutanota_utils_1.utf8Uint8ArrayToString)((0, tutanota_utils_1.base64ToUint8Array)((0, tutanota_utils_1.base64UrlToBase64)(customId)));
}
exports.customIdToString = customIdToString;
function create(typeModel, typeRef) {
    var i = {
        _type: typeRef
    };
    if (typeModel.type === EntityConstants_1.Type.Element || typeModel.type === EntityConstants_1.Type.ListElement) {
        ;
        i._errors = {};
    }
    for (var _i = 0, _a = Object.keys(typeModel.values); _i < _a.length; _i++) {
        var valueName = _a[_i];
        var value = typeModel.values[valueName];
        i[valueName] = _getDefaultValue(valueName, value);
    }
    for (var _b = 0, _c = Object.keys(typeModel.associations); _b < _c.length; _b++) {
        var associationName = _c[_b];
        var association = typeModel.associations[associationName];
        if (association.cardinality === EntityConstants_1.Cardinality.Any) {
            i[associationName] = [];
        }
        else {
            i[associationName] = null; // set to null even if the cardinality is One
        }
    }
    return i;
}
exports.create = create;
function _getDefaultValue(valueName, value) {
    if (valueName === "_format") {
        return "0";
    }
    else if (valueName === "_id") {
        return null; // aggregate ids are set in the worker, list ids must be set explicitely and element ids are created on the server
    }
    else if (valueName === "_permissions") {
        return null;
    }
    else if (value.cardinality === EntityConstants_1.Cardinality.ZeroOrOne) {
        return null;
    }
    else {
        switch (value.type) {
            case EntityConstants_1.ValueType.Bytes:
                return new Uint8Array(0);
            case EntityConstants_1.ValueType.Date:
                return new Date();
            case EntityConstants_1.ValueType.Number:
                return "0";
            case EntityConstants_1.ValueType.String:
                return "";
            case EntityConstants_1.ValueType.Boolean:
                return false;
            case EntityConstants_1.ValueType.CustomId:
            case EntityConstants_1.ValueType.GeneratedId:
                return null;
            // we have to use null although the value must be set to something different
        }
    }
    throw new Error("no default value for ".concat(JSON.stringify(value)));
}
/**
 * Converts a timestamp number to a GeneratedId (the counter is set to zero) in hex format.
 *
 * @param timestamp The timestamp of the GeneratedId
 * @return The GeneratedId as hex string.
 */
function timestampToHexGeneratedId(timestamp, serverBytes) {
    var id = timestamp * 4; // shifted 2 bits left, so the value covers 44 bits overall (42 timestamp + 2 shifted)
    var hex = id.toString(16) + "00000" + (0, tutanota_utils_1.pad)(serverBytes, 2); // add one zero for the missing 4 bits plus 4 more (2 bytes) plus 2 more for the server id to get 9 bytes
    // add leading zeros to reach 9 bytes (GeneratedId length) = 18 hex
    for (var length_1 = hex.length; length_1 < 18; length_1++) {
        hex = "0" + hex;
    }
    return hex;
}
exports.timestampToHexGeneratedId = timestampToHexGeneratedId;
/**
 * Converts a timestamp number to a GeneratedId (the counter and server bits are set to zero).
 *
 * @param timestamp The timestamp of the GeneratedId
 * @return The GeneratedId.
 */
function timestampToGeneratedId(timestamp, serverBytes) {
    if (serverBytes === void 0) { serverBytes = 0; }
    var hex = timestampToHexGeneratedId(timestamp, serverBytes);
    return (0, tutanota_utils_1.base64ToBase64Ext)((0, tutanota_utils_1.hexToBase64)(hex));
}
exports.timestampToGeneratedId = timestampToGeneratedId;
/**
 * Extracts the timestamp from a GeneratedId
 * @param base64Ext The id as base64Ext
 * @returns The timestamp of the GeneratedId
 */
function generatedIdToTimestamp(base64Ext) {
    var base64 = (0, tutanota_utils_1.base64ExtToBase64)(base64Ext);
    var decodedbB4 = atob(base64);
    var numberResult = 0;
    // Timestamp is in the first 42 bits
    for (var i = 0; i < 5; i++) {
        // We "shift" each number by 8 bits to the left: numberResult << 8
        numberResult = numberResult * 256;
        numberResult += decodedbB4.charCodeAt(i);
    }
    // We need to shift the whole number to the left by 2 bits (because 42 bits is encoded in 6 bytes)
    numberResult = numberResult * 4;
    // We take only last two highest bits from the last byte
    numberResult += decodedbB4.charCodeAt(5) >>> 6;
    return numberResult;
}
exports.generatedIdToTimestamp = generatedIdToTimestamp;
// We can't import EntityUtils here, otherwise we should say GENERATED_MAX_ID.length or something like it
var base64extEncodedIdLength = 12;
var base64extAlphabet = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";
function isValidGeneratedId(id) {
    var test = function (id) { return id.length === base64extEncodedIdLength && Array.from(id).every(function (char) { return base64extAlphabet.includes(char); }); };
    return typeof id === "string" ? test(id) : id.every(test);
}
exports.isValidGeneratedId = isValidGeneratedId;
function isElementEntity(e) {
    return typeof e._id === "string";
}
exports.isElementEntity = isElementEntity;
