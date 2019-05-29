export declare type Serializer<T extends object> = {
    serialize(obj: T): [string];
    deserialize(str: string): T;
    isInstance(obj: any): boolean;
    name: string;
};
/** Support undefined and Date by default*/
export declare function get(serializers?: Serializer<object>[]): {
    "stringify": (obj: any) => string;
    "parse": (str: string) => any;
};
