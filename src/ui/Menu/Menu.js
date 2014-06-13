({
    description: 'Menu',
    namespace: $root.ui.menu,
    directory: 'ui/Menu',
    imports: {
        _type: $root.lang.type,
        _str: $root.lang.string,
        _arguments: $root.lang.arguments,
        _tpl: $root.browser.template,
        _enum: $root.lang.enumerable,
        _list: $root.ui.list,
        _fn: $root.lang.fn,
        $: jquery,
        jqe: jQueryExt
    },
    exports: [
        Menu,
        MenuItem
    ]
});
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
            .when('{*}',function(offset){
                var x = offset.left, y = offset.top;
                if(x == null) x = offset.x;
                if(y == null) y = offset.y;
                return [parent, x, y];
            })
            .invoke(function(parent, x, y) {
                if(!parent || !parent.length) parent = 'body';
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
        if(e.which !== 1) return;
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
        if(e.which !== 1) return;
        var t = $(e.target);
        if (!t.closest('.ui-menu').length && self.is(':visible')) {
            self.hide();
            return false;
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