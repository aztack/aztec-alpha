({
    description: 'Menu',
    namespace: $root.ui.Menu,
    imports: {
        _type: $root.lang.type,
        _arguments: $root.lang.arguments,
        _tpl: $root.browser.template,
        _enum: $root.lang.enumerable,
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
    init: function() {
        this.base(menuItemTemplate);
    },
    text: function(text) {
        var t = $(textTemplate);
        t.text(text);
        this.sigil('.item-container').append(t);
        return this;
    }
});

var Menu = _type.create('Menu', jQuery, {
    init: function() {
        this.base(menuTemplate);
    },
    addItem: function(text) {
        var item = new MenuItem();
        item.text(text);
        this.append(item);
        return this;
    },
    addItems: function(texts) {
        _enum.each(texts, function(text) {
            this.addItem(text);
        }, this);
        return this;
    },
    show: function() {
        var body = document.body;
        varArg(arguments, this)
            .when(function(){
                return [body, this.css('left'), this.css('top')];
            })
            .when('int','int',function(x, y){
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
        return this.base();
    }
});


///exports