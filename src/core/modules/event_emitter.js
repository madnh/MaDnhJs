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

        /**
         * Events, object with key is event name, object is an object with:
         * - key: index of listener, _{number}
         * - value: object, listener detail
         *  + priority: number, default is 500
         *  + times: number or true, limit of emit times
         *  + context: object|null, listener context, use event emitter instance if this value is not special
         *  + key: string, use to index listener (if need)
         *  + async: call listener in asynchronous mode
         *  + listener_key: added listener key
         *
         * @type {{}}
         * @private
         */
        this._events = {};

        /**
         * Listeners
         * - key: listener key,
         * - value:
         *  + listener: listener callback
         *  + events: object with key is event name, value is object with:
         *     + key: event index, _{number}
         *     + value: true
         *
         * @type {{}}
         */
        this._listeners = {};

        /**
         * Listening instances
         * - key: instance id
         * - value: listen detail
         *  + name: instance name
         *  + listener_key: listener key of added event (on target instance), ready to remove listening
         *  + only: true|string[], only accept events, if is true then accept all of events
         *  + except: [], except events
         *  + async: boolean, listen in asynchronous mode, default is true
         *  + add_method: string|function, method name to call when establish connect to listen instance, default is addListener. If this value is a function, then callback will receive parameters:
         *      + event emitter instance
         *      + target event emitter
         *      + listen detail
         *      + listen callback: function, parameters are:
         *          + event emitted,
         *          + emitted data...
         *
         *      + add listen options
         *
         *      Result of this function will use as listener key
         *
         *  + remove_method: string, method name to call when remove added listen to other instance, default is removeListener. If this value is a function, then callback will receive parameters:
         *      + event emitter instance
         *      + target event emitter
         *      + listener key
         *      + listen detail
         *  + event: string, event to add to, default is 'notify'
         *  + mimics: true|array, list of events that will emit as event of this event emitter. True will mimic all of events. Default is empty array
         *
         * @type {{}}
         */
        this._listening = {};

        /**
         * Object of mimic events
         * - key: event name
         * - value: true
         *
         * @type {boolean|{}}
         */
        this._mimics = {};
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
                index_key = '_' + _.size(target_events);

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

    EventEmitter.prototype.isListening = function (target) {
        var id = target.id || target;

        if (_.isEmpty(id) && id !== 0) {
            throw new Error('Check listening object with invalid ID');
        }

        if (this._listening.hasOwnProperty(id) && (!_.isObject(target) || this._listening[id].target === target)) {
            return true;
        }

        id = get_listen_id(this, id);

        return !_.isUndefined(id);
    };

    /**
     * Get listening ID from name
     * @param {EventEmitter} instance
     * @param {string} name
     * @return {string|undefined}
     */
    function get_listen_id(instance, name) {
        if (instance._listening.hasOwnProperty(name)) {
            return name;
        }
        return _.findKey(instance._listening, ['name', name]);
    }

    /**
     *
     * @param {EventEmitter} target
     * @param name
     * @param options
     * @return {string|boolean}
     */
    EventEmitter.prototype.listen = function (target, name, options) {
        if (!EventEmitter.isEventEmitter(target)) {
            throw new Error('Listen target must be an instance of EventEmitter');
        }
        if (this.isListening(target)) {
            return true;
        }
        if (!_.isString(name)) {
            options = name;
            name = target.id;
        }
        if (_.isArrayLike(options)) {
            options = {
                only: _.castArray(options)
            }
        }

        options = _.default(options || {}, {
            name: name,
            only: true,
            except: [],
            async: true,
            add_method: 'addListener',
            remove_method: 'removeListener',
            event: 'notify',
            mimics: []
        });

        var callback = _.partial(listen_callback, this, name);
        var listen_options = {
            async: options.async
        };

        if (_.isString(options.add_method)) {
            options.listener_key = target[options.add_method](options.event, callback, listen_options);
        } else {
            options.listener_key = options.add_method(this, target, options, callback, listen_options);
        }

        if (_.isUndefined(options.listener_key) || _.isNull(options.listener_key)) {
            throw new Error('Added listener key received by add method is invalid');
        }

        this._listening[target.id] = options;

        return options.listener_key;
    };

    /**
     * Emit event
     * @param {EventEmitter} host
     * @param {string} name Instance named
     * @param {string} event Event name
     * @param {*} [data...] Event data
     */
    function listen_callback(host, name, event, data) {
        var source = this;

        if (!host.isListening(source)) {
            return;
        }
        var listen_detail = host._listening[source.id];

        if (!is_valid_event(event, listen_detail.only, listen_detail.except)) {
            return;
        }

        var event_data = Array.prototype.slice.call(arguments, 3);
        var events = [
            name + '.' + event,
            source.id + '.' + event
        ];

        if (host.isMimic(event, source.id)) {
            events.push(event);
        }

        _.each(events, function (target_event) {
            host.emitEvent.apply(host, [target_event].concat(event_data));
        });
    }

    function is_valid_event(event, only, except) {
        if (-1 !== event.indexOf(_.castArray(except))) {
            return false;
        }

        return true === only || -1 !== only.indexOf(event);
    }

    EventEmitter.prototype.unlisten = function (target, events) {
        if (!arguments.length) {
            _.map(_.keys(this._listening), _.partial(un_listen, this));

            this._listeners = {};
            return;
        }
        if (!this.isListening(target)) {
            return;
        }

        var id = target.id || target,
            detail = this._listening[id];

        if (_.isUndefined(events)) {
            un_listen(this, id);
        } else {
            detail.except = detail.except.concat(_.flatten(Array.prototype.slice.call(arguments, 1)));
        }
    };

    function un_listen(instance, listen_id) {
        var detail = instance._listening[listen_id];

        if (!detail) {
            return;
        }
        if (_.isString(detail.remove_method)) {
            detail.target[detail.remove_method](detail.listener_key);
        } else {
            detail.remove_method(instance, detail.target, detail.listener_key, detail);
        }


        delete instance._listening[listen_id];
    }

    /**
     * Check if an event is call as mimic
     * @param {string} event
     * @param {object|string} target Object which has ID field or listen instance ID or listen instance name
     * @return {boolean}
     */
    EventEmitter.prototype.isMimic = function (event, target) {
        if (_.isBoolean(this._mimics)) {
            return this._mimics;
        }
        if (target) {
            target = target.id || target;
        }
        if ((_.isUndefined(target) && this._mimics.hasOwnProperty(event))
            || this._mimics.hasOwnProperty(target)
            || this._mimics.hasOwnProperty(target + '.*')
            || this._mimics.hasOwnProperty(target + '.' + event)) {

            return true;
        }
        if (target) {
            target = get_listen_id(this, target);

            if (true === this._listening[target].mimics
                || (_.isArray(this._listening[target].mimics) && -1 !== this._listening[target].mimics.indexOf(event))) {
                return true;
            }
        }

        return false;
    };

    /**
     * Mimic events
     * - no parameters: set instance's mimic status is true
     * - (boolean): set instance's mimic status is true|false
     * - (listen_object_or_id): listening object or id
     * - (boolean, listen_object_or_id): set mimic status of listening object is true|false
     * - (events, listen_object_or_id): add events to mimic list of listening object
     * @param [events]
     * @param [target]
     * @return {boolean}
     */
    EventEmitter.prototype.mimic = function (events, target) {
        if (!arguments.length) {
            this._mimics = true;

            return true;
        }
        var id;

        if (1 === arguments.length) {
            if (_.isBoolean(arguments[0])) {
                this._mimics = arguments[0];
            } else if (!_.isArray(arguments[0])) {
                id = arguments[0].id || get_listen_id(this, arguments[0]) || arguments[0];

                if (!this.isListening(id)) {
                    return false;
                }

                this._listening[id].mimics = true;
            } else {
                if (!_.isArray(this._mimics)) {
                    this._mimics = [];
                }

                this._mimics = this._mimics.concat(_.castArray(events));
            }

            return true;
        }

        id = target.id || get_listen_id(this, target) || target;

        if (this.isListening(id)) {
            if (_.isBoolean(events)) {
                this._listening[id].mimics = events;
            } else {
                if (!_.isArray(this._listening[id].mimics)) {
                    this._listening[id].mimics = [];
                }

                this._listening[id].mimics = this._listening[id].mimics.concat(_.castArray(events));
            }

            return true;
        }

        return false;
    };


    EventEmitter.isEventEmitter = function (object) {
        return object instanceof EventEmitter;
    };

    return EventEmitter;
}));