var $path = require('path');

function JsModuleConfig(path) {
	this.initialize(path);
}

JsModuleConfig.prototype.initialize = function(p) {
	this.path = p;

	Object.defineProperty(this, 'basename', {
		get: function() {
			return $path.basename(this.path);
		}
	});
};

exports.JsModuleConfig = JsModuleConfig;