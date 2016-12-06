describe('MODULE - Priority', function () {
    var expect = chai.expect,
        chai_assert = chai.assert;

    var priority_instance;

    beforeEach(function () {
        priority_instance = new _.M.Priority();
    });

    describe('Add', function () {
        var content, key;
        beforeEach(function () {
            content = 'ABC';
            key = priority_instance.add(content);
        });
        it('must return true when check exists by key', function () {
            chai_assert.isTrue(priority_instance.has(key));
        });
        it('must return true when check exists by content', function () {
            chai_assert.isTrue(priority_instance.hasContent(content));
        });
        it('must return true when check exists by ContentManager\'s "has" method', function () {
            chai_assert.isTrue(priority_instance._super.has.call(priority_instance, key));
        });
        it('Add with special priority value', function () {
            var priority = 999;
            //
            priority_instance.add(_.now(), priority);
            //
            chai_assert.isTrue(priority_instance.hasPriority(priority));
        });
    });

    describe('Remove', function () {
        it('Remove by key', function () {
            var key = priority_instance.add('ABC');
            //
            chai_assert.isTrue(priority_instance.has(key));
            chai_assert.sameMembers(priority_instance.remove(key), [key]);
            chai_assert.isFalse(priority_instance.has(key));
        });
        it('Remove by key and special priority', function () {
            //
            var key = priority_instance.add('ABC', 100);
            chai_assert.isTrue(priority_instance.has(key));
            chai_assert.equal(priority_instance.remove(key, 200).length, 0);
            chai_assert.isTrue(priority_instance.has(key));
            chai_assert.sameMembers(priority_instance.remove(key, [200, 100]), [key]);
            chai_assert.isFalse(priority_instance.has(key));
        });

        it('Remove by content', function () {
            var content = 'ABC',
                key = priority_instance.add(content);
            //
            chai_assert.isTrue(priority_instance.has(key));
            chai_assert.isTrue(priority_instance.hasContent(content));
            //
            chai_assert.sameMembers(priority_instance.removeContent(content), [key]);
            //
            chai_assert.isFalse(priority_instance.has(key));
            chai_assert.isFalse(priority_instance.hasContent(content));
        });

    });
    describe('Get contents', function () {
        var keys = [];
        beforeEach(function () {
            keys.push(priority_instance.add('B', 10, {id: '1'}));
            keys.push(priority_instance.add('A', 100, {id: '2'}));
            keys.push(priority_instance.add('C', 1));
        });
        it('Include meta info', function () {
            var contents = priority_instance.export();
            var expect_obj = [
                {content: 'C', meta: undefined, key: keys[2]},
                {content: 'B', meta: {id: '1'}, key: keys[0]},
                {content: 'A', meta: {id: '2'}, key: keys[1]}
            ];

            chai_assert.deepEqual(
                contents,
                expect_obj
            );
        });
        it('Content only', function () {
            chai_assert.deepEqual(priority_instance.export(true), ['C', 'B', 'A']);
        });
    });
    describe('Get status', function () {
        var status;
        beforeEach(function () {
            priority_instance.add('A', 1);
            priority_instance.add('B', 1);
            priority_instance.add('A', 2);

            status = priority_instance.status();
        });

        it('status must be an object with all required properties', function () {
            chai_assert.isObject(status);
            chai_assert.sameMembers(Object.keys(status), ['priorities', 'contents']);
        });
        it('Status properties is correct', function () {
            chai_assert.deepEqual(status, {
                priorities: 2,
                contents: 3
            });
        })
    });
});