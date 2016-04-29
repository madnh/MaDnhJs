(function (_) {
    var tasks = {};

    function Task(handler) {
        this.options = {};
        this.handler = handler || null;
    }

    Task.prototype.option = function (name, value) {
        this.options = _.M.setup.apply(_.M, [this.options].concat(Array.prototype.slice.apply(arguments)));

        return this;
    };

    Task.prototype.process = function (value) {
        var self = this;
        if (_.isFunction(this.handler)) {
            value = this.handler.bind(this)(value);
        } else if (_.isArray(this.handler)) {
            _.each(this.handler, function (handle) {
                if (_.isFunction(handle)) {
                    value = handle.bind(self)(value);
                } else if (_.isString(handle)) {
                    value = Task.factory(handle).process(value);
                } else {
                    throw new Error('Invalid task handle');
                }
            });
        }

        return value;
    };

    Task.has = function (name) {
        return tasks.hasOwnProperty(name);
    };

    Task.register = function (name, handler, options) {
        tasks[name] = {
            handler: handler,
            options: options
        }
    };

    Task.factory = function (name, options) {
        if (tasks.hasOwnProperty(name)) {
            var task_info = tasks[name],
                task = new Task();

            task.handler = task_info['handler'];
            task.options = task_info['options'];

            if (_.isObject(options)) {
                task.option(options);
            }
            return task;
        }

        throw new Error('Create unregistered task: ' + name);
    };

    _.M.Task = Task;
}).call(window, _);