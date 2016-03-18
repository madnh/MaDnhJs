/**
 * AJAX
 * Each AJAX instance when request complete will notice App instance `ajax_complete` event, with arguments are:
 * - jqXHR: jQuery AJAX object
 * - textStatus: `success`, `notmodified`, `nocontent`, `error`, `timeout`, `abort`, or `parsererror`
 * @module _.M.AJAX
 * @memberOf _.M
 * @requires module:_.M.EventEmitter
 */
;(function (_) {

    _.M.defineConstant({
        /**
         * @constant {string}
         * @default
         */
        AJAX_INVALID_RESPONSE_ADAPTER_OPTION: 'ajax_invalid_response_adapter_option',
        /**
         * @constant {string}
         * @default
         */
        AJAX_ERROR_RESPONSE_ADAPTER_NOT_FOUND: 'ajax_response_adapter_not_found',
        /**
         * @constant {string}
         * @default
         */
        AJAX_ERROR_INVALID_RESPONSE_ADAPTER: 'ajax_invalid_response_adapter'
    });

    var response_adapters = {},
        request_data_adapters = {},
        ajax_global_option = {};

    /**
     * @name _.M.AJAXResponseAdapter
     * @class
     */
    function AJAXResponseAdapter() {
        this.type_prefix = 'ajax_response_adapter';
        _.M.BaseClass.call(this);

        this.options = {};
        this.is_error = false;
        this.error = {
            code: 0,
            message: ''
        };

        this.is_success = true;
        this.response = null;
    }

    /**
     *
     * @param {function} constructor AJAXResponseAdapter constructor
     */
    AJAXResponseAdapter.registerResponseAdapter = function (constructor) {
        if (_.isFunction(constructor) && constructor.name) {
            response_adapters[constructor.name] = constructor;

            return true;
        }

        return false;
    };
    AJAXResponseAdapter.responseAdapters = function () {
        return Object.keys(response_adapters);
    };

    /**
     *
     * @param name
     * @param {Function} callback Callback receive arguments: request data, request options, AJAX instance
     * @returns {boolean}
     */
    AJAXResponseAdapter.registerDataAdapter = function (name, callback) {
        if (_.isFunction(callback)) {
            request_data_adapters[name] = callback;

            return true;
        }

        return false;
    };
    AJAXResponseAdapter.dataAdapters = function () {
        return Object.keys(request_data_adapters);
    };


    AJAXResponseAdapter.prototype.option = function (options) {
        _.extend(this.options, options);
    };
    AJAXResponseAdapter.prototype.process = function (data) {
        this.response = data;
    };


    /**
     *
     * @param {object} [options]
     * @class _.M.AJAX
     * @extends _.M.EventEmitter
     */
    function AJAX(options) {
        _.M.EventEmitter.call(this);

        /**
         * Option values
         * @type {{response_adapters: Array, data_adapters: Array}}
         */
        this.options = {
            response_adapters: [],
            data_adapters: []
        };

        /**
         * jQuery XHR object
         * @type {null}
         */
        this.jqXHR = null;

        /**
         * Last before send callback
         * @type {callback|null}
         */
        this.last_before_send_cb = null;

        if (_.isObject(options)) {
            this.option(options);
        }
    }

    _.M.inherit(AJAX, _.M.EventEmitter);

    /**
     * @method
     * @param option
     * @param value
     */
    AJAX.globalOption = function (option, value) {
        ajax_global_option = _.M.setup.apply(_.M, [ajax_global_option].concat(Array.prototype.slice.apply(arguments)));
    };

    /**
     * @method
     * @param option
     * @param {*} [default_value = undefined]
     * @returns {*}
     */
    AJAX.getGlobalOption = function (option, default_value) {
        if (arguments.length == 0) {
            return _.clone(ajax_global_option);
        }
        option += '';

        if (ajax_global_option.hasOwnProperty(option)) {
            return _.clone(ajax_global_option[option]);
        }

        return default_value;
    };

    AJAX.prototype.option = function (option, value) {
        this.options = _.M.setup.apply(_.M, [this.options].concat(Array.prototype.slice.apply(arguments)));

        return this;
    };

    /**
     * Add success callback. Callback arguments:
     * - response: last response after processed by AJAXResponseAdapters
     * - responses: response of each AJAXResponseAdapter
     *
     * @param callback
     * @returns {AJAX}
     */
    AJAX.prototype.then = function (callback) {
        this.on('then', callback);

        return this;
    };

    /**
     * Add catch callback. Callback arguments:
     * - message: Error message
     * - code: error code
     *
     * @param callback
     * @returns {AJAX}
     */
    AJAX.prototype.catch = function (callback) {
        this.on('catch', callback);

        return this;
    };

    /**
     * Add finally callback
     * callback with arguments
     * - jqXHR: jQuery AJAX object
     * - textStatus: "success", "notmodified", "nocontent", "error", "timeout", "abort", or "parsererror"
     *
     * @param callback
     * @returns {AJAX}
     */
    AJAX.prototype.finally = function (callback) {
        this.on('finally', callback);

        return this;
    };

    function _ajax_success_cb(response) {
        var responses = {
            raw: _.clone(response)
        };

        if (!_.isEmpty(this.options.response_adapters)) {
            var error = null;

            _.M.loop(this.options.response_adapters, function (adapter_options, adapter_name) {
                if (response_adapters.hasOwnProperty(adapter_name)) {
                    try {
                        var adapter = new response_adapters[adapter_name]();
                    } catch (e) {
                    }

                    if (adapter instanceof AJAXResponseAdapter) {
                        if (_.isObject(adapter_options) && !_.isEmpty(adapter_options)) {
                            adapter.option(adapter_options);
                        }

                        adapter.process(response);

                        if (adapter.is_error) {
                            error = adapter.error;
                            return 'break';
                        }

                        response = adapter.response;
                        responses[adapter_name] = _.clone(response);

                        return;
                    } else {
                        error = {
                            code: _.M.AJAX_ERROR_INVALID_RESPONSE_ADAPTER,
                            message: 'Invalid AJAX response adapter'
                        };
                    }
                } else {
                    error = {
                        code: _.M.AJAX_ERROR_RESPONSE_ADAPTER_NOT_FOUND,
                        message: 'AJAX response adapter not found'
                    };
                }

                return 'break';
            });

            if (error) {
                this.emitEvent('catch', [error.message, error.code]);

                return;
            }
        }

        this.emitEvent('then', [response, responses]);
    }

    function _ajax_error_cb(jqXHR, textStatus, errorThrown) {
        var err_result = {
            code: _.M.firstNotEmpty(textStatus, jqXHR.statusText, jqXHR.status),
            message: 'Ajax error'
        };

        switch (textStatus) {
            case 'parsererror':
                err_result.message = 'Parse response failed';
                break;

            case 'abort':
                err_result.message = 'Manual abort request';
                break;

            default:
                switch (jqXHR.statusText) {
                    case 'timeout':
                        err_result.message = 'Request timeout';
                        break;
                    case 'error':
                        switch (jqXHR.status) {
                            case 403:
                                err_result.message = 'Invalid request path';
                                break;
                            case 404:
                                err_result.message = 'Request path not found';
                        }
                        break;
                }
        }

        this.emitEvent('catch', [err_result.message, err_result.code]);
    }

    function _ajax_complete_cb(jqXHR, textStatus) {
        this.emitEvent('finally', [jqXHR, textStatus]);

        app_instance.emitEvent('ajax_complete', [this, jqXHR, textStatus]);
    }

    function _ajax_get_request_data(options) {
        if (options.data_adapters) {
            if (!_.isObject(options.data)) {
                options.data = {};
            }

            var adapters = _.clone(options.data_adapters);
            var adapter_name;
            var data = _.clone(options.data);

            while (adapter_name = adapters.shift()) {
                if (request_data_adapters.hasOwnProperty(adapter_name)) {
                    if (_.isFunction(request_data_adapters[adapter_name])) {
                        data = request_data_adapters[adapter_name](data, options, this);
                    } else {
                        throw new Error('Request data adapter must be a function: ' + adapter_name);
                    }
                } else {
                    throw new Error('Request data adapter name not found: ' + adapter_name);
                }
            }

            options.data = _.clone(data);
        }
    }

    AJAX.prototype.request = function (options) {
        var last_options = _.extend({}, ajax_global_option, this.options, options);

        if (last_options.hasOwnProperty('beforeSend')) {
            this.last_before_send_cb = last_options.beforeSend;
        }
        if (last_options.hasOwnProperty('success')) {
            this.removeListener('listener_success');
            this.addListener('then', last_options['success'], {
                priority: _.M.PRIORITY_HIGHEST,
                key: 'listener_success'
            })
        }
        if (last_options.hasOwnProperty('error')) {
            this.removeListener('listener_error');
            this.addListener('catch', last_options['error'], {
                priority: _.M.PRIORITY_HIGHEST,
                key: 'listener_error'
            })
        }
        if (last_options.hasOwnProperty('complete')) {
            this.removeListener('listener_complete');
            this.addListener('finally', last_options['complete'], {
                priority: _.M.PRIORITY_HIGHEST,
                key: 'listener_complete'
            })
        }

        last_options['success'] = _ajax_success_cb.bind(this);
        last_options['error'] = _ajax_error_cb.bind(this);
        last_options['complete'] = _ajax_complete_cb.bind(this);
        last_options['beforeSend'] = function (jqXHR, settings) {
            var result = true;

            if (_.isFunction(this.last_before_send_cb)) {
                result = _.M.callFunc(this, this.last_before_send_cb, [jqXHR, settings]);
            }

            this.abort();
            if (result) {
                this.emitEvent('request');
            }

            return result;
        }.bind(this);


        _ajax_get_request_data.call(this, last_options);

        this.jqXHR = $.ajax(last_options);

        return this.jqXHR;
    };

    /**
     * Abort current request
     * Emit events
     * - abort: before call real abort on jqXHR
     */
    AJAX.prototype.abort = function () {
        if (_.isObject(this.jqXHR) && this.jqXHR.abort) {
            this.emitEvent('abort');
            this.jqXHR.abort();
        }
    };
    /**
     * Get status of ajax
     * @returns {(boolean|number)}
     */
    AJAX.prototype.status = function () {
        if (_.isObject(this.jqXHR) && this.jqXHR.hasOwnProperty('readyState')) {
            return this.jqXHR.readyState;
        }

        return false;
    };

    /**
     * Check if instance is requesting
     * @returns {boolean}
     */
    AJAX.prototype.isRequesting = function () {
        var status = this.status();

        return status !== false && status >= 1 && status <= 3;
    };
    /**
     * Check if instance is ready for request
     * @returns {boolean}
     */
    AJAX.prototype.isReady = function () {
        var status = this.status();

        return status !== false && status === 0;
    };

    /**
     * Check if instance is done
     * @returns {boolean}
     */
    AJAX.prototype.isDone = function () {
        return this.status() === 4;
    };


    _.M.AJAXResponseAdapter = AJAXResponseAdapter;

    _.M.AJAX = AJAX;
})(_);