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
            var key = _.M.nextID('waiter_key_', true);

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
                var args = [key].concat([Array.prototype.slice.call(arguments)]);
                self.run.apply(self, args);
            };

            return key;
        },

        /**
         * Remove keys by arguments
         * @returns {Array} Removed waiters
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

                result = waiter.runner.apply(thisArg || null, _.M.asArray(args));
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
})(_);