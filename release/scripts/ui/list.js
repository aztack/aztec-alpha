/**
 * List
 * ----
 * Dependencies: $root.lang.type,$root.lang.fn,$root.lang.string,$root.lang.arguments,jquery,jQueryExt
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('ui/list', ['lang/type', 'lang/fn', 'lang/string', 'lang/arguments', 'jquery', 'jQueryExt'], factory);
    } else if (typeof module === 'object') {
        var $root_lang_type = require('lang/type'),
            $root_lang_fn = require('lang/fn'),
            $root_lang_string = require('lang/string'),
            $root_lang_arguments = require('lang/arguments'),
            jquery = require('jquery'),
            jQueryExt = require('jQueryExt');
        module.exports = factory($root_lang_type, $root_lang_fn, $root_lang_string, $root_lang_arguments, jquery, jQueryExt, exports, module, require);
    } else {
        var exports = $root._createNS('$root.ui.list');
        factory($root.lang.type, $root.lang.fn, $root.lang.string, $root.lang.arguments, jquery, jQueryExt, exports);
    }
}(this, function(_type, _fn, _str, _arguments, $, jqe, exports) {
    //'use strict';
    exports = exports || {};
    
    var varArg = _arguments.varArg;
    /**
     * A Generic List, represents a unordered list
     */
    var List = _type.create('$root.ui.List', jQuery, {
      init: function() {
        varArg(arguments, this)
          .when(function() {
            return [null, null];
          })
          .when('{*}', function(opts) {
            return [null, opts];
          })
          .when('*', function(arg) {
            return [arg, null];
          })
          .when('*', '{*}', function(arg, opts) {
            return [arg, opts];
          })
          .invoke(function(arg, opts) {
            opts = List.options(opts || {});
            this.$attr('options', opts);
            this.$attr('itemType', opts.itemType);
            this.base.call(this, arg || opts.containerTag);
            if (opts.containerClass) {
              this.addClass(opts.containerClass);
            }
          });
        return this;
      },
      insertAfter: function(arg, pos, cbk) {
        return List_insertX.call(this, arg, pos, cbk, true);
      },
      insertBefore: function(arg, pos, cbk) {
        return List_insertX.call(this, arg, pos, cbk, false);
      },
      add: function(arg, cbk) {
        return this.insertAfter(arg, -1, cbk);
      },
      remove: function(item) {
        $(item).remove();
        return this;
      },
      removeAt: function(index) {
        $(this.children().get(index)).remove();
        return this;
      },
      clear: function() {
        this.children().remove();
        return this;
      },
      getItemAt: function(index) {
        var item = this.items().get(index),
          Item = this.itemType;
    
        if (item) {
          return Item ? new Item(item) : item;
        }
      },
      indexOf: function(item) {
        return this.children().index(item);
      },
      setItemType: function(clazz) {
        if (_type.isFunction(clazz)) {
          this.itemType = clazz;
        }
        return this;
      },
      items: function() {
        return this.find(this.options.itemTag.replace(/^<|>$/g, ''));
      }
    }).options({
      containerTag: '<ul>',
      itemTag: '<li>',
      containerClass: '',
      itemClass: '',
      itemType: null
    });
    
    function List_insertX(arg, pos, cbk, flag) {
      var item, opts = this.options;
      if (_str.isHtmlFragment(arg) || arg instanceof jQuery || arg.nodeType === 1) {
        item = $(opts.itemTag);
        item.append(typeof cbk == 'function' ? cbk.call(item, arg) : arg);
      } else if (_type.isArray(arg)) {
        item = List_createItems(this, this.options, arg, cbk);
      } else {
        item = $(opts.itemTag);
        item.text(typeof cbk == 'function' ? cbk.call(item, arg) : arg);
      }
    
      var children = this.children(),
        targetEle;
      if (children.length === 0) {
        this.append(item);
      } else {
        targetEle = children.slice(pos).first();
        if (flag === true) {
          item.insertAfter(targetEle);
        } else {
          item.insertBefore(targetEle);
        }
      }
    
      if (cbk && typeof cbk != 'function' && cbk.itemClass) {
        item.addClass(cbk.itemClass);
      } else {
        item.addClass(opts.itemClass);
      }
      return item;
    }
    
    function List_createItems(self, opts, arg, cbk) {
      var i = 0,
        len = arg.length,
        v,
        itemTagName = opts.itemTag.replace(/^<|>$/g, ''),
        html = '';
      if (cbk) {
        for (; i < len; ++i) {
          html += cbk.call(this, arg[i], itemTagName, opts.itemClass);
        }
      } else {
        if (opts.itemClass) {
          for (; i < len; ++i) {
            html += _str.format('<{0} class="{1}">{2}</{0}>', itemTagName, opts.itemClass, arg[i]);
          }
        } else {
          for (; i < len; ++i) {
            html += _str.format('<{0}>{1}</{0}>', itemTagName, arg[i]);
          }
        }
      }
      return $(html);
    }
    
    exports['List'] = List;
    exports.__doc__ = "List";
    exports.VERSION = '0.0.1';
    return exports;
}));
//end of $root.ui.list
