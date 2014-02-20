({
	description: 'ComboBox',
	namespace: $root.ui.ComboBox,
	imports: {
		_type: $root.lang.type,
		_tpl: $root.browser.template,
		_arguments: $root.lang.arguments,
		_menu: $root.ui.Menu,
		_textfield: $root.ui.TextField,
		$: jQuery
	},
	exports: [
		ComboBox
	]
});

///vars
var Menu = _menu.Menu,
	TextField = _textfield.TextField,
	varArg = _arguments.varArg,
	tpl = _tpl.id$('$root.ui.ComboBox'),
	boxTemplate = tpl('box');

///exports
var ComboBox = _type.create('ComboBox', jQuery, {
	init: function(){
		this.base(boxTemplate);
		this.textfield = new TextField();
		this.menu = new Menu();
		this.append(this.textField);
		this.append(this.menu);
	},
	showDropdown: function() {
		
	}
}).statics({
});