({
    description: "Event Utils",
    version: '0.0.1',
    namespace: $root.browser.event,
    imports: {
        _type: $root.lang.type,
        _fn: $root.lang.fn
    },
    exports: [
        stopEvent
    ]
});

///exports

/**
 * pauseEvent
 * @param  {Event} e
 * @return {Boolean}
 */
function stopEvent(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
        e.preventDefault();
    } else {
        e.cancelBuble = true;
        e.returnValue = false;
    }
    return false;
}