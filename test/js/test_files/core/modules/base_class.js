describe('MODULE - BaseClass', function () {
    var expect = chai.expect,
        chai_assert = chai.assert;

    it('Extend', function () {
        function MyClass() {
            M.BaseClass.call(this);
        }

        //
        var obj = new MyClass();
        //
        chai_assert.property(obj, 'type_prefix');
        chai_assert.propertyVal(obj, 'type_prefix', 'MyClass');
        chai_assert.property(obj, 'id');
        chai_assert.propertyVal(obj, 'id', 'MyClass_1');
    });
    it('Extend, change type_prefix', function () {
        function MyClass2() {
            this.type_prefix = 'Yahoo';
            M.BaseClass.call(this);
        }

        //
        var obj = new MyClass2();
        //
        chai_assert.property(obj, 'type_prefix');
        chai_assert.propertyVal(obj, 'type_prefix', 'Yahoo');
        chai_assert.property(obj, 'id');
        chai_assert.propertyVal(obj, 'id', 'Yahoo_1');
    });


});