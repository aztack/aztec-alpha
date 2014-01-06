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
		idOf
	]
});

//vars
var templates = {},
    XTEMPLATE_ID_ATTR = 'data-xtemplate-id',
    XTEMPLATE_ID_ATTR_SEL = '[data-xtemplate-id]';

//helper

//exports
function collect(force) {
	if(_type.isUndefined(force)) {
		force = false;
	}
  $(XTEMPLATE_ID_ATTR_SEL).each(function(i, ele){
      var n = $(ele),
          id = n.attr(XTEMPLATE_ID_ATTR),
          html;
      n.removeAttr(XTEMPLATE_ID_ATTR);
      if (n.tagName == 'SCRIPT') {
        html = n.text();
      } else {
        tmp = $('<div>').append(_dom.removeWhiteTextNode(n.clone()));
        html = tmp.html();
      }
      if (_type.isUndefined(templates[id]) || force) {
        set(id, html);
      }
  });
}

function set(id, tpl) {
    templates[id] = tpl;
}

function get(id) {
    return templates[id];
}

function idOf(namespace) {
	return function(id){
		return get(namespace + '.' + id);
	};
}

$(collect);

