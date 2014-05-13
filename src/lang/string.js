({
    description: "String Utils",
    version: '0.0.1',
    namespace: $root.lang.string,
    imports: {
        _type: $root.lang.type
    },
    exports: [
        toInt,
        toFloat,
        capitalize,
        strip,
        isBlank,
        lstrip,
        rstrip,
        chomp,
        chop,
        reverse,
        repeat,
        startWith,
        endWith,
        quoted,
        enclose,
        quote,
        toArray,
        format,
        isHtmlFragment,
        toHash
    ]
});


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

var format = (function() {
    function postprocess(ret, a) {
        var align = parseInt(a.align),
            absAlign = Math.abs(a.align),
            result;

        if (absAlign === 0) {
            return ret;
        } else if (absAlign < ret.length) {
            return align > 0 ? ret.slice(0, absAlign) : ret.slice(-absAlign);
        } else {
            result = Array(absAlign - ret.length + 1).join(a.pad || format.DefaultPaddingChar);
            return align > 0 ? result + ret : ret + result;
        }
    }

    function tryget(o, path, v) {
        var parts = path.split('.'),
            part, len = parts.length;
        for (var t = o, i = 0; i < len; ++i) {
            part = parts[i];
            if (part in t) {
                t = t[parts[i]];
            } else {
                return v;
            }
        }
        return t;
    }

    function p(all) {
        var ret = {}, p1, p2, sep = format.DefaultFieldSeperator;
        p1 = all.indexOf(sep);
        if (p1 < 0) {
            ret.index = all;
        } else {
            ret.index = all.substr(0, p1);
            p2 = all.indexOf(sep, p1 + 1);
            if (p2 < 0) {
                ret.align = all.substring(p1 + 1, all.length);
            } else {
                ret.align = all.substring(p1 + 1, p2);
                ret.pad = all.substring(p2 + 1, all.length);
            }
        }
        return ret;
    }

    return function(self, args) {
        return self.replace(format.InterpolationPattern, function(all, m) {
            var a = p(m);
            ret = '' + tryget(args, a.index);
            if (ret == null) ret = a.index;
            return a.align == null && a.pad == null ? ret : postprocess(ret, a) || ret;
        });
    };
})();

format.DefaultPaddingChar = ' ';
format.DefaultFieldSeperator = ',';
format.InterpolationPattern = /\{(.*?)\}/g;

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