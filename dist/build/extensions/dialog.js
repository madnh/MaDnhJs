(function (_) {
    var version = '1.0.0';

    _.M.defineConstant({
        DIALOG_TEMPLATE_TYPE: 'Dialog',
        DIALOG_STATUS_INITIAL: 'initial',
        DIALOG_STATUS_OPENED: 'opened',
        DIALOG_STATUS_HIDING: 'hiding',
        DIALOG_STATUS_REMOVED: 'removed',

        DIALOG_INFO: 'info',
        DIALOG_SUCCESS: 'success',
        DIALOG_WARNING: 'warning',
        DIALOG_DANGER: 'danger',

        DIALOG_SIZE_SMALL: 'small',
        DIALOG_SIZE_NORMAL: 'normal',
        DIALOG_SIZE_LARGE: 'large'
    });

    var _dialogs = {};
    var default_options = {
        template: ''
    };

    function resetDialog(id) {
        var data = {
            status: _.M.DIALOG_STATUS_INITIAL,
            enabled: true,
            pending: false,
            loading: false,
            ajax_worker: null,
            template_instance: null
        };
        if (_dialogs.hasOwnProperty(id)) {
            data.template_instance = _dialogs[id].template_instance;
        }

        _dialogs[id] = data;
    }


    /**
     * Can add events to dialog by add events to option parameter field as 'events'
     * Add buttons via options parameter field as 'buttons'
     * @param {Object} [options] Dialog options
     * @constructor
     * @extend _.M.EventEmitter
     */
    function Dialog(options) {
        var self = this;
        _.M.EventEmitter.call(this);

        this.options = _.extend({}, default_options, {
            title: 'Dialog',
            type: _.M.DIALOG_INFO,
            content: '',
            contentHandler: null,
            size: _.M.DIALOG_SIZE_NORMAL,
            removable: function (dialog_instance) {
                return dialog_instance.isEnable();
            },
            clickable: function (dialog_instance) {
                return dialog_instance.isEnable() && !dialog_instance.isPending();
            }
        });

        this.closed_by = '';
        this.data = {};
        this.buttons = {};

        resetDialog(this.id);

        this.option(this.options);

        if (options) {
            if (options.hasOwnProperty('events') && options.events) {
                this.addListeners(options.events);
                delete options['events'];
            }

            if (options.hasOwnProperty('buttons') && options.buttons) {
                _.each(options.buttons, function (button) {
                    self.attachButton(button);
                });
                delete options['buttons'];
            }

            this.option(options);
        }
    }

    Dialog.prototype = Object.create(_.M.EventEmitter.prototype);
    Dialog.prototype.constructor = Dialog;
    Object.defineProperty(Dialog, 'version', {
        value: version
    });

    /**
     * Setup default options
     * @param option
     * @param value
     */
    Dialog.defaultOption = function (option, value) {
        default_options = _.M.setup.apply(_.M, [default_options].concat(_.toArray(arguments)));
    };

    function updateDialogContentCallback(content) {
        if (_.isFunction(this.options.contentHandler)) {
            content = this.options.contentHandler(content, this);
        }
        this.emitEvent('content_loaded', content);
        this.updateContent(content);
    }

    Dialog.prototype.getContent = function () {
        if (_.isFunction(this.options.content)) {
            this.emitEvent('load_content');
            this.options.content = this.options.content(updateDialogContentCallback.bind(this), this);
        }

        if (_.isFunction(this.options.contentHandler)) {
            return this.options.contentHandler(this.options.content, this);
        }

        return this.options.content;
    };

    Dialog.prototype.updateContent = function (new_content) {
        this.options.content = new_content;

        if (this.isOpened()) {
            this.emitEvent('update_content', new_content);
        }
    };

    Dialog.prototype.setTemplate = function (template_instance) {
        if (!_.M.isTemplateInstance(template_instance)) {
            throw new Error('Invalid Template instance');
        }

        if (_dialogs[this.id].template_instance) {
            _dialogs[this.id].template_instance.disconnect();
            _dialogs[this.id].template_instance = null;
        }
        _dialogs[this.id].template_instance = template_instance;
        template_instance.connect(this);
    };

    /**
     * Get template instance
     * @returns {null|_.M.Template}
     */
    Dialog.prototype.getTemplate = function () {
        if (!_dialogs[this.id].template_instance) {
            if (!this.options.template) {
                if (default_options.template && _.M.Template.hasTemplate(_.M.DIALOG_TEMPLATE_TYPE, default_options.template)) {
                    this.options.template = default_options.template;
                } else {
                    var default_template = _.M.Template.defaultTemplate(_.M.DIALOG_TEMPLATE_TYPE);

                    if (false !== default_template) {
                        this.options.template = default_template;
                        default_options.template = default_template;
                    } else {
                        throw new Error('Dialog default template not found');
                    }
                }
            }


            this.setTemplate(_.M.Template.templateInstance(_.M.DIALOG_TEMPLATE_TYPE, this.options.template));
        }

        return _dialogs[this.id].template_instance;
    };

    Dialog.prototype.option = function (name, value) {
        var option = _.M.asObject.apply(_.M, _.toArray(arguments));

        if (option.hasOwnProperty('template') && option.template) {
            this.setTemplate(_.M.Template.templateInstance(_.M.DIALOG_TEMPLATE_TYPE, option.template));
        }

        _.extend(this.options, _.omit(option, ['template']));

        return this;
    };

    /**
     * Get dialog status
     * @returns {string|boolean}
     */
    Dialog.prototype.status = function () {
        if (_dialogs.hasOwnProperty(this.id)) {
            return _dialogs[this.id].status;
        }

        return false;
    };


    /**
     * Check if dialog status is: opened, showing or hiding
     * @returns {boolean}
     */
    Dialog.prototype.isOpened = function () {
        var status = this.status();
        return -1 !== [_.M.DIALOG_STATUS_OPENED, _.M.DIALOG_STATUS_HIDING].indexOf(status);
    };

    /**
     * Check if dialog is showing
     * @returns {boolean}
     */
    Dialog.prototype.isVisibling = function () {
        return this.status() === _.M.DIALOG_STATUS_OPENED;
    };

    /**
     * Check if dialog is hiding
     * @returns {boolean}
     */
    Dialog.prototype.isHiding = function () {
        return this.status() === _.M.DIALOG_STATUS_HIDING;
    };

    /**
     * Check if dialog is removed
     * @returns {boolean}
     */
    Dialog.prototype.isRemoved = function () {
        return this.status() === _.M.DIALOG_STATUS_REMOVED;
    };

    /**
     * Check if dialog is enabled
     * @returns {boolean}
     */
    Dialog.prototype.isEnable = function () {
        return Boolean(_dialogs[this.id].enabled);
    };

    /**
     * Check if dialog is pending
     * @returns {boolean}
     */
    Dialog.prototype.isPending = function () {
        return Boolean(_dialogs[this.id].pending);
    };

    /**
     * Enable dialog when it is disabled
     * Emit events when enabled success:
     * - enabled:
     * - toggle_enable:
     *   + 0: true if change event is enable
     *
     * @returns {boolean} True on enable success, otherwise.
     */
    Dialog.prototype.enable = function () {
        if (!this.isEnable()) {
            _dialogs[this.id].enabled = true;
            this.emitEvent('enabled');
            this.emitEvent('toggle_enable', true);
            return true;
        }
        return false;
    };

    /**
     * Disable dialog when it is enabling
     * Emit events when disable success:
     * - disabled:
     * - toggle_enable:
     *   + 0: false if change event is disable
     *
     * @returns {boolean} True on disable success, otherwise.
     */
    Dialog.prototype.disable = function () {
        if (this.isEnable()) {
            _dialogs[this.id].enabled = false;
            this.emitEvent('disabled');
            this.emitEvent('toggle_enable', false);
            return true;
        }
        return false;
    };
    /**
     * Set pending status is pending
     * Emit events when change success:
     * - pending:
     * - toggle_pending:
     *   + 0: true if change to pending
     *
     * @returns {boolean} True on change success, otherwise.
     */
    Dialog.prototype.pending = function () {
        if (!this.isPending()) {
            _dialogs[this.id].pending = true;
            this.emitEvent('pending');
            this.emitEvent('toggle_pending', true);
            return true;
        }
        return false;
    };

    /**
     * Set pending status is resolved
     * Emit events when change success:
     * - resolved:
     * - toggle_pending:
     *   + 0: false if change to resolved
     *
     * @returns {boolean} True on change success, otherwise.
     */
    Dialog.prototype.resolved = function () {
        if (this.isPending()) {
            _dialogs[this.id].pending = false;
            this.emitEvent('resolved');
            this.emitEvent('toggle_pending', false);
            return true;
        }
        return false;
    };

    /**
     *
     * @param {_.M.DialogButton|object} button DialogButton instance or button options
     */
    Dialog.prototype.attachButton = function (button) {
        if (!_.M.isDialogButton(button)) {
            if (_.isObject(button)) {
                button = new _.M.DialogButton(button);
            } else if (_.M.isLikeString(button) && _.M.DialogButton.has(button)) {
                button = _.M.DialogButton.factory(button);
            } else {
                throw new Error('Invalid button');
            }
        }

        this.buttons[button.options.name] = button;
        this.attach(button);

        return button;
    };

    /**
     * Check if button exists
     * @param {string} name
     * @returns {boolean}
     */
    Dialog.prototype.hasButton = function (name) {
        return this.buttons.hasOwnProperty(name);
    };

    /**
     * Get button instance
     * @param {string} name Button name
     * @returns {(_.M.DialogButton|Boolean)} False when button is not found
     */
    Dialog.prototype.getButton = function (name) {
        if (this.hasButton(name)) {
            return this.buttons[name];
        }
        return false;
    };

    Dialog.prototype.removeButton = function (name) {
        if (!this.hasButton(name)) {
            throw new Error('Remove not exists button');
        }
        this.detach(this.buttons[name]);
        delete this.buttons[name];
    };

    /**
     * Check if dialog is clickable
     * @returns {boolean}
     */
    Dialog.prototype.isClickable = function () {
        if (this.options.clickable) {
            if (_.isFunction(this.options.clickable)) {
                return this.options.clickable(this);
            }
            return Boolean(this.options.clickable);
        }

        return true;
    };

    Dialog.prototype.click = function (button_name) {
        if (this.isClickable() && this.hasButton(button_name)) {
            var button = this.getButton(button_name);
            button.click();

            this.emitEvent('clicked', button_name);
        }
        return false;
    };

    /**
     * Check if dialog is removable
     * @returns {boolean}
     */
    Dialog.prototype.isCloseable = function () {
        if (this.isOpened()) {
            if (this.options.removable) {
                if (_.isFunction(this.options.removable)) {
                    return this.options.removable(this);
                }
                return Boolean(this.options.removable);
            }

            return true;
        }

        return false;
    };

    Dialog.prototype.open = function () {
        if (this.status() === _.M.DIALOG_STATUS_INITIAL) {
            if (!_dialogs[this.id].template_instance) {
                this.getTemplate();
            }

            this.closed_by = '';
            _dialogs[this.id].status = _.M.DIALOG_STATUS_OPENED;
            this.emitEvent('open');

            return true;
        }

        return false;
    };

    /**
     * Show dialog
     */
    Dialog.prototype.hide = function () {
        if (this.isVisibling()) {
            this.emitEvent('hide');
            _dialogs[this.id].status = _.M.DIALOG_STATUS_HIDING;
        }
    };

    /**
     * Show dialog
     */
    Dialog.prototype.show = function () {
        if (this.isHiding()) {
            this.emitEvent('show');
            _dialogs[this.id].status = _.M.DIALOG_STATUS_OPENED;
        }
    };


    /**
     * Close dialog
     * Emit event:
     * - close
     * @param {boolean} force Force close dialog
     * @param {string} by close caller
     */
    Dialog.prototype.close = function (force, by) {
        if (!this.isRemoved() && (force || this.isCloseable())) {
            resetDialog(this.id);
            _dialogs[this.id].status = _.M.DIALOG_STATUS_REMOVED;
            this.closed_by = by;
            this.emitEvent('close', [force, by]);
            this.resetEvents();
        }
    };

    Dialog.prototype.closedBy = function (button) {
        if (this.isRemoved()) {
            if (!button) {
                button = '';
            }

            if (_.M.isDialogButton(button)) {
                button = button.closeKey();
            }

            if (!_.isString(button)) {
                button += '';
            }

            return this.closed_by === button;
        }

        return false;
    };

    Dialog.prototype.getDOM = function () {
        if (_dialogs[this.id].template_instance && _.M.isTemplateInstance(_dialogs[this.id].template_instance)) {
            return _dialogs[this.id].template_instance.getDOM();
        }

        return false;
    };

    _.M.Dialog = Dialog;

    /**
     * Check if object is Dialog instance
     * @param dialog
     * @returns {boolean}
     */
    _.M.isDialog = function (dialog) {
        return dialog instanceof Dialog;
    };
})(_);
(function (_) {
    var version = '1.0.0';

    _.M.defineConstant({
        BUTTON_TEMPLATE_TYPE: 'DialogButton',
        BUTTON_INFO: 'info',
        BUTTON_PRIMARY: 'primary',
        BUTTON_SUCCESS: 'success',
        BUTTON_WARNING: 'warning',
        BUTTON_ERROR: 'error'
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

    var default_options = {
        template: ''
    };

    function DialogButton(option) {
        this.type_prefix = 'dialog_button';
        _.M.EventEmitter.call(this);

        this._event_mimics = ['Dialog.toggle_enable'];

        this.options = _.extend({}, {
            name: this.id,
            label: 'Untitled',
            icon: '',
            type: _.M.BUTTON_INFO,
            size: 0,
            handler: null,
            clickable: function (button) {
                return button.isVisible() && button.isEnable() && button.getDialog().isClickable();
            }
        }, default_options);

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

        this.on('attached', function (dialog) {
            if (dialog instanceof _.M.Dialog) {
                _buttons[this.id].dialog = dialog;
            }
        });
        this.on('detached', function (dialog) {
            if (dialog instanceof _.M.Dialog) {
                _buttons[this.id].dialog = null;
            }
        });

        this.on('Dialog.toggle_enable', function (notice_data) {
            this.toggleEnable(notice_data.data);
        });

    }

    DialogButton.prototype = Object.create(_.M.EventEmitter.prototype);
    DialogButton.prototype.constructor = DialogButton;
    Object.defineProperty(DialogButton, 'version', {
        value: version
    });

    /**
     * Setup default options
     * @param option
     * @param value
     */
    DialogButton.defaultOption = function (option, value) {
        default_options = _.M.setup.apply(_.M, [default_options].concat(_.toArray(arguments)));
    };

    DialogButton.prototype.setTemplate = function (template_instance) {
        if (!_.M.isTemplateInstance(template_instance)) {
            throw new Error('Invalid Template instance');
        }

        if (_buttons[this.id].template_instance) {
            _buttons[this.id].template_instance.disconnect();
            _buttons[this.id].template_instance = null;
        }
        _buttons[this.id].template_instance = template_instance;
        template_instance.connect(this);
    };

    /**
     * Get template instance
     * @returns {null|*}
     */
    DialogButton.prototype.getTemplate = function () {
        if (!_buttons[this.id].template_instance) {
            if (!this.options.template) {
                if (default_options.template && _.M.Template.hasTemplate(_.M.BUTTON_TEMPLATE_TYPE, default_options.template)) {
                    this.options.template = default_options.template;
                } else {
                    var default_template = _.M.Template.defaultTemplate(_.M.BUTTON_TEMPLATE_TYPE);

                    if (false !== default_template) {
                        this.options.template = default_template;
                        default_options.template = default_template;
                    } else {
                        throw new Error('Dialog button default template not found');
                    }
                }
            }


            this.setTemplate(_.M.Template.templateInstance(_.M.BUTTON_TEMPLATE_TYPE, this.options.template));
        }

        return _buttons[this.id].template_instance;
    };

    DialogButton.prototype.option = function (name, value) {
        var option = _.M.asObject.apply(_.M, _.toArray(arguments));

        if (option.hasOwnProperty('template') && option.template) {
            this.setTemplate(_.M.Template.templateInstance(_.M.BUTTON_TEMPLATE_TYPE, option.template));
        }

        _.extend(this.options, _.omit(option, ['template']));

        return this;
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
            return this.options.clickable.apply(this, [this]);
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
                _.M.callFunc(this, this.options.handler, this);
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
            if (is_enable) {
                this.emitEvent('enabled');
            } else {
                this.emitEvent('disabled');
            }
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
     * Dialog close "by" key
     * @returns {string}
     */
    DialogButton.prototype.closeKey = function () {
        return 'button_' + this.options.name;
    };

    /**
     * Close dialog
     * @param force
     * @returns {boolean}
     */
    DialogButton.prototype.closeDialog = function (force) {
        var dialog = this.getDialog();

        if (dialog) {
            dialog.close(force, this.closeKey());
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
            return dialog.closedBy(this);
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

    _.each(['Ok', 'Cancel', 'Yes', 'No', 'Retry', 'Ignore'], function (label) {
        DialogButton.register(label.toLowerCase(), {
            label: label
        });
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
                return;
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
;(function (_) {

    /**
     * Return content as function which provide dynamic content via AJAX.
     * Change dialog's pending status on start complete request
     * Dialog will emit events:
     * - load_content: AJAX begin request
     * - load_content_failed: AJAX error
     * - load_content_complete: AJAX complete
     *
     * @param {Object} options _.M.AJAX options. Default options:
     * - error_content: default error content if AJAX error. 'Get dynamic content failed'
     * - loading: default loading content. 'Loading content...'.
     *
     * @returns {Function}
     */
    _.M.Dialog.dynamicContent = function (options) {
        var content = null;

        options = _.extend({
            loading: 'Loading content...'
        }, _.isObject(options) ? options : {});

        return function (update_content_cb, dialog) {
            if (!_.isNull(content)) {
                return content;
            }
            var aw = new _.M.AJAX(options);

            aw.then(function (data) {
                content = data + '';
                update_content_cb(data + '');
            });

            aw.catch(function () {
                dialog.emitEvent('load_content_failed');
                update_content_cb(options.error_content || 'Get dynamic content failed');
            });

            aw.option('beforeSend', function () {
                dialog.emitEvent('load_content');
                dialog.pending();

                return true;
            });

            aw.finally(function () {
                dialog.emitEvent('load_content_complete');
                dialog.resolved();
            });

            aw.request();

            return options.loading;
        }
    };


    function _close_dialog_handler(button) {
        var dialog = button.getDialog();

        if (dialog) {
            dialog.close(Boolean(button.options.force));
        }
    }

    _.M.DialogButton.register('close', {
        label: 'Close',
        name: 'close',
        type: 'default',
        force: false
    }, {
        handler: _close_dialog_handler
    });

    /*
     |--------------------------------------------------------------------------
     | Dialog Alert
     |--------------------------------------------------------------------------
     |
     |
     |
     */

    /**
     *
     * @param message
     * @param title
     * @param options
     * @returns {*|Dialog}
     */
    _.M.Dialog.alert = function (message, title, options) {
        options = _.extend({
            title: 'Alert',
            buttons: [_.M.DialogButton.factory('close', {
                size: 5,
                type: _.M.BUTTON_INFO
            })]
        }, _.isObject(options) ? options : {}, {
            content: message,
            title: title || 'Alert'
        });

        var dialog = new _.M.Dialog(options);

        dialog.open();

        return dialog;
    };

    /*
     |--------------------------------------------------------------------------
     | Dialog Confirm
     |--------------------------------------------------------------------------
     |
     |
     |
     */

    /**
     *
     * @param message
     * @param callback
     * @param options
     * @returns {*|Dialog}
     */
    _.M.Dialog.confirm = function (message, callback, options) {
        var dialog,
            temp_button_cb = function (btn) {
                this.getDialog().removeListener('default_button');
                this.getDialog().close();

                _.M.callFunc(null, callback, btn.options.name);
            };

        options = _.extend({
            title: 'Confirm',
            default_button: null
        }, _.isObject(options) ? options : {}, {
            content: message
        });

        if (!options.buttons) {
            options.buttons = _.M.DialogButton.factory(_.M.DIALOG_BUTTON_YES_NO);
        }

        dialog = new _.M.Dialog(_.omit(options, 'default_button'));
        _.each(dialog.buttons, function (button) {
            button.option('handler', temp_button_cb);
        });

        if (!options.default_button) {
            options.default_button = _.last(Object.keys(dialog.buttons));
        }

        //Default button
        dialog.on('close', function () {
            _.M.callFunc(null, callback, options.default_button);
        }, {
            key: 'default_button'
        });

        dialog.open();

        return dialog;
    };


    /*
     |--------------------------------------------------------------------------
     | Dialog iFrame
     |--------------------------------------------------------------------------
     |
     |
     |
     */
    /**
     *
     * @param url
     * @param title
     * @param options
     * @returns {*|Dialog}
     */
    _.M.Dialog.iFrame = function (url, title, options) {
        var dialog,
            attrs = [],
            template = [];

        options = _.extend({
            title: 'iFrame',
            attributes: {}
        }, _.isObject(options) ? options : {});

        _.each(options.attributes, function (val, key) {
            if (_.isBoolean(val)) {
                if (val) {
                    attrs.push(key + '="' + key + '"');
                }
            } else {
                attrs.push(key + '="' + val + '"');
            }
        });

        template.push('<div class="embed-responsive embed-responsive-16by9">');
        template.push('<iframe class="embed-responsive-item" src="' + url + '" ' + attrs.join(' ') + '></iframe>');
        template.push('</div>');

        options.content = template.join("\n");
        dialog = new _.M.Dialog(options);

        dialog.open();

        return dialog;
    };


    /*
     |--------------------------------------------------------------------------
     | Dialog Form
     |--------------------------------------------------------------------------
     | - Buttons: submit, close
     | - Options:
     |  + form_classes: form classes, string or array of string
     |  + message_classes: form message div classes, string or array of string. Default is "dialog_form_message"
     |  + buttons: ddd other buttons
     |  + buttons_option: object with button's name and button options
     |  + submit_button: default submit button name. Dialog will trigger callback with this button when the form is submit without button click
     |  + close_button: default close button name. Dialog will trigger callback with dialog close without button click
     |  + validator: form validator callback. Return true on valid or string for errors. If return string then dialog will show error on message div.
     |      Arguments:
     |      - form DOM
     |      - button instance
     |      - dialog instance
     |
     |
     |- Dialog data:
     |  + form_selector: form selector
     |  + form_message_selector: form message div selector
     |  + update_message: update form message. Arguments: message. If arg message fail then hide message
     |  + btn_handler: default button click handler, that valid form, show message on error and call callback.
     |      If button is close button then close dialog before call callback. Useful for custom button
     |      Arguments:
     |      - btn: button instance
     |
     |- Form callback:
     |      Arguments:
     |      - button name:
     |      - form DOM:
     |      - button instance:
     |      - dialog instance:
     |
     |
     |
     |
     |
     */
    function dialogFormContentHandler(content, dialog) {
        return ['<form><div class="dialog_form_message"></div>', content, '<input type="submit" style="display: none;"/></form>'].join('');
    }

    function classesToSelector(classes) {
        if (!_.isArray(classes)) {
            (classes + '').split(' ');
        }
        classes = _.flatten(_.M.asArray(classes));

        if (!_.isEmpty(classes)) {
            return _.map(classes, function (class_name) {
                return class_name.trim() ? '.' + class_name : '';
            }).join('');
        }

        return '';
    }

    /**
     *
     * @param {(string|function)} content
     * @param {function} callback Callback arguments: button name, form DOM, button instance, dialog instance
     * @param options
     * @returns {*|Dialog}
     */
    _.M.Dialog.form = function (content, callback, options) {
        var dialog = new _.M.Dialog(),
            btn_submit, btn_close,
            dialog_dom_id, form_selector, form_message_selector;

        options = _.extend({
            title: 'Form',
            form_classes: '',
            message_classes: 'dialog_form_message',
            validator: null,
            submit_button: 'submit',
            close_button: 'close',
            buttons_option: {}
        }, _.isObject(options) ? options : {}, {
            content: content,
            contentHandler: dialogFormContentHandler
        });

        dialog_dom_id = '#' + dialog.getTemplate().getDOMID();
        form_selector = dialog_dom_id + ' form' + classesToSelector(options.form_classes);
        form_message_selector = form_selector + ' ' + options.message_classes ? classesToSelector(options.message_classes) : '.dialog_form_message';

        function update_message(message) {
            var message_dom = $(form_message_selector);

            if (message_dom.length) {
                if (message) {
                    message_dom.html(message).show();
                } else {
                    message_dom.html('').hide();
                }
            }
        }

        function btn_handler(btn) {
            var btn_dialog = this.getDialog(),
                form = $(btn_dialog.data['form_selector']),
                validate_result = true;

            if ('close' === btn.options.name) {
                btn.closeDialog(true);
                _.M.callFunc(btn_dialog, callback, [btn.options.name, null, btn, btn_dialog]);
                return;
            }

            update_message(false);

            if (options.validator) {
                validate_result = options.validator(form, btn, btn_dialog);
            }
            if (true !== validate_result) {
                update_message(validate_result);

                return;
            }

            _.M.callFunc(btn_dialog, callback, [btn.options.name, form, btn, btn_dialog]);
        }


        if (!options.buttons) {
            options.buttons = [];
        }
        btn_submit = {
            label: 'Submit',
            name: 'submit'
        };
        btn_close = _.M.DialogButton.factory('close').options;

        if (options.buttons_option.hasOwnProperty('submit')) {
            _.extend(btn_submit, options.buttons_option.submit);
        }
        if (options.buttons_option.hasOwnProperty('close')) {
            _.extend(btn_close, options.buttons_option.close);
        }

        btn_submit.handler = btn_handler;
        btn_close.handler = btn_handler;

        options.buttons.push(btn_submit, btn_close);
        dialog.option(
            _.omit(options, ['form_classes', 'message_classes', 'validator', 'submit_button',
                'close_button', 'buttons_option'])
        );
        _.each(options.buttons, function (button) {
            dialog.attachButton(button);
        });

        dialog.data['form_selector'] = form_selector;
        dialog.data['form_message_selector'] = form_message_selector;
        dialog.data['update_message'] = update_message;
        dialog.data['btn_handler'] = btn_handler;

        function form_submit_event_listener(event) {
            event.preventDefault();

            if (options.submit_button) {
                dialog.click(options.submit_button);
            }

            return false;
        }

        dialog.on('open', function () {
            $('body').on('submit', form_selector, form_submit_event_listener);
        });
        dialog.on('close', function () {
            $('body').off('submit', form_selector, form_submit_event_listener);

            if (this.closedBy('')) {
                var default_button = options.close_button;

                if (!default_button) {
                    default_button = 'close';
                }
                if (!this.buttons.hasOwnProperty(default_button)) {
                    throw new Error('Invalid default close button');
                }

                this.buttons[default_button].click();
            }
        });


        dialog.open();

        return dialog;
    };


    /*
     |--------------------------------------------------------------------------
     | Dialog Prompt
     |--------------------------------------------------------------------------
     | - options:
     |      + value: current value
     |      + input_type: text, password,...
     |      + input_classes: class of input
     |
     | - callback: callback have 1 argument is value of prompt
     |
     */

    _.M.Dialog.prompt = function (message, callback, options) {
        var content = [],
            dialog;

        options = _.extend({
            value: '',
            input_type: 'text',
            input_classes: '',
            buttons_option: {
                submit: {
                    label: 'Ok'
                }
            }
        }, _.isObject(options) ? options : {});

        content.push('<p>', message, '</p>');
        content.push('<input name="prompt_data" type="', options.input_type + '', '" class="', options.input_classes + '', '" value="', options.value + '', '"/>');

        function prompt_cb(btn_name, form, btn, dialog) {
            var value = options.value;

            if ('submit' === btn_name) {
                value = form.find('input[name="prompt_data"]').val();
                btn.closeDialog(true);
            }

            callback(value);
        }


        dialog = _.M.Dialog.form(content.join(''), prompt_cb, options);

        dialog.open();
    }
})(_);
(function (_) {
    var version = '1.0.0';
    var default_options = {
        has_header: true,
        has_footer: true,
        close_manual: true,
        padding: true,
        overflow: 'hidden',
        buttons_align: 'right',
        pending_info: ''
    };

    var dialog_opening = 0;

    function getDialogOption(dialog) {
        var options = _.extend({}, default_options, dialog.options);

        options.buttons_align = _.M.oneOf(options.buttons_align, ['right', 'left', 'center']);

        return options;
    }

    function _section_header(self, dialog, render_data) {
        var options = getDialogOption(dialog);
        var header_color = options.type ? 'bg-' + options.type : '';

        return '<div class="modal-header ' + header_color + '">' +
            '<button type="button" class="close" onclick="' + render_data.close_func + '()"><span aria-hidden="true">&times;</span></button>' +
            '<h4 class="modal-title">' + options.title + '</h4>' +
            '</div>';
    }

    function _section_body(self, dialog, render_data) {
        var options = getDialogOption(dialog);
        var content = dialog.getContent();
        var body_styles = [];

        if (!options.padding) {
            body_styles.push('padding: 0px;');
        }
        body_styles.push('overflow: ' + options.overflow + ';');

        return '<div class="modal-body" style="' + body_styles.join(' ') + '">' +
            content +
            '</div>';
    }

    function _section_footer(self, dialog, render_data) {
        var options = getDialogOption(dialog);

        var buttons = [];
        var template = '<div class="modal-footer" style="text-align: ' + options.buttons_align + ';">';
        var pending_info = '<span class="dialog-pending-info text-muted pull-' + (options.buttons_align == 'left' ? 'right' : 'left') + '">' + options.pending_info + '</span>&nbsp;&nbsp;';

        _.each(dialog.buttons, function (button) {
            buttons.push(button.render());
        });

        template += buttons.join("\n") + pending_info;
        template += '</div>';

        return template;
    }

    function _layout(self, dialog, render_data) {
        var option = getDialogOption(dialog);
        var size_class_map = {large: 'lg', small: 'sm'};
        var size = '';
        var layout = '<div class="modal fade" tabindex="-1" role="dialog" id="<%= dom_id %>" data-dialog-id="' + dialog.id + '" data-draw="<%- draw %>" data-template-id="' + self.id + '">';


        if (size_class_map.hasOwnProperty(option.size)) {
            size = 'modal-' + size_class_map[option.size];
        }

        layout += '<div class="modal-dialog ' + size + '">' +
            '<div class="modal-content">';

        if (option.has_header) {
            layout += '<%= header %>';
        }

        layout += '<%= body %>';

        if (option.has_footer) {
            layout += '<%= footer %>';
        }

        layout += '</div></div></div>';

        return layout;
    }

    function getModalOption(close_manual) {
        return {
            backdrop: close_manual ? 'static' : true,
            keyboard: !close_manual
        }
    }

    function _open_dialog() {

        var options = getDialogOption(this.getDialog()),
            modal_options = getModalOption(options.close_manual),
            dialog = this.getDialog(),
            data = {};


        data['close_func'] = _.M.WAITER.createFunc(function () {
            this.getDialog().close();
        }.bind(this), false, 'Modal: ' + dialog.id + ' >>> Header close button');
        this.waiter_keys.push(data['close_func']);

        var template = this.render(data);

        $('body').append(template);
        console.log('Template dialog open');
        this.getDOM().modal(modal_options);

        this.getDOM().on('show.bs.modal', function (event) {
            if (event.target.is(this.getDOM())) {
                this.emitEvent('show');
            }
        }.bind(this));
        this.getDOM().on('shown.bs.modal', function (event) {
            if (event.target.is(this.getDOM())) {
                this.emitEvent('shown');
            }
        }.bind(this));
        this.getDOM().on('hide.bs.modal', function (event) {
            if (event.target.is(this.getDOM())) {
                this.emitEvent('hide');
            }
        }.bind(this));
        this.getDOM().on('hidden.bs.modal', function (event) {
            if (event.target.is(this.getDOM())) {
                this.emitEvent('hidden');
                this.getDialog().close();
            }
        }.bind(this));

    }

    function update_dialog_close_status() {
        var closeable = this.getDialog().isCloseable();
        var modal_dom = this.getDOM();

        modal_dom.find('.modal-header .close').toggleClass('hide', !closeable);

    }

    function Bootstrap() {
        this.type_prefix = 'template_dialog_bootstrap';
        _.M.Template.call(this);

        this.waiter_keys = [];

        this.section('header', _section_header);
        this.section('body', _section_body);
        this.section('footer', _section_footer);

        this.setLayout(_layout);

        this.on('Dialog.open', _open_dialog.bind(this));
        this.on('Dialog.toggle_enable', update_dialog_close_status.bind(this));


        this.on('Dialog.close', function () {

            _.M.WAITER.remove(this.waiter_keys);
            this.waiter_keys = [];
            this.getDOM().modal('hide');
            this.getDOM().remove();

            //Fix modal-open class on body
            dialog_opening = Math.max(0, dialog_opening--);
            $('body').toggleClass('modal-open', dialog_opening > 0);
            if (dialog_opening == 0) {
                $('body .modal-backdrop').remove();
            }
        });
        this.on('Dialog.hide', function () {
            this.getDOM().hide();
            $('body .modal-backdrop').hide();
        });
        this.on('Dialog.show', function () {
            this.getDOM().show();
            $('body .modal-backdrop').show();
        });
        this.on('Dialog.update_content', function (new_content) {
            if (this.getDialog().isOpened()) {
                this.updateContent(new_content);
            }
        });

    }

    Bootstrap.prototype = Object.create(_.M.Template.prototype);
    Bootstrap.prototype.constructor = Bootstrap;
    Object.defineProperty(Bootstrap, 'version', {
        value: version
    });

    /**
     *
     * @returns {null|*|Object|_.M.EventEmitter|_.M.Dialog}
     */
    Bootstrap.prototype.getDialog = function () {
        return this.dataSource;
    };

    Bootstrap.prototype.updateContent = function (new_content) {
        var options = getDialogOption(this.getDialog());

        if (!new_content) {
            new_content = options.content;
        }

        this.getDOM().find('.modal-body').html(new_content);
    };

    Bootstrap.prototype.updatePendingInfo = function (info) {
        this.getDOM().find('.dialog-pending-info').html(info);
    };


    _.M.Template.register(_.M.DIALOG_TEMPLATE_TYPE, 'Bootstrap', Bootstrap);
})(_);
(function (_) {
    var version = '1.0.0';
    var default_options = {
        icon_class: 'dialog_button_icon',
        label_class: 'dialog_button_label'
    };

    function getButtonOption(button) {
        return _.extend({}, default_options, button.options);
    }


    function _section_icon(self, button, render_data) {
        var options = getButtonOption(button);

        if (options.icon) {
            return '<span class="' + options.icon_class + '"><i class="' + options.icon + '"></i></span>&nbsp;&nbsp;';
        }
        return '';
    }

    function _section_label(self, button, render_data) {
        var options = getButtonOption(button);

        return '<span class="' + options.label_class + '">' + options.label + '</span>';
    }

    function _layout(self, button, render_data) {
        var options = getButtonOption(button);
        var padding_space = _.M.repeat('&nbsp;', _.M.minMax(options.size, 0, 10)),
            template = '',
            style = [];

        if (!button.isVisible()) {
            style.push('display: none');
        }

        template += '<button type="button" id="<%= dom_id %>" data-button-id="' + button.id + '"';
        template += 'data-draw="<%- draw %>" data-template-id="' + self.id + '" style="' + style.join('; ') + '"';
        template += 'class="btn btn-' + options.type + '" data-name="' + options.name + '" ';
        template += 'onclick="' + self.click_key + '()"';

        if (!button.isEnable()) {
            template += ' disabled="disabled"';
        }

        template += '>';
        template += padding_space + '<%= icon %><%= label %>' + padding_space + '</button>';

        return template;
    }


    function Bootstrap() {
        this.type_prefix = 'template_dialog_button_bootstrap';
        _.M.Template.call(this);

        var self = this;

        this.section('icon', _section_icon);
        this.section('label', _section_label);

        this.setLayout(_layout);

        this.click_key = _.M.WAITER.createFunc(function () {
            self.getButton().click();
        }, false);


        this.on('DialogButton.toggle', function (noticed_data) {
            this.getDOM().toggle(noticed_data.data);
        });
        this.on('DialogButton.toggle_enable', function (noticed_data) {
            if (noticed_data.data) {
                this.getDOM().removeAttr('disabled');
            } else {
                this.getDOM().attr('disabled', 'disabled');
            }
            this.getDOM().prop('disabled', !noticed_data.data);
        });

    }

    Bootstrap.prototype = Object.create(_.M.Template.prototype);
    Bootstrap.prototype.constructor = Bootstrap;
    Object.defineProperty(Bootstrap, 'version', {
        value: version
    });

    /**
     *
     * @returns {null|*|Object|_.M.EventEmitter|_.M.Dialog}
     */
    Bootstrap.prototype.getButton = function () {
        return this.dataSource;
    };

    Bootstrap.prototype.updateLabel = function (label) {
        var options = getButtonOption(this.getButton());

        this.getDOM().find('.' + options.label_class).html(label);
    };

    Bootstrap.prototype.updateIcon = function (icon) {
        var options = getButtonOption(this.getButton());

        this.getDOM().find('.' + options.icon_class).html('<i class="' + icon + '"></i>');
    };


    _.M.Template.register(_.M.BUTTON_TEMPLATE_TYPE, 'Bootstrap', Bootstrap);
})(_);