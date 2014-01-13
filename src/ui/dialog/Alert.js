({
	description: 'Alert',
	namespace: $root.ui.dialog,
	imports: {
		_type: $root.lang.type,
		_str: $root.lang.string,
		_ui: $root.ui,
		$: jQuery
	},
	exports: [Alert],
	priority: 1
});

///vars

///helper


///impl
var Alert = _type.create('Alert', Dialog, {
	initialize: function(options) {
		this.super();
	}
});

/**
 * main function is called when DOMReady
 */
//function main(){}
//$(main);


///exports