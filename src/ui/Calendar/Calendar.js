({
    description: 'Calendar',
    namespace: $root.ui.calendar,
    directory: 'ui/Calendar',
    imports: {
        _type: $root.lang.type,
        _str: $root.lang.string,
        _array: $root.lang.array,
        _arguments: $root.lang.arguments,
        _date: $root.lang.date,
        _tpl: $root.browser.template,
        _table: $root.ui.table,
        _menu: $root.ui.menu,
        $: jquery
    },
    exports: [
        Calendar
    ]
});

var varArg = _arguments.varArg,
    tpl = _tpl.id$('$root.ui.Calendar'),
    Table = _table.Table,
    Menu = _menu.Menu;

var Calendar = _type.create('$root.ui.Calendar', Table, {
    init: function() {
        this.base();
        this.addClass('ui-calendar');
        this.$attr('menu', new Menu());
        Calendar_initialize(this);
    },
    set: function(year, month) {
        var dt = self.$get('datetime');
        dt.year(year).month(month);
        Calendar_set(this, dt);
    }
});

function Calendar_initialize(self) {
    var now = new _date.DateTime(),
        yearOrMonthMenu = self.menu,
        monthArray = _array.fromRange(1,12),
        yearArray = _array.fromRange(now.year() - 5, now.year() + 5);

    self.setHeader(_date.namesOfWeekday.chsShort.slice(0))
        .header.prepend(tpl('header'));

    yearOrMonthMenu.addClass('ui-calendar-menu ')
        .on(Menu.Events.OnItemSelected, onYearMenuItemSelected);

    self.header.delegate('.ui-button', 'click', function(e) {
        var btn = $(e.target),
            act = btn.data('action'),
            year = self.selected.year();
        if (act.match(/prev/)) {
            now.prevMonth();
            Calendar_set(self, now);
        } else if (act.match(/next/)) {
            now.nextMonth();
            Calendar_set(self, now);
        }

        if (year !== self.selected.year()) {
            yearArray = _array.fromRange(year - 5, year + 5);
        }
    }).delegate(self.sigil('.title', true), 'click', function(e) {
        var yearOrMonthEle = $(e.target),
            yearOrMonth = yearOrMonthEle.attr('class'),
            year, items;
        if (!yearOrMonth) return;
        year = self.selected.year();
        items = yearOrMonth == 'year' ? yearArray : monthArray;

        yearOrMonthMenu.removeClass('year month');
        yearOrMonthMenu
            .setItems(items)
            .showAt(yearOrMonthEle.offset())
            .addClass(yearOrMonth);
    });

    function onYearMenuItemSelected(e, item) {
        var dt = self.selected,
            y = dt.year(),
            m = dt.month();
        if (yearOrMonthMenu.hasClass('year')) {
            y = item.text();
        } else {
            m = item.text();
        }
        dt.year(y).month(m);
        Calendar_set(self, dt);
    }

    var s = 'selected';
    self.on(Calendar.Events.OnCellClicked, function(e, td, row, col, info) {
        var selected = self.$get(s);
        if (selected) {
            $(selected).removeClass(s);
        }
        self.$attr(s, info);
        $(td).addClass(s);
    });

    Calendar_set(self, now);
}

function Calendar_set(self, dt) {
    var t = _date.calendar(dt.year(), dt.month());
    self.options.td = function(data, j) {
        var cls = data.today ? ' class="today"' : '';
        return _str.format('<td data-j="{2}" {1}>{0}</td>', data.date, cls, j);
    };

    self.setData(t);
    self.$attr('selected', dt);
    Calendar_setTitle(self, dt);
}

function Calendar_setTitle(self, dt) {
    var title = _str.format('<a class="year">{year}</a>-<a class="month">{month,2,0}</a>', dt.toObject());
    self.sigil('.title').html(title);
}