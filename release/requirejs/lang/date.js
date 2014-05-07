/**
 * ---
 * description: Date Utils
 * version: 0.0.1
 * namespace: $root.lang.date
 * imports:
 *   _type: $root.lang.type
 *   _arguments: $root.lang.arguments
 *   _str: $root.lang.string
 * exports:
 * - secondsOfMinute
 * - secondsOfHour
 * - secondsOfDay
 * - namesOfMonths
 * - namesOfWeekday
 * - now
 * - thisDay
 * - thisMonth
 * - thisYear
 * - isLeapYear
 * - daysOfMonth
 * - format
 * - calendar
 * files:
 * - src/lang/date.js
 */

;define('lang/date',[
    'lang/type',
    'lang/arguments',
    'lang/string'
], function (_type,_arguments,_str){
    //'use strict';
    var exports = {};
    
        var varArg = _arguments.varArg;
    
    //vars
    var secondsOfMinute = 60,
        secondsOfHour = 3600,
        secondsOfDay = 86400,
        namesOfMonths = {
            en: [null, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'Augest', 'September', 'October', 'November', 'December'],
            chs: [null, '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
        },
        namesOfWeekday = {
            en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            chs: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', ]
        },
        _daysOfMonth = {
            'false': [-1, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            'true': [-1, 31, 20, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        };
    
    
    //helper
    
    
    //impl
    function now() {
        return new Date();
    }
    
    function thisDay() {
        return new Date().getDay();
    }
    
    function thisMonth() {
        return new Date().getMonth() + 1;
    }
    
    function thisYear() {
        return new Date().getYear() + 1900;
    }
    
    function isLeapYear(y) {
        //http://stackoverflow.com/questions/8175521/javascript-to-find-leap-year
        return new Date(y, 1, 29).getMonth() == 1;
    }
    
    function daysOfMonth(y, m) {
        return _daysOfMonth[isLeapYear(y)][m];
    }
    
    function format(self, sep) {
        sep = sep || '-';
        return _str.format("{year}{sep}{month}{sep}{day}", {
            sep: sep,
            year: self.getFullYear(),
            month: self.getMonth() + 1,
            day: self.getDate()
        });
    }
    
    var calendarTable = [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null]
    ];
    
    function _returnDay() {
        return this.day;
    }
    
    function calendar(year, month, date) {
        if (month < 1 || month > 12) {
            throw new Error('2nd paramter is month which must between 1 and 12');
        }
        var table = calendarTable.slice(0),
            d = now(),
            today = new Date(d).getDate(),
            i, j, day, days, lastDays, x, y, thisYear, thisMonth, lastYear, lastMonth, nextYear, nextMonth;
        if(year)d.setYear(year);
        if(month)d.setMonth(month - 1);
        d.setDate(date || 1);
        day = d.getDay();
        thisYear = d.getFullYear();
        thisMonth = d.getMonth() + 1;
        days = daysOfMonth(d.getFullYear(), d.getMonth() + 1);
        if (thisMonth > 1 && thisMonth < 12) {
            nextYear = lastYear = thisYear;
            lastMonth = thisMonth - 1;
            nextMonth = thisMonth + 1;
        } else if (thisMonth === 1) {
            lastYear = thisYear - 1;
            nextYear = thisYear;
            lastMonth = 12;
            nextMonth = 2;
        } else if (thisMonth === 12) {
            nextYear = thisYear + 1;
            lastYear = thisYear;
            lastMonth = 11;
            nextMonth = 1;
        }
        lastDays = daysOfMonth(lastYear, lastMonth);
        x = 1;
        y = 1;
    
        for (i = 0; i < 6; ++i) {
            for (j = 0; j < 7; ++j) {
                var dayInfo = {
                    toString: _returnDay,
                    valueOf: _returnDay
                };
                if (x <= days && (i > 0 || (i === 0 && j >= day))) {
                    if(x === today) {
                        dayInfo.today = true;
                    }
                    dayInfo.day = x++;
                    dayInfo.year = thisYear;
                    dayInfo.month = thisMonth;
                } else if (i === 0 && j < day) {
                    dayInfo.day = lastDays - day + j + 1;
                    dayInfo.year = lastYear;
                    dayInfo.month = lastMonth;
                } else {
                    dayInfo.day = y++;
                    dayInfo.year = nextYear;
                    dayInfo.month = nextMonth;
                }
                table[i][j] = dayInfo;
            }
        }
        return table;
    }
    
    exports['secondsOfMinute'] = secondsOfMinute;
    exports['secondsOfHour'] = secondsOfHour;
    exports['secondsOfDay'] = secondsOfDay;
    exports['namesOfMonths'] = namesOfMonths;
    exports['namesOfWeekday'] = namesOfWeekday;
    exports['now'] = now;
    exports['thisDay'] = thisDay;
    exports['thisMonth'] = thisMonth;
    exports['thisYear'] = thisYear;
    exports['isLeapYear'] = isLeapYear;
    exports['daysOfMonth'] = daysOfMonth;
    exports['format'] = format;
    exports['calendar'] = calendar;
    exports.__doc__ = "Date Utils";
    return exports;
});
//end of $root.lang.date
