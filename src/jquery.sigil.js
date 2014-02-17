({
	description: 'jQuery Sigil Extension',
	namespace: jQuery,
	notransform: true
});

if (typeof jQuery !== 'undefined') {
	jQuery.fn.sigil = function(sigil) {
		var clazz, selector;
		if (typeof this.getClass == 'function') {
			clazz = this.getClass();
			sigils = clazz.sigils;
			if (sigils && sigils.length > 0) {
				selector = clazz.sigils[sigil];
				if (selector) {
					return this.find(selector);
				}
			}
		}
		return this.find(sigil);
	};
}