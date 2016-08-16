describe('Core', function () {
    var should = chai.Should(),
        chai_assert = chai.assert;

    it('MaDnh mixin success', function () {
        expect(_).to.have.property('M');
    });

    describe('Static properties', function () {
        it('VERSION', function () {
            expect(_.M).to.have.property('VERSION');
        });

        it('SORT_NUMBER', function () {
            var scores = [1, 10, 2, 21];
            scores.sort(_.M.SORT_NUMBER);

            chai_assert.deepEqual(scores, [1, 2, 10, 21]);
        });

        it('SORT_NUMBER_DESC', function () {
            var scores = [1, 10, 2, 21];
            scores.sort(_.M.SORT_NUMBER_DESC);

            chai_assert.deepEqual(scores, [21, 10, 2, 1]);
        });
        describe('IS_EQUAL', function () {
            it('Number vs number: 1 vs 1', function () {
                chai_assert.isTrue(_.M.IS_EQUAL(1, 1));
            });
            it('Number vs number as string: 1 vs `1`', function () {
                chai_assert.isTrue(_.M.IS_EQUAL(1, '1'));
            });
            it('Number vs boolean (true): 1 vs true', function () {
                chai_assert.isTrue(_.M.IS_EQUAL(1, true));
            });
            it('Number vs boolean (false): 1 vs false', function () {
                chai_assert.isFalse(_.M.IS_EQUAL(1, false));
            });

        });




    });
});