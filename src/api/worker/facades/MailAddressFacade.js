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
exports.MailAddressFacade = void 0;
var TypeRefs_js_1 = require("../../entities/sys/TypeRefs.js");
var TypeRefs_js_2 = require("../../entities/sys/TypeRefs.js");
var TypeRefs_js_3 = require("../../entities/sys/TypeRefs.js");
var TypeRefs_js_4 = require("../../entities/sys/TypeRefs.js");
var Services_js_1 = require("../../entities/sys/Services.js");
var Env_1 = require("../../common/Env");
(0, Env_1.assertWorkerOrNode)();
var MailAddressFacade = /** @class */ (function () {
    function MailAddressFacade(user, serviceExecutor) {
        this.user = user;
        this.serviceExecutor = serviceExecutor;
    }
    MailAddressFacade.prototype.getAliasCounters = function () {
        return this.serviceExecutor.get(Services_js_1.MailAddressAliasService, null);
    };
    MailAddressFacade.prototype.isMailAddressAvailable = function (mailAddress) {
        if (this.user.isFullyLoggedIn()) {
            var data = (0, TypeRefs_js_3.createDomainMailAddressAvailabilityData)({ mailAddress: mailAddress });
            return this.serviceExecutor.get(Services_js_1.DomainMailAddressAvailabilityService, data)
                .then(function (result) { return result.available; });
        }
        else {
            var data = (0, TypeRefs_js_4.createMailAddressAvailabilityData)({ mailAddress: mailAddress });
            return this.serviceExecutor.get(Services_js_1.MailAddressAvailabilityService, data)
                .then(function (result) { return result.available; });
        }
    };
    MailAddressFacade.prototype.addMailAlias = function (groupId, alias) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = (0, TypeRefs_js_2.createMailAddressAliasServiceData)({
                            group: groupId,
                            mailAddress: alias
                        });
                        return [4 /*yield*/, this.serviceExecutor.post(Services_js_1.MailAddressAliasService, data)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MailAddressFacade.prototype.setMailAliasStatus = function (groupId, alias, restore) {
        return __awaiter(this, void 0, void 0, function () {
            var deleteData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        deleteData = (0, TypeRefs_js_1.createMailAddressAliasServiceDataDelete)({
                            mailAddress: alias,
                            restore: restore,
                            group: groupId
                        });
                        return [4 /*yield*/, this.serviceExecutor["delete"](Services_js_1.MailAddressAliasService, deleteData)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return MailAddressFacade;
}());
exports.MailAddressFacade = MailAddressFacade;
