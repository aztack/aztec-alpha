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
        .done();
});