/**
 * ---
 * description: Query Selector
 * namespace: $root.browser.query
 * imports:
 *   _type: $root.lang.type
 *   _str: $root.lang.string
 *   _ary: $root.lang.array
 * exports:
 * - $
 * - _querySelectorAll
 * files:
 * - /browser/query.js
 */

;define('$root.browser.query',['$root.lang.type','$root.lang.string','$root.lang.array'],function(require, exports){
    //'use strict';
    var _type = require('$root.lang.type'),
        _str = require('$root.lang.string'),
        _ary = require('$root.lang.array');
    
    /*
http://www.w3.org/TR/CSS2/grammar.html

ruleset
  : selector [ ',' S* selector ]*
    '{' S* declaration? [ ';' S* declaration? ]* '}' S*

selector
  : simple_selector [ combinator selector | S+ [ combinator? selector ]? ]?

simple_selector
  : element_name [ HASH | class | attrib | pseudo ]*
  | [ HASH | class | attrib | pseudo ]+

class
  : '.' IDENT

element_name
  : IDENT | '*'

attrib
  : '[' S* IDENT S* [ [ '=' | INCLUDES | DASHMATCH ] S*
    [ IDENT | STRING ] S* ]? ']'

pseudo
  : ':' IDENT

combinator
  : '+' S*
  | '>' S*
*/

///vars
var supportNativeQuerySelector = (function() {
    var ele = document.createElement('div');
    if (!_type.isFunction(ele.querySelectorAll)) {
        return false;
    }
    ele.innerHTML = '<div class="klass"></div>';
    return ele.querySelectorAll('.klass').length === 1;
})();
///helper

function _isHtmlFragment(str) {
    return false;
}

var unicodeId = '(?:[:\\w\\u00a1-\\uFFFF-]|\\\\[^\\s0-9a-f])',
    reClassName = new RegExp('\\.(' + unicodeId + ')+'),
    reTag = new RegExp('(' + unicodeId + '+)'),
    reID = new RegExp('\\#(' + unicodeId + '+)'),

    reUniversal = /(\*)/,
    reCombinator = /\s*([>\+~`!@\$%\^&=\{\}\\;</]+)\s*/,
    reCombinatorChildren = /(\S+)(\s+)(\S+)/,
    reAttribute = /\[\s*((?:[:\w\u00a1-\uFFFF-]|\\[^\s0-9a-f])+)(?:\s*([*^$!~|]?=)(?:\s*(?:(["']?)(.*?)\3)))?\s*\](?!\])/,
    rePesudo = /a/;

function _matchCombinator(selector) {
    var a = {}, matched = false;
    selector.replace(reCombinatorChildren, function(raw, before, comb, after) {
        if (comb) {
            matched = true;
            a.before = before;
            a.combinator = comb;
            a.after = after;
            return after;
        }
        return raw;
    });

    if (!matched) {
        selector.replace(reCombinator, function(raw, before, comb, after) {
            if (comb) {
                a.before = before;
                a.combinator = comb;
                a.after = after;
                return after;
            }
            return raw;
        });
    }
    return matched ? a : matched;
}

function _matchUniversalSelector(selector) {
    var a = {}, matched = false;
    selector.replace(reUniversal, function(raw, star) {
        if (star) {
            matched = true;
            a.universal = true;
            return '';
        }
        return raw;
    });
    return matched ? a : matched;
}

function _matchTag(selector) {
    var a = {}, matched = false;
    selector.replace(reTag, function(raw, tag) {
        if (tag) {
            matched = true;
            a.tag = tag;
            return '';
        }
        return raw;
    });
    return matched ? a : matched;
}

function _matchID(selector) {
    var a = {}, matched = false;
    selector.replace(reID, function(raw, id) {
        if (id) {
            matched = true;
            a.id = id;
            return '';
        }
        return raw;
    });
    return matched ? a : matched;
}

function _matchClassName(selector) {
    var a = {}, matched = false;
    selector.replace(reClassName, function(raw, className) {
        if (className) {
            matched = true;
            a.className = className;
            return '';
        }
        return raw;
    });
    return matched ? a : matched;
}

function _matchAttribute(selector) {
    var a = {}, matched = false;
    selector.replace(reAttribute, function(raw, name, operator, quote, value) {
        if (name && operator) {
            matched = true;
            a.attrName = name;
            a.operator = operator;
            a.attrValue = value;
            a.quote = quote;
            return '';
        }
        return raw;
    });
    return matched ? a : matched;
}

function _matchPesudoClass(selector) {
    var a = {}, matched = false;
}



var Nodes = _type.create('Nodes', {

});

function _createElementFromHtml(html) {}

var result = null;

function _querySelectorAll0(selector, parents) {
    var nodes = [],
        combinator;

    selector = selector.replace(/^\s+/, '');
    if (result === null) result = {
        original: selector,
        selector: selector
    };

    if (!selector || selector.match(/^\s+$/)) {
        return parents;
    }
    parents = parents || [document];

    if (_matchCombinator(selector, result)) {
        combinator = result.combinator;
        var before = _querySelectorAll(result.before, parents);
        if (combinator == ' ') {
            nodes = (before && before.length > 0) ? _querySelectorAll(result.after, before) : undefined;
            result.selector = result.selector.replace(result.before + combinator, '');
        } else if (combinator == '+') {

        } else if (combinator == '>') {

        }

    } else if (_matchUniversalSelector(selector, result)) {

    } else if (_matchID(selector, result)) {
        nodes = callOnEachElement(parents, 'getElementById', [result.id]);
    } else if (_matchTag(selector, result)) {
        nodes = callOnEachElement(parents, 'getElementsByTagName', [result.tag]);
        combinator = result.combinator || '';
        result.selector = result.selector.replace(result.tag + combinator, '');
    } else if (_matchClassName(selector, result)) {
        nodes = callOnEachElement(parents, 'getElementsByClassName', [result.className]);
    } else if (_matchAttribute(selector, result)) {
        nodes = callOnEachElement(parents, function(name, value, op) {
            var v;
            if (!this.hasAttribute(name)) {
                return null;
            }
            v = this.getAttribute(name);
            switch (op) {
                case "*=":
                    if (v.indexOf(value)) return this;
                    break;
                case "~=":
                    if (v.split(' ').indexOf(value)) return this;
                    break;
                case "|=":
                    if (v === value || v.indexOf(val + "-") === 0) return this;
                    break;
                default:
                    return this;
            }
            return null;
        }, [result.attrName, result.attrValue, result.operator]);
    } else if (_matchPesudoClass(selector, result)) {

    } else throw new Error('syntax error in selector:"' + selector + '"');

    return _querySelectorAll(result.selector, nodes);
}

function _querySelectorAll(selector, parents) {
    var nodes = [],
        res, comb, before, recursive = false;

    parents = parents || [document];

    if ((res = _matchCombinator(selector))) {
        comb = res.combinator;
        before = _querySelectorAll(res.before, parents);
        if (!before) return null;
        if (comb == ' ') {
            selector = selector.replace(res.before + comb, '');
            parents = before;
            recursive = true;
        } else if (comb == '+') {

        } else if (comb == '>') {

        }
    } else if ((res = _matchUniversalSelector(selector))) {

    } else if ((res = _matchTag(selector))) {
        nodes = callOnEachElement(parents, 'getElementsByTagName', [res.tag]);
        selector = selector.replace(res.tag, '');
    } else if ((res = _matchID(selector))) {
        nodes = callOnEachElement(parents, 'getElementById', [res.tag]);
    } else if ((res = _matchClassName()(selector))) {
        nodes = callOnEachElement(parents, 'getElementsByClassName', [res.tag]);
    } else if ((res = _matchAttribute(selector))) {
        nodes = callOnEachElement(parents, function(name, value, op) {
            var v;
            if (!this.hasAttribute(name)) {
                return null;
            }
            v = this.getAttribute(name);
            switch (op) {
                case "*=":
                    if (v.indexOf(value)) return this;
                    break;
                case "~=":
                    if (v.split(' ').indexOf(value)) return this;
                    break;
                case "|=":
                    if (v === value || v.indexOf(val + "-") === 0) return this;
                    break;
                default:
                    return this;
            }
            return null;
        }, [result.attrName, result.attrValue, result.operator]);
    } else if ((res = _matchPesudoClass(selector))) {

    }

    return recursive ? _querySelectorAll(selector, parents) : nodes;
}

function callOnEachElement(nodes, fn, args) {
    var ret, func;
    if (_type.isString(fn)) {
        func = nodes[0][fn];
    }
    if (nodes.length === 1) {
        return func.apply(nodes[0], args);
    } else {
        _ary.forEach(nodes, function(node) {
            var e = func.apply(node, args);
            if (e) ret.concat(e);
        });
    }
    return ret;
}


function $(arg, parent) {
    var nodeList;
    if (_type.isEmpty(parent)) {
        parent = document;
    }
    if (_type.isString(arg)) {
        if (_isHtmlFragment(arg)) {
            return _createElementFromHtml(arg);
        } else if (supportNativeQuerySelector) {
            nodeList = parent.querySelectorAll(arg);
            return new Nodes(nodeList);
        } else {
            return _querySelectorAll(arg, parent);
        }
    } else if (_type.isArrayLike(arg)) {
        return new Nodes(arg);
    }
}
///exports
    exports['$'] = $;
    exports['_querySelectorAll'] = _querySelectorAll;
    return exports;
});
//end of $root.browser.query
