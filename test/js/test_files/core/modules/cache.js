describe('MODULES - CACHE', function () {
    var expect = chai.expect,
        chai_assert = chai.assert;

    it('Set', function () {
        var cache_name = 'test_cache',
            cache_value = 123;
        //
        Cache.set(cache_name, cache_value);
        chai_assert.isTrue(Cache.has(cache_name));
        chai_assert.strictEqual(Cache.get(cache_name), cache_value);
        chai_assert.strictEqual(Cache.get(cache_name, 'DEFAULT_VALUE'), cache_value);
    });
    it('Set, override', function () {
        var cache_name = 'test_cache_override',
            cache_value = 123,
            new_value = 456;

        Cache.set(cache_name, cache_value);
        chai_assert.isTrue(Cache.has(cache_name));
        chai_assert.strictEqual(Cache.get(cache_name), cache_value);
        //
        Cache.set(cache_name, new_value);
        //
        chai_assert.isTrue(Cache.has(cache_name));
        chai_assert.strictEqual(Cache.get(cache_name), new_value);
    });

    it('Non-exists cache', function () {
        var cache_name = 'test_cache_has_non_exists',
            cache_value = 123;

        chai_assert.isFalse(Cache.has(cache_name));
        chai_assert.isUndefined(Cache.get(cache_name));
        chai_assert.strictEqual(Cache.get(cache_name, cache_value), cache_value);
    });
    it('Expire', function () {
        var cache_name = 'test_cache_expire',
            cache_value = 123, default_value = 'DEFAULT_VALUE';

        Cache.set(cache_name, cache_value);
        //
        chai_assert.isTrue(Cache.has(cache_name));
        chai_assert.strictEqual(Cache.get(cache_name), cache_value);
        chai_assert.strictEqual(Cache.get(cache_name, default_value), cache_value);
        //
        Cache.expire(cache_name);
        chai_assert.isFalse(Cache.has(cache_name));
        chai_assert.strictEqual(Cache.get(cache_name, default_value), default_value);
    });

    describe('Increment', function () {
        var cache_name = 'test_cache_increment';

        beforeEach(function () {
            Cache.set(cache_name, 10);
        });

        it('increment', function () {
            chai_assert.strictEqual(Cache.increment(cache_name), 11);
            chai_assert.strictEqual(Cache.get(cache_name), 11);
        });
        it('increment, special value', function () {
            chai_assert.strictEqual(Cache.increment(cache_name, 10), 20);
            chai_assert.strictEqual(Cache.get(cache_name), 20);
        });
        it('increment, non-exists cache name', function () {
            var non_exists_cache_name = 'test_cache_increment_non_exists';
            //
            chai_assert.isFalse(Cache.has(non_exists_cache_name));
            chai_assert.isUndefined(Cache.get(non_exists_cache_name));
            chai_assert.strictEqual(Cache.increment(non_exists_cache_name, 10), 10);
            chai_assert.strictEqual(Cache.get(non_exists_cache_name), 10);
        });
    });
    describe('Decrement', function () {
        var cache_name = 'test_cache_decrement';

        beforeEach(function () {
            Cache.set(cache_name, 10);
        });

        it('decrement', function () {
            chai_assert.strictEqual(Cache.decrement(cache_name), 9);
            chai_assert.strictEqual(Cache.get(cache_name), 9);
        });
        it('decrement, special value', function () {
            chai_assert.strictEqual(Cache.decrement(cache_name, 5), 5);
            chai_assert.strictEqual(Cache.get(cache_name), 5);
        });
        it('decrement, non-exists cache name', function () {
            var non_exists_cache_name = 'test_cache_decrement_non_exists';
            //
            chai_assert.isFalse(Cache.has(non_exists_cache_name));
            chai_assert.isUndefined(Cache.get(non_exists_cache_name));
            chai_assert.strictEqual(Cache.decrement(non_exists_cache_name, 5), -5);
            chai_assert.strictEqual(Cache.get(non_exists_cache_name), -5);
        });

    });

    describe('array push', function () {
        var cache_name = 'test_cache_array_push';

        beforeEach(function () {
            Cache.set(cache_name, ['A', 'B']);
        });

        it('array push', function () {
            chai_assert.deepEqual(Cache.arrayPush(cache_name, 'C'), ['A', 'B', 'C']);
            chai_assert.deepEqual(Cache.get(cache_name), ['A', 'B', 'C']);
        });
        it('array push, non-exists cache name', function () {
            var non_exists_cache_name = 'test_cache_array_push_non_exists';
            //
            chai_assert.isFalse(Cache.has(non_exists_cache_name));
            chai_assert.isUndefined(Cache.get(non_exists_cache_name));
            chai_assert.deepEqual(Cache.arrayPush(non_exists_cache_name, 'C'), ['C']);
            chai_assert.deepEqual(Cache.get(non_exists_cache_name), ['C']);
        });
    });
    describe('array without', function () {
        var cache_name = 'test_cache_array_without';

        beforeEach(function () {
            Cache.set(cache_name, ['A', 'B']);
        });

        it('array without', function () {
            chai_assert.deepEqual(Cache.arrayWithout(cache_name, 'B'), ['A']);
            chai_assert.deepEqual(Cache.get(cache_name), ['A']);
        });
        it('array without, non-exists cache name', function () {
            var non_exists_cache_name = 'test_cache_array_without_non_exists';
            //
            chai_assert.isFalse(Cache.has(non_exists_cache_name));
            chai_assert.isUndefined(Cache.get(non_exists_cache_name));
            chai_assert.isUndefined(Cache.arrayWithout(non_exists_cache_name, 'C'));
        });
    });

});