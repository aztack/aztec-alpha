/**
 * ---
 * description: Tab
 * namespace: $root.ui.tab
 * imports:
 *   _str: $root.lang.string
 *   _type: $root.lang.type
 *   _enum: $root.lang.enumerable
 *   _list: $root.ui.list
 *   _tpl: $root.browser.template
 *   _arguments: $root.lang.arguments
 *   $: jQuery
 * returns: Tab
 * files:
 * - src/ui/tab.js
 */

;define('ui/tab',[
    'lang/string',
    'lang/type',
    'lang/enumerable',
    'ui/list',
    'browser/template',
    'lang/arguments',
    'jQuery'
], function (_str,_type,_enum,_list,_tpl,_arguments,$){
    //'use strict';
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
      setTab: function() {
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
      setContent: function() {
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
          contents = this.$get('contents');
        //deselect
        tabs.find(selectedsel).removeClass(selectedstr);
        contents.find(selectedsel).removeClass(selectedstr);
    
        //select
        $(tabs.children()[index]).addClass(selectedstr);
        $(contents.children()[index]).addClass(selectedstr);
    
        this.$set('index', index);
        return this;
      },
      delete: function(index) {
        var tabs = this.$get('tabs'),
          contents = this.$get('contents');
        $(tabs.children().get(index)).remove();
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
      OnTabSelected: 'TabSelected(event,index,caption).Tab'
    }).statics({
      Template: {
        DefaultTabTemplate: tpl('Tab')
      }
    });
    
    function Tab_initialize(self, opts) {
      var tabs = self.$get('tabs');
      if (opts.tabs && opts.tabs.length) {
        _enum.each(opts.tabs, function(caption, i) {
          item = tabs.add('<a href="javascript:;">' + caption + '</a>');
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
        self.setContent(opts.contents);
      }
    
      self.select(typeof opts.selected == 'number' ? opts.selected : 0);
    }
        
    ///sigils
    if (!Tab.Sigils) Tab.Sigils = {};
    Tab.Sigils[".contents"] = ".ui-tab-content";

    return Tab;
});
//end of $root.ui.tab
