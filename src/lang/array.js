({
    description: "Ruby String like string module",
    version: '0.0.1',
    namespace: $root.lang.array,
    imports: {
        _type: $root.lang.type,
        _fn: $root.lang.fn
    },
    exports: [
        w,
        forEach,
        indexOf,
        toArray,
        equal,
        strictEqual,
        compact,
        flatten,
        fill,
        fromRange
    ]
});

///imports
var _forEach = Array.prototype.forEach,
    _slice = Array.prototype.slice,
    _indexOf = Array.prototype.indexOf;

///exports

var w = function(self, sep) {
    if (!self || self.length === 0) {
        return [];
    }
    var s = self;
    if (typeof self !== 'string') {
        s = '' + self;
    }
    return s.split(sep || /[\s\n\t]+/);
};

/**
 * forEach
 * @param  {[type]}   ary
 * @param  {Function} fn
 * @return {Array}
 */
var forEach = _forEach ? function(self, fn) {
    _forEach.call(self, fn);
} : function(self, fn) {
    var i = 0,
        len = ary.len,
        item;
    for (; i < len; ++i) {
        item = ary[i];
        fn(item, i);
    }
    return ary;
};

/**
 * indexOf
 * @param  {Array} ary
 * @param  {Any} obj
 * @return {Integer}
 */
var indexOf = _indexOf ? function(self, obj) {
    return _indexOf.call(self, obj);
} : function(self, obj) {
    var i = 0,
        len = self.length;
    for (; i < len; ++i) {
        if (self[i] == obj) {
            return i;
        }
    }
    return -1;
};

/**
 * toArray
 * convert array like object into an array
 * @param  {Any} arrayLike
 * @param  {int} start, where to start slice, included
 * @param  {int} end, where to end slice, not included
 * @return {Array}
 */
function toArray(arrayLike, start, end) {
    // if arrayLike has a number value length property
    // then it can be sliced
    return _type.isNumber(arrayLike.length) ? _slice.call(arrayLike, start, end) : [];
}

/**
 * equal
 * @param  {Array} a
 * @param  {Array} b
 * @return {Boolean}
 */
function equal(self, b) {
    var i = 0,
        len = self.length;
    if (len !== b.length) return false;
    for (; i < len; ++i) {
        if (self[i] == b[i]) {
            continue;
        } else if (_type.isArray(self[i], b[i])) {
            if (!equal(self[i], b[i])) return false;
        } else {
            return false;
        }
    }
    return true;
}

/**
 * strictEqual
 * @param  {Array} a
 * @param  {Array} b
 * @return {Boolean}
 */
function strictEqual(self, b) {
    var i = 0,
        len = self.length;
    if (len !== b.length) return false;
    for (; i < len; ++i) {
        if (self[i] === b[i]) {
            continue;
        } else if (_type.isArray(self[i], b[i])) {
            if (!strictEqual(self[i], b[i])) return false;
        } else {
            return false;
        }
    }
    return true;
}

/**
 * compact
 * remove empty item(undefined,null, zero length array/object/string, 0) from an array
 * @param  {Array} ary
 * @return {Array}
 */
function compact(self) {
    var ret = [];
    if (!_type.isArrayLike(self)) return ret;
    var i = 0,
        len = self.length;
    for (; i < len; ++i) {
        if (_type.isEmpty(self[i])) continue;
        ret.push(self[i]);
    }
    return ret;
}

/**
 * flatten an array into a one-dimension array
 * @param  {Array} ary
 * @return {Array}
 */
function flatten(self) {
    if (!_type.isArray(self)) return [self];
    var i = 0,
        obj,
        len = self.length,
        r, ret = [];
    for (; i < len; ++i) {
        obj = self[i];
        if (_type.isArray(obj)) {
            r = flatten(obj);
            ret = ret.concat(r);
        } else {
            ret.push(obj);
        }
    }
    return ret;
}

function fill(self, v, start, end) {
    var len = self.length,
        start_i = start == null ? 0 : +start,
        end_i = len;
    if (typeof end != 'undefined') end_i = +end;
    if (start_i < 0) {
        start_i += len;
        if (start_i < 0) start_i = 0;
    } else {
        if (start_i > len) start_i = len;
    }

    if (end_i < 0) {
        end_i += len;
        if (end_i < 0) end_i = 0;
    } else {
        if (end_i > len) end_i = len;
    }
    for (var i = start_i; i < end_i; ++i) {
        self[i] = v;
    }
    return self;
}

function fromRange(from, to) {
    var ret = [],
        i, a, b,
        len = arguments.length;
    if (len === 0) {
        return ret;
    } else if (len === 1) {
        return [from];
    } else if (len >= 2) {
        a = Math.min(from, to),
        b = Math.max(from, to);
        for (i = a; i <= b; ++i) {
            ret.push(i);
        }
    }
    return ret;
}