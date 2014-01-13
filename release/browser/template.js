/**
 * ---
 * description: Templating
 * namespace: $root.browser.template
 * imports:
 *   _type: $root.lang.type
 *   _str: $root.lang.string
 *   _dom: $root.browser.dom
 *   _$: jQuery
 *   _hb: Handlebars
 * exports:
 * - collect
 * - set
 * - get
 * - id$
 * files:
 * - ../src/browser/template.js
 */

;define('$root.browser.template',['$root.lang.type','$root.lang.string','$root.browser.dom','jQuery','Handlebars'],function(require, exports){
    //'use strict';
    var _type = require('$root.lang.type'),
        _str = require('$root.lang.string'),
        _dom = require('$root.browser.dom'),
        _$ = require('jQuery'),
        _hb = require('Handlebars');
    
        //vars
    var templates = {},
      XTEMPLATE_ID_ATTR = 'data-xtemplate',
      XTEMPLATE_ID_ATTR_SEL = '[data-xtemplate]';
    
    //helper
    
    //exports
    
    function collect(force) {
      if (_type.isUndefined(force)) {
        force = false;
      }
      $(XTEMPLATE_ID_ATTR_SEL).each(function(i, ele) {
        var n = $(ele),
          data = n.attr(XTEMPLATE_ID_ATTR).split(','),
          id = data[0],
          html;
        if (n.tagName == 'SCRIPT') {
          html = n.text();
        } else {
          tmp = n.clone().removeAttr(XTEMPLATE_ID_ATTR);
          tmp = $('<div>').append(_dom.removeWhiteTextNode(tmp[0]));
          html = tmp.html();
        }
        if (data.length > 0 && data[1] == 'delete') {
          ele.parentNode.removeChild(ele);
        }
        if (_type.isUndefined(templates[id]) || force) {
          set(id, html);
        }
      });
    }
    
    function set(id, tpl) {
      if (id.indexOf(',') > 0) {
        id = id.split(',')[0];
      }
      templates[id] = tpl;
      return this;
    }
    
    function get(id) {
      return templates[id];
    }
    
    function id$(namespace) {
      return function(id) {
        return get(namespace + '.' + id);
      };
    }
    
    $(collect);
    exports['collect'] = collect;
    exports['set'] = set;
    exports['get'] = get;
    exports['id$'] = id$;
    return exports;
});
//end of $root.browser.template
