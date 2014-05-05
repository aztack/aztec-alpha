({
	description: 'Tree',
	namespace: $root.ui.tree,
	imports: {
		_type: $root.lang.type,
		_str: $root.lang.string,
		_fn: $root.lang.fn,
		_tpl: $root.browser.template,
		_arguments: $root.lang.argumetns,
		$: jQuery
	},
	exports: [
		Tree
	]
});

var tpl = _tpl.id$('$root.ui.Tree'),
	varArg = _arguments.varArg;

var Tree = _type.create('$root.ui.Tree', jQuery, {
	init: function() {

	}
}).events({
	OnNodeSelected:'NodeSelected(event,node).Tree'
});

function Tree_initialize(self, opts) {
	
}