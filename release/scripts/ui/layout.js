/**
 * #Layout Utils#
 * ============
 * - Dependencies: `lang/type`,`lang/fn`,`lang/arguments`,`jquery`,`jQueryExt`
 * - Version: 0.0.1
 */

(function(global, factory) {
    if (typeof define === 'function' && define.amd) {
        define('ui/layout', ['lang/type', 'lang/fn', 'lang/arguments', 'jquery', 'jQueryExt'], factory);
    } else {
        var $root = global.$root,
            exports = $root._createNS('$root.ui.layout');
        factory($root.lang.type, $root.lang.fn, $root.lang.arguments, jQuery, jQueryExt, exports);
    }
}(this, function(_type, _fn, _arguments, $, jqe, exports) {
    'use strict';
    exports = exports || {};
    
    var Position = {
        Below: 'below',
        Above: 'above'
    };
    
    function getMetrics(ele, target, flag) {
        var ret = {};
        if (flag & 1) {
            ret.th = target.height();
            ret.tw = target.width();
        }
        if (flag & 2) {
            ret.eh = ele.height();
            ret.ew = ele.width();
        };
        return ret;
    }
    
    function below(ele, target, opts) {
        if (!ele || !target) return;
        ele = $(ele);
        target = $(target);
        opts = opts || {};
    
        var pos = target.offset(),
            m = getMetrics(ele, target, 3),
            x, y;
    
        y = pos.top + m.th;
        if(opts.alignLeft) {
            x = pos.left;
        } else if(opts.alignRight) {
            x = pos.left + m.tw;
        } else {
            x = pos.left - (m.ew - m.tw) / 2;
        }
        if (opts) {
            if (typeof opts.x == 'number') {
                x += opts.x;
            }
            if (typeof opts.y == 'number') {
                y += opts.y;
            }
        }
        return ele.css({
            left: x,
            top: y
        });
    }
    
    function above(ele, target, opts) {
        if (!ele || !target) return;
        ele = $(ele);
        target = $(target);
        opts = opts || {};
    
        var pos = target.offset(),
            m = getMetrics(ele, target, 3),
            x, y;
    
        y = pos.top - m.eh;
        if(opts.alignLeft) {
            x = pos.left;
        } else if(opts.alignRight) {
            x = pos.left + m.tw;
        } else {
            x = pos.left - (m.ew - m.tw) / 2;
        }
        if (opts) {
            if (typeof opts.x == 'number') {
                x += opts.x;
            }
            if (typeof opts.y == 'number') {
                y += opts.y;
            }
        }
        return ele.css({
            left: x,
            top: y
        });
    }
    
    exports['below'] = below;
    exports['above'] = above;
    exports['Position'] = Position;
    exports.__doc__ = "Layout Utils";
    exports.VERSION = '0.0.1';
    return exports;
}));
//end of $root.ui.layout
