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
//TODO
//- singleon

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

var theMask = null,
	showcount = 0,
	_oldHide, _oldShow;
/**
 * ##Mask.getInstance()##
 * @return {Mask}
 */
Mask.getInstance = function() {
	if (theMask === null) {
		theMask = new Mask();
		_oldHide = theMask.hide;
		_oldShow = theMask.show;
		theMask.hide = null;
		theMask.show = null;
		theMask.hide = function() {
			showcount -= 1;
			if (showcount < 0) showcount = 0;
			if (showcount === 0) _oldHide.apply(this, arguments);
			return this;
		};

		theMask.show = function() {
			showcount += 1;
			return _oldShow.apply(this, arguments);
		};
	}
	if (theMask.parent().length === 0) {
		theMask.appendTo('body');
	}
	return theMask;
};
Mask.disposeInstance = function() {
	if (theMask) {
		theMask.remove();
		theMask.$dispose();
	}
};