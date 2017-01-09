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
     *  M.EventEmitter.call(this);
     * }
     *
     * M.inherit(MyEE, M.EventEmitter);
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
        return function () {
            console[name].apply(console, (description ? [description] : []).concat(slice.apply(arguments)));
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
        define(['lodash'], function (_) {
            return factory(_);
        });
    } else {
        // Browser globals
        root.PreOptions = factory(root._);
    }
}(this, function (_) {
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
        _extend(this, sources, dest_name, options, true);
    };
    /**
     * Create PreOptions, base on runtime-value of other PreOptions
     * @param {string|string[]} sources Base on other PreOptions
     * @param {string} dest_name
     * @param {{}} [options={}]
     */
    PreOptions.prototype.baseOn = function (sources, dest_name, options) {
        _extend(this, sources, dest_name, options, false);
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

    function _extend(instance, sources, dest_name, options, real_time) {
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
                _.extend(base_options, instance.get(base));
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
        define(['lodash'], function (_) {
            return (root.ContentManager = factory(_));
        });
    } else {
        // Browser globals
        root.ContentManager = factory(root._);
    }
}(this, function (_) {
    var constants;

    /**
     * @constructor
     * @property {string} type_prefix
     * @property {string} id
     */
    function ContentManager() {
        this.id = _.uniqueId('ContentManager_');
        this._contents = {};
        this._usings = {};
    }

    constants = {
        /**
         * @memberOf ContentManager
         * @constant {string}
         * @default
         */
        CONTENT_TYPE_STRING: 'string',
        /**
         * @memberOf ContentManager
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
         * @memberOf ContentManager
         * @constant {string}
         * @default
         */
        CONTENT_TYPE_ARRAY: 'array',
        /**
         * @memberOf ContentManager
         * @constant {string}
         * @default
         */
        CONTENT_TYPE_FUNCTION: 'function',
        /**
         * @memberOf ContentManager
         * @constant {string}
         * @default
         */
        CONTENT_TYPE_OBJECT: 'object',
        /**
         * @memberOf ContentManager
         * @constant {string}
         * @default
         */
        CONTENT_TYPE_MIXED: 'mixed'
    };
    for (var key in constants) {
        if (constants.hasOwnProperty(key)) {
            Object.defineProperty(ContentManager, key, {
                enumerable: true,
                value: constants[key]
            });
        }
    }

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

    function className(obj, constructor_only) {
        if (constructor_only) {
            return obj.constructor.name;
        }
        return Object.prototype.toString.call(obj);
    }

    function contentType(content) {
        var type = typeof content;

        if (type === 'object') {
            var class_name = className(content, true);

            if (class_name) {
                return class_name;
            }
        }

        return type;
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
            self = this,
            type, key, content_types, item;

        if (_.isUndefined(types)) {
            types = Object.keys(this._contents);
        } else {
            types = _.intersection(_.castArray(types), Object.keys(this._contents));
        }

        while (!found && (type = types.shift())) {
            content_types = Object.keys(self._contents[type]);

            while (!found && (key = content_types.shift())) {
                item = self._contents[type][key];

                if (callback(item.content, item.meta, key, type)) {
                    found = {
                        type: type,
                        key: key,
                        content: item.content,
                        meta: item.meta
                    };
                }
            }
        }

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
            type = contentType(content);
        }

        var key = _.uniqueId(this.id + '_' + type + '_');

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
            type = contentType(content);
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
        constants;

    function Priority() {
        this._priorities = {};
        this._key_mapped = {};
    }

    constants = {
        /**
         * @memberOf Priority
         * @constant {number}
         * @default
         */
        PRIORITY_HIGHEST: 100,
        /**
         * @memberOf Priority
         * @constant {number}
         * @default
         */
        PRIORITY_HIGH: 250,
        /**
         * @memberOf Priority
         * @constant {number}
         * @default
         */
        PRIORITY_DEFAULT: 500,
        /**
         * @memberOf Priority
         * @constant {number}
         * @default
         */
        PRIORITY_LOW: 750,
        /**
         * @memberOf Priority
         * @constant {number}
         * @default
         */
        PRIORITY_LOWEST: 1000,
        /**
         * @memberOf Priority
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_1: 100,
        /**
         * @memberOf Priority
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_2: 200,
        /**
         * @memberOf Priority
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_3: 300,
        /**
         * @memberOf Priority
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_4: 400,
        /**
         * @memberOf Priority
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_5: 500,
        /**
         * @memberOf Priority
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_6: 600,
        /**
         * @memberOf Priority
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_7: 700,
        /**
         * @memberOf Priority
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_8: 800,
        /**
         * @memberOf Priority
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_9: 900,
        /**
         * @memberOf Priority
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_10: 1000
    };
    for (key in constants) {
        if (!constants.hasOwnProperty(key)) {
            continue;
        }

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
     * @param {function} callback Callback parameters:
     * - content
     * - priority key
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
                if (target_priority[index] && callback(target_priority[index].content, target_priority[index].priority_key)) {
                    if (!all) {
                        return target_priority[index].priority_key;
                    }

                    result.push(target_priority[index].priority_key);
                }
            }
        }

        return result.length ? result : false;
    }

    /**
     * Find all of keys by content
     * @param {*} content
     * @return {string|Array|boolean} Priority key(s) or false if not found
     */
    Priority.prototype.findAll = function (content) {
        return do_find(this, function (compare) {
            return content === compare;
        }, true);
    };
    /**
     * Find all of keys by callback
     * @param {function} callback Callback parameters:
     * - content
     * - priority key
     * @return {string|Array|boolean}
     */
    Priority.prototype.findAllBy = function (callback) {
        return do_find(this, callback, true);
    };

    /**
     * Find first key of content
     * @param {*} content
     * @return {string|Array|boolean} Priority key or false if not found
     */
    Priority.prototype.find = function (content) {
        return do_find(this, function (compare) {
            return content === compare;
        }, false);
    };

    /**
     * Find first key of valid content by callback
     * @param {function} callback Callback parameters:
     * - content
     * - priority key
     * @return {string|Array|boolean}
     */
    Priority.prototype.findBy = function (callback) {
        return do_find(this, callback, false);
    };

    /**
     * Check if a content is added
     * @param {*} content
     * @return {boolean}
     */
    Priority.prototype.hasContent = function (content) {
        return false !== this.find(content);
    };

    /**
     * Check if a content is added, by callback
     * @param {function} callback Callback parameters:
     * - content
     * - priority key
     * @return {boolean}
     */
    Priority.prototype.hasContentBy = function (callback) {
        return false !== this.findBy(callback);
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
     * @return {Array} Removed keys
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

    /**
     * Remove contents which is valid by a callback
     * @param {function} callback Callback parameters:
     * - content
     * - priority key
     * @return {Array}
     */
    Priority.prototype.removeBy = function (callback) {
        var keys = this.findAllBy(callback);

        if (false === keys) {
            return [];
        }

        return this.remove(keys);
    };
    /**
     * Remove contents
     * @param {*} content
     * @return {Array}
     */
    Priority.prototype.removeByContent = function (content) {
        return this.removeBy(function (compare) {
            return content === compare;
        });
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
                        result.push({
                            content: this._priorities[priority][index].content,
                            priority_key: this._priorities[priority][index].priority_key
                        });
                    } else {
                        result.push(this._priorities[priority][index].content);
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

    return Priority;
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
        define(['lodash'], function (_) {
            return (root.EventEmitter = factory(_));
        });
    } else {
        // Browser globals
        root.EventEmitter = factory(root._);
    }
}(this, function (_) {
    var unique_ids = {};

    function uniqueID(prefix) {
        if (!unique_ids.hasOwnProperty(prefix)) {
            unique_ids[prefix] = 0;
        }

        return prefix + ++unique_ids[prefix];
    }


    function EventEmitter() {
        this.id = uniqueID('event_emitter_');

        /**
         * Events, object with key is event name, object is an object with:
         * - key: index of listener, _{number}
         * - value: object, listener detail
         *  + priority: number, default is 500
         *  + times: number or true, limit of emit times
         *  + context: object|null, listener context, use event emitter instance if this value is not special
         *  + key: string, use to index listener (if need)
         *  + async: call listener in asynchronous mode
         *  + delay: async delay milliseconds, default is 1
         *  + listener_key: added listener key
         *
         * @property
         * @type {{}}
         * @private
         */
        this._events = {};

        /**
         * Listeners
         * - key: listener key,
         * - value:
         *  + listener: listener callback
         *  + events: object with key is event name, value is object with:
         *     + key: event index, _{number}
         *     + value: true
         *
         * @property
         * @type {{}}
         */
        this._listeners = {};

        /**
         * Listening instances
         * - key: instance id
         * - value: listen detail
         *  + target: listening object
         *  + name: instance name
         *  + listener_key: listener key of added event (on target instance), ready to remove listening
         *  + only: true|{}, only accept events, if is true then accept all of events, if is object -> keys are events name
         *  + except: {}, keys are except events
         *  + async: boolean, listen in asynchronous mode, default is true
         *  + add_method: string|function, method name to call when establish connect to listen instance, default is addListener. If this value is a function, then callback will receive parameters:
         *      + event emitter instance
         *      + target event emitter
         *      + listen detail
         *      + listen callback: function, parameters are:
         *          + event emitted,
         *          + emitted data...
         *
         *      + add listen options
         *
         *      Result of this function will use as listener key
         *
         *  + remove_method: string, method name to call when remove added listen to other instance, default is removeListener. If this value is a function, then callback will receive parameters:
         *      + listener key
         *
         *  + event: string, event to add to, default is 'notify'
         *  + mimics: true|array, list of events that will emit as event of this event emitter. True will mimic all of events. Default is empty array
         *
         * @property
         * @type {{}}
         */
        this._listening = {};

        /**
         * Object of mimic events
         * - key: event name
         * - value: true
         *
         * @property
         * @type {boolean|{}}
         */
        this._mimics = {};

        /**
         * @property
         * @type {{}|boolean}
         */
        this._private_events = {};
    }

    /**
     *
     * @param {Array} [events]
     * @return {EventEmitter}
     */
    EventEmitter.prototype.reset = function (events) {
        if (!arguments.length) {
            events = _.keys(this._events);
        } else {
            events = _.flatten(_.toArray(arguments));
        }

        var self = this,
            removed = {};

        _.each(events, function (event) {
            if (self._events.hasOwnProperty(event)) {
                _.each(self._events[event], function (event_detail, index_key) {
                    if (unlinkListenerEvent(self, event_detail.listener_key, event, index_key)) {
                        _.set(removed, [event_detail.listener_key, event, index_key].join('.'), true);
                    }
                });

                delete self._events[event];
            }
        });

        _.each(removed, function (removed_events, listener_key) {
            _.each(removed_events, function (index_keys, removed_event) {
                self._listeners[listener_key].events[removed_event] = _.omit(self._listeners[listener_key].events[removed_event], _.keys(index_keys));

                if (_.isEmpty(self._listeners[listener_key].events[removed_event])) {
                    delete self._listeners[listener_key].events[removed_event];
                }
            });
        });

        return this;
    };

    /**
     *
     * @param {EventEmitter} instance
     * @param {string} listener_key
     * @param {string} event
     * @param {string} index_key
     */
    function unlinkListenerEvent(instance, listener_key, event, index_key) {
        if (!instance._listeners.hasOwnProperty(listener_key)) {
            return false;
        }
        if (!instance._listeners[listener_key].events.hasOwnProperty(event)) {
            return false;
        }

        delete instance._listeners[listener_key].events[event][index_key];

        return true;
    }

    /**
     *
     * @param {string|Array} events
     * @param {string|function} listener Listener callback or added listener key
     * @param {number|{}} [options] Options or priority
     * - priority: 500,
     * - times: true, call times, true is unlimited
     * - context: null, Context of callback. If not special will use event instance itself
     * - async: false, emit listener as asynchronous
     *
     * @return {string} Listener key
     * @throws
     * - Listener is not added: When use listener as added listener key and it is not added yet
     */
    EventEmitter.prototype.addListener = function (events, listener, options) {
        var self = this,
            key;

        events = _.uniq(_.castArray(events));
        options = getListenerOptions(this, options);

        if (_.isString(listener)) {
            if (!this._listeners.hasOwnProperty(listener)) {
                throw new Error('Listener is not added');
            }
            key = listener;
        } else {
            if (!options.key) {
                key = uniqueID(this.id + '_listener_');
            } else {
                key = options.key;
            }

            this._listeners[key] = {
                listener: listener,
                events: {}
            };
        }

        _.each(events, function (event) {
            if (!self._events.hasOwnProperty(event)) {
                self._events[event] = {};
            }

            var target_events = self._events[event],
                index_key = '_' + _.size(target_events);

            target_events[index_key] = _.extend({}, options, {listener_key: key});

            if (!self._listeners[key].events.hasOwnProperty(event)) {
                self._listeners[key].events[event] = {};
            }

            self._listeners[key].events[event][index_key] = true;
        });

        return key;
    };

    EventEmitter.prototype.on = EventEmitter.prototype.addListener;

    /**
     *
     * @param {EventEmitter} instance
     * @param {{}} options
     * @return {*}
     */
    function getListenerOptions(instance, options) {
        if (_.isNumber(options)) {
            options = {
                priority: options
            }
        }

        options = _.defaults(options || {}, {
            priority: 500,
            times: true,
            context: null,
            key: '',
            async: false,
            delay: 1
        });

        return options;
    }

    /**
     * Check if a listener key is exists
     * @param {string} listener_key
     * @param {boolean} [listening=true] Listener key must is using in any events
     * @return {boolean}
     */
    EventEmitter.prototype.has = function (listener_key, listening) {
        listening = listening || _.isUndefined(listening);

        return this._listeners.hasOwnProperty(listener_key) && (!listening || !_.isEmpty(this._listeners[listener_key].events));
    };

    /**
     * Remove listener
     * @param {string|function} listener Listener itself or listener key
     * @param {string|Array} [events] Remove on special events, default is all of events
     */
    EventEmitter.prototype.removeListener = function (listener, events) {
        var self = this,
            listener_keys = !_.isString(listener) ? getAllListenerKeys(this, listener) : [listener],
            listener_key,
            listener_events,
            target_events;

        if (!listener_keys.length) {
            return;
        }

        while (listener_key = listener_keys.shift()) {
            if (!this._listeners.hasOwnProperty(listener_key)) {
                continue;
            }

            listener_events = _.keys(this._listeners[listener_key].events);
            target_events = _.isUndefined(events) ? listener_events : _.intersection(_.castArray(events), listener_events);

            _.each(target_events, function (event) {
                if (self._events.hasOwnProperty(event)) {
                    self._events[event] = _.omit(self._events[event], _.keys(self._listeners[listener_key].events[event]));
                    delete self._listeners[listener_key].events[event];
                }
            });
        }
    };
    EventEmitter.prototype.removeListeners = function (listeners, events) {
        var self = this;

        _.each(listeners, function (listener) {
            self.removeListener(listener, events);
        });
    };

    function getAllListenerKeys(instance, listener) {
        var result = [];

        _.each(instance._listeners, function (detail, listener_key) {
            if (detail.listener === listener) {
                result.push(listener_key);
            }
        });

        return result;
    }

    /**
     * Add once time listener to event
     * @param {string|Array} events
     * @param {string|function} listener
     * @param {number|{}} options
     * @return {string|string|boolean|null} Listener key
     */
    EventEmitter.prototype.addOnceListener = function (events, listener, options) {
        if (_.isNumber(options)) {
            options = {
                priority: options
            }
        } else if (!_.isObject(options)) {
            options = {};
        }

        options.times = 1;

        return this.addListener(events, listener, options);
    };

    /**
     * Add listeners by object
     * @param {{}} events Object of events: object key is name of event, object value is array of events
     * @return {string[]} Listener keys
     */
    EventEmitter.prototype.addListeners = function (events) {
        var events_arr = [],
            self = this,
            keys = [];

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
     * Mimic events
     * - no parameters: set instance's mimic status is true
     * - (boolean): set instance's mimic status is true|false
     * - (listen_object_or_id): listening object or id
     * - (boolean, listen_object_or_id): set mimic status of listening object is true|false
     * - (events, listen_object_or_id): set mimic events of listening object
     *
     * @param {string|string[]|boolean|EventEmitter} [events]
     * @param {EventEmitter|null|string} [target] Target instance, ID or name
     */
    EventEmitter.prototype.mimic = function (events, target) {
        if (!arguments.length) {
            this._mimics = true;
            return;
        }
        if (arguments.length == 1) {
            if (_.isBoolean(events)) {
                this._mimics = events;
            } else if (_.isObject(events) && !_.isArray(events) && this.isListening(events)) {
                this._listening[get_listen_id(this, events.id || events)].mimics = true;
            } else {
                events = _.filter(_.flatten(_.castArray(events)), _.isString);
                events = arrayToObject(events);

                if (!_.isObject(this._mimics)) {
                    this._mimics = events;
                } else {
                    _.extend(this._mimics, events);
                }
            }

            return;
        }

        target = get_listen_id(this, _.isObject(target) ? target.id : target);

        if (!target) {
            throw new Error('Invalid target');
        }

        if (_.isBoolean(events)) {
            if (!this.isListening(target)) {
                throw new Error('The target is not listening');
            }

            this._listening[target].mimics = events;

            return;
        }

        var self = this;

        events = _.castArray(events);
        _.each(events, function (event) {
            if (!_.isObject(self._listening[target].mimics)) {
                self._listening[target].mimics = {};
            }

            self._listening[target].mimics[event] = true;
        });
    };

    /**
     * Check if an event is a mimic event
     * @param {string} event
     * @param {EventEmitter} [target]
     * @return {boolean}
     */
    EventEmitter.prototype.isMimic = function (event, target) {
        return is_mimic(this, event, target);
    };

    /**
     * Set or add private events
     * @param {boolean|string|Array} events
     */
    EventEmitter.prototype.private = function (events) {
        if (_.isBoolean(events)) {
            this._private_events = events ? true : {};
        } else {
            events = _.filter(_.toArray(arguments), _.isString);

            if (!_.isObject(this._private_events)) {
                this._private_events = {};
            }

            _.extend(this._private_events, arrayToObject(events));
        }
    };

    /**
     * Emit event
     * @param {string} event Event name
     * @param {*} [data...] Event data
     */
    EventEmitter.prototype.emitEvent = function (event, data) {
        data = Array.prototype.slice.call(arguments, 1);

        if (this._events.hasOwnProperty(event)) {
            _emit_event(this, event, data);
        }

        if (this._events.hasOwnProperty('notify') && !is_private_event(this, event)) {
            _emit_event(this, 'notify', [event].concat(data));
        }

        _emit_event(this, event + '_complete', data);

        if (event !== 'event_emitted') {
            _emit_event(this, 'event_emitted', [event].concat(data));
        }

    };
    EventEmitter.prototype.emit = EventEmitter.prototype.emitEvent;
    EventEmitter.prototype.trigger = EventEmitter.prototype.emitEvent;

    /**
     * Similar to method emitEvent but do a callback after event is emitted
     * @param {string} event Event name
     * @param {function} final_cb Callback will receive parameter is data assigned to this method
     * @param {*} [data...]
     */
    EventEmitter.prototype.emitEventThen = function (event, final_cb, data) {
        data = Array.prototype.slice.call(arguments, 2);
        this.emitEvent.apply(this, [event].concat(data));

        final_cb.apply(this, data);
    };
    EventEmitter.prototype.emitThen = EventEmitter.prototype.emitEventThen;
    EventEmitter.prototype.triggerThen = EventEmitter.prototype.emitEventThen;
    EventEmitter.prototype.isListening = function (target, event) {
        var id = _.isObject(target) ? target.id : target;

        if (!(_.isString(id) || _.isNumber(id) && _.isFinite(id) && !_.isNaN(id))) {
            return false;
        }

        if (this._listening.hasOwnProperty(id) && (!_.isObject(target) || this._listening[id].target === target)) {
            if (event) {
                return is_valid_listening_event(event, this._listening[id].only, this._listening[id].except);
            }

            return true;
        }

        id = get_listen_id(this, id);

        return !_.isUndefined(id);
    };

    /**
     *
     * @param {EventEmitter} target
     * @param name
     * @param options
     * @return {string|boolean}
     */
    EventEmitter.prototype.listen = function (target, name, options) {
        if (!_.isObject(target)) {
            throw new Error('Listen target must be an object');
        }
        if (this.isListening(target)) {
            return true;
        }
        if (!_.isString(name)) {
            options = name;
            name = target.id;
        }
        if (_.isArrayLike(options)) {
            options = {
                only: arrayToObject(options)
            }
        }

        options = _.defaults(options || {}, {
            target: target,
            name: name,
            only: true,
            except: {},
            async: true,
            add_method: 'addListener',
            remove_method: 'removeListener',
            event: 'notify',
            mimics: {}
        });

        if (!_.isBoolean(options.mimics)) {
            options.mimics = arrayToObject(options.mimics);
        }
        if (!_.isBoolean(options.only)) {
            options.only = arrayToObject(options.only);
        }

        options.except = arrayToObject(options.except);

        var self = this,
            callback = function () {
                notify_listen_callback.apply(this, [self, name].concat(Array.prototype.slice.call(arguments)));
            };

        var listen_options = {
            async: options.async
        };

        this.emitEvent('before_listen', target, options);

        if (_.isString(options.add_method)) {
            options.listener_key = target[options.add_method](options.event, callback, listen_options);
        } else {
            options.listener_key = options.add_method(this, target, options, callback, listen_options);
        }

        if (_.isUndefined(options.listener_key) || _.isNull(options.listener_key)) {
            throw new Error('Added listener key received by add method is invalid');
        }

        this.emitEvent('listen', target, options);
        this._listening[target.id] = _.omit(options, ['async', 'add_method', 'event']);

        return options.listener_key;
    };

    /**
     *
     * @param {string|EventEmitter} target
     */
    EventEmitter.prototype.unlisten = function (target) {
        if (!arguments.length) {
            _.map(_.keys(this._listening), _.partial(un_listen, this));

            this._listening = {};
        } else {
            target = _.isObject(target) ? target.id : target;

            if (this.isListening(target)) {
                un_listen(this, target);
            }
        }
    };

    /**
     * Get object from array, object key is array values
     * @param {*} array
     * @return {{}}
     */
    function arrayToObject(array) {
        array = _.castArray(array);

        return _.zipObject(array, _.fill(new Array(array.length), true));
    }

    function _emit_event(instance, event_name, data) {
        var listeners;

        if (!instance._events.hasOwnProperty(event_name)) {
            return
        }

        listeners = getListeners(instance, event_name);

        if (!listeners.length) {
            return;
        }

        _.each(listeners, function (listener_detail) {
            if (listener_detail.times === true || listener_detail.times > 0) {
                if (listener_detail.async) {
                    async_callback(listener_detail.listener, data, listener_detail.context || instance, listener_detail.delay);
                } else {
                    do_callback(listener_detail.listener, data, listener_detail.context || instance);
                }

                if (listener_detail.times === true) {
                    return;
                }

                listener_detail.times--;

                if (listener_detail.times > 0) {
                    instance._events[event_name][listener_detail.event_index_key].times = listener_detail.times;

                    return;
                }
            }

            instance.removeListener(listener_detail.listener_key, event_name);
        });
    }

    /**
     *
     * @param {EventEmitter} instance
     * @param {string} event
     * @return {boolean}
     */
    function is_private_event(instance, event) {
        return true === instance._private_events || _.isObject(instance._private_events) && instance._private_events.hasOwnProperty(event);
    }

    /**
     * Check if an event is mimic
     * @param {EventEmitter} instance
     * @param {string} event
     * @param {EventEmitter|string} target Object which has ID field or listen instance ID or listen instance name
     * @return {boolean}
     */
    function is_mimic(instance, event, target) {
        if (_.isBoolean(instance._mimics)) {
            return instance._mimics;
        }
        if (_.isObject(instance._mimics) && instance._mimics.hasOwnProperty(event)) {
            return true;
        }
        if (!target) {
            return instance._mimics.hasOwnProperty(event);
        } else {
            target = get_listen_id(instance, _.isObject(target) ? target.id : target);

            if (target) {
                if (true === instance._listening[target].mimics
                    || (_.isObject(instance._listening[target].mimics) && instance._listening[target].mimics.hasOwnProperty(event))) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     *
     * @param {EventEmitter} instance
     * @param {string} event
     * @return {Array}
     */
    function getListeners(instance, event) {
        if (!instance._events.hasOwnProperty(event)) {
            return [];
        }

        var listeners = [];

        _.each(instance._events[event], function (event_detail, index_key) {
            if (instance._listeners.hasOwnProperty(event_detail.listener_key)) {
                event_detail.listener = instance._listeners[event_detail.listener_key].listener;
                event_detail.event_index_key = index_key;

                listeners.push(_.cloneDeep(event_detail));
            }
        });

        return _.sortBy(listeners, 'priority');
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

    function async_callback(callback, args, context, delay) {
        delay = parseInt(delay);
        if (_.isNaN(delay) || !_.isFinite(delay)) {
            delay = 1;
        }

        return setTimeout(function () {
            do_callback(callback, args, context || null);
        }, Math.max(1, delay));
    }

    /**
     * Get listening ID from name
     * @param {EventEmitter} instance
     * @param {string} name
     * @return {string|undefined}
     */
    function get_listen_id(instance, name) {
        if (instance._listening.hasOwnProperty(name)) {
            return name;
        }
        return _.findKey(instance._listening, ['name', name]);
    }

    /**
     * Callback use to add to base object of listening
     * @param {EventEmitter} host
     * @param {string} name Instance named
     * @param {string} event Event name
     * @param {*} [data...] Event data
     */
    function notify_listen_callback(host, name, event, data) {
        var source = this;

        if (!host.isListening(source)) {
            return;
        }
        var listen_detail = host._listening[source.id];

        if (!is_valid_listening_event(event, listen_detail.only, listen_detail.except)) {
            return;
        }

        var event_data = Array.prototype.slice.call(arguments, 3),
            events = {};

        events[source.id + '.' + event] = true;
        events[name + '.' + event] = true;

        if (is_mimic(host, event, source.id)) {
            events[event] = true;
        }

        _.each(_.keys(events), function (target_event) {
            host.emitEvent.apply(host, [target_event].concat(event_data));
        });
        host.emitEvent.apply(host, ['notified', event].concat(event_data));
    }

    function is_valid_listening_event(event, only, except) {
        return !except.hasOwnProperty(event) && (true === only || only.hasOwnProperty(event));
    }

    function un_listen(instance, listen_id) {
        var detail = instance._listening[listen_id];

        if (!detail) {
            return;
        }

        instance.emitEvent('before_unlisten', detail.target, detail);

        if (_.isString(detail.remove_method)) {
            detail.target[detail.remove_method](detail.listener_key);
        } else {
            detail.remove_method(detail.listener_key);
        }

        instance.emitEvent('unlisten', detail.target, detail);

        delete instance._listening[listen_id];
    }

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
        define(['lodash'], function (_) {
            return (root.Task = factory(_));
        });
    } else {
        // Browser globals
        root.Task = factory(root._);
    }
}(this, function (_) {
    var tasks = {};

    /**
     *
     * @param {string|function|function[]|{}} [handler]
     * @constructor
     */
    function Task(handler) {
        this.id = _.uniqueId('Task_');

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
        var self = this;

        if (_.isObject(name)) {
            _.each(name, function (val, path) {
                _.set(self.options, path, val);
            });
        } else {
            _.set(this.options, name, value);
        }

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
            _.find(this.handler, function (handle) {
                var task_instance;

                if (_.isString(handle)) {
                    task_instance = Task.factory(handle);
                } else {
                    task_instance = new Task(handle);
                }

                _process_handler_as_task(self, task_instance, self._result);

                return self.isError();
            });
        } else if (_.isObject(this.handler)) {
            _.find(this.handler, function (options, handle) {
                var task_instance = Task.factory(handle);

                if (!_.isEmpty(options)) {
                    task_instance.options(options);
                }

                _process_handler_as_task(self, task_instance, self._result);

                return self.isError();
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
     * @example
     * var task1 = new Task();
     * var task2 = alert;
     * var options = {};
     *
     * Task.register('task1', task1, options);
     * Task.register('task2', task2);
     * Task.register(task1, options);
     * Task.register(task2);
     *
     * @param {string} [name]
     * @param {string|function|object|function[]} handler
     * @param {{}} [options] Task options
     */
    Task.register = function (name, handler, options) {
        if (_.isObject(name)) {
            options = _.isObject(handler) ? handler : {};
            handler = name;

            if (handler instanceof Task) {
                name = handler.name;
            } else {
                throw new Error('Task name is unknown');
            }
        }


        tasks[name] = {
            handler: handler,
            options: options || {}
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
            tasks = _.castArray(tasks);
            var do_tasks = [];

            _.each(tasks, function (task) {
                if (_.isString(task)) {
                    task = Task.factory(task);
                } else if (_.isObject(task) && !(task instanceof Task)) {
                    task = _.extend({
                        task: '',
                        options: {}
                    });
                    if (_.isString(task.task)) {
                        task.task = Task.factory(task.task, task.options);
                    } else if (task.task instanceof Task) {
                        _.each(options, function (value, name) {
                            task.task.option(name, value);
                        });
                    }

                    task = task.task;
                }

                do_tasks.push(task);
            });

            _.find(do_tasks, function (task) {
                if (task.process(_.cloneDeep(result['data']))) {
                    result['data'] = task.getResult();
                } else {
                    delete result['data'];
                    result['error'] = task.getError();

                    return true;
                }
            });
        }

        return result;
    };

    Task.register('DataSource', function (response, success_cb, error_cb) {
        var path = this.options.path;

        if(!(_.isString(path) || _.isNumber(path))){
            throw new Error('Path must be string or number');
        }
        if(_.isString(path) && _.empty(path)){
            throw new Error('Path is empty');
        }
        if (_.isObject(response)) {
            if (_.has(response, path)) {
                return success_cb(_.get(response, path));
            }

            return error_cb('Ajax result path not found');
        }

        return error_cb('Response must be an object');
    }, {
        path: ''
    });

    return Task;
}));
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['lodash', 'madnh', 'event_emitter'], function (_, M, EventEmitter) {
            return (root.App = factory(_, M, EventEmitter));
        });
    } else {
        // Browser globals
        var App = factory(root._, root.M, root.EventEmitter);

        /**
         * Support App from https://gist.github.com/madnh/53a16ae3842e16815c0fd36283843a9b
         * @type {*}
         */
        var old_app = root.App || null;

        if (old_app) {
            if (_.isArray(old_app.init_callbacks) && old_app.init_callbacks.length) {
                _.each(old_app.init_callbacks, function (cb) {
                    App.onInit(cb);
                });

                old_app.init_callbacks = [];
                delete old_app.init_callbacks;
            }

            App = _.defaults(App, _.omit(old_app, 'init_callbacks'));
        }

        root.App = App;
    }
}(this, function (_, M, EventEmitter) {
    var root = this;

    function App() {
        EventEmitter.call(this);

        this.private('init');
    }

    M.inherit(App, EventEmitter);

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

            _.set(this, deep, value);
        }

        return this;
    };

    /**
     * Add init callback
     * @param {function} callback
     * @param {number} [priority = 500]
     */
    App.prototype.onInit = function (callback, priority) {
        this.addOnceListener('init', callback, {
            priority: priority
        });

        return this;
    };

    /**
     * Init App
     */
    App.prototype.init = function () {
        this.emitEvent('init');
        this.reset('init');
    };

    return new App();
}));
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['lodash', 'jquery', 'madnh', 'pre_options', 'priority', 'event_emitter', 'task'], function (lodash, jQuery, M, PreOptions, Priority, EventEmitter, Task) {
            return (root.Ajax = factory(lodash, jQuery, M, PreOptions, Priority, EventEmitter, Task));
        });
    } else {
        // Browser globals
        root.Ajax = factory(root._, root.jQuery, root.M, root.PreOptions, root.Priority, root.EventEmitter, root.Task);
    }
}(this, function (_, $, M, PreOptions, Priority, EventEmitter, Task) {
    var key,
        constants;

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
    constants = {
        /**
         * @constant {number}
         * @default
         */
        AJAX_PRE_OPTIONS_NAME: 'MaDnh.Ajax',
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
    };

    /**
     *
     * @param {object} [options]
     * @constructor
     */
    function Ajax(options) {
        EventEmitter.call(this);

        this.options = PreOptions.get(constants.AJAX_PRE_OPTIONS_NAME);

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

    M.inherit(Ajax, EventEmitter);


    for (key in constants) {
        if (!constants.hasOwnProperty(key)) {
            continue;
        }

        Object.defineProperty(Ajax, key, {
            enumerable: true,
            value: constants[key]
        });
    }

    /**
     * Option values
     * - response_tasks: Response adapter object with key is adapter name, value is adapter option object
     * - data_tasks: Data adapter object with key is adapter name, value is adapter option object
     * - auto_abort: abort prev request if not completed
     * - retry: retry times when error
     * - is_continue: check if continue to retry request. Boolean or function which bind to Ajax instance, return
     * boolean value
     */
    PreOptions.define(constants.AJAX_PRE_OPTIONS_NAME, {
        response_tasks: {},
        data_tasks: {},
        auto_abort: true,
        retry: 0,
        retry_delay: 0,
        is_continue: true
    });

    /**
     *
     * @param {{}} options
     */
    Ajax.globalOption = function (options) {
        PreOptions.update(constants.AJAX_PRE_OPTIONS_NAME, options);
    };
    /**
     * Get error detail
     * @param {Arguments} error_arguments jQuery error callback arguments as array
     * @returns {{code: string|number, message: string}}
     */
    Ajax.beautifyError = function (error_arguments) {
        var jqXHR = error_arguments[0],
            textStatus = error_arguments[1],
            errorThrown = error_arguments[2],
            err_result = {
                code: '',
                message: 'Ajax error'
            };

        switch (textStatus) {
            case 'parsererror':
                err_result.code = constants.AJAX_PARSER_ERROR;
                break;

            case 'abort':
                err_result.code = constants.AJAX_ABORTED;
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

    Ajax.prototype.option = function (option, value) {
        this.options = M.setup.apply(M, [this.options].concat(_.toArray(arguments)));

        return this;
    };
    Ajax.prototype.data = function (data) {
        this.options.data = data;

        return this;
    };
    Ajax.prototype.addData = function (name, value) {
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
     * @returns {Ajax}
     */
    Ajax.prototype.done = function (callback) {
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
     * @returns {Ajax}
     */
    Ajax.prototype.fail = function (callback) {
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
     * @returns {Ajax}
     */
    Ajax.prototype.always = function (callback) {
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
    Ajax.prototype.status = function () {
        if (_.isObject(this.jqXHR) && this.jqXHR.hasOwnProperty('readyState')) {
            return this.jqXHR.readyState;
        }

        return false;
    };

    /**
     * Check if instance is ready for request
     * @returns {boolean}
     */
    Ajax.prototype.isReady = function () {
        var status = this.status();

        return status !== false && status === 0;
    };

    /**
     * Check if instance is requesting
     * @returns {boolean}
     */
    Ajax.prototype.isRequesting = function () {
        var status = this.status();

        return status !== false && status >= 1 && status <= 3;
    };
    Ajax.prototype.isRetrying = function () {
        return Boolean(this._is_retrying);
    };

    /**
     * Check if request is done and not retrying
     * @returns {boolean}
     */
    Ajax.prototype.isDone = function () {
        return !this.isRetrying() && this.status() === 4;
    };

    Ajax.prototype.isFailed = function () {
        return this.isDone() && !_.isEmpty(this.error);
    };

    Ajax.prototype.isResponseMeaningFailed = function () {
        return this.isFailed() && this._is_response_meaning_failed;
    };

    Ajax.prototype.isSuccess = function () {
        return this.isDone() && _.isEmpty(this.error);
    };
    /**
     * Check if current request is aborted
     * @returns {boolean}
     */
    Ajax.prototype.isAborted = function () {
        return this.error && (this.error.code === constants.AJAX_ABORTED);
    };

    Ajax.prototype.isLastRetryTime = function () {
        return this.isRetrying() && this.options.retry && this.retry_time >= parseInt(this.options.retry);
    };

    Ajax.prototype.isRetryable = function () {
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
        var result = Task.apply(response, this.options.response_tasks);

        if (result.error) {
            this._is_response_meaning_failed = true;
            this.error = result.error;

            if (!this.isRetryable()) {
                this.emitEvent('fail', result.error.message, result.error.code);
            }

            return;
        }

        this.response = result.data;

        this.emitEvent('done', _.clone(result.data));
    }

    function _ajax_fail_cb(jqXHR, textStatus, errorThrown) {
        var err_result = Ajax.beautifyError(arguments);

        this.error = err_result;

        if (!this.isRetryable() && !this.isAborted()) {
            this.emitEvent('fail', err_result.message, err_result.code);
        }
    }

    function _at_the_end(ajax_instance) {
        ajax_instance._last_options = null;
        ajax_instance._is_retrying = false;
        ajax_instance.emitEvent('always', ajax_instance.error, ajax_instance.response);
    }

    function _ajax_always_cb(jqXHR, textStatus) {
        var self = this;

        if (this.isAborted()) {
            this.emitEvent('aborted');
        } else if (this.isRetryable()) {
            if (this.isRetrying()) {
                this.emitEvent('retry_complete', this.retry_time, this.isLastRetryTime(), jqXHR, textStatus);
            }

            this._is_retrying = true;
            if (!this.options.retry_delay) {
                this.request();
            } else {
                this._retry_timeout_id = setTimeout(function () {
                    self.request();
                }, this.options.retry_delay);
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
                priority: Priority.PRIORITY_HIGHEST,
                key: 'success_listeners_from_options'
            });
        }
        if (last_options.hasOwnProperty('error') || last_options.hasOwnProperty('fail')) {
            instance.removeListener('error_listeners_from_options');
            instance.addListener('fail', _.values(_.pick(last_options, ['error', 'fail'])), {
                priority: Priority.PRIORITY_HIGHEST,
                key: 'error_listeners_from_options'
            });
        }
        if (last_options.hasOwnProperty('complete') || last_options.hasOwnProperty('always')) {
            instance.removeListener('complete_listeners_from_options');
            instance.addListener('always', _.values(_.pick(last_options, ['complete', 'always'])), {
                priority: Priority.PRIORITY_HIGHEST,
                key: 'complete_listeners_from_options'
            });
        }
        if (last_options.hasOwnProperty('beforeSend')) {
            before_send_cb = last_options.beforeSend;
        }

        last_options = _.omit(last_options, ['success', 'done', 'error', 'fail', 'complete', 'always', 'beforeSend']);

        last_options['done'] = _ajax_done_cb.bind(instance);
        last_options['fail'] = _ajax_fail_cb.bind(instance);
        last_options['always'] = _ajax_always_cb.bind(instance);
        last_options['beforeSend'] = function (jqXHR, settings) {
            var result = true;

            if (instance.option('auto_abort') && instance.isRequesting()) {
                instance.abort();
            }
            if (_.isFunction(before_send_cb) && !instance.isRetrying()) {
                result = before_send_cb.apply(instance, [jqXHR, settings]);
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
            var request_data_result = Task.apply(_.clone(last_options.data), last_options.data_tasks);

            if (request_data_result.data) {
                last_options.data = request_data_result.data;
            } else {
                this.error = request_data_result.error;
                return false;
            }
        }

        return _.omit(last_options, ['response_tasks', 'data_tasks', 'auto_abort', 'retry', 'retry_delay', 'is_continue']);
    }

    /**
     * Do Request
     * @param instance
     * @param options
     * @returns {Ajax|*}
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
                instance.emitEvent('fail', instance.error.message, instance.error.code);
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

    Ajax.prototype.request = function (options) {
        return _do_request(this, options);
    };

    /**
     * Abort current request
     */
    Ajax.prototype.abort = function () {
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

        args = M.optionalArgs(Array.prototype.slice.call(arguments, 3), ['data', 'callback', 'dataType'], {
            data: ['string', 'Object'],
            callback: 'Function',
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
        Ajax.prototype[method] = function (url, data, callback, dataType) {
            return _ajax_restful_shorthand_func.apply(null, [this, method.toUpperCase()].concat(Array.prototype.slice.call(arguments, 0)));
        };
    });
    ['get', 'post'].forEach(function (method) {
        Ajax.prototype[method + 'JSON'] = function (url, data, callback) {
            var args = M.optionalArgs(Array.prototype.slice.call(arguments, 0, 3), ['url', 'data', 'callback'], {
                    url: 'string',
                    data: ['string', 'Object'],
                    callback: 'Function'
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
        Ajax[method] = function (url, data, callback, dataType) {
            var instance = new Ajax();

            instance[method].apply(instance, Array.prototype.slice.call(arguments, 0));
            return instance;
        }
    });

    /**
     *
     * @param {string|object} [data]
     */
    Ajax.prototype.query = function (data) {
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
    Ajax.prototype.send = function (data) {
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
     | Ajax Helpers
     |--------------------------------------------------------------------------
     */

    /**
     * Create Ajax instance with Pre Options
     * @param {string} pre_options_name
     * @param {{}} [custom_options={}]
     * @returns {Ajax}
     */
    Ajax.use = function (pre_options_name, custom_options) {
        return new Ajax(PreOptions.get(pre_options_name, custom_options));
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
    Ajax.load = function (url, target, options) {
        var instance = new Ajax();

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

    return Ajax;
}));
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['lodash', 'madnhjs', 'EventEmitter'], function (_, M, EventEmitter) {
            return (root.Template = factory(_, M, EventEmitter));
        });
    } else {
        // Browser globals
        root.Template = factory(root._, root.M, root.EventEmitter);
    }
}(this, function (_, M, EventEmitter) {
    var version = '1.0.0';

    /**
     ==============================================================
     Template Constructor
     ==============================================================
     **/

    /**
     *
     * @param sections
     * @param layout
     * @constructor
     */
    function Template(sections, layout) {
        this.type_prefix = 'template';
        EventEmitter.call(this);

        this.dataSource = null;
        this.options = {};
        this._layout = '';
        this._sections = {};

        if (!_.isUndefined(layout)) {
            self.setLayout(layout);
        }

        if (_.isObject(sections)) {
            _.each(sections, function (section_name, cb) {
                self.setSection(section_name, cb);
            });
        }
    }

    Template.prototype = Object.create(EventEmitter.prototype);
    Template.prototype.constructor = Template;

    Object.defineProperty(Template, 'version', {
        value: version
    });

    /**
     *
     * @param {string|object} option
     * @param {*} [value]
     * @returns {Template}
     */
    Template.prototype.option = function (option, value) {
        this.options = M.setup.apply(_.M, [this.options].concat(_.toArray(arguments)));

        return this;
    };

    /**
     * Connect to data source
     * @param {(Object|EventEmitter)} data_source
     * @returns {Template}
     */
    Template.prototype.connect = function (data_source) {
        if (this.dataSource !== null) {
            this.disconnect();
        }
        this.dataSource = data_source;

        if (data_source instanceof EventEmitter) {
            this.listen(data_source);
        }
        this.emitEvent('connected');

        return this;
    };

    /**
     * Disconnect from data source
     * @returns {boolean} Disconnect result
     */
    Template.prototype.disconnect = function () {
        if (this.dataSource !== null) {
            this.emitEvent('before_disconnect');

            if (this.dataSource instanceof EventEmitter) {
                this.unlisten(this.dataSource);
            }

            this.dataSource = null;
            this.emitEvent('disconnected');

            return true;
        }

        return false;
    };

    /**
     * Get data source
     * @returns {Object|*|null}
     */
    Template.prototype.getDataSource = function () {
        return this.dataSource;
    };

    /**
     * Check if connected to data source
     * @returns {boolean}
     */
    Template.prototype.isConnected = function () {
        return this.dataSource !== null;
    };

    /**
     *
     * @param {string|function} layout If is function then this func will receive parameters: template instance, object to display, render data
     * @returns {Template}
     */
    Template.prototype.setLayout = function (layout) {
        this._layout = layout;

        return this;
    };

    Template.prototype.getLayout = function () {
        return this._layout;
    };

    /**
     *
     * @param {string|{}} name Section name or object with name and value of sections
     * @param {string|function} [content] Value of section, on case parameter name is string.
     * If is function then that function will receive parameters: template instance, object to display, render data
     * @returns {Template}
     */
    Template.prototype.setSection = function (name, content) {
        if (_.isObject(name)) {
            _.each(name, function (value, key) {
                this._sections[key.toUpperCase()] = value;
            }.bind(this));
        } else {
            this._sections[name.toUpperCase()] = content;
        }

        return this;
    };

    /**
     *
     * @returns {boolean|number}
     */
    Template.prototype.currentDraw = function () {
        return M.currentID(this.id + '_draw', false);
    };
    Template.prototype.getDOMID = function () {
        return this.id;
    };

    function getSubSections(str) {
        var re = new RegExp('@([A-Z0-9_\-]+)@', 'gi'),
            result = [], tmp_match;

        while ((tmp_match = re.exec(str)) !== null) {
            result.push(tmp_match[1]);
        }

        return result;
    }

    function renderContent(content, instance, sections, data) {
        var result = '', sub_sections = [];

        if (_.isFunction(content)) {
            result = content(instance, instance.dataSource, data);
        } else {
            result = content + '';
        }
        sub_sections = getSubSections(result);

        var missing_subsections = _.difference(sub_sections, Object.keys(sections));
        if (!_.isEmpty(missing_subsections)) {
            console.warn('Missing subsections:', missing_subsections);
            _.each(missing_subsections, function (missing_subsection) {
                sections[missing_subsection] = '';
                sub_sections[missing_subsection] = '';
            });
        }

        sub_sections = _.zipObject(sub_sections, _.fill(new Array(sub_sections.length), ''));
        if (!_.isEmpty(sub_sections)) {
            _.each(sub_sections, function (sub_section_value, sub_section_name) {
                sections[sub_section_name] = renderContent(sections[sub_section_name], instance, sections, data);
                sub_sections[sub_section_name] = sections[sub_section_name];
            });

            _.each(sub_sections, function (sub_section_value, sub_section_name) {
                result = result.replace(new RegExp('@' + sub_section_name.toUpperCase() + '@', 'gi'), sub_section_value);
            });
        }

        return result;
    }

    Template.prototype.prepareData = function () {
        return {};
    };

    /**
     * Render and return template
     * @param {Object} [data = {}] External data
     * @returns {string}
     */
    Template.prototype.render = function (data) {
        var self = this,
            _data = _.extend({}, {
                option: this.options,
                data_source: this.getDataSource()
            }),
            _sections = _.extend({}, this._sections),
            layout;

        M.nextID(this.id + '_draw');
        _data.draw = this.currentDraw();
        _data.dom_id = this.getDOMID();

        _.extend(_data, this.prepareData(_data), _.isObject(data) ? data : {});

        if (_.isFunction(this._layout)) {
            layout = this._layout(self, this.dataSource, _data);
        } else {
            layout = this._layout + '';
        }

        layout = renderContent(layout, this, _sections, _data);

        return _.template(layout)(_data);
    };
    Template.prototype.rendered = function () {
        //
    };

    /**
     * Replace rendered DOM
     * Emit events:
     * - redraw
     * - drawn(new_content)
     *
     * @param {Object} [data] External data
     * @returns {boolean}
     */
    Template.prototype.reDraw = function (data) {
        var dom = this.getDOM();

        if (dom) {
            var new_content = this.render(data);

            this.emitEvent('re-draw');
            dom.first().replaceWith(new_content);
            this.emitEvent('drawn', new_content);
            this.rendered();

            return true;
        }

        return false;
    };

    Template.prototype.getDOM = function () {
        return $('#' + this.getDOMID());
    };


    /**
     ==============================================================
     STATIC METHODS
     ==============================================================
     **/

    var _templates = {
        compilers: {},
        types: {}
    };

    /**
     * Check if a compiler is exists
     * @param name
     */
    Template.hasCompiler = function (name) {
        return _.has(_templates.compilers, name);
    };

    /**
     * Add compiler
     * @param {string} name
     * @param {function} compiler
     * @returns {*}
     */
    Template.compiler = function (name, compiler) {
        _templates.compilers[name] = compiler;
    };
    /**
     * Get compilers name
     * @returns {Array}
     */
    Template.compilers = function () {
        return Object.keys(_templates.compilers);
    };
    /**
     * Render a compiler
     * @param {string} name
     * @param {*} data
     * @returns {(string|boolean)}
     */
    Template.render = function (name, data) {
        if (this.hasCompiler(name)) {
            if (arguments.length == 1) {
                data = {};
            }
            return _templates.compilers[name](data);
        }
        return false;
    };

    /**
     * Register Template constructor
     * @param {string} type
     * @param {string} name
     * @param {Template} constructor
     * @returns {boolean}
     */
    Template.register = function (type, name, constructor) {
        if (!_templates.types.hasOwnProperty(type)) {
            _templates.types[type] = {
                _default: null,
                constructors: {}
            };
        }

        if (!_templates.types[type].hasOwnProperty(name)) {
            _templates.types[type].constructors[name] = constructor;

            if (!_templates.types[type]._default) {
                _templates.types[type]._default = name;
            }

            return true;
        }

        return false;
    };

    /**
     * Return Template type list
     * @param {boolean} [detail]
     * @returns {Array}
     */
    Template.types = function (detail) {
        if (detail) {
            return _.mapObject(_templates.types, function (type_detail) {
                return Object.keys(type_detail.constructors);
            });
        }

        return Object.keys(_templates.types);
    };

    /**
     * Check if Template type is exists
     * @param {string} type
     * @returns {boolean}
     */
    Template.hasType = function (type) {
        return _templates.types.hasOwnProperty(type);
    };

    /**
     * Return templates of type
     * @param {string} type
     * @param {boolean} [name_only=false] Return template name only
     * @returns {Array}
     */
    Template.templates = function (type, name_only) {
        if (name_only) {
            return Object.keys(_templates.types[type].constructors);
        }

        return _.clone(_templates.types[type].constructors);
    };

    /**
     * Check if template with name is exists
     * @param {string} type
     * @param {string} name
     * @returns {boolean}
     */
    Template.hasTemplate = function (type, name) {
        return _templates.types.hasOwnProperty(type) && _templates.types[type].constructors.hasOwnProperty(name);
    };

    /**
     * Set/Get default template name
     * @param {string} type
     * @param {string} [default_template] Name of default template. If missing then this func return default template of template type
     * @returns {string|boolean} False on fail
     */
    Template.defaultTemplate = function (type, default_template) {
        if (!_.isEmpty(_templates.types[type].constructors)) {
            if (default_template) {
                if (_templates.types[type].constructors.hasOwnProperty(default_template)) {
                    _templates.types[type]._default = default_template;

                    return true;
                } else {
                    throw new Error('Set default template with invalid template name');
                }
            }
            if (_templates.types[type]._default && this.hasTemplate(type, _templates.types[type]._default)) {

                return _templates.types[type]._default;
            }

            var name = Object.keys(_templates.types[type].constructors)[0];

            _templates.types[type]._default = name;

            return new _templates.types[type].constructors[name];
        }

        return false;
    };

    /**
     * Get template instance
     * @param {string} type
     * @param {string} [name] Name of template constructor, if missing then return first constructor of type's templates
     */
    Template.templateInstance = function (type, name) {
        if (arguments.length < 2) {
            var default_name = this.defaultTemplate(type);

            if (false !== default_name) {
                return new _templates.types[type].constructors[default_name];
            }
        } else if (this.hasTemplate(type, name)) {
            return new _templates.types[type].constructors[name];
        }

        throw new Error('Template with name isn\'t exists or invalid type');
    };


    return Template;
}));