/**
 * ---
 * description: Calendar
 * namespace: $root.ui.calendar
 * directory: ui/Calendar
 * imports:
 *   _type: $root.lang.type
 *   _str: $root.lang.string
 *   _arguments: $root.lang.arguments
 *   _date: $root.lang.date
 *   _tpl: $root.browser.template
 *   _table: $root.ui.table
 *   $: jquery
 * exports:
 * - Calendar
 * files:
 * - src/ui/Calendar/Calendar.js
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('ui/calendar', ['lang/type', 'lang/string', 'lang/arguments', 'lang/date', 'browser/template', 'ui/table', 'jquery'], factory);
    } else if (typeof module === 'object') {
        var $root_lang_type = require('lang/type'),
            $root_lang_string = require('lang/string'),
            $root_lang_arguments = require('lang/arguments'),
            $root_lang_date = require('lang/date'),
            $root_browser_template = require('browser/template'),
            $root_ui_table = require('ui/table'),
            jquery = require('jquery');
        module.exports = factory($root_lang_type, $root_lang_string, $root_lang_arguments, $root_lang_date, $root_browser_template, $root_ui_table, jquery, exports, module, require);
    } else {
        var exports = $root._createNS('$root.ui.calendar');
        factory($root.lang.type, $root.lang.string, $root.lang.arguments, $root.lang.date, $root.browser.template, $root.ui.table, jquery, exports);
    }
}(this, function(_type, _str, _arguments, _date, _tpl, _table, $, exports) {
    //'use strict';
    exports = exports || {};
    _tpl
        .set('$root.ui.Calendar.header',"<tr><th colspan=\"7\" style=\"text-align: center;\">\n<span class=\"ui-button ui-calendar-prev-month\" data-action=\"prev-month\"></span><span class=\"ui-calendar-title\" sigil=\".title\"></span><span class=\"ui-button ui-calendar-next-month\" data-action=\"next-month\"></span>\n</th></tr>\n")
        .set('$root.ui.Calendar.footer',"\n");
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
            self.$attr(s, info);
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
        
    ///sigils
    if (!Calendar.Sigils) Calendar.Sigils = {};
    Calendar.Sigils[".title"] = ".ui-calendar-title";

    exports['Calendar'] = Calendar;
    exports.__doc__ = "Calendar";
    exports.VERSION = '0.0.1';
    return exports;
}));
//end of $root.ui.calendar
