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