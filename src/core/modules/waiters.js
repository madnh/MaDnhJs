/**
 * Callback listener system
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['lodash', 'madnh'], function (_, M) {
            return (root.Waiter = factory(_, M));
        });
    } else {
        // Browser globals
        root.Waiter = factory(root._, root.M);
    }
}(this, function (_, M) {
    var _waiters = {};

    var module = M.defineObject({
        /**
         * Check if a waiter key is exists
         * @param {string} waiter_key
         */
        has: function (waiter_key) {
            return _waiters.hasOwnProperty(waiter_key) && (!_.isNumber(_waiters[waiter_key].times) || _waiters[waiter_key].times > 0);
        },

        /**
         * Add callback
         * @param {(string|function)} callback Callback
         * @param {int|boolean} [times = true] Run times. Use true for forever
         * @param {string} [description = ''] Waiter description
         * @returns string Callback key
         */
        add: function (callback, times, description) {
            var key = M.nextID('waiter_key', true);

            if (_.isNumber(times)) {
                times = parseInt(times);

                if (_.isNaN(times) || !_.isFinite(times)) {
                    times = 1;
                } else {
                    times = Math.max(times, 1);
                }

            } else {
                times = true;
            }

            _waiters[key] = {
                callback: callback,
                times: times,
                description: description || ''
            };

            return key;
        },

        /**
         * Add once time callback
         * @param {(string|function)} callback Callback
         * @param {string} [description = ''] Waiter description
         * @returns string Callback key
         */
        addOnce: function (callback, description) {
            return this.add(callback, 1, description);
        },

        /**
         * Similar to "add" but add waiter key to window as function
         * @param {(string|function)} callback Callback
         * @param {int|boolean} [times = true] Run times. Use true for forever
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
         * Similar of method createFunc, once time
         * @param {(string|function)} callback Callback
         * @param {string} [description] Waiter description
         * @returns {(string|number)} Waiter key/function name
         */
        createFuncOnce: function (callback, description) {
            return this.createFunc(callback, 1, description);
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

            if (!this.has(waiter_key)) {
                throw new Error('Waiter key is non-exists: ' + waiter_key);
            }

            result = _waiters[waiter_key].callback.apply(this_arg || null, _.castArray(args));

            if (this.has(waiter_key) && _.isNumber(_waiters[waiter_key].times) && --_waiters[waiter_key].times < 1) {
                this.remove(waiter_key);
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
                return _.mapValues(_waiters, 'description');
            }

            return _.keys(_waiters);
        }
    });

    return module;
}));