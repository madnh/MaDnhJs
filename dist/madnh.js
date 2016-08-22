/**
 *
 * @namespace _.M
 */
;(function (_) {
    /*
     |--------------------------------------------------------------------------
     | Type Definitions
     |--------------------------------------------------------------------------
     */
    /**
     * Loop callback. Useful in _.each, _.map, _.omit,...
     * @callback loopCallback
     * @param value Item value
     * @param key Item name/index
     * @param object object of items
     *
     * @see http://underscorejs.org/#each
     * @see http://underscorejs.org/#map
     * @see http://underscorejs.org/#omit
     *
     * @example <caption>Alerts each number value in turn...</caption>
     * _.each([1, 2, 3], alert);
     * _.each({one: 1, two: 2, three: 3}, alert);
     * @example <caption>Log to console each number value in turn...</caption>
     * var logger = function(item, key, object){
     *  console.log(key, '=>', item, '<------ Object', object);
     * };
     * _.each([1, 2, 3], logger);
     * _.each({one: 1, two: 2, three: 3}, logger);
     *
     */

    /*
     |--------------------------------------------------------------------------
     | Core
     |--------------------------------------------------------------------------
     */

    /**
     * MaDnhJS version
     * @constant {string} VERSION
     * @default
     */
    var version = '1.2.8';

    var M = {};
    Object.defineProperty(M, 'VERSION', {
        value: version
    });

    var slice = Array.prototype.slice;


    /** Mixin method "module" to UnderscoreJS
     * This method help us to structure UnderscoreJS extensions as module
     */
    _.mixin({
        /**
         * @memberOf _
         * @param name Name of module, UPPER CASE
         * @param exports Module export object
         */
        module: function (name, exports) {
            Object.defineProperty(_, name.toString(), {
                value: exports
            });
        }
    });
    _.module('M', M);

    /**
     * Slice arguments of a function as array
     * @param args
     * @param {Number} [start]
     * @param {Number} [end]
     * @return {*}
     */
    M.sliceArguments = function (args, start, end) {
        return slice.apply(args, slice.call(arguments, 1));
    };

    M.beNumber = function (value, default_value) {
        value = parseFloat(value);

        if (M.isNumeric(value)) {
            return value;
        }
        if (_.isUndefined(default_value)) {
            return 0;
        }

        return M.isNumeric(default_value) ? parseFloat(default_value) : M.beNumber(default_value, 0);
    };
    /**
     * Make sure function parameter is array
     * @param {*} value
     * @returns {Array}
     * @example
     * _.M.beArray([123]) => [123]
     * _.M.beArray(123) => [123]
     */
    M.beArray = function (value) {
        if (_.isArray(value)) {
            return value;
        }
        return [value];
    };

    /**
     * Make sure first argument is object or arguments are name and value of object
     * @param {*} [name]
     * @param {*} [value]
     * @returns {*}
     * @example
     * _.M.beObject(); //{}
     * _.M.beObject(['foo', 'bar', 123]); //{0: "a", 1: 'bar', 2: 123}
     * _.M.beObject('yahoo'); //{0: "yahoo"}
     * _.M.beObject(235); //{0: 235}
     * _.M.beObject('yahoo', 123); //{yahoo: 123}
     * _.M.beObject({yahoo: 123, goooo:'ASDWd'}); //{yahoo: 123, goooo:'ASDWd'}
     *
     */
    M.beObject = function (name, value) {
        switch (true) {
            case arguments.length == 1:
                if (_.isObject(name)) {
                    return name;
                } else if (_.isArray(name) || _.isArguments(name)) {
                    return _.object(Object.keys(name), name);
                }

                return {0: name};
                break;

            case arguments.length >= 2:
                if (_.isObject(name)) {
                    return name;
                }
                var obj = {};

                obj[name] = value;

                return obj;
        }

        return {};
    };

    var cast_types = {};

    cast_types['string'] = function (value) {
        return value + '';
    };
    cast_types['boolean'] = function (value) {
        return Boolean(value);
    };

    cast_types['number'] = function (value) {
        return M.beNumber(value);
    };
    cast_types['integer'] = function (value) {
        return Math.floor(M.beNumber(value));
    };
    cast_types['array'] = M.beArray;
    cast_types['object'] = function (value) {
        return M.beObject(value);
    };

    /**
     * Convert array|object item to other type. Support types:
     * - string
     * - boolean
     * - number
     * - integer
     * - array
     * - object
     *
     * @param object
     * @param type
     * @return {Array|object}
     * @throws Error when cast type is unsupported
     */
    M.castItemsType = function (object, type) {
        if (!cast_types.hasOwnProperty(type)) {
            throw new Error('Invalid cast type. Available types are: string, number, integer, array and object');
        }
        if (_.isArray(object)) {
            return _.map(_.clone(object), cast_types[type]);
        }

        return _.mapObject(_.clone(object), cast_types[type]);
    };

    /**
     * Loop over array or object like _.each but breakable
     * @param {object|array} obj Loop object
     * @param {loopCallback} callback callback apply on every item, return break value to break the loop
     * @param {string} [break_on=break] Value of callback result that break the loop, default is 'break'
     * @returns {*}
     * @example
     * _.M.loop([1,2,3,4,5], function(item){
     *  console.log('Number', item);
     *  if(item > 3){
     *      return 'break';
     *  }
     * });
     * //Console will log:
     * // Number 1
     * // Number 2
     * // Number 3
     *  @example
     * _.M.loop([1,2,3,4,5], function(item){
     *  console.log('Number', item);
     *  if(item > 3){
     *      return 'yahoo';
     *  }
     * }, 'yahoo');
     * //Console will log:
     * // Number 1
     * // Number 2
     * // Number 3
     *
     */
    M.loop = function (obj, callback, break_on) {
        var i, length;
        if (_.isUndefined(break_on)) {
            break_on = 'break';
        }
        if (_.isArray(obj)) {
            for (i = 0, length = obj.length; i < length; i++) {
                if (callback(obj[i], i, obj) === break_on) {
                    break;
                }
            }
        } else {
            var keys = _.keys(obj);
            for (i = 0, length = keys.length; i < length; i++) {
                if (callback(obj[keys[i]], keys[i], obj) === break_on) {
                    break;
                }
            }
        }
        return obj;
    };

    /**
     * Remove object keys
     * @param {object} obj Object
     * @param {string[]|loopCallback} args Array of item name or callback. If use callback then callback must return
     *     true/false to remove/keep item
     */
    M.removeItem = function (obj, args) {
        var keys = _.flatten(slice.call(arguments, 1));
        var removed = [], old_items = Object.keys(obj);

        if (keys.length == 1 && _.isFunction(keys[0])) {
            obj = _.omit(obj, keys[0]);
            removed = _.difference(old_items, _.keys(obj));
        } else {
            _.each(keys, function (key) {
                if (_.has(obj, key)) {
                    removed.push(key);
                    obj[key] = undefined;
                    delete  obj[key];
                }
            });
        }

        return removed;
    };

    var unique_id_current_status = {};

    /**
     * Return Next ID of type, start from 1
     * @param {string} [type="unique_id"] Type of ID
     * @param {boolean} [type_as_prefix = true]  Use type as prefix of return ID
     * @returns {string|number}
     * @example <caption>Default type</caption>
     * _.M.nextID(); //unique_id_1
     * _.M.nextID(); //unique_id_2
     * _.M.nextID(null, false); //3
     * _.M.nextID('superman'); //superman_1
     * _.M.nextID('superman'); //superman_2
     * _.M.nextID(); //unique_id_4
     * _.M.nextID('superman', false); //3
     *
     */
    M.nextID = function (type, type_as_prefix) {
        if (_.isEmpty(type)) {
            type = 'unique_id';
        }
        if (!unique_id_current_status.hasOwnProperty(type)) {
            unique_id_current_status[type] = 1;
        } else {
            unique_id_current_status[type]++;
        }

        return get_unique_id_with_prefix(type, unique_id_current_status[type], type_as_prefix);
    };

    /**
     * Return current ID of type
     * @param {string} [type="unique_id"] Type of ID
     * @param {boolean} [type_as_prefix = true] Use type as prefix of return ID
     * @returns {boolean|string|number}
     * @example
     * _.M.currentID(); //false
     * _.M.nextID(); //unique_id_0
     * _.M.nextID(); //unique_id_1
     * _.M.currentID(); //unique_id_1
     * _.M.currentID(null, false); //1
     * _.M.currentID('superman'); //false
     * _.M.nextID('superman'); //superman_0
     * _.M.nextID('superman'); //superman_1
     * _.M.currentID('superman'); //superman_1
     * _.M.currentID('superman', false); //1
     * _.M.nextID(); //2
     * _.M.currentID(); //unique_id_2
     */
    M.currentID = function (type, type_as_prefix) {
        if (_.isEmpty(type)) {
            type = 'unique_id';
        }

        if (!unique_id_current_status.hasOwnProperty(type)) {
            return false;
        }

        return get_unique_id_with_prefix(type, unique_id_current_status[type], type_as_prefix);
    };

    /**
     *
     * @param {string} type a type, do not require existed
     * @param {number} [value]
     * @returns {number|*}
     */
    M.resetID = function (type, value) {
        if (_.isEmpty(type)) {
            type = 'unique_id';
        }

        if (_.isUndefined(value)) {
            delete unique_id_current_status[type];
        } else {
            value = arguments.length > 1 ? M.beNumber(value) : 0;
            value = Math.max(value, 0);
            unique_id_current_status[type] = value;
        }

        return value;
    };

    function get_unique_id_with_prefix(type, id, type_as_prefix) {
        if (type_as_prefix || _.isUndefined(type_as_prefix)) {
            return type + '_' + id;
        }

        return id;
    }


    /**
     * Get constructor name of object
     * @param obj
     * @param {boolean} [constructor_only = false] Return object's constructor name only
     * @returns {string}
     * @example
     * _.M.className(_.App); //"[object Object]"
     * _.M.className(_.App, true); //App
     * _.M.className(new _.M.EventEmitter(), true); //EventEmitter
     */
    M.className = function (obj, constructor_only) {
        if (constructor_only) {
            return obj.constructor.name;
        }
        return Object.prototype.toString.call(obj);
    };

    /**
     * Get type of content. If is object then return constructor name
     * @param content
     * @returns {string}
     * @example
     * _.M.contentType(123); //number
     * _.M.contentType('123'); //string
     * _.M.contentType('Yahooooooo'); //string
     * _.M.contentType(true); //boolean
     * _.M.contentType(true); //boolean
     * _.M.contentType([1,2]); //array
     * _.M.contentType(_.App); //App
     */
    M.contentType = function (content) {
        var type = typeof content;

        if (type === 'object') {
            var class_name = M.className(content, true);

            if (class_name) {
                return class_name;
            }
        }

        return type;
    };

    /**
     * Check object is an instance of a constructor type
     * @param {*} obj
     * @param {string} class_name Name of class
     * @returns {boolean}
     * @example
     * _.M.isInstanceOf(_.App, 'App');//true
     * _.M.isInstanceOf(123, 'Object'); //false
     * _.M.isInstanceOf(123, 'Number'); //true
     * _.M.isInstanceOf('123', 'String'); //true
     * _.M.isInstanceOf(new _.M.EventEmitter(), 'EventEmitter'); //true
     */
    M.isInstanceOf = function (obj, class_name) {
        return this.className(obj, true) === class_name;
    };

    /**
     * Check if object is primitive type: null, string, number, boolean
     * @param obj
     * @returns {boolean}
     * @example
     * _.M.isPrimitiveType(123); //true
     * _.M.isPrimitiveType('123'); //true
     * _.M.isPrimitiveType(null); //true
     * _.M.isPrimitiveType(); //true
     * _.M.isPrimitiveType(_.App); //false
     */
    M.isPrimitiveType = function (obj) {
        var type = typeof obj;
        return obj == null || type === 'string' || type === 'number' || type === 'boolean';
    };


    /**
     * Merge multiple array
     * @return {Array}
     */
    M.mergeArray = function () {
        var result = [];

        _.each(arguments, function (arr) {
            _.each(arr, function (item) {
                result.push(item);
            });
        });

        return result;
    };

    M.mergeObject = function () {
        var result = {}, next_index = 0;

        _.each(arguments, function (obj) {
            if (_.isArray(obj) || !_.isObject(obj)) {
                obj = M.beArray(obj);
                obj = _.object(_.range(next_index, next_index += obj.length), obj);
            }

            _.extend(result, obj);
        });

        return result;
    };

    function is_diff_strict_cb(value_1, value_2) {
        return value_1 !== value_2;
    }

    function is_diff_loose_cb(value_1, value_2) {
        return value_1 != value_2;
    }

    /**
     * Get dirty of object with others object
     * @param {function} cb Callback return true if 2 item is difference
     * @param object
     * @param [others...]
     * @return {{}}
     */
    function diff_object(cb, object, others) {
        if (arguments.length < 2) {
            return {};
        }

        var result = {};

        if (!_.isFunction(cb)) {
            cb = cb ? is_diff_strict_cb : is_diff_loose_cb;
        }

        others = M.mergeObject.apply(M, slice.call(arguments, 2));

        _.each(object, function (value, key) {
            if (!others.hasOwnProperty(key)) {
                result[key] = value;
            } else {
                if (cb(value, others[key])) {
                    result[key] = value;
                }
            }
        });

        return result;
    }

    /**
     * Get dirty of object with others object. Strict comparison
     * @param {object} object
     * @param {object} others
     * @return {*}
     */
    M.diffObject = function (object, others) {
        var args = _.flatten(_.toArray(arguments));

        args.unshift(is_diff_strict_cb);

        return diff_object.apply(null, args);
    };

    /**
     * Get dirty of object with others object. Loose comparison
     * @param callback
     * @param object
     * @param others
     * @return {*}
     */
    M.diffObjectLoose = function (callback, object, others) {
        var args = _.toArray(arguments);

        args.unshift(is_diff_loose_cb);

        return diff_object.apply(null, args);
    };

    M.diffObjectWithCallback = function (callback, object, others) {
        return diff_object.apply(null, slice.apply(arguments))
    };

    /**
     * Check if value has a deep path
     * @param {*} object
     * @param {string|number|[]} deep
     * @param {string} [separator='.'] Character to split deep string to array of deeps
     * @returns {boolean}
     * @example
     * var obj = {a: {a1: {a2: true}}, b: 'hihi'};
     * _.M.hasDeep(obj, 'a.a1'); //true
     * _.M.hasDeep(obj, 'a.yahoo'); //false
     * _.M.hasDeep([obj, 123], 1); //true
     * _.M.hasDeep([obj, 123], 10); //false
     */
    M.hasDeep = function (object, deep, separator) {
        if (!_.isArray(deep)) {
            deep = (deep + '').split(separator || '.');
        }

        var pointer = object, field;

        while (field = deep.shift()) {
            if (pointer.hasOwnProperty(field)) {
                pointer = pointer[field];
                continue;
            }

            return false;
        }

        return true;
    };

    /**
     * Define object value in a deep path
     * @param {*} object
     * @param {string|[]} deep
     * @param {*} value
     * @param {string} [separator='.']
     */
    M.defineDeep = function (object, deep, value, separator) {
        if (!_.isArray(deep)) {
            deep = (deep + '').split(separator || '.');
        }
        var pointer = object, field, last_field = deep.pop();

        while (field = deep.shift()) {
            if (!pointer.hasOwnProperty(field)) {
                pointer[field] = {};
            }
            pointer = pointer[field];
        }

        pointer[last_field] = value;
    };

    /**
     * Get object's value at a deep path
     * @param {*} object
     * @param {string|[]} deep
     * @param {*} [default_value=undefined]
     * @param {string} [separator='.']
     * @returns {*}
     */
    M.getDeep = function (object, deep, default_value, separator) {
        if (!_.isArray(deep)) {
            deep = (deep + '').split(separator || '.');
        }

        var pointer = object, field, found = true;

        while (field = deep.shift()) {
            if (pointer.hasOwnProperty(field)) {
                pointer = pointer[field];
                continue;
            }

            found = false;
            break;
        }

        if (found) {
            return pointer;
        }

        return default_value;
    };

    M.updateDeep = function (object, deep, callback) {
        if (!M.hasDeep(object, deep)) {
            throw new Error('Update undefined deep');
        }
        var deep_value = _.M.getDeep(object, deep);

        M.defineDeep(object, deep, callback(deep_value));
    };

    M.appendDeep = function (object, deep, value) {
        M.updateDeep(object, deep, function (current_value) {
            if (M.isLikeString(current_value)) {
                current_value += value + '';
            } else if (_.isArray(current_value)) {
                current_value.push(value);
            } else {
                current_value = [current_value, value];
            }

            return current_value;
        });
    };

    /**
     * Make sure that a value is in a range
     * @param {number} value
     * @param {number} min
     * @param {number} max
     * @returns {number}
     * @example
     * _.M.minMax(10, -15, 50); //10
     * _.M.minMax(10, 20, 50); //20
     * _.M.minMax(100, 20, 50); //50
     */
    M.minMax = function (value, min, max) {
        return Math.max(min, Math.min(value, max));
    };

    /**
     * Get random string
     * @param {number} [length]
     * @param {string} [chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ']
     * @returns {string}
     * @example
     * _.M.randomString(10); //'mYJeC1xBcl'
     * _.M.randomString(10, 'ABCDEF'); //'CDABBEFADE'
     */
    M.randomString = function (length, chars) {
        var result = '', chars_length, i;
        if (_.isUndefined(chars) || !chars.toString().length) {
            chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        }
        chars_length = chars.length;

        length = M.beNumber(length, 10);

        for (i = length; i > 0; --i) {
            result += chars[Math.round(Math.random() * (chars_length - 1))];
        }
        return result;
    };

    M.randomInteger = function (min, max) {
        if (arguments.length == 0) {
            min = 0;
            max = 10;
        } else if (arguments.length == 1) {
            max = 0;
        }
        var tmp = max;

        max = Math.max(Math.floor(min), Math.floor(max));
        min = Math.min(Math.floor(tmp), Math.floor(min));

        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    /**
     * Setup a object with field name and value or object of fields
     * @param {Object} object host object
     * @param {(string|Object)} option field name of object of fields
     * @param {*} value value of field when option param is field name
     * @returns {*}
     * @example
     * var obj = {a: 'A', b: 'B'}
     * _.M.setup(obj, 'a', '123'); //obj -> {a: '123', b: 'B'}
     * _.M.setup(obj, {b: 'Yahoo', c: 'ASD'}); //obj -> {a: 123, b: 'Yahoo', c: 'ASD'}
     */
    M.setup = function (object, option, value) {
        if (!_.isObject(object)) {
            object = {};
        }
        switch (arguments.length) {
            case 2:
                if (_.isObject(option)) {
                    object = _.extend({}, object, option);
                }
                break;
            case 3:
                object[option] = value;
        }

        return object;
    };

    /**
     * Return first value of arguments that isn't empty
     * @returns {*}
     * @example
     * _.M.firstNotEmpty(['', 0, false, 123]); //123
     */
    M.firstNotEmpty = function () {
        var arr = _.flatten(_.toArray(arguments));

        return _.find(arr, function (value) {
            if (_.isString(value)) {
                return value.trim().length > 0;
            }
            if (M.isNumeric(value)) {
                var parsedValue = parseFloat(value);

                return parsedValue !== 0 && !_.isNaN(parsedValue) && _.isFinite(parsedValue);
            }
            if (value === true) {
                return true;
            }

            return !_.isEmpty(value);
        });
    };

    /**
     * Like _.pairs but array item is an object with field is "key", "value"
     * @param object
     * @returns {Array}
     * @example
     * _.M.pairsAsObject({one: 1, two: 2, three: 3});
     * => [{key: 'one', value: 1},{key: 'two', value: 2},{key: 'three', value: 3}]
     */
    M.pairsAsObject = function (object) {
        var result = [];

        _.each(object, function (value, key) {
            result.push({
                key: key,
                value: value
            });
        });

        return result;
    };
    /**
     * A convenient version of what is perhaps the most common use-case for map: extracting a list of property values, with a column as key.
     * @param {object[]} collection
     * @param {string} key_field If key field not found then use as "undefined"
     * @param {string} value_field If value field not found then use as "undefined"
     * @returns {{}}
     * @example
     * var stooges = [{name: 'moe', id: 1, age: 40}, {name: 'larry', id: 2, age: 50}, {name: 'curly', id: 4, age: 60}];
     * _.M.pluckBy(stooges, 'id', 'name');
     * => {1: 'moe', 2: 'larry', 3: 'curly'}
     */
    M.pluckBy = function (collection, key_field, value_field) {
        var result = {};

        _.each(collection, function (object) {
            var key = object.hasOwnProperty(key_field) ? object[key_field] : undefined;
            var value = object.hasOwnProperty(value_field) ? object[value_field] : undefined;

            result[key] = value;
        });

        return result;
    };

    /**
     * Repeat value by times
     * @param {*} value
     * @param {number} times Repeat times, >= 0
     * @param {boolean} [as_array = false] Return result as array, default is return as string
     * @returns {*}
     * @example
     * _.M.repeat('a', 5); //'aaaaa'
     * _.M.repeat('a', 5, true); //['a', 'a', 'a', 'a', 'a']
     *
     */
    M.repeat = function (value, times, as_array) {
        var result = [];
        times = Math.max(0, times);
        for (var i = 0; i < times; i++) {
            result.push(value);
        }
        return as_array ? result : result.join('');
    };

    /**
     * Add missing value to fit value's length
     * @param {string|number} value
     * @param {number} length Number of result need to fit
     * @param {string} span_character add value
     * @param {boolean} [before = true]
     * @returns {string}
     * @example
     * _.M.span(123, 5, '_'); //'__123'
     * _.M.span(123, 5, '_', false); //'123__'
     * _.M.span('ABCDEF', 5, '_'); //'ABCDEF'
     */
    M.span = function (value, length, span_character, before) {
        if (_.isUndefined(before)) {
            before = true;
        }
        value += '';
        if (value.length < length) {
            span_character = M.repeat((span_character + '').charAt(0), length - value.length);
            value = before ? span_character + '' + value : value + '' + span_character;
        }
        return value;
    };

    /**
     * Get n characters from left of string
     * @param {string} string
     * @param {number} [length = 1] Number of characters
     * @returns {string}
     * @example
     * _.M.left('ABC', 2); //'AB'
     */
    M.left = function (string, length) {
        if (_.isUndefined(length)) {
            length = 1;
        }

        if (length < 1) {
            return '';
        }
        return string.toString().substr(0, length);
    };

    /**
     * Get n characters from right of value
     * @param {string} string
     * @param {number} [length = 1] Number of characters, default is 1
     * @returns {string}
     * @example
     * _.M.right('ABC', 2); //'BC'
     */
    M.right = function (string, length) {
        var tmpVal = string.toString();

        if (_.isUndefined(length)) {
            length = 1;
        }
        if (length < 1) {
            return '';
        }

        return tmpVal.substr(Math.max(0, tmpVal.length - length), length);
    };

    /**
     * Padding number with 0 and sign
     * @param {number} num
     * @param {number} place
     * @param {boolean} sign Include number sign. If number is less than 0 then include sign, override this parameter
     * @param {number} [base=10] Base of number
     * @returns {string}
     * @example
     * _.M.padNumber(2,2); //"02"
     * _.M.padNumber(2,15); //"000000000000002"
     * _.M.padNumber(-2,2) //"-02"
     * _.M.padNumber(-2,2, true) //"-02"
     * _.M.padNumber(2,2, true); //"+02"
     *
     */
    M.padNumber = function (num, place, sign, base) {
        var str = Math.abs(num).toString(base || 10);
        str = this.repeat('0', place - str.replace(/\.\d+/, '').length) + str;
        if (sign || num < 0) {
            str = (num < 0 ? '-' : '+') + str;
        }
        return str;
    };

    /**
     * Check value is numeric
     * @param value
     * @returns {boolean}
     *
     * @example
     * _.M.isNumeric(123); //true
     * _.M.isNumeric(123.5); //true
     * _.M.isNumeric('123.5'); //true
     */
    M.isNumeric = function (value) {
        return !_.isArray(value) && (value - parseFloat(value) + 1) >= 0;
    };

    /**
     * Check if numeric value is integer
     * @param {number} number
     * @returns {boolean}
     * @example
     * _.M.isInteger(123); //true
     * _.M.isInteger(123.5); //false
     * _.M.isInteger('123'); //true
     */
    M.isInteger = function (number) {
        return M.isNumeric(number) && number % 1 === 0;
    };

    /**
     * Check if a numeric is multiple of other
     * @param {number} n1
     * @param {number} n2
     * @returns {boolean}
     * @example
     * _.M.isMultiple(12, 3); //true
     * _.M.isMultiple(12, 5); // false
     * _.M.isMultiple(12, '4'); // true
     * _.M.isMultiple(12, 0); //false
     */
    M.isMultiple = function (n1, n2) {
        try {
            return n1 % n2 === 0;
        } catch (e) {
            return false;
        }
    };
    /**
     * Check if a numeric is odd
     * @param number
     * @returns {boolean}
     * @example
     * _.M.isOdd(5); //false
     * _.M.isOdd(4); //true
     * _.M.isOdd('11'); //false
     * _.M.isOdd('8'); //true
     */
    M.isOdd = function (number) {
        return M.isMultiple(number, 2);
    };
    /**
     * Check if a number is even
     * @param number
     * @returns {boolean}
     * @example
     * _.M.isEven(5); //true
     * _.M.isEven(4); //false
     * _.M.isEven('11'); //true
     * _.M.isEven('8'); //false
     */
    M.isEven = function (number) {
        return !M.isMultiple(number, 2);
    };

    /**
     * Make sure value is in array
     * @param {*} value
     * @param {Array} values
     * @param {*} [default_value] Default value if not found value in values
     * @returns {*} If found then return value itself, else, return default_value or first item of array
     * @example
     * var items = [1,2,3,'a'];
     * _.M.oneOf(1, items); // 1
     * _.M.oneOf(0, items); // 1
     * _.M.oneOf('a', items); // 'a'
     * _.M.oneOf('b', items, 'C'); // 'C'
     */
    M.oneOf = function (value, values, default_value) {
        if (-1 !== values.indexOf(value)) {
            return value;
        }

        if (arguments.length >= 3) {
            return default_value;
        }

        return _.first(values);
    };

    /**
     * Capitalize a string
     * @param {string} str
     * @param {boolean} [all = true] True - all words of string, False - Only first word
     * @returns {string}
     * @example
     * _.M.capitalize('xin chao'); //'Xin Chao'
     * _.M.capitalize('xin chao', false); //'Xin chao'
     */
    M.capitalize = function (str, all) {
        all = _.isUndefined(all) ? true : Boolean(all);

        return str.replace(all ? /(^|\s)[a-z]/g : /(^|\s)[a-z]/, function (text) {
            return text.toUpperCase();
        });
    };

    /**
     * Check input is string or number
     * @param {*} value
     * @returns {boolean}
     * @example
     * _.M.isLikeString('yahoo'); // true
     * _.M.isLikeString(123); // true
     * _.M.isLikeString({}); // false
     * _.M.isLikeString(true); // false
     */
    M.isLikeString = function (value) {
        return _.isString(value) || this.isNumeric(value);
    };

    /**
     * Return reverse of string
     * @param {string} str
     * @returns {string}
     * @example
     * _.M.reverseString('yahoo'); // 'oohay'
     */
    M.reverseString = function (str) {
        return str.split('').reverse().join('');
    };
    /**
     * Check if a trimmed string is empty
     * @param {string} str
     * @returns {boolean}
     * @example
     * _.M.isBlank('abc'); // false
     * _.M.isBlank(''); // true
     * _.M.isBlank('    '); // true
     */
    M.isBlank = function (str) {
        return String(str).trim().length === 0;
    };

    /**
     * Return current unix timestamp as seconds
     * @returns {Number}
     * @example
     * _.M.nowSecond(); // 1450622822
     */
    M.nowSecond = function () {
        return parseInt(Math.floor(_.now() / 1000));
    };

    /**
     * Escape URL
     * @param {string} url
     * @param {boolean} [param = false] Include param?
     * @returns {string}
     */
    M.escapeURL = function (url, param) {
        return param ? encodeURIComponent(url) : encodeURI(url);
    };

    /**
     * Unescape URL
     * @param {string} url
     * @param {boolean} [param = false] Include param?
     * @returns {string}
     */
    M.unescapeURL = function (url, param) {
        return param ? decodeURI(url) : decodeURIComponent(url);
    };

    /**
     * Escape HTML
     * @param content
     * @returns {string}
     * @example
     * _.M.escapeHTML('<b>Yahoo</b>'); //&lt;b&gt;Yahoo&lt;&#x2f;b&gt;"
     */
    M.escapeHTML = function (content) {
        return (content + '').replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;')
            .replace(/\//g, '&#x2f;').toString();
    };

    /**
     * Return array value at index
     * @param {string|number|Array} array String or array of items
     * @param {number} index
     * @returns {*}
     * @example
     * var arr = ['a', 'b', 'c'];
     * var str = 'Yahoo';
     * _.M.valueAt(a, 1); //'b'
     * _.M.valueAt(a, 5); //'c'
     * _.M.valueAt(a, -1); //'c'
     * _.M.valueAt(a, -2); //'b'
     * _.M.valueAt(str, 2); //'h'
     * _.M.valueAt(str, -2); //'o'
     */
    M.valueAt = function (array, index) {
        if (M.isLikeString(array)) {
            array = (array + '').split('');
        }
        if (!_.isArray(array)) {
            array += '';
        }

        var arr_len = array.length;
        index = index % arr_len;
        if (index < 0) {
            index += arr_len;
        }
        return array[index];
    };

    /**
     * Split array to chunks, each chunk has n element
     * @param {Array} array Items
     * @param {number} n Items per chunk
     * @returns {Array}
     * @example
     * var arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
     * _.M.chunk(arr, 3)
     * => [
     *  [0, 1, 2],
     *  [3, 4, 5],
     *  [6, 7, 8],
     *  [9],
     * ]
     *
     */
    M.chunk = function (array, n) {
        var lists = _.groupBy(array, function (element, index) {
            return Math.floor(index / n);
        });
        return _.toArray(lists);
    };

    /**
     * Split array to n of chunks
     * @param {Array} array
     * @param {number} chunks Number of chunks
     * @return {Array}
     * @example
     * var arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
     * _.M.chunks(arr, 3)
     * => [
     *   [0, 1, 2, 3],
     *   [4, 5, 6, 7],
     *   [8, 9]
     * ]
     */
    M.chunks = function (array, chunks) {
        return M.chunk(array, Math.ceil(array.length / chunks));
    };

    /**
     * Toggle array's elements
     * @param {Array} array
     * @param {Array} elements
     * @param {boolean} status If this param is boolean then add/remove base on it value. By default it is undefined -
     *     add if none exists, remove if existed
     * @returns {array}
     * @example
     * var arr = ['A', 'B', 'C', 'D'];
     * _.M.toggle(arr, ['A', 'V']) => ['B', 'C', 'D', 'V']
     * _.M.toggle(arr, ['A', 'V'], true) => ['A', 'B', 'C', 'D', 'V']
     * _.M.toggle(arr, ['A', 'V'], false) => ['B', 'C', 'D']
     */
    M.toggle = function (array, elements, status) {
        elements = _.uniq(M.beArray(elements));
        if (_.isUndefined(status)) {
            var exclude = _.intersection(array, elements);
            var include = _.difference(elements, array);

            array = _.union(_.difference(array, exclude), include);
        } else {
            if (status) {
                array = _.union(array, elements);
            } else {
                array = _.difference(array, elements);
            }
        }
        return array;
    };

    /**
     * Create, define and return a object with properties. Object's properties are fixed and enumerable
     * @param {{}} properties
     * @returns {{}}
     * @example
     * var obj = _.M.defineObject({name: 'Manh', old: 123, hello: function(){
     *  alert('Hello ' + this.name);
     * }});
     *
     * obj.old = 10;
     * console.log(obj); //{name: 'Manh', old: 123}
     * _.each(obj, function(value, key){
     *  console.log(key, '=>', value);
     * });
     * //name => Manh
     * //old => 123
     */
    M.defineObject = function (properties) {
        var obj = {};
        _.each(properties, function (value, key) {
            key = key.trim();
            if (!_.has(obj, key)) {
                Object.defineProperty(obj, key, {
                    enumerable: !_.isFunction(value),
                    value: value
                });
            }
        });
        return obj;
    };

    /**
     * Check if a MaDnh constant is defined or not
     * @param {string} name
     * @returns {boolean}
     * @example
     * _.M.isDefinedConstant('TEST') => false
     */
    M.isDefinedConstant = function (name) {
        return _.has(this, name.trim().toUpperCase());
    };

    /**
     * Define a MaDnh constant
     * @param {(string|Object)} name
     * @param {*} [value = undefined]
     * @example
     * _.M.defineConstant('TEST', 123) => _.M.TEST = 123
     */
    M.defineConstant = function (name, value) {
        var obj = {},
            result = [],
            self = this;

        if (!_.isObject(name)) {
            obj[name] = value;
        } else {
            obj = name;
        }
        _.each(obj, function (value, key) {
            key = key.trim().toUpperCase();
            if (!M.isDefinedConstant(key)) {
                Object.defineProperty(self, key, {
                    enumerable: true,
                    value: value
                });
                result.push(key);
            }
        });
        return result;
    };

    /**
     * Inherit constructor prototype
     * @param {function} subclass_constructor Destination constructor
     * @param {function} base_class_constructor Source constructor
     * @param {boolean} [addSuper = true] Add property to destination prototype that reference back to source prototype
     *
     * @see https://github.com/Olical/Heir
     *
     * @example
     * function MyEE(){
     *  _.M.EventEmitter.call(this);
     * }
     *
     * _.M.inherit(MyEE, _.M.EventEmitter);
     */
    M.inherit = function (subclass_constructor, base_class_constructor, addSuper) {
        var proto = subclass_constructor.prototype = Object.create(base_class_constructor.prototype);
        proto.constructor = subclass_constructor;

        if (addSuper || _.isUndefined(addSuper)) {
            proto._super = base_class_constructor.prototype;
        }
    };

    /**
     * Call callback with arguments
     * @param {string|function|Array} callback
     * @param {*} [args] Callback arguments, if only one argument as array passed then it must be wrapped by array, eg:
     *     [users]
     * @param {Object|null} context context of "this" keyword
     * @returns {*}
     *
     * @example
     * _.M.callFunc(null, alert, 123);
     * _.M.callFunc(null, function(name, old){
     *      alert('My name is ' + name + ', ' + old + 'years old');
     * }, ['Manh', 10]);
     *
     * var obj = {name: 'Manh', old: 10};
     * _.M.callFunc(obj, function(say_hi){
     *      alert((say_hi ? 'Hi' : 'Hello') + '! my name is ' + this.name + ', ' + this.old + ' years old');
     * }, true);
     */
    M.callFunc = function (callback, args, context) {
        if (arguments.length >= 2) {
            args = M.beArray(args);
        } else {
            args = [];
        }

        if (callback) {
            if (_.isString(callback)) {
                if (M.WAITER.has(callback)) {
                    return M.WAITER.run(callback, args, context);
                }
                if (_.has(window, callback) && _.isFunction(window[callback])) {
                    return window[callback].apply(context || window, args);
                }

                throw new Error('Invalid callback!');
            } else if (_.isFunction(callback)) {

                return callback.apply(context || null, args);
            } else if (_.isArray(callback)) {
                var result = [],
                    this_func = arguments.callee;

                _.each(callback, function (tmpFunc) {
                    result.push(this_func(tmpFunc, args, context));
                });

                return result;
            }
        }

        return undefined;
    };

    /**
     * Call callback asynchronous. Similar to _.M.callFunc
     *
     * @param {(string|function|Array)} callback
     * @param {*} [args] Callback arguments, if only one argument as array passed then it must be wrapped by array, eg:
     *     [users]
     * @param {number} [delay=1] Delay milliseconds
     * @param {Object|null} context context of "this" keyword
     * @see callFunc
     */
    M.async = function (callback, args, delay, context) {
        delay = parseInt(delay);
        if (_.isNaN(delay)) {
            delay = 1;
        }

        return setTimeout(function () {
            M.callFunc(callback, args, context || null);
        }, Math.max(1, delay));
    };

    function createConsoleCB(name, description) {
        var args = [];
        if (arguments.length > 1) {
            args.push(description);
        }

        return function () {
            console[name].apply(console, args.concat(slice.apply(arguments)));
        }
    }

    /**
     * Like console.log with dynamic arguments
     * @example
     * var args = [1,2,3,4];
     * _.M.logArgs('a',123);
     * _.M.logArgs.apply(null, args);
     */
    M.logArgs = function () {
        console.log.apply(console, slice.apply(arguments));
    };

    /**
     * Create console log callback with description as first arguments
     * @param {string} description
     * @returns {*}
     * @example
     * var cb = _.M.logCb('Test 1');
     * cb(1,2,3); // Console log: 'Test 1' 1 2 3
     */
    M.logCb = function (description) {
        return createConsoleCB.apply(null, ['log'].concat(slice.apply(arguments)));
    };

    /**
     * Like console.warn with dynamic arguments
     * @example
     * var args = [1,2,3,4];
     * _.M.warnArgs('a',123);
     * _.M.warnArgs.apply(null, args);
     */
    M.warnArgs = function () {
        console.warn.apply(console, slice.apply(arguments));
    };

    /**
     * Create console waring callback with description as first arguments
     * @param {string} description
     * @returns {*}
     * @example
     * var cb = _.M.warnCb('Test 1');
     * cb(1,2,3); // Console warn as: 'Test 1' 1 2 3
     */
    M.warnCb = function (description) {
        return createConsoleCB.apply(null, ['warn'].concat(slice.apply(arguments)));
    };

    /**
     * Like console.error with dynamic arguments
     * @example
     * var args = [1,2,3,4];
     * _.M.errorArgs('a',123);
     * _.M.errorArgs.apply(null, args);
     */
    M.errorArgs = function () {
        console.error.apply(console, slice.apply(arguments));
    };

    /**
     * Create console error callback with description as first arguments
     * @param {string} description
     * @returns {*}
     * @example
     * var cb = _.M.errorCb('Test 1');
     * cb(1,2,3); // Console error as: 'Test 1' 1 2 3
     */
    M.errorCb = function (description) {
        return createConsoleCB.apply(null, ['error'].concat(slice.apply(arguments)));
    };


    var debug_types_status = {}, is_active_all_debug_type = false;

    /**
     *
     * @param type
     * @returns {boolean}
     */
    M.isDebugging = function (type) {
        if (is_active_all_debug_type || _.isEmpty(type)) {
            return is_active_all_debug_type;
        }

        return debug_types_status.hasOwnProperty(type) && debug_types_status[type];

    };
    /**
     *
     * @param [type] default is all debug type
     */
    M.debugging = function (type) {
        if (_.isEmpty(type)) {
            is_active_all_debug_type = true;
            return;
        }

        debug_types_status[type] = true;
    };
    /**
     *
     * @param [type] default is all debug type
     */
    M.debugComplete = function (type) {
        if (_.isEmpty(type)) {
            is_active_all_debug_type = false;
            debug_types_status = {};

            return;
        }

        delete debug_types_status[type];
    };

    /**
     * Run callback if is in debugging of a type
     * @param type null - all debug type
     * @param {function} callback
     */
    M.onDebugging = function (type, callback) {
        if (this.isDebugging(type)) {
            M.callFunc(callback);
        }
    };

    /**
     * Get json string of an array
     * @param {array} details
     * @param {string} [glue="\n"]
     * @returns {string}
     */
    M.getDebugString = function (details, glue) {
        var result = [];

        _.each(M.beArray(details), function (item) {
            result.push(JSON.stringify(item));
        });

        return result.join(glue || "\n");
    };

    /**
     *
     * @param args
     * @param order
     * @param rules
     * @returns {{}}
     * @example
     * var order = ['int', 'bool', 'str'],
     * rules = {int: 'number', bool: 'boolean', str: 'string'};
     *
     * _.M.optionalArgs([1, true, 'A'], order, rules); //{int: 1, bool: true, str: "A"}
     * _.M.optionalArgs([true, 'A'], order, rules);//{bool: true, str: "A"}
     * _.M.optionalArgs(['A'], order, rules); //{str: "A"}
     * _.M.optionalArgs(['A', 'V'], order, rules); //{int: "A", bool: "V"}
     * _.M.optionalArgs([1, []], order, rules); //{int: 1, bool: []}
     * _.M.optionalArgs([true, []], order, rules); //{int: true, bool: []}
     * _.M.optionalArgs(['A', []], order, rules); //{int: "A", bool: []}
     * _.M.optionalArgs([[], []], order, rules); //{int: Array[0], bool: []}
     *
     * _.M.optionalArgs(['A', 'V'], ['int', 'bool', 'str', 'str2'], {int: 'number', bool: 'boolean', str: 'string', str2: 'string'});
     * //=> {str: "A", str2: "V"}
     */
    M.optionalArgs = function (args, order, rules) {
        var result = {},
            arg, index = 0, last_index, missing_rules, type, args_cloned, args_with_type, found;

        missing_rules = _.difference(order, Object.keys(rules));
        missing_rules.forEach(function (missing) {
            rules[missing] = true;
        });

        args_with_type = order.map(function (arg_name) {
            return rules[arg_name];
        });

        if (_.isEmpty(args)) {
            return result;
        }
        if (args.length >= order.length) {
            result = _.object(order, args.slice(0, order.length));
        } else {
            args_cloned = args.slice(0);

            while (arg = args_cloned.shift()) {
                type = M.contentType(arg);
                found = false;
                last_index = index;

                M.loop(args_with_type.slice(index), (function (tmp_arg, tmp_type) {
                    return function (types) {
                        if (types === true || tmp_type === types
                            || (_.isArray(types) && -1 != types.indexOf(tmp_type))
                            || (_.isFunction(types) && types(tmp_arg))) {
                            found = true;

                            return 'break';
                        }

                        index++;
                    }
                })(arg, type));

                if (!found) {
                    result = _.object(order.slice(0, args.length), args);
                    break;
                }

                result[order[index++]] = arg;
            }
        }

        return result;
    };

    /**
     * Sort number asc
     */
    function sortNumberCallback(a, b) {
        return a - b;
    }

    /**
     * Sort number desc
     */
    function sortNumberDescCallback(a, b) {
        return b - a;
    }

    function is_equal_strict(a, b) {
        return a === b;
    }

    function is_equal_loose(a, b) {
        return a == b;
    }


    M.defineConstant({
        /**
         * Array sort compare function. Sort number
         * @constant
         * @example
         * var scores = [1, 10, 2, 21];
         * scores.sort(); // [1, 10, 2, 21]
         * scores.sort(_.M.SORT_NUMBER); // [1, 2, 10, 21]
         */
        SORT_NUMBER: sortNumberCallback,
        /**
         * Array sort compare function. Sort number desc
         * @constant
         * @example
         * var scores = [1, 10, 2, 21];
         * scores.sort(_.M.SORT_NUMBER_DESC); // [21, 10, 2, 1]
         */
        SORT_NUMBER_DESC: sortNumberDescCallback,

        /**
         * Compare 2 value is equal, loose comparison
         * @constant
         * @example
         * _.M.IS_EQUAL(1, 1); //true
         * _.M.IS_EQUAL(1, '1'); //true
         * _.M.IS_EQUAL(1, true); //true
         * _.M.IS_EQUAL(1, false); //false
         * _.M.IS_EQUAL(1, 2); //false
         */
        IS_EQUAL: is_equal_loose,

        /**
         * Compare 2 value is equal, strict comparison
         * @constant
         * @example
         * _.M.IS_STRICT_EQUAL(1, 1); //true
         * _.M.IS_STRICT_EQUAL(1, '1'); //false
         */
        IS_STRICT_EQUAL: is_equal_strict
    });
})(_);
/**
 * @module _.M.FLAG
 * @memberOf _.M
 */
;(function (_) {
    var _flags = {};

    /**
     * @lends _.M.FLAG
     * @type {{}}
     */
    _.M.FLAG = _.M.defineObject({
        /**
         * Check if a flag is exists
         * @param {string} name
         */
        has: function (name) {
            return _.has(_flags, name);
        },

        /**
         * Set a flag
         * @param {string} name
         * @param {boolean} [is_active=true] Flag status, default is True
         */
        flag: function (name, is_active) {
            is_active = _.isUndefined(is_active) ? true : Boolean(is_active);

            if (_.isArray(name)) {
                _.each(name, function (tmp_name) {
                    _flags[tmp_name] = is_active;
                });
            } else {
                _flags[name] = is_active;
            }
        },

        /**
         * Get flags
         * @param {boolean} [detail=false] If true then return flags with detail of it, else only return flags name
         */
        flags: function (detail) {
            if (detail) {
                return _.clone(_flags);
            }
            return _.keys(_flags);
        },

        /**
         * Get flag by name
         * @param {string} name
         * @returns {(*|boolean)}
         */
        get: function (name) {
            return this.has(name) && Boolean(_flags[name]);
        },

        /**
         * Check if a flag is exists
         * @param {string} name
         * @returns {*}
         */
        isFlagged: function (name) {
            var result, self = this;

            if (_.isArray(name)) {
                result = [];
                _.each(name, function (tmp_name) {
                    if (self.get(tmp_name)) {
                        result.push(tmp_name);
                    }
                })
            } else {
                result = this.get(name);
            }

            return result;
        },

        /**
         *
         * @param {string|string[]} name
         * @param {boolean} [status] Missing - On/off when current flag's status is off/on.
         * Boolean - On/off when status is true/false
         */
        toggle: function (name, status) {
            var thisFunc = arguments.callee;
            var self = this;

            if (_.isArray(name)) {
                _.each(name, function (tmp_name) {
                    thisFunc.apply(self, [tmp_name, status]);
                })
            } else {
                if (!_.isUndefined(status)) {
                    this.flag(name, Boolean(status));
                } else {
                    this.flag(name, !this.isFlagged(name));
                }
            }
        },

        reset: function () {
            _flags = {};
        }

    });
})(_);
/**
 * @module _.M.BaseClass
 * @memberOf _.M
 */
;(function (_) {
    /**
     * Base class
     * @class _.M.BaseClass
     * @property {string} type_prefix Prefix of class, use as prefix of instance ID, default is class name
     * @property {string} id Instance ID
     */
    function BaseClass() {
        if (!this.type_prefix) {
            this.type_prefix = _.M.className(this, true);
        }

        if (!this.id) {
            this.id = _.M.nextID(this.type_prefix, true);
        }
    }

    /**
     * 
     * @type {_.M.BaseClass}
     */
    _.M.BaseClass = BaseClass;
})(_);
;(function (_) {
    var _pre_options = {};


    function _extend(sources, dest_name, options, real_time) {
        if (_pre_options.hasOwnProperty(dest_name)) {
            throw new Error('Destination Pre Options is already exists');
        }
        sources = _.M.beArray(sources);
        var not_founds = _.filter(sources, function (source) {
            return !_pre_options.hasOwnProperty(source);
        });

        if (!_.isEmpty(not_founds)) {
            throw new Error('PreOptions are not defined:' + not_founds.join(', '));
        }
        if (!_.isObject(options)) {
            options = {};
        }
        if (!real_time) {
            var base_options = {};

            _.each(sources, function (base) {
                _.extend(base_options, _.M.PreOptions.get(base));
            });
            _.extend(options, base_options);

            _pre_options[dest_name] = {
                options: options,
                base: []
            };
        } else {
            _pre_options[dest_name] = {
                options: options,
                base: sources
            };
        }
    }

    _.M.PreOptions = _.M.defineObject({
        /**
         *
         * @param {string} name
         * @param {{}}options
         * @param {boolean} [override=false]
         */
        define: function (name, options, override) {
            if (override || !_pre_options.hasOwnProperty(name)) {
                _pre_options[name] = {
                    options: options,
                    base: []
                };
                return true;
            }

            return false;
        },
        /**
         *
         * @param {string} name
         * @returns {boolean}
         */
        has: function (name) {
            return _pre_options.hasOwnProperty(name);
        },
        /**
         *
         * @param {string} name
         * @param {{}} options
         * @returns {boolean}
         */
        update: function (name, options) {
            if (_pre_options.hasOwnProperty(name)) {
                _.extend(_pre_options[name].options, options);
                return true;
            }

            return false;
        },
        updateBase: function (name, new_base) {
            if (_pre_options.hasOwnProperty(name)) {
                _pre_options[name].base = new_base;

                return true;
            }

            return false;
        },
        /**
         *
         * @param {string} name
         * @param {{}} [custom={}]
         * @returns {*}
         */
        get: function (name, custom) {
            if (!_pre_options.hasOwnProperty(name)) {
                throw new Error('Pre Options "' + name + '" is undefined');
            }

            var result = {};

            _.each(_.M.beArray(_pre_options[name].base), function (base) {
                _.extend(result, _.M.PreOptions.get(base));
            });
            _.extend(result, _.clone(_pre_options[name].options), _.isObject(custom) ? custom : {});

            return result;
        },

        /**
         * Create PreOptions, base on real time value of other PreOptions
         * @param {string|string[]} sources Base on other PreOptions
         * @param {string} dest_name
         * @param {{}} [options={}]
         */
        extend: function (sources, dest_name, options) {
            _extend(sources, dest_name, options, true);
        },
        /**
         * Create PreOptions, base on runtime-value of other PreOptions
         * @param {string|string[]} sources Base on other PreOptions
         * @param {string} dest_name
         * @param {{}} [options={}]
         */
        baseOn: function (sources, dest_name, options) {
            _extend(sources, dest_name, options, false);
        },

        /**
         *
         * @param {boolean} [detail=false]
         * @returns {Array|{}}
         */
        list: function (detail) {
            if (detail) {
                return _.clone(_pre_options);
            }

            return Object.keys(_pre_options);
        },

        reset: function () {
            _pre_options = {};
        }
    });
})(_);
/**
 * Store data by key and data type. Support add, check exists, get and delete
 * @module _.M.ContentManager
 * @memberOf _.M
 * @requires _.M.BaseClass
 */
;(function (_) {

    _.M.defineConstant({
        /**
         * @constant {string}
         * @default
         */
        CONTENT_TYPE_STRING: 'string',
        /**
         * @constant {string}
         * @default
         */
        CONTENT_TYPE_NUMBER: 'number',
        /**
         * @memberOf ContentManager
         * @constant {string}
         * @default
         */
        CONTENT_TYPE_BOOLEAN: 'boolean',
        /**
         * @constant {string}
         * @default
         */
        CONTENT_TYPE_ARRAY: 'array',
        /**
         * @constant {string}
         * @default
         */
        CONTENT_TYPE_FUNCTION: 'function',
        /**
         * @constant {string}
         * @default
         */
        CONTENT_TYPE_OBJECT: 'object',
        /**
         * @constant {string}
         * @default
         */
        CONTENT_TYPE_MIXED: 'mixed'
    });

    /**
     * Extract key to get content {string} type
     * @param {ContentManager} instance
     * @param {string} key
     * @returns {(string|boolean)} False when invalid key
     */
    function getContentTypeFromKey(instance, key) {
        var info = key.substr(instance.id.length + 1).split('_');

        if (info.length > 1) {
            return info[0];
        }

        return false;
    }

    /**
     * @class _.M.ContentManager
     */
    function ContentManager() {
        _.M.BaseClass.call(this);

        this._contents = {};
        this._usings = {};
    }

    _.M.inherit(ContentManager, _.M.BaseClass);

    /**
     * Check if content type is exists
     * @param {string} type
     * @returns {boolean}
     */
    ContentManager.prototype.hasType = function (type) {
        return this._contents.hasOwnProperty(type);
    };

    /**
     * Get array of content types
     * @returns {Array}
     */
    ContentManager.prototype.types = function () {
        return Object.keys(this._contents);
    };
    ContentManager.prototype.keys = function () {
        var self = this,
            result = {};

        Object.keys(this._contents).forEach(function (type) {
            result[type] = Object.keys(self._contents[type]);
        });

        return result;
    };

    /**
     * Filter content by callback, return position of valid contents
     * @param {function} callback Callback arguments:
     * - content
     * - meta
     * - key
     * - content type.
     * Return true on valid content, otherwise
     *
     * @param types
     * @returns {Array} Each item is object:
     *  - type: content type
     *  - key: content key
     *  - content: content
     *  - meta: content meta
     */
    ContentManager.prototype.filter = function (callback, types) {
        var result = [],
            self = this;

        if (_.isUndefined(types)) {
            types = Object.keys(this._contents);
        } else {
            types = _.intersection(_.M.beArray(types), Object.keys(this._contents));
        }

        _.M.loop(types, function (type) {
            _.M.loop(Object.keys(self._contents[type]), function (key) {
                if (callback(_.clone(self._contents[type][key].content), _.clone(self._contents[type][key].meta), key, type)) {
                    result.push({
                        type: type,
                        key: key,
                        content: _.clone(self._contents[type][key].content),
                        meta: self._contents[type][key].meta ? _.clone(self._contents[type][key].meta) : undefined
                    });
                }
            });
        });

        return result;
    };

    /**
     * Find first position of valid content
     * @param callback Callback arguments: content, meta, content key, content type. Return true on valid content, otherwise
     * @param types
     * @returns {boolean|{}} False if not found, else return object:
     *  - type: content type
     *  - key: content key
     *  - content: content
     *  - meta: meta
     */
    ContentManager.prototype.find = function (callback, types) {
        var found = false,
            self = this;

        if (_.isUndefined(types)) {
            types = Object.keys(this._contents);
        } else {
            types = _.intersection(_.M.beArray(types), Object.keys(this._contents));
        }

        _.M.loop(types, function (type) {
            _.M.loop(Object.keys(self._contents[type]), function (key) {
                var item = self._contents[type][key];
                if (callback(_.clone(item.content), _.clone(item.meta), key, type)) {
                    found = {
                        type: type,
                        key: key,
                        content: _.clone(item.content),
                        meta: item.meta ? _.clone(item.meta) : undefined
                    };

                    return 'break';
                }
            });

            if (found) {
                return 'break';
            }
        });

        return found;
    };

    /**
     * Find positions of content by content and [types]
     * @param {*} content
     * @param {string} [types] Find in this types, if missing then auto detect
     * @returns {Array} Array of object with keys: type, key
     */
    ContentManager.prototype.contentPositions = function (content, types) {
        var callback = function (check_content) {
            return content === check_content;
        };

        return this.filter(callback, types);
    };

    /**
     * Check if key is valid
     * @param {string} key
     * @returns {boolean}
     */
    ContentManager.prototype.isValidKey = function (key) {
        return false !== getContentTypeFromKey(this, key);
    };

    /**
     * Find content exists
     * @param content
     * @param types
     * @returns {boolean}
     */
    ContentManager.prototype.hasContent = function (content, types) {
        var callback = function (check_content) {
            return content === check_content;
        };

        return false !== this.find(callback, types);
    };

    /**
     * Check if key is exists
     * @param {string} key
     * @returns {boolean}
     */
    ContentManager.prototype.has = function (key) {
        if (this.isUsing(key)) {
            return true;
        }

        var type = getContentTypeFromKey(this, key);

        if (false !== type) {
            return this._contents.hasOwnProperty(type) && this._contents[type].hasOwnProperty(key);
        }

        return false;
    };

    /**
     * Clean empty type
     */
    ContentManager.prototype.clean = function () {
        var self = this;
        _.each(Object.keys(this._contents), function (type) {
            if (_.isEmpty(self._contents[type])) {
                delete self._contents[type];
            }
        })
    };

    /**
     * Add content
     * @param {*} content
     * @param {*} meta
     * @param {string} [type] Auto detect when missing
     * @returns {string} Content key
     */
    ContentManager.prototype.add = function (content, meta, type) {
        if (!type) {
            type = _.M.contentType(content);
        }

        var key = _.M.nextID(this.id + '_' + type);

        if (!this._contents.hasOwnProperty(type)) {
            this._contents[type] = {};
        }
        this._contents[type][key] = {
            content: content,
            meta: meta
        };

        return key;
    };

    /**
     * Add unique content
     * @param {*} content
     * @param {*} meta
     * @param {string} [type] Auto detect when missing
     * @returns {string} Content key
     */
    ContentManager.prototype.addUnique = function (content, meta, type) {
        if (!type) {
            type = _.M.contentType(content);
        }

        var positions = this.contentPositions(content, type);

        if (positions.length == 0) {
            return this.add(content, meta, type);
        }

        return positions.shift().key;
    };

    /**
     *
     * @param {string|string[]} keys
     * @param with_meta
     * @return {{}}
     */
    ContentManager.prototype.items = function (keys, with_meta) {
        var result = {},
            type,
            key,
            callback;

        if (with_meta) {
            callback = function (item) {
                return _.clone(item)
            };
        } else {
            callback = function (item) {
                return _.clone(item.content);
            }
        }
        if (!_.isEmpty(keys)) {
            var type_grouped = _.groupBy(_.M.beArray(keys), _.partial(getContentTypeFromKey, this));

            for (type in type_grouped) {
                if (type_grouped.hasOwnProperty(type)) {
                    _.each(_.pick(this._contents[type], type_grouped[type]), function (value, key) {
                        result[key] = callback(value);
                    });
                }
            }
        } else {
            for (type in this._contents) {
                if (this._contents.hasOwnProperty(type)) {
                    for (key in this._contents[type]) {
                        if (this._contents[type].hasOwnProperty(key)) {
                            result[key] = callback(this._contents[type][key]);
                        }
                    }
                }
            }
        }


        return result;
    };

    /**
     * Check if content key is using
     * @param {string} key
     * @returns {boolean}
     */
    ContentManager.prototype.isUsing = function (key) {
        return this._usings.hasOwnProperty(key);
    };

    /**
     * Check if content is using
     * @param {*} content
     * @param {string} [type] Auto detect when missing
     * @returns {boolean}
     */
    ContentManager.prototype.isUsingContent = function (content, type) {
        var positions = this.contentPositions(content, type);

        if (!_.isEmpty(positions)) {
            return !_.isEmpty(_.intersection(_.pluck(positions, 'key'), Object.keys(this._usings)));
        }

        return false;
    };

    /**
     * Toggle using key
     * @param {string} key
     * @param {boolean} [is_using = true]
     * @return {boolean} True -> key is exists and set using status success. False -> key is not exists
     */
    ContentManager.prototype.using = function (key, is_using) {
        if (this.has(key)) {
            if (_.isUndefined(is_using) || is_using) {
                this._usings[key] = true;
            } else {
                delete this._usings[key];
            }

            return true;
        }

        return false;
    };

    /**
     * Set keys to unused
     * @param {string|string[]}keys
     */
    ContentManager.prototype.unused = function (keys) {
        this._usings = _.omit(this._usings, _.flatten(_.toArray(arguments)));
    };

    /**
     * Get using keys
     * @param {boolean} [grouped=false] Group keys by type
     * @return {string[], {}}
     */
    ContentManager.prototype.usingKeys = function (grouped) {
        if (grouped) {
            return _.groupBy(Object.keys(this._usings), _.partial(getContentTypeFromKey, this));
        }

        return Object.keys(this._usings);
    };
    /**
     * Get unused keys
     * @param {boolean} [grouped=false] Group keys by type
     * @return {object|Array}
     */
    ContentManager.prototype.unusedKeys = function (grouped) {
        var using_grouped = this.usingKeys(true),
            result = {};

        for (var type in this._contents) {
            if (this._contents.hasOwnProperty(type)) {
                if (!using_grouped.hasOwnProperty(type)) {
                    result[type] = Object.keys(this._contents[type]);
                } else {
                    result[type] = _.difference(Object.keys(this._contents[type]), using_grouped[type]);
                }

                if (_.isEmpty(result[type])) {
                    delete result[type];
                }
            }
        }

        if (!grouped) {
            return _.flatten(_.values(result));
        }

        return result;
    };

    /**
     * Get content and meta by key
     * @param {string} key
     * @returns {*}
     */
    ContentManager.prototype.get = function (key) {
        var type = getContentTypeFromKey(this, key);

        if (false !== type && this._contents[type].hasOwnProperty(key)) {
            return _.clone(this._contents[type][key]);
        }

        return false;
    };

    /**
     * Get type contents
     * @param {string} type
     * @returns {({}|boolean)}
     */
    ContentManager.prototype.getType = function (type) {
        if (this.hasType(type)) {
            return _.clone(this._contents[type]);
        }

        return false;
    };

    /**
     * Get content by key
     * @param {string} key
     * @param {*} [default_value]
     * @returns {*}
     */
    ContentManager.prototype.getContent = function (key, default_value) {
        var result = this.get(key);

        if (false !== result) {

            return _.clone(result.content);
        }

        return default_value;
    };

    /**
     * Get content meta by key
     * @param {string} key
     * @param {*} [default_value]
     * @returns {*}
     */
    ContentManager.prototype.getMeta = function (key, default_value) {
        var result = this.get(key);

        if (false !== result) {

            return _.clone(result.meta);
        }

        return default_value;
    };

    /**
     * Remove content by key. Return removed keys
     * @param {string|string[]} keys
     * @returns {object[]} Array of objects, each object has 2 item:
     * - type: content type
     * - key: removed key
     */
    ContentManager.prototype.remove = function (keys) {
        var removes = [],
            key_grouped = _.groupBy(_.flatten(_.toArray(arguments)), _.partial(getContentTypeFromKey, this));

        delete key_grouped['false'];

        for (var type in key_grouped) {
            if (key_grouped.hasOwnProperty(type) && this._contents.hasOwnProperty(type)) {
                for (var index in key_grouped[type]) {
                    if (key_grouped[type].hasOwnProperty(index)) {
                        removes.push({
                            type: type,
                            key: key_grouped[type][index]
                        });

                        delete this._contents[type][key_grouped[type][index]];
                        delete this._usings[key_grouped[type][index]];
                    }
                }
            }
        }

        this.clean();

        return removes;
    };

    /**
     * Remove items by content
     * @param {*} content
     * @param {string} [type]
     * @returns {object[]} Array of objects, each object has 2 item:
     * - type: content type
     * - key: removed key
     */
    ContentManager.prototype.removeContent = function (content, type) {
        var positions = this.contentPositions(content, type),
            self = this;

        if (positions.length) {
            _.each(positions, function (pos) {
                delete self._contents[pos.type][pos.key];
                delete self._usings[pos.key];
            });
        }

        this.clean();

        return positions;
    };

    /**
     * Update content and meta
     * @param {string} key
     * @param {*} content
     * @param {*} [meta]
     * @returns {boolean}
     */
    ContentManager.prototype.update = function (key, content, meta) {
        if (this.has(key)) {
            var type = getContentTypeFromKey(this, key);

            this._contents[type][key].content = content;

            if (arguments.length >= 3) {
                this._contents[type][key].meta = meta;
            }

            return true;
        }

        return false;
    };

    /**
     * Update meta
     * @param {string} key
     * @param {*} meta
     * @returns {boolean}
     */
    ContentManager.prototype.updateMeta = function (key, meta) {
        if (this.has(key)) {
            var type = getContentTypeFromKey(this, key);

            this._contents[type][key].meta = meta;

            return true;
        }

        return false;
    };


    /**
     * Remove using content
     * @returns {Array} Removed position
     */
    ContentManager.prototype.removeUsing = function () {
        return this.remove(Object.keys(this._usings));
    };

    /**
     * Remove using content
     * @returns {array} Removed position
     */
    ContentManager.prototype.removeUnusing = function () {
        return this.remove(this.unusedKeys());
    };

    /**
     * Get status
     * @returns {{using: string[], types: {}}}
     */
    ContentManager.prototype.status = function () {
        return {
            using: Object.keys(this._usings),
            types: this.keys()
        };
    };

    /**
     *
     * @type {_.M.ContentManager}
     */
    _.M.ContentManager = ContentManager;

})(_);
/**
 * Priority
 * @module _.M.Priority
 * @memberOf _.M
 * @requires _.M.ContentManager
 */
;(function (_) {

    _.M.defineConstant({
        /**
         * @name _.M.PRIORITY_HIGHEST
         * @constant {number}
         * @default
         */
        PRIORITY_HIGHEST: 100,
        /**
         * @name _.M.PRIORITY_HIGH
         * @constant {number}
         * @default
         */
        PRIORITY_HIGH: 250,
        /**
         * @name _.M.PRIORITY_DEFAULT
         * @constant {number}
         * @default
         */
        PRIORITY_DEFAULT: 500,
        /**
         * @name _.M.PRIORITY_LOW
         * @constant {number}
         * @default
         */
        PRIORITY_LOW: 750,
        /**
         * @name _.M.PRIORITY_LOWEST
         * @constant {number}
         * @default
         */
        PRIORITY_LOWEST: 1000,

        /**
         * @name _.M.PRIORITY_LEVEL_1
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_1: 100,

        /**
         * @name _.M.PRIORITY_LEVEL_2
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_2: 200,

        /**
         * @name _.M.PRIORITY_LEVEL_3
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_3: 300,

        /**
         * @name _.M.PRIORITY_LEVEL_4
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_4: 400,

        /**
         * @name _.M.PRIORITY_LEVEL_5
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_5: 500,

        /**
         * @name _.M.PRIORITY_LEVEL_6
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_6: 600,

        /**
         * @name _.M.PRIORITY_LEVEL_7
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_7: 700,
        /**
         * @name _.M.PRIORITY_LEVEL_8
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_8: 800,

        /**
         * @name _.M.PRIORITY_LEVEL_9
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_9: 900,
        /**
         * @name _.M.PRIORITY_LEVEL_10
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_10: 1000
    });

    /**
     * Manage contents with priority
     * @class _.M.Priority
     */
    function Priority() {
        /**
         * Data holder
         * @type {_.M.ContentManager}
         * @private
         */
        this._content_manager = new _.M.ContentManager();
        /**
         * Priority number and keys
         * @type {{}}
         * @private
         */
        this._priorities = {};
    }

    /**
     * Check if a priority is exists
     * @param priority
     * @returns {boolean}
     */
    Priority.prototype.hasPriority = function (priority) {
        return this._priorities.hasOwnProperty(priority);
    };

    /**
     * Check if a key is exists
     * @param {string} key
     * @returns {*|boolean}
     */
    Priority.prototype.has = function (key) {
        return this._content_manager.has(key);
    };
    /**
     * Check if a content has exists
     * @param {*} content
     * @returns {boolean}
     */
    Priority.prototype.hasContent = function (content) {
        return this._content_manager.hasContent(content, 'priority')
    };

    /**
     * Get status about number of priorities and contents
     * @returns {{priorities: number, contents: number}}
     */
    Priority.prototype.status = function () {
        var priorities = Object.keys(this._priorities),
            result = {
                priorities: priorities.length,
                contents: 0
            },
            self = this;

        priorities.forEach(function (priority) {
            result.contents += self._priorities[priority].length;
        });

        return result;
    };

    /**
     * Add content
     * @param {*} content
     * @param {number} [priority = _.M.PRIORITY_DEFAULT]
     * @param {*} [meta] Content meta info
     * @returns {(string|boolean)} content key
     */
    Priority.prototype.addContent = function (content, priority, meta) {
        var key = this._content_manager.add(content, meta, 'priority');

        this._content_manager.using(key);
        priority = _.M.beNumber(priority, _.M.PRIORITY_DEFAULT);

        if (!_.has(this._priorities, priority)) {
            this._priorities[priority] = [];
        }
        this._priorities[priority].push(key);

        return key;
    };

    /**
     * Remove content by keys
     * @param {string|string[]} keys
     * @param {number|number[]} [priorities] Special priorities, default is all priorities
     * @returns {string[]} Removed content
     */
    Priority.prototype.remove = function (keys, priorities) {
        var self = this, remove_keys = [];

        if (!priorities) {
            priorities = Object.keys(this._priorities);
        } else {
            priorities = _.M.castItemsType(_.M.beArray(priorities), 'number');
            priorities = _.intersection(priorities, _.M.castItemsType(Object.keys(this._priorities), 'number'));
        }
        keys = _.M.beArray(keys);
        _.M.loop(priorities, function (priority) {
            var remove_keys_this_priority = _.intersection(keys, self._priorities[priority]);

            if(_.isEmpty(remove_keys_this_priority)){
                return;
            }

            remove_keys = remove_keys.concat(remove_keys_this_priority);
            self._priorities[priority] = _.difference(remove_keys_this_priority, self._priorities[priority]);
            keys = _.difference(keys, remove_keys_this_priority);

            if (_.isEmpty(keys)) {
                return 'break';
            }
        });
        if(_.isEmpty(remove_keys)){
            return [];
        }

        return _.pluck(this._content_manager.remove(remove_keys), 'key');
    };

    /**
     * Remove content
     * @param {*} content
     * @param {number|number[]} [priorities] Special priorities, default is all priorities
     * @returns {string[]}
     */
    Priority.prototype.removeContent = function (content, priorities) {
        var content_positions = this._content_manager.contentPositions(content, 'priority'),
            keys = _.pluck(content_positions, 'key');

        if (priorities) {
            return this.remove(keys, priorities);
        }

        return this.remove(keys);
    };

    /**
     * Get priority data
     * @param {boolean} [content_only = false] return priority content only, default get content and meta
     * @returns {Array}
     */
    Priority.prototype.getContents = function (content_only) {
        var contents = [],
            priority_keys = _.M.castItemsType(Object.keys(this._priorities), 'number'),
            self = this,
            raw_contents = this._content_manager.getType('priority');

        priority_keys.sort(_.M.SORT_NUMBER);

        _.each(priority_keys, function (priority) {
            var content_picked = _.pick(raw_contents, self._priorities[priority]);

            if (content_only) {
                contents = contents.concat(_.pluck(
                    _.values(content_picked),
                    'content'
                ));
            } else {
                contents = contents.concat(_.values(content_picked));
            }
        });

        return contents;
    };

    /**
     *
     * @type {_.M.Priority}
     */
    _.M.Priority = Priority;
})(_);
/**
 * Callback listener system
 * @module _.M.WAITER
 * @memberOf _.M
 */
;(function (_) {
    var _waiters = {};

    /**
     * @lends _.M.WAITER
     * @type {{}}
     */
    _.M.WAITER = _.M.defineObject({
        /**
         * Check if a waiter key is exists
         * @param {string} waiter_key
         */
        has: function (waiter_key) {
            return _waiters.hasOwnProperty(waiter_key) && _waiters[waiter_key].times > 0;
        },

        /**
         * Add callback
         * @param {(string|function)} callback Callback
         * @param {int} [times = 1] Run times
         * @param {string} [description = ''] Waiter description
         * @returns string Callback key
         */
        add: function (callback, times, description) {
            var key = _.M.nextID('waiter_key', true);

            _waiters[key] = {
                callback: callback,
                times: _.isUndefined(times) ? 1 : times,
                description: description || ''
            };

            return key;
        },

        /**
         * Similar to "add" but add waiter key to window as function
         * @param {(string|function)} callback Callback
         * @param {int} [times = 1] Run times
         * @param {string} [description] Waiter description
         * @returns {(string|number)} Waiter key/function name
         */
        createFunc: function (callback, times, description) {
            var key = this.add(callback, times, description);
            var self = this;

            window[key] = (function (key) {
                return function () {
                    return self.run.apply(self, [key].concat(_.toArray(arguments)));
                };
            })(key);

            return key;
        },

        /**
         * Remove keys by arguments
         * @returns {Array} Removed waiters
         */
        remove: function () {
            var keys = _.flatten(_.toArray(arguments)),
                removed = [];

            _.each(keys, function (tmp_key) {
                if (_waiters.hasOwnProperty(tmp_key)) {
                    removed.push(tmp_key);
                    window[tmp_key] = undefined;
                    delete _waiters[tmp_key];
                    delete window[tmp_key];
                }
            });

            return removed;
        },

        /**
         * Run the waiter
         * @param {string} waiter_key
         * @param {Array} args
         * @param {Object} this_arg
         * @returns {*}
         */
        run: function (waiter_key, args, this_arg) {
            var result;

            if (this.has(waiter_key)) {
                result = _waiters[waiter_key].callback.apply(this_arg || null, _.M.beArray(args));

                if (--_waiters[waiter_key].times < 1) {
                    this.remove(waiter_key);
                }
            } else {
                throw new Error('Waiter key is non-exists: ' + waiter_key);
            }

            return result;
        },

        /**
         * Return list of waiters
         * @param {boolean} [description = false] Include waiter description, default is false
         * @returns {(Array|{})}
         */
        list: function (description) {
            if (description) {
                var result = {};
                _.each(_waiters, function (detail, name) {
                    result[name] = detail.description;
                });
                return result;
            }

            return Object.keys(_waiters);
        }
    });
})(_);
/**
 * @module _.M.EventEmitter
 * @memberOf _.M
 * @requires _.M.Priority
 */
;(function (_) {
    _.M.defineConstant({
        /**
         * Default limit event't listeners
         * @name _.M.EVENT_EMITTER_EVENT_LIMIT_LISTENERS
         * @constant {number}
         * @default
         */
        EVENT_EMITTER_EVENT_LIMIT_LISTENERS: 10,

        /**
         * Unlimited event's listeners
         * @name _.M.EVENT_EMITTER_EVENT_UNLIMITED
         * @constant {number}
         * @default
         */
        EVENT_EMITTER_EVENT_UNLIMITED: -1

    });

    /**
     * Event management system
     * @class _.M.EventEmitter
     * @extends _.M.BaseClass
     */
    function EventEmitter(options) {
        _.M.BaseClass.call(this);

        options = _.defaults(options || {}, {
            'limit': _.M.EVENT_EMITTER_EVENT_LIMIT_LISTENERS,
            'events': {},
            'event_mimics': [],
            'event_privates': []
        });

        /**
         *
         * @type {{_.M.Priority}}
         * @private
         */
        this._events = {};
        /**
         *
         * @type {{}}
         * @private
         */
        this._event_emitted = {};

        /**
         * @private
         */
        this._limit = _.M.beNumber(options.limit, _.M.EVENT_EMITTER_EVENT_LIMIT_LISTENERS);

        /**
         *
         * @type {{}}
         * @private
         */
        this._event_followers = {};

        /**
         *
         * @type {{}}
         * @private
         */
        this._event_following = {};

        /**
         * Mimic events when noticed from other EventEmitter
         * @type {Array}
         * @private
         */
        this._event_mimics = [];

        /**
         *
         * @type {Array}
         * @private
         */
        this._event_privates = ['attach', 'attached'];

        if (!_.isEmpty(options['events'])) {
            this.addListeners(_.M.beObject(options['events']));
        }
        if (!_.isEmpty(options['event_mimics'])) {
            this.mimic(_.M.beArray(options['event_mimics']));
        }
        if (!_.isEmpty(options['event_privates'])) {
            this.private(_.M.beArray(options['event_privates']));
        }
    }

    /**
     * Reset events
     * @param {string} [event] Special event to reset, if not, reset all events
     */
    EventEmitter.prototype.resetEvents = function (event) {
        if (event) {
            if (this._events.hasOwnProperty(event)) {
                delete this._events[event];
                delete this._event_emitted[event];
            }
        } else {
            this._events = {};
            this._event_emitted = {};
        }
    };

    /**
     * Alias of resetEvents
     * @see resetEvents
     */
    EventEmitter.prototype.reset = function (event) {
        return this.resetEvents(event);
    };

    /**
     * Get all events name
     * @param {boolean} count Return events listeners count
     * @return {Object|Array}
     */
    EventEmitter.prototype.events = function (count) {
        if (count) {
            var result = {};
            var self = this;

            Object.keys(this._events).forEach(function (event) {
                result[event] = self._events[event].priority.status().contents;
            });

            return result;
        }
        return Object.keys(this._events);
    };

    /**
     * Get event emitted count
     * @param {string} event Event name, if not special then return all of emitted events
     * @returns {(number|{})}
     */
    EventEmitter.prototype.emitted = function (event) {
        if (!_.isUndefined(event)) {
            return _.has(this._event_emitted, event) ? parseInt(this._event_emitted[event]) : 0;
        }
        return _.clone(this._event_emitted);
    };

    /**
     * Set event listener limit
     * @param {int} [limit]
     */
    EventEmitter.prototype.limit = function (limit) {
        this._limit = limit + 0;
    };

    /**
     * Set unlimited for event listeners
     */
    EventEmitter.prototype.unlimited = function () {
        this._limit = _.M.EVENT_EMITTER_EVENT_UNLIMITED;
    };

    /**
     * Add event listener
     * @param {string|string[]} events Array of events name
     * @param {(string|function|Array)} listeners Event listener
     * @param {object} option Option is object with keys:
     * priority {@see _.M.PRIORITY_DEFAULT},
     * times (-1 - forever) - call times,
     * context (this event emitter instance) - context for callback,
     * key (auto increment of key: event_emitter_key_) - listener key. Useful when remove listener
     * @returns {string|boolean|null} Listener key or false on fail
     */
    EventEmitter.prototype.addListener = function (events, listeners, option) {
        var self = this;
        if (_.M.isNumeric(option)) {
            option = {
                priority: option
            }
        }

        option = _.defaults(option || {}, {
            priority: _.M.PRIORITY_DEFAULT,
            times: -1,
            context: null,
            key: null,
            async: false
        });
        listeners = _.M.beArray(listeners);
        events = _.uniq(_.M.beArray(events));

        _.each(events, function (event) {
            if (!self._events.hasOwnProperty(event)) {
                self._events[event] = {
                    priority: new _.M.Priority(),
                    key_mapped: {}
                };
            } else if (self._limit != _.M.EVENT_EMITTER_EVENT_UNLIMITED) {
                var status = self._events[event].priority.status();

                if (status.contents + listeners.length > self._limit) {
                    console.warn('Possible _.M.EventEmitter memory leak detected. '
                        + (status.contents + listeners.length) + ' listeners added (limit is ' + self._limit
                        + '). Use emitter.limit() or emitter.unlimited to resolve this warning.'
                    );
                }
            }
        });

        if (!listeners.length) {
            return false;
        }
        if (option.key === null) {
            option.key = _.M.nextID('event_emitter_listener', true);
        }

        var keys = [];

        _.each(events, function (event) {
            _.M.loop(listeners, function (listener) {
                if (option.context) {
                    listener = listener.bind(option.context);
                }

                if (option.times != -1) {
                    listener = _.before(option.times + 1, listener);
                }

                keys.push(self._events[event].priority.addContent(listener, option.priority, {
                    listener_key: option.key,
                    async: option.async
                }));
            });

            if (!_.has(self._events[event].key_mapped, option.key)) {
                self._events[event].key_mapped[option.key] = keys;
            } else {
                self._events[event].key_mapped[option.key] = self._events[event].key_mapped[option.key].concat(keys);
            }
        });

        return option.key;
    };

    /**
     * @see addListener
     */
    EventEmitter.prototype.on = function (event, listener, option) {
        return this.addListener.apply(this, arguments);
    };

    /**
     * Add once time listener
     * @param event
     * @param listeners
     * @param option
     * @returns {string}
     */
    EventEmitter.prototype.addOnceListener = function (event, listeners, option) {
        if (_.M.isNumeric(option)) {
            option = {
                priority: option,
                times: 1
            }
        } else if (!_.isObject(option)) {
            option = {
                times: 1
            };
        }


        return this.addListener(event, listeners, option);
    };

    /**
     * @see addOnceListener
     */
    EventEmitter.prototype.once = function (event, listener, option) {
        return this.addOnceListener.apply(this, arguments);
    };

    /**
     * Add listeners by object
     * @param {{}} events Object of events: object key is name of event, object value is array of events
     */
    EventEmitter.prototype.addListeners = function (events) {
        var events_arr = [], self = this;

        if (_.isObject(events)) {
            _.each(events, function (event_cbs, event_name) {
                event_cbs = _.M.beArray(event_cbs);
                _.each(event_cbs, function (event_cb) {
                    event_cb = _.M.beArray(event_cb);
                    events_arr.push({
                        name: event_name,
                        cb: event_cb[0],
                        options: event_cb.length > 1 ? event_cb[1] : {}
                    });
                });
            });
        }

        _.each(events_arr, function (event_info) {
            self.addListener(event_info['name'], event_info['cb'], event_info['options']);
        });
    };

    /**
     * Emit event. Each event emitted will emit a event called 'event_emitted', with event emitted and it's data
     * @param {string|string[]} events Array of events
     * @param {*} [data]
     * @param {Function} [final_cb]
     */
    EventEmitter.prototype.emitEvent = function (events, data, final_cb) {
        var self = this;

        _.each(_.M.beArray(events), function (event) {
            if (self._events.hasOwnProperty(event)) {
                _emit_event(self, event, _.clone(data));
            }

            if (_is_need_to_notice(self, event)) {
                _notice_event(self, event, _.clone(data));
            }

            _emit_event(self, event + '_complete', _.clone(data));
        });

        if (final_cb) {
            final_cb.call(this);
        }
    };

    function _emit_event(instance, event_name, data) {
        var emitted = false,
            listeners;

        if (instance._events.hasOwnProperty(event_name)) {
            listeners = instance._events[event_name].priority.getContents();
            if (listeners.length) {
                emitted = true;

                _.each(listeners, function (listener) {
                    if (listener.meta.async) {
                        _.M.async(listener.content, data, listener.meta.context || instance);
                    } else {
                        _.M.callFunc(listener.content, data, listener.meta.context || instance);
                    }
                });
            }
        }

        if (!instance._event_emitted.hasOwnProperty(event_name)) {
            instance._event_emitted[event_name] = 1;
        } else {
            instance._event_emitted[event_name] += 1;
        }

        if (event_name !== 'event_emitted') {
            arguments.callee(instance, 'event_emitted', [event_name, _.clone(data)]);
        }

        return emitted;
    }

    function _is_need_to_notice(instance, event_name) {
        return 'event_emitted' !== event_name
            && -1 == instance._event_privates.indexOf(event_name)
            && !_.isEmpty(instance._event_followers);
    }

    function _notice_event(instance, event_name, data) {
        _.each(instance._event_followers, function (follower) {
            function cb(source_id, source_event, source_data) {
                follower.target.notice(source_id, source_event, source_data);
            }

            if (follower.async) {
                _.M.async(cb, [instance.id, event_name, data], instance);
            } else {
                _.M.callFunc(cb, [instance.id, event_name, data], instance);
            }
        });
    }


    /**
     * Alias of 'emitEvent'
     * @see emitEvent
     */
    EventEmitter.prototype.emit = function () {
        return this.emitEvent.apply(this, arguments);
    };

    /**
     * Remove listener by key
     * @param {string|Function|Array} remove Listener / listener key or array of them
     * @param {number} [priority]
     */
    EventEmitter.prototype.removeListener = function (remove, priority) {
        var self = this;
        remove = _.M.beArray(remove);
        _.each(remove, function (remover) {
            if (_.M.isLikeString(remover)) {
                _.each(Object.keys(self._events), function (event_name) {
                    if (_.has(self._events[event_name].key_mapped, remover)) {
                        self._events[event_name].priority.remove(self._events[event_name].key_mapped[remover]);
                        delete self._events[event_name].key_mapped[remover];

                        if (self._events[event_name].priority.status().contents == 0) {
                            delete self._events[event_name];
                        }
                    }
                });
            } else if (_.isFunction(remover)) {
                _.each(Object.keys(self._events), function (event_name) {
                    self._events[event_name].priority.removeContent(remover, priority);

                    if (self._events[event_name].priority.status().contents == 0) {
                        delete self._events[event_name];
                    }
                });
            } else {
                throw new Error('Invalid key or listener, it must be key of added listener or listener it self');
            }
        });
    };

    /**
     * Alias of `removeListener`
     * @see removeListener
     */
    EventEmitter.prototype.off = function () {
        return this.removeListener.apply(this, arguments);
    };

    /**
     * Set events is private
     */
    EventEmitter.prototype.private = function () {
        this._event_privates = this._event_privates.concat(_.flatten(_.toArray(arguments)));
    };

    /**
     * Set events is mimic
     */
    EventEmitter.prototype.mimic = function () {
        this._event_mimics = this._event_mimics.concat(_.flatten(_.toArray(arguments)));
    };

    /**
     * Attach other event emitter to this. Notice async
     * @param {EventEmitter} eventEmitter
     * @param {Array} [only]
     * @param {Array} [excepts]
     * @param {boolean} [async=true] notice target EventEmitter async. Default is true
     * @returns {boolean}
     */
    EventEmitter.prototype.attach = function (eventEmitter, only, excepts, async) {
        if (_.M.isEventEmitter(eventEmitter)) {
            if (!this._event_followers.hasOwnProperty(eventEmitter.id)) {
                this._event_followers[eventEmitter.id] = {
                    target: eventEmitter,
                    async: _.isUndefined(async) || Boolean(async)
                };
                this.emitEvent('attach', [eventEmitter, only, excepts]);
                eventEmitter.attachTo(this, only, excepts);
                return true;
            }

            return false;
        }

        throw new Error('Invalid _.M.EventEmitter instance');
    };
    /**
     * Attach other event emitter to this. Notice sync
     * @param eventEmitter
     * @param only
     * @param excepts
     * @return boolean
     */
    EventEmitter.prototype.attachHard = function (eventEmitter, only, excepts) {
        return this.attach(eventEmitter, only, excepts, false);
    };

    /**
     * Attach this to other event emitter instance. Notice async
     * @param {EventEmitter} eventEmitter
     * @param {Array} [only]
     * @param {Array} [excepts]
     * @param {boolean} [hard=false] Hard attach to other, other notice will call immediate. Default is false
     * @returns {boolean}
     */
    EventEmitter.prototype.attachTo = function (eventEmitter, only, excepts, hard) {
        if (!_.M.isEventEmitter(eventEmitter)) {
            throw new Error('Invalid _.M.EventEmitter instance');
        }
        if (!this._event_following.hasOwnProperty(eventEmitter.id)) {
            this._event_following[eventEmitter.id] = {
                id: eventEmitter.id,
                type: eventEmitter.type_prefix,
                only: _.M.beArray(only || []),
                excepts: _.M.beArray(excepts || [])
            };
            this.emitEvent('attached', [eventEmitter, only, excepts]);
            if (hard) {
                return eventEmitter.attachHard(this);
            }

            return eventEmitter.attach(this);

        }
        return true;
    };

    /**
     * Hard Attach this to other event emitter instance. Notice sync
     * @param {EventEmitter} eventEmitter
     * @param {Array} [only]
     * @param {Array} [excepts]
     * @returns {boolean}
     */
    EventEmitter.prototype.attachHardTo = function (eventEmitter, only, excepts) {
        return this.attachTo(eventEmitter, only, excepts, true);
    };

    /**
     * Notice following event emitter emitted
     * Emit events:
     * - <source id>.<event name>
     * - <source type>.<event name>,
     * - noticed.<source id>.<event name>
     * - noticed.<source id>
     * - noticed.<source type>.<event name>
     * - noticed.<source type>
     * - noticed
     *
     * Each notice event emit with data as object:
     * - id: source id
     * - type: source type
     * - event: source event name
     * - data: source event data
     *
     * @param {string} sourceID Following event emitter id
     * @param {string} eventName Event emitted
     * @param {*} data
     */
    EventEmitter.prototype.notice = function (sourceID, eventName, data) {
        if (this._event_following.hasOwnProperty(sourceID)) {
            var info = this._event_following[sourceID],
                self = this;

            if ((_.isEmpty(info.only) || -1 !== info.only.indexOf(eventName))
                && (_.isEmpty(info.excepts) || -1 === info.excepts.indexOf(eventName))) {

                var notice_data = {
                    id: info.id,
                    type: info.type,
                    event: eventName,
                    data: data
                };

                var notices = [
                    info.id + '.' + eventName,
                    info.type + '.' + eventName,
                    'noticed.' + info.id + '.' + eventName,
                    'noticed.' + info.id,
                    'noticed.' + info.type + '.' + eventName,
                    'noticed.' + info.type,
                    'noticed'
                ];

                var mimic = null;
                _.M.loop([eventName, info.type + '.*', info.type + '.' + eventName], function (mimic_event_name) {
                    if (-1 != self._event_mimics.indexOf(mimic_event_name)) {
                        mimic = mimic_event_name;
                        self.emitEvent(eventName, data);

                        return 'break';
                    }
                });

                this.emitEvent(mimic ? _.omit(notices, mimic) : notices, _.clone(notice_data));
            }
        }
    };

    /**
     * Detach followed event emitter
     * @param {EventEmitter} eventEmitter
     * @returns {boolean}
     */
    EventEmitter.prototype.detach = function (eventEmitter) {
        if (_.M.isEventEmitter(eventEmitter)) {
            if (this._event_followers.hasOwnProperty(eventEmitter.id)) {
                this.emitEvent('detach', [eventEmitter]);
                delete this._event_followers[eventEmitter.id];
                eventEmitter.detachFrom(this);

                return true;
            }

            return false;
        }

        throw new Error('Invalid _.M.EventEmitter instance');
    };

    /**
     * Detach following event emitter
     * @param {EventEmitter} eventEmitter
     * @returns {boolean}
     */
    EventEmitter.prototype.detachFrom = function (eventEmitter) {
        if (_.M.isEventEmitter(eventEmitter)) {
            if (this._event_following.hasOwnProperty(eventEmitter.id)) {
                this.emitEvent('detached', [eventEmitter]);
                delete this._event_following[eventEmitter.id];
                eventEmitter.detach(this);

                return true;
            }
            return false;

        }

        throw new Error('Invalid _.M.EventEmitter instance');
    };

    /**
     *
     * @type {EventEmitter}
     */
    _.M.EventEmitter = EventEmitter;

    /**
     * Check if object is instance of Event Emitter
     * @param {object} object
     * @returns {boolean}
     */
    _.M.isEventEmitter = function (object) {
        if (_.isObject(object)) {
            return object instanceof EventEmitter;
        }

        return false;
    };

})(_);
/**
 * Cache management system
 * @module _.M.CACHE
 * @memberOf _.M
 */
;(function (_) {
    _.M.defineConstant({
        /**
         * 10 seconds
         * @name _.M.CACHE_MIN
         * @constant {number}
         * @default
         */
        CACHE_MIN: 10,
        /**
         * 1 minute
         * @name _.M.CACHE_TINY
         * @constant {number}
         * @default
         */
        CACHE_TINY: 60,
        /**
         * 5 minutes
         * @name _.M.CACHE_SHORT
         * @constant {number}
         * @default
         */
        CACHE_SHORT: 300,
        /**
         * 10 minutes
         * @name _.M.CACHE_MEDIUM
         * @constant {number}
         * @default
         */
        CACHE_MEDIUM: 600,
        /**
         * 1 hour
         * @name _.M.CACHE_LONG
         * @constant {number}
         * @default
         */
        CACHE_LONG: 3600,
        /**
         * Forever
         * @name _.M.CACHE_FOREVER
         * @constant {number}
         * @default
         */
        CACHE_FOREVER: true
    });

    var _cache_data = {};
    var _clean_interval_time = _.M.CACHE_MIN;
    var _clean_interval;

    /**
     * Check if a cache name is exists
     * @param {string} name
     * @returns {boolean}
     * @private
     */
    function _has_cache(name) {
        if (_.has(_cache_data, name)) {
            //-1 to ensure this cache is valid when get right after check
            if (_cache_data[name].expire_time === true || (_cache_data[name].expire_time - 1) > _.M.nowSecond()) {
                return true;
            }
            _expire_cache(name);
        }
        return false;
    }

    /**
     * Set cache value
     * @param {string} name
     * @param {*} value
     * @param {number} [live_time] Seconds
     * @private
     */
    function _set_cache(name, value, live_time) {
        if (_.isUndefined(live_time) || !_.M.isNumeric(Number(live_time))) {
            live_time = _.M.CACHE_MEDIUM;
        }
        _cache_data[name] = {
            value: value,
            live_time: live_time,
            expire_time: live_time === true ? true : _.M.nowSecond() + live_time
        }
    }

    /**
     * Delete expire caches
     * @private
     */
    function _expire_cache() {
        _.each(_.flatten(arguments), function (name) {
            delete _cache_data[name];
        });
    }

    /**
     * Add/Remove item when cached item is array
     * @param {string} name
     * @param {*} value
     * @param {boolean} [addMode = true] Add mode
     * @returns {*} Return new value of cache
     * @private
     */
    function _cache_collection_change(name, value, addMode) {
        var live_time = _.M.CACHE_MEDIUM;
        var new_value = [];

        if (_.isUndefined(addMode)) {
            addMode = true;
        }

        if (_has_cache(name)) {
            var old_detail = _cache_data[name];

            live_time = old_detail.live_time;
            new_value = old_detail.value;

            if (!_.isArray(new_value)) {
                new_value = [new_value];
            }
            if (addMode) {
                new_value.push(value);
            } else {
                var last_index = _.lastIndexOf(new_value, value);

                if (last_index != -1) {
                    new_value.splice(last_index, 1);
                }
            }
        } else {
            if(addMode){
                new_value.push(value);
            }else{
                return undefined;
            }

        }
        _set_cache(name, new_value, live_time);
        return _cache_data[name].value;
    }

    /**
     * Add/Subtract value of cached item when it is number
     * @param {string} name
     * @param {number} [value = 1]
     * @param {boolean} [addMode = true] TRUE - add mode, FALSE - subtract mode
     * @returns {number}
     * @private
     */
    function _cache_number_change(name, value, addMode) {
        if (_.isUndefined(value) || !_.M.isNumeric(Number(value))) {
            value = 1;
        }
        if (_.isUndefined(addMode)) {
            addMode = true;
        }
        if (addMode) {
            value = Math.abs(value);
        }else{
            value = -1 * Math.abs(value);
        }

        if (!_has_cache(name)) {
            _set_cache(name, value);
        } else {
            _cache_data[name].value =  Number(_cache_data[name].value);

            if (!_.M.isNumeric(_cache_data[name].value)) {
                _cache_data[name].value = 0;
            }

            _cache_data[name].value += value;
        }

        return _cache_data[name].value;
    }

    /**
     * Clean expired caches
     * @private
     */
    function _clean_cache() {
        var removes = [];
        var now_second = _.M.nowSecond();
        _.each(_cache_data, function (data, name) {
            if (data.expire_time !== true && data.expire_time <= now_second) {
                removes.push(name);
            }
        });
        _expire_cache(removes);
    }

    //Clean cache every 10 seconds
    _clean_interval = setInterval(_clean_cache, _clean_interval_time * 1000);

    /**
     * @lends _.M.CACHE
     * @type {{}}
     */
    _.M.CACHE = _.M.defineObject({

        set: function (name, value, live_time) {
            _set_cache(name, value, live_time);
        },
        /**
         * Check if a cached name is exists
         * @param {string} name
         * @returns {boolean}
         */
        has: function (name) {
            return _has_cache(name);
        },

        /**
         * Get cached value
         * @param {string} name
         * @param {*} default_value
         * @returns {*}
         */
        get: function (name, default_value) {
            if (_.has(_cache_data, name)) {
                if (_cache_data[name].expire_time === true || _cache_data[name].expire_time > _.M.nowSecond()) {
                    return _cache_data[name].value;
                }
                delete _cache_data[name];
            }

            return default_value;
        },

        /**
         * Add live time
         * @param {string} name
         * @param {number} [live_time] Default is cached live time
         * @return {boolean|number} False - cache is not exists. True - cache is forever. Number - next expire time
         */
        touch: function (name, live_time) {
            if (this.has(name)) {
                if (_cache_data[name].expire_time !== true) {
                    var cache = _cache_data[name];

                    if (!_.M.isNumeric(live_time)) {
                        live_time = cache.live_time;
                    }

                    cache.expire_time = Math.max(cache.expire_time, _.M.nowSecond() + live_time);

                    return cache.expire_time;
                }

                return true;
            }

            return false;
        },

        /**
         * Get valid caches
         * @param {boolean} [name_only = true] Only return cache name
         * @returns {*}
         */
        list: function (name_only) {

            /**
             * @type {({}|Array)}
             */
            var result;
            var now_second = _.M.nowSecond();

            /**
             * @type {function}
             */
            var addItem;
            if (name_only || _.isUndefined(name_only)) {
                result = [];
                addItem = function (key) {
                    result.push(key);
                };
            } else {
                result = {};
                addItem = function (key, data) {
                    result[key] = data;
                }
            }

            _.each(_cache_data, function (data, key) {
                if (data.expire_time === true || now_second < data.expire_time) {
                    addItem(key, data);
                }
            });

            return result;
        },

        /**
         * Clean expired caches
         */
        clean: function () {
            return _clean_cache();
        },

        /**
         * Manual delete expired caches
         */
        expire: function () {
            _expire_cache(Array.prototype.slice.apply(arguments));
        },

        /**
         * Increment value of a cache, if cache is not exists then create with value and live time as default
         * (CACHE_MEDIUM), if exists then increment it and set live time as old. If old value isn't a valid numeric
         * then set it to 0
         *
         * @param {string} name
         * @param {number} [value = 1] Increment value
         * @returns {number}
         */
        increment: function (name, value) {
            if (!_.M.isNumeric(value)) {
                value = 1;
            }
            return _cache_number_change(name, value, true);
        },

        /**
         * Decrement value of a cache, if cache is not exists then create with value and live time as default
         * (CACHE_MEDIUM), if exists then decrement it and set live time as old. If old value isn't a valid numeric
         * then set it to 0
         *
         * @param {string} name
         * @param {number} [value = 1] Decrement value
         * @returns {number}
         */
        decrement: function (name, value) {
            if (!_.M.isNumeric(value)) {
                value = 1;
            }
            return _cache_number_change(name, value, false);
        },

        /**
         * Add item to array
         * @param {string} name
         * @param {*} value
         * @returns {*}
         */
        arrayPush: function (name, value) {
            return _cache_collection_change(name, value, true);
        },

        /**
         * Remove item from array
         * @param {string} name
         * @param {*} value
         * @returns {*}
         */
        arrayWithout: function (name, value) {
            return _cache_collection_change(name, value, false);
        }
    });

})(_);
;(function (_) {
    var tasks = {};

    /**
     *
     * @param {string|function|function[]|{}} [handler]
     * @constructor
     */
    function Task(handler) {
        this.type_prefix = 'task';
        _.M.BaseClass.call(this);
        /**
         * Task name
         * @type {string}
         */
        this.name = '';
        /**
         * Task options
         * @type {{}}
         */
        this.options = {};

        /**
         * Task process handler
         * @type {string|Function|Function[]|{}|null}
         */
        this.handler = handler || null;

        /**
         *
         * @type {*}
         * @private
         */
        this._result = null;

        /**
         *
         * @type {null|{code: number, message: string}}
         * @private
         */
        this._error = null;
    }

    /**
     *
     * @param {string|{}} name Option name or object of options
     * @param {*} [value]
     * @returns {Task}
     */
    Task.prototype.option = function (name, value) {
        this.options = _.M.setup.apply(_.M, [this.options].concat(Array.prototype.slice.apply(arguments)));

        return this;
    };

    /**
     * Check if process is error
     * @returns {boolean}
     */
    Task.prototype.isError = function () {
        return this._error;
    };

    /**
     * @return {void|{}} void when process is ok. Object with error code and message
     */
    Task.prototype.getError = function () {
        if (this.isError()) {
            return _.pick(_.extend({
                code: 0,
                message: ''
            }, _.isObject(this._error) ? this._error : {}), 'code', 'message');
        }
    };

    /**
     *
     * @returns {*}
     */
    Task.prototype.getResult = function () {
        return this._result;
    };

    /**
     *
     * @param {*} result
     */
    Task.prototype.setProcessResult = function (result) {
        this._result = result;
        this._error = null;
    };

    /**
     *
     * @param {string} message
     * @param {string|number} [code=0]
     */
    Task.prototype.setProcessError = function (message, code) {
        this._result = null;
        this._error = {
            message: message,
            code: code || 0
        }
    };

    /**
     *
     * @param {*} data
     * @returns {boolean}
     */
    Task.prototype.process = function (data) {
        var self = this;

        this._result = _.clone(data);
        this._error = null;

        if (_.isString(this.handler)) {
            this.handler = _.M.beArray(this.handler);
        }
        if (_.isFunction(this.handler)) {
            this.handler.bind(this)(data, this.setProcessResult.bind(this), this.setProcessError.bind(this));
        } else if (this.handler instanceof Task) {
            this.handler.process(self._result);

            self._result = this.handler.getResult();
            self._error = this.handler.getError();
        } else if (_.isArray(this.handler)) {
            _.M.loop(this.handler, function (handle) {
                var tmp_task_instance;

                if (_.isString(handle)) {
                    tmp_task_instance = Task.factory(handle);
                } else {
                    tmp_task_instance = new Task(handle);
                }

                tmp_task_instance.process(self._result);
                self._result = tmp_task_instance.getResult();
                self._error = tmp_task_instance.getError();

                if (self.isError()) {
                    return 'break';
                }
            });
        } else if (_.isObject(this.handler)) {
            _.M.loop(this.handler, function (options, handle) {
                var tmp_task_instance = Task.factory(handle);

                if (!_.isEmpty(options)) {
                    tmp_task_instance.options(options);
                }

                tmp_task_instance.process(self._result);
                self._result = tmp_task_instance.getResult();
                self._error = tmp_task_instance.getError();

                if (self.isError()) {
                    return 'break';
                }
            });
        }

        return !this.isError();
    };

    /**
     * Check if task is exists
     * @param {string} name
     * @returns {boolean}
     */
    Task.has = function (name) {
        return tasks.hasOwnProperty(name);
    };

    /**
     * Return task list
     * @returns {Array}
     */
    Task.list = function () {
        return Object.keys(tasks);
    };

    /**
     * Register task
     * @param {string} name
     * @param {string|function|object|function[]} handler
     * @param {{}} [options] Task options
     */
    Task.register = function (name, handler, options) {
        var info = _.M.optionalArgs(Array.prototype.slice.call(arguments, 0), ['name', 'handler', 'options'], {
            name: 'string', handler: [
                'string', 'function', 'array', 'Task'
            ], options: 'object'
        });

        if (info.handler instanceof Task) {
            info.name = info.handler.name;
        }

        tasks[info.name] = {
            handler: info.handler,
            options: info.options
        }
    };

    /**
     * Create task instance from name
     * @param {string} name Task name
     * @param {{}} [options] Task instance options
     * @returns {Task}
     */
    Task.factory = function (name, options) {
        if (Task.has(name)) {
            var task_info = tasks[name],
                task = new Task();

            task.name = name;
            task.handler = task_info['handler'];
            task.options = task_info['options'];

            if (_.isObject(options)) {
                task.option(options);
            }
            return task;
        }

        throw new Error('Create unregistered task: ' + name);
    };

    Task.apply = function (data, tasks) {
        var result = {
            data: _.clone(data)
        };

        if(tasks){
            if(_.isString(tasks)){
                tasks = [tasks];
            }
            if (_.isArray(tasks)) {
                tasks = _.object(tasks, _.M.repeat({}, tasks.length, true));
            }

            _.M.loop(tasks, function (options, name) {
                var task = Task.factory(name, options);

                if (task.process(_.clone(result['data']))) {
                    result['data'] = task.getResult();
                } else {
                    delete result['data'];
                    result['error'] = task.getError();
                    return 'break';
                }
            });
        }

        return result;
    };

    _.M.Task = Task;
}).call(window, _);
/**
 * Application
 * @module _.M.App
 * @memberOf _.M
 * @requires _.M.EventEmitter
 */
;(function (_) {
    function App() {
        _.M.EventEmitter.call(this);

        this.private('init');
    }

    _.M.inherit(App, _.M.EventEmitter);

    /**
     * Option this app
     * @param {string|{}} option
     * @param {*} value
     * @param {string} [separator='.']
     */
    App.prototype.option = function (option, value, separator) {
        var options = {}, invalid_options;

        if (_.isObject(option)) {
            options = option;
            invalid_options = _.pick(options, function (value, key) {
                return (key + '')[0] === '_' || _.isFunction(value);
            });

            if (!_.isEmpty(invalid_options)) {
                console.warn('Invalid _.App options: ' + Object.keys(invalid_options).join(', '));
            }
            _.extend(this, _.omit(option, Object.keys(invalid_options)));
        } else {
            option += '';
            var deep = option.split(separator || '.');

            if (deep[0][0] === '_') {
                console.warn('Invalid _.App options: ' + deep[0][0]);
                return this;
            }

            _.M.defineDeep(this, deep, value);
        }

        return this;
    };

    /**
     * Add init callback
     * @param {function} callback
     * @param {boolean} [time=1]
     * @param {number} [priority=_.M.PRIORITY_DEFAULT]
     */
    App.prototype.onInit = function (callback, time, priority) {
        this.addListener('init', callback, {
            times: time || 1,
            priority: priority || _.M.PRIORITY_DEFAULT
        });

        return this;
    };

    /**
     * Init App
     * @param {boolean} [reset=false]
     */
    App.prototype.init = function (reset) {
        this.emitEvent('init');

        reset && this.resetEvents('init');
    };

    App.prototype.resetInitCallbacks = function () {
        this.resetEvents('init');
    };

    _.module('App', new App);
})(_);
/**
 * @module _.M.AJAX
 * @memberOf _.M
 * @requires _.M.EventEmitter
 */
;(function (_) {

    _.M.defineConstant({
        AJAX_PRE_OPTIONS_NAME: '_.M.AJAX',
        /**
         * @constant {string}
         * @default
         */
        AJAX_ABORTED: 'aborted',
        /**
         * @constant {string}
         * @default
         */
        AJAX_TIMEOUT: 'timeout',
        /**
         * @constant {string}
         * @default
         */
        AJAX_PARSER_ERROR: 'parser_error',
        /**
         * @constant {number}
         * @default
         */
        AJAX_SERVER_ERROR: 500,
        /**
         * @constant {number}
         * @default
         */
        AJAX_FORBIDDEN: 403,
        /**
         * @constant {number}
         * @default
         */
        AJAX_NOT_FOUND: 404
    });

    var jqXHR_response_statuses = {
        204: 'Server has received the request but there is no information to send back',
        400: 'The request had bad syntax or was inherently impossible to be satisfied',
        401: 'The parameter to this message gives a specification of authorization schemes which are acceptable',
        403: 'The request is for something forbidden',
        404: 'The server has not found anything matching the URI given',
        405: 'Method not allowed',
        406: 'Not acceptable',
        408: 'Request timeout',
        413: 'Payload too large',
        414: 'URI too long',
        429: 'Too many requests',
        431: 'Request header fields too large',
        500: 'The server encountered an unexpected condition which prevented it from fulfilling the request',
        501: 'The server does not support the facility required',
        parser_error: 'Parse response failed',
        aborted: 'Manual abort request'
    };

    /**
     * Option values
     * - response_tasks: Response adapter object with key is adapter name, value is adapter option object
     * - data_tasks: Data adapter object with key is adapter name, value is adapter option object
     * - auto_abort: abort prev request if not completed
     * - retry: retry times when error
     * - is_continue: check if continue to retry request. Boolean or function which bind to AJAX instance, return
     * boolean value
     */
    _.M.PreOptions.define(_.M.AJAX_PRE_OPTIONS_NAME, {
        response_tasks: {},
        data_tasks: {},
        auto_abort: true,
        retry: 0,
        retry_delay: 0,
        is_continue: true
    });

    /**
     *
     * @param {object} [options]
     * @class _.M.AJAX
     * @extends _.M.EventEmitter
     */
    function AJAX(options) {
        _.M.EventEmitter.call(this);

        this.options = _.M.PreOptions.get(_.M.AJAX_PRE_OPTIONS_NAME);

        /**
         * jQuery XHR object
         * @type {null}
         * @property
         */
        this.jqXHR = null;

        /**
         * requested times
         * @type {number}
         * @property
         */
        this.requested = 0;

        /**
         * @property
         * @type {number}
         */
        this.retry_time = 0;

        /**
         * @property
         * @type {null|object}
         * @private
         */
        this._last_options = null;

        /**
         * @property
         * @type {boolean}
         * @private
         */
        this._is_retrying = false;

        /**
         * @property
         * @type {null}
         * @private
         */
        this._retry_timeout_id = null;

        /**
         * @property
         * @type {*}
         */
        this.response = null;

        /**
         * @property
         * @type {{code: number|string, message: string}}
         */
        this.error = null;
        this._is_response_meaning_failed = false;

        if (_.isObject(options)) {
            this.option(options);
        }
    }

    _.M.inherit(AJAX, _.M.EventEmitter);

    /**
     *
     * @param {{}} options
     */
    AJAX.globalOption = function (options) {
        _.M.PreOptions.update(_.M.AJAX_PRE_OPTIONS_NAME, options);
    };

    /**
     * Get error detail
     * @param {Array} error_arguments jQuery error callback arguments as array
     * @returns {{code: string|number, message: string}}
     */
    AJAX.beautifyError = function (error_arguments) {
        var jqXHR = error_arguments[0],
            textStatus = error_arguments[1],
            errorThrown = error_arguments[2],
            err_result = {
                code: '',
                message: 'Ajax error'
            };

        switch (textStatus) {
            case 'parsererror':
                err_result.code = _.M.AJAX_PARSER_ERROR;
                break;

            case 'abort':
                err_result.code = _.M.AJAX_ABORTED;
                break;

            default:
                err_result.code = jqXHR.status;
        }

        if (jqXHR_response_statuses.hasOwnProperty(err_result.code)) {
            err_result.message = jqXHR_response_statuses[err_result.code];
        } else {
            err_result.message = errorThrown;
        }

        return err_result;
    };

    AJAX.prototype.option = function (option, value) {
        this.options = _.M.setup.apply(_.M, [this.options].concat(Array.prototype.slice.apply(arguments)));

        return this;
    };

    AJAX.prototype.data = function (data) {
        this.options.data = data;

        return this;
    };
    AJAX.prototype.addData = function (name, value) {
        var data;

        if (!this.options.data) {
            this.options.data = {};
        }

        if (_.isObject(arguments[0])) {
            data = _.extend({}, name);
        } else {
            data = {};
            if (arguments.length < 2) {
                data[name + ''] = 'true';
            } else {
                data[name] = value;
            }
        }

        if (_.isObject(this.options.data)) {
            _.extend(this.options.data, data);
        } else if (_.isString(this.options.data)) {
            data = _.map(data, function (value, key) {
                return key + '=' + value;
            });

            if (this.options.data.length) {
                this.options.data += '&' + data;
            } else {
                this.options.data = data;
            }
        }

        return this;
    };

    /**
     * Add success callback. Callback arguments:
     * - response: last response after processed by AJAXResponseAdapters
     *
     * @param callback
     * @returns {AJAX}
     */
    AJAX.prototype.done = function (callback) {
        this.on('done', callback);

        if (this.isSuccess()) {
            callback.apply(this, [_.clone(this.response)]);
        }


        return this;
    };

    /**
     * Add catch callback. Callback arguments:
     * - message: Error message
     * - code: error code
     *
     * @param callback
     * @returns {AJAX}
     */
    AJAX.prototype.fail = function (callback) {
        this.on('fail', callback);

        if (this.isFailed()) {
            callback.apply(this, [this.error.message, this.error.code]);
        }

        return this;
    };

    /**
     * Add finally callback
     *
     * @param callback
     * @returns {AJAX}
     */
    AJAX.prototype.always = function (callback) {
        this.on('always', callback);

        if (this.isDone()) {
            callback.apply(this, [this.error, this.response]);
        }

        return this;
    };

    /**
     * Get status of ajax
     * @returns {(boolean|number)}
     */
    AJAX.prototype.status = function () {
        if (_.isObject(this.jqXHR) && this.jqXHR.hasOwnProperty('readyState')) {
            return this.jqXHR.readyState;
        }

        return false;
    };
    /**
     * Check if instance is ready for request
     * @returns {boolean}
     */
    AJAX.prototype.isReady = function () {
        var status = this.status();

        return status !== false && status === 0;
    };

    /**
     * Check if instance is requesting
     * @returns {boolean}
     */
    AJAX.prototype.isRequesting = function () {
        var status = this.status();

        return status !== false && status >= 1 && status <= 3;
    };

    AJAX.prototype.isRetrying = function () {
        return Boolean(this._is_retrying);
    };

    /**
     * Check if request is done and not retrying
     * @returns {boolean}
     */
    AJAX.prototype.isDone = function () {
        return !this.isRetrying() && this.status() === 4;
    };

    AJAX.prototype.isFailed = function () {
        return this.isDone() && !_.isEmpty(this.error);
    };

    AJAX.prototype.isResponseMeaningFailed = function () {
        return this.isFailed() && this._is_response_meaning_failed;
    };

    AJAX.prototype.isSuccess = function () {
        return this.isDone() && _.isEmpty(this.error);
    };

    /**
     * Check if current request is aborted
     * @returns {boolean}
     */
    AJAX.prototype.isAborted = function () {
        return this.error && (this.error.code === _.M.AJAX_ABORTED);
    };

    AJAX.prototype.isLastRetryTime = function () {
        return this.isRetrying() && this.options.retry && this.retry_time >= parseInt(this.options.retry);
    };

    AJAX.prototype.isRetryable = function () {
        if (!_.isEmpty(this.error) && !this.isAborted() && !this.isResponseMeaningFailed() && this.options.retry && this.retry_time < parseInt(this.options.retry)) {
            var is_continue;

            if (_.isFunction(this.options.is_continue)) {
                is_continue = this.options.is_continue.bind(this)(_.clone(this.error));
            } else {
                is_continue = Boolean(this.options.is_continue);
            }

            return is_continue;
        }

        return false;
    };

    function _ajax_done_cb(response) {
        var result = _.M.Task.apply(response, this.options.response_tasks);

        if (result.error) {
            this._is_response_meaning_failed = true;
            this.error = result.error;

            if (!this.isRetryable()) {
                this.emitEvent('fail', [result.error.message, result.error.code]);
            }

            return;
        }

        this.response = result.data;

        this.emitEvent('done', [_.clone(result.data)]);
    }

    function _ajax_fail_cb(jqXHR, textStatus, errorThrown) {
        var err_result = AJAX.beautifyError(arguments);

        this.error = err_result;

        if (!this.isRetryable() && !this.isAborted()) {
            this.emitEvent('fail', [err_result.message, err_result.code]);
        }
    }

    function _at_the_end(ajax_instance) {
        ajax_instance._last_options = null;
        ajax_instance._is_retrying = false;
        ajax_instance.emitEvent('always', [ajax_instance.error, ajax_instance.response]);

        if (_.App) {
            _.App.emitEvent('ajax_complete', [ajax_instance]);
        }
    }

    function _ajax_always_cb(jqXHR, textStatus) {
        var self = this;

        if (this.isAborted()) {
            this.emitEvent('aborted');
        } else if (this.isRetryable()) {
            if (this.isRetrying()) {
                this.emitEvent('retry_complete', [this.retry_time, this.isLastRetryTime(), jqXHR, textStatus]);

                if (_.App) {
                    _.App.emitEvent('ajax_retry_complete', [this, this.retry_time, this.isLastRetryTime(), jqXHR, textStatus]);
                }
            }

            this._is_retrying = true;
            if (!this.options.retry_delay) {
                this.request();
            } else {
                this._retry_timeout_id = _.M.async(function () {
                    self.request();
                }, [], this.options.retry_delay);
            }

            return;
        }

        _at_the_end(this);
    }

    /**
     * Get request option, ready for request
     * @param instance
     * @param {{}} options
     * @return {{}|boolean}
     */
    function _getRequestOptions(instance, options) {
        var last_options = _.extend({}, instance.options, _.isObject(options) ? options : {}),
            before_send_cb;

        if (last_options.hasOwnProperty('success') || last_options.hasOwnProperty('done')) {
            instance.removeListener('success_listeners_from_options');
            instance.addListener('done', _.values(_.pick(last_options, ['success', 'done'])), {
                priority: _.M.PRIORITY_HIGHEST,
                key: 'success_listeners_from_options'
            });
        }
        if (last_options.hasOwnProperty('error') || last_options.hasOwnProperty('fail')) {
            instance.removeListener('error_listeners_from_options');
            instance.addListener('fail', _.values(_.pick(last_options, ['error', 'fail'])), {
                priority: _.M.PRIORITY_HIGHEST,
                key: 'error_listeners_from_options'
            });
        }
        if (last_options.hasOwnProperty('complete') || last_options.hasOwnProperty('always')) {
            instance.removeListener('complete_listeners_from_options');
            instance.addListener('always', _.values(_.pick(last_options, ['complete', 'always'])), {
                priority: _.M.PRIORITY_HIGHEST,
                key: 'complete_listeners_from_options'
            });
        }
        if (last_options.hasOwnProperty('beforeSend')) {
            before_send_cb = last_options.beforeSend;
        }

        _.M.removeItem(last_options, ['success', 'done', 'error', 'fail', 'complete', 'always', 'beforeSend']);

        last_options['done'] = _ajax_done_cb.bind(instance);
        last_options['fail'] = _ajax_fail_cb.bind(instance);
        last_options['always'] = _ajax_always_cb.bind(instance);
        last_options['beforeSend'] = function (jqXHR, settings) {
            var result = true;

            if (instance.option('auto_abort') && instance.isRequesting()) {
                instance.abort();
            }
            if (_.isFunction(before_send_cb) && !instance.isRetrying()) {
                result = _.M.callFunc(before_send_cb, [jqXHR, settings], instance);
            }
            if (!_.isObject(last_options.data)) {
                last_options.data = {};
            }

            if (false !== result) {
                instance.requested++;
                instance.error = null;
                instance._is_response_meaning_failed = false;
                instance.response = null;
                instance.responses = null;

                if (instance.isRetrying()) {
                    instance.retry_time++;
                    instance.emitEvent('retry');
                } else {
                    instance.retry_time = 0;
                    instance.emitEvent('request');
                }
            }

            return result;
        };

        if (!_.isEmpty(last_options.data_tasks)) {
            var request_data_result = _.M.Task.apply(_.clone(last_options.data), last_options.data_tasks);

            if (request_data_result.data) {
                last_options.data = request_data_result.data;
            } else {
                this.error = request_data_result.error;
                return false;
            }
        }

        _.M.removeItem(last_options, ['response_tasks', 'data_tasks', 'auto_abort', 'retry', 'retry_delay', 'is_continue']);

        return last_options;
    }

    /**
     * Do Request
     * @param instance
     * @param options
     * @returns {AJAX|*}
     * @private
     */
    function _do_request(instance, options) {
        var last_options;

        if ((arguments.length == 1 || instance.isRetrying()) && _.isObject(instance._last_options)) {
            last_options = instance._last_options;
        } else {
            last_options = _getRequestOptions(instance, options);
            if (false !== last_options) {
                instance._last_options = last_options;
            } else {
                instance.emitEvent('fail', [instance.error.message, instance.error.code]);
                _at_the_end(instance);
            }
        }

        if (last_options) {
            instance.jqXHR = $.ajax(_.omit(last_options, ['done', 'fail', 'always']))
                .done(last_options['done'])
                .fail(last_options['fail'])
                .always(last_options['always']);
        }

        return instance;
    }

    AJAX.prototype.request = function (options) {
        return _do_request(this, options);
    };

    /**
     * Abort current request
     */
    AJAX.prototype.abort = function () {
        if (this.isRequesting() && this.jqXHR.abort) {
            this.jqXHR.abort();
        } else if (this.isRetrying()) {
            clearTimeout(this._retry_timeout_id);
            this.emitEvent('aborted');
            _at_the_end(this);
        }
    };

    function _ajax_restful_shorthand_func(instance, method, url, data, callback, dataType) {
        var args,
            options = {
                url: url,
                method: (method + '').toUpperCase()
            };

        args = _.M.optionalArgs(Array.prototype.slice.call(arguments, 3), ['data', 'callback', 'dataType'], {
            data: ['string', 'object'],
            callback: 'function',
            dataType: 'string'
        });

        if (args.data) {
            options.data = args.data;
        }
        if (args.callback) {
            options.done = args.callback;
        }
        if (args.dataType) {
            options.dataType = args.dataType;
        }

        return _do_request(instance, options);
    }

    ['get', 'post', 'put', 'delete'].forEach(function (method) {
        AJAX.prototype[method] = function (url, data, callback, dataType) {
            return _ajax_restful_shorthand_func.apply(null, [this, method.toUpperCase()].concat(Array.prototype.slice.call(arguments, 0)));
        };
    });
    ['get', 'post'].forEach(function (method) {
        AJAX.prototype[method + 'JSON'] = function (url, data, callback) {
            var args = _.M.optionalArgs(Array.prototype.slice.call(arguments, 0, 3), ['url', 'data', 'callback'], {
                    url: 'string',
                    data: ['string', 'object'],
                    callback: 'function'
                }),
                options = {
                    dataType: 'json'
                };

            if (args.url) {
                options.url = args.url;
            }
            if (args.data) {
                options.data = args.data;
            }
            if (args.callback) {
                options.done = args.callback;
            }

            return this.request(options);
        };
    });

    ['get', 'post', 'put', 'delete', 'getJSON', 'postJSON'].forEach(function (method) {
        AJAX[method] = function (url, data, callback, dataType) {
            var instance = new AJAX();

            instance[method].apply(instance, Array.prototype.slice.call(arguments, 0));
            return instance;
        }
    });

    /**
     *
     * @param {string|object} [data]
     */
    AJAX.prototype.query = function (data) {
        var options = {
            method: 'GET'
        };

        if (data) {
            options.data = data;
        }

        return this.request(options);
    };

    /**
     *
     * @param {string|object} [data]
     */
    AJAX.prototype.send = function (data) {
        var options = {
            method: 'POST'
        };

        if (data) {
            options.data = data;
        }

        return this.request(options);
    };


    /*
     |--------------------------------------------------------------------------
     | AJAX Helpers
     |--------------------------------------------------------------------------
     */

    /**
     * Create AJAX instance with Pre Options
     * @param {string} pre_options_name
     * @param {{}} [custom_options={}]
     * @returns {_.M.AJAX}
     */
    AJAX.use = function (pre_options_name, custom_options) {
        return new AJAX(_.M.PreOptions.get(pre_options_name, custom_options));
    };


    function _load_apply_content(response, target, apply_type) {
        target = $(target);
        switch (apply_type) {
            case 'append':
                target.append(response);
                break;
            case 'prepend':
                target.prepend(response);
                break;

            default:
                target.html(response);
        }
    }

    /**
     * Load content to element
     * @param {string} url
     * @param {string|*} target Selector string or jQuery DOM
     * @param {{}} options Options:
     * - error_content: null - default error content: "Load content failed: <error message>. Error code: <error code>".
     * It may be string or function with arguments as: error message, error code
     * - apply_type: Way to apply response to target: replace, append or prepend. Default is replace
     */
    AJAX.load = function (url, target, options) {
        var instance = new AJAX();

        if (!_.isObject(options)) {
            options = {};
        }

        options = _.extend({
            error_content: '',
            apply_type: 'replace'
        }, options, {
            url: url
        });

        instance.option(options);
        instance.done(function (response) {
            _load_apply_content(response, target, options.apply_type);
        }).fail(function (error_message, error_code) {
            var response = '';

            if (options.error_content) {
                if (_.isFunction(options.error_content)) {
                    response = options.error_content(instance, error_message, error_code);
                } else {
                    response = options.error_content + '';
                }
            }

            _load_apply_content(response, target, options.apply_type);
        });

        instance.request();

        return instance;
    };

    /**
     *
     * @type {_.M.AJAX}
     */
    _.M.AJAX = AJAX;
})(_);