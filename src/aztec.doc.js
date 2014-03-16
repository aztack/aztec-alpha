({
	description: 'Documents for Development Environemnt',
	version: '0.0.1',
	namespace: $root,
	priority: 1000
});
define('$root.browser.dom', function(require, exports) {
	exports.ready.__doc__ = [
		'ready(callback:Function)',
		'callback will be called when DOM is ready'
	];
});