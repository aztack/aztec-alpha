({
    description: 'Query Selector',
    namespace: $root.browser.query,
    imports: {
        _type: $root.lang.type,
        _str: $root.lang.string,
        _ary: $root.lang.array
    },
    exports: [
        $
    ]
});

///vars
var supportNativeQuerySelector = _type.isFunction(document.querySelectorAll);
///helper

function _isHtmlFragment(str) {
    return false;
}

var unicodeId = '(?:[:\\w\\u00a1-\\uFFFF-]|\\\\[^\\s0-9a-f])',
    reClassName = new RegExp('\\.(' + unicodeId + ')+'),
    reTag = new RegExp('(' + unicodeId + '+)'),
    reID = new RegExp('\\#(' + unicodeId + '+)'),
    reCombinator = new RegExp('\\s*([' + '>+~`!@$%^&={}\\;</'.replace(/[-[\]{}()*+?.\\^$|,#\s]/g, "\\$&") + ']+)\\s*'),
    reCombinatorChildren = /(\s+)/;

function _matchCombinator(a) {}

function _matchCombinatorChildren(a) {}

function _matchUniversalSelector(a) {}

function _matchTag(a) {
    var matched = false;
    a.selector = a.selector.replace(reTag, function(raw, tag) {
        if(tag) {
            matched = true;
            a.result.tag = tag;
        }
        return '';
    });
    return matched;
}

function _matchID(a) {
    var matched = false;
    a.selector = a.selector.replace(reID,function(raw, id){
        if(id) {
            matched = true;
            a.result.id = id;
        }
    });
    return matched;
}

function _matchClassName(a) {}

function _matchAttribute(a) {}

function _matchPesudoClass(a) {}



var Nodes = _type.create('Nodes', {

});

function _createElementFromHtml(html) {}

function _querySelectorAll(selector, parent) {
    var result = {
        original: selector,
        selector: selector,
        result: {}
    }, nodes = [];
    if (_matchTag(result)) {

    } else if (_matchID(result)) {

    } else if (_matchClassName(result)) {

    } else if (_matchAttribute(result)) {

    } else if (_matchAttribute(result)) {

    } else if (_matchPesudoClass(result)) {

    } else if (_matchCombinator(result)) {

    } else if (_matchCombinatorChildren(result)) {

    } else if (_matchUniversalSelector) {

    } else {
        throw new Error('syntax error in selector:"'+ selector + '"');
    }
    return new Nodes(nodes);
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