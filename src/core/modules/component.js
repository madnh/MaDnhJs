(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['lodash', 'jquery', 'event_emitter', 'store'], factory);
    } else {
        // Browser globals
        root.Component = factory(root._, root.jQuery, root.EventEmitter, root.Store);
    }
}(this, function (_, $, EventEmitter, Store) {
    var component_classes = {},
        component_defined = {};

    function getID() {
        return _.uniqueId('component_', true);
    }

    function Component(name) {
        EventEmitter.call(this);

        this.id = getID();
        this.name = name;
        this.options = {};
        this.render_handler = null;
        this.value_handler = null;

        this.is_rendered = false;
        this.stores = {};

        /**
         *
         * @type {string}
         */
        this.store_field = null;

        /**
         *
         * @type {function}
         */
        this.store_data_handler = null;

        init(this);
    }

    Component.prototype = Object.create(EventEmitter.prototype);
    Component.prototype.constructor = Component;
    Component.prototype.trigger = Component.prototype.emitEvent;

    /**
     *
     * @param {string|object} name Name or object of options
     * @param {*|undefined} [value] Bypass when parameter name is object
     * @returns {Component}
     */
    Component.prototype.option = function (name, value) {
        if (_.isObject(name)) {
            _.extend(this.options, name);
        } else {
            this.options[name] = value;
        }

        this.emitEvent('option_changed');

        return this;
    };

    /**
     * Get component's options
     * @return {{}}
     */
    Component.prototype.getOptions = function () {
        return _.clone(this.options);
    };

    /**
     * Get component content
     * Events:
     * - compiled: <compiled content>
     *
     * @returns {string}
     * @throws Error Component render handler must be a function or string
     */
    Component.prototype.compile = function () {
        var content;

        if (_.isFunction(this.render_handler)) {
            content = this.render_handler.bind(this)(this);
        } else {
            content = String(this.render_handler);
        }

        this.emitEvent('compiled', content);

        return content;
    };

    /**
     * Trigger event rendered
     */
    Component.prototype.rendered = function () {
        this.is_rendered = true;
        this.emitEvent('rendered');
    };

    /**
     * Render component to target
     * Events:
     * - rendered
     * @param {string|jQuery|HTMLElement} target
     * @param {boolean} [is_replace = true] Replace target element by component or replace it's content
     * @returns {Component}
     */
    Component.prototype.render = function (target, is_replace) {
        if (this.is_rendered) {
            this.remove();
        }

        var content = this.compile();

        target = $(target);

        if (_.isUndefined(is_replace) || is_replace) {
            target.replaceWith(content);
        } else {
            target.html(content);
        }

        this.getContainer().data('component', this);
        this.rendered();

        return this;
    };

    /**
     * Re-render component
     * Events:
     * - before_re_render
     * - rendered
     * - re-rendered
     * @returns {Component}
     */
    Component.prototype.reRender = function () {
        if (!this.is_rendered) {
            throw new Error('Component is not rendered');
        }

        var html = this.compile();

        this.emitEvent('before_re_render');
        this.is_rendered = false;
        this.getContainer().replaceWith(html).data('component', this);
        this.rendered();
        this.emitEvent('re-rendered');

        return this;
    };

    /**
     * Get component's value
     * @returns {*}
     */
    Component.prototype.getValue = function () {
        if (_.isFunction(this.value_handler)) {
            return this.value_handler(this);
        }

        return null;
    };

    /**
     * Get DOM container of component
     * @param {boolean} [strict_mode = true] If container not found then throw an exception
     * @returns {null|jQuery}
     */
    Component.prototype.getContainer = function (strict_mode) {
        var container = $('#' + this.id);

        if (!container.length) {
            if (strict_mode || _.isUndefined(strict_mode)) {
                throw new Error('Get component DOM failed: #' + this.id + ', name: ' + (this.name || ''));
            }

            return null;
        }

        return container;
    };
    /**
     * Remove component
     * Events:
     * - before_remove
     * - removed
     */
    Component.prototype.remove = function () {
        var dom = this.getContainer();

        if (dom.length) {
            this.emitEvent('before_remove');

            dom.remove();

            this.is_rendered = false;
            this.emitEvent('removed');
        }
    };

    /**
     * Connect component to a store
     * @param {Store} store
     * @return {Component}
     */
    Component.prototype.connectStore = function (store) {
        this.stores[store.name || store.id] = store;
        this.emitEvent('connect_store', store);

        return this;
    };

    /**
     * Disconnect component from a store
     * @param {Store} store
     * @return {Component}
     */
    Component.prototype.disconnectStore = function (store) {
        delete this.stores[store.name || store.id];
        this.emitEvent('disconnect_store', store);

        return this;
    };

    /**
     * Push component data to stores
     * @param {bool} [silent = false] Notice store change or not, default is not notice
     * @return {Component}
     */
    Component.prototype.pushToStores = function (silent) {
        var field = this.store_field || this.name || this.id,
            data = {},
            value;

        if (!field) {
            throw new Error('Store data field is undefined');
        }
        if (!_.isEmpty(this.stores)) {
            value = this.getValue();

            if (_.isFunction(this.store_data_handler)) {
                value = this.store_data_handler(value, this);
            }

            data[field] = value;

            _.each(this.stores, function (store) {
                store.change(data, silent);
            });
        }
    };

    function init(component) {
        //do nothing
    }

    /**
     * Register component class
     * @param {string} class_name
     * @param {function} constructor
     */
    Component.register = function (class_name, constructor) {
        component_classes[class_name] = constructor;
    };

    /**
     * @param {string} class_name
     * @return {boolean}
     */
    Component.isRegistered = function (class_name) {
        return component_classes.hasOwnProperty(class_name);
    };

    /**
     * @param {string} class_name
     */
    Component.unRegister = function (class_name) {
        delete component_classes[class_name];
    };

    /**
     * @param {string} name
     * @return {boolean}
     */
    Component.isDefined = function (name) {
        return component_defined.hasOwnProperty(name);
    };

    /**
     * @param {string} name
     */
    Component.unDefine = function (name) {
        delete component_defined[name];
    };

    /**
     * Define a component type, base on a component class
     * @param {string} name Component type name
     * @param {{}} detail
     * @param {string} base_class Base component class name
     */
    Component.define = function (name, detail, base_class) {
        if (base_class && !component_classes.hasOwnProperty(base_class)) {
            throw new Error('Define component type with a base class not defined');
        }
        if (Component.isRegistered(name)) {
            throw new Error('Component type name is registered by another component class');
        }

        component_defined[name] = _.extend({
            base_class: base_class,
            init_handler: null,
            options: {},
            properties: {},
            render_handler: null,
            reset_events: false,
            events: {},
            methods: {},
            value_handler: null
        }, detail);
    };

    /**
     *
     * @param class_name
     * @param name
     * @param options
     * @return {Component}
     */
    Component.factory = function (class_name, name, options) {
        if (!_.isString(name)) {
            throw new Error('Component name is missing or invalid');
        }
        if (component_classes.hasOwnProperty(class_name)) {
            return factory_class(class_name, name, options);
        }
        if (component_defined.hasOwnProperty(class_name)) {
            return factory_defined_class(class_name, name, options);
        }


        throw new Error('Component class not found: ' + class_name);
    };

    function factory_class(class_name, name, options) {
        var constructor = component_classes[class_name],
            comp = new constructor(name);

        comp.name = name;

        if (options) {
            comp.option(options);
        }

        return comp;
    }

    function factory_defined_class(defined_class_name, comp_name, options) {
        var detail = component_defined[defined_class_name],
            comp;

        if (detail.base_class) {
            comp = factory_class(detail.base_class, comp_name);
        } else {
            comp = new Component(name);
        }

        if (!_.isEmpty(detail.properties) && _.isObject(detail.properties)) {
            _.extend(comp, detail.properties);
        }
        if (detail.hasOwnProperty('options')) {
            comp.option(detail.options);
        }
        if (detail.hasOwnProperty('render_handler') && detail.render_handler) {
            comp.render_handler = detail.render_handler.bind(comp);
        }
        if (detail.hasOwnProperty('detail.value_handler') && detail.value_handler) {
            comp.value_handler = detail.value_handler.bind(comp);
        }

        if (detail.reset_events) {
            if (_.isArray(detail.reset_events)) {
                comp._events = _.omit(comp._events, detail.reset_events);
            } else {
                comp._events = {};
            }
        }
        if (detail.events) {
            _.each(detail.events, function (event_handler, event_name) {
                comp.on(event_name, event_handler);
            });
        }
        if (detail.methods) {
            _.each(detail.methods, function (method, method_name) {
                comp[method_name] = method.bind(comp);
            });
        }
        if (detail.init_handler) {
            detail.init_handler(comp);
        }

        //Apply factory options
        if (options) {
            comp.option(options);
        }

        return comp;
    }

    /**
     * Get list of component class registered
     * @return {Array}
     */
    Component.classes = function () {
        return Object.keys(component_classes);
    };

    /**
     * Get list of component class defined
     * @return {Array}
     */
    Component.defined = function () {
        return Object.keys(component_defined);
    };

    /**
     * Read sub elements and generate components
     * Attributes:
     * - data-comp: Component class name
     * - data-comp-name or data-name or name: Component name. If all of attr is missing, us an auto generate name
     * - data-comp-options: Component options. Object as JSON encoded, or name of a defined object, or a function that return an object
     * - data-comp-op-*: other component option fields. Note that this option fields is override options come from data-comp-options
     * - data-comp-store: Name of variable store to connect
     * - data-comp-init: Name of function use to handle component before render. Function has one argument is component
     * - data-comp-render-replace: render component as replace holder or not
     *
     * @param {string|jQuery} selector
     * @param {boolean} [is_replace = true] Render component mode, bypass by attr data-comp-render-replace
     * @return {Array} Array of create components
     */
    Component.fill = function (selector, is_replace) {
        var holders = $(selector),
            comps = [],
            non_option_name = ['comp', 'compName', 'compOptions', 'compStore', 'compInit', 'compRenderReplace'];

        is_replace = is_replace || _.isUndefined(is_replace);

        holders.each(function (index, element) {
            var el = $(element),
                data = el.data(),
                comp_class,
                comp,
                options,
                other_options_fields,
                other_options = {},
                init,
                store,
                render_replace = is_replace;

            comp_class = data['comp'];

            if (comp_class && !(Component.isRegistered(comp_class) || Component.isDefined(comp_class))) {
                failed_at(el);
                throw new Error('[Component.Fill] Component class not found: ' + comp_class);
            }

            comp = Component.factory(comp_class || 'Component', data['compName'] || data['name'] || el.attr('name') || getID());
            el.attr('id', comp.id);

            if (options = data['compOptions']) {
                if (_.isString(options) && (options = window[options]) && _.isFunction(options)) {
                    options = options();
                }
                if (!_.isObject(options)) {
                    failed_at(el);
                    throw new Error('[Component.Fill] Component options must be an object or function that return an object, #' + comp.id);
                }

                comp.option(options);
            }
            other_options_fields = _.filter(_.without(Object.keys(data), non_option_name), function (name) {
                return 'compOp' == name.slice(0, 6);
            });
            if (!_.isEmpty(other_options_fields)) {
                _.each(other_options_fields, function (name) {
                    var op_name = name.slice(6).trim().toLowerCase();

                    if (op_name) {
                        other_options[op_name] = data[name];
                    }
                });
                if (!_.isEmpty(other_options)) {
                    comp.option(other_options);
                }
            }

            if (store = data['compStore']) {
                store = window[store];

                if (!_.isObject(store)) {
                    failed_at(el);
                    throw new Error('[Component.Fill] Component store must be an object, #' + comp.id);
                }

                comp.connectStore(store);
            }
            if (init = data['compInit']) {
                init = window[init];

                if (!_.isFunction(init)) {
                    failed_at(el);
                    throw new Error('[Component.Fill] Component init handler must be an function, #' + comp.id);
                }

                init(comp);
            }
            if (data.hasOwnProperty('compRenderReplace')) {
                render_replace = !_.isEmpty(_.compact([data['compRenderReplace']]));
            }


            comps.push(comp);
            comp.render(el, render_replace);
        });

        return comps;
    };
    function failed_at(el) {
        console.warn('[Component.Fill] Failed at', el);
    }

    Component.register('Component', Component);


    return Component;
}));