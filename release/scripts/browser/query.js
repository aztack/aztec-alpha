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
 * - src/browser/query.js
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('browser/query',['lang/type','lang/string','lang/array'], factory);
    } else {
        var exports = $root._createNS('$root.browser.query');
        factory($root.lang.type,$root.lang.string,$root.lang.array,exports);
    }
}(this, function (_type,_str,_ary,exports) {
    //'use strict';
    exports = exports || {};
    
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
    var ele = document.createElement('div'), result;
    if (!_type.isFunction(ele.querySelectorAll)) {
        return false;
    }
    ele.innerHTML = '<div class="klass"></div>';
    result = ele.querySelectorAll('.klass').length === 1;
    ele = null;
    return result;
})();
///helper


var unicodeId = '(?:[:\\w\\u00a1-\\uFFFF-]|\\\\[^\\s0-9a-f])',
    reClassName = new RegExp('\\.(' + unicodeId + '+)'),
    reTag = new RegExp('(' + unicodeId + '+)'),
    reID = new RegExp('\\#(' + unicodeId + '+)'),
    reUniversal = /(\*)/,
    reCombinator = /\s*([>\+~`!@\$%\^&=\{\}\\;</]+)\s*/,
    reCombinatorChildren = /(\S+)(\s+)(\S+)/,
    reAttribute = /\[\s*((?:[:\w\u00a1-\uFFFF-]|\\[^\s0-9a-f])+)(?:\s*([*^$!~|]?=)(?:\s*(?:(["']?)(.*?)\3)))?\s*\](?!\])/,
    rePesudo = /:+((?:[\w\u00a1-\uFFFF-]|\\[^\s0-9a-f])+)(?:\((?:(["']?)((?:\([^\)]+\)|[^\(\)]*)+)\2)\))?/,
    reHtmlFragment = /^<.*>$/;

function _isHtmlFragment(str) {
    return !!str.match(reHtmlFragment);
}

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
    selector.replace(reUniversal, function(raw, star, pos, match) {
        if (star && pos === 0) {
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
    selector.replace(reTag, function(raw, tag, pos, match) {
        if (tag.indexOf('#') >= 0 || tag.indexOf('.') >= 0 || tag.indexOf(':') >= 0 || tag.indexOf('[') >= 0) return raw;
        if (tag && pos === 0) {
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
    selector.replace(reID, function(raw, id, pos, match) {
        if (id) {
            matched = true;
            a.id = id;
            if (pos !== 0) {
                a.tag = match.replace(raw, '');
            }
            return '';
        }
        return raw;
    });
    return matched ? a : matched;
}

function _matchClassName(selector) {
    var a = {}, matched = false;
    selector.replace(reClassName, function(raw, className, pos, match) {
        if (className) {
            matched = true;
            a.className = className;
            if (pos !== 0) {
                a.tag = match.replace(raw, '');
            }
            return '';
        }
        return raw;
    });
    return matched ? a : matched;
}

function _matchAttribute(selector) {
    var a = {}, matched = false;
    selector.replace(reAttribute, function(raw, name, operator, quote, value, pos, match) {
        if (name) {
            matched = true;
            a.attrName = name;
            a.operator = operator;
            a.attrValue = value;
            a.quote = quote;
            if (pos !== 0) {
                a.tag = match.replace(raw, '');
            }
            return '';
        }
        return raw;
    });
    return matched ? a : matched;
}

function _matchPesudoClass(selector) {
    var a = {}, matched = false;
    selector.replace(rePesudo, function(raw, name, quote, params, pos, match) {
        if (name) {
            matched = true;
            a.name = name;
            a.quote = quote;
            a.param = a.param;
            if (pos !== 0) {
                a.tag = match.replace(raw, '');
            }
            return '';
        }
        return raw;
    });
    return matched ? a : matched;
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
            nodes = before ? _querySelectorAll(result.after, before) : undefined;
            result.selector = result.selector.replace(result.before + combinator, '');
        } else if (combinator == '+') {

        } else if (combinator == '>') {

        }

    } else if (_matchUniversalSelector(selector, result)) {

    } else if (_matchTag(selector, result)) {
        nodes = callOnEachElement(parents, 'getElementsByTagName', [result.tag]);
        combinator = result.combinator || '';
        result.selector = result.selector.replace(result.tag + combinator, '');
    } else if (_matchID(selector, result)) {
        nodes = callOnEachElement(parents, 'getElementById', [result.id]);
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

    } else {
        throw new Error('syntax error in selector:"' + selector + '"');
    }

    if (!result.selector || result.selector.match(/^\s+$/)) {
        return nodes;
    } else {
        return _querySelectorAll(result.selector, nodes);
    }
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
        nodes = callOnEachElement(parents, 'getElementById', [res.id]);
        nodes = filterWithTagName(nodes, res.tag);
    } else if ((res = _matchClassName(selector))) {
        nodes = callOnEachElement(parents, 'getElementsByClassName', [res.className]);
        nodes = filterWithTagName(nodes, res.tag);
    } else if ((res = _matchAttribute(selector))) {
        nodes = callOnEachElement(parents, function(name, value, op) {
            var node = this,
                ret = [];
            traverseNode(node, function() {
                var v;
                if (!this.hasAttribute(name)) {
                    return null;
                }
                if (!op) {
                    ret.push(this);
                } else {
                    v = this.getAttribute(name);
                    switch (op) {
                        case '=':
                            if (v == value) ret.push(this);
                            break;
                        case "*=":
                            if (v.indexOf(value) >= 0) ret.push(this);
                            break;
                        case "~=":
                            if (v.split(' ').indexOf(value) >= 0) ret.push(this);
                            break;
                        case "|=":
                            if (v === value || v.indexOf(val + "-") === 0) ret.push(this);
                            break;
                        default:
                            ret.push(this);
                    }
                }
            });
            return ret;
        }, [res.attrName, res.attrValue, res.operator]);
        nodes = filterWithTagName(nodes, res.tag);
    } else if ((res = _matchPesudoClass(selector))) {
        nodes = callOnEachElement(parent, function() {

        });
        nodes = filterWithTagName(nodes, res.tag);
    }

    return recursive ? _querySelectorAll(selector, parents) : nodes;
}

function traverseNode(node, fn) {
    var t = node.childNodes,
        i = 0,
        len = t.length,
        ret;
    for (; i < len; i++) {
        if (t[i].nodeType == 1) {
            ret = fn.call(t[i]);
            r = traverseNode(t[i], fn);
            if (r && r.length > 0) {
                ret = ret.concat(r);
            }
        }
    }
    return ret;
}

function callOnEachElement(nodes, fn, args) {
    var ret, func = fn;
    if (_type.isString(fn)) {
        func = nodes[0][fn];
    }
    if (!func) {
        func = document[fn];
        nodes = [document];
    }
    if (nodes.length === 1) {
        ret = func.apply(nodes[0], args);
        return typeof ret.length == 'undefined' ? [ret] : ret;
    } else {
        ret = [];
        _ary.forEach(nodes, function(node) {
            var e = func.apply(node, args);
            if (e && e.length > 0) {
                _ary.forEach(e, function(a) {
                    if (ret.indexOf(a) >= 0) return;
                    ret.push(a);
                });
            }
        });
    }
    return ret;
}

function filterWithTagName(nodes, tag) {
    var ret;
    if (!tag) return nodes;
    ret = [];
    if (!nodes || nodes.length === 0) return ret;
    if (nodes.length === 1) {
        return nodes[0].tagName.toLowerCase() == tag ? nodes : ret;
    } else {
        _ary.forEach(nodes, function(node) {
            if (node.tagName.toLowerCase() == tag) ret.push(node);
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
            return nodeList;
        } else {
            return _querySelectorAll(arg, [parent]);
        }
    } else if (_type.isArrayLike(arg)) {
        return arg;
    }
}
///exports
    
    exports['$'] = $;
    exports['_querySelectorAll'] = _querySelectorAll;
    exports.__doc__ = "Query Selector";
    return exports;
}));
//end of $root.browser.query
