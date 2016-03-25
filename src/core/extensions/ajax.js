/**
 * AJAX
 * Each AJAX instance when request complete will notice App instance `ajax_complete` event, with argument is AJAX
 * instance itself
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
        AJAX_ERROR_INVALID_RESPONSE_ADAPTER: 'ajax_invalid_response_adapter',
        /**
         * @constant {string}
         * @default
         */
        AJAX_ABORTED: 'aborted',
        /**
         * @constant {string}
         * @default
         */
        AJAX_TIMEOUT: 'timeout',
        /**
         * @constant {string}
         * @default
         */
        AJAX_PARSER_ERROR: 'parser_error',
        /**
         * @constant {number}
         * @default
         */
        AJAX_SERVER_ERROR: 500,
        /**
         * @constant {number}
         * @default
         */
        AJAX_FORBIDDEN: 403,
        /**
         * @constant {number}
         * @default
         */
        AJAX_NOT_FOUND: 404
    });

    var http_response_statuses = {
        204: 'Server has received the request but there is no information to send back',
        400: 'The request had bad syntax or was inherently impossible to be satisfied',
        401: 'The parameter to this message gives a specification of authorization schemes which are acceptable',
        403: 'The request is for something forbidden',
        404: 'The server has not found anything matching the URI given',
        405: 'Method not allowed',
        406: 'Not acceptable',
        408: 'Request timeout',
        413: 'Payload too large',
        414: 'URI too long',
        429: 'Too many requests',
        431: 'Request header fields too large',
        500: 'The server encountered an unexpected condition which prevented it from fulfilling the request',
        501: 'The server does not support the facility required'
    };

    var response_adapters = {},
        /**
         * AJAX data adapter. Adapter is a function, with arguments: data, option. Adapter return processed data
         *
         * @type {{}}
         */
        data_adapters = {},
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
         * @type {{response_adapters: {}, data_adapters: {}, auto_abort: boolean}}
         */
        this.options = {
            response_adapters: {},
            data_adapters: {},
            auto_abort: true
        };

        /**
         * jQuery XHR object
         * @type {null}
         */
        this.jqXHR = null;
        
        /**
         * requested times
         * @type {number}
         */
        this.requested = 0;
        this.response = null;
        this.responses = null;

        this.error = null;

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
     * Get global option
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

    /**
     * Register response adapter
     * @param {function} constructor AJAXResponseAdapter constructor
     */
    AJAX.registerResponseAdapter = function (constructor) {
        if (_.isFunction(constructor) && constructor.name) {
            response_adapters[constructor.name] = constructor;

            return true;
        }

        return false;
    };
    AJAX.responseAdapters = function () {
        return Object.keys(response_adapters);
    };

    /**
     * Register data adapter
     * @param {string} name
     * @param {Function} callback Callback receive arguments: request data, request options, AJAX instance
     * @returns {boolean}
     */
    AJAX.registerDataAdapter = function (name, callback) {
        if (_.isFunction(callback)) {
            data_adapters[name] = callback;

            return true;
        }

        return false;
    };

    /**
     * Apply AJAX data adapters
     * @param {*} data
     * @param {{}} adapters Object of adapter with key is adapter name, value is adapter option object
     * @returns {*}
     */
    AJAX.applyDataAdapters = function (data, adapters) {
        if (!_.isObject(data)) {
            data = {};
        }

        _.each(adapters, function (adapter_option, name) {
            if (data_adapters.hasOwnProperty(name)) {
                if (_.isFunction(data_adapters[name])) {
                    data = data_adapters[name](data, _.isObject(adapter_option) ? adapter_option : {});
                } else {
                    throw new Error('AJAX data adapter must be a function: ' + name);
                }
            } else {
                throw new Error('AJAX Data adapter not found: ' + name);
            }
        });

        return data;
    };

    /**
     *
     * @param error_arguments
     * @returns {{code: string|number, message: string}}
     */
    AJAX.beautifyError = function (error_arguments) {
        var jqXHR = error_arguments[0],
            textStatus = error_arguments[1],
            errorThrown = error_arguments[2],
            err_result = {
                code: '',
                message: 'Ajax error'
            };

        switch (textStatus) {
            case 'parsererror':
                err_result.message = 'Parse response failed';
                err_result.code = _.M.AJAX_PARSER_ERROR;
                break;

            case 'abort':
                err_result.message = 'Manual abort request';
                err_result.code = _.M.AJAX_ABORTED;
                break;

            default:
                err_result.code = jqXHR.status;

                if (http_response_statuses.hasOwnProperty(jqXHR.status)) {
                    err_result.message = http_response_statuses[jqXHR.status];
                } else {
                    err_result.message = errorThrown;
                }
        }

        return err_result;
    };

    /**
     * Get data adapter list
     * @returns {Array}
     */
    AJAX.dataAdapters = function () {
        return Object.keys(data_adapters);
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
                this.error = error;
                this.emitEvent('catch', [error.message, error.code]);

                return;
            }


        }
        this.response = response;
        this.responses = responses;

        this.emitEvent('then', [_.clone(response), _.clone(responses)]);
    }

    function _ajax_error_cb(jqXHR, textStatus, errorThrown) {
        var err_result = AJAX.beautifyError(arguments);

        this.error = err_result;
        this.emitEvent('catch', [err_result.message, err_result.code]);
    }

    function _ajax_complete_cb(jqXHR, textStatus) {
        this.emitEvent('finally', [jqXHR, textStatus]);

        if (_.App) {
            _.App.emitEvent('ajax_complete', [this]);
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
            if (this.option('auto_abort')) {
                this.abort();
            }
            if (result) {
                this.emitEvent('request');
            }

            return result;
        }.bind(this);

        if (!_.isObject(last_options.data)) {
            last_options.data = {};
        }
        if (last_options.data_adapters) {
            last_options.data = AJAX.applyDataAdapters(_.clone(last_options.data), last_options.data_adapters);
        }

        this.response = null;
        this.responses = null;
        this.requested++;
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