describe('FLAG', function () {
    var expect = chai.expect,
        chai_assert = chai.assert;

    beforeEach(function () {
        Flag.resetFlagStatus();
    });

    it('set flag', function () {
        var flag_name = 'TEST_FLAG';
        //
        chai_assert.isFalse(Flag.hasFlag(flag_name));
        chai_assert.isFalse(Flag.isFlagged(flag_name));
        //
        Flag.flag(flag_name);
        //
        chai_assert.isTrue(Flag.hasFlag(flag_name));
        chai_assert.isTrue(Flag.isFlagged(flag_name));
    });

    it('set multiple flag', function () {
        var flag_names = ['TEST_MULTIPLE_FLAG_1', 'TEST_MULTIPLE_FLAG_2'];
        //
        chai_assert.isFalse(Flag.hasFlag(flag_names[0]));
        chai_assert.isFalse(Flag.isFlagged(flag_names[0]));
        chai_assert.isFalse(Flag.hasFlag(flag_names[1]));
        chai_assert.isFalse(Flag.isFlagged(flag_names[1]));
        //
        Flag.flag(flag_names);
        //
        chai_assert.isTrue(Flag.hasFlag(flag_names[0]));
        chai_assert.isTrue(Flag.isFlagged(flag_names[0]));
        chai_assert.isTrue(Flag.hasFlag(flag_names[1]));
        chai_assert.isTrue(Flag.isFlagged(flag_names[1]));
    });
    it('set flag with status - TRUE', function () {
        var flag_name = 'TEST_FLAG_WITH_STATUS_TRUE';
        //
        chai_assert.isFalse(Flag.hasFlag(flag_name));
        chai_assert.isFalse(Flag.isFlagged(flag_name));
        //
        Flag.flag(flag_name, true);
        //
        chai_assert.isTrue(Flag.hasFlag(flag_name));
        chai_assert.isTrue(Flag.isFlagged(flag_name));
    });
    it('set flag with status - FALSE', function () {
        var flag_name = 'TEST_FLAG_WITH_STATUS_FALSE';
        //
        chai_assert.isFalse(Flag.hasFlag(flag_name));
        chai_assert.isFalse(Flag.isFlagged(flag_name));
        //
        Flag.flag(flag_name, false);
        //
        chai_assert.isTrue(Flag.hasFlag(flag_name));
        chai_assert.isFalse(Flag.isFlagged(flag_name));
    });
    it('get flag status', function () {
        var flag_name = 'TEST_GET_FLAG_STATUS', undefined_flag = 'UNDEFINED_FLAG';
        //
        Flag.flag(flag_name);
        chai_assert.isTrue(Flag.flagStatus(flag_name));
        chai_assert.isFalse(Flag.flagStatus(undefined_flag));
    });
    it('toggle', function () {
        var flag_name = 'TEST_FLAG_TOGGLE';
        Flag.flag(flag_name);
        chai_assert.isTrue(Flag.isFlagged(flag_name));
        Flag.toggleFlag(flag_name);
    });
});