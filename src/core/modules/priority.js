/**
 * Manage contents with priority
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['lodash', 'madnh'], function (_, M) {
            return (root.Priority = factory(_, M));
        });
    } else {
        // Browser globals
        root.Priority = factory(root._, root.M);
    }
}(this, function (_, M) {
    function Priority() {
        this._priorities = {};
        this._key_mapped = {};
    }

    M.defineConstant(Priority, {
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

    Priority.prototype.hasPriority = function (priority) {
        return this._priorities.hasOwnProperty(priority);
    };
    Priority.prototype.has = function (key) {
        return this._key_mapped.hasOwnProperty(key);
    };
    Priority.prototype.add = function (content, priority) {
        var key = M.nextID('priority_key'),
            index;

        if (!_.isNumber(priority)) {
            priority = Priority.PRIORITY_DEFAULT;
        }
        if (!this.hasPriority(priority)) {
            this._priorities[priority] = [];
        }

        index = this._priorities[priority].length;
        this._priorities[priority].push({
            content: content,
            key: key
        });
        this._key_mapped[key] = {
            priority: priority,
            index: index
        };

        return key;
    };

    /**
     * Find first key of content
     * @param {*} content
     * @param {boolean} [all = false]
     * @return {string|Array|boolean} Priority key(s) or false when not found
     */
    Priority.prototype.getKey = function (content, all) {
        var result = [],
            priorities = _.keys(this._priorities),
            priority, index, len, target_priority;

        while (priority = priorities.shift()) {
            target_priority = this._priorities[priority];

            for (index = 0, len = target_priority.length; index < len; index++) {
                if (target_priority[index].content === content) {
                    if (!all) {
                        return target_priority[index].key;
                    }

                    result.push(target_priority[index].key);
                }
            }
        }

        return result.length ? result : false;
    };

    Priority.prototype.addOnce = function (content, priority) {
        var key = this.getKey(content, false);

        if (false !== key) {
            return key;
        }

        return this.add(content, priority);
    };

    Priority.prototype.update = function (key, new_value) {
        var position;

        if (!this.has(key)) {
            return false;
        }

        position = this._key_mapped[key];
        this._priorities[position.priority][position.index] = new_value;

        return true;
    };

    Priority.prototype.remove = function (keys) {
        var self = this, removed = [];

        _.each(!_.isArray(keys) ? [keys] : keys, function (key) {
            var position = self._key_mapped[key];

            if (!position) {
                return;
            }

            delete self._key_mapped[key];
            self._priorities[position.priority][position.index] = undefined;
            removed.push(key);
        });

        return removed;
    };

    Priority.prototype.export = function () {
        var result = [],
            priority_keys = M.castItemsType(_.keys(this._priorities), 'number'),
            self = this;

        priority_keys.sort(M.SORT_NUMBER);

        _.each(priority_keys, function (priority) {
            _.each(self._priorities[priority], function (info) {
                result.push(info.content);
            });
        });

        return result;
    };

    return Priority;
}));