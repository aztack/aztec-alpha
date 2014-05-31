({
	description: 'Trackbar',
	namespace: $root.ui.trackbar,
	directory: 'ui/Trackbar',
	imports: {
		_type: $root.lang.type,
		_arguments: $root.lang.arguments,
		_number: $root.lang.number,
		_enum: $root.lang.enumerable,
		_str: $root.lang.string,
		_drag: $root.ui.draggable,
		$: jQuery
	},
	exports: [Trackbar]
});

var varArg = _arguments.varArg,
	tpl = _tpl.id$('$root.ui.trackbar');

var Trackbar = _type.create('$root.ui.Trackbar', jQuery, {
	init: function(opts) {
		varArg(arguments, this)
			.when('*', function(arg) {
				return [arg, {}];
			})
			.when('*', '{*}', function(arg, opts) {
				return [arg, opts];
			})
			.invoke(function(arg, opts) {
				this.base(tpl('Trackbar'));
				this.appendTo(arg);
				this.$attr('options', opts);
				this.$attr('handle', this.sigil('.handle'));
				Trackbar_initialize(this, opts);
			});
	},
	val: function(v) {
		var value, h = this.$get('handle');
		if (v == null) {
			return (h.position().left) / (this.width() - h.width());
		} else if (v !== value && _type.isInteger(v)) {
			value = _number.confined(v, 0, 100, false);
			this.handle.css('left', this.value + '%');
		}
		return this;
	}
}).events({
	OnChange: 'Change(event,value).Trackbar'
}).statics({

});

function Trackbar_initialize(self, opts) {
	var handle = self.handle,
		p = self.parent(),
		initTop = handle.css('top'),
		line = self.sigil('.line'),
		drag;

	line.css('margin-top', line.parent().height() / 2);
	drag = _drag.draggable(handle, {
		draggingRestriction: function(offset) {
			var $parent = this.$offsetParent,
				w = $parent.width(),
				borderRightWidth = parseInt(this.$dragged.css('border-right-width')),
				borderLeftWidth = parseInt(this.$dragged.css('border-left-width')),
				rightBound = w - this.$.width() - borderRightWidth - borderLeftWidth;
			if (offset.top < 0) offset.top = 0;
			if (offset.left < 0) offset.left = 0;
			if (offset.left >= rightBound) offset.left = rightBound;
			offset.top = initTop;
			//offset.left = p.offset().left;
		},
		onMouseMove: function() {
			self.trigger(Trackbar.Events.OnChange, [self.val()]);
			this.$dragged.offset(offset);
		}
	});
	self.$attr('drag', drag);
}