({
	description: 'The Aztec JavaScript framework',
	version: '0.0.1',
	namespace: $root,
	notransform: true,
	priority: 0
});
(function(global) {

	var G = {};

	function createNS(namespace) {
		var i = 0,
			ns = G,
			parts = namespace.split('.'),
			len = parts.length,
			part = parts[0];

		for (; i < len; ++i) {
			part = parts[i];
			if (part == '$root') {
				part = G;
				continue;
			}
			if (typeof ns[part] == 'undefined') {
				ns[part] = {};
			}
			ns = ns[part];
		}
		return ns;
	}

	function help() {
		var name, v;
		if (G.lang) {
			for (name in G.lang) {
				if (!G.lang.hasOwnProperty(name)) continue;
				console.log('%c$root.lang.' + name + ': ' + G.lang[name].__doc__, 'color:green');
				console.dir(G.lang[name]);
			}
		}
		if (G.ui) {
			for (name in G.ui) {
				if (!G.ui.hasOwnProperty(name)) continue;
				console.log('%c$root.ui.' + name + ': ' + G.ui[name].__doc__, 'color:green');
				console.dir(G.ui[name]);
			}
		}
	}

	if (Object.defineProperty) {
		Object.defineProperty(G, '_createNS', {
			enumerable: false,
			value: createNS
		});
		Object.defineProperty(G, '_help', {
			enumerable: false,
			value: help
		});
	} else {
		G._createNS = createNS;
		G._help = help;
	}

	var lang = [
		'lang/json',
		'lang/type',
		'lang/fn',
		'lang/number',
		'lang/arguments',
		'lang/range',
		'lang/string',
		'lang/date',
		'lang/array',
		'lang/object',
		'lang/enumerable',
		'lang/intrusive',
	];

	if (typeof define === 'function' && define.amd) {
		define('$root', lang, function(_json, _type, _fn, _number, _arguments, _range, _string, _date, _array, _object, _enumerable, _intrusive) {
			return {
				json: _json,
				type: _type,
				fn: _fn,
				number: _number,
				arguments: _arguments,
				range: _range,
				string: _string,
				date: _date,
				array: _array,
				object: _object,
				enumerable: _enumerable,
				intrusive: _intrusive
			};
		});
	} else if (typeof module == 'object') {
		exports.json = require('./lang/json.js');
		exports["type"] = require('./lang/type.js');
		exports.fn = require('./lang/fn.js');
		exports.number = require('./lang/number.js');
		exports["arguments"] = require('./lang/arguments.js');
		exports.range = require('./lang/range.js');
		exports.string = require('./lang/string.js');
		exports.date = require('./lang/date.js');
		exports.array = require('./lang/array.js');
		exports["object"] = require('./lang/object.js');
		exports.enumerable = require('./lang/enumerable.js');
		exports.intrusive = require('./lang/intrusive.js');
	} else {
		global.$root = G;
		for(var name in lang) {
			document.write('<script src="release/scripts/'+lang[name]+'.js"></script>')
		}
	}

}(this));