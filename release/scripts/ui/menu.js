/**
 * ---
 * description: Menu
 * namespace: $root.ui.menu
 * directory: ui/Menu
 * imports:
 *   _type: $root.lang.type
 *   _str: $root.lang.string
 *   _arguments: $root.lang.arguments
 *   _tpl: $root.browser.template
 *   _enum: $root.lang.enumerable
 *   _list: $root.ui.list
 *   _fn: $root.lang.fn
 *   $: jquery
 *   jqe: jQueryExt
 * exports:
 * - Menu
 * - MenuItem
 * - ScrollableMenu
 * files:
 * - src/ui/Menu/Menu.js
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
        factory($root.lang.type, $root.lang.string, $root.lang.arguments, $root.browser.template, $root.lang.enumerable, $root.ui.list, $root.lang.fn, jquery, jQueryExt, exports);
    }
}(this, function(_type, _str, _arguments, _tpl, _enum, _list, _fn, $, jqe, exports) {
    //'use strict';
    exports = exports || {};
    _tpl
        .set('$root.ui.Menu.menu',"<ul class=\"ui-menu\"></ul>\n")
        .set('$root.ui.Menu.item',"<li class=\"ui-menu-item unselectable\"><span class=\"ui-menu-item-text\"><a href=\"javascript:;\"></a></span></li>\n");
    //Features
    //[x] separator
    //[x] sub-menu
    //[x] smart locating 
    
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
        OnItemSelected: 'ItemSelected(event,item,index).Menu',
        BeforeShowAt: 'BeforeShowAt(event,data).Menu'
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
    
    /**
     * Scrollable Menu
     */
    var ScrollableMenu = _type.create('$root.ui.ScrollableMenu', Menu, {
        init: function(){
           this.base.apply(this, arguments);
        }
    }).events({
        OnScrollToTop:'ScrollToTop(event)',
        OnScrollToBottom:'ScrollToBottom(event)'
    });
        
    ///sigils
    if (!Menu.Sigils) Menu.Sigils = {};
    Menu.Sigils[".tag"] = ".ui-menu";
    if (!MenuItem.Sigils) MenuItem.Sigils = {};
    MenuItem.Sigils["text"] = "a";
    MenuItem.Sigils[".item"] = ".unselectable";

    exports['Menu'] = Menu;
    exports['MenuItem'] = MenuItem;
    exports['ScrollableMenu'] = ScrollableMenu;
    exports.__doc__ = "Menu";
    exports.VERSION = '0.0.1';
    return exports;
}));
//end of $root.ui.menu
