(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['lodash', 'event_emitter'], factory);
    } else {
        // Browser globals
        root.Store = factory(root._, root.EventEmitter);
    }
}(this, function (_, EventEmitter) {

    function Store(init_data) {
        EventEmitter.call(this);

        this.name = '';
        this._data = _.isObject(init_data) ? _.cloneDeep(init_data) : {};
    }

    Store.prototype = Object.create(EventEmitter.prototype);
    Store.prototype.constructor = Store;

    /**
     *
     * @param {object} new_data
     * @param {boolean} [silent=false]
     */
    Store.prototype.change = function (new_data, silent) {
        var old_data = _.cloneDeep(this._data);

        _.extend(this._data, new_data);

        if (!silent) {
            this.emitEvent('change', {
                old_data: old_data,
                new_data: _.cloneDeep(this._data)
            });
        }
    };

    Store.prototype.triggerChange = function () {
        this.emitEvent('change', {
            old_data: _.cloneDeep(this._data),
            new_data: _.cloneDeep(this._data)
        });
    };
    Store.prototype.getData = function () {
        return _.cloneDeep(this._data);
    };


    return Store;
}));