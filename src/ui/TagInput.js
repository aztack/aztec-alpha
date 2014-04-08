({
    description: 'TagInput',
    namespace: $root.ui.tagInput,
    imports: {
        _type: $root.lang.type,
        _str: $root.lang.string,
        _tpl: $root.browser.template,
        _enum: $root.lang.enumerable,
        _fn: $root.lang.fn,
        _arguments: $root.lang.arguments,
        $: jQuery
    },
    exports: [
        Tag,
        TagInput
    ]
});

///vars
var tpl = _tpl.id$('$root.ui.TagInput'),
    tagInputTemplate = tpl('tags-and-input'),
    tagTemplate = tpl('tag'),
    varArg = _arguments.varArg;

///helper


///impl
var Tag = _type.create('$root.ui.Tag', jQuery, {
    init: function() {
        var va;
        if (this instanceof Tag) {
            va = varArg(arguments, this)
                .when(function() {
                    this.base(tagTemplate);
                })
                .when('array<element>', function(ary) {
                    this.base(ary[0]);
                })
                .when('element', function(ele) {
                    this.base(ele);
                })
                .when('string', function(text) {
                    this.base(tagTemplate);
                    this.text(String(text));
                });
            va.resolve();
            return this;
        } else {
            return _fn.applyNew(Tag, arguments);
        }
    },
    text: function(val) {
        var t = this.sigil('.text'),
            ret;
        if (typeof val === 'undefined') {
            return t.text();
        } else {
            t.text(val);
            return this;
        }
    }
});

var TagInput = _type.create('$root.ui.TagInput', jQuery, {
    init: function(container, options) {
        this.base(container || tagInputTemplate);
        this.options = options;
        return TagInput_initialize(this);
    },
    appendTag: function(tag) {
        varArg(arguments, this)
            .when('element', function(ele) {
                return ele;
            })
            .when('jquery', function(ele) {
                return ele;
            })
            .when('*', function(text) {
                return new Tag().text(String(text));
            })
            .invoke(function(tag) {
                this.sigil('.tags').append(tag);
            });
        return this;
    },
    removeTags: function() {
        var tags = this.tags.apply(this, arguments);
        _enum.pluck(tags, "&remove", true);
        return this;
    },
    tags: function() {
        var all = this.sigil('.tags').children(),
            va = varArg(arguments, this)
                .when(function() {
                    return all;
                })
                .when('string|regexp', function(pattern) {
                    return _enum.findAll(all, function(tag) {
                        return !!$(tag).text().match(pattern);
                    });
                })
                .when('int', function(i) {
                    return all.splice(i, 1);
                });
        return va.args();
    }
}).statics({});

function TagInput_initialize(self) {
    var prevNode = self.find('input')[0].previousSibling;
    if (prevNode.nodeType === 3) {
        if (prevNode.remove) {
            prevNode.remove();
        } else {
            prevNode.removeNode();
        }
    }
}