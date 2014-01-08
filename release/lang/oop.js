// ({
//   description: "Object-Orientated Programming Library for JavaScript",
//   version: '0.0.1',
//   namespace: $root.lang.oop,
//   imports: {
//     _type: $root.lang.type,
//     _enum: $root.lang.enumerable
// },
//   exports: []
// })

;define('$root.lang.oop',['$root.lang.type','$root.lang.enumerable'],function(require, exports){
    //'use strict';
    var _type = require('$root.lang.type'),_enum = require('$root.lang.enumerable');
    
      function Class() {}
    
    Class.create = function() {
    
    };
    
    Class.extend = function() {};
  
    return exports;
});
//end of $root.lang.oop
