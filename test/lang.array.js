test("$root.lang.array", function(require, specs) {
    var _array = require('$root.lang.array');
    specs
        .___("array#flatten")
        .it.should.equal([1,2,3,4,5,6,7], function() {
            return _array.flatten([1,2,[3,4,5,[6,7]]]);
        })
        .done();
});