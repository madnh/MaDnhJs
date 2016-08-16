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
            it('Call WAITER key', function () {
                function test(old) {
                    return old + 1;
                }

                var waiter_key = _.M.WAITER.add(test);
                //
                chai_assert.equal(_.M.callFunc(waiter_key, 10), 11);
            });
        });
        describe('_.M.capitalize', function () {
            var string = 'xin chao';

            it('All of words', function () {
                chai_assert.equal(_.M.capitalize(string), 'Xin Chao');
            });
            it('Only first word', function () {
                chai_assert.equal(_.M.capitalize(string, false), 'Xin chao');
            });

        });
        describe('_.M.chunk', function () {
            var arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                chunked = _.M.chunk(arr, 3);

            it('test', function () {
                chai_assert.isArray(chunked);
                chai_assert.lengthOf(chunked, 4);
                chai_assert.deepEqual(chunked[0], [0, 1, 2]);
                chai_assert.deepEqual(chunked[1], [3, 4, 5]);
                chai_assert.deepEqual(chunked[2], [6, 7, 8]);
                chai_assert.deepEqual(chunked[3], [9]);
            });

        });
        describe('_.M.chunks', function () {
            var arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                chunked = _.M.chunks(arr, 3);

            it('test', function () {
                chai_assert.isArray(chunked);
                chai_assert.lengthOf(chunked, 3);
                chai_assert.deepEqual(chunked[0], [0, 1, 2, 3]);
                chai_assert.deepEqual(chunked[1], [4, 5, 6, 7]);
                chai_assert.deepEqual(chunked[2], [8, 9]);
            });

        });
        describe('_.M.className', function () {
            it('Default', function () {
                chai_assert.equal(_.M.className(_.App), '[object Object]');
            });
            it('Constructor only', function () {
                chai_assert.equal(_.M.className(_.App, true), 'EventEmitter');
            });
        });
        describe('_.M.contentType', function () {
            it('test', function () {
                chai_assert.equal(_.M.contentType(123), 'number');
                chai_assert.equal(_.M.contentType('123'), 'string');
                chai_assert.equal(_.M.contentType('Yahooooooo'), 'string');
                chai_assert.equal(_.M.contentType(true), 'boolean');
                chai_assert.equal(_.M.contentType([1, 2]), 'Array');
                chai_assert.equal(_.M.contentType({color: 'red'}), 'Object');
                chai_assert.equal(_.M.contentType(_.App), 'EventEmitter');
            });
        });
        describe('_.M.currentID', function () {
            it('Default type', function () {
                chai_assert.equal(_.M.currentID(), 'unique_id_0');
                chai_assert.equal(_.M.currentID(null), 'unique_id_0');
                _.M.nextID();
                _.M.nextID();
                chai_assert.equal(_.M.currentID(), 'unique_id_1');
                chai_assert.equal(_.M.currentID(null), 'unique_id_1');
                chai_assert.equal(_.M.currentID(null, false), 1);
            });
            it('Custom type', function () {
                chai_assert.equal(_.M.currentID('superman'), 'superman_0');
                _.M.nextID('superman');
                _.M.nextID('superman');
                chai_assert.equal(_.M.currentID('superman'), 'superman_1');
                chai_assert.equal(_.M.currentID('superman', false), 1);
            });

        });
        describe('_.M.defineConstant', function () {
            it('Define constant by name and value', function () {
                _.M.defineConstant('TEST_DEFINECONSTANT', 123);
                chai_assert.property(_.M, 'TEST_DEFINECONSTANT');
                chai_assert.propertyVal(_.M, 'TEST_DEFINECONSTANT', 123);
            });
            it('Define constant by name (LOWERCASE) and value', function () {
                _.M.defineConstant('test_defineconstant_lower', 123);
                chai_assert.property(_.M, 'TEST_DEFINECONSTANT_LOWER');
                chai_assert.propertyVal(_.M, 'TEST_DEFINECONSTANT_LOWER', 123);
            });
            it('Define constant by object of name and value', function () {
                _.M.defineConstant({
                    X: 'A',
                    y: 'B'
                });
                chai_assert.property(_.M, 'X');
                chai_assert.propertyVal(_.M, 'X', 'A');
                chai_assert.property(_.M, 'Y');
                chai_assert.propertyVal(_.M, 'Y', 'B');
            });
        });
        describe('_.M.defineDeep', function () {
            it('test', function () {
                var obj = {a: 1, b: 2, c: {}};
                //
                _.M.defineDeep(obj, 'c.d.e', 123);
                //
                chai_assert.property(obj, 'a');
                chai_assert.propertyVal(obj, 'a', 1);
                //
                chai_assert.property(obj, 'b');
                chai_assert.propertyVal(obj, 'b', 2);
                //
                chai_assert.property(obj, 'c');
                chai_assert.isObject(obj.c);
                //
                chai_assert.deepProperty(obj, 'c.d.e');
                chai_assert.deepPropertyVal(obj, 'c.d.e', 123);
            });
        });
        describe('_.M.defineObject', function () {
            it('test', function () {
                var obj = _.M.defineObject({
                    name: 'Manh',
                    old: 123
                });
                //
                chai_assert.property(obj, 'name');
                chai_assert.propertyVal(obj, 'name', 'Manh');
                //
                chai_assert.property(obj, 'old');
                chai_assert.propertyVal(obj, 'old', 123);
                //
                obj.old = 456;
                chai_assert.propertyVal(obj, 'old', 123);
            });
        });
        describe('_.M.escapeHTML', function () {
            it('test', function () {
                chai_assert.equal(_.M.escapeHTML('<b>Yahoo</b>'), '&lt;b&gt;Yahoo&lt;&#x2f;b&gt;');
            });
        });
        describe('_.M.firstNotEmpty', function () {
            it('test', function () {
                chai_assert.equal(_.M.firstNotEmpty(['', 0, false, 123]), 123);
            })
        });
        describe('_.M.getDeep', function () {
            var obj = {
                a: 1,
                b: 2,
                c: {
                    d: {
                        e: 123
                    }
                }
            };

            it('Default', function () {
                chai_assert.equal(_.M.getDeep(obj, 'c.d.e'), 123);
                chai_assert.isUndefined(_.M.getDeep(obj, 'c.d.e.f'));
            });
            it('Default value', function () {
                chai_assert.equal(_.M.getDeep(obj, 'c.d.e', 'ABC'), 123);
                chai_assert.equal(_.M.getDeep(obj, 'c.d.e.f', 'ABC'), 'ABC');
            });


        });
        describe('_.M.hasDeep', function () {
            it('test', function () {
                var obj = {a: {a1: {a2: true}}, b: 'hihi'};
                //
                chai_assert.isTrue(_.M.hasDeep(obj, 'a.a1'));
                chai_assert.isFalse(_.M.hasDeep(obj, 'a.yahoo'));
                chai_assert.isTrue(_.M.hasDeep([obj, 123], 1));
                chai_assert.isFalse(_.M.hasDeep([obj, 123], 10));
            });
        });
        describe('_.M.inherit', function () {
            function SourceClass() {
                this.foo = 'bar';
            }

            SourceClass.prototype.test = function () {
                return 'SourceClass.foo: ' + this.foo;
            };

            function DestClass() {
                SourceClass.call(this)
            }

            _.M.inherit(DestClass, SourceClass);

            var obj = new DestClass();

            it('Has property', function () {
                chai_assert.property(obj, 'foo');
                chai_assert.propertyVal(obj, 'foo', 'bar');
                chai_assert.property(obj, 'test');
                chai_assert.isFunction(obj.test);
            });
            it('Correct property', function () {
                chai_assert.equal(obj.test(), 'SourceClass.foo: bar');
                obj.foo = 'Ohoho';
                chai_assert.equal(obj.test(), 'SourceClass.foo: Ohoho');

            });
            it('Inherit and override parent methods', function () {
                function FooClass() {
                    SourceClass.call(this)
                }

                //
                _.M.inherit(FooClass, SourceClass);
                //
                FooClass.prototype.test = function () {
                    return 'FooClass.foo: ' + this.foo;
                };
                //
                var obj_foo = new FooClass();
                //
                chai_assert.equal(obj_foo.test(), 'FooClass.foo: bar');
                obj_foo.foo = 'Ohoho';
                chai_assert.equal(obj_foo.test(), 'FooClass.foo: Ohoho');
                chai_assert.equal(obj_foo.constructor.prototype._super.test.call(obj_foo), 'SourceClass.foo: Ohoho');
            });
        });
        describe('_.M.isBlank', function () {
            it('test', function () {
                chai_assert.isTrue(_.M.isBlank(''));
                chai_assert.isTrue(_.M.isBlank('    '));
                chai_assert.isTrue(_.M.isBlank("\n"));
                chai_assert.isFalse(_.M.isBlank("abc\n\n"));
            });
        });
        describe('_.M.isDefinedConstant', function () {
            it('test', function () {
                chai_assert.isTrue(_.M.isDefinedConstant('VERSION'));
                chai_assert.isTrue(_.M.isDefinedConstant('vERsIoN'));
                chai_assert.isFalse(_.M.isDefinedConstant('UNDEFINED_CONST'));
            });
        });
        describe('_.M.isEven', function () {
            it('test', function () {
                chai_assert.isTrue(_.M.isEven(5));
                chai_assert.isTrue(_.M.isEven('11'));
                chai_assert.isFalse(_.M.isEven(4));
                chai_assert.isFalse(_.M.isEven('8'));
            })
        });
        describe('_.M.isInstanceOf', function () {
            it('test', function () {
                chai_assert.isFalse(_.M.isInstanceOf(_.M.isInstanceOf(123, 'Object'), 'EventEmitter'));
                chai_assert.isTrue(_.M.isInstanceOf(_.App, 'EventEmitter'));
                chai_assert.isTrue(_.M.isInstanceOf(new _.M.EventEmitter(), 'EventEmitter'));
                chai_assert.isTrue(_.M.isInstanceOf(123, 'Number'));
                chai_assert.isTrue(_.M.isInstanceOf('123', 'String'));
            });
        });
        describe('_.M.isInteger', function () {
            it('test', function () {
                chai_assert.isTrue(_.M.isInteger(123));
                chai_assert.isTrue(_.M.isInteger('123'));
                chai_assert.isFalse(_.M.isInteger(123.4));
                chai_assert.isFalse(_.M.isInteger(true));
                chai_assert.isFalse(_.M.isInteger([]));
            })
        });
        describe('_.M.isLikeString', function () {
            it('test', function () {
                chai_assert.isTrue(_.M.isLikeString('yahoo'));
                chai_assert.isTrue(_.M.isLikeString(123));
                chai_assert.isFalse(_.M.isLikeString({}));
                chai_assert.isFalse(_.M.isLikeString(true));
            })
        });
        describe('_.M.isMultiple', function () {
            it('test', function () {
                chai_assert.isTrue(_.M.isMultiple(12, 3));
                chai_assert.isTrue(_.M.isMultiple(12, '4'));
                chai_assert.isFalse(_.M.isMultiple(12, 0));
                chai_assert.isFalse(_.M.isMultiple(12, 5));
            });
        });
        describe('_.M.isNumeric', function () {
            it('test', function () {
                chai_assert.isTrue(_.M.isNumeric(123));
                chai_assert.isTrue(_.M.isNumeric(123.5));
                chai_assert.isTrue(_.M.isNumeric('123.5'));
                chai_assert.isFalse(_.M.isNumeric('123.5 yahoo'));
            })
        });
        describe('_.M.isOdd', function () {
            it('test', function () {
                chai_assert.isTrue(_.M.isOdd(4));
                chai_assert.isTrue(_.M.isOdd('8'));
                chai_assert.isFalse(_.M.isOdd(5));
                chai_assert.isFalse(_.M.isOdd('11'));
            });
        });
        describe('_.M.isPrimitiveType', function () {
            it('test', function () {
                chai_assert.isTrue(_.M.isPrimitiveType(123));
                chai_assert.isTrue(_.M.isPrimitiveType('123'));
                chai_assert.isTrue(_.M.isPrimitiveType(null));
                chai_assert.isTrue(_.M.isPrimitiveType());
                chai_assert.isFalse(_.M.isPrimitiveType(_.App));
            });
        });
        describe('_.M.left', function () {
            it('First 2 characters', function () {
                chai_assert.equal(_.M.left('ABC', 2), 'AB');
            });
            it('Legth is < 0', function () {
                chai_assert.equal(_.M.left('ABC', -2), '');
            });
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