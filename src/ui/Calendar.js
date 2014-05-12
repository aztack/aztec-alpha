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
		var dt = self.$get('datetime');
		dt.year(year).month(month);
		Calendar_set(this, dt);
	}
});

function Calendar_initialize(self) {
	var now = new _date.DateTime();
	self.setHeader(_date.namesOfWeekday.chs.slice(0))
		.header.prepend(tpl('header'));

	self.header.delegate('.ui-button', 'click', function(e) {
		var btn = $(e.target),
			act = btn.data('action');
		if (act.match(/prev/)) {
			now.prevMonth();
			Calendar_set(self, now);
		} else if (act.match(/next/)) {
			now.nextMonth();
			Calendar_set(self, now);
		}
	});

	var s = 'selected';
	self.on(Calendar.Events.OnCellClicked, function(e, td, row, col, info) {
		var selected = self.$get(s);
		if (selected) {
			$(selected).removeClass(s);
		}
		self.$attr(s, td);
		$(td).addClass(s);
	});

	Calendar_set(self, now);
}

function Calendar_set(self, dt) {
	var t = _date.calendar(dt.year(), dt.month());
	self.options.td = function(data, j) {
		var cls = data.today ? ' class="today"' : '';
		return _str.format('<td data-j="{2}" {1}>{0}</td>', [data.date, cls, j]);
	};

	self.setData(t);
	self.$set('selected', self.find('.selected')[0]);
	Calendar_setTitle(self, dt);
}

function Calendar_setTitle(self, dt) {
	self.sigil('.title').text(_str.format("{year}-{month,2,0}", dt.toObject()));
}