"use strict";
exports.__esModule = true;
exports.SuggestionFacade = void 0;
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var Indexer_1 = require("./Indexer");
var tutanota_crypto_1 = require("@tutao/tutanota-crypto");
var SuggestionFacade = /** @class */ (function () {
    function SuggestionFacade(type, db) {
        this.type = type;
        this._db = db;
        this._suggestions = {};
    }
    SuggestionFacade.prototype.load = function () {
        var _this = this;
        return this._db.initialized.then(function () {
            return _this._db.dbFacade.createTransaction(true, [Indexer_1.SearchTermSuggestionsOS]).then(function (t) {
                return t.get(Indexer_1.SearchTermSuggestionsOS, _this.type.type.toLowerCase()).then(function (encSuggestions) {
                    if (encSuggestions) {
                        _this._suggestions = JSON.parse((0, tutanota_utils_1.utf8Uint8ArrayToString)((0, tutanota_crypto_1.aes256Decrypt)(_this._db.key, encSuggestions, true, false)));
                    }
                    else {
                        _this._suggestions = {};
                    }
                });
            });
        });
    };
    SuggestionFacade.prototype.addSuggestions = function (words) {
        var _this = this;
        words.forEach(function (word) {
            if (word.length > 0) {
                var key = word.charAt(0);
                if (_this._suggestions[key]) {
                    var existingValues = _this._suggestions[key];
                    if (existingValues.indexOf(word) === -1) {
                        var insertIndex = existingValues.findIndex(function (v) { return word < v; });
                        if (insertIndex === -1) {
                            existingValues.push(word);
                        }
                        else {
                            existingValues.splice(insertIndex, 0, word);
                        }
                    }
                }
                else {
                    _this._suggestions[key] = [word];
                }
            }
        });
    };
    SuggestionFacade.prototype.getSuggestions = function (word) {
        if (word.length > 0) {
            var key = word.charAt(0);
            var result = this._suggestions[key];
            return result ? result.filter(function (r) { return r.startsWith(word); }) : [];
        }
        else {
            return [];
        }
    };
    SuggestionFacade.prototype.store = function () {
        var _this = this;
        return this._db.initialized.then(function () {
            return _this._db.dbFacade.createTransaction(false, [Indexer_1.SearchTermSuggestionsOS]).then(function (t) {
                var encSuggestions = (0, tutanota_crypto_1.aes256Encrypt)(_this._db.key, (0, tutanota_utils_1.stringToUtf8Uint8Array)(JSON.stringify(_this._suggestions)), tutanota_crypto_1.random.generateRandomData(tutanota_crypto_1.IV_BYTE_LENGTH), true, false);
                t.put(Indexer_1.SearchTermSuggestionsOS, _this.type.type.toLowerCase(), encSuggestions);
                return t.wait();
            });
        });
    };
    return SuggestionFacade;
}());
exports.SuggestionFacade = SuggestionFacade;
