describe('MODULES - WAITER', function () {
    var expect = chai.expect,
        chai_assert = chai.assert;

    describe('Add', function () {
        it('once', function (done) {
            var key = _.M.WAITER.add(function (name) {
                done();

                return name;
            });
            //
            chai_assert.isString(key);
            chai_assert.isTrue(_.M.WAITER.has(key));
            chai_assert.strictEqual(_.M.WAITER.run(key, 'Manh'), 'Manh');
            chai_assert.isFalse(_.M.WAITER.has(key));
        });
        it('Multiple times', function (done) {
            var times = 5,
                done_cb = _.after(times, done),
                key = _.M.WAITER.add(function (name) {
                    done_cb();

                    return name;
                }, times);
            //
            chai_assert.isString(key);
            //
            for (var i = 0; i < times; i++) {
                chai_assert.isTrue(_.M.WAITER.has(key));
                chai_assert.strictEqual(_.M.WAITER.run(key, 'Manh'), 'Manh');
            }
            //
            chai_assert.isFalse(_.M.WAITER.has(key));
            chai_assert.throws(function () {
                _.M.WAITER.run(key, 'Manh');
            });
        });
        it('Add function', function () {
            _.M.debugging('test');
            var key = _.M.WAITER.createFunc(function (name) {
                return name;
            });
            _.M.debugComplete('test');
            //
            chai_assert.isString(key);
            chai_assert.isTrue(_.M.WAITER.has(key));
            chai_assert.isTrue(window.hasOwnProperty(key));
            //
            chai_assert.doesNotThrow(function () {
                window[key]('test');
            });
            //
            chai_assert.isFalse(_.M.WAITER.has(key));
            chai_assert.isFalse(window.hasOwnProperty(key));
        });
    });

    describe('Remove', function () {
        it('test', function () {
            var key = _.M.WAITER.add(function () {
            });
            //
            chai_assert.isTrue(_.M.WAITER.has(key));
            chai_assert.sameMembers(_.M.WAITER.remove(key), [key]);
            chai_assert.isFalse(_.M.WAITER.has(key));
        });
    });

});