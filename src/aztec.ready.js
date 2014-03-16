({
    description: 'browser.dom.ready, inspired by https://github.com/headjs/headjs',
    version: '0.0.1',
    namespace: $root,
    priority: 1
});
define('$root.browser.dom', function(require, exports) {
    var win = window,
        doc = win.document,
        domAlready = doc.readyState == 'complete',
        w3c = !! doc.addEventListener,
        ie = !w3c,
        timer,
        theDomIsReady = false,
        domReadyWaitter = [];

    /**
     * core algorithm, it's quit self-explanatory
     */
    if (domAlready) {
        /**
         * DOM already
         */
        onDomReady();
    } else if (w3c) {
        /**
         * W3C, the easiest way
         */
        doc.addEventListener("DOMContentLoaded", onDomContentLoad, false);

        // A fallback to window.onload, that will always work
        win.addEventListener("load", onDomReady, false);
    } else if (ie) {
        /**
         * IE, the tricky way
         */
        // Ensure firing before onload, maybe late but safe also for iframes
        doc.attachEvent("onreadystatechange", onDomContentLoad);
        win.attachEvent("onload", onDomReady);
        keepCheckUntilIEDomReady(onDomReady);
    }

    /**
     * remove event listener and then call `onDomReady`
     */
    function onDomContentLoad() {
        if (w3c) {
            doc.removeEventListener("DOMContentLoaded", onDomContentLoad, false);
        } else if (ie && doc.readyState === "complete") {
            doc.detachEvent("onreadystatechange", onDomContentLoad);
        }
        onDomReady();
    }

    /**
     * domready callback will be called in this function
     */
    function onDomReady() {
        // Make sure body exists, at least, in case IE gets a little overzealous (jQuery ticket #5443).
        if (!doc.body) {
            // let's not get nasty by setting a timeout too small.. (loop mania guaranteed if assets are queued)
            win.clearTimeout(timer);
            timer = win.setTimeout(onDomReady, 50);
            return;
        }
        //make sure only call once
        if (!theDomIsReady) {
            theDomIsReady = true;
            exports.isDomReady = true;
            var i = 0,
                len = domReadyWaitter.length,
                waiter;
            if (len === 0) return;
            for (; i < len; ++i) {
                waiter = domReadyWaitter[i];
                waiter.fn.call(waiter.context);
            }
        }
    }

    function keepCheckUntilIEDomReady(domReady) {
        var top = false;
        try {
            top = !win.frameElement && doc.documentElement;
        } catch (e) {}

        if (top && top.doScroll) {
            doScrollCheck();
        }

        function doScrollCheck() {
            if (!theDomIsReady) {
                try {
                    // Use the trick by Diego Perini
                    // http://javascript.nwbox.com/IEContentLoaded/
                    top.doScroll("left");
                } catch (e) {
                    win.clearTimeout(timer);
                    timer = win.setTimeout(doScrollCheck, 50);
                    return;
                }
                onDomReady();
            }
        }
    }

    function addWaiter(fn, context) {
        domReadyWaitter.push({
            context: context,
            fn: fn
        });
    }

    exports.isDomReady = false;
    exports.ready = function(fn, context) {
        context = context || win;
        if (theDomIsReady) {
            fn.call(context);
        } else {
            addWaiter(fn, context);
        }
    };
    return exports;
});