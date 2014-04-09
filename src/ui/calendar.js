({
	description: 'Calendar',
	namespace: $root.ui.calendar,
	imports: {
		_type: $root.lang.type,
		_arguments: $root.lang.arguments,
		_tpl: $root.lang.template,
		_date: $root.lang.date,
		$: jQuery
	},
	exports: [
		Calendar
	]
});

var varArg = _arguments.varArg,
	tpl = _tpl.id$('$root.ui.Calendar');

var Calendar = _type.create('$root.ui.Calendar', jQuery, {

}).statics({

});