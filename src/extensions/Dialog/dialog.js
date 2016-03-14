(function (_) {

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