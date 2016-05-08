;(function (_) {
    var _dom_plugins = {};

    /*
     |--------------------------------------------------------------------------
     | DOM Plugin
     |--------------------------------------------------------------------------
     */

    _.App.hasDOMPlugin = function (name) {
        return _dom_plugins.hasOwnProperty(name);
    };

    /**
     * Add jQuery Plugin callback
     * @param {string} name plugin name, default is unique id
     * @param {function} callback Callback, call arguments are: dom, options
     * @param {object} options Default options
     */
    _.App.addDOMPlugin = function (name, callback, options) {
        _dom_plugins[name] = {
            callback: callback,
            options: _.isObject(options) ? options : {}
        };
    };

    /**
     * Remove plugin
     * @param {string} [name]
     * @returns {boolean}
     */
    _.App.removeDOMPlugin = function (name) {

        name = _.flatten(_.toArray(arguments));

        _.each(name, function (tmp_name) {
            delete _dom_plugins[tmp_name];
        });
    };

    /**
     * Apply plugin on dom
     * @param {string|Element} [selector_or_dom = body] selector or DOM or jQuery DOM
     * @param {Array} [plugins] Name of plugins
     * @param {object} [options]
     */
    _.App.applyDOMPlugin = function (selector_or_dom, plugins, options) {
        var parameters = _.M.optionalArgs(_.toArray(arguments), ['selector', 'plugins', 'options'], {
            selector: function (arg) {
                return _.isString(arg) || arg instanceof $;
            },
            plugins: 'Array',
            options: 'Object'
        });

        selector_or_dom = $(parameters.selector || 'body');
        plugins = parameters.plugins || Object.keys(_dom_plugins);
        options = parameters.options || {};

        var not_found = _.difference(plugins, Object.keys(_dom_plugins));
        if (!_.isEmpty(not_found)) {
            throw new Error(['Apply not found DOM plugin: ', not_found.join(', ')].join(''));
        }

        _.each(plugins, function (plugin) {
            var _options = _.has(options, plugin) ? options[plugin] : {};
            _dom_plugins[plugin].callback(selector_or_dom, _.extend({}, _dom_plugins[plugin].options, _options));
        });
    };
})(_);