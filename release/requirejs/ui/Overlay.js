/**
 * ---
 * description: Overlay
 * namespace: $root.ui.overlay
 * imports:
 *   _type: $root.lang.type
 *   _tpl: $root.browser.template
 *   _arguments: $root.lang.arguments
 *   $: jQuery
 * exports:
 * - Mask
 * - create
 * files:
 * - src/ui/overlay.js
 */

;define('ui/overlay',[
    'lang/type',
    'browser/template',
    'lang/arguments',
    'jQuery'
], function (_type,_tpl,_arguments,$){
    //'use strict';
    var exports = {};
        _tpl
            .set('$root.ui.overlay.iframeMask',"<iframe src=\"about:blank\" class=\"ui-overlay\"></iframe>\n")
            .set('$root.ui.overlay.mask',"<div class=\"ui-overlay\"></div>\n");
        var varArg = _arguments.varArg,
      tpl = _tpl.id$('$root.ui.overlay'),
      maskTemplate = tpl('mask');
    
    var Mask = _type.create('$root.ui.overlay.Mask', jQuery, {
      init: function() {
        this.base(maskTemplate);
      },
      setOpacity: function() {
        return varArg(arguments, this)
          .when('float', function(f) {
            return [f];
          })
          .when('string', function(s) {
            return [parseFloat(s)];
          })
          .when('*', function(s) {
            return [parseFloat(String(s))];
          })
          .invoke(function(opacity) {
            return this.css('opacity', opacity);
          });
      },
      getZIndex: function() {
        return this.css('z-index');
      }
    });
    
    Mask.create = function() {
      var m = new Mask();
      m.appendTo('body');
      return m;
    };
        
    ///sigils

    exports['Mask'] = Mask;
//     exports['create'] = create;
    exports.__doc__ = "Overlay";
    return exports;
});
//end of $root.ui.overlay
