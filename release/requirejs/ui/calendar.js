/**
 * ---
 * description: Calendar
 * namespace: $root.ui.calendar
 * imports:
 *   _type: $root.lang.type
 *   _arguments: $root.lang.arguments
 *   _tpl: $root.lang.template
 *   _date: $root.lang.date
 *   $: jQuery
 * exports:
 * - Calendar
 * files:
 * - src/ui/calendar.js
 */

;define('ui/calendar',[
    'lang/type',
    'lang/arguments',
    'lang/template',
    'lang/date',
    'jQuery'
], function (_type,_arguments,_tpl,_date,$){
    //'use strict';
    var exports = {};
    
        var varArg = _arguments.varArg,
      tpl = _tpl.id$('$root.ui.Calendar');
    
    var Calendar = _type.create('$root.ui.Calendar', jQuery, {
    
    }).statics({
    
    });
        
    ///sigils

    exports['Calendar'] = Calendar;
    exports.__doc__ = "Calendar";
    return exports;
});
//end of $root.ui.calendar
