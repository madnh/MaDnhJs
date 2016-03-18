/**
 * Application
 * @module _.M.App
 * @memberOf _.M
 */
;(function(_){
    /**
     *
     * @class _.M.App
     * @extends _.M.EventEmitter
     */
    function App() {
        _.M.EventEmitter.call(this);

        this._event_privates = ['init'];

        this.options = {};

        this.plugins = {};
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
     * Get cloned version of this options
     * @returns {{}}
     */
    App.prototype.getOptions = function () {
        return _.clone(this.options);
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

    /**
     * Add jQuery Plugin callback
     * @param {function} callback Callback, call arguments are: dom, options
     * @param {string} [name] plugin name, default is unique id
     * @returns {string} Name of plugin
     */
    App.prototype.addPlugin = function (callback, name) {
        if (!name) {
            name = _.M.nextID('plugin_');
        }

        this.plugins[name] = callback;

        return name;
    };

    /**
     * Remove plugin
     * @param {string} [name]
     * @returns {boolean}
     */
    App.prototype.removePlugin = function (name) {
        var self = this;

        name = _.flatten(_.toArray(arguments));
        _.each(name, function (tmp_name) {
            delete self.plugins[tmp_name];
        });
    };

    /**
     * Apply plugin on dom
     * @param {string|Element} [selector_or_dom = body] selector or DOM or jQuery DOM
     * @param {Array} [plugins] Name of plugins
     * @param {object} [options]
     */
    App.prototype.applyPlugin = function (selector_or_dom, plugins, options) {
        var self = this;

        if (!selector_or_dom) {
            selector_or_dom = $('body');
        } else if (_.isString(selector_or_dom)) {
            selector_or_dom = $(selector_or_dom);
        }

        if (!plugins) {
            plugins = Object.keys(this.plugins);
        }

        if (!_.isObject(options)) {
            options = {};
        }

        _.each(plugins, function (plugin) {
            _.M.async(self.plugins[plugin], [selector_or_dom, _.has(options, plugin) ? options[plugins] : {}], null);
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