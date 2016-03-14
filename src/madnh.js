/**
 * MaDnhJS - An UnderscoreJS extension
 * -------
 * @version 1.0.0
 * @author Do Danh Manh
 * @email dodanhmanh@gmail.com
 * @licence MIT
 */

/**
 * @namespace MaDnh
 */
;(function (_) {
    var version = '1.0.0';

    var M = {};
    Object.defineProperty(M, 'VERSION', {
        value: version
    });

    var slice = Array.prototype.slice;


    /** Mixin method "module" to UnderscoreJS, this **/
    /**
     * This method help us to structure UnderscoreJS extensions as module
     */
    _.mixin({
        /**
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
     * Loop over array or object with callback and breakable
     * @memberOf MaDnh
     * @param obj
     * @param callback
     * @param break_on Value of callback result that break the loop, default is 'break'
     * @returns {*}
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
     * @memberOf MaDnh
     * @param obj
     */
    M.removeItem = function (obj) {
        var keys = slice.call(arguments, 1);
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

    var idCounter = {};
    /**
     * Return Next ID of type
     * @memberOf MaDnh
     * @param {string} [type="unique_id_"] Type of ID, default is "unique_id"
     * @param {boolean} [type_as_prefix = true]
     * @returns {(string|number)}
     */
    M.nextID = function (type, type_as_prefix) {
        if (_.isEmpty(type)) {
            type = 'unique_id';
        }
        if (!_.has(idCounter, type)) {
            idCounter[type] = 0;
        }

        var id = idCounter[type]++;

        return type_as_prefix || _.isUndefined(type_as_prefix) ? type + '_' + id : id;
    };

    /**
     * Return current ID of type
     * @memberOf MaDnh
     * @param {string} [type="unique_id_"] Type of ID, default is "unique_id"
     * @param {boolean} [type_as_prefix = true]
     * @returns {(string|number)}
     */
    M.currentID = function (type, type_as_prefix) {
        var id = 0;

        if (_.isEmpty(type)) {
            type = 'unique_id';
        }
        if (_.has(idCounter, type)) {
            id = idCounter[type] - 1;
        }


        return type_as_prefix || _.isUndefined(type_as_prefix) ? type + '_' + id : id;
    };


    /**
     * Get constructor name of object
     * @memberOf MaDnh
     * @param obj
     * @param {boolean} [constructor_only = false] Return object's constructor name only
     * @returns {string}
     */
    M.className = function (obj, constructor_only) {
        if (constructor_only) {
            return obj.constructor.name;
        }
        return Object.prototype.toString.call(obj);
    };

    /**
     * Get type of content. If is object then return constuctor name
     * @param content
     * @returns {string}
     */
    M.contentType = function (content) {
        var type = typeof content;

        if (type === 'object') {
            switch (true) {
                case _.isArray(content):
                    return 'array';

                case _.isFunction(content):
                    return 'function';

                default:
                    return M.className(content, true);
            }
        }

        return type;
    };

    /**
     * Check object is an instance of a constructor type
     * @memberOf MaDnh
     * @param obj
     * @param {string} class_name
     * @returns {boolean}
     */
    M.isInstanceOf = function (obj, class_name) {
        return this.className(obj, true) === class_name;
    };

    /**
     * Check if object is primitive type: null, string, number, boolean
     * @memberOf MaDnh
     * @param obj
     * @returns {boolean}
     */
    M.isPrimitiveType = function (obj) {
        var type = typeof obj;
        return obj == null || type === 'string' || type === 'number' || type === 'boolean';
    };

    /**
     * Make sure function parameter is array
     * @memberOf MaDnh
     * @param {*} value
     * @returns {Array}
     * @example
     * _.M.asArray([123]) => [123]
     * _.M.asArray(123) => [123]
     */
    M.asArray = function (value) {
        if (_.isArray(value)) {
            return value;
        }
        return [value];
    };

    /**
     * Make sure first argument is object or name and value of object
     * @param {*} name
     * @param {*} value
     * @returns {*}
     */
    M.asObject = function (name, value) {
        switch (true) {
            case arguments.length == 1:
                if (_.isObject(name)) {
                    return name;
                }
                return {};

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

    /**
     * Make sure that a value is in a range
     * @memberOf MaDnh
     * @param value
     * @param min
     * @param max
     * @returns {number}
     * @example
     * _.M.minMax(10, -10, 50) => 10
     * _.M.minMax(10, 20, 50) => 20
     * _.M.minMax(100, 20, 50) => 50
     */
    M.minMax = function (value, min, max) {
        return Math.max(min, Math.min(value, max));
    };

    /**
     * Get random string
     * @memberOf MaDnh
     * @param {number} length
     * @param {string} [chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ']
     * @returns {string}
     * @example
     * _.M.randomString(10) => 'mYJeC1xBcl'
     * _.M.randomString(10, 'ABCDEF') => 'CDABBEFADE'
     */
    M.randomString = function (length, chars) {
        var result = '', chars_length, i;
        if (_.isUndefined(chars) || !chars.toString().length) {
            chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        }
        chars_length = chars.length;

        for (i = length; i > 0; --i) {
            result += chars[Math.round(Math.random() * (chars_length - 1))];
        }
        return result;
    };

    /**
     * Setup a object with field name and value or object of fields
     * @memberOf MaDnh
     *
     * @param {Object} object host object
     * @param {(string|Object)} option field name of object of fields
     * @param {*} value value of field when option param is field name
     * @returns {*}
     * @example
     * var obj = {a: 'A', b: 'B'}
     * _.M.setup(obj, 'a', '123')
     * _.M.setup(obj, {
     *      a: 123,
     *      b: 'Yahoo',
     *      c: 'ASD'
     * })
     *
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
     * @memberOf MaDnh
     * @returns {*}
     * @example
     * _.M.firstNotEmpty(['', 0, false, 123]) => 123
     */
    M.firstNotEmpty = function () {
        return _.find(_.flatten(slice.call(arguments, 0)), function (value) {
            if (_.isString(value)) {
                return value.length > 0;
            }
            if (M.isNumeric(value)) {
                var parsedValue = parseFloat(value);
                return parsedValue !== 0 && !_.isNaN(parseFloat(value)) && !_.isFinite(parsedValue);
            }
            if (value === true) {
                return true;
            }
            return !_.isEmpty(value);
        });
    };

    /**
     * Repeat value by times
     * @memberOf MaDnh
     * @param {*} value
     * @param {number} times Repeat times, >= 0
     * @param {boolean} [as_array = false] Return result as array, default is return as string
     * @returns {*}
     * @example
     * _.M.repeat('a', 5) => 'aaaaa'
     * _.M.repeat('a', 5, true) => ['a', 'a', 'a', 'a', 'a']
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
     * @memberOf MaDnh
     * @param {*} value
     * @param {number} length Number of result need to fit
     * @param {string} span add value
     * @param {boolean} [before = true]
     * @returns {*}
     * @example
     * _.M.span(123, 5, '_') => '__123'
     * _.M.span(123, 5, '_', false) => '123__'
     * _.M.span('ABCDEF', 5, '_') => 'ABCDEF'
     */
    M.span = function (value, length, span, before) {
        if (_.isUndefined(before)) {
            before = true;
        }
        value += '';
        if (value.length < length) {
            span = M.repeat(span, length - value.length);
            value = before ? span + '' + value : value + '' + span;
        }
        return value;
    };

    /**
     * Get n characters from left of string
     * @memberOf MaDnh
     * @param {string} string
     * @param {number} [length = 1] Number of characters
     * @returns {string}
     * @example
     * _.M.left('ABC', 2) => 'AB'
     */
    M.left = function (string, length) {
        if (_.isUndefined(length)) {
            length = 1;
        }

        if (length <= 0) {
            return '';
        }
        return string.toString().substr(0, length);
    };

    /**
     * Get n characters from right of value
     * @memberOf MaDnh
     * @param {string} string
     * @param {number} [length = 1] Number of characters, default is 1
     * @returns {string}
     * @example
     * _.M.right('ABC', 2) => 'BC'
     */
    M.right = function (string, length) {
        var tmpVal = string.toString();

        if (_.isUndefined(length)) {
            length = 1;
        }
        if (length <= 0) {
            return '';
        }

        return tmpVal.substr(Math.max(0, tmpVal.length - length), length);
    };

    /**
     *
     * @memberOf MaDnh
     * @param num
     * @param place
     * @param sign
     * @param base
     * @returns {string}
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
     * Check object is numeric
     * @memberOf MaDnh
     * @param obj
     * @returns {boolean}
     *
     * @example
     * _.M.isNumeric(123) => true
     * _.M.isNumeric(123.5) => true
     * _.M.isNumeric('123.5') => true
     */
    M.isNumeric = function (obj) {
        return !_.isArray(obj) && (obj - parseFloat(obj) + 1) >= 0;
    };

    /**
     * Check if numeric value is integer
     * @memberOf MaDnh
     * @param number
     * @returns {boolean}
     * @example
     * _.M.isInteger(123) => true
     * _.M.isInteger(123.5) => false
     * _.M.isInteger('123') => true
     */
    M.isInteger = function (number) {
        return number % 1 === 0;
    };

    /**
     * Check if a numeric is multiple of other
     * @memberOf MaDnh
     * @param n1
     * @param n2
     * @returns {boolean}
     * @example
     * _.M.isMultiple(12, 3) => true
     * _.M.isMultiple(12, 5) => false
     * _.M.isMultiple(12, '4') => true
     */
    M.isMultiple = function (n1, n2) {
        return n1 % n2 === 0;
    };
    /**
     * Check if a numeric is odd
     * @memberOf MaDnh
     * @param number
     * @returns {boolean}
     * @example
     * _.M.isOdd(5) => true
     * _.M.isOdd(4) => false
     * _.M.isOdd('11') => true
     */
    M.isOdd = function (number) {
        return M.isInteger(number) && !M.isMultiple(number, 2);
    };
    /**
     * Check if a number is even
     * @memberOf MaDnh
     * @param number
     * @returns {boolean}
     * @example
     * _.M.isOdd(5) => false
     * _.M.isOdd(4) => true
     * _.M.isOdd('11') => false
     * _.M.isOdd('8') => true
     */
    M.isEven = function (number) {
        return this.isMultiple(number, 2);
    };

    /**
     * Make value is in array
     * @param {Array} values
     * @param {*} value
     * @returns {*} Value if found, first item of values if not found
     */
    M.oneOf = function (values, value) {
        if (-1 == values.indexOf(value)) {
            return _.first(values);
        }

        return value;
    };

    /**
     * Capitalize a string
     * @memberOf MaDnh
     * @param {string} str
     * @param {boolean} [all = true] True - all words of string, False - Only first word
     * @returns {string}
     * @example
     * _.M.capitalize('XIN CHAO ban') => 'Xin Chao Ban'
     * _.M.capitalize('XIN CHAO ban', false) => 'Xin chao ban'
     */
    M.capitalize = function (str, all) {
        var lastResponded;
        return str.toLowerCase().replace(all ? /[^']/g : /^\S/, function (lower) {
            var upper = lower.toUpperCase(), result;
            result = lastResponded ? lower : upper;
            lastResponded = upper !== lower;
            return result;
        });
    };

    /**
     * Check input is string or number
     * @memberOf MaDnh
     * @param {*} value
     * @returns {boolean}
     * @example
     * _.M.isLikeString('yahoo') => true
     * _.M.isLikeString(123) => true
     * _.M.isLikeString({}) => false
     * _.M.isLikeString(true) => false
     */
    M.isLikeString = function (value) {
        return _.isString(value) || this.isNumeric(value);
    };

    /**
     * Return reverse of string
     * @memberOf MaDnh
     * @param {string} str
     * @returns {string}
     * @example
     * _.M.reverseString('yahoo') => 'oohay'
     */
    M.reverseString = function (str) {
        return str.split('').reverse().join('');
    };
    /**
     * Check a string if trimmed value is empty
     * @memberOf MaDnh
     * @param {string} str
     * @returns {boolean}
     * @example
     * _.M.isBlank('abc') => false
     * _.M.isBlank('') => true
     * _.M.isBlank('    ') => true
     */
    M.isBlank = function (str) {
        return str.trim().length === 0;
    };

    /**
     * Return current unix timestamp as seconds
     * @memberOf MaDnh
     * @returns {Number}
     * @example
     * _.M.nowSecond() => 1450622822
     */
    M.nowSecond = function () {
        return parseInt(Math.floor(_.now() / 1000));
    };

    /**
     * Escape URL
     * @memberOf MaDnh
     * @param {string} url
     * @param {boolean} [param = false] Include param?
     * @returns {string}
     */
    M.escapeURL = function (url, param) {
        return param ? encodeURIComponent(url) : encodeURI(url);
    };

    /**
     * Unescape URL
     * @memberOf MaDnh
     * @param {string} url
     * @param {boolean} [param = false] Include param?
     * @returns {string}
     */
    M.unescapeURL = function (url, param) {
        return param ? decodeURI(url) : decodeURIComponent(url);
    };

    /**
     * Escape HTML
     * @memberOf MaDnh
     * @param content
     * @returns {string}
     */
    M.escapeHTML = function (content) {
        return content.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;')
            .replace(/\//g, '&#x2f;').toString();
    };

    /**
     * Return array value at index
     * @memberOf MaDnh
     * @param {Array} array
     * @param {number} index
     * @returns {*}
     * @example
     * var arr = ['a', 'b', 'c'];
     * _.M.valueAt(a, 1) -> 'b'
     * _.M.valueAt(a, 5) -> 'c'
     * _.M.valueAt(a, -1) -> 'c'
     * _.M.valueAt(a, -2) -> 'b'
     */
    M.valueAt = function (array, index) {
        var arr_len = array.length;
        index = index % arr_len;
        if (index < 0) {
            index += arr_len;
        }
        return array[index];
    };

    /**
     * Split array to chunks, each chunk has n element
     * @memberOf MaDnh
     * @param {Array} array
     * @param {number} n
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
     * @memberOf MaDnh
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
     * @memberOf MaDnh
     * @param {Array} array
     * @param {Array}elements
     * @param {boolean} status If this param is boolean then add/remove base on it value. By default it is undefined -
     *     add if none exists, remove if existed
     * @returns {*}
     * @example
     * var arr = ['A', 'B', 'C', 'D'];
     * _.M.toggle(arr, ['A', 'V']) => ['B', 'C', 'D', 'V']
     * _.M.toggle(arr, ['A', 'V'], true) => ['A', 'B', 'C', 'D', 'V']
     * _.M.toggle(arr, ['A', 'V'], false) => ['B', 'C', 'D']
     */
    M.toggle = function (array, elements, status) {
        elements = _.uniq(_.asArray(elements));
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
     * Create, define and return a object with properties
     * @memberOf MaDnh
     * @param {{}} properties
     * @returns {{}}
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
     * Check a constant is defined or not
     * @memberOf MaDnh
     * @param {string} name
     * @returns {boolean}
     * @example
     * _.M.isDefinedConstant('TEST') => false
     */
    M.isDefinedConstant = function (name) {
        return _.has(this, name.trim().toUpperCase());
    };

    /**
     * Define constant, no support function
     * @memberOf MaDnh
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
     * Inherit constructor
     * Base on https://github.com/Olical/Heir
     * @param destination
     * @param source
     * @param addSuper
     */
    M.inherit = function (destination, source, addSuper) {
        var proto = destination.prototype = Object.create(source.prototype);
        proto.constructor = destination;

        if (addSuper || typeof addSuper === 'undefined') {
            destination._super = source.prototype;
        }
    };

    /**
     * Call callback with arguments
     * @memberOf MaDnh
     * @param {Object} thisArg
     * @param {(string|function|Array)} callback
     * @param {*} [args] Callback arguments, if only one argument is passed then it must be wrapped by array, eg:
     *     [users]
     * @returns {*}
     */
    M.callFunc = function (thisArg, callback, args) {
        if (arguments.length > 2) {
            if (arguments.length == 3) {
                args = M.asArray(args);
            } else {
                args = slice.apply(arguments, 2);
            }
        } else {
            args = [];
        }

        if (callback) {
            if (_.isString(callback)) {
                if (M.WAITER.has(callback)) {
                    return M.WAITER.run(callback, args, thisArg);
                }
                if (_.has(window, callback) && _.isFunction(window[callback])) {
                    return window[callback].apply(thisArg || window, args);
                }

                throw new Error('Invalid callback!');
            } else if (_.isFunction(callback)) {

                return callback.apply(thisArg, args);
            } else if (_.isArray(callback)) {
                var result = [];
                var this_func = arguments.callee;
                _.each(callback, function (tmpFunc) {
                    result.push(this_func(thisArg, tmpFunc, args));
                });
                return result;
            }
        }
        return undefined;
    };

    /**
     * Call callback asynchronous
     *
     * @param {function} callback
     * @param {Array} [args]
     * @param {(Object|null)} [context] Callback context
     * @param {number} [delay=1] Delay milliseconds, default is 1
     */
    M.async = function (callback, args, context, delay) {
        var args_count = arguments.length;
        delay = parseInt(delay);
        if (_.isNaN(delay)) {
            delay = 1;
        }
        setTimeout(function () {
            if (args_count == 1) {
                args = [];
                context = null;
            } else if (args_count == 2) {
                args = M.asArray(args);
                context = null;
            }

            callback.apply(context, args);
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

    M.logArgs = function () {
        console.log.apply(console, slice.apply(arguments));
    };
    M.logCb = function (description) {
        return createConsoleCB.apply(null, ['log'].concat(slice.apply(arguments)));
    };

    M.warnArgs = function () {
        console.warn.apply(console, slice.apply(arguments));
    };
    M.warnCb = function (description) {
        return createConsoleCB.apply(null, ['warn'].concat(slice.apply(arguments)));
    };

    M.errorArgs = function () {
        console.error.apply(console, slice.apply(arguments));
    };
    M.errorCb = function (description) {
        return createConsoleCB.apply(null, ['error'].concat(slice.apply(arguments)));
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

    M.defineConstant({
        SORT_NUMBER: sortNumberCallback,
        SORT_NUMBER_DESC: sortNumberDescCallback
    });


    /*
     |--------------------------------------------------------------------------
     | FLAG
     |--------------------------------------------------------------------------
     |
     | Flag manager
     |
     */

    var _flags = {};
    M.FLAG = M.defineObject({
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
         * @param {boolean} is_active Flag status, default is True
         * @param {string} prefix Add prefix to flag name
         * @param {string} suffix Add suffix to flag name
         */
        flag: function (name, is_active, prefix, suffix) {
            if (_.isUndefined(is_active)) {
                is_active = true;
            } else {
                is_active = Boolean(is_active);
            }
            if (!(_.isString(prefix) || M.isNumeric(prefix))) {
                prefix = '';
            } else {
                prefix += '';
            }

            if (!(_.isString(suffix) || M.isNumeric(suffix))) {
                suffix = '';
            } else {
                suffix += '';
            }

            if (_.isArray(name)) {
                _.each(name, function (tmp_name) {
                    _flags[prefix + tmp_name + suffix] = is_active;
                })
            } else {
                _flags[prefix + name + suffix] = is_active;
            }
        },

        /**
         * Get flags
         * @param {boolean} detail If true then return flags with detail of it, else only return flags name
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
         * @param {string} prefix Add prefix to flag name
         * @param {string} suffix Add suffix to flag name
         * @returns {*}
         */
        isFlagged: function (name, prefix, suffix) {
            var result, self = this;

            if (!(_.isString(prefix) || M.isNumeric(prefix))) {
                prefix = '';
            } else {
                prefix += '';
            }

            if (!(_.isString(suffix) || M.isNumeric(suffix))) {
                suffix = '';
            } else {
                suffix += '';
            }

            if (_.isArray(name)) {
                result = [];
                _.each(name, function (tmp_name) {
                    if (self.get(prefix + tmp_name + suffix)) {
                        result.push(tmp_name);
                    }
                })
            } else {
                result = this.get(prefix + name + suffix);
            }

            return result;
        },


        toggle: function (name, prefix, suffix, status) {
            var thisFunc = arguments.callee;
            var self = this;

            if (!(_.isString(prefix) || M.isNumeric(prefix))) {
                prefix = '';
            } else {
                prefix += '';
            }

            if (!(_.isString(suffix) || M.isNumeric(suffix))) {
                suffix = '';
            } else {
                suffix += '';
            }

            if (_.isArray(name)) {
                _.each(name, function (tmp_name) {
                    thisFunc.apply(self, [tmp_name, prefix, suffix, status]);
                })
            } else {
                if (!_.isUndefined(status)) {
                    this.flag(name, Boolean(status), prefix, suffix);
                } else {
                    this.flag(name, !this.isFlagged(name, prefix, suffix), prefix, suffix);
                }
            }
        }

    });


    function BaseConstructor() {
        if (!this.type_prefix) {
            this.type_prefix = this.constructor.name;
        }

        if (!this.id) {
            this.id = M.nextID(this.type_prefix, true);
        }
    }

    /*
     |--------------------------------------------------------------------------
     | CONTENT MANAGER
     |--------------------------------------------------------------------------
     | Store data by key and data type. Support add, check exists, get and delete
     |
     |
     */

    M.defineConstant({
        CONTENT_TYPE_STRING: 'string',
        CONTENT_TYPE_NUMBER: 'number',
        CONTENT_TYPE_BOOLEAN: 'boolean',
        CONTENT_TYPE_ARRAY: 'array',
        CONTENT_TYPE_FUNCTION: 'function',
        CONTENT_TYPE_OBJECT: 'object',
        CONTENT_TYPE_MIXED: 'mixed'
    });

    /**
     * Extract key to get content {string} type
     * @param {string} key
     * @returns {(string|boolean)} False when invalid key
     */
    function getContentTypeFromKey(key) {
        var info = key.split('_');

        if (info.length > 2) {
            return info[1];
        }
        return false;
    }

    function ContentManager() {
        this._contents = {};
        this._usesing = {};
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

    /**
     * Find positions of content by content and [type]
     * @param {*} content
     * @param {string} [type] Find in this type, if missing then auto detect
     * @returns {Array} Array of object with keys: type, key
     */
    ContentManager.prototype.contentPositions = function (content, type) {
        var pos = [],
            self = this;

        if (!type) {
            type = M.contentType(content);
        }
        if (this._contents.hasOwnProperty(type)) {
            Object.keys(this._contents[type]).forEach(function (key) {
                if (self._contents[type][key].content === content) {
                    pos.push({
                        type: type,
                        key: key
                    });
                }
            });
        }

        return pos;
    };

    /**
     * Filter meta, return positions
     * @param {Function} callback
     * @param {(string|Array)} types Filter all type of contents if this parameter is missing
     * @returns {Array}
     */
    ContentManager.prototype.metaPositions = function (callback, types) {
        var pos = [],
            self = this;

        if (!types) {
            types = Object.keys(this._contents);
        }
        types = M.asArray(types);


        types.forEach(function (type) {
            Object.keys(self._contents[type]).forEach(function (key) {
                if (callback(self._contents[type][key])) {
                    pos.push({
                        type: type,
                        key: key
                    });
                }
            });
        });

        return pos;
    };

    /**
     * Check if key is valid
     * @param {string} key
     * @returns {boolean}
     */
    ContentManager.prototype.isValidKey = function (key) {
        return false !== getContentTypeFromKey(key);
    };

    /**
     * Find content exists
     * @param content
     * @param type
     * @returns {boolean}
     */
    ContentManager.prototype.hasContent = function (content, type) {
        return this.contentPositions(content, type).length > 0;
    };

    /**
     * Check if key is exists
     * @param {string} key
     * @param {string} [type]
     * @returns {boolean}
     */
    ContentManager.prototype.hasKey = function (key, type) {
        if (this.isUsing(key)) {
            return true;
        }
        if (!type) {
            type = getContentTypeFromKey(key);
            if (!type) {
                return false;
            }
        }

        return this._contents.hasOwnProperty(type) && this._contents[type].hasOwnProperty(key);
    };

    /**
     * Clean empty type
     */
    ContentManager.prototype.clean = function () {
        var self = this;
        Object.keys(this._contents).forEach(function (type) {
            if (self._contents.hasOwnProperty(type) && _.isEmpty(self._contents[type])) {
                delete self._contents[type];
            }
        });
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

        var key = M.nextID('content_' + type + '_', true);

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
     * Check if content key is using
     * @param {string} key
     * @returns {boolean}
     */
    ContentManager.prototype.isUsing = function (key) {
        return this._usesing.hasOwnProperty(key);
    };

    /**
     * Check if content is using
     * @param {*} content
     * @param {string} [type] Auto detect when missing
     * @returns {boolean}
     */
    ContentManager.prototype.isUsingContent = function (content, type) {
        var positions = this.contentPositions(content, type);

        return positions.length && this._usesing.hasOwnProperty(positions.shift().key);
    };

    /**
     * Toggle using key
     * @param {string} key
     * @param {boolean} [is_using = true]
     */
    ContentManager.prototype.using = function (key, is_using) {
        if (_.isUndefined(is_using) || is_using) {
            this._usesing[key] = true;
        } else {
            delete this._usesing[key];
        }
    };

    /**
     * Remove flaged content key is using
     * @param key
     */
    ContentManager.prototype.unused = function (key) {
        delete this._usesing[key];
    };

    /**
     * Remove content by key. Return content
     * @param {string|Array} keys
     */
    ContentManager.prototype.remove = function (keys) {
        var removes = [], self = this;

        M.asArray(keys).forEach(function (key) {
            var type = getContentTypeFromKey(key);

            if (false !== type && self._contents.hasOwnProperty(type)) {
                delete self._contents[type][key];
                delete self._usesing[key];

                removes.push({
                    type: type,
                    key: key
                });
            }
        });


        this.clean();

        return removes;
    };

    /**
     * Remove content, return content key
     * @param {*} content
     * @param {string} [type]
     * @returns {Array} Removed positions
     */
    ContentManager.prototype.removeContent = function (content, type) {
        var positions = this.contentPositions(content, type),
            self = this;

        if (positions.length) {
            _.each(positions, function (pos) {
                delete self._contents[pos.type][pos.key];
                delete self._usesing[pos.key];
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
        if (this.hasKey(key)) {
            var type = getContentTypeFromKey(key);

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
        if (this.hasKey(key)) {
            var type = getContentTypeFromKey(key);

            this._contents[type][key].meta = meta;

            return true;
        }

        return false;
    };

    /**
     * Get content and meta by key
     * @param {string} key
     * @returns {*}
     */
    ContentManager.prototype.get = function (key) {
        var type = getContentTypeFromKey(key);

        if (false !== type && this._contents[type].hasOwnProperty(key)) {
            return this._contents[type][key];
        }

        return false;
    };

    /**
     * Get type content
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
     * Remove using content
     * @returns {Array} Removed position
     */
    ContentManager.prototype.removeUsing = function () {
        return this.remove(Object.keys(this._usesing));
    };

    /**
     * Remove using content
     * @returns {Array} Removed position
     */
    ContentManager.prototype.removeUnusing = function () {
        var uses = Object.keys(this._usesing),
            types = {},
            self = this,
            removes = {};

        uses.forEach(function (using) {
            var type = getContentTypeFromKey(using);

            if (type) {
                if (!types.hasOwnProperty(type)) {
                    types[type] = [];
                }
                types[type].push(using);
            }
        });

        Object.keys(this._contents).forEach(function (type) {
            if (types.hasOwnProperty(type)) {
                removes[type] = _.difference(Object.keys(self._contents[type]), types[type]);
                self._contents[type] = _.pick(self._contents[type], types[type]);
            } else {
                removes[type] = types[type];
                delete self._contents[type];
            }

        });

        return _.flatten(_.values(removes));
    };

    /**
     * Get status
     * @returns {{using: Number, types: {}}}
     */
    ContentManager.prototype.status = function () {
        var status = {
                using: Object.keys(this._usesing).length,
                types: {}
            },
            self = this;

        Object.keys(this._contents).forEach(function (type) {
            status.types[type] = Object.keys(self._contents[type]);
        });

        return status;
    };


    M.ContentManager = ContentManager;


    /*
     |--------------------------------------------------------------------------
     | PRIORITY
     |--------------------------------------------------------------------------
     |
     | Priority class
     |
     */

    M.defineConstant({
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
    });

    /**
     * Manage contents with priority
     * @memberOf MaDnh
     * @constructor
     * @property {ContentManager} content_manager Content Manager
     */
    function Priority() {
        /**
         * Data holder
         * @type {ContentManager}
         */
        this._content_manager = new ContentManager();

        this._priorities = {};
    }

    /**
     * Check if a priority is exists
     * @function
     * @param priority
     * @returns {boolean}
     */
    Priority.prototype.hasPriority = function (priority) {
        return this._priorities.hasOwnProperty(priority);
    };


    Priority.prototype.hasContent = function (content) {
        return this._content_manager.hasContent(content, 'priority')
    };

    /**
     * Get status about number of priorities and contents
     * @returns {{priorities: number, contents: number}}
     */
    Priority.prototype.status = function () {
        var result = {
                priorities: Object.keys(this._priorities).length,
                contents: 0
            },
            self = this;

        Object.keys(this._priorities).forEach(function (priority) {
            result.contents += self._priorities[priority].length;
        });

        return result;
    };

    /**
     * Add content
     * @param {*} content
     * @param {number} [priority = M.PRIORITY_DEFAULT]
     * @param {*} [meta] Content meta info
     * @returns {(string|boolean)} content key
     */
    Priority.prototype.addContent = function (content, priority, meta) {
        if (_.isUndefined(priority)) {
            priority = M.PRIORITY_DEFAULT;
        }

        var key = this._content_manager.add(content, meta, 'priority');

        this._content_manager.using(key);
        if (!_.has(this._priorities, priority)) {
            this._priorities[priority] = [];
        }
        this._priorities[priority].push(key);

        return key;
    };

    /**
     * Remove content
     * @param {*} content
     * @param {number} priority
     * @returns {boolean}
     */
    Priority.prototype.removeContent = function (content, priority) {
        var content_positions = this._content_manager.contentPositions(content, 'priority');
        var keys = _.pluck(content_positions, 'key');

        if (priority) {
            if (this.hasPriority(priority)) {
                return this.removeKey(_.intersection(keys, this._priorities[priority]));
            }
            return false;
        }

        return this.removeKey(keys);
    };

    Priority.prototype.removeKey = function (key) {
        var self = this, removed;

        removed = _.pluck(this._content_manager.remove(key), 'key');
        _.each(Object.keys(this._priorities), function (tmp_priority) {
            self._priorities[tmp_priority] = _.difference(self._priorities[tmp_priority], removed);
        });

        return removed;
    };

    /**
     * Get priority data
     * @param {boolean} [content_only = false] return priority content only, default get content and meta
     * @returns {Array}
     */
    Priority.prototype.getContents = function (content_only) {
        var contents = [],
            priority_keys = Object.keys(this._priorities),
            self = this,
            raw_contents = this._content_manager.getType('priority');

        priority_keys.sort(M.SORT_NUMBER);

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

    M.Priority = Priority;


    /*
     |--------------------------------------------------------------------------
     | WAITER
     |--------------------------------------------------------------------------
     |
     | Waiter manager
     |
     */


    var _waiters = {};
    /**
     * Callback listener system
     * @module WAITER
     * @memberOf MaDnh
     * @type {{}}
     */
    M.WAITER = M.defineObject({
        /**
         * Check if a callback is exists
         * @param {string} waiterKey
         */
        has: function (waiterKey) {
            return _.has(_waiters, waiterKey);
        },

        /**
         * Add callback
         * @param {(string|function)} runner Callback
         * @param {boolean} [once = true] Waiter is run only one time
         * @param {string} [description = ''] Waiter description
         * @returns {(string|number)}
         */
        add: function (runner, once, description) {
            var key = M.nextID('waiter_key_', true);

            _waiters[key] = {
                runner: runner,
                once: _.isUndefined(once) || Boolean(once),
                description: description || ''
            };

            return key;
        },

        /**
         * Similar to "add" but add waiter key to window as function
         * @param {(string|function)} runner Callback
         * @param {boolean} [once = true] Waiter is run only one time
         * @param {string} description Waiter description
         * @returns {(string|number)} Waiter key/function name
         */
        createFunc: function (runner, once, description) {
            var key = this.add(runner, once, description);
            var self = this;

            window[key] = function () {
                var args = [key].concat([slice.call(arguments)]);
                self.run.apply(self, args);
            };

            return key;
        },

        /**
         * Remove keys
         */
        remove: function () {
            var removed = [];
            var self = this;
            _.each(_.flatten(_.toArray(arguments)), function (tmp_key) {
                if (self.has(tmp_key)) {
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
         * @param {string} waiterKey
         * @param {Array} args
         * @param {Object} thisArg
         * @returns {*}
         */
        run: function (waiterKey, args, thisArg) {
            var result = false;

            if (this.has(waiterKey)) {
                var waiter = _waiters[waiterKey];

                result = waiter.runner.apply(thisArg || null, M.asArray(args));
                if (waiter.once) {
                    this.remove(waiterKey);
                }
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


    /*
     |--------------------------------------------------------------------------
     | EVENT EMITTER
     |--------------------------------------------------------------------------
     */

    M.defineConstant({
        EVENT_EMITTER_EVENT_LIMIT_LISTENERS: 10,
        EVENT_EMITTER_EVENT_UNLIMITED: -1

    });

    /**
     * Event management system
     * @module EventEmitter
     * @extend BaseConstructor
     * @memberOf MaDnh
     * @interface
     */
    function EventEmitter(limit) {
        BaseConstructor.call(this);

        /**
         *
         * @type {{M.Priority}}
         * @private
         */
        this._events = {};

        this._event_emitted = {};

        this._limit = (limit || M.EVENT_EMITTER_EVENT_LIMIT_LISTENERS) + 0;

        this._event_followers = {};

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
        this._event_privates = [];
    }

    /**
     * Reset events
     * @param {string} [event = undefined] Special event to reset
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
     * @param event
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
        this._limit = M.EVENT_EMITTER_EVENT_UNLIMITED;
    };

    /**
     * Add event listener
     * @param {string} event Event name
     * @param {(string|function|Array)} listeners Event listener
     * @param {object} option Option is object with keys:
     * priority (M.PRIORITY_DEFAULT),
     * times (-1 - forever) - call times,
     * context (this event emitter instance) - context for callback,
     * key (auto increment of key: event_emitter_key_) - listener key. Useful when remove listener
     * @returns {string|boolean|null} Listener key or false on fail
     */
    EventEmitter.prototype.addListener = function (event, listeners, option) {
        var self = this;
        if (M.isNumeric(option)) {
            option = {
                priority: option
            }
        }

        option = _.defaults(option || {}, {
            priority: M.PRIORITY_DEFAULT,
            times: -1,
            context: null,
            key: null,
            async: false
        });
        listeners = M.asArray(listeners);
        if (!this._events.hasOwnProperty(event)) {
            this._events[event] = {
                priority: new M.Priority(),
                key_mapped: {}
            };
        } else if (this._limit != M.EVENT_EMITTER_EVENT_UNLIMITED) {
            var status = this._events[event].priority.status();

            if (status.contents + listeners.length > this._limit) {
                console.warn('Possible _.M.EventEmitter memory leak detected. '
                    + (status.contents + listeners.length) + ' listeners added (limit is ' + this._limit
                    + '). Use emitter.limit() or emitter.unlimited to resolve this warning.'
                );
            }
        }


        if (listeners.length) {
            if (option.key === null) {
                option.key = _.M.nextID('event_emitter_listener_', true);
            }
            var keys = [];
            M.loop(listeners, function (listener) {
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
            if (!_.has(this._events[event].key_mapped, option.key)) {
                this._events[event].key_mapped[option.key] = keys;
            } else {
                this._events[event].key_mapped[option.key] = this._events[event].key_mapped[option.key].concat(keys);
            }

            return option.key;
        }

        return false;
    };

    /**
     * Alias of this "addListener" method
     */
    EventEmitter.prototype.on = function (event, listener, option) {
        return this.addListener.apply(this, arguments);
    };

    /**
     * Add once time listener
     * @param event
     * @param listener
     * @param option
     * @returns {string}
     */
    EventEmitter.prototype.addOnceListener = function (event, listener, option) {
        if (M.isNumeric(option)) {
            option = {
                priority: option,
                times: 1
            }
        } else if (!_.isObject(option)) {
            option = {
                times: 1
            };
        }


        return this.addListener(event, listener, option);
    };

    /**
     * Alias of 'addOnceListener'
     */
    EventEmitter.prototype.once = function (event, listener, option) {
        return this.addOnceListener.apply(this, arguments);
    };

    EventEmitter.prototype.addListeners = function (events) {
        var events_arr = [], self = this;

        if (_.isObject(events)) {
            _.each(events, function (event_cbs, event_name) {
                event_cbs = M.asArray(event_cbs);
                _.each(event_cbs, function (event_cb) {
                    event_cb = M.asArray(event_cb);
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
        var self = this,
            emitted = false;

        events = M.asArray(events);

        for (var i in events) {
            if (events.hasOwnProperty(i)) {
                var event = events[i];

                if (this._events.hasOwnProperty(event)) {
                    var listeners = this._events[event].priority.getContents(),
                        thisFunc = arguments.callee;

                    if (listeners.length) {
                        emitted = true;
                        _.each(listeners, function (listener) {
                            if (listener.meta.async) {
                                M.async(listener.content, data, listener.meta.context || self);
                            } else {
                                M.callFunc(listener.meta.context || self, listener.content, data);
                            }
                        });
                    }
                }

                if (emitted) {
                    if (!this._event_emitted.hasOwnProperty(event)) {
                        this._event_emitted[event] = 1;
                    } else {
                        this._event_emitted[event] += 1;
                    }

                    if (final_cb) {
                        final_cb.call(this);
                    }

                    if (event !== 'event_emitted') {
                        thisFunc.call(self, 'event_emitted', [event, data]);
                    }
                }

                if ('event_emitted' !== event && -1 == this._event_privates.indexOf(event) && !_.isEmpty(this._event_followers)) {
                    _.each(this._event_followers, function (eventEmitterAttached) {
                        function cb(source_id, source_event, source_data) {
                            eventEmitterAttached.target.notice(source_id, source_event, source_data);
                        }

                        if (eventEmitterAttached.async) {
                            M.async(cb, [self.id, event, data], self);
                        } else {
                            M.callFunc(self, cb, [self.id, event, data]);
                        }

                    });
                }
            }
        }
    };

    /**
     * Alias of 'emitEvent'
     */
    EventEmitter.prototype.emit = function () {
        return this.emitEvent.apply(this, arguments);
    };

    /**
     * Remove listener by key
     * @param {string|Function|Array} key_or_listener Listener key or listener it self
     * @param {number} [priority=M.PRIORITY_DEFAULT]
     */
    EventEmitter.prototype.removeListener = function (key_or_listener, priority) {
        var self = this;
        key_or_listener = M.asArray(key_or_listener);
        _.each(key_or_listener, function (remover) {
            if (M.isLikeString(remover)) {
                _.each(Object.keys(self._events), function (event_name) {
                    if (_.has(self._events[event_name].key_mapped, remover)) {
                        self._events[event_name].priority.removeKey(self._events[event_name].key_mapped[remover]);
                        delete self._events[event_name].key_mapped[remover];

                        if (self._events[event_name].priority.status().contents == 0) {
                            delete self._events[event_name];
                        }
                    }
                });
            } else if (_.isFunction(remover)) {
                priority = priority || M.PRIORITY_DEFAULT;
                _.each(Object.keys(self._events), function (event_name) {
                    self._events[event_name].priority.removeContent(remover, priority);

                    if (self._events[event_name].priority.status().contents == 0) {
                        delete self._events[event_name];
                    }
                });
            } else {
                throw new Error('Invalid remover, it must be key of added listener or listener it self');
            }
        });
    };

    /**
     * Alias of 'removeListener'
     */
    EventEmitter.prototype.off = function () {
        return this.removeListener.apply(this, arguments);
    };

    /**
     * Attach other event emitter to this
     * @param {EventEmitter} eventEmitter
     * @param {Array} [only]
     * @param {Array} [excepts]
     * @param {boolean} [async=true] notice target EventEmitter async. Default is true
     * @returns {boolean}
     */
    EventEmitter.prototype.attach = function (eventEmitter, only, excepts, async) {
        if (M.isEventEmitter(eventEmitter)) {
            if (!this._event_followers.hasOwnProperty(eventEmitter.id)) {
                this._event_followers[eventEmitter.id] = {
                    target: eventEmitter,
                    async: _.isUndefined(async) || Boolean(async)
                };
                this.emitEvent('attach', [eventEmitter, only, excepts]);
                eventEmitter.attachTo(this, only, excepts);
            }
            return true;
        }

        throw new Error('Invalid EventEmitter instance');
    };
    EventEmitter.prototype.attachHard = function (eventEmitter, only, excepts) {
        this.attach(eventEmitter, only, excepts, false);
    };

    /**
     * Attach this to other event emitter instance
     * @param {EventEmitter} eventEmitter
     * @param {Array} [only]
     * @param {Array} [excepts]
     * @param {boolean} [hard=false] Hard attach to other, other notice will call immediate. Default is false
     * @returns {boolean}
     */
    EventEmitter.prototype.attachTo = function (eventEmitter, only, excepts, hard) {
        if (!M.isEventEmitter(eventEmitter)) {
            throw new Error('Invalid EventEmitter instance');
        }
        if (!this._event_following.hasOwnProperty(eventEmitter.id)) {
            this._event_following[eventEmitter.id] = {
                id: eventEmitter.id,
                type: eventEmitter.constructor.name,
                only: M.asArray(only || []),
                excepts: M.asArray(excepts || [])
            };
            this.emitEvent('attached', [eventEmitter, only, excepts]);
            if (hard) {
                return eventEmitter.attachHard(this);
            }

            return eventEmitter.attach(this);
        }
        return true;
    };
    EventEmitter.prototype.attachHardTo = function (eventEmitter, only, excepts) {
        this.attachTo(eventEmitter, only, excepts, true);
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
                M.loop([eventName, info.type + '.*', info.type + '.' + eventName], function (mimic_event_name) {
                    if (-1 != self._event_mimics.indexOf(mimic_event_name)) {
                        mimic = mimic_event_name;
                        self.emitEvent(eventName, data);

                        return 'break';
                    }
                });


                this.emitEvent(mimic ? _.omit(notices, mimic) : notices, [data, _.clone(notice_data)]);
            }
        }
    };

    /**
     * Detach followed event emitter
     * @param {EventEmitter} eventEmitter
     * @returns {boolean}
     */
    EventEmitter.prototype.detach = function (eventEmitter) {
        if (M.isEventEmitter(eventEmitter)) {
            if (this._event_followers.hasOwnProperty(eventEmitter.id)) {
                this.emitEvent('detach', [eventEmitter]);
                delete this._event_followers[eventEmitter.id];
                eventEmitter.detachFrom(this);
            }

            return true;
        }

        throw new Error('Invalid EventEmitter instance');
    };

    /**
     * Detach following event emitter
     * @param {EventEmitter} eventEmitter
     * @returns {boolean}
     */
    EventEmitter.prototype.detachFrom = function (eventEmitter) {
        if (M.isEventEmitter(eventEmitter)) {
            if (this._event_following.hasOwnProperty(eventEmitter.id)) {
                this.emitEvent('detached', [eventEmitter]);
                delete this._event_following[eventEmitter.id];
                eventEmitter.detach(this);
            }

            return true;
        }

        throw new Error('Invalid EventEmitter instance');
    };


    M.EventEmitter = EventEmitter;

    /**
     * Check if object is instance of Event Emitter
     * @param {object} object
     * @returns {boolean}
     */
    M.isEventEmitter = function (object) {
        if (_.isObject(object)) {
            return object instanceof EventEmitter;
        }

        return false;
    };


    /*
     |--------------------------------------------------------------------------
     | CACHE
     |--------------------------------------------------------------------------
     |
     | Cache manager
     |
     */

    M.defineConstant({
        CACHE_MIN: 10,//10 second
        CACHE_TINY: 60,//1 minute
        CACHE_SHORT: 5 * 60,//5 minutes
        CACHE_MEDIUM: 10 * 60,//10 minutes
        CACHE_LONG: 60 * 60,//1 hour
        CACHE_FOREVER: true //forever
    });

    var _cache_data = {};
    var _clean_interval_time = M.CACHE_SHORT;
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
            if (_cache_data[name].expire_time === true || (_cache_data[name].expire_time - 1) > M.nowSecond()) {
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
     * @param {number} [live_time]
     * @private
     */
    function _set_cache(name, value, live_time) {
        if (_.isUndefined(live_time) || !M.isNumeric(Number(live_time))) {
            live_time = M.CACHE_MEDIUM;
        }
        _cache_data[name] = {
            value: value,
            live_time: live_time,
            expire_time: live_time === true ? true : M.nowSecond() + live_time
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
        var live_time = M.CACHE_MEDIUM;
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
            new_value.push(value);
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
        if (_.isUndefined(value) || !M.isNumeric(Number(value))) {
            value = 1;
        }
        if (_.isUndefined(addMode)) {
            addMode = true;
        }
        if (addMode === false) {
            value *= -1;
        }

        if (!_has_cache(name)) {
            _set_cache(name, value);
        } else {
            var old_detail = _cache_data[name];
            var old_value = Number(old_detail.value);

            if (!M.isNumeric(old_value)) {
                old_value = 0;
            }
            old_value += value;
            _set_cache(name, old_value, old_detail.live_time);
        }
        return _cache_data[name].value;
    }

    /**
     * Clean expired caches
     * @private
     */
    function _clean_cache() {
        var removes = [];
        var now_second = M.nowSecond();
        _.each(_cache_data, function (data, name) {
            if (data.expire_time !== true && data.expire_time <= now_second) {
                removes.push(name);
            }
        });
        _expire_cache(removes);
    }

    //Clean cache every 30 seconds
    _clean_interval = setInterval(_clean_cache, _clean_interval_time * 1000);

    /**
     * Cache management system
     * @module CACHE
     * @memberOf MaDnh
     */
    M.CACHE = M.defineObject({
        /**
         * Add cache
         * @param {string} name
         * @param {*} value
         * @param {number} [live_time = M.CACHE_MEDIUM]
         */
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
         * @returns {*}
         */
        get: function (name) {
            if (_.has(_cache_data, name)) {
                if (_cache_data[name].expire_time === true || _cache_data[name].expire_time > M.nowSecond()) {
                    return _cache_data[name].value;
                }
                delete _cache_data[name];
            }
        },

        /**
         * Add live time
         * @param {string} name
         * @param {number} [live_time] Default is cached live time
         */
        touch: function (name, live_time) {
            if (this.has(name) && _cache_data[name].expire_time !== true) {
                if (!M.isNumeric(live_time)) {
                    live_time = _cache_data[name].live_time;
                }
                _cache_data[name].expire_time += live_time;
            }
        },

        /**
         * Get valid caches
         * @param {boolean} [name_only = true] Include cache value or not? default is true
         * @returns {*}
         */
        list: function (name_only) {

            /**
             * @type {({}|Array)}
             */
            var result;
            var now_second = M.nowSecond();

            /**
             * @type {function}
             */
            var addItem;
            if (name_only) {
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
            _expire_cache(slice.apply(arguments));
        },

        /**
         * Get or set clean expired caches interval time.
         * @param time
         * @returns {number}
         */
        cleanIntervalTime: function (time) {
            if (M.isNumeric(time)) {
                _clean_interval_time = M.minMax(parseInt(time), M.CACHE_MIN, M.CACHE_LONG);
                clearInterval(_clean_interval);
                _clean_interval = setInterval(_clean_cache, _clean_interval_time * 1000);
            }
            return _clean_interval_time;
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
            if (_.isUndefined(value)) {
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
            if (_.isUndefined(value)) {
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


    /*
     |--------------------------------------------------------------------------
     | App
     |--------------------------------------------------------------------------
     */

    function App() {
        EventEmitter.call(this);

        this._event_privates = ['init'];

        this.options = {};

        this.plugins = {};
    }

    M.inherit(App, EventEmitter);

    /**
     * Option this app
     * @param option
     * @param value
     */
    App.prototype.option = function (option, value) {
        this.options = M.setup.apply(M, [this.options].concat(Array.prototype.slice.apply(arguments)));
    };

    /**
     * Get cloned version of this options
     * @returns {{}}
     */
    App.prototype.getOptions = function () {
        return _.clone(this.options);
    };

    /**
     * Add init callback
     * @param callback
     * @param {number} [priority]
     */
    App.prototype.onInit = function (callback, priority) {
        this.once('init', callback, priority);
    };

    /**
     * Init App
     */
    App.prototype.init = function () {
        this.emitEvent('init');
        this.resetEvents('init');
    };

    /**
     * Add jQuery Plugin callback
     * @param {function} callback Callback, call arguments are: dom, options
     * @param {string} [name] plugin name, default is unique id
     * @returns {string} Name of plugin
     */
    App.prototype.addPlugin = function (callback, name) {
        if (!name) {
            name = M.nextID('plugin_');
        }

        this.plugins[name] = callback;

        return name;
    };

    /**
     * Remove plugin
     * @param {string} [name]
     * @returns {boolean}
     */
    App.prototype.removePlugin = function (name) {
        var self = this;

        name = _.flatten(_.toArray(arguments));
        _.each(name, function (tmp_name) {
            delete self.plugins[tmp_name];
        });
    };

    /**
     * Apply plugin on dom
     * @param {string|Element} [selector_or_dom = body] selector or DOM or jQuery DOM
     * @param {Array} [plugins] Name of plugins
     * @param {object} [options]
     */
    App.prototype.applyPlugin = function (selector_or_dom, plugins, options) {
        var self = this;

        if (!selector_or_dom) {
            selector_or_dom = $('body');
        } else if (_.isString(selector_or_dom)) {
            selector_or_dom = $(selector_or_dom);
        }

        if (!plugins) {
            plugins = Object.keys(this.plugins);
        }

        if (!_.isObject(options)) {
            options = {};
        }

        _.each(plugins, function (plugin) {
            M.async(self.plugins[plugin], [selector_or_dom, _.has(options, plugin) ? options[plugins] : {}], null);
        });
    };

    var app_instance = new App();
    _.module('App', app_instance);

    /*
     |--------------------------------------------------------------------------
     | AJAX
     |--------------------------------------------------------------------------
     |* Each AJAX instance when request complete will notice App instance "ajax_complete" event, with arguments are:
     | - jqXHR: jQuery AJAX object
     | - textStatus: "success", "notmodified", "nocontent", "error", "timeout", "abort", or "parsererror"
     |
     */

    M.defineConstant({
        AJAX_INVALID_RESPONSE_ADAPTER_OPTION: 'ajax_invalid_response_adapter_option',
        AJAX_ERROR_RESPONSE_ADAPTER_NOT_FOUND: 'ajax_response_adapter_not_found',
        AJAX_ERROR_INVALID_RESPONSE_ADAPTER: 'ajax_invalid_response_adapter'
    });

    var response_adapters = {},
        request_data_adapters = {},
        ajax_global_option = {};

    function AJAXResponseAdapter() {
        this.type_prefix = 'ajax_response_adapter';
        BaseConstructor.call(this);

        this.options = {};
        this.is_error = false;
        this.error = {
            code: 0,
            message: ''
        };

        this.is_success = true;
        this.response = null;
    }

    /**
     *
     * @param {function} constructor AJAXResponseAdapter constructor
     */
    AJAXResponseAdapter.registerResponseAdapter = function (constructor) {
        if (_.isFunction(constructor) && constructor.name) {
            response_adapters[constructor.name] = constructor;

            return true;
        }

        return false;
    };
    AJAXResponseAdapter.responseAdapters = function () {
        return Object.keys(response_adapters);
    };

    /**
     *
     * @param name
     * @param {Function} callback Callback receive arguments: request data, request options, AJAX instance
     * @returns {boolean}
     */
    AJAXResponseAdapter.registerDataAdapter = function (name, callback) {
        if (_.isFunction(callback)) {
            request_data_adapters[name] = callback;

            return true;
        }

        return false;
    };
    AJAXResponseAdapter.dataAdapters = function () {
        return Object.keys(request_data_adapters);
    };


    AJAXResponseAdapter.prototype.option = function (options) {
        _.extend(this.options, options);
    };
    AJAXResponseAdapter.prototype.process = function (data) {
        this.response = data;
    };


    /**
     *
     * @param options
     * @constructor
     */
    function AJAX(options) {
        EventEmitter.call(this);

        this.options = {
            response_adapters: [],
            data_adapters: []
        };
        this.jqXHR = null;
        this.last_before_send_cb = null;

        if (_.isObject(options)) {
            this.option(options);
        }
    }

    M.inherit(AJAX, EventEmitter);

    AJAX.globalOption = function (option, value) {
        ajax_global_option = M.setup.apply(M, [ajax_global_option].concat(slice.apply(arguments)));
    };

    /**
     *
     * @param option
     * @param {*} [default_value = undefined]
     * @returns {*}
     */
    AJAX.getGlobalOption = function (option, default_value) {
        if (arguments.length == 0) {
            return _.clone(ajax_global_option);
        }
        option += '';

        if (ajax_global_option.hasOwnProperty(option)) {
            return _.clone(ajax_global_option[option]);
        }

        return default_value;
    };

    AJAX.prototype.option = function (option, value) {
        this.options = M.setup.apply(M, [this.options].concat(slice.apply(arguments)));

        return this;
    };

    /**
     * Add success callback. Callback arguments:
     * - response: last response after processed by AJAXResponseAdapters
     * - responses: response of each AJAXResponseAdapter
     *
     * @param callback
     * @returns {AJAX}
     */
    AJAX.prototype.then = function (callback) {
        this.on('then', callback);

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
    AJAX.prototype.catch = function (callback) {
        this.on('catch', callback);

        return this;
    };

    /**
     * Add finally callback
     * callback with arguments
     * - jqXHR: jQuery AJAX object
     * - textStatus: "success", "notmodified", "nocontent", "error", "timeout", "abort", or "parsererror"
     *
     * @param callback
     * @returns {AJAX}
     */
    AJAX.prototype.finally = function (callback) {
        this.on('finally', callback);

        return this;
    };

    function _ajax_success_cb(response) {
        var responses = {
            raw: _.clone(response)
        };

        if (!_.isEmpty(this.options.response_adapters)) {
            var error = null;

            M.loop(this.options.response_adapters, function (adapter_options, adapter_name) {
                if (response_adapters.hasOwnProperty(adapter_name)) {
                    try {
                        var adapter = new response_adapters[adapter_name]();
                    } catch (e) {
                    }

                    if (adapter instanceof AJAXResponseAdapter) {
                        if (_.isObject(adapter_options) && !_.isEmpty(adapter_options)) {
                            adapter.option(adapter_options);
                        }

                        adapter.process(response);

                        if (adapter.is_error) {
                            error = adapter.error;
                            return 'break';
                        }

                        response = adapter.response;
                        responses[adapter_name] = _.clone(response);

                        return;
                    } else {
                        error = {
                            code: M.AJAX_ERROR_INVALID_RESPONSE_ADAPTER,
                            message: 'Invalid AJAX response adapter'
                        };
                    }
                } else {
                    error = {
                        code: M.AJAX_ERROR_RESPONSE_ADAPTER_NOT_FOUND,
                        message: 'AJAX response adapter not found'
                    };
                }

                return 'break';
            });

            if (error) {
                this.emitEvent('catch', [error.message, error.code]);

                return;
            }
        }

        this.emitEvent('then', [response, responses]);
    }

    function _ajax_error_cb(jqXHR, textStatus, errorThrown) {
        var err_result = {
            code: M.firstNotEmpty(textStatus, jqXHR.statusText, jqXHR.status),
            message: 'Ajax error'
        };

        switch (textStatus) {
            case 'parsererror':
                err_result.message = 'Parse response failed';
                break;

            case 'abort':
                err_result.message = 'Manual abort request';
                break;

            default:
                switch (jqXHR.statusText) {
                    case 'timeout':
                        err_result.message = 'Request timeout';
                        break;
                    case 'error':
                        switch (jqXHR.status) {
                            case 403:
                                err_result.message = 'Invalid request path';
                                break;
                            case 404:
                                err_result.message = 'Request path not found';
                        }
                        break;
                }
        }

        this.emitEvent('catch', [err_result.message, err_result.code]);
    }

    function _ajax_complete_cb(jqXHR, textStatus) {
        this.emitEvent('finally', [jqXHR, textStatus]);

        app_instance.emitEvent('ajax_complete', [this, jqXHR, textStatus]);
    }

    function _ajax_get_request_data(options) {
        if (options.data_adapters) {
            if (!_.isObject(options.data)) {
                options.data = {};
            }

            var adapters = _.clone(options.data_adapters);
            var adapter_name;
            var data = _.clone(options.data);

            while (adapter_name = adapters.shift()) {
                if (request_data_adapters.hasOwnProperty(adapter_name)) {
                    if (_.isFunction(request_data_adapters[adapter_name])) {
                        data = request_data_adapters[adapter_name](data, options, this);
                    } else {
                        throw new Error('Request data adapter must be a function: ' + adapter_name);
                    }
                } else {
                    throw new Error('Request data adapter name not found: ' + adapter_name);
                }
            }

            options.data = _.clone(data);
        }
    }

    AJAX.prototype.request = function (options) {
        var last_options = _.extend({}, ajax_global_option, this.options, options);

        if (last_options.hasOwnProperty('beforeSend')) {
            this.last_before_send_cb = last_options.beforeSend;
        }
        if (last_options.hasOwnProperty('success')) {
            this.removeListener('listener_success');
            this.addListener('then', last_options['success'], {
                priority: M.PRIORITY_HIGHEST,
                key: 'listener_success'
            })
        }
        if (last_options.hasOwnProperty('error')) {
            this.removeListener('listener_error');
            this.addListener('catch', last_options['error'], {
                priority: M.PRIORITY_HIGHEST,
                key: 'listener_error'
            })
        }
        if (last_options.hasOwnProperty('complete')) {
            this.removeListener('listener_complete');
            this.addListener('finally', last_options['complete'], {
                priority: M.PRIORITY_HIGHEST,
                key: 'listener_complete'
            })
        }

        last_options['success'] = _ajax_success_cb.bind(this);
        last_options['error'] = _ajax_error_cb.bind(this);
        last_options['complete'] = _ajax_complete_cb.bind(this);
        last_options['beforeSend'] = function (jqXHR, settings) {
            var result = true;

            if (_.isFunction(this.last_before_send_cb)) {
                result = M.callFunc(this, this.last_before_send_cb, [jqXHR, settings]);
            }

            this.abort();
            if (result) {
                this.emitEvent('request');
            }

            return result;
        }.bind(this);


        _ajax_get_request_data.call(this, last_options);

        this.jqXHR = $.ajax(last_options);

        return this.jqXHR;
    };

    /**
     * Abort current request
     * Emit events
     * - abort: before call real abort on jqXHR
     */
    AJAX.prototype.abort = function () {
        if (_.isObject(this.jqXHR) && this.jqXHR.abort) {
            this.emitEvent('abort');
            this.jqXHR.abort();
        }
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
     * Check if instance is requesting
     * @returns {boolean}
     */
    AJAX.prototype.isRequesting = function () {
        var status = this.status();

        return status !== false && status >= 1 && status <= 3;
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
     * Check if instance is done
     * @returns {boolean}
     */
    AJAX.prototype.isDone = function () {
        return this.status() === 4;
    };

    M.AJAXResponseAdapter = AJAXResponseAdapter;
    M.AJAX = AJAX;

})(_);