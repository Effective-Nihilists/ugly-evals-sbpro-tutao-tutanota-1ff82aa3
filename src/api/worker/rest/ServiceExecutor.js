"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.ServiceExecutor = void 0;
var EntityFunctions_1 = require("../../common/EntityFunctions");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Env_1 = require("../../common/Env");
var ProgrammingError_1 = require("../../common/error/ProgrammingError");
var LoginIncompleteError_js_1 = require("../../common/error/LoginIncompleteError.js");
(0, Env_1.assertWorkerOrNode)();
var ServiceExecutor = /** @class */ (function () {
    function ServiceExecutor(restClient, authDataProvider, instanceMapper, cryptoFacade) {
        this.restClient = restClient;
        this.authDataProvider = authDataProvider;
        this.instanceMapper = instanceMapper;
        this.cryptoFacade = cryptoFacade;
    }
    ServiceExecutor.prototype.get = function (service, data, params) {
        return this.executeServiceRequest(service, "GET" /* HttpMethod.GET */, data, params);
    };
    ServiceExecutor.prototype.post = function (service, data, params) {
        return this.executeServiceRequest(service, "POST" /* HttpMethod.POST */, data, params);
    };
    ServiceExecutor.prototype.put = function (service, data, params) {
        return this.executeServiceRequest(service, "PUT" /* HttpMethod.PUT */, data, params);
    };
    ServiceExecutor.prototype["delete"] = function (service, data, params) {
        return this.executeServiceRequest(service, "DELETE" /* HttpMethod.DELETE */, data, params);
    };
    ServiceExecutor.prototype.executeServiceRequest = function (service, method, requestEntity, params) {
        return __awaiter(this, void 0, void 0, function () {
            var methodDefinition, _a, modelVersion, path, headers, encryptedEntity, data;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        methodDefinition = this.getMethodDefinition(service, method);
                        _a = methodDefinition["return"] &&
                            (params === null || params === void 0 ? void 0 : params.sessionKey) == null;
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, EntityFunctions_1.resolveTypeReference)(methodDefinition["return"])];
                    case 1:
                        _a = (_b.sent()).encrypted;
                        _b.label = 2;
                    case 2:
                        if (_a &&
                            !this.authDataProvider.isFullyLoggedIn()) {
                            // Short-circuit before we do an actual request which we can't decrypt
                            // If we have a session key passed it doesn't mean that it is for the return type but it is likely
                            // so we allow the request.
                            throw new LoginIncompleteError_js_1.LoginIncompleteError("Tried to make service request with encrypted return type but is not fully logged in yet, service: ".concat(service.name));
                        }
                        return [4 /*yield*/, this.getModelVersion(methodDefinition)];
                    case 3:
                        modelVersion = _b.sent();
                        path = "/rest/".concat(service.app.toLowerCase(), "/").concat(service.name.toLowerCase());
                        headers = __assign(__assign(__assign({}, this.authDataProvider.createAuthHeaders()), params === null || params === void 0 ? void 0 : params.extraHeaders), { v: modelVersion });
                        return [4 /*yield*/, this.encryptDataIfNeeded(methodDefinition, requestEntity, service, method, params !== null && params !== void 0 ? params : null)];
                    case 4:
                        encryptedEntity = _b.sent();
                        return [4 /*yield*/, this.restClient
                                .request(path, method, {
                                queryParams: params === null || params === void 0 ? void 0 : params.queryParams,
                                headers: headers,
                                responseType: "application/json" /* MediaType.Json */,
                                body: encryptedEntity !== null && encryptedEntity !== void 0 ? encryptedEntity : undefined,
                                suspensionBehavior: params === null || params === void 0 ? void 0 : params.suspensionBehavior
                            })];
                    case 5:
                        data = _b.sent();
                        if (!methodDefinition["return"]) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.decryptResponse(methodDefinition["return"], data, params)];
                    case 6: return [2 /*return*/, _b.sent()];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    ServiceExecutor.prototype.getMethodDefinition = function (service, method) {
        switch (method) {
            case "GET" /* HttpMethod.GET */:
                return service["get"];
            case "POST" /* HttpMethod.POST */:
                return service["post"];
            case "PUT" /* HttpMethod.PUT */:
                return service["put"];
            case "DELETE" /* HttpMethod.DELETE */:
                return service["delete"];
        }
    };
    ServiceExecutor.prototype.getModelVersion = function (methodDefinition) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var someTypeRef, model;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        someTypeRef = (_a = methodDefinition.data) !== null && _a !== void 0 ? _a : methodDefinition["return"];
                        if (someTypeRef == null) {
                            throw new ProgrammingError_1.ProgrammingError("Need either data or return for the service method!");
                        }
                        return [4 /*yield*/, (0, EntityFunctions_1.resolveTypeReference)(someTypeRef)];
                    case 1:
                        model = _b.sent();
                        return [2 /*return*/, model.version];
                }
            });
        });
    };
    ServiceExecutor.prototype.encryptDataIfNeeded = function (methodDefinition, requestEntity, service, method, params) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var requestTypeModel, encryptedEntity;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(methodDefinition.data != null)) return [3 /*break*/, 3];
                        if (requestEntity == null || !(0, tutanota_utils_1.isSameTypeRef)(methodDefinition.data, requestEntity._type)) {
                            throw new ProgrammingError_1.ProgrammingError("Invalid service data! ".concat(service.name, " ").concat(method));
                        }
                        return [4 /*yield*/, (0, EntityFunctions_1.resolveTypeReference)(methodDefinition.data)];
                    case 1:
                        requestTypeModel = _b.sent();
                        if (requestTypeModel.encrypted && (params === null || params === void 0 ? void 0 : params.sessionKey) == null) {
                            throw new ProgrammingError_1.ProgrammingError("Must provide a session key for an encrypted data transfer type!: " + service);
                        }
                        return [4 /*yield*/, this.instanceMapper.encryptAndMapToLiteral(requestTypeModel, requestEntity, (_a = params === null || params === void 0 ? void 0 : params.sessionKey) !== null && _a !== void 0 ? _a : null)];
                    case 2:
                        encryptedEntity = _b.sent();
                        return [2 /*return*/, JSON.stringify(encryptedEntity)];
                    case 3: return [2 /*return*/, null];
                }
            });
        });
    };
    ServiceExecutor.prototype.decryptResponse = function (typeRef, data, params) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var responseTypeModel, instance, resolvedSessionKey;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, EntityFunctions_1.resolveTypeReference)(typeRef)
                        // Filter out __proto__ to avoid prototype pollution.
                    ];
                    case 1:
                        responseTypeModel = _b.sent();
                        instance = JSON.parse(data, function (k, v) { return (k === "__proto__" ? undefined : v); });
                        return [4 /*yield*/, this.cryptoFacade().resolveServiceSessionKey(responseTypeModel, instance)];
                    case 2:
                        resolvedSessionKey = _b.sent();
                        return [2 /*return*/, this.instanceMapper.decryptAndMapToInstance(responseTypeModel, instance, (_a = resolvedSessionKey !== null && resolvedSessionKey !== void 0 ? resolvedSessionKey : params === null || params === void 0 ? void 0 : params.sessionKey) !== null && _a !== void 0 ? _a : null)];
                }
            });
        });
    };
    return ServiceExecutor;
}());
exports.ServiceExecutor = ServiceExecutor;
