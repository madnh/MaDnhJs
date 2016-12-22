describe('MODULE - EventEmitter', function () {
    var expect = chai.expect,
        chai_assert = chai.assert;

    describe('Add', function () {
        describe('Add one listener', function () {
            var ee, key;

            before(function () {
                ee = new EventEmitter();
                key = ee.addListener('test', M.logArgs);
            });

            it('return key as string', function () {
                chai_assert.isString(key);
            });
            it('key must be exists', function () {
                chai_assert.isTrue(ee.has(key));
            });
            it('Add an added key', function () {
                chai_assert.equal(ee.addListener('test2', key), key);
            });

        });

        describe('Add multiple listeners, multiple events by object', function () {
            var ee, keys;

            before(function () {
                ee = new EventEmitter();

                keys = ee.addListeners({
                    test: [M.logArgs, M.logArgs],
                    test2: [M.logArgs, [M.logArgs, {priority: 100}]]
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
    describe('Emit event', function () {
        describe('Emit an event', function () {
            var ee, data = M.randomString(10);

            before(function () {
                ee = new EventEmitter();
                ee.addListener('test', function (done, data_arg) {
                    done();

                    if (arguments.length > 1 && data !== data_arg) {
                        throw new Error('Data and assigned data is difference');
                    }
                });
            });

            it('Run listener success', function (done) {
                chai_assert.doesNotThrow(function () {
                    ee.emitEvent('test', done);
                });
            });
            it('Listener must return correct result', function (done) {
                chai_assert.doesNotThrow(function () {
                    ee.emitEvent('test', done, data);
                });
            });
            it('Event is emit multiple times', function (done) {
                var times = 5,
                    done_cb = _.after(times, done);

                for (var i = 0; i < times; i++) {
                    chai_assert.doesNotThrow(function () {
                        ee.emitEvent('test', done_cb);
                    });
                }
            });
        });
        describe('Emit an event with limit of times', function () {
            var ee, key;

            before(function () {
                ee = new EventEmitter();

                key = ee.addOnceListener('test', function (done) {
                    done();
                });
            });

            it('Key is string', function () {
                chai_assert.isString(key);
            });
            it('Key is exists', function () {
                chai_assert.isTrue(ee.has(key));
            });
            it('Emit event success', function (done) {
                M.debugging('test');
                ee.emitEvent('test', done);
                M.debugComplete('test');
            });
            it('Key isn\'t exists after previous emit', function () {
                chai_assert.isFalse(ee.has(key));
            });

        });
        describe('Emit and echoed event', function () {
            var ee, event_to_emit = 'test', data_to_emit = 123;

            beforeEach(function () {
                ee = new EventEmitter();
            });

            it('event_emitted', function (done) {
                ee.on('event_emitted', function (event_name, data) {
                    chai_assert.isTrue(event_name === event_to_emit);
                    chai_assert.isTrue(data === data_to_emit);
                    done();
                });
                ee.emitEvent(event_to_emit, data_to_emit);
            });
            it('event_complete', function (done) {
                var event_to_emit = 'test', data_to_emit = 123;

                ee.on(event_to_emit + '_complete', function (data) {
                    chai_assert.isTrue(data === data_to_emit);
                    done();
                });
                ee.emitEvent(event_to_emit, data_to_emit);
            });
            it('finally callback', function (done) {
                chai_assert.doesNotThrow(function () {
                    ee.emitEventThen('other_event', function () {
                        done();
                    });
                });
            });
        });
    });
    describe('Remove', function () {
        var ee, key, key2, key3;

        beforeEach(function () {
            ee = new EventEmitter();
            key = ee.addListener('test', M.logArgs);
            key2 = ee.addListener('test2', M.logArgs);
            key3 = ee.addListener('test3', M.warnArgs);

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
                ee.removeListener(M.logArgs, 'test');
            });
            chai_assert.isFalse(ee.has(key));
            chai_assert.isTrue(ee.has(key2));
            chai_assert.isTrue(ee.has(key3));
        });
        it('remove by listener', function () {
            chai_assert.doesNotThrow(function () {
                ee.removeListener(M.logArgs);
            });

            chai_assert.isFalse(ee.has(key));
            chai_assert.isFalse(ee.has(key2));
            chai_assert.isTrue(ee.has(key3));
        });
        it('remove by listeners', function () {
            chai_assert.doesNotThrow(function () {
                ee.removeListeners([M.logArgs, M.warnArgs]);
            });


            chai_assert.isFalse(ee.has(key));
            chai_assert.isFalse(ee.has(key2));
            chai_assert.isFalse(ee.has(key3));
        });
    });
    describe('Listen to other EventEmitter instance', function () {
        var base_ee, other_ee;

        before(function () {
            base_ee = new EventEmitter();
            other_ee = new EventEmitter();

            other_ee.listen(base_ee);
        });

        it('Check is following', function () {
            chai_assert.isTrue(other_ee.isListening(base_ee));
        });
    });
    describe('Notice event', function () {
        var base_ee,
            other_ee,
            event_name = 'test',
            private_event = 'private_event';

        beforeEach(function () {
            base_ee = new EventEmitter();
            other_ee = new EventEmitter();

            base_ee.private(private_event);
            other_ee.listen(base_ee, 'Base');
        });

        it('Check notice enough events', function (done) {
            var notices = [
                    base_ee.id + '.' + event_name,
                    'Base.' + event_name,
                    'notified'
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
        it('Do not notice private events', function (done) {
            other_ee.on('notified', function (event) {
                if (event === private_event) {
                    done('Notified an private event');
                } else {
                    done();
                }
            });

            base_ee.emitThen(private_event, function () {
                done();
            });
        });
    });
    describe('Mimic', function () {
        var base_ee,
            other_ee,
            mimic_event = 'test',
            private_event = 'test_private';

        beforeEach(function () {
            base_ee = new EventEmitter();
            other_ee = new EventEmitter();

            base_ee.private(private_event);
            other_ee.listen(base_ee, 'Base');
        });

        function addTestMimicEvents(done) {
            other_ee.on(mimic_event, function () {
                done();
            });

            base_ee.emit(mimic_event);
        }

        it('Mimic global, all of events', function (done) {
            other_ee.mimic();
            addTestMimicEvents(done);
        });
        it('Mimic global, special events', function (done) {
            other_ee.mimic(mimic_event);
            addTestMimicEvents(done);
        });

        it('Mimic all of target\'s events', function (done) {
            other_ee.mimic(base_ee);
            addTestMimicEvents(done);
        });
        it('Mimic special target\'s events', function (done) {
            other_ee.mimic(mimic_event, base_ee);
            addTestMimicEvents(done);
        });

    });
    describe('Un-listen', function () {
        var base_ee, other_ee;

        before(function () {
            base_ee = new EventEmitter();
            other_ee = new EventEmitter();

            other_ee.listen(base_ee);
            chai_assert.isTrue(other_ee.isListening(base_ee));
        });

        it('Unlisten success', function () {
            chai_assert.doesNotThrow(function () {
                other_ee.unlisten(base_ee);
            });
        });
        it('Return TRUE when check is listening', function () {
            chai_assert.isFalse(other_ee.isListening(base_ee));
        });
        it('Does not notify any of events after unlisten', function (done) {
            other_ee.on('notified', function () {
                done('Notified after unlisten');
            });
            base_ee.emitThen('test', function () {
                done();
            });
            base_ee.emit('test');
        });
    });

});