({
    description: 'Date Utils',
    version: '0.0.1',
    namespace: $root.lang.date,
    imports: {
        _type: $root.lang.type,
        _fn: $root.lang.fn,
        _arguments: $root.lang.arguments,
        _str: $root.lang.string
    },
    exports: [
        secondsOfMinute,
        secondsOfHour,
        secondsOfDay,
        namesOfMonths,
        namesOfWeekday,
        now,
        thisDay,
        thisMonth,
        thisYear,
        isLeapYear,
        daysOfMonth,
        format,
        calendar,
        DateTime
    ]
});

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
        today = new Date(d),
        i, j, day, days, lastDays, x, y, thisYear, thisMonth, lastYear, lastMonth, nextYear, nextMonth, flag = true;
    if (year) d.setYear(year);
    if (month) d.setMonth(month - 1);
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
                if (flag && x === today.getDate() && thisMonth === today.getMonth() + 1 && thisYear === today.getFullYear()) {
                    dayInfo.today = true;
                    flag = false;
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
            dayInfo.hours = 12;
            dayInfo.minutes = dayInfo.seconds = 0;
            table[i][j] = dayInfo;
        }
    }
    return table;
}

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

var DateTime = _type.create('$root.lang.DateTime', Object, {
    init: function() {
        var value;
        return varArg(arguments, this)
            .when('string', function() {

            })
            .when('date', function(d) {
                return [d];
            })
            .when(DateTime.constructorOf, function(dt) {
                return [dt.$get('value')];
            })
            .otherwise(function(args) {
                return [_fn.applyNew(Date, args)];
            }).invoke(function(value) {
                this.$attr('value', value);
            });
    },
    year: gsetter('getFullYear', 'setFullYear'),
    month: function(v) {
        var value = this.$get('value');
        if (_type.isEmpty(v)) {
            return value.getMonth();
        } else {
            value.setMonth(v - 1);
        }
        return this;
    },
    day: gsetter('getDate', 'setDate'),
    hours: gsetter('getHours', 'setHours'),
    minutes: gsetter('getMinutes', 'setMinutes'),
    seconds: gsetter('getSeconds', 'setSeconds'),
    milliseconds: gsetter('getMilliseconds', 'setMilliseconds'),
    toString: function() {
        var t = this.$get('value');
        return _str.format(DateTime.DefaultDateTimeFormat, {
            year: t.getFullYear(),
            month: t.getMonth() + 1,
            day: t.getDate(),
            hour: t.getHours(),
            minute: t.getMinutes(),
            second: t.getSeconds()
        })
    },
    format: function(fmt) {
        if (!fmt) return this.toString();
        //TODO
    },
    valueOf: function() {
        return this.$get('value').getTime();
    },
    set: function(v) {
        var value = this.$get('value');
        varArg(arguments, this)
            .when('int', function(v) {
                value.setTime(v);
            })
            .when('{*}', function(v) {
                isNaN(v.year) || value.setFullYear(v.year);
                isNaN(v.month) || value.setMonth(v.month - 1);
                isNaN(v.day) || value.setDate(v.day);
                isNaN(v.hours) || value.setHours(v.hours);
                isNaN(v.minutes) || value.setMinutes(v.minutes);
                isNaN(v.seconds) || value.setSeconds(v.seconds);
                isNaN(v.milliseconds) || value.setMilliseconds(v.milliseconds);
            }).resolve();
        return this;
    },
    toObject: function() {
        var value = this.$get('value');
        return {
            year: value.getFullYear(),
            month: value.getMonth() + 1,
            day: value.getDate(),
            hours: value.getHours(),
            minutes: value.getMinutes(),
            seconds: value.getSeconds(),
            milliseconds: value.getMilliseconds()
        };
    },
    dup: function() {
        return new DateTime(this.value);
    },
    equal: function(other) {
        return this.value.getTime() == other.value.getTime();
    }
}).methods({
    yesterday: function() {
        return this.set({
            day: this.day() - 1
        });
    },
    tomorrow: function() {
        return this.set({
            day: this.day() + 1
        });
    },
    nextMonth: function() {
        return this.set({
            month: this.month() + 1
        });
    },
    prevMonth: function() {
        return this.set({
            month: this.month() - 1
        });
    },
    noon: function() {
        return this.set({
            hours: 12,
            minutes: 0,
            seconds: 0
        });
    },
    midnight: function() {
        return this.set({
            hours: 24,
            minutes: 0,
            seconds: 0
        });
    },
    beginning: function() {
        return this.set({
            hours: 0,
            minutes: 0,
            seconds: 0
        });
    },
    ending: function() {
        return this.set({
            hours: 23,
            minutes: 59,
            seconds: 59
        });
    }
}).statics({
    Today: function() {
        return new DateTime().noon();
    },
    Parse: function(when) {
        return new DateTime(Date.parse(when));
    },
    StandardDateTimeFormat: "{year}/{month}/{day} {hour}:{minute}:{second}",
    DefaultDateTimeFormat: "{year}-{month}-{day} {hour}:{minute}:{second}"
});