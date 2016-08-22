describe('MODULE - EventEmitter', function () {
    var expect = chai.expect,
        chai_assert = chai.assert;

    describe('Add one listener', function () {
        var ee;

        before(function () {
            ee = new _.M.EventEmitter();
        });

        it('return key as string', function () {
            var key = ee.addListener('test', function () {});

            chai_assert.isString(key);
        });
    });
    describe('Add multiple listeners');
    describe('Add once listener');
});