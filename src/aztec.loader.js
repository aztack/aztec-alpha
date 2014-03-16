({
	description: 'browser.dom.load()',
	version: '0.0.1',
	namespace: $root,
	priority: 2
});
define('$root.browser.dom', function(require, exports) {
	var win = window,
		doc = win.document,
		dummyScript = doc.createElement('script'),
		supportAsync = 'async' in dummyScript,
		supportReadyState = 'readyState' in dummyScript;

	function loadScript(src, opts) {
		var node = doc.createElement('script'),
			loaded = false,
			head = doc.head || doc.getElementsByTagName('head')[0];
		opts = opts || {};

		node.type = 'text/' + (opts.type || 'javascript');
		node.charset = opts.charset || 'utf-8';
		node.onload = node.onreadystatechange = function() {
			if (!loaded && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
				loaded = true;
				node.onload = node.onreadystatechange = null;
				if (typeof opts.callback == 'function') {
					opts.callback.call(node);
				}
				if (head && node.parentNode) {
					head.removeChild(node);
				}
			}
		};

		if (supportAsync) {
			//async=false: parellel downloading, execute in order, non-blocking
			node.async = false;
			node.src = src;
		} else if (supportReadyState) {
			node.src = src;
		} else {
			//defer=true: parellel downloading, execute in order, after dom ready
			node.defer = true;
			node.src = src;
		}
		head.insertBefore(node, head.lastChild);
	}

	function load() {
		var i = 0,
			args = Array.prototype.slice.call(arguments),
			len = args.length,
			callback,
			src;
		if (typeof args[len - 1] == 'function') {
			callback = args.pop();
		}
		if (arguments.length > 1) {
			for (; i < len; ++i) {
				src = '' + arguments[i];
				loadScript(src, {
					callback: callback
				});
			}
		} else if (len == 1) {
			if (arguments[0].splice) {
				load.call(exports, arguments[0]);
			} else if (typeof arguments[0] == 'string') {
				loadScript(arguments[0], {
					callback: callback
				});
			} else {
				throw Error('the only parameter is not an Array');
			}
		} else {
			throw Error('wrong argument list');
		}
	}

	exports.load = load;
	return exports;
});