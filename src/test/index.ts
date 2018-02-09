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
    "str": lib.testing.genUtf8Str(300),
    "arr": [ 2, "foo", "bar", { "foo": "bar" } ],
    "null": null,
    "undefined": undefined,
    "digits": lib.testing.genDigits(2000),
    "hex": lib.testing.genHexStr(20),
    "date": new Date()
};


let before= Date.now();

let { enc, dec } = lib.stringTransform.transcode("base64", { "=": "_" } );

let split= lib.stringTransform.textSplit( 100,
    enc(
        JSON_CUSTOM.stringify(
            objSrc
        )
    )
);

let obj: typeof objSrc= JSON_CUSTOM.parse(   
    dec(   
        split.join("")  
    ) 
);

console.log(`duration: ${Date.now() - before}`);


obj.arr= shuffle(obj.arr);


lib.testing.assertSame(objSrc, obj, "FAIL");

console.log("PASS!");
