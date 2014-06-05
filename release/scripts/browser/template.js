/**
 * #Templating#
 * ==========
 * - Dependencies: `lang/type`,`jquery`
 * - Version: 0.0.1
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('browser/template', ['lang/type', 'jquery'], factory);
    } else if (typeof module === 'object') {
        var $root_lang_type = require('lang/type'),
            jquery = require('jquery');
        module.exports = factory($root_lang_type, jquery, exports, module, require);
    } else {
        var exports = $root._createNS('$root.browser.template');
        factory($root.lang.type, jQuery, exports);
    }
}(this, function(_type, $, exports) {
    'use strict';
    exports = exports || {};
    
    var templates = {},
        XTEMPLATE_ID_ATTR = 'xtemplate',
        XTEMPLATE_ID_ATTR_SEL = '[xtemplate]',
        INTERNAL_ATTRS = [
            /(\s*)sigil-class=".*?"(\s*)/g,
            /(\s*)sigil=".*?"(\s*)/g
        ];
    
    
    function stripAttr(matched, precedeSpace, succeedSpace) {
        return precedeSpace && succeedSpace ? ' ' : '';
    }
    
    function removeWhiteTextNode(node) {
        var child, next;
        if (!node) return;
    
        switch (node.nodeType) {
            case 3: //TextNode
                if (node.nodeValue && node.nodeValue.match(/^\s*$/)) {
                    node.parentNode.removeChild(node);
                }
                break;
            case 1: // ElementNode
            case 9: // DocumentNode
                child = node.firstChild;
                while (child) {
                    next = child.nextSibling;
                    removeWhiteTextNode(next);
                    child = next;
                }
                break;
        }
        return node;
    }
    
    
    /**
     * collect
     * collect templates in current document
     * @param  {Boolean} force, set template string even if already set
     * @return {Undefined}
     */
    function collect(force) {
        if (typeof force == 'undefined') force = false;
        
        $(XTEMPLATE_ID_ATTR_SEL).each(function(i, ele) {
            var n = $(ele),
                data = n.attr(XTEMPLATE_ID_ATTR).split(','),
                id = data[0],
                html;
            if (n.tagName == 'SCRIPT') {
                html = n.text();
            } else {
                tmp = n.clone().removeAttr(XTEMPLATE_ID_ATTR);
                tmp = $('<div>').append(removeWhiteTextNode(tmp[0]));
                html = tmp.html();
            }
            if (data.length > 0 && data[1] == 'delete') {
                ele.parentNode.removeChild(ele);
            }
    
            //remove internal attribute nodes
            var j = 0,
                len = INTERNAL_ATTRS.length;
            for (; j < len; ++j) {
                html = html.replace(INTERNAL_ATTRS[j], stripAttr);
            }
    
            if (_type.isUndefined(templates[id]) || force) {
                set(id, html);
            }
        });
    }
    
    /**
     * set
     * set template string for given id(full name)
     * @param {[type]} id  [description]
     * @param {[type]} tpl [description]
     */
    function set(id, tpl) {
        if (id.indexOf(',') > 0) {
            id = id.split(',')[0];
        }
        templates[id] = tpl;
        return this;
    }
    
    /**
     * get
     * get template string for given id(full name)
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    function get(id) {
        return templates[id];
    }
    
    /**
     * id$
     * return a function that return template string for given id(short name)
     * under given namespce
     * @param  {String} namespace, from which the template string will be retrieved
     * @return {String} template string
     */
    function id$(namespace) {
        return function(id) {
            return get(namespace + '.' + id);
        };
    }
    
    //collect template in current page when dom is ready
    //dynamic created template may not collected
    if($ || jQuery) {
        ($||jQuery)(collect);
    }
    
    exports['collect'] = collect;
    exports['set'] = set;
    exports['get'] = get;
    exports['id$'] = id$;
    exports.__doc__ = "Templating";
    exports.VERSION = '0.0.1';
    return exports;
}));
//end of $root.browser.template
