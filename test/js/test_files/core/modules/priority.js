describe('MODULE - Priority', function () {
    var expect = chai.expect,
        chai_assert = chai.assert;

    var priority_instance;

    beforeEach(function () {
        priority_instance = new Priority();
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

        it('Remove by content', function () {
            var content = 'ABC',
                key = priority_instance.add(content);
            //
            chai_assert.isTrue(priority_instance.has(key));
            chai_assert.isTrue(priority_instance.hasContent(content));
            //
            chai_assert.sameMembers(priority_instance.removeByContent(content), [key]);
            //
            chai_assert.isFalse(priority_instance.has(key));
            chai_assert.isFalse(priority_instance.hasContent(content));
        });

    });
    describe('Get contents', function () {
        var keys = [];
        beforeEach(function () {
            keys.push(priority_instance.add('B', 10));
            keys.push(priority_instance.add('A', 100));
            keys.push(priority_instance.add('C', 1));
        });
        it('Include meta info', function () {
            var contents = priority_instance.export();
            var expect_obj = [
                {content: 'C', priority_key: keys[2]},
                {content: 'B', priority_key: keys[0]},
                {content: 'A', priority_key: keys[1]}
            ];
            console.log('ahihi', contents, expect_obj);
            chai_assert.deepEqual(
                contents,
                expect_obj
            );
        });
        it('Content only', function () {
            chai_assert.deepEqual(priority_instance.export(true), ['C', 'B', 'A']);
        });
    });
});