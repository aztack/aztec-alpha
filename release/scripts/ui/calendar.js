/**
 * #Calendar#
 * ========
 * - Dependencies: `lang/type`,`lang/string`,`lang/array`,`lang/arguments`,`lang/date`,`browser/template`,`ui/table`,`ui/menu`,`ui/layout`,`jquery`
 * - Version: 0.0.1
 */

(function(global, factory) {
    if (typeof define === 'function' && define.amd) {
        define('ui/calendar', ['lang/type', 'lang/string', 'lang/array', 'lang/arguments', 'lang/date', 'browser/template', 'ui/table', 'ui/menu', 'ui/layout', 'jquery'], factory);
    } else {
        var $root = global.$root,
            exports = $root._createNS('$root.ui.calendar');
        factory($root.lang.type, $root.lang.string, $root.lang.array, $root.lang.arguments, $root.lang.date, $root.browser.template, $root.ui.table, $root.ui.menu, $root.ui.layout, jQuery, exports);
    }
}(this, function(_type, _str, _array, _arguments, _date, _tpl, _table, _menu, _layout, $, exports) {
    'use strict';
    exports = exports || {};
    _tpl
        .set('$root.ui.Calendar.header',"<tr><th colspan=\"7\" style=\"text-align: center;\">\n<span class=\"ui-button ui-calendar-prev-month\" data-action=\"prev-month\"></span><span class=\"ui-calendar-title\" sigil=\".title\"></span><span class=\"ui-button ui-calendar-next-month\" data-action=\"next-month\"></span>\n</th></tr>\n")
        .set('$root.ui.Calendar.footer',"<tr><td colspan=\"{0}\"><div class=\"text\">&#20170;&#22825;:{1}</div></td></tr>\n")
        .set('$root.ui.Calendar.titlebar',"<span class=\"ui-calendar-title\" sigil=\".title\"><a class=\"select year\">{year}</a><a class=\"select month\">{month,2,0}</a></span>\n");
    var varArg = _arguments.varArg,
        tpl = _tpl.id$('$root.ui.Calendar'),
        Table = _table.Table,
        Menu = _menu.Menu,
        DateTime = _date.DateTime;
    
    var Calendar = _type.create('$root.ui.Calendar', Table, {
        init: function(opts) {
            var options = Calendar.options(opts);
            options.footer = true;
            options.simple = true;
            this.base(options);
            this.$attr('options', options);
            this.addClass('ui-calendar');
            this.$attr('menu', new Menu());
            Calendar_initialize(this);
        },
        /**
         * #Calendar\#set(year,month)#
         * @param {Integer} year
         * @param {Integer} month
         */
        set: function(year, month) {
            this.selected.year(year).month(month);
            Calendar_update(this);
            return this;
        },
        today: function(){
            var d = new Date(),
                y = d.getFullYear(),
                m = d.getMonth() + 1,
                date = d.getDate();
            this.trigger(Calendar.Events.OnDateChanged,['date', date]);
            return this.set(y, m);
        },
        toString: function(fmt){
            return this.selected.format(fmt);
        }
    }).options({
        yearSelectorRadius: 5
    }).events({
        OnDateChanged:'DateChanged(event,whichChanged).Calendar',
    });
    
    function Calendar_initialize(self) {
        var now = new DateTime(),
            opts = self.options,
            yearOrMonthMenu = self.menu,
            monthArray = _array.fromRange(1, 12),
            radius = opts.yearSelectorRadius,
            yearArray = _array.fromRange(now.year() - radius, now.year() + radius);
    
        self.$attr('selected', now);
        self.setHeader(_date.namesOfWeekday.chsShort.slice(0))
            .header.prepend(tpl('header'));
    
        yearOrMonthMenu.addClass('ui-calendar-menu ')
            .on(Menu.Events.OnItemSelected, onYearMenuItemSelected);
    
        self.header.delegate('.ui-button', 'click', function(e) {
            var btn = $(e.target),
                act = btn.data('action'),
                year = self.selected.year(),
                radius = opts.yearSelectorRadius;
            if (act.match(/prev/)) {
                now.prevMonth();
                Calendar_update(self);
            } else if (act.match(/next/)) {
                now.nextMonth();
                Calendar_update(self);
            }
    
            if (year !== self.selected.year()) {
                yearArray = _array.fromRange(year - radius, year + radius);
            }
        }).delegate(self.sigil('.title', true), 'click', function(e) {
            var yearOrMonthEle = $(e.target),
                yearOrMonth,
                items, selectedIndex;
            if (yearOrMonthEle.hasClass('year')) {
                yearOrMonth = 'year';
                selectedIndex = Math.floor(yearArray.length / 2);
            } else if (yearOrMonthEle.hasClass('month')) {
                yearOrMonth = 'month';
                selectedIndex = self.selected.month() - 1;
            } else {
                return;
            }
            items = yearOrMonth == 'year' ? yearArray : monthArray;
    
            yearOrMonthMenu.removeClass('year month');
            yearOrMonthMenu
                .setItems(items)
                .showAt(yearOrMonthEle.offset())
                .addClass(yearOrMonth);
            _layout.below(yearOrMonthMenu, yearOrMonthEle);
            yearOrMonthMenu.getItemAt(selectedIndex).addClass('selected');
        });
    
        self.footer.delegate('.text', 'click', function(){
            self.today();
        });
    
        function onYearMenuItemSelected(e, item) {
            var dt = self.selected,
                t = parseInt(item.text()),
                evt = Calendar.Events.OnDateChanged,
                which;
            if (yearOrMonthMenu.hasClass('year')) {
                if (t != dt.year()) {
                    yearArray = _array.fromRange(t - 5, t + 5);
                }
                dt.year(t);
                which = 'year';
            } else {
                dt.month(t);
                which = 'month';
            }
            self.trigger(evt, [which, t]);
            Calendar_update(self);
        }
    
        var s = 'selected';
        self.on(Calendar.Events.OnCellClicked, function(e, td, row, col, info) {
            td = $(td);
            if(td.hasClass('disabled')) return;
            self.selected.year(info.year).date(info.date);
            self.find('.selected').removeClass(s);
            td.addClass(s);
            self.trigger(Calendar.Events.OnDateChanged, ['date', info.date]);
        });
    
        Calendar_update(self);
        Calendar_setFooter(self);
    }
    
    function Calendar_update(self) {
        var dt = self.selected,
            t = _date.calendar(dt.year(), dt.month());
        self.options.td = function(data, j) {
            var cls = data.today ? ' class="today"' : '';
            return _str.format('<td data-j="{2}" {1}>{0}</td>', data.date, cls, j);
        };
    
        self.setData(t);
        Calendar_setTitle(self, dt);
    }
    
    function Calendar_setTitle(self) {
        var titlebarTemplate = tpl('titlebar'),
            title = _str.format(titlebarTemplate, self.selected.toObject());
        self.sigil('.title').html(title);
    }
    
    function Calendar_setFooter(self) {
        var opts = self.options,
            now = new DateTime(),
            coln = self.body.find('tr:first').children().length,
            html = _str.format(tpl('footer'), coln, now.format());
        self.setFooter(html);
    }
        
    ///sigils
    if (!Calendar.Sigils) Calendar.Sigils = {};
    Calendar.Sigils[".title"] = ".ui-calendar-title";

    exports['Calendar'] = Calendar;
    exports.__doc__ = "Calendar";
    exports.VERSION = '0.0.1';
    return exports;
}));
//end of $root.ui.calendar
