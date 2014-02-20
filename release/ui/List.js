/**
 * ---
 * description: List
 * namespace: $root.ui.List
 * imports:
 *   _type: $root.lang.type
 *   _str: $root.lang.string
 *   _arguments: $root.lang.arguments
 *   _fn: $root.lang.fn
 *   $: jQuery
 * exports:
 * - List
 * files:
 * - /ui/List.js
 */

;define('$root.ui.List',[
    '$root.lang.type',
    '$root.lang.string',
    '$root.lang.arguments',
    '$root.lang.fn',
    'jQuery'
], function (require, exports){
    //'use strict';
    var _type = require('$root.lang.type'),
        _str = require('$root.lang.string'),
        _arguments = require('$root.lang.arguments'),
        _fn = require('$root.lang.fn'),
        $ = require('jQuery');
    
        /**
     * A Generic List, represents a <ul> elements
     */
    var List = _type.create('List', jQuery, {
      add: function(arg) {
        var Item = this.itemType,
          item;
        if (Item) {
          item = _fn.applyNew(Item, arguments);
        } else {
          if (_str.isHtmlFragment(arg) || arg instanceof jQuery) {
            item = $(arg);
          } else {
            item = $(List.defaultItemTag).text(arg);
          }
        }
        this.append(item);
        return item;
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
        var item = this.children().get(index),
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
        } else {
          throw Error('setItemType need a function as item constructor!');
        }
      }
    }).statics({
      defaultItemTag: '<li>'
    });
    
    
    ///exports
    
    exports['List'] = List;
    return exports;
});
//end of $root.ui.List
