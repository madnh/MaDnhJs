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
     */
    function Priority() {
        /**
         * Data holder
         * @type {_.M.ContentManager}
         * @private
         */
        this._content_manager = new _.M.ContentManager();
        /**
         * Priority number and keys
         * @type {{}}
         * @private
         */
        this._priorities = {};
    }

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
        return this._content_manager.has(key);
    };
    /**
     * Check if a content has exists
     * @param {*} content
     * @returns {boolean}
     */
    Priority.prototype.hasContent = function (content) {
        return this._content_manager.hasContent(content, 'priority')
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
    Priority.prototype.addContent = function (content, priority, meta) {
        var key = this._content_manager.add(content, meta, 'priority');

        this._content_manager.using(key);
        priority = _.M.beNumber(priority, _.M.PRIORITY_DEFAULT);

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
        if (priority && !this.hasPriority(priority)) {
            return false;
        }

        var content_positions = this._content_manager.contentPositions(content, 'priority');
        var keys = _.pluck(content_positions, 'key');

        if (priority) {
            return this.remove(_.intersection(keys, this._priorities[priority]));
        }

        return this.remove(keys);
    };

    /**
     * Remove content by keys
     * @param {string|string[]} keys
     * @returns {*} Removed content
     */
    Priority.prototype.remove = function (keys) {
        var self = this, removed;

        removed = _.pluck(this._content_manager.remove(keys), 'key');

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

        priority_keys.sort(_.M.SORT_NUMBER);

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

    /**
     *
     * @type {_.M.Priority}
     */
    _.M.Priority = Priority;
})(_);