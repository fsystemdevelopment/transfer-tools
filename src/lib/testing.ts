import { safeBufferFromTo } from "./stringTransform";
import * as seedrandom from "seedrandom";

/** Compare if two object represent the same data, [ "ok", "foo" ] <=> [ "foo", "ok" ] */
export function assertSame<T>(
    o1: T, o2: T, errorMessage: string = "assertSame error"
) {

    try {
        assertSame.perform(o1, o2);
    } catch (e) {
        let error = new Error(`${errorMessage} (${e.message})`);
        error["o1"] = o1;
        error["o2"] = o2;
        throw error;
    }

}

export namespace assertSame {

    export let handleArrayAsSet = true;

    export function perform<T>(
        o1: T,
        o2: T,
    ) {

        if (o1 instanceof Date) {

            if (!(o2 instanceof Date)) {
                console.assert(false, "M0");
                return;
            }

            console.assert(o1.getTime() === o2!.getTime(), "Date mismatch");

        } else if (o1 instanceof Object) {

            console.assert(o2 instanceof Object, "M1");

            if (handleArrayAsSet && o1 instanceof Array) {

                if (!(o2 instanceof Array)) {
                    console.assert(false, "M2");
                    return;
                }

                console.assert(o1.length === o2.length, "M3");

                let o2Set = new Set(o2);

                for (let val1 of o1) {

                    let isFound = false;

                    for (let val2 of o2Set) {

                        try {
                            perform(val1, val2);
                        } catch{
                            continue;
                        }

                        isFound = true;
                        o2Set.delete(val2);
                        break;

                    }

                    console.assert(isFound, "M4");

                }

            } else {

                if (o1 instanceof Array) {

                    if (!(o2 instanceof Array)) {
                        console.assert(false, "M5");
                        return;
                    }

                    console.assert(o1.length === o2.length, "M6");

                } else {

                    perform(
                        Object.keys(o1).filter(key => o1[key] !== undefined),
                        Object.keys(o2).filter(key => o2[key] !== undefined)
                    );

                }

                for (let key in o1) {
                    perform(o1[key], o2[key]);
                }

            }

        } else {

            console.assert(o1 === o2, `${o1} !== ${o2}`);

        }

    }

}


/** ex 123320 */
export const genDigits = (n: number): string =>
    (new Array(n))
        .fill("")
        .map(() => `${~~(Math.random() * 10)}`)
        .join("")
    ;

/** Hex str to lower char */
export const genHexStr = (n: number) => (new Array(n))
    .fill("")
    .map(() => (~~(Math.random() * 0x10)).toString(16))
    .join("")
    ;

export namespace seedRandom {

    const random = Math.random;

    export function plant(seed: string) {

        Math.random = (function () {

            let prev: number | undefined = undefined;

            return function random() {

                prev = seedrandom(
                    prev === undefined ?
                        seed :
                        prev.toFixed(12)
                    , { "global": false }).quick() as number;

                return prev;

            };

        })();

    }

    export function restore() {
        Math.random = random;
    }

}

/** Length is not Byte length but the number of char */
export function genUtf8Str(
    length: number,
    restrict?: "ONLY 4 BYTE CHAR" | "ONLY 1 BYTE CHAR",
    seed?: string
): string {

    let charGenerator: () => string;

    switch (restrict) {
        case undefined: charGenerator = genUtf8Str.genUtf8Char; break;
        case "ONLY 1 BYTE CHAR": charGenerator = genUtf8Str.genUtf8Char1B; break;
        case "ONLY 4 BYTE CHAR": charGenerator = genUtf8Str.genUtf8Char4B; break;
    }

    if (typeof seed === "string") {
        seedRandom.plant(seed);
    }

    const out = (new Array(length)).fill("").map(() => charGenerator()).join("");

    seedRandom.restore();

    return out;

}

export namespace genUtf8Str {

    /** "11110000" => "f0" */
    function bitStrToHexStr(bin: string): string {

        let hexChars: string[] = [];

        let i = 0;

        while (bin[i] !== undefined) {

            let fourBits = `${bin[i]}${bin[i + 1]}${bin[i + 2]}${bin[i + 3]}`;

            let hexChar = parseInt(fourBits, 2).toString(16);

            hexChars.push(hexChar)

            i = i + 4;

        }

        return hexChars.join("");

    };

    /** 8 => "11010001"  */
    function genBitStr(length: number): string {
        return (new Array(length)).fill("").map(() => `${~~(Math.random() * 2)}`).join("");
    }

    /** throw error if hex does not represent a valid utf8 string */
    function hexStrToUtf8Str(hex: string) {

        let str = safeBufferFromTo(hex, "hex", "utf8");

        if (safeBufferFromTo(str, "utf8", "hex") !== hex) {
            throw new Error("Invalid UTF8 data");
        }

        return str;

    }

    /** return a random utf8 char that fit on one byte */
    export function genUtf8Char1B(): string {

        let bin = `0${genBitStr(7)}`;

        let hex = bitStrToHexStr(bin);

        try {

            return hexStrToUtf8Str(hex);

        } catch{

            return genUtf8Char1B();

        }

    }


    export const genUtf8Char2B = () => {

        let bin = `110${genBitStr(5)}10${genBitStr(6)}`;

        let hex = bitStrToHexStr(bin);

        try {

            return hexStrToUtf8Str(hex);

        } catch{

            return genUtf8Char2B();

        }

    }


    export function genUtf8Char3B(rand?: number): string {

        if (rand === undefined) {
            rand = ~~(Math.random() * 8);
        }

        let bin;

        switch (rand) {
            case 0: bin = `11100000101${genBitStr(5)}10${genBitStr(6)}`; break;
            case 1: bin = `1110000110${genBitStr(6)}10${genBitStr(6)}`; break;
            case 2: bin = `1110001${genBitStr(1)}10${genBitStr(6)}10${genBitStr(6)}`; break;
            case 3: bin = `111001${genBitStr(2)}10${genBitStr(6)}10${genBitStr(6)}`; break;
            case 4: bin = `111010${genBitStr(2)}10${genBitStr(6)}10${genBitStr(6)}`; break;
            case 5: bin = `1110110010${genBitStr(6)}10${genBitStr(6)}`; break;
            case 6: bin = `11101101100${genBitStr(5)}10${genBitStr(6)}`; break;
            case 7: bin = `1110111${genBitStr(1)}10${genBitStr(6)}10${genBitStr(6)}`; break;
        }

        let hex = bitStrToHexStr(bin);

        try {

            return hexStrToUtf8Str(hex);

        } catch{

            return genUtf8Char3B();

        }

    };

    export function genUtf8Char4B(rand?: number): string {

        if (rand === undefined) {
            rand = ~~(Math.random() * 5);
        }

        let bin;

        switch (rand) {
            case 0: bin = `111100001001${genBitStr(4)}10${genBitStr(6)}10${genBitStr(6)}`; break;
            case 1: bin = `11110000101${genBitStr(5)}10${genBitStr(6)}10${genBitStr(6)}`; break;
            case 2: bin = `1111000110${genBitStr(6)}10${genBitStr(6)}10${genBitStr(6)}`; break;
            case 3: bin = `1111001${genBitStr(1)}10${genBitStr(6)}10${genBitStr(6)}10${genBitStr(6)}`; break;
            case 4: bin = `111101001000${genBitStr(4)}10${genBitStr(6)}10${genBitStr(6)}`; break;
        }

        let hex = bitStrToHexStr(bin);

        try {

            return hexStrToUtf8Str(hex);

        } catch{

            return genUtf8Char4B();

        }


    };

    export function genUtf8Char(): string {

        let rand = ~~(Math.random() * 4) as (0 | 1 | 2 | 3);

        switch (rand) {
            case 0: return genUtf8Char1B();
            case 1: return genUtf8Char2B();
            case 2: return genUtf8Char3B();
            case 3: return genUtf8Char4B();
        }

    };


}