({
	description: 'Overlay',
	namespace: $root.ui.overlay,
	directory: 'ui/Overlay',
	imports: {
		_type: $root.lang.type,
		_tpl: $root.browser.template,
		_arguments: $root.lang.arguments,
		$: jquery,
		jqe: jQueryExt
	},
	exports: [
		Mask,
		create
	]
});
//Features
//[x] singleon

var varArg = _arguments.varArg,
	tpl = _tpl.id$('$root.ui.overlay'),
	maskTemplate = tpl('mask');

var Mask = _type.create('$root.ui.overlay.Mask', jQuery, {
	init: function() {
		this.base(maskTemplate);
	},
	setOpacity: function() {
		return varArg(arguments, this)
			.when('float', function(f) {
				return [f];
			})
			.when('string', function(s) {
				return [parseFloat(s)];
			})
			.when('*', function(s) {
				return [parseFloat(String(s))];
			})
			.invoke(function(opacity) {
				return this.css('opacity', opacity);
			});
	},
	getZIndex: function() {
		return this.css('z-index');
	}
});

var theMask = new Mask();
Mask.create = function() {
	theMask.appendTo('body');
	return theMask;
};