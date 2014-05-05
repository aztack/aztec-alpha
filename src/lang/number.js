({
    description: 'Number Utils',
    namespace: $root.lang.number,
    imports: {
        _type: $root.lang.type
    },
    exports: [
        random,
        max,
        min,
        confined
    ]
});

//vars
var rand$ = Math.random,
    floor$ = Math.floor,
    max$ = Math.max,
    min$ = Math.min;

//helper


//impl

//exports
function random(min, max) {
    var argLen = arguments.length,
        rn;
    if (argLen === 2) {
        return floor(rand$() * (max - min + 1)) + min;
    } else if (argLen === 1) {
        max = min;
        return floor(rand$() * (max + 1));
    } else {
        return floor(rand$());
    }
}

/**
 * max
 * return maximum value
 * @return {Any}
 * @remark
 *  max([1,2,3]) == 3
 *  max(1,2,3) == 3
 */
function max() {
    var arg = arguments[0],
        len = arguments.length,
        a, b;
    if (len === 1 && _type.isArray(arg)) {
        return max$.apply(Math, arg);
    } else if (len === 2) {
        a = arguments[0];
        b = arguments[1];
        return a > b ? a : b;
    } else {
        return max$.apply(Math, arguments);
    }
}

/**
 * min
 * return minimum value
 * @return {Any}
 * @remark
 *  min([1,2,3]) == 1
 *  min(1,2,3) == 1
 */
function min() {
    var arg = arguments[0],
        len = arguments.length,
        a, b;
    if (len === 1 && _type.isArray(arg)) {
        return min$.apply(Math, arg);
    } else if (len === 2) {
        a = arguments[0];
        b = arguments[1];
        return a < b ? a : b;
    } else {
        return min$.apply(Math, arguments);
    }
}

/**
 * confined
 * input number will be confined between [min, max]
 * @param  {int} self, input
 * @param  {int} min
 * @param  {int}} max
 * @param  {bool} cycle, e.g. if input equal max + 2, output will be min+1 rather than max
 * @return {int}
 */
function confined(self, mi, ma, cycle) {
    var dis, min = Math.min(mi, ma),
        max = Math.max(mi, ma);
    if (isNaN(self) || !isFinite(self) || min == max) return min;
    if (cycle) {
        if (self >= min && self <= max) return self;
        dis = Math.abs(max - min) + 1;
        if (self < min) {
            return max - (Math.abs(min - self - 1) % dis);
        } else /* (self > max) */ {
            return min + (Math.abs(self - max - 1) % dis);
        }
    } else {
        if (self >= max) {
            return max;
        } else if (self <= min) {
            return min;
        } else return self;
    }
}