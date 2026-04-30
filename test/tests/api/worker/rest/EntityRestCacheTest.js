"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.testEntityRestCache = void 0;
var ospec_1 = require("ospec");
var EntityUtils_js_1 = require("../../../../../src/api/common/utils/EntityUtils.js");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var TypeRefs_js_1 = require("../../../../../src/api/entities/sys/TypeRefs.js");
var EntityRestClient_js_1 = require("../../../../../src/api/worker/rest/EntityRestClient.js");
var DefaultEntityRestCache_js_1 = require("../../../../../src/api/worker/rest/DefaultEntityRestCache.js");
var TypeRefs_js_2 = require("../../../../../src/api/entities/tutanota/TypeRefs.js");
var OfflineStorage_js_1 = require("../../../../../src/api/worker/offline/OfflineStorage.js");
var tutanota_test_utils_1 = require("@tutao/tutanota-test-utils");
var NoZoneDateProvider_js_1 = require("../../../../../src/api/common/utils/NoZoneDateProvider.js");
var RestError_js_1 = require("../../../../../src/api/common/error/RestError.js");
var EphemeralCacheStorage_js_1 = require("../../../../../src/api/worker/rest/EphemeralCacheStorage.js");
var TutanotaConstants_js_1 = require("../../../../../src/api/common/TutanotaConstants.js");
var OfflineStorageMigrator_js_1 = require("../../../../../src/api/worker/offline/OfflineStorageMigrator.js");
var CommonCalendarUtils_js_1 = require("../../../../../src/api/common/utils/CommonCalendarUtils.js");
var InterWindowEventFacadeSendDispatcher_js_1 = require("../../../../../src/native/common/generatedipc/InterWindowEventFacadeSendDispatcher.js");
var testdouble_1 = require("testdouble");
var anything = testdouble_1.matchers.anything;
var offlineDatabaseTestKey = new Uint8Array([3957386659, 354339016, 3786337319, 3366334248]);
function getOfflineStorage(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, OfflineDbManager, PerWindowSqlCipherFacade, DesktopSqlCipher, odbManager, migratorMock, nativePath, sqlCipherFacade, interWindowEventSender, offlineStorage;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("../../../../../src/desktop/db/PerWindowSqlCipherFacade.js"); })];
                case 1:
                    _a = _b.sent(), OfflineDbManager = _a.OfflineDbManager, PerWindowSqlCipherFacade = _a.PerWindowSqlCipherFacade;
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("../../../../../src/desktop/DesktopSqlCipher.js"); })];
                case 2:
                    DesktopSqlCipher = (_b.sent()).DesktopSqlCipher;
                    odbManager = new (/** @class */ (function (_super) {
                        __extends(class_1, _super);
                        function class_1() {
                            return _super !== null && _super.apply(this, arguments) || this;
                        }
                        class_1.prototype.getOrCreateDb = function (userId, key) {
                            return __awaiter(this, void 0, void 0, function () {
                                var nativePath, db;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            (0, tutanota_utils_1.assertNotNull)(userId);
                                            nativePath = buildOptions.sqliteNativePath;
                                            db = new DesktopSqlCipher(nativePath, ":memory:", false);
                                            //integrity check breaks for in memory database
                                            return [4 /*yield*/, db.openDb(userId, key)];
                                        case 1:
                                            //integrity check breaks for in memory database
                                            _a.sent();
                                            return [2 /*return*/, db];
                                    }
                                });
                            });
                        };
                        class_1.prototype.deleteDb = function (userId) {
                            return __awaiter(this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/];
                                });
                            });
                        };
                        class_1.prototype.disposeDb = function (userId) {
                            return __awaiter(this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/];
                                });
                            });
                        };
                        return class_1;
                    }(OfflineDbManager)))(null);
                    migratorMock = (0, testdouble_1.instance)(OfflineStorageMigrator_js_1.OfflineStorageMigrator);
                    nativePath = buildOptions.sqliteNativePath;
                    sqlCipherFacade = new PerWindowSqlCipherFacade(odbManager);
                    interWindowEventSender = (0, testdouble_1.instance)(InterWindowEventFacadeSendDispatcher_js_1.InterWindowEventFacadeSendDispatcher);
                    offlineStorage = new OfflineStorage_js_1.OfflineStorage(sqlCipherFacade, interWindowEventSender, new NoZoneDateProvider_js_1.NoZoneDateProvider(), migratorMock);
                    return [4 /*yield*/, offlineStorage.init({ userId: userId, databaseKey: offlineDatabaseTestKey, timeRangeDays: 42, forceNewDatabase: false })];
                case 3:
                    _b.sent();
                    return [2 /*return*/, offlineStorage];
            }
        });
    });
}
function getEphemeralStorage() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new EphemeralCacheStorage_js_1.EphemeralCacheStorage()];
        });
    });
}
testEntityRestCache("ephemeral", getEphemeralStorage);
node(function () { return testEntityRestCache("offline", getOfflineStorage); })();
function testEntityRestCache(name, getStorage) {
    var groupId = "groupId";
    var batchId = "batchId";
    ospec_1["default"].spec("entity rest cache " + name, function () {
        var storage;
        var cache;
        // The entity client will assert to throwing if an unexpected method is called
        // You can mock it's attributes if you want to assert that a given method will be called
        var entityRestClient;
        var userId;
        var createUpdate = function (typeRef, listId, id, operation) {
            var eu = (0, TypeRefs_js_1.createEntityUpdate)();
            eu.application = typeRef.app;
            eu.type = typeRef.type;
            eu.instanceListId = listId;
            eu.instanceId = id;
            eu.operation = operation;
            return eu;
        };
        var createId = function (idText) {
            return Array(13 - idText.length).join("-") + idText;
        };
        var createBodyInstance = function (id, bodyText) {
            var body = (0, TypeRefs_js_2.createMailBody)();
            body._id = createId(id);
            body.text = bodyText;
            return body;
        };
        var createMailInstance = function (listId, id, subject) {
            var mail = (0, TypeRefs_js_2.createMail)();
            mail._id = [listId, createId(id)];
            mail.subject = subject !== null && subject !== void 0 ? subject : "";
            return mail;
        };
        function mockRestClient() {
            var notToBeCalled = function (name) {
                return function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    throw new Error(name + " should not have been called. arguments: " + String(args));
                };
            };
            var restClient = (0, testdouble_1.object)();
            (0, testdouble_1.when)(restClient.getServerTimestampMs()).thenReturn(Date.now());
            return (0, tutanota_utils_1.downcast)({
                load: notToBeCalled("load"),
                loadRange: notToBeCalled("loadRange"),
                loadMultiple: notToBeCalled("loadMultiple"),
                setup: notToBeCalled("setup"),
                setupMultiple: notToBeCalled("setupMultiple"),
                update: notToBeCalled("update"),
                erase: notToBeCalled("erase"),
                entityEventsReceived: function (e) { return Promise.resolve(e); },
                getRestClient: function () { return restClient; }
            });
        }
        ospec_1["default"].beforeEach(function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            userId = "userId";
                            return [4 /*yield*/, getStorage(userId)];
                        case 1:
                            storage = _a.sent();
                            entityRestClient = mockRestClient();
                            cache = new DefaultEntityRestCache_js_1.DefaultEntityRestCache(entityRestClient, storage);
                            return [2 /*return*/];
                    }
                });
            });
        });
        ospec_1["default"].spec("entityEventsReceived", function () {
            var path = (0, EntityRestClient_js_1.typeRefToPath)(TypeRefs_js_2.ContactTypeRef);
            var contactListId1 = "contactListId1";
            var contactListId2 = "contactListId2";
            var id1 = "id1";
            var id2 = "id2";
            var id3 = "id3";
            var id4 = "id4";
            var id5 = "id5";
            var id6 = "id6";
            var id7 = "id7";
            //Calendarevents
            var calendarEventListId = "calendarEventListId";
            var timestamp = Date.now();
            var calendarEventIds = [0, 1, 2, 3, 4, 5, 6].map(function (n) { return (0, CommonCalendarUtils_js_1.createEventElementId)(timestamp, n); });
            (0, ospec_1["default"])("writes batch meta on entity update", function () {
                return __awaiter(this, void 0, void 0, function () {
                    var contact1, contact2, batch, loadMultiple, mock, mock2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                contact1 = (0, TypeRefs_js_2.createContact)({ _id: [contactListId1, id1] });
                                contact2 = (0, TypeRefs_js_2.createContact)({ _id: [contactListId1, id2] });
                                batch = [
                                    createUpdate(TypeRefs_js_2.ContactTypeRef, contactListId1, id1, "0" /* OperationType.CREATE */),
                                    createUpdate(TypeRefs_js_2.ContactTypeRef, contactListId1, id2, "0" /* OperationType.CREATE */)
                                ];
                                loadMultiple = ospec_1["default"].spy(function (typeRef, listId, ids) {
                                    return Promise.resolve([contact1, contact2]);
                                });
                                mock = (0, tutanota_test_utils_1.mockAttribute)(entityRestClient, entityRestClient.loadMultiple, loadMultiple);
                                mock2 = (0, tutanota_test_utils_1.mockAttribute)(storage, storage.putLastBatchIdForGroup, function () {
                                    return Promise.resolve(undefined);
                                });
                                return [4 /*yield*/, cache.entityEventsReceived(makeBatch(batch))];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, cache.getLastEntityEventBatchForGroup(groupId)];
                            case 2:
                                _a.sent();
                                (0, ospec_1["default"])(storage.putLastBatchIdForGroup.callCount).equals(1)("putLastBatchMeta is called");
                                (0, ospec_1["default"])(storage.putLastBatchIdForGroup.args).deepEquals([groupId, batchId]);
                                (0, tutanota_test_utils_1.unmockAttribute)(mock);
                                (0, tutanota_test_utils_1.unmockAttribute)(mock2);
                                return [2 /*return*/];
                        }
                    });
                });
            });
            ospec_1["default"].spec("postMultiple", function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        ospec_1["default"].beforeEach(function () {
                            return __awaiter(this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, storage.setNewRangeForList(TypeRefs_js_2.ContactTypeRef, contactListId1, id1, id7)];
                                        case 1:
                                            _a.sent();
                                            return [4 /*yield*/, storage.setNewRangeForList(TypeRefs_js_2.ContactTypeRef, contactListId2, id1, id7)
                                                //when using offline calendar ids are always in cache range
                                            ];
                                        case 2:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        });
                        (0, ospec_1["default"])("entity events received should call loadMultiple when receiving updates from a postMultiple", function () {
                            return __awaiter(this, void 0, void 0, function () {
                                var contact1, contact2, batch, loadMultiple, mock, updates, _a, _b;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            contact1 = (0, TypeRefs_js_2.createContact)({ _id: [contactListId1, id1] });
                                            contact2 = (0, TypeRefs_js_2.createContact)({ _id: [contactListId1, id2] });
                                            batch = [
                                                createUpdate(TypeRefs_js_2.ContactTypeRef, contactListId1, id1, "0" /* OperationType.CREATE */),
                                                createUpdate(TypeRefs_js_2.ContactTypeRef, contactListId1, id2, "0" /* OperationType.CREATE */)
                                            ];
                                            loadMultiple = ospec_1["default"].spy(function (typeRef, listId, ids) {
                                                (0, ospec_1["default"])((0, tutanota_utils_1.isSameTypeRef)(typeRef, TypeRefs_js_2.ContactTypeRef)).equals(true);
                                                (0, ospec_1["default"])(listId).equals(contactListId1);
                                                (0, ospec_1["default"])(ids).deepEquals(["id1", "id2"]);
                                                return Promise.resolve([contact1, contact2]);
                                            });
                                            mock = (0, tutanota_test_utils_1.mockAttribute)(entityRestClient, entityRestClient.loadMultiple, loadMultiple);
                                            return [4 /*yield*/, cache.entityEventsReceived(makeBatch(batch))];
                                        case 1:
                                            updates = _c.sent();
                                            (0, tutanota_test_utils_1.unmockAttribute)(mock);
                                            (0, ospec_1["default"])(loadMultiple.callCount).equals(1)("loadMultiple is called");
                                            _a = ospec_1["default"];
                                            return [4 /*yield*/, storage.get(TypeRefs_js_2.ContactTypeRef, contactListId1, id1)];
                                        case 2:
                                            _a.apply(void 0, [_c.sent()]).notEquals(null);
                                            _b = ospec_1["default"];
                                            return [4 /*yield*/, storage.get(TypeRefs_js_2.ContactTypeRef, contactListId1, id2)];
                                        case 3:
                                            _b.apply(void 0, [_c.sent()]).notEquals(null);
                                            (0, ospec_1["default"])(updates).deepEquals(batch);
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        });
                        if (name === "offline") { // in the other case storage is an EphemeralCache which doesn't use custom handlers or caches calendar events.
                            (0, ospec_1["default"])("entity events received should call loadMultiple when receiving updates from a postMultiple with CustomCacheHandler", function () {
                                return __awaiter(this, void 0, void 0, function () {
                                    var event1, event2, batch, loadMultiple, mock, updates, _a, _b;
                                    return __generator(this, function (_c) {
                                        switch (_c.label) {
                                            case 0:
                                                event1 = (0, TypeRefs_js_2.createCalendarEvent)({ _id: [calendarEventListId, calendarEventIds[0]] });
                                                event2 = (0, TypeRefs_js_2.createCalendarEvent)({ _id: [calendarEventListId, calendarEventIds[1]] });
                                                // We only consider events to be in the range if we do actually have correct range
                                                return [4 /*yield*/, storage.setNewRangeForList(TypeRefs_js_2.CalendarEventTypeRef, calendarEventListId, EntityUtils_js_1.CUSTOM_MIN_ID, EntityUtils_js_1.CUSTOM_MAX_ID)];
                                            case 1:
                                                // We only consider events to be in the range if we do actually have correct range
                                                _c.sent();
                                                batch = [
                                                    createUpdate(TypeRefs_js_2.CalendarEventTypeRef, calendarEventListId, calendarEventIds[0], "0" /* OperationType.CREATE */),
                                                    createUpdate(TypeRefs_js_2.ContactTypeRef, calendarEventListId, calendarEventIds[1], "0" /* OperationType.CREATE */)
                                                ];
                                                loadMultiple = ospec_1["default"].spy(function (typeRef, listId, ids) {
                                                    (0, ospec_1["default"])((0, tutanota_utils_1.isSameTypeRef)(typeRef, TypeRefs_js_2.CalendarEventTypeRef)).equals(true);
                                                    (0, ospec_1["default"])(listId).equals(calendarEventListId);
                                                    (0, ospec_1["default"])(ids).deepEquals([calendarEventIds[0], calendarEventIds[1]]);
                                                    return Promise.resolve([event1, event2]);
                                                });
                                                mock = (0, tutanota_test_utils_1.mockAttribute)(entityRestClient, entityRestClient.loadMultiple, loadMultiple);
                                                return [4 /*yield*/, cache.entityEventsReceived(makeBatch(batch))];
                                            case 2:
                                                updates = _c.sent();
                                                (0, tutanota_test_utils_1.unmockAttribute)(mock);
                                                (0, ospec_1["default"])(loadMultiple.callCount).equals(1)("loadMultiple is called");
                                                _a = ospec_1["default"];
                                                return [4 /*yield*/, storage.get(TypeRefs_js_2.CalendarEventTypeRef, calendarEventListId, calendarEventIds[0])];
                                            case 3:
                                                _a.apply(void 0, [_c.sent()]).notEquals(null);
                                                _b = ospec_1["default"];
                                                return [4 /*yield*/, storage.get(TypeRefs_js_2.CalendarEventTypeRef, calendarEventListId, calendarEventIds[1])];
                                            case 4:
                                                _b.apply(void 0, [_c.sent()]).notEquals(null);
                                                (0, ospec_1["default"])(updates).deepEquals(batch);
                                                return [2 /*return*/];
                                        }
                                    });
                                });
                            });
                        }
                        (0, ospec_1["default"])("post multiple with different update type and list ids should make multiple load calls", function () {
                            return __awaiter(this, void 0, void 0, function () {
                                var batch, load, loadMultiple, loadMock, loadMultipleMock, filteredUpdates, _a, _b, _c, _d, _e, _f, _g, _h, _j, _i, batch_1, update;
                                return __generator(this, function (_k) {
                                    switch (_k.label) {
                                        case 0:
                                            batch = [
                                                createUpdate(TypeRefs_js_2.ContactTypeRef, contactListId1, id1, "0" /* OperationType.CREATE */),
                                                createUpdate(TypeRefs_js_2.ContactTypeRef, contactListId1, id2, "0" /* OperationType.CREATE */),
                                                createUpdate(TypeRefs_js_2.ContactTypeRef, contactListId2, id3, "0" /* OperationType.CREATE */),
                                                createUpdate(TypeRefs_js_2.ContactTypeRef, contactListId2, id4, "0" /* OperationType.CREATE */),
                                                createUpdate(TypeRefs_js_1.CustomerTypeRef, null, id5, "0" /* OperationType.CREATE */),
                                                createUpdate(TypeRefs_js_2.ContactTypeRef, contactListId1, id2, "1" /* OperationType.UPDATE */),
                                                createUpdate(TypeRefs_js_2.CalendarEventTypeRef, calendarEventListId, calendarEventIds[0], "0" /* OperationType.CREATE */),
                                                createUpdate(TypeRefs_js_2.CalendarEventTypeRef, calendarEventListId, calendarEventIds[1], "0" /* OperationType.CREATE */),
                                            ];
                                            load = ospec_1["default"].spy(function (typeRef, id) {
                                                var _a = (0, DefaultEntityRestCache_js_1.expandId)(id), listId = _a.listId, elementId = _a.elementId;
                                                if ((0, tutanota_utils_1.isSameTypeRef)(typeRef, TypeRefs_js_2.ContactTypeRef)) {
                                                    (0, ospec_1["default"])(elementId).equals(id2);
                                                    return Promise.resolve((0, TypeRefs_js_2.createContact)({
                                                        _id: [(0, tutanota_utils_1.neverNull)(listId), elementId]
                                                    }));
                                                }
                                                else if ((0, tutanota_utils_1.isSameTypeRef)(typeRef, TypeRefs_js_1.CustomerTypeRef)) {
                                                    (0, ospec_1["default"])(["id5", "id6", "id7"].includes(elementId)).equals(true);
                                                    return Promise.resolve((0, TypeRefs_js_1.createCustomer)({
                                                        _id: elementId
                                                    }));
                                                }
                                                throw new Error("load: should not be reached" + typeRef);
                                            });
                                            loadMultiple = ospec_1["default"].spy(function (typeRef, listId, ids) {
                                                if ((0, tutanota_utils_1.isSameTypeRef)(typeRef, TypeRefs_js_2.ContactTypeRef) || (0, tutanota_utils_1.isSameTypeRef)(typeRef, TypeRefs_js_2.CalendarEventTypeRef)) {
                                                    if (listId === contactListId1) {
                                                        (0, ospec_1["default"])(ids).deepEquals(["id1", "id2"]);
                                                        return Promise.resolve([
                                                            (0, TypeRefs_js_2.createContact)({
                                                                _id: [listId, id1]
                                                            }),
                                                            (0, TypeRefs_js_2.createContact)({
                                                                _id: [listId, id2]
                                                            }),
                                                        ]);
                                                    }
                                                    else if (listId === calendarEventListId) {
                                                        (0, ospec_1["default"])(ids).deepEquals([calendarEventIds[0], calendarEventIds[1]]);
                                                        return Promise.resolve([
                                                            (0, TypeRefs_js_2.createCalendarEvent)({
                                                                _id: [calendarEventListId, calendarEventIds[0]]
                                                            }),
                                                            (0, TypeRefs_js_2.createCalendarEvent)({
                                                                _id: [calendarEventListId, calendarEventIds[1]]
                                                            }),
                                                        ]);
                                                    }
                                                    else if (listId === contactListId2) {
                                                        (0, ospec_1["default"])(ids).deepEquals(["id3", "id4"]);
                                                        return Promise.resolve([
                                                            (0, TypeRefs_js_2.createContact)({
                                                                _id: [listId, "id3"]
                                                            }),
                                                            (0, TypeRefs_js_2.createContact)({
                                                                _id: [listId, "id4"]
                                                            }),
                                                        ]);
                                                    }
                                                }
                                                throw new Error("load multiple: should not be reached, typeref is ".concat(typeRef, ", listid is ").concat(listId, " "));
                                            });
                                            if (!(name === "offline")) return [3 /*break*/, 2];
                                            return [4 /*yield*/, storage.setNewRangeForList(TypeRefs_js_2.CalendarEventTypeRef, calendarEventListId, EntityUtils_js_1.CUSTOM_MIN_ID, EntityUtils_js_1.CUSTOM_MAX_ID)];
                                        case 1:
                                            _k.sent();
                                            _k.label = 2;
                                        case 2:
                                            loadMock = (0, tutanota_test_utils_1.mockAttribute)(entityRestClient, entityRestClient.load, load);
                                            loadMultipleMock = (0, tutanota_test_utils_1.mockAttribute)(entityRestClient, entityRestClient.loadMultiple, loadMultiple);
                                            return [4 /*yield*/, cache.entityEventsReceived(makeBatch(batch))];
                                        case 3:
                                            filteredUpdates = _k.sent();
                                            (0, tutanota_test_utils_1.unmockAttribute)(loadMock);
                                            (0, tutanota_test_utils_1.unmockAttribute)(loadMultipleMock);
                                            (0, ospec_1["default"])(load.callCount).equals(1)("One load for the customer create");
                                            _a = ospec_1["default"];
                                            return [4 /*yield*/, storage.get(TypeRefs_js_2.ContactTypeRef, contactListId1, id1)];
                                        case 4:
                                            _a.apply(void 0, [_k.sent()]).notEquals(null);
                                            _b = ospec_1["default"];
                                            return [4 /*yield*/, storage.get(TypeRefs_js_2.ContactTypeRef, contactListId1, id2)];
                                        case 5:
                                            _b.apply(void 0, [_k.sent()]).notEquals(null);
                                            _c = ospec_1["default"];
                                            return [4 /*yield*/, storage.get(TypeRefs_js_2.ContactTypeRef, contactListId2, id3)];
                                        case 6:
                                            _c.apply(void 0, [_k.sent()]).notEquals(null);
                                            _d = ospec_1["default"];
                                            return [4 /*yield*/, storage.get(TypeRefs_js_2.ContactTypeRef, contactListId2, id4)];
                                        case 7:
                                            _d.apply(void 0, [_k.sent()]).notEquals(null);
                                            if (!(name === "offline")) return [3 /*break*/, 10];
                                            (0, ospec_1["default"])(loadMultiple.callCount).equals(3)("Three load multiple, one for each contact list and one for the calendar list");
                                            _e = ospec_1["default"];
                                            return [4 /*yield*/, storage.get(TypeRefs_js_2.CalendarEventTypeRef, calendarEventListId, calendarEventIds[0])];
                                        case 8:
                                            _e.apply(void 0, [_k.sent()]).notEquals(null)("when using offline storage event 0 should be cached");
                                            _f = ospec_1["default"];
                                            return [4 /*yield*/, storage.get(TypeRefs_js_2.CalendarEventTypeRef, calendarEventListId, calendarEventIds[1])];
                                        case 9:
                                            _f.apply(void 0, [_k.sent()]).notEquals(null)("when using offline storage event 1 should be cached");
                                            return [3 /*break*/, 13];
                                        case 10:
                                            (0, ospec_1["default"])(loadMultiple.callCount).equals(2)("two load multiple, one for each contact list and none for the calendar list");
                                            _g = ospec_1["default"];
                                            return [4 /*yield*/, storage.get(TypeRefs_js_2.CalendarEventTypeRef, calendarEventListId, calendarEventIds[0])];
                                        case 11:
                                            _g.apply(void 0, [_k.sent()]).equals(null)("when using offline storage event 0 should not be cached");
                                            _h = ospec_1["default"];
                                            return [4 /*yield*/, storage.get(TypeRefs_js_2.CalendarEventTypeRef, calendarEventListId, calendarEventIds[1])];
                                        case 12:
                                            _h.apply(void 0, [_k.sent()]).equals(null)("when using offline storage event 1 should not be cached");
                                            _k.label = 13;
                                        case 13:
                                            _j = ospec_1["default"];
                                            return [4 /*yield*/, storage.get(TypeRefs_js_1.CustomerTypeRef, null, id5)];
                                        case 14:
                                            _j.apply(void 0, [_k.sent()]).equals(null);
                                            (0, ospec_1["default"])(filteredUpdates.length).equals(batch.length);
                                            for (_i = 0, batch_1 = batch; _i < batch_1.length; _i++) {
                                                update = batch_1[_i];
                                                (0, ospec_1["default"])(filteredUpdates.includes(update)).equals(true);
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        });
                        (0, ospec_1["default"])("returns empty [] when loadMultiple throwing an error ", function () {
                            return __awaiter(this, void 0, void 0, function () {
                                var batch, loadMultiple, loadMultipleMock, updates, _a, _b, _c, _d;
                                return __generator(this, function (_e) {
                                    switch (_e.label) {
                                        case 0:
                                            batch = [
                                                createUpdate(TypeRefs_js_2.ContactTypeRef, contactListId1, id1, "0" /* OperationType.CREATE */),
                                                createUpdate(TypeRefs_js_2.ContactTypeRef, contactListId1, id2, "0" /* OperationType.CREATE */),
                                                createUpdate(TypeRefs_js_2.ContactTypeRef, contactListId2, id3, "0" /* OperationType.CREATE */),
                                                createUpdate(TypeRefs_js_2.ContactTypeRef, contactListId2, id4, "0" /* OperationType.CREATE */)
                                            ];
                                            loadMultiple = ospec_1["default"].spy(function (typeRef, listId, ids) {
                                                (0, ospec_1["default"])((0, tutanota_utils_1.isSameTypeRef)(typeRef, TypeRefs_js_2.ContactTypeRef)).equals(true);
                                                if (listId === contactListId1) {
                                                    (0, ospec_1["default"])(ids).deepEquals(["id1", "id2"]);
                                                    return Promise.resolve([
                                                        (0, TypeRefs_js_2.createContact)({
                                                            _id: [listId, id1]
                                                        }),
                                                        (0, TypeRefs_js_2.createContact)({
                                                            _id: [listId, id2]
                                                        }),
                                                    ]);
                                                }
                                                else if (listId === contactListId2) {
                                                    (0, ospec_1["default"])(ids).deepEquals(["id3", "id4"]);
                                                    return Promise.reject(new RestError_js_1.NotAuthorizedError("bam"));
                                                }
                                            });
                                            loadMultipleMock = (0, tutanota_test_utils_1.mockAttribute)(entityRestClient, entityRestClient.loadMultiple, loadMultiple);
                                            return [4 /*yield*/, cache.entityEventsReceived(makeBatch(batch))];
                                        case 1:
                                            updates = _e.sent();
                                            (0, tutanota_test_utils_1.unmockAttribute)(loadMultipleMock);
                                            (0, ospec_1["default"])(loadMultiple.callCount).equals(2);
                                            _a = ospec_1["default"];
                                            return [4 /*yield*/, storage.get(TypeRefs_js_2.ContactTypeRef, contactListId1, id1)];
                                        case 2:
                                            _a.apply(void 0, [_e.sent()]).notEquals(null);
                                            _b = ospec_1["default"];
                                            return [4 /*yield*/, storage.get(TypeRefs_js_2.ContactTypeRef, contactListId1, id2)];
                                        case 3:
                                            _b.apply(void 0, [_e.sent()]).notEquals(null);
                                            _c = ospec_1["default"];
                                            return [4 /*yield*/, storage.get(TypeRefs_js_2.ContactTypeRef, contactListId2, id3)];
                                        case 4:
                                            _c.apply(void 0, [_e.sent()]).equals(null);
                                            _d = ospec_1["default"];
                                            return [4 /*yield*/, storage.get(TypeRefs_js_2.ContactTypeRef, contactListId2, id4)];
                                        case 5:
                                            _d.apply(void 0, [_e.sent()]).equals(null);
                                            (0, ospec_1["default"])(updates).deepEquals(batch.slice(0, 2));
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        });
                        return [2 /*return*/];
                    });
                });
            });
            ospec_1["default"].spec("post  multiple cache range", function () {
                (0, ospec_1["default"])("update is not in cache range", function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var batch, updates, _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    batch = [
                                        createUpdate(TypeRefs_js_2.ContactTypeRef, contactListId1, id1, "0" /* OperationType.CREATE */),
                                        createUpdate(TypeRefs_js_2.ContactTypeRef, contactListId1, id2, "0" /* OperationType.CREATE */)
                                    ];
                                    return [4 /*yield*/, cache.entityEventsReceived(makeBatch(batch))];
                                case 1:
                                    updates = _c.sent();
                                    _a = ospec_1["default"];
                                    return [4 /*yield*/, storage.get(TypeRefs_js_2.ContactTypeRef, contactListId1, id1)];
                                case 2:
                                    _a.apply(void 0, [_c.sent()]).equals(null);
                                    _b = ospec_1["default"];
                                    return [4 /*yield*/, storage.get(TypeRefs_js_2.ContactTypeRef, contactListId1, id2)];
                                case 3:
                                    _b.apply(void 0, [_c.sent()]).equals(null);
                                    (0, ospec_1["default"])(updates).deepEquals(batch);
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                (0, ospec_1["default"])("updates partially not loaded by loadMultiple", function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var batch, loadMultiple, loadMultipleMock, filteredUpdates, _a, _b, _i, _c, update;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0: return [4 /*yield*/, storage.setNewRangeForList(TypeRefs_js_2.ContactTypeRef, contactListId1, id1, id2)];
                                case 1:
                                    _d.sent();
                                    batch = [
                                        createUpdate(TypeRefs_js_2.ContactTypeRef, contactListId1, id1, "0" /* OperationType.CREATE */),
                                        createUpdate(TypeRefs_js_2.ContactTypeRef, contactListId1, id2, "0" /* OperationType.CREATE */),
                                    ];
                                    loadMultiple = ospec_1["default"].spy(function (typeRef, listId, ids) {
                                        if ((0, tutanota_utils_1.isSameTypeRef)(typeRef, TypeRefs_js_2.ContactTypeRef)) {
                                            if (listId === contactListId1) {
                                                (0, ospec_1["default"])(ids).deepEquals(["id1", "id2"]);
                                                return Promise.resolve([
                                                    (0, TypeRefs_js_2.createContact)({ _id: [listId, id1] })
                                                ]);
                                            }
                                        }
                                        throw new Error("should not be reached");
                                    });
                                    loadMultipleMock = (0, tutanota_test_utils_1.mockAttribute)(entityRestClient, entityRestClient.loadMultiple, loadMultiple);
                                    return [4 /*yield*/, cache.entityEventsReceived(makeBatch(batch))];
                                case 2:
                                    filteredUpdates = _d.sent();
                                    (0, tutanota_test_utils_1.unmockAttribute)(loadMultipleMock);
                                    (0, ospec_1["default"])(loadMultiple.callCount).equals(1);
                                    _a = ospec_1["default"];
                                    return [4 /*yield*/, storage.get(TypeRefs_js_2.ContactTypeRef, contactListId1, id1)];
                                case 3:
                                    _a.apply(void 0, [_d.sent()]).notEquals(null);
                                    _b = ospec_1["default"];
                                    return [4 /*yield*/, storage.get(TypeRefs_js_2.ContactTypeRef, contactListId1, id2)];
                                case 4:
                                    _b.apply(void 0, [_d.sent()]).equals(null);
                                    (0, ospec_1["default"])(filteredUpdates.length).equals(batch.length - 1);
                                    for (_i = 0, _c = batch.slice(0, 1); _i < _c.length; _i++) {
                                        update = _c[_i];
                                        (0, ospec_1["default"])(filteredUpdates.includes(update)).equals(true);
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                (0, ospec_1["default"])("update are partially in cache range ", function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var batch, loadMultiple, loadMultipleMock, filteredUpdates, _a, _b, _c, _d, _i, batch_2, update;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0: return [4 /*yield*/, storage.setNewRangeForList(TypeRefs_js_2.ContactTypeRef, contactListId1, id1, id1)];
                                case 1:
                                    _e.sent();
                                    return [4 /*yield*/, storage.setNewRangeForList(TypeRefs_js_2.ContactTypeRef, contactListId2, id4, id4)];
                                case 2:
                                    _e.sent();
                                    batch = [
                                        createUpdate(TypeRefs_js_2.ContactTypeRef, contactListId1, id1, "0" /* OperationType.CREATE */),
                                        createUpdate(TypeRefs_js_2.ContactTypeRef, contactListId1, id2, "0" /* OperationType.CREATE */),
                                        createUpdate(TypeRefs_js_2.ContactTypeRef, contactListId2, id3, "0" /* OperationType.CREATE */),
                                        createUpdate(TypeRefs_js_2.ContactTypeRef, contactListId2, id4, "0" /* OperationType.CREATE */),
                                    ];
                                    loadMultiple = ospec_1["default"].spy(function (typeRef, listId, ids) {
                                        if ((0, tutanota_utils_1.isSameTypeRef)(typeRef, TypeRefs_js_2.ContactTypeRef)) {
                                            if (listId === contactListId1) {
                                                (0, ospec_1["default"])(ids).deepEquals(["id1"]);
                                                return Promise.resolve([
                                                    (0, TypeRefs_js_2.createContact)({
                                                        _id: [listId, id1]
                                                    }),
                                                ]);
                                            }
                                            else if (listId === contactListId2) {
                                                (0, ospec_1["default"])(ids).deepEquals(["id4"]);
                                                return Promise.resolve([
                                                    (0, TypeRefs_js_2.createContact)({
                                                        _id: [listId, "id4"]
                                                    }),
                                                ]);
                                            }
                                        }
                                        throw new Error("should not be reached");
                                    });
                                    loadMultipleMock = (0, tutanota_test_utils_1.mockAttribute)(entityRestClient, entityRestClient.loadMultiple, loadMultiple);
                                    return [4 /*yield*/, cache.entityEventsReceived(makeBatch(batch))];
                                case 3:
                                    filteredUpdates = _e.sent();
                                    (0, tutanota_test_utils_1.unmockAttribute)(loadMultipleMock);
                                    (0, ospec_1["default"])(loadMultiple.callCount).equals(2); // twice for contact creations (per list id)
                                    _a = ospec_1["default"];
                                    return [4 /*yield*/, storage.get(TypeRefs_js_2.ContactTypeRef, contactListId1, id1)];
                                case 4:
                                    _a.apply(void 0, [_e.sent()]).notEquals(null);
                                    _b = ospec_1["default"];
                                    return [4 /*yield*/, storage.get(TypeRefs_js_2.ContactTypeRef, contactListId1, id2)];
                                case 5:
                                    _b.apply(void 0, [_e.sent()]).equals(null);
                                    _c = ospec_1["default"];
                                    return [4 /*yield*/, storage.get(TypeRefs_js_2.ContactTypeRef, contactListId2, id3)];
                                case 6:
                                    _c.apply(void 0, [_e.sent()]).equals(null);
                                    _d = ospec_1["default"];
                                    return [4 /*yield*/, storage.get(TypeRefs_js_2.ContactTypeRef, contactListId2, id4)];
                                case 7:
                                    _d.apply(void 0, [_e.sent()]).notEquals(null);
                                    (0, ospec_1["default"])(filteredUpdates.length).equals(batch.length);
                                    for (_i = 0, batch_2 = batch; _i < batch_2.length; _i++) {
                                        update = batch_2[_i];
                                        (0, ospec_1["default"])(filteredUpdates.includes(update)).equals(true);
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                (0, ospec_1["default"])("update  partially results in NotAuthorizedError ", function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var batch, loadMultiple, loadMultipleMock, filteredUpdates, _a, _b, _c, _d, _i, _e, update;
                        return __generator(this, function (_f) {
                            switch (_f.label) {
                                case 0: return [4 /*yield*/, storage.setNewRangeForList(TypeRefs_js_2.ContactTypeRef, contactListId1, id1, id1)];
                                case 1:
                                    _f.sent();
                                    return [4 /*yield*/, storage.setNewRangeForList(TypeRefs_js_2.ContactTypeRef, contactListId2, id4, id4)];
                                case 2:
                                    _f.sent();
                                    batch = [
                                        createUpdate(TypeRefs_js_2.ContactTypeRef, contactListId1, id1, "0" /* OperationType.CREATE */),
                                        createUpdate(TypeRefs_js_2.ContactTypeRef, contactListId1, id2, "0" /* OperationType.CREATE */),
                                        createUpdate(TypeRefs_js_2.ContactTypeRef, contactListId2, id3, "0" /* OperationType.CREATE */),
                                        createUpdate(TypeRefs_js_2.ContactTypeRef, contactListId2, id4, "0" /* OperationType.CREATE */),
                                    ];
                                    loadMultiple = ospec_1["default"].spy(function (typeRef, listId, ids) {
                                        if ((0, tutanota_utils_1.isSameTypeRef)(typeRef, TypeRefs_js_2.ContactTypeRef)) {
                                            if (listId === contactListId1) {
                                                (0, ospec_1["default"])(ids).deepEquals(["id1"]);
                                                return Promise.resolve([
                                                    (0, TypeRefs_js_2.createContact)({
                                                        _id: [listId, id1]
                                                    }),
                                                ]);
                                            }
                                            else if (listId === contactListId2) {
                                                (0, ospec_1["default"])(ids).deepEquals(["id4"]);
                                                return Promise.reject(new RestError_js_1.NotAuthorizedError("bam"));
                                            }
                                        }
                                        throw new Error("should not be reached");
                                    });
                                    loadMultipleMock = (0, tutanota_test_utils_1.mockAttribute)(entityRestClient, entityRestClient.loadMultiple, loadMultiple);
                                    return [4 /*yield*/, cache.entityEventsReceived(makeBatch(batch))];
                                case 3:
                                    filteredUpdates = _f.sent();
                                    (0, ospec_1["default"])(loadMultiple.callCount).equals(2); // twice for contact creations (per list id)
                                    _a = ospec_1["default"];
                                    return [4 /*yield*/, storage.get(TypeRefs_js_2.ContactTypeRef, contactListId1, id1)];
                                case 4:
                                    _a.apply(void 0, [_f.sent()]).notEquals(null);
                                    _b = ospec_1["default"];
                                    return [4 /*yield*/, storage.get(TypeRefs_js_2.ContactTypeRef, contactListId1, id2)];
                                case 5:
                                    _b.apply(void 0, [_f.sent()]).equals(null);
                                    _c = ospec_1["default"];
                                    return [4 /*yield*/, storage.get(TypeRefs_js_2.ContactTypeRef, contactListId2, id3)];
                                case 6:
                                    _c.apply(void 0, [_f.sent()]).equals(null);
                                    _d = ospec_1["default"];
                                    return [4 /*yield*/, storage.get(TypeRefs_js_2.ContactTypeRef, contactListId2, id4)];
                                case 7:
                                    _d.apply(void 0, [_f.sent()]).equals(null);
                                    (0, ospec_1["default"])(filteredUpdates.length).equals(batch.length - 1);
                                    for (_i = 0, _e = batch.slice(0, 3); _i < _e.length; _i++) {
                                        update = _e[_i];
                                        (0, ospec_1["default"])(filteredUpdates.includes(update)).equals(true);
                                    }
                                    (0, tutanota_test_utils_1.unmockAttribute)(loadMultipleMock);
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
            });
            (0, ospec_1["default"])("element create notifications are not loaded from server", function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, cache.entityEventsReceived(makeBatch([createUpdate(TypeRefs_js_2.MailBodyTypeRef, null, "id1", "0" /* OperationType.CREATE */)]))];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            });
            (0, ospec_1["default"])("element update notifications are not put into cache", function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, cache.entityEventsReceived(makeBatch([createUpdate(TypeRefs_js_2.MailBodyTypeRef, null, "id1", "1" /* OperationType.UPDATE */)]))];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            });
            // element notifications
            (0, ospec_1["default"])("Update event for cached entity is received, it should be redownloaded", function () {
                return __awaiter(this, void 0, void 0, function () {
                    var initialBody, load, loadMock, body;
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                initialBody = createBodyInstance("id1", "hello");
                                return [4 /*yield*/, storage.put(initialBody)];
                            case 1:
                                _a.sent();
                                load = ospec_1["default"].spy(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, createBodyInstance("id1", "goodbye")];
                                }); }); });
                                loadMock = (0, tutanota_test_utils_1.mockAttribute)(entityRestClient, entityRestClient.load, load);
                                return [4 /*yield*/, cache.entityEventsReceived(makeBatch([
                                        createUpdate(TypeRefs_js_2.MailBodyTypeRef, null, createId("id1"), "1" /* OperationType.UPDATE */),
                                    ]))];
                            case 2:
                                _a.sent();
                                (0, ospec_1["default"])(load.callCount).equals(1); // entity is loaded from server
                                // @ts-ignore
                                (0, ospec_1["default"])((0, tutanota_utils_1.isSameTypeRef)(load.args[0], TypeRefs_js_2.MailBodyTypeRef)).equals(true);
                                // @ts-ignore
                                (0, ospec_1["default"])(load.args[1]).equals(createId("id1"));
                                return [4 /*yield*/, cache.load(TypeRefs_js_2.MailBodyTypeRef, createId("id1"))];
                            case 3:
                                body = _a.sent();
                                (0, ospec_1["default"])(body.text).equals("goodbye");
                                (0, ospec_1["default"])(load.callCount).equals(1); // entity is provided from cache
                                (0, tutanota_test_utils_1.unmockAttribute)(loadMock);
                                return [2 /*return*/];
                        }
                    });
                });
            });
            (0, ospec_1["default"])("element should be deleted from the cache when a delete event is received", function () {
                return __awaiter(this, void 0, void 0, function () {
                    var initialBody, load, loadMock;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                initialBody = createBodyInstance("id1", "hello");
                                return [4 /*yield*/, storage.put(initialBody)];
                            case 1:
                                _a.sent();
                                load = ospec_1["default"].spy(function () {
                                    return Promise.reject(new RestError_js_1.NotFoundError("not found"));
                                });
                                loadMock = (0, tutanota_test_utils_1.mockAttribute)(entityRestClient, entityRestClient.load, load);
                                return [4 /*yield*/, cache.entityEventsReceived(makeBatch([
                                        createUpdate(TypeRefs_js_2.MailBodyTypeRef, null, createId("id1"), "2" /* OperationType.DELETE */),
                                    ]))
                                    // entity is not loaded from server when it is deleted
                                ];
                            case 2:
                                _a.sent();
                                // entity is not loaded from server when it is deleted
                                (0, ospec_1["default"])(load.callCount).equals(0);
                                return [4 /*yield*/, (0, tutanota_test_utils_1.assertThrows)(RestError_js_1.NotFoundError, function () { return cache.load(TypeRefs_js_2.MailBodyTypeRef, createId("id1")); })];
                            case 3:
                                _a.sent();
                                (0, tutanota_test_utils_1.unmockAttribute)(loadMock);
                                // we tried to reload the mail body using the rest client, because it was removed from the cache
                                (0, ospec_1["default"])(load.callCount).equals(1);
                                return [2 /*return*/];
                        }
                    });
                });
            });
            (0, ospec_1["default"])("Mail should not be loaded when a move event is received", function () {
                return __awaiter(this, void 0, void 0, function () {
                    var instance, newListId, newInstance, load, loadMock, thrown, result2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                instance = createMailInstance("listId1", "id1", "henlo");
                                return [4 /*yield*/, storage.put(instance)];
                            case 1:
                                _a.sent();
                                newListId = "listid2";
                                newInstance = (0, tutanota_utils_1.clone)(instance);
                                newInstance._id = [newListId, (0, EntityUtils_js_1.getElementId)(instance)];
                                // The moved mail will not be loaded from the server
                                return [4 /*yield*/, cache.entityEventsReceived(makeBatch([
                                        createUpdate(TypeRefs_js_2.MailTypeRef, (0, EntityUtils_js_1.getListId)(instance), (0, EntityUtils_js_1.getElementId)(instance), "2" /* OperationType.DELETE */),
                                        createUpdate(TypeRefs_js_2.MailTypeRef, newListId, (0, EntityUtils_js_1.getElementId)(instance), "0" /* OperationType.CREATE */),
                                    ]))];
                            case 2:
                                // The moved mail will not be loaded from the server
                                _a.sent();
                                load = ospec_1["default"].spy(function () { return Promise.reject(new Error("error from test")); });
                                loadMock = (0, tutanota_test_utils_1.mockAttribute)(entityRestClient, entityRestClient.load, load);
                                return [4 /*yield*/, (0, tutanota_test_utils_1.assertThrows)(Error, function () {
                                        return cache.load(TypeRefs_js_2.MailTypeRef, [(0, EntityUtils_js_1.getListId)(instance), (0, EntityUtils_js_1.getElementId)(instance)]);
                                    })];
                            case 3:
                                thrown = _a.sent();
                                (0, ospec_1["default"])(thrown.message).equals("error from test");
                                (0, ospec_1["default"])(load.callCount).equals(1)("load is called once");
                                return [4 /*yield*/, cache.load(TypeRefs_js_2.MailTypeRef, [newListId, (0, EntityUtils_js_1.getElementId)(instance)])];
                            case 4:
                                result2 = _a.sent();
                                (0, ospec_1["default"])(result2).deepEquals(newInstance)("Cached instance is a newInstance");
                                (0, tutanota_test_utils_1.unmockAttribute)(loadMock);
                                return [2 /*return*/];
                        }
                    });
                });
            });
            (0, ospec_1["default"])("id is in range but instance doesn't exist after moving lower range", function () {
                return __awaiter(this, void 0, void 0, function () {
                    var mails, newListId, loadRange, loadRangeMock, load, loadMock, thrown;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                mails = [1, 2, 3].map(function (i) { return createMailInstance("listId1", "id" + i, "mail" + i); });
                                newListId = "listId2";
                                loadRange = ospec_1["default"].spy(function () { return Promise.resolve(mails); });
                                loadRangeMock = (0, tutanota_test_utils_1.mockAttribute)(entityRestClient, entityRestClient.loadRange, loadRange);
                                return [4 /*yield*/, cache.loadRange(TypeRefs_js_2.MailTypeRef, "listId1", EntityUtils_js_1.GENERATED_MIN_ID, 3, false)];
                            case 1:
                                _a.sent();
                                (0, ospec_1["default"])(loadRange.callCount).equals(1);
                                (0, tutanota_test_utils_1.unmockAttribute)(loadRangeMock);
                                // Move mail event: we don't try to load the mail again, we just update our cached mail
                                return [4 /*yield*/, cache.entityEventsReceived(makeBatch([
                                        createUpdate(TypeRefs_js_2.MailTypeRef, (0, EntityUtils_js_1.getListId)(mails[0]), (0, EntityUtils_js_1.getElementId)(mails[0]), "2" /* OperationType.DELETE */),
                                        createUpdate(TypeRefs_js_2.MailTypeRef, newListId, (0, EntityUtils_js_1.getElementId)(mails[0]), "0" /* OperationType.CREATE */),
                                    ]))
                                    // id3 was moved to another list, which means it is no longer cached, which means we should try to load it again (causing NotFoundError)
                                ];
                            case 2:
                                // Move mail event: we don't try to load the mail again, we just update our cached mail
                                _a.sent();
                                load = ospec_1["default"].spy(function () { return Promise.reject(new Error("This is not the mail you're looking for")); });
                                loadMock = (0, tutanota_test_utils_1.mockAttribute)(entityRestClient, entityRestClient.load, load);
                                return [4 /*yield*/, (0, tutanota_test_utils_1.assertThrows)(Error, function () {
                                        return cache.load(TypeRefs_js_2.MailTypeRef, ["listId1", (0, EntityUtils_js_1.getElementId)(mails[0])]);
                                    })];
                            case 3:
                                thrown = _a.sent();
                                (0, ospec_1["default"])(thrown.message).equals("This is not the mail you're looking for");
                                (0, ospec_1["default"])(load.callCount).equals(1);
                                (0, tutanota_test_utils_1.unmockAttribute)(loadMock);
                                return [2 /*return*/];
                        }
                    });
                });
            });
            (0, ospec_1["default"])("id is in range but instance doesn't exist after moving upper range", function () {
                return __awaiter(this, void 0, void 0, function () {
                    var mails, loadRange, loadRangeMock, load, loadMock, thrown;
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                mails = [
                                    createMailInstance("listId1", "id1", "mail 1"),
                                    createMailInstance("listId1", "id2", "mail 2"),
                                    createMailInstance("listId1", "id3", "mail 3"),
                                ];
                                loadRange = ospec_1["default"].spy(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, Promise.resolve(mails)];
                                }); }); });
                                loadRangeMock = (0, tutanota_test_utils_1.mockAttribute)(entityRestClient, entityRestClient.loadRange, loadRange);
                                return [4 /*yield*/, cache.loadRange(TypeRefs_js_2.MailTypeRef, "listId1", EntityUtils_js_1.GENERATED_MIN_ID, 3, false)];
                            case 1:
                                _a.sent();
                                (0, ospec_1["default"])(loadRange.callCount).equals(1);
                                (0, tutanota_test_utils_1.unmockAttribute)(loadRangeMock);
                                // Move mail event: we don't try to load the mail again, we just update our cached mail
                                return [4 /*yield*/, cache.entityEventsReceived(makeBatch([
                                        createUpdate(TypeRefs_js_2.MailTypeRef, "listId1", "id3", "2" /* OperationType.DELETE */),
                                        createUpdate(TypeRefs_js_2.MailTypeRef, "listId2", "id3", "0" /* OperationType.CREATE */),
                                    ]))
                                    // id3 was moved to another list, which means it is no longer cached, which means we should try to load it again when requested (causing NotFoundError)
                                ];
                            case 2:
                                // Move mail event: we don't try to load the mail again, we just update our cached mail
                                _a.sent();
                                load = ospec_1["default"].spy(function () {
                                    return __awaiter(this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            throw new Error("This is not the mail you're looking for");
                                        });
                                    });
                                });
                                loadMock = (0, tutanota_test_utils_1.mockAttribute)(entityRestClient, entityRestClient.load, load);
                                return [4 /*yield*/, (0, tutanota_test_utils_1.assertThrows)(Error, function () { return cache.load(TypeRefs_js_2.MailTypeRef, ["listId1", "id3"]); })];
                            case 3:
                                thrown = _a.sent();
                                (0, ospec_1["default"])(thrown.message).equals("This is not the mail you're looking for");
                                //load was called when we tried to load the moved mail when we tried to load the moved mail
                                (0, ospec_1["default"])(load.callCount).equals(1);
                                (0, tutanota_test_utils_1.unmockAttribute)(loadMock);
                                return [2 /*return*/];
                        }
                    });
                });
            });
            // list element notifications
            (0, ospec_1["default"])("list element create notifications are not put into cache", function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, cache.entityEventsReceived(makeBatch([
                                    createUpdate(TypeRefs_js_2.MailTypeRef, "listId1", createId("id1"), "0" /* OperationType.CREATE */),
                                ]))];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            });
            (0, ospec_1["default"])("list element update notifications are not put into cache", function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, cache.entityEventsReceived(makeBatch([
                                    createUpdate(TypeRefs_js_2.MailTypeRef, "listId1", createId("id1"), "1" /* OperationType.UPDATE */),
                                ]))];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            });
            (0, ospec_1["default"])("list element is updated in cache", function () {
                return __awaiter(this, void 0, void 0, function () {
                    var initialMail, mailUpdate, load, loadMock, mail;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                initialMail = createMailInstance("listId1", createId("id1"), "hello");
                                return [4 /*yield*/, storage.put(initialMail)];
                            case 1:
                                _a.sent();
                                mailUpdate = createMailInstance("listId1", createId("id1"), "goodbye");
                                load = ospec_1["default"].spy(function (typeRef, id) {
                                    (0, ospec_1["default"])((0, tutanota_utils_1.isSameTypeRef)(typeRef, TypeRefs_js_2.MailTypeRef)).equals(true);
                                    (0, ospec_1["default"])(id).deepEquals(["listId1", createId("id1")]);
                                    return Promise.resolve(mailUpdate);
                                });
                                loadMock = (0, tutanota_test_utils_1.mockAttribute)(entityRestClient, entityRestClient.load, load);
                                return [4 /*yield*/, cache.entityEventsReceived(makeBatch([
                                        createUpdate(TypeRefs_js_2.MailTypeRef, "listId1", createId("id1"), "1" /* OperationType.UPDATE */),
                                    ]))];
                            case 2:
                                _a.sent();
                                (0, ospec_1["default"])(load.callCount).equals(1); // entity is loaded from server
                                return [4 /*yield*/, cache.load(TypeRefs_js_2.MailTypeRef, ["listId1", createId("id1")])];
                            case 3:
                                mail = _a.sent();
                                (0, ospec_1["default"])(mail.subject).equals("goodbye");
                                (0, ospec_1["default"])(load.callCount).equals(1); // entity is provided from cache
                                (0, tutanota_test_utils_1.unmockAttribute)(loadMock);
                                return [2 /*return*/];
                        }
                    });
                });
            });
            (0, ospec_1["default"])("when deleted from a range, then the remaining range will still be retrieved from the cache", function () {
                return __awaiter(this, void 0, void 0, function () {
                    var originalMails, mails;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, setupMailList(true, true)
                                // no load should be called
                            ];
                            case 1:
                                originalMails = _a.sent();
                                // no load should be called
                                return [4 /*yield*/, cache.entityEventsReceived(makeBatch([
                                        createUpdate(TypeRefs_js_2.MailTypeRef, "listId1", createId("id2"), "2" /* OperationType.DELETE */),
                                    ]))];
                            case 2:
                                // no load should be called
                                _a.sent();
                                return [4 /*yield*/, cache.loadRange(TypeRefs_js_2.MailTypeRef, "listId1", EntityUtils_js_1.GENERATED_MIN_ID, 4, false)
                                    // The entity is provided from the cache
                                ];
                            case 3:
                                mails = _a.sent();
                                // The entity is provided from the cache
                                (0, ospec_1["default"])(mails).deepEquals([originalMails[0], originalMails[2]]);
                                return [2 /*return*/];
                        }
                    });
                });
            });
            ospec_1["default"].spec("membership changes", function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        (0, ospec_1["default"])("no membership change does not delete an entity", function () {
                            return __awaiter(this, void 0, void 0, function () {
                                var userId, calendarGroupId, initialUser, eventId, event, _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            userId = "userId";
                                            calendarGroupId = "calendarGroupId";
                                            initialUser = (0, TypeRefs_js_1.createUser)({
                                                _id: userId,
                                                memberships: [
                                                    (0, TypeRefs_js_1.createGroupMembership)({
                                                        _id: "mailShipId",
                                                        groupType: TutanotaConstants_js_1.GroupType.Mail
                                                    }),
                                                    (0, TypeRefs_js_1.createGroupMembership)({
                                                        _id: "calendarShipId",
                                                        group: calendarGroupId,
                                                        groupType: TutanotaConstants_js_1.GroupType.Calendar
                                                    })
                                                ]
                                            });
                                            entityRestClient.load = (0, testdouble_1.func)();
                                            (0, testdouble_1.when)(entityRestClient.load(TypeRefs_js_1.UserTypeRef, userId)).thenResolve(initialUser);
                                            return [4 /*yield*/, storage.put(initialUser)];
                                        case 1:
                                            _b.sent();
                                            eventId = ["eventListId", "eventId"];
                                            event = (0, TypeRefs_js_2.createCalendarEvent)({
                                                _id: eventId,
                                                _ownerGroup: calendarGroupId
                                            });
                                            return [4 /*yield*/, storage.put(event)];
                                        case 2:
                                            _b.sent();
                                            storage.getUserId = function () { return userId; };
                                            return [4 /*yield*/, cache.entityEventsReceived(makeBatch([
                                                    createUpdate(TypeRefs_js_1.UserTypeRef, "", userId, "1" /* OperationType.UPDATE */)
                                                ]))];
                                        case 3:
                                            _b.sent();
                                            _a = ospec_1["default"];
                                            return [4 /*yield*/, storage.get(TypeRefs_js_2.CalendarEventTypeRef, (0, EntityUtils_js_1.listIdPart)(eventId), (0, EntityUtils_js_1.elementIdPart)(eventId))];
                                        case 4:
                                            _a.apply(void 0, [_b.sent()])
                                                .notEquals(null)("Event has been evicted from cache");
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        });
                        (0, ospec_1["default"])("membership change deletes an element entity", function () {
                            return __awaiter(this, void 0, void 0, function () {
                                var userId, calendarGroupId, initialUser, updatedUser, groupRootId, groupRoot, _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            userId = "userId";
                                            calendarGroupId = "calendarGroupId";
                                            initialUser = (0, TypeRefs_js_1.createUser)({
                                                _id: userId,
                                                memberships: [
                                                    (0, TypeRefs_js_1.createGroupMembership)({
                                                        _id: "mailShipId",
                                                        groupType: TutanotaConstants_js_1.GroupType.Mail
                                                    }),
                                                    (0, TypeRefs_js_1.createGroupMembership)({
                                                        _id: "calendarShipId",
                                                        group: calendarGroupId,
                                                        groupType: TutanotaConstants_js_1.GroupType.Calendar
                                                    })
                                                ]
                                            });
                                            return [4 /*yield*/, storage.put(initialUser)];
                                        case 1:
                                            _b.sent();
                                            updatedUser = (0, TypeRefs_js_1.createUser)({
                                                _id: userId,
                                                memberships: [
                                                    (0, TypeRefs_js_1.createGroupMembership)({
                                                        _id: "mailShipId",
                                                        groupType: TutanotaConstants_js_1.GroupType.Mail
                                                    }),
                                                ]
                                            });
                                            entityRestClient.load = (0, testdouble_1.func)();
                                            (0, testdouble_1.when)(entityRestClient.load(TypeRefs_js_1.UserTypeRef, userId)).thenResolve(updatedUser);
                                            groupRootId = "groupRootId";
                                            groupRoot = (0, TypeRefs_js_1.createGroupRoot)({
                                                _id: groupRootId,
                                                _ownerGroup: calendarGroupId
                                            });
                                            return [4 /*yield*/, storage.put(groupRoot)];
                                        case 2:
                                            _b.sent();
                                            storage.getUserId = function () { return userId; };
                                            return [4 /*yield*/, cache.entityEventsReceived(makeBatch([
                                                    createUpdate(TypeRefs_js_1.UserTypeRef, "", userId, "1" /* OperationType.UPDATE */)
                                                ]))];
                                        case 3:
                                            _b.sent();
                                            _a = ospec_1["default"];
                                            return [4 /*yield*/, storage.get(TypeRefs_js_2.CalendarEventTypeRef, null, groupRootId)];
                                        case 4:
                                            _a.apply(void 0, [_b.sent()])
                                                .equals(null)("GroupRoot has been evicted from cache");
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        });
                        (0, ospec_1["default"])("membership change deletes a list entity", function () {
                            return __awaiter(this, void 0, void 0, function () {
                                var userId, calendarGroupId, initialUser, updatedUser, eventId, event, _a, deletedRange;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            userId = "userId";
                                            calendarGroupId = "calendarGroupId";
                                            initialUser = (0, TypeRefs_js_1.createUser)({
                                                _id: userId,
                                                memberships: [
                                                    (0, TypeRefs_js_1.createGroupMembership)({
                                                        _id: "mailShipId",
                                                        groupType: TutanotaConstants_js_1.GroupType.Mail
                                                    }),
                                                    (0, TypeRefs_js_1.createGroupMembership)({
                                                        _id: "calendarShipId",
                                                        group: calendarGroupId,
                                                        groupType: TutanotaConstants_js_1.GroupType.Calendar
                                                    })
                                                ]
                                            });
                                            return [4 /*yield*/, storage.put(initialUser)];
                                        case 1:
                                            _b.sent();
                                            updatedUser = (0, TypeRefs_js_1.createUser)({
                                                _id: userId,
                                                memberships: [
                                                    (0, TypeRefs_js_1.createGroupMembership)({
                                                        _id: "mailShipId",
                                                        groupType: TutanotaConstants_js_1.GroupType.Mail
                                                    }),
                                                ]
                                            });
                                            entityRestClient.load = (0, testdouble_1.func)();
                                            (0, testdouble_1.when)(entityRestClient.load(TypeRefs_js_1.UserTypeRef, userId)).thenResolve(updatedUser);
                                            eventId = ["eventListId", "eventId"];
                                            event = (0, TypeRefs_js_2.createCalendarEvent)({
                                                _id: eventId,
                                                _ownerGroup: calendarGroupId
                                            });
                                            return [4 /*yield*/, storage.put(event)];
                                        case 2:
                                            _b.sent();
                                            storage.getUserId = function () { return userId; };
                                            return [4 /*yield*/, cache.entityEventsReceived(makeBatch([
                                                    createUpdate(TypeRefs_js_1.UserTypeRef, "", userId, "1" /* OperationType.UPDATE */)
                                                ]))];
                                        case 3:
                                            _b.sent();
                                            _a = ospec_1["default"];
                                            return [4 /*yield*/, storage.get(TypeRefs_js_2.CalendarEventTypeRef, (0, EntityUtils_js_1.listIdPart)(eventId), (0, EntityUtils_js_1.elementIdPart)(eventId))];
                                        case 4:
                                            _a.apply(void 0, [_b.sent()])
                                                .equals(null)("Event has been evicted from cache");
                                            return [4 /*yield*/, storage.getRangeForList(TypeRefs_js_2.CalendarEventTypeRef, (0, EntityUtils_js_1.listIdPart)(eventId))];
                                        case 5:
                                            deletedRange = _b.sent();
                                            (0, ospec_1["default"])(deletedRange).equals(null);
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        });
                        (0, ospec_1["default"])("membership change but for another user does nothing", function () {
                            return __awaiter(this, void 0, void 0, function () {
                                var userId, calendarGroupId, initialUser, updatedUser, eventId, event, _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            userId = "userId";
                                            calendarGroupId = "calendarGroupId";
                                            initialUser = (0, TypeRefs_js_1.createUser)({
                                                _id: userId,
                                                memberships: [
                                                    (0, TypeRefs_js_1.createGroupMembership)({
                                                        _id: "mailShipId",
                                                        groupType: TutanotaConstants_js_1.GroupType.Mail
                                                    }),
                                                    (0, TypeRefs_js_1.createGroupMembership)({
                                                        _id: "calendarShipId",
                                                        group: calendarGroupId,
                                                        groupType: TutanotaConstants_js_1.GroupType.Calendar
                                                    })
                                                ]
                                            });
                                            return [4 /*yield*/, storage.put(initialUser)];
                                        case 1:
                                            _b.sent();
                                            updatedUser = (0, TypeRefs_js_1.createUser)({
                                                _id: userId,
                                                memberships: [
                                                    (0, TypeRefs_js_1.createGroupMembership)({
                                                        _id: "mailShipId",
                                                        groupType: TutanotaConstants_js_1.GroupType.Mail
                                                    }),
                                                ]
                                            });
                                            entityRestClient.load = (0, testdouble_1.func)();
                                            (0, testdouble_1.when)(entityRestClient.load(TypeRefs_js_1.UserTypeRef, userId)).thenResolve(updatedUser);
                                            eventId = ["eventListId", "eventId"];
                                            event = (0, TypeRefs_js_2.createCalendarEvent)({
                                                _id: eventId,
                                                _ownerGroup: calendarGroupId
                                            });
                                            return [4 /*yield*/, storage.put(event)];
                                        case 2:
                                            _b.sent();
                                            storage.getUserId = function () { return "anotherUserId"; };
                                            return [4 /*yield*/, cache.entityEventsReceived(makeBatch([
                                                    createUpdate(TypeRefs_js_1.UserTypeRef, "", userId, "1" /* OperationType.UPDATE */)
                                                ]))];
                                        case 3:
                                            _b.sent();
                                            _a = ospec_1["default"];
                                            return [4 /*yield*/, storage.get(TypeRefs_js_2.CalendarEventTypeRef, (0, EntityUtils_js_1.listIdPart)(eventId), (0, EntityUtils_js_1.elementIdPart)(eventId))];
                                        case 4:
                                            _a.apply(void 0, [_b.sent()])
                                                .notEquals(null)("Event has been evicted from cache");
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        });
                        return [2 /*return*/];
                    });
                });
            });
        }); // entityEventsReceived
        (0, ospec_1["default"])("when reading from the cache, the entities will be cloned", function () {
            return __awaiter(this, void 0, void 0, function () {
                var body, body1, body2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            body = createBodyInstance("id1", "hello");
                            return [4 /*yield*/, storage.put(body)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, cache.load(TypeRefs_js_2.MailBodyTypeRef, createId("id1"))];
                        case 2:
                            body1 = _a.sent();
                            (0, ospec_1["default"])(body1 == body).equals(false);
                            return [4 /*yield*/, cache.load(TypeRefs_js_2.MailBodyTypeRef, createId("id1"))];
                        case 3:
                            body2 = _a.sent();
                            (0, ospec_1["default"])(body1 == body2).equals(false);
                            return [2 /*return*/];
                    }
                });
            });
        });
        (0, ospec_1["default"])("when reading from the cache, the entities will be cloned pt.2", function () {
            return __awaiter(this, void 0, void 0, function () {
                var mail, mail1, mail2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mail = createMailInstance("listId1", "id1", "hello");
                            return [4 /*yield*/, storage.put(mail)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, cache.load(TypeRefs_js_2.MailTypeRef, ["listId1", createId("id1")])];
                        case 2:
                            mail1 = _a.sent();
                            (0, ospec_1["default"])(mail1 == mail).equals(false);
                            return [4 /*yield*/, cache.load(TypeRefs_js_2.MailTypeRef, ["listId1", createId("id1")])];
                        case 3:
                            mail2 = _a.sent();
                            (0, ospec_1["default"])(mail1 == mail2).equals(false);
                            return [2 /*return*/];
                    }
                });
            });
        });
        function setupMailList(loadedUntilMinId, loadedUntilMaxId) {
            return __awaiter(this, void 0, void 0, function () {
                var mail1, mail2, mail3, startId, count, loadRange, mock, mails;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mail1 = createMailInstance("listId1", "id1", "hello1");
                            mail2 = createMailInstance("listId1", "id2", "hello2");
                            mail3 = createMailInstance("listId1", "id3", "hello3");
                            startId = loadedUntilMaxId ? EntityUtils_js_1.GENERATED_MAX_ID : createId("id4");
                            count = loadedUntilMinId ? 4 : 3;
                            loadRange = ospec_1["default"].spy(function (typeRef, listId, start, countParam, reverse) {
                                (0, ospec_1["default"])((0, tutanota_utils_1.isSameTypeRef)(typeRef, TypeRefs_js_2.MailTypeRef)).equals(true);
                                (0, ospec_1["default"])(listId).equals("listId1");
                                (0, ospec_1["default"])(start).equals(startId);
                                (0, ospec_1["default"])(countParam).equals(count);
                                (0, ospec_1["default"])(reverse).equals(true);
                                return Promise.resolve([mail3, mail2, mail1]);
                            });
                            mock = (0, tutanota_test_utils_1.mockAttribute)(entityRestClient, entityRestClient.loadRange, loadRange);
                            return [4 /*yield*/, cache.loadRange(TypeRefs_js_2.MailTypeRef, "listId1", startId, count, true)];
                        case 1:
                            mails = _a.sent();
                            (0, ospec_1["default"])(mails).deepEquals((0, tutanota_utils_1.clone)([mail3, mail2, mail1]));
                            (0, ospec_1["default"])(loadRange.callCount).equals(1); // entities are loaded from server
                            (0, tutanota_test_utils_1.unmockAttribute)(mock);
                            return [2 /*return*/, (0, tutanota_utils_1.clone)([mail1, mail2, mail3])];
                    }
                });
            });
        }
        (0, ospec_1["default"])("when reading from the cache, the entities will be cloned (range requests)", function () {
            return __awaiter(this, void 0, void 0, function () {
                var originalMails, mails;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, setupMailList(true, true)
                            // the range request will be provided from the cache
                        ];
                        case 1:
                            originalMails = _a.sent();
                            return [4 /*yield*/, cache.loadRange(TypeRefs_js_2.MailTypeRef, "listId1", EntityUtils_js_1.GENERATED_MIN_ID, 3, false)];
                        case 2:
                            mails = _a.sent();
                            (0, ospec_1["default"])(mails).deepEquals(originalMails);
                            (0, ospec_1["default"])(mails[0] == originalMails[0]).equals(false);
                            (0, ospec_1["default"])(mails[1] == originalMails[1]).equals(false);
                            (0, ospec_1["default"])(mails[2] == originalMails[2]).equals(false);
                            return [2 /*return*/];
                    }
                });
            });
        });
        (0, ospec_1["default"])("list elements are provided from cache - range min to max loaded", function () {
            return __awaiter(this, void 0, void 0, function () {
                var originalMails, mails;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, setupMailList(true, true)];
                        case 1:
                            originalMails = _a.sent();
                            return [4 /*yield*/, cache.loadRange(TypeRefs_js_2.MailTypeRef, "listId1", EntityUtils_js_1.GENERATED_MIN_ID, 3, false)];
                        case 2:
                            mails = _a.sent();
                            (0, ospec_1["default"])(mails).deepEquals(originalMails);
                            return [4 /*yield*/, cache.loadRange(TypeRefs_js_2.MailTypeRef, "listId1", EntityUtils_js_1.GENERATED_MIN_ID, 1, false)];
                        case 3:
                            mails = _a.sent();
                            (0, ospec_1["default"])(mails).deepEquals(originalMails.slice(0, 1));
                            return [4 /*yield*/, cache.loadRange(TypeRefs_js_2.MailTypeRef, "listId1", EntityUtils_js_1.GENERATED_MIN_ID, 4, false)];
                        case 4:
                            mails = _a.sent();
                            (0, ospec_1["default"])(mails).deepEquals(originalMails);
                            return [4 /*yield*/, cache.loadRange(TypeRefs_js_2.MailTypeRef, "listId1", createId("id1"), 2, false)];
                        case 5:
                            mails = _a.sent();
                            (0, ospec_1["default"])(mails).deepEquals(originalMails.slice(1, 3));
                            return [4 /*yield*/, cache.loadRange(TypeRefs_js_2.MailTypeRef, "listId1", EntityUtils_js_1.GENERATED_MAX_ID, 3, true)];
                        case 6:
                            mails = _a.sent();
                            (0, ospec_1["default"])(mails).deepEquals([originalMails[2], originalMails[1], originalMails[0]]);
                            return [4 /*yield*/, cache.loadRange(TypeRefs_js_2.MailTypeRef, "listId1", createId("id2"), 1, true)];
                        case 7:
                            mails = _a.sent();
                            (0, ospec_1["default"])(mails).deepEquals(originalMails.slice(0, 1));
                            return [4 /*yield*/, cache.loadRange(TypeRefs_js_2.MailTypeRef, "listId1", createId("id2"), 3, true)];
                        case 8:
                            mails = _a.sent();
                            (0, ospec_1["default"])(mails).deepEquals(originalMails.slice(0, 1));
                            return [2 /*return*/];
                    }
                });
            });
        });
        (0, ospec_1["default"])("list elements are provided from cache - range min to id3 loaded", function () {
            return __awaiter(this, void 0, void 0, function () {
                var originalMails, mails;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, setupMailList(true, false)];
                        case 1:
                            originalMails = _a.sent();
                            return [4 /*yield*/, cache.loadRange(TypeRefs_js_2.MailTypeRef, "listId1", EntityUtils_js_1.GENERATED_MIN_ID, 3, false)];
                        case 2:
                            mails = _a.sent();
                            (0, ospec_1["default"])(mails).deepEquals(originalMails);
                            return [4 /*yield*/, cache.loadRange(TypeRefs_js_2.MailTypeRef, "listId1", EntityUtils_js_1.GENERATED_MIN_ID, 1, false)];
                        case 3:
                            mails = _a.sent();
                            (0, ospec_1["default"])(mails).deepEquals(originalMails.slice(0, 1));
                            return [4 /*yield*/, cache.loadRange(TypeRefs_js_2.MailTypeRef, "listId1", createId("id1"), 2, false)];
                        case 4:
                            mails = _a.sent();
                            (0, ospec_1["default"])(mails).deepEquals(originalMails.slice(1, 3));
                            return [4 /*yield*/, cache.loadRange(TypeRefs_js_2.MailTypeRef, "listId1", createId("id2"), 1, true)];
                        case 5:
                            mails = _a.sent();
                            (0, ospec_1["default"])(mails).deepEquals(originalMails.slice(0, 1));
                            return [4 /*yield*/, cache.loadRange(TypeRefs_js_2.MailTypeRef, "listId1", createId("id2"), 3, true)];
                        case 6:
                            mails = _a.sent();
                            (0, ospec_1["default"])(mails).deepEquals(originalMails.slice(0, 1));
                            return [4 /*yield*/, cache.loadRange(TypeRefs_js_2.MailTypeRef, "listId1", createId("id0"), 3, true)];
                        case 7:
                            mails = _a.sent();
                            (0, ospec_1["default"])(mails).deepEquals([]);
                            return [2 /*return*/];
                    }
                });
            });
        });
        (0, ospec_1["default"])("list elements are provided from cache - range max to id1 loaded", function () {
            return __awaiter(this, void 0, void 0, function () {
                var originalMails, mails;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, setupMailList(false, true)];
                        case 1:
                            originalMails = _a.sent();
                            return [4 /*yield*/, cache.loadRange(TypeRefs_js_2.MailTypeRef, "listId1", EntityUtils_js_1.GENERATED_MAX_ID, 3, true)];
                        case 2:
                            mails = _a.sent();
                            (0, ospec_1["default"])(mails).deepEquals([originalMails[2], originalMails[1], originalMails[0]]);
                            return [4 /*yield*/, cache.loadRange(TypeRefs_js_2.MailTypeRef, "listId1", EntityUtils_js_1.GENERATED_MAX_ID, 2, true)];
                        case 3:
                            mails = _a.sent();
                            (0, ospec_1["default"])(mails).deepEquals([originalMails[2], originalMails[1]]);
                            return [4 /*yield*/, cache.loadRange(TypeRefs_js_2.MailTypeRef, "listId1", createId("id5"), 1, false)];
                        case 4:
                            mails = _a.sent();
                            (0, ospec_1["default"])(mails).deepEquals([]);
                            return [4 /*yield*/, cache.loadRange(TypeRefs_js_2.MailTypeRef, "listId1", createId("id2"), 1, true)];
                        case 5:
                            mails = _a.sent();
                            (0, ospec_1["default"])(mails).deepEquals(originalMails.slice(0, 1));
                            return [4 /*yield*/, cache.loadRange(TypeRefs_js_2.MailTypeRef, "listId1", createId("id1"), 2, false)];
                        case 6:
                            mails = _a.sent();
                            (0, ospec_1["default"])(mails).deepEquals(originalMails.slice(1, 3));
                            return [2 /*return*/];
                    }
                });
            });
        });
        (0, ospec_1["default"])("load list elements partly from server - range min to id3 loaded", function () {
            return __awaiter(this, void 0, void 0, function () {
                var mail4, cachedMails, loadRange, loadRangeMock, result, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            mail4 = createMailInstance("listId1", "id4", "subject4");
                            return [4 /*yield*/, setupMailList(true, false)];
                        case 1:
                            cachedMails = _b.sent();
                            loadRange = ospec_1["default"].spy(function (typeRef, listId, start, count, reverse) {
                                (0, ospec_1["default"])((0, tutanota_utils_1.isSameTypeRef)(typeRef, TypeRefs_js_2.MailTypeRef)).equals(true);
                                (0, ospec_1["default"])(listId).equals("listId1");
                                (0, ospec_1["default"])(start).equals((0, EntityUtils_js_1.getElementId)(cachedMails[2]));
                                (0, ospec_1["default"])(count).equals(1);
                                (0, ospec_1["default"])(reverse).equals(false);
                                return Promise.resolve([mail4]);
                            });
                            loadRangeMock = (0, tutanota_test_utils_1.mockAttribute)(entityRestClient, entityRestClient.loadRange, loadRange);
                            return [4 /*yield*/, cache.loadRange(TypeRefs_js_2.MailTypeRef, "listId1", EntityUtils_js_1.GENERATED_MIN_ID, 4, false)];
                        case 2:
                            result = _b.sent();
                            (0, ospec_1["default"])(result).deepEquals([cachedMails[0], cachedMails[1], cachedMails[2], (0, tutanota_utils_1.clone)(mail4)]);
                            _a = ospec_1["default"];
                            return [4 /*yield*/, storage.get(TypeRefs_js_2.MailTypeRef, (0, EntityUtils_js_1.getListId)(mail4), (0, EntityUtils_js_1.getElementId)(mail4))];
                        case 3:
                            _a.apply(void 0, [(_b.sent())]).deepEquals(mail4);
                            (0, ospec_1["default"])(loadRange.callCount).equals(1); // entities are provided from server
                            (0, tutanota_test_utils_1.unmockAttribute)(loadRangeMock);
                            return [2 /*return*/];
                    }
                });
            });
        });
        (0, ospec_1["default"])("when part of a range is already in cache, load range should only try to load what it doesn't have already", function () {
            return __awaiter(this, void 0, void 0, function () {
                var mail0, cachedMails, loadRange, loadRangeMock, result, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            mail0 = createMailInstance("listId1", "id0", "subject0");
                            return [4 /*yield*/, setupMailList(false, true)];
                        case 1:
                            cachedMails = _b.sent();
                            loadRange = ospec_1["default"].spy(function (typeRef, listId, start, count, reverse) {
                                (0, ospec_1["default"])((0, tutanota_utils_1.isSameTypeRef)(typeRef, TypeRefs_js_2.MailTypeRef)).equals(true);
                                (0, ospec_1["default"])(listId).equals("listId1");
                                (0, ospec_1["default"])(start).equals((0, EntityUtils_js_1.getElementId)(cachedMails[0]));
                                (0, ospec_1["default"])(count).equals(3);
                                (0, ospec_1["default"])(reverse).equals(true);
                                return Promise.resolve([mail0]);
                            });
                            loadRangeMock = (0, tutanota_test_utils_1.mockAttribute)(entityRestClient, entityRestClient.loadRange, loadRange);
                            return [4 /*yield*/, cache.loadRange(TypeRefs_js_2.MailTypeRef, "listId1", createId("id2"), 4, true)];
                        case 2:
                            result = _b.sent();
                            _a = ospec_1["default"];
                            return [4 /*yield*/, storage.get(TypeRefs_js_2.MailTypeRef, (0, EntityUtils_js_1.getListId)(mail0), (0, EntityUtils_js_1.getElementId)(mail0))];
                        case 3:
                            _a.apply(void 0, [(_b.sent())]).deepEquals(mail0);
                            (0, ospec_1["default"])(result).deepEquals([cachedMails[0], (0, tutanota_utils_1.clone)(mail0)]);
                            (0, ospec_1["default"])(loadRange.callCount).equals(1); // entities are provided from server
                            (0, tutanota_test_utils_1.unmockAttribute)(loadRangeMock);
                            return [2 /*return*/];
                    }
                });
            });
        });
        (0, ospec_1["default"])("load list elements partly from server - range max to id2 loaded - loadMore", function () {
            return __awaiter(this, void 0, void 0, function () {
                var mail0, cachedMails, loadRange, mock, result, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            mail0 = createMailInstance("listId1", "id0", "subject0");
                            return [4 /*yield*/, setupMailList(false, true)];
                        case 1:
                            cachedMails = _b.sent();
                            loadRange = ospec_1["default"].spy(function (typeRef, listId, start, count, reverse) {
                                (0, ospec_1["default"])((0, tutanota_utils_1.isSameTypeRef)(typeRef, TypeRefs_js_2.MailTypeRef)).equals(true);
                                (0, ospec_1["default"])(listId).equals("listId1");
                                (0, ospec_1["default"])(start).equals(cachedMails[0]._id[1]);
                                (0, ospec_1["default"])(count).equals(4);
                                (0, ospec_1["default"])(reverse).equals(true);
                                return Promise.resolve([mail0]);
                            });
                            mock = (0, tutanota_test_utils_1.mockAttribute)(entityRestClient, entityRestClient.loadRange, loadRange);
                            return [4 /*yield*/, cache.loadRange(TypeRefs_js_2.MailTypeRef, "listId1", createId("id1"), 4, true)];
                        case 2:
                            result = _b.sent();
                            _a = ospec_1["default"];
                            return [4 /*yield*/, storage.get(TypeRefs_js_2.MailTypeRef, (0, EntityUtils_js_1.getListId)(mail0), (0, EntityUtils_js_1.getElementId)(mail0))];
                        case 3:
                            _a.apply(void 0, [(_b.sent())]).deepEquals(mail0);
                            (0, ospec_1["default"])(result).deepEquals([(0, tutanota_utils_1.clone)(mail0)]);
                            (0, ospec_1["default"])(loadRange.callCount).equals(1); // entities are provided from server
                            (0, tutanota_test_utils_1.unmockAttribute)(mock);
                            return [2 /*return*/];
                    }
                });
            });
        });
        (0, ospec_1["default"])("load range starting outside of stored range - not reverse", function () {
            return __awaiter(this, void 0, void 0, function () {
                var listId, mail5, mail6, cachedMails, loadRange, loadRangeMock, result, result2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            listId = "listId1";
                            mail5 = createMailInstance(listId, "id5", "subject5");
                            mail6 = createMailInstance(listId, "id6", "subject6");
                            return [4 /*yield*/, setupMailList(true, false)];
                        case 1:
                            cachedMails = _a.sent();
                            loadRange = ospec_1["default"].spy(function (typeRef, listId, start, count, reverse) {
                                (0, ospec_1["default"])((0, tutanota_utils_1.isSameTypeRef)(typeRef, TypeRefs_js_2.MailTypeRef)).equals(true);
                                (0, ospec_1["default"])(listId).equals(listId);
                                (0, ospec_1["default"])(start).equals(createId("id4"));
                                (0, ospec_1["default"])(count).equals(DefaultEntityRestCache_js_1.EXTEND_RANGE_MIN_CHUNK_SIZE);
                                // the cache actually loads from the end of the range which is id4
                                //TODO  shouldn't it be id3?
                                (0, ospec_1["default"])(reverse).equals(false);
                                return Promise.resolve([mail5, mail6]);
                            });
                            loadRangeMock = (0, tutanota_test_utils_1.mockAttribute)(entityRestClient, entityRestClient.loadRange, loadRange);
                            return [4 /*yield*/, cache.loadRange(TypeRefs_js_2.MailTypeRef, listId, createId("id5"), 4, false)];
                        case 2:
                            result = _a.sent();
                            (0, ospec_1["default"])(loadRange.callCount).equals(1); // entities are provided from server
                            (0, ospec_1["default"])(result).deepEquals([(0, tutanota_utils_1.clone)(mail6)]);
                            return [4 /*yield*/, cache.loadRange(TypeRefs_js_2.MailTypeRef, listId, createId("id1"), 4, false)];
                        case 3:
                            result2 = _a.sent();
                            (0, ospec_1["default"])(loadRange.callCount).equals(1); // entities are provided from cache
                            (0, ospec_1["default"])(result2).deepEquals([cachedMails[1], cachedMails[2], (0, tutanota_utils_1.clone)(mail5), (0, tutanota_utils_1.clone)(mail6)]);
                            (0, tutanota_test_utils_1.unmockAttribute)(loadRangeMock);
                            return [2 /*return*/];
                    }
                });
            });
        });
        (0, ospec_1["default"])("load range starting outside of stored range - reverse", function () {
            return __awaiter(this, void 0, void 0, function () {
                var mailFirst, mailSecond, loadRange, mock, result, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            mailFirst = createMailInstance("listId1", "ic5", "subject") // use ids smaller than "id1"
                            ;
                            mailSecond = createMailInstance("listId1", "ic8", "subject");
                            return [4 /*yield*/, setupMailList(false, false)];
                        case 1:
                            _b.sent();
                            loadRange = ospec_1["default"].spy(function (typeRef, listId, start, count, reverse) {
                                (0, ospec_1["default"])((0, tutanota_utils_1.isSameTypeRef)(typeRef, TypeRefs_js_2.MailTypeRef)).equals(true);
                                (0, ospec_1["default"])(listId).equals("listId1");
                                // the cache actually loads from the end of the range which is id1
                                (0, ospec_1["default"])(start).equals(createId("id1"));
                                (0, ospec_1["default"])(count).equals(DefaultEntityRestCache_js_1.EXTEND_RANGE_MIN_CHUNK_SIZE);
                                (0, ospec_1["default"])(reverse).equals(true);
                                return Promise.resolve([mailSecond, mailFirst]);
                            });
                            mock = (0, tutanota_test_utils_1.mockAttribute)(entityRestClient, entityRestClient.loadRange, loadRange);
                            return [4 /*yield*/, cache.loadRange(TypeRefs_js_2.MailTypeRef, "listId1", createId("ic6"), 4, true)];
                        case 2:
                            result = _b.sent();
                            (0, ospec_1["default"])(result).deepEquals([(0, tutanota_utils_1.clone)(mailFirst)]);
                            _a = ospec_1["default"];
                            return [4 /*yield*/, storage.get(TypeRefs_js_2.MailTypeRef, (0, EntityUtils_js_1.getListId)(mailFirst), (0, EntityUtils_js_1.getElementId)(mailFirst))];
                        case 3:
                            _a.apply(void 0, [(_b.sent())]).deepEquals(mailFirst);
                            (0, ospec_1["default"])(loadRange.callCount).equals(1); // entities are provided from server
                            (0, tutanota_test_utils_1.unmockAttribute)(mock);
                            return [2 /*return*/];
                    }
                });
            });
        });
        (0, ospec_1["default"])("reverse load range starting outside of stored range - no new elements", function () {
            return __awaiter(this, void 0, void 0, function () {
                var loadRange, mock, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, setupMailList(false, false)];
                        case 1:
                            _a.sent();
                            loadRange = ospec_1["default"].spy(function (typeRef, listId, start, count, reverse) {
                                (0, ospec_1["default"])((0, tutanota_utils_1.isSameTypeRef)(typeRef, TypeRefs_js_2.MailTypeRef)).equals(true);
                                (0, ospec_1["default"])(listId).equals("listId1");
                                // the cache actually loads from the end of the range which is id1
                                (0, ospec_1["default"])(start).equals(createId("id1"));
                                (0, ospec_1["default"])(count).equals(DefaultEntityRestCache_js_1.EXTEND_RANGE_MIN_CHUNK_SIZE);
                                (0, ospec_1["default"])(reverse).equals(true);
                                return Promise.resolve([]);
                            });
                            mock = (0, tutanota_test_utils_1.mockAttribute)(entityRestClient, entityRestClient.loadRange, loadRange);
                            return [4 /*yield*/, cache.loadRange(TypeRefs_js_2.MailTypeRef, "listId1", createId("ic6"), 4, true)];
                        case 2:
                            result = _a.sent();
                            (0, ospec_1["default"])(result).deepEquals([]);
                            (0, ospec_1["default"])(loadRange.callCount).equals(1); // entities are provided from server
                            (0, tutanota_test_utils_1.unmockAttribute)(mock);
                            return [2 /*return*/];
                    }
                });
            });
        });
        (0, ospec_1["default"])("no elements in range", function () {
            return __awaiter(this, void 0, void 0, function () {
                var loadRange, mock, result, result2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            loadRange = ospec_1["default"].spy(function (typeRef, listId, start, count, reverse) {
                                (0, ospec_1["default"])((0, tutanota_utils_1.isSameTypeRef)(typeRef, TypeRefs_js_2.MailTypeRef)).equals(true);
                                (0, ospec_1["default"])(listId).equals("listId1");
                                (0, ospec_1["default"])(start).equals(EntityUtils_js_1.GENERATED_MAX_ID);
                                (0, ospec_1["default"])(count).equals(100);
                                (0, ospec_1["default"])(reverse).equals(true);
                                return Promise.resolve([]);
                            });
                            mock = (0, tutanota_test_utils_1.mockAttribute)(entityRestClient, entityRestClient.loadRange, loadRange);
                            return [4 /*yield*/, cache.loadRange(TypeRefs_js_2.MailTypeRef, "listId1", EntityUtils_js_1.GENERATED_MAX_ID, 100, true)];
                        case 1:
                            result = _a.sent();
                            (0, ospec_1["default"])(result).deepEquals([]);
                            return [4 /*yield*/, cache.loadRange(TypeRefs_js_2.MailTypeRef, "listId1", EntityUtils_js_1.GENERATED_MAX_ID, 100, true)];
                        case 2:
                            result2 = _a.sent();
                            (0, ospec_1["default"])(result2).deepEquals([]);
                            (0, ospec_1["default"])(loadRange.callCount).equals(1); // entities are only initially tried to be loaded from server
                            (0, tutanota_test_utils_1.unmockAttribute)(mock);
                            return [2 /*return*/];
                    }
                });
            });
        });
        (0, ospec_1["default"])("custom id range is not stored", function () {
            return __awaiter(this, void 0, void 0, function () {
                var ref, loadRange, mock, result1, result2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            ref = (0, tutanota_utils_1.clone)((0, TypeRefs_js_1.createExternalUserReference)());
                            ref._id = ["listId1", (0, EntityUtils_js_1.stringToCustomId)("custom")];
                            loadRange = ospec_1["default"].spy(function (typeRef, listId, start, count, reverse) {
                                (0, ospec_1["default"])((0, tutanota_utils_1.isSameTypeRef)(typeRef, TypeRefs_js_1.ExternalUserReferenceTypeRef)).equals(true);
                                (0, ospec_1["default"])(listId).equals("listId1");
                                (0, ospec_1["default"])(start).equals(EntityUtils_js_1.CUSTOM_MIN_ID);
                                (0, ospec_1["default"])(count).equals(1);
                                (0, ospec_1["default"])(reverse).equals(false);
                                return Promise.resolve([ref]);
                            });
                            mock = (0, tutanota_test_utils_1.mockAttribute)(entityRestClient, entityRestClient.loadRange, loadRange);
                            return [4 /*yield*/, cache.loadRange(TypeRefs_js_1.ExternalUserReferenceTypeRef, "listId1", EntityUtils_js_1.CUSTOM_MIN_ID, 1, false)];
                        case 1:
                            result1 = _a.sent();
                            (0, ospec_1["default"])(result1).deepEquals([ref]);
                            return [4 /*yield*/, cache.loadRange(TypeRefs_js_1.ExternalUserReferenceTypeRef, "listId1", EntityUtils_js_1.CUSTOM_MIN_ID, 1, false)];
                        case 2:
                            result2 = _a.sent();
                            (0, ospec_1["default"])(result2).deepEquals([ref]);
                            (0, ospec_1["default"])(loadRange.callCount).equals(2); // entities are always provided from server
                            (0, tutanota_test_utils_1.unmockAttribute)(mock);
                            return [2 /*return*/];
                    }
                });
            });
        });
        (0, ospec_1["default"])("Load towards the range with start being before the existing range. Range will be extended. Reverse. ", function () {
            var _a;
            return __awaiter(this, void 0, void 0, function () {
                var ids, listId1, mail1, mail2, mail3, _i, _b, mail, moreMails, loadRange, mock, originalUpper, result1, _c, expectedResult, result2;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            ids = [createId("1"), createId("2"), createId("3"), createId("4"), createId("5")];
                            listId1 = "listId1";
                            mail1 = createMailInstance(listId1, ids[0], "hello1");
                            mail2 = createMailInstance(listId1, ids[1], "hello2");
                            mail3 = createMailInstance(listId1, ids[2], "hello3");
                            return [4 /*yield*/, storage.setNewRangeForList(TypeRefs_js_2.MailTypeRef, listId1, ids[0], ids[2])];
                        case 1:
                            _d.sent();
                            _i = 0, _b = [mail1, mail2, mail3];
                            _d.label = 2;
                        case 2:
                            if (!(_i < _b.length)) return [3 /*break*/, 5];
                            mail = _b[_i];
                            return [4 /*yield*/, storage.put(mail)];
                        case 3:
                            _d.sent();
                            _d.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 2];
                        case 5:
                            moreMails = new Map();
                            moreMails.set(ids[3], createMailInstance(listId1, ids[3], "hello4"));
                            moreMails.set(ids[4], createMailInstance(listId1, ids[4], "hello5"));
                            loadRange = ospec_1["default"].spy(function () {
                                var an = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    an[_i] = arguments[_i];
                                }
                                return Promise.resolve([moreMails.get(ids[3]), moreMails.get(ids[4])]);
                            });
                            mock = (0, tutanota_test_utils_1.mockAttribute)(entityRestClient, entityRestClient.loadRange, loadRange);
                            return [4 /*yield*/, storage.getRangeForList(TypeRefs_js_2.MailTypeRef, listId1)];
                        case 6:
                            originalUpper = (_a = (_d.sent())) === null || _a === void 0 ? void 0 : _a.upper;
                            return [4 /*yield*/, cache.loadRange(TypeRefs_js_2.MailTypeRef, listId1, EntityUtils_js_1.GENERATED_MAX_ID, 5, true)];
                        case 7:
                            result1 = _d.sent();
                            (0, ospec_1["default"])(loadRange.callCount).equals(1)("entities are provided from server");
                            (0, ospec_1["default"])(loadRange.args[2]).equals(originalUpper)("starts extending range beginning with upperId");
                            _c = ospec_1["default"];
                            return [4 /*yield*/, storage.isElementIdInCacheRange(TypeRefs_js_2.MailTypeRef, listId1, EntityUtils_js_1.GENERATED_MAX_ID)];
                        case 8:
                            _c.apply(void 0, [_d.sent()]).equals(true)("MAX ID is in cache range");
                            expectedResult = [
                                moreMails.get(ids[4]), moreMails.get(ids[3]), mail3, mail2, mail1
                            ];
                            (0, ospec_1["default"])(result1).deepEquals(expectedResult)("Returns all elements in reverse order");
                            return [4 /*yield*/, cache.loadRange(TypeRefs_js_2.MailTypeRef, listId1, EntityUtils_js_1.GENERATED_MAX_ID, 5, true)];
                        case 9:
                            result2 = _d.sent();
                            (0, ospec_1["default"])(result2).deepEquals(expectedResult);
                            (0, ospec_1["default"])(loadRange.callCount).equals(1); // entities are provided from cache
                            (0, tutanota_test_utils_1.unmockAttribute)(mock);
                            return [2 /*return*/];
                    }
                });
            });
        });
        (0, ospec_1["default"])("Load towards the range with start being before the existing range. Range will be extended. Not Reverse.", function () {
            var _a;
            return __awaiter(this, void 0, void 0, function () {
                var ids, listId1, mail1, mail2, mail3, mail4, mail5, _i, _b, mail, loadRange, mock, originalLower, result1, _c, expectedResult, result2;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            ids = [createId("1"), createId("2"), createId("3"), createId("4"), createId("5")];
                            listId1 = "listId1";
                            mail1 = createMailInstance(listId1, ids[0], "hello1");
                            mail2 = createMailInstance(listId1, ids[1], "hello2");
                            mail3 = createMailInstance(listId1, ids[2], "hello3");
                            mail4 = createMailInstance(listId1, ids[3], "hello4");
                            mail5 = createMailInstance(listId1, ids[4], "hello5");
                            return [4 /*yield*/, storage.setNewRangeForList(TypeRefs_js_2.MailTypeRef, listId1, ids[2], ids[4])];
                        case 1:
                            _d.sent();
                            _i = 0, _b = [mail3, mail4, mail5];
                            _d.label = 2;
                        case 2:
                            if (!(_i < _b.length)) return [3 /*break*/, 5];
                            mail = _b[_i];
                            return [4 /*yield*/, storage.put(mail)];
                        case 3:
                            _d.sent();
                            _d.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 2];
                        case 5:
                            loadRange = ospec_1["default"].spy(function () {
                                var any = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    any[_i] = arguments[_i];
                                }
                                return Promise.resolve([mail2, mail1]);
                            });
                            mock = (0, tutanota_test_utils_1.mockAttribute)(entityRestClient, entityRestClient.loadRange, loadRange);
                            return [4 /*yield*/, storage.getRangeForList(TypeRefs_js_2.MailTypeRef, listId1)];
                        case 6:
                            originalLower = (_a = (_d.sent())) === null || _a === void 0 ? void 0 : _a.lower;
                            return [4 /*yield*/, cache.loadRange(TypeRefs_js_2.MailTypeRef, listId1, EntityUtils_js_1.GENERATED_MIN_ID, 5, false)];
                        case 7:
                            result1 = _d.sent();
                            (0, ospec_1["default"])(loadRange.callCount).equals(1)("entities are provided from server");
                            (0, ospec_1["default"])(loadRange.args[2]).equals(originalLower)("starts extending range beginning with lowerId");
                            _c = ospec_1["default"];
                            return [4 /*yield*/, storage.isElementIdInCacheRange(TypeRefs_js_2.MailTypeRef, listId1, EntityUtils_js_1.GENERATED_MIN_ID)];
                        case 8:
                            _c.apply(void 0, [_d.sent()]).equals(true)("MIN ID is in cache range");
                            expectedResult = [mail1, mail2, mail3, mail4, mail5];
                            (0, ospec_1["default"])(result1).deepEquals(expectedResult)("Returns all elements in reverse order");
                            return [4 /*yield*/, cache.loadRange(TypeRefs_js_2.MailTypeRef, listId1, EntityUtils_js_1.GENERATED_MIN_ID, 5, false)];
                        case 9:
                            result2 = _d.sent();
                            (0, ospec_1["default"])(result2).deepEquals(expectedResult);
                            (0, ospec_1["default"])(loadRange.callCount).equals(1)("server is called only once at the end"); // entities are provided from cache
                            (0, tutanota_test_utils_1.unmockAttribute)(mock);
                            return [2 /*return*/];
                    }
                });
            });
        });
        (0, ospec_1["default"])("When there is a non-reverse range request that loads away from the existing range, the range will grow to include startId + the rest from the server", function () {
            return __awaiter(this, void 0, void 0, function () {
                var clientMock, cache, listId, id1, id2, id3, id4, id5, id6, mail1, mail2, mail3, mail4, mail5, mail6, result, _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            clientMock = (0, testdouble_1.object)();
                            cache = new DefaultEntityRestCache_js_1.DefaultEntityRestCache(clientMock, storage);
                            listId = "listId";
                            id1 = createId("1");
                            id2 = createId("2");
                            id3 = createId("3");
                            id4 = createId("4");
                            id5 = createId("5");
                            id6 = createId("6");
                            mail1 = createMailInstance(listId, id1, "hello1");
                            mail2 = createMailInstance(listId, id2, "hello2");
                            mail3 = createMailInstance(listId, id3, "hello3");
                            mail4 = createMailInstance(listId, id4, "hello4");
                            mail5 = createMailInstance(listId, id5, "hello5");
                            mail6 = createMailInstance(listId, id6, "hello6");
                            return [4 /*yield*/, storage.setNewRangeForList(TypeRefs_js_2.MailTypeRef, listId, id1, id2)];
                        case 1:
                            _c.sent();
                            return [4 /*yield*/, storage.put(mail1)];
                        case 2:
                            _c.sent();
                            return [4 /*yield*/, storage.put(mail2)];
                        case 3:
                            _c.sent();
                            (0, testdouble_1.when)(clientMock.loadRange(anything(), listId, id2, DefaultEntityRestCache_js_1.EXTEND_RANGE_MIN_CHUNK_SIZE, false))
                                .thenResolve([mail3, mail4, mail5, mail6]);
                            return [4 /*yield*/, cache.loadRange(TypeRefs_js_2.MailTypeRef, listId, id3, 2, false)];
                        case 4:
                            result = _c.sent();
                            (0, ospec_1["default"])(result).deepEquals([
                                mail4, mail5
                            ]);
                            _a = ospec_1["default"];
                            return [4 /*yield*/, storage.getRangeForList(TypeRefs_js_2.MailTypeRef, listId)];
                        case 5:
                            _a.apply(void 0, [(_c.sent())]).deepEquals({
                                lower: id1, upper: EntityUtils_js_1.GENERATED_MAX_ID
                            });
                            _b = ospec_1["default"];
                            return [4 /*yield*/, storage.getIdsInRange(TypeRefs_js_2.MailTypeRef, listId)];
                        case 6:
                            _b.apply(void 0, [_c.sent()]).deepEquals([
                                id1, id2, id3, id4, id5, id6
                            ]);
                            return [2 /*return*/];
                    }
                });
            });
        });
        (0, ospec_1["default"])("When there is a non-reverse range request that loads in the direction of the existing range, the range will grow to include the startId", function () {
            return __awaiter(this, void 0, void 0, function () {
                var clientMock, cache, listId, mails, result, _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            clientMock = (0, testdouble_1.object)();
                            cache = new DefaultEntityRestCache_js_1.DefaultEntityRestCache(clientMock, storage);
                            listId = "listId1";
                            mails = (0, tutanota_utils_1.arrayOf)(100, function (idx) { return createMailInstance(listId, createId("".concat(idx)), "hola ".concat(idx)); });
                            return [4 /*yield*/, storage.setNewRangeForList(TypeRefs_js_2.MailTypeRef, listId, (0, EntityUtils_js_1.getElementId)(mails[98]), (0, EntityUtils_js_1.getElementId)(mails[99]))];
                        case 1:
                            _c.sent();
                            return [4 /*yield*/, storage.put(mails[98])];
                        case 2:
                            _c.sent();
                            return [4 /*yield*/, storage.put(mails[99])];
                        case 3:
                            _c.sent();
                            (0, testdouble_1.when)(clientMock.loadRange(anything(), listId, (0, EntityUtils_js_1.getElementId)(mails[98]), DefaultEntityRestCache_js_1.EXTEND_RANGE_MIN_CHUNK_SIZE, true))
                                .thenResolve(mails.slice(58, 98).reverse());
                            (0, testdouble_1.when)(clientMock.loadRange(anything(), listId, (0, EntityUtils_js_1.getElementId)(mails[58]), DefaultEntityRestCache_js_1.EXTEND_RANGE_MIN_CHUNK_SIZE, true))
                                .thenResolve(mails.slice(18, 58).reverse());
                            (0, testdouble_1.when)(clientMock.loadRange(anything(), listId, (0, EntityUtils_js_1.getElementId)(mails[18]), DefaultEntityRestCache_js_1.EXTEND_RANGE_MIN_CHUNK_SIZE, true))
                                .thenResolve(mails.slice(0, 18).reverse());
                            return [4 /*yield*/, cache.loadRange(TypeRefs_js_2.MailTypeRef, listId, EntityUtils_js_1.GENERATED_MIN_ID, 2, false)];
                        case 4:
                            result = _c.sent();
                            (0, ospec_1["default"])(result).deepEquals([
                                mails[0], mails[1]
                            ]);
                            _a = ospec_1["default"];
                            return [4 /*yield*/, storage.getRangeForList(TypeRefs_js_2.MailTypeRef, listId)];
                        case 5:
                            _a.apply(void 0, [(_c.sent())]).deepEquals({
                                lower: EntityUtils_js_1.GENERATED_MIN_ID,
                                upper: (0, EntityUtils_js_1.getElementId)(mails[99])
                            });
                            _b = ospec_1["default"];
                            return [4 /*yield*/, storage.getIdsInRange(TypeRefs_js_2.MailTypeRef, listId)];
                        case 6:
                            _b.apply(void 0, [_c.sent()]).deepEquals(mails.map(EntityUtils_js_1.getElementId));
                            return [2 /*return*/];
                    }
                });
            });
        });
        (0, ospec_1["default"])("When there is a reverse range request that loads in the direction of the existing range, the range will grow to include the startId", function () {
            return __awaiter(this, void 0, void 0, function () {
                var clientMock, cache, listId, mails, result, _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            clientMock = (0, testdouble_1.object)();
                            cache = new DefaultEntityRestCache_js_1.DefaultEntityRestCache(clientMock, storage);
                            listId = "listId1";
                            mails = (0, tutanota_utils_1.arrayOf)(100, function (idx) { return createMailInstance(listId, createId("".concat(idx)), "hola ".concat(idx)); });
                            return [4 /*yield*/, storage.setNewRangeForList(TypeRefs_js_2.MailTypeRef, listId, (0, EntityUtils_js_1.getElementId)(mails[0]), (0, EntityUtils_js_1.getElementId)(mails[1]))];
                        case 1:
                            _c.sent();
                            return [4 /*yield*/, storage.put(mails[0])];
                        case 2:
                            _c.sent();
                            return [4 /*yield*/, storage.put(mails[1])];
                        case 3:
                            _c.sent();
                            (0, testdouble_1.when)(clientMock.loadRange(anything(), listId, (0, EntityUtils_js_1.getElementId)(mails[1]), DefaultEntityRestCache_js_1.EXTEND_RANGE_MIN_CHUNK_SIZE, false))
                                .thenResolve(mails.slice(2, 42));
                            (0, testdouble_1.when)(clientMock.loadRange(anything(), listId, (0, EntityUtils_js_1.getElementId)(mails[41]), DefaultEntityRestCache_js_1.EXTEND_RANGE_MIN_CHUNK_SIZE, false))
                                .thenResolve(mails.slice(42, 82));
                            (0, testdouble_1.when)(clientMock.loadRange(anything(), listId, (0, EntityUtils_js_1.getElementId)(mails[81]), DefaultEntityRestCache_js_1.EXTEND_RANGE_MIN_CHUNK_SIZE, false))
                                .thenResolve(mails.slice(82));
                            return [4 /*yield*/, cache.loadRange(TypeRefs_js_2.MailTypeRef, listId, EntityUtils_js_1.GENERATED_MAX_ID, 2, true)];
                        case 4:
                            result = _c.sent();
                            (0, ospec_1["default"])(result).deepEquals([
                                mails[mails.length - 1], mails[mails.length - 2]
                            ]);
                            _a = ospec_1["default"];
                            return [4 /*yield*/, storage.getRangeForList(TypeRefs_js_2.MailTypeRef, listId)];
                        case 5:
                            _a.apply(void 0, [(_c.sent())]).deepEquals({
                                lower: (0, EntityUtils_js_1.getElementId)(mails[0]),
                                upper: EntityUtils_js_1.GENERATED_MAX_ID
                            });
                            _b = ospec_1["default"];
                            return [4 /*yield*/, storage.getIdsInRange(TypeRefs_js_2.MailTypeRef, listId)];
                        case 6:
                            _b.apply(void 0, [_c.sent()]).deepEquals(mails.map(EntityUtils_js_1.getElementId));
                            return [2 /*return*/];
                    }
                });
            });
        });
        (0, ospec_1["default"])("The range request starts on one end of the existing range, and would finish on the other end, so it loads from either direction of the range", function () {
            return __awaiter(this, void 0, void 0, function () {
                var clientMock, cache, id1, id2, id3, id4, id5, id6, listId, mail1, mail2, mail3, mail4, mail5, result, _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            clientMock = (0, testdouble_1.object)();
                            cache = new DefaultEntityRestCache_js_1.DefaultEntityRestCache(clientMock, storage);
                            id1 = createId("1");
                            id2 = createId("2");
                            id3 = createId("3");
                            id4 = createId("4");
                            id5 = createId("5");
                            id6 = createId("6");
                            listId = "listId";
                            mail1 = createMailInstance(listId, id1, "ok");
                            mail2 = createMailInstance(listId, id2, "ok");
                            mail3 = createMailInstance(listId, id3, "ok");
                            mail4 = createMailInstance(listId, id4, "ok");
                            mail5 = createMailInstance(listId, id5, "ok");
                            return [4 /*yield*/, storage.setNewRangeForList(TypeRefs_js_2.MailTypeRef, listId, id2, id3)];
                        case 1:
                            _c.sent();
                            return [4 /*yield*/, storage.put(mail2)];
                        case 2:
                            _c.sent();
                            return [4 /*yield*/, storage.put(mail3)
                                // First it will try to load in the direction of start id from the existing range
                            ];
                        case 3:
                            _c.sent();
                            // First it will try to load in the direction of start id from the existing range
                            (0, testdouble_1.when)(clientMock.loadRange(anything(), listId, id2, DefaultEntityRestCache_js_1.EXTEND_RANGE_MIN_CHUNK_SIZE, true))
                                .thenResolve([mail1]);
                            // It will then fall into the "load from within the range" case
                            // It will try to load starting from the end of the range
                            (0, testdouble_1.when)(clientMock.loadRange(anything(), listId, id3, 7, false))
                                .thenResolve([
                                mail4,
                                mail5,
                            ]);
                            return [4 /*yield*/, cache.loadRange(TypeRefs_js_2.MailTypeRef, listId, EntityUtils_js_1.GENERATED_MIN_ID, 10, false)];
                        case 4:
                            result = _c.sent();
                            _a = ospec_1["default"];
                            return [4 /*yield*/, storage.getRangeForList(TypeRefs_js_2.MailTypeRef, listId)];
                        case 5:
                            _a.apply(void 0, [(_c.sent())]).deepEquals({ lower: EntityUtils_js_1.GENERATED_MIN_ID, upper: EntityUtils_js_1.GENERATED_MAX_ID });
                            _b = ospec_1["default"];
                            return [4 /*yield*/, storage.getIdsInRange(TypeRefs_js_2.MailTypeRef, listId)];
                        case 6:
                            _b.apply(void 0, [_c.sent()]).deepEquals([
                                id1, id2, id3, id4, id5
                            ]);
                            (0, ospec_1["default"])(result).deepEquals([
                                mail1,
                                mail2,
                                mail3,
                                mail4,
                                mail5,
                            ]);
                            return [2 /*return*/];
                    }
                });
            });
        });
        (0, ospec_1["default"])("loadMultiple should load necessary elements from the server, and get the rest from the cache", function () {
            return __awaiter(this, void 0, void 0, function () {
                var listId, inCache, notInCache, ids, loadMultiple, mock, result, _i, _a, item, _b;
                var _this = this;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            listId = "listId";
                            inCache = [
                                createMailInstance(listId, "1", "1"),
                                createMailInstance(listId, "3", "3")
                            ];
                            notInCache = [
                                createMailInstance(listId, "2", "2"),
                                createMailInstance(listId, "5", "5")
                            ];
                            return [4 /*yield*/, Promise.all(inCache.map(function (i) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, storage.put(i)];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                }); }); }))];
                        case 1:
                            _c.sent();
                            ids = inCache.concat(notInCache).map(EntityUtils_js_1.getElementId);
                            loadMultiple = ospec_1["default"].spy(function () {
                                var any = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    any[_i] = arguments[_i];
                                }
                                return Promise.resolve(notInCache);
                            });
                            mock = (0, tutanota_test_utils_1.mockAttribute)(entityRestClient, entityRestClient.loadMultiple, loadMultiple);
                            return [4 /*yield*/, cache.loadMultiple(TypeRefs_js_2.MailTypeRef, listId, ids)];
                        case 2:
                            result = _c.sent();
                            (0, ospec_1["default"])(result).deepEquals(notInCache.concat(inCache))("all mails are in cache");
                            (0, ospec_1["default"])(loadMultiple.callCount).equals(1)("load multiple is called once");
                            (0, ospec_1["default"])(loadMultiple.args).deepEquals([TypeRefs_js_2.MailTypeRef, listId, notInCache.map(EntityUtils_js_1.getElementId)])("load multiple is called for mails not in cache");
                            _i = 0, _a = inCache.concat(notInCache);
                            _c.label = 3;
                        case 3:
                            if (!(_i < _a.length)) return [3 /*break*/, 6];
                            item = _a[_i];
                            _b = ospec_1["default"];
                            return [4 /*yield*/, storage.get(TypeRefs_js_2.MailTypeRef, listId, (0, EntityUtils_js_1.getElementId)(item))];
                        case 4:
                            _b.apply(void 0, [_c.sent()]).notEquals(null)("element is in cache " + (0, EntityUtils_js_1.getElementId)(item));
                            _c.label = 5;
                        case 5:
                            _i++;
                            return [3 /*break*/, 3];
                        case 6:
                            (0, tutanota_test_utils_1.unmockAttribute)(mock);
                            return [2 /*return*/];
                    }
                });
            });
        });
        (0, ospec_1["default"])("load passes same parameters to entityRestClient", function () {
            return __awaiter(this, void 0, void 0, function () {
                var contactId, contact, client, cache;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            contactId = [createId("0"), createId("1")];
                            contact = (0, TypeRefs_js_2.createContact)({
                                _id: contactId,
                                firstName: "greg"
                            });
                            client = (0, tutanota_utils_1.downcast)({
                                load: ospec_1["default"].spy(function () { return contact; })
                            });
                            cache = new DefaultEntityRestCache_js_1.DefaultEntityRestCache(client, storage);
                            return [4 /*yield*/, cache.load(TypeRefs_js_2.ContactTypeRef, contactId, {
                                    myParam: "param"
                                }, {
                                    myHeader: "header"
                                })
                                // @ts-ignore
                            ];
                        case 1:
                            _a.sent();
                            // @ts-ignore
                            (0, ospec_1["default"])((0, tutanota_utils_1.isSameTypeRef)(client.load.args[0], TypeRefs_js_2.ContactTypeRef)).equals(true);
                            // @ts-ignore
                            (0, ospec_1["default"])(client.load.args[1]).deepEquals(contactId);
                            // @ts-ignore
                            (0, ospec_1["default"])(client.load.args[2]).deepEquals({
                                myParam: "param"
                            });
                            // @ts-ignore
                            (0, ospec_1["default"])(client.load.args[3]).deepEquals({
                                myHeader: "header"
                            });
                            return [2 /*return*/];
                    }
                });
            });
        });
        (0, ospec_1["default"])("single entity is cached after being loaded", function () {
            return __awaiter(this, void 0, void 0, function () {
                var contactId, contactOnTheServer, client, cache, firstLoaded, secondLoaded;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            contactId = [createId("0"), createId("1")];
                            contactOnTheServer = (0, TypeRefs_js_2.createContact)({
                                _id: contactId,
                                firstName: "greg"
                            });
                            client = (0, tutanota_utils_1.downcast)({
                                load: ospec_1["default"].spy(function () { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, contactOnTheServer];
                                    });
                                }); })
                            });
                            cache = new DefaultEntityRestCache_js_1.DefaultEntityRestCache(client, storage);
                            return [4 /*yield*/, cache.load(TypeRefs_js_2.ContactTypeRef, contactId)];
                        case 1:
                            firstLoaded = _a.sent();
                            (0, ospec_1["default"])(firstLoaded).deepEquals(contactOnTheServer);
                            // @ts-ignore
                            (0, ospec_1["default"])(client.load.callCount).equals(1)("The entity rest client was called because the contact isn't in cache");
                            return [4 /*yield*/, cache.load(TypeRefs_js_2.ContactTypeRef, contactId)];
                        case 2:
                            secondLoaded = _a.sent();
                            (0, ospec_1["default"])(secondLoaded).deepEquals(contactOnTheServer);
                            // @ts-ignore
                            (0, ospec_1["default"])(client.load.callCount).equals(1)("The rest client was not called again, because the contact was loaded from the cache");
                            return [2 /*return*/];
                    }
                });
            });
        });
        (0, ospec_1["default"])("A new range request for a nonexistent range should initialize that range", function () {
            return __awaiter(this, void 0, void 0, function () {
                var loadRange, mock, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            loadRange = ospec_1["default"].spy(function (typeRef, listId) {
                                var an = [];
                                for (var _i = 2; _i < arguments.length; _i++) {
                                    an[_i - 2] = arguments[_i];
                                }
                                return [
                                    (0, TypeRefs_js_2.createContact)({ _id: [listId, createId("1")] }),
                                    (0, TypeRefs_js_2.createContact)({ _id: [listId, createId("2")] }),
                                    (0, TypeRefs_js_2.createContact)({ _id: [listId, createId("3")] }),
                                    (0, TypeRefs_js_2.createContact)({ _id: [listId, createId("4")] }),
                                    (0, TypeRefs_js_2.createContact)({ _id: [listId, createId("5")] }),
                                    (0, TypeRefs_js_2.createContact)({ _id: [listId, createId("6")] }),
                                ];
                            });
                            mock = (0, tutanota_test_utils_1.mockAttribute)(entityRestClient, entityRestClient.loadRange, loadRange);
                            return [4 /*yield*/, cache.loadRange(TypeRefs_js_2.ContactTypeRef, createId("0"), EntityUtils_js_1.GENERATED_MIN_ID, 1000, false)];
                        case 1:
                            result = _a.sent();
                            (0, ospec_1["default"])(result.length).equals(6);
                            (0, tutanota_test_utils_1.unmockAttribute)(mock);
                            return [2 /*return*/];
                    }
                });
            });
        });
        (0, ospec_1["default"])("single entity is not cached if it is an ignored entity", function () {
            return __awaiter(this, void 0, void 0, function () {
                var permissionId, permissionOnTheServer, client, cache;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            permissionId = [createId("0"), createId("1")];
                            permissionOnTheServer = (0, TypeRefs_js_1.createPermission)({
                                _id: permissionId
                            });
                            client = (0, tutanota_utils_1.downcast)({
                                load: ospec_1["default"].spy(function () { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, permissionOnTheServer];
                                    });
                                }); })
                            });
                            cache = new DefaultEntityRestCache_js_1.DefaultEntityRestCache(client, storage);
                            return [4 /*yield*/, cache.load(TypeRefs_js_1.PermissionTypeRef, permissionId)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, cache.load(TypeRefs_js_1.PermissionTypeRef, permissionId)
                                // @ts-ignore
                            ];
                        case 2:
                            _a.sent();
                            // @ts-ignore
                            (0, ospec_1["default"])(client.load.callCount).equals(2)("The permission was loaded both times from the server");
                            return [2 /*return*/];
                    }
                });
            });
        });
        ospec_1["default"].spec("no user id", function () {
            (0, ospec_1["default"])("get", function () {
                return __awaiter(this, void 0, void 0, function () {
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                userId = null;
                                entityRestClient.load = ospec_1["default"].spy(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, (0, TypeRefs_js_2.createContact)({ _id: ["listId", "id"] })];
                                }); }); });
                                return [4 /*yield*/, cache.load(TypeRefs_js_2.ContactTypeRef, ["listId", "id"])];
                            case 1:
                                _a.sent();
                                (0, ospec_1["default"])(entityRestClient.load.callCount).equals(1);
                                return [2 /*return*/];
                        }
                    });
                });
            });
            (0, ospec_1["default"])("put", function () {
                return __awaiter(this, void 0, void 0, function () {
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                userId = null;
                                entityRestClient.setup = ospec_1["default"].spy(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, "id"];
                                }); }); });
                                return [4 /*yield*/, cache.setup("listId", (0, TypeRefs_js_2.createContact)({ _id: ["listId", "id"] }))];
                            case 1:
                                _a.sent();
                                (0, ospec_1["default"])(entityRestClient.setup.callCount).equals(1);
                                return [2 /*return*/];
                        }
                    });
                });
            });
        });
    });
    function makeBatch(updates) {
        return {
            events: updates,
            groupId: groupId,
            batchId: "batchId"
        };
    }
}
exports.testEntityRestCache = testEntityRestCache;
