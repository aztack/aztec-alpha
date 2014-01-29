({
    description: 'Chain',
    namespace: $root.lang.chain,
    imports: {
        _enum: $root.lang.enumerable,
        _object: $root.lang.object
        //$: jQuery
    },
    exports: [
        _
    ]
});

var _slice = Array.prototype.slice,
    proto = {
        value: function() {
            return this.value;
        },
        set: function(v, force) {
            if (typeof v != 'function' || force === true) {
                this.value = v;
            } else {
                this.value = v();
            }
            return this;
        }
    };

function addMethodToProto(names, methods) {
    _enum.each(names, function(value, name) {
        proto[name] = function() {
            var args = _slice.call(arguments);
            args.unshift(this.value);
            this.value = methods[name].apply(this, args);
            return this;
        };
    });
}

addMethodToProto(_enum, _enum);
addMethodToProto(['mix',
    'keys',
    'values',
    'tryget',
    'tryset',
    'pairs'
], _object);

function Chain(objs) {
    this.value = objs;
}
Chain.prototype = proto;

///exports
function _(objs) {
    return new Chain(objs);
}