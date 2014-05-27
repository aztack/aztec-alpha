({
	description: 'List',
	namespace: $root.ui.list,
	imports: {
		_type: $root.lang.type,
		_fn: $root.lang.fn,
		_str: $root.lang.string,
		_arguments: $root.lang.arguments,
		$: jQuery
	},
	exports: [
		List
	]
});

var varArg = _arguments.varArg;
/**
 * A Generic List, represents a unordered list
 */
var List = _type.create('$root.ui.List', jQuery, {
	init: function() {
		varArg(arguments, this)
			.when(function() {
				return [null, null];
			})
			.when('{*}', function(opts) {
				return [null, opts];
			})
			.when('*', function(arg) {
				return [arg, null];
			})
			.when('*', '{*}', function(arg, opts) {
				return [arg, opts];
			})
			.invoke(function(arg, opts) {
				opts = List.options(opts || {});
				this.$attr('options', opts);
				this.base.call(this, arg || opts.containerTag);
				if (opts.containerClass) {
					this.addClass(opts.containerClass);
				}
			});
		return this;
	},
	insertAfter: function(arg, pos) {
		return List_insertX.call(this, arg, pos, true);
	},
	insertBefore: function(arg, pos) {
		return List_insertX.call(this, arg, pos, false);
	},
	add: function(arg, opts) {
		return this.insertAfter(arg, -1, opts);
	},
	remove: function(item) {
		$(item).remove();
		return this;
	},
	removeAt: function(index) {
		$(this.children().get(index)).remove();
		return this;
	},
	clear: function() {
		this.children().remove();
		return this;
	},
	getItemAt: function(index) {
		var item = this.children().get(index),
			Item = this.itemType;

		if (item) {
			return Item ? new Item(item) : item;
		}
	},
	indexOf: function(item) {
		return this.children().index(item);
	},
	setItemType: function(clazz) {
		if (_type.isFunction(clazz)) {
			this.itemType = clazz;
		} else {
			this.itemType = jQuery;
		}
	},
	items: function() {
		return this.children();
	}
}).options({
	containerTag: '<ul>',
	itemTag: '<li>',
	containerClass: '',
	itemClass: ''
});

function List_insertX(arg, pos, flag) {
	var Item = this.itemType,
		item, opts = this.options;
	if (Item) {
		item = _fn.applyNew(Item, arguments);
	} else {
		item = $(opts.itemTag);
		if (_str.isHtmlFragment(arg) || arg instanceof jQuery || arg.nodeType === 1) {
			item.append(arg);
		} else {
			item.text(arg);
		}
	}

	var children = this.children(),
		targetEle;
	if (children.length === 0) {
		this.append(item);
	} else {
		targetEle = children.slice(pos).first();
		if (flag === true) {
			item.insertAfter(targetEle);
		} else {
			item.insertBefore(targetEle);
		}
	}

	opts = opts || {};
	if (opts.itemClass) {
		item.addClass(opts.itemClass);
	}
	return item;
}