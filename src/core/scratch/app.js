/**
 * Application
 * @module _.M.App
 * @memberOf _.M
 * @requires _.M.EventEmitter
 */
;(function (_) {
    function App() {
        _.M.EventEmitter.call(this);

        this.private('init');
    }

    _.M.inherit(App, _.M.EventEmitter);

    /**
     * Option this app
     * @param {string|{}} option
     * @param {*} value
     * @param {string} [separator='.']
     */
    App.prototype.option = function (option, value, separator) {
        var options = {}, invalid_options;

        if (_.isObject(option)) {
            options = option;
            invalid_options = _.pick(options, function (value, key) {
                return (key + '')[0] === '_' || _.isFunction(value);
            });

            if (!_.isEmpty(invalid_options)) {
                console.warn('Invalid _.App options: ' + Object.keys(invalid_options).join(', '));
            }
            _.extend(this, _.omit(option, Object.keys(invalid_options)));
        } else {
            option += '';
            var deep = option.split(separator || '.');

            if (deep[0][0] === '_') {
                console.warn('Invalid _.App options: ' + deep[0][0]);
                return this;
            }

            _.set(this, deep, value);
        }

        return this;
    };

    /**
     * Add init callback
     * @param {function} callback
     * @param {boolean} [time=1]
     * @param {number} [priority=_.M.PRIORITY_DEFAULT]
     */
    App.prototype.onInit = function (callback, time, priority) {
        this.addListener('init', callback, {
            times: time || 1,
            priority: priority || _.M.PRIORITY_DEFAULT
        });

        return this;
    };

    /**
     * Init App
     * @param {boolean} [reset=false]
     */
    App.prototype.init = function (reset) {
        this.emitEvent('init');

        reset && this.resetEvents('init');
    };

    App.prototype.resetInitCallbacks = function () {
        this.resetEvents('init');
    };

    _.module('App', new App);
})(_);