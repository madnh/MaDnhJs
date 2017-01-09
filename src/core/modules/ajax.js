(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['lodash', 'jquery', 'madnh', 'pre_options', 'priority', 'event_emitter', 'task'], function (lodash, jQuery, M, PreOptions, Priority, EventEmitter, Task) {
            return (root.Ajax = factory(lodash, jQuery, M, PreOptions, Priority, EventEmitter, Task));
        });
    } else {
        // Browser globals
        root.Ajax = factory(root._, root.jQuery, root.M, root.PreOptions, root.Priority, root.EventEmitter, root.Task);
    }
}(this, function (_, $, M, PreOptions, Priority, EventEmitter, Task) {
    var key,
        constants;

    var jqXHR_response_statuses = {
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
        501: 'The server does not support the facility required',
        parser_error: 'Parse response failed',
        aborted: 'Manual abort request'
    };
    constants = {
        /**
         * @constant {number}
         * @default
         */
        AJAX_PRE_OPTIONS_NAME: 'MaDnh.Ajax',
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
    };

    /**
     *
     * @param {object} [options]
     * @constructor
     */
    function Ajax(options) {
        EventEmitter.call(this);

        this.options = PreOptions.get(constants.AJAX_PRE_OPTIONS_NAME);

        /**
         * jQuery XHR object
         * @type {null}
         * @property
         */
        this.jqXHR = null;

        /**
         * requested times
         * @type {number}
         * @property
         */
        this.requested = 0;

        /**
         * @property
         * @type {number}
         */
        this.retry_time = 0;

        /**
         * @property
         * @type {null|object}
         * @private
         */
        this._last_options = null;

        /**
         * @property
         * @type {boolean}
         * @private
         */
        this._is_retrying = false;

        /**
         * @property
         * @type {null}
         * @private
         */
        this._retry_timeout_id = null;

        /**
         * @property
         * @type {*}
         */
        this.response = null;

        /**
         * @property
         * @type {{code: number|string, message: string}}
         */
        this.error = null;
        this._is_response_meaning_failed = false;

        if (_.isObject(options)) {
            this.option(options);
        }
    }

    M.inherit(Ajax, EventEmitter);


    for (key in constants) {
        if (!constants.hasOwnProperty(key)) {
            continue;
        }

        Object.defineProperty(Ajax, key, {
            enumerable: true,
            value: constants[key]
        });
    }

    /**
     * Option values
     * - response_tasks: Response adapter object with key is adapter name, value is adapter option object
     * - data_tasks: Data adapter object with key is adapter name, value is adapter option object
     * - auto_abort: abort prev request if not completed
     * - retry: retry times when error
     * - is_continue: check if continue to retry request. Boolean or function which bind to Ajax instance, return
     * boolean value
     */
    PreOptions.define(constants.AJAX_PRE_OPTIONS_NAME, {
        response_tasks: {},
        data_tasks: {},
        auto_abort: true,
        retry: 0,
        retry_delay: 0,
        is_continue: true
    });

    /**
     *
     * @param {{}} options
     */
    Ajax.globalOption = function (options) {
        PreOptions.update(constants.AJAX_PRE_OPTIONS_NAME, options);
    };
    /**
     * Get error detail
     * @param {Arguments} error_arguments jQuery error callback arguments as array
     * @returns {{code: string|number, message: string}}
     */
    Ajax.beautifyError = function (error_arguments) {
        var jqXHR = error_arguments[0],
            textStatus = error_arguments[1],
            errorThrown = error_arguments[2],
            err_result = {
                code: '',
                message: 'Ajax error'
            };

        switch (textStatus) {
            case 'parsererror':
                err_result.code = constants.AJAX_PARSER_ERROR;
                break;

            case 'abort':
                err_result.code = constants.AJAX_ABORTED;
                break;

            default:
                err_result.code = jqXHR.status;
        }

        if (jqXHR_response_statuses.hasOwnProperty(err_result.code)) {
            err_result.message = jqXHR_response_statuses[err_result.code];
        } else {
            err_result.message = errorThrown;
        }

        return err_result;
    };

    Ajax.prototype.option = function (option, value) {
        this.options = M.setup.apply(M, [this.options].concat(_.toArray(arguments)));

        return this;
    };
    Ajax.prototype.data = function (data) {
        this.options.data = data;

        return this;
    };
    Ajax.prototype.addData = function (name, value) {
        var data;

        if (!this.options.data) {
            this.options.data = {};
        }

        if (_.isObject(arguments[0])) {
            data = _.extend({}, name);
        } else {
            data = {};
            if (arguments.length < 2) {
                data[name + ''] = 'true';
            } else {
                data[name] = value;
            }
        }

        if (_.isObject(this.options.data)) {
            _.extend(this.options.data, data);
        } else if (_.isString(this.options.data)) {
            data = _.map(data, function (value, key) {
                return key + '=' + value;
            });

            if (this.options.data.length) {
                this.options.data += '&' + data;
            } else {
                this.options.data = data;
            }
        }

        return this;
    };
    /**
     * Add success callback. Callback arguments:
     * - response: last response after processed by AJAXResponseAdapters
     *
     * @param callback
     * @returns {Ajax}
     */
    Ajax.prototype.done = function (callback) {
        this.on('done', callback);

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
     * @returns {Ajax}
     */
    Ajax.prototype.fail = function (callback) {
        this.on('fail', callback);

        if (this.isFailed()) {
            callback.apply(this, [this.error.message, this.error.code]);
        }

        return this;
    };
    /**
     * Add finally callback
     *
     * @param callback
     * @returns {Ajax}
     */
    Ajax.prototype.always = function (callback) {
        this.on('always', callback);

        if (this.isDone()) {
            callback.apply(this, [this.error, this.response]);
        }

        return this;
    };

    /**
     * Get status of ajax
     * @returns {(boolean|number)}
     */
    Ajax.prototype.status = function () {
        if (_.isObject(this.jqXHR) && this.jqXHR.hasOwnProperty('readyState')) {
            return this.jqXHR.readyState;
        }

        return false;
    };

    /**
     * Check if instance is ready for request
     * @returns {boolean}
     */
    Ajax.prototype.isReady = function () {
        var status = this.status();

        return status !== false && status === 0;
    };

    /**
     * Check if instance is requesting
     * @returns {boolean}
     */
    Ajax.prototype.isRequesting = function () {
        var status = this.status();

        return status !== false && status >= 1 && status <= 3;
    };
    Ajax.prototype.isRetrying = function () {
        return Boolean(this._is_retrying);
    };

    /**
     * Check if request is done and not retrying
     * @returns {boolean}
     */
    Ajax.prototype.isDone = function () {
        return !this.isRetrying() && this.status() === 4;
    };

    Ajax.prototype.isFailed = function () {
        return this.isDone() && !_.isEmpty(this.error);
    };

    Ajax.prototype.isResponseMeaningFailed = function () {
        return this.isFailed() && this._is_response_meaning_failed;
    };

    Ajax.prototype.isSuccess = function () {
        return this.isDone() && _.isEmpty(this.error);
    };
    /**
     * Check if current request is aborted
     * @returns {boolean}
     */
    Ajax.prototype.isAborted = function () {
        return this.error && (this.error.code === constants.AJAX_ABORTED);
    };

    Ajax.prototype.isLastRetryTime = function () {
        return this.isRetrying() && this.options.retry && this.retry_time >= parseInt(this.options.retry);
    };

    Ajax.prototype.isRetryable = function () {
        if (!_.isEmpty(this.error) && !this.isAborted() && !this.isResponseMeaningFailed() && this.options.retry && this.retry_time < parseInt(this.options.retry)) {
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

    function _ajax_done_cb(response) {
        var result = Task.apply(response, this.options.response_tasks);

        if (result.error) {
            this._is_response_meaning_failed = true;
            this.error = result.error;

            if (!this.isRetryable()) {
                this.emitEvent('fail', result.error.message, result.error.code);
            }

            return;
        }

        this.response = result.data;

        this.emitEvent('done', _.clone(result.data));
    }

    function _ajax_fail_cb(jqXHR, textStatus, errorThrown) {
        var err_result = Ajax.beautifyError(arguments);

        this.error = err_result;

        if (!this.isRetryable() && !this.isAborted()) {
            this.emitEvent('fail', err_result.message, err_result.code);
        }
    }

    function _at_the_end(ajax_instance) {
        ajax_instance._last_options = null;
        ajax_instance._is_retrying = false;
        ajax_instance.emitEvent('always', ajax_instance.error, ajax_instance.response);
    }

    function _ajax_always_cb(jqXHR, textStatus) {
        var self = this;

        if (this.isAborted()) {
            this.emitEvent('aborted');
        } else if (this.isRetryable()) {
            if (this.isRetrying()) {
                this.emitEvent('retry_complete', this.retry_time, this.isLastRetryTime(), jqXHR, textStatus);
            }

            this._is_retrying = true;
            if (!this.options.retry_delay) {
                this.request();
            } else {
                this._retry_timeout_id = setTimeout(function () {
                    self.request();
                }, this.options.retry_delay);
            }

            return;
        }

        _at_the_end(this);
    }

    /**
     * Get request option, ready for request
     * @param instance
     * @param {{}} options
     * @return {{}|boolean}
     */
    function _getRequestOptions(instance, options) {
        var last_options = _.extend({}, instance.options, _.isObject(options) ? options : {}),
            before_send_cb;

        if (last_options.hasOwnProperty('success') || last_options.hasOwnProperty('done')) {
            instance.removeListener('success_listeners_from_options');
            instance.addListener('done', _.values(_.pick(last_options, ['success', 'done'])), {
                priority: Priority.PRIORITY_HIGHEST,
                key: 'success_listeners_from_options'
            });
        }
        if (last_options.hasOwnProperty('error') || last_options.hasOwnProperty('fail')) {
            instance.removeListener('error_listeners_from_options');
            instance.addListener('fail', _.values(_.pick(last_options, ['error', 'fail'])), {
                priority: Priority.PRIORITY_HIGHEST,
                key: 'error_listeners_from_options'
            });
        }
        if (last_options.hasOwnProperty('complete') || last_options.hasOwnProperty('always')) {
            instance.removeListener('complete_listeners_from_options');
            instance.addListener('always', _.values(_.pick(last_options, ['complete', 'always'])), {
                priority: Priority.PRIORITY_HIGHEST,
                key: 'complete_listeners_from_options'
            });
        }
        if (last_options.hasOwnProperty('beforeSend')) {
            before_send_cb = last_options.beforeSend;
        }

        last_options = _.omit(last_options, ['success', 'done', 'error', 'fail', 'complete', 'always', 'beforeSend']);

        last_options['done'] = _ajax_done_cb.bind(instance);
        last_options['fail'] = _ajax_fail_cb.bind(instance);
        last_options['always'] = _ajax_always_cb.bind(instance);
        last_options['beforeSend'] = function (jqXHR, settings) {
            var result = true;

            if (instance.option('auto_abort') && instance.isRequesting()) {
                instance.abort();
            }
            if (_.isFunction(before_send_cb) && !instance.isRetrying()) {
                result = before_send_cb.apply(instance, [jqXHR, settings]);
            }
            if (!_.isObject(last_options.data)) {
                last_options.data = {};
            }

            if (false !== result) {
                instance.requested++;
                instance.error = null;
                instance._is_response_meaning_failed = false;
                instance.response = null;
                instance.responses = null;

                if (instance.isRetrying()) {
                    instance.retry_time++;
                    instance.emitEvent('retry');
                } else {
                    instance.retry_time = 0;
                    instance.emitEvent('request');
                }
            }

            return result;
        };

        if (!_.isEmpty(last_options.data_tasks)) {
            var request_data_result = Task.apply(_.clone(last_options.data), last_options.data_tasks);

            if (request_data_result.data) {
                last_options.data = request_data_result.data;
            } else {
                this.error = request_data_result.error;
                return false;
            }
        }

        return _.omit(last_options, ['response_tasks', 'data_tasks', 'auto_abort', 'retry', 'retry_delay', 'is_continue']);
    }

    /**
     * Do Request
     * @param instance
     * @param options
     * @returns {Ajax|*}
     * @private
     */
    function _do_request(instance, options) {
        var last_options;

        if ((arguments.length == 1 || instance.isRetrying()) && _.isObject(instance._last_options)) {
            last_options = instance._last_options;
        } else {
            last_options = _getRequestOptions(instance, options);
            if (false !== last_options) {
                instance._last_options = last_options;
            } else {
                instance.emitEvent('fail', instance.error.message, instance.error.code);
                _at_the_end(instance);
            }
        }

        if (last_options) {
            instance.jqXHR = $.ajax(_.omit(last_options, ['done', 'fail', 'always']))
                .done(last_options['done'])
                .fail(last_options['fail'])
                .always(last_options['always']);
        }

        return instance;
    }

    Ajax.prototype.request = function (options) {
        return _do_request(this, options);
    };

    /**
     * Abort current request
     */
    Ajax.prototype.abort = function () {
        if (this.isRequesting() && this.jqXHR.abort) {
            this.jqXHR.abort();
        } else if (this.isRetrying()) {
            clearTimeout(this._retry_timeout_id);
            this.emitEvent('aborted');
            _at_the_end(this);
        }
    };

    function _ajax_restful_shorthand_func(instance, method, url, data, callback, dataType) {
        var args,
            options = {
                url: url,
                method: (method + '').toUpperCase()
            };

        args = M.optionalArgs(Array.prototype.slice.call(arguments, 3), ['data', 'callback', 'dataType'], {
            data: ['string', 'Object'],
            callback: 'Function',
            dataType: 'string'
        });

        if (args.data) {
            options.data = args.data;
        }
        if (args.callback) {
            options.done = args.callback;
        }
        if (args.dataType) {
            options.dataType = args.dataType;
        }

        return _do_request(instance, options);
    }

    ['get', 'post', 'put', 'delete'].forEach(function (method) {
        Ajax.prototype[method] = function (url, data, callback, dataType) {
            return _ajax_restful_shorthand_func.apply(null, [this, method.toUpperCase()].concat(Array.prototype.slice.call(arguments, 0)));
        };
    });
    ['get', 'post'].forEach(function (method) {
        Ajax.prototype[method + 'JSON'] = function (url, data, callback) {
            var args = M.optionalArgs(Array.prototype.slice.call(arguments, 0, 3), ['url', 'data', 'callback'], {
                    url: 'string',
                    data: ['string', 'Object'],
                    callback: 'Function'
                }),
                options = {
                    dataType: 'json'
                };

            if (args.url) {
                options.url = args.url;
            }
            if (args.data) {
                options.data = args.data;
            }
            if (args.callback) {
                options.done = args.callback;
            }

            return this.request(options);
        };
    });

    ['get', 'post', 'put', 'delete', 'getJSON', 'postJSON'].forEach(function (method) {
        Ajax[method] = function (url, data, callback, dataType) {
            var instance = new Ajax();

            instance[method].apply(instance, Array.prototype.slice.call(arguments, 0));
            return instance;
        }
    });

    /**
     *
     * @param {string|object} [data]
     */
    Ajax.prototype.query = function (data) {
        var options = {
            method: 'GET'
        };

        if (data) {
            options.data = data;
        }

        return this.request(options);
    };

    /**
     *
     * @param {string|object} [data]
     */
    Ajax.prototype.send = function (data) {
        var options = {
            method: 'POST'
        };

        if (data) {
            options.data = data;
        }

        return this.request(options);
    };


    /*
     |--------------------------------------------------------------------------
     | Ajax Helpers
     |--------------------------------------------------------------------------
     */

    /**
     * Create Ajax instance with Pre Options
     * @param {string} pre_options_name
     * @param {{}} [custom_options={}]
     * @returns {Ajax}
     */
    Ajax.use = function (pre_options_name, custom_options) {
        return new Ajax(PreOptions.get(pre_options_name, custom_options));
    };


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
    Ajax.load = function (url, target, options) {
        var instance = new Ajax();

        if (!_.isObject(options)) {
            options = {};
        }

        options = _.extend({
            error_content: '',
            apply_type: 'replace'
        }, options, {
            url: url
        });

        instance.option(options);
        instance.done(function (response) {
            _load_apply_content(response, target, options.apply_type);
        }).fail(function (error_message, error_code) {
            var response = '';

            if (options.error_content) {
                if (_.isFunction(options.error_content)) {
                    response = options.error_content(instance, error_message, error_code);
                } else {
                    response = options.error_content + '';
                }
            }

            _load_apply_content(response, target, options.apply_type);
        });

        instance.request();

        return instance;
    };

    Task.register('AjaxDataSource', function (response, success_cb, error_cb) {
        if (_.isObject(response)) {
            if (_.has(response, path)) {
                return success_cb(_.get(response, path));
            }

            return error_cb('Ajax result path not found');
        }

        return error_cb('Response must be an object');
    }, {
        path: ''
    });


    return Ajax;
}));