test("$root.lang.json", function(require, specs) {
    var JSON = require('$root.lang.json');

    specs
        .___('JSON#parse')
        .it.maybe.anything(0, function(){
            console.log(JSON.parse('{"a":[1,"a",{"b":{}}]}'));
        })
        .done();
});