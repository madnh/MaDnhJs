(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['lodash', 'madnh', 'event_emitter'], function (_, M, EventEmitter) {
            return (root.App = factory(_, M, EventEmitter));
        });
    } else {
        // Browser globals
        var App = factory(root._, root.M, root.EventEmitter);

        /**
         * Support App from https://gist.github.com/madnh/53a16ae3842e16815c0fd36283843a9b
         * @type {*}
         */
        var old_app = root.App || null;

        if (old_app) {
            if (_.isArray(old_app.init_callbacks) && old_app.init_callbacks.length) {
                _.each(old_app.init_callbacks, function (cb) {
                    App.onInit(cb);
                });

                old_app.init_callbacks = [];
                delete old_app.init_callbacks;
            }

            App = _.defaults(App, _.omit(old_app, 'init_callbacks'));
        }

        root.App = App;
    }
}(this, function (_, M, EventEmitter) {
    var root = this;

    function App() {
        EventEmitter.call(this);

        this.private('init');
    }

    M.inherit(App, EventEmitter);

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
     * @param {number} [priority = 500]
     */
    App.prototype.onInit = function (callback, priority) {
        this.addOnceListener('init', callback, {
            priority: priority
        });

        return this;
    };

    /**
     * Init App
     */
    App.prototype.init = function () {
        this.emitEvent('init');
        this.reset('init');
    };

    return new App();
}));