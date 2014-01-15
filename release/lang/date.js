/**
 * ---
 * description: Date Utils
 * version: 0.0.1
 * namespace: $root.lang.date
 * imports:
 *   _type: $root.lang.type
 *   _str: $root.lang.string
 * exports:
 * - secondsOfMinute
 * - secondsOfHour
 * - secondsOfDay
 * - namesOfMonths
 * - now
 * - thisDay
 * - thisMonth
 * - thisYear
 * - isLeapYear
 * - daysOfMonth
 * files:
 * - /lang/date.js
 */

;define('$root.lang.date',['$root.lang.type','$root.lang.string'],function(require, exports){
    //'use strict';
    var _type = require('$root.lang.type'),
        _str = require('$root.lang.string');
    
        //vars
    var secondsOfMinute  = 60,
        secondsOfHour    = 3600,
        secondsOfDay     = 86400,
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
        _daysOfMonth = [
            -1,
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
        ];
    
    
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
    
    function daysOfMonth(m) {
        if (m < 1 || m > 12) {
            throw "Month must between 1 and 12";
        }
        var days = _daysOfMonth[m];
        if (m == 2 && isLeapYear(thisYear())) {
            return days + 1;
        }
        return days;
    }
    exports['secondsOfMinute'] = secondsOfMinute;
    exports['secondsOfHour'] = secondsOfHour;
    exports['secondsOfDay'] = secondsOfDay;
    exports['namesOfMonths'] = namesOfMonths;
    exports['now'] = now;
    exports['thisDay'] = thisDay;
    exports['thisMonth'] = thisMonth;
    exports['thisYear'] = thisYear;
    exports['isLeapYear'] = isLeapYear;
    exports['daysOfMonth'] = daysOfMonth;
    return exports;
});
//end of $root.lang.date
