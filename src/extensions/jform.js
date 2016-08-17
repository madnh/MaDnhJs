;(function (_) {
    var version = '1.0.0';
    var jForm = {};

    function _is_checked_value(value) {
        return -1 !== [true, 'true', 'on', 1, '1'].indexOf(value);
    }


    Object.defineProperty(jForm, 'version', {
        value: version
    });

    jForm.disable = function (selector) {
        $(selector).attr('disabled', 'disabled').prop('disabled', true);
    };

    jForm.enable = function (selector) {
        $(selector).removeAttr('disabled').prop('disabled', false);
    };


    jForm.getSelectOptionTagByValue = function (name, values, container) {
        var queries = _.map(_.M.beArray(values), function (value) {
            return 'option[value="' + value + '"]';
        });

        return $(container || 'body').find('select[name="' + name + '"]').first().find(queries.join(', '));
    };

    jForm.setSelectTagValue = function (name, values, container) {
        $(container || 'body').find('select[name="' + name + '"]').val(_.M.beArray(values));
    };

    jForm.removeSelectOptionTags = function (name, values, container) {
        this.getSelectOptionTagByValue(name, values, container).remove();
    };

    jForm.disableSelectOptionTags = function (name, values, container) {
        this.getSelectOptionTagByValue(name, values, container).attr('disabled', 'disabled').prop('disabled', true);
    };
    jForm.enableSelectOptionTags = function (name, values, container) {
        this.getSelectOptionTagByValue(name, values, container).removeAttr('disabled', 'disabled').prop('disabled', false);
    };
    jForm.setRadioTagValue = function (name, value, container) {
        container = $(container || 'body');

        container.find("input:radio[name='" + name + "']:checked").prop('checked', false).removeAttr('checked');
        container.find("input:radio[name='" + name + "'][value=" + value + "]").prop('checked', true).attr('checked', 'checked');
    };

    jForm.getRadioTagValue = function (name, container) {
        return $(container || 'body').find("input:radio[name ='" + name + "']:checked").first().val();
    };


    jForm.setCheckBoxStatus = function (selector, is_checked) {
        var checkbox = $(selector);
        checkbox.prop('checked', is_checked);

        if (is_checked) {
            checkbox.attr('checked', 'checked');
        } else {
            checkbox.removeAttr('checked');
        }
    };

    jForm.getCheckboxTagsByValue = function (name, values, container) {
        var queries = _.map(_.M.beArray(values), function (value) {
            return 'input[type="checkbox"][name="' + name + '"][value="' + value + '"]';
        });

        return $(container || 'body').find(queries.join(', '));
    };

    jForm.setCheckBoxValue = function (name, values, container) {
        container = $(container || 'body');

        var checkboxes = container.find('input[type="checkbox"][name="' + name + '"]');


        if (checkboxes.length === 1 && (_.M.isLikeString(values) || _.isBoolean(values))) {
            if (_is_checked_value(values)) {
                checkboxes.attr('checked', 'checked').prop('checked', true);
            } else {
                checkboxes.removeAttr('checked').prop('checked', false);
            }

            return;
        }

        checkboxes.removeAttr('checked').prop('checked', false);
        jForm.getCheckboxTagsByValue(name, values, container).attr('checked', 'checked').prop('checked', true);
    };
    function get_input_name_as_deep(name) {
        return name.replace(/]/g, '').replace(/\[/g, '.');
    }
    function parser_element_value(element, container, result) {
        if (!element.attr('name')) {
            return;
        }

        var name = element.attr('name');
        var name_as_deep = get_input_name_as_deep(name);
        var value = element.val();

        if (element.attr('type') === 'checkbox') {
            if(element.is(':checked')){
                var checkbox_value = value.length ? value : true;

                if (container.find('input[name="' + name + '"]').length > 1) {
                    if (element.is(':checked')) {
                        try{
                            _.M.appendDeep(result, name_as_deep, checkbox_value);
                        }catch (ex){
                            _.M.defineDeep(result, name_as_deep, [checkbox_value]);
                        }
                    }
                } else {
                    if(_.isBoolean(checkbox_value)){
                        _.M.defineDeep(result, name_as_deep, 'on');
                    } else {
                        _.M.defineDeep(result, name_as_deep + '.' + checkbox_value, 'on');
                    }
                }
            }
        } else {
            _.M.defineDeep(result, name_as_deep, value);
        }
    }

    /**
     *
     * @param {string} form
     * @returns {{}}
     */
    jForm.getFormValue = function (form) {
        var elements = $(form).find('input:not(input[type="radio"]), textarea, select, input[type="radio"]:checked');
        var result = {};

        elements.each(function () {
            parser_element_value($(this), form, result);
        });

        return result;
    };


    /**
     * Assign data to form
     * @param form
     * @param data
     * @param prefix
     * @returns {boolean}
     */
    jForm.assignFormValue = function (form, data, prefix) {
        form = $(form);

        if (!form.length) {
            return false;
        }

        if (!_.isString(prefix) || _.isEmpty(prefix)) {
            prefix = "";
        }
        _.each(data, function (value, key) {
            var key_with_prefix = prefix + key;
            var elements = form.find('*[name="' + key_with_prefix + '"]');

            if (elements.length) {
                var first_element = elements.first();

                if (first_element.is('input') || first_element.is('textarea')) {
                    if (first_element.is(':radio')) {
                        jForm.setRadioTagValue(key_with_prefix, value, form);
                    } else if (first_element.is(':checkbox')) {
                        jForm.setCheckBoxValue(key_with_prefix, value, form);
                    } else {
                        first_element.val(value);
                    }
                } else if (first_element.is('select')) {
                    jForm.setSelectTagValue(key_with_prefix, value, form);
                } else if (first_element.is('a, button')) {
                    first_element.html(value);
                }
            }
        });

        return true;
    };

    _.M.jForm = jForm;
})(_);