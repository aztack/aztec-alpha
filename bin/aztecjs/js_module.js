var $path = require('path');

function JsModule(path) {
	this.initialize(path);
}

JsModule.prototype.initialize = function(p) {
	this.path = p;

	Object.defineProperty(this, 'basename', {
		get: function() {
			return $path.basename(this.path);
		}
	});
};

exports.JsModule = JsModule;