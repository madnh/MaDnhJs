;(function (_) {
    var tasks = {};

    /**
     *
     * @param {string|function|function[]|{}} [handler]
     * @constructor
     */
    function Task(handler) {
        this.type_prefix = 'Task';
        _.M.BaseClass.call(this);
        /**
         * Task name
         * @type {string}
         */
        this.name = '';
        /**
         * Task options
         * @type {{}}
         */
        this.options = {};

        /**
         * Task process handler
         * @type {string|Function|Function[]|{}|null}
         */
        this.handler = handler || null;

        /**
         *
         * @type {*}
         * @private
         */
        this._result = null;

        /**
         *
         * @type {null|{code: number, message: string}}
         * @private
         */
        this._error = null;
    }

    /**
     *
     * @param {string|{}} name Option name or object of options
     * @param {*} [value]
     * @returns {Task}
     */
    Task.prototype.option = function (name, value) {
        this.options = _.M.setup.apply(_.M, [this.options].concat(_.toArray(arguments)));

        return this;
    };

    /**
     * Check if process is error
     * @returns {boolean}
     */
    Task.prototype.isError = function () {
        return !_.isNull(this._error);
    };

    /**
     * @return {null|{}} void when process is ok. Object with error code and message
     */
    Task.prototype.getError = function () {
        if (this.isError()) {
            return _.pick(_.extend({
                code: 0,
                message: ''
            }, _.isObject(this._error) ? this._error : {}), 'code', 'message');
        }

        return null;
    };

    /**
     *
     * @returns {*}
     */
    Task.prototype.getResult = function () {
        return this._result;
    };

    /**
     *
     * @param {*} result
     */
    Task.prototype.setProcessResult = function (result) {
        this._result = result;
        this._error = null;
    };

    /**
     *
     * @param {string} message
     * @param {string|number} [code=0]
     */
    Task.prototype.setProcessError = function (message, code) {
        this._result = null;
        this._error = {
            message: message,
            code: code || 0
        }
    };

    /**
     * Process data
     * @param {*} data
     * @returns {boolean} Success (true) or not (false)?
     */
    Task.prototype.process = function (data) {
        var self = this;

        this._result = _.clone(data);
        this._error = null;

        if (_.isString(this.handler)) {
            this.handler = _.castArray(this.handler);
        }
        if (_.isFunction(this.handler)) {
            _process_handler_as_function(this, this.handler, data);
        } else if (this.handler instanceof Task) {
            _process_handler_as_task(this, this.handler, self._result);
        } else if (_.isArray(this.handler)) {
            _.M.loop(this.handler, function (handle) {
                var task_instance;

                if (_.isString(handle)) {
                    task_instance = Task.factory(handle);
                } else {
                    task_instance = new Task(handle);
                }

                _process_handler_as_task(self, task_instance, self._result);

                if (self.isError()) {
                    return 'break';
                }
            });
        } else if (_.isObject(this.handler)) {
            _.M.loop(this.handler, function (options, handle) {
                var task_instance = Task.factory(handle);

                if (!_.isEmpty(options)) {
                    task_instance.options(options);
                }

                _process_handler_as_task(self, task_instance, self._result);

                if (self.isError()) {
                    return 'break';
                }
            });
        }

        return !this.isError();
    };

    function _process_handler_as_function(instance, handler, data) {
        try {
            handler.bind(instance)(data, instance.setProcessResult.bind(instance), instance.setProcessError.bind(instance));
        } catch (e) {
            instance.setProcessError(e.message || e.description, e.number || 0);
        }
    }

    function _process_handler_as_task(instance, task, data) {
        task.process(data);

        instance._result = task.getResult();
        instance._error = task.getError();
    }


    /**
     * Check if task is exists
     * @param {string} name
     * @returns {boolean}
     */
    Task.isRegistered = function (name) {
        return tasks.hasOwnProperty(name);
    };

    /**
     * Return task list
     * @returns {Array}
     */
    Task.list = function () {
        return Object.keys(tasks);
    };

    /**
     * Register task
     * @param {string} name
     * @param {string|function|object|function[]} handler
     * @param {{}} [options] Task options
     */
    Task.register = function (name, handler, options) {
        var info = _.M.optionalArgs(_.M.sliceArguments(arguments), ['name', 'handler', 'options'], {
            name: 'string',
            handler: ['string', 'Function', 'Array', 'Task'],
            options: 'Object'
        });

        if (info.handler instanceof Task) {
            info.name = info.handler.name;
        }

        tasks[info.name] = {
            handler: info.handler,
            options: info.options
        }
    };

    /**
     * Create task instance from name
     * @param {string} name Task name
     * @param {{}} [options] Task instance options
     * @returns {Task}
     */
    Task.factory = function (name, options) {
        if (Task.isRegistered(name)) {
            var task_info = tasks[name],
                task = new Task();

            task.name = name;
            task.handler = task_info['handler'];
            task.options = task_info['options'];

            if (_.isObject(options)) {
                task.option(options);
            }
            return task;
        }

        throw new Error('Create an unregistered task: ' + name);
    };

    Task.apply = function (data, tasks) {
        var result = {
            data: _.clone(data)
        };

        if (tasks) {
            if (_.isString(tasks)) {
                tasks = [tasks];
            }
            if (_.isArray(tasks)) {
                tasks = _.zipObject(tasks, _.fill(new Array(tasks.length), {}));
            }

            _.M.loop(tasks, function (options, name) {
                var task = Task.factory(name, options);

                if (task.process(_.clone(result['data']))) {
                    result['data'] = task.getResult();
                } else {
                    delete result['data'];
                    result['error'] = task.getError();
                    return 'break';
                }
            });
        }

        return result;
    };

    _.M.Task = Task;
}).call(window, _);