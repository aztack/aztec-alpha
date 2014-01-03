({
	description: 'The Aztec JavaScript framework',
	namespace: $root
});
(function(global) {

	var G = {},
		NAMESPAE_ROOT = 'aztec',
		requrieCache = {};

	({include:'$dependency'});

	function validateNS(namespace, extraMsg) {
		if (!namespace || namespace.match(/[^_$.a-zA-Z0-9]/)) {
			throw 'Invalid Namespace: "' + namespace + '" ' + extraMsg + '!';
		}
		return true;
	}

	function createNS(namespace, errormsg) {
		validateNS(namespace, errormsg);
		var i = 0,
			ns = G,
			parts = namespace.split('.'),
			len = parts.length,
			part = parts[0];

		for (; i < len; ++i) {
			part = parts[i];
			if (part == '$root') part = NAMESPAE_ROOT;
			if (typeof ns[part] == 'undefined') {
				ns = ns[part] = {};
			} else {
				ns = ns[part];
			}
		}
		return ns;
	}

	function require(namespace, fn) {
		var i = 0,
			cached,
			part,
			parts,
			len,
			ns = G;

		cached = requrieCache[namespace];
		if (cached) {
			return cached;
		}

		parts = namespace.split('.');
		len = parts.length;

		for (; i < len; ++i) {
			part = parts[i];
			if (part == '$root') part = NAMESPAE_ROOT;
			ns = ns[part];
			if (typeof ns == 'undefined') {
				throw namespace + ' is not defined!';
			}
		}
		requrieCache[namespace] = ns;
		return ns;
	}

	global.define = function(namespace, dependency, factory) {
		var exported = factory(require, createNS(namespace, 'in `define`')),
			parts = namespace.split('.'),
			name = parts.pop(),
			parent = require(parts.join('.'));
		parent[name] = exported;
	};

	createNS('aztec');
}(this));