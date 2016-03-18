/**
 * Priority
 * @module _.M.Priority
 * @memberOf _.M
 * @requires _.M.ContentManager
 */
;(function (_) {

    _.M.defineConstant({
        /**
         * @constant {number}
         * @default
         */
        PRIORITY_HIGHEST: 100,
        /**
         * @constant {number}
         * @default
         */
        PRIORITY_HIGH: 250,
        /**
         * @constant {number}
         * @default
         */
        PRIORITY_DEFAULT: 500,
        /**
         * @constant {number}
         * @default
         */
        PRIORITY_LOW: 750,
        /**
         * @constant {number}
         * @default
         */
        PRIORITY_LOWEST: 1000,
        /**
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_1: 100,
        /**
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_2: 200,
        /**
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_3: 300,
        /**
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_4: 400,
        /**
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_5: 500,
        /**
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_6: 600,
        /**
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_7: 700,
        /**
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_8: 800,
        /**
         * @constant {number}
         * @default
         */
        PRIORITY_LEVEL_9: 900,
        /**
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
        this._content_manager = new ContentManager();
        /**
         *
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
     * @param {number} [priority = _.M.PRIORITY_DEFAULT]
     * @param {*} [meta] Content meta info
     * @returns {(string|boolean)} content key
     */
    Priority.prototype.addContent = function (content, priority, meta) {
        if (_.isUndefined(priority)) {
            priority = _.M.PRIORITY_DEFAULT;
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

    /**
     * Remove content by keys
     * @param {string} key
     * @returns {*} Removed content
     */
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
     * @type {Priority}
     */
    _.M.Priority = Priority;
})(_);