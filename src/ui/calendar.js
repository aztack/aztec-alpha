({
	description: 'Calendar',
	namespace: $root.ui.calendar,
	imports: {
		_type: $root.lang.type,
		_str: $root.lang.string,
		_arguments: $root.lang.arguments,
		_date: $root.lang.date,
		_tpl: $root.browser.template,
		_table: $root.ui.table,
		$: jQuery
	},
	exports: [
		Calendar
	]
});

var varArg = _arguments.varArg,
	tpl = _tpl.id$('$root.ui.Calendar'),
	Table = _table.Table;

var Calendar = _type.create('$root.ui.Calendar', Table, {
	init: function() {
		this.base();
		this.addClass('ui-calendar');
		Calendar_initialize(this);
	},
	set: function(year, month) {
		Calendar_setYearMonth(this, year, month);
	}
});

function Calendar_initialize(self) {
	var now = _date.now(),
		year = now.getFullYear(),
		month = now.getMonth() + 1;
	Calendar_setYearMonth(self, year, month);
	self.header.delegate('.button', 'click', function(e) {
		var btn = $(e.target),
			act = btn.data('action');
		if (act == 'prev') {
			Calendar_setYearMonth(self, self.year, self.month - 1);
		} else {
			Calendar_setYearMonth(self, self.year, self.month + 1);
		}
	});
}

function Calendar_setTitle(self, info) {
	self.sigil('.title').text(_str.format("{year}-{month}", info));
}

function Calendar_setYearMonth(self, year, month) {
	self.year = year;
	self.month = month;
	t = _date.calendar(year, month);
	self.setHeader(_date.namesOfWeekday.chs.slice(0));
	self.options.td = function(data) {
		var cls = data.today ? ' class="today"' : '';
		return _str.format('<td{1}>{0}</td>', [data.day, cls]);
	};

	var headerTpl = tpl('header');
	self.header.prepend(headerTpl);

	var s = 'selected';
	self.on(Calendar.Events.OnCellClicked, function(e, td, row, col, info) {
		var selected = self.$get(s);
		if (selected) {
			$(selected).removeClass(s);
		}
		self.$attr(s, td);
		$(td).addClass(s);
	});
	self.setData(t);
	self.$set(s, self.find('.selected')[0]);
	Calendar_setTitle(self, {
		year: year,
		month: month
	});
}