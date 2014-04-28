/**
 * ---
 * description: Menu
 * namespace: $root.ui.menu
 * imports:
 *   _type: $root.lang.type
 *   _str: $root.lang.string
 *   _arguments: $root.lang.arguments
 *   _tpl: $root.browser.template
 *   _enum: $root.lang.enumerable
 *   _list: $root.ui.list
 *   _fn: $root.lang.fn
 *   $: jQuery
 * exports:
 * - Menu
 * - MenuItem
 * files:
 * - src/ui/menu.js
 */

;define('ui/menu',[
    'lang/type',
    'lang/string',
    'lang/arguments',
    'browser/template',
    'lang/enumerable',
    'ui/list',
    'lang/fn',
    'jQuery'
], function (_type,_str,_arguments,_tpl,_enum,_list,_fn,$){
    //'use strict';
    var exports = {};
        _tpl
            .set('$root.ui.Menu.menu',"<ul class=\"ui-menu\"></ul>\n")
            .set('$root.ui.Menu.item',"<li class=\"ui-menu-item unselectable\"><span class=\"ui-menu-item-text\"><a href=\"javascript:;\"></a></span></li>\n");
        ///vars
    var tpl = _tpl.id$('$root.ui.Menu'),
        menuTemplate = tpl('menu'),
        menuItemTemplate = tpl('item'),
        textTemplate = tpl('text'),
        varArg = _arguments.varArg;
    
    ///impl
    var MenuItem = _type.create('$root.ui.MenuItem', jQuery, {
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
    
    var Menu = _type.create('$root.ui.Menu', _list.List, {
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
            var parent = this.parent();
            varArg(arguments, this)
                .when(function() {
                    return [parent, this.css('left'), this.css('top')];
                })
                .when('int', 'int', function(x, y) {
                    return [parent, x, y];
                })
                .when('jquery', 'int', 'int', function(parent, x, y) {
                    return [parent, x || 0, y || 0];
                })
                .invoke(function(parent, x, y) {
                    this.appendTo(parent).show().css({
                        left: x,
                        top: y
                    });
                });
            return this;
        },
        asContextMenuOf: function(target) {
            return Menu_asContextMenuOf(this, target);
        }
    }).statics({
        DefaultMenuItemType: MenuItem
    }).events({
        OnItemSelected: 'OnItemSelected.Menu'
    });
    
    function Menu_initialize(self) {
        self.css('position', 'absolute').on('mouseup', function(e) {
            var index = self.indexOf(e.target),
                item;
            if (index < 0) {
                item = $(e.target).closest(self.children().get(0).tagName);
                index = self.indexOf(item);
            }
            if (index < 0) return;
            item = self.getItemAt(index);
            self.trigger(Menu.Events.OnItemSelected, [item, index]);
        });
    }
    
    function Menu_asContextMenuOf(self, target) {
        var owner = $(target),
            position = owner.css('position');
        if (position != 'relative' && position != 'absolute' && position != 'fixed') {
            owner.css('position', 'relative');
        }
        owner.append(self).on('contextmenu', function(e) {
            if (e.target === owner[0]) {
                self.showAt(e.offsetX, e.offsetY);
                e.stopImmediatePropagation();
                return false;
            }
        }).on('click', function() {
            _fn.bindTimeout(self.hide, self, 50)();
        });
        return self;
    }
        
    ///sigils
    if (!Menu.Sigils) Menu.Sigils = {};
    Menu.Sigils[".tag"] = ".ui-menu";
    if (!MenuItem.Sigils) MenuItem.Sigils = {};
    MenuItem.Sigils["text"] = "a";
    MenuItem.Sigils[".item"] = ".ui-menu-item";

    exports['Menu'] = Menu;
    exports['MenuItem'] = MenuItem;
    exports.__doc__ = "Menu";
    return exports;
});
//end of $root.ui.menu
