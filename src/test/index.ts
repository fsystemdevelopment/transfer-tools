import * as lib from "../lib";

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

class A {

    public foo= "bar";

    constructor( public baz: number ){ }

}

namespace A {

    export const serializer: lib.JSON_CUSTOM.Serializer<A>= {
        "name": "A",
        "isInstance": o => o instanceof A,
        "serialize": a => [ `${a.baz}` ],
        "deserialize": str => new A(parseInt(str))
    };

}


const JSON_CUSTOM= lib.JSON_CUSTOM.get([A.serializer]);

let objSrc= {
    "a": new A(~~(Math.random()* 10)),
    "str": lib.testing.genUtf8Str(15),
    "arr": [ 2, "foo", "bar", { "foo": "bar" } ],
    "null": null,
    "undefined": undefined,
    "digits": lib.testing.genDigits(30),
    "hex": lib.testing.genHexStr(20),
    "date": new Date()
};

console.log({ objSrc });

let split= lib.stringTransform.b64Split(5, JSON_CUSTOM.stringify(objSrc));

let obj: typeof objSrc= JSON_CUSTOM.parse(lib.stringTransform.b64Unsplit(split))!;

obj.arr= shuffle(obj.arr);

console.log({ obj });

lib.testing.assertSame(objSrc, obj, "FAIL");

console.log("PASS!");
