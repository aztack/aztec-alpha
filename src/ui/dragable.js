({
    description: 'Dragable',
    namespace: $root.ui.dragable,
    imports: {
        _type: $root.lang.type,
        _str: $root.lang.string
        //$: jQuery
    },
    exports: [
        dragable,
        Dragable
    ]
});

///vars


///helper


///impl


///exports
function dragable(jqobj) {
    var offsetParent = jqobj.offsetParent(),
        dragging = false,
        mousedownpos = {
            x: 0,
            y: 0
        };
    jqobj.on('mousedown', function(e) {
        dragging = true;
        //position relative to document
        var pos = jqobj.offset();
        mousedownpos.x = e.clientX - pos.left;
        mousedownpos.y = e.clientY - pos.top;
    }).on('mousemove', function(e) {
        if(!dragging) return;
        jqobj.offset({
            left: e.clientX - mousedownpos.x,
            top: e.clientY - mousedownpos.y
        });
    }).on('mouseup', function() {
        dragging = false;
    }).on('keyup', function() {
        dragging = false;
    });
}