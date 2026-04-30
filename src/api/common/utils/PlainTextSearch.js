"use strict";
exports.__esModule = true;
exports._findMatches = exports._search = exports.search = void 0;
/**
 * @param queryString List of query words separated by whitespace
 * @param entries Plain text entries to search in.
 * @param attributeNames The attributes that are searched within entries. The list should be sorted by priority
 * @param markHits If set to true the hits will be marked with html tag <mark>
 * @returns a list of entries, sorted by priority, that match the query string
 */
function search(queryString, entries, attributeNames, markHits) {
    if (markHits === void 0) { markHits = false; }
    entries = entries.map(function (e) { return Object.assign({}, e); }); // create a copy in order to not override the original values
    if (queryString) {
        return _search(queryString, entries, attributeNames, markHits)
            .filter(function (match) { return match.matchedWords.length > 0; }) // a and be are two matches that refer to entries (e.g. faqs)
            .sort(function (a, b) {
            if (a.completeMatch !== b.completeMatch) {
                return b.completeMatch - a.completeMatch;
            }
            if (a.matchedWords.length !== b.matchedWords.length) {
                return b.matchedWords.length - a.matchedWords.length;
            }
            else if (a.fullWordMatches !== b.fullWordMatches) {
                return b.fullWordMatches - a.fullWordMatches;
            }
            else if (a.partialWordMatches !== b.partialWordMatches) {
                return b.partialWordMatches - a.partialWordMatches;
            }
            else {
                return 0;
            }
        })
            .map(function (match) { return match.entry; });
    }
    else {
        return entries;
    }
}
exports.search = search;
function _findMatchInEntry(nestedEntry, attributeName, queryString, queryWords, searchMatch, markHits) {
    var value = nestedEntry[attributeName];
    if (!value || typeof value !== "string") {
        return;
    }
    var splittedValue = value.split(/(<[^>]+>)/gi); // we split the array into words that are html markup and non html markup words as we don't want to search in html tags
    // find all matches with the full and exact queryString
    var completeRegExp = new RegExp(escapeRegExp(queryString), "gi");
    searchMatch.completeMatch += _findMatches(splittedValue, completeRegExp, false).hits;
    // create regualar expression to match whole words, case insensitive
    var fullWordRegExp = new RegExp(queryWords.map(function (queryWord) { return "\\b" + escapeRegExp(queryWord) + "\\b"; }).join("|"), "gi");
    searchMatch.fullWordMatches += _findMatches(splittedValue, fullWordRegExp, false).hits;
    // regular expression for finding all matches (including partial matches)
    var regExp = new RegExp(queryWords.map(function (queryWord) { return escapeRegExp(queryWord); }).join("|"), "gi");
    var findResult = _findMatches(splittedValue, regExp, markHits);
    if (markHits && findResult.hits > 0) {
        nestedEntry[attributeName] = splittedValue.join("");
    }
    findResult.matchedQueryWords.forEach(function (queryWord) {
        if (searchMatch.matchedWords.indexOf(queryWord) === -1) {
            searchMatch.matchedWords.push(queryWord);
        }
    });
    if (findResult.hits > 0) {
        searchMatch.partialWordMatches += findResult.hits;
    }
}
//export only for testing
function _search(queryString, entries, attributeNames, markHits) {
    var queryWords = queryString
        .toLocaleLowerCase()
        .split(" ")
        .map(function (word) { return word.trim(); })
        .filter(function (word) { return word.length > 0; });
    return entries.map(function (entry) {
        var searchMatch = {
            entry: entry,
            completeMatch: 0,
            fullWordMatches: 0,
            partialWordMatches: 0,
            matchedWords: []
        };
        attributeNames.forEach(function (name, index) {
            var nestedAttributes = name.split(".");
            var value = null;
            if (nestedAttributes.length === 1) {
                // no nesting regular value check
                _findMatchInEntry(entry, nestedAttributes[0], queryString, queryWords, searchMatch, markHits);
            }
            else if (nestedAttributes.length === 2) {
                // We only accept arrays that contain objects for now.
                var nestedArrayName = nestedAttributes[0], nestedEntryAttributeName_1 = nestedAttributes[1];
                // @ts-ignore
                var nestedArray = entry[nestedArrayName];
                if (Array.isArray(nestedArray)) {
                    nestedArray.forEach(function (nestedEntry) {
                        _findMatchInEntry(nestedEntry, nestedEntryAttributeName_1, queryString, queryWords, searchMatch, markHits);
                    });
                }
            }
        });
        return searchMatch;
    });
}
exports._search = _search;
//export for testing only
function _findMatches(splittedValue, regExp, markHits) {
    return splittedValue.reduce(function (sum, value, index) {
        if (value.trim().length === 0 || value.startsWith("<")) {
            return sum;
        }
        splittedValue[index] = value.replace(regExp, function (match) {
            sum.hits++;
            if (sum.matchedQueryWords.indexOf(match.toLowerCase()) === -1) {
                sum.matchedQueryWords.push(match.toLowerCase());
            }
            if (markHits && match.length > 2) {
                // only mark matches that are longer then two characters.
                // We could mark these small matches but we should check that the match is a whole word then.
                return "<mark>".concat(match, "</mark>");
            }
            else {
                return match;
            }
        });
        return sum;
    }, {
        hits: 0,
        matchedQueryWords: []
    });
}
exports._findMatches = _findMatches;
// see https://stackoverflow.com/a/6969486
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}
