/**
 * ---
 * description: String Utils
 * version: 0.0.1
 * namespace: $root.lang.string
 * imports:
 *   _type: $root.lang.type
 * exports:
 * - toInt
 * - toFloat
 * - capitalize
 * - strip
 * - isBlank
 * - lstrip
 * - rstrip
 * - chomp
 * - chop
 * - reverse
 * - repeat
 * - startWith
 * - endWith
 * - quoted
 * - enclose
 * - quote
 * - toArray
 * - format
 * - isHtmlFragment
 * - toHash
 * files:
 * - src/lang/string.js
 */

;define('lang/string',[
    'lang/type'
], function (_type){
    //'use strict';
    var exports = {};
    
    // /exports

/**
 * toInt convert string s into integer. if it's not a string call it's toString
 * method
 *
 * @param {Any} s
 * @param {int} radix
 * @return {int}
 */
function toInt(self, radix) {
    return parseInt(self, radix || 10);
}

/**
 * toFloat convert string s into float. if it's not a string call it's toString
 * method
 *
 * @param {Any} s
 * @param {int} radix
 * @return {float}
 */
function toFloat(self, radix) {
    return parseFloat(self, radix || 10);
}

function capitalize(self) {
    return self.replace(/^([a-zA-Z])/, function(a, m, i) {
        return m.toUpperCase();
    });
}

function isBlank(self) {
    return !!self.match(/^\s*$/);
}

function lstrip(self) {
    return self.replace(/^\s+/, '');
}

function rstrip(self) {
    return self.replace(/\s+$/, '');
}

function strip(s) {
    return self.replace(/^\s+|\s+$/, '');
}

function chomp(self, sep) {
    if (typeof sep !== 'undefined') {
        return self.replace((new RegExp(sep + '$')), '');
    }
    return self.replace(/[\r\n]$/, '');
}

function chop(self) {
    if (typeof s == 'undefined' || isEmpty(s)) {
        return '';
    }
    var a = s.substr(s.length - 1),
        b = s.substr(s.length - 2);
    if (a === '\n' && b === '\r') {
        return a.substring(0, a.length - 2);
    }
    return a.substring(0, a.length - 1);
}

function reverse(self) {
    return self.split('').reverse.join('');
}

function repeat(self, n) {
    if (n <= 0) return '';
    else if (n === 1) return self;
    else if (n === 2) return self + self;
    else if (n > 2) return Array(n + 1).join(self);
}

var _trim = String.prototype.trim,
    strip = _trim ? function(self) {
        return _trim.call(self);
    } : function(self) {
        return self.replace(/^\s+|s+$/g, '');
    };

function startWith(self, prefix) {
    return self.substr(0, prefix.length) == prefix;
}

function endWith(self, suffix) {
    return self.substr(-suffix.length) == suffix;
}

function quoted(self) {
    if (!self) return false;
    var head = self.substr(0, 1),
        tail = self.substr(-1);
    return (head == '"' && tail == '"') || (head == "'" && tail == "'");
}

function enclose(self, chr) {
    return chr + self + chr;
}

function quote(self, q) {
    return enclose(self, !! q ? "'" : '"');
}

function toArray(self) {
    return [self];
}

// https://gist.github.com/aztack/9ac4033ac7ec54b6fdca
var format = (function() {
    // handle array arguments
    function a(w, m, args) {
        var x = args[+m];
        return typeof(x) == "function" ? x(m) : x;
    }

    // handle object arguments
    function o(w, m, args) {
        var fn = m,
            p = [],
            x = m.split(':'),
            ret;
        if (x.length == 2) {
            fn = x[0];
            p.push(x[1]);
        }
        var t = typeof(args[fn]);
        if (t == "function") {
            ret = args[fn].apply(undefined, p);
        } else if (args[fn] == null) {
            ret = w;
        } else {
            ret = String(args[fn]);
        }
        return ret;
    }

    return function(self, args) {
        var f = _type.isArray(args) ? a : o;
        return self.replace(/{([a-zA-Z0-9_$:.]+)}/g, function(w, m) {
            return f(w, m, args);
        });
    };
})();

function isHtmlFragment(self) {
    return typeof self == 'string' && self.charAt(0) === '<' && self.charAt(self.length - 1) === '>' && self.length >= 3;
}

var toHashRegexpCache = {
    '&=': /([^=&]+?)=([^&]*)/g,
    ',:': /([^:,]+?):([^,]*)/g
};

function toHash(self, pairSeparator, keyValueSeparator) {
    var result = {};
    if (!self) return result;

    pairSeparator = pairSeparator || '&';
    keyValueSeparator = keyValueSeparator || '=';

    var cacheKey = pairSeparator + keyValueSeparator,
        re = toHashRegexpCache[cacheKey],
        rId;
    if (!re) {
        rId = '[^' + cacheKey + ']';
        re = new RegExp('(' + rId + '+?)' + keyValueSeparator + '(' + rId + '*)', 'g');
        toHashRegexpCache[cacheKey] = re;
    }

    self.replace(re, function(_, key, value) {
        result[key] = value;
    });
    return result;
}
    
    exports['toInt'] = toInt;
    exports['toFloat'] = toFloat;
    exports['capitalize'] = capitalize;
    exports['strip'] = strip;
    exports['isBlank'] = isBlank;
    exports['lstrip'] = lstrip;
    exports['rstrip'] = rstrip;
    exports['chomp'] = chomp;
    exports['chop'] = chop;
    exports['reverse'] = reverse;
    exports['repeat'] = repeat;
    exports['startWith'] = startWith;
    exports['endWith'] = endWith;
    exports['quoted'] = quoted;
    exports['enclose'] = enclose;
    exports['quote'] = quote;
    exports['toArray'] = toArray;
    exports['format'] = format;
    exports['isHtmlFragment'] = isHtmlFragment;
    exports['toHash'] = toHash;
    exports.__doc__ = "String Utils";
    return exports;
});
//end of $root.lang.string
