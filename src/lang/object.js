({
	description: "Object utils",
	namespace: $root.lang.object,
	imports: {
		_type: $root.lang.type
	},
	exports: [
		mix,
		keys,
		values,
		map,
		inject
	]
});

///exports

function mix(target, source, map) {}

function keys(obj) {}

function values(obj) {}

function eachWithIndex(obj) {}

function inject(obj, fun) {

}