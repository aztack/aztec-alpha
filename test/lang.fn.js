test("lang.fn", function(require, specs) {
    var _fn = require('$root.lang.fn');

    var obj = {
        fn: {
            do :
            function() {
                console.log(obj);
            }
        }
    };
    specs
        .___("fn#stop")
        .it.maybe.anything(true, function() {
            _fn.stop('fn.do', obj).fn.do();
        })
        .done();
});