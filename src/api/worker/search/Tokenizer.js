"use strict";
exports.__esModule = true;
exports.tokenize = void 0;
function tokenize(text) {
    if (text == null)
        return [];
    var currentWord = [];
    var words = [];
    for (var i = 0; i < text.length; i++) {
        var currentChar = text.charAt(i);
        if (isEndOfWord(currentChar)) {
            addCurrentWord(currentWord, words);
            currentWord = [];
        }
        else {
            currentWord.push(currentChar);
        }
    }
    addCurrentWord(currentWord, words);
    return words;
}
exports.tokenize = tokenize;
function addCurrentWord(currentWord, words) {
    while (currentWord.length > 0 && currentWord[0] === "'") {
        currentWord.shift();
    }
    while (currentWord.length > 0 && currentWord[currentWord.length - 1] === "'") {
        currentWord.pop();
    }
    if (currentWord.length > 0) {
        words.push(currentWord.join("").toLowerCase());
    }
}
function isEndOfWord(char) {
    switch (char) {
        case " ":
        case "\n":
        case "\r":
        case "\t":
        case "\x0B":
        case "\f":
        case ".":
        case ",":
        case ":":
        case ";":
        case "!":
        case "?":
        case "&":
        case '"':
        case "<":
        case ">":
        case "-":
        case "+":
        case "=":
        case "(":
        case ")":
        case "[":
        case "]":
        case "{":
        case "}":
        case "/":
        case "\\":
        case "^":
        case "_":
        case "`":
        case "~":
        case "|":
        case "@":
            return true;
        default:
            return false;
    }
}
