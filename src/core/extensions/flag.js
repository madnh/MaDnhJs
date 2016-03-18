/**
 * @module _.M.FLAG
 * @memberOf _.M
 */
;(function(_){
    var _flags = {};

    /**
     * @lends _.M.FLAG
     * @type {{}}
     */
    _.M.FLAG = _.M.defineObject({
        /**
         * Check if a flag is exists
         * @param {string} name
         */
        has: function (name) {
            return _.has(_flags, name);
        },

        /**
         * Set a flag
         * @param {string} name
         * @param {boolean} is_active Flag status, default is True
         * @param {string} prefix Add prefix to flag name
         * @param {string} suffix Add suffix to flag name
         */
        flag: function (name, is_active, prefix, suffix) {
            if (_.isUndefined(is_active)) {
                is_active = true;
            } else {
                is_active = Boolean(is_active);
            }
            if (!(_.isString(prefix) || _.M.isNumeric(prefix))) {
                prefix = '';
            } else {
                prefix += '';
            }

            if (!(_.isString(suffix) || _.M.isNumeric(suffix))) {
                suffix = '';
            } else {
                suffix += '';
            }

            if (_.isArray(name)) {
                _.each(name, function (tmp_name) {
                    _flags[prefix + tmp_name + suffix] = is_active;
                })
            } else {
                _flags[prefix + name + suffix] = is_active;
            }
        },

        /**
         * Get flags
         * @param {boolean} detail If true then return flags with detail of it, else only return flags name
         */
        flags: function (detail) {
            if (detail) {
                return _.clone(_flags);
            }
            return _.keys(_flags);
        },

        /**
         * Get flag by name
         * @param {string} name
         * @returns {(*|boolean)}
         */
        get: function (name) {
            return this.has(name) && Boolean(_flags[name]);
        },

        /**
         * Check if a flag is exists
         * @param {string} name
         * @param {string} prefix Add prefix to flag name
         * @param {string} suffix Add suffix to flag name
         * @returns {*}
         */
        isFlagged: function (name, prefix, suffix) {
            var result, self = this;

            if (!(_.isString(prefix) || _.M.isNumeric(prefix))) {
                prefix = '';
            } else {
                prefix += '';
            }

            if (!(_.isString(suffix) || _.M.isNumeric(suffix))) {
                suffix = '';
            } else {
                suffix += '';
            }

            if (_.isArray(name)) {
                result = [];
                _.each(name, function (tmp_name) {
                    if (self.get(prefix + tmp_name + suffix)) {
                        result.push(tmp_name);
                    }
                })
            } else {
                result = this.get(prefix + name + suffix);
            }

            return result;
        },


        toggle: function (name, prefix, suffix, status) {
            var thisFunc = arguments.callee;
            var self = this;

            if (!(_.isString(prefix) || _.M.isNumeric(prefix))) {
                prefix = '';
            } else {
                prefix += '';
            }

            if (!(_.isString(suffix) || _.M.isNumeric(suffix))) {
                suffix = '';
            } else {
                suffix += '';
            }

            if (_.isArray(name)) {
                _.each(name, function (tmp_name) {
                    thisFunc.apply(self, [tmp_name, prefix, suffix, status]);
                })
            } else {
                if (!_.isUndefined(status)) {
                    this.flag(name, Boolean(status), prefix, suffix);
                } else {
                    this.flag(name, !this.isFlagged(name, prefix, suffix), prefix, suffix);
                }
            }
        }

    });
})(_);