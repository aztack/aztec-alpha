/**
 * #Date Utils#
 * ==========
 * - Dependencies: `lang/type`,`lang/fn`,`lang/arguments`,`lang/string`
 * - Version: 0.0.1
 */

(function(global, factory) {
    if (typeof define === 'function' && define.amd) {
        define('lang/date', ['lang/type', 'lang/fn', 'lang/arguments', 'lang/string'], factory);
    } else if (typeof module == 'object') {
        var $root_lang_type = require('./type.js'),
            $root_lang_fn = require('./fn.js'),
            $root_lang_arguments = require('./arguments.js'),
            $root_lang_string = require('./string.js');
        module.exports = factory($root_lang_type, $root_lang_fn, $root_lang_arguments, $root_lang_string, exports, module, require);
    } else {
        var $root = global.$root,
            exports = $root._createNS('$root.lang.date');
        factory($root.lang.type, $root.lang.fn, $root.lang.arguments, $root.lang.string, exports);
    }
}(this, function(_type, _fn, _arguments, _str, exports) {
    'use strict';
    exports = exports || {};
    
    var varArg = _arguments.varArg;
    
    var secondsOfMinute = 60,
        secondsOfHour = 3600,
        secondsOfDay = 86400,
        namesOfMonths = {
            en: [null, 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'Augest', 'September', 'October', 'November', 'December'],
            enShort: [null, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            chs: [null, '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            chsShort: [null, '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
        },
        namesOfWeekday = {
            en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            enShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
            chs: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
            chsShort: ['日', '一', '二', '三', '四', '五', '六']
        },
        _daysOfMonth = {
            'false': [-1, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            'true': [-1, 31, 20, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        };
    
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
    
    // return true if given year is leap year
    function isLeapYear(year) {
        //http://stackoverflow.com/questions/8175521/javascript-to-find-leap-year
        return new Date(year, 1, 29).getMonth() == 1;
    }
    
    
    // return days in given month of year
    function daysOfMonth(year, month) {
        return _daysOfMonth[isLeapYear(year)][month];
    }
    
    function format(self, sep) {
        sep = sep || '-';
        return _str.format("{year}{sep}{month,2,0}{sep}{date,2,0}", {
            sep: sep,
            year: self.getFullYear(),
            month: self.getMonth() + 1,
            date: self.getDate()
        });
    }
    
    var _returnDay = function() {
            return this.date;
        },
        _format = function() {
            return this.year + '-' + this.month + '-' + this.date;
        };
    
    
    function calendar(year, month) {
        if (month < 1 || month > 12) {
            throw new Error('2nd paramter is month which must between 1 and 12');
        }
        var cacheKey = '' + year + '-' + month;
        if (calendar.cache[cacheKey]) return calendar.cache[cacheKey];
    
        var table = [
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null]
        ];
        var d = now(),
            today = new Date(d),
            i, j, day, days, lastDays, x, y, thisYear, thisMonth, lastYear, lastMonth, nextYear, nextMonth, flag = true;
        if (year) d.setYear(year);
        if (month) d.setMonth(month - 1);
        d.setDate(1);
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
                    valueOf: _returnDay,
                    format: _format
                };
                if (x <= days && (i > 0 || (i === 0 && j >= day))) {
                    if (flag && x === today.getDate() && thisMonth === today.getMonth() + 1 && thisYear === today.getFullYear()) {
                        dayInfo.today = true;
                        flag = false; //today set
                    }
                    dayInfo.date = x++;
                    dayInfo.year = thisYear;
                    dayInfo.month = thisMonth;
                } else if (i === 0 && j < day) {
                    dayInfo.date = lastDays - day + j + 1;
                    dayInfo.year = lastYear;
                    dayInfo.month = lastMonth;
                } else {
                    dayInfo.date = y++;
                    dayInfo.year = nextYear;
                    dayInfo.month = nextMonth;
                }
                table[i][j] = dayInfo;
            }
        }
        calendar.cache[cacheKey] = table;
        return table;
    }
    calendar.cache = {};
    
    function gsetter(g, s) {
        return function(v) {
            var value = this.$get('value');
            if (v == null) {
                return value[g]();
            } else {
                value[s](v);
            }
            return this;
        };
    }
    
    /**
     * DateTime
     * ========
     * Represents a date time, mutable
     * every change is made on the instance. Call dup to make a copy
     *
     * @param {String|Date|DateTime|Integer} when
     */
    var DateTime = _type.create('$root.lang.DateTime', Object, {
        init: function() {
            var value;
            varArg(arguments, this)
                .when('string', function(s) {
                    return [new Date(Date.parse(s))];
                })
                .when('date', function(d) {
                    return [new Date(d.getTime())];
                })
                .when(DateTime.constructorOf, function(dt) {
                    return [new Date(dt.$get('value').getTime())];
                })
                .otherwise(function(args) {
                    return [_fn.applyNew(Date, args)];
                }).invoke(function(value) {
                    this.$attr('value', value);
                });
        },
        /**
         * Getters and Setters
         * ===================
         * year,month,date,hours,minutes,seconds,millisencods
         */
        year: gsetter('getFullYear', 'setFullYear'),
        month: function(v) {
            var value = this.$get('value');
            if (_type.isEmpty(v)) {
                return value.getMonth() + 1;
            } else {
                value.setMonth(v - 1);
            }
            return this;
        },
        week: function() {
            var value = this.$get('value');
            return value.getDay();
        },
        date: gsetter('getDate', 'setDate'),
        hours: gsetter('getHours', 'setHours'),
        minutes: gsetter('getMinutes', 'setMinutes'),
        seconds: gsetter('getSeconds', 'setSeconds'),
        milliseconds: gsetter('getMilliseconds', 'setMilliseconds'),
        /**
         * toString
         * @param  {[type]} noTime
         * @return {[type]} a fomratted date time string
         *
         * ```javascript
         * var dt = new DateTime();
         * dt.toString() => '2014-06-15 17:36'
         * dt.toString(true) '2014-06-15'
         * ```
         */
        toString: function(noTime) {
            var t = this.$get('value'),
                fmt;
            if (!noTime) {
                fmt = DateTime.DefaultDateFormat;
            } else {
                if (typeof noTime == 'string') {
                    fmt = noTime;
                } else {
                    fmt = DateTime.DefaultDateTimeFormat;
                }
            }
            return _str.format(fmt, {
                year: t.getFullYear(),
                month: t.getMonth() + 1,
                date: t.getDate(),
                hour: t.getHours(),
                minute: t.getMinutes(),
                second: t.getSeconds()
            });
        },
        /**
         * valueOf
         * @return {Integer} return time of internal Date instance
         */
        valueOf: function() {
            return this.$get('value').getTime();
        },
        /**
         * set
         * @param {Integer|Object}
         *
         * ```javascript
         * datetime.set(new Date());
         * datetime.set({
         *     year: 2014,
         *     month: 6,
         *     date: 1
         * });
         * ```
         */
        set: function() {
            var value = this.$get('value');
            varArg(arguments, this)
                .when('int', function(v) {
                    value.setTime(v);
                })
                .when('{*}', function(v) {
                    isNaN(v.year) || value.setFullYear(v.year);
                    isNaN(v.month) || value.setMonth(v.month - 1);
                    isNaN(v.date) || value.setDate(v.date);
                    isNaN(v.hours) || value.setHours(v.hours);
                    isNaN(v.minutes) || value.setMinutes(v.minutes);
                    isNaN(v.seconds) || value.setSeconds(v.seconds);
                    isNaN(v.milliseconds) || value.setMilliseconds(v.milliseconds);
                }).resolve();
            return this;
        },
        /**
         * toObject
         * @param  {Boolean} detailed, only return year,month,date if false
         * @return {Object} {year,month,date,hours,minutes,seconds,milliseconds,day}
         */
        toObject: function(detailed) {
            var value = this.$get('value');
            return detailed ? {
                year: value.getFullYear(),
                month: value.getMonth() + 1,
                date: value.getDate(),
                hours: value.getHours(),
                minutes: value.getMinutes(),
                seconds: value.getSeconds(),
                milliseconds: value.getMilliseconds(),
                day: value.getDay()
            } : {
                year: value.getFullYear(),
                month: value.getMonth() + 1,
                date: value.getDate()
            };
        },
        /**
         * dup
         * duplication
         * @return {DateTime} return a copy of current instance
         */
        dup: function() {
            return new DateTime(this.value);
        },
        /**
         * equal
         * @param  {DateTime} other
         * @return {Boolean} return true if represents the same time with 'other'
         */
        equal: function(other) {
            return this.value.getTime() == other.value.getTime();
        }
    }).aliases({
        format: 'toString'
    }).methods({
        /**
         * firstDayOfMonth
         * @return {DateTime}
         */
        firstDayOfMonth: function() {
            return this.set({
                date: 1
            });
        },
        /**
         * lastDayOfMonth
         * @return {DateTime}
         */
        lastDayOfMonth: function() {
            return this.set({
                month: this.month() + 1,
                date: 0
            });
        },
        /**
         * today
         * @return {DateTime}
         */
        today: function() {
            var today = DateTime.Today();
            return this.set({
                year: today.year(),
                month: today.month(),
                date: today.date()
            });
        },
        /**
         * yesterday
         * @return {DateTime}
         */
        yesterday: function() {
            return this.set({
                date: this.date() - 1
            });
        },
        /**
         * tomorrow
         * @return {DateTime}
         */
        tomorrow: function() {
            return this.set({
                date: this.date() + 1
            });
        },
        /**
         * nextYear
         * @return {DateTime}
         */
        nextYear: function() {
            return this.set({
                year: this.year() - 1
            });
        },
        /**
         * prevYear
         * @return {DateTime}
         */
        prevYear: function() {
            return this.set({
                year: this.year() + 1
            });
        },
        /**
         * nextMonth
         * @return {DateTime}
         */
        nextMonth: function() {
            return this.set({
                month: this.month() + 1
            });
        },
        /**
         * prevMonth
         * @return {DateTime}
         */
        prevMonth: function() {
            return this.set({
                month: this.month() - 1
            });
        },
        /**
         * noon
         * @return {DateTime}
         */
        noon: function() {
            return this.set({
                hours: 12,
                minutes: 0,
                seconds: 0
            });
        },
        /**
         * midnight
         * @return {DateTime}
         */
        midnight: function() {
            return this.set({
                hours: 24,
                minutes: 0,
                seconds: 0
            });
        },
        /**
         * beginning
         * @return {DateTime}
         */
        beginning: function() {
            return this.set({
                hours: 0,
                minutes: 0,
                seconds: 0
            });
        },
        /**
         * ending
         * @return {DateTime}
         */
        ending: function() {
            return this.set({
                hours: 23,
                minutes: 59,
                seconds: 59
            });
        }
    }).aliases({
        next: 'tomorrow',
        prev: 'yesterday',
        sec: 'seconds',
        min: 'minutes'
    }).statics({
        /**
         * Today
         * @returns {DateTime} return a DateTime instance represents today's noon
         */
        Today: function() {
            return new DateTime().noon();
        },
        /**
         * Parse
         * @param {DateTime} when
         * @returns {DateTime} return a DateTime instance represent by when which
         * has the pattern "year/month/date hours:minutes:seconds"
         */
        Parse: function(when) {
            return new DateTime(Date.parse(when));
        },
        //#DateTime format used by DateTime\#toString()#
        StandardDateTimeFormat: "{year}/{month,2,0}/{date,2,0} {hour,2,0}:{minute,2,0}:{second,2,0}",
        DefaultDateTimeFormat: "{year}-{month,2,0}-{date,2,0} {hour,2,0}:{minute,2,0}:{second,2,0}",
        StandardDateFormat: "{year}/{month,2,0}/{date,2,0}",
        DefaultDateFormat: "{year}-{month,2,0}-{date,2,0}",
        DefaultTimeFormat: "{hour,2,0}:{minute,2,0}:{second,2,0}"
    });
    
    /**
     * TimeSpan
     * ========
     * Represents a period of time
     */
    var TimeSpan = _type.create('$root.lang.TimeSpan', Object, {
        init: function(millis) {
            this.value = Math.abs(millis || 0);
            var obj = this.toObject();
            this.$attr('value', obj);
        },
        val: function(v) {
            if (v == null) {
                return this.value;
            } else {
                this.value = v;
                this.$attr('value', this.toObject());
            }
            return this;
        },
        year: function() {
            return this.value.year;
        },
        day: function() {
            return this.value.day;
        },
        hour: function() {
            return this.value.hour;
        },
        minute: function() {
            return this.value.minute;
        },
        second: function() {
            return this.value.second;
        },
        toString: function(fmt) {
            var obj = this.$attr('value');
            return _str.format(fmt || '{year}Y {day}D {hour,2,0}:{minute,2,0}:{second,2,0}', obj);
        },
        valueOf: function(){
            return this.$get('value');
        },
        toObject: function() {
            var obj = TimeSpan.ToObject(this.value);
            this.$attr('value', obj);
            return obj;
        },
        equal: function(rhs){
            return  this.val() === rhs.val();
        }
    }).statics({
        MINUTE: 60,
        HOUR: 3600,
        DAY: 86400,
        YEAR: 315360000,
        ToObject: function(v) {
            var ret = {};
            if (v >= TimeSpan.YEAR) {
                ret.year = ~~ (v / TimeSpan.YEAR);
                v -= TimeSpan.YEAR * ret.year;
            } else {
                ret.year = 0;
            }
            if (v >= TimeSpan.DAY) {
                ret.day = ~~ (v / TimeSpan.DAY);
                v -= TimeSpan.DAY * ret.day;
            } else {
                ret.day = 0;
            }
            if (v >= TimeSpan.HOUR) {
                ret.hour = ~~ (v / TimeSpan.HOUR);
                v -= TimeSpan.HOUR * ret.hour;
            } else {
                ret.hour = 0;
            }
            if (v >= TimeSpan.MINUTE) {
                ret.minute = ~~ (v / TimeSpan.MINUTE);
                v -= TimeSpan.MINUTE * ret.minute;
            } else {
                ret.minute = 0;
            }
            ret.second = v;
            return ret;
        }
    });
    
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
    exports['DateTime'] = DateTime;
    exports['TimeSpan'] = TimeSpan;
    exports.__doc__ = "Date Utils";
    exports.VERSION = '0.0.1';
    return exports;
}));
//end of $root.lang.date
