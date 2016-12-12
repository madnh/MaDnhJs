(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['lodash'], function (_) {
            return (root.M = factory(_));
        });
    } else {
        root.M = factory(root._);
    }
}(this, function (_) {
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
                    return _.zipObject(Object.keys(name), name);
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
    cast_types['array'] = _.castArray;
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
     * @param {object|Array} obj Loop object
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
     * _.M.contentType([1,2]); //Array
     * _.M.contentType({}); //Object
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
        return M.className(obj, true) === class_name;
    };

    /**
     * Check if object is primitive type: null, string, number, boolean
     * @param value
     * @returns {boolean}
     * @example
     * _.M.isPrimitiveType(123); //true
     * _.M.isPrimitiveType('123'); //true
     * _.M.isPrimitiveType(null); //true
     * _.M.isPrimitiveType(); //true
     * _.M.isPrimitiveType(_.App); //false
     */
    M.isPrimitiveType = function (value) {
        if (_.isObject(value)) {
            return false;
        }

        var type = typeof value;
        return value == null || type === 'string' || type === 'number' || type === 'boolean';
    };

    M.mergeObject = function () {
        var next_index = 0;

        for (var i = 0, length = arguments.length; i < length; i++) {
            if (_.isArray(arguments[i]) || !_.isObject(arguments[i])) {
                arguments[i] = _.castArray(arguments[i]);
                arguments[i] = _.zipObject(_.range(next_index, next_index += arguments[i].length), arguments[i]);
            }
        }

        return _.extend.apply(_, arguments);
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
     * @example
     * _.M.diffObject({a: 0, b: 1}, {a: '0', b: 1}); //{a: 0}
     */
    M.diffObject = function (object, others) {
        var args = _.flatten(_.toArray(arguments));

        args.unshift(is_diff_strict_cb);

        return diff_object.apply(null, args);
    };

    /**
     * Get dirty of object with others object. Loose comparison
     * @param {object} object
     * @param {object} others
     * @return {*}
     * @example
     * _.M.diffObjectLoose({a: 0, b: 1}, {a: '0', b: 2}); //{b: 1}
     */
    M.diffObjectLoose = function (object, others) {
        var args = _.flatten(_.toArray(arguments));

        args.unshift(is_diff_loose_cb);

        return diff_object.apply(null, args);
    };

    /**
     * Get dirty of object with others object, use callback
     * @param {function} callback Callback with 2 parameters: base value, other object value. Return true when difference
     * @param {object} object
     * @param {object} others
     * @return {*}
     */
    M.diffObjectWith = function (callback, object, others) {
        return diff_object.apply(null, slice.apply(arguments))
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
                    _.each(option, function (val, path) {
                        _.set(object, path, val);
                    });
                }
                break;

            case 3:
                _.set(object, option, value);
        }

        return object;
    };

    /**
     * Get all of valid keys that exists in object.
     *
     * @param {object} object
     * @param {Array} keys
     * @return {Array}
     */
    M.validKeys = function (object, keys) {
        var result = [];

        keys = _.castArray(keys);
        for (var i = 0, length = keys.length; i < length; i++) {
            if (object.hasOwnProperty(keys[i])) {
                result.push(keys[i]);
            }
        }

        return result;
    };


    /**
     * Like _.pairs but array item is an object with field is "key", "value"
     * @param {{}} object
     * @param {string} [key = 'key']
     * @param {string} [value = 'value']
     * @returns {Array}
     * @example
     * _.M.pairsAsObject({one: 1, two: 2, three: 3});
     * => [{key: 'one', value: 1},{key: 'two', value: 2},{key: 'three', value: 3}]
     */
    M.pairsAsObject = function (object, key, value) {
        var result = [],
            field_key = key || 'key',
            field_value = value || 'value';

        _.each(object, function (value, key) {
            var item = {};

            item[field_key] = key;
            item[field_value] = value;

            result.push(item);
        });

        return result;
    };

    /**
     * A convenient version of what is perhaps the most common use-case for map: extracting a list of property values, with a column as key.
     * @param {Array} collection
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
            if (object.hasOwnProperty(key_field)) {
                result[object[key_field]] = object.hasOwnProperty(value_field) ? object[value_field] : undefined;
            }
        });

        return result;
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
        return _.chunk(array, Math.ceil(array.length / chunks));
    };

    /**
     * Toggle array's elements
     * @param {Array} array
     * @param {Array} elements
     * @param {boolean} status If this param is boolean then add/remove base on it value. By default it is undefined -
     *     add if none exists, remove if existed
     * @returns {Array}
     * @example
     * var arr = ['A', 'B', 'C', 'D'];
     * _.M.toggle(arr, ['A', 'V']) => ['B', 'C', 'D', 'V']
     * _.M.toggle(arr, ['A', 'V'], true) => ['A', 'B', 'C', 'D', 'V']
     * _.M.toggle(arr, ['A', 'V'], false) => ['B', 'C', 'D']
     */
    M.toggle = function (array, elements, status) {
        elements = _.uniq(_.castArray(elements));
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
        return _.has(M, name.trim().toUpperCase());
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
            self = M;

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
            args = _.castArray(args);
        } else {
            args = [];
        }

        if (callback) {
            if (_.isFunction(callback)) {
                return callback.apply(context || null, args);
            } else if (_.isString(callback)) {
                if (window.hasOwnProperty(callback) && _.isFunction(window[callback])) {
                    return window[callback].apply(context || null, args);
                }

                throw new Error('Invalid callback!');
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
        return (function (default_description) {
            console[name].apply(console, (default_description ? [default_description] : []).concat(slice.apply(arguments)));
        })(description);
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


    var debug_types_status = {},
        all_debugging = false;

    /**
     *
     * @param type
     * @returns {boolean}
     */
    M.isDebugging = function (type) {
        if (all_debugging || _.isEmpty(type)) {
            return all_debugging;
        }

        return debug_types_status.hasOwnProperty(type) && debug_types_status[type];

    };
    /**
     *
     * @param [type] default is all debug type
     */
    M.debugging = function (type) {
        if (_.isEmpty(type)) {
            all_debugging = true;
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
            all_debugging = false;
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
        if (M.isDebugging(type)) {
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

        _.each(_.castArray(details), function (item) {
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
            result = _.zipObject(order, args.slice(0, order.length));
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
                    result = _.zipObject(order.slice(0, args.length), args);
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
        SORT_NUMBER_DESC: sortNumberDescCallback
    });


    return M;
}));