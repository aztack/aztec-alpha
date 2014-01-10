({
	description: 'Alert',
	namespace: $root.ui.dialog,
	imports: {
		_type: $root.lang.type,
		_str: $root.lang.string,
		UIControl: $root.ui.UIControl,
		$: jQuery
	},
	exports: [Alert]
});

///vars

///helper


///impl
var Alert = _type.create('Alert', UIControl, {
	initialize: function(options) {
		this.super();
	}
})

/**
 * main function is called when DOMReady
 */
//function main(){}
//$(main);


///exports