({
    description: 'Menu',
    namespace: $root.ui.Menu,
    imports: {
        _type: $root.lang.type,
        _str: $root.lang.string,
        _arguments: $root.lang.arguments,
        _tpl: $root.browser.template,
        _enum: $root.lang.enumerable,
        _list: $root.ui.List,
        $: jQuery
    },
    exports: [
        Menu,
        MenuItem
    ]
});

///vars
var tpl = _tpl.id$('$root.ui.Menu'),
    menuTemplate = tpl('menu'),
    menuItemTemplate = tpl('item'),
    textTemplate = tpl('text'),
    varArg = _arguments.varArg;

///helper


///impl
var MenuItem = _type.create('MenuItem', jQuery, {
    init: function(arg) {
        if (_str.isHtmlFragment(arg) || arg instanceof jQuery) {
            this.base(arg);
        } else {
            this.base(menuItemTemplate);
            this.text(arg);
        }
    },
    text: function(arg) {
        var t, ctn = this.sigil('.item-container');
        if (!_str.isHtmlFragment(arg)) {
            ctn.text(arg);
        } else {
            t = $(textTemplate);
            t.text(arg);
            ctn.append(t);
        }
        return this;
    }
});

var Menu = _type.create('Menu', _list.List, {
    init: function(options) {
        options = options || {};
        this.base(menuTemplate);
        this.addClass('ui-menu');
        this.setItemType(options.itemType || MenuItem);
    },
    addItems: function(texts) {
        _enum.each(texts, function(text) {
            this.add(text);
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
});

Menu.List = _list.List;

///exports