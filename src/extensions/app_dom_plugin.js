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
     * @returns {boolean} True if plugin with name is not existed, otherwise
     */
    _.App.addDOMPlugin = function (name, callback) {
        if (!this.hasDOMPlugin(name)) {
            _dom_plugins[name] = callback;

            return true;
        }

        return false;
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
        if (!selector_or_dom) {
            selector_or_dom = $('body');
        } else if (_.isString(selector_or_dom)) {
            selector_or_dom = $(selector_or_dom);
        } else {
            try {
                selector_or_dom = $(selector_or_dom);
            } catch (e) {
                throw new Error('Invalid selector/DOM');
            }
        }

        if (!plugins) {
            plugins = Object.keys(_dom_plugins);
        } else {
            var not_found = _.difference(plugins, Object.keys(_dom_plugins));

            if (!_.isEmpty(not_found)) {
                throw new Error(['Apply not found DOM plugin: ', not_found.join(', ')].join(''));
            }
        }

        if (!_.isObject(options)) {
            options = {};
        }

        _.each(plugins, function (plugin) {
            _dom_plugins[plugin](selector_or_dom, _.has(options, plugin) ? options[plugin] : {});
        });
    };
})(_);