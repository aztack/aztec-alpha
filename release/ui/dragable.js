/**
 * ---
 * description: Dragable
 * namespace: $root.ui.dragable
 * imports:
 *   _type: $root.lang.type
 *   _str: $root.lang.string
 * exports:
 * - dragable
 * - Dragable
 * files:
 * - /ui/dragable.js
 */

;define('$root.ui.dragable',['$root.lang.type','$root.lang.string'],function(require, exports){
    //'use strict';
    var _type = require('$root.lang.type'),
        _str = require('$root.lang.string');
    
        ///vars
    
    
    ///helper
    
    
    ///impl
    
    
    ///exports
    function dragable(jqobj) {
        var offsetParent = jqobj.offsetParent(),
            dragging = false,
            mousedownpos = {
                x: 0,
                y: 0
            };
        jqobj.on('mousedown', function(e) {
            dragging = true;
            //position relative to document
            var pos = jqobj.offset();
            mousedownpos.x = e.clientX - pos.left;
            mousedownpos.y = e.clientY - pos.top;
        }).on('mousemove', function(e) {
            if(!dragging) return;
            jqobj.offset({
                left: e.clientX - mousedownpos.x,
                top: e.clientY - mousedownpos.y
            });
        }).on('mouseup', function() {
            dragging = false;
        }).on('keyup', function() {
            dragging = false;
        });
    }
    exports['dragable'] = dragable;
//     exports['Dragable'] = Dragable;
    return exports;
});
//end of $root.ui.dragable
