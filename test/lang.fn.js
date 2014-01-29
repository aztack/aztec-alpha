test('lang.fn', function(require, specs) {
    var _fn = require('$root.lang.fn');

    var obj = {
        c: 4,
        fn: {
            'do' :
            function() {
                console.log(obj);
            }
        }
    };

    function Person(name, age) {
        this.name = name;
        this.age = age;
    }

    Person.prototype.getName = function() {
        return this.name;
    };

    Person.prototype.getAge = function() {
        return this.age;
    };

    specs
        .___('fn#bind')
        .it.should.error(TypeError, function() {
            _fn.bind(null, null);
        })
        .it.should.error(TypeError, function() {
            _fn.bind(1, null);
        })
        .it.should.error(TypeError, function() {
            _fn.bind('string', null);
        })
        .it.should.equal([1, 2, 3, 4], function() {
            function f(a, b, c) {
                return [a, b, c, this.c]
            }

            var f1 = _fn.bind(f, obj, 1),
                f2 = _fn.bind(f1, null, 2),
                f3 = _fn.bind(f2, null, 3);

            return f3();
        })
        .___('fn#call')
        .it.should.equal(undefined, function() {
            return _fn.call(null, 1, 2, 3);
        })
        .it.should.equal([1, 2, 3, 4], function() {
            return _fn.call(function(a, b, c) {
                return [a, b, c, this.c]
            }, obj, 1, 2, 3);
        })
        .it.should.equal([1, 2, 3, 4], function() {
            return _fn.apply(function(a, b, c) {
                return [a, b, c, this.c];
            }, obj, [1, 2, 3]);
        })
        .___('fn#applyNew')
        .it.should.equal(['jack', 42], function() {
            var p = _fn.applyNew(Person, ['jack', 42]);
            return [p.getName(), p.getAge()];
        })
        .___('fn#callNew')
        .it.should.equal(['jack', 42], function() {
            var p = _fn.callNew(Person, 'jack', 42);
            return [p.getName(), p.getAge()];
        })
        .___('fn#bindApplyNew')
        .it.should.equal(['jack', 42], function() {
            var P = _fn.bindApplyNew(Person, ['jack', 42]),
                p = P();
            return [p.getName(), p.getAge()];
        })
        .___('fn#bindCallNew')
        .it.should.equal(['jack', 42], function() {
            var P = _fn.bindCallNew(Person, 'jack', 42),
                p = P();
            return [p.getName(), p.getAge()];
        })
        .___('fn#Callbacks')
        .it.maybe.anything(0, function() {
            var Callbacks = _fn.Callbacks,
                p = new Person('jack', 42);

            var cbs = Callbacks();
            cbs.add(function(a) {
                console.log(a, this.name);
                return false;
            }).add(function(a) {
                console.log(a + 1, this.age);
            });
            cbs.fire(p, [1]);
            
            console.log('---');
            p.name = 'jackson';
            p.age = 10;
            cbs.fireAll(p, [2]);
            
            console.log('---');
            var s = cbs.get(0).toString();
            eval('fff = ' + s)
            console.log(fff);
            
            console.log('---');
            cbs.remove(cbs.get(0));
        })
        .___('fn#stop')
        .it.maybe.anything(true, function() {
            _fn.stop('fn.do', obj).fn['do']();
        })
        .done();
});