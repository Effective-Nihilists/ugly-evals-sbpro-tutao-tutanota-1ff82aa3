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
exports.b64UserIdHash = exports.IndexedDbTransaction = exports.DbFacade = exports.osName = void 0;
var DbError_1 = require("../../common/error/DbError");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var IndexingNotSupportedError_1 = require("../../common/error/IndexingNotSupportedError");
var QuotaExceededError_1 = require("../../common/error/QuotaExceededError");
var EntityUtils_1 = require("../../common/utils/EntityUtils");
var tutanota_crypto_1 = require("@tutao/tutanota-crypto");
var osName = function (objectStoreName) { return objectStoreName; };
exports.osName = osName;
function extractErrorProperties(e) {
    var requestErrorEntries = {};
    for (var key in e) {
        requestErrorEntries[key] = e[key];
    }
    return JSON.stringify(requestErrorEntries);
}
var DbFacade = /** @class */ (function () {
    function DbFacade(version, onupgrade) {
        var _this = this;
        this.indexingSupported = true;
        this._activeTransactions = 0;
        this._db = new tutanota_utils_1.LazyLoaded(function () {
            // If indexedDB is disabled in Firefox, the browser crashes when accessing indexedDB in worker process
            // ask the main thread if indexedDB is supported.
            if (!_this.indexingSupported) {
                return Promise.reject(new IndexingNotSupportedError_1.IndexingNotSupportedError("indexedDB not supported"));
            }
            else {
                return new Promise(function (resolve, reject) {
                    var DBOpenRequest;
                    try {
                        DBOpenRequest = self.indexedDB.open(_this._id, version);
                        DBOpenRequest.onerror = function (event) {
                            var _a;
                            var target = event.target;
                            // @ts-ignore
                            var error = (_a = event.target) === null || _a === void 0 ? void 0 : _a.error;
                            // Copy all the keys from the error, including inheritent ones so we can get some info
                            var requestErrorEntries = extractErrorProperties(DBOpenRequest.error);
                            var eventProperties = extractErrorProperties(event);
                            _this.indexingSupported = false;
                            var message = "DbFacade.open.onerror: " +
                                _this._id +
                                "\nrequest.error: " +
                                requestErrorEntries +
                                "\nevent: " +
                                eventProperties +
                                "\nevent.target.error: " +
                                (error !== null && error !== void 0 ? error : "[none]");
                            if ((error === null || error === void 0 ? void 0 : error.name) === "QuotaExceededError") {
                                console.log("Storage Quota is exceeded");
                                reject(new QuotaExceededError_1.QuotaExceededError(message, DBOpenRequest.error || error));
                            }
                            else {
                                reject(new IndexingNotSupportedError_1.IndexingNotSupportedError(message, DBOpenRequest.error || error));
                            }
                        };
                        DBOpenRequest.onupgradeneeded = function (event) {
                            //console.log("upgrade db", event)
                            try {
                                // @ts-ignore
                                onupgrade(event, event.target.result);
                            }
                            catch (e) {
                                reject(new DbError_1.DbError("could not create object store for DB " + _this._id, e));
                            }
                        };
                        DBOpenRequest.onsuccess = function (event) {
                            //console.log("opened db", event)
                            DBOpenRequest.result.onabort = function (event) { return console.log("db aborted", event); };
                            DBOpenRequest.result.onclose = function (event) {
                                console.log("db closed", event);
                                _this._db.reset();
                            };
                            DBOpenRequest.result.onerror = function (event) { return console.log("db error", event); };
                            resolve(DBOpenRequest.result);
                        };
                    }
                    catch (e) {
                        _this.indexingSupported = false;
                        reject(new IndexingNotSupportedError_1.IndexingNotSupportedError("exception when accessing indexeddb ".concat(_this._id), e));
                    }
                });
            }
        });
    }
    DbFacade.prototype.open = function (id) {
        this._id = id;
        return this._db.getAsync();
    };
    /**
     * Deletes the database if it has been opened.
     */
    DbFacade.prototype.deleteDatabase = function () {
        var _this = this;
        if (this._db.isLoaded()) {
            if (this._activeTransactions > 0) {
                return (0, tutanota_utils_1.delay)(150).then(function () { return _this.deleteDatabase(); });
            }
            else {
                this._db.getLoaded().close();
                return new Promise(function (resolve, reject) {
                    var deleteRequest = self.indexedDB.deleteDatabase(_this._db.getLoaded().name);
                    // @ts-ignore
                    deleteRequest.onerror = function (event) {
                        reject(new DbError_1.DbError("could not delete database ".concat(_this._db.getLoaded().name), (0, tutanota_utils_1.downcast)(event)));
                    };
                    deleteRequest.onsuccess = function (event) {
                        _this._db.reset();
                        resolve();
                    };
                });
            }
        }
        else {
            return Promise.resolve();
        }
    };
    /**
     * @pre open() must have been called before, but the promise does not need to have returned.
     */
    DbFacade.prototype.createTransaction = function (readOnly, objectStores) {
        var _this = this;
        return this._db.getAsync().then(function (db) {
            try {
                var idbTransaction = db.transaction(objectStores, readOnly ? "readonly" : "readwrite");
                var transaction = new IndexedDbTransaction(idbTransaction, function () {
                    _this.indexingSupported = false;
                    _this._db.reset();
                });
                _this._activeTransactions++;
                transaction.wait()["finally"](function () {
                    _this._activeTransactions--;
                });
                return transaction;
            }
            catch (e) {
                throw new DbError_1.DbError("could not create transaction", e);
            }
        });
    };
    return DbFacade;
}());
exports.DbFacade = DbFacade;
/**
 * A transaction is usually committed after all requests placed against the transaction have been executed and their
 * returned results handled, and no new requests have been placed against the transaction.
 * @see https://w3c.github.io/IndexedDB/#ref-for-transaction-finish
 */
var IndexedDbTransaction = /** @class */ (function () {
    function IndexedDbTransaction(transaction, onUnknownError) {
        var _this = this;
        this.aborted = false;
        this._transaction = transaction;
        this._onUnknownError = onUnknownError;
        this._promise = new Promise(function (resolve, reject) {
            var done = false;
            transaction.onerror = function (event) {
                if (!done) {
                    _this._handleDbError(event, _this._transaction, "transaction.onerror", function (e) {
                        reject(e);
                    });
                }
                else {
                    console.log("ignore error of aborted/fulfilled transaction", event);
                }
            };
            transaction.oncomplete = function () {
                done = true;
                resolve();
            };
            transaction.onabort = function (event) {
                event.stopPropagation();
                done = true;
                resolve();
            };
        });
    }
    IndexedDbTransaction.prototype.getAll = function (objectStore) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var keys_1 = [];
                var request_1 = _this._transaction.objectStore(objectStore).openCursor();
                request_1.onerror = function (event) {
                    _this._handleDbError(event, request_1, "getAll().onError " + objectStore, reject);
                };
                request_1.onsuccess = function (event) {
                    var cursor = request_1.result;
                    if (cursor) {
                        keys_1.push({
                            // @ts-ignore Key can be something crazy like Date or array of keys
                            key: cursor.key,
                            value: cursor.value
                        });
                        cursor["continue"](); // onsuccess is called again
                    }
                    else {
                        resolve(keys_1); // cursor has reached the end
                    }
                };
            }
            catch (e) {
                _this._handleDbError(e, null, "getAll().catch", reject);
            }
        });
    };
    IndexedDbTransaction.prototype.get = function (objectStore, key, indexName) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var os = _this._transaction.objectStore(objectStore);
                var request_2;
                if (indexName) {
                    request_2 = os.index(indexName).get(key);
                }
                else {
                    request_2 = os.get(key);
                }
                request_2.onerror = function (event) {
                    _this._handleDbError(event, request_2, "get().onerror " + objectStore, reject);
                };
                request_2.onsuccess = function (event) {
                    // @ts-ignore
                    resolve(event.target.result);
                };
            }
            catch (e) {
                _this._handleDbError(e, null, "get().catch", reject);
            }
        });
    };
    IndexedDbTransaction.prototype.getAsList = function (objectStore, key, indexName) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get(objectStore, key, indexName)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result ? [result] : []];
                }
            });
        });
    };
    IndexedDbTransaction.prototype.put = function (objectStore, key, value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var request_3 = key ? _this._transaction.objectStore(objectStore).put(value, key) : _this._transaction.objectStore(objectStore).put(value);
                request_3.onerror = function (event) {
                    _this._handleDbError(event, request_3, "put().onerror " + objectStore, reject);
                };
                request_3.onsuccess = function (event) {
                    // event.target.result isn't known by typescript definitions
                    // see: https://github.com/Microsoft/TypeScript/issues/30669
                    resolve(event.target.result);
                };
            }
            catch (e) {
                _this._handleDbError(e, null, "put().catch", reject);
            }
        });
    };
    IndexedDbTransaction.prototype["delete"] = function (objectStore, key) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var request_4 = _this._transaction.objectStore(objectStore)["delete"](key);
                request_4.onerror = function (event) {
                    _this._handleDbError(event, request_4, "delete().onerror " + objectStore, reject);
                };
                request_4.onsuccess = function (event) {
                    resolve();
                };
            }
            catch (e) {
                _this._handleDbError(e, null, ".delete().catch " + objectStore, reject);
            }
        });
    };
    IndexedDbTransaction.prototype.abort = function () {
        this.aborted = true;
        this._transaction.abort();
    };
    IndexedDbTransaction.prototype.wait = function () {
        return this._promise;
    };
    IndexedDbTransaction.prototype._handleDbError = function (event, customTarget, prefix, callback) {
        var _a;
        var errorEntries = extractErrorProperties(event);
        var eventTargetEntries = event.target ? extractErrorProperties(event.target) : "<null>";
        var eventTargetErrorEntries = event.target && event.target.error ? extractErrorProperties(event.target.error) : "<null>";
        var customTargetEntries = customTarget ? extractErrorProperties(customTarget) : "<null>";
        var customTargetErrorEntries = customTarget && customTarget.error ? extractErrorProperties(customTarget.error) : "<null>";
        var msg = "IndexedDbTransaction " +
            prefix +
            "\nOSes: " +
            JSON.stringify(this._transaction.objectStoreNames) +
            "\nevent:" +
            errorEntries +
            "\ntransaction.error: " +
            (this._transaction.error ? this._transaction.error.message : "<null>") +
            "\nevent.target: " +
            eventTargetEntries +
            "\nevent.target.error: " +
            eventTargetErrorEntries +
            "\ncustom.target: " +
            customTargetEntries +
            "\ncustom.target.error: " +
            customTargetErrorEntries;
        // In some cases it's not available on Firefox 70
        if (typeof event.stopPropagation === "function")
            event.stopPropagation();
        if (customTarget &&
            customTarget.error &&
            (customTarget.error.name === "UnknownError" ||
                (typeof customTarget.error.message === "string" && customTarget.error.message.includes("UnknownError")))) {
            this._onUnknownError(customTarget.error);
            callback(new IndexingNotSupportedError_1.IndexingNotSupportedError(msg, (_a = this._transaction.error) !== null && _a !== void 0 ? _a : undefined));
        }
        else {
            var e = this._transaction.error || (customTarget ? customTarget.error : null);
            if (e && e.name && e.name === "QuotaExceededError") {
                console.warn("Storage Quota exceeded");
                callback(new QuotaExceededError_1.QuotaExceededError(msg, e));
            }
            else {
                callback(new DbError_1.DbError(msg, e));
            }
        }
    };
    return IndexedDbTransaction;
}());
exports.IndexedDbTransaction = IndexedDbTransaction;
function b64UserIdHash(user) {
    return (0, tutanota_utils_1.uint8ArrayToBase64)((0, tutanota_crypto_1.sha256Hash)((0, tutanota_utils_1.stringToUtf8Uint8Array)((0, EntityUtils_1.getEtId)(user))));
}
exports.b64UserIdHash = b64UserIdHash;
