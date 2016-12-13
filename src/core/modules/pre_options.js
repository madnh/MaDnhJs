(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['lodash', 'madnh'], function (_, M) {
            return factory(_, M);
        });
    } else {
        // Browser globals
        root.PreOptions = factory(root._, root.M);
    }
}(this, function (_, M) {
    var _pre_options = {};

    /**
     * @constructor
     */
    function PreOptions() {
        //
    }

    /**
     *
     * @param {string} name
     * @param {{}}options
     * @param {boolean} [override=false]
     */
    PreOptions.prototype.define = function (name, options, override) {
        if (override || !_pre_options.hasOwnProperty(name)) {
            _pre_options[name] = {
                options: options,
                base: []
            };

            return true;
        }

        return false;
    };
    /**
     *
     * @param {string} name
     * @returns {boolean}
     */
    PreOptions.prototype.has = function (name) {
        return _pre_options.hasOwnProperty(name);
    };
    /**
     *
     * @param {string} name
     * @param {{}} options
     * @returns {boolean}
     */
    PreOptions.prototype.update = function (name, options) {
        if (_pre_options.hasOwnProperty(name)) {
            _.extend(_pre_options[name].options, options);
            return true;
        }

        return false;
    };

    PreOptions.prototype.updateBase = function (name, new_base) {
        if (_pre_options.hasOwnProperty(name)) {
            _pre_options[name].base = new_base;

            return true;
        }

        return false;
    };

    /**
     *
     * @param {string} name
     * @param {{}} [custom={}]
     * @returns {*}
     */
    PreOptions.prototype.get = function (name, custom) {
        if (!_pre_options.hasOwnProperty(name)) {
            throw new Error('Pre Options "' + name + '" is undefined');
        }

        var self = this,
            result = {};

        _.each(_.castArray(_pre_options[name].base), function (base) {
            _.extend(result, self.get(base));
        });
        _.extend(result, _.cloneDeep(_pre_options[name].options), _.isObject(custom) ? custom : {});

        return result;
    };

    /**
     * Create PreOptions, base on real time value of other PreOptions
     * @param {string|string[]} sources Base on other PreOptions
     * @param {string} dest_name
     * @param {{}} [options={}]
     */
    PreOptions.prototype.extend = function (sources, dest_name, options) {
        _extend(sources, dest_name, options, true);
    };
    /**
     * Create PreOptions, base on runtime-value of other PreOptions
     * @param {string|string[]} sources Base on other PreOptions
     * @param {string} dest_name
     * @param {{}} [options={}]
     */
    PreOptions.prototype.baseOn = function (sources, dest_name, options) {
        _extend(sources, dest_name, options, false);
    };

    /**
     *
     * @param {boolean} [detail=false]
     * @returns {Array|{}}
     */
    PreOptions.prototype.list = function (detail) {
        if (detail) {
            return _.cloneDeep(_pre_options);
        }

        return _.keys(_pre_options);
    };

    PreOptions.prototype.reset = function () {
        _pre_options = {};
    };

    function _extend(sources, dest_name, options, real_time) {
        if (_pre_options.hasOwnProperty(dest_name)) {
            throw new Error('Destination Pre Options is already exists');
        }
        sources = _.castArray(sources);
        var not_founds = _.filter(sources, function (source) {
            return !_pre_options.hasOwnProperty(source);
        });

        if (!_.isEmpty(not_founds)) {
            throw new Error('PreOptions are not defined:' + not_founds.join(', '));
        }
        if (!_.isObject(options)) {
            options = {};
        }
        if (!real_time) {
            var base_options = {};

            _.each(sources, function (base) {
                _.extend(base_options, PreOptions.get(base));
            });
            _.extend(options, base_options);

            _pre_options[dest_name] = {
                options: options,
                base: []
            };
        } else {
            _pre_options[dest_name] = {
                options: options,
                base: sources
            };
        }
    }

    return new PreOptions();
}));