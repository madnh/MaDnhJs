describe('MODULES - FLAG', function () {
    var expect = chai.expect,
        chai_assert = chai.assert;

    beforeEach(function () {
        _.M.FLAG.reset();
    });

    it('set flag', function () {
        var flag_name = 'TEST_FLAG';
        //
        chai_assert.isFalse(_.M.FLAG.has(flag_name));
        chai_assert.isFalse(_.M.FLAG.isFlagged(flag_name));
        //
        _.M.FLAG.flag(flag_name);
        //
        chai_assert.isTrue(_.M.FLAG.has(flag_name));
        chai_assert.isTrue(_.M.FLAG.isFlagged(flag_name));
    });

    it('set multiple flag', function () {
        var flag_names = ['TEST_MULTIPLE_FLAG_1', 'TEST_MULTIPLE_FLAG_2'];
        //
        chai_assert.isFalse(_.M.FLAG.has(flag_names[0]));
        chai_assert.isFalse(_.M.FLAG.isFlagged(flag_names[0]));
        chai_assert.isFalse(_.M.FLAG.has(flag_names[1]));
        chai_assert.isFalse(_.M.FLAG.isFlagged(flag_names[1]));
        //
        _.M.FLAG.flag(flag_names);
        //
        chai_assert.isTrue(_.M.FLAG.has(flag_names[0]));
        chai_assert.isTrue(_.M.FLAG.isFlagged(flag_names[0]));
        chai_assert.isTrue(_.M.FLAG.has(flag_names[1]));
        chai_assert.isTrue(_.M.FLAG.isFlagged(flag_names[1]));
    });
    it('set flag with status - TRUE', function () {
        var flag_name = 'TEST_FLAG_WITH_STATUS_TRUE';
        //
        chai_assert.isFalse(_.M.FLAG.has(flag_name));
        chai_assert.isFalse(_.M.FLAG.isFlagged(flag_name));
        //
        _.M.FLAG.flag(flag_name, true);
        //
        chai_assert.isTrue(_.M.FLAG.has(flag_name));
        chai_assert.isTrue(_.M.FLAG.isFlagged(flag_name));
    });
    it('set flag with status - FALSE', function () {
        var flag_name = 'TEST_FLAG_WITH_STATUS_FALSE';
        //
        chai_assert.isFalse(_.M.FLAG.has(flag_name));
        chai_assert.isFalse(_.M.FLAG.isFlagged(flag_name));
        //
        _.M.FLAG.flag(flag_name, false);
        //
        chai_assert.isTrue(_.M.FLAG.has(flag_name));
        chai_assert.isFalse(_.M.FLAG.isFlagged(flag_name));
    });
    it('get flag', function () {
        var flag_name = 'TEST_GET_FLAG';
        //
        _.M.FLAG.flag(flag_name);
        chai_assert.isTrue(_.M.FLAG.get(flag_name));
    });
    it('toggle', function () {
        var flag_name = 'TEST_FLAG_TOGGLE';
        _.M.FLAG.flag(flag_name);
        chai_assert.isTrue(_.M.FLAG.isFlagged(flag_name));
        _.M.FLAG.toggle(flag_name);
    });
});