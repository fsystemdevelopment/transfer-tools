export declare type Encoding = "ascii" | "utf8" | "utf16le" | "ucs2" | "base64" | "latin1" | "binary" | "hex";
export declare function transcode(str: string, fromEnc: Encoding, toEnc: Encoding): string;
/** partLength correspond to string length not byte */
export declare function textSplit(partMaxLength: number, text: string): string[];
/** part length correspond to the byte as every b46 char is ascii */
export declare function b64Split(partMaxLength: number, text: string): string[];
export declare function b64Unsplit(encodedParts: string[]): string;
export declare function b64crop(partMaxLength: number, text: string): string;
