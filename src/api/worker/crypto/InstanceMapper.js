"use strict";
exports.__esModule = true;
exports.decryptValue = exports.encryptValue = exports.InstanceMapper = void 0;
var EntityFunctions_1 = require("../../common/EntityFunctions");
var ProgrammingError_1 = require("../../common/error/ProgrammingError");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var EntityConstants_1 = require("../../common/EntityConstants");
var Compression_1 = require("../Compression");
var tutanota_utils_2 = require("@tutao/tutanota-utils");
var tutanota_utils_3 = require("@tutao/tutanota-utils");
var tutanota_utils_4 = require("@tutao/tutanota-utils");
var Env_1 = require("../../common/Env");
var tutanota_crypto_1 = require("@tutao/tutanota-crypto");
(0, Env_1.assertWorkerOrNode)();
var InstanceMapper = /** @class */ (function () {
    function InstanceMapper() {
    }
    /**
     * Decrypts an object literal as received from the DB and maps it to an entity class (e.g. Mail)
     * @param model The TypeModel of the instance
     * @param instance The object literal as received from the DB
     * @param sk The session key, must be provided for encrypted instances
     * @returns The decrypted and mapped instance
     */
    InstanceMapper.prototype.decryptAndMapToInstance = function (model, instance, sk) {
        var _this = this;
        var decrypted = {
            _type: new tutanota_utils_2.TypeRef(model.app, model.name)
        };
        for (var _i = 0, _a = Object.keys(model.values); _i < _a.length; _i++) {
            var key = _a[_i];
            var valueType = model.values[key];
            var value = instance[key];
            try {
                decrypted[key] = decryptValue(key, valueType, value, sk);
            }
            catch (e) {
                if (decrypted._errors == null) {
                    decrypted._errors = {};
                }
                decrypted._errors[key] = JSON.stringify(e);
                console.log("error when decrypting value on type:", "[".concat(model.app, ",").concat(model.name, "]"), "key:", key);
            }
            finally {
                if (valueType.encrypted) {
                    if (valueType.final) {
                        // we have to store the encrypted value to be able to restore it when updating the instance. this is not needed for data transfer types, but it does not hurt
                        decrypted["_finalEncrypted_" + key] = value;
                    }
                    else if (value === "") {
                        // we have to store the default value to make sure that updates do not cause more storage use
                        decrypted["_defaultEncrypted_" + key] = decrypted[key];
                    }
                }
            }
        }
        return (0, tutanota_utils_3.promiseMap)(Object.keys(model.associations), function (associationName) {
            if (model.associations[associationName].type === EntityConstants_1.AssociationType.Aggregation) {
                var dependency = model.associations[associationName].dependency;
                return (0, EntityFunctions_1.resolveTypeReference)(new tutanota_utils_2.TypeRef(dependency || model.app, model.associations[associationName].refType)).then(function (aggregateTypeModel) {
                    var aggregation = model.associations[associationName];
                    if (aggregation.cardinality === EntityConstants_1.Cardinality.ZeroOrOne && instance[associationName] == null) {
                        decrypted[associationName] = null;
                    }
                    else if (instance[associationName] == null) {
                        throw new ProgrammingError_1.ProgrammingError("Undefined aggregation ".concat(model.name, ":").concat(associationName));
                    }
                    else if (aggregation.cardinality === EntityConstants_1.Cardinality.Any) {
                        return (0, tutanota_utils_3.promiseMap)(instance[associationName], function (aggregate) {
                            return _this.decryptAndMapToInstance(aggregateTypeModel, (0, tutanota_utils_1.downcast)(aggregate), sk);
                        }).then(function (decryptedAggregates) {
                            decrypted[associationName] = decryptedAggregates;
                        });
                    }
                    else {
                        return _this.decryptAndMapToInstance(aggregateTypeModel, instance[associationName], sk).then(function (decryptedAggregate) {
                            decrypted[associationName] = decryptedAggregate;
                        });
                    }
                });
            }
            else {
                decrypted[associationName] = instance[associationName];
            }
        }).then(function () {
            return decrypted;
        });
    };
    InstanceMapper.prototype.encryptAndMapToLiteral = function (model, instance, sk) {
        var _this = this;
        var encrypted = {};
        var i = instance;
        for (var _i = 0, _a = Object.keys(model.values); _i < _a.length; _i++) {
            var key = _a[_i];
            var valueType = model.values[key];
            var value = i[key];
            // restore the original encrypted value if it exists. it does not exist if this is a data transfer type or a newly created entity. check against null explicitely because "" is allowed
            if (valueType.encrypted && valueType.final && i["_finalEncrypted_" + key] != null) {
                encrypted[key] = i["_finalEncrypted_" + key];
            }
            else if (valueType.encrypted && i["_defaultEncrypted_" + key] === value) {
                // restore the default encrypted value because it has not changed
                encrypted[key] = "";
            }
            else {
                encrypted[key] = encryptValue(key, valueType, value, sk);
            }
        }
        if (model.type === EntityConstants_1.Type.Aggregated && !encrypted._id) {
            encrypted._id = (0, tutanota_utils_1.base64ToBase64Url)((0, tutanota_utils_1.uint8ArrayToBase64)(tutanota_crypto_1.random.generateRandomData(4)));
        }
        return (0, tutanota_utils_3.promiseMap)(Object.keys(model.associations), function (associationName) {
            if (model.associations[associationName].type === EntityConstants_1.AssociationType.Aggregation) {
                var dependency = model.associations[associationName].dependency;
                return (0, EntityFunctions_1.resolveTypeReference)(new tutanota_utils_2.TypeRef(dependency || model.app, model.associations[associationName].refType)).then(function (aggregateTypeModel) {
                    var aggregation = model.associations[associationName];
                    if (aggregation.cardinality === EntityConstants_1.Cardinality.ZeroOrOne && i[associationName] == null) {
                        encrypted[associationName] = null;
                    }
                    else if (i[associationName] == null) {
                        throw new ProgrammingError_1.ProgrammingError("Undefined attribute ".concat(model.name, ":").concat(associationName));
                    }
                    else if (aggregation.cardinality === EntityConstants_1.Cardinality.Any) {
                        return (0, tutanota_utils_3.promiseMap)(i[associationName], function (aggregate) {
                            return _this.encryptAndMapToLiteral(aggregateTypeModel, aggregate, sk);
                        }).then(function (encryptedAggregates) {
                            encrypted[associationName] = encryptedAggregates;
                        });
                    }
                    else {
                        return _this.encryptAndMapToLiteral(aggregateTypeModel, i[associationName], sk).then(function (encryptedAggregate) {
                            encrypted[associationName] = encryptedAggregate;
                        });
                    }
                });
            }
            else {
                encrypted[associationName] = i[associationName];
            }
        }).then(function () {
            return encrypted;
        });
    };
    return InstanceMapper;
}());
exports.InstanceMapper = InstanceMapper;
// Exported for testing
function encryptValue(valueName, valueType, value, sk) {
    if (valueName === "_id" || valueName === "_permissions") {
        return value;
    }
    else if (value == null) {
        if (valueType.cardinality === EntityConstants_1.Cardinality.ZeroOrOne) {
            return null;
        }
        else {
            throw new ProgrammingError_1.ProgrammingError("Value ".concat(valueName, " with cardinality ONE can not be null"));
        }
    }
    else if (valueType.encrypted) {
        var bytes = value;
        if (valueType.type !== EntityConstants_1.ValueType.Bytes) {
            var dbType = (0, tutanota_utils_4.assertNotNull)(convertJsToDbType(valueType.type, value));
            bytes = typeof dbType === "string" ? (0, tutanota_utils_1.stringToUtf8Uint8Array)(dbType) : dbType;
        }
        return (0, tutanota_utils_1.uint8ArrayToBase64)((0, tutanota_crypto_1.aes128Encrypt)((0, tutanota_utils_4.assertNotNull)(sk), bytes, tutanota_crypto_1.random.generateRandomData(tutanota_crypto_1.IV_BYTE_LENGTH), true, tutanota_crypto_1.ENABLE_MAC));
    }
    else {
        var dbType = convertJsToDbType(valueType.type, value);
        if (typeof dbType === "string") {
            return dbType;
        }
        else {
            return (0, tutanota_utils_1.uint8ArrayToBase64)(dbType);
        }
    }
}
exports.encryptValue = encryptValue;
// Exported for testing
function decryptValue(valueName, valueType, value, sk) {
    if (value == null) {
        if (valueType.cardinality === EntityConstants_1.Cardinality.ZeroOrOne) {
            return null;
        }
        else {
            throw new ProgrammingError_1.ProgrammingError("Value ".concat(valueName, " with cardinality ONE can not be null"));
        }
    }
    else if (valueType.cardinality === EntityConstants_1.Cardinality.One && value === "") {
        return valueToDefault(valueType.type); // Migration for values added after the Type has been defined initially
    }
    else if (valueType.encrypted) {
        var decryptedBytes = (0, tutanota_crypto_1.aes128Decrypt)(sk, (0, tutanota_utils_1.base64ToUint8Array)(value));
        if (valueType.type === EntityConstants_1.ValueType.Bytes) {
            return decryptedBytes;
        }
        else if (valueType.type === EntityConstants_1.ValueType.CompressedString) {
            return decompressString(decryptedBytes);
        }
        else {
            return convertDbToJsType(valueType.type, (0, tutanota_utils_1.utf8Uint8ArrayToString)(decryptedBytes));
        }
    }
    else {
        return convertDbToJsType(valueType.type, value);
    }
}
exports.decryptValue = decryptValue;
/**
 * Returns bytes when the type === Bytes or type === CompressedString, otherwise returns a string
 * @param type
 * @param value
 * @returns {string|string|NodeJS.Global.Uint8Array|*}
 */
function convertJsToDbType(type, value) {
    if (type === EntityConstants_1.ValueType.Bytes && value != null) {
        return value;
    }
    else if (type === EntityConstants_1.ValueType.Boolean) {
        return value ? "1" : "0";
    }
    else if (type === EntityConstants_1.ValueType.Date) {
        return value.getTime().toString();
    }
    else if (type === EntityConstants_1.ValueType.CompressedString) {
        return compressString(value);
    }
    else {
        return value;
    }
}
function convertDbToJsType(type, value) {
    if (type === EntityConstants_1.ValueType.Bytes) {
        return (0, tutanota_utils_1.base64ToUint8Array)(value);
    }
    else if (type === EntityConstants_1.ValueType.Boolean) {
        return value !== "0";
    }
    else if (type === EntityConstants_1.ValueType.Date) {
        return new Date(parseInt(value));
    }
    else if (type === EntityConstants_1.ValueType.CompressedString) {
        return decompressString((0, tutanota_utils_1.base64ToUint8Array)(value));
    }
    else {
        return value;
    }
}
function compressString(uncompressed) {
    return (0, Compression_1.compress)((0, tutanota_utils_1.stringToUtf8Uint8Array)(uncompressed));
}
function decompressString(compressed) {
    if (compressed.length === 0) {
        return "";
    }
    var output = (0, Compression_1.uncompress)(compressed);
    return (0, tutanota_utils_1.utf8Uint8ArrayToString)(output);
}
function valueToDefault(type) {
    switch (type) {
        case EntityConstants_1.ValueType.String:
            return "";
        case EntityConstants_1.ValueType.Number:
            return "0";
        case EntityConstants_1.ValueType.Bytes:
            return new Uint8Array(0);
        case EntityConstants_1.ValueType.Date:
            return new Date();
        case EntityConstants_1.ValueType.Boolean:
            return false;
        case EntityConstants_1.ValueType.CompressedString:
            return "";
        default:
            throw new ProgrammingError_1.ProgrammingError("".concat(type, " is not a valid value type"));
    }
}
