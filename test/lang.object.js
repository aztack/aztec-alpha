test("$root.lang.object", function(require, specs) {
    var obj = require('$root.lang.object'),
        json = {
            content: {
                rss: [{
                    lgt: {
                        g: "12.34"
                    }
                }]
            }
        };
    specs
        .___('object#keys')
        .it.should.equal(['1', 'undefined', 'true'], function() {
            return obj.keys({
                1: true,
                undefined: true,
                'true': true
            });
        })
        .___('object#keys')
        .it.should.equal([0, 1, 2], function() {
            return obj.keys(['a', 'b', 'c']);
        })
        .___('object#tryget')
        .it.should.equal(["12.34", null], function() {
            return [
                obj.tryget(json, 'content.rss.0.lgt.g'),
                obj.tryget(json, 'content,rss0', null)
            ];
        })
        .___('object#tryset')
        .it.should.equal(12.35, function() {
            return obj.tryset(json, 'content.rss.0.lgt.g', 12.35).content.rss[0].lgt.g;
        })
        .it.should.strictEqual(12.35, function() {
            return obj.tryset(json, 'content.rss[0].wrong.g', '12.34').content.rss[0].lgt.g;
        })
        .done();
});