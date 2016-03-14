/***************************************************************************
 *   JFORM - UnderscoreJS extension                                         *
 *   Version: 0.1.0                                                         *
 *   Author: Do Danh Manh                                                   *
 *   Email: dodanhmanh@gmail.com                                            *
 *                                                                          *
 ***************************************************************************/


(function (_) {
    var thisModule = {};

    thisModule.disable = function (selector) {
        $(selector).attr('disabled', 'disabled').prop('disabled', true);
    };

    thisModule.enable = function (selector) {
        $(selector).removeAttr('disabled').prop('disabled', false);
    };


    thisModule.getSelectOptions = function (selector, values) {
        var select = $(selector);

        if (_.isArray(values)) {
            values = _.map(values, function (value) {
                return 'option[value="' + value + '"]';
            });
            return select.find(values.join(', '));
        }
        return select.find('option[value="' + values + '"]');
    };

    thisModule.setSelectValue = function (selector, values, unselectOther) {
        if (unselectOther) {
            $(selector + ' option').prop('selected', false).removeAttr('selected');
        }
        this.getSelectOptions(selector, values).prop('selected', true).attr('selected', 'selected');
    };

    thisModule.selectRemoveOption = function (selector, values) {
        this.getSelectOptions(selector, values).remove();
    };

    thisModule.selectDisableOptions = function (selector, values) {
        this.getSelectOptions(selector, values).attr('disabled', 'disabled').prop('disabled', true);
    };
    thisModule.selectEnableOption = function (selector, values) {
        this.getSelectOptions(selector, values).removeAttr('disabled', 'disabled').prop('disabled', false);
    };
    thisModule.checkRadio = function (radio_name, value) {
        $("input:radio[name='" + radio_name + "']:checked").prop('checked', false).removeAttr('checked');
        $("input:radio[name='" + radio_name + "'][value=" + value + "]").prop('checked', true).attr('checked', 'checked');
    };
    thisModule.getRadioValue = function (radio_name) {
        return $("input:radio[name ='" + radio_name + "']:checked").val();
    };


    thisModule.setCheckBoxStatus = function (selector, status) {
        var checkbox = $(selector);
        checkbox.prop('checked', status);
        if (status) {
            checkbox.attr('checked', 'checked');
        } else {
            checkbox.removeAttr('checked');
        }
    };


    /**
     * Get form value
     * @param {string} form_selector
     * @returns {{}}
     */
    thisModule.getFormInputValue = function (form_selector) {
        var form = $(form_selector);
        var elements = form.find('input:not(input[type="radio"]), textarea, select, input[type="radio"]:checked');
        var result = {};
        elements.each(function () {
            var element = $(this);
            if (element.attr('type') === 'checkbox') {
                var checkboxName = element.attr('name');
                var checkBoxValue = element.is(':checked') ? (element.val() ? element.val() : true) : false;
                if (form.find('input[type="checkbox"][name="' + checkboxName + '"]').length > 1) {
                    if (element.is(':checked')) {
                        if (_.isUndefined(result[checkboxName])) {
                            result[checkboxName] = [];
                        }
                        result[checkboxName].push(checkBoxValue);
                    }
                } else {
                    result[checkboxName] = checkBoxValue;
                }
            } else {
                if (element.attr('name')) {
                    result[element.attr('name')] = element.val();
                }
            }
        });

        return result;
    };

    /**
     * Get form value
     * @param form_selector
     * @returns {*}
     */
    thisModule.formSerialize = function (form_selector) {
        var form = $(form_selector).first();
        var result = {};
        if (form) {
            var serialized = form.serializeArray();
            _.each(serialized, function (obj) {
                if (_.has(result, obj['name'])) {
                    if (_.isArray(result[obj['name']])) {
                        result[obj['name']].push(obj['value']);
                    } else {
                        result[obj['name']] = [result[obj['name']], obj['value']];
                    }
                } else {
                    result[obj['name']] = obj['value'];
                }
            });
            return result;
        }
        return false;
    };

    /**
     * Assign data to form
     * @param form
     * @param data
     * @param prefix
     * @returns {boolean}
     */
    thisModule.assignFormData = function (form, data, prefix) {
        if (_.isString(form)) {
            form = $(form);
        }

        if (form.length < 1) {
            return false;
        }
        if (!_.isString(prefix) || _.isEmpty(prefix)) {
            prefix = "";
        }
        _.each(data, function (value, key, data) {
            if (form.find('*[name="' + prefix + key + '"]').length) {
                var $this = form.find('*[name="' + prefix + key + '"]').first();
                if ($this.is('input') || $this.is('textarea')) {
                    if ($this.is(':radio') && [false, 'off', '', 0, '0'].indexOf(value) == -1) {
                        form.find('*[name="' + prefix + key + '"][value="' + value + '"]').first().prop('checked', true);
                    } else if ($this.is(':checkbox') && [false, 'off', '', 0, '0'].indexOf(value) == -1) {
                        value = _.M.asArray(value);
                        _.each(value, function (tmpValue) {
                            form.find('*[name="' + prefix + key + '"][value="' + tmpValue + '"]').prop('checked', true);
                        });
                    } else {
                        $this.val(value);
                    }
                } else if ($this.is('select')) {
                    $this.find('option').prop('selected', false);
                    if (_.isArray(value)) {
                        $this.find(_.map(value, function (tmp_value) {
                            return 'option[value="' + tmp_value + '"]';
                        }).join(', ')).prop('selected', true).attr('selected', 'selected');
                    } else {
                        $this.find('option[value="' + value + '"]').first().prop('selected', true).attr('selected', 'selected');
                    }
                } else if ($this.is('a, button')) {
                    $this.html(value);
                }
            }
        });

        return true;
    };


    _.module('JFORM', thisModule);
})(_);