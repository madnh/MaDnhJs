/**
 * @module _.M.EventEmitter
 * @memberOf _.M
 * @requires _.M.Priority
 */
;(function (_) {
    _.M.defineConstant({
        /**
         * Default limit event't listeners
         * @name _.M.EVENT_EMITTER_EVENT_LIMIT_LISTENERS
         * @constant {number}
         * @default
         */
        EVENT_EMITTER_EVENT_LIMIT_LISTENERS: 10,

        /**
         * Unlimited event's listeners
         * @name _.M.EVENT_EMITTER_EVENT_UNLIMITED
         * @constant {number}
         * @default
         */
        EVENT_EMITTER_EVENT_UNLIMITED: -1

    });

    /**
     * Event management system
     * @class _.M.EventEmitter
     * @extends _.M.BaseClass
     */
    function EventEmitter(limit) {
        this.type_prefix = 'event_emitter';

        _.M.BaseClass.call(this);

        /**
         *
         * @type {{_.M.Priority}}
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
         * @private
         */
        this._limit = (limit || _.M.EVENT_EMITTER_EVENT_LIMIT_LISTENERS) + 0;

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
        this._event_privates = [];
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
            return _.has(this._event_emitted, event) ? parseInt(this._event_emitted[event]) : 0;
        }
        return _.clone(this._event_emitted);
    };

    /**
     * Set event listener limit
     * @param {int} [limit]
     */
    EventEmitter.prototype.limit = function (limit) {
        this._limit = limit + 0;
    };

    /**
     * Set unlimited for event listeners
     */
    EventEmitter.prototype.unlimited = function () {
        this._limit = _.M.EVENT_EMITTER_EVENT_UNLIMITED;
    };

    /**
     * Add event listener
     * @param {string} event Event name
     * @param {(string|function|Array)} listeners Event listener
     * @param {object} option Option is object with keys:
     * priority {@see _.M.PRIORITY_DEFAULT},
     * times (-1 - forever) - call times,
     * context (this event emitter instance) - context for callback,
     * key (auto increment of key: event_emitter_key_) - listener key. Useful when remove listener
     * @returns {string|boolean|null} Listener key or false on fail
     */
    EventEmitter.prototype.addListener = function (event, listeners, option) {
        var self = this;
        if (_.M.isNumeric(option)) {
            option = {
                priority: option
            }
        }

        option = _.defaults(option || {}, {
            priority: _.M.PRIORITY_DEFAULT,
            times: -1,
            context: null,
            key: null,
            async: false
        });
        listeners = _.M.asArray(listeners);
        if (!this._events.hasOwnProperty(event)) {
            this._events[event] = {
                priority: new _.M.Priority(),
                key_mapped: {}
            };
        } else if (this._limit != _.M.EVENT_EMITTER_EVENT_UNLIMITED) {
            var status = this._events[event].priority.status();

            if (status.contents + listeners.length > this._limit) {
                console.warn('Possible _.M.EventEmitter memory leak detected. '
                    + (status.contents + listeners.length) + ' listeners added (limit is ' + this._limit
                    + '). Use emitter.limit() or emitter.unlimited to resolve this warning.'
                );
            }
        }


        if (listeners.length) {
            if (option.key === null) {
                option.key = _.M.nextID('event_emitter_listener', true);
            }
            var keys = [];
            _.M.loop(listeners, function (listener) {
                if (option.context) {
                    listener = listener.bind(option.context);
                }

                if (option.times != -1) {
                    listener = _.before(option.times + 1, listener);
                }

                keys.push(self._events[event].priority.addContent(listener, option.priority, {
                    listener_key: option.key,
                    async: option.async
                }));
            });
            if (!_.has(this._events[event].key_mapped, option.key)) {
                this._events[event].key_mapped[option.key] = keys;
            } else {
                this._events[event].key_mapped[option.key] = this._events[event].key_mapped[option.key].concat(keys);
            }

            return option.key;
        }

        return false;
    };

    /**
     * @see addListener
     */
    EventEmitter.prototype.on = function (event, listener, option) {
        return this.addListener.apply(this, arguments);
    };

    /**
     * Add once time listener
     * @param event
     * @param listener
     * @param option
     * @returns {string}
     */
    EventEmitter.prototype.addOnceListener = function (event, listener, option) {
        if (_.M.isNumeric(option)) {
            option = {
                priority: option,
                times: 1
            }
        } else if (!_.isObject(option)) {
            option = {
                times: 1
            };
        }


        return this.addListener(event, listener, option);
    };

    /**
     * @see addOnceListener
     */
    EventEmitter.prototype.once = function (event, listener, option) {
        return this.addOnceListener.apply(this, arguments);
    };

    /**
     * Add listeners by object
     * @param {{}} events Object of events: object key is name of event, object value is array of events
     */
    EventEmitter.prototype.addListeners = function (events) {
        var events_arr = [], self = this;

        if (_.isObject(events)) {
            _.each(events, function (event_cbs, event_name) {
                event_cbs = _.M.asArray(event_cbs);
                _.each(event_cbs, function (event_cb) {
                    event_cb = _.M.asArray(event_cb);
                    events_arr.push({
                        name: event_name,
                        cb: event_cb[0],
                        options: event_cb.length > 1 ? event_cb[1] : {}
                    });
                });
            });
        }

        _.each(events_arr, function (event_info) {
            self.addListener(event_info['name'], event_info['cb'], event_info['options']);
        });
    };

    /**
     * Emit event. Each event emitted will emit a event called 'event_emitted', with event emitted and it's data
     * @param {string|string[]} events Array of events
     * @param {*} [data]
     * @param {Function} [final_cb]
     */
    EventEmitter.prototype.emitEvent = function (events, data, final_cb) {
        var self = this,
            emitted = false,
            thisFunc = arguments.callee;

        events = _.M.asArray(events);

        for (var i in events) {
            if (events.hasOwnProperty(i)) {
                var event = events[i];

                if (this._events.hasOwnProperty(event)) {
                    var listeners = this._events[event].priority.getContents();

                    if (listeners.length) {
                        emitted = true;
                        _.each(listeners, function (listener) {
                            if (listener.meta.async) {
                                _.M.async(listener.content, data, listener.meta.context || self);
                            } else {
                                _.M.callFunc(listener.content, data, listener.meta.context || self);
                            }
                        });
                    }
                }

                if (emitted) {
                    if (!this._event_emitted.hasOwnProperty(event)) {
                        this._event_emitted[event] = 1;
                    } else {
                        this._event_emitted[event] += 1;
                    }

                    if (final_cb) {
                        final_cb.call(this);
                    }

                    if (event !== 'event_emitted') {
                        thisFunc.call(self, 'event_emitted', [event, data]);
                    }
                }

                if ('event_emitted' !== event && -1 == this._event_privates.indexOf(event) && !_.isEmpty(this._event_followers)) {
                    _.each(this._event_followers, function (eventEmitterAttached) {
                        function cb(source_id, source_event, source_data) {
                            eventEmitterAttached.target.notice(source_id, source_event, source_data);
                        }

                        if (eventEmitterAttached.async) {
                            _.M.async(cb, [self.id, event, data], self);
                        } else {
                            _.M.callFunc(cb, [self.id, event, data], self);
                        }
                    });
                }
            }
        }
    };

    /**
     * Alias of 'emitEvent'
     * @see emitEvent
     */
    EventEmitter.prototype.emit = function () {
        return this.emitEvent.apply(this, arguments);
    };

    /**
     * Remove listener by key
     * @param {string|Function|Array} key_or_listener Listener key or listener it self
     * @param {number} [priority=_.M.PRIORITY_DEFAULT]
     */
    EventEmitter.prototype.removeListener = function (key_or_listener, priority) {
        var self = this;
        key_or_listener = _.M.asArray(key_or_listener);
        _.each(key_or_listener, function (remover) {
            if (_.M.isLikeString(remover)) {
                _.each(Object.keys(self._events), function (event_name) {
                    if (_.has(self._events[event_name].key_mapped, remover)) {
                        self._events[event_name].priority.removeKey(self._events[event_name].key_mapped[remover]);
                        delete self._events[event_name].key_mapped[remover];

                        if (self._events[event_name].priority.status().contents == 0) {
                            delete self._events[event_name];
                        }
                    }
                });
            } else if (_.isFunction(remover)) {
                priority = priority || _.M.PRIORITY_DEFAULT;
                _.each(Object.keys(self._events), function (event_name) {
                    self._events[event_name].priority.removeContent(remover, priority);

                    if (self._events[event_name].priority.status().contents == 0) {
                        delete self._events[event_name];
                    }
                });
            } else {
                throw new Error('Invalid remover, it must be key of added listener or listener it self');
            }
        });
    };

    /**
     * Alias of `removeListener`
     * @see removeListener
     */
    EventEmitter.prototype.off = function () {
        return this.removeListener.apply(this, arguments);
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
        if (_.M.isEventEmitter(eventEmitter)) {
            if (!this._event_followers.hasOwnProperty(eventEmitter.id)) {
                this._event_followers[eventEmitter.id] = {
                    target: eventEmitter,
                    async: _.isUndefined(async) || Boolean(async)
                };
                this.emitEvent('attach', [eventEmitter, only, excepts]);
                eventEmitter.attachTo(this, only, excepts);
            }
            return true;
        }

        throw new Error('Invalid _.M.EventEmitter instance');
    };
    /**
     * Attach other event emitter to this. Notice sync
     * @param eventEmitter
     * @param only
     * @param excepts
     */
    EventEmitter.prototype.attachHard = function (eventEmitter, only, excepts) {
        this.attach(eventEmitter, only, excepts, false);
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
        if (!_.M.isEventEmitter(eventEmitter)) {
            throw new Error('Invalid _.M.EventEmitter instance');
        }
        if (!this._event_following.hasOwnProperty(eventEmitter.id)) {
            this._event_following[eventEmitter.id] = {
                id: eventEmitter.id,
                type: eventEmitter.constructor.name,
                only: _.M.asArray(only || []),
                excepts: _.M.asArray(excepts || [])
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
     * Notice following event emitter emitted
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
            var info = this._event_following[sourceID],
                self = this;

            if ((_.isEmpty(info.only) || -1 !== info.only.indexOf(eventName))
                && (_.isEmpty(info.excepts) || -1 === info.excepts.indexOf(eventName))) {

                var notice_data = {
                    id: info.id,
                    type: info.type,
                    event: eventName,
                    data: data
                };

                var notices = [
                    info.id + '.' + eventName,
                    info.type + '.' + eventName,
                    'noticed.' + info.id + '.' + eventName,
                    'noticed.' + info.id,
                    'noticed.' + info.type + '.' + eventName,
                    'noticed.' + info.type,
                    'noticed'
                ];

                var mimic = null;
                _.M.loop([eventName, info.type + '.*', info.type + '.' + eventName], function (mimic_event_name) {
                    if (-1 != self._event_mimics.indexOf(mimic_event_name)) {
                        mimic = mimic_event_name;
                        self.emitEvent(eventName, data);

                        return 'break';
                    }
                });


                this.emitEvent(mimic ? _.omit(notices, mimic) : notices, [data, _.clone(notice_data)]);
            }
        }
    };

    /**
     * Detach followed event emitter
     * @param {EventEmitter} eventEmitter
     * @returns {boolean}
     */
    EventEmitter.prototype.detach = function (eventEmitter) {
        if (_.M.isEventEmitter(eventEmitter)) {
            if (this._event_followers.hasOwnProperty(eventEmitter.id)) {
                this.emitEvent('detach', [eventEmitter]);
                delete this._event_followers[eventEmitter.id];
                eventEmitter.detachFrom(this);
            }

            return true;
        }

        throw new Error('Invalid _.M.EventEmitter instance');
    };

    /**
     * Detach following event emitter
     * @param {EventEmitter} eventEmitter
     * @returns {boolean}
     */
    EventEmitter.prototype.detachFrom = function (eventEmitter) {
        if (_.M.isEventEmitter(eventEmitter)) {
            if (this._event_following.hasOwnProperty(eventEmitter.id)) {
                this.emitEvent('detached', [eventEmitter]);
                delete this._event_following[eventEmitter.id];
                eventEmitter.detach(this);
            }

            return true;
        }

        throw new Error('Invalid _.M.EventEmitter instance');
    };

    /**
     *
     * @type {EventEmitter}
     */
    _.M.EventEmitter = EventEmitter;

    /**
     * Check if object is instance of Event Emitter
     * @param {object} object
     * @returns {boolean}
     */
    _.M.isEventEmitter = function (object) {
        if (_.isObject(object)) {
            return object instanceof EventEmitter;
        }

        return false;
    };

})(_);