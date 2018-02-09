import * as superJson from "super-json";

export type Serializer<T extends object> = {
    serialize(obj: T): [string];
    deserialize(str: string): T;
    isInstance(obj: any): boolean;
    name: string;
};

/** Support undefined and Date by default*/
export function get(serializers: Serializer<object>[]= []) {

    const myJson = superJson.create({
        "magic": '#!',
        "serializers": [
            superJson.dateSerializer,
            ...serializers
        ]
    });

    return {
        "stringify": (obj: any): string => {

            if (obj === undefined) {
                return "undefined";
            }

            return myJson.stringify([obj]);

        },
        "parse": (str: string): any => {

            if (str === "undefined") {
                return undefined;
            }

            return myJson.parse(str).pop();

        }
    };

}
