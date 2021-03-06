({
    description: 'TagInput',
    namespace: $root.ui.tagInput,
    directory: 'ui/TagInput',
    imports: {
        _type: $root.lang.type,
        _str: $root.lang.string,
        _tpl: $root.browser.template,
        _enum: $root.lang.enumerable,
        _fn: $root.lang.fn,
        _arguments: $root.lang.arguments,
        $: jquery
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

var TagInput = _type.create('$root.ui.TagInput', jQuery, {
    init: function(container, opts) {
        this.$attr('options', TagInput.options(opts || {}));
        this.base(container || tagInputTemplate);
        this.$attr('input', this.find('input'));
        TagInput_initialize(this, opts);
        return this;
    },
    appendTags: function(tag) {
        var self = this,
            tags = self.sigil('.tags');
        //TODO: 
        //varArg(arguments, this)
        //.when('array<*>')
        _enum.each(arguments, function(tag) {
            tags.append($(tagTemplate).text(tag));
        });
        return this;
    },
    removeTags: function() {
        var tags = this.tags.apply(this, arguments);
        this.trigger(TagInput.Events.OnItemRemove, [tags]);
        _enum.pluck(tags, "&remove", true);
        return this;
    },
    tags: function() {
        var all = this.sigil('.tags').children();
        return varArg(arguments, this)
            .when(function() {
                return all;
            })
            .when('function', function(fn) {
                return _enum.findAll(all, fn);
            })
            .when('string|regexp', function(pattern) {
                return _enum.findAll(all, function(tag) {
                    return !!$(tag).text().match(pattern);
                });
            })
            .when('int', function(i) {
                return all.splice(i, 1);
            }).resolve();
    },
    indexOf: function() {
        var all = this.tags(),
            sel = this.sigil('.tag', true);
        var result = varArg(arguments, this)
            .when('element', function(ele) {
                return [ele];
            })
            .when('jquery', function(jq) {
                return [jq[0]];
            }).invoke(function(ele) {
                var jq = $(ele),
                    e = jq.hasClass(sel) ? [ele] : jq.closest(sel)[0];
                return e ? all.indexOf(e) : -1;
            });
        return result;
    }
}).options({
    inputChangeDelay: 400
}).events({
    OnInputChange: 'InputChange(event,text).TagInput',
    OnEnterKeyUp: 'EnterKeyUp(event).TagInput',
    OnTabKeyUp: 'TabKeyUp(event).TagInput',
    OnItemAdd: 'ItemAdded(event,item).TagInput',
    OnItemRemove: 'ItemRemoved(event,item).TagInput'
});

function TagInput_initialize(self, opts) {
    var input = self.input,
        prevNode = input[0].previousSibling;
    if (prevNode.nodeType === 3) {
        if (prevNode.remove) {
            prevNode.remove();
        } else {
            prevNode.removeNode();
        }
    }
    var h;
    input.keyup(function(e) {
        var input = $(e.target),
            text = input.val();
        clearTimeout(h);
        h = setTimeout(function() {
            self.trigger(TagInput.Events.OnInputChange, [text]);
        }, opts.inputChangeDelay);
    });
}