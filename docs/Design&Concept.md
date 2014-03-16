Namspace and namespace object
===============================

Module
======
Define module
--------------
**Module Descriptor**
**Module Priority**
**Module Naming**

Auto-generated code
-------------------

**return value of `define`**
Let's see some code first:

```javascript
//person.name.js
define('$root.person',[],function(require,exports){
    exports.name = 'Jack';
    return exports;
});
```

```javascript
//person.greeting.js
define('$root.person',[],function(require,exports){
    exports.greeting = function(){
        return "hello! I'm " + exports.name || 'Adam.';
    };
    return exports;
});
```

```javascript
//person.demo.js
define('$root.person.demo',[],function(require,exports){
    var person = require('$root.person');
    console.log(person.greeting());
});
//hello! I'm Jack
```

`$root.person` would be
```json
{name: "Jack", greeting: function, demo: undefined}
```

Notice `return exports` in first two code snippets:
return `exports` will cause exported interface to be set onto the namespace object and multiple interfaces merged into one namespace object, `$root.person`for above case.

Returning nothing will only add a property, 'demo' in this case, to the namespace object with an `undfined` value.

Auto generated module code will `return exports` at the end of module.
You don't need to call define explicitly.

This feature make it convenient to seperate definition into multiple files and to augments/refine existing modules:

```javascript
//modify.js
define('$root.person',[],function(require,exports){
    exports.greeting = function(){
        return "hello! I'm " + (exports.name || 'Adam') + '.Nice to meet you';
    };
    exports.age = 26;
    return exports;
});
```

`$root.person` would be modified to
```json
{name: "Jack", greeting: function, demo: undefined, age: 26}
```

and `$root.person.greeting()` will return `"hello! I'm Jack.Nice to meet you"`
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

`this` value in event handler
-----------------------------
