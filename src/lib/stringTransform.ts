declare const Buffer: any;

export type Encoding =
    "ascii" | "utf8" | "utf16le" | "ucs2" |
    "base64" | "latin1" | "binary" | "hex"
    ;

export function transcode(
    str: string,
    fromEnc: Encoding,
    toEnc: Encoding
): string {


    try {

        return Buffer.from(str, fromEnc).toString(toEnc);

    } catch{

        return (new Buffer(str, fromEnc)).toString(toEnc);

    }

}

/** partLength correspond to string length not byte */
export function textSplit(partMaxLength: number, text: string): string[] {

    let parts: string[] = [];

    let rest = text;

    while (rest) {

        if (partMaxLength >= rest.length) {
            parts.push(rest);
            rest = "";
        } else {
            parts.push(rest.substring(0, partMaxLength));
            rest = rest.substring(partMaxLength, rest.length);
        }

    }

    return parts;

}

/** part length correspond to the byte as every b46 char is ascii */
export function b64Split(
    partMaxLength: number,
    text: string,
): string[] {
    return textSplit(partMaxLength, transcode(text, "utf8", "base64"));
}

export function b64Unsplit(encodedParts: string[]): string {
    return transcode(encodedParts.join(""), "base64", "utf8");
}


/** 
 * Assuming there is an index n in [ 0 ... lastIndex ] such as
 * for all i <= n condition(i) is true
 * and for all i > n condition(i) is false
 * this function find n
 */
function findLastIndexFulfilling(
    condition: (index: number) => boolean,
    lastIndex: number
) {

    if (lastIndex < 0) {
        throw Error("range error");
    }

    if (!condition(0)) {
        throw Error("no index fullfil the condition");
    }

    return (function callee(fromIndex, toIndex) {

        if (fromIndex === toIndex) {

            return fromIndex;

        } else if (fromIndex + 1 === toIndex) {

            if (condition(toIndex)) {
                return toIndex;
            } else {
                return fromIndex;
            }

        } else {

            let length = toIndex - fromIndex + 1;
            let halfLength = Math.floor(length / 2);
            let middleIndex = fromIndex + halfLength;

            if (condition(middleIndex)) {

                return callee(middleIndex, toIndex);

            } else {

                return callee(fromIndex, middleIndex);

            }
        }

    })(0, lastIndex);

}

export function b64crop(partMaxLength: number, text: string): string {

    let enc= (str: string)=> transcode(str, "utf8", "base64");
    let dec= (str: string)=> transcode(str, "base64", "utf8");

    let isNotTooLong = (index: number): boolean => {

        let part = text.substring(0, index);

        let encPart = enc(part);

        return encPart.length <= partMaxLength;

    }

    //99.9% of the cases for SMS
    if (isNotTooLong(text.length)) {
        return enc(text.substring(0, text.length));
    }

    let index = findLastIndexFulfilling(isNotTooLong, text.length);

    while (true) {

        let part = text.substring(0, index);

        let rest = text.substring(index, text.length);

        if ((dec(enc(part)) + dec(enc(rest))) !== dec(enc(text))) {
            index--;
        } else {
            return enc(`${part}[...]`);
        }

    }

}
