({
	description: "Exception module",
	namespace: $root.lang.exception,
	imports: {
		_type: $root.lang.type
	},
	exports: [
		
	]
});

function create(name) {
	var exception = function (msg, data){
		this.name = name;
		this.message = msg;
		this.data = data;
	};
	exception.prototype.toString = function (msg){
		return this.name + ':' + this.message + '!';
	};
	return exception;
}

var ArgumentsError = create('ArgumentsError');