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