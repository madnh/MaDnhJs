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
                chai_assert.isTrue(ee.has(key));
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
                chai_assert.isTrue(ee.has(key));
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
                chai_assert.isTrue(ee.has(key));
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
                    chai_assert.isTrue(ee.has(key));
                });
            });
        });
    });
    describe('Emit', function () {
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
            it('correct event emitted times', function () {
                chai_assert.strictEqual(ee.emitted('test'), 1);
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
                chai_assert.isTrue(ee.has(key));
            });
            it('Emit event success', function (done) {
                _.M.debugging('test');
                ee.emit('test', [done]);
                _.M.debugComplete('test');
            });
            it('Key isn\'t exists after previous emit', function () {
                chai_assert.isFalse(ee.has(key));
            });

        });
        describe('Emit and echoed event', function () {
            var ee, event_to_emit = 'test', data_to_emit = 123;
            ;

            beforeEach(function () {
                ee = new _.M.EventEmitter();
            });

            it('event_emitted', function (done) {
                ee.on('event_emitted', function (event_name, data) {
                    chai_assert.isTrue(event_name === event_to_emit);
                    chai_assert.isTrue(data === data_to_emit);
                    done();
                });
                ee.emit(event_to_emit, data_to_emit);
            });
            it('event_complete', function (done) {
                var event_to_emit = 'test', data_to_emit = 123;

                ee.on(event_to_emit + '_complete', function (data) {
                    chai_assert.isTrue(data === data_to_emit);
                    done();
                });
                ee.emit(event_to_emit, data_to_emit);
            });
            it('finally callback', function (done) {
                chai_assert.doesNotThrow(function () {
                    ee.emit('other_event', null, function () {
                        done();
                    });
                });
            });
        });
    });
    describe('Remove', function () {
        var ee, key, key2, key3;

        beforeEach(function () {
            ee = new _.M.EventEmitter();
            key = ee.addListener('test', _.M.logArgs);
            key2 = ee.addListener('test2', _.M.logArgs);
            key3 = ee.addListener('test3', _.M.warnArgs);

            chai_assert.isTrue(ee.has(key));
            chai_assert.isTrue(ee.has(key2));
            chai_assert.isTrue(ee.has(key3));
        });

        it('remove by key', function () {
            chai_assert.doesNotThrow(function () {
                ee.removeListener(key);
            });
            chai_assert.isFalse(ee.has(key));
            chai_assert.isTrue(ee.has(key2));
            chai_assert.isTrue(ee.has(key3));
        });
        it('remove by key, special event name', function () {
            chai_assert.doesNotThrow(function () {
                ee.removeListener(_.M.logArgs, 'test');
            });
            chai_assert.isFalse(ee.has(key));
            chai_assert.isTrue(ee.has(key2));
            chai_assert.isTrue(ee.has(key3));
        });
        it('remove by listener', function () {
            chai_assert.doesNotThrow(function () {
                ee.removeListener(_.M.logArgs);
            });

            chai_assert.isFalse(ee.has(key));
            chai_assert.isFalse(ee.has(key2));
            chai_assert.isTrue(ee.has(key3));
        });
        it('remove by listeners', function () {
            var removed;
            chai_assert.doesNotThrow(function () {
                removed = ee.removeListener([_.M.logArgs, _.M.warnArgs]);
            });


            chai_assert.deepEqual(removed, {
                test: [key],
                test2: [key2],
                test3: [key3]
            });
            chai_assert.isFalse(ee.has(key));
            chai_assert.isFalse(ee.has(key2));
            chai_assert.isFalse(ee.has(key3));
        });
    });
    describe('Attach to other EventEmitter instance', function () {
        var base_ee, other_ee;

        before(function () {
            base_ee = new _.M.EventEmitter();
            other_ee = new _.M.EventEmitter();

            other_ee.attachTo(base_ee);
        });

        it('OtherEE is following BaseEE', function () {
            chai_assert.isTrue(other_ee.isFollowing(base_ee));
        });
        it('BaseEE has an follower is OtherEE', function () {
            chai_assert.isTrue(base_ee.hasFollower(other_ee));
        });
    });
    describe('Notice', function () {
        describe('Notice event', function () {
            var base_ee,
                other_ee,
                event_name = 'test',
                private_event = 'private_event';

            beforeEach(function () {
                base_ee = new _.M.EventEmitter();
                other_ee = new _.M.EventEmitter();

                base_ee.private(private_event);
                other_ee.attachTo(base_ee);
            });

            it('Check notice enough events', function (done) {
                var notices = [
                        base_ee.id + '.' + event_name,
                        base_ee.type_prefix + '.' + event_name,
                        'noticed.' + base_ee.id + '.' + event_name,
                        'noticed.' + base_ee.id,
                        'noticed.' + base_ee.type_prefix + '.' + event_name,
                        'noticed.' + base_ee.type_prefix,
                        'noticed'
                    ],
                    emitted;

                other_ee.on('event_emitted', function (event) {
                    if (event !== (emitted = notices.shift())) {
                        done('Wrong event, need ' + emitted + ', receive ' + event);
                    }
                    if (!notices.length) {
                        done();
                    }
                });

                base_ee.emit(event_name);
            });
            it('Do not notice private event', function (done) {
                base_ee.on(private_event + '_complete', function () {
                    done();
                });
                other_ee.on('noticed.' + base_ee.id + '.' + private_event, function (notice_detail) {
                    done('Noticed a private event: ' + notice_detail.event);
                });

                base_ee.emit(private_event);
            });


        });

        describe('Mimic', function () {
            var base_ee,
                other_ee,
                event_name = 'test';

            beforeEach(function () {
                base_ee = new _.M.EventEmitter();
                other_ee = new _.M.EventEmitter();

                other_ee.attachTo(base_ee);
            });

            function testMimic(done, mimic_event) {
                other_ee.mimic(mimic_event);

                other_ee.on(event_name, function () {
                    done();
                });
                other_ee.on('noticed', function (notice_data) {
                    done('Noticed a mimic event: ' + notice_data.event);
                });

                base_ee.emit(event_name);
            }

            it('Mimic event', function (done) {
                testMimic(done, event_name);
            });
            it('Mimic event with wildcard', function (done) {
                testMimic(done, base_ee.type_prefix + '.*');
            });
            it('Mimic event with type and event name', function (done) {
                testMimic(done, base_ee.type_prefix + '.' + event_name);
            });
        });
    });

});