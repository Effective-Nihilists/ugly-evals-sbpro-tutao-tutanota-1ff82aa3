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
exports.PasswordGenerator = exports.BYTE_RANGE = exports.NUMBER_OF_BYTES = void 0;
var Env_1 = require("../../api/common/Env");
var tutanota_utils_1 = require("@tutao/tutanota-utils");
(0, Env_1.assertMainOrNode)();
// exported for tests
// size of dictionary is within the 2Byte range
exports.NUMBER_OF_BYTES = 2;
exports.BYTE_RANGE = Math.pow(2, (8 * exports.NUMBER_OF_BYTES));
var PasswordGenerator = /** @class */ (function () {
    function PasswordGenerator(randomizer, dictionary) {
        this.randomizer = randomizer;
        this.dictionary = dictionary;
    }
    PasswordGenerator.prototype.generateRandomPassphrase = function () {
        return __awaiter(this, void 0, void 0, function () {
            var usedWords, word;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        usedWords = new Set();
                        _a.label = 1;
                    case 1:
                        if (!(usedWords.size < 6)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.pickRandomWordFromDictionary()];
                    case 2:
                        word = _a.sent();
                        usedWords.add(word);
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/, Array.from(usedWords).join(" ")];
                }
            });
        });
    };
    PasswordGenerator.prototype.pickRandomWordFromDictionary = function () {
        return __awaiter(this, void 0, void 0, function () {
            var length, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        length = this.dictionary.length;
                        _a = this.dictionary;
                        return [4 /*yield*/, this.generateRandomNumberInRange(length)];
                    case 1: return [2 /*return*/, _a[_b.sent()]];
                }
            });
        });
    };
    // The Randomizer generates a number within range := {0, ..., BYTE_RANGE - 1} (1Byte -> {0, ..., 255} for BYTE_RANGE = 256)
    // To scale the number n to our desired range, we can divide n by the BYTE_RANGE, resulting in a number n with 0 <= n < 1
    // @param 'range' is the length of the dictionary. Multiplying the above number by the range will result in a number in range := {0, ..., range - 1}
    // This is necessary to keep the distribution of numbers even, as well as ensuring that we do not access any invalid Index
    PasswordGenerator.prototype.generateRandomNumberInRange = function (range) {
        return __awaiter(this, void 0, void 0, function () {
            var byteNumber;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        (0, tutanota_utils_1.assert)(range > 0, "range must be greater than 0");
                        return [4 /*yield*/, this.randomizer.generateRandomNumber(exports.NUMBER_OF_BYTES)];
                    case 1:
                        byteNumber = _a.sent();
                        return [2 /*return*/, Math.floor((byteNumber / exports.BYTE_RANGE) * range)];
                }
            });
        });
    };
    return PasswordGenerator;
}());
exports.PasswordGenerator = PasswordGenerator;
