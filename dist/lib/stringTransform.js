"use strict";
exports.__esModule = true;
function safeBufferFromTo(str, fromEnc, toEnc) {
    try {
        return Buffer.from(str, fromEnc).toString(toEnc);
    }
    catch (_a) {
        return (new Buffer(str, fromEnc)).toString(toEnc);
    }
}
exports.safeBufferFromTo = safeBufferFromTo;
function transcode(encoding, alphabetMap) {
    if (alphabetMap === void 0) { alphabetMap = {}; }
    var reverseAlphabetMap = {};
    for (var char in alphabetMap) {
        reverseAlphabetMap[alphabetMap[char]] = char;
    }
    return {
        "enc": function (str) { return transcode.applyNewAlphabet(safeBufferFromTo(str, "utf8", encoding), alphabetMap); },
        "dec": function (encStr) { return safeBufferFromTo(transcode.applyNewAlphabet(encStr, reverseAlphabetMap), encoding, "utf8"); }
    };
}
exports.transcode = transcode;
(function (transcode) {
    var regExpCache = {};
    function applyNewAlphabet(str, alphabetMap) {
        for (var char in alphabetMap) {
            var regExp = regExpCache[char];
            if (!regExp) {
                regExp = new RegExp("\\" + char, "g");
                regExpCache[char] = regExp;
            }
            str = str.replace(regExp, alphabetMap[char]);
        }
        return str;
    }
    transcode.applyNewAlphabet = applyNewAlphabet;
})(transcode = exports.transcode || (exports.transcode = {}));
/**
 * partLength correspond to string length not byte
 * but in base 64 all char are ascii so partMaxLength <=> partMaxBytes
 **/
function textSplit(partMaxLength, text) {
    var parts = [];
    var rest = text;
    while (rest) {
        if (partMaxLength >= rest.length) {
            parts.push(rest);
            rest = "";
        }
        else {
            parts.push(rest.substring(0, partMaxLength));
            rest = rest.substring(partMaxLength, rest.length);
        }
    }
    return parts;
}
exports.textSplit = textSplit;
