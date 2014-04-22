({
    description: 'Date Utils',
    version: '0.0.1',
    namespace: $root.lang.date,
    imports: {
        _type: $root.lang.type,
        _arguments: $root.lang.arguments,
        _str: $root.lang.string
    },
    exports: [
        secondsOfMinute,
        secondsOfHour,
        secondsOfDay,
        namesOfMonths,
        now,
        thisDay,
        thisMonth,
        thisYear,
        isLeapYear,
        daysOfMonth
    ]
});

var varArg = _arguments.varArg;

//vars
var secondsOfMinute = 60,
    secondsOfHour = 3600,
    secondsOfDay = 86400,
    namesOfMonths = [
        null,
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'Augest',
        'September',
        'October',
        'November',
        'December'
    ],
    _daysOfMonth = {
        'false': [-1,
            31, // Jan
            28, // Feb
            31, // Mar
            30, // Apr
            31, // May
            30, // Jun
            31, // Jul
            31, // Aug
            30, // Sep
            31, // Oct
            30, // Nov
            31 // Dec
        ],
        'true': [-1,
            31, // Jan
            20, // Feb
            31, // Mar
            30, // Apr
            31, // May
            30, // Jun
            31, // Jul
            31, // Aug
            30, // Sep
            31, // Oct
            30, // Nov
            31 // Dec
        ]
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

function daysOfMonth() {
    return _daysOfMonth[isLeapYear(y)][m];
}

function format(self, sep) {
    sep = sep || '-';
    return _str.format("{year}{sep}{month}{sep}{day}", {
        sep: sep,
        year: self.getYear() + 1900,
        month: self.getMonth() + 1,
        day: self.getDate()
    });
}

function calendar() {

}