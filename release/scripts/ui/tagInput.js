/**
 * ---
 * description: TagInput
 * namespace: $root.ui.tagInput
 * directory: ui/TagInput
 * imports:
 *   _type: $root.lang.type
 *   _str: $root.lang.string
 *   _tpl: $root.browser.template
 *   _enum: $root.lang.enumerable
 *   _fn: $root.lang.fn
 *   _arguments: $root.lang.arguments
 *   $: jQuery
 * exports:
 * - Tag
 * - TagInput
 * files:
 * - src/ui/TagInput/TagInput.js
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('ui/tagInput',['lang/type','lang/string','browser/template','lang/enumerable','lang/fn','lang/arguments','jQuery'], factory);
    } else {
        var exports = $root._createNS('$root.ui.tagInput');
        factory($root.lang.type,$root.lang.string,$root.browser.template,$root.lang.enumerable,$root.lang.fn,$root.lang.arguments,jQuery,exports);
    }
}(this, function (_type,_str,_tpl,_enum,_fn,_arguments,$,exports) {
    //'use strict';
    exports = exports || {};
    _tpl
        .set('$root.ui.TagInput.tag',"<div class=\"ui-taginput-tag\">\n<span class=\"ui-taginput-tagtext\"></span><a class=\"ui-taginput-button\" href=\"javascript:;\"></a>\n</div>\n")
        .set('$root.ui.TagInput.tags-and-input',"<div class=\"ui-taginput\">\n<div class=\"ui-taginput-tags\"></div>\n<input type=\"text\" value=\"\">\n</div>\n");
        ///vars
    var tpl = _tpl.id$('$root.ui.TagInput'),
        tagInputTemplate = tpl('tags-and-input'),
        tagTemplate = tpl('tag'),
        varArg = _arguments.varArg;
    
    var TagInput = _type.create('$root.ui.TagInput', jQuery, {
        init: function(container, options) {
            this.base(container || tagInputTemplate);
            this.options = options;
            this.$attr('input', this.find('input'));
            return TagInput_initialize(this);
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
    }).statics({
        Values: {
            InputChangeDelay: 400
        }
    }).events({
        OnInputChange: 'InputChange(event,text).TagInput',
        OnItemAdd: 'ItemAdded(event,item).TagInput',
        OnItemRemove: 'ItemRemoved(event,item).TagInput'
    });
    
    function TagInput_initialize(self) {
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
            }, TagInput.Values.InputChangeDelay);
        });
    }
        
    ///sigils
    if (!TagInput.Sigils) TagInput.Sigils = {};
    TagInput.Sigils[".text"] = ".ui-taginput-tagtext";
    TagInput.Sigils[".tag"] = ".ui-taginput-tag";
    TagInput.Sigils[".tags"] = ".ui-taginput-tags";

    //     exports['Tag'] = Tag;
    exports['TagInput'] = TagInput;
    exports.__doc__ = "TagInput";
    return exports;
}));
//end of $root.ui.tagInput
