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
exports._verifyType = exports.resolveTypeReference = exports.modelInfos = exports.typeModels = void 0;
var EntityConstants_1 = require("./EntityConstants");
var TypeModels_js_1 = require("../entities/base/TypeModels.js");
var TypeModels_js_2 = require("../entities/sys/TypeModels.js");
var TypeModels_js_3 = require("../entities/tutanota/TypeModels.js");
var TypeModels_js_4 = require("../entities/monitor/TypeModels.js");
var TypeModels_js_5 = require("../entities/accounting/TypeModels.js");
var TypeModels_js_6 = require("../entities/gossip/TypeModels.js");
var TypeModels_js_7 = require("../entities/storage/TypeModels.js");
var TypeModels_js_8 = require("../entities/usage/TypeModels.js");
var ModelInfo_js_1 = require("../entities/sys/ModelInfo.js");
var ModelInfo_js_2 = require("../entities/base/ModelInfo.js");
var ModelInfo_js_3 = require("../entities/tutanota/ModelInfo.js");
var ModelInfo_js_4 = require("../entities/monitor/ModelInfo.js");
var ModelInfo_js_5 = require("../entities/accounting/ModelInfo.js");
var ModelInfo_js_6 = require("../entities/gossip/ModelInfo.js");
var ModelInfo_js_7 = require("../entities/storage/ModelInfo.js");
var ModelInfo_js_8 = require("../entities/usage/ModelInfo.js");
/**
 * Model maps are needed for static analysis and dead-code elimination.
 * We access most types through the TypeRef but also sometimes we include them completely dynamically (e.g. encryption of aggregates).
 * This means that we need to tell our bundler which ones do exist so that they are included.
 */
exports.typeModels = Object.freeze({
    base: TypeModels_js_1.typeModels,
    sys: TypeModels_js_2.typeModels,
    tutanota: TypeModels_js_3.typeModels,
    monitor: TypeModels_js_4.typeModels,
    accounting: TypeModels_js_5.typeModels,
    gossip: TypeModels_js_6.typeModels,
    storage: TypeModels_js_7.typeModels,
    usage: TypeModels_js_8.typeModels
});
exports.modelInfos = {
    base: ModelInfo_js_2["default"],
    sys: ModelInfo_js_1["default"],
    tutanota: ModelInfo_js_3["default"],
    monitor: ModelInfo_js_4["default"],
    accounting: ModelInfo_js_5["default"],
    gossip: ModelInfo_js_6["default"],
    storage: ModelInfo_js_7["default"],
    usage: ModelInfo_js_8["default"]
};
function resolveTypeReference(typeRef) {
    return __awaiter(this, void 0, void 0, function () {
        var modelMap, typeModel;
        return __generator(this, function (_a) {
            modelMap = exports.typeModels[typeRef.app];
            typeModel = modelMap[typeRef.type];
            if (typeModel == null) {
                throw new Error("Cannot find TypeRef: " + JSON.stringify(typeRef));
            }
            else {
                return [2 /*return*/, typeModel];
            }
            return [2 /*return*/];
        });
    });
}
exports.resolveTypeReference = resolveTypeReference;
function _verifyType(typeModel) {
    if (typeModel.type !== EntityConstants_1.Type.Element && typeModel.type !== EntityConstants_1.Type.ListElement) {
        throw new Error("only Element and ListElement types are permitted, was: " + typeModel.type);
    }
}
exports._verifyType = _verifyType;
