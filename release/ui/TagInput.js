/**
 * ---
 * description: TagInput
 * namespace: $root.ui.TagInput
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
 * - /ui/TagInput.js
 */

;define('$root.ui.TagInput',[
    '$root.lang.type',
    '$root.lang.string',
    '$root.browser.template',
    '$root.lang.enumerable',
    '$root.lang.fn',
    '$root.lang.arguments',
    'jQuery'
], function (require, exports){
    //'use strict';
    var _type = require('$root.lang.type'),
        _str = require('$root.lang.string'),
        _tpl = require('$root.browser.template'),
        _enum = require('$root.lang.enumerable'),
        _fn = require('$root.lang.fn'),
        _arguments = require('$root.lang.arguments'),
        $ = require('jQuery');
        
    ///xtemplate
    require('$root.browser.template')
            .set('$root.ui.TagInput.tag',"<div class=\"ui-taginput\" sigil=\".tag\">\n<span class=\"ui-taginput-tagtext\" sigil=\".text\"></span><a class=\"ui-taginput-button\" href=\"javascript:;\"></a>\n</div>\n")
            .set('$root.ui.TagInput.tags-and-input',"<div class=\"ui-taginput\">\n<div class=\"ui-taginput-tags\" sigil=\".tags\" comment=\"\"></div>\n<input type=\"text\" value=\"\">\n</div>\n");
        ///vars
    var tpl = _tpl.id$('$root.ui.TagInput'),
        tagInputTemplate = tpl('tags-and-input'),
        tagTemplate = tpl('tag'),
        varArg = _arguments.varArg;
    
    ///helper
    
    
    ///impl
    var Tag = _type.create('Tag', jQuery, {
        init: function(text) {
            this.super(tagTemplate);
        },
        text: function(val) {
            var ret = this.sigil('.text').text(val);
            return _type.isString(ret) ? ret : this;
        }
    });
    
    var TagInput = _type.create('TagInput', jQuery, {
        init: function(container, options) {
            this.super(container||tagInputTemplate);
            this.options = options;
            return TagInput_initialize(this);
        },
        appendTag: function(text, opts) {
            var tag = new Tag(text, opts);
            this.sigil('.tags').append(tag);
            return this;
        },
        removeTags: function(indexOrText) {
            var tags = _type.isEmpty(indexOrText) ? this.tags() : this.findTag(indexOrText);
            _enum.plunk(tags, "&remove", true);
            return this;
        },
        tags: function(){
            return this.sigil('.tags').children();
        },
        findTag: function(text) {
            return varArg(arguments, this)
                .when('string|regexp', function(pattern) {
                    return _enum.findAll(this.tags(), function(tag) {
                        return tag.getText().match(text);
                    });
                })
                .when('int', function(i) {
                    return this.tags().tags[i] || [];
                }).args();
        }
    }).statics({});
    
    function TagInput_initialize(self) {
    
    }
        
    ///sigils
    TagInput.sigils = {
        "length": 3,
        ".tag": ".ui-taginput",
        ".text": ".ui-taginput-tagtext",
        ".tags": ".ui-taginput-tags"
    };
    exports['Tag'] = Tag;
    exports['TagInput'] = TagInput;
    return exports;
});
//end of $root.ui.TagInput
