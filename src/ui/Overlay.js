({
	description: 'Overlay',
	namespace: $root.ui.Overlay,
	imports: {
		_type: $root.lang.type,
		_tpl: $root.browser.template,
		_arguments: $root.lang.arguments,
		$: jQuery
	},
	exports: [
		Overlay,
		create
	]
});

var varArg = _arguments.varArg,
	tpl = _tpl.id$('$root.ui.Overlay'),
	maskTemplate = tpl('mask');

var Overlay = _type.create('Overlay', jQuery, {
	init: function(options) {
		varArg(arguments, this)
			.when(function(){
				this.options = Overlay.CreateOptions();
			})
			.when('plainObject', function(opts) {
				this.options = opts;
			}).resolve();
		this.base(maskTemplate);
	}
}).statics({
	CreateOptions: function() {
		return {

		};
	}
});

Overlay.create = function(){
	return new Overlay();
};

function create() {
	var o = $(tpl('mask'));
	$(document.body).prepend(o);
	o.show();
	return o;
}