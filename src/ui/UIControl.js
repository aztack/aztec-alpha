({
	namespace: '$root.ui.UIControl',
	dependency: {
		'jQuery':'$'
	},
	exports: [
		'UIControl'
	]
});

function UIControl(){}

function _notImplementated(){
	throw "Not Implementated";
}

UIControl.prototype.initialize = function(opt){
	this._option = opt;
	if(opt.container) {
		this._container = $(opt.container);
	}
};

UIControl.prototype.container = function(){
	return this.container;
};

UIControl.prototype.parentControl = function(){};