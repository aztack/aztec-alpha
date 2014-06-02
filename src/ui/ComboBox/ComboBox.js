({
	description: 'ComboBox',
	namespace: $root.ui.comboBox,
	directory: 'ui/ComboBox',
	imports: {
		_type: $root.lang.type,
		_fn: $root.lang.fn,
		_tpl: $root.browser.template,
		_arguments: $root.lang.arguments,
		_menu: $root.ui.menu,
		_textfield: $root.ui.textField,
		$: jquery,
		jqe: jQueryExt
	},
	exports: [
		ComboBox
	]
});
//Features


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
	showMenu: function(x, y) {
		var tf = this.textfield,
			w = this.textfield.width(),
			h = this.textfield.outerHeight(true);
		this.menu.show().css({
			left: x || '2px',
			top: h,
			width: Math.max(w, this.menu.width())
		});
		console.log(this.menu[0].style);
	},
	hideMenu: function() {
		this.menu.hide();
	}
}).options({
	items: []
}).statics({
	Template: {
		BoxTemplate: boxTemplate
	}
}).events(Menu.Events, TextField.Events);

function ComboBox_initialize(self) {
	var menu = self.menu,
		hideMenu = _fn.bindTimeout(self.hideMenu, self, 100),
		showMenu = _fn.bind(function(){
			self.showMenu();
		}, self);

	self.css('position','relative')
		.textfield
		.focus(showMenu)
		.blur(hideMenu);

	menu.on(Menu.Events.OnItemSelected, function(e, item, index) {
		var text = item.text();
		self.textfield.val(text);
	}).hide();

	self.append(self.textfield)
		.append(self.menu);
}