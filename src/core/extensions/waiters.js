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
            return _.has(_waiters, waiter_key);
        },

        /**
         * Add callback
         * @param {(string|function)} callback Callback
         * @param {boolean} [once = true] Waiter is run only one time
         * @param {string} [description = ''] Waiter description
         * @returns string Callback key
         */
        add: function (callback, once, description) {
            var key = _.M.nextID('waiter_key', true);

            _waiters[key] = {
                callback: callback,
                once: _.isUndefined(once) || Boolean(once),
                description: description || ''
            };

            return key;
        },

        /**
         * Similar to "add" but add waiter key to window as function
         * @param {(string|function)} callback Callback
         * @param {boolean} [once = true] Waiter is run only one time
         * @param {string} [description] Waiter description
         * @returns {(string|number)} Waiter key/function name
         */
        createFunc: function (callback, once, description) {
            var key = this.add(callback, once, description);
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
         * @param {string} waiter_key
         * @param {Array} args
         * @param {Object} this_arg
         * @returns {*}
         */
        run: function (waiter_key, args, this_arg) {
            var result = false;

            if (this.has(waiter_key)) {
                var waiter = _waiters[waiter_key];

                result = waiter.callback.apply(this_arg || null, _.M.beArray(args));
                if (waiter.once) {
                    this.remove(waiter_key);
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