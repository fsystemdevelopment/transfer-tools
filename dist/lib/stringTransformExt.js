"use strict";
exports.__esModule = true;
var stringTransform_1 = require("./stringTransform");
/**
 * Assuming there is an index n in [ 0 ... lastIndex ] such as
 * for all i <= n condition(i) is true
 * and for all i > n condition(i) is false
 * this function find n
 */
function findLastIndexFulfilling(condition, lastIndex) {
    if (lastIndex < 0) {
        throw Error("range error");
    }
    if (!condition(0)) {
        throw Error("no index fullfil the condition");
    }
    return (function callee(fromIndex, toIndex) {
        if (fromIndex === toIndex) {
            return fromIndex;
        }
        else if (fromIndex + 1 === toIndex) {
            if (condition(toIndex)) {
                return toIndex;
            }
            else {
                return fromIndex;
            }
        }
        else {
            var length_1 = toIndex - fromIndex + 1;
            var halfLength = Math.floor(length_1 / 2);
            var middleIndex = fromIndex + halfLength;
            if (condition(middleIndex)) {
                return callee(middleIndex, toIndex);
            }
            else {
                return callee(fromIndex, middleIndex);
            }
        }
    })(0, lastIndex);
}
exports.findLastIndexFulfilling = findLastIndexFulfilling;
function b64crop(partMaxLength, text) {
    var _a = stringTransform_1.transcode("base64"), enc = _a.enc, dec = _a.dec;
    var isNotTooLong = function (index) {
        var part = text.substring(0, index);
        var encPart = enc(part);
        return encPart.length <= partMaxLength;
    };
    //99.9% of the cases for SMS
    if (isNotTooLong(text.length)) {
        return enc(text.substring(0, text.length));
    }
    var index = findLastIndexFulfilling(isNotTooLong, text.length);
    while (true) {
        var part = text.substring(0, index);
        var rest = text.substring(index, text.length);
        if ((dec(enc(part)) + dec(enc(rest))) !== dec(enc(text))) {
            index--;
        }
        else {
            return enc(part + "[...]");
        }
    }
}
exports.b64crop = b64crop;
