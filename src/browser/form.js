({
	description: 'Form',
	namespace: $root.browser.form,
	imports: {
		_type: $root.lang.type,
		_argument: $root.lang.argument,
		_str: $root.lang.string,
		_ary: $root.lang.array,
		$: jQuery
	},
	exports: [
		Validator,
		toJSON
	]
});

///vars
var varArg = _argument.varArg;

///helper


///impl
var Validator = _type.create('Validator', jQuery, {
	init: function(form, options) {
		this.options = options;
	},
	validate: function() {
		var elements = this[0].elements;
		//TODO:sort elements against data-validate-order
		_ary.forEach(elements, function(item){
			var control = $(item),
				pattern = control.data(options.validate)
		});
	}
}).statics({
	CreateOption: function() {
		return {

		};
	},
	defaultErrorPrompt: function(inputElement, errorMessage){
		alert(errorMessage);
	}
});


///exports