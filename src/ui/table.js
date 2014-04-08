({
	description: 'Table',
	namespace: $root.ui.table,
	imports: {
		_type: $root.lang.type,
		_str: $root.lang.string,
		$: jQuery
	},
	exports: [
		Table
	]
});

var Table = _type.create('$root.ui.Table', jQuery, {
	init: function() {}
}).statics({
	Events: {}
});