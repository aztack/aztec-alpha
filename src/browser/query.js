({
    description: 'Query Selector',
    namespace: $root.browser.query,
    imports: {
        _type: $root.lang.type,
        _str: $root.lang.string,
        _ary: $root.lang.array
    },
    exports: [
        $,
        _querySelectorAll
    ]
});
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
    reCombinator = new RegExp('\\s*([' + '>+~`!@$%^&={}\\;</'.replace(/[-[\]{}()*+?.\\^$|,#\s]/g, "\\$&") + ']+)\\s*'),
    reCombinatorChildren = /(\S+)(\s+)(\S+)/;

function _matchCombinator(a) {
    var matched = false;
    a.selector = a.selector.replace(reCombinatorChildren, function(raw, before, comb, after) {
        if (comb) {
            matched = true;
            a.before = before;
            a.combinator = comb;
            a.after = after;
            return '';
        }
        return raw;
    });

    if (!matched) {
        a.selector = a.selector.replace(reCombinator, function(raw, before, comb, after) {
            if (comb) {
                matched = true;
                a.result = {
                    before: before,
                    combinator: comb,
                    after: after
                };
                return '';
            }
            return raw;
        });
    }
    return matched;
}

function _matchUniversalSelector(a) {
    var matched = false;
    a.selector = a.selector.replace(reUniversal, function(raw, star) {
        if (star) {
            matched = true;
            a.universal = true;
            return '';
        }
        return raw;
    });
    return matched;
}

function _matchTag(a) {
    var matched = false;
    a.selector = a.selector.replace(reTag, function(raw, tag) {
        if (tag) {
            matched = true;
            a.tag = tag;
            return '';
        }
        return raw;
    });
    return matched;
}

function _matchID(a) {
    var matched = false;
    a.selector = a.selector.replace(reID, function(raw, id) {
        if (id) {
            matched = true;
            a.id = id;
            return '';
        }
        return raw;
    });
    return matched;
}

function _matchClassName(a) {
    var matched = false;
    a.selector = a.selector.replace(reClassName, function(raw, className) {
        if (className) {
            matched = true;
            a.className = className;
            return '';
        }
        return raw;
    });
}

function _matchAttribute(a) {}

function _matchPesudoClass(a) {}



var Nodes = _type.create('Nodes', {

});

function _createElementFromHtml(html) {}

function _querySelectorAll(selector, parents) {
    var result = {
        original: selector,
        selector: selector,
        result: {}
    }, nodes = [], combinator;
    parents = parents || [document];

    if (_matchCombinator(result)) {
        combinator = result.combinator;
        if (combinator == ' ') {
            var before = _querySelectorAll(result.before, parents);
            return before ? _querySelectorAll(result.after, before) : undefined;
        } else if(combinator == '+') {

        } else if(combinator == '>') {
            
        }

    } else if (_matchUniversalSelector(result)) {

    } else if (_matchTag(result)) {
        nodes = callOnEachElement(parents, 'getElementsByTagName', [result.tag]);
    } else if (_matchID(result)) {
        nodes = callOnEachElement(parents, 'getElementById', [result.id]);
    } else if (_matchClassName(result)) {
        nodes = callOnEachElement(parents, 'getElementsByClassName', [result.className]);
    } else if (_matchAttribute(result)) {
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
                    //TODO
                    if (v.split('-').indexOf(value)) return this;
                    break;
                default:
                    return this;
            }
            return null;
        }, [result.attrName, result.attrValue, result.operator]);
    } else if (_matchPesudoClass(result)) {

    } else throw new Error('syntax error in selector:"' + selector + '"');
    return nodes;
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