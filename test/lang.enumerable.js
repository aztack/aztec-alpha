test("$root.lang.type", function(require, specs) {
    var _enum = require('$root.lang.enumerable'),
        _ = _enum._;

    var obj = {
        'a': 1,
        'b': 2,
        c: function() {
            return this.b;
        },
        d: 4
    }, ary = [0, 1, 2, '3', 4,
            function() {},
            6
        ],
        f = function(e, i) {
            return typeof e == 'number';
        };
    specs
        .___('enum#each')
        .it.should.equal([0, 1, 4], function() {
            var ret = [];
            _enum.each(ary, function(e, i, ary) {
                if (e == 3) return false;
                ret.push(e * i);
            }, null, true);

            return ret;
        })
        .it.should.equal(['a1', 'b2', 'c2', 'd4'], function() {
            var ret = [];
            _enum.each(obj, function(v, key, i, obj) {
                ret.push(key + (typeof v == 'function' ? v.call(obj) : v));
            }, null, true);
            return ret;
        })
        .___('enum#inject')
        .it.should.equal(10, function() {
            return _enum.inject(obj, 1, function(s, e) {
                s += typeof e == 'function' ? e.call(obj) : e;
                return s;
            });
        })
        .___('enum#some,all')
        .it.should.equal([true, false], function() {
            return [_enum.some(ary, f), _enum.all(ary, f)];
        })
        .___('enum#find')
        .it.should.equal([1, 2, 4, 1], function() {
            var a = _enum.find(obj, f),
                b;
            b = _enum.findAll(obj, f, false);
            return _enum.pluck(b, 'value').concat(a);
        })
        .___('enum#compact')
        .it.should.equal([0, 1, '2', 3.14], function() {
            return _enum.compact([null, 0, 1, '2', undefined, 3.14]);
        })
        .it.should.equal([1], function() {
            return [_enum.compact({
                a: undefined,
                b: null,
                c: 1
            }).c];
        })
        .___('enum#pluck')
        .it.should.equal([1, 2], function() {
            return _enum.pluck([{
                valueOf: function() {
                    return 1;
                }
            }, {
                valueOf: function() {
                    return 2;
                }
            }], '&valueOf');
        })
        .it.should.equal(['a', 'c'], function() {
            return _enum.pluck([
                ['a', 'b'],
                ['c', 'd']
            ], 0);
        })
        .it.should.equal(['0', '1', '2'], function() {
            return _enum.pluck([0, 1, 2], '&toString');
        })
        .___('enum#map')
        .it.should.equal([1, 3, 5], function() {
            return _enum.map([1, 2, 3], function(v, k) {
                return v + k;
            });
        })
        .done();
});