/**
 * ---
 * description: Table
 * namespace: $root.ui.table
 * imports:
 *   _type: $root.lang.type
 *   _str: $root.lang.string
 *   $: jQuery
 * exports:
 * - Table
 * files:
 * - src/ui/table.js
 */

;define('ui/table',[
    'lang/type',
    'lang/string',
    'jQuery'
], function (_type,_str,$){
    //'use strict';
    var exports = {};
    
        var Table = _type.create('$root.ui.Table', jQuery, {
      init: function() {}
    }).statics({
      Events: {}
    });
        
    ///sigils

    exports['Table'] = Table;
    exports.__doc__ = "Table";
    return exports;
});
//end of $root.ui.table