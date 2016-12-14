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
     * @param {string} [type] a type, do not require existed
     * @param {number} [value]
     * @returns {number|*}
     */
    M.resetID = function (type, value) {
        if (!arguments.length) {
            type = 'unique_id';
        }

        type = String(type);

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
     * @returns {{}}
     * @example
     * var obj = {a: 'A', b: 'B'}
     * _.M.setup(obj, 'a', '123'); //obj -> {a: '123', b: 'B'}
     * _.M.setup(obj, {b: 'Yahoo', c: 'ASD'}); //obj -> {a: 123, b: 'Yahoo', c: 'ASD'}
     */
    M.setup = function (object, option, value) {
        if (!_.isObject(object)) {
            object = {};
        }
        if (_.isObject(option)) {
            _.each(option, function (val, path) {
                _.set(object, path, val);
            });
        } else {
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
     * Define a MaDnh constant
     * @param {object} target
     * @param {(string|Object)} name
     * @param {*} [value = undefined]
     * @example
     * _.M.defineConstant(obj, 'TEST', 123) => obj.TEST = 123
     */
    M.defineConstant = function (target, name, value) {
        var obj = {};

        if (_.isObject(name)) {
            obj = name;
            value = undefined;
        } else {
            obj[name] = value;
        }
        _.each(obj, function (val, key) {
            key = key.trim().toUpperCase();

            if (!target.hasOwnProperty(key)) {
                Object.defineProperty(target, key, {
                    enumerable: true,
                    value: val
                });
            }
        });
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


    M.defineConstant(M, {
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
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], function () {
            return (root.Flag = factory());
        });
    } else {
        // Browser globals
        root.Flag = factory();
    }
}(this, function () {
    function Flag() {
        this._flags = {};

    }

    /**
     * Check if a flag is exists
     * @param {string} name
     * @return {boolean}
     */
    Flag.prototype.hasFlag = function (name) {
        return this._flags && this._flags.hasOwnProperty(name);
    };

    /**
     * Set a flag
     * @param {string} name
     * @param {boolean} [is_active=true] Flag status, default is True
     * @return {Flag}
     */
    Flag.prototype.flag = function (name, is_active) {
        is_active = (is_active || typeof is_active == 'undefined') ? true : Boolean(is_active);

        if (!this._flags) {
            this._flags = {};
        }
        if (name instanceof Array) {
            for (var i = 0, len = name.length; i < len; i++) {
                this._flags[name[i]] = is_active;
            }
        } else if (name instanceof Object) {
            for (var tmp_name in name) {
                if (name.hasOwnProperty(tmp_name)) {
                    this._flags[tmp_name] = Boolean(name[tmp_name]);
                }
            }
        } else {
            this._flags[name] = is_active;
        }

        return this;
    };

    /**
     * Get flag status is on (true) or off (false)
     * @param {string} name
     * @return {boolean} true -> on, false -> off
     */
    Flag.prototype.flagStatus = function (name) {
        return this._flags && this._flags.hasOwnProperty(name) && Boolean(this._flags[name]);
    };

    /**
     * Check if a flag is exists and it's status is on
     * @param {string} name
     * @return {boolean}
     */
    Flag.prototype.isFlagged = function (name) {
        return true === this.flagStatus(name);
    };

    /**
     *
     * @param {string|Array} flags
     * @param {boolean} [status] Missing - On/off when current flag's status is off/on.
     * Boolean - On/off when status is true/false
     *
     * @return {Flag}
     */
    Flag.prototype.toggleFlag = function (flags, status) {
        if (flags instanceof Array) {
            for (var index in flags) {
                this.toggleFlag(flags[index], status);
            }

            return this;
        }
        if (typeof status != 'undefined') {
            this.flag(flags, Boolean(status));
        } else {
            this.flag(flags, !this.isFlagged(flags));
        }

        return this;
    };

    /**
     *
     * @return {Flag}
     */
    Flag.prototype.resetFlagStatus = function () {
        this._flags = {};

        return this;
    };

    Flag.mixin = function (destObject) {
        var props = ['hasFlag', 'flag', 'flagStatus', 'isFlagged', 'toggleFlag', 'resetFlagStatus'];

        for (var i = 0; i < props.length; i++) {
            if (typeof destObject === 'function') {
                destObject.prototype[props[i]] = Flag.prototype[props[i]];
            } else {
                destObject[props[i]] = Flag.prototype[props[i]];
            }
        }

        return destObject;
    };


    var static_instance = new Flag();

    var methods = ['hasFlag', 'flag', 'flagStatus', 'isFlagged', 'toggleFlag', 'resetFlagStatus'];

    for (var i = 0, len = methods.length; i < len; i++) {
        Flag[methods[i]] = (function (method) {
            return function () {
                return static_instance[method].apply(static_instance, Array.prototype.slice.call(arguments));
            };
        })(methods[i]);
    }


    return Flag;
}));
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['lodash', 'madnh'], function (_, M) {
            return factory(_, M);
        });
    } else {
        // Browser globals
        root.PreOptions = factory(root._, root.M);
    }
}(this, function (_, M) {
    var _pre_options = {};

    /**
     * @constructor
     */
    function PreOptions() {
        //
    }

    /**
     *
     * @param {string} name
     * @param {{}}options
     * @param {boolean} [override=false]
     */
    PreOptions.prototype.define = function (name, options, override) {
        if (override || !_pre_options.hasOwnProperty(name)) {
            _pre_options[name] = {
                options: options,
                base: []
            };

            return true;
        }

        return false;
    };
    /**
     *
     * @param {string} name
     * @returns {boolean}
     */
    PreOptions.prototype.has = function (name) {
        return _pre_options.hasOwnProperty(name);
    };
    /**
     *
     * @param {string} name
     * @param {{}} options
     * @returns {boolean}
     */
    PreOptions.prototype.update = function (name, options) {
        if (_pre_options.hasOwnProperty(name)) {
            _.extend(_pre_options[name].options, options);
            return true;
        }

        return false;
    };

    PreOptions.prototype.updateBase = function (name, new_base) {
        if (_pre_options.hasOwnProperty(name)) {
            _pre_options[name].base = new_base;

            return true;
        }

        return false;
    };

    /**
     *
     * @param {string} name
     * @param {{}} [custom={}]
     * @returns {*}
     */
    PreOptions.prototype.get = function (name, custom) {
        if (!_pre_options.hasOwnProperty(name)) {
            throw new Error('Pre Options "' + name + '" is undefined');
        }

        var self = this,
            result = {};

        _.each(_.castArray(_pre_options[name].base), function (base) {
            _.extend(result, self.get(base));
        });
        _.extend(result, _.cloneDeep(_pre_options[name].options), _.isObject(custom) ? custom : {});

        return result;
    };

    /**
     * Create PreOptions, base on real time value of other PreOptions
     * @param {string|string[]} sources Base on other PreOptions
     * @param {string} dest_name
     * @param {{}} [options={}]
     */
    PreOptions.prototype.extend = function (sources, dest_name, options) {
        _extend(sources, dest_name, options, true);
    };
    /**
     * Create PreOptions, base on runtime-value of other PreOptions
     * @param {string|string[]} sources Base on other PreOptions
     * @param {string} dest_name
     * @param {{}} [options={}]
     */
    PreOptions.prototype.baseOn = function (sources, dest_name, options) {
        _extend(sources, dest_name, options, false);
    };

    /**
     *
     * @param {boolean} [detail=false]
     * @returns {Array|{}}
     */
    PreOptions.prototype.list = function (detail) {
        if (detail) {
            return _.cloneDeep(_pre_options);
        }

        return _.keys(_pre_options);
    };

    PreOptions.prototype.reset = function () {
        _pre_options = {};
    };

    function _extend(sources, dest_name, options, real_time) {
        if (_pre_options.hasOwnProperty(dest_name)) {
            throw new Error('Destination Pre Options is already exists');
        }
        sources = _.castArray(sources);
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
                _.extend(base_options, PreOptions.get(base));
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

    return new PreOptions();
}));
/**
 * Store data by key and data type. Support add, check exists, get and delete
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['lodash', 'madnh'], function (_, M) {
            return (root.ContentManager = factory(_, M));
        });
    } else {
        // Browser globals
        root.ContentManager = factory(root._, root.M);
    }
}(this, function () {

    /**
     * @constructor
     * @property {string} type_prefix
     * @property {string} id
     */
    function ContentManager() {
        this.id = M.nextID('ContentManager');
        this._contents = {};
        this._usings = {};
    }

    M.defineConstant(ContentManager, {
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
            types = _.intersection(_.castArray(types), Object.keys(this._contents));
        }

        _.each(types, function (type) {
            _.each(Object.keys(self._contents[type]), function (key) {
                if (!callback(self._contents[type][key].content, self._contents[type][key].meta, key, type)) {
                    return;
                }

                result.push({
                    type: type,
                    key: key,
                    content: self._contents[type][key].content,
                    meta: self._contents[type][key].meta
                });
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
            types = _.intersection(_.castArray(types), Object.keys(this._contents));
        }

        _.M.loop(types, function (type) {
            _.M.loop(Object.keys(self._contents[type]), function (key) {
                var item = self._contents[type][key];
                if (callback(item.content, item.meta, key, type)) {
                    found = {
                        type: type,
                        key: key,
                        content: item.content,
                        meta: item.meta
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
            type = M.contentType(content);
        }

        var key = M.nextID(this.id + '_' + type);

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
            type = M.contentType(content);
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
                return item;
            };
        } else {
            callback = function (item) {
                return item.content;
            }
        }
        if (!_.isEmpty(keys)) {
            var type_grouped = _.groupBy(_.castArray(keys), _.partial(getContentTypeFromKey, this));

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
            return !_.isEmpty(_.intersection(_.map(positions, 'key'), Object.keys(this._usings)));
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
            return this._contents[type][key];
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
            return this._contents[type];
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

            return result.content;
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

            return result.meta;
        }

        return default_value;
    };

    /**
     * Remove content by key. Return removed keys
     * @param {string|string[]} keys
     * @returns {Array} Array of objects, each object has 2 item:
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
     * @returns {Array} Removed position
     */
    ContentManager.prototype.removeNotUsing = function () {
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


    return ContentManager;
}));
/**
 * Manage contents with priority
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], function () {
            return (root.Priority = factory());
        });
    } else {
        // Browser globals
        root.Priority = factory();
    }
}(this, function () {
    var key,
        key_index = 0,
        constants = {
            PRIORITY_HIGHEST: 100,
            PRIORITY_HIGH: 250,
            PRIORITY_DEFAULT: 500,
            PRIORITY_LOW: 750,
            PRIORITY_LOWEST: 1000,
            PRIORITY_LEVEL_1: 100,
            PRIORITY_LEVEL_2: 200,
            PRIORITY_LEVEL_3: 300,
            PRIORITY_LEVEL_4: 400,
            PRIORITY_LEVEL_5: 500,
            PRIORITY_LEVEL_6: 600,
            PRIORITY_LEVEL_7: 700,
            PRIORITY_LEVEL_8: 800,
            PRIORITY_LEVEL_9: 900,
            PRIORITY_LEVEL_10: 1000
        };

    function Priority() {
        this._priorities = {};
        this._key_mapped = {};
    }

    /**
     * Define Priority constant
     */
    for (key in constants) {
        Object.defineProperty(Priority, key, {
            enumerable: true,
            value: constants[key]
        });
    }

    /**
     *
     * @param {number} priority
     * @return {boolean}
     */
    Priority.prototype.hasPriority = function (priority) {
        return this._priorities.hasOwnProperty(priority + '');
    };

    /**
     * Check if a key is exists
     * @param {string} key
     * @return {boolean}
     */
    Priority.prototype.has = function (key) {
        return this._key_mapped.hasOwnProperty(key);
    };

    /**
     * @param {*} content
     * @param {number} priority
     * @return {string} Added key
     */
    Priority.prototype.add = function (content, priority) {
        var key = 'priority_key_' + ++key_index,
            index;

        if (typeof priority !== 'number' || priority !== priority) {
            priority = Priority.PRIORITY_DEFAULT;
        }
        if (!this.hasPriority(priority)) {
            this._priorities[priority] = [];
        }

        index = this._priorities[priority].length;
        this._priorities[priority].push({
            content: content,
            priority_key: key
        });
        this._key_mapped[key] = {
            priority: priority,
            index: index
        };

        return key;
    };

    /**
     * Find keys of content
     * @param {Priority} instance
     * @param {function} callback
     * @param {boolean} [all = false]
     * @return {string|Array|boolean} Priority key(s) or false when not found
     */
    function do_find(instance, callback, all) {
        var result = [],
            priorities = Object.keys(instance._priorities),
            priority, index, len, target_priority;

        while (priority = priorities.shift()) {
            target_priority = instance._priorities[priority];

            for (index = 0, len = target_priority.length; index < len; index++) {
                if (callback(target_priority[index].content)) {
                    if (!all) {
                        return target_priority[index].priority_key;
                    }

                    result.push(target_priority[index].priority_key);
                }
            }
        }

        return result.length ? result : false;
    }

    function find_cb_content(find, compare_content) {
        return find === compare_content;
    }

    /**
     * Find all of keys by content
     * @param {*} content
     * @return {string|Array|boolean} Priority key(s) or false if not found
     */
    Priority.prototype.findAll = function (content) {
        return do_find(this, _.partial(find_cb_content, content), true);
    };
    Priority.prototype.findAllBy = function (callback) {
        return do_find(this, callback, true);
    };

    /**
     * Find first key of content
     * @param {*} content
     * @return {string|Array|boolean} Priority key or false if not found
     */
    Priority.prototype.find = function (content) {
        return do_find(this, _.partial(find_cb_content, content), false);
    };

    Priority.prototype.findBy = function (callback) {
        return do_find(this, callback, false);
    };

    /**
     * Add a content if it is not added yet
     * @param {*} content
     * @param {number} priority
     * @return {string} Added key
     */
    Priority.prototype.addOnce = function (content, priority) {
        var key = this.find(content);

        if (false !== key) {
            return key;
        }

        return this.add(content, priority);
    };

    Priority.prototype.get = function (key) {
        if (!this.has(key)) {
            return false;
        }

        var position = this._key_mapped[key];

        return this._priorities[position.priority][position.index];
    };

    /**
     * Update added content
     * @param {string} key
     * @param {*} new_value
     * @return {boolean}
     */
    Priority.prototype.update = function (key, new_value) {
        var position;

        if (!this.has(key)) {
            return false;
        }

        position = this._key_mapped[key];
        this._priorities[position.priority][position.index] = new_value;

        return true;
    };

    /**
     *
     * @param {string|string[]} keys
     * @return {string[]} Removed keys
     */
    Priority.prototype.remove = function (keys) {
        var removed = [],
            index,
            key,
            position;

        keys = asArray(keys);
        for (index in keys) {
            if (keys.hasOwnProperty(index)) {
                key = keys[index];
                position = this._key_mapped[key];

                if (!position) {
                    continue;
                }

                delete this._key_mapped[key];
                this._priorities[position.priority][position.index] = undefined;
                removed.push(key);
            }
        }

        return removed;
    };

    Priority.prototype.removeByContent = function (content) {
        var keys = this.findAll(content);

        if (false === keys) {
            return [];
        }

        return this.remove(keys);
    };

    /**
     * Get sorted contents
     * @param {boolean} [with_key = false] Include priority key
     * @return {Array}
     */
    Priority.prototype.export = function (with_key) {
        var result = [],
            priority_keys = Object.keys(this._priorities),
            priority,
            index;

        priority_keys.sort(function (a, b) {
            return a - b;
        });

        while (priority = priority_keys.shift()) {
            for (index in this._priorities[priority]) {
                if (this._priorities[priority].hasOwnProperty(index)) {
                    if (with_key) {
                        result.push(this._priorities[priority][index].content);
                    } else {
                        result.push({
                            content: this._priorities[priority][index].content,
                            priority_key: this._priorities[priority][index].priority_key
                        });
                    }
                }
            }
        }

        return result;
    };

    var objToString = Object.prototype.toString;

    function isArray(val) {
        return objToString.call(val) === '[object Array]';
    }

    function asArray(val) {
        return isArray(val) ? val : [val];
    }

    return new Priority();
}));
/**
 * Callback listener system
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], function () {
            return (root.Waiter = factory());
        });
    } else {
        // Browser globals
        root.Waiter = factory();
    }
}(this, function () {
    var _waiters = {},
        key_index = 0,
        slice = Array.prototype.slice;

    function Waiter() {
        //
    }

    /**
     * Check if a waiter key is exists
     * @param {string} waiter_key
     */
    Waiter.prototype.has = function (waiter_key) {
        return _waiters.hasOwnProperty(waiter_key) && (typeof _waiters[waiter_key].times !== 'number' || _waiters[waiter_key].times > 0);
    };
    /**
     * Add callback
     * @param {(string|function)} callback Callback
     * @param {int|boolean} [times = true] Run times. Use true for forever
     * @param {string} [description = ''] Waiter description
     * @returns string Callback key
     */
    Waiter.prototype.add = function (callback, times, description) {
        var key = 'waiter_key_' + ++key_index;

        if (typeof times == 'number') {
            times = parseInt(times);
            times = times !== times ? 1 : Math.max(times, 1);
        } else {
            times = true;
        }

        _waiters[key] = {
            callback: callback,
            times: times,
            description: description
        };

        return key;
    };
    /**
     * Add once time callback
     * @param {(string|function)} callback Callback
     * @param {string} [description = ''] Waiter description
     * @returns string Callback key
     */
    Waiter.prototype.addOnce = function (callback, description) {
        return this.add(callback, 1, description);
    };

    /**
     * Similar to "add" but add waiter key to window as function
     * @param {(string|function)} callback Callback
     * @param {int|boolean} [times = true] Run times. Use true for forever
     * @param {string} [description] Waiter description
     * @returns {(string|number)} Waiter key/function name
     */
    Waiter.prototype.createFunc = function (callback, times, description) {
        var key = this.add(callback, times, description);
        var self = this;

        window[key] = (function (key) {
            return function () {
                return self.run.apply(self, [key].concat(slice.call(arguments)));
            };
        })(key);

        return key;
    };


    /**
     * Similar of method createFunc, once time
     * @param {(string|function)} callback Callback
     * @param {string} [description] Waiter description
     * @returns {(string|number)} Waiter key/function name
     */
    Waiter.prototype.createFuncOnce = function (callback, description) {
        return this.createFunc(callback, 1, description);
    };


    /**
     * Remove keys by arguments
     * @returns {Array} Removed waiters
     */
    Waiter.prototype.remove = function () {
        var key,
            index,
            keys = flatten(slice.call(arguments)),
            removed = [];

        for (index in keys) {
            if (keys.hasOwnProperty(index) && _waiters.hasOwnProperty(keys[index])) {
                key = keys[index];
                removed.push(key);
                window[key] = undefined;
                delete _waiters[key];
                delete window[key];
            }
        }

        return removed;
    };

    /**
     * Run the waiter
     * @param {string} waiter_key
     * @param {Array} args
     * @param {Object} this_arg
     * @returns {*}
     */
    Waiter.prototype.run = function (waiter_key, args, this_arg) {
        var result;

        if (!this.has(waiter_key)) {
            throw new Error('Waiter key is non-exists: ' + waiter_key);
        }

        result = _waiters[waiter_key].callback.apply(this_arg || null, asArray(args));

        if (this.has(waiter_key) && (typeof _waiters[waiter_key].times == 'number') && --_waiters[waiter_key].times < 1) {
            this.remove(waiter_key);
        }

        return result;
    };

    /**
     * Return list of waiters
     * @param {boolean} [description = false] Include waiter description, default is false
     * @returns {(Array|{})}
     */
    Waiter.prototype.list = function (description) {
        var result = {};

        if (description) {
            for (var key in _waiters) {
                if (_waiters.hasOwnProperty(key)) {
                    result[key] = _waiters[key].description;
                }
            }

            return result;
        }

        return Object.keys(_waiters);
    };

    var objToString = Object.prototype.toString;

    function isArray(val) {
        return objToString.call(val) === '[object Array]';
    }

    function asArray(val) {
        return isArray(val) ? val : [val];
    }

    function flatten(array) {
        var result = [];

        if (!array.length) {
            return [];
        }

        for (var i in array) {
            if (array.hasOwnProperty(i)) {
                if (isArray(array[i])) {
                    result = result.concat(flatten(array[i]));
                } else {
                    result.push(array[i]);
                }
            }
        }

        return result;
    }

    return new Waiter();
}));
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['lodash', 'Priority'], function (_, Priority) {
            return (root.EventEmitter = factory(_, Priority));
        });
    } else {
        // Browser globals
        root.EventEmitter = factory(root._, root.Priority);
    }
}(this, function (_, Priority) {
    function EventEmitter(options) {
        this.id = _.uniqueId('event_emitter_');

        options = _.defaults(options || {}, {
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

        if (!_.isObject(options['events'])) {
            this.addListeners(options['events']);
        }
        if (!_.isEmpty(options['event_mimics'])) {
            this.mimic(_.castArray(options['event_mimics']));
        }
        if (!_.isEmpty(options['event_privates'])) {
            this.private(_.castArray(options['event_privates']));
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
            return this._event_emitted.hasOwnProperty(event) ? this._event_emitted[event] : 0;
        }

        return _.clone(this._event_emitted);
    };

    /**
     * Add event listener
     * @param {string|string[]} events Array of events name
     * @param {(string|function|Array)} listeners Event listener
     * @param {object} [option] Option is object with keys:
     * priority {@see _.M.PRIORITY_DEFAULT},
     * times (-1 - forever) - call times,
     * context (this event emitter instance) - context for callback,
     * key (auto increment of key: event_emitter_key_) - listener key. Useful when remove listener
     * @returns {string|boolean|null} Listener key or false on fail
     */
    EventEmitter.prototype.addListener = function (events, listeners, option) {
        var self = this;

        listeners = _.castArray(listeners);
        events = _.uniq(_.castArray(events));

        if (!listeners.length) {
            return false;
        }

        add_listener__prepare_events(this, events);
        option = add_listener__get_option(option);

        _.each(events, function (event) {
            var event_detail = self._events[event];
            var keys = add_listener__add_listeners(self, event, listeners, option);

            if (!event_detail.key_mapped.hasOwnProperty(option.key)) {
                event_detail.key_mapped[option.key] = keys;
            } else {
                event_detail.key_mapped[option.key] = _.concat(event_detail.key_mapped[option.key], keys);
            }
        });

        return option.key;
    };

    function add_listener__prepare_events(ee, events) {
        _.each(events, function (event) {
            if (!ee._events.hasOwnProperty(event)) {
                ee._events[event] = {
                    priority: new Priority(),
                    key_mapped: {}
                };
            }
        });
    }

    /**
     *
     * @param option
     * @returns {{priority, times, context, key, async}}
     */
    function add_listener__get_option(option) {
        if (_.isNumber(option)) {
            option = {
                priority: option
            }
        }

        option = _.defaults(option || {}, {
            priority: Priority.PRIORITY_DEFAULT,
            times: true,
            context: null,
            key: '',
            async: false
        });

        if (option.key === null) {
            option.key = _.uniqueId('event_emitter_listener_');
        }

        return option;
    }

    /**
     *
     * @param {EventEmitter} ee
     * @param {string} event
     * @param {callback|callback[]} listeners
     * @param {{}} option
     * @return {string[]}
     */
    function add_listener__add_listeners(ee, event, listeners, option) {
        var keys = [],
            event_detail = ee._events[event];

        _.each(_.castArray(listeners), function (listener) {
            var key = event_detail.priority.add({
                listener: listener,
                listener_key: option.key,
                async: option.async,
                times: option.times,
                event: event
            }, option.priority);

            keys.push(key);
        });

        return keys;
    }

    /**
     * Check if a key is exists
     * @param {string} key
     * @param {string|string[]} [events]
     * @return {boolean}
     */
    EventEmitter.prototype.has = function (key, events) {
        events = _get_valid_events(this, events);

        if (_.isEmpty(events)) {
            return false;
        }

        var index, found = false, self = this;

        for (index in events) {
            if (events.hasOwnProperty(index) && self._events[events[index]].key_mapped.hasOwnProperty(key)) {
                found = true;
                break;
            }
        }

        return found;
    };
    /**
     *
     * @param instance
     * @param {Array} [events]
     * @return {Array}
     * @private
     */
    function _get_valid_events(instance, events) {
        if (!events) {
            return _.keys(instance._events);
        }

        return _.intersection(_.castArray(events), _.keys(instance._events));
    }


    /**
     * @see addListener
     */
    EventEmitter.prototype.on = function (event, listener, option) {
        return this.addListener.apply(this, _.toArray(arguments));
    };
    /**
     * Add once time listener
     * @param events
     * @param listeners
     * @param option
     * @returns {string}
     */
    EventEmitter.prototype.addOnceListener = function (events, listeners, option) {
        if (_.isNumber(option)) {
            option = {
                priority: option,
                times: 1
            }
        } else if (!_.isObject(option)) {
            option = {
                times: 1
            };
        }


        return this.addListener(events, listeners, option);
    };

    /**
     * @see addOnceListener
     */
    EventEmitter.prototype.once = function (events, listener, option) {
        return this.addOnceListener.apply(this, _.toArray(arguments));
    };

    /**
     * Add listeners by object
     * @param {{}} events Object of events: object key is name of event, object value is array of events
     * @return {string[]} Listener keys
     */
    EventEmitter.prototype.addListeners = function (events) {
        var events_arr = [], self = this, keys = [];

        if (_.isObject(events)) {
            _.each(events, function (event_cbs, event_name) {
                event_cbs = _.castArray(event_cbs);

                _.each(event_cbs, function (event_cb) {
                    event_cb = _.castArray(event_cb);
                    events_arr.push({
                        name: event_name,
                        cb: event_cb[0],
                        options: event_cb.length > 1 ? event_cb[1] : {}
                    });
                });
            });
        }

        _.each(events_arr, function (event_info) {
            keys.push(self.addListener(event_info['name'], event_info['cb'], event_info['options']));
        });

        return keys;
    };


    /**
     * Emit event. Each event emitted will emit a event called 'event_emitted', with event emitted and it's data
     * @param {string|string[]} events Array of events
     * @param {*} [data]
     * @param {Function} [final_cb]
     */
    EventEmitter.prototype.emitEvent = function (events, data, final_cb) {
        var self = this;

        _.each(_.castArray(events), function (event) {
            if (self._events.hasOwnProperty(event)) {
                _emit_event(self, event, _.clone(data));
            }
            if (event !== 'event_emitted') {
                _emit_event(self, 'event_emitted', [event, _.clone(data)]);
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
            listeners = instance._events[event_name].priority.export(true);

            if (listeners.length) {
                emitted = true;
                _.each(listeners, function (listener_detail) {
                    if (listener_detail.times === true || listener_detail.times > 0) {
                        (listener_detail.async ? async_callback : do_callback)(listener_detail.listener, data, listener_detail.context || instance);

                        if (listener_detail.times === true) {
                            return;
                        }

                        listener_detail.times--;

                        if (listener_detail.times > 0) {
                            instance._events[event_name].priority.update(listener_detail.priority_key, listener_detail);

                            return;
                        }
                    }

                    _remove_listener(instance, event_name, listener_detail.listener_key, listener_detail.priority_key);
                });
            }
        }
        if (!instance._event_emitted.hasOwnProperty(event_name)) {
            instance._event_emitted[event_name] = 1;
        } else {
            instance._event_emitted[event_name] += 1;
        }

        return emitted;
    }

    function _remove_listener(instance, event, listener_key, priority_key) {
        if (!instance._events.hasOwnProperty(event) || !instance._events[event].key_mapped.hasOwnProperty(listener_key)) {
            return;
        }

        instance._events[event].priority.remove(priority_key);
        instance._events[event].key_mapped[listener_key] = _.without(instance._events[event].key_mapped[listener_key], priority_key);

        if (!instance._events[event].key_mapped[listener_key].length) {
            delete instance._events[event].key_mapped[listener_key];
        }
    }

    function _is_need_to_notice(instance, event_name) {
        return 'event_emitted' !== event_name
            && -1 == instance._event_privates.indexOf(event_name)
            && !_.isEmpty(instance._event_followers);
    }

    function _notice_event(instance, event_name, data) {
        _.each(instance._event_followers, function (follower) {
            (follower.async ? async_callback : do_callback)(_.partial(_notice_event_cb, follower), [instance.id, event_name, data], instance);
        });
    }

    function _notice_event_cb(follower, source_id, source_event, source_data) {
        follower.target.notice(source_id, source_event, source_data);
    }

    function do_callback(callback, args, context) {
        if (arguments.length >= 2) {
            args = _.castArray(args);
        } else {
            args = [];
        }

        if (callback) {
            if (_.isArray(callback)) {
                var result = [];

                _.each(callback, function (callback_item) {
                    result.push(callback_item.apply(context || null, args));
                });

                return result;
            } else if (_.isFunction(callback)) {
                return callback.apply(context || null, args);
            }
        }

        return undefined;
    }

    function async_callback(callback, args, delay, context) {
        delay = parseInt(delay);
        if (_.isNaN(delay) || !_.isFinite(delay)) {
            delay = 1;
        }

        return setTimeout(function () {
            do_callback(callback, args, context || null);
        }, Math.max(1, delay));
    }

    /**
     * Alias of 'emitEvent'
     * @see emitEvent
     */
    EventEmitter.prototype.emit = function () {
        this.emitEvent.apply(this, _.toArray(arguments));
    };

    /**
     * Remove listener by key
     * @param {string|Function|Array} removes Listener / listener key or array of them
     * @param {string[]} [events]
     * @param {number} [priority]
     */
    EventEmitter.prototype.removeListener = function (removes, events, priority) {
        var self = this, removed = {}, removes_by_keys, remove_by_listeners;

        removes = _.castArray(removes);
        events = _get_valid_events(self, events);

        removes_by_keys = _.filter(removes, _.isString);
        remove_by_listeners = _.filter(removes, _.isFunction);

        if (removes_by_keys.length) {
            removed = _remove_listener_by_keys(self, removes_by_keys, events, priority);
        }
        if (remove_by_listeners.length) {
            _merge_object_item(removed, _remove_listener_by_listeners(self, remove_by_listeners, events, priority));
        }

        _.each(events, function (event) {
            if (_.isEmpty(self._events[event].key_mapped)) {
                delete self._events[event];
            }
        });

        return removed;
    };


    /**
     *
     * @param instance
     * @param keys
     * @param {Array} events Valid events
     * @return {{}}
     * @private
     */
    function _group_keys_by_event(instance, keys, events) {
        var grouped = {},
            event,
            found,
            events_cloned = _.clone(events);

        while (keys.length && (event = events_cloned.shift())) {
            found = _.intersection(keys, _.keys(instance._events[event].key_mapped));

            if (found.length) {
                grouped[event] = found;
                keys = _.difference(keys, found);
            }
        }

        return grouped;
    }

    function _remove_listener_by_keys(instance, keys, events) {
        var keys_grouped_by_event = _group_keys_by_event(instance, keys, events),
            event_detail;

        _.each(keys_grouped_by_event, function (keys, event) {
            event_detail = instance._events[event];
            event_detail.priority.remove(_.flatten(_.values(_.pick(event_detail.key_mapped, keys))));

            event_detail.key_mapped = _.omit(event_detail.key_mapped, keys);
            instance._events[event] = event_detail;
        });

        return keys_grouped_by_event;
    }

    function _find_keys_by_listener(listener, compare_content) {
        return listener === compare_content.listener;
    }

    function _remove_listener_by_listeners(instance, listeners, events) {
        var removed = {},
            priority_keys_removed;

        _.each(listeners, function (listener) {
            var callback = _.partial(_find_keys_by_listener, listener);

            _.each(events, function (event) {
                var keys = instance._events[event].priority.findAllBy(callback);

                if (false == keys) {
                    return;
                }

                priority_keys_removed = instance._events[event].priority.remove(keys);

                if (priority_keys_removed.length) {
                    var removed_grouped_by_listener_key = _remove_key_mapped_by_priority_keys(instance._events[event].key_mapped, priority_keys_removed);
                    var tmp_obj = {};

                    tmp_obj[event] = Object.keys(removed_grouped_by_listener_key);
                    _merge_object_item(removed, tmp_obj);
                }
            });
        });

        return removed;
    }


    /**
     *
     * @param key_mapped
     * @param priority_keys
     * @return {{}} Object, Event key => priority keys
     * @private
     */
    function _remove_key_mapped_by_priority_keys(key_mapped, priority_keys) {
        var found, keys = Object.keys(key_mapped), key, removed = {};

        while (priority_keys.length && (key = keys.shift())) {
            found = _.intersection(priority_keys, key_mapped[key]);

            if (found.length) {
                key_mapped[key] = _.difference(key_mapped[key], found);

                if (!key_mapped[key].length) {
                    delete key_mapped[key];
                }

                priority_keys = _.difference(priority_keys, found);
                removed[key] = found;
            }
        }

        return removed;
    }

    /**
     * Merge each item of an object with item of other object
     * @param {{}} target
     * @param {{}} object
     */
    function _merge_object_item(target, object) {
        _.each(object, function (value, key) {
            value = _.castArray(value);

            if (!target.hasOwnProperty(key)) {
                target[key] = value;
            } else {
                target[key] = _.concat(target[key], value);
            }
        });
    }

    /**
     * Alias of `removeListener`
     * @see removeListener
     */
    EventEmitter.prototype.off = function () {
        return this.removeListener.apply(this, _.toArray(arguments));
    };

    /**
     * Set events is private
     */
    EventEmitter.prototype.private = function () {
        this._event_mimics = _.concat(this._event_privates, _.flatten(_.toArray(arguments)));
    };

    /**
     * Set events is mimic
     */
    EventEmitter.prototype.mimic = function () {
        this._event_mimics = _.concat(this._event_mimics, _.flatten(_.toArray(arguments)));
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
        if (!EventEmitter.isEventEmitter(eventEmitter)) {
            throw new Error('Invalid EventEmitter instance');
        }
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
    };

    /**
     * Check if has an EE instance is attached to this
     * @param {EventEmitter} eventEmitter
     * @return {boolean}
     */
    EventEmitter.prototype.hasFollower = function (eventEmitter) {
        return EventEmitter.isEventEmitter(eventEmitter) && this._event_followers.hasOwnProperty(eventEmitter.id);
    };

    /**
     * Attach other event emitter to this. Notice sync
     * @param {EventEmitter} eventEmitter
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
        if (!EventEmitter.isEventEmitter(eventEmitter)) {
            throw new Error('Invalid EventEmitter instance');
        }
        if (!this._event_following.hasOwnProperty(eventEmitter.id)) {
            this._event_following[eventEmitter.id] = {
                id: eventEmitter.id,
                type: eventEmitter.constructor.name,
                only: _.castArray(only || []),
                excepts: _.castArray(excepts || [])
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
     * Check if this one is following another EE instance
     * @param {EventEmitter} eventEmitter
     * @return {boolean}
     */
    EventEmitter.prototype.isFollowing = function (eventEmitter) {
        return EventEmitter.isEventEmitter(eventEmitter) && this._event_following.hasOwnProperty(eventEmitter.id);
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
     * Notice following event emitter emitted. If noticed event is a mimic event then do not emit any notice events.
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
            var following_info = this._event_following[sourceID],
                self = this;

            if ((_.isEmpty(following_info.only) || -1 !== following_info.only.indexOf(eventName))
                && (_.isEmpty(following_info.excepts) || -1 === following_info.excepts.indexOf(eventName))) {

                var mimic_events = [
                    eventName,
                    following_info.type + '.*',
                    following_info.type + '.' + eventName
                ];

                if (!_.isEmpty(_.intersection(mimic_events, self._event_mimics))) {
                    self.emitEvent(eventName, data);

                    return;
                }

                var notice_data = {
                        id: following_info.id,
                        type: following_info.type,
                        event: eventName,
                        data: data
                    },
                    notice_events = [
                        following_info.id + '.' + eventName,
                        following_info.type + '.' + eventName,
                        'noticed.' + following_info.id + '.' + eventName,
                        'noticed.' + following_info.id,
                        'noticed.' + following_info.type + '.' + eventName,
                        'noticed.' + following_info.type,
                        'noticed'
                    ];

                this.emitEvent(notice_events, notice_data);
            }
        }
    };

    /**
     * Detach a followed event emitter
     * @param {EventEmitter} eventEmitter
     * @returns {boolean}
     */
    EventEmitter.prototype.detach = function (eventEmitter) {
        if (!EventEmitter.isEventEmitter(eventEmitter)) {
            throw new Error('Invalid EventEmitter instance');
        }
        if (this._event_followers.hasOwnProperty(eventEmitter.id)) {
            this.emitEvent('detach', [eventEmitter]);
            delete this._event_followers[eventEmitter.id];
            eventEmitter.detachFrom(this);

            return true;
        }

        return false;

    };

    /**
     * Detach a following event emitter
     * @param {EventEmitter} eventEmitter
     * @returns {boolean}
     */
    EventEmitter.prototype.detachFrom = function (eventEmitter) {
        if (!EventEmitter.isEventEmitter(eventEmitter)) {
            throw new Error('Invalid EventEmitter instance');
        }
        if (this._event_following.hasOwnProperty(eventEmitter.id)) {
            this.emitEvent('detached', [eventEmitter]);
            delete this._event_following[eventEmitter.id];
            eventEmitter.detach(this);

            return true;
        }
        return false;
    };

    EventEmitter.isEventEmitter = function (object) {
        return object instanceof EventEmitter;
    };

    return EventEmitter;
}));
/**
 * Cache management system
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['lodash'], function (_) {
            return (root.Cache = factory(_));
        });
    } else {
        // Browser globals
        root.Cache = factory(root._);
    }
}(this, function (_) {
    var _cache_data = {},
        _clean_interval_time,
        _clean_interval,
        constants;

    /**
     * @constructor
     */
    function Cache() {
        //Clean cache every 10 seconds
        if (_clean_interval) {
            clearInterval(_clean_interval);
        }
        _clean_interval = setInterval(_clean_cache, _clean_interval_time * 1000);
    }

    /**
     * Define constants
     * @type {{CACHE_MIN: number, CACHE_TINY: number, CACHE_SHORT: number, CACHE_MEDIUM: number, CACHE_LONG: number, CACHE_FOREVER: boolean}}
     */
    constants = {
        /**
         * 10 seconds
         * @constant {number}
         * @default
         */
        CACHE_MIN: 10,
        /**
         * 1 minute
         * @constant {number}
         * @default
         */
        CACHE_TINY: 60,
        /**
         * 5 minutes
         * @constant {number}
         * @default
         */
        CACHE_SHORT: 300,
        /**
         * 10 minutes
         * @constant {number}
         * @default
         */
        CACHE_MEDIUM: 600,
        /**
         * 1 hour
         * @constant {number}
         * @default
         */
        CACHE_LONG: 3600,
        /**
         * Forever
         * @constant {number}
         * @default
         */
        CACHE_FOREVER: true
    };
    for (var key in constants) {
        if (constants.hasOwnProperty(key)) {
            Object.defineProperty(Cache, key, {
                enumerable: true,
                value: constants[key]
            });
        }
    }

    _clean_interval_time = Cache.CACHE_MIN;

    /**
     * Check if a cache name is exists
     * @param {string} name
     * @returns {boolean}
     * @private
     */
    function _has_cache(name) {
        if (_.has(_cache_data, name)) {
            //-1 to ensure this cache is valid when get right after check
            if (_cache_data[name].expire_time === true || (_cache_data[name].expire_time - 1) > parseInt(Math.floor(_.now() / 1000))) {
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
        if (_.isUndefined(live_time) || !_.isNumber(Number(live_time)) || !_.isFinite(Number(live_time))) {
            live_time = Cache.CACHE_MEDIUM;
        }
        _cache_data[name] = {
            value: value,
            live_time: live_time,
            expire_time: live_time === true ? true : parseInt(Math.floor(_.now() / 1000)) + live_time
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
        var live_time = Cache.CACHE_MEDIUM;
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
            if (addMode) {
                new_value.push(value);
            } else {
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
        if (_.isUndefined(value) || !_.isNumber(Number(value)) || !_.isFinite(Number(value))) {
            value = 1;
        }
        if (_.isUndefined(addMode)) {
            addMode = true;
        }
        if (addMode) {
            value = Math.abs(value);
        } else {
            value = -1 * Math.abs(value);
        }

        if (!_has_cache(name)) {
            _set_cache(name, value);
        } else {
            _cache_data[name].value = Number(_cache_data[name].value);

            if (!_.isNumber(_cache_data[name].value) || !_.isFinite(_cache_data[name].value)) {
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
        var now_second = parseInt(Math.floor(_.now() / 1000));
        _.each(_cache_data, function (data, name) {
            if (data.expire_time !== true && data.expire_time <= now_second) {
                removes.push(name);
            }
        });
        _expire_cache(removes);
    }

    Cache.prototype.set = function (name, value, live_time) {
        _set_cache(name, value, live_time);
    };
    /**
     * Check if a cached name is exists
     * @param {string} name
     * @returns {boolean}
     */
    Cache.prototype.has = function (name) {
        return _has_cache(name);
    };

    /**
     * Get cached value
     * @param {string} name
     * @param {*} default_value
     * @returns {*}
     */
    Cache.prototype.get = function (name, default_value) {
        if (_.has(_cache_data, name)) {
            if (_cache_data[name].expire_time === true || _cache_data[name].expire_time > parseInt(Math.floor(_.now() / 1000))) {
                return _cache_data[name].value;
            }
            delete _cache_data[name];
        }

        return default_value;
    };

    /**
     * Add live time
     * @param {string} name
     * @param {number} [live_time] Default is cached live time
     * @return {boolean|number} False - cache is not exists. True - cache is forever. Number - next expire time
     */
    Cache.prototype.touch = function (name, live_time) {
        if (this.has(name)) {
            if (_cache_data[name].expire_time !== true) {
                var cache = _cache_data[name];

                if (!_.isNumber(live_time) || !_.isFinite(live_time)) {
                    live_time = cache.live_time;
                }

                cache.expire_time = Math.max(cache.expire_time, parseInt(Math.floor(_.now() / 1000)) + live_time);

                return cache.expire_time;
            }

            return true;
        }

        return false;
    };

    /**
     * Get valid caches
     * @param {boolean} [name_only = true] Only return cache name
     * @returns {*}
     */
    Cache.prototype.list = function (name_only) {

        /**
         * @type {({}|Array)}
         */
        var result;
        var now_second = parseInt(Math.floor(_.now() / 1000));

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
    };

    /**
     * Clean expired caches
     */
    Cache.prototype.clean = function () {
        return _clean_cache();
    };

    /**
     * Manual delete expired caches
     */
    Cache.prototype.expire = function () {
        _expire_cache(Array.prototype.slice.apply(arguments));
    };

    /**
     * Increment value of a cache, if cache is not exists then create with value and live time as default
     * (CACHE_MEDIUM), if exists then increment it and set live time as old. If old value isn't a valid numeric
     * then set it to 0
     *
     * @param {string} name
     * @param {number} [value = 1] Increment value
     * @returns {number}
     */
    Cache.prototype.increment = function (name, value) {
        if (!_.isNumber(value) || !_.isFinite(value)) {
            value = 1;
        }
        return _cache_number_change(name, value, true);
    };

    /**
     * Decrement value of a cache, if cache is not exists then create with value and live time as default
     * (CACHE_MEDIUM), if exists then decrement it and set live time as old. If old value isn't a valid numeric
     * then set it to 0
     *
     * @param {string} name
     * @param {number} [value = 1] Decrement value
     * @returns {number}
     */
    Cache.prototype.decrement = function (name, value) {
        if (!_.isNumber(value) || !_.isFinite(value)) {
            value = 1;
        }
        return _cache_number_change(name, value, false);
    };

    /**
     * Add item to array
     * @param {string} name
     * @param {*} value
     * @returns {*}
     */
    Cache.prototype.arrayPush = function (name, value) {
        return _cache_collection_change(name, value, true);
    };

    /**
     * Remove item from array
     * @param {string} name
     * @param {*} value
     * @returns {*}
     */
    Cache.prototype.arrayWithout = function (name, value) {
        return _cache_collection_change(name, value, false);
    };


    return new Cache();
}));
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['lodash', 'madnh'], function (_, M) {
            return (root.Task = factory(_, M));
        });
    } else {
        // Browser globals
        root.Task = factory(root._, root.M);
    }
}(this, function () {
    var tasks = {};

    /**
     *
     * @param {string|function|function[]|{}} [handler]
     * @constructor
     */
    function Task(handler) {
        this.id = M.nextID('Task');

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
        this.options = M.setup.apply(M, [this.options].concat(_.toArray(arguments)));

        return this;
    };

    /**
     * Check if process is error
     * @returns {boolean}
     */
    Task.prototype.isError = function () {
        return !_.isNull(this._error);
    };

    /**
     * @return {null|{}} void when process is ok. Object with error code and message
     */
    Task.prototype.getError = function () {
        if (this.isError()) {
            return _.pick(_.extend({
                code: 0,
                message: ''
            }, _.isObject(this._error) ? this._error : {}), 'code', 'message');
        }

        return null;
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
     * Process data
     * @param {*} data
     * @returns {boolean} Success (true) or not (false)?
     */
    Task.prototype.process = function (data) {
        var self = this;

        this._result = _.cloneDeep(data);
        this._error = null;

        if (_.isString(this.handler)) {
            this.handler = _.castArray(this.handler);
        }
        if (_.isFunction(this.handler)) {
            _process_handler_as_function(this, this.handler, data);
        } else if (this.handler instanceof Task) {
            _process_handler_as_task(this, this.handler, self._result);
        } else if (_.isArray(this.handler)) {
            M.loop(this.handler, function (handle) {
                var task_instance;

                if (_.isString(handle)) {
                    task_instance = Task.factory(handle);
                } else {
                    task_instance = new Task(handle);
                }

                _process_handler_as_task(self, task_instance, self._result);

                if (self.isError()) {
                    return 'break';
                }
            });
        } else if (_.isObject(this.handler)) {
            M.loop(this.handler, function (options, handle) {
                var task_instance = Task.factory(handle);

                if (!_.isEmpty(options)) {
                    task_instance.options(options);
                }

                _process_handler_as_task(self, task_instance, self._result);

                if (self.isError()) {
                    return 'break';
                }
            });
        }

        return !this.isError();
    };

    function _process_handler_as_function(instance, handler, data) {
        try {
            handler.bind(instance)(data, instance.setProcessResult.bind(instance), instance.setProcessError.bind(instance));
        } catch (e) {
            instance.setProcessError(e.message || e.description, e.number || 0);
        }
    }

    function _process_handler_as_task(instance, task, data) {
        task.process(data);

        instance._result = task.getResult();
        instance._error = task.getError();
    }


    /**
     * Check if task is exists
     * @param {string} name
     * @returns {boolean}
     */
    Task.isRegistered = function (name) {
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
        var info = M.optionalArgs(_.toArray(arguments), ['name', 'handler', 'options'], {
            name: 'string',
            handler: ['string', 'Function', 'Array', 'Task'],
            options: 'Object'
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
        if (Task.isRegistered(name)) {
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

        throw new Error('Create an unregistered task: ' + name);
    };

    Task.apply = function (data, tasks) {
        var result = {
            data: _.cloneDeep(data)
        };

        if (tasks) {
            if (_.isString(tasks)) {
                tasks = [tasks];
            }
            if (_.isArray(tasks)) {
                tasks = _.zipObject(tasks, _.fill(new Array(tasks.length), {}));
            }

            M.loop(tasks, function (options, name) {
                var task = Task.factory(name, options);

                if (task.process(_.cloneDeep(result['data']))) {
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

    return Task;
}));