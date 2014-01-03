({
	description: "Function",
	version: '0.0.1',
	namespace: $root.lang.fn,
	imports: {
		_type: $root.lang.type,
		_ary: $root.lang.array,
		_enum: $root.lang.enumerable
	},
	exports: [
		isFunction,
		Callbacks,
		binds,
		noop
	]
});


///exports

var isFunction = _type.isFunction;

/**
 * Callbacks
 */
function Callbacks() {
	var list = [],
		proto = {};

	/**
	 * Callback#add
	 */
	proto.add = function() {
		var i = 0,
			fn,
			len = arguments.length;
		for (; i < len; ++i) {
			fn = arguments[i];
			if (_type.isFunction(fn)) {
				list.push(fn);
			}
		}
		return this;
	};

	/**
	 * fire
	 * fire all registered functions with given args on context
	 * @param  {Any} context
	 * @param  {Array} args
	 * @return {Callbacks}
	 */
	proto.fire = function(context, args) {
		var i = 0,
			fn,
			len = list.length;
		for (; i < len; ++i) {
			fn = list[i];
			fn.apply(context, args);
		}
		return this;
	};

	/**
	 * remove
	 * remove given callback functions from list
	 * @return {Callbacks}
	 */
	proto.remove = function() {
		var i = 0,
			pos, fn,
			len = arguments.length;
		for (; i < len; ++i) {
			fn = arguments[i];
			if (!_type.isFunction(fn)) return;
			pos = list.indexOf(fn);
			if (pos >= 0) {
				list.splice(pos,1);
			}
		}
		return this;
	};
	return proto;
}

/**
 * bind
 * bind fn to context just like calling fn on context
 * @param  {Function} fn function to be bind to the context
 * @param  {Any}   context this value
 * @return {Function}
 */
function bind(fn, context) {
	if (!isFunction(fn)) {
		throw TypeError("first argument must be a function");
	}

	var len = arguments.length,
		args = _ary.toArray(arguments, len),
		ctx;

	if (len === 2) {
		ctx = context;
	}
	return function() {
		fn.call(ctx, args);
	};
}


/**
 * A do-nothing-function
 * @return {Undefined}
 */
function noop() {}

function forge0(old, replacement, ctx) {
	return function(){
		var ret = replacement.apply(null, arguments);
		return old.apply(ctx, ret);
	};
}

function forge$(old, replacement, ctx) {
	return function(){
		var ret = old.apply(ctx, arguments);
		return replacement.apply(ctx, arguments);
	};
}