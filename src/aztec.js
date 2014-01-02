({
	description: 'The Aztec JavaScript framework',
	namespace: $root
});
(function(G) {

	var NAMESPAE_ROOT = 'aztec',
		requrieCache = {};

	function validateNS(namespace, extraMsg) {
		if (!namespace || namespace.match(/[^_$.a-zA-Z0-9]/)) {
			throw 'Invalid Namespace: "' + namespace + '" ' + extraMsg + '!';
		}
		return true;
	}

	function createNS(namespace) {
		validateNS(namespace, 'when create namespace in `createNS`');

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

	G.require = function(namespace) {
		var i = 0,
			cached,
			part,
			parts,
			len,
			ns = G;

		if (cached = requrieCache[namespace]) {
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
		return (requrieCache[namespace] = ns);
	}

	G.define = function(namespace, dependency, factory) {
		validateNS(namespace, 'in `define`');
		factory(require, createNS(namespace));
	}

	createNS('aztec');
}(this));