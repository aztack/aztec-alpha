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
        format
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
function toInt(s, radix) {
    if (!_type.isString(s)) {
        s = s.toString();
    }
    return parseInt(s, radix || 10);
}

/**
 * toFloat convert string s into float. if it's not a string call it's toString
 * method
 *
 * @param {Any} s
 * @param {int} radix
 * @return {float}
 */
function toFloat(s, radix) {
    if (!_type.isString(s)) {
        s = s.toString();
    }
    return parseFloat(s, radix || 10);
}

function capitalize(s) {
    return s.replace(/^([a-zA-Z])/, function(a, m, i) {
        return m.toUpperCase();
    });
}

function isBlank(s) {
    return s.match(/^\s*$/);
}

function lstrip(s) {
    return s.replace(/^\s+/, '');
}

function rstrip(s) {
    return s.replace(/\s+$/, '');
}

function strip(s) {
    return s.replace(/^\s+|\s+$/, '');
}

function chomp(s, sep) {
    if (typeof sep !== 'undefined') {
        return s.replace((new RegExp(sep + '$')), '');
    }
    return s.replace(/[\r\n]$/, '');
}

function chop(s) {
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

function reverse(s) {
    return s.split('').reverse.join('');
}

function repeat(s, n) {
    if (n <= 0) return '';
    else if (n === 1) return s;
    else if (n === 2) return s + s;
    else if (n > 2) return Array(n + 1).join(s);
}

var _trim = String.prototype.trim,
    strip = _trim ? function(s) {
        return _trim.call(s);
    } : function(s) {
        return s.replace(/^\s+|s+$/g, '');
    };

function startWith(s, prefix) {
    return s.substr(0, prefix.length) == prefix;
}

function endWith(s, suffix) {
    return s.substr(-suffix.length) == suffix;
}

function quoted(s) {
    if (!s) return false;
    var head = s.substr(0, 1),
        tail = s.substr(-1);
    return (head == '"' && tail == '"') || (head == "'" && tail == "'");
}

function enclose(s, chr) {
    var t = s;
    if (!_type.isString(s) &&_type.isFunction(s.toString)) {
        t = s.toString();
    }
    return chr + t + chr;
}

function quote(s, doubleQuote) {
    return enclose(s, !! doubleQuote ? '"' : "'");
}

function toArray(s) {
    return [s];
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
            x = m.split(':');
        if (x.length == 2){
            fn = x[0];
            p.push(x[1]);
        }
        var t = typeof(args[fn]);
        if (t == "function") {
            return args[fn].apply(undefined, p);
        } else if (t == "string" || t == "object") {
            return args[fn].toString();
        } else {
            return w;
        }
    }

    return function(fmt, args) {
        var f = _type.isArray(args) ? a : o,
            fmtstr = _type.isArray(fmt) ? fmt.join("") : fmt;
        return fmtstr.replace(/{([a-zA-Z0-9_$:.]+)}/g, function(w, m) {
            return f(w, m, args);
        });
    };
})();