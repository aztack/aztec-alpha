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

var _trim = String.prototype.trim;
/**
 * ##str.toInt(s)##
 * convert string s into integer.
 * @param {Any} s
 * @param {Integer} radix
 * @return {Integer} integer
 *
 * ```javascript
 * str.toInt('42') //=> 42
 * str.toInt('42xx') //=> 42
 * str.toInt('xx42') //=> NaN
 * ```
 */
function toInt(self, radix) {
    return parseInt(self, radix || 10);
}

/**
 * ##str.toFloat(s)##
 * convert string s into float.
 * @param {Any} s
 * @param {int} radix
 * @return {float}
 */
function toFloat(self, radix) {
    return parseFloat(self, radix || 10);
}

/**
 * ##str.capitalize(s)##
 * @param  {String} self
 * @return {String} capitalized string
 *
 * ```javascript
 * str.capitalize('javaScript') //=> JavaScript
 * ```
 */
function capitalize(self) {
    return self.replace(/^([a-zA-Z])/, function(a, m, i) {
        return m.toUpperCase();
    });
}

/**
 * ##str.isBlank(s)##
 * return true if given string is blank
 * @param  {String}  self
 * @return {Boolean} true|false
 *
 * ```javascript
 * str.isBlank(" ") //=> true
 * str.isBlank(" \t  ") //=> true
 * ```
 */
function isBlank(self) {
    return !!self.match(/^\s*$/);
}

/**
 * ##str.lstrip(s)##
 * remove leading whitespace in s
 * @param  {String} self
 * @return {String} string
 *
 * ```javascript
 * str.lstrip("  a ") //=> "a "
 * ```
 */
function lstrip(self) {
    return self.replace(/^\s+/, '');
}

/**
 * ##str.rstrip(s)##
 * remove trailing whitespace in s
 * @param  {String} self
 * @return {String} string
 *
 * ```javascript
 * str.rstrip("  a ") //=> "  a"
 * ```
 */
function rstrip(self) {
    return self.replace(/\s+$/, '');
}

/**
 * ##str.strip(s)##
 * remove leading and trailing whitespace in s
 * @param  {String} self
 * @return {String} string
 *
 * ```javascript
 * str.rstrip("  a ") //=> "a"
 * ```
 */
var strip = _trim ? function(self) {
    return _trim.call(self);
} : function(self) {
    return self.replace(/^\s+|s+$/g, '');
};

/**
 * ##str.chomp(s[,substr])##
 * remove trailing newline and carriage in s.
 * trailing substr will also be removed if given
 * @param  {String} self
 * @param  {String} substr
 * @return {String} string
 */
function chomp(self, substr) {
    if (typeof substr !== 'undefined') {
        return self.replace((new RegExp(substr + '$')), '');
    }
    return self.replace(/[\r\n]$/, '');
}

/**
 * ##str.chop(s)##
 * @param  {String} self
 * @return {String} string
 */
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

/**
 * ##str.reverse(s)##
 * reverse a string
 * @param  {String} self
 * @return {String} string
 */
function reverse(self) {
    return self.split('').reverse.join('');
}

/**
 * ##str.repeat(s,n)##
 * repeate s n times. if n is negative return empty string
 * @param  {String} self
 * @param  {Integer} n
 * @return {[type]} string
 *
 * ```javascript
 * str.repeat('-', 5) //=> '-----'
 * ```
 */
function repeat(self, n) {
    if (n <= 0) return '';
    else if (n === 1) return self;
    else if (n === 2) return self + self;
    else if (n > 2) return Array(n + 1).join(self);
}

/**
 * ##str.startWith(s, prefix)##
 * return true if s begin with prefix
 * @param  {String} self
 * @param  {String} prefix
 * @return {Boolean} true|false
 */
function startWith(self, prefix) {
    return self.substr(0, prefix.length) == prefix;
}


/**
 * ##str.endWith(s, suffix)##
 * return true if s end with suffix
 * @param  {String} self
 * @param  {String} suffix
 * @return {Boolean} true|false
 */
function endWith(self, suffix) {
    return self.substr(-suffix.length) == suffix;
}

/**
 * ##str.quoted(s)##
 * return true if s is quoted with " or '
 * @param  {String} self
 * @return {String} string
 *
 * ```javascript
 * str.quoted('"hello"') //=> true
 * ```
 */
function quoted(self) {
    if (!self) return false;
    var head = self.substr(0, 1),
        tail = self.substr(-1);
    return (head == '"' && tail == '"') || (head == "'" && tail == "'");
}

/**
 * ##str.enclose(s, chr)##
 * enclose s with chr
 * @param  {String} self
 * @param  {String} chr
 * @return {String} string   
 */
function enclose(self, chr) {
    return chr + self + chr;
}

/**
 * ##str.quote(s,isUseSingleQuote)##
 * quote s with 
 * @param  {String} self
 * @param  {Boolean} q, if true quote with ' otherwise with "
 * @return {String} string
 */
function quote(self, isUseSingleQuote) {
    return enclose(self, isUseSingleQuote ? "'" : '"');
}

/**
 * ##str.toArray(s)##
 * convert s into a array with every char in it as elements
 * @param  {String} self
 * @return {Array} array
 */
function toArray(self) {
    return self.split('');
}

/**
 * ##str.format(formatString, ...)##
 * @param {String} formatString
 * @return {String}
 *
 * ```javascript
 * //Simple
 * str.format('{0}',2014) //Error
 * str.format('{0}',[2014])
 * => 2014
 * 
 * str.format('{2}/{1}/{0}',[2014,6,3])
 * => "3/6/2014"
 * 
 * str.format('{2}/{1}/{0}',2014,6,3)
 * => "3/6/2014"
 * 
 * str.format("{year}-{month}-{date}",{year:2014,month:6,date:3})
 * => "2014-6-3"
 * 
 * //Advanced
 * str.format('{2,2,0}/{1,2,0}/{0}',[2014,6,3]);
 * => "03/06/2014"
 * 
 * str.format('{2,2,!}/{1,2,*}/{0}',[2014,6,3]);
 * => "!3/*6/2014"
 * 
 * str.format("{year}-{month,2,0}-{date,2,0}",{year:2014,month:6,date:3})
 * => "2014-06-03"
 *
 * str.format('{0,-5}',222014)
 * => "22014"
 *
 * format('{0,6,-}{1,3,-}','bar','')
 * => "---bar---"
 * ```
 */
var format = (function() {
    function postprocess(ret, a) {
        var align = parseInt(a.align),
            absAlign = Math.abs(a.align),
            result, retStr;

        if(ret == null) {
            retStr = '';
        } else if(typeof ret == 'number') {
            retStr = '' + ret;
        } else {
            throw new Error('Invalid argument type!');
        }

        if (absAlign === 0) {
            return ret;
        } else if (absAlign < retStr.length) {
            result = align > 0 ? retStr.slice(0, absAlign) : retStr.slice(-absAlign);
        } else {
            result = Array(absAlign - retStr.length + 1).join(a.pad || format.DefaultPaddingChar);
            result = align > 0 ? result + retStr : retStr + result;
        }
        return result;
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
        var ret = {},
            p1, p2, sep = format.DefaultFieldSeperator;
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
        return ret;//{index,pad,align}
    }

    return function(self, args) {
        var len = arguments.length;
        if (len > 2) {
            args = Array.prototype.slice.call(arguments, 1);
        } else if(len === 2 && !_type.isPlainObject(args)) {
            args = [args];
        } else if (len === 1) {
            return self;
        }
        return self.replace(format.InterpolationPattern, function(all, m) {
            var a = p(m),
                ret = tryget(args, a.index);
            if (ret == null) ret = a.index;
            return a.align == null && a.pad == null ? ret : postprocess(ret, a) || ret;
        });
    };
})();

format.DefaultPaddingChar = ' ';
format.DefaultFieldSeperator = ',';
format.InterpolationPattern = /\{(.*?)\}/g;

/**
 * ##str.isHtmlFragment(s)##
 * return true if s is a html fragment
 * @param  {String}  self
 * @return {Boolean} true|false
 *
 * ```javascript
 * str.isHtmlFragment('<>')
 * => false
 *
 * str.isHtmlFragment('<a>')
 * => true
 * ```
 */
function isHtmlFragment(self) {
    var s = String(self);
    return s.charAt(0) === '<' && s.charAt(self.length - 1) === '>' && s.length >= 3;
}

var toHashRegexpCache = {
    '&=': /([^=&]+?)=([^&]*)/g,
    ',:': /([^:,]+?):([^,]*)/g
};

/**
 * ##str.toHash(s [,pairSeparator, keyValueSeparator, start, end])##
 * convert a key-value string into an hash(Object)
 * @param  {String} self
 * @param  {String} pairSeparator
 * @param  {Object} keyValueSeparator
 * @param  {[type]} start
 * @param  {[type]} end
 * @return {Object} object
 *
 * ```javascript
 * str.toHash('uid=42&name=mike')
 * => {uid: "42", name: "mike"}
 *
 * str.toHash('?uid=42&name=mike', null, null, 1)
 * => {uid: "42", name: "mike"}
 *
 * str.toHash('{name:mike,age:28}',',',':',1,-1)
 * => {name: "mike", age: "28"}
 * ```
 */

function toHash(self, pairSeparator, keyValueSeparator, start, end) {
    var result = {}, s = self;
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
    s = self.slice(start || 0, end || self.length);
    s.replace(re, function(_, key, value) {
        result[key] = value;
    });
    return result;
}