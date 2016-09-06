/**
 * Priority
 * @module _.M.Priority
 * @memberOf _.M
 * @requires _.M.ContentManager
 */
;(function (_) {

    _.M.defineConstant({
        /**
         * @name _.M.PRIORITY_HIGHEST
         * @constant {number}
         * @default
         */
        PRIORITY_HIGHEST: 100,
        /**
         * @name _.M.PRIORITY_HIGH
         * @constant {number}
         * @default
         */
        PRIORITY_HIGH: 250,
        /**
         * @name _.M.PRIORITY_DEFAULT
         * @constant {number}
         * @default
         */
        PRIORITY_DEFAULT: 500,
        /**
         * @name _.M.PRIORITY_LOW
         * @constant {number}
         * @default
         */
        PRIORITY_LOW: 750,
        /**
         * @name _.M.PRIORITY_LOWEST
         * @constant {number}
         * @default
         */
        PRIORITY_LOWEST: 1000,

        /**
         * @name _.M.PRIORITY_LEVEL_1
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_1: 100,

        /**
         * @name _.M.PRIORITY_LEVEL_2
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_2: 200,

        /**
         * @name _.M.PRIORITY_LEVEL_3
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_3: 300,

        /**
         * @name _.M.PRIORITY_LEVEL_4
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_4: 400,

        /**
         * @name _.M.PRIORITY_LEVEL_5
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_5: 500,

        /**
         * @name _.M.PRIORITY_LEVEL_6
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_6: 600,

        /**
         * @name _.M.PRIORITY_LEVEL_7
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_7: 700,
        /**
         * @name _.M.PRIORITY_LEVEL_8
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_8: 800,

        /**
         * @name _.M.PRIORITY_LEVEL_9
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_9: 900,
        /**
         * @name _.M.PRIORITY_LEVEL_10
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_10: 1000
    });

    /**
     * Manage contents with priority
     * @class _.M.Priority
     * @extends _.M.ContentManager
     */
    function Priority() {
        _.M.ContentManager.call(this);

        /**
         * Priority number and keys
         * @type {{}}
         * @private
         */
        this._priorities = {};

        /**
         * key => priority
         * @type {{}}
         * @private
         */
        this._key_mapped = {};
    }
    _.M.inherit(Priority, _.M.ContentManager);

    /**
     * Check if a priority is exists
     * @param priority
     * @returns {boolean}
     */
    Priority.prototype.hasPriority = function (priority) {
        return this._priorities.hasOwnProperty(priority);
    };

    /**
     * Check if a key is exists
     * @param {string} key
     * @returns {*|boolean}
     */
    Priority.prototype.has = function (key) {
        return this._key_mapped.hasOwnProperty(key);
    };

    /**
     * Get status about number of priorities and contents
     * @returns {{priorities: number, contents: number}}
     */
    Priority.prototype.status = function () {
        var priorities = Object.keys(this._priorities),
            result = {
                priorities: priorities.length,
                contents: 0
            },
            self = this;

        priorities.forEach(function (priority) {
            result.contents += self._priorities[priority].length;
        });

        return result;
    };

    /**
     * Add content
     * @param {*} content
     * @param {number} [priority = _.M.PRIORITY_DEFAULT]
     * @param {*} [meta] Content meta info
     * @returns {(string|boolean)} content key
     */
    Priority.prototype.add = function (content, priority, meta) {
        var key = this._super.add.call(this, content, meta, 'priority');

        this.using(key);
        priority = _.M.beNumber(priority, _.M.PRIORITY_DEFAULT);

        if (!_.has(this._priorities, priority)) {
            this._priorities[priority] = [];
        }

        this._priorities[priority].push(key);
        this._key_mapped[key] = priority;

        return key;
    };

    /**
     * Remove content by keys
     * @param {string|string[]} keys
     * @param {number|number[]} [priorities] Special priorities, default is all priorities
     * @returns {string[]} Removed content
     */
    Priority.prototype.remove = function (keys, priorities) {
        var removed  = remove_keys.apply(null, [this].concat(_.toArray(arguments)));

        return _.pluck(this._super.remove.call(this, removed), 'key');
    };

    /**
     *
     * @param instance
     * @param {string[]} keys
     * @param {number[]} priorities
     */
    function get_valid_priorities_by_keys(instance, keys, priorities) {
        var priorities_and_keys = _.M.invertToArray(_.pick(instance._key_mapped, _.M.beArray(keys))),
            priorities_from_keys_casted = _.M.castItemsType(Object.keys(priorities_and_keys), 'number');

        if (!priorities) {
            priorities = priorities_from_keys_casted;
        } else {
            priorities = _.intersection(_.M.castItemsType(_.M.beArray(priorities), 'number'), priorities_from_keys_casted);
        }
        priorities = get_valid_priorities(instance, priorities);

        return _.mapObject(_.pick(instance._priorities, priorities), function (priority_keys, priority) {
            return _.intersection(priorities_and_keys[priority], priority_keys);
        });
    }
    /**
     *
     * @param {Priority} instance
     * @param {number[]} priorities
     * @return {number[]}
     */
    function get_valid_priorities(instance, priorities) {
        return _.intersection(_.M.castItemsType(priorities, 'number'), _.M.castItemsType(Object.keys(instance._priorities), 'number'));
    }

    function remove_keys(instance, keys, priorities) {
        var priorities_with_keys = get_valid_priorities_by_keys(instance, keys, priorities),
            remove_keys;

        _.M.loop(priorities_with_keys, function (priority_keys, priority) {
            instance._priorities[priority] = _.without(instance._priorities[priority], priority_keys);
        });

        remove_keys = _.flatten(_.values(priorities_with_keys));
        _.M.removeKeys(instance._key_mapped, remove_keys);

        return remove_keys;
    }

    /**
     * Remove content
     * @param {*} content
     * @param {number|number[]} [priorities] Special priorities, default is all priorities
     * @returns {string[]}
     */
    Priority.prototype.removeContent = function (content, priorities) {
        var content_positions = this.contentPositions(content, 'priority'),
            keys = _.pluck(content_positions, 'key');

        if(!keys.length){
            return [];
        }
        if (priorities) {
            return this.remove(keys, priorities);
        }

        return this.remove(keys);
    };

    /**
     * Get priority data
     * @param {boolean} [content_only = false] return priority content only, default get content and meta
     * @returns {Array} List of objects with keys:
     * - key: content key
     * - meta: meta info
     * - content: content
     */
    Priority.prototype.export = function (content_only) {
        var contents = [],
            priority_keys = _.M.castItemsType(Object.keys(this._priorities), 'number'),
            self = this,
            raw_contents = this.getType('priority');

        priority_keys.sort(_.M.SORT_NUMBER);

        _.each(priority_keys, function (priority) {
            _.each(self._priorities[priority], function (key) {
                if (!raw_contents.hasOwnProperty(key)) {
                    return;
                }
                if (content_only) {
                    contents.push(raw_contents[key]['content']);
                } else {
                    contents.push(_.extend({key: key}, raw_contents[key]));
                }
            });
        });

        return contents;
    };

    /**
     *
     * @type {_.M.Priority}
     */
    _.M.Priority = Priority;
})(_);