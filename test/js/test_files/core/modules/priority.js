describe('MODULE - Priority', function () {
    var expect = chai.expect,
        chai_assert = chai.assert;

    var priority_instance;

    beforeEach(function () {
        priority_instance = new _.M.Priority();
    });

    describe('Add', function () {
        it('Add, return true when check exists by key and content', function () {
            var content = 'ABC',
                key = priority_instance.addContent(content);
            //
            chai_assert.isTrue(priority_instance.has(key));
            chai_assert.isTrue(priority_instance.hasContent(content));
        });
        it('Add with special priority value', function () {
            var priority = 999;
            //
            priority_instance.addContent(_.M.nowSecond(), priority);
            //
            chai_assert.isTrue(priority_instance.hasPriority(priority));
        });
    });
    describe('Remove', function () {
        it('Remove by key', function () {
            var key = priority_instance.addContent('ABC');
            //
            chai_assert.isTrue(priority_instance.has(key));
            chai_assert.sameMembers(priority_instance.remove(key), [key]);
            chai_assert.isFalse(priority_instance.has(key));
        });
        it('Remove by key and special repository', function () {
            //
            var key = priority_instance.addContent('ABC', 100);
            chai_assert.isTrue(priority_instance.has(key));
            chai_assert.equal(priority_instance.remove(key, 200).length, 0);
            chai_assert.isTrue(priority_instance.has(key));
            chai_assert.sameMembers(priority_instance.remove(key, [200, 100]), [key]);
            chai_assert.isFalse(priority_instance.has(key));
        });

        it('Remove by content', function () {
            var content = 'ABC',
                key = priority_instance.addContent(content);
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
        beforeEach(function () {
            priority_instance.addContent('B', 10, {id: '1'});
            priority_instance.addContent('A', 100, {id: '2'});
            priority_instance.addContent('C', 1);
        });
        it('Include meta info', function () {
            chai_assert.deepEqual(
                priority_instance.getContents(),
                [{content: 'C', meta: undefined}, {content: 'B', meta: {id: '1'}}, {content: 'A', meta: {id: '2'}}]
            );
        });
        it('Content only', function () {
            chai_assert.deepEqual(priority_instance.getContents(true), ['C', 'B', 'A']);
        });
    });
    describe('Get status', function () {
        var status;
        beforeEach(function () {
            priority_instance.addContent('A', 1);
            priority_instance.addContent('B', 1);
            priority_instance.addContent('A', 2);

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