/**
 * AJAX
 * Each AJAX instance when request complete will notice App instance events
 * Events:
 * - request
 * - retry
 * - catch: error message, error code
 * - then: response
 * - finally: jqXHR, textStatus
 * - retry_complete: retry time, is last retry time?, jqXHR, textStatus
 * App events:
 * - ajax_retry_complete: AJAX instance, retry time, is last retry time?, jqXHR, textStatus
 * - ajax_complete: AJAX instance
 *
 * @module _.M.AJAX
 * @memberOf _.M
 * @requires _.M.EventEmitter
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
         * AJAX data adapter. Adapter is a function, with arguments: data, options, request options. Adapter return
         * processed data
         *
         * @type {{}}
         */
        data_adapters = {};


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
         * - response_adapters: Response adapter object with key is adapter name, value is adapter option object
         * - data_adapters: Data adapter object with key is adapter name, value is adapter option object
         * - auto_abort: abort prev request if not completed
         * - retry: retry times when error
         * - is_continue: check if continue to retry request. Boolean or function which bind to AJAX instance, return
         * boolean value,
         * @type {{response_adapters: {}, data_adapters: {}, auto_abort: boolean,
         * retry: number, is_continue: boolean|function}}
         */
        this.options = {
            before_send: true,
            response_adapters: {},
            data_adapters: {},
            auto_abort: true,
            retry: 0,
            retry_delay: 0,
            is_continue: true
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

        this.retry_time = 0;

        this._last_options = null;
        this._is_retrying = false;
        this._retry_timeout_id = null;

        /**
         *
         * @type {*}
         */
        this.response = null;

        /**
         *
         * @type {{}}
         */
        this.responses = null;

        /**
         *
         * @type {{code: number|string, message: string}}
         */
        this.error = null;

        if (_.isObject(options)) {
            this.option(options);
        }
    }

    _.M.inherit(AJAX, _.M.EventEmitter);

    /**
     * Get error detail
     * @param {Array} error_arguments jQuery error callback arguments as array
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

    /*
     |--------------------------------------------------------------------------
     | Response Adapter
     |--------------------------------------------------------------------------
     */
    /**
     *
     * @class _.M.AJAX.ResponseAdapter
     */
    AJAX.ResponseAdapter = function () {
        this.type_prefix = 'ajax_response_adapter';
        _.M.BaseClass.call(this);

        this.handler = null;

        /**
         * Processed response
         * @type {*}
         */
        this.response = null;

        /**
         *
         * @type {boolean}
         */
        this.is_error = false;

        /**
         *
         * @type {{code: string|number, message: string}}
         */
        this.error = {
            code: 0,
            message: ''
        };
    };

    /**
     * Process response
     * @param {*} response
     * @param {{}} options Adapter options
     * @param {{}} [request_options] Request options
     */
    AJAX.ResponseAdapter.prototype.process = function (response, options, request_options) {
        if (_.isFunction(this.handler)) {
            this.response = response;
            this.handler.apply(this, [
                response,
                _.isObject(options) ? options : {},
                _.isObject(request_options) ? _.clone(request_options) : {},
                this
            ]);

            return;
        }
        throw new Error('AJAX response adapter handler must be function');
    };

    /**
     * Register response adapter
     * @param {string} name
     * @param {callback} handler Adapter callback with arguments: response, options, request options
     * @returns {boolean}
     */
    AJAX.registerResponseAdapter = function (name, handler) {
        if (_.isFunction(handler)) {
            response_adapters[name] = handler;

            return true;
        }

        return false;
    };

    /**
     * List of response adapters
     * @returns {string[]}
     */
    AJAX.responseAdapters = function () {
        return Object.keys(response_adapters);
    };

    /**
     * Return response adapter instance by name
     * @param name
     * @returns {_.M.AJAX.ResponseAdapter}
     * @throws AJAX response adapter name not found
     */
    AJAX.responseAdapterFactory = function (name) {
        if (response_adapters.hasOwnProperty(name)) {
            var adapter = new AJAX.ResponseAdapter();

            adapter.handler = response_adapters[name];

            return adapter;
        }

        throw new Error('AJAX response adapter name not found');
    };

    /**
     * Apply AJAX response adapters
     * @param {*} response
     * @param {{}} adapters Object of adapters with key is adapter name, value is adapter option object
     * @param {{}} [request_options] Request option
     * @returns {{error: null|{code, message}, response: null|*, responses: {raw}}}
     */
    AJAX.applyResponseAdapters = function (response, adapters, request_options) {
        var result = {
            error: null,
            response: null,
            responses: {
                raw: _.clone(response)
            }
        }, adapter;

        if (!_.isObject(request_options)) {
            request_options = {};
        }

        _.M.loop(adapters, function (adapter_options, adapter_name) {
            if (response_adapters.hasOwnProperty(adapter_name)) {
                adapter = AJAX.responseAdapterFactory(adapter_name);
                adapter.process(response, _.isObject(adapter_options) ? adapter_options : {}, request_options);

                if (adapter.is_error) {
                    result.error = adapter.error;

                    return 'break';
                }

                response = adapter.response;
                result.responses[adapter_name] = _.clone(adapter.response);

                return;
            } else {
                result.error = {
                    code: _.M.AJAX_ERROR_RESPONSE_ADAPTER_NOT_FOUND,
                    message: 'AJAX response adapter not found'
                };
            }

            return 'break';
        });


        if (!result.error) {
            result.response = response;
        }

        return result;
    };

    /*
     |--------------------------------------------------------------------------
     | Data Adapter
     |--------------------------------------------------------------------------
     */

    /**
     * Register data adapter
     * @param {string} name
     * @param {callback} callback Callback receive arguments: request data, adapter options, request options - excluded
     *     request data
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
     * @param {{}} adapters Object of adapters with key is adapter name, value is adapter option object
     * @param {{}} [request_options] Request options, exclude request data
     * @returns {*}
     * @throws AJAX data adapter x must be a function
     * @throws AJAX data adapter x not found
     */
    AJAX.applyDataAdapters = function (data, adapters, request_options) {
        if (!_.isObject(data)) {
            data = {};
        }
        if (!_.isObject(request_options)) {
            request_options = {};
        }
        _.each(adapters, function (adapter_option, name) {
            if (data_adapters.hasOwnProperty(name)) {
                if (_.isFunction(data_adapters[name])) {
                    data = data_adapters[name](data, _.isObject(adapter_option) ? adapter_option : {}, request_options);
                } else {
                    throw new Error('AJAX data adapter must be a function: ' + name);
                }
            } else {
                throw new Error('AJAX data adapter not found: ' + name);
            }
        });

        return data;
    };

    /**
     * Get data adapter list
     * @returns {Array}
     */
    AJAX.dataAdapters = function () {
        return Object.keys(data_adapters);
    };

    /*
     |--------------------------------------------------------------------------
     | AJAX prototypes
     |--------------------------------------------------------------------------
     */

    AJAX.prototype.option = function (option, value) {
        this.options = _.M.setup.apply(_.M, [this.options].concat(Array.prototype.slice.apply(arguments)));

        return this;
    };

    /**
     * Add success callback. Callback arguments:
     * - response: last response after processed by AJAXResponseAdapters
     *
     * @param callback
     * @returns {AJAX}
     */
    AJAX.prototype.then = function (callback) {
        this.on('then', callback);

        if (this.isSuccess()) {
            callback.apply(this, [_.clone(this.response)]);
        }


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

        if (this.isError()) {
            callback.apply(this, [this.error.message, this.error.code]);
        }

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

        if (this.isDone()) {
            callback.call(this);
        }

        return this;
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
     * Check if instance is ready for request
     * @returns {boolean}
     */
    AJAX.prototype.isReady = function () {
        var status = this.status();

        return status !== false && status === 0;
    };

    /**
     * Check if instance is requesting
     * @returns {boolean}
     */
    AJAX.prototype.isRequesting = function () {
        var status = this.status();

        return status !== false && status >= 1 && status <= 3;
    };

    AJAX.prototype.isRetrying = function () {
        return Boolean(this._is_retrying);
    };

    /**
     * Check if request is done and not retrying
     * @returns {boolean}
     */
    AJAX.prototype.isDone = function () {
        return !this.isRetrying() && this.status() === 4;
    };

    AJAX.prototype.isError = function () {
        return this.isDone() && !_.isEmpty(this.error);
    };

    AJAX.prototype.isSuccess = function () {
        return this.isDone() && _.isEmpty(this.error);
    };

    /**
     * Check if current request is aborted
     * @returns {boolean}
     */
    AJAX.prototype.isAborted = function () {
        return this.error && (this.error.code === _.M.AJAX_ABORTED);
    };


    AJAX.prototype.isLastRetryTime = function () {
        return this.isRetrying() && this.options.retry && this.retry_time >= parseInt(this.options.retry);
    };

    AJAX.prototype.isRetryable = function () {
        if (!_.isEmpty(this.error) && !this.isAborted() && this.options.retry && this.retry_time < parseInt(this.options.retry)) {
            var is_continue;

            if (_.isFunction(this.options.is_continue)) {
                is_continue = this.options.is_continue.bind(this)(_.clone(this.error));
            } else {
                is_continue = Boolean(this.options.is_continue);
            }

            return is_continue;
        }

        return false;
    };

    function _ajax_success_cb(response) {
        var result = AJAX.applyResponseAdapters(response, this.options.response_adapters);

        if (result.error) {
            this.error = result.error;

            if (!this.isRetryable()) {
                this.emitEvent('catch', [result.error.message, result.error.code]);
            }

            return;
        }

        this.response = result.response;
        this.responses = result.responses;

        this.emitEvent('then', [_.clone(result.response)]);
    }

    function _ajax_error_cb(jqXHR, textStatus, errorThrown) {
        var err_result = AJAX.beautifyError(arguments);

        this.error = err_result;

        if (!this.isRetryable() && !this.isAborted()) {
            this.emitEvent('catch', [err_result.message, err_result.code]);
        }
    }

    function _at_the_end(ajax_instance) {
        ajax_instance._last_options = null;
        ajax_instance._is_retrying = false;
        ajax_instance.emitEvent('finally');

        if (_.App) {
            _.App.emitEvent('ajax_complete', [ajax_instance]);
        }
    }
    function _ajax_complete_cb(jqXHR, textStatus) {
        var self = this;

        if (this.isAborted()) {
            this.emitEvent('aborted');
        } else if (this.isRetryable()) {
            if (this.isRetrying()) {
                this.emitEvent('retry_complete', [this.retry_time, this.isLastRetryTime(), jqXHR, textStatus]);

                if (_.App) {
                    _.App.emitEvent('ajax_retry_complete', [this, this.retry_time, this.isLastRetryTime(), jqXHR, textStatus]);
                }
            }

            this._is_retrying = true;
            if (!this.options.retry_delay) {
                this.request();
            } else {
                this._retry_timeout_id = _.M.async(function () {
                    self.request();
                }, [], this.options.retry_delay);
            }

            return;
        }

        _at_the_end(this);
    }

    /**
     * Get request option, ready for request
     * @param {{}} custom_options
     * @return {{}}
     */
    AJAX.prototype.getRequestOptions = function (custom_options) {
        var last_options = _.extend({}, this.options, _.isObject(custom_options) ? custom_options : {}),
            before_send_cb;

        if (last_options.hasOwnProperty('success')) {
            this.removeListener('success_listeners');
            this.addListener('then', last_options['success'], {
                priority: _.M.PRIORITY_HIGHEST,
                key: 'success_listeners'
            })
        }
        if (last_options.hasOwnProperty('error')) {
            this.removeListener('error_listeners');
            this.addListener('catch', last_options['error'], {
                priority: _.M.PRIORITY_HIGHEST,
                key: 'error_listeners'
            })
        }
        if (last_options.hasOwnProperty('complete')) {
            this.removeListener('complete_listeners');
            this.addListener('finally', last_options['complete'], {
                priority: _.M.PRIORITY_HIGHEST,
                key: 'complete_listeners'
            })
        }
        if (last_options.hasOwnProperty('beforeSend')) {
            before_send_cb = last_options.beforeSend;
        }

        last_options['success'] = _ajax_success_cb.bind(this);
        last_options['error'] = _ajax_error_cb.bind(this);
        last_options['complete'] = _ajax_complete_cb.bind(this);
        last_options['beforeSend'] = function (jqXHR, settings) {
            var result = true;

            if (_.isFunction(before_send_cb) && !this.isRetrying()) {
                result = _.M.callFunc(before_send_cb, [jqXHR, settings], this);
            }
            if (this.option('auto_abort') && this.isRequesting()) {
                this.abort();
            }
            if (false !== result) {
                this.requested++;
                this.error = null;
                this.response = null;
                this.responses = null;

                if (this.isRetrying()) {
                    this.retry_time++;
                    this.emitEvent('retry');
                } else {
                    this.retry_time = 0;
                    this.emitEvent('request');
                }
            }

            return result;
        }.bind(this);

        if (!_.isObject(last_options.data)) {
            last_options.data = {};
        }
        if (last_options.data_adapters) {
            last_options.data = AJAX.applyDataAdapters(_.clone(last_options.data), last_options.data_adapters);
        }

        return last_options;
    };

    AJAX.prototype.request = function (options) {
        var last_options;

        if (this.isRetrying() && _.isObject(this._last_options)) {
            last_options = this._last_options;
        } else {
            last_options = this.getRequestOptions(options);
            this._last_options = last_options;
        }

        this.jqXHR = $.ajax(last_options);

        return this.jqXHR;
    };

    /**
     * Abort current request
     */
    AJAX.prototype.abort = function () {
        if (this.isRequesting() && this.jqXHR.abort) {
            this.jqXHR.abort();
        }else if(this.isRetrying()){
            clearTimeout(this._retry_timeout_id);
            this.emitEvent('aborted');
            _at_the_end(this);
        }
    };


    /*
     |--------------------------------------------------------------------------
     | AJAX Helpers
     |--------------------------------------------------------------------------
     */

    function _load_apply_content(response, target, apply_type) {
        target = $(target);
        switch (apply_type) {
            case 'append':
                target.append(response);
                break;
            case 'prepend':
                target.prepend(response);
                break;

            default:
                target.html(response);
        }
    }

    /**
     * Load content to element
     * @param {string} url
     * @param {string|*} target Selector string or jQuery DOM
     * @param {{}} options Options:
     * - error_content: null - default error content: "Load content failed: <error message>. Error code: <error code>".
     * It may be string or function with arguments as: error message, error code
     * - apply_type: Way to apply response to target: replace, append or prepend. Default is replace
     */
    AJAX.load = function (url, target, options) {
        var ajax = new AJAX();

        if (!_.isObject(options)) {
            options = {};
        }

        options = _.extend({
            error_content: null,
            apply_type: 'replace'
        }, options, {
            url: url
        });

        ajax.option(options);
        ajax.then(function (response) {
            _load_apply_content(response, target, options.apply_type);
        }).catch(function (error_message, error_code) {
            var response = '';

            if (_.isNull(options.error_content)) {
                response = ['Load content failed: ', error_message, '. Error code: ', error_code].join('');
            } else {
                if (_.isFunction(options.error_content)) {
                    response = options.error_content(ajax, error_message, error_code);
                } else {
                    response = options.error_content + '';
                }
            }

            _load_apply_content(response, target, options.apply_type);
        });

        ajax.request();

        return ajax;
    };

    /**
     *
     * @type {_.M.AJAX}
     */
    _.M.AJAX = AJAX;
})(_);