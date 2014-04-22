require.config({
    baseUrl: '../release/requirejs/'
});

function test(ns, fn) {
    function ok() {
        console.log("%cOK!", 'color:green;font-size:15px;');
    }

    function failed(value, ret) {
        errorCount++;
        console.log('%cFAILED! %cexpect \n%s %cbut got\n%c%s',
            'color:red;font-size:14px;',
            'color:black',
            JSON.stringify(value),
            'color:gray',
            'color:magenta',
            JSON.stringify(ret));
    }

    function check(condition, value, ret) {
        if (condition) {
            ok();
        } else {
            failed(value, ret);
        }
        return specs;
    }

    function isArray(arg) {
        return Object.prototype.toString.call(arg) == "[object Array]";
    }

    function arrayEqual(a, b) {
        var i = 0,
            len = a.length;
        if (len !== b.length) return false;
        for (; i < len; ++i) {
            if (a[i] == b[i]) continue;
            else return false;
        }
        return true;
    }

    function arrayStrictEqual(a, b) {
        var i = 0,
            len = a.length;
        if (len !== b.length) return false;
        for (; i < len; ++i) {
            if (a[i] === b[i]) continue;
            else return false;
        }
        return true;
    }

    var desc = null,
        errorCount = 0,
        specs = {
            ___: function(d) {
                console.log("%c%s", 'font-size:16px', d);
                return this;
            },
            anything: function(v, fn) {
                var ret = fn();
                return check(true, v, ret);
            },
            equal: function(v, fn) {
                var ret = fn();
                if (isArray(v)) {
                    return check(arrayEqual(ret, v), v, ret);
                } else {
                    return check(ret == v, v, ret);
                }
            },
            strictEqual: function(v, fn) {
                var ret = fn();
                if (isArray(v)) {
                    return check(arrayStrictEqual(ret, v), v, ret);
                } else {
                    return check(ret === v, v, ret);
                }
            },
            error: function(errorType, fn) {
                try {
                    fn();
                } catch (e) {
                    return check(e instanceof errorType, true, true);
                }
            },
            hasProperty: function(v, fn) {
                var ret = fn();
                return check(v in ret, v, ret);
            },
            gt: function(v, fn) {
                var ret = fn();
                return check(ret > v, v, ret);
            },
            egt: function(v, fn) {
                var ret = fn();
                return check(ret >= v, v, ret);
            },
            lt: function(v, fn) {
                var ret = fn();
                return check(ret < v, v, ret);
            },
            elt: function(v, fn) {
                var ret = fn();
                return check(ret <= v, v, ret);
            },
            done: function() {
                console.log("%cError:%d", 'color:blue;font-size:14px;', errorCount);
            }
        };
    specs.it = specs;
    specs.should = specs;
    specs.maybe = specs;

    require([ns.replace('$root.', '').replace('.', '/')], function(mod) {

    });
    require([
        'lang/string',
        'lang/array',
        'lang/object',
        'lang/fn',
        'lang/type',
        'lang/enumerable',
        'lang/arguments',
        'lang/number',
        'lang/date',
        'lang/range'
    ], function(string, array, object, f, type, enu, args, num, date,range) {
        var oldeRequrie = require,
            map = {
                '$root.lang.string': string,
                '$root.lang.array': array,
                '$root.lang.object': object,
                '$root.lang.fn': f,
                '$root.lang.type': type,
                '$root.lang.enumerable': enu,
                '$root.lang.arguments': args,
                '$root.lang.number': num,
                '$root.lang.date': date,
                '$root.lang.range':range
            };
        require = function(ns) {
            return map[ns];
        }
        console.log("%cUnit Test of: " + ns, 'color:white;font-size:16px;background-color:black;');
        fn(require, specs);
        require = oldeRequrie;
    })
}