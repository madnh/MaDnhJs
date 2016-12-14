(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['lodash'], function (_) {
            return (root.EventEmitter = factory(_));
        });
    } else {
        // Browser globals
        root.EventEmitter = factory(root._);
    }
}(this, function (_) {
    var unique_ids = {};

    function uniqueID(prefix) {
        if (!unique_ids.hasOwnProperty(prefix)) {
            unique_ids[prefix] = 0;
        }

        return prefix + ++unique_ids[prefix];
    }


    function EventEmitter() {
        this.id = uniqueID('event_emitter_');
        this._events = {};
        this._listeners = {};
    }

    /**
     *
     * @param {Array} [events]
     * @return {EventEmitter}
     */
    EventEmitter.prototype.reset = function (events) {
        if (!arguments.length) {
            events = _.keys(this._events);
        } else {
            events = _.flatten(_.toArray(arguments));
        }

        var self = this,
            removed = {};

        _.each(events, function (event) {
            if (self._events.hasOwnProperty(event)) {
                _.each(self._events[event], function (event_detail, index_key) {
                    if (unlinkListenerEvent(self, event_detail.listener_key, event, index_key)) {
                        _.set(removed, [event_detail.listener_key, event, index_key].join('.'), true);
                    }
                });

                delete self._events[event];
            }
        });

        _.each(removed, function (removed_events, listener_key) {
            _.each(removed_events, function (index_keys, removed_event) {
                self._listeners[listener_key].events[removed_event] = _.omit(self._listeners[listener_key].events[removed_event], _.keys(index_keys));

                if (_.isEmpty(self._listeners[listener_key].events[removed_event])) {
                    delete self._listeners[listener_key].events[removed_event];
                }
            });
        });

        return this;
    };

    /**
     *
     * @param {EventEmitter} instance
     * @param {string} listener_key
     * @param {string} event
     * @param {string} index_key
     */
    function unlinkListenerEvent(instance, listener_key, event, index_key) {
        if (!instance._listeners.hasOwnProperty(listener_key)) {
            return false;
        }
        if (!instance._listeners[listener_key].events.hasOwnProperty(event)) {
            return false;
        }

        delete instance._listeners[listener_key].events[event][index_key];

        return true;
    }

    /**
     *
     * @param {string|Array} events
     * @param {string|function} listener Listener callback or added listener key
     * @param {number|{}} [options] Options or priority
     * - priority: 500,
     * - times: true, call times, true is unlimited
     * - context: null, Context of callback. If not special will use event instance itself
     * - async: false, emit listener as asynchronous
     *
     * @return {string} Listener key
     * @throws
     * - Listener is not added: When use listener as added listener key and it is not added yet
     */
    EventEmitter.prototype.addListener = function (events, listener, options) {
        var self = this,
            key;

        events = _.uniq(_.castArray(events));
        options = getListenerOptions(this, options);

        if (_.isString(listener)) {
            if (!this._listeners.hasOwnProperty(listener)) {
                throw new Error('Listener is not added');
            }
            key = listener;
        } else {
            key = uniqueID(this.id + '_listener_');
            this._listeners[key] = {
                listener: listener,
                events: {}
            };
        }

        _.each(events, function (event) {
            if (!self._events.hasOwnProperty(event)) {
                self._events[event] = {};
            }

            var target_events = self._events[event],
                index_key = '_' + _.keys(target_events).length;

            target_events[index_key] = _.extend({}, options, {listener_key: key});

            if (!self._listeners[key].events.hasOwnProperty(event)) {
                self._listeners[key].events[event] = {};
            }

            self._listeners[key].events[event][index_key] = true;
        });

        return key;
    };


    EventEmitter.prototype.on = EventEmitter.prototype.addListener;

    /**
     *
     * @param {EventEmitter} instance
     * @param {{}} options
     * @return {*}
     */
    function getListenerOptions(instance, options) {
        if (_.isNumber(options)) {
            options = {
                priority: options
            }
        }

        options = _.defaults(options || {}, {
            priority: 500,
            times: true,
            context: null,
            key: '',
            async: false
        });

        return options;
    }

    /**
     * Check if a listener key is exists
     * @param {string} listener_key
     * @param {boolean} [listening=true] Listener key must is using in any events
     * @return {boolean}
     */
    EventEmitter.prototype.has = function (listener_key, listening) {
        listening = listening || _.isUndefined(listening);

        return this._listeners.hasOwnProperty(listener_key) && (!listening || !_.isEmpty(this._listeners[listener_key].events));
    };

    /**
     * Remove listener
     * @param {string|function} listener Listener itself or listener key
     * @param {string|Array} [events] Remove on special events, default is all of events
     */
    EventEmitter.prototype.removeListener = function (listener, events) {
        var self = this,
            listener_keys = !_.isString(listener) ? getAllListenerKeys(this, listener) : [listener],
            listener_key,
            listener_events,
            target_events;

        if (!listener_keys.length) {
            return;
        }

        while (listener_key = listener_keys.shift()) {
            listener_events = _.keys(this._listeners[listener_key].events);
            target_events = _.isUndefined(events) ? listener_events : _.intersection(_.castArray(events), listener_events);

            _.each(target_events, function (event) {
                if (self._events.hasOwnProperty(event)) {
                    self._events[event] = _.omit(self._events[event], _.keys(self._listeners[listener_key].events[event]));
                    delete self._listeners[listener_key].events[event];
                }
            });
        }
    };
    EventEmitter.prototype.removeListeners = function (listeners, events) {
        var self = this;

        _.each(listeners, function (listener) {
            self.removeListener(listener, events);
        });
    };

    /**
     * Get listener key by content
     * @param {EventEmitter} instance
     * @param {function} listener
     * @return {string|Array|boolean|boolean|{}}
     */
    function getListenerKey(instance, listener) {
        return _.findKey(instance._listeners, function (detail) {
            return detail.listener === listener;
        });
    }

    function getAllListenerKeys(instance, listener) {
        var result = [];

        _.each(instance._listeners, function (detail, listener_key) {
            if (detail.listener === listener) {
                result.push(listener_key);
            }
        });

        return result;
    }

    /**
     * Add once time listener to event
     * @param {string|Array} events
     * @param {string|function} listener
     * @param {number|{}} options
     * @return {string|string|boolean|null} Listener key
     */
    EventEmitter.prototype.addOnceListener = function (events, listener, options) {
        if (_.isNumber(options)) {
            options = {
                priority: options
            }
        } else if (!_.isObject(options)) {
            options = {};
        }

        options.times = 1;

        return this.addListener(events, listener, options);
    };

    /**
     * Add listeners by object
     * @param {{}} events Object of events: object key is name of event, object value is array of events
     * @return {string[]} Listener keys
     */
    EventEmitter.prototype.addListeners = function (events) {
        var events_arr = [],
            self = this,
            keys = [];

        if (_.isObject(events)) {
            _.each(events, function (event_cbs, event_name) {
                event_cbs = _.castArray(event_cbs);

                _.each(event_cbs, function (event_cb) {
                    event_cb = _.castArray(event_cb);
                    events_arr.push({
                        name: event_name,
                        cb: event_cb[0],
                        options: event_cb.length > 1 ? event_cb[1] : {}
                    });
                });
            });
        }

        _.each(events_arr, function (event_info) {
            keys.push(self.addListener(event_info['name'], event_info['cb'], event_info['options']));
        });

        return keys;
    };

    /**
     * Emit event
     * @param {string} event Event name
     * @param {*} [data...] Event data
     */
    EventEmitter.prototype.emitEvent = function (event, data) {
        data = Array.prototype.slice.call(arguments, 1);

        if (this._events.hasOwnProperty(event)) {
            _emit_event(this, event, data);
        }

        //@TODO: notice events here

        if (event !== 'event_emitted') {
            _emit_event(this, 'event_emitted', [event].concat(data));
        }
        _emit_event(this, event + '_complete', data);
    };

    /**
     * Similar to method emitEvent but do a callback after event is emitted
     * @param {string} event Event name
     * @param {function} final_cb Callback will receive parameter is data assigned to this method
     * @param {*} [data...]
     */
    EventEmitter.prototype.emitEventThen = function (event, final_cb, data) {
        data = Array.prototype.slice.call(arguments, 2);
        this.emitEvent.apply(this, [event].concat(data));

        final_cb.apply(this, data);
    };

    function _emit_event(instance, event_name, data) {
        var listeners;

        if (!instance._events.hasOwnProperty(event_name)) {
            return
        }

        listeners = getListeners(instance, event_name);

        if (!listeners.length) {
            return;
        }

        _.each(listeners, function (listener_detail) {
            if (listener_detail.times === true || listener_detail.times > 0) {
                (listener_detail.async ? async_callback : do_callback)(listener_detail.listener, data, listener_detail.context || instance);

                if (listener_detail.times === true) {
                    return;
                }

                listener_detail.times--;

                if (listener_detail.times > 0) {
                    instance._events[event_name][listener_detail.event_index_key].times = listener_detail.times;

                    return;
                }
            }

            instance.removeListener(listener_detail.listener_key, event_name);
        });
    }

    /**
     *
     * @param {EventEmitter} instance
     * @param {string} event
     * @return {Array}
     */
    function getListeners(instance, event) {
        if (!instance._events.hasOwnProperty(event)) {
            return [];
        }

        var listeners = [];

        _.each(instance._events[event], function (event_detail, index_key) {
            if (instance._listeners.hasOwnProperty(event_detail.listener_key)) {
                event_detail.listener = instance._listeners[event_detail.listener_key].listener;
                event_detail.event_index_key = index_key;

                listeners.push(_.cloneDeep(event_detail));
            }
        });

        return _.sortBy(listeners, 'priority');
    }

    function do_callback(callback, args, context) {
        if (arguments.length >= 2) {
            args = _.castArray(args);
        } else {
            args = [];
        }

        if (callback) {
            if (_.isArray(callback)) {
                var result = [];

                _.each(callback, function (callback_item) {
                    result.push(callback_item.apply(context || null, args));
                });

                return result;
            } else if (_.isFunction(callback)) {
                return callback.apply(context || null, args);
            }
        }

        return undefined;
    }

    function async_callback(callback, args, delay, context) {
        delay = parseInt(delay);
        if (_.isNaN(delay) || !_.isFinite(delay)) {
            delay = 1;
        }

        return setTimeout(function () {
            do_callback(callback, args, context || null);
        }, Math.max(1, delay));
    }

    EventEmitter.isEventEmitter = function (object) {
        return object instanceof EventEmitter;
    };

    return EventEmitter;
}));