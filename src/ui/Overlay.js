({
	description: 'Overlay',
	namespace: $root.ui.overlay,
	imports: {
		_type: $root.lang.type,
		_tpl: $root.browser.template,
		_arguments: $root.lang.arguments,
		$: jQuery
	},
	returns: Overlay
});

var varArg = _arguments.varArg,
	tpl = _tpl.id$('$root.ui.Overlay'),
	maskTemplate = tpl('mask');

var Overlay = _type.create('$root.ui.Overlay', jQuery, {
	init: function(options) {
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
	}
}).statics({
	CreateOptions: function() {
		return {

		};
	}
});

Overlay.create = function() {
	return new Overlay();
};

function create() {
	var o = $(tpl('mask'));
	$(document.body).prepend(o);
	o.show();
	return o;
}