export declare type Encoding = "ascii" | "utf8" | "utf16le" | "ucs2" | "base64" | "latin1" | "binary" | "hex";
export declare function safeBufferFromTo(str: string, fromEnc: Encoding, toEnc: Encoding): string;
export declare function transcode(encoding: Encoding, alphabetMap?: Record<string, string>): {
    "enc": (str: string) => string;
    "dec": (encStr: string) => string;
};
export declare namespace transcode {
    function applyNewAlphabet(str: string, alphabetMap: Record<string, string>): string;
}
/**
 * partLength correspond to string length not byte
 * but in base 64 all char are ascii so partMaxLength <=> partMaxBytes
 **/
export declare function textSplit(partMaxLength: number, text: string): string[];
