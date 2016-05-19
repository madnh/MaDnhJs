;(function (_) {
    _.M.defineConstant({
        DIALOG_DYNAMIC_CONTENT_PRE_OPTIONS_NAME: '_.M.Dialog.dynamicContent'
    });
    _.M.PreOptions.define(_.M.DIALOG_DYNAMIC_CONTENT_PRE_OPTIONS_NAME, {
        loading: 'Loading content...'
    });
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

        options = _.M.PreOptions.get(_.M.DIALOG_DYNAMIC_CONTENT_PRE_OPTIONS_NAME, options);

        return function (update_content_cb, dialog) {
            if (!_.isNull(content)) {
                return content;
            }
            var aw = new _.M.AJAX(options);

            aw.done(function (response) {
                content = response + '';
                update_content_cb(content);
            });

            aw.fail(function () {
                dialog.emitEvent('load_content_failed');
                update_content_cb(options.error_content || 'Get dynamic content failed');
            });

            aw.option('before_send', function () {
                dialog.emitEvent('load_content');
                dialog.pending();

                return true;
            });

            aw.always(function () {
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
        type: 'info',
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
    _.M.defineConstant({
        DIALOG_CONFIRM_PRE_OPTIONS_NAME: '_.M.Dialog.confirm'
    });
    _.M.PreOptions.define(_.M.DIALOG_CONFIRM_PRE_OPTIONS_NAME, {
        title: 'Confirm',
        default_button: null
    });
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

                _.M.callFunc(callback, btn.options.name, null);
            };

        options = _.extend(_.M.PreOptions.get(_.M.DIALOG_CONFIRM_PRE_OPTIONS_NAME, options), {
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
            _.M.callFunc(callback, options.default_button, null);
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
    _.M.defineConstant({
        DIALOG_IFRAME_PRE_OPTIONS_NAME: '_.M.Dialog.iFrame'
    });
    _.M.PreOptions.define(_.M.DIALOG_IFRAME_PRE_OPTIONS_NAME, {
        title: 'iFrame',
        attributes: {}
    });
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

        options = _.M.PreOptions.get(_.M.DIALOG_IFRAME_PRE_OPTIONS_NAME, options);

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
    _.M.defineConstant({
        DIALOG_FORM_PRE_OPTIONS_NAME: '_.M.Dialog.form'
    });
    _.M.PreOptions.define(_.M.DIALOG_FORM_PRE_OPTIONS_NAME, {
        title: 'Form',
        form_classes: '',
        message_classes: 'dialog_form_message',
        validator: null,
        submit_button: 'submit',
        close_button: 'close',
        buttons_option: {}
    });

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

        options = _.extend(_.M.PreOptions.get(_.M.DIALOG_FORM_PRE_OPTIONS_NAME, options), {
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
                _.M.callFunc(callback, [btn.options.name, null, btn, btn_dialog], btn_dialog);
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

            _.M.callFunc(callback, [btn.options.name, form, btn, btn_dialog], btn_dialog);
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
    _.M.defineConstant({
        DIALOG_PROMPT_PRE_OPTIONS_NAME: '_.M.Dialog.prompt'
    });
    _.M.PreOptions.define(_.M.DIALOG_PROMPT_PRE_OPTIONS_NAME, {
        title: 'Prompt',
        value: '',
        placeholder: '',
        input_type: 'text',
        input_classes: 'form-control',
        buttons_option: {
            submit: {
                label: 'Ok'
            }
        }
    });

    _.M.Dialog.prompt = function (message, callback, options) {
        var content = [],
            dialog;

        options = _.M.PreOptions.get(_.M.DIALOG_PROMPT_PRE_OPTIONS_NAME, options);

        content.push('<p>', message, '</p>');
        content.push('<input name="prompt_data" type="', options.input_type + '" ',
            'class="', options.input_classes + '" ',
            'value="', options.value + '"',
            'placeholder="',options.placeholder + '"',
            '/>');

        function prompt_cb(btn_name, form, btn, dialog) {
            var value = options.value;

            if ('submit' === btn_name) {
                value = form.find('input[name="prompt_data"]').val();
                btn.closeDialog(true);
            }

            callback(value);
        }


        dialog = _.M.Dialog.form(content.join(''), prompt_cb, _.omit(options, 'value', 'placeholder', 'input_type', 'input_classes'));

        dialog.open();
    }
})(_);