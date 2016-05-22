/*
 |--------------------------------------------------------------------------
 | Dynamic content
 |--------------------------------------------------------------------------
 |
 |
 |
 |
 */
;(function (_) {
    _.M.defineConstant({
        DIALOG_DYNAMIC_CONTENT_PRE_OPTIONS_NAME: '_.M.Dialog.DynamicContent'
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
            var aw = new _.M.AJAX(_.omit(options, 'loading'));

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
})(_);

/*
 |--------------------------------------------------------------------------
 | Closeable button
 |--------------------------------------------------------------------------
 |
 |
 |
 |
 */

;(function (_) {
    function _close_dialog_handler(button) {
        var dialog = button.getDialog();

        if (dialog) {
            button.closeDialog(Boolean(button.options.force));
        }
    }

    _.M.DialogButton.register('close', {
        label: 'Close',
        type: _.M.BUTTON_INFO,
        force: false
    }, {
        handler: _close_dialog_handler
    });
})(_);

/*
 |--------------------------------------------------------------------------
 | Dialog Alert
 |--------------------------------------------------------------------------
 |
 | 
 | 
 | 
 */

;(function (_) {
    _.M.defineConstant({
        DIALOG_ALERT_PRE_OPTIONS_NAME: '_.M.Dialog.Alert'
    });
    _.M.PreOptions.define(_.M.DIALOG_ALERT_PRE_OPTIONS_NAME, {
        title: 'Alert',
        button: {}
    });

    /**
     *
     * @param message
     * @param title
     * @param options
     * @returns {*|Dialog}
     */
    _.M.Dialog.alert = function (message, options) {
        options = _.extend(_.M.PreOptions.get(_.M.DIALOG_ALERT_PRE_OPTIONS_NAME, options), {
            content: message
        });

        var dialog = new _.M.Dialog(_.omit(options, 'button'));

        dialog.attachButton(_.M.DialogButton.factory('close', options.button));

        dialog.open();

        return dialog;
    };
})(_);

/*
 |--------------------------------------------------------------------------
 | Dialog Confirm
 |--------------------------------------------------------------------------
 |
 |
 |
 */
;(function (_) {
    _.M.defineConstant({
        DIALOG_CONFIRM_PRE_OPTIONS_NAME: '_.M.Dialog.Confirm'
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
        var dialog;

        options = _.extend(_.M.PreOptions.get(_.M.DIALOG_CONFIRM_PRE_OPTIONS_NAME, options), {
            content: message
        });

        if (_.isEmpty(options.buttons)) {
            options.buttons = _.M.DialogButton.factory(_.M.DIALOG_BUTTON_YES_NO);
        }

        dialog = new _.M.Dialog(_.omit(options, 'default_button'));

        _.each(dialog.buttons, function (button) {
            button.setHandler(function () {
                this.closeDialog();
                callback(this.options.name);
            });
        });

        if (!options.default_button) {
            options.default_button = _.last(Object.keys(dialog.buttons));
        }

        //Default button
        dialog.on('closed', function () {
            if (!this.closed_by) {
                _.M.callFunc(callback, options.default_button, null);
            }
        }, {
            key: 'default_button'
        });

        dialog.open();

        return dialog;
    };
})(_);

/*
 |--------------------------------------------------------------------------
 | Dialog iFrame
 |--------------------------------------------------------------------------
 |
 |
 |
 */
;(function (_) {
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
     * @param options
     * @returns {*|Dialog}
     */
    _.M.Dialog.iFrame = function (url, options) {
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

})(_);

/*
 |--------------------------------------------------------------------------
 | Dialog Form
 |--------------------------------------------------------------------------
 | - Buttons: submit, close
 | - Options:
 |  + form_classes: form classes, string or array of string
 |  + message_classes: form message div classes, string or array of string. Default is "dialog_form_message"
 |  + buttons: add other buttons
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
;(function (_) {
    _.M.DialogButton.register('submit', {
        label: 'Submit'
    }, {
        name: 'submit'
    });

    _.M.defineConstant({
        BUTTON_SUBMIT: 'submit',
        DIALOG_BUTTON_SUBMIT_CANCEL: ['submit', 'cancel']
    });

    _.M.defineConstant({
        DIALOG_FORM_PRE_OPTIONS_NAME: '_.M.Dialog.Form'
    });
    _.M.PreOptions.define(_.M.DIALOG_FORM_PRE_OPTIONS_NAME, {
        title: 'Form',
        form_classes: '',
        message_classes: 'dialog_form_message',
        validator: null,
        submit_button_name: 'submit',
        cancel_button_name: 'cancel',
        buttons: [],
        buttons_extend_options: {}
    });

    /**
     *
     * @param {(string|function)} content
     * @param {function} callback Callback arguments: button name, form DOM, button instance, dialog instance
     * @param options
     * @returns {*|Dialog}
     */
    _.M.Dialog.form = function (content, callback, options) {
        var dialog = new _.M.Dialog();

        options = _.extend(_.M.PreOptions.get(_.M.DIALOG_FORM_PRE_OPTIONS_NAME, options), {
            content: content,
            content_handler: dialogFormContentHandler
        });

        if (_.isEmpty(options.buttons)) {
            options.buttons = _.M.DialogButton.factory(_.M.DIALOG_BUTTON_SUBMIT_CANCEL, {}, {
                cancel: {
                    handler: createCancelButtonHandler(callback)
                },
                submit: {
                    handler: createButtonsHandler(callback, options)
                }
            });
        }

        dialog.option(
            _.omit(options, ['form_classes', 'message_classes', 'validator', 'submit_button_name',
                'cancel_button_name', 'buttons', 'buttons_extend_options'])
        );

        _.each(options.buttons, function (button) {
            var attached_button = dialog.attachButton(button);

            if (options.buttons_extend_options.hasOwnProperty(attached_button.options.name)) {
                attached_button.option(_.clone(options.buttons_extend_options[attached_button.options.name]));
            }
        });

        addDialogData(dialog, options);
        addDialogMethods(dialog, options);
        addDialogEvents(dialog, options);
        dialog.open();

        return dialog;
    };

    function dialogFormContentHandler(content) {
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

    function updateFormMessage(dialog, message) {
        var message_dom = $(dialog.data['form_selector'] + ' ' + dialog.data['form_message_selector']);

        if (message_dom.length) {
            if (message) {
                message_dom.html(message).show();
            } else {
                message_dom.html('').hide();
            }
        }
    }

    function addDialogData(dialog, options) {
        var dialog_dom_id = '#' + dialog.getTemplate().getDOMID();
        var form_selector = dialog_dom_id + ' form' + classesToSelector(options.form_classes);
        var form_message_selector = form_selector + ' ' + options.message_classes ? classesToSelector(options.message_classes) : '.dialog_form_message';

        dialog.data['form_selector'] = form_selector;
        dialog.data['form_message_selector'] = form_message_selector;
    }

    function addDialogMethods(dialog) {
        dialog.getFormDOM = function () {
            return $(dialog.data['form_selector']);
        };

        dialog.updateFormMessage = function (message) {
            updateFormMessage(dialog, message);
        };

        dialog.clearFormMessage = function () {
            updateFormMessage(dialog, false);
        };
    }

    function addDialogEvents(dialog, options) {
        dialog.on('open', function () {
            $('body').on('submit', this.data['form_selector'], form_submit_event_listener);
        });

        dialog.on('closed', function () {
            if (!this.closed_by && options.cancel_button_name) {
                if (!this.hasButton(options.cancel_button_name)) {
                    throw new Error('Invalid default button');
                }

                this.buttons[options.cancel_button_name].click();
            }
        }, {
            key: 'default_close_button'
        });

        dialog.on('closed', function () {
            $('body').off('submit', this.data['form_selector'], form_submit_event_listener);
        });
    }

    function form_submit_event_listener(event) {
        event.preventDefault();

        if (options.submit_button_name) {
            dialog.click(options.submit_button_name);
        }

        return false;
    }

    function createCancelButtonHandler(callback) {
        return function (button) {
            var dialog = button.getDialog();

            button.closeDialog(true);
            _.M.callFunc(callback, [button.options.name, null, button, dialog], dialog);
        }
    }

    function createButtonsHandler(callback, options) {
        return function (button) {
            var dialog_instance = this.getDialog(),
                form = $(dialog_instance.data['form_selector']),
                validate_result = true;

            updateFormMessage(dialog_instance, false);

            if (options.validator) {
                validate_result = options.validator(form, button, dialog_instance);
            }
            if (true !== validate_result) {
                updateFormMessage(dialog_instance, validate_result);

                return;
            }

            _.M.callFunc(callback, [button.options.name, form, button, dialog_instance], dialog_instance);
        }
    }
})(_);

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
;(function (_) {
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
            'placeholder="', options.placeholder + '"',
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