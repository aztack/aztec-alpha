({
    description: "Array Utils",
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

var _forEach = Array.prototype.forEach,
    _slice = Array.prototype.slice,
    _indexOf = Array.prototype.indexOf;

/**
 * ##array.w(str)##
 * split given string with space
 * @param  {String} str [string]
 * @param  {String} sep  [separator]
 * @return {Array} array
 * 
 * ```javascript
 * array.w('a b c d') //=> ['a','b','c','d']
 * array.w('a,b,c,d',',') //=> ['a','b','c','d']
 * ```
 */
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
 * ##array.forEach(ary)##
 * iterate over given array
 * @param  {Array}   self
 * @param  {Function} fn
 * @return {Undefined} undefined
 *
 * ```javascript
 * array.forEach([1,2,3],function(value, index, ary){
 *     //...
 * });
 * ```
 */
var forEach = _forEach ? function(self, fn) {
    _forEach.call(self, fn);
} : function(self, fn) {
    var i = 0,
        len = ary.len,
        item;
    for (; i < len; ++i) {
        item = ary[i];
        fn.call(item, i, self);
    }
    return ary;
};

/**
 * ##array.indexOf(ary)##
 * find index of given parameter
 * @param  {Array} [ary array to be search]
 * @param  {Any} obj
 * @return {Integer} index
 *
 * ```javascript
 * var a = {}, b = 3, c = [1,a,b];
 * array.indexOf(c, a) => 1
 * array.indexOf(c, b) => 2
 * array.indexOf(c, {}) => -1
 * array.indexOf(c, 3) => 2
 * ```
 */
var indexOf = _indexOf ? function(self, obj) {
    return _indexOf.call(self, obj);
} : function(self, obj) {
    var i = 0,
        len = self.length;
    for (; i < len; ++i) {
        if (self[i] === obj) {
            return i;
        }
    }
    return -1;
};

/**
 * ##array.toArray(arraylike)##
 * convert array like object into an array
 * @param  {Any} arrayLike
 * @param  {int} start, where to start slice, included
 * @param  {int} end, where to end slice, not included
 * @return {Array} array
 *
 * ```javascript
 *  function f(){
 *      return array.toArray(arguments, 1, -1)
 *  }
 *  f(1,2,3) //=> [2]
 * ```
 */
function toArray(arrayLike, start, end) {
    // if arrayLike has a number value length property
    // then it can be sliced
    return _type.isNumber(arrayLike.length) ? _slice.call(arrayLike, start, end) : [];
}

/**
 * ##array.equal(a1,a2)##
 * return true if elements in two array loosely equal(==)
 * @param  {Array} a
 * @param  {Array} b
 * @return {Boolean} whether a equals b
 *
 * ```javascript
 * var x = 'a', a = [1,2, [3, x]], b = [1,2,[3,'a']], c = [1,2,[3,x]];
 * array.strictEqual(a,b) //=> true
 * array.strictEqual(a,c) //=> true
 * ```
 */
function equal(self, b) {
    var i = 0,
        len = self.length;
    if (len !== b.length) return false;
    for (; i < len; ++i) {
        if (self[i] == b[i]) {
            continue;
        } else if (_type.isArray(self[i]) && _type.isArray(b[i])) {
            if (!equal(self[i], b[i])) return false;
        } else {
            return false;
        }
    }
    return true;
}

/**
 * ##array.strictEqual(a1,a2)##
 * return true if elements in two array strictly equal(===)
 * @param  {Array} a
 * @param  {Array} b
 * @return {Boolean} whether a strictly equals b
 *
 * ```javascript
 * var x = 'a', a = [1,2, [3, x]], b = [1,2,[3,'a']], c = [1,2,[3,x]];
 * array.strictEqual(a,b) //=> false
 * array.strictEqual(a,c) //=> true
 * ```
 */
function strictEqual(self, b) {
    var i = 0,
        len = self.length;
    if (len !== b.length) return false;
    for (; i < len; ++i) {
        if (self[i] === b[i]) {
            continue;
        } else if (_type.isArray(self[i]) && _type.isArray(b[i])) {
            if (!strictEqual(self[i], b[i])) return false;
        } else {
            return false;
        }
    }
    return true;
}

/**
 * ##array.compact(ary)##
 * remove empty item(undefined,null, zero length array/object/string) from an array
 * @param  {Array} ary
 * @return {Array} array
 *
 * ```javascript
 * array.compact([0,undefined, null, 1]) //=> [0,1]
 * ```
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
 * ##array.flattern(ary)##
 * flatten given array into a one-dimension array
 * @param  {Array} ary
 * @return {Array} flattened array
 *
 * ```javascript
 * array.flatten([1,[2,[3]],4]) //=> [1,2,3,4]
 * ```
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

/**
 * ##array.fill(ary, value, start, end)##
 * fill given array from start to end with given v
 * @param  {String} self
 * @param  {Any} v
 * @param  {Integer} start
 * @param  {Integer} end
 * @return {Array} array
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill
 */
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

/**
 * ##array.fromRange(from,to)##
 * create an array from given range
 * @param  {Integer} from, lower bounds
 * @param  {Integer} to, upper bounds
 * @return {Array} array [from, to]
 *
 * ```javascript
 * array.fromRange(1,5) //=> [1,2,3,4,5]
 * ```
 */
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