({
	description: 'ComboBox',
	namespace: $root.ui.comboBox,
	imports: {
		_type: $root.lang.type,
		_fn: $root.lang.fn,
		_tpl: $root.browser.template,
		_arguments: $root.lang.arguments,
		_menu: $root.ui.menu,
		_textfield: $root.ui.textField,
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
var ComboBox = _type.create('$root.ui.ComboBox', jQuery, {
	init: function(opts) {
		this.base(ComboBox.Template.BoxTemplate);
		this.$attr('textfield', new TextField());
		this.$attr('menu', new Menu());
		ComboBox_initialize(this);
	},
	showMenu: function() {
		var tf = this.textfield,
			w = this.textfield.width(),
			l = tf.css('left');
		this.menu.show().css({
			left: l,
			width: w
		});

	},
	hideMenu: function() {
		this.menu.hide();
	}
}).statics({
	Template: {
		BoxTemplate: boxTemplate
	},
	Events: {}
});

function ComboBox_initialize(self) {
	var menu = self.menu,
		hideMenu = _fn.bindTimeout(self.hideMenu, self, 100),
		showMenu = _fn.bind(self.showMenu, self);

	self.textfield
		.focus(showMenu)
		.blur(hideMenu);

	menu.on(Menu.Events.OnItemSelected, function(e, item, index) {
		var text = item.text();
		self.textfield.val(text);
	});

	self.append(self.textfield);
	self.menu.hide();
	self.append(self.menu);
}