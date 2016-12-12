(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], function () {
            return (root.Flag = factory());
        });
    } else {
        // Browser globals
        root.Flag = factory();
    }
}(this, function () {
    function Flag() {
        this._flags = {};

    }

    /**
     * Check if a flag is exists
     * @param {string} name
     * @return {boolean}
     */
    Flag.prototype.hasFlag = function (name) {
        return this._flags && this._flags.hasOwnProperty(name);
    };

    /**
     * Set a flag
     * @param {string} name
     * @param {boolean} [is_active=true] Flag status, default is True
     * @return {Flag}
     */
    Flag.prototype.flag = function (name, is_active) {
        is_active = (is_active || typeof is_active == 'undefined') ? true : Boolean(is_active);

        if (!this._flags) {
            this._flags = {};
        }
        if (name instanceof Array) {
            for (var i = 0, len = name.length; i < len; i++) {
                this._flags[name[i]] = is_active;
            }
        } else if (name instanceof Object) {
            for (var tmp_name in name) {
                if (name.hasOwnProperty(tmp_name)) {
                    this._flags[tmp_name] = Boolean(name[tmp_name]);
                }
            }
        } else {
            this._flags[name] = is_active;
        }

        return this;
    };

    /**
     * Get flag status is on (true) or off (false)
     * @param {string} name
     * @return {boolean} true -> on, false -> off
     */
    Flag.prototype.flagStatus = function (name) {
        return this._flags && this._flags.hasOwnProperty(name) && Boolean(this._flags[name]);
    };

    /**
     * Check if a flag is exists and it's status is on
     * @param {string} name
     * @return {boolean}
     */
    Flag.prototype.isFlagged = function (name) {
        return true === this.flagStatus(name);
    };

    /**
     *
     * @param {string|Array} flags
     * @param {boolean} [status] Missing - On/off when current flag's status is off/on.
     * Boolean - On/off when status is true/false
     *
     * @return {Flag}
     */
    Flag.prototype.toggleFlag = function (flags, status) {
        if (flags instanceof Array) {
            for (var index in flags) {
                this.toggleFlag(flags[index], status);
            }

            return this;
        }
        if (typeof status != 'undefined') {
            this.flag(flags, Boolean(status));
        } else {
            this.flag(flags, !this.isFlagged(flags));
        }

        return this;
    };

    /**
     *
     * @return {Flag}
     */
    Flag.prototype.resetFlagStatus = function () {
        this._flags = {};

        return this;
    };

    Flag.mixin = function (destObject) {
        var props = ['hasFlag', 'flag', 'flagStatus', 'isFlagged', 'toggleFlag', 'resetFlagStatus'];

        for (var i = 0; i < props.length; i++) {
            if (typeof destObject === 'function') {
                destObject.prototype[props[i]] = Flag.prototype[props[i]];
            } else {
                destObject[props[i]] = Flag.prototype[props[i]];
            }
        }

        return destObject;
    };


    var static_instance = new Flag();

    var methods = ['hasFlag', 'flag', 'flagStatus', 'isFlagged', 'toggleFlag', 'resetFlagStatus'];

    for (var i = 0, len = methods.length; i < len; i++) {
        Flag[methods[i]] = (function (method) {
            return function () {
                return static_instance[method].apply(static_instance, Array.prototype.slice.call(arguments));
            };
        })(methods[i]);
    }


    return Flag;
}));