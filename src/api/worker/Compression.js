"use strict";
/**
 * lz4 compression/decompression routines adopted from the node-lz4 library
 * https://github.com/pierrec/node-lz4
 * (which is a port of the original LZ4 library http://www.lz4.org).
 *
 * node-lz4 does a lot of things we don't need and drags Node Buffer and
 * whatnot with it and subsequently weights 103KB.
 *
 * Modified to include auto-resizing of the buffer and slicing of the data.
 */
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
exports.CompressionError = exports.compress = exports.uncompress = exports.UNCOMPRESSED_MAX_SIZE = void 0;
/*
Copyright (c) 2012 Pierre Curto

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */
/**
 * The largest a mail body can be to send. See StringUtils in TutaDb
 */
exports.UNCOMPRESSED_MAX_SIZE = 1024 * 1024;
/**
 * Decode a block. Assumptions: input contains all sequences of a
 * chunk.
 * @param input {Buffer} input data
 * @throws on invalid offset
 * @return {Uint8Array} decoded data
 */
function uncompress(input) {
    var endIndex = input.length;
    var output = new Uint8Array(input.length * 6);
    var j = 0;
    // Process each sequence in the incoming data
    for (var i = 0, n = endIndex; i < n;) {
        var token = input[i++];
        // Literals
        var literals_length = token >> 4;
        if (literals_length > 0) {
            // length of literals
            var l_1 = literals_length + 240;
            while (l_1 === 255) {
                l_1 = input[i++];
                literals_length += l_1;
            }
            // Copy the literals
            var end_1 = i + literals_length;
            var sizeNeeded_1 = j + (end_1 - i);
            if (output.length < sizeNeeded_1) {
                var newSize = Math.max(output.length * 2, sizeNeeded_1);
                var newOutput = new Uint8Array(newSize);
                newOutput.set(output);
                output = newOutput;
            }
            while (i < end_1)
                output[j++] = input[i++];
            // End of buffer?
            if (i === n)
                break; // return j
        }
        // Match copy
        // 2 bytes offset (little endian)
        var offset = input[i++] | (input[i++] << 8);
        // 0 is an invalid offset value
        if (offset === 0 || offset > j) {
            // was:
            // return -(i - 2)
            throw new Error("Invalid offset value. i: ".concat(i, ", -(i-2): ").concat(-(i - 2)));
        }
        // length of match copy
        var match_length = token & 0xf;
        var l = match_length + 240;
        while (l === 255) {
            l = input[i++];
            match_length += l;
        }
        // Copy the match
        var pos = j - offset; // position of the match copy in the current output
        var end = j + match_length + 4; // minmatch = 4
        var sizeNeeded = end;
        if (output.length < sizeNeeded) {
            var newSize = Math.max(output.length * 2, sizeNeeded);
            var newOutput = new Uint8Array(newSize);
            newOutput.set(output);
            output = newOutput;
        }
        while (j < end)
            output[j++] = output[pos++];
    }
    return output.slice(0, j);
}
exports.uncompress = uncompress;
var MAX_INPUT_SIZE = 0x7e000000;
var MIN_MATCH = 4;
var HASH_LOG = 16;
var HASH_SHIFT = MIN_MATCH * 8 - HASH_LOG;
var HASH_SIZE = 1 << HASH_LOG;
var COPY_LENGTH = 8;
var MF_LIMIT = COPY_LENGTH + MIN_MATCH;
var SKIP_STRENGTH = 6;
var ML_BITS = 4;
var ML_MASK = (1 << ML_BITS) - 1;
var RUN_BITS = 8 - ML_BITS;
var RUN_MASK = (1 << RUN_BITS) - 1;
var HASHER = 2654435761;
// CompressBound returns the maximum length of a lz4 block, given it's uncompressed length
function compressBound(isize) {
    return isize > MAX_INPUT_SIZE ? 0 : (isize + isize / 255 + 16) | 0;
}
function compress(source) {
    if (source.length === 0)
        return new Uint8Array(0);
    var dest = new Uint8Array(compressBound(source.length));
    // V8 optimization: non sparse array with integers
    var hashTable = new Array(HASH_SIZE).fill(0);
    var sourcePos = 0;
    var destPos = 0;
    var anchor = 0;
    var step = 1;
    var findMatchAttempts = (1 << SKIP_STRENGTH) + 3;
    var srcLength = source.length - MF_LIMIT;
    while (sourcePos + MIN_MATCH < srcLength) {
        // Find a match
        // min match of 4 bytes aka sequence
        var sequenceLowBits = (source[sourcePos + 1] << 8) | source[sourcePos];
        var sequenceHighBits = (source[sourcePos + 3] << 8) | source[sourcePos + 2];
        // compute hash for the current sequence
        var hash = Math.imul(sequenceLowBits | (sequenceHighBits << 16), HASHER) >>> HASH_SHIFT;
        // get the position of the sequence matching the hash
        // NB. since 2 different sequences may have the same hash
        // it is double-checked below
        // do -1 to distinguish between initialized and uninitialized values
        var ref = hashTable[hash] - 1;
        // save position of current sequence in hash table
        hashTable[hash] = sourcePos + 1;
        // first reference or within 64k limit or current sequence !== hashed one: no match
        if (ref < 0 ||
            (sourcePos - ref) >>> 16 > 0 ||
            ((source[ref + 3] << 8) | source[ref + 2]) != sequenceHighBits ||
            ((source[ref + 1] << 8) | source[ref]) != sequenceLowBits) {
            // increase step if nothing found within limit
            step = findMatchAttempts++ >> SKIP_STRENGTH;
            sourcePos += step;
            continue;
        }
        findMatchAttempts = (1 << SKIP_STRENGTH) + 3;
        // got a match
        var literals_length_1 = sourcePos - anchor;
        var offset = sourcePos - ref;
        // MIN_MATCH already verified
        sourcePos += MIN_MATCH;
        ref += MIN_MATCH;
        // move to the end of the match (>=MIN_MATCH)
        var match_length = sourcePos;
        while (sourcePos < srcLength && source[sourcePos] == source[ref]) {
            sourcePos++;
            ref++;
        }
        // match length
        match_length = sourcePos - match_length;
        // token
        var token = match_length < ML_MASK ? match_length : ML_MASK;
        // encode literals length
        if (literals_length_1 >= RUN_MASK) {
            var len 
            // add match length to the token
            = void 0;
            // add match length to the token
            dest[destPos++] = (RUN_MASK << ML_BITS) + token;
            for (len = literals_length_1 - RUN_MASK; len > 254; len -= 255) {
                dest[destPos++] = 255;
            }
            dest[destPos++] = len;
        }
        else {
            // add match length to the token
            dest[destPos++] = (literals_length_1 << ML_BITS) + token;
        }
        // write literals
        for (var i = 0; i < literals_length_1; i++) {
            dest[destPos++] = source[anchor + i];
        }
        // encode offset
        dest[destPos++] = offset;
        dest[destPos++] = offset >> 8;
        // encode match length
        if (match_length >= ML_MASK) {
            match_length -= ML_MASK;
            while (match_length >= 255) {
                match_length -= 255;
                dest[destPos++] = 255;
            }
            dest[destPos++] = match_length;
        }
        anchor = sourcePos;
    }
    // Write last literals
    // encode literals length
    var literals_length = source.length - anchor;
    if (literals_length >= RUN_MASK) {
        var ln = literals_length - RUN_MASK;
        // add match length to the token
        dest[destPos++] = RUN_MASK << ML_BITS;
        while (ln > 254) {
            dest[destPos++] = 255;
            ln -= 255;
        }
        dest[destPos++] = ln;
    }
    else {
        // add match length to the token
        dest[destPos++] = literals_length << ML_BITS;
    }
    // write literals
    sourcePos = anchor;
    while (sourcePos < source.length) {
        dest[destPos++] = source[sourcePos++];
    }
    return dest.slice(0, destPos);
}
exports.compress = compress;
var CompressionError = /** @class */ (function (_super) {
    __extends(CompressionError, _super);
    function CompressionError(message) {
        return _super.call(this, message) || this;
    }
    return CompressionError;
}(Error));
exports.CompressionError = CompressionError;
