({
    description: "DOM Manipulation",
    version: '0.0.1',
    namespace: $root.browser.dom,
    imports: {
        _type: $root.lang.type,
        _enum: $root.lang.enumerable,
        _str: $root.lang.string,
    },
    exports: [
        script,
        stylesheet,
        internalScript,
        internalStylesheet,
        removeWhiteTextNode,
        findOffsetParent
    ]
});

function ReadyToAttach(node, defaultParent) {
    return {
        node: node,
        append: function(target) {
            (target || defaultParent).appendChild(node);
        },
        prepend: function(target) {
            var where = target || defaultParent;
            where.insertBefore(node, where.firstChild);
        }
    };
}

/**
 * create a script tag ready to attach to dom
 * @param  {String} src url of script
 * @param  {Function} cbk callback when script loaded or error occured
 * @param  {Object} opt {async,charset,removeAfterLoaded}
 * @return {Object} {node,append,prepend}
 */
function script(src, cbk, opts) {
    var tag = document.getElementsByTagName('head')[0] || document.documentElement,
        s = document.createElement('script'),
        loaded = false;

    function eventHandler(e) {
        var state = this.readyState;
        if (!loaded && (!state || state == 'loaded' || state == 'complete')) {
            loaded = true;
            if (typeof cbk == 'undefined') cbk.call(this, e);

            s.onload = s.onreadystatechange = s.onerror = null;
            if(opts.removeAfterLoaded){
                tag.removeChild(s);
            }
        }
    }
    opts = opts || {};
    opts.removeAfterLoaded = opts.removeAfterLoaded || true;
    s.src = src;
    if (typeof opts.async == 'boolean') {
        s.async = opts.async;
    }
    if (opts.charset) s.charset = opts.charset;
    s.onreadystatechange = s.onload = s.onerror = eventHandler;

    return ReadyToAttach(s, tag);
}

/**
 * create a stylesheet ready to attach to dom
 * @param  {String} href href of stylesheet
 * @return {Object} {node,append,prepend}
 */
function stylesheet(href) {
    var tag = document.getElementsByTagName('head')[0] || document.documentElement,
        link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = href;

    return ReadyToAttach(link, tag);
}

/**
 * create a internal stylesheet ready to attach to dom
 * @param  {String} cssText
 * @return {Object} {node,append,prepend}
 */
function internalStylesheet(cssText) {
    var link = stylesheet(),
        node = link.node;
    if (node.styleSheet) {
        node.styleSheet.cssText = cssText;
    } else {
        node.appendChild(document.createTextNode(cssText));
    }
    return link;
}

/**
 * create a internal script tag ready to attach to dom
 * @param  {String} js javascript code
 * @return {Object} {node, append, prepend}
 */
function internalScript(js) {
    var tag = document.body,
        s = document.createElement('script');
    s.type = 'text/javascript';
    s.appendChild(document.createTextNode(js));
    return ReadyToAttach(s, tag);
}

function removeWhiteTextNode(node) {
    var child, next;
    if (!node) return;

    switch (node.nodeType) {
        case 3: //TextNode
            if (_str.isBlank(node.nodeValue)) {
                node.parentNode.removeChild(node);
            }
            break;
        case 1: // ElementNode
        case 9: // DocumentNode
            child = node.firstChild;
            while (child) {
                next = child.nextSibling;
                removeWhiteTextNode(next);
                child = next;
            }
            break;
    }
    return node;
}

function nodeName(node, expected) {
    return node && node.nodeName && node.nodeName.toLowerCase() == expected.toLowerCase();
}

function getStyle(node, prop, pseudo) {
    var style;
    if (_type.isUndefined(pseudo)) {
        pseudo = null;
    }
    if (node.currentStyle) {
        style = node.currentStyle;
    } else if (window.getComputedStyle) {
        style = document.defaultView.getComputedStyle(node, pseudo);
    }
    return ret.getPropertyValue(prop);
}

//TODO:test
function findOffsetParent(node) {
    var docEle = document.documentElement,
        offsetParent = node.offsetParent || docEle;
    while (offsetParent && nodeName(offsetParent, 'html') && getStyle(offsetParent, 'position') == 'static') {
        offsetParent = node.offsetParent;
    }
    return offsetParent || docEle;
}
