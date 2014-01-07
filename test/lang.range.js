test("$root.lang.range", function(require, specs) {
    var range = require('$root.lang.range'),
        ary = require('$root.lang.array'),
        Range = range.Range;

    specs
        .___('range#create')
        .it.should.equal([true, true], function() {
            return [
                range.create(123, 456) === range.create(123, 456),
                range.create(-43, 34) === range.create(34, -43)
            ];
        })
        .___('range#toArray')
        .it.should.equal(true, function() {
            return ary.equal([-1, 0, 1, 2], range.create(-1, 2));
        })
        .___('range#toString')
        .it.should.equal([true, true], function() {
            var r = range.create(123, 456);
            return [
                r.toString() == '[123,345]',
                r.toString('[', ')') == '[123,456)'
            ];
        })
        .done();
});