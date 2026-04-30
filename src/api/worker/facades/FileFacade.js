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
exports.FileFacade = void 0;
var RestClient_1 = require("../rest/RestClient");
var CryptoFacade_1 = require("../crypto/CryptoFacade");
var TypeRefs_js_1 = require("../../entities/tutanota/TypeRefs.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var TutanotaConstants_1 = require("../../common/TutanotaConstants");
var EntityFunctions_1 = require("../../common/EntityFunctions");
var Env_1 = require("../../common/Env");
var RestError_1 = require("../../common/error/RestError");
var DataFile_1 = require("../../common/DataFile");
var tutanota_crypto_1 = require("@tutao/tutanota-crypto");
var Services_1 = require("../../entities/tutanota/Services");
var ModelInfo_1 = require("../../entities/tutanota/ModelInfo");
(0, Env_1.assertWorkerOrNode)();
var REST_PATH = "/rest/tutanota/filedataservice";
var FileFacade = /** @class */ (function () {
    function FileFacade(user, restClient, suspensionHandler, fileApp, aesApp, instanceMapper, serviceExecutor, cryptoFacade) {
        this.user = user;
        this.restClient = restClient;
        this.suspensionHandler = suspensionHandler;
        this.fileApp = fileApp;
        this.aesApp = aesApp;
        this.instanceMapper = instanceMapper;
        this.serviceExecutor = serviceExecutor;
        this.cryptoFacade = cryptoFacade;
    }
    FileFacade.prototype.clearFileData = function () {
        return this.fileApp.clearFileData();
    };
    FileFacade.prototype.downloadFileContent = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var requestData, sessionKey, entityToSend, _a, _b, headers, body, data;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        requestData = (0, TypeRefs_js_1.createFileDataDataGet)();
                        requestData.file = file._id;
                        requestData.base64 = false;
                        return [4 /*yield*/, this.cryptoFacade.resolveSessionKeyForInstance(file)];
                    case 1:
                        sessionKey = _c.sent();
                        _b = (_a = this.instanceMapper).encryptAndMapToLiteral;
                        return [4 /*yield*/, (0, EntityFunctions_1.resolveTypeReference)(TypeRefs_js_1.FileDataDataGetTypeRef)];
                    case 2: return [4 /*yield*/, _b.apply(_a, [_c.sent(), requestData, null])];
                    case 3:
                        entityToSend = _c.sent();
                        headers = this.user.createAuthHeaders();
                        headers["v"] = String(ModelInfo_1["default"].version);
                        body = JSON.stringify(entityToSend);
                        return [4 /*yield*/, this.restClient.request(REST_PATH, "GET" /* HttpMethod.GET */, { body: body, responseType: "application/octet-stream" /* MediaType.Binary */, headers: headers })];
                    case 4:
                        data = _c.sent();
                        return [2 /*return*/, (0, DataFile_1.convertToDataFile)(file, (0, tutanota_crypto_1.aes128Decrypt)((0, tutanota_utils_1.neverNull)(sessionKey), data))];
                }
            });
        });
    };
    FileFacade.prototype.downloadFileContentNative = function (file) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var sessionKey, _b, requestData, FileDataDataGetTypModel, entityToSend, headers, body, queryParams, url, _c, statusCode, encryptedFileUri, errorId, precondition, suspensionTime, decryptedFileUri, e_1;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        (0, tutanota_utils_1.assert)(env.mode === Env_1.Mode.App || env.mode === Env_1.Mode.Desktop, "Environment is not app or Desktop!");
                        if (this.suspensionHandler.isSuspended()) {
                            return [2 /*return*/, this.suspensionHandler.deferRequest(function () { return _this.downloadFileContentNative(file); })];
                        }
                        _b = tutanota_utils_1.assertNotNull;
                        return [4 /*yield*/, this.cryptoFacade.resolveSessionKeyForInstance(file)];
                    case 1:
                        sessionKey = _b.apply(void 0, [_d.sent(), "Session key for TutanotaFile is null"]);
                        requestData = (0, TypeRefs_js_1.createFileDataDataGet)({
                            file: file._id,
                            base64: false
                        });
                        return [4 /*yield*/, (0, EntityFunctions_1.resolveTypeReference)(TypeRefs_js_1.FileDataDataGetTypeRef)];
                    case 2:
                        FileDataDataGetTypModel = _d.sent();
                        return [4 /*yield*/, this.instanceMapper.encryptAndMapToLiteral(FileDataDataGetTypModel, requestData, null)];
                    case 3:
                        entityToSend = _d.sent();
                        headers = this.user.createAuthHeaders();
                        headers["v"] = String(ModelInfo_1["default"].version);
                        body = JSON.stringify(entityToSend);
                        queryParams = {
                            _body: body
                        };
                        url = (0, RestClient_1.addParamsToUrl)(new URL((0, Env_1.getHttpOrigin)() + REST_PATH), queryParams);
                        return [4 /*yield*/, this.fileApp.download(url.toString(), file.name, headers)];
                    case 4:
                        _c = _d.sent(), statusCode = _c.statusCode, encryptedFileUri = _c.encryptedFileUri, errorId = _c.errorId, precondition = _c.precondition, suspensionTime = _c.suspensionTime;
                        if (!(suspensionTime && (0, RestClient_1.isSuspensionResponse)(statusCode, suspensionTime))) return [3 /*break*/, 5];
                        this.suspensionHandler.activateSuspensionIfInactive(Number(suspensionTime));
                        return [2 /*return*/, this.suspensionHandler.deferRequest(function () { return _this.downloadFileContentNative(file); })];
                    case 5:
                        if (!(statusCode === 200 && encryptedFileUri != null)) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.aesApp.aesDecryptFile((0, tutanota_utils_1.neverNull)(sessionKey), encryptedFileUri)];
                    case 6:
                        decryptedFileUri = _d.sent();
                        _d.label = 7;
                    case 7:
                        _d.trys.push([7, 9, , 10]);
                        return [4 /*yield*/, this.fileApp.deleteFile(encryptedFileUri)];
                    case 8:
                        _d.sent();
                        return [3 /*break*/, 10];
                    case 9:
                        e_1 = _d.sent();
                        console.warn("Failed to delete encrypted file", encryptedFileUri);
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/, {
                            _type: "FileReference",
                            name: file.name,
                            mimeType: (_a = file.mimeType) !== null && _a !== void 0 ? _a : "application/octet-stream" /* MediaType.Binary */,
                            location: decryptedFileUri,
                            size: (0, tutanota_utils_1.filterInt)(file.size)
                        }];
                    case 11: throw (0, RestError_1.handleRestError)(statusCode, " | GET ".concat(url.toString(), " failed to natively download attachment"), errorId, precondition);
                }
            });
        });
    };
    FileFacade.prototype.uploadFileData = function (dataFile, sessionKey) {
        return __awaiter(this, void 0, void 0, function () {
            var encryptedData, fileData, fileDataPostReturn, fileDataId, headers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        encryptedData = (0, CryptoFacade_1.encryptBytes)(sessionKey, dataFile.data);
                        fileData = (0, TypeRefs_js_1.createFileDataDataPost)({
                            size: dataFile.data.byteLength.toString(),
                            group: this.user.getGroupId(TutanotaConstants_1.GroupType.Mail) // currently only used for attachments
                        });
                        return [4 /*yield*/, this.serviceExecutor.post(Services_1.FileDataService, fileData, { sessionKey: sessionKey })
                            // upload the file content
                        ];
                    case 1:
                        fileDataPostReturn = _a.sent();
                        fileDataId = fileDataPostReturn.fileData;
                        headers = this.user.createAuthHeaders();
                        headers["v"] = String(ModelInfo_1["default"].version);
                        return [4 /*yield*/, this.restClient
                                .request(REST_PATH, "PUT" /* HttpMethod.PUT */, {
                                queryParams: {
                                    fileDataId: fileDataId
                                },
                                headers: headers,
                                body: encryptedData,
                                responseType: "application/octet-stream" /* MediaType.Binary */
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, fileDataId];
                }
            });
        });
    };
    /**
     * Does not cleanup uploaded files. This is a responsibility of the caller
     */
    FileFacade.prototype.uploadFileDataNative = function (fileReference, sessionKey) {
        return __awaiter(this, void 0, void 0, function () {
            var encryptedFileInfo, fileData, fileDataPostReturn, fileDataId, headers, url, _a, statusCode, errorId, precondition, suspensionTime;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.suspensionHandler.isSuspended()) {
                            return [2 /*return*/, this.suspensionHandler.deferRequest(function () { return _this.uploadFileDataNative(fileReference, sessionKey); })];
                        }
                        return [4 /*yield*/, this.aesApp.aesEncryptFile(sessionKey, fileReference.location)];
                    case 1:
                        encryptedFileInfo = _b.sent();
                        fileData = (0, TypeRefs_js_1.createFileDataDataPost)({
                            size: encryptedFileInfo.unencryptedSize.toString(),
                            group: this.user.getGroupId(TutanotaConstants_1.GroupType.Mail)
                        });
                        return [4 /*yield*/, this.serviceExecutor.post(Services_1.FileDataService, fileData, { sessionKey: sessionKey })];
                    case 2:
                        fileDataPostReturn = _b.sent();
                        fileDataId = fileDataPostReturn.fileData;
                        headers = this.user.createAuthHeaders();
                        headers["v"] = String(ModelInfo_1["default"].version);
                        url = (0, RestClient_1.addParamsToUrl)(new URL((0, Env_1.getHttpOrigin)() + "/rest/tutanota/filedataservice"), {
                            fileDataId: fileDataId
                        });
                        return [4 /*yield*/, this.fileApp.upload(encryptedFileInfo.uri, url.toString(), "PUT" /* HttpMethod.PUT */, headers)];
                    case 3:
                        _a = _b.sent(), statusCode = _a.statusCode, errorId = _a.errorId, precondition = _a.precondition, suspensionTime = _a.suspensionTime;
                        if (statusCode === 200) {
                            return [2 /*return*/, fileDataId];
                        }
                        else if (suspensionTime && (0, RestClient_1.isSuspensionResponse)(statusCode, suspensionTime)) {
                            this.suspensionHandler.activateSuspensionIfInactive(Number(suspensionTime));
                            return [2 /*return*/, this.suspensionHandler.deferRequest(function () { return _this.uploadFileDataNative(fileReference, sessionKey); })];
                        }
                        else {
                            throw (0, RestError_1.handleRestError)(statusCode, " | PUT ".concat(url.toString(), " failed to natively upload attachment"), errorId, precondition);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return FileFacade;
}());
exports.FileFacade = FileFacade;
