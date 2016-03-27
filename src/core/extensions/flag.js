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
         */
        flag: function (name, is_active) {
            if (_.isUndefined(is_active)) {
                is_active = true;
            } else {
                is_active = Boolean(is_active);
            }


            if (_.isArray(name)) {
                _.each(name, function (tmp_name) {
                    _flags[tmp_name] = is_active;
                });
            } else {
                _flags[name] = is_active;
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
         * @returns {*}
         */
        isFlagged: function (name) {
            var result, self = this;



            if (_.isArray(name)) {
                result = [];
                _.each(name, function (tmp_name) {
                    if (self.get(tmp_name)) {
                        result.push(tmp_name);
                    }
                })
            } else {
                result = this.get(name);
            }

            return result;
        },


        toggle: function (name, status) {
            var thisFunc = arguments.callee;
            var self = this;
            
            if (_.isArray(name)) {
                _.each(name, function (tmp_name) {
                    thisFunc.apply(self, [tmp_name, status]);
                })
            } else {
                if (!_.isUndefined(status)) {
                    this.flag(name, Boolean(status));
                } else {
                    this.flag(name, !this.isFlagged(name));
                }
            }
        }

    });
})(_);