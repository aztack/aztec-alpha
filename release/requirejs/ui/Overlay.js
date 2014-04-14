/**
 * ---
 * description: Overlay
 * namespace: $root.ui.overlay
 * imports:
 *   _type: $root.lang.type
 *   _tpl: $root.browser.template
 *   _arguments: $root.lang.arguments
 *   $: jQuery
 * returns: Overlay
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
        _tpl
            .set('$root.ui.Overlay.mask',"<div class=\"ui-overlay\"></div>\n");
        var varArg = _arguments.varArg,
      tpl = _tpl.id$('$root.ui.Overlay'),
      maskTemplate = tpl('mask');
    
    var Overlay = _type.create('$root.ui.Overlay', jQuery, {
      init: function(options) {
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
      }
    }).statics({
      Events:{}
    });
    
    Overlay.create = function() {
      return new Overlay();
    };
    
    function create() {
      var o = $(tpl('mask'));
      $(document.body).prepend(o);
      o.show();
      return o;
    }
        
    ///sigils

    return Overlay;
});
//end of $root.ui.overlay
