Module
======

Module Descriptor
-----------------

Auto-generated code
-------------------

Inheritance
===========

Sigils
======

Object Property Path
====================

xTemplate
=========

Caveat
======

Class
=====

CreateOptions
-------------

Auto-Creation
-------------
Every class under `$root.ui` should has a static method, which accept at least a create option and return a instance of that class

for exmaple:

```javascript
Alert.create = function(){
	return varArg(arguments)
		.when('plaintObject',function(opts){
			return [opts];
		}).invoke(function(opts){
			return new Alert(opts.title, opts.content);
		});
};
```

class no meet this requirement can not be auto-created.