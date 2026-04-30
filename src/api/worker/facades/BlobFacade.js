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
exports.BlobFacade = exports.BLOB_SERVICE_REST_PATH = void 0;
var RestClient_1 = require("../rest/RestClient");
var CryptoFacade_1 = require("../crypto/CryptoFacade");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var TutanotaConstants_1 = require("../../common/TutanotaConstants");
var EntityFunctions_1 = require("../../common/EntityFunctions");
var Env_1 = require("../../common/Env");
var Services_1 = require("../../entities/storage/Services");
var tutanota_crypto_1 = require("@tutao/tutanota-crypto");
var TypeRefs_js_1 = require("../../entities/sys/TypeRefs.js");
var RestError_1 = require("../../common/error/RestError");
var EntityUtils_1 = require("../../common/utils/EntityUtils");
var ProgrammingError_1 = require("../../common/error/ProgrammingError");
var TypeRefs_1 = require("../../entities/storage/TypeRefs");
(0, Env_1.assertWorkerOrNode)();
exports.BLOB_SERVICE_REST_PATH = "/rest/".concat(Services_1.BlobService.app, "/").concat(Services_1.BlobService.name.toLowerCase());
/**
 * The BlobFacade uploads and downloads blobs to/from the blob store.
 *
 * It requests tokens from the BlobAccessTokenService and download and uploads the blobs to/from the BlobService.
 *
 * In case of upload it is necessary to make a request to the BlobReferenceService or use the referenceTokens returned by the BlobService PUT in some other service call.
 * Otherwise the blobs will automatically be deleted after some time. It is not allowed to reference blobs manually in some instance.
 */
var BlobFacade = /** @class */ (function () {
    function BlobFacade(authDataProvider, serviceExecutor, restClient, suspensionHandler, fileApp, aesApp, instanceMapper, cryptoFacade) {
        this.authDataProvider = authDataProvider;
        this.serviceExecutor = serviceExecutor;
        this.restClient = restClient;
        this.suspensionHandler = suspensionHandler;
        this.fileApp = fileApp;
        this.aesApp = aesApp;
        this.instanceMapper = instanceMapper;
        this.cryptoFacade = cryptoFacade;
    }
    /**
     * Encrypts and uploads binary data to the blob store. The binary data is split into multiple blobs in case it
     * is too big.
     *
     * @returns blobReferenceToken that must be used to reference a blobs from an instance. Only to be used once.
     */
    BlobFacade.prototype.encryptAndUpload = function (archiveDataType, blobData, ownerGroupId, sessionKey) {
        return __awaiter(this, void 0, void 0, function () {
            var blobAccessInfo, chunks;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.requestWriteToken(archiveDataType, ownerGroupId)];
                    case 1:
                        blobAccessInfo = _a.sent();
                        chunks = (0, tutanota_utils_1.splitUint8ArrayInChunks)(TutanotaConstants_1.MAX_BLOB_SIZE_BYTES, blobData);
                        return [2 /*return*/, (0, tutanota_utils_1.promiseMap)(chunks, function (chunk) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.encryptAndUploadChunk(chunk, blobAccessInfo, sessionKey)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            }); }); })];
                }
            });
        });
    };
    /**
     * Encrypts and uploads binary data stored as a file to the blob store. The binary data is split into multiple blobs in case it
     * is too big.
     *
     * @returns blobReferenceToken that must be used to reference a blobs from an instance. Only to be used once.
     */
    BlobFacade.prototype.encryptAndUploadNative = function (archiveDataType, fileUri, ownerGroupId, sessionKey) {
        return __awaiter(this, void 0, void 0, function () {
            var blobAccessInfo, chunkUris;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(0, Env_1.isApp)() && !(0, Env_1.isDesktop)()) {
                            throw new ProgrammingError_1.ProgrammingError("Environment is not app or Desktop!");
                        }
                        return [4 /*yield*/, this.requestWriteToken(archiveDataType, ownerGroupId)];
                    case 1:
                        blobAccessInfo = _a.sent();
                        return [4 /*yield*/, this.fileApp.splitFile(fileUri, TutanotaConstants_1.MAX_BLOB_SIZE_BYTES)];
                    case 2:
                        chunkUris = _a.sent();
                        return [2 /*return*/, (0, tutanota_utils_1.promiseMap)(chunkUris, function (chunkUri) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, this.encryptAndUploadNativeChunk(chunkUri, blobAccessInfo, sessionKey)];
                                });
                            }); })];
                }
            });
        });
    };
    /**
     * Downloads multiple blobs, decrypts and joins them to unencrypted binary data.
     *
     * @param archiveDataType
     * @param blobs to be retrieved
     * @param referencingInstance that directly references the blobs
     * @returns Uint8Array unencrypted binary data
     */
    BlobFacade.prototype.downloadAndDecrypt = function (archiveDataType, blobs, referencingInstance) {
        return __awaiter(this, void 0, void 0, function () {
            var blobAccessInfo, sessionKey, _a, blobData;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.requestReadToken(archiveDataType, blobs, referencingInstance)];
                    case 1:
                        blobAccessInfo = _b.sent();
                        _a = tutanota_utils_1.neverNull;
                        return [4 /*yield*/, this.cryptoFacade.resolveSessionKeyForInstance(referencingInstance)];
                    case 2:
                        sessionKey = _a.apply(void 0, [_b.sent()]);
                        return [4 /*yield*/, (0, tutanota_utils_1.promiseMap)(blobs, function (blob) { return _this.downloadAndDecryptChunk(blob, blobAccessInfo, sessionKey); })];
                    case 3:
                        blobData = _b.sent();
                        return [2 /*return*/, tutanota_utils_1.concat.apply(void 0, blobData)];
                }
            });
        });
    };
    /**
     * Downloads multiple blobs, decrypts and joins them to unencrypted binary data which will be stored as a file on the
     * device.
     *
     * @param archiveDataType
     * @param blobs to be retrieved
     * @param referencingInstance that directly references the blobs
     * @param fileName is written to the returned FileReference
     * @param mimeType is written to the returned FileReference
     * @returns FileReference to the unencrypted binary data
     */
    BlobFacade.prototype.downloadAndDecryptNative = function (archiveDataType, blobs, referencingInstance, fileName, mimeType) {
        return __awaiter(this, void 0, void 0, function () {
            var blobAccessInfo, sessionKey, _a, decryptedChunkFileUris, _i, blobs_1, blob, _b, _c, e_1, _d, decryptedChunkFileUris_1, decryptedChunkFileUri, decryptedFileUri, size, _e, decryptedChunkFileUris_2, tmpBlobFile;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (!(0, Env_1.isApp)() && !(0, Env_1.isDesktop)()) {
                            throw new ProgrammingError_1.ProgrammingError("Environment is not app or Desktop!");
                        }
                        return [4 /*yield*/, this.requestReadToken(archiveDataType, blobs, referencingInstance)];
                    case 1:
                        blobAccessInfo = _f.sent();
                        _a = tutanota_utils_1.neverNull;
                        return [4 /*yield*/, this.cryptoFacade.resolveSessionKeyForInstance(referencingInstance)];
                    case 2:
                        sessionKey = _a.apply(void 0, [_f.sent()]);
                        decryptedChunkFileUris = [];
                        _i = 0, blobs_1 = blobs;
                        _f.label = 3;
                    case 3:
                        if (!(_i < blobs_1.length)) return [3 /*break*/, 12];
                        blob = blobs_1[_i];
                        _f.label = 4;
                    case 4:
                        _f.trys.push([4, 6, , 11]);
                        _c = (_b = decryptedChunkFileUris).push;
                        return [4 /*yield*/, this.downloadAndDecryptChunkNative(blob, blobAccessInfo, sessionKey)];
                    case 5:
                        _c.apply(_b, [_f.sent()]);
                        return [3 /*break*/, 11];
                    case 6:
                        e_1 = _f.sent();
                        _d = 0, decryptedChunkFileUris_1 = decryptedChunkFileUris;
                        _f.label = 7;
                    case 7:
                        if (!(_d < decryptedChunkFileUris_1.length)) return [3 /*break*/, 10];
                        decryptedChunkFileUri = decryptedChunkFileUris_1[_d];
                        return [4 /*yield*/, this.fileApp.deleteFile(decryptedChunkFileUri)];
                    case 8:
                        _f.sent();
                        _f.label = 9;
                    case 9:
                        _d++;
                        return [3 /*break*/, 7];
                    case 10: throw e_1;
                    case 11:
                        _i++;
                        return [3 /*break*/, 3];
                    case 12:
                        _f.trys.push([12, , 15, 20]);
                        return [4 /*yield*/, this.fileApp.joinFiles(fileName, decryptedChunkFileUris)];
                    case 13:
                        decryptedFileUri = _f.sent();
                        return [4 /*yield*/, this.fileApp.getSize(decryptedFileUri)];
                    case 14:
                        size = _f.sent();
                        return [2 /*return*/, {
                                _type: "FileReference",
                                name: fileName,
                                mimeType: mimeType,
                                size: size,
                                location: decryptedFileUri
                            }];
                    case 15:
                        _e = 0, decryptedChunkFileUris_2 = decryptedChunkFileUris;
                        _f.label = 16;
                    case 16:
                        if (!(_e < decryptedChunkFileUris_2.length)) return [3 /*break*/, 19];
                        tmpBlobFile = decryptedChunkFileUris_2[_e];
                        return [4 /*yield*/, this.fileApp.deleteFile(tmpBlobFile)];
                    case 17:
                        _f.sent();
                        _f.label = 18;
                    case 18:
                        _e++;
                        return [3 /*break*/, 16];
                    case 19: return [7 /*endfinally*/];
                    case 20: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Requests a token to upload blobs for the given ArchiveDataType and ownerGroup.
     * @param archiveDataType
     * @param ownerGroupId
     */
    BlobFacade.prototype.requestWriteToken = function (archiveDataType, ownerGroupId) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenRequest, blobAccessInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenRequest = (0, TypeRefs_1.createBlobAccessTokenPostIn)({
                            archiveDataType: archiveDataType,
                            write: (0, TypeRefs_1.createBlobWriteData)({
                                archiveOwnerGroup: ownerGroupId
                            })
                        });
                        return [4 /*yield*/, this.serviceExecutor.post(Services_1.BlobAccessTokenService, tokenRequest)];
                    case 1:
                        blobAccessInfo = (_a.sent()).blobAccessInfo;
                        return [2 /*return*/, blobAccessInfo];
                }
            });
        });
    };
    /**
     * Requests a token to download blobs.
     * @param archiveDataType
     * @param blobs all blobs need to be in one archive.
     * @param referencingInstance the instance that references the blobs
     */
    BlobFacade.prototype.requestReadToken = function (archiveDataType, blobs, referencingInstance) {
        return __awaiter(this, void 0, void 0, function () {
            var archiveId, instance, instanceListId, instanceId, instanceIds, tokenRequest, blobAccessInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        archiveId = this.getArchiveId(blobs);
                        instance = (0, tutanota_utils_1.downcast)(referencingInstance);
                        if ((0, EntityUtils_1.isElementEntity)(instance)) {
                            instanceListId = null;
                            instanceId = (0, EntityUtils_1.getEtId)(instance);
                        }
                        else {
                            instanceListId = (0, EntityUtils_1.getListId)(instance);
                            instanceId = (0, EntityUtils_1.getElementId)(instance);
                        }
                        instanceIds = [(0, TypeRefs_1.createInstanceId)({ instanceId: instanceId })];
                        tokenRequest = (0, TypeRefs_1.createBlobAccessTokenPostIn)({
                            archiveDataType: archiveDataType,
                            read: (0, TypeRefs_1.createBlobReadData)({
                                archiveId: archiveId,
                                instanceListId: instanceListId,
                                instanceIds: instanceIds
                            })
                        });
                        return [4 /*yield*/, this.serviceExecutor.post(Services_1.BlobAccessTokenService, tokenRequest)];
                    case 1:
                        blobAccessInfo = (_a.sent()).blobAccessInfo;
                        return [2 /*return*/, blobAccessInfo];
                }
            });
        });
    };
    BlobFacade.prototype.encryptAndUploadChunk = function (chunk, blobAccessInfo, sessionKey) {
        return __awaiter(this, void 0, void 0, function () {
            var blobAccessToken, servers, encryptedData, blobHash, queryParams;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        blobAccessToken = blobAccessInfo.blobAccessToken, servers = blobAccessInfo.servers;
                        encryptedData = (0, CryptoFacade_1.encryptBytes)(sessionKey, chunk);
                        blobHash = (0, tutanota_utils_1.uint8ArrayToBase64)((0, tutanota_crypto_1.sha256Hash)(encryptedData).slice(0, 6));
                        return [4 /*yield*/, this.createParams({ blobAccessToken: blobAccessToken, blobHash: blobHash })];
                    case 1:
                        queryParams = _a.sent();
                        return [2 /*return*/, this.tryServers(servers, function (serverUrl) { return __awaiter(_this, void 0, void 0, function () {
                                var response;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.restClient.request(exports.BLOB_SERVICE_REST_PATH, "POST" /* HttpMethod.POST */, {
                                                queryParams: queryParams,
                                                body: encryptedData,
                                                responseType: "application/json" /* MediaType.Json */,
                                                baseUrl: serverUrl
                                            })];
                                        case 1:
                                            response = _a.sent();
                                            return [4 /*yield*/, this.parseBlobPostOutResponse(response)];
                                        case 2: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); }, "can't upload to server", "POST" /* HttpMethod.POST */)];
                }
            });
        });
    };
    BlobFacade.prototype.encryptAndUploadNativeChunk = function (fileUri, blobAccessInfo, sessionKey) {
        return __awaiter(this, void 0, void 0, function () {
            var blobAccessToken, servers, encryptedFileInfo, encryptedChunkUri, blobHash, queryParams;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        blobAccessToken = blobAccessInfo.blobAccessToken, servers = blobAccessInfo.servers;
                        return [4 /*yield*/, this.aesApp.aesEncryptFile(sessionKey, fileUri)];
                    case 1:
                        encryptedFileInfo = _a.sent();
                        encryptedChunkUri = encryptedFileInfo.uri;
                        return [4 /*yield*/, this.fileApp.hashFile(encryptedChunkUri)];
                    case 2:
                        blobHash = _a.sent();
                        return [4 /*yield*/, this.createParams({ blobAccessToken: blobAccessToken, blobHash: blobHash })];
                    case 3:
                        queryParams = _a.sent();
                        return [2 /*return*/, this.tryServers(servers, function (serverUrl) { return __awaiter(_this, void 0, void 0, function () {
                                var serviceUrl, fullUrl;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            serviceUrl = new URL(exports.BLOB_SERVICE_REST_PATH, serverUrl);
                                            fullUrl = (0, RestClient_1.addParamsToUrl)(serviceUrl, queryParams);
                                            return [4 /*yield*/, this.uploadNative(encryptedChunkUri, fullUrl)];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); }, "can't upload to server from native", "POST" /* HttpMethod.POST */)];
                }
            });
        });
    };
    BlobFacade.prototype.uploadNative = function (location, fullUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, suspensionTime, responseBody, statusCode, errorId, precondition;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.suspensionHandler.isSuspended()) {
                            return [2 /*return*/, this.suspensionHandler.deferRequest(function () { return _this.uploadNative(location, fullUrl); })];
                        }
                        return [4 /*yield*/, this.fileApp.upload(location, fullUrl.toString(), "POST" /* HttpMethod.POST */, {})]; // blobReferenceToken in the response body
                    case 1:
                        _a = _b.sent() // blobReferenceToken in the response body
                        , suspensionTime = _a.suspensionTime, responseBody = _a.responseBody, statusCode = _a.statusCode, errorId = _a.errorId, precondition = _a.precondition;
                        if (statusCode === 201 && responseBody != null) {
                            return [2 /*return*/, this.parseBlobPostOutResponse((0, tutanota_utils_1.uint8ArrayToString)("utf-8", responseBody))];
                        }
                        else if (responseBody == null) {
                            throw new Error("no response body");
                        }
                        else if ((0, RestClient_1.isSuspensionResponse)(statusCode, suspensionTime)) {
                            this.suspensionHandler.activateSuspensionIfInactive(Number(suspensionTime));
                            return [2 /*return*/, this.suspensionHandler.deferRequest(function () { return _this.uploadNative(location, fullUrl); })];
                        }
                        else {
                            throw (0, RestError_1.handleRestError)(statusCode, " | PUT ".concat(fullUrl.toString(), " failed to natively upload blob"), errorId, precondition);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    BlobFacade.prototype.parseBlobPostOutResponse = function (jsonData) {
        return __awaiter(this, void 0, void 0, function () {
            var responseTypeModel, instance, blobReferenceToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, EntityFunctions_1.resolveTypeReference)(TypeRefs_1.BlobPostOutTypeRef)];
                    case 1:
                        responseTypeModel = _a.sent();
                        instance = JSON.parse(jsonData);
                        return [4 /*yield*/, this.instanceMapper.decryptAndMapToInstance(responseTypeModel, instance, null)];
                    case 2:
                        blobReferenceToken = (_a.sent()).blobReferenceToken;
                        return [2 /*return*/, (0, TypeRefs_js_1.createBlobReferenceTokenWrapper)({ blobReferenceToken: blobReferenceToken })];
                }
            });
        });
    };
    BlobFacade.prototype.downloadAndDecryptChunk = function (blob, blobAccessInfo, sessionKey) {
        return __awaiter(this, void 0, void 0, function () {
            var blobAccessToken, servers, archiveId, blobId, queryParams, getData, BlobGetInTypeModel, literalGetData, body;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        blobAccessToken = blobAccessInfo.blobAccessToken, servers = blobAccessInfo.servers;
                        archiveId = blob.archiveId, blobId = blob.blobId;
                        return [4 /*yield*/, this.createParams({ blobAccessToken: blobAccessToken })];
                    case 1:
                        queryParams = _a.sent();
                        getData = (0, TypeRefs_1.createBlobGetIn)({
                            archiveId: archiveId,
                            blobId: blobId
                        });
                        return [4 /*yield*/, (0, EntityFunctions_1.resolveTypeReference)(TypeRefs_1.BlobGetInTypeRef)];
                    case 2:
                        BlobGetInTypeModel = _a.sent();
                        return [4 /*yield*/, this.instanceMapper.encryptAndMapToLiteral(BlobGetInTypeModel, getData, null)];
                    case 3:
                        literalGetData = _a.sent();
                        body = JSON.stringify(literalGetData);
                        return [2 /*return*/, this.tryServers(servers, function (serverUrl) { return __awaiter(_this, void 0, void 0, function () {
                                var data;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.restClient.request(exports.BLOB_SERVICE_REST_PATH, "GET" /* HttpMethod.GET */, {
                                                queryParams: queryParams,
                                                body: body,
                                                responseType: "application/octet-stream" /* MediaType.Binary */,
                                                baseUrl: serverUrl,
                                                noCORS: true
                                            })];
                                        case 1:
                                            data = _a.sent();
                                            return [2 /*return*/, (0, tutanota_crypto_1.aes128Decrypt)(sessionKey, data)];
                                    }
                                });
                            }); }, "can't download from server ", "GET" /* HttpMethod.GET */)];
                }
            });
        });
    };
    BlobFacade.prototype.createParams = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var blobAccessToken, blobHash, _body, BlobGetInTypeModel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        blobAccessToken = options.blobAccessToken, blobHash = options.blobHash, _body = options._body;
                        return [4 /*yield*/, (0, EntityFunctions_1.resolveTypeReference)(TypeRefs_1.BlobGetInTypeRef)];
                    case 1:
                        BlobGetInTypeModel = _a.sent();
                        return [2 /*return*/, Object.assign({
                                blobAccessToken: blobAccessToken,
                                blobHash: blobHash,
                                _body: _body,
                                v: BlobGetInTypeModel.version
                            }, this.authDataProvider.createAuthHeaders())];
                }
            });
        });
    };
    BlobFacade.prototype.downloadAndDecryptChunkNative = function (blob, blobAccessInfo, sessionKey) {
        return __awaiter(this, void 0, void 0, function () {
            var blobAccessToken, servers, archiveId, blobId, getData, BlobGetInTypeModel, literalGetData, _body, queryParams, blobFilename;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        blobAccessToken = blobAccessInfo.blobAccessToken, servers = blobAccessInfo.servers;
                        archiveId = blob.archiveId, blobId = blob.blobId;
                        getData = (0, TypeRefs_1.createBlobGetIn)({
                            archiveId: archiveId,
                            blobId: blobId
                        });
                        return [4 /*yield*/, (0, EntityFunctions_1.resolveTypeReference)(TypeRefs_1.BlobGetInTypeRef)];
                    case 1:
                        BlobGetInTypeModel = _a.sent();
                        return [4 /*yield*/, this.instanceMapper.encryptAndMapToLiteral(BlobGetInTypeModel, getData, null)];
                    case 2:
                        literalGetData = _a.sent();
                        _body = JSON.stringify(literalGetData);
                        return [4 /*yield*/, this.createParams({ blobAccessToken: blobAccessToken, _body: _body })];
                    case 3:
                        queryParams = _a.sent();
                        blobFilename = blobId + ".blob";
                        return [2 /*return*/, this.tryServers(servers, function (serverUrl) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.downloadNative(serverUrl, queryParams, sessionKey, blobFilename)];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); }, "can't download native from server ", "GET" /* HttpMethod.GET */)];
                }
            });
        });
    };
    /**
     * @return the uri of the decrypted blob
     */
    BlobFacade.prototype.downloadNative = function (serverUrl, queryParams, sessionKey, fileName) {
        return __awaiter(this, void 0, void 0, function () {
            var serviceUrl, url, _a, statusCode, encryptedFileUri, suspensionTime, errorId, precondition, decryptedFileUrl, _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (this.suspensionHandler.isSuspended()) {
                            return [2 /*return*/, this.suspensionHandler.deferRequest(function () { return _this.downloadNative(serverUrl, queryParams, sessionKey, fileName); })];
                        }
                        serviceUrl = new URL(exports.BLOB_SERVICE_REST_PATH, serverUrl);
                        url = (0, RestClient_1.addParamsToUrl)(serviceUrl, queryParams);
                        return [4 /*yield*/, this.fileApp.download(url.toString(), fileName, {})];
                    case 1:
                        _a = _c.sent(), statusCode = _a.statusCode, encryptedFileUri = _a.encryptedFileUri, suspensionTime = _a.suspensionTime, errorId = _a.errorId, precondition = _a.precondition;
                        if (!(statusCode == 200 && encryptedFileUri != null)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.aesApp.aesDecryptFile(sessionKey, encryptedFileUri)];
                    case 2:
                        decryptedFileUrl = _c.sent();
                        _c.label = 3;
                    case 3:
                        _c.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this.fileApp.deleteFile(encryptedFileUri)];
                    case 4:
                        _c.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        _b = _c.sent();
                        console.log("Failed to delete encrypted file", encryptedFileUri);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/, decryptedFileUrl];
                    case 7:
                        if ((0, RestClient_1.isSuspensionResponse)(statusCode, suspensionTime)) {
                            this.suspensionHandler.activateSuspensionIfInactive(Number(suspensionTime));
                            return [2 /*return*/, this.suspensionHandler.deferRequest(function () { return _this.downloadNative(serverUrl, queryParams, sessionKey, fileName); })];
                        }
                        else {
                            throw (0, RestError_1.handleRestError)(statusCode, " | GET failed to natively download attachment", errorId, precondition);
                        }
                        _c.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    BlobFacade.prototype.getArchiveId = function (blobs) {
        if (blobs.length == 0) {
            throw new Error("must pass blobs");
        }
        var archiveIds = new Set(blobs.map(function (b) { return b.archiveId; }));
        if (archiveIds.size != 1) {
            throw new Error("only one archive id allowed, but was ".concat(archiveIds));
        }
        return blobs[0].archiveId;
    };
    // VisibleForTesting
    /**
     * Tries to run the mapper action against a list of servers. If the action resolves
     * successfully, the result is returned. In case of an ConnectionError, the next
     * server is tried. Throws in all other cases.
     */
    BlobFacade.prototype.tryServers = function (servers, mapper, errorMsg, method) {
        return __awaiter(this, void 0, void 0, function () {
            var index, error, _i, servers_1, server, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        index = 0;
                        error = null;
                        _i = 0, servers_1 = servers;
                        _a.label = 1;
                    case 1:
                        if (!(_i < servers_1.length)) return [3 /*break*/, 7];
                        server = servers_1[_i];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, mapper(server.url, index)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        e_2 = _a.sent();
                        // InternalServerError is returned when accessing a corrupted archive, so we retry
                        if (e_2 instanceof RestError_1.ConnectionError
                            || e_2 instanceof RestError_1.InternalServerError
                            || (e_2 instanceof RestError_1.NotFoundError && method === "GET" /* HttpMethod.GET */)) {
                            console.log("".concat(errorMsg, " ").concat(server.url), e_2);
                            error = e_2;
                        }
                        else {
                            throw e_2;
                        }
                        return [3 /*break*/, 5];
                    case 5:
                        index++;
                        _a.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 1];
                    case 7: throw error;
                }
            });
        });
    };
    return BlobFacade;
}());
exports.BlobFacade = BlobFacade;
