/**
 * Application
 * @module _.M.App
 * @memberOf _.M
 * @requires _.M.EventEmitter
 */
;(function (_) {
    /**
     *
     * @type {_.M.EventEmitter}
     */
    var app_instance = new _.M.EventEmitter();

    app_instance._event_privates = ['init'];

    /**
     * Option this app
     * @param {string|{}} option
     * @param {*} value
     * @param {string} [separator='.']
     */
    app_instance.option = function (option, value, separator) {
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

            _.M.defineDeep(this, deep, value);
        }

        return this;
    };

    /**
     * Add init callback
     * @param {function} callback
     * @param {boolean} [once=true]
     * @param {number} [priority]
     */
    app_instance.onInit = function (callback, once, priority) {
        var options = _.M.optionalArgs(Array.prototype.slice.call(arguments, 1), ['once', 'priority'], {
            once: 'boolean',
            priority: 'number'
        });

        this.addListener('init', callback, {
            times: !options.hasOwnProperty('once') || !Boolean(options.once) ? 1 : -1,
            priority: options.priority || _.M.PRIORITY_DEFAULT
        });

        return this;
    };

    /**
     * Init App
     * @param {boolean} [reset=false]
     */
    app_instance.init = function (reset) {
        this.emitEvent('init');

        reset && this.resetEvents('init');
    };

    app_instance.resetInitCallbacks = function () {
        this.resetEvents('init');
    };

    _.module('App', app_instance);

})(_);