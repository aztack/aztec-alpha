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
        $: jQuery
    },
    exports: [
        Menu,
        MenuItem,
        ScrollableMenu
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