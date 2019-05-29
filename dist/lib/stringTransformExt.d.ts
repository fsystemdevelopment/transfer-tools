/**
 * Assuming there is an index n in [ 0 ... lastIndex ] such as
 * for all i <= n condition(i) is true
 * and for all i > n condition(i) is false
 * this function find n
 */
export declare function findLastIndexFulfilling(condition: (index: number) => boolean, lastIndex: number): any;
export declare function b64crop(partMaxLength: number, text: string): string;
