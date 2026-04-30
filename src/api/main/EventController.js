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
exports.EventController = exports.isUpdateForTypeRef = void 0;
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var stream_1 = require("mithril/stream");
var Env_1 = require("../common/Env");
(0, Env_1.assertMainOrNode)();
var isUpdateForTypeRef = function (typeRef, update) { return (0, tutanota_utils_1.isSameTypeRefByAttr)(typeRef, update.application, update.type); };
exports.isUpdateForTypeRef = isUpdateForTypeRef;
var EventController = /** @class */ (function () {
    function EventController(logins) {
        this.logins = logins;
        this.countersStream = (0, stream_1["default"])();
        this.entityListeners = [];
    }
    EventController.prototype.addEntityListener = function (listener) {
        this.entityListeners.push(listener);
    };
    EventController.prototype.removeEntityListener = function (listener) {
        (0, tutanota_utils_1.remove)(this.entityListeners, listener);
    };
    EventController.prototype.getCountersStream = function () {
        // Create copy so it's never ended
        return this.countersStream.map(tutanota_utils_1.identity);
    };
    EventController.prototype.notificationReceived = function (entityUpdates, eventOwnerGroupId) {
        var _this = this;
        var loginsUpdates = Promise.resolve();
        if (this.logins.isUserLoggedIn()) {
            // the UserController must be notified first as other event receivers depend on it to be up-to-date
            loginsUpdates = this.logins.getUserController().entityEventsReceived(entityUpdates, eventOwnerGroupId);
        }
        return loginsUpdates
            .then(function () { return __awaiter(_this, void 0, void 0, function () {
            var _i, _a, listener, entityUpdatesData;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, _a = this.entityListeners;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        listener = _a[_i];
                        entityUpdatesData = (0, tutanota_utils_1.downcast)(entityUpdates);
                        return [4 /*yield*/, listener(entityUpdatesData, eventOwnerGroupId)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        }); })
            .then(tutanota_utils_1.noOp);
    };
    EventController.prototype.counterUpdateReceived = function (update) {
        this.countersStream(update);
    };
    return EventController;
}());
exports.EventController = EventController;
