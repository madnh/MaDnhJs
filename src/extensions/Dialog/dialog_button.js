;(function (_) {
    var version = '1.0.0';

    _.M.defineConstant({
        DIALOG_BUTTON_PRE_OPTIONS_NAME: '_.M.DialogButton',
        DIALOG_BUTTON_TEMPLATE_TYPE: 'DialogButton',
        BUTTON_INFO: 'info',
        BUTTON_PRIMARY: 'primary',
        BUTTON_SUCCESS: 'success',
        BUTTON_WARNING: 'warning',
        BUTTON_DANGER: 'danger'
    });
    _.M.defineConstant({
        BUTTON_OK: 'ok',
        BUTTON_CANCEL: 'cancel',
        BUTTON_YES: 'yes',
        BUTTON_NO: 'no',
        BUTTON_RETRY: 'retry',

        DIALOG_BUTTON_OK_ONLY: ['ok'],
        DIALOG_BUTTON_OK_CANCEL: ['ok', 'cancel'],
        DIALOG_BUTTON_YES_NO: ['yes', 'no'],
        DIALOG_BUTTON_YES_NO_CANCEL: ['yes', 'no', 'cancel'],
        DIALOG_BUTTON_RETRY_CANCEL: ['retry', 'cancel']
    });


    var _buttons = {};

    _.M.PreOptions.define(_.M.DIALOG_BUTTON_PRE_OPTIONS_NAME, {
        label: 'Untitled',
        icon: '',
        type: _.M.BUTTON_INFO,
        size: 1,
        handler: null,
        disable_on_pending: true,
        clickable: _default_clickable_cb,
        template_name: '',
        template: {}
    });
    function _default_clickable_cb(button) {
        return button.isVisible() && button.isEnable() && button.getDialog().isClickable();
    }

    function DialogButton(option) {
        this.type_prefix = 'dialog_button';
        _.M.EventEmitter.call(this);

        this.options = _.M.PreOptions.get(_.M.DIALOG_BUTTON_PRE_OPTIONS_NAME, {
            name: this.id
        });

        _buttons[this.id] = {
            dialog: null,
            enabled: true,
            visible: true,
            template_instance: null
        };

        this.option(this.options);

        if (option) {
            if (option.hasOwnProperty('events')) {
                this.addListeners(option.events);
                delete option['events'];
            }

            this.option(option);
        }

        _init_btn(this);
    }

    function _init_btn(instance) {
        instance.on('attached', _btn_event_attached);
        instance.on('detached', _btn_event_detached);
        instance.on('dialog.toggle_enable', _btn_event_dialog_toggle_enable);
        instance.on('dialog.toggle_pending', _btn_event_dialog_toggle_pending);
    }

    function _btn_event_attached(dialog) {
        if (dialog instanceof _.M.Dialog) {
            _buttons[this.id].dialog = dialog;
        }
    }

    function _btn_event_detached(dialog) {
        if (dialog instanceof _.M.Dialog) {
            _buttons[this.id].dialog = null;
        }
    }

    function _btn_event_dialog_toggle_enable(notice_data) {
        this.toggleEnable(notice_data.data);
    }

    function _btn_event_dialog_toggle_pending(notice_data) {
        if (notice_data.data) {
            if (this.options.disable_on_pending) {
                this.toggleEnable(false);
            }
        } else {
            this.toggleEnable(true);
        }

    }

    _.M.inherit(DialogButton, _.M.EventEmitter);
    Object.defineProperty(DialogButton, 'version', {
        value: version
    });

    /**
     *
     * @param {{}} options
     */
    DialogButton.globalOption = function (options) {
        _.M.PreOptions.update(_.M.DIALOG_BUTTON_PRE_OPTIONS_NAME, options);
    };

    DialogButton.prototype.setTemplate = function (template_instance) {
        if (!_.M.isTemplateInstance(template_instance)) {
            throw new Error('Invalid Template instance');
        }

        if (_buttons[this.id].template_instance) {
            _buttons[this.id].template_instance.disconnect();
            _buttons[this.id].template_instance = null;
        }
        template_instance.option(this.options.template);
        _buttons[this.id].template_instance = template_instance;
        template_instance.connect(this);
    };

    /**
     * Get template instance
     * @returns {null|*}
     */
    DialogButton.prototype.getTemplate = function () {
        if (!_buttons[this.id].template_instance) {
            if (!this.options.template_name) {
                var default_options = _.M.PreOptions.get(_.M.DIALOG_BUTTON_PRE_OPTIONS_NAME);

                if (default_options.template_name && _.M.Template.hasTemplate(_.M.DIALOG_BUTTON_TEMPLATE_TYPE, default_options.template_name)) {
                    this.options.template_name = default_options.template_name;
                } else {
                    var default_template = _.M.Template.defaultTemplate(_.M.DIALOG_BUTTON_TEMPLATE_TYPE);

                    if (false !== default_template) {
                        this.options.template_name = default_template;
                        _.M.PreOptions.update(_.M.DIALOG_BUTTON_PRE_OPTIONS_NAME, {
                            template_name: default_template
                        });
                    } else {
                        throw new Error('Dialog button default template not found');
                    }
                }
            }


            this.setTemplate(_.M.Template.templateInstance(_.M.DIALOG_BUTTON_TEMPLATE_TYPE, this.options.template_name));
        }

        return _buttons[this.id].template_instance;
    };

    DialogButton.prototype.option = function (name, value) {
        var option = _.M.asObject.apply(_.M, _.toArray(arguments));

        if (option.template_name) {
            this.setTemplate(_.M.Template.templateInstance(_.M.DIALOG_BUTTON_TEMPLATE_TYPE, option.template_name));
        }
        if (option.template) {
            this.getTemplate().option(option.template);
        }

        _.extend(this.options, _.omit(option, ['template_name']));

        return this;
    };

    DialogButton.prototype.setHandler = function (callback) {
        this.option('handler', callback);
    };

    /**
     * Get dialog instance
     * @returns {(_.M.Dialog|boolean)} False if not attach to dialog yet
     */
    DialogButton.prototype.getDialog = function () {
        if (_buttons[this.id].dialog) {
            return _buttons[this.id].dialog;
        }

        return false;
    };

    DialogButton.prototype.isClickable = function () {
        if (_.isFunction(this.options.clickable)) {
            return this.options.clickable.call(this, this);
        }

        return Boolean(this.options.clickable);
    };

    DialogButton.prototype.isVisible = function () {
        return Boolean(_buttons[this.id].visible);
    };
    DialogButton.prototype.isEnable = function () {
        return Boolean(_buttons[this.id].enabled);
    };

    /**
     * Click button
     * Emit events:
     * - click: run before button handler run
     * - clicked: rung after button handler run
     *
     * @returns {boolean}
     */
    DialogButton.prototype.click = function () {
        if (this.isClickable()) {
            this.emitEvent('click');
            if (this.options.handler) {
                _.M.callFunc(this.options.handler, this, this);
            }
            this.emitEvent('clicked');

            return true;
        }

        return false;
    };

    /**
     * Show or hide button
     * Emit events:
     * - show/hide
     * - toggle: [is show?]
     * @param {boolean} show True or missing: show, False: hide
     */
    DialogButton.prototype.toggle = function (show) {
        if (_.isUndefined(show)) {
            show = !_buttons[this.id].visible;
        }

        if (_buttons[this.id].visible != show) {
            _buttons[this.id].visible = show;
            if (show) {
                this.emitEvent('show');
            } else {
                this.emitEvent('hide');
            }

            this.emitEvent('toggle', show);
        }
    };
    DialogButton.prototype.show = function () {
        this.toggle(true);
    };
    DialogButton.prototype.hide = function () {
        this.toggle(false);
    };

    /**
     * Toggle enabled status
     * Emit events:
     * - enabled/disabled
     * - toggle_enabled: [is enabled?]
     * @param is_enable
     */
    DialogButton.prototype.toggleEnable = function (is_enable) {
        if (_.isUndefined(is_enable)) {
            is_enable = !_buttons[this.id].enabled;
        }

        if (_buttons[this.id].enabled !== is_enable) {
            _buttons[this.id].enabled = is_enable;
            this.emitEvent(is_enable ? 'enabled' : 'disabled');
            this.emitEvent('toggle_enable', is_enable);
        }
    };

    DialogButton.prototype.disable = function () {
        this.toggleEnable(false);
    };
    DialogButton.prototype.enable = function () {
        this.toggleEnable(true);
    };


    DialogButton.prototype.render = function () {
        return this.getTemplate().render();
    };

    /**
     * Refresh button DOM
     * @returns {boolean}
     */
    DialogButton.prototype.reDraw = function () {
        if (_buttons[this.id].template_instance) {
            return _buttons[this.id].template_instance.reDraw();
        }

        return false;
    };

    /**
     *
     * @returns {boolean}
     */
    DialogButton.prototype.getDOM = function () {
        if (_buttons[this.id].template_instance && _.M.isTemplateInstance(_buttons[this.id].template_instance)) {
            return _buttons[this.id].template_instance.getDOM();
        }

        return false;
    };

    /**
     * 
     * @param name
     * @returns {_.M.DialogButton|null|*|Object|_.M.EventEmitter|_.M.Dialog}
     */
    DialogButton.prototype.getOtherButton = function (name) {
        return this.getDialog().getButton(name);
    };

    /**
     * Dialog close "by" key
     * @returns {string}
     */
    DialogButton.prototype.getCloseKey = function () {
        return this.options.name;
    };

    /**
     * Close dialog
     * @param force
     * @returns {boolean}
     */
    DialogButton.prototype.closeDialog = function (force) {
        var dialog = this.getDialog();

        if (dialog) {
            dialog.close(force, this.getCloseKey());
            return true;
        }

        return false;
    };

    /**
     * Check if dialog closed by this button
     * @returns {boolean}
     */
    DialogButton.prototype.wasCloseDialog = function () {
        var dialog = this.getDialog();

        if (dialog) {
            return dialog.setClosedBy(this);
        }

        return false;
    };

    var button_pre_options = {};

    DialogButton.has = function (name) {
        return button_pre_options.hasOwnProperty(name);
    };

    DialogButton.register = function (name, options, freeze_options) {
        button_pre_options[name] = {
            options: _.isObject(options) ? options : {},
            freeze_options: _.isObject(freeze_options) ? freeze_options : {}
        };
        button_pre_options[name].freeze_options.name = name;
    };

    DialogButton.options = function (name, options) {
        if (button_pre_options.hasOwnProperty(name)) {
            _.extend(button_pre_options[name].options, options);
        }

        return false;
    };

    _.each(['Ok', 'Yes', 'No', 'Retry', 'Ignore'], function (label) {
        DialogButton.register(label.toLowerCase(), {
            label: label
        });
    });

    DialogButton.register('cancel', {
        label: 'Cancel',
        disable_on_pending: false
    });

    DialogButton.factory = function (types, all_button_options, button_options) {
        if (!_.isObject(all_button_options)) {
            all_button_options = {};
        }
        if (!_.isObject(button_options)) {
            button_options = {};
        }

        var buttons = _.M.asArray(types).map(function (type) {
            var options, type_options;

            if (!DialogButton.has(type)) {
                throw new Error('Invalid DialogButton type');
            }

            type_options = button_pre_options[type];

            if (button_options.hasOwnProperty(type)) {
                options = _.extend({}, type_options.options, button_options[type], type_options.freeze_options);
            } else {
                options = _.extend({}, type_options.options, type_options.freeze_options);
            }

            return new DialogButton(_.extend({}, all_button_options, options));
        });

        if (buttons.length == 1) {
            return buttons.shift();
        }

        return buttons;
    };

    DialogButton.defaultClickable = _default_clickable_cb;

    _.M.DialogButton = DialogButton;

    /**
     * Check if object is DialogButton instance
     * @param button
     * @returns {boolean}
     */
    _.M.isDialogButton = function (button) {
        return button instanceof DialogButton;
    };
})(_);