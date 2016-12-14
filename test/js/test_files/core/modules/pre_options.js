describe('MODULE - PreOptions', function () {
    var expect = chai.expect,
        chai_assert = chai.assert;

    function reset_data() {
        PreOptions.reset();
        chai_assert.isTrue(PreOptions.define('base', {name: 'M'}));
        chai_assert.isTrue(PreOptions.define('base2', {name: 'M'}));
    }

    describe('Define, check exists', function () {
        before(reset_data);

        it('Define', function () {
            chai_assert.isTrue(PreOptions.define('test', {name: 'M'}));
        });
        it('check exists', function () {
            chai_assert.isTrue(PreOptions.has('test'));
        });
        it('check non-exists', function () {
            chai_assert.isFalse(PreOptions.has('non-exists'));
        });
    });
    describe('Get', function () {
        before(reset_data);

        it('exists', function () {
            chai_assert.deepEqual(PreOptions.get('base'), {name: 'M'});
        });
        it('exists, use custom data', function () {
            chai_assert.deepEqual(PreOptions.get('base', {id: 55, old: 25}), {name: 'M', old: 25, id: 55});
        });
        it('non-exists', function () {
            chai_assert.throws(function () {
                PreOptions.get('non-exists');
            });
        });
    });
    describe('Update', function () {
        before(reset_data);

        it('exists', function () {
            chai_assert.isTrue(PreOptions.update('base', {name: 'M', old: 123}));
            chai_assert.isTrue(PreOptions.has('base'));
            chai_assert.deepEqual(PreOptions.get('base'), {name: 'M', old: 123});
        });
        it('non-exists', function () {
            chai_assert.isFalse(PreOptions.update('non-exists', {name: 'M', old: 123}));
            chai_assert.isFalse(PreOptions.has('non-exists'));
        });
    });
    describe('Extend', function () {
        before(reset_data);

        it('Extend normal', function () {
            chai_assert.doesNotThrow(function () {
                PreOptions.extend('base', 'extended', {from: 'VN'});
            });
            chai_assert.isTrue(PreOptions.has('base'));
            chai_assert.deepEqual(PreOptions.get('base'), {name: 'M'});
            chai_assert.isTrue(PreOptions.has('extended'));
            chai_assert.deepEqual(PreOptions.get('extended'), {name: 'M', from: 'VN'});
        });
        it('Extend, invalid source', function () {
            chai_assert.isFalse(PreOptions.has('non-exists'));
            chai_assert.throws(function () {
                PreOptions.extend('non-exists', 'new_options', {from: 'VN'});
            });
            chai_assert.isFalse(PreOptions.has('new_options'));
        });
        it('Extend, destination is exists', function () {
            chai_assert.isTrue(PreOptions.has('base'));

            var base = PreOptions.get('base');

            chai_assert.throws(function () {
                PreOptions.extend('base', 'base2', {from: 'VN'});
            });
            chai_assert.deepEqual(PreOptions.get('base'), base);
        });
        it('Extend, update when basement is change', function () {
            chai_assert.isTrue(PreOptions.has('extended'));
            chai_assert.deepEqual(PreOptions.get('extended'), {name: 'M', from: 'VN'});
            chai_assert.isTrue(PreOptions.update('base', {name: 'Manh', old: 25}));
            chai_assert.deepEqual(PreOptions.get('base'), {name: 'Manh', old: 25});
            chai_assert.deepEqual(PreOptions.get('extended'), {name: 'Manh', old: 25, from: 'VN'});
        });
    });
    describe('Base On', function () {
        before(reset_data);

        it('Normal', function () {
            chai_assert.doesNotThrow(function () {
                PreOptions.baseOn('base', 'extended', {from: 'VN'});
            });
            chai_assert.isTrue(PreOptions.has('base'));
            chai_assert.deepEqual(PreOptions.get('base'), {name: 'M'});
            chai_assert.isTrue(PreOptions.has('extended'));
            chai_assert.deepEqual(PreOptions.get('extended'), {name: 'M', from: 'VN'});
        });
        it('Invalid source', function () {
            chai_assert.isFalse(PreOptions.has('non-exists'));
            chai_assert.throws(function () {
                PreOptions.baseOn('non-exists', 'new_options', {from: 'VN'});
            });
            chai_assert.isFalse(PreOptions.has('new_options'));
        });
        it('Destination is exists', function () {
            chai_assert.isTrue(PreOptions.has('base'));

            var base = PreOptions.get('base');

            chai_assert.throws(function () {
                PreOptions.baseOn('base', 'base2', {from: 'VN'});
            });
            chai_assert.deepEqual(PreOptions.get('base'), base);
        });
        it('Immutable when basement is change', function () {
            chai_assert.isTrue(PreOptions.has('extended'));
            chai_assert.deepEqual(PreOptions.get('extended'), {name: 'M', from: 'VN'});
            chai_assert.isTrue(PreOptions.update('base', {name: 'Manh', old: 25}));
            chai_assert.deepEqual(PreOptions.get('base'), {name: 'Manh', old: 25});
            chai_assert.deepEqual(PreOptions.get('extended'), {name: 'M', from: 'VN'});
        });
    });
    describe('List', function () {
        before(reset_data);

        it('return array of strings', function () {
            chai_assert.isArray(PreOptions.list());
        });
        it('return an object', function () {
            chai_assert.isObject(PreOptions.list(true));
        });
    });

});