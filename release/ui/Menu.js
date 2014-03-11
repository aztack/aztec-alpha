/**
 * ---
 * description: Menu
 * namespace: $root.ui.Menu
 * imports:
 *   _type: $root.lang.type
 *   _str: $root.lang.string
 *   _arguments: $root.lang.arguments
 *   _tpl: $root.browser.template
 *   _enum: $root.lang.enumerable
 *   _list: $root.ui.List
 *   $: jQuery
 * exports:
 * - Menu
 * - MenuItem
 * files:
 * - /ui/Menu.js
 */

;define('$root.ui.Menu',[
    '$root.lang.type',
    '$root.lang.string',
    '$root.lang.arguments',
    '$root.browser.template',
    '$root.lang.enumerable',
    '$root.ui.List',
    'jQuery'
], function (require, exports){
    //'use strict';
    var _type = require('$root.lang.type'),
        _str = require('$root.lang.string'),
        _arguments = require('$root.lang.arguments'),
        _tpl = require('$root.browser.template'),
        _enum = require('$root.lang.enumerable'),
        _list = require('$root.ui.List'),
        $ = require('jQuery');
        
    ///xtemplate
    require('$root.browser.template')
            .set('$root.ui.Menu.menu',"<ul class=\"ui-menu\"></ul>\n")
            .set('$root.ui.Menu.item',"<li class=\"ui-menu-item unselectable\"><span class=\"ui-menu-item-text\"><a href=\"javascript:;\"></a></span></li>\n");
        ///vars
    var tpl = _tpl.id$('$root.ui.Menu'),
        menuTemplate = tpl('menu'),
        menuItemTemplate = tpl('item'),
        textTemplate = tpl('text'),
        varArg = _arguments.varArg;
    
    ///impl
    var MenuItem = _type.create('MenuItem', jQuery, {
        init: function(arg) {
            if (_str.isHtmlFragment(arg) || arg instanceof jQuery || _type.isElement(arg)) {
                this.base(arg);
            } else {
                this.base(menuItemTemplate);
                this.text(arg);
            }
            this.addClass('ui-menut-item');
        },
        text: function(arg) {
            var t = this.sigil('text');
            if (_type.isNullOrUndefined(arg)) {
                return t.text();
            } else {
                t.text(arg);
                return this;
            }
        }
    });
    
    var Menu = _type.create('Menu', _list.List, {
        init: function(options) {
            options = options || {};
            this.base(menuTemplate);
            this.addClass('ui-menu');
            this.setItemType(options.menuItemType || Menu.DefaultMenuItemType);
            Menu_initialize(this);
        },
        addItems: function(texts) {
            _enum.each(texts, function(text) {
                var item = new this.itemType();
                item.text(text);
                this.add(item);
            }, this);
            return this;
        },
        showAt: function() {
            var body = document.body;
            varArg(arguments, this)
                .when(function() {
                    return [body, this.css('left'), this.css('top')];
                })
                .when('int', 'int', function(x, y) {
                    return [body, x, y];
                })
                .when('jquery', 'int', 'int', function(parent, x, y) {
                    return [parent, x || 0, y || 0];
                })
                .invoke(function(parent, x, y) {
                    this.appendTo(parent).css({
                        left: x,
                        top: y
                    });
                });
            return this;
        }
    }).statics({
        DefaultMenuItemType: MenuItem,
        Events: {
            OnItemSelected: 'OnItemSelected.Menu'
        }
    });
    
    function Menu_initialize(self) {
        self.on('click', function(e) {
            var index = self.indexOf(e.target),
                item;
            if (index < 0) {
                item = $(e.target).closest(self.children().get(0).tagName);
                index = self.indexOf(item);
            }
            if( index < 0) return;
            item = self.getItemAt(index);
            self.trigger(Menu.Events.OnItemSelected, [item, index]);
        });
    }
    
    ///exports
        
    ///sigils
// sigils defined in xtemplate but variable or function $root.ui.Menu not found
    MenuItem.sigils = {
        "text": "a",
        ".item": ".ui-menu-item"
    };

    exports['Menu'] = Menu;
    exports['MenuItem'] = MenuItem;
    return exports;
});
//end of $root.ui.Menu
