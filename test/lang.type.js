test("$root.lang.type", function(require, specs) {
	var type = require('$root.lang.type'),
		c = type.typename,
		Class = type.Class;

	function UserDefinedType() {}

	var Person = Class('Person', Object, function (name){
		this.name = name;
	}).methods({
		greeting: function () {
			return 'Hello, I am ' + this.name;
		}
	})

	var Student = Class('Student', Person, function (name, grade) {
		this.name = name;
		this.grade = grade;
	});

	p = new Person('adam'), s = new Student('jack', 5);

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
			'Student'
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
		.___('type#Class')
		.it.should.equal([
				true, true, true, false,
				true, true, true, false,
				true, true,
				'Person', 'Student',
				true, 'Person',
				'adam','jack',5
			], function (){
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
				sclass.getParent() == pclass,
				sclass.getParent().typename(),
				p.name,
				s.name,
				s.grade
			];
		})
		.___('type#Class#methods')
		.it.should.equal(['Hello, I am adam','Hello, I am jack'],function(){
			return [p.greeting(), s.greeting()];
		})
		.done();
});