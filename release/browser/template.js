/**
 * ---
 * description: Templating
 * namespace: $root.browser.template
 * imports:
 *   _type: $root.lang.type
 *   _dom: $root.browser.dom
 *   $: jQuery
 * exports:
 * - collect
 * - set
 * - get
 * - id$
 * files:
 * - /browser/template.js
 */

;define('$root.browser.template',[
    '$root.lang.type',
    '$root.browser.dom',
    'jQuery'
], function (require, exports){
    //'use strict';
    var _type = require('$root.lang.type'),
        _dom = require('$root.browser.dom'),
        $ = require('jQuery');
    
        //vars
    var templates = {},
        XTEMPLATE_ID_ATTR = 'xtemplate',
        XTEMPLATE_ID_ATTR_SEL = '[xtemplate]',
        INTERNAL_ATTRS = [
            /(\s*)sigil-class=".*?"(\s*)/g,
            /(\s*)sigil=".*?"(\s*)/g
        ];
    
    //helper
    function stripAttr(matched, precedeSpace, succeedSpace) {
        return precedeSpace && succeedSpace ? ' ' : '';
    }
    
    //exports
    
    /**
     * collect
     * collect templates in current document
     * @param  {Boolean} force, set template string even if already set
     * @return {Undefined}
     */
    function collect(force) {
        if (_type.isUndefined(force)) {
            force = false;
        }
        $(XTEMPLATE_ID_ATTR_SEL).each(function(i, ele) {
            var n = $(ele),
                data = n.attr(XTEMPLATE_ID_ATTR).split(','),
                id = data[0],
                html;
            if (n.tagName == 'SCRIPT') {
                html = n.text();
            } else {
                tmp = n.clone().removeAttr(XTEMPLATE_ID_ATTR);
                tmp = $('<div>').append(_dom.removeWhiteTextNode(tmp[0]));
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
    $(collect);
    
    exports['collect'] = collect;
    exports['set'] = set;
    exports['get'] = get;
    exports['id$'] = id$;
    return exports;
});
//end of $root.browser.template
