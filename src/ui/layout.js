({
    description: 'Layout Utils',
    namespace: $root.ui.layout,
    imports: {
        _type: $root.lang.type,
        _fn: $root.lang.fn,
        _arguments: $root.lang.arguments,
        $: jquery,
        jqe: jQueryExt
    },
    exports: [
        below,
        above,
        Position
    ]
});

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