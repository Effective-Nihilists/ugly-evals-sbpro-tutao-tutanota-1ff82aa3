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
exports.__esModule = true;
exports.StringIterator = exports.numberParser = exports.makeNotOneOfCharactersParser = exports.makeOneOfCharactersParser = exports.makeEitherParser = exports.makeSeparatedByParser = exports.maybeParse = exports.makeOneOrMoreParser = exports.mapParser = exports.makeZeroOrMoreParser = exports.makeNotCharacterParser = exports.makeCharacterParser = exports.combineParsers = exports.ParserError = void 0;
var tutanota_utils_1 = require("@tutao/tutanota-utils");
var TutanotaError_1 = require("../../api/common/error/TutanotaError");
var ParserError = /** @class */ (function (_super) {
    __extends(ParserError, _super);
    function ParserError(message, filename) {
        var _this = _super.call(this, "ParserError", message) || this;
        _this.filename = filename !== null && filename !== void 0 ? filename : null;
        return _this;
    }
    return ParserError;
}(TutanotaError_1.TutanotaError));
exports.ParserError = ParserError;
exports.combineParsers = (0, tutanota_utils_1.downcast)(function () {
    var parsers = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        parsers[_i] = arguments[_i];
    }
    return function (iterator) { return parsers.map(function (p) { return p(iterator); }); };
});
function makeCharacterParser(character) {
    return function (iterator) {
        var value = iterator.peek();
        if (value === character) {
            iterator.next();
            return value;
        }
        var sliceStart = Math.max(iterator.position - 10, 0);
        var sliceEnd = Math.min(iterator.position + 10, iterator.iteratee.length - 1);
        throw new ParserError("expected character ".concat(character, " got ").concat(value, " near ").concat(iterator.iteratee.slice(sliceStart, sliceEnd)));
    };
}
exports.makeCharacterParser = makeCharacterParser;
function makeNotCharacterParser(character) {
    return function (iterator) {
        var value = iterator.peek();
        if (value !== character) {
            iterator.next();
            return value;
        }
        var sliceStart = Math.max(iterator.position - 10, 0);
        var sliceEnd = Math.min(iterator.position + 10, iterator.iteratee.length - 1);
        throw new ParserError("expected character ".concat(character, " got ").concat(value, " near ").concat(iterator.iteratee.slice(sliceStart, sliceEnd)));
    };
}
exports.makeNotCharacterParser = makeNotCharacterParser;
function makeZeroOrMoreParser(anotherParser) {
    return function (iterator) {
        var result = [];
        try {
            var parseResult = anotherParser(iterator);
            while (true) {
                result.push(parseResult);
                parseResult = anotherParser(iterator);
            }
        }
        catch (e) {
        }
        return result;
    };
}
exports.makeZeroOrMoreParser = makeZeroOrMoreParser;
function mapParser(parser, mapper) {
    return function (iterator) {
        return mapper(parser(iterator));
    };
}
exports.mapParser = mapParser;
function makeOneOrMoreParser(parser) {
    return mapParser(makeZeroOrMoreParser(parser), function (value) {
        if (value.length === 0) {
            throw new ParserError("Expected at least one value, got none");
        }
        return value;
    });
}
exports.makeOneOrMoreParser = makeOneOrMoreParser;
function maybeParse(parser) {
    return function (iterator) {
        try {
            return parser(iterator);
        }
        catch (e) {
            return null;
        }
    };
}
exports.maybeParse = maybeParse;
function makeSeparatedByParser(separatorParser, valueParser) {
    return function (iterator) {
        var result = [];
        result.push(valueParser(iterator));
        while (true) {
            try {
                separatorParser(iterator);
            }
            catch (e) {
                break;
            }
            result.push(valueParser(iterator));
        }
        return result;
    };
}
exports.makeSeparatedByParser = makeSeparatedByParser;
function makeEitherParser(parserA, parserB) {
    return function (iterator) {
        var iteratorPosition = iterator.position;
        try {
            return parserA(iterator);
        }
        catch (e) {
            if (e instanceof ParserError) {
                iterator.position = iteratorPosition;
                return parserB(iterator);
            }
            throw e;
        }
    };
}
exports.makeEitherParser = makeEitherParser;
function makeOneOfCharactersParser(allowed) {
    return function (iterator) {
        var value = iterator.peek();
        if (allowed.includes(value)) {
            iterator.next();
            return value;
        }
        throw new ParserError("Expected one of ".concat(allowed.map(function (c) { return "\"".concat(c, "\""); }).join(", "), ", but got \"").concat(value, "\n").concat(context(iterator, iterator.position, 10), "\""));
    };
}
exports.makeOneOfCharactersParser = makeOneOfCharactersParser;
function makeNotOneOfCharactersParser(notAllowed) {
    return function (iterator) {
        var value = iterator.peek();
        if (typeof value !== "string") {
            throw new ParserError("unexpected end of input");
        }
        if (!notAllowed.includes(value)) {
            iterator.next();
            return value;
        }
        throw new ParserError("Expected none of ".concat(notAllowed.map(function (c) { return "\"".concat(c, "\""); }).join(", "), ", but got \"").concat(value, "\"\n").concat(context(iterator, iterator.position, 10)));
    };
}
exports.makeNotOneOfCharactersParser = makeNotOneOfCharactersParser;
exports.numberParser = mapParser(makeOneOrMoreParser(makeOneOfCharactersParser(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"])), function (values) { return parseInt(values.join(""), 10); });
var StringIterator = /** @class */ (function () {
    function StringIterator(iteratee) {
        this.position = -1;
        this.iteratee = iteratee;
    }
    StringIterator.prototype.next = function () {
        var value = this.iteratee[++this.position];
        var done = this.position >= this.iteratee.length;
        return done
            ? {
                done: true,
                value: undefined
            }
            : {
                done: false,
                value: value
            };
    };
    StringIterator.prototype.peek = function () {
        return this.iteratee[this.position + 1];
    };
    return StringIterator;
}());
exports.StringIterator = StringIterator;
function context(iterator, contextCentre, contextRadius) {
    if (contextRadius === void 0) { contextRadius = 10; }
    var sliceStart = Math.max(contextCentre - contextRadius, 0);
    var sliceEnd = Math.min(contextCentre + contextRadius, iterator.iteratee.length - 1);
    var sliceLength = sliceEnd - sliceStart;
    var actualPosition = contextCentre - (2 * contextRadius - sliceLength);
    return iterator.iteratee.slice(sliceStart, sliceEnd);
}
