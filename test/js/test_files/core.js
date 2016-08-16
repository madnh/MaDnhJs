describe('CORE', function () {
    var should = chai.Should(),
        chai_assert = chai.assert,
        _win = window;

    it('MADNH MIXIN SUCCESS', function () {
        expect(_).to.have.property('M');
    });

    describe('STATIC PROPERTIES', function () {
        it('VERSION', function () {
            expect(_.M).to.have.property('VERSION');
        });

        describe('SORT_NUMBER', function () {
            it('Array of numbers', function () {
                var scores = [1, 10, 2, 21];
                scores.sort(_.M.SORT_NUMBER);

                chai_assert.deepEqual(scores, [1, 2, 10, 21]);
            });

            it('Array of numbers and characters', function () {
                var scores = [1, 10, 'A', 2, 21];
                scores.sort(_.M.SORT_NUMBER);

                chai_assert.deepEqual(scores, [1, 10, 'A', 2, 21]);
            });
        });

        describe('SORT_NUMBER_DESC', function () {
            it('Array of numbers', function () {
                var scores = [21, 10, 2, 1];
                scores.sort(_.M.SORT_NUMBER_DESC);

                chai_assert.deepEqual(scores, [21, 10, 2, 1]);
            });

            it('Array of numbers and characters', function () {
                var scores = [21, 10, 'A', 2, 1];
                scores.sort(_.M.SORT_NUMBER_DESC);

                chai_assert.deepEqual(scores, [21, 10, 'A', 2, 1]);
            });
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
            it('Number (0) vs empty string: 0 vs ``', function () {
                chai_assert.isTrue(_.M.IS_EQUAL(0, ''));
            });

        });

        describe('IS_STRICT_EQUAL', function () {
            it('Number vs number: 1 vs 1', function () {
                chai_assert.isTrue(_.M.IS_STRICT_EQUAL(1, 1));
            });
            it('Number vs number as string: 1 vs `1`', function () {
                chai_assert.isFalse(_.M.IS_STRICT_EQUAL(1, '1'));
            });
            it('Number vs boolean (true): 1 vs true', function () {
                chai_assert.isFalse(_.M.IS_STRICT_EQUAL(1, true));
            });
            it('Number vs boolean (false): 1 vs false', function () {
                chai_assert.isFalse(_.M.IS_STRICT_EQUAL(1, false));
            });
            it('Number (0) vs empty string: 0 vs ``', function () {
                chai_assert.isFalse(_.M.IS_STRICT_EQUAL(0, ''));
            });
        });
    });

    describe('METHODS', function () {
        describe('_.M.appendDeep', function () {
            it('Test', function () {
                var obj = {a: 1, b: 2, c: {}, x: [456], y: true};
                //
                _.M.defineDeep(obj, 'c.d.e', 123);
                chai_assert.deepProperty(obj, 'c.d.e');
                //
                _.M.appendDeep(obj, 'c.d.e', 'yahoo');
                chai_assert.deepProperty(obj, 'c.d.e');
                chai_assert.equal(obj.c.d.e, '123yahoo');
                //
                _.M.appendDeep(obj, 'x', 'ahihi');
                chai_assert.isArray(obj.x);
                chai_assert.deepEqual(obj.x, [456, "ahihi"]);
                //
                _.M.appendDeep(obj, 'y', 789);
                chai_assert.isArray(obj.y);
                chai_assert.deepEqual(obj.y, [true, 789]);
            });
        });
        describe('_.M.asArray', function () {
            it('Parameter is array', function () {
                chai_assert.isArray(_.M.asArray([123]));
            });
            it('Parameter is not array', function () {
                chai_assert.isArray(_.M.asArray(123));
            });
        });
        describe('_.M.asObject', function () {
            it('Parameter is empty', function () {
                var obj = _.M.asObject();
                //
                chai_assert.isObject(obj);
            });
            it('Parameter is string', function () {
                var obj = _.M.asObject('yahoo');
                //
                chai_assert.isObject(obj);
            });
            it('Parameter is number', function () {
                var result = _.M.asObject(123);
                //
                chai_assert.isObject(result);
            });
            it('Parameters is string and number', function () {
                var obj = _.M.asObject('yahoo', 123);
                //
                chai_assert.isObject(obj);
                chai_assert.property(obj, 'yahoo', 'Object missing key');
                chai_assert.propertyVal(obj, 'yahoo', 123, 'Wrong object value');
            });


        });
        describe('_.M.async', function () {

        });
        describe('_.M.callFunc', function () {
            it('Call function object', function () {
                function test(old) {
                    return old + 1;
                }

                //
                chai_assert.equal(_.M.callFunc(test, 10), 11);
            });
            it('Call function as string', function () {
                window.func_as_string = function (old) {
                    return old + 1;
                };
                //
                chai_assert.doesNotThrow(function () {
                    _.M.callFunc('func_as_string', 10);
                });
            });
            it('Call callback with first parameter is array', function () {
                function test(arr) {
                    arr.push(4);

                    return arr;
                }

                //
                var result = _.M.callFunc(test, [[1, 2, 3]]);
                //
                chai_assert.isArray(result);
                chai_assert.deepEqual(result, [1, 2, 3, 4]);
            });
            it('Call function with context', function () {
                var obj = {name: 'Manh'};
                //
                function say_hi() {
                    return 'Hi, ' + this.name;
                }

                var result = _.M.callFunc(say_hi, [], obj);
                //
                chai_assert.equal(result, 'Hi, Manh');
            });
        });
        describe('_.M.capitalize', function () {
        });
        describe('_.M.chunk', function () {
        });
        describe('_.M.chunks', function () {
        });
        describe('_.M.className', function () {
        });
        describe('_.M.contentType', function () {
        });
        describe('_.M.currentID', function () {
        });
        describe('_.M.defineConstant', function () {
        });
        describe('_.M.defineDeep', function () {
        });
        describe('_.M.defineObject', function () {
        });
        describe('_.M.errorArgs', function () {
        });
        describe('_.M.errorCb', function () {
        });
        describe('_.M.escapeHTML', function () {
        });
        describe('_.M.firstNotEmpty', function () {
        });
        describe('_.M.getDeep', function () {
        });
        describe('_.M.hasDeep', function () {
        });
        describe('_.M.inherit', function () {
        });
        describe('_.M.isBlank', function () {
        });
        describe('_.M.isDefinedConstant', function () {
        });
        describe('_.M.isEven', function () {
        });
        describe('_.M.isInstanceOf', function () {
        });
        describe('_.M.isInteger', function () {
        });
        describe('_.M.isLikeString', function () {
        });
        describe('_.M.isMultiple', function () {
        });
        describe('_.M.isNumeric', function () {
        });
        describe('_.M.isOdd', function () {
        });
        describe('_.M.isPrimitiveType', function () {
        });
        describe('_.M.left', function () {
        });
        describe('_.M.logArgs', function () {
        });
        describe('_.M.logCb', function () {
        });
        describe('_.M.loop', function () {
        });
        describe('_.M.minMax', function () {
        });
        describe('_.M.nextID', function () {
        });
        describe('_.M.nowSecond', function () {
        });
        describe('_.M.oneOf', function () {
        });
        describe('_.M.optionalArgs', function () {
        });
        describe('_.M.padNumber', function () {
        });
        describe('_.M.pairsAsObject', function () {
        });
        describe('_.M.pluckBy', function () {
        });
        describe('_.M.randomInteger', function () {
        });
        describe('_.M.randomString', function () {
        });
        describe('_.M.removeItem', function () {
        });
        describe('_.M.repeat', function () {
        });
        describe('_.M.reverseString', function () {
        });
        describe('_.M.setup', function () {
        });
        describe('_.M.span', function () {
        });
        describe('_.M.toggle', function () {
        });
        describe('_.M.updateDeep', function () {
        });
        describe('_.M.valueAt', function () {
        });
        describe('_.M.warnArgs', function () {
        });
        describe('_.M.warnCb', function () {
        });
    });
});