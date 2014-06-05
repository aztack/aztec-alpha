/**
 * #Underscore Interface Implementation#
 * ===================================
 * - Dependencies: `lang/type`,`enuerable`,`lang/fn`
 * - Version: 0.0.1
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('lang/underscore', ['lang/type', 'enuerable', 'lang/fn'], factory);
    } else if (typeof module === 'object') {
        var $root_lang_type = require('lang/type'),
            $root_enuerable = require('enuerable'),
            $root_lang_fn = require('lang/fn');
        module.exports = factory($root_lang_type, $root_enuerable, $root_lang_fn, exports, module, require);
    } else {
        var exports = $root._createNS('$root.lang.underscore');
        factory($root.lang.type, $root.enuerable, $root.lang.fn, exports);
    }
}(this, function(_type, _enum, _fn, exports) {
    'use strict';
    exports = exports || {};
    
    
    
    //     exports['each'] = each;
//     exports['map'] = map;
//     exports['reduce'] = reduce;
//     exports['reduceRight'] = reduceRight;
//     exports['find'] = find;
//     exports['filter'] = filter;
//     exports['where'] = where;
//     exports['findWhere'] = findWhere;
//     exports['reject'] = reject;
//     exports['every'] = every;
//     exports['some'] = some;
//     exports['contains'] = contains;
//     exports['invoke'] = invoke;
//     exports['pluck'] = pluck;
//     exports['max'] = max;
//     exports['min'] = min;
//     exports['sortBy'] = sortBy;
//     exports['groupBy'] = groupBy;
//     exports['indexBy'] = indexBy;
//     exports['countBy'] = countBy;
//     exports['shuffle'] = shuffle;
//     exports['sample'] = sample;
//     exports['toArray'] = toArray;
//     exports['size'] = size;
//     exports['first'] = first;
//     exports['initial'] = initial;
//     exports['last'] = last;
//     exports['rest'] = rest;
//     exports['compact'] = compact;
//     exports['flatten'] = flatten;
//     exports['without'] = without;
//     exports['partition'] = partition;
//     exports['union'] = union;
//     exports['intersection'] = intersection;
//     exports['difference'] = difference;
//     exports['uniq'] = uniq;
//     exports['zip'] = zip;
//     exports['object'] = object;
//     exports['indexOf'] = indexOf;
//     exports['lastIndexOf'] = lastIndexOf;
//     exports['sortedIndex'] = sortedIndex;
//     exports['range'] = range;
//     exports['bind'] = bind;
//     exports['bindAll'] = bindAll;
//     exports['partial'] = partial;
//     exports['memoize'] = memoize;
//     exports['delay'] = delay;
//     exports['defer'] = defer;
//     exports['throttle'] = throttle;
//     exports['debounce'] = debounce;
//     exports['once'] = once;
//     exports['after'] = after;
//     exports['now'] = now;
//     exports['wrap'] = wrap;
//     exports['compose'] = compose;
//     exports['keys'] = keys;
//     exports['values'] = values;
//     exports['pairs'] = pairs;
//     exports['invert'] = invert;
//     exports['functions'] = functions;
//     exports['extend'] = extend;
//     exports['pick'] = pick;
//     exports['omit'] = omit;
//     exports['defaults'] = defaults;
//     exports['clone'] = clone;
//     exports['tap'] = tap;
//     exports['has'] = has;
//     exports['matches'] = matches;
//     exports['property'] = property;
//     exports['isEqual'] = isEqual;
//     exports['isEmpty'] = isEmpty;
//     exports['isElement'] = isElement;
//     exports['isArray'] = isArray;
//     exports['isObject'] = isObject;
//     exports['isArguments'] = isArguments;
//     exports['isFunction'] = isFunction;
//     exports['isString'] = isString;
//     exports['isNumber'] = isNumber;
//     exports['isFinite'] = isFinite;
//     exports['isBoolean'] = isBoolean;
//     exports['isDate'] = isDate;
//     exports['isRegExp'] = isRegExp;
//     exports['isNaN'] = isNaN;
//     exports['isNull'] = isNull;
//     exports['isUndefined'] = isUndefined;
//     exports['noConflict'] = noConflict;
//     exports['identity'] = identity;
//     exports['constant'] = constant;
//     exports['times'] = times;
//     exports['random'] = random;
//     exports['mixin'] = mixin;
//     exports['uniqueId'] = uniqueId;
//     exports['escape'] = escape;
//     exports['unescape'] = unescape;
//     exports['result'] = result;
//     exports['template'] = template;
//     exports['chain'] = chain;
//     exports['value'] = value;
    exports.__doc__ = "Underscore Interface Implementation";
    exports.VERSION = '0.0.1';
    return exports;
}));
//end of $root.lang.underscore
