import { transcode } from "./stringTransform";

/** 
 * Assuming there is an index n in [ 0 ... lastIndex ] such as
 * for all i <= n condition(i) is true
 * and for all i > n condition(i) is false
 * this function find n
 */
export function findLastIndexFulfilling(
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

    let { enc, dec }= transcode("base64");

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
