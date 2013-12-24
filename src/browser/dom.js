({
	description: "DOM Manipulation",
	namespace: $root.browser.dom,
	imports: {
		_type: $root.lang.type,
		_enum: $root.lang.enumerable
	},
	exports: [
	]
});

/**
 * create a script tag ready to attach to dom
 * @param  {String} src url of script
 * @param  {Function} cbk callback when script loaded or error occured
 * @param  {Object} opt {async,charset}
 * @return {Object}     {node,append,prepend}
 */
function script(src, cbk, opt){
	var tag = document.getElementsByTagName('head')[0] || document.documentElement,
		s = document.createElement('script'),
		loaded = false;

	function eventHandler(e){
		var state = this.readyState;
		if (!loaded && (!state || state == 'loaded' || state == 'complete')) {
			loaded = true;
			cbk && cbk(e);

			s.onload = s.onreadystatechange 
				= s.onerror 
				= null;
			tag.removeChild(s);
		}
	}

	s.src = src;
	s.async = opt.async || '';
	if(opt.charset) s.charset = opt.charset;
	s.onreadystatechange = s.onload = s.onerror = eventHandler;

	return {
		node: s,
		append: function(target){
			(target || tag).appendChild(s);
		},
		prepend: function(target){
			var where = target || tag;
			where.insertBefore(s, where.firstChild);
		}
	};
}

/**
 * create a stylesheet ready to attach to dom
 * @param  {String} href href of stylesheet
 * @return {Object}      {node,append,prepend}
 */
function stylesheet(href) {
	var tag = document.getElementsByTagName('head')[0] || document.documentElement,
		css = document.createElement('link');
	css.rel = 'stylesheet';
	css.type = 'text/css';
	css.href = href;

	return {
		node: css,
		append: function(target){
			(target || tag).appendChild(s);
		},
		prepend: function(target){
			var where = target || tag;
			where.insertBefore(s, where.firstChild);
		}
	};
}