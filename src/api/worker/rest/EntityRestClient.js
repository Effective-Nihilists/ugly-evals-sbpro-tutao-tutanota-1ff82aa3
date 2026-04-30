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
exports.getIds = exports.EntityRestClient = exports.typeRefToPath = void 0;
var EntityFunctions_1 = require("../../common/EntityFunctions");
var SessionKeyNotFoundError_1 = require("../../common/error/SessionKeyNotFoundError");
var TypeRefs_js_1 = require("../../entities/sys/TypeRefs.js");
var RestError_1 = require("../../common/error/RestError");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Env_1 = require("../../common/Env");
var EntityUtils_1 = require("../../common/utils/EntityUtils");
var EntityConstants_1 = require("../../common/EntityConstants");
var SetupMultipleError_1 = require("../../common/error/SetupMultipleError");
var DefaultEntityRestCache_js_1 = require("./DefaultEntityRestCache.js");
var LoginIncompleteError_js_1 = require("../../common/error/LoginIncompleteError.js");
(0, Env_1.assertWorkerOrNode)();
function typeRefToPath(typeRef) {
    return "/rest/".concat(typeRef.app, "/").concat(typeRef.type.toLowerCase());
}
exports.typeRefToPath = typeRefToPath;
/**
 * Retrieves the instances from the backend (db) and converts them to entities.
 *
 * Part of this process is
 * * the decryption for the returned instances (GET) and the encryption of all instances before they are sent (POST, PUT)
 * * the injection of aggregate instances for the returned instances (GET)
 * * caching for retrieved instances (GET)
 *
 */
var EntityRestClient = /** @class */ (function () {
    function EntityRestClient(authDataProvider, restClient, crypto, instanceMapper) {
        this.authDataProvider = authDataProvider;
        this._restClient = restClient;
        this._lazyCrypto = crypto;
        this._instanceMapper = instanceMapper;
    }
    Object.defineProperty(EntityRestClient.prototype, "_crypto", {
        get: function () {
            return this._lazyCrypto();
        },
        enumerable: false,
        configurable: true
    });
    EntityRestClient.prototype.load = function (typeRef, id, queryParameters, extraHeaders) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, listId, elementId, _b, path, queryParams, headers, typeModel, json, entity, migratedEntity, sessionKey, instance;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = (0, DefaultEntityRestCache_js_1.expandId)(id), listId = _a.listId, elementId = _a.elementId;
                        return [4 /*yield*/, this._validateAndPrepareRestRequest(typeRef, listId, elementId, queryParameters, extraHeaders)];
                    case 1:
                        _b = _c.sent(), path = _b.path, queryParams = _b.queryParams, headers = _b.headers, typeModel = _b.typeModel;
                        return [4 /*yield*/, this._restClient.request(path, "GET" /* HttpMethod.GET */, {
                                queryParams: queryParams,
                                headers: headers,
                                responseType: "application/json" /* MediaType.Json */
                            })];
                    case 2:
                        json = _c.sent();
                        entity = JSON.parse(json);
                        return [4 /*yield*/, this._crypto.applyMigrations(typeRef, entity)];
                    case 3:
                        migratedEntity = _c.sent();
                        return [4 /*yield*/, this._crypto.resolveSessionKey(typeModel, migratedEntity)["catch"]((0, tutanota_utils_1.ofClass)(SessionKeyNotFoundError_1.SessionKeyNotFoundError, function (e) {
                                console.log("could not resolve session key", e);
                                return null; // will result in _errors being set on the instance
                            }))];
                    case 4:
                        sessionKey = _c.sent();
                        return [4 /*yield*/, this._instanceMapper.decryptAndMapToInstance(typeModel, migratedEntity, sessionKey)];
                    case 5:
                        instance = _c.sent();
                        return [2 /*return*/, this._crypto.applyMigrationsForInstance(instance)];
                }
            });
        });
    };
    EntityRestClient.prototype.loadRange = function (typeRef, listId, start, count, reverse) {
        return __awaiter(this, void 0, void 0, function () {
            var rangeRequestParams, _a, path, headers, typeModel, queryParams, json;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        rangeRequestParams = {
                            start: String(start),
                            count: String(count),
                            reverse: String(reverse)
                        };
                        return [4 /*yield*/, this._validateAndPrepareRestRequest(typeRef, listId, null, rangeRequestParams, undefined)
                            // This should never happen if type checking is not bypassed with any
                        ];
                    case 1:
                        _a = _b.sent(), path = _a.path, headers = _a.headers, typeModel = _a.typeModel, queryParams = _a.queryParams;
                        // This should never happen if type checking is not bypassed with any
                        if (typeModel.type !== EntityConstants_1.Type.ListElement)
                            throw new Error("only ListElement types are permitted");
                        return [4 /*yield*/, this._restClient.request(path, "GET" /* HttpMethod.GET */, {
                                queryParams: queryParams,
                                headers: headers,
                                responseType: "application/json" /* MediaType.Json */
                            })];
                    case 2:
                        json = _b.sent();
                        return [2 /*return*/, this._handleLoadMultipleResult(typeRef, JSON.parse(json))];
                }
            });
        });
    };
    EntityRestClient.prototype.loadMultiple = function (typeRef, listId, elementIds) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, path, headers, idChunks, loadedChunks;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this._validateAndPrepareRestRequest(typeRef, listId, null, undefined, undefined)];
                    case 1:
                        _a = _b.sent(), path = _a.path, headers = _a.headers;
                        idChunks = (0, tutanota_utils_1.splitInChunks)(EntityUtils_1.LOAD_MULTIPLE_LIMIT, elementIds);
                        return [4 /*yield*/, (0, tutanota_utils_1.promiseMap)(idChunks, function (idChunk) { return __awaiter(_this, void 0, void 0, function () {
                                var queryParams, json;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            queryParams = {
                                                ids: idChunk.join(",")
                                            };
                                            return [4 /*yield*/, this._restClient.request(path, "GET" /* HttpMethod.GET */, {
                                                    queryParams: queryParams,
                                                    headers: headers,
                                                    responseType: "application/json" /* MediaType.Json */
                                                })];
                                        case 1:
                                            json = _a.sent();
                                            return [2 /*return*/, this._handleLoadMultipleResult(typeRef, JSON.parse(json))];
                                    }
                                });
                            }); })];
                    case 2:
                        loadedChunks = _b.sent();
                        return [2 /*return*/, (0, tutanota_utils_1.flat)(loadedChunks)];
                }
            });
        });
    };
    EntityRestClient.prototype._handleLoadMultipleResult = function (typeRef, loadedEntities) {
        return __awaiter(this, void 0, void 0, function () {
            var model;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, EntityFunctions_1.resolveTypeReference)(typeRef)
                        // PushIdentifier was changed in the system model v43 to encrypt the name.
                        // We check here to check the type only once per array and not for each element.
                    ];
                    case 1:
                        model = _a.sent();
                        if (!(0, tutanota_utils_1.isSameTypeRef)(typeRef, TypeRefs_js_1.PushIdentifierTypeRef)) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, tutanota_utils_1.promiseMap)(loadedEntities, function (instance) { return _this._crypto.applyMigrations(typeRef, instance); }, {
                                concurrency: 5
                            })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, (0, tutanota_utils_1.promiseMap)(loadedEntities, function (instance) { return _this._decryptMapAndMigrate(instance, model); }, { concurrency: 5 })];
                }
            });
        });
    };
    EntityRestClient.prototype._decryptMapAndMigrate = function (instance, model) {
        return __awaiter(this, void 0, void 0, function () {
            var sessionKey, e_1, decryptedInstance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this._crypto.resolveSessionKey(model, instance)];
                    case 1:
                        sessionKey = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        if (e_1 instanceof SessionKeyNotFoundError_1.SessionKeyNotFoundError) {
                            console.log("could not resolve session key", e_1);
                            sessionKey = null; // will result in _errors being set on the instance
                        }
                        else {
                            throw e_1;
                        }
                        return [3 /*break*/, 3];
                    case 3: return [4 /*yield*/, this._instanceMapper.decryptAndMapToInstance(model, instance, sessionKey)];
                    case 4:
                        decryptedInstance = _a.sent();
                        return [2 /*return*/, this._crypto.applyMigrationsForInstance(decryptedInstance)];
                }
            });
        });
    };
    EntityRestClient.prototype.setup = function (listId, instance, extraHeaders, options) {
        return __awaiter(this, void 0, void 0, function () {
            var typeRef, _a, typeModel, path, headers, queryParams, sk, encryptedEntity, persistencePostReturn;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        typeRef = instance._type;
                        return [4 /*yield*/, this._validateAndPrepareRestRequest(typeRef, listId, null, undefined, extraHeaders)];
                    case 1:
                        _a = _b.sent(), typeModel = _a.typeModel, path = _a.path, headers = _a.headers, queryParams = _a.queryParams;
                        if (typeModel.type === EntityConstants_1.Type.ListElement) {
                            if (!listId)
                                throw new Error("List id must be defined for LETs");
                        }
                        else {
                            if (listId)
                                throw new Error("List id must not be defined for ETs");
                        }
                        sk = this._crypto.setNewOwnerEncSessionKey(typeModel, instance);
                        return [4 /*yield*/, this._instanceMapper.encryptAndMapToLiteral(typeModel, instance, sk)];
                    case 2:
                        encryptedEntity = _b.sent();
                        return [4 /*yield*/, this._restClient.request(path, "POST" /* HttpMethod.POST */, {
                                baseUrl: options === null || options === void 0 ? void 0 : options.baseUrl,
                                queryParams: queryParams,
                                headers: headers,
                                body: JSON.stringify(encryptedEntity),
                                responseType: "application/json" /* MediaType.Json */
                            })];
                    case 3:
                        persistencePostReturn = _b.sent();
                        return [2 /*return*/, JSON.parse(persistencePostReturn).generatedId];
                }
            });
        });
    };
    EntityRestClient.prototype.setupMultiple = function (listId, instances) {
        return __awaiter(this, void 0, void 0, function () {
            var count, instanceChunks, typeRef, _a, typeModel, path, headers, errors, failedInstances, idChunks;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        count = instances.length;
                        if (count < 1) {
                            return [2 /*return*/, []];
                        }
                        instanceChunks = (0, tutanota_utils_1.splitInChunks)(EntityUtils_1.POST_MULTIPLE_LIMIT, instances);
                        typeRef = instances[0]._type;
                        return [4 /*yield*/, this._validateAndPrepareRestRequest(typeRef, listId, null, undefined, undefined)];
                    case 1:
                        _a = _b.sent(), typeModel = _a.typeModel, path = _a.path, headers = _a.headers;
                        if (typeModel.type === EntityConstants_1.Type.ListElement) {
                            if (!listId)
                                throw new Error("List id must be defined for LETs");
                        }
                        else {
                            if (listId)
                                throw new Error("List id must not be defined for ETs");
                        }
                        errors = [];
                        failedInstances = [];
                        return [4 /*yield*/, (0, tutanota_utils_1.promiseMap)(instanceChunks, function (instanceChunk) { return __awaiter(_this, void 0, void 0, function () {
                                var encryptedEntities, queryParams, persistencePostReturn, e_2, returnedIds;
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 3, , 7]);
                                            return [4 /*yield*/, (0, tutanota_utils_1.promiseMap)(instanceChunk, function (e) {
                                                    var sk = _this._crypto.setNewOwnerEncSessionKey(typeModel, e);
                                                    return _this._instanceMapper.encryptAndMapToLiteral(typeModel, e, sk);
                                                })
                                                // informs the server that this is a POST_MULTIPLE request
                                            ];
                                        case 1:
                                            encryptedEntities = _a.sent();
                                            queryParams = {
                                                count: String(instanceChunk.length)
                                            };
                                            return [4 /*yield*/, this._restClient.request(path, "POST" /* HttpMethod.POST */, {
                                                    queryParams: queryParams,
                                                    headers: headers,
                                                    body: JSON.stringify(encryptedEntities),
                                                    responseType: "application/json" /* MediaType.Json */
                                                })];
                                        case 2:
                                            persistencePostReturn = _a.sent();
                                            return [2 /*return*/, this.parseSetupMultiple(persistencePostReturn)];
                                        case 3:
                                            e_2 = _a.sent();
                                            if (!(e_2 instanceof RestError_1.PayloadTooLargeError)) return [3 /*break*/, 5];
                                            return [4 /*yield*/, (0, tutanota_utils_1.promiseMap)(instanceChunk, function (instance) {
                                                    return _this.setup(listId, instance)["catch"](function (e) {
                                                        errors.push(e);
                                                        failedInstances.push(instance);
                                                    });
                                                })];
                                        case 4:
                                            returnedIds = _a.sent();
                                            return [2 /*return*/, returnedIds.filter(Boolean)];
                                        case 5:
                                            errors.push(e_2);
                                            failedInstances.push.apply(failedInstances, instanceChunk);
                                            return [2 /*return*/, []];
                                        case 6: return [3 /*break*/, 7];
                                        case 7: return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 2:
                        idChunks = _b.sent();
                        if (errors.length) {
                            throw new SetupMultipleError_1.SetupMultipleError("Setup multiple entities failed", errors, failedInstances);
                        }
                        else {
                            return [2 /*return*/, (0, tutanota_utils_1.flat)(idChunks)];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    EntityRestClient.prototype.update = function (instance) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, listId, elementId, _b, path, queryParams, headers, typeModel, sessionKey, encryptedEntity;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!instance._id)
                            throw new Error("Id must be defined");
                        _a = (0, DefaultEntityRestCache_js_1.expandId)(instance._id), listId = _a.listId, elementId = _a.elementId;
                        return [4 /*yield*/, this._validateAndPrepareRestRequest(instance._type, listId, elementId, undefined, undefined)];
                    case 1:
                        _b = _c.sent(), path = _b.path, queryParams = _b.queryParams, headers = _b.headers, typeModel = _b.typeModel;
                        return [4 /*yield*/, this._crypto.resolveSessionKey(typeModel, instance)];
                    case 2:
                        sessionKey = _c.sent();
                        return [4 /*yield*/, this._instanceMapper.encryptAndMapToLiteral(typeModel, instance, sessionKey)];
                    case 3:
                        encryptedEntity = _c.sent();
                        return [4 /*yield*/, this._restClient.request(path, "PUT" /* HttpMethod.PUT */, {
                                queryParams: queryParams,
                                headers: headers,
                                body: JSON.stringify(encryptedEntity),
                                responseType: "application/json" /* MediaType.Json */
                            })];
                    case 4:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EntityRestClient.prototype.erase = function (instance) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, listId, elementId, _b, path, queryParams, headers;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = (0, DefaultEntityRestCache_js_1.expandId)(instance._id), listId = _a.listId, elementId = _a.elementId;
                        return [4 /*yield*/, this._validateAndPrepareRestRequest(instance._type, listId, elementId, undefined, undefined)];
                    case 1:
                        _b = _c.sent(), path = _b.path, queryParams = _b.queryParams, headers = _b.headers;
                        return [4 /*yield*/, this._restClient.request(path, "DELETE" /* HttpMethod.DELETE */, {
                                queryParams: queryParams,
                                headers: headers
                            })];
                    case 2:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EntityRestClient.prototype._validateAndPrepareRestRequest = function (typeRef, listId, elementId, queryParams, extraHeaders) {
        return __awaiter(this, void 0, void 0, function () {
            var typeModel, path, headers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, EntityFunctions_1.resolveTypeReference)(typeRef)];
                    case 1:
                        typeModel = _a.sent();
                        (0, EntityFunctions_1._verifyType)(typeModel);
                        if (!this.authDataProvider.isFullyLoggedIn() && typeModel.encrypted) {
                            // Short-circuit before we do an actual request which we can't decrypt
                            throw new LoginIncompleteError_js_1.LoginIncompleteError("Trying to do a network request with encrypted entity but is not fully logged in yet, type: ".concat(typeModel.name));
                        }
                        path = typeRefToPath(typeRef);
                        if (listId) {
                            path += "/" + listId;
                        }
                        if (elementId) {
                            path += "/" + elementId;
                        }
                        headers = Object.assign({}, this.authDataProvider.createAuthHeaders(), extraHeaders);
                        if (Object.keys(headers).length === 0) {
                            throw new RestError_1.NotAuthenticatedError("user must be authenticated for entity requests");
                        }
                        headers.v = typeModel.version;
                        return [2 /*return*/, {
                                path: path,
                                queryParams: queryParams,
                                headers: headers,
                                typeModel: typeModel
                            }];
                }
            });
        });
    };
    /**
     * for the admin area (no cache available)
     */
    EntityRestClient.prototype.entityEventsReceived = function (batch) {
        return Promise.resolve(batch.events);
    };
    EntityRestClient.prototype.getRestClient = function () {
        return this._restClient;
    };
    EntityRestClient.prototype.parseSetupMultiple = function (result) {
        try {
            return JSON.parse(result).map(function (r) { return r.generatedId; });
        }
        catch (e) {
            throw new Error("Invalid response: ".concat(result, ", ").concat(e));
        }
    };
    return EntityRestClient;
}());
exports.EntityRestClient = EntityRestClient;
function getIds(instance, typeModel) {
    if (!instance._id)
        throw new Error("Id must be defined");
    var listId = null;
    var id;
    if (typeModel.type === EntityConstants_1.Type.ListElement) {
        listId = instance._id[0];
        id = instance._id[1];
    }
    else {
        id = instance._id;
    }
    return {
        listId: listId,
        id: id
    };
}
exports.getIds = getIds;
