;(function (_) {
    var _list_system = {};
    /**
     * List manager
     * @module LIST
     * @memberOf MaDnh
     * @type {{}}
     */
    _.M.LIST = _.M.defineObject({

        /**
         * Trigger on list is changed
         * @param {string} type
         */
        triggerListSystemChange: function (type) {
            if (!_.isUndefined(type)) {
                _.M.EVENT.trigger('madnh_list_' + type + '_change');
            }
            _.M.EVENT.trigger('madnh_list_change');
        },

        /**
         * Add list type
         * @param {string} type
         */
        addType: function (type) {
            _list_system[type] = {};

            _.M.EVENT.trigger('madnh_list_add_type', type);
            this.triggerListSystemChange();
        },

        /**
         * Get list types as array
         * @return {string[]}
         */
        types: function () {
            return _.keys(_list_system);
        },

        /**
         * Check if a list type is exists
         * @param {string} type
         */
        hasType: function (type) {
            return _.has(_list_system, type);
        },

        /**
         * Remove list type
         * @param {string} type
         * @returns {boolean}
         */
        removeType: function (type) {
            if (this.hasType(type)) {
                delete _list_system[type];

                _.M.EVENT.trigger('madnh_list_remove_type', type);
                this.triggerListSystemChange();
                return true;
            }
            return false;
        },

        /**
         * Reset type by remove all it's items
         * @param {string} type
         * @returns {boolean}
         */
        resetType: function (type) {
            if (this.hasType(type)) {
                _list_system[type] = {};
                _.M.EVENT.trigger('madnh_list_reset_type', type);
                this.triggerListSystemChange(type);
                return true;
            }
            return false;
        },

        /**
         * Get detail of list type
         * @param {string} type
         * @returns {boolean}
         */
        getType: function (type) {
            if (this.hasType(type)) {
                return _.clone(_list_system[type]);
            }
            return false;
        },

        /**
         * Check if a list type is empty
         * @param {string} type
         * @returns {boolean}
         */
        isEmptyType: function (type) {
            if (!_.isUndefined(type)) {
                if (this.hasType(type)) {
                    return _.isEmpty(this.getType(type));
                }
                return true;
            }
            return _.isEmpty(_list_system);
        },

        /**
         * Get items name of a list
         * @param {string} type
         * @returns {(string[] | boolean)} Array of items name or False when list type not found
         */
        items: function (type) {
            if (this.hasType(type)) {
                return _.keys(_list_system[type]);
            }
            return false;
        },

        /**
         * Check if list type has item
         * @param {string} type
         * @param {string} item_name
         * @returns {boolean}
         */
        hasItem: function (type, item_name) {
            return this.hasType(type) && _.has(_list_system[type], item_name);
        },

        /**
         * Add item
         * @param {string} type Item's type
         * @param {string} name Item's name
         * @param {*} data
         * @param {boolean} [override=true] Override existed item
         * @returns {boolean}
         */
        addItem: function (type, name, data, override) {
            if (_.isUndefined(override)) {
                override = true;
            }
            if (!this.hasType(type)) {
                this.addType(type);
            }
            if (!(_.isString(name) || _.M.isNumeric(name)) || (name + '').length == 0) {
                name = _.M.nextID('madnh_list_item', true);
            }
            if (override || !this.hasItem(type, name)) {
                _list_system[type][name] = data;

                _.M.EVENT.trigger('madnh_list_' + type + '_add', {
                    name: name,
                    data: data
                });
                this.triggerListSystemChange(type);
                return true;
            }
            return false;
        },
        /**
         * Get data of item
         * @param {string} type List type
         * @param {string} name Item's name
         * @returns {*}
         */
        getItem: function (type, name) {
            if (this.hasItem(type, name)) {
                return _.clone(_list_system[type][name]);
            }
            return undefined;
        },

        /**
         * Remove item from list
         * @param {string} type List type
         * @param {(string|function|Array)} name Item's name
         * @returns {boolean}
         */
        removeKeys: function (type, name) {
            var result = false;
            if (this.hasType(type)) {
                name = _.castArray(name);
                var old = _.clone(_list_system[type]), removed;

                _.M.removeKeys(_list_system[type], name);
                removed = _.pick(old, _.difference(_.keys(old), _.keys(_list_system[type])));
                if (!_.isEmpty(removed)) {
                    _.M.EVENT.trigger('madnh_list_remove_item', removed);
                    this.triggerListSystemChange(type);
                    result = true;
                }
            }

            return result;
        },

        /**
         * Toggle exists status of item
         * @param {string} type
         * @param {string} item
         * @param {*} data
         * @param {boolean} [status = undefined] Exists status of item. If undefined or null will all/remove base on
         *     exists status of item. If true will add item if item is non exists. If false will remove item
         */
        toggleItem: function (type, item, data, status) {
            if (_.isUndefined(status) || _.isNull(status)) {
                if (this.hasItem(type, item)) {
                    this.removeKeys(type, item);
                } else {
                    this.addItem(type, item, data, false);
                }
            } else {
                if (status) {
                    this.addItem(type, item, data, false);
                } else {
                    this.removeKeys(type, item);
                }
            }
        },

        /**
         * Remove item type base on it's data
         * @param {string} type
         * @param {*} data
         * @returns {(*|boolean)}
         */
        removeByData: function (type, data) {
            return this.removeKeys(type, function (item_data) {
                return item_data === data;
            });
        },

        /**
         * Check if item is exists in type
         * @param {string} type
         * @param {string} item
         * @param {*} [data] If special then check by data, instead of item name
         * @returns {boolean}
         */
        isInType: function (type, item, data) {
            if (this.hasType(type) && !_.isUndefined(item)) {
                if (!_.isNull(item)) {
                    return _.has(_list_system[type], item);
                }
                return _.contains(_list_system[type], data);
            }
            return false;
        },

        /**
         * Find item in type
         * @param {string} type
         * @param {function} callback
         * @param {*} not_found_value
         * @returns {*}
         */
        findInType: function (type, callback, not_found_value) {
            if (this.hasType(type)) {
                return _.find(_list_system[type], callback);
            }
            return not_found_value;
        },

        /**
         * Filter items in type
         * @param {string} type
         * @param {function} callback
         * @returns {Array}
         */
        filterInType: function (type, callback) {
            if (this.hasType(type)) {
                return _.filter(_list_system[type], callback);
            }
            return [];
        },
        /**
         *
         * @param type
         * @param properties
         * @returns {Array}
         */
        whereInType: function (type, properties) {
            if (this.hasType(type)) {
                return _.where(_list_system[type], properties);
            }
            return [];
        },

        /**
         *
         * @param type
         * @param properties
         * @returns {Array}
         */
        findWhereInType: function (type, properties) {
            if (this.hasType(type)) {
                return _.findWhere(_list_system[type], properties);
            }
            return [];
        }
    });

})(_);