/**
 * ---
 * description: Trackbar
 * namespace: $root.ui.trackbar
 * directory: ui/Trackbar
 * imports:
 *   _type: $root.lang.type
 *   _arguments: $root.lang.arguments
 *   _number: $root.lang.number
 *   _enum: $root.lang.enumerable
 *   _str: $root.lang.string
 *   _drag: $root.ui.draggable
 *   $: jQuery
 *   _tpl: $root.browser.template
 * exports:
 * - Trackbar
 * files:
 * - src/ui/Trackbar/Trackbar.js
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('ui/trackbar',['lang/type','lang/arguments','lang/number','lang/enumerable','lang/string','ui/draggable','jQuery','browser/template'], factory);
    } else {
        var exports = $root._createNS('$root.ui.trackbar');
        factory($root.lang.type,$root.lang.arguments,$root.lang.number,$root.lang.enumerable,$root.lang.string,$root.ui.draggable,jQuery,$root.browser.template,exports);
    }
}(this, function (_type,_arguments,_number,_enum,_str,_drag,$,_tpl,exports) {
    //'use strict';
    exports = exports || {};
    _tpl
        .set('$root.ui.trackbar.Trackbar',"<div class=\"ui-trackbar\">\n<div class=\"ui-trackbar-line\"></div>\n<div class=\"ui-trackbar-handle\"></div>\n</div>\n");
        var varArg = _arguments.varArg,
      tpl = _tpl.id$('$root.ui.trackbar');
    
    var Trackbar = _type.create('$root.ui.Trackbar', jQuery, {
      init: function(opts) {
        varArg(arguments, this)
          .when('*', function(arg) {
            return [arg, {}];
          })
          .when('*', '{*}', function(arg, opts) {
            return [arg, opts];
          })
          .invoke(function(arg, opts) {
            this.base(tpl('Trackbar'));
            this.appendTo(arg);
            this.$attr('options', opts);
            this.$attr('handle', this.sigil('.handle'));
            Trackbar_initialize(this, opts);
          });
      },
      val: function(v) {
        var value, h = this.$get('handle');
        if (v == null) {
          return (h.position().left) / (this.width() - h.width());
        } else if (v !== value && _type.isInteger(v)) {
          value = _number.confined(v, 0, 100, false);
          this.handle.css('left', this.value + '%');
        }
        return this;
      }
    }).events({
      OnChange: 'Change(event,value).Trackbar'
    }).statics({
    
    });
    
    function Trackbar_initialize(self, opts) {
      var handle = self.handle,
        p = self.parent(),
        initTop = handle.css('top'),
        line = self.sigil('.line'),
        drag;
    
      line.css('margin-top', line.parent().height() / 2);
      drag = _drag.draggable(handle, {
        draggingRestriction: function(offset) {
          var $parent = this.$offsetParent,
            w = $parent.width(),
            borderRightWidth = parseInt(this.$dragged.css('border-right-width')),
            borderLeftWidth = parseInt(this.$dragged.css('border-left-width')),
            rightBound = w - this.$.width() - borderRightWidth - borderLeftWidth;
          if (offset.top < 0) offset.top = 0;
          if (offset.left < 0) offset.left = 0;
          if (offset.left >= rightBound) offset.left = rightBound;
          offset.top = initTop;
          //offset.left = p.offset().left;
        },
        onMouseMove: function() {
          self.trigger(Trackbar.Events.OnChange, [self.val()]);
          this.$dragged.offset(offset);
        }
      });
      self.$attr('drag', drag);
    }
        
    ///sigils
// //ERROR:sigils defined in xtemplate but variable or function Slider not found

    exports['Trackbar'] = Trackbar;
    exports.__doc__ = "Trackbar";
    return exports;
}));
//end of $root.ui.trackbar
