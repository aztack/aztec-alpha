({
	description: 'Templating',
	namespace: $root.browser.template,
	imports: {
		_type: $root.lang.type,
		_str: $root.lang.string,
		_dom: $root.browser.dom,
		_$: jQuery,
		_hb: Handlebars
	},
	exports: [
		collect,
		set,
		get,
		id$
	]
});

//vars
var templates = {},
	XTEMPLATE_ID_ATTR = 'data-xtemplate',
	XTEMPLATE_ID_ATTR_SEL = '[data-xtemplate]';

//helper

//exports

function collect(force) {
	if (_type.isUndefined(force)) {
		force = false;
	}
	$(XTEMPLATE_ID_ATTR_SEL).each(function(i, ele) {
		var n = $(ele),
			data = n.attr(XTEMPLATE_ID_ATTR).split(','),
			id = data[0],
			html;
		if (n.tagName == 'SCRIPT') {
			html = n.text();
		} else {
			tmp = n.clone().removeAttr(XTEMPLATE_ID_ATTR);
			tmp = $('<div>').append(_dom.removeWhiteTextNode(tmp[0]));
			html = tmp.html();
		}
		if (data.length > 0 && data[1] == 'delete') {
			ele.parentNode.removeChild(ele);
		}
		if (_type.isUndefined(templates[id]) || force) {
			set(id, html);
		}
	});
}

function set(id, tpl) {
	if (id.indexOf(',') > 0) {
		id = id.split(',')[0];
	}
	templates[id] = tpl;
	return this;
}

function get(id) {
	return templates[id];
}

function id$(namespace) {
	return function(id) {
		return get(namespace + '.' + id);
	};
}

$(collect);