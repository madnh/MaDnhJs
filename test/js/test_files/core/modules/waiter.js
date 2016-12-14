describe('MODULES - WAITER', function () {
    var expect = chai.expect,
        chai_assert = chai.assert;

    describe('Add', function () {
        it('once', function (done) {
            var key = M.WAITER.addOnce(function (name) {
                done();

                return name;
            });
            //
            chai_assert.isString(key);
            chai_assert.isTrue(M.WAITER.has(key));
            chai_assert.strictEqual(M.WAITER.run(key, 'Manh'), 'Manh');
            chai_assert.isFalse(M.WAITER.has(key));
        });
        it('Multiple times', function (done) {
            var times = 5,
                done_cb = _.after(times, done),
                key = M.WAITER.add(function (name) {
                    done_cb();

                    return name;
                }, times);
            //
            chai_assert.isString(key);
            //
            for (var i = 0; i < times; i++) {
                chai_assert.isTrue(M.WAITER.has(key));
                chai_assert.strictEqual(M.WAITER.run(key, 'Manh'), 'Manh');
            }
            //
            chai_assert.isFalse(M.WAITER.has(key));
            chai_assert.throws(function () {
                M.WAITER.run(key, 'Manh');
            });
        });
        it('Add function', function () {
            M.debugging('test');
            var key = M.WAITER.createFuncOnce(function (name) {
                return name;
            });
            M.debugComplete('test');
            //
            chai_assert.isString(key);
            chai_assert.isTrue(M.WAITER.has(key));
            chai_assert.isTrue(window.hasOwnProperty(key));
            //
            chai_assert.doesNotThrow(function () {
                window[key]('test');
            });
            //
            chai_assert.isFalse(M.WAITER.has(key));
            chai_assert.isFalse(window.hasOwnProperty(key));
        });
    });

    describe('Remove', function () {
        it('test', function () {
            var key = M.WAITER.addOnce(function () {
            });
            //
            chai_assert.isTrue(M.WAITER.has(key));
            chai_assert.sameMembers(M.WAITER.remove(key), [key]);
            chai_assert.isFalse(M.WAITER.has(key));
        });
    });

});