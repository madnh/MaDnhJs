describe('MODULE - ContentManager', function () {
    var expect = chai.expect,
        chai_assert = chai.assert;

    var items;

    function reset_each_descibe() {
        _.M.resetID('ContentManager');
        if (items) {
            _.M.resetID(items.id);
            _.M.resetID(items.id + '_string');
            _.M.resetID(items.id + '_number');
            _.M.resetID(items.id + '_boolean');
            _.M.resetID(items.id + '_Array');
        }
        items = new _.M.ContentManager();
    }

    before(reset_each_descibe);

    describe('Add, check exists by key, content type and content value, get content', function () {
        before(reset_each_descibe);

        it('Add', function () {
            var val = 'a',
                key,
                detail;

            chai_assert.isString(key = items.add(val));
            chai_assert.isTrue(items.has(key));
            chai_assert.isTrue(items.hasType('string'));
            chai_assert.isTrue(items.hasContent(val));
            chai_assert.isTrue(items.hasContent(val, 'string'));
            //
            chai_assert.isObject(detail = items.get(key));
            chai_assert.property(detail, 'content');
            chai_assert.strictEqual(detail.content, val);
            chai_assert.property(detail, 'meta');
            chai_assert.isUndefined(detail.meta);
        });
        it('Add, unique', function () {
            var val = _.M.randomString(20),
                key = items.add(val);

            chai_assert.strictEqual(items.addUnique(val), key);
            chai_assert.notEqual(items.addUnique(val + '_'), key);
        });
        it('Add, meta', function () {
            var val = true,
                meta = {id: 1},
                key,
                detail;

            chai_assert.isString(key = items.add(val, meta));
            chai_assert.isTrue(items.has(key));
            chai_assert.isTrue(items.hasType('boolean'));
            chai_assert.isTrue(items.hasContent(val));
            chai_assert.isTrue(items.hasContent(val, 'boolean'));
            //
            chai_assert.isObject(detail = items.get(key));
            chai_assert.property(detail, 'content');
            chai_assert.strictEqual(detail.content, val);
            chai_assert.property(detail, 'meta');
            chai_assert.deepEqual(detail.meta, meta);
            chai_assert.deepEqual(detail.meta, items.getMeta(key));
        });
        it('Add, meta, custom type', function () {
            var val = [1, 2, 3],
                meta = {name: 'M'},
                type = 'yahoo',
                key,
                detail;

            chai_assert.isString(key = items.add(val, meta, type));
            chai_assert.isTrue(items.has(key));
            chai_assert.isTrue(items.hasType(type));
            //
            chai_assert.isObject(detail = items.get(key));
            chai_assert.property(detail, 'content');
            chai_assert.sameMembers(detail.content, val);
            chai_assert.property(detail, 'meta');
            chai_assert.deepEqual(detail.meta, meta);
            chai_assert.deepEqual(detail.meta, items.getMeta(key));
            //
            chai_assert.sameMembers(items.getContent(key), val);
        });
        it('Return false when get non-exists key', function () {
            chai_assert.isFalse(items.get('non-exists-key'));
        });
        it('Return default value when get non-exists key', function () {
            chai_assert.strictEqual(items.getContent('non-exists-key', 'yahoo'), 'yahoo');
        });
    });
    describe('Update', function () {
        before(reset_each_descibe);

        it('content', function () {
            var val_before = 1,
                val_after = 2,
                key = items.add(val_before);
            //
            chai_assert.strictEqual(items.getContent(key), val_before);
            chai_assert.doesNotThrow(function () {
                items.update(key, val_after);
            });
            chai_assert.strictEqual(items.getContent(key), val_after);
        });
        it('content and meta', function () {
            var val_before = 1,
                val_after = 2,
                meta_before = {id: 1},
                meta_after = {id: 2},
                key = items.add(val_before, meta_before);
            //
            chai_assert.strictEqual(items.getContent(key), val_before);
            chai_assert.deepEqual(items.getMeta(key), meta_before);
            chai_assert.doesNotThrow(function () {
                items.update(key, val_after, meta_after);
            });
            chai_assert.strictEqual(items.getContent(key), val_after);
            chai_assert.deepEqual(items.getMeta(key), meta_after);
        });
        it('meta only', function () {
            var val = 1,
                meta_before = {id: 1},
                meta_after = {id: 2},
                key = items.add(val, meta_before);
            //
            chai_assert.strictEqual(items.getContent(key), val);
            chai_assert.deepEqual(items.getMeta(key), meta_before);
            chai_assert.doesNotThrow(function () {
                items.updateMeta(key, meta_after);
            });
            chai_assert.deepEqual(items.getMeta(key), meta_after);
        });

    });
    describe('Remove', function () {
        before(reset_each_descibe);

        function valid_remove_key(key) {
            var removed = [];

            chai_assert.isTrue(items.has(key));
            chai_assert.doesNotThrow(function () {
                removed = items.remove(key);
            });
            chai_assert.isArray(removed);
            chai_assert.sameDeepMembers(removed, [{
                type: 'string',
                key: key
            }]);
            chai_assert.isFalse(items.has(key));
        }

        it('remove by an exists key', function () {
            var key = items.add('a');
            //
            valid_remove_key(key);
        });
        it('only remove special key', function () {
            var value = _.M.randomString(10),
                key = items.add(value),
                key_2 = items.add(value);
            //
            valid_remove_key(key);
            chai_assert.isTrue(items.has(key_2));
        });
        it('remove all item by value', function () {
            var value = _.M.randomString(20),
                key = items.add(value),
                key_2 = items.add(value);
            //
            chai_assert.isTrue(items.has(key));
            chai_assert.isTrue(items.has(key_2));
            chai_assert.isTrue(items.hasContent(value));
            //
            items.removeContent(value);
            //
            chai_assert.isFalse(items.has(key));
            chai_assert.isFalse(items.has(key_2));
            //
            chai_assert.isFalse(items.hasContent(value));
        });
    });
    describe('Filter', function () {
        var values = [],
            must_be = [];

        var callback = function (content, meta, key, type) {
            return -1 !== values.indexOf(content);
        };

        before(function () {
            reset_each_descibe();
            values = [_.M.randomString(10), true, 123, _.M.randomString(10)];

            _.each(values, function (item) {
                must_be.push({
                    type: _.M.contentType(item),
                    key: items.add(item),
                    meta: undefined,
                    content: item
                });
            });
        });

        it('All of types', function () {
            var filtered = items.filter(callback);
            //
            chai_assert.sameDeepMembers(filtered, must_be);
        });
        it('Special type', function () {
            var filtered = items.filter(callback, 'string');
            //
            chai_assert.sameDeepMembers(filtered, _.filter(must_be, function (must_be_item) {
                return must_be_item.type === 'string';
            }));
        });
    });
    describe('Find', function () {
        var value, must_be;
        var callback = function (content) {
            return content === value;
        };
        before(function () {
            reset_each_descibe();
            value = _.M.randomString(20);
            must_be = {
                type: 'string',
                key: items.add(value),
                meta: undefined,
                content: value
            };
            console.log(must_be);
        });

        it('must return object if found', function () {
            var found = items.find(callback);
            console.log(found);
            chai_assert.deepEqual(found, must_be);
        });
        it('custom type, must return object if found', function () {
            chai_assert.deepEqual(items.find(callback, 'string'), must_be);
        });
        it('must return false if not found', function () {
            chai_assert.isFalse(items.find(function () {
                return false;
            }));
        });
        it('must return false when custom type non-exists', function () {
            chai_assert.isFalse(items.find(callback, 'other_type'));
        });
    });
});