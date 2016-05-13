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

        this.setSection('icon', _section_icon);
        this.setSection('label', _section_label);

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