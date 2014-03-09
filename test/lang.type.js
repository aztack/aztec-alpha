test("$root.lang.type", function(require, specs) {
    var type = require('$root.lang.type'),
        c = type.typename,
        Class = type.Class;

    function UserDefinedType() {}

    var Person = Class('Person', Object),
        Student = Person.extend(),
        TopStudent = Student.extend();

    Person.statics({
        MALE: 'male',
        FEMALE: 'female'
    }).methods({
        initialize: function(name) {
            this.name = name;
        },
        greeting: function() {
            return 'Hello, I am ' + this.name;
        }
    });

    Student.methods({
        initialize: function(name, grade) {
            this.base(name);
            this.grade = grade;
        },
        greeting: function() {
            return this.base() + '!';
        }
    });

    TopStudent.methods({
        initialize: function(name, grade, rank) {
            this.base(name, grade);
            this.rank = rank;
        }
    });

    var p = new Person('adam'),
        s = new Student('jack', 5),
        t = new TopStudent('yumi', 6, 1);

    specs
        .___('type#typename')
        .it.should.equal([
            'Null',
            'Undefined',
            'Number',
            'Number',
            'String',
            'String',
            'Date',
            'RegExp',
            'UserDefinedType',
            'Person',
            'Person$'
        ], function() {
            return [
                c(null),
                c(undefined),
                c(1),
                c(Number(42)),
                c('hello'),
                c(new String('hello')),
                c(new Date()), c(/a/),
                c(new UserDefinedType()),
                c(p),
                c(s)];
        })
        .___('type#Class#statics')
        .it.should.equal(['male', 'female'], function() {
            return [Person.MALE, Person.FEMALE];
        })
        .___('type#Class')
        .it.should.equal([
            true, true, true, false,
            true, true, true, false,
            true, true,
            'Person', 'Person$',
            true, 'Person',
            'adam', 'jack', 'yumi', 5, 1
        ], function() {
            var pclass = p.getClass(),
                sclass = s.getClass();
            return [
                p instanceof Person,
                s instanceof Person,
                s instanceof Student,
                p instanceof Student,
                p.is(Person),
                s.is(Person),
                s.is(Student),
                p.is(Student),
                pclass === Person,
                sclass === Student,
                pclass.typename(),
                sclass.typename(),
                sclass.parent() == pclass,
                sclass.parent().typename(),
                p.name,
                s.name,
                t.name,
                s.grade,
                t.rank
            ];
        })
        .___('type#Class#methods')
        .it.should.equal(['Hello, I am adam', 'Hello, I am jack!'], function() {
            return [p.greeting(), s.greeting()];
        })
        .___('type#Class.toString')
        .it.should.equal('#<Class>', function() {
            return Class.toString();
        })
        .done();
});