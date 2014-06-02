({
	description: 'Button',
	version: 0.1,
	namespace: $root.ui.button,
	directory: 'ui/Button',
	imports: {
		_type: $root.lang.type,
		_arguments: $root.lang.arguments,
		_number: $root.lang.number,
		_enum: $root.lang.enumerable,
		_str: $root.lang.string,
		_drag: $root.ui.draggable,
		$: jquery,
		jqe: jQueryExt
	},
	exports: [Button]
});

var varArg = _arguments.varArg,
	tpl = _tpl.id$('$root.ui.button');


var Button = _type.create('$root.ui.Button', jQuery, {
	init: function() {

	}
}).statics({
	Type: {
		Submit: 0,
		Normal: 1,
		Anchor: 2
	}
}).options({
	type: 1
});

function Button_initialize(self, opts) {

}