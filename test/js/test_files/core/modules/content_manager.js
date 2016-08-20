describe('MODULE - ContentManager', function () {
    var expect = chai.expect,
        chai_assert = chai.assert;


    describe('Add', function () {
        var items = new _.M.ContentManager();

        beforeEach(function () {
            items = new _.M.ContentManager();
        });
        afterEach(function () {
            _.M.resetID(items.id);
            _.M.resetID('ContentManager');
            console.log(_.M.currentID('ContentManager'));
        });

        function check_add(keys) {
            chai_assert.strictEqual(keys['string'], 'ContentManager_1_string_1');
            chai_assert.isTrue(items.hasKey('ContentManager_1_string_1'));
            chai_assert.isTrue(items.hasType('string'));
            //
            chai_assert.strictEqual(keys['boolean'], 'ContentManager_1_boolean_1');
            chai_assert.isTrue(items.hasKey('ContentManager_1_boolean_1'));
            chai_assert.isTrue(items.hasType('boolean'));
            //
            chai_assert.strictEqual(keys['array'], 'ContentManager_1_Array_1');
            chai_assert.isTrue(items.hasKey('ContentManager_1_Array_1'));
            chai_assert.isTrue(items.hasType('Array'));
        }

        it('Add', function () {
            var keys = {};
            chai_assert.doesNotThrow(function () {
                keys['string'] = items.add('a');
                keys['boolean'] = items.add(true);
                keys['array'] = items.add([1, 2, true, {a: 'A', c: 'C'}]);
            });
            check_add(keys);
        });
        it('Add, meta', function () {
            var keys = {};
            chai_assert.doesNotThrow(function () {
                keys['string'] = items.add('a', {id: 123});
                keys['boolean'] = items.add(true, {name: 'yahoo'});
                keys['array'] = items.add([1, 2, true, {a: 'A', c: 'C'}], {expire: 1735693261});
            });
            check_add(keys);
        });
        it('Add, meta, custom type', function () {
            var keys = {};
            //
            chai_assert.doesNotThrow(function () {
                keys['string'] = items.add('a', {id: 123}, 'yahoo');
                keys['boolean'] = items.add(true, {name: 'yahoo'}, 'yahoo');
                keys['array'] = items.add([1, 2, true, {a: 'A', c: 'C'}], {expire: 1735693261}, 'yahoo');
            });
            //
            chai_assert.isTrue(items.hasType('yahoo'));
            //
            chai_assert.strictEqual(keys['string'], 'content_yahoo_1');
            chai_assert.isTrue(items.hasKey('content_yahoo_1'));
            //
            chai_assert.strictEqual(keys['boolean'], 'content_yahoo_2');
            chai_assert.isTrue(items.hasKey('content_yahoo_2'));
            //
            chai_assert.strictEqual(keys['array'], 'content_yahoo_3');
            chai_assert.isTrue(items.hasKey('content_yahoo_3'));
        });
    });
});