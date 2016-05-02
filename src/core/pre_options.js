;(function (_) {
    var _pre_options = {};

    _.M.PreOptions = _.M.defineObject({
        /**
         *
         * @param {string} name
         * @param {{}}options
         * @param {boolean} [override=false]
         */
        define: function (name, options, override) {
            if (override || !_pre_options.hasOwnProperty(name)) {
                _pre_options[name] = options;
                return true;
            }

            return false;
        },
        /**
         *
         * @param {string} name
         * @returns {boolean}
         */
        has: function (name) {
            return _pre_options.hasOwnProperty(name);
        },
        /**
         *
         * @param {string} name
         * @param {{}} options
         * @returns {boolean}
         */
        update: function (name, options) {
            if (_pre_options.hasOwnProperty(name)) {
                _.extend(_pre_options[name], options);
                return true;
            }

            return false;
        },
        /**
         *
         * @param {string} name
         * @param {{}} [custom={}]
         * @returns {*}
         */
        get: function (name, custom) {
            if (!_pre_options.hasOwnProperty(name)) {
                throw new Error('Pre Options "' + name + '" is undefined');
            }

            return _.extend({}, _pre_options[name], _.isObject(custom) ? custom : {});
        },
        /**
         *
         * @param {string} src_name
         * @param {string} dest_name
         * @param {{}} options
         */
        extend: function (src_name, dest_name, options) {
            if (!_pre_options.hasOwnProperty(src_name)) {
                throw new Error('Source Pre Options is undefined');
            }
            if (_pre_options.hasOwnProperty(dest_name)) {
                throw new Error('Destination Pre Options is already exists');
            }

            return this.define(dest_name, this.get(src_name, options));
        },
        /**
         *
         * @param {boolean} [detail=false]
         * @returns {Array|{}}
         */
        list: function (detail) {
            if (detail) {
                return _.clone(_pre_options);
            }

            return Object.keys(_pre_options);
        }
    });
})(_);