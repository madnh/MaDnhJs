/**
 * Cache management system
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['lodash'], function (_) {
            return (root.Cache = factory(_));
        });
    } else {
        // Browser globals
        root.Cache = factory(root._);
    }
}(this, function (_) {
    var _cache_data = {},
        _clean_interval_time,
        _clean_interval,
        constants;

    /**
     * @constructor
     */
    function Cache() {
        //Clean cache every 10 seconds
        if (_clean_interval) {
            clearInterval(_clean_interval);
        }
        _clean_interval = setInterval(_clean_cache, _clean_interval_time * 1000);
    }

    /**
     * Define constants
     * @type {{CACHE_MIN: number, CACHE_TINY: number, CACHE_SHORT: number, CACHE_MEDIUM: number, CACHE_LONG: number, CACHE_FOREVER: boolean}}
     */
    constants = {
        /**
         * 10 seconds
         * @constant {number}
         * @default
         */
        CACHE_MIN: 10,
        /**
         * 1 minute
         * @constant {number}
         * @default
         */
        CACHE_TINY: 60,
        /**
         * 5 minutes
         * @constant {number}
         * @default
         */
        CACHE_SHORT: 300,
        /**
         * 10 minutes
         * @constant {number}
         * @default
         */
        CACHE_MEDIUM: 600,
        /**
         * 1 hour
         * @constant {number}
         * @default
         */
        CACHE_LONG: 3600,
        /**
         * Forever
         * @constant {number}
         * @default
         */
        CACHE_FOREVER: true
    };
    for (var key in constants) {
        if (constants.hasOwnProperty(key)) {
            Object.defineProperty(Cache, key, {
                enumerable: true,
                value: constants[key]
            });
        }
    }

    _clean_interval_time = Cache.CACHE_MIN;

    /**
     * Check if a cache name is exists
     * @param {string} name
     * @returns {boolean}
     * @private
     */
    function _has_cache(name) {
        if (_.has(_cache_data, name)) {
            //-1 to ensure this cache is valid when get right after check
            if (_cache_data[name].expire_time === true || (_cache_data[name].expire_time - 1) > parseInt(Math.floor(_.now() / 1000))) {
                return true;
            }
            _expire_cache(name);
        }
        return false;
    }

    /**
     * Set cache value
     * @param {string} name
     * @param {*} value
     * @param {number} [live_time] Seconds
     * @private
     */
    function _set_cache(name, value, live_time) {
        if (_.isUndefined(live_time) || !_.isNumber(Number(live_time)) || !_.isFinite(Number(live_time))) {
            live_time = Cache.CACHE_MEDIUM;
        }
        _cache_data[name] = {
            value: value,
            live_time: live_time,
            expire_time: live_time === true ? true : parseInt(Math.floor(_.now() / 1000)) + live_time
        }
    }

    /**
     * Delete expire caches
     * @private
     */
    function _expire_cache() {
        _.each(_.flatten(arguments), function (name) {
            delete _cache_data[name];
        });
    }

    /**
     * Add/Remove item when cached item is array
     * @param {string} name
     * @param {*} value
     * @param {boolean} [addMode = true] Add mode
     * @returns {*} Return new value of cache
     * @private
     */
    function _cache_collection_change(name, value, addMode) {
        var live_time = Cache.CACHE_MEDIUM;
        var new_value = [];

        if (_.isUndefined(addMode)) {
            addMode = true;
        }

        if (_has_cache(name)) {
            var old_detail = _cache_data[name];

            live_time = old_detail.live_time;
            new_value = old_detail.value;

            if (!_.isArray(new_value)) {
                new_value = [new_value];
            }
            if (addMode) {
                new_value.push(value);
            } else {
                var last_index = _.lastIndexOf(new_value, value);

                if (last_index != -1) {
                    new_value.splice(last_index, 1);
                }
            }
        } else {
            if (addMode) {
                new_value.push(value);
            } else {
                return undefined;
            }

        }
        _set_cache(name, new_value, live_time);
        return _cache_data[name].value;
    }

    /**
     * Add/Subtract value of cached item when it is number
     * @param {string} name
     * @param {number} [value = 1]
     * @param {boolean} [addMode = true] TRUE - add mode, FALSE - subtract mode
     * @returns {number}
     * @private
     */
    function _cache_number_change(name, value, addMode) {
        if (_.isUndefined(value) || !_.isNumber(Number(value)) || !_.isFinite(Number(value))) {
            value = 1;
        }
        if (_.isUndefined(addMode)) {
            addMode = true;
        }
        if (addMode) {
            value = Math.abs(value);
        } else {
            value = -1 * Math.abs(value);
        }

        if (!_has_cache(name)) {
            _set_cache(name, value);
        } else {
            _cache_data[name].value = Number(_cache_data[name].value);

            if (!_.isNumber(_cache_data[name].value) || !_.isFinite(_cache_data[name].value)) {
                _cache_data[name].value = 0;
            }

            _cache_data[name].value += value;
        }

        return _cache_data[name].value;
    }

    /**
     * Clean expired caches
     * @private
     */
    function _clean_cache() {
        var removes = [];
        var now_second = parseInt(Math.floor(_.now() / 1000));
        _.each(_cache_data, function (data, name) {
            if (data.expire_time !== true && data.expire_time <= now_second) {
                removes.push(name);
            }
        });
        _expire_cache(removes);
    }

    Cache.prototype.set = function (name, value, live_time) {
        _set_cache(name, value, live_time);
    };
    /**
     * Check if a cached name is exists
     * @param {string} name
     * @returns {boolean}
     */
    Cache.prototype.has = function (name) {
        return _has_cache(name);
    };

    /**
     * Get cached value
     * @param {string} name
     * @param {*} default_value
     * @returns {*}
     */
    Cache.prototype.get = function (name, default_value) {
        if (_.has(_cache_data, name)) {
            if (_cache_data[name].expire_time === true || _cache_data[name].expire_time > parseInt(Math.floor(_.now() / 1000))) {
                return _cache_data[name].value;
            }
            delete _cache_data[name];
        }

        return default_value;
    };

    /**
     * Add live time
     * @param {string} name
     * @param {number} [live_time] Default is cached live time
     * @return {boolean|number} False - cache is not exists. True - cache is forever. Number - next expire time
     */
    Cache.prototype.touch = function (name, live_time) {
        if (this.has(name)) {
            if (_cache_data[name].expire_time !== true) {
                var cache = _cache_data[name];

                if (!_.isNumber(live_time) || !_.isFinite(live_time)) {
                    live_time = cache.live_time;
                }

                cache.expire_time = Math.max(cache.expire_time, parseInt(Math.floor(_.now() / 1000)) + live_time);

                return cache.expire_time;
            }

            return true;
        }

        return false;
    };

    /**
     * Get valid caches
     * @param {boolean} [name_only = true] Only return cache name
     * @returns {*}
     */
    Cache.prototype.list = function (name_only) {

        /**
         * @type {({}|Array)}
         */
        var result;
        var now_second = parseInt(Math.floor(_.now() / 1000));

        /**
         * @type {function}
         */
        var addItem;
        if (name_only || _.isUndefined(name_only)) {
            result = [];
            addItem = function (key) {
                result.push(key);
            };
        } else {
            result = {};
            addItem = function (key, data) {
                result[key] = data;
            }
        }

        _.each(_cache_data, function (data, key) {
            if (data.expire_time === true || now_second < data.expire_time) {
                addItem(key, data);
            }
        });

        return result;
    };

    /**
     * Clean expired caches
     */
    Cache.prototype.clean = function () {
        return _clean_cache();
    };

    /**
     * Manual delete expired caches
     */
    Cache.prototype.expire = function () {
        _expire_cache(Array.prototype.slice.apply(arguments));
    };

    /**
     * Increment value of a cache, if cache is not exists then create with value and live time as default
     * (CACHE_MEDIUM), if exists then increment it and set live time as old. If old value isn't a valid numeric
     * then set it to 0
     *
     * @param {string} name
     * @param {number} [value = 1] Increment value
     * @returns {number}
     */
    Cache.prototype.increment = function (name, value) {
        if (!_.isNumber(value) || !_.isFinite(value)) {
            value = 1;
        }
        return _cache_number_change(name, value, true);
    };

    /**
     * Decrement value of a cache, if cache is not exists then create with value and live time as default
     * (CACHE_MEDIUM), if exists then decrement it and set live time as old. If old value isn't a valid numeric
     * then set it to 0
     *
     * @param {string} name
     * @param {number} [value = 1] Decrement value
     * @returns {number}
     */
    Cache.prototype.decrement = function (name, value) {
        if (!_.isNumber(value) || !_.isFinite(value)) {
            value = 1;
        }
        return _cache_number_change(name, value, false);
    };

    /**
     * Add item to array
     * @param {string} name
     * @param {*} value
     * @returns {*}
     */
    Cache.prototype.arrayPush = function (name, value) {
        return _cache_collection_change(name, value, true);
    };

    /**
     * Remove item from array
     * @param {string} name
     * @param {*} value
     * @returns {*}
     */
    Cache.prototype.arrayWithout = function (name, value) {
        return _cache_collection_change(name, value, false);
    };


    return new Cache();
}));