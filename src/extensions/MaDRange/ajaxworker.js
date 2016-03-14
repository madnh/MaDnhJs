;(function (_) {
    /**
     * AJAX helper
     * @module AJAXWorker
     * @memberOf MaDnh
     */
    function AJAXWorker() {
        /**
         * Options
         * @type {{path: string, method: string, dataType: string, data: Array, async: boolean, timeout: number,
         *     crossDomain: boolean, success: MaDnh.module:AJAXWorker.options.success, error:
         *     MaDnh.module:AJAXWorker.options.error, complete: MaDnh.module:AJAXWorker.options.complete, beforeSend:
         *     MaDnh.module:AJAXWorker.options.beforeSend}}
         */
        this.options = {
            path: '',
            method: 'GET',
            dataType: '',
            data: [],
            async: true,
            timeout: 10000,
            crossDomain: false,
            success: function () {
            },
            error: function () {
            },
            complete: function () {
            },
            beforeSend: function () {
                return true;
            }
        };

        /**
         * jQuery XHR instance
         * @type {null}
         */
        this.jqXHR = null;

        /**
         * Instance ID
         * @type {string}
         */
        this.id = M.nextID('ajax_worker_');
    }

    /**
     * Setting
     * @method
     * @param {(string|{})} option
     * @param {*} [value]
     */
    AJAXWorker.prototype.option = function (option, value) {
        this.options = M.setup(this.options, option, value);
    };
    /**
     * Start send request
     * @param {{}} option
     * @returns {*}
     */
    AJAXWorker.prototype.request = function (option) {
        this.option(option);
        var las_option = this.options;
        var request_option = {
            url: las_option.path,
            type: las_option.method.toUpperCase(),
            dataType: las_option.dataType,
            async: las_option.async,
            data: las_option.data,
            timeout: las_option.timeout
        };

        request_option['success'] = function (data) {
            if (las_option.success) {
                M.callFunc(las_option.success, data);
            }
        };
        request_option['error'] = function (jqXHR, textStatus, errorThrown) {
            if (las_option.error) {
                var result = {
                    message: 'Ajax error',
                    textStatus: textStatus,
                    errorThrown: errorThrown
                };
                switch (jqXHR.statusText) {
                    case 'timeout':
                        result.message = 'Request timeout';
                        break;
                    case 'error':
                        switch (jqXHR.status) {
                            case 403:
                                result.message = 'Invalid request path';
                                break;
                            case 404:
                                result.message = 'Request path not found';
                        }
                        break;
                }
                M.callFunc(las_option.error, result);
            }
        };
        request_option['complete'] = function (jqXHR, textStatus) {
            if (las_option.complete) {
                M.callFunc(las_option.complete, {
                    jqXHR: jqXHR,
                    textStatus: textStatus
                });
            }
        };
        request_option['beforeSend'] = function (jqXHR, settings) {
            if (las_option.beforeSend) {
                return M.callFunc(las_option.beforeSend, {
                    jqXHR: jqXHR,
                    settings: settings
                });
            }
            return true;
        };
        this.jqXHR = $.ajax(request_option);
        return this.jqXHR;
    };

    /**
     * Abort the request
     */
    AJAXWorker.prototype.abort = function () {
        if (_.isObject(this.jqXHR) && this.jqXHR.abort) {
            this.jqXHR.abort();
        }
    };
    /**
     * Get status of ajax
     * @returns {(boolean|number)}
     */
    AJAXWorker.prototype.status = function () {
        if (_.isObject(this.jqXHR) && this.jqXHR.abort) {
            return this.jqXHR.readyState;
        }

        return false;
    };

    /**
     * Check if instance is requesting
     * @returns {boolean}
     */
    AJAXWorker.prototype.isRequesting = function () {
        var status = this.status();

        return status !== false && status >= 1 && status <= 3;
    };

    /**
     * Check if instance is ready for request
     * @returns {boolean}
     */
    AJAXWorker.prototype.isReady = function () {
        var status = this.status();

        return status !== false && status === 0;
    };

    /**
     * Check if instance is done
     * @returns {boolean}
     */
    AJAXWorker.prototype.isDone = function () {
        var status = this.status();

        return status !== false && status === 4;
    };


    M.AJAXWorker = AJAXWorker;
})(_);