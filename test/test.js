function test(ns, fn) {

	console.log("Unit Test of: " + ns);

	function ok(desc) {
		console.log("%s %cOK!", desc, 'color:green');
	}

	function failed(desc, value, ret) {
		errorCount++;
		console.log('%s %cFAILED! %cexpect %s but got %s',
			this._desc,
			'color:red',
			'color:black',
			JSON.stringify(value),
			JSON.stringify(ret));
	}

	function check(condition, value, ret) {
		if (condition) {
			ok(desc);
		} else {
			failed(desc, value, ret);
		}
		console.log('>',value);
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
				desc = d;
				return this;
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
				console.log("%cError:%d", 'color:blue', errorCount)
			}
		};
	specs.it = specs;
	specs.should = specs;

	define('$root.test.' + ns, [], function() {
		fn(require, specs);
	});
}