/** Compare if two object represent the same data, [ "ok", "foo" ] <=> [ "foo", "ok" ] */
export declare function assertSame<T>(o1: T, o2: T, errorMessage?: string): void;
export declare namespace assertSame {
    let handleArrayAsSet: boolean;
    function perform<T>(o1: T, o2: T): void;
}
/** ex 123320 */
export declare const genDigits: (n: number) => string;
/** Hex str to lower char */
export declare const genHexStr: (n: number) => string;
export declare namespace seedRandom {
    function plant(seed: string): void;
    function restore(): void;
}
/** Length is not Byte length but the number of char */
export declare function genUtf8Str(length: number, restrict?: "ONLY 4 BYTE CHAR" | "ONLY 1 BYTE CHAR", seed?: string): string;
export declare namespace genUtf8Str {
    /** return a random utf8 char that fit on one byte */
    function genUtf8Char1B(): string;
    const genUtf8Char2B: () => any;
    function genUtf8Char3B(rand?: number): string;
    function genUtf8Char4B(rand?: number): string;
    function genUtf8Char(): string;
}
