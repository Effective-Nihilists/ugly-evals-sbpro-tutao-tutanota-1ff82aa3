"use strict";
exports.__esModule = true;
exports.shouldMeasure = exports.markEnd = exports.markStart = exports.printMeasure = exports.compareMetaEntriesOldest = exports.getIdFromEncSearchIndexEntry = exports.getPerformanceTimestamp = exports.htmlToText = exports._createNewIndexUpdate = exports.filterMailMemberships = exports.filterIndexMemberships = exports.userIsGlobalAdmin = exports.userIsLocalOrGlobalAdmin = exports.typeRefToTypeInfo = exports.decryptMetaData = exports.encryptMetaData = exports.decryptSearchIndexEntry = exports.encryptSearchIndexEntry = exports.decryptIndexKey = exports.encryptIndexKeyUint8Array = exports.encryptIndexKeyBase64 = void 0;
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var TutanotaConstants_1 = require("../../common/TutanotaConstants");
var SearchIndexEncoding_1 = require("./SearchIndexEncoding");
var TypeModels_1 = require("../../entities/sys/TypeModels");
var TypeModels_2 = require("../../entities/tutanota/TypeModels");
var Env_1 = require("../../common/Env");
var tutanota_crypto_1 = require("@tutao/tutanota-crypto");
function encryptIndexKeyBase64(key, indexKey, dbIv) {
    return (0, tutanota_utils_1.uint8ArrayToBase64)(encryptIndexKeyUint8Array(key, indexKey, dbIv));
}
exports.encryptIndexKeyBase64 = encryptIndexKeyBase64;
function encryptIndexKeyUint8Array(key, indexKey, dbIv) {
    return (0, tutanota_crypto_1.aes256Encrypt)(key, (0, tutanota_utils_1.stringToUtf8Uint8Array)(indexKey), dbIv, true, false).slice(dbIv.length);
}
exports.encryptIndexKeyUint8Array = encryptIndexKeyUint8Array;
function decryptIndexKey(key, encIndexKey, dbIv) {
    return (0, tutanota_utils_1.utf8Uint8ArrayToString)((0, tutanota_crypto_1.aes256Decrypt)(key, (0, tutanota_utils_1.concat)(dbIv, encIndexKey), true, false));
}
exports.decryptIndexKey = decryptIndexKey;
function encryptSearchIndexEntry(key, entry, encryptedInstanceId) {
    var searchIndexEntryNumberValues = [entry.attribute].concat(entry.positions);
    var neededSpace = (0, SearchIndexEncoding_1.calculateNeededSpaceForNumbers)(searchIndexEntryNumberValues);
    var block = new Uint8Array(neededSpace);
    (0, SearchIndexEncoding_1.encodeNumbers)(searchIndexEntryNumberValues, block, 0);
    var encData = (0, tutanota_crypto_1.aes256Encrypt)(key, block, tutanota_crypto_1.random.generateRandomData(tutanota_crypto_1.IV_BYTE_LENGTH), true, false);
    var resultArray = new Uint8Array(encryptedInstanceId.length + encData.length);
    resultArray.set(encryptedInstanceId);
    resultArray.set(encData, 16);
    return resultArray;
}
exports.encryptSearchIndexEntry = encryptSearchIndexEntry;
function decryptSearchIndexEntry(key, entry, dbIv) {
    var encId = getIdFromEncSearchIndexEntry(entry);
    var id = decryptIndexKey(key, encId, dbIv);
    var data = (0, tutanota_crypto_1.aes256Decrypt)(key, entry.subarray(16), true, false);
    var offset = 0;
    var attribute = (0, SearchIndexEncoding_1.decodeNumberBlock)(data, offset);
    offset += (0, SearchIndexEncoding_1.calculateNeededSpaceForNumber)(attribute);
    var positions = (0, SearchIndexEncoding_1.decodeNumbers)(data, offset);
    return {
        id: id,
        encId: encId,
        attribute: attribute,
        positions: positions
    };
}
exports.decryptSearchIndexEntry = decryptSearchIndexEntry;
var metaEntryFieldsNumber = 5;
function encryptMetaData(key, metaData) {
    var numbers = new Array(metaData.rows.length * metaEntryFieldsNumber);
    for (var i = 0; i < metaData.rows.length; i++) {
        var entry = metaData.rows[i];
        var offset = i * metaEntryFieldsNumber;
        numbers[offset] = entry.app;
        numbers[offset + 1] = entry.type;
        numbers[offset + 2] = entry.key;
        numbers[offset + 3] = entry.size;
        numbers[offset + 4] = entry.oldestElementTimestamp;
    }
    var numberBlock = new Uint8Array((0, SearchIndexEncoding_1.calculateNeededSpaceForNumbers)(numbers));
    (0, SearchIndexEncoding_1.encodeNumbers)(numbers, numberBlock);
    var encryptedRows = (0, tutanota_crypto_1.aes256Encrypt)(key, numberBlock, tutanota_crypto_1.random.generateRandomData(tutanota_crypto_1.IV_BYTE_LENGTH), true, false);
    return {
        id: metaData.id,
        word: metaData.word,
        rows: encryptedRows
    };
}
exports.encryptMetaData = encryptMetaData;
function decryptMetaData(key, encryptedMeta) {
    // Initially we write empty data block there. In this case we can't get IV from it and decrypt it
    if (encryptedMeta.rows.length === 0) {
        return {
            id: encryptedMeta.id,
            word: encryptedMeta.word,
            rows: []
        };
    }
    var numbersBlock = (0, tutanota_crypto_1.aes256Decrypt)(key, encryptedMeta.rows, true, false);
    var numbers = (0, SearchIndexEncoding_1.decodeNumbers)(numbersBlock);
    var rows = [];
    for (var i = 0; i < numbers.length; i += metaEntryFieldsNumber) {
        rows.push({
            app: numbers[i],
            type: numbers[i + 1],
            key: numbers[i + 2],
            size: numbers[i + 3],
            oldestElementTimestamp: numbers[i + 4]
        });
    }
    return {
        id: encryptedMeta.id,
        word: encryptedMeta.word,
        rows: rows
    };
}
exports.decryptMetaData = decryptMetaData;
var typeInfos = {
    tutanota: {
        Mail: {
            appId: 1,
            typeId: TypeModels_2.typeModels.Mail.id,
            attributeIds: getAttributeIds(TypeModels_2.typeModels.Mail)
        },
        Contact: {
            appId: 1,
            typeId: TypeModels_2.typeModels.Contact.id,
            attributeIds: getAttributeIds(TypeModels_2.typeModels.Contact)
        }
    },
    sys: {
        GroupInfo: {
            appId: 0,
            typeId: TypeModels_1.typeModels.GroupInfo.id,
            attributeIds: getAttributeIds(TypeModels_1.typeModels.GroupInfo)
        },
        WhitelabelChild: {
            appId: 0,
            typeId: TypeModels_1.typeModels.WhitelabelChild.id,
            attributeIds: getAttributeIds(TypeModels_1.typeModels.WhitelabelChild)
        }
    }
};
function getAttributeIds(model) {
    return Object.keys(model.values)
        .map(function (name) { return model.values[name].id; })
        .concat(Object.keys(model.associations).map(function (name) { return model.associations[name].id; }));
}
function typeRefToTypeInfo(typeRef) {
    // @ts-ignore
    var app = typeInfos[typeRef.app];
    if (!app) {
        throw new Error("No TypeInfo for app: " + app);
    }
    var typeInfo = app[typeRef.type];
    if (!typeInfo) {
        throw new Error("No TypeInfo for TypeRef ".concat(typeRef.app, " : ").concat(typeRef.type));
    }
    return typeInfo;
}
exports.typeRefToTypeInfo = typeRefToTypeInfo;
function userIsLocalOrGlobalAdmin(user) {
    return user.memberships.find(function (m) { return m.groupType === TutanotaConstants_1.GroupType.Admin || m.groupType === TutanotaConstants_1.GroupType.LocalAdmin; }) != null;
}
exports.userIsLocalOrGlobalAdmin = userIsLocalOrGlobalAdmin;
function userIsGlobalAdmin(user) {
    return user.memberships.find(function (m) { return m.groupType === TutanotaConstants_1.GroupType.Admin; }) != null;
}
exports.userIsGlobalAdmin = userIsGlobalAdmin;
function filterIndexMemberships(user) {
    return user.memberships.filter(function (m) { return m.groupType === TutanotaConstants_1.GroupType.Mail || m.groupType === TutanotaConstants_1.GroupType.Contact || m.groupType === TutanotaConstants_1.GroupType.Customer || m.groupType === TutanotaConstants_1.GroupType.Admin; });
}
exports.filterIndexMemberships = filterIndexMemberships;
function filterMailMemberships(user) {
    return user.memberships.filter(function (m) { return m.groupType === TutanotaConstants_1.GroupType.Mail; });
}
exports.filterMailMemberships = filterMailMemberships;
function _createNewIndexUpdate(typeInfo) {
    return {
        typeInfo: typeInfo,
        create: {
            encInstanceIdToElementData: new Map(),
            indexMap: new Map()
        },
        move: [],
        "delete": {
            searchMetaRowToEncInstanceIds: new Map(),
            encInstanceIds: []
        }
    };
}
exports._createNewIndexUpdate = _createNewIndexUpdate;
function htmlToText(html) {
    if (html == null)
        return "";
    var text = html.replace(/<[^>]*>?/gm, " ");
    return text.replace(/&[#0-9a-zA-Z]+;/g, function (match) {
        var replacement;
        if (match.startsWith("&#")) {
            var charCode = Number(match.substring(2, match.length - 1)); // remove &# and ;
            if (!isNaN(charCode)) {
                replacement = String.fromCharCode(charCode);
            }
        }
        else {
            // @ts-ignore
            replacement = HTML_ENTITIES[match];
        }
        return replacement ? replacement : match;
    });
}
exports.htmlToText = htmlToText;
var HTML_ENTITIES = {
    "&nbsp;": " ",
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&Agrave;": "À",
    "&Aacute;": "Á",
    "&Acirc;": "Â",
    "&Atilde;": "Ã",
    "&Auml;": "Ä",
    "&Aring;": "Å",
    "&AElig;": "Æ",
    "&Ccedil;": "Ç",
    "&Egrave;": "È",
    "&Eacute;": "É",
    "&Ecirc;": "Ê",
    "&Euml;": "Ë",
    "&Igrave;": "Ì",
    "&Iacute;": "Í",
    "&Icirc;": "Î",
    "&Iuml;": "Ï",
    "&ETH;": "Ð",
    "&Ntilde;": "Ñ",
    "&Ograve;": "Ò",
    "&Oacute;": "Ó",
    "&Ocirc;": "Ô",
    "&Otilde;": "Õ",
    "&Ouml;": "Ö",
    "&Oslash;": "Ø",
    "&Ugrave;": "Ù",
    "&Uacute;": "Ú",
    "&Ucirc;": "Û",
    "&Uuml;": "Ü",
    "&Yacute;": "Ý",
    "&THORN;": "Þ",
    "&szlig;": "ß",
    "&agrave;": "à",
    "&aacute;": "á",
    "&acirc;": "â",
    "&atilde;": "ã",
    "&auml;": "ä",
    "&aring;": "å",
    "&aelig;": "æ",
    "&ccedil;": "ç",
    "&egrave;": "è",
    "&eacute;": "é",
    "&ecirc;": "ê",
    "&euml;": "ë",
    "&igrave;": "ì",
    "&iacute;": "í",
    "&icirc;": "î",
    "&iuml;": "ï",
    "&eth;": "ð",
    "&ntilde;": "ñ",
    "&ograve;": "ò",
    "&oacute;": "ó",
    "&ocirc;": "ô",
    "&otilde;": "õ",
    "&ouml;": "ö",
    "&oslash;": "ø",
    "&ugrave;": "ù",
    "&uacute;": "ú",
    "&ucirc;": "û",
    "&uuml;": "ü",
    "&yacute;": "ý",
    "&thorn;": "þ",
    "&yuml;": "ÿ",
    "&Alpha;": "Α",
    "&Beta;": "Β",
    "&Gamma;": "Γ",
    "&Delta;": "Δ",
    "&Epsilon;": "Ε",
    "&Zeta;": "Ζ",
    "&Eta;": "Η",
    "&Theta;": "Θ",
    "&Iota;": "Ι",
    "&Kappa;": "Κ",
    "&Lambda;": "Λ",
    "&Mu;": "Μ",
    "&Nu;": "Ν",
    "&Xi;": "Ξ",
    "&Omicron;": "Ο",
    "&Pi;": "Π",
    "&Rho;": "Ρ",
    "&Sigma;": "Σ",
    "&Tau;": "Τ",
    "&Upsilon;": "Υ",
    "&Phi;": "Φ",
    "&Chi;": "Χ",
    "&Psi;": "Ψ",
    "&Omega;": "Ω",
    "&alpha;": "α",
    "&beta;": "β",
    "&gamma;": "γ",
    "&delta;": "δ",
    "&epsilon;": "ε",
    "&zeta;": "ζ",
    "&eta;": "η",
    "&theta;": "θ",
    "&iota;": "ι",
    "&kappa;": "κ",
    "&lambda;": "λ",
    "&mu;": "μ",
    "&nu;": "ν",
    "&xi;": "ξ",
    "&omicron;": "ο",
    "&pi;": "π",
    "&rho;": "ρ",
    "&sigmaf;": "ς",
    "&sigma;": "σ",
    "&tau;": "τ",
    "&upsilon;": "υ",
    "&phi;": "φ",
    "&chi;": "χ",
    "&psi;": "ψ",
    "&omega;": "ω",
    "&thetasym;": "ϑ",
    "&upsih;": "ϒ",
    "&piv;": "ϖ"
};
function getPerformanceTimestamp() {
    return typeof performance === "undefined" ? Date.now() : performance.now(); // performance is not available in Safari 10 worker scope
}
exports.getPerformanceTimestamp = getPerformanceTimestamp;
function getIdFromEncSearchIndexEntry(entry) {
    return entry.subarray(0, 16);
}
exports.getIdFromEncSearchIndexEntry = getIdFromEncSearchIndexEntry;
function compareMetaEntriesOldest(left, right) {
    return left.oldestElementTimestamp - right.oldestElementTimestamp;
}
exports.compareMetaEntriesOldest = compareMetaEntriesOldest;
function printMeasure(prefix, names) {
    if (!shouldMeasure())
        return;
    for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
        var name_1 = names_1[_i];
        try {
            performance.clearMeasures(name_1);
            performance.clearMarks(name_1 + "-end");
            performance.clearMarks(name_1 + "-start");
        }
        catch (e) {
        }
    }
}
exports.printMeasure = printMeasure;
function markStart(name) {
    shouldMeasure() && performance.mark(name + "-start");
}
exports.markStart = markStart;
function markEnd(name) {
    if (!shouldMeasure())
        return;
    try {
        performance.mark(name + "-end");
        performance.measure(name, name + "-start", name + "-end");
    }
    catch (e) {
    }
}
exports.markEnd = markEnd;
function shouldMeasure() {
    return !env.dist && !(0, Env_1.isTest)();
}
exports.shouldMeasure = shouldMeasure;
