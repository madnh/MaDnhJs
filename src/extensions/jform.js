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
        var queries = _.map(_.M.asArray(values), function (value) {
            return 'option[value="' + value + '"]';
        });

        return $(container || 'body').find('select[name="' + name + '"]').first().find(queries.join(', '));
    };

    jForm.setSelectTagValue = function (name, values, container) {
        $(container || 'body').find('select[name="' + name + '"]').val(_.M.asArray(values));
    };

    jForm.removeSelectOptionTags = function (selector, values) {
        this.getSelectOptionTagByValue(selector, values).remove();
    };

    jForm.disableSelectOptionTags = function (selector, values) {
        this.getSelectOptionTagByValue(selector, values).attr('disabled', 'disabled').prop('disabled', true);
    };
    jForm.enableSelectOptionTags = function (selector, values) {
        this.getSelectOptionTagByValue(selector, values).removeAttr('disabled', 'disabled').prop('disabled', false);
    };
    jForm.setRadioTagValue = function (name, value, container) {
        container = $(container || 'body');

        container.find("input:radio[name='" + name + "']:checked").prop('checked', false).removeAttr('checked');
        container.find("input:radio[name='" + name + "'][value=" + value + "]").prop('checked', true).attr('checked', 'checked');
    };

    jForm.getRadioTagValue = function (radio_name, container) {
        return $(container || 'body').find("input:radio[name ='" + radio_name + "']:checked").first().val();
    };


    jForm.setCheckBoxStatus = function (selector, status) {
        var checkbox = $(selector);
        checkbox.prop('checked', status);

        if (status) {
            checkbox.attr('checked', 'checked');
        } else {
            checkbox.removeAttr('checked');
        }
    };

    jForm.getCheckboxTagsByValue = function (name, values, container) {
        var queries = _.map(_.M.asArray(values), function (value) {
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

    function parser_element_value(element, container, result) {
        if (!element.attr('name')) {
            return;
        }

        if (element.attr('type') === 'checkbox') {
            var checkbox_name = element.attr('name');
            var checkbox_value = element.is(':checked') ? (element.val() ? element.val() : true) : false;

            if (container.find('input[type="checkbox"][name="' + checkbox_name + '"]').length > 1) {
                if (element.is(':checked')) {
                    if (_.isUndefined(result[checkbox_name])) {
                        result[checkbox_name] = [];
                    }
                    result[checkbox_name].push(checkbox_value);
                }
            } else {
                result[checkbox_name] = checkbox_value;
            }
        } else {
            result[element.attr('name')] = element.val();
        }
    }

    /**
     * Get form value
     * @param {string} form_selector
     * @returns {{}}
     */
    jForm.getFormInputValue = function (form_selector) {
        var form = $(form_selector);
        var elements = form.find('input:not(input[type="radio"]), textarea, select, input[type="radio"]:checked');
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
    jForm.assignFormData = function (form, data, prefix) {
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