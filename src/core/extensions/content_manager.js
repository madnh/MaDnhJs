/**
 * Store data by key and data type. Support add, check exists, get and delete
 * @module _.M.ContentManager
 * @memberOf _.M
 * @requires _.M.BaseClass
 */
;(function (_) {
    
    _.M.defineConstant({
        /**
         * @constant {string}
         * @default
         */
        CONTENT_TYPE_STRING: 'string',
        /**
         * @constant {string}
         * @default
         */
        CONTENT_TYPE_NUMBER: 'number',
        /**
         * @memberOf ContentManager
         * @constant {string}
         * @default
         */
        CONTENT_TYPE_BOOLEAN: 'boolean',
        /**
         * @constant {string}
         * @default
         */
        CONTENT_TYPE_ARRAY: 'array',
        /**
         * @constant {string}
         * @default
         */
        CONTENT_TYPE_FUNCTION: 'function',
        /**
         * @constant {string}
         * @default
         */
        CONTENT_TYPE_OBJECT: 'object',
        /**
         * @constant {string}
         * @default
         */
        CONTENT_TYPE_MIXED: 'mixed'
    });

    /**
     * Extract key to get content {string} type
     * @param {string} key
     * @returns {(string|boolean)} False when invalid key
     */
    function getContentTypeFromKey(key) {
        var info = key.split('_');

        if (info.length > 2) {
            return info[1];
        }
        return false;
    }

    /**
     * @class _.M.ContentManager
     */
    function ContentManager() {
        this.type_prefix = 'content';
        _.M.BaseClass.call(this);

        this._contents = {};
        this._usesing = {};
    }

    /**
     * Check if content type is exists
     * @param {string} type
     * @returns {boolean}
     */
    ContentManager.prototype.hasType = function (type) {
        return this._contents.hasOwnProperty(type);
    };

    /**
     * Get array of content types
     * @returns {Array}
     */
    ContentManager.prototype.types = function () {
        return Object.keys(this._contents);
    };

    /**
     * Find positions of content by content and [type]
     * @param {*} content
     * @param {string} [type] Find in this type, if missing then auto detect
     * @returns {Array} Array of object with keys: type, key
     */
    ContentManager.prototype.contentPositions = function (content, type) {
        var pos = [],
            self = this;

        if (!type) {
            type = _.M.contentType(content);
        }
        if (this._contents.hasOwnProperty(type)) {
            Object.keys(this._contents[type]).forEach(function (key) {
                if (self._contents[type][key].content === content) {
                    pos.push({
                        type: type,
                        key: key
                    });
                }
            });
        }

        return pos;
    };

    /**
     * Filter meta, return positions
     * @param {Function} callback
     * @param {(string|Array)} types Filter all type of contents if this parameter is missing
     * @returns {Array}
     */
    ContentManager.prototype.metaPositions = function (callback, types) {
        var pos = [],
            self = this;

        if (!types) {
            types = Object.keys(this._contents);
        }
        types = _.M.asArray(types);


        types.forEach(function (type) {
            Object.keys(self._contents[type]).forEach(function (key) {
                if (callback(self._contents[type][key])) {
                    pos.push({
                        type: type,
                        key: key
                    });
                }
            });
        });

        return pos;
    };

    /**
     * Check if key is valid
     * @param {string} key
     * @returns {boolean}
     */
    ContentManager.prototype.isValidKey = function (key) {
        return false !== getContentTypeFromKey(key);
    };

    /**
     * Find content exists
     * @param content
     * @param type
     * @returns {boolean}
     */
    ContentManager.prototype.hasContent = function (content, type) {
        return this.contentPositions(content, type).length > 0;
    };

    /**
     * Check if key is exists
     * @param {string} key
     * @param {string} [type]
     * @returns {boolean}
     */
    ContentManager.prototype.hasKey = function (key, type) {
        if (this.isUsing(key)) {
            return true;
        }
        if (!type) {
            type = getContentTypeFromKey(key);
            if (!type) {
                return false;
            }
        }

        return this._contents.hasOwnProperty(type) && this._contents[type].hasOwnProperty(key);
    };

    /**
     * Clean empty type
     */
    ContentManager.prototype.clean = function () {
        var self = this;
        Object.keys(this._contents).forEach(function (type) {
            if (self._contents.hasOwnProperty(type) && _.isEmpty(self._contents[type])) {
                delete self._contents[type];
            }
        });
    };

    /**
     * Add content
     * @param {*} content
     * @param {*} meta
     * @param {string} [type] Auto detect when missing
     * @returns {string} Content key
     */
    ContentManager.prototype.add = function (content, meta, type) {
        if (!type) {
            type = _.M.contentType(content);
        }

        var key = _.M.nextID(this.type_prefix + '_'+ type, true);

        if (!this._contents.hasOwnProperty(type)) {
            this._contents[type] = {};
        }
        this._contents[type][key] = {
            content: content,
            meta: meta
        };

        return key;
    };

    /**
     * Add unique content
     * @param {*} content
     * @param {*} meta
     * @param {string} [type] Auto detect when missing
     * @returns {string} Content key
     */
    ContentManager.prototype.addUnique = function (content, meta, type) {
        if (!type) {
            type = _.M.contentType(content);
        }

        var positions = this.contentPositions(content, type);

        if (positions.length == 0) {
            return this.add(content, meta, type);
        }

        return positions.shift().key;
    };

    /**
     * Check if content key is using
     * @param {string} key
     * @returns {boolean}
     */
    ContentManager.prototype.isUsing = function (key) {
        return this._usesing.hasOwnProperty(key);
    };

    /**
     * Check if content is using
     * @param {*} content
     * @param {string} [type] Auto detect when missing
     * @returns {boolean}
     */
    ContentManager.prototype.isUsingContent = function (content, type) {
        var positions = this.contentPositions(content, type);

        return positions.length && this._usesing.hasOwnProperty(positions.shift().key);
    };

    /**
     * Toggle using key
     * @param {string} key
     * @param {boolean} [is_using = true]
     */
    ContentManager.prototype.using = function (key, is_using) {
        if (_.isUndefined(is_using) || is_using) {
            this._usesing[key] = true;
        } else {
            delete this._usesing[key];
        }
    };

    /**
     * Remove flaged content key is using
     * @param key
     */
    ContentManager.prototype.unused = function (key) {
        delete this._usesing[key];
    };

    /**
     * Remove content by key. Return removed keys
     * @param {string|Array} keys
     */
    ContentManager.prototype.remove = function (keys) {
        var removes = [], self = this;

        _.M.asArray(keys).forEach(function (key) {
            var type = getContentTypeFromKey(key);

            if (false !== type && self._contents.hasOwnProperty(type)) {
                delete self._contents[type][key];
                delete self._usesing[key];

                removes.push({
                    type: type,
                    key: key
                });
            }
        });


        this.clean();

        return removes;
    };

    /**
     * Remove content, return content key
     * @param {*} content
     * @param {string} [type]
     * @returns {Array} Removed positions
     */
    ContentManager.prototype.removeContent = function (content, type) {
        var positions = this.contentPositions(content, type),
            self = this;

        if (positions.length) {
            _.each(positions, function (pos) {
                delete self._contents[pos.type][pos.key];
                delete self._usesing[pos.key];
            });
        }

        this.clean();

        return positions;
    };

    /**
     * Update content and meta
     * @param {string} key
     * @param {*} content
     * @param {*} [meta]
     * @returns {boolean}
     */
    ContentManager.prototype.update = function (key, content, meta) {
        if (this.hasKey(key)) {
            var type = getContentTypeFromKey(key);

            this._contents[type][key].content = content;

            if (arguments.length >= 3) {
                this._contents[type][key].meta = meta;
            }

            return true;
        }

        return false;
    };

    /**
     * Update meta
     * @param {string} key
     * @param {*} meta
     * @returns {boolean}
     */
    ContentManager.prototype.updateMeta = function (key, meta) {
        if (this.hasKey(key)) {
            var type = getContentTypeFromKey(key);

            this._contents[type][key].meta = meta;

            return true;
        }

        return false;
    };

    /**
     * Get content and meta by key
     * @param {string} key
     * @returns {*}
     */
    ContentManager.prototype.get = function (key) {
        var type = getContentTypeFromKey(key);

        if (false !== type && this._contents[type].hasOwnProperty(key)) {
            return _.clone(this._contents[type][key]);
        }

        return false;
    };

    /**
     * Get type content
     * @param {string} type
     * @returns {({}|boolean)}
     */
    ContentManager.prototype.getType = function (type) {
        if (this.hasType(type)) {
            return _.clone(this._contents[type]);
        }

        return false;
    };

    /**
     * Get content by key
     * @param {string} key
     * @param {*} [default_value]
     * @returns {*}
     */
    ContentManager.prototype.getContent = function (key, default_value) {
        var result = this.get(key);

        if (false !== result) {

            return _.clone(result.content);
        }

        return default_value;
    };

    /**
     * Get content meta by key
     * @param {string} key
     * @param {*} [default_value]
     * @returns {*}
     */
    ContentManager.prototype.getMeta = function (key, default_value) {
        var result = this.get(key);

        if (false !== result) {

            return _.clone(result.meta);
        }

        return default_value;
    };

    /**
     * Remove using content
     * @returns {Array} Removed position
     */
    ContentManager.prototype.removeUsing = function () {
        return this.remove(Object.keys(this._usesing));
    };

    /**
     * Remove using content
     * @returns {Array} Removed position
     */
    ContentManager.prototype.removeUnusing = function () {
        var uses = Object.keys(this._usesing),
            types = {},
            self = this,
            removes = {};

        uses.forEach(function (using) {
            var type = getContentTypeFromKey(using);

            if (type) {
                if (!types.hasOwnProperty(type)) {
                    types[type] = [];
                }
                types[type].push(using);
            }
        });

        Object.keys(this._contents).forEach(function (type) {
            if (types.hasOwnProperty(type)) {
                removes[type] = _.difference(Object.keys(self._contents[type]), types[type]);
                self._contents[type] = _.pick(self._contents[type], types[type]);
            } else {
                removes[type] = types[type];
                delete self._contents[type];
            }

        });

        return _.flatten(_.values(removes));
    };

    /**
     * Get status
     * @returns {{using: Number, types: {}}}
     */
    ContentManager.prototype.status = function () {
        var status = {
                using: Object.keys(this._usesing).length,
                types: {}
            },
            self = this;

        Object.keys(this._contents).forEach(function (type) {
            status.types[type] = Object.keys(self._contents[type]);
        });

        return status;
    };

    /**
     * 
     * @type {_.M.ContentManager}
     */
    _.M.ContentManager = ContentManager;

})(_);