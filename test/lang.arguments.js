test("$root.lang.arguments", function(require, specs) {
    var _arg = require('$root.lang.arguments');

    var ArgumentsInstance = function() {
        return arguments;
    }(1, 2),
        array = _arg.toArray(ArgumentsInstance);

    function Person(name, age) {
        this.name = name;
        this.age = age;
    }
    Person.prototype.valueOf = function() {
        return [this.name, this.age];
    };

    var intAry = [1, 2, 3],
        mixAry = [1, 2, 'str'];

    specs
        .___("arguments#toArray")
        .it.should.equal([
            1, 2
        ], function() {
            return array;
        })
        .it.should.equal(true, function() {
            return Object.prototype.toString.call(array) == '[object Array]';
        })
        .___('arguments#varArg.call')
        .it.should.equal([1, 2], function() {
            function f(a, b) {
                return [a + 1, b + 1];
            }
            var ret = _arg.varArg([0, 1])
                .when('*', function() {
                    //should not reach here
                    return [];
                })
                .when('*', '*', function(x, y) {
                    return [x, y];
                }).invoke(f);
            return ret;
        })
        .___('arguments#varArg.callNew')
        .it.should.equal(['jack', 42], function() {
            return _arg.varArg(['jack', 42])
                .when('string', 'number', function(x, y) {
                    return [x, y];
                }).invokeNew(Person).valueOf();
        })
        .___('arguments#varArg.bindNew')
        .it.should.equal(['jack!', 43], function() {
            var jack = _arg.varArg(['jack', 42])
                .when('*', '*', function(a, b) {
                    return [a + '!', b + 1];
                })
                .when('string', 'number', function(x, y) {
                    return [x, y];
                }).bindNew(Person);

            return jack().valueOf();
        })
        .___('arguments#varArg.array<?>')
        .it.should.equal([true, false, true], function() {
            var a = _arg.varArg([intAry])
                .when('array<int>', function(a) {
                    return true;
                })
                .args();

            var b = _arg.varArg([mixAry])
                .when('array<int>', function() {
                    return true;
                }).invoke(function(r) {
                    return !!r;
                });

            var c = _arg.varArg([mixAry])
                .when('array<*>', function() {
                    return true;
                }).args();
            return [a[0], b, c[0]];
        })
        .___('arguments#varArg.color')
        .it.should.equal([true], function() {
            var a = _arg.varArg(['red', '#ff0000', '#0ff'])
                .when('color', 'color', 'color', function() {
                    return true;
                })
                .args();
            return [a[0]];
        })
        .done();
});