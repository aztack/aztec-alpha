/**
 * #Menu#
 * ====
 * - Dependencies: `lang/type`,`lang/string`,`lang/arguments`,`browser/template`,`lang/enumerable`,`ui/list`,`lang/fn`,`jquery`,`jQueryExt`
 * - Version: 0.0.1
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('ui/menu', ['lang/type', 'lang/string', 'lang/arguments', 'browser/template', 'lang/enumerable', 'ui/list', 'lang/fn', 'jquery', 'jQueryExt'], factory);
    } else if (typeof module === 'object') {
        var $root_lang_type = require('lang/type'),
            $root_lang_string = require('lang/string'),
            $root_lang_arguments = require('lang/arguments'),
            $root_browser_template = require('browser/template'),
            $root_lang_enumerable = require('lang/enumerable'),
            $root_ui_list = require('ui/list'),
            $root_lang_fn = require('lang/fn'),
            jquery = require('jquery'),
            jQueryExt = require('jQueryExt');
        module.exports = factory($root_lang_type, $root_lang_string, $root_lang_arguments, $root_browser_template, $root_lang_enumerable, $root_ui_list, $root_lang_fn, jquery, jQueryExt, exports, module, require);
    } else {
        var exports = $root._createNS('$root.ui.menu');
        factory($root.lang.type, $root.lang.string, $root.lang.arguments, $root.browser.template, $root.lang.enumerable, $root.ui.list, $root.lang.fn, jQuery, jQueryExt, exports);
    }
}(this, function(_type, _str, _arguments, _tpl, _enum, _list, _fn, $, jqe, exports) {
    'use strict';
    exports = exports || {};
    _tpl
        .set('$root.ui.Menu.menu',"<ul class=\"ui-menu\"></ul>\n")
        .set('$root.ui.Menu.item',"<li class=\"ui-menu-item unselectable\">\n<a class=\"ui-menu-item-sub\" href=\"javascript:;\"></a><a class=\"ui-menu-item-icon\" href=\"javascript:;\"></a><a class=\"ui-menu-item-text\" href=\"javascript:;\"></a>\n</li>\n");
    //Features
    //[x] separator
    //[x] sub-menu
    //[x] smart locating 
    
    var tpl = _tpl.id$('$root.ui.Menu'),
        menuTemplate = tpl('menu'),
        menuItemTemplate = tpl('item'),
        textTemplate = tpl('text'),
        varArg = _arguments.varArg,
        List = _list.List;
    
    ///impl
    var MenuItem = _type.create('$root.ui.MenuItem', jQuery, {
        init: function(arg) {
            if (_str.isHtmlFragment(arg) || arg instanceof jQuery || _type.isElement(arg)) {
                this.base(arg);
            } else {
                this.base(menuItemTemplate);
                this.text(arg);
            }
            this.addClass('ui-menu-item');
        },
        text: function(arg) {
            var t = this.sigil('.text');
            if (_type.isNullOrUndefined(arg)) {
                return t.text();
            } else {
                t.text(arg);
                return this;
            }
        }
    });
    
    var Menu = _type.create('$root.ui.Menu', List, {
        init: function(options) {
            this.base(menuTemplate); //call base before set options attr
            options = Menu.options(options || {});
            this.$attr('options', options);
            this.addClass('ui-menu');
            this.setItemType(options.menuItemType || Menu.DefaultMenuItemType);
            Menu_initialize(this);
        },
        /**
         * ##Menu\#addItems([captions][,callback]);
         * @param {Array<String>|Array<MenuItemData>} texts
         * @param {[type]} callback, callback(created menu item)
         *
         * ```javascript
         * MenuItemData = {
         *     text: 'menu-item',
         *     submemnu: [MenuItemData],
         *     data: arbitrary data
         * }
         *
         * menu.addItems(['New File','Open File']);
         * menu.addItems([
         *     {text:'New File..',submenu: ['CSS','JavaScript','HTML']},
         *     {text:'Open File',data: 'custome-data'}
         * ]);
         * ```
         */
        addItems: function(texts, callback) {
            var opts = this.options,
                ItemType = opts.itemType,
                itemTag = opts.itemTag,
                items = _enum.map(texts, function(config) {
                    return Menu_createMenuItem(this, config, callback);
                }, this);
            this.add(items);
            Menu_addMouseOverMenuItemListener(this);
            return this;
        },
        setItems: function(texts) {
            this.empty();
            return this.addItems(texts);
        },
        showAt: function() {
            var parent = this.parent();
            varArg(arguments, this)
                .when(function() {
                    return [parent, this.css('left'), this.css('top')];
                })
                .when('number', 'number', function(x, y) {
                    return [parent, x, y];
                })
                .when('jquery', 'number', 'number', function(parent, x, y) {
                    return [parent, x || 0, y || 0];
                })
                .invoke(function(parent, x, y) {
                    this.appendTo(parent).show().css({
                        left: x,
                        top: y
                    });
                });
            Menu_hideOpenedSubmenu(this);
            return this;
        },
        hide: function() {
            Menu_hideOpenedSubmenu(this);
            this.base.apply(this, arguments);
            return this;
        },
        asContextMenuOf: function(target) {
            return Menu_asContextMenuOf(this, target);
        }
    }).options({
        itemClass: 'ui-menu-item',
        separatorClass: 'ui-menu-separator',
        itemType: MenuItem
    }).events({
        OnItemSelected: 'ItemSelected(event,item,index,parent).Menu',
        BeforeShowAt: 'BeforeShowAt(event,data).Menu',
        OnMouseOverItem: 'MouseOverItem(event,item,index).Menu'
    });
    
    function Menu_initialize(self) {
        var submenu;
        self.css('position', 'absolute').on('mouseup', function(e) {
            var index = self.indexOf(e.target),
                item;
            if (index < 0) {
                item = $(e.target).closest(self.children().get(0).tagName);
                index = self.indexOf(item);
            }
            if (index < 0) return;
            item = self.getItemAt(index);
            self.trigger(Menu.Events.OnItemSelected, [item, index, null]);
            self.hide();
        });
        $(document).on('mousedown', function(e) {
            var t = $(e.target);
            if (t.closest('ui-menu').length == 0 ) {
                self.hide();
            }
        });
    }
    
    function Menu_createMenuItem(self, config, cbk) {
        var item, text = config,
            opts = self.options,
            ItemType = opts.itemType,
            itemTag = opts.itemTag,
            submenu;
        if (config == null) throw new Error('Menu item can not be null or undefined!');
    
        if (typeof config.text == 'function') {
            text = config.text();
        } else if (typeof config.text == 'string') {
            text = config.text;
        }
    
        //create menu item
        if (config == null || /^-+$/.test(text)) {
            item = $(itemTag).addClass(opts.itemClass)
                .addClass(opts.separatorClass);
        } else {
            item = new ItemType(text);
        }
    
        //remove submenu arrow if does't have submenu
        if (!config.submenu) {
            item.sigil('.sub').remove();
        } else {
            submenu = new Menu().addItems(config.submenu);
            submenu.on(Menu.Events.OnItemSelected, function() {
                var args = _arguments.toArray(arguments, 1);
                args.pop();
                args.push(item);
                self.trigger(Menu.Events.OnItemSelected, args);
            });
            item.data('submenu', submenu);
        }
    
        if (config && config.data) {
            item.data('data', config.data);
        }
        cbk && cbk.call(item, config);
        return item;
    }
    
    function Menu_hideOpenedSubmenu(self) {
        var openedSubmenu = self.data('openedSubmenu');
        if (openedSubmenu) {
            openedSubmenu.hide();
            self.removeData('openedSubmenu');
        }
    }
    
    function Menu_addMouseOverMenuItemListener(self) {
        var opts = self.options,
            items = self.children();
        if (!items.length) return;
        items.unbind('mouseenter').on('mouseenter', function(e) {
            var item = $(e.target),
                submenu = item.data('submenu'),
                rect = item[0].getBoundingClientRect();
            Menu_hideOpenedSubmenu(self);
            if (!submenu) return;
            submenu.appendTo(self.parent());
            submenu.showAt(rect.left + rect.width, rect.top);
            self.data('openedSubmenu', submenu);
        });
    }
    
    function Menu_asContextMenuOf(self, target) {
        var owner = $(target),
            p = owner.offsetParent(),
            position = owner.css('position');
        if (position != 'relative' && position != 'absolute' && position != 'fixed') {
            owner.css('position', 'relative');
        }
        owner.on('contextmenu', function(e) {
            var t = $(e.target),
                offset = t.offset(),
                poffset = owner.offsetParent().offset(),
                x, y, data;
            if (t.parents().filter(owner[0]).length === 0) {
                //console.log(offset.left, e.offsetX, offset.top, e.offsetY);
                x = offset.left + e.offsetX - poffset.left;
                y = offset.top + e.offsetY - poffset.top;
                data = {
                    target: t[0],
                    x: x,
                    y: y,
                    isShow: true
                };
                self.trigger(Menu.Events.BeforeShowAt, [data]);
                if (data.isShow) {
                    self.showAt(x, y);
                } else {
                    self.hide();
                }
                e.stopImmediatePropagation();
                return false;
            }
        });
        p.on('click', function() {
            _fn.bindTimeout(self.hide, self, 50)();
        });
        self.appendTo(p).hide();
        return self;
    }
        
    ///sigils
    if (!Menu.Sigils) Menu.Sigils = {};
    Menu.Sigils[".tag"] = ".ui-menu";
    if (!MenuItem.Sigils) MenuItem.Sigils = {};
    MenuItem.Sigils[".sub"] = ".ui-menu-item-sub";
    MenuItem.Sigils[".icon"] = ".ui-menu-item-icon";
    MenuItem.Sigils[".text"] = ".ui-menu-item-text";
    MenuItem.Sigils[".item"] = ".unselectable";

    exports['Menu'] = Menu;
    exports['MenuItem'] = MenuItem;
    exports.__doc__ = "Menu";
    exports.VERSION = '0.0.1';
    return exports;
}));
//end of $root.ui.menu
