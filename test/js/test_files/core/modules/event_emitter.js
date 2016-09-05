describe('MODULE - EventEmitter', function () {
    var expect = chai.expect,
        chai_assert = chai.assert;

    describe('Add', function () {
        describe('Add one listener', function () {
            var ee, key;

            before(function () {
                ee = new _.M.EventEmitter();
                key = ee.addListener('test', _.M.logArgs);
            });

            it('return key as string', function () {
                chai_assert.isString(key);
            });
            it('key must be exists', function () {
                chai_assert.isTrue(ee.hasKey(key));
            });
        });
        describe('Add multiple listeners, one event', function () {
            var ee, key;

            before(function () {
                ee = new _.M.EventEmitter();
                key = ee.addListener('test', [_.M.logArgs, _.M.logArgs]);
            });

            it('return key as string', function () {
                chai_assert.isString(key);
            });
            it('key must be exists', function () {
                chai_assert.isTrue(ee.hasKey(key));
            });
        });
        describe('Add multiple listeners, multiple events', function () {
            var ee, key;

            before(function () {
                ee = new _.M.EventEmitter();
                key = ee.addListener(['test', 'test2'], [_.M.logArgs, _.M.logArgs]);
            });

            it('return key as string', function () {
                chai_assert.isString(key);
            });
            it('key must be exists', function () {
                chai_assert.isTrue(ee.hasKey(key));
            });
        });
        describe('Add multiple listeners, multiple events by object', function () {
            var ee, keys;

            before(function () {
                ee = new _.M.EventEmitter();

                keys = ee.addListeners({
                    test: [_.M.logArgs, _.M.logArgs],
                    test2: [_.M.logArgs, [_.M.logArgs, {key: 'yahoo'}]]
                });
            });

            it('return keys is array', function () {
                chai_assert.isArray(keys);
            });
            it('return keys is not empty', function () {
                chai_assert.isAbove(keys.length, 0);
            });
            it('return keys must be exists', function () {
                keys.forEach(function (key) {
                    chai_assert.isTrue(ee.hasKey(key));
                });
            });
        });
    });
    describe('Emit an event', function () {
        var ee, data = _.M.randomString(10);

        before(function () {
            ee = new _.M.EventEmitter();
            ee.addListener('test', function (done, data_arg) {
                done();

                if (arguments.length > 1 && data !== data_arg) {
                    throw new Error('Data and assigned data is difference');
                }
            });
        });

        it('Run listener success', function (done) {
            chai_assert.doesNotThrow(function () {
                ee.emit('test', [done]);
            });
        });

        it('Listener must return correct result', function (done) {
            chai_assert.doesNotThrow(function () {
                ee.emit('test', [done, data]);
            });
        });
        it('Event is emit multiple times', function (done) {
            var times = 5,
                done_cb = _.after(times, done);

            for (var i = 0; i < times; i++) {
                chai_assert.doesNotThrow(function () {
                    ee.emit('test', [done_cb]);
                });
            }
        });
    });
    describe('Emit an event with limit of times', function () {
        var ee, key;

        before(function () {
            ee = new _.M.EventEmitter();

            key = ee.addOnceListener('test', function (done) {
                done();
            });
            console.log(key, ee);
        });

        it('Key is string', function () {
            chai_assert.isString(key);
        });
        it('Key is exists', function () {
            chai_assert.isTrue(ee.hasKey(key));
        });
        it('Emit event success', function (done) {
            _.M.debugging('test');
            ee.emit('test', [done]);
            _.M.debugComplete('test');
        });
        it('Key isn\'t exists after previous emit', function () {
            chai_assert.isFalse(ee.hasKey(key));
        });

    });


});