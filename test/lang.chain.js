test("$root.lang.chain", function(require, specs) {
    var _ = require('$root.lang.chain')._,
        x = {
            a: {
                b: {
                    c: [1, 2, {
                        d: 4
                    }]
                }
            }
        };
    specs
        .___('chain#_')
        .it.should.equal([0, 2, 6, 12, 20], function() {
            return _([1, 2, 3, 4, 5])
                .map(function(e, i) {
                    return e * i;
                }).value;
        })
        .___('chain#_#tryget')
        .it.should.equal(4, function() {
            return _(x).tryget('a.b.c.2.d').value;
        })
        .___('chain#_#tryset')
        .it.should.equal('a', function() {
            _(x).tryset('a.b.c.2.d','a');
            return x.a.b.c[2].d;
        })
        .___('chain#_#pairs')
        .it.should.equal('a', function() {
            return _(x).pairs().value[0][0];
        })
        .done();
});