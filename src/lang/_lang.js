({
    description: "JavaScript Language Supplement",
    version: '0.0.1',
    namespace: $root.lang.array,
    imports: {
        _type: $root.lang.type,
        _fn: $root.lang.fn
    },
    exports: [
        w,
        forEach,
        indexOf,
        toArray,
        equal,
        strictEqual,
        compact,
        flatten,
        fill,
        fromRange
    ]
});