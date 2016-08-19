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