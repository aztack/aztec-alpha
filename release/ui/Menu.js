/**
 * ---
 * description: Menu
 * namespace: $root.ui.Menu
 * imports:
 *   _type: $root.lang.type
 *   _arguments: $root.lang.arguments
 *   _enum: $root.lang.enumerable
 *   $: jQuery
 * exports: []
 * files:
 * - /ui/Menu.js
 */

;define('$root.ui.Menu',[
    '$root.lang.type',
    '$root.lang.arguments',
    '$root.lang.enumerable',
    'jQuery'
], function (require, exports){
    //'use strict';
    var _type = require('$root.lang.type'),
        _arguments = require('$root.lang.arguments'),
        _enum = require('$root.lang.enumerable'),
        $ = require('jQuery');
        
    ///xtemplate
    require('$root.browser.template')
            .set('$root.ui.Menu.menu',"<ul class=\"ui-taginput-tag\"></ul>\n")
            .set('$root.ui.Menu.item',"<li class=\"ui-menu-item\"><span class=\"ui-menu-item-text\"></span></li>\n")
            .set('$root.ui.Menu.icon',"<a class=\"ui-menu-item-icon\" href=\"javascript:;\"></a>\n")
            .set('$root.ui.Menu.text',"<span class=\"ui-menu-item-text\"></span>\n")
            .set('$root.ui.Menu.checkbox',"<span class=\"ui-menu-item.checkbox\"><input type=\"checkbox\"></span>\n");
        ///vars
    var tpl = _tpl.id$('$root.ui.Menu'),
        menuTemplate = tpl('menu'),
        menuItemTemplate = tpl('item'),
        varArg = _arguments.varArg;
    
    ///helper
    
    
    ///impl
    var MenuItem = _type.create('MenuItem', jQuery, {
        text: function(text){
            this.sigil('.text').text(text);
            return this;
        }
    });
    
    var Menu = _type.create('Menu', jQuery, {
        init: function() {
    
        },
        addItem: function(text){
            var item = new MenuItem();
            item.text(text);
            this.sigils('.items').append(item);
            return this;
        },
        addItems: function(texts) {
            _enum.each(texts, function(text){
                this.addItem(text);
            }, this);
            return this;
        }
    });
    
    
    ///exports
        
    ///sigils
    Menu.sigils = {
        "length": 0
    };
    MenuItem.sigils = {
        "length": 1,
        ".text": ".ui-menu-item-text"
    };

    
    return exports;
});
//end of $root.ui.Menu
