/**
 * ---
 * description: Arguments Utils
 * namespace: $root.lang.arguments
 * imports:
 *   _type: $root.lang.type
 *   _ary: $root.lang.array
 * exports: []
 * files:
 * - ../src/lang/arguments.js
 */

;define('$root.lang.arguments',['$root.lang.type','$root.lang.array'],function(require, exports){
    //'use strict';
    var _type = require('$root.lang.type'),
        _ary = require('$root.lang.array');
    
        ///vars
    var _slice = Array.prototype.slice;
    ///exports
    function toArray(_arguments) {
        return _slice.call(_arguments, 0);
    }
    
    function varArgs(_arguments) {
        var fns = {}, n = 4,
            i, j, typeName;
        while (--n) {
            fns['_' + n] = function(sig, callback) {
                var signatures = sig,
                    len;
                if (_type.isString(sig)) {
                    signatures = sig.split('|');
                    len = signatures.length;
                    for (; i < len; ++i) {
                        signatures[i] = signatures[i].split(',');
                    }
                }
                for (; i < len; ++i) {
                    for (j = 0; j < signatures[i].length; ++j) {
                        typeName = signatures[i][j];
                        if (!_type[typeName]) {
                            break;
                        } else {
    
                        }
                    }
                }
            }
        }
    }
    /*
    _arg.varArgs(arguments)
    ._0(function(){
    
    })
    ._1('String,Number',function(){
    
    })
    ._2('string,function',function(){
    
    })
    ._3_('string,function,object',function(){
        
    });
    */
    
    return exports;
});
//end of $root.lang.arguments
