/**
 * #Overlay#
 * =======
 * - Dependencies: `lang/type`,`browser/template`,`lang/arguments`,`jquery`,`jQueryExt`
 * - Version: 0.0.1
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('ui/overlay', ['lang/type', 'browser/template', 'lang/arguments', 'jquery', 'jQueryExt'], factory);
    } else if (typeof module === 'object') {
        var $root_lang_type = require('lang/type'),
            $root_browser_template = require('browser/template'),
            $root_lang_arguments = require('lang/arguments'),
            jquery = require('jquery'),
            jQueryExt = require('jQueryExt');
        module.exports = factory($root_lang_type, $root_browser_template, $root_lang_arguments, jquery, jQueryExt, exports, module, require);
    } else {
        var exports = $root._createNS('$root.ui.overlay');
        factory($root.lang.type, $root.browser.template, $root.lang.arguments, jquery, jQueryExt, exports);
    }
}(this, function(_type, _tpl, _arguments, $, jqe, exports) {
    'use strict';
    exports = exports || {};
    _tpl
        .set('$root.ui.overlay.iframeMask',"<iframe src=\"about:blank\" unselectable=\"on\" tabindex=\"-1\" class=\"ui-overlay\"></iframe>\n")
        .set('$root.ui.overlay.mask',"<div class=\"ui-overlay\" unselectable=\"on\" tabindex=\"-1\"></div>\n");
    //TODO
    //- singleon
    
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
    
    var theMask = null,
      showcount = 0,
      _oldHide, _oldShow;
    /**
     * ##Mask.getInstance()##
     * @return {Mask}
     */
    Mask.getInstance = function() {
      if (theMask === null) {
        theMask = new Mask();
        _oldHide = theMask.hide;
        _oldShow = theMask.show;
        theMask.hide = null;
        theMask.show = null;
        theMask.hide = function() {
          showcount -= 1;
          if (showcount < 0) showcount = 0;
          if (showcount === 0) _oldHide.apply(this, arguments);
          return this;
        };
    
        theMask.show = function() {
          showcount += 1;
          return _oldShow.apply(this, arguments);
        };
      }
      if (theMask.parent().length === 0) {
        theMask.appendTo('body');
      }
      return theMask;
    };
    Mask.disposeInstance = function() {
      if (theMask) {
        theMask.remove();
        theMask.$dispose();
      }
    };
        
    ///sigils

    exports['Mask'] = Mask;
//     exports['create'] = create;
    exports.__doc__ = "Overlay";
    exports.VERSION = '0.0.1';
    return exports;
}));
//end of $root.ui.overlay
