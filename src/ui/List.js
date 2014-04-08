({
	description: 'List',
	namespace: $root.ui.list,
	imports: {
		_type: $root.lang.type,
		_fn: $root.lang.fn,
		$: jQuery
	},
	exports: [
		List
	]
});
/**
 * A Generic List, represents a unordered list
 */
var List = _type.create('$root.ui.List', jQuery, {
	add: function(arg) {
		var Item = this.itemType,
			item;
		if (Item) {
			item = _fn.applyNew(Item, arguments);
		} else {
			if (_str.isHtmlFragment(arg) || arg instanceof jQuery) {
				item = $(arg);
			} else {
				item = $(List.defaultItemTag).text(arg);
			}
		}
		this.append(item);
		return item;
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
			//throw Error('setItemType need a function as item constructor!');
		}
	}
}).statics({
	defaultItemTag: '<li>'
});