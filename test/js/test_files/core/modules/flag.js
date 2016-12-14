describe('MODULES - FLAG', function () {
    var expect = chai.expect,
        chai_assert = chai.assert;

    beforeEach(function () {
        M.FLAG.reset();
    });

    it('set flag', function () {
        var flag_name = 'TEST_FLAG';
        //
        chai_assert.isFalse(M.FLAG.has(flag_name));
        chai_assert.isFalse(M.FLAG.isFlagged(flag_name));
        //
        M.FLAG.flag(flag_name);
        //
        chai_assert.isTrue(M.FLAG.has(flag_name));
        chai_assert.isTrue(M.FLAG.isFlagged(flag_name));
    });

    it('set multiple flag', function () {
        var flag_names = ['TEST_MULTIPLE_FLAG_1', 'TEST_MULTIPLE_FLAG_2'];
        //
        chai_assert.isFalse(M.FLAG.has(flag_names[0]));
        chai_assert.isFalse(M.FLAG.isFlagged(flag_names[0]));
        chai_assert.isFalse(M.FLAG.has(flag_names[1]));
        chai_assert.isFalse(M.FLAG.isFlagged(flag_names[1]));
        //
        M.FLAG.flag(flag_names);
        //
        chai_assert.isTrue(M.FLAG.has(flag_names[0]));
        chai_assert.isTrue(M.FLAG.isFlagged(flag_names[0]));
        chai_assert.isTrue(M.FLAG.has(flag_names[1]));
        chai_assert.isTrue(M.FLAG.isFlagged(flag_names[1]));
    });
    it('set flag with status - TRUE', function () {
        var flag_name = 'TEST_FLAG_WITH_STATUS_TRUE';
        //
        chai_assert.isFalse(M.FLAG.has(flag_name));
        chai_assert.isFalse(M.FLAG.isFlagged(flag_name));
        //
        M.FLAG.flag(flag_name, true);
        //
        chai_assert.isTrue(M.FLAG.has(flag_name));
        chai_assert.isTrue(M.FLAG.isFlagged(flag_name));
    });
    it('set flag with status - FALSE', function () {
        var flag_name = 'TEST_FLAG_WITH_STATUS_FALSE';
        //
        chai_assert.isFalse(M.FLAG.has(flag_name));
        chai_assert.isFalse(M.FLAG.isFlagged(flag_name));
        //
        M.FLAG.flag(flag_name, false);
        //
        chai_assert.isTrue(M.FLAG.has(flag_name));
        chai_assert.isFalse(M.FLAG.isFlagged(flag_name));
    });
    it('get flag', function () {
        var flag_name = 'TEST_GET_FLAG';
        //
        M.FLAG.flag(flag_name);
        chai_assert.isTrue(M.FLAG.get(flag_name));
    });
    it('toggle', function () {
        var flag_name = 'TEST_FLAG_TOGGLE';
        M.FLAG.flag(flag_name);
        chai_assert.isTrue(M.FLAG.isFlagged(flag_name));
        M.FLAG.toggle(flag_name);
    });
});