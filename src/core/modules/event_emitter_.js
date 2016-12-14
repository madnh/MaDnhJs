(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['lodash', 'Priority'], function (_, Priority) {
            return (root.EventEmitter = factory(_, Priority));
        });
    } else {
        // Browser globals
        root.EventEmitter = factory(root._, root.Priority);
    }
}(this, function (_, Priority) {
    function EventEmitter(options) {
        this.id = _.uniqueId('event_emitter_');

        options = _.defaults(options || {}, {
            'events': {},
            'event_mimics': [],
            'event_privates': []
        });

        /**
         *
         * @type {{Priority}}
         * @private
         */
        this._events = {};
        /**
         *
         * @type {{}}
         * @private
         */
        this._event_emitted = {};


        /**
         *
         * @type {{}}
         * @private
         */
        this._event_followers = {};

        /**
         *
         * @type {{}}
         * @private
         */
        this._event_following = {};

        /**
         * Mimic events when noticed from other EventEmitter
         * @type {Array}
         * @private
         */
        this._event_mimics = [];

        /**
         *
         * @type {Array}
         * @private
         */
        this._event_privates = ['attach', 'attached'];

        if (!_.isObject(options['events'])) {
            this.addListeners(options['events']);
        }
        if (!_.isEmpty(options['event_mimics'])) {
            this.mimic(_.castArray(options['event_mimics']));
        }
        if (!_.isEmpty(options['event_privates'])) {
            this.private(_.castArray(options['event_privates']));
        }
    }

    /**
     * Reset events
     * @param {string} [event] Special event to reset, if not, reset all events
     */
    EventEmitter.prototype.resetEvents = function (event) {
        if (event) {
            if (this._events.hasOwnProperty(event)) {
                delete this._events[event];
                delete this._event_emitted[event];
            }
        } else {
            this._events = {};
            this._event_emitted = {};
        }
    };
    /**
     * Alias of resetEvents
     * @see resetEvents
     */
    EventEmitter.prototype.reset = function (event) {
        return this.resetEvents(event);
    };
    /**
     * Get all events name
     * @param {boolean} count Return events listeners count
     * @return {Object|Array}
     */
    EventEmitter.prototype.events = function (count) {
        if (count) {
            var result = {};
            var self = this;

            Object.keys(this._events).forEach(function (event) {
                result[event] = self._events[event].priority.status().contents;
            });

            return result;
        }
        return Object.keys(this._events);
    };
    /**
     * Get event emitted count
     * @param {string} event Event name, if not special then return all of emitted events
     * @returns {(number|{})}
     */
    EventEmitter.prototype.emitted = function (event) {
        if (!_.isUndefined(event)) {
            return this._event_emitted.hasOwnProperty(event) ? this._event_emitted[event] : 0;
        }

        return _.clone(this._event_emitted);
    };

    /**
     * Add event listener
     * @param {string|string[]} events Array of events name
     * @param {(string|function|Array)} listeners Event listener
     * @param {object} [option] Option is object with keys:
     * priority {@see Priority.PRIORITY_DEFAULT},
     * times (true is forever) - call times,
     * context (this event emitter instance) - context for callback,
     * key (auto increment of key: event_emitter_key_) - listener key. Useful when remove listener
     * @returns {string|boolean|null} Listener key or false on fail
     */
    EventEmitter.prototype.addListener = function (events, listeners, option) {
        var self = this;

        listeners = _.castArray(listeners);
        events = _.uniq(_.castArray(events));

        if (!listeners.length) {
            return false;
        }

        add_listener__prepare_events(this, events);
        option = add_listener__get_option(option);

        _.each(events, function (event) {
            var event_detail = self._events[event];
            var keys = add_listener__add_listeners(self, event, listeners, option);

            if (!event_detail.key_mapped.hasOwnProperty(option.key)) {
                event_detail.key_mapped[option.key] = keys;
            } else {
                event_detail.key_mapped[option.key] = _.concat(event_detail.key_mapped[option.key], keys);
            }
        });

        return option.key;
    };

    function add_listener__prepare_events(ee, events) {
        _.each(events, function (event) {
            if (!ee._events.hasOwnProperty(event)) {
                ee._events[event] = {
                    priority: new Priority(),
                    key_mapped: {}
                };
            }
        });
    }

    /**
     *
     * @param option
     * @returns {{priority, times, context, key, async}}
     */
    function add_listener__get_option(option) {
        if (_.isNumber(option)) {
            option = {
                priority: option
            }
        }

        option = _.defaults(option || {}, {
            priority: Priority.PRIORITY_DEFAULT,
            times: true,
            context: null,
            key: '',
            async: false
        });

        if (!option.key) {
            option.key = _.uniqueId('event_emitter_listener_');
        }

        return option;
    }

    /**
     *
     * @param {EventEmitter} ee
     * @param {string} event
     * @param {callback|callback[]} listeners
     * @param {{}} option
     * @return {string[]}
     */
    function add_listener__add_listeners(ee, event, listeners, option) {
        var keys = [],
            event_detail = ee._events[event];

        _.each(_.castArray(listeners), function (listener) {
            var key = event_detail.priority.add({
                listener: listener,
                listener_key: option.key,
                async: option.async,
                times: option.times,
                event: event
            }, option.priority);

            keys.push(key);
        });

        return keys;
    }

    /**
     * Check if a key is exists
     * @param {string} key
     * @param {string|string[]} [events]
     * @return {boolean}
     */
    EventEmitter.prototype.has = function (key, events) {
        events = _get_valid_events(this, events);

        if (_.isEmpty(events)) {
            return false;
        }

        var index, found = false, self = this;

        for (index in events) {
            if (events.hasOwnProperty(index)
                && self._events[events[index]].key_mapped.hasOwnProperty(key)
            ) {
                found = true;
                break;
            }
        }

        return found;
    };
    /**
     *
     * @param instance
     * @param {Array} [events]
     * @return {Array}
     * @private
     */
    function _get_valid_events(instance, events) {
        if (!events) {
            return _.keys(instance._events);
        }

        return _.intersection(_.castArray(events), _.keys(instance._events));
    }


    /**
     * @see addListener
     */
    EventEmitter.prototype.on = function (event, listener, option) {
        return this.addListener.apply(this, _.toArray(arguments));
    };
    /**
     * Add once time listener
     * @param events
     * @param listeners
     * @param option
     * @returns {string}
     */
    EventEmitter.prototype.addOnceListener = function (events, listeners, option) {
        if (_.isNumber(option)) {
            option = {
                priority: option,
                times: 1
            }
        } else if (!_.isObject(option)) {
            option = {
                times: 1
            };
        }


        return this.addListener(events, listeners, option);
    };

    /**
     * @see addOnceListener
     */
    EventEmitter.prototype.once = function (events, listener, option) {
        return this.addOnceListener.apply(this, _.toArray(arguments));
    };

    /**
     * Add listeners by object
     * @param {{}} events Object of events: object key is name of event, object value is array of events
     * @return {string[]} Listener keys
     */
    EventEmitter.prototype.addListeners = function (events) {
        var events_arr = [], self = this, keys = [];

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
     * Emit event. Each event emitted will emit a event called 'event_emitted', with event emitted and it's data
     * @param {string|string[]} events Array of events
     * @param {*} [data]
     * @param {Function} [final_cb]
     */
    EventEmitter.prototype.emitEvent = function (events, data, final_cb) {
        var self = this;

        _.each(_.castArray(events), function (event) {
            if (self._events.hasOwnProperty(event)) {
                _emit_event(self, event, _.clone(data));
            }
            if (event !== 'event_emitted') {
                _emit_event(self, 'event_emitted', [event, _.clone(data)]);
            }
            if (_is_need_to_notice(self, event)) {
                _notice_event(self, event, _.clone(data));
            }

            _emit_event(self, event + '_complete', _.clone(data));
        });

        if (final_cb) {
            final_cb.call(this);
        }
    };

    function _emit_event(instance, event_name, data) {
        var emitted = false,
            listeners;

        if (instance._events.hasOwnProperty(event_name)) {
            listeners = instance._events[event_name].priority.export(true);

            if (listeners.length) {
                emitted = true;
                _.each(listeners, function (listener_detail) {
                    if (listener_detail.times === true || listener_detail.times > 0) {
                        (listener_detail.async ? async_callback : do_callback)(listener_detail.listener, data, listener_detail.context || instance);

                        if (listener_detail.times === true) {
                            return;
                        }

                        listener_detail.times--;

                        if (listener_detail.times > 0) {
                            instance._events[event_name].priority.update(listener_detail.priority_key, listener_detail);

                            return;
                        }
                    }

                    _remove_listener(instance, event_name, listener_detail.listener_key, listener_detail.priority_key);
                });
            }
        }
        if (!instance._event_emitted.hasOwnProperty(event_name)) {
            instance._event_emitted[event_name] = 1;
        } else {
            instance._event_emitted[event_name] += 1;
        }

        return emitted;
    }

    function _remove_listener(instance, event, listener_key, priority_key) {
        console.log('Remove', listener_key, priority_key);
        if (!instance._events.hasOwnProperty(event) || !instance._events[event].key_mapped.hasOwnProperty(listener_key)) {
            return;
        }

        instance._events[event].priority.remove(priority_key);
        instance._events[event].key_mapped[listener_key] = _.without(instance._events[event].key_mapped[listener_key], priority_key);

        if (!instance._events[event].key_mapped[listener_key].length) {
            delete instance._events[event].key_mapped[listener_key];
        }
    }

    function _is_need_to_notice(instance, event_name) {
        return 'event_emitted' !== event_name
            && -1 == instance._event_privates.indexOf(event_name)
            && !_.isEmpty(instance._event_followers);
    }

    function _notice_event(instance, event_name, data) {
        _.each(instance._event_followers, function (follower) {
            (follower.async ? async_callback : do_callback)(_.partial(_notice_event_cb, follower), [instance.id, event_name, data], instance);
        });
    }

    function _notice_event_cb(follower, source_id, source_event, source_data) {
        follower.target.notice(source_id, source_event, source_data);
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

    /**
     * Alias of 'emitEvent'
     * @see emitEvent
     */
    EventEmitter.prototype.emit = function () {
        this.emitEvent.apply(this, _.toArray(arguments));
    };

    /**
     * Remove listener by key
     * @param {string|Function|Array} removes Listener / listener key or array of them
     * @param {string[]} [events]
     * @param {number} [priority]
     */
    EventEmitter.prototype.removeListener = function (removes, events, priority) {
        var self = this, removed = {}, removes_by_keys, remove_by_listeners;

        removes = _.castArray(removes);
        events = _get_valid_events(self, events);

        removes_by_keys = _.filter(removes, _.isString);
        remove_by_listeners = _.filter(removes, _.isFunction);

        if (removes_by_keys.length) {
            removed = _remove_listener_by_keys(self, removes_by_keys, events, priority);
        }
        if (remove_by_listeners.length) {
            _merge_object_item(removed, _remove_listener_by_listeners(self, remove_by_listeners, events, priority));
        }

        _.each(events, function (event) {
            if (_.isEmpty(self._events[event].key_mapped)) {
                delete self._events[event];
            }
        });

        return removed;
    };


    /**
     *
     * @param instance
     * @param keys
     * @param {Array} events Valid events
     * @return {{}}
     * @private
     */
    function _group_keys_by_event(instance, keys, events) {
        var grouped = {},
            event,
            found,
            events_cloned = _.clone(events);

        while (keys.length && (event = events_cloned.shift())) {
            found = _.intersection(keys, _.keys(instance._events[event].key_mapped));

            if (found.length) {
                grouped[event] = found;
                keys = _.difference(keys, found);
            }
        }

        return grouped;
    }

    function _remove_listener_by_keys(instance, keys, events) {
        var keys_grouped_by_event = _group_keys_by_event(instance, keys, events),
            event_detail;

        _.each(keys_grouped_by_event, function (keys, event) {
            event_detail = instance._events[event];
            event_detail.priority.remove(_.flatten(_.values(_.pick(event_detail.key_mapped, keys))));

            event_detail.key_mapped = _.omit(event_detail.key_mapped, keys);
            instance._events[event] = event_detail;
        });

        return keys_grouped_by_event;
    }

    function _find_keys_by_listener(listener, compare_content) {
        return listener === compare_content.listener;
    }

    function _remove_listener_by_listeners(instance, listeners, events) {
        var removed = {},
            priority_keys_removed;

        _.each(listeners, function (listener) {
            var callback = _.partial(_find_keys_by_listener, listener);

            _.each(events, function (event) {
                var keys = instance._events[event].priority.findAllBy(callback);

                if (false == keys) {
                    return;
                }

                priority_keys_removed = instance._events[event].priority.remove(keys);

                if (priority_keys_removed.length) {
                    var removed_grouped_by_listener_key = _remove_key_mapped_by_priority_keys(instance._events[event].key_mapped, priority_keys_removed);
                    var tmp_obj = {};

                    tmp_obj[event] = Object.keys(removed_grouped_by_listener_key);
                    _merge_object_item(removed, tmp_obj);
                }
            });
        });

        return removed;
    }


    /**
     *
     * @param key_mapped
     * @param priority_keys
     * @return {{}} Object, Event key => priority keys
     * @private
     */
    function _remove_key_mapped_by_priority_keys(key_mapped, priority_keys) {
        var found, keys = Object.keys(key_mapped), key, removed = {};

        while (priority_keys.length && (key = keys.shift())) {
            found = _.intersection(priority_keys, key_mapped[key]);

            if (found.length) {
                key_mapped[key] = _.difference(key_mapped[key], found);

                if (!key_mapped[key].length) {
                    delete key_mapped[key];
                }

                priority_keys = _.difference(priority_keys, found);
                removed[key] = found;
            }
        }

        return removed;
    }

    /**
     * Merge each item of an object with item of other object
     * @param {{}} target
     * @param {{}} object
     */
    function _merge_object_item(target, object) {
        _.each(object, function (value, key) {
            value = _.castArray(value);

            if (!target.hasOwnProperty(key)) {
                target[key] = value;
            } else {
                target[key] = _.concat(target[key], value);
            }
        });
    }

    /**
     * Alias of `removeListener`
     * @see removeListener
     */
    EventEmitter.prototype.off = function () {
        return this.removeListener.apply(this, _.toArray(arguments));
    };

    /**
     * Set events is private
     */
    EventEmitter.prototype.private = function () {
        this._event_mimics = _.concat(this._event_privates, _.flatten(_.toArray(arguments)));
    };

    /**
     * Set events is mimic
     */
    EventEmitter.prototype.mimic = function () {
        this._event_mimics = _.concat(this._event_mimics, _.flatten(_.toArray(arguments)));
    };

    /**
     * Attach other event emitter to this. Notice async
     * @param {EventEmitter} eventEmitter
     * @param {Array} [only]
     * @param {Array} [excepts]
     * @param {boolean} [async=true] notice target EventEmitter async. Default is true
     * @returns {boolean}
     */
    EventEmitter.prototype.attach = function (eventEmitter, only, excepts, async) {
        if (!EventEmitter.isEventEmitter(eventEmitter)) {
            throw new Error('Invalid EventEmitter instance');
        }
        if (!this._event_followers.hasOwnProperty(eventEmitter.id)) {
            this._event_followers[eventEmitter.id] = {
                target: eventEmitter,
                async: _.isUndefined(async) || Boolean(async)
            };
            this.emitEvent('attach', [eventEmitter, only, excepts]);
            eventEmitter.attachTo(this, only, excepts);
            return true;
        }

        return false;
    };

    /**
     * Check if has an EE instance is attached to this
     * @param {EventEmitter} eventEmitter
     * @return {boolean}
     */
    EventEmitter.prototype.hasFollower = function (eventEmitter) {
        return EventEmitter.isEventEmitter(eventEmitter) && this._event_followers.hasOwnProperty(eventEmitter.id);
    };

    /**
     * Attach other event emitter to this. Notice sync
     * @param {EventEmitter} eventEmitter
     * @param only
     * @param excepts
     * @return boolean
     */
    EventEmitter.prototype.attachHard = function (eventEmitter, only, excepts) {
        return this.attach(eventEmitter, only, excepts, false);
    };
    /**
     * Attach this to other event emitter instance. Notice async
     * @param {EventEmitter} eventEmitter
     * @param {Array} [only]
     * @param {Array} [excepts]
     * @param {boolean} [hard=false] Hard attach to other, other notice will call immediate. Default is false
     * @returns {boolean}
     */
    EventEmitter.prototype.attachTo = function (eventEmitter, only, excepts, hard) {
        if (!EventEmitter.isEventEmitter(eventEmitter)) {
            throw new Error('Invalid EventEmitter instance');
        }
        if (!this._event_following.hasOwnProperty(eventEmitter.id)) {
            this._event_following[eventEmitter.id] = {
                id: eventEmitter.id,
                type: eventEmitter.constructor.name,
                only: _.castArray(only || []),
                excepts: _.castArray(excepts || [])
            };
            this.emitEvent('attached', [eventEmitter, only, excepts]);

            if (hard) {
                return eventEmitter.attachHard(this);
            }

            return eventEmitter.attach(this);

        }

        return true;
    };

    /**
     * Check if this one is following another EE instance
     * @param {EventEmitter} eventEmitter
     * @return {boolean}
     */
    EventEmitter.prototype.isFollowing = function (eventEmitter) {
        return EventEmitter.isEventEmitter(eventEmitter) && this._event_following.hasOwnProperty(eventEmitter.id);
    };

    /**
     * Hard Attach this to other event emitter instance. Notice sync
     * @param {EventEmitter} eventEmitter
     * @param {Array} [only]
     * @param {Array} [excepts]
     * @returns {boolean}
     */
    EventEmitter.prototype.attachHardTo = function (eventEmitter, only, excepts) {
        return this.attachTo(eventEmitter, only, excepts, true);
    };

    /**
     * Notice following event emitter emitted. If noticed event is a mimic event then do not emit any notice events.
     * Emit events:
     * - <source id>.<event name>
     * - <source type>.<event name>,
     * - noticed.<source id>.<event name>
     * - noticed.<source id>
     * - noticed.<source type>.<event name>
     * - noticed.<source type>
     * - noticed
     *
     * Each notice event emit with data as object:
     * - id: source id
     * - type: source type
     * - event: source event name
     * - data: source event data
     *
     * @param {string} sourceID Following event emitter id
     * @param {string} eventName Event emitted
     * @param {*} data
     */
    EventEmitter.prototype.notice = function (sourceID, eventName, data) {
        if (this._event_following.hasOwnProperty(sourceID)) {
            var following_info = this._event_following[sourceID],
                self = this;

            if ((_.isEmpty(following_info.only) || -1 !== following_info.only.indexOf(eventName))
                && (_.isEmpty(following_info.excepts) || -1 === following_info.excepts.indexOf(eventName))) {

                var mimic_events = [
                    eventName,
                    following_info.type + '.*',
                    following_info.type + '.' + eventName
                ];

                if (!_.isEmpty(_.intersection(mimic_events, self._event_mimics))) {
                    self.emitEvent(eventName, data);

                    return;
                }

                var notice_data = {
                        id: following_info.id,
                        type: following_info.type,
                        event: eventName,
                        data: data
                    },
                    notice_events = [
                        following_info.id + '.' + eventName,
                        following_info.type + '.' + eventName,
                        'noticed.' + following_info.id + '.' + eventName,
                        'noticed.' + following_info.id,
                        'noticed.' + following_info.type + '.' + eventName,
                        'noticed.' + following_info.type,
                        'noticed'
                    ];

                this.emitEvent(notice_events, notice_data);
            }
        }
    };

    /**
     * Detach a followed event emitter
     * @param {EventEmitter} eventEmitter
     * @returns {boolean}
     */
    EventEmitter.prototype.detach = function (eventEmitter) {
        if (!EventEmitter.isEventEmitter(eventEmitter)) {
            throw new Error('Invalid EventEmitter instance');
        }
        if (this._event_followers.hasOwnProperty(eventEmitter.id)) {
            this.emitEvent('detach', [eventEmitter]);
            delete this._event_followers[eventEmitter.id];
            eventEmitter.detachFrom(this);

            return true;
        }

        return false;

    };

    /**
     * Detach a following event emitter
     * @param {EventEmitter} eventEmitter
     * @returns {boolean}
     */
    EventEmitter.prototype.detachFrom = function (eventEmitter) {
        if (!EventEmitter.isEventEmitter(eventEmitter)) {
            throw new Error('Invalid EventEmitter instance');
        }
        if (this._event_following.hasOwnProperty(eventEmitter.id)) {
            this.emitEvent('detached', [eventEmitter]);
            delete this._event_following[eventEmitter.id];
            eventEmitter.detach(this);

            return true;
        }
        return false;
    };

    EventEmitter.isEventEmitter = function (object) {
        return object instanceof EventEmitter;
    };

    return EventEmitter;
}));