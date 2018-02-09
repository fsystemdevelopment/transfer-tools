declare const Buffer: any;

export type Encoding =
    "ascii" | "utf8" | "utf16le" | "ucs2" |
    "base64" | "latin1" | "binary" | "hex"
    ;

export function safeBufferFromTo(
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


export function transcode(encoding: Encoding, alphabetMap: Record<string, string> = {}) {

    let reverseAlphabetMap: Record<string, string> = {};

    for (let char in alphabetMap) {
        reverseAlphabetMap[alphabetMap[char]] = char;
    }

    return {
        "enc": (str: string) => transcode.applyNewAlphabet(
            safeBufferFromTo(str, "utf8", encoding),
            alphabetMap
        ),
        "dec": (encStr: string) => safeBufferFromTo(
            transcode.applyNewAlphabet(encStr, reverseAlphabetMap),
            encoding, "utf8"
        )

    };

}

export namespace transcode {

    const regExpCache: { [char: string]: RegExp } = {};

    export function applyNewAlphabet(str: string, alphabetMap: Record<string, string>) {

        for (let char in alphabetMap) {

            let regExp = regExpCache[char];

            if (!regExp) {

                regExp = new RegExp(`\\${char}`, "g");

                regExpCache[char] = regExp;

            }

            str = str.replace(regExp, alphabetMap[char]);

        }

        return str;

    }

}


/** 
 * partLength correspond to string length not byte 
 * but in base 64 all char are ascii so partMaxLength <=> partMaxBytes 
 **/
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


