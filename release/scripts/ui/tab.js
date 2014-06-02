/**
 * ---
 * description: Tab
 * namespace: $root.ui.tab
 * directory: ui/Tab
 * imports:
 *   _str: $root.lang.string
 *   _type: $root.lang.type
 *   _enum: $root.lang.enumerable
 *   _num: $root.lang.number
 *   _list: $root.ui.list
 *   _tpl: $root.browser.template
 *   _arguments: $root.lang.arguments
 *   $: jquery
 *   jqe: jQueryExt
 * returns: Tab
 * files:
 * - src/ui/Tab/Tab.js
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('ui/tab', ['lang/string', 'lang/type', 'lang/enumerable', 'lang/number', 'ui/list', 'browser/template', 'lang/arguments', 'jquery', 'jQueryExt'], factory);
    } else if (typeof module === 'object') {
        var $root_lang_string = require('lang/string'),
            $root_lang_type = require('lang/type'),
            $root_lang_enumerable = require('lang/enumerable'),
            $root_lang_number = require('lang/number'),
            $root_ui_list = require('ui/list'),
            $root_browser_template = require('browser/template'),
            $root_lang_arguments = require('lang/arguments'),
            jquery = require('jquery'),
            jQueryExt = require('jQueryExt');
        module.exports = factory($root_lang_string, $root_lang_type, $root_lang_enumerable, $root_lang_number, $root_ui_list, $root_browser_template, $root_lang_arguments, jquery, jQueryExt, exports, module, require);
    } else {
        var exports = $root._createNS('$root.ui.tab');
        factory($root.lang.string, $root.lang.type, $root.lang.enumerable, $root.lang.number, $root.ui.list, $root.browser.template, $root.lang.arguments, jquery, jQueryExt, exports);
    }
}(this, function(_str, _type, _enum, _num, _list, _tpl, _arguments, $, jqe, exports) {
    //'use strict';
    exports = exports || {};
    _tpl
        .set('$root.ui.tab.Tab',"<div class=\"ui-tab\"><div class=\"ui-tab-content\"></div></div>\n");
    var tpl = _tpl.id$('$root.ui.tab'),
      varArg = _arguments.varArg,
      selectedsel = '.selected',
      selectedstr = 'selected';
    
    var Tab = _type.create('$root.ui.Tab', jQuery, {
      init: function(options) {
        options = options || {};
        this.base(options.container || Tab.Template.DefaultTabTemplate);
        this.$attr('options', options);
        var list = new _list.List();
        this.prepend(list);
        this.$attr('tabs', list);
        Tab_initialize(this, options);
      },
      setTabs: function() {
        var tabs = this.$get('tabs');
        varArg(arguments, this)
          .when('int', 'htmlFragment', function(index, html) {
            var c = $(tabs.children().get(index));
            c.html(html);
            this.select(index);
          })
          .when('int', 'string', function(index, text) {
            var c = $(tabs.children().get(index));
            c.text(text);
            this.select(index);
          })
          .when('array<*>', function(texts) {
            var item;
            tabs.empty();
            _enum.each(texts, function(s) {
              item = $('<li>');
              if (_str.isHtmlFragment(s)) {
                item.html(s);
              } else {
                item.text(s);
              }
              item.appendTo(tabs);
            });
            this.select(0);
          }).resolve();
        return this;
      },
      setContents: function() {
        var contents = this.$get('contents');
        varArg(arguments, this)
          .when('int', 'htmlFragment', function(index, html) {
            var c = $(contents.children().get(index));
            c.html(html);
          })
          .when('int', '*', function(index, text) {
            var c = $(contents.children().get(index));
            c.text(text);
          })
          .when('array<*>', function(texts) {
            var item;
            contents.empty();
            _enum.each(texts, function(s) {
              item = $('<div>');
              if (_str.isHtmlFragment(s)) {
                item.html(s);
              } else {
                item.text(s);
              }
              item.appendTo(contents);
            });
            this.select(0);
          }).resolve();
        return this;
      },
      select: function(index) {
        var tabs = this.$get('tabs'),
          tabsChildren = tabs.children(),
          contents = this.$get('contents');
        //deselect
        tabs.find(selectedsel).removeClass(selectedstr);
        contents.find(selectedsel).removeClass(selectedstr);
    
        //select
        index = _num.confined(index, 0, tabsChildren.length - 1, true);
        $(tabsChildren[index]).addClass(selectedstr);
        $(contents.children()[index]).addClass(selectedstr);
    
        this.$set('index', index);
        return this;
      },
      delete: function(index) {
        var tabs = this.$get('tabs'),
          tabsChildren = tabs.children(),
          contents = this.$get('contents');
        index = _num.confined(index, 0, tabsChildren.length - 1, true);
        $(tabsChildren.get(index)).remove();
        $(contents.children().get(index)).remove();
        this.select(index - 1);
        return this;
      },
      indexOfSelected: function() {
        return this.$get('index');
      },
      getContent: function() {
        var content = this.$get('contents');
        return varArg(arguments, this)
          .when(function() {
            return content.find(selectedsel);
          })
          .when('int', function(index) {
            return $(content.children().get(index));
          })
          .resolve();
      }
    }).events({
      OnTabSelected: 'TabSelected(event,index,caption,prevIndex).Tab'
    }).statics({
      Template: {
        DefaultTabTemplate: tpl('Tab')
      }
    });
    
    function Tab_initialize(self, opts) {
      var tabs = self.$get('tabs');
      if (opts.tabs && opts.tabs.length) {
        _enum.each(opts.tabs, function(caption, i) {
          var item = tabs.add('<a href="javascript:;">' + caption + '</a>');
          if (i === 0) item.addClass(selectedstr);
        });
      }
    
      var changeTabEvent = opts.mouseOverSelect ? 'mouseenter' : 'click';
    
      tabs.delegate('li', changeTabEvent, function(e) {
        var t = $(e.target).closest('li'),
          prevSelected, prevIndex,
          index = tabs.indexOf(t),
          caption = t.text(),
          contents = self.$get('contents');
        self.$set('index', index);
        //tabs
        prevSelected = tabs.find(selectedsel);
        prevSelected.removeClass(selectedstr);
        prevIndex = tabs.indexOf(prevSelected);
        t.addClass(selectedstr);
    
        //contents
        contents.find(selectedsel).removeClass(selectedstr);
        $(contents.children().get(index)).addClass(selectedstr);
    
        //custom event
        self.trigger(Tab.Events.OnTabSelected, [index, caption, prevIndex]);
      });
    
      if (!self.hasClass('ui-tab')) {
        self.addClass('ui-tab');
      }
    
      var contents = self.sigil('.contents');
      if (!contents || contents.length === 0) {
        contents = $('<div>').addClass('ui-tab-content');
        self.tabs.after(contents);
      }
      self.$attr('contents', contents);
    
      if(opts.contents) {
        self.setContents(opts.contents);
      }
    
      self.select(typeof opts.selected == 'number' ? opts.selected : 0);
    }
    
    function Tab_adjustTabItemWidth(self, opts) {
    
    }
        
    ///sigils
    if (!Tab.Sigils) Tab.Sigils = {};
    Tab.Sigils[".contents"] = ".ui-tab-content";

    return Tab;
}));
//end of $root.ui.tab
