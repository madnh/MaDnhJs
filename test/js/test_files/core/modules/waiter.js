describe('MODULES - WAITER', function () {
    var expect = chai.expect,
        chai_assert = chai.assert;

    describe('Add', function () {
        it('once', function (done) {
            var key = Waiter.addOnce(function (name) {
                done();

                return name;
            });
            //
            chai_assert.isString(key);
            chai_assert.isTrue(Waiter.has(key));
            chai_assert.strictEqual(Waiter.run(key, 'Manh'), 'Manh');
            chai_assert.isFalse(Waiter.has(key));
        });
        it('Multiple times', function (done) {
            var times = 5,
                done_cb = _.after(times, done),
                key = Waiter.add(function (name) {
                    done_cb();

                    return name;
                }, times);
            //
            chai_assert.isString(key);
            //
            for (var i = 0; i < times; i++) {
                chai_assert.isTrue(Waiter.has(key));
                chai_assert.strictEqual(Waiter.run(key, 'Manh'), 'Manh');
            }
            //
            chai_assert.isFalse(Waiter.has(key));
            chai_assert.throws(function () {
                Waiter.run(key, 'Manh');
            });
        });
        it('Add function', function () {
            M.debugging('test');
            var key = Waiter.createFuncOnce(function (name) {
                return name;
            });
            M.debugComplete('test');
            //
            chai_assert.isString(key);
            chai_assert.isTrue(Waiter.has(key));
            chai_assert.isTrue(window.hasOwnProperty(key));
            //
            chai_assert.doesNotThrow(function () {
                window[key]('test');
            });
            //
            chai_assert.isFalse(Waiter.has(key));
            chai_assert.isFalse(window.hasOwnProperty(key));
        });
    });

    describe('Remove', function () {
        it('test', function () {
            var key = Waiter.addOnce(function () {
            });
            //
            chai_assert.isTrue(Waiter.has(key));
            chai_assert.sameMembers(Waiter.remove(key), [key]);
            chai_assert.isFalse(Waiter.has(key));
        });
    });

});