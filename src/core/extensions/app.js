/**
 * Application
 * @module _.M.App
 * @memberOf _.M
 * @requires _.M.EventEmitter
 */
;(function (_) {
    /**
     *
     * @class _.M.App
     * @extends _.M.EventEmitter
     */
    function App() {
        _.M.EventEmitter.call(this);

        this._event_privates = ['init'];

        this.options = {};

        this._dom_plugins = {};
    }

    _.M.inherit(App, _.M.EventEmitter);

    /**
     * Option this app
     * @param option
     * @param value
     */
    App.prototype.option = function (option, value) {
        this.options = _.M.setup.apply(_.M, [this.options].concat(Array.prototype.slice.apply(arguments)));
    };

    /**
     * Get option
     * @param {string} option
     * @param {*} [default_value] Default value if option not found
     * @returns {*}
     * @throws option not found and don't special default value
     */
    App.prototype.getOption = function (option, default_value) {
        if (this.options.hasOwnProperty(option)) {
            return _.clone(this.options[option]);
        }
        if (arguments.length >= 2) {
            return default_value;
        }

        throw new Error('Option not found');
    };

    /**
     * Add init callback
     * @param callback
     * @param {number} [priority]
     */
    App.prototype.onInit = function (callback, priority) {
        this.once('init', callback, priority);
    };

    /**
     * Init App
     */
    App.prototype.init = function () {
        this.emitEvent('init');
        this.resetEvents('init');
    };

    /*
     |--------------------------------------------------------------------------
     | DOM Plugin
     |--------------------------------------------------------------------------
     */

    App.prototype.hasDOMPlugin = function (name) {
        return this._dom_plugins.hasOwnProperty(name);
    };

    /**
     * Add jQuery Plugin callback
     * @param {string} name plugin name, default is unique id
     * @param {function} callback Callback, call arguments are: dom, options
     * @returns {boolean} True if plugin with name is not existed, otherwise
     */
    App.prototype.addDOMPlugin = function (name, callback) {
        if (!this.hasDOMPlugin(name)) {
            this._dom_plugins[name] = callback;

            return true;
        }

        return false;
    };

    /**
     * Remove plugin
     * @param {string} [name]
     * @returns {boolean}
     */
    App.prototype.removeDOMPlugin = function (name) {
        var self = this;

        name = _.flatten(_.toArray(arguments));
        _.each(name, function (tmp_name) {
            delete self._dom_plugins[tmp_name];
        });
    };

    /**
     * Apply plugin on dom
     * @param {string|Element} [selector_or_dom = body] selector or DOM or jQuery DOM
     * @param {Array} [plugins] Name of plugins
     * @param {object} [options]
     */
    App.prototype.applyDOMPlugin = function (selector_or_dom, plugins, options) {
        var self = this;

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
            plugins = Object.keys(this._dom_plugins);
        } else {
            var not_found = _.difference(plugins, Object.keys(this._dom_plugins));

            if (!_.isEmpty(not_found)) {
                throw new Error(['Apply not found DOM plugin: ', not_found.join(', ')].join(''));
            }
        }

        if (!_.isObject(options)) {
            options = {};
        }

        _.each(plugins, function (plugin) {
            self._dom_plugins[plugin](selector_or_dom, _.has(options, plugin) ? options[plugin] : {});
        });
    };
    
    _.M.App = App;

    /**
     *
     * @type {_.M.App}
     */
    var app_instance = new App();

    _.module('App', app_instance);

})(_);